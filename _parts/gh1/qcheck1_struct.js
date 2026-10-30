const fs=require("fs");const src=fs.readFileSync(__dirname+"/q1.js","utf8");
const Q=eval("(function(){const R=String.raw; return {"+src+"};})()");
let ok=true;for(const [id,qz] of Object.entries(Q)){console.log(id,qz.questions.length);
qz.questions.forEach((q,i)=>{const e=m=>{ok=false;console.log("  HIBA",id,i,m)};
if(!q.hint)e("hint");if(!q.explain)e("explain");if(q.type==="numeric")e("numeric");
if(q.type==="single"){if(!(q.answer>=0&&q.answer<q.options.length))e("answer");if(!q.shuffle)e("shuffle");if(new Set(q.options).size!==q.options.length)e("dup")}
if(q.type==="multi"){if(!q.answer.every(a=>a>=0&&a<q.options.length))e("answer");if(q.answer.length<2||q.answer.length>3||q.options.length!==5)e("multi size")}
if(q.type==="set"&&!q.answer.every(a=>q.items.includes(a)))e("set");
if(q.type==="match")q.pairs.forEach(p=>{if(/\$/.test(p[1]))e("katex jobb oldalon")});});}
console.log(ok?"OK":"HIBAK");
