export default {
    video: {
        // 视频地址
        src: '',
        // 封面图，首次播放前展示
        poster: '',
        // 标题，显示在顶部信息栏
        title: '',
        width: '100%',
        height: '211px',
        radius: '',
        objectFit: 'contain',
        autoplay: false,
        loop: false,
        muted: false,
        // 指定开始播放的位置，单位秒
        initialTime: 0,
        // 是否显示自绘控制层
        controls: true,
        // 未播放时是否显示中间的大播放按钮
        showCenterPlayBtn: true,
        showFullscreenBtn: true,
        // 顶部返回按钮，只在全屏时有意义
        showBack: false,
        backIcon: 'arrow-left',
        // 播放中控制层自动隐藏的毫秒数，0 表示不自动隐藏
        autoHide: 4000,
        // 是否显示锁屏按钮
        showLock: true,
        // 倍速
        showRate: true,
        rate: 1,
        rateList: [0.5, 0.75, 1, 1.25, 1.5, 2],
        // 音量，取值 0-1
        showVolume: true,
        volume: 1,
        // 弹幕
        enableDanmu: false,
        danmuList: [],
        danmuBtn: true,
        danmuOpen: true,
        danmuColor: '#ffffff',
        danmuFontSize: 14,
        // 一条滚动弹幕走完全屏所需秒数
        danmuDuration: 8,
        // full 全屏 / half 上半屏 / top 顶部三行
        danmuArea: 'full',
        danmuOpacity: 1,
        // 同屏最大弹幕数
        danmuMax: 30,
        // 选集
        episodes: [],
        episodeIndex: 0,
        episodeColumns: 5,
        // 播完自动跳下一集
        autoNext: true,
        // 广告：[{ type: 'preroll'|'pause'|'postroll', src, image, duration, skipAfter, link, text }]
        ads: [],
        // 原生手势，自绘进度条时默认关闭，避免与拖动冲突
        enableProgressGesture: false,
        pageGesture: false,
        vslideGesture: false,
        // 全屏方向，-1 表示由系统根据视频宽高决定
        direction: -1,
        autoPauseIfNavigate: true,
        autoPauseIfOpenNative: true,
        // 自定义 video 节点 id，留空则自动生成
        videoId: '',
        // 进度条与选中态颜色
        activeColor: '#2979ff'
    }
}
