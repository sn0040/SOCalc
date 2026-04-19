// damage/calculator.js
import { preloadScreenshot, loadHtml2Canvas, showLoading, hideLoading, showScreenshotError } from '../common/screenshot.js';

// ================= 自定义条目数组（全局） =================
let customDisplayAtkEntries = [];
let customActualAtkEntries = [];
let customDefReductionEntries = [];
let customDefIgnoreEntries = [];
let customDefFixedReductionEntries = [];   // 固定值减防
let customDefIncreaseEntries = [];         // 防御提升（百分比）
let customDmgIncEntries = [];
let customCritEntries = [];
let customFinalDmgEntries = [];
let customTakenEntries = [];
// 新增：最终易伤自定义条目
let customFinalVulnEntries = [];

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
            <button class="small-btn delete-custom" data-index="${i}">删除</button>
        `;
        const nameInput = div.querySelector('.custom-name');
        const percentInput = div.querySelector('.custom-percent');
        const delBtn = div.querySelector('.delete-custom');
        nameInput.addEventListener('change', () => { customDisplayAtkEntries[i].name = nameInput.value; });
        percentInput.addEventListener('input', () => {
            customDisplayAtkEntries[i].percent = parseFloat(percentInput.value) || 0;
            updateAll();
        });
        delBtn.addEventListener('click', () => {
            customDisplayAtkEntries.splice(i, 1);
            renderCustomDisplayAtkEntries();
            updateAll();
        });
        container.appendChild(div);
    }
}
function addCustomDisplayAtkEntry() {
    customDisplayAtkEntries.push({ name: '', percent: 0 });
    renderCustomDisplayAtkEntries();
    updateAll();
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
            <button class="small-btn delete-custom" data-index="${i}">删除</button>
        `;
        const nameInput = div.querySelector('.custom-name');
        const percentInput = div.querySelector('.custom-percent');
        const delBtn = div.querySelector('.delete-custom');
        nameInput.addEventListener('change', () => { customActualAtkEntries[i].name = nameInput.value; });
        percentInput.addEventListener('input', () => {
            customActualAtkEntries[i].percent = parseFloat(percentInput.value) || 0;
            updateAll();
        });
        delBtn.addEventListener('click', () => {
            customActualAtkEntries.splice(i, 1);
            renderCustomActualAtkEntries();
            updateAll();
        });
        container.appendChild(div);
    }
}
function addCustomActualAtkEntry() {
    customActualAtkEntries.push({ name: '', percent: 0 });
    renderCustomActualAtkEntries();
    updateAll();
}

function renderCustomDefReductionEntries() {
    const container = document.getElementById('customDefReductionContainer');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < customDefReductionEntries.length; i++) {
        const entry = customDefReductionEntries[i];
        const div = document.createElement('div');
        div.className = 'row';
        div.style.marginBottom = '8px';
        div.innerHTML = `
            <input type="text" class="custom-name" value="${escapeHtml(entry.name)}" placeholder="名称" style="flex:2;">
            <input type="number" class="custom-percent" value="${entry.percent === 0 ? '' : entry.percent}" step="1" placeholder="百分比" style="flex:1;">
            <button class="small-btn delete-custom" data-index="${i}">删除</button>
        `;
        const nameInput = div.querySelector('.custom-name');
        const percentInput = div.querySelector('.custom-percent');
        const delBtn = div.querySelector('.delete-custom');
        nameInput.addEventListener('change', () => { customDefReductionEntries[i].name = nameInput.value; });
        percentInput.addEventListener('input', () => {
            customDefReductionEntries[i].percent = parseFloat(percentInput.value) || 0;
            updateAll();
        });
        delBtn.addEventListener('click', () => {
            customDefReductionEntries.splice(i, 1);
            renderCustomDefReductionEntries();
            updateAll();
        });
        container.appendChild(div);
    }
}
function addCustomDefReductionEntry() {
    customDefReductionEntries.push({ name: '', percent: 0 });
    renderCustomDefReductionEntries();
    updateAll();
}

function renderCustomDefIgnoreEntries() {
    const container = document.getElementById('customDefIgnoreContainer');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < customDefIgnoreEntries.length; i++) {
        const entry = customDefIgnoreEntries[i];
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
        nameInput.addEventListener('change', () => { customDefIgnoreEntries[i].name = nameInput.value; });
        percentInput.addEventListener('input', () => {
            customDefIgnoreEntries[i].percent = parseFloat(percentInput.value) || 0;
            updateAll();
        });
        delBtn.addEventListener('click', () => {
            customDefIgnoreEntries.splice(i, 1);
            renderCustomDefIgnoreEntries();
            updateAll();
        });
        container.appendChild(div);
    }
}
function addCustomDefIgnoreEntry() {
    customDefIgnoreEntries.push({ name: '', percent: 0 });
    renderCustomDefIgnoreEntries();
    updateAll();
}

// 固定值减防条目
function renderCustomDefFixedReductionEntries() {
    const container = document.getElementById('customDefFixedReductionContainer');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < customDefFixedReductionEntries.length; i++) {
        const entry = customDefFixedReductionEntries[i];
        const div = document.createElement('div');
        div.className = 'row';
        div.style.marginBottom = '8px';
        div.innerHTML = `
            <input type="text" class="custom-name" value="${escapeHtml(entry.name)}" placeholder="名称" style="flex:2;">
            <input type="number" class="custom-percent" value="${entry.value === 0 ? '' : entry.value}" step="1" placeholder="固定值" style="flex:1;">
            <button class="small-btn delete-custom" data-index="${i}" >删除</button>
        `;
        const nameInput = div.querySelector('.custom-name');
        const valueInput = div.querySelector('.custom-percent');
        const delBtn = div.querySelector('.delete-custom');
        nameInput.addEventListener('change', () => { customDefFixedReductionEntries[i].name = nameInput.value; });
        valueInput.addEventListener('input', () => {
            customDefFixedReductionEntries[i].value = parseFloat(valueInput.value) || 0;
            updateAll();
        });
        delBtn.addEventListener('click', () => {
            customDefFixedReductionEntries.splice(i, 1);
            renderCustomDefFixedReductionEntries();
            updateAll();
        });
        container.appendChild(div);
    }
}
function addCustomDefFixedReductionEntry() {
    customDefFixedReductionEntries.push({ name: '', value: 0 });
    renderCustomDefFixedReductionEntries();
    updateAll();
}

// 防御提升条目
function renderCustomDefIncreaseEntries() {
    const container = document.getElementById('customDefIncreaseContainer');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < customDefIncreaseEntries.length; i++) {
        const entry = customDefIncreaseEntries[i];
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
        nameInput.addEventListener('change', () => { customDefIncreaseEntries[i].name = nameInput.value; });
        percentInput.addEventListener('input', () => {
            customDefIncreaseEntries[i].percent = parseFloat(percentInput.value) || 0;
            updateAll();
        });
        delBtn.addEventListener('click', () => {
            customDefIncreaseEntries.splice(i, 1);
            renderCustomDefIncreaseEntries();
            updateAll();
        });
        container.appendChild(div);
    }
}
function addCustomDefIncreaseEntry() {
    customDefIncreaseEntries.push({ name: '', percent: 0 });
    renderCustomDefIncreaseEntries();
    updateAll();
}

