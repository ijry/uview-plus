/**
 * u-video 弹幕引擎的纯逻辑部分（归一化、时间游标、轨道分配）。
 * 与 video-utils.js 一样不引入 uni / vue，方便 Node 端直接做行为断言。
 */

// 同一轨道上两条弹幕之间的最小像素间隔
const TRACK_GAP = 20

const DANMU_TYPES = ['scroll', 'top', 'bottom']

export function normalizeDanmuItem(item) {
    const danmu = typeof item === 'string' ? { text: item } : (item || {})
    const time = Number(danmu.time)
    return {
        text: danmu.text === undefined || danmu.text === null ? '' : String(danmu.text),
        color: danmu.color || '',
        time: Number.isFinite(time) && time > 0 ? time : 0,
        type: DANMU_TYPES.includes(danmu.type) ? danmu.type : 'scroll'
    }
}

// 按出现时间升序排列，播放过程中只需要向后推进游标
export function normalizeDanmuList(list) {
    if (!Array.isArray(list)) return []
    return list
        .map(normalizeDanmuItem)
        .filter((item) => item.text !== '')
        .sort((a, b) => a.time - b.time)
}

// 二分查找第一条「时间点不早于 time」的弹幕，拖动进度条后用它重置游标
export function findDanmuCursor(list, time) {
    if (!Array.isArray(list) || !list.length) return 0
    const target = Number(time)
    let low = 0
    let high = list.length
    while (low < high) {
        const middle = (low + high) >> 1
        if (list[middle].time < target) {
            low = middle + 1
        } else {
            high = middle
        }
    }
    return low
}

// 粗略估算弹幕宽度：中文按一个字宽，其余按 0.55 字宽
export function estimateDanmuWidth(text, fontSize) {
    const size = Number(fontSize) > 0 ? Number(fontSize) : 14
    const content = String(text === undefined || text === null ? '' : text)
    let units = 0
    for (const char of content) {
        units += char.charCodeAt(0) > 0x2e80 ? 1 : 0.55
    }
    return Math.ceil(units * size) + size
}

export function createDanmuState() {
    return { tracks: [] }
}

export function resetDanmuState(state) {
    if (state) state.tracks = []
    return state
}

/**
 * 取一条空闲轨道，全部占用时返回 -1（该条弹幕直接丢弃）。
 * 滚动弹幕在尾巴完全进场后即可复用轨道；hold 用于顶/底部固定弹幕。
 */
export function acquireDanmuTrack(state, options = {}) {
    const {
        now = 0,
        itemWidth = 0,
        containerWidth = 0,
        duration = 8,
        trackCount = 1,
        hold = 0
    } = options
    if (!state) return -1
    const total = Math.max(1, Math.floor(trackCount))
    let busyFor = Number(hold)
    if (!Number.isFinite(busyFor) || busyFor <= 0) {
        const distance = Number(containerWidth) + Number(itemWidth)
        const speed = distance > 0 ? distance / (Number(duration) * 1000) : 0
        busyFor = speed > 0 ? (Number(itemWidth) + TRACK_GAP) / speed : 0
    }
    for (let index = 0; index < total; index++) {
        const freeAt = state.tracks[index]
        if (freeAt === undefined || now >= freeAt) {
            state.tracks[index] = now + busyFor
            return index
        }
    }
    return -1
}
