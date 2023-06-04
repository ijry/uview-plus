import{_ as e}from"./u-navbar.e3194188.js";import{o,c as n,w as l,a,b as t,r as i,F as c,d as r,i as s,e as m}from"./index.639d3d9d.js";import{r as u}from"./uni-app.es.f87317fd.js";import{_ as d}from"./u-cell.572d7e8b.js";import{_ as h}from"./u-cell-group.faa24020.js";import{_ as C}from"./u-datetime-picker.224b85aa.js";import{_ as p}from"./plugin-vue_export-helper.21dcd24c.js";import"./u-status-bar.83380ec3.js";import"./u-icon.8fecb8b7.js";import"./u-line.e68cb869.js";import"./u-picker.937eb35f.js";import"./u-loading-icon.1043df4a.js";import"./u-popup.7f98a8f1.js";import"./u-overlay.d6cc6c6f.js";import"./u-transition.bbe9f451.js";import"./u-safe-bottom.457b576f.js";import"./dayjs.min.5f0dc0ed.js";import"./_commonjsHelpers.b8add541.js";var f=p({data(){const e=new Date;return e.getFullYear(),uni.$u.padZero(e.getMonth()+1),e.getDate(),{current:0,value1:Number(new Date),value2:Number(new Date),value3:Number(new Date),value4:"05:28",value5:Number(new Date),value6:Number(new Date),value7:Number(new Date),show1:!1,show2:!1,show3:!1,show4:!1,show5:!1,show6:!1,show7:!1,list:[{title:"完整日期时间",iconUrl:"https://cdn.uviewui.com/uview/demo/datetime-picker/6.png"},{title:"年月日",iconUrl:"https://cdn.uviewui.com/uview/demo/datetime-picker/4.png"},{title:"年月",iconUrl:"https://cdn.uviewui.com/uview/demo/datetime-picker/3.png"},{title:"时间",iconUrl:"https://cdn.uviewui.com/uview/demo/datetime-picker/5.png"},{title:"过滤器(保留偶数年)",iconUrl:"https://cdn.uviewui.com/uview/demo/datetime-picker/2.png"},{title:"格式化",iconUrl:"https://cdn.uviewui.com/uview/demo/datetime-picker/1.png"},{title:"限制最大最小值",iconUrl:"https://cdn.uviewui.com/uview/demo/datetime-picker/7.png"}]}},methods:{close(){this[`show${this.current}`]=!1},cancel(){this[`show${this.current}`]=!1},confirm(e){this[`show${this.current}`]=!1,this.result(e.value,e.mode)},change(e){},navigateBack(){uni.navigateBack()},filter:(e,o)=>"year"===e?o.filter((e=>e%2==0)):o,showDatetimePicker(e){this.current=e+1,this[`show${e+1}`]=!0},result(e,o){const n=uni.$u.timeFormat,l=uni.$u.toast;switch(o){case"datetime":return l(n(e,"yyyy-mm-dd hh:MM"));case"date":return l(n(e,"yyyy-mm-dd"));case"year-month":return l(n(e,"yyyy-mm"));case"time":return l(e);default:return""}},formatter:(e,o)=>"year"===e?`${o}年`:"month"===e?`${o}月`:"day"===e?`${o}日`:o}},[["render",function(p,f,w,v,g,k){const y=u(r("u-navbar"),e),b=m,V=u(r("u-cell"),d),j=u(r("u-cell-group"),h),U=u(r("u-datetime-picker"),C),O=s;return o(),n(O,{class:"u-page"},{default:l((()=>[a(y,{title:"datetimePicker 时间日期选择器",onLeftClick:k.navigateBack,safeAreaInsetTop:"",fixed:"",placeholder:""},null,8,["onLeftClick"]),a(j,null,{default:l((()=>[(o(!0),t(c,null,i(g.list,((e,t)=>(o(),n(V,{onClick:e=>k.showDatetimePicker(t),title:e.title,key:t,isLink:""},{default:l((()=>[a(b,{slot:"icon",class:"u-cell-icon",src:e.iconUrl,mode:"widthFix"},null,8,["src"])])),_:2},1032,["onClick","title"])))),128))])),_:1}),a(U,{show:g.show1,modelValue:g.value1,"onUpdate:modelValue":f[0]||(f[0]=e=>g.value1=e),mode:"datetime",closeOnClickOverlay:"",onConfirm:k.confirm,onCancel:k.cancel,onChange:k.change,onClose:k.close},null,8,["show","modelValue","onConfirm","onCancel","onChange","onClose"]),a(U,{show:g.show2,modelValue:g.value2,"onUpdate:modelValue":f[1]||(f[1]=e=>g.value2=e),mode:"date",closeOnClickOverlay:"",onConfirm:k.confirm,onCancel:k.cancel,onChange:k.change,onClose:k.close},null,8,["show","modelValue","onConfirm","onCancel","onChange","onClose"]),a(U,{show:g.show3,modelValue:g.value3,"onUpdate:modelValue":f[2]||(f[2]=e=>g.value3=e),mode:"year-month",closeOnClickOverlay:"",onConfirm:k.confirm,onCancel:k.cancel,onChange:k.change,onClose:k.close},null,8,["show","modelValue","onConfirm","onCancel","onChange","onClose"]),a(U,{show:g.show4,modelValue:g.value4,"onUpdate:modelValue":f[3]||(f[3]=e=>g.value4=e),mode:"time",closeOnClickOverlay:"",onConfirm:k.confirm,onCancel:k.cancel,onChange:k.change,onClose:k.close},null,8,["show","modelValue","onConfirm","onCancel","onChange","onClose"]),a(U,{show:g.show5,modelValue:g.value5,"onUpdate:modelValue":f[4]||(f[4]=e=>g.value5=e),filter:k.filter,mode:"date",closeOnClickOverlay:"",onConfirm:k.confirm,onCancel:k.cancel,onChange:k.change,onClose:k.close},null,8,["show","modelValue","filter","onConfirm","onCancel","onChange","onClose"]),a(U,{show:g.show6,modelValue:g.value6,"onUpdate:modelValue":f[5]||(f[5]=e=>g.value6=e),mode:"date",formatter:k.formatter,closeOnClickOverlay:"",onConfirm:k.confirm,onCancel:k.cancel,onChange:k.change,onClose:k.close},null,8,["show","modelValue","formatter","onConfirm","onCancel","onChange","onClose"]),a(U,{show:g.show7,modelValue:g.value7,"onUpdate:modelValue":f[6]||(f[6]=e=>g.value7=e),mode:"datetime",minDate:15875248e5,maxDate:1786778555e3,closeOnClickOverlay:"",onConfirm:k.confirm,onCancel:k.cancel,onChange:k.change,onClose:k.close},null,8,["show","modelValue","onConfirm","onCancel","onChange","onClose"])])),_:1})}],["__scopeId","data-v-71791ccd"]]);export{f as default};
