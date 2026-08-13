# APP-PLUS 画布高清导出设计

## 背景

up-canvas 在 APP-PLUS 下默认以逻辑画布宽高导出，高像素比设备上的海报、二维码和条码输出像素不足，容易模糊。问题属于统一画布导出策略，u-poster 是主要暴露场景。

## 方案

up-canvas.toTempFilePath() 区分未指定目标尺寸和显式目标尺寸。APP-PLUS 且未指定目标尺寸时，默认将逻辑裁剪区域宽高乘以初始化时获取的 dpr 后传给平台导出 API；源绘制参数继续使用逻辑坐标，不追加 APP-PLUS 上下文 scale，避免旧版 uni.createCanvasContext 的底层尺寸语义不确定导致重复缩放或裁剪。

海报、二维码和条码删除与逻辑尺寸相同的显式 destWidth / destHeight，让 up-canvas 统一决定默认输出分辨率。显式目标尺寸仍优先，其他平台保持现状。

## 验证

- 新增静态回归脚本，检查 APP-PLUS 默认 DPR 导出、显式参数优先级以及三个调用方不覆盖统一策略。
- 运行新增回归、现有画布统一验证和 diff 检查。
