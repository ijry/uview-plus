(window.webpackJsonp=window.webpackJsonp||[]).push([[36],{412:function(t,a,i){},513:function(t,a,i){"use strict";i(412)},543:function(t,a,i){"use strict";i.r(a);var s=i(290),e=i.n(s),n={name:"githubContributionList",props:{owner:{type:String,default:"ijry"},repo:{type:String,default:"uview-plus"}},methods:{open(t){window.open(t.html_url,"_blank")}},data:()=>({tableData:[]}),created(){e.a.get(`https://api.github.com/repos/${this.owner}/${this.repo}/contributors`).then(t=>{this.tableData=t.data})}},o=(i(513),i(6)),r=Object(o.a)(n,(function(){var t=this,a=t._self._c;return a("el-row",{staticClass:"row"},t._l(t.tableData,(function(i,s){return a("el-col",{key:s,staticClass:"col",attrs:{span:80}},[a("el-card",{attrs:{shadow:"hover","body-style":{padding:"0px"}},nativeOn:{click:function(a){return t.open(i)}}},[a("el-image",{staticStyle:{width:"100px",height:"100px"},attrs:{src:i.avatar_url,fit:"fill"}}),t._v(" "),a("div",{staticStyle:{padding:"14px"}},[a("div",{staticClass:"login"},[t._v(t._s(i.login))]),t._v(" "),a("div",{staticClass:"bottom clearfix"},[a("div",{staticClass:"count"},[t._v(t._s(i.contributions)+" commit")])])])],1)],1)})),1)}),[],!1,null,"79940c62",null);a.default=r.exports}}]);