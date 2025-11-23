/**
 * 页面动画效果
 * 包括加载动画、点击效果、平滑滚动
 */
(function() {
    'use strict';
    
    // 添加页面加载进度条
    function createLoadingBar() {
        const bar = document.createElement('div');
        bar.className = 'page-loading';
        document.body.appendChild(bar);
        
        // 页面开始加载
        bar.classList.add('active');
        
        // 页面加载完成
        window.addEventListener('load', function() {
            setTimeout(function() {
                bar.classList.remove('active');
                setTimeout(function() {
                    bar.remove();
                }, 300);
            }, 500);
        });
    }
    
    // 添加点击波纹效果
    function addRippleEffect() {
        const buttons = document.querySelectorAll('.navbar-item, .navbar-link, .button, .btn, button');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');
                
                // 添加波纹样式
                const style = document.createElement('style');
                style.textContent = `
                    .ripple {
                        position: absolute;
                        border-radius: 50%;
                        background: rgba(255, 255, 255, 0.6);
                        transform: scale(0);
                        animation: ripple-animation 0.6s ease-out;
                        pointer-events: none;
                    }
                    @keyframes ripple-animation {
                        to {
                            transform: scale(4);
                            opacity: 0;
                        }
                    }
                `;
                
                if (!document.querySelector('style[data-ripple]')) {
                    style.setAttribute('data-ripple', 'true');
                    document.head.appendChild(style);
                }
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }
    
    // 平滑滚动
    function smoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    // 滚动时的动画
    function scrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // 监听需要动画的元素
        document.querySelectorAll('.card, .article, .widget').forEach(el => {
            observer.observe(el);
        });
    }
    
    // 导航栏滚动效果
    function navbarScrollEffect() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
        
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) {
                navbar.classList.add('scrolled');
                
                // 添加阴影样式
                navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                
                // 深色模式下的阴影
                if (document.documentElement.getAttribute('data-theme') === 'dark') {
                    navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.5)';
                }
            } else {
                navbar.classList.remove('scrolled');
                navbar.style.boxShadow = '';
            }
            
            // 隐藏/显示导航栏
            if (scrollTop > lastScrollTop && scrollTop > 300) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        });
    }
    
    // 页面切换动画
    function pageTransitions() {
        // 为所有链接添加过渡效果
        document.querySelectorAll('a:not([target="_blank"])').forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // 忽略锚点和外部链接
                if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('//')) {
                    return;
                }
                
                e.preventDefault();
                
                // 添加退出动画
                document.body.style.opacity = '0';
                document.body.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            });
        });
    }
    
    // 初始化所有动画
    function init() {
        createLoadingBar();
        addRippleEffect();
        smoothScroll();
        scrollAnimations();
        navbarScrollEffect();
        pageTransitions();
        
        // 添加全局动画样式
        const style = document.createElement('style');
        style.textContent = `
            body {
                opacity: 1;
                transition: opacity 0.3s ease, transform 0.3s ease;
            }
            
            .navbar {
                transition: transform 0.3s ease, box-shadow 0.3s ease !important;
            }
            
            .animate-in {
                animation: fadeInUp 0.6s ease-out forwards;
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
        
        console.log('动画效果已初始化');
    }
    
    // DOM 加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // 处理动态加载的内容
    if (window.MutationObserver) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length) {
                    setTimeout(() => {
                        addRippleEffect();
                        scrollAnimations();
                    }, 100);
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
})();
