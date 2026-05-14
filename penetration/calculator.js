// penetration/calculator.js
import { preloadScreenshot, loadHtml2Canvas, showLoading, hideLoading, showScreenshotError } from '../common/screenshot.js';
import { computeConversionValue } from '../common/conversion.js';
import { CustomEntryList } from '../common/utils.js';
import { getTarotName, getProfessionName, getWeaknessName, LIFE_TYPE, getImmunityName, ANNA_AURA, EMPEROR_COLD, FINAL_VULN_AURA, ATTACK_MODE } from '../common/gameData.js';
import { calculatePenetration } from './calc.js';
import { createRecordManager } from '../common/recordManager.js';

// ================= 自定义条目管理器 =================
const customDisplayAtkList = new CustomEntryList({ containerId: 'customDisplayAtkContainer', onUpdate: updatePenetration });
const customActualAtkList = new CustomEntryList({ containerId: 'customActualAtkContainer', onUpdate: updatePenetration });
const customLifeBonusList = new CustomEntryList({ containerId: 'customLifeBonusContainer', onUpdate: updatePenetration });
const customPenDmgList = new CustomEntryList({ containerId: 'customPenDmgContainer', onUpdate: updatePenetration });
const customPenVulnList = new CustomEntryList({ containerId: 'customPenVulnContainer', onUpdate: updatePenetration });
const customFinalDmgList = new CustomEntryList({ containerId: 'customFinalDmgContainer', onUpdate: updatePenetration });
const customFinalVulnList = new CustomEntryList({ containerId: 'customFinalVulnContainer', onUpdate: updatePenetration });

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
// ================= 收集输入 =================
function collectInputs() {
    const normalBase = (parseFloat(penAtkBuff.value) || 0) +
        (parseFloat(penFlag.value) || 0) +
        (parseFloat(penSwordScepter.value) || 0) +
        (parseFloat(penBasicAura.value) || 0) +
        (parseFloat(penCoordAttack.value) || 0);
    const customDisplaySum = customDisplayAtkList.entries.reduce((sum, e) => sum + (e.percent || 0), 0);

    const extraBase = (parseFloat(penHighland.value) || 0) +
        (parseFloat(penLowland.value) || 0) +
        (parseFloat(penHangmanMark.value) || 0) +
        (parseFloat(penWeaknessInsight.value) || 0);
    const watcherExtra = penProfession.value === 'watcher' ? 12 : 0;
    const customActualSum = customActualAtkList.entries.reduce((sum, e) => sum + (e.percent || 0), 0);

    return {
        attackMode: attackMode,
        penAtkBaseSingle: parseFloat(penAtkBaseSingle.value) || 0,
        penAtkPhys: parseFloat(penAtkPhys.value) || 0,
        penAtkMagic: parseFloat(penAtkMagic.value) || 0,
        normalPercent: normalBase + customDisplaySum,
        extraPercent: extraBase + watcherExtra + customActualSum,
        singleDisplayConversion: singleDisplayConversion,
        singleActualConversion: singleActualConversion,
        physConversion: physConversion,
        magicConversion: magicConversion,
        penWeakness: parseFloat(penWeakness.value) || 1.0,
        penSkillMult: parseFloat(penSkillMult.value) || 0,
        penLifeType: penLifeType.value,
        penLifeValue: parseFloat(penLifeValue.value) || 0,
        penLifeAtk: parseFloat(penLifeAtk.value) || 0,
        penLifeTargetHp: parseFloat(penLifeTargetHp.value) || 0,
        penTarot: penTarot.value,
        penProfession: penProfession.value,
        penDreamTalk: parseFloat(penDreamTalk.value) || 0,
        penLukarAura: parseFloat(penLukarAura.value) || 0,
        penIsilindAura: parseFloat(penIsilindAura.value) || 0,
        penPrism: parseFloat(penPrism.value) || 0,
        penHeavyAssault: parseFloat(penHeavyAssault.value) || 0,
        penMaishaAura: parseFloat(penMaishaAura.value) || 0,
        penTriggerCoop: parseFloat(penTriggerCoop.value) || 0,
        penXiaoSuPersonality: parseFloat(penXiaoSuPersonality.value) || 0,
        penGloryGuide: parseFloat(penGloryGuide.value) || 0,
        penAnnaAura: parseFloat(penAnnaAura.value) || 0,
        woundLayers: parseInt(penWoundLayers.value) || 0,
        puppet: parseFloat(penPuppet.value) || 0,
        nightmare: parseFloat(penNightmare.value) || 0,
        penPenVuln: parseFloat(penPenVuln.value) || 0,
        immunity: parseFloat(penImmunity.value) || 0,
        emperorCold: parseFloat(penEmperorCold.value) || 0,
        finalVulnAura: parseFloat(finalVulnAuraSelect.value) || 0,
        customPenDmgEntries: customPenDmgList.entries.map(e => e.percent || 0),
        customPenVulnEntries: customPenVulnList.entries.map(e => e.percent || 0),
        customFinalDmgEntries: customFinalDmgList.entries.map(e => e.percent || 0),
        customFinalVulnEntries: customFinalVulnList.entries.map(e => e.percent || 0),
        customLifeBonusEntries: customLifeBonusList.entries.map(e => e.percent || 0),
    };
}

