// 公共截图功能模块
let html2canvasLoaded = false;
let html2canvasLoadFailed = false;
let loadingPromise = null;
const CDN_LIST = [
    'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
    'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js',
    'https://unpkg.com/html2canvas@1.4.1/dist/html2canvas.min.js'
];

export function loadHtml2Canvas() {
    if (html2canvasLoaded) return Promise.resolve();
    if (html2canvasLoadFailed) return Promise.reject(new Error('html2canvas 加载失败，请使用系统截图工具'));
    if (loadingPromise) return loadingPromise;
    let index = 0;
    const tryLoad = () => {
        if (index >= CDN_LIST.length) {
            html2canvasLoadFailed = true;
            return Promise.reject(new Error('所有 CDN 均加载失败'));
        }
        const src = CDN_LIST[index++];
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => { html2canvasLoaded = true; resolve(); };
            script.onerror = () => { tryLoad().then(resolve).catch(reject); };
            document.head.appendChild(script);
            const timeoutId = setTimeout(() => { script.onerror = null; reject(new Error('超时')); }, 5000);
            script.onload = () => { clearTimeout(timeoutId); html2canvasLoaded = true; resolve(); };
            script.onerror = () => { clearTimeout(timeoutId); reject(new Error('失败')); };
        });
    };
    loadingPromise = tryLoad().catch(err => { loadingPromise = null; throw err; });
    return loadingPromise;
}

export function showLoading(msg) {
    let d = document.getElementById('screenshotLoading');
    if (!d) {
        d = document.createElement('div');
        d.id = 'screenshotLoading';
        d.className = 'loading-tip';
        document.body.appendChild(d);
    }
    d.textContent = msg;
    d.style.display = 'block';
}

export function hideLoading() {
    const d = document.getElementById('screenshotLoading');
    if (d) d.style.display = 'none';
}

export function showScreenshotError(msg) {
    alert(msg + '\n\n您可以使用系统截图工具手动截图：\n- Windows: Win+Shift+S\n- Mac: Command+Shift+4');
}

// 可选：预加载
export function preloadScreenshot() {
    loadHtml2Canvas().catch(() => console.log('html2canvas 预加载失败，截图功能将降级为手动提示'));
}