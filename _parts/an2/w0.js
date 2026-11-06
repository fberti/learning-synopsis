/* =========================================================
   Analízis 2. fejezet – interaktív szemléltetések
   Minden widget egy  <div class="widget" data-widget="név">  elembe épül.
   A rajzoláshoz és a képletek értelmezéséhez az assets/calc.js-t használja.
   ========================================================= */
(function () {
  "use strict";
  const C = window.Calc;
  const fmt = C.fmt;
  const css = C.css;
  const tex = (s, display) => (window.katex ? katex.renderToString(s, { throwOnError: false, displayMode: !!display }) : s);
  const texNum = (x, d = 3) => fmt(x, d).replace(",", "{,}").replace(/[\s\u202f\u00a0]/g, "\\,").replace("−", "-");

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
  /* csúszka: label, min, max, step, kezdő, onInput, [formázó] */
  function slider(label, min, max, step, value, onInput, show) {
    const r = h("input", { type: "range", min, max, step, value });
    const v = h("b", null, "");
    const wrap = h("label", null, label + " ", r, " ", v);
    const upd = () => { v.textContent = show ? show(+r.value) : fmt(+r.value, 3); };
    r.addEventListener("input", () => { upd(); onInput(); });
    upd();
    return { wrap, get value() { return +r.value; }, set value(x) { r.value = x; upd(); }, el: r };
  }
  /* gombsor, amelyből egy aktív: items = [[címke, érték], …] */
  function segmented(items, value, onChange) {
    const wrap = h("div", { class: "controls", style: "gap:.3rem" });
    let cur = value;
    const bs = items.map(([label, val]) => {
      const b = btn(label, () => { cur = val; bs.forEach(x => x.classList.toggle("on", x === b)); onChange(val); });
      if (val === value) b.classList.add("on");
      return b;
    });
    wrap.append(...bs);
    return { wrap, get value() { return cur; } };
  }
  const legend = items => h("div", { class: "controls", style: "font-size:.88rem" },
    ...items.map(([label, col, dash]) => h("span", { class: "chip", style: `border-color:${css(col) || col}` },
      h("span", { style: `display:inline-block;width:18px;border-top:3px ${dash ? "dashed" : "solid"} ${css(col) || col}` }), label)));
  const PAL = ["--accent", "--setB", "--setC", "--bad", "--setA"];
  const col = c => (c && c.startsWith("--") ? css(c) : c);

  /* téglalapok kitöltése egy C.plot által visszaadott transzformációval:
     rects = [{x0, x1, y0, y1, color, alpha}] */
  function fillRects(cv, T, rects) {
    const ctx = cv.ctx;
    ctx.save();
    rects.forEach(r => {
      ctx.globalAlpha = r.alpha == null ? 0.35 : r.alpha;
      ctx.fillStyle = col(r.color || "--accent");
      const x = T.tx(r.x0), y = T.ty(Math.max(r.y0, r.y1)), w = T.tx(r.x1) - T.tx(r.x0), hh = Math.abs(T.ty(r.y0) - T.ty(r.y1));
      ctx.fillRect(x, y, w, hh);
    });
    ctx.restore();
  }
  /* sáv két vízszintes egyenes között */
  function fillBand(cv, T, y0, y1, color, alpha = 0.18) {
    const ctx = cv.ctx;
    ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = col(color);
    ctx.fillRect(0, T.ty(y1), cv.w, T.ty(y0) - T.ty(y1));
    ctx.restore();
  }
  /* képlet beolvasása n (és opcionálisan a) változóval */
  function compile(src, vars = ["n"]) {
    try { return { f: C.parse(src, vars).f, err: null }; }
    catch (e) { return { f: null, err: e.message }; }
  }
  /* statisztika-sor: [[címke, érték-HTML], …] */
  function statRow(el, items) {
    el.innerHTML = "";
    el.className = "stat-row";
    items.forEach(([l, v]) => el.append(h("div", { class: "stat" }, h("div", { class: "l", html: l }), h("div", { class: "v", html: v }))));
    window.Synopsis && Synopsis.renderMath(el);
    return el;
  }
  /* „szép” y-tartomány pontokhoz */
  function yRange(vals, padFrac = 0.08) {
    const v = vals.filter(Number.isFinite);
    if (!v.length) return [-1, 1];
    let lo = Math.min(...v), hi = Math.max(...v);
    if (lo === hi) { lo -= 1; hi += 1; }
    const p = (hi - lo) * padFrac;
    return [Math.min(lo - p, 0 < lo && lo < (hi - lo) * 0.6 ? -p : lo - p), hi + p];
  }

  const W = {};
