  /* ==================================================================
     w1.js – secant-to-tangent, differentiable-or-not, linear-approx, marginal-cost
     ================================================================== */
  /* numerikus derivált (központi differencia) */
  const w1D = (f, x) => { const e = 1e-6 * Math.max(1, Math.abs(x)); return (f(x + e) - f(x - e)) / (2 * e); };
  /* y-tartomány minták alapján, a kilógó értékek levágásával */
  function w1yr(vals, pad = 0.12) {
    const v = vals.filter(Number.isFinite).sort((a, b) => a - b);
    if (!v.length) return [-1, 1];
    let lo = v[Math.floor(v.length * 0.02)], hi = v[Math.ceil(v.length * 0.98) - 1];
    if (hi - lo < 1e-9) { lo -= 1; hi += 1; }
    const p = (hi - lo) * pad;
    return [lo - p, hi + p];
  }
  const w1fv = (v, d = 6) => (Number.isFinite(v) ? fmt(v, d) : "nincs értelmezve");
  /* képletmező + gomb + hibaüzenet */
  function w1formula(init, onOk, label = "f(x) = ") {
    const inp = h("input", { type: "text", value: init, style: "width:11rem;max-width:100%;font-family:var(--mono)" });
    const err = h("span", { class: "muted", style: "overflow-wrap:anywhere" });
    const go = () => {
      const c = compile(inp.value, ["x"]);
      if (c.err) { err.textContent = "⚠ " + c.err; return; }
      err.textContent = ""; onOk(c.f, inp.value);
    };
    inp.addEventListener("keydown", e => { if (e.key === "Enter") go(); });
    return { inp, err, go, wrap: h("label", null, label, inp) };
  }

  /* ------------------------------------------------------------------
     4.1  Szelőből érintő
     ------------------------------------------------------------------ */
  W["secant-to-tangent"] = root => {
    header(root, "Szelőből érintő",
      "Az $(a; f(a))$ pontot rögzítjük, a második pontot a csúszkával közelítjük hozzá: $h = \\pm 10^{-k}$. Figyeld, hogyan fordul be a szelő " +
      "(és hová tart a meredeksége, a differenciahányados). Saját függvényt is megadhatsz.");
    const P = [
      { l: "5x² (a kő)", src: "5x^2", a: 1 },
      { l: "x²", src: "x^2", a: 1 },
      { l: "x³", src: "x^3", a: 1 },
      { l: "sin x", src: "sin(x)", a: 0 },
      { l: "√x", src: "sqrt(x)", a: 4 },
      { l: "1/x", src: "1/x", a: 2 },
      { l: "|x|", src: "abs(x)", a: 0 }
    ];
    let fn = compile(P[0].src, ["x"]).f, a = P[0].a, side = 1, showT = true;
    const F = w1formula(P[0].src, (f) => { fn = f; bs.forEach(b => b.classList.remove("on")); readA(); draw(); });
    const ain = h("input", { type: "text", value: "1", style: "width:4rem;font-family:var(--mono)" });
    const readA = () => { const c = compile(ain.value, ["x"]); if (!c.err) a = c.f(0); };
    ain.addEventListener("keydown", e => { if (e.key === "Enter") { readA(); draw(); } });
    const bs = P.map(p => {
      const b = btn(p.l, () => {
        fn = compile(p.src, ["x"]).f; a = p.a; F.inp.value = p.src; ain.value = String(p.a); F.err.textContent = "";
        bs.forEach(x => x.classList.toggle("on", x === b)); draw();
      });
      return b;
    });
    bs[0].classList.add("on");
    root.append(h("div", { class: "controls", style: "gap:.3rem" }, ...bs));
    root.append(h("div", { class: "controls" }, F.wrap, h("label", null, "a = ", ain), btn("Rajzold", () => { F.go(); }), F.err));
    const K = slider("közelítés: k =", 0, 3, 0.05, 0, () => draw(), v => fmt(v, 2));
    const sideSeg = segmented([["jobbról (h > 0)", 1], ["balról (h < 0)", -1]], 1, v => { side = v; draw(); });
    const tb = btn("érintő: be", () => { showT = !showT; tb.textContent = "érintő: " + (showT ? "be" : "ki"); tb.classList.toggle("on", showT); draw(); }, "btn on");
    root.append(h("div", { class: "controls" }, K.wrap), h("div", { class: "controls" }, sideSeg.wrap, tb));
    const cv = C.canvas(root, 0.58, 760);
    root.append(legend([["f grafikonja", "--accent"], ["szelő", "--setB"], ["érintő", "--ok", true]]));
    const out = h("div", { class: "stat-row" });
    const tw = h("div", { class: "tw", style: "overflow-x:auto;margin-top:.5rem" });
    const note = h("p", { class: "w-sub", style: "margin:.4rem 0 0" });
    root.append(out, note, tw);

    function draw() {
      const hh = side * Math.pow(10, -K.value);
      const fa = fn(a), fb = fn(a + hh);
      const m = (fb - fa) / hh;
      const dl = (fn(a - 1e-7) - fa) / -1e-7, dr = (fn(a + 1e-7) - fa) / 1e-7;
      const sameSides = Number.isFinite(dl) && Number.isFinite(dr) && Math.abs(dl - dr) < 1e-3 * Math.max(1, Math.abs(dl));
      const d = sameSides ? w1D(fn, a) : NaN;
      const x0 = a - 3, x1 = a + 3;
      const samp = [];
      for (let k = 0; k <= 300; k++) samp.push(fn(x0 + 6 * k / 300));
      let [lo, hi] = w1yr([...samp, fa, fb]);
      cv.draw = () => {
        const layers = [
          { f: fn, color: "--accent" },
          { f: x => fa + m * (x - a), color: "--setB", width: 1.8 },
          { seg: [[a, fa], [a + hh, fa]], color: "--muted", dash: [3, 3], width: 1.2 },
          { seg: [[a + hh, fa], [a + hh, fb]], color: "--muted", dash: [3, 3], width: 1.2 }
        ];
        if (showT && Number.isFinite(d)) layers.push({ f: x => fa + d * (x - a), color: "--ok", dash: [7, 5], width: 1.8 });
        layers.push({ points: [[a, fa]], color: "--accent", r: 5 }, { points: [[a + hh, fb]], color: "--setB", r: 5 });
        C.plot(cv, { xmin: x0, xmax: x1, ymin: lo, ymax: hi }, layers);
      };
      cv.draw();
      statRow(out, [
        ["$h$", fmt(hh, 4)],
        ["$\\dfrac{f(a + h) - f(a)}{h}$", w1fv(m, 5)],
        ["$f'(a)$ (határérték)", Number.isFinite(d) ? fmt(d, 5) : "nem létezik"],
        ["eltérés", Number.isFinite(d) && Number.isFinite(m) ? fmt(m - d, 5) : "–"]
      ]);
      note.innerHTML = Number.isFinite(d)
        ? "Ahogy $h \\to 0$, a szelő meredeksége $f'(a)$-hoz tart, a szelő pedig az érintőbe fordul. A kerekítés miatt a kijelzett szám nagyon kicsi $h$-nál sem pontosan a határérték."
        : "Itt a bal és a jobb oldali differenciahányados <b>nem ugyanoda tart</b> (" + w1fv(dl, 3) + " és " + w1fv(dr, 3) + "): a szelő az oldaltól függően más helyzetbe fordul – nincs érintő, nincs derivált (4.2).";
      window.Synopsis && Synopsis.renderMath(note);
      const hs = [1, 0.1, 0.01, 0.001];
      const row = s => hs.map(t => `<td>${w1fv((fn(a + s * t) - fa) / (s * t), 5)}</td>`).join("");
      tw.innerHTML = `<table style="max-width:620px"><tr><th>$h$</th>${hs.map(t => `<th>${fmt(t, 3)}</th>`).join("")}</tr>` +
        `<tr><th>jobbról</th>${row(1)}</tr><tr><th>balról ($-h$)</th>${row(-1)}</tr></table>`;
      window.Synopsis && Synopsis.renderMath(tw);
    }
    draw();
  };

  /* ------------------------------------------------------------------
     4.2  Deriválható-e a 0-ban? – ráközelítés
     ------------------------------------------------------------------ */
  W["differentiable-or-not"] = root => {
    header(root, "Deriválható-e a 0-ban?",
      "Válassz egy függvényt, és közelíts rá a 0-ra (a két tengely ugyanúgy nagyít). Ha a függvény deriválható, a nagyított kép egyre inkább " +
      "<b>egyenesnek</b> látszik. Tippelj, aztán nézd meg a bal és a jobb oldali differenciahányadosokat!");
    const sinv = x => Math.sin(1 / x);
    const G = [
      { l: "|x|", f: Math.abs, ok: false, why: "Törés: $f'_-(0) = -1$, $f'_+(0) = 1$. A nagyított kép mindig ugyanaz a „V” – sosem lesz egyenes." },
      { l: "∛x", f: Math.cbrt, ok: false, why: "Függőleges érintő: $\\tfrac{\\sqrt[3]{h}}{h} = h^{-2/3} \\to +\\infty$. Nagyítva a görbe egyre inkább a függőleges tengelyhez simul." },
      { l: "x·|x|", f: x => x * Math.abs(x), ok: true, why: "Deriválható: $\\tfrac{h|h|}{h} = |h| \\to 0$, $f'(0) = 0$. Nagyítva vízszintes egyenes." },
      { l: "√|x|", f: x => Math.sqrt(Math.abs(x)), ok: false, why: "Visszacsúcs: jobbról $+\\infty$, balról $-\\infty$ – a két ág függőlegesen fut össze." },
      { l: "x·sin(1/x)", f: x => (x === 0 ? 0 : x * sinv(x)), ok: false, why: "Folytonos (rendőrelv), de $\\tfrac{h\\sin(1/h)}{h} = \\sin\\tfrac1h$ $-1$ és $1$ között leng: nincs határérték, nem deriválható." },
      { l: "x²·sin(1/x)", f: x => (x === 0 ? 0 : x * x * sinv(x)), ok: true, why: "Deriválható: $\\tfrac{h^2\\sin(1/h)}{h} = h\\sin\\tfrac1h \\to 0$ (rendőrelv), $f'(0) = 0$. A hullámzás nagyítva eltűnik." },
      { l: "0 | x (MAT1 63)", f: x => (x <= 0 ? 0 : x), ok: false, why: "Törés: balról 0, jobbról 1 a meredekség." },
      { l: "0 | x² (MAT1 64)", f: x => (x <= 0 ? 0 : x * x), ok: true, why: "Deriválható: balról 0, jobbról $\\tfrac{h^2}{h} = h \\to 0$, $f'(0) = 0$." },
      { l: "sgn x", f: Math.sign, ok: false, why: "Nem folytonos (ugrás), ezért nem is deriválható: $\\tfrac{\\operatorname{sgn} h}{h} = \\tfrac{1}{|h|} \\to +\\infty$." },
      { l: "x² + x", f: x => x * x + x, ok: true, why: "Polinom – mindenhol deriválható, $f'(0) = 1$. Nagyítva az $y = x$ egyenes." }
    ];
    let cur = 0, answered = false, score = 0, tries = 0;
    const done = new Set();
    const bs = G.map((g, i) => btn(g.l, () => { cur = i; answered = false; bs.forEach(b => b.classList.toggle("on", b === bs[i])); fb.innerHTML = ""; draw(); }));
    bs[0].classList.add("on");
    root.append(h("div", { class: "controls", style: "gap:.3rem" }, ...bs));
    const K = slider("nagyítás: ablak = ±2·10^−k, k =", 0, 4, 0.05, 0, () => draw(), v => fmt(v, 2));
    root.append(h("div", { class: "controls" }, K.wrap));
    const cv = C.canvas(root, 0.6, 600);
    const fb = h("div", { style: "margin-top:.4rem;line-height:1.5" });
    const sc = h("span", { class: "chip" }, "pont: 0 / 0");
    const guess = ok => {
      if (answered) return;
      answered = true; tries++;
      const g = G[cur], right = g.ok === ok;
      if (right && !done.has(cur)) { score++; }
      done.add(cur);
      sc.textContent = `pont: ${score} / ${tries}`;
      fb.innerHTML = `<b style="color:var(${right ? "--ok" : "--bad"})">${right ? "✔ Igen!" : "✘ Nem."}</b> ` + (g.ok ? "Deriválható. " : "Nem deriválható. ") + g.why;
      window.Synopsis && Synopsis.renderMath(fb);
      tw.style.display = "";
    };
    root.append(h("div", { class: "controls" }, btn("deriválható", () => guess(true)), btn("nem deriválható", () => guess(false)),
      btn("következő →", () => { bs[(cur + 1) % G.length].click(); }), sc));
    root.append(fb);
    const tw = h("div", { class: "tw", style: "overflow-x:auto;margin-top:.5rem" });
    root.append(tw);

    function draw() {
      const g = G[cur], f = g.f;
      const w = 2 * Math.pow(10, -K.value);
      const yc = f(0);
      cv.draw = () => {
        const ar2 = cv.h / cv.w;
        C.plot(cv, { xmin: -w, xmax: w, ymin: yc - w * ar2, ymax: yc + w * ar2 }, [
          { f: x => (g.l === "sgn x" && x === 0 ? NaN : f(x)), color: "--accent" },
          { points: [[0, yc]], color: "--accent", r: 4.5 }
        ]);
      };
      cv.draw();
      const hs = [1e-1, 1e-2, 1e-3, 1e-4];
      const q = s => hs.map(t => { const v = (f(s * t) - yc) / (s * t); return `<td>${Number.isFinite(v) ? fmt(v, 4) : "–"}</td>`; }).join("");
      tw.innerHTML = `<table style="max-width:600px"><tr><th>$h$</th>${hs.map(t => `<th>$10^{${Math.round(Math.log10(t))}}$</th>`).join("")}</tr>` +
        `<tr><th>$\\tfrac{f(h) - f(0)}{h}$</th>${q(1)}</tr><tr><th>$\\tfrac{f(-h) - f(0)}{-h}$</th>${q(-1)}</tr></table>`;
      window.Synopsis && Synopsis.renderMath(tw);
      tw.style.display = answered ? "" : "none";
    }
    draw();
  };

  /* ------------------------------------------------------------------
     4.7  Lineáris közelítés
     ------------------------------------------------------------------ */
  W["linear-approx"] = root => {
    header(root, "Lineáris közelítés: az érintő mint „puska”",
      "Az $a$ pontban ismert $f(a)$ és $f'(a)$; ebből becsüljük $f(a + h)$-t az érintőn: $f(a) + f'(a)h$. A csúszkával változtasd $h$-t, és figyeld a hibát " +
      "(a görbe és az érintő közötti függőleges szakasz) – meg azt, hogy a hiba osztva $h^2$-tel szinte állandó.");
    const P = [
      { l: "√x, a = 4", src: "sqrt(x)", a: 4, hm: 3 },
      { l: "sin x, a = 0", src: "sin(x)", a: 0, hm: 1.5 },
      { l: "eˣ, a = 0", src: "e^x", a: 0, hm: 1.5 },
      { l: "ln x, a = 1", src: "ln(x)", a: 1, hm: 0.9 },
      { l: "1/x, a = 1", src: "1/x", a: 1, hm: 0.8 },
      { l: "x¹⁰, a = 1", src: "x^10", a: 1, hm: 0.2 }
    ];
    let p = P[0], fn = compile(p.src, ["x"]).f, a = p.a, hm = p.hm, zoom = false;
    const F = w1formula(p.src, f => { fn = f; bs.forEach(b => b.classList.remove("on")); readA(); hm = 1; H.el.min = -hm; H.el.max = hm; H.el.step = hm / 300; draw(); });
    const ain = h("input", { type: "text", value: String(a), style: "width:4rem;font-family:var(--mono)" });
    const readA = () => { const c = compile(ain.value, ["x"]); if (!c.err) a = c.f(0); };
    ain.addEventListener("keydown", e => { if (e.key === "Enter") F.go(); });
    const bs = P.map(q => {
      const b = btn(q.l, () => {
        p = q; fn = compile(q.src, ["x"]).f; a = q.a; hm = q.hm; F.inp.value = q.src; ain.value = String(q.a); F.err.textContent = "";
        H.el.min = -hm; H.el.max = hm; H.el.step = hm / 300; H.value = hm / 3;
        bs.forEach(x => x.classList.toggle("on", x === b)); draw();
      });
      return b;
    });
    bs[0].classList.add("on");
    root.append(h("div", { class: "controls", style: "gap:.3rem" }, ...bs));
    root.append(h("div", { class: "controls" }, F.wrap, h("label", null, "a = ", ain), btn("Rajzold", () => F.go()), F.err));
    const H = slider("h =", -hm, hm, hm / 300, 1, () => draw(), v => fmt(v, 3));
    const zb = btn("ráközelítés: ki", () => { zoom = !zoom; zb.textContent = "ráközelítés: " + (zoom ? "be" : "ki"); zb.classList.toggle("on", zoom); draw(); });
    root.append(h("div", { class: "controls" }, H.wrap, zb));
    const cv = C.canvas(root, 0.58, 760);
    root.append(legend([["f grafikonja", "--accent"], ["érintő (lineáris közelítés)", "--ok", true], ["hiba", "--bad"]]));
    const out = h("div", { class: "stat-row" });
    const tw = h("div", { class: "tw", style: "overflow-x:auto;margin-top:.5rem" });
    root.append(out, tw);

    function draw() {
      const hh = H.value;
      const fa = fn(a), d = w1D(fn, a);
      const L = x => fa + d * (x - a);
      const ex = fn(a + hh), ap = fa + d * hh;
      const half = zoom ? Math.max(Math.abs(hh) * 1.5, 1e-3) : Math.max(hm * 1.25, 1);
      const x0 = a - half, x1 = a + half;
      const samp = [];
      for (let k = 0; k <= 300; k++) { const x = x0 + (x1 - x0) * k / 300; samp.push(fn(x), L(x)); }
      let [lo, hi] = w1yr(samp, 0.08);
      cv.draw = () => {
        C.plot(cv, { xmin: x0, xmax: x1, ymin: lo, ymax: hi }, [
          { f: fn, color: "--accent" },
          { f: L, color: "--ok", dash: [7, 5], width: 1.8 },
          { vline: a + hh, color: "--border", dash: [3, 3], width: 1 },
          { seg: [[a + hh, ap], [a + hh, ex]], color: "--bad", width: 3 },
          { points: [[a, fa]], color: "--accent", r: 5 },
          { points: [[a + hh, ex]], color: "--accent", r: 4 },
          { points: [[a + hh, ap]], color: "--ok", r: 4 }
        ]);
      };
      cv.draw();
      const err = ex - ap;
      statRow(out, [
        ["$f(a + h)$", w1fv(ex, 6)],
        ["$f(a) + f'(a)h$", w1fv(ap, 6)],
        ["hiba", w1fv(err, 6)],
        ["$\\text{hiba}/h^2$", Math.abs(hh) > 1e-9 ? w1fv(err / (hh * hh), 4) : "–"],
        ["$f'(a)$", w1fv(d, 5)]
      ]);
      const hs = [1, 0.1, 0.01].map(t => Math.min(t, hm));
      tw.innerHTML = `<table style="max-width:620px"><tr><th>$h$</th><th>$f(a + h)$</th><th>közelítés</th><th>hiba</th></tr>` +
        [...new Set(hs)].map(t => { const e = fn(a + t), q = fa + d * t; return `<tr><td>${fmt(t, 3)}</td><td>${w1fv(e, 6)}</td><td>${w1fv(q, 6)}</td><td>${w1fv(e - q, 7)}</td></tr>`; }).join("") +
        `</table><p class="w-sub" style="margin:.3rem 0 0">Ha $h$ tizedére csökken, a hiba kb. századára – a hiba $h^2$-tel arányos.</p>`;
      window.Synopsis && Synopsis.renderMath(tw);
    }
    draw();
  };

  /* ------------------------------------------------------------------
     4.8  Határköltség és határbevétel
     ------------------------------------------------------------------ */
  W["marginal-cost"] = root => {
    header(root, "Határköltség, átlagköltség, határbevétel",
      "Költség: $C(q) = 200 + 5q + 0{,}01q^2$ ezer Ft, bevétel: $R(q) = 20q - 0{,}01q^2$ ezer Ft. Húzd a $q$ csúszkát! Felül a költség érintője (meredeksége a határköltség) " +
      "és az origóból húzott szakasz (meredeksége az átlagköltség); alul a határköltség, a határbevétel és az átlagköltség görbéje.");
    const Cq = q => 200 + 5 * q + 0.01 * q * q, dC = q => 5 + 0.02 * q;
    const Rq = q => 20 * q - 0.01 * q * q, dR = q => 20 - 0.02 * q;
    let showR = false;
    const Q = slider("q =", 1, 600, 1, 100, () => draw(), v => fmt(v, 0) + " db");
    const rb = btn("bevétel mutatása: ki", () => { showR = !showR; rb.textContent = "bevétel mutatása: " + (showR ? "be" : "ki"); rb.classList.toggle("on", showR); draw(); });
    root.append(h("div", { class: "controls" }, Q.wrap, rb));
    const cv = C.canvas(root, 0.5, 760);
    root.append(legend([["C(q) költség", "--accent"], ["érintő: határköltség", "--ok", true], ["átlagköltség-szakasz", "--setB", true], ["R(q) bevétel", "--setC"]]));
    const cv2 = C.canvas(root, 0.36, 760);
    root.append(legend([["C′(q) határköltség", "--ok"], ["R′(q) határbevétel", "--setC"], ["C(q)/q átlagköltség", "--setB", true]]));
    const out = h("div", { class: "stat-row" });
    const note = h("p", { class: "w-sub", style: "margin:.4rem 0 0" });
    root.append(out, note);

    function draw() {
      const q = Q.value, c = Cq(q), m = dC(q);
      cv.draw = () => {
        const layers = [
          { f: x => (x >= 0 ? Cq(x) : NaN), color: "--accent" },
          { f: x => c + m * (x - q), color: "--ok", dash: [7, 5], width: 1.6 },
          { seg: [[0, 0], [q, c]], color: "--setB", dash: [4, 4], width: 1.6 },
          { points: [[q, c]], color: "--accent", r: 5 }
        ];
        if (showR) layers.splice(1, 0, { f: x => (x >= 0 ? Rq(x) : NaN), color: "--setC" });
        C.plot(cv, { xmin: -20, xmax: 620, ymin: -300, ymax: 7500, xname: "q", yname: "ezer Ft" }, layers);
      };
      cv.draw();
      cv2.draw = () => {
        C.plot(cv2, { xmin: -20, xmax: 620, ymin: 0, ymax: 22, xname: "q", yname: "ezer Ft/db" }, [
          { f: x => (x > 0 ? dC(x) : NaN), color: "--ok" },
          { f: x => (x > 0 ? dR(x) : NaN), color: "--setC" },
          { f: x => (x > 5 ? Cq(x) / x : NaN), color: "--setB", dash: [5, 4] },
          { vline: q, color: "--muted", dash: [3, 3], width: 1 },
          { points: [[375, dC(375)]], color: "--text", r: 4, label: "R′ = C′ (q = 375)" }
        ]);
      };
      cv2.draw();
      statRow(out, [
        ["$C(q)$", fmt(c, 2)],
        ["$C'(q)$ határköltség", fmt(m, 2)],
        ["$C(q + 1) - C(q)$", fmt(Cq(q + 1) - c, 2)],
        ["$C(q)/q$ átlagköltség", fmt(c / q, 2)],
        ["$R'(q)$ határbevétel", fmt(dR(q), 2)],
        ["$P(q) = R - C$ profit", fmt(Rq(q) - c, 1)]
      ]);
      const diff = dR(q) - m;
      note.innerHTML = (Math.abs(diff) < 0.01
        ? "<b>Itt $R'(q) = C'(q)$:</b> még egy darab ugyanannyit hoz, mint amennyibe kerül – a profit itt a legnagyobb (5. fejezet)."
        : diff > 0 ? "$R'(q) \\gt C'(q)$: még egy darab többet hoz, mint amennyibe kerül → a profit <b>nő</b>, ha többet termelsz."
          : "$R'(q) \\lt C'(q)$: még egy darab többe kerül, mint amennyit hoz → a profit <b>csökken</b>, ha többet termelsz.") +
        (m < c / q ? " A határköltség az átlag alatt van, így még egy darab csökkenti az átlagköltséget." : " A határköltség az átlag felett van, így még egy darab növeli az átlagköltséget.");
      window.Synopsis && Synopsis.renderMath(note);
    }
    draw();
  };
