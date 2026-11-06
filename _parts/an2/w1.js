
  /* ------------------------------------------------------------------
     2.1  Sorozatrajzoló – képlet vagy rekurzió
     ------------------------------------------------------------------ */
  W["sequence-plot"] = root => {
    header(root, "Sorozatrajzoló – tagok táblázatban és pontokként",
      "Képlet módban az $n$-t használd (pl. <code>(n-1)/(n+1)</code>, <code>(-1)^n/n</code>, <code>2^n/fact(n)</code>). " +
      "Rekurzív módban a következő tagot az előzőből (<code>a</code>) és az indexből (<code>n</code>) adod meg, pl. <code>sqrt(2+a)</code>.");
    let mode = "explicit";
    const inp = h("input", { type: "text", value: "(n-1)/(n+1)", style: "width:13rem;font-family:var(--mono)" });
    const a1 = h("input", { type: "text", value: "1", style: "width:4rem;font-family:var(--mono)" });
    const a1wrap = h("label", { style: "display:none" }, "a₁ = ", a1);
    const lab = h("span", null, "aₙ = ");
    const err = h("span", { class: "muted" });
    const seg = segmented([["képlet", "explicit"], ["rekurzió", "rec"]], mode, v => {
      mode = v; lab.textContent = v === "rec" ? "aₙ₊₁ = " : "aₙ = "; a1wrap.style.display = v === "rec" ? "" : "none"; draw();
    });
    const N = slider("tagok száma:", 5, 60, 1, 20, () => draw(), v => String(v));
    root.append(seg.wrap, h("div", { class: "controls" }, h("label", null, lab, inp), a1wrap, err), h("div", { class: "controls" }, N.wrap));
    const presets = [
      ["(n−1)/(n+1)", "explicit", "(n-1)/(n+1)"], ["(−1)ⁿ/n", "explicit", "(-1)^n/n"], ["n/2ⁿ", "explicit", "n/2^n"],
      ["n²−6n", "explicit", "n^2-6n"], ["3ⁿ/n!", "explicit", "3^n/fact(n)"],
      ["√(2+a), a₁=0", "rec", "sqrt(2+a)", "0"], ["2a+1, a₁=1", "rec", "2a+1", "1"], ["1/(1+a), a₁=1", "rec", "1/(1+a)", "1"]
    ];
    root.append(h("div", { class: "controls", style: "gap:.3rem" }, ...presets.map(([l, m, f, s]) => btn(l, () => {
      inp.value = f; if (s != null) a1.value = s;
      if (m !== mode) seg.wrap.querySelectorAll("button")[m === "rec" ? 1 : 0].click(); else draw();
    }))));
    const cv = C.canvas(root, 0.5, 720);
    const out = h("div", { class: "stat-row" });
    const tw = h("div", { class: "tw", style: "overflow-x:auto;margin-top:.5rem" });
    root.append(out, tw);
    inp.addEventListener("input", () => draw());
    a1.addEventListener("input", () => draw());

    function terms() {
      const n = N.value;
      if (mode === "explicit") {
        const c = compile(inp.value, ["n"]);
        if (c.err) return { err: c.err };
        return { t: Array.from({ length: n }, (_, i) => c.f(i + 1)) };
      }
      const c = compile(inp.value, ["n", "a"]);
      if (c.err) return { err: c.err };
      const s = compile(a1.value, ["n"]);
      if (s.err) return { err: "a₁: " + s.err };
      const t = [s.f(1)];
      for (let i = 1; i < n; i++) t.push(c.f({ n: i, a: t[i - 1] }));
      return { t };
    }
    function draw() {
      const r = terms();
      err.textContent = r.err ? "⚠ " + r.err : "";
      if (r.err) return;
      const t = r.t, n = t.length;
      const fin = t.filter(Number.isFinite);
      const [lo, hi] = yRange(fin.length ? [...fin, 0] : [0, 1]);
      cv.draw = () => C.plot(cv, { xmin: -0.5, xmax: n + 1, ymin: lo, ymax: hi, xname: "n", yname: "aₙ" },
        [{ points: t.map((y, i) => [i + 1, y]), color: "--accent", r: n > 40 ? 3 : 4.5 }]);
      cv.draw();
      // monotonitás a látható tagokon
      let up = true, down = true, sUp = true, sDown = true;
      for (let i = 1; i < n; i++) {
        const d = t[i] - t[i - 1];
        if (!Number.isFinite(d)) { up = down = false; break; }
        if (d < -1e-12) { up = false; sUp = false; } else if (d <= 1e-12) { sUp = false; sDown = false; }
        if (d > 1e-12) { down = false; sDown = false; }
      }
      const mono = sUp ? "szigorúan nő" : up ? "nő (nem szigorúan)" : sDown ? "szigorúan csökken" : down ? "csökken (nem szigorúan)" : "nem monoton";
      statRow(out, [["az ábrázolt tagok", mono], ["legkisebb tag", fin.length ? fmt(Math.min(...fin), 4) : "–"],
        ["legnagyobb tag", fin.length ? fmt(Math.max(...fin), 4) : "–"], [`$a_{${n}}$`, fmt(t[n - 1], 6)]]);
      const k = Math.min(n, 12);
      tw.innerHTML = "";
      tw.append(h("table", { style: "font-size:.88rem" },
        h("tr", null, h("th", null, "n"), ...t.slice(0, k).map((_, i) => h("td", null, String(i + 1)))),
        h("tr", null, h("th", null, "aₙ"), ...t.slice(0, k).map(y => h("td", null, fmt(y, 4))))));
      if (n > k) tw.append(h("p", { class: "w-sub", style: "margin:.2rem 0 0" }, `(a táblázat az első ${k} tagot mutatja)`));
    }
    draw();
  };

  /* ------------------------------------------------------------------
     2.3  ε-sáv és küszöbindex
     ------------------------------------------------------------------ */
  W["epsilon-band"] = root => {
    header(root, "ε-sáv és küszöbindex",
      "Válassz sorozatot és határérték-jelöltet, aztán szűkítsd a sávot! A sávon kívüli tagok más színűek. " +
      "A küszöbindex $N$ az utolsó kilógó tag indexe: minden $n \\gt N$ tag már a sávban van.");
    const S = [
      { l: "1/n → 0", f: n => 1 / n, A: 0, e: n => 1 / n, tex: "\\tfrac1n" },
      { l: "(2n+1)/(n+3) → 2", f: n => (2 * n + 1) / (n + 3), A: 2, e: n => 5 / (n + 3), tex: "\\tfrac{2n+1}{n+3}" },
      { l: "(−1)ⁿ/n → 0", f: n => (n % 2 ? -1 : 1) / n, A: 0, e: n => 1 / n, tex: "\\tfrac{(-1)^n}{n}" },
      { l: "1/2ⁿ → 0", f: n => Math.pow(0.5, n), A: 0, e: n => Math.pow(0.5, n), tex: "\\tfrac1{2^n}" },
      { l: "1/√n → 0", f: n => 1 / Math.sqrt(n), A: 0, e: n => 1 / Math.sqrt(n), tex: "\\tfrac1{\\sqrt n}" },
      { l: "(−1)ⁿ, jelölt: 1", f: n => (n % 2 ? -1 : 1), A: 1, e: n => (n % 2 ? 2 : 0), tex: "(-1)^n", never: true }
    ];
    let cur = S[1];
    const seg = segmented(S.map((s, i) => [s.l, i]), 1, i => { cur = S[i]; draw(); });
    const eps = slider("ε =", -3, 0, 0.01, -2, () => draw(), v => fmt(epsOf(v), 4));
    function epsOf(v) { return parseFloat(Math.pow(10, v).toPrecision(2)); }
    root.append(seg.wrap, h("div", { class: "controls" }, eps.wrap,
      ...[["0,1", -1], ["0,01", -2], ["0,001", -3]].map(([l, v]) => btn("ε = " + l, () => { eps.value = v; draw(); }))));
    let zoom = false;
    const zb = btn("🔍 nagyítás a sávra", () => { zoom = !zoom; zb.classList.toggle("on", zoom); draw(); });
    root.append(h("div", { class: "controls" }, zb, h("span", { class: "muted", style: "font-size:.85rem" }, "(függőlegesen a sávra, vízszintesen a küszöb környékére nagyít)")));
    const cv = C.canvas(root, 0.5, 720);
    const out = h("div", { class: "stat-row" });
    const msg = h("p", { class: "w-sub", style: "margin:.4rem 0 0" });
    root.append(out, msg);
    const LIM = 2000000;
    function threshold(s, e) {
      if (s.never) return e > 2 ? 0 : Infinity;
      let N = 0;
      for (let n = 1; n <= LIM; n++) if (!(s.e(n) < e)) N = n;
      return N;
    }
    function draw() {
      const e = epsOf(eps.value), s = cur;
      const N = threshold(s, e);
      const shown = Number.isFinite(N) ? Math.min(Math.max(30, Math.ceil((N + 1) * 1.4)), 3000) : 40;
      const pts = [], inP = [];
      const step = Math.max(1, Math.floor(shown / 600));
      for (let n = 1; n <= shown; n += step) (s.e(n) < e ? inP : pts).push([n, s.f(n)]);
      const ys = [...pts, ...inP].map(p => p[1]);
      let lo = Math.min(...ys, s.A - e), hi = Math.max(...ys, s.A + e);
      if (zoom) { lo = s.A - 4 * e; hi = s.A + 4 * e; }
      const pad = (hi - lo) * 0.08; lo -= pad; hi += pad;
      let x0 = -shown * 0.06, x1 = shown * 1.02;
      if (zoom && Number.isFinite(N) && N > 20 && N * 1.4 <= shown + 1) { x0 = N * 0.6; x1 = Math.min(shown, N * 1.4) + 1; }
      cv.draw = () => {
        const T = C.plot(cv, { xmin: x0, xmax: x1, ymin: lo, ymax: hi, xname: "n", yname: "aₙ" }, []);
        fillBand(cv, T, s.A - e, s.A + e, "--accent", 0.16);
        drawLayers(T);
      };
      function drawLayers(T) {
        // újrarajzoljuk a pontokat és vonalakat a sáv fölé
        const ctx = cv.ctx, r = shown > 300 ? 2 : shown > 80 ? 3 : 4.2;
        ctx.save();
        [[s.A, "--accent", []], [s.A - e, "--muted", [4, 4]], [s.A + e, "--muted", [4, 4]]].forEach(([y, c, d]) => {
          ctx.strokeStyle = col(c); ctx.setLineDash(d); ctx.lineWidth = 1.3;
          ctx.beginPath(); ctx.moveTo(0, T.ty(y)); ctx.lineTo(cv.w, T.ty(y)); ctx.stroke();
        });
        ctx.setLineDash([]);
        [[inP, "--ok"], [pts, "--bad"]].forEach(([P, c]) => {
          ctx.fillStyle = col(c);
          P.forEach(([x, y]) => { if (x < x0 || x > x1 || y < lo || y > hi) return; ctx.beginPath(); ctx.arc(T.tx(x), T.ty(y), r, 0, 2 * Math.PI); ctx.fill(); });
        });
        if (Number.isFinite(N) && N > 0 && N + 0.5 >= x0 && N + 0.5 <= x1) {
          ctx.strokeStyle = col("--setB"); ctx.setLineDash([6, 4]); ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(T.tx(N + 0.5), 0); ctx.lineTo(T.tx(N + 0.5), cv.h); ctx.stroke();
          ctx.setLineDash([]); ctx.fillStyle = col("--setB"); ctx.font = "600 12px system-ui, sans-serif";
          ctx.textAlign = T.tx(N + 0.5) > cv.w - 70 ? "right" : "left"; ctx.textBaseline = "top";
          ctx.fillText("N = " + fmt(N, 0), T.tx(N + 0.5) + (ctx.textAlign === "left" ? 5 : -5), 6);
        }
        ctx.restore();
      }
      cv.draw();
      statRow(out, [["sorozat", `$a_n = ${s.tex}$`], ["határérték-jelölt", `$A = ${s.A}$`], ["sáv", `$]${texNum(s.A - e, 4)};\\ ${texNum(s.A + e, 4)}[$`],
        ["küszöbindex", Number.isFinite(N) ? `$N = ${texNum(N, 0)}$` : "nincs"]]);
      msg.innerHTML = !Number.isFinite(N)
        ? "Akármeddig mész, mindig lesz kilógó tag (minden páratlan indexű tag −1). Ehhez az ε-hoz nincs küszöbindex – a sorozat <b>nem</b> tart az 1-hez."
        : N === 0 ? "Már az első tagtól kezdve minden tag a sávban van."
        : `Az első ${fmt(N, 0)} tag közül van, ami kilóg, de a(z) ${fmt(N + 1, 0)}. tagtól kezdve <b>mindegyik</b> a sávban van.` +
          (shown < N ? "" : step > 1 ? ` <span class="muted">(Az ábra minden ${step}. tagot mutatja.)</span>` : "");
    }
    draw();
  };

  /* ------------------------------------------------------------------
     2.4  Pókhálóábra rekurzív sorozatokhoz
     ------------------------------------------------------------------ */
  W["cobweb"] = root => {
    header(root, "Pókhálóábra – hogyan lépked egy rekurzív sorozat?",
      "A sorozat $a_{n+1} = f(a_n)$. Függőlegesen a görbéig lépünk (ez az új tag), vízszintesen az $y = x$ egyenesig (az új tag lesz a bemenet). " +
      "A fixpont, ahol a görbe metszi az egyenest: $A = f(A)$.");
    const P = [
      { l: "√(2+x)", f: "sqrt(2+x)", a: 0, v: [-0.5, 4, -0.5, 3] },
      { l: "x/2 + 1", f: "x/2+1", a: 1, v: [-0.5, 4, -0.5, 3] },
      { l: "1/(1+x)", f: "1/(1+x)", a: 1, v: [-0.1, 1.3, -0.1, 1.2] },
      { l: "2x (divergens)", f: "2x", a: 1, v: [-0.5, 12, -0.5, 12] },
      { l: "3,2·x(1−x) – ciklus", f: "3.2x(1-x)", a: 0.2, v: [-0.05, 1.05, -0.05, 1.05] },
      { l: "3,9·x(1−x) – káosz", f: "3.9x(1-x)", a: 0.2, v: [-0.05, 1.05, -0.05, 1.05] }
    ];
    let view = P[0].v.slice();
    const inp = h("input", { type: "text", value: P[0].f, style: "width:11rem;font-family:var(--mono)" });
    const err = h("span", { class: "muted" });
    const a1 = slider("a₁ =", -1, 5, 0.05, 0, () => draw(), v => fmt(v, 2));
    const steps = slider("lépések:", 1, 40, 1, 8, () => draw(), v => String(v));
    root.append(h("div", { class: "controls", style: "gap:.3rem" }, ...P.map(p => btn(p.l, () => {
      inp.value = p.f; view = p.v.slice(); a1.el.min = Math.min(p.v[0], 0); a1.el.max = p.v[1]; a1.value = p.a; draw();
    }))));
    root.append(h("div", { class: "controls" }, h("label", null, "f(x) = ", inp), err), h("div", { class: "controls" }, a1.wrap, steps.wrap));
    const cv = C.canvas(root, 0.62, 640);
    const out = h("div", { class: "stat-row" });
    const seq = h("p", { class: "w-sub", style: "margin:.4rem 0 0;font-family:var(--mono);overflow-wrap:anywhere" });
    root.append(legend([["y = f(x)", "--accent"], ["y = x", "--muted"], ["lépések", "--setB"]]), out, seq);
    inp.addEventListener("input", () => draw());
    function draw() {
      const c = compile(inp.value, ["x"]);
      err.textContent = c.err ? "⚠ " + c.err : "";
      if (c.err) return;
      const f = c.f, n = steps.value;
      const t = [a1.value];
      for (let i = 0; i < n; i++) t.push(f(t[i]));
      const [xmin, xmax, ymin, ymax] = view;
      // fixpontok a nézetben (előjelváltás f(x) - x)
      const fx = [];
      const K = 800;
      for (let k = 0; k < K; k++) {
        const x0 = xmin + (xmax - xmin) * k / K, x1 = xmin + (xmax - xmin) * (k + 1) / K;
        const g0 = f(x0) - x0, g1 = f(x1) - x1;
        if (Number.isFinite(g0) && Number.isFinite(g1) && g0 * g1 <= 0 && !(g0 === 0 && k > 0)) {
          let lo = x0, hi = x1;
          for (let j = 0; j < 50; j++) { const m = (lo + hi) / 2, gm = f(m) - m; if ((f(lo) - lo) * gm <= 0) hi = m; else lo = m; }
          fx.push((lo + hi) / 2);
        }
      }
      cv.draw = () => {
        const segs = [];
        for (let i = 0; i < n; i++) {
          const x = t[i], y = t[i + 1];
          if (!Number.isFinite(x) || !Number.isFinite(y) || Math.abs(y) > 1e6) break;
          segs.push({ seg: [[x, i === 0 ? 0 : x], [x, y]], color: "--setB", width: 1.4 });
          segs.push({ seg: [[x, y], [y, y]], color: "--setB", width: 1.4 });
        }
        C.plot(cv, { xmin, xmax, ymin, ymax, xname: "aₙ", yname: "aₙ₊₁" }, [
          { f: x => x, color: "--muted", width: 1.4, dash: [5, 4] },
          { f, color: "--accent" },
          ...segs,
          { points: [[t[0], 0]], color: "--setB", r: 4 },
          ...(fx.length ? [{ points: fx.map(x => [x, x]), color: "--ok", r: 5, open: true }] : [])
        ]);
      };
      cv.draw();
      const last = t[t.length - 1];
      const tail = t.slice(-4);
      const settled = tail.every(Number.isFinite) && Math.max(...tail) - Math.min(...tail) < 1e-3 * Math.max(1, Math.abs(last));
      const near = Number.isFinite(last) ? fx.find(x => Math.abs(last - x) < 0.05 * Math.max(1, Math.abs(x))) : undefined;
      statRow(out, [[`$a_{${n + 1}}$`, Number.isFinite(last) ? fmt(last, 6) : "nincs értelmezve"],
        ["fixpont(ok) a képen", fx.length ? fx.map(x => fmt(x, 4)).join("; ") : "nincs"],
        ["a tagok", settled ? "megállapodnak" : Math.abs(last) > 1e5 || !Number.isFinite(last) ? "elszállnak" : near !== undefined ? "a " + fmt(near, 3) + " felé közelednek" : "nem állapodnak meg"]]);
      seq.textContent = "Tagok: " + t.slice(0, 12).map(x => fmt(x, 4)).join(";  ") + (t.length > 12 ? "; …" : "");
    }
    draw();
  };

  /* ------------------------------------------------------------------
     2.5 / 2.7  Kamatozás sűrítése → e
     ------------------------------------------------------------------ */
  W["e-limit"] = root => {
    header(root, "Egyre sűrűbb kamatozás – megszületik az e",
      "1 millió Ft, évi $p$% kamat, egy év alatt $m$-szer írják jóvá ($\\tfrac{p}{m}$%-ot). A pontok a $\\left(1 + \\tfrac{x}{m}\\right)^m$ értékei ($x = \\tfrac{p}{100}$), " +
      "a szaggatott vonal a folytonos kamatozás határa, $e^x$.");
    const p = slider("évi kamatláb p =", 1, 200, 1, 100, () => draw(), v => v + "%");
    const M = [["évente (1)", 1], ["félévente (2)", 2], ["negyedévente (4)", 4], ["havonta (12)", 12], ["hetente (52)", 52], ["naponta (365)", 365], ["óránként (8760)", 8760]];
    let m = 12;
    const seg = segmented(M, m, v => { m = v; draw(); });
    root.append(h("div", { class: "controls" }, p.wrap), seg.wrap);
    const cv = C.canvas(root, 0.5, 720);
    const out = h("div", { class: "stat-row" });
    const msg = h("p", { class: "w-sub", style: "margin:.4rem 0 0" });
    root.append(legend([["(1 + x/m)^m, m = 1…40", "--accent"], ["kiválasztott m", "--setB"], ["határ: eˣ", "--ok", true]]), out, msg);
    function draw() {
      const x = p.value / 100, lim = Math.exp(x);
      const g = k => Math.pow(1 + x / k, k);
      const pts = Array.from({ length: 40 }, (_, i) => [i + 1, g(i + 1)]);
      const ymin = 1 + x * 0.9, ymax = lim + (lim - (1 + x)) * 0.15;
      cv.draw = () => C.plot(cv, { xmin: -1, xmax: 42, ymin: Math.min(ymin, 1 + x) - (lim - 1 - x) * 0.1, ymax, xname: "m", yname: "szorzó" }, [
        { hline: lim, color: "--ok", dash: [6, 4] },
        { points: pts, color: "--accent", r: 3.5 },
        ...(m <= 40 ? [{ points: [[m, g(m)]], color: "--setB", r: 6 }] : []),
        { text: "eˣ ≈ " + fmt(lim, 5), at: [26, lim], color: "--ok" }
      ]);
      cv.draw();
      const k = 1e6 * g(m), kc = 1e6 * lim;
      statRow(out, [["jóváírások évente", fmt(m, 0)], ["egy jóváírás", fmt(p.value / m, 4) + "%"],
        ["év végén", fmt(Math.round(k), 0) + " Ft"], ["folytonos határ", fmt(Math.round(kc), 0) + " Ft"], ["hiányzik a határig", fmt(kc - k, 2) + " Ft"]]);
      msg.innerHTML = `A szorzó $m$ növelésével nő, de sosem lépi át az $e^{${texNum(x, 2)}} \\approx ${texNum(lim, 5)}$-et. ` +
        (p.value === 100 ? "Évi 100%-nál ez maga az $e \\approx 2{,}71828$: 1 millióból legfeljebb kb. 2 718 282 Ft lesz." : "");
      window.Synopsis && Synopsis.renderMath(msg);
    }
    draw();
  };
