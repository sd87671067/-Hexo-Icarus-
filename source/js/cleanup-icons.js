/**
 * 清理重复图标和优化布局
 */
(function() {
    'use strict';
    
    function cleanupIcons() {
        // 移除卡片内的SVG图标（保留按钮内的）
        document.querySelectorAll('.card svg, .widget svg').forEach(svg => {
            // 保留导航按钮和复制按钮的SVG
            if (!svg.closest('button') && !svg.closest('.navbar-toggle') && !svg.closest('.code-copy-btn')) {
                svg.remove();
            }
        });
        
        // 清理页脚重复图标
        const footerIcons = document.querySelectorAll('.footer .level-item');
        const seenLinks = new Set();
        
        footerIcons.forEach(item => {
            const link = item.querySelector('a');
            if (link) {
                const href = link.getAttribute('href');
                if (seenLinks.has(href)) {
                    item.remove();
                } else {
                    seenLinks.add(href);
                }
            }
        });
        
        // 移除空的icon容器
        document.querySelectorAll('.icon:empty').forEach(icon => {
            icon.remove();
        });
        
        console.log('[Cleanup] 已清理图标');
    }
    
    function init() {
        cleanupIcons();
        setTimeout(cleanupIcons, 500);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
