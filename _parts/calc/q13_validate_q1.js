const fs=require('fs');
const src=fs.readFileSync(process.argv[2],'utf8');
const Q=new Function('const R=String.raw; return {'+src+'};')();
let bad=0;
for(const [id,qz] of Object.entries(Q)){
  console.log(id, qz.title, qz.questions.length, 'kérdés', qz.questions.map(q=>q.type).join(','));
  qz.questions.forEach((q,i)=>{
    const e=m=>{bad++;console.log('  HIBA',id,i+1,m)};
    if(!q.hint) e('nincs hint'); if(!q.explain) e('nincs explain');
    if(q.type==='numeric') e('numeric');
    if(!['single','multi','match','set'].includes(q.type)) e('típus '+q.type);
    if(q.type==='single'){ if(!(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.options.length)) e('answer'); if(!q.shuffle) e('shuffle');
      if(q.options.length!==4) e('opciószám '+q.options.length); if(new Set(q.options).size!==q.options.length) e('duplikált opció');}
    if(q.type==='multi'){ if(!Array.isArray(q.answer)||q.answer.some(a=>a<0||a>=q.options.length)) e('answer');
      if(q.answer.length<2||q.answer.length>3||q.options.length!==5) e('multi 2-3/5');}
    if(q.type==='match'){ q.pairs.forEach(p=>{ if(/\$|\\/.test(p[1])) e('KaTeX a jobb oldalon: '+p[1]); }); }
    if(q.type==='set'){ q.answer.forEach(a=>{ if(!q.items.includes(a)) e('set answer nincs items-ben '+a)}); }
  });
}
console.log(bad?bad+' hiba':'OK');
