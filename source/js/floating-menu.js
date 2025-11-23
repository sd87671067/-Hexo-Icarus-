/**
 * 左上角浮动菜单
 */
(function() {
    'use strict';
    
    let menuBtn = null;
    let menu = null;
    let isMenuOpen = false;
    let lastScrollY = 0;
    let scrollTimeout = null;
    
    // 创建菜单按钮
    function createMenuButton() {
        menuBtn = document.createElement('button');
        menuBtn.className = 'floating-menu-btn';
        menuBtn.innerHTML = `
            <svg viewBox="0 0 24 24">
                <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
        `;
        
        menuBtn.addEventListener('click', toggleMenu);
        document.body.appendChild(menuBtn);
    }
    
    // 创建菜单
    function createMenu() {
        menu = document.createElement('div');
        menu.className = 'floating-menu';
        menu.innerHTML = `
            <a href="/" class="floating-menu-item">
                <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                首页
            </a>
            <a href="/archives" class="floating-menu-item">
                <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>
                归档
            </a>
            <a href="/categories" class="floating-menu-item">
                <svg viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                分类
            </a>
            <a href="/tags" class="floating-menu-item">
                <svg viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/></svg>
                标签
            </a>
            <div class="floating-menu-divider"></div>
            <a href="/about" class="floating-menu-item">
                <svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/></svg>
                关于
            </a>
        `;
        
        document.body.appendChild(menu);
        
        // 点击菜单外关闭
        document.addEventListener('click', function(e) {
            if (!menu.contains(e.target) && !menuBtn.contains(e.target)) {
                closeMenu();
            }
        });
    }
    
    // 切换菜单
    function toggleMenu() {
        if (isMenuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }
    
    // 打开菜单
    function openMenu() {
        isMenuOpen = true;
        menu.classList.add('active');
        menuBtn.classList.add('active');
        menuBtn.innerHTML = `
            <svg viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
        `;
    }
    
    // 关闭菜单
    function closeMenu() {
        isMenuOpen = false;
        menu.classList.remove('active');
        menuBtn.classList.remove('active');
        menuBtn.innerHTML = `
            <svg viewBox="0 0 24 24">
                <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
        `;
    }
    
    // 处理滚动
    function handleScroll() {
        const currentScrollY = window.pageYOffset;
        
        clearTimeout(scrollTimeout);
        
        // 向下滚动时隐藏
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            menuBtn.classList.add('hidden');
            closeMenu();
        } 
        // 向上滚动或到顶部时显示
        else {
            menuBtn.classList.remove('hidden');
        }
        
        lastScrollY = currentScrollY;
    }
    
    // 初始化
    function init() {
        createMenuButton();
        createMenu();
        
        // 监听滚动
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        console.log('[FloatingMenu] 浮动菜单已初始化');
    }
    
    // DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
