// dot/calculator.js
import { preloadScreenshot, loadHtml2Canvas, showLoading, hideLoading, showScreenshotError } from '../common/screenshot.js';
import { computeConversionValue } from '../common/conversion.js';
import { CustomEntryList } from '../common/utils.js';
import { getTarotName, getProfessionName, getImmunityName, FINAL_DMG_SKILL_DOT, FINAL_VULN_AURA, INFECTION_PERCENT, INFECTION_MAP, DOT_PROJECT, DOT_FIXED_RATE } from '../common/gameData.js';
import { calculateDot, calculateDotEntry } from './calc.js';
import { createRecordManager } from '../common/recordManager.js';

// ================= 自定义条目管理器 =================
const customDisplayAtkList = new CustomEntryList({ containerId: 'customDisplayAtkContainer', onUpdate: updateAllDOT });
const customActualAtkList = new CustomEntryList({ containerId: 'customActualAtkContainer', onUpdate: updateAllDOT });
const customDotIncList = new CustomEntryList({ containerId: 'customDotIncContainer', onUpdate: updateAllDOT });
const customPenVulnList = new CustomEntryList({ containerId: 'customPenVulnContainer', onUpdate: updateAllDOT });
const customPersistentVulnList = new CustomEntryList({ containerId: 'customPersistentVulnContainer', onUpdate: updateAllDOT });
const customFinalDmgList = new CustomEntryList({ containerId: 'customFinalDmgContainer', onUpdate: updateAllDOT });
const customFinalVulnList = new CustomEntryList({ containerId: 'customFinalVulnContainer', onUpdate: updateAllDOT });

// ================= 攻击转化相关（原生实现） =================
let physConvParams = { base: 0, multiplier: 0, bonus: 0, hiddenBonus: 0 };
let magicConvParams = { base: 0, multiplier: 0, bonus: 0, hiddenBonus: 0 };
let physConversion = 0, magicConversion = 0;

physConversion = computeConversionValue(physConvParams.base, physConvParams.multiplier, physConvParams.bonus, physConvParams.hiddenBonus);
magicConversion = computeConversionValue(magicConvParams.base, magicConvParams.multiplier, magicConvParams.bonus, magicConvParams.hiddenBonus);

let currentConversionType = 'phys';

function openConversionModal(type) {
    currentConversionType = type;
    const title = type === 'phys' ? '物攻转化' : '魔攻转化';
    document.getElementById('conversionTitle').innerText = title;
    const params = type === 'phys' ? physConvParams : magicConvParams;
    document.getElementById('convBaseValue').value = params.base;
    document.getElementById('convMultiplier').value = params.multiplier;
    document.getElementById('convBonus').value = params.bonus;
    document.getElementById('convHiddenBonus').value = params.hiddenBonus;
    const result = computeConversionValue(params.base, params.multiplier, params.bonus, params.hiddenBonus);
    document.getElementById('convResultValue').innerText = Math.round(result);
    document.getElementById('conversionModal').classList.add('active');
}

function closeConversionModal() {
    document.getElementById('conversionModal').classList.remove('active');
}

function applyConversion() {
    const params = {
        base: parseFloat(document.getElementById('convBaseValue').value) || 0,
        multiplier: parseFloat(document.getElementById('convMultiplier').value) || 0,
        bonus: parseFloat(document.getElementById('convBonus').value) || 0,
        hiddenBonus: parseFloat(document.getElementById('convHiddenBonus').value) || 0
    };
    if (currentConversionType === 'phys') {
        physConvParams = params;
        physConversion = computeConversionValue(params.base, params.multiplier, params.bonus, params.hiddenBonus);
    } else {
        magicConvParams = params;
        magicConversion = computeConversionValue(params.base, params.multiplier, params.bonus, params.hiddenBonus);
    }
    updatePhysMagicDisplay();
    updateAllDOT();
    closeConversionModal();
}

function resetConversion() {
    if (currentConversionType === 'phys') {
        physConvParams = { base: 0, multiplier: 0, bonus: 0, hiddenBonus: 0 };
        physConversion = 0;
    } else {
        magicConvParams = { base: 0, multiplier: 0, bonus: 0, hiddenBonus: 0 };
        magicConversion = 0;
    }
    openConversionModal(currentConversionType);
    updatePhysMagicDisplay();
    updateAllDOT();
}