function renderCustomDmgIncEntries() {
    const container = document.getElementById('customDmgIncContainer');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < customDmgIncEntries.length; i++) {
        const entry = customDmgIncEntries[i];
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
        nameInput.addEventListener('change', () => { customDmgIncEntries[i].name = nameInput.value; });
        percentInput.addEventListener('input', () => {
            customDmgIncEntries[i].percent = parseFloat(percentInput.value) || 0;
            updateAll();
        });
        delBtn.addEventListener('click', () => {
            customDmgIncEntries.splice(i, 1);
            renderCustomDmgIncEntries();
            updateAll();
        });
        container.appendChild(div);
    }
}
function addCustomDmgIncEntry() {
    customDmgIncEntries.push({ name: '', percent: 0 });
    renderCustomDmgIncEntries();
    updateAll();
}

function renderCustomCritEntries() {
    const container = document.getElementById('customCritContainer');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < customCritEntries.length; i++) {
        const entry = customCritEntries[i];
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
        nameInput.addEventListener('change', () => { customCritEntries[i].name = nameInput.value; });
        percentInput.addEventListener('input', () => {
            customCritEntries[i].percent = parseFloat(percentInput.value) || 0;
            updateAll();
        });
        delBtn.addEventListener('click', () => {
            customCritEntries.splice(i, 1);
            renderCustomCritEntries();
            updateAll();
        });
        container.appendChild(div);
    }
}
function addCustomCritEntry() {
    customCritEntries.push({ name: '', percent: 0 });
    renderCustomCritEntries();
    updateAll();
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
            updateAll();
        });
        delBtn.addEventListener('click', () => {
            customFinalDmgEntries.splice(i, 1);
            renderCustomFinalDmgEntries();
            updateAll();
        });
        container.appendChild(div);
    }
}
function addCustomFinalDmgEntry() {
    customFinalDmgEntries.push({ name: '', percent: 0 });
    renderCustomFinalDmgEntries();
    updateAll();
}

function renderCustomTakenEntries() {
    const container = document.getElementById('customTakenContainer');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < customTakenEntries.length; i++) {
        const entry = customTakenEntries[i];
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
        nameInput.addEventListener('change', () => { customTakenEntries[i].name = nameInput.value; });
        percentInput.addEventListener('input', () => {
            customTakenEntries[i].percent = parseFloat(percentInput.value) || 0;
            updateAll();
        });
        delBtn.addEventListener('click', () => {
            customTakenEntries.splice(i, 1);
            renderCustomTakenEntries();
            updateAll();
        });
        container.appendChild(div);
    }
}
function addCustomTakenEntry() {
    customTakenEntries.push({ name: '', percent: 0 });
    renderCustomTakenEntries();
    updateAll();
}

// ================= 最终易伤自定义条目（新增） =================
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
            updateAll();
        });
        delBtn.addEventListener('click', () => {
            customFinalVulnEntries.splice(i, 1);
            renderCustomFinalVulnEntries();
            updateAll();
        });
        container.appendChild(div);
    }
}
function addCustomFinalVulnEntry() {
    customFinalVulnEntries.push({ name: '', percent: 0 });
    renderCustomFinalVulnEntries();
    updateAll();
}

// ================= 攻击转化相关（原生实现） =================
let displayConvParams = { base: 0, multiplier: 0, bonus: 0, hiddenBonus: 0 };
let actualConvParams = { base: 0, multiplier: 0, bonus: 0, hiddenBonus: 0 };
let displayAttackConversion = 0;
let actualAttackConversion = 0;

function computeConversionValue(base, mult, bonus, hiddenBonus) {
    const multiplier = mult / 100;
    const bonusTotal = (bonus + hiddenBonus) / 100;
    return base * (1 + bonusTotal) * multiplier;
}

displayAttackConversion = computeConversionValue(displayConvParams.base, displayConvParams.multiplier, displayConvParams.bonus, displayConvParams.hiddenBonus);
actualAttackConversion = computeConversionValue(actualConvParams.base, actualConvParams.multiplier, actualConvParams.bonus, actualConvParams.hiddenBonus);

function openConversionModal(type) {
    const title = type === 'display' ? '显示攻击转化' : '实际攻击转化';
    document.getElementById('conversionTitle').innerText = title;
    const params = type === 'display' ? displayConvParams : actualConvParams;
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
    const title = document.getElementById('conversionTitle').innerText;
    const isDisplay = title.includes('显示');
    const params = {
        base: parseFloat(document.getElementById('convBaseValue').value) || 0,
        multiplier: parseFloat(document.getElementById('convMultiplier').value) || 0,
        bonus: parseFloat(document.getElementById('convBonus').value) || 0,
        hiddenBonus: parseFloat(document.getElementById('convHiddenBonus').value) || 0
    };
    if (isDisplay) {
        displayConvParams = params;
        displayAttackConversion = computeConversionValue(params.base, params.multiplier, params.bonus, params.hiddenBonus);
    } else {
        actualConvParams = params;
        actualAttackConversion = computeConversionValue(params.base, params.multiplier, params.bonus, params.hiddenBonus);
    }
    updateAll();
    closeConversionModal();
}

function resetConversion() {
    const title = document.getElementById('conversionTitle').innerText;
    const isDisplay = title.includes('显示');
    if (isDisplay) {
        displayConvParams = { base: 0, multiplier: 0, bonus: 0, hiddenBonus: 0 };
        displayAttackConversion = 0;
    } else {
        actualConvParams = { base: 0, multiplier: 0, bonus: 0, hiddenBonus: 0 };
        actualAttackConversion = 0;
    }
    openConversionModal(isDisplay ? 'display' : 'actual');
    updateAll();
}

