export default {
    audio: {
        // 音频地址，支持单个地址或地址数组（多源，加载失败自动切换）
        src: '',
        // 标题，显示在音频条上
        title: '',
        // 是否循环播放
        loop: false,
        // 是否显示倍速切换
        showRate: true,
        // 可切换的倍速档位
        rateList: [0.5, 0.75, 1, 1.25, 1.5, 2],
        // 主题色（播放按钮、进度条选中色）
        activeColor: '#2979ff',
        // 是否显示标题
        showTitle: true
    }
}
