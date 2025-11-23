/**
 * 精确删除头像和定位信息
 */
(function() {
    'use strict';
    
    function hideSpecificElements() {
        // 只删除头像图片
        document.querySelectorAll('.media-left img, img.avatar, img[src*="avatar"]').forEach(img => {
            img.style.display = 'none';
        });
        
        // 只删除空的media-left容器
        document.querySelectorAll('.media-left').forEach(container => {
            if (!container.querySelector('img')) {
                container.style.display = 'none';
            }
        });
        
        // 只删除包含"China"的定位信息段落
        document.querySelectorAll('.card-content p').forEach(p => {
            const text = p.textContent || '';
            if (text.includes('China') && (text.length < 50 || p.querySelector('.fa-map-marker'))) {
                p.style.display = 'none';
            }
        });
        
        // 只删除"简单就好"
        document.querySelectorAll('.card-content p').forEach(p => {
            if (p.textContent && p.textContent.trim() === '简单就好') {
                p.style.display = 'none';
            }
        });
        
        console.log('[Hide] 已隐藏指定元素');
    }
    
    // 初始化
    function init() {
        hideSpecificElements();
        setTimeout(hideSpecificElements, 500);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
