<template>
  <view class="up-nvue-root" :style="rootStyle">
    <slot />
  </view>
</template>

<script>
import { applyNativeThemeUI, getThemePageStyle, syncThemeRuntimeFromStorage } from '../theme/runtime.js'

export default {
  name: 'UpNvueRoot',
  data() {
    return {
      rootStyle: getThemePageStyle()
    }
  },
  created() {
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
    refreshRootStyle() {
      syncThemeRuntimeFromStorage()
      this.rootStyle = {
        ...getThemePageStyle(),
        flex: 1,
        width: '750rpx',
        height: '100%',
        minHeight: '100%'
      }
      applyNativeThemeUI()
    }
  }
}
</script>

<style>
.up-nvue-root {
    flex: 1;
    width: 750rpx;
}
</style>
