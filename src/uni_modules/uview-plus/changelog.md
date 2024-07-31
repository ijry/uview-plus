## 3.3.8（2024-07-31）
feat: slider支持进度条任意位置触发按钮拖动

fix: 修复app-vue下modal标题不居中

fix: #459 TS setConfig 声明异常

feat: tabs组件增加longPress长按事件

feat: 新增showRight属性控制collapse右侧图标显隐

fix: 优化nvue下css警告

## 3.3.7（2024-07-29）
feat: 支持IndexList组件支持在弹窗等场景下使用及联动优化

feat: popup组件支持v-model:show双向绑定

feat: 优化tabs的current双向绑定

fix: checkbox独立使用时checked赋初始值可以，但是手动切换时值没有做双向绑定！ #455

feat: slider组件支持区间双滑块

fix: toast 支持自定义图标？可传入了决对路径的 icon也没有用 #409

feat: form-item校验失败时 增加class方便自定义显示错误的展示方式 #394

fix: up-cell的required配置不生效 #395

fix: 横向滚动组件，微信小程序编译后会有警告 #415

fix: u-picker内部对默认值defaultIndex的监听 #425

feat: toast 组件支持遮掩层穿透  #417

fix: 兼容vue的slot编译bug #423

fix: upload 微信小程序 点击预览视频报错 #424

fix: u-number-box 组件修改【integer, decimalLength, min, max 】props时没有触发绑定值更新 #429

feat: Tabs组件能否支持自定义插槽 #439

feat: ActionSheet 可以配置最大高度吗， 我当做select使用了。 #445

fix: cursor-pointer优化

feat: 新版slider组件兼容NVUE改造

feat: 新增slider组件手动实现以支持样式自定义

perf：补充TS声明提示信息

修复：ActionSheet 操作菜单cancelText属性为空DOM节点还存在并且可以点击问题

fix: 去除预留的beforeDestroy兼容容易在某些sdk下不识别条件编译

## 3.3.6（2024-07-23）
feat: u-album组件添加radius,shape参数，定义参考当前u-image参数

fix: 修复了calendar组件title和日期title未垂直居中的问题

fix: update:modelValue缺失emit定义

## 3.3.5（2024-07-10）
picker组件支持hasInput模式

## 3.3.4（2024-07-07）
fix: input组件双向绑定问题 #419

lazy-load完善emit

优化通用小程序分享

## 3.3.2（2024-06-27）
fix: 在Nvue环境中编译，出现大量警告 #406
## 3.3.1（2024-06-27）
u-button组件报错，找不到button mixins #407
## 3.3.0（2024-06-27）
feat: checkbox支持label设置slot

feat: modal增加customClass

feat: navbar、popup、tabs、text支持customClass

fix: cell组建缺少flex布局

fix: 修复微信小程序真机调试时快速输入出现文本回退问题

feat: tag增加默认slot

公共mixin改造为按需导入语法

refactor: 组件props混入mixin改造为按需导入语法

fix: u-tabbar 安卓手机点击按钮变蓝问题 #396

feat: upload组建增加extension属性

fix: upload组件参数mode添加left

fix: 修复阴影在非nvue时白色背景色不显示

## 3.2.24（2024-06-11）
fix: 修复时间选择器confirm事件触发时机导致2次才会触发v-model更新
## 3.2.23（2024-05-30）
fix: #378 H5 u-input 在表单中初始值为空也会触发一次 formValidate(this,"change")事件导致进入页面直接校验了一次

fix: #373 搜索组件up-search的@clear事件无效

fix: #372 ActionSheet 组件的取消按钮触发区域太小

## 3.2.22（2024-05-13）
上传组件支持微信小程序预览视频

修复折叠面板右侧箭头不显示

修复uxp2px

## 3.2.21（2024-05-10）
fix: loading-icon修复flex布局
## 3.2.20（2024-05-10）
修复瀑布流大小写#355
## 3.2.19（2024-05-10）
去除意外的文件引入
## 3.2.18（2024-05-09）
fix: 349 popup 组件设置 zIndex 属性后，组件渲染异常#
feat: 搜索框增加adjustPosition属性
fix: #331增加u-action-sheet__cancel
优化mixin兼容性
feat: #326 up-list增加下拉刷新功能
fix: #319 优化up-tabs参数与定义匹配
fix: index-list组件微信小程序端使用自定义导航栏异常
fix: #285 pickerimmediateChange 写死为true
fix: #111 u-scroll-list组件,隐藏指示器后报错, 提示找不到ref
list增加微信小程序防抖配置

## 3.2.17（2024-05-08）
fix: 支付宝小程序二维码渲染
## 3.2.16（2024-05-06）
修复tabs中，当前激活样式的undefined bug

fix: #341u-code 倒计时没结束前退出，再次进入结束后退出界面，再次进入重新开始倒计时bug

受到uni-app内置text样式影响修复

## 3.2.15（2024-04-28）
优化时间选择器hasInput模式初始化值
## 3.2.14（2024-04-24）
去除pleaseSetTranspileDependencies

http采用useStore

## 3.2.13（2024-04-22）
修复modal标题样式

优化日期选择器hasInput模式宽度

## 3.2.12（2024-04-22）
修复color应用
## 3.2.11（2024-04-18）
修复import化带来的问题
## 3.2.10（2024-04-17）
完善input清空事件App端失效的兼容性