// ================= 渲染结果 =================
function renderResults(r) {
    penLifeBaseSpan.textContent = r.lifeBase;
    if (penLifeType.value === 'hpPercent') {
        penBonusTotalSpan.textContent = r.bonusTotal.toFixed(1);
    } else {
        penBonusTotalSpan.textContent = '0';
    }
    penLifeResultSpan.textContent = r.finalLifePart;
    penDmgMultSpan.textContent = r.dmgMult.toFixed(2) + 'x';
    penVulnMultSpan.textContent = r.vulnMult.toFixed(2) + 'x';
    document.getElementById('finalDmgMult').innerText = r.finalMult.toFixed(2) + 'x';
    if (finalVulnMultSpan) finalVulnMultSpan.innerText = r.finalVulnMult.toFixed(2) + 'x';
    penDamageDisplay.innerHTML = `<small>✨</small> ${r.finalDamage}`;

    // 攻击 UI
    if (attackMode === 'single') {
        document.getElementById('singleAttackArea').style.display = 'block';
        document.getElementById('doubleAttackArea').style.display = 'none';
        document.getElementById('singleDisplayArea').style.display = 'block';
        document.getElementById('doubleDisplayArea').style.display = 'none';
        document.getElementById('singleActualArea').style.display = 'block';
        document.getElementById('doubleActualArea').style.display = 'none';
        penNormalPercentSingle.innerText = r.normalPercent.toFixed(1);
        statDisplayConversionSingle.innerText = Math.round(singleDisplayConversion);
        penDisplayAtkSingle.innerText = r.singleDisplayAtk;
        penExtraPercentSingle.innerText = r.extraPercent.toFixed(1);
        statActualConversionSingle.innerText = Math.round(singleActualConversion);
        penActualAtkSingle.innerText = r.singleActualAtk;
    } else {
        document.getElementById('singleAttackArea').style.display = 'none';
        document.getElementById('doubleAttackArea').style.display = 'block';
        document.getElementById('singleDisplayArea').style.display = 'none';
        document.getElementById('doubleDisplayArea').style.display = 'block';
        document.getElementById('singleActualArea').style.display = 'none';
        document.getElementById('doubleActualArea').style.display = 'block';
        penNormalPercentDouble.innerText = r.normalPercent.toFixed(1);
        statPhysConversion.innerText = Math.round(physConversion);
        penPhysDisplay.innerText = r.physDisplayAtk;
        statMagicConversion.innerText = Math.round(magicConversion);
        penMagicDisplay.innerText = r.magicDisplayAtk;
        penExtraPercentDouble.innerText = r.extraPercent.toFixed(1);
        document.getElementById('statPhysConversionActual').innerText = Math.round(physConversion);
        penPhysActual.innerText = r.physActualAtk;
        document.getElementById('statMagicConversionActual').innerText = Math.round(magicConversion);
        penMagicActual.innerText = r.magicActualAtk;
    }
}

// ================= 主计算逻辑 =================
function updatePenetration() {
    const inputs = collectInputs();
    const r = calculatePenetration(inputs);
    renderResults(r);
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
    customDisplayAtkList.clear();
    customActualAtkList.clear();
    customLifeBonusList.clear();
    customPenDmgList.clear();
    customPenVulnList.clear();
    customFinalDmgList.clear();
    customFinalVulnList.clear();
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
    updatePenetration();
});

