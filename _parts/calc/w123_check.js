// node _parts/calc/w123_check.js – a w3.js modelljeinek és paraméterszámainak ellenőrzése
const fs = require("fs"), path = require("path");
const root = path.resolve(__dirname, "../..");
global.window = global;
window.Calc = { fmt: (x, d) => x.toFixed(d) };
require(root + "/mesterseges-intelligencia/12-beagyazasok-figyelem/review-models.js");
const w0 = fs.readFileSync(root + "/_parts/ch12/w0.js", "utf8"), w3 = fs.readFileSync(root + "/_parts/ch12/w3.js", "utf8");
const test = `
const R = window.REVIEW12, MD = w3Models(R);
let worst = 0;
for (const k of W3_KEYS) {
  const diffs = R.ref.sent.map((s, i) => Math.abs(MD.run(k, s.split(" ")).logit - R.ref[k][i]));
  const m = Math.max(...diffs); worst = Math.max(worst, m);
  console.log(k.padEnd(9), "max |Δlogit| =", m.toExponential(2), " JS:", R.ref.sent.map(s => MD.run(k, s.split(" ")).logit.toFixed(4)).join(" "));
}
for (const k of ["tf", "tf_nopos"]) {
  const A = MD.run(k, R.ref.sent[0].split(" ")).att, ref = R.ref[k + "_att0"];
  let m = 0; ref.forEach((H, a) => H.forEach((row, i) => row.forEach((v, j) => { m = Math.max(m, Math.abs(v - A[a][i][j])); })));
  worst = Math.max(worst, m);
  console.log(k + " attention sentence 0 max |Δ| =", m.toExponential(2));
}
console.log("WORST", worst, worst < 1e-3 ? "OK" : "FAIL");
// tagmondatcsere: bow1, avg, tf_nopos invariáns
const a = "a film jó volt , de a vége unalmas volt".split(" "), b = "a vége unalmas volt , de a film jó volt".split(" ");
for (const k of W3_KEYS) console.log("swap", k.padEnd(9), MD.run(k, a).logit.toFixed(6), MD.run(k, b).logit.toFixed(6));
const want = { exp: 2929, bert: 109482240, gpt2s: 124439808, gpt2xl: 1557611200, gpt3: 174604259328 };
for (const [k, p] of Object.entries(W3_PRESETS)) { const P = w3Params(p); console.log(k.padEnd(7), P.total, P.total === want[k] ? "OK" : "FAIL", "block", P.block, "att", P.att, "ffn", P.ffn); }
const B = w3Params(W3_PRESETS.bert); console.log("bert parts", B.tokE, B.posE, B.segE, B.embLN, B.block, B.headP);
const G = w3Params(W3_PRESETS.gpt2s); console.log("gpt2 parts", G.tokE, G.posE, G.blocks, G.finalLN);
const E = w3Params(W3_PRESETS.exp); console.log("exp parts", E.tokE, E.posE, E.att, E.ffn, E.ln, E.headP);
console.log("gpt3 big:", w3Big(w3Params(W3_PRESETS.gpt3).total), "| gpt2:", w3Big(G.total));
// szabály + generátor: 2000 véletlen mondat, a szabály mindig ad címkét, hossz ≤ 15
let bad = 0; for (let i = 0; i < 2000; i++) { const st = w3RandReview(); if (w3Rule(st) == null || w3Tokens(st).length > 15 || (st.conn && st.c1.s === st.c2.s)) bad++; }
console.log("generator bad:", bad);
// pontosság a referencia szerinti mintán: generált mondatok, modellek vs szabály
const acc = {}; for (const k of W3_KEYS) acc[k] = 0; const NN = 3000;
for (let i = 0; i < NN; i++) { const st = w3RandReview(), t = w3Tokens(st), r = w3Rule(st); for (const k of W3_KEYS) if ((MD.run(k, t).logit > 0) === (r > 0)) acc[k]++; }
console.log("random-sample acc:", Object.entries(acc).map(([k, v]) => k + " " + (100 * v / NN).toFixed(1)).join(", "));
`;
const src = w0.replace(/const W = \{\};[\s\S]*$/, "const W = {};") + "\n" + w3 + "\n" + test + "\n})();";
// w0 elején nyílik az IIFE; a w9 zárná – helyette mi zárjuk
eval(src.replace(/^[\s\S]*?\(function \(\) \{/, "(function () {"));
