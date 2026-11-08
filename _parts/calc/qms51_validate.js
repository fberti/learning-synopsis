// ms5 q1.js töredék ellenőrzése: node qms51_validate.js
const fs = require("fs"), path = require("path");
const src = fs.readFileSync(path.join(__dirname, "../ms5/q1.js"), "utf8");
const Q = new Function("const R=String.raw; return {" + src + "};")();
let bad = 0;
for (const [id, quiz] of Object.entries(Q)) {
  console.log(id, quiz.questions.length, "kérdés");
  quiz.questions.forEach((q, i) => {
    const err = m => { bad++; console.log("  HIBA", id, i + 1, m); };
    if (!q.hint) err("nincs hint"); if (!q.explain) err("nincs explain");
    if (q.type === "numeric") err("numeric");
    if (q.type === "single") { if (!(q.answer >= 0 && q.answer < q.options.length)) err("answer"); if (!q.shuffle) err("shuffle");
      if (q.options.length !== 4) console.log("  (", id, i + 1, "opciók:", q.options.length, ")"); }
    if (q.type === "multi") { if (!Array.isArray(q.answer) || q.answer.some(a => a < 0 || a >= q.options.length)) err("answer");
      if (q.answer.length < 2 || q.answer.length > 3 || q.options.length !== 5) err("multi 2-3/5"); }
    if (q.type === "set" && q.answer.some(a => !q.items.includes(a))) err("set");
    if (q.type === "match") q.pairs.forEach(p => { if (/\$/.test(p[1])) err("KaTeX a jobb oldalon"); });
    if (q.options && new Set(q.options).size !== q.options.length) err("ismétlődő opció");
  });
}
console.log(bad ? bad + " hiba" : "OK");
