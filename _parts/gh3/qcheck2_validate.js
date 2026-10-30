const fs=require('fs'),path=require('path');
const src=fs.readFileSync(path.join(__dirname,'q2.js'),'utf8');
const code='(function(){const R=String.raw; const Q={'+src+'}; return Q;})()';
const Q=eval(code); let n=0, bad=0;
for(const [id,qz] of Object.entries(Q)){
  console.log(id, qz.title, qz.questions.length);
  qz.questions.forEach((q,i)=>{n++;
    const e=m=>{bad++;console.log('  !',id,i,m)};
    if(!q.hint) e('no hint'); if(!q.explain) e('no explain');
    if(q.type==='numeric') e('numeric');
    if(q.type==='single'){ if(!(q.answer>=0&&q.answer<q.options.length)) e('bad answer'); if(!q.shuffle) e('no shuffle'); if(q.options.length!==4) e('opts!=4'); if(new Set(q.options).size!==q.options.length) e('dup opts');}
    if(q.type==='multi'){ if(!Array.isArray(q.answer)||q.answer.some(a=>a<0||a>=q.options.length)) e('bad multi'); if(q.options.length!==5||q.answer.length<2||q.answer.length>3) e('multi shape');}
    if(q.type==='set'){ if(q.answer.some(a=>!q.items.includes(a))) e('set ans not in items');}
    if(q.type==='match'){ q.pairs.forEach(p=>{ if(/\$/.test(p[1])) e('katex in match right');}); }
  });
}
console.log('total',n,'bad',bad);