// ================= 辅助函数（攻击区间） =================
function getNormalPercent() {
    let base = (parseFloat(document.getElementById('atkBuff').value) || 0) +
               (parseFloat(document.getElementById('flag').value) || 0) +
               (parseFloat(document.getElementById('swordScepter').value) || 0) +
               (parseFloat(document.getElementById('basicAura').value) || 0) +
               (parseFloat(document.getElementById('coordAttack').value) || 0);
    base += (document.getElementById('profession').value === 'watcher' ? 12 : 0);
    let customSum = customDisplayAtkList.entries.reduce((sum, e) => sum + (e.percent || 0), 0);
    base += customSum;
    return base;
}
function getExtraPercent() {
    let base = 0;
    let customSum = customActualAtkList.entries.reduce((sum, e) => sum + (e.percent || 0), 0);
    base += customSum;
    return base;
}
function getPhysActual() {
    let physBase = parseFloat(document.getElementById('physBase').value) || 0;
    let normalPercent = getNormalPercent();
    let physDisplay = physBase * (1 + normalPercent/100) + physConversion;
    let extraPercent = getExtraPercent();
    return physDisplay + physBase * (extraPercent/100);
}
function getMagicActual() {
    let magicBase = parseFloat(document.getElementById('magicBase').value) || 0;
    let normalPercent = getNormalPercent();
    let magicDisplay = magicBase * (1 + normalPercent/100) + magicConversion;
    let extraPercent = getExtraPercent();
    return magicDisplay + magicBase * (extraPercent/100);
}
function updatePhysMagicDisplay() {
    let physActual = getPhysActual();
    let magicActual = getMagicActual();
    let physBase = parseFloat(document.getElementById('physBase').value) || 0;
    let magicBase = parseFloat(document.getElementById('magicBase').value) || 0;
    let normalPercent = getNormalPercent();
    let physDisplay = physBase * (1 + normalPercent/100) + physConversion;
    let magicDisplay = magicBase * (1 + normalPercent/100) + magicConversion;
    document.getElementById('physDisplay').innerText = Math.round(physDisplay);
    document.getElementById('magicDisplay').innerText = Math.round(magicDisplay);
    document.getElementById('physActual').innerText = Math.round(physActual);
    document.getElementById('magicActual').innerText = Math.round(magicActual);
    document.getElementById('normalPercent').innerText = normalPercent.toFixed(1);
    document.getElementById('extraPercent').innerText = getExtraPercent().toFixed(1);
    document.getElementById('physConversion').innerText = Math.round(physConversion);
    document.getElementById('magicConversion').innerText = Math.round(magicConversion);
}

// ================= DOT条目管理 =================
let dotEntries = [];
let nextEntryId = 1;

// ================= 读取 DOT 条目参数 =================
function readDotEntryParams(entryDiv) {
    const mode = entryDiv.querySelector('.entry-mode').value;
    const ticks = parseInt(entryDiv.querySelector('.entry-tick-count').value) || 0;
    if (mode === 'standard') {
        const fixedSelect = entryDiv.querySelector('.entry-fixed');
        const multiplier = fixedSelect.value === 'custom'
            ? (parseFloat(entryDiv.querySelector('.entry-custom-percent').value) || 0) / 100
            : parseFloat(fixedSelect.value);
        return { mode, attackBase: getPhysActual() + getMagicActual(), multiplier, ticks };
    }
    if (mode === 'lifeLoss' || mode === 'scarTear') {
        const attr = entryDiv.querySelector('.entry-attr').value;
        const attackBase = attr === 'phys' ? getPhysActual() : getMagicActual();
        const multiplier = (parseFloat(entryDiv.querySelector('.entry-percent-input').value) || 0) / 100;
        return { mode, attackBase, multiplier, ticks };
    }
    if (mode === 'hpPercent') {
        const project = entryDiv.querySelector('.entry-hp-project').value;
        const infectionLayers = parseInt(entryDiv.querySelector('.entry-infection-layers').value) || 0;
        const enemyHp = parseFloat(entryDiv.querySelector('.entry-enemy-hp').value) || 0;
        const immunity = parseFloat(document.getElementById('immunity').value) || 0;
        return { mode, project, infectionLayers, enemyHp, immunity, ticks };
    }
    return { mode, ticks: 0 };
}

// ================= 收集输入 =================
function collectInputs() {
    return {
        physBase: parseFloat(document.getElementById('physBase').value) || 0,
        magicBase: parseFloat(document.getElementById('magicBase').value) || 0,
        normalPercent: getNormalPercent(),
        extraPercent: getExtraPercent(),
        physConversion: physConversion,
        magicConversion: magicConversion,
        tarot: document.getElementById('tarot').value,
        incBuff: parseFloat(document.getElementById('incBuff').value) || 0,
        yujieUlt: parseFloat(document.getElementById('yujieUlt').value) || 0,
        yujiePersonality: parseFloat(document.getElementById('yujiePersonality').value) || 0,
        hashaAura: parseFloat(document.getElementById('hashaAura').value) || 0,
        puppet: parseFloat(document.getElementById('puppet').value) || 0,
        nightmare: parseFloat(document.getElementById('nightmare').value) || 0,
        penVuln: parseFloat(document.getElementById('penVuln').value) || 0,
        momoAura: parseFloat(document.getElementById('momoAura').value) || 0,
        boqiAura: parseFloat(document.getElementById('boqiAura').value) || 0,
        charm: parseFloat(document.getElementById('charm').value) || 0,
        woundLayers: parseInt(document.getElementById('woundLayers').value) || 0,
        finalDmgSkill: parseFloat(document.getElementById('finalDmgSkill').value) || 0,
        finalVulnAura: parseFloat(document.getElementById('finalVulnAura').value) || 0,
        customDotIncEntries: customDotIncList.entries.map(e => e.percent || 0),
        customPenVulnEntries: customPenVulnList.entries.map(e => e.percent || 0),
        customPersistentVulnEntries: customPersistentVulnList.entries.map(e => e.percent || 0),
        customFinalDmgEntries: customFinalDmgList.entries.map(e => e.percent || 0),
        customFinalVulnEntries: customFinalVulnList.entries.map(e => e.percent || 0),
    };
}

