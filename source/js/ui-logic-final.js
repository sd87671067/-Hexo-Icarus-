/**
 * UI 逻辑：
 * 1. 汉堡菜单控制
 * 2. 浮动按钮生成与滚动隐藏
 */
(function() {
    'use strict';

    // === 1. 导航栏逻辑 ===
    function initNavbar() {
        const burger = document.querySelector('.navbar-burger');
        if (!burger) return;

        // 确保菜单结构存在
        let menu = document.querySelector('.navbar-menu');
        if (!menu) {
            // 如果菜单丢失，重建它
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                menu = document.createElement('div');
                menu.className = 'navbar-menu';
                menu.innerHTML = `
                    <a class="navbar-item" href="/">
                        <i class="fas fa-home"></i> 主页
                    </a>
                    <a class="navbar-item" href="/categories">
                        <i class="fas fa-folder"></i> 分类
                    </a>
                    <a class="navbar-item" href="/archives">
                        <i class="fas fa-archive"></i> 文章
                    </a>
                    <a class="navbar-item" href="https://github.com/sd87671067" target="_blank">
                        <i class="fab fa-github"></i> GitHub
                    </a>
                `;
                navbar.appendChild(menu);
            }
        }

        // 绑定点击事件 (克隆以移除旧事件)
        const newBurger = burger.cloneNode(true);
        burger.parentNode.replaceChild(newBurger, burger);
        
        newBurger.addEventListener('click', function(e) {
            e.stopPropagation();
            newBurger.classList.toggle('is-active');
            if(menu) menu.classList.toggle('is-active');
        });

        // 点击外部关闭
        document.addEventListener('click', function(e) {
            if (menu && newBurger && !newBurger.contains(e.target) && !menu.contains(e.target)) {
                newBurger.classList.remove('is-active');
                menu.classList.remove('is-active');
            }
        });
    }

    // === 2. 浮动按钮逻辑 (生成 + 滚动隐藏) ===
    function initFloatingButtons() {
        // 移除旧的按钮 (防止重复)
        const oldContainer = document.querySelector('.floating-buttons-container');
        if (oldContainer) oldContainer.remove();
        const oldBack = document.getElementById('back-to-top');
        if (oldBack && oldBack.parentNode !== document.body) oldBack.remove(); // 移除其他位置的

        // 创建容器
        const container = document.createElement('div');
        container.className = 'floating-buttons-container';

        // 创建回到顶部按钮
        const backBtn = document.createElement('button');
        backBtn.className = 'float-btn';
        backBtn.title = '回到顶部';
        backBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
        backBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

        // 创建夜间模式按钮 (模拟主题切换逻辑)
        const darkBtn = document.createElement('button');
        darkBtn.className = 'float-btn dark-mode-toggle';
        darkBtn.title = '切换主题';
        darkBtn.innerHTML = '<i class="fas fa-adjust"></i>'; // 使用通用图标，CSS会自动处理颜色
        
        // 绑定夜间模式切换 (尝试调用主题自带逻辑)
        darkBtn.onclick = () => {
            // 触发主题自带的切换器 (如果存在)
            const nativeToggle = document.querySelector('.navbar-item.is-night-mode, #night-mode-toggle');
            if (nativeToggle) {
                nativeToggle.click(); 
            } else {
                // 简单的 fallback 逻辑
                if (document.body.getAttribute('data-theme') === 'dark') {
                    document.body.setAttribute('data-theme', 'light');
                    document.documentElement.setAttribute('data-theme', 'light');
                    localStorage.setItem('theme', 'light');
                } else {
                    document.body.setAttribute('data-theme', 'dark');
                    document.documentElement.setAttribute('data-theme', 'dark');
                    localStorage.setItem('theme', 'dark');
                }
            }
        };

        // 组装
        container.appendChild(backBtn);
        container.appendChild(darkBtn);
        document.body.appendChild(container);

        // === 滚动检测逻辑 (滚动时隐藏，停止后显示) ===
        let isScrolling;
        window.addEventListener('scroll', () => {
            // 1. 添加隐藏类
            container.classList.add('is-hidden');

            // 2. 清除旧的定时器
            window.clearTimeout(isScrolling);

            // 3. 设置新的定时器 (200ms 后认为停止滚动)
            isScrolling = setTimeout(() => {
                container.classList.remove('is-hidden');
            }, 200);
        }, { passive: true });
    }

    function init() {
        initNavbar();
        initFloatingButtons();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // 延迟再次执行确保覆盖
    setTimeout(init, 500);
})();
