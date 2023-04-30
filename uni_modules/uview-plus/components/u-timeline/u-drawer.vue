
<template>
  <view  v-show="visible">
    <view
      class="u-drawer__overlay"
      :style="{ zIndex: zIndex }"
      @click.stop="handleOverlayClick"
    >
    </view>
    <view
      class="u-drawer"
      :class="{
        'u-drawer--left': placement === 'left',
        'u-drawer--right': placement === 'right'
      }"
      :style="{ zIndex: zIndex + 1, width: width, [placement]: `-${translate}` }"
      @transitionend="handleTransitionEnd"
    >
      <view class="u-drawer__content">
        <slot></slot>
      </view>
    </view>
  </view>
</template>
<script>
import props from './props.js'
export default {
  name: 'u-drawer',
  mixins: [props],
  // props: {
  //   // 
  //   visible: {
  //     type: Boolean,
  //     default: false,
  //   },
  //   mask: {
  //     type: Boolean,
  //     default: true,
  //   },
  //   width: {
  //     type: Number,
  //     default: 300,
  //   },
  //   placement: {
  //     type: String,
  //     default: 'left',
  //     validator: (value) => ['left', 'right'].includes(value),
  //   },
  //   // transition: {
  //   //   type: String,
  //   //   default: 'u-slide-down',
  //   // },
  //   zIndex: {
  //     type: Number,
  //     default: 100,
  //   },
  // },
  data() {
    return {
      translate: 0,
    };
  },
  watch: {
    show: {
      immediate: true,
      handler(value) {
        if (value) {
          this.openDrawer();
        } else {
          this.closeDrawer();
        }
      },
    },
  },
  methods: {
    openDrawer() {
      this.$emit('open');
      this.translate = this.width;
    },
    closeDrawer() {
      this.$emit('close');
      this.translate = 0;
    },
    handleOverlayClick() {
      // console.log('this.mask',this.mask)
      if (this.mask) {
        this.$emit('update:visible', false);
      }
    },
    handleTransitionEnd() {
      if (!this.visible) {
        this.translate = 0;
      }
    },
  },
};
</script>
<style scoped>
.u-drawer {
  position: fixed;
  top: 0;
  bottom: 0;
  background-color: #fff;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.u-drawer--left {
  left: 0;
}

.u-drawer--right {
  right: 0;
}

.u-drawer__content {
  height: 100%;
  overflow-y: auto;
}

.u-drawer__overlay {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>