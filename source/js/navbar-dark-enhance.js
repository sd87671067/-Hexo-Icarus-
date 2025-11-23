/**
 * 导航栏夜间模式增强
 */
(function() {
    'use strict';

    function enhanceNavbarDarkMode() {
        // 监听主题变化
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                    updateNavbarTheme(isDark);
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });

        // 初始化导航栏主题
        const currentTheme = document.documentElement.getAttribute('data-theme') || 
                           localStorage.getItem('theme') || 'light';
        updateNavbarTheme(currentTheme === 'dark');
    }

    function updateNavbarTheme(isDark) {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        if (isDark) {
            // 确保夜间模式样式生效
            navbar.style.backgroundColor = '#161b22';
            console.log('[Navbar] 切换到夜间模式');
        } else {
            // 日间模式
            navbar.style.backgroundColor = 'white';
            console.log('[Navbar] 切换到日间模式');
        }
    }

    // 初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', enhanceNavbarDarkMode);
    } else {
        enhanceNavbarDarkMode();
    }
})();
