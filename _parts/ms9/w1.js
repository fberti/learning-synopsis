  /* ==================================================================
     w1: chi-square-dice (9.1-b), independence-table (9.3-c),
         fisher-exact (9.4-b)
     ================================================================== */

  /* --- w1 saját segédei --- */
  const w1R = String.raw;
  const w1Minus = s => String(s).replace(/^-/, "−");
  const w1F = (x, d = 1) => w1Minus(fmt(x, d));
  /* előjeles szám: +1,52 / −1,56 / 0,00 */
  const w1Sgn = (x, d = 2) => { const s = w1F(x, d); return /^[0,]+$/.test(s) || s[0] === "−" ? s : "+" + s; };
  /* legfeljebb maxd tizedes, a záró nullák nélkül */
  const w1Num = (x, maxd = 3) => {
    if (!isFinite(x)) return "–";
    let s = fmt(x, maxd);
    if (s.includes(",")) s = s.replace(/0+$/, "").replace(/,$/, "");
    return w1Minus(s);
  };
  const w1Ctl = (...kids) => { kids.forEach(k => k && k.classList && k.classList.contains("controls") && (k.style.margin = "0")); return h("div", { class: "controls" }, ...kids); };
  const w1Lab = t => h("span", { class: "muted", style: "font-size:.92rem" }, t);
  const w1Note = html => h("p", { class: "muted", style: "font-size:.88rem;margin:.6rem 0 0", html });
  const w1Warn = () => h("p", { style: "display:none;font-size:.88rem;margin:.6rem 0 0;padding:.4rem .7rem;border-left:4px solid var(--bad);background:var(--bad-soft);border-radius:6px" });
  function w1Stats(el, labels) {
    statRow(el, labels.map(l => [l, "–"]));
    const vs = [...el.querySelectorAll(".v")];
    return vals => vals.forEach((v, i) => { if (vs[i] && vs[i].innerHTML !== String(v)) { vs[i].innerHTML = v; if (/\$/.test(v)) window.Synopsis && Synopsis.renderMath(vs[i]); } });
  }
  const w1Math = (el, html) => { if (el.dataset.src !== html) { el.dataset.src = html; el.innerHTML = html; window.Synopsis && Synopsis.renderMath(el); } };
  const w1Font = (ctx, px, bold) => { ctx.font = `${bold ? "600 " : ""}${px}px system-ui, sans-serif`; };
  function w1TextIn(ctx, s, x, y, lo, hi) {
    const tw = ctx.measureText(s).width;
    ctx.textAlign = "left";
    ctx.fillText(s, Math.max(lo, Math.min(hi - tw, x - tw / 2)), y);
  }
  function w1Tag(ctx, s, x, y, color, align = "left", lo = -1e9, hi = 1e9) {
    const tw = ctx.measureText(s).width;
    let X = align === "right" ? x - tw : align === "center" ? x - tw / 2 : x;
    X = Math.max(lo, Math.min(hi - tw, X));
    ctx.save(); ctx.globalAlpha = 0.85; ctx.fillStyle = css("--card"); ctx.fillRect(X - 2, y - 7, tw + 4, 14); ctx.restore();
    ctx.fillStyle = color; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(s, X, y);
  }
  function w1Axes(ctx, box, o) {
    const yt = o.yticks || [], ty = v => box.y1 - (v - o.ymin) / (o.ymax - o.ymin) * (box.y1 - box.y0);
    ctx.save(); ctx.strokeStyle = css("--border"); ctx.fillStyle = css("--muted"); ctx.lineWidth = 1; w1Font(ctx, 11);
    ctx.textAlign = "right"; ctx.textBaseline = "middle";
    yt.forEach(v => { const y = ty(v); ctx.beginPath(); ctx.moveTo(box.x0, y); ctx.lineTo(box.x1, y); ctx.stroke(); ctx.fillText((o.yfmt || String)(v), box.x0 - 5, y); });
    ctx.restore();
    return axes(ctx, box, { ...o, yticks: [] });
  }
  const w1Hline = (ctx, x0, x1, y, color, dash = true, lw = 2) => {
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = lw; if (dash) ctx.setLineDash([6, 5]);
    ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); ctx.restore();
  };
  /* p-érték: kb. két értékes jegy, nagyon kicsinél „< 0,000001” */
  const w1P = p => {
    if (!isFinite(p)) return "–";
    if (p >= 0.995) return "1";
    if (p < 1e-6) return "< 0,000001";
    return fmt(p, Math.max(2, Math.min(6, 1 - Math.floor(Math.log10(p * (1 + 1e-9))))));
  };
  const w1PEq = p => { const s = w1P(p); return s[0] === "<" ? "p " + s : "p = " + s; };
  const w1Rate = (k, N, d = 1) => (N ? `${pct(k / N, d)} <span style="font-size:.8em;color:var(--muted)">(${groupDigits(k)} / ${groupDigits(N)})</span>` : "–");
  const w1Verdict = rej => (rej ? `<span style="color:var(--bad)">elvetjük</span>` : `<span style="color:var(--ok)">nem vetjük el</span>`);
  /* χ²-eloszlás felső farka (kivonás nélkül, a farokban is pontos) */
  const w1ChiSf = (x, k) => {
    if (!(x > 0)) return 1;
    const a = k / 2, z = x / 2;
    if (z < a + 1) return 1 - S.gammaP(a, z);
    let b = z + 1 - a, c = 1e300, d = 1 / b, hh = d; // Lentz-lánctört, mint a stat.js-ben
    for (let i = 1; i < 500; i++) {
      const an = -i * (i - a); b += 2;
      d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300;
      c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300;
      d = 1 / d; const del = d * c; hh *= del; if (Math.abs(del - 1) < 1e-15) break;
    }
    return Math.exp(-z + a * Math.log(z) - S.gammaln(a)) * hh;
  };
  /* darabolt futtatás feladatlistával: add(kulcs, m); kötegenként requestAnimationFrame */
  function w1Jobs(root, chunk, run, after) {
    let jobs = [], token = 0;
    const loop = my => {
      if (my !== token) return;
      let budget = chunk;
      while (budget > 0 && jobs.length) { const j = jobs[0], m = Math.min(budget, j.left); run(j.key, m); j.left -= m; budget -= m; if (!j.left) jobs.shift(); }
      after();
      if (jobs.length) requestAnimationFrame(() => loop(my)); else delete root.dataset.busy;
    };
    return {
      add(key, m) { const idle = !jobs.length; jobs.push({ key, left: m }); if (idle) { root.dataset.busy = "1"; loop(token); } },
      cancel() { token++; jobs = []; delete root.dataset.busy; }
    };
  }
  /* log-faktoriálisok (hipergeometrikus valószínűségekhez) és pontos binomiális együttható BigInt-tel */
  const w1LF = [0]; for (let i = 1; i <= 400; i++) w1LF[i] = w1LF[i - 1] + Math.log(i);
  const w1LChoose = (n, k) => (k < 0 || k > n ? -Infinity : w1LF[n] - w1LF[k] - w1LF[n - k]);
  const w1ChooseBig = (n, k) => { if (k < 0 || k > n) return 0n; k = Math.min(k, n - k); let r = 1n; for (let i = 1; i <= k; i++) r = r * BigInt(n - k + i) / BigInt(i); return r; };
  const w1Big = b => groupDigits(b.toString());
  /* táblázatcella / fejléc */
  const w1Th = (txt, extra = "") => h("th", { style: "padding:.3rem .4rem;font-size:.8rem;font-weight:600;color:var(--muted);text-align:center;vertical-align:middle;border:1px solid var(--border);background:var(--bg-soft);" + extra }, txt);
  const w1Td = (extra = "") => h("td", { style: "padding:.3rem .35rem;text-align:center;border:1px solid var(--border);vertical-align:middle;" + extra });
  /* standardizált eltérés → cellaháttér (pozitív: --setA, negatív: --setB) */
  function w1Shade(td, r) {
    const a = Math.min(1, Math.abs(r) / 3), p = Math.abs(r) < 0.05 ? 0 : Math.round(8 + 42 * a), c = r > 0 ? "--setA" : "--setB";
    td.style.background = p ? `color-mix(in srgb, var(${c}) ${p}%, var(--card))` : "var(--card)";
    td.style.boxShadow = Math.abs(r) >= 2 ? `inset 0 0 0 2.5px var(${c})` : "none";
  }
  /* rögzített kezdő értékkel feltöltött numBox, amelynek értéke kívülről is írható */
  const w1Box = (v, max, onChange) => numBox(v, { min: 0, max, step: 1, width: "3.6rem" }, x => onChange(Math.round(x)));

  /* ------------------------------------------------------------------
     9.1-b  Lebukik-e a cinkelt kocka?
     ------------------------------------------------------------------ */
  W["chi-square-dice"] = root => {
    header(root, "Lebukik-e a cinkelt kocka?",
      w1R`A kockán a 6-os valószínűsége $q$, a másik öt lapé egyenként $(1-q)/5$. A próba ezt nem tudja: csak a gyakoriságokat látja, és azt vizsgálja, hogy összeférnek-e a $H_0$: „a kocka szabályos” ($p_i = 1/6$) hipotézissel. $\chi^2 = \sum (f_i - n/6)^2/(n/6)$, $df = 5$, $\alpha = 5\%$.`);
    const SEED0 = 91, CRIT = S.chi2.inv(0.95, 5), NS = [60, 120, 300, 600];
    const qOf = i => (i === 0 ? 1 / 6 : 0.165 + 0.005 * i);
    const qShow = i => (i === 0 ? "1/6 ≈ 0,167" : w1Num(qOf(i), 3));
    let qi = 0, q = 1 / 6, seed = SEED0, rnd, us = [], simN = 60, sims;
    const face = u => (u >= 1 - q ? 5 : Math.min(4, Math.floor(u * 5 / (1 - q))));
    const rq = sliderRow("a 6-os valószínűsége $q =$", 0, 47, 1, 0, qShow, i => setQ(i, false));
    const pSeg = segmented([["0", "szabályos"], ["17", "cinkelt: 0,25"]], "0", v => setQ(+v, true));
    function setQ(i, fromBtn) {
      qi = i; q = qOf(i);
      if (fromBtn) { rq.input.value = i; rq.out.textContent = qShow(i); }
      pSeg.set(i === 0 ? "0" : i === 17 ? "17" : "", false);
      resetSim(); upd(); updSim();
    }
    const roll = m => { for (let i = 0; i < m; i++) us.push(rnd()); upd(); };
    root.append(w1Ctl(rq.wrap), w1Ctl(w1Lab("kocka:"), pSeg.el),
      w1Ctl(btn("+1 dobás", () => roll(1), "btn primary"), btn("+10", () => roll(10)), btn("+60", () => roll(60)),
        btn("Újra", () => { seed++; rnd = S.mulberry32(seed); us = []; upd(); })));
    const cv = tallCanvas(root, w => (w < 560 ? 250 : 260));
    root.append(keyRow([["megfigyelt gyakoriság $f_i$", "--setA", "box"], ["várt gyakoriság $n/6$ (ha $H_0$ igaz)", "--text", "dash"],
      ["az oszlop alatt: $(f_i - n/6)^2/(n/6)$", "--muted", "line"]]));
    const sEl = h("div", { class: "stat-row" }); root.append(sEl);
    const setS = w1Stats(sEl, ["dobások ($n$)", "$\\chi^2$", "$df$", "p-érték", "kritikus érték (5%)", "$H_0$-t"]);
    const warn = w1Warn(); root.append(warn);
    const cvC = tallCanvas(root, w => (w < 560 ? 120 : 110));
    root.append(keyRow([["$\\chi^2_5$-sűrűség", "--text", "line"], ["elutasítási tartomány (5%)", "--bad", "box"], ["megfigyelt $\\chi^2$ és a p-érték területe", "--accent", "box"]]));

    // 2. rész: sok kísérlet
    root.append(h("p", { style: "font-weight:700;margin:1.1rem 0 .2rem" }, "Hányszor buktat le a próba? – 2000 kísérlet"),
      w1Note(w1R`Minden kísérlet $n$ dobás a fenti $q$-val, utána $\chi^2$-próba 5%-on. Szabályos kockánál minden elvetés <b>téves riasztás</b> (arányuk ≈ $\alpha$); cinkeltnél az elvetés helyes, az aránya a próba <b>ereje</b>.`));
    const nSeg = segmented(NS.map(v => [v, String(v)]), simN, v => { simN = +v; updSim(); });
    const Q = w1Jobs(root, 300, (n, m) => { for (let j = 0; j < m; j++) simOne(n); }, updSim);
    root.append(w1Ctl(w1Lab("dobások kísérletenként $n$ ="), nSeg.el),
      w1Ctl(btn("Szimuláld 2000-szer", () => Q.add(simN, 2000), "btn primary"), btn("Mind a 4 n-re", () => NS.forEach(n => Q.add(n, 2000))),
        btn("Ürít", () => { resetSim(); updSim(); })));
    const cv2 = tallCanvas(root, w => (w < 560 ? 220 : 220));
    const s2El = h("div", { class: "stat-row" }); root.append(s2El);
    const setS2 = w1Stats(s2El, ["kísérletek", "elvetések aránya 5%-on"]);
    const meanEl = w1Note(""); root.append(meanEl);
    root.append(w1Note("Kis cinkelést csak sok dobással lehet lebuktatni – a χ²-próba ereje is a mintanagyságon múlik."));

    const counts = () => { const c = [0, 0, 0, 0, 0, 0]; for (const u of us) c[face(u)]++; return c; };
    const chiOf = (c, n) => { const E = n / 6; return c.reduce((s, f) => s + (f - E) ** 2 / E, 0); };
    function resetSim() { Q && Q.cancel(); sims = {}; NS.forEach(n => (sims[n] = { rnd: S.mulberry32(1091 + n), N: 0, k: 0 })); }
    function simOne(n) {
      const st = sims[n], c = [0, 0, 0, 0, 0, 0];
      for (let i = 0; i < n; i++) c[face(st.rnd())]++;
      st.N++; if (chiOf(c, n) > CRIT) st.k++;
    }
    let cur = null;
    function upd() {
      const n = us.length, c = counts(), chi = n ? chiOf(c, n) : NaN, p = n ? w1ChiSf(chi, 5) : NaN;
      cur = { n, c, chi, p };
      setS([groupDigits(n), n ? w1Num(chi, 2) : "–", "5", n ? w1P(p) : "–", w1Num(CRIT, 2), n ? w1Verdict(chi > CRIT) : "–"]);
      warn.style.display = n > 0 && n < 30 ? "" : "none";
      warn.textContent = `A várt gyakoriság (n/6 = ${w1Num(n / 6, 2)}) 5 alatt van – a χ²-közelítés még nem megbízható.`;
      cv.draw(); cvC.draw();
    }
    function updSim() {
      const st = sims[simN];
      setS2([groupDigits(st.N), w1Rate(st.k, st.N)]);
      meanEl.innerHTML = qi === 0 ? "<b>Szabályos kocka:</b> minden elvetés téves riasztás – az aránynak 5% körül kell lennie."
        : `<b>Cinkelt kocka (q = ${w1Num(q, 3)}):</b> minden elvetés helyes döntés – az arány a próba ereje ennél a cinkelésnél és n-nél.`;
      cv2.draw();
    }
    cv.draw = () => {
      const ctx = cv.ctx, w = cv.w, H = cv.h, narrow = w < 560, { n, c } = cur;
      ctx.clearRect(0, 0, w, H);
      const E = n / 6, top = Math.max(5, E * 1.25, ...c.map(f => f * 1.12));
      const yt = rangeTicks(0, top, narrow ? 4 : 5).filter(v => Number.isInteger(v));
      const ymax = Math.max(top, yt[yt.length - 1] || 0);
      const box = { x0: 38, y0: 22, x1: w - 10, y1: H - 50 };
      const { ty } = w1Axes(ctx, box, { xmin: 0, xmax: 6, ymin: 0, ymax, yticks: yt });
      ctx.fillStyle = css("--muted"); w1Font(ctx, 11); ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText("gyakoriság", 4, 0);
      const cw = (box.x1 - box.x0) / 6, bw = Math.min(64, cw * 0.62);
      const con = c.map(f => (n ? (f - E) ** 2 / E : 0)), cmax = Math.max(...con);
      c.forEach((f, i) => {
        const xc = box.x0 + (i + 0.5) * cw, y = ty(f);
        ctx.save(); ctx.globalAlpha = 0.7; ctx.fillStyle = css("--setA"); ctx.fillRect(xc - bw / 2, y, bw, box.y1 - y); ctx.restore();
        w1Font(ctx, 12, true); w1Tag(ctx, String(f), xc, y - 9, css("--text"), "center", box.x0, box.x1);
        ctx.textBaseline = "top"; w1Font(ctx, 13, true); ctx.fillStyle = css("--text"); w1TextIn(ctx, String(i + 1), xc, box.y1 + 5, box.x0, box.x1);
        if (n) {
          const big = con[i] === cmax && cmax > 0;
          ctx.fillStyle = css(big ? "--bad" : "--muted"); w1Font(ctx, narrow ? 10.5 : 11.5, big);
          w1TextIn(ctx, w1Num(con[i], 2), xc, box.y1 + 24, box.x0 - 30, box.x1);
        }
      });
      if (n) {
        const y = ty(E);
        w1Hline(ctx, box.x0, box.x1, y, css("--text"), true, 1.8);
        w1Font(ctx, 11, true); w1Tag(ctx, `várt: ${w1Num(E, 2)}`, box.x1 - 2, y - 9, css("--text"), "right");
      } else { ctx.fillStyle = css("--muted"); w1Font(ctx, 12); w1TextIn(ctx, "Dobj a kockával!", (box.x0 + box.x1) / 2, (box.y0 + box.y1) / 2, box.x0, box.x1); }
      if (!narrow) { ctx.fillStyle = css("--muted"); w1Font(ctx, 10.5); ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText("χ²-hozzájárulás:", 2, box.y1 + 25); }
    };
    cvC.draw = () => {
      const ctx = cvC.ctx, w = cvC.w, H = cvC.h, { n, chi, p } = cur;
      ctx.clearRect(0, 0, w, H);
      const xmax = Math.max(20, Math.min(60, n ? chi * 1.12 : 0)), box = { x0: 12, y0: 26, x1: w - 12, y1: H - 22 };
      const pdf = x => S.chi2.pdf(Math.max(x, 1e-9), 5), ym = 0.17;
      const xt = rangeTicks(0, xmax, w < 560 ? 5 : 10);
      const { tx, ty } = axes(ctx, box, { xmin: 0, xmax, ymin: 0, ymax: ym, xticks: xt, xfmt: v => w1Num(v, 1) });
      const fill = (a, b, col, al) => {
        if (a >= b) return;
        ctx.save(); ctx.globalAlpha = al; ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(tx(a), ty(0));
        for (let i = 0; i <= 120; i++) { const x = a + (b - a) * i / 120; ctx.lineTo(tx(x), ty(pdf(x))); }
        ctx.lineTo(tx(b), ty(0)); ctx.closePath(); ctx.fill(); ctx.restore();
      };
      fill(CRIT, xmax, css("--bad"), 0.18);
      if (n && chi < xmax) fill(chi, xmax, css("--accent"), 0.35);
      curve(ctx, tx, ty, pdf, 0.01, xmax, css("--text"), 1.8);
      vline(ctx, tx(CRIT), box.y0, box.y1, css("--bad"), true);
      w1Font(ctx, 10.5, true); ctx.fillStyle = css("--bad"); ctx.textBaseline = "bottom";
      w1TextIn(ctx, `krit. ${w1Num(CRIT, 2)}`, tx(CRIT), box.y0 - 2, box.x0, box.x1);
      if (n) {
        const X = tx(Math.min(chi, xmax));
        vline(ctx, X, box.y0 - 6, box.y1, css("--accent"), false);
        w1Font(ctx, 11.5, true);
        const lab = `χ² = ${w1Num(chi, 2)}${chi > xmax ? " →" : ""}, ${w1PEq(p)}`;
        const right = X < (box.x0 + box.x1) * 0.55;
        w1Tag(ctx, lab, X + (right ? 6 : -6), 9, css("--accent"), right ? "left" : "right", box.x0, box.x1);
      }
    };
    cv2.draw = () => {
      const ctx = cv2.ctx, w = cv2.w, H = cv2.h, narrow = w < 560;
      ctx.clearRect(0, 0, w, H);
      const box = { x0: 46, y0: 22, x1: w - 10, y1: H - 28 };
      const { ty } = w1Axes(ctx, box, { xmin: 0, xmax: 1, ymin: 0, ymax: 1.1, yticks: [0, 0.25, 0.5, 0.75, 1], yfmt: v => w1Num(100 * v, 0) + "%" });
      ctx.fillStyle = css("--muted"); w1Font(ctx, 11); ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText("elvetések aránya", 4, 0);
      const cw = (box.x1 - box.x0) / NS.length, bw = Math.min(70, cw * 0.5);
      NS.forEach((n, i) => {
        const st = sims[n], xc = box.x0 + (i + 0.5) * cw, sel = n === simN;
        ctx.fillStyle = css(sel ? "--text" : "--muted"); w1Font(ctx, narrow ? 11 : 12, sel); ctx.textBaseline = "top";
        w1TextIn(ctx, `n = ${n}`, xc, box.y1 + 6, box.x0, box.x1);
        if (!st.N) { ctx.fillStyle = css("--muted"); w1Font(ctx, 11); ctx.textBaseline = "bottom"; w1TextIn(ctx, "–", xc, box.y1 - 4, box.x0, box.x1); return; }
        const r = st.k / st.N, y = ty(r);
        ctx.save(); ctx.globalAlpha = sel ? 0.85 : 0.5; ctx.fillStyle = css(qi === 0 ? "--bad" : "--accent"); ctx.fillRect(xc - bw / 2, y, bw, box.y1 - y); ctx.restore();
        ctx.fillStyle = css("--text"); w1Font(ctx, 12.5, true); ctx.textBaseline = "bottom";
        w1TextIn(ctx, pct(r, 1), xc, Math.max(box.y0 + 12, y - 3), box.x0, box.x1);
      });
      const ya = ty(0.05);
      w1Hline(ctx, box.x0, box.x1, ya, css("--bad"), true, 1.5);
      ctx.fillStyle = css("--bad"); w1Font(ctx, 10.5, true); w1Tag(ctx, "α = 5%", box.x1 - 2, ya - 9, css("--bad"), "right");
      if (!NS.some(n => sims[n].N)) { ctx.fillStyle = css("--muted"); w1Font(ctx, 12); w1TextIn(ctx, "Szimuláld 2000-szer!", (box.x0 + box.x1) / 2, (box.y0 + box.y1) / 2, box.x0, box.x1); }
    };
    rnd = S.mulberry32(seed); resetSim();
    us = []; for (let i = 0; i < 60; i++) us.push(rnd());
    upd(); updSim();
  };

  /* ------------------------------------------------------------------
     9.3-c  Függetlenségvizsgálat: hol tér el a tábla?
     ------------------------------------------------------------------ */
  W["independence-table"] = root => {
    header(root, "Függetlenségvizsgálat: hol tér el a tábla?",
      w1R`Írd át a tábla celláit! Minden cellában a tényleges gyakoriság $f$, alatta a függetlenség esetén várt $f^* = \text{sorösszeg}\cdot\text{oszlopösszeg}/N$, és a cella színe a <b>standardizált eltérés</b> $(f - f^*)/\sqrt{f^*}$ szerint. $\chi^2 = \sum (f - f^*)^2/f^*$, folytonossági korrekció nélkül.`);
    const PRE = {
      smoke: { name: "dohányzás × nem", rows: ["férfi", "nő"], cols: ["dohányzik", "nem dohányzik"], M: [[30, 70], [20, 80]] },
      smoke2: { name: "ugyanez kétszer", rows: ["férfi", "nő"], cols: ["dohányzik", "nem dohányzik"], M: [[60, 140], [40, 160]] },
      party: { name: "lakóhely × párt", rows: ["Budapest", "város", "község"], cols: ["A párt", "B párt", "C párt"], M: [[90, 60, 50], [100, 90, 60], [40, 70, 40]] },
      firms: { name: "50 cég", rows: ["textilipar", "élelmiszeripar"], cols: ["volt bírság", "nem volt"], M: [[18, 2], [5, 25]] },
      clinic: { name: "kis klinikai minta", rows: ["új kezelés", "placebo"], cols: ["gyógyult", "nem gyógyult"], M: [[7, 1], [2, 6]] }
    };
    let rows, cols, M, mode = "r", cells, rTot, cTot, gTot;
    const sizeKey = () => `${M.length}x${M[0].length}`;
    const sizeSeg = segmented([["2x2", "2×2"], ["2x3", "2×3"], ["3x3", "3×3"]], "2x2", v => resize(+v[0], +v[2]));
    const preSeg = segmented(Object.entries(PRE).map(([k, p]) => [k, p.name]), "smoke", k => load(k));
    const modeSeg = segmented([["r", "standardizált eltérés"], ["c", "χ²-hozzájárulás"]], mode, v => { mode = v; upd(); });
    const tWrap = h("div", { style: "overflow-x:auto;margin:.6rem 0 .2rem" });
    root.append(w1Ctl(w1Lab("példa:"), preSeg.el), w1Ctl(w1Lab("méret:"), sizeSeg.el, w1Lab("a cellában:"), modeSeg.el), tWrap);
    root.append(keyRow([["felülreprezentált ($f > f^*$)", "--setA", "box"], ["alulreprezentált ($f < f^*$)", "--setB", "box"],
      ["erősebb szín = nagyobb |eltérés|; keretezve, ha ≥ 2", "--muted", "line"]]));
    const sEl = h("div", { class: "stat-row" }); root.append(sEl);
    const setS = w1Stats(sEl, ["$N$", "$\\chi^2$", "$df = (b-1)(c-1)$", "p-érték", "Cramér-féle $V$", "$H_0$-t (5%-on)"]);
    const warn = w1Warn(); root.append(warn);
    const ro = h("div", { class: "readout", style: "overflow-x:auto" }); root.append(ro);
    root.append(w1Note("A χ² csak azt mondja meg, <i>van-e</i> eltérés a függetlenségtől; hogy <i>hol</i>, azt a standardizált eltérések mutatják. "
      + "Ha mindent megkétszerezel, a χ² is kétszeres lesz, a p-érték csökken – a Cramér-féle V (az összefüggés erőssége) viszont nem változik."));

    function load(k) {
      const p = PRE[k]; rows = p.rows.slice(); cols = p.cols.slice(); M = p.M.map(r => r.slice());
      sizeSeg.set(sizeKey(), false); build(); upd();
    }
    function resize(b, c) {
      const old = M;
      M = Array.from({ length: b }, (_, i) => Array.from({ length: c }, (_, j) => (old[i] && old[i][j] != null ? old[i][j] : 10)));
      rows = Array.from({ length: b }, (_, i) => rows[i] || `${i + 1}. sor`);
      cols = Array.from({ length: c }, (_, j) => cols[j] || `${j + 1}. oszlop`);
      matchPreset(); build(); upd();
    }
    function matchPreset() {
      const k = Object.keys(PRE).find(k => JSON.stringify(PRE[k].M) === JSON.stringify(M) && PRE[k].rows.length === rows.length);
      preSeg.set(k || "", false);
    }
    function build() {
      const compact = cols.length >= 3 && root.clientWidth < 480;
      const tb = h("table", { style: `width:auto;margin:0 auto;border-collapse:collapse;font-size:${compact ? ".82rem" : ".9rem"}` });
      const hr = h("tr", null, w1Th(""), ...cols.map(c => w1Th(c)), w1Th(compact ? "Σ" : "összeg"));
      tb.append(hr);
      cells = M.map((row, i) => {
        const tr = h("tr", null, w1Th(rows[i], "text-align:left"));
        const rr = row.map((v, j) => {
          const td = w1Td(compact ? "padding:.25rem .15rem" : "min-width:4.2rem");
          const inp = w1Box(v, 99999, x => { M[i][j] = x; matchPreset(); upd(); });
          if (compact) { inp.style.width = "3.3rem"; inp.style.padding = ".25rem .3rem"; }
          inp.setAttribute("aria-label", `${rows[i]} × ${cols[j]}`);
          const fs = h("div", { style: (compact ? "font-size:.66rem;" : "font-size:.72rem;") + "color:var(--muted);font-family:var(--mono);margin-top:.15rem;white-space:nowrap" });
          const rv = h("div", { style: "font-size:.85rem;font-family:var(--mono);font-weight:600" });
          td.append(inp, fs, rv); tr.append(td);
          return { td, fs, rv };
        });
        const tt = w1Td("font-family:var(--mono);color:var(--muted)"); tr.append(tt); rr.tot = tt;
        tb.append(tr);
        return rr;
      });
      const fr = h("tr", null, w1Th(compact ? "Σ" : "összeg", "text-align:left"));
      cTot = cols.map(() => { const td = w1Td("font-family:var(--mono);color:var(--muted)"); fr.append(td); return td; });
      gTot = w1Td("font-family:var(--mono);font-weight:700"); fr.append(gTot); tb.append(fr);
      rTot = cells.map(r => r.tot);
      tWrap.replaceChildren(tb);
      tWrap.dataset.compact = compact ? "1" : "";
    }
    function upd() {
      const b = M.length, c = M[0].length;
      const R = M.map(r => sum(r)), C = M[0].map((_, j) => sum(M.map(r => r[j]))), N = sum(R);
      R.forEach((v, i) => (rTot[i].textContent = groupDigits(v)));
      C.forEach((v, j) => (cTot[j].textContent = groupDigits(v)));
      gTot.textContent = "N = " + groupDigits(N);
      const ok = N > 0 && R.every(v => v > 0) && C.every(v => v > 0);
      let chi = 0, minE = Infinity, best = null; const parts = [];
      M.forEach((row, i) => row.forEach((f, j) => {
        const el = cells[i][j];
        if (!ok) { el.fs.textContent = "f* = –"; el.rv.textContent = ""; w1Shade(el.td, 0); return; }
        const E = R[i] * C[j] / N, r = (f - E) / Math.sqrt(E), q = (f - E) ** 2 / E;
        chi += q; minE = Math.min(minE, E); parts.push(q);
        if (!best || Math.abs(r) > Math.abs(best.r)) best = { i, j, f, E, r };
        el.fs.textContent = (tWrap.dataset.compact ? "f*=" : "f*\u2009=\u2009") + w1F(E, 2);
        el.rv.textContent = mode === "r" ? w1Sgn(r, 2) : w1F(q, 2);
        el.rv.style.color = Math.abs(r) >= 2 ? "var(--text)" : "var(--muted)";
        w1Shade(el.td, r);
      }));
      const df = (b - 1) * (c - 1);
      if (!ok) {
        setS([groupDigits(N), "–", String(df), "–", "–", "–"]);
        warn.style.display = ""; warn.textContent = "Van üres sor vagy oszlop (az összege 0) – ott a várt gyakoriság 0, így a χ² nem számolható. Írj bele, vagy hagyd el.";
        w1Math(ro, "–"); return;
      }
      const p = w1ChiSf(chi, df), V = Math.sqrt(chi / (N * Math.min(b - 1, c - 1)));
      setS([groupDigits(N), w1Num(chi, 2), String(df), w1P(p), w1Num(V, 3), w1Verdict(p < 0.05)]);
      warn.style.display = minE < 5 ? "" : "none";
      warn.textContent = `Van 5-nél kisebb várt gyakoriság (a legkisebb ${w1Num(minE, 2)}) – a χ²-közelítés itt pontatlan lehet; 2×2-es táblánál használd Fisher egzakt próbáját (9.4).`;
      const sumTxt = parts.map(x => w1F(x, 2)).join(" + ");
      w1Math(ro, `χ² = ${sumTxt} = <b>${w1F(chi, 2)}</b>, df = ${df}, ${w1PEq(p)}<br>`
        + `Legnagyobb eltérés: <b>${rows[best.i]} × ${cols[best.j]}</b>: f = ${best.f}, f* = ${w1F(best.E, 2)}, standardizált eltérés ${w1Sgn(best.r, 2)} `
        + `(${best.r > 0 ? "felülreprezentált" : "alulreprezentált"}${Math.abs(best.r) >= 2 ? ", |érték| ≥ 2" : ""}).`);
    }
    let rzT;
    addEventListener("resize", () => { clearTimeout(rzT); rzT = setTimeout(() => { if ((cols.length >= 3 && root.clientWidth < 480 ? "1" : "") !== tWrap.dataset.compact) { build(); upd(); } }, 200); });
    load("smoke");
  };

  /* ------------------------------------------------------------------
     9.4-b  Fisher egzakt próbája: minden tábla a rögzített peremekkel
     ------------------------------------------------------------------ */
  W["fisher-exact"] = root => {
    header(root, "Fisher egzakt próbája: minden tábla a rögzített peremekkel",
      w1R`Rögzített sor- és oszlopösszegek mellett a 2×2-es táblát egyetlen szám, a bal felső cella $X$ meghatározza. Ha $H_0$ (függetlenség) igaz, $X$ hipergeometrikus: $P(X = k) = \binom{c_1}{k}\binom{N-c_1}{r_1-k}\Big/\binom{N}{r_1}$, ahol $r_1$ az első sor, $c_1$ az első oszlop összege.`);
    const PRE = {
      tea8: { name: "teás hölgy (8 csésze)", rows: ["valóban tej előbb", "valóban tea előbb"], cols: ["hölgy szerint: tej előbb", "hölgy szerint: tea előbb"], M: [[4, 0], [0, 4]] },
      tea6: { name: "6 csésze", rows: ["valóban tej előbb", "valóban tea előbb"], cols: ["hölgy szerint: tej előbb", "hölgy szerint: tea előbb"], M: [[3, 0], [0, 3]] },
      clinic: { name: "kis klinikai minta", rows: ["új kezelés", "placebo"], cols: ["gyógyult", "nem gyógyult"], M: [[7, 1], [2, 6]] }
    };
    let rows, cols, M, sel = null, res = null;
    const preSeg = segmented(Object.entries(PRE).map(([k, p]) => [k, p.name]), "clinic", k => load(k));
    const tWrap = h("div", { style: "overflow-x:auto;margin:.6rem 0 .2rem" });
    root.append(w1Ctl(w1Lab("példa:"), preSeg.el), tWrap);
    const cv = tallCanvas(root, w => (w < 560 ? 250 : 260));
    cv.c.style.cursor = "pointer"; cv.c.style.touchAction = "pan-y"; cv.c.style.marginTop = ".6rem";
    root.append(keyRow([["a kétoldali p-értékbe számító táblák", "--bad", "box"], ["a többi lehetséges tábla", "--setA", "box"], ["a megfigyelt tábla (keretezve)", "--text", "line"]]));
    const ro = h("div", { class: "readout", style: "overflow-x:auto" }); root.append(ro);
    const sEl = h("div", { class: "stat-row" }); root.append(sEl);
    const setS = w1Stats(sEl, ["egyoldali p (Fisher)", "kétoldali p (Fisher)", "$\\chi^2$-próba p (korrekció nélkül)", "$\\chi^2$-próba p (Yates)", "legkisebb $f^*$"]);
    const warn = w1Warn(); root.append(warn);
    const ro2 = h("div", { class: "readout", style: "overflow-x:auto" }); root.append(ro2);
    root.append(w1Note("Fisher próbája nem közelít: a rögzített peremek mellett az összes lehetséges táblát számba veszi – ezért kis mintán is pontos. "
      + "Kétoldali p-érték: azoknak a tábláknak az összvalószínűsége, amelyek legfeljebb olyan valószínűek, mint a megfigyelt (ezt számolja a scipy és az R is). Koppints egy oszlopra a táblájáért!"));

    let boxes;
    function load(k) { const p = PRE[k]; rows = p.rows.slice(); cols = p.cols.slice(); M = p.M.map(r => r.slice()); sel = null; build(); upd(); }
    function matchPreset() { const k = Object.keys(PRE).find(k => JSON.stringify(PRE[k].M) === JSON.stringify(M)); preSeg.set(k || "", false); }
    let tots;
    function build() {
      const tb = h("table", { style: "width:auto;margin:0 auto;border-collapse:collapse;font-size:.9rem" });
      tb.append(h("tr", null, w1Th(""), ...cols.map(c => w1Th(c)), w1Th("összeg")));
      tots = { r: [], c: [] }; boxes = [];
      M.forEach((row, i) => {
        const tr = h("tr", null, w1Th(rows[i], "text-align:left"));
        row.forEach((v, j) => {
          const td = w1Td(i === 0 && j === 0 ? "background:color-mix(in srgb, var(--accent) 12%, var(--card))" : "");
          const inp = w1Box(v, 30, x => { M[i][j] = x; sel = null; matchPreset(); upd(); });
          inp.setAttribute("aria-label", `${rows[i]} × ${cols[j]}`);
          td.append(inp);
          if (i === 0 && j === 0) td.append(h("div", { style: "font-size:.72rem;color:var(--accent);font-weight:600" }, "X = a"));
          tr.append(td); boxes.push(inp);
        });
        const tt = w1Td("font-family:var(--mono);color:var(--muted)"); tr.append(tt); tots.r.push(tt);
        tb.append(tr);
      });
      const fr = h("tr", null, w1Th("összeg", "text-align:left"));
      [0, 1].forEach(() => { const td = w1Td("font-family:var(--mono);color:var(--muted)"); fr.append(td); tots.c.push(td); });
      tots.N = w1Td("font-family:var(--mono);font-weight:700"); fr.append(tots.N); tb.append(fr);
      tWrap.replaceChildren(tb);
    }
    function calc() {
      const [[a, b], [c, d]] = M, r1 = a + b, r2 = c + d, c1 = a + c, c2 = b + d, N = r1 + r2;
      const lo = Math.max(0, r1 + c1 - N), hi = Math.min(r1, c1), ks = [];
      const lt = w1LChoose(N, r1);
      for (let k = lo; k <= hi; k++) ks.push({ k, P: Math.exp(w1LChoose(c1, k) + w1LChoose(N - c1, r1 - k) - lt), w: w1ChooseBig(c1, k) * w1ChooseBig(N - c1, r1 - k) });
      const tot = w1ChooseBig(N, r1), obs = ks.find(t => t.k === a), Eobs = r1 * c1 / N;
      ks.forEach(t => (t.tail = t.P <= obs.P * (1 + 1e-7)));
      const up = a >= Eobs - 1e-9;
      const one = Math.min(1, sum(ks.filter(t => (up ? t.k >= a : t.k <= a)).map(t => t.P)));
      const two = Math.min(1, sum(ks.filter(t => t.tail).map(t => t.P)));
      const deg = !(r1 && r2 && c1 && c2);
      const E = deg ? null : [[r1 * c1 / N, r1 * c2 / N], [r2 * c1 / N, r2 * c2 / N]];
      let chi = NaN, yat = NaN, minE = NaN;
      if (E) {
        chi = 0; yat = 0; minE = Math.min(...E.flat());
        M.forEach((row, i) => row.forEach((f, j) => { const dlt = Math.abs(f - E[i][j]); chi += dlt * dlt / E[i][j]; yat += Math.max(0, dlt - 0.5) ** 2 / E[i][j]; }));
      }
      return { a, b, c, d, r1, r2, c1, c2, N, ks, tot, obs, Eobs, up, one, two, chi, yat, minE, deg };
    }
    const tabTxt = (t, k) => `[${k}, ${t.r1 - k} / ${t.c1 - k}, ${t.N - t.r1 - t.c1 + k}]`;
    function upd() {
      res = calc(); const t = res;
      [t.r1, t.r2].forEach((v, i) => (tots.r[i].textContent = v));
      [t.c1, t.c2].forEach((v, i) => (tots.c[i].textContent = v));
      tots.N.textContent = "N = " + t.N;
      if (!t.N) { setS(["–", "–", "–", "–", "–"]); w1Math(ro, "Üres tábla."); w1Math(ro2, ""); warn.style.display = "none"; cv.draw(); return; }
      setS([w1P(t.one), w1P(t.two), t.deg ? "–" : w1P(w1ChiSf(t.chi, 1)), t.deg ? "–" : w1P(w1ChiSf(t.yat, 1)), t.deg ? "–" : w1Num(t.minE, 2)]);
      warn.style.display = !t.deg && t.minE < 5 ? "" : "none";
      warn.textContent = `A legkisebb várt gyakoriság ${w1Num(t.minE, 2)} < 5 – a χ²-próba p-értéke itt csak durva közelítés, Fisher próbája a megbízható.`;
      const exact = t.tot <= 10n ** 12n;
      const dir = t.up ? `P(X ≥ ${t.a})` : `P(X ≤ ${t.a})`;
      const oneKs = t.ks.filter(q => (t.up ? q.k >= t.a : q.k <= t.a)), twoKs = t.ks.filter(q => q.tail);
      const lines = [`Peremek: r₁ = ${t.r1}, r₂ = ${t.r2}, c₁ = ${t.c1}, c₂ = ${t.c2}, N = ${t.N}; X lehetséges értékei: ${t.ks[0].k} … ${t.ks[t.ks.length - 1].k}, `
        + `várható értéke r₁c₁/N = ${w1Num(t.Eobs, 2)}.`];
      lines.push(`megfigyelt: X = ${t.a}, P(X = ${t.a}) = ${exact ? w1Big(t.obs.w) + " / " + w1Big(t.tot) + " = " : ""}${w1P(t.obs.P)}`);
      lines.push(`egyoldali (a megfigyelt irányban): ${dir}${fracTxt(oneKs)} = <b>${w1P(t.one)}</b>`);
      lines.push(`kétoldali: azok a k-k, ahol P(X = k) ≤ P(X = ${t.a}): ${kList(twoKs.map(q => q.k), t.ks[0].k, t.ks[t.ks.length - 1].k)}${fracTxt(twoKs)} = <b>${w1P(t.two)}</b>`);
      w1Math(ro2, lines.join("<br>"));
      function fracTxt(arr) {
        if (!exact) return "";
        const s = arr.reduce((x, q) => x + q.w, 0n);
        const terms = arr.length > 1 && arr.length <= 8 ? " = (" + arr.map(q => w1Big(q.w)).join(" + ") + ") / " + w1Big(t.tot) : "";
        return terms + " = " + w1Big(s) + " / " + w1Big(t.tot);
      }
      showSel(); cv.draw();
    }
    /* k-értékek tömören: „1, 2, 7, 8” vagy „k ≤ 20 és k ≥ 40” vagy „minden k” */
    function kList(arr, lo, hi) {
      if (arr.length <= 6) return arr.join(", ");
      if (arr.length === hi - lo + 1) return "minden k";
      const runs = []; arr.forEach(k => { const r = runs[runs.length - 1]; if (r && k === r[1] + 1) r[1] = k; else runs.push([k, k]); });
      return runs.map(([a, b]) => (a === b ? String(a) : a === lo ? `k ≤ ${b}` : b === hi ? `k ≥ ${a}` : `${a} … ${b}`)).join(" és ");
    }
    function showSel() {
      const t = res, k = sel == null ? t.a : sel, q = t.ks.find(z => z.k === k);
      if (!q) return;
      const tb = `<span style="white-space:nowrap">a = ${k}, b = ${t.r1 - k} / c = ${t.c1 - k}, d = ${t.N - t.r1 - t.c1 + k}</span>`;
      w1Math(ro, `${k === t.a ? "<b>A megfigyelt tábla</b>" : `Az X = ${k} tábla`}: ${tb} → P(X = ${k}) = ${w1P(q.P)}`
        + `${q.tail ? " · beszámít a kétoldali p-be" : " · nem számít be a kétoldali p-be"}`);
    }
    const geom = () => { const w = cv.w, H = cv.h, box = { x0: 48, y0: 30, x1: w - 10, y1: H - 42 }; return { box, cw: (box.x1 - box.x0) / Math.max(1, res.ks.length) }; };
    cv.draw = () => {
      const ctx = cv.ctx, w = cv.w, H = cv.h, narrow = w < 560;
      ctx.clearRect(0, 0, w, H);
      if (!res || !res.N) return;
      const t = res, { box, cw } = geom(), K = t.ks.length;
      const pm = Math.max(...t.ks.map(q => q.P)), top = pm * 1.18;
      const yt = rangeTicks(0, top, 4).filter(v => v <= top + 1e-12);
      const { ty } = w1Axes(ctx, box, { xmin: 0, xmax: 1, ymin: 0, ymax: top, yticks: yt, yfmt: v => w1Num(v, 3) });
      ctx.fillStyle = css("--muted"); w1Font(ctx, 11); ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText("P(X = k)", 4, 0);
      const bw = Math.min(46, cw * 0.7), every = Math.ceil(K / (narrow ? 12 : 24));
      t.ks.forEach((q, i) => {
        const xc = box.x0 + (i + 0.5) * cw, y = ty(q.P), isObs = q.k === t.a, isSel = q.k === sel;
        ctx.save(); ctx.globalAlpha = q.tail ? 0.8 : 0.45; ctx.fillStyle = css(q.tail ? "--bad" : "--setA");
        ctx.fillRect(xc - bw / 2, Math.min(y, box.y1 - 2), bw, Math.max(2, box.y1 - y)); ctx.restore();
        if (isObs || isSel) {
          ctx.save(); ctx.strokeStyle = css("--text"); ctx.lineWidth = isObs ? 2.5 : 1.5; if (!isObs) ctx.setLineDash([4, 3]);
          ctx.strokeRect(xc - bw / 2 - 2, Math.min(y, box.y1 - 2) - 2, bw + 4, box.y1 - Math.min(y, box.y1 - 2) + 2); ctx.restore();
        }
        if (isObs) { ctx.fillStyle = css("--text"); w1Font(ctx, 11, true); ctx.textBaseline = "bottom"; w1TextIn(ctx, "megfigyelt", xc, Math.max(box.y0 - 2, y - 6), box.x0 - 40, box.x1); }
        if (i % every === 0 || isObs) {
          ctx.fillStyle = css(isObs ? "--text" : "--muted"); w1Font(ctx, 12, isObs); ctx.textBaseline = "top";
          w1TextIn(ctx, String(q.k), xc, box.y1 + 5, box.x0, box.x1);
        }
      });
      ctx.fillStyle = css("--muted"); w1Font(ctx, 11); ctx.textAlign = "right"; ctx.textBaseline = "top";
      ctx.fillText(narrow ? "k (bal felső cella)" : "k = a bal felső cella (X) értéke", box.x1, box.y1 + 22);
    };
    const pick = e => {
      if (!res || !res.N) return;
      const r = cv.c.getBoundingClientRect(), { box, cw } = geom(), i = Math.floor((e.clientX - r.left - box.x0) / cw);
      if (i < 0 || i >= res.ks.length) return;
      sel = res.ks[i].k; showSel(); cv.draw();
    };
    cv.c.addEventListener("pointerdown", pick);
    cv.c.addEventListener("pointermove", e => { if (e.pointerType === "mouse" && e.buttons === 0) pick(e); });
    load("clinic");
  };
