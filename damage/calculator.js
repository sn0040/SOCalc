// damage/calculator.js
import { preloadScreenshot, loadHtml2Canvas, showLoading, hideLoading, showScreenshotError } from '../common/screenshot.js';
import { computeConversionValue } from '../common/conversion.js';
import { CustomEntryList } from '../common/utils.js';
import { getTarotName, getProfessionName, getWeaknessName, FINAL_VULN_SMASH } from '../common/gameData.js';
import { calculateDamage } from './calc.js';
import { createRecordManager } from '../common/recordManager.js';
import { APP_VERSION, APP_VERSION_DISPLAY } from '../common/version.js';

// ================= 自定义条目管理器 =================
const customDisplayAtkList = new CustomEntryList({ containerId: 'customDisplayAtkContainer', onUpdate: updateAll });
const customActualAtkList = new CustomEntryList({ containerId: 'customActualAtkContainer', onUpdate: updateAll });
const customDefReductionList = new CustomEntryList({ containerId: 'customDefReductionContainer', onUpdate: updateAll });
const customDefIgnoreList = new CustomEntryList({ containerId: 'customDefIgnoreContainer', onUpdate: updateAll });
const customDefFixedReductionList = new CustomEntryList({ containerId: 'customDefFixedReductionContainer', onUpdate: updateAll, valueKey: 'value', placeholder: '固定值' });
const customDefIncreaseList = new CustomEntryList({ containerId: 'customDefIncreaseContainer', onUpdate: updateAll });
const customDmgIncList = new CustomEntryList({ containerId: 'customDmgIncContainer', onUpdate: updateAll });
const customCritList = new CustomEntryList({ containerId: 'customCritContainer', onUpdate: updateAll });
const customFinalDmgList = new CustomEntryList({ containerId: 'customFinalDmgContainer', onUpdate: updateAll });
const customTakenList = new CustomEntryList({ containerId: 'customTakenContainer', onUpdate: updateAll });
const customFinalVulnList = new CustomEntryList({ containerId: 'customFinalVulnContainer', onUpdate: updateAll });



// ================= 攻击转化相关（原生实现） =================
let displayConvParams = { base: 0, multiplier: 0, bonus: 0, hiddenBonus: 0 };
let actualConvParams = { base: 0, multiplier: 0, bonus: 0, hiddenBonus: 0 };
let displayAttackConversion = 0;
let actualAttackConversion = 0;

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
const finalVulnSmashSelect = document.getElementById('finalVulnSmash');
const statFinalVulnMult = document.getElementById('statFinalVulnMult');



