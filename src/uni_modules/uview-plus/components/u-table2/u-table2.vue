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
                            headerCellClassName ? headerCellClassName(col, context) : '',
                            getFixedClass(col)
                        ]" :style="headerColStyle(col)" @click="handleHeaderClick(col)">
                        <slot name="header" :column="col" :columnIndex="colIndex" :level="1" :context="context">
                        </slot>
                        <text v-if="!$slots['header']">{{ col.title }}</text>
                        <template v-if="isColumnSortable(col)">
                            <slot name="headerSort" :sortStatus="getSortValue(col.key)" :column="col"
                                :columnIndex="colIndex" :level="1" :context="context">
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
                    <!-- #ifdef MP-WEIXIN -->
                    <template v-for="(item, flatIndex) in flattenedSortedData" :key="item.row[rowKey] || flatIndex">
                        <view class="u-table-row u-table-row-child" :class="[highlightCurrentRow && currentRow === item.row ? 'u-table-row-highlight' : '',
                            rowClassName ? rowClassName(item.row, item.rowIndex, context) : '',
                            stripe && flatIndex % 2 === 1 ? 'u-table-row-zebra' : ''
                        ]" :style="[{ height: rowHeight }, getRowStyle(item.row, item.rowIndex, item.level, item.parentRow)]" @click="handleRowClick(item.row)">
                            <view v-for="(col, colIndex) in columns" :key="col.key" class="u-table-cell"
                                :class="[col.align ? 'u-text-' + col.align : '',
                                    cellClassName ? cellClassName(item.row, col, context) : '',
                                    getFixedClass(col),
                                    isOverflowTooltipEnabled(col) ? 'u-table-cell-overflow' : '',
                                    getCellSpanClass(item.row, col, item.rowIndex, colIndex)
                                ]"
                                :style="[cellStyleInner({ row: item.row, column: col, rowIndex: item.rowIndex, columnIndex: colIndex, level: item.level }), getCellSpanStyle(item.row, col, item.rowIndex, colIndex)]">
                                <view v-if="col.type === 'selection'">
                                    <checkbox :checked="isSelected(item.row)" @click.stop="toggleSelect(item.row)" />
                                </view>
                                <template v-else>
                                    <view v-if="col.key === computedMainCol && hasTree" @click.stop="toggleExpand(item.row, item.level)"
                                        :style="{ width: expandWidth }">
                                        <view v-if="hasExpandableChildren(item.row)">
                                            {{ isLazyLoading(item.row) ? '...' : (isExpanded(item.row) ? '▼' : '▶') }}
                                        </view>
                                    </view>
                                    <view class="u-table-cell_content"
                                        :class="{ 'u-table-cell_content-overflow': isOverflowTooltipEnabled(col) }">
                                        <slot name="cell" :row="item.row" :column="col" :prow="item.parentRow"
                                            :rowIndex="item.rowIndex" :columnIndex="colIndex" :level="item.level" :context="context">
                                            <text class="u-table-cell_text" :class="{ 'u-line-1': isOverflowTooltipEnabled(col) }" :lines="isOverflowTooltipEnabled(col) ? 1 : undefined">
                                                {{ item.row[col.key] }}
                                            </text>
                                        </slot>
                                    </view>
                                </template>
                            </view>
                        </view>
                    </template>
                    <!-- #endif -->
                    <!-- #ifndef MP-WEIXIN -->
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
                        :row-style="rowStyle"
                        :stripe="stripe"
                        :cell-class-name="cellClassName"
                        :get-fixed-class="getFixedClass"
                        :context="context"
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
                        :show-overflow-tooltip="showOverflowTooltip"
                        :has-expandable-children="hasExpandableChildren"
                        :is-lazy-loading="isLazyLoading"
                        @toggle-select="toggleSelect"
                        @row-click="handleRowClick"
                        @toggle-expand="toggleExpand"
                    >
                        <template v-slot:cellChild="scope">
                            <slot name="cell" :row="scope.row" :column="scope.column" :prow="scope.prow"
                                :rowIndex="scope.rowIndex" :columnIndex="scope.columnIndex" :level="scope.level" :context="context">
                                <text class="u-table-cell_text" :class="{ 'u-line-1': isOverflowTooltipEnabled(scope.column) }" :lines="isOverflowTooltipEnabled(scope.column) ? 1 : undefined">
                                    {{ scope.row[scope.column.key] }}
                                </text>
                            </slot>                      
                        </template>
                    </table-row>
                    <!-- #endif -->
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
                            headerCellClassName ? headerCellClassName(col, context) : '',
                            getFixedClass(col)
                        ]" @click="handleHeaderClick(col)">
                        <slot name="header" :column="col" :columnIndex="colIndex" :level="1" :context="context">
                        </slot>
                        <text v-if="!$slots['header']">{{ col.title }}</text>
                        <template v-if="isColumnSortable(col)">
                            <slot name="headerSort" :sortStatus="getSortValue(col.key)" :column="col"
                                :columnIndex="colIndex" :level="1" :context="context">
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
                    <!-- #ifdef MP-WEIXIN -->
                    <template v-for="(item, flatIndex) in flattenedSortedData" :key="item.row[rowKey] || flatIndex">
                        <view class="u-table-row u-table-row-child" :class="[highlightCurrentRow && currentRow === item.row ? 'u-table-row-highlight' : '',
                            rowClassName ? rowClassName(item.row, item.rowIndex, context) : '',
                            stripe && flatIndex % 2 === 1 ? 'u-table-row-zebra' : ''
                        ]" :style="[{ height: rowHeight }, getRowStyle(item.row, item.rowIndex, item.level, item.parentRow)]" @click="handleRowClick(item.row)">
                            <view v-for="(col, colIndex) in visibleFixedLeftColumns" :key="col.key" class="u-table-cell"
                                :class="[col.align ? 'u-text-' + col.align : '',
                                    cellClassName ? cellClassName(item.row, col, context) : '',
                                    getFixedClass(col),
                                    isOverflowTooltipEnabled(col) ? 'u-table-cell-overflow' : '',
                                    getCellSpanClass(item.row, col, item.rowIndex, colIndex)
                                ]"
                                :style="[cellStyleInner({ row: item.row, column: col, rowIndex: item.rowIndex, columnIndex: colIndex, level: item.level }), getCellSpanStyle(item.row, col, item.rowIndex, colIndex)]">
                                <view v-if="col.type === 'selection'">
                                    <checkbox :checked="isSelected(item.row)" @click.stop="toggleSelect(item.row)" />
                                </view>
                                <template v-else>
                                    <view v-if="col.key === computedMainCol && hasTree" @click.stop="toggleExpand(item.row, item.level)"
                                        :style="{ width: expandWidth }">
                                        <view v-if="hasExpandableChildren(item.row)">
                                            {{ isLazyLoading(item.row) ? '...' : (isExpanded(item.row) ? '▼' : '▶') }}
                                        </view>
                                    </view>
                                    <!-- 固定列浮动视图直接内联渲染，不使用 slot，避免与主表体 slot name="cell" 重名报错（微信小程序限制） -->
                                    <view class="u-table-cell_content"
                                        :class="{ 'u-table-cell_content-overflow': isOverflowTooltipEnabled(col) }">
                                        <text class="u-table-cell_text" :class="{ 'u-line-1': isOverflowTooltipEnabled(col) }" :lines="isOverflowTooltipEnabled(col) ? 1 : undefined">
                                            {{ item.row[col.key] }}
                                        </text>
                                    </view>
                                </template>
                            </view>
                        </view>
                    </template>
                    <!-- #endif -->
                    <!-- #ifndef MP-WEIXIN -->
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
                            :row-style="rowStyle"
                            :stripe="stripe"
                            :cell-class-name="cellClassName"
                            :get-fixed-class="getFixedClass"
                            :context="context"
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
                            :show-overflow-tooltip="showOverflowTooltip"
                            :has-expandable-children="hasExpandableChildren"
                            :is-lazy-loading="isLazyLoading"
                            @toggle-select="toggleSelect"
                            @row-click="handleRowClick"
                            @toggle-expand="toggleExpand"
                        >
                            <template v-slot:cellChild="scope">
                                <slot name="cell" :row="scope.row" :column="scope.column" :prow="scope.prow"
                                    :rowIndex="scope.rowIndex" :columnIndex="scope.columnIndex" :level="scope.level" :context="context">
                                    <text class="u-table-cell_text" :class="{ 'u-line-1': isOverflowTooltipEnabled(scope.column) }" :lines="isOverflowTooltipEnabled(scope.column) ? 1 : undefined">
                                        {{ scope.row[scope.column.key] }}
                                    </text>
                                </slot>                      
                            </template>
                        </table-row>
                    </template>
                    <!-- #endif -->
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
            type: [Object, Function],
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
            type: [Boolean, Object],
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
            hasTree: false, // 新增属性，用于判断是否存在树形结构
            lazyLoadingKeys: []
        }
    },
    mounted() {
        this.getComponentWidth()
        this.initDefaultExpandAll()
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
                    const { field, order, column } = condition;
                    const sortBy = column ? this.getColumnSortBy(column) : this.sortBy;
                    let valA = this.getSortValueBy(a, field, sortBy);
                    let valB = this.getSortValueBy(b, field, sortBy);

                    if (this.sortMethod) {
                        const result = this.sortMethod(a, b, field, this.context);
                        if (result !== 0) return result * (order === 'ascending' ? 1 : -1);
                    }

                    if (valA < valB) return order === 'ascending' ? -1 : 1;
                    if (valA > valB) return order === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        },
        flattenedSortedData() {
            const result = [];
            const childrenKey = this.treeProps.children;

            const walk = (rows, parentRow = null, level = 1) => {
                if (!Array.isArray(rows) || rows.length === 0) return;
                rows.forEach((row, rowIndex) => {
                    result.push({ row, parentRow, level, rowIndex });
                    const children = row && row[childrenKey];
                    if (children && children.length > 0 && this.isExpanded(row)) {
                        walk(children, row, level + 1);
                    }
                });
            };

            walk(this.sortedData);
            return result;
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
                this.initDefaultExpandAll();
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
        },
        data: {
            handler() {
                this.initDefaultExpandAll();
            },
            deep: true
        },
        defaultExpandAll() {
            this.initDefaultExpandAll();
        }
    },
    methods: {
        addUnit,
        isSelected(row) {
            return this.selectedRows.some(r => r[this.rowKey] === row[this.rowKey]);
        },
        getCellSpan(row, column, rowIndex, columnIndex) {
            if (typeof this.spanMethod !== 'function') {
                return { rowspan: 1, colspan: 1 };
            }

            const result = this.spanMethod({
                row,
                column,
                rowIndex,
                columnIndex,
                context: this.context
            });

            if (Array.isArray(result)) {
                const [rowspan, colspan] = result;
                return { rowspan: rowspan != null ? rowspan : 1, colspan: colspan != null ? colspan : 1 };
            }

            if (result && typeof result === 'object') {
                const { rowspan, colspan } = result;
                return { rowspan: rowspan != null ? rowspan : 1, colspan: colspan != null ? colspan : 1 };
            }

            return { rowspan: 1, colspan: 1 };
        },
        getCellSpanClass(row, column, rowIndex, columnIndex) {
            const span = this.getCellSpan(row, column, rowIndex, columnIndex);
            if (span.rowspan === 0 || span.colspan === 0) {
                return 'u-table-cell-hidden';
            }
            if (span.rowspan > 1 || span.colspan > 1) {
                return 'u-table-cell-merged';
            }
            return '';
        },
        getCellSpanStyle(row, column, rowIndex, columnIndex) {
            const span = this.getCellSpan(row, column, rowIndex, columnIndex);
            const style = {};

            if (span.rowspan > 1) {
                const currentHeight = parseInt(this.rowHeight);
                if (!isNaN(currentHeight)) {
                    style.height = `${span.rowspan * currentHeight}px`;
                }
            }

            if (span.colspan > 1) {
                style.flex = span.colspan;
            }

            if (span.rowspan === 0 || span.colspan === 0) {
                style.display = 'none';
            }

            return style;
        },
        getRowStyle(row, rowIndex, level = 1, parentRow = null) {
            if (typeof this.rowStyle === 'function') {
                return this.rowStyle({ row, rowIndex, level, parentRow, context: this.context }) || {};
            }
            return this.rowStyle || {};
        },
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

        isOverflowTooltipEnabled(column) {
            if (column && column.type === 'selection') {
                return false;
            }
            if (column && typeof column.showOverflowTooltip !== 'undefined') {
                return !!column.showOverflowTooltip;
            }
            return !!this.showOverflowTooltip;
        },

        isColumnSortable(column) {
            return typeof column.sortable !== 'undefined' ? !!column.sortable : !!this.sortable;
        },

        getColumnSortBy(column) {
            if (typeof column.sortBy !== 'undefined') {
                return column.sortBy;
            }
            return this.sortBy;
        },

        getColumnSortOrders(column) {
            if (Array.isArray(column.sortOrders) && column.sortOrders.length > 0) {
                return column.sortOrders;
            }
            return this.sortOrders;
        },

        getSortValueBy(row, field, sortBy) {
            if (typeof sortBy === 'function') {
                return sortBy(row);
            }
            if (Array.isArray(sortBy) && sortBy.length > 0) {
                return sortBy.map(key => row[key]).join('');
            }
            if (typeof sortBy === 'string' && sortBy) {
                return row[sortBy];
            }
            return row[field];
        },

        hasExpandableChildren(row) {
            if (!row) {
                return false;
            }
            const children = row[this.treeProps.children];
            return (Array.isArray(children) && children.length > 0) || !!row[this.treeProps.hasChildren];
        },

        isLazyLoading(row) {
            return this.lazyLoadingKeys.includes(row[this.rowKey]);
        },

        initDefaultExpandAll() {
            if (!this.defaultExpandAll) {
                return;
            }
            const keys = [];
            const childrenKey = this.treeProps.children;
            const walk = (rows) => {
                if (!Array.isArray(rows)) {
                    return;
                }
                rows.forEach(row => {
                    if (!row) {
                        return;
                    }
                    if (this.hasExpandableChildren(row)) {
                        keys.push(row[this.rowKey]);
                    }
                    walk(row[childrenKey]);
                });
            };
            walk(this.data);
            this.expandedKeys = Array.from(new Set([...this.expandedKeys, ...keys]));
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
				let styleCalc = this.cellStyle({...scope, context: this.context})
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
            if (!this.isColumnSortable(column)) return;

            const index = this.sortConditions.findIndex(c => c.field === column.key);
            const sortOrders = this.getColumnSortOrders(column).filter(Boolean);
            let newOrder = sortOrders[0] || 'ascending';

            if (index >= 0) {
                const currentOrder = this.sortConditions[index].order;
                const nextIndex = sortOrders.indexOf(currentOrder) + 1;
                if (nextIndex > 0 && nextIndex < sortOrders.length) {
                    newOrder = sortOrders[nextIndex];
                } else {
                    this.sortConditions.splice(index, 1);
                    this.$emit('sort-change', this.sortConditions);
                    return;
                }
            }

            if (!this.multiSort) {
                this.sortConditions = [{ field: column.key, order: newOrder, column }];
            } else {
                if (index >= 0) {
                    this.sortConditions[index].order = newOrder;
                    this.sortConditions[index].column = column;
                } else {
                    this.sortConditions.push({ field: column.key, order: newOrder, column });
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
        toggleExpand(row, level = 1) {
            // console.log(row)
            const key = row[this.rowKey];
            const index = this.expandedKeys.indexOf(key);
            if (index === -1) {
                this.expandedKeys.push(key);
                this.loadLazyChildren(row, level);
            } else {
                this.expandedKeys.splice(index, 1);
            }
            this.$emit('expand-change', this.expandedKeys);
        },
        loadLazyChildren(row, level = 1) {
            if (!this.lazy || typeof this.load !== 'function') {
                return;
            }
            const childrenKey = this.treeProps.children;
            const key = row[this.rowKey];
            const children = row[childrenKey];
            if ((Array.isArray(children) && children.length > 0) || this.lazyLoadingKeys.includes(key)) {
                return;
            }

            this.lazyLoadingKeys.push(key);
            const resolve = (childrenList = []) => {
                row[childrenKey] = Array.isArray(childrenList) ? childrenList : [];
                this.lazyLoadingKeys = this.lazyLoadingKeys.filter(item => item !== key);
                this.getComponentWidth();
            };

            const result = this.load(row, {
                row,
                level,
                expanded: this.isExpanded(row),
                loading: true,
                context: this.context
            }, resolve);

            if (result && typeof result.then === 'function') {
                result.then(resolve).catch(() => {
                    this.lazyLoadingKeys = this.lazyLoadingKeys.filter(item => item !== key);
                });
            }
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
    color: var(--up-content-color, #606266);
    background-color: var(--up-card-bg-color, #ffffff);

    .u-table-header {
        min-width: 100% !important;
        width: fit-content;
        background-color: var(--up-table2-header-bg-color, var(--up-bg-color, #f5f7fa));
        color: var(--up-main-color, #303133);
    }

    .u-table-body {
        min-width: 100% !important;
        width: fit-content;
        position: relative;
        background-color: var(--up-card-bg-color, #ffffff);
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
        border-top: 1px solid var(--up-border-color, #ebeef5);
        border-left: 1px solid var(--up-border-color, #ebeef5);
        border-right: 1px solid var(--up-border-color, #ebeef5);
        .u-table-cell {
            border-right: 1px solid var(--up-border-color, #ebeef5);
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
        min-width: 0;
        box-sizing: border-box;
        padding: 10px 1px;
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1.1;
        color: var(--up-content-color, #606266);
        border-bottom: 1px solid var(--up-border-color, #ebeef5);
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

    .u-table-cell_content {
        width: 100%;
        min-width: 0;
        max-width: 100%;
        flex: 1;
        box-sizing: border-box;
        display: block;
        text-align: inherit;
    }

    .u-table-cell_text {
        width: 100%;
        min-width: 0;
        max-width: 100%;
        display: block;
        box-sizing: border-box;
        text-align: inherit;
    }

    .u-table-cell_content-overflow,
    .u-table-cell_content-overflow .u-table-cell_text {
        width: 100%;
        min-width: 0;
        max-width: 100%;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .u-table-row-zebra {
        background-color: var(--up-table2-zebra-bg-color, rgba(255, 255, 255, 0.03));
    }

    .u-table-row-highlight {
        background-color: var(--up-table2-highlight-bg-color, var(--up-bg-color, #f5f7fa));
    }

    .u-table-empty {
        text-align: center;
        padding: 20px;
        color: var(--up-tips-color, #999);
    }

    .u-table-cell-hidden {
        opacity: 0;
    }

    .u-table-cell-merged {
        z-index: 1;
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
    background-color: var(--up-card-bg-color, #ffffff);
    color: var(--up-content-color, #606266);
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
        border-right: 1rpx solid var(--up-border-color, #ebeef5);
    }
    
    .u-table-cell:last-child {
        border-right: none;
    }
}
</style>
