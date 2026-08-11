export default {
    novelReader: {
        chapters: [],
        currentChapter: null,
        loading: false,
        error: null,
        bookId: '',
        storageKey: '',
        persist: true,
        initialProgress: null,
        progress: null,
        initialBookmarks: [],
        bookmarks: null,
        defaultSettings: {
            theme: 'day',
            fontSize: 18,
            lineHeight: 1.8,
            paragraphSpacing: 16,
            contentWidth: '92%',
            fontFamily: 'system',
            fontWeight: 400,
            animation: true
        },
        settings: null,
        mode: 'scroll',
        showBack: true,
        autoBack: false,
        backIcon: 'arrow-left',
        safeAreaInsetTop: true,
        safeAreaInsetBottom: true,
        preloadThreshold: 2,
        pageAnimation: true,
        controlsAutoHide: 0
    }
}