// ================= 收集输入 =================
function collectInputs() {
    return {
        atkBase: parseFloat(atkBaseInput.value) || 0,
        atkBuff: parseFloat(atkBuffSelect.value) || 0,
        flag: parseFloat(flagSelect.value) || 0,
        swordScepter: parseFloat(swordScepterSelect.value) || 0,
        basicAura: parseFloat(basicAuraSelect.value) || 0,
        coordAttack: parseFloat(coordAttackSelect.value) || 0,
        highland: parseFloat(highlandSelect.value) || 0,
        lowland: parseFloat(lowlandSelect.value) || 0,
        hangmanMark: parseFloat(hangmanMarkSelect.value) || 0,
        weaknessInsight: parseFloat(weaknessInsightSelect.value) || 0,
        def: parseFloat(defInput.value) || 0,
        defReduction: parseFloat(defReductionSelect.value) || 0,
        lockOn: parseFloat(lockOnSelect.value) || 0,
        armorPiercing: parseFloat(armorPiercingSelect.value) || 0,
        dmgBuff: parseFloat(dmgBuffSelect.value) || 0,
        flowLight: parseFloat(flowLightSelect.value) || 0,
        backAttackDmg: parseFloat(backAttackDmgSelect.value) || 0,
        critBuff: parseFloat(critBuffSelect.value) || 0,
        weaponCrit: parseFloat(weaponCritSelect.value) || 0,
        heshaAura: parseFloat(heshaAuraSelect.value) || 0,
        uriaConvert: parseFloat(uriaConvertSelect.value) || 0,
        finalDmgSkill: parseFloat(finalDmgSkillSelect.value) || 0,
        finalVulnSkill: parseFloat(finalVulnSkillSelect.value) || 0,
        finalVulnAura: parseFloat(finalVulnAuraSelect.value) || 0,
        finalVulnSmash: parseFloat(finalVulnSmashSelect.value) || 0,
        takenBuff: parseFloat(takenBuffSelect.value) || 0,
        injuryLevel: parseFloat(injuryLevelSelect.value) || 0,
        judgment: parseFloat(judgmentSelect.value) || 0,
        soul: parseFloat(soulSelect.value) || 0,
        horn: parseFloat(hornSelect.value) || 0,
        samanthaJudgment: parseFloat(samanthaJudgmentSelect.value) || 0,
        skill: parseFloat(skillInput.value) || 0,
        weakness: parseFloat(weaknessSelect.value) || 1.0,
        tarot: tarotSelect.value,
        profession: professionSelect.value,
        hasBackAttack: (parseFloat(backAttackDmgSelect.value) === 30),
        displayAttackConversion: displayAttackConversion,
        actualAttackConversion: actualAttackConversion,
        displayAtkEntries: customDisplayAtkList.entries.map(e => e.percent || 0),
        actualAtkEntries: customActualAtkList.entries.map(e => e.percent || 0),
        defReductionEntries: customDefReductionList.entries.map(e => e.percent || 0),
        defIgnoreEntries: customDefIgnoreList.entries.map(e => e.percent || 0),
        defFixedReductionEntries: customDefFixedReductionList.entries.map(e => e.value || 0),
        defIncreaseEntries: customDefIncreaseList.entries.map(e => e.percent || 0),
        dmgIncEntries: customDmgIncList.entries.map(e => e.percent || 0),
        critEntries: customCritList.entries.map(e => e.percent || 0),
        finalDmgEntries: customFinalDmgList.entries.map(e => e.percent || 0),
        takenEntries: customTakenList.entries.map(e => e.percent || 0),
        finalVulnEntries: customFinalVulnList.entries.map(e => e.percent || 0),
    };
}

// ================= 渲染结果 =================
function renderResults(r) {
    statDisplayAtk.textContent = Math.round(r.finalDisplayAtk);
    statActualAtk.textContent = Math.round(r.finalActualAtk);
    statNormalPercent.textContent = r.normalAtkPercent.toFixed(1);
    statExtraPercent.textContent = r.extraPercent.toFixed(1);
    statDisplayConversion.textContent = Math.round(displayAttackConversion);
    statActualConversion.textContent = Math.round(actualAttackConversion);
    statDebuffFactor.textContent = r.debuffFactor.toFixed(2) + 'x';
    document.getElementById('statIncreaseFactor').innerText = r.increaseFactor.toFixed(2) + 'x';
    statIgnoreFinal.textContent = r.ignoreFinalFactor.toFixed(2) + 'x';
    statDefFinal.textContent = r.defFinal.toFixed(1);
    statInc.textContent = r.incMult.toFixed(2) + 'x';
    statTaken.textContent = r.takenMult.toFixed(2) + 'x';
    statFinalMult.textContent = r.finalMult.toFixed(2) + 'x';
    statFinalVulnMult.innerText = r.finalVulnMult.toFixed(2) + 'x';
    statExtraCrit.textContent = r.extraCritTotal + '%';
    statCrit.textContent = (r.critTotal / 100).toFixed(2) + 'x';
    statCritFooter.textContent = r.critMult.toFixed(2);
    nonCritSpan.innerHTML = `<small>⚔️</small> ${r.nonCrit}`;
    critSpan.innerHTML = `<small>💥</small> ${r.crit}`;
}

