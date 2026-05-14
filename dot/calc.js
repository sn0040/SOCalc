// dot/calc.js —— 纯 DOT 伤害计算函数，无 DOM 访问
import { INFECTION_MAP } from '../common/gameData.js';

/**
 * 计算 DOT 全局乘区（不含 dotEntries 本身的循环）
 * @param {Object} inputs
 * @param {number} inputs.physBase
 * @param {number} inputs.magicBase
 * @param {number} inputs.normalPercent
 * @param {number} inputs.extraPercent
 * @param {number} inputs.physConversion
 * @param {number} inputs.magicConversion
 * @param {number} inputs.tarot - 'hangman' 或其它
 * @param {number} inputs.incBuff
 * @param {number} inputs.yujieUlt
 * @param {number} inputs.yujiePersonality
 * @param {number} inputs.hashaAura
 * @param {number[]} inputs.customDotIncEntries
 * @param {number} inputs.puppet
 * @param {number} inputs.nightmare
 * @param {number} inputs.penVuln
 * @param {number[]} inputs.customPenVulnEntries
 * @param {number} inputs.momoAura
 * @param {number} inputs.boqiAura
 * @param {number} inputs.charm
 * @param {number[]} inputs.customPersistentVulnEntries
 * @param {number} inputs.woundLayers
 * @param {number} inputs.finalDmgSkill
 * @param {number[]} inputs.customFinalDmgEntries
 * @param {number} inputs.finalVulnAura
 * @param {number[]} inputs.customFinalVulnEntries
 * @returns {Object} { totalAtk, incMult, penMult, persistentMult, woundMult, finalDmgMult, finalVulnMult }
 */
export function calculateDot(inputs) {
    const physDisplay = inputs.physBase * (1 + inputs.normalPercent / 100) + inputs.physConversion;
    const magicDisplay = inputs.magicBase * (1 + inputs.normalPercent / 100) + inputs.magicConversion;
    const physActual = physDisplay + inputs.physBase * (inputs.extraPercent / 100);
    const magicActual = magicDisplay + inputs.magicBase * (inputs.extraPercent / 100);
    const totalAtk = physActual + magicActual;

    // 持续伤害增伤
    const tarotVal = inputs.tarot === 'hangman' ? 20 : 0;
    const incSum = inputs.customDotIncEntries.reduce((a, b) => a + b, 0);
    const incMult = 1 + (tarotVal + inputs.incBuff + inputs.yujieUlt + inputs.yujiePersonality + inputs.hashaAura + incSum) / 100;

    // 穿透易伤
    let penMult = (1 + inputs.puppet/100) * (1 + inputs.nightmare/100) * (1 + inputs.penVuln/100);
    for (const val of inputs.customPenVulnEntries) penMult *= (1 + val / 100);
    penMult = Math.min(penMult, 3.0);

    // 持续伤害易伤
    let persistentMult = (1 + inputs.momoAura/100) * (1 + inputs.boqiAura/100) * (1 + inputs.charm/100);
    for (const val of inputs.customPersistentVulnEntries) persistentMult *= (1 + val / 100);
    persistentMult = Math.min(persistentMult, 3.0);

    // 伤口
    const woundMult = Math.pow(1.12, inputs.woundLayers);

    // 最终增伤（加算）
    const finalDmgSum = inputs.customFinalDmgEntries.reduce((a, b) => a + b, 0);
    const finalDmgMult = 1 + (inputs.finalDmgSkill + finalDmgSum) / 100;

    // 最终易伤（乘算）
    let finalVulnMult = (1 + inputs.finalVulnAura / 100);
    for (const val of inputs.customFinalVulnEntries) finalVulnMult *= (1 + val / 100);

    return { totalAtk: Math.round(totalAtk), incMult, penMult, persistentMult, woundMult, finalDmgMult, finalVulnMult };
}

/**
 * 计算单个 DOT 条目的伤害（纯函数）
 * @param {Object} params
 * @param {string} params.mode - 'standard' | 'lifeLoss' | 'scarTear' | 'hpPercent'
 * @param {number} [params.attackBase] - 攻击力类条目的攻击基数
 * @param {number} [params.multiplier] - 攻击力类条目的倍率
 * @param {number} [params.ticks] - 结算次数
 * @param {number} [params.enemyHp] - 生命百分比类：敌方生命值
 * @param {string} [params.project] - 生命百分比类：项目名
 * @param {number} [params.infectionLayers] - 生命百分比类：感染层数
 * @param {number} [params.immunity] - 免疫减免
 * @param {Object} mults - 来自 calculateDot 的乘区结果
 * @returns {number} 单个条目总伤害
 */
export function calculateDotEntry(params, mults) {
    const { mode, attackBase, multiplier, ticks, enemyHp, project, infectionLayers, immunity } = params;
    const inc = mults.incMult;
    const persistent = mults.persistentMult;
    const pen = mults.penMult;
    const wound = mults.woundMult;

    let single;
    if (mode === 'standard' || mode === 'lifeLoss' || mode === 'scarTear') {
        single = attackBase * multiplier * inc * persistent * pen * wound;
    } else if (mode === 'hpPercent') {
        let percent = 0;
        if (project === 'infection') percent = INFECTION_MAP[infectionLayers] / 100;
        else if (project === 'burn') percent = 0.10;
        else if (project === 'stigma') percent = 0.05;
        else if (project === 'erosion') percent = 0.04;
        else if (project === 'darkfire') percent = 0.35;
        else if (project === 'ancestor') percent = 0.35;
        single = enemyHp * percent * inc * persistent * pen * (1 - immunity);
    } else {
        single = 0;
    }

    return single * ticks;
}