// ================= 渲染结果 =================
function renderResults(r) {
    document.getElementById('totalAtk').innerText = r.totalAtk;
    document.getElementById('incMult').innerText = r.incMult.toFixed(2) + 'x';
    document.getElementById('penMult').innerText = r.penMult.toFixed(2) + 'x';
    document.getElementById('persistentMult').innerText = r.persistentMult.toFixed(2) + 'x';
    document.getElementById('woundMult').innerText = r.woundMult.toFixed(2) + 'x';
    document.getElementById('statFinalMult').innerText = r.finalDmgMult.toFixed(2) + 'x';
    document.getElementById('statFinalVulnMult').innerText = r.finalVulnMult.toFixed(2) + 'x';
    document.getElementById('dotTotal').innerText = r.totalDamage;
    document.getElementById('dotFinalDisplay').innerHTML = `<small>🔥</small> ${r.totalDamage}`;
    updatePhysMagicDisplay();
}

// ================= 主计算逻辑 =================
function updateAllDOT() {
    const inputs = collectInputs();
    const mults = calculateDot(inputs);

    let totalDamage = 0;
    for (let entryDiv of dotEntries) {
        const params = readDotEntryParams(entryDiv);
        const baseTotal = calculateDotEntry(params, mults);
        const entryTotal = Math.round(baseTotal * mults.finalDmgMult * mults.finalVulnMult);
        entryDiv.querySelector('.entry-damage-value').innerText = entryTotal;
        totalDamage += entryTotal;
    }

    renderResults({ ...mults, totalDamage });
}
function toggleEntryModeControls(entryDiv) {
    let mode = entryDiv.querySelector('.entry-mode').value;
    let attrRow = entryDiv.querySelector('.attr-row');
    let rateControls = entryDiv.querySelector('.rate-controls');
    let standardControls = rateControls.querySelector('.standard-controls');
    let percentControls = rateControls.querySelector('.percent-controls');
    let hpRow = entryDiv.querySelector('.hp-percent-row');
    let infectionRow = entryDiv.querySelector('.infection-row');
    let enemyHpRow = entryDiv.querySelector('.enemy-hp-row');
    if (mode === 'standard') {
        attrRow.style.display = 'none';
        standardControls.style.display = 'flex';
        percentControls.style.display = 'none';
        if (hpRow) hpRow.style.display = 'none';
        if (infectionRow) infectionRow.style.display = 'none';
        if (enemyHpRow) enemyHpRow.style.display = 'none';
    } else if (mode === 'lifeLoss' || mode === 'scarTear') {
        attrRow.style.display = 'flex';
        standardControls.style.display = 'none';
        percentControls.style.display = 'flex';
        if (hpRow) hpRow.style.display = 'none';
        if (infectionRow) infectionRow.style.display = 'none';
        if (enemyHpRow) enemyHpRow.style.display = 'none';
    } else if (mode === 'hpPercent') {
        attrRow.style.display = 'none';
        rateControls.style.display = 'none';
        if (hpRow) hpRow.style.display = 'flex';
        let project = entryDiv.querySelector('.entry-hp-project').value;
        if (infectionRow) infectionRow.style.display = (project === 'infection') ? 'flex' : 'none';
        if (enemyHpRow) enemyHpRow.style.display = 'flex';
    }
    updateAllDOT();
}
function createDotEntry(entryId, savedConfig = null) {
    let entryDiv = document.createElement('div');
    entryDiv.className = 'dot-entry';
    entryDiv.setAttribute('data-id', entryId);
    let header = document.createElement('div');
    header.className = 'dot-entry-header';
    header.innerHTML = `<span>📌 伤害模式</span>`;
    let delBtn = document.createElement('button');
    delBtn.innerText = '✖';
    delBtn.style.visibility = dotEntries.length === 0 ? 'hidden' : 'visible';
    delBtn.onclick = () => {
        if (dotEntries.length === 1) return;
        entryDiv.remove();
        dotEntries = dotEntries.filter(d => d !== entryDiv);
        updateAllDOT();
        for (let e of dotEntries) {
            let btn = e.querySelector('.dot-entry-header button');
            if (dotEntries.length === 1) btn.style.visibility = 'hidden';
            else btn.style.visibility = 'visible';
        }
    };
    header.appendChild(delBtn);
    entryDiv.appendChild(header);

    let modeSelect = document.createElement('select');
    modeSelect.className = 'entry-mode';
    modeSelect.innerHTML = `
        <option value="standard">标准DOT (冻伤/点燃)</option>
        <option value="lifeLoss">生命流失</option>
        <option value="scarTear">伤痕撕裂</option>
        <option value="hpPercent">生命百分比类</option>
    `;
    let modeRow = document.createElement('div');
    modeRow.className = 'row';
    modeRow.innerHTML = '<label>伤害模式</label>';
    modeRow.appendChild(modeSelect);
    entryDiv.appendChild(modeRow);

    let attrRow = document.createElement('div');
    attrRow.className = 'row attr-row';
    attrRow.innerHTML = '<label>结算属性</label>';
    let attrSelect = document.createElement('select');
    attrSelect.className = 'entry-attr';
    attrSelect.innerHTML = `<option value="phys">物攻</option><option value="magic">魔攻</option>`;
    attrRow.appendChild(attrSelect);
    entryDiv.appendChild(attrRow);

    let rateRow = document.createElement('div');
    rateRow.className = 'row';
    rateRow.innerHTML = '<label>结算倍率</label>';
    let rateControls = document.createElement('div');
    rateControls.className = 'rate-controls';
    let standardControls = document.createElement('div');
    standardControls.className = 'standard-controls';
    let fixedSelect = document.createElement('select');
    fixedSelect.className = 'entry-fixed';
    fixedSelect.innerHTML = `
        <option value="0.15">次级冻伤 (15%)</option>
        <option value="0.50" selected>冻伤 (50%)</option>
        <option value="0.25">点燃 (25%)</option>
        <option value="custom">自定义 (%)</option>
    `;
    let customInput = document.createElement('input');
    customInput.type = 'number';
    customInput.className = 'entry-custom-percent';
    customInput.placeholder = '自定义倍率 (%)';
    customInput.value = '0';
    let customRow = document.createElement('div');
    customRow.style.display = 'none';
    customRow.appendChild(customInput);
    fixedSelect.addEventListener('change', () => {
        customRow.style.display = fixedSelect.value === 'custom' ? 'block' : 'none';
        updateAllDOT();
    });
    standardControls.appendChild(fixedSelect);
    standardControls.appendChild(customRow);
    let percentControls = document.createElement('div');
    percentControls.className = 'percent-controls';
    percentControls.style.display = 'none';
    let percentInput = document.createElement('input');
    percentInput.type = 'number';
    percentInput.className = 'entry-percent-input';
    percentInput.placeholder = '倍率 (%)';
    percentInput.value = '0';
    percentInput.step = '1';
    percentControls.appendChild(percentInput);
    rateControls.appendChild(standardControls);
    rateControls.appendChild(percentControls);
    rateRow.appendChild(rateControls);
    entryDiv.appendChild(rateRow);

    // 生命百分比类专用控件
    let hpRow = document.createElement('div');
    hpRow.className = 'row hp-percent-row';
    hpRow.style.display = 'none';
    hpRow.innerHTML = '<label>结算项目</label>';
    let projectSelect = document.createElement('select');
    projectSelect.className = 'entry-hp-project';
    projectSelect.innerHTML = `
        <option value="infection">感染</option>
        <option value="burn">灼烧</option>
        <option value="stigma">圣痕</option>
        <option value="erosion">蚀炎</option>
        <option value="darkfire">冥火</option>
        <option value="ancestor">先祖之力</option>
    `;
    hpRow.appendChild(projectSelect);
    entryDiv.appendChild(hpRow);

    let infectionRow = document.createElement('div');
    infectionRow.className = 'row infection-row';
    infectionRow.style.display = 'none';
    infectionRow.innerHTML = '<label>感染层数</label>';
    let layersSelect = document.createElement('select');
    layersSelect.className = 'entry-infection-layers';
    for (let i = 1; i <= 9; i++) {
        layersSelect.innerHTML += `<option value="${i}">${i}层 (${INFECTION_PERCENT[i-1]}%)</option>`;
    }
    infectionRow.appendChild(layersSelect);
    entryDiv.appendChild(infectionRow);

    let enemyHpRow = document.createElement('div');
    enemyHpRow.className = 'row enemy-hp-row';
    enemyHpRow.style.display = 'none';
    enemyHpRow.innerHTML = '<label>敌方生命值</label>';
    let enemyHpInput = document.createElement('input');
    enemyHpInput.type = 'number';
    enemyHpInput.className = 'entry-enemy-hp';
    enemyHpInput.value = '10000';
    enemyHpInput.step = '100';
    enemyHpRow.appendChild(enemyHpInput);
    entryDiv.appendChild(enemyHpRow);

    let tickRow = document.createElement('div');
    tickRow.className = 'row';
    tickRow.innerHTML = '<label>结算次数</label>';
    let tickInput = document.createElement('input');
    tickInput.type = 'number';
    tickInput.className = 'entry-tick-count';
    tickInput.value = '1';
    tickInput.min = '1';
    tickRow.appendChild(tickInput);
    entryDiv.appendChild(tickRow);

    let damageRow = document.createElement('div');
    damageRow.className = 'stat-badge';
    damageRow.style.marginTop = '8px';
    damageRow.innerHTML = `<span class="conversion-label">🔥 总伤害</span> <span class="entry-damage-value">0</span>`;
    entryDiv.appendChild(damageRow);

    // 事件绑定
    function toggleControls() {
        let mode = modeSelect.value;
        if (mode === 'standard') {
            attrRow.style.display = 'none';
            rateRow.style.display = 'flex';
            hpRow.style.display = 'none';
            infectionRow.style.display = 'none';
            enemyHpRow.style.display = 'none';
            standardControls.style.display = 'flex';
            percentControls.style.display = 'none';
        } else if (mode === 'lifeLoss' || mode === 'scarTear') {
            attrRow.style.display = 'flex';
            rateRow.style.display = 'flex';
            hpRow.style.display = 'none';
            infectionRow.style.display = 'none';
            enemyHpRow.style.display = 'none';
            standardControls.style.display = 'none';
            percentControls.style.display = 'flex';
        } else if (mode === 'hpPercent') {
            attrRow.style.display = 'none';
            rateRow.style.display = 'none';
            hpRow.style.display = 'flex';
            let project = projectSelect.value;
            infectionRow.style.display = (project === 'infection') ? 'flex' : 'none';
            enemyHpRow.style.display = 'flex';
        }
        updateAllDOT();
    }
    modeSelect.addEventListener('change', toggleControls);
    projectSelect.addEventListener('change', () => {
        let project = projectSelect.value;
        infectionRow.style.display = (project === 'infection') ? 'flex' : 'none';
        updateAllDOT();
    });
    attrSelect.addEventListener('change', () => updateAllDOT());
    fixedSelect.addEventListener('change', () => updateAllDOT());
    customInput.addEventListener('input', () => updateAllDOT());
    percentInput.addEventListener('input', () => updateAllDOT());
    layersSelect.addEventListener('change', () => updateAllDOT());
    enemyHpInput.addEventListener('input', () => updateAllDOT());
    tickInput.addEventListener('input', () => updateAllDOT());

    if (savedConfig) {
        modeSelect.value = savedConfig.mode;
        if (savedConfig.mode === 'standard') {
            fixedSelect.value = savedConfig.fixedValue || '0.50';
            if (fixedSelect.value === 'custom') customInput.value = savedConfig.customPercent || 0;
            tickInput.value = savedConfig.tickCount || 1;
        } else if (savedConfig.mode === 'lifeLoss' || savedConfig.mode === 'scarTear') {
            percentInput.value = savedConfig.percent || 0;
            if (savedConfig.attr) attrSelect.value = savedConfig.attr;
            tickInput.value = savedConfig.tickCount || 1;
        } else if (savedConfig.mode === 'hpPercent') {
            projectSelect.value = savedConfig.project || 'infection';
            if (savedConfig.project === 'infection') {
                layersSelect.value = savedConfig.infectionLayers || 1;
            }
            enemyHpInput.value = savedConfig.enemyHp || 10000;
            tickInput.value = savedConfig.tickCount || 1;
        }
    }
    toggleControls();
    return entryDiv;
}
function addNewEntry(savedConfig = null) {
    let newId = nextEntryId++;
    let newEntry = createDotEntry(newId, savedConfig);
    document.getElementById('dotEntriesContainer').appendChild(newEntry);
    dotEntries.push(newEntry);
    for (let e of dotEntries) {
        let btn = e.querySelector('.dot-entry-header button');
        if (dotEntries.length === 1) btn.style.visibility = 'hidden';
        else btn.style.visibility = 'visible';
    }
    updateAllDOT();
}
function resetEntries() {
    let container = document.getElementById('dotEntriesContainer');
    container.innerHTML = '';
    dotEntries = [];
    addNewEntry({ mode: 'standard', fixedValue: '0.50', tickCount: 1 });
}
function getEntriesConfig() {
    let configs = [];
    for (let entry of dotEntries) {
        let mode = entry.querySelector('.entry-mode').value;
        let tickCount = parseInt(entry.querySelector('.entry-tick-count').value);
        let config = { mode, tickCount };
        if (mode === 'standard') {
            let fixedSelect = entry.querySelector('.entry-fixed');
            config.fixedValue = fixedSelect.value;
            if (fixedSelect.value === 'custom') {
                config.customPercent = parseFloat(entry.querySelector('.entry-custom-percent').value) || 0;
            }
        } else if (mode === 'lifeLoss' || mode === 'scarTear') {
            config.percent = parseFloat(entry.querySelector('.entry-percent-input').value) || 0;
            config.attr = entry.querySelector('.entry-attr').value;
        } else if (mode === 'hpPercent') {
            config.project = entry.querySelector('.entry-hp-project').value;
            if (config.project === 'infection') {
                config.infectionLayers = parseInt(entry.querySelector('.entry-infection-layers').value);
            }
            config.enemyHp = parseFloat(entry.querySelector('.entry-enemy-hp').value) || 0;
        }
        configs.push(config);
    }
    return configs;
}
function restoreEntries(entriesConfig) {
    let container = document.getElementById('dotEntriesContainer');
    container.innerHTML = '';
    dotEntries = [];
    if (!entriesConfig || entriesConfig.length === 0) {
        addNewEntry({ mode: 'standard', fixedValue: '0.50', tickCount: 1 });
    } else {
        for (let cfg of entriesConfig) addNewEntry(cfg);
    }
    updateAllDOT();
}
function getFullConfig() {
    let config = {};
    document.querySelectorAll('input, select').forEach(el => { if (el.id) config[el.id] = el.value; });
    config.physConvBase = physConvParams.base;
    config.physConvMultiplier = physConvParams.multiplier;
    config.physConvBonus = physConvParams.bonus;
    config.physConvHiddenBonus = physConvParams.hiddenBonus;
    config.magicConvBase = magicConvParams.base;
    config.magicConvMultiplier = magicConvParams.multiplier;
    config.magicConvBonus = magicConvParams.bonus;
    config.magicConvHiddenBonus = magicConvParams.hiddenBonus;
    config.dotEntries = getEntriesConfig();
    config.customDisplayAtkEntries = customDisplayAtkList.entries.map(e => ({ name: e.name, percent: e.percent }));
    config.customActualAtkEntries = customActualAtkList.entries.map(e => ({ name: e.name, percent: e.percent }));
    config.customDotIncEntries = customDotIncList.entries.map(e => ({ name: e.name, percent: e.percent }));
    config.customPenVulnEntries = customPenVulnList.entries.map(e => ({ name: e.name, percent: e.percent }));
    config.customPersistentVulnEntries = customPersistentVulnList.entries.map(e => ({ name: e.name, percent: e.percent }));
    config.customFinalDmgEntries = customFinalDmgList.entries.map(e => ({ name: e.name, percent: e.percent }));
    config.customFinalVulnEntries = customFinalVulnList.entries.map(e => ({ name: e.name, percent: e.percent }));
    config.finalDmgSkill = document.getElementById('finalDmgSkill') ? document.getElementById('finalDmgSkill').value : '0';
    config.finalVulnAura = document.getElementById('finalVulnAura') ? document.getElementById('finalVulnAura').value : '0';
    config._physConversion = physConversion;
    config._magicConversion = magicConversion;
    config._displayAtk = '物攻' + document.getElementById('physDisplay').innerText + ' + 魔攻' + document.getElementById('magicDisplay').innerText;
    config._totalAtk = '物攻' + document.getElementById('physActual').innerText + ' + 魔攻' + document.getElementById('magicActual').innerText;
    return config;
}
function applyFullConfig(config) {
    for (const [key, value] of Object.entries(config)) {
        if (key === 'dotEntries') continue;
        if (key === 'physConvBase' || key === 'physConvMultiplier' || key === 'physConvBonus' || key === 'physConvHiddenBonus' ||
            key === 'magicConvBase' || key === 'magicConvMultiplier' || key === 'magicConvBonus' || key === 'magicConvHiddenBonus') continue;
        if (key.startsWith('custom')) continue;
        const el = document.getElementById(key);
        if (el) el.value = value;
    }
    physConvParams = {
        base: parseFloat(config.physConvBase) || 0, multiplier: parseFloat(config.physConvMultiplier) || 0,
        bonus: parseFloat(config.physConvBonus) || 0, hiddenBonus: parseFloat(config.physConvHiddenBonus) || 0
    };
    magicConvParams = {
        base: parseFloat(config.magicConvBase) || 0, multiplier: parseFloat(config.magicConvMultiplier) || 0,
        bonus: parseFloat(config.magicConvBonus) || 0, hiddenBonus: parseFloat(config.magicConvHiddenBonus) || 0
    };
    physConversion = computeConversionValue(physConvParams.base, physConvParams.multiplier, physConvParams.bonus, physConvParams.hiddenBonus);
    magicConversion = computeConversionValue(magicConvParams.base, magicConvParams.multiplier, magicConvParams.bonus, magicConvParams.hiddenBonus);
    restoreEntries(config.dotEntries);
    if (config.customDisplayAtkEntries) customDisplayAtkList.setFromSaved(config.customDisplayAtkEntries); else customDisplayAtkList.clear();
    if (config.customActualAtkEntries) customActualAtkList.setFromSaved(config.customActualAtkEntries); else customActualAtkList.clear();
    if (config.customDotIncEntries) customDotIncList.setFromSaved(config.customDotIncEntries); else customDotIncList.clear();
    if (config.customPenVulnEntries) customPenVulnList.setFromSaved(config.customPenVulnEntries); else customPenVulnList.clear();
    if (config.customPersistentVulnEntries) customPersistentVulnList.setFromSaved(config.customPersistentVulnEntries); else customPersistentVulnList.clear();
    if (config.customFinalDmgEntries) customFinalDmgList.setFromSaved(config.customFinalDmgEntries); else customFinalDmgList.clear();
    if (config.customFinalVulnEntries) customFinalVulnList.setFromSaved(config.customFinalVulnEntries); else customFinalVulnList.clear();
    if (config.finalDmgSkill !== undefined && document.getElementById('finalDmgSkill')) document.getElementById('finalDmgSkill').value = config.finalDmgSkill;
    if (config.finalVulnAura !== undefined && document.getElementById('finalVulnAura')) document.getElementById('finalVulnAura').value = config.finalVulnAura;
    updatePhysMagicDisplay();
    updateAllDOT();
}

