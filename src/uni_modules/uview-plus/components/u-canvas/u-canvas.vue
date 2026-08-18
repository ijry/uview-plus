<template>
    <view
        class="u-canvas"
        :id="rootId"
        :style="{
            width: useRootHeightAndWidth ? '100%' : actualWidth + unit,
            height: useRootHeightAndWidth ? '100%' : actualHeight + unit
        }"
    >
        <!-- #ifdef MP || H5 -->
        <canvas
            class="u-canvas__canvas"
            :id="canvasId"
            :canvas-id="canvasId"
            type="2d"
            :disable-scroll="disableScroll"
            :style="{ width: actualWidth + unit, height: actualHeight + unit }"
            @touchstart="onTouchStart"
            @touchmove="onTouchMove"
            @touchend="onTouchEnd"
        />
        <!-- #endif -->

        <!-- #ifdef APP-PLUS || APP-HARMONY -->
        <!-- #ifndef APP-NVUE -->
        <canvas
            class="u-canvas__canvas"
            :id="canvasId"
            :canvas-id="canvasId"
            :disable-scroll="disableScroll"
            :style="{ width: actualWidth + unit, height: actualHeight + unit }"
            @touchstart="onTouchStart"
            @touchmove="onTouchMove"
            @touchend="onTouchEnd"
        />
        <!-- #endif -->
        <!-- #endif -->

        <!-- #ifdef APP-NVUE -->
        <web-view
            class="u-canvas__canvas"
            ref="web"
            src="/static/app-plus/up-canvas/local.html"
            :style="{ width: actualWidth + unit, height: actualHeight + unit }"
            @onPostMessage="onWebViewMessage"
        />
        <!-- #endif -->
    </view>
</template>

<script>
// #ifdef APP-NVUE
import {
    createWebViewCanvasBridge,
    createWebViewCanvasContext
} from '../../libs/util/app-nvue-webview-canvas.js';
// #endif

