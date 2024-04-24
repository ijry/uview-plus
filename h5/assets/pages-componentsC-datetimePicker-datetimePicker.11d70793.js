import{_ as e}from"./u-navbar.42bef7cd.js";import{o,c as n,w as l,i as a,a as t,b as i,r,F as s,d as u,e as m}from"./index-ad94112a.js";import{r as c}from"./uni-app.es.30424699.js";import{_ as d}from"./u-input.6e62d70a.js";import{_ as h,a as p}from"./u-form.e1fdb0f2.js";import{_ as C}from"./u-datetime-picker.6019a716.js";import{_ as f}from"./u-cell.af45469f.js";import{_ as w}from"./u-cell-group.4bbd31bb.js";import{_ as v}from"./_plugin-vue_export-helper.1b428a4d.js";import"./u-status-bar.638b91cc.js";import"./u-icon.f5fb849d.js";import"./u-line.7233412d.js";import"./u-picker.89d48788.js";import"./u-loading-icon.9b611a06.js";import"./u-popup.5a1c4437.js";import"./u-overlay.86fcfa61.js";import"./u-transition.fae9481f.js";import"./u-safe-bottom.4eca950b.js";import"./index.a605aec4.js";const g=v({data(){const e=new Date;return e.getFullYear(),uni.$u.padZero(e.getMonth()+1),e.getDate(),{current:0,value1:Number(new Date),value2:Number(new Date),value3:Number(new Date),value4:"05:28",value5:Number(new Date),value6:Number(new Date),value7:Number(new Date),show1:!1,show2:!1,show3:!1,show4:!1,show5:!1,show6:!1,show7:!1,list:[{title:"完整日期时间",iconUrl:"https://cdn.uviewui.com/uview/demo/datetime-picker/6.png"},{title:"年月日",iconUrl:"https://cdn.uviewui.com/uview/demo/datetime-picker/4.png"},{title:"年月",iconUrl:"https://cdn.uviewui.com/uview/demo/datetime-picker/3.png"},{title:"时间",iconUrl:"https://cdn.uviewui.com/uview/demo/datetime-picker/5.png"},{title:"过滤器(保留偶数年)",iconUrl:"https://cdn.uviewui.com/uview/demo/datetime-picker/2.png"},{title:"格式化",iconUrl:"https://cdn.uviewui.com/uview/demo/datetime-picker/1.png"},{title:"限制最大最小值",iconUrl:"https://cdn.uviewui.com/uview/demo/datetime-picker/7.png"}]}},methods:{close(){this[`show${this.current}`]=!1},cancel(){this[`show${this.current}`]=!1},confirm(e){this[`show${this.current}`]=!1,this.result(e.value,e.mode)},change(e){},navigateBack(){uni.navigateBack()},filter:(e,o)=>"year"===e?o.filter((e=>e%2==0)):o,showDatetimePicker(e){this.current=e+1,this[`show${e+1}`]=!0},result(e,o){const n=uni.$u.timeFormat,l=uni.$u.toast;switch(o){case"datetime":return l(n(e,"yyyy-mm-dd hh:MM"));case"date":return l(n(e,"yyyy-mm-dd"));case"year-month":return l(n(e,"yyyy-mm"));case"time":return l(e);default:return""}},formatter:(e,o)=>"year"===e?`${o}年`:"month"===e?`${o}月`:"day"===e?`${o}日`:o}},[["render",function(v,g,k,y,_,V){const b=c(u("up-navbar"),e),j=c(u("up-input"),d),U=c(u("up-form-item"),h),O=c(u("up-datetime-picker"),C),D=c(u("up-form"),p),$=a,x=m,N=c(u("up-cell"),f),B=c(u("up-cell-group"),w);return o(),n($,{class:"u-page"},{default:l((()=>[t(b,{title:"datetimePicker 时间日期选择器",onLeftClick:V.navigateBack,safeAreaInsetTop:"",fixed:"",placeholder:""},null,8,["onLeftClick"]),t($,{class:"u-demo-block__content",style:{padding:"0 15px"}},{default:l((()=>[t(D,{class:"u-demo-block__content",labelPosition:"left",ref:"form1"},{default:l((()=>[t(U,{label:"姓名",prop:"userInfo.name",borderBottom:"",ref:"item1"},{default:l((()=>[t(j)])),_:1},512),t(U,{borderBottom:"",label:"日期"},{default:l((()=>[t(O,{hasInput:"",placeholder:"请选择日期",mode:"datetime"})])),_:1})])),_:1},512)])),_:1}),t(B,null,{default:l((()=>[(o(!0),i(s,null,r(_.list,((e,a)=>(o(),n(N,{onClick:e=>V.showDatetimePicker(a),title:e.title,key:a,isLink:""},{default:l((()=>[t(x,{slot:"icon",class:"u-cell-icon",src:e.iconUrl,mode:"widthFix"},null,8,["src"])])),_:2},1032,["onClick","title"])))),128))])),_:1}),t(O,{show:_.show1,modelValue:_.value1,"onUpdate:modelValue":g[0]||(g[0]=e=>_.value1=e),mode:"datetime",closeOnClickOverlay:"",onConfirm:V.confirm,onCancel:V.cancel,onChange:V.change,onClose:V.close},null,8,["show","modelValue","onConfirm","onCancel","onChange","onClose"]),t(O,{show:_.show2,modelValue:_.value2,"onUpdate:modelValue":g[1]||(g[1]=e=>_.value2=e),mode:"date",closeOnClickOverlay:"",onConfirm:V.confirm,onCancel:V.cancel,onChange:V.change,onClose:V.close},null,8,["show","modelValue","onConfirm","onCancel","onChange","onClose"]),t(O,{show:_.show3,modelValue:_.value3,"onUpdate:modelValue":g[2]||(g[2]=e=>_.value3=e),mode:"year-month",closeOnClickOverlay:"",onConfirm:V.confirm,onCancel:V.cancel,onChange:V.change,onClose:V.close},null,8,["show","modelValue","onConfirm","onCancel","onChange","onClose"]),t(O,{show:_.show4,modelValue:_.value4,"onUpdate:modelValue":g[3]||(g[3]=e=>_.value4=e),mode:"time",closeOnClickOverlay:"",onConfirm:V.confirm,onCancel:V.cancel,onChange:V.change,onClose:V.close},null,8,["show","modelValue","onConfirm","onCancel","onChange","onClose"]),t(O,{show:_.show5,modelValue:_.value5,"onUpdate:modelValue":g[4]||(g[4]=e=>_.value5=e),filter:V.filter,mode:"date",closeOnClickOverlay:"",onConfirm:V.confirm,onCancel:V.cancel,onChange:V.change,onClose:V.close},null,8,["show","modelValue","filter","onConfirm","onCancel","onChange","onClose"]),t(O,{show:_.show6,modelValue:_.value6,"onUpdate:modelValue":g[5]||(g[5]=e=>_.value6=e),mode:"date",formatter:V.formatter,closeOnClickOverlay:"",onConfirm:V.confirm,onCancel:V.cancel,onChange:V.change,onClose:V.close},null,8,["show","modelValue","formatter","onConfirm","onCancel","onChange","onClose"]),t(O,{show:_.show7,modelValue:_.value7,"onUpdate:modelValue":g[6]||(g[6]=e=>_.value7=e),mode:"datetime",minDate:15875248e5,maxDate:1786778555e3,closeOnClickOverlay:"",onConfirm:V.confirm,onCancel:V.cancel,onChange:V.change,onClose:V.close},null,8,["show","modelValue","onConfirm","onCancel","onChange","onClose"])])),_:1})}],["__scopeId","data-v-6a3b96e1"]]);export{g as default};