/**
 * 清理文章页面的社交图标，只保留侧边栏的
 */
(function() {
    'use strict';
    
    function cleanArticleSocial() {
        // 查找所有社交链接
        const socialLinks = document.querySelectorAll('a[href*="github"], a[href*="mailto"], a[href*="t.me"]');
        
        socialLinks.forEach(link => {
            // 检查是否在侧边栏/widget中
            const inWidget = link.closest('.widget') || 
                           link.closest('.column.is-4') || 
                           link.closest('aside');
            
            // 检查是否在文章区域
            const inArticle = link.closest('article') || 
                            link.closest('.article') || 
                            link.closest('.post') ||
                            link.closest('.card-content:has(article)') ||
                            link.closest('.column.is-8');
            
            // 如果在文章区域但不在widget中，删除
            if (inArticle && !inWidget) {
                const levelItem = link.closest('.level-item');
                if (levelItem) {
                    levelItem.remove();
                    console.log('[Clean] 已删除文章区域的社交图标');
                }
            }
        });
        
        // 删除文章卡片顶部的社交图标（更直接的方法）
        document.querySelectorAll('.card-content .level').forEach(level => {
            // 如果这个level在article内或是文章标题附近
            const hasArticle = level.closest('article') || 
                             level.previousElementSibling?.tagName === 'H1' ||
                             level.previousElementSibling?.tagName === 'H2';
            
            if (hasArticle) {
                // 删除社交链接的level-item
                level.querySelectorAll('.level-item').forEach(item => {
                    const link = item.querySelector('a');
                    if (link && (link.href.includes('github') || 
                               link.href.includes('mailto') || 
                               link.href.includes('t.me'))) {
                        item.remove();
                    }
                });
            }
        });
    }
    
    function init() {
        cleanArticleSocial();
        
        // 多次执行确保清理完全
        setTimeout(cleanArticleSocial, 200);
        setTimeout(cleanArticleSocial, 500);
        setTimeout(cleanArticleSocial, 1000);
        
        // 监听DOM变化
        const observer = new MutationObserver(() => {
            cleanArticleSocial();
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
