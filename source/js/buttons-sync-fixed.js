/**
 * 修复按钮同步显示/隐藏
 */
(function() {
    'use strict';

    function initButtonsSync() {
        const darkBtn = document.querySelector('.dark-mode-toggle');
        const backBtn = document.getElementById('back-to-top');
        
        if (!darkBtn || !backBtn) {
            console.log('[Buttons] 按钮未找到');
            return;
        }
        
        let scrollTimer = null;
        let isScrolling = false;
        
        // 初始化状态
        darkBtn.classList.remove('btn-hidden');
        
        // 初始化回到顶部按钮
        if (window.scrollY <= 300) {
            backBtn.style.display = 'none';
            backBtn.classList.remove('btn-hidden');
        } else {
            backBtn.style.display = 'flex';
            backBtn.classList.remove('btn-hidden');
        }
        
        // 滚动事件处理
        window.addEventListener('scroll', function() {
            const scrollY = window.scrollY;
            
            // 控制回到顶部按钮的基础显示状态
            if (scrollY > 300) {
                if (backBtn.style.display === 'none') {
                    backBtn.style.display = 'flex';
                    // 稍微延迟添加动画类，确保display生效
                    setTimeout(() => {
                        backBtn.classList.remove('btn-hidden');
                    }, 10);
                }
            } else {
                // 页面顶部，隐藏回到顶部按钮
                backBtn.classList.add('btn-hidden');
                setTimeout(() => {
                    if (window.scrollY <= 300) {
                        backBtn.style.display = 'none';
                    }
                }, 300);
            }
            
            // 滚动时同步隐藏两个按钮
            if (!isScrolling) {
                isScrolling = true;
                
                // 隐藏夜间模式按钮
                darkBtn.classList.add('btn-hidden');
                
                // 如果回到顶部按钮可见，也隐藏它
                if (backBtn.style.display !== 'none') {
                    backBtn.classList.add('btn-hidden');
                }
            }
            
            // 清除之前的定时器
            clearTimeout(scrollTimer);
            
            // 停止滚动后同步显示
            scrollTimer = setTimeout(function() {
                isScrolling = false;
                
                // 同时显示两个按钮
                darkBtn.classList.remove('btn-hidden');
                
                // 只有当回到顶部按钮应该显示时才移除隐藏类
                if (backBtn.style.display !== 'none') {
                    backBtn.classList.remove('btn-hidden');
                }
                
                console.log('[Buttons] 按钮显示 - 夜间:', !darkBtn.classList.contains('btn-hidden'), 
                           '回顶:', backBtn.style.display !== 'none');
            }, 600); // 停止滚动600ms后显示
        });
        
        // 回到顶部功能
        backBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        console.log('[Buttons] 同步控制已初始化');
    }
    
    // 初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initButtonsSync);
    } else {
        initButtonsSync();
    }
    
    // 延迟再次执行，确保元素存在
    setTimeout(initButtonsSync, 500);
})();
