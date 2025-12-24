<template>
  <view class="u-barcode" v-if="calcSizeDone">
    <canvas 
      v-if="showCanvas && !error" 
      :id="canvasId" 
      :canvas-id="canvasId" 
      :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"
    ></canvas>
    <image 
      v-else-if="!showCanvas && !error"
      :src="barcodeImage" 
      :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"
      mode="aspectFit"
    />
    <view 
      v-else
      class="error-container"
      :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"
    >
      <text class="error-text">{{ error }}</text>
    </view>
  </view>
</template>

<script>
import { nextTick } from 'vue'
import { t } from '../../libs/i18n'

export default {
  name: 'u-barcode',
  props: {
    // 条码值
    value: {
      type: [String, Number],
      required: true
    },
    // 条码格式
    format: {
      type: String,
      default: 'auto',
      validator: function (value) {
        return [
          'auto', 
          'CODE128', 'CODE128A', 'CODE128B', 'CODE128C',
          'EAN13', 'EAN8', 'EAN5', 'EAN2',
          'UPC', 'UPCA', 'UPCE',
          'CODE39',
          'ITF', 'ITF14',
          'MSI', 'MSI10', 'MSI11', 'MSI1010', 'MSI1110',
          'pharmacode',
          'codabar'
        ].includes(value)
      }
    },
    // 宽度
    width: {
      type: Number,
      default: 200
    },
    // 高度
    height: {
      type: Number,
      default: 80
    },
    // 是否显示文本
    displayValue: {
      type: Boolean,
      default: true
    },
    // 文本内容
    text: {
      type: String,
      default: undefined
    },
    // 字体选项
    fontOptions: {
      type: String,
      default: ''
    },
    // 字体
    font: {
      type: String,
      default: 'monospace'
    },
    // 文本对齐方式
    textAlign: {
      type: String,
      default: 'center'
    },
    // 文本位置
    textPosition: {
      type: String,
      default: 'bottom'
    },
    // 文本边距
    textMargin: {
      type: Number,
      default: 2
    },
    // 字体大小
    fontSize: {
      type: Number,
      default: 14
    },
    // 背景色
    background: {
      type: String,
      default: '#ffffff'
    },
    // 条码颜色
    lineColor: {
      type: String,
      default: '#000000'
    },
    // 边距
    margin: {
      type: Number,
      default: 10
    },
    // 上边距
    marginTop: {
      type: Number,
      default: undefined
    },
    // 下边距
    marginBottom: {
      type: Number,
      default: undefined
    },
    // 左边距
    marginLeft: {
      type: Number,
      default: undefined
    },
    // 右边距
    marginRight: {
      type: Number,
      default: undefined
    },
    // 使用canvas还是生成图片
    useCanvas: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      canvasId: 'barcode-' + Math.random().toString(36).substr(2, 9),
      barcodeImage: '',
      showCanvas: false,
      canvasWidth: 0,
      canvasHeight: 0,
      calcSizeDone: false,
      error: ''
    }
  },
  watch: {
    value() {
      this.generateBarcode()
    },
    format() {
      this.generateBarcode()
    },
    width() {
      this.generateBarcode()
    },
    height() {
      this.generateBarcode()
    },
    displayValue() {
      this.generateBarcode()
    },
    text() {
      this.generateBarcode()
    },
    font() {
      this.generateBarcode()
    },
    textAlign() {
      this.generateBarcode()
    },
    textPosition() {
      this.generateBarcode()
    },
    textMargin() {
      this.generateBarcode()
    },
    fontSize() {
      this.generateBarcode()
    },
    background() {
      this.generateBarcode()
    },
    lineColor() {
      this.generateBarcode()
    },
    margin() {
      this.generateBarcode()
    }
  },
  mounted() {
    /**
     * @author jry <ijry@qq.com>
     */
    this.$nextTick(() => {
      this.generateBarcode()
    })
  },
  methods: {
    /**
     * 生成条形码
     * @author jry <ijry@qq.com>
     * @param {String|Number} value - 条码值
     * @param {Object} options - 条码配置选项
     */
    generateBarcode() {
      // 统一处理默认值
      const margin = this.margin
      const options = {
        format: this.format || 'auto',
        width: this.width,
        height: this.height,
        displayValue: this.displayValue,
        text: this.text,
        fontOptions: this.fontOptions || '',
        font: this.font || 'monospace',
        textAlign: this.textAlign || 'center',
        textPosition: this.textPosition || 'bottom',
        textMargin: this.textMargin !== undefined ? this.textMargin : 2,
        fontSize: this.fontSize || 20,
        background: this.background || '#ffffff',
        lineColor: this.lineColor || '#000000',
        margin: margin,
        marginTop: this.marginTop !== undefined ? this.marginTop : margin,
        marginBottom: this.marginBottom !== undefined ? this.marginBottom : margin,
        marginLeft: this.marginLeft !== undefined ? this.marginLeft : margin,
        marginRight: this.marginRight !== undefined ? this.marginRight : margin
      }
      
      // 清理未定义的选项
      Object.keys(options).forEach(key => {
        if (options[key] === undefined) {
          delete options[key]
        }
      })
      
      if (this.useCanvas) {
        // 使用canvas渲染
        this.showCanvas = true
        this.$nextTick(() => {
          this.renderToCanvas(options)
        })
      } else {
        // 生成图片
        this.showCanvas = false
        this.renderToImage(options)
      }
    },
    
    /**
     * 渲染条形码到canvas
     * @author jry <ijry@qq.com>
     * @param {Object} options - 条码配置选项
     */
    async renderToCanvas(options) {
      try {
        // 计算canvas尺寸
        this.calculateCanvasSize(options)

        await nextTick()

        // 获取canvas上下文
        const ctx = uni.createCanvasContext(this.canvasId, this)
        
        // 清空画布
        ctx.setFillStyle(options.background)
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)
        
        // 生成条形码数据
        const barcodeData = this.encodeBarcode(this.value, options.format)
        
        if (barcodeData) {
          // 绘制条形码
          this.drawBarcode(ctx, barcodeData, options)
        }
        
        // 绘制到canvas
        ctx.draw(false, () => {
          // 绘制完成回调
          this.$emit('rendered', { type: 'canvas', id: this.canvasId })
        })
      } catch (error) {
        console.error('生成条码失败:', error)
        this.error = error.message || t('up.barcode.error')
        this.$emit('error', error)
      }
    },
    
    /**
     * 渲染条形码为图片
     * @author jry <ijry@qq.com>
     * @param {Object} options - 条码配置选项
     */
    renderToImage(options) {
      try {
        // 计算canvas尺寸
        this.calculateCanvasSize(options)
        
        // 创建临时canvas用于生成图片
        const tempCanvasId = 'temp-' + this.canvasId
        const ctx = uni.createCanvasContext(tempCanvasId, this)
        
        // 清空画布
        ctx.setFillStyle(options.background)
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)
        
        // 生成条形码数据
        const barcodeData = this.encodeBarcode(this.value, options.format)
        
        if (barcodeData) {
          // 绘制条形码
          this.drawBarcode(ctx, barcodeData, options)
        }
        
        // 绘制到临时canvas并生成图片
        ctx.draw(false, () => {
          // 延迟一小段时间确保canvas绘制完成
          setTimeout(() => {
            // 将canvas转换为图片
            uni.canvasToTempFilePath({
              canvasId: tempCanvasId,
              success: (res) => {
                this.barcodeImage = res.tempFilePath
                this.$emit('rendered', { type: 'image', value: this.value, path: res.tempFilePath })
              },
              fail: (error) => {
                console.error('生成条码图片失败:', error)
                this.$emit('error', error)
              }
            }, this)
          }, 100)
        })
      } catch (error) {
        console.error('生成条码图片失败:', error)
        this.$emit('error', error)
      }
    },
    
    /**
     * 计算canvas尺寸
     * @author jry <ijry@qq.com>
     * @param {Object} options - 条码配置选项
     */
    calculateCanvasSize(options) {
      // 基础宽度计算
      let width = options.width
      let height = options.height
      
      // 考虑边距
      const marginLeft = options.marginLeft
      const marginRight = options.marginRight
      const marginTop = options.marginTop
      const marginBottom = options.marginBottom
      
      // 考虑文本高度
      let textHeight = 0
      if (options.displayValue !== false) {
        textHeight = options.fontSize + options.textMargin
      }
      
      // 根据文本位置调整高度
      if (options.textPosition === 'top' || options.textPosition === 'bottom') {
        height += textHeight
      }
      
      // 添加边距
      width += marginLeft + marginRight
      height += marginTop + marginBottom
      
      this.canvasWidth = Math.max(width, 100)
      this.canvasHeight = Math.max(height, 60 + textHeight)

      this.calcSizeDone = true
    },
    
    /**
     * 编码条形码数据
     * @author jry <ijry@qq.com>
     * @param {String|Number} value - 条码值
     * @param {String} format - 条码格式
     * @returns {String|null} 条形码编码数据
     */
    encodeBarcode(value, format) {
      try {
        switch (format) {
          case 'CODE128':
          case 'auto':
            return this.encodeCode128(value)
          case 'CODE39':
            return this.encodeCode39(value)
          case 'EAN13':
            return this.encodeEAN13(value)
          case 'EAN8':
            return this.encodeEAN8(value)
          case 'EAN5':
          case 'EAN2':
            return this.encodeEAN52(value, format)
          case 'UPC':
          case 'UPCA':
            return this.encodeUPCA(value)
          case 'UPCE':
            return this.encodeUPCE(value)
          default:
            // 默认使用CODE128
            return this.encodeCode128(value)
        }
      } catch (error) {
        console.error('条码编码失败:', error)
        throw error
      }
    },

    /**
     * 添加右侧安静区（至少2个模块宽度的空白）
     * @author jry <ijry@qq.com>
     * @param {String} data - 要编码的数据
     * @returns {String|null} 编码后的条形码数据
     */
    encodeCode128(data) {
      const CODE128_START_CODE_B = 104
      const CODE128_STOP = 106
      
      // CODE128 Code B 字符集
      const CODE128_CODE_B_CHARS = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'
      
      // 条形码模式 (B 模式)
      const codes = []
      let checksum = CODE128_START_CODE_B
      
      // 添加起始字符
      codes.push(CODE128_START_CODE_B)
      
      // 编码每个字符
      for (let i = 0; i < data.length; i++) {
        const char = data[i]
        const code = CODE128_CODE_B_CHARS.indexOf(char)
        
        if (code === -1) {
          throw new Error('Invalid character in CODE128: ' + char)
        }
        
        codes.push(code)
        checksum += code * (i + 1)
      }
      
      // 添加校验字符
      codes.push(checksum % 103)
      
      // 添加结束字符
      codes.push(CODE128_STOP)
      
      // 转换为条形码模式 (1 = 黑条, 0 = 白条)
      let barcode = ''
      for (let i = 0; i < codes.length; i++) {
        const code = codes[i]
        barcode += this.getCode128Pattern(code)
      }
      
      // 添加右侧安静区（至少2个模块宽度的空白）
      barcode += '00000'
      
      return barcode
    },
    
    /**
     * 获取CODE128编码模式
     * @author jry <ijry@qq.com>
     * @param {Number} code - 字符编码
     * @returns {String} 条形码二进制模式
     */
    getCode128Pattern(code) {
      // CODE128编码表
      const patterns = [
        "11011001100", "11001101100", "11001100110", "10010011000", 
        "10010001100", "10001001100", "10011001000", "10011000100", 
        "10001100100", "11001001000", "11001000100", "11000100100", 
        "10110011100", "10011011100", "10011001110", "10111001100", 
        "10011101100", "10011100110", "11001110010", "11001011100", 
        "11001001110", "11011100100", "11001110100", "11101101110", 
        "11101001100", "11100101100", "11100100110", "11101100100", 
        "11100110100", "11100110010", "11011011000", "11011000110", 
        "11000110110", "10100011000", "10001011000", "10001000110", 
        "10110001000", "10001101000", "10001100010", "11010001000", 
        "11000101000", "11000100010", "10110111000", "10110001110", 
        "10001101110", "10111011000", "10111000110", "10001110110", 
        "11101110110", "11010001110", "11000101110", "11011101000", 
        "11011100010", "11011101110", "11101011000", "11101000110", 
        "11100010110", "11101101000", "11101100010", "11100011010", 
        "11101111010", "11001000010", "11110001010", "10100110000", 
        "10100001100", "10010110000", "10010000110", "10000101100", 
        "10000100110", "10110010000", "10110000100", "10011010000", 
        "10011000010", "10000110100", "10000110010", "11000010010", 
        "11001010000", "11110111010", "11000010100", "10001111010", 
        "10100111100", "10010111100", "10010011110", "10111100100", 
        "10011110100", "10011110010", "11110100100", "11110010100", 
        "11110010010", "11011011110", "11011110110", "11110110110", 
        "10101111000", "10100011110", "10001011110", "10111101000", 
        "10111100010", "11110101000", "11110100010", "10111011110", 
        "10111101110", "11101011110", "11110101110", "11010000100", 
        "11010010000", "11010011100", "11000111010"
      ];
      
      return patterns[code] || "";
    },
    
    /**
     * CODE39编码实现
     * @author jry <ijry@qq.com>
     * @param {String} data - 要编码的数据
     * @returns {String|null} 编码后的条形码数据
     */
    encodeCode39(data) {
      const codes = {
        '0': '101000111011101',
        '1': '111010001010111',
        '2': '101110001010111',
        '3': '111011100010101',
        '4': '101000111010111',
        '5': '111010001110101',
        '6': '101110001110101',
        '7': '101000101110111',
        '8': '111010001011101',
        '9': '101110001011101',
        'A': '111010100010111',
        'B': '101110100010111',
        'C': '111011101000101',
        'D': '101011100010111',
        'E': '111010111000101',
        'F': '101110111000101',
        'G': '101010001110111',
        'H': '111010100011101',
        'I': '101110100011101',
        'J': '101011100011101',
        'K': '111010101000111',
        'L': '101110101000111',
        'M': '111011101010001',
        'N': '101011101000111',
        'O': '111010111010001',
        'P': '101110111010001',
        'Q': '101010111000111',
        'R': '111010101110001',
        'S': '101110101110001',
        'T': '101011101110001',
        'U': '111000101010111',
        'V': '100011101010111',
        'W': '111000111010101',
        'X': '100010111010111',
        'Y': '111000101110101',
        'Z': '100011101110101',
        '-': '100010101110111',
        '.': '111000101011101',
        ' ': '100011101011101',
        '*': '100010111011101', // 起始和终止字符
        '$': '100010001000101',
        '/': '100010001010001',
        '+': '100010100010001',
        '%': '101000100010001'
      }
      
      // 转为大写
      data = data.toUpperCase()
      
      // 添加起始和终止字符
      let barcode = codes['*']
      
      // 添加数据字符
      for (let i = 0; i < data.length; i++) {
        const char = data[i]
        if (codes[char]) {
          barcode += '0' // 字符间隔
          barcode += codes[char]
        } else {
          throw new Error('Invalid character in CODE39: ' + char)
        }
      }
      
      // 添加终止字符
      barcode += '0' // 字符间隔
      barcode += codes['*']
      
      return barcode
    },
    
    /**
     * EAN13编码实现
     * @author jry <ijry@qq.com>
     * @param {String} data - 13位数字字符串
     * @returns {String|null} 编码后的条形码数据
     */
    encodeEAN13(data) {
      // 确保数据是13位数字
      if (!/^\d{13}$/.test(data)) {
        throw new Error('EAN13 must be 13 digits')
      }
      
      // 验证校验位
      let sum = 0
      for (let i = 0; i < 12; i++) {
        const digit = parseInt(data[i])
        sum += (i % 2 === 0) ? digit : digit * 3
      }
      const checkDigit = (10 - (sum % 10)) % 10
      if (parseInt(data[12]) !== checkDigit) {
        throw new Error('Invalid EAN13 check digit')
      }
      
      // 左侧数据
      const leftData = data.substring(1, 7)
      const rightData = data.substring(7, 13)
      
      // 起始符
      let barcode = '101'
      
      // 左侧数据编码 (根据第一位数字决定编码方式)
      const firstDigit = parseInt(data[0])
      const leftPatterns = [
        ['LLLLLL', 'LLGLGG', 'LLGGLG', 'LLGGGL', 'LGLLGG', 
         'LGGLLG', 'LGGGLL', 'LGLGLG', 'LGLGGL', 'LGGLGL']
      ]
      
      const pattern = leftPatterns[0][firstDigit]
      
      // 左侧奇偶编码模式
      const leftOdd = [
        '0001101', '0011001', '0010011', '0111101', '0100011',
        '0110001', '0101111', '0111011', '0110111', '0001011'
      ]
      
      const leftEven = [
        '0100111', '0110011', '0011011', '0100001', '0011101',
        '0111001', '0000101', '0010001', '0001001', '0010111'
      ]
      
      // 编码左侧数据
      for (let i = 0; i < leftData.length; i++) {
        const digit = parseInt(leftData[i])
        if (pattern[i] === 'L') {
          barcode += leftOdd[digit]
        } else {
          barcode += leftEven[digit]
        }
      }
      
      // 中间分隔符
      barcode += '01010'
      
      // 右侧数据编码 (始终使用右编码)
      const rightCodes = [
        '1110010', '1100110', '1101100', '1000010', '1011100',
        '1001110', '1010000', '1000100', '1001000', '1110100'
      ]
      
      for (let i = 0; i < rightData.length; i++) {
        const digit = parseInt(rightData[i])
        barcode += rightCodes[digit]
      }
      
      // 结束符
      barcode += '101'
      
      return barcode
    },
    
    /**
     * EAN8编码实现
     * @author jry <ijry@qq.com>
     * @param {String} data - 8位数字字符串
     * @returns {String|null} 编码后的条形码数据
     */
    encodeEAN8(data) {
      // 确保数据是8位数字
      if (!/^\d{8}$/.test(data)) {
        throw new Error('EAN8 must be 8 digits')
      }
      
      // 验证校验位
      let sum = 0
      for (let i = 0; i < 7; i++) {
        const digit = parseInt(data[i])
        sum += digit * (i % 2 === 0 ? 3 : 1)
      }
      const checkDigit = (10 - (sum % 10)) % 10
      if (parseInt(data[7]) !== checkDigit) {
        throw new Error('Invalid EAN8 check digit')
      }
      
      // 左侧数据(4位)
      const leftData = data.substring(0, 4)
      // 右侧数据(4位)
      const rightData = data.substring(4, 8)
      
      // 起始符
      let barcode = '101'
      
      // 左侧奇偶编码模式
      const leftOdd = [
        '0001101', '0011001', '0010011', '0111101', '0100011',
        '0110001', '0101111', '0111011', '0110111', '0001011'
      ]
      
      // 编码左侧数据
      for (let i = 0; i < leftData.length; i++) {
        const digit = parseInt(leftData[i])
        barcode += leftOdd[digit]
      }
      
      // 中间分隔符
      barcode += '01010'
      
      // 右侧数据编码 (始终使用右编码)
      const rightCodes = [
        '1110010', '1100110', '1101100', '1000010', '1011100',
        '1001110', '1010000', '1000100', '1001000', '1110100'
      ]
      
      // 编码右侧数据
      for (let i = 0; i < rightData.length; i++) {
        const digit = parseInt(rightData[i])
        barcode += rightCodes[digit]
      }
      
      // 结束符
      barcode += '101'
      
      return barcode
    },
    
    /**
     * EAN5/EAN2编码实现
     * @author jry <ijry@qq.com>
     * @param {String} data - 2位或5位数字字符串
     * @param {String} format - 格式类型(EAN5或EAN2)
     * @returns {String|null} 编码后的条形码数据
     */
    encodeEAN52(data, format) {
      const length = format === 'EAN5' ? 5 : 2
      // 确保数据是相应位数的数字
      if (!new RegExp(`^\\d{${length}}$`).test(data)) {
        throw new Error(`${format} must be ${length} digits`)
      }
      
      // EAN5/2编码表
      const codes = [
        '0001101', '0011001', '0010011', '0111101', '0100011',
        '0110001', '0101111', '0111011', '0110111', '0001011'
      ]
      
      // 计算校验和
      let checksum = 0
      for (let i = 0; i < data.length; i++) {
        checksum += parseInt(data[i]) * (i % 2 === 0 ? 3 : 1)
      }
      
      // 根据校验和确定编码模式
      const patterns = format === 'EAN5' ? 
        ['00001', '00010', '00100', '01000', '10000', // 0-4
         '00000', '00011', '00101', '00110', '01001', // 5-9
         '01010', '01100', '10001', '10010', '10100', // 10-14
         '11000', '11001', '11010', '11100'] : // 15-18
        ['00', '01', '10', '11'] // EAN2只有4种模式
      
      const pattern = format === 'EAN5' ? 
        patterns[checksum % 10] : 
        patterns[parseInt(data) % 4]
      
      // 起始符
      let barcode = '1011'
      
      // 编码数据
      for (let i = 0; i < data.length; i++) {
        // 添加分隔符(除了第一个字符)
        if (i > 0) {
          barcode += '01' // 字符间分隔符
        }
        
        // 根据模式确定编码方式
        const digit = parseInt(data[i])
        const code = codes[digit]
        
        barcode += code
      }
      
      return barcode
    },
    
    /**
     * UPCA编码实现
     * @author jry <ijry@qq.com>
     * @param {String} data - 11位或12位数字字符串
     * @returns {String|null} 编码后的条形码数据
     */
    encodeUPCA(data) {
      // 如果是11位，计算校验位
      if (/^\d{11}$/.test(data)) {
        let sum = 0
        for (let i = 0; i < 11; i++) {
          const digit = parseInt(data[i])
          sum += (i % 2 === 0) ? digit * 3 : digit
        }
        const checkDigit = (10 - (sum % 10)) % 10
        data += checkDigit
      }
      
      // 确保数据是12位数字
      if (!/^\d{12}$/.test(data)) {
        throw new Error('UPC-A must be 11 or 12 digits')
      }
      
      // UPCA实际上是EAN13的第一个数字为0的特殊情况
      return this.encodeEAN13('0' + data)
    },
    
    /**
     * UPCE编码实现
     * @author jry <ijry@qq.com>
     * @param {String} data - 6位或8位数字字符串
     * @returns {String|null} 编码后的条形码数据
     */
    encodeUPCE(data) {
      // 如果是7位，计算校验位
      if (/^\d{7}$/.test(data)) {
        let sum = 0
        for (let i = 0; i < 7; i++) {
          const digit = parseInt(data[i])
          sum += (i % 2 === 0) ? digit * 3 : digit
        }
        const checkDigit = (10 - (sum % 10)) % 10
        data += checkDigit
      }
      
      // 确保数据是8位数字
      if (!/^\d{8}$/.test(data)) {
        throw new Error('UPC-E must be 7 or 8 digits')
      }
      
      // 检查是否是有效的UPC-E格式
      if (data[0] !== '0' && data[0] !== '1') {
        throw new Error('UPC-E must start with 0 or 1')
      }
      
      // UPCE编码表
      const leftOdd = [
        '0001101', '0011001', '0010011', '0111101', '0100011',
        '0110001', '0101111', '0111011', '0110111', '0001011'
      ]
      
      const leftEven = [
        '0100111', '0110011', '0011011', '0100001', '0011101',
        '0111001', '0000101', '0010001', '0001001', '0010111'
      ]
      
      // 根据系统数字确定编码模式
      const systemDigit = data[0]
      const checkDigit = data[7]
      
      // 提取中间6位
      const middleData = data.substring(1, 7)
      
      // 确定编码模式
      let pattern
      if (checkDigit === '0' || checkDigit === '1' || checkDigit === '2') {
        pattern = 'EEEEOO' // 0,1,2
      } else if (checkDigit === '3') {
        pattern = 'EEEEOO' // 3
      } else if (checkDigit === '4') {
        pattern = 'EEEOOO' // 4
      } else {
        pattern = 'EEOOOO' // 5,6,7,8,9
      }
      
      // 起始符
      let barcode = '101'
      
      // 编码中间6位数据
      for (let i = 0; i < middleData.length; i++) {
        const digit = parseInt(middleData[i])
        if (pattern[i] === 'E') {
          barcode += leftEven[digit]
        } else {
          barcode += leftOdd[digit]
        }
      }
      
      // 中间分隔符
      barcode += '010101'
      
      // 结束符
      barcode += '101'
      
      return barcode
    },
    
    /**
     * 绘制条形码
     * @author jry <ijry@qq.com>
     * @param {Object} ctx - canvas上下文
     * @param {String} barcodeData - 条形码数据
     * @param {Object} options - 条码配置选项
     */
    drawBarcode(ctx, barcodeData, options) {
      if (!barcodeData) return
      
      const marginLeft = options.marginLeft
      const marginTop = options.marginTop
      const marginBottom = options.marginBottom
      const textHeight = options.displayValue !== false ? options.fontSize + options.textMargin : 0
      const height = options.height
      // 恢复: 根据总长度计算模块宽度
      const moduleWidth = Math.max(1, (this.canvasWidth - marginLeft - (options.marginRight || 10)) / barcodeData.length)
      
      ctx.setFillStyle(options.lineColor)
      
      // 计算条形码绘制的Y坐标
      let barcodeY = marginTop
      // 如果文本在顶部，需要调整条形码绘制位置
      if (options.displayValue !== false && options.textPosition === 'top') {
        barcodeY += textHeight
      }
      
      // 恢复: 使用计算出的模块宽度绘制条形码
      let x = marginLeft
      for (let i = 0; i < barcodeData.length; i++) {
        if (barcodeData[i] === '1') {
          // 使用计算的模块宽度绘制每个条
          ctx.fillRect(x, barcodeY, moduleWidth, height)
        }
        // 每个条/空都占用一个模块宽度
        x += moduleWidth
      }
      
      // 绘制文本
      if (options.displayValue !== false) {
        const text = options.text || this.value
        let textY
        
        ctx.setFillStyle(options.lineColor)
        ctx.setFontSize(options.fontSize)
        ctx.setTextAlign(options.textAlign)
        
        let textX
        switch (options.textAlign) {
          case 'left':
            textX = marginLeft
            break
          case 'right':
            textX = this.canvasWidth - options.marginRight
            break
          default: // center
            textX = this.canvasWidth / 2
        }
        
        // 根据文本位置确定Y坐标
        if (options.textPosition === 'top') {
          textY = marginTop + options.fontSize - 3
        } else { // bottom
          // 修复：正确计算底部文本位置，确保文本完全显示
          textY = barcodeY + height + options.textMargin + options.fontSize
          // 确保文本不会超出画布边界
          if (textY > this.canvasHeight - marginBottom) {
            textY = this.canvasHeight - marginBottom - 2
          }
        }
        
        ctx.fillText(text, textX, textY)
      }
    }
  }
}
</script>

<style scoped>
.u-barcode {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
  color: #ff0000;
}

.error-text {
  font-size: 14px;
}
</style>
