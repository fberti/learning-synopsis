// node: a shift-lab alapképének kiválasztása (MLP: középen jó, 1 px jobbra rossz; lehetőleg 3-as)
const fs = require("fs"), vm = require("vm");
const ctx = { window: {}, document: { readyState: "complete", querySelectorAll: () => [], documentElement: {} }, getComputedStyle: () => ({ getPropertyValue: () => "" }), console };
ctx.window = ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync("mesterseges-intelligencia/11-konvolucios-halok/cnn-nets.js", "utf8"), ctx);
vm.runInContext(fs.readFileSync("_parts/ch11/w0.js", "utf8") + "\n})();", ctx);
const H = ctx.__W11, T = H.testSet(), net = ctx.CNN11.nets.mlp;
const rows = [];
T.X.forEach((v, i) => {
  const p0 = H.forwardNet(net, H.place(v, 0, 0)).p, p1 = H.forwardNet(net, H.place(v, 1, 0)).p;
  const a0 = H.argmax(p0), a1 = H.argmax(p1);
  if (a0 === T.y[i] && a1 !== T.y[i]) rows.push({ i, y: T.y[i], p0: p0[a0].toFixed(3), pred1: a1, p1: p1[a1].toFixed(3), ptrue1: p1[T.y[i]].toFixed(3) });
});
console.log(rows.length, "jelölt");
rows.filter(r => r.y === 3).sort((a, b) => (b.p0 * b.p1) - (a.p0 * a.p1)).slice(0, 10).forEach(r => console.log(JSON.stringify(r)));
const arg = +process.argv[2];
if (Number.isFinite(arg)) {
  for (const [dx, dy] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const p = H.forwardNet(net, H.place(T.X[arg], dx, dy)).p, a = H.argmax(p);
    console.log(`#${arg} (${dx};${dy}) jóslat ${a} (${(100 * p[a]).toFixed(1)}%) valódi ${T.y[arg]} · helyes: ${net.grid[dy + 4][dx + 4]}/450`);
  }
}
