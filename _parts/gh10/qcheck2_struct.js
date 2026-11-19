// q2.js szerkezeti + KaTeX + xref ellenőrzés: node qcheck2_struct.js
const fs = require("fs"), path = require("path");
const katex = require("/home/febert/.npm/_npx/99796abb73e00ec2/node_modules/katex");
const frag = fs.readFileSync(path.join(__dirname, "q2.js"), "utf8");
fs.writeFileSync(path.join(__dirname, "qcheck2_wrapped.js"), "(function(){const R=String.raw; const Q={\n" + frag + "\n}; })();\n");
const Q = eval("(function(){const R=String.raw; return {" + frag + "}; })()");
const ids = new Set();
for (const f of fs.readdirSync(__dirname).filter(f => /^\d\d-.*\.html$/.test(f)))
  for (const m of fs.readFileSync(path.join(__dirname, f), "utf8").matchAll(/id="([^"]+)"/g)) ids.add(m[1]);
let errs = 0, nk = 0; const err = (id, i, m) => { errs++; console.log("HIBA", id, i + 1, m); };
for (const [id, quiz] of Object.entries(Q)) {
  console.log(id, quiz.questions.length, "kérdés:", quiz.questions.map(q => q.type).join(","));
  quiz.questions.forEach((q, i) => {
    if (!q.hint || !q.explain) err(id, i, "hint/explain");
    if (q.type === "numeric") err(id, i, "numeric");
    if (q.type === "single") { if (!q.shuffle) err(id, i, "shuffle"); if (!(q.answer >= 0 && q.answer < q.options.length)) err(id, i, "answer"); if (q.options.length !== 4) err(id, i, "4 opció"); }
    if (q.type === "multi") { if (!Array.isArray(q.answer) || q.answer.some(a => a < 0 || a >= q.options.length)) err(id, i, "multi answer"); if (q.answer.length < 2 || q.answer.length > 3 || q.options.length !== 5) err(id, i, "multi 2–3/5"); }
    if (q.type === "set" && q.answer.some(a => !q.items.includes(a))) err(id, i, "set answer");
    if (q.type === "match" && q.pairs.some(p => p[1].includes("$"))) err(id, i, "match jobb oldal KaTeX");
    const opts = [...(q.options || []), ...(q.items || []), ...(q.pairs || []).flat()];
    if (opts.some(o => /<a /.test(o))) err(id, i, "link opcióban");
    if (new Set(opts).size !== opts.length) err(id, i, "ismétlődő opció");
    const all = [q.q, q.hint, q.explain, ...opts].join(" ");
    for (const m of all.matchAll(/href="([^"]*)"/g)) { const h = m[1]; if (h.startsWith("#") && !ids.has(h.slice(1))) err(id, i, "rossz horgony " + h); if (!/class="xref"/.test(all)) err(id, i, "nem xref"); }
    if (/\b(lásd|láttuk|korábban)\b/i.test(all.replace(/<a [^>]*>.*?<\/a>/g, ""))) console.log("  ? utalás", id, i + 1);
    all.split("$").forEach((m, j) => { if (j % 2 && m.includes("<")) err(id, i, "< KaTeX-ben"); });
    all.split("$").forEach((m, j) => { if (j % 2 === 0) return; nk++;
      try { katex.renderToString(m, { throwOnError: true, strict: "ignore" }); } catch (e) { err(id, i, "KaTeX " + JSON.stringify(m) + " " + e.message); } });
  });
}
console.log(nk, "képlet,", errs, "hiba");
