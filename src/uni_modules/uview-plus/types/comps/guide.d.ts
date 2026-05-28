import { AllowedComponentProps, VNodeProps } from './_common'

declare interface GuideItem {
  image: string
  title?: string
  desc?: string
  backgroundColor?: string
}

declare interface GuideProps {
  show?: boolean
  list?: GuideItem[]
  storageKey?: string
  once?: boolean
  showSkip?: boolean
  skipText?: string
  nextText?: string
  finishText?: string
  indicator?: boolean
  bgColor?: string
  zIndex?: string | number
  ['onUpdate:show']?: (value: boolean) => any
  onChange?: (payload: { current: number }) => any
  onSkip?: () => any
  onFinish?: () => any
  onClose?: () => any
}

declare interface _GuideRef {
  open: () => void
  close: (remember?: boolean) => void
  reset: () => void
}

declare interface _Guide {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      GuideProps
  }
}

export declare const Guide: _Guide

export declare const GuideRef: _GuideRef
