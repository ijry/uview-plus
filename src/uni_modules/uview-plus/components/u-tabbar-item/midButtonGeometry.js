const MID_BUTTON_SIZE = 64

export function clampMidButtonBorderClipHeight(value) {
	const height = Number(value)
	if (!Number.isFinite(height)) return 0
	return Math.min(Math.max(height, 0), MID_BUTTON_SIZE)
}

export function calculateMidButtonBorderClipHeight({
	contentTop,
	circleTop,
	borderTopOffset = 0
}) {
	const targetTop = Number(contentTop)
	const currentTop = Number(circleTop)
	const borderOffset = Number(borderTopOffset)
	if (![targetTop, currentTop, borderOffset].every(Number.isFinite)) return 0
	return clampMidButtonBorderClipHeight(targetTop + borderOffset - currentTop)
}