// ================= 主计算逻辑 =================
function updateAll() {
    const inputs = collectInputs();
    const r = calculateDamage(inputs);
    renderResults(r);
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
    customDisplayAtkList.clear();
    customActualAtkList.clear();
    customDefReductionList.clear();
    customDefIgnoreList.clear();
    customDefFixedReductionList.clear();
    customDefIncreaseList.clear();
    customDmgIncList.clear();
    customCritList.clear();
    customFinalDmgList.clear();
    customTakenList.clear();
    customFinalVulnList.clear();
    // 重置最终易伤下拉框
    if (finalVulnSkillSelect) finalVulnSkillSelect.value = '0';
    if (finalVulnAuraSelect) finalVulnAuraSelect.value = '0';
    if (finalVulnSmashSelect) finalVulnSmashSelect.value = '0';
    updateAll();
}

document.getElementById('resetToDefault').addEventListener('click', resetAll);
const allInputs = document.querySelectorAll('input, select');
allInputs.forEach(el => el.addEventListener('input', updateAll));
updateAll();
document.getElementById('versionDisplay').textContent = APP_VERSION_DISPLAY;
const modalTitleEl = document.getElementById('modalTitle');
if (modalTitleEl) modalTitleEl.textContent += ' ' + APP_VERSION;

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
    if (addDisplayBtn) addDisplayBtn.addEventListener('click', () => customDisplayAtkList.add());
    const addActualBtn = document.getElementById('addCustomActualAtkBtn');
    if (addActualBtn) addActualBtn.addEventListener('click', () => customActualAtkList.add());
    const addDefReductionBtn = document.getElementById('addCustomDefReductionBtn');
    if (addDefReductionBtn) addDefReductionBtn.addEventListener('click', () => customDefReductionList.add());
    const addDefIgnoreBtn = document.getElementById('addCustomDefIgnoreBtn');
    if (addDefIgnoreBtn) addDefIgnoreBtn.addEventListener('click', () => customDefIgnoreList.add());
    const addDefFixedBtn = document.getElementById('addCustomDefFixedReductionBtn');
    if (addDefFixedBtn) addDefFixedBtn.addEventListener('click', () => customDefFixedReductionList.add());
    const addDefIncreaseBtn = document.getElementById('addCustomDefIncreaseBtn');
    if (addDefIncreaseBtn) addDefIncreaseBtn.addEventListener('click', () => customDefIncreaseList.add());
    const addDmgIncBtn = document.getElementById('addCustomDmgIncBtn');
    if (addDmgIncBtn) addDmgIncBtn.addEventListener('click', () => customDmgIncList.add());
    const addCritBtn = document.getElementById('addCustomCritBtn');
    if (addCritBtn) addCritBtn.addEventListener('click', () => customCritList.add());
    const addFinalBtn = document.getElementById('addCustomFinalDmgBtn');
    if (addFinalBtn) addFinalBtn.addEventListener('click', () => customFinalDmgList.add());
    const addTakenBtn = document.getElementById('addCustomTakenBtn');
    if (addTakenBtn) addTakenBtn.addEventListener('click', () => customTakenList.add());
    const addFinalVulnBtn = document.getElementById('addCustomFinalVulnBtn');
    if (addFinalVulnBtn) addFinalVulnBtn.addEventListener('click', () => customFinalVulnList.add());
});

