/* =========================================================
   Elektromosságtan és digitális elektronika 1. fejezet – interaktív szemléltetések
   Minden widget egy  <div class="widget" data-widget="név">  elembe épül.
   A statikus erővonalas ábrák: <div class="widget-static" data-fieldpic="…">.
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
