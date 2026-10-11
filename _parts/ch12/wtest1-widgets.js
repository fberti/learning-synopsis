/* =========================================================
   Mesterséges intelligencia 12. fejezet – interaktív szemléltetések
   (szövegből számok, beágyazások, rekurrens hálók, figyelem, önfigyelem,
   pozíciókódolás, Transformer-blokk, filmkritika-kísérlet)
   Minden widget egy  <div class="widget" data-widget="név">  elembe épül.
   Rajzolás: assets/calc.js (Calc.canvas, Calc.plot); adatok: glove-data.js (GLOVE12), real-attention.js (REAL12), review-models.js (REVIEW12).
   ========================================================= */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     Segédfüggvények (a 8. fejezet widgets.js-ének mintájára)
     ------------------------------------------------------------------ */
  const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const fmt = (x, d = 2) => (window.Calc ? Calc.fmt(x, d) : String(x));
  const pct = (a, d = 1) => fmt(100 * a, d) + "%";

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
  const slider = (min, max, step, value) => h("input", { type: "range", min, max, step, value });
  const checkbox = (checked, onchange) => { const c = h("input", { type: "checkbox", onchange }); c.checked = checked; return c; };
  const math = el => window.Synopsis && Synopsis.renderMath(el);
  const small = t => h("span", { class: "muted", style: "font-size:.92rem" }, t);
  const setDis = (b, v) => { b.disabled = v; b.style.opacity = v ? 0.45 : ""; b.style.cursor = v ? "default" : ""; };

  function header(root, title, sub) {
    root.append(h("div", { class: "w-title" }, title));
    if (sub) root.append(h("p", { class: "w-sub", html: sub }));
  }
  function twoCanvas(root, aspect, aspectR = aspect) {
    const wrap = h("div", { class: "two-canvas" }), L = h("div", { style: "min-width:0" }), R = h("div", { style: "min-width:0" });
    wrap.append(L, R); root.append(wrap);
    return [Calc.canvas(L, aspect, 380), Calc.canvas(R, aspectR, 380), L, R, wrap];
  }
  const evXY = (cv, e) => { const r = cv.c.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  function polyline(ctx, T, pts, color, width = 2, dash = []) {
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.setLineDash(dash);
    ctx.beginPath();
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(T.tx(x), T.ty(y)) : ctx.moveTo(T.tx(x), T.ty(y))));
    ctx.stroke(); ctx.restore();
  }
  function dot(ctx, x, y, r, color, open = false, lw = 2) {
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI);
    if (open) { ctx.fillStyle = css("--card"); ctx.fill(); ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.stroke(); }
    else { ctx.fillStyle = color; ctx.fill(); }
    ctx.restore();
  }
  function ring(ctx, x, y, r, color, lw = 2, dash = []) {
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.setLineDash(dash); ctx.stroke(); ctx.restore();
  }
  function label(ctx, txt, x, y, color, align = "left", font = "600 12px system-ui, sans-serif", base = "bottom") {
    ctx.save(); ctx.fillStyle = color; ctx.font = font; ctx.textAlign = align; ctx.textBaseline = base;
    ctx.fillText(txt, x, y); ctx.restore();
  }
  function arrow(ctx, x0, y0, x1, y1, color, lw = 2) {
    const a = Math.atan2(y1 - y0, x1 - x0), L = Math.hypot(x1 - x0, y1 - y0);
    if (L < 2) return;
    ctx.save(); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = lw;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1 - 7 * Math.cos(a), y1 - 7 * Math.sin(a)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 - 10 * Math.cos(a - 0.4), y1 - 10 * Math.sin(a - 0.4)); ctx.lineTo(x1 - 10 * Math.cos(a + 0.4), y1 - 10 * Math.sin(a + 0.4)); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  function toggleGroup(items, get, set) {
    const bs = items.map(([key, txt]) => { const b = btn(txt, () => set(key)); b.dataset.key = key; return b; });
    const paint = () => bs.forEach(b => b.classList.toggle("on", b.dataset.key === String(get())));
    return { bs, paint };
  }
  function rgba(col, a) {
    const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(col.trim());
    if (!m) return col;
    return `rgba(${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)},${a})`;
  }
  const hexRGB = c => { const m = /^#?([0-9a-f]{6})$/i.exec(String(c).trim()); if (!m) return [128, 128, 128]; const v = parseInt(m[1], 16); return [v >> 16, (v >> 8) & 255, v & 255]; };
  const flatAspect = (root, a, aNarrow) => ((root.clientWidth || 760) < 520 ? aNarrow : a);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const par = (x, d = 2) => (x < 0 ? `(${fmt(x, d)})` : fmt(x, d));
  /* egyenlő tengelyléptékű nézet */
  function eqView(cv, cx, cy, hx, hy, extra = {}) {
    const Wd = cv.w - 8, Hd = cv.h - 8, s = Math.min(Wd / (2 * hx), Hd / (2 * hy));
    const ax = Wd / (2 * s), ay = Hd / (2 * s);
    return Object.assign({ xmin: cx - ax, xmax: cx + ax, ymin: cy - ay, ymax: cy + ay }, extra);
  }
  /* az osztályok színei (az 5. fejezet konvenciója): 1 = narancs (--setB), 0 = kék (--setA) */
  const C1 = () => css("--setB"), C0 = () => css("--setA");
  /* döntési térkép: p(x, y) ∈ [0, 1] → kék … narancs, a bizonyosság szerinti erősséggel */
  function decisionMap(cv, T, view, p, cell = 6, alpha = 0.34) {
    const { ctx, w, h: hh } = cv, c1 = C1(), c0 = C0();
    for (let px = 0; px < w; px += cell) for (let py = 0; py < hh; py += cell) {
      const x = T.ix(px + cell / 2), y = T.iy(py + cell / 2);
      if (x < view.xmin || x > view.xmax || y < view.ymin || y > view.ymax) continue;
      const v = p(x, y);
      if (!Number.isFinite(v)) continue;
      const a = 0.05 + alpha * Math.min(1, Math.abs(v - 0.5) * 2);
      ctx.fillStyle = rgba(v >= 0.5 ? c1 : c0, a);
      ctx.fillRect(px, py, cell, cell);
    }
  }
  /* egyenes a w1·x + w2·y + b = 0 alakból, a nézetre vágva */
  function lineFrom(w1, w2, b, V) {
    if (Math.abs(w2) > 1e-9 && Math.abs(w2) >= Math.abs(w1) * 0.02) {
      const y = x => -(w1 * x + b) / w2;
      return [[V.xmin, y(V.xmin)], [V.xmax, y(V.xmax)]];
    }
    if (Math.abs(w1) > 1e-9) { const x = -b / w1; return [[x, V.ymin], [x, V.ymax]]; }
    return null;
  }
  const A = () => window.ML.act;

  const softmax = z => { const m = Math.max(...z), e = z.map(v => Math.exp(v - m)), s = e.reduce((a, b) => a + b, 0); return e.map(v => v / s); };
  const argmax = a => a.reduce((bi, v, i, arr) => (v > arr[bi] ? i : bi), 0);
  const dotp = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);
  const norm = a => Math.sqrt(dotp(a, a));
  const cosine = (a, b) => dotp(a, b) / (norm(a) * norm(b) || 1);
  /* cella kitöltése: háttér (--card) → szín, t ∈ [0, 1] erősséggel */
  function mix(colVar, t) {
    const bg = hexRGB(css("--card")), c = hexRGB(css(colVar));
    t = clamp(t, 0, 1);
    return `rgb(${bg.map((b, i) => Math.round(b + (c[i] - b) * t)).join(",")})`;
  }
  /* olvasható szövegszín egy kitöltött cellán */
  const ink = t => (t > 0.55 ? css("--card") : css("--text"));

  const W = {};

  /* ==================================================================
     w1 – 12.1–12.4: TF-IDF táblázat, beágyazás-térkép, kitekert RNN, puha keresés
     ================================================================== */
  const w1Font = (px, wt = 600) => `${wt} ${px}px system-ui, sans-serif`;
  /* rögzített tizedesjegyek (a fmt levágja a záró nullákat, a táblázatokban egységes szélesség kell) */
  const w1Fix = (x, d = 3) => {
    if (!Number.isFinite(x)) return "–";
    const s = (Math.abs(x) < 0.5 * Math.pow(10, -d) ? 0 : x).toFixed(d);
    return s.replace("-", "−").replace(".", ",");
  };
  const w1Sup = n => String(n).replace(/[-0-9]/g, c => "⁻⁰¹²³⁴⁵⁶⁷⁸⁹"["-0123456789".indexOf(c)]);
  const w1Sub = n => String(n).replace(/[0-9]/g, c => "₀₁₂₃₄₅₆₇₈₉"[+c]);
  /* kis számok olvashatóan: 0,000 81 · 3,2·10⁻⁹ */
  function w1Tiny(x) {
    const a = Math.abs(x), s = x < 0 ? "−" : "";
    if (!Number.isFinite(x)) return "–";
    if (a === 0) return "0";
    if (a >= 0.01) return s + w1Fix(a, 3);
    const e = Math.floor(Math.log10(a));
    if (e >= -6) {
      const [, dec] = a.toFixed(-e + 1).split(".");
      return s + "0," + dec.replace(/(\d{3})(?=\d)/g, "$1 ");
    }
    return s + w1Fix(a / Math.pow(10, e), 1) + "·10" + w1Sup(e);
  }
  /* határozott névelő egy szó elé (a / az) */
  const w1Az = w => (/^[„"]?[aáeéiíoóöőuúüű]/i.test(w) ? "az" : "a");
  const w1Q = w => `„${w}”`;
  /* tokenizálás: kisbetű, szóközök mentén, az írásjelek külön tokenek */
  const w1Tok = s => s.toLowerCase().replace(/([,.!?])/g, " $1 ").split(/\s+/).filter(Boolean);
  /* témaváltáskor a HTML-be írt (inline) színeket is újra kell számolni */
  const w1OnTheme = fn => new MutationObserver(fn).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  /* canvas, amelynek magassága a szélességtől (és a tartalomtól) függ */
  function w1Canvas(parent, heightOf, maxW = 760) {
    const c = h("canvas", { style: "display:block;touch-action:none;max-width:100%" });
    parent.append(c);
    const o = { c, ctx: c.getContext("2d"), w: 0, h: 0, draw: null };
    o.resize = () => {
      const w = Math.min(maxW, parent.clientWidth || maxW), hh = Math.max(40, Math.round(heightOf(w)));
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
    w1OnTheme(() => o.draw && o.draw());
    return o;
  }
  /* címkék ütközés nélkül: a már elhelyezett téglalapokat kerüli */
  function w1Labeler(ctx, W_, H_) {
    const placed = [];
    const hit = r => placed.some(p => r.x < p.x + p.w && r.x + r.w > p.x && r.y < p.y + p.h && r.y + r.h > p.y);
    return {
      block(x, y, r) { placed.push({ x: x - r, y: y - r, w: 2 * r, h: 2 * r }); },
      put(txt, x, y, color, font, force = false, bg = null) {
        ctx.save(); ctx.font = font;
        const tw = ctx.measureText(txt).width + 6, th = 15;
        const cand = [[x + 6, y - th / 2], [x - 6 - tw, y - th / 2], [x - tw / 2, y - 6 - th], [x - tw / 2, y + 6],
          [x + 6, y - th - 2], [x - 6 - tw, y + 2], [x + 6, y + 2], [x - 6 - tw, y - th - 2]];
        let pos = null;
        for (const [cx, cy] of cand) {
          const r = { x: cx, y: cy, w: tw, h: th };
          if (cx < 1 || cy < 1 || cx + tw > W_ - 1 || cy + th > H_ - 1) continue;
          if (!hit(r)) { pos = r; break; }
        }
        if (!pos && force) {
          const [cx, cy] = cand[0];
          pos = { x: clamp(cx, 1, W_ - tw - 1), y: clamp(cy, 1, H_ - th - 1), w: tw, h: th };
        }
        if (pos) {
          placed.push(pos);
          ctx.fillStyle = bg || rgba(css("--card"), 0.82);
          ctx.fillRect(pos.x, pos.y, pos.w, pos.h);
          ctx.fillStyle = color; ctx.textAlign = "left"; ctx.textBaseline = "middle";
          ctx.fillText(txt, pos.x + 3, pos.y + th / 2 + 0.5);
        }
        ctx.restore();
        return !!pos;
      }
    };
  }
  const w1TblCss = "width:auto;margin:.3rem 0;font-family:var(--mono);font-size:.82rem;border-collapse:collapse";
  const w1Cell = "padding:.22em .45em;text-align:center;white-space:nowrap";

  /* ------------------------------------------------------------------
     1. Szózsák és TF-IDF (12.1-c)
     ------------------------------------------------------------------ */
  W["tfidf-table"] = root => {
    header(root, "Szózsák és TF-IDF a saját mondataidon",
      "Írj soronként egy dokumentumot (D1, D2, …). A táblázat sorai a dokumentumok, oszlopai a szótár szavai " +
      "(első előfordulás sorrendjében). Váltogass a darabszám és a TF-IDF között, és figyeld, hogyan változik a koszinusz-hasonlóság.");
    const PRE = {
      alap: ["a film jó volt", "a film nem volt jó", "a zene unalmas volt", "a film remek"],
      same: ["a film jó volt , de a vége unalmas volt", "a film unalmas volt , de a vége jó volt"],
    };
    let pre = "alap", mode = "count", sk = false, bi = false;
    const ta = h("textarea", { rows: 4, spellcheck: "false", "aria-label": "dokumentumok, soronként egy",
      style: "width:100%;box-sizing:border-box;font-family:var(--mono);font-size:.9rem;padding:.4rem .55rem;border:1px solid var(--border);border-radius:8px;background:var(--card);color:var(--text);resize:vertical" });
    ta.value = PRE.alap.join("\n");
    const gP = toggleGroup([["alap", "alap"], ["same", "ugyanazok a szavak"]], () => pre, k => {
      pre = k; ta.value = PRE[k].join("\n"); ta.rows = Math.max(2, PRE[k].length); render();
    });
    const gM = toggleGroup([["count", "szózsák (darabszám)"], ["tfidf", "TF-IDF"]], () => mode, k => { mode = k; render(); });
    const cSk = checkbox(sk, () => { sk = cSk.checked; render(); });
    const cBi = checkbox(bi, () => { bi = cBi.checked; render(); });
    const lSk = h("label", null, cSk, "scikit-learn-változat: ln((1+N)/(1+df)) + 1");
    ta.addEventListener("input", () => { pre = null; render(); });
    root.append(h("div", { class: "controls" }, small("minta:"), gP.bs), ta,
      h("div", { class: "controls" }, small("mód:"), gM.bs),
      h("div", { class: "controls" }, h("label", null, cBi, "szópárok (bigramok) is"), lSk));
    const tMat = h("div", { class: "tw", style: "overflow-x:auto" });
    const tCos = h("div", { class: "tw", style: "overflow-x:auto" });
    const out = h("div", { class: "readout", style: "font-family:var(--font);line-height:1.5" });
    root.append(h("div", { style: "font-weight:600;margin-top:.5rem" }, "Dokumentum–szó mátrix"), tMat,
      h("div", { style: "font-weight:600;margin-top:.5rem" }, "Koszinusz-hasonlóság a dokumentumok között"), tCos, out);

    const compute = (m, sklearn) => {
      const docs = ta.value.split("\n").map(s => s.trim()).filter(Boolean).slice(0, 10);
      const toks = docs.map(w1Tok);
      const uni = [], bis = [];
      toks.forEach(t => {
        t.forEach(w => { if (!uni.includes(w)) uni.push(w); });
        if (bi) t.slice(0, -1).forEach((w, i) => { const b = w + "·" + t[i + 1]; if (!bis.includes(b)) bis.push(b); });
      });
      const V = uni.concat(bis);
      const feats = toks.map(t => (bi ? t.concat(t.slice(0, -1).map((w, i) => w + "·" + t[i + 1])) : t));
      const C = feats.map(f => V.map(w => f.filter(x => x === w).length));
      const N = docs.length, df = V.map((_, j) => C.filter(r => r[j] > 0).length);
      const idf = df.map(d => (sklearn ? Math.log((1 + N) / (1 + d)) + 1 : Math.log(N / d)));
      const X = m === "count" ? C : C.map(r => r.map((c, j) => c * idf[j]));
      const nz = r => r.some(v => Math.abs(v) > 1e-12);
      const S = X.map(a => X.map(b => (nz(a) && nz(b) ? dotp(a, b) / (norm(a) * norm(b)) : NaN)));
      return { docs, toks, V, C, N, df, idf, X, S };
    };

    function render() {
      gP.paint(); gM.paint(); setDis(cSk, mode === "count"); lSk.style.opacity = mode === "count" ? 0.5 : "";
      const R = compute(mode, sk);
      const { docs, V, N, df, idf, X, S } = R;
      if (!docs.length) { tMat.replaceChildren(small("Írj be legalább egy dokumentumot.")); tCos.replaceChildren(); out.replaceChildren(); return; }
      const dec = mode === "count" ? 0 : 3;
      const mx = Math.max(1e-9, ...X.flat());
      /* mátrix */
      const th = (t, extra = "") => h("th", { style: w1Cell + ";font-weight:600;" + extra }, t);
      const head = h("tr", null, th(""), V.map(w => th(w, w.includes("·") ? "color:var(--setC)" : "")));
      const rows = X.map((r, i) => h("tr", null, h("th", { style: w1Cell, title: docs[i] }, "D" + (i + 1)),
        r.map(v => {
          const t = v / mx * 0.85;
          return h("td", { style: `${w1Cell};background:${mix("--setB", t)};color:${v ? ink(t) : css("--muted")}` }, v ? w1Fix(v, dec) : "0");
        })));
      const extra = [];
      if (mode === "tfidf") {
        extra.push(h("tr", { style: "border-top:2px solid var(--muted)" }, th("df", "color:var(--muted)"),
          df.map(d => h("td", { style: w1Cell + ";color:var(--muted);background:var(--bg-soft)" }, String(d)))));
        extra.push(h("tr", null, th("idf", "color:var(--muted)"),
          idf.map(v => h("td", { style: w1Cell + ";background:var(--bg-soft);" + (Math.abs(v) < 1e-12 ? "color:var(--bad);font-weight:700" : "color:var(--muted)") }, w1Fix(v, 3)))));
      }
      tMat.replaceChildren(h("table", { style: w1TblCss }, head, rows, extra));
      /* koszinusz-hőtábla */
      const ch = h("tr", null, th(""), docs.map((_, j) => th("D" + (j + 1))));
      const cr = S.map((r, i) => h("tr", null, h("th", { style: w1Cell, title: docs[i] }, "D" + (i + 1)),
        r.map(v => {
          const t = Number.isFinite(v) ? clamp(v, 0, 1) * 0.85 : 0;
          return h("td", { style: `${w1Cell};min-width:3.6em;background:${mix("--accent", t)};color:${ink(t)}` }, Number.isFinite(v) ? w1Fix(v, 3) : "–");
        })));
      tCos.replaceChildren(h("table", { style: w1TblCss }, ch, cr));
      /* magyarázat */
      const L = [];
      L.push(`N = ${N} dokumentum, ${V.length} jellemző${bi ? " (szavak + szópárok)" : ""}.`);
      if (mode === "tfidf") {
        const all = V.filter((w, j) => df[j] === N && !w.includes("·"));
        if (all.length) {
          const list = all.slice(0, 4).map(w1Q).join(", ") + (all.length > 4 ? ", …" : "");
          const one = all.length === 1;
          if (!sk) L.push(`${w1Az(all[0])[0].toUpperCase() + w1Az(all[0]).slice(1)} ${list} minden dokumentumban szerepel → idf = ln(${N}/${N}) = <b>0</b>, ezért a TF-IDF-ben ${one ? "eltűnik" : "eltűnnek"}: semmit sem mond${one ? "" : "anak"} a különbségekről.`);
          else L.push(`A scikit-learn-változatban a mindenütt jelen lévő ${list} idf-je ln(${N + 1}/${N + 1}) + 1 = <b>1</b>: nem tűnik el, csak a legkisebb súlyt kapja.`);
        } else L.push("Nincs olyan szó, amely minden dokumentumban szerepel, így egyik idf sem a legkisebb lehetséges érték.");
        const rare = V.filter((w, j) => df[j] === 1 && !w.includes("·"));
        if (rare.length && N > 1) {
          const v = sk ? Math.log((1 + N) / 2) + 1 : Math.log(N);
          L.push(`A csak egy dokumentumban szereplő szavak (${rare.slice(0, 5).map(w => w).join(", ")}${rare.length > 5 ? ", …" : ""}) idf-je ${sk ? `ln(${N + 1}/2) + 1` : `ln(${N}/1)`} = <b>${w1Fix(v, 3)}</b> – ezek kapják a legnagyobb súlyt.`);
        }
      }
      /* hasonlóság */
      let best = null, same = null;
      for (let i = 0; i < S.length; i++) for (let j = i + 1; j < S.length; j++) {
        const v = S[i][j];
        if (!Number.isFinite(v)) continue;
        if (v > 1 - 1e-9 && docs[i] !== docs[j] && !same) same = [i, j];
        if (!best || v > best[2]) best = [i, j, v];
      }
      if (same) {
        const [i, j] = same;
        L.push(`<b>D${i + 1} és D${j + 1} más mondat, mégis cos = 1</b>: ugyanazok a szavak ugyanannyiszor – a szózsák nem látja a sorrendet.${bi ? "" : " Kapcsold be a szópárokat!"}`);
      } else if (best) {
        const [i, j, v] = best;
        let s = `Legjobban hasonlít: D${i + 1} és D${j + 1}, cos = <b>${w1Fix(v, 3)}</b>`;
        if (mode === "tfidf") {
          const c0 = compute("count", sk).S[i][j];
          s += ` (szózsákban ${w1Fix(c0, 3)}${c0 - v > 0.02 ? " – a mindenütt jelen lévő szavak súlya lecsökkent, ezért kisebb" : ""})`;
        }
        const shared = V.filter((w, k) => R.C[i][k] > 0 && R.C[j][k] > 0 && !w.includes("·"));
        if (shared.length && mode === "count") s += `; közös szavaik: ${shared.slice(0, 6).map(w1Q).join(", ")}`;
        L.push(s + ".");
        const sameBag = w1Tok(docs[i]).slice().sort().join(" ") === w1Tok(docs[j]).slice().sort().join(" ");
        if (bi && sameBag) {
          const only = (a, b) => V.filter((w, k) => w.includes("·") && R.C[a][k] > 0 && !R.C[b][k]).slice(0, 2).map(w1Q).join(", ");
          L.push(`D${i + 1} és D${j + 1} szavai ugyanazok, de a szópárokkal már érződik a sorrend: ${only(i, j)} csak D${i + 1}-ben, ${only(j, i)} csak D${j + 1}-ben van, ezért cos &lt; 1.`);
        }
      }
      if (S.some(r => r.some(v => !Number.isFinite(v)))) L.push("„–”: valamelyik dokumentum vektora csupa 0 (pl. csak idf = 0 szavakból áll), ott a koszinusz nincs értelmezve.");
      out.innerHTML = L.join("<br>");
    }
    w1OnTheme(render);
    render();
  };

  /* ------------------------------------------------------------------
     2. Beágyazás-térkép valódi GloVe-vektorokkal (12.2-b)
     ------------------------------------------------------------------ */
  W["embedding-explorer"] = root => {
    const G = window.GLOVE12;
    header(root, "Szóvektorok térképe (valódi GloVe-vektorok)",
      "182 angol szó 50 dimenziós GloVe-vektora, a térképen 2-D vetületben (PCA). <b>Kattints egy szóra</b>: megkapod a 6 legközelebbi " +
      "szomszédját 50 dimenzióban, koszinusz-hasonlósággal. Lent vektoraritmetikát is kipróbálhatsz.");
    if (!G) { root.append(small("A GloVe-adat (glove-data.js) nem töltődött be.")); return; }
    const N = G.words.length, idx = Object.fromEntries(G.words.map((w, i) => [w, i]));
    const GROUPS = [["család és királyság", "king"], ["országok és fővárosok", "hungary"], ["állatok", "cat"], ["ételek és italok", "apple"],
      ["cégek és technika", "microsoft"], ["bank és víz", "bank"], ["igék és múlt idő", "walk"], ["fokozás", "big"], ["értékelő szavak", "great"],
      ["foglalkozások", "doctor"], ["számok", "one"], ["színek", "red"], ["járművek", "car"], ["hangszerek", "guitar"],
      ["levél/fa/posta", "leaf"], ["film", "film"]].filter(g => g[1] in idx);
    const grpOf = new Array(N).fill(-1);
    GROUPS.forEach(([, st], g) => {
      const s = idx[st], e = g + 1 < GROUPS.length ? idx[GROUPS[g + 1][1]] : N;
      for (let i = s; i < e; i++) grpOf[i] = g;
    });
    const nrm = G.vec.map(norm);
    const cosIJ = (i, j) => dotp(G.vec[i], G.vec[j]) / (nrm[i] * nrm[j]);
    const nn = (i, k = 6) => G.words.map((_, j) => [j, j === i ? -2 : cosIJ(i, j)]).sort((a, b) => b[1] - a[1]).slice(0, k);
    const analogy = (b, a, c, incl) => {
      const t = G.vec[b].map((v, d) => v - G.vec[a][d] + G.vec[c][d]), nt = norm(t);
      return G.words.map((_, j) => [j, dotp(t, G.vec[j]) / (nt * nrm[j])])
        .filter(([j]) => incl || (j !== a && j !== b && j !== c)).sort((x, y) => y[1] - x[1]).slice(0, 5);
    };
    const gl = i => `${G.words[i]} (${G.hu[i]})`;
    const PRES = [["king", "man", "woman"], ["paris", "france", "hungary"], ["walked", "walk", "swim"], ["bigger", "big", "small"],
      ["doctor", "man", "woman"], ["programmer", "man", "woman"], ["lemon", "yellow", "green"]].filter(p => p.every(w => w in idx));
    const OCC = new Set(["doctor", "nurse", "teacher", "engineer", "programmer", "scientist", "lawyer", "homemaker", "receptionist", "carpenter", "surgeon"]);

    let grp = 0, sel = idx.cat ?? 0, hov = null, AN = PRES[0].map(w => idx[w]), incl = false;

    /* vezérlők */
    const gG = toggleGroup([["-1", "egyik sem"]].concat(GROUPS.map(([n], g) => [String(g), n])), () => String(grp), k => { grp = +k; draw(); });
    gG.bs.forEach(b => { b.style.fontSize = ".82rem"; b.style.padding = ".15rem .5rem"; });
    root.append(h("div", { class: "controls", style: "gap:.3rem" }, small("csoport kiemelése:"), gG.bs));
    const wrap = h("div", { style: "position:relative" });
    root.append(wrap);
    const cv = Calc.canvas(wrap, flatAspect(root, 0.7, 1.0), 760);
    const hovOut = h("div", { class: "readout" });
    root.append(hovOut, h("p", { class: "muted", style: "font-size:.85rem;margin:.3rem 0 .6rem" },
      "A térkép csak 2 dimenziós vetület (a PCA két tengelye a variancia kb. 13% + 10%-át mutatja): a távolságok és a paralelogramma itt torzulnak. " +
      "Minden számolás (szomszédok, analógia, koszinusz) az eredeti 50 dimenzióban történik."));

    /* szomszédok */
    const wordSelect = (val, on) => {
      const s = h("select", { style: "max-width:12.5rem" });
      GROUPS.forEach(([n], g) => {
        const og = h("optgroup", { label: n });
        G.words.forEach((w, i) => { if (grpOf[i] === g) og.append(h("option", { value: i }, gl(i))); });
        s.append(og);
      });
      s.value = val; s.addEventListener("change", () => on(+s.value));
      return s;
    };
    const sSel = wordSelect(sel, v => { sel = v; draw(); });
    const nnBox = h("div");
    const boxCss = "flex:1 1 300px;min-width:0;border:1px solid var(--border);border-radius:10px;padding:.5rem .7rem;background:var(--card)";
    const pNN = h("div", { style: boxCss }, h("div", { style: "font-weight:600" }, "Legközelebbi szomszédok (50-D)"),
      h("div", { class: "controls", style: "margin:.3rem 0" }, small("szó:"), sSel), nnBox);
    /* analógia */
    const sB = wordSelect(AN[0], v => { AN[0] = v; draw(); }), sA = wordSelect(AN[1], v => { AN[1] = v; draw(); }), sC = wordSelect(AN[2], v => { AN[2] = v; draw(); });
    [sB, sA, sC].forEach(s => (s.style.maxWidth = "9.5rem"));
    const preBs = PRES.map(p => {
      const b = btn(`${p[0]} − ${p[1]} + ${p[2]}`, () => { AN = p.map(w => idx[w]); sB.value = AN[0]; sA.value = AN[1]; sC.value = AN[2]; draw(); });
      b.style.fontSize = ".8rem"; b.style.padding = ".12rem .45rem"; b.dataset.key = p.join("|");
      return b;
    });
    const cIn = checkbox(incl, () => { incl = cIn.checked; draw(); });
    const anBox = h("div");
    const pAN = h("div", { style: boxCss }, h("div", { style: "font-weight:600" }, "Analógia: b − a + c = ?"),
      h("div", { class: "controls", style: "margin:.3rem 0;gap:.3rem" }, sB, h("b", null, "−"), sA, h("b", null, "+"), sC),
      h("div", { class: "controls", style: "margin:.3rem 0;gap:.3rem" }, preBs),
      h("div", { class: "controls", style: "margin:.3rem 0" }, h("label", null, cIn, "a bemeneti szavak is lehetnek találatok")), anBox);
    root.append(h("div", { style: "display:flex;flex-wrap:wrap;gap:.7rem;margin-top:.4rem" }, pNN, pAN));
    /* hasonlóság */
    let SIM = [idx.cat, idx.dog];
    const s1 = wordSelect(SIM[0], v => { SIM[0] = v; simUpd(); }), s2 = wordSelect(SIM[1], v => { SIM[1] = v; simUpd(); });
    [s1, s2].forEach(s => (s.style.maxWidth = "10.5rem"));
    const simV = h("b", { style: "font-family:var(--mono);font-size:1.05rem" });
    const SP = [["cat", "dog"], ["cat", "car"], ["good", "bad"], ["bank", "river"], ["bank", "money"]].filter(p => p.every(w => w in idx));
    const spBs = SP.map(p => { const b = btn(p.join("–"), () => { SIM = p.map(w => idx[w]); s1.value = SIM[0]; s2.value = SIM[1]; simUpd(); }); b.style.fontSize = ".8rem"; b.style.padding = ".12rem .45rem"; return b; });
    const simBar = h("div", { style: "height:8px;border-radius:4px;background:var(--bg-soft);margin-top:.3rem;overflow:hidden" }, h("div", { style: "height:100%;width:0" }));
    root.append(h("div", { style: boxCss + ";margin-top:.7rem" }, h("div", { style: "font-weight:600" }, "Hasonlóság két szó között"),
      h("div", { class: "controls", style: "margin:.3rem 0;gap:.35rem" }, s1, h("span", null, "és"), s2, h("span", null, "→ cos ="), simV),
      simBar, h("div", { class: "controls", style: "margin:.4rem 0 0;gap:.3rem" }, small("próbáld:"), spBs)));
    root.append(h("p", { class: "muted", style: "font-size:.82rem;margin:.5rem 0 0" }, "Forrás: " + G.src + ". A magyar fordítás csak tájékoztató; a vektorok az angol szavakhoz tartoznak."));
    function simUpd() {
      const v = cosIJ(SIM[0], SIM[1]);
      simV.textContent = w1Fix(v, 3);
      simBar.firstChild.style.cssText = `height:100%;width:${clamp(v, 0, 1) * 100}%;background:${css("--accent")}`;
      spBs.forEach((b, k) => b.classList.toggle("on", SP[k].every((w, q) => idx[w] === SIM[q])));
    }

    const listHTML = (rows, hi = new Set(), mark = () => "") => h("table", { style: w1TblCss + ";width:100%" },
      rows.map(([j, c], r) => h("tr", null,
        h("td", { style: "padding:.15em .35em;color:var(--muted)" }, String(r + 1) + "."),
        h("td", { style: "padding:.15em .35em;font-weight:" + (hi.has(j) ? 700 : 500) }, typeof j === "number" ? G.words[j] : j, mark(j)),
        typeof j === "number" ? h("td", { style: "padding:.15em .35em;color:var(--muted);font-family:var(--font)" }, G.hu[j]) : null,
        h("td", { style: "padding:.15em .35em;width:38%" },
          h("div", { style: "display:flex;align-items:center;gap:.35rem" },
            h("div", { style: `height:8px;border-radius:4px;flex:none;width:${Math.max(2, clamp(c, 0, 1) * 70)}px;background:${css("--accent")}` }),
            w1Fix(c, 3))))));

    /* térkép */
    const xs = G.xy.map(p => p[0]), ys = G.xy.map(p => p[1]);
    const bx = [Math.min(...xs), Math.max(...xs)], by = [Math.min(...ys), Math.max(...ys)];
    let T = null;
    const mkT = () => {
      const pad = 16, s = Math.min((cv.w - 2 * pad) / (bx[1] - bx[0]), (cv.h - 2 * pad) / (by[1] - by[0]));
      const ox = (cv.w - s * (bx[1] - bx[0])) / 2, oy = (cv.h - s * (by[1] - by[0])) / 2;
      return { tx: x => ox + (x - bx[0]) * s, ty: y => cv.h - oy - (y - by[0]) * s };
    };
    function anInfo() {
      const [b, a, c] = AN, res = analogy(b, a, c, incl);
      const key = `${G.words[b]}-${G.words[a]}+${G.words[c]}`;
      return { b, a, c, res, key, glob: G.global && G.global[key] };
    }
    cv.draw = function () {
      const { ctx, w, h: hh } = cv;
      T = mkT();
      ctx.clearRect(0, 0, w, hh); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
      const P = i => [T.tx(G.xy[i][0]), T.ty(G.xy[i][1])];
      const A = anInfo(), top = A.res[0][0];
      const nbs = sel != null ? nn(sel).map(r => r[0]) : [];
      const acc = css("--accent"), cB = css("--setB"), cC = css("--setC"), mu = css("--muted"), tx_ = css("--text");
      /* szomszédvonalak */
      if (sel != null) nbs.forEach(j => polyline(ctx, { tx: x => x, ty: y => y }, [P(sel), P(j)], rgba(cC, 0.55), 1.2, [3, 3]));
      /* analógia-paralelogramma */
      const pa = P(A.a), pb = P(A.b), pc = P(A.c), pr = P(top);
      const tgt = [pb[0] - pa[0] + pc[0], pb[1] - pa[1] + pc[1]];      // a PCA lineáris: b − a + c vetülete = vetületek kombinációja
      polyline(ctx, { tx: x => x, ty: y => y }, [pa, pc], rgba(mu, 0.6), 1.2, [4, 4]);
      polyline(ctx, { tx: x => x, ty: y => y }, [pb, tgt], rgba(mu, 0.6), 1.2, [4, 4]);
      arrow(ctx, pa[0], pa[1], pb[0], pb[1], cB, 2.2);
      arrow(ctx, pc[0], pc[1], tgt[0], tgt[1], rgba(cB, 0.75), 2);
      ring(ctx, tgt[0], tgt[1], 6, cB, 1.6, [2, 2]);
      /* pontok */
      for (let i = 0; i < N; i++) {
        const [x, y] = P(i), inG = grpOf[i] === grp;
        dot(ctx, x, y, inG ? 4.2 : 2.8, inG ? acc : rgba(mu, 0.45));
      }
      nbs.forEach(j => dot(ctx, ...P(j), 4.4, cC));
      [A.a, A.b, A.c].forEach(j => dot(ctx, ...P(j), 4.8, cB));
      dot(ctx, pr[0], pr[1], 5.2, cB); ring(ctx, pr[0], pr[1], 8, cB, 1.5);
      if (sel != null) { dot(ctx, ...P(sel), 5.5, cC); ring(ctx, ...P(sel), 9, cC, 2); }
      if (hov != null) ring(ctx, ...P(hov), 8, tx_, 1.5);
      /* címkék, fontossági sorrendben */
      const Lb = w1Labeler(ctx, w, hh), done = new Set([A.a, A.b, A.c, top, sel, hov]);
      const F = w1Font(w < 500 ? 11 : 12, 600), Fs = w1Font(w < 500 ? 10 : 11, 500);
      if (hov != null) Lb.put(gl(hov), ...P(hov), tx_, w1Font(12, 700), true);
      if (sel != null) Lb.put(G.words[sel], ...P(sel), cC, w1Font(12, 700), true);
      [[A.b, "b"], [A.a, "a"], [A.c, "c"]].forEach(([j, r]) => Lb.put(`${r}: ${G.words[j]}`, ...P(j), cB, F, true));
      Lb.put(`→ ${G.words[top]}`, pr[0], pr[1], cB, w1Font(12, 700), true);
      Lb.put("b − a + c", tgt[0], tgt[1], rgba(cB, 0.9), Fs);
      nbs.forEach(j => { if (!done.has(j)) { done.add(j); Lb.put(G.words[j], ...P(j), cC, Fs); } });
      for (let i = 0; i < N; i++) if (grpOf[i] === grp && !done.has(i)) Lb.put(G.words[i], ...P(i), acc, Fs);
      if (grp >= 0) label(ctx, GROUPS[grp][0], w - 8, hh - 6, rgba(acc, 0.85), "right", w1Font(12, 700));
      panels(A);
    };
    function panels(A) {
      gG.paint();
      /* hover-sor */
      hovOut.innerHTML = hov != null
        ? `<b>${G.words[hov]}</b> – ${G.hu[hov]} <span class="muted">(${grpOf[hov] >= 0 ? GROUPS[grpOf[hov]][0] : ""})</span>`
        : `<span class="muted">Mutass egy pontra (vagy koppints rá): megjelenik a szó és a jelentése.</span>`;
      /* szomszédok */
      sSel.value = sel;
      nnBox.replaceChildren(sel == null ? small("Kattints egy szóra a térképen.") :
        h("div", null, h("div", { style: "font-size:.9rem;margin:.2rem 0" }, h("b", null, G.words[sel]), ` (${G.hu[sel]}) – a 182 szó közül:`), listHTML(nn(sel))));
      /* analógia */
      preBs.forEach(b => b.classList.toggle("on", b.dataset.key === [A.b, A.a, A.c].map(i => G.words[i]).join("|")));
      const kids = [h("div", { style: "font-size:.9rem;margin:.2rem 0" }, `${G.words[A.b]} − ${G.words[A.a]} + ${G.words[A.c]} → top 5 a 182 szó között:`),
        listHTML(A.res, new Set([A.res[0][0]]), j => ([A.a, A.b, A.c].includes(j) ? h("span", { class: "muted", style: "font-weight:400" }, " (bemenet)") : ""))];
      if (A.glob) {
        const g = incl ? A.glob.incl : A.glob.excl;
        kids.push(h("div", { style: "font-size:.9rem;margin:.5rem 0 .2rem" }, "…és a teljes, 400 000 szavas szótárban (előre kiszámolva):"),
          listHTML(g, new Set([g[0][0]])));
      }
      const top = G.words[A.res[0][0]], wa = G.words[A.a], wc = G.words[A.c];
      if (OCC.has(G.words[A.b]) && new Set([wa, wc]).size === 2 && ["man", "woman"].includes(wa) && ["man", "woman"].includes(wc)) {
        kids.push(h("div", { style: "margin-top:.5rem;padding:.4rem .6rem;border-left:3px solid var(--bad);background:var(--bad-soft);border-radius:6px;font-size:.9rem" },
          h("b", null, "Torzítás: "), `${G.words[A.b]} − ${wa} + ${wc} → ${top}` +
          (A.glob && A.glob.excl[0][0] !== top ? ` (a teljes szótárban: ${A.glob.excl[0][0]})` : "") +
          ". Ez az adatban lévő torzítás, nem igazság: a vektorok azt tükrözik, milyen szövegkörnyezetben fordultak elő a szavak a tanítószövegben."));
      }
      if (incl && [A.a, A.b, A.c].includes(A.res[0][0])) kids.push(h("p", { class: "muted", style: "font-size:.85rem;margin:.4rem 0 0" },
        "Ha a bemeneti szavak is lehetnek találatok, gyakran maga b nyer: b − a + c még mindig nagyon közel van b-hez. Ezért szokás kizárni őket."));
      anBox.replaceChildren(...kids);
      simUpd();
    }
    const draw = () => cv.draw();
    const pick = e => {
      if (!T) return null;
      const [mx, my] = evXY(cv, e);
      let bi = null, bd = 14 * 14;
      for (let i = 0; i < N; i++) {
        const d = (T.tx(G.xy[i][0]) - mx) ** 2 + (T.ty(G.xy[i][1]) - my) ** 2;
        if (d < bd) { bd = d; bi = i; }
      }
      return bi;
    };
    cv.c.style.cursor = "pointer";
    cv.c.addEventListener("pointermove", e => { const p = pick(e); if (p !== hov) { hov = p; draw(); } });
    cv.c.addEventListener("pointerleave", () => { if (hov != null) { hov = null; draw(); } });
    cv.c.addEventListener("click", e => { const p = pick(e); if (p != null) { sel = p; hov = p; draw(); } });
    w1OnTheme(() => panels(anInfo()));
    draw();
  };

  /* ------------------------------------------------------------------
     3. Kitekert RNN egyetlen számmal (12.3-b/c)
     ------------------------------------------------------------------ */
  W["rnn-unroll"] = root => {
    header(root, "Egy rekurrens háló kitekerve",
      "A legegyszerűbb RNN: a rejtett állapot egyetlen szám, $h_t = \\tanh(w\\,h_{t-1} + u\\,x_t)$, $h_0 = 0$. " +
      "Minden szónak fix pontszáma van ($x_t$). Rakj össze egy mondatot, és nézd, mi marad meg belőle a végére.");
    const SCORE = { "jó": 1, "remek": 1, "izgalmas": 1, "szép": 1, "rossz": -1, "unalmas": -1, "gyenge": -1, "zavaros": -1 };
    const PAL = ["jó", "remek", "izgalmas", "szép", "rossz", "unalmas", "gyenge", "zavaros", "a", "film", "vége", "volt", "de", "és", "nem", ",", "…"];
    const xOf = t => SCORE[t] || 0;
    let toks = ["jó", "de", "unalmas"], pre = "jdu", w = 0.5, u = 1, k = 2;
    const PRE = { jdu: () => ["jó", "de", "unalmas"], udj: () => ["unalmas", "de", "jó"], csend: () => ["jó"].concat(Array(k).fill("…")) };
    const gP = toggleGroup([["jdu", "jó , de unalmas"], ["udj", "unalmas , de jó"], ["csend", "jó, aztán csend"]], () => pre, key => { pre = key; toks = PRE[key](); upd(); });
    const sK = slider(0, 15, 1, k), kV = h("b", { style: "font-family:var(--mono)" });
    sK.addEventListener("input", () => { k = +sK.value; pre = "csend"; toks = PRE.csend(); upd(); });
    root.append(h("div", { class: "controls" }, small("minta:"), gP.bs, h("label", null, "csend hossza k:", sK, kV)));
    const chip = t => {
      const x = xOf(t), cls = x > 0 ? "chip b" : x < 0 ? "chip a" : "chip";
      const b = h("button", { class: cls, type: "button", style: "cursor:pointer;font:inherit;font-size:.88rem;color:var(--text)", title: `x = ${x > 0 ? "+1" : x < 0 ? "−1" : "0"}` }, t);
      b.addEventListener("click", () => { if (toks.length < 24) { toks.push(t); pre = null; upd(); } });
      return b;
    };
    root.append(h("div", { class: "controls", style: "gap:.3rem" }, small("szó hozzáfűzése:"), PAL.map(chip),
      btn("utolsó törlése", () => { toks.pop(); pre = null; upd(); }), btn("törlés", () => { toks = []; pre = null; upd(); })));
    root.append(h("p", { class: "muted", style: "font-size:.85rem;margin:.2rem 0" },
      "Pozitív szavak: x = +1 (narancs), negatívak: x = −1 (kék), minden más 0 – a „nem” is. Egyetlen szám nem tudja megjegyezni, " +
      "hogy a következő szó előjelét meg kell fordítani; ehhez nagyobb rejtett állapot (vektor) kell."));
    const sW = slider(-2, 2, 0.05, w), sU = slider(0, 3, 0.1, u), wV = h("b", { style: "font-family:var(--mono)" }), uV = h("b", { style: "font-family:var(--mono)" });
    sW.addEventListener("input", () => { w = +sW.value; upd(); });
    sU.addEventListener("input", () => { u = +sU.value; upd(); });
    root.append(h("div", { class: "controls" }, h("label", null, "visszacsatolás w:", sW, wV), h("label", null, "bemeneti súly u:", sU, uV),
      btn("alap (0,5; 1)", () => { w = 0.5; u = 1; sW.value = w; sU.value = u; upd(); })));

    const chainWrap = h("div", { style: "margin-top:.4rem" });
    root.append(chainWrap);
    const CW = 66, CH = 150;
    const perRow = wd => Math.max(1, Math.floor((wd - 10) / CW));
    const cvC = w1Canvas(chainWrap, wd => Math.max(1, Math.ceil(Math.max(1, toks.length) / perRow(wd))) * CH + 6);
    const [cvP, cvG] = twoCanvas(root, 0.62, flatAspect(root, 0.62, 0.7));
    const out = h("div", { class: "readout", style: "font-family:var(--font);line-height:1.5" });
    root.append(out);

    const run = () => { let hp = 0; return toks.map(t => (hp = Math.tanh(w * hp + u * xOf(t)))); };
    cvC.draw = () => {
      cvC.resize();
      const { ctx, w: wd, h: hh } = cvC, H = run(), n = toks.length, pr = perRow(wd);
      ctx.clearRect(0, 0, wd, hh); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, wd, hh);
      const mu = css("--muted"), tx = css("--text"), cA = css("--setA"), cB = css("--setB");
      if (!n) { label(ctx, "Üres mondat – fűzz hozzá szavakat!", wd / 2, hh / 2, mu, "center", w1Font(13, 500), "middle"); return; }
      const cols = Math.min(pr, n), x0 = Math.max(4, (wd - cols * CW) / 2);
      for (let t = 0; t < n; t++) {
        const r = Math.floor(t / pr), c = t % pr, X = x0 + c * CW, Y = r * CH + 4;
        const bx = X + 14, bw = CW - 22, by = Y + 40, bh = 76, mid = by + bh / 2, x = xOf(toks[t]), hv = H[t];
        label(ctx, toks[t], X + CW / 2 + 4, Y + 16, tx, "center", w1Font(13, 700));
        label(ctx, `x=${x > 0 ? "+1" : x < 0 ? "−1" : "0"}`, X + CW / 2 + 4, Y + 33, x > 0 ? cB : x < 0 ? cA : mu, "center", w1Font(11, 600));
        ctx.save(); ctx.fillStyle = css("--bg-soft"); ctx.strokeStyle = css("--border"); ctx.lineWidth = 1;
        ctx.fillRect(bx, by, bw, bh); ctx.strokeRect(bx + 0.5, by + 0.5, bw - 1, bh - 1);
        ctx.strokeStyle = rgba(mu, 0.5); ctx.beginPath(); ctx.moveTo(bx, mid); ctx.lineTo(bx + bw, mid); ctx.stroke();
        const bh2 = Math.abs(hv) * (bh / 2 - 3);
        ctx.fillStyle = hv >= 0 ? cB : cA;
        if (hv >= 0) ctx.fillRect(bx + bw * 0.25, mid - bh2, bw * 0.5, bh2); else ctx.fillRect(bx + bw * 0.25, mid, bw * 0.5, bh2);
        ctx.restore();
        label(ctx, `h${w1Sub(t + 1)}`, bx + 3, by + 12, mu, "left", w1Font(10, 600));
        label(ctx, w1Fix(hv, 3), X + CW / 2 + 4, by + bh + 17, tx, "center", "600 12px " + css("--mono") + ", monospace");
        /* nyíl az előző állapotból */
        if (c === 0) {
          if (t === 0) { label(ctx, "h₀=0", X + 6, mid - 6, mu, "center", w1Font(9, 600)); arrow(ctx, X + 1, mid, bx - 1, mid, mu, 1.4); }
          else arrow(ctx, X - 4, mid, bx - 1, mid, mu, 1.4);
        } else arrow(ctx, X - 8 + 0, mid, bx - 1, mid, mu, 1.4);
        if (c === pr - 1 && t < n - 1) arrow(ctx, bx + bw + 1, mid, Math.min(wd - 1, bx + bw + 9), mid, mu, 1.4);
      }
    };
    cvP.draw = () => {
      const H = run(), n = toks.length;
      const view = { xmin: -0.4, xmax: Math.max(3, n) + 0.4, ymin: -1.15, ymax: 1.15, xname: "t", yname: "hₜ", ystep: 0.5, xstep: n > 12 ? 2 : 1 };
      const pts = [[0, 0]].concat(H.map((v, i) => [i + 1, v]));
      const layers = [{ hline: 1, color: css("--border"), dash: [3, 3] }, { hline: -1, color: css("--border"), dash: [3, 3] }];
      for (let i = 1; i < pts.length; i++) layers.push({ seg: [pts[i - 1], pts[i]], color: "--accent", width: 2 });
      layers.push({ points: pts.filter(p => p[1] >= 0), color: "--setB", r: 4 }, { points: pts.filter(p => p[1] < 0), color: "--setA", r: 4 });
      Calc.plot(cvP, view, layers);
      label(cvP.ctx, "a rejtett állapot időben", cvP.w - 6, cvP.h - 6, css("--muted"), "right", w1Font(11, 600));
    };
    /* ∂h_T/∂h_t = Π_{s=t+1..T} w(1 − h_s²) */
    const grads = H => { const n = H.length, g = new Array(n).fill(1); for (let t = n - 2; t >= 0; t--) g[t] = g[t + 1] * w * (1 - H[t + 1] ** 2); return g; };
    cvG.draw = () => {
      const { ctx, w: wd, h: hh } = cvG, H = run(), n = H.length, g = grads(H);
      ctx.clearRect(0, 0, wd, hh); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, wd, hh);
      const mu = css("--muted"), tx = css("--text");
      const L = 34, Rr = 8, Tp = 24, B = 26, E = 12;          // 10⁰ … 10⁻¹²
      const yOf = v => Tp + (hh - Tp - B) * clamp(-Math.log10(Math.max(v, 1e-300)), 0, E) / E;
      label(ctx, "|∂h_T / ∂h_t| (log skála)", L, 15, tx, "left", w1Font(12, 700));
      ctx.save(); ctx.strokeStyle = css("--border"); ctx.lineWidth = 1; ctx.font = w1Font(10, 500); ctx.fillStyle = mu; ctx.textAlign = "right"; ctx.textBaseline = "middle";
      for (let e = 0; e <= E; e += 3) { const y = yOf(Math.pow(10, -e)); ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(wd - Rr, y); ctx.stroke(); ctx.fillText(e ? "10" + w1Sup(-e) : "1", L - 4, y); }
      ctx.restore();
      if (!n) return;
      const bw = (wd - L - Rr) / n;
      for (let t = 0; t < n; t++) {
        const v = Math.abs(g[t]), x = L + t * bw, y = yOf(v), bound = Math.pow(Math.abs(w), n - 1 - t);
        ctx.fillStyle = rgba(g[t] >= 0 ? css("--accent") : css("--bad"), 0.75);
        ctx.fillRect(x + bw * 0.15, y, bw * 0.7, hh - B - y);
        if (n - 1 - t > 0 && Math.abs(w) <= 1) polyline(ctx, { tx: q => q, ty: q => q }, [[x + bw * 0.08, yOf(bound)], [x + bw * 0.92, yOf(bound)]], css("--setB"), 2);
        if (n <= 16 || t % 2 === (n - 1) % 2) label(ctx, String(t + 1), x + bw / 2, hh - 8, mu, "center", w1Font(10, 500));
      }
      label(ctx, "t", wd - 2, hh - 8, mu, "right", w1Font(10, 600));
      label(ctx, "— felső korlát |w|^(T−t)", wd - Rr, 15, css("--setB"), "right", w1Font(10, 600));
    };
    function upd() {
      gP.paint();
      wV.textContent = fmt(w, 2); uV.textContent = fmt(u, 1); kV.textContent = String(k); sK.value = k;
      setDis(sK, pre !== "csend");
      cvC.draw(); cvP.draw(); cvG.draw();
      const H = run(), n = H.length, g = grads(H);
      if (!n) { out.innerHTML = "Üres a mondat."; return; }
      const L = [];
      L.push(`Végállapot: h${w1Sub(n)} = <b>${w1Fix(H[n - 1], 4)}</b> → ${H[n - 1] > 0.05 ? "pozitív" : H[n - 1] < -0.05 ? "negatív" : "semleges"} vélemény. ` +
        `(Állapotok: ${H.map(v => w1Fix(v, 4)).join("; ")}.)`);
      if (pre === "jdu" || pre === "udj") L.push("Ugyanazok a szavak, más sorrendben – más végeredmény: a sorrend számít, és a <b>későbbi</b> szónak nagyobb a súlya, mert a korábbiak hatása lépésenként w-szeresére (és a tanh miatt még tovább) zsugorodik.");
      const bound = d => (Math.abs(w) <= 1 ? ` (felső korlát: |w|${w1Sup(d)} = ${fmt(Math.abs(w), 2)}${w1Sup(d)} = ${w1Tiny(Math.pow(Math.abs(w), d))})` : "");
      if (n >= 11) L.push(`A 10 lépéssel korábbi bemenet hatása: × <b>${w1Tiny(g[n - 11])}</b>${bound(10)}.`);
      if (n >= 2 && n !== 11) L.push(`Az első szó („${toks[0]}”, ${n - 1} lépéssel korábban) hatása a végállapotra: × <b>${w1Tiny(g[0])}</b>${bound(n - 1)}.`);
      L.push(Math.abs(w) < 1 ? "Mivel |w| &lt; 1 és tanh′ ≤ 1, a szorzó lépésenként legalább |w|-szeresére csökken: a régi bemenetek hatása exponenciálisan eltűnik (<b>eltűnő gradiens</b>)."
        : Math.abs(w) > 1 ? "|w| > 1: a szorzó elvben nőhet, de a tanh telítődik (h ≈ ±1 → 1 − h² ≈ 0), így az állapot „beragad” – ez sem jó emlékezet."
          : "|w| = 1: határeset; a tanh deriváltja (1 − h²) itt is csökkenti a szorzót.");
      out.innerHTML = L.join("<br>");
    }
    upd();
  };

  /* ------------------------------------------------------------------
     4. Puha keresés: kulcsok, értékek, lekérdezés (12.4-b)
     ------------------------------------------------------------------ */
  W["soft-lookup"] = root => {
    header(root, "Puha keresés egy kis „szótárban”",
      "Három kulcs (pont) és hozzájuk tartozó érték. A lekérdezés (q) minden kulccsal pontszámot kap ($q\\cdot k_i$), a softmax ebből súlyt csinál, " +
      "a kimenet az értékek súlyozott átlaga. <b>Húzd a q-t</b> (vagy a kulcsokat), és állítsd az élességet.");
    const K0 = [[2, 0], [0, 2], [1, 1]], V = [10, 20, 30], KN = ["k₁", "k₂", "k₃"], KC = ["--setA", "--setC", "--setB"];
    let K = K0.map(k => k.slice()), q = [1, 0], beta = 1, drag = null, act = "q10";
    const sBe = slider(0, 5, 0.1, beta), bV = h("b", { style: "font-family:var(--mono)" });
    sBe.addEventListener("input", () => { beta = +sBe.value; act = null; upd(); });
    const PR = [["q10", "q = (1; 0)", [1, 0], 1], ["q30", "q = (3; 0)", [3, 0], 1], ["b3", "β = 3", [1, 0], 3], ["q00", "q = (0; 0)", [0, 0], 1]];
    const gPr = toggleGroup(PR.map(p => [p[0], p[1]]), () => act, key => {
      const p = PR.find(r => r[0] === key); act = key; q = p[2].slice(); beta = p[3]; sBe.value = beta; K = K0.map(k => k.slice()); upd();
    });
    root.append(h("div", { class: "controls" }, h("label", null, "élesség β:", sBe, bV), small("minta:"), gPr.bs));
    const wrap = h("div", { class: "two-canvas" }), Lw = h("div", { style: "min-width:0" }), Rw = h("div", { style: "min-width:0" });
    wrap.append(Lw, Rw); root.append(wrap);
    const cv = Calc.canvas(Lw, 0.9, 420);
    const tbl = h("div", { class: "tw", style: "overflow-x:auto" }), stats = h("div", { class: "stat-row" });
    Rw.append(tbl, stats);
    const out = h("div", { class: "readout", style: "font-family:var(--font);line-height:1.5" });
    root.append(out);
    const calc = () => {
      const raw = K.map(k => q[0] * k[0] + q[1] * k[1]), s = raw.map(v => beta * v), a = softmax(s);
      const o = a.reduce((acc, ai, i) => acc + ai * V[i], 0), hard = argmax(raw);
      const tie = raw.filter(v => Math.abs(v - raw[hard]) < 1e-9).length > 1;
      return { raw, s, a, o, hard, tie };
    };
    const P = v => `(${fmt(v[0], 1)}; ${fmt(v[1], 1)})`;
    let view = null, T = null;
    cv.draw = () => {
      view = eqView(cv, 1, 1, 2.4, 2.0, { xname: "", yname: "", xstep: 1, ystep: 1 });
      T = Calc.plot(cv, view, []);
      const { ctx } = cv, R = calc(), acc = css("--accent");
      K.forEach((k, i) => {
        const x = T.tx(k[0]), y = T.ty(k[1]), col = css(KC[i]), r = 7 + 30 * R.a[i];
        ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.fillStyle = rgba(col, 0.18); ctx.fill(); ctx.restore();
        ring(ctx, x, y, r, rgba(col, 0.7), 1.2);
        dot(ctx, x, y, 6, col);
        const right = x < cv.w - 90;
        label(ctx, `${KN[i]} → ${V[i]}`, right ? x + 10 : x - 10, y - 8, col, right ? "left" : "right", w1Font(13, 700));
        label(ctx, `a = ${w1Fix(R.a[i], 3)}`, right ? x + 10 : x - 10, y + 8, css("--muted"), right ? "left" : "right", w1Font(11, 600), "top");
      });
      arrow(ctx, T.tx(0), T.ty(0), T.tx(q[0]), T.ty(q[1]), acc, 2.6);
      dot(ctx, T.tx(q[0]), T.ty(q[1]), 6, acc, true, 2.5);
      label(ctx, `q = ${P(q)}`, T.tx(q[0]) + 8, T.ty(q[1]) - 8, acc, "left", w1Font(13, 700));
    };
    const toW = e => { const [mx, my] = evXY(cv, e); return [T.ix(mx), T.iy(my)]; };
    const snap = v => Math.round(v * 10) / 10;
    cv.c.addEventListener("pointerdown", e => {
      if (!T) return;
      const [mx, my] = evXY(cv, e);
      const cand = [["q", q]].concat(K.map((k, i) => [i, k]));
      let best = null, bd = 22 * 22;
      cand.forEach(([id, p]) => { const d = (T.tx(p[0]) - mx) ** 2 + (T.ty(p[1]) - my) ** 2; if (d < bd) { bd = d; best = id; } });
      if (best == null) { best = "q"; }
      drag = best; cv.c.setPointerCapture(e.pointerId); move(e);
    });
    const move = e => {
      if (drag == null) return;
      const [x, y] = toW(e), p = [snap(clamp(x, view.xmin + 0.1, view.xmax - 0.1)), snap(clamp(y, view.ymin + 0.1, view.ymax - 0.1))];
      if (drag === "q") q = p; else K[drag] = p;
      act = null; upd();
    };
    cv.c.addEventListener("pointermove", move);
    const end = () => { drag = null; };
    cv.c.addEventListener("pointerup", end); cv.c.addEventListener("pointercancel", end);
    const reset = btn("alaphelyzet", () => { K = K0.map(k => k.slice()); q = [1, 0]; beta = 1; sBe.value = 1; act = "q10"; upd(); });
    root.querySelector(".controls").append(reset);

    function upd() {
      gPr.paint(); bV.textContent = fmt(beta, 1);
      cv.draw();
      const R = calc(), td = (t, x = "") => h("td", { style: w1Cell + ";" + x }, t), th = t => h("th", { style: w1Cell }, t);
      tbl.replaceChildren(h("table", { style: w1TblCss + ";width:100%" },
        h("tr", null, th("kulcs"), th("vᵢ"), th(beta === 1 ? "q·kᵢ" : "β·(q·kᵢ)"), th("súly aᵢ"), th("aᵢ·vᵢ")),
        K.map((k, i) => h("tr", null,
          td(h("span", null, h("b", { style: `color:${css(KC[i])}` }, KN[i]), " " + P(k)), "text-align:left"),
          td(String(V[i])), td(fmt(R.s[i], 2)),
          td(h("div", { style: "display:flex;align-items:center;gap:.3rem" },
            h("div", { style: `height:9px;border-radius:4px;flex:none;width:${Math.max(1, R.a[i] * 56)}px;background:${css(KC[i])}` }), w1Fix(R.a[i], 3))),
          td(w1Fix(R.a[i] * V[i], 2)))),
        h("tr", { style: "border-top:2px solid var(--muted)" }, td("kimenet", "text-align:left;font-weight:700"), td(""), td(""), td("Σ = 1", "color:var(--muted)"),
          td(w1Fix(R.o, 2), `font-weight:700;background:${mix("--accent", 0.25)}`))));
      stats.replaceChildren(
        h("div", { class: "stat" }, h("div", { class: "v", style: "color:var(--accent)" }, w1Fix(R.o, 2)), h("div", { class: "l" }, "puha keresés (Σ aᵢvᵢ)")),
        h("div", { class: "stat" }, h("div", { class: "v" }, String(V[R.hard])), h("div", { class: "l" }, `kemény keresés (${KN[R.hard]}${R.tie ? ", döntetlen" : ""})`)));
      const L = [];
      L.push(`<b>Puha:</b> mindhárom érték beleszámít a súlyával: ${R.a.map((a, i) => `${w1Fix(a, 3)}·${V[i]}`).join(" + ")} = <b>${w1Fix(R.o, 2)}</b>. ` +
        `<b>Kemény:</b> csak a legnagyobb pontszámú kulcs (${KN[R.hard]}) értéke számít: <b>${V[R.hard]}</b>.`);
      const amax = Math.max(...R.a), amin = Math.min(...R.a);
      if (amax - amin < 0.01) L.push("Minden súly ≈ 1/3: a lekérdezés semmit sem „kérdez” (q = 0 vagy β = 0), a kimenet az értékek sima átlaga, 20.");
      else if (amax > 0.9) L.push(`A súly szinte teljesen ${KN[argmax(R.a)]}-re esik: ilyenkor a puha keresés gyakorlatilag kemény. Ezt nagyobb β vagy hosszabb q éri el.`);
      else L.push("A softmax a különbségeket erősíti, de nem dönt élesen: β növelésével (vagy q nyújtásával) a puha eredmény a kemény felé tart, β → 0 esetén az átlag felé.");
      L.push("A puha változat előnye: a kimenet folytonosan függ q-tól és a kulcsoktól, ezért gradienssel tanítható.");
      out.innerHTML = L.join("<br>");
    }
    w1OnTheme(upd);
    upd();
  };

  /* ------------------------------------------------------------------
     Indítás (a calc.js-t és az ml.js-t is defer-rel töltjük, ezért DOMContentLoaded után)
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
