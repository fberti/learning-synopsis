// node w132_gcn.js – a w2.js GCN-magjának ellenőrzése (gradiens + 20 mag)
const fs = require("fs"), path = require("path");
const ROOT = path.resolve(__dirname, "../..");
const src = fs.readFileSync(ROOT + "/_parts/ch13/w2.js", "utf8");
const core = src.slice(src.indexOf("/* W2-CORE-BEGIN"), src.indexOf("/* W2-CORE-END */"));
const M = new Function(core + "; return { w2Rng, w2Prop, w2GcnInit, w2GcnFwd, w2GcnStep };")();
global.window = {}; require(ROOT + "/mesterseges-intelligencia/13-graf-neuralis-halok/graph-data.js");
const K = window.KARATE13, n = K.n, y = K.club;
// gradiens-ellenőrzés: lr kicsi, Adam nélkül nem megy közvetlenül → numerikus derivált a veszteségre
function lossOf(net, P, lab) { const { Z } = M.w2GcnFwd(net, P); let L = 0; lab.forEach(i => { const a = Z[2*i], b = Z[2*i+1], m = Math.max(a,b), s = Math.exp(a-m)+Math.exp(b-m); L += -((y[i] ? b : a) - m - Math.log(s)) / lab.length; }); return L; }
{
  const P = M.w2Prop(n, K.edges, true), lab = [0, 33, 5, 20];
  const net = M.w2GcnInit(n, 16, 2, 7);
  for (let i = 0; i < 30; i++) M.w2GcnStep(net, P, y, lab);   // ne a kezdőpontban nézzük
  // analitikus gradiens: egy lépés lr=0, wd=0 mellett nem adja vissza… ezért másoljuk a step belsejét: Adam első lépése sign(g)*lr
  // egyszerűbb: friss háló, t=0, lr=1e-7, wd=0 → Δp = -lr * g/(|g|+eps) ≈ -lr*sign(g); ellenőrizzük az előjelet és a numerikus deriváltat
  let bad = 0, tot = 0;
  for (const key of ["W1", "b1", "W2", "b2"]) {
    const p = net.prm[key];
    for (let t = 0; t < Math.min(p.length, 40); t++) {
      const i = (t * 37) % p.length, o = p[i], e = 1e-6;
      p[i] = o + e; const Lp = lossOf(net, P, lab); p[i] = o - e; const Lm = lossOf(net, P, lab); p[i] = o;
      const num = (Lp - Lm) / (2 * e);
      // analitikus: klónozott háló egy lépése friss Adam-állapottal, lr kicsi
      const c = JSON.parse(JSON.stringify({ t: 0 }));
      const cl = { n, hid: 16, k: 2, prm: {}, m: {}, v: {}, t: 0 };
      for (const k2 in net.prm) { cl.prm[k2] = Float64Array.from(net.prm[k2]); cl.m[k2] = new Float64Array(net.prm[k2].length); cl.v[k2] = new Float64Array(net.prm[k2].length); }
      // Adam 1. lépés: m̂ = g, v̂ = g² → Δ = -lr·g/(|g|+eps) – csak az előjel derül ki; használjunk inkább wd=0, és olvassuk ki m-et: m = 0,1·g
      M.w2GcnStep(cl, P, y, lab, 0, 0);
      const ana = cl.m[key][i] / 0.1;
      tot++; if (Math.abs(ana - num) > 1e-5 * Math.max(1, Math.abs(num))) { bad++; if (bad < 5) console.log("eltérés", key, i, ana, num); }
    }
  }
  console.log("gradiens-ellenőrzés:", tot - bad, "/", tot, "egyezik");
}
function run(seed, gcn, lab = [0, 33], ep = 200) {
  const P = M.w2Prop(n, K.edges, gcn), net = M.w2GcnInit(n, 16, 2, seed);
  let L; for (let e = 0; e < ep; e++) L = M.w2GcnStep(net, P, y, lab);
  const { Z } = M.w2GcnFwd(net, P), rest = [...Array(n).keys()].filter(i => !lab.includes(i));
  const wrong = rest.filter(i => (Z[2*i+1] > Z[2*i] ? 1 : 0) !== y[i]).map(i => i + 1);
  return { L, ok: rest.length - wrong.length, wrong };
}
const seeds = +(process.argv[2] || 20);
for (const gcn of [true, false]) {
  const res = []; for (let s = 1; s <= seeds; s++) res.push([s, run(s, gcn)]);
  console.log(gcn ? "GCN" : "MLP", res.map(([s, r]) => `${s}:${r.ok}/32[${r.wrong.length > 4 ? r.wrong.length + " hiba" : r.wrong.join(",")}] L=${r.L.toFixed(3)}`).join("  "));
}
console.log("P_B sor-összeg ellenőrzés: P[0][0] =", M.w2Prop(n, K.edges, true)[0].toFixed(4));
