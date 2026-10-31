/* =========================================================
   Elektromosságtan és digitális elektronika 0. fejezet – interaktív szemléltetések
   Minden widget egy  <div class="widget" data-widget="név">  elembe épül.
   Közös segédfüggvények: ugyanazok, mint az 1. fejezet w0.js-ében.
   ========================================================= */
(function () {
  "use strict";
  const W = {};
  const E_CH = 1.602176634e-19, K = 8.9875517923e9;

  /* számformázás magyarul: tizedesvessző */
  const fmt = (x, d = 2) => (isFinite(x) ? (+x.toFixed(d)).toString().replace(".", ",").replace("-", "−") : "–");
  /* normálalak HTML-ben: 1,6·10⁻¹⁹ */
  const SUP = { "-": "⁻", "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" };
  function sci(x, d = 2) {
    if (!isFinite(x)) return "–";
    if (x === 0) return "0";
    const s = x < 0 ? "−" : "", a = Math.abs(x);
    let k = Math.floor(Math.log10(a)), m = a / Math.pow(10, k);
    if (+m.toFixed(d) >= 10) { m /= 10; k += 1; }
    if (k >= -2 && k <= 3) return s + fmt(a, Math.max(0, d - k));
    return s + fmt(m, d) + "·10" + String(k).split("").map(c => SUP[c]).join("");
  }
  /* érték prefixummal: si(2.3e-7, "C") → "230 nC" */
  function si(x, unit, d = 3) {
    if (!isFinite(x)) return "–";
    if (x === 0) return "0 " + unit;
    const P = [[1e9, "G"], [1e6, "M"], [1e3, "k"], [1, ""], [1e-3, "m"], [1e-6, "µ"], [1e-9, "n"], [1e-12, "p"]];
    const a = Math.abs(x);
    for (const [f, p] of P) if (a >= f * 0.9995) return (x < 0 ? "−" : "") + fmt(+(a / f).toPrecision(d), 3) + " " + p + unit;
    return sci(x) + " " + unit;
  }

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
  function header(root, title, sub) {
    root.append(h("div", { class: "w-title" }, title));
    if (sub) root.append(h("p", { class: "w-sub", html: sub }));
  }
  /* gombcsoport, amelyből egy aktív */
  function toggleGroup(parent, items, cur, onpick) {
    const bs = items.map(([v, l]) => btn(l, () => { onpick(v); paint(v); }));
    const paint = v => bs.forEach((b, i) => b.classList.toggle("on", items[i][0] === v));
    paint(cur);
    parent.append(...bs);
    return paint;
  }
  /* csúszka címkével és élő értékkiírással: slider(parent, "r", 1, 50, 10, 1, v => v + " cm", onchange) → {input, get, set} */
  function slider(parent, label, min, max, val, step, show, onchange) {
    const out = h("b", { style: "font-family:var(--mono);min-width:5.5em;display:inline-block" });
    const inp = h("input", { type: "range", min, max, step, value: val });
    const upd = () => { out.innerHTML = show(+inp.value); onchange && onchange(+inp.value); };
    inp.addEventListener("input", upd);
    parent.append(h("label", null, label + " ", inp, out));
    out.innerHTML = show(+inp.value);
    return { input: inp, get: () => +inp.value, set: v => { inp.value = v; upd(); } };
  }
  const math = el => window.Synopsis && Synopsis.renderMath && window.renderMathInElement && Synopsis.renderMath(el);

  /* a téma színei (világos/sötét) – minden rajzoláskor újraolvassuk */
  function colors() {
    const cs = getComputedStyle(document.documentElement), v = n => cs.getPropertyValue(n).trim();
    return { text: v("--text"), muted: v("--muted"), border: v("--border"), card: v("--card"), soft: v("--bg-soft"),
      accent: v("--accent"), ok: v("--ok"), bad: v("--bad"),
      pos: "#dc2626", neg: "#2563eb", posSoft: "rgba(220,38,38,.18)", negSoft: "rgba(37,99,235,.18)" };
  }
  /* éles (HiDPI) vászon a szülő szélességéhez igazítva; cv.ctx, cv.W, cv.H logikai pixelben */
  function makeCanvas(parent, height, maxW = 720) {
    const cv = h("canvas", { style: "width:100%;touch-action:none;border-radius:10px;background:var(--bg-soft)" });
    parent.append(cv);
    function fit() {
      const cs = getComputedStyle(parent), pad = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
      const w = Math.min(maxW, Math.max(260, parent.clientWidth - pad)), dpr = window.devicePixelRatio || 1;
      cv.style.width = w + "px"; cv.style.height = height + "px";
      cv.width = Math.round(w * dpr); cv.height = Math.round(height * dpr);
      cv.W = w; cv.H = height;
      cv.ctx = cv.getContext("2d"); cv.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    fit();
    cv.refit = fit;
    return cv;
  }
  /* egérkoordináta a vászon logikai pixeleiben */
  function pointer(cv, ev) {
    const r = cv.getBoundingClientRect(), p = ev.touches ? ev.touches[0] : ev;
    return [(p.clientX - r.left) * cv.W / r.width, (p.clientY - r.top) * cv.H / r.height];
  }
  function arrow(ctx, x1, y1, x2, y2, color, width = 2, head = 8) {
    const a = Math.atan2(y2 - y1, x2 - x1);
    ctx.strokeStyle = ctx.fillStyle = color; ctx.lineWidth = width;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - head * Math.cos(a - 0.4), y2 - head * Math.sin(a - 0.4));
    ctx.lineTo(x2 - head * Math.cos(a + 0.4), y2 - head * Math.sin(a + 0.4));
    ctx.closePath(); ctx.fill();
  }
  /* töltött golyó előjellel */
  function chargeDot(ctx, x, y, r, q, C, label) {
    ctx.fillStyle = q > 0 ? C.pos : q < 0 ? C.neg : C.muted;
    ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.font = `700 ${Math.round(r * 1.2)}px system-ui`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(label != null ? label : q > 0 ? "+" : q < 0 ? "−" : "0", x, y + 1);
  }

  /* ==================================================================
     0.2 breadboard-map – kattintható breadboard: mely lyukak vannak összekötve?
     ================================================================== */
  W["breadboard-map"] = root => {
    header(root, "A breadboard térképe",
      "Kattints egy lyukra: kiemeljük az összes vele összekötött lyukat. „Két pont” módban két lyukat választasz, és megmondjuk, csipogna-e a szakadásvizsgáló. (A panel egy darabja: az 1–30. oszlop.)");
    const NC = 30, ROWS = "abcdefghij";
    let mode = "group", split = false, showStrips = false, sel = [], hover = null;
    const ctl = h("div", { class: "controls" });
    toggleGroup(ctl, [["group", "Csoport kiemelése"], ["pair", "Két pont (szakadásvizsgálat)"]], mode, v => { mode = v; sel = []; draw(); });
    const ctl2 = h("div", { class: "controls" });
    const cbSplit = h("input", { type: "checkbox" }), cbStrip = h("input", { type: "checkbox" });
    cbSplit.addEventListener("change", () => { split = cbSplit.checked; draw(); });
    cbStrip.addEventListener("change", () => { showStrips = cbStrip.checked; draw(); });
    ctl2.append(h("label", null, cbSplit, " a tápsín középen megszakad (egyes típusokon)"), h("label", null, cbStrip, " fémcsíkok mutatása („röntgen”)"));
    root.append(ctl, ctl2);
    const box = h("div", { style: "overflow-x:auto" });
    root.append(box);
    const read = h("div", { class: "readout", style: "margin-top:.5rem" });
    root.append(read);

    /* lyukak: {id, x, y, group}; tápsínek: T- T+ (felül), B+ B- (alul) */
    const holes = [];
    const railCols = c => c % 6 !== 0;                     /* 5 lyuk, egy kihagyás */
    const RAILS = [["T−", 0, "−", "kék"], ["T+", 1, "+", "piros"], ["B+", 14, "+", "piros"], ["B−", 15, "−", "kék"]];
    for (const [r, yi, sign] of RAILS)
      for (let c = 1; c <= NC; c++) if (railCols(c)) holes.push({ id: `${r}${c}`, rail: r, sign, c, yi });
    for (let ri = 0; ri < 10; ri++) for (let c = 1; c <= NC; c++)
      holes.push({ id: ROWS[ri] + c, row: ROWS[ri], c, yi: ri < 5 ? 3 + ri : 4 + ri });
    const group = hl => hl.rail ? hl.rail + (split ? (hl.c <= NC / 2 ? "·bal" : "·jobb") : "") : (hl.row < "f" ? "ae" : "fj") + hl.c;
    const describe = hl => {
      if (hl.rail) return `${hl.sign} tápsín (${hl.rail.startsWith("T") ? "felső" : "alsó"})` + (split ? (hl.c <= NC / 2 ? ", bal fele" : ", jobb fele") : "");
      return hl.row < "f" ? `${hl.c}. oszlop, a–e csík` : `${hl.c}. oszlop, f–j csík`;
    };
    const label = hl => hl.rail ? `${hl.rail[1]}sín/${hl.c}` : hl.id;

    const S = 22, X0 = 30, Y0 = 18;
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    const Wv = X0 + NC * S + 14, Hv = Y0 + 17 * S + 6;
    svg.setAttribute("viewBox", `0 0 ${Wv} ${Hv}`);
    svg.style.cssText = `width:100%;min-width:560px;max-width:${Wv * 1.25}px;display:block;touch-action:manipulation;user-select:none`;
    box.append(svg);
    const el = (t, a) => { const e = document.createElementNS(svgNS, t); for (const k in a) e.setAttribute(k, a[k]); return e; };
    const xy = hl => [X0 + (hl.c - 0.5) * S, Y0 + hl.yi * S + (hl.yi >= 14 ? 4 : hl.yi >= 3 ? 2 : 0)];

    function draw() {
      const C = colors();
      svg.innerHTML = "";
      svg.append(el("rect", { x: 2, y: 2, width: Wv - 4, height: Hv - 4, rx: 10, fill: C.card, stroke: C.border }));
      /* sínvonalak */
      for (const [r, yi, sign] of RAILS) {
        const y = Y0 + yi * S + (yi >= 14 ? 4 : 0) + (sign === "+" ? (yi === 1 ? 10 : -10) : (yi === 0 ? -10 : 10));
        const col = sign === "+" ? C.pos : C.neg;
        if (split) {
          svg.append(el("line", { x1: X0, x2: X0 + (NC / 2) * S - 6, y1: y, y2: y, stroke: col, "stroke-width": 2 }));
          svg.append(el("line", { x1: X0 + (NC / 2) * S + 6, x2: X0 + NC * S, y1: y, y2: y, stroke: col, "stroke-width": 2 }));
        } else svg.append(el("line", { x1: X0, x2: X0 + NC * S, y1: y, y2: y, stroke: col, "stroke-width": 2 }));
        const t = el("text", { x: 12, y: Y0 + yi * S + (yi >= 14 ? 4 : 0) + 4, "font-size": 12, "text-anchor": "middle", fill: col, "font-weight": 700 }); t.textContent = sign; svg.append(t);
      }
      /* árok */
      svg.append(el("rect", { x: X0, y: Y0 + 8 * S - 4, width: NC * S, height: 8, rx: 3, fill: C.soft }));
      /* sorbetűk és oszlopszámok */
      for (let ri = 0; ri < 10; ri++) {
        const t = el("text", { x: 14, y: Y0 + (ri < 5 ? 3 + ri : 4 + ri) * S + 6, "font-size": 11, "text-anchor": "middle", fill: C.muted }); t.textContent = ROWS[ri]; svg.append(t);
      }
      for (let c = 1; c <= NC; c += (c === 1 ? 4 : 5)) {
        const t = el("text", { x: X0 + (c - 0.5) * S, y: Y0 + 2 * S + 8, "font-size": 10, "text-anchor": "middle", fill: C.muted }); t.textContent = c; svg.append(t);
      }
      /* fémcsíkok („röntgen”) */
      if (showStrips) {
        const groups = {};
        holes.forEach(hl => (groups[group(hl)] = groups[group(hl)] || []).push(hl));
        Object.values(groups).forEach(g => {
          const xs = g.map(hl => xy(hl)[0]), ys = g.map(hl => xy(hl)[1]);
          const x1 = Math.min(...xs) - 7, x2 = Math.max(...xs) + 7, y1 = Math.min(...ys) - 7, y2 = Math.max(...ys) + 7;
          svg.append(el("rect", { x: x1, y: y1, width: x2 - x1, height: y2 - y1, rx: 5, fill: "none", stroke: C.muted, "stroke-width": 1.2, "stroke-dasharray": "3 2" }));
        });
      }
      /* kiemelt csoport(ok) */
      const hiG = new Set();
      if (mode === "group" && sel[0]) hiG.add(group(sel[0]));
      if (mode === "pair") sel.forEach(s => hiG.add(group(s)));
      const pairOK = mode === "pair" && sel.length === 2 && group(sel[0]) === group(sel[1]);
      holes.forEach(hl => {
        const [x, y] = xy(hl), g = group(hl), on = hiG.has(g), picked = sel.includes(hl);
        const fill = picked ? C.accent : on ? (mode === "pair" && sel.length === 2 ? (pairOK ? C.ok : C.bad) : C.accent) : C.soft;
        const r = el("rect", { x: x - 6, y: y - 6, width: 12, height: 12, rx: 2, fill, stroke: C.border, "stroke-width": 1, "fill-opacity": on && !picked ? 0.45 : 1, style: "cursor:pointer" });
        r.addEventListener("click", () => pick(hl));
        svg.append(r);
      });
      /* kiírás */
      if (!sel.length) read.innerHTML = mode === "group" ? "Kattints egy lyukra!" : "Válassz két lyukat!";
      else if (mode === "group") {
        const g = holes.filter(hl => group(hl) === group(sel[0]));
        read.innerHTML = `<b>${label(sel[0])}</b> – ${describe(sel[0])}: <b>${g.length}</b> lyuk van összekötve` +
          (sel[0].rail ? " (a panel hosszában)." : `: ${g.map(label).join(", ")}.`);
      } else if (sel.length === 1) read.innerHTML = `Első pont: <b>${label(sel[0])}</b> (${describe(sel[0])}). Válaszd ki a másodikat!`;
      else {
        const [p, q] = sel;
        let why = pairOK ? "ugyanazon a fémcsíkon vannak." :
          (!p.rail && !q.rail && p.c === q.c) ? "ugyanabban az oszlopban vannak, de az árok két oldalán." :
          (p.rail && q.rail && p.rail === q.rail) ? "ugyanaz a sín, de a közepén meg van szakítva." :
          (p.rail && q.rail) ? "két különböző tápsín – ha ezek össze lennének kötve, az rövidzár volna!" :
          (!p.rail && !q.rail && p.row < "f" === q.row < "f") ? "különböző oszlopok csíkjai." : "különböző csíkok.";
        read.innerHTML = `${label(p)} – ${label(q)}: ${pairOK ? "<b style='color:var(--ok)'>🔊 csip! Össze vannak kötve</b>" : "<b style='color:var(--bad)'>OL – nincsenek összekötve</b>"}, mert ${why}`;
      }
    }
    function pick(hl) {
      if (mode === "group") sel = [hl];
      else sel = sel.length >= 2 ? [hl] : sel.concat([hl]).filter((v, i, a) => a.indexOf(v) === i);
      draw();
    }
    sel = [holes.find(hl => hl.id === "c12")];
    draw();
    new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  };

  /* ==================================================================
     0.3 accuracy-calc – ±(a% + n digit) kalkulátor
     ================================================================== */
  W["accuracy-calc"] = root => {
    header(root, "Pontosság-kalkulátor", "Írd be, mit mutat a kijelző, és megmondjuk, hol lehet a valódi érték. A felbontást a 6000 digites méréshatárokból számoljuk; a pontossági adatok a kézikönyvből.");
    const MODES = {
      dcv: { name: "egyenfeszültség", unit: "V", pct: 0.8, ranges: [[6, 0.001], [60, 0.01], [600, 0.1]] },
      acv: { name: "váltakozó feszültség", unit: "V", pct: 1.0, ranges: [[6, 0.001], [60, 0.01], [600, 0.1]] },
      ohm: { name: "ellenállás", unit: "Ω", pct: 1.0, ranges: [[600, 0.1], [6e3, 1], [6e4, 10], [6e5, 100], [6e6, 1e3], [6e7, 1e4]] },
      ma:  { name: "áram (10A aljzat)", unit: "mA", pct: 2.0, ranges: [[1e4, 0.1]] }
    };
    let mode = "dcv";
    const ctl = h("div", { class: "controls" });
    toggleGroup(ctl, Object.entries(MODES).map(([k, m]) => [k, m.name]), mode, v => { mode = v; inp.value = { dcv: "5.012", acv: "230.1", ohm: "987", ma: "13.6" }[v]; upd(); });
    const inp = h("input", { type: "text", value: "5.012", inputmode: "decimal", style: "width:7em;font-family:var(--mono)" });
    const unitL = h("span");
    const nom = h("input", { type: "text", value: "", placeholder: "pl. 5", inputmode: "decimal", style: "width:6em;font-family:var(--mono)" });
    const tol = h("input", { type: "text", value: "", placeholder: "pl. 5", inputmode: "decimal", style: "width:4em;font-family:var(--mono)" });
    const ctl2 = h("div", { class: "controls" },
      h("label", null, "kijelzett érték: ", inp, unitL),
      h("label", null, "névleges (nem kötelező): ", nom),
      h("label", null, "tűrés ±", tol, " %"));
    [inp, nom, tol].forEach(e => e.addEventListener("input", upd));
    root.append(ctl, ctl2);
    const cv = makeCanvas(root, 92, 720);
    const stats = h("div", { class: "stat-row" });
    const read = h("div", { class: "readout", style: "margin-top:.5rem" });
    root.append(stats, read);
    const num = s => { const t = String(s).trim().replace(/\s/g, "").replace(",", "."); return t === "" ? NaN : Number(t); };
    const dec = r => Math.max(0, -Math.floor(Math.log10(r) + 1e-9));
    const f = (x, r) => fmt(x, dec(r) + 1);

    function upd() {
      const m = MODES[mode], x = num(inp.value);
      unitL.textContent = " " + m.unit;
      stats.innerHTML = ""; const C = colors(), ctx = cv.ctx; ctx.clearRect(0, 0, cv.W, cv.H);
      if (!isFinite(x) || x <= 0) { read.innerHTML = "Írj be egy pozitív számot (tizedesvessző vagy pont is jó)."; return; }
      const rg = m.ranges.find(([lim]) => x < lim);
      if (!rg) { read.innerHTML = `<b>OL</b> – ez a méréshatár fölött van.`; return; }
      if (mode === "dcv" && x < 0.8) { read.innerHTML = "⚠️ 0,8 V alatt az okos mód a kézikönyv szerint nem ismeri fel az egyenfeszültséget – a műszer ezt így nem mutatná."; }
      const res = rg[1], pTerm = m.pct / 100 * x, dTerm = 5 * res, D = pTerm + dTerm, lo = x - D, hi = x + D;
      [["felbontás", f(res, res) + " " + m.unit], ["% tag", "±" + f(pTerm, res) + " " + m.unit], ["digit tag", "±" + f(dTerm, res) + " " + m.unit],
       ["bizonytalanság Δ", "±" + f(D, res) + " " + m.unit], ["relatív", "±" + fmt(D / x * 100, 2) + " %"]]
        .forEach(([l, v]) => stats.append(h("div", { class: "stat" }, h("div", { class: "v", style: "font-size:1.05rem" }, v), h("div", { class: "l" }, l))));
      /* számegyenes */
      const n = num(nom.value), t = num(tol.value);
      const tlo = isFinite(n) && isFinite(t) ? n * (1 - t / 100) : NaN, thi = isFinite(n) && isFinite(t) ? n * (1 + t / 100) : NaN;
      let a = lo - 2 * D, b = hi + 2 * D;
      if (isFinite(tlo)) { a = Math.min(a, tlo - D); b = Math.max(b, thi + D); }
      const X = v => 20 + (cv.W - 40) * (v - a) / (b - a), y = 52;
      ctx.strokeStyle = C.border; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(14, y); ctx.lineTo(cv.W - 14, y); ctx.stroke();
      if (isFinite(tlo)) {
        ctx.fillStyle = "rgba(16,185,129,.22)"; ctx.fillRect(X(tlo), y - 26, X(thi) - X(tlo), 18);
        ctx.fillStyle = C.ok; ctx.font = "11px system-ui"; ctx.textAlign = "center"; ctx.fillText("tűrési sáv", (X(tlo) + X(thi)) / 2, y - 30);
      }
      ctx.fillStyle = C.accent; ctx.globalAlpha = 0.28; ctx.fillRect(X(lo), y - 6, X(hi) - X(lo), 12); ctx.globalAlpha = 1;
      ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(X(x), y, 5, 0, 2 * Math.PI); ctx.fill();
      ctx.fillStyle = C.text; ctx.font = "11px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.fillText(f(lo, res), X(lo), y + 10); ctx.fillText(f(hi, res), X(hi), y + 10);
      ctx.fillStyle = C.accent; ctx.textBaseline = "bottom"; ctx.fillText("kijelzett", X(x), y - 8);
      let s = `A valódi érték <b>${f(lo, res)} és ${f(hi, res)} ${m.unit}</b> között van (a kézikönyv ±(${fmt(m.pct, 1)}% + 5 digit) adata szerint).` +
        (dTerm > pTerm ? " Itt a <b>digit tag a nagyobb</b> – kis értéknél ez dominál." : "");
      if (isFinite(tlo)) {
        const verdict = lo >= tlo && hi <= thi ? "<b style='color:var(--ok)'>biztosan a tűrésen belül van</b>" :
          hi < tlo || lo > thi ? "<b style='color:var(--bad)'>biztosan a tűrésen kívül van</b>" :
          "<b>nem dönthető el</b> biztosan: a bizonytalansági sáv átlóg a tűrési sáv szélén";
        s += `<br>Tűrési sáv: ${f(tlo, res)} – ${f(thi, res)} ${m.unit}. Az alkatrész ${verdict}.`;
      }
      if (mode === "dcv" && x < 0.8) s = read.innerHTML + "<br>" + s;
      read.innerHTML = s;
    }
    upd();
    window.addEventListener("resize", () => { cv.refit(); upd(); });
    new MutationObserver(upd).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  };

  /* ------------------------------------------------------------------
     Indítás
     ------------------------------------------------------------------ */
  function boot() {
    document.querySelectorAll(".widget[data-widget]").forEach(root => {
      const f = W[root.dataset.widget];
      if (!f) return;
      try { f(root); }
      catch (e) { root.append(h("p", { class: "muted" }, "Hiba a szemléltetés betöltésekor: " + e.message)); console.error(e); }
    });
    document.querySelectorAll(".widget-static[data-fieldpic]").forEach(el => {
      try { W.__fieldpic && W.__fieldpic(el); } catch (e) { console.error(e); }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
