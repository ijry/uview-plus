<style lang="scss" scoped>
.u-table-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 1px solid #ebeef5;
    overflow: hidden;
    position: relative;
}

// 添加border样式支持
.u-table-border {
    border-top: 1px solid #ebeef5;
    border-left: 1px solid #ebeef5;
    border-right: 1px solid #ebeef5;
    .u-table-cell {
        border-right: 1px solid #ebeef5;
    }
    
    .u-table-cell:last-child {
        border-right: none;
    }
}

.u-table-cell {
    flex: 1;
    display: flex;
    flex-direction: row;
    padding: 10px 10px;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.1;
}

.u-table-row-zebra {
    background-color: #fafafa;
}

.u-table-row-highlight {
    background-color: #f5f7fa;
}

.u-table-empty {
    text-align: center;
    padding: 20px;
    color: #999;
}

.u-text-left {
    text-align: left;
}

.u-text-center {
    text-align: center;
}

.u-text-right {
    text-align: right;
}
</style>
<template>
    <view v-for="(row, index) in rows" :key="row[rowKey]" class="u-table-row u-table-row-child u-flex-y"
        style="border-bottom: 0px;">
        <view class="u-table-row u-table-child-first" >
            <view v-for="(col, colIndex) in columns" :key="col.key" 
                class="u-table-cell"
                :class="[col.align ? 'u-text-' + col.align : '',
                    cellClassName ? cellClassName(row, col) : '',
                    getFixedClass(col)
                ]"
                :style="cellStyleInner({row: row, column: col, rowIndex: index, columnIndex: colIndex, level: level})">
                    <!-- 在mainCol列显示展开图标 -->
                    <view v-if="col.key === computedMainCol && hasTree"
                        @click.stop="toggleExpand(row)" :style="{width: expandWidth}">
                        <view v-if="row.children && row.children.length > 0">
                            {{ isExpanded(row) ? '▼' : '▶' }}
                        </view>
                    </view>
                    <slot name="cell" :row="row" :column="col" :prow="parentRow" :rowIndex="index" :columnIndex="colIndex" :level="level">
                        <view class="u-table-cell_content">
                            {{ row[col.key] }}
                        </view>
                    </slot>
            </view>
        </view>
        
        <!-- 递归渲染更深层的子级 -->
        <template v-if="isExpanded(row) && row[treeProps.children] && row[treeProps.children].length">
            <table-row 
                :rows="row[treeProps.children]" 
                :parent-row="row"
                :columns="columns"
                :tree-props="treeProps"
                :row-key="rowKey"
                :expanded-keys="expandedKeys"
                :cell-style-inner="cellStyleInner"
                :is-expanded="isExpanded"
                :row-class-name="rowClassName"
                :stripe="stripe"
                :cell-class-name="cellClassName"
                :get-fixed-class="getFixedClass"
                :highlight-current-row="highlightCurrentRow"
                :current-row="currentRow"
                :handle-row-click="handleRowClick"
                :toggle-expand="toggleExpand"
                :level="level + 1"
                :hasTree="hasTree"
                :expandWidth="expandWidth"
                :computed-main-col="computedMainCol"
                @row-click="$emit('rowClick', $event)"
                @toggle-expand="$emit('toggleExpand', $event)"
            />
        </template>
    </view>
</template>

<script>
export default {
    name: 'tableRow',
    props: {
        rows: {
            type: Array,
            required: true
        },
        parentRow: {
            type: Object,
            required: true
        },
        columns: {
            type: Array,
            required: true
        },
        treeProps: {
            type: Object,
            required: true
        },
        rowKey: {
            type: String,
            required: true
        },
        expandedKeys: {
            type: Array,
            required: true
        },
        cellStyleInner: {
            type: Function,
            required: true
        },
        isExpanded: {
            type: Function,
            required: true
        },
        rowClassName: {
            type: Function,
            default: null
        },
        stripe: {
            type: Boolean,
            default: false
        },
        cellClassName: {
            type: Function,
            default: null
        },
        getFixedClass: {
            type: Function,
            required: true
        },
        highlightCurrentRow: {
            type: Boolean,
            default: false
        },
        currentRow: {
            type: Object,
            default: null
        },
        handleRowClick: {
            type: Function,
            required: true
        },
        toggleExpand: {
            type: Function,
            required: true
        },
        level: {
            type: Number,
            required: true
        },
        // 添加computedMainCol属性
        computedMainCol: {
            type: String,
            required: true
        },
        expandWidth: {
            type: String,
            required: true
        },
        hasTree: {
            type: Boolean,
            required: false
        },
    },
    emits: ['rowClick', 'toggleExpand']
}
</script>