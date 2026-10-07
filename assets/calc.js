/* =========================================================
   Synopsis – analízis közös modul (assets/calc.js)
   ---------------------------------------------------------
   Calc.parse("2x^2 - sin(x)")      → { f: x => ..., src }  (eval nélkül!)
       · műveletek: + - * / ^, zárójel, implicit szorzás (2x, 3(x+1), x sin(x))
       · függvények: sin cos tan exp ln lg log2 sqrt cbrt abs sgn
       · állandók: pi, e   · tizedesvessző és -pont is jó: 0,5 = 0.5
       · változó: x (vagy amit a vars tömbben megadsz)
   Calc.canvas(parent, aspect)      → HiDPI canvas, téma- és méretváltáskor újrarajzol
   Calc.plot(cv, view, layers)      → koordináta-rendszer + görbék, pontok, egyenesek
   Calc.fmt(x, d)                   → szám magyar tizedesvesszővel
   ========================================================= */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     Kifejezés-értelmező (rekurzív leszállás → closure)
     ------------------------------------------------------------------ */
  const FUNCS = {
    sin: Math.sin, cos: Math.cos, tan: Math.tan, tg: Math.tan, exp: Math.exp,
    ln: Math.log, lg: Math.log10, log: Math.log10, log2: Math.log2,
    sqrt: Math.sqrt, cbrt: Math.cbrt, abs: Math.abs, sgn: Math.sign
  };
  const CONSTS = { pi: Math.PI, e: Math.E };

  function tokenize(src, vars) {
    const names = [...Object.keys(FUNCS), ...Object.keys(CONSTS), ...vars].sort((a, b) => b.length - a.length);
    const out = [];
    let i = 0;
    const s = src.replace(/·|×/g, "*").replace(/−/g, "-").replace(/π/g, "pi").replace(/√/g, "sqrt");
    while (i < s.length) {
      const c = s[i];
      if (/\s/.test(c)) { i++; continue; }
      if (/[0-9.,]/.test(c)) {
        let j = i;
        while (j < s.length && /[0-9.,]/.test(s[j])) j++;
        const raw = s.slice(i, j).replace(",", ".");
        if (!/^\d*\.?\d+$|^\d+\.$/.test(raw)) throw new Error("hibás szám: " + s.slice(i, j));
        out.push({ t: "num", v: parseFloat(raw) });
        i = j; continue;
      }
      if (/[a-zA-Z]/.test(c)) {
        const rest = s.slice(i);
        const name = names.find(n => rest.toLowerCase().startsWith(n.toLowerCase()));
        if (!name) throw new Error("ismeretlen név: " + rest.match(/^[a-zA-Z]+/)[0]);
        out.push({ t: "id", v: name });
        i += name.length; continue;
      }
      if ("+-*/^()".includes(c)) { out.push({ t: "op", v: c }); i++; continue; }
      throw new Error("ismeretlen jel: " + c);
    }
    return out;
  }

  function parse(src, vars = ["x"]) {
    const toks = tokenize(String(src), vars);
    let p = 0;
    const peek = () => toks[p];
    const isOp = v => peek() && peek().t === "op" && peek().v === v;
    const expect = v => { if (!isOp(v)) throw new Error(`hiányzik: „${v}”`); p++; };

    function expr() {
      let a = term();
      while (isOp("+") || isOp("-")) {
        const o = toks[p++].v, b = term(), l = a;
        a = o === "+" ? env => l(env) + b(env) : env => l(env) - b(env);
      }
      return a;
    }
    const startsPrimary = () => peek() && (peek().t === "num" || peek().t === "id" || isOp("("));
    function term() {
      let a = unary();
      for (;;) {
        if (isOp("*") || isOp("/")) {
          const o = toks[p++].v, b = unary(), l = a;
          a = o === "*" ? env => l(env) * b(env) : env => l(env) / b(env);
        } else if (startsPrimary()) {          // implicit szorzás: 2x, 3(x+1), x sin(x)
          const b = power(), l = a;
          a = env => l(env) * b(env);
        } else break;
      }
      return a;
    }
    function unary() {
      if (isOp("-")) { p++; const a = unary(); return env => -a(env); }
      if (isOp("+")) { p++; return unary(); }
      return power();
    }
    function power() {
      const base = primary();
      if (isOp("^")) {
        p++;
        const ex = unary();                     // jobbra köt: 2^3^2 = 2^(3^2); -x^2 = -(x^2)
        return env => {
          const b = base(env), k = ex(env);
          // negatív alap tört kitevővel: páratlan nevezőjű kitevőnél valós gyök (pl. x^(1/3))
          if (b < 0 && !Number.isInteger(k)) {
            for (const q of [3, 5, 7, 9]) {
              const r = Math.round(k * q);
              if (Math.abs(k * q - r) < 1e-9) return (r % 2 ? -1 : 1) * Math.pow(-b, k);
            }
            return NaN;
          }
          return Math.pow(b, k);
        };
      }
      return base;
    }
    function primary() {
      const tk = peek();
      if (!tk) throw new Error("hiányos kifejezés");
      if (tk.t === "num") { p++; const v = tk.v; return () => v; }
      if (isOp("(")) { p++; const a = expr(); expect(")"); return a; }
      if (tk.t === "id") {
        p++;
        if (FUNCS[tk.v]) {
          const fn = FUNCS[tk.v];
          let pw = null;
          if (isOp("^")) { p++; pw = primary(); }          // sin^2(x)
          let arg;
          if (isOp("(")) { p++; arg = expr(); expect(")"); } else arg = power(); // sin x
          return pw ? env => Math.pow(fn(arg(env)), pw(env)) : env => fn(arg(env));
        }
        if (tk.v in CONSTS) { const v = CONSTS[tk.v]; return () => v; }
        const name = tk.v;
        return env => env[name];
      }
      throw new Error(`váratlan jel: „${tk.v}”`);
    }
    if (!toks.length) throw new Error("üres kifejezés");
    const root = expr();
    if (p < toks.length) throw new Error(`váratlan jel: „${toks[p].v}”`);
    const f = vars.length === 1
      ? x => { const v = root({ [vars[0]]: x }); return Number.isFinite(v) ? v : NaN; }
      : env => { const v = root(env); return Number.isFinite(v) ? v : NaN; };
    return { f, src };
  }

  /* ------------------------------------------------------------------
     Számformázás
     ------------------------------------------------------------------ */
  function fmt(x, d = 3) {
    if (!Number.isFinite(x)) return "nincs értelmezve";
    let r = +x.toFixed(d);
    if (Object.is(r, -0)) r = 0;
    let s = String(r);
    if (/e/.test(s)) s = x.toPrecision(4);
    const [ip, fp] = s.split(".");
    const sign = ip.startsWith("-") ? "−" : "";
    const digits = ip.replace("-", "").replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return sign + digits + (fp ? "," + fp : "");
  }

  /* ------------------------------------------------------------------
     Canvas (HiDPI, téma- és méretváltás figyelése)
     ------------------------------------------------------------------ */
  const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const redrawers = [];
  function canvas(parent, aspect = 0.62, maxW = 760) {
    const c = document.createElement("canvas");
    c.style.display = "block";
    c.style.touchAction = "none";
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
  new MutationObserver(() => redrawers.forEach(f => f()))
    .observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  /* ------------------------------------------------------------------
     Rajzoló
     view:   { xmin, xmax, ymin, ymax, xstep?, ystep?, grid? (true), labels? (true) }
     layers: [
       { f, color, width, dash, domain:[a,b] }                       görbe
       { param: t => [x, y], t:[a,b], color, dash }                  paraméteres görbe
       { points:[[x,y],...], color, open, r, label }                 pontok
       { vline: x, color, dash } · { hline: y, color, dash }         egyenesek
       { seg:[[x1,y1],[x2,y2]], color, dash, width }                 szakasz
       { text, at:[x,y], color, align }                              felirat
     ]
     Visszaadja a koordináta-átváltókat: { tx, ty, ix, iy }.
     ------------------------------------------------------------------ */
  const PALETTE = ["--accent", "--setB", "--setC", "--bad", "--setA"];
  const color = c => (c && c.startsWith("--") ? css(c) : c) || css("--accent");

  function niceStep(span, px) {
    const target = span / Math.max(2, px / 70);
    const pow = Math.pow(10, Math.floor(Math.log10(target)));
    for (const m of [1, 2, 5, 10]) if (m * pow >= target) return m * pow;
    return 10 * pow;
  }

  function plot(cv, view, layers = []) {
    const { ctx, w, h } = cv;
    const { xmin, xmax, ymin, ymax } = view;
    const pad = 4;
    const tx = x => pad + (x - xmin) / (xmax - xmin) * (w - 2 * pad);
    const ty = y => h - pad - (y - ymin) / (ymax - ymin) * (h - 2 * pad);
    const ix = px => xmin + (px - pad) / (w - 2 * pad) * (xmax - xmin);
    const iy = py => ymin + (h - pad - py) / (h - 2 * pad) * (ymax - ymin);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, h);

    const xs = view.xstep || niceStep(xmax - xmin, w), ys = view.ystep || niceStep(ymax - ymin, h);
    const lab = v => fmt(v, 4).replace(" ", "");
    // rács
    if (view.grid !== false) {
      ctx.strokeStyle = css("--border"); ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = Math.ceil(xmin / xs) * xs; x <= xmax + 1e-9; x += xs) { ctx.moveTo(tx(x), 0); ctx.lineTo(tx(x), h); }
      for (let y = Math.ceil(ymin / ys) * ys; y <= ymax + 1e-9; y += ys) { ctx.moveTo(0, ty(y)); ctx.lineTo(w, ty(y)); }
      ctx.stroke();
    }
    // tengelyek
    const ax = Math.min(Math.max(0, xmin), xmax), ay = Math.min(Math.max(0, ymin), ymax);
    ctx.strokeStyle = css("--muted"); ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(0, ty(ay)); ctx.lineTo(w, ty(ay)); ctx.moveTo(tx(ax), 0); ctx.lineTo(tx(ax), h); ctx.stroke();
    // nyilak
    ctx.fillStyle = css("--muted");
    ctx.beginPath(); ctx.moveTo(w - 1, ty(ay)); ctx.lineTo(w - 9, ty(ay) - 4); ctx.lineTo(w - 9, ty(ay) + 4); ctx.fill();
    ctx.beginPath(); ctx.moveTo(tx(ax), 1); ctx.lineTo(tx(ax) - 4, 9); ctx.lineTo(tx(ax) + 4, 9); ctx.fill();
    if (view.labels !== false) {
      ctx.font = "11px system-ui, sans-serif"; ctx.fillStyle = css("--muted");
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      for (let x = Math.ceil(xmin / xs) * xs; x <= xmax + 1e-9; x += xs) {
        if (Math.abs(x) < xs / 2 || tx(x) > w - 14 || tx(x) < 10) continue;
        ctx.fillText(lab(x), tx(x), Math.min(h - 14, ty(ay) + 3));
      }
      ctx.textBaseline = "middle";
      const yl = [];
      for (let y = Math.ceil(ymin / ys) * ys; y <= ymax + 1e-9; y += ys)
        if (!(Math.abs(y) < ys / 2 || ty(y) < 12 || ty(y) > h - 8)) yl.push(y);
      const maxW = Math.max(0, ...yl.map(y => ctx.measureText(lab(y)).width));
      const leftRoom = tx(ax) - 6 >= maxW;              // elfér-e a tengelytől balra?
      ctx.textAlign = leftRoom ? "right" : "left";
      yl.forEach(y => ctx.fillText(lab(y), leftRoom ? tx(ax) - 4 : tx(ax) + 5, ty(y)));
      ctx.textAlign = "left"; ctx.textBaseline = "bottom";
      ctx.fillText("x", w - 12, ty(ay) - 4);
      ctx.textBaseline = "top";
      ctx.fillText("y", tx(ax) + 6, 2);
    }

    let auto = 0;
    layers.forEach(L => {
      const col = color(L.color || PALETTE[auto++ % PALETTE.length]);
      ctx.save();
      ctx.strokeStyle = col; ctx.fillStyle = col;
      ctx.lineWidth = L.width || 2.4;
      ctx.setLineDash(L.dash || []);
      if (L.f) {
        const a = L.domain ? Math.max(xmin, L.domain[0]) : xmin, b = L.domain ? Math.min(xmax, L.domain[1]) : xmax;
        const n = Math.max(200, Math.round((tx(b) - tx(a)) * 2));
        const big = (ymax - ymin) * 4;
        ctx.beginPath();
        const out = y => y > ymax || y < ymin;
        let pen = false, prev = NaN;
        for (let k = 0; k <= n; k++) {
          const x = a + (b - a) * k / n, y = L.f(x);
          if (!Number.isFinite(y)) { pen = false; prev = NaN; continue; }
          // aszimptota: nagy ugrás a képen kívül, előjelváltással (pl. 1/x a 0-nál) → nem kötjük össze
          if (pen && Math.abs(y - prev) > (ymax - ymin) && (out(y) || out(prev)) && Math.sign(y - ymin) !== Math.sign(prev - ymin)) pen = false;
          if (pen && Math.abs(y - prev) > (ymax - ymin) && out(y) && out(prev)) pen = false;
          const yy = Math.max(ymin - big, Math.min(ymax + big, y));
          if (!pen) { ctx.moveTo(tx(x), ty(yy)); pen = true; } else ctx.lineTo(tx(x), ty(yy));
          prev = y;
        }
        ctx.stroke();
      } else if (L.param) {                     // paraméteres görbe: t ↦ [x, y]
        const [a, b] = L.t, n = 600;
        ctx.beginPath();
        let pen = false;
        for (let k = 0; k <= n; k++) {
          const [x, y] = L.param(a + (b - a) * k / n);
          if (!Number.isFinite(x) || !Number.isFinite(y) || Math.abs(y) > 1e6 || Math.abs(x) > 1e6) { pen = false; continue; }
          if (!pen) { ctx.moveTo(tx(x), ty(y)); pen = true; } else ctx.lineTo(tx(x), ty(y));
        }
        ctx.stroke();
      } else if (L.points) {
        ctx.setLineDash([]);
        L.points.forEach(([x, y]) => {
          if (!Number.isFinite(y)) return;
          ctx.beginPath(); ctx.arc(tx(x), ty(y), L.r || 4.5, 0, 2 * Math.PI);
          if (L.open) { ctx.fillStyle = css("--card"); ctx.fill(); ctx.lineWidth = 2; ctx.stroke(); }
          else ctx.fill();
        });
        if (L.label && L.points.length) {
          const [x, y] = L.points[0];
          ctx.font = "600 12px system-ui, sans-serif"; ctx.textAlign = "left"; ctx.textBaseline = "bottom";
          ctx.fillText(L.label, Math.min(w - 90, tx(x) + 7), Math.max(14, ty(y) - 5));
        }
      } else if (L.vline != null) {
        ctx.lineWidth = L.width || 1.5;
        ctx.beginPath(); ctx.moveTo(tx(L.vline), 0); ctx.lineTo(tx(L.vline), h); ctx.stroke();
      } else if (L.hline != null) {
        ctx.lineWidth = L.width || 1.5;
        ctx.beginPath(); ctx.moveTo(0, ty(L.hline)); ctx.lineTo(w, ty(L.hline)); ctx.stroke();
      } else if (L.seg) {
        ctx.lineWidth = L.width || 1.5;
        ctx.beginPath(); ctx.moveTo(tx(L.seg[0][0]), ty(L.seg[0][1])); ctx.lineTo(tx(L.seg[1][0]), ty(L.seg[1][1])); ctx.stroke();
      } else if (L.text) {
        ctx.font = (L.font || "600 12px system-ui, sans-serif");
        ctx.textAlign = L.align || "left"; ctx.textBaseline = "bottom";
        ctx.fillText(L.text, tx(L.at[0]), ty(L.at[1]));
      }
      ctx.restore();
    });
    return { tx, ty, ix, iy };
  }

  window.Calc = { parse, fmt, canvas, plot, css };
})();
