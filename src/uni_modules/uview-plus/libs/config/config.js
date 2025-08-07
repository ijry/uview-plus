const version = '3'

// 开发环境才提示，生产环境不会提示
if (process.env.NODE_ENV === 'development') {
	console.log(`\n %c uview-plus V${version} %c https://ijry.github.io/uview-plus/ \n\n`, 'color: #ffffff; background: #3c9cff; padding:5px 0;', 'color: #3c9cff;background: #ffffff; padding:5px 0;');
}

export default {
    v: version,
    version,
    // 主题名称
    type: [
        'primary',
        'success',
        'info',
        'error',
        'warning'
    ],
    // 颜色部分，本来可以通过scss的:export导出供js使用，但是奈何nvue不支持
    color: {
        'u-primary': '#2979ff',
        'u-warning': '#ff9900',
        'u-success': '#19be6b',
        'u-error': '#fa3534',
        'u-info': '#909399',
        'u-main-color': '#303133',
        'u-content-color': '#606266',
        'u-tips-color': '#909399',
        'u-light-color': '#c0c4cc',
        'up-primary': '#2979ff',
        'up-warning': '#ff9900',
        'up-success': '#19be6b',
        'up-error': '#fa3534',
        'up-info': '#909399',
        'up-main-color': '#303133',
        'up-content-color': '#606266',
        'up-tips-color': '#909399',
        'up-light-color': '#c0c4cc'
    },
    // 字体图标地址
    iconUrl: 'https://at.alicdn.com/t/font_2225171_8kdcwk4po24.ttf',
     // 自定义图标
    customIcon: {
        family: '',
        url: ''
    },
    customIcons: {}, // 自定义图标与unicode对应关系
	// 默认单位，可以通过配置为rpx，那么在用于传入组件大小参数为数值时，就默认为rpx
	unit: 'px',
	// 拦截器
	interceptor: {
		navbarLeftClick: null
	},
    // 只加载一次字体
    loadFontOnce: false
}
