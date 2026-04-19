// penetration/calculator.js
import { preloadScreenshot, loadHtml2Canvas, showLoading, hideLoading, showScreenshotError } from '../common/screenshot.js';

// ================= 自定义条目数组（全局） =================
let customDisplayAtkEntries = [];
let customActualAtkEntries = [];
let customLifeBonusEntries = [];
let customPenDmgEntries = [];
let customPenVulnEntries = [];
let customFinalDmgEntries = [];
let customFinalVulnEntries = []; // 新增：最终易伤自定义条目

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
            updatePenetration();
        });
        delBtn.addEventListener('click', () => {
            customDisplayAtkEntries.splice(i, 1);
            renderCustomDisplayAtkEntries();
            updatePenetration();
        });
        container.appendChild(div);
    }
}
function addCustomDisplayAtkEntry() {
    customDisplayAtkEntries.push({ name: '', percent: 0 });
    renderCustomDisplayAtkEntries();
    updatePenetration();
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
            updatePenetration();
        });
        delBtn.addEventListener('click', () => {
            customActualAtkEntries.splice(i, 1);
            renderCustomActualAtkEntries();
            updatePenetration();
        });
        container.appendChild(div);
    }
}
function addCustomActualAtkEntry() {
    customActualAtkEntries.push({ name: '', percent: 0 });
    renderCustomActualAtkEntries();
    updatePenetration();
}

function renderCustomLifeBonusEntries() {
    const container = document.getElementById('customLifeBonusContainer');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < customLifeBonusEntries.length; i++) {
        const entry = customLifeBonusEntries[i];
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
        nameInput.addEventListener('change', () => { customLifeBonusEntries[i].name = nameInput.value; });
        percentInput.addEventListener('input', () => {
            customLifeBonusEntries[i].percent = parseFloat(percentInput.value) || 0;
            updatePenetration();
        });
        delBtn.addEventListener('click', () => {
            customLifeBonusEntries.splice(i, 1);
            renderCustomLifeBonusEntries();
            updatePenetration();
        });
        container.appendChild(div);
    }
}
function addCustomLifeBonusEntry() {
    customLifeBonusEntries.push({ name: '', percent: 0 });
    renderCustomLifeBonusEntries();
    updatePenetration();
}

function renderCustomPenDmgEntries() {
    const container = document.getElementById('customPenDmgContainer');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < customPenDmgEntries.length; i++) {
        const entry = customPenDmgEntries[i];
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
        nameInput.addEventListener('change', () => { customPenDmgEntries[i].name = nameInput.value; });
        percentInput.addEventListener('input', () => {
            customPenDmgEntries[i].percent = parseFloat(percentInput.value) || 0;
            updatePenetration();
        });
        delBtn.addEventListener('click', () => {
            customPenDmgEntries.splice(i, 1);
            renderCustomPenDmgEntries();
            updatePenetration();
        });
        container.appendChild(div);
    }
}
function addCustomPenDmgEntry() {
    customPenDmgEntries.push({ name: '', percent: 0 });
    renderCustomPenDmgEntries();
    updatePenetration();
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
            updatePenetration();
        });
        delBtn.addEventListener('click', () => {
            customPenVulnEntries.splice(i, 1);
            renderCustomPenVulnEntries();
            updatePenetration();
        });
        container.appendChild(div);
    }
}
function addCustomPenVulnEntry() {
    customPenVulnEntries.push({ name: '', percent: 0 });
    renderCustomPenVulnEntries();
    updatePenetration();
}

function renderCustomFinalDmgEntries() {
    const container = document.getElementById('customFinalDmgContainer');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < customFinalDmgEntries.length; i++) {
        const entry = customFinalDmgEntries[i];
        const div = document.createElement('div');
        div.className = 'row';
        div.style.marginBottom = '8px';
        div.style.alignItems = 'center';
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
            updatePenetration();
        });
        delBtn.addEventListener('click', () => {
            customFinalDmgEntries.splice(i, 1);
            renderCustomFinalDmgEntries();
            updatePenetration();
        });
        container.appendChild(div);
    }
}
function addCustomFinalDmgEntry() {
    customFinalDmgEntries.push({ name: '', percent: 0 });
    renderCustomFinalDmgEntries();
    updatePenetration();
}

// ================= 新增：最终易伤自定义条目 =================
function renderCustomFinalVulnEntries() {
    const container = document.getElementById('customFinalVulnContainer');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < customFinalVulnEntries.length; i++) {
        const entry = customFinalVulnEntries[i];
        const div = document.createElement('div');
        div.className = 'row';
        div.style.marginBottom = '8px';
        div.style.alignItems = 'center';
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
            updatePenetration();
        });
        delBtn.addEventListener('click', () => {
            customFinalVulnEntries.splice(i, 1);
            renderCustomFinalVulnEntries();
            updatePenetration();
        });
        container.appendChild(div);
    }
}
function addCustomFinalVulnEntry() {
    customFinalVulnEntries.push({ name: '', percent: 0 });
    renderCustomFinalVulnEntries();
    updatePenetration();
}

// ================= 攻击转化相关（支持单攻/双攻） =================
let singleDisplayConvParams = { base: 0, multiplier: 0, bonus: 0, hiddenBonus: 0 };
let singleActualConvParams = { base: 0, multiplier: 0, bonus: 0, hiddenBonus: 0 };
let singleDisplayConversion = 0;
let singleActualConversion = 0;
let physConvParams = { base: 0, multiplier: 0, bonus: 0, hiddenBonus: 0 };
let magicConvParams = { base: 0, multiplier: 0, bonus: 0, hiddenBonus: 0 };
let physConversion = 0;
let magicConversion = 0;

let attackMode = 'single';

function computeConversionValue(base, mult, bonus, hiddenBonus) {
    const multiplier = mult / 100;
    const bonusTotal = (bonus + hiddenBonus) / 100;
    return base * (1 + bonusTotal) * multiplier;
}

singleDisplayConversion = computeConversionValue(singleDisplayConvParams.base, singleDisplayConvParams.multiplier, singleDisplayConvParams.bonus, singleDisplayConvParams.hiddenBonus);
singleActualConversion = computeConversionValue(singleActualConvParams.base, singleActualConvParams.multiplier, singleActualConvParams.bonus, singleActualConvParams.hiddenBonus);
physConversion = computeConversionValue(physConvParams.base, physConvParams.multiplier, physConvParams.bonus, physConvParams.hiddenBonus);
magicConversion = computeConversionValue(magicConvParams.base, magicConvParams.multiplier, magicConvParams.bonus, magicConvParams.hiddenBonus);