修复日历组件二次打开后当前月份显示不正确

## 3.2.9（2024-04-16）
组件内uni.$u用法改为import引入

规范化及兼容性增强

## 3.2.8（2024-04-15）
修复up-tag语法错
## 3.2.7（2024-04-15）
修复下拉菜单背景色在支付宝小程序无效

setConfig改为浅拷贝解决无法用import导入代替uni.$u.props设置

## 3.2.6（2024-04-14）
修复某些情况下滑动单元格默认右侧按钮是展开的问题
## 3.2.5（2024-04-13）
调整分段器尺寸及修复窗口大小改变时重新计算尺寸

多个组件支持cursor-pointer增强PC端体验

## 3.2.4（2024-04-12）
初步支持typescript
## 3.2.3（2024-04-12）
fix: 修复square属性在小程序下无效问题

fix:修复lastIndex异常导致的column异常问题

fix: alipayapp picker style

feat(button): 添加用户同意隐私协议事件回调

fix: input switch password

fix: 修复u-code组件keepRuning失效问题

feat: form-item添加labelPosition属性

新增dropdown组件

分段器支持内部current值

优化cell和action-sheet视觉大小

修复tabs文字换行

## 3.2.2（2024-04-11）
修复换行符问题
## 3.2.1（2024-04-11）
修复演示H5二维码

fix: #270 ReadMore 展开阅读更多内容变化兼容

fix: #238Calendar组件maxDate修改为不能小于minDate

checkbox支持独立使用

修复popup中在微信小程序中真机调试滚动失效

## 3.2.0（2024-04-10）
修复轮播图在nvue显示
修复疑似u-slider名称被占用导致slider在App下不显示
解决微信小程序提示 Some selectors are not allowed in component wxss
示例中u-前缀统一为up-
增加瀑布流与图片懒加载组件
fix: #308修复tag组件缺失iconColor参数
fix: #297使用grid布局解决目前编译为抖音小程序无法开启virtualHost
## 3.1.52（2024-04-07）
工具类方法调用import化改造
新增up-copy复制组件
## 3.1.51（2024-04-07）
优化时间选择器自带输入框格式化显示
防止按钮文字换行
修复订单列表模板滑动
增加u-qrcode二维码组件
## 3.1.49（2024-03-27）
日期时间组件支持自带输入框
fix: popup弹窗滚动穿透问题
fix: 修复小程序numberbox bug
## 3.1.48（2024-03-18）
fix:[plugin:uni:pre-css] Unbalanced delimiter found in string
## 3.1.47（2024-03-18）
fix: setConfig设置组件默认参数无效问题
fix: 修复自定义图标无效问题
feat: 增加u-form-item单独设置规则变量
fix：#293小程序是自定义导航栏的时候即传了customNavHeight的时候会出现跳转偏移的情况

## 3.1.46（2024-01-29）
beforeUnmount
## 3.1.45（2024-01-24）
fix: #262ext组件为超链接的情况下size属性不生效
fix: #263最新版本3.1.42中微信小程序u-swipe-action-item报错
fix: #224最新版本3.1.42中微信小程序u-swipe-action-item报错
fix: #263支持支付宝小程序
fix: #261u-input在直接修改v-model的绑定值时，每隔一次会无法出发change事件
优化折叠面板兼容微信小程序
## 3.1.42（2024-01-15）
修复u-number-box默认值0时在小程序不显示值
优化u-code的timer判断
优化支付宝小程序下textarea字数统计兼容
优化u-calendar
## 3.1.41（2023-11-18）
#215优化u-cell图标容器间距问题
## 3.1.40（2023-11-16）
修复u-slider双向绑定
## 3.1.39（2023-11-10）
修复头条小程序不支持env(safe-area-inset-bottom)
优化#201u-grid 指定列数导致闪烁
#193IndexList 索引列表 高度错误
其他优化
## 3.1.38（2023-10-08）
修复u-slider
## 3.1.37（2023-09-13）
完善emits定义及修复code-input双向数据绑定
## 3.1.36（2023-08-08）
修复富文本事件名称大小写
## 3.1.35（2023-08-02）
修复编译到支付宝小程序u-form报错
## 3.1.34（2023-07-27）
修复App打包uni.$u.mpMixin方式sdk暂时不支持导致报错
## 3.1.33（2023-07-13）
修复弹窗进入动画、模板页面样式等
## 3.1.31（2023-07-11）
修复dayjs引用
## 3.0.8（2022-07-12）
修复u-tag默认宽度撑满容器
## 3.0.7（2022-07-12）
修复u-navbar自定义插槽演示示例
## 3.0.6（2022-07-11）
修复u-image缺少emits申明
## 3.0.5（2022-07-11）
修复u-upload缺少emits申明
## 3.0.4（2022-07-10）
修复u-textarea/u-input/u-datetime-picker/u-number-box/u-radio-group/u-switch/u-rate在vue3下数据绑定
## 3.0.3（2022-07-09）
启用自建演示二维码
## 3.0.2（2022-07-09）
修复dayjs/clipboard等导致打包报错
## 3.0.1（2022-07-09）
增加插件市场地址
## 3.0.0（2022-07-09）
# uview-plus(vue3)初步发布
