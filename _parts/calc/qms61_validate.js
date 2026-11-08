// ms6 q1.js szerkezeti ellenőrzése: node qms61_validate.js <q1.js>
const fs = require("fs");
const src = fs.readFileSync(process.argv[2], "utf8");
const Q = new Function("const R=String.raw; return {" + src + "};")();
let err = 0; const bad = m => { err++; console.log("HIBA:", m); };
for (const [id, quiz] of Object.entries(Q)) {
  console.log(id, quiz.questions.length, "kérdés");
  quiz.questions.forEach((q, i) => {
    const t = `${id}#${i + 1}`;
    if (!q.hint) bad(t + " hint"); if (!q.explain) bad(t + " explain");
    if (q.type === "numeric") bad(t + " numeric");
    if (q.type === "single") { if (!(q.answer >= 0 && q.answer < q.options.length)) bad(t + " answer"); if (!q.shuffle) bad(t + " shuffle");
      if (new Set(q.options).size !== q.options.length) bad(t + " dupl"); }
    if (q.type === "multi") { if (!q.answer.every(a => a >= 0 && a < q.options.length)) bad(t + " answer"); if (q.answer.length < 2 || q.answer.length > 3) bad(t + " multi db"); }
    if (q.type === "set") { if (!q.answer.every(a => q.items.includes(a))) bad(t + " set"); }
    if (q.type === "match") { const r = q.pairs.map(p => p[1]); if (r.some(x => x.includes("$"))) bad(t + " match KaTeX"); if (new Set(r).size !== r.length) bad(t + " match dupl"); }
  });
}
console.log(err, "hiba");
