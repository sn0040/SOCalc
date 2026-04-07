// penetration/calculator.js
import { preloadScreenshot, loadHtml2Canvas, showLoading, hideLoading, showScreenshotError } from '../common/screenshot.js';
import { computeConversionValue, createConversionManager } from '../common/conversion.js';

// ================= 自定义最终增伤条目（全局） =================
// 自定义最终增伤条目
let customFinalDmgEntries = [];
// 显示攻击自定义条目
let customDisplayAtkEntries = [];
// 实际攻击自定义条目
let customActualAtkEntries = [];
// 生命值结算自定义条目
let customLifeBonusEntries = [];
// 穿透增伤自定义条目
let customPenDmgEntries = [];
// 穿透易伤自定义条目
let customPenVulnEntries = [];

// 通用渲染函数模板，为避免重复，我们可以定义一个工厂函数，但为了清晰，分别实现
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
            <input type="number" class="custom-percent" value="${entry.percent}" step="1" placeholder="百分比" style="flex:1;">
            <button class="small-btn delete-custom" data-index="${i}" style="background:#b3403a; color:white;">删除</button>
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
    customDisplayAtkEntries.push({ name: '新条目', percent: 0 });
    renderCustomDisplayAtkEntries();
    updatePenetration();
}

// 实际攻击自定义条目
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
            <input type="number" class="custom-percent" value="${entry.percent}" step="1" placeholder="百分比" style="flex:1;">
            <button class="small-btn delete-custom" data-index="${i}" style="background:#b3403a; color:white;">删除</button>
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
    customActualAtkEntries.push({ name: '新条目', percent: 0 });
    renderCustomActualAtkEntries();
    updatePenetration();
}

// 生命值结算自定义条目
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
            <input type="number" class="custom-percent" value="${entry.percent}" step="1" placeholder="百分比" style="flex:1;">
            <button class="small-btn delete-custom" data-index="${i}" style="background:#b3403a; color:white;">删除</button>
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
    customLifeBonusEntries.push({ name: '新条目', percent: 0 });
    renderCustomLifeBonusEntries();
    updatePenetration();
}

// 穿透增伤自定义条目
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
            <input type="number" class="custom-percent" value="${entry.percent}" step="1" placeholder="百分比" style="flex:1;">
            <button class="small-btn delete-custom" data-index="${i}" style="background:#b3403a; color:white;">删除</button>
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
    customPenDmgEntries.push({ name: '新条目', percent: 0 });
    renderCustomPenDmgEntries();
    updatePenetration();
}

// 穿透易伤自定义条目
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
            <input type="number" class="custom-percent" value="${entry.percent}" step="1" placeholder="百分比" style="flex:1;">
            <button class="small-btn delete-custom" data-index="${i}" style="background:#b3403a; color:white;">删除</button>
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
    customPenVulnEntries.push({ name: '新条目', percent: 0 });
    renderCustomPenVulnEntries();
    updatePenetration();
}

