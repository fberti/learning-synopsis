// node: a w2.js polinom-segédeinek gyors próbája
const fs = require("fs");
const src = fs.readFileSync(__dirname + "/../an3/w2.js", "utf8");
const start = src.indexOf("const w2ev"), end = src.indexOf("function w2parseCoefs");
const texNum = x => String(x);
eval(src.slice(start, end) + ";globalThis.R={w2dk,w2realRoots};");
for (const p of [[1,-3,3,-1],[1,-2,1],[1,-4,6,-4,1],[1,0,-1],[1,0,1],[1,-2,1,0],[1,0,0,0]]) {
  console.log(JSON.stringify(p), JSON.stringify(R.w2dk(p).map(z=>z.map(v=>+v.toExponential(4)))), JSON.stringify(R.w2realRoots(p)));
}
