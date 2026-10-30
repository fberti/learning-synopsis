const fs=require("fs"),path=require("path");
const src=fs.readFileSync(path.join(__dirname,"q1.js"),"utf8");
const Q=new Function("const R=String.raw; return {"+src+"};")();
let n=0,bad=0;
for(const [id,qz] of Object.entries(Q)){ console.log(id,qz.questions.length);
 qz.questions.forEach((q,i)=>{n++; const e=m=>{bad++;console.log(" ERR",id,i,m)};
  if(!q.hint)e("hint"); if(!q.explain)e("explain"); if(q.type==="numeric")e("numeric");
  if(q.type==="single"){ if(!q.shuffle)e("shuffle"); if(!(q.answer>=0&&q.answer<q.options.length))e("ans"); if(new Set(q.options).size!==q.options.length)e("dup opts"); if(q.options.length!==4)e("4 opts");}
  if(q.type==="multi"){ if(!q.answer.every(a=>a>=0&&a<q.options.length))e("ans"); if(q.answer.length<2||q.answer.length>3)e("multi count");}
  if(q.type==="match"){ q.pairs.forEach(p=>{if(/\$/.test(p[1]))e("katex right")});}
  if(q.type==="set"){ if(!q.answer.every(a=>q.items.includes(a)))e("set");}
 });}
console.log("total",n,"errors",bad);
