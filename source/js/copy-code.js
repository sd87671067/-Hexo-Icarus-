/**
 * 代码块复制功能
 * 支持所有代码块类型
 */
(function() {
    'use strict';
    
    function initCopyButtons() {
        // 移除旧按钮
        document.querySelectorAll('.code-copy-btn').forEach(btn => btn.remove());
        
        // 查找所有代码块
        const codeBlocks = document.querySelectorAll('pre, figure.highlight, .highlight');
        
        console.log('找到代码块数量:', codeBlocks.length);
        
        codeBlocks.forEach(function(block, index) {
            // 跳过已经有按钮的
            if (block.querySelector('.code-copy-btn')) {
                return;
            }
            
            // 创建按钮
            const button = document.createElement('button');
            button.className = 'code-copy-btn';
            button.type = 'button';
            button.setAttribute('aria-label', '复制代码');
            
            // 点击复制
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                let codeText = '';
                
                // 尝试多种方式获取代码
                const codeElement = block.querySelector('.code code') || 
                                   block.querySelector('code') || 
                                   block.querySelector('.code') ||
                                   block;
                
                if (codeElement) {
                    // 获取纯文本，移除行号
                    const lines = codeElement.querySelectorAll('.line');
                    if (lines.length > 0) {
                        codeText = Array.from(lines).map(line => line.textContent).join('\n');
                    } else {
                        codeText = codeElement.textContent || codeElement.innerText;
                    }
                }
                
                // 清理文本
                codeText = codeText.trim();
                
                // 复制到剪贴板
                if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(codeText).then(function() {
                        showSuccess(button);
                    }).catch(function(err) {
                        console.error('复制失败:', err);
                        fallbackCopy(codeText, button);
                    });
                } else {
                    fallbackCopy(codeText, button);
                }
            });
            
            // 插入按钮
            block.style.position = 'relative';
            block.appendChild(button);
        });
        
        console.log('复制按钮已添加');
    }
    
    // 成功提示
    function showSuccess(button) {
        button.classList.add('copied');
        setTimeout(function() {
            button.classList.remove('copied');
        }, 2000);
    }
    
    // 降级复制方案
    function fallbackCopy(text, button) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '-9999px';
        document.body.appendChild(textarea);
        
        textarea.focus();
        textarea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showSuccess(button);
                console.log('复制成功（降级方案）');
            }
        } catch (err) {
            console.error('降级复制失败:', err);
            alert('复制失败，请手动复制');
        }
        
        document.body.removeChild(textarea);
    }
    
    // 初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCopyButtons);
    } else {
        // 延迟执行，确保代码块已渲染
        setTimeout(initCopyButtons, 500);
    }
    
    // 监听动态内容
    if (window.MutationObserver) {
        const observer = new MutationObserver(function(mutations) {
            let shouldInit = false;
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1 && 
                            (node.tagName === 'PRE' || 
                             node.classList.contains('highlight') ||
                             node.querySelector('pre, .highlight'))) {
                            shouldInit = true;
                        }
                    });
                }
            });
            if (shouldInit) {
                setTimeout(initCopyButtons, 100);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    console.log('代码复制功能已加载');
})();
