// q2.js minden $…$ kifejezésének KaTeX-próbája: node qms3_2_katex.js <q2.js> <katex-útvonal>
const fs = require("fs"); const katex = require(process.argv[3]);
const src = fs.readFileSync(process.argv[2], "utf8");
const Q = new Function("const R=String.raw; return {" + src + "};")();
let n = 0, bad = 0;
const walk = v => { if (typeof v === "string") check(v); else if (v && typeof v === "object") Object.values(v).forEach(walk); };
function check(s) {
  const re = /\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g; let m;
  while ((m = re.exec(s))) { n++; const tex = m[1] || m[2];
    try { katex.renderToString(tex, { throwOnError: true, displayMode: !!m[1] }); }
    catch (e) { bad++; console.log("HIBA:", tex, "→", e.message); } }
}
walk(Q); console.log(n, "kifejezés,", bad, "hiba");
