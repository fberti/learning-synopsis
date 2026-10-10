// train-monitor hangolása: node tm10.js [ds] [noise] [ntr] [act] [seeds...]
global.window = {}; require("../../assets/ml.js");
const ML = window.ML;
const [ds = "moons", noise = 0.35, ntr = 30, act = "tanh", ...seeds] = process.argv.slice(2);
function run(seed, cfg) {
  const tr = ML.data[ds](+ntr, seed, +noise), va = ML.data[ds](300, seed + 5000, +noise);
  const net = new ML.MLP([2, 32, 32, 1], { act, out: "sigmoid", seed: 1 }), rnd = ML.rng(seed + 100);
  let best = [Infinity, 0], h = [];
  for (let e = 1; e <= 600; e++) {
    net.epoch(tr.X, tr.y, { batch: 10, lr: 0.01, opt: "adam", l2: cfg.l2 || 0, dropout: cfg.dropout || 0, rnd });
    const lt = net.loss(tr.X, tr.y), lv = net.loss(va.X, va.y);
    h.push([e, lt, lv]);
    if (lv < best[0]) best = [lv, e, net.accuracy(va.X, va.y)];
  }
  const last = h[h.length - 1];
  return `tr ${last[1].toFixed(3)} va ${last[2].toFixed(3)} acc ${net.accuracy(tr.X, tr.y).toFixed(2)}/${net.accuracy(va.X, va.y).toFixed(3)} best ${best[0].toFixed(3)}@${best[1]} (${best[2].toFixed(3)}) | ` + [50, 100, 200, 400].map(e => `${e}:${h[e - 1][2].toFixed(2)}`).join(" ");
}
for (const s of (seeds.length ? seeds : [1, 2, 3, 4, 5]).map(Number)) for (const cfg of [{}, { l2: 0.01 }, { dropout: 0.5 }, { l2: 0.03 }])
  console.log(s, JSON.stringify(cfg).padEnd(16), run(s, cfg));
