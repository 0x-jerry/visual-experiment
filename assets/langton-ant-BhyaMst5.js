var x=Object.defineProperty;var y=(i,r,a)=>r in i?x(i,r,{enumerable:!0,configurable:!0,writable:!0,value:a}):i[r]=a;var f=(i,r,a)=>(y(i,typeof r!="symbol"?r+"":r,a),a);import{u as G,a as z,_ as C}from"./useCanvasRunner-BtSyTrXL.js";import{c as M}from"./utils-DWuipzrQ.js";import{P as d}from"./angle-CPSFGmFf.js";import{G as S}from"./grid-BnBmgwES.js";import{V as w}from"./vec2-ikhXc4Ii.js";import{d as A,b as P,o as b,c as B,w as R,a as V,u as k}from"./index-B1bq4_oz.js";const U=A({__name:"langton-ant",setup(i){class r extends S{constructor(){super(...arguments);f(this,"ant",w.zero);f(this,"dir",w.up)}getAntGround(){const{x:o,y:s}=this.ant;return this.get(o,s)}}const a=G({color:"#f26f6f",size:{_:!0,min:1,step:1,value:10},FPS:{_:!0,step:1,value:60,min:1,max:200},antColor:"#28bc97",restart(){m()}}),c=z(v),t=new r;P(()=>{m()});function m(){const{width:e,height:n}=c.ctx.canvas,{size:o}=a.value;t.w=Math.ceil(e/o),t.h=Math.ceil(n/o),t.clear(),t.ant.x=Math.round(t.w/2),t.ant.y=Math.round(t.h/2),g(c.ctx),h(c.ctx)}function v(e){const n=t.getAntGround(),o=n===1?0:1;s(t.ant.x,t.ant.y,o),n===1?t.dir.rotate(d/2):t.dir.rotate(-d/2),t.ant.add(t.dir),h(e);function s(l,p,_){t.set(l,p,_);const{size:u}=a.value;e.fillStyle=_===0?"white":a.value.color,e.fillRect(l*u,p*u,u,u)}}function g(e){M(e);const{size:n}=a.value;t.forEach((o=0,s,l)=>{e.fillStyle=o===0?"white":a.value.color,e.fillRect(s*n,l*n,n,n)})}function h(e){const{size:n}=a.value;e.fillStyle=a.value.antColor;const o=t.ant,s=o.x*n+n/2,l=o.y*n+n/2;e.beginPath(),e.arc(s,l,n/2,0,2*d),e.fill()}return(e,n)=>(b(),B(C,{title:"Langton's ant"},{default:R(()=>[V("div",{ref:k(c).ctx.ref,class:"w-full h-full"},null,512)]),_:1}))}});export{U as default};
