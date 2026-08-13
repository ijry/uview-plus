# APP-PLUS 画布高清导出实施计划

目标：修复 APP-PLUS 下海报、二维码和条码默认导出像素不足导致的模糊问题。

架构：up-canvas 统一计算默认导出目标尺寸，仅 APP-PLUS 使用设备 DPR；业务组件继续按逻辑尺寸绘制，并移除覆盖统一策略的同值显式目标尺寸。

## 任务 1：统一 APP-PLUS 默认高清导出

- 修改 src/uni_modules/uview-plus/components/u-canvas/u-canvas.vue 的 toTempFilePath：未提供 destWidth / destHeight 时，APP-PLUS 使用 Math.round(width * this.dpr) 和 Math.round(height * this.dpr)，其他平台保持逻辑尺寸。
- 新增 scripts/verify-app-canvas-hidpi.mjs，静态检查 APP-PLUS 条件、DPR 计算和显式参数优先级。
- 在 package.json 增加 verify:app-canvas-hidpi。

## 任务 2：让海报、二维码和条码使用统一策略

- 删除 u-poster、u-qrcode、u-barcode 中与逻辑尺寸相同的 destWidth / destHeight。
- 在回归脚本中检查三个调用方不再覆盖统一策略。

## 任务 3：验证和提交

- 运行新增脚本、verify:up-canvas-unification 和 git diff --check。
- 提交信息使用中文，并包含 head 和 body 两部分。
