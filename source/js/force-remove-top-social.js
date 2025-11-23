/**
 * 强力删除顶部社交图标
 */
(function() {
    'use strict';
    
    function forceRemoveTopSocial() {
        // 查找所有level容器
        document.querySelectorAll('.level').forEach((level, index) => {
            // 查找社交链接
            const socialLinks = level.querySelectorAll('a[href*="github"], a[href*="mailto"], a[href*="t.me"]');
            
            if (socialLinks.length === 0) return;
            
            // 检查是否在底部（包含统计信息的level通常在底部）
            const hasStats = level.querySelector('span:contains("文章")') || 
                           level.querySelector('span:contains("分类")') ||
                           level.querySelector('span:contains("标签")') ||
                           level.textContent.includes('文章') ||
                           level.textContent.includes('分类') ||
                           level.textContent.includes('标签');
            
            // 如果不在底部（没有统计信息），删除社交链接
            if (!hasStats) {
                socialLinks.forEach(link => {
                    const levelItem = link.closest('.level-item');
                    if (levelItem) {
                        levelItem.style.display = 'none';
                        levelItem.remove();
                    }
                });
            }
        });
        
        // 更直接的方法：删除文章顶部所有带社交图标的level-item
        document.querySelectorAll('.card-content > .level:first-child .level-item').forEach((item, index) => {
            // 保留前3个（通常是时间、分类等信息）
            if (index >= 3) {
                const hasLink = item.querySelector('a[href*="github"], a[href*="mailto"], a[href*="t.me"]');
                if (hasLink) {
                    item.remove();
                }
            }
        });
        
        console.log('[Remove] 已删除顶部社交图标');
    }
    
    function init() {
        forceRemoveTopSocial();
        
        setTimeout(forceRemoveTopSocial, 200);
        setTimeout(forceRemoveTopSocial, 600);
        setTimeout(forceRemoveTopSocial, 1200);
        
        // 持续监听
        const observer = new MutationObserver(() => {
            forceRemoveTopSocial();
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
