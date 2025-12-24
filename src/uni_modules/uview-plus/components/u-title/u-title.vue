<style scoped lang="scss">
    .u-title {
		.u-title-prefix {
		    width: 4px;
		    height: 18px;
		    border-radius: 2px;
		    background: $u-primary;
		    margin-right: 12px;
		    margin-right :10px;
		}
    }
</style>
<template>
    <view class="u-title u-flex-row u-flex-y-center">
        <slot name="prefix">
            <view class="u-title-prefix">
            </view>
        </slot>
        <slot></slot>
    </view>
</template>
<script>
export default {
    name: 'u-title',
    props: {
    },
    data() {
        return {
        }
    },
    created: function () {
    },
    methods: {
    }
}
</script>
