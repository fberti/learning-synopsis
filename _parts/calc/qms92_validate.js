// q2.js (ms9) szerkezeti, KaTeX- és xref-ellenőrzése: node qms92_validate.js
const fs = require("fs"), path = require("path");
const src = fs.readFileSync(__dirname + "/../ms9/q2.js", "utf8");
new Function("(function(){const R=String.raw; const Q={" + src + "}; })();"); // szintaxis
const Q = new Function("const R = String.raw; return {" + src + "};")();
const katex = require(__dirname + "/qan42_katex/node_modules/katex");
const html = ["00-head","01-s91","02-s92","03-s93","04-s94","05-s95","06-s96","07-s97","08-s98","10-end"].map(f => fs.readFileSync(__dirname + "/../ms9/" + f + ".html", "utf8")).join("\n");
const ids = new Set([...html.matchAll(/id="([^"]+)"/g)].map(m => m[1]));
let bad = 0, nk = 0;
const err = (id, i, m) => { bad++; console.log("  HIBA", id, i + 1, m); };
for (const [id, quiz] of Object.entries(Q)) {
  const types = {};
  quiz.questions.forEach((q, i) => {
    types[q.type] = (types[q.type] || 0) + 1;
    const e = m => err(id, i, m);
    if (!q.hint) e("nincs hint"); if (!q.explain) e("nincs explain");
    if (q.type === "single") { if (!(q.answer >= 0 && q.answer < q.options.length)) e("answer index"); if (!q.shuffle) e("shuffle"); if (q.options.length !== 4) e("nem 4 opció"); if (new Set(q.options).size !== 4) e("ismétlődő opció"); }
    else if (q.type === "multi") { if (!q.answer.every(a => a >= 0 && a < q.options.length)) e("multi index"); if (q.answer.length < 2 || q.answer.length > 3 || q.options.length !== 5) e("multi 2–3/5"); }
    else if (q.type === "match") { q.pairs.forEach(p => { if (/\$|<a/.test(p[1])) e("KaTeX/link a jobb oldalon"); }); if (new Set(q.pairs.map(p => p[1])).size !== q.pairs.length) e("ismétlődő jobb oldal"); }
    else if (q.type === "set") { if (!q.answer.every(a => q.items.includes(a))) e("set elem"); }
    else e("tiltott/ismeretlen típus " + q.type);
    const opts = [...(q.options || []), ...(q.items || []), ...((q.pairs || []).flat())];
    if (opts.some(o => /<a /.test(o))) e("link válaszopcióban");
    for (const f of [q.q, q.explain, q.hint, ...opts]) {
      const s = f || "";
      if ((s.match(/\$/g) || []).length % 2) e("páratlan $: " + s.slice(0, 60));
      for (const m of s.matchAll(/\$([^$]+?)\$/g)) {
        nk++; if (/[<>]/.test(m[1])) e("< vagy > KaTeX-ben: " + m[1]);
        try { katex.renderToString(m[1], { throwOnError: true }); } catch (x) { e("KaTeX: " + m[1] + " → " + x.message); }
      }
      for (const m of s.matchAll(/href="([^"]*)"/g)) {
        const [file, hash] = m[1].split("#");
        if (!file) { if (!ids.has(hash)) e("hiányzó id: " + hash); }
        else { const fp = path.join(__dirname, "../../matematikai-statisztika/09-x/", file, "index.html");
          const t = path.resolve(__dirname, "../../matematikai-statisztika", file.replace("../", ""), "index.html");
          if (!fs.existsSync(t)) e("hiányzó fájl: " + t); else if (hash && !fs.readFileSync(t, "utf8").includes('id="' + hash + '"')) e("hiányzó id " + m[1]); }
      }
      if (/<a (?!class="xref")/.test(s)) e("xref osztály nélküli link");
    }
  });
  console.log(id, "–", quiz.questions.length, "kérdés", JSON.stringify(types));
}
console.log(nk, "KaTeX-kifejezés;", bad ? bad + " hiba" : "OK");
