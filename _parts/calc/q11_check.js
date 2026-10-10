const fs=require("fs"), vm=require("vm");
let Q=null; const ctx={Quiz:{mountAll:q=>Q=q}}; ctx.window=ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(process.argv[2],"utf8"), ctx);
let n=0, bad=0;
for (const [id,qz] of Object.entries(Q)) for (const q of qz.questions) { n++;
  const err=[]; if(!q.hint) err.push("hint"); if(!q.explain) err.push("explain"); if(q.type==="numeric") err.push("numeric");
  if(q.type==="single"){ if(!(q.answer>=0&&q.answer<q.options.length)) err.push("ans"); if(q.options.length!==4) err.push("opt"+q.options.length); if(new Set(q.options).size!==q.options.length) err.push("dup"); }
  if(q.type==="multi"&&!q.answer.every(a=>a<q.options.length)) err.push("multi");
  if(q.type==="set"&&!q.answer.every(a=>q.items.includes(a))) err.push("set");
  if(err.length){bad++;console.log(id,q.q.slice(0,50),err);} }
console.log(Object.keys(Q).join(" "), "questions", n, "bad", bad);
