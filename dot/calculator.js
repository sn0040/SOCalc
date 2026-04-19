// dot/calculator.js
import { preloadScreenshot, loadHtml2Canvas, showLoading, hideLoading, showScreenshotError } from '../common/screenshot.js';

// ================= 自定义条目数组（全局） =================
let customDisplayAtkEntries = [];
let customActualAtkEntries = [];
let customDotIncEntries = [];
let customPenVulnEntries = [];
let customPersistentVulnEntries = [];
let customFinalDmgEntries = [];   // 最终增伤自定义条目（加算）
let customFinalVulnEntries = [];  // 最终易伤自定义条目（乘算）

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// ================= 渲染函数 =================
function renderCustomDisplayAtkEntries() {
    const container = document.getElementById('customDisplayAtkContainer');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < customDisplayAtkEntries.length; i++) {
        const entry = customDisplayAtkEntries[i];
        const div = document.createElement('div');
        div.className = 'row';
        div.style.marginBottom = '8px';
        div.innerHTML = `
            <input type="text" class="custom-name" value="${escapeHtml(entry.name)}" placeholder="名称" style="flex:2;">
            <input type="number" class="custom-percent" value="${entry.percent === 0 ? '' : entry.percent}" step="1" placeholder="百分比" style="flex:1;">
            <button class="small-btn delete-custom" data-index="${i}" >删除</button>
        `;
        const nameInput = div.querySelector('.custom-name');
        const percentInput = div.querySelector('.custom-percent');
        const delBtn = div.querySelector('.delete-custom');
        nameInput.addEventListener('change', () => { customDisplayAtkEntries[i].name = nameInput.value; });
        percentInput.addEventListener('input', () => {
            customDisplayAtkEntries[i].percent = parseFloat(percentInput.value) || 0;
            updateAllDOT();
        });
        delBtn.addEventListener('click', () => {
            customDisplayAtkEntries.splice(i, 1);
            renderCustomDisplayAtkEntries();
            updateAllDOT();
        });
        container.appendChild(div);
    }
}
function addCustomDisplayAtkEntry() {
    customDisplayAtkEntries.push({ name: '', percent: 0 });
    renderCustomDisplayAtkEntries();
    updateAllDOT();
}

function renderCustomActualAtkEntries() {
    const container = document.getElementById('customActualAtkContainer');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < customActualAtkEntries.length; i++) {
        const entry = customActualAtkEntries[i];
        const div = document.createElement('div');
        div.className = 'row';
        div.style.marginBottom = '8px';
        div.innerHTML = `
            <input type="text" class="custom-name" value="${escapeHtml(entry.name)}" placeholder="名称" style="flex:2;">
            <input type="number" class="custom-percent" value="${entry.percent === 0 ? '' : entry.percent}" step="1" placeholder="百分比" style="flex:1;">
            <button class="small-btn delete-custom" data-index="${i}" >删除</button>
        `;
        const nameInput = div.querySelector('.custom-name');
        const percentInput = div.querySelector('.custom-percent');
        const delBtn = div.querySelector('.delete-custom');
        nameInput.addEventListener('change', () => { customActualAtkEntries[i].name = nameInput.value; });
        percentInput.addEventListener('input', () => {
            customActualAtkEntries[i].percent = parseFloat(percentInput.value) || 0;
            updateAllDOT();
        });
        delBtn.addEventListener('click', () => {
            customActualAtkEntries.splice(i, 1);
            renderCustomActualAtkEntries();
            updateAllDOT();
        });
        container.appendChild(div);
    }
}
function addCustomActualAtkEntry() {
    customActualAtkEntries.push({ name: '', percent: 0 });
    renderCustomActualAtkEntries();
    updateAllDOT();
}

function renderCustomDotIncEntries() {
    const container = document.getElementById('customDotIncContainer');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < customDotIncEntries.length; i++) {
        const entry = customDotIncEntries[i];
        const div = document.createElement('div');
        div.className = 'row';
        div.style.marginBottom = '8px';
        div.innerHTML = `
            <input type="text" class="custom-name" value="${escapeHtml(entry.name)}" placeholder="名称" style="flex:2;">
            <input type="number" class="custom-percent" value="${entry.percent === 0 ? '' : entry.percent}" step="1" placeholder="百分比" style="flex:1;">
            <button class="small-btn delete-custom" data-index="${i}" >删除</button>
        `;
        const nameInput = div.querySelector('.custom-name');
        const percentInput = div.querySelector('.custom-percent');
        const delBtn = div.querySelector('.delete-custom');
        nameInput.addEventListener('change', () => { customDotIncEntries[i].name = nameInput.value; });
        percentInput.addEventListener('input', () => {
            customDotIncEntries[i].percent = parseFloat(percentInput.value) || 0;
            updateAllDOT();
        });
        delBtn.addEventListener('click', () => {
            customDotIncEntries.splice(i, 1);
            renderCustomDotIncEntries();
            updateAllDOT();
        });
        container.appendChild(div);
    }
}
function addCustomDotIncEntry() {
    customDotIncEntries.push({ name: '', percent: 0 });
    renderCustomDotIncEntries();
    updateAllDOT();
}

