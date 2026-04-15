export default {
    data() {
        return {
			isWeixin: true,
			__globalThemeChangeHandler: null
        }
    },
    onLoad() {
        if (typeof uni !== 'undefined' && typeof uni.$on === 'function') {
            this.__globalThemeChangeHandler = () => {
                this.__applyNativeThemeUI()
            }
            uni.$on('uThemeChange', this.__globalThemeChangeHandler)
        }
    },
    onShow() {
        this.__applyNativeThemeUI()
    },
    onUnload() {
        if (typeof uni !== 'undefined' && typeof uni.$off === 'function' && this.__globalThemeChangeHandler) {
            uni.$off('uThemeChange', this.__globalThemeChangeHandler)
            this.__globalThemeChangeHandler = null
        }
    },
    methods: {
        __isDarkMode() {
            return (uni.$u && uni.$u.theme && uni.$u.theme.mode) === 'dark'
        },
        __applyNativeThemeUI() {
            const isDark = this.__isDarkMode()
            const pageBg = (uni.$u && uni.$u.color && uni.$u.color.bgColor) || (isDark ? '#1f1f1f' : '#f3f4f6')
            const navBg = pageBg
            if (typeof uni.setNavigationBarColor === 'function') {
                uni.setNavigationBarColor({
                    frontColor: isDark ? '#ffffff' : '#000000',
                    backgroundColor: navBg,
                    animation: {
                        duration: 0,
                        timingFunc: 'linear'
                    }
                })
            }
            if (typeof uni.setBackgroundColor === 'function') {
                uni.setBackgroundColor({
                    backgroundColor: pageBg,
                    backgroundColorTop: pageBg,
                    backgroundColorBottom: pageBg
                })
            }
        }
    }
}