function resetAll() {
    document.getElementById('physBase').value = '3000';
    document.getElementById('magicBase').value = '3000';
    document.getElementById('atkBuff').value = '0';
    document.getElementById('flag').value = '0';
    document.getElementById('swordScepter').value = '0';
    document.getElementById('basicAura').value = '0';
    document.getElementById('coordAttack').value = '0';
    document.getElementById('profession').value = 'none';
    document.getElementById('tarot').value = 'none';
    document.getElementById('incBuff').value = '0';
    document.getElementById('yujieUlt').value = '0';
    document.getElementById('yujiePersonality').value = '0';
    document.getElementById('hashaAura').value = '0';
    document.getElementById('puppet').value = '0';
    document.getElementById('nightmare').value = '0';
    document.getElementById('penVuln').value = '0';
    document.getElementById('immunity').value = '0';
    document.getElementById('momoAura').value = '0';
    document.getElementById('boqiAura').value = '0';
    document.getElementById('charm').value = '0';
    document.getElementById('woundLayers').value = '0';
    if (document.getElementById('finalDmgSkill')) document.getElementById('finalDmgSkill').value = '0';
    if (document.getElementById('finalVulnAura')) document.getElementById('finalVulnAura').value = '0';
    physConvParams = { base:0, multiplier:0, bonus:0, hiddenBonus:0 };
    magicConvParams = { base:0, multiplier:0, bonus:0, hiddenBonus:0 };
    physConversion = 0; magicConversion = 0;
    customDisplayAtkList.clear();
    customActualAtkList.clear();
    customDotIncList.clear();
    customPenVulnList.clear();
    customPersistentVulnList.clear();
    customFinalDmgList.clear();
    customFinalVulnList.clear();
    restoreEntries(null);
    updatePhysMagicDisplay();
    updateAllDOT();
}
document.getElementById('addEntryBtn').addEventListener('click', () => addNewEntry());
document.getElementById('resetBtn').addEventListener('click', resetAll);
document.getElementById('openPhysConv').addEventListener('click', () => openConversionModal('phys'));
document.getElementById('openMagicConv').addEventListener('click', () => openConversionModal('magic'));
document.getElementById('closeConversionModal').addEventListener('click', closeConversionModal);
document.getElementById('applyConversionBtn').addEventListener('click', applyConversion);
document.getElementById('resetConversionBtn').addEventListener('click', resetConversion);
const allInputs = document.querySelectorAll('input, select');
allInputs.forEach(el => el.addEventListener('input', () => {
    updatePhysMagicDisplay();
    updateAllDOT();
}));
resetAll();

