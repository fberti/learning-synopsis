// KaTeX-ellenőrzés a q1.js kvízeire: node q13_katex_q1.js <q1.js> <katex.min.js>
const fs=require('fs');
const katex=require(process.argv[3]);
const Q=new Function('const R=String.raw; return {'+fs.readFileSync(process.argv[2],'utf8')+'};')();
let n=0,bad=0;
const chk=(s,where)=>{ if(typeof s!=='string') return;
  const re=/\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g; let m;
  while((m=re.exec(s))){ n++; try{ katex.renderToString(m[1]||m[2],{throwOnError:true,displayMode:!!m[1]}); }catch(e){ bad++; console.log(where, e.message); } } };
for(const [id,qz] of Object.entries(Q)) qz.questions.forEach((q,i)=>{ const w=id+'#'+(i+1);
  chk(q.q,w); chk(q.hint,w); chk(q.explain,w); (q.options||[]).forEach(o=>chk(o,w)); (q.pairs||[]).forEach(p=>chk(p[0],w)); });
console.log(n,'képlet,',bad,'hiba');
