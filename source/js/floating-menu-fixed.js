/**
 * 浮动菜单 - 修复版
 */
(function() {
    'use strict';
    
    let menuBtn = null;
    let menu = null;
    let isMenuOpen = false;
    let lastScrollY = 0;
    let isScrolling = false;
    
    // 创建菜单按钮
    function createMenuButton() {
        // 移除旧按钮
        const oldBtn = document.querySelector('.floating-menu-btn');
        if (oldBtn) oldBtn.remove();
        
        menuBtn = document.createElement('button');
        menuBtn.className = 'floating-menu-btn';
        menuBtn.setAttribute('type', 'button');
        menuBtn.setAttribute('aria-label', '打开菜单');
        menuBtn.style.cssText = 'pointer-events: auto !important; cursor: pointer !important;';
        menuBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
        `;
        
        // 使用多种事件确保响应
        menuBtn.addEventListener('click', handleButtonClick, true);
        menuBtn.addEventListener('touchstart', handleButtonClick, { passive: false });
        
        document.body.appendChild(menuBtn);
        console.log('[Menu] 按钮已创建');
    }
    
    // 处理按钮点击
    function handleButtonClick(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('[Menu] 按钮被点击');
        toggleMenu();
    }
    
    // 创建菜单
    function createMenu() {
        // 移除旧菜单
        const oldMenu = document.querySelector('.floating-menu');
        if (oldMenu) oldMenu.remove();
        
        menu = document.createElement('div');
        menu.className = 'floating-menu';
        menu.innerHTML = `
            <a href="/" class="floating-menu-item">
                <svg viewBox="0 0 24 24" width="18" height="18">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="currentColor"/>
                </svg>
                首页
            </a>
            <a href="/archives" class="floating-menu-item">
                <svg viewBox="0 0 24 24" width="18" height="18">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="currentColor"/>
                </svg>
                归档
            </a>
            <a href="/categories" class="floating-menu-item">
                <svg viewBox="0 0 24 24" width="18" height="18">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" fill="currentColor"/>
                </svg>
                分类
            </a>
            <a href="/tags" class="floating-menu-item">
                <svg viewBox="0 0 24 24" width="18" height="18">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" fill="currentColor"/>
                </svg>
                标签
            </a>
            <div class="floating-menu-divider"></div>
            <a href="/about" class="floating-menu-item">
                <svg viewBox="0 0 24 24" width="18" height="18">
                    <circle cx="12" cy="12" r="4" fill="currentColor"/>
                    <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" fill="currentColor"/>
                </svg>
                关于
            </a>
        `;
        
        document.body.appendChild(menu);
        
        // 点击外部关闭菜单
        setTimeout(() => {
            document.addEventListener('click', handleOutsideClick, true);
        }, 100);
    }
    
    // 处理外部点击
    function handleOutsideClick(e) {
        if (menu && menuBtn && !menu.contains(e.target) && !menuBtn.contains(e.target)) {
            closeMenu();
        }
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
        if (!menu) return;
        
        isMenuOpen = true;
        menu.classList.add('active');
        menuBtn.classList.add('active');
        menuBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
        `;
        console.log('[Menu] 菜单已打开');
    }
    
    // 关闭菜单
    function closeMenu() {
        if (!menu) return;
        
        isMenuOpen = false;
        menu.classList.remove('active');
        menuBtn.classList.remove('active');
        menuBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
        `;
        console.log('[Menu] 菜单已关闭');
    }
    
    // 处理滚动（优化版）
    function handleScroll() {
        if (isScrolling) return;
        
        isScrolling = true;
        requestAnimationFrame(() => {
            const currentScrollY = window.pageYOffset;
            
            // 只在滚动距离大于50px时判断方向
            if (Math.abs(currentScrollY - lastScrollY) > 50) {
                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    // 向下滚动
                    menuBtn.classList.add('hidden');
                    closeMenu();
                } else {
                    // 向上滚动或接近顶部
                    menuBtn.classList.remove('hidden');
                }
                lastScrollY = currentScrollY;
            }
            
            isScrolling = false;
        });
    }
    
    // 初始化
    function init() {
        console.log('[Menu] 开始初始化');
        
        createMenuButton();
        createMenu();
        
        // 优化滚动监听
        let scrollTimer = null;
        window.addEventListener('scroll', function() {
            if (scrollTimer) clearTimeout(scrollTimer);
            scrollTimer = setTimeout(handleScroll, 10);
        }, { passive: true });
        
        console.log('[Menu] 初始化完成');
    }
    
    // 确保DOM加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 100);
    }
})();
