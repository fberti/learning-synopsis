/* =========================================================
   Mesterséges intelligencia 15. fejezet – interaktív szemléltetések
   (folyosó, többkarú bandita, diszkontálás, Bellman-frissítés,
   Q-tanulás és SARSA rácsvilágon, stratégia-gradiens, jutalom-kijátszás)
   Minden widget egy  <div class="widget" data-widget="név">  elembe épül.
   Rajzolás: assets/calc.js (Calc.canvas, Calc.plot, Calc.fmt).
   A környezetek és az algoritmusok (RL15) node-ból is futtathatók
   (module.exports), így a szöveg számai ellenőrizhetők.
   ========================================================= */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     1. Környezetek és algoritmusok – DOM nélkül
     ------------------------------------------------------------------ */
  /* mulberry32 magolt álvéletlen */
  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  /* cselekvések: 0 fel, 1 jobb, 2 le, 3 bal */
  const DX = [0, 1, 0, -1], DY = [-1, 0, 1, 0];
  const ANAME = ["fel", "jobbra", "le", "balra"];
  const ARROW = ["↑", "→", "↓", "←"];

  /* térképek: S start, C cél, X csapda / szakadék / lépcső, # fal, B bója, . üres */
  const MAPS = {
    folyoso: { rows: ["X.S.C"], step: 0, goal: 10, trap: -10, actions: [3, 1], slipMode: "stay",
      names: { X: "lépcső", C: "töltő" } },
    raktar: { rows: ["....C", ".##.X", ".....", "S.#.."], step: -1, goal: 10, trap: -10, actions: [0, 1, 2, 3], slipMode: "side",
      names: { X: "olaj", C: "töltő" } },
    szirt: { rows: ["..........", "..........", "..........", "SXXXXXXXXC"], step: -1, goal: -1, trap: -100, trapReset: true,
      actions: [0, 1, 2, 3], slipMode: "side", names: { X: "szakadék", C: "cél" } },
    palya: { rows: ["S....C", ".####.", "..B..."], step: 0, goal: 10, trap: 0, actions: [0, 1, 2, 3], slipMode: "side",
      names: { C: "cél", B: "bója" } }
  };

  function makeEnv(name, opt = {}) {
    const M = MAPS[name], rows = M.rows, H = rows.length, W = rows[0].length;
    const cell = i => rows[Math.floor(i / W)][i % W];
    const N = W * H;
    let start = 0;
    for (let i = 0; i < N; i++) if (cell(i) === "S") start = i;
    const terminal = i => cell(i) === "C" || (cell(i) === "X" && !M.trapReset);
    const states = [];
    for (let i = 0; i < N; i++) if (cell(i) !== "#" && !terminal(i) && !(cell(i) === "X" && M.trapReset)) states.push(i);
    const slip = opt.slip || 0;
    /* jutalom-változat (a reward-hacking widgethez): reward(s, s2, base) */
    const rewardFn = opt.reward || null;
    function move(s, a) {
      const x = s % W, y = Math.floor(s / W), nx = x + DX[a], ny = y + DY[a];
      if (nx < 0 || nx >= W || ny < 0 || ny >= H) return s;
      const j = ny * W + nx;
      return cell(j) === "#" ? s : j;
    }
    /* determinisztikus következmény: [s2, r, done] */
    function det(s, a) {
      let s2 = move(s, a), r = M.step, done = false;
      const c = cell(s2);
      if (c === "C") { r = M.goal; done = true; }
      else if (c === "X") { r = M.trap; if (M.trapReset) s2 = start; else done = true; }
      if (rewardFn) r = rewardFn(s, s2, r, done);
      return [s2, r, done];
    }
    /* valószínűségi átmenetek: [[p, s2, r, done], …] */
    function trans(s, a) {
      if (!slip) return [[1, ...det(s, a)]];
      if (M.slipMode === "stay") {
        const r0 = rewardFn ? rewardFn(s, s, M.step, false) : M.step;
        return [[1 - slip, ...det(s, a)], [slip, s, r0, false]];
      }
      return [[1 - slip, ...det(s, a)], [slip / 2, ...det(s, (a + 1) % 4)], [slip / 2, ...det(s, (a + 3) % 4)]];
    }
    /* mintavétel a véletlen környezetből */
    function sample(s, a, rnd) {
      if (!slip) return det(s, a);
      const u = rnd();
      if (u >= slip) return det(s, a);
      if (M.slipMode === "stay") return [s, rewardFn ? rewardFn(s, s, M.step, false) : M.step, false];
      return det(s, (a + (u < slip / 2 ? 1 : 3)) % 4);
    }
    return { name, M, W, H, N, cell, start, states, terminal, trans, det, sample, move, actions: M.actions, slip };
  }

  /* Q(s, a) egy V-ből (egy Bellman-frissítés egy cselekvésre) */
  function qFromV(env, V, s, a, g) {
    return env.trans(s, a).reduce((acc, [p, s2, r, d]) => acc + p * (r + (d ? 0 : g * V[s2])), 0);
  }
  /* értékiteráció egy söprése (szinkron): új V + legnagyobb változás */
  function viSweep(env, V, g) {
    const Vn = V.slice();
    let delta = 0;
    env.states.forEach(s => {
      const best = Math.max(...env.actions.map(a => qFromV(env, V, s, a, g)));
      delta = Math.max(delta, Math.abs(best - V[s]));
      Vn[s] = best;
    });
    return [Vn, delta];
  }
  function valueIteration(env, g, tol = 1e-10, maxSweeps = 5000) {
    let V = new Array(env.N).fill(0), n = 0, d = Infinity;
    while (d > tol && n < maxSweeps) { [V, d] = viSweep(env, V, g); n++; }
    return { V, sweeps: n };
  }
  const argmaxAll = (q, eps = 1e-9) => { const m = Math.max(...q); return q.map((v, i) => (v >= m - eps ? i : -1)).filter(i => i >= 0); };

  /* ε-mohó választás egy Q-sorból (döntetlennél véletlen) */
  function epsGreedy(env, Qs, eps, rnd) {
    const acts = env.actions;
    if (rnd() < eps) return acts[Math.floor(rnd() * acts.length)];
    const qs = acts.map(a => Qs[a]), best = argmaxAll(qs);
    return acts[best[Math.floor(rnd() * best.length)]];
  }
  /* egy tanuló ágens (Q-tanulás vagy SARSA), lépésenként léptethető */
  function makeLearner(env, p) {
    const L = {
      env, p, rnd: rng(p.seed || 1),
      Q: Array.from({ length: env.N }, () => [0, 0, 0, 0]),
      s: env.start, a: null, G: 0, len: 0, ep: 0, returns: [], lens: [], last: null
    };
    L.reset = () => { L.s = env.start; L.a = null; L.G = 0; L.len = 0; };
    L.step = () => {
      const { alpha, gamma, eps, algo } = L.p, Q = L.Q;
      if (L.a === null) L.a = epsGreedy(env, Q[L.s], eps, L.rnd);
      const s = L.s, a = L.a, [s2, r, done] = env.sample(s, a, L.rnd);
      let target, a2 = null, nextVal = 0;
      if (done) target = r;
      else {
        a2 = epsGreedy(env, Q[s2], eps, L.rnd);
        nextVal = algo === "sarsa" ? Q[s2][a2] : Math.max(...env.actions.map(b => Q[s2][b]));
        target = r + gamma * nextVal;
      }
      const old = Q[s][a];
      Q[s][a] = old + alpha * (target - old);
      L.last = { s, a, r, s2, a2, done, old, target, nextVal, nw: Q[s][a] };
      L.G += r; L.len++;
      const cut = L.len >= (L.p.maxLen || 200);
      if (done || cut) {
        L.returns.push(L.G); L.lens.push(L.len); L.ep++;
        L.reset();
        return { end: true, done, cut };
      }
      L.s = s2; L.a = a2;
      return { end: false };
    };
    L.episode = () => { let e; do e = L.step(); while (!e.end); return e; };
    return L;
  }
  /* a mohó út a startból (Q-ból vagy V-ből), legfeljebb maxLen lépés */
  function greedyPath(env, qOf, maxLen = 60) {
    let s = env.start;
    const path = [s];
    let G = 0;
    for (let k = 0; k < maxLen; k++) {
      const qs = env.actions.map(a => qOf(s, a)), a = env.actions[argmaxAll(qs)[0]];
      const [s2, r, d] = env.det(s, a);
      G += r; path.push(s2);
      if (d) return { path, G, ok: true };
      s = s2;
    }
    return { path, G, ok: false };
  }

  /* többkarú bandita */
  function makeBandit(means, p) {
    const B = { means, p, rnd: rng(p.seed || 7), K: means.length };
    B.reset = () => {
      const q0 = p.q0 || 0;
      B.Q = new Array(B.K).fill(q0); B.N = new Array(B.K).fill(0); B.t = 0;
      B.total = 0; B.regret = 0; B.opt = 0; B.hist = []; B.last = null;
      B.best = Math.max(...means);
    };
    B.choose = () => {
      const { mode, eps, c } = B.p;
      if (mode === "ucb") {
        const z = B.N.indexOf(0);
        if (z >= 0) return { a: z, why: "még nem próbált kar" };
        const sc = B.Q.map((q, i) => q + c * Math.sqrt(Math.log(B.t) / B.N[i])), bs = argmaxAll(sc);
        return { a: bs[Math.floor(B.rnd() * bs.length)], why: "legnagyobb felső korlát", sc };
      }
      const e = mode === "eps" ? eps : 0;
      if (B.rnd() < e) return { a: Math.floor(B.rnd() * B.K), why: "felfedezés (véletlen kar)" };
      const bs = argmaxAll(B.Q);
      return { a: bs[Math.floor(B.rnd() * bs.length)], why: "kiaknázás (a legjobbnak hitt kar)" };
    };
    B.pull = forced => {
      const ch = forced != null ? { a: forced, why: "a te választásod" } : B.choose(), a = ch.a;
      const r = B.rnd() < means[a] ? 1 : 0;
      B.N[a]++;
      const n = B.p.q0 ? B.N[a] + 1 : B.N[a];         /* optimista kezdés: a q0 egy „álmegfigyelés” */
      B.Q[a] += (r - B.Q[a]) / n;
      B.t++; B.total += r; B.regret += B.best - means[a]; B.opt += means[a] === B.best ? 1 : 0;
      B.hist.push(B.regret);
      B.last = { a, r, why: ch.why, sc: ch.sc };
      return B.last;
    };
    B.reset();
    return B;
  }

  /* REINFORCE softmax-stratégiával egy banditán */
  const softmax = z => { const m = Math.max(...z), e = z.map(v => Math.exp(v - m)), s = e.reduce((x, y) => x + y, 0); return e.map(v => v / s); };
  function makePG(means, p) {
    const P = { means, p, rnd: rng(p.seed || 11), K: means.length };
    P.reset = () => { P.th = new Array(P.K).fill(0); P.t = 0; P.base = 0; P.hist = [softmax(P.th)]; P.last = null; };
    P.step = () => {
      const pi = softmax(P.th);
      let u = P.rnd(), a = 0;
      while (a < P.K - 1 && u >= pi[a]) { u -= pi[a]; a++; }
      const r = P.rnd() < means[a] ? 1 : 0;
      const b = P.p.baseline ? P.base : 0, adv = r - b, al = P.p.alpha;
      const old = P.th.slice();
      P.th = P.th.map((t, k) => t + al * adv * ((k === a ? 1 : 0) - pi[k]));
      P.t++;
      P.base += (r - P.base) / P.t;                  /* az eddigi jutalmak átlaga */
      P.hist.push(softmax(P.th));
      P.last = { a, r, b, adv, pi, old, th: P.th.slice() };
      return P.last;
    };
    P.reset();
    return P;
  }

  /* a jutalom-kijátszás pálya jutalomváltozatai */
  function bfsDist(env, goalChar = "C") {
    const D = new Array(env.N).fill(Infinity), q = [];
    for (let i = 0; i < env.N; i++) if (env.cell(i) === goalChar) { D[i] = 0; q.push(i); }
    while (q.length) {
      const s = q.shift();
      for (let a = 0; a < 4; a++) {
        const j = env.move(s, a);
        if (j !== s && D[j] === Infinity && env.cell(j) !== "#") { D[j] = D[s] + 1; q.push(j); }
      }
    }
    return D;
  }
  function hackEnv(mode, gamma) {
    const base = makeEnv("palya");
    const D = bfsDist(base);
    const reward = (s, s2, r, done) => {
      let x = done ? 10 : 0;
      if (mode === "buoy" && base.cell(s2) === "B" && s2 !== s) x += 1;
      if (mode === "naive" && D[s2] < D[s]) x += 1;
      if (mode === "potential") x += gamma * (done ? 0 : -D[s2]) - (-D[s]);
      return x;
    };
    return makeEnv("palya", { reward });
  }

  const RL15 = { rng, MAPS, makeEnv, qFromV, viSweep, valueIteration, makeLearner, greedyPath, makeBandit, makePG, softmax, hackEnv, bfsDist, argmaxAll };
  if (typeof module !== "undefined" && module.exports) { module.exports = RL15; return; }
  window.RL15 = RL15;

  /* ------------------------------------------------------------------
     2. Segédfüggvények a rajzoláshoz (a 14. fejezet widgets.js-ének mintájára)
     ------------------------------------------------------------------ */
  const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const fmt = (x, d = 2) => (window.Calc ? Calc.fmt(x, d) : String(x));
  const fix = (x, d = 2) => {
    const r = Math.round(x * Math.pow(10, d)) / Math.pow(10, d);
    return (Object.is(r, -0) || Math.abs(r) < 0.5 / Math.pow(10, d) ? 0 : r).toFixed(d).replace("-", "−").replace(".", ",");
  };
  const pct = (a, d = 0) => fmt(100 * a, d) + "%";
  function h(tag, attrs, ...kids) {
    const e = document.createElement(tag);
    if (attrs) for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") e.className = v;
      else if (k === "html") e.innerHTML = v;
      else if (k === "style") e.style.cssText = v;
      else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v);
    }
    kids.flat().forEach(c => c != null && e.append(c.nodeType ? c : document.createTextNode(c)));
    return e;
  }
  const btn = (label, onclick, cls = "btn") => h("button", { class: cls, type: "button", onclick }, label);
  const math = el => window.Synopsis && Synopsis.renderMath(el);
  const small = t => h("span", { class: "muted", style: "font-size:.92rem" }, t);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function header(root, title, sub) {
    root.append(h("div", { class: "w-title" }, title));
    if (sub) root.append(h("p", { class: "w-sub", html: sub }));
  }
  function toggleGroup(items, get, set) {
    const bs = items.map(([key, txt]) => { const b = btn(txt, () => { set(key); paint(); }); b.dataset.key = key; return b; });
    const paint = () => bs.forEach(b => b.classList.toggle("on", b.dataset.key === String(get())));
    paint();
    return { bs, paint };
  }
  /* csúszka felirattal: onInput(érték) */
  function sliderRow(label, min, max, step, value, show, onInput) {
    const inp = h("input", { type: "range", min, max, step, value });
    const out = h("b", { style: "min-width:2.6rem;display:inline-block" }, show(+value));
    inp.addEventListener("input", () => { out.textContent = show(+inp.value); onInput(+inp.value); });
    const lab = h("label", null, label, inp, out);
    lab.set = v => { inp.value = v; out.textContent = show(+v); };
    return lab;
  }
  function stat(label) {
    const v = h("div", { class: "v" }, "–"), box = h("div", { class: "stat" }, v, h("div", { class: "l" }, label));
    box.set = t => { v.textContent = t; };
    return box;
  }
  function hexRGB(c) {
    const m = /^#?([0-9a-f]{6})$/i.exec(String(c).trim());
    if (!m) return [128, 128, 128];
    const v = parseInt(m[1], 16); return [v >> 16, (v >> 8) & 255, v & 255];
  }
  function mix(colVar, t) {
    const bg = hexRGB(css("--card")), c = hexRGB(css(colVar));
    t = clamp(t, 0, 1);
    return `rgb(${bg.map((b, i) => Math.round(b + (c[i] - b) * t)).join(",")})`;
  }
  function rgba(col, a) {
    const c = hexRGB(col);
    return `rgba(${c[0]},${c[1]},${c[2]},${a})`;
  }
  /* canvas, amelynek magassága a szélességtől függ; HiDPI, téma- és méretváltáskor újrarajzol */
  function mkCanvas(parent, heightOf, maxW = 760) {
    const c = h("canvas", { style: "display:block;touch-action:manipulation;max-width:100%" });
    parent.append(c);
    const o = { c, ctx: c.getContext("2d"), w: 0, h: 0, draw: null };
    o.resize = () => {
      const w = Math.max(60, Math.min(maxW, parent.clientWidth || maxW)), hh = Math.max(40, Math.round(heightOf(w)));
      const dpr = window.devicePixelRatio || 1;
      if (o.w !== w || o.h !== hh || c.width !== Math.round(w * dpr)) {
        c.width = Math.round(w * dpr); c.height = Math.round(hh * dpr);
        c.style.width = w + "px"; c.style.height = hh + "px";
      }
      o.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      o.w = w; o.h = hh;
    };
    o.resize();
    let t;
    addEventListener("resize", () => { clearTimeout(t); t = setTimeout(() => o.draw && o.draw(), 160); });
    new MutationObserver(() => o.draw && o.draw()).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return o;
  }
  const font = (px, wt = 600) => `${wt} ${px}px system-ui, sans-serif`;
  function text(ctx, s, x, y, color, px = 12, align = "center", base = "middle", wt = 600) {
    ctx.save(); ctx.fillStyle = color; ctx.font = font(px, wt); ctx.textAlign = align; ctx.textBaseline = base;
    ctx.fillText(s, x, y); ctx.restore();
  }
  function arrowGlyph(ctx, cx, cy, a, len, color, lw = 2.2) {
    const dx = DX[a], dy = DY[a], x0 = cx - dx * len / 2, y0 = cy - dy * len / 2, x1 = cx + dx * len / 2, y1 = cy + dy * len / 2;
    const ang = Math.atan2(y1 - y0, x1 - x0);
    ctx.save(); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = lw;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1 - 5 * Math.cos(ang), y1 - 5 * Math.sin(ang)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - 8 * Math.cos(ang - 0.45), y1 - 8 * Math.sin(ang - 0.45));
    ctx.lineTo(x1 - 8 * Math.cos(ang + 0.45), y1 - 8 * Math.sin(ang + 0.45)); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  /* értékszín: pozitív → --ok, negatív → --bad, a nagysággal arányos erősséggel */
  const valColor = (v, scale) => (v >= 0 ? mix("--ok", 0.08 + 0.5 * Math.min(1, v / scale)) : mix("--bad", 0.08 + 0.5 * Math.min(1, -v / scale)));

  /* rácsvilág rajzolása; opts: { V, Q, arrows (s → [a…]), path, agent, sel, cellLabel(s), trail } */
  function gridGeom(cv, env, maxCell = 78) {
    const cs = Math.floor(Math.min(maxCell, (cv.w - 2) / env.W));
    const ox = Math.floor((cv.w - cs * env.W) / 2), oy = 1;
    return { cs, ox, oy, cx: s => ox + (s % env.W) * cs + cs / 2, cy: s => oy + Math.floor(s / env.W) * cs + cs / 2 };
  }
  function drawGrid(cv, env, o = {}) {
    cv.resize();
    const { ctx, w, h: hh } = cv, G = gridGeom(cv, env, o.maxCell);
    ctx.clearRect(0, 0, w, hh); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
    const { cs, ox, oy } = G, names = env.M.names || {};
    for (let s = 0; s < env.N; s++) {
      const x = ox + (s % env.W) * cs, y = oy + Math.floor(s / env.W) * cs, c = env.cell(s);
      let fill = css("--card");
      if (c === "#") fill = mix("--muted", 0.55);
      else if (c === "C") fill = mix("--ok", 0.45);
      else if (c === "X") fill = mix("--bad", 0.45);
      else if (c === "B") fill = mix("--setB", 0.35);
      else if (o.V) fill = valColor(o.V[s], o.scale || 10);
      ctx.fillStyle = fill; ctx.fillRect(x, y, cs, cs);
      if (o.Q && env.states.includes(s)) {               /* négy háromszög a Q-értékekkel */
        const q = o.Q[s], cx = x + cs / 2, cy = y + cs / 2;
        env.actions.forEach(a => {
          const corners = [[[x, y], [x + cs, y]], [[x + cs, y], [x + cs, y + cs]], [[x + cs, y + cs], [x, y + cs]], [[x, y + cs], [x, y]]][a];
          ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(...corners[0]); ctx.lineTo(...corners[1]); ctx.closePath();
          ctx.fillStyle = q[a] === 0 ? css("--card") : valColor(q[a], o.scale || 10); ctx.fill();
          ctx.strokeStyle = rgba(css("--muted"), 0.25); ctx.lineWidth = 1; ctx.stroke();
        });
      }
      if (o.trail && o.trail[s]) { ctx.fillStyle = rgba(css("--accent"), Math.min(0.35, 0.08 * o.trail[s])); ctx.fillRect(x, y, cs, cs); }
      ctx.strokeStyle = css("--border"); ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, y + 0.5, cs - 1, cs - 1);
      const px = clamp(Math.round(cs / 5.2), 9, 13);
      if (c === "C" || c === "X" || c === "B") {
        const sym = c === "C" ? "+" + fmt(env.M.goal, 0) : c === "X" ? fmt(env.M.trap, 0) : "+1";
        text(ctx, names[c] || c, x + cs / 2, y + cs / 2 - px * 0.6, css("--text"), px, "center", "middle", 600);
        if (!(env.name === "palya" && c !== "B")) text(ctx, sym, x + cs / 2, y + cs / 2 + px * 0.7, css("--text"), px, "center", "middle", 700);
      } else if (c !== "#") {
        if (o.cellLabel) { const t = o.cellLabel(s); if (t) text(ctx, t, x + cs / 2, y + cs - px * 0.75, css("--text"), px, "center", "middle", 600); }
        if (c === "S") text(ctx, "S", x + 4, y + 3, css("--muted"), px, "left", "top", 700);
      }
      if (o.arrows && o.arrows[s]) o.arrows[s].forEach(a => arrowGlyph(ctx, x + cs / 2, y + cs / 2 - (o.cellLabel ? px * 0.45 : 0), a, cs * 0.34, css("--accent")));
    }
    if (o.path && o.path.length > 1) {
      ctx.save(); ctx.strokeStyle = rgba(css("--accent"), 0.75); ctx.lineWidth = 3; ctx.setLineDash([6, 4]);
      ctx.beginPath(); o.path.forEach((s, i) => (i ? ctx.lineTo(G.cx(s), G.cy(s)) : ctx.moveTo(G.cx(s), G.cy(s)))); ctx.stroke(); ctx.restore();
    }
    if (o.sel != null) { ctx.save(); ctx.strokeStyle = css("--accent"); ctx.lineWidth = 3; ctx.strokeRect(ox + (o.sel % env.W) * cs + 2, oy + Math.floor(o.sel / env.W) * cs + 2, cs - 4, cs - 4); ctx.restore(); }
    if (o.agent != null) {
      ctx.save(); ctx.beginPath(); ctx.arc(G.cx(o.agent), G.cy(o.agent), cs * 0.2, 0, 2 * Math.PI);
      ctx.fillStyle = css("--accent"); ctx.fill(); ctx.strokeStyle = css("--card"); ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
    }
    return G;
  }
  const gridHeight = (env, maxCell = 78) => w => Math.floor(Math.min(maxCell, (w - 2) / env.W)) * env.H + 2;
  function cellAt(cv, env, G, e) {
    const r = cv.c.getBoundingClientRect(), x = e.clientX - r.left - G.ox, y = e.clientY - r.top - G.oy;
    const i = Math.floor(x / G.cs), j = Math.floor(y / G.cs);
    return i >= 0 && i < env.W && j >= 0 && j < env.H ? j * env.W + i : null;
  }
  /* vonaldiagram több sorozattal: series = [{ys, color, width, dash, label}] */
  function lineChart(cv, series, o = {}) {
    cv.resize();
    const all = series.flatMap(s => s.ys).filter(Number.isFinite);
    const n = Math.max(2, ...series.map(s => s.ys.length));
    let ymin = o.ymin != null ? o.ymin : Math.min(0, ...all), ymax = o.ymax != null ? o.ymax : Math.max(1e-9, ...all);
    if (ymax - ymin < 1e-9) ymax = ymin + 1;
    const pad = (ymax - ymin) * 0.06;
    const view = { xmin: o.xmin != null ? o.xmin : -n * 0.03, xmax: (n - 1) * 1.03, ymin: ymin - (o.ymin != null ? 0 : pad), ymax: ymax + pad, xname: o.xname || "", yname: o.yname || "" };
    const T = Calc.plot(cv, view, []);
    const ctx = cv.ctx;
    series.forEach(S => {
      ctx.save(); ctx.strokeStyle = S.color.startsWith("--") ? css(S.color) : S.color; ctx.lineWidth = S.width || 2; ctx.setLineDash(S.dash || []);
      ctx.globalAlpha = S.alpha || 1;
      ctx.beginPath(); let pen = false;
      S.ys.forEach((y, i) => { if (!Number.isFinite(y)) { pen = false; return; } const X = T.tx(i), Y = T.ty(y); pen ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); pen = true; });
      ctx.stroke(); ctx.restore();
    });
    let ly = 16;
    series.filter(S => S.label).forEach(S => {
      const col = S.color.startsWith("--") ? css(S.color) : S.color;
      ctx.save(); ctx.fillStyle = col; ctx.fillRect(cv.w - 150, ly - 6, 12, 4); ctx.restore();
      text(ctx, S.label, cv.w - 134, ly - 4, css("--text"), 11, "left", "middle", 600); ly += 15;
    });
    return T;
  }
  const movAvg = (a, k) => a.map((_, i) => { const lo = Math.max(0, i - k + 1); let s = 0; for (let j = lo; j <= i; j++) s += a[j]; return s / (i - lo + 1); });

  const W = {};

  /* ==================================================================
     corridor – 15.1: ágens, környezet, jutalom egy folyosón
     ================================================================== */
  W["corridor"] = root => {
    header(root, "A porszívórobot a folyosón",
      "Válassz stratégiát (melyik cellában merre lépjen a robot), aztán léptesd! A „saját” stratégiánál kattints egy cellára: megfordul a nyíl. " +
      "Csúszós padlón a robot 20% eséllyel helyben marad.");
    let slip = 0, pol = "right", own = { 1: 1, 2: 1, 3: 1 }, env = makeEnv("folyoso"), rnd = rng(3);
    let s = env.start, traj = [], G = 0, done = false, nEp = 0, sumG = 0, nWin = 0, sumLen = 0;
    const tg = toggleGroup([["right", "mindig jobbra"], ["left", "mindig balra"], ["rand", "véletlen (50–50%)"], ["own", "saját"]],
      () => pol, k => { pol = k; resetStats(); });
    root.append(h("div", { class: "controls" }, small("stratégia:"), tg.bs));
    const slipCb = h("input", { type: "checkbox" });
    slipCb.addEventListener("change", () => { slip = slipCb.checked ? 0.2 : 0; env = makeEnv("folyoso", { slip }); resetStats(); });
    const wrap = h("div", { style: "min-width:0" }); root.append(wrap);
    const cv = mkCanvas(wrap, gridHeight(env, 96), 520);
    const log = h("div", { class: "tw", style: "overflow-x:auto;font-size:.88rem;margin-top:.4rem;font-family:var(--mono)" });
    root.append(log);
    root.append(h("div", { class: "controls" },
      btn("1 lépés", () => { step1(); draw(); }, "btn primary"),
      btn("Epizód végig", () => { if (done) newEp(); let k = 0; while (!done && k++ < 200) step1(); draw(); }),
      btn("100 epizód", () => { for (let i = 0; i < 100; i++) { newEp(); let k = 0; while (!done && k++ < 200) step1(); } draw(); }),
      btn("Statisztika törlése", () => resetStats()),
      h("label", null, slipCb, "csúszós padló")));
    const st = [stat("epizód"), stat("átlagos összjutalom"), stat("a töltőnél ért véget"), stat("átlagos hossz")];
    root.append(h("div", { class: "stat-row" }, st));
    const policyAct = c => {
      const k = c;   /* c = 1, 2, 3 (a cella sorszáma) */
      if (pol === "right") return 1;
      if (pol === "left") return 3;
      if (pol === "own") return own[k];
      return rnd() < 0.5 ? 1 : 3;
    };
    function newEp() { s = env.start; traj = []; G = 0; done = false; }
    function step1() {
      if (done) newEp();
      const a = policyAct(s), [s2, r] = [...env.sample(s, a, rnd)], d = env.terminal(s2);
      traj.push([s, a, r]); G += r; s = s2;
      if (d || traj.length >= 200) {
        done = true; nEp++; sumG += G; sumLen += traj.length; if (env.cell(s2) === "C") nWin++;
      }
    }
    function resetStats() { nEp = 0; sumG = 0; nWin = 0; sumLen = 0; newEp(); draw(); }
    cv.c.addEventListener("click", e => {
      if (pol !== "own") return;
      const c = cellAt(cv, env, gridGeom(cv, env, 96), e);
      if (c != null && c >= 1 && c <= 3) { own[c] = own[c] === 1 ? 3 : 1; resetStats(); }
    });
    function draw() {
      const arrows = {};
      [1, 2, 3].forEach(c => { arrows[c] = pol === "rand" ? [1, 3] : [policyAct(c)]; });
      drawGrid(cv, env, { arrows, agent: s, maxCell: 96, cellLabel: c => (c >= 1 && c <= 3 ? c + ". cella" : "") });
      const cellName = c => (env.cell(c) === "X" ? "lépcső" : env.cell(c) === "C" ? "töltő" : c + ".");
      const steps = traj.slice(-12).map(([a0, a, r]) => `${cellName(a0)} ${a === 1 ? "→" : "←"} (${r > 0 ? "+" : ""}${fmt(r, 0)})`);
      log.innerHTML = traj.length
        ? `<b>Ez az epizód:</b> ${traj.length > 12 ? "… " : ""}${steps.join(" · ")}${done ? ` · <b>vége</b> (${cellName(s)})` : ""} &nbsp; összjutalom: <b>${fmt(G, 0)}</b>`
        : "<span class='muted'>A robot a 2. cellában áll. Nyomd meg az „1 lépés” gombot!</span>";
      st[0].set(String(nEp)); st[1].set(nEp ? fmt(sumG / nEp, 2) : "–"); st[2].set(nEp ? pct(nWin / nEp) : "–"); st[3].set(nEp ? fmt(sumLen / nEp, 1) : "–");
    }
    cv.draw = draw; draw();
  };

  /* ==================================================================
     bandit-lab – 15.2: felfedezés vs. kiaknázás
     ================================================================== */
  W["bandit-lab"] = root => {
    header(root, "Három félkarú rabló",
      "Minden automata egy érmét ad (1) vagy nem ad (0), mindegyik a saját, rejtett esélyével. Játssz te, vagy nézd, hogyan dönt egy stratégia! " +
      "A <b>megbánás</b> azt méri, mennyivel kaptál várhatóan kevesebbet annál, mintha végig a legjobb automatát húztad volna.");
    let means = [0.3, 0.5, 0.7], mode = "eps", eps = 0.1, c = 1, reveal = false, seed = 7;
    let B;
    const make = () => { B = makeBandit(means, { mode: mode === "you" ? "greedy" : mode === "opt" ? "greedy" : mode, eps, c, q0: mode === "opt" ? 1 : 0, seed }); };
    const tg = toggleGroup([["you", "te játszol"], ["greedy", "mohó"], ["eps", "ε-mohó"], ["opt", "optimista mohó"], ["ucb", "UCB"]],
      () => mode, k => { mode = k; make(); paintCtl(); draw(); });
    root.append(h("div", { class: "controls" }, small("stratégia:"), tg.bs));
    const epsS = sliderRow("ε =", 0, 0.5, 0.01, eps, v => fmt(v, 2), v => { eps = v; B.p.eps = v; });
    const cS = sliderRow("c =", 0.1, 2, 0.1, c, v => fmt(v, 1), v => { c = v; B.p.c = v; });
    const revCb = h("input", { type: "checkbox" });
    revCb.addEventListener("change", () => { reveal = revCb.checked; draw(); });
    root.append(h("div", { class: "controls" }, epsS, cS, h("label", null, revCb, "mutasd a valódi esélyeket")));
    const arms = h("div", { style: "display:flex;gap:.6rem;flex-wrap:wrap;margin:.4rem 0" });
    root.append(arms);
    const armBtns = [0, 1, 2].map(i => {
      const b = h("button", { class: "btn", type: "button", style: "flex:1 1 150px;text-align:left;padding:.5rem .7rem;line-height:1.35" });
      b.addEventListener("click", () => { if (mode === "you") { B.pull(i); draw(); } });
      arms.append(b); return b;
    });
    const msg = h("p", { class: "muted", style: "font-size:.88rem;margin:.2rem 0" }); root.append(msg);
    const ctlAuto = h("div", { class: "controls" },
      btn("1 húzás", () => { B.pull(); draw(); }, "btn primary"),
      btn("100 húzás", () => { for (let i = 0; i < 100; i++) B.pull(); draw(); }),
      btn("1000 húzás", () => { for (let i = 0; i < 1000; i++) B.pull(); draw(); }));
    root.append(ctlAuto);
    root.append(h("div", { class: "controls" },
      btn("Újrakezdés", () => { make(); draw(); }),
      btn("Új automaták (új esélyek)", () => { seed++; const r = rng(seed * 31); means = [0, 1, 2].map(() => Math.round((0.1 + 0.8 * r()) * 100) / 100); make(); draw(); }),
      btn("Összevetés: 200 futás × 1000 húzás", () => compare())));
    const st = [stat("húzás"), stat("összes érme"), stat("a legjobb kar aránya"), stat("megbánás")];
    root.append(h("div", { class: "stat-row" }, st));
    const cw = h("div", { style: "min-width:0;margin-top:.5rem" }); root.append(cw);
    const cv = mkCanvas(cw, w => clamp(w * 0.42, 180, 300));
    const note = h("p", { class: "muted", style: "font-size:.85rem;margin:.3rem 0 0" }); root.append(note);
    let cmp = null;
    function paintCtl() {
      epsS.style.display = mode === "eps" ? "" : "none";
      cS.style.display = mode === "ucb" ? "" : "none";
      ctlAuto.style.display = mode === "you" ? "none" : "";
    }
    function compare() {
      const cfg = [["mohó", "greedy", 0, 0, "--bad"], ["ε = 0,01", "eps", 0.01, 0, "--setB"], ["ε = 0,1", "eps", 0.1, 0, "--setA"], ["optimista", "greedy", 0, 1, "--setC"], ["UCB, c = 1", "ucb", 0, 0, "--accent"]];
      cmp = cfg.map(([label, m, e, q0, color], k) => {
        const acc = new Array(1000).fill(0);
        for (let r = 0; r < 200; r++) {
          const b = makeBandit(means, { mode: m, eps: e, c: 1, q0, seed: 1000 * k + r + 1 });
          for (let t = 0; t < 1000; t++) { b.pull(); acc[t] += b.regret; }
        }
        return { label, color, ys: acc.map(v => v / 200) };
      });
      draw();
    }
    function draw() {
      const bestI = means.indexOf(Math.max(...means));
      armBtns.forEach((b, i) => {
        const last = B.last && B.last.a === i;
        b.innerHTML = `<b>${"ABC"[i]} automata</b>${last ? (B.last.r ? " 🪙 +1" : " · 0") : ""}<br>` +
          `<small>húzva: ${B.N[i]}× · becslés: ${B.N[i] || mode === "opt" ? fix(B.Q[i], 3) : "–"}` +
          (reveal ? ` · valódi: ${fix(means[i], 2)}${i === bestI ? " ★" : ""}` : "") + "</small>";
        b.classList.toggle("on", !!last);
        b.style.cursor = mode === "you" ? "pointer" : "default";
      });
      msg.innerHTML = B.last ? `Utolsó húzás: <b>${"ABC"[B.last.a]}</b> – ${B.last.why}${B.last.r ? ", nyert." : ", nem nyert."}` :
        (mode === "you" ? "Kattints egy automatára!" : "Nyomd meg az „1 húzás” gombot!");
      st[0].set(String(B.t)); st[1].set(String(B.total)); st[2].set(B.t ? pct(B.opt / B.t) : "–"); st[3].set(fmt(B.regret, 1));
      if (cmp) {
        lineChart(cv, cmp.map(s => ({ ys: s.ys, color: s.color, label: s.label, width: 2 })), { xname: "húzás", yname: "átlagos megbánás" });
        note.innerHTML = "Átlagos megbánás 200 futásból, ugyanazokkal az automatákkal. A vonal meredeksége a húzásonkénti veszteség: a mohó egyenes (gyakran beragad), a jó stratégiáé ellaposodik. Új futáshoz nyomd meg újra.";
      } else {
        lineChart(cv, [{ ys: [0, ...B.hist], color: "--accent", width: 2.2 }], { xname: "húzás", yname: "megbánás" });
        note.textContent = "A megbánás minden húzásnál a legjobb kar és a választott kar valódi esélyének különbségével nő. Az „Összevetés” gomb öt stratégiát hasonlít össze.";
      }
    }
    make(); paintCtl(); cv.draw = draw; draw();
  };

  /* ==================================================================
     discount – 15.3-a: mennyit ér a jövő?
     ================================================================== */
  W["discount"] = root => {
    header(root, "Mennyit ér a jövő? – a diszkonttényező",
      "Az oszlopok azt mutatják, mennyit ér ma egy $k$ lépés múlva kapott 1 pontnyi jutalom: $\\gamma^k$. " +
      "Alattuk két ajánlat: <b>A</b> = +1 most, <b>B</b> = +3 tíz lépés múlva. Melyiket választja az ágens?");
    let g = 0.9;
    const gS = sliderRow("γ =", 0, 0.999, 0.001, g, v => fmt(v, 3), v => { g = v; draw(); });
    root.append(h("div", { class: "controls" }, gS,
      ...[0.5, 0.8, 0.9, 0.99].map(v => btn(fmt(v, 2), () => { g = v; gS.set(v); draw(); }))));
    const cw = h("div", { style: "min-width:0" }); root.append(cw);
    const cv = mkCanvas(cw, w => clamp(w * 0.36, 170, 250));
    const st = [stat("A: +1 most"), stat("B: +3 a 10. lépésben"), stat("horizont ≈ 1/(1−γ)"), stat("felezési idő (lépés)")];
    root.append(h("div", { class: "stat-row" }, st));
    const out = h("p", { style: "margin:.4rem 0 0;font-size:.92rem" }); root.append(out);
    function draw() {
      cv.resize();
      const { ctx, w, h: hh } = cv, K = 40, L = 34, R = 8, top = 10, bottom = hh - 22, bw = (w - L - R) / K;
      ctx.clearRect(0, 0, w, hh); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
      ctx.strokeStyle = css("--border"); ctx.lineWidth = 1;
      [0, 0.5, 1].forEach(v => { const y = bottom - v * (bottom - top); ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(w - R, y); ctx.stroke(); text(ctx, fmt(v, 1), L - 5, y, css("--muted"), 10, "right"); });
      for (let k = 0; k < K; k++) {
        const v = Math.pow(g, k), x = L + k * bw;
        ctx.fillStyle = k === 0 ? css("--setA") : k === 10 ? css("--setB") : mix("--accent", 0.6);
        ctx.fillRect(x + 1, bottom - v * (bottom - top), Math.max(1, bw - 2), v * (bottom - top));
        if (k % 5 === 0 && x + bw / 2 < w - R - 125) text(ctx, String(k), x + bw / 2, bottom + 10, css("--muted"), 10);
      }
      text(ctx, "k (hány lépés múlva)", w - R, bottom + 10, css("--muted"), 10, "right");
      const A = 1, Bv = 3 * Math.pow(g, 10), hor = g < 1 ? 1 / (1 - g) : Infinity, half = g > 0 ? Math.log(0.5) / Math.log(g) : 0;
      st[0].set(fmt(A, 3)); st[1].set(fmt(Bv, 3)); st[2].set(Number.isFinite(hor) ? fmt(hor, 1) : "∞"); st[3].set(g > 0 ? fmt(half, 1) : "0");
      out.innerHTML = Math.abs(A - Bv) < 0.005 ? "A két ajánlat most kb. egyformán jó: ez a határ, $\\gamma \\approx 0{,}896$." :
        Bv > A ? `Az ágens a <b>B</b>-t választja: türelmes, a 3 pont 10 lépés múlva is többet ér ($3\\gamma^{10} \\approx ${fix(Bv, 3).replace(",", "{,}")}$).` :
          `Az ágens az <b>A</b>-t választja: türelmetlen, a 3 pont 10 lépés múlva csak $3\\gamma^{10} \\approx ${fix(Bv, 3).replace(",", "{,}")}$-et ér.`;
      math(out);
    }
    cv.draw = draw; draw();
  };

  /* ==================================================================
     bellman-backup – 15.3-c: értékiteráció söprésenként
     ================================================================== */
  W["bellman-backup"] = root => {
    header(root, "Bellman-frissítés lépésről lépésre",
      "Minden cella kezdetben 0 értékű. Egy <b>söprés</b> minden cellát egyszerre frissít: $V(s) \\leftarrow \\max_a \\big[r + \\gamma V(s')\\big]$, a régi értékekből. " +
      "Kattints egy cellára: alul látod a számolást. A nyilak a legjobb cselekvést mutatják.");
    let map = "folyoso", g = 0.9, slip = 0, env, V, sweeps = 0, delta = null, sel = null;
    const tg = toggleGroup([["folyoso", "folyosó"], ["raktar", "raktár"], ["szirt", "szirt"]], () => map, k => { map = k; reset(); });
    root.append(h("div", { class: "controls" }, small("világ:"), tg.bs));
    const gS = sliderRow("γ =", 0, 1, 0.01, g, v => fmt(v, 2), v => { g = v; reset(); });
    const slipCb = h("input", { type: "checkbox" });
    slipCb.addEventListener("change", () => { slip = slipCb.checked ? 0.2 : 0; reset(); });
    root.append(h("div", { class: "controls" }, gS, h("label", null, slipCb, "csúszós padló (20%)")));
    const wrap = h("div", { style: "min-width:0" }); root.append(wrap);
    let cv;
    root.append(h("div", { class: "controls" },
      btn("1 söprés", () => { sweep(); draw(); }, "btn primary"),
      btn("Konvergálásig", () => { let k = 0; while ((delta == null || delta > 1e-6) && k++ < 2000) sweep(); draw(); }),
      btn("Vissza 0-ra", () => reset())));
    const st = [stat("söprés"), stat("legnagyobb változás"), stat("V(start)")];
    root.append(h("div", { class: "stat-row" }, st));
    const calc = h("div", { style: "font-size:.9rem;margin-top:.5rem" }); root.append(calc);
    function sweep() { [V, delta] = viSweep(env, V, g); sweeps++; }
    function reset() {
      env = makeEnv(map, { slip }); V = new Array(env.N).fill(0); sweeps = 0; delta = null;
      sel = map === "folyoso" ? 2 : env.start;
      wrap.innerHTML = ""; cv = mkCanvas(wrap, gridHeight(env, map === "folyoso" ? 96 : 78), 760); cv.draw = draw;
      cv.c.addEventListener("click", e => { const c = cellAt(cv, env, gridGeom(cv, env, map === "folyoso" ? 96 : 78), e); if (c != null && env.states.includes(c)) { sel = c; draw(); } });
      draw();
    }
    function draw() {
      const arrows = {}, scale = map === "szirt" ? 20 : 10;
      env.states.forEach(s => {
        if (sweeps === 0) return;
        const qs = env.actions.map(a => qFromV(env, V, s, a, g));
        arrows[s] = argmaxAll(qs, 1e-6).map(i => env.actions[i]);
      });
      drawGrid(cv, env, { V, arrows, sel, scale, maxCell: map === "folyoso" ? 96 : 78, cellLabel: s => fix(V[s], 2) });
      st[0].set(String(sweeps)); st[1].set(delta == null ? "–" : fix(delta, 3)); st[2].set(fix(V[map === "folyoso" ? 2 : env.start], 2));
      if (sel == null) { calc.innerHTML = ""; return; }
      const lines = env.actions.map(a => {
        const parts = env.trans(sel, a).map(([p, s2, r, d]) => {
          const tail = d ? "" : ` + ${fix(g, 2)} · ${fix(V[s2], 2)}`;
          return (p < 1 ? `${fix(p, 1)} · (` : "") + `${fix(r, 0)}${tail}` + (p < 1 ? ")" : "");
        });
        return [a, parts.join(" + "), qFromV(env, V, sel, a, g)];
      });
      const best = Math.max(...lines.map(l => l[2]));
      calc.innerHTML = `<b>A kijelölt cella következő frissítése</b> (a mostani értékekből):<div class="tw" style="overflow-x:auto"><table style="font-size:.86rem;max-width:620px">` +
        `<tr><th>cselekvés</th><th>$r + \\gamma V(s')$</th><th>érték</th></tr>` +
        lines.map(([a, s, q]) => `<tr${Math.abs(q - best) < 1e-9 ? " style='font-weight:700'" : ""}><td>${ARROW[a]} ${ANAME[a]}</td><td>${s}</td><td>${fix(q, 3)}</td></tr>`).join("") +
        `</table></div>Az új érték a legnagyobb: <b>${fix(best, 3)}</b> (most: ${fix(V[sel], 3)}).`;
      math(calc);
    }
    reset();
  };

  /* ==================================================================
     gridworld-q – 15.4 és 15.8: Q-tanulás és SARSA
     ================================================================== */
  W["gridworld-q"] = root => {
    const preset = root.dataset.map || "raktar";
    header(root, "Q-tanulás a rácsvilágban",
      "Az ágens nem ismeri a térképet: csak lép, és a kapott jutalomból frissíti a Q-táblát. Egy cella négy háromszöge a négy cselekvés $Q$-értéke " +
      "(zöld: jó, piros: rossz), a nyíl a mohó választás. Nézd meg, hogyan „szivárog vissza” az érték a céltól a start felé!");
    let map = preset, algo = "q", alpha = 0.5, gamma = map === "szirt" ? 1 : 0.9, eps = 0.1, slip = 0, seed = 1, env, L, timer = null, trail = {};
    const tgM = toggleGroup([["raktar", "raktár"], ["szirt", "szirt"]], () => map, k => { map = k; gamma = map === "szirt" ? 1 : 0.9; gS.set(gamma); reset(); });
    const tgA = toggleGroup([["q", "Q-tanulás"], ["sarsa", "SARSA"]], () => algo, k => { algo = k; reset(); });
    root.append(h("div", { class: "controls" }, small("világ:"), tgM.bs, small(" algoritmus:"), tgA.bs));
    const aS = sliderRow("α =", 0.05, 1, 0.05, alpha, v => fmt(v, 2), v => { alpha = v; if (L) L.p.alpha = v; });
    const gS = sliderRow("γ =", 0, 1, 0.01, gamma, v => fmt(v, 2), v => { gamma = v; if (L) L.p.gamma = v; });
    const eS = sliderRow("ε =", 0, 0.5, 0.01, eps, v => fmt(v, 2), v => { eps = v; if (L) L.p.eps = v; });
    const slipCb = h("input", { type: "checkbox" });
    slipCb.addEventListener("change", () => { slip = slipCb.checked ? 0.2 : 0; reset(); });
    root.append(h("div", { class: "controls" }, aS, gS, eS, h("label", null, slipCb, "csúszós (20%)")));
    const wrap = h("div", { style: "min-width:0" }); root.append(wrap);
    let cv;
    const play = btn("▶ Epizód animálva", () => animate(), "btn primary");
    root.append(h("div", { class: "controls" },
      btn("1 lépés", () => { stop(); stepOnce(); draw(); }), play,
      btn("+10 epizód", () => { stop(); for (let i = 0; i < 10; i++) runEp(); draw(); }),
      btn("+100 epizód", () => { stop(); for (let i = 0; i < 100; i++) runEp(); draw(); }),
      btn("Törlés", () => { seed++; reset(); })));
    const last = h("div", { style: "font-size:.88rem;margin:.2rem 0;font-family:var(--mono)" }); root.append(last);
    const st = [stat("epizód"), stat("utolsó hozam"), stat("átlag (utolsó 20)"), stat("mohó út")];
    root.append(h("div", { class: "stat-row" }, st));
    const cw = h("div", { style: "min-width:0;margin-top:.5rem" }); root.append(cw);
    const ch = mkCanvas(cw, w => clamp(w * 0.32, 150, 230));
    const note = h("p", { class: "muted", style: "font-size:.85rem;margin:.3rem 0 0" }); root.append(note);
    function stop() { if (timer) { clearInterval(timer); timer = null; play.textContent = "▶ Epizód animálva"; } }
    function stepOnce() { trail[L.s] = (trail[L.s] || 0) + 1; const e = L.step(); if (e.end) trail = {}; return e; }
    function runEp() { trail = {}; L.episode(); }
    function animate() {
      if (timer) { stop(); return; }
      play.textContent = "⏸ Megállítás";
      timer = setInterval(() => { const e = stepOnce(); draw(); if (e.end) stop(); }, map === "szirt" ? 45 : 110);
    }
    function reset() {
      stop();
      env = makeEnv(map, { slip });
      L = makeLearner(env, { alpha, gamma, eps, algo, seed, maxLen: map === "szirt" ? 1000 : 200 });
      trail = {};
      wrap.innerHTML = ""; cv = mkCanvas(wrap, gridHeight(env, map === "szirt" ? 64 : 78), 760); cv.draw = draw;
      draw();
    }
    function draw() {
      const scale = map === "szirt" ? 30 : 10, arrows = {};
      env.states.forEach(s => { const q = L.Q[s]; if (env.actions.some(a => q[a] !== 0)) arrows[s] = [env.actions[argmaxAll(env.actions.map(a => q[a]))[0]]]; });
      const gp = greedyPath(env, (s, a) => L.Q[s][a], env.N + 5);
      drawGrid(cv, env, { Q: L.Q, arrows, agent: L.len || L.last ? L.s : env.start, trail, scale, maxCell: map === "szirt" ? 64 : 78 });
      const R = L.returns;
      st[0].set(String(L.ep)); st[1].set(R.length ? fmt(R[R.length - 1], 0) : "–");
      st[2].set(R.length ? fmt(R.slice(-20).reduce((a, b) => a + b, 0) / Math.min(20, R.length), 1) : "–");
      st[3].set(gp.ok ? `${gp.path.length - 1} lépés` : "nem ér célba");
      if (L.last) {
        const x = L.last, nx = x.done ? "vége" : (algo === "q" ? `max Q(s′) = ${fix(x.nextVal, 2)}` : `Q(s′, ${ARROW[x.a2]}) = ${fix(x.nextVal, 2)}`);
        last.innerHTML = `utolsó frissítés: Q(s, ${ARROW[x.a]}) ← ${fix(x.old, 2)} + ${fix(alpha, 2)}·(${fix(x.r, 0)}${x.done ? "" : " + " + fix(gamma, 2) + "·" + fix(x.nextVal, 2)} − ${fix(x.old, 2)}) = <b>${fix(x.nw, 2)}</b> &nbsp; <span class="muted">(${nx})</span>`;
      } else last.innerHTML = "<span class='muted'>A Q-tábla csupa 0. Indíts egy epizódot!</span>";
      if (R.length > 1) {
        lineChart(ch, [{ ys: R, color: "--muted", width: 1, alpha: 0.5 }, { ys: movAvg(R, 20), color: "--accent", width: 2.4, label: "20 epizód átlaga" }],
          { xname: "epizód", yname: "hozam", ymin: map === "szirt" ? Math.max(-200, Math.min(...R)) : undefined });
        note.textContent = map === "szirt"
          ? "Szirt: −1 minden lépés, −100 a szakadék (vissza a startra). Hasonlítsd össze a Q-tanulás és a SARSA mohó útját és átlagos hozamát ε = 0,1 mellett, 300–500 epizód után!"
          : "Raktár: −1 minden lépés, +10 a töltő, −10 az olajfolt. A legrövidebb út 7 lépés; a mohó út akkor jó, ha a statisztika 7 lépést mutat.";
      } else { ch.resize(); ch.ctx.clearRect(0, 0, ch.w, ch.h); note.textContent = ""; }
    }
    reset();
  };

  /* ==================================================================
     policy-gradient – 15.5-b: REINFORCE egy banditán
     ================================================================== */
  W["policy-gradient"] = root => {
    header(root, "Stratégia-gradiens: REINFORCE három automatán",
      "Itt nincs Q-tábla: a stratégia maga a tanult dolog. Minden automatának van egy $\\theta$ pontszáma, a választás valószínűsége $\\pi = \\mathrm{softmax}(\\theta)$. " +
      "Húzás után: $\\theta_k \\leftarrow \\theta_k + \\alpha\\,(r - b)\\,(\\mathbb 1[k = a] - \\pi_k)$. Az esélyek: A 0,3 · B 0,5 · C 0,7.");
    let alpha = 0.1, baseline = false, seed = 11, P;
    const means = [0.3, 0.5, 0.7];
    const make = () => { P = makePG(means, { alpha, baseline, seed }); };
    const aS = sliderRow("α =", 0.01, 1, 0.01, alpha, v => fmt(v, 2), v => { alpha = v; P.p.alpha = v; });
    const bCb = h("input", { type: "checkbox" });
    bCb.addEventListener("change", () => { baseline = bCb.checked; P.p.baseline = baseline; draw(); });
    root.append(h("div", { class: "controls" }, aS, h("label", null, bCb, "alapvonal: b = az eddigi átlagjutalom")));
    root.append(h("div", { class: "controls" },
      btn("1 húzás", () => { P.step(); runs = null; draw(); }, "btn primary"),
      btn("+100", () => { for (let i = 0; i < 100; i++) P.step(); runs = null; draw(); }),
      btn("+1000", () => { for (let i = 0; i < 1000; i++) P.step(); runs = null; draw(); }),
      btn("Újrakezdés", () => { seed++; make(); runs = null; draw(); }),
      btn("20 futás egymás mellett", () => { many(); draw(); })));
    const bars = h("div", { style: "display:flex;gap:.6rem;flex-wrap:wrap;margin:.3rem 0" }); root.append(bars);
    const last = h("div", { style: "font-size:.88rem;margin:.2rem 0" }); root.append(last);
    const cw = h("div", { style: "min-width:0;margin-top:.4rem" }); root.append(cw);
    const cv = mkCanvas(cw, w => clamp(w * 0.36, 170, 250));
    const note = h("p", { class: "muted", style: "font-size:.85rem;margin:.3rem 0 0" }); root.append(note);
    let runs = null;
    function many() {
      runs = [];
      for (let r = 0; r < 20; r++) { const p = makePG(means, { alpha, baseline, seed: 500 + r }); for (let t = 0; t < 1000; t++) p.step(); runs.push(p.hist.map(x => x[2])); }
    }
    const COLS = ["--setA", "--setB", "--setC"];
    function draw() {
      const pi = softmax(P.th);
      bars.innerHTML = "";
      pi.forEach((p, i) => bars.append(h("div", { class: "stat", style: "flex:1 1 140px" },
        h("div", { class: "v" }, pct(p, 1)), h("div", { class: "l" }, `π(${"ABC"[i]}) · θ = ${fix(P.th[i], 2)}`),
        h("div", { style: `height:6px;border-radius:3px;margin-top:.3rem;background:${css(COLS[i])};width:${clamp(100 * p, 1, 100)}%` }))));
      if (P.last) {
        const x = P.last;
        const art = ["Az A", "A B", "A C"][x.a];
        last.innerHTML = `${P.t}. húzás: <b>${"ABC"[x.a]}</b>, jutalom ${x.r}, alapvonal ${fix(x.b, 2)} → előny $r - b = ${fix(x.adv, 2).replace(",", "{,}")}$. ` +
          (x.adv > 0 ? `${art} esélye nő, a többié csökken.` : x.adv < 0 ? `${art} esélye csökken, a többié nő.` : "Nincs változás.");
        math(last);
      } else last.innerHTML = "<span class='muted'>Kezdetben mindhárom automata esélye 1/3.</span>";
      if (runs) {
        lineChart(cv, runs.map(ys => ({ ys, color: "--setC", width: 1.4, alpha: 0.55 })), { xname: "húzás", yname: "π(C)", ymin: 0, ymax: 1 });
        note.textContent = `20 független futás π(C)-je, α = ${fmt(alpha, 2)}, ${baseline ? "alapvonallal" : "alapvonal nélkül"}. Kapcsold át az alapvonalat, és futtasd újra: mennyire szórnak a görbék?`;
      } else {
        const H = P.hist;
        lineChart(cv, [0, 1, 2].map(i => ({ ys: H.map(x => x[i]), color: COLS[i], width: 2.2, label: `π(${"ABC"[i]})` })), { xname: "húzás", yname: "π", ymin: 0, ymax: 1 });
        note.textContent = "Alapvonal nélkül minden nyerés növeli a választott kar esélyét – a rosszét is. Az alapvonal a „vártnál jobb / rosszabb” különbséget használja.";
      }
    }
    make(); cv.draw = draw; draw();
  };

  /* ==================================================================
     reward-hacking – 15.6: amit mérünk, nem amit gondolunk
     ================================================================== */
  W["reward-hacking"] = root => {
    header(root, "Jutalom-kijátszás egy versenypályán",
      "A cél: eljutni a célba (+10). Négy jutalomváltozat közül választhatsz; mindegyiknél kiszámoljuk (értékiterációval) a <b>tökéletes</b> stratégiát, " +
      "és lejátsszuk 40 lépésig. Figyeld, mikor talál az ágens kiskaput!");
    let mode = "goal", g = 0.9, timer = null, frame = 0, res = null;
    const tg = toggleGroup([["goal", "csak a cél fizet"], ["buoy", "+1 a bójáért (újratöltődik)"], ["naive", "+1, ha közelebb lép"], ["potential", "potenciál-alapú alakítás"]],
      () => mode, k => { mode = k; solve(); });
    root.append(h("div", { class: "controls" }, small("jutalom:"), tg.bs));
    const gS = sliderRow("γ =", 0.5, 0.995, 0.005, g, v => fmt(v, 3), v => { g = v; solve(); });
    root.append(h("div", { class: "controls" }, gS, ...[0.9, 0.95, 0.99].map(v => btn(fmt(v, 2), () => { g = v; gS.set(v); solve(); }))));
    const wrap = h("div", { style: "min-width:0" }); root.append(wrap);
    const env0 = makeEnv("palya");
    const cv = mkCanvas(wrap, gridHeight(env0, 80), 520);
    const play = btn("▶ Lejátszás", () => animate(), "btn primary");
    root.append(h("div", { class: "controls" }, play));
    const st = [stat("célba ért?"), stat("lépések"), stat("kapott jutalom (γ nélkül)"), stat("V(start)")];
    root.append(h("div", { class: "stat-row" }, st));
    const out = h("p", { style: "font-size:.92rem;margin:.4rem 0 0" }); root.append(out);
    function solve() {
      const env = hackEnv(mode, g), { V } = valueIteration(env, g, 1e-9, 20000);
      const qOf = (s, a) => qFromV(env, V, s, a, g);
      const gp = greedyPath(env, qOf, 40);
      let raw = 0, s = env.start;
      gp.path.slice(1).forEach(s2 => { raw += env.det(s, env.actions.find(a => env.move(s, a) === s2) ?? 0)[1]; s = s2; });
      const arrows = {};
      env.states.forEach(s => { arrows[s] = [env.actions[argmaxAll(env.actions.map(a => qOf(s, a)), 1e-7)[0]]]; });
      res = { env, V, gp, raw, arrows };
      frame = gp.path.length - 1; stop(); draw();
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; play.textContent = "▶ Lejátszás"; } }
    function animate() {
      if (timer) { stop(); return; }
      frame = 0; play.textContent = "⏸ Megállítás";
      timer = setInterval(() => { frame++; draw(); if (frame >= res.gp.path.length - 1) stop(); }, 160);
    }
    function draw() {
      const { env, V, gp, raw, arrows } = res, p = gp.path.slice(0, frame + 1);
      drawGrid(cv, env, { arrows, path: p, agent: p[p.length - 1], maxCell: 80, cellLabel: s => fix(V[s], 1), V, scale: 12 });
      st[0].set(gp.ok ? "igen" : "nem"); st[1].set(gp.ok ? String(gp.path.length - 1) : "40+ (körözik)");
      st[2].set(fmt(raw, 1)); st[3].set(fix(V[env.start], 2));
      const msgs = {
        goal: "Csak a cél fizet: a legrövidebb úton (5 lépés) megy célba. A jutalom ritka – egy tanuló ágensnek sokáig kellene bolyongania, mire egyáltalán megtalálja.",
        buoy: gp.ok ? "A bója-pont most nem éri meg: rövidlátó ágensnek ($\\gamma$ kicsi) a közeli +10 többet ér, mint a távoli, lassan csordogáló bója-pontok." :
          "Kiskapu! Az ágens a bója körül köröz: ki-be lép, és minden visszalépésért +1-et kap. A célba sosem ér be – a mi szempontunkból hibás, a jutalom szempontjából <b>tökéletes</b>.",
        naive: gp.ok ? "Ennél a $\\gamma$-nál még célba megy – de próbáld ki $\\gamma = 0{,}99$-cel!" :
          "Kiskapu! Közelebb lép (+1), visszalép (0), megint közelebb (+1)… Mivel a távolodás nem kerül semmibe, a „haladás jutalma” végtelenül gyűjthető.",
        potential: "Potenciál-alapú alakítás: $F = \\gamma\\Phi(s') - \\Phi(s)$, $\\Phi = -$(távolság a céltól). Az alakító jutalmak diszkontált összege <b>minden</b> pályán ugyanannyi, $-\\Phi(\\text{start}) = 5$ – ezért a legjobb stratégia ugyanaz, mint „csak a cél” esetén (az értékek mind 5-tel nagyobbak), de a jutalom sűrű: minden közeledés azonnal jelez."
      };
      out.innerHTML = msgs[mode]; math(out);
    }
    cv.draw = draw; solve();
  };

  /* ------------------------------------------------------------------
     Indítás
     ------------------------------------------------------------------ */
  function init() {
    document.querySelectorAll(".widget[data-widget]").forEach(root => {
      const f = W[root.dataset.widget];
      if (!f) return;
      try { f(root); math(root); }
      catch (e) { root.append(h("p", { class: "muted" }, "Hiba a szemléltetés betöltésekor: " + e.message)); console.error(e); }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
