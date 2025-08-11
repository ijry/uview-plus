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
    <view class="u-table-row u-table-row-child"
        :class="[highlightCurrentRow && currentRow === row ? 'u-table-row-highlight' : '',
        rowClassName ? rowClassName(row, rowIndex) : '',
        stripe && rowIndex % 2 === 1 ? 'u-table-row-zebra' : ''
        ]" :style="{height: rowHeight}" @click="handleRowClick(row)">
        <view v-for="(col, colIndex) in columns" :key="col.key" 
            class="u-table-cell"
            :class="[col.align ? 'u-text-' + col.align : '',
                cellClassName ? cellClassName(row, col) : '',
                getFixedClass(col)
            ]"
            :style="cellStyleInner({row: row, column: col, rowIndex: rowIndex, columnIndex: colIndex, level: level})">
                <!-- 复选框列 -->
                <view v-if="col.type === 'selection'">
                    <checkbox :checked="isSelected(row)"
                        @click.stop="$emit('toggleSelect', row)" />
                </view>
                <template v-else>
                    <!-- 在mainCol列显示展开图标 -->
                    <view v-if="col.key === computedMainCol && hasTree"
                        @click.stop="toggleExpand(row)" :style="{width: expandWidth}">
                        <view v-if="row.children && row.children.length > 0">
                            {{ isExpanded(row) ? '▼' : '▶' }}
                        </view>
                    </view>
                    <slot name="cellChild" :row="row" :column="col" :prow="parentRow"
                        :rowIndex="rowIndex" :columnIndex="colIndex" :level="level">
                        <view class="u-table-cell_content">
                            {{ row[col.key] }}
                        </view>
                    </slot>
                </template>
        </view>
    </view>
    <!-- 递归渲染更深层的子级 -->
        <template v-if="isExpanded(row) && row[treeProps.children] && row[treeProps.children].length">
            <template v-for="(rowChild, childIndex) in row[treeProps.children]" :key="rowChild[rowKey] || childIndex">
                <table-row 
                    :row="rowChild" 
                    :rowIndex="childIndex"
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
                    :rowHeight="rowHeight"
                    :hasTree="hasTree"
                    :selectedRows="selectedRows"
                    :expandWidth="expandWidth"
                    :computed-main-col="computedMainCol"
                    @toggle-select="$emit('toggleSelect', $event)"
                    @row-click="$emit('rowClick', $event)"
                    @toggle-expand="$emit('toggleExpand', $event)"
                >
                <template v-slot:cellChild="scope">
                    <slot name="cellChild" :row="scope.row" :column="scope.column" :prow="scope.prow"
                        :rowIndex="scope.rowIndex" :columnIndex="scope.columnIndex" :level="level">
                    </slot>                      
                </template>
                </table-row>
            </template>
        </template>
</template>

<script>
export default {
    name: 'tableRow',
    props: {
        row: {
            type: Object,
            required: true
        },
        rowIndex: {
            type: Number,
            required: true
        },
        parentRow: {
            type: Object,
            default: null
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
        selectedRows: {
            type: Array,
            required: false
        },
        rowHeight: {
            type: String,
            required: true
        }
    },
    emits: ['rowClick', 'toggleExpand', 'toggleSelect'],
    methods: {
        isSelected(row) {
            return this.selectedRows.some(r => r[this.rowKey] === row[this.rowKey]);
        }
    }
}
</script>