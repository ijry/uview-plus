export default {
    props: {
        // PDF文件地址
        src: {
            type: String,
            default: ''
        },
        // 组件高度
        height: {
            type: String,
            default: '700px'
        },
        // pdfjs资源域名
        baseUrl: {
            type: String,
            default: 'https://uview-plus.jiangruyi.com/h5'
        }
    }
}