export default {
    name: 'u-canvas',
    emits: ['ready', 'touchstart', 'touchmove', 'touchend'],
    props: {
        canvasId: {
            type: String,
            default: () => `u-canvas${Math.floor(Math.random() * 1000000)}`
        },
        width: {
            type: [String, Number],
            default: 300
        },
        height: {
            type: [String, Number],
            default: 300
        },
        unit: {
            type: String,
            default: 'px'
        },
        useRootHeightAndWidth: {
            type: Boolean,
            default: false
        },
        bgColor: {
            type: String,
            default: '#ffffff'
        },
        disableScroll: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            rootId: `u-canvas-root-${Math.floor(Math.random() * 1000000)}`,
            ctx: null,
            widthLocal: this.parseSize(this.width),
            heightLocal: this.parseSize(this.height),
            fontSize: 12,
            fontFamily: 'sans-serif',
            fontWeight: 'normal',
            dpr: 1
        };
    },
    computed: {
        actualWidth() {
            return this.useRootHeightAndWidth ? this.widthLocal : this.parseSize(this.width);
        },
        actualHeight() {
            return this.useRootHeightAndWidth ? this.heightLocal : this.parseSize(this.height);
        }
    },
    watch: {
        width() {
            this.refresh();
        },
        height() {
            this.refresh();
        },
        bgColor() {
            this.clearCanvas();
        }
    },
    created() {
        this._canvasNode = null;
        this._selectorResult = null;
        this._canvasElement = null;
        this._imageCache = Object.create(null);
        this._imageDataCache = Object.create(null);
        this._isNvue = false;
        this._initPromise = null;
        this._webViewBridge = null;
        this._webViewContext = null;
        this._webViewInitSignature = null;
        this._webViewSessionId = null;
    },
    mounted() {
        this.$nextTick(() => {
            this.initCanvas();
        });
    },
    beforeUnmount() {
        if (this._webViewBridge) {
            this._webViewBridge.destroy();
        }
        this._webViewBridge = null;
        this._webViewContext = null;
        this.ctx = null;
    },
    methods: {
        parseSize(value) {
            if (typeof value === 'number') {
                return value;
            }
            if (typeof value !== 'string') {
                return 0;
            }
            if (value.endsWith('rpx') || value.endsWith('upx')) {
                return uni.upx2px(parseFloat(value));
            }
            if (value.endsWith('px')) {
                return parseFloat(value) || 0;
            }
            return parseFloat(value) || 0;
        },
        onTouchStart(event) {
            this.$emit('touchstart', event);
        },
        onTouchMove(event) {
            this.$emit('touchmove', event);
        },
        onTouchEnd(event) {
            this.$emit('touchend', event);
        },
        onWebViewMessage(event) {
            if (this._webViewBridge) {
                this._webViewBridge.handleMessage(event);
            }
        },
        onWebViewTouch(message) {
            const eventType = message.eventType;
            if (!['touchstart', 'touchmove', 'touchend'].includes(eventType)) return;
            this.$emit(eventType, {
                type: eventType,
                detail: {
                    x: message.x,
                    y: message.y
                },
                touches: message.touches || [],
                changedTouches: message.changedTouches || [],
                canvasWidth: message.canvasWidth,
                canvasHeight: message.canvasHeight
            });
        },
        async getCanvasNode(id = this.canvasId, isCanvas = true) {
            return new Promise((resolve) => {
                try {
                    uni.createSelectorQuery()
                        .in(this)
                        .select(`#${id}`)
                        .fields(
                            {
                                node: isCanvas,
                                size: true
                            },
                            (res) => {
                                // #ifdef APP-PLUS || APP-HARMONY
                                resolve(res || {
                                    width: this.actualWidth,
                                    height: this.actualHeight
                                });
                                return;
                                // #endif

                                resolve(res || false);
                            }
                        )
                        .exec();
                } catch (error) {
                    console.error('获取画布节点失败:', error);
                    resolve(false);
                }
            });
        },
        getCanvasElement() {
            return this._canvasElement || null;
        },
        getRawContext() {
            return this.ctx;
        },
        getCanvasContext() {
            // #ifdef APP-NVUE
            return this._webViewContext;
            // #endif

            // #ifdef APP-PLUS || APP-HARMONY
            return uni.createCanvasContext(this.canvasId, this);
            // #endif

            // #ifdef MP || H5
            return this._canvasElement && typeof this._canvasElement.getContext === 'function'
                ? this._canvasElement.getContext('2d')
                : null;
            // #endif
        },
        async setNewSize() {
            const rootNode = await this.getCanvasNode(this.rootId, false);
            if (!rootNode) {
                return;
            }
            if (rootNode.width) {
                this.widthLocal = rootNode.width;
            }
            if (rootNode.height) {
                this.heightLocal = rootNode.height;
            }
        },
        async initCanvas(force = false) {
            if (this._initPromise) {
                return this._initPromise;
            }

            const initPromise = this._initializeCanvas(force);
            this._initPromise = initPromise;

            try {
                return await initPromise;
            } finally {
                if (this._initPromise === initPromise) {
                    this._initPromise = null;
                }
            }
        },
        async _initializeCanvas(force = false) {
            try {
                if (this.useRootHeightAndWidth) {
                    await this.setNewSize();
                }
                // #ifdef APP-NVUE
                if (typeof createWebViewCanvasBridge === 'function') {
                    return await this._initializeWebViewCanvas(force);
                }
                // #endif

                if (this.ctx && !force) {
                    this.$emit('ready', {
                        width: this.actualWidth,
                        height: this.actualHeight
                    });
                    return true;
                }

                this._canvasNode = await this.getCanvasNode(this.canvasId);
                if (!this._canvasNode) {
                    return false;
                }

                this._selectorResult = this._canvasNode;
                this._canvasElement = this._isNvue
                    ? this._canvasNode
                    : (this._canvasNode.node || null);
                const systemInfo = uni.getSystemInfoSync() || {};
                const pixelRatio = Number(systemInfo.pixelRatio) || 1;
                // 微信开发者工具的模拟器预览通常按高密度屏幕缩放，至少使用 2 倍 backing store。
                this.dpr = systemInfo.platform === 'devtools'
                    ? Math.max(pixelRatio, 2)
                    : pixelRatio;

                // #ifdef MP
                if (this._canvasElement) {
                    this._canvasElement.width = Math.ceil(this.actualWidth * this.dpr);
                    this._canvasElement.height = Math.ceil(this.actualHeight * this.dpr);
                }
                // #endif

                this.ctx = this.getCanvasContext();
                if (!this.ctx) {
                    return false;
                }

                // #ifdef MP
                if (typeof this.ctx.setTransform === 'function') {
                    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
                } else if (typeof this.ctx.scale === 'function') {
                    this.ctx.scale(this.dpr, this.dpr);
                }
                // #endif

                this.applyFont();
                this.clearCanvas();
                this.$emit('ready', {
                    width: this.actualWidth,
                    height: this.actualHeight
                });
                return true;
            } catch (error) {
                console.error('初始化Canvas失败:', error);
                return false;
            }
        },
        async _initializeWebViewCanvas(force = false) {
            this._isNvue = true;
            const systemInfo = uni.getSystemInfoSync() || {};
            this.dpr = Math.max(1, Number(systemInfo.pixelRatio) || 1);

            if (!this._webViewBridge) {
                this._webViewBridge = createWebViewCanvasBridge({
                    getWebView: () => this.$refs.web,
                    onTouch: message => this.onWebViewTouch(message),
                    onReady: (message) => {
                        if (
                            this._webViewSessionId &&
                            message.sessionId &&
                            this._webViewSessionId !== message.sessionId
                        ) {
                            this._webViewInitSignature = null;
                        }
                        this._webViewSessionId = message.sessionId || null;
                    },
                    onError: error => console.error('Canvas WebView错误:', error)
                });
                this._webViewContext = createWebViewCanvasContext({
                    bridge: this._webViewBridge,
                    resolveImage: source => this.resolveNvueImageSource(source),
                    measureText: (text, state) => {
                        const matched = String(state.font || '').match(/(\d+(?:\.\d+)?)px/);
                        const fontSize = matched ? Number(matched[1]) : this.fontSize;
                        return { width: this.estimateTextWidth(text, fontSize) };
                    }
                });
                this.ctx = this._webViewContext;
            }

            await this._webViewBridge.ready();
            const signature = [
                this.actualWidth,
                this.actualHeight,
                this.dpr,
                this.disableScroll ? 1 : 0
            ].join(':');
            if (force || this._webViewInitSignature !== signature) {
                await this._webViewBridge.request('init', {
                    width: this.actualWidth,
                    height: this.actualHeight,
                    dpr: this.dpr,
                    disableScroll: this.disableScroll
                });
                this._webViewInitSignature = signature;
                this.applyFont();
                await this.clearCanvas();
            }

            this.$emit('ready', {
                width: this.actualWidth,
                height: this.actualHeight
            });
            return true;
        },
        refresh() {
            return this.initCanvas(true);
        },
        getWidth() {
            return this.actualWidth;
        },
        getHeight() {
            return this.actualHeight;
        },
        clearCanvas() {
            if (!this.ctx) return;
            this.clearRect(0, 0, this.actualWidth, this.actualHeight);
            if (this.bgColor && this.bgColor !== 'transparent') {
                this.beginPath();
                this.rect(0, 0, this.actualWidth, this.actualHeight);
                this.setFillStyle(this.bgColor);
                this.fill();
            }
            return this.draw();
        },
        callContext(method, ...args) {
            if (this.ctx && typeof this.ctx[method] === 'function') {
                return this.ctx[method](...args);
            }
            return undefined;
        },
        rect(x, y, width, height) {
            return this.callContext('rect', x, y, width, height);
        },
        clearRect(x, y, width, height) {
            return this.callContext('clearRect', x, y, width, height);
        },
        fillRect(x, y, width, height) {
            return this.callContext('fillRect', x, y, width, height);
        },
        strokeRect(x, y, width, height) {
            return this.callContext('strokeRect', x, y, width, height);
        },
        fill() {
            return this.callContext('fill');
        },
        stroke() {
            return this.callContext('stroke');
        },
        beginPath() {
            return this.callContext('beginPath');
        },
        closePath() {
            return this.callContext('closePath');
        },
        moveTo(x, y) {
            return this.callContext('moveTo', x, y);
        },
        lineTo(x, y) {
            return this.callContext('lineTo', x, y);
        },
        arc(x, y, radius, startAngle, endAngle, anticlockwise = false) {
            return this.callContext('arc', x, y, radius, startAngle, endAngle, anticlockwise);
        },
        arcTo(x1, y1, x2, y2, radius) {
            return this.callContext('arcTo', x1, y1, x2, y2, radius);
        },
        bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
            return this.callContext('bezierCurveTo', cp1x, cp1y, cp2x, cp2y, x, y);
        },
        quadraticCurveTo(cpx, cpy, x, y) {
            return this.callContext('quadraticCurveTo', cpx, cpy, x, y);
        },
        ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise = false) {
            return this.callContext(
                'ellipse',
                x,
                y,
                radiusX,
                radiusY,
                rotation,
                startAngle,
                endAngle,
                anticlockwise
            );
        },
        clip() {
            return this.callContext('clip');
        },
        save() {
            return this.callContext('save');
        },
        restore() {
            return this.callContext('restore');
        },
        translate(x, y) {
            return this.callContext('translate', x, y);
        },
        rotate(angle) {
            return this.callContext('rotate', angle);
        },
        scale(x, y) {
            return this.callContext('scale', x, y);
        },
        setTransform(a, b, c, d, e, f) {
            return this.callContext('setTransform', a, b, c, d, e, f);
        },
        transform(a, b, c, d, e, f) {
            return this.callContext('transform', a, b, c, d, e, f);
        },
        resetTransform() {
            return this.callContext('resetTransform');
        },
        setFillStyle(color) {
            if (!this.ctx) return;
            if (typeof this.ctx.setFillStyle === 'function') {
                this.ctx.setFillStyle(color);
            } else {
                this.ctx.fillStyle = color;
            }
        },
        setStrokeStyle(color) {
            if (!this.ctx) return;
            if (typeof this.ctx.setStrokeStyle === 'function') {
                this.ctx.setStrokeStyle(color);
            } else {
                this.ctx.strokeStyle = color;
            }
        },
        setLineWidth(width) {
            if (!this.ctx) return;
            if (typeof this.ctx.setLineWidth === 'function') {
                this.ctx.setLineWidth(width);
            } else {
                this.ctx.lineWidth = width;
            }
        },
        setLineCap(lineCap = 'round') {
            if (!this.ctx) return;
            if (typeof this.ctx.setLineCap === 'function') {
                this.ctx.setLineCap(lineCap);
            } else {
                this.ctx.lineCap = lineCap;
            }
        },
        setLineJoin(lineJoin = 'round') {
            if (!this.ctx) return;
            if (typeof this.ctx.setLineJoin === 'function') {
                this.ctx.setLineJoin(lineJoin);
            } else {
                this.ctx.lineJoin = lineJoin;
            }
        },
        setMiterLimit(miterLimit) {
            if (!this.ctx) return;
            if (typeof this.ctx.setMiterLimit === 'function') {
                this.ctx.setMiterLimit(miterLimit);
            } else {
                this.ctx.miterLimit = miterLimit;
            }
        },
        setLineDash(segments = []) {
            return this.callContext('setLineDash', segments);
        },
        getLineDash() {
            const result = this.callContext('getLineDash');
            return Array.isArray(result) ? result : [];
        },
        setTextAlign(align = 'left') {
            if (!this.ctx) return;
            if (typeof this.ctx.setTextAlign === 'function') {
                this.ctx.setTextAlign(align);
            } else {
                this.ctx.textAlign = align;
            }
        },
        setTextBaseline(baseline = 'alphabetic') {
            if (!this.ctx) return;
            if (typeof this.ctx.setTextBaseline === 'function') {
                this.ctx.setTextBaseline(baseline);
            } else {
                this.ctx.textBaseline = baseline;
            }
        },
        setFontSize(fontSize) {
            this.fontSize = Number(fontSize) || this.fontSize;
            if (this.ctx && typeof this.ctx.setFontSize === 'function') {
                this.ctx.setFontSize(this.fontSize);
            }
            this.applyFont();
        },
        setFont(font) {
            if (!this.ctx) return;
            if ('font' in this.ctx) {
                this.ctx.font = font;
                return;
            }
            const matched = String(font).match(/(\d+(?:\.\d+)?)px/);
            if (matched) {
                this.fontSize = Number(matched[1]);
            }
            this.applyFont();
        },
        setGlobalAlpha(alpha) {
            if (!this.ctx) return;
            if (typeof this.ctx.setGlobalAlpha === 'function') {
                this.ctx.setGlobalAlpha(alpha);
            } else {
                this.ctx.globalAlpha = alpha;
            }
        },
        setGlobalCompositeOperation(operation) {
            if (!this.ctx) return;
            if (typeof this.ctx.setGlobalCompositeOperation === 'function') {
                this.ctx.setGlobalCompositeOperation(operation);
            } else {
                this.ctx.globalCompositeOperation = operation;
            }
        },
        setShadow(offsetX = 0, offsetY = 0, blur = 0, color = 'rgba(0,0,0,0)') {
            if (!this.ctx) return;
            if (typeof this.ctx.setShadow === 'function') {
                this.ctx.setShadow(offsetX, offsetY, blur, color);
                return;
            }
            this.ctx.shadowOffsetX = offsetX;
            this.ctx.shadowOffsetY = offsetY;
            this.ctx.shadowBlur = blur;
            this.ctx.shadowColor = color;
        },
        setLineStyle(lineColor, lineWidth) {
            this.setLineCap('round');
            this.setLineJoin('round');
            this.setStrokeStyle(lineColor);
            this.setLineWidth(lineWidth);
        },
        applyFont() {
            if (!this.ctx) return;
            const font = `${this.fontWeight === 'normal' ? '' : `${this.fontWeight} `}${this.fontSize}px ${this.fontFamily}`.trim();
            if ('font' in this.ctx) {
                this.ctx.font = font;
            } else if (typeof this.ctx.setFont === 'function') {
                this.ctx.setFont(font);
            } else if (typeof this.ctx.setFontSize === 'function') {
                this.ctx.setFontSize(this.fontSize);
            }
        },
        fillText(text, x, y) {
            return this.callContext('fillText', String(text), x, y);
        },
        strokeText(text, x, y, maxWidth) {
            if (maxWidth === undefined) {
                return this.callContext('strokeText', String(text), x, y);
            }
            return this.callContext('strokeText', String(text), x, y, maxWidth);
        },
        /**
         * 按字形宽度估算文本宽度
         * @description 当平台无法给出真实测量值时的兜底。必须区分全角/半角：
         *   汉字、假名、全角标点约占一个字号，按半角的 0.6 估算会短 40%，
         *   中文海报因此算出"整段都放得下"而不换行。
         * @param {String} text 待测量文本
         * @param {Number} [fontSize] 字号，默认取组件当前字号
         * @returns {Number} 估算宽度(px)
         * @author jry ijry@qq.com
         */
        estimateTextWidth(text, fontSize) {
            const size = Number(fontSize) || Number(this.fontSize) || 12;
            const FULL_WIDTH = /[ᄀ-ᅟ⺀-〾ぁ-㏿㐀-䶿一-鿿ꀀ-꓏가-힣豈-﫿︰-﹯＀-｠￠-￦]/;
            return Array.from(String(text)).reduce((width, char) => {
                if (FULL_WIDTH.test(char)) return width + size;
                if (/\s/.test(char)) return width + size * 0.28;
                return width + size * 0.56;
            }, 0);
        },
        measureText(text) {
            if (this.ctx && typeof this.ctx.measureText === 'function') {
                const metrics = this.ctx.measureText(String(text));
                const width = Number(metrics && metrics.width);
                // 鸿蒙同步测量恒为 0（真实值只走 callback），上下文未就绪时其他
                // 平台也可能返回 0。绝不能把 0 交给调用方——换行逻辑会把它当成
                // "宽度足够"，于是整段文本挤成一行。
                if (width > 0) return metrics;
            }
            return {
                width: this.estimateTextWidth(text)
            };
        },
        measureTextAsync(text) {
            if (this.ctx && typeof this.ctx.measureTextAsync === 'function') {
                return this.ctx.measureTextAsync(String(text));
            }

            // #ifdef APP-HARMONY
            // 鸿蒙的 CanvasContext.measureText 同步返回值恒为 0，真实宽度只通过
            // callback(webview.evalJSAsync) 回传，因此必须走回调形式。
            if (this.ctx && typeof this.ctx.measureText === 'function' && !this._harmonyMeasureUnavailable) {
                return new Promise((resolve) => {
                    let settled = false;
                    // evalJSAsync 并非所有鸿蒙版本都提供，回调可能永远不来，
                    // 必须兜底避免上层 await 永久挂起。且一旦超时就标记为不可用：
                    // 单次换行要二分测量十几次，逐次干等会把导出拖成十几秒。
                    const timer = setTimeout(() => {
                        if (settled) return;
                        settled = true;
                        this._harmonyMeasureUnavailable = true;
                        resolve({ width: this.estimateTextWidth(text) });
                    }, 300);
                    const done = (metrics) => {
                        if (settled) return;
                        settled = true;
                        clearTimeout(timer);
                        const width = Number(metrics && metrics.width);
                        resolve({ width: width > 0 ? width : this.estimateTextWidth(text) });
                    };
                    try {
                        const sync = this.ctx.measureText(String(text), done);
                        // 若该平台其实同步返回了有效值，直接采用
                        const syncWidth = Number(sync && sync.width);
                        if (syncWidth > 0) done(sync);
                    } catch (error) {
                        done(null);
                    }
                });
            }
            // #endif

            return Promise.resolve(this.measureText(text));
        },
        createLinearGradient(x0, y0, x1, y1) {
            if (this.ctx && typeof this.ctx.createLinearGradient === 'function') {
                return this.ctx.createLinearGradient(x0, y0, x1, y1);
            }
            return null;
        },
        createRadialGradient(x0, y0, r0, x1, y1, r1) {
            if (this.ctx && typeof this.ctx.createRadialGradient === 'function') {
                return this.ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
            }
            return null;
        },
        createPattern(image, repetition = 'repeat') {
            if (this.ctx && typeof this.ctx.createPattern === 'function') {
                return this.ctx.createPattern(image, repetition);
            }
            return null;
        },
        async resolveNvueImageSource(src) {
            if (typeof src !== 'string' || src.indexOf('data:image/') === 0) {
                return src;
            }
            if (this._imageDataCache[src]) {
                return this._imageDataCache[src];
            }

            const task = (async () => {
                const localPath = await new Promise((resolve, reject) => {
                    uni.getImageInfo({
                        src,
                        success: res => resolve(res.path || res.tempFilePath),
                        fail: reject
                    });
                });
                if (!localPath) {
                    throw new Error(`Canvas图片未返回本地路径: ${src}`);
                }
                return this.readNvueFileAsDataURL(localPath);
            })();
            this._imageDataCache[src] = task;
            try {
                const dataUrl = await task;
                this._imageDataCache[src] = dataUrl;
                return dataUrl;
            } catch (error) {
                delete this._imageDataCache[src];
                throw error;
            }
        },
        readNvueFileAsDataURL(path) {
            return new Promise((resolve, reject) => {
                // #ifdef APP-NVUE
                if (typeof plus === 'undefined' || !plus.io) {
                    reject(new Error('HTML5+ FileReader不可用'));
                    return;
                }
                plus.io.resolveLocalFileSystemURL(path, (entry) => {
                    entry.file((file) => {
                        const reader = new plus.io.FileReader();
                        reader.onloadend = event => resolve(event.target.result);
                        reader.onerror = reject;
                        reader.readAsDataURL(file);
                    }, reject);
                }, reject);
                return;
                // #endif

                resolve(path);
            });
        },
        loadImage(src) {
            // #ifdef APP-NVUE
            return this.resolveNvueImageSource(src);
            // #endif

            if (this._imageCache[src]) {
                return Promise.resolve(this._imageCache[src]);
            }
            return new Promise((resolve, reject) => {
                let image = null;

                // #ifdef MP
                const canvas = this.getCanvasElement();
                if (canvas && typeof canvas.createImage === 'function') {
                    image = canvas.createImage();
                }
                // #endif

                // #ifdef H5
                image = new Image();
                image.crossOrigin = 'anonymous';
                // #endif

                if (!image) {
                    resolve(src);
                    return;
                }

                image.onload = () => {
                    this._imageCache[src] = image;
                    resolve(image);
                };
                image.onerror = reject;
                image.src = src;
            });
        },
        async drawImage(source, ...args) {
            if (!this.ctx || typeof this.ctx.drawImage !== 'function') {
                return false;
            }
            if (typeof source !== 'string') {
                this.ctx.drawImage(source, ...args);
                return true;
            }
            if (typeof this.ctx.setFillStyle === 'function' && !this._isNvue) {
                this.ctx.drawImage(source, ...args);
                return true;
            }
            const image = await this.loadImage(source);
            this.ctx.drawImage(image, ...args);
            return true;
        },
        draw(isLastDraw = false, callback) {
            if (this.ctx && typeof this.ctx.draw === 'function') {
                return this.ctx.draw(isLastDraw, callback);
            }
            if (typeof callback === 'function') {
                setTimeout(callback, 0);
            }
            return undefined;
        },
        toTempFilePath(options = {}) {
            return new Promise((resolve, reject) => {
                const width = options.width || this.actualWidth;
                const height = options.height || this.actualHeight;
                const hasDestWidth = options.destWidth !== undefined && options.destWidth !== null;
                const hasDestHeight = options.destHeight !== undefined && options.destHeight !== null;
                let destWidth = hasDestWidth ? options.destWidth : width;
                let destHeight = hasDestHeight ? options.destHeight : height;

                // MP、H5、APP-PLUS 和 APP-HARMONY 保持逻辑绘制坐标，只提升默认导出像素。
                // #ifdef MP || H5 || APP-PLUS || APP-HARMONY
                if (!hasDestWidth) {
                    destWidth = Math.round(width * this.dpr);
                }
                if (!hasDestHeight) {
                    destHeight = Math.round(height * this.dpr);
                }
                // #endif

                const defaultFileType = 'png';
                const request = {
                    x: options.x || 0,
                    y: options.y || 0,
                    width,
                    height,
                    destWidth,
                    destHeight,
                    fileType: options.fileType === undefined || options.fileType === null
                        ? defaultFileType
                        : options.fileType,
                    quality: options.quality === undefined ? 1 : options.quality
                };
                const success = (res) => {
                    if (typeof options.success === 'function') options.success(res);
                    resolve(res);
                };
                const fail = (err) => {
                    if (typeof options.fail === 'function') options.fail(err);
                    reject(err);
                };
                const complete = (res) => {
                    if (typeof options.complete === 'function') options.complete(res);
                };

                // #ifdef H5
                const canvas = this.getCanvasElement() || (this.ctx && this.ctx.canvas);
                if (canvas && typeof canvas.toDataURL === 'function') {
                    try {
                        let exportCanvas = canvas;
                        if (
                            request.x !== 0 ||
                            request.y !== 0 ||
                            request.width !== this.actualWidth ||
                            request.height !== this.actualHeight ||
                            request.destWidth !== request.width ||
                            request.destHeight !== request.height
                        ) {
                            exportCanvas = document.createElement('canvas');
                            exportCanvas.width = request.destWidth;
                            exportCanvas.height = request.destHeight;
                            const exportCtx = exportCanvas.getContext('2d');
                            exportCtx.drawImage(
                                canvas,
                                request.x * this.dpr,
                                request.y * this.dpr,
                                request.width * this.dpr,
                                request.height * this.dpr,
                                0,
                                0,
                                request.destWidth,
                                request.destHeight
                            );
                        }
                        const mime = request.fileType === 'jpg' || request.fileType === 'jpeg'
                            ? 'image/jpeg'
                            : 'image/png';
                        const res = {
                            tempFilePath: exportCanvas.toDataURL(mime, request.quality)
                        };
                        success(res);
                        complete(res);
                        return;
                    } catch (error) {
                        fail(error);
                        complete(error);
                        return;
                    }
                }
                // #endif

                // #ifdef APP-NVUE
                if (this.ctx && typeof this.ctx.toTempFilePath === 'function') {
                    Promise.resolve(this.ctx.toTempFilePath(request)).then(
                        (res) => {
                            success(res);
                            complete(res);
                        },
                        (error) => {
                            fail(error);
                            complete(error);
                        }
                    );
                    return;
                }
                // #endif

                const canvasNode = this.getCanvasElement();
                const uniOptions = {
                    ...request,
                    canvasId: this.canvasId,
                    success,
                    fail,
                    complete
                };
                if (canvasNode) {
                    uniOptions.canvas = canvasNode;
                }
                uni.canvasToTempFilePath(uniOptions, this);
            });
        },
        async exportImage(fileType = 'png', quality = 1) {
            const res = await this.toTempFilePath({
                fileType,
                quality,
                width: this.actualWidth,
                height: this.actualHeight
            });
            return res.tempFilePath || res.apFilePath;
        },
        getImageData(options = {}) {
            return new Promise((resolve, reject) => {
                const success = (res) => {
                    if (typeof options.success === 'function') options.success(res);
                    resolve(res);
                };
                const fail = (err) => {
                    if (typeof options.fail === 'function') options.fail(err);
                    reject(err);
                };
                const complete = (res) => {
                    if (typeof options.complete === 'function') options.complete(res);
                };
                // #ifdef APP-NVUE
                if (this.ctx && typeof this.ctx.getImageData === 'function') {
                    Promise.resolve(this.ctx.getImageData({
                        x: options.x || 0,
                        y: options.y || 0,
                        width: options.width || this.actualWidth,
                        height: options.height || this.actualHeight
                    })).then((res) => {
                        success(res);
                        complete(res);
                    }, (error) => {
                        fail(error);
                        complete(error);
                    });
                    return;
                }
                // #endif

                const request = {
                    canvasId: this.canvasId,
                    x: options.x || 0,
                    y: options.y || 0,
                    width: options.width || this.actualWidth,
                    height: options.height || this.actualHeight,
                    success,
                    fail,
                    complete
                };
                uni.canvasGetImageData(request, this);
            });
        },
        putImageData(options = {}) {
            return new Promise((resolve, reject) => {
                const success = (res) => {
                    if (typeof options.success === 'function') options.success(res);
                    resolve(res);
                };
                const fail = (err) => {
                    if (typeof options.fail === 'function') options.fail(err);
                    reject(err);
                };
                const complete = (res) => {
                    if (typeof options.complete === 'function') options.complete(res);
                };
                // #ifdef APP-NVUE
                if (this.ctx && typeof this.ctx.putImageData === 'function') {
                    Promise.resolve(this.ctx.putImageData({
                        x: options.x || 0,
                        y: options.y || 0,
                        width: options.width || (options.data && options.data.width) || this.actualWidth,
                        height: options.height || (options.data && options.data.height) || this.actualHeight,
                        data: options.data
                    })).then((res) => {
                        success(res);
                        complete(res);
                    }, (error) => {
                        fail(error);
                        complete(error);
                    });
                    return;
                }
                // #endif

                const request = {
                    canvasId: this.canvasId,
                    x: options.x || 0,
                    y: options.y || 0,
                    width: options.width || (options.data && options.data.width) || this.actualWidth,
                    height: options.height || (options.data && options.data.height) || this.actualHeight,
                    data: options.data,
                    success,
                    fail,
                    complete
                };
                uni.canvasPutImageData(request, this);
            });
        }
    }
};
</script>

<style lang="scss" scoped>
    .u-canvas {
        position: relative;
        overflow: hidden;
    }

    .u-canvas__canvas {
        display: block;
        width: 100%;
        height: 100%;
    }
</style>
