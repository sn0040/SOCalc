// 游戏常量数据 —— 所有《铃兰之剑》游戏内数值集中管理
// 使用方式：import { TAROT, PROFESSION, WEAKNESS, ... } from '../common/gameData.js';

// ================= 塔罗牌 =================
// value: { name, dmgBonus, critBonus, penBonus, persistentBonus }
export const TAROT = {
    none:           { name: '无', dmgBonus: 0, critBonus: 0 },
    magician:       { name: '魔术师 (+40%增伤)', dmgBonus: 40, critBonus: 0 },
    magician_single:{ name: '魔术师单体 (+16%增伤)', dmgBonus: 16, critBonus: 0 },
    justice:        { name: '正义 (+15%爆伤)', dmgBonus: 0, critBonus: 15 },
    fool:           { name: '愚者 (+10%增伤)', dmgBonus: 10, critBonus: 0 },
    tower:          { name: '法皇/高塔 (+20%增伤)', dmgBonus: 20, critBonus: 0 },
    death:          { name: '死神 (+13%增伤)', dmgBonus: 13, critBonus: 0 },
    hangman:        { name: '倒吊人 (+20%增伤)', dmgBonus: 20, critBonus: 0 },
};

/** 获取塔罗牌加成（兼容各计算器的字段差异） */
export function getTarotBonuses(tarot) {
    const t = TAROT[tarot] || TAROT.none;
    return { dmgBonus: t.dmgBonus, critBonus: t.critBonus };
}

/** 获取塔罗牌显示名 */
export function getTarotName(tarot) {
    const t = TAROT[tarot];
    return t ? t.name : (tarot || '—');
}

// ================= 职业天赋 =================
// value: { name, dmgBonus, ignoreDef, critDmgBonus, critRateBonus, atkPercentBonus }
export const PROFESSION = {
    none:        { name: '无', dmgBonus: 0, ignoreDef: 0, critDmgBonus: 0, critRateBonus: 0, atkPercentBonus: 0 },
    smasher15:   { name: '粉碎者(+15%增伤)', dmgBonus: 15, ignoreDef: 0, critDmgBonus: 0, critRateBonus: 0, atkPercentBonus: 0 },
    smasher20:   { name: '粉碎者(+20%增伤)', dmgBonus: 20, ignoreDef: 0, critDmgBonus: 0, critRateBonus: 0, atkPercentBonus: 0 },
    smasher35:   { name: '粉碎者(+35%增伤)', dmgBonus: 35, ignoreDef: 0, critDmgBonus: 0, critRateBonus: 0, atkPercentBonus: 0 },
    defender28:  { name: '防御者(+28%增伤)', dmgBonus: 28, ignoreDef: 0, critDmgBonus: 0, critRateBonus: 0, atkPercentBonus: 0 },
    assassin:    { name: '突袭者(无视+15%,爆伤+11%)', dmgBonus: 0, ignoreDef: 15, critDmgBonus: 11, critRateBonus: 5, atkPercentBonus: 0 },
    watcher:     { name: '守望者(+20%增伤,攻击+12%)', dmgBonus: 20, ignoreDef: 0, critDmgBonus: 0, critRateBonus: 0, atkPercentBonus: 0 },
    destroyer30: { name: '毁灭者(+30%增伤)', dmgBonus: 30, ignoreDef: 0, critDmgBonus: 0, critRateBonus: 0, atkPercentBonus: 0 },
};

/** 获取职业天赋加成（直伤计算器） */
export function getProfessionBonuses(prof, hasBackAttack) {
    const p = PROFESSION[prof] || PROFESSION.none;
    let critDmgBonus = p.critDmgBonus;
    let critRateBonus = p.critRateBonus;
    if (prof === 'assassin' && hasBackAttack) {
        critDmgBonus += 3;
        critRateBonus += 3;
    }
    return {
        atkPercentBonus: p.atkPercentBonus,
        dmgBonus: p.dmgBonus,
        ignoreProf: p.ignoreDef,
        critDmgBonus,
        critRateBonus,
    };
}

/** 获取职业显示名 */
export function getProfessionName(prof) {
    const p = PROFESSION[prof];
    return p ? p.name : (prof || '—');
}

// ================= 克制系数 =================
export const WEAKNESS = {
    '1.0': '无克制 (1.0)',
    '1.3': '三色克制 (1.3)',
    '0.7': '三色被克 (0.7)',
    '1.4': '光暗克制 (1.4)',
    '0.6': '光暗被克 (0.6)',
};
export const WEAKNESS_SIMPLE = {
    '1.0': '无克制',
    '1.3': '三色克制',
    '0.7': '三色被克',
    '1.4': '光暗克制',
    '0.6': '光暗被克',
};

export function getWeaknessName(val, simple) {
    const map = simple ? WEAKNESS_SIMPLE : WEAKNESS;
    return map[val] || val;
}

// ================= 百分比生命类型 =================
export const LIFE_TYPE = {
    hpPercent:  '目标生命百分比',
    atkPercent: '攻击力百分比',
    fixed:      '固定值',
};

// ================= 免疫减免 =================
export const IMMUNITY = {
    '0':   '无',
    '0.5': '减免50%',
    '0.8': '减免80%',
    '0.95': '减免95%',
};

export function getImmunityName(val) {
    return IMMUNITY[val] || (val + '%');
}

// ================= 安娜大光环 =================
export const ANNA_AURA = {
    '0':  '无',
    '10': '有 (+10%)',
    '20': '守护失效 (+20%)',
};

// ================= 大帝个性寒境 =================
export const EMPEROR_COLD = {
    '0':  '无',
    '10': '有 (+10%)',
};

// ================= 塞娜光环 =================
export const FINAL_VULN_AURA = {
    '0':  '无',
    '10': '有 (+10%)',
};

// ================= 结算模式 =================
export const ATTACK_MODE = {
    single: '单攻结算',
    double: '双攻结算',
};

// ================= 感染百分比（DOT） =================
export const INFECTION_PERCENT = [4, 8, 12, 18, 26, 36, 46, 58, 72];
export const INFECTION_MAP = { 1: 4, 2: 8, 3: 12, 4: 18, 5: 26, 6: 36, 7: 46, 8: 58, 9: 72 };

// ================= DOT 项目显示名 =================
export const DOT_PROJECT = {
    infection: '感染',
    burn:      '灼烧',
    stigma:    '圣痕',
    erosion:   '蚀炎',
    darkfire:  '冥火',
    ancestor:  '先祖之力',
};

// ================= DOT 固定倍率显示 =================
export const DOT_FIXED_RATE = {
    '0.15': '次级冻伤(15%)',
    '0.50': '冻伤(50%)',
    '0.25': '点燃(25%)',
};

// ================= 最终增伤技能 =================
export const FINAL_DMG_SKILL = {
    '0':  '无',
    '10': '有 (10%)',
};

// ================= 无视守护·寒境（DOT版） =================
export const FINAL_DMG_SKILL_DOT = {
    '0':  '无',
    '10': '有 (10%)',
};
