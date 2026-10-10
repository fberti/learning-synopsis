/* =========================================================
   Mesterséges intelligencia 4. fejezet – interaktív szemléltetések
   Minden widget egy  <div class="widget" data-widget="név">  elembe épül.
   A rajzoláshoz az assets/calc.js közös modulját (Calc.canvas, Calc.plot) használjuk.
   ========================================================= */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     Segédfüggvények (a 3. fejezet widgets.js-ének mintájára)
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
  /* két vászon egymás mellett (keskeny kijelzőn egymás alatt) */
  function twoCanvas(root, aspect) {
    const wrap = h("div", { class: "two-canvas" }), L = h("div"), R = h("div");
    wrap.append(L, R); root.append(wrap);
    return [Calc.canvas(L, aspect, 380), Calc.canvas(R, aspect, 380)];
  }
  /* törött vonal adatkoordinátákban */
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
  /* kis x jel (pl. a rejtett valódi értékekhez) */
  function cross(ctx, x, y, r, color) {
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x - r, y - r); ctx.lineTo(x + r, y + r); ctx.moveTo(x + r, y - r); ctx.lineTo(x - r, y + r);
    ctx.stroke(); ctx.restore();
  }
  /* felirat a vásznon */
  function label(ctx, txt, x, y, color, align = "left", font = "600 12px system-ui, sans-serif", base = "bottom") {
    ctx.save(); ctx.fillStyle = color; ctx.font = font; ctx.textAlign = align; ctx.textBaseline = base;
    ctx.fillText(txt, x, y); ctx.restore();
  }
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
  /* görgethető táblázat-tartó (keskeny kijelzőn ne lógjon ki) */
  const scrollBox = () => h("div", { style: "overflow-x:auto;max-width:100%" });

  /* ------------------------------------------------------------------
     Közös számolás: álvéletlen generátor és leíró statisztikák
     ------------------------------------------------------------------ */
  /* mulberry32: kicsi, gyors, magból reprodukálható álvéletlen-generátor */
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  /* standard normális minta (Box–Muller) */
  const gauss = rnd => { let u = 0; while (u === 0) u = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rnd()); };
  /* Fisher–Yates keverés (új tömböt ad) */
  function shuffle(a, rnd) {
    const r = a.slice();
    for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; }
    return r;
  }
  const mean = a => a.reduce((s, v) => s + v, 0) / a.length;
  const sorted = a => a.slice().sort((p, q) => p - q);
  const median = a => { const s = sorted(a), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
  const sdPop = a => { const m = mean(a); return Math.sqrt(mean(a.map(v => (v - m) ** 2))); };   // ÷ n
  const skew = a => { const m = mean(a), s = sdPop(a); return mean(a.map(v => ((v - m) / s) ** 3)); };
  /* kvantilis az (n + 1)p szabállyal, lineáris interpolációval */
  function quant(a, p) {
    const s = sorted(a), n = s.length, pos = (n + 1) * p;
    if (pos <= 1) return s[0];
    if (pos >= n) return s[n - 1];
    const i = Math.floor(pos);
    return s[i - 1] + (pos - i) * (s[i] - s[i - 1]);
  }
  const pct = (x, d = 1) => fmt(100 * x, d) + "%";

  const W = {};

  /* ------------------------------------------------------------------
     4.2  imputation-lab – hiányzó életkorok: törlés vagy pótlás?
     ------------------------------------------------------------------ */
  const AGES = [21, 23, 24, 26, 27, 29, 30, 32, 34, 36, 38, 41, 45, 58, 63];
  W["imputation-lab"] = root => {
    header(root, "Hiányzó életkorok: törölj vagy pótolj?",
      "15 ügyfél életkorát ismerjük – a táblázatból viszont 3 hiányzik. Válaszd ki, <b>miért</b> hiányoznak, és <b>mivel</b> pótolod őket. " +
      "Figyeld, mi lesz az átlaggal és a szórással! A valódi értékeket csak itt, a szemléltetésben láthatod – a valóságban nem ismered őket.");
    const SC = {
      mcar: { name: "Véletlenül hiányzik (MCAR)", miss: [2, 7, 11] },
      mnar: { name: "Az idősebbek nem válaszoltak (MNAR)", miss: [12, 13, 14] }
    };
    const METH = { drop: "Sorok törlése", mean: "Átlaggal", median: "Mediánnal", draw: "Véletlen húzás a meglévőkből" };
    let sc = "mcar", me = "mean", showTrue = false, seed = 1;
    const gS = toggleGroup(Object.entries(SC).map(([k, v]) => [k, v.name]), () => sc, k => { sc = k; sync(); });
    const gM = toggleGroup(Object.entries(METH), () => me, k => { me = k; sync(); });
    root.append(h("div", { class: "controls" }, gS.bs),
      h("div", { class: "controls" }, gM.bs, btn("🎲 Új húzás", () => { seed++; me = "draw"; sync(); })),
      h("div", { class: "controls" }, h("label", null, checkbox(showTrue, e => { showTrue = e.target.checked; draw(); }), "valódi értékek mutatása")),
      h("p", { class: "muted", style: "font-size:.85rem;margin:.2rem 0", html:
        `<span style="color:var(--setA)">●</span> megfigyelt · <span style="color:var(--setB)">○</span> pótolt · ` +
        `<span style="color:var(--bad)">✕</span> rejtett valódi érték · <span style="color:var(--accent)">│</span> átlag · ` +
        `<span>┆</span> valódi átlag (mind a 15)` }));
    const cv = Calc.canvas(root, 0.24);
    const out = h("div", { class: "readout" });
    root.append(out);
    const TRUE = { mean: mean(AGES), med: median(AGES), sd: sdPop(AGES) };
    function compute() {
      const miss = SC[sc].miss;
      const obs = AGES.filter((_, i) => !miss.includes(i));
      let imp = [];
      if (me === "mean") imp = miss.map(() => mean(obs));
      else if (me === "median") imp = miss.map(() => median(obs));
      else if (me === "draw") { const rnd = mulberry32(seed * 7919); imp = miss.map(() => obs[Math.floor(rnd() * obs.length)]); }
      return { miss, obs, imp, used: obs.concat(imp) };
    }
    function draw() {
      const { miss, obs, imp, used } = compute();
      const { w, h: H } = cv, R = 5, X0 = 15, X1 = 70;
      const px = v => 4 + (v - X0) / (X1 - X0) * (w - 8);
      // egymásra rakás pixelben: azonos (vagy túl közeli) pontok egymás fölé kerülnek
      const items = obs.map(v => ({ v, imp: false })).concat(imp.map(v => ({ v, imp: true })))
        .sort((a, b) => a.v - b.v || a.imp - b.imp);
      const levels = [];
      items.forEach(it => {
        let k = 0;
        while ((levels[k] || []).some(q => Math.abs(px(q) - px(it.v)) < 2 * R + 1)) k++;
        (levels[k] = levels[k] || []).push(it.v);
        it.k = k;
      });
      const unit = 14, need = levels.length + 1 + (showTrue ? 1.4 : 0);
      const ymin = -1.4, ymax = Math.max(ymin + (H - 8) / unit, need);
      const T = Calc.plot(cv, { xmin: X0, xmax: X1, ymin, ymax, xstep: 5, ystep: 1000, xname: "életkor", yname: " " },
        [{ vline: TRUE.mean, color: "--muted", dash: [5, 4] }, { vline: mean(used), color: "--accent", width: 2.2 }]);
      const { ctx } = cv;
      items.forEach(it => dot(ctx, T.tx(it.v), T.ty(0.6 + it.k), R, css(it.imp ? "--setB" : "--setA"), it.imp));
      if (showTrue) {
        const yy = T.ty(ymax - 0.7);
        label(ctx, "rejtett:", 6, yy, css("--bad"), "left", "600 11px system-ui, sans-serif", "middle");
        miss.forEach(i => cross(ctx, T.tx(AGES[i]), yy, 4, css("--bad")));
      }
    }
    cv.draw = draw;
    function sync() {
      gS.paint(); gM.paint();
      draw();
      const { obs, imp, used } = compute();
      const m = mean(used), md = median(used), sd = sdPop(used), sdObs = sdPop(obs);
      const nTxt = me === "drop" ? `n = <b>${used.length}</b> (3 sort eldobtál)`
        : `n = <b>${used.length}</b> (pótolt értékek: ${imp.map(v => fmt(v, 2)).join("; ")})`;
      const row = (name, a, b) => `<tr><td>${name}</td><td><b>${fmt(a, 2)}</b></td><td>${fmt(b, 2)}</td></tr>`;
      let verdict;
      if (me === "drop") verdict = sc === "mcar"
        ? `a minta kisebb lett (15 → 12), de az átlag alig mozdult: véletlen hiánynál a törlés nem torzít, csak adatot veszítesz.`
        : `a minta kisebb lett (15 → 12), és a törlés után csak a fiatalabbak maradtak.`;
      else if (me === "mean") verdict = `a szórás csökkent: ${fmt(sdObs, 2)} → ${fmt(sd, 2)} (a 12 meglévő érték szórásához képest) – mindhárom pótolt érték pont az átlagra került.`;
      else if (me === "median") verdict = `a szórás csökkent: ${fmt(sdObs, 2)} → ${fmt(sd, 2)} – mindhárom pótolt érték a mediánra került, a medián nem mozdult.`;
      else verdict = `a szórás nagyjából megmaradt (${fmt(sdObs, 2)} → ${fmt(sd, 2)}), de a pótolt értékek véletlenek: 🎲 új húzással mások lesznek.`;
      if (sc === "mnar") verdict += ` <b>Az átlag torzít</b> (${fmt(m, 2)} a valódi ${fmt(TRUE.mean, 2)} helyett): a hiányzók idősebbek voltak – ezen semmilyen pótlás nem segít, csak egy hiányzásjelző oszlop vagy több adat.`;
      out.innerHTML = `felhasznált sorok: ${nTxt}` +
        `<table style="width:auto;margin:.35rem 0;font-size:.88rem"><tr><th></th><th>pótlás után</th><th>valódi (mind a 15)</th></tr>` +
        row("átlag", m, TRUE.mean) + row("medián", md, TRUE.med) + row("szórás (÷ n)", sd, TRUE.sd) + `</table>` +
        `<span class="muted">${verdict}</span>`;
    }
    sync();
  };

  /* ------------------------------------------------------------------
     4.3  one-hot-builder – kategóriás változó kódolása
     ------------------------------------------------------------------ */
  W["one-hot-builder"] = root => {
    header(root, "Kategóriák számokká: címke, one-hot, k − 1 oszlop",
      "A „fűtés” oszlopot kell számokká alakítanod. Adj hozzá sorokat (meglévő vagy új kategóriával), és váltogasd a kódolást. " +
      "A csúszkával a ritka kategóriákat „egyéb”-be vonhatod össze.");
    const INIT = ["gáz", "távfűtés", "gáz", "elektromos", "hőszivattyú", "gáz", "távfűtés", "cserépkályha"];
    const MAXROWS = 24;
    let rows = INIT.slice(), enc = "onehot", thr = 1, big = false, msg = "";
    const ENC = [["label", "Címkekódolás"], ["onehot", "One-hot"], ["dummy", "k − 1 oszlop (dummy)"]];
    const gE = toggleGroup(ENC, () => enc, k => { enc = k; sync(); });
    const sel = h("select"), inp = h("input", { type: "text", placeholder: "új kategória", size: 12, maxlength: 20 });
    const sThr = slider(1, 4, 1, thr), lThr = h("b");
    sThr.addEventListener("input", () => { thr = +sThr.value; sync(); });
    const add = () => {
      const v = inp.value.trim().toLowerCase() || sel.value;
      if (!v) return;
      if (rows.length >= MAXROWS) { msg = `Legfeljebb ${MAXROWS} sor fér el.`; sync(); return; }
      rows.push(v); inp.value = ""; msg = ""; sync();
    };
    inp.addEventListener("keydown", e => { if (e.key === "Enter") add(); });
    const bBig = btn("🏙️ 3000 település", () => { big = !big; sync(); });
    root.append(h("div", { class: "controls" }, h("label", null, "kategória:", sel), h("label", null, "vagy új:", inp),
        btn("➕ Sor", add, "btn primary"),
        btn("✖ Utolsó sor", () => { if (rows.length > 1) rows.pop(); msg = ""; sync(); }),
        btn("↺ Alaphelyzet", () => { rows = INIT.slice(); thr = 1; big = false; msg = ""; sync(); })),
      h("div", { class: "controls" }, gE.bs),
      h("div", { class: "controls" }, h("label", null, "ritka kategória: legalább ennyi előfordulás", sThr, lThr), bBig));
    const box = scrollBox();
    const out = h("div", { class: "readout" });
    root.append(box, out);
    const uniq = a => a.filter((v, i) => a.indexOf(v) === i);
    function sync() {
      gE.paint(); bBig.classList.toggle("on", big);
      sThr.value = thr; lThr.textContent = thr;
      // a legördülő lista a nyers kategóriákat mutatja
      const keep = sel.value;
      sel.innerHTML = "";
      uniq(rows).forEach(c => sel.append(h("option", { value: c }, c)));
      if (uniq(rows).includes(keep)) sel.value = keep;
      // ritka kategóriák összevonása, aztán kódolás az első előfordulás sorrendjében
      const cnt = {};
      rows.forEach(r => (cnt[r] = (cnt[r] || 0) + 1));
      const rare = uniq(rows).filter(c => cnt[c] < thr);
      const merged = rows.map(r => (cnt[r] < thr ? "egyéb" : r));
      const cats = uniq(merged), k = cats.length;
      let cols, val;
      if (enc === "label") { cols = ["fűtés_kód"]; val = m => [cats.indexOf(m)]; }
      else if (enc === "onehot") { cols = cats.map(c => "fűtés_" + c); val = m => cats.map(c => +(c === m)); }
      else { cols = cats.slice(1).map(c => "fűtés_" + c); val = m => cats.slice(1).map(c => +(c === m)); }
      const M = merged.map(val);
      // táblázat
      const hl = "background:var(--accent-soft);color:var(--accent);font-weight:700";
      let t = `<table style="width:auto;margin:.4rem 0;font-family:var(--mono);font-size:.82rem"><tr><th>fűtés</th>` +
        cols.map(c => `<th>${c}</th>`).join("") + `</tr>`;
      rows.forEach((r, i) => {
        t += `<tr><td>${r}${merged[i] !== r ? ` <span class="muted">→ egyéb</span>` : ""}</td>` +
          M[i].map(v => `<td style="text-align:center;${enc !== "label" && v === 1 ? hl : ""}">${v}</td>`).join("") + `</tr>`;
      });
      t += `</table>`;
      if (!cols.length) t += `<p class="muted">Egyetlen kategóriánál a k − 1 kódolás 0 oszlopot ad: az oszlop nem hordoz információt.</p>`;
      box.innerHTML = t;
      // kiolvasás
      const cells = rows.length * cols.length, zeros = M.flat().filter(v => v === 0).length;
      let s = `kategóriák: k = <b>${k}</b> · oszlopok: <b>${cols.length}</b> · cellák: ${rows.length} × ${cols.length} = <b>${cells}</b>`;
      if (cells) s += enc === "label" ? ` · a cellák ${pct(zeros / cells)}-a nulla`
        : ` · ritkás mátrix: a cellák <b>${pct(zeros / cells)}</b>-a nulla`;
      if (enc === "dummy" && k) s += `<br>alapkategória: <b>${cats[0]}</b> – őt a csupa 0 sor jelöli, ezért nem kell külön oszlop.`;
      if (enc === "label" && k > 1) s += `<br><span style="color:var(--bad)">⚠ Figyelem: a modell ezt úgy látja, mintha ` +
        cats.map((c, i) => `${c} (${i})`).reverse().join(" > ") + ` lenne – nominális változónál ez kitalált sorrend.</span>`;
      if (rare.length) s += `<br>„egyéb”-be vonva (kevesebb, mint ${thr} előfordulás): ${rare.join(", ")}`;
      if (msg) s += `<br><span style="color:var(--bad)">${msg}</span>`;
      if (big) s += `<br><span class="muted">🏙️ Ha a „település” oszlopnak 3000 különböző értéke van: a one-hot <b>3000</b> oszlopot ad (k − 1 kódolással 2999-et), ` +
        `és minden sorban egyetlen 1-es áll → a cellák ${fmt(100 * (1 - 1 / 3000), 2)}%-a nulla. Ilyenkor vond össze a ritka kategóriákat, ` +
        `használj célváltozó-alapú kódolást, vagy tanulj beágyazást (embedding).</span>`;
      out.innerHTML = s;
    }
    sync();
  };

  /* ------------------------------------------------------------------
     4.4  scaling-viz – skálázás és a legközelebbi szomszéd
     ------------------------------------------------------------------ */
  const FLATS = [[35, 1], [42, 2], [50, 2], [55, 3], [62, 2], [68, 3], [75, 3], [80, 4], [95, 4], [110, 5]];
  const QF = [60, 4], CASTLE = [400, 6];
  W["scaling-viz"] = root => {
    header(root, "Skálázás: ki a legközelebbi szomszéd?",
      "10 lakás (alapterület, szobaszám) és egy új lakás: ★ = 60 m², 4 szoba. A távolság euklideszi, és a két tengely <b>azonos léptékű</b> – " +
      "úgy látod, ahogy a távolságot számoló algoritmus. A skálázás statisztikáit csak a 10 lakásból számoljuk, aztán ugyanazzal alakítjuk át a ★-ot is.");
    const MODES = [["raw", "Nyers"], ["minmax", "Min–max"], ["std", "Standardizált"], ["robust", "Robusztus (medián, IQR)"]];
    let mode = "raw", castle = false;
    const gM = toggleGroup(MODES, () => mode, k => { mode = k; sync(); });
    const bC = btn("➕ Kiugró: 400 m², 6 szoba", () => { castle = !castle; sync(); });
    root.append(h("div", { class: "controls" }, gM.bs), h("div", { class: "controls" }, bC));
    const cv = Calc.canvas(root, 0.62);
    const out = h("div", { class: "readout" });
    root.append(out);
    const NAMES = ["m²", "szobák"];
    /* tengelyenként: x ↦ (x − c)/s */
    function scalers(pts) {
      return [0, 1].map(j => {
        const v = pts.map(p => p[j]);
        if (mode === "minmax") { const lo = Math.min(...v); return { c: lo, s: Math.max(...v) - lo }; }
        if (mode === "std") return { c: mean(v), s: sdPop(v) };
        if (mode === "robust") return { c: median(v), s: quant(v, 0.75) - quant(v, 0.25) };
        return { c: 0, s: 1 };
      });
    }
    function compute() {
      const pts = castle ? FLATS.concat([CASTLE]) : FLATS.slice();
      const S = scalers(pts);
      const tf = p => [(p[0] - S[0].c) / S[0].s, (p[1] - S[1].c) / S[1].s];
      const P = pts.map(tf), q = tf(QF);
      const nn = P.map((p, i) => ({ i, d: Math.hypot(p[0] - q[0], p[1] - q[1]) })).sort((a, b) => a.d - b.d);
      return { pts, S, P, q, nn };
    }
    function draw() {
      const { pts, P, q, nn } = compute();
      // azonos lépték: 1 egység vízszintesen = 1 egység függőlegesen (pixelben)
      const all = P.concat([q]), M = 30;
      let x0 = Math.min(...all.map(p => p[0])), x1 = Math.max(...all.map(p => p[0]));
      let y0 = Math.min(...all.map(p => p[1])), y1 = Math.max(...all.map(p => p[1]));
      const Wp = cv.w - 8, Hp = cv.h - 8;
      const u = Math.max((x1 - x0) / Math.max(10, Wp - 2 * M), (y1 - y0) / Math.max(10, Hp - 2 * M), 1e-6);
      const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
      const view = { xmin: cx - u * Wp / 2, xmax: cx + u * Wp / 2, ymin: cy - u * Hp / 2, ymax: cy + u * Hp / 2,
        xname: mode === "raw" ? "m²" : "m² (skálázott)", yname: mode === "raw" ? "szobák" : "szobák (skálázott)" };
      const T = Calc.plot(cv, view, []);
      const { ctx } = cv;
      const best = nn[0];
      polyline(ctx, T, [q, P[best.i]], css("--accent"), 2.4);
      P.forEach((p, i) => {
        const isC = castle && i === pts.length - 1;
        dot(ctx, T.tx(p[0]), T.ty(p[1]), isC ? 6.5 : 5, css(isC ? "--setC" : "--setA"));
        if (isC) label(ctx, "🏰 kastély", T.tx(p[0]) - 8, T.ty(p[1]) - 8, css("--setC"), "right");
      });
      nn.slice(0, 3).forEach((o, r) => {
        const x = T.tx(P[o.i][0]), y = T.ty(P[o.i][1]);
        ctx.save(); ctx.strokeStyle = css("--accent"); ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.arc(x, y, 9, 0, 2 * Math.PI); ctx.stroke(); ctx.restore();
        label(ctx, String(r + 1), x + 8, y - 7, css("--accent"), "left", "700 12px system-ui, sans-serif");
      });
      label(ctx, "★", T.tx(q[0]), T.ty(q[1]), css("--bad"), "center", "700 22px system-ui, sans-serif", "middle");
    }
    cv.draw = draw;
    function sync() {
      gM.paint(); bC.classList.toggle("on", castle);
      draw();
      const { pts, S, P, q, nn } = compute();
      const form = j => mode === "raw" ? `${NAMES[j]}: x (nyers)`
        : `${NAMES[j]}: (x − ${fmt(S[j].c, 2)}) / ${fmt(S[j].s, 2)}`;
      const fl = i => { const [a, b] = pts[i]; return castle && i === pts.length - 1 ? `🏰 ${a} m², ${b} szoba` : `${a} m², ${b} szoba`; };
      let note;
      if (mode === "raw") note = "Nyers adatnál a négyzetméter dominál: 1 szoba eltérés annyit ér, mint 1 m² – a szobaszám szinte nem számít.";
      else if (castle && mode === "minmax") {
        const mx = Math.max(...P.slice(0, -1).map(p => p[0]));
        note = `A kastély miatt a többi lakás m²-e 0 és ~${fmt(mx, 2)} közé szorult – a min–max skálázás érzékeny a kiugró értékre.`;
      } else if (castle && mode === "std") note = "A kastély az átlagot és a szórást is elhúzza: a többi lakás m²-e egy szűk sávba nyomódott.";
      else if (castle && mode === "robust") note = "A medián és az IQR alig mozdult: a robusztus skálázást a kastély nem zavarja.";
      else note = "Skálázás után mindkét jellemző hasonló súllyal számít.";
      out.innerHTML = `skálázás: ${form(0)} · ${form(1)}<br>` +
        `★ (60 m², 4 szoba) → (${fmt(q[0], 3)}; ${fmt(q[1], 3)})<br>` +
        `legközelebbi szomszéd: <b>${fl(nn[0].i)}</b><br>` +
        `távolságok: ` + nn.slice(0, 3).map((o, r) => `${r + 1}. ${fl(o.i)}: <b>${fmt(o.d, 3)}</b>`).join(" · ") +
        `<br><span class="muted">${note}</span>`;
    }
    sync();
  };

  /* ------------------------------------------------------------------
     4.4  transform-hist – log-transzformáció, standardizálás, sávokra bontás
     ------------------------------------------------------------------ */
  /* 300 havi nettó jövedelem (ezer Ft): exp(N(ln 400; 0,5)), egészre kerekítve, rögzített magból */
  const INCOME = (() => { const rnd = mulberry32(2024); return Array.from({ length: 300 }, () => Math.round(Math.exp(Math.log(400) + 0.5 * gauss(rnd)))); })();
  W["transform-hist"] = root => {
    header(root, "Jobbra ferde jövedelmek: logaritmus, standardizálás, sávok",
      "300 havi nettó jövedelem (ezer Ft). A legtöbben 250–600 ezer között keresnek, néhányan sokkal többet – hosszú a jobb oldali farok. " +
      "Nézd meg, mit csinál az eloszlás <b>alakjával</b> a logaritmus és a standardizálás, és hogyan bonthatod sávokra!");
    let mode = "raw", k = 4;
    const MODES = [["raw", "Nyers"], ["log", "Logaritmus ($\\log_{10}$)"], ["std", "Standardizált (nyers)"]];
    const BINS = [["eqw", "Egyenlő szélességű sávok"], ["eqf", "Egyenlő gyakoriságú sávok (kvantilisek)"]];
    const g1 = toggleGroup(MODES, () => mode, m => { mode = m; sync(); });
    const g2 = toggleGroup(BINS, () => mode, m => { mode = m; sync(); });
    const sk = slider(2, 10, 1, k), lk = h("b");
    sk.addEventListener("input", () => { k = +sk.value; if (mode !== "eqw" && mode !== "eqf") mode = "eqw"; sync(); });
    root.append(h("div", { class: "controls" }, g1.bs),
      h("div", { class: "controls" }, h("span", { class: "muted", style: "font-size:.92rem" }, "Kategorizálás:"), g2.bs,
        h("label", null, "k =", sk, lk)));
    const cv = Calc.canvas(root, 0.5);
    const tbox = scrollBox();
    const out = h("div", { class: "readout" });
    root.append(tbox, out);
    const M0 = mean(INCOME), S0 = sdPop(INCOME);
    const binned = () => mode === "eqw" || mode === "eqf";
    const values = () => mode === "log" ? INCOME.map(Math.log10) : mode === "std" ? INCOME.map(v => (v - M0) / S0) : INCOME;
    function edges() {
      const s = sorted(INCOME), n = s.length, lo = s[0], hi = s[n - 1];
      if (mode === "eqw") return Array.from({ length: k + 1 }, (_, i) => lo + i * (hi - lo) / k);
      return Array.from({ length: k + 1 }, (_, i) => (i === 0 ? lo : i === k ? hi : s[Math.round(i * n / k)]));
    }
    function binCounts(E) {
      const c = Array(E.length - 1).fill(0);
      INCOME.forEach(v => {
        let j = 0;
        while (j < c.length - 1 && v >= E[j + 1]) j++;
        c[j]++;
      });
      return c;
    }
    function draw() {
      const v = values(), lo = Math.min(...v), hi = Math.max(...v), NB = 25, bw = (hi - lo) / NB;
      const cnt = Array(NB).fill(0);
      v.forEach(x => cnt[Math.min(NB - 1, Math.floor((x - lo) / bw))]++);
      const top = Math.max(...cnt), span = hi - lo;
      const xname = mode === "log" ? "log₁₀ x" : mode === "std" ? "z" : "ezer Ft";
      const layers = [{ vline: median(v), color: "--setC", dash: [5, 4], width: 2 }, { vline: mean(v), color: "--accent", width: 2 }];
      const T = Calc.plot(cv, { xmin: lo - span * 0.05, xmax: hi + span * 0.05, ymin: -top * 0.1, ymax: top * 1.18, xname, yname: "darab" }, layers);
      const { ctx } = cv;
      ctx.save(); ctx.globalAlpha = 0.55; ctx.fillStyle = css("--setA");
      cnt.forEach((c, i) => { if (c) { const x = T.tx(lo + i * bw), y = T.ty(c); ctx.fillRect(x + 0.5, y, T.tx(lo + (i + 1) * bw) - x - 1, T.ty(0) - y); } });
      ctx.restore();
      if (binned()) {
        const E = edges();
        E.forEach(e => polyline(ctx, T, [[e, 0], [e, top * 1.18]], css("--bad"), 2, [6, 3]));
        for (let i = 0; i < k; i++) label(ctx, String(i + 1), (T.tx(E[i]) + T.tx(E[i + 1])) / 2, T.ty(top * 1.1), css("--bad"), "center", "700 12px system-ui, sans-serif", "middle");
      }
    }
    cv.draw = draw;
    function sync() {
      g1.paint(); g2.paint(); sk.value = k; lk.textContent = k;
      draw();
      const v = values(), m = mean(v), md = median(v), g = skew(v);
      const key = `<span style="color:var(--accent)">│</span> átlag · <span style="color:var(--setC)">┆</span> medián<br>`;
      let s;
      if (mode === "raw") s = `átlag = <b>${fmt(m, 1)}</b> · medián = <b>${fmt(md, 1)}</b> · ferdeség = ${fmt(g, 2)}<br>` +
        `<span class="muted">Az átlag ${fmt(m, 0)}, a medián ${fmt(md, 0)} – jobbra ferde: a néhány nagy jövedelem felhúzza az átlagot.</span>`;
      else if (mode === "log") s = `átlag = <b>${fmt(m, 3)}</b> · medián = <b>${fmt(md, 3)}</b> · ferdeség = ${fmt(g, 2)}<br>` +
        `<span class="muted">A logaritmus után közel szimmetrikus: az átlag és a medián szinte egybeesik. ` +
        `Visszaszámolva $10^{${fmt(m, 3).replace(",", "{,}")}} \\approx ${fmt(Math.pow(10, m), 0)}$ ezer Ft – ez a mértani közép.</span>`;
      else if (mode === "std") s = `z = (x − ${fmt(M0, 1)}) / ${fmt(S0, 1)} · átlag = <b>${fmt(m, 2)}</b> · szórás = <b>${fmt(sdPop(v), 2)}</b> · ferdeség = ${fmt(g, 2)}<br>` +
        `<span class="muted">A forma ugyanaz – csak a tengely számai mások. A ferdeség sem változott: a standardizálás nem tesz szimmetrikussá.</span>`;
      else {
        const E = edges(), C = binCounts(E);
        s = `átlag = <b>${fmt(mean(INCOME), 1)}</b> · medián = <b>${fmt(median(INCOME), 1)}</b> · ${k} sáv, darabszámok: ${C.join(" / ")}<br>` +
          (mode === "eqw"
            ? `<span class="muted">Egyenlő szélesség (${fmt((E[k] - E[0]) / k, 0)} ezer Ft sávonként): a darabszámok nagyon eltérnek – a felső sávok szinte üresek.</span>`
            : `<span class="muted">Egyenlő gyakoriság: minden sávba kb. 300 / ${k} ≈ ${fmt(300 / k, 0)} ember jut – a sávok szélessége viszont nagyon különböző.</span>`);
        tbox.innerHTML = `<table style="width:auto;margin:.5rem 0;font-family:var(--mono);font-size:.85rem"><tr><th>sáv</th><th>határok (ezer Ft)</th><th>darab</th></tr>` +
          C.map((c, i) => `<tr><td>${i + 1}.</td><td>[${fmt(E[i], 0)}; ${fmt(E[i + 1], 0)}${i === k - 1 ? "]" : ")"}</td><td style="text-align:right">${c}</td></tr>`).join("") + `</table>`;
      }
      if (!binned()) tbox.innerHTML = "";
      out.innerHTML = key + s;
      math(out);
    }
    sync();
  };

  /* ------------------------------------------------------------------
     4.6  curse-of-dimensionality – a távolságok összetömörülnek
     ------------------------------------------------------------------ */
  W["curse-of-dimensionality"] = root => {
    header(root, "A dimenzió átka: mindenki egyforma messze?",
      "300 véletlen pont az egységkockában ($[0, 1]^d$) és egy véletlen lekérdező pont. A hisztogram a lekérdező pont távolságait mutatja " +
      "a legnagyobb távolsághoz viszonyítva ($r = $ távolság / legnagyobb távolság). Húzd a dimenziószámot, és figyeld, hogyan tömörül össze minden egy keskeny sávba!");
    const DIMS = [1, 2, 3, 5, 10, 20, 50, 100, 200, 500, 1000], N = 300;
    let di = 1, seed = 1, cache = {};
    const sd = slider(0, DIMS.length - 1, 1, di), ld = h("b");
    sd.addEventListener("input", () => { di = +sd.value; sync(); });
    root.append(h("div", { class: "controls" }, h("label", null, "dimenzió: d =", sd, ld),
      btn("🎲 Új minta", () => { seed++; cache = {}; sync(); })));
    const cv = Calc.canvas(root, 0.5);
    const out = h("div", { class: "readout" });
    root.append(out);
    /* dimenziónként egyszer számoljuk ki (lusta gyorsítótár) */
    function get(d) {
      if (cache[d]) return cache[d];
      const rnd = mulberry32(seed * 100003 + d);
      const q = new Float64Array(d);
      for (let j = 0; j < d; j++) q[j] = rnd();
      const D = new Float64Array(N);
      for (let i = 0; i < N; i++) {
        let s = 0;
        for (let j = 0; j < d; j++) { const t = rnd() - q[j]; s += t * t; }
        D[i] = Math.sqrt(s);
      }
      let mn = Infinity, mx = 0;
      D.forEach(v => { if (v < mn) mn = v; if (v > mx) mx = v; });
      return (cache[d] = { D, mn, mx });
    }
    function draw() {
      const d = DIMS[di], { D, mn, mx } = get(d), NB = 30;
      const cnt = Array(NB).fill(0);
      D.forEach(v => cnt[Math.min(NB - 1, Math.floor(v / mx * NB))]++);
      const top = Math.max(...cnt);
      const T = Calc.plot(cv, { xmin: -0.04, xmax: 1.04, ymin: -top * 0.1, ymax: top * 1.18, xstep: 0.1, xname: "r", yname: "darab" },
        [{ vline: mn / mx, color: "--bad", dash: [5, 4], width: 2 }]);
      const { ctx } = cv;
      ctx.save(); ctx.globalAlpha = 0.6; ctx.fillStyle = css("--accent");
      cnt.forEach((c, i) => { if (c) { const x = T.tx(i / NB), y = T.ty(c); ctx.fillRect(x + 0.5, y, T.tx((i + 1) / NB) - x - 1, T.ty(0) - y); } });
      ctx.restore();
      const lx = T.tx(mn / mx);
      label(ctx, "legközelebbi", lx < cv.w - 90 ? lx + 5 : lx - 5, 30, css("--bad"), lx < cv.w - 90 ? "left" : "right", "600 12px system-ui, sans-serif", "top");
    }
    cv.draw = draw;
    function sync() {
      const d = DIMS[di];
      sd.value = di; ld.textContent = d;
      draw();
      const { mn, mx } = get(d), side = Math.pow(0.1, 1 / d);
      const verdict = d <= 3 ? "Kis dimenzióban a távolságok szétszórtak: a legközelebbi pont sokkal közelebb van, mint a legtávolabbi."
        : d <= 20 ? "A hisztogram egyre keskenyebb: a távolságok kezdenek egy érték köré tömörülni."
        : "Minden pont nagyjából ugyanolyan messze van – a »legközelebbi szomszéd« elveszti az értelmét.";
      out.innerHTML = `d = <b>${d}</b> · N = ${N} pont · legközelebbi: <b>${fmt(mn, 3)}</b> · legtávolabbi: <b>${fmt(mx, 3)}</b><br>` +
        `arány (min / max): <b>${fmt(mn / mx, 3)}</b> · relatív kontraszt (max − min) / min: <b>${fmt((mx - mn) / mn, 2)}</b><br>` +
        `Ahhoz, hogy egy kis kocka az adatok 10%-át lefedje, az oldala $0{,}1^{1/${d}}$ = <b>${fmt(side, 3)}</b> – minden tengely ${pct(side, 1)}-a.<br>` +
        `<span class="muted">${verdict}</span>`;
      math(out);
    }
    sync();
  };

  /* ------------------------------------------------------------------
     4.7  leakage-detective – keresd a szivárgó jellemzőt!
     ------------------------------------------------------------------ */
  const LEAK = [
    { name: "Kórházi visszavétel", task: "a hazabocsátás napján megjósolni, visszakerül-e a beteg 30 napon belül.", moment: "a hazabocsátás napja",
      feats: [
        ["életkor", false, "a hazabocsátáskor ismert."],
        ["az elmúlt egy év kórházi felvételeinek száma", false, "múltbeli adat."],
        ["a mostani tartózkodás hossza (nap)", false, "a hazabocsátáskor már ismert."],
        ["a hazabocsátáskor felírt gyógyszerek száma", false, "a hazabocsátáskor ismert."],
        ["„visszavétel oka” kód", true, "csak akkor létezik, ha a beteg visszakerült – maga a címke, álruhában."],
        ["a következő 30 nap kórházi költsége", true, "a jövőből jön; visszavételnél nagy."],
        ["„utógondozási programba sorolva” (a visszavett betegeket utólag sorolják be)", true, "a címke után keletkezett."]] },
    { name: "Hitel-visszafizetés", task: "a hitelkérelem beadásakor megjósolni, visszafizeti-e az ügyfél a hitelt.", moment: "a hitelkérelem beadása",
      feats: [
        ["havi nettó jövedelem", false, "a kérelemben szerepel."],
        ["meglévő hitelek száma", false, "a kérelemkor lekérdezhető."],
        ["a kért összeg", false, "a kérelem része."],
        ["az ügyfél életkora", false, "a kérelemkor ismert."],
        ["„behajtó cégnek átadva” jelző", true, "csak nemfizetés után áll be."],
        ["a futamidő alatt felgyűlt késedelmi díjak", true, "a jövőből jön."],
        ["az ügyintéző „kockázatos ügyfél” megjegyzése, amit a késések után írt be", true, "a címke következménye."]] },
    { name: "Lakásár", task: "a meghirdetéskor megbecsülni a lakás eladási árát.", moment: "a meghirdetés",
      feats: [
        ["alapterület", false, "a meghirdetéskor ismert."],
        ["kerület", false, "a meghirdetéskor ismert."],
        ["állapot (felújítandó / átlagos / felújított)", false, "a meghirdetéskor ismert."],
        ["a hirdetésben kért ár", false, "nem szivárgás: a jóslás pillanatában ismert – csak erős jellemző."],
        ["a vevő által fizetett illeték", true, "az eladási ár 4%-a, vagyis a címke átszámítva."],
        ["négyzetméterár (eladási ár / m²)", true, "a címkéből számolták."],
        ["hány nap alatt kelt el", true, "csak az eladás után derül ki."]] },
    { name: "Lemorzsolódás", task: "a hónap elején megjósolni, lemondja-e az ügyfél az előfizetést a hónap végéig.", moment: "a hónap eleje",
      feats: [
        ["az előfizetés hossza (hónap)", false, "a hónap elején ismert."],
        ["a múlt havi használat (óra)", false, "múltbeli adat."],
        ["ügyfélszolgálati hívások az elmúlt 3 hónapban", false, "múltbeli adat."],
        ["a csomag típusa", false, "a hónap elején ismert."],
        ["„lemondás oka” mező", true, "csak lemondáskor töltik ki."],
        ["„megtartási ajánlatot kapott” (csak a lemondást jelzőknek küldik)", true, "a lemondási szándék következménye."],
        ["az e havi számla összege (a hónap végén állítják ki)", true, "a jóslás pillanatában még nem ismert."]] }
  ];
  W["leakage-detective"] = root => {
    header(root, "Szivárgásnyomozó: melyik jellemző csal?",
      "Válassz egy esetet. Kattints azokra a jellemzőkre, amelyek <b>szivárognak</b>: a jóslás pillanatában még nem ismertek, vagy a címkéből " +
      "(illetve a címke következményeiből) származnak. Aztán ellenőrizd!");
    let si = 0, round = 0, order = [], picked = new Set(), checked = false;
    const gS = toggleGroup(LEAK.map((s, i) => [i, `${"ABCD"[i]}) ${s.name}`]), () => si, i => { si = +i; round = 0; reset(); });
    const task = h("div", { style: "margin:.5rem 0;font-size:.95rem" });
    const list = h("div", { style: "margin:.4rem 0" });
    const bCheck = btn("🔍 Ellenőrzés", () => { checked = true; render(); }, "btn primary");
    const out = h("div", { class: "readout" });
    root.append(h("div", { class: "controls" }, gS.bs), task, list,
      h("div", { class: "controls" }, bCheck, btn("↺ Újra", () => { round++; reset(); })), out);
    /* a sorrendet rögzített magból keverjük, hogy a szivárgók ne mindig a végén legyenek */
    function reset() {
      const n = LEAK[si].feats.length;
      order = shuffle(Array.from({ length: n }, (_, i) => i), mulberry32(101 + 17 * si + 1000 * round));
      picked = new Set(); checked = false;
      render();
    }
    function render() {
      gS.paint();
      const S = LEAK[si];
      task.innerHTML = `<b>Feladat:</b> ${S.task}<br><b>A jóslás pillanata:</b> ${S.moment}.`;
      list.innerHTML = "";
      let good = 0, found = 0, fa = 0;
      const nLeak = S.feats.filter(f => f[1]).length;
      order.forEach(i => {
        const [txt, leak, expl] = S.feats[i], sel = picked.has(i), ok = sel === leak;
        if (ok) good++;
        if (sel && leak) found++;
        if (sel && !leak) fa++;
        let cls = "chip" + (sel ? " b" : ""), st = "cursor:pointer;font:inherit;font-size:.88rem;font-weight:600;color:var(--text);text-align:left;";
        if (checked) { cls = ok ? "chip c" : "chip"; if (!ok) st += "border:2px solid var(--bad);background:var(--bad-soft);"; st += "cursor:default;"; }
        const chip = h("button", { type: "button", class: cls, style: st }, (sel ? "🚩 " : "") + txt);
        chip.addEventListener("click", () => {
          if (checked) return;
          picked.has(i) ? picked.delete(i) : picked.add(i);
          render();
        });
        const row = h("div", { style: "display:flex;flex-wrap:wrap;align-items:center;gap:.35rem .5rem;margin:.35rem 0" }, chip);
        if (checked) row.append(h("span", { style: "font-size:.88rem", html:
          `${ok ? `<span style="color:var(--ok)">✔</span>` : `<span style="color:var(--bad)">✘</span>`} ` +
          `<b style="color:var(${leak ? "--bad" : "--ok"})">${leak ? "SZIVÁRGÓ" : "rendben"}</b> <span class="muted">– ${expl}</span>` }));
        list.append(row);
      });
      bCheck.disabled = checked;
      bCheck.style.opacity = checked ? 0.5 : 1;
      out.innerHTML = checked
        ? `<b>${good} / ${S.feats.length}</b> helyes döntés · megtalált szivárgók: ${found} / ${nLeak} · téves riasztás: ${fa}` +
          (good === S.feats.length ? " – hibátlan! 🎉" : "") +
          `<br><span class="muted">A kérdés mindig ez: ismerném-e ezt az értéket <b>a jóslás pillanatában</b>, és nem a címkéből származik-e?</span>`
        : `megjelölve: ${picked.size} jellemző · kattints az „Ellenőrzés” gombra, ha kész vagy.`;
    }
    reset();
  };

  /* ------------------------------------------------------------------
     4.8  imbalance-lab – kiegyensúlyozatlan osztályok
     ------------------------------------------------------------------ */
  W["imbalance-lab"] = root => {
    header(root, "Ritka osztály: 99%-os pontosság semmiért",
      "10 000 kártyás fizetés, közülük kevés csalás. Egy négyzet = 10 fizetés, a pirosak a csalások. Húzd a csúszkát, és nézd, " +
      "mennyit ér a „mindig azt mondom: nem csalás” modell – és mit tehetsz az egyensúlyért.");
    const PS = [0.001, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5], n = 10000, COLS = 50, ROWS = 20;
    let pi = 2;
    const perm = shuffle(Array.from({ length: COLS * ROWS }, (_, i) => i), mulberry32(42));   // melyik négyzet piros (rögzítve)
    const sp = slider(0, PS.length - 1, 1, pi), lp = h("b");
    sp.addEventListener("input", () => { pi = +sp.value; sync(); });
    root.append(h("div", { class: "controls" }, h("label", null, "a csalások aránya: p =", sp, lp)));
    const cv = Calc.canvas(root, ROWS / COLS + 0.004);
    const out = h("div", { class: "readout" });
    root.append(out);
    const counts = () => { const n1 = Math.round(n * PS[pi]); return { n1, n0: n - n1 }; };
    function draw() {
      const { ctx, w } = cv, c = w / COLS, { n1 } = counts();
      const m = n1 > 0 ? Math.max(1, Math.round(n1 / 10)) : 0;
      const red = new Set(perm.slice(0, m));
      ctx.clearRect(0, 0, cv.w, cv.h);
      ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, cv.w, cv.h);
      const g = c > 5 ? 1 : 0.5;
      for (let i = 0; i < COLS * ROWS; i++) {
        const x = (i % COLS) * c, y = Math.floor(i / COLS) * c;
        ctx.save();
        if (red.has(i)) ctx.fillStyle = css("--bad");
        else { ctx.fillStyle = css("--muted"); ctx.globalAlpha = 0.22; }
        ctx.fillRect(x + g / 2, y + g / 2, c - g, c - g);
        ctx.restore();
      }
    }
    cv.draw = draw;
    function sync() {
      const p = PS[pi], { n0, n1 } = counts();
      sp.value = pi; lp.textContent = fmt(100 * p, 1) + "%";
      draw();
      const w0 = n / (2 * n0), w1 = n / (2 * n1), N = v => fmt(v, 0);
      const resample = n0 === n1
        ? `az osztályok már kiegyensúlyozottak – nincs mit újramintavételezni.<br>`
        : `túlmintavételezés: minden csalásból <b>${fmt(n0 / n1, 1)}</b> példány kell (${N(n1)} × ${fmt(n0 / n1, 1)} = ${N(n0)} db) → tanító halmaz: ${N(2 * n0)} minta<br>` +
          `alulmintavételezés: a ${N(n0)} nem-csalásból <b>${N(n1)}</b> marad → tanító halmaz: <b>${N(2 * n1)}</b> minta (a többség ${pct(1 - n1 / n0)}-át eldobod)<br>`;
      out.innerHTML = `n = ${N(n)} · nem csalás: n<sub>0</sub> = <b>${N(n0)}</b> · csalás: n<sub>1</sub> = <b>${N(n1)}</b><br>` +
        `A »mindig: nem csalás« modell pontossága: (1 − p) = <b>${fmt(100 * (1 - p), 1)}%</b>, és a csalások közül <b>0</b>-t talál meg (0 / ${N(n1)}).<br>` +
        `osztálysúlyok $w_c = n / (2 n_c)$: w<sub>0</sub> = <b>${fmt(w0, 3)}</b> · w<sub>1</sub> = <b>${fmt(w1, 3)}</b> → mindkét osztály össz-súlya ${N(n / 2)}<br>` +
        resample +
        `<span class="muted">A pontosság itt félrevezető – a 6. fejezetben jobb mértékeket (precizitás, felidézés) tanulsz. Az újramintavételezést csak a tanító halmazon végezd!</span>`;
      math(out);
    }
    sync();
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
