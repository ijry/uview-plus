import{o as s,c as a,w as e,i as t,a as n,j as o,p as l,t as i,d as c,k as r}from"./index-12078299.js";import{_ as u}from"./u-message-input.fcf26a76.js";import{r as h}from"./uni-app.es.c53c76b4.js";import{_ as d}from"./_plugin-vue_export-helper.1b428a4d.js";const p=d({data:()=>({maxlength:4,value:"",second:3,show:!1,error:!1}),computed:{},onLoad(){let s=setInterval((()=>{this.second--,this.second<=0&&(this.show=!0,4!=this.value.lenth&&(this.error=!0),clearInterval(s))}),1e3)},methods:{noCaptcha(){uni.showActionSheet({itemList:["重新获取验证码","接听语音验证码"],success:function(s){},fail:function(s){}})},change(s){},finish(s){}}},[["render",function(d,p,f,m,_,g){const v=t,w=h(c("up-message-input"),u),x=r;return s(),a(v,{class:"wrap"},{default:e((()=>[n(v,{class:"key-input"},{default:e((()=>[n(v,{class:"title"},{default:e((()=>[o("输入验证码")])),_:1}),n(v,{class:"tips"},{default:e((()=>[o("验证码已发送至 +150****9320")])),_:1}),n(w,{focus:!0,value:_.value,onChange:g.change,onFinish:g.finish,mode:"bottomLine",maxlength:_.maxlength},null,8,["value","onChange","onFinish","maxlength"]),n(x,{class:l({error:_.error})},{default:e((()=>[o("验证码错误，请重新输入")])),_:1},8,["class"]),n(v,{class:"captcha"},{default:e((()=>[n(x,{class:l({noCaptcha:_.show}),onClick:g.noCaptcha},{default:e((()=>[o("收不到验证码点这里")])),_:1},8,["class","onClick"]),n(x,{class:l({regain:!_.show})},{default:e((()=>[o(i(_.second)+"秒后重新获取验证码",1)])),_:1},8,["class"])])),_:1})])),_:1})])),_:1})}],["__scopeId","data-v-84342179"]]);export{p as default};