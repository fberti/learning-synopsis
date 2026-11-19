  /* ==================================================================
     w1: 9.1, 9.2, 9.6 widgetjei (sir-network, epidemic-threshold, opinion-dynamics)
     A saját segédfüggvények blokkban, hogy ne ütközzenek a w2 neveivel.
     ================================================================== */
  {
    const fmM = (x, d = 2) => fmt(x, d).replace(",", "{,}");                 // KaTeX-be
    const pct = (x, d = 0) => fmt(100 * x, d) + " %";
    /* egész szám ezres tagolással (5 jegytől, nem törő szóközzel) */
    const big = x => { const s = String(Math.round(x)); return s.length >= 5 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : s; };
    const sv = c => (String(c).startsWith("--") ? `var(${c})` : c);
    const dot = c => `<span style="display:inline-block;width:.8em;height:.8em;border-radius:50%;background:${sv(c)};vertical-align:-.05em;margin-right:.25em"></span>`;
    const dash = (c, dashed) => `<span style="display:inline-block;width:1.6em;height:0;border-top:2.5px ${dashed ? "dashed" : "solid"} ${sv(c)};vertical-align:.25em;margin-right:.25em"></span>`;
    const onTheme = fn => new MutationObserver(fn).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    /* láthatóság: fn(true/false) – a widget a képernyőn van-e (és a lap nem rejtett) */
    function watchVis(root, fn) {
      let inView = true;
      if ("IntersectionObserver" in window) new IntersectionObserver(es => es.forEach(e => { inView = e.isIntersecting; fn(inView && !document.hidden); })).observe(root);
      document.addEventListener("visibilitychange", () => fn(inView && !document.hidden));
    }
    /* saját vászon (diagramokhoz) */
    function canvasBox(parent, aspect, maxW = 760) {
      const c = h("canvas", { style: "display:block;touch-action:manipulation;max-width:100%" });
      parent.append(c);
      const o = { c, ctx: c.getContext("2d"), w: 0, h: 0, aspect, onResize: null };
      o.resize = () => {
        const w = Math.min(maxW, parent.clientWidth || 340), hh = Math.round(w * o.aspect), dpr = window.devicePixelRatio || 1;
        c.width = Math.round(w * dpr); c.height = Math.round(hh * dpr); c.style.width = w + "px"; c.style.height = hh + "px";
        o.ctx.setTransform(dpr, 0, 0, dpr, 0, 0); o.w = w; o.h = hh;
        if (o.onResize) o.onResize();
      };
      let t; addEventListener("resize", () => { clearTimeout(t); t = setTimeout(o.resize, 150); });
      onTheme(() => o.onResize && o.onResize());
      o.resize();
      return o;
    }
    /* koordináta-rendszer a vásznon → { X, Y } leképezések */
    function frame(o, { x0 = 0, x1 = 1, y0 = 0, y1 = 1, xt = [], yt = [], xl = "", yl = "", fx = v => fmt(v, 2), fy = v => fmt(v, 2), pad = {} }) {
      const ctx = o.ctx, Wd = o.w, Ht = o.h, P = Object.assign({ l: 58, r: 12, t: 12, b: 36 }, pad);
      ctx.clearRect(0, 0, Wd, Ht);
      const X = v => P.l + (v - x0) / (x1 - x0 || 1) * (Wd - P.l - P.r), Y = v => Ht - P.b - (v - y0) / (y1 - y0 || 1) * (Ht - P.t - P.b);
      const muted = GK.css("--muted"), border = GK.css("--border"), text = GK.css("--text");
      ctx.lineWidth = 1; ctx.font = "11px system-ui, sans-serif"; ctx.fillStyle = muted; ctx.setLineDash([]);
      yt.forEach(v => {
        ctx.strokeStyle = border; ctx.beginPath(); ctx.moveTo(P.l, Y(v)); ctx.lineTo(Wd - P.r, Y(v)); ctx.stroke();
        ctx.textAlign = "right"; ctx.textBaseline = "middle"; ctx.fillText(fy(v), P.l - 5, Y(v));
      });
      xt.forEach(v => {
        ctx.strokeStyle = border; ctx.beginPath(); ctx.moveTo(X(v), Ht - P.b); ctx.lineTo(X(v), Ht - P.b + 4); ctx.stroke();
        ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.fillText(fx(v), X(v), Ht - P.b + 6);
      });
      ctx.strokeStyle = text; ctx.globalAlpha = 0.6;
      ctx.beginPath(); ctx.moveTo(P.l, P.t); ctx.lineTo(P.l, Ht - P.b); ctx.lineTo(Wd - P.r, Ht - P.b); ctx.stroke(); ctx.globalAlpha = 1;
      ctx.fillStyle = text; ctx.font = "12px system-ui, sans-serif";
      if (xl) { ctx.textAlign = "center"; ctx.textBaseline = "bottom"; ctx.fillText(xl, P.l + (Wd - P.l - P.r) / 2, Ht - 2); }
      if (yl) { ctx.save(); ctx.translate(11, P.t + (Ht - P.t - P.b) / 2); ctx.rotate(-Math.PI / 2); ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(yl, 0, 0); ctx.restore(); }
      return { X, Y, P };
    }
    function poly(ctx, pts, col, w = 2, dsh = null, alpha = 1) {
      if (pts.length < 1) return;
      ctx.strokeStyle = GK.color(col); ctx.lineWidth = w; ctx.globalAlpha = alpha; ctx.setLineDash(dsh || []);
      ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
      ctx.setLineDash([]); ctx.globalAlpha = 1;
    }
    /* darabolt futtatás: job(i), i = 0 … total−1, kötegenként per darab; onProg(kész), onDone(); visszatér: leállító függvény */
    function chunked(total, per, job, onProg, onDone) {
      let i = 0, dead = false;
      const tick = () => {
        if (dead) return;
        const end = Math.min(total, i + per);
        for (; i < end; i++) job(i);
        onProg(i);
        if (i < total) setTimeout(tick, 0); else onDone && onDone();
      };
      setTimeout(tick, 0);
      return () => { dead = true; };
    }
    /* union–find a komponensmérettel */
    function makeUF(n) {
      const p = new Int32Array(n), s = new Int32Array(n).fill(1);
      for (let i = 0; i < n; i++) p[i] = i;
      const f = x => { while (p[x] !== x) { p[x] = p[p[x]]; x = p[x]; } return x; };
      return { f, s, union(a, b) { a = f(a); b = f(b); if (a === b) return; if (s[a] < s[b]) [a, b] = [b, a]; p[b] = a; s[a] += s[b]; } };
    }
    /* G(n, m) elutasításos mintavétellel (ritka gráfra gyors) */
    function sparseGnm(n, m, R) {
      const seen = new Set(), E = [];
      while (E.length < m) {
        const a = Math.floor(R() * n), b = Math.floor(R() * n);
        if (a === b) continue;
        const k = a < b ? a * n + b : b * n + a;
        if (seen.has(k)) continue;
        seen.add(k); E.push({ a, b, w: 1 });
      }
      return E;
    }
    /* k különböző véletlen elem 0 … n−1 közül */
    function pickK(n, k, R) {
      const s = new Set(); k = Math.min(k, n);
      while (s.size < k) s.add(Math.floor(R() * n));
      return [...s];
    }
    /* élperkoláció: minden él T eséllyel marad → { exp: Σ s²/(n·nAct) (várható kitörés egy véletlen nem beoltott kezdőből, n-hez képest), giant: legnagyobb/n } */
    function percolate(n, E, T, R, removed = null, nAct = n) {
      const uf = makeUF(n);
      for (let i = 0; i < E.length; i++) if (R() < T) uf.union(E[i].a, E[i].b);
      let s2 = 0, mx = 0;
      for (let v = 0; v < n; v++) if (uf.f(v) === v && !(removed && removed[v])) { const s = uf.s[v]; s2 += s * s; if (s > mx) mx = s; }
      return { exp: s2 / (n * nAct), giant: mx / n };
    }
    /* immunizálás: a csúcsok f részének kiválasztása (rand / hub / acq) → Uint8Array jelölés */
    function immunize(n, E, f, how, R) {
      const k = Math.round(f * n), out = new Uint8Array(n);
      if (k <= 0) return out;
      if (how === "rand") pickK(n, k, R).forEach(v => (out[v] = 1));
      else if (how === "hub") {
        const d = degStats(n, E).k, ord = [...Array(n).keys()].sort((a, b) => d[b] - d[a] || a - b);
        ord.slice(0, k).forEach(v => (out[v] = 1));
      } else {
        const L = nbrs(n, E); let c = 0, guard = 0;
        while (c < k && guard++ < 100 * n) {
          const v = Math.floor(R() * n); if (!L[v].length) continue;
          const u = L[v][Math.floor(R() * L[v].length)];
          if (!out[u]) { out[u] = 1; c++; }
        }
      }
      return out;
    }
    /* a beoltás utáni gráf statisztikája: a maradék csúcsokon */
    function remStats(n, E, removed) {
      const idx = new Int32Array(n).fill(-1); let m = 0;
      for (let v = 0; v < n; v++) if (!removed[v]) idx[v] = m++;
      const E2 = E.filter(e => !removed[e.a] && !removed[e.b]).map(e => ({ a: idx[e.a], b: idx[e.b] }));
      const d0 = degStats(n, E).k; let sd = 0, c = 0;
      for (let v = 0; v < n; v++) if (removed[v]) { sd += d0[v]; c++; }
      return Object.assign(degStats(m, E2), { nRem: m, E: E.filter(e => !removed[e.a] && !removed[e.b]), immK: c ? sd / c : NaN });
    }
    /* az erőirányított elrendezésben a magányos csúcsok messzire szállnak: behúzzuk őket a többiek peremére */
    function tidyLayout(P, asp) {
      const Q = P.map(p => [p[0], p[1] * asp]), n = Q.length;
      const cx = Q.reduce((s, p) => s + p[0], 0) / n, cy = Q.reduce((s, p) => s + p[1], 0) / n;
      const d = Q.map(p => Math.hypot(p[0] - cx, p[1] - cy)), lim = 1.08 * d.slice().sort((a, b) => a - b)[Math.floor(0.9 * (n - 1))];
      return GK.normalize(Q.map((p, i) => (d[i] > lim ? [cx + (p[0] - cx) * lim / d[i], cy + (p[1] - cy) * lim / d[i]] : p)), asp);
    }
    /* a teszteléshez (node) – nincs mellékhatása */
    const _A = { sparseGnm, percolate, immunize, remStats, makeUF };
    void _A;

    /* ------------------------------------------------------------------
       9.1  sir-network – SI / SIS / SIR egy választható hálózaton
       ------------------------------------------------------------------ */
    W["sir-network"] = root => {
      header(root, "Járvány a hálózaton: SI, SIS, SIR",
        "Diszkrét időben: minden lépésben minden fertőző minden fogékony szomszédját $\\beta$ eséllyel megfertőzi, aztán $\\gamma$ eséllyel meggyógyul " +
        "(SIS: újra fogékony lesz, SIR: védett lesz; SI: sosem gyógyul). <b>Kattints egy csúcsra</b>: onnan indul a járvány. " +
        "A szaggatott görbe a <b>keverő populáció</b>: ugyanannyi ember, ugyanannyi kontaktus, de mindenki bárkivel találkozhat.");
      math(root.querySelector(".w-sub"));
      const narrow = root.clientWidth < 560;
      const NETS = [["ring", "rács"], ["ws", "kisvilág"], ["er", "véletlen (ER)"], ["ba", "skálafüggetlen (BA)"], ["arviz", "Árvízhét"], ["karate", "karateklub"]];
      let key = "er", n = 200, gseed = 1, model = "SIR", beta = 0.15, gamma = 0.2, seeds = [], run = 1, showMF = true;
      let N = 0, E = [], L = [], st0 = null, frames = [], t = 0, playing = false, vis = true, timer = 0, stopHist = null, histRes = null, pickR = rng(1);

      const c1 = h("div", { class: "controls" }), c2 = h("div", { class: "controls" }), c3 = h("div", { class: "controls" }),
        c4 = h("div", { class: "controls" }), c5 = h("div", { class: "controls" });
      toggleGroup(c1, NETS, key, v => { key = v; buildGraph(); });
      const nOut = h("b", { style: "font-family:var(--mono);min-width:2.2em" }, String(n));
      const nSl = h("input", { type: "range", min: 50, max: 400, step: 10, value: n, "aria-label": "csúcsok száma", style: "width:9rem;max-width:40vw",
        oninput: () => { n = +nSl.value; nOut.textContent = n; }, onchange: () => buildGraph() });
      const nLab = h("label", null, "n =", nSl, nOut);
      const seedOut = h("b", { style: "font-family:var(--mono)" }, "1");
      c2.append(nLab, h("label", null, "minta:", seedOut), btn("Új gráf", () => { gseed++; seedOut.textContent = gseed; buildGraph(); }));
      toggleGroup(c3, [["SI", "SI"], ["SIS", "SIS"], ["SIR", "SIR"]], model, v => { model = v; gSl.disabled = v === "SI"; newRun(); });
      const bOut = h("b", { style: "font-family:var(--mono);min-width:2.6em" }, fmt(beta, 2)), gOut = h("b", { style: "font-family:var(--mono);min-width:2.6em" }, fmt(gamma, 2));
      const bSl = h("input", { type: "range", min: 0, max: 1, step: 0.01, value: beta, "aria-label": "β", style: "width:8rem;max-width:36vw",
        oninput: () => { beta = +bSl.value; bOut.textContent = fmt(beta, 2); newRun(); } });
      const gSl = h("input", { type: "range", min: 0, max: 1, step: 0.01, value: gamma, "aria-label": "γ", style: "width:8rem;max-width:36vw",
        oninput: () => { gamma = +gSl.value; gOut.textContent = fmt(gamma, 2); newRun(); } });
      c3.append(h("label", null, "β =", bSl, bOut), h("label", null, "γ =", gSl, gOut));
      c4.append(btn("1 fertőzött", () => { seeds = pickK(N, 1, pickR); newRun(); }), btn("5 véletlen fertőzött", () => { seeds = pickK(N, 5, pickR); newRun(); }),
        h("span", { class: "muted", style: "font-size:.88rem" }, "vagy kattints egy csúcsra"));
      const playB = btn("▶ Lejátszás", () => (playing ? pause() : play()), "btn primary");
      const cbMF = h("input", { type: "checkbox", checked: "", onchange: () => { showMF = cbMF.checked; drawChart(); } });
      c5.append(playB, btn("Lépés", () => { pause(); stepOnce(); }), btn("Újra", () => { pause(); run++; newRun(); }), h("label", null, cbMF, "keverő populáció"));
      root.append(c1, c2, c3, c4, c5);

      const cols = h("div", { class: "two-col" }), left = h("div"), right = h("div");
      cols.append(left, right); root.append(cols);
      const legend = h("p", { class: "muted", style: "font-size:.86rem;margin:.3rem 0 0", html:
        `${dot(SIR_COLORS.S)}fogékony ${dot(SIR_COLORS.I)}fertőző ${dot(SIR_COLORS.R)}gyógyult · kiemelt él: ki kit fertőzött meg` });
      const chartBox = h("div");
      const legend2 = h("p", { class: "muted", style: "font-size:.86rem;margin:.3rem 0 0", html:
        `${dash(SIR_COLORS.S)}S ${dash(SIR_COLORS.I)}I ${dash(SIR_COLORS.R)}R (a hálózaton) · ${dash("--text", true)} keverő populáció` });
      const ro = h("div", { class: "readout" }), ro2 = h("div", { class: "readout", style: "font-family:inherit" });
      right.append(chartBox, legend2, ro, ro2);

      const view = new GK.View(left, { aspect: narrow ? 0.9 : 0.95, radius: 4, draggable: false });
      left.append(legend);
      const chart = canvasBox(chartBox, narrow ? 0.7 : 0.75, 520);
      chart.onResize = () => drawChart();

      /* kattintás: a legközelebbi csúcs (kis csúcsoknál is könnyen eltalálható) */
      view.c.addEventListener("pointerup", ev => {
        const r = view.c.getBoundingClientRect(), x = ev.clientX - r.left, y = ev.clientY - r.top;
        let best = -1, bd = Math.max(view.o.radius + 5, 14);
        view.nodes.forEach((nd, i) => { const [nx, ny] = view.px(nd), d = Math.hypot(nx - x, ny - y); if (d < bd) { bd = d; best = i; } });
        if (best >= 0) { pause(); seeds = [best]; newRun(); }
      });

      /* hist (100 futás) */
      const hc = h("div", { class: "controls" });
      const prog = h("span", { class: "muted", style: "font-size:.88rem" });
      hc.append(btn("100 futás átlaga", () => runHist()), prog);
      const histBox = h("div", { style: "display:none" });
      const hro = h("div", { class: "readout" });
      root.append(hc, histBox);
      const hchart = canvasBox(histBox, narrow ? 0.62 : 0.38, 760);
      hchart.onResize = () => drawHist();
      histBox.append(hro);
      root.append(h("p", { style: "margin:.5rem 0 0;font-weight:600" },
        "Ugyanaz a β és γ más hálózaton más járványt ad: a keverő populáció a legrosszabb eset, a rács a legszelídebb."));

      function buildGraph() {
        pause();
        const big_ = !["arviz", "karate"].includes(key);
        nSl.disabled = !big_; nLab.style.opacity = big_ ? 1 : 0.5;
        const asp = view.o.aspect, R = rng(gseed * 101 + 7);
        pickR = rng(gseed * 977 + 13);
        let nodes;
        if (key === "arviz") {
          const g = preset("arviz", asp); N = g.nodes.length; E = g.edges.map(e => ({ a: e.a, b: e.b, w: 1 }));
          nodes = g.nodes.map(nd => ({ label: nd.label, x: nd.x, y: nd.y })); view.o.radius = 15;
          seeds = [g.nodes.findIndex(nd => nd.label === "Kl")];
        } else if (key === "karate") {
          const g = preset("karate", asp); N = g.nodes.length; E = g.edges.map(e => ({ a: e.a, b: e.b, w: 1 }));
          nodes = g.nodes.map(nd => ({ label: nd.label, x: nd.x, y: nd.y })); view.o.radius = narrow ? 8 : 10;
          seeds = [0];
        } else {
          N = n;
          if (key === "ring") E = ringLattice(n, 4);
          else if (key === "ws") E = wattsStrogatz(n, 4, 0.1, R).edges;
          else if (key === "er") E = sparseGnm(n, 2 * n, R);
          else E = barabasiAlbert(n, 2, R);
          const P = key === "ring" || key === "ws" ? GK.normalize(GK.circleLayout(n), asp)
            : tidyLayout(GK.forceLayout(n, E.map(e => [e.a, e.b]), { seed: gseed, iters: n > 250 ? 160 : 260, aspect: asp }), asp);
          nodes = P.map(p => ({ label: "", x: p[0], y: p[1] }));
          view.o.radius = n <= 100 ? 5 : n <= 250 ? 4 : 3;
          seeds = pickK(N, 1, pickR);
        }
        L = nbrs(N, E);
        view.setGraph(nodes, E);
        renderStatic();
        newRun();
      }
      /* egy futás (ugyanaz a lépés, mint a w0 simulateSIR-je) */
      function simulate(R, keep) {
        const st = new Int8Array(N), par = new Int32Array(N).fill(-1), ever = new Uint8Array(N), mark = new Int32Array(N).fill(-1);
        seeds.forEach(s => { st[s] = 1; ever[s] = 1; });
        let nEver = new Set(seeds).size;
        const cnt = () => { let S = 0, I = 0, Rr = 0; for (let i = 0; i < N; i++) st[i] === 0 ? S++ : st[i] === 1 ? I++ : Rr++; return { S, I, R: Rr, ever: nEver }; };
        const out = keep ? [{ c: cnt(), st: st.slice(), par: par.slice() }] : null;
        const maxT = model === "SIS" ? 150 : 400;
        for (let t_ = 1; t_ <= maxT; t_++) {
          const inf = [];
          for (let i = 0; i < N; i++) if (st[i] === 1) inf.push(i);
          if (!inf.length) break;
          if (model === "SI" && !inf.some(i => L[i].some(j => st[j] === 0))) break;
          if (beta === 0 && model === "SI") break;
          const nw = [];
          inf.forEach(i => L[i].forEach(j => { if (st[j] === 0 && mark[j] !== t_ && R() < beta) { mark[j] = t_; par[j] = i; nw.push(j); } }));
          if (model !== "SI") inf.forEach(i => { if (R() < gamma) st[i] = model === "SIS" ? 0 : 2; });
          nw.forEach(j => { st[j] = 1; if (!ever[j]) { ever[j] = 1; nEver++; } });
          if (keep) out.push({ c: cnt(), st: st.slice(), par: par.slice() });
        }
        return keep ? out : nEver;
      }
      function newRun() {
        if (stopHist) { stopHist(); stopHist = null; }
        if (histRes) { histRes = null; histBox.style.display = "none"; prog.textContent = ""; }
        frames = simulate(rng(run * 7919 + gseed * 31 + 3), true);
        mf = mfCurve();
        delete root.dataset.hist;
        t = 0;
        renderStatic();
        show();
      }
      function show() {
        const F = frames[t], hlE = new Set();
        view.nodes.forEach((nd, i) => { nd.color = F.st[i] === 0 ? SIR_COLORS.S : F.st[i] === 1 ? SIR_COLORS.I : SIR_COLORS.R; });
        for (let j = 0; j < N; j++) if (F.par[j] >= 0 && (model === "SIS" ? F.st[j] === 1 : F.st[j] !== 0)) hlE.add(GK.edgeKey(F.par[j], j));
        view.hlE = hlE; view.hl = new Set(seeds); view.dim = false;
        view.edges.forEach(e => {
          const on = hlE.has(GK.edgeKey(e.a, e.b));
          e.color = on ? "--accent" : null; e.width = on ? (N > 50 ? 2 : 3) : (N > 50 ? 0.8 : 1.6); e.alpha = on ? 1 : (N > 50 ? 0.45 : 0.8);
        });
        view.draw();
        const c = F.c, end = t === frames.length - 1;
        ro.innerHTML = `lépés: <b>${t}</b>${end ? " (vége)" : ""} · S = ${c.S} · I = <b>${c.I}</b>` + (model === "SIR" ? ` · R = ${c.R}` : "") +
          `<br>összesen megfertőzött: <b>${c.ever}</b> / ${N} (${pct(c.ever / N)})`;
        root.dataset.counts = frames.slice(0, t + 1).map(f => f.c.I).join(",");
        root.dataset.ever = frames.slice(0, t + 1).map(f => f.c.ever).join(",");
        playB.disabled = end; if (end) pause();
        drawChart();
      }
      function stepOnce() { if (t < frames.length - 1) { t++; show(); } }
      function tick() { if (!playing) return; if (t >= frames.length - 1) { pause(); return; } stepOnce(); }
      function sched() { clearInterval(timer); timer = 0; if (playing && vis) timer = setInterval(tick, N > 50 ? 180 : 600); }
      function play() { if (t >= frames.length - 1) { t = 0; } playing = true; playB.textContent = "❚❚ Szünet"; sched(); }
      function pause() { playing = false; playB.textContent = "▶ Lejátszás"; sched(); }
      watchVis(root, v => { vis = v; sched(); });

      let mf = null;
      function mfCurve() {
        const ds = degStats(N, E);
        return meanField(N, ds.k1, { model, beta, gamma: model === "SI" ? 0 : gamma, i0: new Set(seeds).size, maxT: model === "SIS" ? 150 : 400 });
      }
      const xMax = () => Math.max(10, frames.length - 1, showMF && mf ? mf.length - 1 : 0);
      function drawChart() {
        if (!chart.w || !frames.length) return;
        const xm = xMax(), step = xm <= 20 ? 2 : xm <= 50 ? 10 : xm <= 120 ? 20 : xm <= 250 ? 50 : 100;
        const xt = []; for (let v = 0; v <= xm; v += step) xt.push(v);
        const fr = frame(chart, { x1: xm, xt, yt: [0, 0.25, 0.5, 0.75, 1], xl: "lépés", yl: "a csúcsok aránya", fy: v => pct(v) });
        const ctx = chart.ctx;
        const keys = model === "SIR" ? ["S", "I", "R"] : ["S", "I"];
        if (showMF) {
          keys.forEach(k => poly(ctx, mf.map((o, i) => [fr.X(i), fr.Y(o[k] / N)]), SIR_COLORS[k], 1.8, [6, 4], 0.85));
          root.dataset.mf = JSON.stringify(mf[mf.length - 1] ? { S: mf[mf.length - 1].S / N, I: mf[mf.length - 1].I / N, R: mf[mf.length - 1].R / N, T: mf.length - 1 } : {});
        }
        keys.forEach(k => poly(ctx, frames.slice(0, t + 1).map((f, i) => [fr.X(i), fr.Y(f.c[k] / N)]), SIR_COLORS[k], 2.6));
        ctx.strokeStyle = GK.css("--accent"); ctx.globalAlpha = 0.5; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(fr.X(t), fr.P.t); ctx.lineTo(fr.X(t), chart.h - fr.P.b); ctx.stroke(); ctx.globalAlpha = 1;
      }
      function renderStatic() {
        const ds = degStats(N, E), T = transmissibility(beta, model === "SI" ? 0 : gamma);
        ro2.innerHTML = `Átvitel: $T = \\dfrac{\\beta}{\\beta + \\gamma - \\beta\\gamma} = ${fmM(T, 3)}$` + (model === "SI" ? " (SI: $\\gamma = 0$, így $T = 1$)" : "") +
          `<br>$\\langle k\\rangle = ${fmM(ds.k1, 2)}$, $\\kappa = \\dfrac{\\langle k^2\\rangle}{\\langle k\\rangle} - 1 = ${fmM(ds.kappa, 2)}$` +
          `<br>A hálózaton $R_0 = T\\kappa = ${fmM(T * ds.kappa, 2)}$; a keverő populációban $R_0 = T\\langle k\\rangle = ${fmM(T * ds.k1, 2)}$.`;
        root.dataset.stat = JSON.stringify({ T, k1: ds.k1, kappa: ds.kappa });
        math(ro2);
      }

      function runHist() {
        if (stopHist) stopHist();
        pause();
        const RUNS = 100, res = [];
        histRes = res; histBox.style.display = ""; hchart.resize();
        stopHist = chunked(RUNS, N > 250 ? 4 : 10, i => res.push(simulate(rng(50000 + i * 17 + gseed * 7 + run * 1013), false) / N),
          k => { prog.innerHTML = `<progress max="${RUNS}" value="${k}" style="vertical-align:middle;width:7rem"></progress> ${k} / ${RUNS} futás`; drawHist(); },
          () => { stopHist = null; prog.textContent = `kész: ${RUNS} futás (${model}, β = ${fmt(beta, 2)}` + (model === "SI" ? "" : `, γ = ${fmt(gamma, 2)}`) + ")"; });
      }
      function drawHist() {
        const res = histRes;
        if (!res || !hchart.w) return;
        const bins = new Array(20).fill(0);
        res.forEach(x => bins[Math.min(19, Math.floor(x * 20))]++);
        const y0 = Math.max(5, ...bins), st = y0 <= 10 ? 2 : y0 <= 30 ? 5 : y0 <= 60 ? 10 : 20, ymax = Math.ceil(y0 / st) * st, yt = [];
        for (let v = 0; v <= ymax; v += st) yt.push(v);
        const fr = frame(hchart, { x1: 1, y1: ymax, xt: [0, 0.2, 0.4, 0.6, 0.8, 1], yt, xl: "a valaha megfertőzöttek aránya", yl: "futások", fx: v => pct(v), fy: v => String(v) });
        const ctx = hchart.ctx;
        ctx.fillStyle = GK.css("--setB");
        bins.forEach((b, i) => { if (b) ctx.fillRect(fr.X(i / 20) + 1, fr.Y(b), fr.X(1 / 20) - fr.X(0) - 2, fr.Y(0) - fr.Y(b)); });
        const mean = res.reduce((s, x) => s + x, 0) / (res.length || 1), low = res.filter(x => x < 0.1).length / (res.length || 1);
        poly(ctx, [[fr.X(mean), fr.P.t], [fr.X(mean), hchart.h - fr.P.b]], "--accent", 2, [5, 4]);
        ctx.fillStyle = GK.css("--accent"); ctx.font = "600 11px system-ui, sans-serif"; ctx.textAlign = mean > 0.7 ? "right" : "left"; ctx.textBaseline = "top";
        ctx.fillText("átlag", fr.X(mean) + (mean > 0.7 ? -4 : 4), fr.P.t + 2);
        const big_ = res.filter(x => x >= 0.1), bm = big_.length ? big_.reduce((s, x) => s + x, 0) / big_.length : NaN;
        hro.innerHTML = `${res.length} futás · átlag: <b>${pct(mean, 1)}</b> · a futások <b>${pct(low)}</b>-a halt el 10 % alatt` +
          (big_.length ? ` · a nagy járványok átlaga: ${pct(bm, 1)}` : "");
        root.dataset.hist = JSON.stringify({ runs: res.length, mean, low, bigMean: bm });
      }
      buildGraph();
    };

    /* ------------------------------------------------------------------
       9.2  epidemic-threshold – a járványküszöb: ER vs. BA, immunizálás
       ------------------------------------------------------------------ */
    W["epidemic-threshold"] = root => {
      header(root, "Járványküszöb: véletlen és skálafüggetlen hálózat",
        "Mindkét hálózatban átlagosan 4 kapcsolata van mindenkinek, de a BA-hálózatban vannak <b>hubok</b>. A kitörés akkor nagy, ha $R_0 = T\\kappa > 1$, " +
        "azaz $T > T_c = 1/\\kappa$, ahol $\\kappa = \\langle k^2\\rangle/\\langle k\\rangle - 1$. A görbe <b>élperkolációval</b> készül " +
        "(ez a SIR $\\gamma = 1$, $\\beta = T$ esete): minden él $T$ eséllyel „ad át”, és a kezdőcsúcs komponense fertőződik meg.");
      math(root.querySelector(".w-sub"));
      const narrow = root.clientWidth < 560;
      const Ts = []; for (let i = 0; i <= 30; i++) Ts.push(i / 50);
      const NC = { er: "--setA", ba: "--setB", ring: "--setC" }, NN = { er: "ER", ba: "BA", ring: "rács" };
      let n = 1000, gseed = 1, showRing = false, metric = "exp", f = 0.1, G = {}, stats = {}, curves = {}, stopC = null, stopI = null, imm = null, icurves = {}, vis = false, started = false;

      const c1 = h("div", { class: "controls" });
      c1.append(h("span", { class: "muted", style: "font-size:.92rem" }, "csúcsok száma:"));
      toggleGroup(c1, [[300, "300"], [1000, "1000"], [3000, "3000"]], n, v => { n = v; build(); });
      const seedOut = h("b", { style: "font-family:var(--mono)" }, "1");
      const cbRing = h("input", { type: "checkbox", onchange: () => { showRing = cbRing.checked; renderTable(); startCurves(); } });
      c1.append(h("label", null, "minta:", seedOut), btn("Új minta", () => { gseed++; seedOut.textContent = gseed; build(); }), h("label", null, cbRing, "rács is"));
      const c2 = h("div", { class: "controls" });
      c2.append(h("span", { class: "muted", style: "font-size:.92rem" }, "függőleges tengely:"));
      toggleGroup(c2, [["exp", "várható kitörés"], ["giant", "óriáskomponens"]], metric, v => { metric = v; drawCurves(); drawImm(); });
      root.append(c1, c2);
      const cols = h("div", { class: "two-col" }), left = h("div"), right = h("div");
      cols.append(left, right); root.append(cols);
      const tbl = h("div", { class: "tw", style: "overflow-x:auto" }), sizeBox = h("div", { class: "tw", style: "overflow-x:auto;margin-top:.6rem" });
      left.append(tbl, sizeBox);
      const chartBox = h("div"), prog = h("p", { class: "muted", style: "font-size:.86rem;margin:.3rem 0 0" });
      right.append(chartBox, prog);
      const chart = canvasBox(chartBox, narrow ? 0.8 : 0.85, 520);
      chart.onResize = () => drawCurves();

      /* immunizálás */
      root.append(h("div", { class: "w-title", style: "margin-top:1rem" }, "Immunizálás a BA-hálózaton"));
      root.append(h("p", { class: "w-sub", html: "A csúcsok $f$ részét beoltjuk (kivesszük a hálózatból). <b>Véletlen</b>: bárkit; <b>hubok</b>: a legnagyobb fokszámúakat " +
        "(ehhez ismerni kell a hálózatot); <b>ismerős-immunizálás</b>: egy véletlen ember egy véletlen ismerősét – a barátság-paradoxon miatt ő átlagosan " +
        "népszerűbb, és nem kell hozzá a teljes hálózat (Cohen, Havlin és ben-Avraham, 2003)." }));
      math(root.querySelectorAll(".w-sub")[1]);
      const c3 = h("div", { class: "controls" });
      const fOut = h("b", { style: "font-family:var(--mono);min-width:3em" }, "10 %");
      const fSl = h("input", { type: "range", min: 0, max: 0.3, step: 0.01, value: f, "aria-label": "beoltottak aránya", style: "width:11rem;max-width:50vw",
        oninput: () => { f = +fSl.value; fOut.textContent = pct(f); }, onchange: () => startImm() });
      c3.append(h("label", null, "f =", fSl, fOut));
      root.append(c3);
      const cols2 = h("div", { class: "two-col" }), l2 = h("div"), r2 = h("div");
      cols2.append(l2, r2); root.append(cols2);
      const itbl = h("div", { class: "tw", style: "overflow-x:auto" });
      l2.append(itbl);
      const ichartBox = h("div"), iprog = h("p", { class: "muted", style: "font-size:.86rem;margin:.3rem 0 0" });
      r2.append(ichartBox, iprog);
      const ichart = canvasBox(ichartBox, narrow ? 0.8 : 0.85, 520);
      ichart.onResize = () => drawImm();
      root.append(h("p", { style: "margin:.5rem 0 0;font-weight:600" },
        "A hubok miatt a skálafüggetlen hálózatban szinte nincs küszöb – de ha a hubokat oltod be, hirtelen lesz."));

      const nets = () => (showRing ? ["er", "ba", "ring"] : ["er", "ba"]);
      function build() {
        const R = rng(gseed * 13 + 5);
        G.er = sparseGnm(n, 2 * n, R); G.ba = barabasiAlbert(n, 2, R); G.ring = ringLattice(n, 4);
        ["er", "ba", "ring"].forEach(k => (stats[k] = degStats(n, G[k])));
        root.dataset.stats = JSON.stringify(Object.fromEntries(["er", "ba", "ring"].map(k => [k, { k1: stats[k].k1, k2: stats[k].k2, kappa: stats[k].kappa, Tc: stats[k].Tc, kmax: stats[k].kmax }])));
        renderTable();
        curves = {}; icurves = {}; imm = null;
        if (started) { startCurves(); startImm(); }
        else { drawCurves(); drawImm(); }
      }
      function renderTable() {
        const ks = nets();
        tbl.innerHTML = `<table><tr><th></th>${ks.map(k => `<th>${dot(NC[k])}${NN[k]}</th>`).join("")}</tr>` +
          `<tr><td>$\\langle k\\rangle$</td>${ks.map(k => `<td>${fmt(stats[k].k1, 2)}</td>`).join("")}</tr>` +
          `<tr><td>$\\langle k^2\\rangle$</td>${ks.map(k => `<td>${fmt(stats[k].k2, 1)}</td>`).join("")}</tr>` +
          `<tr><td>$\\kappa = \\langle k^2\\rangle/\\langle k\\rangle - 1$</td>${ks.map(k => `<td>${fmt(stats[k].kappa, 2)}</td>`).join("")}</tr>` +
          `<tr><td>$T_c = 1/\\kappa$</td>${ks.map(k => `<td><b>${fmt(stats[k].Tc, 3)}</b></td>`).join("")}</tr>` +
          `<tr><td>legnagyobb fokszám</td>${ks.map(k => `<td>${stats[k].kmax}</td>`).join("")}</tr></table>` +
          (showRing ? `<p class="muted" style="font-size:.86rem;margin:.3rem 0 0">A rácsban a $T_c = 1/\\kappa$ képlet nem érvényes: tele van rövid körökkel, és egy dimenzióban az óriáskomponenshez $T \\to 1$ kellene.</p>` : "");
        math(tbl);
      }
      /* méretfüggés: T_c ER-ben és BA-ban különböző n-re (egy-egy minta) */
      function sizeTable() {
        const NS = [300, 1000, 3000, 10000, 100000], rows = [];
        sizeBox.innerHTML = "";
        chunked(NS.length, 1, i => {
          const R = rng(4242 + i), m = NS[i];
          rows.push([m, degStats(m, sparseGnm(m, 2 * m, R)).Tc, degStats(m, barabasiAlbert(m, 2, R)).Tc]);
        }, () => {
          sizeBox.innerHTML = `<table><tr><th>$n$</th><th>${dot(NC.er)}$T_c$ (ER)</th><th>${dot(NC.ba)}$T_c$ (BA)</th></tr>` +
            rows.map(r => `<tr><td>${big(r[0])}</td><td>${fmt(r[1], 3)}</td><td>${fmt(r[2], 3)}</td></tr>`).join("") + `</table>` +
            `<p style="font-size:.9rem;margin:.3rem 0 0"><b>A BA-hálózat küszöbe a mérettel csökken, az ER-é nem.</b> ` +
            `<span class="muted">(Skálafüggetlen hálózatban $\\langle k^2\\rangle$ a legnagyobb hubbal együtt nő, így $T_c \\to 0$.)</span></p>`;
          root.dataset.sizes = JSON.stringify(rows);
          math(sizeBox);
        });
      }
      const SAMPLES = () => (n <= 1000 ? 12 : 6);
      function startCurves() {
        if (stopC) stopC();
        const ks = nets(), S = SAMPLES(), jobs = [];
        ks.forEach(k => { if (!curves[k]) curves[k] = Ts.map(() => ({ exp: 0, giant: 0, c: 0 })); });
        for (let s = 0; s < S; s++) ks.forEach(k => Ts.forEach((_, j) => { if (curves[k][j].c <= s) jobs.push([k, j, s]); }));
        if (!jobs.length) { drawCurves(); return; }
        stopC = chunked(jobs.length, Math.max(4, Math.round(60000 / n)), i => {
          const [k, j, s] = jobs[i], r = percolate(n, G[k], Ts[j], rng(s * 7919 + j * 31 + gseed * 3 + 1)), c = curves[k][j];
          c.exp += r.exp; c.giant += r.giant; c.c++;
        }, done => { prog.textContent = `számolás: ${done} / ${jobs.length} perkoláció…`; drawCurves(); },
        () => { stopC = null; prog.innerHTML = `Pontonként ${S} perkolált minta átlaga. Szaggatott függőleges: $T_c = 1/\\kappa$.`; math(prog); drawCurves();
          root.dataset.curves = JSON.stringify(Object.fromEntries(Object.entries(curves).map(([k, a]) => [k, a.map(c => +(c[metric] / (c.c || 1)).toFixed(4))]))); });
      }
      function drawCurveSet(o, sets, lines) {
        if (!o.w) return;
        const fr = frame(o, { x1: 0.6, xt: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6], yt: [0, 0.25, 0.5, 0.75, 1], xl: "T (átvitel)",
          yl: metric === "exp" ? "várható kitörés (arány)" : "óriáskomponens (arány)", fx: v => fmt(v, 1), fy: v => pct(v) });
        const ctx = o.ctx;
        lines.forEach(([Tc, col]) => { if (isFinite(Tc) && Tc <= 0.6) poly(ctx, [[fr.X(Tc), fr.P.t], [fr.X(Tc), o.h - fr.P.b]], col, 1.6, [5, 4], 0.9); });
        sets.forEach(([arr, col, dsh]) => {
          if (!arr) return;
          const pts = []; arr.forEach((c, j) => { if (c.c) pts.push([fr.X(Ts[j]), fr.Y(c[metric] / c.c)]); });
          poly(ctx, pts, col, 2.4, dsh);
          ctx.fillStyle = GK.color(col); pts.forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 2.4, 0, 2 * Math.PI); ctx.fill(); });
        });
      }
      function drawCurves() {
        const ks = nets();
        drawCurveSet(chart, ks.map(k => [curves[k], NC[k]]), ks.filter(k => k !== "ring").map(k => [stats[k] && stats[k].Tc, NC[k]]));
      }
      const STRAT = [["rand", "véletlen", "--setA"], ["hub", "hubok", "--setB"], ["acq", "ismerős", "--setC"]];
      function startImm() {
        if (stopI) stopI();
        const R = rng(gseed * 31 + Math.round(f * 1000) * 7 + 11);
        imm = {};
        STRAT.forEach(([k]) => { const rem = immunize(n, G.ba, f, k, R); imm[k] = { rem, st: remStats(n, G.ba, rem) }; });
        imm.none = { rem: new Uint8Array(n), st: Object.assign(stats.ba, { nRem: n, E: G.ba, immK: NaN }) };
        renderImm();
        icurves = {};
        const keys = ["none", "rand", "hub", "acq"], S = SAMPLES(), jobs = [];
        keys.forEach(k => (icurves[k] = Ts.map(() => ({ exp: 0, giant: 0, c: 0 }))));
        for (let s = 0; s < S; s++) keys.forEach(k => Ts.forEach((_, j) => jobs.push([k, j, s])));
        stopI = chunked(jobs.length, Math.max(4, Math.round(60000 / n)), i => {
          const [k, j, s] = jobs[i], I = imm[k], r = percolate(n, I.st.E, Ts[j], rng(s * 104729 + j * 37 + gseed * 5 + 2), I.rem, I.st.nRem), c = icurves[k][j];
          c.exp += r.exp; c.giant += r.giant; c.c++;
        }, done => { iprog.textContent = `számolás: ${done} / ${jobs.length} perkoláció…`; drawImm(); },
        () => { stopI = null; iprog.innerHTML = `${dot("--muted")}beoltás nélkül (szaggatott) · ${STRAT.map(([, l, c]) => dot(c) + l).join(" · ")}. A kitörés mérete az összes csúcshoz viszonyítva.`; drawImm(); });
      }
      function renderImm() {
        const rows = STRAT.map(([k, l, c]) => [k, l, c, imm[k].st]);
        itbl.innerHTML = `<table><tr><th>stratégia</th><th>beoltottak átl. fokszáma</th><th>$\\kappa$ utána</th><th>$T_c$ utána</th></tr>` +
          `<tr><td style="white-space:nowrap">${dot("--muted")}nincs</td><td>–</td><td>${fmt(stats.ba.kappa, 2)}</td><td>${fmt(stats.ba.Tc, 3)}</td></tr>` +
          rows.map(([, l, c, s]) => `<tr><td style="white-space:nowrap">${dot(c)}${l}</td><td>${fmt(s.immK, 1)}</td><td>${fmt(s.kappa, 2)}</td><td><b>${s.kappa <= 1 ? "> 1" : fmt(s.Tc, 3)}</b></td></tr>`).join("") +
          `</table><p class="muted" style="font-size:.86rem;margin:.3rem 0 0">BA-hálózat, $n = ${big(n)}$, beoltva ${Math.round(f * n)} csúcs (${pct(f)}).` +
          (rows.some(r => r[3].kappa <= 1) ? " Ha $\\kappa \\le 1$, akkor $T_c > 1$: semmilyen átvitelnél nincs nagy járvány." : "") + `</p>`;
        root.dataset.imm = JSON.stringify(Object.fromEntries(STRAT.map(([k]) => [k, { immK: imm[k].st.immK, kappa: imm[k].st.kappa, Tc: imm[k].st.Tc }])));
        math(itbl);
      }
      function drawImm() {
        if (!imm) { if (ichart.w) frame(ichart, { x1: 0.6, xt: [0, 0.2, 0.4, 0.6], yt: [0, 0.5, 1], fx: v => fmt(v, 1), fy: v => pct(v) }); return; }
        drawCurveSet(ichart, [[icurves.none, "--muted", [6, 4]], ...STRAT.map(([k, , c]) => [icurves[k], c])],
          [[stats.ba.Tc, "--muted"], ...STRAT.map(([k, , c]) => [imm[k].st.Tc, c])]);
      }
      function startAll() { if (started) return; started = true; startCurves(); startImm(); sizeTable(); }
      build();
      watchVis(root, v => { vis = v; if (v) startAll(); });
      if (!("IntersectionObserver" in window)) startAll();
    };

    /* ------------------------------------------------------------------
       9.6  opinion-dynamics – DeGroot, korlátos bizalom, visszhangkamra
       ------------------------------------------------------------------ */
    W["opinion-dynamics"] = root => {
      header(root, "Véleménydinamika: konszenzus, csoportok, visszhangkamrák",
        "Három modell, egyre szigorúbb „kire hallgatok?” szabállyal. <b>DeGroot</b>: mindenki a saját és a szomszédai véleményének átlagát veszi át. " +
        "<b>Korlátos bizalom</b>: csak azokra hallgatsz, akiknek a véleménye legfeljebb $\\varepsilon$-nal tér el a tiédtől. " +
        "<b>Visszhangkamra</b>: ráadásul a nagyon eltérő ismerőseidtől el is fordulsz, és hasonló véleményűt keresel helyettük.");
      math(root.querySelector(".w-sub"));
      const narrow = root.clientWidth < 560;
      let mode = "dg", vis = true;
      const tabs = h("div", { class: "controls" });
      root.append(tabs);
      const P = { dg: h("div"), bc: h("div", { style: "display:none" }), ec: h("div", { style: "display:none" }) };
      root.append(P.dg, P.bc, P.ec);
      const onMode = [];
      toggleGroup(tabs, [["dg", "DeGroot"], ["bc", "Korlátos bizalom"], ["ec", "Visszhangkamra"]], mode, v => {
        mode = v; Object.entries(P).forEach(([k, el]) => (el.style.display = k === v ? "" : "none"));
        onMode.forEach(fn => fn());
      });
      root.append(h("p", { style: "margin:.6rem 0 0;font-weight:600" },
        "Ha mindenkire hallgatsz, konszenzus lesz; ha csak a hozzád hasonlókra, csoportok; ha a kapcsolataidat is átválogatod, külön hálózatok."));
      const opCol = x => mixColor("--setA", "--setB", Math.max(0, Math.min(1, x)));
      const sd = xs => meanSd(xs).sd;

      /* ---------------- (a) DeGroot ---------------- */
      {
        const box = P.dg;
        const path3 = asp => { const p = GK.normalize([[0, 0], [1, 0], [2, 0]], asp); return { nodes: ["A", "B", "C"].map((l, i) => ({ label: l, x: p[i][0], y: p[i][1] })), edges: [{ a: 0, b: 1, w: 1 }, { a: 1, b: 2, w: 1 }] }; };
        const GR = {
          path: { name: "út (3 csúcs)", asp: 0.32, r: 16, make: path3, x0: n => [7, 0, 0] },
          star: { name: "csillag", asp: 0.75, r: 15, make: a => preset("star", a), x0: n => [10, 0, 0, 0, 0] },
          arviz: { name: "Árvízhét", asp: 0.8, r: 15, make: a => preset("arviz", a), x0: n => [0, 0, 5, 10, 10, 0, 0] },
          karate: { name: "karateklub", asp: 0.95, r: 11, make: a => preset("karate", a), x0: n => [...Array(n).keys()].map(i => (i === 0 ? 0 : i === 33 ? 10 : 5)) }
        };
        let key = "star", G, x0, traj, t = 0, playing = false, timer = 0;
        const c1 = h("div", { class: "controls" }), c2 = h("div", { class: "controls" });
        toggleGroup(c1, Object.entries(GR).map(([k, g]) => [k, g.name]), key, v => { key = v; build(); });
        const playB = btn("▶ Lejátszás", () => (playing ? pause() : play()), "btn primary");
        c2.append(btn("Lépés", () => { pause(); step(); }), playB, btn("Vissza az elejére", () => { pause(); t = 0; traj = [x0.slice()]; show(); }),
          btn("Mind 0", () => { x0 = x0.map(() => 0); restart(); }), btn("Véletlen", () => { x0 = x0.map(() => [0, 5, 10][Math.floor(Math.random() * 3)]); restart(); }));
        box.append(h("p", { class: "muted", style: "font-size:.88rem;margin:.3rem 0", html:
          "Kattints egy csúcsra: a kezdővéleménye 0 → 5 → 10 → 0 körben változik. A lépés: $x_i(t+1) = \\dfrac{x_i(t) + \\sum_{j \\sim i} x_j(t)}{k_i + 1}$." }), c1, c2);
        math(box.querySelector("p"));
        const cols = h("div", { class: "two-col" }), left = h("div"), right = h("div");
        cols.append(left, right); box.append(cols);
        const view = new GK.View(left, { aspect: GR[key].asp, radius: GR[key].r, draggable: false,
          onNodeClick: i => { if (t > 0) { t = 0; } x0[i] = x0[i] >= 10 ? 0 : x0[i] >= 5 ? 10 : 5; restart(); } });
        left.append(h("p", { class: "muted", style: "font-size:.86rem;margin:.3rem 0 0", html: `${dot("--setA")}0 … ${dot("--setB")}10 (a csúcs színe a vélemény)` }));
        box._view = view;                                   // teszteléshez
        const chBox = h("div"), ro = h("div", { class: "readout" });
        right.append(chBox, ro);
        const chart = canvasBox(chBox, narrow ? 0.6 : 0.62, 520);
        chart.onResize = () => drawChart();
        function build() {
          const g = GR[key];
          view.o.aspect = g.asp; view.o.radius = g.r;
          G = g.make(g.asp); G.edges = G.edges.map(e => ({ a: e.a, b: e.b, w: 1 }));
          x0 = g.x0(G.nodes.length);
          view.resize();
          view.setGraph(G.nodes.map(nd => ({ label: nd.label, x: nd.x, y: nd.y })), G.edges);
          restart();
        }
        function restart() { pause(); t = 0; traj = [x0.slice()]; show(); }
        function step() {
          if (t >= 200) return;
          if (traj.length <= t + 1) traj.push(degroot(G.nodes.length, G.edges, traj[t], 1)[1]);
          t++; show();
        }
        function show() {
          const x = traj[t], n = G.nodes.length, small = n <= 7;
          view.nodes.forEach((nd, i) => {
            nd.color = opCol(x[i] / 10);
            if (small) { nd.label = G.nodes[i].label; nd.sub = fmt(x[i], 2); }
            else { nd.label = fmt(x[i], x[i] >= 9.95 || Math.abs(x[i] - Math.round(x[i])) < 0.05 ? 0 : 1); nd.sub = null; }
          });
          view.draw();
          const k = degStats(n, G.edges).k, tot = k.reduce((s, v) => s + v + 1, 0);
          const pred = x0.reduce((s, v, i) => s + (k[i] + 1) / tot * v, 0), s_ = sd(x);
          ro.innerHTML = `lépés: <b>${t}</b> · szórás: <b>${fmt(s_, 3)}</b>` +
            (small ? `<br>vélemények: ${x.map((v, i) => G.nodes[i].label + " = " + fmt(v, 2)).join(", ")}` : `<br>vélemények: ${fmt(Math.min(...x), 2)} … ${fmt(Math.max(...x), 2)}`) +
            `<br>jósolt konszenzus: $\\sum_i \\pi_i x_i(0) = ${fmM(pred, 3)}$, ahol $\\pi_i = \\dfrac{k_i + 1}{\\sum_j (k_j + 1)}$ <span class="muted">(a fokszám + 1 a súly)</span>`;
          math(ro);
          root.dataset.dg = JSON.stringify({ t, pred, sd: s_, x });
          drawChart();
        }
        function drawChart() {
          if (!chart.w || !traj) return;
          const xm = Math.max(10, t), stp = xm <= 20 ? 2 : xm <= 50 ? 10 : 20, xt = [];
          for (let v = 0; v <= xm; v += stp) xt.push(v);
          const fr = frame(chart, { x1: xm, y1: 10, xt, yt: [0, 2.5, 5, 7.5, 10], xl: "lépés", yl: "vélemény", fx: v => String(v), fy: v => fmt(v, 1) });
          const n = G.nodes.length;
          for (let i = 0; i < n; i++) poly(chart.ctx, traj.slice(0, t + 1).map((x, s) => [fr.X(s), fr.Y(x[i])]), opCol(x0[i] / 10), n > 10 ? 1.2 : 2.2, null, n > 10 ? 0.7 : 1);
          const k = degStats(n, G.edges).k, tot = k.reduce((s, v) => s + v + 1, 0), pred = x0.reduce((s, v, i) => s + (k[i] + 1) / tot * v, 0);
          poly(chart.ctx, [[fr.X(0), fr.Y(pred)], [fr.X(xm), fr.Y(pred)]], "--text", 1.2, [5, 4], 0.7);
        }
        function sched() { clearInterval(timer); timer = 0; if (playing && vis && mode === "dg") timer = setInterval(() => { if (t >= 60) pause(); else step(); }, 450); }
        function play() { playing = true; playB.textContent = "❚❚ Szünet"; sched(); }
        function pause() { playing = false; playB.textContent = "▶ Lejátszás"; sched(); }
        onMode.push(() => { sched(); if (mode === "dg") { view.resize(); chart.resize(); } });
        watchVis(root, v => { vis = v; sched(); });
        build();
      }

      /* ---------------- (b) korlátos bizalom ---------------- */
      {
        const box = P.bc;
        let N = 100, model = "hk", eps = 0.15, mu = 0.5, seed = 2, small = false, res = null;
        box.append(h("p", { class: "muted", style: "font-size:.88rem;margin:.3rem 0", html:
          "Keverő populáció, a kezdővélemények egyenletesen szórtak $[0; 1]$-en. <b>HK</b> (Hegselmann–Krause): minden lépésben mindenki átveszi a tőle legfeljebb $\\varepsilon$-ra lévők " +
          "(magát is beleértve) átlagát. <b>Deffuant</b>: véletlen párok találkoznak; ha a véleményük $\\varepsilon$-nál közelebb van, mindketten $\\mu = 0{,}5$ arányban közelednek " +
          "(egy időegység = $N$ találkozás)." }));
        math(box.querySelector("p"));
        const c1 = h("div", { class: "controls" }), c2 = h("div", { class: "controls" });
        c1.append(h("span", { class: "muted", style: "font-size:.92rem" }, "modell:"));
        const paintM = toggleGroup(c1, [["hk", "HK"], ["df", "Deffuant"]], model, v => { model = v; small = false; paintS(); go(); });
        c1.append(h("span", { class: "muted", style: "font-size:.92rem" }, "ágensek:"));
        const paintN = toggleGroup(c1, [[100, "N = 100"], [200, "N = 200"]], N, v => { N = v; small = false; paintS(); go(); });
        const eOut = h("b", { style: "font-family:var(--mono);min-width:2.6em" }, fmt(eps, 2));
        const eSl = h("input", { type: "range", min: 0.02, max: 0.5, step: 0.01, value: eps, "aria-label": "ε", style: "width:11rem;max-width:50vw",
          oninput: () => { eps = +eSl.value; eOut.textContent = fmt(eps, 2); go(); } });
        const seedOut = h("b", { style: "font-family:var(--mono)" }, "2");
        const smallB = btn("Kis példa: 5 ágens (HK)", () => { small = !small; if (small) { model = "hk"; paintM("hk"); } paintS(); go(); });
        const paintS = () => smallB.classList.toggle("on", small);
        c2.append(h("label", null, "ε =", eSl, eOut), h("label", null, "minta:", seedOut), btn("Új minta", () => { seed++; seedOut.textContent = seed; small = false; paintS(); go(); }), smallB);
        box.append(c1, c2);
        const chBox = h("div"), ro = h("div", { class: "readout" });
        box.append(chBox, ro);
        const chart = canvasBox(chBox, narrow ? 0.75 : 0.45, 760);
        chart.onResize = () => draw();
        let pend = 0;
        function go() { cancelAnimationFrame(pend); pend = requestAnimationFrame(compute); }
        function compute() {
          const R = rng(seed * 7 + 1);
          let x = small ? [0, 0.2, 0.4, 0.8, 1] : Array.from({ length: N }, () => R());
          const traj = [x.slice()];
          if (model === "hk" || small) {
            for (let s = 0; s < 100; s++) {
              const nx = hkStep(x, eps), ch = Math.max(...nx.map((v, i) => Math.abs(v - x[i])));
              x = nx; traj.push(x.slice());
              if (ch < 1e-9) break;
            }
            /* az utolsó (változatlan) lépés nem kell, ha volt mozgás */
            if (traj.length > 1 && Math.max(...traj[traj.length - 1].map((v, i) => Math.abs(v - traj[traj.length - 2][i]))) < 1e-9) traj.pop();
          } else {
            const Rd = rng(seed * 31 + 5), SW = 200;
            for (let s = 0; s < SW; s++) { for (let k = 0; k < x.length; k++) deffuantStep(x, eps, mu, Rd); traj.push(x.slice()); }
          }
          const cl = opinionClusters(x, 0.02), bigC = cl.filter(c => c.size >= 0.05 * x.length);
          res = { traj, cl, bigC, steps: traj.length - 1 };
          root.dataset.bc = JSON.stringify({ model: small ? "hk5" : model, N: x.length, eps, k: cl.length, big: bigC.length, steps: res.steps, final: small ? x : undefined });
          draw();
          const nL = x.length;
          let txt = `${small ? "5 ágens, HK" : (model === "hk" ? "HK" : "Deffuant")} · ε = ${fmt(eps, 2)} · ` +
            (model === "hk" || small ? `megállt <b>${res.steps}</b> lépés után` : `${res.steps} időegység`) +
            `<br>csoportok: <b>${cl.length}</b>` + (small ? "" : ` (ebből legalább 5 %-os: <b>${bigC.length}</b>)`) +
            `: ${cl.slice(0, 12).map(c => fmt(c.center, 2) + " (" + c.size + ")").join(", ")}${cl.length > 12 ? ", …" : ""}`;
          if (small) txt += `<br>` + traj.map((r, s) => `t = ${s}: (${r.map(v => fmt(v, 3)).join("; ")})`).join("<br>");
          else if (model === "df") txt += `<br><span class="muted">Ökölszabály: kb. $\\lfloor 1/(2\\varepsilon) \\rfloor = ${Math.floor(1 / (2 * eps) + 1e-9)}$ nagy csoport.</span>`;
          ro.innerHTML = txt;
          if (model === "df" && !small) math(ro);
          void nL;
        }
        function draw() {
          if (!res || !chart.w) return;
          const xm = Math.max(small ? 4 : 10, res.steps), stp = xm <= 10 ? 1 : xm <= 20 ? 2 : xm <= 50 ? 10 : xm <= 100 ? 20 : 50, xt = [];
          for (let v = 0; v <= xm; v += stp) xt.push(v);
          const fr = frame(chart, { x1: xm, xt, yt: [0, 0.25, 0.5, 0.75, 1], xl: model === "hk" || small ? "lépés" : "idő (N találkozás)", yl: "vélemény",
            fx: v => String(v), fy: v => fmt(v, 2), pad: { r: 46 } });
          const ctx = chart.ctx, n = res.traj[0].length, every = Math.max(1, Math.floor(res.traj.length / 200));
          for (let i = 0; i < n; i++) {
            const pts = [];
            for (let s = 0; s < res.traj.length; s += every) pts.push([fr.X(s), fr.Y(res.traj[s][i])]);
            pts.push([fr.X(res.steps), fr.Y(res.traj[res.steps][i])]);
            poly(ctx, pts, opCol(res.traj[0][i]), small ? 2.4 : 1, null, small ? 1 : 0.45);
          }
          /* a végső csoportok a jobb szélen */
          const text = GK.css("--text"), card = GK.css("--card");
          res.cl.forEach(c => {
            const y = fr.Y(c.center), r = Math.max(3, Math.min(16, 2.2 * Math.sqrt(c.size * (small ? 8 : 100 / n))));
            const x = chart.w - fr.P.r + 4 + r;
            ctx.fillStyle = opCol(c.center); ctx.strokeStyle = text; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(Math.min(x, chart.w - r - 1), y, r, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
            if (c.size >= (small ? 1 : 3) && r >= 7) { ctx.fillStyle = "#fff"; ctx.font = "600 10px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(String(c.size), Math.min(x, chart.w - r - 1), y + 0.5); }
          });
          void card;
        }
        onMode.push(() => { if (mode === "bc") { chart.resize(); if (!res) go(); } });
      }

      /* ---------------- (c) visszhangkamra ---------------- */
      {
        const box = P.ec, n = 100, M = 300, mu = 0.5;
        let eps = 0.2, q = 0, seed = 1, x, E, adj, R, t = 0, playing = false, timer = 0, hist = [];
        box.append(h("p", { class: "muted", style: "font-size:.88rem;margin:.3rem 0", html:
          "Véletlen gráf: $n = 100$, $\\langle k\\rangle = 6$. Egy lépésben 300-szor kiválasztunk egy véletlen élt. Ha a két vég véleménye $\\varepsilon$-nál közelebb van, " +
          "közelednek (Deffuant, $\\mu = 0{,}5$). Ha nem, akkor $q$ eséllyel az egyik fél <b>elvágja</b> az élt, és egy hozzá $\\varepsilon$-on belüli véleményű csúcshoz köt át (homofil újrahuzalozás)." }));
        math(box.querySelector("p"));
        const c1 = h("div", { class: "controls" }), c2 = h("div", { class: "controls" });
        const eOut = h("b", { style: "font-family:var(--mono);min-width:2.6em" }, fmt(eps, 2)), qOut = h("b", { style: "font-family:var(--mono);min-width:2.6em" }, fmt(q, 2));
        const eSl = h("input", { type: "range", min: 0.05, max: 0.5, step: 0.01, value: eps, "aria-label": "ε", style: "width:9rem;max-width:40vw",
          oninput: () => { eps = +eSl.value; eOut.textContent = fmt(eps, 2); } });
        const qSl = h("input", { type: "range", min: 0, max: 1, step: 0.05, value: q, "aria-label": "q", style: "width:9rem;max-width:40vw",
          oninput: () => { q = +qSl.value; qOut.textContent = fmt(q, 2); } });
        c1.append(h("label", null, "ε =", eSl, eOut), h("label", null, "újrahuzalozás q =", qSl, qOut));
        const playB = btn("▶ Lejátszás", () => (playing ? pause() : play()), "btn primary");
        c2.append(btn("Lépés", () => { pause(); sweep(); relayout(true); show(); }), playB,
          btn("+100 lépés", () => { pause(); for (let i = 0; i < 100; i++) sweep(); relayout(); show(); }),
          btn("Újra", () => { pause(); seed++; init(); }));
        box.append(c1, c2);
        const cols = h("div", { class: "two-col" }), left = h("div"), right = h("div");
        cols.append(left, right); box.append(cols);
        const view = new GK.View(left, { aspect: narrow ? 0.9 : 0.85, radius: 5, draggable: false });
        left.append(h("p", { class: "muted", style: "font-size:.86rem;margin:.3rem 0 0", html: `a csúcs színe a véleménye: ${dot("--setA")}0 … ${dot("--setB")}1` }));
        const chBox = h("div"), ro = h("div", { class: "readout" });
        right.append(chBox, ro);
        const chart = canvasBox(chBox, narrow ? 0.6 : 0.7, 520);
        chart.onResize = () => drawChart();
        const key = (a, b) => (a < b ? a * n + b : b * n + a);
        function init() {
          R = rng(seed * 97 + 3);
          x = Array.from({ length: n }, () => R());
          E = sparseGnm(n, M, R).map(e => [e.a, e.b]);
          adj = new Set(E.map(([a, b]) => key(a, b)));
          t = 0; hist = [];
          const P0 = tidyLayout(GK.forceLayout(n, E, { seed, iters: 300, aspect: view.o.aspect }), view.o.aspect);
          view.setGraph(P0.map(p => ({ label: "", x: p[0], y: p[1] })), E.map(([a, b]) => ({ a, b, w: 1 })));
          record(); show();
        }
        function sweep() {
          for (let s = 0; s < M; s++) {
            const ei = Math.floor(R() * E.length), [i, j] = E[ei], d = x[j] - x[i];
            if (Math.abs(d) < eps) { x[i] += mu * d; x[j] -= mu * d; continue; }
            if (q <= 0 || R() >= q) continue;
            const [u, v] = R() < 0.5 ? [i, j] : [j, i];
            for (let tr = 0; tr < 40; tr++) {
              const w = Math.floor(R() * n);
              if (w === u || w === v || adj.has(key(u, w)) || Math.abs(x[w] - x[u]) >= eps) continue;
              adj.delete(key(u, v)); adj.add(key(u, w)); E[ei] = [u, w]; break;
            }
          }
          t++; record();
        }
        function measure() {
          const dist = E.reduce((s, [a, b]) => s + Math.abs(x[a] - x[b]), 0) / E.length;
          const cs = components(n, E.map(([a, b]) => ({ a, b }))).sizes, cl = opinionClusters(x, 0.05);
          return { t, dist, comps: cs.length, compsBig: cs.filter(s => s >= 5).length, giant: cs[0], cl: cl.length, clBig: cl.filter(c => c.size >= 5).length };
        }
        function record() { hist.push(measure()); }
        function relayout(soft) {
          const init_ = view.nodes.map(nd => [nd.x, nd.y]);
          const P1 = tidyLayout(GK.forceLayout(n, E, { seed, iters: soft ? 40 : 150, aspect: view.o.aspect, init: init_ }), view.o.aspect);
          view.setGraph(view.nodes, E.map(([a, b]) => ({ a, b, w: 1 })));
          view.animateTo(P1, soft ? 250 : 600);
        }
        function show() {
          view.nodes.forEach((nd, i) => (nd.color = opCol(x[i])));
          view.edges.forEach(e => { const far = Math.abs(x[e.a] - x[e.b]) >= eps; e.alpha = far ? 0.35 : 0.8; e.width = 1.2; e.dash = far ? [3, 3] : null; });
          view.draw();
          const m = hist[hist.length - 1];
          ro.innerHTML = `lépés: <b>${t}</b><br>véleménytávolság az élek mentén (átlag): <b>${fmt(m.dist, 3)}</b> <span class="muted">(kezdetben ≈ ${fmt(hist[0].dist, 2)})</span>` +
            `<br>komponensek: <b>${m.comps}</b> (legalább 5 csúcsú: <b>${m.compsBig}</b>, a legnagyobb: ${m.giant} csúcs)` +
            `<br>véleménycsoportok (legalább 5 fős): <b>${m.clBig}</b>`;
          root.dataset.ec = JSON.stringify({ t, eps, q, dist: m.dist, comps: m.comps, compsBig: m.compsBig, giant: m.giant, clBig: m.clBig });
          drawChart();
        }
        function drawChart() {
          if (!chart.w || !hist.length) return;
          const xm = Math.max(20, t), stp = xm <= 20 ? 5 : xm <= 50 ? 10 : xm <= 120 ? 20 : xm <= 300 ? 50 : 100, xt = [];
          for (let v = 0; v <= xm; v += stp) xt.push(v);
          const fr = frame(chart, { x1: xm, y1: 0.4, xt, yt: [0, 0.1, 0.2, 0.3, 0.4], xl: "lépés", yl: "átl. távolság az élek mentén", fx: v => String(v), fy: v => fmt(v, 1), pad: { r: 34 } });
          poly(chart.ctx, hist.map(m => [fr.X(m.t), fr.Y(Math.min(0.4, m.dist))]), "--accent", 2.4);
          /* komponensek száma a jobb tengelyen (0–20) */
          const Y2 = v => fr.Y(0.4 * Math.min(v, 20) / 20);
          poly(chart.ctx, hist.map(m => [fr.X(m.t), Y2(m.compsBig)]), "--setC", 2, [5, 3]);
          const ctx = chart.ctx; ctx.fillStyle = GK.css("--setC"); ctx.font = "11px system-ui, sans-serif"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
          [0, 5, 10, 15, 20].forEach(v => ctx.fillText(String(v), chart.w - fr.P.r + 5, Y2(v)));
        }
        const leg = h("p", { class: "muted", style: "font-size:.86rem;margin:.3rem 0 0", html: `${dash("--accent")}véleménytávolság (bal tengely) · ${dash("--setC", true)}legalább 5 csúcsú komponensek száma (jobb tengely)` });
        right.insertBefore(leg, ro);
        let since = 0;
        function sched() {
          clearInterval(timer); timer = 0;
          if (playing && vis && mode === "ec") timer = setInterval(() => {
            sweep(); since++;
            if (since >= 10) { since = 0; relayout(true); }
            show();
            if (t >= 1000) pause();
          }, 120);
        }
        function play() { playing = true; playB.textContent = "❚❚ Szünet"; sched(); }
        function pause() { playing = false; playB.textContent = "▶ Lejátszás"; sched(); }
        onMode.push(() => { sched(); if (mode === "ec") { view.resize(); chart.resize(); } });
        watchVis(root, v => { vis = v; sched(); });
        init();
      }
    };
  }
