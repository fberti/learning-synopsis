// 11. fejezet, cnn-shapes widget: alakok és paraméterszámok ellenőrzése (node _parts/calc/s11w2_shapes.js)
const conv = (k, c, s = 1, p = 0) => ({ t: "conv", k, c, s, p });
const pool = (k = 2, s = 2) => ({ t: "pool", k, s, p: 0 });
const fc = n => ({ t: "fc", n });
const gmax = { t: "gmax" };
const vggB = (n, c) => Array.from({ length: n }, () => conv(3, c, 1, 1));
const NETS = {
  ours: { n: 16, c: 1, L: [conv(3, 8, 1, 1), pool(), conv(3, 32, 1, 1), gmax, fc(10)] },
  lenet: { n: 32, c: 1, L: [conv(5, 6), pool(), conv(5, 16), pool(), conv(5, 120), fc(84), fc(10)] },
  alex: { n: 227, c: 3, L: [conv(11, 96, 4), pool(3, 2), conv(5, 256, 1, 2), pool(3, 2), conv(3, 384, 1, 1), conv(3, 384, 1, 1), conv(3, 256, 1, 1), pool(3, 2), fc(4096), fc(4096), fc(1000)] },
  vgg: { n: 224, c: 3, L: [...vggB(2, 64), pool(), ...vggB(2, 128), pool(), ...vggB(3, 256), pool(), ...vggB(3, 512), pool(), ...vggB(3, 512), pool(), fc(4096), fc(4096), fc(1000)] },
};
function run(net, n) {
  let H = n, Wd = n, C = net.c, flat = false, rows = [], tot = 0;
  for (const l of net.L) {
    let P = 0, exact = true;
    if (l.t === "conv" || l.t === "pool") {
      const q = (H + 2 * l.p - l.k) / l.s; exact = Number.isInteger(q);
      H = Math.floor(q) + 1; Wd = H;
      if (l.t === "conv") { P = l.c * (l.k * l.k * C + 1); C = l.c; }
    } else if (l.t === "gmax") { H = Wd = 1; flat = true; }
    else { const nin = H * Wd * C; P = nin * l.n + l.n; H = Wd = 1; C = l.n; flat = true; }
    tot += P; rows.push([l.t, H, Wd, C, P, exact]);
  }
  return { rows, tot };
}
for (const [k, net] of Object.entries(NETS)) {
  const r = run(net, net.n);
  const fcP = r.rows.filter(x => x[0] === "fc").reduce((s, x) => s + x[4], 0);
  console.log(k, "total", r.tot, "FC share", (100 * fcP / r.tot).toFixed(2) + "%");
  r.rows.forEach(x => console.log("  ", x.join(" ")));
}
const a224 = run(NETS.alex, 224); console.log("alex 224 first:", a224.rows[0], (224 - 11) / 4 + 1, "total", a224.tot);
console.log("MLP 256-16-10:", 256 * 16 + 16 + 16 * 10 + 10);
// IoU
const iou = (a, b) => { const iw = Math.max(0, Math.min(a[2], b[2]) - Math.max(a[0], b[0])), ih = Math.max(0, Math.min(a[3], b[3]) - Math.max(a[1], b[1])), I = iw * ih, A = (a[2] - a[0]) * (a[3] - a[1]), B = (b[2] - b[0]) * (b[3] - b[1]); return [I, A + B - I, I / (A + B - I), 2 * I / (A + B)]; };
console.log("iou ex1", iou([0, 0, 4, 4], [2, 2, 6, 6]), "ex2", iou([1, 1, 5, 5], [2, 1, 6, 5]));
// ViT
for (const P of [32, 16, 14, 8]) { const n = (224 / P) ** 2, d = P * P * 3; console.log("ViT P", P, n, d, n + 1, (n + 1) ** 2, d * 768 + 768); }
for (const P of [2, 4, 8]) { const n = (16 / P) ** 2; console.log("board P", P, n, P * P, n + 1, (n + 1) ** 2); }