function openSingleDisplayModal() {
    const title = '显示攻击转化';
    document.getElementById('conversionTitle').innerText = title;
    document.getElementById('convBaseValue').value = singleDisplayConvParams.base;
    document.getElementById('convMultiplier').value = singleDisplayConvParams.multiplier;
    document.getElementById('convBonus').value = singleDisplayConvParams.bonus;
    document.getElementById('convHiddenBonus').value = singleDisplayConvParams.hiddenBonus;
    const result = computeConversionValue(singleDisplayConvParams.base, singleDisplayConvParams.multiplier, singleDisplayConvParams.bonus, singleDisplayConvParams.hiddenBonus);
    document.getElementById('convResultValue').innerText = Math.round(result);
    document.getElementById('conversionModal').classList.add('active');
    window._currentConversionCallback = (params) => {
        singleDisplayConvParams = params;
        singleDisplayConversion = computeConversionValue(params.base, params.multiplier, params.bonus, params.hiddenBonus);
        updatePenetration();
    };
}
function openSingleActualModal() {
    const title = '实际攻击转化';
    document.getElementById('conversionTitle').innerText = title;
    document.getElementById('convBaseValue').value = singleActualConvParams.base;
    document.getElementById('convMultiplier').value = singleActualConvParams.multiplier;
    document.getElementById('convBonus').value = singleActualConvParams.bonus;
    document.getElementById('convHiddenBonus').value = singleActualConvParams.hiddenBonus;
    const result = computeConversionValue(singleActualConvParams.base, singleActualConvParams.multiplier, singleActualConvParams.bonus, singleActualConvParams.hiddenBonus);
    document.getElementById('convResultValue').innerText = Math.round(result);
    document.getElementById('conversionModal').classList.add('active');
    window._currentConversionCallback = (params) => {
        singleActualConvParams = params;
        singleActualConversion = computeConversionValue(params.base, params.multiplier, params.bonus, params.hiddenBonus);
        updatePenetration();
    };
}
function openPhysModal() {
    const title = '物攻转化';
    document.getElementById('conversionTitle').innerText = title;
    document.getElementById('convBaseValue').value = physConvParams.base;
    document.getElementById('convMultiplier').value = physConvParams.multiplier;
    document.getElementById('convBonus').value = physConvParams.bonus;
    document.getElementById('convHiddenBonus').value = physConvParams.hiddenBonus;
    const result = computeConversionValue(physConvParams.base, physConvParams.multiplier, physConvParams.bonus, physConvParams.hiddenBonus);
    document.getElementById('convResultValue').innerText = Math.round(result);
    document.getElementById('conversionModal').classList.add('active');
    window._currentConversionCallback = (params) => {
        physConvParams = params;
        physConversion = computeConversionValue(params.base, params.multiplier, params.bonus, params.hiddenBonus);
        updatePenetration();
    };
}
function openMagicModal() {
    const title = '魔攻转化';
    document.getElementById('conversionTitle').innerText = title;
    document.getElementById('convBaseValue').value = magicConvParams.base;
    document.getElementById('convMultiplier').value = magicConvParams.multiplier;
    document.getElementById('convBonus').value = magicConvParams.bonus;
    document.getElementById('convHiddenBonus').value = magicConvParams.hiddenBonus;
    const result = computeConversionValue(magicConvParams.base, magicConvParams.multiplier, magicConvParams.bonus, magicConvParams.hiddenBonus);
    document.getElementById('convResultValue').innerText = Math.round(result);
    document.getElementById('conversionModal').classList.add('active');
    window._currentConversionCallback = (params) => {
        magicConvParams = params;
        magicConversion = computeConversionValue(params.base, params.multiplier, params.bonus, params.hiddenBonus);
        updatePenetration();
    };
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
    if (window._currentConversionCallback) {
        window._currentConversionCallback(params);
        window._currentConversionCallback = null;
    }
    closeConversionModal();
}
function resetConversion() {
    const title = document.getElementById('conversionTitle').innerText;
    if (title.includes('显示攻击转化')) {
        singleDisplayConvParams = { base: 0, multiplier: 0, bonus: 0, hiddenBonus: 0 };
        singleDisplayConversion = 0;
        openSingleDisplayModal();
    } else if (title.includes('实际攻击转化')) {
        singleActualConvParams = { base: 0, multiplier: 0, bonus: 0, hiddenBonus: 0 };
        singleActualConversion = 0;
        openSingleActualModal();
    } else if (title.includes('物攻转化')) {
        physConvParams = { base: 0, multiplier: 0, bonus: 0, hiddenBonus: 0 };
        physConversion = 0;
        openPhysModal();
    } else if (title.includes('魔攻转化')) {
        magicConvParams = { base: 0, multiplier: 0, bonus: 0, hiddenBonus: 0 };
        magicConversion = 0;
        openMagicModal();
    }
    updatePenetration();
}

// ================= DOM 元素引用 =================
const penAtkBaseSingle = document.getElementById('penAtkBaseSingle');
const penNormalPercentSingle = document.getElementById('penNormalPercentSingle');
const statDisplayConversionSingle = document.getElementById('statDisplayConversionSingle');
const penDisplayAtkSingle = document.getElementById('penDisplayAtkSingle');
const penExtraPercentSingle = document.getElementById('penExtraPercentSingle');
const statActualConversionSingle = document.getElementById('statActualConversionSingle');
const penActualAtkSingle = document.getElementById('penActualAtkSingle');
const penAtkPhys = document.getElementById('penAtkPhys');
const penAtkMagic = document.getElementById('penAtkMagic');
const penNormalPercentDouble = document.getElementById('penNormalPercentDouble');
const statPhysConversion = document.getElementById('statPhysConversion');
const penPhysDisplay = document.getElementById('penPhysDisplay');
const statMagicConversion = document.getElementById('statMagicConversion');
const penMagicDisplay = document.getElementById('penMagicDisplay');
const penExtraPercentDouble = document.getElementById('penExtraPercentDouble');
const penPhysActual = document.getElementById('penPhysActual');
const penMagicActual = document.getElementById('penMagicActual');
const penAtkBuff = document.getElementById('penAtkBuff');
const penFlag = document.getElementById('penFlag');
const penSwordScepter = document.getElementById('penSwordScepter');
const penBasicAura = document.getElementById('penBasicAura');
const penCoordAttack = document.getElementById('penCoordAttack');
const penHighland = document.getElementById('penHighland');
const penLowland = document.getElementById('penLowland');
const penHangmanMark = document.getElementById('penHangmanMark');
const penWeaknessInsight = document.getElementById('penWeaknessInsight');
const penProfession = document.getElementById('penProfession');
const penWeakness = document.getElementById('penWeakness');
const penTarot = document.getElementById('penTarot');
const penLifeType = document.getElementById('penLifeType');
const penLifeValue = document.getElementById('penLifeValue');
const penLifeAtk = document.getElementById('penLifeAtk');
const penLifeTargetHp = document.getElementById('penLifeTargetHp');
const penSkillMult = document.getElementById('penSkillMult');
const penDreamTalk = document.getElementById('penDreamTalk');
const penLukarAura = document.getElementById('penLukarAura');
const penIsilindAura = document.getElementById('penIsilindAura');
const penPrism = document.getElementById('penPrism');
const penHeavyAssault = document.getElementById('penHeavyAssault');
const penMaishaAura = document.getElementById('penMaishaAura');
const penTriggerCoop = document.getElementById('penTriggerCoop');
const penXiaoSuPersonality = document.getElementById('penXiaoSuPersonality');
const penGloryGuide = document.getElementById('penGloryGuide');
const penAnnaAura = document.getElementById('penAnnaAura');
const penWoundLayers = document.getElementById('penWoundLayers');
const penEmperorCold = document.getElementById('penEmperorCold');
const penPuppet = document.getElementById('penPuppet');
const penNightmare = document.getElementById('penNightmare');
const penPenVuln = document.getElementById('penPenVuln');
const penImmunity = document.getElementById('penImmunity');
const penLifeBaseSpan = document.getElementById('penLifeBase');
const penBonusTotalSpan = document.getElementById('penBonusTotal');
const penLifeResultSpan = document.getElementById('penLifeResult');
const penDmgMultSpan = document.getElementById('penDmgMult');
const penVulnMultSpan = document.getElementById('penVulnMult');
const penDamageDisplay = document.getElementById('penDamageDisplay');
const penBonusOptionsDiv = document.getElementById('penBonusOptions');
const penBonusSectionDiv = document.getElementById('penBonusSection');
// 新增最终易伤元素
const finalVulnAuraSelect = document.getElementById('finalVulnAura');
const finalVulnMultSpan = document.getElementById('finalVulnMult');

