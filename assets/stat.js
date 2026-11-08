/* =========================================================
   Synopsis – közös statisztikai segédmodul (window.Stat)
   Eloszlások (normális, t, khi-négyzet, F, binomiális): sűrűség,
   eloszlásfüggvény, kvantilis; véletlenszám-generátorok.
   Először a Matematikai statisztika 5. fejezete használja; a
   későbbi fejezetek (becslés, próbák, ANOVA, regresszió) is erre épülnek.
   Pontosság: ~1e-10 (eloszlásfüggvények), kvantilis biszekció + Newton.
   ========================================================= */
(function () {
  "use strict";

  /* ---------- speciális függvények ---------- */
  const LANCZOS = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
    -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  function gammaln(x) {
    if (x < 0.5) return Math.log(Math.PI / Math.abs(Math.sin(Math.PI * x))) - gammaln(1 - x);
    x -= 1;
    let a = LANCZOS[0];
    const t = x + 7.5;
    for (let i = 1; i < 9; i++) a += LANCZOS[i] / (x + i);
    return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
  }

  /* regularizált alsó nem teljes gamma-függvény P(a, x) */
  function gammaP(a, x) {
    if (x <= 0) return 0;
    if (x < a + 1) { // sor
      let sum = 1 / a, del = sum, ap = a;
      for (let n = 0; n < 500; n++) { ap += 1; del *= x / ap; sum += del; if (Math.abs(del) < Math.abs(sum) * 1e-15) break; }
      return sum * Math.exp(-x + a * Math.log(x) - gammaln(a));
    }
    return 1 - gammaQcf(a, x);
  }
  function gammaQcf(a, x) { // lánctört (Lentz)
    let b = x + 1 - a, c = 1 / 1e-300, d = 1 / b, hh = d;
    for (let i = 1; i < 500; i++) {
      const an = -i * (i - a); b += 2;
      d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300;
      c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300;
      d = 1 / d; const del = d * c; hh *= del;
      if (Math.abs(del - 1) < 1e-15) break;
    }
    return Math.exp(-x + a * Math.log(x) - gammaln(a)) * hh;
  }

  /* regularizált nem teljes béta-függvény I_x(a, b) */
  function betacf(a, b, x) {
    const qab = a + b, qap = a + 1, qam = a - 1;
    let c = 1, d = 1 - qab * x / qap;
    if (Math.abs(d) < 1e-300) d = 1e-300;
    d = 1 / d; let hh = d;
    for (let m = 1; m <= 500; m++) {
      const m2 = 2 * m;
      let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1 + aa * d; if (Math.abs(d) < 1e-300) d = 1e-300;
      c = 1 + aa / c; if (Math.abs(c) < 1e-300) c = 1e-300;
      d = 1 / d; hh *= d * c;
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1 + aa * d; if (Math.abs(d) < 1e-300) d = 1e-300;
      c = 1 + aa / c; if (Math.abs(c) < 1e-300) c = 1e-300;
      d = 1 / d; const del = d * c; hh *= del;
      if (Math.abs(del - 1) < 1e-15) break;
    }
    return hh;
  }
  function betaI(x, a, b) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    const bt = Math.exp(gammaln(a + b) - gammaln(a) - gammaln(b) + a * Math.log(x) + b * Math.log(1 - x));
    return x < (a + 1) / (a + b + 2) ? bt * betacf(a, b, x) / a : 1 - bt * betacf(b, a, 1 - x) / b;
  }

  /* erf nagy pontossággal: P(1/2, x²) */
  const erf = x => (x >= 0 ? 1 : -1) * gammaP(0.5, x * x);

  /* ---------- eloszlások ---------- */
  const SQ2PI = Math.sqrt(2 * Math.PI);
  const normal = {
    pdf: (x, m = 0, s = 1) => Math.exp(-0.5 * ((x - m) / s) ** 2) / (s * SQ2PI),
    cdf: (x, m = 0, s = 1) => { const z = (x - m) / s; return z < -8 ? 0 : z > 8 ? 1 : 0.5 * (1 + erf(z / Math.SQRT2)); },
    inv(p, m = 0, s = 1) { // Acklam + egy Newton-lépés
      if (p <= 0) return -Infinity; if (p >= 1) return Infinity;
      const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.383577518672690e2, -3.066479806614716e1, 2.506628277459239];
      const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1];
      const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
      const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];
      let q, r, z;
      if (p < 0.02425) { q = Math.sqrt(-2 * Math.log(p)); z = (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
      else if (p > 1 - 0.02425) { q = Math.sqrt(-2 * Math.log(1 - p)); z = -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
      else { q = p - 0.5; r = q * q; z = (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1); }
      const e = normal.cdf(z) - p, u = e * SQ2PI * Math.exp(z * z / 2);
      z = z - u / (1 + z * u / 2);
      return m + s * z;
    }
  };

  const t = {
    pdf: (x, df) => Math.exp(gammaln((df + 1) / 2) - gammaln(df / 2) - 0.5 * Math.log(df * Math.PI) - (df + 1) / 2 * Math.log(1 + x * x / df)),
    cdf(x, df) {
      if (!isFinite(df) || df > 1e7) return normal.cdf(x);
      const ib = betaI(df / (df + x * x), df / 2, 0.5);
      return x >= 0 ? 1 - ib / 2 : ib / 2;
    },
    inv: (p, df) => invert(x => t.cdf(x, df), p, -1e3, 1e3, x => t.pdf(x, df))
  };

  const chi2 = {
    pdf: (x, k) => x < 0 ? 0 : x === 0 ? (k === 2 ? 0.5 : k < 2 ? Infinity : 0)
      : Math.exp((k / 2 - 1) * Math.log(x) - x / 2 - (k / 2) * Math.LN2 - gammaln(k / 2)),
    cdf: (x, k) => x <= 0 ? 0 : gammaP(k / 2, x / 2),
    inv: (p, k) => invert(x => chi2.cdf(x, k), p, 0, Math.max(100, k * 10), x => chi2.pdf(x, k))
  };

  const f = {
    pdf(x, d1, d2) {
      if (x <= 0) return 0;
      return Math.exp(0.5 * (d1 * Math.log(d1 * x) + d2 * Math.log(d2) - (d1 + d2) * Math.log(d1 * x + d2))
        - Math.log(x) - (gammaln(d1 / 2) + gammaln(d2 / 2) - gammaln((d1 + d2) / 2)));
    },
    cdf: (x, d1, d2) => x <= 0 ? 0 : betaI(d1 * x / (d1 * x + d2), d1 / 2, d2 / 2),
    inv: (p, d1, d2) => invert(x => f.cdf(x, d1, d2), p, 0, 1e4, x => f.pdf(x, d1, d2))
  };

  const lchoose = (n, k) => gammaln(n + 1) - gammaln(k + 1) - gammaln(n - k + 1);
  const binom = {
    pmf: (k, n, p) => k < 0 || k > n ? 0 : p === 0 ? (k === 0 ? 1 : 0) : p === 1 ? (k === n ? 1 : 0)
      : Math.exp(lchoose(n, k) + k * Math.log(p) + (n - k) * Math.log(1 - p)),
    cdf: (k, n, p) => k < 0 ? 0 : k >= n ? 1 : 1 - betaI(p, Math.floor(k) + 1, n - Math.floor(k))
  };

  /* monoton eloszlásfüggvény invertálása: biszekció, majd Newton-finomítás */
  function invert(F, p, lo, hi, pdf) {
    if (p <= 0) return lo <= 0 && F(0) === 0 ? 0 : -Infinity;
    if (p >= 1) return Infinity;
    while (F(hi) < p) hi *= 2;
    while (lo < 0 && F(lo) > p) lo *= 2;
    let x = (lo + hi) / 2;
    for (let i = 0; i < 200; i++) {
      x = (lo + hi) / 2;
      const v = F(x);
      if (v < p) lo = x; else hi = x;
      if (hi - lo < 1e-12 * Math.max(1, Math.abs(x))) break;
    }
    if (pdf) for (let i = 0; i < 3; i++) { const d = pdf(x); if (!(d > 0)) break; const nx = x - (F(x) - p) / d; if (nx > lo - 1 && isFinite(nx)) x = nx; }
    return x;
  }

  /* ---------- véletlenszámok ---------- */
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let r = Math.imul(a ^ (a >>> 15), 1 | a);
      r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }
  const rnorm = rnd => { let u = 0; while (!u) u = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rnd()); };
  const rexp = (rnd, mean = 1) => { let u = 0; while (!u) u = rnd(); return -mean * Math.log(u); };
  const rchi2 = (rnd, k) => { let s = 0; for (let i = 0; i < k; i++) s += rnorm(rnd) ** 2; return s; };

  /* ---------- kis leíró függvények ---------- */
  const mean = a => a.reduce((s, x) => s + x, 0) / a.length;
  const variance = (a, ddof = 1) => { const m = mean(a); return a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - ddof); };
  const sd = (a, ddof = 1) => Math.sqrt(variance(a, ddof));
  const median = a => { const s = a.slice().sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };

  window.Stat = { gammaln, gammaP, betaI, erf, normal, t, chi2, f, binom, invert, mulberry32, rnorm, rexp, rchi2, mean, variance, sd, median };
})();