// ================= 主计算逻辑 =================
const atkBaseInput = document.getElementById('atkBase');
const atkBuffSelect = document.getElementById('atkBuff');
const flagSelect = document.getElementById('flag');
const swordScepterSelect = document.getElementById('swordScepter');
const basicAuraSelect = document.getElementById('basicAura');
const coordAttackSelect = document.getElementById('coordAttack');
const highlandSelect = document.getElementById('highland');
const lowlandSelect = document.getElementById('lowland');
const lionTransformSelect = document.getElementById('lionTransform');
const hangmanMarkSelect = document.getElementById('hangmanMark');
const weaknessInsightSelect = document.getElementById('weaknessInsight');
const defInput = document.getElementById('def');
const defReductionSelect = document.getElementById('defReduction');
const lockOnSelect = document.getElementById('lockOn');
const armorPiercingSelect = document.getElementById('armorPiercing');
const dmgBuffSelect = document.getElementById('dmgBuff');
const flowLightSelect = document.getElementById('flowLight');
const backAttackDmgSelect = document.getElementById('backAttackDmg');
const critBuffSelect = document.getElementById('critBuff');
const weaponCritSelect = document.getElementById('weaponCrit');
const heshaAuraSelect = document.getElementById('heshaAura');
const uriaConvertSelect = document.getElementById('uriaConvert');
const finalDmgSkillSelect = document.getElementById('finalDmgSkill');
const takenBuffSelect = document.getElementById('takenBuff');
const injuryLevelSelect = document.getElementById('injuryLevel');
const judgmentSelect = document.getElementById('judgment');
const soulSelect = document.getElementById('soul');
const hornSelect = document.getElementById('horn');
const samanthaJudgmentSelect = document.getElementById('samanthaJudgment');
const skillInput = document.getElementById('skill');
const weaknessSelect = document.getElementById('weakness');
const tarotSelect = document.getElementById('tarotSelect');
const professionSelect = document.getElementById('profession');
const nonCritSpan = document.getElementById('nonCritDamage');
const critSpan = document.getElementById('critDamage');
const statCritFooter = document.getElementById('statCritFooter');
const statDisplayAtk = document.getElementById('statDisplayAtk');
const statActualAtk = document.getElementById('statActualAtk');
const statNormalPercent = document.getElementById('statNormalPercent');
const statExtraPercent = document.getElementById('statExtraPercent');
const statDisplayConversion = document.getElementById('statDisplayConversion');
const statActualConversion = document.getElementById('statActualConversion');
const statDebuffFactor = document.getElementById('statDebuffFactor');
const statIgnoreFinal = document.getElementById('statIgnoreFinal');
const statDefFinal = document.getElementById('statDefFinal');
const statExtraDmg = document.getElementById('statExtraDmg');
const statInc = document.getElementById('statInc');
const statExtraCrit = document.getElementById('statExtraCrit');
const statCrit = document.getElementById('statCrit');
const statTaken = document.getElementById('statTaken');
const statFinalMult = document.getElementById('statFinalMult');
// 新增最终易伤相关元素
const finalVulnSkillSelect = document.getElementById('finalVulnSkill');
const finalVulnAuraSelect = document.getElementById('finalVulnAura');
const statFinalVulnMult = document.getElementById('statFinalVulnMult');

function getProfessionBonuses(prof, hasBackAttack) {
    let atkPercentBonus = 0, dmgBonus = 0, ignoreProf = 0, critDmgBonus = 0, critRateBonus = 0;
    if (prof === 'smasher15') dmgBonus = 15;
    else if (prof === 'smasher20') dmgBonus = 20;
    else if (prof === 'smasher35') dmgBonus = 35;
    else if (prof === 'defender28') dmgBonus = 28;
    else if (prof === 'assassin') { ignoreProf = 15; critDmgBonus = 11; critRateBonus = 5; if (hasBackAttack) { critDmgBonus += 3; critRateBonus += 3; } }
    else if (prof === 'watcher') { dmgBonus = 20; atkPercentBonus = 0; }
    else if (prof === 'destroyer30') dmgBonus = 30;
    return { atkPercentBonus, dmgBonus, ignoreProf, critDmgBonus, critRateBonus };
}

function getTarotBonuses(tarot) {
    let d = 0, c = 0;
    if (tarot === 'magician') d = 40;
    else if (tarot === 'magician_single') d = 16;
    else if (tarot === 'fool') d = 10;
    else if (tarot === 'tower') d = 20;
    else if (tarot === 'justice') c = 15;
    return { dmgBonus: d, critBonus: c };
}

