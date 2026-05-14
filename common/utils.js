// 通用工具函数

export function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

/**
 * 自定义条目管理器 —— 消除 renderCustomXxxEntries / addCustomXxxEntry 重复模式
 *
 * @param {Object} config
 * @param {string} config.containerId - DOM 容器元素 ID
 * @param {Function} config.onUpdate - 值变更后的回调（如 updateAll）
 * @param {string} [config.valueKey='percent'] - 数值字段名（'percent' 或 'value'）
 * @param {string} [config.placeholder='百分比'] - 输入框占位文本
 */
export class CustomEntryList {
    constructor(config) {
        this.entries = [];
        this.containerId = config.containerId;
        this.onUpdate = config.onUpdate;
        this.valueKey = config.valueKey || 'percent';
        this.placeholder = config.placeholder || '百分比';
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;
        container.innerHTML = '';
        for (let i = 0; i < this.entries.length; i++) {
            const entry = this.entries[i];
            const div = document.createElement('div');
            div.className = 'row';
            div.style.marginBottom = '8px';
            div.innerHTML = `
                <input type="text" class="custom-name" value="${escapeHtml(entry.name)}" placeholder="名称" style="flex:2;">
                <input type="number" class="custom-percent" value="${entry[this.valueKey] === 0 ? '' : entry[this.valueKey]}" step="1" placeholder="${this.placeholder}" style="flex:1;">
                <button class="small-btn delete-custom">删除</button>
            `;
            const nameInput = div.querySelector('.custom-name');
            const valueInput = div.querySelector('.custom-percent');
            const delBtn = div.querySelector('.delete-custom');

            nameInput.addEventListener('change', () => {
                this.entries[i].name = nameInput.value;
            });
            valueInput.addEventListener('input', () => {
                this.entries[i][this.valueKey] = parseFloat(valueInput.value) || 0;
                this.onUpdate();
            });
            delBtn.addEventListener('click', () => {
                this.entries.splice(i, 1);
                this.render();
                this.onUpdate();
            });
            container.appendChild(div);
        }
    }

    add() {
        this.entries.push({ name: '', [this.valueKey]: 0 });
        this.render();
        this.onUpdate();
    }

    /** 清空所有条目并重渲染（不触发 onUpdate，供 resetAll 等批量操作使用） */
    clear() {
        this.entries.length = 0;
        this.render();
    }

    /** 从存档数据恢复条目（不触发 onUpdate，调用方需自行调用 onUpdate） */
    setFromSaved(arr) {
        this.entries.length = 0;
        if (arr && arr.length) {
            for (const item of arr) {
                this.entries.push({
                    name: item.name || '',
                    [this.valueKey]: item[this.valueKey] !== undefined ? item[this.valueKey] : 0
                });
            }
        }
        this.render();
    }
}
