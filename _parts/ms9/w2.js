  /* ==================================================================
     w2: rank-test (9.6-c), ecdf-ks (9.7-b), benford (9.8-b)
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
  const w2Hline = (ctx, x0, x1, y, color, dash = true, lw = 2) => {
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = lw; if (dash) ctx.setLineDash([6, 5]);
    ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); ctx.restore();
  };
  const w2Seg = (ctx, xa, ya, xb, yb, color, lw = 2, dash) => {
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = lw; if (dash) ctx.setLineDash(dash);
    ctx.beginPath(); ctx.moveTo(xa, ya); ctx.lineTo(xb, yb); ctx.stroke(); ctx.restore();
  };
  /* döntés 5%-on */
  const w2Verdict = rej => (rej ? `<b style="color:var(--bad)">H₀-t elvetjük</b>` : `<span style="color:var(--ok);font-weight:600">nem vetjük el</span>`);
  /* kis kártya címmel (a két oszlopos kijelzőhöz) */
  const w2Card = (title, ...kids) => h("div", { style: "border:1px solid var(--border);border-radius:10px;padding:.5rem .6rem .6rem;background:var(--card);min-width:0" },
    h("div", { style: "font-weight:700;font-size:.95rem", html: title }), ...kids);
  const w2Grid = (...kids) => h("div", { style: "display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:.6rem;margin-top:.6rem" }, ...kids);
  const w2Warn = () => h("p", { style: "font-size:.88rem;margin:.5rem 0 0;color:var(--bad);font-weight:600;display:none" });
  /* binomiális együttható lebegőpontosan (kis n-re pontos) */
  const w2Choose = (n, k) => { let c = 1; for (let i = 1; i <= k; i++) c = c * (n - k + i) / i; return Math.round(c); };

  /* ------------------------------------------------------------------
     9.6-c  Rangpróba vagy t-próba? – egy kiugró érték hatása
     ------------------------------------------------------------------ */
  /* t-próbák és Mann–Whitney-féle U-próba két mintára */
  function w2RankCalc(A, B, exact = true) {
    const nA = A.length, nB = B.length, N = nA + nB, all = A.concat(B), r = ranks(all);
    const mA = mean(A), mB = mean(B), sA = sd(A), sB = sd(B);
    const df = N - 2, sp2 = ((nA - 1) * sA * sA + (nB - 1) * sB * sB) / df;
    const t = (mA - mB) / Math.sqrt(sp2 * (1 / nA + 1 / nB)), p = Math.min(1, 2 * S.t.cdf(-Math.abs(t), df));
    const uA = sA * sA / nA, uB = sB * sB / nB, tW = (mA - mB) / Math.sqrt(uA + uB);
    const dfW = (uA + uB) ** 2 / (uA * uA / (nA - 1) + uB * uB / (nB - 1)), pW = Math.min(1, 2 * S.t.cdf(-Math.abs(tW), dfW));
    const RA = sum(r.slice(0, nA)), U = RA - nA * (nA + 1) / 2, mu = nA * nB / 2;
    const cnt = new Map(); all.forEach(v => cnt.set(v, (cnt.get(v) || 0) + 1));
    let tsum = 0; cnt.forEach(c => (tsum += c ** 3 - c));
    const varU = nA * nB / 12 * ((N + 1) - tsum / (N * (N - 1)));
    const z = varU > 0 ? Math.max(0, Math.abs(U - mu) - 0.5) / Math.sqrt(varU) : 0;
    const pMW = Math.min(1, 2 * (1 - S.normal.cdf(z)));
    let pEx = NaN;
    if (exact) { // pontos permutációs eloszlás a (kétszerezett, így egész) rangösszegre, dinamikus programozással
      const r2 = r.map(x => Math.round(2 * x)), M = sum(r2);
      const dp = Array.from({ length: nA + 1 }, () => new Float64Array(M + 1)); dp[0][0] = 1;
      r2.forEach((v, i) => { for (let k = Math.min(i + 1, nA); k >= 1; k--) for (let s = M; s >= v; s--) dp[k][s] += dp[k - 1][s - v]; });
      const c2 = nA * (N + 1), dev = Math.abs(Math.round(2 * RA) - c2);
      let hit = 0; for (let s = 0; s <= M; s++) if (Math.abs(s - c2) >= dev) hit += dp[nA][s];
      pEx = Math.min(1, hit / w2Choose(N, nA));
    }
    return { r, mA, mB, sA, sB, t, df, p, tW, dfW, pW, RA, U, ps: U / (nA * nB), z, pMW, pEx, ties: tsum > 0 };
  }

  W["rank-test"] = root => {
    header(root, "Rangpróba vagy t-próba? – egy kiugró érték hatása",
      w2R`Két csoport, $n_A = n_B = 8$ mérés. Minden pont fölött a <b>rangja</b> a 16 adat között (kötésnél átlagrang). Told el a csúszkával az A csoport legnagyobb értékét – vagy húzd a pontokat! Mindkét próba kétoldali, $\alpha = 5\%$.`);
    const A0 = [72, 75, 78, 80, 81, 83, 85, 90], B0 = [65, 68, 70, 72, 74, 76, 79, 82];
    let A = A0.slice(), B = B0.slice(), res = null, drag = null;
    const VMIN = 55, VMAX = 200, MID = 101, TOP = 205;
    const iMaxA = () => A.reduce((k, v, i) => (v > A[k] ? i : k), 0);
    const rS = sliderRow("az A csoport legnagyobb értéke:", 90, VMAX, 1, 90, String, v => { A[iMaxA()] = v; upd(); });
    const setMax = v => { A = A0.slice(); A[7] = v; upd(); };
    root.append(w2Ctl(rS.wrap), w2Ctl(btn("eredeti adatok", () => { A = A0.slice(); B = B0.slice(); upd(); }), btn("kiugró: 150", () => setMax(150)), btn("kiugró: 200", () => setMax(200))));
    const cv = tallCanvas(root, () => 212);
    cv.c.style.touchAction = "pan-y"; cv.c.style.cursor = "grab";
    root.append(keyRow([["A csoport", "--setA", "box"], ["B csoport", "--setB", "box"], ["a csúszkával mozgatott érték", "--text", "line"]]));
    const ro = h("div", { class: "readout", style: "overflow-x:auto" }); root.append(ro);
    const sT = h("div", { class: "stat-row" }), sW = h("p", { style: "font-size:.88rem;margin:.45rem 0 0" });
    const sM = h("div", { class: "stat-row" }), sM2 = h("p", { style: "font-size:.88rem;margin:.45rem 0 0" });
    root.append(w2Grid(w2Card("t-próba (közös szórással)", sT, sW), w2Card("Mann–Whitney-féle U-próba", sM, sM2)));
    const setT = w2Stats(sT, ["$\\bar x_A$", "$\\bar x_B$", "$t$ ($df = 14$)", "p"]);
    const setM = w2Stats(sM, ["$R_A$ (A rangösszege)", "$U_A = R_A - 36$", "$U_A / (n_A n_B)$", "p (közelítés)"]);
    root.append(h("p", { style: "font-weight:700;margin:1rem 0 .2rem" }, "A p-értékek a legnagyobb A-érték függvényében"));
    const cv2 = tallCanvas(root, w => (w < 560 ? 200 : 210));
    root.append(keyRow([["t-próba (közös szórással)", "--setC", "line"], ["Welch-próba", "--setC", "dash"], ["Mann–Whitney (közelítés)", "--accent", "line"], ["α = 0,05", "--bad", "dash"]]));
    root.append(w2Note("A kiugró érték felfújja a szórást, a t-próba elveszíti a különbséget; a rangpróba csak azt látja, hogy ez az érték a legnagyobb – ami eddig is igaz volt."));

    function upd() {
      res = w2RankCalc(A, B);
      const mx = A[iMaxA()];
      rS.input.value = w2Clamp(mx, 90, VMAX); rS.out.textContent = String(mx);
      const rk = v => w2Num(v, 1);
      const list = (xs, off) => xs.map((v, i) => [v, res.r[off + i]]).sort((a, b) => a[0] - b[0]).map(([v, r]) => `${v} <span style="color:var(--muted)">(${rk(r)})</span>`).join(", ");
      ro.innerHTML = `<b>A</b>: ${list(A, 0)}<br><b>B</b>: ${list(B, 8)}<br><span style="color:var(--muted)">zárójelben a rang; a rangok összege 1 + 2 + … + 16 = 136</span>`;
      setT([w2F(res.mA, 2), w2F(res.mB, 2), w2F(res.t, 2), w2P(res.p)]);
      sW.innerHTML = `5%-on: ${w2Verdict(res.p < 0.05)} · s<sub>A</sub> = ${w2F(res.sA, 2)}, s<sub>B</sub> = ${w2F(res.sB, 2)}<br>`
        + `Welch: t = ${w2F(res.tW, 2)}, df = ${w2Num(res.dfW, 1)}, p = ${w2P(res.pW)} → ${w2Verdict(res.pW < 0.05)}`;
      setM([w2Num(res.RA, 1), w2Num(res.U, 1), w2Num(res.ps, 3), w2P(res.pMW)]);
      sM2.innerHTML = `5%-on: ${w2Verdict(res.pMW < 0.05)} · z = ${w2F(res.z, 2)} (kötés- és folytonossági korrekcióval)<br>`
        + `pontos (permutációs) p = ${w2P(res.pEx)}${res.ties ? " – a kötéseket is figyelembe véve" : ""}<br>`
        + `<span style="color:var(--muted)">U/(n<sub>A</sub>n<sub>B</sub>): ennyi a becsült esélye, hogy egy véletlen A-érték nagyobb egy véletlen B-nél (valószínűségi fölény).</span>`;
      cv.draw(); cv2.draw();
    }

    /* tört skála: [55, 101] a szélesség 80%-án, utána szakadás, majd [101, 205] összenyomva */
    const geo = () => {
      const x0 = 24, x1 = cv.w - 12, xb = x0 + 0.8 * (x1 - x0), gap = 12;
      const X = v => (v <= MID ? x0 + (v - VMIN) / (MID - VMIN) * (xb - x0) : xb + gap + (v - MID) / (TOP - MID) * (x1 - xb - gap));
      const inv = px => (px < xb + gap / 2 ? VMIN + (px - x0) / (xb - x0) * (MID - VMIN) : MID + (px - xb - gap) / (x1 - xb - gap) * (TOP - MID));
      return { x0, x1, xb, gap, X, inv, yA: 60, yB: 118, axY: 138 };
    };
    cv.draw = () => {
      const ctx = cv.ctx, w = cv.w, narrow = w < 560, G = geo(), { X } = G;
      ctx.clearRect(0, 0, w, cv.h);
      // tengely szakadással
      const cm = css("--muted");
      w2Seg(ctx, G.x0, G.axY, G.xb, G.axY, cm, 1); w2Seg(ctx, G.xb + G.gap, G.axY, G.x1, G.axY, cm, 1);
      [G.xb, G.xb + G.gap].forEach(x => w2Seg(ctx, x - 3, G.axY + 5, x + 3, G.axY - 5, cm, 1.2));
      ctx.fillStyle = cm; w2Font(ctx, 10.5); ctx.textBaseline = "top";
      const tk = (narrow ? [60, 70, 80, 90, 100] : [60, 65, 70, 75, 80, 85, 90, 95, 100]).concat([150, 200]);
      tk.forEach(v => { w2Seg(ctx, X(v), G.axY, X(v), G.axY + 4, cm, 1); w2TextIn(ctx, String(v), X(v), G.axY + 6, 0, w); });
      // pontok és rangok
      const im = iMaxA(), rad = narrow ? 5 : 6;
      [[A, 0, G.yA, "--setA", "A"], [B, 8, G.yB, "--setB", "B"]].forEach(([xs, off, y, c, name]) => {
        const col = css(c);
        ctx.fillStyle = col; w2Font(ctx, 13, true); ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(name, 4, y);
        ctx.save(); ctx.globalAlpha = 0.25; w2Seg(ctx, G.x0, y, G.x1, y, col, 1); ctx.restore();
        xs.forEach((v, i) => {
          ctx.save(); ctx.globalAlpha = 0.85; w2Dot(ctx, X(v), y, rad, col); ctx.restore();
          if (off === 0 && i === im) { ctx.save(); ctx.strokeStyle = css("--text"); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(X(v), y, rad + 3, 0, 2 * Math.PI); ctx.stroke(); ctx.restore(); }
        });
        // rangfeliratok: legfeljebb 3 szintre, hogy ne takarják egymást
        w2Font(ctx, narrow ? 10 : 11, true); ctx.textBaseline = "bottom";
        const ends = [-1e9, -1e9, -1e9];
        xs.map((v, i) => [X(v), res.r[off + i]]).sort((a, b) => a[0] - b[0]).forEach(([x, r]) => {
          const s = w2Num(r, 1), tw = ctx.measureText(s).width, L = x - tw / 2;
          let lv = ends.findIndex(e => L > e + 2); if (lv < 0) lv = ends.indexOf(Math.min(...ends));
          ends[lv] = L + tw;
          ctx.fillStyle = css("--text"); ctx.textAlign = "left"; ctx.fillText(s, L, y - rad - 2 - lv * 12);
        });
      });
      // rangsor-sáv
      const N = 16, sy = 172, bw = (G.x1 - G.x0) / N;
      ctx.fillStyle = cm; w2Font(ctx, 11); ctx.textAlign = "left"; ctx.textBaseline = "bottom";
      ctx.fillText("rangsor (balról a legkisebb):", G.x0, sy - 3);
      const ord = A.map((v, i) => [v, 0, res.r[i]]).concat(B.map((v, i) => [v, 1, res.r[8 + i]])).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
      w2Font(ctx, narrow ? 9.5 : 11, true); ctx.textBaseline = "middle";
      ord.forEach(([v, g, r], k) => {
        const x = G.x0 + k * bw, col = css(g ? "--setB" : "--setA");
        ctx.save(); ctx.globalAlpha = 0.22; ctx.fillStyle = col; ctx.fillRect(x + 1, sy, bw - 2, 24); ctx.restore();
        ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 1.5; ctx.strokeRect(x + 1, sy, bw - 2, 24); ctx.restore();
        ctx.fillStyle = css("--text"); w2TextIn(ctx, w2Num(r, 1), x + bw / 2, sy + 12, x + 1, x + bw - 1);
      });
      ctx.fillStyle = cm; w2Font(ctx, 10.5); ctx.textBaseline = "top"; ctx.textAlign = "left";
      ctx.fillText(`az A csoport rangösszege: ${w2Num(res.RA, 1)}`, G.x0, sy + 27);
    };
    /* a p-értékek a legnagyobb A-érték függvényében (a többi adat rögzített) */
    cv2.draw = () => {
      const ctx = cv2.ctx, w = cv2.w, H = cv2.h, narrow = w < 560, im = iMaxA();
      ctx.clearRect(0, 0, w, H);
      const pts = [];
      for (let v = 90; v <= VMAX; v++) { const a = A.slice(); a[im] = v; const q = w2RankCalc(a, B, false); pts.push([v, q.p, q.pW, q.pMW]); }
      const top = Math.max(...pts.map(q => Math.max(q[1], q[2], q[3])));
      const ymax = Math.min(1, Math.ceil((top * 1.1) / 0.05) * 0.05 || 0.1);
      const box = { x0: 44, y0: 14, x1: w - 14, y1: H - 34 };
      const { tx, ty } = w2Axes(ctx, box, { xmin: 90, xmax: VMAX, ymin: 0, ymax, yticks: rangeTicks(0, ymax, 5).filter(v => v <= ymax + 1e-9), yfmt: v => w2Num(v, 2),
        xticks: narrow ? [90, 120, 150, 180, 200] : [90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200], xlabel: "az A csoport legnagyobb értéke" });
      ctx.fillStyle = css("--muted"); w2Font(ctx, 11); ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText("p", 6, 0);
      w2Hline(ctx, box.x0, box.x1, ty(0.05), css("--bad"), true, 1.5);
      const line = (k, c, dash) => {
        ctx.save(); ctx.strokeStyle = css(c); ctx.lineWidth = 2.4; if (dash) ctx.setLineDash([7, 5]); ctx.beginPath();
        pts.forEach((q, i) => (i ? ctx.lineTo(tx(q[0]), ty(q[k])) : ctx.moveTo(tx(q[0]), ty(q[k])))); ctx.stroke(); ctx.restore();
      };
      line(1, "--setC"); line(2, "--setC", true); line(3, "--accent");
      const mx = A[im];
      if (mx >= 90) {
        const x = tx(mx); vline(ctx, x, box.y0, box.y1, css("--text"), true);
        w2Dot(ctx, x, ty(res.p), 4.5, css("--setC")); w2Dot(ctx, x, ty(res.pMW), 4.5, css("--accent"));
        w2Font(ctx, 11, true);
        const right = x < (box.x0 + box.x1) * 0.62, xl = x + (right ? 8 : -8), al = right ? "left" : "right";
        // a felső érték címkéje fölé, az alsóé alá kerül; egymást és a tengelyt nem takarhatják
        const yt = ty(res.p), ym = ty(res.pMW), tUp = yt <= ym;
        let yLo = Math.min(box.y1 - 8, Math.max(yt, ym) + 11), yHi = Math.min(yt, ym) - 11;
        if (yLo - yHi < 15) yHi = yLo - 15;
        w2Tag(ctx, "t: p = " + w2P(res.p), xl, tUp ? yHi : yLo, css("--setC"), al, box.x0, box.x1);
        w2Tag(ctx, "MW: p = " + w2P(res.pMW), xl, tUp ? yLo : yHi, css("--accent"), al, box.x0, box.x1);
      }
      ctx.fillStyle = css("--bad"); w2Font(ctx, 10.5, true);
      w2Tag(ctx, "α = 0,05", box.x1 - 2, ty(0.05) - 9, css("--bad"), "right");
    };
    /* pontok húzása (egér és érintés) */
    const pos = e => { const r = cv.c.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    cv.c.addEventListener("pointerdown", e => {
      const [x, y] = pos(e), G = geo();
      let best = null, bd = 18;
      [[A, G.yA, "A"], [B, G.yB, "B"]].forEach(([xs, yy, g]) => xs.forEach((v, i) => { const d = Math.hypot(G.X(v) - x, yy - y); if (d < bd) { bd = d; best = [g, i]; } }));
      if (!best) return;
      drag = best; cv.c.style.cursor = "grabbing";
      try { cv.c.setPointerCapture(e.pointerId); } catch (_) { }
      e.preventDefault();
    });
    cv.c.addEventListener("pointermove", e => {
      if (!drag) return;
      const v = w2Clamp(Math.round(geo().inv(pos(e)[0])), VMIN, VMAX), arr = drag[0] === "A" ? A : B;
      if (arr[drag[1]] !== v) { arr[drag[1]] = v; upd(); }
    });
    ["pointerup", "pointercancel"].forEach(t => cv.c.addEventListener(t, () => { drag = null; cv.c.style.cursor = "grab"; }));
    upd();
  };

  /* ------------------------------------------------------------------
     9.7-b  Empirikus eloszlásfüggvény és a Kolmogorov–Szmirnov-távolság
     ------------------------------------------------------------------ */
  /* egymintás D: mindkét oldali eltérés az ugrásoknál (kötésekre is) */
  function w2Ks1(x, F) {
    const s = sorted(x), n = s.length; let D = -1, at = null;
    for (let i = 0; i < n;) {
      let j = i; while (j + 1 < n && s[j + 1] === s[i]) j++;
      const Fx = F(s[i]), lo = i / n, hi = (j + 1) / n;
      if (hi - Fx > D) { D = hi - Fx; at = { x: s[i], a: Fx, b: hi }; }
      if (Fx - lo > D) { D = Fx - lo; at = { x: s[i], a: Fx, b: lo }; }
      i = j + 1;
    }
    return { D, at, s };
  }
  /* kétmintás D a két lépcsős függvény között */
  function w2Ks2(a, b) {
    const sa = sorted(a), sb = sorted(b), u = sorted([...new Set(a.concat(b))]);
    let i = 0, j = 0, D = -1, at = null;
    for (const v of u) {
      while (i < sa.length && sa[i] <= v) i++;
      while (j < sb.length && sb[j] <= v) j++;
      const d = Math.abs(i / sa.length - j / sb.length);
      if (d > D + 1e-12) { D = d; at = { x: v, a: i / sa.length, b: j / sb.length }; }
    }
    return { D, at };
  }
  /* kétmintás pontos P(D ≥ d) H0 mellett (rácsutak száma, kötés nélküli képlet) */
  function w2Ks2Tail(n, m, d) {
    const row = new Float64Array(m + 1), ok = (i, j) => Math.abs(i / n - j / m) < d - 1e-9;
    for (let i = 0; i <= n; i++) for (let j = 0; j <= m; j++) {
      if (!ok(i, j)) { row[j] = 0; continue; }
      if (i === 0 && j === 0) row[j] = 1;
      else row[j] = (i > 0 ? row[j] : 0) + (j > 0 ? row[j - 1] : 0);
    }
    return w2Clamp(1 - row[m] / w2Choose(n + m, n), 0, 1);
  }
  /* kétmintás kritikus érték 5%-on: a legnagyobb lehetséges D-érték, amelynél P(D > c) ≤ 0,05 még nem teljesül → elvetés, ha D > c */
  function w2Ks2Crit(n, m) {
    const c = new Set(); for (let i = 0; i <= n; i++) for (let j = 0; j <= m; j++) c.add(Math.round(Math.abs(i / n - j / m) * 1e9) / 1e9);
    const cs = [...c].sort((x, y) => x - y);
    for (let k = 1; k < cs.length; k++) if (w2Ks2Tail(n, m, cs[k]) <= 0.05) return cs[k - 1];
    return 1;
  }
  /* aszimptotikus Kolmogorov-féle p (Stephens-korrekcióval) */
  const w2KsQ = (D, n) => {
    const sn = Math.sqrt(n), lam = (sn + 0.12 + 0.11 / sn) * D;
    if (lam < 0.2) return 1;
    let s = 0; for (let k = 1; k <= 100; k++) s += (k % 2 ? 1 : -1) * Math.exp(-2 * k * k * lam * lam);
    return w2Clamp(2 * s, 0, 1);
  };
  const W2_KSCRIT = { 4: 0.624, 5: 0.563, 10: 0.409, 20: 0.294, 25: 0.264, 50: 0.188 };

  W["ecdf-ks"] = root => {
    header(root, "Empirikus eloszlásfüggvény és a Kolmogorov–Szmirnov-távolság",
      w2R`Az empirikus eloszlásfüggvény $F_n(x)$ a minta $x$-nél nem nagyobb elemeinek aránya: minden adatnál $1/n$-nel ugrik. A próbastatisztika a legnagyobb függőleges eltérés: $D = \sup_x |F_n(x) - F(x)|$ – az ugrás mindkét oldalát meg kell nézni.`);
    const BAGS = [488, 497, 499, 500];
    const GA = [72, 75, 78, 80, 81, 83, 85, 90], GB = [65, 68, 70, 72, 74, 76, 79, 82];
    const DISTS = { norm: "normális", exp: "exponenciális", unif: "egyenletes" };
    const SEED0 = 97, M0 = 500, S0 = 10;
    let mode = "one", src = "bags", n = 25, dist = "norm", mu = M0, sig = S0, seed = SEED0, sample = BAGS, crit2 = null;
    const mSeg = segmented([["one", "egymintás: adat vs. N(μ, σ)"], ["two", "kétmintás: A vs. B"]], mode, v => { mode = v; upd(); });
    const sSeg = segmented([["bags", "4 zacskó"], ["rand", "véletlen minta"]], src, v => { src = v; regen(); });
    const nSeg = segmented([10, 25, 100].map(v => [v, "n = " + v]), n, v => { n = +v; regen(); });
    const dSeg = segmented(Object.entries(DISTS), dist, v => { dist = v; regen(); });
    const muB = numBox(mu, { min: -1e6, max: 1e6, step: 1 }, v => { mu = v; upd(); });
    const sgB = numBox(sig, { min: 0.01, max: 1e6, step: 0.5, width: "4.6rem" }, v => { sig = v; upd(); });
    const gRand = h("div", null, w2Ctl(w2Lab("n:"), nSeg.el, w2Lab("eloszlás:"), dSeg.el, btn("Új minta", () => { seed++; regen(); })),
      w2Note(w2R`A minta várható értéke 500, szórása 10, eloszlása a választott – a próba azt vizsgálja, lebukik-e a nem normális alak.`));
    const gOne = h("div", null, w2Ctl(w2Lab("adatok:"), sSeg.el), gRand,
      w2Ctl(w2Lab(w2R`elméleti eloszlás: N(μ, σ),`), h("label", null, "μ =", muB), h("label", null, "σ =", sgB)));
    const gTwo = w2Note("A két csoport adatai a rangpróbás szemléltetésből: A = 72, 75, 78, 80, 81, 83, 85, 90; B = 65, 68, 70, 72, 74, 76, 79, 82.");
    root.append(w2Ctl(mSeg.el), gOne, gTwo);
    const cv = tallCanvas(root, w => (w < 560 ? 260 : 300));
    const key = h("div"); root.append(key);
    const sEl = h("div", { class: "stat-row" }); root.append(sEl);
    const setS = w2Stats(sEl, ["$n$", "$D$", "kritikus érték (5%)", "p", "döntés"]);
    const ro = h("div", { class: "readout", style: "overflow-x:auto" }); root.append(ro);
    const note = w2Note(""); root.append(note);

    function regen() {
      if (src === "bags") sample = BAGS;
      else {
        const rnd = S.mulberry32(seed * 1000 + n + (dist === "exp" ? 1 : dist === "unif" ? 2 : 0));
        sample = Array.from({ length: n }, () => dist === "norm" ? M0 + S0 * S.rnorm(rnd)
          : dist === "exp" ? M0 - S0 + S.rexp(rnd, S0) : M0 + S0 * Math.sqrt(3) * (2 * rnd() - 1));
      }
      upd();
    }
    let K = null;
    function upd() {
      gOne.style.display = mode === "one" ? "" : "none"; gTwo.style.display = mode === "two" ? "" : "none";
      gRand.style.display = src === "rand" ? "" : "none";
      if (mode === "one") {
        const F = x => S.normal.cdf(x, mu, sig), r = w2Ks1(sample, F), nn = sample.length;
        const tab = W2_KSCRIT[nn], c = tab || 1.358 / Math.sqrt(nn), p = w2KsQ(r.D, nn), rej = r.D > c;
        K = { one: true, ...r, F, n: nn };
        setS.label(0, "$n$"); setS.label(3, "p (közelítés)");
        setS([String(nn), w2Num(r.D, 3), (tab ? "" : "≈ ") + w2Num(c, 3), w2P(p), w2Verdict(rej)]);
        const at = r.at, x = nn <= 25 && Number.isInteger(at.x) ? String(at.x) : w2F(at.x, 1);
        w2Math(ro, `A legnagyobb eltérés az $x = ${x.replace(",", "{,}")}$ adatnál, az ugrás ${at.b > at.a ? "utáni" : "előtti"} oldalon: $F_n = ${texNum(at.b, 3)}$, $F = ${texNum(at.a, 3)}$, tehát $D = ${texNum(r.D, 3)}$.`
          + `<br>Elvetjük, ha $D$ nagyobb a kritikus értéknél. A p-érték a $Q(\\lambda) = 2\\sum_{k\\ge1}(-1)^{k-1}e^{-2k^2\\lambda^2}$, $\\lambda = (\\sqrt n + 0{,}12 + 0{,}11/\\sqrt n)\\,D$ közelítésből jön.`
          + (tab ? "" : " A kritikus érték itt az $1{,}358/\\sqrt n$ közelítés."));
        w2Math(note, "Ha $\\mu$-t és $\\sigma$-t a mintából becsülöd, a kritikus értékek kisebbek (Lilliefors-próba) – ez a szemléltetés ismert paraméterekkel számol.");
        key.replaceChildren(keyRow([["empirikus $F_n$", "--setA", "line"], ["elméleti $F$ – $N(\\mu, \\sigma)$", "--setB", "line"], ["a legnagyobb eltérés: $D$", "--bad", "line"]]));
      } else {
        const r = w2Ks2(GA, GB);
        if (crit2 === null) crit2 = w2Ks2Crit(8, 8);
        const p = w2Ks2Tail(8, 8, r.D), rej = r.D > crit2 + 1e-9;
        const mw = w2RankCalc(GA, GB, false);
        K = { one: false, ...r };
        setS.label(0, "$n_A = n_B$"); setS.label(3, "p (pontos)");
        setS(["8", w2Num(r.D, 3), w2Num(crit2, 3), w2P(p), w2Verdict(rej)]);
        w2Math(ro, `A legnagyobb eltérés az $x = ${r.at.x}$ értéknél: $F_A = ${texNum(r.at.a, 3)}$, $F_B = ${texNum(r.at.b, 3)}$, $D = ${texNum(r.D, 3)}$.`
          + `<br>Mivel $D$ csak $1/8$-os lépésekben változhat, „$D \\gt ${texNum(crit2, 3)}$” ugyanaz, mint „$D \\ge ${texNum(crit2 + 0.125, 3)}$”.`);
        w2Math(note, `Ugyanerre az adatra a Mann–Whitney-próba p-értéke ${w2P(mw.pMW)} – ott elvetjük $H_0$-t. A KS a helyeltolódásra kevésbé érzékeny, mint a Mann–Whitney: az eloszlásfüggvények bármilyen eltérését figyeli, ezért egy tisztán eltolt csoportnál gyengébb.`);
        key.replaceChildren(keyRow([["A csoport: $F_A$", "--setA", "line"], ["B csoport: $F_B$", "--setB", "line"], ["a legnagyobb eltérés: $D$", "--bad", "line"]]));
      }
      window.Synopsis && Synopsis.renderMath(key);
      cv.draw();
    }
    /* lépcsős függvény rajzolása: zárt pont az ugrás tetején, nyitott az alján */
    function step(ctx, tx, ty, s, xmin, xmax, color, rad) {
      const n = s.length, col = css(color);
      ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2.4;
      let prev = xmin, lev = 0;
      for (let i = 0; i < n;) {
        let j = i; while (j + 1 < n && s[j + 1] === s[i]) j++;
        ctx.beginPath(); ctx.moveTo(tx(prev), ty(lev)); ctx.lineTo(tx(s[i]), ty(lev)); ctx.stroke();
        ctx.save(); ctx.globalAlpha = 0.45; ctx.lineWidth = 1; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(tx(s[i]), ty(lev)); ctx.lineTo(tx(s[i]), ty((j + 1) / n)); ctx.stroke(); ctx.restore();
        if (rad) {
          ctx.save(); ctx.fillStyle = css("--card"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(tx(s[i]), ty(lev), rad, 0, 2 * Math.PI); ctx.fill(); ctx.stroke(); ctx.restore();
          w2Dot(ctx, tx(s[i]), ty((j + 1) / n), rad, col);
        }
        prev = s[i]; lev = (j + 1) / n; i = j + 1;
      }
      ctx.beginPath(); ctx.moveTo(tx(prev), ty(lev)); ctx.lineTo(tx(xmax), ty(lev)); ctx.stroke();
      ctx.restore();
    }
    cv.draw = () => {
      const ctx = cv.ctx, w = cv.w, H = cv.h, narrow = w < 560;
      ctx.clearRect(0, 0, w, H);
      if (!K) return;
      let lo, hi;
      if (K.one) { lo = Math.min(K.s[0], mu - 3 * sig); hi = Math.max(K.s[K.s.length - 1], mu + 3 * sig); }
      else { lo = 60; hi = 95; }
      const pad = (hi - lo) * 0.03; lo -= pad; hi += pad;
      const box = { x0: 40, y0: 12, x1: w - 12, y1: H - 40 };
      const { tx, ty } = w2Axes(ctx, box, { xmin: lo, xmax: hi, ymin: 0, ymax: 1, yticks: [0, 0.25, 0.5, 0.75, 1], yfmt: v => w2Num(v, 2),
        xticks: rangeTicks(lo, hi, narrow ? 5 : 9), xfmt: v => w2Num(v, 1), xlabel: K.one && src === "bags" ? "töltősúly (g)" : "érték" });
      const rug = (xs, c, dy) => { ctx.save(); ctx.strokeStyle = css(c); ctx.globalAlpha = 0.7; ctx.lineWidth = 1.5; xs.forEach(v => { ctx.beginPath(); ctx.moveTo(tx(v), box.y1 - dy); ctx.lineTo(tx(v), box.y1 - dy - 6); ctx.stroke(); }); ctx.restore(); };
      const rad = n => (n <= 25 ? (narrow ? 3 : 3.5) : 0);
      if (K.one) {
        curve(ctx, tx, ty, K.F, lo, hi, css("--setB"), 2.2);
        step(ctx, tx, ty, K.s, lo, hi, "--setA", rad(K.n));
        rug(K.s, "--setA", 1);
      } else {
        step(ctx, tx, ty, sorted(GA), lo, hi, "--setA", rad(8));
        step(ctx, tx, ty, sorted(GB), lo, hi, "--setB", rad(8));
        rug(GA, "--setA", 1); rug(GB, "--setB", 8);
      }
      const at = K.at, x = tx(at.x), ya = ty(at.a), yb = ty(at.b);
      w2Seg(ctx, x, ya, x, yb, css("--bad"), 4.5);
      [ya, yb].forEach(y => w2Seg(ctx, x - 6, y, x + 6, y, css("--bad"), 2));
      w2Font(ctx, 12, true);
      const right = x < (box.x0 + box.x1) * 0.6;
      w2Tag(ctx, "D = " + w2Num(K.D, 3), x + (right ? 10 : -10), (ya + yb) / 2, css("--bad"), right ? "left" : "right", box.x0 + 2, box.x1);
    };
    regen();
  };

  /* ------------------------------------------------------------------
     9.8-b  Benford-törvény: melyik számjeggyel kezdődnek a számok?
     ------------------------------------------------------------------ */
  const W2_BENF = Array.from({ length: 9 }, (_, i) => Math.log10(1 + 1 / (i + 1)));
  /* első értékes számjegy egy (pozitív vagy negatív) számból */
  const w2Lead = x => { const s = Math.abs(x).toExponential(10); return s[0] >= "1" && s[0] <= "9" ? +s[0] : 0; };
  const w2LeadBig = b => +b.toString()[0];

  W["benford"] = root => {
    header(root, "Benford-törvény: melyik számjeggyel kezdődnek a számok?",
      w2R`A Benford-törvény szerint az első számjegy $d$ valószínűsége $P(d) = \log_{10}(1 + 1/d)$: az 1-es a számok kb. 30%-ánál áll elöl, a 9-es csak kb. 4,6%-nál. Illeszkedésvizsgálat: $\chi^2 = \sum (f_i - np_i)^2 / (np_i)$, $df = 8$.`);
    const FAKE = [30, 28, 24, 22, 22, 20, 19, 18, 17];
    const OWN0 = "299792458 6,62607 1,602177 9,10938 1,67262 6,02214 1,380649 8,31446 6,67430 9,80665\n1,256637 8,854188 10973731 5,670374 2,897771 1,660539 0,0072974 137,036 96485,33 101325";
    const SETS = { pow2: "2 hatványai", fib: "Fibonacci-számok", bills: "számlaösszegek", unif: "egyenletes 1–9999", fake: "kitalált számlák", own: "saját adatok" };
    const SEED0 = 98;
    let set = "fake", seed = SEED0, counts = FAKE.slice(), skipped = 0, cache = {};
    const sSeg = segmented(Object.entries(SETS), set, v => { set = v; seed = SEED0; build(); });
    const newB = btn("Új minta", () => { seed++; build(); });
    root.append(w2Ctl(w2Lab("adatok:"), sSeg.el));
    const info = w2Note(""); root.append(info);
    const ta = h("textarea", { rows: 3, spellcheck: "false", "aria-label": "saját adatok",
      style: "width:100%;box-sizing:border-box;font:inherit;font-family:var(--mono);font-size:.88rem;color:var(--text);background:var(--card);border:1px solid var(--border);border-radius:8px;padding:.4rem .5rem;margin-top:.4rem;resize:vertical" });
    ta.value = OWN0;
    ta.addEventListener("input", () => build());
    const gOwn = h("div", null, ta); root.append(gOwn, w2Ctl(newB));
    const cv = tallCanvas(root, w => (w < 560 ? 270 : 290));
    root.append(keyRow([["megfigyelt relatív gyakoriság", "--setA", "box"], ["Benford-féle $P(d)$", "--text", "line"], ["a legnagyobb χ²-hozzájárulás", "--bad", "box"]]),
      w2Note("Az oszlopok alatt: a számjegy ($d$), a tényleges gyakoriság ($f$) és a $\\chi^2$-hozzájárulás $(f_i - np_i)^2/(np_i)$."));
    const sEl = h("div", { class: "stat-row" }); root.append(sEl);
    const setS = w2Stats(sEl, ["$n$", "$\\chi^2$ ($df = 8$)", "p", "kritikus érték (5%)", "döntés"]);
    const warn = w2Warn(); root.append(warn);
    const ro = h("div", { class: "readout", style: "overflow-x:auto" }); root.append(ro);
    root.append(w2Note("Ahol a számok sok nagyságrendet fognak át, és szorzódó hatások alakítják őket, ott a kis kezdő számjegyek gyakoribbak. A kitalált számok gyakran túl egyenletesek."));

    const tally = ds => { const c = new Array(9).fill(0); ds.forEach(d => d >= 1 && d <= 9 && c[d - 1]++); return c; };
    function build() {
      skipped = 0;
      let txt = "";
      if (set === "pow2") {
        if (!cache.pow2) { const ds = []; let b = 1n; for (let k = 1; k <= 1000; k++) { b *= 2n; ds.push(w2LeadBig(b)); } cache.pow2 = tally(ds); }
        counts = cache.pow2; txt = w2R`$2^1, 2^2, \dots, 2^{1000}$ első számjegyei (pontos egész aritmetikával).`;
      } else if (set === "fib") {
        if (!cache.fib) { const ds = []; let a = 1n, b = 1n; for (let k = 1; k <= 1000; k++) { ds.push(w2LeadBig(a)); [a, b] = [b, a + b]; } cache.fib = tally(ds); }
        counts = cache.fib; txt = "Az első 1000 Fibonacci-szám (1, 1, 2, 3, 5, 8, …) első számjegyei.";
      } else if (set === "bills") {
        const r = S.mulberry32(seed); counts = tally(Array.from({ length: 500 }, () => w2Lead(Math.exp(10 + 1.5 * S.rnorm(r)))));
        txt = w2R`500 szimulált számlaösszeg: $\ln X \sim N(10;\ 1{,}5)$, azaz kb. 1 000 és 500 000 Ft között, sok nagyságrenden át.`;
      } else if (set === "unif") {
        const r = S.mulberry32(seed + 5000); counts = tally(Array.from({ length: 500 }, () => w2Lead(1 + Math.floor(9999 * r()))));
        txt = "500 egyenletes véletlen egész 1 és 9999 között – itt minden kezdő számjegy majdnem egyformán gyakori (a 9-es kicsit ritkább).";
      } else if (set === "fake") {
        counts = FAKE.slice(); txt = "Egy könyvelő által „kitalált” 200 számla kezdő számjegyeinek gyakoriságai.";
      } else {
        const ds = [];
        ta.value.split(/[\s;]+/).filter(Boolean).forEach(tok => {
          if (!/^[-+]?(\d+([.,]\d*)?|[.,]\d+)(e[-+]?\d+)?$/i.test(tok)) { skipped++; return; }
          const m = tok.split(/e/i)[0].match(/[1-9]/);
          if (!m) { skipped++; return; }
          ds.push(+m[0]);
        });
        counts = tally(ds);
        txt = "Számok szóközzel vagy sortöréssel elválasztva; tizedesvessző is jó, az első nem nulla számjegy számít. (Ezres tagoláshoz ne használj szóközt.)"
          + (skipped ? ` <b>Kihagyva: ${skipped}</b> (0 vagy nem szám).` : "");
      }
      gOwn.style.display = set === "own" ? "" : "none";
      newB.style.display = set === "bills" || set === "unif" ? "" : "none";
      newB.parentNode.style.display = newB.style.display;
      w2Math(info, txt);
      upd();
    }
    let res = null;
    function upd() {
      const n = sum(counts), e = W2_BENF.map(p => n * p), contr = counts.map((f, i) => (n ? (f - e[i]) ** 2 / e[i] : 0));
      const x2 = sum(contr), p = n ? 1 - S.chi2.cdf(x2, 8) : NaN, crit = S.chi2.inv(0.95, 8);
      res = { n, e, contr, x2, imax: contr.indexOf(Math.max(...contr)) };
      setS([groupDigits(n), n ? w2Num(x2, 2) : "–", n ? w2P(p) : "–", w2Num(crit, 2), n ? w2Verdict(x2 > crit) : "–"]);
      const small = n && e.some(v => v < 5);
      warn.style.display = small || !n ? "" : "none";
      warn.textContent = !n ? "Nincs feldolgozható szám." : `Van 5-nél kisebb várt gyakoriság (a 9-esnél np₉ = ${w2Num(e[8], 2)}) – a χ²-közelítés még nem megbízható.`;
      ro.innerHTML = n ? `várt gyakoriságok (np<sub>i</sub>): ${e.map(v => w2F(v, 1)).join(" | ")}<br>tényleges (f<sub>i</sub>): ${counts.join(" | ")}` : "–";
      cv.draw();
    }
    cv.draw = () => {
      const ctx = cv.ctx, w = cv.w, H = cv.h, narrow = w < 560;
      ctx.clearRect(0, 0, w, H);
      if (!res) return;
      const { n, contr, imax } = res, rel = counts.map(f => (n ? f / n : 0));
      const top = Math.max(0.32, ...rel) * 1.08, ymax = Math.ceil(top * 20) / 20;
      const box = { x0: 42, y0: 14, x1: w - 10, y1: H - 56 };
      const { ty } = w2Axes(ctx, box, { xmin: 0, xmax: 1, ymin: 0, ymax, yticks: rangeTicks(0, ymax, 5).filter(v => v <= ymax + 1e-9), yfmt: v => w2Num(100 * v, 0) + "%" });
      const cw = (box.x1 - box.x0) / 9, bw = Math.min(46, cw * 0.66), xc = i => box.x0 + (i + 0.5) * cw;
      rel.forEach((r, i) => {
        const y = ty(r), hot = n && i === imax;
        ctx.save(); ctx.globalAlpha = 0.7; ctx.fillStyle = css(hot ? "--bad" : "--setA"); ctx.fillRect(xc(i) - bw / 2, y, bw, box.y1 - y); ctx.restore();
        if (!narrow && n) { ctx.fillStyle = css("--muted"); w2Font(ctx, 10.5); ctx.textBaseline = "bottom"; w2TextIn(ctx, w2Num(100 * r, 1) + "%", xc(i), Math.min(y, ty(W2_BENF[i]) - 6) - 2, box.x0, box.x1); }
      });
      // Benford-értékek
      ctx.save(); ctx.strokeStyle = css("--text"); ctx.lineWidth = 2; ctx.beginPath();
      W2_BENF.forEach((p, i) => (i ? ctx.lineTo(xc(i), ty(p)) : ctx.moveTo(xc(i), ty(p)))); ctx.stroke(); ctx.restore();
      W2_BENF.forEach((p, i) => { w2Dot(ctx, xc(i), ty(p), 4.5, css("--text")); w2Dot(ctx, xc(i), ty(p), 2, css("--card")); });
      // a tengely alatt: számjegy, darabszám, hozzájárulás
      ctx.textBaseline = "top";
      ctx.fillStyle = css("--muted"); w2Font(ctx, 10); ctx.textAlign = "right";
      ctx.fillText("d", box.x0 - 6, box.y1 + 4); ctx.fillText("f", box.x0 - 6, box.y1 + 20); ctx.fillText("χ²", box.x0 - 6, box.y1 + 35);
      counts.forEach((f, i) => {
        const hot = n && i === imax;
        ctx.fillStyle = css("--text"); w2Font(ctx, 12.5, true); w2TextIn(ctx, String(i + 1), xc(i), box.y1 + 3, 0, w);
        ctx.fillStyle = css("--muted"); w2Font(ctx, narrow ? 10 : 11); w2TextIn(ctx, groupDigits(f), xc(i), box.y1 + 20, 0, w);
        ctx.fillStyle = css(hot ? "--bad" : "--muted"); w2Font(ctx, narrow ? 10 : 11, hot); w2TextIn(ctx, n ? fmt(contr[i], narrow ? 1 : 2) : "–", xc(i), box.y1 + 35, xc(i) - cw / 2 + 1, xc(i) + cw / 2 - 1);
      });
    };
    build();
  };
