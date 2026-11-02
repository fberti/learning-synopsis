// Kvíz gh6-61..63 – szerkezeti ellenőrzés: node qcheck1_struct.js
const fs = require("fs"), path = require("path");
const frag = fs.readFileSync(path.join(__dirname, "q1.js"), "utf8");
const src = "(function(){const R=String.raw; const Q={\n" + frag + "\n}; return Q; })()";
fs.writeFileSync(path.join(__dirname, "qcheck1_wrapped.js"), src + ";\n");
const Q = eval(src);
let bad = 0; const err = m => { bad++; console.log("HIBA:", m); };
for (const [id, quiz] of Object.entries(Q)) {
  if (!quiz.title) err(id + " title");
  const types = {};
  quiz.questions.forEach((q, i) => {
    const w = `${id}#${i + 1}`;
    types[q.type] = (types[q.type] || 0) + 1;
    if (!q.hint || !q.explain || !q.q) err(w + " hint/explain/q hiányzik");
    if (q.type === "numeric") err(w + " numeric");
    if (q.type === "single") {
      if (!q.shuffle) err(w + " shuffle");
      if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) err(w + " answer");
      if (new Set(q.options).size !== q.options.length) err(w + " ismétlődő opció");
    } else if (q.type === "multi") {
      if (!Array.isArray(q.answer) || q.answer.some(a => !Number.isInteger(a) || a < 0 || a >= q.options.length)) err(w + " answer");
      if (q.options.length !== 5 || q.answer.length < 2 || q.answer.length > 3) err(w + " multi 5 opció / 2–3 helyes");
    } else if (q.type === "set") {
      if (q.answer.some(a => !q.items.includes(a))) err(w + " set answer nincs az items-ben");
    } else if (q.type === "match") {
      if (q.pairs.some(p => /\$/.test(p[1]))) err(w + " KaTeX a jobb oldalon");
      if (new Set(q.pairs.map(p => p[1])).size !== q.pairs.length) err(w + " ismétlődő jobb oldal");
    } else err(w + " ismeretlen típus " + q.type);
    const all = [q.q, q.hint, q.explain, ...(q.options || []), ...(q.items || []), ...(q.pairs || []).flat()].join(" ");
    const math = all.split("$").filter((_, j) => j % 2 === 1);
    if (math.some(m => m.includes("<"))) err(w + " '<' KaTeX-ben");
    if (math.some(m => /\d\.\d/.test(m))) err(w + " tizedespont KaTeX-ben");
    if (((all.match(/\$/g) || []).length) % 2) err(w + " páratlan számú $");
  });
  console.log(id, quiz.questions.length, "kérdés", JSON.stringify(types));
}
console.log(bad ? bad + " hiba" : "OK");