function renderCustomPenVulnEntries() {
    const container = document.getElementById('customPenVulnContainer');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < customPenVulnEntries.length; i++) {
        const entry = customPenVulnEntries[i];
        const div = document.createElement('div');
        div.className = 'row';
        div.style.marginBottom = '8px';
        div.innerHTML = `
            <input type="text" class="custom-name" value="${escapeHtml(entry.name)}" placeholder="名称" style="flex:2;">
            <input type="number" class="custom-percent" value="${entry.percent === 0 ? '' : entry.percent}" step="1" placeholder="百分比" style="flex:1;">
            <button class="small-btn delete-custom" data-index="${i}" >删除</button>
        `;
        const nameInput = div.querySelector('.custom-name');
        const percentInput = div.querySelector('.custom-percent');
        const delBtn = div.querySelector('.delete-custom');
        nameInput.addEventListener('change', () => { customPenVulnEntries[i].name = nameInput.value; });
        percentInput.addEventListener('input', () => {
            customPenVulnEntries[i].percent = parseFloat(percentInput.value) || 0;
            updateAllDOT();
        });
        delBtn.addEventListener('click', () => {
            customPenVulnEntries.splice(i, 1);
            renderCustomPenVulnEntries();
            updateAllDOT();
        });
        container.appendChild(div);
    }
}
function addCustomPenVulnEntry() {
    customPenVulnEntries.push({ name: '', percent: 0 });
    renderCustomPenVulnEntries();
    updateAllDOT();
}

function renderCustomPersistentVulnEntries() {
    const container = document.getElementById('customPersistentVulnContainer');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < customPersistentVulnEntries.length; i++) {
        const entry = customPersistentVulnEntries[i];
        const div = document.createElement('div');
        div.className = 'row';
        div.style.marginBottom = '8px';
        div.innerHTML = `
            <input type="text" class="custom-name" value="${escapeHtml(entry.name)}" placeholder="名称" style="flex:2;">
            <input type="number" class="custom-percent" value="${entry.percent === 0 ? '' : entry.percent}" step="1" placeholder="百分比" style="flex:1;">
            <button class="small-btn delete-custom" data-index="${i}" >删除</button>
        `;
        const nameInput = div.querySelector('.custom-name');
        const percentInput = div.querySelector('.custom-percent');
        const delBtn = div.querySelector('.delete-custom');
        nameInput.addEventListener('change', () => { customPersistentVulnEntries[i].name = nameInput.value; });
        percentInput.addEventListener('input', () => {
            customPersistentVulnEntries[i].percent = parseFloat(percentInput.value) || 0;
            updateAllDOT();
        });
        delBtn.addEventListener('click', () => {
            customPersistentVulnEntries.splice(i, 1);
            renderCustomPersistentVulnEntries();
            updateAllDOT();
        });
        container.appendChild(div);
    }
}
function addCustomPersistentVulnEntry() {
    customPersistentVulnEntries.push({ name: '', percent: 0 });
    renderCustomPersistentVulnEntries();
    updateAllDOT();
}

// ================= 最终增伤自定义条目（加算） =================
function renderCustomFinalDmgEntries() {
    const container = document.getElementById('customFinalDmgContainer');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < customFinalDmgEntries.length; i++) {
        const entry = customFinalDmgEntries[i];
        const div = document.createElement('div');
        div.className = 'row';
        div.style.marginBottom = '8px';
        div.innerHTML = `
            <input type="text" class="custom-name" value="${escapeHtml(entry.name)}" placeholder="名称" style="flex:2;">
            <input type="number" class="custom-percent" value="${entry.percent === 0 ? '' : entry.percent}" step="1" placeholder="百分比" style="flex:1;">
            <button class="small-btn delete-custom" data-index="${i}" >删除</button>
        `;
        const nameInput = div.querySelector('.custom-name');
        const percentInput = div.querySelector('.custom-percent');
        const delBtn = div.querySelector('.delete-custom');
        nameInput.addEventListener('change', () => { customFinalDmgEntries[i].name = nameInput.value; });
        percentInput.addEventListener('input', () => {
            customFinalDmgEntries[i].percent = parseFloat(percentInput.value) || 0;
            updateAllDOT();
        });
        delBtn.addEventListener('click', () => {
            customFinalDmgEntries.splice(i, 1);
            renderCustomFinalDmgEntries();
            updateAllDOT();
        });
        container.appendChild(div);
    }
}
function addCustomFinalDmgEntry() {
    customFinalDmgEntries.push({ name: '', percent: 0 });
    renderCustomFinalDmgEntries();
    updateAllDOT();
}

