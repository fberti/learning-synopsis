
  /* ==================================================================
     w1: qq-plot (8.3-c), paired-vs-indep (8.4-b), t-test-lab (8.5-a), test-wizard (8.9-c)
     ================================================================== */
  const w1Box = (cv, l = 46, r = 14, t = 18, b = 34) => ({ x0: l, y0: t, x1: cv.w - r, y1: cv.h - b });
  const w1Minus = s => String(s).replace(/^-/, "−");
  const w1F = (x, d = 2) => w1Minus(fmt(x, d));
  const w1P = p => (!isFinite(p) ? "–" : p >= 0.0001 ? fmt(p, p >= 0.1 ? 2 : p >= 0.01 ? 3 : 4) : "< 0,0001");
  const w1Dot = (ctx, x, y, r, color, alpha = 1) => { ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.fill(); ctx.restore(); };
  const w1Var = a => { const m = mean(a); return a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1); };
  /* két minta t-próbája: pooled = true → közös szórás, különben Welch */
  function w1TTest(a, b, pooled) {
    const n1 = a.length, n2 = b.length, m1 = mean(a), m2 = mean(b), v1 = w1Var(a), v2 = w1Var(b);
    let se, df;
    if (pooled) { const sp2 = ((n1 - 1) * v1 + (n2 - 1) * v2) / (n1 + n2 - 2); se = Math.sqrt(sp2 * (1 / n1 + 1 / n2)); df = n1 + n2 - 2; }
    else { const q1 = v1 / n1, q2 = v2 / n2; se = Math.sqrt(q1 + q2); df = (q1 + q2) ** 2 / (q1 * q1 / (n1 - 1) + q2 * q2 / (n2 - 1)); }
    const t = (m1 - m2) / se, p = 2 * (1 - S.t.cdf(Math.abs(t), df)), tc = S.t.inv(0.975, df);
    return { n1, n2, m1, m2, v1, v2, se, df, t, p, lo: m1 - m2 - tc * se, hi: m1 - m2 + tc * se, tc };
  }
  /* egymintás t-próba (μ0 = 0) a különbségekre */
  function w1TOne(d) {
    const n = d.length, m = mean(d), s = Math.sqrt(w1Var(d)), se = s / Math.sqrt(n), t = m / se, df = n - 1;
    return { n, m, s, se, t, df, p: 2 * (1 - S.t.cdf(Math.abs(t), df)) };
  }
  /* adatsor pontosan adott átlaggal és (korrigált) szórással */
  function w1Exact(a, m, s) { const m0 = mean(a), s0 = Math.sqrt(w1Var(a)); return a.map(x => m + (x - m0) / s0 * s); }
  const w1Parse = str => str.split(/[\s;]+/).map(t => t.replace(",", ".")).filter(t => t !== "").map(Number).filter(isFinite);
  const w1Num = x => { const r = Math.round(x * 100) / 100; return String(r).replace(".", ","); };

  /* ------------------------------------------------------------------
     qq-plot – QQ-ábra: normális-e az adat?
     ------------------------------------------------------------------ */
  W["qq-plot"] = root => {
    header(root, "QQ-ábra – normális-e az adat?",
      "Válassz egy eloszlást és mintanagyságot! A pontok: a rendezett adatok a standard normális kvantilisek függvényében. Ha az adat normális, a pontok közel vannak a szaggatott egyeneshez ($\\bar x + s\\cdot z$). Nyomd meg többször az „Új minta” gombot: kis mintánál a normális adat QQ-ábrája is meglepően görbe lehet.");
    const ZSAK = [492, 497, 493, 499, 494];
    const DISTS = {
      zsak: { name: "öt zacskó (8.3-a)", fixed: true, gen: () => ZSAK.slice(), shape: "A 8.3-a öt zacskója. Öt pontból szinte semmi sem dönthető el." },
      norm: { name: "normális", gen: (n, r) => Array.from({ length: n }, () => 500 + 10 * S.rnorm(r)), shape: "Normális sokaság: a pontok az egyenes körül szóródnak, rendszeres görbület nélkül." },
      exp: { name: "jobbra ferde", gen: (n, r) => Array.from({ length: n }, () => S.rexp(r, 10)), shape: "Jobbra ferde (exponenciális): a pontok felfelé görbülő ívet alkotnak – a jobb vég az egyenes fölé szökik, a bal vég „lapos”." },
      t3: { name: "vastag farkú", gen: (n, r) => Array.from({ length: n }, () => { const z = S.rnorm(r); let c = 0; for (let k = 0; k < 3; k++) c += S.rnorm(r) ** 2; return 500 + 5 * z / Math.sqrt(c / 3); }), shape: "Vastag farkú ($t_3$): a két vég kifelé hajlik – bal alul az egyenes alá, jobb felül fölé. Több szélsőérték, mint normálisnál." },
      unif: { name: "egyenletes", gen: (n, r) => Array.from({ length: n }, () => 480 + 40 * r()), shape: "Egyenletes: a két vég befelé hajlik (S alak) – rövidebbek a farkak, mint normálisnál." },
      out: { name: "egy kiugró értékkel", gen: (n, r) => { const a = Array.from({ length: n }, () => 500 + 10 * S.rnorm(r)); a[0] = 500 + 10 * (4.5 + r()); return a; }, shape: "Normális adat egyetlen kiugró értékkel: egy pont messze az egyenestől. Nézd meg, mi okozza – mérési hiba vagy valódi érték?" }
    };
    let dist = "zsak", n = 5, seed = 2024, data = ZSAK.slice();
    const rnd = () => S.mulberry32(seed);
    const segD = segmented(Object.entries(DISTS).map(([k, v]) => [k, v.name]), dist, v => { dist = v; if (v === "zsak") segN.set(5, false); regen(); });
    const segN = segmented([5, 10, 30, 100].map(v => [v, "n = " + v]), n, v => { n = +v; if (dist === "zsak") { dist = "norm"; segD.set("norm", false); } regen(); });
    root.append(h("div", { class: "controls" }, segD.el), h("div", { class: "controls" }, segN.el, btn("🎲 Új minta", () => { seed++; regen(); })));
    const cw = h("div"); root.append(cw);
    const cv = tallCanvas(cw, w => Math.max(240, Math.min(420, w * 0.62)));
    root.append(keyRow([["rendezett adat", "--setA", "box"], ["$\\bar x + s\\cdot z$ (normális referencia)", "--muted", "dash"]]));
    const statEl = h("div", { class: "stat-row" }), msg = h("p", { class: "w-sub", style: "margin:.4rem 0 0" });
    root.append(statEl, msg);
    function regen() {
      data = dist === "zsak" ? ZSAK.slice() : DISTS[dist].gen(n, rnd());
      draw(); cv.draw = draw;
    }
    function draw() {
      const ctx = cv.ctx; ctx.clearRect(0, 0, cv.w, cv.h);
      const s = sorted(data), N = s.length, z = s.map((_, i) => S.normal.inv((i + 0.5) / N));
      const m = mean(s), sd = Math.sqrt(w1Var(s));
      const zmax = Math.max(2.6, Math.abs(z[0]) + 0.2);
      let ylo = Math.min(s[0], m - sd * zmax), yhi = Math.max(s[N - 1], m + sd * zmax);
      const pad = (yhi - ylo) * 0.05; ylo -= pad; yhi += pad;
      const box = w1Box(cv, 52, 14, 20, 36);
      const { tx, ty } = axes(ctx, box, { xmin: -zmax, xmax: zmax, ymin: ylo, ymax: yhi, xticks: rangeTicks(-zmax, zmax, 6), yticks: rangeTicks(ylo, yhi, 5), xfmt: v => w1Minus(String(v).replace(".", ",")), xlabel: "standard normális kvantilis z", ylabel: "rendezett adat" });
      ctx.save(); ctx.setLineDash([6, 5]); ctx.strokeStyle = css("--muted"); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(tx(-zmax), ty(m - sd * zmax)); ctx.lineTo(tx(zmax), ty(m + sd * zmax)); ctx.stroke(); ctx.restore();
      const r = N <= 10 ? 5 : N <= 30 ? 4 : 3;
      s.forEach((y, i) => w1Dot(ctx, tx(z[i]), ty(y), r, css("--setA"), 0.85));
      const rr = pearson(z, s);
      statRow(statEl, [["$n$", String(N)], ["$\\bar x$", w1F(m, 1)], ["$s$", w1F(sd, 2)], ["a QQ-pontok korrelációja", w1F(rr, 3)]]);
      msg.innerHTML = DISTS[dist].shape + (N <= 10 && dist !== "zsak" ? " <b>Kis minta:</b> ennyi pontból az alakot alig lehet megítélni." : "");
      window.Synopsis && Synopsis.renderMath(msg);
    }
    cv.draw = draw; draw();
  };

  /* ------------------------------------------------------------------
     paired-vs-indep – ugyanaz az adat párosan és függetlenként
     ------------------------------------------------------------------ */
  W["paired-vs-indep"] = root => {
    header(root, "Páros vagy független? – ugyanaz az adat kétféleképpen",
      "A 8.4-a hat dolgozója. A bal oldalon minden dolgozó két mérését vonal köti össze; a jobb oldalon csak a különbségek. Húzd az első csúszkát: nő vagy csökken a dolgozók <em>egymás közti</em> különbsége, a javulások változatlanok. A páros próba ezt észre sem veszi – a független próbát elnyomja.");
    const NAMES = ["Anna", "Bence", "Csilla", "Dani", "Emese", "Feri"];
    const B0 = [52, 61, 70, 45, 80, 66], D0 = [3, 5, -1, 4, 2, 5];
    let k = 1, shift = 0;
    const mB = mean(B0);
    const sK = sliderRow("Személyek közti szóródás:", 0, 2, 0.05, k, v => "×" + fmt(v, 2), v => { k = v; draw(); });
    const sS = sliderRow("Átlagos javulás:", -2, 6, 0.5, 3, v => w1F(v, 1) + " pont", v => { shift = v - 3; draw(); });
    root.append(h("div", { class: "controls" }, sK.wrap), h("div", { class: "controls" }, sS.wrap, btn("Alaphelyzet", () => { k = 1; shift = 0; sK.input.value = 1; sK.out.textContent = "×1,00"; sS.input.value = 3; sS.out.textContent = "3,0 pont"; draw(); })));
    const cw = h("div"); root.append(cw);
    const cv = tallCanvas(cw, w => Math.max(250, Math.min(360, w * 0.5)));
    root.append(keyRow([["előtte", "--setA", "box"], ["utána", "--setB", "box"], ["különbség (utána − előtte)", "--accent", "box"]]));
    const statEl = h("div", { class: "stat-row" }), msg = h("div", { class: "readout" });
    root.append(statEl, msg);
    function draw() {
      const before = B0.map(b => mB + k * (b - mB)), diffs = D0.map(d => d + shift), after = before.map((b, i) => b + diffs[i]);
      const pr = w1TOne(diffs), ind = w1TTest(after, before, true), r = pearson(before, after);
      const ctx = cv.ctx; ctx.clearRect(0, 0, cv.w, cv.h);
      const split = Math.round(cv.w * 0.6);
      const all = before.concat(after), lo = Math.min(20, ...all) - 2, hi = Math.max(105, ...all) + 2;
      const boxL = { x0: 44, y0: 20, x1: split - 18, y1: cv.h - 34 };
      const L = axes(ctx, boxL, { xmin: 0, xmax: 3, ymin: lo, ymax: hi, xticks: [], yticks: rangeTicks(lo, hi, 5), ylabel: "pontszám" });
      ctx.fillStyle = css("--muted"); ctx.font = "12px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.fillText("előtte", L.tx(1), boxL.y1 + 6); ctx.fillText("utána", L.tx(2), boxL.y1 + 6);
      before.forEach((b, i) => {
        ctx.strokeStyle = css("--border"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(L.tx(1), L.ty(b)); ctx.lineTo(L.tx(2), L.ty(after[i])); ctx.stroke();
        w1Dot(ctx, L.tx(1), L.ty(b), 5, css("--setA")); w1Dot(ctx, L.tx(2), L.ty(after[i]), 5, css("--setB"));
        if (cv.w > 420) { ctx.fillStyle = css("--muted"); ctx.font = "10px system-ui, sans-serif"; ctx.textAlign = "right"; ctx.textBaseline = "middle"; ctx.fillText(NAMES[i], L.tx(1) - 9, L.ty(b)); }
      });
      const dlo = Math.min(-6, ...diffs) - 1, dhi = Math.max(10, ...diffs) + 1;
      const boxR = { x0: split + 30, y0: 20, x1: cv.w - 12, y1: cv.h - 34 };
      const R = axes(ctx, boxR, { xmin: 0, xmax: 2, ymin: dlo, ymax: dhi, xticks: [], yticks: rangeTicks(dlo, dhi, 5), ylabel: "különbség" });
      ctx.save(); ctx.setLineDash([5, 4]); ctx.strokeStyle = css("--muted"); ctx.beginPath(); ctx.moveTo(boxR.x0, R.ty(0)); ctx.lineTo(boxR.x1, R.ty(0)); ctx.stroke(); ctx.restore();
      diffs.forEach((d, i) => w1Dot(ctx, R.tx(0.7 + 0.12 * i), R.ty(d), 5, css("--accent"), 0.85));
      ctx.fillStyle = css("--text"); ctx.fillRect(R.tx(0.55), R.ty(pr.m) - 1, R.tx(1.45) - R.tx(0.55), 2.5);
      ctx.fillStyle = css("--muted"); ctx.font = "12px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.fillText("utána − előtte", R.tx(1), boxR.y1 + 6);
      statRow(statEl, [["páros: $t$ ($df = 5$)", w1F(pr.t, 2)], ["páros: p", w1P(pr.p)], ["független: $t$ ($df = 10$)", w1F(ind.t, 2)], ["független: p", w1P(ind.p)],
        ["$s_d$ / független SE", w1F(pr.s, 2) + " / " + w1F(ind.se, 2)], ["korreláció $r$", w1F(r, 3)]]);
      const sigP = pr.p <= 0.05, sigI = ind.p <= 0.05;
      msg.innerHTML = `Páros elemzés: <b>${sigP ? "szignifikáns" : "nem szignifikáns"}</b> (p = ${w1P(pr.p)}). Független elemzés: <b>${sigI ? "szignifikáns" : "nem szignifikáns"}</b> (p = ${w1P(ind.p)}).` +
        (k > 0.3 && sigP && !sigI ? " A személyek közti különbség „elnyeli” a javulást – csak a páros próba látja." : k <= 0.3 ? " Ha a dolgozók szinte egyformák, a párosítás már alig nyer valamit." : "");
    }
    cv.draw = draw; draw();
  };

  /* ------------------------------------------------------------------
     t-test-lab – kétmintás t- és Welch-próba saját adatokkal
     ------------------------------------------------------------------ */
  W["t-test-lab"] = root => {
    header(root, "t-próba labor – két független csoport",
      "Írd be (vagy válaszd ki) a két csoport adatait, szóközzel vagy pontosvesszővel elválasztva (tizedesvessző is jó). A gép kiszámolja a t-próbát közös szórással vagy Welch szerint, a p-értéket és a különbség 95%-os konfidencia-intervallumát. Alul a $t$-eloszlás a megfigyelt $t$-vel: a kiemelt farkak területe a p-érték.");
    const rndBase = S.mulberry32(85);
    const fifty = (() => { const r = S.mulberry32(5); return [w1Exact(Array.from({ length: 5 }, () => S.rnorm(r)), 56, 10), w1Exact(Array.from({ length: 20 }, () => S.rnorm(r)), 50, 3)]; })();
    const PRESETS = {
      s33: ["3 + 3 dolgozó (8.5-a)", [7, 9, 11], [3, 5, 4]],
      s88: ["8 + 8 dolgozó", [72, 75, 78, 80, 81, 83, 85, 90], [65, 68, 70, 72, 74, 76, 79, 82]],
      s520: ["5 vs 20, eltérő szórás (8.5-c)", fifty[0].map(x => Math.round(x * 10) / 10), fifty[1].map(x => Math.round(x * 10) / 10)]
    };
    let pooled = true;
    const ta = h("input", { type: "text", style: "width:100%;font:inherit" }), tb = h("input", { type: "text", style: "width:100%;font:inherit" });
    const setData = (a, b) => { ta.value = a.map(w1Num).join("; "); tb.value = b.map(w1Num).join("; "); draw(); };
    const segP = segmented(Object.entries(PRESETS).map(([k, v]) => [k, v[0]]), "s33", v => setData(PRESETS[v][1], PRESETS[v][2]));
    const segM = segmented([["pool", "közös szórás"], ["welch", "Welch"]], "pool", v => { pooled = v === "pool"; draw(); });
    const randBtn = btn("🎲 Véletlen csoportok (10 + 10, valódi különbség 1 szórásnyi)", () => {
      const a = Array.from({ length: 10 }, () => 60 + 10 * S.rnorm(rndBase)).map(x => Math.round(x)), b = Array.from({ length: 10 }, () => 50 + 10 * S.rnorm(rndBase)).map(x => Math.round(x));
      segP.set("", false); setData(a, b);
    });
    ta.addEventListener("input", () => { segP.set("", false); draw(); }); tb.addEventListener("input", () => { segP.set("", false); draw(); });
    root.append(h("div", { class: "controls" }, segP.el),
      h("label", { style: "display:block;margin:.4rem 0" }, h("span", { style: "color:var(--setA);font-weight:600" }, "1. csoport: "), ta),
      h("label", { style: "display:block;margin:.4rem 0" }, h("span", { style: "color:var(--setB);font-weight:600" }, "2. csoport: "), tb),
      h("div", { class: "controls" }, segM.el, randBtn));
    const cw = h("div"); root.append(cw);
    const cv = tallCanvas(cw, w => Math.max(300, Math.min(400, w * 0.55)));
    const statEl = h("div", { class: "stat-row" }), msg = h("div", { class: "readout" });
    root.append(statEl, msg);
    function draw() {
      const a = w1Parse(ta.value), b = w1Parse(tb.value);
      const ctx = cv.ctx; ctx.clearRect(0, 0, cv.w, cv.h);
      if (a.length < 2 || b.length < 2) { statEl.replaceChildren(); msg.textContent = "Mindkét csoportba legalább 2 számot írj."; return; }
      const R = w1TTest(a, b, pooled);
      if (!isFinite(R.t)) { statEl.replaceChildren(); msg.textContent = "A két csoport szórása nem lehet egyszerre 0."; return; }
      /* felső panel: pöttyök */
      const topH = Math.round(cv.h * 0.42);
      const all = a.concat(b), lo0 = Math.min(...all), hi0 = Math.max(...all), pad = (hi0 - lo0 || 1) * 0.08;
      const boxT = { x0: 70, y0: 10, x1: cv.w - 14, y1: topH - 22 };
      const T = axes(ctx, boxT, { xmin: lo0 - pad, xmax: hi0 + pad, ymin: 0, ymax: 2, xticks: rangeTicks(lo0 - pad, hi0 + pad, 6), yticks: [], xfmt: v => w1Minus(String(v).replace(".", ",")) });
      [[a, "--setA", 1.45, "1. csoport"], [b, "--setB", 0.55, "2. csoport"]].forEach(([arr, col, yy, lab]) => {
        const cnt = {};
        arr.forEach(x => { const key = Math.round(x * 4); cnt[key] = (cnt[key] || 0) + 1; w1Dot(ctx, T.tx(x), T.ty(yy) - (cnt[key] - 1) * 7, 4.5, css(col), 0.8); });
        const m = mean(arr); ctx.fillStyle = css("--text"); ctx.fillRect(T.tx(m) - 1, T.ty(yy) - 14, 2.5, 22);
        ctx.fillStyle = css(col); ctx.font = "600 11px system-ui, sans-serif"; ctx.textAlign = "right"; ctx.textBaseline = "middle"; ctx.fillText(lab, boxT.x0 - 6, T.ty(yy));
      });
      /* alsó panel: t-eloszlás */
      const boxB = { x0: 46, y0: topH + 12, x1: cv.w - 14, y1: cv.h - 32 };
      const tm = Math.max(4.5, Math.min(12, Math.abs(R.t) + 1));
      const ymax = S.t.pdf(0, R.df) * 1.15;
      const B = axes(ctx, boxB, { xmin: -tm, xmax: tm, ymin: 0, ymax, xticks: rangeTicks(-tm, tm, 8), yticks: [], xfmt: v => w1Minus(String(v).replace(".", ",")), xlabel: "t" });
      const at = Math.abs(R.t);
      ctx.save(); ctx.fillStyle = css("--bad"); ctx.globalAlpha = 0.45;
      [[-tm, -at], [at, tm]].forEach(([u, v]) => { if (v <= u) return; ctx.beginPath(); ctx.moveTo(B.tx(u), B.ty(0)); for (let i = 0; i <= 80; i++) { const x = u + (v - u) * i / 80; ctx.lineTo(B.tx(x), B.ty(S.t.pdf(x, R.df))); } ctx.lineTo(B.tx(v), B.ty(0)); ctx.closePath(); ctx.fill(); });
      ctx.restore();
      curve(ctx, B.tx, B.ty, x => S.t.pdf(x, R.df), -tm, tm, css("--accent"), 2);
      vline(ctx, B.tx(R.t), boxB.y0, boxB.y1, css("--text"));
      [-R.tc, R.tc].forEach(c => vline(ctx, B.tx(c), boxB.y0 + 10, boxB.y1, css("--muted"), true));
      ctx.fillStyle = css("--text"); ctx.font = "11px system-ui, sans-serif"; ctx.textAlign = R.t > 0 ? "right" : "left"; ctx.textBaseline = "top";
      ctx.fillText("megfigyelt t = " + w1F(R.t, 2), B.tx(R.t) + (R.t > 0 ? -5 : 5), boxB.y0);
      statRow(statEl, [["átlagok", w1F(R.m1, 2) + " / " + w1F(R.m2, 2)], ["szórások $s$", w1F(Math.sqrt(R.v1), 2) + " / " + w1F(Math.sqrt(R.v2), 2)],
        ["SE", w1F(R.se, 3)], ["$t$", w1F(R.t, 2)], ["$df$", pooled ? String(R.df) : w1F(R.df, 1)], ["p (kétoldali)", w1P(R.p)],
        ["95%-os KI a különbségre", "[" + w1F(R.lo, 2) + "; " + w1F(R.hi, 2) + "]"]]);
      const other = w1TTest(a, b, !pooled);
      msg.innerHTML = `${pooled ? "Közös szórásos" : "Welch-féle"} t-próba: <b>${R.p <= 0.05 ? "5%-on elvetjük $H_0$-t" : "5%-on nem vetjük el $H_0$-t"}</b> (kritikus érték ±${fmt(R.tc, 3)}). ` +
        `Összevetésül ${pooled ? "Welch" : "közös szórással"}: $t$ = ${w1F(other.t, 2)}, p = ${w1P(other.p)}.` +
        (Math.abs(Math.log10(R.p / other.p)) > 0.5 ? " <b>A két módszer itt lényegesen eltér – nézd meg a szórásokat és a csoportméreteket!</b>" : "");
      window.Synopsis && Synopsis.renderMath(msg);
    }
    cv.draw = draw;
    setData(PRESETS.s33[1], PRESETS.s33[2]);
  };

  /* ------------------------------------------------------------------
     test-wizard – melyik próbát mikor?
     ------------------------------------------------------------------ */
  W["test-wizard"] = root => {
    header(root, "Próbaválasztó varázsló",
      "Válaszolj a kérdésekre – a varázsló megmondja, melyik próba illik a feladathoz, a próbastatisztikával és azzal, hol tanultuk.");
    const RES = {
      u1: ["Egymintás u-próba", "$z = \\dfrac{\\bar x - \\mu_0}{\\sigma/\\sqrt n} \\sim N(0,1)$", "#s81", "8.1", "Pl. a régi töltőgép: $\\sigma = 10$ g ismert, 25 zacskó átlaga 496 g."],
      t1: ["Egymintás t-próba", "$t = \\dfrac{\\bar x - \\mu_0}{s/\\sqrt n} \\sim t_{n-1}$", "#s83", "8.3", "Pl. az új gép öt zacskója: a szórást a mintából becsüljük."],
      tp: ["Páros t-próba", "$t = \\dfrac{\\bar d}{s_d/\\sqrt n} \\sim t_{n-1}$ a különbségekre", "#s84", "8.4", "Pl. ugyanaz a 6 dolgozó a betanítás előtt és után."],
      u2: ["Kétmintás u-próba", "$z = \\dfrac{\\bar x_1 - \\bar x_2}{\\sqrt{\\sigma_1^2/n_1 + \\sigma_2^2/n_2}} \\sim N(0,1)$", "#s82", "8.2", "Pl. két régóta ismert szórású gép átlagos töltése."],
      welch: ["Welch-próba (kétmintás t, eltérő szórások)", "$t = \\dfrac{\\bar x_1 - \\bar x_2}{\\sqrt{s_1^2/n_1 + s_2^2/n_2}}$, Welch-féle $df$", "#s85-b", "8.5", "Ha a szórások egyformák és a csoportméretek is, a közös szórásos t-próba ($df = n_1 + n_2 - 2$) is jó – de kétség esetén Welch."],
      chi: ["χ²-próba a szórásra", "$\\chi^2 = \\dfrac{(n-1)s^2}{\\sigma_0^2} \\sim \\chi^2_{n-1}$", "#s86-a", "8.6", "Csak normális adatra! Pl. a joghurtok szórása vs. az előírt 4 ml."],
      F: ["F-próba két szórásra", "$F = s_1^2/s_2^2$ (a nagyobb felül) $\\sim F_{n_1-1,\\,n_2-1}$", "#s86-b", "8.6", "Csak normális adatra! Pl. két gép pontossága."],
      lev: ["Levene-próba (vagy bootstrap)", "a csoportközéptől mért abszolút eltérések összehasonlítása", "#s86-c", "8.6", "Nem normális adatnál az F- és a χ²-próba megbízhatatlan – nagy mintán is."],
      p1: ["Egy arány z-próbája", "$z = \\dfrac{\\hat p - p_0}{\\sqrt{p_0(1-p_0)/n}}$", "#s87-a", "8.7", "Pl. 42 dohányzó a 400-ból, $p_0 = 0{,}15$."],
      binom: ["Pontos binomiális próba", "$P(X \\ge k \\mid n, p_0)$ közvetlenül a binomiális eloszlásból", "#s87-a", "8.7 / 7.2", "Ritka eseménynél ($np_0 \\lt 10$), pl. a 70 csavarból 3 selejtes."],
      p2: ["Két arány z-próbája", "$z = \\dfrac{\\hat p_1 - \\hat p_2}{\\sqrt{\\hat p(1-\\hat p)(1/n_1 + 1/n_2)}}$, összevont $\\hat p$", "#s87-b", "8.7", "Pl. A/B-teszt: 20/200 vs 34/200. Ne nézz bele menet közben!"],
      fisher: ["Fisher egzakt próbája", "pontos (permutációs) próba a 2×2-es táblára", "#s87-b", "9. fejezet", "Ha valamelyik csoportban 10-nél kevesebb „igen” vagy „nem” van."],
      anova: ["Varianciaanalízis (ANOVA)", "$F = \\dfrac{\\text{csoportok közti szórásnégyzet}}{\\text{csoporton belüli szórásnégyzet}}$", "#s89-c", "10. fejezet", "Három vagy több csoport átlaga – a páronkénti t-próbák többszörös tesztelést jelentenének."],
      np: ["Nemparaméteres vagy permutációs próba", "rangokon alapuló próbák, permutáció, bootstrap", "../07-hipotezisvizsgalat/#s76", "9. fejezet / 7.6", "Kis minta, erősen ferde adat vagy kiugró értékek esetén a t-próba félrevezethet."]
    };
    const Q = {
      start: ["Milyen az adat?", [["mért érték (súly, idő, pontszám…)", "what"], ["igen/nem kimenet (arány)", "pn"]]],
      pn: ["Hány mintád van?", [["egy minta, egy adott $p_0$-hoz hasonlítom", "pcond1"], ["két független csoport (pl. A/B-teszt)", "pcond2"]]],
      pcond1: ["Teljesül-e: $np_0 \\ge 10$ és $n(1-p_0) \\ge 10$?", [["igen", "=p1"], ["nem (ritka esemény vagy kis minta)", "=binom"]]],
      pcond2: ["Mindkét csoportban legalább 10 „igen” és 10 „nem” van?", [["igen", "=p2"], ["nem", "=fisher"]]],
      what: ["Mire kíváncsi a kérdés?", [["az átlagra (várható értékre)", "design"], ["a szórásra, pontosságra", "sdn"]]],
      sdn: ["Hány szórásról van szó?", [["egy, egy előírt $\\sigma_0$-hoz", "sdnorm1"], ["két csoport szórása", "sdnorm2"]]],
      sdnorm1: ["Normális-e az adat (egyenes QQ-ábra)?", [["igen", "=chi"], ["nem / kétes", "=lev"]]],
      sdnorm2: ["Normális-e mindkét csoport adata?", [["igen", "=F"], ["nem / kétes", "=lev"]]],
      design: ["Milyen a vizsgálati terv?", [["egy minta, egy adott $\\mu_0$-hoz", "shape1"], ["két mérés ugyanazon egységeken (előtte–utána, párok)", "shapeP"], ["két független csoport", "shape2"], ["három vagy több csoport", "=anova"]]],
      shape1: ["Kis minta ($n \\lt 30$) erősen ferde adattal vagy kiugró értékkel?", [["nem", "sig1"], ["igen", "=np"]]],
      shapeP: ["Kevés pár, és a különbségek erősen ferdék vagy kiugrók?", [["nem", "=tp"], ["igen", "=np"]]],
      shape2: ["Kis csoportok erősen ferde adattal vagy kiugró értékkel?", [["nem", "sig2"], ["igen", "=np"]]],
      sig1: ["Ismert a sokaság szórása (pl. évek óta mért gép, szabványos teszt)?", [["igen", "=u1"], ["nem, a mintából becslem", "=t1"]]],
      sig2: ["Ismertek a két sokaság szórásai?", [["igen", "=u2"], ["nem, a mintákból becslem", "=welch"]]]
    };
    let path = [];
    const crumbs = h("div", { class: "muted", style: "font-size:.88rem;margin:.3rem 0" });
    const body = h("div");
    root.append(crumbs, body);
    function go(node) {
      body.replaceChildren();
      crumbs.innerHTML = path.length ? path.map(p => p[1]).join(" → ") : "";
      if (node.startsWith("=")) {
        const [name, formula, href, where, note] = RES[node.slice(1)];
        body.append(h("div", { class: "box tip", style: "margin:.5rem 0" },
          h("span", { class: "box-title" }, "✅ " + name),
          h("div", { html: formula, style: "margin:.3rem 0" }),
          h("div", { html: note, style: "margin:.3rem 0" }),
          h("div", { html: `Hol tanultuk: <a href="${href}">${where}</a>` })));
      } else {
        const [q, opts] = Q[node];
        body.append(h("p", { style: "font-weight:600;margin:.4rem 0", html: q }),
          h("div", { class: "controls", style: "flex-direction:column;align-items:stretch;gap:.35rem" },
            ...opts.map(([lab, nxt]) => { const b = btn("", () => { path.push([node, lab]); go(nxt); }); b.innerHTML = lab; b.style.textAlign = "left"; return b; })));
      }
      const ctl = h("div", { class: "controls", style: "margin-top:.4rem" });
      if (path.length) ctl.append(btn("← Vissza", () => { const [prev] = path.pop(); go(prev); }), btn("Újrakezdem", () => { path = []; go("start"); }));
      body.append(ctl);
      window.Synopsis && Synopsis.renderMath(root);
    }
    go("start");
  };

