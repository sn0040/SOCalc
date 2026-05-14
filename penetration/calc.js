// penetration/calc.js —— 纯穿透伤害计算函数，无 DOM 访问

/**
 * @param {Object} inputs
 * @param {string} inputs.attackMode - 'single' | 'double'
 * @param {number} inputs.penAtkBaseSingle
 * @param {number} inputs.penAtkPhys
 * @param {number} inputs.penAtkMagic
 * @param {number} inputs.normalPercent - 显示攻击加成合计（已在调用方预先计算好）
 * @param {number} inputs.extraPercent - 实际攻击加成合计
 * @param {number} inputs.singleDisplayConversion
 * @param {number} inputs.singleActualConversion
 * @param {number} inputs.physConversion
 * @param {number} inputs.magicConversion
 * @param {number} inputs.penWeakness
 * @param {number} inputs.penSkillMult
 * @param {string} inputs.penLifeType
 * @param {number} inputs.penLifeValue
 * @param {number} inputs.penLifeAtk
 * @param {number} inputs.penLifeTargetHp
 * @param {string} inputs.penTarot
 * @param {string} inputs.penProfession
 * @param {number} inputs.penDreamTalk
 * @param {number} inputs.penLukarAura
 * @param {number} inputs.penIsilindAura
 * @param {number} inputs.penPrism
 * @param {number} inputs.penHeavyAssault
 * @param {number} inputs.penMaishaAura
 * @param {number} inputs.penTriggerCoop
 * @param {number} inputs.penXiaoSuPersonality
 * @param {number} inputs.penGloryGuide
 * @param {number} inputs.penAnnaAura
 * @param {number[]} inputs.customPenDmgEntries
 * @param {number} inputs.woundLayers
 * @param {number} inputs.puppet
 * @param {number} inputs.nightmare
 * @param {number} inputs.penPenVuln
 * @param {number} inputs.immunity
 * @param {number[]} inputs.customPenVulnEntries
 * @param {number} inputs.emperorCold
 * @param {number[]} inputs.customFinalDmgEntries
 * @param {number} inputs.finalVulnAura
 * @param {number[]} inputs.customFinalVulnEntries
 * @param {number[]} inputs.customLifeBonusEntries
 *
 * @returns {Object} result
 */
export function calculatePenetration(inputs) {
    // ---- 攻击力 ----
    let actualAtk;
    let singleDisplayAtk = 0, singleActualAtk = 0;
    let physDisplayAtk = 0, magicDisplayAtk = 0;
    let physActualAtk = 0, magicActualAtk = 0;

    if (inputs.attackMode === 'single') {
        const displayAtk = inputs.penAtkBaseSingle * (1 + inputs.normalPercent / 100) + inputs.singleDisplayConversion;
        singleDisplayAtk = displayAtk;
        singleActualAtk = displayAtk + inputs.penAtkBaseSingle * (inputs.extraPercent / 100) + inputs.singleActualConversion;
        actualAtk = singleActualAtk;
    } else {
        physDisplayAtk = inputs.penAtkPhys * (1 + inputs.normalPercent / 100) + inputs.physConversion;
        magicDisplayAtk = inputs.penAtkMagic * (1 + inputs.normalPercent / 100) + inputs.magicConversion;
        physActualAtk = physDisplayAtk + inputs.penAtkPhys * (inputs.extraPercent / 100);
        magicActualAtk = magicDisplayAtk + inputs.penAtkMagic * (inputs.extraPercent / 100);
        actualAtk = physActualAtk + magicActualAtk;
    }

    // ---- 生命百分比部分 ----
    let lifeBase = 0;
    const rate = inputs.penLifeValue / 100;
    if (inputs.penLifeType === 'fixed') lifeBase = rate;
    else if (inputs.penLifeType === 'atkPercent') lifeBase = inputs.penLifeAtk * rate;
    else if (inputs.penLifeType === 'hpPercent') lifeBase = inputs.penLifeTargetHp * rate;

    let bonusTotal = inputs.customLifeBonusEntries.reduce((a, b) => a + b, 0);
    if (inputs.penTarot === 'fool' && inputs.penLifeType === 'hpPercent') bonusTotal += 20;

    let finalLifePart = lifeBase;
    if (inputs.penLifeType === 'hpPercent') {
        finalLifePart = lifeBase * (1 + bonusTotal / 100);
    }

    // ---- 技能倍率 ----
    const attackPart = actualAtk * inputs.penWeakness * (inputs.penSkillMult / 100);

    // ---- 穿透增伤 ----
    let dmgBonus = 0;
    if (inputs.penTarot === 'death') dmgBonus += 13;
    if (inputs.penProfession === 'watcher') dmgBonus += 20;
    dmgBonus += inputs.penDreamTalk;
    dmgBonus += inputs.penLukarAura;
    dmgBonus += inputs.penIsilindAura;
    dmgBonus += inputs.penPrism;
    dmgBonus += inputs.penHeavyAssault;
    dmgBonus += inputs.penMaishaAura;
    dmgBonus += inputs.penTriggerCoop;
    dmgBonus += inputs.penXiaoSuPersonality;
    dmgBonus += inputs.penGloryGuide;
    dmgBonus += inputs.penAnnaAura;
    dmgBonus += inputs.customPenDmgEntries.reduce((a, b) => a + b, 0);
    const dmgMult = 1 + dmgBonus / 100;

    // ---- 穿透易伤 ----
    const woundMult = Math.pow(1.12, inputs.woundLayers);
    let customPenVulnMult = 1;
    for (const val of inputs.customPenVulnEntries) {
        customPenVulnMult *= (1 + val / 100);
    }
    let other = (1 + inputs.puppet/100) * (1 + inputs.nightmare/100) * (1 + inputs.penPenVuln/100) * (1 - inputs.immunity) * customPenVulnMult;
    other = Math.min(other, 3.0);
    const vulnMult = woundMult * other;

    // ---- 最终增伤（加算） ----
    const finalDmgSum = inputs.customFinalDmgEntries.reduce((a, b) => a + b, 0);
    const finalMult = 1 + (inputs.emperorCold + finalDmgSum) / 100;

    // ---- 最终易伤（乘算） ----
    let finalVulnMult = (1 + inputs.finalVulnAura / 100);
    for (const val of inputs.customFinalVulnEntries) {
        finalVulnMult *= (1 + val / 100);
    }

    // ---- 最终伤害 ----
    const finalDamage = Math.round((attackPart + finalLifePart) * dmgMult * vulnMult * finalMult * finalVulnMult);

    return {
        singleDisplayAtk: Math.round(singleDisplayAtk),
        singleActualAtk: Math.round(singleActualAtk),
        physDisplayAtk: Math.round(physDisplayAtk),
        magicDisplayAtk: Math.round(magicDisplayAtk),
        physActualAtk: Math.round(physActualAtk),
        magicActualAtk: Math.round(magicActualAtk),
        actualAtk: Math.round(actualAtk),
        normalPercent: inputs.normalPercent,
        extraPercent: inputs.extraPercent,
        lifeBase: Math.round(lifeBase),
        bonusTotal,
        finalLifePart: Math.round(finalLifePart),
        dmgMult,
        dmgBonus,
        vulnMult,
        finalMult,
        finalVulnMult,
        finalDamage,
    };
}
