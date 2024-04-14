import{m as e,f as t,d as r,o as n,c as i,w as s,a as o,n as a,h as l,j as u,l as f,t as d,k as c,i as p}from"./index-3ba8b7f8.js";import{_ as m}from"./u-icon.e844a29f.js";import{r as y}from"./uni-app.es.d12affb2.js";import{_ as h}from"./u-line.85ba3e88.js";import{_ as g}from"./_plugin-vue_export-helper.1b428a4d.js";const b=g({name:"u-form-item",mixins:[e,t,{props:{label:{type:String,default:()=>uni.$u.props.formItem.label},prop:{type:String,default:()=>uni.$u.props.formItem.prop},rule:{type:String,default:()=>uni.$u.props.formItem.rule},borderBottom:{type:[String,Boolean],default:()=>uni.$u.props.formItem.borderBottom},labelPosition:{type:String,default:()=>uni.$u.props.formItem.labelPosition},labelWidth:{type:[String,Number],default:()=>uni.$u.props.formItem.labelWidth},rightIcon:{type:String,default:()=>uni.$u.props.formItem.rightIcon},leftIcon:{type:String,default:()=>uni.$u.props.formItem.leftIcon},required:{type:Boolean,default:()=>uni.$u.props.formItem.required},leftIconStyle:{type:[String,Object],default:()=>uni.$u.props.formItem.leftIconStyle}}}],data:()=>({message:"",parentData:{labelPosition:"left",labelAlign:"left",labelStyle:{},labelWidth:45,errorType:"message"}}),computed:{propsLine:()=>uni.$u.props.line},mounted(){this.init()},emits:["click"],methods:{init(){this.updateParentData(),this.parent||uni.$u.error("u-form-item需要结合u-form组件使用")},updateParentData(){this.getParentData("u-form")},clearValidate(){this.message=null},resetField(){const e=uni.$u.getProperty(this.parent.originalModel,this.prop);uni.$u.setProperty(this.parent.model,this.prop,e),this.message=null},clickHandler(){this.$emit("click")}}},[["render",function(e,t,g,b,_,q){const v=c,w=y(r("u-icon"),m),$=p,x=y(r("u-line"),h);return n(),i($,{class:"u-form-item"},{default:s((()=>[o($,{class:"u-form-item__body",onClick:q.clickHandler,style:a([e.$u.addStyle(e.customStyle),{flexDirection:"left"===(e.labelPosition||_.parentData.labelPosition)?"row":"column"}])},{default:s((()=>[l(e.$slots,"label",{},(()=>[e.required||e.leftIcon||e.label?(n(),i($,{key:0,class:"u-form-item__body__left",style:a({width:e.$u.addUnit(e.labelWidth||_.parentData.labelWidth),marginBottom:"left"===_.parentData.labelPosition?0:"5px"})},{default:s((()=>[o($,{class:"u-form-item__body__left__content"},{default:s((()=>[e.required?(n(),i(v,{key:0,class:"u-form-item__body__left__content__required"},{default:s((()=>[u("*")])),_:1})):f("",!0),e.leftIcon?(n(),i($,{key:1,class:"u-form-item__body__left__content__icon"},{default:s((()=>[o(w,{name:e.leftIcon,"custom-style":e.leftIconStyle},null,8,["name","custom-style"])])),_:1})):f("",!0),o(v,{class:"u-form-item__body__left__content__label",style:a([_.parentData.labelStyle,{justifyContent:"left"===_.parentData.labelAlign?"flex-start":"center"===_.parentData.labelAlign?"center":"flex-end"}])},{default:s((()=>[u(d(e.label),1)])),_:1},8,["style"])])),_:1})])),_:1},8,["style"])):f("",!0)]),!0),o($,{class:"u-form-item__body__right"},{default:s((()=>[o($,{class:"u-form-item__body__right__content"},{default:s((()=>[o($,{class:"u-form-item__body__right__content__slot"},{default:s((()=>[l(e.$slots,"default",{},void 0,!0)])),_:3}),e.$slots.right?(n(),i($,{key:0,class:"item__body__right__content__icon"},{default:s((()=>[l(e.$slots,"right",{},void 0,!0)])),_:3})):f("",!0)])),_:3})])),_:3})])),_:3},8,["onClick","style"]),l(e.$slots,"error",{},(()=>[_.message&&"message"===_.parentData.errorType?(n(),i(v,{key:0,class:"u-form-item__body__right__message",style:a({marginLeft:e.$u.addUnit("top"===_.parentData.labelPosition?0:e.labelWidth||_.parentData.labelWidth)})},{default:s((()=>[u(d(_.message),1)])),_:1},8,["style"])):f("",!0)]),!0),e.borderBottom?(n(),i(x,{key:0,color:_.message&&"border-bottom"===_.parentData.errorType?e.$u.color.error:q.propsLine.color,customStyle:`margin-top: ${_.message&&"message"===_.parentData.errorType?"5px":0}`},null,8,["color","customStyle"])):f("",!0)])),_:3})}],["__scopeId","data-v-91cdd639"]]),_={props:{model:{type:Object,default:()=>uni.$u.props.form.model},rules:{type:[Object,Function,Array],default:()=>uni.$u.props.form.rules},errorType:{type:String,default:()=>uni.$u.props.form.errorType},borderBottom:{type:Boolean,default:()=>uni.$u.props.form.borderBottom},labelPosition:{type:String,default:()=>uni.$u.props.form.labelPosition},labelWidth:{type:[String,Number],default:()=>uni.$u.props.form.labelWidth},labelAlign:{type:String,default:()=>uni.$u.props.form.labelAlign},labelStyle:{type:Object,default:()=>uni.$u.props.form.labelStyle}}},q=/%[sdj%]/g;let v=function(){};function w(e){if(!e||!e.length)return null;const t={};return e.forEach((e=>{const{field:r}=e;t[r]=t[r]||[],t[r].push(e)})),t}function $(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];let n=1;const i=t[0],s=t.length;if("function"==typeof i)return i.apply(null,t.slice(1));if("string"==typeof i){let e=String(i).replace(q,(e=>{if("%%"===e)return"%";if(n>=s)return e;switch(e){case"%s":return String(t[n++]);case"%d":return Number(t[n++]);case"%j":try{return JSON.stringify(t[n++])}catch(r){return"[Circular]"}break;default:return e}}));for(let r=t[n];n<s;r=t[++n])e+=` ${r}`;return e}return i}function x(e,t){return null==e||(!("array"!==t||!Array.isArray(e)||e.length)||!(!function(e){return"string"===e||"url"===e||"hex"===e||"email"===e||"pattern"===e}(t)||"string"!=typeof e||e))}function P(e,t,r){let n=0;const i=e.length;!function s(o){if(o&&o.length)return void r(o);const a=n;n+=1,a<i?t(e[a],s):r([])}([])}function O(e,t,r,n){if(t.first){const t=new Promise(((t,i)=>{const s=function(e){const t=[];return Object.keys(e).forEach((r=>{t.push.apply(t,e[r])})),t}(e);P(s,r,(function(e){return n(e),e.length?i({errors:e,fields:w(e)}):t()}))}));return t.catch((e=>e)),t}let i=t.firstFields||[];!0===i&&(i=Object.keys(e));const s=Object.keys(e),o=s.length;let a=0;const l=[],u=new Promise(((t,u)=>{const f=function(e){if(l.push.apply(l,e),a++,a===o)return n(l),l.length?u({errors:l,fields:w(l)}):t()};s.length||(n(l),t()),s.forEach((t=>{const n=e[t];-1!==i.indexOf(t)?P(n,r,f):function(e,t,r){const n=[];let i=0;const s=e.length;function o(e){n.push.apply(n,e),i++,i===s&&r(n)}e.forEach((e=>{t(e,o)}))}(n,r,f)}))}));return u.catch((e=>e)),u}function j(e){return function(t){return t&&t.message?(t.field=t.field||e.fullField,t):{message:"function"==typeof t?t():t,field:t.field||e.fullField}}}function A(e,t){if(t)for(const r in t)if(t.hasOwnProperty(r)){const n=t[r];"object"==typeof n&&"object"==typeof e[r]?e[r]={...e[r],...n}:e[r]=n}return e}function F(e,t,r,n,i,s){!e.required||r.hasOwnProperty(e.field)&&!x(t,s||e.type)||n.push($(i.messages.required,e.fullField))}"undefined"!=typeof process&&process.env;const S={email:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,url:new RegExp("^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$","i"),hex:/^#?([a-f0-9]{6}|[a-f0-9]{3})$/i};var k={integer:function(e){return/^(-)?\d+$/.test(e)},float:function(e){return/^(-)?\d+(\.\d+)?$/.test(e)},array:function(e){return Array.isArray(e)},regexp:function(e){if(e instanceof RegExp)return!0;try{return!!new RegExp(e)}catch(t){return!1}},date:function(e){return"function"==typeof e.getTime&&"function"==typeof e.getMonth&&"function"==typeof e.getYear},number:function(e){return!isNaN(e)&&"number"==typeof+e},object:function(e){return"object"==typeof e&&!k.array(e)},method:function(e){return"function"==typeof e},email:function(e){return"string"==typeof e&&!!e.match(S.email)&&e.length<255},url:function(e){return"string"==typeof e&&!!e.match(S.url)},hex:function(e){return"string"==typeof e&&!!e.match(S.hex)}};const D="enum";const I={required:F,whitespace:function(e,t,r,n,i){(/^\s+$/.test(t)||""===t)&&n.push($(i.messages.whitespace,e.fullField))},type:function(e,t,r,n,i){if(e.required&&void 0===t)return void F(e,t,r,n,i);const s=e.type;["integer","float","array","regexp","object","method","email","number","date","url","hex"].indexOf(s)>-1?k[s](t)||n.push($(i.messages.types[s],e.fullField,e.type)):s&&typeof t!==e.type&&n.push($(i.messages.types[s],e.fullField,e.type))},range:function(e,t,r,n,i){const s="number"==typeof e.len,o="number"==typeof e.min,a="number"==typeof e.max,l=/[\uD800-\uDBFF][\uDC00-\uDFFF]/g;let u=t,f=null;const d="number"==typeof t,c="string"==typeof t,p=Array.isArray(t);if(d?f="number":c?f="string":p&&(f="array"),!f)return!1;p&&(u=t.length),c&&(u=t.replace(l,"_").length),s?u!==e.len&&n.push($(i.messages[f].len,e.fullField,e.len)):o&&!a&&u<e.min?n.push($(i.messages[f].min,e.fullField,e.min)):a&&!o&&u>e.max?n.push($(i.messages[f].max,e.fullField,e.max)):o&&a&&(u<e.min||u>e.max)&&n.push($(i.messages[f].range,e.fullField,e.min,e.max))},enum:function(e,t,r,n,i){e[D]=Array.isArray(e[D])?e[D]:[],-1===e[D].indexOf(t)&&n.push($(i.messages[D],e.fullField,e[D].join(", ")))},pattern:function(e,t,r,n,i){if(e.pattern)if(e.pattern instanceof RegExp)e.pattern.lastIndex=0,e.pattern.test(t)||n.push($(i.messages.pattern.mismatch,e.fullField,t,e.pattern));else if("string"==typeof e.pattern){new RegExp(e.pattern).test(t)||n.push($(i.messages.pattern.mismatch,e.fullField,t,e.pattern))}}};function E(e,t,r,n,i){const s=e.type,o=[];if(e.required||!e.required&&n.hasOwnProperty(e.field)){if(x(t,s)&&!e.required)return r();I.required(e,t,n,o,i,s),x(t,s)||I.type(e,t,n,o,i)}r(o)}const T={string:function(e,t,r,n,i){const s=[];if(e.required||!e.required&&n.hasOwnProperty(e.field)){if(x(t,"string")&&!e.required)return r();I.required(e,t,n,s,i,"string"),x(t,"string")||(I.type(e,t,n,s,i),I.range(e,t,n,s,i),I.pattern(e,t,n,s,i),!0===e.whitespace&&I.whitespace(e,t,n,s,i))}r(s)},method:function(e,t,r,n,i){const s=[];if(e.required||!e.required&&n.hasOwnProperty(e.field)){if(x(t)&&!e.required)return r();I.required(e,t,n,s,i),void 0!==t&&I.type(e,t,n,s,i)}r(s)},number:function(e,t,r,n,i){const s=[];if(e.required||!e.required&&n.hasOwnProperty(e.field)){if(""===t&&(t=void 0),x(t)&&!e.required)return r();I.required(e,t,n,s,i),void 0!==t&&(I.type(e,t,n,s,i),I.range(e,t,n,s,i))}r(s)},boolean:function(e,t,r,n,i){const s=[];if(e.required||!e.required&&n.hasOwnProperty(e.field)){if(x(t)&&!e.required)return r();I.required(e,t,n,s,i),void 0!==t&&I.type(e,t,n,s,i)}r(s)},regexp:function(e,t,r,n,i){const s=[];if(e.required||!e.required&&n.hasOwnProperty(e.field)){if(x(t)&&!e.required)return r();I.required(e,t,n,s,i),x(t)||I.type(e,t,n,s,i)}r(s)},integer:function(e,t,r,n,i){const s=[];if(e.required||!e.required&&n.hasOwnProperty(e.field)){if(x(t)&&!e.required)return r();I.required(e,t,n,s,i),void 0!==t&&(I.type(e,t,n,s,i),I.range(e,t,n,s,i))}r(s)},float:function(e,t,r,n,i){const s=[];if(e.required||!e.required&&n.hasOwnProperty(e.field)){if(x(t)&&!e.required)return r();I.required(e,t,n,s,i),void 0!==t&&(I.type(e,t,n,s,i),I.range(e,t,n,s,i))}r(s)},array:function(e,t,r,n,i){const s=[];if(e.required||!e.required&&n.hasOwnProperty(e.field)){if(x(t,"array")&&!e.required)return r();I.required(e,t,n,s,i,"array"),x(t,"array")||(I.type(e,t,n,s,i),I.range(e,t,n,s,i))}r(s)},object:function(e,t,r,n,i){const s=[];if(e.required||!e.required&&n.hasOwnProperty(e.field)){if(x(t)&&!e.required)return r();I.required(e,t,n,s,i),void 0!==t&&I.type(e,t,n,s,i)}r(s)},enum:function(e,t,r,n,i){const s=[];if(e.required||!e.required&&n.hasOwnProperty(e.field)){if(x(t)&&!e.required)return r();I.required(e,t,n,s,i),void 0!==t&&I.enum(e,t,n,s,i)}r(s)},pattern:function(e,t,r,n,i){const s=[];if(e.required||!e.required&&n.hasOwnProperty(e.field)){if(x(t,"string")&&!e.required)return r();I.required(e,t,n,s,i),x(t,"string")||I.pattern(e,t,n,s,i)}r(s)},date:function(e,t,r,n,i){const s=[];if(e.required||!e.required&&n.hasOwnProperty(e.field)){if(x(t)&&!e.required)return r();if(I.required(e,t,n,s,i),!x(t)){let r;r="number"==typeof t?new Date(t):t,I.type(e,r,n,s,i),r&&I.range(e,r.getTime(),n,s,i)}}r(s)},url:E,hex:E,email:E,required:function(e,t,r,n,i){const s=[],o=Array.isArray(t)?"array":typeof t;I.required(e,t,n,s,i,o),r(s)},any:function(e,t,r,n,i){const s=[];if(e.required||!e.required&&n.hasOwnProperty(e.field)){if(x(t)&&!e.required)return r();I.required(e,t,n,s,i)}r(s)}};function R(){return{default:"Validation error on field %s",required:"%s is required",enum:"%s must be one of %s",whitespace:"%s cannot be empty",date:{format:"%s date %s is invalid for format %s",parse:"%s date could not be parsed, %s is invalid ",invalid:"%s date %s is invalid"},types:{string:"%s is not a %s",method:"%s is not a %s (function)",array:"%s is not an %s",object:"%s is not an %s",number:"%s is not a %s",date:"%s is not a %s",boolean:"%s is not a %s",integer:"%s is not an %s",float:"%s is not a %s",regexp:"%s is not a valid %s",email:"%s is not a valid %s",url:"%s is not a valid %s",hex:"%s is not a valid %s"},string:{len:"%s must be exactly %s characters",min:"%s must be at least %s characters",max:"%s cannot be longer than %s characters",range:"%s must be between %s and %s characters"},number:{len:"%s must equal %s",min:"%s cannot be less than %s",max:"%s cannot be greater than %s",range:"%s must be between %s and %s"},array:{len:"%s must be exactly %s in length",min:"%s cannot be less than %s in length",max:"%s cannot be greater than %s in length",range:"%s must be between %s and %s in length"},pattern:{mismatch:"%s value %s does not match pattern %s"},clone:function(){const e=JSON.parse(JSON.stringify(this));return e.clone=this.clone,e}}}const B=R();function C(e){this.rules=null,this._messages=B,this.define(e)}C.prototype={messages:function(e){return e&&(this._messages=A(R(),e)),this._messages},define:function(e){if(!e)throw new Error("Cannot configure a schema with no rules");if("object"!=typeof e||Array.isArray(e))throw new Error("Rules must be an object");let t,r;for(t in this.rules={},e)e.hasOwnProperty(t)&&(r=e[t],this.rules[t]=Array.isArray(r)?r:[r])},validate:function(e,t,r){const n=this;void 0===t&&(t={}),void 0===r&&(r=function(){});let i,s,o=e,a=t,l=r;if("function"==typeof a&&(l=a,a={}),!this.rules||0===Object.keys(this.rules).length)return l&&l(),Promise.resolve();if(a.messages){let e=this.messages();e===B&&(e=R()),A(e,a.messages),a.messages=e}else a.messages=this.messages();const u={};(a.keys||Object.keys(this.rules)).forEach((t=>{i=n.rules[t],s=o[t],i.forEach((r=>{let i=r;"function"==typeof i.transform&&(o===e&&(o={...o}),s=o[t]=i.transform(s)),i="function"==typeof i?{validator:i}:{...i},i.validator=n.getValidationMethod(i),i.field=t,i.fullField=i.fullField||t,i.type=n.getType(i),i.validator&&(u[t]=u[t]||[],u[t].push({rule:i,value:s,source:o,field:t}))}))}));const f={};return O(u,a,((e,t)=>{const{rule:r}=e;let n,i=!("object"!==r.type&&"array"!==r.type||"object"!=typeof r.fields&&"object"!=typeof r.defaultField);function s(e,t){return{...t,fullField:`${r.fullField}.${e}`}}function o(n){void 0===n&&(n=[]);let o=n;if(Array.isArray(o)||(o=[o]),!a.suppressWarning&&o.length&&C.warning("async-validator:",o),o.length&&r.message&&(o=[].concat(r.message)),o=o.map(j(r)),a.first&&o.length)return f[r.field]=1,t(o);if(i){if(r.required&&!e.value)return o=r.message?[].concat(r.message).map(j(r)):a.error?[a.error(r,$(a.messages.required,r.field))]:[],t(o);let n={};if(r.defaultField)for(const t in e.value)e.value.hasOwnProperty(t)&&(n[t]=r.defaultField);n={...n,...e.rule.fields};for(const e in n)if(n.hasOwnProperty(e)){const t=Array.isArray(n[e])?n[e]:[n[e]];n[e]=t.map(s.bind(null,e))}const i=new C(n);i.messages(a.messages),e.rule.options&&(e.rule.options.messages=a.messages,e.rule.options.error=a.error),i.validate(e.value,e.rule.options||a,(e=>{const r=[];o&&o.length&&r.push.apply(r,o),e&&e.length&&r.push.apply(r,e),t(r.length?r:null)}))}else t(o)}i=i&&(r.required||!r.required&&e.value),r.field=e.field,r.asyncValidator?n=r.asyncValidator(r,e.value,o,e.source,a):r.validator&&(n=r.validator(r,e.value,o,e.source,a),!0===n?o():!1===n?o(r.message||`${r.field} fails`):n instanceof Array?o(n):n instanceof Error&&o(n.message)),n&&n.then&&n.then((()=>o()),(e=>o(e)))}),(e=>{!function(e){let t,r=[],n={};function i(e){if(Array.isArray(e)){let t;r=(t=r).concat.apply(t,e)}else r.push(e)}for(t=0;t<e.length;t++)i(e[t]);r.length?n=w(r):(r=null,n=null),l(r,n)}(e)}))},getType:function(e){if(void 0===e.type&&e.pattern instanceof RegExp&&(e.type="pattern"),"function"!=typeof e.validator&&e.type&&!T.hasOwnProperty(e.type))throw new Error($("Unknown rule type %s",e.type));return e.type||"string"},getValidationMethod:function(e){if("function"==typeof e.validator)return e.validator;const t=Object.keys(e),r=t.indexOf("message");return-1!==r&&t.splice(r,1),1===t.length&&"required"===t[0]?T.required:T[this.getType(e)]||!1}},C.register=function(e,t){if("function"!=typeof t)throw new Error("Cannot register a validator by type, validator is not a function");T[e]=t},C.warning=v,C.messages=B,C.warning=function(){};const W=g({name:"u-form",mixins:[e,t,_],provide(){return{uForm:this}},data:()=>({formRules:{},validator:{},originalModel:null}),watch:{rules:{immediate:!0,handler(e){this.setRules(e)}},propsChange(e){var t;(null==(t=this.children)?void 0:t.length)&&this.children.map((e=>{"function"==typeof e.updateParentData&&e.updateParentData()}))},model:{immediate:!0,handler(e){this.originalModel||(this.originalModel=uni.$u.deepClone(e))}}},computed:{propsChange(){return[this.errorType,this.borderBottom,this.labelPosition,this.labelWidth,this.labelAlign,this.labelStyle]}},created(){this.children=[]},methods:{setRules(e){0!==Object.keys(e).length&&(this.formRules=e,this.validator=new C(e))},resetFields(){this.resetModel()},resetModel(e){this.children.map((e=>{const t=null==e?void 0:e.prop,r=uni.$u.getProperty(this.originalModel,t);uni.$u.setProperty(this.model,t,r)}))},clearValidate(e){e=[].concat(e),this.children.map((t=>{(void 0===e[0]||e.includes(t.prop))&&(t.message=null)}))},async validateField(e,t,r=null){this.$nextTick((()=>{const n=[];e=[].concat(e),this.children.map((t=>{const i=[];if(e.includes(t.prop)){const e=uni.$u.getProperty(this.model,t.prop),s=t.prop.split("."),o=s[s.length-1],a=this.formRules[t.rule||t.prop];if(!a)return;const l=[].concat(a);for(let u=0;u<l.length;u++){const s=l[u],a=[].concat(null==s?void 0:s.trigger);if(r&&!a.includes(r))continue;new C({[o]:s}).validate({[o]:e},((e,r)=>{var s;uni.$u.test.array(e)&&(n.push(...e),i.push(...e)),t.message=(null==(s=i[0])?void 0:s.message)?i[0].message:null}))}}})),"function"==typeof t&&t(n)}))},validate(e){return new Promise(((e,t)=>{this.$nextTick((()=>{const r=this.children.map((e=>e.prop));this.validateField(r,(r=>{r.length?("toast"===this.errorType&&uni.$u.toast(r[0].message),t(r)):e(!0)}))}))}))}}},[["render",function(e,t,r,o,a,u){const f=p;return n(),i(f,{class:"u-form"},{default:s((()=>[l(e.$slots,"default")])),_:3})}]]);export{b as _,W as a};