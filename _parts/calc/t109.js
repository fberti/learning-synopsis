global.window = {}; require("../../assets/ml.js"); require("../../mesterseges-intelligencia/10-halo-tanitasa/digits-data.js");
const ML = window.ML, D = window.DIGITS10;
const dec = p => { const X = []; for (let i = 0; i < p.n; i++) { const r = []; for (let j = 0; j < 64; j++) r.push((p.X.charCodeAt(i * 64 + j) - 97) / 16); X.push(r); } return { X, y: [...p.y].map(Number) }; };
const tr = dec(D.train), va = dec(D.val), te = dec(D.test);
const sub = (d, n) => ({ X: d.X.slice(0, n), y: d.y.slice(0, n) });
function run(o) {
  const { hidden = [16], act = "relu", init = "auto", seed = 1, opt = "adam", lr = 0.01, batch = 32, l2 = 0, dropout = 0, epochs = 30, ntrain = 1047, log = [] } = o;
  const T = ntrain < 1047 ? sub(tr, ntrain) : tr;
  const net = new ML.MLP([64, ...hidden, 10], { act, out: "softmax", seed, init }), rnd = ML.rng(seed + 100);
  const hist = [[0, net.loss(T.X, T.y), net.loss(va.X, va.y), net.accuracy(T.X, T.y), net.accuracy(va.X, va.y)]];
  for (let e = 1; e <= epochs; e++) {
    net.epoch(T.X, T.y, { batch, lr, opt, l2, dropout, rnd });
    hist.push([e, net.loss(T.X, T.y), net.loss(va.X, va.y), net.accuracy(T.X, T.y), net.accuracy(va.X, va.y)]);
  }
  return { net, hist, test: net.accuracy(te.X, te.y) };
}
const f = (v, d = 3) => v.toFixed(d);
const show = (name, r, every = 5) => console.log(name, "test", f(r.test), "|", r.hist.filter(h => h[0] % every === 0 || h[0] <= 2).map(h => `${h[0]}:${f(h[1])}/${f(h[2])}/${f(h[4], 3)}`).join(" "));
const first = (r, thr) => { const h = r.hist.find(h => h[4] >= thr); return h ? h[0] : "-"; };
const mode = process.argv[2] || "opt";
if (mode === "opt") {
  for (const [opt, lr] of [["sgd", 0.1], ["sgd", 0.5], ["momentum", 0.05], ["momentum", 0.1], ["rmsprop", 0.003], ["adam", 0.003], ["adam", 0.01], ["adam", 0.03]]) {
    const r = run({ opt, lr }); show(`${opt} ${lr}`, r); console.log("   ep to 90/95% val:", first(r, 0.9), first(r, 0.95));
  }
}
if (mode === "batch") {
  for (const [batch, lr] of [[1, 0.01], [8, 0.05], [32, 0.1], [128, 0.1], [128, 0.4], [1047, 0.1], [1047, 0.5]]) {
    const t0 = Date.now(); const r = run({ opt: "sgd", lr, batch, epochs: 20 }); show(`B=${batch} lr=${lr} ${Date.now() - t0}ms`, r, 10);
  }
}
if (mode === "init") {
  for (const init of ["auto", "zero", 0.01, 1.0, 3]) { const r = run({ init, opt: "sgd", lr: 0.1, epochs: 20 }); show(`init ${init}`, r, 10); }
  for (const init of ["auto", "zero"]) { const r = run({ init, opt: "adam", lr: 0.01, epochs: 20 }); show(`adam init ${init}`, r, 10); }
}
if (mode === "seeds") {
  const acc = []; for (let s = 1; s <= 10; s++) { const r = run({ seed: s, opt: "adam", lr: 0.01, epochs: 30 }); acc.push(r.test); }
  console.log(acc.map(a => f(a)).join(" "), "mean", f(acc.reduce((a, b) => a + b) / acc.length), "min", f(Math.min(...acc)), "max", f(Math.max(...acc)));
}
if (mode === "over") {
  const n = +process.argv[3] || 100;
  for (const cfg of [{}, { dropout: 0.3 }, { dropout: 0.5 }, { l2: 0.001 }, { l2: 0.01 }]) {
    const r = run({ hidden: [64], ntrain: n, epochs: 150, opt: "adam", lr: 0.01, batch: 16, ...cfg });
    const best = r.hist.reduce((b, h) => (h[2] < b[2] ? h : b));
    show(`over n=${n} ${JSON.stringify(cfg)}`, r, 25); console.log("   best val loss ep", best[0], f(best[2]), "acc", f(best[4]));
  }
}
if (mode === "es") {
  const r = run({ hidden: [64], ntrain: 100, epochs: 150, opt: "adam", lr: 0.01, batch: 16 });
  console.log(r.hist.filter(h => h[0] <= 40 || h[0] % 10 === 0).map(h => `${h[0]}: tr ${f(h[1])} va ${f(h[2],5)} accTr ${f(h[3])} accVa ${f(h[4])}`).join("\n"));
  // patience 5 early stopping
  for (const pat of [3, 5, 10]) {
    let best = 1e9, be = 0, stop = null;
    for (const h of r.hist) { if (h[2] < best) { best = h[2]; be = h[0]; } else if (h[0] - be >= pat) { stop = h[0]; break; } }
    console.log("patience", pat, "best", be, f(best), "stop at", stop);
  }
}
if (mode === "batch2") {
  for (const [batch, lr, ep] of [[8, 0.1, 20], [32, 0.1, 20], [128, 0.1, 20], [1047, 0.1, 20], [128, 0.1, 80], [1047, 0.1, 660], [128, 0.4, 20], [1047, 3.2, 20]]) {
    const t0 = Date.now(); const r = run({ opt: "sgd", lr, batch, epochs: ep }); const h = r.hist[r.hist.length - 1];
    console.log(`B=${batch} lr=${lr} ep=${ep} steps=${ep * Math.ceil(1047 / batch)} ${Date.now() - t0}ms trainloss ${f(h[1])} val ${f(h[2])} valacc ${f(h[4])} test ${f(r.test)}`);
  }
}
if (mode === "aug") {
  const shift = (x, dx, dy) => { const o = new Array(64).fill(0); for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { const r2 = r + dy, c2 = c + dx; if (r2 >= 0 && r2 < 8 && c2 >= 0 && c2 < 8) o[r2 * 8 + c2] = x[r * 8 + c]; } return o; };
  for (const n of [100, 200]) {
    const base = sub(tr, n), X = [], y = [];
    base.X.forEach((x, i) => { for (const [dx, dy] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) { X.push(shift(x, dx, dy)); y.push(base.y[i]); } });
    for (const [lab, T, ep] of [["plain", base, 150], ["aug", { X, y }, 30]]) {
      const net = new ML.MLP([64, 64, 10], { act: "relu", out: "softmax", seed: 1 }), rnd = ML.rng(101);
      let best = [1e9, 0, 0];
      for (let e = 1; e <= ep; e++) { net.epoch(T.X, T.y, { batch: 16, lr: 0.01, opt: "adam", rnd }); const vl = net.loss(va.X, va.y); if (vl < best[0]) best = [vl, e, net.accuracy(te.X, te.y)]; }
      console.log(n, lab, "ntrain", T.X.length, "final val loss", f(net.loss(va.X, va.y)), "val acc", f(net.accuracy(va.X, va.y)), "test", f(net.accuracy(te.X, te.y)), "best val", f(best[0]), "ep", best[1], "test@best", f(best[2]));
    }
  }
}
if (mode === "size") {
  for (const n of [100, 200, 500, 1047]) { const r = run({ ntrain: n, opt: "adam", lr: 0.01, epochs: 30 }); console.log(n, "test", f(r.test), "val", f(r.hist[30][4])); }
}
