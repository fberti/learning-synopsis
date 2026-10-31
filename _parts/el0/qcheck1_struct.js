// el0-final – szerkezeti ellenőrzés: node qcheck1_struct.js
const fs = require("fs"), path = require("path");
const src = fs.readFileSync(path.join(__dirname, "q1.js"), "utf8");
const Q = new Function(`const R = String.raw; return {${src}};`)();
const errs = [];
for (const [id, quiz] of Object.entries(Q)) {
  const qs = quiz.questions, types = {};
  qs.forEach((q, i) => {
    const n = `${id} #${i + 1}`;
    types[q.type] = (types[q.type] || 0) + 1;
    if (!q.hint) errs.push(n + ": nincs hint");
    if (!q.explain) errs.push(n + ": nincs explain");
    if (q.type === "numeric") errs.push(n + ": numeric");
    if (q.type === "single") {
      if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) errs.push(n + ": rossz answer");
      if (!q.shuffle) errs.push(n + ": nincs shuffle");
      if (q.options.length !== 4) errs.push(n + ": nem 4 opció");
      if (new Set(q.options).size !== q.options.length) errs.push(n + ": ismétlődő opció");
    }
    if (q.type === "multi") {
      if (!Array.isArray(q.answer) || q.answer.some(a => !Number.isInteger(a) || a < 0 || a >= q.options.length)) errs.push(n + ": rossz multi answer");
      if (q.options.length !== 5 || q.answer.length < 2 || q.answer.length > 3) errs.push(n + ": multi nem 5 opció / 2–3 helyes");
    }
    if (q.type === "set" && q.answer.some(a => !q.items.includes(a))) errs.push(n + ": set answer nincs az items-ben");
    if (q.type === "match") {
      q.pairs.forEach(p => { if (p.length !== 2) errs.push(n + ": rossz pár"); if (/\$/.test(p[1])) errs.push(n + ": $ a jobb oldalon: " + p[1]); if (/</.test(p[1])) errs.push(n + ": HTML a jobb oldalon: " + p[1]); });
      if (new Set(q.pairs.map(p => p[1])).size !== q.pairs.length) errs.push(n + ": ismétlődő jobb oldal");
    }
    // KaTeX: páratlan számú $ jel (a <code>-on kívül) gyanús
    for (const f of [q.q, q.explain, q.hint, ...(q.options || []), ...(q.pairs || []).flat()]) {
      const t = String(f).replace(/<code>[\s\S]*?<\/code>/g, "");
      if ((t.match(/\$/g) || []).length % 2) errs.push(n + ": páratlan $: " + t.slice(0, 60));
      const segs = t.split("$").filter((_, k) => k % 2 === 1);   // a $…$ közötti részek
      if (segs.some(m => m.includes("<"))) errs.push(n + ": '<' a KaTeX-ben");
    }
  });
  console.log(id, "–", quiz.title, "–", qs.length, "kérdés", JSON.stringify(types));
}
console.log(errs.length ? errs.join("\n") : "OK – nincs hiba");
