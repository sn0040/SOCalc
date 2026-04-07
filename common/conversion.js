// 通用攻击转化模块
export function computeConversionValue(base, mult, bonus, hiddenBonus) {
    const multiplier = mult / 100;
    const bonusTotal = (bonus + hiddenBonus) / 100;
    return base * (1 + bonusTotal) * multiplier;
}

// 创建一个转化管理器，绑定到指定的 DOM 元素和参数存储对象
export function createConversionManager(config) {
    const {
        modalId = 'conversionModal',
        titleElementId = 'conversionTitle',
        closeBtnId = 'closeConversionModal',
        applyBtnId = 'applyConversionBtn',
        resetBtnId = 'resetConversionBtn',
        convBaseId = 'convBaseValue',
        convMultiplierId = 'convMultiplier',
        convBonusId = 'convBonus',
        convHiddenBonusId = 'convHiddenBonus',
        convResultId = 'convResultValue',
        // 参数存储对象，例如 { base, multiplier, bonus, hiddenBonus }
        paramsStore,
        // 当参数改变时调用的回调函数 (newValue)
        onUpdate
    } = config;

    let currentType = null; // 可以扩展支持多类型，这里简化为单一类型

    function updateModalDisplay() {
        const base = parseFloat(document.getElementById(convBaseId).value) || 0;
        const mult = parseFloat(document.getElementById(convMultiplierId).value) || 0;
        const bonus = parseFloat(document.getElementById(convBonusId).value) || 0;
        const hidden = parseFloat(document.getElementById(convHiddenBonusId).value) || 0;
        const result = computeConversionValue(base, mult, bonus, hidden);
        document.getElementById(convResultId).innerText = Math.round(result);
    }

    function loadParamsToModal() {
        document.getElementById(convBaseId).value = paramsStore.base;
        document.getElementById(convMultiplierId).value = paramsStore.multiplier;
        document.getElementById(convBonusId).value = paramsStore.bonus;
        document.getElementById(convHiddenBonusId).value = paramsStore.hiddenBonus;
        updateModalDisplay();
    }

    function saveParamsFromModal() {
        const params = {
            base: parseFloat(document.getElementById(convBaseId).value) || 0,
            multiplier: parseFloat(document.getElementById(convMultiplierId).value) || 0,
            bonus: parseFloat(document.getElementById(convBonusId).value) || 0,
            hiddenBonus: parseFloat(document.getElementById(convHiddenBonusId).value) || 0
        };
        paramsStore.base = params.base;
        paramsStore.multiplier = params.multiplier;
        paramsStore.bonus = params.bonus;
        paramsStore.hiddenBonus = params.hiddenBonus;
        const newValue = computeConversionValue(params.base, params.multiplier, params.bonus, params.hiddenBonus);
        if (onUpdate) onUpdate(newValue);
        return newValue;
    }

    function resetParams() {
        paramsStore.base = 0;
        paramsStore.multiplier = 0;
        paramsStore.bonus = 0;
        paramsStore.hiddenBonus = 0;
        loadParamsToModal();
        if (onUpdate) onUpdate(0);
    }

    function openModal(title) {
        if (titleElementId) document.getElementById(titleElementId).innerText = title;
        loadParamsToModal();
        document.getElementById(modalId).classList.add('active');
    }

    function closeModal() {
        document.getElementById(modalId).classList.remove('active');
    }

    // 绑定事件
    document.getElementById(closeBtnId).addEventListener('click', closeModal);
    document.getElementById(applyBtnId).addEventListener('click', () => {
        saveParamsFromModal();
        closeModal();
    });
    document.getElementById(resetBtnId).addEventListener('click', resetParams);
    document.getElementById(modalId).addEventListener('click', (e) => {
        if (e.target === document.getElementById(modalId)) closeModal();
    });
    const inputIds = [convBaseId, convMultiplierId, convBonusId, convHiddenBonusId];
    inputIds.forEach(id => {
        document.getElementById(id).addEventListener('input', updateModalDisplay);
    });

    // 阻止模态框内输入框的点击冒泡（避免意外关闭）
    const modalEl = document.getElementById(modalId);
    const inputs = modalEl.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('mousedown', (e) => e.stopPropagation());
        input.addEventListener('mouseup', (e) => e.stopPropagation());
    });

    return {
        openModal,
        closeModal,
        resetParams,
        getCurrentValue: () => computeConversionValue(paramsStore.base, paramsStore.multiplier, paramsStore.bonus, paramsStore.hiddenBonus)
    };
}