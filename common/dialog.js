// common/dialog.js —— 轻量对话框（替换原生 prompt/confirm/alert）

function createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'dialog-overlay';
    overlay.style.cssText = `
        position: fixed; top:0; left:0; width:100%; height:100%;
        background: rgba(0,0,0,0.6); backdrop-filter: blur(3px);
        z-index: 3000; display:flex; align-items:center; justify-content:center;
        font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
    `;
    return overlay;
}

function createCard() {
    const card = document.createElement('div');
    card.style.cssText = `
        background: #F8F5D6; border-radius: 32px; padding: 28px 32px;
        max-width: 420px; width: 90%; box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        border: 2px solid #80D1C8; text-align: center;
    `;
    return card;
}

function createButton(text, primary) {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.style.cssText = `
        padding: 12px 24px; border: none; border-radius: 60px;
        font-size: 1rem; font-weight: 700; cursor: pointer;
        background: ${primary ? 'linear-gradient(145deg, #80D1C8, #6bb8af)' : '#fefcf0'};
        color: #1d2e44; box-shadow: ${primary ? '0 4px 0 #2c5a6e' : '0 2px 0 #b0e1dc'};
        border: ${primary ? 'none' : '2px solid #b0e1dc'};
        min-width: 100px; transition: all 0.08s linear;
    `;
    btn.onmousedown = () => { btn.style.transform = 'translateY(3px)'; btn.style.boxShadow = primary ? '0 1px 0 #2c5a6e' : '0 0px 0 #b0e1dc'; };
    btn.onmouseup = () => { btn.style.transform = ''; btn.style.boxShadow = ''; };
    btn.onmouseleave = () => { btn.style.transform = ''; btn.style.boxShadow = ''; };
    return btn;
}

export function showPrompt(message, defaultValue = '') {
    return new Promise((resolve) => {
        const overlay = createOverlay();
        const card = createCard();
        card.innerHTML = `<div style="font-size:1.2rem; font-weight:700; color:#2c5a6e; margin-bottom:20px;">${message}</div>`;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = defaultValue;
        input.style.cssText = `
            width:100%; padding:14px 16px; border:2px solid #b0e1dc; border-radius:30px;
            font-size:1rem; outline:none; background:white; color:#2c5a6e; box-sizing:border-box;
        `;
        input.onfocus = () => input.select();
        card.appendChild(input);

        const btnRow = document.createElement('div');
        btnRow.style.cssText = 'display:flex; gap:12px; margin-top:20px; justify-content:center;';

        const cancelBtn = createButton('取消', false);
        cancelBtn.onclick = () => { document.body.removeChild(overlay); resolve(null); };
        const okBtn = createButton('确定', true);
        okBtn.onclick = () => {
            const val = input.value.trim();
            if (val === '') { input.style.borderColor = '#e74c3c'; input.focus(); return; }
            document.body.removeChild(overlay);
            resolve(val);
        };
        input.onkeydown = (e) => { if (e.key === 'Enter') okBtn.click(); if (e.key === 'Escape') cancelBtn.click(); };

        btnRow.appendChild(cancelBtn);
        btnRow.appendChild(okBtn);
        card.appendChild(btnRow);
        overlay.appendChild(card);
        document.body.appendChild(overlay);
        setTimeout(() => input.focus(), 50);
    });
}

export function showConfirm(message) {
    return new Promise((resolve) => {
        const overlay = createOverlay();
        const card = createCard();
        card.innerHTML = `<div style="font-size:1.1rem; color:#2c5a6e; line-height:1.5; margin-bottom:20px;">${message}</div>`;

        const btnRow = document.createElement('div');
        btnRow.style.cssText = 'display:flex; gap:12px; justify-content:center;';

        const cancelBtn = createButton('取消', false);
        cancelBtn.onclick = () => { document.body.removeChild(overlay); resolve(false); };
        const okBtn = createButton('确定', true);
        okBtn.onclick = () => { document.body.removeChild(overlay); resolve(true); };

        btnRow.appendChild(cancelBtn);
        btnRow.appendChild(okBtn);
        card.appendChild(btnRow);
        overlay.appendChild(card);
        document.body.appendChild(overlay);
    });
}

export function showAlert(message) {
    return showToast(message);
}

export function showToast(message, duration = 2000) {
    return new Promise((resolve) => {
        const el = document.createElement('div');
        el.textContent = message;
        el.style.cssText = `
            position: fixed; top: 30px; left: 50%; transform: translateX(-50%);
            background: #2c5a6e; color: #F8F5D6; padding: 14px 28px;
            border-radius: 60px; font-size: 1rem; font-weight: 600;
            box-shadow: 0 8px 24px rgba(0,0,0,0.25); z-index: 5000;
            border: 2px solid #80D1C8;
            transition: opacity 0.3s ease; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
        `;
        document.body.appendChild(el);
        setTimeout(() => {
            el.style.opacity = '0';
            setTimeout(() => { document.body.removeChild(el); resolve(); }, 300);
        }, duration);
    });
}
