/**
 * 修复的夜间模式切换
 */
(function() {
    'use strict';
    
    // 获取当前主题
    function getCurrentTheme() {
        return localStorage.getItem('theme-preference') || 'auto';
    }
    
    // 设置主题
    function setTheme(theme) {
        const root = document.documentElement;
        
        if (theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
        } else if (theme === 'light') {
            root.removeAttribute('data-theme');
        } else if (theme === 'auto') {
            const hour = new Date().getHours();
            if (hour >= 18 || hour < 6) {
                root.setAttribute('data-theme', 'dark');
            } else {
                root.removeAttribute('data-theme');
            }
        }
        
        localStorage.setItem('theme-preference', theme);
        updateButtonIcon();
    }
    
    // 更新按钮图标
    function updateButtonIcon() {
        const button = document.querySelector('.dark-mode-toggle');
        if (!button) return;
        
        const isDark = document.documentElement.hasAttribute('data-theme');
        
        if (isDark) {
            // 月亮图标
            button.innerHTML = `
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
            `;
        } else {
            // 太阳图标
            button.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="5"/>
                    <line x1="12" y1="1" x2="12" y2="3"/>
                    <line x1="12" y1="21" x2="12" y2="23"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                    <line x1="1" y1="12" x2="3" y2="12"/>
                    <line x1="21" y1="12" x2="23" y2="12"/>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
            `;
        }
    }
    
    // 创建切换按钮
    function createToggleButton() {
        // 移除旧按钮
        const oldButton = document.querySelector('.dark-mode-toggle');
        if (oldButton) {
            oldButton.remove();
        }
        
        const button = document.createElement('button');
        button.className = 'dark-mode-toggle';
        button.setAttribute('aria-label', '切换主题');
        button.style.cssText = `
            position: fixed !important;
            bottom: 30px !important;
            right: 30px !important;
            z-index: 999999 !important;
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
        `;
        
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const current = getCurrentTheme();
            let next;
            
            if (current === 'auto') {
                next = 'light';
            } else if (current === 'light') {
                next = 'dark';
            } else {
                next = 'auto';
            }
            
            setTheme(next);
            
            // 显示提示
            showToast(
                next === 'dark' ? '🌙 夜间模式' : 
                next === 'light' ? '☀️ 日间模式' : 
                '🔄 自动模式'
            );
        });
        
        document.body.appendChild(button);
        updateButtonIcon();
    }
    
    // 显示提示
    function showToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 30px;
            padding: 12px 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            border-radius: 20px;
            font-size: 14px;
            z-index: 999998;
            animation: fadeInOut 2s ease;
            pointer-events: none;
        `;
        toast.textContent = message;
        
        // 添加动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateY(10px); }
                20% { opacity: 1; transform: translateY(0); }
                80% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-10px); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
            style.remove();
        }, 2000);
    }
    
    // 初始化
    function init() {
        // 应用保存的主题
        const savedTheme = getCurrentTheme();
        setTheme(savedTheme);
        
        // 创建按钮
        setTimeout(() => {
            createToggleButton();
        }, 100);
        
        // 确保按钮始终存在
        setInterval(() => {
            if (!document.querySelector('.dark-mode-toggle')) {
                createToggleButton();
            }
        }, 1000);
        
        console.log('夜间模式切换已初始化');
    }
    
    // 立即初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
