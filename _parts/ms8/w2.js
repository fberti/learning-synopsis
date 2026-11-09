  /* ==================================================================
     w2: welch-sim (8.5-c), f-test-sim (8.6-c), ab-test (8.7-c),
         power-planner (8.8-b)
     ================================================================== */

  /* --- w2 saját segédei --- */
  const w2R = String.raw;
  const w2Minus = s => String(s).replace(/^-/, "−");
  const w2F = (x, d = 1) => w2Minus(fmt(x, d));
  /* legfeljebb maxd tizedes, a záró nullák nélkül: 5 → "5", 0,975 → "0,975" */
  const w2Num = (x, maxd = 3) => {
    if (!isFinite(x)) return "–";
    let s = fmt(x, maxd);
    if (s.includes(",")) s = s.replace(/0+$/, "").replace(/,$/, "");
    return w2Minus(s);
  };
  /* vezérlősor; a beágyazott gombsorok (segmented) saját margója nélkül */
  const w2Ctl = (...kids) => { kids.forEach(k => k && k.classList && k.classList.contains("controls") && (k.style.margin = "0")); return h("div", { class: "controls" }, ...kids); };
  const w2Lab = t => h("span", { class: "muted", style: "font-size:.92rem" }, t);
  const w2Note = html => h("p", { class: "muted", style: "font-size:.88rem;margin:.6rem 0 0", html });
  /* kijelzősor egyszer felépítve (KaTeX-címkékkel), utána csak az értékek frissülnek */
  function w2Stats(el, labels) {
    statRow(el, labels.map(l => [l, "–"]));
    const vs = [...el.querySelectorAll(".v")], ls = [...el.querySelectorAll(".l")];
    const set = vals => vals.forEach((v, i) => { if (vs[i] && vs[i].innerHTML !== String(v)) { vs[i].innerHTML = v; if (/\$/.test(v)) window.Synopsis && Synopsis.renderMath(vs[i]); } });
    set.label = (i, l) => { if (ls[i] && ls[i].dataset.src !== l) { ls[i].dataset.src = l; ls[i].innerHTML = l; window.Synopsis && Synopsis.renderMath(ls[i]); } };
    return set;
  }
  const w2Math = (el, html) => { if (el.dataset.src !== html) { el.dataset.src = html; el.innerHTML = html; window.Synopsis && Synopsis.renderMath(el); } };
  const w2Clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const w2Font = (ctx, px, bold) => { ctx.font = `${bold ? "600 " : ""}${px}px system-ui, sans-serif`; };
  /* szöveg x köré középre, de a [lo, hi] sávon belül tartva */
  function w2TextIn(ctx, s, x, y, lo, hi) {
    const tw = ctx.measureText(s).width;
    ctx.textAlign = "left";
    ctx.fillText(s, Math.max(lo, Math.min(hi - tw, x - tw / 2)), y);
  }
  const w2Dot = (ctx, x, y, r, color) => { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.fill(); };
  /* tengely saját y-feliratokkal (yfmt), a rácsvonalak a tengely alatt */
  function w2Axes(ctx, box, o) {
    const yt = o.yticks || [], ty = v => box.y1 - (v - o.ymin) / (o.ymax - o.ymin) * (box.y1 - box.y0);
    ctx.save(); ctx.strokeStyle = css("--border"); ctx.fillStyle = css("--muted"); ctx.lineWidth = 1; w2Font(ctx, 11);
    ctx.textAlign = "right"; ctx.textBaseline = "middle";
    yt.forEach(v => { const y = ty(v); ctx.beginPath(); ctx.moveTo(box.x0, y); ctx.lineTo(box.x1, y); ctx.stroke(); ctx.fillText((o.yfmt || String)(v), box.x0 - 5, y); });
    ctx.restore();
    return axes(ctx, box, { ...o, yticks: [] });
  }
  /* címke kis háttérrel (hogy a rács fölött is olvasható legyen) */
  function w2Tag(ctx, s, x, y, color, align = "left", lo = -1e9, hi = 1e9) {
    const tw = ctx.measureText(s).width;
    let X = align === "right" ? x - tw : align === "center" ? x - tw / 2 : x;
    X = Math.max(lo, Math.min(hi - tw, X));
    ctx.save(); ctx.globalAlpha = 0.85; ctx.fillStyle = css("--card"); ctx.fillRect(X - 2, y - 7, tw + 4, 14); ctx.restore();
    ctx.fillStyle = color; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(s, X, y);
  }
  /* p-érték kiírása: kb. két értékes jegy (0,46; 0,049; 0,0014), nagyon kicsinél „< 0,000001” */
  const w2P = p => {
    if (!isFinite(p)) return "–";
    if (p >= 0.995) return "1";
    if (p < 1e-6) return "< 0,000001";
    return fmt(p, w2Clamp(1 - Math.floor(Math.log10(p)), 2, 6));
  };
  const w2PEq = p => { const s = w2P(p); return s[0] === "<" ? "p " + s : "p = " + s; };
  const w2Hline = (ctx, x0, x1, y, color, dash = true, lw = 2) => {
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = lw; if (dash) ctx.setLineDash([6, 5]);
    ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); ctx.restore();
  };
  const w2Pct = (x, d = 1) => (isFinite(x) ? pct(x, d) : "–");
  /* „arány (k / N)” kijelzőszöveg */
  const w2Rate = (k, N, d = 1) => (N ? `${pct(k / N, d)} <span style="font-size:.8em;color:var(--muted)">(${groupDigits(k)} / ${groupDigits(N)})</span>` : "–");
  /* darabolt futtatás: add(m) m ismétlést sorba állít, kötegenként (chunk) requestAnimationFrame-mel számol,
     cancel() eldobja a hátralévőt. Futás közben root.dataset.busy = "1" (a tesztek ezt figyelik). */
  function w2Queue(root, chunk, step, after) {
    let left = 0, token = 0;
    const loop = my => {
      if (my !== token) return;
      const m = Math.min(chunk, left); step(m); left -= m; after();
      if (left > 0) requestAnimationFrame(() => loop(my)); else delete root.dataset.busy;
    };
    return {
      add(m) { const idle = left === 0; left += m; if (idle) { root.dataset.busy = "1"; loop(token); } },
      cancel() { token++; left = 0; delete root.dataset.busy; }
    };
  }
  /* „téves elvetés” oszlopok: items = [{label, k, N, color}], vonal α-nál, ±2 SE bizonytalanság */
  function w2RateBars(ctx, box, items, alpha, narrow) {
    const top = Math.max(alpha * 2, ...items.map(it => { if (!it.N) return 0; const r = it.k / it.N; return r + (it.N >= 30 ? 2 * Math.sqrt(r * (1 - r) / it.N) : 0); }));
    const ymax = top <= 0.1 ? 0.1 : top <= 0.2 ? 0.2 : top <= 0.4 ? 0.4 : top <= 0.6 ? 0.6 : 1;
    const yt = rangeTicks(0, ymax, 4).filter(v => v <= ymax + 1e-9);
    const { ty } = w2Axes(ctx, box, { xmin: 0, xmax: 1, ymin: 0, ymax, yticks: yt, yfmt: v => w2Num(100 * v, 1) + "%" });
    const cw = (box.x1 - box.x0) / items.length, bw = Math.min(70, cw * 0.5);
    items.forEach((it, i) => {
      const xc = box.x0 + (i + 0.5) * cw;
      ctx.fillStyle = css("--muted"); w2Font(ctx, narrow ? 10.5 : 11.5, true); ctx.textBaseline = "top";
      w2TextIn(ctx, it.label, xc, box.y1 + 6, box.x0, box.x1);
      if (!it.N) return;
      const r = it.k / it.N, y = ty(r);
      ctx.save(); ctx.globalAlpha = 0.75; ctx.fillStyle = css(it.color); ctx.fillRect(xc - bw / 2, y, bw, box.y1 - y); ctx.restore();
      if (it.N >= 30) {
        const se = Math.sqrt(r * (1 - r) / it.N), ya = ty(Math.min(ymax, r + 2 * se)), yb = ty(Math.max(0, r - 2 * se));
        ctx.save(); ctx.strokeStyle = css("--text"); ctx.lineWidth = 1.5; ctx.beginPath();
        ctx.moveTo(xc, ya); ctx.lineTo(xc, yb); ctx.moveTo(xc - 5, ya); ctx.lineTo(xc + 5, ya); ctx.moveTo(xc - 5, yb); ctx.lineTo(xc + 5, yb); ctx.stroke(); ctx.restore();
      }
      ctx.fillStyle = css("--text"); w2Font(ctx, 13, true); ctx.textBaseline = "bottom";
      const yl = it.N >= 30 ? ty(Math.min(ymax, r + 2 * Math.sqrt(r * (1 - r) / it.N))) : y;
      w2TextIn(ctx, pct(r, 1), xc, Math.max(box.y0 + 12, yl - 3), box.x0, box.x1);
    });
    const ya = ty(alpha);
    w2Hline(ctx, box.x0, box.x1, ya, css("--bad"));
    ctx.fillStyle = css("--bad"); w2Font(ctx, 10.5, true);
    w2Tag(ctx, `α = ${w2Num(100 * alpha, 1)}%`, box.x1 - 2, ya - 9, css("--bad"), "right");
  }

  /* ------------------------------------------------------------------
     8.5-c  Közös szórás vagy Welch? – szimuláció igaz H0 mellett
     ------------------------------------------------------------------ */
  W["welch-sim"] = root => {
    header(root, "Közös szórás vagy Welch? – szimuláció igaz H₀ mellett",
      w2R`Két normális csoport, <b>azonos várható értékkel</b> ($H_0$ igaz), de esetleg eltérő szórással. Minden kísérletben mindkét kétmintás $t$-próbát elvégezzük ($\alpha = 5\%$, kétoldali). Ami elvetés, az mind téves.`);
    const PRE = {
      eq: [10, 1, 10, 1, "egyforma"], sd: [10, 3, 10, 1, "eltérő szórás, egyforma n"],
      small: [5, 10, 20, 3, "kis csoport nagy szórással"], big: [20, 10, 5, 3, "nagy csoport nagy szórással"]
    };
    const SEED0 = 85, ALPHA = 0.05, NMAX = 40;
    let [n1, s1, n2, s2] = PRE.small, seed = SEED0, rnd, N = 0, rejP = 0, rejW = 0, last = null;
    const bx = new Float64Array(NMAX), by = new Float64Array(NMAX);
    const pSeg = segmented(Object.entries(PRE).map(([k, v]) => [k, v[4]]), "small", k => { [n1, s1, n2, s2] = PRE[k]; sync(); seed = SEED0; reset(); });
    const mk = (lab, min, max, step, val, show, set) => sliderRow(lab, min, max, step, val, show, v => { set(v); matchPreset(); seed = SEED0; reset(); });
    const sShow = v => w2Num(v, 1);
    const r1 = mk("$n_1 =$", 2, NMAX, 1, n1, String, v => (n1 = v)), q1 = mk("$\\sigma_1 =$", 0.5, 10, 0.5, s1, sShow, v => (s1 = v));
    const r2 = mk("$n_2 =$", 2, NMAX, 1, n2, String, v => (n2 = v)), q2 = mk("$\\sigma_2 =$", 0.5, 10, 0.5, s2, sShow, v => (s2 = v));
    function sync() { [[r1, n1, String], [q1, s1, sShow], [r2, n2, String], [q2, s2, sShow]].forEach(([r, v, f]) => { r.input.value = v; r.out.textContent = f(v); }); }
    function matchPreset() { const k = Object.keys(PRE).find(k => PRE[k][0] === n1 && PRE[k][1] === s1 && PRE[k][2] === n2 && PRE[k][3] === s2); pSeg.set(k || "", false); }
    const Q = w2Queue(root, 2000, m => { for (let j = 0; j < m; j++) one(); keepLast(); }, upd);
    root.append(w2Ctl(w2Lab("előbeállítás:"), pSeg.el),
      h("div", { class: "controls", style: "gap:.4rem 1.4rem" }, r1.wrap, q1.wrap),
      h("div", { class: "controls", style: "gap:.4rem 1.4rem;margin-top:0" }, r2.wrap, q2.wrap),
      w2Ctl(btn("1 kísérlet", () => Q.add(1), "btn primary"), btn("+1 000", () => Q.add(1000)), btn("+10 000", () => Q.add(10000)),
        btn("Újra", () => { seed++; reset(); })));
    const cv = tallCanvas(root, w => (w < 560 ? 380 : 260));
    root.append(keyRow([["1. csoport", "--setA", "box"], ["2. csoport", "--setB", "box"], ["közös várható érték", "--muted", "dash"],
      ["téves elvetések aránya ± 2 SE", "--text", "line"], ["névleges α = 5%", "--bad", "dash"]]));
    const sEl = h("div", { class: "stat-row" }); root.append(sEl);
    const setS = w2Stats(sEl, ["kísérletek", "téves elvetés – közös szórással", "téves elvetés – Welch"]);
    const ro = h("div", { class: "readout", style: "overflow-x:auto" }); root.append(ro);
    root.append(w2Note("Ha a kisebb csoport szórása nagyobb, a közös szórásos próba sokszor riaszt tévesen; Welch szinte mindig tartja az 5%-ot. "
      + "Ha a nagyobb csoport szórása nagyobb, a közös szórásos próba túl óvatos: ritkán riaszt, de egy valódi különbséget is nehezebben vesz észre."));

    function one() {
      let a = 0, b = 0;
      for (let i = 0; i < n1; i++) { bx[i] = s1 * S.rnorm(rnd); a += bx[i]; }
      for (let i = 0; i < n2; i++) { by[i] = s2 * S.rnorm(rnd); b += by[i]; }
      const m1 = a / n1, m2 = b / n2;
      let ss1 = 0, ss2 = 0;
      for (let i = 0; i < n1; i++) ss1 += (bx[i] - m1) ** 2;
      for (let i = 0; i < n2; i++) ss2 += (by[i] - m2) ** 2;
      const dfP = n1 + n2 - 2, sp2 = (ss1 + ss2) / dfP, tP = (m1 - m2) / Math.sqrt(sp2 * (1 / n1 + 1 / n2));
      const u1 = ss1 / (n1 - 1) / n1, u2 = ss2 / (n2 - 1) / n2, tW = (m1 - m2) / Math.sqrt(u1 + u2);
      const dfW = (u1 + u2) ** 2 / (u1 * u1 / (n1 - 1) + u2 * u2 / (n2 - 1));
      const pP = Math.min(1, 2 * S.t.cdf(-Math.abs(tP), dfP)), pW = Math.min(1, 2 * S.t.cdf(-Math.abs(tW), dfW));
      N++; if (pP < ALPHA) rejP++; if (pW < ALPHA) rejW++;
      last = { m1, m2, sd1: Math.sqrt(ss1 / (n1 - 1)), sd2: Math.sqrt(ss2 / (n2 - 1)), tP, dfP, pP, tW, dfW, pW };
    }
    function keepLast() { if (last) { last.x = Array.from(bx.subarray(0, n1)); last.y = Array.from(by.subarray(0, n2)); } }
    function reset() { Q.cancel(); rnd = S.mulberry32(seed); N = rejP = rejW = 0; last = null; Q.add(1000); }
    const verdict = p => (p < ALPHA ? `<b style="color:var(--bad)">H₀-t elvetjük (tévesen!)</b>` : `<span style="color:var(--ok);font-weight:600">nem vetjük el</span>`);
    function upd() {
      setS([groupDigits(N), w2Rate(rejP, N), w2Rate(rejW, N)]);
      if (last) {
        const L = last;
        w2Math(ro, `<b>Az utolsó kísérlet</b>: x̄₁ = ${w2F(L.m1, 2)}, s₁ = ${w2F(L.sd1, 2)} · x̄₂ = ${w2F(L.m2, 2)}, s₂ = ${w2F(L.sd2, 2)}<br>`
          + `közös szórással: t = ${w2F(L.tP, 2)}, df = ${L.dfP}, ${w2PEq(L.pP)} → ${verdict(L.pP)}<br>`
          + `Welch: t = ${w2F(L.tW, 2)}, df = ${w2Num(L.dfW, 1)}, ${w2PEq(L.pW)} → ${verdict(L.pW)}`);
      }
      cv.draw();
    }
    cv.draw = () => {
      const ctx = cv.ctx, w = cv.w, H = cv.h, narrow = w < 560;
      ctx.clearRect(0, 0, w, H);
      const dBox = narrow ? { x0: 8, y0: 6, x1: w - 8, y1: 150 } : { x0: 8, y0: 6, x1: w * 0.56, y1: H - 8 };
      const bBox = narrow ? { x0: 46, y0: 180, x1: w - 10, y1: H - 26 } : { x0: w * 0.56 + 52, y0: 22, x1: w - 10, y1: H - 26 };
      // bal / felső panel: az utolsó kísérlet adatai
      const L = 3.3 * Math.max(s1, s2), X = v => dBox.x0 + 6 + (w2Clamp(v, -L, L) + L) / (2 * L) * (dBox.x1 - dBox.x0 - 12);
      const rowsY = narrow ? [dBox.y0 + 36, dBox.y0 + 96] : [dBox.y0 + (dBox.y1 - dBox.y0) * 0.3, dBox.y0 + (dBox.y1 - dBox.y0) * 0.66];
      const axY = narrow ? dBox.y1 - 14 : dBox.y1 - 22;
      ctx.save(); ctx.strokeStyle = css("--muted"); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(dBox.x0, axY); ctx.lineTo(dBox.x1, axY); ctx.stroke(); ctx.restore();
      ctx.fillStyle = css("--muted"); w2Font(ctx, 10.5); ctx.textBaseline = "top";
      rangeTicks(-L, L, 6).forEach(v => { w2TextIn(ctx, w2Num(v, 1), X(v), axY + 4, dBox.x0, dBox.x1); });
      vline(ctx, X(0), dBox.y0 + 14, axY, css("--muted"), true);
      const groups = [[last && last.x, last && last.m1, "--setA", `1. csoport: n₁ = ${n1}, σ₁ = ${w2Num(s1, 1)}`, "x̄₁"],
        [last && last.y, last && last.m2, "--setB", `2. csoport: n₂ = ${n2}, σ₂ = ${w2Num(s2, 1)}`, "x̄₂"]];
      groups.forEach(([xs, m, c, lab, ml], g) => {
        const y = rowsY[g], col = css(c);
        ctx.fillStyle = css("--muted"); w2Font(ctx, 11, true); ctx.textBaseline = "bottom"; ctx.textAlign = "left";
        ctx.fillText(lab, dBox.x0 + 2, y - 13);
        if (!xs) return;
        ctx.save(); ctx.globalAlpha = 0.7;
        xs.forEach((v, i) => w2Dot(ctx, X(v), y + ((i % 3) - 1) * 4, 3.5, col));
        ctx.restore();
        ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(X(m), y - 11); ctx.lineTo(X(m), y + 11); ctx.stroke(); ctx.restore();
        ctx.fillStyle = col; w2Font(ctx, 10.5, true); ctx.textBaseline = "top"; w2TextIn(ctx, ml, X(m), y + 12, dBox.x0, dBox.x1);
      });
      // jobb / alsó panel: téves elvetések aránya
      w2RateBars(ctx, bBox, [{ label: "közös szórással", k: rejP, N, color: "--setC" }, { label: "Welch", k: rejW, N, color: "--accent" }], ALPHA, narrow);
      ctx.fillStyle = css("--muted"); w2Font(ctx, 11); ctx.textAlign = "left"; ctx.textBaseline = "bottom";
      ctx.fillText("téves elvetések aránya", bBox.x0 - 40, bBox.y0 - 6);
    };
    reset();
  };

  /* ------------------------------------------------------------------
     8.6-c  Az F-próba érzékeny a normalitásra
     ------------------------------------------------------------------ */
  W["f-test-sim"] = root => {
    header(root, "Az F-próba érzékeny a normalitásra",
      w2R`Két csoport <b>ugyanabból</b> az eloszlásból (a szórások egyenlők, $H_0$ igaz), csoportonként $n$ elem. Kétoldali $F$-próba, $\alpha = 5\%$: $F = s_1^2/s_2^2$, és $H_0$-t elvetjük, ha $F$ valamelyik kritikus értéken kívül esik.`);
    const DISTS = {
      norm: { name: "normális", draw: r => S.rnorm(r), pdf: x => S.normal.pdf(x), mu: 0, sd: 1, lo: -4, hi: 4 },
      t5: { name: "csúcsos (t₅)", draw: r => S.rnorm(r) / Math.sqrt(S.rchi2(r, 5) / 5), pdf: x => S.t.pdf(x, 5), mu: 0, sd: Math.sqrt(5 / 3), lo: -5.5, hi: 5.5 },
      exp: { name: "ferde (exponenciális)", draw: r => S.rexp(r, 1), pdf: x => (x < 0 ? 0 : Math.exp(-x)), mu: 1, sd: 1, lo: -1.5, hi: 5.5 },
      unif: { name: "egyenletes", draw: r => r(), pdf: x => (x >= 0 && x <= 1 ? 1 : 0), mu: 0.5, sd: Math.sqrt(1 / 12), lo: -0.35, hi: 1.35 }
    };
    const SEED0 = 86, NMAX = 100;
    let n = 25, dist = "norm", seed = SEED0, rnd, logs = [], lo = 0, hi = 0, crit;
    const bx = new Float64Array(NMAX), by = new Float64Array(NMAX);
    const nSeg = segmented([10, 25, 100].map(v => [v, String(v)]), n, v => { n = +v; reset(); });
    const dSeg = segmented(Object.entries(DISTS).map(([k, d]) => [k, d.name]), dist, v => { dist = v; reset(); });
    const Q = w2Queue(root, 500, m => { for (let j = 0; j < m; j++) one(); }, upd);
    root.append(w2Ctl(w2Lab("csoportonként $n$ ="), nSeg.el), w2Ctl(w2Lab("eloszlás:"), dSeg.el),
      w2Ctl(btn("+1 000", () => Q.add(1000), "btn primary"), btn("+10 000", () => Q.add(10000)), btn("Újra", () => { seed++; reset(); })));
    const cvS = tallCanvas(root, w => (w < 560 ? 105 : 115));
    root.append(keyRow([["az eloszlás sűrűségfüggvénye", "--setB", "box"], ["normális, azonos átlaggal és szórással", "--muted", "dash"]]));
    const cv = tallCanvas(root, w => (w < 560 ? 260 : 290));
    root.append(keyRow([["szimulált F-értékek", "--setA", "box"], ["elvetés (a kritikus értékeken kívül)", "--bad", "box"],
      ["elméleti $F_{n-1,\\,n-1}$ sűrűség (normális esetben)", "--text", "line"], ["kritikus értékek", "--bad", "dash"]]));
    const sEl = h("div", { class: "stat-row" }); root.append(sEl);
    const setS = w2Stats(sEl, ["ismétlések", "téves elvetés (névleges 5%)", "F az alsó krit. alatt (névl. 2,5%)", "F a felső krit. fölött (névl. 2,5%)", "kritikus értékek"]);
    root.append(w2Note("Nagyobb mintával nem javul, sőt romlik: a hiba nem a minta kicsiségéből, hanem a nem normális alakból jön. "
      + "(Az átlagok $t$-próbájánál fordítva: ott a centrális határeloszlás-tétel nagy mintán segít.) A vízszintes tengely logaritmikus."));

    function setup() {
      crit = [S.f.inv(0.025, n - 1, n - 1), S.f.inv(0.975, n - 1, n - 1)];
    }
    function one() {
      const D = DISTS[dist];
      let a = 0, b = 0;
      for (let i = 0; i < n; i++) { bx[i] = D.draw(rnd); a += bx[i]; by[i] = D.draw(rnd); b += by[i]; }
      a /= n; b /= n;
      let v1 = 0, v2 = 0;
      for (let i = 0; i < n; i++) { v1 += (bx[i] - a) ** 2; v2 += (by[i] - b) ** 2; }
      const F = v1 / v2;
      logs.push(Math.log10(F));
      if (F < crit[0]) lo++; else if (F > crit[1]) hi++;
    }
    function reset() { Q.cancel(); setup(); rnd = S.mulberry32(seed); logs = []; lo = hi = 0; cvS.draw(); Q.add(1000); }
    function upd() {
      const N = logs.length;
      setS([groupDigits(N), w2Rate(lo + hi, N), w2Rate(lo, N), w2Rate(hi, N), `${w2Num(crit[0], 2)} és ${w2Num(crit[1], 2)}`]);
      cv.draw();
    }
    cvS.draw = () => {
      const ctx = cvS.ctx, w = cvS.w, H = cvS.h, D = DISTS[dist];
      ctx.clearRect(0, 0, w, H);
      const box = { x0: 10, y0: 18, x1: w - 10, y1: H - 18 };
      const pdfN = x => S.normal.pdf(x, D.mu, D.sd);
      let ym = 0; for (let i = 0; i <= 200; i++) { const x = D.lo + (D.hi - D.lo) * i / 200; ym = Math.max(ym, D.pdf(x), pdfN(x)); }
      ym *= 1.08;
      const { tx, ty } = axes(ctx, box, { xmin: D.lo, xmax: D.hi, ymin: 0, ymax: ym, xticks: [], xlabel: "" });
      // kitöltött sűrűség
      ctx.save(); ctx.fillStyle = css("--setB"); ctx.globalAlpha = 0.3; ctx.beginPath(); ctx.moveTo(tx(D.lo), ty(0));
      for (let i = 0; i <= 300; i++) { const x = D.lo + (D.hi - D.lo) * i / 300; ctx.lineTo(tx(x), ty(D.pdf(x))); }
      ctx.lineTo(tx(D.hi), ty(0)); ctx.closePath(); ctx.fill(); ctx.restore();
      if (dist !== "norm") curve(ctx, tx, ty, pdfN, D.lo, D.hi, css("--muted"), 1.5, [5, 4]);
      curve(ctx, tx, ty, D.pdf, D.lo, D.hi, css("--setB"), 2);
      ctx.fillStyle = css("--muted"); w2Font(ctx, 11, true); ctx.textAlign = "left"; ctx.textBaseline = "top";
      ctx.fillText(D.name, box.x0 + 4, 2);
    };
    cv.draw = () => {
      const ctx = cv.ctx, w = cv.w, H = cv.h, narrow = w < 560, N = logs.length, df = n - 1;
      ctx.clearRect(0, 0, w, H);
      const Lr = 1.8 * Math.log10(crit[1]), K = narrow ? 30 : 44, bwid = 2 * Lr / K;
      const counts = new Array(K).fill(0); let out = 0;
      for (const v of logs) { const i = Math.floor((v + Lr) / bwid); if (i >= 0 && i < K) counts[i]++; else out++; }
      const g = y => { const F = 10 ** y; return S.f.pdf(F, df, df) * F * Math.LN10; };
      let ym = 0; for (let i = 0; i <= 200; i++) ym = Math.max(ym, g(-Lr + 2 * Lr * i / 200));
      const dens = counts.map(c => (N ? c / (N * bwid) : 0));
      ym = Math.max(ym, ...dens) * 1.12;
      const box = { x0: 14, y0: 26, x1: w - 12, y1: H - 36 };
      const cand = [0.1, 0.2, 0.3, 0.5, 0.6, 0.7, 0.8, 1, 1.25, 1.5, 2, 3, 5, 10].filter(F => Math.abs(Math.log10(F)) <= Lr * 0.97);
      let ticks = cand;
      if (ticks.length > (narrow ? 7 : 11)) ticks = ticks.filter(F => [0.1, 0.2, 0.5, 1, 2, 5, 10].includes(F));
      if (ticks.length > (narrow ? 7 : 11)) ticks = ticks.filter(F => [0.1, 0.5, 1, 2, 10].includes(F));
      const { tx, ty } = axes(ctx, box, { xmin: -Lr, xmax: Lr, ymin: 0, ymax: ym, xticks: ticks.map(Math.log10), xfmt: v => w2Num(10 ** v, 2), xlabel: "F = s₁² / s₂²" });
      const cBad = css("--bad"), cA = css("--setA"), l0 = Math.log10(crit[0]), l1 = Math.log10(crit[1]);
      counts.forEach((c, i) => {
        if (!c) return;
        const a = -Lr + i * bwid, mid = a + bwid / 2, rej = mid < l0 || mid > l1;
        ctx.save(); ctx.globalAlpha = rej ? 0.8 : 0.5; ctx.fillStyle = rej ? cBad : cA;
        const y = ty(dens[i]); ctx.fillRect(tx(a) + 0.5, y, tx(a + bwid) - tx(a) - 1, box.y1 - y); ctx.restore();
      });
      curve(ctx, tx, ty, g, -Lr, Lr, css("--text"), 2);
      vline(ctx, tx(l0), box.y0 - 6, box.y1, cBad, true); vline(ctx, tx(l1), box.y0 - 6, box.y1, cBad, true);
      w2Font(ctx, 10.5, true); ctx.textBaseline = "bottom"; ctx.fillStyle = cBad;
      ctx.textAlign = "right"; ctx.fillText(w2Num(crit[0], 2), tx(l0) - 4, box.y0 - 8);
      ctx.textAlign = "left"; ctx.fillText(w2Num(crit[1], 2), tx(l1) + 4, box.y0 - 8);
      if (N) {
        w2Font(ctx, 11, true);
        w2Tag(ctx, pct(lo / N, 1), tx(l0) - 6, box.y0 + 14, cBad, "right", box.x0, box.x1);
        w2Tag(ctx, pct(hi / N, 1), tx(l1) + 6, box.y0 + 14, cBad, "left", box.x0, box.x1);
      } else { ctx.fillStyle = css("--muted"); w2Font(ctx, 12); w2TextIn(ctx, "Indíts egy szimulációt!", w / 2, H / 2, 0, w); }
      if (out) { ctx.fillStyle = css("--muted"); w2Font(ctx, 10); ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText(`${pct(out / N, 1)} az ábrán kívül`, box.x0 + 2, box.y1 + 20); }
    };
    reset();
  };

  /* ------------------------------------------------------------------
     8.7-c  A/B-teszt élőben – és a belenézés csapdája
     ------------------------------------------------------------------ */
  W["ab-test"] = root => {
    header(root, "A/B-teszt élőben – és a belenézés csapdája",
      w2R`Egy webshop két oldalváltozatot próbál ki. Minden látogató véletlenül kerül az A vagy a B változatra, és a valódi vásárlási arány $p_A$, illetve $p_B$. Két arány $z$-próbája (közös aránnyal, kétoldali) minden 100 látogató után.`);
    const SEED0 = 87, STEP = 100, END = 2000, LOOKS = END / STEP;
    let pA = 10, pB = 10, seed = SEED0, rnd, n = 0, kA = 0, kB = 0, path = [], timer = null;
    let simRnd, simN = 0, simEver = 0, simEnd = 0, perLook, firstAt;
    const binom = (m, p, r) => { let k = 0; for (let i = 0; i < m; i++) if (r() < p) k++; return k; };
    function ztest(ka, kb, na, nb) {
      const ph = (ka + kb) / (na + nb), se = Math.sqrt(ph * (1 - ph) * (1 / na + 1 / nb));
      if (!(se > 0)) return { z: 0, p: 1 };
      const z = (kb / nb - ka / na) / se;
      return { z, p: Math.min(1, 2 * S.normal.cdf(-Math.abs(z))) };
    }
    const show = v => v + "%";
    const rA = sliderRow("$p_A =$", 1, 30, 1, pA, show, v => { pA = v; preset(); resetAll(); });
    const rB = sliderRow("$p_B =$", 1, 30, 1, pB, show, v => { pB = v; preset(); resetAll(); });
    const setP = (a, b) => { pA = a; pB = b; rA.input.value = a; rA.out.textContent = show(a); rB.input.value = b; rB.out.textContent = show(b); preset(); resetAll(); };
    const pSeg = segmented([["0", "nincs különbség: 10% / 10%"], ["1", "B valóban jobb: 15%"]], "0", v => (v === "1" ? setP(10, 15) : setP(10, 10)));
    const preset = () => pSeg.set(pA === 10 && pB === 10 ? "0" : pA === 10 && pB === 15 ? "1" : "", false);
    const runB = btn("Futtasd 2000-ig", () => runTo());
    root.append(h("div", { class: "controls", style: "gap:.4rem 1.4rem" }, rA.wrap, rB.wrap), w2Ctl(pSeg.el),
      w2Ctl(btn("+100 látogató változatonként", () => { stop(); add(); }, "btn primary"), runB, btn("Újra", () => { seed++; resetLive(); })));
    const sEl = h("div", { class: "stat-row" }); root.append(sEl);
    const setS = w2Stats(sEl, ["látogatók / változat ($n$)", "vásárlók (A / B)", "$\\hat p_A$", "$\\hat p_B$", "különbség $\\hat p_B - \\hat p_A$", "$z$", "p (kétoldali)"]);
    const ro = h("div", { class: "readout" }); root.append(ro);
    const cv = tallCanvas(root, w => (w < 560 ? 250 : 270));
    root.append(keyRow([["a p-érték útja", "--accent", "line"], ["p < 0,05", "--bad", "box"], ["α = 0,05", "--bad", "dash"]]));
    root.append(w2Note("Ha addig nézed, amíg szignifikáns nem lesz, egyszer szinte biztosan az lesz – akkor is, ha nincs különbség. A függőleges tengely logaritmikus."));

    // 2. rész: sok A/B-teszt
    root.append(h("p", { style: "font-weight:700;margin:1.1rem 0 .2rem" }, "Sok A/B-teszt: belenézés 100-asával 2000-ig"),
      w2Note(w2R`Minden szimulált kísérletben 20-szor nézünk bele ($n = 100, 200, \dots, 2000$). Mennyi a valószínűsége, hogy <b>valamikor</b> p &lt; 0,05 lesz – és mennyi, hogy a végén, az egyetlen, előre tervezett próbánál? (A fenti $p_A$, $p_B$ értékekkel; ha egyenlők, minden elvetés téves.)`));
    const SQ = w2Queue(root, 200, m => { for (let j = 0; j < m; j++) simOne(); }, updSim);
    root.append(w2Ctl(btn("Szimuláld 1000-szer", () => SQ.add(1000), "btn primary"), btn("Ürít", () => { resetSim(true); })));
    const cv2 = tallCanvas(root, w => (w < 560 ? 230 : 240));
    root.append(keyRow([["eddig valamikor p < 0,05", "--bad", "line"], ["épp ennél a belenézésnél p < 0,05", "--accent", "line"], ["α = 5%", "--muted", "dash"]]));
    const s2El = h("div", { class: "stat-row" }); root.append(s2El);
    const setS2 = w2Stats(s2El, ["szimulált kísérletek", "valamikor p < 0,05 (20 belenézésből)", "csak a végén p < 0,05 (1 próba)"]);

    function add() {
      if (!rnd) rnd = S.mulberry32(seed);
      kA += binom(STEP, pA / 100, rnd); kB += binom(STEP, pB / 100, rnd); n += STEP;
      const t = ztest(kA, kB, n, n); path.push({ n, p: t.p, z: t.z });
      upd();
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } runB.disabled = false; delete root.dataset.anim; }
    function runTo() {
      stop(); if (n >= END) return;
      root.dataset.anim = "1"; runB.disabled = true;
      timer = setInterval(() => { add(); if (n >= END) stop(); }, 110);
    }
    function resetLive() { stop(); rnd = S.mulberry32(seed); n = kA = kB = 0; path = []; upd(); }
    function resetSim(newSeed) {
      SQ.cancel(); if (newSeed) simSeed++; simRnd = S.mulberry32(simSeed); simN = simEver = simEnd = 0;
      perLook = new Array(LOOKS).fill(0); firstAt = new Array(LOOKS).fill(0); updSim();
    }
    let simSeed = 1087;
    function resetAll() { seed = SEED0; resetLive(); simSeed = 1087; resetSim(false); }
    function simOne() {
      let a = 0, b = 0, ever = false, pa = pA / 100, pb = pB / 100;
      for (let j = 0; j < LOOKS; j++) {
        a += binom(STEP, pa, simRnd); b += binom(STEP, pb, simRnd);
        const m = (j + 1) * STEP, p = ztest(a, b, m, m).p;
        if (p < 0.05) { perLook[j]++; if (!ever) { ever = true; firstAt[j]++; } if (j === LOOKS - 1) simEnd++; }
      }
      simN++; if (ever) simEver++;
    }
    const first = () => path.find(q => q.p < 0.05);
    function upd() {
      const t = n ? ztest(kA, kB, n, n) : null;
      setS([groupDigits(n), n ? `${kA} / ${kB}` : "–", n ? w2Pct(kA / n, 1) : "–", n ? w2Pct(kB / n, 1) : "–",
        n ? w2Minus(fmt(100 * (kB - kA) / n, 1)) + " százalékpont" : "–", t ? w2F(t.z, 2) : "–", t ? w2P(t.p) : "–"]);
      const f = first();
      let s;
      if (!n) s = "Még nincs látogató. Indítsd el a tesztet!";
      else {
        const rej = t.p < 0.05;
        s = `n = ${groupDigits(n)} látogató / változat: z = ${w2F(t.z, 2)}, ${w2PEq(t.p)} → `
          + (rej ? `<b style="color:var(--bad)">5%-on H₀-t elvetjük</b>` : `<span style="color:var(--ok);font-weight:600">5%-on H₀-t nem vetjük el</span>`);
        if (f && f.n !== n && !rej) s += `<br>Közben n = ${groupDigits(f.n)}-nál ${w2PEq(f.p)} volt – ott leállva „szignifikáns különbséget” hirdettünk volna${pA === pB ? ", pedig nincs" : ""}.`;
      }
      ro.innerHTML = s;
      cv.draw();
    }
    function updSim() {
      setS2([groupDigits(simN), w2Rate(simEver, simN), w2Rate(simEnd, simN)]);
      cv2.draw();
    }
    const LG = Math.log10;
    cv.draw = () => {
      const ctx = cv.ctx, w = cv.w, H = cv.h, narrow = w < 560;
      ctx.clearRect(0, 0, w, H);
      const xmax = Math.max(END, n), ymin = Math.min(-4, Math.floor(Math.min(0, ...path.map(q => LG(Math.max(q.p, 1e-12)))))) ;
      const box = { x0: 52, y0: 24, x1: w - (narrow ? 22 : 16), y1: H - 36 };
      const st = ymin < -6 ? 2 : 1, yt = st > 1 ? [1, 0.05] : [1, 0.1, 0.05, 0.01];
      for (let k = st > 1 ? 2 : 3; k <= -ymin; k += st) yt.push(10 ** -k);
      const ty = v => box.y0 + (0 - v) / (0 - ymin) * (box.y1 - box.y0);
      ctx.save(); ctx.strokeStyle = css("--border"); ctx.fillStyle = css("--muted"); ctx.lineWidth = 1; w2Font(ctx, 11); ctx.textAlign = "right"; ctx.textBaseline = "middle";
      yt.forEach(v => { const y = ty(LG(v)); ctx.beginPath(); ctx.moveTo(box.x0, y); ctx.lineTo(box.x1, y); ctx.stroke(); ctx.fillText((v >= 1e-4 ? w2Num(v, 4) : "10" + String(Math.round(LG(v))).replace(/./g, ch => "⁻⁰¹²³⁴⁵⁶⁷⁸⁹"["-0123456789".indexOf(ch)])), box.x0 - 5, y); });
      ctx.restore();
      const xt = rangeTicks(0, xmax, narrow ? 4 : 8);
      const { tx } = axes(ctx, { ...box }, { xmin: 0, xmax, ymin: 0, ymax: 1, xticks: xt, xfmt: v => groupDigits(v), xlabel: "látogatók / változat (n)" });
      ctx.fillStyle = css("--muted"); w2Font(ctx, 11); ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText("p-érték", 4, 0);
      const y05 = ty(LG(0.05));
      w2Hline(ctx, box.x0, box.x1, y05, css("--bad"));
      // sáv a 0,05 alatt
      ctx.save(); ctx.globalAlpha = 0.07; ctx.fillStyle = css("--bad"); ctx.fillRect(box.x0, y05, box.x1 - box.x0, box.y1 - y05); ctx.restore();
      const Y = p => ty(Math.max(ymin, LG(Math.max(p, 1e-12))));
      if (path.length) {
        ctx.save(); ctx.strokeStyle = css("--accent"); ctx.lineWidth = 2; ctx.beginPath();
        ctx.moveTo(tx(0), ty(0));
        path.forEach(q => ctx.lineTo(tx(q.n), Y(q.p))); ctx.stroke(); ctx.restore();
        path.forEach(q => w2Dot(ctx, tx(q.n), Y(q.p), q.p < 0.05 ? 4 : 2.8, css(q.p < 0.05 ? "--bad" : "--accent")));
        const f = first();
        if (f) {
          const x = tx(f.n), y = Y(f.p);
          ctx.save(); ctx.strokeStyle = css("--text"); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(x, y, 8, 0, 2 * Math.PI); ctx.stroke(); ctx.restore();
          ctx.fillStyle = css("--text"); w2Font(ctx, narrow ? 10.5 : 11.5, true); ctx.textBaseline = "middle";
          const ly = Math.min(box.y1 - 9, y + 20);
          const lab = narrow ? "Itt leállt volna egy türelmetlen elemző" : "↑ Itt leállt volna egy türelmetlen elemző";
          w2Tag(ctx, lab, x - 14, ly, css("--text"), "left", box.x0 + 2, box.x1 - 2);
        }
      } else { ctx.fillStyle = css("--muted"); w2Font(ctx, 12); w2TextIn(ctx, "Kattints: +100 látogató, vagy Futtasd 2000-ig!", (box.x0 + box.x1) / 2, (box.y0 + y05) / 2, box.x0, box.x1); }
      ctx.fillStyle = css("--bad"); w2Font(ctx, 10.5, true);
      w2Tag(ctx, "α = 0,05", box.x1 - 2, y05 - 9, css("--bad"), "right");
    };
    cv2.draw = () => {
      const ctx = cv2.ctx, w = cv2.w, H = cv2.h, narrow = w < 560;
      ctx.clearRect(0, 0, w, H);
      const cum = []; firstAt.reduce((s, c, i) => (cum[i] = s + c), 0);
      const top = simN ? Math.max(...cum.map(c => c / simN), ...perLook.map(c => c / simN)) : 0;
      const ymax = top <= 0.1 ? 0.1 : top <= 0.3 ? 0.3 : top <= 0.5 ? 0.5 : 1;
      const box = { x0: 46, y0: 18, x1: w - 16, y1: H - 36 };
      const xt = narrow ? [1, 5, 10, 15, 20] : [1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
      const { tx, ty } = w2Axes(ctx, box, { xmin: 0.5, xmax: LOOKS + 0.5, ymin: 0, ymax, yticks: rangeTicks(0, ymax, 4), yfmt: v => w2Num(100 * v, 1) + "%",
        xticks: xt, xfmt: v => String(v), xlabel: narrow ? "belenézés (×100 látogató)" : "belenézések száma (×100 látogató / változat)" });
      w2Hline(ctx, box.x0, box.x1, ty(0.05), css("--muted"), true, 1.5);
      if (!simN) { ctx.fillStyle = css("--muted"); w2Font(ctx, 12); w2TextIn(ctx, "Szimuláld 1000-szer!", (box.x0 + box.x1) / 2, box.y0 + (box.y1 - box.y0) * 0.3, box.x0, box.x1); return; }
      const line = (arr, c) => {
        ctx.save(); ctx.strokeStyle = css(c); ctx.lineWidth = 2.2; ctx.beginPath();
        arr.forEach((v, i) => (i ? ctx.lineTo(tx(i + 1), ty(v / simN)) : ctx.moveTo(tx(i + 1), ty(v / simN)))); ctx.stroke(); ctx.restore();
        arr.forEach((v, i) => w2Dot(ctx, tx(i + 1), ty(v / simN), 2.6, css(c)));
      };
      line(perLook, "--accent"); line(cum, "--bad");
      w2Font(ctx, 11.5, true);
      const e = cum[LOOKS - 1] / simN, en = perLook[LOOKS - 1] / simN;
      w2Tag(ctx, "valamikor: " + pct(e, 1), tx(LOOKS) - 6, ty(e) - 11, css("--bad"), "right", box.x0 + 2, box.x1);
      w2Tag(ctx, "a végén: " + pct(en, 1), tx(LOOKS) - 6, ty(en) + (ty(en) + 14 < box.y1 ? 12 : -12), css("--accent"), "right");
    };
    resetAll();
  };

  /* ------------------------------------------------------------------
     8.8-b  Erő- és mintanagyság-tervező két csoporthoz
     ------------------------------------------------------------------ */
  W["power-planner"] = root => {
    header(root, "Erő- és mintanagyság-tervező két csoporthoz",
      w2R`Add meg, mekkora különbséget akarsz észrevenni, milyen szinten ($\alpha$), és mekkora eséllyel (kívánt erő $1-\beta$). A tervező megmondja a csoportonként szükséges létszámot (kétoldali próba, normális közelítés).`);
    let mode = "mean", D = 3, sig = 12, p1 = 10, p2 = 15, alpha = 0.05, pw = 0.8;
    const plan = { mean: 100, prop: 400 };
    let req = null, xmax = 4;
    const mSeg = segmented([["mean", "átlagok"], ["prop", "arányok"]], mode, v => { mode = v; upd(); });
    const rD = sliderRow("érdekes különbség $\\Delta =$", 0.5, 20, 0.5, D, v => w2Num(v, 1), v => { D = v; upd(); });
    const rS = sliderRow("szórás $\\sigma =$", 1, 40, 1, sig, String, v => { sig = v; upd(); });
    const rP1 = sliderRow("$p_1 =$", 1, 60, 1, p1, v => v + "%", v => { p1 = v; upd(); });
    const rP2 = sliderRow("$p_2 =$", 1, 60, 1, p2, v => v + "%", v => { p2 = v; upd(); });
    const aSeg = segmented([[0.1, "10%"], [0.05, "5%"], [0.01, "1%"]], alpha, v => { alpha = +v; upd(); });
    const wSeg = segmented([[0.7, "70%"], [0.8, "80%"], [0.9, "90%"], [0.95, "95%"]], pw, v => { pw = +v; upd(); });
    const rN = sliderRow("tervezett $n$ / csoport:", 2, 500, 1, plan.mean, v => groupDigits(v), v => { plan[mode] = v; upd(); });
    const gMean = h("div", { class: "controls", style: "gap:.4rem 1.4rem" }, rD.wrap, rS.wrap);
    const gProp = h("div", { class: "controls", style: "gap:.4rem 1.4rem" }, rP1.wrap, rP2.wrap);
    root.append(w2Ctl(w2Lab("mit hasonlítasz össze?"), mSeg.el), gMean, gProp,
      w2Ctl(w2Lab("$\\alpha$:"), aSeg.el, w2Lab("kívánt erő:"), wSeg.el));
    const sEl = h("div", { class: "stat-row" }); root.append(sEl);
    const setS = w2Stats(sEl, ["szükséges $n$ / csoport", "összesen (2 csoport)", "$d = \\Delta/\\sigma$", "erő a tervezett $n$-nél"]);
    const ro = h("div", { class: "readout", style: "overflow-x:auto" }); root.append(ro);
    const cv = tallCanvas(root, w => (w < 560 ? 250 : 280));
    cv.c.style.touchAction = "pan-y"; cv.c.style.cursor = "ew-resize";
    root.append(keyRow([["erő a csoportlétszám függvényében", "--accent", "line"], ["kívánt erő", "--ok", "dash"], ["szükséges n", "--muted", "dash"], ["tervezett n (húzd!)", "--text", "box"]]));
    root.append(w2Ctl(rN.wrap));
    root.append(w2Note("Az erőbe mindkét farkat beszámítjuk (a másik irányú elvetés esélye itt elhanyagolható). "
      + "Kerekített $z$-kkel (1,96 és 0,84) számolva néha eggyel kisebb $n$ jön ki – például 250,9 → 251 –, ez nem hiba."));

    const z = q => S.normal.inv(q);
    function calc() {
      const za = z(1 - alpha / 2), zb = z(pw);
      if (mode === "mean") {
        const raw = 2 * sig * sig * (za + zb) ** 2 / (D * D);
        const power = m => { const k = D / (sig * Math.sqrt(2 / m)); return S.normal.cdf(k - za) + S.normal.cdf(-k - za); };
        return { za, zb, raw, power };
      }
      const a = p1 / 100, b = p2 / 100, pb = (a + b) / 2, Dp = Math.abs(a - b);
      const A = za * Math.sqrt(2 * pb * (1 - pb)), B = Math.sqrt(a * (1 - a) + b * (1 - b));
      const raw = Dp > 0 ? (A + zb * B) ** 2 / (Dp * Dp) : Infinity;
      const power = m => S.normal.cdf((Dp * Math.sqrt(m) - A) / B) + S.normal.cdf((-Dp * Math.sqrt(m) - A) / B);
      return { za, zb, raw, power, pb };
    }
    const tn = x => texNum(x, x < 10 ? 2 : 1);
    function upd() {
      gMean.style.display = mode === "mean" ? "" : "none"; gProp.style.display = mode === "prop" ? "" : "none";
      req = calc();
      const ok = isFinite(req.raw), nReq = ok ? Math.max(2, Math.ceil(req.raw - 1e-9)) : null;
      req.n = nReq;
      xmax = ok ? Math.max(4, 2 * nReq) : 1000;
      rN.input.max = xmax; rN.input.disabled = !ok;
      plan[mode] = w2Clamp(plan[mode], 2, xmax);
      rN.input.value = plan[mode]; rN.out.textContent = groupDigits(plan[mode]);
      const np = plan[mode], pwr = req.power(np);
      setS.label(2, mode === "mean" ? "$d = \\Delta/\\sigma$" : "különbség $|p_1 - p_2|$");
      setS([ok ? groupDigits(nReq) : "–", ok ? groupDigits(2 * nReq) : "–",
        mode === "mean" ? w2Num(D / sig, 3) : w2Num(Math.abs(p1 - p2), 0) + " százalékpont", pct(pwr, 1)]);
      const zs = `$z_{1-\\alpha/2} = ${texNum(req.za, 3)}$, $z_{1-\\beta} = ${texNum(req.zb, 3)}$`;
      if (mode === "mean")
        w2Math(ro, `${zs}<br>$n = \\dfrac{2\\sigma^2\\,(z_{1-\\alpha/2} + z_{1-\\beta})^2}{\\Delta^2} = \\dfrac{2\\cdot ${w2Num(sig, 1)}^2\\cdot(${texNum(req.za, 3)} + ${texNum(req.zb, 3)})^2}{${texNum(D, D % 1 ? 1 : 0)}^2} = ${tn(req.raw)} \\;\\Rightarrow\\; ${texNum(nReq, 0)}$ fő / csoport`);
      else if (ok)
        w2Math(ro, `${zs}, $\\bar p = ${texNum(req.pb, 3)}$<br>$n = \\dfrac{\\big(z_{1-\\alpha/2}\\sqrt{2\\bar p(1-\\bar p)} + z_{1-\\beta}\\sqrt{p_1(1-p_1)+p_2(1-p_2)}\\big)^2}{(p_1-p_2)^2} = ${tn(req.raw)} \\;\\Rightarrow\\; ${texNum(nReq, 0)}$ / csoport`);
      else w2Math(ro, "$p_1 = p_2$: nincs kimutatandó különbség, ehhez semmilyen létszám nem elég.");
      cv.draw();
    }
    const box = () => ({ x0: 46, y0: 18, x1: cv.w - 16, y1: cv.h - 36 });
    cv.draw = () => {
      const ctx = cv.ctx, w = cv.w, H = cv.h, narrow = w < 560, B = box();
      ctx.clearRect(0, 0, w, H);
      const { tx, ty } = w2Axes(ctx, B, { xmin: 0, xmax, ymin: 0, ymax: 1, yticks: [0, 0.2, 0.4, 0.6, 0.8, 1], yfmt: v => w2Num(100 * v, 0) + "%",
        xticks: rangeTicks(0, xmax, narrow ? 4 : 8).filter(v => Number.isInteger(v)), xfmt: v => groupDigits(v), xlabel: "n / csoport", ylabel: "" });
      ctx.fillStyle = css("--muted"); w2Font(ctx, 11); ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText("erő", 4, 0);
      if (!req.n) { ctx.fillStyle = css("--muted"); w2Font(ctx, 12); w2TextIn(ctx, "p₁ = p₂: nincs mit kimutatni", (B.x0 + B.x1) / 2, (B.y0 + B.y1) / 2, B.x0, B.x1); return; }
      w2Hline(ctx, B.x0, B.x1, ty(pw), css("--ok"));
      vline(ctx, tx(req.n), B.y0, B.y1, css("--muted"), true);
      const pf = m => (m <= 0 ? alpha : req.power(m));
      curve(ctx, tx, ty, pf, 0, xmax, css("--accent"), 2.5);
      w2Font(ctx, 10.5, true);
      w2Tag(ctx, `kívánt erő: ${w2Num(100 * pw, 0)}%`, B.x0 + 4, ty(pw) - 10, css("--ok"), "left");
      w2Tag(ctx, `szükséges: ${groupDigits(req.n)}`, tx(req.n) + 5, B.y1 - 12, css("--muted"), "left", B.x0, B.x1);
      const np = plan[mode], pv = req.power(np), x = tx(np), y = ty(pv);
      ctx.save(); ctx.strokeStyle = css("--text"); ctx.globalAlpha = 0.5; ctx.setLineDash([2, 3]); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, B.y1); ctx.lineTo(x, y); ctx.lineTo(B.x0, y); ctx.stroke(); ctx.restore();
      w2Dot(ctx, x, y, 7, css("--text")); w2Dot(ctx, x, y, 3.5, css("--card"));
      w2Font(ctx, 11.5, true);
      const right = x < (B.x0 + B.x1) * 0.6;
      w2Tag(ctx, `n = ${groupDigits(np)} → erő ${pct(pv, 1)}`, x + (right ? 12 : -12), y + (pv > 0.85 ? 16 : -14), css("--text"), right ? "left" : "right", B.x0, B.x1);
    };
    /* húzás a vásznon: a tervezett n */
    let drag = false;
    const setFromX = e => {
      if (!req.n) return;
      const r = cv.c.getBoundingClientRect(), B = box(), xx = e.clientX - r.left;
      plan[mode] = w2Clamp(Math.round((xx - B.x0) / (B.x1 - B.x0) * xmax), 2, xmax); upd();
    };
    cv.c.addEventListener("pointerdown", e => { drag = true; try { cv.c.setPointerCapture(e.pointerId); } catch (_) { } setFromX(e); });
    cv.c.addEventListener("pointermove", e => drag && setFromX(e));
    ["pointerup", "pointercancel"].forEach(t => cv.c.addEventListener(t, () => (drag = false)));
    upd();
  };
