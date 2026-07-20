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

        <!-- #ifdef APP-PLUS -->
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

        <!-- #ifdef APP-NVUE -->
        <gcanvas
            class="u-canvas__canvas"
            ref="gcanvas"
            :style="{ width: actualWidth + unit, height: actualHeight + unit }"
            @touchstart="onTouchStart"
            @touchmove="onTouchMove"
            @touchend="onTouchEnd"
        />
        <!-- #endif -->
    </view>
</template>

<script>
// #ifdef APP-NVUE
import {
    enable,
    WeexBridge,
    Image as GImage
} from '../../libs/util/gcanvas/index.js';
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
        this._isNvue = false;
    },
    mounted() {
        this.$nextTick(() => {
            this.initCanvas();
        });
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
        async getCanvasNode(id = this.canvasId, isCanvas = true) {
            return new Promise((resolve) => {
                try {
                    // #ifdef APP-NVUE
                    setTimeout(() => {
                        const gcanvas = this.$refs.gcanvas;
                        if (!gcanvas) {
                            resolve(false);
                            return;
                        }
                        this._isNvue = true;
                        resolve(enable(gcanvas, { bridge: WeexBridge }));
                    }, 100);
                    // #endif

                    // #ifndef APP-NVUE
                    uni.createSelectorQuery()
                        .in(this)
                        .select(`#${id}`)
                        .fields(
                            {
                                node: isCanvas,
                                size: true
                            },
                            (res) => {
                                resolve(res || false);
                            }
                        )
                        .exec();
                    // #endif
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
            // #ifdef APP-PLUS
            return uni.createCanvasContext(this.canvasId, this);
            // #endif

            // #ifdef APP-NVUE
            return this._canvasElement && typeof this._canvasElement.getContext === 'function'
                ? this._canvasElement.getContext('2d')
                : null;
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
            try {
                if (this.useRootHeightAndWidth) {
                    await this.setNewSize();
                }
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
                this._canvasElement = this._canvasNode.node || this._canvasNode;
                this.dpr = uni.getSystemInfoSync().pixelRatio || 1;

                // #ifdef MP || H5
                if (this._canvasElement) {
                    this._canvasElement.width = Math.ceil(this.actualWidth * this.dpr);
                    this._canvasElement.height = Math.ceil(this.actualHeight * this.dpr);
                }
                // #endif

                this.ctx = this.getCanvasContext();
                if (!this.ctx) {
                    return false;
                }

                // #ifdef MP || H5
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
            this.draw();
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
        bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
            return this.callContext('bezierCurveTo', cp1x, cp1y, cp2x, cp2y, x, y);
        },
        quadraticCurveTo(cpx, cpy, x, y) {
            return this.callContext('quadraticCurveTo', cpx, cpy, x, y);
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
        measureText(text) {
            if (this.ctx && typeof this.ctx.measureText === 'function') {
                return this.ctx.measureText(String(text));
            }
            return {
                width: String(text).length * this.fontSize * 0.6
            };
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
        loadImage(src) {
            if (this._imageCache[src]) {
                return Promise.resolve(this._imageCache[src]);
            }
            return new Promise((resolve, reject) => {
                let image = null;

                // #ifdef APP-NVUE
                image = new GImage();
                // #endif

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
            if (typeof source !== 'string' || (typeof this.ctx.setFillStyle === 'function' && !this._isNvue)) {
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
                const request = {
                    x: options.x || 0,
                    y: options.y || 0,
                    width,
                    height,
                    destWidth: options.destWidth || width,
                    destHeight: options.destHeight || height,
                    fileType: options.fileType || 'png',
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
                    this.ctx.toTempFilePath(
                        request.x,
                        request.y,
                        request.width,
                        request.height,
                        request.destWidth,
                        request.destHeight,
                        request.fileType,
                        request.quality,
                        (res) => {
                            success(res);
                            complete(res);
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
                height: this.actualHeight,
                destWidth: this.actualWidth,
                destHeight: this.actualHeight
            });
            return res.tempFilePath || res.apFilePath;
        },
        getImageData(options = {}) {
            return new Promise((resolve, reject) => {
                const request = {
                    canvasId: this.canvasId,
                    x: options.x || 0,
                    y: options.y || 0,
                    width: options.width || this.actualWidth,
                    height: options.height || this.actualHeight,
                    success: (res) => {
                        if (typeof options.success === 'function') options.success(res);
                        resolve(res);
                    },
                    fail: (err) => {
                        if (typeof options.fail === 'function') options.fail(err);
                        reject(err);
                    },
                    complete: options.complete
                };
                uni.canvasGetImageData(request, this);
            });
        },
        putImageData(options = {}) {
            return new Promise((resolve, reject) => {
                const request = {
                    canvasId: this.canvasId,
                    x: options.x || 0,
                    y: options.y || 0,
                    width: options.width || this.actualWidth,
                    height: options.height || this.actualHeight,
                    data: options.data,
                    success: (res) => {
                        if (typeof options.success === 'function') options.success(res);
                        resolve(res);
                    },
                    fail: (err) => {
                        if (typeof options.fail === 'function') options.fail(err);
                        reject(err);
                    },
                    complete: options.complete
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
