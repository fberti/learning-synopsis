// Validates q1.js: syntax, hint/explain, answer indices, set items, no numeric
const fs = require("fs"), path = require("path");
const src = fs.readFileSync(path.join(__dirname, "q1.js"), "utf8");
const Q = new Function("const R=String.raw; return {" + src + "};")();
let n = 0, bad = 0;
for (const [id, quiz] of Object.entries(Q)) {
  console.log(id, quiz.title, quiz.questions.length, "kérdés");
  quiz.questions.forEach((q, i) => {
    n++;
    const err = m => { bad++; console.log("  HIBA", id, i + 1, m); };
    if (!q.hint) err("nincs hint");
    if (!q.explain) err("nincs explain");
    if (q.type === "numeric") err("numeric");
    if (q.type === "single") {
      if (!q.shuffle) err("nincs shuffle");
      if (!(q.answer >= 0 && q.answer < q.options.length)) err("rossz answer");
      if (new Set(q.options).size !== q.options.length) err("ismétlődő opció");
    } else if (q.type === "multi") {
      if (!q.answer.every(a => a >= 0 && a < q.options.length)) err("rossz answer");
      if (q.answer.length < 2 || q.answer.length > 3 || q.options.length !== 5) err("multi 2-3/5");
    } else if (q.type === "set") {
      if (!q.answer.every(a => q.items.includes(a))) err("set answer nincs az items-ben");
    } else if (q.type === "match") {
      if (q.pairs.some(p => /\$/.test(p[1]))) err("KaTeX a jobb oldalon");
      if (new Set(q.pairs.map(p => p[1])).size !== q.pairs.length) err("ismétlődő jobb oldal");
    } else err("ismeretlen típus " + q.type);
  });
}
console.log(n, "kérdés,", bad, "hiba");
