// q2.js szerkezeti ellenőrzése
const fs = require("fs");
const src = fs.readFileSync(__dirname + "/../ms8/q2.js", "utf8");
const Q = new Function("const R = String.raw; return {" + src + "};")();
let bad = 0;
for (const [id, quiz] of Object.entries(Q)) {
  console.log(id, quiz.title, "–", quiz.questions.length, "kérdés");
  quiz.questions.forEach((q, i) => {
    const e = m => { bad++; console.log("  HIBA", id, i + 1, m); };
    if (!q.hint) e("nincs hint"); if (!q.explain) e("nincs explain");
    if (q.type === "numeric") e("numeric");
    if (q.type === "single") { if (!(q.answer >= 0 && q.answer < q.options.length)) e("answer index"); if (!q.shuffle) e("shuffle"); if (q.options.length !== 4) e("nem 4 opció"); }
    else if (q.type === "multi") { if (!q.answer.every(a => a >= 0 && a < q.options.length)) e("multi index"); if (q.answer.length < 2 || q.answer.length > 3 || q.options.length !== 5) e("multi 2–3/5"); }
    else if (q.type === "match") { q.pairs.forEach(p => { if (/\$/.test(p[1])) e("KaTeX a jobb oldalon"); }); if (new Set(q.pairs.map(p => p[1])).size !== q.pairs.length) e("ismétlődő jobb oldal"); }
    else if (q.type === "set") { if (!q.answer.every(a => q.items.includes(a))) e("set elem"); }
    else e("ismeretlen típus " + q.type);
    const txt = JSON.stringify(q);
    if (/[^\\]<(?![a-z\/])/.test(txt.replace(/\\lt/g, ""))) {/* nyers < ellenőrzés lent */}
    for (const f of [q.q, q.explain, q.hint, ...(q.options || [])]) {
      const m = (f || "").match(/\$[^$]*\$/g) || [];
      if (m.some(x => /[<>]/.test(x))) e("< vagy > KaTeX-ben: " + f.slice(0, 60));
      if (((f || "").match(/\$/g) || []).length % 2) e("páratlan $: " + f.slice(0, 60));
    }
  });
}
console.log(bad ? bad + " hiba" : "OK");
