// q1.js szerkezeti ellenőrzése: node qms71_check.js <q1.js>
const fs = require("fs");
const src = fs.readFileSync(process.argv[2], "utf8");
const Q = new Function("const R=String.raw; return {" + src + "};")();
let bad = 0; const err = m => { bad++; console.log("HIBA:", m); };
for (const [id, quiz] of Object.entries(Q)) {
  console.log(id, quiz.questions.length, "kérdés", quiz.questions.map(q => q.type).join(","));
  quiz.questions.forEach((q, i) => {
    const t = `${id}#${i + 1}`;
    if (!q.hint) err(t + " hint"); if (!q.explain) err(t + " explain");
    if (q.type === "numeric") err(t + " numeric");
    if (q.type === "single") { if (!q.shuffle) err(t + " shuffle"); if (!(q.answer >= 0 && q.answer < q.options.length)) err(t + " answer"); if (q.options.length !== 4) console.log("  megj.:", t, q.options.length, "opció"); }
    if (q.type === "multi") { if (!Array.isArray(q.answer) || q.answer.some(a => a < 0 || a >= q.options.length)) err(t + " multi answer"); }
    if (q.type === "set") { if (q.answer.some(a => !q.items.includes(a))) err(t + " set"); }
    if (q.type === "match") { q.pairs.forEach(p => { if (p[1].includes("$")) err(t + " match jobb oldal KaTeX"); });
      if (new Set(q.pairs.map(p => p[1])).size !== q.pairs.length) err(t + " match ismétlődő jobb oldal"); }
  });
}
console.log(bad, "hiba");
