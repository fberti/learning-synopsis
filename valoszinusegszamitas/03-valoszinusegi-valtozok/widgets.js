/* =========================================================
   3. fejezet – interaktív szemléltetések
   Minden widget egy  <div class="widget" data-widget="név">  elembe épül.
   ========================================================= */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     Segédfüggvények (az 1–2. fejezet mintájára)
     ------------------------------------------------------------------ */
  const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const fmt = (x, d = 4) => (isFinite(x) ? (Math.abs(x) < 1e-12 ? 0 : x).toFixed(d).replace(".", ",").replace(/^-(0,0*)$/, "$1") : "–");
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const frac = (k, n) => { const g = gcd(k, n) || 1; return n / g === 1 ? String(k / g) : `${k / g}/${n / g}`; };
  const fracT = (k, n) => { const s = frac(k, n); const neg = s.startsWith("-"); const t = s.replace(/^-?(\d+)\/(\d+)$/, "\\tfrac{$1}{$2}"); return neg && t !== s ? "-" + t : t; };
  const num = (x, d = 4) => fmt(x, d).replace(",", "{,}"); // tizedesvessző KaTeX-ben
  const tex = (s, display) => (window.katex ? katex.renderToString(s, { throwOnError: false, displayMode: !!display }) : s);
  const rnd = n => Math.floor(Math.random() * n);
  const render = el => window.Synopsis && Synopsis.renderMath(el);

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

  function header(root, title, sub) {
    root.append(h("div", { class: "w-title" }, title));
    if (sub) root.append(h("p", { class: "w-sub", html: sub }));
  }

  /* Canvas HiDPI-kezeléssel; a rajzoló függvényt téma- és méretváltáskor újrahívjuk */
  const redrawers = [];
  function makeCanvas(parent, aspect, maxW = 760) {
    const c = h("canvas");
    parent.append(c);
    const obj = { c, ctx: c.getContext("2d"), w: 0, h: 0, draw: null };
    obj.resize = () => {
      const w = Math.min(maxW, parent.clientWidth || maxW);
      const hh = Math.round(w * aspect);
      const dpr = window.devicePixelRatio || 1;
      c.width = Math.round(w * dpr); c.height = Math.round(hh * dpr);
      c.style.width = w + "px"; c.style.height = hh + "px";
      obj.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      obj.w = w; obj.h = hh; obj.dpr = dpr;
    };
    obj.resize();
    redrawers.push(() => { obj.resize(); obj.draw && obj.draw(); });
    return obj;
  }
  let rT;
  addEventListener("resize", () => { clearTimeout(rT); rT = setTimeout(() => redrawers.forEach(f => f()), 150); });
  new MutationObserver(() => redrawers.forEach(f => f())).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  /* Tengelyes diagram rajzolása */
  function axes(ctx, box, { xmin, xmax, ymin, ymax, xticks = [], yticks = [], xlabel = "", ylabel = "", xlog = false, xfmt = String }) {
    const { x0, y0, x1, y1 } = box;
    const tx = xlog ? v => x0 + (Math.log10(v) - Math.log10(xmin)) / (Math.log10(xmax) - Math.log10(xmin)) * (x1 - x0)
                    : v => x0 + (v - xmin) / (xmax - xmin) * (x1 - x0);
    const ty = v => y1 - (v - ymin) / (ymax - ymin) * (y1 - y0);
    ctx.strokeStyle = css("--border"); ctx.fillStyle = css("--muted"); ctx.lineWidth = 1;
    ctx.font = "11px system-ui, sans-serif";
    ctx.textAlign = "right"; ctx.textBaseline = "middle";
    yticks.forEach(v => {
      ctx.beginPath(); ctx.moveTo(x0, ty(v)); ctx.lineTo(x1, ty(v)); ctx.stroke();
      ctx.fillText(String(v).replace(".", ","), x0 - 5, ty(v));
    });
    ctx.textAlign = "center"; ctx.textBaseline = "top";
    xticks.forEach(v => ctx.fillText(xfmt(v).replace(".", ","), tx(v), y1 + 5));
    ctx.strokeStyle = css("--muted");
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.lineTo(x1, y1); ctx.stroke();
    if (xlabel) { ctx.textAlign = "right"; ctx.fillText(xlabel, x1, y1 + 20); }
    if (ylabel) { ctx.textAlign = "left"; ctx.textBaseline = "bottom"; ctx.fillText(ylabel, x0 + 4, y0 - 4); }
    return { tx, ty };
  }
  function dashed(ctx, x0, y0, x1, y1, color) {
    ctx.save(); ctx.setLineDash([6, 5]); ctx.strokeStyle = color; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.restore();
  }
  const niceTicks = (max, n = 4) => {
    const raw = max / n, p = Math.pow(10, Math.floor(Math.log10(raw)));
    const step = [1, 2, 2.5, 5, 10].map(m => m * p).find(s => max / s <= n);
    const t = []; for (let v = 0; v <= max + 1e-12; v += step) t.push(+v.toPrecision(10));
    return t;
  };

  /* Diszkrét eloszlás jellemzői: xs, ps (számok) */
  const moments = (xs, ps) => {
    const E = xs.reduce((a, x, i) => a + x * ps[i], 0);
    const E2 = xs.reduce((a, x, i) => a + x * x * ps[i], 0);
    const V = Math.max(0, E2 - E * E);
    return { E, E2, V, D: Math.sqrt(V) };
  };

  /* Két kocka függvényei (valószínűségi változók a 36 elemű Ω-n) */
  const FUNCS = [
    ["összeg (a + b)", (a, b) => a + b],
    ["nagyobbik szám (max)", (a, b) => Math.max(a, b)],
    ["kisebbik szám (min)", (a, b) => Math.min(a, b)],
    ["a piros kocka (a)", a => a],
    ["a kék kocka (b)", (a, b) => b],
    ["különbség (a − b)", (a, b) => a - b],
    ["eltérés |a − b|", (a, b) => Math.abs(a - b)],
    ["szorzat (a · b)", (a, b) => a * b],
    ["hatosok száma", (a, b) => (a === 6) + (b === 6)],
    ["nyeremény: dupla → +10, különben −2", (a, b) => (a === b ? 10 : -2)]
  ];
  const fIdx = name => FUNCS.findIndex(f => f[0].startsWith(name));
  const distOf = f => {
    const cnt = new Map();
    for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) { const v = f(a, b); cnt.set(v, (cnt.get(v) || 0) + 1); }
    const xs = [...cnt.keys()].sort((x, y) => x - y);
    return { xs, cs: xs.map(x => cnt.get(x)) };
  };
  const valueColor = (t) => `hsl(${230 - 200 * t}, 70%, ${document.documentElement.getAttribute("data-theme") === "dark" ? 45 : 62}%)`;

  /* Oszlop-/vonaldiagram diszkrét eloszláshoz */
  function drawPMF(cv, xs, ps, { hi = null, mean = null, sd = null, labels = true, color = "--accent" } = {}) {
    const { ctx, w, h: H } = cv;
    ctx.clearRect(0, 0, w, H);
    const ymax = Math.max(0.05, ...ps) * 1.18;
    const n = xs.length, box = { x0: 44, y0: 16, x1: w - 10, y1: H - 26 };
    const { ty } = axes(ctx, box, { xmin: 0, xmax: 1, ymin: 0, ymax, yticks: niceTicks(ymax) });
    const slot = (box.x1 - box.x0) / n, X = i => box.x0 + (i + 0.5) * slot;
    xs.forEach((x, i) => {
      ctx.fillStyle = css(hi && hi.has(i) ? "--setB" : color); ctx.globalAlpha = 0.85;
      ctx.fillRect(X(i) - slot * 0.32, ty(ps[i]), slot * 0.64, box.y1 - ty(ps[i])); ctx.globalAlpha = 1;
      ctx.fillStyle = css("--text"); ctx.font = "12px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.fillText(String(x).replace("-", "−"), X(i), box.y1 + 5);
      if (labels && slot > 26) { ctx.fillStyle = css("--muted"); ctx.font = "10px system-ui"; ctx.textBaseline = "bottom"; ctx.fillText(fmt(ps[i], 3), X(i), ty(ps[i]) - 2); }
    });
    if (mean != null) {
      // a várható érték helye a (nem egyenközű) értékskálán: lineáris interpoláció a szomszédos értékek között
      const pos = v => { if (v <= xs[0]) return X(0); for (let i = 1; i < n; i++) if (v <= xs[i]) return X(i - 1) + (v - xs[i - 1]) / (xs[i] - xs[i - 1]) * slot; return X(n - 1); };
      if (sd != null) { ctx.fillStyle = css("--setC"); ctx.globalAlpha = 0.13; ctx.fillRect(pos(mean - sd), box.y0, pos(mean + sd) - pos(mean - sd), box.y1 - box.y0); ctx.globalAlpha = 1; }
      dashed(ctx, pos(mean), box.y0, pos(mean), box.y1, css("--bad"));
      ctx.fillStyle = css("--bad"); ctx.font = "bold 11px system-ui"; ctx.textAlign = "left"; ctx.textBaseline = "top";
      ctx.fillText(`E(X) = ${fmt(mean, 3)}`, Math.min(pos(mean) + 4, box.x1 - 80), box.y0);
    }
  }

  const W = {}; // widget-regiszter

  /* ------------------------------------------------------------------
     3.1–3.2  A valószínűségi változó mint függvény az Ω-n
     ------------------------------------------------------------------ */
  W["rv-builder"] = root => {
    header(root, "Valószínűségi változó = függvény az eseménytéren",
      "A 36 cella a két kocka $(a, b)$ kimeneteleit jelenti (sor: piros, oszlop: kék). Válassz egy $X$ függvényt: minden cellába beírjuk az $X(a, b)$ értéket, és összegyűjtjük, melyik érték milyen valószínűséggel jön ki. Kattints a táblázat egy oszlopára!");
    const sel = h("select"); FUNCS.forEach(([l], i) => sel.append(h("option", { value: i }, l)));
    root.append(h("div", { class: "controls" }, h("label", null, "X = ", sel)));
    const wrap = h("div", { class: "rv-wrap" });
    const grid = h("div", { class: "grid36" });
    grid.append(h("div", { class: "hd" }, ""));
    for (let j = 1; j <= 6; j++) grid.append(h("div", { class: "hd", style: "color:var(--setA)" }, j));
    const cells = [];
    for (let i = 1; i <= 6; i++) {
      grid.append(h("div", { class: "hd", style: "color:var(--bad)" }, i));
      for (let j = 1; j <= 6; j++) { const c = h("div", { class: "cell" }); cells.push([i, j, c]); grid.append(c); }
    }
    const right = h("div", { style: "flex:1;min-width:260px" });
    wrap.append(grid, right);
    root.append(wrap);
    const cv = makeCanvas(right, 0.55, 460);
    const tbl = h("div", { class: "dist-table" });
    const out = h("div", { class: "readout" });
    root.append(tbl, out);
    let pick = null, D;
    function upd() {
      const f = FUNCS[sel.value][1];
      D = distOf(f);
      const lo = D.xs[0], hi = D.xs[D.xs.length - 1];
      cells.forEach(([a, b, c]) => {
        const v = f(a, b);
        c.textContent = String(v).replace("-", "−");
        c.style.background = valueColor(hi > lo ? (v - lo) / (hi - lo) : 0.5);
        c.style.color = "#fff";
        c.classList.toggle("pick", pick !== null && v === D.xs[pick]);
        c.classList.toggle("dim", pick !== null && v !== D.xs[pick]);
      });
      const ps = D.cs.map(c => c / 36), m = moments(D.xs, ps);
      cv.draw = () => drawPMF(cv, D.xs, ps, { hi: pick !== null ? new Set([pick]) : null, mean: m.E });
      cv.draw();
      tbl.innerHTML = `<table><tr><th>$x_i$</th>${D.xs.map((x, i) => `<td data-i="${i}" class="${pick === i ? "on" : ""}">${String(x).replace("-", "−")}</td>`).join("")}</tr>` +
        `<tr><th>$p_i$</th>${D.cs.map((c, i) => `<td data-i="${i}" class="${pick === i ? "on" : ""}">${fracT(c, 36).startsWith("\\") ? `$${fracT(c, 36)}$` : fracT(c, 36)}</td>`).join("")}</tr></table>`;
      tbl.querySelectorAll("td[data-i]").forEach(td => (td.onclick = () => { const i = +td.dataset.i; pick = pick === i ? null : i; upd(); }));
      const sumE = D.xs.map((x, i) => `${x < 0 ? `(${x})` : x}\\cdot\\tfrac{${D.cs[i]}}{36}`);
      out.innerHTML = (pick !== null ? `$P(X = ${D.xs[pick]}) = \\tfrac{${D.cs[pick]}}{36}$ – ennyi cella tartozik ehhez az értékhez.<br>` : "") +
        `$E(X) = ${sumE.length <= 7 ? sumE.join(" + ") + " = " : ""}${fracT(D.xs.reduce((a, x, i) => a + x * D.cs[i], 0), 36)} \\approx ${num(m.E, 3)}$ &nbsp;·&nbsp; $D(X) \\approx ${num(m.D, 3)}$`;
      render(tbl); render(out);
    }
    sel.onchange = () => { pick = null; upd(); };
    upd();
  };

  /* ------------------------------------------------------------------
     3.3  Várható érték – kockajátékok és a hosszú távú átlag
     ------------------------------------------------------------------ */
  const GAMES = [
    ["Obádovics 1.: páros → 18×, páratlan → −24×", [-24, 36, -72, 72, -120, 108]],
    ["Obádovics 2.: prím → +pont, különben −pont", [-1, 2, 3, -4, 5, -6]],
    ["Hatosra fogadás: 6 → +500, különben −100", [-100, -100, -100, -100, -100, 500]],
    ["Vásári kocka: 5 vagy 6 → +200, különben −120", [-120, -120, -120, -120, 200, 200]]
  ];
  W["game-ev"] = root => {
    header(root, "Kockajáték-tervező", "Add meg, hány forintot nyersz (+) vagy veszítesz (−) az egyes dobásoknál! A program kiszámolja a várható értéket, és lejátssza a játékot – figyeld, hová tart a <b>forduló­nkénti átlagnyeremény</b>.");
    const ins = [1, 2, 3, 4, 5, 6].map(k => h("input", { type: "number", value: 0, step: 1, style: "width:5.2em" }));
    root.append(h("div", { class: "controls" }, "Feladat: ", ...GAMES.map(([l, v]) => btn(l.split(":")[0], () => { v.forEach((x, i) => (ins[i].value = x)); reset(); }))));
    root.append(h("div", { class: "payout-row" }, ...ins.map((inp, k) => h("label", null, h("span", { class: "face" }, ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"][k]), inp))));
    const evOut = h("div", { class: "readout" });
    root.append(evOut, h("div", { class: "controls" }, ...[10, 100, 1000, 10000].map(k => btn(`🎲 +${k} kör`, () => play(k), k === 1000 ? "btn primary" : "btn")), btn("Nulláz", reset)));
    const cv = makeCanvas(root, 0.42);
    const stats = h("div", { class: "stat-row" });
    root.append(stats);
    let n = 0, sum = 0, hist = [];
    const pay = () => ins.map(i => +i.value || 0);
    function reset() { n = 0; sum = 0; hist = []; upd(); }
    function play(k) {
      const p = pay();
      for (let t = 0; t < k && n < 100000; t++) { sum += p[rnd(6)]; n++; if (n <= 200 || n % Math.ceil(n / 200) === 0) hist.push([n, sum / n]); }
      upd();
    }
    cv.draw = () => {
      const { ctx, w, h: H } = cv;
      ctx.clearRect(0, 0, w, H);
      const p = pay(), E = p.reduce((a, b) => a + b, 0) / 6;
      const span = Math.max(1, ...p.map(Math.abs));
      const xmax = Math.max(10, Math.pow(10, Math.ceil(Math.log10(Math.max(n, 10)))));
      const box = { x0: 52, y0: 14, x1: w - 12, y1: H - 32 };
      const xt = []; for (let v = 1; v <= xmax; v *= 10) xt.push(v);
      const { tx, ty } = axes(ctx, box, { xmin: 1, xmax, ymin: -span, ymax: span, xlog: true, xticks: xt, yticks: [-span, -span / 2, 0, span / 2, span].map(v => Math.round(v)), xlabel: "játszott körök száma", ylabel: "átlagnyeremény (Ft/kör)" });
      dashed(ctx, box.x0, ty(E), box.x1, ty(E), css("--bad"));
      if (hist.length) {
        ctx.strokeStyle = css("--accent"); ctx.lineWidth = 1.8; ctx.beginPath();
        hist.forEach(([k, v], i) => (i ? ctx.lineTo(tx(k), ty(v)) : ctx.moveTo(tx(k), ty(v))));
        ctx.stroke();
      }
    };
    function upd() {
      const p = pay(), S = p.reduce((a, b) => a + b, 0), E = S / 6;
      const verdict = S === 0 ? "a játék <b>korrekt</b> (igazságos)" : S > 0 ? "a játék a <b>játékosnak kedvez</b>" : "a játék a <b>banknak kedvez</b>";
      evOut.innerHTML = tex(`E(X) = \\tfrac16\\left(${p.map(x => (x < 0 ? `(${x})` : x)).join(" + ")}\\right) = ${fracT(S, 6)} \\approx ${num(E, 2)}\\ \\text{Ft}`) + ` → ${verdict}.`;
      cv.draw();
      stats.innerHTML = [["lejátszott kör", n], ["összes nyeremény", `${Math.round(sum)} Ft`], ["átlag / kör", n ? `${fmt(sum / n, 2)} Ft` : "–"], ["várható érték", `${fmt(E, 2)} Ft`]]
        .map(([l, v]) => `<div class="stat"><div class="v">${v}</div><div class="l">${l}</div></div>`).join("");
    }
    ins.forEach(i => (i.oninput = reset));
    GAMES[0][1].forEach((x, i) => (ins[i].value = x));
    reset();
  };

  /* ------------------------------------------------------------------
     3.3  Szentpétervári paradoxon
     ------------------------------------------------------------------ */
  W["st-petersburg"] = root => {
    header(root, "Szentpétervári játék", "Addig dobunk egy érmét, amíg fej nem jön. Ha a $k$-adik dobás az első fej, a nyeremény $2^k$ dukát. Mennyit érdemes fizetni egy játékért? Nézd meg, mit csinál az átlagnyeremény!");
    const rm = h("input", { type: "range", min: 5, max: 40, step: 1, value: 40 }), lm = h("b");
    root.append(h("div", { class: "controls" }, h("label", null, "a bank vagyona: 2^m dukát, m =", rm, lm)),
      h("div", { class: "controls" }, ...[100, 1000, 10000, 100000].map(k => btn(`+${k.toLocaleString("hu-HU")} játék`, () => play(k), k === 10000 ? "btn primary" : "btn")), btn("Nulláz", reset)));
    const cv = makeCanvas(root, 0.4);
    const out = h("div", { class: "readout" });
    root.append(out);
    let n = 0, sum = 0, best = 0, hist = [];
    function reset() { n = 0; sum = 0; best = 0; hist = []; upd(); }
    function play(k) {
      const L = Math.pow(2, +rm.value);
      for (let t = 0; t < k && n < 2e6; t++) {
        let j = 1; while (Math.random() < 0.5 && j < 60) j++;
        const win = Math.min(Math.pow(2, j), L);
        sum += win; n++; best = Math.max(best, win);
        if (n <= 200 || n % Math.ceil(n / 300) === 0) hist.push([n, sum / n]);
      }
      upd();
    }
    cv.draw = () => {
      const { ctx, w, h: H } = cv;
      ctx.clearRect(0, 0, w, H);
      const xmax = Math.max(100, Math.pow(10, Math.ceil(Math.log10(Math.max(n, 10)))));
      const ymax = Math.max(10, ...hist.map(p => p[1])) * 1.15;
      const box = { x0: 44, y0: 14, x1: w - 12, y1: H - 32 };
      const xt = []; for (let v = 1; v <= xmax; v *= 10) xt.push(v);
      const { tx, ty } = axes(ctx, box, { xmin: 1, xmax, ymin: 0, ymax, xlog: true, xticks: xt, yticks: niceTicks(ymax, 5).map(v => Math.round(v)), xlabel: "játékok száma", ylabel: "átlagnyeremény" });
      if (hist.length) {
        ctx.strokeStyle = css("--accent"); ctx.lineWidth = 1.8; ctx.beginPath();
        hist.forEach(([k, v], i) => (i ? ctx.lineTo(tx(k), ty(v)) : ctx.moveTo(tx(k), ty(v))));
        ctx.stroke();
      }
      const m = +rm.value;
      if (m + 1 < ymax) dashed(ctx, box.x0, ty(m + 1), box.x1, ty(m + 1), css("--bad"));
    };
    function upd() {
      const m = +rm.value; lm.textContent = m;
      out.innerHTML = `Lejátszott játékok: <b>${n.toLocaleString("hu-HU")}</b> · átlagnyeremény: <b>${n ? fmt(sum / n, 2) : "–"}</b> dukát · legnagyobb egyszeri nyeremény: <b>${best.toLocaleString("hu-HU")}</b><br>` +
        tex(`E = \\tfrac12\\cdot2 + \\tfrac14\\cdot4 + \\tfrac18\\cdot8 + \\dots = 1 + 1 + 1 + \\dots = \\infty`) +
        ` – korlátlan bank mellett. Ha a bank legfeljebb $2^{${m}}$ dukátot tud fizetni, a várható érték csak $${m} + 1 = ${m + 1}$ (szaggatott vonal).`;
      render(out);
      cv.draw();
    }
    rm.oninput = reset;
    reset();
  };

  /* ------------------------------------------------------------------
     3.3–3.4  Mérleg: a várható érték mint súlypont, a szórás mint „terülés”
     ------------------------------------------------------------------ */
  const BAL_PRESETS = [
    ["Egyenletes", [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]],
    ["Középen csúcsos", [0, 0, 1, 3, 6, 9, 6, 3, 1, 0, 0]],
    ["Jobbra ferde", [2, 9, 10, 8, 6, 4, 3, 2, 1, 1, 1]],
    ["Két púp", [1, 6, 9, 5, 1, 0, 1, 5, 9, 6, 1]],
    ["Szélsőségek", [10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10]]
  ];
  W["balance"] = root => {
    header(root, "A várható érték mint súlypont", "Az $x = 0, 1, \\dots, 10$ értékekhez tartozó valószínűségeket <b>egérrel húzva</b> állíthatod (kattints vagy húzz az oszlopok fölött). A gerenda ott van egyensúlyban, ahol a várható érték van; a zöld sáv az $E(X) \\pm D(X)$ tartomány.");
    let wts = BAL_PRESETS[1][1].slice();
    root.append(h("div", { class: "controls" }, "Minták: ", ...BAL_PRESETS.map(([l, v]) => btn(l, () => { wts = v.slice(); upd(); }))));
    const cv = makeCanvas(root, 0.5);
    cv.c.style.cursor = "crosshair"; cv.c.style.touchAction = "none";
    const out = h("div", { class: "readout" });
    root.append(out);
    const xs = Array.from({ length: 11 }, (_, i) => i);
    let geo = null;
    cv.draw = () => {
      const { ctx, w, h: H } = cv;
      ctx.clearRect(0, 0, w, H);
      const S = wts.reduce((a, b) => a + b, 0) || 1, ps = wts.map(x => x / S), m = moments(xs, ps);
      const x0 = 30, x1 = w - 30, beamY = H - 60, top = 16, maxW = 10;
      const X = v => x0 + (v + 0.5) / 11 * (x1 - x0), bw = (x1 - x0) / 11 * 0.6;
      const hh = v => v / maxW * (beamY - top - 6);
      geo = { X, bw, beamY, top, maxW, x0, x1 };
      // ± szórás sáv
      ctx.fillStyle = css("--setC"); ctx.globalAlpha = 0.14;
      ctx.fillRect(X(m.E - m.D), top, X(m.E + m.D) - X(m.E - m.D), beamY - top); ctx.globalAlpha = 1;
      wts.forEach((v, i) => {
        ctx.fillStyle = css("--accent"); ctx.globalAlpha = 0.85;
        ctx.fillRect(X(i) - bw / 2, beamY - hh(v), bw, hh(v)); ctx.globalAlpha = 1;
        ctx.fillStyle = css("--muted"); ctx.font = "10px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "bottom";
        if (v > 0) ctx.fillText(fmt(ps[i], 2), X(i), beamY - hh(v) - 2);
      });
      ctx.fillStyle = css("--text"); ctx.fillRect(x0, beamY, x1 - x0, 5);
      ctx.font = "12px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "top";
      xs.forEach(i => ctx.fillText(i, X(i), beamY + 8));
      // alátámasztás
      const fx = X(m.E);
      ctx.fillStyle = css("--bad"); ctx.beginPath(); ctx.moveTo(fx, beamY + 5); ctx.lineTo(fx - 14, beamY + 34); ctx.lineTo(fx + 14, beamY + 34); ctx.closePath(); ctx.fill();
      ctx.font = "bold 12px system-ui"; ctx.textBaseline = "top"; ctx.fillText(`E(X) = ${fmt(m.E, 2)}`, Math.min(Math.max(fx, x0 + 40), x1 - 40), beamY + 38);
    };
    function setAt(e) {
      if (!geo) return;
      const r = cv.c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      const i = Math.round((x - geo.x0) / (geo.x1 - geo.x0) * 11 - 0.5);
      if (i < 0 || i > 10) return;
      wts[i] = Math.max(0, Math.min(geo.maxW, (geo.beamY - y) / (geo.beamY - geo.top - 6) * geo.maxW));
      upd();
    }
    let drag = false;
    cv.c.addEventListener("pointerdown", e => { drag = true; cv.c.setPointerCapture(e.pointerId); setAt(e); });
    cv.c.addEventListener("pointermove", e => drag && setAt(e));
    cv.c.addEventListener("pointerup", () => (drag = false));
    function upd() {
      const S = wts.reduce((a, b) => a + b, 0);
      cv.draw();
      if (!S) { out.innerHTML = "Minden valószínűség 0 – rajzolj legalább egy oszlopot!"; return; }
      const ps = wts.map(x => x / S), m = moments(xs, ps);
      out.innerHTML = tex(`E(X) = \\sum x_i p_i = ${num(m.E, 3)}`) + " &nbsp;·&nbsp; " + tex(`E(X^2) = ${num(m.E2, 3)}`) + " &nbsp;·&nbsp; " +
        tex(`D^2(X) = E(X^2) - E(X)^2 = ${num(m.V, 3)}`) + " &nbsp;·&nbsp; " + tex(`D(X) = ${num(m.D, 3)}`);
    }
    upd();
  };

  /* ------------------------------------------------------------------
     3.5  Eloszlásfüggvény – lépcsős függvény
     ------------------------------------------------------------------ */
  const CDF_PRESETS = [
    ["Kockadobás", [1, 2, 3, 4, 5, 6], [1, 1, 1, 1, 1, 1]],
    ["3 érme: fejek száma", [0, 1, 2, 3], [1, 3, 3, 1]],
    ["V.3.8", [-2, 1, 2, 4], [2, 1, 4, 1]],
    ["V.3.12", [-2, 0, 4], [3, 5, 2]],
    ["Két kocka összege", [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1]]
  ];
  W["cdf-step"] = root => {
    header(root, "Az eloszlásfüggvény – lépcsőről lépcsőre", "Fent az eloszlás, lent az $F(x) = P(X \\lt x)$ eloszlásfüggvény. Mozgasd az $x$ csúszkát: $F(x)$ az $x$-től <b>balra</b> eső (kiemelt) oszlopok összege.");
    let P = CDF_PRESETS[0];
    const rx = h("input", { type: "range", step: 0.01, style: "width:16em" }), lx = h("b");
    root.append(h("div", { class: "controls" }, "Eloszlás: ", ...CDF_PRESETS.map(p => btn(p[0], () => { P = p; setRange(); upd(); }))),
      h("div", { class: "controls" }, h("label", null, "x =", rx, lx)));
    const cv1 = makeCanvas(root, 0.28), cv2 = makeCanvas(root, 0.36);
    const out = h("div", { class: "readout" });
    root.append(out);
    const lim = () => { const xs = P[1]; const pad = Math.max(1, (xs[xs.length - 1] - xs[0]) * 0.15); return [xs[0] - pad, xs[xs.length - 1] + pad]; };
    function setRange() { const [a, b] = lim(); rx.min = a; rx.max = b; rx.value = (P[1][0] + P[1][1]) / 2 + 0.3; }
    const xTicks = (a, b) => { const t = []; for (let v = Math.ceil(a); v <= Math.floor(b); v++) t.push(v); return t.length > 16 ? t.filter(v => v % 2 === 0) : t; };
    cv1.draw = () => {
      const { ctx, w, h: H } = cv1; ctx.clearRect(0, 0, w, H);
      const [a, b] = lim(), S = P[2].reduce((s, v) => s + v, 0), x = +rx.value;
      const box = { x0: 44, y0: 12, x1: w - 12, y1: H - 22 };
      const ymax = Math.max(...P[2]) / S * 1.2;
      const { tx, ty } = axes(ctx, box, { xmin: a, xmax: b, ymin: 0, ymax, xticks: xTicks(a, b), yticks: niceTicks(ymax, 3), ylabel: "p" });
      P[1].forEach((xi, i) => {
        const p = P[2][i] / S;
        ctx.strokeStyle = css(xi < x ? "--setB" : "--accent"); ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(tx(xi), box.y1); ctx.lineTo(tx(xi), ty(p)); ctx.stroke();
        ctx.fillStyle = ctx.strokeStyle; ctx.beginPath(); ctx.arc(tx(xi), ty(p), 4, 0, 7); ctx.fill();
      });
      dashed(ctx, tx(x), box.y0, tx(x), box.y1, css("--bad"));
    };
    cv2.draw = () => {
      const { ctx, w, h: H } = cv2; ctx.clearRect(0, 0, w, H);
      const [a, b] = lim(), S = P[2].reduce((s, v) => s + v, 0), x = +rx.value;
      const box = { x0: 44, y0: 12, x1: w - 12, y1: H - 24 };
      const { tx, ty } = axes(ctx, box, { xmin: a, xmax: b, ymin: 0, ymax: 1.05, xticks: xTicks(a, b), yticks: [0, 0.25, 0.5, 0.75, 1], ylabel: "F(x)" });
      let cum = 0, prev = a;
      ctx.strokeStyle = css("--accent"); ctx.lineWidth = 2.5;
      const pts = [];
      P[1].forEach((xi, i) => {
        ctx.beginPath(); ctx.moveTo(tx(prev), ty(cum)); ctx.lineTo(tx(xi), ty(cum)); ctx.stroke();
        pts.push([xi, cum, cum + P[2][i] / S]);
        cum += P[2][i] / S; prev = xi;
      });
      ctx.beginPath(); ctx.moveTo(tx(prev), ty(cum)); ctx.lineTo(tx(b), ty(cum)); ctx.stroke();
      // ugráspontok: F(x_i) = P(X < x_i) az alsó szint (tömör pont), a felső szint nyitott
      pts.forEach(([xi, lo, hi]) => {
        ctx.fillStyle = css("--accent"); ctx.beginPath(); ctx.arc(tx(xi), ty(lo), 4, 0, 7); ctx.fill();
        ctx.fillStyle = css("--card"); ctx.strokeStyle = css("--accent"); ctx.lineWidth = 1.8; ctx.beginPath(); ctx.arc(tx(xi), ty(hi), 4, 0, 7); ctx.fill(); ctx.stroke();
      });
      const Fx = P[1].reduce((s, xi, i) => s + (xi < x ? P[2][i] : 0), 0) / S;
      dashed(ctx, tx(x), box.y0, tx(x), box.y1, css("--bad"));
      ctx.fillStyle = css("--bad"); ctx.beginPath(); ctx.arc(tx(x), ty(Fx), 5, 0, 7); ctx.fill();
    };
    function upd() {
      const x = +rx.value, S = P[2].reduce((s, v) => s + v, 0);
      lx.textContent = fmt(x, 2);
      const left = P[1].map((xi, i) => [xi, P[2][i]]).filter(([xi]) => xi < x);
      const k = left.reduce((s, [, c]) => s + c, 0);
      out.innerHTML = `$F(${num(x, 2)}) = P(X \\lt ${num(x, 2)}) = ` + (left.length ? left.map(([xi]) => `p(${xi})`).join(" + ") + " = " : "") + `${fracT(k, S)}$` +
        `<br><small>A tömör pont jelzi az ugráshelyen felvett értéket: $F(x_i) = P(X \\lt x_i)$ még <em>nem</em> tartalmazza $p(x_i)$-t (Obádovics jelölése). Az angol nyelvű irodalom $P(X \\le x)$-szel definiálja – ott a felső szint a tömör.</small>`;
      render(out);
      cv1.draw(); cv2.draw();
    }
    rx.oninput = upd;
    setRange(); upd();
  };

  /* ------------------------------------------------------------------
     3.6  Sűrűségfüggvény és terület
     ------------------------------------------------------------------ */
  const DENS = [
    { name: "Izzó élettartama: egyenletes [0; 1000] óra", a: 0, b: 1000, f: x => (x >= 0 && x <= 1000 ? 0.001 : 0), F: x => Math.min(1, Math.max(0, x / 1000)), A: 30, B: 100, E: 500, V: 1e6 / 12, med: 500, unit: " óra" },
    { name: "f(x) = x/2 a [0; 2] intervallumon (V.3.9)", a: 0, b: 2, f: x => (x >= 0 && x <= 2 ? x / 2 : 0), F: x => (x <= 0 ? 0 : x >= 2 ? 1 : x * x / 4), A: 1, B: 2, E: 4 / 3, V: 2 / 9, med: Math.SQRT2 },
    { name: "f(x) = 3x²/8 a [0; 2] intervallumon", a: 0, b: 2, f: x => (x >= 0 && x <= 2 ? 3 * x * x / 8 : 0), F: x => (x <= 0 ? 0 : x >= 2 ? 1 : x ** 3 / 8), A: 1, B: 2, E: 1.5, V: 0.15, med: Math.cbrt(4) },
    { name: "f(x) = ½·cos x a [−π/2; π/2] intervallumon", a: -Math.PI / 2, b: Math.PI / 2, f: x => (Math.abs(x) <= Math.PI / 2 ? Math.cos(x) / 2 : 0), F: x => (x <= -Math.PI / 2 ? 0 : x >= Math.PI / 2 ? 1 : (Math.sin(x) + 1) / 2), A: -0.5, B: 0.5, E: 0, V: Math.PI ** 2 / 4 - 2, med: 0 },
    { name: "Várakozási idő: f(x) = e^(−x), x ≥ 0 (exponenciális)", a: 0, b: 6, f: x => (x >= 0 ? Math.exp(-x) : 0), F: x => (x <= 0 ? 0 : 1 - Math.exp(-x)), A: 1, B: 2, E: 1, V: 1, med: Math.LN2 }
  ];
  W["density-area"] = root => {
    header(root, "Sűrűségfüggvény: a valószínűség = terület", "Állítsd be az $[a; b]$ intervallumot! Fent a sűrűségfüggvény alatti terület, lent ugyanez az eloszlásfüggvény két értékének különbségeként: $P(a \\lt X \\lt b) = F(b) - F(a)$.");
    const sel = h("select"); DENS.forEach((d, i) => sel.append(h("option", { value: i }, d.name)));
    const ra = h("input", { type: "range", step: "any" }), rb = h("input", { type: "range", step: "any" });
    const la = h("b"), lb = h("b");
    root.append(h("div", { class: "controls" }, sel), h("div", { class: "controls" }, h("label", null, "a =", ra, la), h("label", null, "b =", rb, lb)));
    const cv1 = makeCanvas(root, 0.36), cv2 = makeCanvas(root, 0.3);
    const out = h("div", { class: "readout" });
    root.append(out);
    const D = () => DENS[+sel.value];
    const span = d => { const pad = (d.b - d.a) * 0.12; return [d.a - pad, d.b + pad]; };
    function setup() { const d = D(), [lo, hi] = span(d); [ra, rb].forEach(r => { r.min = lo; r.max = hi; }); ra.value = d.A; rb.value = d.B; upd(); }
    const ticks = (lo, hi) => { const st = (hi - lo) > 100 ? 250 : (hi - lo) > 5 ? 1 : 0.5; const t = []; for (let v = Math.ceil(lo / st) * st; v <= hi; v += st) t.push(+v.toFixed(3)); return t; };
    cv1.draw = () => {
      const { ctx, w, h: H } = cv1; ctx.clearRect(0, 0, w, H);
      const d = D(), [lo, hi] = span(d), a = Math.min(+ra.value, +rb.value), b = Math.max(+ra.value, +rb.value);
      let fmax = 0; for (let i = 0; i <= 400; i++) fmax = Math.max(fmax, d.f(lo + (hi - lo) * i / 400));
      const box = { x0: 50, y0: 12, x1: w - 12, y1: H - 24 };
      const { tx, ty } = axes(ctx, box, { xmin: lo, xmax: hi, ymin: 0, ymax: fmax * 1.15, xticks: ticks(lo, hi), yticks: niceTicks(fmax * 1.15, 3), ylabel: "f(x)" });
      ctx.fillStyle = css("--setB"); ctx.globalAlpha = 0.45; ctx.beginPath(); ctx.moveTo(tx(a), ty(0));
      for (let i = 0; i <= 200; i++) { const x = a + (b - a) * i / 200; ctx.lineTo(tx(x), ty(d.f(x))); }
      ctx.lineTo(tx(b), ty(0)); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
      ctx.strokeStyle = css("--accent"); ctx.lineWidth = 2.2; ctx.beginPath();
      for (let i = 0; i <= 400; i++) { const x = lo + (hi - lo) * i / 400; i ? ctx.lineTo(tx(x), ty(d.f(x))) : ctx.moveTo(tx(x), ty(d.f(x))); }
      ctx.stroke();
      dashed(ctx, tx(d.E), box.y0, tx(d.E), box.y1, css("--bad"));
      ctx.fillStyle = css("--bad"); ctx.font = "bold 11px system-ui"; ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText("E(X)", tx(d.E) + 3, box.y0);
    };
    cv2.draw = () => {
      const { ctx, w, h: H } = cv2; ctx.clearRect(0, 0, w, H);
      const d = D(), [lo, hi] = span(d), a = Math.min(+ra.value, +rb.value), b = Math.max(+ra.value, +rb.value);
      const box = { x0: 50, y0: 12, x1: w - 12, y1: H - 24 };
      const { tx, ty } = axes(ctx, box, { xmin: lo, xmax: hi, ymin: 0, ymax: 1.05, xticks: ticks(lo, hi), yticks: [0, 0.5, 1], ylabel: "F(x)" });
      ctx.strokeStyle = css("--accent"); ctx.lineWidth = 2.2; ctx.beginPath();
      for (let i = 0; i <= 400; i++) { const x = lo + (hi - lo) * i / 400; i ? ctx.lineTo(tx(x), ty(d.F(x))) : ctx.moveTo(tx(x), ty(d.F(x))); }
      ctx.stroke();
      [[a, d.F(a)], [b, d.F(b)]].forEach(([x, y]) => { dashed(ctx, tx(x), ty(y), tx(x), box.y1, css("--muted")); dashed(ctx, box.x0, ty(y), tx(x), ty(y), css("--muted")); });
      ctx.strokeStyle = css("--setB"); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(box.x0 + 6, ty(d.F(a))); ctx.lineTo(box.x0 + 6, ty(d.F(b))); ctx.stroke();
    };
    function upd() {
      const d = D(), a = Math.min(+ra.value, +rb.value), b = Math.max(+ra.value, +rb.value);
      const dd = (d.b - d.a) > 100 ? 0 : 2;
      const de = (d.b - d.a) > 100 ? 1 : 4;
      la.textContent = fmt(+ra.value, dd); lb.textContent = fmt(+rb.value, dd);
      const pr = d.F(b) - d.F(a);
      out.innerHTML = tex(`P(${num(a, dd)} \\lt X \\lt ${num(b, dd)}) = \\int_{${num(a, dd)}}^{${num(b, dd)}} f(x)\\,dx = F(${num(b, dd)}) - F(${num(a, dd)}) = ${num(d.F(b), 4)} - ${num(d.F(a), 4)} = ${num(pr, 4)}`) +
        `<br>` + tex(`E(X) = ${num(d.E, de)}`) + " · " + tex(`D(X) = ${num(Math.sqrt(d.V), de)}`) + " · " + tex(`\\text{medián} = ${num(d.med, de)}`) +
        ` &nbsp;<small>(egyetlen pont valószínűsége: $P(X = x) = 0$, ezért mindegy, hogy $\\lt$ vagy $\\le$ áll a határokon)</small>`;
      render(out);
      cv1.draw(); cv2.draw();
    }
    ra.oninput = rb.oninput = upd;
    sel.onchange = setup;
    setup();
  };

  /* ------------------------------------------------------------------
     3.6  A hisztogramtól a sűrűségfüggvényig
     ------------------------------------------------------------------ */
  const SAMPLERS = [
    { name: "f(x) = 3x²/8 a [0; 2]-n", lo: 0, hi: 2, gen: () => 2 * Math.cbrt(Math.random()), f: x => (x >= 0 && x <= 2 ? 3 * x * x / 8 : 0) },
    { name: "két egyenletes szám összege (háromszög)", lo: 0, hi: 2, gen: () => Math.random() + Math.random(), f: x => (x < 0 || x > 2 ? 0 : x <= 1 ? x : 2 - x) },
    { name: "exponenciális várakozási idő", lo: 0, hi: 6, gen: () => -Math.log(1 - Math.random()), f: x => (x >= 0 ? Math.exp(-x) : 0) },
    { name: "12 egyenletes szám összege − 6 (≈ normális)", lo: -4, hi: 4, gen: () => { let s = 0; for (let i = 0; i < 12; i++) s += Math.random(); return s - 6; }, f: x => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI) }
  ];
  W["hist-to-density"] = root => {
    header(root, "A hisztogramtól a sűrűségfüggvényig", "Véletlen számokat generálunk egy folytonos eloszlásból. A hisztogram oszlopainak <b>területe</b> a relatív gyakoriság (magasság = relatív gyakoriság / oszlopszélesség). Sok adatnál és keskeny oszlopoknál a hisztogram „rásimul” a sűrűségfüggvényre.");
    const sel = h("select"); SAMPLERS.forEach((s, i) => sel.append(h("option", { value: i }, s.name)));
    const rk = h("input", { type: "range", min: 4, max: 80, value: 12 }), lk = h("b");
    const showF = h("input", { type: "checkbox", checked: "" });
    root.append(h("div", { class: "controls" }, sel, h("label", null, "oszlopok száma:", rk, lk), h("label", null, showF, "sűrűségfüggvény")),
      h("div", { class: "controls" }, ...[10, 100, 1000, 10000, 100000].map(k => btn(`+${k.toLocaleString("hu-HU")}`, () => add(k), k === 1000 ? "btn primary" : "btn")), btn("Nulláz", reset)));
    const cv = makeCanvas(root, 0.45);
    const out = h("div", { class: "readout" });
    root.append(out);
    let data = [];
    function reset() { data = []; upd(); }
    function add(k) { const s = SAMPLERS[+sel.value]; for (let i = 0; i < k && data.length < 300000; i++) data.push(s.gen()); upd(); }
    cv.draw = () => {
      const { ctx, w, h: H } = cv; ctx.clearRect(0, 0, w, H);
      const s = SAMPLERS[+sel.value], K = +rk.value, wd = (s.hi - s.lo) / K;
      const cnt = new Array(K).fill(0); data.forEach(x => { const i = Math.floor((x - s.lo) / wd); if (i >= 0 && i < K) cnt[i]++; });
      const dens = cnt.map(c => (data.length ? c / data.length / wd : 0));
      let fmax = 0; for (let i = 0; i <= 200; i++) fmax = Math.max(fmax, s.f(s.lo + (s.hi - s.lo) * i / 200));
      const ymax = Math.max(fmax, ...dens) * 1.12;
      const box = { x0: 44, y0: 12, x1: w - 12, y1: H - 26 };
      const xt = []; const st = (s.hi - s.lo) > 4 ? 1 : 0.5; for (let v = s.lo; v <= s.hi + 1e-9; v += st) xt.push(+v.toFixed(2));
      const { tx, ty } = axes(ctx, box, { xmin: s.lo, xmax: s.hi, ymin: 0, ymax, xticks: xt, yticks: niceTicks(ymax, 4) });
      dens.forEach((v, i) => {
        ctx.fillStyle = css("--setA"); ctx.globalAlpha = 0.55;
        ctx.fillRect(tx(s.lo + i * wd), ty(v), tx(s.lo + (i + 1) * wd) - tx(s.lo + i * wd) - 1, box.y1 - ty(v)); ctx.globalAlpha = 1;
      });
      if (showF.checked) {
        ctx.strokeStyle = css("--bad"); ctx.lineWidth = 2.2; ctx.beginPath();
        for (let i = 0; i <= 300; i++) { const x = s.lo + (s.hi - s.lo) * i / 300; i ? ctx.lineTo(tx(x), ty(s.f(x))) : ctx.moveTo(tx(x), ty(s.f(x))); }
        ctx.stroke();
      }
    };
    function upd() {
      lk.textContent = rk.value;
      cv.draw();
      const s = SAMPLERS[+sel.value], wd = (s.hi - s.lo) / +rk.value;
      out.innerHTML = `Adatok száma: <b>${data.length.toLocaleString("hu-HU")}</b> · oszlopszélesség: <b>${fmt(wd, 3)}</b>` +
        (data.length ? ` · mintaátlag: <b>${fmt(data.reduce((a, b) => a + b, 0) / data.length, 3)}</b>` : "") +
        `<br><small>Kevés adatnál a keskeny oszlopok „zajosak”, széles oszlopoknál viszont elvész a görbe alakja – a sűrűségfüggvény a „végtelen sok adat, végtelenül keskeny oszlop” határeset.</small>`;
    }
    sel.onchange = reset; rk.oninput = upd; showF.onchange = () => cv.draw();
    reset(); add(1000);
  };

  /* ------------------------------------------------------------------
     3.7  Az eloszlás alakja: várható érték, medián, módusz, ferdeség
     ------------------------------------------------------------------ */
  W["shape-explorer"] = root => {
    header(root, "Az eloszlás alakja", "Egy kétparaméteres sűrűségfüggvény-család ($f(x) \\propto x^{\\alpha-1}(1-x)^{\\beta-1}$ a $[0; 1]$-en, ún. béta-eloszlás). Figyeld, hogyan válik szét a <span style='color:var(--bad)'>várható érték</span>, a <span style='color:var(--setC)'>medián</span> és a <span style='color:var(--setB)'>módusz</span>, ha az eloszlás ferde!");
    const ra = h("input", { type: "range", min: 1, max: 12, step: 0.5, value: 2 }), rb = h("input", { type: "range", min: 1, max: 12, step: 0.5, value: 6 });
    const rp = h("input", { type: "range", min: 0.01, max: 0.99, step: 0.01, value: 0.25 });
    const la = h("b"), lb = h("b"), lp = h("b");
    root.append(h("div", { class: "controls" }, "Minták: ",
      ...[["Szimmetrikus", 5, 5], ["Jobbra ferde", 2, 6], ["Balra ferde", 6, 2], ["Egyenletes", 1, 1], ["Csúcsos", 12, 12]].map(([l, a, b]) => btn(l, () => { ra.value = a; rb.value = b; upd(); }))),
      h("div", { class: "controls" }, h("label", null, "α =", ra, la), h("label", null, "β =", rb, lb), h("label", null, "kvantilis p =", rp, lp)));
    const cv = makeCanvas(root, 0.42);
    const out = h("div", { class: "readout" });
    root.append(out);
    const N = 2000;
    let G = null;
    function compute() {
      const a = +ra.value, b = +rb.value;
      const xs = [], fs = [];
      for (let i = 0; i <= N; i++) { const x = i / N; xs.push(x); fs.push((x === 0 && a < 1) || (x === 1 && b < 1) ? 0 : Math.pow(x, a - 1) * Math.pow(1 - x, b - 1)); }
      let Z = 0; const cdf = [0];
      for (let i = 1; i <= N; i++) { Z += (fs[i] + fs[i - 1]) / 2 / N; cdf.push(Z); }
      const f = fs.map(v => v / Z), F = cdf.map(v => v / Z);
      const q = p => { let i = F.findIndex(v => v >= p); if (i <= 0) return 0; return xs[i - 1] + (p - F[i - 1]) / (F[i] - F[i - 1]) / N; };
      const E = a / (a + b), V = a * b / ((a + b) ** 2 * (a + b + 1));
      const mode = a > 1 && b > 1 ? (a - 1) / (a + b - 2) : a === 1 && b === 1 ? null : a > b ? 1 : a < b ? 0 : null;
      const g1 = 2 * (b - a) * Math.sqrt(a + b + 1) / ((a + b + 2) * Math.sqrt(a * b));
      const g2 = 6 * ((a - b) ** 2 * (a + b + 1) - a * b * (a + b + 2)) / (a * b * (a + b + 2) * (a + b + 3));
      G = { xs, f, F, E, V, med: q(0.5), mode, g1, g2, q, a, b };
    }
    cv.draw = () => {
      if (!G) return;
      const { ctx, w, h: H } = cv; ctx.clearRect(0, 0, w, H);
      const fmax = Math.max(...G.f) * 1.12, p = +rp.value, xp = G.q(p);
      const box = { x0: 44, y0: 12, x1: w - 12, y1: H - 26 };
      const { tx, ty } = axes(ctx, box, { xmin: 0, xmax: 1, ymin: 0, ymax: fmax, xticks: [0, 0.25, 0.5, 0.75, 1], yticks: niceTicks(fmax, 4) });
      ctx.fillStyle = css("--setA"); ctx.globalAlpha = 0.25; ctx.beginPath(); ctx.moveTo(tx(0), ty(0));
      G.xs.forEach((x, i) => x <= xp && ctx.lineTo(tx(x), ty(G.f[i])));
      ctx.lineTo(tx(xp), ty(0)); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
      ctx.strokeStyle = css("--accent"); ctx.lineWidth = 2.2; ctx.beginPath();
      G.xs.forEach((x, i) => (i ? ctx.lineTo(tx(x), ty(G.f[i])) : ctx.moveTo(tx(x), ty(G.f[i]))));
      ctx.stroke();
      const mark = (x, col, lab, row) => { if (x == null) return; ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(tx(x), box.y0); ctx.lineTo(tx(x), box.y1); ctx.stroke();
        ctx.fillStyle = col; ctx.font = "bold 11px system-ui"; ctx.textAlign = x > 0.8 ? "right" : "left"; ctx.textBaseline = "top"; ctx.fillText(lab, tx(x) + (x > 0.8 ? -4 : 4), box.y0 + row * 14); };
      mark(G.mode, css("--setB"), "módusz", 0); mark(G.med, css("--setC"), "medián", 1); mark(G.E, css("--bad"), "E(X)", 2);
    };
    function upd() {
      la.textContent = ra.value; lb.textContent = rb.value; lp.textContent = fmt(+rp.value, 2);
      compute(); cv.draw();
      const p = +rp.value;
      const shape = Math.abs(G.g1) < 0.02 ? "szimmetrikus" : G.g1 > 0 ? "jobbra elnyúló (pozitív ferdeség): módusz &lt; medián &lt; várható érték" : "balra elnyúló (negatív ferdeség): várható érték &lt; medián &lt; módusz";
      out.innerHTML = tex(`E(X) = ${num(G.E, 3)}`) + " · " + tex(`\\text{medián} = ${num(G.med, 3)}`) + " · " + tex(`\\text{módusz} = ${G.mode == null ? "\\text{nincs egyértelmű}" : num(G.mode, 3)}`) + " · " + tex(`D(X) = ${num(Math.sqrt(G.V), 3)}`) +
        "<br>" + tex(`\\gamma_1 = ${num(G.g1, 3)}`) + " (ferdeség) · " + tex(`\\gamma_2 = ${num(G.g2, 3)}`) + " (lapultság) → " + shape +
        "<br>" + tex(`x_{${num(p, 2)}} = ${num(G.q(p), 3)}`) + ` – a kék terület ${fmt(p * 100, 0)}%: a görbe alatti terület ${fmt(p * 100, 0)}%-a esik ettől balra.`;
    }
    [ra, rb, rp].forEach(r => (r.oninput = upd));
    upd();
  };

  /* ------------------------------------------------------------------
     3.8  Együttes eloszlás, kovariancia, korreláció
     ------------------------------------------------------------------ */
  W["joint-table"] = root => {
    header(root, "Két valószínűségi változó együtt", "Ugyanazon a két kockás $\\Omega$-n két változót definiálunk. A táblázat cellái az együttes valószínűségek ($w_{ij}$, 36-odokban), a szélén a peremeloszlások. A cella színe: <span style='color:var(--ok)'>zöld</span>, ha $w_{ij} = p_i\\,q_j$ (a független esetnek megfelelő érték), <span style='color:var(--bad)'>piros</span>, ha nem.");
    const mk = def => { const s = h("select"); FUNCS.slice(0, 9).forEach(([l], i) => s.append(h("option", { value: i }, l))); s.value = def; return s; };
    const sX = mk(fIdx("nagyobbik")), sY = mk(fIdx("összeg"));
    root.append(h("div", { class: "controls" }, h("label", null, "X = ", sX), h("label", null, "Y = ", sY)),
      h("div", { class: "controls" }, "Példák: ",
        ...[["max és összeg", "nagyobbik", "összeg"], ["piros és kék", "a piros", "a kék"], ["összeg és különbség", "összeg", "különbség"], ["piros és összeg", "a piros", "összeg"], ["min és max", "kisebbik", "nagyobbik"]]
          .map(([l, a, b]) => btn(l, () => { sX.value = fIdx(a); sY.value = fIdx(b); upd(); }))));
    const tbl = h("div", { class: "joint-wrap" });
    const out = h("div", { class: "readout" });
    root.append(tbl, out);
    function upd() {
      const fx = FUNCS[+sX.value][1], fy = FUNCS[+sY.value][1];
      const J = new Map(), cx = new Map(), cy = new Map();
      for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) {
        const x = fx(a, b), y = fy(a, b), k = x + "|" + y;
        J.set(k, (J.get(k) || 0) + 1); cx.set(x, (cx.get(x) || 0) + 1); cy.set(y, (cy.get(y) || 0) + 1);
      }
      const xs = [...cx.keys()].sort((p, q) => p - q), ys = [...cy.keys()].sort((p, q) => p - q);
      let indep = true;
      const rows = xs.map(x => `<tr><th>${String(x).replace("-", "−")}</th>` + ys.map(y => {
        const c = J.get(x + "|" + y) || 0, ok = c * 36 === cx.get(x) * cy.get(y);
        if (!ok) indep = false;
        return `<td class="${ok ? "ok" : "no"}" title="független esetben: ${fmt(cx.get(x) * cy.get(y) / 36, 2)}/36">${c || "·"}</td>`;
      }).join("") + `<td class="mg">${cx.get(x)}</td></tr>`).join("");
      tbl.innerHTML = `<table class="joint"><tr><th>X \\ Y</th>${ys.map(y => `<th>${String(y).replace("-", "−")}</th>`).join("")}<th class="mg">Σ</th></tr>${rows}` +
        `<tr><th class="mg">Σ</th>${ys.map(y => `<td class="mg">${cy.get(y)}</td>`).join("")}<td class="mg">36</td></tr></table>`;
      let EX = 0, EY = 0, EXY = 0, EX2 = 0, EY2 = 0;
      for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) { const x = fx(a, b), y = fy(a, b); EX += x; EY += y; EXY += x * y; EX2 += x * x; EY2 += y * y; }
      // pontos törtek 36-odokban, illetve 1296-odokban
      const cov36 = EXY * 36 - EX * EY; // Cov = cov36 / 1296
      const vx = EX2 * 36 - EX * EX, vy = EY2 * 36 - EY * EY;
      const R = vx && vy ? cov36 / Math.sqrt(vx * vy) : NaN;
      const verdict = indep ? "<b>X és Y függetlenek</b> (minden cella zöld)." :
        Math.abs(cov36) === 0 ? "<b>X és Y korrelálatlanok, de nem függetlenek!</b> A kovariancia 0, mégis van piros cella." :
        `X és Y <b>nem függetlenek</b>; a korreláció ${R > 0 ? "pozitív" : "negatív"}${Math.abs(R) > 0.7 ? " és erős" : Math.abs(R) < 0.3 ? " és gyenge" : ""}.`;
      out.innerHTML = tex(`E(X) = ${fracT(EX, 36)},\\ E(Y) = ${fracT(EY, 36)},\\ E(XY) = ${fracT(EXY, 36)}`) + "<br>" +
        tex(`\\operatorname{Cov}(X,Y) = E(XY) - E(X)E(Y) = ${fracT(cov36, 1296)} \\approx ${num(cov36 / 1296, 3)}`) + " &nbsp;·&nbsp; " +
        tex(`R(X,Y) = \\frac{\\operatorname{Cov}(X,Y)}{D(X)D(Y)} \\approx ${isFinite(R) ? num(R, 3) : "\\text{–}"}`) + "<br>" + verdict;
    }
    sX.onchange = sY.onchange = upd;
    upd();
  };

  /* ------------------------------------------------------------------
     Indítás
     ------------------------------------------------------------------ */
  document.querySelectorAll(".widget[data-widget]").forEach(root => {
    const f = W[root.dataset.widget];
    if (!f) return;
    try { f(root); window.Synopsis && Synopsis.renderMath(root); }
    catch (e) { root.append(h("p", { class: "muted" }, "Hiba a szemléltetés betöltésekor: " + e.message)); console.error(e); }
  });
})();
