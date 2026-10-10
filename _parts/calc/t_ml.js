global.window = {}; require("../../assets/ml.js"); const ML = window.ML;
function trial(ds, hidden, act, epochs = 300, seed = 1, noise = 0.1, lr = 0.03) {
  const tr = ML.data[ds](200, 10 + seed, noise), te = ML.data[ds](200, 100 + seed, noise);
  const net = new ML.MLP([2, ...hidden, 1], { act, out: "sigmoid", seed });
  const rnd = ML.rng(seed);
  for (let e = 0; e < epochs; e++) net.epoch(tr.X, tr.y, { batch: 10, lr, opt: "adam", rnd });
  return [net.accuracy(tr.X, tr.y), net.accuracy(te.X, te.y)].map(v => v.toFixed(2)).join("/");
}
const cfgs = [[[], "tanh"], [[2], "tanh"], [[3], "tanh"], [[4], "tanh"], [[8], "tanh"], [[8, 8], "tanh"], [[8, 8], "relu"], [[8, 8], "linear"], [[8, 8, 8], "tanh"], [[6,6,6],"relu"]];
for (const ds of ["blobs", "xor", "circles", "moons", "spiral"]) {
  console.log(ds, cfgs.map(([h, a]) => `[${h}]${a[0]}:` + [1, 2, 3].map(s => trial(ds, h, a, ds==="spiral"?500:250, s)).join(",")).join("  "));
}
