// q2.js szerkezeti ellenőrzése: node qms72_check.js <q2.js>
const fs=require("fs"); const src=fs.readFileSync(process.argv[2],"utf8");
const Q=new Function("const R=String.raw; return {"+src+"};")(); let err=0;
for (const [id,qz] of Object.entries(Q)) { let k=0;
  for (const q of qz.questions) { k++; const tag=id+"#"+k;
    if (!q.hint) {err++;console.log(tag,"no hint");} if (!q.explain) {err++;console.log(tag,"no explain");}
    if (q.type==="numeric") {err++;console.log(tag,"numeric");}
    if (q.type==="single") { if (!q.shuffle) console.log(tag,"no shuffle"); if (!(q.answer>=0&&q.answer<q.options.length)) {err++;console.log(tag,"bad answer");} }
    if (q.type==="multi") { if(!Array.isArray(q.answer)||q.answer.some(a=>a<0||a>=q.options.length)) {err++;console.log(tag,"bad multi");} if(q.options.length!==5||q.answer.length<2||q.answer.length>3) console.log(tag,"multi shape"); }
    if (q.type==="set") { if(q.answer.some(a=>!q.items.includes(a))) {err++;console.log(tag,"bad set");} }
    if (q.type==="match") { for (const [l,r] of q.pairs) if (/\$/.test(r)) {err++;console.log(tag,"KaTeX on right");} }
    if (q.options && new Set(q.options).size!==q.options.length) {err++;console.log(tag,"dup option");}
  } console.log(id, qz.questions.length, "kérdés"); }
console.log("hibák:",err);
