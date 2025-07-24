<template>
    <view class="u-dragsort"
        :class="[direction == 'horizontal' ? 'u-dragsort--horizontal' : '', direction == 'all' ? 'u-dragsort--all' : '']">
        <movable-area class="u-dragsort-area" :style="movableAreaStyle">
            <movable-view v-for="(item, index) in list" :key="item.id" :id="`u-dragsort-item-${index}`"
                class="u-dragsort-item" :class="{ 'dragging': dragIndex === index }"
                :direction="direction === 'all' ? 'all' : direction" :x="item.x" :y="item.y" :inertia="false"
                :disabled="!draggable || (item.draggable === false)" @change="onChange(index, $event)"
                @touchstart="onTouchStart(index)" @touchend="onTouchEnd" @touchcancel="onTouchEnd">
                <view class="u-dragsort-item-content">
                    <slot :item="item" :index="index">
                        {{ item.label }}
                    </slot>
                </view>
            </movable-view>
        </movable-area>
    </view>
</template>

<script>
import { mpMixin } from '../../libs/mixin/mpMixin';
import { mixin } from '../../libs/mixin/mixin';
import { addStyle, addUnit, sleep } from '../../libs/function/index';
export default {
    name: 'u-dragsort',
    // #ifdef MP
    mixins: [mpMixin, mixin,],
    // #endif
    // #ifndef MP
    mixins: [mixin],
    // #endif
    props: {
        initialList: {
            type: Array,
            required: true,
            default: () => []
        },
        draggable: {
            type: Boolean,
            default: true
        },
        direction: {
            type: String,
            default: 'vertical',
            validator: value => ['vertical', 'horizontal', 'all'].includes(value)
        },
        // 新增列数属性，用于all模式
        columns: {
            type: Number,
            default: 3
        }
    },
    data() {
        return {
            list: [],
            dragIndex: -1,
            itemHeight: 40,
            itemWidth: 80,
            areaWidth: 0, // 可拖动区域宽度
            areaHeight: 0, // 可拖动区域高度
            originalPositions: [], // 保存原始位置
            currentPosition: {
                x: 0,
                y: 0
            }
        };
    },
    computed: {
        movableAreaStyle() {
            if (this.direction === 'vertical') {
                return {
                    height: `${this.list.length * this.itemHeight}px`,
                    width: '100%'
                };
            } else if (this.direction === 'horizontal') {
                return {
                    height: '100%',
                    width: `${this.list.length * this.itemWidth}px`
                };
            } else {
                // all模式，计算网格布局所需的高度
                const rows = Math.ceil(this.list.length / this.columns);
                return {
                    height: `${rows * this.itemHeight}px`,
                    width: '100%'
                };
            }
        }
    },
    emits: ['drag-end'],
    async mounted() {
        await this.$nextTick();
        this.initList();
        this.calculateItemSize();
        this.calculateAreaSize();
    },
    methods: {
        initList() {
            // 初始化列表项的位置
            this.list = this.initialList.map((item, index) => {
                let x = 0, y = 0;

                if (this.direction === 'horizontal') {
                    x = index * this.itemWidth;
                    y = 0;
                } else if (this.direction === 'vertical') {
                    x = 0;
                    y = index * this.itemHeight;
                } else {
                    // all模式，网格布局
                    const col = index % this.columns;
                    const row = Math.floor(index / this.columns);
                    x = col * this.itemWidth;
                    y = row * this.itemHeight;
                }

                return {
                    ...item,
                    x,
                    y
                };
            });
            // 保存初始位置
            this.saveOriginalPositions();
        },
        saveOriginalPositions() {
            // 保存当前位置作为原始位置
            this.originalPositions = this.list.map(item => ({
                x: item.x,
                y: item.y
            }));
        },
        async calculateItemSize() {
            // 计算项目尺寸
            await sleep(30);
            return new Promise((resolve) => {
                uni.createSelectorQuery()
                    .in(this)
                    .select('.u-dragsort-item-content')
                    .boundingClientRect(res => {
                        if (res) {
                            this.itemHeight = res.height || 40;
                            this.itemWidth = res.width || 80;

                            // 更新所有项目的位置
                            this.updatePositions();
                            // 保存原始位置
                            this.saveOriginalPositions();
                        }
                        resolve(res);
                    })
                    .exec();
            });
        },
        async calculateAreaSize() {
            // 计算可拖动区域尺寸
            await sleep(30);
            return new Promise((resolve) => {
                uni.createSelectorQuery()
                    .in(this)
                    .select('.u-dragsort-area')
                    .boundingClientRect(res => {
                        if (res) {
                            this.areaWidth = res.width || 300;
                            this.areaHeight = res.height || 300;
                        }
                        resolve(res);
                    })
                    .exec();
            });
        },
        updatePositions() {
            // 更新所有项目的位置
            this.list.forEach((item, index) => {
                if (this.direction === 'vertical') {
                    item.y = index * this.itemHeight;
                    item.x = 0;
                } else if (this.direction === 'horizontal') {
                    item.x = index * this.itemWidth;
                    item.y = 0;
                } else {
                    // all模式，网格布局
                    const col = index % this.columns;
                    const row = Math.floor(index / this.columns);
                    item.x = col * this.itemWidth;
                    item.y = row * this.itemHeight;
                }
            });
        },
        onTouchStart(index) {
            this.dragIndex = index;
            // 保存当前位置作为原始位置
            this.saveOriginalPositions();
        },
        onChange(index, event) {
            if (!event.detail.source || event.detail.source !== 'touch') return;

            this.currentPosition.x = event.detail.x;
            this.currentPosition.y = event.detail.y;

            // all模式下使用更智能的位置计算
            if (this.direction === 'all') {
                this.handleAllModeChange(index);
            } else {
                // 原有的垂直和水平模式逻辑
                let itemSize = 0;
                let targetIndex = -1;

                if (this.direction === 'vertical') {
                    itemSize = this.itemHeight;
                    targetIndex = Math.max(0, Math.min(
                        Math.round(this.currentPosition.y / itemSize),
                        this.list.length - 1
                    ));
                } else if (this.direction === 'horizontal') {
                    itemSize = this.itemWidth;
                    targetIndex = Math.max(0, Math.min(
                        Math.round(this.currentPosition.x / itemSize),
                        this.list.length - 1
                    ));
                }

                // 如果位置发生变化，则重新排序
                if (targetIndex !== index) {
                    this.reorderItems(index, targetIndex);
                }
            }
        },
        handleAllModeChange(index) {
            // 在all模式下，根据当前位置计算最近的网格位置
            const col = Math.max(0, Math.min(Math.round(this.currentPosition.x / this.itemWidth), this.columns - 1));
            const row = Math.max(0, Math.round(this.currentPosition.y / this.itemHeight));

            // 计算目标索引
            let targetIndex = row * this.columns + col;
            targetIndex = Math.max(0, Math.min(targetIndex, this.list.length - 1));

            // 如果位置发生变化，则重新排序
            if (targetIndex !== index) {
                this.reorderItems(index, targetIndex);
            }
        },
        reorderItems(fromIndex, toIndex) {
            const movedItem = this.list.splice(fromIndex, 1)[0];
            this.list.splice(toIndex, 0, movedItem);

            // 震动反馈
            if (uni.vibrateShort) {
                uni.vibrateShort();
            }

            // 更新当前拖拽项目的新索引
            this.dragIndex = toIndex;

            // 更新所有项目的位置
            this.updatePositions();

            // 保存当前位置作为原始位置
            this.saveOriginalPositions();
        },
        onTouchEnd() {
            // 0.001是为了解决拖动过快等某些极限场景下位置还原不生效问题
            if (this.direction === 'horizontal') {
                this.list[this.dragIndex].x = this.currentPosition.x + 0.001;
            } else if (this.direction === 'vertical' || this.direction === 'all') {
                this.list[this.dragIndex].y = this.currentPosition.y + 0.001;
                this.list[this.dragIndex].x = this.currentPosition.x + 0.001;
            }

            // 重置到位置，需要延迟触发动，否则无效。
            sleep(50).then(() => {
                this.list.forEach((item, index) => {
                    item.x = this.originalPositions[index].x;
                    item.y = this.originalPositions[index].y;
                });
                this.dragIndex = -1;
                this.$emit('drag-end', [...this.list]);
            });
        }
    },
    watch: {
        initialList: {
            handler() {
                this.$nextTick(() => {
                    this.initList();
                });
            },
            deep: true
        },
        direction: {
            handler() {
                this.$nextTick(() => {
                    this.initList();
                    this.calculateItemSize();
                    this.calculateAreaSize();
                });
            }
        },
        columns: {
            handler() {
                if (this.direction === 'all') {
                    this.$nextTick(() => {
                        this.initList();
                        this.updatePositions();
                        this.saveOriginalPositions();
                    });
                }
            }
        }
    }
};
</script>

<style scoped lang="scss">
.u-dragsort {
    width: 100%;

    .u-dragsort-area {
        width: 100%;
        position: relative;
    }

    .u-dragsort-item {
        position: absolute;
        width: 100%;

        &.dragging {
            z-index: 1000;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .u-dragsort-item-content {
            padding: 0px;
            text-align: center;
            box-sizing: border-box;
            padding-bottom: 6px;
            border-radius: 8rpx;
            transition: all 0.3s ease;
        }
    }

    &.u-dragsort--horizontal {
        .u-dragsort-area {
            display: flex;
            white-space: nowrap;
            height: auto;
        }

        .u-dragsort-item {
            display: flex;
            width: auto;
            height: 100%;
        }
    }

    &.u-dragsort--all {
        .u-dragsort-area {
            height: auto;
        }

        .u-dragsort-item {
            width: auto;
            height: auto;
        }
    }
}
</style>
