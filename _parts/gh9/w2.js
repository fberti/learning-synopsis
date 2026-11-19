  /* ==================================================================
     w2: 9.3–9.5 widgetjei (threshold-crowd, simple-vs-complex, cascade-tree, seed-picker)
     A saját segédfüggvények blokkban, hogy ne ütközzenek a w1 neveivel.
     ================================================================== */
  {
    const sv = c => (String(c).startsWith("--") ? `var(${c})` : c);
    const sw = c => `<span style="display:inline-block;width:.8em;height:.8em;border-radius:50%;background:${sv(c)};vertical-align:-.05em;margin-right:.2em"></span>`;
    const svgEl = (Wd, Ht, inner, label, extra = "") =>
      `<svg viewBox="0 0 ${Wd} ${Ht}" style="width:100%;max-width:${Wd}px;display:block;touch-action:manipulation" role="img" aria-label="${label}" ${extra}>${inner}</svg>`;
    const onTheme = fn => new MutationObserver(fn).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    /* láthatóság: fn(true / false) – a widget a képernyőn van-e (és a lap nem rejtett) */
    function watchVis(root, fn) {
      let inView = true;
      if ("IntersectionObserver" in window) new IntersectionObserver(es => es.forEach(e => { inView = e.isIntersecting; fn(inView && !document.hidden); })).observe(root);
      document.addEventListener("visibilitychange", () => fn(inView && !document.hidden));
    }
    const median = xs => { const s = xs.slice().sort((a, b) => a - b), k = s.length >> 1; return s.length % 2 ? s[k] : (s[k - 1] + s[k]) / 2; };
    const pct = (x, d = 0) => fmt(100 * x, d) + "%";
    const fmM = (x, d = 2) => fmt(x, d).replace(",", "{,}");
    /* darabolt futtatás: job(i), i = 0 … total − 1, kötegenként „per” darab → leállító függvény */
    function chunked(total, per, job, onProg, onDone) {
      let i = 0, dead = false;
      const tick = () => {
        if (dead) return;
        const end = Math.min(total, i + per);
        for (; i < end; i++) job(i);
        onProg(i);
        if (i < total) setTimeout(tick, 0); else onDone();
      };
      setTimeout(tick, 0);
      return () => { dead = true; };
    }
    /* a standard normális eloszlás inverz eloszlásfüggvénye (Acklam-közelítés, ~1e−9) */
    function invNorm(p) {
      const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239],
        b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572],
        c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783],
        d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
      const pl = 0.02425;
      if (p < pl) { const q = Math.sqrt(-2 * Math.log(p)); return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
      if (p > 1 - pl) return -invNorm(1 - p);
      const q = p - 0.5, r = q * q;
      return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
    }
    /* egérpozíció SVG-koordinátában */
    const svgPt = (svg, ev) => { const r = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal; return [(ev.clientX - r.left) / r.width * vb.width, (ev.clientY - r.top) / r.height * vb.height]; };
    const range = (min, max, step, value, label, oninput, width = "9rem") =>
      h("input", { type: "range", min, max, step, value, "aria-label": label, style: `width:${width};max-width:42vw`, oninput });
    /* névelő a számhoz: az 1., az 5., az 50., a 2., a 10. … */
    const az = x => { const s = String(x); return (s[0] === "5" || (s[0] === "1" && s.length % 3 === 1)) ? "az" : "a"; };
    const mono = txt => h("b", { style: "font-family:var(--mono);min-width:2.6em;display:inline-block" }, txt);

    /* ------------------------------------------------------------------
       9.3  threshold-crowd – Granovetter-tömeg
       ------------------------------------------------------------------ */
    W["threshold-crowd"] = root => {
      header(root, "Granovetter-tömeg: ki mikor áll be?",
        "100 ember, mindenkinek van egy <b>küszöbe</b>: hány embernek kell már lázonganak ahhoz, hogy ő is beálljon. A 0-s küszöbű magától kezd. " +
        "Minden lépésben beáll mindenki, akinek a küszöbe legfeljebb az eddigi lázadók száma. A „lánc-diagramon” $F(x)$ azt jelöli, hány ember küszöbe legfeljebb $x$; " +
        "a folyamat lépcsőzetesen halad a 45°-os egyenes és $F$ között, amíg el nem éri az első metszéspontot.");
      math(root.querySelector(".w-sub"));
      const N = 100, narrow = root.clientWidth < 560;
      let mode = "seq", mean = 25, sd = 12, th = [], sel = -1, hist = [0], t = 0, timer = null, vis = true;

      const c1 = h("div", { class: "controls" });
      const paintMode = toggleGroup(c1, [["seq", "0, 1, 2, …, 99"], ["swap", "az 1-es helyett 2-es"], ["normal", "normális eloszlás"], ["custom", "saját"]], mode,
        v => { mode = v; load(); });
      const cN = h("div", { class: "controls" });
      const mOut = mono("25"), sOut = mono("12");
      const mSl = range(0, 60, 1, mean, "átlagos küszöb", () => { mean = +mSl.value; mOut.textContent = mean; load(); });
      const sSl = range(0, 30, 1, sd, "a küszöbök szórása", () => { sd = +sSl.value; sOut.textContent = sd; load(); });
      cN.append(h("label", null, "átlag", mSl, mOut), h("label", null, "szórás", sSl, sOut),
        h("span", { class: "muted", style: "font-size:.85rem" }, "(a normális eloszlás 100 kvantilise, egészre kerekítve)"));
      const c2 = h("div", { class: "controls" });
      const bPlay = btn("▶ Lejátszás", () => (timer ? stop() : play()), "btn primary");
      c2.append(bPlay, btn("Lépés", () => { stop(); if (t < T()) { t++; render(); } }), btn("Végig", () => { stop(); t = T(); render(); }),
        btn("Elejére", () => { stop(); t = 0; render(); }));
      root.append(c1, cN, c2);

      const grid = h("div", { class: "two-col", style: "align-items:start" });
      const crowdBox = h("div"), webBox = h("div");
      grid.append(crowdBox, webBox);
      root.append(grid);
      const histBox = h("div", { style: "margin-top:.6rem" });
      const cE = h("div", { class: "controls", style: "margin:.3rem 0 0" });
      const selInfo = h("span", { style: "font-size:.9rem" });
      const shift = dv => { if (sel < 0) return; th[sel] = Math.max(0, Math.min(99, th[sel] + dv)); toCustom(); };
      cE.append(selInfo, btn("−5", () => shift(-5)), btn("−1", () => shift(-1)), btn("+1", () => shift(1)), btn("+5", () => shift(5)));
      const info = h("div", { class: "readout" });
      const lesson = h("p", { style: "margin:.5rem 0 0;font-weight:600" },
        "Két szinte azonos tömegből az egyikből lázadás lesz, a másikból egy magányos rendbontó: a kimenet a küszöbök eloszlásán múlik, nem az átlagukon.");
      root.append(histBox, cE, info, lesson);

      const T = () => hist.length - 1;
      /* ha a tanuló módosít, „saját” módba váltunk */
      function toCustom() { if (mode !== "custom") { mode = "custom"; paintMode(mode); cN.style.display = "none"; } recompute(true); }
      function load() {
        stop();
        cN.style.display = mode === "normal" ? "" : "none";
        if (mode === "seq") th = [...Array(N).keys()];
        else if (mode === "swap") th = [0, 2, ...[...Array(N - 2).keys()].map(i => i + 2)];
        else if (mode === "normal") th = [...Array(N).keys()].map(i => Math.max(0, Math.min(99, Math.round(mean + sd * invNorm((i + 0.5) / N)))));
        /* saját: a jelenlegi küszöbökből indul */
        if (mode !== "custom") sel = -1;
        recompute(true);
      }
      function recompute(toEnd) {
        hist = granovetter(th);
        if (toEnd) t = T(); else t = Math.min(t, T());
        root.dataset.result = JSON.stringify({ final: hist[T()], steps: T(), hist });
        render();
      }
      /* mikor áll be az i-edik ember: az első t, amikor hist[t − 1] ≥ küszöb */
      const joinStep = v => { for (let s = 1; s < hist.length; s++) if (hist[s - 1] >= v) return s; return -1; };
      function render() { drawCrowd(); drawWeb(); drawHist(); readout(); }

      function drawCrowd() {
        const cs = 34, Wd = 10 * cs, Ht = 10 * cs + 22;
        let g = "";
        th.forEach((v, i) => {
          const js = joinStep(v), act = js > 0 && js <= t, fresh = js === t && t > 0;
          const x = (i % 10) * cs + cs / 2, y = Math.floor(i / 10) * cs + cs / 2;
          g += `<g data-i="${i}" style="cursor:pointer"><circle cx="${x}" cy="${y}" r="14" fill="${act ? sv("--setB") : sv("--card")}" stroke="${fresh ? sv("--accent") : act ? sv("--setB") : sv("--muted")}" stroke-width="${fresh ? 3 : 1.3}"/>` +
            `<text x="${x}" y="${y + 3.6}" text-anchor="middle" font-size="10.5" font-weight="600" fill="${act ? "#fff" : sv("--muted")}" style="pointer-events:none">${v}</text>` +
            (i === sel ? `<circle cx="${x}" cy="${y}" r="16.5" fill="none" stroke="${sv("--accent")}" stroke-width="2" stroke-dasharray="3 2"/>` : "") + `</g>`;
        });
        const ly = Ht - 9;
        g += `<circle cx="8" cy="${ly - 4}" r="6" fill="${sv("--setB")}"/><text x="18" y="${ly}" font-size="11" fill="${sv("--muted")}">lázad</text>` +
          `<circle cx="66" cy="${ly - 4}" r="6" fill="${sv("--card")}" stroke="${sv("--muted")}" stroke-width="1.2"/><text x="76" y="${ly}" font-size="11" fill="${sv("--muted")}">még nem</text>` +
          `<circle cx="140" cy="${ly - 4}" r="6" fill="${sv("--setB")}" stroke="${sv("--accent")}" stroke-width="2.5"/><text x="150" y="${ly}" font-size="11" fill="${sv("--muted")}">most állt be · a szám: küszöb</text>`;
        crowdBox.innerHTML = svgEl(Wd, Ht, g, "100 ember, a körökben a küszöbük");
        crowdBox.querySelector("svg").addEventListener("click", ev => {
          const gEl = ev.target.closest("g[data-i]"); if (!gEl) return;
          const i = +gEl.dataset.i; sel = sel === i ? -1 : i; render();
        });
      }
      function drawWeb() {
        const Wd = 340, Ht = 330, L = 34, R = 10, Tp = 10, B = 34, X = x => L + x / N * (Wd - L - R), Y = y => Ht - B - y / N * (Ht - Tp - B);
        const F = x => th.filter(v => v <= x).length;
        let g = "";
        for (let v = 0; v <= N; v += 20) g += `<line x1="${X(v)}" y1="${Tp}" x2="${X(v)}" y2="${Ht - B}" stroke="${sv("--border")}" stroke-width=".6"/>` +
          `<text x="${X(v)}" y="${Ht - B + 13}" text-anchor="middle" font-size="10.5" fill="${sv("--muted")}">${v}</text>` +
          `<line x1="${L}" y1="${Y(v)}" x2="${Wd - R}" y2="${Y(v)}" stroke="${sv("--border")}" stroke-width=".6"/>` +
          `<text x="${L - 4}" y="${Y(v) + 3.5}" text-anchor="end" font-size="10.5" fill="${sv("--muted")}">${v}</text>`;
        g += `<text x="${(L + Wd - R) / 2}" y="${Ht - 4}" text-anchor="middle" font-size="11" fill="${sv("--muted")}">x = a lázadók száma</text>` +
          `<text x="11" y="${(Tp + Ht - B) / 2}" text-anchor="middle" font-size="11" fill="${sv("--muted")}" transform="rotate(-90 11 ${(Tp + Ht - B) / 2})">F(x) = ennyi küszöb ≤ x</text>`;
        g += `<line x1="${X(0)}" y1="${Y(0)}" x2="${X(N)}" y2="${Y(N)}" stroke="${sv("--muted")}" stroke-width="1.2" stroke-dasharray="5 4"/>`;
        /* F lépcsőfüggvény */
        let pts = [];
        for (let x = 0; x < N; x++) { const f = F(x); pts.push(`${X(x).toFixed(1)},${Y(f).toFixed(1)}`, `${X(x + 1).toFixed(1)},${Y(f).toFixed(1)}`); }
        g += `<polyline points="${pts.join(" ")}" fill="none" stroke="${sv("--setA")}" stroke-width="2"/>`;
        /* pókháló: (h_i, h_i) → (h_i, h_{i+1}) → (h_{i+1}, h_{i+1}) */
        const web = (upto, col, w, op) => {
          const p = [`${X(0)},${Y(0)}`];
          for (let i = 0; i < upto; i++) p.push(`${X(hist[i]).toFixed(1)},${Y(hist[i + 1]).toFixed(1)}`, `${X(hist[i + 1]).toFixed(1)},${Y(hist[i + 1]).toFixed(1)}`);
          return `<polyline points="${p.join(" ")}" fill="none" stroke="${col}" stroke-width="${w}" stroke-opacity="${op}" stroke-linejoin="round"/>`;
        };
        g += web(T(), sv("--setB"), 1.4, 0.35) + web(t, sv("--setB"), 2.6, 1);
        const fx = hist[T()];
        g += `<circle cx="${X(fx)}" cy="${Y(fx)}" r="5" fill="${sv("--card")}" stroke="${sv("--accent")}" stroke-width="2.2"/>` +
          `<text x="${X(fx) + (fx > 70 ? -8 : 8)}" y="${Y(fx) + (fx > 70 ? 16 : -6)}" text-anchor="${fx > 70 ? "end" : "start"}" font-size="11" font-weight="600" fill="${sv("--accent")}">megáll: ${fx}</text>`;
        if (t > 0) g += `<circle cx="${X(hist[t])}" cy="${Y(hist[t])}" r="3.5" fill="${sv("--setB")}"/>`;
        const lx = Wd - R - 4, ly = Ht - B - 46;
        g += `<text x="${lx}" y="${ly}" text-anchor="end" font-size="11" font-weight="600" fill="${sv("--setA")}">— F(x)</text>` +
          `<text x="${lx}" y="${ly + 14}" text-anchor="end" font-size="11" fill="${sv("--muted")}">- - 45°: F(x) = x</text>` +
          `<text x="${lx}" y="${ly + 28}" text-anchor="end" font-size="11" font-weight="600" fill="${sv("--setB")}">— a folyamat lépései</text>`;
        webBox.innerHTML = svgEl(Wd, Ht, g, "lánc-diagram: F(x) és a 45 fokos egyenes");
      }
      /* hisztogram: húzással egy ember küszöbét viszed át egy másik értékre */
      function drawHist() {
        const Wd = narrow ? 380 : 680, Ht = narrow ? 170 : 150, L = 30, R = 16, Tp = 18, B = 30, cnt = new Array(N).fill(0);
        th.forEach(v => cnt[v]++);
        const mx = Math.max(3, ...cnt), bw = (Wd - L - R) / N, X = v => L + v * bw, Y = c => Ht - B - c / mx * (Ht - Tp - B);
        let g = "";
        [0, Math.ceil(mx / 2), mx].forEach(c => g += `<line x1="${L}" y1="${Y(c)}" x2="${Wd - R}" y2="${Y(c)}" stroke="${sv("--border")}" stroke-width=".6"/>` +
          `<text x="${L - 4}" y="${Y(c) + 3.5}" text-anchor="end" font-size="10.5" fill="${sv("--muted")}">${c}</text>`);
        const cur = hist[t];
        cnt.forEach((c, v) => {
          if (!c) return;
          const on = sel >= 0 && th[sel] === v;
          g += `<rect x="${X(v) + 0.6}" y="${Y(c)}" width="${Math.max(1.5, bw - 1.2)}" height="${Ht - B - Y(c)}" fill="${on ? sv("--accent") : v <= cur && t > 0 ? sv("--setB") : sv("--setA")}" opacity="${on ? 1 : 0.85}"/>`;
        });
        for (let v = 0; v <= N; v += narrow ? 20 : 10) g += `<text x="${X(v) + bw / 2}" y="${Ht - B + 13}" text-anchor="middle" font-size="10.5" fill="${sv("--muted")}">${v}</text>`;
        g += `<text x="${(L + Wd - R) / 2}" y="${Ht - 3}" text-anchor="middle" font-size="11" fill="${sv("--muted")}">küszöb (húzd az oszlopot: egy embert visz át)</text>`;
        if (t > 0) g += `<line x1="${X(cur) + bw}" y1="${Tp - 6}" x2="${X(cur) + bw}" y2="${Ht - B}" stroke="${sv("--setB")}" stroke-width="1.6" stroke-dasharray="4 3"/>` +
          `<text x="${Math.min(Wd - R - 4, X(cur) + bw + 4)}" y="${Tp - 6}" text-anchor="${cur > 80 ? "end" : "start"}" font-size="10.5" fill="${sv("--setB")}">${cur} lázadó</text>`;
        histBox.innerHTML = svgEl(Wd, Ht, g, "a küszöbök hisztogramja", 'data-hist="1"');
        const s = histBox.querySelector("svg"); s.style.touchAction = "none"; s.style.cursor = "ew-resize";
        const vOf = ev => Math.max(0, Math.min(99, Math.floor((svgPt(s, ev)[0] - L) / bw)));   // R = 16 → bw = 6,34
        s.addEventListener("pointerdown", ev => {
          const v = vOf(ev);
          /* a legközelebbi nem üres oszlop (±3) egy embere; ha a kijelölt ott van, ő */
          let best = -1, bd = 4;
          th.forEach((x, i) => { const d = Math.abs(x - v) - (i === sel ? 0.5 : 0); if (d < bd) { bd = d; best = i; } });
          if (best < 0) return;
          sel = best; dragging = true; s.setPointerCapture(ev.pointerId); render();
        });
        s.addEventListener("pointermove", ev => {
          if (!dragging || sel < 0) return;
          const v = vOf(ev);
          if (v !== th[sel]) { th[sel] = v; stop(); toCustom(); }
        });
        const end = () => { dragging = false; };
        s.addEventListener("pointerup", end); s.addEventListener("pointercancel", end);
      }
      let dragging = false;
      function readout() {
        const { mean: m } = meanSd(th), md = median(th), fin = hist[T()];
        let s = `lépés: <b>${t}</b> / ${T()} · lázadók most: <b>${hist[t]}</b> · a végén: <b>${fin}</b> fő (${T()} lépésben)` +
          `<br>átlagos küszöb: ${fmt(m, 1)} · medián: ${fmt(md, 1)} · 0-s küszöbű: ${th.filter(v => v === 0).length} fő`;
        if (fin === N) s += "<br>Mindenki beállt: minden lépés hozott annyi új embert, amennyi a következő küszöbhöz kell.";
        else if (fin === 0) s += "<br>Senki sem kezd: nincs 0-s küszöbű ember.";
        else s += `<br>A folyamat ${fin} főnél megáll: a maradék ${N - fin} ember küszöbe mind nagyobb, mint ${fin}.`;
        info.innerHTML = s;
        if (sel >= 0) {
          const js = joinStep(th[sel]);
          selInfo.innerHTML = `kijelölt ember: küszöb <b>${th[sel]}</b> – ${js > 0 ? `${az(js)} ${js}. lépésben áll be` : "nem áll be"}. Küszöb:`;
          [...cE.querySelectorAll("button")].forEach(b => (b.disabled = false));
        } else {
          selInfo.innerHTML = '<span class="muted">Kattints egy emberre, vagy húzd a hisztogram egy oszlopát, és módosíthatod a küszöböt:</span>';
          [...cE.querySelectorAll("button")].forEach(b => (b.disabled = true));
        }
      }
      function play() {
        if (t >= T()) t = 0;
        bPlay.textContent = "⏸ Szünet";
        render();
        timer = setInterval(() => {
          if (!vis) return;
          if (t >= T()) { stop(); return; }
          t++; render();
        }, 420);
      }
      function stop() { if (timer) clearInterval(timer); timer = null; bPlay.textContent = "▶ Lejátszás"; }
      watchVis(root, v => { vis = v; });
      load();
    };

    /* ------------------------------------------------------------------
       9.3  simple-vs-complex – egyszerű és összetett fertőzés (Centola–Macy)
       ------------------------------------------------------------------ */
    W["simple-vs-complex"] = root => {
      header(root, "Egyszerű vs. összetett fertőzés",
        "Ugyanaz a gyűrűrács (n = 60, mindenki a két-két legközelebbi szomszédjával), néhány élét $q$ valószínűséggel véletlen csúcsra kötjük át (szaggatott: átkötött „híd”). " +
        "Bal: <b>egyszerű</b> fertőzés – 1 aktív szomszéd elég (ez a szélességi bejárás), 1 kezdőcsúcsból. Jobb: <b>összetett</b> – 2 aktív szomszéd kell, 2 szomszédos kezdőből. " +
        "Kattints egy csúcsra: onnan indul (az összetettnél a mellette levővel együtt).");
      math(root.querySelector(".w-sub"));
      const n = 60, narrow = root.clientWidth < 560;
      let q = 0.05, seed = 1, start = 0, G, simp, comp, r = 0, timer = null, vis = true;
      const c1 = h("div", { class: "controls" });
      const qOut = mono("0,05");
      const qSl = range(0, 1, 0.01, q, "átkötési valószínűség", () => { q = +qSl.value; qOut.textContent = fmt(q, 2); build(); });
      const seedOut = h("b", { style: "font-family:var(--mono)" }, "1");
      c1.append(h("label", null, "q =", qSl, qOut), btn("Új minta", () => { seed++; seedOut.textContent = seed; build(); }), h("label", null, "minta:", seedOut));
      const c2 = h("div", { class: "controls" });
      const bPlay = btn("▶ Lejátszás", () => (timer ? stop() : play()), "btn primary");
      c2.append(bPlay, btn("Kör", () => { stop(); advance(); }), btn("Újra", () => { stop(); r = 0; render(); }));
      root.append(c1, c2);
      const two = h("div", { class: "two-canvas" });
      const mk = title => { const d = h("div"), t_ = h("div", { style: "font-weight:600;font-size:.92rem;margin-bottom:.2rem" }, title), b = h("div"), ro = h("div", { class: "readout", style: "margin-top:.3rem" }); d.append(t_, b, ro); two.append(d); return { b, ro }; };
      const P1 = mk("Egyszerű (küszöb: 1 szomszéd)"), P2 = mk("Összetett (küszöb: 2 szomszéd)");
      root.append(two);
      const legend = h("p", { class: "muted", style: "font-size:.86rem;margin:.4rem 0 0" });
      root.append(legend);
      const pos = GK.circleLayout(n).map(([x, y]) => ({ label: "", x, y }));
      const vopts = { aspect: 1, radius: narrow ? 6 : 6.5, maxW: 380, draggable: false, onNodeClick: i => { stop(); start = i; run(); } };
      const V1 = new GK.View(P1.b, Object.assign({}, vopts)), V2 = new GK.View(P2.b, Object.assign({}, vopts));
      /* görbe */
      const cC = h("div", { class: "controls", style: "margin-top:1rem" });
      const prog = h("span", { class: "muted", style: "font-size:.88rem" });
      const bCurve = btn("Görbe: 8 q-érték × 100 minta (n = 100)", () => curve());
      cC.append(bCurve, prog);
      const chart = h("div");
      const lesson = h("p", { style: "margin:.5rem 0 0;font-weight:600" },
        "A véletlen hidak az egyszerű fertőzést felgyorsítják, az összetettet megfojtják: a viselkedéshez több forrás kell, és azok a sűrű, átfedő körökben vannak.");
      root.append(cC, chart, lesson);

      function build() {
        stop();
        const ws = wattsStrogatz(n, 4, q, rng(1000 + seed)), rw = new Set(ws.rewired);
        G = { edges: ws.edges.map((e, i) => Object.assign({ a: e.a, b: e.b, w: 1 }, rw.has(i) ? { dash: [4, 3], alpha: 0.6, width: 1.3 } : { width: 1.1 })), nRew: rw.size };
        V1.setGraph(pos, G.edges); V2.setGraph(pos, G.edges);
        run();
      }
      function run() {
        simp = thresholdCascade(n, G.edges, [start], 1);
        comp = thresholdCascade(n, G.edges, [start, (start + 1) % n], 2);
        r = 0;
        root.dataset.result = JSON.stringify({ simple: simp.history, complex: comp.history, rewired: G.nRew });
        render();
      }
      const R_ = () => Math.max(simp.history.length, comp.history.length) - 1;
      function paint(V, C) {
        V.nodes.forEach((nd, i) => {
          const tm = C.time[i];
          nd.color = tm < 0 || tm > r ? "--border" : tm === r && r > 0 ? "--setB" : "--setA";
        });
        V.hl = new Set(C.time.map((tm, i) => (tm === 0 ? i : -1)).filter(i => i >= 0));
        V.draw();
      }
      function render() {
        paint(V1, simp); paint(V2, comp);
        const line = C => {
          const k = Math.min(r, C.history.length - 1), done = r >= C.history.length - 1, a = C.history[k];
          return `kör: <b>${k}</b> · aktív: <b>${a}</b> / ${n}` + (done ? (a === n ? " · kész: mindenki" : " · elakadt") : "");
        };
        P1.ro.innerHTML = line(simp); P2.ro.innerHTML = line(comp);
        legend.innerHTML = `${sw("--setA")}aktív · ${sw("--setB")}ebben a körben aktiválódott · ${sw("--border")}inaktív · kiemelt keret: a kezdők · ` +
          `átkötött élek: <b>${G.nRew}</b> / ${G.edges.length}`;
      }
      function advance() { if (r < R_()) { r++; render(); return true; } return false; }
      function play() {
        if (r >= R_()) r = 0;
        bPlay.textContent = "⏸ Szünet"; render();
        timer = setInterval(() => { if (!vis) return; if (!advance()) stop(); }, 380);
      }
      function stop() { if (timer) clearInterval(timer); timer = null; bPlay.textContent = "▶ Lejátszás"; }
      watchVis(root, v => { vis = v; });

      /* görbe: q → egyszerű lépésszám (teljes lefedésig) és összetett elért arány */
      const QS = [0, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1], RUNS = 100, NN = 100;
      let cancel = null;
      function curve() {
        if (cancel) cancel();
        bCurve.disabled = true;
        const Rr = rng(4242), acc = QS.map(() => ({ steps: [], frac: [] }));
        cancel = chunked(QS.length * RUNS, 20, j => {
          const qi = Math.floor(j / RUNS), E = wattsStrogatz(NN, 4, QS[qi], Rr).edges, s0 = Math.floor(Rr() * NN);
          const a = thresholdCascade(NN, E, [s0], 1);
          if (a.active.size === NN) acc[qi].steps.push(a.history.length - 1);
          acc[qi].frac.push(thresholdCascade(NN, E, [s0, (s0 + 1) % NN], 2).active.size / NN);
        }, k => { prog.textContent = `${k} / ${QS.length * RUNS} futás…`; plotCurve(acc, Math.floor(k / RUNS)); }, () => {
          prog.textContent = "kész (rögzített mag, mintánként 100 futás)"; bCurve.disabled = false; cancel = null;
          const res = acc.map((a, i) => ({ q: QS[i], steps: +meanSd(a.steps).mean.toFixed(2), frac: +meanSd(a.frac).mean.toFixed(3), conn: a.steps.length }));
          root.dataset.curve = JSON.stringify(res);
          plotCurve(acc, QS.length);
        });
      }
      function plotCurve(acc, done) {
        const Wd = narrow ? 360 : 620, Ht = 230, L = 34, R = 40, Tp = 16, B = 40;
        const X = i => L + (i + 0.5) / QS.length * (Wd - L - R), YL = s => Ht - B - s / 25 * (Ht - Tp - B), YR = f => Ht - B - f * (Ht - Tp - B);
        let g = "";
        for (let j = 0; j <= 5; j++) g += `<line x1="${L}" y1="${YR(j / 5)}" x2="${Wd - R}" y2="${YR(j / 5)}" stroke="${sv("--border")}" stroke-width=".6"/>` +
          `<text x="${L - 5}" y="${YR(j / 5) + 3.5}" text-anchor="end" font-size="10.5" fill="${sv("--setA")}">${5 * j}</text>` +
          `<text x="${Wd - R + 5}" y="${YR(j / 5) + 3.5}" font-size="10.5" fill="${sv("--setB")}">${20 * j}%</text>`;
        QS.forEach((qq, i) => g += `<text x="${X(i)}" y="${Ht - B + 14}" text-anchor="middle" font-size="10.5" fill="${sv("--muted")}">${fmt(qq, 2)}</text>`);
        g += `<text x="${(L + Wd - R) / 2}" y="${Ht - 6}" text-anchor="middle" font-size="11" fill="${sv("--muted")}">q (átkötési valószínűség)</text>`;
        const ps = [], pf = [];
        acc.forEach((a, i) => {
          if (i >= done || !a.frac.length) return;
          const st = meanSd(a.steps).mean, fr = meanSd(a.frac).mean;
          ps.push([X(i), YL(st), st]); pf.push([X(i), YR(fr), fr]);
        });
        g += `<polyline points="${ps.map(p => p[0] + "," + p[1]).join(" ")}" fill="none" stroke="${sv("--setA")}" stroke-width="2.2"/>` +
          `<polyline points="${pf.map(p => p[0] + "," + p[1]).join(" ")}" fill="none" stroke="${sv("--setB")}" stroke-width="2.2" stroke-dasharray="6 3"/>`;
        /* a címke a két pont közül a felsőnél fölé, az alsónál alá kerül */
        ps.forEach((p, i) => {
          const up = p[1] <= pf[i][1];
          g += `<circle cx="${p[0]}" cy="${p[1]}" r="3.5" fill="${sv("--setA")}"/>` + `<rect x="${pf[i][0] - 3.5}" y="${pf[i][1] - 3.5}" width="7" height="7" fill="${sv("--setB")}"/>`;
          if (narrow) return;
          g += `<text x="${p[0]}" y="${up ? p[1] - 7 : p[1] + 15}" text-anchor="middle" font-size="10" fill="${sv("--setA")}">${fmt(p[2], 1)}</text>` +
            `<text x="${p[0]}" y="${up ? pf[i][1] + 15 : pf[i][1] - 7}" text-anchor="middle" font-size="10" fill="${sv("--setB")}">${pct(pf[i][2])}</text>`;
        });
        chart.innerHTML = svgEl(Wd, Ht, g, "az egyszerű fertőzés lépésszáma és az összetett fertőzés elért aránya q függvényében") +
          `<div style="font-size:.86rem">${sw("--setA")}egyszerű: lépések a teljes lefedésig (bal tengely) · ${sw("--setB")}összetett: elért arány (jobb tengely, szaggatott)</div>`;
      }
      onTheme(() => { V1.draw(); V2.draw(); });
      build();
    };

    /* ------------------------------------------------------------------
       9.4  cascade-tree – kaszkádfák és kaszkádméret-eloszlás
       ------------------------------------------------------------------ */
    /* rétegzett fa-elrendezés: x = levélsorszám (a belső csúcs a gyerekei fölött középen), y = mélység */
    function layTree(par) {
      const n = par.length, ch = Array.from({ length: n }, () => []), depth = new Array(n).fill(0), x = new Array(n).fill(0);
      for (let v = 1; v < n; v++) ch[par[v]].push(v);
      const order = [0];
      for (let i = 0; i < order.length; i++) ch[order[i]].forEach(c => { depth[c] = depth[order[i]] + 1; order.push(c); });
      let leaf = 0;
      const visit = v => { if (!ch[v].length) { x[v] = leaf++; return; } ch[v].forEach(visit); x[v] = (x[ch[v][0]] + x[ch[v][ch[v].length - 1]]) / 2; };
      visit(0);
      return { x, depth, leaves: leaf, D: Math.max(...depth) };
    }
    W["cascade-tree"] = root => {
      header(root, "Kaszkádfák: méret, mélység, virálisság",
        "Egy kaszkád fája: ki kitől „kapta el” (gyökér: a kezdő). A <b>strukturális virálisság</b> a fa csúcspárjai közti átlagos távolság: " +
        "a műsorszórás (csillag) kicsi, a személyről személyre terjedő lánc nagy. Kattints egy csúcsra: új gyereket kap.");
      const narrow = root.clientWidth < 560;
      const PRE = {
        star: { name: "műsorszórás (csillag)", par: [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        path: { name: "lánc", par: [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8] },
        mixed: { name: "vegyes", par: [-1, 0, 0, 0, 1, 1, 4, 2, 7, 8] },
        gen: { name: "generált (független kaszkád)" }
      };
      let key = "mixed", par = PRE.mixed.par.slice(), net = "ba", p = 0.15, netSeed = 1, casSeed = 1, NET = null, Rc = rng(77), genInfo = "";
      const c1 = h("div", { class: "controls" });
      const paintKey = toggleGroup(c1, Object.entries(PRE).map(([k, d]) => [k, d.name]), key, v => { key = v; load(); });
      c1.append(btn("Csak gyökér", () => { key = "custom"; paintKey(key); par = [-1]; genInfo = ""; drawTree(); }));
      const cG = h("div", { class: "controls" });
      const pOut = mono("0,15");
      const pSl = range(0.02, 0.6, 0.01, p, "továbbadási valószínűség", () => { p = +pSl.value; pOut.textContent = fmt(p, 2); if (key === "gen") genTree(); distReset(); });
      toggleGroup(cG, [["ba", "BA, n = 300, m = 2"], ["er", "ER, n = 300, ⟨k⟩ = 4"]], net, v => { net = v; makeNet(); if (key === "gen") genTree(); distReset(); });
      cG.prepend(h("span", { class: "muted", style: "font-size:.92rem" }, "hálózat:"));
      cG.append(h("label", null, "p =", pSl, pOut), btn("Új kaszkád", () => { if (key !== "gen") { key = "gen"; paintKey(key); } genTree(); }, "btn primary"), btn("Új hálózat", () => { netSeed++; makeNet(); genTree(); distReset(); }));
      root.append(c1, cG);
      const treeBox = h("div", { style: "margin-top:.3rem" });
      const info = h("div", { class: "readout" });
      root.append(treeBox, info);

      /* (b) eloszlás */
      const hB = h("div", { style: "font-weight:700;margin-top:1.1rem" }, "Kaszkádméret-eloszlás");
      const subB = h("p", { class: "w-sub", style: "margin:.2rem 0 .3rem" },
        "Ugyanazon a hálózaton, ugyanazzal a $p$-vel 1000 kaszkád, mindegyik véletlen kezdőpontból (a hálózat és $p$ a fenti beállítás). " +
        "Összevetésül az elágazó folyamat: minden csúcsnak Poisson($R$) számú „utóda” van; a teljes méret Borel-eloszlású: $P(s) = e^{-Rs}(Rs)^{s-1}/s!$.");
      const cB = h("div", { class: "controls" });
      const prog = h("span", { class: "muted", style: "font-size:.88rem" });
      const bRun = btn("1000 kaszkád", () => runDist(), "btn primary");
      let Rb = 0.9;
      const rOut = mono("0,9");
      const rSl = range(0.1, 1, 0.05, Rb, "az elágazó folyamat átlagos utódszáma", () => { Rb = +rSl.value; rOut.textContent = fmt(Rb, 2); plotDist(); });
      cB.append(bRun, prog, h("label", null, "elmélet: R =", rSl, rOut));
      const distGrid = h("div", { class: "two-col", style: "align-items:start" });
      const histBox = h("div"), scatBox = h("div");
      distGrid.append(histBox, scatBox);
      const infoB = h("div", { class: "readout" });
      const lesson = h("p", { style: "margin:.5rem 0 0;font-weight:600" },
        "A legtöbb kaszkád egy-két lépés után elhal; a ritka nagyok közt van műsorszórás és lánc is – a méret nem árulja el, hogyan terjedt.");
      root.append(hB, subB, cB, distGrid, infoB, lesson);
      math(subB);

      function makeNet() {
        const R = rng(500 + netSeed), n = 300;
        const E = net === "ba" ? barabasiAlbert(n, 2, R) : gnm(n, 600, R);
        NET = { n, E, ds: degStats(n, E) };
      }
      function genTree() {
        const R = rng(9000 + casSeed++), s = Math.floor(R() * NET.n), C = icCascade(NET.n, NET.E, [s], p, R);
        const loc = new Map(C.active.map((v, i) => [v, i]));
        par = C.active.map(v => (C.parent[v] < 0 ? -1 : loc.get(C.parent[v])));
        genInfo = `kezdőcsúcs fokszáma: ${NET.ds.k[s]} · a hálózatban ⟨k⟩ = ${fmt(NET.ds.k1, 2)}, κ = ${fmt(NET.ds.kappa, 2)} (az átlagos „utódszám” kb. p·κ = ${fmt(p * NET.ds.kappa, 2)})`;
        drawTree();
      }
      function load() {
        if (key === "gen") genTree();
        else { par = PRE[key].par.slice(); genInfo = ""; drawTree(); }
      }
      function drawTree() {
        const n = par.length, Lt = layTree(par), M = treeMetrics([...Array(n).keys()], par);
        const Wd = narrow ? 360 : 680, pad = 16, padL = 26, rowH = Math.max(14, Math.min(54, 460 / Math.max(1, Lt.D))), Ht = 2 * pad + Lt.D * rowH + 8;
        const span = Math.min(Wd - padL - pad, (Lt.leaves - 1) * 64), x0 = padL + (Wd - padL - pad - span) / 2;
        const r = Math.max(2.2, Math.min(11, (Wd - padL - pad) / Math.max(1, Lt.leaves) / 2.6, rowH / 3.2));
        const X = v => x0 + (Lt.leaves <= 1 ? 0.5 : Lt.x[v] / (Lt.leaves - 1)) * span, Y = v => pad + 4 + Lt.depth[v] * rowH;
        const wl = M.levels.indexOf(M.breadth, 1);
        let g = "";
        if (wl > 0) g += `<rect x="16" y="${pad + 4 + wl * rowH - Math.max(r + 3, rowH * 0.42)}" width="${Wd - 18}" height="${2 * Math.max(r + 3, rowH * 0.42)}" rx="6" fill="${sv("--accent")}" opacity=".1"/>` + (narrow ? "" :
          `<text x="${Wd - 6}" y="${pad + 4 + wl * rowH - Math.max(r + 3, rowH * 0.42) + 11}" text-anchor="end" font-size="10.5" fill="${sv("--accent")}">legszélesebb szint (${M.breadth})</text>`);
        for (let v = 1; v < n; v++) g += `<line x1="${X(par[v])}" y1="${Y(par[v])}" x2="${X(v)}" y2="${Y(v)}" stroke="${sv("--muted")}" stroke-width="${n > 80 ? 0.8 : 1.4}"/>`;
        for (let v = 0; v < n; v++)
          g += `<g data-v="${v}" style="cursor:pointer"><circle cx="${X(v)}" cy="${Y(v)}" r="${Math.max(r, 8)}" fill="transparent"/>` +
            `<circle cx="${X(v)}" cy="${Y(v)}" r="${v === 0 ? r + 1.5 : r}" fill="${sv(v === 0 ? "--setB" : "--setA")}" stroke="${sv("--card")}" stroke-width="${n > 80 ? 0.6 : 1.2}"/></g>`;
        for (let d = 0; d <= Lt.D && rowH >= 22; d++) g += `<text x="3" y="${pad + 4 + d * rowH + 3.5}" font-size="9.5" fill="${sv("--muted")}">${d}</text>`;
        treeBox.innerHTML = svgEl(Wd, Ht, g, "a kaszkád fája, a gyökér felül");
        treeBox.querySelector("svg").addEventListener("click", ev => {
          const el = ev.target.closest("g[data-v]"); if (!el || par.length >= 400) return;
          par.push(+el.dataset.v);
          if (key !== "custom") { key = "custom"; paintKey(key); genInfo = ""; }
          drawTree();
        });
        const star = 2 * (n - 1) / n, path = (n + 1) / 3;
        let s = `méret: <b>${M.size}</b> · mélység: <b>${M.depth}</b> · legnagyobb szélesség: <b>${M.breadth}</b>` + (wl > 0 ? ` (${az(wl)} ${wl}. szinten)` : "") +
          `<br>strukturális virálisság (átlagos páronkénti távolság): <b>ν = ${fmt(M.sv, 3)}</b>` +
          (n > 1 ? `<br>összevetés, ugyanekkora fa: csillag 2(n − 1)/n = ${fmt(star, 3)} · lánc (n + 1)/3 = ${fmt(path, 3)}` : "");
        if (genInfo) s += "<br>" + genInfo;
        info.innerHTML = s;
        root.dataset.tree = JSON.stringify({ size: M.size, depth: M.depth, breadth: M.breadth, level: wl, sv: +M.sv.toFixed(4) });
      }

      /* ---- (b) ---- */
      let sizes = null, scat = [], cancel = null;
      function distReset() { if (cancel) cancel(); cancel = null; sizes = null; scat = []; bRun.disabled = false; prog.textContent = ""; plotDist(); }
      function runDist() {
        if (cancel) cancel();
        bRun.disabled = true; sizes = []; scat = [];
        const R = rng(31337 + netSeed), TOT = 1000;
        cancel = chunked(TOT, 50, () => {
          const s = Math.floor(R() * NET.n), C = icCascade(NET.n, NET.E, [s], p, R);
          sizes.push(C.active.length);
          if (C.active.length >= 10) scat.push([C.active.length, treeMetrics(C.active, C.parent).sv]);
        }, k => { prog.textContent = `${k} / ${TOT}…`; if (k % 200 === 0) plotDist(); }, () => {
          prog.textContent = "kész"; bRun.disabled = false; cancel = null; plotDist();
        });
      }
      const borelTail = (R, s0) => { let c = 0; for (let s = 1; s < s0; s++) c += borel(R, s); return Math.max(0, 1 - c); };
      function plotDist() {
        /* log–log: x = méret (1 … 512), y = P(s) méretegységenként */
        const Wd = 340, Ht = 260, L = 42, Rm = 10, Tp = 12, B = 34, xmax = Math.log10(512), ymin = -6;
        const X = s => L + Math.log10(s) / xmax * (Wd - L - Rm), Y = pr => Ht - B - (Math.max(ymin, Math.log10(pr)) - ymin) / -ymin * (Ht - Tp - B);
        let g = "";
        [1, 10, 100].forEach(s => g += `<line x1="${X(s)}" y1="${Tp}" x2="${X(s)}" y2="${Ht - B}" stroke="${sv("--border")}" stroke-width=".6"/><text x="${X(s)}" y="${Ht - B + 13}" text-anchor="middle" font-size="10.5" fill="${sv("--muted")}">${s}</text>`);
        for (let e = 0; e >= ymin; e -= 2) g += `<line x1="${L}" y1="${Y(10 ** e)}" x2="${Wd - Rm}" y2="${Y(10 ** e)}" stroke="${sv("--border")}" stroke-width=".6"/>` +
          `<text x="${L - 4}" y="${Y(10 ** e) + 3.5}" text-anchor="end" font-size="10.5" fill="${sv("--muted")}">${e === 0 ? "1" : "10" + String(e).replace("-", "⁻").replace("2", "²").replace("4", "⁴").replace("6", "⁶")}</text>`;
        g += `<text x="${(L + Wd - Rm) / 2}" y="${Ht - 4}" text-anchor="middle" font-size="11" fill="${sv("--muted")}">kaszkádméret s (log)</text>` +
          `<text x="11" y="${(Tp + Ht - B) / 2}" text-anchor="middle" font-size="11" fill="${sv("--muted")}" transform="rotate(-90 11 ${(Tp + Ht - B) / 2})">P(s) (log)</text>`;
        /* elmélet: Borel(R) */
        const bp = [];
        for (let s = 1; s <= 512; s++) { const pr = borel(Rb, s); if (pr > 1e-6) bp.push(`${X(s).toFixed(1)},${Y(pr).toFixed(1)}`); }
        g += `<polyline points="${bp.join(" ")}" fill="none" stroke="${sv("--setC")}" stroke-width="2"/>`;
        if (Rb === 1) g += `<text x="${X(30)}" y="${Y(borel(1, 30)) - 10}" font-size="10.5" fill="${sv("--setC")}">∝ s^(−3/2)</text>`;
        if (sizes && sizes.length) {
          const N = sizes.length;
          for (let lo = 1; lo <= 512; lo *= 2) {
            const hi = lo * 2 - 1, c = sizes.filter(s => s >= lo && s <= hi).length;
            if (!c) continue;
            const wdt = Math.min(hi, NET.n) - lo + 1, xm = Math.sqrt(lo * Math.min(hi, NET.n));
            g += `<circle cx="${X(xm)}" cy="${Y(c / N / wdt)}" r="4.5" fill="${sv("--setB")}" stroke="${sv("--card")}" stroke-width="1"/>`;
          }
        }
        g += `<text x="${Wd - Rm - 4}" y="${Tp + 12}" text-anchor="end" font-size="11" font-weight="600" fill="${sv("--setB")}">● szimuláció (log. rekeszek)</text>` +
          `<text x="${Wd - Rm - 4}" y="${Tp + 26}" text-anchor="end" font-size="11" font-weight="600" fill="${sv("--setC")}">— Borel, R = ${fmt(Rb, 2)}</text>`;
        histBox.innerHTML = svgEl(Wd, Ht, g, "a kaszkádméretek eloszlása log–log skálán");
        /* méret–virálisság pontfelhő */
        const Ws = 340, Hs = 260, xs1 = Math.log10(300), ymax = 12;
        const SX = s => L + (Math.log10(s) - 1) / (xs1 - 1) * (Ws - L - Rm), SY = v => Hs - B - Math.min(v, ymax) / ymax * (Hs - Tp - B);
        let s2 = "";
        [10, 30, 100, 300].forEach(s => s2 += `<line x1="${SX(s)}" y1="${Tp}" x2="${SX(s)}" y2="${Hs - B}" stroke="${sv("--border")}" stroke-width=".6"/><text x="${SX(s)}" y="${Hs - B + 13}" text-anchor="middle" font-size="10.5" fill="${sv("--muted")}">${s}</text>`);
        for (let v = 0; v <= ymax; v += 3) s2 += `<line x1="${L}" y1="${SY(v)}" x2="${Ws - Rm}" y2="${SY(v)}" stroke="${sv("--border")}" stroke-width=".6"/><text x="${L - 4}" y="${SY(v) + 3.5}" text-anchor="end" font-size="10.5" fill="${sv("--muted")}">${v}</text>`;
        s2 += `<text x="${(L + Ws - Rm) / 2}" y="${Hs - 4}" text-anchor="middle" font-size="11" fill="${sv("--muted")}">méret (log, ≥ 10)</text>` +
          `<text x="11" y="${(Tp + Hs - B) / 2}" text-anchor="middle" font-size="11" fill="${sv("--muted")}" transform="rotate(-90 11 ${(Tp + Hs - B) / 2})">virálisság ν</text>`;
        const cur = (f, lo, hi) => { const pp = []; for (let s = lo; s <= hi; s++) pp.push(`${SX(s).toFixed(1)},${SY(f(s)).toFixed(1)}`); return pp.join(" "); };
        s2 += `<polyline points="${cur(s => 2 * (s - 1) / s, 10, 300)}" fill="none" stroke="${sv("--muted")}" stroke-width="1.3" stroke-dasharray="5 4"/>` +
          `<polyline points="${cur(s => (s + 1) / 3, 10, 35)}" fill="none" stroke="${sv("--muted")}" stroke-width="1.3" stroke-dasharray="2 3"/>` +
          `<text x="${SX(200)}" y="${SY(2) - 5}" text-anchor="middle" font-size="10" fill="${sv("--muted")}">csillag</text>` +
          `<text x="${SX(28)}" y="${SY(10.5)}" text-anchor="end" font-size="10" fill="${sv("--muted")}">lánc</text>`;
        scat.forEach(([s, v]) => s2 += `<circle cx="${SX(Math.min(s, 300)).toFixed(1)}" cy="${SY(v).toFixed(1)}" r="3" fill="${sv("--setA")}" fill-opacity=".55"/>`);
        scatBox.innerHTML = svgEl(Ws, Hs, s2, "kaszkádméret és strukturális virálisság");
        /* kiírás */
        let t = `elmélet (Borel, R = ${fmt(Rb, 2)}): P(1) = <b>${fmt(borel(Rb, 1), 3)}</b> · átlag = ${Rb < 1 ? `<b>${fmt(1 / (1 - Rb), 2)}</b>` : "<b>∞</b>"} · P(s ≥ 100) = <b>${pct(borelTail(Rb, 100), 1)}</b>`;
        if (sizes && sizes.length) {
          const N = sizes.length, one = sizes.filter(s => s === 1).length / N, mean = meanSd(sizes).mean, mx = Math.max(...sizes), big = sizes.filter(s => s >= 100).length / N;
          t = `${N} kaszkád: 1 méretű <b>${pct(one, 1)}</b> · medián <b>${fmt(median(sizes), 1)}</b> · átlag <b>${fmt(mean, 2)}</b> · legnagyobb <b>${mx}</b> · ≥ 100: ${pct(big, 1)}` +
            ` · ≥ 10 méretű: ${scat.length} db` + "<br>" + t;
          if (N === 1000) root.dataset.dist = JSON.stringify({ one: +one.toFixed(3), median: median(sizes), mean: +mean.toFixed(2), max: mx, big: scat.length });
        } else t = "Nyomd meg az „1000 kaszkád” gombot." + "<br>" + t;
        infoB.innerHTML = t;
        root.dataset.borel = JSON.stringify({ R: Rb, p1: +borel(Rb, 1).toFixed(4), tail100: +borelTail(Rb, 100).toFixed(4) });
      }
      makeNet();
      load();
      plotDist();
    };

    /* ------------------------------------------------------------------
       9.5  seed-picker – befolyásmaximalizálás
       ------------------------------------------------------------------ */
    /* élő-él minták: minden mintában minden él p eséllyel „él”; komponens-azonosítók és -méretek mintánként.
       Pontos változat (m ≤ 20): az összes 2^m élhalmaz a valószínűségével súlyozva – ez épp icExact. */
    function liveSamples(n, edges, p, exact, N, R) {
      const m = edges.length, S = exact ? 1 << m : N, comp = new Int32Array(S * n), size = new Int32Array(S * n), w = new Float64Array(S);
      const par = new Int32Array(n);
      const f = x => { while (par[x] !== x) { par[x] = par[par[x]]; x = par[x]; } return x; };
      for (let s = 0; s < S; s++) {
        for (let v = 0; v < n; v++) par[v] = v;
        let pr = 1;
        for (let i = 0; i < m; i++) {
          const on = exact ? (s >> i) & 1 : R() < p;
          if (exact) pr *= on ? p : 1 - p;
          if (on) { const a = f(edges[i].a), b = f(edges[i].b); if (a !== b) par[a] = b; }
        }
        w[s] = exact ? pr : 1 / N;
        const o = s * n;
        for (let v = 0; v < n; v++) { const r = f(v); comp[o + v] = r; size[o + r]++; }
      }
      return { n, S, comp, size, w, exact };
    }
    /* σ(S) és (Monte-Carlónál) a 95%-os hibahatár */
    function sigmaOf(L, seeds) {
      const { n, S, comp, size, w } = L;
      let tot = 0, sq = 0;
      for (let s = 0; s < S; s++) {
        const o = s * n; let x = 0;
        for (let j = 0; j < seeds.length; j++) {
          const r = comp[o + seeds[j]]; let dup = false;
          for (let i = 0; i < j; i++) if (comp[o + seeds[i]] === r) { dup = true; break; }
          if (!dup) x += size[o + r];
        }
        tot += w[s] * x; sq += w[s] * x * x;
      }
      const err = L.exact ? 0 : 1.96 * Math.sqrt(Math.max(0, sq - tot * tot) * S / (S - 1) / S);
      return { val: tot, err };
    }
    /* P(v aktív | S) minden csúcsra */
    function activeProb(L, seeds) {
      const { n, S, comp, w } = L, out = new Float64Array(n);
      for (let s = 0; s < S; s++) {
        const o = s * n, roots = seeds.map(v => comp[o + v]);
        for (let v = 0; v < n; v++) if (roots.includes(comp[o + v])) out[v] += w[s];
      }
      return out;
    }
    function hubsGraph(aspect) {
      const labels = ["A", "B", "1", "2", "3", "4", "5", "C", "x", "y", "z"];
      const pos = [[1.5, 0.15], [1.5, 1.85], [0.3, 1], [0.75, 1], [1.2, 1], [1.8, 1], [2.25, 1], [3.3, 1], [4, 0.35], [4.25, 1], [4, 1.65]];
      const edges = [];
      for (let i = 2; i <= 6; i++) edges.push({ a: 0, b: i, w: 1 }, { a: 1, b: i, w: 1 });
      edges.push({ a: 0, b: 1, w: 1 }, { a: 7, b: 8, w: 1 }, { a: 7, b: 9, w: 1 }, { a: 7, b: 10, w: 1 });
      const P = GK.normalize(pos, aspect);
      return { name: "két hub + kis csillag", nodes: labels.map((l, i) => ({ label: l, x: P[i][0], y: P[i][1] })), edges };
    }
    W["seed-picker"] = root => {
      header(root, "Kit válassz kezdőnek? – befolyásmaximalizálás",
        "Független kaszkád: minden él egyszer, $p$ eséllyel adja tovább. Válassz $k$ kezdőt kattintással; a gép kiszámolja a várható terjedést, $\\sigma(S)$-t " +
        "(legfeljebb 20 élű gráfon <b>pontosan</b>, az összes élhalmazon; nagyobbon 2000 véletlen futásból, 95%-os hibahatárral). " +
        "A csúcs színe: mekkora eséllyel lesz aktív a te kezdőiddel.");
      math(root.querySelector(".w-sub"));
      const narrow = root.clientWidth < 560;
      const DATA = {
        hubs: { name: "két hub + kis csillag", asp: narrow ? 0.62 : 0.42, r: 14, make: a => hubsGraph(a) },
        arviz: { name: "Árvízhét", asp: narrow ? 0.85 : 0.5, r: 15, make: a => { const g = preset("arviz", a); g.edges = g.edges.map(e => ({ a: e.a, b: e.b, w: 1 })); return g; } },
        karate: { name: "karateklub", asp: narrow ? 0.95 : 0.62, r: narrow ? 9 : 11, make: a => { const g = preset("karate", a); g.edges = g.edges.map(e => ({ a: e.a, b: e.b, w: 1 })); return g; } },
        ba: { name: "BA, n = 100", asp: narrow ? 0.95 : 0.62, r: narrow ? 5 : 6, make: a => {
          const E = barabasiAlbert(100, 2, rng(2024)), P = GK.forceLayout(100, E.map(e => [e.a, e.b]), { seed: 3, aspect: a, iters: 300 });
          return { name: "BA", nodes: P.map((q, i) => ({ label: "", name: String(i + 1), x: q[0], y: q[1] })), edges: E.map(e => Object.assign({ width: 1 }, e)) };
        } }
      };
      let key = "hubs", p = 0.3, k = 2, G, Ls = null, sel = [], rows = {}, want = new Set(), cancel = null, deb = null, showOn = null;
      const c1 = h("div", { class: "controls" });
      toggleGroup(c1, Object.entries(DATA).map(([kk, d]) => [kk, d.name]), key, v => { key = v; build(); });
      const c2 = h("div", { class: "controls" });
      const pOut = mono("0,3");
      const pSl = range(0.05, 0.6, 0.01, p, "továbbadási valószínűség", () => { p = +pSl.value; pOut.textContent = fmt(p, 2); clearTimeout(deb); deb = setTimeout(resample, 150); });
      c2.append(h("label", null, "p =", pSl, pOut), h("span", { class: "muted", style: "font-size:.92rem" }, "kezdők száma k ="));
      toggleGroup(c2, [[1, "1"], [2, "2"], [3, "3"]], k, v => { k = v; if (sel.length > k) sel = sel.slice(sel.length - k); want.clear(); rows = {}; showOn = null; update(); });
      const c3 = h("div", { class: "controls" });
      const bG = btn("Mohó", () => ask("greedy"), "btn primary"), bD = btn("Legnagyobb fokszámúak", () => ask("degree")), bO = btn("Optimum", () => ask("opt"));
      const prog = h("span", { class: "muted", style: "font-size:.88rem" });
      c3.append(bG, bD, bO, btn("Kijelölés törlése", () => { sel = []; update(); }), prog);
      root.append(c1, c2, c3);
      const grid = h("div", { style: "display:grid;grid-template-columns:minmax(0,2fr) minmax(0,1fr);gap:.8rem;align-items:start" });
      if (narrow) grid.style.gridTemplateColumns = "minmax(0,1fr)";
      const box = h("div"), side = h("div");
      grid.append(box, side);
      root.append(grid);
      const legend = h("p", { class: "muted", style: "font-size:.86rem;margin:.3rem 0 0" });
      const info = h("div", { class: "readout" });
      const tbl = h("div", { class: "tw", style: "overflow-x:auto;margin-top:.5rem" });
      const gtbl = h("div", { class: "tw", style: "overflow-x:auto;margin-top:.5rem" });
      const lesson = h("p", { style: "margin:.5rem 0 0;font-weight:600" },
        "A második kezdőt nem a második legjobbnak kell választani, hanem annak, aki a legtöbb újat hozza – a két hub egymás közönségét fedi le.");
      root.append(legend, info, tbl, gtbl, lesson);
      const view = new GK.View(box, { aspect: DATA[key].asp, radius: DATA[key].r, draggable: false, onNodeClick: i => toggle(i) });

      const nm = i => G.nodes[i].label || G.nodes[i].name;
      const setName = S => S.map(nm).join(" + ");
      const fS = (o, d = 3) => fmt(o.val, d) + (o.err ? " ± " + fmt(o.err, 2) : "");
      function build() {
        const d = DATA[key];
        view.o.aspect = d.asp; view.o.radius = d.r;
        G = d.make(d.asp);
        view.setGraph(G.nodes, G.edges); view.resize();
        sel = key === "hubs" ? [0, 1].slice(0, k) : []; rows = {}; want.clear(); showOn = null;
        resample();
      }
      function resample() {
        if (cancel) { cancel(); cancel = null; prog.textContent = ""; }
        const n = G.nodes.length, exact = G.edges.length <= 20;
        Ls = liveSamples(n, G.edges, p, exact, 2000, rng(777));
        rows = {};
        update();
        [...want].forEach(w => compute(w));
      }
      function toggle(i) {
        const j = sel.indexOf(i);
        if (j >= 0) sel.splice(j, 1); else { sel.push(i); if (sel.length > k) sel.shift(); }
        update();
      }
      const deg = () => { const d = new Array(G.nodes.length).fill(0); G.edges.forEach(e => { d[e.a]++; d[e.b]++; }); return d; };
      function ask(what) { want.add(what); showOn = what; compute(what); }
      function compute(what) {
        const n = G.nodes.length;
        if (what === "greedy") {
          const steps = greedySeeds(n, Math.min(n, Math.max(k, 5)), S => sigmaOf(Ls, S).val);
          const S = steps.slice(0, k).map(s => s.node);
          rows.greedy = { S, sig: sigmaOf(Ls, S), steps };
        } else if (what === "degree") {
          const d = deg(), S = [...Array(n).keys()].sort((a, b) => d[b] - d[a] || a - b).slice(0, k);
          rows.degree = { S, sig: sigmaOf(Ls, S) };
        } else if (what === "opt") {
          const combos = binom(n, k);
          if (combos * Ls.S * k > 1.5e8) { rows.opt = { tooBig: true, combos }; showOn = rows.greedy ? "greedy" : rows.degree ? "degree" : null; update(); return; }
          if (cancel) cancel();
          const idx = [...Array(k).keys()], all = [];
          /* az összes k-as felsorolása lexikografikusan */
          for (;;) {
            all.push(idx.slice());
            let i = k - 1; while (i >= 0 && idx[i] === n - k + i) i--;
            if (i < 0) break;
            idx[i]++; for (let j = i + 1; j < k; j++) idx[j] = idx[j - 1] + 1;
          }
          let best = null, bv = -Infinity;
          const per = Math.max(1, Math.floor(4e5 / (Ls.S * k)));
          bO.disabled = true;
          cancel = chunked(all.length, per, i => { const v = sigmaOf(Ls, all[i]).val; if (v > bv + 1e-12) { bv = v; best = all[i]; } },
            j => { prog.textContent = `optimum: ${j} / ${all.length} kombináció…`; },
            () => { cancel = null; bO.disabled = false; prog.textContent = ""; rows.opt = { S: best, sig: sigmaOf(Ls, best), combos: all.length }; update(); });
          return;
        }
        update();
      }
      function update() {
        const n = G.nodes.length, pr = sel.length ? activeProb(Ls, sel) : new Float64Array(n);
        const hlSet = showOn && rows[showOn] && rows[showOn].S ? rows[showOn].S : [];
        view.nodes.forEach((nd, i) => {
          nd.color = sel.includes(i) ? "--setB" : mixColor("--border", "--setA", Math.min(1, pr[i]));
          nd.ink = sel.includes(i) || pr[i] > 0.55 ? "#fff" : "--text";
          nd.badge = hlSet.includes(i) ? (showOn === "greedy" ? "M" + (hlSet.indexOf(i) + 1) : showOn === "degree" ? "F" : "O") : null;
        });
        view.hl = new Set(hlSet);
        view.draw();
        const sigU = sel.length ? sigmaOf(Ls, sel) : null;
        legend.innerHTML = `${sw("--setB")}a te kezdőid · a többi csúcs színe: P(aktív) – ${sw("--border")}0 … ${sw("--setA")}1` +
          (hlSet.length ? ` · kiemelt keret és jelölés: ${showOn === "greedy" ? "a mohó választás (M1, M2, …)" : showOn === "degree" ? "a legnagyobb fokszámúak (F)" : "az optimum (O)"}` : "");
        info.innerHTML = (sel.length
          ? `a te választásod: <b>${setName(sel)}</b> → σ(S) = <b>${fS(sigU)}</b> csúcs (${Ls.exact ? "pontos" : "2000 futás"})` + (sel.length < k ? ` · még ${k - sel.length} kezdőt választhatsz` : "")
          : `Válassz ${k} kezdőt a csúcsokra kattintva.`) + ` · n = ${n}, m = ${G.edges.length}, p = ${fmt(p, 2)}`;
        /* eredménytábla */
        tbl.innerHTML = "";
        const t = h("table", { style: "width:auto;min-width:min(100%,380px)" });
        t.append(h("tr", null, h("th", null, "módszer"), h("th", null, "kezdők"), h("th", null, "σ(S)")));
        const best = Math.max(...[sigU, rows.greedy && rows.greedy.sig, rows.degree && rows.degree.sig, rows.opt && rows.opt.sig].filter(Boolean).map(o => o.val));
        const row = (label, S, sig, note) => {
          const top = sig && Math.abs(sig.val - best) < 1e-9;
          t.append(h("tr", { style: top ? "background:color-mix(in srgb, var(--accent) 14%, var(--card));font-weight:600" : "" },
            h("td", null, label), h("td", null, S ? setName(S) : "–"), h("td", { style: "font-family:var(--mono)" }, sig ? fS(sig) : note || "–")));
        };
        row("a te választásod", sel.length ? sel : null, sel.length === k ? sigU : null, sel.length ? `(még ${k - sel.length})` : "");
        row("mohó", rows.greedy && rows.greedy.S, rows.greedy && rows.greedy.sig, "nyomd meg a „Mohó” gombot");
        row("legnagyobb fokszámúak", rows.degree && rows.degree.S, rows.degree && rows.degree.sig);
        if (rows.opt && rows.opt.tooBig) row("optimum", null, null, `túl sok (${binom(n, k)}) kombináció`);
        else row("optimum" + (rows.opt ? ` (${rows.opt.combos} k-as)` : ""), rows.opt && rows.opt.S, rows.opt && rows.opt.sig);
        tbl.append(t);
        /* mohó lépések + csökkenő hozadék */
        gtbl.innerHTML = ""; side.innerHTML = "";
        if (rows.greedy) {
          const st = rows.greedy.steps, g = h("table", { style: "width:auto;min-width:min(100%,380px)" });
          g.append(h("tr", null, h("th", null, "lépés"), h("th", null, "választott"), h("th", null, "határhaszon"), h("th", null, "összesen")));
          st.forEach((s, i) => g.append(h("tr", { style: i < k ? "font-weight:600" : "color:var(--muted)" }, h("td", null, String(i + 1)), h("td", null, nm(s.node)),
            h("td", { style: "font-family:var(--mono)" }, "+" + fmt(s.gain, 3)), h("td", { style: "font-family:var(--mono)" }, fmt(s.total, 3)))));
          gtbl.append(h("p", { style: "margin:.3rem 0;font-size:.9rem" }, `A mohó algoritmus lépései (mindig azt veszi hozzá, aki a legtöbbet növeli; a ${k + 1}. sortól halványan: ha több kezdőd lehetne):`), g);
          const Wd = 260, Ht = 190, L = 30, B = 34, Tp = 30, mx = Math.max(...st.map(s => s.gain)), bw = (Wd - L - 8) / st.length;
          let s2 = "";
          st.forEach((s, i) => {
            const hh = s.gain / mx * (Ht - Tp - B);
            s2 += `<rect x="${L + i * bw + 3}" y="${Ht - B - hh}" width="${bw - 6}" height="${hh}" fill="${sv(i < k ? "--setA" : "--border")}"/>` +
              `<text x="${L + i * bw + bw / 2}" y="${Ht - B - hh - 4}" text-anchor="middle" font-size="10" fill="${sv("--text")}">${fmt(s.gain, 2)}</text>` +
              `<text x="${L + i * bw + bw / 2}" y="${Ht - B + 13}" text-anchor="middle" font-size="10.5" fill="${sv("--muted")}">${i + 1}.</text>`;
          });
          s2 += `<line x1="${L}" y1="${Ht - B}" x2="${Wd - 4}" y2="${Ht - B}" stroke="${sv("--border")}"/>` +
            `<text x="${L}" y="11" font-size="11" fill="${sv("--muted")}">határhaszon lépésenként</text>` +
            `<text x="${(L + Wd) / 2}" y="${Ht - 3}" text-anchor="middle" font-size="10.5" fill="${sv("--muted")}">a mohó sorrend lépései</text>`;
          side.innerHTML = `<div style="font-weight:600;font-size:.9rem">Csökkenő hozadék</div>` + svgEl(Wd, Ht, s2, "a mohó sorrend határhaszna lépésenként") +
            `<div class="muted" style="font-size:.82rem">Minden újabb kezdő kevesebbet hoz: a közönsége egy részét már elérték.</div>`;
        } else side.innerHTML = `<div class="muted" style="font-size:.85rem;margin-top:.5rem">A „Mohó” gomb után itt látod, hogyan csökken az újabb kezdők határhaszna.</div>`;
        root.dataset.result = JSON.stringify({
          graph: key, p, k, exact: Ls.exact, sel: sel.map(nm), user: sigU && +sigU.val.toFixed(4),
          greedy: rows.greedy && { S: rows.greedy.S.map(nm), v: +rows.greedy.sig.val.toFixed(4), steps: rows.greedy.steps.map(s => [nm(s.node), +s.total.toFixed(4)]) },
          degree: rows.degree && { S: rows.degree.S.map(nm), v: +rows.degree.sig.val.toFixed(4) },
          opt: rows.opt && rows.opt.S && { S: rows.opt.S.map(nm), v: +rows.opt.sig.val.toFixed(4) }
        });
      }
      onTheme(() => update());
      root._pos = lab => view.px(view.nodes[G.nodes.findIndex((nd, i) => nm(i) === lab)]);   // tesztelési horog
      build();
    };
  }
