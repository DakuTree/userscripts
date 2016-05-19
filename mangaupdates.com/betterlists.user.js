// ==UserScript==
// @name         MangaUpdates - Better Lists
// @namespace    https://github.com/DakuTree/userscripts
// @author       Daku (admin@codeanimu.net)
// @description  Improves the functionality of the 'My Lists' feature to something "usable".
// @homepageURL  https://github.com/DakuTree/userscripts
// @supportURL   https://github.com/DakuTree/userscripts/issues
// @include      /^https?:\/\/www\.mangaupdates\.com\/mylist.html(\?list=read)?$/
// @include      /^https?:\/\/www\.mangaupdates\.com\/series.html\?id=.*$/
// @include      /^https?:\/\/www\.mangaupdates\.com\/releases.html\?.*$/
// @updated      2016-05-19
// @version      1.3.4
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      myanimelist.net
// ==/UserScript==
/* jshint -W097, browser:true, devel:true */
/* global $:false, jQuery:false, sendHTTPRequest:false, listUpdate:false, listUpdate2:false, GM_addStyle:false, GM_xmlhttpRequest:false, saveAs:false, Zlib:false, Promise:false, addReading:false */
'use strict';

/* jshint ignore:start */
/** https://raw.githubusercontent.com/eligrey/FileSaver.js/62d219a0fac54b94cd4f230e7bfc55aa3f8dcfa4/FileSaver.min.js **/
/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */
var saveAs=saveAs||function(e){"use strict";if("undefined"==typeof navigator||!/MSIE [1-9]\./.test(navigator.userAgent)){var t=e.document,n=function(){return e.URL||e.webkitURL||e},o=t.createElementNS("http://www.w3.org/1999/xhtml","a"),r="download"in o,i=function(e){var t=new MouseEvent("click");e.dispatchEvent(t)},a=/Version\/[\d\.]+.*Safari/.test(navigator.userAgent),c=e.webkitRequestFileSystem,f=e.requestFileSystem||c||e.mozRequestFileSystem,u=function(t){(e.setImmediate||e.setTimeout)(function(){throw t},0)},d="application/octet-stream",s=0,l=4e4,v=function(e){var t=function(){"string"==typeof e?n().revokeObjectURL(e):e.remove()};setTimeout(t,l)},p=function(e,t,n){t=[].concat(t);for(var o=t.length;o--;){var r=e["on"+t[o]];if("function"==typeof r)try{r.call(e,n||e)}catch(i){u(i)}}},w=function(e){return/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)?new Blob(["\ufeff",e],{type:e.type}):e},y=function(t,u,l){l||(t=w(t));var y,m,S,h=this,R=t.type,O=!1,g=function(){p(h,"writestart progress write writeend".split(" "))},b=function(){if(m&&a&&"undefined"!=typeof FileReader){var o=new FileReader;return o.onloadend=function(){var e=o.result;m.location.href="data:attachment/file"+e.slice(e.search(/[,;]/)),h.readyState=h.DONE,g()},o.readAsDataURL(t),void(h.readyState=h.INIT)}if((O||!y)&&(y=n().createObjectURL(t)),m)m.location.href=y;else{var r=e.open(y,"_blank");void 0===r&&a&&(e.location.href=y)}h.readyState=h.DONE,g(),v(y)},E=function(e){return function(){return h.readyState!==h.DONE?e.apply(this,arguments):void 0}},N={create:!0,exclusive:!1};return h.readyState=h.INIT,u||(u="download"),r?(y=n().createObjectURL(t),void setTimeout(function(){o.href=y,o.download=u,i(o),g(),v(y),h.readyState=h.DONE})):(e.chrome&&R&&R!==d&&(S=t.slice||t.webkitSlice,t=S.call(t,0,t.size,d),O=!0),c&&"download"!==u&&(u+=".download"),(R===d||c)&&(m=e),f?(s+=t.size,void f(e.TEMPORARY,s,E(function(e){e.root.getDirectory("saved",N,E(function(e){var n=function(){e.getFile(u,N,E(function(e){e.createWriter(E(function(n){n.onwriteend=function(t){m.location.href=e.toURL(),h.readyState=h.DONE,p(h,"writeend",t),v(e)},n.onerror=function(){var e=n.error;e.code!==e.ABORT_ERR&&b()},"writestart progress write abort".split(" ").forEach(function(e){n["on"+e]=h["on"+e]}),n.write(t),h.abort=function(){n.abort(),h.readyState=h.DONE},h.readyState=h.WRITING}),b)}),b)};e.getFile(u,{create:!1},E(function(e){e.remove(),n()}),E(function(e){e.code===e.NOT_FOUND_ERR?n():b()}))}),b)}),b)):void b())},m=y.prototype,S=function(e,t,n){return new y(e,t,n)};return"undefined"!=typeof navigator&&navigator.msSaveOrOpenBlob?function(e,t,n){return n||(e=w(e)),navigator.msSaveOrOpenBlob(e,t||"download")}:(m.abort=function(){var e=this;e.readyState=e.DONE,p(e,"abort")},m.readyState=m.INIT=0,m.WRITING=1,m.DONE=2,m.error=m.onwritestart=m.onprogress=m.onwrite=m.onabort=m.onerror=m.onwriteend=null,S)}}("undefined"!=typeof self&&self||"undefined"!=typeof window&&window||this.content);"undefined"!=typeof module&&module.exports?module.exports.saveAs=saveAs:"undefined"!=typeof define&&null!==define&&null!==define.amd&&define([],function(){return saveAs});

