var app=function(){"use strict";function t(){}function r(t){return t()}function n(){return Object.create(null)}function e(t){t.forEach(r)}function o(t){return"function"==typeof t}function i(t,r){return t!=t?r==r:t!==r||t&&"object"==typeof t||"function"==typeof t}function u(t,r){t.appendChild(r)}function c(t,r,n){t.insertBefore(r,n||null)}function a(t){t.parentNode.removeChild(t)}function f(t){return document.createElement(t)}function s(t){return document.createTextNode(t)}function p(){return s(" ")}function l(){return s("")}function h(t,r,n,e){return t.addEventListener(r,n,e),()=>t.removeEventListener(r,n,e)}function d(t,r,n){null==n?t.removeAttribute(r):t.setAttribute(r,n)}function y(t,r){r=""+r,t.data!==r&&(t.data=r)}let _;function m(t){_=t}function g(){const t=_;return(r,n)=>{const e=t.$$.callbacks[r];if(e){const o=function(t,r){const n=document.createEvent("CustomEvent");return n.initCustomEvent(t,!1,!1,r),n}(r,n);e.slice().forEach(r=>{r.call(t,o)})}}}const v=[],$=Promise.resolve();let A=!1;const b=[],N=[],j=[];function x(t){N.push(t)}function E(){const t=new Set;do{for(;v.length;){const t=v.shift();m(t),O(t.$$)}for(;b.length;)b.shift()();for(;N.length;){const r=N.pop();t.has(r)||(r(),t.add(r))}}while(v.length);for(;j.length;)j.pop()();A=!1}function O(t){t.fragment&&(t.update(t.dirty),e(t.before_render),t.fragment.p(t.dirty,t.ctx),t.dirty=null,t.after_render.forEach(x))}function S(t,n,i){const{fragment:u,on_mount:c,on_destroy:a,after_render:f}=t.$$;u.m(n,i),x(()=>{const n=c.map(r).filter(o);a?a.push(...n):e(n),t.$$.on_mount=[]}),f.forEach(x)}function w(t,r){t.$$.dirty||(v.push(t),A||(A=!0,$.then(E)),t.$$.dirty=n()),t.$$.dirty[r]=!0}function M(r,o,i,u,c,a){const f=_;m(r);const s=o.props||{},p=r.$$={fragment:null,ctx:null,props:a,update:t,not_equal:c,bound:n(),on_mount:[],on_destroy:[],before_render:[],after_render:[],context:new Map(f?f.$$.context:[]),callbacks:n(),dirty:null};let l=!1;var h;p.ctx=i?i(r,s,(t,n)=>{p.ctx&&c(p.ctx[t],p.ctx[t]=n)&&(p.bound[t]&&p.bound[t](n),l&&w(r,t))}):s,p.update(),l=!0,e(p.before_render),p.fragment=u(p.ctx),o.target&&(o.hydrate?p.fragment.l((h=o.target,Array.from(h.childNodes))):p.fragment.c(),o.intro&&r.$$.fragment.i&&r.$$.fragment.i(),S(r,o.target,o.anchor),E()),m(f)}class k{$destroy(){var r,n;n=!0,(r=this).$$&&(e(r.$$.on_destroy),r.$$.fragment.d(n),r.$$.on_destroy=r.$$.fragment=null,r.$$.ctx={}),this.$destroy=t}$on(t,r){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(r),()=>{const t=n.indexOf(r);-1!==t&&n.splice(t,1)}}$set(){}}function z(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}function C(t,r){return t(r={exports:{}},r.exports),r.exports}z(C(function(t,r){r.__esModule=!0,Array.prototype._isEmpty=function(){return 0===this.length},Array.prototype._isEqual=function(t){return JSON.stringify(this)===JSON.stringify(t)},Array.prototype._count=function(t){return this.filter(function(r){return r==t}).length},Array.prototype._uniq=function(){return Array.from(new Set(this))},Array.prototype._uniq$=function(){var t=this._uniq();return this._copy(t)},Array.prototype._overlap=function(){return this.filter(function(t,r,n){return n.indexOf(t)===r&&r!==n.lastIndexOf(t)})},Array.prototype._overlap$=function(){var t=this._overlap();return this._copy(t)},Array.prototype._first=function(t){var r=this;return void 0===t&&(t=1),1===t?this[0]:F.range(t).map(function(t){return r[t]})},Array.prototype._last=function(t){void 0===t&&(t=1);var r=this.concat();return 1===t?r.pop():r.reverse()._first(t).reverse()},Array.prototype._take=function(t){return this.concat()._take$(t)},Array.prototype._take$=function(t){return this.splice(t),this},Array.prototype._drop=function(t){return this.concat().splice(t)},Array.prototype._drop$=function(t){return this.splice(t)},Array.prototype._sample=function(){return this.concat()._sample$()},Array.prototype._sample$=function(){var t=F.randInt(this.length),r=this[t];return this._remove$(t),r},Array.prototype._asc=function(t){return void 0===t&&(t=""),this.concat()._asc$(t)},Array.prototype._asc$=function(t){return void 0===t&&(t=""),""===t?this.sort(function(t,r){return t-r}):this.sort(function(r,n){return r[t]-n[t]})},Array.prototype._desc=function(t){return void 0===t&&(t=""),this.concat()._desc$(t)},Array.prototype._desc$=function(t){return void 0===t&&(t=""),""===t?this.sort(function(t,r){return r-t}):this.sort(function(r,n){return n[t]-r[t]})},Array.prototype._rotate=function(t){return void 0===t&&(t=1),this.concat()._rotate$(t)},Array.prototype._rotate$=function(t){return void 0===t&&(t=1),t%=this.length,this.unshift.apply(this,this.splice(t)),this},Array.prototype._shuffle=function(){var t=this.concat();return F.range(this.length).map(function(r){return t._sample$()})},Array.prototype._shuffle$=function(){var t=this._shuffle();return this._copy(t)},Array.prototype._flat=function(){var t=function(r){return r.reduce(function(r,n){return Array.isArray(n)?r.concat(t(n)):r.concat(n)},[])};return t(this)},Array.prototype._flat$=function(){var t=this._flat();return this._copy(t)},Array.prototype._zip=function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];return this.map(function(r,n){return[r].concat(t.map(function(t){return t[n]?t[n]:null}))})},Array.prototype._zip$=function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];return this._copy(this._zip.apply(this,t))},Array.prototype._transpose=function(){var t=this;return F.range(this[0].length).map(function(r){return F.range(t.length).map(function(n){return t[n][r]})})},Array.prototype._transpose$=function(){var t=this._transpose();return this._copy(t)},Array.prototype._copy=function(t){var r=this;return this._clear(),t.forEach(function(t,n){return r[n]=t}),this},Array.prototype._clear=function(){return this.length=0,this},Array.prototype._delete=function(t){return this.concat()._delete$(t)},Array.prototype._delete$=function(t){return this._remove$.apply(this,this.map(function(t,r){return[t,r]}).filter(function(r){return r._first()==t}).map(function(t){return t._last()})),this},Array.prototype._remove=function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];var n=this.concat();return n._remove$.apply(n,t)},Array.prototype._remove$=function(){for(var t=this,r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];return r._flat$()._uniq$(),1===r.length?this.splice(r._first(),1)._first():r.length>1&&r._desc().forEach(function(r){return t.splice(r,1)}),this},Array.prototype._insert=function(t){for(var r=[],n=1;n<arguments.length;n++)r[n-1]=arguments[n];var e=this.concat();return e._insert$.apply(e,[t].concat(r))},Array.prototype._insert$=function(t){for(var r=[],n=1;n<arguments.length;n++)r[n-1]=arguments[n];return this.splice.apply(this,[t,0].concat(r._flat())),this},Array.prototype._compact=function(){return this.filter(function(t){return t})},Array.prototype._compact$=function(){var t=this._compact();return this._copy(t)},Array.prototype._chunk=function(t){var r=this,n=this.length,e=t._ceil();return F.range(0,n,e).map(function(t){return r.slice(t,t+e)})},Array.prototype._chunk$=function(t){var r=this._chunk(t);return this._copy(r)},Array.prototype._each=function(t,r){return this.reduce(function(n,e){return n[n.length]=t.call(r,e),n},[])}})),z(C(function(t,r){r.__esModule=!0,Object.prototype._isEmpty=function(){return"{}"===JSON.stringify(this)},Object.prototype._isEqual=function(t){return JSON.stringify(this)===JSON.stringify(t)}})),z(C(function(t,r){r.__esModule=!0,String.prototype._num=function(){return F.isStrFinite(this)?Number(this):this},String.prototype._pw=function(){return this.split(" ")},String.prototype._splitNum=function(){return this.split(" ").map(Number)},String.prototype._spaceFill=function(t){return" ".repeat(t-this.length)+this},String.prototype._zeroFill=function(t){return"0".repeat(t-this.length)+this}})),z(C(function(t,r){r.__esModule=!0,Number.prototype._str=function(){return String(this)},Number.prototype._abs=function(){return Math.abs(this)},Number.prototype._round=function(t){return void 0===t&&(t=1),Math.round(this/t)*t},Number.prototype._ceil=function(t){return void 0===t&&(t=1),Math.ceil(this/t)*t},Number.prototype._floor=function(t){return void 0===t&&(t=1),Math.floor(this/t)*t},Number.prototype._spaceFill=function(t){var r=String(this);return" ".repeat(t-r.length)+r},Number.prototype._zeroFill=function(t){var r=String(this);return"0".repeat(t-r.length)+r},Number.prototype._minusOnlyZero=function(){return this<0?0:this}})),z(C(function(t,r){r.__esModule=!0}));var F=C(function(t,r){r.__esModule=!0,r.range=function(t,r,n){switch(void 0===r&&(r=0),void 0===n&&(n=1),arguments.length){case 1:return Array.from(Array(t),function(t,r){return r});case 2:var e=-t+r;return Array.from(Array(e._minusOnlyZero()),function(r){return t++});case 3:if(n>0){var o=-t+r;return Array.from(Array(o._minusOnlyZero()),function(r){return t++}).filter(function(t,r){return r%n==0})}if(n<0){var i=t+-r;return Array.from(Array(i._minusOnlyZero()),function(r){return t--}).filter(function(t,r){return r%n==0})}console.error(Error("range() arg 3 must not be zero"))}return[]},r.rand=function(t){return Math.random()*t},r.randInt=function(t){return r.rand(t)._floor()},r.max=function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];return Math.max.apply(Math,t._flat())},r.min=function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];return Math.min.apply(Math,t._flat())},r.sum=function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];return t._flat().reduce(function(t,r){return t+r})},r.mean=function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];return t._flat$(),r.sum(t)/t.length},r.isNumber=function(t){return"number"==typeof t},r.isFinite=function(t){return Number.isFinite(t)},r.isStrFinite=function(t){return RegExp(/^[-+]?[0-9]+(\.[0-9]+)?$/).test(t)}});z(F);var q=F.range,J=(F.rand,F.randInt,F.max,F.min,F.sum,F.mean,F.isNumber,F.isFinite,F.isStrFinite,function(t){for(var r=[],n=8*(t/8|0),e=0;e<8;e++)r.push(n+e);for(n=t%8,e=0;e<8;n+=8,e++)r.push(n);for(n=t;n<64&&(r.push(n),n%8!=7);n+=9);for(n=t;n>=0&&(r.push(n),n%8!=0);n-=9);for(n=t;n>=0&&(r.push(n),n%8!=7);n-=7);for(n=t;n<64&&(r.push(n),n%8!=0);n+=7);return r._uniq()});function I(t,r,n){const e=Object.create(t);return e.f=r[n],e.i=n,e}function Z(t){var r;return{c(){r=f("br")},m(t,n){c(t,r,n)},d(t){t&&a(r)}}}function B(t){var r,n,e,o,i;function u(...r){return t.click_handler(t,...r)}var s=(t.i+1)%8==0&&Z();return{c(){r=f("div"),e=p(),s&&s.c(),o=l(),r.className="trout svelte-q77wyd",d(r,"number",n=t.f),i=h(r,"click",u)},m(t,n){c(t,r,n),c(t,e,n),s&&s.m(t,n),c(t,o,n)},p(e,i){t=i,e.field&&n!==(n=t.f)&&d(r,"number",n),(t.i+1)%8==0?s||((s=Z()).c(),s.m(o.parentNode,o)):s&&(s.d(1),s=null)},d(t){t&&(a(r),a(e)),s&&s.d(t),t&&a(o),i()}}}function T(r){for(var n,e=r.field,o=[],i=0;i<e.length;i+=1)o[i]=B(I(r,e,i));return{c(){for(var t=0;t<o.length;t+=1)o[t].c();n=l()},m(t,r){for(var e=0;e<o.length;e+=1)o[e].m(t,r);c(t,n,r)},p(t,r){if(t.field){e=r.field;for(var i=0;i<e.length;i+=1){const u=I(r,e,i);o[i]?o[i].p(t,u):(o[i]=B(u),o[i].c(),o[i].m(n.parentNode,n))}for(;i<o.length;i+=1)o[i].d(1);o.length=e.length}},i:t,o:t,d(t){!function(t,r){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(r)}(o,t),t&&a(n)}}}function L(t,r,n){var e=g(),{count:o,judge:i,field:u}=r,c=function(t){if(0===u[t])a(t),n("count",++o),l(),h();else if(23===u[t]){var r=q(64).filter(function(t){return 23==u[t]})._delete(t);f(),r.forEach(a),n("count",--o),l(),h()}},a=function(t){p(t),J(t).filter(function(t){return 0===u[t]}).forEach(s)},f=function(){return q(64).forEach(function(t){var r=u[t]=0;return n("field",u),r})},s=function(t){var r=u[t]=0===u[t]?25:u[t];return n("field",u),r},p=function(t){var r=u[t]=0===u[t]?23:u[t];return n("field",u),r},l=function(){u.some(function(t){return 0===t})?n("judge",i=""):n("judge",i=8===o?o+"個置けたねおめでとう":o+"個しか置けてないぞ")},h=function(){e("updateChild",{count:o,judge:i,field:u})};return t.$set=(t=>{"count"in t&&n("count",o=t.count),"judge"in t&&n("judge",i=t.judge),"field"in t&&n("field",u=t.field)}),{count:o,judge:i,field:u,troutClick:c,click_handler:function({i:t},r){return c(t)}}}class P extends k{constructor(t){super(),M(this,t,L,T,i,["count","judge","field"])}}function Q(t){var r,n,e,o,i,l,d,_,m,g,v,$,A,b,N,j=new P({props:{count:t.count,judge:t.judge,field:t.field}});return j.$on("updateChild",t.updateChild),{c(){r=f("div"),n=f("main"),(e=f("h1")).textContent="8Queen",o=p(),j.$$.fragment.c(),i=p(),l=f("span"),d=s("Queenの数："),_=s(t.count),(m=f("button")).textContent="はじめから",g=f("br"),v=p(),$=f("span"),A=s(t.judge),e.className="title svelte-1bowyze",l.className="svelte-1bowyze",m.className="svelte-1bowyze",$.className="svelte-1bowyze",n.className="svelte-1bowyze",r.className="centered svelte-1bowyze",N=h(m,"click",t.fromTheBeginning)},m(t,a){c(t,r,a),u(r,n),u(n,e),u(n,o),S(j,n,null),u(n,i),u(n,l),u(l,d),u(l,_),u(n,m),u(n,g),u(n,v),u(n,$),u($,A),b=!0},p(t,r){var n={};t.count&&(n.count=r.count),t.judge&&(n.judge=r.judge),t.field&&(n.field=r.field),j.$set(n),b&&!t.count||y(_,r.count),b&&!t.judge||y(A,r.judge)},i(t){b||(j.$$.fragment.i(t),b=!0)},o(t){j.$$.fragment.o(t),b=!1},d(t){t&&a(r),j.$destroy(),N()}}}function R(t,r,n){var e=0,o="",i=q(64).fill(0);return{count:e,judge:o,field:i,fromTheBeginning:function(){n("count",e=0),n("judge",o=""),q(64).forEach(function(t){var r=i[t]=0;return n("field",i),r})},updateChild:function(t){n("count",e=t.detail.count),n("judge",o=t.detail.judge),n("field",i=t.detail.field)}}}return new class extends k{constructor(t){super(),M(this,t,R,Q,i,[])}}({target:document.body,props:{name:"world"}})}();
//# sourceMappingURL=bundle.js.map
