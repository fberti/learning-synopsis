const fs=require('fs');
const src=fs.readFileSync(process.argv[2],'utf8');
const Q=eval('(function(){const R=String.raw; return {'+src+'};})()');
let bad=0;
for(const [id,qz] of Object.entries(Q)){
  console.log(id, qz.title, qz.questions.length);
  qz.questions.forEach((q,i)=>{
    const e=m=>{bad++;console.log('  HIBA',id,i+1,m);};
    if(!q.hint) e('hint'); if(!q.explain) e('explain');
    if(q.type==='numeric') e('numeric');
    if(q.type==='single'){ if(!q.shuffle) e('shuffle'); if(!(q.answer>=0&&q.answer<q.options.length)) e('answer');
      if(new Set(q.options).size!==q.options.length) e('dup opt'); }
    if(q.type==='multi'){ if(q.options.length!==5||q.answer.length<2||q.answer.length>3) e('multi alak'); }
    if(q.type==='match'){ q.pairs.forEach(p=>{ if(/\$/.test(p[1])) e('KaTeX a jobb oldalon'); }); }
    if(q.type==='set'){ q.answer.forEach(a=>{ if(!q.items.includes(a)) e('set answer'); }); }
    const all=JSON.stringify(q); if((all.match(/\$/g)||[]).length%2) e('páratlan $');
  });
}
console.log(bad? bad+' hiba':'OK');
