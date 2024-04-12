/// <reference path="./comps.d.ts" />
declare module 'uview-plus' {
    export function install(): void  //必要
    interface test {
      /** 邮箱格式校验 */
      email(email: string): boolean
    }
    interface $u {
      route: {},
      colorGradient: {},
      hexToRgb: {},
      rgbToHex: {},
      colorToRgba: {},
      test: test,
      type: {},
      http: {},
      config: {},
      zIndex: {},
      debounce: {},
      throttle: {},
      mixin: {},
      mpMixin: {},
      props: {},
      color: {},
      platform: {},
    }

    global {
      interface Uni {
        $u: $u
      }
    }
}
declare type UniCountDownRef = typeof import('./comps/countDown')['CountDownRef']
declare type UniCountToRef = typeof import('./comps/countTo')['CountToRef']
declare type UniReadMoreRef = typeof import('./comps/readMore')['ReadMoreRef']
declare type UniToastRef = typeof import('./comps/toast')['ToastRef']
declare type UniCollapseRef = typeof import('./comps/collapse')['CollapseRef']
declare type UniNotifyRef = typeof import('./comps/notify')['NotifyRef']
declare type UniCodeRef = typeof import('./comps/code')['CodeRef']
declare type UniInputRef = typeof import('./comps/input')['InputRef']
declare type UniUploadRef = typeof import('./comps/upload')['UploadRef']
declare type UniDatetimePickerRef = typeof import('./comps/datetimePicker')['DatetimePickerRef']
declare type UniPickerRef = typeof import('./comps/picker')['PickerRef']
declare type UniCalendarRef = typeof import('./comps/calendar')['CalendarRef']
declare type UniTextareaRef = typeof import('./comps/textarea')['TextareaRef']
declare type UniFormRef = typeof import('./comps/form')['FormRef']
