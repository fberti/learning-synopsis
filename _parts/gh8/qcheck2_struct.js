// q2.js szerkezet + KaTeX ellenőrzés: node qcheck2_struct.js
const fs = require("fs"), path = require("path");
const katex = require("/home/febert/.npm/_npx/99796abb73e00ec2/node_modules/katex");
const frag = fs.readFileSync(path.join(__dirname, "q2.js"), "utf8");
const Q = eval("(function(){const R=String.raw; return {" + frag + "}; })()");
let bad = 0, nk = 0;
const err = (...a) => { bad++; console.log("HIBA", ...a); };
for (const [id, quiz] of Object.entries(Q)) {
  console.log(id, quiz.questions.length, "kérdés");
  quiz.questions.forEach((q, i) => {
    const t = `${id} #${i + 1}`;
    if (!q.hint) err(t, "nincs hint"); if (!q.explain) err(t, "nincs explain");
    if (!["single", "multi", "match", "set"].includes(q.type)) err(t, "típus", q.type);
    if (q.type === "single") { if (!q.shuffle) err(t, "shuffle"); if (!(q.answer >= 0 && q.answer < q.options.length)) err(t, "answer"); }
    if (q.type === "multi") { if (q.options.length !== 5 || q.answer.length < 2 || q.answer.length > 3 || q.answer.some(a => a < 0 || a >= q.options.length)) err(t, "multi"); }
    if (q.type === "match") q.pairs.forEach(p => { if (p[1].includes("$")) err(t, "KaTeX a jobb oldalon"); });
    if (q.type === "set") q.answer.forEach(a => { if (!q.items.includes(a)) err(t, "set answer"); });
    const opts = q.options || []; if (new Set(opts).size !== opts.length) err(t, "ismétlődő opció");
    const all = [q.q, q.hint, q.explain, ...opts, ...(q.items || []), ...(q.pairs || []).flat()].join(" ");
    if (/\$\$/.test(all)) err(t, "$$");
    if ((all.match(/\$/g) || []).length % 2) err(t, "páratlan $");
    all.split("$").forEach((m, j) => {
      if (j % 2 === 0) { if (/</.test(m.replace(/<\/?b>/g, ""))) err(t, "< a szövegben", m.slice(0, 40)); return; }
      nk++; if (/</.test(m)) err(t, "< KaTeX-ben", m);
      try { katex.renderToString(m, { throwOnError: true, strict: "ignore" }); } catch (e) { err(t, JSON.stringify(m), e.message); }
    });
  });
}
console.log(nk, "képlet;", bad, "hiba");
