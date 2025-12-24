import { defineMixin } from '../vue'

export const buttonMixin = defineMixin({
    props: {
        lang: String,
        sessionFrom: String,
        sendMessageTitle: String,
        sendMessagePath: String,
        sendMessageImg: String,
        showMessageCard: Boolean,
        appParameter: String,
        formType: String,
        openType: String
    }
})

export default buttonMixin

