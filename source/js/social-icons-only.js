/**
 * 只保留社交图标
 */
(function() {
    'use strict';
    
    function cleanupIcons() {
        // 删除卡片内除社交图标外的所有SVG
        document.querySelectorAll('.card svg, .widget svg').forEach(svg => {
            const link = svg.closest('a');
            
            // 保留的社交平台
            const socialPlatforms = ['t.me', 'telegram', 'mailto', 'github'];
            const isSocial = link && socialPlatforms.some(platform => 
                link.href && link.href.includes(platform)
            );
            
            // 保留按钮内的图标
            const isButton = svg.closest('button') || 
                            svg.closest('.navbar-toggle') || 
                            svg.closest('.code-copy-btn');
            
            if (!isSocial && !isButton) {
                svg.remove();
            }
        });
        
        // 清空页脚内容
        const footer = document.querySelector('.footer');
        if (footer) {
            // 删除所有子元素
            const children = footer.querySelectorAll('*');
            children.forEach(child => child.remove());
        }
        
        // 删除统计图标
        document.querySelectorAll('.level-item .icon:not(:has(a))').forEach(icon => {
            icon.remove();
        });
        
        console.log('[Social] 已清理图标');
    }
    
    function init() {
        cleanupIcons();
        setTimeout(cleanupIcons, 300);
        setTimeout(cleanupIcons, 800);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
