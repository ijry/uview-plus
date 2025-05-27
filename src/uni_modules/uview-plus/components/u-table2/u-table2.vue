<template>
    <view scroll-x class="u-table2" :style="{ height: height ? height + 'px' : 'auto' }">
        <!-- 表头 -->
        <view v-if="showHeader" class="u-table-header" :class="{ 'u-table-sticky': fixedHeader }" :style="{minWidth: scrollWidth}">
            <view class="u-table-row">
                <view v-for="(col, colIndex) in columns" :key="col.key" class="u-table-cell"
                    :style="headerColStyle(col)"
					:class="[
                        col.align ? 'u-text-' + col.align : '',
                        headerCellClassName ? headerCellClassName(col) : '',
                        col.fixed === 'left' ? 'u-table-fixed-left' : '',
                        col.fixed === 'right' ? 'u-table-fixed-right' : ''
                    ]" @click="handleHeaderClick(col)">
                    {{ col.title }}
                    <view v-if="col.sortable">
                        {{ getSortIcon(col.key) }}
                    </view>
                </view>
            </view>
        </view>

        <!-- 表体 -->
        <view class="u-table-body" :style="{ minWidth: scrollWidth, maxHeight: maxHeight ? maxHeight + 'px' : 'none' }">
            <template v-if="data && data.length > 0">
                <template v-for="(row, index) in sortedData" :key="row[rowKey] || index">
                    <view class="u-table-row" :class="[
                        highlightCurrentRow && currentRow === row ? 'u-table-row-highlight' : '',
                        rowClassName ? rowClassName(row, index) : '',
                        stripe && index % 2 === 1 ? 'u-table-row-zebra' : ''
                    ]" @click="handleRowClick(row)">
                        <view v-for="(col, colIndex) in columns" :key="col.key"
							class="u-table-cell" :class="[
                            col.align ? 'u-text-' + col.align : '',
                            cellClassName ? cellClassName(row, col) : '',
                            col.fixed === 'left' ? 'u-table-fixed-left' : '',
                            col.fixed === 'right' ? 'u-table-fixed-right' : ''
                        ]" :style="cellStyleInner({row: row, column: col,
							rowIndex: index, columnIndex: colIndex, level: 0})">
                            <!-- 复选框列 -->
                            <view v-if="col.type === 'selection'">
                                <checkbox :checked="isSelected(row)"
									@click.stop="toggleSelect(row)" />
                            </view>

                            <!-- 树形结构展开图标 -->
                            <view v-else-if="col.type === 'expand'"
								@click.stop="toggleExpand(row)">
                                {{ isExpanded(row) ? '▼' : '▶' }}
                            </view>

                            <!-- 默认插槽或文本 -->
                            <slot name="cell" :row="row" :column="col"
								:rowIndex="index" :columnIndex="colIndex">
                                <view class="u-table-cell_content">
                                    {{ row[col.key] }}
                                </view>
                            </slot>
                        </view>
                    </view>

                    <!-- 子级渲染 -->
                    <template v-if="isExpanded(row) && row[treeProps.children] && row[treeProps.children].length">
                        <view v-for="childRow in row[treeProps.children]" :key="childRow[rowKey]"
                            class="u-table-row u-table-row-child">
                            <view v-for="(col2, col2Index) in columns" :key="col2.key" class="u-table-cell"
                                :style="cellStyleInner({row: childRow, column: col2,
									rowIndex: index, columnIndex: col2Index, level: 1})">
                                <slot name="cell" :row="childRow" :column="col2" :prow="row"
									:rowIndex="index" :columnIndex="col2Index" :level="1">
                                    <view class="u-table-cell_content">
                                        {{ childRow[col2.key] }}
                                    </view>
                                </slot>
                            </view>
                        </view>
                    </template>
                </template>
            </template>
            <template v-else>
                <slot name="empty">
                    <view class="u-table-empty">{{ emptyText }}</view>
                </slot>
            </template>
        </view>
    </view>
</template>

<script>
import { ref, watch, computed } from 'vue'
import { addUnit, sleep } from '../../libs/function/index';

