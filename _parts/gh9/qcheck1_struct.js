// Szerkezeti ellenőrzés: node qcheck1_struct.js
const fs = require("fs"), path = require("path");
const frag = fs.readFileSync(path.join(__dirname, "q1.js"), "utf8");
const Q = eval("(function(){const R=String.raw; return {" + frag + "}; })()");
let bad = 0;
for (const [id, quiz] of Object.entries(Q)) {
  console.log(id, quiz.title, quiz.questions.length);
  quiz.questions.forEach((q, i) => {
    const err = m => { bad++; console.log("  HIBA", id, i + 1, m); };
    if (!q.hint) err("hint"); if (!q.explain) err("explain");
    if (q.type === "numeric") err("numeric");
    if (q.type === "single") { if (!(q.answer >= 0 && q.answer < q.options.length)) err("answer"); if (!q.shuffle) err("shuffle"); if (q.options.length !== 4) err("4 opció?"); if (new Set(q.options).size !== q.options.length) err("dup"); }
    if (q.type === "multi") { if (!Array.isArray(q.answer) || q.answer.some(a => a < 0 || a >= q.options.length)) err("answer"); if (q.answer.length < 2 || q.answer.length > 3) err("2-3 helyes"); }
    if (q.type === "set" && q.answer.some(a => !q.items.includes(a))) err("set answer");
    if (q.type === "match" && q.pairs.some(p => p[1].includes("$"))) err("match KaTeX");
  });
}
console.log(bad, "hiba");