document.addEventListener('DOMContentLoaded', () => {
    const addDisplayBtn = document.getElementById('addCustomDisplayAtkBtn');
    if (addDisplayBtn) addDisplayBtn.addEventListener('click', () => customDisplayAtkList.add());
    const addActualBtn = document.getElementById('addCustomActualAtkBtn');
    if (addActualBtn) addActualBtn.addEventListener('click', () => customActualAtkList.add());
    const addDotIncBtn = document.getElementById('addCustomDotIncBtn');
    if (addDotIncBtn) addDotIncBtn.addEventListener('click', () => customDotIncList.add());
    const addPenVulnBtn = document.getElementById('addCustomPenVulnBtn');
    if (addPenVulnBtn) addPenVulnBtn.addEventListener('click', () => customPenVulnList.add());
    const addPersistentBtn = document.getElementById('addCustomPersistentVulnBtn');
    if (addPersistentBtn) addPersistentBtn.addEventListener('click', () => customPersistentVulnList.add());
    const addFinalDmgBtn = document.getElementById('addCustomFinalDmgBtn');
    if (addFinalDmgBtn) addFinalDmgBtn.addEventListener('click', () => customFinalDmgList.add());
    const addFinalVulnBtn = document.getElementById('addCustomFinalVulnBtn');
    if (addFinalVulnBtn) addFinalVulnBtn.addEventListener('click', () => customFinalVulnList.add());
});