document.getElementById('openConversionBtnDisplaySingle').addEventListener('click', openSingleDisplayModal);
document.getElementById('openConversionBtnActualSingle').addEventListener('click', openSingleActualModal);
document.getElementById('openPhysConv').addEventListener('click', openPhysModal);
document.getElementById('openMagicConv').addEventListener('click', openMagicModal);
document.getElementById('openPhysConvActual').addEventListener('click', openPhysModal);
document.getElementById('openMagicConvActual').addEventListener('click', openMagicModal);
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
    if (addDisplayBtn) addDisplayBtn.addEventListener('click', () => customDisplayAtkList.add());
    const addActualBtn = document.getElementById('addCustomActualAtkBtn');
    if (addActualBtn) addActualBtn.addEventListener('click', () => customActualAtkList.add());
    const addLifeBtn = document.getElementById('addCustomLifeBonusBtn');
    if (addLifeBtn) addLifeBtn.addEventListener('click', () => customLifeBonusList.add());
    const addPenDmgBtn = document.getElementById('addCustomPenDmgBtn');
    if (addPenDmgBtn) addPenDmgBtn.addEventListener('click', () => customPenDmgList.add());
    const addPenVulnBtn = document.getElementById('addCustomPenVulnBtn');
    if (addPenVulnBtn) addPenVulnBtn.addEventListener('click', () => customPenVulnList.add());
    const addFinalBtn = document.getElementById('addCustomFinalDmgBtn');
    if (addFinalBtn) addFinalBtn.addEventListener('click', () => customFinalDmgList.add());
    const addFinalVulnBtn = document.getElementById('addCustomFinalVulnBtn');
    if (addFinalVulnBtn) addFinalVulnBtn.addEventListener('click', () => customFinalVulnList.add());
});

// ================= 记录管理模块 =================
const penFieldMeta = {
    penAtkBaseSingle: { name: "基础攻击力(单)", zone: "⚔️ 攻击区间", unit: "", alwaysShow: true },
    penAtkPhys: { name: "基础物攻", zone: "⚔️ 攻击区间", unit: "" },
    penAtkMagic: { name: "基础魔攻", zone: "⚔️ 攻击区间", unit: "" },
    penAtkBuff: { name: "攻击BUFF", zone: "⚔️ 攻击区间", unit: "%" },
    penFlag: { name: "战旗", zone: "⚔️ 攻击区间", unit: "%" },
    penSwordScepter: { name: "剑杖刻印", zone: "⚔️ 攻击区间", unit: "%" },
    penBasicAura: { name: "基础光环", zone: "⚔️ 攻击区间", unit: "%" },
    penCoordAttack: { name: "协攻", zone: "⚔️ 攻击区间", unit: "%" },
    penHighland: { name: "高地", zone: "⚔️ 攻击区间", unit: "%" },
    penLowland: { name: "低地", zone: "⚔️ 攻击区间", unit: "%" },
    penHangmanMark: { name: "倒吊人指挥官", zone: "⚔️ 攻击区间", unit: "%" },
    penWeaknessInsight: { name: "窥破弱点", zone: "⚔️ 攻击区间", unit: "%" },
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
    finalVulnAura: { name: "塞娜光环", zone: "🎯 最终易伤区间", unit: "%" },
    _singleDisplayConversion: { name: "显示攻击转化值", zone: "⚔️ 攻击区间", unit: "" },
    _singleActualConversion: { name: "实际攻击转化值", zone: "⚔️ 攻击区间", unit: "" },
    _physConversion: { name: "物攻转化值", zone: "⚔️ 攻击区间", unit: "" },
    _magicConversion: { name: "魔攻转化值", zone: "⚔️ 攻击区间", unit: "" },
    _displayAtk: { name: "显示攻击力", zone: "⚔️ 攻击区间", unit: "" },
    _actualAtk: { name: "实际攻击力", zone: "⚔️ 攻击区间", unit: "" }
};

