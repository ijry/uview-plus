# Cropper 裁剪框限制在图片内（inner）设计

## 背景

GitHub issue [#921](https://github.com/ijry/uview-plus/issues/921) 反馈：当前移动图片时，图片可以移到截图框外面，希望增加属性，支持限制在截图框内（裁剪结果不含空白区域）。

`u-cropper` 已存在未文档化的 `inner` 属性，实现了该能力：

- 拖动时夹紧图片位置，使裁剪框始终落在图片范围内
- 缩小时不允许缩到裁剪框超出图片
- 初始化时保证显示尺寸至少覆盖裁剪框
- 开启后强制关闭旋转（避免旋转后边界计算失效）

文档与示例未暴露该属性，用户无法发现；`chooseImage` 路径与 prop 初始化路径在旋转禁用上存在不一致。

## 目标

1. 将 `inner` 作为官方可发现 API 补齐文档与示例
2. 保持默认 `false`，不破坏现有行为
3. 修齐 `chooseImage` 与 prop 在 `inner` 模式下的旋转禁用逻辑
4. `inner + canChangeSize` 时，调整裁剪框尺寸/位置也不得超出图片

## 非目标

- 不新增 `limitInside` 等别名
- 不改默认行为
- 不做 pan/scale 边界算法的大规模重构
- 本次不强制同步 `uview-ultra`（若后续需要可另开任务）

## 方案选择

采用「文档 + 示例 + 小修」方案：

| 方案 | 说明 | 结论 |
| --- | --- | --- |
| A 只补文档示例 | 成本最低 | 不修 `chooseImage` 旋转不一致 |
| B 文档 + 示例 + 小修 | 满足 issue 并堵住明显缺口 | **采用** |
| C 重写 clamp 工具化 | 更干净但回归面大 | 本次不做 |

## API

### Props

| 参数 | 说明 | 类型 | 默认值 | 可选值 |
| --- | --- | --- | --- | --- |
| inner | 是否限制裁剪框始终在图片内；开启后不可旋转 | boolean | false | true / false |

### chooseImage params

`chooseImage(index, params, data)` 的 `params.inner` 与 prop 同语义，可临时覆盖。

### 行为约定

1. `inner=false`（默认）
   - 图片可自由拖出裁剪框（现状）
   - 旋转受 `canRotate` 控制
2. `inner=true`
   - 初始显示尺寸至少盖住裁剪框
   - 拖动：裁剪框 ⊆ 图片
   - 缩放：不允许缩到裁剪框超出图片
   - 旋转：强制关闭（隐藏旋转按钮；手势旋转关闭）
3. `inner + canChangeSize`
   - 调整裁剪框时，目标矩形不得超出当前图片显示区域
   - 仍受屏幕边界与最小宽高约束

## 实现要点

### 1. 对齐 chooseImage 旋转逻辑

现状：

- `created`：`letRotate = (canRotate === false || inner === true) ? 0 : 1`
- `chooseImage`：仅 `letRotate = canRotate === false ? 0 : 1`，忽略 `inner`

修改：

```js
this.isin = inner === true ? 1 : 0
this.letRotate = (canRotate === false || this.isin) ? 0 : 1
```

并同步 `btnWidth` / `btnDsp`（已有 isin 分支，保持）。

### 2. 既有 clamp 逻辑（保持）

以下逻辑已存在，不改语义，仅必要时做小修：

- `drawInit`：`isin` 时保证 `useWidth/useHeight` 不小于裁剪框
- `move` 双指缩放：`isin` 时拒绝导致裁剪框出界的缩小
- `move` 单指拖动：`isin` 时夹紧 `posWidth/posHeight`

### 3. resize 时限制在图片内

当 `letChangeSize && isin` 且用户拖动四角控制点时：

1. 先算新的 `left/top/width/height`
2. 校验最小尺寸与屏幕边界（现有）
3. 再校验新裁剪框是否完全落在当前缩放后的图片矩形内
4. 不满足时优先夹紧到图片边界；若夹紧实现明显复杂，则丢弃该帧非法 resize。

### 4. 文档

路径：`uview-plus-doc/docs/components/cropper.md`（与组件同父目录文档仓）

- Props 表增加 `inner`
- 注意事项补充：`inner=true` 时禁用旋转；适合头像等「禁止留白」场景
- 可选增加简短代码示例

### 5. 示例页

路径：`src/pages/componentsD/cropper/cropper.nvue`

新增一组「限制在图片内」示例，例如：

```vue
<up-cropper
  ref="avatarRefInner"
  :inner="true"
  :canChangeSize="false"
  areaWidth="300rpx"
  areaHeight="300rpx"
  exportWidth="260rpx"
  exportHeight="260rpx"
  @confirm="cutImage"
>
  ...
</up-cropper>
```

或通过 `chooseImage` 传 `inner: true`。

### 6. changelog

在 `src/uni_modules/uview-plus/changelog.md` 顶部（或当前版本段）记录：

- 文档/示例暴露 `inner`
- 修复 `chooseImage` 开启 `inner` 时未禁用旋转的问题
- resize 在 inner 模式下限制在图片内

## 文件改动清单

| 文件 | 改动 |
| --- | --- |
| `src/uni_modules/uview-plus/components/u-cropper/u-cropper.vue` | 对齐 `letRotate`；可选 resize clamp |
| `src/pages/componentsD/cropper/cropper.nvue` | 增加 `inner` 示例 |
| `D:/Repos/xyito/open/uview-plus-doc/docs/components/cropper.md` | Props + 注意事项 |
| `src/uni_modules/uview-plus/changelog.md` | 变更说明 |

## 测试计划

1. 默认模式：图片可拖出裁剪框，行为与改前一致
2. `inner=true`（prop）：
   - 拖动不能使裁剪框露出图片外区域
   - 缩小到临界后不再缩小
   - 无旋转按钮，无法旋转
3. `chooseImage(..., { inner: true })`：
   - 同上
   - 旋转被禁用（验证本次修复）
4. `inner=true + canChangeSize=true`：
   - 拖角放大/缩小不超出图片与屏幕
5. 确认导出结果在 `inner` 模式下不出现因移出导致的大面积空白（在 fillColor 为 transparent 时）

## 风险与兼容

- 默认 `inner=false`，存量调用无行为变化
- `inner=true` 强制禁旋转是既有设计，文档需写清，避免用户误以为 bug
- 旋转后的 AABB 边界未在 `inner` 模式支持；保持「禁旋转」比补旋转边界更稳妥

## 验收标准

- [ ] 文档列出 `inner` 及副作用
- [ ] demo 可演示限制在图片内
- [ ] `chooseImage` 与 prop 的旋转禁用一致
- [ ] 默认行为无回归
- [ ] changelog 已记录

## 实现顺序建议

1. 修 `chooseImage` 的 `letRotate` 对齐
2. 补 resize 图片边界限制
3. 更新示例页
4. 更新文档与 changelog
