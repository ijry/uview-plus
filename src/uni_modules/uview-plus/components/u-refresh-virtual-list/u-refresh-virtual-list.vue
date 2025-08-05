<template>
  <u-pull-refresh
    :refreshing="refreshing"
    :threshold="50"
    @refresh="handleRefresh"
  >
    <u-virtual-list
      ref="virtualList"
      :list-data="listData"
      :item-height="itemHeight"
      :height="height"
      :buffer="buffer"
      :key-field="keyField"
      :scroll-top="scrollTop"
      @scroll="handleScroll"
    >
      <template #default="{ item, index }">
        <slot :item="item" :index="index"></slot>
      </template>
    </u-virtual-list>
  </u-pull-refresh>
</template>

<script>

export default {
  name: 'u-refresh-virtual-list',
  props: {
    // 数据源
    listData: {
      type: Array,
      default: () => []
    },
    // 每项高度（固定高度模式）
    itemHeight: {
      type: Number,
      default: 50
    },
    // 容器高度
    height: {
      type: [String, Number],
      default: '100%'
    },
    // 缓冲区项数
    buffer: {
      type: Number,
      default: 4
    },
    // 索引键名
    keyField: {
      type: String,
      default: 'id'
    }
  },
  data() {
    return {
      refreshing: false,
      scrollTop: 0
    }
  },
  methods: {
    handleRefresh() {
      this.refreshing = true
      this.$emit('refresh')
    },
    
    handleScroll(scrollTop) {
      this.scrollTop = scrollTop
      this.$emit('scroll', scrollTop)
    },
    
    finishRefresh() {
      this.refreshing = false
    },
    
    scrollTo(top) {
      this.scrollTop = top
    },
    
    scrollToTop() {
      this.scrollTo(0)
    }
  }
}
</script>
