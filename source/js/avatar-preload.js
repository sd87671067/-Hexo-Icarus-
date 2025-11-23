/**
 * 头像智能预加载系统
 * 功能：预加载、懒加载、错误处理、缓存优化
 */
(function() {
    'use strict';
    
    // 配置
    const config = {
        criticalAvatars: ['/img/avatar.svg', '/img/logo.svg'],
        lazyLoadOffset: 50,
        timeout: 5000,
        retryLimit: 2,
        defaultAvatar: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzk5OSIgZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgM2MxLjY2IDAgMyAxLjM0IDMgM3MtMS4zNCAzLTMgMy0zLTEuMzQtMy0zIDEuMzQtMyAzLTN6bTAgMTQuMmMtMi41IDAtNC43MS0xLjI4LTYtMy4yMi4wMy0xLjk5IDQtMy4wOCA2LTMuMDggMS45OSAwIDUuOTcgMS4wOSA2IDMuMDgtMS4yOSAxLjk0LTMuNSAzLjIyLTYgMy4yMnoiLz48L3N2Zz4='
    };
    
    // 预加载关键头像
    function preloadCriticalAvatars() {
        config.criticalAvatars.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            link.type = src.endsWith('.svg') ? 'image/svg+xml' : 'image/png';
            document.head.appendChild(link);
        });
    }
    
    // 加载图片
    function loadImage(img, retries = 0) {
        const src = img.dataset.src || img.src;
        if (!src) return;
        
        // 添加加载中样式
        img.parentElement.classList.add('avatar-loading');
        
        const tempImg = new Image();
        const timeout = setTimeout(() => {
            tempImg.src = '';
            handleError();
        }, config.timeout);
        
        const handleLoad = () => {
            clearTimeout(timeout);
            img.src = src;
            img.classList.add('loaded');
            img.parentElement.classList.remove('avatar-loading');
        };
        
        const handleError = () => {
            clearTimeout(timeout);
            if (retries < config.retryLimit) {
                setTimeout(() => loadImage(img, retries + 1), 1000 * (retries + 1));
            } else {
                img.src = config.defaultAvatar;
                img.classList.add('loaded');
                img.parentElement.classList.remove('avatar-loading');
                img.parentElement.classList.add('avatar-error');
            }
        };
        
        tempImg.onload = handleLoad;
        tempImg.onerror = handleError;
        tempImg.src = src;
    }
    
    // 懒加载处理
    function setupLazyLoad() {
        const images = document.querySelectorAll('img[data-src], .avatar img, .media-left img');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        loadImage(entry.target);
                        imageObserver.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: config.lazyLoadOffset + 'px'
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // 降级方案
            images.forEach(img => loadImage(img));
        }
    }
    
    // 初始化
    function init() {
        // 预加载关键资源
        preloadCriticalAvatars();
        
        // 设置懒加载
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupLazyLoad);
        } else {
            setupLazyLoad();
        }
        
        // 监听动态内容
        const observer = new MutationObserver(() => {
            setupLazyLoad();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    init();
})();
