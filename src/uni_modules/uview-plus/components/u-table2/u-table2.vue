<template>
    <view class="u-table2" :class="{ 'u-table-border': border }">
        <scroll-view scroll-x scroll-y class="u-table2-content"
            :style="{ height: height ? addUnit(height) : 'auto' }"
            @scroll="onScroll">
            <!-- 表头 -->
            <view v-if="showHeader" class="u-table-header"
                :class="{ 'u-table-sticky': fixedHeader }"
                :style="{minWidth: scrollWidth}">
                <view class="u-table-row">
                    <view v-for="(col, colIndex) in columns" :key="col.key" class="u-table-cell"
                        :class="[col.headerAlign ? 'u-text-' + col.headerAlign : (col.align ? 'u-text-' + col.align : '') ,
                            headerCellClassName ? headerCellClassName(col) : '',
                            getFixedClass(col)
                        ]" :style="headerColStyle(col)" @click="handleHeaderClick(col)">
                        <slot name="header" :column="col" :columnIndex="colIndex" :level="1">
                        </slot>
                        <text v-if="!$slots['header']">{{ col.title }}</text>
                        <template v-if="col.sortable">
                            <slot name="headerSort" :sortStatus="getSortValue(col.key)" :column="col"
                                :columnIndex="colIndex" :level="1">
                            </slot>
                            <view v-if="!$slots['headerSort']">
                                {{ getSortIcon(col.key) }}
                            </view>
                        </template>
                    </view>
                </view>
            </view>

            <!-- 表体 -->
            <view class="u-table-body" :style="{ minWidth: scrollWidth, maxHeight: maxHeight ? maxHeight + 'px' : 'none' }">
                <template v-if="data && data.length > 0">
                    <table-row 
                        v-for="(row, rowIndex) in sortedData"
                        :key="row[rowKey] || rowIndex"
                        :row="row" 
                        :rowIndex="rowIndex"
                        :parent-row="null"
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
                        :level="1"
                        :rowHeight="rowHeight"
                        :hasTree="hasTree"
                        :selectedRows="selectedRows"
                        :expandWidth="expandWidth"
                        :computedMainCol="computedMainCol"
                        :span-method="spanMethod"
                        @toggle-select="toggleSelect"
                        @row-click="handleRowClick"
                        @toggle-expand="toggleExpand"
                    >
                        <template v-slot:cellChild="scope">
                            <slot name="cell" :row="scope.row" :column="scope.column" :prow="scope.prow"
                                :rowIndex="scope.rowIndex" :columnIndex="scope.columnIndex" :level="scope.level">
                            </slot>                      
                        </template>
                    </table-row>
                </template>
                <template v-else>
                    <slot name="empty">
                    </slot>
                    <view v-if="!$slots['empty']" class="u-table-empty">{{ emptyText }}</view>
                </template>
            </view>
        </scroll-view>
        
        <!-- 固定列浮动视图 -->
        <view v-if="showFixedColumnShadow" class="u-table-fixed-shadow" :style="{ height: tableHeight }">
            <!-- 表头 -->
            <view v-if="showHeader" class="u-table-header" :class="{ 'u-table-sticky': fixedHeader }" :style="{minWidth: scrollWidth}">
                <view class="u-table-row" :style="{height: headerHeight}">
                    <view v-for="(col, colIndex) in visibleFixedLeftColumns" :key="col.key" class="u-table-cell"
                        :style="headerColStyle(col)"
                        :class="[col.align ? 'u-text-' + col.align : '',
                            headerCellClassName ? headerCellClassName(col) : '',
                            getFixedClass(col)
                        ]" @click="handleHeaderClick(col)">
                        <slot name="header" :column="col" :columnIndex="colIndex" :level="1">
                        </slot>
                        <text v-if="!$slots['header']">{{ col.title }}</text>
                        <template v-if="col.sortable">
                            <slot name="headerSort" :sortStatus="getSortValue(col.key)" :column="col"
                                :columnIndex="colIndex" :level="1">
                            </slot>
                            <view v-if="!$slots['headerSort']">
                                {{ getSortIcon(col.key) }}
                            </view>
                        </template>
                    </view>
                </view>
            </view>

            <!-- 表体 -->
            <view class="u-table-body" :style="{ minWidth: scrollWidth, maxHeight: maxHeight ? maxHeight + 'px' : 'none' }">
                <template v-if="data && data.length > 0">
                    <template v-for="(row, rowIndex) in sortedData" :key="row[rowKey] || rowIndex">
                        <!-- 子级渲染 (递归组件) -->
                        <table-row 
                            :row="row" 
                            :rowIndex="rowIndex"
                            :parent-row="null"
                            :columns="visibleFixedLeftColumns"
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
                            :level="1"
                            :rowHeight="rowHeight"
                            :hasTree="hasTree"
                            :selectedRows="selectedRows"
                            :expandWidth="expandWidth"
                            :computedMainCol="computedMainCol"
                            :span-method="spanMethod"
                            @toggle-select="toggleSelect"
                            @row-click="handleRowClick"
                            @toggle-expand="toggleExpand"
                        >
                            <template v-slot:cellChild="scope">
                                <slot name="cell" :row="scope.row" :column="scope.column" :prow="scope.prow"
                                    :rowIndex="scope.rowIndex" :columnIndex="scope.columnIndex" :level="scope.level">
                                </slot>                      
                            </template>
                        </table-row>
                    </template>
                </template>
            </view>
        </view>
    </view>
