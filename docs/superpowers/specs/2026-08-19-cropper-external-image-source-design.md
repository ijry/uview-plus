# Cropper 外部图片路径裁剪设计

## 背景

Issue #897 希望业务在自行拍照或选图后，将得到的本地临时图片路径交给 `u-cropper` 直接开始裁剪，而不是再次调用系统图片选择器。

当前组件仅能通过 `chooseImage(index, params, data)` 触发 `uni.chooseImage`。图片信息读取、裁剪框初始化和首次绘制都位于选择器成功回调中，因此外部路径无法复用裁剪流程。组件内部虽然存在 `imageSrc` 和 `avatarSrc` 的历史引用，但没有声明对应 prop，也不会用这些值启动裁剪。

## 目标

- 允许调用方通过现有 `chooseImage` 方法传入图片路径并直接开始裁剪。
- 未传图片路径时，保持现有系统选图行为不变。
- 让外部路径和系统选图共用相同的图片加载及裁剪初始化逻辑。
- 保持现有裁剪配置、事件返回值和插槽触发行为兼容。

## 非目标

- 不增加响应式图片路径 prop，也不在 prop 更新时自动打开裁剪界面。
- 不新增与 `chooseImage` 并行的公开裁剪方法。
- 不改变远程图片的跨域、下载或平台权限规则；传入路径必须能被当前平台的 `uni.getImageInfo` 和画布读取。
- 不调整现有裁剪手势、预览、导出或关闭逻辑。

## 公共 API

扩展现有方法的第二个参数：

```js
cropperRef.value.chooseImage(index, {
  imageSrc: tempFilePath,
  areaWidth: '300rpx',
  areaHeight: '300rpx'
}, data)
```

`params.imageSrc` 为可选字符串：

- 值为非空字符串时，组件跳过 `uni.chooseImage`，直接加载该路径并进入裁剪。
- 缺失、为空字符串或不是字符串时，组件继续调用 `uni.chooseImage`，与当前行为一致。
- `index`、其他 `params` 配置以及 `data` 的含义和优先级保持不变。

## 组件设计

### 配置阶段

`chooseImage(index, params, data)` 继续负责解析临时裁剪配置，并保存 `index` 与 `data`。完成配置后，它读取 `params.imageSrc`：有效时进入外部路径分支，否则进入现有系统选图分支。

### 图片加载阶段

从当前 `select` 成功回调中提取一个共享图片加载方法。该方法接收图片路径，并统一完成：

1. 保存当前原图路径。
2. 调用 `uni.getImageInfo` 获取宽高。
3. 初始化或复用裁剪框尺寸与位置。
4. 根据 `noTab` 决定是否隐藏 tabBar。
5. 调用 `drawInit(true)` 显示并绘制裁剪界面。

系统选图成功后把临时路径交给该方法；外部路径分支直接调用该方法。这样两种入口不会形成两套状态初始化逻辑。

### 选择器阶段

`select()` 仍只负责防重复触发和调用 `uni.chooseImage`。用户取消系统选图时继续触发 `cancel`；外部路径模式没有选择器，因此不会产生选择器取消事件。

组件裁剪界面中的“重选”按钮继续调用 `select()`，即使首次图片来自外部路径，也仍允许用户重新从相册或相机选择图片。

## 错误处理

- 外部路径无法被 `uni.getImageInfo` 读取时，沿用现有图片读取失败提示，并确保 loading 被关闭。
- 图片路径无效时不进入绘制阶段，不改变确认事件结构。
- 缺少有效裁剪框宽高时，沿用现有模态提示。
- 本次不新增自动下载远程 URL 的行为；远程地址是否可用由平台能力和跨域配置决定。

## 兼容性

- 现有 `chooseImage(index, params, data)` 调用无需修改。
- 点击默认插槽仍调用无 `imageSrc` 的 `chooseImage`，继续弹出系统选图。
- `confirm` 返回的 `{ avatar, path, index, data }` 保持不变。
- 所有已支持平台使用同一分支判断，不增加平台条件编译差异。

## 文档与示例

同父目录的 `uview-plus-doc` Cropper 文档需要：

- 在 `chooseImage` 方法参数说明中增加 `params.imageSrc`。
- 增加“裁剪已有临时图片”的调用示例。
- 说明传入有效路径时不会打开系统图片选择器。
- 说明路径必须能被当前平台读取，远程图片仍受跨域和平台限制。

演示页增加一个业务自行选择图片后交给 Cropper 的示例，明确展示两阶段流程：业务先获得临时路径，再通过 `chooseImage` 的 `imageSrc` 参数开始裁剪。

## 验证策略

新增聚焦验证脚本，静态检查以下契约：

- `chooseImage` 读取 `params.imageSrc`。
- 有效 `imageSrc` 分支调用共享图片加载方法而不调用系统选择器。
- 无有效 `imageSrc` 时仍进入 `select()`。
- `select()` 和外部路径分支复用同一个图片加载方法。
- 演示页和文档包含外部临时路径用法。

同时运行现有 `verify:cropper-inner`，确认共享初始化调整没有破坏 `inner` 裁剪约束。

