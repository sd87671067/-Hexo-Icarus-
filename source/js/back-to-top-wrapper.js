/**
 * 将夜间模式按钮和回到顶部按钮放入统一浮动容器
 */
(function () {
    'use strict';

    function setupFloatingButtons() {
        // 找到夜间模式按钮
        const darkSelectors = [
            '.dark-mode-toggle',
            '.dark-mode-button',
            '#dark-mode-toggle'
        ];
        let darkBtn = null;
        for (const sel of darkSelectors) {
            const el = document.querySelector(sel);
            if (el) {
                darkBtn = el;
                break;
            }
        }

        // 找到回到顶部按钮
        const topSelectors = [
            '.back-to-top',
            '.back-top',
            '.backtop',
            '.go-top',
            '.to-top',
            '#back-to-top',
            '#backTop',
            '.scroll-top',
            '.scroll-to-top',
            '.return-top'
        ];
        let topBtn = null;
        for (const sel of topSelectors) {
            const el = document.querySelector(sel);
            if (el) {
                topBtn = el;
                break;
            }
        }

        if (!darkBtn && !topBtn) {
            return;
        }

        // 创建统一容器（如果不存在）
        let wrapper = document.querySelector('.floating-buttons-wrapper');
        if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.className = 'floating-buttons-wrapper';
            document.body.appendChild(wrapper);
        }

        // 将夜间模式按钮和回到顶部按钮移入容器
        if (darkBtn && darkBtn.parentNode !== wrapper) {
            wrapper.appendChild(darkBtn);
        }
        if (topBtn && topBtn.parentNode !== wrapper) {
            wrapper.appendChild(topBtn);
        }

        // 确保回到顶部按钮排在上方（wrapper 是 column-reverse，所以顺序为：下->上）
        const children = Array.from(wrapper.children);
        if (darkBtn && topBtn) {
            // 想要 “上：回到顶部，下：夜间按钮”
            // column-reverse 中，DOM 顺序为 [下方, 上方]
            if (children[0] !== darkBtn) {
                wrapper.innerHTML = '';
                wrapper.appendChild(darkBtn); // 下
                wrapper.appendChild(topBtn);  // 上
            }
        }

        // 如果没有现成的回到顶部按钮，可以自动创建一个
        if (!topBtn && darkBtn) {
            const newTop = document.createElement('button');
            newTop.className = 'back-to-top';
            newTop.innerHTML = '↑';
            newTop.setAttribute('aria-label', 'Back to top');
            newTop.addEventListener('click', function () {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            wrapper.appendChild(newTop);
        }

        console.log('[UI] Floating buttons set up');
    }

    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupFloatingButtons);
        } else {
            setupFloatingButtons();
        }
        // 防止 SPA 或懒加载漏掉
        setTimeout(setupFloatingButtons, 800);
    }

    init();
})();