// ================= 记录管理模块 =================
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
        finalVulnSmash: finalVulnSmashSelect ? finalVulnSmashSelect.value : '0',
        displayConvBase: displayConvParams.base,
        displayConvMultiplier: displayConvParams.multiplier,
        displayConvBonus: displayConvParams.bonus,
        displayConvHiddenBonus: displayConvParams.hiddenBonus,
        actualConvBase: actualConvParams.base,
        actualConvMultiplier: actualConvParams.multiplier,
        actualConvBonus: actualConvParams.bonus,
        actualConvHiddenBonus: actualConvParams.hiddenBonus,
        customDisplayAtkEntries: customDisplayAtkList.entries.map(e => ({ name: e.name, percent: e.percent })),
        customActualAtkEntries: customActualAtkList.entries.map(e => ({ name: e.name, percent: e.percent })),
        customDefReductionEntries: customDefReductionList.entries.map(e => ({ name: e.name, percent: e.percent })),
        customDefIgnoreEntries: customDefIgnoreList.entries.map(e => ({ name: e.name, percent: e.percent })),
        customDefFixedReductionEntries: customDefFixedReductionList.entries.map(e => ({ name: e.name, value: e.value })),
        customDefIncreaseEntries: customDefIncreaseList.entries.map(e => ({ name: e.name, percent: e.percent })),
        customDmgIncEntries: customDmgIncList.entries.map(e => ({ name: e.name, percent: e.percent })),
        customCritEntries: customCritList.entries.map(e => ({ name: e.name, percent: e.percent })),
        customFinalDmgEntries: customFinalDmgList.entries.map(e => ({ name: e.name, percent: e.percent })),
        customTakenEntries: customTakenList.entries.map(e => ({ name: e.name, percent: e.percent })),
        customFinalVulnEntries: customFinalVulnList.entries.map(e => ({ name: e.name, percent: e.percent })),
        _finalDisplayAtk: statDisplayAtk.textContent,
        _finalActualAtk: statActualAtk.textContent,
        _defFinal: statDefFinal.textContent,
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

    if (config.customDisplayAtkEntries) customDisplayAtkList.setFromSaved(config.customDisplayAtkEntries);
    if (config.customActualAtkEntries) customActualAtkList.setFromSaved(config.customActualAtkEntries);
    if (config.customDefReductionEntries) customDefReductionList.setFromSaved(config.customDefReductionEntries);
    if (config.customDefIgnoreEntries) customDefIgnoreList.setFromSaved(config.customDefIgnoreEntries);
    if (config.customDefFixedReductionEntries) customDefFixedReductionList.setFromSaved(config.customDefFixedReductionEntries);
    if (config.customDefIncreaseEntries) customDefIncreaseList.setFromSaved(config.customDefIncreaseEntries);
    if (config.customDmgIncEntries) customDmgIncList.setFromSaved(config.customDmgIncEntries);
    if (config.customCritEntries) customCritList.setFromSaved(config.customCritEntries);
    if (config.customFinalDmgEntries) customFinalDmgList.setFromSaved(config.customFinalDmgEntries);
    if (config.customTakenEntries) customTakenList.setFromSaved(config.customTakenEntries);
    if (config.customFinalVulnEntries) customFinalVulnList.setFromSaved(config.customFinalVulnEntries);
    if (config.finalVulnSkill !== undefined && finalVulnSkillSelect) finalVulnSkillSelect.value = config.finalVulnSkill;
    if (config.finalVulnAura !== undefined && finalVulnAuraSelect) finalVulnAuraSelect.value = config.finalVulnAura;
    if (config.finalVulnSmash !== undefined && finalVulnSmashSelect) finalVulnSmashSelect.value = config.finalVulnSmash;
    updateAll();
}

