/**
 * 头像立即加载 - 无占位符
 */
(function() {
    'use strict';
    
    // 立即加载所有图片
    function loadAllImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // 移除所有延迟加载属性
            img.removeAttribute('loading');
            img.removeAttribute('data-src');
            img.removeAttribute('data-lazy');
            
            // 如果有data-src，立即设置为src
            const dataSrc = img.getAttribute('data-src');
            if (dataSrc && !img.src) {
                img.src = dataSrc;
            }
            
            // 强制显示
            img.style.opacity = '1';
            img.style.visibility = 'visible';
            img.style.display = 'block';
            
            // 移除可能的类
            img.classList.remove('lazy', 'lazyload', 'lazyloading', 'placeholder');
        });
        
        console.log('[Avatar] 已处理 ' + images.length + ' 个图片');
    }
    
    // 监听DOM变化
    function observeImages() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            if (node.tagName === 'IMG') {
                                loadImage(node);
                            } else if (node.querySelectorAll) {
                                const imgs = node.querySelectorAll('img');
                                imgs.forEach(img => loadImage(img));
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
    
    function loadImage(img) {
        img.removeAttribute('loading');
        img.removeAttribute('data-src');
        img.style.opacity = '1';
        img.style.visibility = 'visible';
    }
    
    // 初始化
    function init() {
        console.log('[Avatar] 初始化立即加载');
        loadAllImages();
        observeImages();
        
        // 多次检查确保生效
        setTimeout(loadAllImages, 100);
        setTimeout(loadAllImages, 500);
        setTimeout(loadAllImages, 1000);
    }
    
    // 尽快执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // 页面完全加载后再检查
    window.addEventListener('load', loadAllImages);
})();