// ================= 记录管理模块 =================
const dotFieldMeta = {
    physBase: { name: "基础物攻", zone: "⚔️ 攻击区间" },
    magicBase: { name: "基础魔攻", zone: "⚔️ 攻击区间" },
    atkBuff: { name: "攻击BUFF", zone: "⚔️ 攻击区间", unit: "%" },
    flag: { name: "战旗", zone: "⚔️ 攻击区间", unit: "%" },
    swordScepter: { name: "剑杖刻印", zone: "⚔️ 攻击区间", unit: "%" },
    basicAura: { name: "基础光环", zone: "⚔️ 攻击区间", unit: "%" },
    coordAttack: { name: "协攻", zone: "⚔️ 攻击区间", unit: "%" },
    _physConversion: { name: "物攻转化值", zone: "⚔️ 攻击区间", unit: "" },
    _magicConversion: { name: "魔攻转化值", zone: "⚔️ 攻击区间", unit: "" },
    _displayAtk: { name: "显示攻击力", zone: "⚔️ 攻击区间", unit: "" },
    _totalAtk: { name: "最终攻击力", zone: "⚔️ 攻击区间", unit: "" },
    incBuff: { name: "持续伤害buff", zone: "📈 持续伤害增伤", unit: "%" },
    yujieUlt: { name: "羽姐大招", zone: "📈 持续伤害增伤", unit: "%" },
    yujiePersonality: { name: "羽姐5星个性", zone: "📈 持续伤害增伤", unit: "%" },
    hashaAura: { name: "大哈沙光环", zone: "📈 持续伤害增伤", unit: "%" },
    puppet: { name: "傀儡", zone: "🔻 穿透易伤", unit: "%" },
    nightmare: { name: "梦魇", zone: "🔻 穿透易伤", unit: "%" },
    penVuln: { name: "穿透易伤", zone: "🔻 穿透易伤", unit: "%" },
    immunity: { name: "免疫减免", zone: "🔻 穿透易伤", unit: "" },
    momoAura: { name: "茉茉个性光环", zone: "🔥 持续伤害易伤", unit: "%" },
    boqiAura: { name: "波奇个性光环", zone: "🔥 持续伤害易伤", unit: "%" },
    charm: { name: "魅惑", zone: "🔥 持续伤害易伤", unit: "%" },
    woundLayers: { name: "伤口层数", zone: "🩸 伤口", unit: "层" },
    profession: { name: "职业天赋", zone: "🌐 全局设置" },
    tarot: { name: "塔罗牌", zone: "🌐 全局设置" },
    finalDmgSkill: { name: "无视守护·寒境", zone: "✨ 最终增伤区间", unit: "%" },
    finalVulnAura: { name: "塞娜光环", zone: "🎯 最终易伤区间", unit: "%" }
};

