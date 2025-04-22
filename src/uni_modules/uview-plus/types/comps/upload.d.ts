import { AllowedComponentProps, VNodeProps } from './_common'
import { ImageMode } from './image';

type BaseFileInfo = {
    type: string
    url: string
    name: string
    size: number
    file: File
    [key: string]: any
}

type ImageFileInfo = BaseFileInfo & {
    type: 'image'
    thumb: string
}

type VideoFileInfo = BaseFileInfo & {
    type: 'video'
    thumb: string
    width: number
    height: number
}

type MediaFileInfo = BaseFileInfo & {
    thumb: string
}

type FileInfo = BaseFileInfo | ImageFileInfo | VideoFileInfo | MediaFileInfo

declare interface UploadProps {
  /**
   * 接受的文件类型，file只支持H5（只有微信小程序才支持把accept配置为all、media）
   * @default "image"
   */
  accept?: 'all' | 'media' | 'image' | 'file' | 'video'
  /**
   * 图片或视频拾取模式，当accept为image类型时设置capture可选额外camera可以直接调起摄像头
   * @default ["album", "camera"]
   */
  capture?: 'album' | 'camera' | ('album' | 'camera')[]
  /**
   * 选择文件的后缀名，暂只支持.zip、.png等，不支持application/msword等值
   */
  extension?: string [];
  /**
   * 当accept为video时生效，是否压缩视频，默认为true
   * @default true
   */
  compressed?: boolean
  /**
   * 当accept为video时生效，可选值为back或front
   * @default "back"
   */
  camera?: 'back' | 'front'
  /**
   * 当accept为video时生效，拍摄视频最长拍摄时间，单位秒
   * @default 60
   */
  maxDuration?: number
  /**
   * 上传区域的图标，只能内置图标
   * @default "camera-fill"
   */
  uploadIcon?: string
  /**
   * 上传区域的图标的颜色
   * @default "#D3D4D6"
   */
  uploadIconColor?: string
  /**
   * 是否启用(显示/隐藏)组件
   */
  useBeforeRead?: boolean
  /**
   * 预览全图
   * @default true
   */
  previewFullImage?: boolean
  /**
   * 最大选择图片的数量
   * @default 52
   */
  maxCount?: string | number
  /**
   * 是否启用(显示/隐藏)组件
   * @default false
   */
  disabled?: boolean
  /**
   * 预览上传的图片时的裁剪模式
   * @default "aspectFill"
   */
  imageMode?: ImageMode
  /**
   * 标识符，可以在回调函数的第二项参数中获取
   * @default "file"
   */
  name?: string
  /**
   * original 原图，compressed 压缩图，默认二者都有，H5无效
   * @default ["original", "compressed"]
   */
  sizeType?: ('original' | 'compressed')[]
  /**
   * 是否开启图片多选，部分安卓机型不支持
   * @default false
   */
  multiple?: boolean
  /**
   * 是否显示删除图片的按钮
   * @default true
   */
  deletable?: boolean
  /**
   * 选择单个文件的最大大小，单位B(byte)，默认不限制
   * @default Number.MAX_VALUE
   */
  maxSize?: string | number
  /**
   * 显示已上传的文件列表
   */
  fileList?: any[]
  /**
   * 上传区域的提示文字
   */
  uploadText?: string
  /**
   * 内部预览图片区域和选择图片按钮的区域宽度，单位rpx，不能是百分比，或者`auto`
   * @default 80
   */
  width?: string | number
  /**
   * 内部预览图片区域和选择图片按钮的区域高度，单位rpx，不能是百分比，或者`auto`
   * @default 80
   */
  height?: string | number
  /**
   * 是否在上传完成后展示预览图
   * @default true
   */
  previewImage?: boolean
  /**
   * 读取后的处理函数
   */
  onAfterRead?: (file, lists, name) => any
  /**
   * 读取前的处理函数
   */
  onBeforeRead?: (file, lists, name) => any
  /**
   * 图片大小超出最大允许大小
   */
  onOversize?: (file, lists, name) => any
  /**
   * 全屏预览图片时触发
   */
  onClickPreview?: (file, lists, name) => any
  /**
   * 删除图片
   */
  onDelete?: (index, file, name) => any
}

type ChooseFileParams = Pick<
  UploadProps,
  'accept' | 'multiple' | 'capture' | 'compressed' | 'maxDuration' | 'sizeType' | 'camera' | 'maxCount' | 'extension'
>;

declare interface UploadSlots {
  /**
   * 自定义上传样式
   */
  ['default']?: () => any
}

declare interface _UploadRef {
  /**
   * 读取后的处理函数
   */
  afterRead: (file, lists, name) => any
  /**
   * 读取前的处理函数
   */
  beforeRead: (file, lists, name) => any
  /**
   * 触发文件选择器
   */
  chooseFile(params: ChooseFileParams & { multiple: true }): Promise<FileInfo[]>;
  chooseFile(params?: ChooseFileParams & { multiple?: false }): Promise<FileInfo>;
}

declare interface _Upload {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      UploadProps
    $slots: UploadSlots
  }
}

export declare const Upload: _Upload

export declare const UploadRef: _UploadRef
