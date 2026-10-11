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

  /* ==================================================================
     w2 – figyelem a fordításban, Q–K–V kézzel, pozíciókódolás, huBERT
     ================================================================== */

  /* ------------------------------------------------------------------
     w2Heat – újrahasznosítható hőtérkép (canvas)
       o = { data: [[v|null]], rowLabels, colLabels, rowStyle(i), colStyle(j) → {color, bold},
             scale: v → [colVar, t]  (alap: --accent, t = (v − lo)/(hi − lo)),  range: [lo, hi],
             digits, showVals (true), minCell, maxCell, cellH (szám vagy cell → szám), maxW,
             selRow, markRowMax, onHover(r, c) / onHover(null), onClick(r, c) }
     ------------------------------------------------------------------ */
  function w2Heat(parent, o) {
    const wrap = h("div", { style: "overflow-x:auto;max-width:100%;margin:.4rem 0" });
    const c = h("canvas", { style: "display:block;touch-action:manipulation" });
    wrap.append(c); parent.append(wrap);
    const ctx = c.getContext("2d");
    const st = Object.assign({ digits: 2, showVals: true, minCell: 4, maxCell: 56, maxW: 760, range: [0, 1], markRowMax: false }, o);
    let G = null, hov = null;
    const FONT = "11px system-ui, sans-serif", FONTB = "600 11px system-ui, sans-serif";
    const tOf = v => {
      if (st.scale) return st.scale(v);
      const [lo, hi] = st.range;
      return ["--accent", clamp((v - lo) / ((hi - lo) || 1), 0, 1)];
    };
    function layout() {
      const R = st.data.length, C = R ? st.data[0].length : 0;
      const avail = Math.min(st.maxW, Math.max(220, parent.clientWidth || 600));
      ctx.font = FONTB;
      const rl = st.rowLabels || [], cl = st.colLabels || [];
      const lw = rl.length ? Math.ceil(Math.max(...rl.map(s => ctx.measureText(s).width))) + 8 : 2;
      const cw = cl.length ? Math.ceil(Math.max(...cl.map(s => ctx.measureText(s).width))) : 0;
      let cell = Math.floor(clamp((avail - lw - 4 - (cl.length ? Math.min(cw * 0.5, 40) : 0)) / Math.max(1, C), st.minCell, st.maxCell));
      const cellH = Math.max(3, Math.round(typeof st.cellH === "function" ? st.cellH(cell) : (st.cellH || cell)));
      const rot = cl.length && cw + 6 > cell;
      const top = !cl.length ? 3 : rot ? Math.ceil(cw * 0.87) + 10 : 18;
      const padR = rot ? Math.ceil(cw * 0.5) + 4 : 4;
      const kc = !cl.length ? 1 : rot ? Math.max(1, Math.ceil(13 / (cell * 0.87))) : Math.max(1, Math.ceil((cw + 6) / cell));
      const kr = Math.max(1, Math.ceil(13 / cellH));
      G = { R, C, lw, cell, cellH, rot, top, padR, kc, kr, W: lw + C * cell + padR, H: top + R * cellH + 3 };
    }
    function draw() {
      if (!G) layout();
      const dpr = window.devicePixelRatio || 1, { R, C, lw, cell, cellH, top } = G;
      c.width = Math.round(G.W * dpr); c.height = Math.round(G.H * dpr);
      c.style.width = G.W + "px"; c.style.height = G.H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, G.W, G.H);
      const txt = css("--text"), mut = css("--muted"), brd = css("--border"), soft = css("--bg-soft");
      const showV = st.showVals && cell >= 34 && cellH >= 18;
      for (let r = 0; r < R; r++) {
        let mx = -1;
        if (st.markRowMax) st.data[r].forEach((v, j) => { if (v != null && (mx < 0 || v > st.data[r][mx])) mx = j; });
        for (let j = 0; j < C; j++) {
          const v = st.data[r][j], x = lw + j * cell, y = top + r * cellH;
          if (v == null) {
            ctx.fillStyle = soft; ctx.fillRect(x, y, cell, cellH);
            ctx.save(); ctx.beginPath(); ctx.rect(x, y, cell, cellH); ctx.clip();
            ctx.strokeStyle = brd; ctx.lineWidth = 1;
            for (let k = -cellH; k < cell; k += 6) { ctx.beginPath(); ctx.moveTo(x + k, y + cellH); ctx.lineTo(x + k + cellH, y); ctx.stroke(); }
            ctx.restore();
            continue;
          }
          const [cv, t] = tOf(v);
          ctx.fillStyle = mix(cv, t); ctx.fillRect(x, y, cell, cellH);
          if (showV) label(ctx, st.fmtVal ? st.fmtVal(v) : fmt(v, st.digits), x + cell / 2, y + cellH / 2, ink(t), "center", "11px system-ui, sans-serif", "middle");
          if (j === mx) { ctx.save(); ctx.strokeStyle = txt; ctx.lineWidth = 1.6; ctx.strokeRect(x + 1.5, y + 1.5, cell - 3, cellH - 3); ctx.restore(); }
        }
      }
      if (cell >= 10 && cellH >= 10) {               // vékony rács
        ctx.strokeStyle = css("--card"); ctx.lineWidth = 1; ctx.beginPath();
        for (let j = 1; j < C; j++) { ctx.moveTo(lw + j * cell + 0.5, top); ctx.lineTo(lw + j * cell + 0.5, top + R * cellH); }
        for (let r = 1; r < R; r++) { ctx.moveTo(lw, top + r * cellH + 0.5); ctx.lineTo(lw + C * cell, top + r * cellH + 0.5); }
        ctx.stroke();
      }
      if (st.selRow != null && st.selRow >= 0 && st.selRow < R) {
        ctx.save(); ctx.strokeStyle = css("--accent"); ctx.lineWidth = 2.2;
        ctx.strokeRect(lw - 1, top + st.selRow * cellH - 1, C * cell + 2, cellH + 2); ctx.restore();
      }
      if (hov) {
        ctx.save(); ctx.strokeStyle = txt; ctx.lineWidth = 2;
        ctx.strokeRect(lw + hov[1] * cell + 1, top + hov[0] * cellH + 1, cell - 2, cellH - 2); ctx.restore();
      }
      // feliratok
      const rl = st.rowLabels || [], cl = st.colLabels || [];
      rl.forEach((s, r) => {
        const on = hov && hov[0] === r;
        if (r % G.kr && !on) return;
        const sty = (st.rowStyle && st.rowStyle(r)) || {};
        label(ctx, s, lw - 5, top + r * cellH + cellH / 2, on ? css("--accent") : (sty.color || txt), "right", sty.bold || on ? FONTB : FONT, "middle");
      });
      cl.forEach((s, j) => {
        const on = hov && hov[1] === j;
        if (j % G.kc && !on) return;
        const sty = (st.colStyle && st.colStyle(j)) || {};
        const col = on ? css("--accent") : (sty.color || txt), f = sty.bold || on ? FONTB : FONT, x = lw + j * cell + cell / 2;
        if (G.rot) {
          ctx.save(); ctx.translate(x + 2, top - 5); ctx.rotate(-Math.PI / 3);
          label(ctx, s, 0, 0, col, "left", f, "middle"); ctx.restore();
        } else label(ctx, s, x, top - 4, col, "center", f, "bottom");
      });
      void mut;
    }
    const hit = e => {
      const r0 = c.getBoundingClientRect(), x = e.clientX - r0.left, y = e.clientY - r0.top;
      const j = Math.floor((x - G.lw) / G.cell), r = Math.floor((y - G.top) / G.cellH);
      return r >= 0 && r < G.R && j >= 0 && j < G.C ? [r, j] : null;
    };
    const move = e => {
      const p = hit(e);
      if (String(p) === String(hov)) return;
      hov = p; draw(); st.onHover && st.onHover(p ? p[0] : null, p ? p[1] : null);
    };
    c.addEventListener("pointermove", move);
    c.addEventListener("pointerdown", move);
    c.addEventListener("pointerleave", e => { if (e.pointerType === "mouse" && hov) { hov = null; draw(); st.onHover && st.onHover(null, null); } });
    c.addEventListener("click", e => { const p = hit(e); if (p && st.onClick) st.onClick(p[0], p[1]); });
    const redraw = () => { layout(); draw(); };
    let rt;
    addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(redraw, 160); });
    new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return {
      set(p) { Object.assign(st, p); if (hov && (hov[0] >= st.data.length || hov[1] >= (st.data[0] || []).length)) hov = null; redraw(); },
      get hover() { return hov; },
      redraw
    };
  }

  /* kis segédek */
  const w2Note = (html, extra = "") => h("p", { class: "muted", style: "font-size:.88rem;margin:.5rem 0 0" + extra, html });
  const w2Src = txt => h("p", { class: "muted", style: "font-size:.8rem;margin:.5rem 0 0" }, "Forrás: " + txt);
  const w2Sel = (opts, val, onch) => {
    const s = h("select", { onchange: () => onch(s.value) });
    opts.forEach(([v, t]) => s.append(h("option", { value: v }, t)));
    s.value = val; return s;
  };
  const w2Lab = (txt, ...kids) => h("label", null, txt, ...kids);
  const w2Esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const w2F = (x, d) => (Object.is(+x.toFixed(d), -0) ? 0 : x).toFixed(d).replace(".", ",").replace("-", "−");
  const w2Mean = a => a.reduce((s, v) => s + v, 0) / a.length;
  /* SentencePiece-token megjelenítése: „▁” = szó eleje; szó belseji darab elé „·” */
  const w2Piece = t => {
    if (t === "</s>") return { s: "</s>", inner: false, special: true };
    if (t.startsWith("▁")) return { s: t.slice(1), inner: false };
    return /[\p{L}\p{N}]/u.test(t) ? { s: "·" + t, inner: true } : { s: t, inner: false };
  };
  /* WordPiece (BERT): „##” = szó belseji darab */
  const w2WP = t => (t.startsWith("##") ? { s: "·" + t.slice(2), inner: true } : { s: t, inner: false, special: /^\[(CLS|SEP)\]$/.test(t) });

  /* ------------------------------------------------------------------
     12.4-c  translation-attention – valódi keresztfigyelem (opus-mt-hu-en)
     ------------------------------------------------------------------ */
  W["translation-attention"] = root => {
    const D = window.REAL12 && window.REAL12.mt;
    if (!D) { root.append(small("Hiányzik a real-attention.js adatfájl.")); return; }
    header(root, "Figyelem fordítás közben: hova néz a modell?",
      "Egy valódi magyar → angol fordítómodell <b>keresztfigyelme</b>, miközben a saját fordítását írja, szóról szóra. <b>Sor</b> = az épp leírt angol szó " +
      "(az első sor a ⟨kezdés⟩ jel): a modell ennek feldolgozásakor ennyire figyel a forrásmondat egyes <b>magyar</b> tokenjeire (oszlopok), mielőtt a következő szót választja. Egy sor összege 1. " +
      "A keretes cella a sor legnagyobb súlya. A „·” jelű darab egy szó belseje: a tokenizáló a ritkább szavakat darabokra vágja. Vidd az egeret (koppints) egy cellára!");
    const keys = Object.keys(D);
    let sent = keys[0], layer = 2, view = "avg", hideEos = false;
    const selS = w2Sel(keys.map(k => [k, k]), sent, v => { sent = v; sync(); });
    selS.style.cssText = "max-width:100%;min-width:0";
    const gL = toggleGroup([0, 1, 2, 3, 4, 5].map(i => [String(i), String(i + 1)]), () => layer, k => { layer = +k; if (view !== "avg" && !D[sent].heads[String(layer)]) view = "avg"; sync(); });
    const gV = toggleGroup([["avg", "8 fej átlaga"], ...[0, 1, 2, 3, 4, 5, 6, 7].map(i => [String(i), (i + 1) + ". fej"])], () => view, k => { view = k; sync(); });
    const cb = checkbox(false, () => { hideEos = cb.checked; sync(); });
    const trans = h("div", { class: "readout", style: "margin-top:.2rem;font-family:inherit" });
    root.append(h("div", { class: "controls" }, small("mondat:"), selS),
      trans,
      h("div", { class: "controls" }, small("dekóderréteg:"), gL.bs, small("(a 3. rétegben a legtisztább a szóigazítás)")),
      h("div", { class: "controls" }, small("nézet:"), gV.bs),
      h("div", { class: "controls" }, h("label", null, cb, "a </s> oszlop elrejtése (sorok újranormálva)")));
    const headNote = w2Note("", ";margin-top:-.2rem");
    root.append(headNote);
    const box = h("div");
    root.append(h("div", { class: "muted", style: "font-size:.84rem;margin-top:.5rem" }, "sorok: az épp leírt angol token (a dekóder bemenete) · oszlopok: magyar tokenek (amire figyel)"), box);
    const out = h("div", { class: "readout" });
    root.append(out);
    let M = null, src = [], tgt = [];
    const hm = w2Heat(box, {
      data: [[0]], markRowMax: true, digits: 2, maxCell: 54, cellH: c => Math.min(c, 34),
      rowStyle: r => (tgt[r] && (tgt[r].inner || tgt[r].special) ? { color: css("--muted") } : null),
      colStyle: j => (src[j] && (src[j].inner || src[j].special) ? { color: css("--muted") } : null),
      onHover: (r, c) => readout(r, c)
    });
    const pairLink = (k, txt) => {
      const a = h("a", { href: "#", onclick: e => { e.preventDefault(); sent = k; selS.value = k; sync(); } }, txt);
      return a;
    };
    const pair = h("div", { class: "box tip", style: "margin:.7rem 0 0;font-size:.9rem" });
    const k1 = "Lehullott a levél a fáról.", k2 = "Lehullott egy sárga levél a fáról.";
    if (D[k1] && D[k2]) {
      pair.append(h("b", null, "Figyeld ezt a párt! "),
        pairLink(k1, "„Lehullott a levél a fáról.”"), " → „", D[k1].translation, "” ",
        h("span", { style: "color:var(--bad);font-weight:600" }, "(hibás: letter = levél mint küldemény!)"), " · ",
        pairLink(k2, "„Lehullott egy sárga levél a fáról.”"), " → „", D[k2].translation, "” ",
        h("span", { style: "color:var(--setC);font-weight:600" }, "(jó)"), ". ",
        "Ugyanaz a „levél” szó, de a „sárga” elég kontextus ahhoz, hogy a modell a falevelet válassza. Nézd meg a „letter” és a „leaf” sorát: ",
        h("span", { html: "mindkettő a „levél” oszlopra néz – a figyelem azt mutatja, <i>honnan</i> veszi az információt, azt nem, hogy jól dönt-e." }));
      root.append(pair);
    }
    root.append(w2Note("<b>Miért olyan sötét a </s> oszlop?</b> Sok fej a mondatvégi <code>&lt;/s&gt;</code> tokenre „teszi le” a súlya nagy részét, ha éppen " +
      "nincs mit keresnie – ez egyfajta <b>figyelemnyelő</b> (angolul <i>attention sink</i>). Rejtsd el az oszlopot: a maradék súlyokat soronként újra 1-re normálva " +
      "sokkal jobban látszik, melyik angol szó melyik magyar szóhoz igazodik."));
    root.append(w2Src(window.REAL12.src.mt));

    function sync() {
      const d = D[sent], hasHeads = !!d.heads[String(layer)];
      if (!hasHeads) view = "avg";
      gL.paint(); gV.paint();
      gV.bs.forEach(b => b.dataset.key !== "avg" && setDis(b, !hasHeads));
      headNote.innerHTML = hasHeads ? "Ebben a rétegben az egyes fejeket is megnézheted: mindegyik másra figyel." :
        "Az egyes fejek külön csak a 3. és a 4. rétegben érhetők el; itt a 8 fej átlagát látod.";
      let A = view === "avg" ? d.avg[layer] : d.heads[String(layer)][+view];
      src = d.src.map(w2Piece); tgt = [{ s: "⟨kezdés⟩", inner: false, special: true }, ...d.tgt.slice(0, -1).map(w2Piece)];
      let srcShown = src;
      if (hideEos) {
        const e = d.src.indexOf("</s>");
        A = A.map(row => { const r = row.filter((_, j) => j !== e), s = r.reduce((a, b) => a + b, 0) || 1; return r.map(v => v / s); });
        srcShown = src.filter((_, j) => j !== e);
      }
      M = A;
      src = srcShown;
      const mx = Math.max(...A.flat());
      hm.set({ data: A, rowLabels: tgt.map(t => t.s), colLabels: src.map(t => t.s), range: [0, mx] });
      trans.innerHTML = `<span class="muted">magyar:</span> ${w2Esc(sent)}<br><span class="muted">a modell fordítása:</span> <b style="color:var(--text)">${w2Esc(d.translation)}</b>`;
      readout(null, null);
    }
    function readout(r, c) {
      const qs = s => `„${w2Esc(s)}”`;
      if (r == null) {
        const pairs = M.map((row, i) => { const j = argmax(row); return `${qs(tgt[i].s)}→${qs(src[j].s)}`; });
        out.innerHTML = `<span class="muted">soronként a legerősebb kapcsolat:</span> ${pairs.join(" · ")}` +
          `<br><span class="muted">színskála: háttérszín = 0 … legerősebb szín = ${fmt(Math.max(...M.flat()), 2)} (a mátrix legnagyobb súlya)</span>`;
        return;
      }
      const v = M[r][c], j = argmax(M[r]);
      const nxt = window.REAL12.mt[sent].tgt[r], prev = r ? `a(z) ${qs(tgt[r].s)} leírása után` : "a kezdéskor";
      out.innerHTML = `${prev} (a következő token: ${qs(w2Piece(nxt).s)}) ennyit figyel a(z) ${qs(src[c].s)} tokenre: <b>${fmt(v, 3)}</b> (a sor ${pct(v, 1)}-a)` +
        `<br><span class="muted">ennek a sornak a legnagyobb súlya: ${qs(src[j].s)} – ${fmt(M[r][j], 3)}</span>`;
    }
    sync();
  };

  /* ------------------------------------------------------------------
     12.5-a/b, 12.6-b  qkv-calculator – önfigyelem kézzel, három tokenre
     ------------------------------------------------------------------ */
  const W2_QKV_S = {
    A: { toks: ["fa", "levél", "hullik"], X: [[2, 0], [1, 1], [1, 0]] },
    B: { toks: ["posta", "levél", "érkezik"], X: [[0, 2], [1, 1], [0, 1]] }
  };
  const w2I = () => [[1, 0], [0, 1]];
  const w2MatMul = (A, B) => A.map(r => B[0].map((_, j) => r.reduce((s, v, k) => s + v * B[k][j], 0)));
  function w2Attn(X, WQ, WK, WV, scale, causal) {
    const Q = w2MatMul(X, WQ), K = w2MatMul(X, WK), V = w2MatMul(X, WV), d = WK[0].length;
    const S = Q.map(q => K.map(k => dotp(q, k)));
    const Ss = S.map(r => r.map(v => (scale ? v / Math.sqrt(d) : v)));
    const Sm = Ss.map((r, i) => r.map((v, j) => (causal && j > i ? -Infinity : v)));
    const A = Sm.map(r => softmax(r));
    const O = w2MatMul(A, V);
    return { Q, K, V, S, Ss, Sm, A, O };
  }
  const w2TOKC = ["--setA", "--accent", "--setC"];

  W["qkv-calculator"] = root => {
    header(root, "Önfigyelem kézzel: Q, K, V három tokenre",
      "Három token, mindegyik egy kétdimenziós vektor (az $X$ sorai). A $W_Q, W_K, W_V$ mátrixokkal kapjuk a kérdés- (Q), kulcs- (K) és értékvektorokat (V); " +
      "a pontszám $QK^{\\mathsf T}$, ezt $\\sqrt d$-vel osztjuk, soronként softmaxoljuk, végül a súlyokkal átlagoljuk a V sorait: " +
      "$O = \\operatorname{softmax}\\!\\big(QK^{\\mathsf T}/\\sqrt d\\big)\\,V$. <b>Kattints egy sorra</b> (egy tokenre), és lent végigkövetheted a számolását. Írd át a számokat is!");
    const state = { s: "A", X: { A: W2_QKV_S.A.X.map(r => r.slice()), B: W2_QKV_S.B.X.map(r => r.slice()) },
      WQ: w2I(), WK: w2I(), WV: w2I(), scale: true, causal: false, sel: 1 };
    const gS = toggleGroup([["A", "A: fa · levél · hullik"], ["B", "B: posta · levél · érkezik"]], () => state.s, k => { state.s = k; buildInputs(); sync(); });
    const cS = checkbox(true, () => { state.scale = cS.checked; sync(); });
    const cM = checkbox(false, () => { state.causal = cM.checked; sync(); });
    const setW = (q, k, v) => { state.WQ = q; state.WK = k; state.WV = v; buildInputs(); sync(); };
    root.append(h("div", { class: "controls" }, small("mondat:"), gS.bs),
      h("div", { class: "controls" }, h("label", null, cS, "÷ √d skálázás (d = 2)"), h("label", null, cM, "kauzális maszk (csak visszafelé nézhet)")),
      h("div", { class: "controls" }, small("súlymátrixok:"),
        btn("egységmátrix", () => setW(w2I(), w2I(), w2I())),
        btn("más W-k", () => setW([[1, 0], [0, 0.5]], [[1, 1], [0, 1]], w2I())),
        btn("alapértékek", () => { state.X[state.s] = W2_QKV_S[state.s].X.map(r => r.slice()); state.scale = true; state.causal = false; cS.checked = true; cM.checked = false; setW(w2I(), w2I(), w2I()); })));
    const inBox = h("div", { style: "display:flex;flex-wrap:wrap;gap:.8rem 1.2rem;align-items:flex-start;margin:.3rem 0" });
    const stepBox = h("div", { style: "display:flex;flex-wrap:wrap;gap:.8rem 1.1rem;align-items:flex-start;margin:.6rem 0" });
    const out = h("div", { class: "readout" });
    const cvWrap = h("div", { style: "max-width:440px;margin:.6rem auto 0" });
    const legend = h("div", { class: "muted", style: "font-size:.84rem;text-align:center" });
    const stats = h("div", { class: "stat-row" });
    root.append(inBox, stepBox, out, cvWrap, legend, stats);
    const cv = Calc.canvas(cvWrap, 0.8, 440);
    cv.draw = () => drawPlot();
    const TD = "padding:.15rem .4rem;text-align:right;font-family:var(--mono);font-size:.84rem;border:1px solid var(--border);white-space:nowrap";
    const TH = "padding:.15rem .4rem;font-size:.78rem;color:var(--muted);font-weight:600;text-align:left;white-space:nowrap";
    const toks = () => W2_QKV_S[state.s].toks;
    const num = (val, onset) => {
      const i = h("input", { type: "number", step: "0.5", value: String(val), style: "width:4.2em;padding:.15rem .3rem;font-size:.88rem" });
      i.addEventListener("input", () => { const v = parseFloat(String(i.value).replace(",", ".")); if (Number.isFinite(v)) { onset(v); sync(); } });
      return i;
    };
    const titled = (title, el) => h("div", { style: "min-width:0" }, h("div", { style: "font-size:.85rem;font-weight:600;margin-bottom:.2rem", html: title }), el);
    function buildInputs() {
      gS.paint();
      const X = state.X[state.s], tk = toks();
      const tx = h("table", { style: "margin:0;border-collapse:collapse" },
        h("tr", null, h("th", { style: TH }), h("th", { style: TH }, "x₁"), h("th", { style: TH }, "x₂")),
        ...X.map((r, i) => h("tr", null, h("th", { style: TH + `;color:var(${w2TOKC[i]})` }, tk[i]),
          ...r.map((v, j) => h("td", { style: "padding:.1rem" }, num(v, nv => { X[i][j] = nv; }))))));
      const wTab = (key) => h("table", { style: "margin:0;border-collapse:collapse" },
        ...state[key].map((r, i) => h("tr", null, ...r.map((v, j) => h("td", { style: "padding:.1rem" }, num(v, nv => { state[key][i][j] = nv; }))))));
      inBox.replaceChildren(titled("bemenet $X$ (soronként egy token)", tx), titled("$W_Q$", wTab("WQ")), titled("$W_K$", wTab("WK")), titled("$W_V$", wTab("WV")));
      math(inBox);
    }
    /* egy lépés táblázata; kattintható sorok */
    function stepTable(title, M, cols, opt = {}) {
      const tk = toks();
      const trs = M.map((r, i) => {
        const tr = h("tr", { style: "cursor:pointer" + (opt.rowSel !== false && i === state.sel ? ";outline:2px solid var(--accent);outline-offset:-1px" : "") },
          h("th", { style: TH + `;color:var(${w2TOKC[i]})` }, tk[i]),
          ...r.map((v, j) => {
            const masked = v === -Infinity || (opt.mask && opt.mask(i, j));
            let bg = "", col = "";
            if (opt.shade && !masked) { const t = clamp(v, 0, 1); bg = `;background:${mix("--accent", t)}`; col = `;color:${ink(t)}`; }
            if (masked) { bg = ";background:var(--bg-soft)"; col = ";color:var(--muted)"; }
            const txt = masked ? (opt.maskTxt || "−∞") : fmt(v, opt.d == null ? 3 : opt.d);
            return h("td", { style: TD + bg + col + (masked ? ";font-size:.76rem" : "") }, txt);
          }));
        tr.addEventListener("click", () => { state.sel = i; sync(); });
        return tr;
      });
      const tbl = h("table", { style: "margin:0;border-collapse:collapse" },
        h("tr", null, h("th", { style: TH }), ...cols.map(c => h("th", { style: TH + ";text-align:center" }, c))), ...trs);
      return titled(title, h("div", { class: "tw", style: "overflow-x:auto" }, tbl));
    }
    let R = null;
    const vecTxt = v => `(${fmt(v[0], 3)}; ${fmt(v[1], 3)})`;
    function sync() {
      const X = state.X[state.s];
      R = w2Attn(X, state.WQ, state.WK, state.WV, state.scale, state.causal);
      const tk = toks(), d2 = ["1", "2"], kc = tk.map(t => "k·" + t);
      const masked = (i, j) => state.causal && j > i;
      stepBox.replaceChildren(
        stepTable("1. $Q = XW_Q$", R.Q, d2),
        stepTable("$K = XW_K$", R.K, d2, { rowSel: false }),
        stepTable("$V = XW_V$", R.V, d2, { rowSel: false }),
        stepTable("2. pontszám $QK^{\\mathsf T}$", R.S, tk),
        stepTable(state.scale ? "3. skálázva: $\\div\\sqrt2$" : "3. skálázás nélkül", R.Sm, tk),
        stepTable("4. softmax-súlyok", R.A, tk, { shade: true, mask: masked, maskTxt: "−∞ → 0" }),
        stepTable("5. kimenet $O$ = súlyok · $V$", R.O, d2));
      math(stepBox);
      void kc;
      const i = state.sel, w = R.A[i], o = R.O[i];
      const sc = R.S[i].map((v, j) => (masked(i, j) ? `<span class="muted">${tk[j]}: maszk</span>` : `${tk[j]}: ${fmt(v, 3)}`)).join(" · ");
      const ss = R.Sm[i].map(v => (v === -Infinity ? "−∞" : fmt(v, 3))).join("; ");
      out.innerHTML = `<b>${tk[i]}</b> kérdése: q = ${vecTxt(R.Q[i])} · pontszámok q·k: ${sc}` +
        `<br>${state.scale ? "÷ √2" : "skálázás nélkül"}${state.causal ? " + maszk" : ""}: (${ss}) → softmax: (${w.map(v => fmt(v, 3)).join("; ")})` +
        `<br><b>${tk[i]}</b>: ${w.map((v, j) => `${fmt(v, 3)} · ${tk[j]}`).join(" + ")} = <b>${vecTxt(o)}</b>` +
        `<br><span class="muted">(a jobb oldalon a tokenek V-vektorai szerepelnek; most v<sub>${tk[0]}</sub> = ${vecTxt(R.V[0])} stb.)</span>`;
      // a „levél” kimenete mindkét mondatban
      const RA = w2Attn(state.X.A, state.WQ, state.WK, state.WV, state.scale, state.causal);
      const RB = w2Attn(state.X.B, state.WQ, state.WK, state.WV, state.scale, state.causal);
      const cIn = cosine(state.X.A[1], state.X.B[1]), cOut = cosine(RA.O[1], RB.O[1]);
      const stat = (v, l) => h("div", { class: "stat" }, h("div", { class: "v" }, v), h("div", { class: "l" }, l));
      stats.replaceChildren(
        stat(w2F(cIn, 3), "cos(levél A, levél B) – a bemenetek"),
        stat(w2F(cOut, 3), "cos(levél′ A, levél′ B) – a figyelem után"));
      legend.innerHTML = `teli nyíl: bemenet (X sora) · karika: kimenet (O sora) · szaggatott: elmozdulás · halvány karika: a másik mondat „levél′”-e`;
      drawPlot(RA, RB);
    }
    function drawPlot() {
      if (!R) return;
      const X = state.X[state.s], O = R.O, oth = state.s === "A" ? "B" : "A";
      const Ro = w2Attn(state.X[oth], state.WQ, state.WK, state.WV, state.scale, state.causal);
      const ghost = Ro.O[1];
      const pts = [[0, 0], ...X, ...O, ghost];
      const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
      const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
      const view = eqView(cv, (x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) / 2 + 0.6, (y1 - y0) / 2 + 0.6, { xname: "1. koord.", yname: "2. koord." });
      const T = Calc.plot(cv, view, []);
      const { ctx } = cv, tk = toks(), mut = css("--muted");
      const [gx, gy] = [T.tx(ghost[0]), T.ty(ghost[1])];
      ring(ctx, gx, gy, 6, rgba(css("--accent"), 0.45), 2, [3, 3]);
      label(ctx, `levél′ (${oth})`, gx + 8, gy + 14, mut, "left", "11px system-ui, sans-serif");
      X.forEach((x, i) => {
        const col = css(w2TOKC[i]), on = i === state.sel;
        arrow(ctx, T.tx(0), T.ty(0), T.tx(x[0]), T.ty(x[1]), on ? col : rgba(col, 0.55), on ? 2.6 : 1.8);
      });
      X.forEach((x, i) => {
        const col = css(w2TOKC[i]), on = i === state.sel, o = O[i];
        ctx.save(); ctx.setLineDash([4, 3]);
        arrow(ctx, T.tx(x[0]), T.ty(x[1]), T.tx(o[0]), T.ty(o[1]), on ? col : rgba(col, 0.45), on ? 1.6 : 1);
        ctx.restore();
        dot(ctx, T.tx(o[0]), T.ty(o[1]), on ? 6.5 : 5, col, true, on ? 3 : 2);
      });
      // feliratok: a bemenetnél fölé; a kimeneteknél jobbra, egymás alá tolva, ha ütköznének
      X.forEach((x, i) => {
        const col = css(w2TOKC[i]), on = i === state.sel;
        label(ctx, tk[i], T.tx(x[0]) + 6, T.ty(x[1]) - 4, col, "left", (on ? "700 " : "600 ") + "12px system-ui, sans-serif");
      });
      const placed = X.map((x, i) => { ctx.save(); ctx.font = "700 12px system-ui, sans-serif"; const wd = ctx.measureText(tk[i]).width; ctx.restore(); return [T.tx(x[0]) + 6, T.ty(x[1]) - 11, wd]; });
      O.map((o, i) => [i, T.tx(o[0]), T.ty(o[1])]).sort((a, b) => a[2] - b[2]).forEach(([i, px, py]) => {
        const col = css(w2TOKC[i]), on = i === state.sel, f = (on ? "700 " : "600 ") + "11px system-ui, sans-serif";
        ctx.save(); ctx.font = f; const wd = ctx.measureText(tk[i] + "′").width; ctx.restore();
        let lx = px + 10, ly = py + 4;
        for (let k = 0; k < 6; k++) {
          const hitL = placed.find(b => lx < b[0] + b[2] + 4 && b[0] < lx + wd + 4 && Math.abs(ly - b[1]) < 13);
          if (!hitL) break;
          ly = hitL[1] + 13;
        }
        placed.push([lx, ly, wd]);
        if (Math.abs(ly - py - 4) > 2) polyline(ctx, { tx: v => v, ty: v => v }, [[px + 5, py], [lx - 1, ly - 4]], rgba(col, 0.6), 1);
        label(ctx, tk[i] + "′", lx, ly, col, "left", f, "middle");
      });
    }
    buildInputs();
    sync();
    new MutationObserver(() => sync()).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  };

  /* ------------------------------------------------------------------
     12.5-c  positional-encoding – szinuszos pozíciókódolás
     ------------------------------------------------------------------ */
  const w2PE = (pos, k, d) => { const i = Math.floor(k / 2), a = pos / Math.pow(10000, (2 * i) / d); return k % 2 ? Math.cos(a) : Math.sin(a); };
  W["positional-encoding"] = root => {
    header(root, "Szinuszos pozíciókódolás",
      "Minden pozíció kap egy $d$ hosszú vektort: $PE(pos, 2i) = \\sin\\!\\big(pos/10000^{2i/d}\\big)$, $PE(pos, 2i+1) = \\cos\\!\\big(pos/10000^{2i/d}\\big)$. " +
      "A hőtérkép egy sora egy pozíció vektora (<b style='color:var(--setA)'>kék</b> = −1, háttérszín = 0, <b style='color:var(--setB)'>narancs</b> = +1). " +
      "Vidd az egeret egy cellára; kattints egy sorra, és lent látod, mennyire hasonlít ez a pozíció a többihez.");
    let n = 32, d = 16, p = 5;
    const sN = slider(8, 64, 1, n), sD = slider(4, 64, 2, d), oN = h("b"), oD = h("b");
    sN.addEventListener("input", () => { n = +sN.value; p = Math.min(p, n - 1); sync(); });
    sD.addEventListener("input", () => { d = +sD.value; sync(); });
    root.append(h("div", { class: "controls" }, w2Lab("pozíciók száma n:", sN, oN), w2Lab("dimenzió d:", sD, oD)));
    const box = h("div");
    root.append(h("div", { class: "muted", style: "font-size:.84rem" }, "sorok: pozíció 0 … n − 1 · oszlopok: dimenzió 0 … d − 1 (páros: sin, páratlan: cos)"), box);
    const out = h("div", { class: "readout" });
    root.append(out);
    const hm = w2Heat(box, {
      data: [[0]], showVals: false, minCell: 4, maxCell: 30, cellH: c => clamp(Math.min(c, 330 / n), 4, 22),
      scale: v => [v < 0 ? "--setA" : "--setB", Math.abs(v)],
      onHover: (r, c) => readout(r, c),
      onClick: r => { p = r; sP.value = p; sync(); }
    });
    root.append(w2Note("Az első dimenziók <b>gyorsan ketyegnek, mint a másodpercmutató</b> (szomszédos pozíciók is eltérnek), az utolsók <b>lassan, mint az óramutató</b> " +
      "(csak távoli pozíciókat különböztetnek meg). Együtt minden pozíciónak egyedi „órája” van."));
    // második panel: koszinusz-hasonlóság
    const sP = slider(0, n - 1, 1, p), oP = h("b");
    sP.addEventListener("input", () => { p = +sP.value; sync(); });
    root.append(h("div", { class: "controls", style: "margin-top:1rem" }, w2Lab("kiválasztott pozíció p:", sP, oP)));
    const cvBox = h("div");
    root.append(cvBox);
    const cv = Calc.canvas(cvBox, flatAspect(root, 0.42, 0.62), 760);
    const out2 = h("div", { class: "readout" });
    root.append(out2);
    // fix táblázat (d = 4)
    const fixed = h("div", { class: "tw", style: "overflow-x:auto;margin-top:.8rem" });
    const TD = "padding:.2rem .5rem;font-family:var(--mono);font-size:.84rem;text-align:right;border-bottom:1px solid var(--border);white-space:nowrap";
    const th = t => h("th", { style: "padding:.2rem .5rem;font-size:.8rem;text-align:right;white-space:nowrap" }, t);
    fixed.append(h("div", { style: "font-size:.88rem;font-weight:600;margin-bottom:.2rem" }, "Kézzel is ellenőrizhető: d = 4, pozíciók 0–3"),
      h("table", { style: "margin:0;border-collapse:collapse" },
        h("tr", null, th("pos"), th("sin(pos)"), th("cos(pos)"), th("sin(pos/100)"), th("cos(pos/100)")),
        ...[0, 1, 2, 3].map(q => h("tr", null, h("td", { style: TD + ";font-weight:700" }, String(q)),
          ...[0, 1, 2, 3].map(k => h("td", { style: TD }, w2F(w2PE(q, k, 4), 4)))))));
    root.append(fixed, w2Note("d = 4 esetén $i = 0$-ra $10000^{0} = 1$, $i = 1$-re $10000^{2/4} = 100$ – innen a két „óra”: $\\sin(pos)$ és $\\sin(pos/100)$."));
    let P = null;
    function sync() {
      oN.textContent = n; oD.textContent = d; sP.max = n - 1; sP.value = p; oP.textContent = p;
      P = Array.from({ length: n }, (_, q) => Array.from({ length: d }, (_, k) => w2PE(q, k, d)));
      hm.set({ data: P, rowLabels: P.map((_, q) => String(q)), colLabels: Array.from({ length: d }, (_, k) => String(k)), selRow: p });
      const hv = hm.hover; readout(hv ? hv[0] : null, hv ? hv[1] : null);
      drawCos();
    }
    function readout(r, c) {
      if (r == null) { out.innerHTML = `<span class="muted">Vidd az egeret egy cellára!</span> Kiválasztott sor: p = ${p} (keretben).`; return; }
      const i = Math.floor(c / 2), den = Math.pow(10000, (2 * i) / d), a = r / den, f = c % 2 ? "cos" : "sin";
      out.innerHTML = `PE(${r}, ${c}) = ${f}(${r} / 10000<sup>${2 * i}/${d}</sup>) = ${f}(${r} / ${fmt(den, den < 10 ? 3 : 1)}) = ${f}(${fmt(a, 4)}) = <b>${fmt(P[r][c], 4)}</b>` +
        `<br><span class="muted">${c}. dimenzió (i = ${i}): periódus 2π·${fmt(den, den < 10 ? 3 : 1)} ≈ ${fmt(2 * Math.PI * den, 1)} pozíció</span>`;
    }
    function drawCos() {
      const cs = P.map(v => cosine(P[p], v));
      const lo = Math.min(0, Math.floor(Math.min(...cs) * 10) / 10 - 0.1);
      const T = Calc.plot(cv, { xmin: -1.5, xmax: n - 0.5, ymin: lo, ymax: 1.12, xname: "q", yname: "cos(PE(p), PE(q))" }, [
        { vline: p, color: "--muted", dash: [4, 4], width: 1.2 },
        { f: x => { const k = clamp(Math.floor(x), 0, n - 2), t = x - k; return cs[k] * (1 - t) + cs[k + 1] * t; }, domain: [0, n - 1], color: "--accent", width: 1.8 },
        { points: cs.map((v, q) => [q, v]), color: "--accent", r: n > 40 ? 2.5 : 3.5 },
        { points: [[p, 1]], color: "--setB", r: 5.5 }
      ]);
      void T;
      const near = p + 1 < n ? cs[p + 1] : cs[p - 1], far = cs.reduce((m, v) => Math.min(m, v), 1);
      out2.innerHTML = `p = ${p}: cos(PE(p), PE(p ± 1)) = <b>${fmt(near, 3)}</b> · legkisebb érték: ${fmt(far, 3)}` +
        `<br><span class="muted">A görbe alakja csak a q − p távolságtól függ: mozgasd p-t, és a minta vele együtt csúszik.</span>`;
    }
    cv.draw = drawCos;
    sync();
  };

  /* ------------------------------------------------------------------
     12.8-b  hubert-context – a „levél” kontextuális vektorai és a figyelem
     ------------------------------------------------------------------ */
  W["hubert-context"] = root => {
    const RD = window.REAL12;
    if (!RD) { root.append(small("Hiányzik a real-attention.js adatfájl.")); return; }
    header(root, "A huBERT belülről: ugyanaz a szó, más jelentés",
      "Hat mondat, mindben szerepel a „levél”: az első háromban <b style='color:var(--setC)'>🍂 falevél</b>, a többiben <b style='color:var(--setB)'>✉️ küldemény</b>. " +
      "A magyar huBERT modell minden rétege után kivettük a „levél” vektorát, és páronként kiszámoltuk a koszinusz-hasonlóságukat. " +
      "A 0. réteg a beágyazási réteg (még nincs kontextus).");
    const sens = i => (i < 3 ? "🍂" : "✉️");
    const senseCol = i => css(i < 3 ? "--setC" : "--setB");
    const shortName = s => { const w = s.replace(/\.$/, "").split(" "); return w.length > 3 ? w.slice(0, 3).join(" ") + "…" : w.join(" "); };
    // (a) rész
    let L = 4;
    const sL = slider(0, 12, 1, L), oL = h("b");
    sL.addEventListener("input", () => { L = +sL.value; syncA(); });
    root.append(h("div", { style: "font-weight:700;margin-top:.6rem" }, "a) Hasonlóság rétegről rétegre"),
      h("div", { class: "controls" }, w2Lab("réteg:", sL, oL)));
    const legendS = h("ol", { style: "font-size:.85rem;margin:.2rem 0 .3rem;padding-left:1.4rem;columns:2 16rem" },
      ...RD.levelSent.map((s, i) => h("li", null, h("span", { style: `color:var(${i < 3 ? "--setC" : "--setB"})` }, sens(i) + " "), s)));
    root.append(legendS);
    const boxA = h("div");
    root.append(boxA);
    const hmA = w2Heat(boxA, {
      data: [[0]], digits: 2, range: [0.7, 1], maxCell: 52, maxW: 460, cellH: c => Math.min(c, 36),
      rowLabels: RD.levelSent.map((s, i) => `${sens(i)} ${i + 1}. ${shortName(s)}`), colLabels: RD.levelSent.map((_, i) => `${sens(i)} ${i + 1}`),
      rowStyle: i => ({ color: senseCol(i) }), colStyle: j => ({ color: senseCol(j) }),
      onHover: (r, c) => readA(r, c)
    });
    const outA = h("div", { class: "readout" });
    const statsA = h("div", { class: "stat-row" });
    root.append(outA, statsA);
    const avgs = RD.levelCos.map(M => {
      const s = [], dd = [];
      for (let i = 0; i < 6; i++) for (let j = i + 1; j < 6; j++) ((i < 3) === (j < 3) ? s : dd).push(M[i][j]);
      return [w2Mean(s), w2Mean(dd)];
    });
    root.append(h("div", { class: "muted", style: "font-size:.84rem;margin-top:.7rem" },
      h("b", { style: "color:var(--accent)" }, "● azonos jelentés"), " · ", h("b", { style: "color:var(--setB)" }, "● eltérő jelentés"), " – átlagos koszinusz rétegenként"));
    const cvBox = h("div");
    root.append(cvBox);
    const cvA = Calc.canvas(cvBox, flatAspect(root, 0.4, 0.62), 760);
    root.append(w2Note("<b>Vigyázz az abszolút értékekkel!</b> A BERT-vektorok általában is elég hasonlók egymáshoz (a vektorok egy szűk kúpban állnak – ez az " +
      "<i>anizotrópia</i>), ezért a 0,8 itt nem „kicsi”. A két átlag <b>különbségét</b> nézd: a 0. rétegben (kontextus nélkül) nincs különbség, a középső rétegekben a legnagyobb."));
    function readA(r, c) {
      const M = RD.levelCos[L];
      if (r == null) { outA.innerHTML = `<span class="muted">Vidd az egeret egy cellára! Színskála: 0,7 (háttérszín) … 1 (legerősebb szín).</span>`; return; }
      const same = (r < 3) === (c < 3);
      outA.innerHTML = `${L}. réteg · cos(${sens(r)} ${r + 1}., ${sens(c)} ${c + 1}.) = <b>${fmt(M[r][c], 3)}</b> · ${r === c ? "önmagával" : same ? "azonos jelentés" : "eltérő jelentés"}` +
        `<br><span class="muted">„${w2Esc(RD.levelSent[r])}” ↔ „${w2Esc(RD.levelSent[c])}”</span>`;
    }
    function syncA() {
      oL.textContent = L === 0 ? "0 (beágyazás)" : String(L);
      hmA.set({ data: RD.levelCos[L] });
      readA(null);
      const [a, b] = avgs[L];
      const stat = (v, l, col) => h("div", { class: "stat" }, h("div", { class: "v", style: `color:${col}` }, v), h("div", { class: "l" }, l));
      statsA.replaceChildren(stat(w2F(a, 3), "azonos jelentés (6 pár átlaga)", "var(--accent)"),
        stat(w2F(b, 3), "eltérő jelentés (9 pár átlaga)", "var(--setB)"),
        stat(w2F(a - b, 3), "különbség", "var(--text)"));
      drawA();
    }
    function drawA() {
      const lin = k => x => { const i = clamp(Math.floor(x), 0, 11), t = x - i; return avgs[i][k] * (1 - t) + avgs[i + 1][k] * t; };
      Calc.plot(cvA, { xmin: -0.8, xmax: 13.4, ymin: 0.78, ymax: 1.0, xstep: 1, ystep: 0.05, xname: "réteg", yname: "átlagos cos" }, [
        { vline: L, color: "--muted", dash: [4, 4], width: 1.2 },
        { f: lin(0), domain: [0, 12], color: "--accent", width: 2 },
        { f: lin(1), domain: [0, 12], color: "--setB", width: 2 },
        { points: avgs.map((v, i) => [i, v[0]]), color: "--accent", r: 3 },
        { points: avgs.map((v, i) => [i, v[1]]), color: "--setB", r: 3 },
        { points: [[L, avgs[L][0]]], color: "--accent", r: 6 },
        { points: [[L, avgs[L][1]]], color: "--setB", r: 6 }
      ]);
    }
    cvA.draw = drawA;

    // (b) rész – figyelemfelfedező
    const HB = RD.hubert, keys = Object.keys(HB);
    let s = keys[0], bl = 0, hd = "avg";
    root.append(h("div", { style: "font-weight:700;margin-top:1.4rem" }, "b) Kire figyel egy token?"));
    root.append(h("p", { class: "w-sub", style: "margin:.1rem 0 .3rem" },
      "Válassz mondatot, réteget és fejet. A sor a kérdező token (query), az oszlop az, amire figyel (key); egy sor összege 1. A „·” egy szó belseji WordPiece-darab, " +
      "a [CLS] és a [SEP] a BERT speciális tokenjei."));
    const selS = w2Sel(keys.map(k => [k, k]), s, v => { s = v; syncB(); });
    selS.style.cssText = "max-width:100%;min-width:0";
    const selL = w2Sel(Array.from({ length: 12 }, (_, i) => [String(i), String(i + 1)]), "0", v => { bl = +v; syncB(); });
    const selH = w2Sel([["avg", "fejek átlaga"], ...Array.from({ length: 12 }, (_, i) => [String(i), (i + 1) + ". fej"])], "avg", v => { hd = v; syncB(); });
    root.append(h("div", { class: "controls" }, small("mondat:"), selS),
      h("div", { class: "controls" }, w2Lab("réteg:", selL), w2Lab("fej:", selH)));
    const boxB = h("div");
    root.append(boxB);
    let MB = null, tB = [];
    const hmB = w2Heat(boxB, {
      data: [[0]], digits: 2, maxCell: 46, markRowMax: true, cellH: c => Math.min(c, 32),
      rowStyle: r => (tB[r] && (tB[r].inner || tB[r].special) ? { color: css("--muted") } : null),
      colStyle: j => (tB[j] && (tB[j].inner || tB[j].special) ? { color: css("--muted") } : null),
      onHover: (r, c) => readB(r, c)
    });
    const outB = h("div", { class: "readout" });
    root.append(outB);
    root.append(h("div", { class: "box warn", style: "margin:.7rem 0 0;font-size:.9rem" },
      h("b", null, "A figyelmi súly nem magyarázat: "), "azt mutatja, honnan keverünk, nem azt, miért dönt így a modell. ",
      "Sok fej ráadásul egyszerűen a [SEP]-re vagy a [CLS]-re „parkol”, ha nincs dolga (figyelemnyelő), és a súlyok csak a V-vektorok keverési arányai – a V-k nagysága is számít."));
    root.append(w2Src(RD.src.hubert));
    function syncB() {
      const o = HB[s];
      tB = o.tokens.map(w2WP);
      const n = o.tokens.length;
      MB = hd === "avg"
        ? Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => w2Mean(o.att[bl].map(H => H[i][j]))))
        : o.att[bl][+hd];
      hmB.set({ data: MB, rowLabels: tB.map(t => t.s), colLabels: tB.map(t => t.s), range: [0, Math.max(...MB.flat())] });
      readB(null);
    }
    function readB(r, c) {
      const q = t => `„${w2Esc(t.s)}”`;
      if (r == null) {
        outB.innerHTML = `<span class="muted">Vidd az egeret egy cellára!</span> ${bl + 1}. réteg, ${hd === "avg" ? "12 fej átlaga" : (+hd + 1) + ". fej"} · ` +
          `<span class="muted">színskála: háttérszín = 0 … legerősebb szín = ${fmt(Math.max(...MB.flat()), 2)}; a keretes cella a sor maximuma</span>`;
        return;
      }
      const j = argmax(MB[r]);
      outB.innerHTML = `${q(tB[r])} → ${q(tB[c])}: <b>${fmt(MB[r][c], 3)}</b> (a sor ${pct(MB[r][c], 1)}-a)` +
        `<br><span class="muted">${q(tB[r])} legjobban erre figyel: ${q(tB[j])} – ${fmt(MB[r][j], 3)}</span>`;
    }
    syncA();
    syncB();
  };

  /* ==================================================================
     12.6-a  transformer-block – a Transformer felépítése, paraméterszám
     ================================================================== */
  const w3Int = n => fmt(n, 0).replace(/ /g, " ");                 // ezres tagolás keskeny szóközzel
  const w3Big = n => (n >= 1e9 ? fmt(n / 1e9, n < 1e10 ? 2 : 1) + " milliárd" : n >= 1e6 ? fmt(n / 1e6, 1) + " millió" : w3Int(n));
  const w3Short = n => (n >= 1e9 ? fmt(n / 1e9, 2) + " Mrd" : n >= 1e6 ? fmt(n / 1e6, 2) + " M" : w3Int(n));
  const w3NS = "http://www.w3.org/2000/svg";
  function w3S(tag, attrs, ...kids) {
    const e = document.createElementNS(w3NS, tag);
    if (attrs) for (const [k, v] of Object.entries(attrs)) {
      if (k.startsWith("on")) e.addEventListener(k.slice(2), v); else e.setAttribute(k, v);
    }
    kids.flat().forEach(c => c != null && e.append(c.nodeType ? c : document.createTextNode(c)));
    return e;
  }

  const W3_PRESETS = {
    exp: { name: "a kísérletünk Transformere", arch: "enc", norm: "post", d: 16, h: 2, N: 1, V: 28, nmax: 15, ff: 32, pos: "learned", seg: false, embLN: false, finalLN: false, head: "mean1",
      note: "A 12.8 kísérlete: 1 blokk, d = 16, 2 fej, 28 szavas szótár, legfeljebb 15 token, d_ff = 32; a kimenet a tokenvektorok átlaga → 1 neuron. Nincs LN a beágyazás után és a végén." },
    bert: { name: "BERT-base", arch: "enc", norm: "post", d: 768, h: 12, N: 12, V: 30522, nmax: 512, ff: 3072, pos: "learned", seg: true, embLN: true, finalLN: false, head: "pooler",
      note: "Devlin és mtsai (2018) „110 millió” paramétert közöltek. Benne van a 2 × d-s szegmenstábla, a beágyazás utáni LN és a [CLS]-pooler; a finomhangolt osztályozó nincs." },
    gpt2s: { name: "GPT-2 small", arch: "dec", norm: "pre", d: 768, h: 12, N: 12, V: 50257, nmax: 1024, ff: 3072, pos: "learned", seg: false, embLN: false, finalLN: true, head: "tied",
      note: "A kimeneti réteg a tokenbeágyazás mátrixát használja újra (súlymegosztás), ezért nincs külön V × d mátrix. A cikkben még 117 millió szerepelt, a kiadott modell 124 milliós." },
    gpt2xl: { name: "GPT-2 XL", arch: "dec", norm: "pre", d: 1600, h: 25, N: 48, V: 50257, nmax: 1024, ff: 6400, pos: "learned", seg: false, embLN: false, finalLN: true, head: "tied",
      note: "A legnagyobb GPT-2 (közölt szám: 1,5 milliárd). 48 blokk, 25 fej, d_k = 64." },
    gpt3: { name: "GPT-3", arch: "dec", norm: "pre", d: 12288, h: 96, N: 96, V: 50257, nmax: 2048, ff: 49152, pos: "learned", seg: false, embLN: false, finalLN: true, head: "tied",
      note: "Brown és mtsai (2020) kerekítve 175 milliárd paramétert közöltek; a képletünk 174,6 milliárdot ad. A paraméterek 99,6%-a a blokkokban van." }
  };

  function w3Params(s) {
    const { d, N, V, nmax, ff } = s;
    const att = 4 * d * d + 4 * d, ffn = 2 * d * ff + ff + d, ln = 4 * d, block = att + ffn + ln;
    const tokE = V * d, posE = s.pos === "learned" ? nmax * d : 0, segE = s.seg ? 2 * d : 0, embLN = s.embLN ? 2 * d : 0;
    const finalLN = s.finalLN ? 2 * d : 0;
    const headP = s.arch === "enc" ? (s.head === "pooler" ? d * d + d : d + 1) : (s.head === "untied" ? V * d : 0);
    const emb = tokE + posE + segE + embLN;
    return { att, ffn, ln, block, tokE, posE, segE, embLN, finalLN, headP, emb, blocks: N * block, total: emb + N * block + finalLN + headP };
  }

  /* a komponensek magyarázata (a kattintható panelhez) */
  function w3Info(id, s, P) {
    const { d, h: H, N, V, nmax, ff } = s, dk = d / H, dec = s.arch === "dec";
    const dkTxt = Number.isInteger(dk) ? w3Int(dk) : fmt(dk, 2) + " (⚠ nem egész: d legyen h többszöröse)";
    const ffF = ff === 4 * d ? "2·d·d_ff + d_ff + d = 8d² + 5d" : "2·d·d_ff + d_ff + d";
    const I = {
      tok: { t: "Tokenek", x: "A bemenet n darab token azonosítója: egész szám 0 és V − 1 között. A tokenizáló bontja a szöveget szavakra vagy szódarabokra; a szótár mérete itt V = " + w3Int(V) + ". A kontextus legfeljebb n_max = " + w3Int(nmax) + " token hosszú.",
        sh: "n egész szám (n ≤ " + w3Int(nmax) + ")", f: "0 (ez még csak bemenet)", v: 0, L: [["#s121-a", "12.1-a tokenek"]] },
      emb: { t: "Tokenbeágyazás", x: "Egy V × d táblázat: minden tokenhez egy tanult, d dimenziós sor tartozik. A számolás csak sorkiválasztás (a one-hot vektor szorzása a mátrixszal)." +
        (s.seg ? " BERT-nél egy 2 × d-s szegmenstáblát is hozzáadunk: melyik mondatból jön a token." : "") + (dec && s.head === "tied" ? " A GPT-2 ugyanezt a mátrixot használja a kimeneti rétegben is." : ""),
        sh: "n × d = n × " + w3Int(d), f: "V·d" + (s.seg ? " + 2·d (szegmens)" : "") + " = " + w3Int(V) + "·" + w3Int(d) + (s.seg ? " + 2·" + w3Int(d) : ""), v: P.tokE + P.segE, L: [["#s122-a", "12.2-a one-hot"], ["#s122-b", "12.2-b sűrű vektorok"]] },
      pos: { t: "Pozíciókódolás (+ összeadás)", x: "Az önfigyelem a sorrendre vak: ha összekevered a tokeneket, ugyanazokat a vektorokat kapod, csak más sorrendben. Ezért minden pozícióhoz hozzáadunk egy vektort. " +
        (s.pos === "learned" ? "Itt ez egy tanult n_max × d táblázat (BERT, GPT-2, a kísérletünk). Az eredeti 2017-es modell rögzített szinuszos kódot használt (0 paraméter), a mai LLM-ek többnyire forgatásosat (RoPE)." : "Itt rögzített szinuszos kód: nincs mit tanulni, 0 paraméter."),
        sh: "n × d (a tokenbeágyazással azonos alakú, összeadjuk)", f: s.pos === "learned" ? "n_max·d = " + w3Int(nmax) + "·" + w3Int(d) : "0 (szinuszos)", v: P.posE, L: [["#s125-c", "12.5-c pozíciókódolás"]] },
      embln: { t: "Rétegnormalizálás a beágyazás után", x: "BERT a beágyazások összege után még egyszer normalizál: tokenenként 0 átlagra és 1 szórásra hozza a d számot, majd tanult γ-val skáláz és β-val tol.",
        sh: "n × d", f: "2·d (γ és β)", v: P.embLN, L: [["#s126-a", "12.6-a rétegnormalizálás"]] },
      attn: { t: dec ? "Maszkolt többfejű önfigyelem" : "Többfejű önfigyelem", x: "Minden token a többiből gyűjt információt: Q = XW_Q, K = XW_K, V = XW_V, majd softmax(QKᵀ/√d_k)·V. " +
        `h = ${H} fej dolgozik párhuzamosan, mindegyik d_k = d/h = ${dkTxt} dimenzióban; a fejek kimenetét összefűzzük, és W_O visszavetíti d-re. A paraméterszám nem függ h-tól: h fej · 3·d·d_k = 3d².` +
        (dec ? " A maszk miatt a t-edik token csak az 1…t pozíciókra figyelhet, a jövőre nem: így tanítható a következő token jóslására." : " Enkóderben nincs maszk: minden token az egész mondatot látja, előre és hátra is."),
        sh: `be/ki: n × ${w3Int(d)}; fejenként Q, K, V: n × ${dkTxt}; súlyok: ${H} × n × n`, f: "4·(d·d + d) = 4d² + 4d  (W_Q, W_K, W_V, W_O + eltolások)", v: P.att,
        L: dec ? [["#s125-a", "12.5-a Q, K, V"], ["#s125-c", "12.5-c több fej"], ["#s126-b", "12.6-b maszkolt figyelem"]] : [["#s125-a", "12.5-a Q, K, V"], ["#s125-b", "12.5-b mátrixalak, √d"], ["#s125-c", "12.5-c több fej"]] },
      addnorm: { t: "Összeadás + rétegnormalizálás", x: "Maradék (reziduális) kapcsolat: a részréteg bemenetét hozzáadjuk a kimenetéhez (x + F(x)), így a gradiens a kerülőúton akadály nélkül jut vissza a mély hálóban. " +
        "Utána rétegnormalizálás: tokenenként 0 átlag, 1 szórás, majd tanult γ, β. Utó-normalizálás: x ← LN(x + F(x)).",
        sh: "n × d", f: "2·d (γ és β; az összeadás ingyen van)", v: 2 * d, L: [["#s126-a", "12.6-a maradék és LN"]] },
      ln: { t: "Rétegnormalizálás (elő-normalizálás)", x: "Elő-normalizálásnál a részréteg a normalizált x-et kapja, a maradékút viszont a normalizálatlan x-et viszi tovább: x ← x + F(LN(x)). " +
        "A „főút” így tiszta összeadások sora, ezért mély hálóban stabilabb a tanítás (GPT-2-től ez a szokásos).",
        sh: "n × d", f: "2·d (γ és β)", v: 2 * d, L: [["#s126-a", "12.6-a maradék és LN"]] },
      add: { t: "Összeadás (maradék kapcsolat)", x: "Itt találkozik a kerülőút (a részréteg bemenete) és a részréteg kimenete: x + F(…). Ha F semmit sem tanult, a jel akkor is változatlanul átjut – " +
        "ezért lehet sok blokkot egymásra tenni. A gradiens is ezen az úton jut vissza.",
        sh: "n × d", f: "0", v: 0, L: [["#s126-a", "12.6-a maradék kapcsolat"]] },
      ffn: { t: "Előrecsatolt háló (FFN)", x: `Tokenenként, egymástól függetlenül ugyanaz a kétrétegű háló: d → d_ff → d (itt ${w3Int(d)} → ${w3Int(ff)} → ${w3Int(d)}), közte ReLU (GPT-ben GELU). ` +
        "A figyelem a tokenek között keveri az információt, az FFN a tokenen belül dolgozza fel. Ha d_ff = 4d, egy blokk paramétereinek kétharmada itt van.",
        sh: `n × ${w3Int(d)} → n × ${w3Int(ff)} → n × ${w3Int(d)}`, f: ffF, v: P.ffn, L: [["#s126-a", "12.6-a a blokk"]] },
      finalln: { t: "Záró rétegnormalizálás", x: "Elő-normalizálásnál az utolsó blokk kimenete normalizálatlan (a főúton csak összeadás van), ezért a kimeneti réteg előtt még egy LN jön (GPT-2).",
        sh: "n × d", f: "2·d", v: P.finalLN, L: [["#s126-a", "12.6-a rétegnormalizálás"]] },
      vecs: { t: "Kimenet: vektor tokenenként", x: "Az enkóder minden tokenhez egy d dimenziós, a környezetet is figyelembe vevő vektort ad: a „bank” vektora más a „folyóparti bank” és a „bank számla” mondatban. " +
        "Osztályozáshoz ebből egyetlen vektort csinálunk: a [CLS] token vektorát vesszük, vagy átlagolunk.",
        sh: "n × d", f: "0", v: 0, L: [["#s126-c", "12.6-c BERT és GPT"]] },
      out: { t: "Következő token", x: "A dekóder az utolsó pozíció eloszlásából választ (mintavételezéssel vagy a legvalószínűbbet), hozzáfűzi a szöveghez, és az egészet újra átküldi a hálón: így generál tokenről tokenre (autoregresszív).",
        sh: "1 token", f: "0", v: 0, L: [["#s126-c", "12.6-c BERT és GPT"]] }
    };
    if (id === "head") {
      if (!dec && s.head === "mean1") return { t: "Átlagolás → 1 kimeneti neuron", x: "A kísérletünkben a tokenek kimeneti vektorait átlagoljuk (n × d → d), majd egyetlen neuron ad logitot; szigmoid után ez a p(pozitív).",
        sh: "n × d → d → 1", f: "d + 1 (súlyok + eltolás)", v: P.headP, L: [["#s128-a", "12.8-a kísérlet"]] };
      if (!dec) return { t: "[CLS] → pooler → osztályozó", x: "BERT a mondat elejére egy [CLS] tokent tesz; ennek kimeneti vektora megy át a pooler rétegen (d × d mátrix, tanh). Erre jön a feladatfüggő osztályozó, amit csak a finomhangoláskor tanítunk – ezt az összeg nem tartalmazza.",
        sh: "d → d → (osztályok)", f: "d·d + d (pooler)", v: P.headP, L: [["#s126-c", "12.6-c BERT és GPT"]] };
      return { t: "Lineáris réteg + softmax a szótár fölött", x: "Minden pozíció vektorát (d) a szótár minden tokenjének vektorával pontszorozzuk: V darab logit, softmax → a következő token eloszlása. " +
        (s.head === "tied" ? "GPT-2-ben ez a mátrix ugyanaz, mint a tokenbeágyazás (súlymegosztás), ezért 0 új paraméter." : "Itt külön kimeneti mátrixot tanítunk (nincs súlymegosztás)."),
        sh: `n × ${w3Int(d)} → n × ${w3Int(V)}`, f: s.head === "tied" ? "0 (súlymegosztás a tokenbeágyazással)" : "V·d", v: P.headP, L: [["#s126-c", "12.6-c BERT és GPT"], ["#s126-b", "12.6-b maszkolás"]] };
    }
    return I[id];
  }

  W["transformer-block"] = root => {
    header(root, "A Transformer felépítése – kattints a dobozokra",
      "Alulról felfelé halad a jel. Válts enkóder (BERT-szerű) és dekóder (GPT-szerű) között, illetve utó- és elő-normalizálás között. " +
      "Kattints bármelyik dobozra (vagy a zöld kerülőútra): jobbra / lent látod, mit csinál, milyen alakú a tenzor, és hány paramétere van. " +
      "Válassz kész modellt, vagy írd át a méreteket – a csík megmutatja, hol van a paraméterek zöme.");
    const uid = "w3m" + Math.random().toString(36).slice(2, 8);
    let s = Object.assign({}, W3_PRESETS.exp), preset = "exp", sel = "attn";
    let headMem = { enc: s.head, dec: "tied" };
    const pg = toggleGroup(Object.entries(W3_PRESETS).map(([k, p]) => [k, p.name]), () => preset, k => { preset = k; s = Object.assign({}, W3_PRESETS[k]); headMem[s.arch] = s.head; syncInputs(); draw(); });
    const ag = toggleGroup([["enc", "enkóder (BERT-szerű)"], ["dec", "dekóder (GPT-szerű)"]], () => s.arch, k => {
      if (k === s.arch) return; headMem[s.arch] = s.head; s.arch = k; s.head = headMem[k] || (k === "dec" ? "tied" : "mean1");
      if (k === "dec") s.seg = false;
      if (sel === "vecs" || sel === "out") sel = "head";
      preset = null; syncInputs(); draw();
    });
    const ng = toggleGroup([["post", "utó-normalizálás (2017, BERT)"], ["pre", "elő-normalizálás (GPT-2-től, mai LLM-ek)"]], () => s.norm, k => {
      if (k === s.norm) return; s.norm = k; s.finalLN = k === "pre"; if (k === "pre") s.embLN = false;
      if (["addnorm", "ln", "add"].includes(sel)) sel = k === "pre" ? "ln" : "addnorm";
      if (sel === "finalln" && k === "post") sel = "head";
      preset = null; syncInputs(); draw();
    });
    const normEq = h("span", { class: "muted", style: "font-family:var(--mono);font-size:.88rem" });
    root.append(h("div", { class: "controls" }, small("kész modell:"), pg.bs),
      h("div", { class: "controls" }, ag.bs), h("div", { class: "controls" }, ng.bs, normEq));

    /* méretek */
    const fields = [["d", "d (modelldimenzió)", 1, 65536], ["h", "h (fejek)", 1, 512], ["N", "N (blokkok)", 1, 500], ["V", "V (szótár)", 1, 1e6], ["nmax", "n_max (kontextus)", 1, 1e6], ["ff", "d_ff (FFN)", 1, 1e6]];
    const inp = {};
    const sizeRow = h("div", { class: "controls" });
    fields.forEach(([k, lab, mn, mx]) => {
      const e = h("input", { type: "number", min: mn, max: mx, step: 1 });
      e.style.width = k === "V" || k === "nmax" || k === "ff" ? "6.4em" : "5.2em";
      e.addEventListener("input", () => {
        const v = Math.round(+e.value);
        if (!Number.isFinite(v) || v < mn || v > mx) return;
        if (k === "d" && s.ff === 4 * s.d) s.ff = 4 * v;          // ha eddig d_ff = 4d volt, maradjon az
        s[k] = v; preset = null; syncInputs(e); draw();
      });
      inp[k] = e;
      sizeRow.append(h("label", null, lab, e));
    });
    const b4d = btn("d_ff = 4d", () => { s.ff = 4 * s.d; preset = null; syncInputs(); draw(); });
    sizeRow.append(b4d);
    root.append(sizeRow);

    /* további szerkezeti beállítások */
    const cPos = checkbox(true, () => { s.pos = cPos.checked ? "learned" : "sin"; preset = null; draw(); });
    const cSeg = checkbox(false, () => { s.seg = cSeg.checked; preset = null; draw(); });
    const cEmbLN = checkbox(false, () => { s.embLN = cEmbLN.checked; preset = null; draw(); });
    const cFinal = checkbox(false, () => { s.finalLN = cFinal.checked; preset = null; draw(); });
    const sHead = h("select");
    sHead.addEventListener("change", () => { s.head = sHead.value; headMem[s.arch] = s.head; preset = null; draw(); });
    const more = h("details", { style: "margin:.2rem 0 .6rem;font-size:.92rem" }, h("summary", { style: "cursor:pointer;color:var(--muted)" }, "további beállítások (pozíció, szegmens, LN, kimeneti fej)"),
      h("div", { class: "controls" }, h("label", null, cPos, "tanult pozícióbeágyazás"), h("label", null, cSeg, "szegmensbeágyazás (BERT)"),
        h("label", null, cEmbLN, "LN a beágyazás után"), h("label", null, cFinal, "záró LN"), h("label", null, "kimeneti fej:", sHead)));
    root.append(more);

    const wrap = h("div", { class: "two-canvas", style: "align-items:start" });
    const svgBox = h("div", { style: "min-width:0;max-width:380px;width:100%;justify-self:center" }), panel = h("div", { style: "min-width:0" });
    wrap.append(svgBox, panel); root.append(wrap);
    const tot = h("div", { class: "readout" }), bar = h("div", { style: "margin-top:.6rem" });
    root.append(tot, bar);

    function syncInputs(except) {
      fields.forEach(([k]) => { if (inp[k] !== except) inp[k].value = s[k]; });
      cPos.checked = s.pos === "learned"; cSeg.checked = s.seg; cEmbLN.checked = s.embLN; cFinal.checked = s.finalLN;
      cSeg.disabled = s.arch === "dec";
      const opts = s.arch === "enc" ? [["mean1", "átlag → 1 neuron (a kísérletünk)"], ["pooler", "[CLS] + pooler (BERT)"]]
        : [["tied", "kötött: = tokenbeágyazás (GPT-2)"], ["untied", "külön V × d mátrix"]];
      sHead.replaceChildren(...opts.map(([v, t]) => h("option", { value: v }, t)));
      sHead.value = s.head;
    }

    /* ---------- az ábra ---------- */
    const X0 = 70, X1 = 282, CX = 176, LANE = 312, BH = 38, GAP = 22, CR = 10, VW = 340;
    const colOf = { tok: "--muted", emb: "--setA", pos: "--setA", embln: "--setC", attn: "--accent", addnorm: "--setC", ln: "--setC", ffn: "--setB", finalln: "--setC", head: "--muted", vecs: "--muted", out: "--muted", add: "--setC" };
    function draw() {
      pg.paint(); ag.paint(); ng.paint();
      normEq.textContent = s.norm === "post" ? "x ← LN(x + F(x))" : "x ← x + F(LN(x))";
      const P = w3Params(s), dec = s.arch === "dec";
      const sub = {
        tok: `n ≤ ${w3Int(s.nmax)} azonosító`, emb: (s.seg ? "V·d + 2d = " : "V·d = ") + w3Short(P.tokE + P.segE), pos: s.pos === "learned" ? "n_max·d = " + w3Short(P.posE) : "szinuszos: 0",
        embln: "2d = " + w3Short(2 * s.d), attn: "4d² + 4d = " + w3Short(P.att), addnorm: "2d = " + w3Short(2 * s.d), ln: "2d = " + w3Short(2 * s.d),
        ffn: (s.ff === 4 * s.d ? "8d² + 5d = " : "2d·d_ff + d_ff + d = ") + w3Short(P.ffn), finalln: "2d = " + w3Short(2 * s.d),
        head: dec ? (s.head === "tied" ? "kötött: 0 új paraméter" : "V·d = " + w3Short(P.headP)) : (s.head === "pooler" ? "d² + d = " + w3Short(P.headP) : "d + 1 = " + w3Short(P.headP)),
        vecs: "n × d", out: "mintavétel, hozzáfűzés"
      };
      const name = {
        tok: "tokenek", emb: "tokenbeágyazás", pos: "pozíciókódolás", embln: "rétegnormalizálás", attn: dec ? "maszkolt többfejű önfigyelem" : "többfejű önfigyelem",
        addnorm: "összeadás + rétegnormalizálás", ln: "rétegnormalizálás", ffn: "előrecsatolt háló (FFN)", finalln: "záró rétegnormalizálás",
        head: dec ? "lineáris + softmax (V)" : (s.head === "pooler" ? "[CLS] → pooler → osztályozó" : "átlag → 1 neuron → szigmoid"),
        vecs: "kontextuális vektor tokenenként", out: "következő token"
      };
      /* elemek alulról felfelé; y = távolság az aljától */
      const els = [], res = [];
      let y = 12;
      const box = (id, x0 = X0, x1 = X1) => { const e = { k: "box", id, x0, x1, yb: y, yt: y + BH }; els.push(e); y += BH + GAP; return e; };
      const add = id => { const e = { k: "add", id, yb: y, yt: y + 2 * CR }; els.push(e); y += 2 * CR + GAP; return e; };
      box("tok");
      const half = (X1 - X0 - 10) / 2;
      const eE = { k: "box", id: "emb", x0: X0, x1: X0 + half, yb: y, yt: y + BH }, eP = { k: "box", id: "pos", x0: X1 - half, x1: X1, yb: y, yt: y + BH };
      els.push(eE, eP); y += BH + GAP;
      const posAdd = add("pos");
      if (s.embLN) box("embln");
      const blockStart = y;
      if (s.norm === "post") {
        res.push({ from: y - GAP / 2 }); box("attn"); const a1 = box("addnorm"); res[0].to = a1;
        res.push({ from: y - GAP / 2 }); box("ffn"); const a2 = box("addnorm"); res[1].to = a2;
      } else {
        res.push({ from: y - GAP / 2 }); box("ln"); box("attn"); const a1 = add("add"); res[0].to = a1;
        res.push({ from: y - GAP / 2 }); box("ln"); box("ffn"); const a2 = add("add"); res[1].to = a2;
      }
      const blockEnd = y - GAP;
      if (s.finalLN) box("finalln");
      if (dec) { box("head"); box("out"); } else { box("vecs"); box("head"); }
      const HH = y - GAP + 12, Y = v => HH - v;
      const svg = w3S("svg", { viewBox: `0 0 ${VW} ${HH}`, width: "100%", role: "img", "aria-label": "A Transformer blokkdiagramja", style: "display:block;font-family:var(--font);user-select:none" });
      svg.append(w3S("defs", null,
        w3S("marker", { id: uid + "a", viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: "auto-start-reverse" }, w3S("path", { d: "M0,0 L10,5 L0,10 z", style: "fill:var(--muted)" })),
        w3S("marker", { id: uid + "r", viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: "auto-start-reverse" }, w3S("path", { d: "M0,0 L10,5 L0,10 z", style: "fill:var(--setC)" }))));
      /* blokk-keret */
      const fy0 = Y(blockEnd + 9), fy1 = Y(blockStart - 17);
      svg.append(w3S("rect", { x: X0 - 26, y: fy0, width: LANE + 16 - (X0 - 26), height: fy1 - fy0, rx: 10, style: "fill:color-mix(in srgb, var(--bg-soft) 70%, transparent);stroke:var(--border);stroke-width:1.5;stroke-dasharray:5 4" }));
      const midY = (fy0 + fy1) / 2;
      svg.append(w3S("text", { x: X0 - 12, y: midY, transform: `rotate(-90 ${X0 - 12} ${midY})`, "text-anchor": "middle", style: "font-size:12px;font-weight:700;fill:var(--muted)" }, `blokk × ${s.N}`));
      /* főút nyilai */
      const line = (x0, y0, x1, y1, col = "var(--muted)", mk = "a") => svg.append(w3S("line", { x1: x0, y1: y0, x2: x1, y2: y1, "marker-end": `url(#${uid}${mk})`, style: `stroke:${col};stroke-width:1.6` }));
      const main = els.filter(e => e !== eE && e !== eP);
      for (let i = 0; i + 1 < main.length; i++) {
        const a = main[i], b = main[i + 1];
        if (a.id === "tok") { line(CX - 30, Y(a.yt), (eE.x0 + eE.x1) / 2, Y(eE.yb)); line(CX + 30, Y(a.yt), (eP.x0 + eP.x1) / 2, Y(eP.yb)); continue; }
        line(CX, Y(a.yt), CX, Y(b.yb) + 1);
      }
      line((eE.x0 + eE.x1) / 2, Y(eE.yt), CX - CR, Y(posAdd.yb + CR));
      line((eP.x0 + eP.x1) / 2, Y(eP.yt), CX + CR, Y(posAdd.yb + CR));
      /* maradék kapcsolatok */
      res.forEach(r => {
        const yb = Y(r.from), yt = Y((r.to.yb + r.to.yt) / 2), xe = r.to.k === "add" ? CX + CR : X1;
        const d = `M${CX},${yb} H${LANE} V${yt} H${xe + 1}`;
        const g = w3S("g", { style: "cursor:pointer", onclick: () => { sel = "res"; draw(); } });
        g.append(w3S("path", { d, style: `fill:none;stroke:var(--setC);stroke-width:${sel === "res" ? 3.2 : 2}`, "marker-end": `url(#${uid}r)` }),
          w3S("path", { d, style: "fill:none;stroke:transparent;stroke-width:14" }),
          w3S("circle", { cx: CX, cy: yb, r: 3.2, style: "fill:var(--setC)" }));
        svg.append(g);
        const my = (yb + yt) / 2;
        svg.append(w3S("text", { x: LANE + 11, y: my, transform: `rotate(90 ${LANE + 11} ${my})`, "text-anchor": "middle", style: "font-size:10.5px;fill:var(--setC);font-weight:600;pointer-events:none" }, "maradék"));
      });
      /* dobozok és összeadó csomópontok */
      els.forEach(e => {
        const isSel = sel === e.id || (sel === "res" && e.k === "add");
        const g = w3S("g", { style: "cursor:pointer", tabindex: 0, role: "button", onclick: () => { sel = e.id; draw(); },
          onkeydown: ev => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); sel = e.id; draw(); } } });
        if (e.k === "add") {
          const cy = Y(e.yb + CR);
          g.append(w3S("circle", { cx: CX, cy, r: CR, style: `fill:var(--card);stroke:var(${e.id === "pos" ? "--setA" : "--setC"});stroke-width:${isSel ? 3 : 1.8}` }),
            w3S("path", { d: `M${CX - 5.5},${cy} H${CX + 5.5} M${CX},${cy - 5.5} V${cy + 5.5}`, style: "stroke:var(--text);stroke-width:1.8" }));
        } else {
          const c = colOf[e.id], narrow = e.x1 - e.x0 < 150, tx = (e.x0 + e.x1) / 2;
          g.append(w3S("rect", { x: e.x0, y: Y(e.yt), width: e.x1 - e.x0, height: BH, rx: 8,
            style: `fill:color-mix(in srgb, var(${c}) ${isSel ? 30 : 13}%, var(--card));stroke:${isSel ? "var(--text)" : `var(${c})`};stroke-width:${isSel ? 2.4 : 1.4}` }),
            w3S("text", { x: tx, y: Y(e.yt) + 16, "text-anchor": "middle", style: `font-size:${narrow ? 11 : 12}px;font-weight:600;fill:var(--text)` }, name[e.id]),
            w3S("text", { x: tx, y: Y(e.yt) + 30, "text-anchor": "middle", style: `font-size:${narrow ? 9.5 : 10}px;fill:var(--muted)` }, sub[e.id]));
        }
        svg.append(g);
      });
      svgBox.replaceChildren(svg);
      showPanel(P);
      showTotals(P);
    }

    function showPanel(P) {
      let I;
      if (sel === "res") I = { t: "Maradék (reziduális) kapcsolat", x: "A zöld kerülőút a részréteg (figyelem vagy FFN) bemenetét változtatás nélkül viszi át, és hozzáadja a kimenethez: x + F(x). " +
        "Így a blokk csak a „javítást” tanulja meg, és a gradiens akadály nélkül jut vissza a legalsó rétegekig. " +
        (s.norm === "post" ? "Utó-normalizálásnál az összeg után jön az LN: x ← LN(x + F(x))." : "Elő-normalizálásnál a kerülőúton nincs LN, csak a részréteg előtt: x ← x + F(LN(x))."),
        sh: "n × d (az összeadáshoz a két ágnak azonos alakúnak kell lennie)", f: "0", v: 0, L: [["#s126-a", "12.6-a maradék kapcsolat"]] };
      else I = w3Info(sel, s, P);
      const inBlock = ["attn", "addnorm", "ln", "add", "ffn"].includes(sel) || sel === "res";
      panel.replaceChildren(
        h("div", { style: "font-weight:700;margin-bottom:.25rem" }, I.t),
        h("p", { style: "margin:.2rem 0 .5rem;font-size:.95rem" }, I.x),
        h("div", { class: "readout", style: "margin-top:0" },
          h("div", null, h("span", { class: "muted" }, "alak: "), I.sh),
          h("div", null, h("span", { class: "muted" }, "paraméter: "), I.f),
          h("div", null, h("span", { class: "muted" }, "most: "), h("b", null, w3Int(I.v)), inBlock && I.v ? h("span", { class: "muted" }, ` (blokkonként; × ${s.N} blokk = ${w3Int(I.v * s.N)})`) : null)),
        h("div", { style: "margin-top:.45rem;font-size:.9rem" }, "Bővebben: ", ...I.L.flatMap(([href, t], i) => [i ? " · " : "", h("a", { href }, t)])));
    }

    function showTotals(P) {
      const p = preset ? W3_PRESETS[preset] : null, dk = s.d / s.h;
      const blockF = s.ff === 4 * s.d ? `12d² + 13d = ${w3Int(P.block)}` : `4d² + 4d + 2d·d_ff + d_ff + d + 4d = ${w3Int(P.block)}`;
      tot.innerHTML = `összesen: <b>${w3Int(P.total)}</b> paraméter` + (P.total >= 1e6 ? ` (≈ ${w3Big(P.total)})` : "") + "<br>" +
        `egy blokk: ${blockF} &nbsp;(figyelem 4d² + 4d = ${w3Int(P.att)}, FFN ${w3Int(P.ffn)}, 2 LN 4d = ${w3Int(P.ln)})<br>` +
        `fejenként d_k = d/h = ${Number.isInteger(dk) ? w3Int(dk) : `<span style="color:var(--bad)">${fmt(dk, 2)} ⚠ d legyen h többszöröse</span>`}` +
        (p ? `<br><span class="muted">${p.note}</span>` : `<br><span class="muted">egyedi beállítás</span>`);
      const parts = [["beágyazások", P.emb, "--setA"], ["figyelem (blokkok)", s.N * P.att, "--accent"], ["FFN (blokkok)", s.N * P.ffn, "--setB"],
        ["LN (blokkok)", s.N * P.ln, "--setC"], ["fej" + (P.finalLN ? " + záró LN" : ""), P.headP + P.finalLN, "--muted"]];
      const T = P.total || 1;
      bar.replaceChildren(
        h("div", { style: "display:flex;height:18px;border-radius:6px;overflow:hidden;border:1px solid var(--border)" },
          parts.filter(q => q[1] > 0).map(([n, v, c]) => h("div", { title: `${n}: ${w3Int(v)}`, style: `width:${(100 * v / T).toFixed(3)}%;min-width:2px;background:var(${c})` }))),
        h("div", { style: "display:flex;flex-wrap:wrap;gap:.2rem 1rem;margin-top:.35rem;font-size:.85rem" },
          parts.map(([n, v, c]) => h("span", { style: "display:inline-flex;align-items:center;gap:.3rem;white-space:nowrap" },
            h("span", { style: `width:.75rem;height:.75rem;border-radius:3px;background:var(${c});display:inline-block` }), n + ": ",
            h("b", { style: "font-family:var(--mono)" }, w3Short(v)), h("span", { class: "muted" }, ` (${v / T < 0.0005 && v > 0 ? "<0,1" : fmt(100 * v / T, 1)}%)`)))));
    }
    syncInputs(); draw();
  };

  /* ==================================================================
     12.8-a  review-lab – hat modell a mesterséges filmkritikákon
     ================================================================== */
  const W3_SUBJ = ["film", "zene", "történet", "vége", "látvány", "rendezés"];
  const W3_POS = ["jó", "izgalmas", "szép", "eredeti", "remek"], W3_NEG = ["rossz", "unalmas", "gyenge", "zavaros", "fárasztó"];
  const W3_INTP = ["nagyon", "elég", "igazán"], W3_INTN = ["túl", "igazán", "eléggé"];
  const W3_NAMES = { bow1: "szózsák", bow2: "szózsák + szópárok", avg: "átlagolt beágyazás", rnn: "RNN", tf_nopos: "Transformer pozíció nélkül", tf: "Transformer" };
  const W3_ACC = { bow1: [51.2, 54.9, 51.1, 51.3], bow2: [93.5, 100, 100, 86.7], avg: [63.5, 100, 74.7, 51.2], rnn: [100, 100, 100, 100], tf_nopos: [62.5, 98.0, 74.6, 49.5], tf: [99.9, 100, 99.9, 100] };
  const W3_KEYS = ["bow1", "bow2", "avg", "rnn", "tf_nopos", "tf"];
  const w3Clause = c => (c.neg ? ["a", c.s, "nem", "volt", ...(c.i ? [c.i] : []), c.adj] : ["a", c.s, ...(c.i ? [c.i] : []), c.adj, "volt"]);
  const w3Pol = c => (W3_POS.includes(c.adj) ? 1 : -1) * (c.neg ? -1 : 1);
  const w3Tokens = st => (st.conn ? w3Clause(st.c1).concat([",", st.conn], w3Clause(st.c2)) : w3Clause(st.c1));
  const w3Pick = a => a[Math.floor(Math.random() * a.length)];
  function w3RandClause(pol, avoid) {
    for (;;) {
      const s = w3Pick(W3_SUBJ.filter(x => x !== avoid)), neg = Math.random() < 0.5, adjPos = Math.random() < 0.5;
      const adj = w3Pick(adjPos ? W3_POS : W3_NEG), c = { s, neg, adj, i: "" };
      if (pol != null && w3Pol(c) !== pol) continue;
      if (Math.random() < 0.5) c.i = w3Pick(neg ? W3_INTN : W3_INTP);
      return c;
    }
  }
  function w3RandReview() {
    const r = Math.random(), k = r < 0.4 ? "" : r < 0.7 ? "de" : "és", c1 = w3RandClause();
    return { c1, conn: k, c2: k ? w3RandClause(k === "de" ? -w3Pol(c1) : w3Pol(c1), c1.s) : w3RandClause(-w3Pol(c1), c1.s) };
  }
  /* a szabály szerinti címke: +1 / −1 / null (ha „és” ellentétes tagmondatokat köt) */
  function w3Rule(st) {
    const p1 = w3Pol(st.c1);
    if (!st.conn) return p1;
    const p2 = w3Pol(st.c2);
    return st.conn === "de" ? p2 : (p1 === p2 ? p1 : null);
  }

  /* --- a hat modell előreterjesztése (a PyTorch / scikit-learn modellek pontos másolata) --- */
  const w3Lin = (Wm, b, x) => Wm.map((row, i) => row.reduce((acc, w, j) => acc + w * x[j], b ? b[i] : 0));
  function w3LN(x, g, b) {
    const n = x.length, m = x.reduce((a, v) => a + v, 0) / n, v = x.reduce((a, u) => a + (u - m) * (u - m), 0) / n, sd = Math.sqrt(v + 1e-5);
    return x.map((u, i) => ((u - m) / sd) * g[i] + b[i]);
  }
  const w3Sig = z => 1 / (1 + Math.exp(-z));
  const w3Pct = p => (p < 0.0005 ? "< 0,1%" : p > 0.9995 ? "> 99,9%" : (100 * p).toFixed(1).replace(".", ",") + "%");
  function w3Models(R) {
    const ix = Object.fromEntries(R.vocab.map((w, i) => [w, i]));
    const wmap = {};
    ["bow1", "bow2"].forEach(k => { wmap[k] = new Map(R[k].feats.map((f, i) => [f, R[k].w[i]])); });
    function bow(k, toks) {
      const cnt = new Map(), add = f => cnt.set(f, (cnt.get(f) || 0) + 1);
      toks.forEach(add);
      if (k === "bow2") for (let i = 0; i + 1 < toks.length; i++) add(toks[i] + " " + toks[i + 1]);
      const contrib = [];
      let z = R[k].b;
      cnt.forEach((c, f) => { const w = wmap[k].get(f); if (w === undefined) return; z += c * w; contrib.push([f, c, w, c * w]); });
      return { logit: z, contrib };
    }
    function avg(toks) {
      const M = R.avg, E = M["E.weight"], d = E[0].length, e = new Array(d).fill(0);
      toks.forEach(t => E[ix[t]].forEach((v, j) => { e[j] += v / toks.length; }));
      const hh = w3Lin(M["f.0.weight"], M["f.0.bias"], e).map(v => Math.max(0, v));
      return { logit: w3Lin(M["f.2.weight"], M["f.2.bias"], hh)[0] };
    }
    function rnn(toks) {
      const M = R.rnn, E = M["E.weight"];
      let hh = new Array(M["W.weight"].length).fill(0);
      toks.forEach(t => {
        const u = w3Lin(M["U.weight"], M["U.bias"], E[ix[t]]), w = w3Lin(M["W.weight"], null, hh);
        hh = u.map((v, i) => Math.tanh(v + w[i]));
      });
      return { logit: w3Lin(M["o.weight"], M["o.bias"], hh)[0] };
    }
    function tf(k, toks) {
      const M = R[k], E = M["E.weight"], Pm = M["P.weight"], n = toks.length, d = E[0].length, H = 2, dh = d / H;
      let x = toks.map((t, p) => E[ix[t]].map((v, j) => v + (Pm ? Pm[p][j] : 0)));
      const Q = x.map(r => w3Lin(M["q.weight"], M["q.bias"], r)), K = x.map(r => w3Lin(M["k.weight"], M["k.bias"], r)), V = x.map(r => w3Lin(M["v.weight"], M["v.bias"], r));
      const att = [], cat = x.map(() => new Array(d).fill(0));
      for (let hd = 0; hd < H; hd++) {
        const o = hd * dh, A = [];
        for (let i = 0; i < n; i++) {
          const sc = [];
          for (let j = 0; j < n; j++) { let z = 0; for (let c = 0; c < dh; c++) z += Q[i][o + c] * K[j][o + c]; sc.push(z / Math.sqrt(dh)); }
          const a = softmax(sc); A.push(a);
          for (let j = 0; j < n; j++) for (let c = 0; c < dh; c++) cat[i][o + c] += a[j] * V[j][o + c];
        }
        att.push(A);
      }
      x = x.map((r, i) => { const oa = w3Lin(M["oa.weight"], M["oa.bias"], cat[i]); return w3LN(r.map((v, j) => v + oa[j]), M["ln1.weight"], M["ln1.bias"]); });
      x = x.map(r => {
        const hh = w3Lin(M["ff.0.weight"], M["ff.0.bias"], r).map(v => Math.max(0, v)), f = w3Lin(M["ff.2.weight"], M["ff.2.bias"], hh);
        return w3LN(r.map((v, j) => v + f[j]), M["ln2.weight"], M["ln2.bias"]);
      });
      const pooled = new Array(d).fill(0);
      x.forEach(r => r.forEach((v, j) => { pooled[j] += v / n; }));
      return { logit: w3Lin(M["o.weight"], M["o.bias"], pooled)[0], att };
    }
    const run = (k, toks) => (k === "bow1" || k === "bow2" ? bow(k, toks) : k === "avg" ? avg(toks) : k === "rnn" ? rnn(toks) : tf(k, toks));
    return { run, all: toks => Object.fromEntries(W3_KEYS.map(k => { const r = run(k, toks); r.p = w3Sig(r.logit); return [k, r]; })) };
  }

  W["review-lab"] = root => {
    header(root, "Hat modell, egy filmkritika",
      "Rakj össze egy kritikát a legördülőkből (vagy kérj véletlent), és nézd meg, mit mond rá a hat modell. A szabály: a tagmondat pozitív, ha a melléknév pozitív, " +
      "de a „nem” megfordítja; „de” után a második tagmondat dönt, „és” esetén a kettő egyezik. Próbáld ki a <b>tagmondatok cseréjét</b>: melyik modell veszi észre?");
    const R = window.REVIEW12;
    if (!R) { root.append(small("Hiányzik a review-models.js adatfájl.")); return; }
    const MD = w3Models(R);
    let st = { c1: { s: "film", neg: false, i: "", adj: "jó" }, conn: "de", c2: { s: "vége", neg: false, i: "", adj: "unalmas" } };
    let prev = null, panelKey = "att", attModel = "tf", head = 0, cell = null;

    /* --- a mondatszerkesztő --- */
    const opt = (v, t, sel) => { const o = h("option", { value: v }, t); if (sel) o.selected = true; return o; };
    function clauseRow(which) {
      const c = st[which], row = h("div", { class: "controls", style: "margin:.3rem 0" });
      const sS = h("select", { "aria-label": "alany" }, W3_SUBJ.map(x => opt(x, x, x === c.s)));
      const sF = h("select", { "aria-label": "alak" }, opt("p", "állító", !c.neg), opt("n", "tagadó (nem)", c.neg));
      const sI = h("select", { "aria-label": "fokozó" }, opt("", "–", !c.i), (c.neg ? W3_INTN : W3_INTP).map(x => opt(x, x, x === c.i)));
      const sA = h("select", { "aria-label": "melléknév" }, h("optgroup", { label: "pozitív" }, W3_POS.map(x => opt(x, x, x === c.adj))),
        h("optgroup", { label: "negatív" }, W3_NEG.map(x => opt(x, x, x === c.adj))));
      sS.addEventListener("change", () => { c.s = sS.value; changed(); });
      sF.addEventListener("change", () => { c.neg = sF.value === "n"; if (c.i && !(c.neg ? W3_INTN : W3_INTP).includes(c.i)) c.i = ""; changed(true); });
      sI.addEventListener("change", () => { c.i = sI.value; changed(); });
      sA.addEventListener("change", () => { c.adj = sA.value; changed(); });
      row.append(h("span", { style: "font-weight:600;font-size:.92rem;min-width:6.6rem" }, which === "c1" ? "1. tagmondat:" : "2. tagmondat:"), h("span", { class: "muted" }, "a"), sS, sF, sI, sA);
      return row;
    }
    const ed = h("div"), sConn = h("select", { "aria-label": "kötőszó" }, opt("", "nincs (egy tagmondat)"), opt("de", "„, de”"), opt("és", "„, és”"));
    sConn.addEventListener("change", () => {
      const k = sConn.value;
      if (k && k !== st.conn) st.c2 = w3RandClause(k === "de" ? -w3Pol(st.c1) : w3Pol(st.c1), st.c1.s);
      st.conn = k; changed(true);
    });
    const bRand = btn("🎲 véletlen kritika", () => { st = w3RandReview(); changed(true); }, "btn primary");
    const bSwap = btn("⇄ a két tagmondat cseréje", () => {
      if (!st.conn) return;
      const before = res;
      [st.c1, st.c2] = [st.c2, st.c1]; changed(true);
      prev = before;
      paint();
    });
    const edConn = h("div", { class: "controls", style: "margin:.3rem 0" }, h("span", { style: "font-weight:600;font-size:.92rem;min-width:6.6rem" }, "kötőszó:"), sConn);
    root.append(ed, h("div", { class: "controls" }, bRand, bSwap));
    const chips = h("div", { style: "display:flex;flex-wrap:wrap;gap:.3rem;margin:.5rem 0 .3rem" });
    const ruleOut = h("div", { style: "font-size:.95rem" }), oodOut = h("div", { style: "font-size:.88rem;color:var(--bad);margin-top:.2rem" });
    const tblBox = h("div", { class: "tw", style: "overflow-x:auto;margin-top:.5rem" }), swapNote = h("div", { style: "font-size:.9rem;margin-top:.3rem" });
    root.append(chips, ruleOut, oodOut, tblBox, swapNote);

    /* --- a panel: figyelem / szózsák-súlyok --- */
    const pg = toggleGroup([["att", "Transformer figyelme"], ["bow1", "szózsák súlyai"], ["bow2", "szópárok súlyai"]], () => panelKey, k => { panelKey = k; cell = null; paintPanel(); });
    const mg = toggleGroup([["tf", "Transformer"], ["tf_nopos", "pozíció nélkül"]], () => attModel, k => { attModel = k; paintPanel(); });
    const hg = toggleGroup([["0", "1. fej"], ["1", "2. fej"]], () => head, k => { head = +k; paintPanel(); });
    const subCtl = h("div", { class: "controls" }, mg.bs, h("span", { style: "width:.4rem" }), hg.bs);
    const pBody = h("div"), pInfo = h("div", { class: "readout" });
    root.append(h("div", { style: "margin-top:1rem;padding-top:.6rem;border-top:1px solid var(--border)" }, h("div", { class: "controls" }, small("belenézés:"), pg.bs), subCtl, pBody, pInfo));

    /* --- pontossági táblázat --- */
    const accF = v => (v === 100 ? "100" : v.toFixed(1).replace(".", ","));
    const TH = "padding:.25rem .45rem;font-size:.8rem;white-space:nowrap", TD = "padding:.25rem .45rem;font-family:var(--mono);text-align:right;white-space:nowrap";
    root.append(h("div", { style: "font-weight:600;margin-top:1rem" }, "Pontosság a tesztmondatokon (%, 5 véletlen kezdés átlaga)"),
      h("div", { class: "tw", style: "overflow-x:auto" }, h("table", { style: "margin:.3rem 0;font-size:.86rem;width:100%" },
        h("thead", null, h("tr", null, h("th", { style: TH }, "modell"), h("th", { style: TH }, "paraméter"), h("th", { style: TH }, "összes"), h("th", { style: TH }, "egy tagmondat"),
          h("th", { style: TH }, "„és”"), h("th", { style: TH }, "„de”"))),
        h("tbody", null, W3_KEYS.map(k => h("tr", null, h("td", { style: "padding:.25rem .45rem" }, W3_NAMES[k]), h("td", { style: TD }, w3Int(R[k].nparams)),
          W3_ACC[k].map((v, j) => h("td", { style: TD + (v >= 99 ? ";color:var(--ok);font-weight:700" : v < 60 ? ";color:var(--bad)" : "") + (j === 0 ? ";font-weight:700" : "") }, accF(v)))))))),
      h("p", { class: "muted", style: "font-size:.85rem;margin:.3rem 0 0" },
        "Mesterséges nyelv, 3000 tanítómondat; a modelleket Pythonban (PyTorch, scikit-learn) tanítottuk, itt csak futnak. A fenti valószínűségeket az első (0. seedű) futás modelljei adják, " +
        "a táblázat 5 futás átlaga. Forrás: _parts/calc/c12_models.py, c12_export_models.py."));

    let res = null;
    function changed(rebuild) {
      prev = null; cell = null;
      if (rebuild !== false) buildEditor();
      res = MD.all(w3Tokens(st));
      paint();
    }
    function buildEditor() {
      sConn.value = st.conn;
      ed.replaceChildren(clauseRow("c1"), edConn, ...(st.conn ? [clauseRow("c2")] : []));
      setDis(bSwap, !st.conn);
    }
    const lab = p => (p > 0 ? "pozitív" : "negatív");
    const polCol = p => (p > 0 ? "var(--setB)" : "var(--setA)");
    function clauseExpl(c) {
      const a = W3_POS.includes(c.adj) ? 1 : -1;
      return `»${c.adj}« ${lab(a)}` + (c.neg ? ", de »nem« megfordítja" : "") + ` → <b style="color:${polCol(w3Pol(c))}">${lab(w3Pol(c))}</b>`;
    }
    function paint() {
      const toks = w3Tokens(st), n1 = w3Clause(st.c1).length, rule = w3Rule(st);
      chips.replaceChildren(...toks.map((t, i) => h("span", { class: "chip" + (i < n1 ? " a" : i >= n1 + 2 ? " b" : ""), style: "font-weight:500" }, t)));
      let ex = (st.conn ? "1. tagmondat: " : "") + clauseExpl(st.c1);
      if (st.conn) ex += "; 2. tagmondat: " + clauseExpl(st.c2) + (st.conn === "de" ? "; „de” után a második dönt" : rule == null ? "; „és”, de a két tagmondat ellentétes" : "; „és”: a kettő egyezik");
      ruleOut.innerHTML = `A szabály szerint: ${rule == null ? "<b>nincs egyértelmű címke</b>" : `<b style="color:${polCol(rule)}">${lab(rule)}</b>`} <span class="muted">(${ex})</span>`;
      const ood = [];
      if (st.conn === "de" && w3Pol(st.c1) === w3Pol(st.c2)) ood.push("a tanítóadatban a „de” mindig ellentétes tagmondatokat köt össze");
      if (st.conn === "és" && w3Pol(st.c1) !== w3Pol(st.c2)) ood.push("a tanítóadatban az „és” mindig azonos hangulatú tagmondatokat köt össze");
      if (st.conn && st.c1.s === st.c2.s) ood.push("a generátor a két tagmondatban mindig különböző alanyt használ");
      oodOut.textContent = ood.length ? "⚠ Ilyen mondat nem fordul elő a tanításban: " + ood.join("; ") + "." : "";
      /* modellsorok */
      const rows = W3_KEYS.map(k => {
        const p = res[k].p, ok = rule == null ? null : (p > 0.5) === (rule > 0);
        const pv = prev ? prev[k].p : null, same = prev && Math.abs(pv - p) < 1e-9;
        const track = h("div", { style: "position:relative;height:14px;background:var(--bg-soft);border-radius:4px;min-width:50px" },
          h("div", { style: `position:absolute;left:0;top:0;bottom:0;width:${(100 * p).toFixed(2)}%;background:${p >= 0.5 ? "var(--setB)" : "var(--setA)"};border-radius:4px` }),
          h("div", { style: "position:absolute;left:50%;top:-2px;bottom:-2px;border-left:1px dashed var(--muted)" }),
          prev ? h("div", { title: "a csere előtt", style: `position:absolute;left:calc(${(100 * pv).toFixed(2)}% - 1.5px);top:-3px;bottom:-3px;width:3px;background:var(--text);border-radius:2px` }) : null);
        return h("tr", null,
          h("td", { style: "padding:.3rem .45rem" }, W3_NAMES[k]),
          h("td", { style: "padding:.3rem .45rem;width:40%;vertical-align:middle" }, track),
          h("td", { style: "padding:.3rem .45rem;font-family:var(--mono);text-align:right;white-space:nowrap" }, w3Pct(p)),
          h("td", { style: `padding:.3rem .45rem;text-align:center;font-weight:700;color:${ok == null ? "var(--muted)" : ok ? "var(--ok)" : "var(--bad)"}` }, ok == null ? "–" : ok ? "✓" : "✗"),
          prev ? h("td", { style: "padding:.3rem .45rem;font-size:.82rem;white-space:nowrap" + (same ? ";color:var(--setC);font-weight:700" : "") }, same ? "pontosan ugyanaz" : `előtte ${w3Pct(pv)}`) : null);
      });
      const th = t => h("th", { style: "padding:.25rem .45rem;font-size:.8rem;white-space:nowrap" }, t);
      tblBox.replaceChildren(h("table", { style: "margin:0;font-size:.9rem;width:100%" },
        h("thead", null, h("tr", null, th("modell"), h("th", { colspan: 2, style: "padding:.25rem .45rem;font-size:.8rem" }, "p(pozitív)"), th("jó?"), prev ? th("a csere előtt") : null)), h("tbody", null, rows)));
      swapNote.innerHTML = prev
        ? "<b>A csere után</b> a szózsák, az átlagolt beágyazás és a pozíció nélküli Transformer <b>pontosan ugyanazt</b> mondja: ugyanazok a tokenek, csak más sorrendben – a sorrendet ezek a modellek nem látják. " +
          "Az RNN és a pozíciókódolásos Transformer viszont követi a cserét. A szópárok modell csak a tagmondatok határán keletkező szópárokon keresztül érzékelheti a cserét " +
          (Math.abs(prev.bow2.p - res.bow2.p) < 1e-9 ? "(most ugyanazok: »volt ,« mindkét változatban, ezért ő sem változott)." : "(most más szópár került a vessző elé, ezért kicsit változott).")
        : "";
      paintPanel();
    }
    function paintPanel() {
      pg.paint(); mg.paint(); hg.paint();
      const toks = w3Tokens(st);
      subCtl.style.display = panelKey === "att" ? "" : "none";
      if (panelKey === "att") {
        const A = res[attModel].att[head], n = toks.length, mx = Math.max(...A.flat());
        const cs = "padding:0;border:1px solid var(--card);width:1.55rem;min-width:1.55rem;height:1.55rem;cursor:pointer";
        const tb = h("tbody", null, A.map((row, i) => h("tr", null,
          h("th", { style: "padding:0 .4rem 0 0;border:none;background:none;text-align:right;font-weight:500;font-size:.8rem;white-space:nowrap" }, toks[i], h("sub", { class: "muted" }, String(i + 1))),
          row.map((a, j) => {
            const t = Math.sqrt(a / mx), on = cell && cell[0] === i && cell[1] === j;
            return h("td", { title: `${toks[i]} → ${toks[j]}: ${fmt(a, 3)}`, style: cs + `;background:color-mix(in srgb, var(--accent) ${(100 * t).toFixed(1)}%, var(--card))` + (on ? ";outline:2px solid var(--setB);outline-offset:-2px" : ""),
              onclick: () => { cell = [i, j]; paintPanel(); }, onmouseenter: () => { cell = [i, j]; showCell(); } });
          }))));
        const hd = h("tr", null, h("th", { style: "border:none;background:none" }), toks.map((t, j) => h("th", {
          style: "padding:.15rem 0;border:none;background:none;font-weight:500;font-size:.8rem;writing-mode:vertical-rl;transform:rotate(180deg);text-align:left;white-space:nowrap;vertical-align:bottom" },
          t, h("sub", { class: "muted" }, String(j + 1)))));
        pBody.replaceChildren(
          h("div", { style: "font-size:.88rem;margin:.2rem 0 .3rem", class: "muted" }, `Sorok: ki figyel (lekérdezés, Q); oszlopok: kire (kulcs, K). Minden sor összege 1; sötétebb = nagyobb súly. ` +
            (attModel === "tf_nopos" ? "Pozíció nélkül a két »a« és a két »volt« sora teljesen egyforma – a modell nem tudja megkülönböztetni őket." : "")),
          h("div", { class: "tw", style: "overflow-x:auto" }, h("table", { style: "width:auto;margin:0;border-collapse:collapse" }, h("thead", null, hd), tb)));
        showCell();
      } else {
        const r = res[panelKey], list = r.contrib.slice().sort((a, b) => Math.abs(b[3]) - Math.abs(a[3])), top = list.slice(0, 12);
        const mxc = Math.max(1e-9, ...top.map(q => Math.abs(q[3])));
        const half = (v, neg) => h("div", { style: `flex:1;display:flex;justify-content:${neg ? "flex-end" : "flex-start"}` },
          (neg ? v < 0 : v > 0) ? h("div", { style: `height:10px;width:${(100 * Math.abs(v) / mxc).toFixed(1)}%;background:${v > 0 ? "var(--setB)" : "var(--setA)"};border-radius:3px` }) : null);
        pBody.replaceChildren(
          h("div", { style: "font-size:.88rem;margin:.2rem 0 .3rem", class: "muted" },
            `A mondatban lévő ${panelKey === "bow1" ? "szavak" : "szavak és szópárok"} súlya (a logisztikus regresszióból), darabszámmal szorozva; narancs: pozitív felé húz, kék: negatív felé. ` +
            (panelKey === "bow1" ? "A sorrend sehol sem szerepel – ezért nem érti a „de”-t." : "A szópárok („nem volt”, „volt jó”, „de a”) már hordoznak egy kis sorrendet.")),
          h("div", { class: "tw", style: "overflow-x:auto" }, h("table", { style: "margin:0;font-size:.85rem;width:100%" }, h("tbody", null, top.map(([f, c, w, v]) => h("tr", null,
            h("td", { style: "padding:.15rem .4rem;font-family:var(--mono);white-space:nowrap" }, f),
            h("td", { style: "padding:.15rem .4rem;font-family:var(--mono);text-align:right;white-space:nowrap" }, (c > 1 ? c + " × " : "") + fmt(w, 2)),
            h("td", { style: "padding:.15rem .4rem;width:45%;vertical-align:middle" }, h("div", { style: "display:flex;align-items:center;min-width:90px" }, half(v, true),
              h("div", { style: "width:1px;height:14px;background:var(--muted)" }), half(v, false))),
            h("td", { style: "padding:.15rem .4rem;font-family:var(--mono);text-align:right;white-space:nowrap" }, fmt(v, 2))))))));
        pInfo.innerHTML = (list.length > top.length ? `… és még ${list.length - top.length} kisebb tag. ` : "") +
          `összeg + b (${fmt(R[panelKey].b, 2)}) = logit <b>${fmt(r.logit, 2)}</b> → p(pozitív) = <b>${w3Pct(r.p)}</b>`;
      }
    }
    function showCell() {
      if (panelKey !== "att") return;
      const toks = w3Tokens(st), A = res[attModel].att[head];
      if (!cell || cell[0] >= toks.length) { pInfo.innerHTML = "Vidd az egeret egy cellára (vagy koppints rá): megmutatja a súlyt."; return; }
      const [i, j] = cell, row = A[i], best = argmax(row);
      pInfo.innerHTML = `»${toks[i]}«<sub>${i + 1}</sub> → »${toks[j]}«<sub>${j + 1}</sub>: <b>${fmt(row[j], 3)}</b> · ez a sor leginkább ide figyel: »${toks[best]}«<sub>${best + 1}</sub> (${fmt(row[best], 2)})`;
    }
    changed(true);
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
