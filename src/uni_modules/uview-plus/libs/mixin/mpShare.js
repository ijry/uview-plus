
export default {
    data() {
        return {
            mpShare: {
                title: '', // 默认为小程序名称
                path: '', // 默认为当前页面路径
                imageUrl: '' // 默认为当前页面的截图 
            }
        }
    },
    onShareAppMessage() {
        return this.mpShare;
    }
}