function getNum(id) { return parseFloat(document.getElementById(id).value) || 0; }

function getProfAtkBonus() {
    const prof = penProfession.value;
    if (prof === 'watcher') return 12;
    return 0;
}
function getNormalPercent() {
    let base = (parseFloat(penAtkBuff.value) || 0) +
               (parseFloat(penFlag.value) || 0) +
               (parseFloat(penSwordScepter.value) || 0) +
               (parseFloat(penBasicAura.value) || 0) +
               (parseFloat(penCoordAttack.value) || 0);
    base += getProfAtkBonus();
    let customSum = customDisplayAtkEntries.reduce((sum, e) => sum + (e.percent || 0), 0);
    base += customSum;
    return base;
}
function getExtraPercent() {
    let base = (parseFloat(penHighland.value) || 0) +
               (parseFloat(penLowland.value) || 0) +
               (parseFloat(penHangmanMark.value) || 0) +
               (parseFloat(penWeaknessInsight.value) || 0);
    let customSum = customActualAtkEntries.reduce((sum, e) => sum + (e.percent || 0), 0);
    base += customSum;
    return base;
}
function getSingleDisplayAtk() {
    let atkBase = parseFloat(penAtkBaseSingle.value) || 0;
    let normalPercent = getNormalPercent();
    return atkBase * (1 + normalPercent / 100) + singleDisplayConversion;
}
function getSingleActualAtk() {
    let atkBase = parseFloat(penAtkBaseSingle.value) || 0;
    let normalPercent = getNormalPercent();
    let displayAtk = atkBase * (1 + normalPercent / 100) + singleDisplayConversion;
    let extraPercent = getExtraPercent();
    return displayAtk + atkBase * (extraPercent / 100) + singleActualConversion;
}
function getPhysDisplayAtk() {
    let physBase = parseFloat(penAtkPhys.value) || 0;
    let normalPercent = getNormalPercent();
    return physBase * (1 + normalPercent / 100) + physConversion;
}
function getMagicDisplayAtk() {
    let magicBase = parseFloat(penAtkMagic.value) || 0;
    let normalPercent = getNormalPercent();
    return magicBase * (1 + normalPercent / 100) + magicConversion;
}
function getPhysActualAtk() {
    let physBase = parseFloat(penAtkPhys.value) || 0;
    let normalPercent = getNormalPercent();
    let displayAtk = physBase * (1 + normalPercent / 100) + physConversion;
    let extraPercent = getExtraPercent();
    return displayAtk + physBase * (extraPercent / 100);
}
function getMagicActualAtk() {
    let magicBase = parseFloat(penAtkMagic.value) || 0;
    let normalPercent = getNormalPercent();
    let displayAtk = magicBase * (1 + normalPercent / 100) + magicConversion;
    let extraPercent = getExtraPercent();
    return displayAtk + magicBase * (extraPercent / 100);
}
function getActualAttackForDamage() {
    if (attackMode === 'single') {
        return getSingleActualAtk();
    } else {
        return getPhysActualAtk() + getMagicActualAtk();
    }
}
function updateAttackUI() {
    const singleArea = document.getElementById('singleAttackArea');
    const doubleArea = document.getElementById('doubleAttackArea');
    const singleDisplay = document.getElementById('singleDisplayArea');
    const doubleDisplay = document.getElementById('doubleDisplayArea');
    const singleActual = document.getElementById('singleActualArea');
    const doubleActual = document.getElementById('doubleActualArea');

    if (attackMode === 'single') {
        singleArea.style.display = 'block';
        doubleArea.style.display = 'none';
        singleDisplay.style.display = 'block';
        doubleDisplay.style.display = 'none';
        singleActual.style.display = 'block';
        doubleActual.style.display = 'none';

        const normalPercent = getNormalPercent();
        const extraPercent = getExtraPercent();
        penNormalPercentSingle.innerText = normalPercent.toFixed(1);
        statDisplayConversionSingle.innerText = Math.round(singleDisplayConversion);
        penDisplayAtkSingle.innerText = Math.round(getSingleDisplayAtk());
        penExtraPercentSingle.innerText = extraPercent.toFixed(1);
        statActualConversionSingle.innerText = Math.round(singleActualConversion);
        penActualAtkSingle.innerText = Math.round(getSingleActualAtk());
    } else {
        singleArea.style.display = 'none';
        doubleArea.style.display = 'block';
        singleDisplay.style.display = 'none';
        doubleDisplay.style.display = 'block';
        singleActual.style.display = 'none';
        doubleActual.style.display = 'block';

        const normalPercent = getNormalPercent();
        const extraPercent = getExtraPercent();
        penNormalPercentDouble.innerText = normalPercent.toFixed(1);
        statPhysConversion.innerText = Math.round(physConversion);
        penPhysDisplay.innerText = Math.round(getPhysDisplayAtk());
        statMagicConversion.innerText = Math.round(magicConversion);
        penMagicDisplay.innerText = Math.round(getMagicDisplayAtk());
        penExtraPercentDouble.innerText = extraPercent.toFixed(1);
        penPhysActual.innerText = Math.round(getPhysActualAtk());
        penMagicActual.innerText = Math.round(getMagicActualAtk());
    }
}

