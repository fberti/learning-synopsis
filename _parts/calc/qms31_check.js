// q1.js töredék szerkezeti ellenőrzése: node calc/qms31_check.js ms3/q1.js
const fs = require("fs");
const src = fs.readFileSync(process.argv[2], "utf8");
const Q = new Function("const R=String.raw; return {" + src + "};")();
let bad = 0;
for (const [id, qz] of Object.entries(Q)) {
  console.log(id, qz.title, qz.questions.length, "kérdés");
  qz.questions.forEach((q, i) => {
    const err = m => { bad++; console.log("  HIBA", id, i + 1, m); };
    if (!q.hint) err("nincs hint");
    if (!q.explain) err("nincs explain");
    if (q.type === "numeric") err("numeric");
    if (!["single", "multi", "match", "set"].includes(q.type)) err("típus " + q.type);
    if (q.type === "single") {
      if (!q.shuffle) err("single shuffle nélkül");
      if (!(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length)) err("answer index");
      if (new Set(q.options).size !== q.options.length) err("ismétlődő opció");
    }
    if (q.type === "multi") {
      if (!Array.isArray(q.answer) || q.answer.some(a => !(a >= 0 && a < q.options.length))) err("multi index");
      if (q.answer.length < 2 || q.answer.length > 3 || q.options.length !== 5) err("multi 2-3/5");
    }
    if (q.type === "set") q.answer.forEach(a => { if (!q.items.includes(a)) err("set elem: " + a); });
    if (q.type === "match") q.pairs.forEach(p => { if (/\$|\\/.test(p[1])) err("KaTeX a jobb oldalon: " + p[1]); });
    const all = JSON.stringify(q);
    if (/[^\\]<(?![a-z\/])/i.test(all.replace(/\\u003c/g, ""))) err("nyers < jel");
  });
}
console.log(bad ? bad + " hiba" : "OK");