// ================= 最终易伤自定义条目（乘算） =================
function renderCustomFinalVulnEntries() {
    const container = document.getElementById('customFinalVulnContainer');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < customFinalVulnEntries.length; i++) {
        const entry = customFinalVulnEntries[i];
        const div = document.createElement('div');
        div.className = 'row';
        div.style.marginBottom = '8px';
        div.innerHTML = `
            <input type="text" class="custom-name" value="${escapeHtml(entry.name)}" placeholder="名称" style="flex:2;">
            <input type="number" class="custom-percent" value="${entry.percent === 0 ? '' : entry.percent}" step="1" placeholder="百分比" style="flex:1;">
            <button class="small-btn delete-custom" data-index="${i}" >删除</button>
        `;
        const nameInput = div.querySelector('.custom-name');
        const percentInput = div.querySelector('.custom-percent');
        const delBtn = div.querySelector('.delete-custom');
        nameInput.addEventListener('change', () => { customFinalVulnEntries[i].name = nameInput.value; });
        percentInput.addEventListener('input', () => {
            customFinalVulnEntries[i].percent = parseFloat(percentInput.value) || 0;
            updateAllDOT();
        });
        delBtn.addEventListener('click', () => {
            customFinalVulnEntries.splice(i, 1);
            renderCustomFinalVulnEntries();
            updateAllDOT();
        });
        container.appendChild(div);
    }
}
function addCustomFinalVulnEntry() {
    customFinalVulnEntries.push({ name: '', percent: 0 });
    renderCustomFinalVulnEntries();
    updateAllDOT();
}

// ================= 攻击转化相关（原生实现） =================
let physConvParams = { base: 0, multiplier: 0, bonus: 0, hiddenBonus: 0 };
let magicConvParams = { base: 0, multiplier: 0, bonus: 0, hiddenBonus: 0 };
let physConversion = 0, magicConversion = 0;

