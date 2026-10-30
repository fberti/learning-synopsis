const fs=require("fs");
const src="(function(){const R=String.raw; const Q={"+fs.readFileSync(__dirname+"/q1.js","utf8")+"}; return Q;})()";
const Q=eval(src); let bad=0;
for (const [id,qz] of Object.entries(Q)) {
  console.log(id, qz.questions.length);
  qz.questions.forEach((q,i)=>{
    const e=m=>{bad++;console.log("  ERR",id,i,m)};
    if(!q.hint) e("hint"); if(!q.explain) e("explain"); if(q.type==="numeric") e("numeric");
    if(q.type==="single"){ if(!(q.answer>=0&&q.answer<q.options.length)) e("ans"); if(!q.shuffle) e("shuffle"); if(q.options.length!==4) e("4opt"); }
    if(q.type==="multi"){ if(!q.answer.every(a=>a>=0&&a<q.options.length)) e("ans"); if(q.options.length!==5||q.answer.length<2||q.answer.length>3) e("multi shape"); }
    if(q.type==="set"){ if(!q.answer.every(a=>q.items.includes(a))) e("set"); }
    if(q.type==="match"){ q.pairs.forEach(p=>{ if(/\$/.test(p[1])) e("katex right"); }); }
  });
}
console.log(bad?"FAIL":"OK");
