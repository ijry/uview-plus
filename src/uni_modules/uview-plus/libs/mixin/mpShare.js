import { defineMixin } from '../vue'
import { queryParams } from '../function/index'
export const mpShare = defineMixin({
    data() {
        return {
            mpShare: {
                title: '', // 默认为小程序名称
                path: '', // 默认为当前页面路径
                imageUrl: '' // 默认为当前页面的截图 
            }
        }
    },
    async onLoad(options) {
        var pages = getCurrentPages();
        var page = pages[pages.length - 1];
        this.mpShare.path = page.route + queryParams(options);
    },
    onShareAppMessage(res) {
        if (res.from === 'button') {// 来自页面内分享按钮
            console.log(res.target)
        }
        return this.mpShare;
    }
})

export default mpShare
