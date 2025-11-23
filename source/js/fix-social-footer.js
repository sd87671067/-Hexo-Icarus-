/**
 * 修复社交图标和页脚
 */
(function() {
    'use strict';
    
    function fixSocialIcons() {
        // 确保社交链接的SVG可见
        const socialLinks = document.querySelectorAll('a[href*="github"], a[href*="mailto"], a[href*="t.me"], a[href*="telegram"]');
        
        socialLinks.forEach(link => {
            const svg = link.querySelector('svg');
            if (svg) {
                svg.style.display = 'inline-block';
                svg.style.width = '20px';
                svg.style.height = '20px';
            }
        });
        
        console.log('[Social] 已显示社交图标');
    }
    
    function cleanFooter() {
        // 清空页脚原有内容，让CSS接管
        const footer = document.querySelector('.footer');
        if (footer) {
            // 移除所有子元素
            while (footer.firstChild) {
                footer.removeChild(footer.firstChild);
            }
        }
    }
    
    function init() {
        fixSocialIcons();
        cleanFooter();
        
        setTimeout(fixSocialIcons, 500);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
