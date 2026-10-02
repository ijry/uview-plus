# 组件清单

> 本文件由 `scripts/gen-skill-references.mjs` 从源码生成，请勿手改。

共 140 个组件。表中是推荐的 `up-` 写法，把前缀换成 `u-` 或 `u--` 等价可用。

**清单里没有的名字就是不存在**，不要凭印象拼组件名。查一个组件的属性、事件、插槽：

- `components/u-<名字>/u-<名字>.vue` 顶部 JSDoc 的 `@property` / `@event`，是最完整的一手说明
- `components/u-<名字>/props.js` 是属性的真实默认值（部分组件没有这个文件，属性直接写在 `.vue` 里）
- `types/comps/<驼峰名>.d.ts` 是 TS 类型（覆盖常用组件，不是全部）

例如 `up-button` 对应 `components/u-button/u-button.vue`、`components/u-button/props.js`、`types/comps/button.d.ts`。

| 组件 | 说明 | 文档 |
| --- | --- | --- |
| `up-action-sheet` | 本组件用于从底部弹出一个操作菜单，供用户选择并返回结果。本组件功能类似于uni的uni.showActionSheetAPI，配置更加灵活，所有平台都表现一致。 | [文档](https://uview-plus.jiangruyi.com/components/actionSheet.html) |
| `up-action-sheet-data` | - | - |
| `up-agreement` | - | - |
| `up-album` | 本组件提供一个类似相册的功能，让开发者开发起来更加得心应手。减少重复的模板代码 | [文档](https://uview-plus.jiangruyi.com/components/album.html) |
| `up-alert` | 警告提示，展现需要关注的信息。 | [文档](https://uview-plus.jiangruyi.com/components/alertTips.html) |
| `up-avatar` | 本组件一般用于展示头像的地方，如个人中心，或者评论列表页的用户头像展示等场所。 | [文档](https://uview-plus.jiangruyi.com/components/avatar.html) |
| `up-avatar-group` | 本组件一般用于展示头像的地方，如个人中心，或者评论列表页的用户头像展示等场所。 | [文档](https://uview-plus.jiangruyi.com/components/avatar.html) |
| `up-back-top` | 本组件一个用于长页面，滑动一定距离后，出现返回顶部按钮，方便快速返回顶部的场景。 | [文档](https://uview-plus.jiangruyi.com/components/backTop.html) |
| `up-badge` | 该组件一般用于图标右上角显示未读的消息数量，提示用户点击，有圆点和圆包含文字两种形式。 | [文档](https://uview-plus.jiangruyi.com/components/badge.html) |
| `up-barcode` | - | - |
| `up-box` | box盒子一般为左边一个盒子，右侧两个等高的半盒组成，常用于App首页座位重点突出。 | [文档](https://uview-plus.jiangruyi.com/components/box.html) |
| `up-button` | Button 按钮 | [文档](https://uview-plus.jiangruyi.com/components/button.html) |
| `up-calendar` | 此组件用于单个选择日期，范围选择日期等，日历被包裹在底部弹起的容器中. | [文档](https://uview-plus.jiangruyi.com/components/calendar.html) |
| `up-calendar-strip` | 单行横向日期日历，支持切月、下拉展开完整月历 | - |
| `up-canvas` | 当平台无法给出真实测量值时的兜底。必须区分全角/半角： | - |
| `up-car-keyboard` | 此为uview-plus自定义的键盘面板，内含了数字键盘，车牌号键，身份证号键盘3种模式，都有可以打乱按键顺序的选项。 | [文档](https://uview-plus.jiangruyi.com/components/keyboard.html) |
| `up-card` | 卡片组件一般用于多个列表条目，且风格统一的场景 | [文档](https://uview-plus.jiangruyi.com/components/card.html) |
| `up-cascader` | - | - |
| `up-cate-tab` | - | - |
| `up-cell` | cell单元格一般用于一组列表的情况，比如个人中心页，设置页等。 | [文档](https://uview-plus.jiangruyi.com/components/cell.html) |
| `up-cell-group` | cell单元格一般用于一组列表的情况，比如个人中心页，设置页等。 | [文档](https://uview-plus.jiangruyi.com/components/cell.html) |
| `up-checkbox` | 复选框组件一般用于需要多个选择的场景，该组件功能完整，使用方便 | [文档](https://uview-plus.jiangruyi.com/components/checkbox.html) |
| `up-checkbox-group` | 复选框组件一般用于需要多个选择的场景，该组件功能完整，使用方便 | [文档](https://uview-plus.jiangruyi.com/components/checkbox.html) |
| `up-choose` | - | - |
| `up-circle-progress` | 展示操作或任务的当前进度，比如上传文件，是一个圆形的进度环。 | [文档](https://uview-plus.jiangruyi.com/components/circleProgress.html) |
| `up-city-locate` | - | - |
| `up-code` | 考虑到用户实际发送验证码的场景，可能是一个按钮，也可能是一段文字，提示语各有不同，所以本组件 不提供界面显示，只提供提示语，由用户将提示语嵌入到具体的场景 | [文档](https://uview-plus.jiangruyi.com/components/code.html) |
| `up-code-input` | 该组件一般用于验证用户短信验证码的场景，也可以结合uview-plus的键盘组件使用 | [文档](https://uview-plus.jiangruyi.com/components/codeInput.html) |
| `up-col` | 该组件一般用于Layout 布局 通过基础的 12 分栏，迅速简便地创建布局 | [文档](https://uview-plus.jiangruyi.com/components/Layout.html) |
| `up-collapse` | 通过折叠面板收纳内容区域 | [文档](https://uview-plus.jiangruyi.com/components/collapse.html) |
| `up-collapse-item` | 通过折叠面板收纳内容区域（搭配u-collapse使用） | [文档](https://uview-plus.jiangruyi.com/components/collapse.html) |
| `up-color-picker` | - | - |
| `up-column-notice` | 该组件用于滚动通告场景，是其中的垂直滚动方式 | [文档](https://uview-plus.jiangruyi.com/components/noticeBar.html) |
| `up-copy` | - | - |
| `up-count-down` | 该组件一般使用于某个活动的截止时间上，通过数字的变化，给用户明确的时间感受，提示用户进行某一个行为操作。 | [文档](https://uview-plus.jiangruyi.com/components/countDown.html) |
| `up-count-to` | 该组件一般用于需要滚动数字到某一个值的场景，目标要求是一个递增的值。 | [文档](https://uview-plus.jiangruyi.com/components/countTo.html) |
| `up-coupon` | - | - |
| `up-cropper` | - | - |
| `up-datetime-picker` | 此选择器用于时间日期 | [文档](https://uview-plus.jiangruyi.com/components/datetimePicker.html) |
| `up-divider` | 区隔内容的分割线，一般用于页面底部"没有更多"的提示。 | [文档](https://uview-plus.jiangruyi.com/components/divider.html) |
| `up-dragsort` | - | - |
| `up-dropdown` | 该组件一般用于向下展开菜单，同时可切换多个选项卡的场景 | [文档](https://uview-plus.jiangruyi.com/components/dropdown.html) |
| `up-dropdown-item` | 该组件一般用于向下展开菜单，同时可切换多个选项卡的场景 | [文档](https://uview-plus.jiangruyi.com/components/dropdown.html) |
| `up-empty` | 该组件用于需要加载内容，但是加载的第一页数据就为空，提示一个"没有内容"的场景， 我们精心挑选了十几个场景的图标，方便您使用。 | [文档](https://uview-plus.jiangruyi.com/components/empty.html) |
| `up-flex` | 通用 flexbox 容器，跨端同名同默认，作为页面 view 的原生落点 | - |
| `up-float-button` | 悬浮按钮常用于屏幕右下角点击展开的操作菜单 | [文档](https://uview-plus.jiangruyi.com/components/floatButton.html) |
| `up-form` | 此组件一般用于表单场景，可以配置Input输入框，Select弹出框，进行表单验证等。 | [文档](https://uview-plus.jiangruyi.com/components/form.html) |
| `up-form-item` | 此组件一般用于表单场景，可以配置Input输入框，Select弹出框，进行表单验证等。 | [文档](https://uview-plus.jiangruyi.com/components/form.html) |
| `up-gap` | 该组件一般用于内容块之间的用一个灰色块隔开的场景，方便用户风格统一，减少工作量 | [文档](https://uview-plus.jiangruyi.com/components/gap.html) |
| `up-goods-sku` | - | - |
| `up-grid` | 宫格组件一般用于同时展示多个同类项目的场景，可以给宫格的项目设置徽标组件(badge)，或者图标等，也可以扩展为左右滑动的轮播形式。 | [文档](https://uview-plus.jiangruyi.com/components/grid.html) |
| `up-grid-item` | 宫格组件一般用于同时展示多个同类项目的场景，可以给宫格的项目设置徽标组件(badge)，或者图标等，也可以扩展为左右滑动的轮播形式。搭配u-grid使用 | [文档](https://uview-plus.jiangruyi.com/components/grid.html) |
| `up-guide` | 全屏首屏引导组件，支持一次性记忆与多页滑动 | - |
| `up-icon` | 基于字体的图标集，包含了大多数常见场景的图标。 | [文档](https://uview-plus.jiangruyi.com/components/icon.html) |
| `up-image` | 此组件为uni-app的image组件的加强版，在继承了原有功能外，还支持淡入动画、加载中、加载失败提示、圆角值和形状等。 | [文档](https://uview-plus.jiangruyi.com/components/image.html) |
| `up-index-anchor` | * @tutorial https://uview-plus.jiangruyi.com/components/indexList.html | [文档](https://uview-plus.jiangruyi.com/components/indexList.html) |
| `up-index-item` | * @tutorial https://uview-plus.jiangruyi.com/components/indexList.html | [文档](https://uview-plus.jiangruyi.com/components/indexList.html) |
| `up-index-list` | 通过折叠面板收纳内容区域 | [文档](https://uview-plus.jiangruyi.com/components/indexList.html) |
| `up-input` | 此组件为一个输入框，默认没有边框和样式，是专门为配合表单组件u-form而设计的，利用它可以快速实现表单验证，输入内容，下拉选择等功能。 | [文档](https://uview-plus.jiangruyi.com/components/input.html) |
| `up-keyboard` | 此为uViw自定义的键盘面板，内含了数字键盘，车牌号键，身份证号键盘3中模式，都有可以打乱按键顺序的选项。 | [文档](https://uview-plus.jiangruyi.com/components/keyboard.html) |
| `up-lazy-load` | 懒加载使用的场景为：页面有很多图片时，APP会同时加载所有的图片，导致页面卡顿，各个位置的图片出现前后不一致等. | [文档](https://uview-plus.jiangruyi.com/components/lazy-load.html) |
| `up-line` | 此组件一般用于显示一根线条，用于分隔内容块，有横向和竖向两种模式，且能设置0.5px线条，使用也很简单 | [文档](https://uview-plus.jiangruyi.com/components/line.html) |
| `up-line-progress` | 展示操作或任务的当前进度，比如上传文件，是一个线形的进度条。 | [文档](https://uview-plus.jiangruyi.com/components/lineProgress.html) |
| `up-link` | 该组件为超链接组件，在不同平台有不同表现形式：在APP平台会通过plus环境打开内置浏览器，在小程序中把链接复制到粘贴板，同时提示信息，在H5中通过window.open打开链接。 | [文档](https://uview-plus.jiangruyi.com/components/link.html) |
| `up-list` | 该组件为高性能列表组件 | [文档](https://uview-plus.jiangruyi.com/components/list.html) |
| `up-list-item` | 该组件为高性能列表组件 | [文档](https://uview-plus.jiangruyi.com/components/list.html) |
| `up-loading-icon` | 此组件为一个小动画，目前用在uView的loadmore加载更多和switch开关等组件的正在加载状态场景。 | [文档](https://uview-plus.jiangruyi.com/components/loading.html) |
| `up-loading-page` | 警此组件为一个小动画，目前用在uView的loadmore加载更多和switch开关等组件的正在加载状态场景。 | [文档](https://uview-plus.jiangruyi.com/components/loading.html) |
| `up-loadmore` | 此组件一般用于标识页面底部加载数据时的状态。 | [文档](https://uview-plus.jiangruyi.com/components/loadMore.html) |
| `up-markdown` | - | - |
| `up-message-input` | 该组件一般用于验证用户短信验证码的场景，也可以结合uView的键盘组件使用 | [文档](https://www.uviewui.com/components/messageInput.html) |
| `up-modal` | 弹出模态框，常用于消息提示、消息确认、在当前页面内完成特定的交互操作。 | [文档](https://uview-plus.jiangruyi.com/components/modul.html) |
| `up-navbar` | 此组件一般用于在特殊情况下，需要自定义导航栏的时候用到，一般建议使用uni-app带的导航栏。 | [文档](https://uview-plus.jiangruyi.com/components/navbar.html) |
| `up-navbar-mini` | 此组件一般用于在全屏页面中，典型的如微信小程序左上角。 | [文档](https://uview-plus.jiangruyi.com/components/navbar-mini.html) |
| `up-no-network` | 该组件无需任何配置，引入即可，内部自动处理所有功能和事件。 | [文档](https://uview-plus.jiangruyi.com/components/noNetwork.html) |
| `up-notice-bar` | 该组件用于滚动通告场景，有多种模式可供选择 | [文档](https://uview-plus.jiangruyi.com/components/noticeBar.html) |
| `up-notify` | 该组件一般用于页面顶部向下滑出一个提示，尔后自动收起的场景 | [文档](* @property {String \| Number} top 到顶部的距离 ( 默认 0 )) |
| `up-novel-reader` | - | - |
| `up-number-box` | 该组件一般用于商城购物选择物品数量的场景。 | [文档](https://uview-plus.jiangruyi.com/components/numberBox.html) |
| `up-number-keyboard` | * @tutorial | [文档](* @property {String} mode 键盘的类型，number-数字键盘，card-身份证键盘) |
| `up-overlay` | 创建一个遮罩层，用于强调特定的页面元素，并阻止用户对遮罩下层的内容进行操作，一般用于弹窗场景 | [文档](https://uview-plus.jiangruyi.com/components/overlay.html) |
| `up-pagination` | - | - |
| `up-parse` | 富文本组件 | [文档](https://github.com/jin-yufeng/mp-html) |
| `up-pdf-reader` | 基于pdf.js的PDF阅读器组件 | [文档](https://uview-plus.jiangruyi.com/components/pdfReader.html) |
| `up-picker` | 选择器 | - |
| `up-picker-column` | * @tutorial url | [文档](url) |
| `up-picker-data` | - | - |
| `up-popover` | 基于tooltip二次封装的popover组件，用于展示更丰富的内容 | [文档](https://www.uviewui.com/components/popover.html) |
| `up-popup` | 弹出层容器，用于展示弹窗、信息提示等内容，支持上、下、左、右和中部弹出。组件只提供容器，内部内容由用户自定义 | [文档](https://uview-plus.jiangruyi.com/components/popup.html) |
| `up-poster` | 用于生成海报的组件，支持文本、图片、二维码等元素 | [文档](https://uview-plus.jiangruyi.com/components/poster.html) |
| `up-pull-refresh` | - | - |
| `up-qrcode` | - | - |
| `up-radio` | 单选框用于有一个选择，用户只能选择其中一个的场景。搭配u-radio-group使用 | [文档](https://uview-plus.jiangruyi.com/components/radio.html) |
| `up-radio-group` | 单选框用于有一个选择，用户只能选择其中一个的场景。搭配u-radio使用 | [文档](https://uview-plus.jiangruyi.com/components/radio.html) |
| `up-rate` | 该组件一般用于满意度调查，星型评分的场景 | [文档](https://uview-plus.jiangruyi.com/components/rate.html) |
| `up-read-more` | 该组件一般用于内容较长，预先收起一部分，点击展开全部内容的场景。 | [文档](https://uview-plus.jiangruyi.com/components/readMore.html) |
| `up-refresh-virtual-list` | - | - |
| `up-row` | 通过基础的 12 分栏，迅速简便地创建布局 | [文档](https://uview-plus.jiangruyi.com/components/layout.html) |
| `up-row-notice` | 水平滚动 | [文档](https://uview-plus.jiangruyi.com/components/noticeBar.html) |
| `up-safe-bottom` | 这个适配，主要是针对IPhone X等一些底部带指示条的机型，指示条的操作区域与页面底部存在重合，容易导致用户误操作，因此我们需要针对这些机型进行底部安全区适配。 | [文档](https://uview-plus.jiangruyi.com/components/safeAreaInset.html) |
| `up-scroll-list` | 该组件一般用于同时展示多个商品、分类的场景，也可以完成左右滑动的列表。 | [文档](https://uview-plus.jiangruyi.com/components/scrollList.html) |
| `up-search` | 搜索组件，集成了常见搜索框所需功能，用户可以一键引入，开箱即用。 | [文档](https://uview-plus.jiangruyi.com/components/search.html) |
| `up-select` | - | - |
| `up-short-video` | - | - |
| `up-signature` | - | - |
| `up-skeleton` | 骨架屏一般用于页面在请求远程数据尚未完成时，页面用灰色块预显示本来的页面结构，给用户更好的体验。 | [文档](https://uview-plus.jiangruyi.com/components/skeleton.html) |
| `up-slider` | - | [文档](https://uview-plus.jiangruyi.com/components/slider.html) |
| `up-status-bar` | 本组件主要用于状态填充，比如在自定导航栏的时候，它会自动适配一个恰当的状态栏高度。 | [文档](https://uview-plus.jiangruyi.com/components/statusBar.html) |
| `up-steps` | 该组件一般用于完成一个任务要分几个步骤，标识目前处于第几步的场景。 | [文档](https://uview-plus.jiangruyi.com/components/steps.html) |
| `up-steps-item` | 本组件需要和u-steps配合使用 | [文档](https://uview-plus.jiangruyi.com/components/steps.html) |
| `up-sticky` | 该组件与CSS中position: sticky属性实现的效果一致，当组件达到预设的到顶部距离时， 就会固定在指定位置，组件位置大于预设的顶部距离时，会重新按照正常的布局排列。 | [文档](https://uview-plus.jiangruyi.com/components/sticky.html) |
| `up-subsection` | 该分段器一般用于用户从几个选项中选择某一个的场景 | [文档](https://uview-plus.jiangruyi.com/components/subsection.html) |
| `up-swipe-action` | 该组件一般用于左滑唤出操作菜单的场景，用的最多的是左滑删除操作 | [文档](https://uview-plus.jiangruyi.com/components/swipeAction.html) |
| `up-swipe-action-item` | 该组件一般用于左滑唤出操作菜单的场景，用的最多的是左滑删除操作 | [文档](https://uview-plus.jiangruyi.com/components/swipeAction.html) |
| `up-swiper` | 该组件一般用于导航轮播，广告展示等场景,可开箱即用 | [文档](https://uview-plus.jiangruyi.com/components/swiper.html) |
| `up-swiper-indicator` | 该组件一般用于导航轮播，广告展示等场景,可开箱即用 | [文档](https://uview-plus.jiangruyi.com/components/swiper.html) |
| `up-switch` | 选择开关一般用于只有两个选择，且只能选其一的场景。 | [文档](https://uview-plus.jiangruyi.com/components/switch.html) |
| `up-tabbar` | 此组件提供了自定义tabbar的能力。 | [文档](https://uview-plus.jiangruyi.com/components/tabbar.html) |
| `up-tabbar-item` | 此组件提供了自定义tabbar的能力。 | [文档](https://uview-plus.jiangruyi.com/components/tabbar.html) |
| `up-table` | 表格组件一般用于展示大量结构化数据的场景 本组件标签类似HTML的table表格，由table、tr、th、td四个组件组成 | [文档](https://uview-plus.jiangruyi.com/components/table.html) |
| `up-table2` | - | - |
| `up-tabs` | tabs标签组件，在标签多的时候，可以配置为左右滑动，标签少的时候，可以禁止滑动。 该组件的一个特点是配置为滚动模式时，激活的tab会自动移动到组件的中间位置。 | [文档](https://uview-plus.jiangruyi.com/components/tabs.html) |
| `up-tabs-item` | tabs标签组件，在标签多的时候，可以配置为左右滑动，标签少的时候，可以禁止滑动。 该组件的一个特点是配置为滚动模式时，激活的tab会自动移动到组件的中间位置。 | [文档](https://uview-plus.jiangruyi.com/components/tabs.html) |
| `up-tabs-pro` | - | - |
| `up-tag` | tag组件一般用于标记和选择，我们提供了更加丰富的表现形式，能够较全面的涵盖您的使用场景 | [文档](https://uview-plus.jiangruyi.com/components/tag.html) |
| `up-td` | * @tutorial url | [文档](url) |
| `up-text` | 此组件集成了文本类在项目中的常用功能，包括状态，拨打电话，格式化日期，*替换，超链接...等功能。 您大可不必在使用特殊文本时自己定义，text组件几乎涵盖您能使用的大部分场景。 | [文档](https://uview-plus.jiangruyi.com/components/loading.html) |
| `up-textarea` | 文本域此组件满足了可能出现的表单信息补充，编辑等实际逻辑的功能，内置了字数校验等 | [文档](https://uview-plus.jiangruyi.com/components/textarea.html) |
| `up-th` | * @tutorial url | [文档](url) |
| `up-title` | - | - |
| `up-toast` | 此组件表现形式类似uni的uni.showToastAPI，但也有不同的地方。 | [文档](https://uview-plus.jiangruyi.com/components/toast.html) |
| `up-toolbar` | * @tutorial https://uview-plus.jiangruyi.com/components/toolbar.html | [文档](https://uview-plus.jiangruyi.com/components/toolbar.html) |
| `up-tooltip` | * @tutorial https://uview-plus.jiangruyi.com/components/tooltip.html | [文档](https://uview-plus.jiangruyi.com/components/tooltip.html) |
| `up-tr` | * @tutorial url | [文档](url) |
| `up-transition` | * @tutorial | [文档](* @property {String} show 是否展示组件 （默认 false ）) |
| `up-tree` | - | - |
| `up-upload` | 该组件用于上传图片场景 | [文档](https://uview-plus.jiangruyi.com/components/upload.html) |
| `up-view` | 对View默认标签的封装 | [文档](https://uview-plus.jiangruyi.com/components/view.html) |
| `up-virtual-list` | - | - |
| `up-waterfall` | 这是一个瀑布流形式的组件，对原组件进行升级已经支持自定义列数模式，便于适配不同屏幕。搭配loadMore 加载更多组件，让您开箱即用，眼前一亮。 | [文档](https://uview-plus.jiangruyi.com/components/waterfall.html) |
