/**
 * 主题增强功能
 */
(function() {
    'use strict';
    
    // ========================================
    // 夜间模式切换
    // ========================================
    
    function initDarkModeToggle() {
        // 创建按钮
        const button = document.createElement('button');
        button.className = 'dark-mode-toggle';
        button.innerHTML = `
            <svg viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
        `;
        
        // 切换主题
        button.addEventListener('click', function() {
            const html = document.documentElement;
            const isDark = html.hasAttribute('data-theme');
            
            if (isDark) {
                html.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                showToast('☀️ 日间模式');
            } else {
                html.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                showToast('🌙 夜间模式');
            }
            
            updateButtonIcon();
        });
        
        document.body.appendChild(button);
        
        // 恢复主题
        if (localStorage.getItem('theme') === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
        
        updateButtonIcon();
        
        // 滚动显示/隐藏
        let lastScroll = 0;
        window.addEventListener('scroll', function() {
            const scrollY = window.pageYOffset;
            
            if (scrollY > 100) {
                button.classList.add('visible');
            } else {
                button.classList.remove('visible');
            }
            
            lastScroll = scrollY;
        });
    }
    
    function updateButtonIcon() {
        const button = document.querySelector('.dark-mode-toggle');
        if (!button) return;
        
        const isDark = document.documentElement.hasAttribute('data-theme');
        button.innerHTML = isDark ? `
            <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5" fill="none" stroke="white" stroke-width="2"/>
                <line x1="12" y1="1" x2="12" y2="3" stroke="white" stroke-width="2"/>
                <line x1="12" y1="21" x2="12" y2="23" stroke="white" stroke-width="2"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="white" stroke-width="2"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="white" stroke-width="2"/>
                <line x1="1" y1="12" x2="3" y2="12" stroke="white" stroke-width="2"/>
                <line x1="21" y1="12" x2="23" y2="12" stroke="white" stroke-width="2"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="white" stroke-width="2"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="white" stroke-width="2"/>
            </svg>
        ` : `
            <svg viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
        `;
    }
    
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'theme-toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.remove(), 2000);
    }
    
    // ========================================
    // 代码块复制功能
    // ========================================
    
    function addCodeCopyButtons() {
        document.querySelectorAll('pre').forEach(pre => {
            const button = document.createElement('button');
            button.className = 'code-copy-btn';
            button.textContent = '复制';
            
            button.addEventListener('click', function() {
                const code = pre.querySelector('code');
                const text = code ? code.textContent : pre.textContent;
                
                navigator.clipboard.writeText(text).then(() => {
                    button.textContent = '已复制!';
                    setTimeout(() => {
                        button.textContent = '复制';
                    }, 2000);
                });
            });
            
            pre.style.position = 'relative';
            pre.appendChild(button);
        });
    }
    
    // ========================================
    // 滚动显示动画
    // ========================================
    
    function initScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, {
            threshold: 0.1
        });
        
        document.querySelectorAll('.card, .widget').forEach(el => {
            el.classList.add('scroll-reveal');
            observer.observe(el);
        });
    }
    
    // ========================================
    // 初始化
    // ========================================
    
    function init() {
        initDarkModeToggle();
        addCodeCopyButtons();
        initScrollReveal();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