function isFieldEmptyValue(key, value) {
    if (value === undefined || value === null) return true;
    const str = value.toString().trim();
    if (str === '' || str === '0' || str === 'none' || str === '无') return true;
    const num = parseFloat(str);
    if (!isNaN(num) && num === 0) return true;
    return false;
}

const DOT_SELECT_LABELS = {
    atkBuff:           { '0':'无', '10':'攻击1', '20':'攻击2', '30':'攻击3', '40':'攻击4' },
    flag:              { '0':'无', '20':'有战旗' },
    swordScepter:      { '0':'不触发', '4':'一步', '8':'两步', '12':'三步以上' },
    basicAura:         { '0':'无', '10':'有' },
    coordAttack:       { '0':'无', '5':'协攻1', '10':'协攻2', '15':'协攻3' },
    incBuff:           { '0':'无', '10':'持续伤害1' },
    yujieUlt:          { '0':'无', '15':'有' },
    yujiePersonality:  { '0':'无', '25':'有' },
    hashaAura:         { '0':'无', '5':'有', '15':'有解放' },
    puppet:            { '0':'无', '15':'有' },
    nightmare:         { '0':'无', '5':'有' },
    penVuln:           { '0':'无', '10':'易伤1', '20':'易伤2' },
    momoAura:          { '0':'无' },
    boqiAura:          { '0':'无' },
    charm:             { '0':'无', '30':'有' },
    immunity:          { '0':'无' },
};

