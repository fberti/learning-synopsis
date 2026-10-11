// node w132_seeds.js – 100 mag statisztikája (GCN, 200 / 400 epoch)
const fs = require("fs"), path = require("path");
const ROOT = path.resolve(__dirname, "../..");
const src = fs.readFileSync(ROOT + "/_parts/ch13/w2.js", "utf8");
const core = src.slice(src.indexOf("/* W2-CORE-BEGIN"), src.indexOf("/* W2-CORE-END */"));
const M = new Function(core + "; return { w2Prop, w2GcnInit, w2GcnFwd, w2GcnStep };")();
global.window = {}; require(ROOT + "/mesterseges-intelligencia/13-graf-neuralis-halok/graph-data.js");
const K = window.KARATE13, n = K.n, y = K.club;
for (const ep of [100, 200, 400]) {
  const hist = {};
  for (let s = 1; s <= 100; s++) {
    const P = M.w2Prop(n, K.edges, true), net = M.w2GcnInit(n, 16, 2, s);
    for (let e = 0; e < ep; e++) M.w2GcnStep(net, P, y, [0, 33]);
    const { Z } = M.w2GcnFwd(net, P);
    const wrong = [...Array(n).keys()].filter(i => i !== 0 && i !== 33 && (Z[2*i+1] > Z[2*i] ? 1 : 0) !== y[i]).map(i => i + 1).join(",");
    hist[wrong] = (hist[wrong] || 0) + 1;
  }
  console.log(ep, "epoch, 100 mag – hibás csúcsok:", JSON.stringify(hist));
}