function computeConversionValue(base, mult, bonus, hiddenBonus) {
    const multiplier = mult / 100;
    const bonusTotal = (bonus + hiddenBonus) / 100;
    return base * (1 + bonusTotal) * multiplier;
}

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
    let customSum = customDisplayAtkEntries.reduce((sum, e) => sum + (e.percent || 0), 0);
    base += customSum;
    return base;
}
function getExtraPercent() {
    let base = 0;
    let customSum = customActualAtkEntries.reduce((sum, e) => sum + (e.percent || 0), 0);
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

// ================= 全局乘区函数 =================
function getIncMult() {
    let tarotVal = (document.getElementById('tarot').value === 'hangman' ? 20 : 0);
    let buff = parseFloat(document.getElementById('incBuff').value) || 0;
    let yujieUlt = parseFloat(document.getElementById('yujieUlt').value) || 0;
    let yujiePersonality = parseFloat(document.getElementById('yujiePersonality').value) || 0;
    let hasha = parseFloat(document.getElementById('hashaAura').value) || 0;
    let customSum = customDotIncEntries.reduce((sum, e) => sum + (e.percent || 0), 0);
    let total = 1 + (tarotVal + buff + yujieUlt + yujiePersonality + hasha + customSum) / 100;
    document.getElementById('incMult').innerText = total.toFixed(2) + 'x';
    return total;
}
function getPenMult() {
    let puppet = 1 + (parseFloat(document.getElementById('puppet').value) || 0)/100;
    let nightmare = 1 + (parseFloat(document.getElementById('nightmare').value) || 0)/100;
    let penVuln = 1 + (parseFloat(document.getElementById('penVuln').value) || 0)/100;
    let customMult = 1;
    for (let entry of customPenVulnEntries) {
        customMult *= (1 + (entry.percent || 0) / 100);
    }
    let mult = puppet * nightmare * penVuln * customMult;
    mult = Math.min(mult, 3.0);
    document.getElementById('penMult').innerText = mult.toFixed(2) + 'x';
    return mult;
}
function getPersistentMult() {
    let momo = 1 + (parseFloat(document.getElementById('momoAura').value) || 0)/100;
    let boqi = 1 + (parseFloat(document.getElementById('boqiAura').value) || 0)/100;
    let charm = 1 + (parseFloat(document.getElementById('charm').value) || 0)/100;
    let customMult = 1;
    for (let entry of customPersistentVulnEntries) {
        customMult *= (1 + (entry.percent || 0) / 100);
    }
    let total = momo * boqi * charm * customMult;
    total = Math.min(total, 3.0);
    document.getElementById('persistentMult').innerText = total.toFixed(2) + 'x';
    return total;
}
function getWoundMult() {
    let layers = parseInt(document.getElementById('woundLayers').value) || 0;
    let woundMult = Math.pow(1.12, layers);
    document.getElementById('woundMult').innerText = woundMult.toFixed(2) + 'x';
    return woundMult;
}

// ================= DOT条目管理（支持生命百分比类） =================
let dotEntries = [];
let nextEntryId = 1;

function getEntryMultiplier(entryDiv) {
    let mode = entryDiv.querySelector('.entry-mode').value;
    if (mode === 'standard') {
        let fixedSelect = entryDiv.querySelector('.entry-fixed');
        if (fixedSelect.value === 'custom') {
            return (parseFloat(entryDiv.querySelector('.entry-custom-percent').value) || 0) / 100;
        } else {
            return parseFloat(fixedSelect.value);
        }
    } else if (mode === 'lifeLoss' || mode === 'scarTear') {
        return (parseFloat(entryDiv.querySelector('.entry-percent-input').value) || 0) / 100;
    } else {
        return 0;
    }
}
function getAttackBase(entryDiv) {
    let mode = entryDiv.querySelector('.entry-mode').value;
    if (mode === 'standard') {
        return getPhysActual() + getMagicActual();
    } else if (mode === 'lifeLoss' || mode === 'scarTear') {
        let attr = entryDiv.querySelector('.entry-attr').value;
        if (attr === 'phys') return getPhysActual();
        else return getMagicActual();
    } else {
        return 0;
    }
}
function getEntryTickCount(entryDiv) {
    return parseInt(entryDiv.querySelector('.entry-tick-count').value) || 0;
}
function computeEntrySingleDamage(entryDiv) {
    let mode = entryDiv.querySelector('.entry-mode').value;
    let inc = getIncMult();
    let persistent = getPersistentMult();
    let pen = getPenMult();
    let wound = getWoundMult();
    let immunity = parseFloat(document.getElementById('immunity').value) || 0;
    
    if (mode === 'standard' || mode === 'lifeLoss' || mode === 'scarTear') {
        // 攻击力类
        let attackBase = getAttackBase(entryDiv);
        let multiplier = getEntryMultiplier(entryDiv);
        let base = attackBase * multiplier;
        let total = base * inc * persistent * pen * wound;
        return total;
    } else if (mode === 'hpPercent') {
        // 生命百分比类
        let project = entryDiv.querySelector('.entry-hp-project').value;
        let enemyHp = parseFloat(entryDiv.querySelector('.entry-enemy-hp').value) || 0;
        let percent = 0;
        const infectionMap = {1:4,2:8,3:12,4:18,5:26,6:36,7:46,8:58,9:72};
        if (project === 'infection') {
            let layers = parseInt(entryDiv.querySelector('.entry-infection-layers').value);
            percent = infectionMap[layers] / 100;
        } else if (project === 'burn') {
            percent = 0.10;
        } else if (project === 'stigma') {
            percent = 0.05;
        } else if (project === 'erosion') {
            percent = 0.04;
        } else if (project === 'darkfire') {
            percent = 0.35;
        } else if (project === 'ancestor') {
            percent = 0.35;
        }
        let base = enemyHp * percent;
        let total = base * inc * persistent * pen * (1 - immunity);
        return total;
    }
    return 0;
}
function updateAllDOT() {
    let totalDamage = 0;
    let totalAtk = getPhysActual() + getMagicActual();
    document.getElementById('totalAtk').innerText = Math.round(totalAtk);
    
    // 最终增伤（加算）
    let finalDmgSkill = parseFloat(document.getElementById('finalDmgSkill').value) || 0;
    let customFinalDmgSum = customFinalDmgEntries.reduce((sum, e) => sum + (e.percent || 0), 0);
    let finalDmgMult = 1 + (finalDmgSkill + customFinalDmgSum) / 100;
    document.getElementById('statFinalMult').innerText = finalDmgMult.toFixed(2) + 'x';
    
    // 最终易伤（乘算）
    let finalVulnAura = parseFloat(document.getElementById('finalVulnAura').value) || 0;
    let finalVulnMult = (1 + finalVulnAura / 100);
    for (let entry of customFinalVulnEntries) {
        finalVulnMult *= (1 + (entry.percent || 0) / 100);
    }
    document.getElementById('statFinalVulnMult').innerText = finalVulnMult.toFixed(2) + 'x';
    
    for (let entryDiv of dotEntries) {
        let single = computeEntrySingleDamage(entryDiv);
        let ticks = getEntryTickCount(entryDiv);
        let entryTotal = single * ticks * finalDmgMult * finalVulnMult;
        let damageSpan = entryDiv.querySelector('.entry-damage-value');
        damageSpan.innerText = Math.round(entryTotal);
        totalDamage += entryTotal;
    }
    document.getElementById('dotTotal').innerText = Math.round(totalDamage);
    document.getElementById('dotFinalDisplay').innerHTML = `<small>🔥</small> ${Math.round(totalDamage)}`;
    updatePhysMagicDisplay();
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
    const infectionPercent = [4,8,12,18,26,36,46,58,72];
    for (let i = 1; i <= 9; i++) {
        layersSelect.innerHTML += `<option value="${i}">${i}层 (${infectionPercent[i-1]}%)</option>`;
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
    config.customDisplayAtkEntries = customDisplayAtkEntries.map(e => ({ name: e.name, percent: e.percent }));
    config.customActualAtkEntries = customActualAtkEntries.map(e => ({ name: e.name, percent: e.percent }));
    config.customDotIncEntries = customDotIncEntries.map(e => ({ name: e.name, percent: e.percent }));
    config.customPenVulnEntries = customPenVulnEntries.map(e => ({ name: e.name, percent: e.percent }));
    config.customPersistentVulnEntries = customPersistentVulnEntries.map(e => ({ name: e.name, percent: e.percent }));
    config.customFinalDmgEntries = customFinalDmgEntries.map(e => ({ name: e.name, percent: e.percent }));
    config.customFinalVulnEntries = customFinalVulnEntries.map(e => ({ name: e.name, percent: e.percent }));
    config.finalDmgSkill = document.getElementById('finalDmgSkill') ? document.getElementById('finalDmgSkill').value : '0';
    config.finalVulnAura = document.getElementById('finalVulnAura') ? document.getElementById('finalVulnAura').value : '0';
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
    if (config.customDisplayAtkEntries) {
        customDisplayAtkEntries = config.customDisplayAtkEntries.map(e => ({ name: e.name, percent: e.percent }));
        renderCustomDisplayAtkEntries();
    } else { customDisplayAtkEntries = []; renderCustomDisplayAtkEntries(); }
    if (config.customActualAtkEntries) {
        customActualAtkEntries = config.customActualAtkEntries.map(e => ({ name: e.name, percent: e.percent }));
        renderCustomActualAtkEntries();
    } else { customActualAtkEntries = []; renderCustomActualAtkEntries(); }
    if (config.customDotIncEntries) {
        customDotIncEntries = config.customDotIncEntries.map(e => ({ name: e.name, percent: e.percent }));
        renderCustomDotIncEntries();
    } else { customDotIncEntries = []; renderCustomDotIncEntries(); }
    if (config.customPenVulnEntries) {
        customPenVulnEntries = config.customPenVulnEntries.map(e => ({ name: e.name, percent: e.percent }));
        renderCustomPenVulnEntries();
    } else { customPenVulnEntries = []; renderCustomPenVulnEntries(); }
    if (config.customPersistentVulnEntries) {
        customPersistentVulnEntries = config.customPersistentVulnEntries.map(e => ({ name: e.name, percent: e.percent }));
        renderCustomPersistentVulnEntries();
    } else { customPersistentVulnEntries = []; renderCustomPersistentVulnEntries(); }
    if (config.customFinalDmgEntries) {
        customFinalDmgEntries = config.customFinalDmgEntries.map(e => ({ name: e.name, percent: e.percent }));
        renderCustomFinalDmgEntries();
    } else { customFinalDmgEntries = []; renderCustomFinalDmgEntries(); }
    if (config.customFinalVulnEntries) {
        customFinalVulnEntries = config.customFinalVulnEntries.map(e => ({ name: e.name, percent: e.percent }));
        renderCustomFinalVulnEntries();
    } else { customFinalVulnEntries = []; renderCustomFinalVulnEntries(); }
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
    customDisplayAtkEntries = []; renderCustomDisplayAtkEntries();
    customActualAtkEntries = []; renderCustomActualAtkEntries();
    customDotIncEntries = []; renderCustomDotIncEntries();
    customPenVulnEntries = []; renderCustomPenVulnEntries();
    customPersistentVulnEntries = []; renderCustomPersistentVulnEntries();
    customFinalDmgEntries = []; renderCustomFinalDmgEntries();
    customFinalVulnEntries = []; renderCustomFinalVulnEntries();
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
    if (addDisplayBtn) addDisplayBtn.addEventListener('click', addCustomDisplayAtkEntry);
    const addActualBtn = document.getElementById('addCustomActualAtkBtn');
    if (addActualBtn) addActualBtn.addEventListener('click', addCustomActualAtkEntry);
    const addDotIncBtn = document.getElementById('addCustomDotIncBtn');
    if (addDotIncBtn) addDotIncBtn.addEventListener('click', addCustomDotIncEntry);
    const addPenVulnBtn = document.getElementById('addCustomPenVulnBtn');
    if (addPenVulnBtn) addPenVulnBtn.addEventListener('click', addCustomPenVulnEntry);
    const addPersistentBtn = document.getElementById('addCustomPersistentVulnBtn');
    if (addPersistentBtn) addPersistentBtn.addEventListener('click', addCustomPersistentVulnEntry);
    const addFinalDmgBtn = document.getElementById('addCustomFinalDmgBtn');
    if (addFinalDmgBtn) addFinalDmgBtn.addEventListener('click', addCustomFinalDmgEntry);
    const addFinalVulnBtn = document.getElementById('addCustomFinalVulnBtn');
    if (addFinalVulnBtn) addFinalVulnBtn.addEventListener('click', addCustomFinalVulnEntry);
});

// ================= 记录管理模块 =================
(function() {
    let records = [];
    const STORAGE_KEY = 'DotDamageRecordsV6';

    function loadRecords() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            try { records = JSON.parse(raw); if (!Array.isArray(records)) records = []; } catch(e) { records = []; }
        } else { records = []; }
    }
    function saveRecords() { localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); }
    async function addRecord(name, config, damage) {
        records.unshift({ id: Date.now(), name: name.trim(), config, damage, date: new Date().toISOString() });
        saveRecords();
    }
    async function deleteRecord(id) { records = records.filter(r => r.id != id); saveRecords(); }
    async function clearAll() {
        if (confirm("确定清空所有记录吗？")) { records = []; saveRecords(); return true; }
        return false;
    }

    const fieldMeta = {
        physBase: { name: "基础物攻", zone: "⚔️ 攻击区间" },
        magicBase: { name: "基础魔攻", zone: "⚔️ 攻击区间" },
        atkBuff: { name: "攻击BUFF", zone: "⚔️ 攻击区间", unit: "%" },
        flag: { name: "战旗", zone: "⚔️ 攻击区间", unit: "%" },
        swordScepter: { name: "剑杖刻印", zone: "⚔️ 攻击区间", unit: "%" },
        basicAura: { name: "基础光环", zone: "⚔️ 攻击区间", unit: "%" },
        coordAttack: { name: "协攻", zone: "⚔️ 攻击区间", unit: "%" },
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

    function formatFieldValue(key, value) {
        if (value === undefined || value === null) return '—';
        let val = value.toString();
        if (key === 'woundLayers') {
            const layers = parseInt(val);
            if (isNaN(layers) || layers === 0) return '0层';
            const percent = (Math.pow(1.12, layers) - 1) * 100;
            return `${layers}层 (+${percent.toFixed(2)}%)`;
        }
        if (key === 'profession') return val === 'none' ? '无' : (val === 'watcher' ? '守望者' : val);
        if (key === 'tarot') return val === 'none' ? '无' : (val === 'hangman' ? '倒吊人' : val);
        if (key === 'immunity') {
            if (val === '0') return '无';
            if (val === '0.5') return '减免50%';
            if (val === '0.8') return '减免80%';
            if (val === '0.95') return '减免95%';
            return val;
        }
        if (key === 'finalDmgSkill') {
            return val === '0' ? '无' : (val === '10' ? '有 (10%)' : val + '%');
        }
        if (key === 'finalVulnAura') {
            return val === '0' ? '无' : (val === '10' ? '有 (10%)' : val + '%');
        }
        const unit = fieldMeta[key]?.unit || '';
        return val + (unit ? unit : '');
    }

    function formatDotEntry(entry) {
        if (entry.mode === 'standard') {
            let rateStr = entry.fixedValue === 'custom' ? `${entry.customPercent}%` : 
                (entry.fixedValue === '0.15' ? '次级冻伤(15%)' : 
                 (entry.fixedValue === '0.50' ? '冻伤(50%)' : 
                  (entry.fixedValue === '0.25' ? '点燃(25%)' : `${parseFloat(entry.fixedValue)*100}%`)));
            return `标准DOT [${rateStr}] ×${entry.tickCount}次`;
        } else if (entry.mode === 'lifeLoss') {
            let attrName = entry.attr === 'phys' ? '物攻' : '魔攻';
            return `生命流失 [${attrName} ${entry.percent}%] ×${entry.tickCount}次`;
        } else if (entry.mode === 'scarTear') {
            let attrName = entry.attr === 'phys' ? '物攻' : '魔攻';
            return `伤痕撕裂 [${attrName} ${entry.percent}%] ×${entry.tickCount}次`;
        } else if (entry.mode === 'hpPercent') {
            const projectMap = { infection:'感染', burn:'灼烧', stigma:'圣痕', erosion:'蚀炎', darkfire:'冥火', ancestor:'先祖之力' };
            let projectName = projectMap[entry.project] || entry.project;
            let detail = '';
            if (entry.project === 'infection') detail = ` ${entry.infectionLayers}层`;
            return `生命百分比类 [${projectName}${detail}] ×${entry.tickCount}次 (HP:${entry.enemyHp})`;
        }
        return '';
    }

    function getGroupedDetails(config) {
        const zoneOrder = ['⚔️ 攻击区间', '📈 持续伤害增伤', '🔻 穿透易伤', '🔥 持续伤害易伤', '🩸 伤口', '✨ 最终增伤区间', '🎯 最终易伤区间', '🌐 全局设置', '📊 DOT条目'];
        const groups = {};
        for (const [key, value] of Object.entries(config)) {
            if (key === 'dotEntries') continue;
            if (key.startsWith('custom')) continue;
            const meta = fieldMeta[key];
            if (!meta) continue;
            if (isFieldEmptyValue(key, value)) continue;
            if (!groups[meta.zone]) groups[meta.zone] = [];
            groups[meta.zone].push(`<div class="config-item"><strong>${meta.name}</strong>：${formatFieldValue(key, value)}</div>`);
        }
        const customZones = [
            { entries: config.customDisplayAtkEntries, zone: '⚔️ 攻击区间 (自定义显示)' },
            { entries: config.customActualAtkEntries, zone: '⚔️ 攻击区间 (自定义实际)' },
            { entries: config.customDotIncEntries, zone: '📈 持续伤害增伤 (自定义)' },
            { entries: config.customPenVulnEntries, zone: '🔻 穿透易伤 (自定义)' },
            { entries: config.customPersistentVulnEntries, zone: '🔥 持续伤害易伤 (自定义)' },
            { entries: config.customFinalDmgEntries, zone: '✨ 最终增伤区间 (自定义)' },
            { entries: config.customFinalVulnEntries, zone: '🎯 最终易伤区间 (自定义)' }
        ];
        for (const cz of customZones) {
            if (cz.entries && cz.entries.length) {
                if (!groups[cz.zone]) groups[cz.zone] = [];
                cz.entries.forEach(entry => {
                    groups[cz.zone].push(`<div class="config-item"><strong>${escapeHtml(entry.name)}</strong>：${entry.percent}%</div>`);
                });
            }
        }
        if (config.dotEntries && config.dotEntries.length) {
            groups['📊 DOT条目'] = [];
            for (let i = 0; i < config.dotEntries.length; i++) {
                groups['📊 DOT条目'].push(`<div class="config-item"><strong>条目 ${i+1}</strong>：${formatDotEntry(config.dotEntries[i])}</div>`);
            }
        }
        let html = '';
        for (const zone of zoneOrder) {
            if (groups[zone] && groups[zone].length) {
                html += `<div class="zone-title">${zone}</div><div class="config-grid">${groups[zone].join('')}</div>`;
            }
        }
        return html || '<div class="config-item">无有效配置项</div>';
    }

    function renderMultiCompare(recordsList) {
        if (!recordsList || recordsList.length < 2) return;
        const zoneOrder = ['⚔️ 攻击区间', '📈 持续伤害增伤', '🔻 穿透易伤', '🔥 持续伤害易伤', '🩸 伤口', '✨ 最终增伤区间', '🎯 最终易伤区间', '🌐 全局设置'];
        const zoneMap = {};
        for (const [key, meta] of Object.entries(fieldMeta)) {
            if (!zoneMap[meta.zone]) zoneMap[meta.zone] = [];
            zoneMap[meta.zone].push(key);
        }
        let fieldsToShow = [];
        for (const zone of zoneOrder) {
            const fields = zoneMap[zone] || [];
            for (const field of fields) {
                const values = recordsList.map(rec => rec.config[field] !== undefined ? rec.config[field] : '');
                const allEmpty = values.every(v => isFieldEmptyValue(field, v));
                if (!allEmpty) fieldsToShow.push({ field, zone, values });
            }
        }
        const customTypes = [
            { key: 'customDisplayAtkEntries', zone: '⚔️ 攻击区间', title: '显示攻击自定义' },
            { key: 'customActualAtkEntries', zone: '⚔️ 攻击区间', title: '实际攻击自定义' },
            { key: 'customDotIncEntries', zone: '📈 持续伤害增伤', title: '持续增伤自定义' },
            { key: 'customPenVulnEntries', zone: '🔻 穿透易伤', title: '穿透易伤自定义' },
            { key: 'customPersistentVulnEntries', zone: '🔥 持续伤害易伤', title: '持续易伤自定义' },
            { key: 'customFinalDmgEntries', zone: '✨ 最终增伤区间', title: '最终增伤自定义' },
            { key: 'customFinalVulnEntries', zone: '🎯 最终易伤区间', title: '最终易伤自定义' }
        ];
        for (const ct of customTypes) {
            let allNames = new Set();
            for (const rec of recordsList) {
                const entries = rec.config[ct.key] || [];
                entries.forEach(e => allNames.add(e.name));
            }
            const sortedNames = Array.from(allNames).sort();
            for (const name of sortedNames) {
                const values = [];
                for (const rec of recordsList) {
                    const entries = rec.config[ct.key] || [];
                    const entry = entries.find(e => e.name === name);
                    values.push(entry ? entry.percent : 0);
                }
                const allZero = values.every(v => v === 0);
                if (allZero) continue;
                fieldsToShow.push({
                    field: `custom_${ct.key}_${name}`,
                    zone: ct.zone,
                    values: values,
                    isCustom: true,
                    customName: name
                });
            }
        }
        fieldsToShow.sort((a, b) => zoneOrder.indexOf(a.zone) - zoneOrder.indexOf(b.zone));
        let html = '<div class="compare-table-wrapper"><table class="compare-table"><thead><th class="field-name">字段</th>';
        for (const rec of recordsList) html += `<th>${escapeHtml(rec.name)}</th>`;
        html += '</thead><tbody>';
        let currentZone = '';
        for (const item of fieldsToShow) {
            if (item.zone !== currentZone) {
                if (currentZone) html += '<tr class="zone-header"><td colspan="' + (recordsList.length + 1) + '">' + item.zone + '</td></tr>';
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
                    displayVal = item.values[i] + '%';
                } else {
                    displayVal = formatFieldValue(item.field, item.values[i]);
                }
                const cls = allSame ? '' : 'diff-highlight';
                html += `<td class="${cls}">${escapeHtml(displayVal)}</td>`;
            }
            html += '</tr>';
        }
        html += '<tr class="zone-header"><td colspan="' + (recordsList.length + 1) + '">📊 伤害对比</td></tr>';
        html += '<tr><td class="field-name">🔥 DOT总伤害</td>';
        for (const rec of recordsList) {
            html += `<td>${escapeHtml(String(rec.damage))}</td>`;
        }
        html += '</table></tbody></table></div>';
        document.getElementById('compareArea').innerHTML = html;
        const existingBtnDiv = document.getElementById('screenshotCompareBtn')?.parentElement;
        if (existingBtnDiv) existingBtnDiv.remove();
        const btnDiv = document.createElement('div');
        btnDiv.className = 'screenshot-btn-container';
        btnDiv.style.textAlign = 'center';
        btnDiv.style.marginBottom = '12px';
        const screenshotBtn = document.createElement('button');
        screenshotBtn.id = 'screenshotCompareBtn';
        screenshotBtn.className = 'screenshot-btn';
        screenshotBtn.innerHTML = '📸 截图对比';
        screenshotBtn.onclick = async () => {
            const wrapper = document.querySelector('#compareArea .compare-table-wrapper');
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
                showLoading('正在生成截图...');
                await new Promise(r => setTimeout(r, 100));
                const canvas = await html2canvas(clone, { scale: 2, backgroundColor: '#ffffff' });
                const link = document.createElement('a');
                const timestamp = new Date().toISOString().slice(0,19).replace(/:/g, '-');
                link.download = `DOT对比_${timestamp}.png`;
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
        document.getElementById('compareArea').insertBefore(btnDiv, document.getElementById('compareArea').firstChild);
    }

    function renderRecordsUI() {
        const area = document.getElementById('recordsListArea');
        if (!area) return;
        if (records.length === 0) {
            area.innerHTML = '<div style="padding:20px;text-align:center">✨ 暂无记录，请在计算器中点击“记录结果”保存配置。</div>';
            document.getElementById('compareArea').innerHTML = '';
            return;
        }
        let html = '';
        records.forEach(rec => {
            html += `<div class="record-card" data-id="${rec.id}">
                <div class="record-header">
                    <div><input type="checkbox" class="compare-check" value="${rec.id}"> <span class="record-name">📌 ${escapeHtml(rec.name)}</span></div>
                    <div class="record-damage">🔥 ${rec.damage}</div>
                    <div class="record-actions">
                        <button class="small-btn view-detail" data-id="${rec.id}">🔍 详情</button>
                        <button class="small-btn apply-record" data-id="${rec.id}">📥 填入计算器</button>
                        <button class="small-btn delete-record" data-id="${rec.id}">🗑️ 删除</button>
                    </div>
                </div>
                <div class="detail-panel" id="detail-${rec.id}" style="display:none;"></div>
            </div>`;
        });
        area.innerHTML = html;
        document.querySelectorAll('.view-detail').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                const rec = records.find(r => r.id === id);
                if (!rec) return;
                const panel = document.getElementById(`detail-${id}`);
                if (panel.style.display === 'block') { panel.style.display = 'none'; return; }
                panel.innerHTML = getGroupedDetails(rec.config) + `<div class="stat-badge" style="margin-top:12px;">🔥 DOT总伤害: ${rec.damage}</div>`;
                panel.style.display = 'block';
            });
        });
        document.querySelectorAll('.apply-record').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                const rec = records.find(r => r.id === id);
                if (rec) { applyFullConfig(rec.config); document.getElementById('recordModal').classList.remove('active'); }
            });
        });
        document.querySelectorAll('.delete-record').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = parseInt(btn.dataset.id);
                await deleteRecord(id);
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

    function updateCompareSelection() {
        const checks = document.querySelectorAll('.compare-check');
        const selected = [];
        checks.forEach(ch => { if (ch.checked) selected.push(parseInt(ch.value)); });
        const compareArea = document.getElementById('compareArea');
        if (selected.length >= 2) {
            const selectedRecords = selected.map(id => records.find(r => r.id === id)).filter(r => r);
            if (selectedRecords.length) renderMultiCompare(selectedRecords);
            else compareArea.innerHTML = '';
        } else {
            compareArea.innerHTML = selected.length === 1 ? '<div class="stat-badge">📊 至少选择两条记录进行对比</div>' : '<div class="stat-badge">📊 勾选记录可进行对比（支持多条）</div>';
        }
    }

    async function handleRecord() {
        let name = prompt('为本次记录命名 (最多20字)', 'DOT配置 ' + new Date().toLocaleTimeString());
        if (!name) return;
        name = name.trim();
        if (name === '') { alert('记录名称不能为空'); return; }
        if (name.length > 20) name = name.slice(0,20);
        const existing = records.find(r => r.name === name);
        if (existing) {
            if (!confirm(`记录“${name}”已存在，是否覆盖？`)) return;
            await deleteRecord(existing.id);
        }
        const config = getFullConfig();
        const damage = parseInt(document.getElementById('dotFinalDisplay').innerText.replace(/[^0-9-]/g, ''));
        await addRecord(name, config, damage);
        alert(`已记录“${name}”`);
    }

    document.getElementById('recordBtn').onclick = handleRecord;
    document.getElementById('queryBtn').onclick = () => { loadRecords(); renderRecordsUI(); document.getElementById('recordModal').classList.add('active'); };
    document.getElementById('clearBtn').onclick = async () => { if (await clearAll()) { alert('所有记录已清空'); if (document.getElementById('recordModal').classList.contains('active')) renderRecordsUI(); } };
    document.getElementById('closeModalBtn').onclick = () => document.getElementById('recordModal').classList.remove('active');
    document.getElementById('recordModal').addEventListener('click', (e) => { if (e.target === document.getElementById('recordModal')) document.getElementById('recordModal').classList.remove('active'); });
    loadRecords();
})();

preloadScreenshot();