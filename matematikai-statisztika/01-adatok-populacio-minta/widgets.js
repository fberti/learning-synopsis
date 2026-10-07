/* =========================================================
   Matematikai statisztika 1. fejezet – interaktív szemléltetések
   Minden widget egy  <div class="widget" data-widget="név">  elembe épül.
   ========================================================= */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     Segédfüggvények (a valószínűségszámítás-fejezetek mintájára)
     ------------------------------------------------------------------ */
  const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const fmt = (x, d = 1) => (isFinite(x) ? (Math.abs(x) < 1e-12 ? 0 : x).toFixed(d).replace(".", ",").replace(/^-(0,0*)$/, "$1") : "–");
  const groupDigits = s => String(s).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

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
      obj.w = w; obj.h = hh;
    };
    obj.resize();
    redrawers.push(() => { obj.resize(); obj.draw && obj.draw(); });
    return obj;
  }
  let rT;
  addEventListener("resize", () => { clearTimeout(rT); rT = setTimeout(() => redrawers.forEach(f => f()), 150); });
  new MutationObserver(() => redrawers.forEach(f => f())).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  const rangeTicks = (lo, hi, n = 8) => {
    const raw = (hi - lo) / n, p = Math.pow(10, Math.floor(Math.log10(raw)));
    const step = [1, 2, 2.5, 5, 10].map(m => m * p).find(s => (hi - lo) / s <= n);
    const t = []; for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-12; v += step) t.push(+v.toPrecision(10));
    return t;
  };
  function axes(ctx, box, { xmin, xmax, ymin, ymax, xticks = [], yticks = [], xlabel = "", ylabel = "", xfmt = String }) {
    const { x0, y0, x1, y1 } = box;
    const tx = v => x0 + (v - xmin) / (xmax - xmin) * (x1 - x0);
    const ty = v => y1 - (v - ymin) / (ymax - ymin) * (y1 - y0);
    ctx.strokeStyle = css("--border"); ctx.fillStyle = css("--muted"); ctx.lineWidth = 1;
    ctx.font = "11px system-ui, sans-serif";
    ctx.textAlign = "right"; ctx.textBaseline = "middle";
    yticks.forEach(v => { ctx.beginPath(); ctx.moveTo(x0, ty(v)); ctx.lineTo(x1, ty(v)); ctx.stroke(); ctx.fillText(String(v).replace(".", ","), x0 - 5, ty(v)); });
    ctx.textAlign = "center"; ctx.textBaseline = "top";
    xticks.forEach(v => ctx.fillText(xfmt(v), tx(v), y1 + 5));
    ctx.strokeStyle = css("--muted");
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.lineTo(x1, y1); ctx.stroke();
    if (xlabel) { ctx.textAlign = "right"; ctx.fillText(xlabel, x1, y1 + 20); }
    if (ylabel) { ctx.textAlign = "left"; ctx.textBaseline = "bottom"; ctx.fillText(ylabel, x0 + 4, y0 - 2); }
    return { tx, ty };
  }
  function vline(ctx, x, y0, y1, color, dash) {
    ctx.save(); if (dash) ctx.setLineDash([6, 5]); ctx.strokeStyle = color; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke(); ctx.restore();
  }

  /* Véletlenszám-generátorok: rögzített maggal (mulberry32) és normális (Box–Muller) */
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const normal = rnd => { let u = 0; while (!u) u = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rnd()); };
  const poisson = (lam, rnd) => { const L = Math.exp(-lam); let k = 0, p = 1; do { k++; p *= rnd(); } while (p > L); return k - 1; };
  function sampleIdx(N, n, rnd) { // n különböző index 0..N-1 közül (részleges Fisher–Yates)
    const a = [...Array(N).keys()];
    for (let i = 0; i < n; i++) { const j = i + Math.floor(rnd() * (N - i)); [a[i], a[j]] = [a[j], a[i]]; }
    return a.slice(0, n);
  }
  const mean = a => a.reduce((s, x) => s + x, 0) / a.length;
  const sd = a => { const m = mean(a); return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1)); };

  const W = {}; // widget-regiszter

  /* ------------------------------------------------------------------
     1.4  Mintavételi eljárások egy 200 háztartásos „városon”
     ------------------------------------------------------------------ */
  W["sampling-methods"] = root => {
    header(root, "Mintavételi eljárások egy kitalált városban",
      "A város 4 kerületből áll (nyugatról keletre egyre magasabb jövedelemmel), minden kerület 5 utcából, minden utca 10 házból. " +
      "Minden utca <b>első háza sarokház</b>, ahol nagyobb a jövedelem. A pöttyök színe a háztartás havi jövedelme (sötétebb = több). " +
      "Válassz eljárást és mintanagyságot, vegyél egy mintát, majd ismételd meg 1000-szer!");

    /* --- a sokaság (rögzített maggal) --- */
    const COLS = 20, ROWS = 10, N = COLS * ROWS;
    const BASE = [250, 320, 420, 560];
    const pop = [];
    (() => {
      const r = mulberry32(20261007);
      for (let c = 0; c < COLS; c++) {
        const street = normal(r) * 30;
        for (let row = 0; row < ROWS; row++) {
          const d = Math.floor(c / 5);
          let v = BASE[d] + street + normal(r) * 60 + (row === 0 ? 150 : 0);
          pop.push({ c, row, d, v: Math.max(80, Math.round(v)) }); // index = c*ROWS + row → utcánkénti lista
        }
      }
    })();
    const MU = mean(pop.map(p => p.v));
    const vmin = Math.min(...pop.map(p => p.v)), vmax = Math.max(...pop.map(p => p.v));

    const METHODS = {
      srs: "egyszerű véletlen",
      strat: "rétegzett (kerületenként arányosan)",
      cluster: "csoportos (egész utcák)",
      sys: "szisztematikus (utcánkénti listából minden k-adik)",
      conv: "kényelmi (a kérdező lakásához legközelebbiek)"
    };
    const sel = h("select"); Object.entries(METHODS).forEach(([k, v]) => sel.append(h("option", { value: k }, v)));
    const nSel = h("select"); [20, 40].forEach(n => nSel.append(h("option", { value: n }, "n = " + n)));
    root.append(h("div", { class: "controls" }, h("label", null, "Eljárás:", sel), h("label", null, "Mintanagyság:", nSel)));

    const conv = (() => { // a kérdező az 1. kerület közepén lakik (2. utca, 5. ház)
      const d2 = p => (p.c - 2) ** 2 + (p.row - 5) ** 2;
      return [...pop.keys()].sort((a, b) => d2(pop[a]) - d2(pop[b]));
    })();

    function draw1(method, n, rnd) {
      if (method === "srs") return sampleIdx(N, n, rnd);
      if (method === "strat") {
        const per = n / 4, out = [];
        for (let d = 0; d < 4; d++) sampleIdx(50, per, rnd).forEach(i => out.push(d * 50 + i)); // kerület d = indexek d*50 … d*50+49
        return out;
      }
      if (method === "cluster") {
        const streets = sampleIdx(COLS, n / ROWS, rnd), out = [];
        streets.forEach(s => { for (let row = 0; row < ROWS; row++) out.push(s * ROWS + row); });
        return out;
      }
      if (method === "sys") {
        const k = N / n, start = Math.floor(rnd() * k), out = [];
        for (let j = 0; j < n; j++) out.push(start + j * k);
        return out;
      }
      return conv.slice(0, n);
    }

    const cvPop = makeCanvas(root, 0.42);
    const stats = h("div", { class: "stat-row" });
    const btnRow = h("div", { class: "controls" });
    const cvHist = makeCanvas(root, 0.32);
    const out = h("div", { class: "readout" });
    root.insertBefore(stats, cvHist.c); root.insertBefore(btnRow, cvHist.c);
    root.append(out);

    let current = [], means = [];
    const rnd = Math.random;
    const stat = (l, v) => h("div", { class: "stat" }, h("div", { class: "v" }, v), h("div", { class: "l" }, l));

    function update() {
      stats.replaceChildren(
        stat("sokasági átlag (μ, ezer Ft)", fmt(MU, 1)),
        stat("az utolsó minta átlaga (x̄)", current.length ? fmt(mean(current.map(i => pop[i].v)), 1) : "–"),
        stat("eddigi minták száma", groupDigits(means.length))
      );
      if (means.length > 1) {
        const m = mean(means), s = sd(means);
        out.innerHTML = `${means.length} minta átlagainak átlaga: <b>${fmt(m, 1)}</b> (μ = ${fmt(MU, 1)}) · ` +
          `torzítás: <b>${fmt(m - MU, 1)}</b> · ingadozás (szórás): <b>${fmt(s, 1)}</b> ezer Ft`;
      } else out.innerHTML = "Kattints az „1000 minta” gombra, hogy lásd, hogyan ingadozik a becslés.";
      cvPop.draw(); cvHist.draw();
    }
    cvPop.draw = () => {
      const { ctx, w, h: H } = cvPop; ctx.clearRect(0, 0, w, H);
      const padT = 18, cw = w / COLS, ch = (H - padT) / ROWS, rad = Math.max(3, Math.min(cw, ch) * 0.32);
      const inS = new Set(current);
      ctx.font = "11px system-ui, sans-serif"; ctx.fillStyle = css("--muted"); ctx.textAlign = "center"; ctx.textBaseline = "top";
      for (let d = 0; d < 4; d++) ctx.fillText(`${d + 1}. kerület`, (d * 5 + 2.5) * cw, 2);
      ctx.strokeStyle = css("--border"); ctx.lineWidth = 1;
      for (let d = 1; d < 4; d++) { ctx.beginPath(); ctx.moveTo(d * 5 * cw, padT); ctx.lineTo(d * 5 * cw, H); ctx.stroke(); }
      const acc = css("--accent");
      pop.forEach((p, i) => {
        const x = (p.c + 0.5) * cw, y = padT + (p.row + 0.5) * ch, t = (p.v - vmin) / (vmax - vmin);
        ctx.fillStyle = acc; ctx.globalAlpha = 0.12 + 0.88 * t;
        ctx.beginPath(); ctx.arc(x, y, rad, 0, 2 * Math.PI); ctx.fill(); ctx.globalAlpha = 1;
        if (inS.has(i)) { ctx.strokeStyle = css("--bad"); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(x, y, rad + 3, 0, 2 * Math.PI); ctx.stroke(); }
      });
      if (sel.value === "conv") { // a kérdező lakása
        ctx.fillStyle = acc; ctx.font = "16px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("🏠", 2.5 * cw + cw / 2, padT + 5 * ch);
      }
    };
    cvHist.draw = () => {
      const { ctx, w, h: H } = cvHist; ctx.clearRect(0, 0, w, H);
      const lo = 250, hi = 650, bw = 10, nb = (hi - lo) / bw, cnt = new Array(nb).fill(0);
      means.forEach(m => { const b = Math.floor((m - lo) / bw); if (b >= 0 && b < nb) cnt[b]++; });
      const ymax = Math.max(5, ...cnt) * 1.1;
      const box = { x0: 40, y0: 14, x1: w - 10, y1: H - 36 };
      const { tx, ty } = axes(ctx, box, { xmin: lo, xmax: hi, ymin: 0, ymax, xticks: rangeTicks(lo, hi, 8), yticks: [], xlabel: "mintaátlag (ezer Ft)", ylabel: "a mintaátlagok gyakorisága" });
      ctx.fillStyle = css("--accent");
      cnt.forEach((c, b) => { if (c) ctx.fillRect(tx(lo + b * bw) + 1, ty(c), tx(lo + (b + 1) * bw) - tx(lo + b * bw) - 2, ty(0) - ty(c)); });
      vline(ctx, tx(MU), box.y0, box.y1, css("--ok"));
      ctx.fillStyle = css("--ok"); ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.font = "12px system-ui";
      ctx.fillText("μ", tx(MU) + 4, box.y0);
      if (means.length > 1) { vline(ctx, tx(mean(means)), box.y0, box.y1, css("--bad"), true); }
    };
    btnRow.append(
      btn("Egy minta", () => { current = draw1(sel.value, +nSel.value, rnd); means.push(mean(current.map(i => pop[i].v))); update(); }, "btn primary"),
      btn("1000 minta", () => { for (let k = 0; k < 1000; k++) { current = draw1(sel.value, +nSel.value, rnd); means.push(mean(current.map(i => pop[i].v))); } update(); }),
      btn("Törlés", () => { current = []; means = []; update(); })
    );
    const reset = () => { current = []; means = []; update(); };
    sel.addEventListener("change", reset); nSel.addEventListener("change", reset);
    root.append(h("p", { class: "w-sub", html: "A hisztogramon a zöld vonal a valódi átlag (μ), a piros szaggatott a mintaátlagok átlaga. " +
      "Figyeld meg: a rétegzett minta a legkevésbé ingadozik; a csoportos jobban, mint az egyszerű véletlen (az utcák belül hasonlók); " +
      "a szisztematikusnál a kezdőpont dönt (10-es lépésközzel minden tizedik indulás csupa sarokházat ad); a kényelmi minta pedig mindig ugyanazt a – torz – értéket adja." }));
    update();
  };

  /* ------------------------------------------------------------------
     1.5  Válaszmegtagadás: a nagy minta összehúzza a felhőt – de hová?
     ------------------------------------------------------------------ */
  W["nonresponse"] = root => {
    header(root, "Válaszmegtagadás és mintanagyság",
      "A választók $p$ része az R jelöltre szavaz. Az R-szavazók $r_1$, az L-szavazók $r_2$ arányban válaszolnak. " +
      "Minden pont egy-egy (szimulált) felmérés eredménye: a válaszadók közül hány százalék R-es.");
    const sp = slider(0.3, 0.7, 0.01, 0.6), sr1 = slider(0.05, 1, 0.01, 0.2), sr2 = slider(0.05, 1, 0.01, 0.4), sn = slider(2, 7, 0.01, 3);
    const lp = h("b"), lr1 = h("b"), lr2 = h("b"), ln = h("b");
    root.append(
      h("div", { class: "controls" }, h("label", null, "valódi R-arány p:", sp, lp), h("label", null, "kiküldött kérdőívek:", sn, ln)),
      h("div", { class: "controls" }, h("label", null, "R-szavazók válaszadása r₁:", sr1, lr1), h("label", null, "L-szavazók válaszadása r₂:", sr2, lr2)),
      h("div", { class: "controls" },
        btn("1936-os helyzet", () => { sp.value = 0.61; sr1.value = 0.17; sr2.value = 0.35; sn.value = 7; upd(); }),
        btn("Egyforma válaszadás", () => { sr2.value = sr1.value; upd(); }),
        btn("Új felmérések", () => { seed++; upd(); }))
    );
    const cv = makeCanvas(root, 0.32);
    const out = h("div", { class: "readout" });
    root.append(out);
    let seed = 1;
    const K = 60;
    function upd() {
      const p = +sp.value, r1 = +sr1.value, r2 = +sr2.value, n = Math.round(Math.pow(10, +sn.value));
      lp.textContent = Math.round(p * 100) + "%"; lr1.textContent = Math.round(r1 * 100) + "%"; lr2.textContent = Math.round(r2 * 100) + "%";
      ln.textContent = groupDigits(n);
      const q = p * r1 / (p * r1 + (1 - p) * r2), m = Math.max(1, Math.round(n * (p * r1 + (1 - p) * r2)));
      const se = Math.sqrt(q * (1 - q) / m);
      const rnd = mulberry32(seed * 7919);
      const ests = Array.from({ length: K }, () => Math.min(1, Math.max(0, q + se * normal(rnd))));
      cv.draw = () => {
        const { ctx, w, h: H } = cv; ctx.clearRect(0, 0, w, H);
        const box = { x0: 20, y0: 20, x1: w - 20, y1: H - 36 };
        const { tx } = axes(ctx, box, { xmin: 0.2, xmax: 0.8, ymin: 0, ymax: 1, xticks: [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8], xfmt: v => Math.round(v * 100) + "%", xlabel: "R aránya a válaszadók között" });
        const r = mulberry32(seed * 104729);
        ctx.fillStyle = css("--accent"); ctx.globalAlpha = 0.75;
        ests.forEach(e => { ctx.beginPath(); ctx.arc(tx(e), box.y0 + 10 + r() * (box.y1 - box.y0 - 20), 4, 0, 2 * Math.PI); ctx.fill(); });
        ctx.globalAlpha = 1;
        vline(ctx, tx(p), box.y0 - 6, box.y1, css("--ok"));
        vline(ctx, tx(q), box.y0 - 6, box.y1, css("--bad"), true);
        ctx.font = "12px system-ui"; ctx.textBaseline = "bottom";
        ctx.fillStyle = css("--ok"); ctx.textAlign = q < p ? "left" : "right"; ctx.fillText("valódi p", tx(p) + (q < p ? 4 : -4), box.y0 + 4);
        ctx.fillStyle = css("--bad"); ctx.textAlign = q < p ? "right" : "left"; ctx.fillText("ide tartanak a becslések", tx(q) + (q < p ? -4 : 4), box.y0 + 4);
      };
      cv.draw();
      out.innerHTML = `visszaérkező válaszok: <b>${groupDigits(m)}</b> · a becslések középpontja: <b>${fmt(q * 100, 1)}%</b> (valódi: ${fmt(p * 100, 0)}%) · ` +
        `torzítás: <b>${fmt((q - p) * 100, 1)}</b> százalékpont · véletlen hiba (95%): <b>±${fmt(196 * se, se < 0.001 ? 2 : 1)}</b> százalékpont`;
    }
    [sp, sr1, sr2, sn].forEach(s => s.addEventListener("input", upd));
    upd();
  };

  /* ------------------------------------------------------------------
     1.5  Túlélési torzítás – Wald bombázói
     ------------------------------------------------------------------ */
  W["survivorship"] = root => {
    header(root, "Hol a lyuk? – Wald Ábrahám bombázói",
      "400 gép repül be. A találatok <em>egyenletesen</em> érik a gépet, de a hajtómű- és a pilótafülke-találat sokkal gyakrabban végzetes. " +
      "Nézd meg a találatokat csak a visszatért gépeken – ahogy a légierő látta –, majd az összes gépen!");
    /* régiók egységnyi koordinátákban (orr felül); a sorrend a besorolás prioritása */
    const REG = [
      { key: "cockpit", name: "pilótafülke", rects: [[0.455, 0.05, 0.545, 0.17]], surv: 0.55 },
      { key: "engine", name: "hajtóművek", rects: [[0.19, 0.33, 0.25, 0.53], [0.31, 0.33, 0.37, 0.53], [0.63, 0.33, 0.69, 0.53], [0.75, 0.33, 0.81, 0.53]], surv: 0.35 },
      { key: "body", name: "törzs", rects: [[0.455, 0.17, 0.545, 0.92]], surv: 0.97 },
      { key: "tail", name: "farok", rects: [[0.33, 0.82, 0.67, 0.89]], surv: 0.9 },
      { key: "wing", name: "szárnyak", rects: [[0.06, 0.40, 0.94, 0.49]], surv: 0.95 }
    ];
    const inR = (x, y, r) => x >= r[0] && x <= r[2] && y >= r[1] && y <= r[3];
    const regionOf = (x, y) => REG.findIndex(g => g.rects.some(r => inR(x, y, r)));
    /* a régiók tényleges (átfedés nélküli) területe Monte Carlóval */
    const area = REG.map(() => 0);
    (() => { const r = mulberry32(42); for (let i = 0; i < 200000; i++) { const g = regionOf(r(), r()); if (g >= 0) area[g]++; } })();

    let planes = [], seed = 1, mode = "back";
    function simulate() {
      const r = mulberry32(seed * 31337); planes = [];
      for (let k = 0; k < 400; k++) {
        const nh = poisson(3, r), hits = [];
        let alive = true;
        for (let j = 0; j < nh; j++) {
          let x, y, g;
          do { x = r(); y = r(); g = regionOf(x, y); } while (g < 0);
          hits.push({ x, y, g });
          if (r() > REG[g].surv) alive = false;
        }
        planes.push({ hits, alive });
      }
    }
    const bBack = btn("Csak a visszatért gépek", () => { mode = "back"; upd(); });
    const bAll = btn("Az összes gép", () => { mode = "all"; upd(); });
    root.append(h("div", { class: "controls" }, bBack, bAll, btn("Új bevetés-sorozat", () => { seed++; simulate(); upd(); })));
    const cv = makeCanvas(root, 0.62, 560);
    const out = h("div", { class: "readout" });
    root.append(out);
    cv.draw = () => {
      const { ctx, w, h: H } = cv; ctx.clearRect(0, 0, w, H);
      const S = Math.min(w, H / 0.95), ox = (w - S) / 2, oy = 0;
      const X = x => ox + x * S, Y = y => oy + y * S;
      ctx.fillStyle = css("--bg-soft"); ctx.strokeStyle = css("--muted"); ctx.lineWidth = 1;
      [...REG].reverse().forEach(g => g.rects.forEach(r => { ctx.fillRect(X(r[0]), Y(r[1]), (r[2] - r[0]) * S, (r[3] - r[1]) * S); ctx.strokeRect(X(r[0]), Y(r[1]), (r[2] - r[0]) * S, (r[3] - r[1]) * S); }));
      ctx.fillStyle = css("--bad"); ctx.globalAlpha = 0.65;
      planes.forEach(p => { if (mode === "all" || p.alive) p.hits.forEach(t => { ctx.beginPath(); ctx.arc(X(t.x), Y(t.y), 2, 0, 2 * Math.PI); ctx.fill(); }); });
      ctx.globalAlpha = 1;
    };
    function upd() {
      bBack.classList.toggle("on", mode === "back"); bAll.classList.toggle("on", mode === "all");
      cv.draw();
      const shown = planes.filter(p => mode === "all" || p.alive);
      const cnt = REG.map(() => 0); shown.forEach(p => p.hits.forEach(t => cnt[t.g]++));
      const dens = cnt.map((c, i) => c / area[i] * 1000);
      const maxD = Math.max(...dens);
      const back = planes.filter(p => p.alive).length;
      out.innerHTML = `${mode === "all" ? "Az összes" : "A visszatért"} gép${mode === "all" ? " (400 db)" : ` (${back} db a 400-ból)`} – találat egységnyi területen:<br>` +
        REG.map((g, i) => `${g.name}: <b>${fmt(dens[i], 1)}</b> <span style="display:inline-block;height:.6em;width:${Math.round(dens[i] / maxD * 80)}px;background:var(--accent);border-radius:3px"></span>`).join("<br>");
    }
    simulate(); upd();
  };

  /* ------------------------------------------------------------------
     1.6  Zavaró változó – fagylalt, strandbalesetek, hőmérséklet
     ------------------------------------------------------------------ */
  W["confounder"] = root => {
    header(root, "Fagylalt és strandbalesetek – mi a közös ok?",
      "Minden pont egy nyári nap: vízszintesen a fagylalteladás, függőlegesen a strandbalesetek száma. A két mennyiség erősen együtt mozog. " +
      "De vajon a fagylalt okozza a baleseteket? Kapcsold be a színezést, és szűrd a napokat hőmérséklet szerint!");
    const BANDS = [
      { name: "hűvös (19–23 °C)", c: 21, col: "--setA" },
      { name: "meleg (25–29 °C)", c: 27, col: "--setC" },
      { name: "kánikula (31–35 °C)", c: 33, col: "--setB" }
    ];
    let days = [], seed = 1;
    function simulate() {
      const r = mulberry32(seed * 2027); days = [];
      for (let i = 0; i < 90; i++) {
        const b = Math.floor(r() * 3), T = BANDS[b].c + (r() * 4 - 2);
        const ice = Math.max(5, 20 + 6 * (T - 18) + normal(r) * 9);
        const acc = poisson(0.5 + 0.35 * (T - 18), r);
        days.push({ b, T, ice, acc, jit: r() - 0.5 });
      }
    }
    const chk = h("input", { type: "checkbox" });
    const fsel = h("select"); fsel.append(h("option", { value: -1 }, "minden nap")); BANDS.forEach((b, i) => fsel.append(h("option", { value: i }, "csak " + b.name)));
    root.append(h("div", { class: "controls" }, h("label", null, chk, "színezés hőmérséklet szerint"), h("label", null, "Mutasd:", fsel),
      btn("Új nyár", () => { seed++; simulate(); upd(); })));
    const cv = makeCanvas(root, 0.5);
    const out = h("div", { class: "readout" });
    root.append(out);
    const corr = pts => {
      if (pts.length < 3) return NaN;
      const mx = mean(pts.map(p => p.ice)), my = mean(pts.map(p => p.acc));
      let sxy = 0, sxx = 0, syy = 0;
      pts.forEach(p => { sxy += (p.ice - mx) * (p.acc - my); sxx += (p.ice - mx) ** 2; syy += (p.acc - my) ** 2; });
      return sxy / Math.sqrt(sxx * syy);
    };
    cv.draw = () => {
      const { ctx, w, h: H } = cv; ctx.clearRect(0, 0, w, H);
      const f = +fsel.value, pts = days.filter(d => f < 0 || d.b === f);
      const box = { x0: 40, y0: 16, x1: w - 12, y1: H - 36 };
      const { tx, ty } = axes(ctx, box, { xmin: 0, xmax: 160, ymin: -0.5, ymax: 14, xticks: rangeTicks(0, 160, 8), yticks: [0, 2, 4, 6, 8, 10, 12, 14], xlabel: "fagylalteladás (száz adag / nap)", ylabel: "strandbalesetek / nap" });
      pts.forEach(d => {
        ctx.fillStyle = chk.checked ? css(BANDS[d.b].col) : css("--accent");
        ctx.globalAlpha = 0.8;
        ctx.beginPath(); ctx.arc(tx(d.ice), ty(d.acc + d.jit * 0.5), 4.5, 0, 2 * Math.PI); ctx.fill();
      });
      ctx.globalAlpha = 1;
      if (chk.checked) {
        ctx.font = "12px system-ui"; ctx.textAlign = "left"; ctx.textBaseline = "top";
        BANDS.forEach((b, i) => { ctx.fillStyle = css(b.col); ctx.fillText("● " + b.name, box.x0 + 8, box.y0 + 2 + i * 16); });
      }
    };
    function upd() {
      cv.draw();
      const f = +fsel.value, pts = days.filter(d => f < 0 || d.b === f);
      const rAll = corr(days);
      const rows = BANDS.map((b, i) => { const p = days.filter(d => d.b === i); return `${b.name}: ${p.length} nap, r = <b>${fmt(corr(p), 2)}</b>`; });
      out.innerHTML = `Együttmozgás (korrelációs együttható, $-1 \\le r \\le 1$; részletesen a 3. fejezetben) – ` +
        `${f < 0 ? "minden nap" : BANDS[f].name}: <b>r = ${fmt(corr(pts), 2)}</b><br>` +
        (chk.checked || f >= 0 ? `Hőmérsékleti sávonként: ${rows.join(" · ")}<br>Az összes napon: r = ${fmt(rAll, 2)}. ` +
          "Egy sávon belül (azonos hőmérsékletnél) a kapcsolat szinte eltűnik: a meleg okozza mindkettőt." : "");
      window.Synopsis && Synopsis.renderMath(out);
    }
    chk.addEventListener("change", upd); fsel.addEventListener("change", upd);
    simulate(); upd();
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
