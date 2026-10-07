/* =========================================================
   Analízis 1. fejezet – interaktív szemléltetések
   Minden widget egy  <div class="widget" data-widget="név">  elembe épül.
   A rajzoláshoz és a képletek értelmezéséhez az assets/calc.js-t használja.
   ========================================================= */
(function () {
  "use strict";
  const C = window.Calc;
  const fmt = C.fmt;
  const tex = (s, display) => (window.katex ? katex.renderToString(s, { throwOnError: false, displayMode: !!display }) : s);
  const texNum = (x, d = 3) => fmt(x, d).replace(",", "{,}").replace(" ", "\\,").replace("−", "-");

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
  function slider(label, min, max, step, value, onInput) {
    const r = h("input", { type: "range", min, max, step, value });
    const v = h("b", null, "");
    const wrap = h("label", null, label + " ", r, v);
    const upd = () => { v.textContent = fmt(+r.value, 2); };
    r.addEventListener("input", () => { upd(); onInput(); });
    upd();
    return { wrap, get value() { return +r.value; }, set value(x) { r.value = x; upd(); }, el: r };
  }
  const legend = items => h("div", { class: "controls", style: "font-size:.88rem" },
    ...items.map(([label, col, dash]) => h("span", { class: "chip", style: `border-color:${C.css(col) || col}` },
      h("span", { style: `display:inline-block;width:18px;border-top:3px ${dash ? "dashed" : "solid"} ${C.css(col) || col}` }), label)));
  const PAL = ["--accent", "--setB", "--setC", "--bad", "--setA"];

  const W = {};

  /* ------------------------------------------------------------------
     Statikus ábra:  data-f="kif1; kif2"  data-view="xmin,xmax,ymin,ymax"
       data-colors, data-domain="a,b", data-points="x,y;x,y", data-vline,
       data-legend="címke1; címke2", data-caption (HTML), data-aspect
     ------------------------------------------------------------------ */
  W["plot"] = root => {
    root.style.padding = ".6rem";
    const d = root.dataset;
    const fs = (d.f || "").split(";").map(s => s.trim()).filter(Boolean).map(s => C.parse(s).f);
    const [xmin, xmax, ymin, ymax] = (d.view || "-5,5,-5,5").split(",").map(Number);
    const cols = d.colors ? d.colors.split(",") : PAL;
    const dom = d.domain ? d.domain.split(",").map(Number) : null;
    const pts = d.points ? d.points.split(";").map(p => p.split(",").map(Number)) : [];
    const cv = C.canvas(root, +(d.aspect || 0.55), 640);
    cv.draw = () => {
      const layers = fs.map((f, i) => ({ f, color: cols[i % cols.length], domain: dom }));
      if (d.vline) layers.unshift({ vline: +d.vline, color: "--bad", dash: [5, 4] });
      if (pts.length) layers.push({ points: pts, color: "--bad" });
      C.plot(cv, { xmin, xmax, ymin, ymax }, layers);
    };
    cv.draw();
    if (d.legend) root.append(legend(d.legend.split(";").map((l, i) => [l.trim(), cols[i % cols.length]])));
    if (d.caption) root.append(h("p", { class: "w-sub", style: "margin:.5rem 0 0", html: d.caption }));
  };

  /* ------------------------------------------------------------------
     1.1  Függvényrajzoló – a függvény négy arca
     ------------------------------------------------------------------ */
  W["function-plotter"] = root => {
    header(root, "Függvényrajzoló – képlet, táblázat, grafikon",
      "Írj be egy képletet (pl. <code>x^2+1</code>, <code>1/(x-2)</code>, <code>sqrt(x-3)</code>, <code>2^x</code>, <code>sin(x)</code>, <code>abs(x)</code>). " +
      "A <code>^</code> a hatványozás, a szorzásjel elhagyható (<code>2x</code>). Kattints a grafikonra: kiírjuk az ott felvett függvényértéket.");
    const inp = h("input", { type: "text", value: "x^2+1", style: "width:14rem;font-family:var(--mono)" });
    const err = h("span", { class: "muted" });
    root.append(h("div", { class: "controls" }, h("label", null, "f(x) = ", inp), err));
    const presets = [["taxi: 1000+400x", "1000+400x", [-1, 12, -500, 6000]], ["x²+1", "x^2+1"], ["1/(x−2)", "1/(x-2)"],
      ["√(x−3)", "sqrt(x-3)"], ["ln(x+1)", "ln(x+1)"], ["2^x", "2^x"], ["|x|", "abs(x)"], ["sin x", "sin(x)"]];
    let fixedView = null;
    root.append(h("div", { class: "controls" }, "Példák: ", ...presets.map(([l, s, v]) => btn(l, () => { inp.value = s; fixedView = v || null; if (v) setView(v); else autoView(); upd(); }))));
    const xr = [h("input", { type: "number", value: -5, step: "any", style: "width:5rem" }), h("input", { type: "number", value: 5, step: "any", style: "width:5rem" })];
    const yr = [h("input", { type: "number", value: -2, step: "any", style: "width:5rem" }), h("input", { type: "number", value: 10, step: "any", style: "width:5rem" })];
    const autoY = h("input", { type: "checkbox", checked: "" });
    root.append(h("div", { class: "controls" }, h("label", null, "x: ", xr[0], "…", xr[1]), h("label", null, "y: ", yr[0], "…", yr[1]), h("label", null, autoY, "y automatikusan")));
    const cv = C.canvas(root, 0.6);
    const out = h("div", { class: "readout" }, "Kattints a grafikonra!");
    const tblWrap = h("div", { style: "overflow-x:auto" });
    root.append(out, h("p", { class: "w-sub", style: "margin:.6rem 0 .2rem" }, "Táblázat (a megjelenített $x$-tartományból, egyenletes lépésközzel):"), tblWrap);
    let f = null, pick = null;
    const setView = v => { xr[0].value = v[0]; xr[1].value = v[1]; yr[0].value = v[2]; yr[1].value = v[3]; autoY.checked = false; };
    function autoView() {
      if (!f) return;
      const a = +xr[0].value, b = +xr[1].value, ys = [];
      for (let k = 0; k <= 400; k++) { const y = f(a + (b - a) * k / 400); if (Number.isFinite(y)) ys.push(y); }
      if (!ys.length) return;
      ys.sort((p, q) => p - q);
      let lo = ys[Math.floor(ys.length * 0.05)], hi = ys[Math.floor(ys.length * 0.95)];
      lo = Math.min(lo, 0); hi = Math.max(hi, 0);
      if (hi - lo < 1e-6) { lo -= 1; hi += 1; }
      const pad = (hi - lo) * 0.15;
      yr[0].value = +(lo - pad).toPrecision(3); yr[1].value = +(hi + pad).toPrecision(3);
    }
    function view() { return { xmin: +xr[0].value, xmax: +xr[1].value, ymin: +yr[0].value, ymax: +yr[1].value }; }
    cv.draw = () => {
      const v = view();
      if (!(v.xmax > v.xmin && v.ymax > v.ymin)) return;
      const layers = f ? [{ f, color: "--accent" }] : [];
      if (pick && f) {
        const y = f(pick);
        layers.push({ vline: pick, color: "--muted", dash: [4, 4], width: 1 });
        if (Number.isFinite(y)) layers.push({ points: [[pick, y]], color: "--bad" });
      }
      C.plot(cv, v, layers);
    };
    function table() {
      const v = view();
      const n = 8, xs = [];
      const step = (v.xmax - v.xmin) / n;
      for (let k = 0; k <= n; k++) xs.push(+(v.xmin + k * step).toPrecision(4));
      const t = h("table", { style: "font-family:var(--mono);font-size:.85rem" });
      t.append(h("tr", null, h("th", null, "x"), ...xs.map(x => h("td", null, fmt(x, 3)))));
      t.append(h("tr", null, h("th", null, "f(x)"), ...xs.map(x => h("td", null, f ? (Number.isFinite(f(x)) ? fmt(f(x), 3) : "–") : ""))));
      tblWrap.replaceChildren(t);
    }
    function upd() {
      try { f = C.parse(inp.value).f; err.textContent = ""; inp.style.borderColor = ""; }
      catch (e) { f = null; err.textContent = "⚠ " + e.message; inp.style.borderColor = "var(--bad)"; }
      if (autoY.checked && f) autoView();
      cv.draw(); table();
      if (pick != null) showPick();
    }
    function showPick() {
      const y = f ? f(pick) : NaN;
      out.innerHTML = Number.isFinite(y)
        ? `x = <b>${fmt(pick, 3)}</b> → f(x) = <b>${fmt(y, 4)}</b> &nbsp; a grafikon pontja: (${fmt(pick, 3)}; ${fmt(y, 4)})`
        : `x = <b>${fmt(pick, 3)}</b> → a függvény itt <b>nincs értelmezve</b> (ez az x nem eleme a D<sub>f</sub>-nek)`;
    }
    cv.c.addEventListener("click", e => {
      const r = cv.c.getBoundingClientRect(), v = view();
      const x = v.xmin + (e.clientX - r.left - 4) / (cv.w - 8) * (v.xmax - v.xmin);
      pick = Math.round(x * 100) / 100;
      showPick(); cv.draw();
    });
    inp.addEventListener("input", upd);
    [...xr, ...yr].forEach(i => i.addEventListener("change", () => { if (yr.includes(i)) autoY.checked = false; upd(); }));
    autoY.addEventListener("change", upd);
    upd();
  };

  /* ------------------------------------------------------------------
     1.2  Függvénycsaládok – paraméterek hatása
     ------------------------------------------------------------------ */
  const FAMILIES = {
    lin: { name: "lineáris: m·x + b", params: [["m", -3, 3, 0.25, 1], ["b", -4, 4, 0.5, 1]],
      f: (p) => x => p.m * x + p.b, view: [-5, 5, -6, 6],
      tex: p => `f(x) = ${texNum(p.m, 2)}x ${p.b < 0 ? "-" : "+"} ${texNum(Math.abs(p.b), 2)}`,
      note: p => p.m > 0 ? "m > 0: szigorúan növekvő egyenes." : p.m < 0 ? "m < 0: szigorúan csökkenő egyenes." : "m = 0: konstans függvény (vízszintes egyenes)." },
    pow: { name: "hatvány: xⁿ", params: [["n", 1, 6, 1, 2]],
      f: p => x => Math.pow(x, p.n), view: [-2.5, 2.5, -4, 4],
      tex: p => `f(x) = x^{${p.n}}`,
      note: p => p.n === 1 ? "n = 1: az y = x egyenes." : p.n % 2 === 0 ? "Páros kitevő: U alak, szimmetrikus az y tengelyre, értékkészlet [0; ∞[." : "Páratlan kitevő: S alak, szimmetrikus az origóra, értékkészlet ℝ." },
    exp: { name: "exponenciális: C·aˣ", params: [["a", 0.2, 3, 0.05, 2], ["C", 0.5, 3, 0.5, 1]],
      f: p => x => p.C * Math.pow(p.a, x), view: [-4, 4, -1, 8],
      tex: p => `f(x) = ${texNum(p.C, 2)}\\cdot ${texNum(p.a, 2)}^{x}`,
      note: p => Math.abs(p.a - 1) < 1e-9 ? "a = 1: konstans – ezért zárjuk ki az exponenciális függvények közül." : (p.a > 1 ? "a > 1: növekedés." : "0 < a < 1: csökkenés (bomlás).") + ` Mindig pozitív, az y tengelyt a C = ${fmt(p.C, 2)} magasságban metszi, aszimptota: y = 0.` },
    log: { name: "logaritmus: logₐ x", params: [["a", 0.2, 5, 0.1, 2]],
      f: p => x => Math.log(x) / Math.log(p.a), view: [-1, 8, -4, 4],
      tex: p => `f(x) = \\log_{${texNum(p.a, 2)}} x`,
      note: p => Math.abs(p.a - 1) < 1e-9 ? "a = 1: nincs ilyen logaritmus (1 minden hatványa 1)." : (p.a > 1 ? "a > 1: növekvő, de nagyon lassan." : "0 < a < 1: csökkenő.") + " Csak x > 0-ra értelmezett, mindig átmegy az (1; 0) ponton." },
    sin: { name: "szinusz: A·sin(x)", params: [["A", -3, 3, 0.5, 1]],
      f: p => x => p.A * Math.sin(x), view: [-7, 7, -3.5, 3.5],
      tex: p => `f(x) = ${texNum(p.A, 2)}\\sin x`,
      note: p => `Periódus 2π ≈ 6,28; értékkészlet [${fmt(-Math.abs(p.A), 2)}; ${fmt(Math.abs(p.A), 2)}].` }
  };
  W["family-explorer"] = root => {
    header(root, "Függvénycsaládok – mit csinálnak a paraméterek?",
      "Válassz családot, és húzd a csúszkákat! A szaggatott görbe az alapfüggvény (minden paraméter az alapértéken).");
    const sel = h("select");
    Object.entries(FAMILIES).forEach(([k, F]) => sel.append(h("option", { value: k }, F.name)));
    const ctl = h("div", { class: "controls" });
    root.append(h("div", { class: "controls" }, h("label", null, "Család: ", sel)), ctl);
    const formula = h("div", { class: "formula-out" });
    const cv = C.canvas(root, 0.55);
    const note = h("div", { class: "readout" });
    root.append(formula, note);
    let sliders = {};
    function build() {
      const F = FAMILIES[sel.value];
      ctl.replaceChildren(); sliders = {};
      F.params.forEach(([n, a, b, s, v]) => { const sl = slider(n + " =", a, b, s, v, draw); sliders[n] = sl; ctl.append(sl.wrap); });
      ctl.append(btn("↺ alapérték", () => { F.params.forEach(([n, , , , v]) => (sliders[n].value = v)); draw(); }));
      draw();
    }
    function draw() {
      const F = FAMILIES[sel.value];
      const p = {}, p0 = {};
      F.params.forEach(([n, , , , v]) => { p[n] = sliders[n].value; p0[n] = v; });
      const [xmin, xmax, ymin, ymax] = F.view;
      cv.draw = () => C.plot(cv, { xmin, xmax, ymin, ymax }, [
        { f: F.f(p0), color: "--muted", dash: [6, 5], width: 1.5 },
        { f: F.f(p), color: "--accent" }
      ]);
      cv.draw();
      formula.innerHTML = tex(F.tex(p));
      note.textContent = F.note(p);
    }
    sel.onchange = build;
    build();
  };

  /* ------------------------------------------------------------------
     1.3  Transzformációs labor:  y = c · f(k(x − a)) + b
     ------------------------------------------------------------------ */
  const BASES = [
    ["x²", x => x * x, "x^2", u => `\\left(${u}\\right)^2`],
    ["√x", Math.sqrt, "\\sqrt{x}", u => `\\sqrt{${u}}`],
    ["|x|", Math.abs, "|x|", u => `\\left|${u}\\right|`],
    ["1/x", x => 1 / x, "\\frac{1}{x}", u => `\\frac{1}{${u}}`],
    ["2ˣ", x => Math.pow(2, x), "2^x", u => `2^{${u}}`],
    ["sin x", Math.sin, "\\sin x", u => `\\sin\\left(${u}\\right)`],
    ["x³", x => x * x * x, "x^3", u => `\\left(${u}\\right)^3`]
  ];
  W["transform-lab"] = root => {
    header(root, "Transzformációs labor",
      "Alapfüggvény: szaggatott vonal. Transzformált: $y = c\\cdot f\\big(k(x - a)\\big) + b$. Állíts egyszerre csak egy csúszkát, aztán kombináld őket!");
    const sel = h("select");
    BASES.forEach(([l], i) => sel.append(h("option", { value: i }, "f(x) = " + l)));
    root.append(h("div", { class: "controls" }, h("label", null, "Alapfüggvény: ", sel)));
    const sa = slider("a (vízszintes eltolás) =", -5, 5, 0.5, 0, draw);
    const sb = slider("b (függőleges eltolás) =", -5, 5, 0.5, 0, draw);
    const sc = slider("c (függőleges nyújtás) =", -3, 3, 0.25, 1, draw);
    const sk = slider("k (vízszintes zsugorítás) =", -3, 3, 0.25, 1, draw);
    root.append(h("div", { class: "controls" }, sa.wrap, sb.wrap), h("div", { class: "controls" }, sc.wrap, sk.wrap));
    root.append(h("div", { class: "controls" }, "Feladatok: ",
      btn("(x − 3)²", () => set(0, 3, 0, 1, 1)), btn("2(x − 1)² − 3", () => set(0, 1, -3, 2, 1)),
      btn("1/(x − 2) + 3", () => set(3, 2, 3, 1, 1)), btn("√(x + 4) − 1", () => set(1, -4, -1, 1, 1)),
      btn("−√x", () => set(1, 0, 0, -1, 1)), btn("√(−x)", () => set(1, 0, 0, 1, -1)), btn("sin 2x", () => set(5, 0, 0, 1, 2)),
      btn("↺ alaphelyzet", () => set(+sel.value, 0, 0, 1, 1))));
    const formula = h("div", { class: "formula-out" });
    const cv = C.canvas(root, 0.6);
    const out = h("div", { class: "readout" });
    root.append(formula, out);
    function set(i, a, b, c, k) { sel.value = i; sa.value = a; sb.value = b; sc.value = c; sk.value = k; draw(); }
    function draw() {
      const [, f, t0, tf] = BASES[+sel.value];
      const a = sa.value, b = sb.value, c = sc.value, k = sk.value;
      const g = x => c * f(k * (x - a)) + b;
      cv.draw = () => C.plot(cv, { xmin: -8, xmax: 8, ymin: -6, ymax: 6 }, [
        { f, color: "--muted", dash: [6, 5], width: 1.5 },
        { f: g, color: "--accent" }
      ]);
      cv.draw();
      const xa = a === 0 ? "x" : `x ${a > 0 ? "-" : "+"} ${texNum(Math.abs(a), 2)}`;
      const inner = k === 1 ? xa : k === -1 ? (a === 0 ? "-x" : `-\\left(${xa}\\right)`) : (a === 0 ? `${texNum(k, 2)}x` : `${texNum(k, 2)}\\left(${xa}\\right)`);
      const body = inner === "x" ? t0 : tf(inner);
      const cs = c === 1 ? "" : c === -1 ? "-" : texNum(c, 2) + "\\cdot ";
      const bs = b === 0 ? "" : ` ${b > 0 ? "+" : "-"} ${texNum(Math.abs(b), 2)}`;
      formula.innerHTML = tex(`y = ${cs}${body}${bs}`);
      const parts = [];
      if (a) parts.push(`${a > 0 ? "jobbra" : "balra"} tolás ${fmt(Math.abs(a), 2)} egységgel`);
      if (k !== 1) parts.push(k < 0 ? `tükrözés az y tengelyre${Math.abs(k) !== 1 ? ` és vízszintes ${Math.abs(k) > 1 ? "zsugorítás" : "nyújtás"} (szélesség × ${fmt(1 / Math.abs(k), 2)})` : ""}` : `vízszintes ${k > 1 ? "zsugorítás" : "nyújtás"} (szélesség × ${fmt(1 / k, 2)})`);
      if (c !== 1) parts.push(c < 0 ? `tükrözés az x tengelyre${Math.abs(c) !== 1 ? ` és függőleges nyújtás × ${fmt(Math.abs(c), 2)}` : ""}` : `függőleges ${c > 1 ? "nyújtás" : "zsugorítás"} × ${fmt(c, 2)}`);
      if (b) parts.push(`${b > 0 ? "felfelé" : "lefelé"} tolás ${fmt(Math.abs(b), 2)} egységgel`);
      out.textContent = parts.length ? "Lépések (belülről kifelé): " + parts.join(" → ") : "Nincs transzformáció: a két görbe egybeesik.";
    }
    sel.onchange = draw;
    draw();
  };

  /* ------------------------------------------------------------------
     1.5  Összetett függvény – két gép egymás után
     ------------------------------------------------------------------ */
  const MACH = [
    ["x + 1", x => x + 1, u => `${u} + 1`],
    ["x − 3", x => x - 3, u => `${u} - 3`],
    ["2x", x => 2 * x, u => `2${u === "x" ? "x" : `\\left(${u}\\right)`}`],
    ["x²", x => x * x, u => (u === "x" ? "x^2" : `\\left(${u}\\right)^2`)],
    ["√x", Math.sqrt, u => `\\sqrt{${u}}`],
    ["1/x", x => 1 / x, u => `\\frac{1}{${u}}`],
    ["eˣ", Math.exp, u => `e^{${u}}`],
    ["sin x", Math.sin, u => (u === "x" ? "\\sin x" : `\\sin\\left(${u}\\right)`)]
  ];
  W["compose-machine"] = root => {
    header(root, "Összetett függvény – két gép egymás után",
      "Válaszd ki a belső ($g$) és a külső ($f$) függvényt, és állítsd be a bemenetet! Lent mindkét sorrendet látod.");
    const mk = d => { const s = h("select"); MACH.forEach(([l], i) => s.append(h("option", { value: i }, l))); s.value = d; return s; };
    const sg = mk(0), sf = mk(3);
    const sx = slider("x =", -4, 4, 0.5, 2, draw);
    root.append(h("div", { class: "controls" }, h("label", null, "belső g(x) = ", sg), h("label", null, "külső f(u) = ", sf), sx.wrap));
    const out = h("div", { class: "readout", style: "line-height:2" });
    const cv = C.canvas(root, 0.55);
    root.append(out, legend([["f(g(x))", "--accent"], ["g(f(x))", "--setB", true]]));
    function draw() {
      const [lg, g, tg] = MACH[+sg.value], [lf, f, tf] = MACH[+sf.value];
      const x = sx.value;
      const s = v => (Number.isFinite(v) ? fmt(v, 4) : "nincs értelmezve");
      const gx = g(x), fgx = Number.isFinite(gx) ? f(gx) : NaN, fx = f(x), gfx = Number.isFinite(fx) ? g(fx) : NaN;
      out.innerHTML =
        `<b>f ∘ g:</b> ${fmt(x, 2)} →<sub>g</sub> ${s(gx)} →<sub>f</sub> <b>${s(fgx)}</b> &nbsp; ${tex(`f(g(x)) = ${tf(tg("x"))}`)}<br>` +
        `<b>g ∘ f:</b> ${fmt(x, 2)} →<sub>f</sub> ${s(fx)} →<sub>g</sub> <b>${s(gfx)}</b> &nbsp; ${tex(`g(f(x)) = ${tg(tf("x"))}`)}`;
      cv.draw = () => C.plot(cv, { xmin: -5, xmax: 5, ymin: -5, ymax: 10 }, [
        { f: t => f(g(t)), color: "--accent" },
        { f: t => g(f(t)), color: "--setB", dash: [7, 5] },
        { vline: x, color: "--muted", dash: [3, 4], width: 1 },
        { points: [[x, fgx]], color: "--accent" }, { points: [[x, gfx]], color: "--setB" }
      ]);
      cv.draw();
    }
    sg.onchange = sf.onchange = draw;
    draw();
  };

  /* ------------------------------------------------------------------
     1.5  Inverz függvény – tükrözés az y = x egyenesre
     ------------------------------------------------------------------ */
  const INV = [
    { l: "2x + 3", f: x => 2 * x + 3, dom: [-6, 6], inv: "\\frac{x - 3}{2}" },
    { l: "x³", f: x => x * x * x, dom: [-2, 2], inv: "\\sqrt[3]{x}" },
    { l: "2ˣ", f: x => Math.pow(2, x), dom: [-6, 3], inv: "\\log_2 x" },
    { l: "eˣ", f: Math.exp, dom: [-6, 2], inv: "\\ln x" },
    { l: "x² (x ≥ 0)", f: x => x * x, dom: [0, 2.6], inv: "\\sqrt{x}" },
    { l: "x² (minden x)", f: x => x * x, dom: [-2.6, 2.6], inv: null },
    { l: "1/x (x > 0)", f: x => 1 / x, dom: [0.15, 6], inv: "\\frac{1}{x}" },
    { l: "sin x", f: Math.sin, dom: [-6, 6], inv: null }
  ];
  W["inverse-mirror"] = root => {
    header(root, "Inverz függvény – tükrözés és vízszintes egyenes teszt",
      "Az $f$ (kék) tükörképe az $y = x$ egyenesre (szaggatott) a narancssárga görbe. Csak akkor függvény, ha az $f$ kölcsönösen egyértelmű: " +
      "húzd a vízszintes egyenest, és figyeld, hány pontban metszi az $f$-et!");
    const sel = h("select");
    INV.forEach((o, i) => sel.append(h("option", { value: i }, "f(x) = " + o.l)));
    const sp = slider("pont: a =", -2, 2, 0.1, 1, draw);
    const sh = slider("vízszintes egyenes: y =", -5, 6, 0.25, 0.5, draw);
    root.append(h("div", { class: "controls" }, h("label", null, sel), sp.wrap, sh.wrap));
    const cv = C.canvas(root, 0.75, 620);
    const out = h("div", { class: "readout", style: "line-height:1.9" });
    root.append(out, legend([["f", "--accent"], ["tükörkép az y = x-re", "--setB"], ["y = x", "--muted", true], ["vízszintes egyenes", "--bad", true]]));
    function setRange() {
      const o = INV[+sel.value];
      sp.el.min = o.dom[0]; sp.el.max = o.dom[1];
      sp.value = Math.min(o.dom[1], Math.max(o.dom[0], 1));
    }
    function draw() {
      const o = INV[+sel.value], a = sp.value, hh = sh.value;
      const fa = o.f(a);
      // metszéspontok száma f(x) = hh a definíciós tartományon (előjelváltások)
      let cnt = 0, prev = o.f(o.dom[0]) - hh;
      const N = 4000;
      for (let k = 1; k <= N; k++) {
        const x = o.dom[0] + (o.dom[1] - o.dom[0]) * k / N, d = o.f(x) - hh;
        if (d === 0 || (prev !== 0 && Math.sign(d) !== Math.sign(prev))) cnt++;
        prev = d;
      }
      cv.draw = () => C.plot(cv, { xmin: -6, xmax: 6, ymin: -6, ymax: 6, xstep: 1, ystep: 1 }, [
        { f: x => x, color: "--muted", dash: [5, 5], width: 1.2 },
        { hline: hh, color: "--bad", dash: [6, 4], width: 1.2 },
        { f: o.f, color: "--accent", domain: o.dom },
        { param: t => [o.f(t), t], t: o.dom, color: "--setB", width: 2.2 },
        { seg: [[a, fa], [fa, a]], color: "--muted", dash: [2, 4], width: 1 },
        { points: [[a, fa]], color: "--accent" }, { points: [[fa, a]], color: "--setB" }
      ]);
      cv.draw();
      out.innerHTML =
        `P(${fmt(a, 2)}; ${fmt(fa, 3)}) az f grafikonján → tükörképe P′(${fmt(fa, 3)}; ${fmt(a, 2)}): a koordináták helyet cserélnek.<br>` +
        `Az y = ${fmt(hh, 2)} egyenes <b>${cnt}</b> pontban metszi az f-et. ` +
        (o.inv ? `Az f kölcsönösen egyértelmű, inverze: ${tex(`f^{-1}(x) = ${o.inv}`)} – a narancssárga görbe függvény.`
               : `<b>Nem invertálható:</b> van olyan vízszintes egyenes, amely többször metszi. A tükörkép nem megy át a függőleges egyenes teszten.`);
    }
    sel.onchange = () => { setRange(); draw(); };
    setRange(); draw();
  };

  /* ------------------------------------------------------------------
     1.6  Növekedési verseny: lineáris vs. exponenciális
     ------------------------------------------------------------------ */
  W["growth-race"] = root => {
    header(root, "Növekedési verseny – lineáris kontra exponenciális",
      "Kék: $L(t) = L_0 + m\\,t$ (naponta ugyanannyival nő). Narancs: $E(t) = E_0\\cdot q^t$ (naponta ugyanannyiszorosára nő). Az alapbeállítás a fejezet két videója.");
    const sL0 = slider("L₀ =", 0, 100000, 100, 0, draw);
    const sm = slider("m (napi növekmény) =", 0, 100000, 100, 50000, draw);
    const sE0 = slider("E₀ =", 100, 10000, 100, 1000, draw);
    const sq = slider("q (napi szorzó) =", 1.01, 3, 0.01, 2, draw);
    const sT = slider("időtáv (nap) =", 5, 60, 1, 14, draw);
    root.append(h("div", { class: "controls" }, sL0.wrap, sm.wrap), h("div", { class: "controls" }, sE0.wrap, sq.wrap), h("div", { class: "controls" }, sT.wrap,
      btn("A két videó", () => { sL0.value = 0; sm.value = 50000; sE0.value = 1000; sq.value = 2; sT.value = 14; draw(); }),
      btn("Város: +300 fő vs. +3%", () => { sL0.value = 10000; sm.value = 300; sE0.value = 10000; sq.value = 1.03; sT.value = 20; draw(); })));
    const cv = C.canvas(root, 0.55);
    const out = h("div", { class: "readout" });
    root.append(legend([["lineáris L(t)", "--accent"], ["exponenciális E(t)", "--setB"]]), out);
    function draw() {
      const L0 = sL0.value, m = sm.value, E0 = sE0.value, q = sq.value, T = sT.value;
      const L = t => L0 + m * t, E = t => E0 * Math.pow(q, t);
      let ymax = Math.max(L(T), Math.min(E(T), L(T) * 4), 10);
      let cross = null;
      const ahead = t => E(t) > L(t) * (1 + 1e-9) + 1e-9;
      for (let t = 1; t <= 400; t++) if (ahead(t) && !ahead(t - 1)) { cross = t; break; }
      cv.draw = () => C.plot(cv, { xmin: -T * 0.03, xmax: T, ymin: -ymax * 0.05, ymax: ymax * 1.08 }, [
        { f: L, color: "--accent", domain: [0, T] },
        { f: E, color: "--setB", domain: [0, T] },
        ...(cross && cross <= T ? [{ vline: cross, color: "--bad", dash: [4, 4], width: 1 }, { points: [[cross, E(cross)]], color: "--bad" }] : [])
      ]);
      cv.draw();
      out.innerHTML = (cross
        ? `Az exponenciális a(z) <b>${cross}.</b> napon előzi meg a lineárist: E(${cross}) = ${fmt(E(cross), 0)} &gt; L(${cross}) = ${fmt(L(cross), 0)}.`
        : `400 napon belül nem előzi meg (növeld a q-t!).`) +
        `<br>A(z) ${T}. napon: L = ${fmt(L(T), 0)}, E = ${fmt(E(T), 0)} (arány: E/L = ${fmt(E(T) / Math.max(L(T), 1e-9), 2)}).` +
        (E(T) > ymax * 1.08 ? " <span class='muted'>(Az exponenciális görbe kilóg a képből.)</span>" : "");
    }
    draw();
  };

  /* ------------------------------------------------------------------
     Indítás
     ------------------------------------------------------------------ */
  document.querySelectorAll(".widget[data-widget]").forEach(root => {
    const f = W[root.dataset.widget];
    if (!f) return;
    try { f(root); window.Synopsis && Synopsis.renderMath(root); }
    catch (e) { root.append(h("p", { class: "muted" }, "Hiba a szemléltetés betöltésekor: " + e.message)); console.error(e); }
  });
})();
