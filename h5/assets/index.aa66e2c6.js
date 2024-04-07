import"./index-aa2b8fb8.js";function t(t){return/^[\+-]?(\d+\.?\d*|\.\d+|\d\.\d+e\+\d+)$/.test(t)}function n(t){switch(typeof t){case"undefined":return!0;case"string":if(0==t.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g,"").length)return!0;break;case"boolean":if(!t)return!0;break;case"number":if(0===t||isNaN(t))return!0;break;case"object":if(null===t||0===t.length)return!0;for(const n in t)return!1;return!0}return!1}function e(t){return"[object Object]"===Object.prototype.toString.call(t)}function r(t){return"function"==typeof t}const o={email:function(t){return/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(t)},mobile:function(t){return/^1[23456789]\d{9}$/.test(t)},url:function(t){return/^((https|http|ftp|rtsp|mms):\/\/)(([0-9a-zA-Z_!~*'().&=+$%-]+: )?[0-9a-zA-Z_!~*'().&=+$%-]+@)?(([0-9]{1,3}.){3}[0-9]{1,3}|([0-9a-zA-Z_!~*'()-]+.)*([0-9a-zA-Z][0-9a-zA-Z-]{0,61})?[0-9a-zA-Z].[a-zA-Z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-zA-Z_!~*'().;?:@&=+$,%#-]+)+\/?)$/.test(t)},date:function(n){return!!n&&(t(n)&&(n=+n),!/Invalid|NaN/.test(new Date(n).toString()))},dateISO:function(t){return/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(t)},number:t,digits:function(t){return/^\d+$/.test(t)},idCard:function(t){return/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(t)},carNo:function(t){const n=/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/,e=/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;return 7===t.length?e.test(t):8===t.length&&n.test(t)},amount:function(t){return/^[1-9]\d*(,\d{3})*(\.\d{1,2})?$|^0\.\d{1,2}$/.test(t)},chinese:function(t){return/^[\u4e00-\u9fa5]+$/gi.test(t)},letter:function(t){return/^[a-zA-Z]*$/.test(t)},enOrNum:function(t){return/^[0-9a-zA-Z]*$/g.test(t)},contains:function(t,n){return t.indexOf(n)>=0},range:function(t,n){return t>=n[0]&&t<=n[1]},rangeLength:function(t,n){return t.length>=n[0]&&t.length<=n[1]},empty:n,isEmpty:n,jsonString:function(t){if("string"==typeof t)try{const n=JSON.parse(t);return!("object"!=typeof n||!n)}catch(n){return!1}return!1},landline:function(t){return/^\d{3,4}-\d{7,8}(-\d{3,4})?$/.test(t)},object:e,array:function(t){return"function"==typeof Array.isArray?Array.isArray(t):"[object Array]"===Object.prototype.toString.call(t)},code:function(t,n=6){return new RegExp(`^\\d{${n}}$`).test(t)},func:r,promise:function(t){return e(t)&&r(t.then)&&r(t.catch)},video:function(t){return/\.(mp4|mpg|mpeg|dat|asf|avi|rm|rmvb|mov|wmv|flv|mkv|m3u8)/i.test(t)},image:function(t){const n=t.split("?")[0];return/\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg)/i.test(n)},regExp:function(t){return t&&"[object RegExp]"===Object.prototype.toString.call(t)},string:function(t){return"string"==typeof t}};function i(t,n="object"){if(o.empty(t)||"object"==typeof t&&"object"===n||"string"===n&&"string"==typeof t)return t;if("object"===n){const n=(t=a(t)).split(";"),e={};for(let t=0;t<n.length;t++)if(n[t]){const r=n[t].split(":");e[a(r[0])]=a(r[1])}return e}let e="";for(const r in t){e+=`${r.replace(/([A-Z])/g,"-$1").toLowerCase()}:${t[r]};`}return a(e)}function c(t="auto",n=""){return n||(n=uni.$u.config.unit||"px"),t=String(t),o.number(t)?`${t}${n}`:t}function u(t){if([null,void 0,NaN,!1].includes(t))return t;if("object"!=typeof t&&"function"!=typeof t)return t;const n=o.array(t)?[]:{};for(const e in t)t.hasOwnProperty(e)&&(n[e]="object"==typeof t[e]?u(t[e]):t[e]);return n}function f(t={},n={}){if("object"!=typeof(t=u(t))||"object"!=typeof n)return!1;for(const e in n)n.hasOwnProperty(e)&&(e in t?null==n[e]||"object"!=typeof t[e]||"object"!=typeof n[e]?t[e]=n[e]:t[e].concat&&n[e].concat?t[e]=t[e].concat(n[e]):t[e]=f(t[e],n[e]):t[e]=n[e]);return t}function a(t,n="both"){return t=String(t),"both"==n?t.replace(/^\s+|\s+$/g,""):"left"==n?t.replace(/^\s*/,""):"right"==n?t.replace(/(\s*$)/g,""):"all"==n?t.replace(/\s+/g,""):t}String.prototype.padStart||(String.prototype.padStart=function(t,n=" "){if("[object String]"!==Object.prototype.toString.call(n))throw new TypeError("fillString must be String");const e=this;if(e.length>=t)return String(e);const r=t-e.length;let o=Math.ceil(r/n.length);for(;o>>=1;)n+=n,1===o&&(n+=n);return n.slice(0,r)+e});export{i as a,c as b,f as d};
