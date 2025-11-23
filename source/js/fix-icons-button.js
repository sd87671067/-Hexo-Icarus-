/**
 * 恢复图标和删除关注按钮
 */
(function() {
    'use strict';
    
    function fixElements() {
        // 删除"关注我"按钮
        document.querySelectorAll('.button, a.button, button').forEach(btn => {
            if (btn.textContent && btn.textContent.includes('关注我')) {
                btn.remove();
            }
        });
        
        // 确保页脚图标不被隐藏
        const footerIcons = document.querySelectorAll('.footer .level-item a .icon, .footer .level-item svg');
        footerIcons.forEach(icon => {
            if (icon.closest('a')) {
                const href = icon.closest('a').href || '';
                // 只显示GitHub、邮件、Telegram图标
                if (href.includes('github') || href.includes('mailto') || href.includes('telegram') || href.includes('t.me')) {
                    icon.style.display = 'inline-flex';
                    icon.style.visibility = 'visible';
                    icon.style.opacity = '1';
                }
            }
        });
        
        // 移除代码块阴影
        document.querySelectorAll('pre, .highlight, code').forEach(el => {
            el.style.boxShadow = 'none';
            el.style.webkitBoxShadow = 'none';
            el.style.mozBoxShadow = 'none';
        });
        
        console.log('[Fix] 已恢复图标并删除关注按钮');
    }
    
    // 初始化
    function init() {
        fixElements();
        setTimeout(fixElements, 500);
        setTimeout(fixElements, 1000);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // 监听主题切换
    const observer = new MutationObserver(() => {
        const isDark = document.documentElement.hasAttribute('data-theme');
        if (isDark) {
            // 夜间模式时再次确保无阴影
            document.querySelectorAll('pre, .highlight, code').forEach(el => {
                el.style.boxShadow = 'none';
            });
        }
    });
    
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });
})();
