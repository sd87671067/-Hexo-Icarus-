/**
 * 删除回到顶部按钮
 */
(function() {
    'use strict';
    
    function removeBackToTop() {
        // 删除各种可能的回到顶部按钮选择器
        const selectors = [
            '.back-to-top',
            '.back-top',
            '.backtop',
            '.go-top',
            '.to-top',
            '#back-to-top',
            '#backTop',
            '.scroll-top',
            '.scroll-to-top',
            'button[aria-label*="top"]',
            'button[aria-label*="Top"]',
            'a[href="#top"]',
            '[class*="back"][class*="top"]',
            '[id*="back"][id*="top"]'
        ];
        
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                // 确保不是夜间模式按钮
                if (!el.classList.contains('dark-mode-toggle') && 
                    !el.closest('.dark-mode-toggle')) {
                    el.remove();
                }
            });
        });
        
        // 删除fixed定位的按钮（排除已知的功能按钮）
        document.querySelectorAll('button, a, div').forEach(el => {
            const style = window.getComputedStyle(el);
            const isFixed = style.position === 'fixed';
            const isButton = el.tagName === 'BUTTON' || el.tagName === 'A';
            const hasTopPosition = style.bottom && parseInt(style.bottom) < 100;
            
            // 排除夜间模式按钮和导航按钮
            if (isFixed && isButton && hasTopPosition && 
                !el.classList.contains('dark-mode-toggle') &&
                !el.classList.contains('navbar-toggle') &&
                !el.closest('.dark-mode-toggle') &&
                !el.closest('.navbar-toggle')) {
                
                // 检查是否包含向上箭头图标
                const hasUpArrow = el.innerHTML.includes('arrow-up') ||
                                  el.innerHTML.includes('chevron-up') ||
                                  el.innerHTML.includes('angle-up') ||
                                  el.textContent.includes('↑') ||
                                  el.textContent.includes('⬆');
                
                if (hasUpArrow) {
                    el.remove();
                }
            }
        });
        
        console.log('[BackToTop] 已删除回到顶部按钮');
    }
    
    function init() {
        removeBackToTop();
        
        // 延迟执行确保所有按钮都加载
        setTimeout(removeBackToTop, 500);
        setTimeout(removeBackToTop, 1000);
        
        // 监听DOM变化
        const observer = new MutationObserver(() => {
            removeBackToTop();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