function computeLifeBase() {
    const type = penLifeType.value;
    const rate = getNum('penLifeValue') / 100;
    if (type === 'fixed') return rate;
    if (type === 'atkPercent') return getNum('penLifeAtk') * rate;
    if (type === 'hpPercent') return getNum('penLifeTargetHp') * rate;
    return 0;
}
function computeBonusTotal() {
    let total = 0;
    let customSum = customLifeBonusEntries.reduce((sum, e) => sum + (e.percent || 0), 0);
    total += customSum;
    if (penTarot.value === 'fool' && penLifeType.value === 'hpPercent') total += 20;
    return total;
}
function getPenetrationDmgBonus() {
    let bonus = 0;
    if (penTarot.value === 'death') bonus += 13;
    if (penProfession.value === 'watcher') bonus += 20;
    bonus += parseFloat(penDreamTalk.value) || 0;
    bonus += parseFloat(penLukarAura.value) || 0;
    bonus += parseFloat(penIsilindAura.value) || 0;
    bonus += parseFloat(penPrism.value) || 0;
    bonus += parseFloat(penHeavyAssault.value) || 0;
    bonus += parseFloat(penMaishaAura.value) || 0;
    bonus += parseFloat(penTriggerCoop.value) || 0;
    bonus += parseFloat(penXiaoSuPersonality.value) || 0;
    bonus += parseFloat(penGloryGuide.value) || 0;
    bonus += parseFloat(penAnnaAura.value) || 0;
    let customSum = customPenDmgEntries.reduce((sum, e) => sum + (e.percent || 0), 0);
    bonus += customSum;
    return bonus;
}
function computeVulnMult() {
    let woundLayers = parseInt(penWoundLayers.value) || 0;
    let woundMult = Math.pow(1.12, woundLayers);
    let puppet = parseFloat(penPuppet.value) || 0;
    let nightmare = parseFloat(penNightmare.value) || 0;
    let penVuln = parseFloat(penPenVuln.value) || 0;
    let immunity = parseFloat(penImmunity.value) || 0;
    let customMult = 1;
    for (let entry of customPenVulnEntries) {
        customMult *= (1 + (entry.percent || 0) / 100);
    }
    let other = (1 + puppet/100) * (1 + nightmare/100) * (1 + penVuln/100) * (1 - immunity) * customMult;
    other = Math.min(other, 3.0);
    let total = woundMult * other;
    penVulnMultSpan.textContent = total.toFixed(2) + 'x';
    return total;
}
function toggleBonusOptions() {
    const showBonus = (penLifeType.value === 'hpPercent');
    if (penBonusOptionsDiv) penBonusOptionsDiv.style.display = showBonus ? 'block' : 'none';
    if (penBonusSectionDiv) penBonusSectionDiv.style.display = showBonus ? 'block' : 'none';
}
function toggleLifeRows() {
    const type = penLifeType.value;
    const hpRow = document.getElementById('penLifeHpRow');
    const atkRow = document.getElementById('penLifeAtkRow');
    if (type === 'hpPercent') { hpRow.style.display = 'flex'; atkRow.style.display = 'none'; }
    else if (type === 'atkPercent') { hpRow.style.display = 'none'; atkRow.style.display = 'flex'; }
    else { hpRow.style.display = 'none'; atkRow.style.display = 'none'; }
    toggleBonusOptions();
}
function updatePenetration() {
    let actualAtk = getActualAttackForDamage();
    let skillMult = getNum('penSkillMult') / 100;
    let weakness = parseFloat(penWeakness.value) || 1.0;
    let attackPart = actualAtk * weakness * skillMult;
    let lifeBase = computeLifeBase();
    penLifeBaseSpan.textContent = Math.round(lifeBase);
    let finalLifePart = lifeBase;
    if (penLifeType.value === 'hpPercent') {
        let bonusTotal = computeBonusTotal();
        penBonusTotalSpan.textContent = bonusTotal.toFixed(1);
        finalLifePart = lifeBase * (1 + bonusTotal / 100);
    } else {
        penBonusTotalSpan.textContent = '0';
        finalLifePart = lifeBase;
    }
    penLifeResultSpan.textContent = Math.round(finalLifePart);
    let dmgBonus = getPenetrationDmgBonus();
    let dmgMult = 1 + dmgBonus / 100;
    penDmgMultSpan.textContent = dmgMult.toFixed(2) + 'x';
    let vulnMult = computeVulnMult();
    penVulnMultSpan.textContent = vulnMult.toFixed(2) + 'x';

    // 最终增伤（加算）
    let emperorCold = parseFloat(penEmperorCold.value) || 0;
    let finalMult = 1 + emperorCold / 100;
    for (let entry of customFinalDmgEntries) {
        finalMult += (entry.percent || 0) / 100;
    }
    document.getElementById('finalDmgMult').innerText = finalMult.toFixed(2) + 'x';

    // 最终易伤（乘算）
    let finalVulnAura = parseFloat(finalVulnAuraSelect.value) || 0;
    let finalVulnMult = (1 + finalVulnAura / 100);
    for (let entry of customFinalVulnEntries) {
        finalVulnMult *= (1 + (entry.percent || 0) / 100);
    }
    if (finalVulnMultSpan) finalVulnMultSpan.innerText = finalVulnMult.toFixed(2) + 'x';

    let finalDamage = (attackPart + finalLifePart) * dmgMult * vulnMult * finalMult * finalVulnMult;
    finalDamage = Math.round(finalDamage);
    penDamageDisplay.innerHTML = `<small>✨</small> ${finalDamage}`;
    updateAttackUI();
}
function resetAll() {
    if (attackMode === 'single') {
        penAtkBaseSingle.value = '3000';
    } else {
        penAtkPhys.value = '3000';
        penAtkMagic.value = '3000';
    }
    penAtkBuff.value = '0';
    penFlag.value = '0';
    penSwordScepter.value = '0';
    penBasicAura.value = '0';
    penCoordAttack.value = '0';
    penHighland.value = '0';
    penLowland.value = '0';
    penHangmanMark.value = '0';
    penWeaknessInsight.value = '0';
    penProfession.value = 'none';
    penWeakness.value = '1.0';
    penTarot.value = 'none';
    penSkillMult.value = '100';
    penLifeType.value = 'hpPercent';
    penLifeValue.value = '0';
    penLifeTargetHp.value = '10000';
    penLifeAtk.value = '3000';
    penDreamTalk.value = '0';
    penLukarAura.value = '0';
    penIsilindAura.value = '0';
    penPrism.value = '0';
    penHeavyAssault.value = '0';
    penMaishaAura.value = '0';
    penTriggerCoop.value = '0';
    penXiaoSuPersonality.value = '0';
    penGloryGuide.value = '0';
    penAnnaAura.value = '0';
    penWoundLayers.value = '0';
    penEmperorCold.value = '0';
    penPuppet.value = '0';
    penNightmare.value = '0';
    penPenVuln.value = '0';
    penImmunity.value = '0';
    if (finalVulnAuraSelect) finalVulnAuraSelect.value = '0';
    singleDisplayConvParams = { base: 0, multiplier: 0, bonus: 0, hiddenBonus: 0 };
    singleActualConvParams = { base: 0, multiplier: 0, bonus: 0, hiddenBonus: 0 };
    singleDisplayConversion = 0;
    singleActualConversion = 0;
    physConvParams = { base: 0, multiplier: 0, bonus: 0, hiddenBonus: 0 };
    magicConvParams = { base: 0, multiplier: 0, bonus: 0, hiddenBonus: 0 };
    physConversion = 0;
    magicConversion = 0;
    customDisplayAtkEntries = [];
    renderCustomDisplayAtkEntries();
    customActualAtkEntries = [];
    renderCustomActualAtkEntries();
    customLifeBonusEntries = [];
    renderCustomLifeBonusEntries();
    customPenDmgEntries = [];
    renderCustomPenDmgEntries();
    customPenVulnEntries = [];
    renderCustomPenVulnEntries();
    customFinalDmgEntries = [];
    renderCustomFinalDmgEntries();
    customFinalVulnEntries = [];
    renderCustomFinalVulnEntries();
    toggleLifeRows();
    updatePenetration();
}
const allInputs = document.querySelectorAll('input, select');
allInputs.forEach(el => el.addEventListener('input', () => {
    updatePenetration();
}));
penLifeType.addEventListener('change', () => { toggleLifeRows(); updatePenetration(); });
document.getElementById('resetToDefault').addEventListener('click', resetAll);
toggleLifeRows();
updatePenetration();

