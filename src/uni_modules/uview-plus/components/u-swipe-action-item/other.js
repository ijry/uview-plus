export default {
	data() {
		return {
			state: {
				moving: false,
				startX: 0,
				startY: 0,
				buttonsWidth: 0
			}
		}
	},
	watch: {
		status(newValue) {
			if (this.disabled) return
			// 打开或关闭单元格
			if (newValue === 'close' && this.status === 'open') {
				this.closeSwipeAction(instance, ownerInstance)
			} else if(newValue === 'open' && this.status === 'close') {
				this.openSwipeAction()
			}
		},
		options(newVal) {
			this.getBtnWidth()
		}
	},
	mounted() {
		this.getBtnWidth()
	},
    methods: {
		clickHandler() {
		},		setStatus(status) {			this.status = status		},
		getBtnWidth() {
			let view = uni.createSelectorQuery().in(this).select(".u-swipe-action-item__right");
			view.fields({
				size: true,
				scrollOffset: true
				}, data => {
					this.state.buttonsWidth = data.width
					// console.log("得到节点信息" + JSON.stringify(data));
			}).exec();
		},
        // 开始触摸
        touchstart(event) {
			// console.log(event)
			// 标识当前为滑动中状态
			this.state.moving = true
			// 记录触摸开始点的坐标值
			var touches = event.touches
			this.state.startX = touches[0].pageX
			this.state.startY = touches[0].pageY
			
			// todo关闭其它
			// this.$parent && this.$parent.closeOther(this)
        },
        touchmove(event) {
            // console.log(event)
			if (this.disabled || !this.state.moving) return
			var touches = event.touches
			var pageX = touches[0].pageX
			var pageY = touches[0].pageY
			var moveX = pageX - this.state.startX
			var moveY = pageY - this.state.startY

			// 移动的X轴距离大于Y轴距离，也即终点与起点位置连线，与X轴夹角小于45度时，禁止页面滚动
			if (Math.abs(moveX) > Math.abs(moveY) || Math.abs(moveX) > this.threshold) {
				event.preventDefault && event.preventDefault()
				event.stopPropagation && event.stopPropagation()
			}
			// 如果移动的X轴距离小于Y轴距离，也即终点位置与起点位置连线，与Y轴夹角小于45度时，认为是页面上下滑动，而不是左右滑动单元格
			if (Math.abs(moveX) < Math.abs(moveY)) return

			// 限制右滑的距离，不允许内容部分往右偏移，右滑会导致X轴偏移值大于0，以此做判断
			// 此处不能直接return，因为滑动过程中会缺失某些关键点坐标，会导致错乱，最好的办法就是
			// 在超出后，设置为0
			if (this.status === 'open') {
				// 在开启状态下，向左滑动，需忽略
				if (moveX < 0) moveX = 0
				// 想要收起菜单，最大能移动的距离为按钮的总宽度
				if (moveX > this.state.buttonsWidth) moveX = this.state.buttonsWidth
				// 如果是已经打开了的状态，向左滑动时，移动收起菜单
				this.moveSwipeAction(-this.state.buttonsWidth + moveX)
			} else {
				// 关闭状态下，右滑动需忽略
				if (moveX > 0) moveX = 0
				// 滑动的距离不允许超过所有按钮的总宽度，此时只能是左滑，最终设置按钮的总宽度，同时为负数
				if (Math.abs(moveX) > this.state.buttonsWidth) moveX = -this.state.buttonsWidth
				// 只要是在滑过程中，就不断移动单元格内容部分，从而使隐藏的菜单显示出来
				this.moveSwipeAction(moveX)
			}
        },
        touchend(event) {
            // console.log(event)
			if (!this.state.moving || this.disabled) return
			this.state.moving = false
			var touches = event.changedTouches ? event.changedTouches[0] : {}
			var pageX = touches.pageX
			var pageY = touches.pageY
			var moveX = pageX - this.state.startX
			if (this.status === 'open') {
				// 在展开的状态下，继续左滑，无需操作
				if (moveX < 0) return
				// 在开启状态下，点击一下内容区域，moveX为0，也即没有进行移动，这时执行收起菜单逻辑
				if (moveX === 0) {
					return this.closeSwipeAction()
				}
				// 在开启状态下，滑动距离小于阈值，则默认为不关闭，同时恢复原来的打开状态
				if (Math.abs(moveX) < this.threshold) {
					this.openSwipeAction()
				} else {
					// 如果滑动距离大于阈值，则执行收起逻辑
					this.closeSwipeAction()
				}
			} else {
				// 在关闭的状态下，右滑，无需操作
				if (moveX > 0) return
				// 理由同上
				if (Math.abs(moveX) < this.threshold) {
					this.closeSwipeAction()
				} else {
					this.openSwipeAction()
				}
			}
        },
		// 一次性展开滑动菜单
		openSwipeAction() {
			// 处理duration单位问题
			var duration = this.getDuration(this.duration)
			// 展开过程中，是向左移动，所以X的偏移应该为负值
			var buttonsWidth = -this.state.buttonsWidth
			this.sliderStyle = {
				'transition': 'transform ' + duration,
				'transform': 'translateX(' + buttonsWidth + 'px)',
				'-webkit-transform': 'translateX(' + buttonsWidth + 'px)',
			}
			this.setStatus('open')
		},
		// 一次性收起滑动菜单
		closeSwipeAction() {
			// 处理duration单位问题
			var duration = this.getDuration(this.duration)
			this.sliderStyle = {
				'transition': 'transform ' + duration,
				'transform': 'translateX(0px)',
				'-webkit-transform': 'translateX(0px)'
			}
			// 设置各个隐藏的按钮为收起的状态
			// for (var i = this.state.buttonsWidth - 1; i >= 0; i--) {
			// 	buttons[i].setStyle({
			// 		'transition': 'transform ' + duration,
			// 		'transform': 'translateX(0px)',
			// 		'-webkit-transform': 'translateX(0px)'
			// 	})
			// }
			this.setStatus('close')
		},
		// 移动滑动选择器内容区域，同时显示出其隐藏的菜单
		moveSwipeAction(moveX) {
			// 设置菜单内容部分的偏移
			this.sliderStyle = {
				'transition': 'none',
				transform: 'translateX(' + moveX + 'px)',
				'-webkit-transform': 'translateX(' + moveX + 'px)'
			}
		},
		// 获取过渡时间
		getDuration(value) {
			if (value.toString().indexOf('s') >= 0) return value
			return value > 30 ? value + 'ms' : value + 's'
		}
    }
}
