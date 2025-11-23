/**
 * 删除China文字和优化空白
 */
(function() {
    'use strict';
    
    function removeChina() {
        // 查找所有包含"China"的元素
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    if (node.nodeValue && node.nodeValue.includes('China')) {
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    return NodeFilter.FILTER_REJECT;
                }
            }
        );
        
        const nodesToRemove = [];
        while (walker.nextNode()) {
            const node = walker.currentNode;
            const parent = node.parentElement;
            
            // 如果父元素只包含China文本，删除整个父元素
            if (parent && parent.textContent.trim() === 'China') {
                nodesToRemove.push(parent);
            } else {
                // 否则只删除China文字
                node.nodeValue = node.nodeValue.replace(/China/g, '');
            }
        }
        
        // 删除收集的节点
        nodesToRemove.forEach(node => {
            if (node.parentNode) {
                node.remove();
            }
        });
        
        // 移除空段落
        document.querySelectorAll('.card-content p').forEach(p => {
            if (!p.textContent.trim()) {
                p.remove();
            }
        });
        
        // 移除"唯见月寒日暖,来煎人寿"
        document.querySelectorAll('.card-content p, .card-content div').forEach(el => {
            if (el.textContent.includes('唯见月寒日暖') || 
                el.textContent.includes('来煎人寿')) {
                el.remove();
            }
        });
        
        console.log('[Remove] 已删除China和优化空白');
    }
    
    function cleanupWhitespace() {
        // 清理卡片中的多余空白
        document.querySelectorAll('.card-content').forEach(card => {
            // 移除空的子元素
            card.querySelectorAll('*').forEach(el => {
                if (el.children.length === 0 && !el.textContent.trim()) {
                    el.remove();
                }
            });
            
            // 规范化空白
            const children = Array.from(card.children);
            children.forEach((child, index) => {
                if (index === 0) {
                    child.style.marginTop = '0';
                }
                if (index === children.length - 1) {
                    child.style.marginBottom = '0';
                }
            });
        });
    }
    
    // 初始化
    function init() {
        removeChina();
        cleanupWhitespace();
        
        // 延迟执行以确保页面完全加载
        setTimeout(() => {
            removeChina();
            cleanupWhitespace();
        }, 500);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // 监听DOM变化
    const observer = new MutationObserver(() => {
        removeChina();
        cleanupWhitespace();
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
