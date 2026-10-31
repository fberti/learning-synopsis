// q2.js szerkezeti ellenőrzése: node qcheck2_validate.js
const fs = require("fs"), path = require("path");
const src = fs.readFileSync(path.join(__dirname, "q2.js"), "utf8");
const Q = new Function("const R=String.raw; return {" + src + "};")();
let bad = 0;
const err = (id, i, m) => { bad++; console.log(`HIBA ${id} #${i + 1}: ${m}`); };
for (const [id, quiz] of Object.entries(Q)) {
  if (!quiz.title) err(id, -1, "nincs title");
  quiz.questions.forEach((q, i) => {
    if (!q.hint) err(id, i, "nincs hint");
    if (!q.explain) err(id, i, "nincs explain");
    if (!q.q) err(id, i, "nincs kérdés");
    if (q.type === "numeric") err(id, i, "numeric tilos");
    if (q.type === "single") {
      if (!q.shuffle) err(id, i, "single shuffle nélkül");
      if (!(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length)) err(id, i, "rossz answer index");
      if (new Set(q.options).size !== q.options.length) err(id, i, "ismétlődő opció");
    } else if (q.type === "multi") {
      if (!Array.isArray(q.answer) || q.answer.some(a => !(a >= 0 && a < q.options.length))) err(id, i, "rossz multi answer");
      if (q.answer.length < 2 || q.answer.length > 3) err(id, i, "multi: nem 2–3 helyes");
    } else if (q.type === "match") {
      q.pairs.forEach(([l, r]) => { if (r.includes("$")) err(id, i, "match jobb oldalán $: " + r); });
      if (new Set(q.pairs.map(p => p[1])).size !== q.pairs.length) err(id, i, "ismétlődő jobb oldal");
    } else if (q.type === "set") {
      q.answer.forEach(a => { if (!q.items.includes(a)) err(id, i, "set answer nincs az items-ben: " + a); });
    } else err(id, i, "ismeretlen típus " + q.type);
  });
  const types = {}; quiz.questions.forEach(q => types[q.type] = (types[q.type] || 0) + 1);
  console.log(id, quiz.questions.length, "kérdés", JSON.stringify(types));
}
console.log(bad ? `${bad} hiba` : "OK");
