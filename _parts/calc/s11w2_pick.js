// digit-cnn widget: alapértelmezett tesztkép keresése (CNN-B (1;0)-nál téved, CNN-A és MLP középen jó)
const fs = require("fs"), vm = require("vm");
const ctx = { window: {}, document: { readyState: "complete", querySelectorAll: () => [], documentElement: {} }, getComputedStyle: () => ({ getPropertyValue: () => "" }), console };
ctx.window = ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync("mesterseges-intelligencia/11-konvolucios-halok/cnn-nets.js", "utf8"), ctx);
vm.runInContext(fs.readFileSync("_parts/ch11/w0.js", "utf8") + "\n})();", ctx);
const H = ctx.__W11, T = H.testSet(), N = ctx.CNN11.nets;
const pr = (n, i, dx, dy) => { const p = H.forwardNet(N[n], H.place(T.X[i], dx, dy)).p; const k = H.argmax(p); return [k, p[k]]; };
const out = [];
for (let i = 0; i < T.X.length; i++) {
  const y = T.y[i];
  const a0 = pr("cnnA", i, 0, 0), a1 = pr("cnnA", i, 1, 0), b0 = pr("cnnB", i, 0, 0), b1 = pr("cnnB", i, 1, 0), m0 = pr("mlp", i, 0, 0), m1 = pr("mlp", i, 1, 0), g1 = pr("cnnBaug", i, 1, 0);
  if (a0[0] === y && a1[0] === y && b0[0] === y && b1[0] !== y && m0[0] === y && m1[0] !== y && g1[0] === y) out.push([i, y, a0[1].toFixed(3), a1[1].toFixed(3), b1[0], m1[0]]);
}
console.log(out.length, JSON.stringify(out.slice(0, 40)));
let t0 = Date.now(); for (let i = 0; i < 450; i++) H.forwardNet(N.cnnA, H.place(T.X[i], 0, 0)); console.log("450 cnnA ms", Date.now() - t0);
