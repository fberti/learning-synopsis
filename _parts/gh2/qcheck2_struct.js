// Szerkezeti ellenőrzés a q2.js töredékre: node qcheck2_struct.js
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "q2.js"), "utf8");
if (/\$\{/.test(src)) console.log("FIGYELEM: ${ a szövegben (template-interpoláció)!");
const Q = new Function(`const R=String.raw; return {${src}};`)();
let bad = 0;
for (const [id, quiz] of Object.entries(Q)) {
  console.log(id, quiz.questions.length, "kérdés", quiz.title);
  quiz.questions.forEach((q, i) => {
    const err = m => { bad++; console.log("  HIBA", id, i + 1, m); };
    if (!q.hint) err("nincs hint");
    if (!q.explain) err("nincs explain");
    if (q.type === "numeric") err("numeric");
    if (q.type === "single") {
      if (!(q.answer >= 0 && q.answer < q.options.length)) err("rossz answer");
      if (!q.shuffle) err("nincs shuffle");
      if (new Set(q.options).size !== q.options.length) err("ismétlődő opció");
    } else if (q.type === "multi") {
      if (!Array.isArray(q.answer) || q.answer.some(a => a < 0 || a >= q.options.length)) err("rossz multi answer");
      if (q.answer.length < 2 || q.answer.length > 3 || q.options.length !== 5) err("multi: 2–3 helyes / 5 opció");
    } else if (q.type === "set") {
      if (q.answer.some(a => !q.items.includes(a))) err("set answer nincs az items között");
    } else if (q.type === "match") {
      if (q.pairs.some(p => /\$/.test(p[1]))) err("KaTeX a match jobb oldalán");
    } else err("ismeretlen típus " + q.type);
  });
}
console.log(bad ? `${bad} hiba` : "OK");
