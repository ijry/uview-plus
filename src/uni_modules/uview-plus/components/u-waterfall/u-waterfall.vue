<template>
    <view class="u-waterfall">
        <!-- 新增支持多列布局 -->
        <view 
            v-for="(column, index) in columnList" 
            :key="index"
            :ref="`u-column-${index}`"
            :id="`u-column-${index}`"
            class="u-column"
        >
            <slot name="column"
                :colIndex="index" 
                :colList="column">
            </slot>
            <slot name="left"
                :colIndex="index" 
                :leftList="column">
            </slot>
            <template v-if="!$slots['left'] && !$slots['column']" v-for="(item, itemIndex) in column" :key="itemIndex">
                <slot :item="item" :itemIndex="itemIndex"></slot>
            </template>
        </view>
    </view>
</template>

<script>
    /**
     * waterfall 瀴布流
     * @description 这是一个瀑布流形式的组件，对原组件进行升级已经支持自定义列数模式，便于适配不同屏幕。搭配loadMore 加载更多组件，让您开箱即用，眼前一亮。
     * @tutorial https://uview-plus.jiangruyi.com/components/waterfall.html
     * @property {Array} flow-list 用于渲染的数据
     * @property {String Number} add-time 单条数据添加到队列的时间间隔，单位ms，见上方注意事项说明（默认200）
     * @property {String Number} columns 瀑布流列数，默认为2，设置为auto时自动根据屏幕宽度调整列数
     * @example <u-waterfall :flowList="flowList"></u-waterfall>
     */
    import { mpMixin } from '../../libs/mixin/mpMixin';
	import { mixin } from '../../libs/mixin/mixin';
    import { sleep } from '../../libs/function/index';
    export default {
        name: "u-waterfall",
        props: {
            // #ifdef VUE2
            value: {
                // 瀑布流数据
                type: Array,
                required: true,
                default: function() {
                    return [];
                }
            },
            // #endif
            // #ifdef VUE3
            modelValue: {
                // 瀑布流数据
                type: Array,
                required: true,
                default: function() {
                    return [];
                }
            },
            // #endif
            // 每次向结构插入数据的时间间隔，单位ms
            // 单位ms
            addTime: {
                type: [Number, String],
                default: 200
            },
            // id值，用于清除某一条数据时，根据此idKey名称找到并移除，如数据为{idx: 22, name: 'lisa'}
            // 那么该把idKey设置为idx
            idKey: {
                type: String,
                default: 'id'
            },
            // 瀑布流列数
            columns: {
                type: [Number, String],
                default: 2
            },
            // 瀑布流最小列数
            columnsMin: {
                type: [Number, String],
                default: 2
            },
            // 最小列宽
            minColumnWidth: {
                type: Number,
                default: 230
            }
        },
        mixins: [mpMixin, mixin],
        data() {
            return {
                columnList: [[]], // 存储每列的数据
                children: [],
                // 用于标记是否已经初始化
                initialized: false,
                windowWidth: 375,
                windowHeight: 0
            }
        },
        watch: {
            copyFlowList: {
                handler(nVal, oVal) {
                    if (!nVal || nVal.length == 0) {
                        this.clear(false);
                    } else {
                        if (this.columnList.length == 1) {
                            this.initColumnList()
                        }
                        // 取差值，即这一次数组变化新增的部分
                        let startIndex = Array.isArray(oVal) && oVal.length > 0 ? oVal.length : 0;
                        // 直接处理数据，不再使用tempList和splitData
                        this.handleData(nVal.slice(startIndex));
                    }
                },
                immediate: true
            },
            columns: {
                handler() {
                    this.initColumnList();
                    // 重新分配数据
                    if (this.copyFlowList.length > 0) {
                        this.redistributeData();
                    }
                },
                immediate: false
            }
        },
        created() { 
            this.initColumnList();
        },
        mounted() {
            this.initialized = true;
            // 添加窗口大小变化监听
            // #ifdef H5
            if (this.columns === 'auto') {
                uni.onWindowResize(this.handleWindowResize);
            }
            // #endif
        },
        // 添加beforeUnmount生命周期清理事件监听
        // #ifdef VUE3
        beforeUnmount() {
            // #ifdef H5
            if (this.columns === 'auto') {
                uni.offWindowResize(this.handleWindowResize);
            }
            // #endif
        },
        // #endif
        // #ifdef VUE2
        beforeDestroy() {
            // #ifdef H5
            if (this.columns === 'auto') {
                window.removeEventListener('resize', this.handleWindowResize);
            }
            // #endif
        },
        // #endif
        computed: {
            // 破坏flowList变量的引用，否则watch的结果新旧值是一样的
            copyFlowList() {
                // #ifdef VUE3
                if (!this.modelValue || this.modelValue.length == 0) {
                    // console.log('clear');
                    return [];
                } else {
                    return this.cloneData(this.modelValue);
                }
                // #endif
                // #ifdef VUE2
                return this.cloneData(this.value);
                // #endif
            }
        },
        emits: ['update:modelValue', 'after-add-one', 'after-add-all'],
        methods: {
            // 初始化列数据数组
            initColumnList() {
                this.windowWidth = uni.getSystemInfoSync().windowWidth;
                const cols = this.getColumnsCount();
                // console.log(cols)
                this.columnList = Array.from({ length: cols }, () => []);
            },
            
            // 获取列数，支持auto模式
            getColumnsCount() {
                if (this.columns === 'auto') {
                    // 列间距为10rpx(约等于7px)
                    const columnGap = 7;
                    // 计算可容纳的列数
                    let columnCount = Math.max(1, Math.floor(this.windowWidth / (this.minColumnWidth + columnGap)));
                    if (columnCount < this.columnsMin) {
                        columnCount = this.columnsMin
                    }
                    return columnCount;
                }
                return parseInt(this.columns) || 2;
            },
            
            // 窗口大小变化处理函数
            handleWindowResize(res) {
                this.windowWidth = res.size.windowWidth
                this.windowHeight = res.size.windowHeight
                // 防抖处理，避免频繁触发
                if (this.resizeTimer) {
                    clearTimeout(this.resizeTimer);
                }
                this.resizeTimer = setTimeout(() => {
                    const newColumnsCount = this.getColumnsCount();
                    const oldColumnsCount = this.columnList.length;
                    
                    // 只有列数发生变化时才重新分配数据
                    if (newColumnsCount !== oldColumnsCount) {
                        this.redistributeData();
                    }
                }, 300);
            },
            
            // 重新分配所有数据
            async redistributeData() {
                // 清空所有列
                this.initColumnList();
                // 保存所有数据
                const allData = this.cloneData(this.copyFlowList);
                // 重新分配数据
                this.handleData(allData);
            },
            
            // 处理新增数据
            async handleData(newData) {
                if (!newData || newData.length === 0) return;
                
                // 初始化列高度数组
                const columnHeights = new Array(this.columnList.length).fill(0);
                
                // 获取各列当前高度
                for (let i = 0; i < this.columnList.length; i++) {
                    try {
                        const rect = await this.$uGetRect(`#u-column-${i}`);
                        // console.log(`#u-column-${i}`, rect.height)
                        columnHeights[i] = rect.height || 0;
                    } catch (e) {
                        columnHeights[i] = 0;
                    }
                }
                
                // 分配新数据到最短的列
                for (let item of newData) {
                    const minHeightIndex = columnHeights.indexOf(Math.min(...columnHeights));
                    // console.log('this.columnList', this.columnList)
                    this.columnList[minHeightIndex].push(item);
                    
                    // 获取实际渲染后的元素高度而不是估算
                    await sleep(this.addTime)
                    await this.$nextTick(async () => {
                        try {
                            const rect = await this.$uGetRect(`#u-column-${minHeightIndex}`);
                            // console.log(`#u-column-${minHeightIndex}`, rect.height)
                            if (rect.height) {
                                columnHeights[minHeightIndex] = rect.height;
                                // 加载一个后置事件
                                this.$emit('after-add-one', {
                                    ...item,
                                    height: rect.height
                                });
                            }
                        } catch (e) {
                            // console.log(e)
                            // columnHeights[i] = 0;
                        }
                    });
                    // this.$nextTick(async () => {
                    //     try {
                    //         // 等待DOM更新后获取实际高度
                    //         const lastIndex = this.columnList[minHeightIndex].length - 1;
                    //         const el = this.$refs[`u-column-${minHeightIndex}`][0].children[lastIndex];
                    //         if (el) {
                    //             const rect = await this.$uGetRect(el);
                    //             const actualHeight = rect.height || 100;
                    //             columnHeights[minHeightIndex] += actualHeight;
                    //         } else {
                    //             // 备用方案：如果无法获取实际高度，则使用默认值
                    //             columnHeights[minHeightIndex] += 100;
                    //         }
                    //     } catch (e) {
                    //         // 出错时使用默认高度
                    //         console.log(e)
                    //         columnHeights[minHeightIndex] += 100;
                    //     }
                    // });
                }
                // 加载所有后置事件
                this.$emit('after-add-all', {
                    columnHeights: columnHeights,
                    newData: newData
                });
            },

            // 复制而不是引用对象和数组
            cloneData(data) {
                return JSON.parse(JSON.stringify(data));
            },
            
            // 清空数据列表
            clear(bak = true) {
                this.initColumnList();
                // 同时清除父组件列表中的数据
                if (bak) {
                    // #ifdef VUE2
                    this.$emit('input', []);
                    // #endif
                    // #ifdef VUE3
                    this.$emit('update:modelValue', []);
                    // #endif
                }
            },
            
            // 清除某一条指定的数据，根据id实现
            remove(id) {
                // 遍历所有列查找并删除数据
                for (let i = 0; i < this.columnList.length; i++) {
                    const index = this.columnList[i].findIndex(val => val[this.idKey] == id);
                    if (index !== -1) {
                        this.columnList[i].splice(index, 1);
                        break;
                    }
                }
                
                // 同时清除父组件的数据中的对应id的条目
                // #ifdef VUE2
                const valueIndex = this.value.findIndex(val => val[this.idKey] == id);
                if (valueIndex !== -1) {
                    const newValue = this.cloneData(this.value);
                    newValue.splice(valueIndex, 1);
                    this.$emit('input', newValue);
                }
                // #endif
                // #ifdef VUE3
                const modelValueIndex = this.modelValue.findIndex(val => val[this.idKey] == id);
                if (modelValueIndex !== -1) {
                    const newModelValue = this.cloneData(this.modelValue);
                    newModelValue.splice(modelValueIndex, 1);
                    this.$emit('update:modelValue', newModelValue);
                }
                // #endif
            },
            
            // 修改某条数据的某个属性
            modify(id, key, value) {
                let found = false;
                let targetItem = null;
                
                // 在所有列中查找数据
                for (let i = 0; i < this.columnList.length; i++) {
                    const index = this.columnList[i].findIndex(val => val[this.idKey] == id);
                    if (index !== -1) {
                        // 修改对应key的值
                        this.columnList[i][index][key] = value;
                        targetItem = this.columnList[i][index];
                        found = true;
                        break;
                    }
                }
                
                if (found && targetItem) {
                    // 修改父组件的数据中的对应id的条目
                    // #ifdef VUE2
                    const valueIndex = this.value.findIndex(val => val[this.idKey] == id);
                    if (valueIndex !== -1) {
                        let data = this.cloneData(this.value);
                        data[valueIndex][key] = value;
                        this.$emit('input', data);
                    }
                    // #endif
                    // #ifdef VUE3
                    const modelValueIndex = this.modelValue.findIndex(val => val[this.idKey] == id);
                    if (modelValueIndex !== -1) {
                        let data = this.cloneData(this.modelValue);
                        data[modelValueIndex][key] = value;
                        this.$emit('update:modelValue', data);
                    }
                    // #endif
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .u-waterfall {
        @include flex;
        flex-direction: row;
        align-items: flex-start;
    }

    .u-column {
        @include flex;
        flex: 1;
        flex-direction: column;
        overflow: hidden;
        /* #ifndef APP-NVUE */
        height: 100%;
        /* #endif */
        // 添加列之间的间距
        &:not(:first-child) {
            margin-left: 10rpx;
        }
    }

    .u-image {
        /* #ifndef APP-NVUE */
        max-width: 100%;
        /* #endif */
    }
</style>