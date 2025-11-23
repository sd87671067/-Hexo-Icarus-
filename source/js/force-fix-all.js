/**
 * 强制修复所有问题
 */
(function() {
    'use strict';
    
    function forceRemoveShadows() {
        // 强制移除所有代码块阴影
        const codeElements = document.querySelectorAll('pre, code, .highlight, figure.highlight, .hljs, .code-copy-btn');
        codeElements.forEach(el => {
            el.style.setProperty('box-shadow', 'none', 'important');
            el.style.setProperty('-webkit-box-shadow', 'none', 'important');
            el.style.setProperty('-moz-box-shadow', 'none', 'important');
            el.style.setProperty('text-shadow', 'none', 'important');
            el.style.setProperty('filter', 'none', 'important');
        });
        
        // 注入全局样式确保无阴影
        if (!document.getElementById('no-shadow-style')) {
            const style = document.createElement('style');
            style.id = 'no-shadow-style';
            style.textContent = `
                pre, pre *, code, code *, .highlight, .highlight *,
                [data-theme="dark"] pre, [data-theme="dark"] pre *,
                [data-theme="dark"] code, [data-theme="dark"] code * {
                    box-shadow: none !important;
                    -webkit-box-shadow: none !important;
                    -moz-box-shadow: none !important;
                    text-shadow: none !important;
                    filter: none !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    function ensureStatsIcons() {
        // 确保统计图标显示
        const statsItems = document.querySelectorAll('.level-item');
        statsItems.forEach(item => {
            const heading = item.querySelector('.heading');
            if (heading) {
                const text = heading.textContent;
                if (!item.querySelector('.stats-icon')) {
                    const icon = document.createElement('div');
                    icon.className = 'stats-icon';
                    icon.style.fontSize = '24px';
                    icon.style.marginBottom = '8px';
                    
                    if (text.includes('文章')) {
                        icon.textContent = '📝';
                    } else if (text.includes('分类')) {
                        icon.textContent = '📁';
                    } else if (text.includes('标签')) {
                        icon.textContent = '🏷️';
                    }
                    
                    if (icon.textContent) {
                        item.insertBefore(icon, item.firstChild);
                    }
                }
            }
        });
    }
    
    function removeVisitorCount() {
        // 删除访客记录
        const texts = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        const nodesToRemove = [];
        while (texts.nextNode()) {
            const node = texts.currentNode;
            if (node.textContent && node.textContent.includes('访客')) {
                const parent = node.parentElement;
                if (parent) {
                    nodesToRemove.push(parent);
                }
            }
        }
        
        nodesToRemove.forEach(node => {
            if (node && node.parentNode) {
                node.remove();
            }
        });
    }
    
    function init() {
        forceRemoveShadows();
        ensureStatsIcons();
        removeVisitorCount();
        
        // 多次执行确保生效
        setTimeout(() => {
            forceRemoveShadows();
            ensureStatsIcons();
            removeVisitorCount();
        }, 100);
        
        setTimeout(() => {
            forceRemoveShadows();
            ensureStatsIcons();
        }, 500);
        
        setTimeout(() => {
            forceRemoveShadows();
        }, 1000);
    }
    
    // 立即执行
    init();
    
    // DOM加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    }
    
    // 监听主题切换
    const observer = new MutationObserver(() => {
        forceRemoveShadows();
    });
    
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });
    
    // 页面完全加载后再次执行
    window.addEventListener('load', () => {
        setTimeout(init, 100);
    });
    
    console.log('[Force Fix] 已应用所有修复');
})();
