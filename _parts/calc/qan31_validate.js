// Szerkezet + KaTeX ellenőrzés: node qan31_validate.js <q1.js> <katex.js>
const fs = require('fs');
const src = fs.readFileSync(process.argv[2], 'utf8');
const katex = require(process.argv[3]);
const Q = new Function('const R=String.raw; return {' + src + '};')();
let err = 0, nf = 0;
const bad = m => { err++; console.log('HIBA', m); };
const tex = (s, w) => { if (typeof s !== 'string') return;
  const re = /\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g; let m;
  while ((m = re.exec(s))) { nf++; try { katex.renderToString(m[1] || m[2], { throwOnError: true, displayMode: !!m[1] }); } catch (e) { bad(w + ' ' + e.message); } }
  if ((s.match(/\$/g) || []).length % 2) bad(w + ' páratlan $'); };
for (const [id, qz] of Object.entries(Q)) {
  console.log(id, qz.title, '–', qz.questions.length, 'kérdés');
  qz.questions.forEach((q, i) => { const w = id + '#' + (i + 1);
    if (!q.hint) bad(w + ' nincs hint'); if (!q.explain) bad(w + ' nincs explain');
    if (!['single', 'multi', 'match', 'set'].includes(q.type)) bad(w + ' típus: ' + q.type);
    if (q.type === 'single') { if (!(q.answer >= 0 && q.answer < q.options.length)) bad(w + ' answer'); if (!q.shuffle) bad(w + ' shuffle');
      if (new Set(q.options).size !== q.options.length) bad(w + ' ismétlődő opció'); }
    if (q.type === 'multi') { if (!Array.isArray(q.answer) || q.answer.some(k => !(k >= 0 && k < q.options.length))) bad(w + ' multi answer');
      if (q.answer.length < 2 || q.answer.length > 3) bad(w + ' multi helyesek száma'); }
    if (q.type === 'set') q.answer.forEach(a => { if (!q.items.includes(a)) bad(w + ' set answer ' + a); });
    if (q.type === 'match') q.pairs.forEach(p => { if (/[$<>]/.test(p[1])) bad(w + ' match jobb oldal: ' + p[1]); });
    [q.q, q.hint, q.explain, ...(q.options || []), ...(q.pairs || []).map(p => p[0])].forEach(s => tex(s, w));
    if (/[^\\]<(?![a-z/])/.test(q.q + (q.options || []).join(''))) bad(w + ' nyers < jel');
  });
}
console.log(nf, 'képlet,', err, 'hiba');