window.customFinalDmgEntries = customFinalDmgEntries;
window.renderCustomFinalDmgEntries = renderCustomFinalDmgEntries;
window.escapeHtml = escapeHtml;

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
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
            <input type="number" class="custom-percent" value="${entry.percent}" step="1" placeholder="百分比" style="flex:1;">
            <button class="small-btn delete-custom" data-index="${i}" style="background:#b3403a; color:white;">删除</button>
        `;
        const nameInput = div.querySelector('.custom-name');
        const percentInput = div.querySelector('.custom-percent');
        const delBtn = div.querySelector('.delete-custom');
        nameInput.addEventListener('change', () => {
            customFinalDmgEntries[i].name = nameInput.value;
        });
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
    customFinalDmgEntries.push({ name: '新条目', percent: 0 });
    renderCustomFinalDmgEntries();
    updatePenetration();
}


// ================= 攻击转化相关 =================
let displayConvParams = { base: 0, multiplier: 0, bonus: 0, hiddenBonus: 0 };
let actualConvParams = { base: 0, multiplier: 0, bonus: 0, hiddenBonus: 0 };
let displayAttackConversion = 0;
let actualAttackConversion = 0;

const displayConvManager = createConversionManager({
    modalId: 'conversionModal',
    titleElementId: 'conversionTitle',
    closeBtnId: 'closeConversionModal',
    applyBtnId: 'applyConversionBtn',
    resetBtnId: 'resetConversionBtn',
    convBaseId: 'convBaseValue',
    convMultiplierId: 'convMultiplier',
    convBonusId: 'convBonus',
    convHiddenBonusId: 'convHiddenBonus',
    convResultId: 'convResultValue',
    paramsStore: displayConvParams,
    onUpdate: (newValue) => {
        displayAttackConversion = newValue;
        updatePenetration();
    }
});
const actualConvManager = createConversionManager({
    modalId: 'conversionModal',
    titleElementId: 'conversionTitle',
    closeBtnId: 'closeConversionModal',
    applyBtnId: 'applyConversionBtn',
    resetBtnId: 'resetConversionBtn',
    convBaseId: 'convBaseValue',
    convMultiplierId: 'convMultiplier',
    convBonusId: 'convBonus',
    convHiddenBonusId: 'convHiddenBonus',
    convResultId: 'convResultValue',
    paramsStore: actualConvParams,
    onUpdate: (newValue) => {
        actualAttackConversion = newValue;
        updatePenetration();
    }
});

displayAttackConversion = computeConversionValue(displayConvParams.base, displayConvParams.multiplier, displayConvParams.bonus, displayConvParams.hiddenBonus);
actualAttackConversion = computeConversionValue(actualConvParams.base, actualConvParams.multiplier, actualConvParams.bonus, actualConvParams.hiddenBonus);

// DOM 元素
const penAtkBase = document.getElementById('penAtkBase');
const penAtkBuff = document.getElementById('penAtkBuff');
const penFlag = document.getElementById('penFlag');
const penSwordScepter = document.getElementById('penSwordScepter');
const penBasicAura = document.getElementById('penBasicAura');
const penCoordAttack = document.getElementById('penCoordAttack');
const penAtkPersonality = document.getElementById('penAtkPersonality');
const penAtkSkill = document.getElementById('penAtkSkill');
const penAtkWeapon = document.getElementById('penAtkWeapon');
const penAtkArmor = document.getElementById('penAtkArmor');
const penAtkPercent = document.getElementById('penAtkPercent');
const penHighland = document.getElementById('penHighland');
const penHangmanMark = document.getElementById('penHangmanMark');
const penWeaknessInsight = document.getElementById('penWeaknessInsight');
const penAtkManual = document.getElementById('penAtkManual');
const penProfession = document.getElementById('penProfession');
const penWeakness = document.getElementById('penWeakness');
const penTarot = document.getElementById('penTarot');
const penLifeType = document.getElementById('penLifeType');
const penLifeValue = document.getElementById('penLifeValue');
const penLifeAtk = document.getElementById('penLifeAtk');
const penLifeTargetHp = document.getElementById('penLifeTargetHp');
const penBonusNewborn = document.getElementById('penBonusNewborn');
const penBonusArmor = document.getElementById('penBonusArmor');
const penBonusPersonality = document.getElementById('penBonusPersonality');
const penBonusReaction = document.getElementById('penBonusReaction');
const penSkillMult = document.getElementById('penSkillMult');
const penDmgBonus = document.getElementById('penDmgBonus');
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
const penVulnManual = document.getElementById('penVulnManual');

// 显示元素
const penNormalPercentSpan = document.getElementById('penNormalPercent');
const penExtraPercentSpan = document.getElementById('penExtraPercent');
const penDisplayAtkSpan = document.getElementById('penDisplayAtk');
const penActualAtkSpan = document.getElementById('penActualAtk');
const statDisplayConversionSpan = document.getElementById('statDisplayConversion');
const statActualConversionSpan = document.getElementById('statActualConversion');
const penLifeBaseSpan = document.getElementById('penLifeBase');
const penBonusTotalSpan = document.getElementById('penBonusTotal');
const penLifeResultSpan = document.getElementById('penLifeResult');
const penDmgMultSpan = document.getElementById('penDmgMult');
const penVulnMultSpan = document.getElementById('penVulnMult');
const penDamageDisplay = document.getElementById('penDamageDisplay');
const penBonusOptionsDiv = document.getElementById('penBonusOptions');
const penBonusSectionDiv = document.getElementById('penBonusSection');

function getNum(id) { return parseFloat(document.getElementById(id).value) || 0; }

function getProfAtkBonus() {
    const prof = penProfession.value;
    if (prof === 'watcher') return 12;
    return 0;
}

function computeActualAtk() {
    let atkBase = getNum('penAtkBase');
    let normalPercent = 0;
    normalPercent += getNum('penAtkBuff');
    normalPercent += getNum('penFlag');
    normalPercent += getNum('penSwordScepter');
    normalPercent += getNum('penBasicAura');
    normalPercent += getNum('penCoordAttack');
    // 注意：已经删除了个性、技能、武器、防具、其他加成等
    // 加上自定义显示攻击条目
    let customDisplaySum = customDisplayAtkEntries.reduce((sum, e) => sum + (e.percent || 0), 0);
    normalPercent += customDisplaySum;
    normalPercent += getProfAtkBonus();
    penNormalPercentSpan.textContent = normalPercent.toFixed(1);
    statDisplayConversionSpan.textContent = Math.round(displayAttackConversion);
    let displayAtk = atkBase * (1 + normalPercent / 100) + displayAttackConversion;
    penDisplayAtkSpan.textContent = Math.round(displayAtk);
    let extraPercent = 0;
    extraPercent += getNum('penHighland');
    extraPercent += parseFloat(document.getElementById('penLowland').value) || 0;
    extraPercent += getNum('penHangmanMark');
    extraPercent += getNum('penWeaknessInsight');
    // 加上自定义实际攻击条目
    let customActualSum = customActualAtkEntries.reduce((sum, e) => sum + (e.percent || 0), 0);
    extraPercent += customActualSum;
    penExtraPercentSpan.textContent = extraPercent.toFixed(1);
    statActualConversionSpan.textContent = Math.round(actualAttackConversion);
    let extraTerm = atkBase * (extraPercent / 100);
    let actualAtk = displayAtk + extraTerm + actualAttackConversion;
    penActualAtkSpan.textContent = Math.round(actualAtk);
    return actualAtk;
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
    let actualAtk = computeActualAtk();
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
// 计算最终增伤乘数（大帝寒境 + 自定义条目，乘算）
let emperorCold = parseFloat(document.getElementById('penEmperorCold').value) || 0;
let finalMult = (1 + emperorCold / 100);
for (let entry of customFinalDmgEntries) {
    finalMult *= (1 + (entry.percent || 0) / 100);
}
document.getElementById('finalDmgMult').innerText = finalMult.toFixed(2) + 'x';

let finalDamage = (attackPart + finalLifePart) * dmgMult * vulnMult * finalMult;
    finalDamage = Math.round(finalDamage);
    penDamageDisplay.innerHTML = `<small>✨</small> ${finalDamage}`;
}

function resetAll() {
    penAtkBase.value = '3000'; penAtkBuff.value = '0'; penFlag.value = '0'; penSwordScepter.value = '0';
    penBasicAura.value = '0'; penCoordAttack.value = '0'; penAtkPersonality.value = '0'; penAtkSkill.value = '0';
    penAtkWeapon.value = '0'; penAtkArmor.value = '0'; penAtkPercent.value = '0'; penHighland.value = '0';
    penHangmanMark.value = '0'; penWeaknessInsight.value = '0'; penAtkManual.value = '0'; penProfession.value = 'none';
    penWeakness.value = '1.0'; penTarot.value = 'none'; penSkillMult.value = '100';
    penLifeType.value = 'hpPercent'; penLifeValue.value = '0'; penLifeTargetHp.value = '10000'; penLifeAtk.value = '3000';
    penBonusNewborn.value = '0'; penBonusArmor.value = '0'; penBonusPersonality.value = '0'; penBonusReaction.value = '0';
    penDmgBonus.value = '0'; penDreamTalk.value = '0'; penLukarAura.value = '0'; penIsilindAura.value = '0';
    penPrism.value = '0'; penHeavyAssault.value = '0'; penMaishaAura.value = '0'; penTriggerCoop.value = '0';
    penXiaoSuPersonality.value = '0'; penGloryGuide.value = '0'; penAnnaAura.value = '0';
    penWoundLayers.value = '0'; penEmperorCold.value = '0'; penPuppet.value = '0'; penNightmare.value = '0';
    penPenVuln.value = '0'; penImmunity.value = '0'; penVulnManual.value = '0';
    // 低地选项
    const lowlandEl = document.getElementById('penLowland');
    if (lowlandEl) lowlandEl.value = '0';
    
    displayConvParams = { base: 0, multiplier: 0, bonus: 0, hiddenBonus: 0 };
    actualConvParams = { base: 0, multiplier: 0, bonus: 0, hiddenBonus: 0 };
    displayAttackConversion = 0; actualAttackConversion = 0;
    if (statDisplayConversionSpan) statDisplayConversionSpan.textContent = '0';
    if (statActualConversionSpan) statActualConversionSpan.textContent = '0';

    // 清空所有自定义条目数组并重新渲染
    customDisplayAtkEntries = [];
    if (typeof renderCustomDisplayAtkEntries === 'function') renderCustomDisplayAtkEntries();
    customActualAtkEntries = [];
    if (typeof renderCustomActualAtkEntries === 'function') renderCustomActualAtkEntries();
    customLifeBonusEntries = [];
    if (typeof renderCustomLifeBonusEntries === 'function') renderCustomLifeBonusEntries();
    customPenDmgEntries = [];
    if (typeof renderCustomPenDmgEntries === 'function') renderCustomPenDmgEntries();
    customPenVulnEntries = [];
    if (typeof renderCustomPenVulnEntries === 'function') renderCustomPenVulnEntries();
    customFinalDmgEntries = [];
    if (typeof renderCustomFinalDmgEntries === 'function') renderCustomFinalDmgEntries();

    toggleLifeRows(); 
    updatePenetration();
}

const penInputs = ['penAtkBase','penAtkBuff','penFlag','penSwordScepter','penBasicAura','penCoordAttack','penAtkPersonality','penAtkSkill','penAtkWeapon','penAtkArmor','penAtkPercent','penHighland','penHangmanMark','penWeaknessInsight','penAtkManual','penProfession','penWeakness','penTarot','penLifeType','penLifeValue','penLifeAtk','penLifeTargetHp','penSkillMult','penDmgBonus','penBonusNewborn','penBonusArmor','penBonusPersonality','penBonusReaction','penWound','penEmperorCold','penPuppet','penNightmare','penPenVuln','penImmunity','penVulnManual','penDreamTalk','penLukarAura','penIsilindAura','penPrism','penHeavyAssault','penMaishaAura','penTriggerCoop','penXiaoSuPersonality','penGloryGuide','penAnnaAura'];
penInputs.forEach(id => { const el = document.getElementById(id); if (el) el.addEventListener('input', updatePenetration); });
penLifeType.addEventListener('change', () => { toggleLifeRows(); updatePenetration(); });
document.getElementById('resetToDefault').addEventListener('click', resetAll);
toggleLifeRows(); updatePenetration();

// 绑定添加自定义条目按钮
document.addEventListener('DOMContentLoaded', function() {
    const addBtn = document.getElementById('addCustomFinalDmgBtn');
    if (addBtn) {
        addBtn.addEventListener('click', addCustomFinalDmgEntry);
        console.log('自定义条目按钮绑定成功');
    } else {
        console.error('未找到 #addCustomFinalDmgBtn');
    }
});

document.getElementById('openConversionBtnDisplay').addEventListener('click', () => displayConvManager.openModal('显示攻击转化'));
document.getElementById('openConversionBtnActual').addEventListener('click', () => actualConvManager.openModal('实际攻击转化'));

// 绑定添加自定义条目按钮
const addCustomBtn = document.getElementById('addCustomFinalDmgBtn');
if (addCustomBtn) {
    addCustomBtn.addEventListener('click', addCustomFinalDmgEntry);
} else {
    console.error('未找到按钮 #addCustomFinalDmgBtn');
}

// ========== 记录管理模块 ==========
(function() {
    let penRecords = [];
    const PEN_STORAGE_KEY = 'PenetrationRecords_V1_2_0';

    function loadPenRecords() {
        let raw = localStorage.getItem(PEN_STORAGE_KEY);
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
        penAtkBase: { name: "基础攻击力", zone: "⚔️ 攻击区间", unit: "", alwaysShow: true },
        penAtkBuff: { name: "攻击BUFF", zone: "⚔️ 攻击区间", unit: "%" },
        penFlag: { name: "战旗", zone: "⚔️ 攻击区间", unit: "%" },
        penSwordScepter: { name: "剑杖刻印", zone: "⚔️ 攻击区间", unit: "%" },
        penBasicAura: { name: "基础光环", zone: "⚔️ 攻击区间", unit: "%" },
        penCoordAttack: { name: "协攻", zone: "⚔️ 攻击区间", unit: "%" },
        penAtkPersonality: { name: "个性攻击加成", zone: "⚔️ 攻击区间", unit: "%" },
        penAtkSkill: { name: "技能攻击加成", zone: "⚔️ 攻击区间", unit: "%" },
        penAtkWeapon: { name: "武器攻击加成", zone: "⚔️ 攻击区间", unit: "%" },
        penAtkArmor: { name: "防具攻击加成", zone: "⚔️ 攻击区间", unit: "%" },
        penAtkPercent: { name: "其他攻击加成", zone: "⚔️ 攻击区间", unit: "%" },
        penHighland: { name: "高地", zone: "⚔️ 攻击区间 (实际加算)", unit: "%" },
        penHangmanMark: { name: "倒吊人指挥官", zone: "⚔️ 攻击区间 (实际加算)", unit: "%" },
        penWeaknessInsight: { name: "窥破弱点", zone: "⚔️ 攻击区间 (实际加算)", unit: "%" },
        penAtkManual: { name: "手动加成%", zone: "⚔️ 攻击区间 (实际加算)", unit: "%" },
        displayConvBase: { name: "显示攻击转化数值", zone: "⚔️ 显示攻击转化", unit: "" },
        displayConvMultiplier: { name: "显示攻击转化倍率", zone: "⚔️ 显示攻击转化", unit: "%" },
        displayConvBonus: { name: "显示攻击转化加成", zone: "⚔️ 显示攻击转化", unit: "%" },
        displayConvHiddenBonus: { name: "显示攻击转化加成(不显示)", zone: "⚔️ 显示攻击转化", unit: "%" },
        actualConvBase: { name: "实际攻击转化数值", zone: "⚔️ 实际攻击转化", unit: "" },
        actualConvMultiplier: { name: "实际攻击转化倍率", zone: "⚔️ 实际攻击转化", unit: "%" },
        actualConvBonus: { name: "实际攻击转化加成", zone: "⚔️ 实际攻击转化", unit: "%" },
        actualConvHiddenBonus: { name: "实际攻击转化加成(不显示)", zone: "⚔️ 实际攻击转化", unit: "%" },
        penProfession: { name: "职业天赋", zone: "🌐 全局设置", unit: "" },
        penWeakness: { name: "克制系数", zone: "🌐 全局设置", unit: "x" },
        penTarot: { name: "塔罗牌", zone: "🌐 全局设置", unit: "" },
        penSkillMult: { name: "技能倍率", zone: "🌐 全局设置", unit: "%" },
        penLifeType: { name: "百分比类型", zone: "📊 百分比区间", unit: "" },
        penLifeValue: { name: "结算倍率", zone: "📊 百分比区间", unit: "%" },
        penLifeTargetHp: { name: "目标生命值", zone: "📊 百分比区间", unit: "" },
        penLifeAtk: { name: "攻击力", zone: "📊 百分比区间", unit: "" },
        penBonusNewborn: { name: "新生", zone: "📊 百分比区间", unit: "%" },
        penBonusArmor: { name: "晶爆铠甲", zone: "📊 百分比区间", unit: "%" },
        penBonusPersonality: { name: "个性百分比加成", zone: "📊 百分比区间", unit: "%" },
        penBonusReaction: { name: "反应百分比加成", zone: "📊 百分比区间", unit: "%" },
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
        penDmgBonus: { name: "手动穿透增伤%", zone: "✨ 穿透增伤区间", unit: "%" },
        penWoundLayers: { name: "狼姐伤口", zone: "🎯 穿透易伤区间", unit: "%" },
        penEmperorCold: { name: "大帝个性寒境", zone: "🎯 穿透易伤区间", unit: "%" },
        penPuppet: { name: "傀儡", zone: "🎯 穿透易伤区间", unit: "%" },
        penNightmare: { name: "梦魇", zone: "🎯 穿透易伤区间", unit: "%" },
        penPenVuln: { name: "穿透易伤", zone: "🎯 穿透易伤区间", unit: "%" },
        penImmunity: { name: "免疫减免", zone: "🎯 穿透易伤区间", unit: "%" },
        penVulnManual: { name: "手动易伤%", zone: "🎯 穿透易伤区间", unit: "%" }
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
        }
        const unit = fieldMeta[key]?.unit || '';
        return val + (unit ? unit : '');
    }

    function getRecordDamage(rec) { return rec.damage !== undefined ? rec.damage : '—'; }
function getCurrentPenConfig() {
    // 辅助函数：安全获取元素值
    const getVal = (id) => {
        const el = document.getElementById(id);
        return el ? el.value : '';
    };
    return {
        penAtkBase: getVal('penAtkBase'),
        penAtkBuff: getVal('penAtkBuff'),
        penFlag: getVal('penFlag'),
        penSwordScepter: getVal('penSwordScepter'),
        penBasicAura: getVal('penBasicAura'),
        penCoordAttack: getVal('penCoordAttack'),
        penAtkPersonality: getVal('penAtkPersonality'),
        penAtkSkill: getVal('penAtkSkill'),
        penAtkWeapon: getVal('penAtkWeapon'),
        penAtkArmor: getVal('penAtkArmor'),
        penAtkPercent: getVal('penAtkPercent'),
        penHighland: getVal('penHighland'),
        penHangmanMark: getVal('penHangmanMark'),
        penWeaknessInsight: getVal('penWeaknessInsight'),
        penAtkManual: getVal('penAtkManual'),
        penProfession: getVal('penProfession'),
        penWeakness: getVal('penWeakness'),
        penTarot: getVal('penTarot'),
        penSkillMult: getVal('penSkillMult'),
        penLifeType: getVal('penLifeType'),
        penLifeValue: getVal('penLifeValue'),
        penLifeAtk: getVal('penLifeAtk'),
        penLifeTargetHp: getVal('penLifeTargetHp'),
        penDmgBonus: getVal('penDmgBonus'),
        penBonusNewborn: getVal('penBonusNewborn'),
        penBonusArmor: getVal('penBonusArmor'),
        penBonusPersonality: getVal('penBonusPersonality'),
        penBonusReaction: getVal('penBonusReaction'),
        penWoundLayers: getVal('penWoundLayers'),
        penEmperorCold: getVal('penEmperorCold'),
        penPuppet: getVal('penPuppet'),
        penNightmare: getVal('penNightmare'),
        penPenVuln: getVal('penPenVuln'),
        penImmunity: getVal('penImmunity'),
        penVulnManual: getVal('penVulnManual'),
        penDreamTalk: getVal('penDreamTalk'),
        penLukarAura: getVal('penLukarAura'),
        penIsilindAura: getVal('penIsilindAura'),
        penPrism: getVal('penPrism'),
        penHeavyAssault: getVal('penHeavyAssault'),
        penMaishaAura: getVal('penMaishaAura'),
        penTriggerCoop: getVal('penTriggerCoop'),
        penXiaoSuPersonality: getVal('penXiaoSuPersonality'),
        penGloryGuide: getVal('penGloryGuide'),
        penAnnaAura: getVal('penAnnaAura'),
        displayConvBase: displayConvParams.base,
        displayConvMultiplier: displayConvParams.multiplier,
        displayConvBonus: displayConvParams.bonus,
        displayConvHiddenBonus: displayConvParams.hiddenBonus,
        actualConvBase: actualConvParams.base,
        actualConvMultiplier: actualConvParams.multiplier,
        actualConvBonus: actualConvParams.bonus,
        actualConvHiddenBonus: actualConvParams.hiddenBonus,
        customFinalDmgEntries: (window.customFinalDmgEntries || []).map(entry => ({ name: entry.name, percent: entry.percent })),
        customDisplayAtkEntries: customDisplayAtkEntries.map(e => ({ name: e.name, percent: e.percent })),
        customActualAtkEntries: customActualAtkEntries.map(e => ({ name: e.name, percent: e.percent })),
        customLifeBonusEntries: customLifeBonusEntries.map(e => ({ name: e.name, percent: e.percent })),
        customPenDmgEntries: customPenDmgEntries.map(e => ({ name: e.name, percent: e.percent })),
        customPenVulnEntries: customPenVulnEntries.map(e => ({ name: e.name, percent: e.percent }))
    };
}


function applyRecordToCalculator(record) {
    const config = record.config;
    for (const [key, value] of Object.entries(config)) {
        if (key.includes('Conv')) continue;
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
    
    // 恢复穿透计算器实际拥有的自定义条目
    if (config.customDisplayAtkEntries) {
        customDisplayAtkEntries = config.customDisplayAtkEntries.map(e => ({ name: e.name, percent: e.percent }));
        renderCustomDisplayAtkEntries();
    } else { customDisplayAtkEntries = []; renderCustomDisplayAtkEntries(); }
    
    if (config.customActualAtkEntries) {
        customActualAtkEntries = config.customActualAtkEntries.map(e => ({ name: e.name, percent: e.percent }));
        renderCustomActualAtkEntries();
    } else { customActualAtkEntries = []; renderCustomActualAtkEntries(); }
    
    if (config.customLifeBonusEntries) {
        customLifeBonusEntries = config.customLifeBonusEntries.map(e => ({ name: e.name, percent: e.percent }));
        renderCustomLifeBonusEntries();
    } else { customLifeBonusEntries = []; renderCustomLifeBonusEntries(); }
    
    if (config.customPenDmgEntries) {
        customPenDmgEntries = config.customPenDmgEntries.map(e => ({ name: e.name, percent: e.percent }));
        renderCustomPenDmgEntries();
    } else { customPenDmgEntries = []; renderCustomPenDmgEntries(); }
    
    if (config.customPenVulnEntries) {
        customPenVulnEntries = config.customPenVulnEntries.map(e => ({ name: e.name, percent: e.percent }));
        renderCustomPenVulnEntries();
    } else { customPenVulnEntries = []; renderCustomPenVulnEntries(); }
    
    if (config.customFinalDmgEntries) {
        customFinalDmgEntries = config.customFinalDmgEntries.map(e => ({ name: e.name, percent: e.percent }));
        renderCustomFinalDmgEntries();
    } else { customFinalDmgEntries = []; renderCustomFinalDmgEntries(); }
    
    // 恢复伤口层数（兼容新旧记录）
    if (config.penWoundLayers !== undefined) {
        document.getElementById('penWoundLayers').value = config.penWoundLayers;
    } else if (config.penWound !== undefined) {
        const oldValue = parseFloat(config.penWound);
        let layers = 0;
        if (oldValue === 12) layers = 1;
        else if (oldValue === 25) layers = 2;
        else if (oldValue === 40) layers = 3;
        else if (oldValue === 57) layers = 4;
        document.getElementById('penWoundLayers').value = layers;
    }
    
    toggleLifeRows();
    updatePenetration();
}

    function getGroupedDetails(config) {
    const zoneOrder = ['⚔️ 攻击区间', '⚔️ 攻击区间 (实际加算)', '⚔️ 显示攻击转化', '⚔️ 实际攻击转化', '📊 百分比区间', '✨ 穿透增伤区间', '🎯 穿透易伤区间', '🌐 全局设置'];
    const groups = {};
    for (const [key, value] of Object.entries(config)) {
        if (key === 'dotEntries') continue;
        const meta = fieldMeta[key];
        if (!meta) continue;
        if (isFieldEmptyValue(key, value)) continue;
        if (!groups[meta.zone]) groups[meta.zone] = [];
        groups[meta.zone].push(`<div class="config-item"><strong>${meta.name}</strong>：${formatFieldValue(key, value)}</div>`);
    }
    
    function addCustomGroup(entries, zoneKey) {
        if (entries && entries.length) {
            if (!groups[zoneKey]) groups[zoneKey] = [];
            entries.forEach(entry => {
                groups[zoneKey].push(`<div class="config-item"><strong>${escapeHtml(entry.name)}</strong>：${entry.percent}%</div>`);
            });
        }
    }
    
    addCustomGroup(config.customDisplayAtkEntries, '⚔️ 攻击区间 (自定义显示)');
    addCustomGroup(config.customActualAtkEntries, '⚔️ 攻击区间 (自定义实际)');
    addCustomGroup(config.customLifeBonusEntries, '📊 百分比区间 (自定义)');
    addCustomGroup(config.customPenDmgEntries, '✨ 穿透增伤区间 (自定义)');
    addCustomGroup(config.customPenVulnEntries, '🎯 穿透易伤区间 (自定义)');
    addCustomGroup(config.customFinalDmgEntries, '✨ 最终增伤区间 (自定义)');
    
    const allZones = [...zoneOrder, '⚔️ 攻击区间 (自定义显示)', '⚔️ 攻击区间 (自定义实际)', '📊 百分比区间 (自定义)', '✨ 穿透增伤区间 (自定义)', '🎯 穿透易伤区间 (自定义)', '✨ 最终增伤区间 (自定义)'];
    let html = '';
    for (const zone of allZones) {
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
    const zoneOrder = ['⚔️ 攻击区间', '⚔️ 攻击区间 (实际加算)', '⚔️ 显示攻击转化', '⚔️ 实际攻击转化', '📊 百分比区间', '✨ 穿透增伤区间', '🎯 穿透易伤区间', '🌐 全局设置'];
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
        { key: 'customDisplayAtkEntries', zone: '⚔️ 攻击区间' },
        { key: 'customActualAtkEntries', zone: '⚔️ 攻击区间' },
        { key: 'customLifeBonusEntries', zone: '📊 百分比区间' },
        { key: 'customPenDmgEntries', zone: '✨ 穿透增伤区间' },
        { key: 'customPenVulnEntries', zone: '🎯 穿透易伤区间' },
        { key: 'customFinalDmgEntries', zone: '✨ 穿透增伤区间' }
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
    html += '<tr class="zone-header"><td colspan="' + (recordsList.length + 1) + '">✨ 伤害对比</td></tr>';
    html += '<tr><td class="field-name">穿透伤害</td>';
    for (const rec of recordsList) {
        html += `<td>${escapeHtml(getRecordDamage(rec))}</td>`;
    }
    html += '<tr></tbody></table></div>';
    
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

    function escapeHtml(str) { if (!str) return ''; return String(str).replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[m])); }

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

// 绑定添加自定义条目按钮
document.addEventListener('DOMContentLoaded', function() {
    // 最终增伤自定义按钮
    const addFinalBtn = document.getElementById('addCustomFinalDmgBtn');
    if (addFinalBtn) {
        addFinalBtn.addEventListener('click', addCustomFinalDmgEntry);
        console.log('最终增伤按钮绑定成功');
    } else {
        console.error('未找到 #addCustomFinalDmgBtn');
    }
    // 显示攻击自定义按钮
    const addDisplayBtn = document.getElementById('addCustomDisplayAtkBtn');
    if (addDisplayBtn) {
        addDisplayBtn.addEventListener('click', addCustomDisplayAtkEntry);
        console.log('显示攻击按钮绑定成功');
    } else {
        console.error('未找到 #addCustomDisplayAtkBtn');
    }
    // 实际攻击自定义按钮
    const addActualBtn = document.getElementById('addCustomActualAtkBtn');
    if (addActualBtn) {
        addActualBtn.addEventListener('click', addCustomActualAtkEntry);
        console.log('实际攻击按钮绑定成功');
    } else {
        console.error('未找到 #addCustomActualAtkBtn');
    }
    // 生命值结算自定义按钮
    const addLifeBtn = document.getElementById('addCustomLifeBonusBtn');
    if (addLifeBtn) {
        addLifeBtn.addEventListener('click', addCustomLifeBonusEntry);
        console.log('生命值结算按钮绑定成功');
    } else {
        console.error('未找到 #addCustomLifeBonusBtn');
    }
    // 穿透增伤自定义按钮
    const addPenDmgBtn = document.getElementById('addCustomPenDmgBtn');
    if (addPenDmgBtn) {
        addPenDmgBtn.addEventListener('click', addCustomPenDmgEntry);
        console.log('穿透增伤按钮绑定成功');
    } else {
        console.error('未找到 #addCustomPenDmgBtn');
    }
    // 穿透易伤自定义按钮
    const addPenVulnBtn = document.getElementById('addCustomPenVulnBtn');
    if (addPenVulnBtn) {
        addPenVulnBtn.addEventListener('click', addCustomPenVulnEntry);
        console.log('穿透易伤按钮绑定成功');
    } else {
        console.error('未找到 #addCustomPenVulnBtn');
    }
});

preloadScreenshot();