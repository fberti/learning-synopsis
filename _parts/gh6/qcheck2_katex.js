// q2.js KaTeX-ellenőrzése: NODE_PATH=<npx katex node_modules> node qcheck2_katex.js  (pl. npx -y -p katex@0.16 után ~/.npm/_npx/*/node_modules)
const fs = require("fs"), vm = require("vm");
let katex;
for (const p of (process.env.NODE_PATH || "").split(":")) { try { katex = require(p + "/katex"); break; } catch (e) {} }
if (!katex) katex = require("katex");
const src = fs.readFileSync(__dirname + "/q2.js", "utf8");
const Q = vm.runInNewContext("(function(){const R=String.raw; return {" + src + "};})()");
let n = 0, bad = 0;
const strs = [];
const walk = x => { if (typeof x === "string") strs.push(x); else if (x && typeof x === "object") Object.values(x).forEach(walk); };
walk(Q);
for (const s of strs) {
  for (const m of s.match(/\$\$[^$]+\$\$|\$[^$]+\$/g) || []) {
    const tex = m.replace(/^\$+|\$+$/g, "");
    n++;
    try { katex.renderToString(tex, { throwOnError: true, strict: "ignore" }); }
    catch (e) { bad++; console.log("HIBA:", tex, "→", e.message.slice(0, 120)); }
  }
}
console.log(n, "képlet,", bad ? bad + " hiba" : "OK");
