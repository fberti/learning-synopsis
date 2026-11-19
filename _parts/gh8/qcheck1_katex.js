// KaTeX-parse ellenőrzés a q1.js minden $…$ szakaszára: node qcheck1_katex.js
const fs = require("fs"), path = require("path");
const katex = require("/home/febert/.npm/_npx/99796abb73e00ec2/node_modules/katex");
const frag = fs.readFileSync(path.join(__dirname, "q1.js"), "utf8");
const Q = eval("(function(){const R=String.raw; return {" + frag + "}; })()");
let n = 0, bad = 0;
for (const [id, quiz] of Object.entries(Q)) quiz.questions.forEach((q, i) => {
  const all = [q.q, q.hint, q.explain, ...(q.options || []), ...(q.items || []), ...(q.pairs || []).flat()].join(" ");
  all.split("$").forEach((m, j) => {
    if (j % 2 === 0) return; n++;
    try { katex.renderToString(m, { throwOnError: true, strict: "ignore" }); }
    catch (e) { bad++; console.log(id, i + 1, JSON.stringify(m), e.message); }
  });
});
console.log(n, "képlet,", bad, "hiba");
