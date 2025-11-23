const { Component } = require('inferno');

module.exports = class extends Component {
    render() {
        const { config, helper, page } = this.props;
        const { url_for, cdn, fontcdn, iconcdn } = helper;
        const { favicon } = config;

        return <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>{page.title ? `${page.title} - ${config.title}` : config.title}</title>
            
            {favicon ? <link rel="icon" href={url_for(favicon)} /> : null}
            
            <link rel="stylesheet" href={fontcdn('Ubuntu:wght@400;600&family=Source+Code+Pro', 'css2')} />
            <link rel="stylesheet" href={iconcdn()} />
            <link rel="stylesheet" href={cdn('bulma', '0.9.3', 'css/bulma.min.css')} />
            <link rel="stylesheet" href={url_for('/css/default.css')} />
            <link rel="stylesheet" href={url_for('/css/style.css')} />
            
            {/* 稳定版本核心样式 */}
            <link rel="stylesheet" href={url_for('/css/stable-version.css')} />
            <link rel="stylesheet" href={url_for('/css/dark-mode-enhanced.css')} />
            <link rel="stylesheet" href={url_for('/css/add-two-icons.css')} />
            
            {/* 导航栏优化 */}
            <link rel="stylesheet" href={url_for('/css/navbar-optimize.css')} />
            <link rel="stylesheet" href={url_for('/css/dark-mode-global.css')} />
            
            {/* 按钮样式 - 使用新的同步动画 */}
            <link rel="stylesheet" href={url_for('/css/buttons-sync-animation.css')} />
            
            {/* 基础功能样式 */}
            <link rel="stylesheet" href={url_for('/css/footer-card-style.css')} />
            <link rel="stylesheet" href={url_for('/css/code-copy-enhanced.css')} />
            
            {/* JavaScript - 使用新的同步脚本 */}
            <script src={url_for('/js/navbar-dark-enhance.js')}></script>
            <script src={url_for('/js/buttons-sync-fixed.js')}></script>
            <script src={url_for('/js/create-social-card.js')} defer></script>
            <script src={url_for('/js/code-copy-enhanced.js')} defer></script>
            <script src={url_for('/js/dark-mode-fix.js')} defer></script>
        </head>;
    }
};