</template>

<script>
import { addUnit, sleep } from '../../libs/function/index';
import tableRow from './tableRow.vue'; // 引入递归组件

export default {
    name: 'u-table2',
    components: {
        tableRow // 注册递归组件
    },
    props: {
        data: {
            type: Array,
            required: true,
            default: () => {
                return []
            }
        },
        columns: {
            type: Array,
            required: true,
            default: () => {
                return []
            },
            validator: cols =>
                cols.every(col =>
                    ['default', 'selection', 'expand'].includes(col.type || 'default')
                )
        },
        stripe: {
            type: Boolean,
            default: false
        },
        border: {
            type: Boolean,
            default: false
        },
        height: {
            type: [String, Number],
            default: null
        },
        maxHeight: {
            type: [String, Number],
            default: null
        },
        showHeader: {
            type: Boolean,
            default: true
        },
        highlightCurrentRow: {
            type: Boolean,
            default: false
        },
        rowKey: {
            type: String,
            default: 'id'
        },
        currentRowKey: {
            type: [String, Number],
            default: null
        },
        rowStyle: {
            type: Object,
            default: () => ({})
        },
        cellClassName: {
            type: Function,
            default: null
        },
		cellStyle: {
		    type: Function,
		    default: null
		},
        headerCellClassName: {
            type: Function,
            default: null
        },
        rowClassName: {
            type: Function,
            default: null
        },
        context: {
            type: Object,
            default: null
        },
        showOverflowTooltip: {
            type: Boolean,
            default: false
        },
        lazy: {
            type: Boolean,
            default: false
        },
        load: {
            type: Function,
            default: null
        },
        treeProps: {
            type: Object,
            default: () => ({
                children: 'children',
                hasChildren: 'hasChildren'
            })
        },
        defaultExpandAll: {
            type: Boolean,
            default: false
        },
        expandRowKeys: {
            type: Array,
            default: () => []
        },
        sortOrders: {
            type: Array,
            default: () => ['ascending', 'descending']
        },
        sortable: {
            type: [Boolean, String],
            default: false
        },
        multiSort: {
            type: Boolean,
            default: false
        },
        sortBy: {
            type: String,
            default: null
        },
        sortMethod: {
            type: Function,
            default: null
        },
        filters: {
            type: Object,
            default: () => ({})
        },
        fixedHeader: {
            type: Boolean,
            default: true
        },
        emptyText: {
            type: String,
            default: '暂无数据'
        },
        // 添加mainCol属性，用于指定树形结构展开控制图标所在的列
        mainCol: {
            type: String,
            default: ''
        },
        expandWidth: {
            type: String,
            default: '25px'
        },
        rowHeight: {
            type: String,
            default: '36px'
        },
        // 添加spanMethod属性，用于合并单元格
        spanMethod: {
            type: Function,
            default: null
        }
    },
    emits: [
        'select', 'select-all', 'selection-change',
        'cell-click', 'row-click', 'row-dblclick',
        'header-click', 'sort-change', 'filter-change',
        'current-change', 'expand-change'
    ],
    data() {
        return {
            scrollWidth: 'auto',
            // 将setup中的ref转换为data属性
            expandedKeys: [...this.expandRowKeys],
            selectedRows: [],
            sortConditions: [],
            currentRow: null,
            scrollLeft: 0, // 新增滚动位置数据
            showFixedColumnShadow: false, // 是否显示固定列阴影
            fixedLeftColumns: [], // 左侧固定列
            tableHeight: 'auto', // 表格高度
            headerHeight: 'auto', // 新增表头高度属性
            hasTree: false // 新增属性，用于判断是否存在树形结构
        }
    },
    mounted() {
        this.getComponentWidth()
        // 处理currentRowKey初始化
        if (this.currentRowKey !== null) {
            const found = this.data.find(item => item[this.rowKey] === this.currentRowKey);
            if (found) {
                this.currentRow = found;
            }
        }
        // 获取固定列
        this.fixedLeftColumns = this.columns.filter(col => col.fixed === 'left');
    },
    computed: {
        // 将setup中的computed转换为computed属性
        filteredData() {
            return this.data.filter(row => {
                return Object.keys(this.filters).every(key => {
                    const filter = this.filters[key];
                    if (!filter) return true;
                    return row[key]?.toString().includes(filter.toString());
                });
            });
        },
        sortedData() {
            if (!this.sortConditions.length) return this.filteredData;

            const data = [...this.filteredData];

            return data.sort((a, b) => {
                for (const condition of this.sortConditions) {
                    const { field, order } = condition;
                    let valA = a[field];
                    let valB = b[field];

                    if (this.sortMethod) {
                        const result = this.sortMethod(a, b, field);
                        if (result !== 0) return result * (order === 'ascending' ? 1 : -1);
                    }

                    if (valA < valB) return order === 'ascending' ? -1 : 1;
                    if (valA > valB) return order === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        },
        // 计算当前应该显示的固定左侧列
        visibleFixedLeftColumns() {
            if (this.scrollLeft <= 0) {
                return [];
            }
            
            let totalWidth = 0;
            let fixedWidth = 0;
            const visibleColumns = [];
            
            // 遍历所有列，不仅仅是固定列
            for (let i = 0; i < this.columns.length; i++) {
                const col = this.columns[i];
                const colWidth = col.width ? parseInt(col.width) : 100; // 默认宽度100px
                
                // 如果是固定列且滚动位置足够显示该列
                if (col.fixed === 'left' && this.scrollLeft > totalWidth - fixedWidth) {
                    visibleColumns.push(col);
                    fixedWidth += colWidth;
                }
                
                totalWidth += colWidth;
            }
            
            return visibleColumns;
        },
        // 获取mainCol的值，如果未设置则默认为第一列的key
        computedMainCol() {
            if (this.mainCol) {
                return this.mainCol;
            }
            // 修改为排除有type值的列
            const validColumns = this.columns.filter(col => !col.type);
            let mainCol = validColumns && validColumns.length > 0 ? validColumns[0].key : '';
            // console.log('mainCol', mainCol)
            return mainCol;
        }
    },
    watch: {
        // 将setup中的watch转换为watch属性
        expandRowKeys: {
            handler(newVal) {
                this.expandedKeys = [...newVal];
            },
            immediate: true
        },
        currentRowKey: {
            handler(newVal) {
                const found = this.data.find(item => item[this.rowKey] === newVal);
                if (found) {
                    this.currentRow = found;
                }
            },
            immediate: true
        },
        columns: {
            handler() {
                // this.fixedLeftColumns = this.columns.filter(col => col.fixed === 'left');
            },
            deep: true,
            immediate: false
        }
    },
    methods: {
        addUnit,
        onScroll(e) {
            this.scrollLeft = e.detail.scrollLeft;
            // 获取所有左侧固定列
            this.fixedLeftColumns = this.columns.filter(col => col.fixed === 'left');
            // 计算是否需要显示固定列阴影
            if (this.fixedLeftColumns.length > 0) {
                this.showFixedColumnShadow = this.scrollLeft > 0;
            }
        },
        
        getFixedShadowStyle(col, index) {
            let style = {
                width: col.width ? addUnit(col.width) : 'auto',
            };
            
            if (col?.style) {
                style = {...style, ...col?.style};
            }
            
            return style;
        },
        
        getFixedClass(col) {
            return ''; // 不再使用原来的固定列样式类
        },
        
        headerColStyle(col) {
            let style = {
                width: col.width ? addUnit(col.width) : 'auto',
                flex: col.width ? 'none' : 1
            };
            if (col?.style) {
                style = {...style, ...col?.style};
            }
            return style;
        },
        
		setCellStyle(e) {
			this.cellStyle = e
		},
		cellStyleInner(scope) {
			let style = {
				width: scope.column?.width ? addUnit(scope.column.width) : 'auto',
				flex: scope.column?.width ? 'none' : 1
			};
            // 只有展开列设置padding
            if (scope.column.key == this.computedMainCol) {
                style.paddingLeft = (16 * (scope.level -1 )) + 2 + 'px'
            }
			if (this.cellStyle != null) {
				let styleCalc = this.cellStyle(scope)
				if (styleCalc != null) {
					style = {...style, ...styleCalc}
				}
			}
			return style;
		},
        // 获取组件的宽度
		async getComponentWidth() {
			// 延时一定时间，以获取dom尺寸
			await sleep(30)
			this.$uGetRect('.u-table-row').then(size => {
				this.scrollWidth = size.width + 'px'
			})
            
            // 获取表头高度并设置
            this.$uGetRect('.u-table-header').then(size => {
                if (size.height) {
                    this.headerHeight = size.height + 'px';
                }
            })
            
            // 遍历数据列表第一层判断是否存在树形结构
            this.hasTree = this.sortedData.some(item => {
                return item[this.treeProps.children] && item[this.treeProps.children].length > 0;
            });
		},
        // 将setup中的函数转换为methods
        handleRowClick(row) {
            if (this.highlightCurrentRow) {
                const oldRow = this.currentRow;
                this.currentRow = row;
                this.$emit('current-change', row, oldRow);
            }
            this.$emit('row-click', row);
        },
        handleHeaderClick(column) {
            if (!column.sortable) return;

            const index = this.sortConditions.findIndex(c => c.field === column.key);
            let newOrder = 'ascending';

            if (index >= 0) {
                if (this.sortConditions[index].order === 'ascending') {
                    newOrder = 'descending';
                } else {
                    this.sortConditions.splice(index, 1);
                    this.$emit('sort-change', this.sortConditions);
                    return;
                }
            }

            if (!this.multiSort) {
                this.sortConditions = [{ field: column.key, order: newOrder }];
            } else {
                if (index >= 0) {
                    this.sortConditions[index].order = newOrder;
                } else {
                    this.sortConditions.push({ field: column.key, order: newOrder });
                }
            }

            this.$emit('sort-change', this.sortConditions);
        },
        getSortIcon(field) {
            const cond = this.sortConditions.find(c => c.field === field);
            if (!cond) return '';
            return cond.order === 'ascending' ? '↑' : '↓';
        },
        getSortValue(field) {
            const cond = this.sortConditions.find(c => c.field === field);
            if (!cond) return '';
            return cond.order === 'ascending';
        },
        toggleSelect(row) {
            const index = this.selectedRows.findIndex(r => r[this.rowKey] === row[this.rowKey]);
            if (index >= 0) {
                // 取消选中当前行及其所有子节点
                this.selectedRows.splice(index, 1);
                // 递归取消所有子节点
                this.unselectChildren(row);
            } else {
                // 选中当前行及其所有子节点
                this.selectedRows.push(row);
                // 递归选中所有子节点
                this.selectChildren(row);
            }
            console.log(this.selectedRows)
            this.$emit('selection-change', this.selectedRows);
            this.$emit('select', row);
        },
        toggleExpand(row) {
            // console.log(row)
            const key = row[this.rowKey];
            const index = this.expandedKeys.indexOf(key);
            if (index === -1) {
                this.expandedKeys.push(key);
            } else {
                this.expandedKeys.splice(index, 1);
            }
            this.$emit('expand-change', this.expandedKeys);
        },
        isExpanded(row) {
            if (!row) {
                return false;
            }
            return this.expandedKeys.includes(row[this.rowKey]);
        },
        // 新增方法：递归选中所有子节点
        selectChildren(row) {
            const children = row[this.treeProps.children];
            if (children && children.length > 0) {
                children.forEach(child => {
                    // 检查是否已选中，避免重复添加
                    const childIndex = this.selectedRows.findIndex(r => r[this.rowKey] === child[this.rowKey]);
                    if (childIndex === -1) {
                        this.selectedRows.push(child);
                    }
                    // 递归处理子节点的子节点
                    this.selectChildren(child);
                });
            }
        },
        // 新增方法：递归取消选中所有子节点
        unselectChildren(row) {
            const children = row[this.treeProps.children];
            if (children && children.length > 0) {
                children.forEach(child => {
                    const childIndex = this.selectedRows.findIndex(r => r[this.rowKey] === child[this.rowKey]);
                    if (childIndex >= 0) {
                        this.selectedRows.splice(childIndex, 1);
                    }
                    // 递归处理子节点的子节点
                    this.unselectChildren(child);
                });
            }
        },
    }
};
</script>

<style lang="scss" scoped>
.u-table2 {
    width: auto;
    overflow: auto;
    white-space: nowrap;
    position: relative;

    .u-table-header {
        min-width: 100% !important;
        width: fit-content;
        background-color: #f5f7fa;
    }

    .u-table-body {
        min-width: 100% !important;
        width: fit-content;
        position: relative;
    }

    .u-table-sticky {
        position: sticky;
        top: 0;
        z-index: 10;
    }

    .u-table-row {
        display: flex;
        flex-direction: row;
        overflow: hidden;
        position: relative;
        // min-height: 40px;
    }

    // 添加border样式支持
    &.u-table-border {
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
}

// 固定列浮动视图
.u-table-fixed-shadow {
    position: absolute;
    top: 0;
    left: 0;
    width: auto;
    z-index: 20;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    background-color: #ffffff;
}

// .u-table-fixed-row {
//     display: flex;
//     flex-direction: row;
//     align-items: center;
//     border-bottom: 1rpx solid #ebeef5;
//     position: relative;
// }

// 为固定列也添加border样式支持
.u-table-fixed-shadow .u-table-border {
    .u-table-cell {
        border-right: 1rpx solid #ebeef5;
    }
    
    .u-table-cell:last-child {
        border-right: none;
    }
}
</style>