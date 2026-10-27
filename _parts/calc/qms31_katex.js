// KaTeX-hibák keresése a q1.js minden $…$ kifejezésében: node calc/qms31_katex.js ms3/q1.js (katex npm csomag kell)
const fs = require("fs"), katex = require("katex");
const src = fs.readFileSync(process.argv[2], "utf8");
const Q = new Function("const R=String.raw; return {" + src + "};")();
let n = 0, bad = 0;
const scan = s => { if (typeof s !== "string") return; for (const m of s.matchAll(/\$([^$]+)\$/g)) { n++;
  try { katex.renderToString(m[1], { throwOnError: true, macros: {} }); } catch (e) { bad++; console.log("HIBA:", m[1], e.message); } } };
const walk = o => { if (Array.isArray(o)) o.forEach(walk); else if (o && typeof o === "object") Object.values(o).forEach(walk); else scan(o); };
walk(Q); console.log(n, "képlet,", bad, "hiba");