document.getElementById('attackModeSelect').addEventListener('change', (e) => {
    attackMode = e.target.value;
    updateAttackUI();
    updatePenetration();
});

document.getElementById('openConversionBtnDisplaySingle').addEventListener('click', openSingleDisplayModal);
document.getElementById('openConversionBtnActualSingle').addEventListener('click', openSingleActualModal);
document.getElementById('openPhysConv').addEventListener('click', openPhysModal);
document.getElementById('openMagicConv').addEventListener('click', openMagicModal);
document.getElementById('closeConversionModal').addEventListener('click', closeConversionModal);
document.getElementById('applyConversionBtn').addEventListener('click', applyConversion);
document.getElementById('resetConversionBtn').addEventListener('click', resetConversion);
['convBaseValue', 'convMultiplier', 'convBonus', 'convHiddenBonus'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
        const base = parseFloat(document.getElementById('convBaseValue').value) || 0;
        const mult = parseFloat(document.getElementById('convMultiplier').value) || 0;
        const bonus = parseFloat(document.getElementById('convBonus').value) || 0;
        const hidden = parseFloat(document.getElementById('convHiddenBonus').value) || 0;
        const result = computeConversionValue(base, mult, bonus, hidden);
        document.getElementById('convResultValue').innerText = Math.round(result);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const addDisplayBtn = document.getElementById('addCustomDisplayAtkBtn');
    if (addDisplayBtn) addDisplayBtn.addEventListener('click', addCustomDisplayAtkEntry);
    const addActualBtn = document.getElementById('addCustomActualAtkBtn');
    if (addActualBtn) addActualBtn.addEventListener('click', addCustomActualAtkEntry);
    const addLifeBtn = document.getElementById('addCustomLifeBonusBtn');
    if (addLifeBtn) addLifeBtn.addEventListener('click', addCustomLifeBonusEntry);
    const addPenDmgBtn = document.getElementById('addCustomPenDmgBtn');
    if (addPenDmgBtn) addPenDmgBtn.addEventListener('click', addCustomPenDmgEntry);
    const addPenVulnBtn = document.getElementById('addCustomPenVulnBtn');
    if (addPenVulnBtn) addPenVulnBtn.addEventListener('click', addCustomPenVulnEntry);
    const addFinalBtn = document.getElementById('addCustomFinalDmgBtn');
    if (addFinalBtn) addFinalBtn.addEventListener('click', addCustomFinalDmgEntry);
    const addFinalVulnBtn = document.getElementById('addCustomFinalVulnBtn');
    if (addFinalVulnBtn) addFinalVulnBtn.addEventListener('click', addCustomFinalVulnEntry);
});

