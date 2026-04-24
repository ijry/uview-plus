<template>
  <view class="up-nvue-root" :style="rootStyle">
    <slot />
  </view>
</template>

<script>
import { applyNativeThemeUI, getThemePageStyle, getThemeVarsForStyle, syncThemeRuntimeFromStorage } from '../theme/runtime.js'

export default {
  name: 'UpNvueRoot',
  data() {
    return {
      rootStyle: {
        ...getThemeVarsForStyle(),
        ...getThemePageStyle()
      },
      minPageHeight: '0px'
    }
  },
  created() {
    this.syncPageHeight()
    this.refreshRootStyle()
    this.themeChangeHandler = () => {
      this.refreshRootStyle()
    }
    if (typeof uni !== 'undefined' && typeof uni.$on === 'function') {
      uni.$on('uThemeChange', this.themeChangeHandler)
    }
  },
  mounted() {
    this.refreshRootStyle()
  },
  beforeUnmount() {
    if (this.themeChangeHandler && typeof uni !== 'undefined' && typeof uni.$off === 'function') {
      uni.$off('uThemeChange', this.themeChangeHandler)
    }
    this.themeChangeHandler = null
  },
  methods: {
    syncPageHeight() {
      let windowHeight = 0
      try {
        if (typeof uni !== 'undefined' && typeof uni.getWindowInfo === 'function') {
          windowHeight = Number((uni.getWindowInfo() || {}).windowHeight || 0)
        } else if (typeof uni !== 'undefined' && typeof uni.getSystemInfoSync === 'function') {
          windowHeight = Number((uni.getSystemInfoSync() || {}).windowHeight || 0)
        }
      } catch (e) {
        windowHeight = 0
      }
      this.minPageHeight = `${windowHeight || 0}px`
    },
    refreshRootStyle() {
      syncThemeRuntimeFromStorage()
      this.rootStyle = {
        ...getThemeVarsForStyle(),
        ...getThemePageStyle(),
        minHeight: this.minPageHeight,
        width: '750rpx'
      }
      applyNativeThemeUI()
    }
  }
}
</script>

<style>
.up-nvue-root {
    width: 750rpx;
}
</style>
