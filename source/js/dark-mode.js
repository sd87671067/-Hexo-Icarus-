/**
 * 自动夜间模式
 * 根据时间自动切换，也支持手动切换
 */
(function() {
    'use strict';
    
    // 配置
    const config = {
        autoMode: true, // 是否启用自动模式
        dayStart: 6,    // 白天开始时间（6:00）
        nightStart: 18, // 夜晚开始时间（18:00）
    };
    
    // 获取当前主题
    function getCurrentTheme() {
        return localStorage.getItem('theme') || 'auto';
    }
    
    // 设置主题
    function setTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else if (theme === 'light') {
            document.documentElement.removeAttribute('data-theme');
        } else if (theme === 'auto') {
            applyAutoTheme();
        }
        
        localStorage.setItem('theme', theme);
        updateToggleButton(theme);
        
        // 显示提示
        showIndicator(theme);
    }
    
    // 自动主题
    function applyAutoTheme() {
        const hour = new Date().getHours();
        const isNight = hour >= config.nightStart || hour < config.dayStart;
        
        if (isNight) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        
        return isNight ? 'dark' : 'light';
    }
    
    // 更新按钮图标
    function updateToggleButton(theme) {
        const button = document.querySelector('.dark-mode-toggle');
        if (!button) return;
        
        let icon = '';
        let actualTheme = theme;
        
        if (theme === 'auto') {
            const hour = new Date().getHours();
            actualTheme = (hour >= config.nightStart || hour < config.dayStart) ? 'dark' : 'light';
        }
        
        if (actualTheme === 'dark') {
            // 月亮图标
            icon = '<svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
        } else {
            // 太阳图标
            icon = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
        }
        
        button.innerHTML = icon;
    }
    
    // 显示模式提示
    function showIndicator(theme) {
        let indicator = document.querySelector('.auto-mode-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'auto-mode-indicator';
            document.body.appendChild(indicator);
        }
        
        let text = '';
        if (theme === 'auto') {
            const hour = new Date().getHours();
            const isNight = hour >= config.nightStart || hour < config.dayStart;
            text = `🌙 自动模式：${isNight ? '夜间' : '日间'}`;
        } else if (theme === 'dark') {
            text = '🌙 夜间模式';
        } else {
            text = '☀️ 日间模式';
        }
        
        indicator.textContent = text;
        indicator.classList.add('show');
        
        setTimeout(() => {
            indicator.classList.remove('show');
        }, 2000);
    }
    
    // 创建切换按钮
    function createToggleButton() {
        const button = document.createElement('button');
        button.className = 'dark-mode-toggle';
        button.setAttribute('aria-label', '切换夜间模式');
        button.setAttribute('title', '点击切换主题');
        
        button.addEventListener('click', function() {
            const currentTheme = getCurrentTheme();
            let newTheme;
            
            // 循环切换：auto -> light -> dark -> auto
            if (currentTheme === 'auto') {
                newTheme = 'light';
            } else if (currentTheme === 'light') {
                newTheme = 'dark';
            } else {
                newTheme = 'auto';
            }
            
            setTheme(newTheme);
        });
        
        document.body.appendChild(button);
        updateToggleButton(getCurrentTheme());
    }
    
    // 初始化
    function init() {
        // 应用保存的主题或默认主题
        const savedTheme = getCurrentTheme();
        setTheme(savedTheme);
        
        // 创建切换按钮
        createToggleButton();
        
        // 自动模式下，每分钟检查一次时间
        if (config.autoMode) {
            setInterval(function() {
                const theme = getCurrentTheme();
                if (theme === 'auto') {
                    applyAutoTheme();
                }
            }, 60000); // 每分钟检查
        }
        
        // 监听系统主题变化（如果浏览器支持）
        if (window.matchMedia) {
            const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            darkModeQuery.addListener(function(e) {
                const theme = getCurrentTheme();
                if (theme === 'auto') {
                    setTheme('auto');
                }
            });
        }
        
        console.log('夜间模式已初始化');
    }
    
    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
