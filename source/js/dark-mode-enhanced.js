/**
 * 增强版夜间模式
 * 自动/手动切换，记忆用户选择
 */
(function() {
    'use strict';
    
    // 配置
    const config = {
        autoMode: true,
        dayStart: 6,
        nightStart: 18,
        storageKey: 'theme-preference'
    };
    
    // 获取保存的主题
    function getSavedTheme() {
        return localStorage.getItem(config.storageKey) || 'auto';
    }
    
    // 保存主题
    function saveTheme(theme) {
        localStorage.setItem(config.storageKey, theme);
    }
    
    // 设置主题
    function applyTheme(theme) {
        const root = document.documentElement;
        
        if (theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
            updateButtonIcon('dark');
        } else if (theme === 'light') {
            root.removeAttribute('data-theme');
            updateButtonIcon('light');
        } else if (theme === 'auto') {
            const hour = new Date().getHours();
            const isDark = hour >= config.nightStart || hour < config.dayStart;
            
            if (isDark) {
                root.setAttribute('data-theme', 'dark');
                updateButtonIcon('dark');
            } else {
                root.removeAttribute('data-theme');
                updateButtonIcon('light');
            }
        }
        
        console.log('主题已切换:', theme);
    }
    
    // 更新按钮图标
    function updateButtonIcon(currentTheme) {
        const button = document.querySelector('.dark-mode-toggle');
        if (!button) return;
        
        if (currentTheme === 'dark') {
            // 月亮图标
            button.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
        // 检查是否已存在
        if (document.querySelector('.dark-mode-toggle')) {
            return;
        }
        
        const button = document.createElement('button');
        button.className = 'dark-mode-toggle';
        button.setAttribute('aria-label', '切换夜间模式');
        button.setAttribute('title', '切换主题');
        
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const currentTheme = getSavedTheme();
            let newTheme;
            
            // 切换顺序：auto -> light -> dark -> auto
            if (currentTheme === 'auto') {
                newTheme = 'light';
                showToast('☀️ 日间模式');
            } else if (currentTheme === 'light') {
                newTheme = 'dark';
                showToast('🌙 夜间模式');
            } else {
                newTheme = 'auto';
                showToast('🔄 自动模式');
            }
            
            saveTheme(newTheme);
            applyTheme(newTheme);
        });
        
        document.body.appendChild(button);
    }
    
    // 显示提示
    function showToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 90px;
            right: 30px;
            padding: 10px 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            border-radius: 20px;
            font-size: 14px;
            z-index: 99998;
            animation: fadeInOut 2s ease;
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
        // 创建按钮
        createToggleButton();
        
        // 应用保存的主题
        const savedTheme = getSavedTheme();
        applyTheme(savedTheme);
        
        // 自动模式下定期检查时间
        if (config.autoMode) {
            setInterval(() => {
                const theme = getSavedTheme();
                if (theme === 'auto') {
                    applyTheme('auto');
                }
            }, 60000); // 每分钟检查
        }
        
        console.log('夜间模式已初始化');
    }
    
    // DOM 加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 100);
    }
    
    // 监听系统主题变化
    if (window.matchMedia) {
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        darkModeQuery.addEventListener('change', (e) => {
            const theme = getSavedTheme();
            if (theme === 'auto') {
                applyTheme('auto');
            }
        });
    }
})();
