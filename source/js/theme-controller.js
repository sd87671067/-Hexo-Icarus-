/**
 * 主题控制器 - 夜间模式和动画
 */
(function() {
    'use strict';
    
    console.log('主题控制器开始初始化...');
    
    // ========================================
    // 夜间模式功能
    // ========================================
    
    const THEME_KEY = 'site-theme-preference';
    let button = null;
    
    // 获取当前主题
    function getCurrentTheme() {
        return localStorage.getItem(THEME_KEY) || 'auto';
    }
    
    // 应用主题
    function applyTheme(theme) {
        const root = document.documentElement;
        console.log('应用主题:', theme);
        
        if (theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
        } else if (theme === 'light') {
            root.removeAttribute('data-theme');
        } else if (theme === 'auto') {
            const hour = new Date().getHours();
            const isDark = hour >= 18 || hour < 6;
            if (isDark) {
                root.setAttribute('data-theme', 'dark');
            } else {
                root.removeAttribute('data-theme');
            }
        }
        
        updateButtonIcon();
    }
    
    // 切换主题
    function toggleTheme() {
        const current = getCurrentTheme();
        let next;
        
        switch(current) {
            case 'auto':
                next = 'light';
                break;
            case 'light':
                next = 'dark';
                break;
            case 'dark':
            default:
                next = 'auto';
                break;
        }
        
        console.log('切换主题: ' + current + ' -> ' + next);
        localStorage.setItem(THEME_KEY, next);
        applyTheme(next);
        
        // 显示提示
        const messages = {
            'dark': '🌙 夜间模式',
            'light': '☀️ 日间模式',
            'auto': '🔄 自动模式'
        };
        showToast(messages[next]);
    }
    
    // 更新按钮图标
    function updateButtonIcon() {
        if (!button) return;
        
        const isDark = document.documentElement.hasAttribute('data-theme');
        
        if (isDark) {
            // 月亮图标
            button.innerHTML = `
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
            `;
        } else {
            // 太阳图标
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
    
    // 创建切换按钮
    function createToggleButton() {
        // 移除旧按钮
        const oldButton = document.querySelector('.dark-mode-toggle');
        if (oldButton) {
            oldButton.remove();
        }
        
        button = document.createElement('button');
        button.className = 'dark-mode-toggle';
        button.setAttribute('aria-label', '切换主题');
        button.setAttribute('type', 'button');
        
        // 点击事件
        button.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleTheme();
        };
        
        document.body.appendChild(button);
        updateButtonIcon();
        
        // 设置滚动显示
        setupScrollVisibility();
        
        console.log('夜间模式按钮已创建');
    }
    
    // 滚动显示控制
    function setupScrollVisibility() {
        let scrollTimeout;
        
        function checkScroll() {
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollY > 100) {
                button.classList.add('visible');
            } else {
                button.classList.remove('visible');
            }
        }
        
        window.addEventListener('scroll', function() {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(checkScroll, 10);
        });
        
        // 初始检查
        checkScroll();
    }
    
    // 显示提示
    function showToast(message) {
        const existing = document.querySelector('.theme-toast');
        if (existing) {
            existing.remove();
        }
        
        const toast = document.createElement('div');
        toast.className = 'theme-toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 2000);
    }
    
    // ========================================
    // 动画功能
    // ========================================
    
    // 初始化卡片动画
    function initCardAnimations() {
        // 为所有卡片添加索引
        const cards = document.querySelectorAll('.card, .widget, article');
        cards.forEach((card, index) => {
            card.style.setProperty('--card-index', index + 1);
        });
    }
    
    // 滚动动画
    function initScrollReveal() {
        const elements = document.querySelectorAll('.card, .widget, article, .media');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        elements.forEach(el => {
            if (el.getBoundingClientRect().top > window.innerHeight) {
                el.style.opacity = '0';
                observer.observe(el);
            }
        });
    }
    
    // ========================================
    // 初始化
    // ========================================
    
    function init() {
        console.log('开始初始化主题控制器...');
        
        // 应用保存的主题
        const savedTheme = getCurrentTheme();
        applyTheme(savedTheme);
        
        // 创建按钮
        createToggleButton();
        
        // 初始化动画
        initCardAnimations();
        initScrollReveal();
        
        // 监听动态内容
        const observer = new MutationObserver(() => {
            initCardAnimations();
            initScrollReveal();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('主题控制器初始化完成');
    }
    
    // 确保 DOM 加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM 已加载，延迟执行避免冲突
        setTimeout(init, 100);
    }
})();
