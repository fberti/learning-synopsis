// train-monitor: beállítás-keresés (kompakt)
global.window = {}; require("../../assets/ml.js");
const ML = window.ML;
function run(ds, noise, ntr, act, seed, cfg, E = 600) {
  const tr = ML.data[ds](ntr, seed, noise), va = ML.data[ds](300, seed + 5000, noise);
  const net = new ML.MLP([2, 32, 32, 1], { act, out: "sigmoid", seed: 1 }), rnd = ML.rng(seed + 100);
  let best = [Infinity, 0];
  let lv, lt;
  for (let e = 1; e <= E; e++) {
    net.epoch(tr.X, tr.y, { batch: 10, lr: 0.01, opt: "adam", l2: cfg.l2 || 0, dropout: cfg.dropout || 0, rnd });
    lv = net.loss(va.X, va.y);
    if (lv < best[0]) best = [lv, e];
  }
  lt = net.loss(tr.X, tr.y);
  return { lt, lv, best: best[0], be: best[1] };
}
const f = v => v.toFixed(3);
for (const ds of ["moons"]) for (const noise of [0.25, 0.35]) for (const ntr of [30, 40]) for (const act of ["tanh", "relu"]) for (let s = 1; s <= 6; s++) {
  const a = run(ds, noise, ntr, act, s, {}), b = run(ds, noise, ntr, act, s, { l2: 0.01 }), c = run(ds, noise, ntr, act, s, { dropout: 0.5 }), d = run(ds, noise, ntr, act, s, { l2: 0.001 });
  const score = a.lv / a.best;
  console.log(`${ds} ${noise} ${ntr} ${act} s${s} | none tr ${f(a.lt)} va ${f(a.lv)} best ${f(a.best)}@${a.be} x${score.toFixed(2)} | l2.01 ${f(b.lv)} (${f(b.best)}) | do.5 ${f(c.lv)} (${f(c.best)}) | l2.001 ${f(d.lv)} (${f(d.best)})`);
}