function formatFieldValue(key, value) {
    if (value === undefined || value === null) return '—';
    let val = value.toString();
    if (key === 'woundLayers') {
        const layers = parseInt(val);
        if (isNaN(layers) || layers === 0) return '0层';
        const percent = (Math.pow(1.12, layers) - 1) * 100;
        return `${layers}层 (+${percent.toFixed(2)}%)`;
    }
    if (key === 'profession') return getProfessionName(val);
    if (key === 'tarot') return getTarotName(val);
    if (key === 'immunity') return getImmunityName(val);
    if (key === 'finalDmgSkill') return FINAL_DMG_SKILL_DOT[val] || val;
    if (key === 'finalVulnAura') return FINAL_VULN_AURA[val] || val;
    const label = DOT_SELECT_LABELS[key]?.[val];
    const unit = dotFieldMeta[key]?.unit || '';
    if (label && label !== val) return `${label} (${val}${unit})`;
    return val + (unit ? unit : '');
}

const dotRecordManager = createRecordManager({
    storageKey: 'DotDamageRecordsV6',
    recordNamePrefix: 'DOT配置',
    getDamageDisplay: (rec) => `🔥 ${rec.damage}`,
    getDamageShort: (rec) => String(rec.damage || ''),
    getCurrentConfig: getFullConfig,
    applyConfig: (rec) => applyFullConfig(rec.config),
    getDamageSnapshot: () => parseInt(document.getElementById('dotFinalDisplay').innerText.replace(/[^0-9-]/g, '')),
    fieldMeta: dotFieldMeta,
    formatFieldValue,
    isFieldEmptyValue,
    zoneOrder: ['⚔️ 攻击区间', '📈 持续伤害增伤', '🔻 穿透易伤', '🔥 持续伤害易伤', '🩸 伤口', '✨ 最终增伤区间', '🎯 最终易伤区间', '🌐 全局设置'],
    compareCustomTypes: [
        { key: 'customDisplayAtkEntries', zone: '⚔️ 攻击区间' },
        { key: 'customActualAtkEntries', zone: '⚔️ 攻击区间' },
        { key: 'customDotIncEntries', zone: '📈 持续伤害增伤' },
        { key: 'customPenVulnEntries', zone: '🔻 穿透易伤' },
        { key: 'customPersistentVulnEntries', zone: '🔥 持续伤害易伤' },
        { key: 'customFinalDmgEntries', zone: '✨ 最终增伤区间' },
        { key: 'customFinalVulnEntries', zone: '🎯 最终易伤区间' },
    ],
    compareDamageLabel: '🔥 DOT总伤害',
    screenshotFileName: 'DOT对比',
    saveBtnId: 'recordBtn',
    queryBtnId: 'queryBtn',
    clearBtnId: 'clearBtn',
});

preloadScreenshot();
