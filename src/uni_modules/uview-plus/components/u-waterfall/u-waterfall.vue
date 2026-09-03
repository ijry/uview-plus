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
                windowHeight: 0,
                distributionQueue: [],
                distributionRunning: false,
                distributionPromise: null,
                distributionGeneration: 0,
                // 每个分配循环持有独立令牌：锁被强制重置后新循环接管，旧循环恢复时只能安静退出
                distributionRunToken: 0
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
                        if (!this.isPureAppend(nVal, oVal)) {
                            this.redistributeData(nVal);
                            return;
                        }
                        // 取差值，即这一次数组变化新增的部分
                        const startIndex = Array.isArray(oVal) && oVal.length > 0 ? oVal.length : 0;
                        // 纯追加时只将新增数据加入共享分配队列
                        this.handleData(nVal.slice(startIndex));
                    }
                },
                immediate: true
            },
            columns: {
                handler() {
                    // 重新分配数据
                    if (this.copyFlowList.length > 0) {
                        this.redistributeData(this.copyFlowList);
                    } else {
                        this.clear(false);
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
                        this.redistributeData(this.copyFlowList);
                    }
                }, 300);
            },

            // 重新分配所有数据
            redistributeData(data = this.copyFlowList) {
                // 强制重置锁状态，确保能重新开始分配
                this.distributionRunning = false;
                this.distributionPromise = null;
                this.clear(false);
                // 保存所有数据
                const allData = this.cloneData(data || []);
                // 重新分配数据
                return this.handleData(allData);
            },

            // 判断新数据是否只在原数组末尾追加
            isPureAppend(newData, oldData) {
                if (!Array.isArray(oldData) || oldData.length === 0) return true;
                if (!Array.isArray(newData) || newData.length < oldData.length) return false;
                return oldData.every((item, index) => {
                    return JSON.stringify(item) === JSON.stringify(newData[index]);
                });
            },

            // 将新增数据加入共享队列，确保只有一个分配循环运行
            handleData(newData) {
                if (!newData || newData.length === 0) {
                    return this.distributionPromise || Promise.resolve();
                }
                this.distributionQueue.push({
                    generation: this.distributionGeneration,
                    data: this.cloneData(newData)
                });
                if (!this.distributionRunning) {
                    this.distributionPromise = this.runDistributionQueue();
                }
                return this.distributionPromise;
            },

            // 串行消费所有待分配数据
            async runDistributionQueue() {
                if (this.distributionRunning) return;
                this.distributionRunning = true;
                const runToken = ++this.distributionRunToken;
                try {
                    while (this.distributionQueue.length > 0) {
                        if (runToken !== this.distributionRunToken) return;
                        const task = this.distributionQueue.shift();
                        if (task.generation !== this.distributionGeneration) continue;
                        await this.distributeData(task.data, task.generation, runToken);
                    }
                } finally {
                    // 仅当自己仍是当前循环时才释放锁，否则会清掉接管者的运行状态
                    if (runToken === this.distributionRunToken) {
                        this.distributionRunning = false;
                        this.distributionPromise = null;
                        if (this.distributionQueue.length > 0) {
                            this.distributionPromise = this.runDistributionQueue();
                        }
                    }
                }
            },

            // 数据被重置或分配循环被接管时，当前循环应立即停止写入
            isStaleDistribution(generation, runToken) {
                return generation !== this.distributionGeneration
                    || runToken !== this.distributionRunToken;
            },

            // 逐项测量并分配数据，代数或令牌变化时立即退出
            async distributeData(newData, generation, runToken) {
                let columnHeights = new Array(this.columnList.length).fill(0);
                for (const item of newData) {
                    if (this.isStaleDistribution(generation, runToken)) return;
                    columnHeights = await this.getColumnHeights();
                    if (this.isStaleDistribution(generation, runToken)) return;

                    const minHeightIndex = this.getMinHeightColumnIndex(columnHeights);
                    this.columnList[minHeightIndex].push(item);

                    await sleep(this.addTime);
                    if (this.isStaleDistribution(generation, runToken)) return;
                    await this.$nextTick();
                    if (this.isStaleDistribution(generation, runToken)) return;
                    try {
                        const rect = await this.$uGetRect(`#u-column-${minHeightIndex}`);
                        if (this.isStaleDistribution(generation, runToken)) return;
                        if (rect.height) {
                            columnHeights[minHeightIndex] = rect.height;
                            this.$emit('after-add-one', {
                                ...item,
                                height: rect.height
                            });
                        }
                    } catch (e) {
                        // 获取不到列高时，下一个元素会重新测量所有列
                    }
                }
                if (this.isStaleDistribution(generation, runToken)) return;
                this.$emit('after-add-all', {
                    columnHeights: columnHeights,
                    newData: newData
                });
            },

            // 获取当前所有列的真实高度
            async getColumnHeights() {
                const columnHeights = new Array(this.columnList.length).fill(0);
                for (let i = 0; i < this.columnList.length; i++) {
                    try {
                        const rect = await this.$uGetRect(`#u-column-${i}`);
                        columnHeights[i] = rect.height || 0;
                    } catch (e) {
                        columnHeights[i] = 0;
                    }
                }
                return columnHeights;
            },

            // 获取最短列；高度相同或暂不可测时按列数据量打散，避免全部落到第一列
            getMinHeightColumnIndex(columnHeights) {
                let minIndex = 0;
                for (let i = 1; i < columnHeights.length; i++) {
                    const currentHeight = Number(columnHeights[i]) || 0;
                    const minHeight = Number(columnHeights[minIndex]) || 0;
                    if (currentHeight < minHeight) {
                        minIndex = i;
                    } else if (currentHeight === minHeight) {
                        const currentLength = this.columnList[i] ? this.columnList[i].length : 0;
                        const minLength = this.columnList[minIndex] ? this.columnList[minIndex].length : 0;
                        if (currentLength < minLength) {
                            minIndex = i;
                        }
                    }
                }
                return minIndex;
            },

            // 复制而不是引用对象和数组
            cloneData(data) {
                return JSON.parse(JSON.stringify(data));
            },
            
            // 清空数据列表
            clear(bak = true) {
                this.distributionGeneration += 1;
                this.distributionQueue.splice(0);
                // 强制重置分配锁状态，避免页面隐藏导致的永久锁死
                this.distributionRunning = false;
                this.distributionPromise = null;
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
