/**
 * 可靠的主题切换系统
 */
(function() {
    'use strict';
    
    console.log('[Theme] 主题系统初始化');
    
    const THEME_KEY = 'site-theme';
    let button = null;
    
    // 应用主题
    function applyTheme(theme) {
        const root = document.documentElement;
        const body = document.body;
        
        if (theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
            body.setAttribute('data-theme', 'dark');
        } else {
            root.removeAttribute('data-theme');
            body.removeAttribute('data-theme');
        }
        
        localStorage.setItem(THEME_KEY, theme);
        updateButtonIcon();
        
        console.log('[Theme] 应用主题:', theme);
    }
    
    // 获取当前主题
    function getCurrentTheme() {
        return localStorage.getItem(THEME_KEY) || 'light';
    }
    
    // 切换主题
    function toggleTheme() {
        const current = getCurrentTheme();
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        showToast(next === 'dark' ? '🌙 夜间模式' : '☀️ 日间模式');
    }
    
    // 更新按钮图标
    function updateButtonIcon() {
        if (!button) return;
        
        const isDark = getCurrentTheme() === 'dark';
        button.innerHTML = isDark ? 
            '<svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>' :
            '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" fill="none" stroke="white" stroke-width="2"/><line x1="12" y1="1" x2="12" y2="3" stroke="white" stroke-width="2"/><line x1="12" y1="21" x2="12" y2="23" stroke="white" stroke-width="2"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="white" stroke-width="2"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="white" stroke-width="2"/><line x1="1" y1="12" x2="3" y2="12" stroke="white" stroke-width="2"/><line x1="21" y1="12" x2="23" y2="12" stroke="white" stroke-width="2"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="white" stroke-width="2"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="white" stroke-width="2"/></svg>';
    }
    
    // 显示提示
    function showToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 30px;
            padding: 16px 24px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            border-radius: 30px;
            font-size: 14px;
            z-index: 9999998;
            animation: toastFade 2s ease;
            pointer-events: none;
        `;
        toast.textContent = message;
        
        // 添加动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes toastFade {
                0% { opacity: 0; transform: translateY(20px); }
                20%, 80% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-20px); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.remove();
            style.remove();
        }, 2000);
    }
    
    // 创建切换按钮
    function createButton() {
        // 移除旧按钮
        const oldButton = document.querySelector('.theme-switch-button');
        if (oldButton) oldButton.remove();
        
        button = document.createElement('button');
        button.className = 'theme-switch-button';
        button.setAttribute('type', 'button');
        button.setAttribute('aria-label', '切换主题');
        
        button.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleTheme();
        };
        
        document.body.appendChild(button);
        updateButtonIcon();
        
        console.log('[Theme] 按钮已创建');
    }
    
    // 给卡片添加索引（用于动画）
    function indexCards() {
        const cards = document.querySelectorAll('.card, article, .media');
        cards.forEach((card, index) => {
            card.style.setProperty('--index', index);
        });
    }
    
    // 初始化
    function init() {
        // 应用保存的主题
        applyTheme(getCurrentTheme());
        
        // 创建按钮
        createButton();
        
        // 索引卡片
        indexCards();
        
        // 监听动态内容
        const observer = new MutationObserver(() => {
            indexCards();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('[Theme] 初始化完成');
    }
    
    // 确保DOM加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 100);
    }
})();
