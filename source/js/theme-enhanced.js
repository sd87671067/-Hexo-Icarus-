/**
 * 主题增强效果
 */
(function() {
    'use strict';
    
    // 添加动态背景
    function addDynamicBackground() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        
        // 清除旧的背景元素
        document.querySelectorAll('.dynamic-bg').forEach(el => el.remove());
        
        if (!isDark) {
            // 白天模式 - 彩色圆圈
            for (let i = 0; i < 3; i++) {
                const circle = document.createElement('div');
                circle.className = 'dynamic-bg';
                circle.style.cssText = `
                    position: fixed;
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: -1;
                    opacity: 0.4;
                    filter: blur(40px);
                `;
                
                const colors = [
                    'radial-gradient(circle, rgba(251, 113, 133, 0.4), transparent)',
                    'radial-gradient(circle, rgba(129, 230, 217, 0.4), transparent)',
                    'radial-gradient(circle, rgba(251, 207, 232, 0.4), transparent)'
                ];
                
                const size = 200 + Math.random() * 300;
                circle.style.width = size + 'px';
                circle.style.height = size + 'px';
                circle.style.background = colors[i % colors.length];
                circle.style.top = Math.random() * 100 + '%';
                circle.style.left = Math.random() * 100 + '%';
                
                document.body.appendChild(circle);
                
                // 缓慢移动动画
                animateElement(circle);
            }
        } else {
            // 夜间模式 - 星星效果
            for (let i = 0; i < 50; i++) {
                const star = document.createElement('div');
                star.className = 'dynamic-bg star';
                star.style.cssText = `
                    position: fixed;
                    width: 2px;
                    height: 2px;
                    background: white;
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: -1;
                    opacity: ${Math.random() * 0.8};
                    top: ${Math.random() * 100}%;
                    left: ${Math.random() * 100}%;
                    animation: twinkle ${2 + Math.random() * 3}s infinite;
                `;
                document.body.appendChild(star);
            }
            
            // 添加星星闪烁动画
            if (!document.querySelector('#star-animation')) {
                const style = document.createElement('style');
                style.id = 'star-animation';
                style.textContent = `
                    @keyframes twinkle {
                        0%, 100% { opacity: 0.2; }
                        50% { opacity: 1; }
                    }
                `;
                document.head.appendChild(style);
            }
        }
    }
    
    // 元素动画
    function animateElement(element) {
        let x = 0;
        let y = 0;
        let dirX = (Math.random() - 0.5) * 0.5;
        let dirY = (Math.random() - 0.5) * 0.5;
        
        function move() {
            x += dirX;
            y += dirY;
            
            element.style.transform = `translate(${x}px, ${y}px)`;
            
            if (Math.abs(x) > 50) dirX *= -1;
            if (Math.abs(y) > 50) dirY *= -1;
            
            requestAnimationFrame(move);
        }
        
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            move();
        }
    }
    
    // 滚动视差
    function initParallax() {
        const cards = document.querySelectorAll('.card, .widget');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            cards.forEach((card, index) => {
                const speed = 1 + (index * 0.1);
                const yPos = -(scrolled * speed / 20);
                
                if (Math.abs(yPos) < 30) {
                    card.style.transform = `translateY(${yPos}px)`;
                }
            });
        });
    }
    
    // 监听主题切换
    function watchThemeChange() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    addDynamicBackground();
                }
            });
        });
        
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
    }
    
    // 初始化
    function init() {
        addDynamicBackground();
        initParallax();
        watchThemeChange();
        
        console.log('主题增强效果已初始化');
    }
    
    // DOM 加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
