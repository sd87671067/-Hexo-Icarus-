/**
 * 增强代码复制功能
 */
(function() {
    'use strict';
    
    // 创建复制按钮
    function createCopyButton(pre) {
        // 检查是否已有按钮
        if (pre.querySelector('.code-copy-btn')) return;
        
        // 创建按钮
        const button = document.createElement('button');
        button.className = 'code-copy-btn';
        button.textContent = '复制';
        button.type = 'button';
        
        // 创建提示
        const tooltip = document.createElement('div');
        tooltip.className = 'code-copy-tooltip';
        tooltip.textContent = '点击复制代码';
        
        // 点击事件
        button.addEventListener('click', async function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // 防止重复点击
            if (button.classList.contains('copying')) return;
            
            button.classList.add('copying');
            
            const code = pre.querySelector('code') || pre;
            const text = code.textContent || code.innerText;
            
            try {
                // 尝试使用新API
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(text);
                    showSuccess();
                } else {
                    // 降级方案
                    const textarea = document.createElement('textarea');
                    textarea.value = text;
                    textarea.style.position = 'fixed';
                    textarea.style.opacity = '0';
                    textarea.style.pointerEvents = 'none';
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    showSuccess();
                }
            } catch (err) {
                console.error('复制失败:', err);
                button.textContent = '失败';
                button.classList.remove('copying');
                setTimeout(() => {
                    button.textContent = '复制';
                }, 2000);
            }
        });
        
        // 成功提示
        function showSuccess() {
            button.classList.remove('copying');
            button.classList.add('success');
            button.textContent = '已复制!';
            
            // 显示提示
            tooltip.textContent = '复制成功!';
            tooltip.classList.add('show');
            
            setTimeout(() => {
                button.classList.remove('success');
                button.textContent = '复制';
                tooltip.classList.remove('show');
                tooltip.textContent = '点击复制代码';
            }, 2000);
        }
        
        // 鼠标悬停提示
        button.addEventListener('mouseenter', () => {
            if (!button.classList.contains('success')) {
                tooltip.classList.add('show');
            }
        });
        
        button.addEventListener('mouseleave', () => {
            if (!button.classList.contains('success')) {
                tooltip.classList.remove('show');
            }
        });
        
        // 确保pre有相对定位
        pre.style.position = 'relative';
        pre.appendChild(button);
        pre.appendChild(tooltip);
    }
    
    // 为所有代码块添加按钮
    function addAllCopyButtons() {
        const codeBlocks = document.querySelectorAll('pre');
        codeBlocks.forEach(pre => createCopyButton(pre));
        console.log('[CodeCopy] 已添加 ' + codeBlocks.length + ' 个复制按钮');
    }
    
    // 监听DOM变化
    function observeChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
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
        console.log('[CodeCopy] 初始化代码复制功能');
        addAllCopyButtons();
        observeChanges();
        
        // 延迟再检查一次
        setTimeout(addAllCopyButtons, 1000);
    }
    
    // 确保DOM加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 100);
    }
    
    // 页面完全加载后再次检查
    window.addEventListener('load', () => {
        setTimeout(addAllCopyButtons, 500);
    });
})();
