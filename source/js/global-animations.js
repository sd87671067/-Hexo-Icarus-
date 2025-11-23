/**
 * 全站动画和夜间模式按钮控制
 */
(function() {
    'use strict';
    
    // ========================================
    // 夜间模式切换功能
    // ========================================
    
    let scrollTimer = null;
    let isScrolling = false;
    
    // 获取主题
    function getCurrentTheme() {
        return localStorage.getItem('theme-preference') || 'auto';
    }
    
    // 设置主题
    function setTheme(theme) {
        const root = document.documentElement;
        
        if (theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
        } else if (theme === 'light') {
            root.removeAttribute('data-theme');
        } else if (theme === 'auto') {
            const hour = new Date().getHours();
            if (hour >= 18 || hour < 6) {
                root.setAttribute('data-theme', 'dark');
            } else {
                root.removeAttribute('data-theme');
            }
        }
        
        localStorage.setItem('theme-preference', theme);
        updateButtonIcon();
    }
    
    // 更新按钮图标
    function updateButtonIcon() {
        const button = document.querySelector('.dark-mode-toggle');
        if (!button) return;
        
        const isDark = document.documentElement.hasAttribute('data-theme');
        
        if (isDark) {
            button.innerHTML = `
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
            `;
        } else {
            button.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="5"/>
                    <line x1="12" y1="1" x2="12" y2="3"/>
                    <line x1="12" y1="21" x2="12" y2="23"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                    <line x1="1" y1="12" x2="3" y2="12"/>
                    <line x1="21" y1="12" x2="23" y2="12"/>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
            `;
        }
    }
    
    // 创建夜间模式按钮
    function createDarkModeToggle() {
        // 移除旧按钮
        const existing = document.querySelector('.dark-mode-toggle');
        if (existing) existing.remove();
        
        const button = document.createElement('button');
        button.className = 'dark-mode-toggle';
        button.setAttribute('aria-label', '切换主题');
        
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const current = getCurrentTheme();
            let next;
            
            if (current === 'auto') {
                next = 'light';
            } else if (current === 'light') {
                next = 'dark';
            } else {
                next = 'auto';
            }
            
            setTheme(next);
            showToast(
                next === 'dark' ? '🌙 夜间模式' : 
                next === 'light' ? '☀️ 日间模式' : 
                '🔄 自动模式'
            );
        });
        
        document.body.appendChild(button);
        updateButtonIcon();
        
        // 滚动显示控制
        handleScrollVisibility(button);
    }
    
    // 滚动显示/隐藏按钮
    function handleScrollVisibility(button) {
        let lastScroll = 0;
        
        function updateButtonVisibility() {
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;
            
            // 滚动超过100px时显示
            if (scrollY > 100) {
                button.classList.add('visible');
            } else {
                button.classList.remove('visible');
            }
            
            lastScroll = scrollY;
        }
        
        // 滚动事件
        window.addEventListener('scroll', function() {
            if (!isScrolling) {
                window.requestAnimationFrame(function() {
                    updateButtonVisibility();
                    isScrolling = false;
                });
                isScrolling = true;
            }
        });
        
        // 初始检查
        updateButtonVisibility();
    }
    
    // 显示提示
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'theme-toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.remove(), 2000);
    }
    
    // ========================================
    // 全站动画功能
    // ========================================
    
    // 滚动显示动画
    function initScrollReveal() {
        const elements = document.querySelectorAll(
            '.card, .widget, article, .media, .timeline-item, .category-list-item'
        );
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('scroll-reveal', 'revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        elements.forEach(el => {
            if (!el.classList.contains('revealed')) {
                el.classList.add('scroll-reveal');
                observer.observe(el);
            }
        });
    }
    
    // 图片懒加载
    function initImageLazyLoad() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            img.classList.add('loading');
            
            if (img.complete) {
                img.classList.remove('loading');
                img.classList.add('loaded');
            } else {
                img.addEventListener('load', function() {
                    this.classList.remove('loading');
                    this.classList.add('loaded');
                });
            }
        });
    }
    
    // 添加标签云动画索引
    function initTagCloud() {
        const tags = document.querySelectorAll('.tag-cloud a');
        tags.forEach((tag, index) => {
            tag.style.setProperty('--index', index);
        });
    }
    
    // 导航栏滚动效果
    function initNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
        
        let lastScroll = 0;
        
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
            } else {
                navbar.style.boxShadow = '';
            }
            
            // 向下滚动隐藏，向上滚动显示
            if (currentScroll > lastScroll && currentScroll > 500) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        });
    }
    
    // 添加点击波纹效果
    function addRippleEffect() {
        const buttons = document.querySelectorAll('.button, .btn, button, .navbar-item');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.5);
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
        
        // 添加波纹动画
        if (!document.querySelector('#ripple-animation')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // ========================================
    // 初始化
    // ========================================
    
    function init() {
        // 应用保存的主题
        const savedTheme = getCurrentTheme();
        setTheme(savedTheme);
        
        // 创建夜间模式按钮
        createDarkModeToggle();
        
        // 初始化动画
        setTimeout(() => {
            initScrollReveal();
            initImageLazyLoad();
            initTagCloud();
            initNavbarScroll();
            addRippleEffect();
        }, 100);
        
        // 监听动态内容
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length) {
                    setTimeout(() => {
                        initScrollReveal();
                        initImageLazyLoad();
                        addRippleEffect();
                    }, 100);
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('全站动画和夜间模式已初始化');
    }
    
    // DOM 加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
