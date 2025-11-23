/**
 * 删除文章卡片多余的图标
 */
(function() {
    'use strict';
    
    function removeExtraIcons() {
        // 删除文章卡片内的所有SVG，除了社交链接
        document.querySelectorAll('.card-content svg, article svg').forEach(svg => {
            // 保留的图标
            const isInLevelItem = svg.closest('.level-item');
            const isInButton = svg.closest('button');
            const isCodeCopy = svg.closest('.code-copy-btn');
            const isNavbar = svg.closest('.navbar-toggle');
            const isDarkMode = svg.closest('.dark-mode-toggle');
            const isInPre = svg.closest('pre');
            
            // 如果不是保留的图标，删除
            if (!isInLevelItem && !isInButton && !isCodeCopy && !isNavbar && !isDarkMode && !isInPre) {
                svg.remove();
            }
        });
        
        // 删除文章右上角的链接图标
        document.querySelectorAll('.card-content > a, article > a').forEach(link => {
            // 跳过level-item内的链接
            if (link.closest('.level-item')) return;
            
            const svg = link.querySelector('svg');
            if (svg) {
                svg.remove();
            }
            
            // 如果链接只包含图标，删除整个链接
            if (link.children.length === 0 && !link.textContent.trim()) {
                link.remove();
            }
        });
        
        // 删除文章元数据中的图标
        document.querySelectorAll('.article-meta svg, .post-meta svg').forEach(svg => {
            if (!svg.closest('.level-item')) {
                svg.remove();
            }
        });
        
        console.log('[Icons] 已删除多余的文章图标');
    }
    
    function init() {
        removeExtraIcons();
        
        // 延迟执行确保页面完全加载
        setTimeout(removeExtraIcons, 300);
        setTimeout(removeExtraIcons, 800);
        
        // 监听DOM变化
        const observer = new MutationObserver(() => {
            removeExtraIcons();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
