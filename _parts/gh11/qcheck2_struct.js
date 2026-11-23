// q2.js szerkezeti ellenőrzés: node qcheck2_struct.js
const fs=require("fs"),path=require("path");
const frag=fs.readFileSync(path.join(__dirname,"q2.js"),"utf8");
fs.writeFileSync(path.join(__dirname,"qcheck2_wrapped.js"),"(function(){const R=String.raw; const Q={\n"+frag+"\n}; })();\n");
const Q=eval("(function(){const R=String.raw; return {"+frag+"}; })()");
let bad=0; const ids=new Set(); for(const f of fs.readdirSync(__dirname).filter(f=>/^\d\d-.*\.html$/.test(f))) for(const m of fs.readFileSync(path.join(__dirname,f),"utf8").matchAll(/id="([^"]+)"/g)) ids.add(m[1]);
for(const [id,qz] of Object.entries(Q)){ console.log(id,qz.questions.length);
 qz.questions.forEach((q,i)=>{const e=m=>{bad++;console.log(" HIBA",id,i+1,m)};
  if(!q.hint)e("hint"); if(!q.explain)e("explain"); if(q.type==="numeric")e("numeric");
  if(q.type==="single"){ if(!q.shuffle)e("shuffle"); if(!(q.answer>=0&&q.answer<q.options.length))e("answer"); if(q.options.length!==4)e("4 opció?"); }
  if(q.type==="multi"){ if(!q.answer.every(a=>a>=0&&a<q.options.length))e("answer"); if(q.options.length!==5||q.answer.length<2||q.answer.length>3)e("multi 5/2-3"); }
  if(q.type==="set"&&!q.answer.every(a=>q.items.includes(a)))e("set answer");
  if(q.type==="match"&&q.pairs.some(p=>/\$|<a/.test(p[1])))e("match jobb oldal");
  (q.options||[]).forEach(o=>{if(/<a /.test(o))e("link opcióban")});
  for(const t of [q.q,q.hint,q.explain]) for(const m of (t||"").matchAll(/href="([^"]+)"/g)){ const h=m[1]; if(h.startsWith("#")){ if(!ids.has(h.slice(1)))e("horgony "+h);} else e("külső "+h);}
  if(/lásd \d|\(\d+\.\d\)/i.test((q.q||"")+(q.hint||"")+(q.explain||"").replace(/<a[^>]*>.*?<\/a>/g,"")))e("link nélküli utalás?");
 });}
console.log("hibák:",bad);
