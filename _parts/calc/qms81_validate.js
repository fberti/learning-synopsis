// node qms81_validate.js : q1.js szintaxis- es szerkezet-ellenorzese
const fs = require("fs"), path = require("path");
const src = fs.readFileSync(path.join(__dirname, "../ms8/q1.js"), "utf8");
const Q = new Function("const R = String.raw; return {" + src + "};")();
let bad = 0; const err = m => { bad++; console.log("HIBA:", m); };
for (const [id, quiz] of Object.entries(Q)) {
  const qs = quiz.questions; console.log(id, qs.length, "kérdés", qs.map(q => q.type).join(","));
  qs.forEach((q, i) => {
    const t = `${id}#${i + 1}`;
    if (!q.hint) err(t + " hint"); if (!q.explain) err(t + " explain");
    if (q.type === "numeric") err(t + " numeric");
    if (q.type === "single") { if (!q.shuffle) err(t + " shuffle"); if (!(q.answer >= 0 && q.answer < q.options.length)) err(t + " answer"); if (q.options.length !== 4) console.log("  info:", t, q.options.length, "opció"); }
    if (q.type === "multi") { if (!Array.isArray(q.answer) || q.answer.some(a => !(a >= 0 && a < q.options.length))) err(t + " multi answer"); if (q.options.length !== 5 || q.answer.length < 2 || q.answer.length > 3) err(t + " multi 2-3/5"); }
    if (q.type === "set") q.answer.forEach(a => { if (!q.items.includes(a)) err(t + " set " + a); });
    if (q.type === "match") q.pairs.forEach(p => { if (/\$|\\/.test(p[1])) err(t + " match jobb oldal KaTeX"); });
    const opts = q.options || q.items || [];
    if (new Set(opts).size !== opts.length) err(t + " ismétlődő opció");
  });
}
console.log(bad ? bad + " hiba" : "OK");
