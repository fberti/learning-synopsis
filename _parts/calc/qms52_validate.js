// Validate _parts/ms5/q2.js: syntax, hints, explains, answer indices, no numeric
const fs = require("fs"), path = require("path");
const src = fs.readFileSync(path.join(__dirname, "../ms5/q2.js"), "utf8");
const Q = new Function("const R=String.raw; return {" + src + "};")();
let bad = 0;
for (const [id, quiz] of Object.entries(Q)) {
  console.log(id, quiz.questions.length, quiz.title);
  quiz.questions.forEach((q, i) => {
    const err = m => { bad++; console.log("  ERR", id, i, m); };
    if (!q.hint) err("no hint"); if (!q.explain) err("no explain");
    if (q.type === "numeric") err("numeric");
    if (q.type === "single") { if (!(q.answer >= 0 && q.answer < q.options.length)) err("answer"); if (!q.shuffle) err("noshuffle");
      if (new Set(q.options).size !== q.options.length) err("dup"); }
    if (q.type === "multi") { if (!Array.isArray(q.answer) || q.answer.some(a => a < 0 || a >= q.options.length)) err("answer"); }
    if (q.type === "set") { if (q.answer.some(a => !q.items.includes(a))) err("set"); }
    if (q.type === "match") { if (q.pairs.some(p => /\$/.test(p[1]))) err("katex right"); if (new Set(q.pairs.map(p=>p[1])).size !== q.pairs.length) err("dup right"); }
  });
}
console.log(bad ? "FAIL " + bad : "OK");
