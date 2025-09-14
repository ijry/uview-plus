<style lang="scss" scoped>
.u-table-row {
    display: flex;
    flex-direction: row;
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
    align-items: center;
    padding: 10px 1px;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.1;
    border-bottom: 1px solid #ebeef5;
    &.u-text-left {
        justify-content: flex-start;
        text-align: left;
    }
    &.u-text-center {
        justify-content: center;
        text-align: center;
    }
    &.u-text-right {
        justify-content: flex-end;
        text-align: right;
    }
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

// 隐藏被合并的单元格
.u-table-cell-hidden {
    opacity: 0;
}

// 合并单元格样式
.u-table-cell-merged {
    z-index: 1;
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
                getFixedClass(col),
                getCellSpanClass(rowIndex, colIndex)
            ]"
            :style="[cellStyleInner({row: row, column: col, rowIndex: rowIndex, columnIndex: colIndex, level: level}), getCellSpanStyle(rowIndex, colIndex)]">
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
                    :span-method="spanMethod"
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
        },
        // 添加spanMethod属性
        spanMethod: {
            type: Function,
            default: null
        }
    },
    emits: ['rowClick', 'toggleExpand', 'toggleSelect'],
    methods: {
        isSelected(row) {
            return this.selectedRows.some(r => r[this.rowKey] === row[this.rowKey]);
        },
        // 获取单元格的合并信息
        getCellSpan(rowIndex, columnIndex) {
            if (typeof this.spanMethod !== 'function') {
                return { rowspan: 1, colspan: 1 };
            }
            
            const row = this.row;
            const column = this.columns[columnIndex];
            
            const result = this.spanMethod({
                row,
                column,
                rowIndex,
                columnIndex
            });
            
            if (Array.isArray(result)) {
                const [rowspan, colspan] = result;
                return { rowspan: rowspan != null ? rowspan : 1, colspan: colspan != null ? colspan : 1 };
            } else if (typeof result === 'object') {
                return {
                    rowspan: rowspan != null ? rowspan : 1,
                    colspan: colspan != null ? colspan : 1
                };
            }
            
            return { rowspan: 1, colspan: 1 };
        },
        // 获取单元格的样式类
        getCellSpanClass(rowIndex, columnIndex) {
            const span = this.getCellSpan(rowIndex, columnIndex);
            
            // 如果rowspan为0或colspan为0，表示该单元格被合并，需要隐藏
            if (span.rowspan === 0 || span.colspan === 0) {
                return 'u-table-cell-hidden';
            } else if (span.rowspan > 1 || span.colspan > 1) {
                // 如果有合并，添加合并样式类
                return 'u-table-cell-merged';
            }
            
            return '';
        },
        // 获取单元格的样式
        getCellSpanStyle(rowIndex, columnIndex) {
            const span = this.getCellSpan(rowIndex, columnIndex);
            const style = {};
            
            // 设置rowspan
            if (span.rowspan > 1) {
                // 正确计算合并后的高度
                const currentHeight = parseInt(this.rowHeight);
                if (!isNaN(currentHeight)) {
                    style.height = `${span.rowspan * currentHeight}px`;
                }
            }
            
            // 设置colspan
            if (span.colspan > 1) {
                style.flex = span.colspan;
            }
            
            // 如果rowspan为0或colspan为0，表示该单元格被合并，需要隐藏
            if (span.rowspan === 0 || span.colspan === 0) {
                style.display = 'none';
            }
            
            return style;
        }
    }
}
</script>