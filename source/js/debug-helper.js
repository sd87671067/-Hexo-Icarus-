/**
 * 调试助手
 */
console.log('=== 页面加载信息 ===');
console.log('当前URL:', window.location.href);
console.log('当前主题:', localStorage.getItem('site-theme-preference') || 'auto');
console.log('是否夜间模式:', document.documentElement.hasAttribute('data-theme'));

// 监听按钮点击
document.addEventListener('click', function(e) {
    if (e.target.closest('.dark-mode-toggle')) {
        console.log('按钮被点击');
    }
});

// 检查元素
setTimeout(() => {
    const button = document.querySelector('.dark-mode-toggle');
    if (button) {
        console.log('找到夜间模式按钮');
        console.log('按钮可见性:', button.classList.contains('visible'));
    } else {
        console.log('未找到夜间模式按钮');
    }
    
    const cards = document.querySelectorAll('.card, .widget, article');
    console.log('找到卡片数量:', cards.length);
}, 1000);
