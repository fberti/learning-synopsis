// ai13 q3 kvíztöredék ellenőrzése: node q121_validate.js ../ch13/q3.js
const fs=require("fs"), vm=require("vm");
const src="(function(){const R=String.raw; const Q={"+fs.readFileSync(process.argv[2],"utf8")+"}; Quiz.mountAll(Q); })();";
let Q=null; const ctx={Quiz:{mountAll:q=>Q=q}}; vm.createContext(ctx); vm.runInContext(src, ctx);
let bad=0;
for (const [id,qz] of Object.entries(Q)) { const types={};
  for (const q of qz.questions) { types[q.type]=(types[q.type]||0)+1; const err=[];
    if(!q.hint) err.push("hint"); if(!q.explain) err.push("explain"); if(q.type==="numeric") err.push("numeric");
    if(q.type==="single"){ if(!(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.options.length)) err.push("ans"); if(q.options.length!==4) err.push("opt"+q.options.length); if(new Set(q.options).size!==q.options.length) err.push("dup"); if(!q.shuffle) err.push("noshuffle"); }
    if(q.type==="multi"){ if(!q.answer.every(a=>a>=0&&a<q.options.length)) err.push("multi"); if(q.answer.length<2||q.answer.length>3||q.options.length!==5) err.push("multicount"); }
    if(q.type==="set"&&!q.answer.every(a=>q.items.includes(a))) err.push("set");
    if(q.type==="match"){ if(q.pairs.some(p=>/\$/.test(p[1]))) err.push("katex-right"); if(new Set(q.pairs.map(p=>p[1])).size!==q.pairs.length) err.push("dupright"); }
    if(err.length){bad++;console.log(id,q.q.slice(0,50),err);} }
  console.log(id, qz.questions.length, JSON.stringify(types)); }
console.log("bad", bad);
