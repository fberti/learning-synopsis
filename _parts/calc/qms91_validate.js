// node qms91_validate.js [katex-utvonal] : ms9/q1.js szintaxis-, szerkezet- es KaTeX-ellenorzese
const fs = require("fs"), path = require("path");
const src = fs.readFileSync(path.join(__dirname, "../ms9/q1.js"), "utf8");
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
    opts.forEach(o => { if (/<a /.test(o)) err(t + " link az opcióban"); });
    for (const k of ["q", "hint", "explain"]) { const s = q[k] || ""; (s.match(/href="([^"]+)"/g) || []).forEach(h => console.log("  link", t, k, h)); if (/<a (?![^>]*class="xref")/.test(s)) err(t + " xref nélküli link"); }
  });
}
if (process.argv[2]) {
  const katex = require(process.argv[2]); let n = 0;
  const walk = v => { if (typeof v === "string") check(v); else if (v && typeof v === "object") Object.values(v).forEach(walk); };
  function check(s) { const re = /\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g; let m;
    while ((m = re.exec(s))) { n++; try { katex.renderToString(m[1] || m[2], { throwOnError: true, displayMode: !!m[1] }); } catch (e) { err("KaTeX: " + (m[1] || m[2]) + " → " + e.message); } } }
  walk(Q); console.log(n, "KaTeX-kifejezés ellenőrizve");
}
console.log(bad ? bad + " hiba" : "OK");
