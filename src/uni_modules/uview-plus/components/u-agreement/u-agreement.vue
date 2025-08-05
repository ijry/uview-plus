<style scoped lang="scss">
    .agreement-content {
        width: 100%;;
        display: inline-block;
        flex-direction: column;
        .agreement-url {
            display: inline-block;
            color: blue;
            // #ifdef H5
            cursor: pointer;
            // #endif
        }
    }
</style>

<template>
    <view class="up-agreement">
        <up-modal v-model:show="show" showCancelButton @confirm="confirm" @cancel="close" confirmText="阅读并同意">
            <view class="agreement-content">
                <slot>
                    我们非常重视您的个人信息和隐私保护。为了更好地保障您的个人权益，在您使用我们的产品前，
                    请务必审慎阅读《<text class="agreement-url" @click="urlClick('urlProtocol')">用户协议</text>》
                    和《<text class="agreement-url" @click="urlClick('urlPrivacy')">隐私政策</text>》内的所有条款，
                    尤其是:1.我们对您的个人信息的收集/保存/使用/对外提供/保护等规则条款，以及您的用户权利等条款;2. 约定我们的限制责任、免责
                    条款;3.其他以颜色或加粗进行标识的重要条款。如您对以上协议有任何疑问，请先不要同意，您点击“同意并继续”的行为即表示您已阅读
                    完毕并同意以上协议的全部内容。
                </slot>
            </view>
        </up-modal>
    </view>
</template>

<script>
    export default {
        name: 'up-agreement',
        props: {
            urlProtocol: {
                type: String,
                default: '/pages/user_agreement/agreement/info?title=用户协议'
            },
            urlPrivacy: {
                type: String,
                default: '/pages/user_agreement/agreement/info?title=隐私政策'
            },
        },
        emits: ['confirm'],
        data() {
            return {
                show: false
            }
        },
        methods: {
            close() {
                // #ifdef H5
                window.opener = null;
                window.close();
                // #endif
                // #ifdef APP-PLUS
                plus.runtime.quit();
                // #endif
            },
            confirm() {
                this.show = false;
                this.$emit('confirm', 1);
            },
            showModal() {
                this.show = true;
            },
            urlClick(type) {
                uni.navigateTo({
                    url: this[type]
                });
            }
        }
    }
</script>