/** https://raw.githubusercontent.com/imaya/zlib.js/068df2dee15c18d38d9dff433538ef59bbbb55fe/bin/zlib_and_gzip.min.js **/
/** @license zlib.js 2012 - imaya [ https://github.com/imaya/zlib.js ] The MIT License */
(function(){"use strict";function t(t){throw t}function r(t,r){var e=t.split("."),i=x;!(e[0]in i)&&i.execScript&&i.execScript("var "+e[0]);for(var n;e.length&&(n=e.shift());)e.length||r===E?i=i[n]?i[n]:i[n]={}:i[n]=r}function e(r,e){this.index="number"==typeof e?e:0,this.m=0,this.buffer=r instanceof(N?Uint8Array:Array)?r:new(N?Uint8Array:Array)(32768),2*this.buffer.length<=this.index&&t(Error("invalid index")),this.buffer.length<=this.index&&this.f()}function i(t,r,e){var i,n="number"==typeof r?r:r=0,s="number"==typeof e?e:t.length;for(i=-1,n=7&s;n--;++r)i=i>>>8^O[255&(i^t[r])];for(n=s>>3;n--;r+=8)i=i>>>8^O[255&(i^t[r])],i=i>>>8^O[255&(i^t[r+1])],i=i>>>8^O[255&(i^t[r+2])],i=i>>>8^O[255&(i^t[r+3])],i=i>>>8^O[255&(i^t[r+4])],i=i>>>8^O[255&(i^t[r+5])],i=i>>>8^O[255&(i^t[r+6])],i=i>>>8^O[255&(i^t[r+7])];return(4294967295^i)>>>0}function n(){}function s(t){this.buffer=new(N?Uint16Array:Array)(2*t),this.length=0}function a(t){var r,e,i,n,s,a,h,o,f,u,c=t.length,l=0,p=Number.POSITIVE_INFINITY;for(o=0;c>o;++o)t[o]>l&&(l=t[o]),t[o]<p&&(p=t[o]);for(r=1<<l,e=new(N?Uint32Array:Array)(r),i=1,n=0,s=2;l>=i;){for(o=0;c>o;++o)if(t[o]===i){for(a=0,h=n,f=0;i>f;++f)a=a<<1|1&h,h>>=1;for(u=i<<16|o,f=a;r>f;f+=s)e[f]=u;++n}++i,n<<=1,s<<=1}return[e,l,p]}function h(t,r){this.k=M,this.I=0,this.input=N&&t instanceof Array?new Uint8Array(t):t,this.b=0,r&&(r.lazy&&(this.I=r.lazy),"number"==typeof r.compressionType&&(this.k=r.compressionType),r.outputBuffer&&(this.a=N&&r.outputBuffer instanceof Array?new Uint8Array(r.outputBuffer):r.outputBuffer),"number"==typeof r.outputIndex&&(this.b=r.outputIndex)),this.a||(this.a=new(N?Uint8Array:Array)(32768))}function o(t,r){this.length=t,this.Q=r}function f(r,e){function i(r,e){var i,n=r.Q,s=[],a=0;i=F[r.length],s[a++]=65535&i,s[a++]=i>>16&255,s[a++]=i>>24;var h;switch(z){case 1===n:h=[0,n-1,0];break;case 2===n:h=[1,n-2,0];break;case 3===n:h=[2,n-3,0];break;case 4===n:h=[3,n-4,0];break;case 6>=n:h=[4,n-5,1];break;case 8>=n:h=[5,n-7,1];break;case 12>=n:h=[6,n-9,2];break;case 16>=n:h=[7,n-13,2];break;case 24>=n:h=[8,n-17,3];break;case 32>=n:h=[9,n-25,3];break;case 48>=n:h=[10,n-33,4];break;case 64>=n:h=[11,n-49,4];break;case 96>=n:h=[12,n-65,5];break;case 128>=n:h=[13,n-97,5];break;case 192>=n:h=[14,n-129,6];break;case 256>=n:h=[15,n-193,6];break;case 384>=n:h=[16,n-257,7];break;case 512>=n:h=[17,n-385,7];break;case 768>=n:h=[18,n-513,8];break;case 1024>=n:h=[19,n-769,8];break;case 1536>=n:h=[20,n-1025,9];break;case 2048>=n:h=[21,n-1537,9];break;case 3072>=n:h=[22,n-2049,10];break;case 4096>=n:h=[23,n-3073,10];break;case 6144>=n:h=[24,n-4097,11];break;case 8192>=n:h=[25,n-6145,11];break;case 12288>=n:h=[26,n-8193,12];break;case 16384>=n:h=[27,n-12289,12];break;case 24576>=n:h=[28,n-16385,13];break;case 32768>=n:h=[29,n-24577,13];break;default:t("invalid distance")}i=h,s[a++]=i[0],s[a++]=i[1],s[a++]=i[2];var o,f;for(o=0,f=s.length;f>o;++o)b[g++]=s[o];A[s[0]]++,v[s[3]]++,d=r.length+e-1,l=null}var n,s,a,h,o,f,c,l,p,y={},b=N?new Uint16Array(2*e.length):[],g=0,d=0,A=new(N?Uint32Array:Array)(286),v=new(N?Uint32Array:Array)(30),w=r.I;if(!N){for(a=0;285>=a;)A[a++]=0;for(a=0;29>=a;)v[a++]=0}for(A[256]=1,n=0,s=e.length;s>n;++n){for(a=o=0,h=3;h>a&&n+a!==s;++a)o=o<<8|e[n+a];if(y[o]===E&&(y[o]=[]),f=y[o],!(0<d--)){for(;0<f.length&&32768<n-f[0];)f.shift();if(n+3>=s){for(l&&i(l,-1),a=0,h=s-n;h>a;++a)p=e[n+a],b[g++]=p,++A[p];break}0<f.length?(c=u(e,n,f),l?l.length<c.length?(p=e[n-1],b[g++]=p,++A[p],i(c,0)):i(l,-1):c.length<w?l=c:i(c,0)):l?i(l,-1):(p=e[n],b[g++]=p,++A[p])}f.push(n)}return b[g++]=256,A[256]++,r.W=A,r.V=v,N?b.subarray(0,g):b}function u(t,r,e){var i,n,s,a,h,f,u=0,c=t.length;a=0,f=e.length;t:for(;f>a;a++){if(i=e[f-a-1],s=3,u>3){for(h=u;h>3;h--)if(t[i+h-1]!==t[r+h-1])continue t;s=u}for(;258>s&&c>r+s&&t[i+s]===t[r+s];)++s;if(s>u&&(n=i,u=s),258===s)break}return new o(u,r-n)}function c(t,r){var e,i,n,a,h,o=t.length,f=new s(572),u=new(N?Uint8Array:Array)(o);if(!N)for(a=0;o>a;a++)u[a]=0;for(a=0;o>a;++a)0<t[a]&&f.push(a,t[a]);if(e=Array(f.length/2),i=new(N?Uint32Array:Array)(f.length/2),1===e.length)return u[f.pop().index]=1,u;for(a=0,h=f.length/2;h>a;++a)e[a]=f.pop(),i[a]=e[a].value;for(n=l(i,i.length,r),a=0,h=e.length;h>a;++a)u[e[a].index]=n[a];return u}function l(t,r,e){function i(t){var e=p[t][y[t]];e===r?(i(t+1),i(t+1)):--c[e],++y[t]}var n,s,a,h,o,f=new(N?Uint16Array:Array)(e),u=new(N?Uint8Array:Array)(e),c=new(N?Uint8Array:Array)(r),l=Array(e),p=Array(e),y=Array(e),b=(1<<e)-r,g=1<<e-1;for(f[e-1]=r,s=0;e>s;++s)g>b?u[s]=0:(u[s]=1,b-=g),b<<=1,f[e-2-s]=(f[e-1-s]/2|0)+r;for(f[0]=u[0],l[0]=Array(f[0]),p[0]=Array(f[0]),s=1;e>s;++s)f[s]>2*f[s-1]+u[s]&&(f[s]=2*f[s-1]+u[s]),l[s]=Array(f[s]),p[s]=Array(f[s]);for(n=0;r>n;++n)c[n]=e;for(a=0;a<f[e-1];++a)l[e-1][a]=t[a],p[e-1][a]=a;for(n=0;e>n;++n)y[n]=0;for(1===u[e-1]&&(--c[0],++y[e-1]),s=e-2;s>=0;--s){for(h=n=0,o=y[s+1],a=0;a<f[s];a++)h=l[s+1][o]+l[s+1][o+1],h>t[n]?(l[s][a]=h,p[s][a]=r,o+=2):(l[s][a]=t[n],p[s][a]=n,++n);y[s]=0,1===u[s]&&i(s)}return c}function p(t){var r,e,i,n,s=new(N?Uint16Array:Array)(t.length),a=[],h=[],o=0;for(r=0,e=t.length;e>r;r++)a[t[r]]=(0|a[t[r]])+1;for(r=1,e=16;e>=r;r++)h[r]=o,o+=0|a[r],o<<=1;for(r=0,e=t.length;e>r;r++)for(o=h[t[r]],h[t[r]]+=1,i=s[r]=0,n=t[r];n>i;i++)s[r]=s[r]<<1|1&o,o>>>=1;return s}function y(t,r){this.input=t,this.b=this.c=0,this.i={},r&&(r.flags&&(this.i=r.flags),"string"==typeof r.filename&&(this.filename=r.filename),"string"==typeof r.comment&&(this.A=r.comment),r.deflateOptions&&(this.l=r.deflateOptions)),this.l||(this.l={})}function b(r,e){switch(this.p=[],this.q=32768,this.e=this.j=this.c=this.u=0,this.input=N?new Uint8Array(r):r,this.w=!1,this.r=J,this.M=!1,(e||!(e={}))&&(e.index&&(this.c=e.index),e.bufferSize&&(this.q=e.bufferSize),e.bufferType&&(this.r=e.bufferType),e.resize&&(this.M=e.resize)),this.r){case H:this.b=32768,this.a=new(N?Uint8Array:Array)(32768+this.q+258);break;case J:this.b=0,this.a=new(N?Uint8Array:Array)(this.q),this.f=this.U,this.B=this.R,this.s=this.T;break;default:t(Error("invalid inflate mode"))}}function g(r,e){for(var i,n=r.j,s=r.e,a=r.input,h=r.c,o=a.length;e>s;)h>=o&&t(Error("input buffer is broken")),n|=a[h++]<<s,s+=8;return i=n&(1<<e)-1,r.j=n>>>e,r.e=s-e,r.c=h,i}function d(t,r){for(var e,i,n=t.j,s=t.e,a=t.input,h=t.c,o=a.length,f=r[0],u=r[1];u>s&&!(h>=o);)n|=a[h++]<<s,s+=8;return e=f[n&(1<<u)-1],i=e>>>16,t.j=n>>i,t.e=s-i,t.c=h,65535&e}function A(t){function r(t,r,e){var i,n,s,a=this.J;for(s=0;t>s;)switch(i=d(this,r)){case 16:for(n=3+g(this,2);n--;)e[s++]=a;break;case 17:for(n=3+g(this,3);n--;)e[s++]=0;a=0;break;case 18:for(n=11+g(this,7);n--;)e[s++]=0;a=0;break;default:a=e[s++]=i}return this.J=a,e}var e,i,n,s,h=g(t,5)+257,o=g(t,5)+1,f=g(t,4)+4,u=new(N?Uint8Array:Array)($.length);for(s=0;f>s;++s)u[$[s]]=g(t,3);if(!N)for(s=f,f=u.length;f>s;++s)u[$[s]]=0;e=a(u),i=new(N?Uint8Array:Array)(h),n=new(N?Uint8Array:Array)(o),t.J=0,t.s(a(r.call(t,h,e,i)),a(r.call(t,o,e,n)))}function v(t){this.input=t,this.c=0,this.t=[],this.D=!1}function w(t){if("string"==typeof t){var r,e,i=t.split("");for(r=0,e=i.length;e>r;r++)i[r]=(255&i[r].charCodeAt(0))>>>0;t=i}for(var n,s=1,a=0,h=t.length,o=0;h>0;){n=h>1024?1024:h,h-=n;do s+=t[o++],a+=s;while(--n);s%=65521,a%=65521}return(a<<16|s)>>>0}function k(r,e){var i,n;switch(this.input=r,this.c=0,(e||!(e={}))&&(e.index&&(this.c=e.index),e.verify&&(this.$=e.verify)),i=r[this.c++],n=r[this.c++],15&i){case pt:this.method=pt;break;default:t(Error("unsupported compression method"))}0!==((i<<8)+n)%31&&t(Error("invalid fcheck flag:"+((i<<8)+n)%31)),32&n&&t(Error("fdict flag is not supported")),this.L=new b(r,{index:this.c,bufferSize:e.bufferSize,bufferType:e.bufferType,resize:e.resize})}function m(t,r){this.input=t,this.a=new(N?Uint8Array:Array)(32768),this.k=yt.o;var e,i={};!r&&(r={})||"number"!=typeof r.compressionType||(this.k=r.compressionType);for(e in r)i[e]=r[e];i.outputBuffer=this.a,this.K=new h(this.input,i)}function U(t,e){var i,n,s,a;if(Object.keys)i=Object.keys(e);else for(n in i=[],s=0,e)i[s++]=n;for(s=0,a=i.length;a>s;++s)n=i[s],r(t+"."+n,e[n])}var E=void 0,z=!0,x=this,N="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Uint32Array&&"undefined"!=typeof DataView;e.prototype.f=function(){var t,r=this.buffer,e=r.length,i=new(N?Uint8Array:Array)(e<<1);if(N)i.set(r);else for(t=0;e>t;++t)i[t]=r[t];return this.buffer=i},e.prototype.d=function(t,r,e){var i,n=this.buffer,s=this.index,a=this.m,h=n[s];if(e&&r>1&&(t=r>8?(S[255&t]<<24|S[t>>>8&255]<<16|S[t>>>16&255]<<8|S[t>>>24&255])>>32-r:S[t]>>8-r),8>r+a)h=h<<r|t,a+=r;else for(i=0;r>i;++i)h=h<<1|t>>r-i-1&1,8===++a&&(a=0,n[s++]=S[h],h=0,s===n.length&&(n=this.f()));n[s]=h,this.buffer=n,this.m=a,this.index=s},e.prototype.finish=function(){var t,r=this.buffer,e=this.index;return 0<this.m&&(r[e]<<=8-this.m,r[e]=S[r[e]],e++),N?t=r.subarray(0,e):(r.length=e,t=r),t};var D,Z=new(N?Uint8Array:Array)(256);for(D=0;256>D;++D){for(var I=D,T=I,C=7,I=I>>>1;I;I>>>=1)T<<=1,T|=1&I,--C;Z[D]=(T<<C&255)>>>0}var S=Z,G=[0,1996959894,3993919788,2567524794,124634137,1886057615,3915621685,2657392035,249268274,2044508324,3772115230,2547177864,162941995,2125561021,3887607047,2428444049,498536548,1789927666,4089016648,2227061214,450548861,1843258603,4107580753,2211677639,325883990,1684777152,4251122042,2321926636,335633487,1661365465,4195302755,2366115317,997073096,1281953886,3579855332,2724688242,1006888145,1258607687,3524101629,2768942443,901097722,1119000684,3686517206,2898065728,853044451,1172266101,3705015759,2882616665,651767980,1373503546,3369554304,3218104598,565507253,1454621731,3485111705,3099436303,671266974,1594198024,3322730930,2970347812,795835527,1483230225,3244367275,3060149565,1994146192,31158534,2563907772,4023717930,1907459465,112637215,2680153253,3904427059,2013776290,251722036,2517215374,3775830040,2137656763,141376813,2439277719,3865271297,1802195444,476864866,2238001368,4066508878,1812370925,453092731,2181625025,4111451223,1706088902,314042704,2344532202,4240017532,1658658271,366619977,2362670323,4224994405,1303535960,984961486,2747007092,3569037538,1256170817,1037604311,2765210733,3554079995,1131014506,879679996,2909243462,3663771856,1141124467,855842277,2852801631,3708648649,1342533948,654459306,3188396048,3373015174,1466479909,544179635,3110523913,3462522015,1591671054,702138776,2966460450,3352799412,1504918807,783551873,3082640443,3233442989,3988292384,2596254646,62317068,1957810842,3939845945,2647816111,81470997,1943803523,3814918930,2489596804,225274430,2053790376,3826175755,2466906013,167816743,2097651377,4027552580,2265490386,503444072,1762050814,4150417245,2154129355,426522225,1852507879,4275313526,2312317920,282753626,1742555852,4189708143,2394877945,397917763,1622183637,3604390888,2714866558,953729732,1340076626,3518719985,2797360999,1068828381,1219638859,3624741850,2936675148,906185462,1090812512,3747672003,2825379669,829329135,1181335161,3412177804,3160834842,628085408,1382605366,3423369109,3138078467,570562233,1426400815,3317316542,2998733608,733239954,1555261956,3268935591,3050360625,752459403,1541320221,2607071920,3965973030,1969922972,40735498,2617837225,3943577151,1913087877,83908371,2512341634,3803740692,2075208622,213261112,2463272603,3855990285,2094854071,198958881,2262029012,4057260610,1759359992,534414190,2176718541,4139329115,1873836001,414664567,2282248934,4279200368,1711684554,285281116,2405801727,4167216745,1634467795,376229701,2685067896,3608007406,1308918612,956543938,2808555105,3495958263,1231636301,1047427035,2932959818,3654703836,1088359270,936918e3,2847714899,3736837829,1202900863,817233897,3183342108,3401237130,1404277552,615818150,3134207493,3453421203,1423857449,601450431,3009837614,3294710456,1567103746,711928724,3020668471,3272380065,1510334235,755167117],O=N?new Uint32Array(G):G;n.prototype.getName=function(){return this.name},n.prototype.getData=function(){return this.data},n.prototype.Y=function(){return this.Z},r("Zlib.GunzipMember",n),r("Zlib.GunzipMember.prototype.getName",n.prototype.getName),r("Zlib.GunzipMember.prototype.getData",n.prototype.getData),r("Zlib.GunzipMember.prototype.getMtime",n.prototype.Y),s.prototype.getParent=function(t){return 2*((t-2)/4|0)},s.prototype.push=function(t,r){var e,i,n,s=this.buffer;for(e=this.length,s[this.length++]=r,s[this.length++]=t;e>0&&(i=this.getParent(e),s[e]>s[i]);)n=s[e],s[e]=s[i],s[i]=n,n=s[e+1],s[e+1]=s[i+1],s[i+1]=n,e=i;return this.length},s.prototype.pop=function(){var t,r,e,i,n,s=this.buffer;for(r=s[0],t=s[1],this.length-=2,s[0]=s[this.length],s[1]=s[this.length+1],n=0;(i=2*n+2,!(i>=this.length))&&(i+2<this.length&&s[i+2]>s[i]&&(i+=2),s[i]>s[n]);)e=s[n],s[n]=s[i],s[i]=e,e=s[n+1],s[n+1]=s[i+1],s[i+1]=e,n=i;return{index:t,value:r,length:this.length}};var B,M=2,j={NONE:0,v:1,o:M,ba:3},L=[];for(B=0;288>B;B++)switch(z){case 143>=B:L.push([B+48,8]);break;case 255>=B:L.push([B-144+400,9]);break;case 279>=B:L.push([B-256+0,7]);break;case 287>=B:L.push([B-280+192,8]);break;default:t("invalid literal: "+B)}h.prototype.g=function(){var r,i,n,s,a=this.input;switch(this.k){case 0:for(n=0,s=a.length;s>n;){i=N?a.subarray(n,n+65535):a.slice(n,n+65535),n+=i.length;var h=i,o=n===s,u=E,l=E,y=E,b=E,g=E,d=this.a,A=this.b;if(N){for(d=new Uint8Array(this.a.buffer);d.length<=A+h.length+5;)d=new Uint8Array(d.length<<1);d.set(this.a)}if(u=o?1:0,d[A++]=0|u,l=h.length,y=~l+65536&65535,d[A++]=255&l,d[A++]=l>>>8&255,d[A++]=255&y,d[A++]=y>>>8&255,N)d.set(h,A),A+=h.length,d=d.subarray(0,A);else{for(b=0,g=h.length;g>b;++b)d[A++]=h[b];d.length=A}this.b=A,this.a=d}break;case 1:var v=new e(N?new Uint8Array(this.a.buffer):this.a,this.b);v.d(1,1,z),v.d(1,2,z);var w,k,m,U=f(this,a);for(w=0,k=U.length;k>w;w++)if(m=U[w],e.prototype.d.apply(v,L[m]),m>256)v.d(U[++w],U[++w],z),v.d(U[++w],5),v.d(U[++w],U[++w],z);else if(256===m)break;this.a=v.finish(),this.b=this.a.length;break;case M:var x,D,Z,I,T,C,S,G,O,B,j,P,F,V,Y,q=new e(N?new Uint8Array(this.a.buffer):this.a,this.b),K=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],H=Array(19);for(x=M,q.d(1,1,z),q.d(x,2,z),D=f(this,a),C=c(this.W,15),S=p(C),G=c(this.V,7),O=p(G),Z=286;Z>257&&0===C[Z-1];Z--);for(I=30;I>1&&0===G[I-1];I--);var J,R,X,Q,W,$,_=Z,tt=I,rt=new(N?Uint32Array:Array)(_+tt),et=new(N?Uint32Array:Array)(316),it=new(N?Uint8Array:Array)(19);for(J=R=0;_>J;J++)rt[R++]=C[J];for(J=0;tt>J;J++)rt[R++]=G[J];if(!N)for(J=0,Q=it.length;Q>J;++J)it[J]=0;for(J=W=0,Q=rt.length;Q>J;J+=R){for(R=1;Q>J+R&&rt[J+R]===rt[J];++R);if(X=R,0===rt[J])if(3>X)for(;0<X--;)et[W++]=0,it[0]++;else for(;X>0;)$=138>X?X:138,$>X-3&&X>$&&($=X-3),10>=$?(et[W++]=17,et[W++]=$-3,it[17]++):(et[W++]=18,et[W++]=$-11,it[18]++),X-=$;else if(et[W++]=rt[J],it[rt[J]]++,X--,3>X)for(;0<X--;)et[W++]=rt[J],it[rt[J]]++;else for(;X>0;)$=6>X?X:6,$>X-3&&X>$&&($=X-3),et[W++]=16,et[W++]=$-3,it[16]++,X-=$}for(r=N?et.subarray(0,W):et.slice(0,W),B=c(it,7),V=0;19>V;V++)H[V]=B[K[V]];for(T=19;T>4&&0===H[T-1];T--);for(j=p(B),q.d(Z-257,5,z),q.d(I-1,5,z),q.d(T-4,4,z),V=0;T>V;V++)q.d(H[V],3,z);for(V=0,Y=r.length;Y>V;V++)if(P=r[V],q.d(j[P],B[P],z),P>=16){switch(V++,P){case 16:F=2;break;case 17:F=3;break;case 18:F=7;break;default:t("invalid code: "+P)}q.d(r[V],F,z)}var nt,st,at,ht,ot,ft,ut,ct,lt=[S,C],pt=[O,G];for(ot=lt[0],ft=lt[1],ut=pt[0],ct=pt[1],nt=0,st=D.length;st>nt;++nt)if(at=D[nt],q.d(ot[at],ft[at],z),at>256)q.d(D[++nt],D[++nt],z),ht=D[++nt],q.d(ut[ht],ct[ht],z),q.d(D[++nt],D[++nt],z);else if(256===at)break;this.a=q.finish(),this.b=this.a.length;break;default:t("invalid compression type")}return this.a};var P=function(){function r(r){switch(z){case 3===r:return[257,r-3,0];case 4===r:return[258,r-4,0];case 5===r:return[259,r-5,0];case 6===r:return[260,r-6,0];case 7===r:return[261,r-7,0];case 8===r:return[262,r-8,0];case 9===r:return[263,r-9,0];case 10===r:return[264,r-10,0];case 12>=r:return[265,r-11,1];case 14>=r:return[266,r-13,1];case 16>=r:return[267,r-15,1];case 18>=r:return[268,r-17,1];case 22>=r:return[269,r-19,2];case 26>=r:return[270,r-23,2];case 30>=r:return[271,r-27,2];case 34>=r:return[272,r-31,2];case 42>=r:return[273,r-35,3];case 50>=r:return[274,r-43,3];case 58>=r:return[275,r-51,3];case 66>=r:return[276,r-59,3];case 82>=r:return[277,r-67,4];case 98>=r:return[278,r-83,4];case 114>=r:return[279,r-99,4];case 130>=r:return[280,r-115,4];case 162>=r:return[281,r-131,5];case 194>=r:return[282,r-163,5];case 226>=r:return[283,r-195,5];case 257>=r:return[284,r-227,5];case 258===r:return[285,r-258,0];default:t("invalid length: "+r)}}var e,i,n=[];for(e=3;258>=e;e++)i=r(e),n[e]=i[2]<<24|i[1]<<16|i[0];return n}(),F=N?new Uint32Array(P):P;y.prototype.g=function(){var t,r,e,n,s,a,o,f,u=new(N?Uint8Array:Array)(32768),c=0,l=this.input,p=this.c,y=this.filename,b=this.A;if(u[c++]=31,u[c++]=139,u[c++]=8,t=0,this.i.fname&&(t|=q),this.i.fcomment&&(t|=K),this.i.fhcrc&&(t|=Y),u[c++]=t,r=(Date.now?Date.now():+new Date)/1e3|0,u[c++]=255&r,u[c++]=r>>>8&255,u[c++]=r>>>16&255,u[c++]=r>>>24&255,u[c++]=0,u[c++]=V,this.i.fname!==E){for(o=0,f=y.length;f>o;++o)a=y.charCodeAt(o),a>255&&(u[c++]=a>>>8&255),u[c++]=255&a;u[c++]=0}if(this.i.comment){for(o=0,f=b.length;f>o;++o)a=b.charCodeAt(o),a>255&&(u[c++]=a>>>8&255),u[c++]=255&a;u[c++]=0}return this.i.fhcrc&&(e=65535&i(u,0,c),u[c++]=255&e,u[c++]=e>>>8&255),this.l.outputBuffer=u,this.l.outputIndex=c,s=new h(l,this.l),u=s.g(),c=s.b,N&&(c+8>u.buffer.byteLength?(this.a=new Uint8Array(c+8),this.a.set(new Uint8Array(u.buffer)),u=this.a):u=new Uint8Array(u.buffer)),n=i(l,E,E),u[c++]=255&n,u[c++]=n>>>8&255,u[c++]=n>>>16&255,u[c++]=n>>>24&255,f=l.length,u[c++]=255&f,u[c++]=f>>>8&255,u[c++]=f>>>16&255,u[c++]=f>>>24&255,this.c=p,N&&c<u.length&&(this.a=u=u.subarray(0,c)),u};var V=255,Y=2,q=8,K=16;r("Zlib.Gzip",y),r("Zlib.Gzip.prototype.compress",y.prototype.g);var H=0,J=1,R={O:H,N:J};b.prototype.h=function(){for(;!this.w;){var r=g(this,3);switch(1&r&&(this.w=z),r>>>=1){case 0:var e=this.input,i=this.c,n=this.a,s=this.b,a=e.length,h=E,o=E,f=n.length,u=E;switch(this.e=this.j=0,i+1>=a&&t(Error("invalid uncompressed block header: LEN")),h=e[i++]|e[i++]<<8,i+1>=a&&t(Error("invalid uncompressed block header: NLEN")),o=e[i++]|e[i++]<<8,h===~o&&t(Error("invalid uncompressed block header: length verify")),i+h>e.length&&t(Error("input buffer is broken")),this.r){case H:for(;s+h>n.length;){if(u=f-s,h-=u,N)n.set(e.subarray(i,i+u),s),s+=u,i+=u;else for(;u--;)n[s++]=e[i++];this.b=s,n=this.f(),s=this.b}break;case J:for(;s+h>n.length;)n=this.f({F:2});break;default:t(Error("invalid inflate mode"))}if(N)n.set(e.subarray(i,i+h),s),s+=h,i+=h;else for(;h--;)n[s++]=e[i++];this.c=i,this.b=s,this.a=n;break;case 1:this.s(ut,lt);break;case 2:A(this);break;default:t(Error("unknown BTYPE: "+r))}}return this.B()};var X,Q,W=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],$=N?new Uint16Array(W):W,_=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,258,258],tt=N?new Uint16Array(_):_,rt=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0],et=N?new Uint8Array(rt):rt,it=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],nt=N?new Uint16Array(it):it,st=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],at=N?new Uint8Array(st):st,ht=new(N?Uint8Array:Array)(288);for(X=0,Q=ht.length;Q>X;++X)ht[X]=143>=X?8:255>=X?9:279>=X?7:8;var ot,ft,ut=a(ht),ct=new(N?Uint8Array:Array)(30);for(ot=0,ft=ct.length;ft>ot;++ot)ct[ot]=5;var lt=a(ct);b.prototype.s=function(t,r){var e=this.a,i=this.b;this.C=t;for(var n,s,a,h,o=e.length-258;256!==(n=d(this,t));)if(256>n)i>=o&&(this.b=i,e=this.f(),i=this.b),e[i++]=n;else for(s=n-257,h=tt[s],0<et[s]&&(h+=g(this,et[s])),n=d(this,r),a=nt[n],0<at[n]&&(a+=g(this,at[n])),i>=o&&(this.b=i,e=this.f(),i=this.b);h--;)e[i]=e[i++-a];for(;8<=this.e;)this.e-=8,this.c--;this.b=i},b.prototype.T=function(t,r){var e=this.a,i=this.b;this.C=t;for(var n,s,a,h,o=e.length;256!==(n=d(this,t));)if(256>n)i>=o&&(e=this.f(),o=e.length),e[i++]=n;else for(s=n-257,h=tt[s],0<et[s]&&(h+=g(this,et[s])),n=d(this,r),a=nt[n],0<at[n]&&(a+=g(this,at[n])),i+h>o&&(e=this.f(),o=e.length);h--;)e[i]=e[i++-a];for(;8<=this.e;)this.e-=8,this.c--;this.b=i},b.prototype.f=function(){var t,r,e=new(N?Uint8Array:Array)(this.b-32768),i=this.b-32768,n=this.a;if(N)e.set(n.subarray(32768,e.length));else for(t=0,r=e.length;r>t;++t)e[t]=n[t+32768];if(this.p.push(e),this.u+=e.length,N)n.set(n.subarray(i,i+32768));else for(t=0;32768>t;++t)n[t]=n[i+t];return this.b=32768,n},b.prototype.U=function(t){var r,e,i,n,s=this.input.length/this.c+1|0,a=this.input,h=this.a;return t&&("number"==typeof t.F&&(s=t.F),"number"==typeof t.P&&(s+=t.P)),2>s?(e=(a.length-this.c)/this.C[2],n=258*(e/2)|0,i=n<h.length?h.length+n:h.length<<1):i=h.length*s,N?(r=new Uint8Array(i),r.set(h)):r=h,this.a=r},b.prototype.B=function(){var t,r,e,i,n,s=0,a=this.a,h=this.p,o=new(N?Uint8Array:Array)(this.u+(this.b-32768));if(0===h.length)return N?this.a.subarray(32768,this.b):this.a.slice(32768,this.b);for(r=0,e=h.length;e>r;++r)for(t=h[r],i=0,n=t.length;n>i;++i)o[s++]=t[i];for(r=32768,e=this.b;e>r;++r)o[s++]=a[r];return this.p=[],this.buffer=o},b.prototype.R=function(){var t,r=this.b;return N?this.M?(t=new Uint8Array(r),t.set(this.a.subarray(0,r))):t=this.a.subarray(0,r):(this.a.length>r&&(this.a.length=r),t=this.a),this.buffer=t},v.prototype.X=function(){return this.D||this.h(),this.t.slice()},v.prototype.h=function(){for(var r=this.input.length;this.c<r;){var e=new n,s=E,a=E,h=E,o=E,f=E,u=E,c=E,l=E,p=E,y=this.input,g=this.c;switch(e.G=y[g++],e.H=y[g++],(31!==e.G||139!==e.H)&&t(Error("invalid file signature:"+e.G+","+e.H)),e.z=y[g++],e.z){case 8:break;default:t(Error("unknown compression method: "+e.z))}if(e.n=y[g++],l=y[g++]|y[g++]<<8|y[g++]<<16|y[g++]<<24,e.Z=new Date(1e3*l),e.fa=y[g++],e.ea=y[g++],0<(4&e.n)&&(e.aa=y[g++]|y[g++]<<8,g+=e.aa),0<(e.n&q)){for(c=[],u=0;0<(f=y[g++]);)c[u++]=String.fromCharCode(f);e.name=c.join("")}if(0<(e.n&K)){for(c=[],u=0;0<(f=y[g++]);)c[u++]=String.fromCharCode(f);e.A=c.join("")}0<(e.n&Y)&&(e.S=65535&i(y,0,g),e.S!==(y[g++]|y[g++]<<8)&&t(Error("invalid header crc16"))),s=y[y.length-4]|y[y.length-3]<<8|y[y.length-2]<<16|y[y.length-1]<<24,y.length-g-4-4<512*s&&(o=s),a=new b(y,{index:g,bufferSize:o}),e.data=h=a.h(),g=a.c,e.ca=p=(y[g++]|y[g++]<<8|y[g++]<<16|y[g++]<<24)>>>0,i(h,E,E)!==p&&t(Error("invalid CRC-32 checksum: 0x"+i(h,E,E).toString(16)+" / 0x"+p.toString(16))),e.da=s=(y[g++]|y[g++]<<8|y[g++]<<16|y[g++]<<24)>>>0,(4294967295&h.length)!==s&&t(Error("invalid input size: "+(4294967295&h.length)+" / "+s)),this.t.push(e),this.c=g}this.D=z;var d,A,v,w=this.t,k=0,m=0;for(d=0,A=w.length;A>d;++d)m+=w[d].data.length;if(N)for(v=new Uint8Array(m),d=0;A>d;++d)v.set(w[d].data,k),k+=w[d].data.length;else{for(v=[],d=0;A>d;++d)v[d]=w[d].data;v=Array.prototype.concat.apply([],v)}return v},r("Zlib.Gunzip",v),r("Zlib.Gunzip.prototype.decompress",v.prototype.h),r("Zlib.Gunzip.prototype.getMembers",v.prototype.X),k.prototype.h=function(){var r,e,i=this.input;return r=this.L.h(),this.c=this.L.c,this.$&&(e=(i[this.c++]<<24|i[this.c++]<<16|i[this.c++]<<8|i[this.c++])>>>0,e!==w(r)&&t(Error("invalid adler-32 checksum"))),r};var pt=8,yt=j;m.prototype.g=function(){var r,e,i,n,s,a,h,o=0;switch(h=this.a,r=pt){case pt:e=Math.LOG2E*Math.log(32768)-8;break;default:t(Error("invalid compression method"))}switch(i=e<<4|r,h[o++]=i,r){case pt:switch(this.k){case yt.NONE:s=0;break;case yt.v:s=1;break;case yt.o:s=2;break;default:t(Error("unsupported compression type"))}break;default:t(Error("invalid compression method"))}return n=s<<6|0,h[o++]=n|31-(256*i+n)%31,a=w(this.input),this.K.b=o,h=this.K.g(),o=h.length,N&&(h=new Uint8Array(h.buffer),h.length<=o+4&&(this.a=new Uint8Array(h.length+4),this.a.set(h),h=this.a),h=h.subarray(0,o+4)),h[o++]=a>>24&255,h[o++]=a>>16&255,h[o++]=a>>8&255,h[o++]=255&a,h},r("Zlib.Inflate",k),r("Zlib.Inflate.prototype.decompress",k.prototype.h),U("Zlib.Inflate.BufferType",{ADAPTIVE:R.N,BLOCK:R.O}),r("Zlib.Deflate",m),r("Zlib.Deflate.compress",function(t,r){return new m(t,r).g()}),r("Zlib.Deflate.prototype.compress",m.prototype.g),U("Zlib.Deflate.CompressionType",{NONE:yt.NONE,FIXED:yt.v,DYNAMIC:yt.o})}).call(this);
/* jshint ignore:end */

//Beware! Messy code ahead!
$(document).ready(function() {
	if(/mangaupdates\.com\/mylist.html(\?.*)?/.test(location.href)) {
		setupList();
		setupImport();
		setupExport();

	}
	else if(/mangaupdates\.com\/series.html\?id=.*/.test(location.href)) {
		setupSeries();
	}
	else if(/mangaupdates\.com\/releases.html\?.*/.test(location.href)) {
		var title = $('a[title="Series Info"]:eq(0)').text().trim();

		var googleBase64   = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABzklEQVR42oWSz0sUYRjH5xLkeur/CFkiUbYuJVjZTcEmwQ4FReQlQS/dgooOBkaKS+3FymqSCtGKsEL0IlhqrLrpKQLR2R+ssK7O7M776X13fdccRvYDX+bwvs/neZ93XsOPEOKE53lRmTUZdy+rMkNA2DgMICQ3xaiCkssmNUHF0wDCcciPviRzs5Nky2nscxEy1zvYfjOs1rRk6oBEd/bsDTLXTOym+sBke7vQqJEqM+vO6avtpY3JC6fIPRvA/TWPG18kFxskfaWV4t8/+AgbaiaAwvxjUq0N2M2NsmghaPig+xhUgjWA4mw9zliI/ItbVKciSCiBC1D4Vkth8ggi9ZH/OXsvhz93rB0tcPYFX0NlQXKiqqBn5KBgFWBr5jjpyWN8WOzjMO6+2y0J+iZ2tWBFCYYAfiw/5Lx1kUarnZ/2En4S6x7ND8onmE4UteCJAYQBnKLLpU+3Ofm6jYhl0r8wzNxmXMqWeRq3aHke5cz9LDdieYRAIb+izlDoX7m5ncIsSwJjvn/ERlbo7gOGRj1L9TwBHM/l1e9xOr/0Enlrlk5z+XM3saVR8oXK7N+Bo6rWL4lSBdVZFwcChNULk0nIOHtZURdWmtnHP3FG/Sbe5gXBAAAAAElFTkSuQmCC";
		var batotoBase64   = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAABVlBMVEUAAAAGNpoIOJsJOZsMO5wNPJ0OPJ0QPp4RP54UQ6AVQ6AWRKEXRaEYRqEZRqIaR6IbSKMcSaMdSqMfS6QhTaUiTaUjTqYkT6YlUKYmUKcnUacoUqcpU6grVaksVqktV6ouV6oxWqsyWqs1Xa02Xq05YK46Ya47Ya88Yq89Y68+ZLA/ZLBAZbFBZrFCZ7FDZ7JEaLJFabJGarNGa7NHa7RIbLRJbbRKbrVLbrVNcLZPcbZRc7dSdLhXeLlaertbe7tgf71igb5jgr5nhcBohcBqh8FriMFuisJvi8N1j8V3kcd8lciCmsuDm8uGns2OpNCSp9KXqtSbrtadsNenuNqqutuuvdy3xOC5x+K6yOC7yOK9y+PBzuTCzubL1enN1+jP2OrS2+zT3O3V3e3a4e7b4u7b4vDg5vLk6fPl6vTm6vTs8Pft8Pfy9fr09vr2+Pv6+/3///8UIKZHAAAAAXRSTlMAQObYZgAAAMFJREFUGBkFwdFSgzAQQNGbZQmBgmW0D774/z/m6DiO1UILJLCJ5zjo+74PLk3rvO0ZpR3GS6dahknIpSihe307K/y9k1M2RU/nF4Ax7vflMKFqBAAu3dhWCIW0wXqlegreIZjZD+DB+9AgFCs10FOiP3mEYtmxB2CoGo9AzoI+Cm4IogjFsuDS1w7PgJLNmmx+FFjMUPY9lcPXwO1jilRUjq24hvj5PV/npBxLLflxtW2bf6eEcsiUUxtcXNZ7jPwDJ6hj193JopcAAAAASUVORK5CYII=";
		var mangafoxBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAY1BMVEVKSkp7e3uEiimNkyWQlT2VmyGdpBydpRyutxOvtFi1t5y2t6K2wA62wQ7CxJXDyxjExbXEx5TGyZLH0gXMzbXP2wDP3ADQ0MnQ3ADR0czS0tLS3Qjg5Jvm64r3+d39/fX///+CcBPEAAAAe0lEQVQYGQXBwUoDQRAFwHo9g0QJehT8/4/zkkAUjWx2tq0SACDxcuqAvxOu02mMo6Wd29gUeVykxfVYFP2z7k3f1zcK7PCwUAQIQtkBjaasLwBQXrNBBgNT3vfPRS2eMDE/bjfJqmdMqLfzFg0KukUTTL9rsB0AAgDkHxyqL9natqplAAAAAElFTkSuQmCC";

		//Add Header
		$('table table table table table table tr:has(td.pad):has(td.text)').parent().find('tr:eq(0)').append(
			$('<td/>', {class: 'releasestitle', style: 'text-align: center; width: 40px'}).append(
				$('<b/>', {text: 'Links'})
			)
		);

		//Add Links
		$('table table table table table table tr:has(td.pad):has(td.text)').each(function() {
			var chapterN = $(this).find('td:nth-child(4)').text().trim();
			var groupName = $(this).find('td:nth-child(5)').text().trim();

			var searchString = 'manga '+encodeURIComponent('"'+title+'"') + ' ' + 'ch '+chapterN + ' ' + encodeURIComponent('"'+groupName+'"');

			$(this).append(
				$('<td/>', {style: 'text-align: right'}).append(
					$('<a/>', {href: 'https://www.google.com/search?q='+searchString, target: '_blank'}).append(
						$('<img/>', {src: googleBase64, style: 'width: 16px; height: 16px'})
					).append(
						$('<a/>', {href: 'http://bato.to/search?name='+encodeURIComponent(title)+'&name_cond=c', target: '_blank'}).append(
							$('<img/>', {src: batotoBase64, style: 'width: 16px; height: 16px'})
						)
					).append(
						$('<a/>', {href: 'http://mangafox.me/search.php?name_method=cw&name='+encodeURIComponent(title)+'&type=&author_method=cw&author=&artist_method=cw&artist=&genres%5BAction%5D=0&genres%5BAdult%5D=0&genres%5BAdventure%5D=0&genres%5BComedy%5D=0&genres%5BDoujinshi%5D=0&genres%5BDrama%5D=0&genres%5BEcchi%5D=0&genres%5BFantasy%5D=0&genres%5BGender+Bender%5D=0&genres%5BHarem%5D=0&genres%5BHistorical%5D=0&genres%5BHorror%5D=0&genres%5BJosei%5D=0&genres%5BMartial+Arts%5D=0&genres%5BMature%5D=0&genres%5BMecha%5D=0&genres%5BMystery%5D=0&genres%5BOne+Shot%5D=0&genres%5BPsychological%5D=0&genres%5BRomance%5D=0&genres%5BSchool+Life%5D=0&genres%5BSci-fi%5D=0&genres%5BSeinen%5D=0&genres%5BShoujo%5D=0&genres%5BShoujo+Ai%5D=0&genres%5BShounen%5D=0&genres%5BShounen+Ai%5D=0&genres%5BSlice+of+Life%5D=0&genres%5BSmut%5D=0&genres%5BSports%5D=0&genres%5BSupernatural%5D=0&genres%5BTragedy%5D=0&genres%5BWebtoons%5D=0&genres%5BYaoi%5D=0&genres%5BYuri%5D=0&released_method=eq&released=&rating_method=eq&rating=&is_completed=&advopts=1', target: '_blank'}).append(
							$('<img/>', {src: mangafoxBase64, style: 'width: 16px; height: 16px'})
						)
					)
				)
			);
		});


	}

	function checkComplete(id, latestChapter, ele) {
		var unsafeWindow = window;

		var manga;
		if(unsafeWindow.localStorage.getItem(id)) {
			var local_manga = JSON.parse(unsafeWindow.localStorage.getItem(id));
			if(latestChapter !== local_manga.latestChapter) {
				//chapter is different, get new data
				unsafeWindow.localStorage.removeItem(id);
			} else {
				//chapter is same, do nothing
				manga = local_manga;
			}
		}

		if(!manga) {
			$.ajax({
				url: 'https://www.mangaupdates.com/series.html?id='+id,
				//async: false,
				type: 'GET',
				success: function(data) {
					var complete = $(data).find('.sMember div:contains("Completely Scanlated?") + .sContent').text().trim() == 'Yes' ? 1 : 0;
					var title    = $(data).find('.releasestitle').text().trim();

					manga = {'title': title, 'complete': complete, 'latestChapter': latestChapter};
					unsafeWindow.localStorage.setItem(id, JSON.stringify(manga));

					markComplete(ele, manga.complete);
				}
			});
		} else {
			markComplete(ele, manga.complete);
		}
	}

	function markComplete(ele, complete) {
		if(complete === 1) {
			$(ele).find('td:nth-child(2)')
				.css('font-weight', 'bold')
				.attr('title', 'Series is complete & scanlated');
		}
	}

	function getInt(str) {
		return str.replace(/[^0-9]+/g, '');
	}

	function setupList() {
		//Use CSS to set row colors since we'll be moving them about.
		GM_addStyle("#list_table > tbody > tr:nth-child(odd):not(:nth-child(0)):not(:nth-child(1)) { background-color: #E4E7EB; }");
		$('.lrow.alt').removeClass('alt');

		//Temp remove rating / Average
		$('#list_table > tbody > tr > td:nth-of-type(5), #list_table > tbody > tr > th:nth-of-type(5)').remove();
		$('#list_table > tbody > tr > td:nth-of-type(4), #list_table > tbody > tr > th:nth-of-type(4)').remove();

		//Create "latest release" column header.
		$('#list_table > tbody > tr:eq(1) ').append(
			$('<th/>', {class: 'text', text: 'Latest Release', style: 'text-align: center'})
		);

		var firstRow = $('#list_table > tbody > tr:nth-child(3)');
		$('.lrow').each(function() {
			var id = $(this).find('a:eq(0)').removeAttr('title').attr('href').replace(/^.*id=([0-9]+)$/, '$1');

			var colStatus = $(this).find('> td:nth-of-type(3)');
			var colLatest = $(this).find('> td:nth-of-type(4)');

			var currentChapterE = colStatus;
			var currentChapterN = currentChapterE.text().replace(/[^0-9]+/, '');
			var latestChapterE  = $(this).find('.newlist a').text(function() { return $(this).text().replace(/[^0-9a-zA-Z]*/g, ''); });  //FIXME: This probably doesn't work with .5 chapters
			var latestChapterN  = latestChapterE.text().replace(/[^0-9]+/, '') || currentChapterE.text();

			//If series is complete, make title bold.
			checkComplete(id, latestChapterN, this); //FIXME: The entire way this method works feels extremely bad. Remake.

			//Remove "Your Status" styling & set new styling.
			$(colStatus).removeClass().removeAttr('id').css('text-align', 'center');

			//Re-create your status column.
			$(colStatus).html(function() {
				var currentChapter = $(this).find('a:eq(2)').text().replace(/[^0-9]*/, ''); //FIXME: This probably doesn't work with .5 chapters
				return 'c'+currentChapter;
			});

			//Add click event for manual editing status
			$(colStatus).click(function(e) {
				if($(this).find('input').length === 0) {
					var chapterN = getInt($(this).text());

					var col = $(this);

					$(col).html('').append(
						$('<input/>', {type: 'text', id: 'ch_update', value: chapterN, style: 'text-align: center; width: 30px;'}).keypress(function(e) {
							var key = e.which;
							if(key == 13) { //enter
								sendHTTPRequest(function(){}, "ajax/chap_update.php?s="+id+"&set_c="+$(this).val());
								$(col).html('c'+$(this).val());

								return false;
							}
						})
					);
					$(col).find('input').focus();
					$(col).find('input')[0].setSelectionRange(99, 99); //Make sure focus is at end of string
				}
			});

			//Append latest chapter.
			$(this).append(
				$('<td/>', {class: 'text', style: 'text-align: center'}).append(
					(latestChapterE.length > 0 ? latestChapterE.css('font-weight', 'bold') : currentChapterE.text())
				)
			);

			//If latest chapter is different, append a link to update status to latest.
			if(latestChapterE.length > 0) {
				$(this).append(
					$('<td/>').append(
						$('<a/>', {
							href: '#',
							text: '@',
							title: 'I\'ve read the latest chapter!'
						}).click(function() {
							var parentRow = $(this).parent().parent();

							//Update chapter.
							sendHTTPRequest(function(){}, "ajax/chap_update.php?s="+id+"&set_c="+latestChapterN);

							//Update row info.
							$(parentRow).find('td:eq(2)').text(latestChapterE.text());
							$(parentRow).find('td:eq(3)').html(function() { return $(this).text(); } );
							$(parentRow).find('td:eq(4)').remove();

							return false;
						})
					)
				);

				//Move chapters with new chapters to top of list.
				firstRow.before(
					$(this)
				);
			}
		});

		//Prepend MAL icons to series that are linked with MAL.
		var myanimelistBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAFVBMVEUdQ5tBYautu9u7xuG+yeL///9WcrRHHbb3AAAANUlEQVR42s2KSQoAMAgD7Zb/P1mnIqWnXjuBKEPsFxpUIzpUb5GJwbCJWJmAe0R+km7B7IkDNr0AvowT5PIAAAAASUVORK5CYII=";
		var currentManga = $('tr[id^=r]').map(function() { return $(this).attr('id').substring(1); }).get();
		$.post("https://codeanimu.net/userscripts/mangaupdates.com/backend/mu_links.php", {json_ids: JSON.stringify(currentManga)}, function(data) {
			var linkedIDs = JSON.parse(data);
			for (var muID in linkedIDs) {
				$('#r'+muID+' > td:nth-child(2)').prepend(
					$('<a/>', {href: 'http://myanimelist.net/manga/'+linkedIDs[muID], style: 'margin-right: 3px;'}).append(
						$('<img/>', {src: myanimelistBase64})
					)
				);
			}
		});
	}

	function setupExport() {
		$('a[title="Export this list"]').replaceWith(
			$('<a/>', {href: '#', title: 'JSON Export', text: 'JSON Export'}).click(function() {
				exportData();
				return false;
			})
		);
	}
	function exportData() {
		var mangaList = [];
		$('.lrow').each(function() {
			var manga = {
				id:             $(this).attr('id').substring(1),
				title:          $(this).find('> td:eq(1) u').text().trim(),
				currentChapter: $(this).find('> td:eq(2)').text().trim().substring(1)
			};
			mangaList.push(manga);
		});

		var blob = new Blob([JSON.stringify(mangaList, null, "\t")], {type: "application/json;charset=utf-8"});
		saveAs(blob, "MU-"+new Date().toJSON().slice(0,10)+".json");
	}

	function setupImport() {
		$('<input/>', {type: 'file', id: 'mal_input', text: 'MAL Import', width: '80px'})
			.change(function() { importMal(this); })
			.insertAfter('a[title="Export this list"]')
			.after($('<span/>', {id: 'import_status'}))
			.before("] | [MAL Import: "); //Re-add the closing bracket of JSON export

		$('<a/>', {id: 'mal_sync', href: '#', text: 'MAL Import (AJAX)', style: 'text-decoration: underline'})
			.click(function(e) { e.preventDefault(); importMalSync(); })
			.insertAfter('#mal_input')
			.before(" | "); //Re-add the closing bracket of JSON export

		//Avoid pushing file on options update.
		$('input[name=update_options]').submit(function() {
			$('#mal_input').remove();
		});

		//Allow space for reload link
		$('form[name=seriesForm] > .low_col1').css('width', '65%');
		$('form[name=seriesForm] > .low_col2').css('width', '35%');

		//Info block
		$('form[name=seriesForm] > .low_col1').append(
			$('<div/>', {id: 'info_block'}).append(
				$('<ul/>')
			)
		);
	}
	function importMal(input) {
		var files = input.files;
		if(files && files[0]) {
			var file = files[0];

			var xml;
			switch(file.name.match(/\..*$/)[0]) {
				case '.xml.gz':
					importMalGz(file);
					break;
				case '.xml':
					//Some people might have already extracted the .xml file.
					importMalXml(file);
					break;
				default:
					alert('"'+file.name+'" has an invalid ext');
					break;
			}
		}
	}
	function importMalSync() {
		//Try to import sync data from MAL
		GM_xmlhttpRequest({
			method: "GET",
			url: "http://myanimelist.net/panel.php?go=export",
			onload: function(response) {
				console.log("loaded export");
				if(/http:\/\/myanimelist.net\/logout.php/.exec(response.responseText)) {
					//user is logged in, export manga then sync
					var csrf_token = /<meta name='csrf_token' content='([A-Za-z0-9]+)'>/.exec(response.responseText)[1];
					GM_xmlhttpRequest({
						method: "POST",
						url: "http://myanimelist.net/panel.php?go=export",
						data: "type=2&subexport="+encodeURIComponent("Export My List")+"&csrf_token="+encodeURIComponent(csrf_token),
						headers: {
							"Content-Type": "application/x-www-form-urlencoded"
						},
						onload: function(response2) {
							console.log("loaded export post");
							var url_args = /<a href="\/export\/download\.php\?time=([0-9]+)&t=manga&id=([0-9]+)">.*<\/a>\./.exec(response2.responseText);
							//we need to use our own backend to grab the data as otherwise the browser will force DL the file.


							/** http://stackoverflow.com/a/11058858 **/
							//For whatever reason we can't use jQuery for this..
							var xhr = new XMLHttpRequest();
							xhr.open('GET', "https://codeanimu.net/userscripts/mangaupdates.com/backend/mal_sync.php?time="+url_args[1]+"&id="+url_args[2]);
							xhr.responseType = 'arraybuffer';
							xhr.onload = function() {
								if (this.status == 200) {
									var bytes = new Uint8Array(this.response);
									var gunzip = new Zlib.Gunzip(bytes);
									var d = gunzip.decompress();

									_arrayBufferToString(d, function(xml) {
										importMalXmlString(xml);
									});
								} else {
									console.error('Error while requesting', this);
								}
							};
							xhr.send();
						}
					});
				} else {
					//user is not logged in, throw error
					alert("Unable to sync, are you logged in on MAL?");
				}
			}
		});

		return false;
	}
	function importMalXml(file) {
		var reader = new FileReader();
		reader.onload = function (e) {
			importMalXmlString(e.target.result);
		};
		reader.readAsText(file);
	}
	function importMalXmlString(xmlString) {
		var xmlObject    = $($.parseXML(xmlString)).find('myanimelist'),
			myInfo       = xmlObject.find('> myInfo'),
			manga        = xmlObject.find('> manga');

		var currentManga = {};
		$('tr[id^=r]').each(function() {
			var id      = $(this).attr('id').substring(1),
			    chapter = $(this).find('> td:nth-child(3)').text().substr(1);
			currentManga[id] = chapter;
		});

		manga = manga.filter(function() {
			return $(this).find('> my_status').text() == 'Reading';
		});

		var time = 500;
		manga.each(function(i) {
			var id             = $(this).find('manga_mangadb_id').text(),
				title          = $(this).find('manga_title').text(),
				currentChapter = $(this).find('my_read_chapters').text();

			setTimeout(function(){
				$.getJSON("https://codeanimu.net/userscripts/mangaupdates.com/backend/mu_index.php", {"id": id}, function(json) {
					if(!json.error) {
						if($.inArray(json.id_mu.toString(), Object.keys(currentManga)) === -1) {
							sendHTTPRequest(function(){
								sendHTTPRequest(function(){}, "ajax/chap_update.php?s=" + json.id_mu + "&set_c=" + currentChapter);
							}, "ajax/list_update.php?s=" + json.id_mu + "&l=0");

							$('#info_block > ul').append(
								$('<li/>', {style: 'color: rgba(0, 255, 0, 0.70);'}).append('"').append(
									$('<a/>', {href: 'http://myanimelist.net/manga/'+id, text: title, style: 'text-decoration: underline'})
								).append('" has been added to your list')
							);
						} else {
							if(currentManga[json.id_mu.toString()] !== currentChapter) {
								sendHTTPRequest(function(){}, "ajax/chap_update.php?s=" + json.id_mu + "&set_c=" + currentChapter);

								$('#info_block > ul').append(
									$('<li/>').append('"').append(
										$('<a/>', {href: 'http://myanimelist.net/manga/'+id, text: title, style: 'text-decoration: underline'})
									).append('" has been updated')
								);
							} else {
								// $('#info_block > ul').append(
									// $('<li/>').append('"').append(
										// $('<a/>', {href: 'http://myanimelist.net/manga/'+id, text: title, style: 'text-decoration: underline'})
									// ).append('" has been updated')
								// );
							}
						}
					} else {
						$('#info_block > ul').append(
							$('<li/>', {style: 'color: rgba(255, 0, 0, 0.70);'}).append('"').append(
								$('<a/>', {href: 'http://myanimelist.net/manga/'+id, text: title, style: 'text-decoration: underline'})
							).append('" is missing a mangaupdates ID')
						);
					}
					if($('#info_block > ul > li:last')) {
						$('#info_block > ul > li:last').get(0).scrollIntoView();
					}

					$('#import_status').text(i+1 + '/' + manga.length + '  ');

					if(i === (manga.length - 1)) {
						$('#import_status').append(
							$('<a/>', {href: 'javascript: location.reload();', text: 'Reload', style: 'text-decoration: underline; color: red;'})
						);
					}
				});
			}, time);
			time += 500;
		});
	}
	function importMalGz(file) {
		var fileData = new Blob([file]);

		var promise = new Promise(function(resolve) {
			var reader = new FileReader();
			reader.readAsArrayBuffer(fileData);
			reader.onload = function() {
				var arrayBuffer = reader.result;
				var bytes = new Uint8Array(arrayBuffer);
				resolve(bytes);
			};
		});
		promise.then(function(data) {
			var gunzip = new Zlib.Gunzip(data);
			var d = gunzip.decompress();

			var xml = "";
			_arrayBufferToString(d, function(xml) {
				importMalXmlString(xml);
			});
		}).catch(function(err) {
			console.log('Error: ', err);
			alert('ERROR: Unable to import file');
		});
	}

	function setupSeries() {
		var currentChapter = $('a[title="Increment Chapter"]').text().trim().replace(/[^0-9]+/g, '');
		var id = location.search.match(/id=([0-9]+)/)[1];

		$('#showList').html(function(){ return $(this).html().replace(/up to /, 'up to c.'); });

		$('<input/>', {type: 'text', value: currentChapter, style: 'width: 20px; text-align: center;'}).keypress(function(e) {
			var key = e.which;
			if(key == 13) { //enter
				sendHTTPRequest(function(){}, "ajax/chap_update.php?s="+id+"&set_c="+$(this).val());
				return false;
			}
		}).insertBefore('a[title="Increment Volume"]');

		//$('#showList').html(function(){ return $(this).html().replace(/(&nbsp;)+/g, '&nbsp;'); }); //FIXME: This breaks the keypress event.
		$('#showList a[title*="Increment"], #showList a[title*="Decrement"]').remove();

		//Make sure series is setup after it's added to reading list.
		$('a[href*="addReading"]').attr('href', '#').attr('id', 'add_reading');
		$('#add_reading').click(function() {
			sendHTTPRequest(function(r) {
				listUpdate(r);
				setupSeries();
			}, "ajax/list_update.php?s=" + id + "&l=0");
		});
	}


	/** http://stackoverflow.com/a/14078925/1168377 **/
	function _arrayBufferToString(buf, callback) {
		var bb = new Blob([new Uint8Array(buf)]);
		var f = new FileReader();
		f.onload = function(e) {
			callback(e.target.result);
		};
		f.readAsText(bb);
	}
});