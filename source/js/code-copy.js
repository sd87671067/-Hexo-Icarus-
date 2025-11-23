/**
 * 代码块复制功能
 */
(function() {
    'use strict';
    
    // 创建复制按钮
    function createCopyButton(pre) {
        // 检查是否已有按钮
        if (pre.querySelector('.code-copy-btn')) return;
        
        const button = document.createElement('button');
        button.className = 'code-copy-btn';
        button.textContent = '复制';
        button.type = 'button';
        
        button.addEventListener('click', function() {
            const code = pre.querySelector('code') || pre;
            const text = code.textContent || code.innerText;
            
            // 使用现代API复制
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(() => {
                    button.textContent = '已复制!';
                    button.style.background = '#28a745';
                    button.style.color = 'white';
                    button.style.borderColor = '#28a745';
                    
                    setTimeout(() => {
                        button.textContent = '复制';
                        button.style.background = '';
                        button.style.color = '';
                        button.style.borderColor = '';
                    }, 2000);
                }).catch(err => {
                    console.error('复制失败:', err);
                    fallbackCopy(text);
                });
            } else {
                // 降级方案
                fallbackCopy(text);
            }
        });
        
        // 确保pre元素有相对定位
        pre.style.position = 'relative';
        pre.appendChild(button);
    }
    
    // 降级复制方案
    function fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
            console.log('文本已复制');
        } catch (err) {
            console.error('复制失败:', err);
        }
        
        document.body.removeChild(textarea);
    }
    
    // 为所有代码块添加复制按钮
    function addCopyButtons() {
        const codeBlocks = document.querySelectorAll('pre');
        codeBlocks.forEach(pre => {
            createCopyButton(pre);
        });
        
        console.log('[CodeCopy] 已为 ' + codeBlocks.length + ' 个代码块添加复制按钮');
    }
    
    // 监听动态内容
    function observeCodeBlocks() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // Element node
                            if (node.tagName === 'PRE') {
                                createCopyButton(node);
                            } else if (node.querySelectorAll) {
                                const pres = node.querySelectorAll('pre');
                                pres.forEach(pre => createCopyButton(pre));
                            }
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // 初始化
    function init() {
        addCopyButtons();
        observeCodeBlocks();
        console.log('[CodeCopy] 代码复制功能已初始化');
    }
    
    // DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 100);
    }
})();