function updateAll() {
    let atkBase = parseFloat(atkBaseInput.value) || 0;
    let normalAtkPercent = 0;
    normalAtkPercent += parseFloat(atkBuffSelect.value) || 0;
    normalAtkPercent += parseFloat(flagSelect.value) || 0;
    normalAtkPercent += parseFloat(swordScepterSelect.value) || 0;
    normalAtkPercent += parseFloat(basicAuraSelect.value) || 0;
    normalAtkPercent += parseFloat(coordAttackSelect.value) || 0;
    let customDisplaySum = customDisplayAtkEntries.reduce((sum, e) => sum + (e.percent || 0), 0);
    normalAtkPercent += customDisplaySum;

    let profession = professionSelect.value;
    let hasBackAttack = (parseFloat(backAttackDmgSelect.value) === 30);
    let profBonus = getProfessionBonuses(profession, hasBackAttack);
    normalAtkPercent += profBonus.atkPercentBonus;

    let extraPercent = 0;
    extraPercent += parseFloat(highlandSelect.value) || 0;
    extraPercent += parseFloat(lowlandSelect.value) || 0;
    extraPercent += parseFloat(hangmanMarkSelect.value) || 0;
    extraPercent += parseFloat(weaknessInsightSelect.value) || 0;
    // 守望者天赋 +12% 攻击（属于实际攻击区间）
    if (profession === 'watcher') extraPercent += 12;
    let customActualSum = customActualAtkEntries.reduce((sum, e) => sum + (e.percent || 0), 0);
    extraPercent += customActualSum;

    let displayAtkBase = atkBase * (1 + normalAtkPercent / 100);
    let finalDisplayAtk = displayAtkBase + displayAttackConversion;
    let extraTerm = atkBase * (extraPercent / 100);
    let weakness = parseFloat(weaknessSelect.value) || 1.0;
    let finalActualAtk = (finalDisplayAtk + extraTerm + actualAttackConversion) * weakness;

    statDisplayAtk.textContent = Math.round(finalDisplayAtk);
    statActualAtk.textContent = Math.round(finalActualAtk);
    statNormalPercent.textContent = normalAtkPercent.toFixed(1);
    statExtraPercent.textContent = extraPercent.toFixed(1);
    statDisplayConversion.textContent = Math.round(displayAttackConversion);
    statActualConversion.textContent = Math.round(actualAttackConversion);

    // 防御区间
    let defRaw = parseFloat(defInput.value) || 0;
    let defReduction = parseFloat(defReductionSelect.value) || 0;
    let lockOn = parseFloat(lockOnSelect.value) || 0;
    let customReductionSum = customDefReductionEntries.reduce((sum, e) => sum + (e.percent || 0), 0);
    let totalDebuff = Math.min(100, defReduction + lockOn + customReductionSum);
    let debuffFactor = 1 - totalDebuff / 100;
    
    let customIncreaseSum = customDefIncreaseEntries.reduce((sum, e) => sum + (e.percent || 0), 0);
    let increaseFactor = 1 + customIncreaseSum / 100;
    
    let fixedReductionTotal = customDefFixedReductionEntries.reduce((sum, e) => sum + (e.value || 0), 0);
    
    let armorPiercing = parseFloat(armorPiercingSelect.value) || 0;
    let customIgnoreFactor = 1;
    for (let entry of customDefIgnoreEntries) {
        customIgnoreFactor *= (1 - (entry.percent || 0) / 100);
    }
    let ignoreFinalFactor = (1 - profBonus.ignoreProf / 100) * (1 - armorPiercing / 100) * customIgnoreFactor;
    
    let defAfterDebuff = defRaw * debuffFactor * increaseFactor;
    let defAfterFixed = Math.max(0, defAfterDebuff - fixedReductionTotal);
    let defFinal = defAfterFixed * ignoreFinalFactor;
    
    statDebuffFactor.textContent = debuffFactor.toFixed(2) + 'x';
    document.getElementById('statIncreaseFactor').innerText = increaseFactor.toFixed(2) + 'x';
    statIgnoreFinal.textContent = ignoreFinalFactor.toFixed(2) + 'x';
    statDefFinal.textContent = defFinal.toFixed(1);

    let baseDiff = Math.max(1, finalActualAtk - defFinal);
    let skill = parseFloat(skillInput.value) || 0;
    let skillMult = skill / 100;

    let dmgBuff = parseFloat(dmgBuffSelect.value) || 0;
    let flowLight = parseFloat(flowLightSelect.value) || 0;
    let backAttackDmg = parseFloat(backAttackDmgSelect.value) || 0;
    let tarot = tarotSelect.value;
    let tarotBonus = getTarotBonuses(tarot);
    let customDmgIncSum = customDmgIncEntries.reduce((sum, e) => sum + (e.percent || 0), 0);
    let totalDmgBonus = dmgBuff + flowLight + backAttackDmg + tarotBonus.dmgBonus + profBonus.dmgBonus + customDmgIncSum;
    let incMult = 1 + totalDmgBonus / 100;

    let takenBuff = parseFloat(takenBuffSelect.value) || 0;
    let injuryLevel = parseFloat(injuryLevelSelect.value) || 0;
    let judgment = parseFloat(judgmentSelect.value) || 0;
    let soul = parseFloat(soulSelect.value) || 0;
    let horn = parseFloat(hornSelect.value) || 0;
    let samanthaJudgment = parseFloat(samanthaJudgmentSelect.value) || 0;
    let customTakenMult = 1;
    for (let entry of customTakenEntries) {
        customTakenMult *= (1 + (entry.percent || 0) / 100);
    }
    let takenMult = (1 + takenBuff/100) * (1 + injuryLevel/100) * (1 + judgment/100) * (1 + soul/100) * (1 + horn/100) * (1 + samanthaJudgment/100) * customTakenMult;
    takenMult = Math.min(takenMult, 3.0);

    // 最终增伤（加算）
    let finalDmgSkill = parseFloat(finalDmgSkillSelect.value) || 0;
    let customFinalSum = customFinalDmgEntries.reduce((sum, e) => sum + (e.percent || 0), 0);
    let finalMult = 1 + (finalDmgSkill + customFinalSum) / 100;

    // 最终易伤（乘算）
    let finalVulnSkill = parseFloat(finalVulnSkillSelect.value) || 0;
    let finalVulnAura = parseFloat(finalVulnAuraSelect.value) || 0;
    let finalVulnMult = (1 + finalVulnSkill/100) * (1 + finalVulnAura/100);
    for (let entry of customFinalVulnEntries) {
        finalVulnMult *= (1 + (entry.percent || 0) / 100);
    }
    statFinalVulnMult.innerText = finalVulnMult.toFixed(2) + 'x';

    let critBuff = parseFloat(critBuffSelect.value) || 0;
    let weaponCrit = parseFloat(weaponCritSelect.value) || 0;
    let heshaAura = parseFloat(heshaAuraSelect.value) || 0;
    let uriaConvert = parseFloat(uriaConvertSelect.value) || 0;
    let customCritSum = customCritEntries.reduce((sum, e) => sum + (e.percent || 0), 0);
    let baseCrit = 130;
    let critTotal = baseCrit + critBuff + weaponCrit + heshaAura + uriaConvert + customCritSum + tarotBonus.critBonus + profBonus.critDmgBonus;
    let extraCritTotal = critTotal - baseCrit;
    let critMult = critTotal / 100;

    let common = baseDiff * skillMult * incMult * takenMult * finalMult * finalVulnMult;
    let nonCrit = Math.round(common);
    let critDamage = Math.round(common * critMult);

    nonCritSpan.innerHTML = `<small>⚔️</small> ${nonCrit}`;
    critSpan.innerHTML = `<small>💥</small> ${critDamage}`;
    statCritFooter.textContent = critMult.toFixed(2);
    statInc.textContent = incMult.toFixed(2) + 'x';
    statExtraCrit.textContent = extraCritTotal + '%';
    statCrit.textContent = (critTotal / 100).toFixed(2) + 'x';
    statTaken.textContent = takenMult.toFixed(2) + 'x';
    statFinalMult.textContent = finalMult.toFixed(2) + 'x';
}

function resetAll() {
    atkBaseInput.value = '3000';
    atkBuffSelect.value = '0';
    flagSelect.value = '0';
    swordScepterSelect.value = '0';
    basicAuraSelect.value = '0';
    coordAttackSelect.value = '0';
    highlandSelect.value = '0';
    lowlandSelect.value = '0';
    hangmanMarkSelect.value = '0';
    weaknessInsightSelect.value = '0';
    defInput.value = '1500';
    defReductionSelect.value = '0';
    lockOnSelect.value = '0';
    armorPiercingSelect.value = '0';
    dmgBuffSelect.value = '0';
    flowLightSelect.value = '0';
    backAttackDmgSelect.value = '0';
    critBuffSelect.value = '0';
    weaponCritSelect.value = '0';
    heshaAuraSelect.value = '0';
    uriaConvertSelect.value = '0';
    finalDmgSkillSelect.value = '0';
    takenBuffSelect.value = '0';
    injuryLevelSelect.value = '0';
    judgmentSelect.value = '0';
    soulSelect.value = '0';
    hornSelect.value = '0';
    samanthaJudgmentSelect.value = '0';
    skillInput.value = '100';
    weaknessSelect.value = '1.0';
    tarotSelect.value = 'none';
    professionSelect.value = 'none';
    displayConvParams = { base: 0, multiplier: 0, bonus: 0, hiddenBonus: 0 };
    actualConvParams = { base: 0, multiplier: 0, bonus: 0, hiddenBonus: 0 };
    displayAttackConversion = 0;
    actualAttackConversion = 0;
    if (statDisplayConversion) statDisplayConversion.textContent = '0';
    if (statActualConversion) statActualConversion.textContent = '0';
    customDisplayAtkEntries = [];
    renderCustomDisplayAtkEntries();
    customActualAtkEntries = [];
    renderCustomActualAtkEntries();
    customDefReductionEntries = [];
    renderCustomDefReductionEntries();
    customDefIgnoreEntries = [];
    renderCustomDefIgnoreEntries();
    customDefFixedReductionEntries = [];
    renderCustomDefFixedReductionEntries();
    customDefIncreaseEntries = [];
    renderCustomDefIncreaseEntries();
    customDmgIncEntries = [];
    renderCustomDmgIncEntries();
    customCritEntries = [];
    renderCustomCritEntries();
    customFinalDmgEntries = [];
    renderCustomFinalDmgEntries();
    customTakenEntries = [];
    renderCustomTakenEntries();
    // 新增最终易伤
    customFinalVulnEntries = [];
    renderCustomFinalVulnEntries();
    // 重置最终易伤下拉框
    if (finalVulnSkillSelect) finalVulnSkillSelect.value = '0';
    if (finalVulnAuraSelect) finalVulnAuraSelect.value = '0';
    updateAll();
}

