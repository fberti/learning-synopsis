global.window = {}; require("../../assets/ml.js"); const ML = window.ML;
function run(ds, hidden, act, epochs, noise = 0.1, dseed = 1, seed = 1, lr = 0.03) {
  const all = ML.data[ds](300, 1000 * dseed + ds.length, noise);
  const idx = ML.shuffle(all.X.map((_, i) => i), ML.rng(dseed + 7));
  const pick = ids => ({ X: ids.map(i => all.X[i]), y: ids.map(i => all.y[i]) });
  const tr = pick(idx.slice(0, 150)), te = pick(idx.slice(150));
  const net = new ML.MLP([2, ...hidden, 1], { act, out: "sigmoid", seed }); const rnd = ML.rng(seed * 13 + 1);
  for (let e = 0; e < epochs; e++) net.epoch(tr.X, tr.y, { batch: 10, lr, opt: "adam", rnd });
  return `${(100*net.accuracy(tr.X, tr.y)).toFixed(0)}/${(100*net.accuracy(te.X, te.y)).toFixed(0)}`;
}
const S = [1, 2, 3, 4];
const show = (lab, f) => console.log(lab, S.map(f).join(" "));
show("xor []", s => run("xor", [], "tanh", 300, 0.1, 1, s));
show("xor [2]", s => run("xor", [2], "tanh", 300, 0.1, 1, s));
show("xor [3]", s => run("xor", [3], "tanh", 300, 0.1, 1, s));
show("circ [2]", s => run("circles", [2], "tanh", 300, 0.1, 1, s));
show("circ [3]", s => run("circles", [3], "tanh", 300, 0.1, 1, s));
show("circ [4,2]", s => run("circles", [4, 2], "tanh", 300, 0.1, 1, s));
show("moons [2]", s => run("moons", [2], "tanh", 300, 0.1, 1, s));
show("moons [4]", s => run("moons", [4], "tanh", 300, 0.1, 1, s));
show("spiral [8]", s => run("spiral", [8], "tanh", 600, 0.1, 1, s));
show("spiral [8,8]", s => run("spiral", [8, 8], "tanh", 600, 0.1, 1, s));
show("spiral [8,8] relu", s => run("spiral", [8, 8], "relu", 600, 0.1, 1, s));
show("spiral [8,8,8] relu", s => run("spiral", [8, 8, 8], "relu", 600, 0.1, 1, s));
show("circ [8,8] lin", s => run("circles", [8, 8], "linear", 300, 0.1, 1, s));
show("xor noise.5 [8,8,8] 1500", s => run("xor", [8, 8, 8], "tanh", 1500, 0.5, 1, s));
show("circ noise.5 [8,8,8] 1500", s => run("circles", [8, 8, 8], "tanh", 1500, 0.5, 1, s));
show("circ [4,2] sigmoid", s => run("circles", [4, 2], "sigmoid", 300, 0.1, 1, s));
