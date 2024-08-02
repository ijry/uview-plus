import{l as e,n as t,m as a,f as l,p as i,s,N as o,a3 as u,r as d,o as n,c,w as r,a as p,b as f,d as m,F as h,v as _,h as g,z as y,u as b,j as w,t as k,k as v,i as x,E as L,e as R}from"./index-BL4J5lWE.js";import{_ as C}from"./u-icon.Dw1lMtqQ.js";import{r as F}from"./uni-app.es.D5nkAKqv.js";import{_ as I}from"./u-loading-icon.DBbs15md.js";import{_ as D}from"./_plugin-vue_export-helper.BCo6x5W8.js";function j(e,t){return["[object Object]","[object File]"].includes(Object.prototype.toString.call(e))?Object.keys(e).reduce(((a,l)=>(t.includes(l)||(a[l]=e[l]),a)),{}):{}}function z(e){return e.tempFiles.map((e=>({...j(e,["path"]),url:e.path,size:e.size,name:e.name,type:e.type,file:e})))}function P({accept:e,multiple:t,capture:a,compressed:l,maxDuration:i,sizeType:s,camera:o,maxCount:u,extension:d}){return new Promise(((n,c)=>{switch(e){case"image":uni.chooseImage({count:t?Math.min(u,9):1,sourceType:a,sizeType:s,success:e=>n(function(e){return e.tempFiles.map((e=>({...j(e,["path"]),type:"image",url:e.path,thumb:e.path,size:e.size,name:e.name,file:e})))}(e)),fail:c});break;case"video":uni.chooseVideo({sourceType:a,compressed:l,maxDuration:i,camera:o,success:e=>n(function(e){return[{...j(e,["tempFilePath","thumbTempFilePath","errMsg"]),type:"video",url:e.tempFilePath,thumb:e.thumbTempFilePath,size:e.size,name:e.name,file:e}]}(e)),fail:c});break;case"file":let r={count:t?u:1,type:e,success:e=>n(z(e)),fail:c};d.length&&d.length>0&&(r.extension=d),uni.chooseFile(r);break;default:let p={count:t?u:1,type:"all",success:e=>n(z(e)),fail:c};d.length&&d.length>0&&(p.extension=d),uni.chooseFile(p)}}))}const A=D({name:"u-upload",mixins:[a,l,{watch:{accept:{immediate:!0,handler(e){}}}},e({props:{accept:{type:String,default:()=>t.upload.accept},extension:{type:Array,default:()=>t.upload.extension},capture:{type:[String,Array],default:()=>t.upload.capture},compressed:{type:Boolean,default:()=>t.upload.compressed},camera:{type:String,default:()=>t.upload.camera},maxDuration:{type:Number,default:()=>t.upload.maxDuration},uploadIcon:{type:String,default:()=>t.upload.uploadIcon},uploadIconColor:{type:String,default:()=>t.upload.uploadIconColor},useBeforeRead:{type:Boolean,default:()=>t.upload.useBeforeRead},afterRead:{type:Function,default:null},beforeRead:{type:Function,default:null},previewFullImage:{type:Boolean,default:()=>t.upload.previewFullImage},maxCount:{type:[String,Number],default:()=>t.upload.maxCount},disabled:{type:Boolean,default:()=>t.upload.disabled},imageMode:{type:String,default:()=>t.upload.imageMode},name:{type:String,default:()=>t.upload.name},sizeType:{type:Array,default:()=>t.upload.sizeType},multiple:{type:Boolean,default:()=>t.upload.multiple},deletable:{type:Boolean,default:()=>t.upload.deletable},maxSize:{type:[String,Number],default:()=>t.upload.maxSize},fileList:{type:Array,default:()=>t.upload.fileList},uploadText:{type:String,default:()=>t.upload.uploadText},width:{type:[String,Number],default:()=>t.upload.width},height:{type:[String,Number],default:()=>t.upload.height},previewImage:{type:Boolean,default:()=>t.upload.previewImage}}})],data:()=>({lists:[],isInCount:!0}),watch:{fileList:{handler(){this.formatFileList()},immediate:!0,deep:!0},deletable(e){this.formatFileList()},maxCount(e){this.formatFileList()},accept(e){this.formatFileList()}},emits:["error","beforeRead","oversize","afterRead","delete","clickPreview"],methods:{addUnit:i,addStyle:s,formatFileList(){const{fileList:e=[],maxCount:t}=this,a=e.map((e=>Object.assign(Object.assign({},e),{isImage:"image"===this.accept||o.image(e.url||e.thumb),isVideo:"video"===this.accept||o.video(e.url||e.thumb),deletable:"boolean"==typeof e.deletable?e.deletable:this.deletable})));this.lists=a,this.isInCount=a.length<t},chooseFile(){const{maxCount:e,multiple:t,lists:a,disabled:l}=this;if(l)return;let i;try{i=o.array(this.capture)?this.capture:this.capture.split(",")}catch(s){i=[]}P(Object.assign({accept:this.accept,extension:this.extension,multiple:this.multiple,capture:i,compressed:this.compressed,maxDuration:this.maxDuration,sizeType:this.sizeType,camera:this.camera},{maxCount:e-a.length})).then((e=>{this.onBeforeRead(t?e:e[0])})).catch((e=>{this.$emit("error",e)}))},onBeforeRead(e){const{beforeRead:t,useBeforeRead:a}=this;let l=!0;o.func(t)&&(l=t(e,this.getDetail())),a&&(l=new Promise(((t,a)=>{this.$emit("beforeRead",Object.assign(Object.assign({file:e},this.getDetail()),{callback:e=>{e?t():a()}}))}))),l&&(o.promise(l)?l.then((t=>this.onAfterRead(t||e))):this.onAfterRead(e))},getDetail(e){return{name:this.name,index:null==e?this.fileList.length:e}},onAfterRead(e){const{maxSize:t,afterRead:a}=this;(Array.isArray(e)?e.some((e=>e.size>t)):e.size>t)?this.$emit("oversize",Object.assign({file:e},this.getDetail())):("function"==typeof a&&a(e,this.getDetail()),this.$emit("afterRead",Object.assign({file:e},this.getDetail())))},deleteItem(e){this.$emit("delete",Object.assign(Object.assign({},this.getDetail(e)),{file:this.fileList[e]}))},onPreviewImage(e){e.isImage&&this.previewFullImage&&uni.previewImage({urls:this.lists.filter((e=>"image"===this.accept||o.image(e.url||e.thumb))).map((e=>e.url||e.thumb)),current:e.url||e.thumb,fail(){u("预览图片失败")}})},onPreviewVideo(e){this.previewFullImage&&(e.currentTarget.dataset,this.data)},onClickPreview(e){const{index:t}=e.currentTarget.dataset,a=this.data.lists[t];if(this.previewFullImage){if("video"===a.type)this.onPreviewVideo(e);this.$emit("clickPreview",Object.assign(Object.assign({},a),this.getDetail(t)))}}}},[["render",function(e,t,a,l,i,s){const o=R,u=F(d("u-icon"),C),D=v,j=x,z=F(d("u-loading-icon"),I);return n(),c(j,{class:"u-upload",style:b([s.addStyle(e.customStyle)])},{default:r((()=>[p(j,{class:"u-upload__wrap"},{default:r((()=>[e.previewImage?(n(!0),f(h,{key:0},m(i.lists,((t,a)=>(n(),c(j,{class:"u-upload__wrap__preview",key:a},{default:r((()=>[t.isImage||t.type&&"image"===t.type?(n(),c(o,{key:0,src:t.thumb||t.url,mode:e.imageMode,class:"u-upload__wrap__preview__image",onClick:e=>s.onPreviewImage(t),style:b([{width:s.addUnit(e.width),height:s.addUnit(e.height)}])},null,8,["src","mode","onClick","style"])):(n(),c(j,{key:1,class:"u-upload__wrap__preview__other",onClick:e=>s.onClickPreview(e,t)},{default:r((()=>[p(u,{color:"#80CBF9",size:"26",name:t.isVideo||t.type&&"video"===t.type?"movie":"folder"},null,8,["name"]),p(D,{class:"u-upload__wrap__preview__other__text"},{default:r((()=>[w(k(t.isVideo||t.type&&"video"===t.type?"视频":"文件"),1)])),_:2},1024)])),_:2},1032,["onClick"])),"uploading"===t.status||"failed"===t.status?(n(),c(j,{key:2,class:"u-upload__status"},{default:r((()=>[p(j,{class:"u-upload__status__icon"},{default:r((()=>["failed"===t.status?(n(),c(u,{key:0,name:"close-circle",color:"#ffffff",size:"25"})):(n(),c(z,{key:1,size:"22",mode:"circle",color:"#ffffff"}))])),_:2},1024),t.message?(n(),c(D,{key:0,class:"u-upload__status__message"},{default:r((()=>[w(k(t.message),1)])),_:2},1024)):_("",!0)])),_:2},1024)):_("",!0),"uploading"!==t.status&&(e.deletable||t.deletable)?(n(),c(j,{key:3,class:"u-upload__deletable",onClick:L((e=>s.deleteItem(a)),["stop"])},{default:r((()=>[p(j,{class:"u-upload__deletable__icon"},{default:r((()=>[p(u,{name:"close",color:"#ffffff",size:"10"})])),_:1})])),_:2},1032,["onClick"])):_("",!0),"success"===t.status?(n(),c(j,{key:4,class:"u-upload__success"},{default:r((()=>[p(j,{class:"u-upload__success__icon"},{default:r((()=>[p(u,{name:"checkmark",color:"#ffffff",size:"12"})])),_:1})])),_:1})):_("",!0)])),_:2},1024)))),128)):_("",!0),i.isInCount?(n(),f(h,{key:1},[e.$slots.trigger?(n(),c(j,{key:0,onClick:s.chooseFile},{default:r((()=>[g(e.$slots,"trigger",{},void 0,!0)])),_:3},8,["onClick"])):e.$slots.trigger||!e.$slots.default&&!e.$slots.$default?(n(),c(j,{key:2,class:y(["u-upload__button",[e.disabled&&"u-upload__button--disabled"]]),"hover-class":e.disabled?"":"u-upload__button--hover","hover-stay-time":"150",onClick:s.chooseFile,style:b([{width:s.addUnit(e.width),height:s.addUnit(e.height)}])},{default:r((()=>[p(u,{name:e.uploadIcon,size:"26",color:e.uploadIconColor},null,8,["name","color"]),e.uploadText?(n(),c(D,{key:0,class:"u-upload__button__text"},{default:r((()=>[w(k(e.uploadText),1)])),_:1})):_("",!0)])),_:1},8,["hover-class","onClick","class","style"])):(n(),c(j,{key:1,onClick:s.chooseFile},{default:r((()=>[g(e.$slots,"default",{},void 0,!0)])),_:3},8,["onClick"]))],64)):_("",!0)])),_:3})])),_:3},8,["style"])}],["__scopeId","data-v-af259c40"]]);const S=D({data:()=>({fileList1:[],fileList2:[],fileList3:[{url:"https://cdn.uviewui.com/uview/swiper/1.jpg"}],fileList4:[{url:"https://cdn.uviewui.com/uview/swiper/1.jpg"},{url:"https://cdn.uviewui.com/uview/swiper/1.jpg"}],fileList5:[],fileList6:[],fileList7:[]}),onLoad(){},methods:{deletePic(e){this[`fileList${e.name}`].splice(e.index,1)},async afterRead(e){let t=[].concat(e.file),a=this[`fileList${e.name}`].length;t.map((t=>{this[`fileList${e.name}`].push({...t,status:"uploading",message:"上传中"})}));for(let l=0;l<t.length;l++){const i=await this.uploadFilePromise(t[l].url);let s=this[`fileList${e.name}`][a];this[`fileList${e.name}`].splice(a,1,Object.assign(s,{status:"success",message:"",url:i})),a++}},uploadFilePromise:e=>new Promise(((t,a)=>{uni.uploadFile({url:"http://www.example.com/upload",filePath:e,name:"file",formData:{user:"test"},success:e=>{setTimeout((()=>{t(e.data.data)}),1e3)}})}))}},[["render",function(e,t,a,l,i,s){const o=v,u=F(d("up-upload"),A),f=x,m=R;return n(),c(f,{class:"u-page"},{default:r((()=>[p(f,{class:"u-demo-block"},{default:r((()=>[p(o,{class:"u-demo-block__title"},{default:r((()=>[w("基础用法")])),_:1}),p(f,{class:"u-demo-block__content"},{default:r((()=>[p(f,{class:"u-page__upload-item"},{default:r((()=>[p(u,{fileList:i.fileList1,onAfterRead:s.afterRead,onDelete:s.deletePic,name:"1",multiple:"",maxCount:10},null,8,["fileList","onAfterRead","onDelete"])])),_:1})])),_:1})])),_:1}),p(f,{class:"u-demo-block"},{default:r((()=>[p(o,{class:"u-demo-block__title"},{default:r((()=>[w("上传视频")])),_:1}),p(f,{class:"u-demo-block__content"},{default:r((()=>[p(f,{class:"u-page__upload-item"},{default:r((()=>[p(u,{fileList:i.fileList2,onAfterRead:s.afterRead,onDelete:s.deletePic,name:"2",multiple:"",maxCount:10,accept:"video"},null,8,["fileList","onAfterRead","onDelete"])])),_:1})])),_:1})])),_:1}),p(f,{class:"u-demo-block"},{default:r((()=>[p(o,{class:"u-demo-block__title"},{default:r((()=>[w("文件预览")])),_:1}),p(f,{class:"u-demo-block__content"},{default:r((()=>[p(f,{class:"u-page__upload-item"},{default:r((()=>[p(u,{fileList:i.fileList3,onAfterRead:s.afterRead,onDelete:s.deletePic,name:"3",multiple:"",maxCount:10,previewFullImage:!0},null,8,["fileList","onAfterRead","onDelete"])])),_:1})])),_:1})])),_:1}),p(f,{class:"u-demo-block"},{default:r((()=>[p(o,{class:"u-demo-block__title"},{default:r((()=>[w("隐藏上传按钮")])),_:1}),p(f,{class:"u-demo-block__content"},{default:r((()=>[p(f,{class:"u-page__upload-item"},{default:r((()=>[p(u,{fileList:i.fileList4,onAfterRead:s.afterRead,onDelete:s.deletePic,name:"4",multiple:"",maxCount:2},null,8,["fileList","onAfterRead","onDelete"])])),_:1})])),_:1})])),_:1}),p(f,{class:"u-demo-block"},{default:r((()=>[p(o,{class:"u-demo-block__title"},{default:r((()=>[w("限制上传数量")])),_:1}),p(f,{class:"u-demo-block__content"},{default:r((()=>[p(f,{class:"u-page__upload-item"},{default:r((()=>[p(u,{fileList:i.fileList5,onAfterRead:s.afterRead,onDelete:s.deletePic,name:"5",multiple:"",maxCount:3},null,8,["fileList","onAfterRead","onDelete"])])),_:1})])),_:1})])),_:1}),p(f,{class:"u-demo-block"},{default:r((()=>[p(o,{class:"u-demo-block__title"},{default:r((()=>[w("自定义上传样式")])),_:1}),p(f,{class:"u-demo-block__content"},{default:r((()=>[p(f,{class:"u-page__upload-item"},{default:r((()=>[p(u,{fileList:i.fileList6,onAfterRead:s.afterRead,onDelete:s.deletePic,name:"6",multiple:"",maxCount:1,width:"250",height:"150"},{default:r((()=>[p(m,{src:"https://cdn.uviewui.com/uview/demo/upload/positive.png",mode:"widthFix",style:{width:"250px",height:"150px"}})])),_:1},8,["fileList","onAfterRead","onDelete"])])),_:1})])),_:1})])),_:1})])),_:1})}],["__scopeId","data-v-fd1a466a"]]);export{S as default};
