// q2.js szerkezet- és KaTeX-ellenőrzés: node qcheck2_struct.js
const fs = require("fs"), path = require("path");
const frag = fs.readFileSync(path.join(__dirname, "q2.js"), "utf8");
fs.writeFileSync(path.join(__dirname, "qcheck2_wrapped.js"), "(function(){const R=String.raw; const Q={\n" + frag + "\n}; })();\n");
const Q = eval("(function(){const R=String.raw; return {" + frag + "}; })()");
let err = 0; const bad = m => { err++; console.log("HIBA:", m); };
for (const [id, quiz] of Object.entries(Q)) {
  console.log(id, quiz.title, quiz.questions.length, "kérdés", quiz.questions.map(q => q.type).join(","));
  quiz.questions.forEach((q, i) => {
    const t = `${id}#${i + 1}`;
    if (!q.hint) bad(t + " hint"); if (!q.explain) bad(t + " explain");
    if (!["single", "multi", "match", "set"].includes(q.type)) bad(t + " típus " + q.type);
    if (q.type === "single") {
      if (!q.shuffle) bad(t + " shuffle");
      if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) bad(t + " answer");
      if (q.options.length !== 4) console.log("  megj.:", t, q.options.length, "opció");
      if (new Set(q.options).size !== q.options.length) bad(t + " ismétlődő opció");
    }
    if (q.type === "multi") {
      if (!Array.isArray(q.answer) || q.answer.some(a => a < 0 || a >= q.options.length)) bad(t + " answer");
      if (q.options.length !== 5 || q.answer.length < 2 || q.answer.length > 3) bad(t + " multi 5/2–3");
    }
    if (q.type === "match") q.pairs.forEach(p => { if (p[1].includes("$")) bad(t + " match jobb oldal KaTeX"); });
    if (q.type === "set") q.answer.forEach(a => { if (!q.items.includes(a)) bad(t + " set"); });
    const all = [q.q, q.explain, q.hint, ...(q.options || []), ...(q.items || []), ...(q.pairs || []).flat()].join(" ");
    if (/\bmindegyik igaz\b|\begyik sem\b/i.test((q.options || []).join(" "))) bad(t + " mindegyik/egyik sem");
    if ((all.match(/\$/g) || []).length % 2) bad(t + " páratlan $");
    if (all.split("$").some((m, j) => j % 2 === 1 && m.includes("<"))) bad(t + " < KaTeX-ben");
  });
}
let katex; try { katex = require("/home/febert/.npm/_npx/99796abb73e00ec2/node_modules/katex"); } catch (e) { console.log("katex nem elérhető"); }
if (katex) {
  let n = 0;
  for (const [id, quiz] of Object.entries(Q)) quiz.questions.forEach((q, i) => {
    const all = [q.q, q.hint, q.explain, ...(q.options || []), ...(q.items || []), ...(q.pairs || []).flat()].join(" ");
    all.split("$").forEach((m, j) => {
      if (j % 2 === 0) return; n++;
      try { katex.renderToString(m, { throwOnError: true, strict: "ignore" }); }
      catch (e) { bad(`${id}#${i + 1} KaTeX ${JSON.stringify(m)} ${e.message}`); }
    });
  });
  console.log(n, "képlet ellenőrizve");
}
console.log(err ? err + " hiba" : "OK");
