// common/recordManager.js —— 记录管理公共模块
import { preloadScreenshot, loadHtml2Canvas, showLoading, hideLoading, showScreenshotError } from './screenshot.js';
import { escapeHtml } from './utils.js';
import { showPrompt, showConfirm, showAlert } from './dialog.js';

/**
 * 创建记录管理器
 * @param {Object} config
 * @param {string} config.storageKey - localStorage 键名
 * @param {boolean} [config.supportsTauri] - 是否支持 Tauri 文件存储
 * @param {string} [config.recordNamePrefix] - prompt 默认名前缀
 * @param {number} [config.recordNameMaxLen]
 * @param {Function} config.getDamageDisplay - (rec) => HTML字符串，记录卡上的伤害文字
 * @param {Function} config.getDamageShort - (rec) => 纯文本，对比表中的伤害值
 * @param {Function} config.getCurrentConfig - () => 配置对象
 * @param {Function} config.applyConfig - (config) => 恢复到计算器
 * @param {Function} config.getDamageSnapshot - () => 当前伤害值(数字或对象)
 * @param {Object} config.fieldMeta - 字段元数据 { [key]: { name, zone, unit } }
 * @param {Function} config.formatFieldValue - (key, value) => 显示文本
 * @param {Function} config.isFieldEmptyValue - (key, value) => boolean
 * @param {Array} config.zoneOrder - 区间排序列表
 * @param {Array} config.compareCustomTypes - [{ key, zone, title }] 自定义条目类型
 * @param {string} config.compareDamageLabel - 对比表伤害行标签
 * @param {string} config.screenshotFileName - 截图文件名前缀
 * @param {string} [config.screenshotLoadingText]
 * @param {string} [config.clearConfirmText]
 * @param {string} config.saveBtnId
 * @param {string} config.queryBtnId
 * @param {string} config.clearBtnId
 * @param {string} [config.modalId] - 默认为 'recordModal'
 * @param {string} [config.recordsListId] - 默认为 'recordsListArea'
 * @param {string} [config.compareAreaId] - 默认为 'compareArea'
 */