function isFieldEmptyValue(key, value) {
    if (value === undefined || value === null) return true;
    const str = value.toString().trim();
    if (str === '' || str === '0' || str === 'none' || str === '无') return true;
    const num = parseFloat(str);
    if (!isNaN(num) && num === 0) return true;
    return false;
}
const PEN_SELECT_LABELS = {
    penAtkBuff:           { '0':'无', '10':'攻击1', '20':'攻击2', '30':'攻击3', '40':'攻击4' },
    penFlag:              { '0':'无', '20':'有战旗' },
    penSwordScepter:      { '0':'不触发', '4':'一步', '8':'两步', '12':'三步以上' },
    penBasicAura:         { '0':'无', '10':'有' },
    penCoordAttack:       { '0':'无', '5':'协攻1', '10':'协攻2', '15':'协攻3' },
    penHighland:          { '0':'无', '15':'有' },
    penLowland:           { '0':'无', '-10':'有' },
    penHangmanMark:       { '0':'无', '15':'有' },
    penWeaknessInsight:   { '0':'无', '20':'有' },
    penDreamTalk:         { '0':'无' },
    penLukarAura:         { '0':'无' },
    penIsilindAura:       { '0':'无' },
    penPrism:             { '0':'无' },
    penHeavyAssault:      { '0':'无' },
    penMaishaAura:        { '0':'无' },
    penTriggerCoop:       { '0':'无' },
    penXiaoSuPersonality: { '0':'无' },
    penGloryGuide:        { '0':'无' },
    penAnnaAura:          { '0':'无', '10':'有', '20':'守护失效' },
    penEmperorCold:       { '0':'无', '10':'有' },
    finalVulnAura:        { '0':'无', '10':'有' },
    attackMode:           { 'single':'单攻结算', 'double':'双攻结算' },
};

function formatFieldValue(key, value) {
    if (value === undefined || value === null) return '—';
    let val = value.toString();
    if (key === 'penTarot') return getTarotName(val);
    else if (key === 'penProfession') return getProfessionName(val);
    else if (key === 'penWeakness') return getWeaknessName(val, true);
    else if (key === 'penLifeType') return LIFE_TYPE[val] || val;
    else if (key === 'penImmunity') return getImmunityName(val);
    else if (key === 'penAnnaAura') return ANNA_AURA[val] || (val + '%');
    else if (key === 'penEmperorCold') return EMPEROR_COLD[val] || val;
    else if (key === 'attackMode') return ATTACK_MODE[val] || val;
    else if (key === 'finalVulnAura') return FINAL_VULN_AURA[val] || val;
    const label = PEN_SELECT_LABELS[key]?.[val];
    const unit = penFieldMeta[key]?.unit || '';
    if (label && label !== val) return `${label} (${val}${unit})`;
    return val + (unit ? unit : '');
}
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
        customDisplayAtkEntries: customDisplayAtkList.entries.map(e => ({ name: e.name, percent: e.percent })),
        customActualAtkEntries: customActualAtkList.entries.map(e => ({ name: e.name, percent: e.percent })),
        customLifeBonusEntries: customLifeBonusList.entries.map(e => ({ name: e.name, percent: e.percent })),
        customPenDmgEntries: customPenDmgList.entries.map(e => ({ name: e.name, percent: e.percent })),
        customPenVulnEntries: customPenVulnList.entries.map(e => ({ name: e.name, percent: e.percent })),
        customFinalDmgEntries: customFinalDmgList.entries.map(e => ({ name: e.name, percent: e.percent })),
        customFinalVulnEntries: customFinalVulnList.entries.map(e => ({ name: e.name, percent: e.percent })),
        _displayAtk: attackMode === 'single' ? penDisplayAtkSingle.innerText : (penPhysDisplay.innerText + ' + ' + penMagicDisplay.innerText),
        _actualAtk: attackMode === 'single' ? penActualAtkSingle.innerText : (penPhysActual.innerText + ' + ' + penMagicActual.innerText),
        _singleDisplayConversion: singleDisplayConversion,
        _singleActualConversion: singleActualConversion,
        _physConversion: physConversion,
        _magicConversion: magicConversion
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
        base: parseFloat(config.singleDisplayConvBase) || 0, multiplier: parseFloat(config.singleDisplayConvMultiplier) || 0,
        bonus: parseFloat(config.singleDisplayConvBonus) || 0, hiddenBonus: parseFloat(config.singleDisplayConvHiddenBonus) || 0
    };
    singleActualConvParams = {
        base: parseFloat(config.singleActualConvBase) || 0, multiplier: parseFloat(config.singleActualConvMultiplier) || 0,
        bonus: parseFloat(config.singleActualConvBonus) || 0, hiddenBonus: parseFloat(config.singleActualConvHiddenBonus) || 0
    };
    physConvParams = {
        base: parseFloat(config.physConvBase) || 0, multiplier: parseFloat(config.physConvMultiplier) || 0,
        bonus: parseFloat(config.physConvBonus) || 0, hiddenBonus: parseFloat(config.physConvHiddenBonus) || 0
    };
    magicConvParams = {
        base: parseFloat(config.magicConvBase) || 0, multiplier: parseFloat(config.magicConvMultiplier) || 0,
        bonus: parseFloat(config.magicConvBonus) || 0, hiddenBonus: parseFloat(config.magicConvHiddenBonus) || 0
    };
    singleDisplayConversion = computeConversionValue(singleDisplayConvParams.base, singleDisplayConvParams.multiplier, singleDisplayConvParams.bonus, singleDisplayConvParams.hiddenBonus);
    singleActualConversion = computeConversionValue(singleActualConvParams.base, singleActualConvParams.multiplier, singleActualConvParams.bonus, singleActualConvParams.hiddenBonus);
    physConversion = computeConversionValue(physConvParams.base, physConvParams.multiplier, physConvParams.bonus, physConvParams.hiddenBonus);
    magicConversion = computeConversionValue(magicConvParams.base, magicConvParams.multiplier, magicConvParams.bonus, magicConvParams.hiddenBonus);
    if (config.customDisplayAtkEntries) customDisplayAtkList.setFromSaved(config.customDisplayAtkEntries);
    if (config.customActualAtkEntries) customActualAtkList.setFromSaved(config.customActualAtkEntries);
    if (config.customLifeBonusEntries) customLifeBonusList.setFromSaved(config.customLifeBonusEntries);
    if (config.customPenDmgEntries) customPenDmgList.setFromSaved(config.customPenDmgEntries);
    if (config.customPenVulnEntries) customPenVulnList.setFromSaved(config.customPenVulnEntries);
    if (config.customFinalDmgEntries) customFinalDmgList.setFromSaved(config.customFinalDmgEntries);
    if (config.customFinalVulnEntries) customFinalVulnList.setFromSaved(config.customFinalVulnEntries);
    toggleLifeRows();
    updatePenetration();
}

