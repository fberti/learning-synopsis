// q2.js szerkezeti ellenőrzése: node qcheck2_struct.js
const fs = require("fs"), vm = require("vm");
const src = fs.readFileSync(__dirname + "/q2.js", "utf8");
fs.writeFileSync(__dirname + "/qcheck2_wrap.js", "(function(){const R=String.raw; const Q={\n" + src + "\n}; })();\n");
const Q = vm.runInNewContext("(function(){const R=String.raw; return {" + src + "};})()");
let bad = 0;
for (const [id, quiz] of Object.entries(Q)) {
  console.log(id, quiz.questions.length, "kérdés", quiz.questions.map(q => q.type).join(","));
  quiz.questions.forEach((q, i) => {
    const e = m => { bad++; console.log("  HIBA", id, i + 1, m); };
    if (!q.hint) e("nincs hint"); if (!q.explain) e("nincs explain"); if (!q.q) e("nincs q");
    if (!["single", "multi", "match", "set"].includes(q.type)) e("típus " + q.type);
    if (q.type === "single") { if (!q.shuffle) e("shuffle"); if (!(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length)) e("answer"); if (q.options.length !== 4) e("opciók száma " + q.options.length); if (new Set(q.options).size !== q.options.length) e("ismétlődő opció"); }
    if (q.type === "multi") { if (!q.answer.every(a => a >= 0 && a < q.options.length)) e("answer"); if (q.answer.length < 2 || q.answer.length > 3 || q.options.length !== 5) e("multi helyesek / opciók száma"); }
    if (q.type === "set" && !q.answer.every(a => q.items.includes(a))) e("set answer");
    if (q.type === "match") { if (q.pairs.some(p => /\$/.test(p[1]))) e("KaTeX a jobb oldalon"); if (new Set(q.pairs.map(p => p[1])).size !== q.pairs.length) e("ismétlődő jobb oldal"); }
    const all = JSON.stringify(q);
    for (const m of all.match(/\$[^$]*\$/g) || []) if (/</.test(m)) e("< KaTeX-ben: " + m);
    if ((all.match(/\$/g) || []).length % 2) e("páratlan $");
    if (/mindegyik igaz|egyik sem/i.test(JSON.stringify(q.options || q.items || []))) e("mindegyik/egyik sem opció?");
    if (/\d\.\d/.test(all.replace(/\d\.\s/g, ""))) e("tizedespont? " + all.match(/.{10}\d\.\d.{10}/));
  });
}
console.log(bad ? bad + " hiba" : "OK");
