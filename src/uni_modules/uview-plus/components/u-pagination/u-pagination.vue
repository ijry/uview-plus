<template>
  <view class="u-pagination">
    <!-- 上一页按钮 -->
    <view
      :class="[
        'u-pagination-btn',
        { disabled: currentPage === 1 }
      ]"
      :style="{ backgroundColor: buttonBgColor, borderColor: buttonBorderColor }"
      @click="prev"
    >
      <template v-if="prevText">
        {{ prevText }}
      </template>
      <up-icon v-else name="arrow-left"></up-icon>
    </view>

    <!-- 页码列表 -->
    <block v-for="page in displayedPages" :key="page" v-if="layout.includes('pager')">
      <view
        :class="[
          'u-pagination-item',
          { active: page === currentPage }
        ]"
        @click="goTo(page)"
      >
        {{ page }}
      </view>
    </block>

    <!-- 总数显示 -->
    <view v-if="total > 0 && layout.includes('total')" class="u-pagination-total">
        {{ currentPage }} / {{ totalPages }}
    </view>

    <!-- 每页数量选择器 -->
    <!-- <picker
      v-if="layout.includes('sizes')"
      mode="selector"
      :range="pageSizes"
      range-key="label"
      :value="pageSizeIndex"
      @change="handleSizeChange"
      class="u-pagination-sizes"
    >
      <view>{{ pageSizeLabel }}</view>
    </picker> -->

    <!-- 下一页按钮 -->
    <view
      :class="[
        'u-pagination-btn',
        { disabled: currentPage === totalPages }
      ]"
      :style="{ backgroundColor: buttonBgColor, borderColor: buttonBorderColor }"
      @click="next"
    >
      <template v-if="nextText">
        {{ nextText }}
      </template>
      <up-icon v-else name="arrow-right"></up-icon>
    </view>

    <!-- 跳转输入框 -->
    <!-- <view v-if="layout.includes('jumper')">
      <text>前往</text>
      <input
        type="number"
        class="u-pagination-jumper"
        :value="currentPageInput"
        @input="onInputPage"
        @confirm="onConfirmPage"
      />
      <text>页</text>
    </view> -->
  </view>
</template>

<script>
import { t } from '../../libs/i18n'
export default {
  name: 'u-pagination',
  props: {
    // 当前页码
    currentPage: {
      type: Number,
      default: 1
    },
    // 每页条目数
    pageSize: {
      type: Number,
      default: 10
    },
    // 总数据条目数
    total: {
      type: Number,
      default: 0
    },
    // 上一页按钮文案
    prevText: {
      type: String,
      default: ''
    },
    // 下一页按钮文案
    nextText: {
      type: String,
      default: ''
    },
    buttonBgColor: {
      type: String,
      default: '#f5f7fa'
    },
    buttonBorderColor: {
      type: String,
      default: '#dcdfe6'
    },
    // 可选的每页条目数
    pageSizes: {
      type: Array,
      default: () => [10, 20, 30, 40, 50]
    },
    // 布局方式（类似 el-pagination）
    layout: {
      type: String,
      default: 'prev, pager, next'
    },
    // 是否隐藏只有一个页面时的分页控件
    hideOnSinglePage: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:currentPage', 'update:pageSize', 'current-change', 'size-change'],
  data() {
    return {
      currentPageInput: this.currentPage + ''
    };
  },
  computed: {
    totalPages() {
      return Math.max(1, Math.ceil(this.total / this.pageSize));
    },
    pageSizeIndex() {
      const index = this.pageSizes.findIndex(size => size.value === this.pageSize);
      return index >= 0 ? index : 0;
    },
    pageSizeLabel() {
      const found = this.pageSizes.find(size => size.value === this.pageSize);
      return found?.label || this.pageSize;
    },
    displayedPages() {
        const total = this.totalPages;
        const current = this.currentPage;

        if (total <= 4) {
            return Array.from({ length: total }, (_, i) => i + 1);
        }

        const pages = [];

        // 当前页靠近头部
        if (current <= 2) {
            for (let i = 1; i <= 4; i++) {
            pages.push(i);
            }
            pages.push('...');
            pages.push(total);
        }
        // 当前页在尾部附近
        else if (current >= total - 1) {
            pages.push(1);
            pages.push('...');
            for (let i = total - 3; i <= total; i++) {
            pages.push(i);
            }
        }
        // 中间情况
        else {
            pages.push(1);
            pages.push('...');
            pages.push(current - 1);
            pages.push(current);
            pages.push(current + 1);
            pages.push('...');
            pages.push(total);
        }

        return pages;
    }
    // 控制是否隐藏
  },
  watch: {
    currentPage(val) {
      this.currentPageInput = val + '';
    }
  },
  methods: {
    t,
    handleSizeChange(e) {
      const selected = e.detail.value;
      const size = this.pageSizes[selected]?.value || this.pageSizes[0].value;
      this.$emit('update:pageSize', size);
      this.$emit('size-change', size);
    },
    prev() {
      if (this.currentPage > 1) {
        this.goTo(this.currentPage - 1);
      }
    },
    next() {
      if (this.currentPage < this.totalPages) {
        this.goTo(this.currentPage + 1);
      }
    },
    goTo(page) {
      if (page === '...' || page === this.currentPage) return;
      this.$emit('update:currentPage', page);
      this.$emit('current-change', page);
    },
    onInputPage(e) {
      this.currentPageInput = e.detail.value;
    },
    onConfirmPage(e) {
      const num = parseInt(e.detail.value);
      if (!isNaN(num) && num >= 1 && num <= this.totalPages) {
        this.goTo(num);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.u-pagination {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  font-size: 14px;
  color: #606266;

  .u-pagination-total {
    margin-right: 10px;
  }

  .u-pagination-sizes {
    margin-right: 10px;
    padding: 4px 4px;
    border: 1rpx solid #dcdfe6;
    border-radius: 4px;
  }

  .u-pagination-btn {
    margin: 0 3px;
    padding: 4px 4px;
    border: 1rpx solid #dcdfe6;
    border-radius: 4px;
    background-color: #f5f7fa;
    &.disabled {
      opacity: 0.5;
    }
  }

  .u-pagination-item {
    margin: 0 2px;
    padding: 4px 8px;
    border-radius: 4px;
    &.active {
      background-color: #409eff;
      color: white;
    }
  }

  .u-pagination-jumper {
    width: 40px;
    height: 28px;
    margin: 0 5px;
    padding: 0 5px;
    border: 1rpx solid #dcdfe6;
    border-radius: 4px;
    font-size: 14px;
  }
}
</style>