export function createRecordManager(config) {
    const {
        storageKey,
        supportsTauri = false,
        recordNamePrefix = '配置',
        recordNameMaxLen = 20,
        getDamageDisplay,
        getDamageShort,
        getCurrentConfig,
        applyConfig,
        getDamageSnapshot,
        fieldMeta,
        formatFieldValue,
        isFieldEmptyValue,
        zoneOrder,
        compareCustomTypes,
        compareDamageLabel,
        screenshotFileName,
        screenshotLoadingText = '正在生成截图...',
        clearConfirmText = '确定清空所有记录吗？',
        saveBtnId,
        queryBtnId,
        clearBtnId,
        modalId = 'recordModal',
        recordsListId = 'recordsListArea',
        compareAreaId = 'compareArea',
    } = config;

    const RECORD_VERSION = 1;
    const APP_VERSION = config.appVersion || '';
    const isTauri = supportsTauri && !!(window.__TAURI__ && window.__TAURI__.fs);
    const RECORDS_FILE = 'game_records.json';
    let records = [];
    let lastAppliedName = null;

    // ================= 存储 =================
    async function readRecordsFromFile() {
        if (!isTauri) return null;
        try {
            const { readTextFile } = window.__TAURI__.fs;
            const content = await readTextFile(RECORDS_FILE);
            return JSON.parse(content);
        } catch (e) { return null; }
    }

    async function writeRecordsToFile(records) {
        if (!isTauri) return false;
        try {
            const { writeTextFile } = window.__TAURI__.fs;
            await writeTextFile(RECORDS_FILE, JSON.stringify(records, null, 2));
            return true;
        } catch (e) { return false; }
    }

    function migrateRecords(records) {
        return records.map(r => {
            if (r._version && r._version >= RECORD_VERSION) return r;
            return { ...r, _version: RECORD_VERSION };
        });
    }

    function loadRecords() {
        // 同步加载（构造函数中使用）
        if (isTauri) {
            // Tauri 需要异步，延迟到 openModal 时再加载
            return;
        }
        const raw = localStorage.getItem(storageKey);
        if (raw) {
            try { records = JSON.parse(raw); if (!Array.isArray(records)) records = []; } catch(e) { records = []; }
        } else { records = []; }
        records = migrateRecords(records);
        saveRecords();
    }

    async function loadRecordsAsync() {
        if (isTauri) {
            const data = await readRecordsFromFile();
            records = (data && Array.isArray(data)) ? data : [];
        } else {
            const raw = localStorage.getItem(storageKey);
            if (raw) {
                try { records = JSON.parse(raw); if (!Array.isArray(records)) records = []; } catch(e) { records = []; }
            } else { records = []; }
        }
        records = migrateRecords(records);
        if (records.length > 0) await saveRecords();
    }

    function saveRecords() {
        if (isTauri) {
            writeRecordsToFile(records);
        } else {
            localStorage.setItem(storageKey, JSON.stringify(records));
        }
    }

    function addRecord(name, damage, config) {
        records.unshift({ id: Date.now(), name: name.trim(), config, damage, date: new Date().toISOString(), _version: RECORD_VERSION, appVersion: APP_VERSION });
        saveRecords();
    }

    function deleteRecord(id) {
        records = records.filter(r => r.id != id);
        saveRecords();
    }

    function clearAllRecords() {
        records = [];
        saveRecords();
    }

    // ================= 渲染记录列表 =================
    function renderRecordsUI() {
        const recordsArea = document.getElementById(recordsListId);
        if (!recordsArea) return;
        if (records.length === 0) {
            recordsArea.innerHTML = '<div style="padding:20px;text-align:center">✨ 暂无记录，请在计算器中点击"记录结果"保存配置。</div>';
            document.getElementById(compareAreaId).innerHTML = '';
            return;
        }
        let html = '';
        records.forEach(rec => {
            const versionTag = rec.appVersion
                ? `<span class="version-badge">${escapeHtml(rec.appVersion)}</span>`
                : `<span class="version-badge old">旧版</span>`;
            html += `<div class="record-card" data-id="${rec.id}">
                <div class="record-header">
                    <span class="record-name">📌 ${escapeHtml(rec.name)}${versionTag}</span>
                    <div class="record-damage">${getDamageDisplay(rec)}</div>
                    <div class="record-actions">
                        <button class="small-btn detail-check" data-id="${rec.id}">
                            <input type="checkbox" class="compare-check" value="${rec.id}"> 🔍 详情
                        </button>
                        <button class="small-btn apply-record" data-id="${rec.id}">📥 填入</button>
                        <button class="small-btn delete-record" data-id="${rec.id}">🗑️ 删除</button>
                    </div>
                </div>
            </div>`;
        });
        recordsArea.innerHTML = html;

        // 事件绑定
        document.querySelectorAll('.detail-check').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (e.target.tagName !== 'INPUT') {
                    const cb = btn.querySelector('.compare-check');
                    cb.checked = !cb.checked;
                    cb.dispatchEvent(new Event('change'));
                }
            });
        });
        document.querySelectorAll('.apply-record').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                const rec = records.find(r => r.id === id);
                if (rec) { lastAppliedName = rec.name; applyConfig(rec); closeModal(); }
            });
        });
        document.querySelectorAll('.delete-record').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                deleteRecord(id);
                renderRecordsUI();
                updateCompareSelection();
            });
        });
        const checks = document.querySelectorAll('.compare-check');
        checks.forEach(ch => {
            ch.removeEventListener('change', updateCompareSelection);
            ch.addEventListener('change', updateCompareSelection);
        });
        updateCompareSelection();
    }

    // ================= 对比表格 =================
    function renderCompareTable(recordsList) {
        if (!recordsList || recordsList.length === 0) return;

        // 收集所有字段
        const fieldsToShow = [];
        for (const zone of zoneOrder) {
            const fields = Object.entries(fieldMeta)
                .filter(([key, meta]) => meta.zone === zone)
                .map(([key]) => key);
            for (const field of fields) {
                const values = recordsList.map(rec => rec.config[field] !== undefined ? rec.config[field] : '');
                const allEmpty = values.every(v => isFieldEmptyValue(field, v));
                if (!allEmpty) fieldsToShow.push({ field, zone, values });
            }
        }

        // 收集自定义条目
        for (const ct of compareCustomTypes) {
            const allNames = new Set();
            for (const rec of recordsList) {
                (rec.config[ct.key] || []).forEach(e => allNames.add(e.name));
            }
            for (const name of Array.from(allNames).sort()) {
                const values = recordsList.map(rec => {
                    const entries = rec.config[ct.key] || [];
                    const entry = entries.find(e => e.name === name);
                    const val = entry ? (entry.percent !== undefined ? entry.percent : entry.value) : 0;
                    return val;
                });
                const allZero = values.every(v => v === 0);
                if (allZero) continue;
                fieldsToShow.push({
                    field: `custom_${ct.key}_${name}`,
                    zone: ct.zone,
                    values,
                    isCustom: true,
                    customName: name,
                    isFixedValue: ct.isFixedValue,
                });
            }
        }

        fieldsToShow.sort((a, b) => {
            const zoneDiff = zoneOrder.indexOf(a.zone) - zoneOrder.indexOf(b.zone);
            if (zoneDiff !== 0) return zoneDiff;
            const aSum = a.field.startsWith('_');
            const bSum = b.field.startsWith('_');
            if (aSum !== bSum) return aSum ? 1 : -1;
            return 0;
        });

        // 渲染表格
        let html = '<div class="compare-table-wrapper"><table class="compare-table"><thead><th class="field-name">字段</th>';
        for (const rec of recordsList) html += `<th>${escapeHtml(rec.name)}</th>`;
        html += '</thead><tbody>';

        let currentZone = '';
        for (const item of fieldsToShow) {
            if (item.zone !== currentZone) {
                if (currentZone) html += '</tr>';
                html += `<tr class="zone-header"><td colspan="${recordsList.length + 1}">${item.zone}</td></tr>`;
                currentZone = item.zone;
            }
            let displayName;
            if (item.isCustom) {
                displayName = item.customName;
            } else {
                const meta = fieldMeta[item.field];
                if (!meta) continue;
                displayName = meta.name;
            }
            const allSame = item.values.every(v => v === item.values[0]);
            html += `<tr><td class="field-name">${escapeHtml(displayName)}</td>`;
            for (let i = 0; i < recordsList.length; i++) {
                let displayVal;
                if (item.isCustom) {
                    displayVal = item.isFixedValue ? item.values[i] + '' : item.values[i] + '%';
                } else {
                    displayVal = formatFieldValue(item.field, item.values[i]);
                }
                const cls = allSame ? '' : 'diff-highlight';
                html += `<td class="${cls}">${escapeHtml(displayVal)}</td>`;
            }
            html += '</tr>';
        }

        // 伤害行
        html += `<tr class="zone-header"><td colspan="${recordsList.length + 1}">📊 伤害对比</td></tr>`;
        html += `<tr><td class="field-name">${compareDamageLabel}</td>`;
        for (const rec of recordsList) {
            html += `<td>${escapeHtml(getDamageShort ? getDamageShort(rec) : getDamageDisplay(rec))}</td>`;
        }
        html += '</tr></tbody></table></div>';

        const compareArea = document.getElementById(compareAreaId);
        compareArea.innerHTML = html;

        // 截图按钮
        addScreenshotButton();
    }

    function addScreenshotButton() {
        const compareArea = document.getElementById(compareAreaId);
        const existingBtnDiv = compareArea.querySelector('.screenshot-btn-container');
        if (existingBtnDiv) existingBtnDiv.remove();

        const btnDiv = document.createElement('div');
        btnDiv.className = 'screenshot-btn-container';
        btnDiv.style.textAlign = 'center';
        btnDiv.style.marginBottom = '12px';
        const screenshotBtn = document.createElement('button');
        screenshotBtn.className = 'screenshot-btn';
        screenshotBtn.innerHTML = '📸 截图对比';
        screenshotBtn.onclick = async () => {
            const wrapper = document.querySelector(`#${compareAreaId} .compare-table-wrapper`);
            if (!wrapper) return;
            try {
                await loadHtml2Canvas();
                const clone = wrapper.cloneNode(true);
                clone.style.position = 'absolute';
                clone.style.left = '-9999px';
                clone.style.top = '0';
                clone.style.width = 'auto';
                clone.style.maxWidth = 'none';
                clone.style.overflow = 'visible';
                document.body.appendChild(clone);
                showLoading(screenshotLoadingText);
                await new Promise(r => setTimeout(r, 100));
                const canvas = await html2canvas(clone, { scale: 2, backgroundColor: '#ffffff' });
                const link = document.createElement('a');
                const timestamp = new Date().toISOString().slice(0,19).replace(/:/g, '-');
                link.download = `${screenshotFileName}_${timestamp}.png`;
                link.href = canvas.toDataURL();
                link.click();
                document.body.removeChild(clone);
            } catch (err) {
                showScreenshotError('截图失败：' + (err.message || '未知错误'));
            } finally {
                hideLoading();
            }
        };
        btnDiv.appendChild(screenshotBtn);
        compareArea.insertBefore(btnDiv, compareArea.firstChild);
    }

    // ================= 勾选逻辑（支持 1 条也显示表格） =================
    function updateCompareSelection() {
        const checks = document.querySelectorAll('.compare-check');
        const selected = [];
        checks.forEach(ch => { if (ch.checked) selected.push(parseInt(ch.value)); });

        const compareArea = document.getElementById(compareAreaId);
        if (selected.length >= 1) {
            const selectedRecords = selected.map(id => records.find(r => r.id === id)).filter(r => r);
            if (selectedRecords.length) renderCompareTable(selectedRecords);
            else compareArea.innerHTML = '';
        } else {
            compareArea.innerHTML = '<div class="stat-badge">📊 勾选记录可查看详情对比</div>';
        }
    }

    // ================= 模态框操作 =================
    async function openModal() {
        await loadRecordsAsync();
        renderRecordsUI();
        document.getElementById(modalId).classList.add('active');
    }

    function closeModal() {
        document.getElementById(modalId).classList.remove('active');
    }

    async function handleSave() {
        let defaultName;
        if (lastAppliedName) {
            defaultName = lastAppliedName;
            lastAppliedName = null;
        } else {
            defaultName = recordNamePrefix;
            for (let i = 1; i <= records.length + 1; i++) {
                if (!records.some(r => r.name === `记录${i}`)) { defaultName = `记录${i}`; break; }
            }
        }
        let name = await showPrompt(`为本次记录命名 (最多${recordNameMaxLen}字)`, defaultName);
        if (!name) return;
        name = name.trim();
        if (name === '') { await showAlert('记录名称不能为空'); return; }
        if (name.length > recordNameMaxLen) name = name.slice(0, recordNameMaxLen);
        const existing = records.find(r => r.name === name);
        if (existing) {
            const ok = await showConfirm(`记录"${name}"已存在，是否覆盖？`);
            if (!ok) return;
            deleteRecord(existing.id);
        }
        const config = getCurrentConfig();
        const damage = getDamageSnapshot();
        addRecord(name, damage, config);
        await showAlert(`已记录"${name}"`);
    }

    async function handleClear() {
        const ok = await showConfirm(clearConfirmText);
        if (ok) {
            clearAllRecords();
            if (document.getElementById(modalId).classList.contains('active')) renderRecordsUI();
            await showAlert('所有记录已清空');
        }
    }

    // ================= 初始化 =================
    function init() {
        loadRecords();

        document.getElementById(saveBtnId).onclick = handleSave;
        document.getElementById(queryBtnId).onclick = openModal;
        document.getElementById(clearBtnId).onclick = handleClear;
        document.getElementById('closeModalBtn').onclick = closeModal;
        document.getElementById(modalId).addEventListener('click', (e) => {
            if (e.target === document.getElementById(modalId)) closeModal();
        });

        preloadScreenshot();
    }

    init();

    return { load: loadRecords };
}
