// 13.11-b: az élő GIN JS-előreszámolása (w4.js W4-CORE) → w134_gin_js.json, a w134_gin_check.py veti össze a PyTorch-csal
const fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, "..", "..");
const src = fs.readFileSync(path.join(ROOT, "_parts/ch13/w4.js"), "utf8");
const core = src.split("W4-CORE-BEGIN")[1].split("/* W4-CORE-END")[0].replace(/^[^\n]*\n/, "");
const { w4GinProb } = new Function(core + "\nreturn { w4GinProb };")();
global.window = {};
require(path.join(ROOT, "mesterseges-intelligencia/13-graf-neuralis-halok/mutag-data.js"));
const M = window.MUTAG13;
let s = 7; const rnd = () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648);
const cases = [];
M.mols.forEach((m, k) => cases.push({ name: "mol" + k, atoms: m.atoms, edges: m.edges }));
// szerkesztett változatok (atomcsere C/N/O/Cl között)
for (let t = 0; t < 40; t++) {
  const m = M.mols[Math.floor(rnd() * M.mols.length)], a = m.atoms.slice();
  for (let q = 0; q < 3; q++) a[Math.floor(rnd() * a.length)] = [0, 1, 2, 5][Math.floor(rnd() * 4)];
  cases.push({ name: "edit" + t, atoms: a, edges: m.edges });
}
// átszámozott változatok (a JS-nek ugyanazt kell adnia)
let permDiff = 0;
M.mols.forEach(m => m.perms.forEach(p => {
  const a2 = []; m.atoms.forEach((a, i) => (a2[p[i]] = a));
  permDiff = Math.max(permDiff, Math.abs(w4GinProb(M.weights, a2, m.edges.map(([u, v]) => [p[u], p[v]])) - w4GinProb(M.weights, m.atoms, m.edges)));
}));
cases.forEach(c => (c.p = w4GinProb(M.weights, c.atoms, c.edges)));
const acc = M.mols.filter((m, k) => (cases[k].p > 0.5) === (m.y === 1)).length / M.mols.length;
console.log("JS élő GIN pontossága a 188 molekulán:", acc, "(adat: liveTrain", M.acc.liveTrain + ")", "átszámozási max eltérés:", permDiff);
fs.writeFileSync(path.join(__dirname, "w134_gin_js.json"), JSON.stringify(cases));
