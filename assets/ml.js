/* =========================================================
   Synopsis – kis gépi tanulási modul (neurális hálók)
   Magolt álvéletlen-generátor, 2D adatkészletek, aktivációs függvények,
   többrétegű perceptron (MLP) visszaterjesztéssel; optimalizálók: SGD,
   momentum, RMSProp, Adam; L2-büntetés, (fordított) dropout, inicializálások.
   Nincs külső függőség; a widgetek a window.ML objektumon át érik el.
   Konvenció: a W[l] mátrix sorai a réteg neuronjai, oszlopai a bemenetek
   (W[l][j][i] = az i-edik bemenet súlya a j-edik neuronon), z = W·a + b.
   ========================================================= */
(function () {
  "use strict";

  /* mulberry32: kicsi, gyors, magból reprodukálható álvéletlen-generátor */
  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  const gauss = rnd => { let u = 0; while (u === 0) u = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rnd()); };
  function shuffle(arr, rnd) {
    const b = arr.slice();
    for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; }
    return b;
  }

  /* ------------------------------------------------------------------
     2D adatkészletek a [−1, 1] × [−1, 1] négyzetben; y ∈ {0, 1}
     n: pontok száma, noise: zaj (0 … 1), seed: mag
     ------------------------------------------------------------------ */
  const data = {
    /* négy negyed: az átlós negyedek azonos osztályúak */
    xor(n, seed, noise = 0.1) {
      const r = rng(seed), X = [], y = [];
      for (let i = 0; i < n; i++) {
        let a = 2 * r() - 1, b = 2 * r() - 1;
        const pad = 0.06;                       // a tengelyek mentén kis rés
        a += a > 0 ? pad : -pad; b += b > 0 ? pad : -pad;
        const c = a * b > 0 ? 0 : 1;
        X.push([clamp(a * 0.9 + noise * 0.5 * gauss(r), -1, 1), clamp(b * 0.9 + noise * 0.5 * gauss(r), -1, 1)]); y.push(c);
      }
      return { X, y };
    },
    /* belső korong (1) és külső gyűrű (0) */
    circles(n, seed, noise = 0.1) {
      const r = rng(seed), X = [], y = [];
      for (let i = 0; i < n; i++) {
        const c = i % 2, t = 2 * Math.PI * r();
        const rad = c ? 0.35 * Math.sqrt(r()) : 0.62 + 0.3 * r();
        X.push([rad * Math.cos(t) + noise * 0.35 * gauss(r), rad * Math.sin(t) + noise * 0.35 * gauss(r)]); y.push(c);
      }
      return { X, y };
    },
    /* két egymásba kapaszkodó félhold */
    moons(n, seed, noise = 0.1) {
      const r = rng(seed), X = [], y = [];
      for (let i = 0; i < n; i++) {
        const c = i % 2, t = Math.PI * r();
        let a = c ? 1 - Math.cos(t) : Math.cos(t), b = c ? 0.5 - Math.sin(t) : Math.sin(t);
        a += noise * 0.6 * gauss(r); b += noise * 0.6 * gauss(r);
        X.push([(a - 0.5) * 0.62, (b - 0.25) * 0.85]); y.push(c);
      }
      return { X, y };
    },
    /* két egymásba csavarodó spirál */
    spiral(n, seed, noise = 0.1) {
      const r = rng(seed), X = [], y = [];
      for (let i = 0; i < n; i++) {
        const c = i % 2, t = 0.25 + 2.6 * r();          // fordulat (radián / 2π egységben ~1,3 kör)
        const ang = t * 2 * Math.PI * 0.62 + c * Math.PI, rad = 0.9 * t / 2.85;
        X.push([rad * Math.cos(ang) + noise * 0.12 * gauss(r), rad * Math.sin(ang) + noise * 0.12 * gauss(r)]); y.push(c);
      }
      return { X, y };
    },
    /* két Gauss-felhő (lineárisan szétválasztható) */
    blobs(n, seed, noise = 0.1) {
      const r = rng(seed), X = [], y = [];
      for (let i = 0; i < n; i++) {
        const c = i % 2, s = 0.18 + noise * 0.4;
        X.push([(c ? 0.45 : -0.45) + s * gauss(r), (c ? 0.35 : -0.35) + s * gauss(r)]); y.push(c);
      }
      return { X, y };
    }
  };
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* ------------------------------------------------------------------
     Aktivációs függvények: f(z) és a deriváltja z-ben, df(z)
     ------------------------------------------------------------------ */
  const sigm = z => (z >= 0 ? 1 / (1 + Math.exp(-z)) : Math.exp(z) / (1 + Math.exp(z)));
  const erf = x => {                                     // Abramowitz–Stegun 7.1.26 (|hiba| < 1,5·10⁻⁷)
    const s = Math.sign(x), a = Math.abs(x), t = 1 / (1 + 0.3275911 * a);
    const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-a * a);
    return s * y;
  };
  const Phi = x => 0.5 * (1 + erf(x / Math.SQRT2));
  const act = {
    linear: { f: z => z, df: () => 1, name: "lineáris" },
    step: { f: z => (z > 0 ? 1 : 0), df: () => 0, name: "lépcső" },
    sigmoid: { f: sigm, df: z => { const s = sigm(z); return s * (1 - s); }, name: "szigmoid" },
    tanh: { f: Math.tanh, df: z => { const t = Math.tanh(z); return 1 - t * t; }, name: "tanh" },
    relu: { f: z => (z > 0 ? z : 0), df: z => (z > 0 ? 1 : 0), name: "ReLU" },
    leaky: { f: z => (z > 0 ? z : 0.01 * z), df: z => (z > 0 ? 1 : 0.01), name: "szivárgó ReLU" },
    gelu: { f: z => z * Phi(z), df: z => Phi(z) + z * Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI), name: "GELU" }
  };

  function softmax(z) {
    const m = Math.max(...z), e = z.map(v => Math.exp(v - m)), s = e.reduce((a, b) => a + b, 0);
    return e.map(v => v / s);
  }

  /* ------------------------------------------------------------------
     MLP: sizes = [bemenet, rejtett…, kimenet]
     opts: { act: "tanh", out: "sigmoid" | "softmax" | "linear", seed,
             init: "auto" (He ReLU-hoz, különben LeCun) | "xavier" | "he" | "zero" | szám (szórás) }
     A kimeneti veszteség: szigmoid → bináris keresztentrópia, softmax →
     keresztentrópia, lineáris → ½·(négyzetes hiba). Mindháromnál a kimeneti
     „delta” egyszerűen ŷ − y.
     ------------------------------------------------------------------ */
  class MLP {
    constructor(sizes, opts = {}) {
      this.sizes = sizes.slice();
      this.act = opts.act || "tanh";
      this.out = opts.out || "sigmoid";
      this.initMode = opts.init || "auto";
      this.init(opts.seed || 1);
    }
    init(seed) {
      const r = rng(seed), S = this.sizes, mode = this.initMode;
      this.rnd = rng(seed + 7919);                                   // a dropout-maszkokhoz
      this.W = []; this.b = [];
      for (let l = 0; l < S.length - 1; l++) {
        const nin = S[l], nout = S[l + 1];
        const relu = this.act === "relu" || this.act === "leaky", hid = l < S.length - 2;
        const sc = typeof mode === "number" ? mode
          : mode === "zero" ? 0
          : mode === "he" ? Math.sqrt(2 / nin)
          : mode === "xavier" ? Math.sqrt(2 / (nin + nout))
          : (relu && hid ? Math.sqrt(2 / nin) : Math.sqrt(1 / nin));   // auto: He / LeCun-kezdés
        this.W.push(Array.from({ length: nout }, () => Array.from({ length: nin }, () => sc * gauss(r))));
        this.b.push(Array.from({ length: nout }, () => (mode === "auto" && relu && hid ? 0.05 : 0)));
      }
      this.t = 0;
      this.mW = this.W.map(M => M.map(row => row.map(() => 0))); this.vW = this.W.map(M => M.map(row => row.map(() => 0)));
      this.mb = this.b.map(v => v.map(() => 0)); this.vb = this.b.map(v => v.map(() => 0));
    }
    get nParams() { return this.W.reduce((s, M, l) => s + M.length * M[0].length + this.b[l].length, 0); }
    /* teljes előre irányuló menet: A[0] = x, A[l] = a réteg kimenete, Z[l-1] = a réteg z-je */
    forwardAll(x) {
      const A = [x], Z = [], L = this.W.length, f = act[this.act].f;
      for (let l = 0; l < L; l++) {
        const M = this.W[l], bb = this.b[l], a = A[l], z = new Array(M.length);
        for (let j = 0; j < M.length; j++) { let s = bb[j]; const row = M[j]; for (let i = 0; i < row.length; i++) s += row[i] * a[i]; z[j] = s; }
        Z.push(z);
        if (l < L - 1) A.push(z.map(f));
        else A.push(this.out === "softmax" ? softmax(z) : this.out === "sigmoid" ? z.map(sigm) : z.slice());
      }
      return { A, Z };
    }
    predict(x) { const { A } = this.forwardAll(x); return A[A.length - 1]; }
    /* előre irányuló menet tanításhoz, fordított dropouttal: a rejtett rétegek minden
       kimenetét p valószínűséggel kinullázza, a megmaradókat 1/(1 − p)-vel szorozza.
       Visszaadja a maszkokat is (D[l]: az l-edik rejtett réteg szorzói). */
    forwardTrain(x, p) {
      if (!p) return this.forwardAll(x);
      const A = [x], Z = [], D = [], L = this.W.length, f = act[this.act].f, keep = 1 / (1 - p);
      for (let l = 0; l < L; l++) {
        const M = this.W[l], bb = this.b[l], a = A[l], z = new Array(M.length);
        for (let j = 0; j < M.length; j++) { let s = bb[j]; const row = M[j]; for (let i = 0; i < row.length; i++) s += row[i] * a[i]; z[j] = s; }
        Z.push(z);
        if (l < L - 1) { const d = z.map(() => (this.rnd() < p ? 0 : keep)); D.push(d); A.push(z.map((v, j) => f(v) * d[j])); }
        else A.push(this.out === "softmax" ? softmax(z) : this.out === "sigmoid" ? z.map(sigm) : z.slice());
      }
      return { A, Z, D };
    }
    /* egy köteg (X, Y) átlagos veszteségének gradiense, majd egy frissítés.
       Y: szigmoidnál [0/1] vagy szám; softmaxnál osztálysorszám; lineárisnál szám vagy tömb.
       opt: "sgd" | "momentum" (v ← βv + g, w ← w − ηv) | "rmsprop" | "adam"; l2: λ (a gradienshez adott λw);
       dropout: a rejtett kimenetek elejtési valószínűsége (csak tanításkor). */
    trainBatch(X, Y, { lr = 0.03, opt = "adam", l2 = 0, dropout = 0, beta = 0.9 } = {}) {
      const L = this.W.length, df = act[this.act].df;
      const gW = this.W.map(M => M.map(row => row.map(() => 0))), gb = this.b.map(v => v.map(() => 0));
      let loss = 0;
      for (let n = 0; n < X.length; n++) {
        const { A, Z, D } = this.forwardTrain(X[n], dropout), out = A[L];
        const t = this.target(Y[n], out.length);
        loss += this.lossOf(out, t);
        let delta = out.map((o, k) => o - t[k]);
        for (let l = L - 1; l >= 0; l--) {
          const a = A[l], M = this.W[l];
          for (let j = 0; j < M.length; j++) { gb[l][j] += delta[j]; const g = gW[l][j]; for (let i = 0; i < a.length; i++) g[i] += delta[j] * a[i]; }
          if (l > 0) {
            const z = Z[l - 1], nd = new Array(a.length).fill(0);
            for (let j = 0; j < M.length; j++) { const row = M[j], dj = delta[j]; for (let i = 0; i < row.length; i++) nd[i] += row[i] * dj; }
            for (let i = 0; i < nd.length; i++) nd[i] *= df(z[i]) * (D ? D[l - 1][i] : 1);
            delta = nd;
          }
        }
      }
      const m = X.length;
      this.t++;
      const b1 = 0.9, b2 = 0.999, eps = 1e-8, c1 = 1 - Math.pow(b1, this.t), c2 = 1 - Math.pow(b2, this.t);
      const upd = (P, G, Mo, Ve, i, j, reg) => {
        const g = G / m + reg * P[i][j];
        if (opt === "adam") {
          Mo[i][j] = b1 * Mo[i][j] + (1 - b1) * g; Ve[i][j] = b2 * Ve[i][j] + (1 - b2) * g * g;
          P[i][j] -= lr * (Mo[i][j] / c1) / (Math.sqrt(Ve[i][j] / c2) + eps);
        } else if (opt === "momentum") {
          Mo[i][j] = beta * Mo[i][j] + g; P[i][j] -= lr * Mo[i][j];
        } else if (opt === "rmsprop") {
          Ve[i][j] = 0.9 * Ve[i][j] + 0.1 * g * g; P[i][j] -= lr * g / (Math.sqrt(Ve[i][j]) + 1e-8);
        } else P[i][j] -= lr * g;
      };
      for (let l = 0; l < L; l++) {
        const M = this.W[l];
        for (let j = 0; j < M.length; j++) for (let i = 0; i < M[j].length; i++) upd(M, gW[l][j][i], this.mW[l], this.vW[l], j, i, l2);
        const bw = [this.b[l]], bm = [this.mb[l]], bv = [this.vb[l]];
        for (let j = 0; j < this.b[l].length; j++) upd(bw, gb[l][j], bm, bv, 0, j, 0);
      }
      return loss / m;
    }
    target(y, k) {
      if (this.out === "softmax") return Array.from({ length: k }, (_, c) => (c === y ? 1 : 0));
      return Array.isArray(y) ? y : [y];
    }
    lossOf(out, t) {
      const e = 1e-12;
      if (this.out === "softmax") return -Math.log(Math.max(e, out[t.indexOf(1)]));
      if (this.out === "sigmoid") return out.reduce((s, o, k) => s - (t[k] * Math.log(Math.max(e, o)) + (1 - t[k]) * Math.log(Math.max(e, 1 - o))), 0);
      return out.reduce((s, o, k) => s + 0.5 * (o - t[k]) ** 2, 0);
    }
    loss(X, Y) { let s = 0; for (let n = 0; n < X.length; n++) { const o = this.predict(X[n]); s += this.lossOf(o, this.target(Y[n], o.length)); } return s / Math.max(1, X.length); }
    /* egy epoch keverve, mini-kötegekben */
    epoch(X, Y, { batch = 10, lr, opt, l2, dropout, beta, rnd } = {}) {
      const idx = shuffle(X.map((_, i) => i), rnd || Math.random);
      let s = 0, nb = 0;
      for (let k = 0; k < idx.length; k += batch) {
        const part = idx.slice(k, k + batch);
        s += this.trainBatch(part.map(i => X[i]), part.map(i => Y[i]), { lr, opt, l2, dropout, beta }); nb++;
      }
      return s / Math.max(1, nb);
    }
    accuracy(X, Y) {
      let ok = 0;
      for (let n = 0; n < X.length; n++) {
        const o = this.predict(X[n]);
        const c = this.out === "softmax" ? o.indexOf(Math.max(...o)) : (o[0] > 0.5 ? 1 : 0);
        if (c === Y[n]) ok++;
      }
      return ok / Math.max(1, X.length);
    }
  }

  /* paraméterszám rétegméretekből: Σ (n_be + 1) · n_ki */
  const countParams = (sizes, bias = true) => sizes.slice(1).reduce((s, n, l) => s + sizes[l] * n + (bias ? n : 0), 0);

  window.ML = { rng, gauss, shuffle, data, act, softmax, sigmoid: sigm, MLP, countParams };
})();
