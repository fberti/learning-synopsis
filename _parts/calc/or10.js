// optimizer-race: alapértelmezett η-k keresése
const S = {
  bowl: { f: (x, y) => x * x + 3 * y * y, g: (x, y) => [2 * x, 6 * y], p0: [2, 1] },
  valley: { f: (x, y) => 0.5 * (x * x + 25 * y * y), g: (x, y) => [x, 25 * y], p0: [-4, 1] },
  rosen: { f: (x, y) => (1 - x) ** 2 + 100 * (y - x * x) ** 2, g: (x, y) => [-2 * (1 - x) - 400 * x * (y - x * x), 200 * (y - x * x)], p0: [-1.5, 2] }
};
function run(s, m, eta, beta = 0.9, N = 500) {
  let p = S[s].p0.slice(), v = [0, 0], q = [0, 0], t = 0; const out = [];
  for (let k = 1; k <= N; k++) {
    const g = S[s].g(...p); t++;
    for (let i = 0; i < 2; i++) {
      if (m === "gd") p[i] -= eta * g[i];
      else if (m === "mom") { v[i] = beta * v[i] + g[i]; p[i] -= eta * v[i]; }
      else if (m === "rms") { q[i] = 0.9 * q[i] + 0.1 * g[i] ** 2; p[i] -= eta * g[i] / (Math.sqrt(q[i]) + 1e-8); }
      else { v[i] = 0.9 * v[i] + 0.1 * g[i]; q[i] = 0.999 * q[i] + 0.001 * g[i] ** 2; p[i] -= eta * (v[i] / (1 - 0.9 ** t)) / (Math.sqrt(q[i] / (1 - 0.999 ** t)) + 1e-8); }
    }
    const L = S[s].f(...p);
    if (!(L < 1e10)) return `szétszállt@${k}`;
    if ([10, 50, 100, 200, 500].includes(k)) out.push(`${k}:${L.toExponential(1)}`);
  }
  return out.join(" ") + ` p=(${p.map(v => v.toFixed(3))})`;
}
const [s, ...etas] = process.argv.slice(2);
for (const m of ["gd", "mom", "rms", "adam"]) for (const e of etas.map(Number)) console.log(s, m, e, run(s, m, e));
