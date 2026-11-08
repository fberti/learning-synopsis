// node qms62_validate.js <q.js> : szerkezeti ellenőrzés
const fs = require("fs"); const src = fs.readFileSync(process.argv[2], "utf8");
const Q = new Function("const R=String.raw; return {" + src + "};")();
let err = 0; const e = m => { err++; console.log("HIBA:", m); };
for (const [id, qz] of Object.entries(Q)) {
  console.log(id, qz.questions.length, "kérdés");
  qz.questions.forEach((q, i) => {
    const t = `${id}#${i + 1}`;
    if (!q.hint) e(t + " hint"); if (!q.explain) e(t + " explain");
    if (q.type === "numeric") e(t + " numeric");
    if (q.type === "single") { if (!(q.answer >= 0 && q.answer < q.options.length)) e(t + " answer"); if (!q.shuffle) e(t + " shuffle"); if (q.options.length !== 4) console.log("  (", t, q.options.length, "opció)"); }
    if (q.type === "multi") { if (!Array.isArray(q.answer) || q.answer.some(a => a < 0 || a >= q.options.length)) e(t + " multi answer"); }
    if (q.type === "set") { if (q.answer.some(a => !q.items.includes(a))) e(t + " set answer"); }
    if (q.type === "match") { if (q.pairs.some(p => /\$/.test(p[1]))) e(t + " match jobb oldalon $"); }
    if (new Set(q.options || []).size !== (q.options || []).length) e(t + " ismétlődő opció");
  });
}
console.log(err, "hiba");
