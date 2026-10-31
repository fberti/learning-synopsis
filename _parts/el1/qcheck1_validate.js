// Ellenőrzés: q1.js szerkezete (node qcheck1_validate.js)
const fs = require("fs"), path = require("path");
const src = fs.readFileSync(path.join(__dirname, "q1.js"), "utf8");
const Q = new Function("const R = String.raw; return {" + src + "};")();
let bad = 0;
const err = m => { bad++; console.log("HIBA:", m); };
for (const [id, quiz] of Object.entries(Q)) {
  console.log(id, "–", quiz.title, "–", quiz.questions.length, "kérdés");
  quiz.questions.forEach((q, i) => {
    const t = `${id} #${i + 1}`;
    if (!q.hint) err(t + " nincs hint");
    if (!q.explain) err(t + " nincs explain");
    if (q.type === "numeric") err(t + " numeric");
    if (q.type === "single") {
      if (!q.shuffle) err(t + " shuffle hiányzik");
      if (!(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length)) err(t + " answer index");
      if (q.options.length !== 4) console.log("  megj.:", t, q.options.length, "opció");
      if (new Set(q.options).size !== q.options.length) err(t + " ismétlődő opció");
    } else if (q.type === "multi") {
      if (!Array.isArray(q.answer) || q.answer.some(a => a < 0 || a >= q.options.length)) err(t + " multi answer");
      console.log("  multi:", t, q.answer.length, "helyes /", q.options.length);
    } else if (q.type === "match") {
      q.pairs.forEach(p => { if (p[1].includes("$")) err(t + " match jobb oldalon $"); });
      if (new Set(q.pairs.map(p => p[1])).size !== q.pairs.length) err(t + " ismétlődő jobb oldal");
    } else if (q.type === "set") {
      q.answer.forEach(a => { if (!q.items.includes(a)) err(t + " set answer nincs items-ben"); });
    } else err(t + " ismeretlen típus " + q.type);
    // KaTeX: páros számú $
    for (const s of [q.q, q.hint, q.explain, ...(q.options || [])]) {
      const n = (String(s).match(/\$/g) || []).length;
      if (n % 2) err(t + " páratlan $: " + s.slice(0, 60));
      String(s).split("$").forEach((seg, j) => { if (j % 2 && seg.includes("<")) err(t + " '<' KaTeX-ben: " + seg); });
    }
  });
}
console.log(bad ? bad + " hiba" : "OK");