const damageFieldMeta = {
    atkBase: { name: "基础攻击力", zone: "⚔️ 攻击区间", unit: "", alwaysShow: true },
    atkBuff: { name: "攻击BUFF", zone: "⚔️ 攻击区间", unit: "%" },
    flag: { name: "战旗", zone: "⚔️ 攻击区间", unit: "%" },
    swordScepter: { name: "剑杖刻印", zone: "⚔️ 攻击区间", unit: "%" },
    basicAura: { name: "基础光环", zone: "⚔️ 攻击区间", unit: "%" },
    coordAttack: { name: "协攻", zone: "⚔️ 攻击区间", unit: "%" },
    highland: { name: "高地", zone: "⚔️ 攻击区间", unit: "%" },
    lowland: { name: "低地", zone: "⚔️ 攻击区间", unit: "%" },
    lionTransform: { name: "狮子变身", zone: "⚔️ 攻击区间", unit: "%" },
    hangmanMark: { name: "倒吊人指挥官", zone: "⚔️ 攻击区间", unit: "%" },
    weaknessInsight: { name: "窥破弱点", zone: "⚔️ 攻击区间", unit: "%" },
    displayConvBase: { name: "显示攻击转化数值", zone: "⚔️ 攻击区间", unit: "" },
    displayConvMultiplier: { name: "显示攻击转化倍率", zone: "⚔️ 攻击区间", unit: "%" },
    displayConvBonus: { name: "显示攻击转化加成", zone: "⚔️ 攻击区间", unit: "%" },
    displayConvHiddenBonus: { name: "显示攻击转化加成(不显示)", zone: "⚔️ 攻击区间", unit: "%" },
    actualConvBase: { name: "实际攻击转化数值", zone: "⚔️ 攻击区间", unit: "" },
    actualConvMultiplier: { name: "实际攻击转化倍率", zone: "⚔️ 攻击区间", unit: "%" },
    actualConvBonus: { name: "实际攻击转化加成", zone: "⚔️ 攻击区间", unit: "%" },
    actualConvHiddenBonus: { name: "实际攻击转化加成(不显示)", zone: "⚔️ 攻击区间", unit: "%" },
    _finalDisplayAtk: { name: "最终攻击力（显示）", zone: "⚔️ 攻击区间", unit: "" },
    _finalActualAtk: { name: "最终攻击力（实际）", zone: "⚔️ 攻击区间", unit: "" },
    def: { name: "基础防御力", zone: "🛡️ 防御区间", unit: "" },
    defReduction: { name: "防御降低", zone: "🛡️ 防御区间", unit: "%" },
    lockOn: { name: "锁定目标（号角）", zone: "🛡️ 防御区间", unit: "%" },
    armorPiercing: { name: "穿甲", zone: "🛡️ 防御区间", unit: "%" },
    _defFinal: { name: "最终防御力", zone: "🛡️ 防御区间", unit: "" },
    dmgBuff: { name: "伤害BUFF", zone: "💥 增伤区间", unit: "%" },
    flowLight: { name: "流光", zone: "💥 增伤区间", unit: "%" },
    backAttackDmg: { name: "背击增伤", zone: "💥 增伤区间", unit: "%" },
    critBuff: { name: "爆伤BUFF", zone: "⚡ 爆伤区间", unit: "%" },
    weaponCrit: { name: "武器爆伤", zone: "⚡ 爆伤区间", unit: "%" },
    heshaAura: { name: "赫沙光环", zone: "⚡ 爆伤区间", unit: "%" },
    uriaConvert: { name: "乌利亚转化", zone: "⚡ 爆伤区间", unit: "%" },
    finalDmgSkill: { name: "无视守护·寒境", zone: "✨ 最终增伤区间", unit: "%" },
    finalVulnSkill: { name: "阿尔德法印", zone: "🎯 最终易伤区间", unit: "%" },
    finalVulnAura: { name: "塞娜光环", zone: "🎯 最终易伤区间", unit: "%" },
    finalVulnSmash: { name: "粉碎", zone: "🎯 最终易伤区间", unit: "%" },
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

const SELECT_LABELS = {
    atkBuff:         { '0':'无', '10':'攻击1', '20':'攻击2', '30':'攻击3', '40':'攻击4' },
    flag:            { '0':'无', '20':'有战旗' },
    swordScepter:    { '0':'不触发', '4':'一步', '8':'两步', '12':'三步以上' },
    basicAura:       { '0':'无', '10':'有' },
    coordAttack:     { '0':'无', '5':'协攻1', '10':'协攻2', '15':'协攻3' },
    highland:        { '0':'无', '15':'有' },
    lowland:         { '0':'无', '-10':'有' },
    hangmanMark:     { '0':'无', '15':'有' },
    weaknessInsight: { '0':'无', '20':'有' },
    defReduction:    { '0':'无', '20':'降低1', '40':'降低2', '60':'降低3' },
    lockOn:          { '0':'无', '20':'锁定' },
    armorPiercing:   { '0':'无', '40':'有穿甲' },
    dmgBuff:         { '0':'无', '10':'伤害1', '20':'伤害2', '30':'伤害3' },
    flowLight:       { '0':'无', '15':'有流光' },
    backAttackDmg:   { '0':'无', '30':'有背击' },
    critBuff:        { '0':'无', '15':'爆伤1', '30':'爆伤2', '45':'爆伤3' },
    weaponCrit:      { '0':'无', '30':'虚无6层', '21':'天烈剑', '40':'亲王刀', '8':'寻路者' },
    heshaAura:       { '0':'无', '5':'非艾拉曼', '10':'艾拉曼' },
    uriaConvert:     { '0':'无', '15':'满层' },
    finalDmgSkill:   { '0':'无', '10':'有' },
    finalVulnSkill:  { '0':'无', '50':'有' },
    finalVulnAura:   { '0':'无', '10':'有' },
    finalVulnSmash:  { '0':'无', '3':'1层', '6':'2层', '9':'3层', '12':'4层', '15':'5层', '18':'6层', '21':'7层', '24':'8层', '27':'9层', '30':'10层' },
    takenBuff:       { '0':'无', '10':'易伤1', '20':'易伤2', '30':'易伤3', '300':'满易伤' },
    injuryLevel:     { '0':'健康', '20':'受伤', '30':'濒死' },
    judgment:        { '0':'无', '10':'有' },
    soul:            { '0':'无', '10':'有' },
    horn:            { '0':'无', '80':'有号角' },
    samanthaJudgment:{ '0':'无', '10':'有', '15':'范围伤害' },
};

function formatFieldValue(key, value) {
    if (value === undefined || value === null) return '—';
    let val = value.toString();
    if (key === 'tarotSelect') return getTarotName(val);
    else if (key === 'profession') return getProfessionName(val);
    else if (key === 'weakness') return getWeaknessName(val);
    const label = SELECT_LABELS[key]?.[val];
    const unit = damageFieldMeta[key]?.unit || '';
    if (label && label !== val) return `${label} (${val}${unit})`;
    return val + (unit ? unit : '');
}

const damageRecordManager = createRecordManager({
    storageKey: 'SwordOfLily_Records',
    appVersion: APP_VERSION,
    supportsTauri: true,
    recordNamePrefix: '配置',
    getDamageDisplay: (rec) => {
        const d = rec.damage || rec.damages;
        return `⚔️ ${d.nonCrit}  💥 ${d.crit}`;
    },
    getDamageShort: (rec) => {
        const d = rec.damage || rec.damages;
        return d ? `${d.nonCrit} / ${d.crit}` : '—';
    },
    getCurrentConfig: getCurrentFullConfig,
    applyConfig: applyRecordToCalculator,
    getDamageSnapshot: getCurrentDamageSnapshot,
    fieldMeta: damageFieldMeta,
    formatFieldValue,
    isFieldEmptyValue,
    zoneOrder: ['⚔️ 攻击区间', '🛡️ 防御区间', '💥 增伤区间', '⚡ 爆伤区间', '✨ 最终增伤区间', '🎯 最终易伤区间', '🎯 易伤区间', '🌐 全局设置'],
    compareCustomTypes: [
        { key: 'customDisplayAtkEntries', zone: '⚔️ 攻击区间' },
        { key: 'customActualAtkEntries', zone: '⚔️ 攻击区间' },
        { key: 'customDefReductionEntries', zone: '🛡️ 防御区间' },
        { key: 'customDefIgnoreEntries', zone: '🛡️ 防御区间' },
        { key: 'customDefFixedReductionEntries', zone: '🛡️ 防御区间', isFixedValue: true },
        { key: 'customDefIncreaseEntries', zone: '🛡️ 防御区间' },
        { key: 'customDmgIncEntries', zone: '💥 增伤区间' },
        { key: 'customCritEntries', zone: '⚡ 爆伤区间' },
        { key: 'customFinalDmgEntries', zone: '✨ 最终增伤区间' },
        { key: 'customTakenEntries', zone: '🎯 易伤区间' },
        { key: 'customFinalVulnEntries', zone: '🎯 最终易伤区间' },
    ],
    compareDamageLabel: '非暴击 / 暴击',
    screenshotFileName: '伤害对比',
    saveBtnId: 'recordSnapshotBtn',
    queryBtnId: 'queryRecordsBtn',
    clearBtnId: 'clearAllRecordsBtn',
});

preloadScreenshot();