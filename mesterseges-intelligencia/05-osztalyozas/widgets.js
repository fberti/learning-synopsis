/* =========================================================
   Mesterséges intelligencia 5. fejezet – interaktív szemléltetések
   Minden widget egy  <div class="widget" data-widget="név">  elembe épül.
   A rajzoláshoz az assets/calc.js közös modulját (Calc.canvas, Calc.plot) használjuk.
   ========================================================= */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     Segédfüggvények (a 4. fejezet widgets.js-ének mintájára)
     ------------------------------------------------------------------ */
  const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const fmt = (x, d = 2) => (window.Calc ? Calc.fmt(x, d) : String(x));

  function h(tag, attrs, ...kids) {
    const e = document.createElement(tag);
    if (attrs) for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") e.className = v;
      else if (k === "html") e.innerHTML = v;
      else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v);
    }
    kids.flat().forEach(c => c != null && e.append(c.nodeType ? c : document.createTextNode(c)));
    return e;
  }
  const btn = (label, onclick, cls = "btn") => h("button", { class: cls, type: "button", onclick }, label);
  const slider = (min, max, step, value) => h("input", { type: "range", min, max, step, value });
  const checkbox = (checked, onchange) => { const c = h("input", { type: "checkbox", onchange }); c.checked = checked; return c; };
  const math = el => window.Synopsis && Synopsis.renderMath(el);

  function header(root, title, sub) {
    root.append(h("div", { class: "w-title" }, title));
    if (sub) root.append(h("p", { class: "w-sub", html: sub }));
  }
  /* vászon-koordináta egy egéreseményből */
  const evXY = (cv, e) => { const r = cv.c.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  function polyline(ctx, T, pts, color, width = 2, dash = []) {
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.setLineDash(dash);
    ctx.beginPath();
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(T.tx(x), T.ty(y)) : ctx.moveTo(T.tx(x), T.ty(y))));
    ctx.stroke(); ctx.restore();
  }
  function dot(ctx, x, y, r, color, open = false) {
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI);
    if (open) { ctx.fillStyle = css("--card"); ctx.fill(); ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke(); }
    else { ctx.fillStyle = color; ctx.fill(); }
    ctx.restore();
  }
  /* négyzet (a spam jele) – a kör a nem spamé */
  function square(ctx, x, y, r, color, open = false) {
    ctx.save();
    if (open) { ctx.fillStyle = css("--card"); ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.strokeRect(x - r, y - r, 2 * r, 2 * r); }
    else { ctx.fillStyle = color; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); }
    ctx.restore();
  }
  function label(ctx, txt, x, y, color, align = "left", font = "600 12px system-ui, sans-serif", base = "bottom") {
    ctx.save(); ctx.fillStyle = color; ctx.font = font; ctx.textAlign = align; ctx.textBaseline = base;
    ctx.fillText(txt, x, y); ctx.restore();
  }
  function star(ctx, x, y) { label(ctx, "★", x, y, css("--bad"), "center", "700 22px system-ui, sans-serif", "middle"); }
  /* választógomb-csoport: egyszerre egy aktív (.btn.on) */
  function toggleGroup(items, get, set) {
    const bs = items.map(([key, txt]) => {
      const b = btn(txt, () => set(key));
      b.dataset.key = key;
      return b;
    });
    const paint = () => bs.forEach(b => b.classList.toggle("on", b.dataset.key === String(get())));
    return { bs, paint };
  }
  /* "#3b82f6" → "rgba(59,130,246,a)" */
  function rgba(col, a) {
    const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(col.trim());
    if (!m) return col;
    return `rgba(${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)},${a})`;
  }
  /* döntési térkép: p(x, y) = az 1-es (spam / „B”) osztály valószínűsége */
  function decisionMap(cv, T, view, p, cell = 6) {
    const { ctx, w, h: hh } = cv;
    const c1 = css("--setB"), c0 = css("--setA");
    for (let px = 0; px < w; px += cell) for (let py = 0; py < hh; py += cell) {
      const x = T.ix(px + cell / 2), y = T.iy(py + cell / 2);
      if (x < view.xmin || x > view.xmax || y < view.ymin || y > view.ymax) continue;
      const v = p(x, y);
      if (!Number.isFinite(v)) continue;
      const a = 0.07 + 0.30 * Math.min(1, Math.abs(v - 0.5) * 2);
      ctx.fillStyle = rgba(v >= 0.5 ? c1 : c0, a);
      ctx.fillRect(px, py, cell, cell);
    }
  }
  const sigma = z => 1 / (1 + Math.exp(-z));
  /* kis számok normálalakban: 3,6·10⁻⁴ */
  const sci = x => x === 0 || x >= 1e-3 ? fmt(x, 5) : x.toExponential(2).replace(".", ",").replace(/e([+-]\d+)/, (m, e) => "·10^" + (+e));

  /* mulberry32: kicsi, gyors, magból reprodukálható álvéletlen-generátor */
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  const gauss = rnd => { let u = 0; while (u === 0) u = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rnd()); };

  /* A fejezet tíz levele: (linkek, felkiáltójelek), címke 1 = spam */
  const MAIL = [
    { n: "S1", x: 5, y: 2, c: 1 }, { n: "S2", x: 3, y: 5, c: 1 }, { n: "S3", x: 6, y: 3, c: 1 }, { n: "S4", x: 2, y: 6, c: 1 },
    { n: "H1", x: 0, y: 0, c: 0 }, { n: "H2", x: 1, y: 0, c: 0 }, { n: "H3", x: 2, y: 0, c: 0 }, { n: "H4", x: 0, y: 1, c: 0 },
    { n: "H5", x: 2, y: 4, c: 0 }, { n: "H6", x: 1, y: 1, c: 0 }
  ];

  const W = {};

  /* ------------------------------------------------------------------
     5.2  knn-boundary – a kNN és a legközelebbi centroid döntési térképe
     ------------------------------------------------------------------ */
  /* két hold zajjal (tanító + teszt), a [0, 10] × [0, 7] tartományban */
  function moons(n, seed) {
    const rnd = mulberry32(seed), out = [];
    for (let i = 0; i < n; i++) {
      const c = i % 2, t = Math.PI * rnd();
      let x = c ? 1 - Math.cos(t) : Math.cos(t), y = c ? 0.5 - Math.sin(t) : Math.sin(t);
      x += 0.25 * gauss(rnd); y += 0.25 * gauss(rnd);
      out.push({ x: 3.4 + 2.8 * x, y: 2.9 + 2.8 * y, c });
    }
    return out;
  }
  W["knn-boundary"] = root => {
    header(root, "kNN és legközelebbi centroid: a döntési térkép",
      "Minden pont színe azt mutatja, mit mondana a modell egy ott lévő új levélre (<span style='color:var(--setB)'>■ spam</span>, " +
      "<span style='color:var(--setA)'>● nem spam</span>; a halványabb szín bizonytalanabb szavazást jelent). Kattints a vászonra: mozgasd a ★-ot, " +
      "vagy adj hozzá új pontokat. Figyeld, hogyan változik a határ $k$-val!");
    const DS = { mail: "A tíz levél", moons: "Zajos „holdak” (tanító + teszt)" };
    const CLICK = { star: "★ mozgatása", s: "■ spam hozzáadása", hm: "● nem spam hozzáadása" };
    let ds = "mail", mode = "knn", click = "star", k = 3, showTest = true;
    let pts = [], test = [], q = { x: 3, y: 3 };
    function reset() {
      if (ds === "mail") { pts = MAIL.map(p => ({ ...p })); test = []; q = { x: 3, y: 3 }; }
      else { pts = moons(80, 7); test = moons(80, 99); q = { x: 5, y: 3.5 }; }
    }
    const gD = toggleGroup(Object.entries(DS), () => ds, v => { ds = v; k = v === "mail" ? 3 : 5; sK.value = k; reset(); sync(); });
    const gM = toggleGroup([["knn", "kNN"], ["cent", "Legközelebbi centroid"]], () => mode, v => { mode = v; sync(); });
    const gC = toggleGroup(Object.entries(CLICK), () => click, v => { click = v; gC.paint(); });
    const sK = slider(1, 25, 1, k), kOut = h("b", null, String(k));
    sK.addEventListener("input", () => { k = +sK.value; sync(); });
    const cT = checkbox(showTest, e => { showTest = e.target.checked; sync(); });
    const lT = h("label", null, cT, "tesztpontok (üres jel)");
    root.append(h("div", { class: "controls" }, gD.bs),
      h("div", { class: "controls" }, gM.bs, h("label", null, "k = ", kOut, sK)),
      h("div", { class: "controls" }, gC.bs, btn("↺ Alaphelyzet", () => { reset(); sync(); }),
        lT));
    const cv = Calc.canvas(root, 0.66);
    const out = h("div", { class: "readout" });
    root.append(out);
    const view = () => ds === "mail" ? { xmin: -0.6, xmax: 7.6, ymin: -0.6, ymax: 7.2, xname: "linkek", yname: "felkiáltójelek" }
      : { xmin: -0.3, xmax: 10.3, ymin: -0.3, ymax: 7.2, xname: "x₁", yname: "x₂" };
    /* kNN: a k legközelebbi + a szavazat; holtversenyben a legközelebbi szomszéd dönt */
    function knn(x, y, kk, exclude = -1) {
      const d = [];
      pts.forEach((p, i) => { if (i !== exclude) d.push({ i, d: Math.hypot(p.x - x, p.y - y) }); });
      d.sort((a, b) => a.d - b.d);
      const nb = d.slice(0, Math.min(kk, d.length));
      const s = nb.reduce((acc, o) => acc + pts[o.i].c, 0);
      let p = s / nb.length;
      if (p === 0.5) p = pts[nb[0].i].c ? 0.5 : 0.4999;
      return { nb, p };
    }
    function centroids() {
      const C = [0, 1].map(c => {
        const g = pts.filter(p => p.c === c);
        return g.length ? { x: g.reduce((s, p) => s + p.x, 0) / g.length, y: g.reduce((s, p) => s + p.y, 0) / g.length } : null;
      });
      return C;
    }
    function predict(x, y) {
      if (mode === "knn") return knn(x, y, k).p;
      const C = centroids();
      if (!C[0] || !C[1]) return C[1] ? 1 : 0;
      const d0 = Math.hypot(x - C[0].x, y - C[0].y), d1 = Math.hypot(x - C[1].x, y - C[1].y);
      return d1 < d0 ? 1 : d1 > d0 ? 0 : 0.5;
    }
    function draw() {
      const V = view();
      const T = Calc.plot(cv, V, []);
      const { ctx } = cv;
      decisionMap(cv, T, V, predict, ds === "mail" ? 5 : 6);
      const cS = css("--setB"), cH = css("--setA");
      if (mode === "cent") {
        const C = centroids();
        C.forEach((c, i) => {
          if (!c) return;
          const col = i ? cS : cH;
          ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 3.5; ctx.beginPath();
          ctx.moveTo(T.tx(c.x) - 9, T.ty(c.y)); ctx.lineTo(T.tx(c.x) + 9, T.ty(c.y));
          ctx.moveTo(T.tx(c.x), T.ty(c.y) - 9); ctx.lineTo(T.tx(c.x), T.ty(c.y) + 9); ctx.stroke(); ctx.restore();
          polyline(ctx, T, [[q.x, q.y], [c.x, c.y]], col, 1.4, [4, 4]);
        });
      } else {
        knn(q.x, q.y, k).nb.forEach(o => polyline(ctx, T, [[q.x, q.y], [pts[o.i].x, pts[o.i].y]], css("--muted"), 1.3, [3, 3]));
      }
      if (showTest) test.forEach(p => (p.c ? square(ctx, T.tx(p.x), T.ty(p.y), 3.5, cS, true) : dot(ctx, T.tx(p.x), T.ty(p.y), 3.8, cH, true)));
      pts.forEach(p => {
        if (p.c) square(ctx, T.tx(p.x), T.ty(p.y), ds === "mail" ? 6 : 4, cS); else dot(ctx, T.tx(p.x), T.ty(p.y), ds === "mail" ? 6.5 : 4.5, cH);
        if (p.n) label(ctx, p.n, T.tx(p.x) + 8, T.ty(p.y) - 6, css("--text"), "left", "11px system-ui, sans-serif");
      });
      star(ctx, T.tx(q.x), T.ty(q.y));
      cv.T = T;
    }
    cv.draw = draw;
    cv.c.addEventListener("pointerdown", e => {
      if (!cv.T) return;
      const [px, py] = evXY(cv, e), x = cv.T.ix(px), y = cv.T.iy(py), V = view();
      if (x < V.xmin || x > V.xmax || y < V.ymin || y > V.ymax) return;
      const r = v => ds === "mail" ? Math.round(v * 2) / 2 : v;          // a levelekhez fél egységre kerekítünk
      if (click === "star") q = { x: r(x), y: r(y) };
      else pts.push({ x: r(x), y: r(y), c: click === "s" ? 1 : 0 });
      sync();
    });
    const acc = (set, f) => set.length ? set.filter((p, i) => (f(p, i) >= 0.5 ? 1 : 0) === p.c).length / set.length : NaN;
    function sync() {
      gD.paint(); gM.paint(); gC.paint();
      sK.max = Math.max(1, pts.length); if (k > pts.length) { k = pts.length; sK.value = k; }
      kOut.textContent = String(k);
      sK.disabled = mode !== "knn";
      lT.style.display = test.length ? "" : "none";
      draw();
      const nm = p => p.n || (p.c ? "■" : "●");
      const cls = c => ds === "mail" ? (c ? "spam" : "nem spam") : (c ? "■" : "●");
      let txt = `★ = (${fmt(q.x, 2)}; ${fmt(q.y, 2)}) → `;
      if (mode === "knn") {
        const { nb, p } = knn(q.x, q.y, k);
        const s = nb.filter(o => pts[o.i].c).length;
        txt += `<b>${cls(p >= 0.5)}</b> (${cls(1)} : ${cls(0)} = ${s} : ${nb.length - s})<br>szomszédok: ` +
          nb.slice(0, 7).map(o => `${nm(pts[o.i])} ${fmt(o.d, 2)}`).join(" · ") + (nb.length > 7 ? " · …" : "");
      } else {
        const C = centroids();
        if (C[0] && C[1]) {
          const d0 = Math.hypot(q.x - C[0].x, q.y - C[0].y), d1 = Math.hypot(q.x - C[1].x, q.y - C[1].y);
          txt += `<b>${cls(d1 < d0)}</b><br>${cls(1)}-centroid (${fmt(C[1].x, 2)}; ${fmt(C[1].y, 2)}), távolság ${fmt(d1, 3)} · ` +
            `${cls(0)}-centroid (${fmt(C[0].x, 2)}; ${fmt(C[0].y, 2)}), távolság ${fmt(d0, 3)}`;
        } else txt += "mindkét osztályból kell legalább egy pont";
      }
      const trA = mode === "knn" ? acc(pts, (p, i) => knn(p.x, p.y, k).p) : acc(pts, p => predict(p.x, p.y));
      txt += `<br>pontosság a tanító pontokon: <b>${fmt(100 * trA, 1)}%</b>`;
      if (test.length) txt += ` · a tesztpontokon: <b>${fmt(100 * acc(test, p => predict(p.x, p.y)), 1)}%</b>`;
      if (mode === "knn" && k === 1) txt += `<br><span class="muted">k = 1: a tanító pontokon mindig 100% – minden pont saját maga legközelebbi szomszédja.</span>`;
      else if (mode === "knn" && k >= pts.length) txt += `<br><span class="muted">k = n: mindenhol a többségi osztály – ez az alapvonal.</span>`;
      else if (mode === "cent") txt += `<br><span class="muted">A határ mindig egyenes: a két centroid felező merőlegese.</span>`;
      out.innerHTML = txt;
    }
    reset(); sync();
  };

  /* ------------------------------------------------------------------
     5.3  line-vs-sigmoid – egyenes vagy szigmoid a 0/1 címkére?
     ------------------------------------------------------------------ */
  /* egyváltozós logisztikus regresszió Newton-módszerrel (kis L2-büntetéssel, hogy mindig véges legyen) */
  function fitLogistic1D(xs, ys, lam = 1e-4) {
    let w = 0, b = 0;
    for (let it = 0; it < 60; it++) {
      let gw = lam * w, gb = 0, hww = lam, hwb = 0, hbb = 1e-9;
      xs.forEach((x, i) => {
        const p = sigma(w * x + b), r = p - ys[i], s = p * (1 - p);
        gw += r * x; gb += r; hww += s * x * x; hwb += s * x; hbb += s;
      });
      const det = hww * hbb - hwb * hwb;
      if (Math.abs(det) < 1e-12) break;
      const dw = (hbb * gw - hwb * gb) / det, db = (hww * gb - hwb * gw) / det;
      w -= dw; b -= db;
      if (Math.abs(dw) + Math.abs(db) < 1e-10) break;
    }
    return { w, b };
  }
  function fitLine(xs, ys) {
    const n = xs.length, mx = xs.reduce((s, v) => s + v, 0) / n, my = ys.reduce((s, v) => s + v, 0) / n;
    let sxy = 0, sxx = 0;
    xs.forEach((x, i) => { sxy += (x - mx) * (ys[i] - my); sxx += (x - mx) ** 2; });
    const a = sxy / sxx;
    return { a, b: my - a * mx };
  }
  /* pontok 0 és 1 magasságban, az egyformák kicsit egymás fölé tolva */
  function stackedPoints(ctx, T, data, cS, cH) {
    const seen = {};
    data.forEach(p => {
      const key = p.x + "_" + p.c; seen[key] = (seen[key] || 0) + 1;
      const off = (seen[key] - 1) * 9 * (p.c ? 1 : -1);
      const X = T.tx(p.x), Y = T.ty(p.c) - off;
      p.c ? square(ctx, X, Y, 5, cS) : dot(ctx, X, Y, 5.5, cH);
    });
  }
  W["line-vs-sigmoid"] = root => {
    header(root, "Egyenes vagy szigmoid a 0/1 címkére?",
      "A tíz levél: vízszintesen a felkiáltójelek száma, függőlegesen a címke (1 = spam, 0 = nem spam). Mindkét modellt illesztjük, és a 0,5-ös szint " +
      "metszéspontja a döntési határ (szaggatott függőleges vonal). Adj hozzá egy nagyon egyértelmű, 20 felkiáltójeles spamet, és figyeld, melyik határ mozdul el!");
    let showL = true, showS = true, extra = false;
    const bX = btn("➕ 20 felkiáltójeles spam", () => { extra = !extra; sync(); });
    root.append(h("div", { class: "controls" },
      h("label", null, checkbox(showL, e => { showL = e.target.checked; sync(); }), "egyenes (lineáris regresszió)"),
      h("label", null, checkbox(showS, e => { showS = e.target.checked; sync(); }), "szigmoid (logisztikus regresszió)"), bX));
    const cv = Calc.canvas(root, 0.5);
    const out = h("div", { class: "readout" });
    root.append(out);
    const data = () => MAIL.map(p => ({ x: p.y, c: p.c })).concat(extra ? [{ x: 20, c: 1 }] : []);
    function models() {
      const d = data(), xs = d.map(p => p.x), ys = d.map(p => p.c);
      return { L: fitLine(xs, ys), S: fitLogistic1D(xs, ys) };
    }
    function draw() {
      const { L, S } = models(), xmax = extra ? 21 : 8;
      const layers = [{ hline: 0.5, color: css("--muted"), dash: [2, 4], width: 1 }, { hline: 1, color: css("--border"), width: 1 }];
      if (showL) {
        layers.push({ f: x => L.a * x + L.b, color: "--accent", width: 2.2 });
        layers.push({ vline: (0.5 - L.b) / L.a, color: "--accent", dash: [6, 4], width: 1.4 });
      }
      if (showS) {
        layers.push({ f: x => sigma(S.w * x + S.b), color: "--setC", width: 2.6 });
        layers.push({ vline: -S.b / S.w, color: "--setC", dash: [6, 4], width: 1.4 });
      }
      const T = Calc.plot(cv, { xmin: -0.8, xmax, ymin: -0.35, ymax: 1.45, ystep: 0.5, xname: "felkiáltójelek", yname: "spam?" }, layers);
      stackedPoints(cv.ctx, T, data(), css("--setB"), css("--setA"));
    }
    cv.draw = draw;
    function sync() {
      bX.classList.toggle("on", extra);
      draw();
      const { L, S } = models(), tL = (0.5 - L.b) / L.a, tS = -S.b / S.w;
      out.innerHTML =
        `<span style="color:var(--accent)">egyenes</span>: ŷ = ${fmt(L.a, 3)}·x + ${fmt(L.b, 3)} · határ: x = <b>${fmt(tL, 2)}</b>` +
        (extra ? ` · ŷ(20) = <b>${fmt(L.a * 20 + L.b, 2)}</b> (1-nél nagyobb!)` : ` · ŷ(6) = ${fmt(L.a * 6 + L.b, 3)}`) +
        `<br><span style="color:var(--setC)">szigmoid</span>: p̂ = σ(${fmt(S.w, 3)}·x ${S.b < 0 ? "−" : "+"} ${fmt(Math.abs(S.b), 3)}) · határ: x = <b>${fmt(tS, 2)}</b>` +
        (extra ? ` · p̂(20) = ${fmt(sigma(S.w * 20 + S.b), 6)}` : ` · p̂(6) = ${fmt(sigma(S.w * 6 + S.b), 3)}`) +
        `<br><span class="muted">${extra
          ? "Az egyenes határa 2,8-ről 4,7-re ugrott egyetlen egyértelmű levél miatt; a szigmoid határa alig mozdult – a „biztos” pontnál a hibája már szinte nulla."
          : "Mindkét határ 2,7–2,8 körül van. A különbség akkor látszik, ha egy távoli, egyértelmű pontot adsz hozzá."}</span>`;
    }
    sync();
  };

  /* ------------------------------------------------------------------
     5.3  sigmoid-fit – logisztikus regresszió tanítása gradiens módszerrel, küszöbbel
     ------------------------------------------------------------------ */
  W["sigmoid-fit"] = root => {
    header(root, "Nézd, ahogy tanul: logisztikus regresszió gradiens módszerrel",
      "A modell $\\hat p = \\sigma(w\\,x + b)$, ahol $x$ a felkiáltójelek száma. Állítsd kézzel a $w$-t és a $b$-t, vagy tanítsd a gradiens módszerrel " +
      "a keresztentrópia csökkentésével. A függőleges szakaszok a pontok „hibáját” mutatják (a címke és a jóslat távolsága). A küszöb csúszkával döntési szabályt csinálsz a valószínűségből.");
    const xs = MAIL.map(p => p.y), ys = MAIL.map(p => p.c);
    let w = 0, b = 0, eta = 0.1, t = 0.5, hist = [], timer = null;
    const sW = slider(-1, 3, 0.01, w), sB = slider(-8, 2, 0.01, b), sT = slider(0.05, 0.95, 0.01, t);
    const oW = h("b"), oB = h("b"), oT = h("b");
    const loss = (w, b) => xs.reduce((s, x, i) => { const p = sigma(w * x + b); return s - (ys[i] ? Math.log(p) : Math.log(1 - p)); }, 0) / xs.length;
    function grad(w, b) {
      let gw = 0, gb = 0;
      xs.forEach((x, i) => { const r = sigma(w * x + b) - ys[i]; gw += r * x; gb += r; });
      return [gw / xs.length, gb / xs.length];
    }
    function step() { const [gw, gb] = grad(w, b); w -= eta * gw; b -= eta * gb; hist.push(loss(w, b)); }
    const stop = () => { if (timer) { clearInterval(timer); timer = null; bRun.textContent = "▶ Tanítás"; } };
    const bRun = btn("▶ Tanítás", () => {
      if (timer) return stop();
      bRun.textContent = "⏸ Állj";
      timer = setInterval(() => {
        for (let i = 0; i < 20; i++) step();
        const [gw, gb] = grad(w, b);
        sync();
        if (hist.length > 6000 || Math.hypot(gw, gb) < 1e-6) stop();
      }, 40);
    });
    const gE = toggleGroup([["0.05", "η = 0,05"], ["0.1", "η = 0,1"], ["0.5", "η = 0,5"]], () => String(eta), v => { eta = +v; gE.paint(); });
    sW.addEventListener("input", () => { stop(); w = +sW.value; hist = [loss(w, b)]; sync(); });
    sB.addEventListener("input", () => { stop(); b = +sB.value; hist = [loss(w, b)]; sync(); });
    sT.addEventListener("input", () => { t = +sT.value; sync(); });
    root.append(
      h("div", { class: "controls" }, h("label", null, "w = ", oW, sW), h("label", null, "b = ", oB, sB)),
      h("div", { class: "controls" }, btn("1 lépés", () => { stop(); step(); sync(); }), bRun, gE.bs,
        btn("↺ w = b = 0", () => { stop(); w = 0; b = 0; hist = [loss(0, 0)]; sync(); })),
      h("div", { class: "controls" }, h("label", null, "küszöb t = ", oT, sT)));
    const cv = Calc.canvas(root, 0.48);
    const cvL = Calc.canvas(root, 0.16);
    const out = h("div", { class: "readout" });
    root.append(out);
    function draw() {
      const T = Calc.plot(cv, { xmin: -0.8, xmax: 8, ymin: -0.35, ymax: 1.45, ystep: 0.5, xname: "felkiáltójelek", yname: "p̂" },
        [{ hline: t, color: css("--bad"), dash: [2, 4], width: 1 }, { hline: 1, color: css("--border"), width: 1 },
         { f: x => sigma(w * x + b), color: "--setC", width: 2.6 }]);
      const { ctx } = cv;
      /* a küszöbnek megfelelő x: w x + b = ln(t / (1 − t)) */
      if (Math.abs(w) > 1e-9) {
        const xt = (Math.log(t / (1 - t)) - b) / w;
        if (xt > -0.8 && xt < 8) polyline(ctx, T, [[xt, -0.35], [xt, 1.45]], css("--bad"), 1.4, [6, 4]);
      }
      MAIL.forEach(p => polyline(ctx, T, [[p.y, p.c], [p.y, sigma(w * p.y + b)]], css("--muted"), 1, [2, 2]));
      stackedPoints(ctx, T, MAIL.map(p => ({ x: p.y, c: p.c })), css("--setB"), css("--setA"));
      /* veszteséggörbe */
      const H = hist.length ? hist : [loss(w, b)];
      const n = Math.max(10, H.length);
      Calc.plot(cvL, { xmin: 0, xmax: n, ymin: 0, ymax: Math.max(0.8, ...H.slice(0, 1)) * 1.1, ystep: 0.2, xname: "lépés", yname: "L" },
        [{ hline: Math.log(2), color: css("--muted"), dash: [3, 3], width: 1 }, { points: H.length > 400 ? [] : H.map((v, i) => [i, v]), color: "--accent", r: 1.6 },
         { f: x => { const i = Math.round(x); return i >= 0 && i < H.length ? H[i] : NaN; }, color: "--accent", width: 1.6 }]);
    }
    cv.draw = draw; cvL.draw = draw;
    function sync() {
      sW.value = w; sB.value = b; oW.textContent = fmt(w, 3); oB.textContent = fmt(b, 3); oT.textContent = fmt(t, 2);
      gE.paint(); draw();
      const [gw, gb] = grad(w, b);
      let miss = 0, fa = 0;
      MAIL.forEach(p => { const yhat = sigma(w * p.y + b) >= t ? 1 : 0; if (p.c && !yhat) miss++; if (!p.c && yhat) fa++; });
      const xt = Math.abs(w) > 1e-9 ? (Math.log(t / (1 - t)) - b) / w : NaN;
      out.innerHTML = `keresztentrópia L = <b>${fmt(loss(w, b), 4)}</b> (kiindulás: ln 2 ≈ 0,6931) · gradiens: ∂L/∂w = ${fmt(gw, 4)}, ∂L/∂b = ${fmt(gb, 4)} · lépések: ${Math.max(0, hist.length - 1)}<br>` +
        `küszöb ${fmt(t, 2)} ⇔ z ≥ ln(t/(1 − t)) = ${fmt(Math.log(t / (1 - t)), 3)}` + (Number.isFinite(xt) ? ` ⇔ x ${w > 0 ? "≥" : "≤"} <b>${fmt(xt, 2)}</b>` : "") +
        ` · átengedett spam: <b>${miss}</b> · téves riasztás: <b>${fmt(fa, 0)}</b> · pontosság: <b>${fmt(100 * (10 - miss - fa) / 10, 0)}%</b>` +
        `<br><span class="muted">A minimum (w ≈ 0,992, b ≈ −2,736) vesztesége ≈ 0,3859. Nagy tanulási rátával (η = 0,5) gyorsabb; próbáld ki, mi történik a pontossággal 0,5 és 0,9 küszöbnél!</span>`;
    }
    hist = [loss(w, b)];
    sync();
  };

  /* ------------------------------------------------------------------
     5.4  softmax-lab – logitokból valószínűségek
     ------------------------------------------------------------------ */
  W["softmax-lab"] = root => {
    header(root, "Softmax: logitokból valószínűség-eloszlás",
      "Három osztály: munka, személyes, reklám. A csúszkákkal a modell pontszámait (logitjait) állítod. A teli oszlop a softmax, az üres keret a logitok " +
      "<em>külön-külön</em> vett szigmoidja (mint az egy-a-többi ellen módszernél) – figyeld az összegeket! Válaszd ki a helyes osztályt, és nézd a veszteséget.");
    const NAMES = ["munka", "személyes", "reklám"], COLS = ["--setA", "--setC", "--setB"];
    let z = [2, 1, 0.1], truth = 0;
    const S = z.map((v, i) => { const s = slider(-5, 5, 0.1, v); s.addEventListener("input", () => { z[i] = +s.value; sync(); }); return s; });
    const O = z.map(() => h("b"));
    const gT = toggleGroup(NAMES.map((n, i) => [String(i), "helyes: " + n]), () => String(truth), v => { truth = +v; sync(); });
    root.append(h("div", { class: "controls" }, NAMES.map((n, i) => h("label", null, `z(${n}) = `, O[i], S[i]))),
      h("div", { class: "controls" },
        btn("+1 mindegyikhez", () => { z = z.map(v => Math.min(5, v + 1)); sync(); }),
        btn("× 2", () => { z = z.map(v => Math.max(-5, Math.min(5, 2 * v))); sync(); }),
        btn("÷ 2", () => { z = z.map(v => v / 2); sync(); }),
        btn("↺ (2; 1; 0,1)", () => { z = [2, 1, 0.1]; sync(); })),
      h("div", { class: "controls" }, gT.bs));
    const cv = Calc.canvas(root, 0.42);
    const out = h("div", { class: "readout" });
    root.append(out);
    const soft = () => { const m = Math.max(...z), e = z.map(v => Math.exp(v - m)), s = e.reduce((a, b) => a + b, 0); return e.map(v => v / s); };
    function draw() {
      const { ctx, w, h: H } = cv, p = soft();
      ctx.clearRect(0, 0, w, H); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, H);
      const base = H - 28, top = 18, bw = Math.min(110, w / 5);
      ctx.strokeStyle = css("--border"); ctx.lineWidth = 1;
      [0, 0.25, 0.5, 0.75, 1].forEach(v => {
        const y = base - v * (base - top);
        ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(w - 10, y); ctx.stroke();
        label(ctx, fmt(v, 2), 34, y + 4, css("--muted"), "right", "11px system-ui, sans-serif");
      });
      p.forEach((v, i) => {
        const cx = 40 + (w - 50) * (i + 0.5) / 3, col = css(COLS[i]);
        const y = base - v * (base - top), ys = base - sigma(z[i]) * (base - top);
        ctx.fillStyle = col; ctx.fillRect(cx - bw / 2, y, bw * 0.62, base - y);
        ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.setLineDash([4, 3]);
        ctx.strokeRect(cx - bw / 2 + bw * 0.66, ys, bw * 0.34, base - ys); ctx.restore();
        label(ctx, fmt(v, 3), cx - bw / 2 + bw * 0.31, y - 4, css("--text"), "center", "700 12px system-ui, sans-serif");
        label(ctx, (i === truth ? "✓ " : "") + NAMES[i], cx, base + 18, css(i === truth ? "--text" : "--muted"), "center", (i === truth ? "700 " : "") + "12px system-ui, sans-serif");
      });
    }
    cv.draw = draw;
    function sync() {
      z.forEach((v, i) => { S[i].value = v; O[i].textContent = fmt(v, 1); });
      gT.paint(); draw();
      const p = soft(), sg = z.map(sigma);
      const ez = z.map(v => Math.exp(v)), se = ez.reduce((a, b) => a + b, 0);
      out.innerHTML = `e^z = (${ez.map(v => fmt(v, 3)).join("; ")}), összeg ${fmt(se, 3)} → softmax = (<b>${p.map(v => fmt(v, 3)).join("; ")}</b>), összeg = 1<br>` +
        `külön szigmoidok: (${sg.map(v => fmt(v, 3)).join("; ")}), összeg = <b>${fmt(sg.reduce((a, b) => a + b, 0), 3)}</b> – ez nem eloszlás<br>` +
        `veszteség (helyes: ${NAMES[truth]}): −ln ${fmt(p[truth], 3)} = <b>${fmt(-Math.log(p[truth]), 3)}</b> · egyenletes jóslatnál ln 3 ≈ 1,099 · ` +
        `gradiens a logitokra p̂ − y = (${p.map((v, i) => fmt(v - (i === truth ? 1 : 0), 3)).join("; ")})`;
    }
    sync();
  };

  /* ------------------------------------------------------------------
     5.5  naive-bayes-spam – szavankénti pontszámok
     ------------------------------------------------------------------ */
  /* szótő → [hány spamben, hány jó levélben] fordul elő */
  const NB_SETS = {
    ten: {
      name: "A tíz levél (4 szó)", nS: 4, nH: 6,
      words: { ingyen: [3, 1], "nyert": [3, 0], kattint: [3, 1], holnap: [0, 4] },
      show: { "nyert": "nyertél" }
    },
    hundred: {
      name: "100 levél, 30 szó (kitalált gyakoriságok)", nS: 40, nH: 60,
      words: {
        ingyen: [22, 3], "nyer": [18, 1], kattint: [25, 6], "akció": [15, 8], "ajánlat": [17, 6], "kedvezmény": [12, 7], azonnal: [14, 2],
        "sürgős": [10, 3], "pénz": [12, 4], hitel: [9, 1], kripto: [7, 0], "garantál": [9, 0], "exkluzív": [11, 2], "ajándék": [13, 5],
        csomag: [9, 6], "jelszó": [8, 2], holnap: [4, 30], "értekezlet": [0, 14], "megbeszél": [1, 16], csatol: [2, 18],
        "jegyzőkönyv": [0, 8], "köszön": [3, 25], "üdv": [5, 28], szia: [2, 22], anya: [0, 6], "vacsor": [1, 9], projekt: [1, 15],
        "számla": [6, 12], buli: [1, 7], "határidő": [1, 11]
      },
      show: { "nyer": "nyer…", "garantál": "garantál…", "köszön": "köszön…", "megbeszél": "megbeszél…", "vacsor": "vacsor…", csatol: "csatol…" }
    }
  };
  W["naive-bayes-spam"] = root => {
    header(root, "Naiv Bayes spamszűrő: minden szó egy bizonyíték",
      "Írj be egy levelet! A szűrő megkeresi benne az ismert szavakat (a szó elejével egyezőket is: „kattints”, „kattintson” → <code>kattint</code>), " +
      "és mindegyikhez kiszámolja a pontszámát: $\\ln\\frac{P(\\text{szó} \\mid \\text{spam})}{P(\\text{szó} \\mid \\text{nem spam})}$. " +
      "A levél log-esélye az a priori tag + a pontszámok összege; a spam valószínűsége ennek a szigmoidja. Kapcsold ki a simítást, és próbáld ki a „Nyertél! Holnap lejár…” levelet!");
    let set = "ten", lap = true;
    const inp = h("input", { type: "text", style: "width:100%;max-width:640px;padding:.4rem .5rem;font-size:1rem", value: "Gratulálunk, NYERTÉL! Kattints ide a nyereményért!!!" });
    inp.addEventListener("input", () => sync());
    const EX = ["Gratulálunk, NYERTÉL! Kattints ide a nyereményért!!!", "Nyertél! Holnap lejár, kattints!", "Holnap buli, ingyen pizza!!!!",
      "Szia! Csatolom a jegyzőkönyvet, holnap megbeszéljük.", "Exkluzív ajánlat: garantált kripto nyereség, azonnal!"];
    const gS = toggleGroup(Object.entries(NB_SETS).map(([k, v]) => [k, v.name]), () => set, v => { set = v; sync(); });
    root.append(h("div", { class: "controls" }, gS.bs, h("label", null, checkbox(lap, e => { lap = e.target.checked; sync(); }), "Laplace-simítás (α = 1)")),
      h("div", { class: "controls" }, inp),
      h("div", { class: "controls" }, h("span", { class: "muted", style: "font-size:.88rem" }, "Példák:"),
        EX.map(s => btn(s.length > 34 ? s.slice(0, 32) + "…" : s, () => { inp.value = s; sync(); }))));
    const cv = Calc.canvas(root, 0.3);
    const out = h("div", { class: "readout" });
    root.append(out);
    let last = null;
    function analyse() {
      const D = NB_SETS[set], a = lap ? 1 : 0;
      const toks = inp.value.toLowerCase().split(/[^0-9a-záéíóöőúüű]+/i).filter(Boolean);
      const found = [];
      Object.keys(D.words).forEach(stem => {
        if (toks.some(t => t.startsWith(stem))) {
          const [s, hm] = D.words[stem];
          const pS = (s + a) / (D.nS + 2 * a), pH = (hm + a) / (D.nH + 2 * a);
          found.push({ w: D.show[stem] || stem, pS, pH, sc: Math.log(pS / pH) });
        }
      });
      const prior = Math.log(D.nS / D.nH);
      let numS = D.nS / (D.nS + D.nH), numH = D.nH / (D.nS + D.nH);
      found.forEach(f => { numS *= f.pS; numH *= f.pH; });
      return { D, found, prior, numS, numH };
    }
    function draw() {
      const { ctx, w, h: H } = cv;
      ctx.clearRect(0, 0, w, H); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, H);
      if (!last) return;
      const rows = [{ w: "a priori", sc: last.prior, prior: true }].concat(last.found);
      const finite = rows.map(r => r.sc).filter(Number.isFinite);
      const M = Math.max(2, ...finite.map(Math.abs)) * 1.1;
      const cx = w * 0.55, half = w * 0.4, rh = Math.min(26, (H - 20) / Math.max(rows.length, 1));
      ctx.strokeStyle = css("--muted"); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cx, 6); ctx.lineTo(cx, H - 6); ctx.stroke();
      label(ctx, "← nem spam felé", cx - 6, 14, css("--setA"), "right", "11px system-ui, sans-serif");
      label(ctx, "spam felé →", cx + 6, 14, css("--setB"), "left", "11px system-ui, sans-serif");
      rows.forEach((r, i) => {
        const y = 22 + i * rh;
        const v = Number.isFinite(r.sc) ? r.sc : Math.sign(r.sc) * M;
        const len = v / M * half;
        ctx.fillStyle = r.prior ? css("--muted") : css(v >= 0 ? "--setB" : "--setA");
        ctx.fillRect(Math.min(cx, cx + len), y, Math.abs(len), rh * 0.66);
        label(ctx, r.w, cx - half - 4, y + rh * 0.55, css("--text"), "left", "12px system-ui, sans-serif");
        label(ctx, Number.isFinite(r.sc) ? (r.sc >= 0 ? "+" : "") + fmt(r.sc, 3) : (r.sc > 0 ? "+∞" : "−∞"),
          v >= 0 ? cx + len + 5 : cx + len - 5, y + rh * 0.55, css("--text"), v >= 0 ? "left" : "right", "600 11px system-ui, sans-serif");
      });
    }
    cv.draw = draw;
    function sync() {
      gS.paint();
      last = analyse(); draw();
      const { D, found, prior, numS, numH } = last;
      let txt = `a priori: P(spam) = ${D.nS}/${D.nS + D.nH} → ln(${D.nS}/${D.nH}) = ${fmt(prior, 3)}<br>`;
      if (!found.length) txt += "A levélben nincs ismert szó – csak az a priori tag marad.<br>";
      else txt += found.map(f => `${f.w}: P(·|spam) = ${fmt(f.pS, 3)}, P(·|nem spam) = ${fmt(f.pH, 3)}`).join(" · ") + "<br>";
      const sum = numS + numH;
      if (sum === 0) txt += `számlálók: spam = 0, nem spam = 0 → P(spam) = 0/0 – <b>nincs értelmezve</b>. Egy-egy nulla gyakoriság mindkét osztályt „megvétózta”. Kapcsold be a simítást!`;
      else {
        const pS = numS / sum, z = Math.log(numS) - Math.log(numH);
        txt += `számlálók: spam ${sci(numS)}, nem spam ${sci(numH)} · log-esély = ${Number.isFinite(z) ? "<b>" + fmt(z, 3) + "</b>" : (z > 0 ? "+∞" : "−∞")}` +
          ` → <b>P(spam) = ${fmt(pS, pS > 0.999 || pS < 0.001 ? 6 : 3)}</b> → ${pS >= 0.5 ? "<b>spam</b>" : "<b>nem spam</b>"}`;
        if (!lap && (numS === 0 || numH === 0)) txt += `<br><span class="muted">Simítás nélkül egyetlen nulla gyakoriság teljes bizonyosságot ad – ez túl erős állítás tíz levélből.</span>`;
      }
      out.innerHTML = txt;
    }
    sync();
  };

  /* ------------------------------------------------------------------
     5.6  xor-problem – egyenes, logisztikus regresszió, új jellemző
     ------------------------------------------------------------------ */
  function xorData(noisy, seed) {
    const C = [[-1, -1, 0], [1, 1, 0], [1, -1, 1], [-1, 1, 1]];
    if (!noisy) return C.map(([x, y, c]) => ({ x, y, c }));
    const rnd = mulberry32(seed), out = [];
    for (let i = 0; i < 80; i++) { const [x, y, c] = C[i % 4]; out.push({ x: x + 0.35 * gauss(rnd), y: y + 0.35 * gauss(rnd), c }); }
    return out;
  }
  function ringData(seed) {
    const rnd = mulberry32(seed), out = [];
    for (let i = 0; i < 80; i++) {
      const inner = i % 2 === 0, a = 2 * Math.PI * rnd();
      const r = inner ? 0.75 * Math.sqrt(rnd()) : 1.25 + 0.5 * rnd();
      out.push({ x: r * Math.cos(a), y: r * Math.sin(a), c: inner ? 1 : 0 });
    }
    return out;
  }
  /* logisztikus regresszió gradiens módszerrel tetszőleges jellemzőkre (kis L2-büntetéssel) */
  function trainLR(data, feats, steps = 3000, eta = 0.5, lam = 0.01) {
    const X = data.map(p => feats(p.x, p.y)), d = X[0].length;
    const w = new Array(d).fill(0); let b = 0;
    for (let s = 0; s < steps; s++) {
      const g = new Array(d).fill(0); let gb = 0;
      X.forEach((x, i) => { const r = sigma(x.reduce((a, v, j) => a + v * w[j], b)) - data[i].c; x.forEach((v, j) => (g[j] += r * v)); gb += r; });
      for (let j = 0; j < d; j++) w[j] -= eta * (g[j] / X.length + lam * w[j]);
      b -= eta * gb / X.length;
    }
    return { w, b, p: (x, y) => sigma(feats(x, y).reduce((a, v, j) => a + v * w[j], b)) };
  }
  W["xor-problem"] = root => {
    header(root, "A XOR-probléma: egy egyenes kevés – egy új jellemzővel elég",
      "Válassz adatot és módszert. „Egyenes kézzel”: a csúszkákkal forgasd és told az egyenest, és próbáld hibátlanul szétválasztani a pontokat. " +
      "„Logisztikus regresszió”: a gép keresi meg a legjobb egyenest. „+ új jellemző”: a modell egy harmadik jellemzőt is kap ($x_1x_2$, illetve a céltáblánál $x_1^2 + x_2^2$) – " +
      "a határ abban a térben sík, itt görbe.");
    const DS = { xor4: "XOR (4 pont, ±1)", xorN: "Zajos XOR (80 pont)", ring: "Céltábla (80 pont)" };
    const MO = { hand: "Egyenes kézzel", lr: "Logisztikus regresszió (x₁, x₂)", feat: "+ új jellemző" };
    let ds = "xor4", mo = "hand", ang = 30, off = 0.3, model = null;
    const data = () => ds === "xor4" ? xorData(false) : ds === "xorN" ? xorData(true, 3) : ringData(5);
    const featName = () => ds === "ring" ? "x₁² + x₂²" : "x₁·x₂";
    const extraF = (x, y) => ds === "ring" ? x * x + y * y : x * y;
    function fit() {
      const D = data();
      if (mo === "lr") model = trainLR(D, (x, y) => [x, y]);
      else if (mo === "feat") model = trainLR(D, (x, y) => [x, y, extraF(x, y)]);
      else model = null;
    }
    const gD = toggleGroup(Object.entries(DS), () => ds, v => { ds = v; fit(); sync(); });
    const gM = toggleGroup(Object.entries(MO), () => mo, v => { mo = v; fit(); sync(); });
    const sA = slider(0, 180, 1, ang), sO = slider(-2, 2, 0.02, off);
    sA.addEventListener("input", () => { ang = +sA.value; sync(); });
    sO.addEventListener("input", () => { off = +sO.value; sync(); });
    const hand = h("div", { class: "controls" }, h("label", null, "irány (fok): ", sA), h("label", null, "eltolás: ", sO));
    root.append(h("div", { class: "controls" }, gD.bs), h("div", { class: "controls" }, gM.bs), hand);
    const cv = Calc.canvas(root, 0.62);
    const out = h("div", { class: "readout" });
    root.append(out);
    /* kézi egyenes: n·x ≥ off → „B” (1); n = (cos, sin) */
    const handP = (x, y) => { const a = ang * Math.PI / 180; return x * Math.cos(a) + y * Math.sin(a) - off >= 0 ? 0.9 : 0.1; };
    const pf = () => mo === "hand" ? handP : model.p;
    function draw() {
      const V = { xmin: -2.4, xmax: 2.4, ymin: -2.1, ymax: 2.1, xname: "x₁", yname: "x₂" };
      const T = Calc.plot(cv, V, []);
      const { ctx } = cv;
      decisionMap(cv, T, V, pf(), 5);
      if (mo === "hand") {
        const a = ang * Math.PI / 180, n = [Math.cos(a), Math.sin(a)], p0 = [n[0] * off, n[1] * off], d = [-n[1], n[0]];
        polyline(ctx, T, [[p0[0] - 6 * d[0], p0[1] - 6 * d[1]], [p0[0] + 6 * d[0], p0[1] + 6 * d[1]]], css("--accent"), 2.2);
      }
      const big = ds === "xor4";
      data().forEach(p => (p.c ? square(ctx, T.tx(p.x), T.ty(p.y), big ? 8 : 4, css("--setB")) : dot(ctx, T.tx(p.x), T.ty(p.y), big ? 9 : 4.5, css("--setA"))));
    }
    cv.draw = draw;
    function sync() {
      gD.paint(); gM.paint();
      hand.style.display = mo === "hand" ? "" : "none";
      draw();
      const D = data(), f = pf();
      const ok = D.filter(p => (f(p.x, p.y) >= 0.5 ? 1 : 0) === p.c).length;
      let txt = `pontosság: <b>${ok} / ${D.length}</b> (${fmt(100 * ok / D.length, 1)}%)`;
      if (mo === "lr") txt += `<br>w = (${model.w.map(v => fmt(v, 3)).join("; ")}), b = ${fmt(model.b, 3)} – ` +
        (ds === "ring" ? "egy egyenes nem tud kört rajzolni." : "a súlyok szinte nullák: szimmetria miatt a „legjobb” egyenes semmit nem mond (minden p̂ ≈ 0,5).");
      else if (mo === "feat") txt += `<br>jellemzők: x₁, x₂, ${featName()} · w = (${model.w.map(v => fmt(v, 3)).join("; ")}), b = ${fmt(model.b, 3)}` +
        `<br><span class="muted">${ds === "ring" ? "A határ az x₁² + x₂² szerint lineáris – az eredeti síkon kör." : "A döntő súly az x₁·x₂-é: negatív szorzat → „ég” (■). A határ a két tengely mentén fut."}</span>`;
      else txt += `<br><span class="muted">${ds === "xor4" ? "A XOR négy pontjából egy egyenes legfeljebb 3-at tud eltalálni – próbáld ki!" : "Keress olyan egyenest, ami a legtöbb pontot eltalálja. Mennyi a legjobb, amit elérsz?"}</span>`;
      out.innerHTML = txt;
    }
    fit(); sync();
  };

  /* ------------------------------------------------------------------
     Indítás (a calc.js-t is defer-rel töltjük, ezért DOMContentLoaded után)
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
