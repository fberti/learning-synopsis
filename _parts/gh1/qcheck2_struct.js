const fs=require("fs");
const src=fs.readFileSync(__dirname+"/q2.js","utf8");
const Q=eval("(function(){const R=String.raw; return {"+src+"};})()");
let bad=0;
for(const [id,qz] of Object.entries(Q)){
  console.log(id,qz.questions.length,qz.title);
  qz.questions.forEach((q,i)=>{
    const e=m=>{bad++;console.log("  ERR",id,i+1,m)};
    if(!q.hint)e("no hint"); if(!q.explain)e("no explain");
    if(q.type==="numeric")e("numeric");
    if(q.type==="single"){ if(!(q.answer>=0&&q.answer<q.options.length))e("bad answer"); if(!q.shuffle)e("no shuffle"); if(new Set(q.options).size!==q.options.length)e("dup opt");}
    if(q.type==="multi"){ if(!Array.isArray(q.answer)||q.answer.some(a=>a<0||a>=q.options.length))e("bad multi"); if(q.answer.length<2||q.answer.length>3||q.options.length!==5)e("multi shape");}
    if(q.type==="set"){ if(q.answer.some(a=>!q.items.includes(a)))e("set ans");}
    if(q.type==="match"){ q.pairs.forEach(p=>{if(/\$/.test(p[1]))e("katex right")});}
  });
}
console.log("errors",bad);