const penRecordManager = createRecordManager({
    storageKey: 'PenetrationRecords_V2_1',
    recordNamePrefix: '穿透',
    getDamageDisplay: (rec) => `✨ ${rec.damage}`,
    getDamageShort: (rec) => rec.damage !== undefined ? rec.damage : '—',
    getCurrentConfig: getCurrentPenConfig,
    applyConfig: applyRecordToCalculator,
    getDamageSnapshot: () => parseInt(penDamageDisplay.innerText.replace(/[^0-9-]/g, '')),
    fieldMeta: penFieldMeta,
    formatFieldValue,
    isFieldEmptyValue,
    zoneOrder: ['⚔️ 攻击区间', '📊 百分比区间', '✨ 穿透增伤区间', '🎯 穿透易伤区间', '✨ 最终增伤区间', '🎯 最终易伤区间', '🌐 全局设置'],
    compareCustomTypes: [
        { key: 'customDisplayAtkEntries', zone: '⚔️ 攻击区间' },
        { key: 'customActualAtkEntries', zone: '⚔️ 攻击区间' },
        { key: 'customLifeBonusEntries', zone: '📊 百分比区间' },
        { key: 'customPenDmgEntries', zone: '✨ 穿透增伤区间' },
        { key: 'customPenVulnEntries', zone: '🎯 穿透易伤区间' },
        { key: 'customFinalDmgEntries', zone: '✨ 最终增伤区间' },
        { key: 'customFinalVulnEntries', zone: '🎯 最终易伤区间' },
    ],
    compareDamageLabel: '穿透伤害',
    screenshotFileName: '穿透对比',
    screenshotLoadingText: '生成截图中...',
    clearConfirmText: '确定清空所有穿透记录吗？',
    saveBtnId: 'penRecordBtn',
    queryBtnId: 'penQueryBtn',
    clearBtnId: 'penClearBtn',
});
preloadScreenshot();