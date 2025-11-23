/**
 * 完整功能脚本 - 合并版
 */
(function() {
    'use strict';
    
    // 主题切换功能
    const THEME_KEY = 'site-theme';
    
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
    }
    
    function getCurrentTheme() {
        return localStorage.getItem(THEME_KEY) || 'light';
    }
    
    function toggleTheme() {
        const current = getCurrentTheme();
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
    }
    
    function updateButtonIcon() {
        const button = document.querySelector('.theme-toggle');
        if (!button) return;
        
        const isDark = getCurrentTheme() === 'dark';
        button.innerHTML = isDark ? 
            '<svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>' :
            '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" fill="none" stroke="white" stroke-width="2"/><line x1="12" y1="1" x2="12" y2="3" stroke="white" stroke-width="2"/><line x1="12" y1="21" x2="12" y2="23" stroke="white" stroke-width="2"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="white" stroke-width="2"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="white" stroke-width="2"/><line x1="1" y1="12" x2="3" y2="12" stroke="white" stroke-width="2"/><line x1="21" y1="12" x2="23" y2="12" stroke="white" stroke-width="2"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="white" stroke-width="2"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="white" stroke-width="2"/></svg>';
    }
    
    function createThemeToggle() {
        const button = document.createElement('button');
        button.className = 'theme-toggle';
        button.onclick = toggleTheme;
        document.body.appendChild(button);
        updateButtonIcon();
    }
    
    // 强制深色导航栏
    function forceNavbarDark() {
        if (!document.documentElement.hasAttribute('data-theme')) return;
        
        const navbars = document.querySelectorAll('.navbar, nav.navbar');
        navbars.forEach(navbar => {
            navbar.style.setProperty('background', '#0d1117', 'important');
            navbar.style.setProperty('background-color', '#0d1117', 'important');
        });
    }
    
    // 初始化
    function init() {
        applyTheme(getCurrentTheme());
        createThemeToggle();
        forceNavbarDark();
        
        // 监听主题变化
        const observer = new MutationObserver(() => forceNavbarDark());
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 100);
    }
})();