// ================= 记录管理模块 =================
(function() {
    let penRecords = [];
    const PEN_STORAGE_KEY = 'PenetrationRecords_V2_1'; // 版本升级，因为新增最终易伤字段

    function loadPenRecords() {
        const raw = localStorage.getItem(PEN_STORAGE_KEY);
        if (raw) {
            try { penRecords = JSON.parse(raw); if (!Array.isArray(penRecords)) penRecords = []; } catch(e) { penRecords = []; }
        } else { penRecords = []; }
        savePenRecords();
    }
    function savePenRecords() { localStorage.setItem(PEN_STORAGE_KEY, JSON.stringify(penRecords)); }
    function addPenRecord(name, damage, config) { penRecords.unshift({ id: Date.now(), name: name, damage: damage, config: config, date: new Date().toISOString() }); savePenRecords(); }
    function deletePenRecord(id) { penRecords = penRecords.filter(r => r.id != id); savePenRecords(); }
    function clearPenRecords() { penRecords = []; savePenRecords(); }
    loadPenRecords();

    const fieldMeta = {
        // 单攻/双攻字段
        penAtkBaseSingle: { name: "基础攻击力(单)", zone: "⚔️ 攻击区间", unit: "", alwaysShow: true },
        penAtkPhys: { name: "基础物攻", zone: "⚔️ 攻击区间", unit: "" },
        penAtkMagic: { name: "基础魔攻", zone: "⚔️ 攻击区间", unit: "" },
        // 共享加成字段
        penAtkBuff: { name: "攻击BUFF", zone: "⚔️ 攻击区间", unit: "%" },
        penFlag: { name: "战旗", zone: "⚔️ 攻击区间", unit: "%" },
        penSwordScepter: { name: "剑杖刻印", zone: "⚔️ 攻击区间", unit: "%" },
        penBasicAura: { name: "基础光环", zone: "⚔️ 攻击区间", unit: "%" },
        penCoordAttack: { name: "协攻", zone: "⚔️ 攻击区间", unit: "%" },
        penHighland: { name: "高地", zone: "⚔️ 攻击区间 (实际加算)", unit: "%" },
        penLowland: { name: "低地", zone: "⚔️ 攻击区间 (实际加算)", unit: "%" },
        penHangmanMark: { name: "倒吊人指挥官", zone: "⚔️ 攻击区间 (实际加算)", unit: "%" },
        penWeaknessInsight: { name: "窥破弱点", zone: "⚔️ 攻击区间 (实际加算)", unit: "%" },
        penProfession: { name: "职业天赋", zone: "🌐 全局设置" },
        penWeakness: { name: "克制系数", zone: "🌐 全局设置", unit: "x" },
        penTarot: { name: "塔罗牌", zone: "🌐 全局设置" },
        penSkillMult: { name: "技能倍率", zone: "🌐 全局设置", unit: "%" },
        penLifeType: { name: "百分比类型", zone: "📊 百分比区间" },
        penLifeValue: { name: "结算倍率", zone: "📊 百分比区间", unit: "%" },
        penLifeTargetHp: { name: "目标生命值", zone: "📊 百分比区间" },
        penLifeAtk: { name: "攻击力", zone: "📊 百分比区间" },
        penDreamTalk: { name: "笼中说梦", zone: "✨ 穿透增伤区间", unit: "%" },
        penLukarAura: { name: "露卡马尔大光环", zone: "✨ 穿透增伤区间", unit: "%" },
        penIsilindAura: { name: "伊瑟琳德大招光环", zone: "✨ 穿透增伤区间", unit: "%" },
        penPrism: { name: "棱镜", zone: "✨ 穿透增伤区间", unit: "%" },
        penHeavyAssault: { name: "超重装强袭", zone: "✨ 穿透增伤区间", unit: "%" },
        penMaishaAura: { name: "麦莎大光环", zone: "✨ 穿透增伤区间", unit: "%" },
        penTriggerCoop: { name: "触发协同", zone: "✨ 穿透增伤区间", unit: "%" },
        penXiaoSuPersonality: { name: "小索个性", zone: "✨ 穿透增伤区间", unit: "%" },
        penGloryGuide: { name: "光辉的指引", zone: "✨ 穿透增伤区间", unit: "%" },
        penAnnaAura: { name: "安娜大光环", zone: "✨ 穿透增伤区间", unit: "%" },
        penWoundLayers: { name: "狼姐伤口层数", zone: "🎯 穿透易伤区间", unit: "层" },
        penEmperorCold: { name: "大帝个性寒境", zone: "✨ 最终增伤区间", unit: "%" },
        penPuppet: { name: "傀儡", zone: "🎯 穿透易伤区间", unit: "%" },
        penNightmare: { name: "梦魇", zone: "🎯 穿透易伤区间", unit: "%" },
        penPenVuln: { name: "穿透易伤", zone: "🎯 穿透易伤区间", unit: "%" },
        penImmunity: { name: "免疫减免", zone: "🎯 穿透易伤区间", unit: "%" },
        attackMode: { name: "结算模式", zone: "🌐 全局设置" },
        // 新增最终易伤字段
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
        if (key === 'penTarot') {
            const map = { none: '无', death: '死神', fool: '愚者' };
            return map[val] || val;
        } else if (key === 'penProfession') {
            const map = { none: '无', watcher: '守望者' };
            return map[val] || val;
        } else if (key === 'penWeakness') {
            const map = { '1.0': '无克制', '1.3': '三色克制', '0.7': '三色被克', '1.4': '光暗克制', '0.6': '光暗被克' };
            return map[val] || val;
        } else if (key === 'penLifeType') {
            const map = { hpPercent: '目标生命百分比', atkPercent: '攻击力百分比', fixed: '固定值' };
            return map[val] || val;
        } else if (key === 'penImmunity') {
            if (val === '0') return '无';
            if (val === '0.5') return '减免50%';
            if (val === '0.8') return '减免80%';
            if (val === '0.95') return '减免95%';
            return val + '%';
        } else if (key === 'penAnnaAura') {
            if (val === '0') return '无';
            if (val === '10') return '有 (+10%)';
            if (val === '20') return '守护失效 (+20%)';
            return val + '%';
        } else if (key === 'penEmperorCold') {
            return val === '10' ? '有 (+10%)' : '无';
        } else if (key === 'attackMode') {
            return val === 'single' ? '单攻结算' : '双攻结算';
        } else if (key === 'finalVulnAura') {
            return val === '10' ? '有 (+10%)' : '无';
        }
        const unit = fieldMeta[key]?.unit || '';
        return val + (unit ? unit : '');
    }
    function getRecordDamage(rec) { return rec.damage !== undefined ? rec.damage : '—'; }
    function getCurrentPenConfig() {
        return {
            attackMode: attackMode,
            penAtkBaseSingle: penAtkBaseSingle ? penAtkBaseSingle.value : '3000',
            penAtkPhys: penAtkPhys ? penAtkPhys.value : '3000',
            penAtkMagic: penAtkMagic ? penAtkMagic.value : '3000',
            penAtkBuff: penAtkBuff.value,
            penFlag: penFlag.value,
            penSwordScepter: penSwordScepter.value,
            penBasicAura: penBasicAura.value,
            penCoordAttack: penCoordAttack.value,
            penHighland: penHighland.value,
            penLowland: penLowland.value,
            penHangmanMark: penHangmanMark.value,
            penWeaknessInsight: penWeaknessInsight.value,
            penProfession: penProfession.value,
            penWeakness: penWeakness.value,
            penTarot: penTarot.value,
            penSkillMult: penSkillMult.value,
            penLifeType: penLifeType.value,
            penLifeValue: penLifeValue.value,
            penLifeAtk: penLifeAtk.value,
            penLifeTargetHp: penLifeTargetHp.value,
            penDreamTalk: penDreamTalk.value,
            penLukarAura: penLukarAura.value,
            penIsilindAura: penIsilindAura.value,
            penPrism: penPrism.value,
            penHeavyAssault: penHeavyAssault.value,
            penMaishaAura: penMaishaAura.value,
            penTriggerCoop: penTriggerCoop.value,
            penXiaoSuPersonality: penXiaoSuPersonality.value,
            penGloryGuide: penGloryGuide.value,
            penAnnaAura: penAnnaAura.value,
            penWoundLayers: penWoundLayers.value,
            penEmperorCold: penEmperorCold.value,
            penPuppet: penPuppet.value,
            penNightmare: penNightmare.value,
            penPenVuln: penPenVuln.value,
            penImmunity: penImmunity.value,
            finalVulnAura: finalVulnAuraSelect ? finalVulnAuraSelect.value : '0',
            singleDisplayConvBase: singleDisplayConvParams.base,
            singleDisplayConvMultiplier: singleDisplayConvParams.multiplier,
            singleDisplayConvBonus: singleDisplayConvParams.bonus,
            singleDisplayConvHiddenBonus: singleDisplayConvParams.hiddenBonus,
            singleActualConvBase: singleActualConvParams.base,
            singleActualConvMultiplier: singleActualConvParams.multiplier,
            singleActualConvBonus: singleActualConvParams.bonus,
            singleActualConvHiddenBonus: singleActualConvParams.hiddenBonus,
            physConvBase: physConvParams.base,
            physConvMultiplier: physConvParams.multiplier,
            physConvBonus: physConvParams.bonus,
            physConvHiddenBonus: physConvParams.hiddenBonus,
            magicConvBase: magicConvParams.base,
            magicConvMultiplier: magicConvParams.multiplier,
            magicConvBonus: magicConvParams.bonus,
            magicConvHiddenBonus: magicConvParams.hiddenBonus,
            customDisplayAtkEntries: customDisplayAtkEntries.map(e => ({ name: e.name, percent: e.percent })),
            customActualAtkEntries: customActualAtkEntries.map(e => ({ name: e.name, percent: e.percent })),
            customLifeBonusEntries: customLifeBonusEntries.map(e => ({ name: e.name, percent: e.percent })),
            customPenDmgEntries: customPenDmgEntries.map(e => ({ name: e.name, percent: e.percent })),
            customPenVulnEntries: customPenVulnEntries.map(e => ({ name: e.name, percent: e.percent })),
            customFinalDmgEntries: customFinalDmgEntries.map(e => ({ name: e.name, percent: e.percent })),
            customFinalVulnEntries: customFinalVulnEntries.map(e => ({ name: e.name, percent: e.percent }))
        };
    }
    function applyRecordToCalculator(record) {
        const config = record.config;
        attackMode = config.attackMode || 'single';
        document.getElementById('attackModeSelect').value = attackMode;
        if (attackMode === 'single') {
            if (config.penAtkBaseSingle !== undefined) penAtkBaseSingle.value = config.penAtkBaseSingle;
        } else {
            if (config.penAtkPhys !== undefined) penAtkPhys.value = config.penAtkPhys;
            if (config.penAtkMagic !== undefined) penAtkMagic.value = config.penAtkMagic;
        }
        penAtkBuff.value = config.penAtkBuff || '0';
        penFlag.value = config.penFlag || '0';
        penSwordScepter.value = config.penSwordScepter || '0';
        penBasicAura.value = config.penBasicAura || '0';
        penCoordAttack.value = config.penCoordAttack || '0';
        penHighland.value = config.penHighland || '0';
        penLowland.value = config.penLowland || '0';
        penHangmanMark.value = config.penHangmanMark || '0';
        penWeaknessInsight.value = config.penWeaknessInsight || '0';
        penProfession.value = config.penProfession || 'none';
        penWeakness.value = config.penWeakness || '1.0';
        penTarot.value = config.penTarot || 'none';
        penSkillMult.value = config.penSkillMult || '100';
        penLifeType.value = config.penLifeType || 'hpPercent';
        penLifeValue.value = config.penLifeValue || '0';
        penLifeAtk.value = config.penLifeAtk || '3000';
        penLifeTargetHp.value = config.penLifeTargetHp || '10000';
        penDreamTalk.value = config.penDreamTalk || '0';
        penLukarAura.value = config.penLukarAura || '0';
        penIsilindAura.value = config.penIsilindAura || '0';
        penPrism.value = config.penPrism || '0';
        penHeavyAssault.value = config.penHeavyAssault || '0';
        penMaishaAura.value = config.penMaishaAura || '0';
        penTriggerCoop.value = config.penTriggerCoop || '0';
        penXiaoSuPersonality.value = config.penXiaoSuPersonality || '0';
        penGloryGuide.value = config.penGloryGuide || '0';
        penAnnaAura.value = config.penAnnaAura || '0';
        penWoundLayers.value = config.penWoundLayers || '0';
        penEmperorCold.value = config.penEmperorCold || '0';
        penPuppet.value = config.penPuppet || '0';
        penNightmare.value = config.penNightmare || '0';
        penPenVuln.value = config.penPenVuln || '0';
        penImmunity.value = config.penImmunity || '0';
        if (finalVulnAuraSelect) finalVulnAuraSelect.value = config.finalVulnAura || '0';
        singleDisplayConvParams = {
            base: parseFloat(config.singleDisplayConvBase) || 0,
            multiplier: parseFloat(config.singleDisplayConvMultiplier) || 0,
            bonus: parseFloat(config.singleDisplayConvBonus) || 0,
            hiddenBonus: parseFloat(config.singleDisplayConvHiddenBonus) || 0
        };
        singleActualConvParams = {
            base: parseFloat(config.singleActualConvBase) || 0,
            multiplier: parseFloat(config.singleActualConvMultiplier) || 0,
            bonus: parseFloat(config.singleActualConvBonus) || 0,
            hiddenBonus: parseFloat(config.singleActualConvHiddenBonus) || 0
        };
        physConvParams = {
            base: parseFloat(config.physConvBase) || 0,
            multiplier: parseFloat(config.physConvMultiplier) || 0,
            bonus: parseFloat(config.physConvBonus) || 0,
            hiddenBonus: parseFloat(config.physConvHiddenBonus) || 0
        };
        magicConvParams = {
            base: parseFloat(config.magicConvBase) || 0,
            multiplier: parseFloat(config.magicConvMultiplier) || 0,
            bonus: parseFloat(config.magicConvBonus) || 0,
            hiddenBonus: parseFloat(config.magicConvHiddenBonus) || 0
        };
        singleDisplayConversion = computeConversionValue(singleDisplayConvParams.base, singleDisplayConvParams.multiplier, singleDisplayConvParams.bonus, singleDisplayConvParams.hiddenBonus);
        singleActualConversion = computeConversionValue(singleActualConvParams.base, singleActualConvParams.multiplier, singleActualConvParams.bonus, singleActualConvParams.hiddenBonus);
        physConversion = computeConversionValue(physConvParams.base, physConvParams.multiplier, physConvParams.bonus, physConvParams.hiddenBonus);
        magicConversion = computeConversionValue(magicConvParams.base, magicConvParams.multiplier, magicConvParams.bonus, magicConvParams.hiddenBonus);
        if (config.customDisplayAtkEntries) {
            customDisplayAtkEntries = config.customDisplayAtkEntries.map(e => ({ name: e.name, percent: e.percent }));
            renderCustomDisplayAtkEntries();
        }
        if (config.customActualAtkEntries) {
            customActualAtkEntries = config.customActualAtkEntries.map(e => ({ name: e.name, percent: e.percent }));
            renderCustomActualAtkEntries();
        }
        if (config.customLifeBonusEntries) {
            customLifeBonusEntries = config.customLifeBonusEntries.map(e => ({ name: e.name, percent: e.percent }));
            renderCustomLifeBonusEntries();
        }
        if (config.customPenDmgEntries) {
            customPenDmgEntries = config.customPenDmgEntries.map(e => ({ name: e.name, percent: e.percent }));
            renderCustomPenDmgEntries();
        }
        if (config.customPenVulnEntries) {
            customPenVulnEntries = config.customPenVulnEntries.map(e => ({ name: e.name, percent: e.percent }));
            renderCustomPenVulnEntries();
        }
        if (config.customFinalDmgEntries) {
            customFinalDmgEntries = config.customFinalDmgEntries.map(e => ({ name: e.name, percent: e.percent }));
            renderCustomFinalDmgEntries();
        }
        if (config.customFinalVulnEntries) {
            customFinalVulnEntries = config.customFinalVulnEntries.map(e => ({ name: e.name, percent: e.percent }));
            renderCustomFinalVulnEntries();
        }
        toggleLifeRows();
        updateAttackUI();
        updatePenetration();
    }
    function getGroupedDetails(config) {
        const zoneOrder = ['⚔️ 攻击区间', '⚔️ 攻击区间 (实际加算)', '📊 百分比区间', '✨ 穿透增伤区间', '🎯 穿透易伤区间', '✨ 最终增伤区间', '🎯 最终易伤区间', '🌐 全局设置'];
        const groups = {};
        for (const [key, value] of Object.entries(config)) {
            if (key === 'dotEntries') continue;
            const meta = fieldMeta[key];
            if (!meta) continue;
            if (isFieldEmptyValue(key, value)) continue;
            if (!groups[meta.zone]) groups[meta.zone] = [];
            groups[meta.zone].push(`<div class="config-item"><strong>${meta.name}</strong>：${formatFieldValue(key, value)}</div>`);
        }
        const customZones = [
            { entries: config.customDisplayAtkEntries, zone: '⚔️ 攻击区间 (自定义显示)' },
            { entries: config.customActualAtkEntries, zone: '⚔️ 攻击区间 (自定义实际)' },
            { entries: config.customLifeBonusEntries, zone: '📊 百分比区间 (自定义)' },
            { entries: config.customPenDmgEntries, zone: '✨ 穿透增伤区间 (自定义)' },
            { entries: config.customPenVulnEntries, zone: '🎯 穿透易伤区间 (自定义)' },
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
        let html = '';
        for (const zone of zoneOrder) {
            if (groups[zone] && groups[zone].length) {
                html += `<div class="zone-title">${zone}</div><div class="config-grid">${groups[zone].join('')}</div>`;
            }
        }
        return html || '<div class="config-item">无有效配置项</div>';
    }
    function renderPenRecordsUI() {
        const recordsArea = document.getElementById('recordsListArea');
        if (!recordsArea) return;
        if (penRecords.length === 0) {
            recordsArea.innerHTML = '<div style="padding:20px;text-align:center">✨ 暂无记录，请点击“记录结果”保存配置。</div>';
            document.getElementById('compareArea').innerHTML = '';
            return;
        }
        let html = '';
        penRecords.forEach(rec => {
            html += `<div class="record-card" data-id="${rec.id}">
                <div class="record-header">
                    <div><input type="checkbox" class="compare-check" value="${rec.id}"> <span class="record-name">📌 ${escapeHtml(rec.name)}</span></div>
                    <div class="record-damage">✨ ${rec.damage}</div>
                    <div class="record-actions">
                        <button class="small-btn view-detail" data-id="${rec.id}">🔍 详情</button>
                        <button class="small-btn apply-record" data-id="${rec.id}">📥 填入计算器</button>
                        <button class="small-btn delete-record" data-id="${rec.id}">🗑️ 删除</button>
                    </div>
                </div>
                <div class="detail-panel" id="detail-${rec.id}" style="display:none;"></div>
            </div>`;
        });
        recordsArea.innerHTML = html;
        document.querySelectorAll('.view-detail').forEach(btn => btn.addEventListener('click', (e) => { let id = parseInt(btn.dataset.id); showPenDetail(id); }));
        document.querySelectorAll('.apply-record').forEach(btn => btn.addEventListener('click', (e) => { let id = parseInt(btn.dataset.id); const rec = penRecords.find(r => r.id == id); if (rec) { applyRecordToCalculator(rec); document.getElementById('recordModal').classList.remove('active'); } }));
        document.querySelectorAll('.delete-record').forEach(btn => btn.addEventListener('click', (e) => { let id = parseInt(btn.dataset.id); deletePenRecord(id); renderPenRecordsUI(); updatePenCompareSelection(); }));
        const checks = document.querySelectorAll('.compare-check');
        checks.forEach(ch => { ch.removeEventListener('change', handlePenCompareChange); ch.addEventListener('change', handlePenCompareChange); });
        updatePenCompareSelection();
    }
    function handlePenCompareChange() { updatePenCompareSelection(); }
    function showPenDetail(id) {
        let rec = penRecords.find(r => r.id == id);
        if (!rec) return;
        let panel = document.getElementById(`detail-${id}`);
        if (!panel) return;
        if (panel.style.display === 'block') { panel.style.display = 'none'; return; }
        panel.innerHTML = getGroupedDetails(rec.config) + `<div class="stat-badge" style="margin-top:12px;">✨ 穿透伤害: ${rec.damage}</div>`;
        panel.style.display = 'block';
    }
    let selectedPenForCompare = [];
    function updatePenCompareSelection() {
        let checks = document.querySelectorAll('.compare-check');
        selectedPenForCompare = [];
        checks.forEach(ch => { if (ch.checked) selectedPenForCompare.push(parseInt(ch.value)); });
        const compareArea = document.getElementById('compareArea');
        if (selectedPenForCompare.length >= 2) {
            let selectedRecords = selectedPenForCompare.map(id => penRecords.find(r => r.id == id)).filter(r => r);
            if (selectedRecords.length) renderMultiCompare(selectedRecords);
            else compareArea.innerHTML = '';
        } else {
            compareArea.innerHTML = selectedPenForCompare.length === 1 ? '<div class="stat-badge">📊 至少选择两条记录进行对比</div>' : '<div class="stat-badge">📊 勾选记录可进行对比（支持多条）</div>';
        }
    }
    async function renderMultiCompare(recordsList) {
        if (!recordsList || recordsList.length < 2) return;
        const zoneOrder = ['⚔️ 攻击区间', '⚔️ 攻击区间 (实际加算)', '📊 百分比区间', '✨ 穿透增伤区间', '🎯 穿透易伤区间', '✨ 最终增伤区间', '🎯 最终易伤区间', '🌐 全局设置'];
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
            { key: 'customLifeBonusEntries', zone: '📊 百分比区间', title: '生命值结算自定义' },
            { key: 'customPenDmgEntries', zone: '✨ 穿透增伤区间', title: '穿透增伤自定义' },
            { key: 'customPenVulnEntries', zone: '🎯 穿透易伤区间', title: '穿透易伤自定义' },
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
        html += '<tr class="zone-header"><td colspan="' + (recordsList.length + 1) + '">✨ 伤害对比</tr>';
        html += '<tr><td class="field-name">穿透伤害</td>';
        for (const rec of recordsList) {
            html += `<td>${escapeHtml(getRecordDamage(rec))}</td>`;
        }
        html += '</tr></tbody></table></div>';
        document.getElementById('compareArea').innerHTML = html;
        const existingBtn = document.getElementById('screenshotCompareBtn');
        if (existingBtn) existingBtn.remove();
        const btnDiv = document.createElement('div');
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
                showLoading('生成截图中...');
                const clone = wrapper.cloneNode(true);
                clone.style.position = 'absolute';
                clone.style.left = '-9999px';
                clone.style.top = '0';
                clone.style.width = 'auto';
                clone.style.maxWidth = 'none';
                clone.style.overflow = 'visible';
                document.body.appendChild(clone);
                await new Promise(r => setTimeout(r, 100));
                const canvas = await html2canvas(clone, { scale: 2, backgroundColor: '#ffffff' });
                const link = document.createElement('a');
                const timestamp = new Date().toISOString().slice(0,19).replace(/:/g, '-');
                link.download = `穿透对比_${timestamp}.png`;
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
    document.getElementById('penRecordBtn').addEventListener('click', () => {
        let name = prompt('为本次穿透记录命名 (最多20字)', '穿透 ' + new Date().toLocaleTimeString());
        if (!name) return;
        if (name.length > 20) name = name.slice(0,20);
        let config = getCurrentPenConfig();
        let damage = parseInt(penDamageDisplay.innerText.replace(/[^0-9-]/g, ''));
        addPenRecord(name, damage, config);
        alert(`已记录“${name}”`);
    });
    document.getElementById('penQueryBtn').addEventListener('click', () => {
        loadPenRecords();
        renderPenRecordsUI();
        document.getElementById('recordModal').classList.add('active');
    });
    document.getElementById('penClearBtn').addEventListener('click', () => {
        if (confirm('确定清空所有穿透记录吗？')) {
            clearPenRecords();
            if (document.getElementById('recordModal').classList.contains('active')) renderPenRecordsUI();
            alert('所有记录已清空');
        }
    });
    document.getElementById('closeModalBtn').addEventListener('click', () => { document.getElementById('recordModal').classList.remove('active'); });
    document.getElementById('recordModal').addEventListener('click', (e) => { if (e.target === document.getElementById('recordModal')) document.getElementById('recordModal').classList.remove('active'); });
})();

preloadScreenshot();