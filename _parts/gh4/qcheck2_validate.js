const fs = require("fs"), path = require("path");
const src = fs.readFileSync(path.join(__dirname, "q2.js"), "utf8");
const wrapped = "(function(){const R=String.raw; const Q={\n" + src + "\n}; return Q; })()";
fs.writeFileSync(path.join(__dirname, "qcheck2_wrapped.js"), wrapped + ";\n");
const Q = eval(wrapped);
let ok = true; const err = m => { ok = false; console.log("ERR", m); };
for (const [id, quiz] of Object.entries(Q)) {
  console.log(id, quiz.questions.length, "kérdés");
  quiz.questions.forEach((q, i) => {
    const t = `${id}#${i + 1}`;
    if (!q.hint) err(t + " hint"); if (!q.explain) err(t + " explain");
    if (q.type === "numeric") err(t + " numeric");
    if (q.type === "single") { if (!(q.answer >= 0 && q.answer < q.options.length)) err(t + " answer"); if (!q.shuffle) err(t + " shuffle"); if (q.options.length !== 4) console.log("note", t, q.options.length, "opció"); if (new Set(q.options).size !== q.options.length) err(t + " dup"); }
    if (q.type === "multi") { if (!Array.isArray(q.answer) || q.answer.some(a => a < 0 || a >= q.options.length)) err(t + " multi answer"); if (q.answer.length < 2 || q.answer.length > 3) console.log("note", t, "helyes:", q.answer.length); }
    if (q.type === "set") { if (q.answer.some(a => !q.items.includes(a))) err(t + " set"); }
    if (q.type === "match") { q.pairs.forEach(p => { if (/\$/.test(p[1])) err(t + " KaTeX a jobb oldalon"); }); }
  });
}
console.log(ok ? "OK" : "HIBA");
