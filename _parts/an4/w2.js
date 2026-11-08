  /* ==================================================================
     w2.js – derivative-sketcher, chain-rule-gears, derivative-machine, motion-graphs
     ================================================================== */
  /* jelmagyarázat: [címke, szín, "line" | "dash" | "dot" | "none"] */
  const w2legend = items => h("div", { class: "controls", style: "font-size:.88rem" },
    ...items.map(([label, c, kind]) => h("span", { class: "chip", style: `border-color:${col(c)}` },
      kind === "none" ? null : kind === "dot"
        ? h("span", { style: `display:inline-block;width:10px;height:10px;border-radius:50%;background:${col(c)}` })
        : h("span", { style: `display:inline-block;width:18px;border-top:3px ${kind === "dash" ? "dashed" : "solid"} ${col(c)}` }),
      h("span", { html: label }))));
  /* szöveg a vásznon, halvány háttérrel (pixelkoordinátákban) */
  function w2text(ctx, px, py, s, color, align = "center", font = "600 12px system-ui, sans-serif") {
    ctx.save(); ctx.font = font; ctx.textAlign = align; ctx.textBaseline = "middle";
    const w = ctx.measureText(s).width;
    const x0 = align === "center" ? px - w / 2 : align === "right" ? px - w : px;
    ctx.globalAlpha = 0.85; ctx.fillStyle = css("--card"); ctx.fillRect(x0 - 3, py - 8, w + 6, 16);
    ctx.globalAlpha = 1; ctx.fillStyle = col(color); ctx.fillText(s, px, py);
    ctx.restore();
  }
  /* érintő szakasz: (x0; y0) ponton át, m meredekséggel, pixelben rögzített hosszal */
  function w2tangent(cv, T, x0, y0, m, color, half = 58, width = 2) {
    if (!Number.isFinite(y0) || !Number.isFinite(m)) return;
    const px = T.tx(x0), py = T.ty(y0);
    const dx = T.tx(x0 + 1) - px, dy = T.ty(y0 + m) - py;
    const L = Math.hypot(dx, dy) || 1, ux = dx / L * half, uy = dy / L * half;
    const ctx = cv.ctx;
    ctx.save(); ctx.strokeStyle = col(color); ctx.lineWidth = width; ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(px - ux, py - uy); ctx.lineTo(px + ux, py + uy); ctx.stroke();
    ctx.restore();
  }
  function w2dot(cv, T, x, y, color, r = 5, open = false) {
    if (!Number.isFinite(y)) return;
    const ctx = cv.ctx;
    ctx.save(); ctx.strokeStyle = ctx.fillStyle = col(color); ctx.lineWidth = 2; ctx.setLineDash([]);
    ctx.beginPath(); ctx.arc(T.tx(x), T.ty(y), r, 0, 2 * Math.PI);
    if (open) { ctx.fillStyle = css("--card"); ctx.fill(); ctx.stroke(); } else ctx.fill();
    ctx.restore();
  }
  function w2arrow(ctx, x0, y0, x1, y1, color, width = 3) {
    const L = Math.hypot(x1 - x0, y1 - y0);
    if (L < 2) return;
    const ux = (x1 - x0) / L, uy = (y1 - y0) / L, hd = Math.min(9, L * 0.6);
    ctx.save(); ctx.strokeStyle = ctx.fillStyle = col(color); ctx.lineWidth = width; ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1 - ux * hd * 0.8, y1 - uy * hd * 0.8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - ux * hd - uy * hd * 0.55, y1 - uy * hd + ux * hd * 0.55);
    ctx.lineTo(x1 - ux * hd + uy * hd * 0.55, y1 - uy * hd - ux * hd * 0.55);
    ctx.closePath(); ctx.fill(); ctx.restore();
  }
  /* fix tizedesjegyű szám (a záró nullák megmaradnak), magyar formában */
  function w2fix(x, d) {
    if (!Number.isFinite(x)) return "nincs értelmezve";
    const s = Math.abs(x).toFixed(d), neg = x < 0 && /[1-9]/.test(s);
    let [ip, fp] = s.split(".");
    ip = ip.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return (neg ? "−" : "") + ip + (fp ? "," + fp : "");
  }
  /* numerikus deriváltak (központi különbség; ha ott nincs értelmezve, egyoldali) */
  function w2d1(f, x, hh = 1e-5) {
    let v = (f(x + hh) - f(x - hh)) / (2 * hh);
    if (!Number.isFinite(v)) v = (f(x + hh) - f(x)) / hh;
    if (!Number.isFinite(v)) v = (f(x) - f(x - hh)) / hh;
    return v;
  }
  function w2d2(f, x, hh = 1e-3) {
    let v = (f(x + hh) - 2 * f(x) + f(x - hh)) / (hh * hh);
    if (!Number.isFinite(v)) v = (f(x + 2 * hh) - 2 * f(x + hh) + f(x)) / (hh * hh);
    if (!Number.isFinite(v)) v = (f(x) - 2 * f(x - hh) + f(x - 2 * hh)) / (hh * hh);
    return v;
  }
  /* statisztika-sor, amelynek az értékeit később csak frissítjük (KaTeX nélkül, gyors) */
  function w2stats(el, labels) {
    statRow(el, labels.map(l => [l, "–"]));
    const vs = [...el.querySelectorAll(".stat .v")];
    return vals => vals.forEach((v, i) => { if (vs[i]) vs[i].innerHTML = v; });
  }
  /* canvas, amely keskeny (mobil) nézetben magasabb arányt kap */
  function w2canvas(parent, aspect, narrowAspect, maxW = 760) {
    const cv = C.canvas(parent, aspect, maxW);
    cv.resize = () => {
      const w = Math.min(maxW, parent.clientWidth || maxW);
      const hh = Math.round(w * (w < 520 ? narrowAspect : aspect));
      const dpr = window.devicePixelRatio || 1;
      cv.c.width = Math.round(w * dpr); cv.c.height = Math.round(hh * dpr);
      cv.c.style.width = w + "px"; cv.c.style.height = hh + "px";
      cv.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cv.w = w; cv.h = hh;
    };
    cv.resize();
    return cv;
  }
  /* KaTeX-képlet gomb */
  function w2texBtn(t, onclick) {
    const b = h("button", { class: "btn", type: "button", html: tex(t) });
    b.addEventListener("click", onclick);
    return b;
  }

  /* ------------------------------------------------------------------
     4.3-a  Rajzold meg a deriváltat!
     ------------------------------------------------------------------ */
  W["derivative-sketcher"] = root => {
    header(root, "Rajzold meg a deriváltat!",
      "Felül $f$ grafikonja. Az alsó koordináta-rendszerbe rajzold meg egérrel vagy ujjal az $f'$ grafikonját (balról jobbra húzva; a rossz részt egyszerűen rajzold át). Aztán nyomd meg az „Ellenőrzés” gombot.");
    const PI = Math.PI;
    const PRE = [
      { t: "x^2", f: x => x * x, d: x => 2 * x, a: -3, b: 3, dt: "f'(x) = 2x" },
      { t: "x^3 - 3x", f: x => x ** 3 - 3 * x, d: x => 3 * x * x - 3, a: -2.5, b: 2.5, dt: "f'(x) = 3x^2 - 3" },
      { t: "\\sin x", f: Math.sin, d: Math.cos, a: -2 * PI, b: 2 * PI, dt: "f'(x) = \\cos x", xstep: PI / 2 },
      { t: "e^x", f: Math.exp, d: Math.exp, a: -3, b: 2, dt: "f'(x) = e^x", note: " – <b>ugyanaz!</b> Az $e^x$ deriváltja önmaga." },
      { t: "|x|", f: Math.abs, d: x => (x > 0 ? 1 : x < 0 ? -1 : NaN), a: -3, b: 3, kink: 0,
        dt: "f'(x) = \\begin{cases} -1, & x \\lt 0 \\\\ 1, & x \\gt 0 \\end{cases}", note: " A $0$-ban $|x|$ nem deriválható (töréspont): ott $f'$ nincs értelmezve." },
      { t: "\\dfrac{1}{1 + x^2}", f: x => 1 / (1 + x * x), d: x => -2 * x / (1 + x * x) ** 2, a: -4, b: 4, dt: "f'(x) = -\\dfrac{2x}{(1 + x^2)^2}" }
    ];
    const N = 200;
    let P = PRE[1], arr = new Float64Array(N).fill(NaN), checked = false, help = false, hover = null, drawing = false, last = null;
    let vTop, vBot, Ttop = null, Tbot = null;

    const preBtns = PRE.map((p, i) => w2texBtn("f(x) = " + p.t, () => setPre(i)));
    const bCheck = btn("Ellenőrzés", () => { checked = true; evaluate(); redraw(); }, "btn primary");
    const bClear = btn("Törlés", () => { arr.fill(NaN); checked = false; evaluate(); redraw(); });
    const bHelp = btn("💡 Segítség", () => { help = !help; bHelp.classList.toggle("on", help); if (!help) hover = null; redraw(); });
    root.append(h("div", { class: "controls", style: "gap:.3rem" }, ...preBtns), h("div", { class: "controls" }, bCheck, bClear, bHelp));
    const lblTop = h("div", { class: "muted", style: "font-size:.88rem;margin-top:.3rem", html: "$f$ grafikonja" });
    root.append(lblTop);
    const top = w2canvas(root, 0.36, 0.55);
    top.c.style.touchAction = "pan-y";
    const hint = h("div", { class: "readout", style: "font-family:var(--font);font-size:.9rem;min-height:1.6em;overflow-wrap:anywhere" });
    root.append(hint, h("div", { class: "muted", style: "font-size:.88rem;margin-top:.5rem", html: "ide rajzold $f'$ grafikonját:" }));
    const bot = w2canvas(root, 0.36, 0.62);
    bot.c.style.cursor = "crosshair";
    root.append(w2legend([["$f$", "--accent"], ["a te rajzod ($f'$?)", "--setB"], ["valódi $f'$ (ellenőrzés után)", "--ok", "dash"], ["segítség: érintő, $(x; f'(x))$", "--setC"]]));
    const fb = h("div", { class: "readout", style: "font-family:var(--font);line-height:1.6;overflow-wrap:anywhere" });
    root.append(fb, h("p", { class: "w-sub", style: "margin:.6rem 0 0",
      html: "Ahol $f$ nő, ott $f' \\gt 0$; ahol csökken, $f' \\lt 0$; ahol vízszintes az érintő (csúcs, völgy), ott $f' = 0$." }));

    const xc = i => P.a + (i + 0.5) * (P.b - P.a) / N;
    function setPre(i) {
      P = PRE[i];
      preBtns.forEach((b, j) => b.classList.toggle("on", j === i));
      arr = new Float64Array(N).fill(NaN); checked = false; hover = null;
      const xs = Array.from({ length: 401 }, (_, k) => P.a + (P.b - P.a) * k / 400);
      const [ylo, yhi] = yRange(xs.map(P.f), 0.1);
      vTop = { xmin: P.a, xmax: P.b, ymin: ylo, ymax: yhi, xstep: P.xstep };
      const ds = xs.map(P.d).filter(Number.isFinite);
      const lo = Math.min(...ds), hi = Math.max(...ds), sp = (hi - lo) || 2;
      vBot = { xmin: P.a, xmax: P.b, ymin: Math.min(lo - 0.15 * sp, -0.1 * sp), ymax: Math.max(hi + 0.15 * sp, 0.1 * sp), xstep: P.xstep, yname: "y = f'(x)" };
      evaluate(); redraw();
    }
    function evaluate() {
      let n = 0, err = 0, cnt = 0;
      for (let i = 0; i < N; i++) {
        if (!Number.isFinite(arr[i])) continue;
        cnt++;
        const d = P.d(xc(i));
        if (Number.isFinite(d)) { err += Math.abs(arr[i] - d); n++; }
      }
      const cover = cnt / N, span = vBot.ymax - vBot.ymin;
      const mean = n ? err / n : NaN;
      const score = n ? Math.round(100 * Math.max(0, 1 - 4 * mean / span)) : 0;
      root._w2ds.last = { cover, mean, score, span, shown: checked && cover >= 0.6 };
      if (!checked) {
        fb.style.color = css("--muted");
        fb.innerHTML = cnt ? `A tartomány ${fmt(100 * cover, 0)}%-át rajzoltad meg. Ha kész vagy, nyomd meg az „Ellenőrzés” gombot.`
          : "Gondold végig: hol nő $f$, hol csökken, hol vízszintes az érintője? Aztán rajzolj!";
      } else if (cover < 0.6) {
        fb.style.color = "";
        fb.innerHTML = `A tartománynak csak <b>${fmt(100 * cover, 0)}%</b>-át rajzoltad meg. Rajzolj többet (legalább 60%-ot), aztán ellenőrizz újra!`;
        checked = false;
      } else {
        fb.style.color = "";
        const verdict = score >= 80 ? `<b style="color:var(--ok)">Remek!</b> A rajzod szépen követi a deriváltat.`
          : score >= 50 ? `<b>Jó irány…</b> Az alak nagyjából stimmel; nézd meg, hol tér el leginkább a szaggatott vonaltól.`
          : `<b style="color:var(--bad)">Még nem az igazi.</b> Tipp: kapcsold be a „Segítség”-et, és húzd a kurzort a felső grafikonon – a felső érintő meredeksége az alsó görbe magassága.`;
        fb.innerHTML = `Pontszám: <b>${score}/100</b> · a tartomány ${fmt(100 * cover, 0)}%-át rajzoltad meg. ${verdict}<br>` +
          tex(P.dt) + (P.note || "");
      }
      window.Synopsis && Synopsis.renderMath(fb);
      root._w2ds.last.text = fb.textContent;
    }
    function drawTop() {
      const T = Ttop = C.plot(top, vTop, [{ f: P.f, color: "--accent", width: 2.6 }]);
      if (help && hover != null) {
        const y0 = P.f(hover), m = P.d(hover);
        top.ctx.save(); top.ctx.strokeStyle = css("--muted"); top.ctx.setLineDash([3, 4]); top.ctx.lineWidth = 1;
        top.ctx.beginPath(); top.ctx.moveTo(T.tx(hover), 0); top.ctx.lineTo(T.tx(hover), top.h); top.ctx.stroke(); top.ctx.restore();
        w2tangent(top, T, hover, y0, m, "--setC", 60, 2.4);
        w2dot(top, T, hover, y0, "--setC", 4.5);
      }
    }
    function drawBot() {
      const T = Tbot = C.plot(bot, vBot, []);
      const ctx = bot.ctx;
      drawUser(T);
      if (checked) {
        if (P.kink != null) {
          drawCurve(T, P.d, P.a, P.kink - 1e-9, "--ok", [7, 5]);
          drawCurve(T, P.d, P.kink + 1e-9, P.b, "--ok", [7, 5]);
          w2dot(bot, T, P.kink, P.d(P.kink - 1e-6), "--ok", 5, true);
          w2dot(bot, T, P.kink, P.d(P.kink + 1e-6), "--ok", 5, true);
        } else drawCurve(T, P.d, P.a, P.b, "--ok", [7, 5]);
      }
      if (help && hover != null) {
        ctx.save(); ctx.strokeStyle = css("--muted"); ctx.setLineDash([3, 4]); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(T.tx(hover), 0); ctx.lineTo(T.tx(hover), bot.h); ctx.stroke(); ctx.restore();
        w2dot(bot, T, hover, P.d(hover), "--setC", 5);
      }
    }
    function drawUser(T) {
      const ctx = bot.ctx;
      ctx.save(); ctx.strokeStyle = css("--setB"); ctx.lineWidth = 3; ctx.lineJoin = ctx.lineCap = "round";
      ctx.beginPath();
      let pen = false;
      for (let i = 0; i < N; i++) {
        if (!Number.isFinite(arr[i])) { pen = false; continue; }
        const px = T.tx(xc(i)), py = T.ty(arr[i]);
        if (!pen) { ctx.moveTo(px, py); ctx.lineTo(px + 0.01, py); pen = true; } else ctx.lineTo(px, py);
      }
      ctx.stroke(); ctx.restore();
    }
    function drawCurve(T, f, a, b, color, dash) {
      const ctx = bot.ctx, v = vBot;
      ctx.save(); ctx.strokeStyle = col(color); ctx.lineWidth = 2.4; ctx.setLineDash(dash);
      ctx.beginPath();
      let pen = false;
      for (let k = 0; k <= 500; k++) {
        const x = a + (b - a) * k / 500, y = f(x);
        if (!Number.isFinite(y)) { pen = false; continue; }
        const yy = Math.max(v.ymin - 1, Math.min(v.ymax + 1, y));
        if (!pen) { ctx.moveTo(T.tx(x), T.ty(yy)); pen = true; } else ctx.lineTo(T.tx(x), T.ty(yy));
      }
      ctx.stroke(); ctx.restore();
    }
    function drawHint() {
      if (!help) { hint.innerHTML = "Kapcsold be a „💡 Segítség”-et, ha látni szeretnéd az érintőt."; hint.style.color = css("--muted"); return; }
      hint.style.color = "";
      if (hover == null) { hint.innerHTML = "Vidd a kurzort (vagy az ujjad) valamelyik grafikon fölé!"; return; }
      const m = P.d(hover);
      hint.innerHTML = Number.isFinite(m)
        ? `$x = ${texNum(hover, 2)}$: az érintő meredeksége $f'(x) = ${texNum(m, 2)}$ – ennyi az alsó görbe magassága itt.`
        : `$x = ${texNum(hover, 2)}$: itt nincs érintő (töréspont), $f'$ nincs értelmezve.`;
      window.Synopsis && Synopsis.renderMath(hint);
    }
    function redraw() { drawTop(); drawBot(); drawHint(); }
    top.draw = drawTop; bot.draw = drawBot;

    const local = (cv, e) => { const r = cv.c.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    const setHover = x => { hover = Math.round(Math.max(P.a, Math.min(P.b, x)) * 100) / 100; };
    function addPoint(e) {
      const [px, py] = local(bot, e);
      const x = Tbot.ix(px), y = Math.max(vBot.ymin, Math.min(vBot.ymax, Tbot.iy(py)));
      const i = Math.max(0, Math.min(N - 1, Math.floor((x - P.a) / (P.b - P.a) * N)));
      if (last && last.i !== i) {
        const s = i > last.i ? 1 : -1;
        for (let j = last.i + s; j !== i; j += s) arr[j] = last.y + (y - last.y) * (j - last.i) / (i - last.i);
      }
      arr[i] = y; last = { i, y };
      if (help) setHover(x);
    }
    bot.c.addEventListener("pointerdown", e => {
      e.preventDefault(); bot.c.setPointerCapture(e.pointerId);
      drawing = true; last = null; addPoint(e); redraw();
    });
    bot.c.addEventListener("pointermove", e => {
      if (drawing) { addPoint(e); redraw(); }
      else if (help) { setHover(Tbot.ix(local(bot, e)[0])); redraw(); }
    });
    const end = () => { if (!drawing) return; drawing = false; last = null; evaluate(); redraw(); };
    bot.c.addEventListener("pointerup", end);
    bot.c.addEventListener("pointercancel", end);
    const topMove = e => { if (!help) return; setHover(Ttop.ix(local(top, e)[0])); redraw(); };
    top.c.addEventListener("pointermove", topMove);
    top.c.addEventListener("pointerdown", topMove);

    root._w2ds = {
      PRE, setPre, check: () => bCheck.click(), clear: () => bClear.click(),
      toggleHelp: () => bHelp.click(), hoverAt: x => { setHover(x); redraw(); return hint.textContent; },
      toPx: (x, y) => { const r = bot.c.getBoundingClientRect(); return [r.left + Tbot.tx(x), r.top + Tbot.ty(y)]; },
      view: () => vBot, last: null
    };
    setPre(1);
  };

  /* ------------------------------------------------------------------
     4.4-d  Láncszabály: fogaskerekek
     ------------------------------------------------------------------ */
  W["chain-rule-gears"] = root => {
    header(root, "Láncszabály: fogaskerekek",
      "Három kerék egy sorban: $x \\to u = g(x) \\to y = f(u)$. Ha az $x$-kerék egységnyi sebességgel forog, az $u$-kerék $g'(x)$-szer, az $y$-kerék $f'(u)\\cdot g'(x)$-szer olyan gyorsan forog: az áttételek <b>szorzódnak</b>.");
    const PRE = [
      { t: "u = 3x,\\ y = 2u", g: "3x", f: "2u", r: "\\dfrac{dy}{dx} = 2\\cdot 3 = 6" },
      { t: "u = x^2,\\ y = \\sin u", g: "x^2", f: "sin(u)", r: "\\dfrac{dy}{dx} = \\cos(x^2)\\cdot 2x" },
      { t: "u = 2x + 1,\\ y = u^3", g: "2x + 1", f: "u^3", r: "\\dfrac{dy}{dx} = 3(2x + 1)^2\\cdot 2" },
      { t: "u = x^2 + 9,\\ y = \\sqrt u", g: "x^2 + 9", f: "sqrt(u)", r: "\\dfrac{dy}{dx} = \\dfrac{1}{2\\sqrt{x^2 + 9}}\\cdot 2x = \\dfrac{x}{\\sqrt{x^2 + 9}}" },
      { t: "\\text{saját}", g: "sin(x)", f: "u^2", r: "" }
    ];
    let cur = 1, G = null, F = null, err = "", playing = false, raf = 0, lastT = 0, X = 1;
    const preBtns = PRE.map((p, i) => w2texBtn(p.t, () => setPre(i)));
    const inG = h("input", { type: "text", value: PRE[4].g, style: "width:min(10rem,55vw);font-family:var(--mono)", "aria-label": "g(x)" });
    const inF = h("input", { type: "text", value: PRE[4].f, style: "width:min(10rem,55vw);font-family:var(--mono)", "aria-label": "f(u)" });
    const custom = h("div", { class: "controls" }, h("label", null, "$u = g(x) =$", inG), h("label", null, "$y = f(u) =$", inF));
    [inG, inF].forEach(e => e.addEventListener("input", () => { compileAll(); render(); }));
    const sX = slider("$x$ =", -5, 5, 0.01, 1, () => { X = sX.value; render(); }, v => fmt(v, 2));
    sX.el.style.width = "min(230px, 50vw)";
    const bPlay = btn("▶ Lejátszás", () => { playing ? stop() : play(); });
    root.append(h("div", { class: "controls", style: "gap:.3rem" }, ...preBtns), custom, h("div", { class: "controls" }, sX.wrap, bPlay));
    const cv = w2canvas(root, 0.4, 0.5);
    const st = h("div");
    const formula = h("div", { class: "readout", style: "font-family:var(--font);overflow-x:auto;overflow-wrap:anywhere;line-height:1.7" });
    root.append(st, formula, h("p", { class: "w-sub", style: "margin:.6rem 0 0",
      html: "$\\dfrac{dy}{dx} = \\dfrac{dy}{du}\\cdot\\dfrac{du}{dx}$ – mintha a $du$ „egyszerűsödne”. Ez a <b>láncszabály</b>: a külső függvény deriváltja a belső helyen × a belső függvény deriváltja." }));
    const upd = w2stats(st, ["$x$", "$u = g(x)$", "$y = f(u)$", "$\\dfrac{du}{dx} = g'(x)$", "$\\dfrac{dy}{du} = f'(u)$",
      "szorzat: $f'(u)\\cdot g'(x)$", "ellenőrzés: $\\dfrac{dy}{dx}$ numerikusan"]);

    function compileAll() {
      const p = PRE[cur];
      const gs = cur === 4 ? inG.value : p.g, fs = cur === 4 ? inF.value : p.f;
      const cg = compile(gs, ["x"]), cf = compile(fs, ["u"]);
      err = cg.err ? "$g$: " + cg.err : cf.err ? "$f$: " + cf.err : "";
      G = cg.f; F = cf.f;
    }
    function setPre(i) {
      cur = i;
      preBtns.forEach((b, j) => b.classList.toggle("on", j === i));
      custom.style.display = i === 4 ? "" : "none";
      compileAll(); render();
    }
    function vals(x) {
      if (err) return null;
      const u = G(x), y = F(u), gp = w2d1(G, x), fp = w2d1(F, u);
      const num = (F(G(x + 1e-5)) - F(G(x - 1e-5))) / 2e-5;
      return { x, u, y, gp, fp, prod: fp * gp, num };
    }
    function gear(ctx, cx, cy, R, ang, color, label) {
      const n = 12, ri = R * 0.8;
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang);
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const a0 = 2 * Math.PI * i / n, s = 2 * Math.PI / n;
        const pts = [[ri, a0], [R, a0 + s * 0.15], [R, a0 + s * 0.45], [ri, a0 + s * 0.6]];
        pts.forEach(([r, a], k) => { const X = r * Math.cos(a), Y = r * Math.sin(a); (i === 0 && k === 0) ? ctx.moveTo(X, Y) : ctx.lineTo(X, Y); });
      }
      ctx.closePath();
      ctx.fillStyle = col(color); ctx.globalAlpha = 0.2; ctx.fill(); ctx.globalAlpha = 1;
      ctx.strokeStyle = col(color); ctx.lineWidth = 2; ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, R * 0.2, 0, 2 * Math.PI); ctx.stroke();
      ctx.lineWidth = 4; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(R * 0.2, 0); ctx.lineTo(R * 0.72, 0); ctx.stroke();
      ctx.beginPath(); ctx.arc(R * 0.72, 0, 4, 0, 2 * Math.PI); ctx.fillStyle = col(color); ctx.fill();
      ctx.restore();
      ctx.save(); ctx.font = "700 14px system-ui, sans-serif"; ctx.fillStyle = css("--text"); ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(label, cx, cy); ctx.restore();
    }
    function spinMark(ctx, cx, cy, R, speed, color) {
      if (!Number.isFinite(speed) || Math.abs(speed) < 1e-9) return;
      const r = R + 7, a0 = -Math.PI * 0.72, a1 = -Math.PI * 0.28;
      ctx.save(); ctx.strokeStyle = ctx.fillStyle = col(color); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(cx, cy, r, a0, a1); ctx.stroke();
      const ae = speed > 0 ? a1 : a0, dir = speed > 0 ? 1 : -1;
      const ex = cx + r * Math.cos(ae), ey = cy + r * Math.sin(ae);
      const tx = -Math.sin(ae) * dir, ty = Math.cos(ae) * dir;      // érintőirány
      ctx.beginPath(); ctx.moveTo(ex + tx * 7, ey + ty * 7);
      ctx.lineTo(ex - ty * 4.5, ey + tx * 4.5); ctx.lineTo(ex + ty * 4.5, ey - tx * 4.5); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    const spd = v => !Number.isFinite(v) ? "–" : Math.abs(v) < 1e-9 ? "áll" : fmt(v, 2) + "×";
    function draw() {
      const ctx = cv.ctx, w = cv.w, hh = cv.h;
      ctx.clearRect(0, 0, w, hh); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
      const V = vals(X);
      if (!V) { w2text(ctx, w / 2, hh / 2, "Hibás képlet", "--bad"); return; }
      const R = w < 520 ? w / 10 : Math.min(w / 7.6, hh * 0.27), cy = w < 520 ? hh * 0.34 : hh * 0.36;
      const xs = [w / 6, w / 2, 5 * w / 6];
      const names = ["x", "u", "y"], cols = ["--accent", "--setB", "--setC"];
      const ang = [V.x, V.u, V.y], speeds = [1, V.gp, V.prod];
      // áttétel-nyilak
      [[0, V.gp, "×g′(x)"], [1, V.fp, "×f′(u)"]].forEach(([i, k, l]) => {
        const x0 = xs[i] + R + 12, x1 = xs[i + 1] - R - 12;
        if (x1 - x0 > 10) w2arrow(ctx, x0, cy, x1, cy, "--muted", 2);
        const small = w < 520;
        ctx.save(); ctx.fillStyle = css("--muted"); ctx.textAlign = "center"; ctx.textBaseline = "bottom";
        ctx.font = `600 ${small ? 10 : 12}px system-ui, sans-serif`;
        ctx.fillText(l, (xs[i] + xs[i + 1]) / 2, cy - 6);
        ctx.textBaseline = "top"; ctx.fillStyle = css("--text");
        ctx.fillText(Number.isFinite(k) ? fmt(k, 2) : "–", (xs[i] + xs[i + 1]) / 2, cy + 6);
        ctx.restore();
      });
      xs.forEach((cx, i) => {
        const a = ang[i];
        gear(ctx, cx, cy, R, Number.isFinite(a) ? a : 0, cols[i], names[i]);
        spinMark(ctx, cx, cy, R, speeds[i], cols[i]);
        const s = speeds[i];
        const small = w < 520;
        ctx.save(); ctx.textAlign = "center"; ctx.textBaseline = "top";
        ctx.font = `600 ${small ? 11 : 13}px system-ui, sans-serif`; ctx.fillStyle = css("--muted");
        ctx.fillText(i === 0 ? "x-kerék" : i === 1 ? "u-kerék" : "y-kerék", cx, cy + R + 10);
        ctx.font = `700 ${small ? 12 : 14}px system-ui, sans-serif`; ctx.fillStyle = col(cols[i]);
        ctx.fillText("sebesség: " + spd(s), cx, cy + R + (small ? 25 : 28));
        const dirT = !Number.isFinite(s) ? "" : Math.abs(s) < 1e-9 ? "(áll)" : s < 0 ? "visszafelé ↺" : "előre ↻";
        ctx.font = `600 ${small ? 11 : 12}px system-ui, sans-serif`; ctx.fillStyle = s < 0 ? css("--bad") : css("--muted");
        ctx.fillText(dirT, cx, cy + R + (small ? 40 : 46));
        ctx.restore();
      });
    }
    cv.draw = draw;
    function render() {
      draw();
      const V = vals(X);
      if (!V) { upd(Array(7).fill("–")); formula.innerHTML = "⚠️ " + err; formula.style.color = css("--bad"); window.Synopsis && Synopsis.renderMath(formula); return; }
      upd([fmt(V.x, 2), fmt(V.u, 3), fmt(V.y, 3), w2fix(V.gp, 3), w2fix(V.fp, 3), `<span style="color:var(--setC)">${w2fix(V.prod, 3)}</span>`, w2fix(V.num, 3)]);
      if (formula._k !== cur + "|" + (cur === 4 ? inG.value + inF.value : "")) {
        formula._k = cur + "|" + (cur === 4 ? inG.value + inF.value : "");
        formula.style.color = "";
        formula.innerHTML = PRE[cur].r ? tex(PRE[cur].r) : "Saját függvények: a deriváltakat a gép numerikusan számolja.";
      }
      root._w2cg.vals = V;
    }
    function frame(ts) {
      if (!playing) return;
      const dt = Math.min(0.1, (ts - (lastT || ts)) / 1000); lastT = ts;
      X += 0.3 * dt;
      if (X > 5) X = -5;
      sX.value = X;
      render();
      raf = requestAnimationFrame(frame);
    }
    function play() { playing = true; lastT = 0; bPlay.textContent = "⏸ Szünet"; bPlay.classList.add("on"); raf = requestAnimationFrame(frame); }
    function stop() { playing = false; cancelAnimationFrame(raf); bPlay.textContent = "▶ Lejátszás"; bPlay.classList.remove("on"); }
    root._w2cg = { setPre, setX: x => { X = x; sX.value = x; render(); return root._w2cg.vals; }, play, stop, vals: null, inG, inF };
    setPre(1);
  };

  /* ------------------------------------------------------------------
     4.5-a  Deriválógép lépésenként (saját szimbolikus deriváló)
     ------------------------------------------------------------------ */
  /* -- kifejezésfa: {k:"num",v} {k:"x"} {k:"const",n} {k:"neg",a} {k:"sum",t:[{s,e}]}
        {k:"mul",a,b} {k:"div",a,b} {k:"pow",a,b} {k:"fn",n,a} {k:"d",a} (= (a)' a lépésekben) -- */
  const W2FN = ["log2", "sqrt", "sin", "cos", "tan", "tg", "cot", "ctg", "exp", "ln", "lg"];
  const W2ALIAS = { tan: "tg", cot: "ctg" };
  function w2tokens(src) {
    const s = String(src).replace(/·|×/g, "*").replace(/−/g, "-").replace(/π/g, "pi").replace(/√/g, "sqrt");
    const names = [...W2FN, "pi", "e", "x"].sort((a, b) => b.length - a.length);
    const out = [];
    let i = 0;
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
        const rest = s.slice(i).toLowerCase();
        const name = names.find(n => rest.startsWith(n));
        if (!name) throw new Error("ismeretlen név: " + s.slice(i).match(/^[a-zA-Z]+/)[0] + " (a változó csak x lehet)");
        out.push({ t: "id", v: name });
        i += name.length; continue;
      }
      if ("+-*/^()".includes(c)) { out.push({ t: "op", v: c }); i++; continue; }
      throw new Error("ismeretlen jel: " + c);
    }
    return out;
  }
  function w2parse(src) {
    const toks = w2tokens(src);
    let p = 0;
    const peek = () => toks[p];
    const isOp = v => peek() && peek().t === "op" && peek().v === v;
    const expect = v => { if (!isOp(v)) throw new Error(`hiányzik: „${v}”`); p++; };
    function expr() {
      const t = [{ s: 1, e: term() }];
      while (isOp("+") || isOp("-")) { const s = toks[p++].v === "+" ? 1 : -1; t.push({ s, e: term() }); }
      return t.length === 1 ? t[0].e : { k: "sum", t };
    }
    const startsPrimary = () => peek() && (peek().t === "num" || peek().t === "id" || isOp("("));
    function term() {
      let a = unary();
      for (;;) {
        if (isOp("*") || isOp("/")) { const o = toks[p++].v, b = unary(); a = { k: o === "*" ? "mul" : "div", a, b }; }
        else if (startsPrimary()) a = { k: "mul", a, b: power() };
        else break;
      }
      return a;
    }
    function unary() {
      if (isOp("-")) { p++; return { k: "neg", a: unary() }; }
      if (isOp("+")) { p++; return unary(); }
      return power();
    }
    function power() {
      const base = primary();
      if (isOp("^")) {
        p++;
        const ex = unary();
        if (base.k === "const" && base.n === "e") return { k: "fn", n: "exp", a: ex };
        return { k: "pow", a: base, b: ex };
      }
      return base;
    }
    function primary() {
      const tk = peek();
      if (!tk) throw new Error("hiányos kifejezés (a végéről hiányzik valami)");
      if (tk.t === "num") { p++; return { k: "num", v: tk.v }; }
      if (isOp("(")) { p++; const a = expr(); expect(")"); return a; }
      if (tk.t === "id") {
        p++;
        if (W2FN.includes(tk.v)) {
          const n = W2ALIAS[tk.v] || tk.v;
          let pw = null;
          if (isOp("^")) { p++; pw = primary(); }
          let arg;
          if (isOp("(")) { p++; arg = expr(); expect(")"); } else arg = power();
          const f = { k: "fn", n, a: arg };
          return pw ? { k: "pow", a: f, b: pw } : f;
        }
        if (tk.v === "x") return { k: "x" };
        return { k: "const", n: tk.v };
      }
      if (tk.v === ")") throw new Error("fölösleges „)” vagy hiányzó kifejezés előtte");
      throw new Error(`váratlan jel: „${tk.v}”`);
    }
    if (!toks.length) throw new Error("üres kifejezés");
    const root = expr();
    if (p < toks.length) throw new Error(toks[p].v === ")" ? "fölösleges „)”" : `váratlan jel: „${toks[p].v}”`);
    return root;
  }
  const w2dep = e => e.k === "x" || (e.k === "d" ? true : e.k === "sum" ? e.t.some(t => w2dep(t.e)) : ["neg", "fn"].includes(e.k) ? w2dep(e.a) : ["mul", "div", "pow"].includes(e.k) ? w2dep(e.a) || w2dep(e.b) : false);
  const w2pureNum = e => e.k === "num" || (e.k === "neg" && w2pureNum(e.a)) || (e.k === "sum" && e.t.every(t => w2pureNum(t.e))) || (["mul", "div", "pow"].includes(e.k) && w2pureNum(e.a) && w2pureNum(e.b));
  function w2key(e) {
    switch (e.k) {
      case "num": return "n" + e.v;
      case "x": return "x";
      case "const": return "c" + e.n;
      case "sum": return "S(" + e.t.map(t => (t.s > 0 ? "+" : "-") + w2key(t.e)).join("") + ")";
      case "neg": case "d": return e.k + "(" + w2key(e.a) + ")";
      case "fn": return e.n + "(" + w2key(e.a) + ")";
      default: return e.k + "(" + w2key(e.a) + "," + w2key(e.b) + ")";
    }
  }
  const w2eq = (a, b) => w2key(a) === w2key(b);
  function w2ev(e, x) {
    switch (e.k) {
      case "num": return e.v;
      case "x": return x;
      case "const": return e.n === "pi" ? Math.PI : Math.E;
      case "neg": return -w2ev(e.a, x);
      case "sum": return e.t.reduce((s, t) => s + t.s * w2ev(t.e, x), 0);
      case "mul": return w2ev(e.a, x) * w2ev(e.b, x);
      case "div": return w2ev(e.a, x) / w2ev(e.b, x);
      case "pow": {
        const b = w2ev(e.a, x), k = w2ev(e.b, x);
        if (b < 0 && !Number.isInteger(k)) {
          for (const q of [3, 5, 7, 9]) { const r = Math.round(k * q); if (Math.abs(k * q - r) < 1e-9) return (r % 2 ? -1 : 1) * Math.pow(-b, k); }
          return NaN;
        }
        return Math.pow(b, k);
      }
      case "fn": {
        const a = w2ev(e.a, x);
        return { sin: Math.sin, cos: Math.cos, tg: Math.tan, ctg: t => 1 / Math.tan(t), exp: Math.exp, ln: Math.log,
          sqrt: Math.sqrt, lg: Math.log10, log2: Math.log2 }[e.n](a);
      }
      default: return NaN;
    }
  }
  /* -- egyszerűsítő konstruktorok -- */
  const w2N = v => ({ k: "num", v: Object.is(v, -0) ? 0 : v });
  const w2isN = (e, v) => e.k === "num" && (v === undefined || e.v === v);
  function w2neg(a) {
    if (a.k === "num") return w2N(-a.v);
    if (a.k === "neg") return a.a;
    if (a.k === "mul" && a.a.k === "num") return w2mul(w2N(-a.a.v), a.b);
    return { k: "neg", a };
  }
  function w2mul(a, b) {
    if (w2isN(a, 0) || w2isN(b, 0)) return w2N(0);
    if (w2isN(a, 1)) return b;
    if (w2isN(b, 1)) return a;
    if (a.k === "num" && b.k === "num") return w2N(a.v * b.v);
    if (w2isN(a, -1)) return w2neg(b);
    if (w2isN(b, -1)) return w2neg(a);
    if (a.k === "neg") return w2neg(w2mul(a.a, b));
    if (b.k === "neg") return w2neg(w2mul(a, b.a));
    if (b.k === "num") return w2mul(b, a);
    if (a.k === "num" && b.k === "mul" && b.a.k === "num") return w2mul(w2N(a.v * b.a.v), b.b);
    if (a.k !== "num" && b.k === "mul" && b.a.k === "num") return w2mul(b.a, w2mul(a, b.b));
    if (a.k === "mul" && a.a.k === "num") return w2mul(a.a, w2mul(a.b, b));
    return { k: "mul", a, b };
  }
  const w2coef = e => (e.k === "mul" && e.a.k === "num" ? [e.a.v, e.b] : e.k === "num" ? [e.v, w2N(1)] : [1, e]);
  function w2div(a, b) {
    if (w2isN(a, 0)) return w2N(0);
    if (w2isN(b, 1)) return a;
    if (w2isN(b, -1)) return w2neg(a);
    if (a.k === "num" && b.k === "num") return w2N(a.v / b.v);
    if (w2eq(a, b)) return w2N(1);
    if (a.k === "neg") return w2neg(w2div(a.a, b));
    if (b.k === "neg") return w2neg(w2div(a, b.a));
    if (a.k === "num" && a.v < 0) return w2neg(w2div(w2N(-a.v), b));
    if (a.k === "mul" && a.a.k === "num" && a.a.v < 0) return w2neg(w2div(w2mul(w2N(-a.a.v), a.b), b));
    const [ca, ra] = w2coef(a), [cb, rb] = w2coef(b);
    if (cb !== 1 && b.k !== "num") {
      const k = ca / cb;
      if (Number.isInteger(k)) return w2mul(w2N(k), w2div(ra, rb));
      const m = cb / ca;
      if (ca !== 1 && Number.isInteger(m)) return w2div(ra, w2mul(w2N(m), rb));
    }
    return { k: "div", a, b };
  }
  function w2pow(a, n) {
    if (w2isN(n, 0)) return w2N(1);
    if (w2isN(n, 1)) return a;
    if (w2isN(a, 1)) return w2N(1);
    if (a.k === "num" && n.k === "num" && Number.isInteger(n.v)) return w2N(Math.pow(a.v, n.v));
    return { k: "pow", a, b: n };
  }
  function w2sum(terms) {
    const out = [];
    let c = 0;
    const push = (s, e) => {
      while (e.k === "neg") { s = -s; e = e.a; }
      if (e.k === "sum") { e.t.forEach(t => push(s * t.s, t.e)); return; }
      if (e.k === "num") { c += s * e.v; return; }
      if (e.k === "mul" && e.a.k === "num" && e.a.v < 0) { s = -s; e = w2mul(w2N(-e.a.v), e.b); }
      const [c1, r1] = w2coef(e), j = out.findIndex(o => w2eq(o.r, r1));
      if (j >= 0) out[j].c += s * c1; else out.push({ c: s * c1, r: r1 });
    };
    terms.forEach(t => push(t.s, t.e));
    const res = [];
    out.forEach(o => { if (Math.abs(o.c) > 1e-15) res.push({ s: o.c < 0 ? -1 : 1, e: w2mul(w2N(Math.abs(o.c)), o.r) }); });
    out.length = 0; out.push(...res);
    if (Math.abs(c) > 1e-15) out.push({ s: c < 0 ? -1 : 1, e: w2N(Math.abs(c)) });
    if (!out.length) return w2N(0);
    if (out.length === 1) return out[0].s > 0 ? out[0].e : w2neg(out[0].e);
    return { k: "sum", t: out };
  }
  const w2fn = (n, a) => ({ k: "fn", n, a });
  /* -- TeX-kiírás -- */
  function w2numTex(v, inExp) {
    const s = v < 0 ? "-" : "", a = Math.abs(v);
    if (Number.isInteger(a)) return s + texNum(a, 0);
    if (Math.abs(a * 1e4 - Math.round(a * 1e4)) < 1e-9) return s + texNum(a, 4);
    for (let q = 2; q <= 12; q++) { const pp = Math.round(a * q); if (Math.abs(a * q - pp) < 1e-9) return s + `\\${inExp ? "" : "d"}frac{${pp}}{${q}}`; }
    return s + texNum(a, 6);
  }
  const w2par = s => `\\left(${s}\\right)`;
  const W2FT = { sin: "\\sin", cos: "\\cos", tg: "\\operatorname{tg}", ctg: "\\operatorname{ctg}", ln: "\\ln", lg: "\\lg", log2: "\\log_2" };
  const w2simple = e => e.k === "x" || e.k === "const" || (e.k === "num" && e.v >= 0);
  function w2tex(e, o = {}) {
    const P = x => w2tex(x, o);
    switch (e.k) {
      case "num": return w2numTex(e.v, o.exp);
      case "x": return "x";
      case "const": return e.n === "pi" ? "\\pi" : "e";
      case "d": return e.a.k === "x" ? "(x)'" : w2par(P(e.a)) + "'";
      case "neg": {
        const s = P(e.a);
        return "-" + (["sum", "neg"].includes(e.a.k) || (e.a.k === "num" && e.a.v < 0) ? w2par(s) : s);
      }
      case "sum": return e.t.map((t, i) => {
        let s = P(t.e);
        const wrap = ["sum", "neg"].includes(t.e.k) || /^-/.test(s);
        if (i === 0) return t.s < 0 ? "-" + (wrap ? w2par(s) : s) : s;
        return (t.s < 0 ? " - " : " + ") + (wrap ? w2par(s) : s);
      }).join("");
      case "mul": {
        const fs = [];
        (function fl(x) { if (x.k === "mul") { fl(x.a); fl(x.b); } else fs.push(x); })(e);
        let out = "";
        fs.forEach((f, i) => {
          let s = P(f);
          const paren = ["sum", "neg"].includes(f.k) || (i > 0 && /^-/.test(s));
          if (paren) s = w2par(s);
          if (i > 0) {
            const prev = fs[i - 1], pParen = ["sum", "neg"].includes(prev.k);
            const juxt = (prev.k === "num" && (["x", "pow", "fn", "d"].includes(f.k) || (f.k === "const" && f.n === "pi")) && !(f.k === "pow" && f.a.k === "num"))
              || (f.k === "fn" && ["x", "const", "pow"].includes(prev.k))
              || (paren && (["num", "x", "pow", "const"].includes(prev.k) || pParen));
            out += juxt ? "" : "\\cdot ";
          }
          out += s;
        });
        return out;
      }
      case "div": return o.exp ? `\\frac{${P(e.a)}}{${P(e.b)}}` : `\\dfrac{${P(e.a)}}{${P(e.b)}}`;
      case "pow": {
        let b = P(e.a);
        if (!(e.a.k === "x" || e.a.k === "const" || (e.a.k === "num" && e.a.v >= 0 && Number.isInteger(e.a.v)))) b = w2par(b);
        return `${b}^{${w2tex(e.b, { exp: true })}}`;
      }
      case "fn": {
        if (e.n === "exp") return `e^{${w2tex(e.a, { exp: true })}}`;
        if (e.n === "sqrt") return `\\sqrt{${P(e.a)}}`;
        return W2FT[e.n] + (w2simple(e.a) ? " " + P(e.a) : w2par(P(e.a)));
      }
      default: return "?";
    }
  }
  /* -- deriválás lépésnaplóval -- */
  function w2D(e, steps) {
    const T = w2tex, d = a => ({ k: "d", a }), lhs = x => (x.k === "x" ? "(x)'" : w2par(T(x)) + "'");
    const step = (name, rhs) => {
      const line = `${lhs(e)} = ${typeof rhs === "string" ? rhs : T(rhs)}`;
      if (!steps.some(s => s.line === line)) steps.push({ name, line });
    };
    if (!w2dep(e)) { step("Konstans", "0"); return w2N(0); }
    switch (e.k) {
      case "x": step("Az $x$ deriváltja", "1"); return w2N(1);
      case "neg": step("Konstansszoros ($-1$-szeres)", { k: "neg", a: d(e.a) }); return w2neg(w2D(e.a, steps));
      case "sum":
        step("Összeg / különbség (tagonként)", { k: "sum", t: e.t.map(t => ({ s: t.s, e: d(t.e) })) });
        return w2sum(e.t.map(t => ({ s: t.s, e: w2D(t.e, steps) })));
      case "mul": {
        const { a, b } = e;
        if (!w2dep(a)) { step("Konstansszoros", { k: "mul", a, b: d(b) }); return w2mul(a, w2D(b, steps)); }
        if (!w2dep(b)) { step("Konstansszoros", { k: "mul", a: b, b: d(a) }); return w2mul(b, w2D(a, steps)); }
        step("Szorzat (Leibniz-szabály)", { k: "sum", t: [{ s: 1, e: { k: "mul", a: d(a), b } }, { s: 1, e: { k: "mul", a, b: d(b) } }] });
        const da = w2D(a, steps), db = w2D(b, steps);
        return w2sum([{ s: 1, e: w2mul(da, b) }, { s: 1, e: w2mul(a, db) }]);
      }
      case "div": {
        const { a, b } = e;
        if (!w2dep(b)) { step("Konstansszoros (osztás konstanssal)", { k: "div", a: d(a), b }); return w2div(w2D(a, steps), b); }
        step("Hányados", { k: "div", a: { k: "sum", t: [{ s: 1, e: { k: "mul", a: d(a), b } }, { s: -1, e: { k: "mul", a, b: d(b) } }] }, b: { k: "pow", a: b, b: w2N(2) } });
        const da = w2D(a, steps), db = w2D(b, steps);
        return w2div(w2sum([{ s: 1, e: w2mul(da, b) }, { s: -1, e: w2mul(a, db) }]), w2pow(b, w2N(2)));
      }
      case "pow": {
        const { a, b } = e;
        if (!w2dep(b)) {
          let n = b, n1;
          if (w2pureNum(b)) { n = w2N(w2ev(b, 0)); n1 = w2N(n.v - 1); } else n1 = w2sum([{ s: 1, e: b }, { s: -1, e: w2N(1) }]);
          if (a.k === "x") { const r = w2mul(n, w2pow(a, n1)); step("Hatványfüggvény", r); return r; }
          step("Hatvány + láncszabály", w2mul(w2mul(n, w2pow(a, n1)), d(a)));
          return w2mul(w2mul(n, w2pow(a, n1)), w2D(a, steps));
        }
        if (!w2dep(a)) {
          const lna = w2fn("ln", a);
          if (b.k === "x") { const r = w2mul(e, lna); step("Exponenciális függvény", r); return r; }
          step("Exponenciális + láncszabály", w2mul(w2mul(e, lna), d(b)));
          return w2mul(w2mul(e, lna), w2D(b, steps));
        }
        step("Logaritmikus deriválás ($u^v = e^{v\\ln u}$)", w2mul(e, { k: "sum", t: [{ s: 1, e: { k: "mul", a: d(b), b: w2fn("ln", a) } }, { s: 1, e: { k: "mul", a: b, b: { k: "div", a: d(a), b: a } } }] }));
        const db = w2D(b, steps), da = w2D(a, steps);
        return w2mul(e, w2sum([{ s: 1, e: w2mul(db, w2fn("ln", a)) }, { s: 1, e: w2div(w2mul(b, da), a) }]));
      }
      case "fn": {
        const u = e.a;
        const outer = du => {
          switch (e.n) {
            case "sin": return w2mul(w2fn("cos", u), du);
            case "cos": return w2neg(w2mul(w2fn("sin", u), du));
            case "tg": return w2div(du, w2pow(w2fn("cos", u), w2N(2)));
            case "ctg": return w2neg(w2div(du, w2pow(w2fn("sin", u), w2N(2))));
            case "exp": return w2mul(e, du);
            case "ln": return w2div(du, u);
            case "sqrt": return w2div(du, w2mul(w2N(2), e));
            case "lg": return w2div(du, w2mul(u, w2fn("ln", w2N(10))));
            case "log2": return w2div(du, w2mul(u, w2fn("ln", w2N(2))));
          }
          return w2N(NaN);
        };
        if (u.k === "x") { const r = outer(w2N(1)); step("Elemi függvény", r); return r; }
        step("Láncszabály", outer(d(u)));
        return outer(w2D(u, steps));
      }
    }
    return w2N(NaN);
  }
  function w2derive(src) {
    const e = w2parse(src), steps = [];
    const r = w2D(e, steps);
    return { e, r, steps, f: x => w2ev(e, x), df: x => w2ev(r, x) };
  }
  function w2numCheck(f, df) {
    const cand = [0.7, 1.3, 2.1, -0.6, 0.35, 1.7, 2.6, -1.4, 3.3, 0.15, -2.2, 0.9, 4.1, -3.1, 0.05];
    const rows = [];
    for (const x of cand) {
      if (rows.length >= 3) break;
      const s = df(x), n = (f(x + 1e-5) - f(x - 1e-5)) / 2e-5;
      if (!Number.isFinite(s) || !Number.isFinite(n) || !Number.isFinite(f(x))) continue;
      rows.push({ x, s, n, ok: Math.abs(s - n) <= 1e-5 * Math.max(1, Math.abs(s)) });
    }
    return rows;
  }
  W["derivative-machine"] = root => {
    header(root, "Deriválógép lépésenként",
      "Írj be egy $x$-től függő kifejezést (pl. <code>x^2 sin(x)</code>, <code>sqrt(x^2 + 9)</code>, <code>e^(2x)</code>), és a gép a szabályokat egyenként alkalmazva deriválja. Függvények: <code>sin cos tg ctg exp ln lg log2 sqrt</code>, állandók: <code>pi</code>, <code>e</code>.");
    const PRE = ["cos(x^3) - 2", "sin(x)^3 + x - 1", "e^(x*sin(x))", "ln(3x^2 + 2x - 6)", "(4 - 3x)(5 + 6x)", "x/(x^2 + 1)", "sqrt(x^2 + 9)", "x^x", "tg(sin(5x))"];
    const inp = h("input", { type: "text", value: PRE[0], style: "width:min(18rem,70vw);font-family:var(--mono)", "aria-label": "f(x)", spellcheck: "false", autocapitalize: "off" });
    const go = btn("Deriváld!", () => run(), "btn primary");
    inp.addEventListener("keydown", e => { if (e.key === "Enter") run(); });
    const preBtns = PRE.map(s => { let t; try { t = w2tex(w2parse(s)); } catch (e) { t = s; } return w2texBtn(t, () => { inp.value = s; run(); }); });
    root.append(h("div", { class: "controls", style: "gap:.3rem" }, ...preBtns),
      h("div", { class: "controls" }, h("label", null, "$f(x) =$", inp), go));
    const res = h("div", { class: "readout", style: "font-family:var(--font);overflow-x:auto;overflow-wrap:anywhere;line-height:1.6" });
    const det = h("details", null, h("summary", null, "Lépések"));
    const ol = h("ol", { style: "margin:.3rem 0 .2rem;padding-left:1.4rem;line-height:1.9" });
    det.append(ol);
    const chk = h("div", { style: "margin-top:.6rem" });
    root.append(res, det, chk);
    function run() {
      const src = inp.value;
      preBtns.forEach((b, i) => b.classList.toggle("on", PRE[i] === src));
      let D;
      try { D = w2derive(src); }
      catch (e) {
        res.style.color = css("--bad");
        res.innerHTML = "⚠️ Ezt nem értem: " + e.message.replace(/</g, "&lt;") + ". Nézd meg a zárójeleket és a műveleti jeleket!";
        ol.innerHTML = ""; chk.innerHTML = "";
        root._w2dm.last = { err: e.message };
        return;
      }
      res.style.color = "";
      const ft = w2tex(D.e), rt = w2tex(D.r);
      res.innerHTML = `<div>${tex("f(x) = " + ft, true)}</div><div>${tex("f'(x) = " + rt, true)}</div>`;
      ol.innerHTML = "";
      const MAX = 15;
      D.steps.slice(0, MAX).forEach(s => ol.append(h("li", { style: "overflow-x:auto;overflow-y:hidden" }, h("b", { html: s.name + ":" }), " ", h("span", { html: tex(s.line) }))));
      if (D.steps.length > MAX) ol.append(h("li", { class: "muted", style: "list-style:none" }, `… (a további ${D.steps.length - MAX} lépés ugyanígy)`));
      const rows = w2numCheck(D.f, D.df);
      const allOk = rows.length >= 3 && rows.every(r => r.ok);
      chk.innerHTML = "";
      if (rows.length) chk.append(h("div", { class: "tw", style: "overflow-x:auto" }, h("table", { style: "font-size:.88rem", html:
        `<thead><tr><th>$x$</th><th>$f'(x)$ a képletből</th><th>numerikusan: $\\frac{f(x + h) - f(x - h)}{2h}$</th></tr></thead><tbody>` +
        rows.map(r => `<tr><td>${fmt(r.x, 2)}</td><td>${fmt(r.s, 6)}</td><td>${fmt(r.n, 6)}</td></tr>`).join("") + "</tbody>" })));
      chk.append(h("div", { class: "readout", style: "font-family:var(--font)", html: allOk
        ? `<b style="color:var(--ok)">✔ numerikusan ellenőrizve</b> (${rows.length} ponton, $h = 10^{-5}$, relatív hiba $\\lt 10^{-5}$)`
        : rows.length < 3 ? `<b style="color:var(--bad)">⚠ nem találtam elég pontot,</b> ahol a függvény értelmezve van – a numerikus ellenőrzés elmaradt.`
        : `<b style="color:var(--bad)">⚠ eltérés</b> a numerikus deriválttól – lehet, hogy a függvény itt nem deriválható.` }));
      window.Synopsis && Synopsis.renderMath(root);
      root._w2dm.last = { ft, rt, steps: D.steps, rows, allOk, df: D.df };
    }
    root._w2dm = { run: s => { inp.value = s; run(); return root._w2dm.last; }, last: null, PRE };
    run();
  };

  /* ------------------------------------------------------------------
     4.6-a  Út, sebesség, gyorsulás
     ------------------------------------------------------------------ */
  W["motion-graphs"] = root => {
    header(root, "Út, sebesség, gyorsulás",
      "A test egy egyenes pályán mozog; $s(t)$ a helye [m] a $t$ időpillanatban [s]. A sebesség $v(t) = s'(t)$ [m/s], a gyorsulás $a(t) = v'(t) = s''(t)$ [m/s²]. Húzd a csúszkát, vagy indítsd el a mozgást! (A grafikonokra kattintva is választhatsz időpontot.)");
    const PRE = [
      { t: "s = 5t^2", s: "5t^2", tmax: 3, note: "Szabadesés ($g \\approx 10$ m/s²): a sebesség egyenletesen nő, a gyorsulás állandó." },
      { t: "s = 20t - 2t^2", s: "20t - 2t^2", tmax: 5, note: "Fékező autó: $v$ egyenletesen csökken, $a = -4$ m/s² állandó; $t = 5$ s-nál megáll." },
      { t: "s = 2\\sin t", s: "2 sin(t)", tmax: 2 * Math.PI, note: "Rezgés: a gyorsulás mindig a középpont ($s = 0$) felé mutat." },
      { t: "s = t^3 - 6t^2 + 9t", s: "t^3 - 6t^2 + 9t", tmax: 4, note: "Oda-vissza: $t = 1$-nél és $t = 3$-nál megáll, és irányt vált." },
      { t: "\\text{saját}", s: "t^2 - 4t", tmax: 5, note: "Saját mozgás: a deriváltakat a gép numerikusan számolja." }
    ];
    let cur = 0, S = null, err = "", tmax = 3, tc = 1, view = null, playing = false, raf = 0, lastT = 0, speed = 1;
    const V = t => w2d1(S, t, 1e-5), A = t => w2d2(S, t, 1e-3);
    const preBtns = PRE.map((p, i) => w2texBtn(p.t, () => setPre(i)));
    const inS = h("input", { type: "text", value: PRE[4].s, style: "width:min(12rem,58vw);font-family:var(--mono)", "aria-label": "s(t)" });
    const inT = h("input", { type: "text", value: "5", style: "width:4.5rem;font-family:var(--mono)", "aria-label": "t max" });
    const custom = h("div", { class: "controls" }, h("label", null, "$s(t) =$", inS), h("label", null, "$t_{\\max} =$", inT));
    [inS, inT].forEach(e => e.addEventListener("input", () => setup()));
    const sT = slider("$t$ =", 0, 3, 0.01, 1, () => { stop(); tc = sT.value; render(); }, v => fmt(v, 2) + " s");
    sT.el.style.width = "min(230px, 50vw)";
    const bPlay = btn("▶ Lejátszás", () => (playing ? stop() : play()));
    const seg = segmented([["½×", 0.5], ["1×", 1], ["2×", 2]], 1, v => { speed = v; });
    seg.wrap.style.margin = "0";
    root.append(h("div", { class: "controls", style: "gap:.3rem" }, ...preBtns), custom,
      h("div", { class: "controls" }, sT.wrap, bPlay, seg.wrap));
    const track = w2canvas(root, 0.17, 0.3);
    track.c.style.touchAction = "pan-y";
    const st = h("div");
    const status = h("div", { class: "readout", style: "font-family:var(--font);min-height:1.6em;overflow-wrap:anywhere" });
    root.append(st, status);
    const upd = w2stats(st, ["$t$ [s]", "$s$ [m]", "$v = s'(t)$ [m/s]", "$a = s''(t)$ [m/s²]"]);
    const mk = (name) => { root.append(h("div", { class: "muted", style: "font-size:.85rem;margin-top:.45rem", html: name })); const c = w2canvas(root, 0.26, 0.45); c.c.style.touchAction = "pan-y"; return c; };
    const cS = mk("út–idő: $s(t)$ – az érintő meredeksége $v$"), cV = mk("sebesség–idő: $v(t) = s'(t)$ – az érintő meredeksége $a$"), cA = mk("gyorsulás–idő: $a(t) = s''(t)$");
    root.append(w2legend([["$s(t)$", "--accent"], ["$v(t)$", "--setB"], ["$a(t)$", "--setC"], ["érintő", "--muted"]]));
    const note = h("p", { class: "w-sub", style: "margin:.6rem 0 0" });
    root.append(note);
    const panels = [[cS, "--accent"], [cV, "--setB"], [cA, "--setC"]];

    function rng(f) {
      const ys = Array.from({ length: 301 }, (_, k) => f(tmax * k / 300)).filter(Number.isFinite);
      if (!ys.length) return [-1, 1];
      let lo = Math.min(0, ...ys), hi = Math.max(0, ...ys);
      if (hi - lo < 1e-9) { lo -= 1; hi += 1; }
      const p = (hi - lo) * 0.1;
      return [lo - p, hi + p];
    }
    function setPre(i) {
      cur = i;
      preBtns.forEach((b, j) => b.classList.toggle("on", j === i));
      custom.style.display = i === 4 ? "" : "none";
      note.innerHTML = PRE[i].note;
      window.Synopsis && Synopsis.renderMath(note);
      setup();
    }
    function setup() {
      stop();
      const p = PRE[cur];
      const c = compile(cur === 4 ? inS.value : p.s, ["t"]);
      err = c.err ? "Nem értem a képletet: " + c.err + "." : "";
      tmax = p.tmax;
      if (cur === 4) {
        let tm = NaN;
        try { tm = C.parse(inT.value, []).f({}); } catch (e) { /* hibás */ }
        if (!(tm > 0 && tm <= 1000)) err = err || "A $t_{\\max}$ legyen pozitív szám (legfeljebb 1000).";
        else tmax = tm;
      }
      S = c.f || (() => NaN);
      if (!err && !Array.from({ length: 21 }, (_, k) => S(tmax * k / 20)).some(Number.isFinite)) err = "Az $s(t)$ a $[0; t_{\\max}]$ intervallumon sehol sincs értelmezve.";
      sT.el.max = tmax;
      if (tc > tmax) tc = tmax;
      sT.value = tc;
      const rs = rng(S), rv = rng(V), ra = rng(A);
      const x0 = -0.045 * tmax;
      view = [
        { xmin: x0, xmax: tmax * 1.03, ymin: rs[0], ymax: rs[1], xname: "t", yname: "s [m]" },
        { xmin: x0, xmax: tmax * 1.03, ymin: rv[0], ymax: rv[1], xname: "t", yname: "v [m/s]" },
        { xmin: x0, xmax: tmax * 1.03, ymin: ra[0], ymax: ra[1], xname: "t", yname: "a [m/s²]" }
      ];
      const sv = Array.from({ length: 301 }, (_, k) => S(tmax * k / 300)).filter(Number.isFinite);
      track.sr = sv.length ? [Math.min(...sv), Math.max(...sv)] : [-1, 1];
      if (track.sr[1] - track.sr[0] < 1e-9) track.sr = [track.sr[0] - 1, track.sr[1] + 1];
      // robusztus skála: a végpontok (pl. sqrt(t) a 0-ban) ne torzítsák
      const robust = f => { const a = Array.from({ length: 299 }, (_, k) => Math.abs(f(tmax * (k + 1) / 300))).filter(Number.isFinite).sort((x, y) => x - y); return a.length ? Math.max(1e-9, a[Math.floor(a.length * 0.98)]) : 1; };
      track.vmax = robust(V); track.amax = robust(A);
      render();
    }
    function drawPanels() {
      const t = tc;
      const fs = [S, V, A], slopes = [V(t), A(t)];
      panels.forEach(([cv], i) => {
        if (!view) return;
        const T = C.plot(cv, view[i], [{ f: fs[i], color: panels[i][1], width: 2.4, domain: [0, tmax] }, { vline: t, color: "--muted", dash: [4, 4], width: 1.2 }]);
        cv.T = T;
        const y = fs[i](t);
        if (i < 2) w2tangent(cv, T, t, y, slopes[i], "--muted", 52, 2);
        w2dot(cv, T, t, y, panels[i][1], 5);
      });
    }
    function niceStep(span, px) {
      const target = span / Math.max(2, px / 60), pw = Math.pow(10, Math.floor(Math.log10(target)));
      for (const m of [1, 2, 5, 10]) if (m * pw >= target) return m * pw;
      return 10 * pw;
    }
    function drawTrack() {
      const ctx = track.ctx, w = track.w, hh = track.h, t = tc;
      ctx.clearRect(0, 0, w, hh); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
      if (!track.sr) return;
      const m = 24, [s0, s1] = track.sr, sx = s => m + (s - s0) / (s1 - s0) * (w - 2 * m);
      const yR = hh * 0.66;
      ctx.save();
      ctx.strokeStyle = css("--border"); ctx.lineWidth = 6; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(m - 10, yR); ctx.lineTo(w - m + 10, yR); ctx.stroke();
      const step = niceStep(s1 - s0, w - 2 * m);
      ctx.fillStyle = css("--muted"); ctx.strokeStyle = css("--muted"); ctx.lineWidth = 1;
      ctx.font = "11px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "top";
      for (let s = Math.ceil(s0 / step) * step; s <= s1 + 1e-9; s += step) {
        ctx.beginPath(); ctx.moveTo(sx(s), yR + 4); ctx.lineTo(sx(s), yR + 9); ctx.stroke();
        ctx.fillText(fmt(s, 3), sx(s), Math.min(hh - 13, yR + 10));
      }
      ctx.textAlign = "left"; ctx.fillText("pálya: s [m]", 4, 3);
      ctx.restore();
      const s = S(t), v = V(t), a = A(t);
      if (!Number.isFinite(s)) { w2text(ctx, w / 2, hh * 0.3, "itt nincs értelmezve", "--bad"); return; }
      const X = sx(s), r = Math.max(6, Math.min(10, hh * 0.09));
      ctx.save(); ctx.fillStyle = css("--accent"); ctx.beginPath(); ctx.arc(X, yR - r + 1, r, 0, 2 * Math.PI); ctx.fill(); ctx.restore();
      const lim = (q, L) => Math.max(-L, Math.min(L, q));
      const kv = (w * 0.2) / track.vmax, ka = (w * 0.12) / track.amax;
      const room = q => (q > 0 ? Math.min(q, w - 16 - X) : Math.max(q, 16 - X));   // a nyíl és a címke ne lógjon ki
      const vL = room(lim(v * kv, w * 0.3)), aL = room(lim(a * ka, w * 0.2));
      const yV = hh * 0.16, yA = hh * 0.36;
      if (Number.isFinite(v) && Math.abs(vL) > 2) { w2arrow(ctx, X, yV, X + vL, yV, "--setB", 3); w2text(ctx, X + vL + (v > 0 ? 12 : -12), yV, "v", "--setB", "center", "700 12px system-ui, sans-serif"); }
      if (Number.isFinite(a) && Math.abs(aL) > 2) { w2arrow(ctx, X, yA, X + aL, yA, "--setC", 2.5); w2text(ctx, X + aL + (a > 0 ? 12 : -12), yA, "a", "--setC", "center", "700 12px system-ui, sans-serif"); }
      ctx.save(); ctx.strokeStyle = css("--muted"); ctx.lineWidth = 1; ctx.setLineDash([2, 3]);
      ctx.beginPath(); ctx.moveTo(X, yV - 6); ctx.lineTo(X, yR - 2 * r); ctx.stroke(); ctx.restore();
    }
    function state(t) {
      const v = V(t), a = A(t), vs = track.vmax || 1, as = track.amax || 1;
      const dl = Math.max(0, t - 0.05), dr = Math.min(tmax, t + 0.05);
      const near0 = Math.abs(v) < 0.02 * vs;
      const flips = V(dl) * V(dr) < 0;
      if (!Number.isFinite(v)) return "";
      if (near0 || flips) return `<b>$v \\approx 0$: megáll</b>` + (flips ? " – <b>és irányt vált</b> (a sebesség előjelet vált)." : ".");
      const dir = v > 0 ? "előre halad ($v \\gt 0$)" : "visszafelé halad ($v \\lt 0$)";
      if (!Number.isFinite(a) || Math.abs(a) < 1e-4 * Math.max(1, as)) return dir + ", most éppen nem gyorsul és nem lassul ($a = 0$).";
      return dir + ", " + (v * a > 0 ? "<b>gyorsul</b>: $v$ és $a$ azonos előjelű." : "<b>lassul</b>: $v$ és $a$ ellentétes előjelű.");
    }
    function render() {
      drawTrack(); drawPanels();
      const t = tc;
      if (err) {
        upd(["–", "–", "–", "–"]);
        status.style.color = css("--bad"); status.innerHTML = "⚠️ " + err;
        window.Synopsis && Synopsis.renderMath(status);
        return;
      }
      const s = S(t), v = V(t), a = A(t);
      upd([fmt(t, 2), fmt(s, 3), `${fmt(v, 3)} <span style="font-size:.78rem;font-weight:600;color:var(--muted)">(${fmt(v * 3.6, 1)} km/h)</span>`, fmt(a, 3)]);
      status.style.color = "";
      const html = state(t);
      if (status._h !== html) { status._h = html; status.innerHTML = html; window.Synopsis && Synopsis.renderMath(status); }
      root._w2mg.vals = { t, s, v, a, state: status.textContent };
    }
    track.draw = drawTrack;
    [cS, cV, cA].forEach(cv => {
      cv.draw = drawPanels;
      const pick = e => {
        if (!cv.T) return;
        const r = cv.c.getBoundingClientRect();
        const t = Math.max(0, Math.min(tmax, cv.T.ix(e.clientX - r.left)));
        stop(); tc = Math.round(t * 100) / 100; sT.value = tc; render();
      };
      let down = false;
      cv.c.addEventListener("pointerdown", e => { down = true; pick(e); });
      cv.c.addEventListener("pointermove", e => { if (down) pick(e); });
      ["pointerup", "pointercancel", "pointerleave"].forEach(ev => cv.c.addEventListener(ev, () => { down = false; }));
    });
    function frame(ts) {
      if (!playing) return;
      const dt = Math.min(0.1, (ts - (lastT || ts)) / 1000); lastT = ts;
      tc += dt * speed * (tmax > 20 ? tmax / 10 : 1);
      if (tc >= tmax) { tc = tmax; sT.value = tc; render(); stop(); return; }
      sT.value = tc; render();
      raf = requestAnimationFrame(frame);
    }
    function play() {
      if (err) return;
      if (tc >= tmax - 1e-9) tc = 0;
      playing = true; lastT = 0; bPlay.textContent = "⏸ Szünet"; bPlay.classList.add("on");
      raf = requestAnimationFrame(frame);
    }
    function stop() { playing = false; cancelAnimationFrame(raf); bPlay.textContent = "▶ Lejátszás"; bPlay.classList.remove("on"); }
    root._w2mg = { setPre, setT: t => { tc = t; sT.value = t; render(); return root._w2mg.vals; }, play, stop, vals: null, inS, inT };
    setPre(0);
  };
