import { defineMixin } from '../../libs/vue'
import { registerComponentProps } from '../../libs/config/props.js'
import NovelReaderDefaultProps from './novelReader'

const defProps = registerComponentProps(NovelReaderDefaultProps)

export const props = defineMixin({
    props: {
        chapters: {
            type: Array,
            default: () => defProps.novelReader.chapters
        },
        currentChapter: {
            type: Object,
            default: () => defProps.novelReader.currentChapter
        },
        loading: {
            type: Boolean,
            default: () => defProps.novelReader.loading
        },
        error: {
            type: Object,
            default: () => defProps.novelReader.error
        },
        bookId: {
            type: [String, Number],
            default: () => defProps.novelReader.bookId
        },
        storageKey: {
            type: String,
            default: () => defProps.novelReader.storageKey
        },
        persist: {
            type: Boolean,
            default: () => defProps.novelReader.persist
        },
        initialProgress: {
            type: Object,
            default: () => defProps.novelReader.initialProgress
        },
        progress: {
            type: Object,
            default: () => defProps.novelReader.progress
        },
        initialBookmarks: {
            type: Array,
            default: () => defProps.novelReader.initialBookmarks
        },
        bookmarks: {
            type: Array,
            default: () => defProps.novelReader.bookmarks
        },
        defaultSettings: {
            type: Object,
            default: () => ({ ...defProps.novelReader.defaultSettings })
        },
        settings: {
            type: Object,
            default: () => defProps.novelReader.settings
        },
        mode: {
            type: String,
            default: () => defProps.novelReader.mode
        },
        showBack: {
            type: Boolean,
            default: () => defProps.novelReader.showBack
        },
        autoBack: {
            type: Boolean,
            default: () => defProps.novelReader.autoBack
        },
        backIcon: {
            type: String,
            default: () => defProps.novelReader.backIcon
        },
        safeAreaInsetTop: {
            type: Boolean,
            default: () => defProps.novelReader.safeAreaInsetTop
        },
        safeAreaInsetBottom: {
            type: Boolean,
            default: () => defProps.novelReader.safeAreaInsetBottom
        },
        preloadThreshold: {
            type: Number,
            default: () => defProps.novelReader.preloadThreshold
        },
        pageAnimation: {
            type: Boolean,
            default: () => defProps.novelReader.pageAnimation
        },
        controlsAutoHide: {
            type: Number,
            default: () => defProps.novelReader.controlsAutoHide
        }
    }
})

export default props
