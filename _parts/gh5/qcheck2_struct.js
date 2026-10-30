// q2.js szerkezeti ellenőrzése: node qcheck2_struct.js
const fs = require("fs"), vm = require("vm");
const src = fs.readFileSync(__dirname + "/q2.js", "utf8");
const Q = vm.runInNewContext("(function(){const R=String.raw; return {" + src + "};})()");
let bad = 0;
for (const [id, quiz] of Object.entries(Q)) {
  console.log(id, quiz.questions.length, "kérdés");
  quiz.questions.forEach((q, i) => {
    const e = m => { bad++; console.log("  HIBA", id, i + 1, m); };
    if (!q.hint) e("nincs hint"); if (!q.explain) e("nincs explain");
    if (q.type === "numeric") e("numeric");
    if (q.type === "single") { if (!(q.answer >= 0 && q.answer < q.options.length)) e("answer"); if (q.options.length !== 4) e("opciók száma " + q.options.length); if (new Set(q.options).size !== q.options.length) e("ismétlődő opció"); }
    if (q.type === "multi") { if (!q.answer.every(a => a >= 0 && a < q.options.length)) e("answer"); if (q.answer.length < 2 || q.answer.length > 3) e("multi helyesek száma"); }
    if (q.type === "set" && !q.answer.every(a => q.items.includes(a))) e("set answer");
    if (q.type === "match") { if (q.pairs.some(p => /\$/.test(p[1]))) e("KaTeX a jobb oldalon"); if (new Set(q.pairs.map(p => p[1])).size !== q.pairs.length) e("ismétlődő jobb oldal"); }
    const all = JSON.stringify(q); if (/\$[^$]*<[^$]*\$/.test(all.replace(/<\/?b>|<\/?i>|<\/?em>/g, ""))) e("< KaTeX-ben?");
    if ((all.match(/\$/g) || []).length % 2) e("páratlan $");
  });
}
console.log(bad ? bad + " hiba" : "OK");