export default {
    name: 'u-table2',
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
    },
    emits: [
        'select', 'select-all', 'selection-change',
        'cell-click', 'row-click', 'row-dblclick',
        'header-click', 'sort-change', 'filter-change',
        'current-change', 'expand-change'
    ],
    data() {
        return {
            scrollWidth: 'auto'
        }
    },
    mounted() {
        this.getComponentWidth()
    },
	computed: {
	},
    methods: {
        addUnit,
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
				flex: scope.column?.width ? 'none' : 1,
				paddingLeft: (24 * scope.level) + 'px'
			};
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
		},
    },
    setup(props, { emit }) {
        const expandedKeys = ref([...props.expandRowKeys]);
        const selectedRows = ref([]);
        const sortConditions = ref([]);

        // 当前高亮行
        const currentRow = ref(null);

        watch(
            () => props.expandRowKeys,
            newVal => {
                expandedKeys.value = [...newVal];
            }
        );

        watch(
            () => props.currentRowKey,
            newVal => {
                const found = props.data.find(item => item[props.rowKey] === newVal);
                if (found) {
                    currentRow.value = found;
                }
            }
        );

        // 过滤后的数据
        const filteredData = computed(() => {
            return props.data.filter(row => {
                return Object.keys(props.filters).every(key => {
                    const filter = props.filters[key];
                    if (!filter) return true;
                    return row[key]?.toString().includes(filter.toString());
                });
            });
        });

        // 排序后的数据
        const sortedData = computed(() => {
            if (!sortConditions.value.length) return filteredData.value;

            const data = [...filteredData.value];

            return data.sort((a, b) => {
                for (const condition of sortConditions.value) {
                    const { field, order } = condition;
                    let valA = a[field];
                    let valB = b[field];

                    if (props.sortMethod) {
                        const result = props.sortMethod(a, b, field);
                        if (result !== 0) return result * (order === 'ascending' ? 1 : -1);
                    }

                    if (valA < valB) return order === 'ascending' ? -1 : 1;
                    if (valA > valB) return order === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        });

        function handleRowClick(row) {
            if (props.highlightCurrentRow) {
                const oldRow = currentRow.value;
                currentRow.value = row;
                emit('current-change', row, oldRow);
            }
            emit('row-click', row);
        }

        function handleHeaderClick(column) {
            if (!column.sortable) return;

            const index = sortConditions.value.findIndex(c => c.field === column.key);
            let newOrder = 'ascending';

            if (index >= 0) {
                if (sortConditions.value[index].order === 'ascending') {
                    newOrder = 'descending';
                } else {
                    sortConditions.value.splice(index, 1);
                    emit('sort-change', sortConditions.value);
                    return;
                }
            }

            if (!props.multiSort) {
                sortConditions.value = [{ field: column.key, order: newOrder }];
            } else {
                if (index >= 0) {
                    sortConditions.value[index].order = newOrder;
                } else {
                    sortConditions.value.push({ field: column.key, order: newOrder });
                }
            }

            emit('sort-change', sortConditions.value);
        }

        function getSortIcon(field) {
            const cond = sortConditions.value.find(c => c.field === field);
            if (!cond) return '';
            return cond.order === 'ascending' ? '↑' : '↓';
        }

        function toggleSelect(row) {
            const index = selectedRows.value.findIndex(r => r[props.rowKey] === row[props.rowKey]);
            if (index >= 0) {
                selectedRows.value.splice(index, 1);
            } else {
                selectedRows.value.push(row);
            }
            emit('selection-change', selectedRows.value);
            emit('select', row);
        }

        function isSelected(row) {
            return selectedRows.value.some(r => r[props.rowKey] === row[props.rowKey]);
        }

        function toggleExpand(row) {
            const key = row[props.rowKey];
            const index = expandedKeys.value.indexOf(key);
            if (index === -1) {
                expandedKeys.value.push(key);
            } else {
                expandedKeys.value.splice(index, 1);
            }
            emit('expand-change', expandedKeys.value);
        }

        function isExpanded(row) {
            return expandedKeys.value.includes(row[props.rowKey]);
        }

        return {
            currentRow,
            sortedData,
            expandedKeys,
            selectedRows,
            sortConditions,
            handleRowClick,
            handleHeaderClick,
            getSortIcon,
            toggleSelect,
            isSelected,
            toggleExpand,
            isExpanded
        };
    }
};
</script>

<style lang="scss" scoped>
.u-table2 {
    width: auto;
    overflow: auto;
    white-space: nowrap;

    .u-table-header {
        min-width: 100% !important;
        width: fit-content;
        background-color: #f5f7fa;
    }

    .u-table-body {
        min-width: 100% !important;
        width: fit-content;
    }

    .u-table-sticky {
        position: sticky;
        top: 0;
        z-index: 10;
    }

    .u-table-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        border-bottom: 1rpx solid #ebeef5;
        overflow: hidden;
    }

    .u-table-cell {
        flex: 1;
        display: flex;
        flex-direction: row;
        padding: 5px 4px;
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .u-table-fixed-left {
        position: sticky;
        left: 0;
        z-index: 9;
    }

    .u-table-fixed-right {
        position: sticky;
        right: 0;
        z-index: 9;
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
}
</style>
