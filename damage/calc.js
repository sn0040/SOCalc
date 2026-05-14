// damage/calc.js —— 纯伤害计算函数，无 DOM 访问
import { getProfessionBonuses, getTarotBonuses } from '../common/gameData.js';

/**
 * @param {Object} inputs
 * @param {number} inputs.atkBase
 * @param {number} inputs.atkBuff
 * @param {number} inputs.flag
 * @param {number} inputs.swordScepter
 * @param {number} inputs.basicAura
 * @param {number} inputs.coordAttack
 * @param {number} inputs.highland
 * @param {number} inputs.lowland
 * @param {number} inputs.hangmanMark
 * @param {number} inputs.weaknessInsight
 * @param {number} inputs.def
 * @param {number} inputs.defReduction
 * @param {number} inputs.lockOn
 * @param {number} inputs.armorPiercing
 * @param {number} inputs.dmgBuff
 * @param {number} inputs.flowLight
 * @param {number} inputs.backAttackDmg
 * @param {number} inputs.critBuff
 * @param {number} inputs.weaponCrit
 * @param {number} inputs.heshaAura
 * @param {number} inputs.uriaConvert
 * @param {number} inputs.finalDmgSkill
 * @param {number} inputs.finalVulnSkill
 * @param {number} inputs.finalVulnAura
 * @param {number} inputs.takenBuff
 * @param {number} inputs.injuryLevel
 * @param {number} inputs.judgment
 * @param {number} inputs.soul
 * @param {number} inputs.horn
 * @param {number} inputs.samanthaJudgment
 * @param {number} inputs.skill
 * @param {number} inputs.weakness
 * @param {string} inputs.tarot
 * @param {string} inputs.profession
 * @param {boolean} inputs.hasBackAttack
 * @param {number} inputs.displayAttackConversion
 * @param {number} inputs.actualAttackConversion
 * @param {number[]} inputs.displayAtkEntries
 * @param {number[]} inputs.actualAtkEntries
 * @param {number[]} inputs.defReductionEntries
 * @param {number[]} inputs.defIgnoreEntries
 * @param {number[]} inputs.defFixedReductionEntries
 * @param {number[]} inputs.defIncreaseEntries
 * @param {number[]} inputs.dmgIncEntries
 * @param {number[]} inputs.critEntries
 * @param {number[]} inputs.finalDmgEntries
 * @param {number[]} inputs.takenEntries
 * @param {number[]} inputs.finalVulnEntries
 *
 * @returns {Object} result
 */
export function calculateDamage(inputs) {
    // ---- 攻击区间 ----
    let normalAtkPercent = inputs.atkBuff + inputs.flag + inputs.swordScepter + inputs.basicAura + inputs.coordAttack;
    const customDisplaySum = inputs.displayAtkEntries.reduce((a, b) => a + b, 0);
    normalAtkPercent += customDisplaySum;

    const profBonus = getProfessionBonuses(inputs.profession, inputs.hasBackAttack);
    normalAtkPercent += profBonus.atkPercentBonus;

    let extraPercent = inputs.highland + inputs.lowland + inputs.hangmanMark + inputs.weaknessInsight;
    if (inputs.profession === 'watcher') extraPercent += 12;
    const customActualSum = inputs.actualAtkEntries.reduce((a, b) => a + b, 0);
    extraPercent += customActualSum;

    const displayAtkBase = inputs.atkBase * (1 + normalAtkPercent / 100);
    const finalDisplayAtk = displayAtkBase + inputs.displayAttackConversion;
    const extraTerm = inputs.atkBase * (extraPercent / 100);
    const finalActualAtk = (finalDisplayAtk + extraTerm + inputs.actualAttackConversion) * inputs.weakness;

    // ---- 防御区间 ----
    const defReductionSum = inputs.defReductionEntries.reduce((a, b) => a + b, 0);
    const totalDebuff = Math.min(100, inputs.defReduction + inputs.lockOn + defReductionSum);
    const debuffFactor = 1 - totalDebuff / 100;

    const defIncreaseSum = inputs.defIncreaseEntries.reduce((a, b) => a + b, 0);
    const increaseFactor = 1 + defIncreaseSum / 100;

    const fixedReductionTotal = inputs.defFixedReductionEntries.reduce((a, b) => a + b, 0);

    let customIgnoreFactor = 1;
    for (const val of inputs.defIgnoreEntries) {
        customIgnoreFactor *= (1 - val / 100);
    }
    const ignoreFinalFactor = (1 - profBonus.ignoreProf / 100) * (1 - inputs.armorPiercing / 100) * customIgnoreFactor;

    const defAfterDebuff = inputs.def * debuffFactor * increaseFactor;
    const defAfterFixed = Math.max(0, defAfterDebuff - fixedReductionTotal);
    const defFinal = defAfterFixed * ignoreFinalFactor;

    // ---- 技能倍率 ----
    const baseDiff = Math.max(1, finalActualAtk - defFinal);
    const skillMult = inputs.skill / 100;

    // ---- 增伤区间 ----
    const tarotBonus = getTarotBonuses(inputs.tarot);
    const dmgIncSum = inputs.dmgIncEntries.reduce((a, b) => a + b, 0);
    const totalDmgBonus = inputs.dmgBuff + inputs.flowLight + inputs.backAttackDmg + tarotBonus.dmgBonus + profBonus.dmgBonus + dmgIncSum;
    const incMult = 1 + totalDmgBonus / 100;

    // ---- 易伤区间 ----
    let customTakenMult = 1;
    for (const val of inputs.takenEntries) {
        customTakenMult *= (1 + val / 100);
    }
    let takenMult = (1 + inputs.takenBuff/100) * (1 + inputs.injuryLevel/100) * (1 + inputs.judgment/100) * (1 + inputs.soul/100) * (1 + inputs.horn/100) * (1 + inputs.samanthaJudgment/100) * customTakenMult;
    takenMult = Math.min(takenMult, 3.0);

    // ---- 最终增伤（加算） ----
    const finalDmgSum = inputs.finalDmgEntries.reduce((a, b) => a + b, 0);
    const finalMult = 1 + (inputs.finalDmgSkill + finalDmgSum) / 100;

    // ---- 最终易伤（乘算） ----
    let finalVulnMult = (1 + inputs.finalVulnSkill/100) * (1 + inputs.finalVulnAura/100);
    for (const val of inputs.finalVulnEntries) {
        finalVulnMult *= (1 + val / 100);
    }

    // ---- 爆伤区间 ----
    const critSum = inputs.critEntries.reduce((a, b) => a + b, 0);
    const baseCrit = 130;
    const critTotal = baseCrit + inputs.critBuff + inputs.weaponCrit + inputs.heshaAura + inputs.uriaConvert + critSum + tarotBonus.critBonus + profBonus.critDmgBonus;
    const extraCritTotal = critTotal - baseCrit;
    const critMult = critTotal / 100;

    // ---- 最终伤害 ----
    const common = baseDiff * skillMult * incMult * takenMult * finalMult * finalVulnMult;
    const nonCrit = Math.round(common);
    const critDamage = Math.round(common * critMult);

    return {
        // 攻击
        normalAtkPercent,
        extraPercent,
        finalDisplayAtk,
        finalActualAtk,
        // 防御
        debuffFactor,
        increaseFactor,
        ignoreFinalFactor,
        defFinal,
        // 增伤
        incMult,
        takenMult,
        finalMult,
        finalVulnMult,
        // 爆伤
        critMult,
        extraCritTotal,
        critTotal,
        // 伤害
        nonCrit,
        crit: critDamage,
    };
}
