// an4 q2.js szerkezeti ellenőrzése: node qan42_check.js <q2.js>
const fs = require("fs");
const src = fs.readFileSync(process.argv[2], "utf8");
const Q = new Function("const R=String.raw; return {" + src + "};")();
let bad = 0;
for (const [id, quiz] of Object.entries(Q)) {
  console.log(id, quiz.title, quiz.questions.length);
  quiz.questions.forEach((q, i) => {
    const e = m => { bad++; console.log("  HIBA", id, i + 1, m); };
    if (!q.hint) e("nincs hint"); if (!q.explain) e("nincs explain");
    if (q.type === "numeric") e("numeric");
    if (q.type === "single") { if (!(q.answer >= 0 && q.answer < q.options.length)) e("answer"); if (!q.shuffle) e("shuffle");
      if (new Set(q.options).size !== q.options.length) e("ismétlődő opció"); if (q.options.length !== 4) e("nem 4 opció"); }
    if (q.type === "multi") { if (!Array.isArray(q.answer) || q.answer.some(a => a < 0 || a >= q.options.length)) e("answer");
      if (q.options.length !== 5 || q.answer.length < 2 || q.answer.length > 3) e("multi 5/2-3"); }
    if (q.type === "set") { if (q.answer.some(a => !q.items.includes(a))) e("set answer"); }
    if (q.type === "match") { if (q.pairs.some(p => /\$|\\/.test(p[1]))) e("KaTeX a jobb oldalon"); }
    const all = JSON.stringify(q);
    for (const m of all.matchAll(/\$([^$]+?)\$/g)) if (m[1].includes("<")) e("< a KaTeX-ben: " + m[1]);
    const dec = all.match(/\d+\.\d+/g) || [];
    dec.filter(d => !/^[34]\.[1-8]$/.test(d)).forEach(d => e("tizedespont: " + d));
  });
}
console.log(bad ? bad + " hiba" : "OK");
