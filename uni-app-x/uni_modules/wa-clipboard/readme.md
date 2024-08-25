# uts剪切板

目前支持uni-app x的App-Android和App-iOS。用于补充uni-app x目前没有剪贴板api的遗憾。也可以看源码作为uts插件开发的学习例子。

Android使用是老版Android api，比较简单，编译时有个warning，不影响使用。

未处理权限。

导入插件到工程后，使用的示例代码如下。

核心是导入的{setClipboardData,getClipboardData}，这2个方法。

这个示例，界面上有一个输入框，2个按钮。set时把输入框里的文字set到剪切板。get时从剪切板获取文字打印到控制台。

```ts
<template>
	<view style="padding: 10px;">
		<input ref="inputclip" style="border: 1px;height: 36px;" />
		<button @click="setCLIP">set</button>
		<button @click="getCLIP">get</button>
	</view>
</template>

<script>
	import {setClipboardData,getClipboardData} from "@/uni_modules/wa-clipboard";
	
	export default {
		methods: {
			setCLIP() {
				let t = (this.$refs["inputclip"] as UniInputElement).value
				setClipboardData(t) // 写入剪贴板
			},
			getCLIP() {
				console.log(getClipboardData()); // 获取剪贴板
			}
		}
	}
</script>

```