document.getElementById('resetToDefault').addEventListener('click', resetAll);
const allInputs = document.querySelectorAll('input, select');
allInputs.forEach(el => el.addEventListener('input', updateAll));
updateAll();

document.getElementById('openConversionBtnDisplay').addEventListener('click', () => openConversionModal('display'));
document.getElementById('openConversionBtnActual').addEventListener('click', () => openConversionModal('actual'));
document.getElementById('closeConversionModal').addEventListener('click', closeConversionModal);
document.getElementById('applyConversionBtn').addEventListener('click', applyConversion);
document.getElementById('resetConversionBtn').addEventListener('click', resetConversion);
['convBaseValue', 'convMultiplier', 'convBonus', 'convHiddenBonus'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener('input', () => {
            const base = parseFloat(document.getElementById('convBaseValue').value) || 0;
            const mult = parseFloat(document.getElementById('convMultiplier').value) || 0;
            const bonus = parseFloat(document.getElementById('convBonus').value) || 0;
            const hidden = parseFloat(document.getElementById('convHiddenBonus').value) || 0;
            const result = computeConversionValue(base, mult, bonus, hidden);
            document.getElementById('convResultValue').innerText = Math.round(result);
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const addDisplayBtn = document.getElementById('addCustomDisplayAtkBtn');
    if (addDisplayBtn) addDisplayBtn.addEventListener('click', addCustomDisplayAtkEntry);
    const addActualBtn = document.getElementById('addCustomActualAtkBtn');
    if (addActualBtn) addActualBtn.addEventListener('click', addCustomActualAtkEntry);
    const addDefReductionBtn = document.getElementById('addCustomDefReductionBtn');
    if (addDefReductionBtn) addDefReductionBtn.addEventListener('click', addCustomDefReductionEntry);
    const addDefIgnoreBtn = document.getElementById('addCustomDefIgnoreBtn');
    if (addDefIgnoreBtn) addDefIgnoreBtn.addEventListener('click', addCustomDefIgnoreEntry);
    const addDefFixedBtn = document.getElementById('addCustomDefFixedReductionBtn');
    if (addDefFixedBtn) addDefFixedBtn.addEventListener('click', addCustomDefFixedReductionEntry);
    const addDefIncreaseBtn = document.getElementById('addCustomDefIncreaseBtn');
    if (addDefIncreaseBtn) addDefIncreaseBtn.addEventListener('click', addCustomDefIncreaseEntry);
    const addDmgIncBtn = document.getElementById('addCustomDmgIncBtn');
    if (addDmgIncBtn) addDmgIncBtn.addEventListener('click', addCustomDmgIncEntry);
    const addCritBtn = document.getElementById('addCustomCritBtn');
    if (addCritBtn) addCritBtn.addEventListener('click', addCustomCritEntry);
    const addFinalBtn = document.getElementById('addCustomFinalDmgBtn');
    if (addFinalBtn) addFinalBtn.addEventListener('click', addCustomFinalDmgEntry);
    const addTakenBtn = document.getElementById('addCustomTakenBtn');
    if (addTakenBtn) addTakenBtn.addEventListener('click', addCustomTakenEntry);
    // 新增最终易伤按钮
    const addFinalVulnBtn = document.getElementById('addCustomFinalVulnBtn');
    if (addFinalVulnBtn) addFinalVulnBtn.addEventListener('click', addCustomFinalVulnEntry);
});

// ================= 记录管理模块 =================
(function() {
    const RECORDS_FILE = 'game_records.json';
    const isTauri = !!(window.__TAURI__ && window.__TAURI__.fs);
    
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
    
    let records = [];
    let isLoaded = false;
    
    async function loadRecords() {
        if (isTauri) {
            const data = await readRecordsFromFile();
            records = (data && Array.isArray(data)) ? data : [];
        } else {
            const raw = localStorage.getItem('SwordOfLily_Records');
            if (raw) {
                try { records = JSON.parse(raw); if (!Array.isArray(records)) records = []; } catch(e) { records = []; }
            } else { records = []; }
        }
        isLoaded = true;
        if (records.length > 0) await saveRecords();
    }
    
    async function saveRecords() {
        if (isTauri) await writeRecordsToFile(records);
        else localStorage.setItem('SwordOfLily_Records', JSON.stringify(records));
    }
    
    async function addRecord(name, config, damages) {
        const newRecord = { id: Date.now(), name: name.trim(), config, damages, date: new Date().toISOString() };
        records.unshift(newRecord);
        await saveRecords();
    }
    
    async function deleteRecord(id) {
        records = records.filter(r => r.id != id);
        await saveRecords();
    }
    
    async function clearAll() {
        if (confirm("确定清空所有记录吗？")) {
            records = [];
            await saveRecords();
            return true;
        }
        return false;
    }
    
    function getCurrentFullConfig() {
        return {
            atkBase: atkBaseInput.value,
            atkBuff: atkBuffSelect.value,
            flag: flagSelect.value,
            swordScepter: swordScepterSelect.value,
            basicAura: basicAuraSelect.value,
            coordAttack: coordAttackSelect.value,
            highland: highlandSelect.value,
            lowland: lowlandSelect ? lowlandSelect.value : '0',
            hangmanMark: hangmanMarkSelect.value,
            weaknessInsight: weaknessInsightSelect.value,
            def: defInput.value,
            defReduction: defReductionSelect.value,
            lockOn: lockOnSelect.value,
            armorPiercing: armorPiercingSelect.value,
            dmgBuff: dmgBuffSelect.value,
            flowLight: flowLightSelect.value,
            backAttackDmg: backAttackDmgSelect.value,
            critBuff: critBuffSelect.value,
            weaponCrit: weaponCritSelect.value,
            heshaAura: heshaAuraSelect.value,
            uriaConvert: uriaConvertSelect.value,
            finalDmgSkill: finalDmgSkillSelect.value,
            takenBuff: takenBuffSelect.value,
            injuryLevel: injuryLevelSelect.value,
            judgment: judgmentSelect.value,
            soul: soulSelect.value,
            horn: hornSelect.value,
            samanthaJudgment: samanthaJudgmentSelect.value,
            skill: skillInput.value,
            weakness: weaknessSelect.value,
            tarotSelect: tarotSelect.value,
            profession: professionSelect.value,
            finalVulnSkill: finalVulnSkillSelect ? finalVulnSkillSelect.value : '0',
            finalVulnAura: finalVulnAuraSelect ? finalVulnAuraSelect.value : '0',
            displayConvBase: displayConvParams.base,
            displayConvMultiplier: displayConvParams.multiplier,
            displayConvBonus: displayConvParams.bonus,
            displayConvHiddenBonus: displayConvParams.hiddenBonus,
            actualConvBase: actualConvParams.base,
            actualConvMultiplier: actualConvParams.multiplier,
            actualConvBonus: actualConvParams.bonus,
            actualConvHiddenBonus: actualConvParams.hiddenBonus,
            customDisplayAtkEntries: customDisplayAtkEntries.map(e => ({ name: e.name, percent: e.percent })),
            customActualAtkEntries: customActualAtkEntries.map(e => ({ name: e.name, percent: e.percent })),
            customDefReductionEntries: customDefReductionEntries.map(e => ({ name: e.name, percent: e.percent })),
            customDefIgnoreEntries: customDefIgnoreEntries.map(e => ({ name: e.name, percent: e.percent })),
            customDefFixedReductionEntries: customDefFixedReductionEntries.map(e => ({ name: e.name, value: e.value })),
            customDefIncreaseEntries: customDefIncreaseEntries.map(e => ({ name: e.name, percent: e.percent })),
            customDmgIncEntries: customDmgIncEntries.map(e => ({ name: e.name, percent: e.percent })),
            customCritEntries: customCritEntries.map(e => ({ name: e.name, percent: e.percent })),
            customFinalDmgEntries: customFinalDmgEntries.map(e => ({ name: e.name, percent: e.percent })),
            customTakenEntries: customTakenEntries.map(e => ({ name: e.name, percent: e.percent })),
            customFinalVulnEntries: customFinalVulnEntries.map(e => ({ name: e.name, percent: e.percent }))
        };
    }
    
    function getCurrentDamageSnapshot() {
        return {
            nonCrit: parseInt(document.getElementById('nonCritDamage').innerText.replace(/[^0-9-]/g, '')),
            crit: parseInt(document.getElementById('critDamage').innerText.replace(/[^0-9-]/g, ''))
        };
    }
    
    function applyRecordToCalculator(record) {
        const config = record.config;
        for (const [key, value] of Object.entries(config)) {
            if (key.includes('Conv') || key.startsWith('custom')) continue;
            const element = document.getElementById(key);
            if (element && (element.tagName === 'INPUT' || element.tagName === 'SELECT')) element.value = value;
        }
        displayConvParams = {
            base: parseFloat(config.displayConvBase) || 0, multiplier: parseFloat(config.displayConvMultiplier) || 0,
            bonus: parseFloat(config.displayConvBonus) || 0, hiddenBonus: parseFloat(config.displayConvHiddenBonus) || 0
        };
        actualConvParams = {
            base: parseFloat(config.actualConvBase) || 0, multiplier: parseFloat(config.actualConvMultiplier) || 0,
            bonus: parseFloat(config.actualConvBonus) || 0, hiddenBonus: parseFloat(config.actualConvHiddenBonus) || 0
        };
        displayAttackConversion = computeConversionValue(displayConvParams.base, displayConvParams.multiplier, displayConvParams.bonus, displayConvParams.hiddenBonus);
        actualAttackConversion = computeConversionValue(actualConvParams.base, actualConvParams.multiplier, actualConvParams.bonus, actualConvParams.hiddenBonus);
        
        if (config.customDisplayAtkEntries) {
            customDisplayAtkEntries = config.customDisplayAtkEntries.map(e => ({ name: e.name, percent: e.percent }));
            renderCustomDisplayAtkEntries();
        }
        if (config.customActualAtkEntries) {
            customActualAtkEntries = config.customActualAtkEntries.map(e => ({ name: e.name, percent: e.percent }));
            renderCustomActualAtkEntries();
        }
        if (config.customDefReductionEntries) {
            customDefReductionEntries = config.customDefReductionEntries.map(e => ({ name: e.name, percent: e.percent }));
            renderCustomDefReductionEntries();
        }
        if (config.customDefIgnoreEntries) {
            customDefIgnoreEntries = config.customDefIgnoreEntries.map(e => ({ name: e.name, percent: e.percent }));
            renderCustomDefIgnoreEntries();
        }
        if (config.customDefFixedReductionEntries) {
            customDefFixedReductionEntries = config.customDefFixedReductionEntries.map(e => ({ name: e.name, value: e.value }));
            renderCustomDefFixedReductionEntries();
        }
        if (config.customDefIncreaseEntries) {
            customDefIncreaseEntries = config.customDefIncreaseEntries.map(e => ({ name: e.name, percent: e.percent }));
            renderCustomDefIncreaseEntries();
        }
        if (config.customDmgIncEntries) {
            customDmgIncEntries = config.customDmgIncEntries.map(e => ({ name: e.name, percent: e.percent }));
            renderCustomDmgIncEntries();
        }
        if (config.customCritEntries) {
            customCritEntries = config.customCritEntries.map(e => ({ name: e.name, percent: e.percent }));
            renderCustomCritEntries();
        }
        if (config.customFinalDmgEntries) {
            customFinalDmgEntries = config.customFinalDmgEntries.map(e => ({ name: e.name, percent: e.percent }));
            renderCustomFinalDmgEntries();
        }
        if (config.customTakenEntries) {
            customTakenEntries = config.customTakenEntries.map(e => ({ name: e.name, percent: e.percent }));
            renderCustomTakenEntries();
        }
        if (config.customFinalVulnEntries) {
            customFinalVulnEntries = config.customFinalVulnEntries.map(e => ({ name: e.name, percent: e.percent }));
            renderCustomFinalVulnEntries();
        }
        // 恢复最终易伤下拉框
        if (config.finalVulnSkill !== undefined && finalVulnSkillSelect) finalVulnSkillSelect.value = config.finalVulnSkill;
        if (config.finalVulnAura !== undefined && finalVulnAuraSelect) finalVulnAuraSelect.value = config.finalVulnAura;
        updateAll();
    }
    
    // 字段元数据（新增最终易伤相关）
    const fieldMeta = {
        atkBase: { name: "基础攻击力", zone: "⚔️ 攻击区间", unit: "", alwaysShow: true },
        atkBuff: { name: "攻击BUFF", zone: "⚔️ 攻击区间", unit: "%" },
        flag: { name: "战旗", zone: "⚔️ 攻击区间", unit: "%" },
        swordScepter: { name: "剑杖刻印", zone: "⚔️ 攻击区间", unit: "%" },
        basicAura: { name: "基础光环", zone: "⚔️ 攻击区间", unit: "%" },
        coordAttack: { name: "协攻", zone: "⚔️ 攻击区间", unit: "%" },
        highland: { name: "高地", zone: "⚔️ 攻击区间 (实际加算)", unit: "%" },
        lowland: { name: "低地", zone: "⚔️ 攻击区间 (实际加算)", unit: "%" },
        lionTransform: { name: "狮子变身", zone: "⚔️ 攻击区间 (实际加算)", unit: "%" },
        hangmanMark: { name: "倒吊人指挥官", zone: "⚔️ 攻击区间 (实际加算)", unit: "%" },
        weaknessInsight: { name: "窥破弱点", zone: "⚔️ 攻击区间 (实际加算)", unit: "%" },
        displayConvBase: { name: "显示攻击转化数值", zone: "⚔️ 显示攻击转化", unit: "" },
        displayConvMultiplier: { name: "显示攻击转化倍率", zone: "⚔️ 显示攻击转化", unit: "%" },
        displayConvBonus: { name: "显示攻击转化加成", zone: "⚔️ 显示攻击转化", unit: "%" },
        displayConvHiddenBonus: { name: "显示攻击转化加成(不显示)", zone: "⚔️ 显示攻击转化", unit: "%" },
        actualConvBase: { name: "实际攻击转化数值", zone: "⚔️ 实际攻击转化", unit: "" },
        actualConvMultiplier: { name: "实际攻击转化倍率", zone: "⚔️ 实际攻击转化", unit: "%" },
        actualConvBonus: { name: "实际攻击转化加成", zone: "⚔️ 实际攻击转化", unit: "%" },
        actualConvHiddenBonus: { name: "实际攻击转化加成(不显示)", zone: "⚔️ 实际攻击转化", unit: "%" },
        def: { name: "基础防御力", zone: "🛡️ 防御区间", unit: "" },
        defReduction: { name: "防御降低", zone: "🛡️ 防御区间", unit: "%" },
        lockOn: { name: "锁定目标（号角）", zone: "🛡️ 防御区间", unit: "%" },
        armorPiercing: { name: "穿甲", zone: "🛡️ 防御区间", unit: "%" },
        dmgBuff: { name: "伤害BUFF", zone: "💥 增伤区间", unit: "%" },
        flowLight: { name: "流光", zone: "💥 增伤区间", unit: "%" },
        backAttackDmg: { name: "背击增伤", zone: "💥 增伤区间", unit: "%" },
        critBuff: { name: "爆伤BUFF", zone: "⚡ 爆伤区间", unit: "%" },
        weaponCrit: { name: "武器爆伤", zone: "⚡ 爆伤区间", unit: "%" },
        heshaAura: { name: "赫沙光环", zone: "⚡ 爆伤区间", unit: "%" },
        uriaConvert: { name: "乌利亚转化", zone: "⚡ 爆伤区间", unit: "%" },
        finalDmgSkill: { name: "最终增伤技能", zone: "✨ 最终增伤区间", unit: "%" },
        finalVulnSkill: { name: "阿尔德法印", zone: "🎯 最终易伤区间", unit: "%" },
        finalVulnAura: { name: "塞娜光环", zone: "🎯 最终易伤区间", unit: "%" },
        takenBuff: { name: "易伤BUFF", zone: "🎯 易伤区间", unit: "%" },
        injuryLevel: { name: "受伤程度", zone: "🎯 易伤区间", unit: "%" },
        judgment: { name: "审判", zone: "🎯 易伤区间", unit: "%" },
        soul: { name: "英灵", zone: "🎯 易伤区间", unit: "%" },
        horn: { name: "号角", zone: "🎯 易伤区间", unit: "%" },
        samanthaJudgment: { name: "萨曼莎审判", zone: "🎯 易伤区间", unit: "%" },
        skill: { name: "技能倍率", zone: "🌐 全局设置", unit: "%" },
        weakness: { name: "克制系数", zone: "🌐 全局设置", unit: "x" },
        tarotSelect: { name: "塔罗牌", zone: "🌐 全局设置", unit: "" },
        profession: { name: "职业天赋", zone: "🌐 全局设置", unit: "" }
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
        if (key === 'tarotSelect') {
            const map = { none: '无', magician: '魔术师 (+40%增伤)', magician_single: '魔术师单体 (+16%增伤)', justice: '正义 (+15%爆伤)', fool: '愚者 (+10%增伤)', tower: '法皇/高塔 (+20%增伤)' };
            return map[val] || val;
        } else if (key === 'profession') {
            const map = { none: '无', smasher15: '粉碎者(+15%增伤)', smasher20: '粉碎者(+20%增伤)', smasher35: '粉碎者(+35%增伤)', defender28: '防御者(+28%增伤)', assassin: '突袭者(无视+15%,爆伤+11%)', watcher: '守望者(+20%增伤,攻击+12%)', destroyer30: '毁灭者(+30%增伤)' };
            return map[val] || val;
        } else if (key === 'weakness') {
            const map = { '1.0': '无克制 (1.0)', '1.3': '三色克制 (1.3)', '0.7': '三色被克 (0.7)', '1.4': '光暗克制 (1.4)', '0.6': '光暗被克 (0.6)' };
            return map[val] || val;
        }
        const unit = fieldMeta[key]?.unit || '';
        return val + (unit ? unit : '');
    }
    
    function getRecordDamage(rec) {
        return rec.damages ? `${rec.damages.nonCrit} / ${rec.damages.crit}` : '—';
    }
    
    function getGroupedDetails(config) {
        const groups = {};
        for (const [key, value] of Object.entries(config)) {
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
            { entries: config.customDefReductionEntries, zone: '🛡️ 防御区间 (自定义降低)' },
            { entries: config.customDefIgnoreEntries, zone: '🛡️ 防御区间 (自定义无视)' },
            { entries: config.customDefFixedReductionEntries, zone: '🛡️ 防御区间 (固定值减防)' },
            { entries: config.customDefIncreaseEntries, zone: '🛡️ 防御区间 (防御提升)' },
            { entries: config.customDmgIncEntries, zone: '💥 增伤区间 (自定义)' },
            { entries: config.customCritEntries, zone: '⚡ 爆伤区间 (自定义)' },
            { entries: config.customFinalDmgEntries, zone: '✨ 最终增伤区间 (自定义)' },
            { entries: config.customTakenEntries, zone: '🎯 易伤区间 (自定义)' },
            { entries: config.customFinalVulnEntries, zone: '🎯 最终易伤区间 (自定义)' }
        ];
        for (const cz of customZones) {
            if (cz.entries && cz.entries.length) {
                if (!groups[cz.zone]) groups[cz.zone] = [];
                cz.entries.forEach(entry => {
                    let val = entry.percent !== undefined ? entry.percent + '%' : entry.value;
                    groups[cz.zone].push(`<div class="config-item"><strong>${escapeHtml(entry.name)}</strong>：${val}</div>`);
                });
            }
        }
        const zoneOrder = ['⚔️ 攻击区间', '⚔️ 攻击区间 (实际加算)', '⚔️ 显示攻击转化', '⚔️ 实际攻击转化', '⚔️ 攻击区间 (自定义显示)', '⚔️ 攻击区间 (自定义实际)', '🛡️ 防御区间', '🛡️ 防御区间 (自定义降低)', '🛡️ 防御区间 (自定义无视)', '🛡️ 防御区间 (固定值减防)', '🛡️ 防御区间 (防御提升)', '💥 增伤区间', '💥 增伤区间 (自定义)', '⚡ 爆伤区间', '⚡ 爆伤区间 (自定义)', '✨ 最终增伤区间', '✨ 最终增伤区间 (自定义)', '🎯 最终易伤区间', '🎯 最终易伤区间 (自定义)', '🎯 易伤区间', '🎯 易伤区间 (自定义)', '🌐 全局设置'];
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
        const zoneOrder = ['⚔️ 攻击区间', '⚔️ 攻击区间 (实际加算)', '⚔️ 显示攻击转化', '⚔️ 实际攻击转化', '🛡️ 防御区间', '💥 增伤区间', '⚡ 爆伤区间', '✨ 最终增伤区间', '🎯 最终易伤区间', '🎯 易伤区间', '🌐 全局设置'];
        const zoneMap = {};
        for (const [key, meta] of Object.entries(fieldMeta)) {
            if (!zoneMap[meta.zone]) zoneMap[meta.zone] = [];
            zoneMap[meta.zone].push(key);
        }
        const fieldsToShow = [];
        for (const zone of zoneOrder) {
            const fields = zoneMap[zone] || [];
            for (const field of fields) {
                const values = recordsList.map(rec => rec.config[field] !== undefined ? rec.config[field] : '');
                const allEmpty = values.every(v => isFieldEmptyValue(field, v));
                if (!allEmpty) fieldsToShow.push({ field, zone, values });
            }
        }
        
        // 收集自定义条目
        const customTypes = [
            { key: 'customDisplayAtkEntries', zone: '⚔️ 攻击区间', title: '显示攻击自定义' },
            { key: 'customActualAtkEntries', zone: '⚔️ 攻击区间', title: '实际攻击自定义' },
            { key: 'customDefReductionEntries', zone: '🛡️ 防御区间', title: '降低防御自定义' },
            { key: 'customDefIgnoreEntries', zone: '🛡️ 防御区间', title: '无视防御自定义' },
            { key: 'customDefFixedReductionEntries', zone: '🛡️ 防御区间', title: '固定值减防' },
            { key: 'customDefIncreaseEntries', zone: '🛡️ 防御区间', title: '防御提升' },
            { key: 'customDmgIncEntries', zone: '💥 增伤区间', title: '增伤自定义' },
            { key: 'customCritEntries', zone: '⚡ 爆伤区间', title: '爆伤自定义' },
            { key: 'customFinalDmgEntries', zone: '✨ 最终增伤区间', title: '最终增伤自定义' },
            { key: 'customTakenEntries', zone: '🎯 易伤区间', title: '易伤自定义' },
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
                    values.push(entry ? (entry.percent !== undefined ? entry.percent : entry.value) : 0);
                }
                const allZero = values.every(v => v === 0);
                if (allZero) continue;
                fieldsToShow.push({
                    field: `custom_${ct.key}_${name}`,
                    zone: ct.zone,
                    values: values,
                    isCustom: true,
                    customName: name,
                    isFixedValue: ct.key === 'customDefFixedReductionEntries'
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
                    if (item.isFixedValue) {
                        displayVal = item.values[i] + '';
                    } else {
                        displayVal = item.values[i] + '%';
                    }
                } else {
                    displayVal = formatFieldValue(item.field, item.values[i]);
                }
                const cls = allSame ? '' : 'diff-highlight';
                html += `<td class="${cls}">${escapeHtml(displayVal)}</td>`;
            }
            html += '<tr>';
        }
        // 伤害行
        html += '<tr class="zone-header"><td colspan="' + (recordsList.length + 1) + '">📊 伤害对比</tr>';
        html += '<tr><td class="field-name">非暴击 / 暴击</td>';
        for (const rec of recordsList) {
            const dmg = getRecordDamage(rec);
            html += `<td>${escapeHtml(dmg)}</td>`;
        }
        html += '</tr></tbody></table></div>';
        const compareArea = document.getElementById('compareArea');
        compareArea.innerHTML = html;
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
                link.download = `伤害对比_${timestamp}.png`;
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
    
    async function handleRecord() {
        let name = prompt('为本次记录命名 (最多20字)', '配置 ' + new Date().toLocaleTimeString());
        if (!name) return;
        name = name.trim();
        if (name === '') { alert('记录名称不能为空'); return; }
        if (name.length > 20) name = name.slice(0,20);
        const existing = records.find(r => r.name === name);
        if (existing) {
            if (!confirm(`记录“${name}”已存在，是否覆盖？`)) return;
            await deleteRecord(existing.id);
        }
        const config = getCurrentFullConfig();
        const damages = getCurrentDamageSnapshot();
        await addRecord(name, config, damages);
        alert(`已记录“${name}”`);
    }
    
    function renderRecordsUI() {
        const recordsArea = document.getElementById('recordsListArea');
        if (!recordsArea) return;
        if (records.length === 0) {
            recordsArea.innerHTML = '<div style="padding:20px;text-align:center">✨ 暂无记录，请在计算器中点击“记录结果”保存配置。</div>';
            document.getElementById('compareArea').innerHTML = '';
            return;
        }
        let html = '';
        records.forEach(rec => {
            html += `<div class="record-card" data-id="${rec.id}">
                <div class="record-header">
                    <div><input type="checkbox" class="compare-check" value="${rec.id}"> <span class="record-name">📌 ${escapeHtml(rec.name)}</span></div>
                    <div class="record-damage">⚔️ ${rec.damages.nonCrit}  💥 ${rec.damages.crit}</div>
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
        document.querySelectorAll('.view-detail').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                const rec = records.find(r => r.id === id);
                if (!rec) return;
                const panel = document.getElementById(`detail-${id}`);
                if (panel.style.display === 'block') { panel.style.display = 'none'; return; }
                panel.innerHTML = getGroupedDetails(rec.config) + `<div class="stat-badge" style="margin-top:12px;">⚔️ 非暴击: ${rec.damages.nonCrit} &nbsp; 💥 暴击: ${rec.damages.crit}</div>`;
                panel.style.display = 'block';
            });
        });
        document.querySelectorAll('.apply-record').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                const rec = records.find(r => r.id === id);
                if (rec) { applyRecordToCalculator(rec); document.getElementById('recordModal').classList.remove('active'); }
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
    
    document.getElementById('recordSnapshotBtn').onclick = handleRecord;
    document.getElementById('queryRecordsBtn').onclick = async () => {
        await loadRecords();
        renderRecordsUI();
        document.getElementById('recordModal').classList.add('active');
    };
    document.getElementById('clearAllRecordsBtn').onclick = async () => {
        if (await clearAll()) {
            alert('所有记录已清空');
            if (document.getElementById('recordModal').classList.contains('active')) renderRecordsUI();
        }
    };
    document.getElementById('closeModalBtn').onclick = () => document.getElementById('recordModal').classList.remove('active');
    document.getElementById('recordModal').addEventListener('click', (e) => { if (e.target === document.getElementById('recordModal')) document.getElementById('recordModal').classList.remove('active'); });
    loadRecords();
})();

preloadScreenshot();