
  /* ==================================================================
     w1.js – limit-zoom, epsilon-delta, sinx-over-x
     ================================================================== */
  /* sokszög kitöltése a C.plot transzformációjával */
  function w1poly(cv, T, pts, color, alpha = 0.3, stroke) {
    const ctx = cv.ctx;
    ctx.save();
    ctx.beginPath();
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(T.tx(x), T.ty(y)) : ctx.moveTo(T.tx(x), T.ty(y))));
    ctx.closePath();
    ctx.globalAlpha = alpha; ctx.fillStyle = col(color); ctx.fill();
    if (stroke) { ctx.globalAlpha = 1; ctx.strokeStyle = col(color); ctx.lineWidth = 1.6; ctx.stroke(); }
    ctx.restore();
  }
  /* y-tartomány minták alapján, a kilógó (aszimptotikus) értékek levágásával */
  function w1yr(vals, pad = 0.12) {
    const v = vals.filter(Number.isFinite).sort((a, b) => a - b);
    if (!v.length) return [-1, 1];
    let lo = v[Math.floor(v.length * 0.03)], hi = v[Math.ceil(v.length * 0.97) - 1];
    if (hi - lo < 1e-9) { lo -= 1; hi += 1; }
    const p = (hi - lo) * pad;
    return [lo - p, hi + p];
  }
  /* szám rövid alakban: nagyon kicsi h-ra normál alak */
  const w1sci = x => {
    if (x === 0) return "0";
    const k = Math.round(Math.log10(Math.abs(x)));
    if (Math.abs(x - Math.pow(10, k)) < 1e-12 * Math.abs(x) && k <= -4) return "10^" + k;
    return fmt(x, 8);
  };

  /* ------------------------------------------------------------------
     3.1  Ráközelítés a határértékre
     ------------------------------------------------------------------ */
  W["limit-zoom"] = root => {
    header(root, "Ráközelítés – mit csinál a függvény a pont körül?",
      "Válassz függvényt, aztán a csúszkával vidd egyre közelebb a két mérőpontot ($a - h$ és $a + h$) az $a$-hoz. A „ráközelítés” kapcsolóval " +
      "a nézet is velük együtt szűkül. Saját képletet is megadhatsz ($x$ változóval).");
    const P = [
      { l: "(x²−1)/(x−1), a = 1", f: x => (x * x - 1) / (x - 1), a: 1, src: "(x^2-1)/(x-1)" },
      { l: "sin x / x, a = 0", f: x => Math.sin(x) / x, a: 0, src: "sin(x)/x" },
      { l: "(2ˣ−1)/x, a = 0", f: x => (Math.pow(2, x) - 1) / x, a: 0, src: "(2^x-1)/x" },
      { l: "(√(x+9)−3)/x, a = 0", f: x => (Math.sqrt(x + 9) - 3) / x, a: 0, src: "(sqrt(x+9)-3)/x" },
      { l: "g: x+1, de g(1) = 5", f: x => (x === 1 ? 5 : x + 1), a: 1, src: null },
      { l: "sgn x, a = 0", f: x => Math.sign(x), a: 0, src: "sgn(x)" },
      { l: "sin(π/x), a = 0", f: x => Math.sin(Math.PI / x), a: 0, src: "sin(pi/x)" },
      { l: "1/x², a = 0", f: x => 1 / (x * x), a: 0, src: "1/x^2" }
    ];
    let cur = P[0], fn = cur.f, a = cur.a;
    const inp = h("input", { type: "text", value: cur.src, style: "width:12rem;font-family:var(--mono)" });
    const ain = h("input", { type: "text", value: "1", style: "width:4rem;font-family:var(--mono)" });
    const err = h("span", { class: "muted" });
    const bs = P.map(p => {
      const b = btn(p.l, () => {
        cur = p; fn = p.f; a = p.a; inp.value = p.src || "(beépített)"; ain.value = String(p.a);
        bs.forEach(x => x.classList.toggle("on", x === b)); err.textContent = "";
        draw();
      });
      return b;
    });
    bs[0].classList.add("on");
    root.append(h("div", { class: "controls", style: "gap:.3rem" }, ...bs));
    const apply = () => {
      const c = compile(inp.value, ["x"]);
      const ca = compile(ain.value, ["x"]);
      if (c.err || ca.err) { err.textContent = "⚠ " + (c.err || ca.err); return; }
      err.textContent = ""; fn = c.f; a = ca.f(0); cur = { l: "saját", f: fn, a, src: inp.value };
      bs.forEach(b => b.classList.remove("on"));
      draw();
    };
    root.append(h("div", { class: "controls" },
      h("label", null, "f(x) = ", inp), h("label", null, "a = ", ain), btn("Rajzold", apply), err));
    inp.addEventListener("keydown", e => { if (e.key === "Enter") apply(); });
    ain.addEventListener("keydown", e => { if (e.key === "Enter") apply(); });
    const K = slider("távolság: h = 10^−k, k =", 0, 6, 0.1, 0.5, () => draw(), v => fmt(v, 1));
    let zoom = true;
    const zb = btn("ráközelítés: be", () => { zoom = !zoom; zb.textContent = "ráközelítés: " + (zoom ? "be" : "ki"); zb.classList.toggle("on", zoom); draw(); }, "btn on");
    root.append(h("div", { class: "controls" }, K.wrap, zb));
    const cv = C.canvas(root, 0.55, 760);
    root.append(legend([["f grafikonja", "--accent"], ["mérőpont balról", "--setB"], ["mérőpont jobbról", "--setC"]]));
    const out = h("div", { class: "stat-row" });
    const tw = h("div", { class: "tw", style: "overflow-x:auto;margin-top:.5rem" });
    const note = h("p", { class: "w-sub", style: "margin:.3rem 0 0" });
    root.append(out, note, tw);

    function draw() {
      const hh = Math.pow(10, -K.value);
      const half = zoom ? Math.max(4 * hh, 1e-7) : 3;
      const x0 = a - half, x1 = a + half;
      const samp = [];
      for (let k = 0; k <= 400; k++) { const x = x0 + (x1 - x0) * k / 400; if (Math.abs(x - a) > half * 1e-6) samp.push(fn(x)); }
      const L = fn(a - hh), Rr = fn(a + hh);
      let [lo, hi] = w1yr([...samp, L, Rr]);
      const fa = fn(a);
      // a határérték becslése: nagyon közeli pontok
      // több, „szabálytalan” távolságban is megnézzük (a sin(π/x) a kerek helyeken becsapna)
      const sc = Math.max(Math.abs(a), 1);
      const offs = [1.234e-6, 3.17e-7, 7.31e-8, 1.913e-7].map(t => t * sc);
      const vals = offs.flatMap(t => [fn(a - t), fn(a + t)]);
      const l1 = vals[0], r1 = vals[1];
      const agree = vals.every(Number.isFinite) && Math.max(...vals) - Math.min(...vals) < 1e-4 * Math.max(1, Math.abs(l1));
      const lim = agree ? (vals[6] + vals[7]) / 2 : NaN;
      cv.draw = () => {
        const T = C.plot(cv, { xmin: x0, xmax: x1, ymin: lo, ymax: hi, xname: "x", yname: "y" }, [
          { vline: a, color: "--border", dash: [4, 4] },
          { f: x => (x === a ? NaN : fn(x)), color: "--accent" },
          { seg: [[a - hh, lo], [a - hh, L]], color: "--setB", dash: [3, 3] },
          { seg: [[a + hh, lo], [a + hh, Rr]], color: "--setC", dash: [3, 3] },
          { points: [[a - hh, L]], color: "--setB" },
          { points: [[a + hh, Rr]], color: "--setC" },
          agree ? { points: [[a, lim]], color: "--accent", open: true, r: 5 } : { text: "" },
          Number.isFinite(fa) && !(agree && Math.abs(fa - lim) < 1e-9) ? { points: [[a, fa]], color: "--bad", r: 5 } : { text: "" }
        ]);
        return T;
      };
      cv.draw();
      const fv = v => (Number.isFinite(v) ? fmt(v, 6) : "nincs értelmezve");
      statRow(out, [[`$f(a - h)$`, fv(L)], [`$f(a + h)$`, fv(Rr)], [`$f(a)$`, fv(fa)], ["$h$", w1sci(hh)]]);
      note.innerHTML = agree
        ? `A két oldal ugyanoda közelít: $\\lim\\limits_{x\\to a} f(x) \\approx ${texNum(lim, 6)}$` +
          (Number.isFinite(fa) ? (Math.abs(fa - lim) < 1e-9 ? " – és ez éppen $f(a)$." : ` – de $f(a) = ${texNum(fa, 4)}$: a határérték nem a helyettesítési érték!`) : " – pedig $f(a)$ nincs is értelmezve (üres karika).")
        : (Number.isFinite(l1) && Number.isFinite(r1) && Math.abs(l1) < 1e6 && Math.abs(r1) < 1e6
          ? "A két oldal nem ugyanoda tart (vagy a függvény leng): ilyenkor a határérték nem létezik. Próbálj ki több $k$-t!"
          : "Az értékek a pont közelében minden határon túl nőnek: végtelen határérték (3.3).");
      Synopsis.renderMath && Synopsis.renderMath(note);
      tw.innerHTML = "";
      const ks = [1, 2, 3, 4, 5];
      const fmtX = (k, s) => fmt(a + s * Math.pow(10, -k), 6);
      tw.append(h("table", { style: "font-size:.85rem" },
        h("tr", null, h("th", null, "x"), ...ks.map(k => h("td", null, fmtX(k, -1))), h("td", { style: "background:var(--bg-soft)" }, "a"), ...ks.slice().reverse().map(k => h("td", null, fmtX(k, 1)))),
        h("tr", null, h("th", null, "f(x)"), ...ks.map(k => h("td", null, fv(fn(a - Math.pow(10, -k))))), h("td", { style: "background:var(--bg-soft)" }, fv(fa)),
          ...ks.slice().reverse().map(k => h("td", null, fv(fn(a + Math.pow(10, -k))))))));
      tw.append(h("p", { class: "w-sub", style: "margin:.2rem 0 0" }, "A táblázat az a ± 0,1; 0,01; …; 0,000 01 helyeken számol."));
    }
    draw();
  };

  /* ------------------------------------------------------------------
     3.2  Az ε–δ játék
     ------------------------------------------------------------------ */
  W["epsilon-delta"] = root => {
    header(root, "Az $\\varepsilon$–$\\delta$ játék – találsz-e elég kis ablakot?",
      "Az „ellenfél” megad egy $\\varepsilon$ hibahatárt (vízszintes sáv $A$ körül). Te egy $\\delta$-t választasz (függőleges ablak $a$ körül). " +
      "Akkor nyertél, ha az ablakban <b>minden</b> pont (az $a$-t kivéve) a sávban marad. A gép meg is keresi a legnagyobb jó $\\delta$-t.");
    const P = [
      { l: "3x − 1, a = 2", f: x => 3 * x - 1, a: 2, A: 5, tex: "3x - 1", span: 1.5 },
      { l: "x², a = 3", f: x => x * x, a: 3, A: 9, tex: "x^2", span: 1.5 },
      { l: "√x, a = 4", f: x => Math.sqrt(x), a: 4, A: 2, tex: "\\sqrt{x}", span: 3 },
      { l: "sin x / x, a = 0", f: x => Math.sin(x) / x, a: 0, A: 1, tex: "\\tfrac{\\sin x}{x}", span: 3 },
      { l: "sgn x, a = 0, A = 1", f: x => Math.sign(x), a: 0, A: 1, tex: "\\operatorname{sgn} x", span: 1.5 },
      { l: "x sin(1/x), a = 0", f: x => x * Math.sin(1 / x), a: 0, A: 0, tex: "x\\sin\\tfrac1x", span: 0.6 }
    ];
    let cur = P[0];
    const seg = segmented(P.map((p, i) => [p.l, i]), 0, i => { cur = P[i]; D.value = Math.log10(0.1); draw(); });
    root.append(seg.wrap);
    const EPS = [2, 1, 0.5, 0.2, 0.1, 0.05, 0.01];
    let eps = 0.1;
    const es = segmented(EPS.map(e => ["ε = " + fmt(e, 2), e]), eps, v => { eps = v; draw(); });
    const D = slider("δ =", -4, 0.3, 0.01, Math.log10(0.1), () => draw(), v => fmt(Math.pow(10, v), 4));
    root.append(h("div", { class: "controls" }, h("span", null, "ellenfél: "), es.wrap));
    const best = btn("Legnagyobb jó δ", () => { const d = bestDelta(); if (d > 0) { D.value = Math.log10(d * 0.999); draw(); } });
    root.append(h("div", { class: "controls" }, D.wrap, best));
    const cv = C.canvas(root, 0.55, 760);
    root.append(legend([["f grafikonja", "--accent"], ["ε-sáv: A ± ε", "--ok"], ["δ-ablak: a ± δ", "--setB"], ["sávon kívüli pont", "--bad"]]));
    const out = h("div", { class: "stat-row" });
    const msg = h("p", { class: "w-sub", style: "margin:.3rem 0 0;font-weight:600" });
    root.append(out, msg);

    function samples(d) {
      const xs = [];
      const n = 1500;
      for (let k = 1; k <= n; k++) {
        const t = k / n, u = d * (0.4 * t + 0.6 * t * t * t);   // sűrűbben a középpont körül
        xs.push(cur.a - u, cur.a + u, cur.a - d * t, cur.a + d * t);
      }
      return xs.filter(x => x !== cur.a);
    }
    function worst(d) {
      let wx = null, wv = -1;
      for (const x of samples(d * 0.999999)) {
        const y = cur.f(x);
        if (!Number.isFinite(y)) continue;
        const e = Math.abs(y - cur.A);
        if (e > wv) { wv = e; wx = x; }
      }
      return { wx, wv };
    }
    function bestDelta() {
      if (worst(1e-6).wv >= eps) return 0;
      let lo = 1e-6, hi = cur.span * 2;
      if (worst(hi).wv < eps) return hi;
      for (let i = 0; i < 50; i++) { const m = Math.sqrt(lo * hi); if (worst(m).wv < eps) lo = m; else hi = m; }
      return lo;
    }
    function draw() {
      const d = Math.pow(10, D.value);
      const a = cur.a, A = cur.A;
      const half = Math.max(cur.span, 2.5 * d);
      const x0 = a - half, x1 = a + half;
      const ys = []; for (let k = 0; k <= 300; k++) { const x = x0 + (x1 - x0) * k / 300; if (x !== a) ys.push(cur.f(x)); }
      let [lo, hi] = w1yr([...ys, A - 1.4 * eps, A + 1.4 * eps]);
      const w = worst(d), ok = w.wv < eps;
      const bad = [];
      if (!ok) for (const x of samples(d).filter((_, i) => i % 6 === 0)) { const y = cur.f(x); if (Math.abs(y - A) >= eps) bad.push([x, y]); }
      // a C.plot mindig letörli a vásznat – ezért a rétegeket egyben rajzoljuk újra
      cv.draw = () => {
        const v = { xmin: x0, xmax: x1, ymin: lo, ymax: hi, xname: "x", yname: "y" };
        let T = C.plot(cv, v, []);
        fillBand(cv, T, A - eps, A + eps, "--ok", 0.16);
        fillRects(cv, T, [{ x0: a - d, x1: a + d, y0: lo, y1: hi, color: "--setB", alpha: 0.13 }]);
        const ctx = cv.ctx;
        const line = (yv, c, dash) => { ctx.save(); ctx.strokeStyle = col(c); ctx.setLineDash(dash); ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(0, T.ty(yv)); ctx.lineTo(cv.w, T.ty(yv)); ctx.stroke(); ctx.restore(); };
        const vl = (xv, c) => { ctx.save(); ctx.strokeStyle = col(c); ctx.setLineDash([5, 4]); ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(T.tx(xv), 0); ctx.lineTo(T.tx(xv), cv.h); ctx.stroke(); ctx.restore(); };
        line(A + eps, "--ok", [5, 4]); line(A - eps, "--ok", [5, 4]); line(A, "--ok", [1, 3]);
        vl(a - d, "--setB"); vl(a + d, "--setB");
        // görbe sűrűn (a x·sin(1/x) miatt)
        const ctx2 = cv.ctx, n = 4000;
        ctx2.save(); ctx2.strokeStyle = col("--accent"); ctx2.lineWidth = 2; ctx2.beginPath();
        let pen = false;
        for (let k = 0; k <= n; k++) {
          const x = x0 + (x1 - x0) * k / n; const y = x === a ? NaN : cur.f(x);
          if (!Number.isFinite(y) || Math.abs(x - a) < (x1 - x0) * 1e-5) { pen = false; continue; }
          const yy = Math.max(lo - (hi - lo), Math.min(hi + (hi - lo), y));
          if (pen && cur.l.startsWith("sgn") && Math.sign(x - a) !== Math.sign(x - (x1 - x0) / n - a)) pen = false;
          if (!pen) { ctx2.moveTo(T.tx(x), T.ty(yy)); pen = true; } else ctx2.lineTo(T.tx(x), T.ty(yy));
        }
        ctx2.stroke(); ctx2.restore();
        // lyuk a-ban, ha a függvény ott nincs értelmezve; sgn esetén f(0) = 0
        const fa = cur.f(a);
        const dot = (x, y, open, c) => { ctx.save(); ctx.beginPath(); ctx.arc(T.tx(x), T.ty(y), 4.5, 0, 2 * Math.PI); ctx.lineWidth = 2; ctx.strokeStyle = col(c);
          if (open) { ctx.fillStyle = css("--card"); ctx.fill(); ctx.stroke(); } else { ctx.fillStyle = col(c); ctx.fill(); } ctx.restore(); };
        if (cur.l.startsWith("sgn")) { dot(a, -1, true, "--accent"); dot(a, 1, true, "--accent"); dot(a, 0, false, "--accent"); }
        else dot(a, A, !Number.isFinite(fa), "--accent");
        bad.slice(0, 400).forEach(([x, y]) => { if (y >= lo && y <= hi) { ctx.save(); ctx.fillStyle = col("--bad"); ctx.beginPath(); ctx.arc(T.tx(x), T.ty(y), 2.6, 0, 2 * Math.PI); ctx.fill(); ctx.restore(); } });
        return T;
      };
      cv.draw();
      const bd = bestDelta();
      statRow(out, [["függvény", `$${cur.tex}$, $a = ${texNum(a, 2)}$, $A = ${texNum(A, 2)}$`], ["$\\varepsilon$", fmt(eps, 2)], ["$\\delta$", fmt(d, 4)],
        ["legnagyobb jó $\\delta$", bd > 0 ? (bd >= cur.span * 2 ? "bármekkora" : "≈ " + fmt(bd, 4)) : "nincs"],
        ["legnagyobb eltérés az ablakban", Number.isFinite(w.wv) ? fmt(w.wv, 4) : "–"]]);
      msg.style.color = ok ? css("--ok") : css("--bad");
      msg.innerHTML = ok ? "✔ Nyertél: az ablakban minden érték a sávban van." :
        (bd > 0 ? `✘ Az ablak túl széles: pl. $x = ${texNum(w.wx, 4)}$-nél $|f(x) - A| = ${texNum(w.wv, 4)} \\ge \\varepsilon$. Szűkítsd a $\\delta$-t!`
          : "✘ Nincs jó $\\delta$: akármilyen kicsi az ablak, a 0 bal oldalán $f(x) = -1$, ami $\\varepsilon \\lt 2$ esetén kilóg a sávból. A határérték nem 1 (sőt nem is létezik).");
      Synopsis.renderMath && Synopsis.renderMath(msg);
    }
    draw();
  };

  /* ------------------------------------------------------------------
     3.4  sin x / x – a geometriai bizonyítás
     ------------------------------------------------------------------ */
  W["sinx-over-x"] = root => {
    header(root, "Miért tart sin x / x az 1-hez? – három terület az egységkörben",
      "Állítsd a szöget! A kis háromszög ($\\tfrac12\\sin x$) a körcikkben ($\\tfrac12 x$) van, az pedig a nagy háromszögben ($\\tfrac12\\tan x$). " +
      "Ebből $\\cos x \\lt \\tfrac{\\sin x}{x} \\lt 1$, és ha $x \\to 0$, a két „rendőr” összeszorítja a középsőt.");
    const X = slider("szög: x =", 0.02, 1.25, 0.01, 0.9, () => draw(), v => fmt(v, 2) + " rad (" + fmt(v * 180 / Math.PI, 1) + "°)");
    root.append(h("div", { class: "controls" }, X.wrap, btn("animáció: x → 0", () => anim())));
    const row = h("div", { class: "two-col", style: "align-items:start" });
    const left = h("div"), right = h("div");
    row.append(left, right); root.append(row);
    const cv = C.canvas(left, 0.9, 420);
    const cv2 = C.canvas(right, 0.9, 420);
    root.append(legend([["kis háromszög: ½ sin x", "--setA"], ["körcikk: ½ x", "--accent"], ["nagy háromszög: ½ tan x", "--setB"]]));
    const out = h("div", { class: "stat-row" });
    root.append(out);
    let timer = null;
    function anim() {
      clearInterval(timer);
      timer = setInterval(() => { const v = X.value * 0.94; if (v <= 0.03) { X.value = 0.02; clearInterval(timer); } else X.value = v; draw(); }, 60);
    }
    X.el.addEventListener("input", () => clearInterval(timer));
    function draw() {
      const x = X.value, s = Math.sin(x), c = Math.cos(x), t = Math.tan(x);
      const ymax = Math.max(1.15, t + 0.12), aspect = 0.9;
      const ys = ymax + 0.12, xs = ys / aspect;
      const v = { xmin: -0.12, xmax: -0.12 + xs, ymin: -0.12, ymax, labels: false, xname: "", yname: "" };
      cv.draw = () => {
        const T = C.plot(cv, v, []);
        const arc = [[0, 0]]; for (let k = 0; k <= 60; k++) arc.push([Math.cos(x * k / 60), Math.sin(x * k / 60)]);
        w1poly(cv, T, [[0, 0], [1, 0], [1, t]], "--setB", 0.22, true);
        w1poly(cv, T, arc, "--accent", 0.3, true);
        w1poly(cv, T, [[0, 0], [1, 0], [c, s]], "--setA", 0.45, true);
        const ctx = cv.ctx;
        ctx.save(); ctx.strokeStyle = css("--muted"); ctx.lineWidth = 1.2; ctx.setLineDash([3, 3]); ctx.beginPath();
        for (let k = 0; k <= 100; k++) { const u = Math.PI / 2 * k / 100; const px = T.tx(Math.cos(u)), py = T.ty(Math.sin(u)); k ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
        ctx.stroke(); ctx.setLineDash([]);
        ctx.strokeStyle = col("--text"); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(T.tx(c), T.ty(s)); ctx.lineTo(T.tx(c), T.ty(0)); ctx.stroke();
        ctx.restore();
        const lab = (px, py, txt, cc, al = "left") => { ctx.save(); ctx.font = "600 12px system-ui, sans-serif"; ctx.fillStyle = col(cc); ctx.textAlign = al; ctx.textBaseline = "middle"; ctx.fillText(txt, T.tx(px), T.ty(py)); ctx.restore(); };
        lab(c - 0.02, s / 2, "sin x", "--text", "right");
        lab(1.03, t / 2, "tan x", "--setB");
        lab(0.5, -0.06, "1", "--muted", "center");
        lab(0.16 * Math.cos(x / 2), 0.16 * Math.sin(x / 2), "x", "--accent");
        return T;
      };
      cv.draw();
      cv2.draw = () => C.plot(cv2, { xmin: -1.4, xmax: 1.4, ymin: 0, ymax: 1.25, xname: "x", yname: "" }, [
        { f: Math.cos, color: "--muted", dash: [5, 4] },
        { hline: 1, color: "--muted", dash: [5, 4] },
        { f: u => (u === 0 ? NaN : Math.sin(u) / u), color: "--accent" },
        { points: [[0, 1]], color: "--accent", open: true },
        { seg: [[x, c], [x, 1]], color: "--setC", width: 2.5 },
        { points: [[x, s / x]], color: "--setC" },
        { text: "1", at: [-1.35, 1.02], color: "--muted" },
        { text: "cos x", at: [-1.35, Math.cos(1.35) + 0.03], color: "--muted" },
        { text: "sin x / x", at: [0.55, Math.sin(0.55) / 0.55 + 0.05], color: "--accent" }
      ]);
      cv2.draw();
      statRow(out, [["$\\tfrac12\\sin x$", fmt(s / 2, 5)], ["$\\tfrac12 x$", fmt(x / 2, 5)], ["$\\tfrac12\\tan x$", fmt(t / 2, 5)],
        ["$\\cos x \\lt \\tfrac{\\sin x}{x} \\lt 1$", `${fmt(c, 5)} &lt; <b>${fmt(s / x, 5)}</b> &lt; 1`]]);
    }
    draw();
  };
