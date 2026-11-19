  /* ==================================================================
     w1: 10.1–10.4 widgetjei (overlap-compare, naive-vs-qap, qap-lab, mrqap-lab)
     A saját segédfüggvények blokkban, hogy ne ütközzenek a w2 neveivel.
     ================================================================== */
  {
    const fmM = (x, d = 2) => fmt(x, d).replace(",", "{,}");                 // KaTeX-be
    const pct = (x, d = 0) => fmt(100 * x, d) + " %";
    const big = x => { const s = String(Math.round(x)); return s.length >= 5 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : s; };
    const sv = c => (String(c).startsWith("--") ? `var(${c})` : c);
    const dash = (c, dashed) => `<span style="display:inline-block;width:1.6em;height:0;border-top:3px ${dashed ? "dashed" : "solid"} ${sv(c)};vertical-align:.25em;margin-right:.25em"></span>`;
    const sq = c => `<span style="display:inline-block;width:.85em;height:.85em;border-radius:2px;background:${sv(c)};vertical-align:-.08em;margin-right:.25em"></span>`;
    const onTheme = fn => new MutationObserver(fn).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    /* p-érték kiírása: 0 permutációs találat → „< 1/runs” */
    const pTxt = (p, runs = 0) => (runs && p === 0 ? "< " + fmt(1 / runs, 4) : p < 0.001 ? "< 0,001" : fmt(p, 3));
    /* láthatóság: fn(true/false) */
    function watchVis(root, fn) {
      let inView = true;
      if ("IntersectionObserver" in window) new IntersectionObserver(es => es.forEach(e => { inView = e.isIntersecting; fn(inView && !document.hidden); })).observe(root);
      document.addEventListener("visibilitychange", () => fn(inView && !document.hidden));
    }
    /* saját vászon (diagramokhoz) */
    function canvasBox(parent, aspect, maxW = 760) {
      const c = h("canvas", { style: "display:block;touch-action:manipulation;max-width:100%" });
      parent.append(c);
      const o = { c, ctx: c.getContext("2d"), w: 0, h: 0, aspect, onResize: null };
      o.resize = () => {
        const w = Math.min(maxW, parent.clientWidth || 340), hh = Math.round(w * o.aspect), dpr = window.devicePixelRatio || 1;
        c.width = Math.round(w * dpr); c.height = Math.round(hh * dpr); c.style.width = w + "px"; c.style.height = hh + "px";
        o.ctx.setTransform(dpr, 0, 0, dpr, 0, 0); o.w = w; o.h = hh;
        if (o.onResize) o.onResize();
      };
      let t; addEventListener("resize", () => { clearTimeout(t); t = setTimeout(o.resize, 150); });
      onTheme(() => o.onResize && o.onResize());
      o.resize();
      return o;
    }
    /* koordináta-rendszer a vásznon → { X, Y } */
    function frame(o, { x0 = 0, x1 = 1, y0 = 0, y1 = 1, xt = [], yt = [], xl = "", yl = "", fx = v => fmt(v, 2), fy = v => fmt(v, 2), pad = {} }) {
      const ctx = o.ctx, Wd = o.w, Ht = o.h, P = Object.assign({ l: 52, r: 12, t: 12, b: 36 }, pad);
      ctx.clearRect(0, 0, Wd, Ht);
      const X = v => P.l + (v - x0) / (x1 - x0 || 1) * (Wd - P.l - P.r), Y = v => Ht - P.b - (v - y0) / (y1 - y0 || 1) * (Ht - P.t - P.b);
      const muted = GK.css("--muted"), border = GK.css("--border"), text = GK.css("--text");
      ctx.lineWidth = 1; ctx.font = "11px system-ui, sans-serif"; ctx.fillStyle = muted; ctx.setLineDash([]);
      yt.forEach(v => {
        ctx.strokeStyle = border; ctx.beginPath(); ctx.moveTo(P.l, Y(v)); ctx.lineTo(Wd - P.r, Y(v)); ctx.stroke();
        ctx.textAlign = "right"; ctx.textBaseline = "middle"; ctx.fillText(fy(v), P.l - 5, Y(v));
      });
      xt.forEach(v => {
        ctx.strokeStyle = border; ctx.beginPath(); ctx.moveTo(X(v), Ht - P.b); ctx.lineTo(X(v), Ht - P.b + 4); ctx.stroke();
        ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.fillText(fx(v), X(v), Ht - P.b + 6);
      });
      ctx.strokeStyle = text; ctx.globalAlpha = 0.6;
      ctx.beginPath(); ctx.moveTo(P.l, P.t); ctx.lineTo(P.l, Ht - P.b); ctx.lineTo(Wd - P.r, Ht - P.b); ctx.stroke(); ctx.globalAlpha = 1;
      ctx.fillStyle = text; ctx.font = "12px system-ui, sans-serif";
      if (xl) { ctx.textAlign = "center"; ctx.textBaseline = "bottom"; ctx.fillText(xl, P.l + (Wd - P.l - P.r) / 2, Ht - 2); }
      if (yl) { ctx.save(); ctx.translate(11, P.t + (Ht - P.t - P.b) / 2); ctx.rotate(-Math.PI / 2); ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(yl, 0, 0); ctx.restore(); }
      return { X, Y, P };
    }
    /* szép osztásközök [lo; hi]-ra */
    function ticks(lo, hi, k = 5) {
      const span = hi - lo || 1, raw = span / k, p = Math.pow(10, Math.floor(Math.log10(raw))), m = raw / p;
      const st = (m < 1.5 ? 1 : m < 3 ? 2 : m < 7 ? 5 : 10) * p, out = [];
      for (let v = Math.ceil(lo / st) * st; v <= hi + 1e-9; v += st) out.push(Math.abs(v) < 1e-12 ? 0 : +v.toFixed(10));
      return out;
    }
    /* darabolt futtatás: job(i), i = 0 … total−1; onProg(kész), onDone(); visszatér: leállító függvény */
    function chunked(total, per, job, onProg, onDone) {
      let i = 0, dead = false;
      const tick = () => {
        if (dead) return;
        const end = Math.min(total, i + per);
        for (; i < end; i++) job(i);
        onProg(i);
        if (i < total) setTimeout(tick, 0); else onDone && onDone();
      };
      setTimeout(tick, 0);
      return () => { dead = true; };
    }
    /* színek gyors keveréshez (rajzolásonként egyszer olvassuk ki) */
    const lerpC = (a, b, t) => `rgb(${a.map((x, i) => Math.round(x + (b[i] - x) * t)).join(",")})`;
    const normal = R => Math.sqrt(-2 * Math.log(1 - R())) * Math.cos(2 * Math.PI * R());     // Box–Muller
    /* a HIBÁS permutációs próba: a főátlón kívüli cellák vektorát egyenként keverjük (Fisher–Yates) */
    function shuffleVec(v, R) { const a = v.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
    /* cellavektor vissza mátrixba (ugyanaz a cellasorrend, mint az offdiag-ban) */
    function vecToMat(v, n, directed) {
      const M = zeros(n); let k = 0;
      for (let i = 0; i < n; i++) for (let j = directed ? 0 : i + 1; j < n; j++) if (i !== j) { M[i][j] = v[k++]; if (!directed) M[j][i] = M[i][j]; }
      return M;
    }
    const bin = M => M.map(r => r.map(v => (v > 0 ? 1 : 0)));
    const inv = P => { const q = new Array(P.length); P.forEach((v, i) => (q[v] = i)); return q; };

    /* ------------------------------------------------------------------
       10.1  overlap-compare – két részkorpusz hálózatának élátfedése
       ------------------------------------------------------------------ */
    W["overlap-compare"] = root => {
      header(root, "Két hálózat élátfedése: Jaccard-index",
        "Az Árvízhét szereplő-együttemlítési hálózata <b>részkorpuszokon</b>: két szereplő között él van, ha egy cikkben együtt szerepelnek, a súly a közös cikkek száma. " +
        "Válaszd ki a két oldalt! Mindkét rajzon ugyanott van a 7 szereplő, a vonalvastagság a súly. A közös élek kiemelve, a csak az egyik oldalon meglévők szaggatottan.");
      const narrow = root.clientWidth < 560;
      const DAY1 = ["H", "K", "Sze"];
      const SRC = [
        ["RH", "Reggeli Hírlap", a => a.paper === "RH"], ["EK", "Esti Krónika", a => a.paper === "EK"],
        ["NY", "Nyitott Szó", a => a.paper === "NY"], ["VN", "Vidéki Napló", a => a.paper === "VN"],
        ["first", "hét eleje (H–Sze)", a => DAY1.includes(a.day)], ["second", "hét vége (Cs–V)", a => !DAY1.includes(a.day)],
        ["all", "mind a 12 cikk", () => true]];
      const short = { RH: "RH", EK: "EK", NY: "NY", VN: "VN", first: "H–Sze", second: "Cs–V", all: "mind" };
      const M = {}; SRC.forEach(([k, , f]) => { M[k] = arvizMatrix(f); });
      let L = "VN", Rt = "NY";

      const c1 = h("div", { class: "controls" });
      const mkSel = (val, on) => {
        const s = h("select", { "aria-label": "részkorpusz", onchange: () => on(s.value) }, ...SRC.map(([k, l]) => h("option", { value: k }, l)));
        s.value = val; return s;
      };
      const sL = mkSel(L, v => { L = v; update(); }), sR = mkSel(Rt, v => { Rt = v; update(); });
      c1.append(h("label", null, "bal:", sL), h("label", null, "jobb:", sR),
        btn("⇄ csere", () => { [L, Rt] = [Rt, L]; sL.value = L; sR.value = Rt; update(); }));
      root.append(c1);

      const grid = h("div", { style: "display:grid;grid-template-columns:1fr 1fr;gap:.6rem" });
      const boxL = h("div"), boxR = h("div");
      const capL = h("div", { class: "muted", style: "font-size:.88rem;text-align:center;font-weight:600" }), capR = capL.cloneNode();
      boxL.append(capL); boxR.append(capR); grid.append(boxL, boxR);
      root.append(grid);
      const asp = 0.8, g0 = preset("arviz", asp);
      const nodesSmall = g0.nodes.map(nd => ({ label: nd.label, x: nd.x, y: nd.y }));
      const vL = new GK.View(boxL, { aspect: asp, radius: narrow ? 10 : 14, draggable: false, maxW: 360 });
      const vR = new GK.View(boxR, { aspect: asp, radius: narrow ? 10 : 14, draggable: false, maxW: 360 });
      const two = h("div", { class: "two-col", style: "margin-top:.6rem;align-items:start" }), boxO = h("div"), side = h("div");
      two.append(boxO, side); root.append(two);
      boxO.append(h("div", { class: "muted", style: "font-size:.88rem;text-align:center;font-weight:600" }, "egymásra téve"));
      const vO = new GK.View(boxO, { aspect: asp, radius: narrow ? 12 : 13, draggable: false, maxW: 420 });
      boxO.append(h("p", { class: "muted", style: "font-size:.86rem;margin:.3rem 0 0", html:
        `${dash("--accent")}közös ${dash("--setA", true)}csak bal ${dash("--setB", true)}csak jobb` }));
      const ro = h("div", { class: "readout" }), etab = h("div", { class: "tw", style: "overflow-x:auto;margin-top:.5rem" });
      side.append(ro, etab);
      root.append(h("p", { class: "muted", style: "margin:.8rem 0 .2rem;font-size:.9rem" }, "A négy lap páronként (cellában a Jaccard-index; kattints egy cellára):"));
      const jtab = h("div", { class: "tw", style: "overflow-x:auto" });
      root.append(jtab);
      root.append(h("p", { style: "margin:.5rem 0 0;font-weight:600" },
        "A Jaccard azt mondja meg, mennyi a közös – azt nem, hogy ez sok-e. Ehhez nullmodell kell (10.3)."));

      const wid = w => 1.4 + 1.5 * w;
      function update() {
        const A = M[L], B = M[Rt], ids = ARV_IDS, n = ids.length, J = jaccard(A, B);
        const nameOf = k => SRC.find(s => s[0] === k)[1];
        capL.textContent = "bal: " + nameOf(L); capR.textContent = "jobb: " + nameOf(Rt);
        const mk = (X, Y) => {
          const E = [];
          for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (X[i][j] > 0) {
            const both = Y[i][j] > 0;
            E.push({ a: i, b: j, w: X[i][j], color: both ? "--accent" : "--muted", dash: both ? null : [6, 4], width: wid(X[i][j]), alpha: both ? 1 : 0.85 });
          }
          return E;
        };
        vL.setGraph(nodesSmall, mk(A, B)); vR.setGraph(nodesSmall, mk(B, A));
        const EO = [], rows = [];
        for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
          const a = A[i][j], b = B[i][j];
          if (!a && !b) continue;
          const c = a && b ? "--accent" : a ? "--setA" : "--setB";
          EO.push({ a: i, b: j, w: Math.max(a, b), color: c, dash: a && b ? null : [6, 4], width: wid(Math.max(a, b)) });
          rows.push([ids[i] + "–" + ids[j], a, b, c]);
        }
        vO.setGraph(narrow ? nodesSmall : g0.nodes, EO);
        ro.innerHTML = `közös élek: <b>${J.both}</b> · unió: <b>${J.any}</b><br>$J = \\dfrac{|E_1 \\cap E_2|}{|E_1 \\cup E_2|} = \\dfrac{${J.both}}{${J.any}} = ${fmM(J.J, 3)}$` +
          `<br>$J_w = \\dfrac{\\sum \\min}{\\sum \\max} = \\dfrac{${J.wMin}}{${J.wMax}} = ${fmM(J.Jw, 3)}$`;
        etab.innerHTML = `<table class="tbl" style="font-size:.85rem"><thead><tr><th>él</th><th>bal</th><th>jobb</th><th>min</th><th>max</th></tr></thead><tbody>` +
          rows.map(([e, a, b, c]) => `<tr><td>${sq(c)}${e}</td><td>${a}</td><td>${b}</td><td>${Math.min(a, b)}</td><td>${Math.max(a, b)}</td></tr>`).join("") +
          `<tr style="font-weight:600"><td>összesen</td><td></td><td></td><td>${J.wMin}</td><td>${J.wMax}</td></tr></tbody></table>`;
        const P4 = ["RH", "EK", "NY", "VN"];
        let t = `<table class="tbl" style="font-size:.85rem;text-align:center"><thead><tr><th></th>${P4.map(p => `<th>${p}</th>`).join("")}</tr></thead><tbody>`;
        P4.forEach(p => {
          t += `<tr><th>${p}</th>` + P4.map(q => {
            const j = jaccard(M[p], M[q]), sel = (p === L && q === Rt) || (p === Rt && q === L);
            const st = sel ? "background:var(--accent-soft);font-weight:700;color:var(--accent);" : p === q ? "color:var(--muted);" : "";
            return `<td data-p="${p}" data-q="${q}" style="cursor:pointer;text-align:center;${st}">${fmt(j.J, 2)}<br><span class="muted" style="font-size:.75rem">${j.both}/${j.any}</span></td>`;
          }).join("") + "</tr>";
        });
        jtab.innerHTML = t + "</tbody></table>";
        root.dataset.ov = JSON.stringify({ L, R: Rt, both: J.both, any: J.any, J: +J.J.toFixed(4), wMin: J.wMin, wMax: J.wMax, Jw: +J.Jw.toFixed(4) });
        math(ro);
      }
      jtab.addEventListener("click", ev => {
        const td = ev.target.closest("td[data-p]"); if (!td || td.dataset.p === td.dataset.q) return;
        L = td.dataset.p; Rt = td.dataset.q; sL.value = L; sR.value = Rt; update();
      });
      update();
    };

    /* ------------------------------------------------------------------
       10.2  naive-vs-qap – két független hálózat, csúcshatással
       ------------------------------------------------------------------ */
    W["naive-vs-qap"] = root => {
      header(root, "Miért rossz a naiv p-érték?",
        "Két <b>egymástól független</b> véletlen súlyozott hálózat $n$ csúcson: $X_{ij} = \\rho\\,(u_i + u_j) + \\varepsilon_{ij}$, $Y_{ij} = \\rho\\,(v_i + v_j) + \\eta_{ij}$ " +
        "(minden tag független standard normális, $\\varepsilon_{ij} = \\varepsilon_{ji}$). A $\\rho$ a <b>csúcshatás</b>: van, aki minden hálózatban aktív (pl. egy sokat nyilatkozó szereplő), " +
        "ezért egy csúcs sorának cellái együtt mozognak. A két hálózat között semmi kapcsolat nincs – egy jó próba az esetek 5%-ában téved.");
      math(root.querySelector(".w-sub"));
      let n = 20, rho = 1, seed = 1, stop = null;
      const hist = [];
      const c1 = h("div", { class: "controls" }), c2 = h("div", { class: "controls" });
      c1.append(h("span", { class: "muted", style: "font-size:.92rem" }, "n ="));
      toggleGroup(c1, [[10, "10"], [20, "20"], [40, "40"]], n, v => { n = v; cancel(); one(); });
      const rOut = h("b", { style: "font-family:var(--mono);min-width:2.2em" }, fmt(rho, 1));
      const rSl = h("input", { type: "range", min: 0, max: 2, step: 0.1, value: rho, "aria-label": "ρ", style: "width:9rem;max-width:40vw",
        oninput: () => { rho = +rSl.value; rOut.textContent = fmt(rho, 1); }, onchange: () => { cancel(); one(); } });
      c1.append(h("label", null, "csúcshatás ρ =", rSl, rOut));
      const prog = h("span", { class: "muted", style: "font-size:.88rem" });
      c2.append(btn("1 kísérlet", () => { seed++; one(); }, "btn primary"), btn("200 kísérlet", () => many()), prog);
      root.append(c1, c2);

      const two = h("div", { class: "two-col", style: "align-items:start" }), left = h("div"), right = h("div");
      two.append(left, right); root.append(two);
      const hm = canvasBox(left, 0.56, 480), sc = canvasBox(right, 0.78, 420);
      left.append(h("p", { class: "muted", style: "font-size:.84rem;margin:.3rem 0 0", html:
        `${sq("--setA")}negatív ${sq("--setB")}pozitív cella · a csúcsok sorai csíkosak, ha ρ nagy` }));
      const ro = h("div", { class: "readout" });
      root.append(ro);
      const simBox = h("div", { style: "display:none;margin-top:.6rem" }), simTwo = h("div", { class: "two-col", style: "align-items:start" });
      const barBox = h("div"), tabBox = h("div", { class: "tw", style: "overflow-x:auto" });
      simTwo.append(barBox, tabBox); simBox.append(simTwo); root.append(simBox);
      const bars = canvasBox(barBox, 0.7, 380);
      root.append(h("p", { style: "margin:.5rem 0 0;font-weight:600" },
        "Ha a csúcsoknak saját »aktivitásuk« van, két teljesen független hálózat is gyakran »szignifikánsan« korrelál a naiv próbával – a QAP tartja az 5%-ot."));

      function gen(R) {
        const u = [], v = []; for (let i = 0; i < n; i++) { u.push(normal(R)); v.push(normal(R)); }
        const X = zeros(n), Y = zeros(n);
        for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
          X[i][j] = X[j][i] = rho * (u[i] + u[j]) + Math.SQRT1_2 * normal(R);   // zaj szórásnégyzete 0,5 (mint (E + Eᵀ)/2)
          Y[i][j] = Y[j][i] = rho * (v[i] + v[j]) + Math.SQRT1_2 * normal(R);
        }
        return { X, Y };
      }
      /* egy kísérlet: r, naiv p, QAP p (kétoldali, (k+1)/(runs+1)) */
      function test(X, Y, runs, R) {
        const a = offdiag(X), r = pearson(a, offdiag(Y)), N = a.length;
        let c = 0; for (let k = 0; k < runs; k++) if (Math.abs(pearson(a, offdiag(Y, false, randPerm(n, R)))) >= Math.abs(r) - 1e-12) c++;
        return { r, naive: naiveCorrP(r, N), qap: (c + 1) / (runs + 1), N };
      }
      let last = null;
      function one() {
        const R = rng(seed * 7919 + 17), g = gen(R), t = test(g.X, g.Y, 199, R);
        last = { g, t }; drawOne();
        ro.innerHTML = `$r = ${fmM(t.r, 3)}$ (${t.N} cellapár) · naiv p = <b>${pTxt(t.naive)}</b>${t.naive < 0.05 ? " (»szignifikáns«)" : ""} · ` +
          `QAP p = <b>${fmt(t.qap, 3)}</b> (199 permutáció)${t.qap < 0.05 ? " (»szignifikáns«)" : ""}`;
        math(ro);
        root.dataset.one = JSON.stringify({ n, rho, r: +t.r.toFixed(4), naive: +t.naive.toFixed(5), qap: +t.qap.toFixed(4) });
      }
      function drawOne() {
        if (!last) return;
        const { X, Y } = last.g, o = hm, ctx = o.ctx;
        ctx.clearRect(0, 0, o.w, o.h);
        const card = rgbOf("--card"), A = rgbOf("--setA"), Bc = rgbOf("--setB");
        let mx = 0; X.forEach((r, i) => r.forEach((v, j) => { if (i !== j) mx = Math.max(mx, Math.abs(v), Math.abs(Y[i][j])); }));
        const gap = 14, top = 20, S = Math.min((o.w - gap) / 2, o.h - top - 2), cs = S / n;
        [[X, "X"], [Y, "Y"]].forEach(([Mx, nm], k) => {
          const x0 = k * (S + gap);
          ctx.fillStyle = GK.css("--text"); ctx.font = "600 12px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "bottom";
          ctx.fillText(nm + " mátrix", x0 + S / 2, top - 4);
          for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
            const v = Mx[i][j], t = Math.min(1, Math.abs(v) / mx);
            ctx.fillStyle = i === j ? GK.css("--border") : lerpC(card, v >= 0 ? Bc : A, 0.1 + 0.9 * t);
            ctx.fillRect(x0 + j * cs, top + i * cs, Math.ceil(cs), Math.ceil(cs));
          }
          ctx.strokeStyle = GK.css("--border"); ctx.lineWidth = 1; ctx.strokeRect(x0 + 0.5, top + 0.5, S - 1, S - 1);
        });
        const a = offdiag(X), b = offdiag(Y);
        const lo = Math.min(...a, ...b), hi = Math.max(...a, ...b), pad = 0.05 * (hi - lo);
        const F = frame(sc, { x0: lo - pad, x1: hi + pad, y0: lo - pad, y1: hi + pad, xt: ticks(lo, hi, 4), yt: ticks(lo, hi, 4), xl: "X cella", yl: "Y cella", fx: v => fmt(v, 1), fy: v => fmt(v, 1), pad: { l: 40 } });
        const c2 = sc.ctx; c2.fillStyle = GK.css("--accent"); c2.globalAlpha = n >= 40 ? 0.35 : 0.55;
        for (let i = 0; i < a.length; i++) { c2.beginPath(); c2.arc(F.X(a[i]), F.Y(b[i]), n >= 40 ? 2 : 2.8, 0, 2 * Math.PI); c2.fill(); }
        c2.globalAlpha = 1;
      }
      hm.onResize = drawOne; sc.onResize = drawOne;
      function cancel() { if (stop) { stop(); stop = null; prog.textContent = ""; } }
      let simRes = null;
      function many() {
        cancel();
        const RUNS = 200, R = rng(seed * 104729 + n * 31 + Math.round(rho * 10)), nn = n, rr = rho;
        let cn = 0, cq = 0;
        simRes = { n: nn, rho: rr, done: 0, naive: 0, qap: 0 };
        simBox.style.display = "";
        stop = chunked(RUNS, nn >= 40 ? 2 : nn >= 20 ? 6 : 20, () => {
          const g = gen(R), t = test(g.X, g.Y, 199, R);
          if (t.naive < 0.05) cn++; if (t.qap < 0.05) cq++;
        }, k => {
          simRes = { n: nn, rho: rr, done: k, naive: cn / k, qap: cq / k };
          prog.innerHTML = `<progress max="${RUNS}" value="${k}" style="vertical-align:middle;width:7rem"></progress> ${k} / ${RUNS} kísérlet`;
          drawBars();
        }, () => {
          stop = null; seed++;
          hist.unshift(simRes); if (hist.length > 8) hist.pop();
          drawTab();
          root.dataset.sim = JSON.stringify({ n: nn, rho: rr, naive: simRes.naive, qap: simRes.qap, runs: RUNS });
        });
      }
      function drawBars() {
        if (!simRes) return;
        const ym = Math.max(0.6, simRes.naive + 0.05, simRes.qap + 0.05);
        const F = frame(bars, { x0: 0, x1: 2, y0: 0, y1: ym, yt: ticks(0, ym, 5), fy: v => fmt(100 * v, 0) + "%", yl: "p < 0,05 aránya", pad: { l: 52, t: 22 } });
        const ctx = bars.ctx;
        [[simRes.naive, "naiv t-próba", "--setB"], [simRes.qap, "QAP", "--setC"]].forEach(([v, l, c], i) => {
          const x = F.X(i + 0.2), w = F.X(0.6) - F.X(0);
          ctx.fillStyle = GK.css(c); ctx.fillRect(x, F.Y(v), w, F.Y(0) - F.Y(v));
          ctx.fillStyle = GK.css("--text"); ctx.font = "600 12px system-ui, sans-serif"; ctx.textAlign = "center";
          ctx.textBaseline = "bottom"; ctx.fillText(pct(v, 1), x + w / 2, F.Y(v) - 3);
          ctx.textBaseline = "top"; ctx.font = "12px system-ui, sans-serif"; ctx.fillText(l, x + w / 2, F.Y(0) + 6);
        });
        ctx.strokeStyle = GK.css("--accent"); ctx.lineWidth = 1.5; ctx.setLineDash([6, 4]);
        ctx.beginPath(); ctx.moveTo(F.X(0), F.Y(0.05)); ctx.lineTo(F.X(2), F.Y(0.05)); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = GK.css("--accent"); ctx.font = "11px system-ui, sans-serif"; ctx.textAlign = "right"; ctx.textBaseline = "bottom";
        ctx.fillText("elvárt: 5%", F.X(2) - 2, F.Y(0.05) - 2);
        ctx.fillStyle = GK.css("--muted"); ctx.textAlign = "left"; ctx.textBaseline = "top";
        ctx.fillText(`n = ${simRes.n}, ρ = ${fmt(simRes.rho, 1)} · ${simRes.done} kísérlet`, F.X(0) + 4, 4);
      }
      function drawTab() {
        tabBox.innerHTML = `<p class="muted" style="font-size:.86rem;margin:0 0 .3rem">Eddigi 200-as sorozatok (hányszor lett p &lt; 0,05):</p>` +
          `<table class="tbl" style="font-size:.85rem"><thead><tr><th>n</th><th>ρ</th><th>naiv</th><th>QAP</th></tr></thead><tbody>` +
          hist.map(s => `<tr><td>${s.n}</td><td>${fmt(s.rho, 1)}</td><td>${pct(s.naive, 1)}</td><td>${pct(s.qap, 1)}</td></tr>`).join("") + "</tbody></table>";
      }
      bars.onResize = drawBars;
      one();
    };

    /* ------------------------------------------------------------------
       10.3  qap-lab – a QAP-próba lépésről lépésre
       ------------------------------------------------------------------ */
    W["qap-lab"] = root => {
      header(root, "QAP-labor: permutáld a csúcsokat!",
        "A jobb oldali mátrix <b>sorait és oszlopait együtt</b> keverjük: a hálózat szerkezete megmarad, csak a csúcsok neve cserélődik. " +
        "Minden permutáció után újra kiszámoljuk a két mátrix (főátlón kívüli) celláinak korrelációját, $r^*$-ot. " +
        "Ha a megfigyelt $r$ ritkán fordul elő a permutáltak között, akkor a két hálózat egyezése nem a véletlen műve.");
      math(root.querySelector(".w-sub"));
      const narrow = root.clientWidth < 560;
      const IDS4 = ["Po", "Vi", "La", "Ön"], DAY1 = ["H", "K", "Sze"], K = krackData();
      const PAIRS = [["a", "VN vs. NY, 4 szereplő"], ["b", "VN vs. NY, 7 szereplő"], ["c", "hét eleje vs. hét vége"],
        ["d", "Krackhardt: tanácskérés vs. barátság"], ["e", "Krackhardt: tanácskérés vs. kinek jelent"]];
      let key = "a", weighted = false, cells = false, twoSided = false;
      let cur = null, rs = [], exact = false, lastR = null, pos = null, animT = null, vis = true, R = rng(11);

      function load() {
        const kl = Array.from({ length: 21 }, (_, i) => String(i + 1));
        if (key === "a") return { A: bin(arvizMatrix(a => a.paper === "VN", IDS4)), B: bin(arvizMatrix(a => a.paper === "NY", IDS4)), labels: IDS4, directed: false, nA: "Vidéki Napló", nB: "Nyitott Szó" };
        if (key === "b") return { A: bin(arvizMatrix(a => a.paper === "VN")), B: bin(arvizMatrix(a => a.paper === "NY")), labels: ARV_IDS, directed: false, nA: "Vidéki Napló", nB: "Nyitott Szó" };
        if (key === "c") {
          const F = arvizMatrix(a => DAY1.includes(a.day)), S = arvizMatrix(a => !DAY1.includes(a.day));
          return { A: weighted ? F : bin(F), B: weighted ? S : bin(S), labels: ARV_IDS, directed: false, nA: "hét eleje", nB: "hét vége" };
        }
        return { A: K.advice, B: key === "d" ? K.friendship : K.reports, labels: kl, directed: true, nA: "tanácskérés", nB: key === "d" ? "barátság" : "kinek jelent" };
      }

      const c1 = h("div", { class: "controls" }), c2 = h("div", { class: "controls" }), c3 = h("div", { class: "controls" });
      const sel = h("select", { "aria-label": "melyik pár", style: "max-width:calc(100vw - 7rem)", onchange: () => { key = sel.value; reset(true); } }, ...PAIRS.map(([k, l]) => h("option", { value: k }, l)));
      const cbW = h("input", { type: "checkbox", onchange: () => { weighted = cbW.checked; reset(true); } });
      const lbW = h("label", null, cbW, "súlyozott");
      c1.append(h("label", null, "pár:", sel), lbW);
      const bExact = btn("Mind az n!", () => runExact());
      c2.append(btn("Permutálj", () => permOne(), "btn primary"), btn("×100", () => permMany(100)), btn("×1000", () => permMany(1000)), bExact,
        btn("Újra", () => reset(false)));
      const cb2 = h("input", { type: "checkbox", onchange: () => { twoSided = cb2.checked; refresh(); } });
      const cbCell = h("input", { type: "checkbox", onchange: () => { cells = cbCell.checked; reset(false); } });
      c3.append(h("label", null, cb2, "kétoldali (|r*| ≥ |r|)"), h("label", null, cbCell, "hibás: a cellákat egyenként keverd"));
      root.append(c1, c2, c3);

      const two = h("div", { class: "two-col", style: "align-items:start" }), left = h("div"), right = h("div");
      two.append(left, right); root.append(two);
      const mc = canvasBox(left, 0.56, 560), hc = canvasBox(right, 0.72, 520);
      const legM = h("p", { class: "muted", style: "font-size:.84rem;margin:.3rem 0 0" });
      left.append(legM);
      right.append(h("p", { class: "muted", style: "font-size:.84rem;margin:.3rem 0 0", html:
        `${sq("--setB")}legalább olyan szélsőséges, mint a megfigyelt ${sq("--muted")}a többi · ${dash("--accent")}megfigyelt $r$` }));
      math(right);
      const warn = h("div", { class: "readout", style: "display:none;font-family:inherit;border-left:4px solid var(--setB)" });
      const ro = h("div", { class: "readout" });
      root.append(ro, warn);
      root.append(h("p", { style: "margin:.5rem 0 0;font-weight:600" },
        "A QAP a hálózat szerkezetét megtartja, csak a csúcsok nevét keveri össze – így azt kérdezi: ugyanez a két szerkezet véletlenül egymásra téve is ennyire egyezne?"));
      watchVis(root, v => { vis = v; if (!v && animT) finishAnim(); });

      const fact = k => { let f = 1; for (let i = 2; i <= k; i++) f *= i; return f; };
      function rStar(P) { return pearson(cur.a, offdiag(cur.B, cur.directed, P)); }
      function rCell() { const v = shuffleVec(cur.b, R); return { v, r: pearson(cur.a, v) }; }
      function reset(newData) {
        if (newData) {
          cur = load(); cur.n = cur.A.length; cur.a = offdiag(cur.A, cur.directed); cur.b = offdiag(cur.B, cur.directed); cur.r = pearson(cur.a, cur.b);
          cur.N = cur.a.length; cur.naive = naiveCorrP(cur.r, cur.N);
          cur.maxA = Math.max(1, ...cur.A.flat()); cur.maxB = Math.max(1, ...cur.B.flat());
        }
        lbW.style.display = key === "c" ? "" : "none";
        bExact.style.display = cur.n <= 8 && !cells ? "" : "none";
        cur.Bdisp = null;
        bExact.textContent = `Mind a ${cur.n}! = ${big(fact(cur.n))}`;
        rs = []; exact = false; lastR = null; finishAnim();
        pos = { from: null, to: [...Array(cur.n).keys()], cur: [...Array(cur.n).keys()] };
        legM.innerHTML = cur.n <= 8
          ? `${sq("--setA")}${sq("--setB")}van él (szám: súly) · keretezve: a két mátrix ugyanazon cellája is él · szürke: főátló`
          : `${sq("--setA")}${sq("--setB")}van él · keretezve: mindkét mátrixban él · szürke: főátló · sor: aki kérdez / akitől indul az él`;
        refresh(); drawMats();
      }
      /* animáció: a B csúcsainak megjelenítési helye (sor; QAP-nál oszlop is) */
      function setPerm(P, animate) {
        const to = inv(P);
        if (animate && vis) {
          pos.from = pos.cur.slice(); pos.to = to; const t0 = performance.now(), ms = 650;
          const step = t => {
            const u = Math.min(1, (t - t0) / ms), e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
            pos.cur = pos.from.map((f, i) => f + (pos.to[i] - f) * e);
            drawMats(u < 1);
            animT = u < 1 ? requestAnimationFrame(step) : null;
          };
          if (animT) cancelAnimationFrame(animT);
          animT = requestAnimationFrame(step);
        } else { finishAnim(); pos.to = to; pos.cur = to.slice(); drawMats(); }
      }
      function finishAnim() { if (animT) { cancelAnimationFrame(animT); animT = null; } if (pos) pos.cur = pos.to.slice(); }
      function startSample() { if (exact) { rs = []; exact = false; } }
      function permOne() {
        startSample();
        if (cells) { const c = rCell(); lastR = c.r; rs.push(c.r); cur.Bdisp = vecToMat(c.v, cur.n, cur.directed); refresh(); drawMats(); return; }
        const P = randPerm(cur.n, R); lastR = rStar(P); rs.push(lastR); setPerm(P, true); refresh();
      }
      function permMany(k) {
        startSample(); let P;
        if (cells) { let c; for (let i = 0; i < k; i++) { c = rCell(); rs.push(c.r); } lastR = c.r; cur.Bdisp = vecToMat(c.v, cur.n, cur.directed); refresh(); drawMats(); return; }
        for (let i = 0; i < k; i++) { P = randPerm(cur.n, R); rs.push(rStar(P)); }
        lastR = rs[rs.length - 1]; setPerm(P, false); refresh();
      }
      function runExact() {
        if (cells) return;
        rs = []; let lastP = null;
        forEachPerm(cur.n, P => { rs.push(rStar(P)); lastP = P; });
        exact = true; lastR = null; setPerm([...Array(cur.n).keys()], false); refresh();
      }
      function stats() {
        const eps = 1e-9, r = cur.r, m = rs.length;
        const ge = rs.filter(x => (twoSided ? Math.abs(x) >= Math.abs(r) - eps : x >= r - eps)).length;
        const ms = m ? meanSd(rs) : { mean: NaN, sd: NaN };
        return { m, ge, p: m ? ge / m : NaN, mean: ms.mean, sd: ms.sd };
      }
      function refresh() {
        const s = stats();
        ro.innerHTML = `megfigyelt $r = ${fmM(cur.r, 3)}$ (${cur.N} cella${cur.directed ? ", irányított" : ""}) · naiv p = ${pTxt(cur.naive)} (t-próba)` +
          (lastR != null ? `<br>utolsó permutáció: $r^* = ${fmM(lastR, 3)}$` : "") +
          `<br>permutációk: <b>${big(s.m)}</b>${exact ? ` (mind a ${cur.n}!)` : ""}` +
          (s.m ? ` · ${twoSided ? "$|r^*| \\ge |r|$" : "$r^* \\ge r$"}: <b>${big(s.ge)}</b> → ${cells ? "»p«" : "p"} = <b>${fmt(s.p, 4)}</b> (${twoSided ? "kétoldali" : "egyoldali"})` +
            `<br>$r^*$ átlaga ${fmt(Math.abs(s.mean) < 5e-4 ? 0 : s.mean, 3)}, szórása <b>${fmt(s.sd, 3)}</b>` : " – nyomd meg a »Permutálj« gombot!");
        math(ro);
        warn.style.display = cells ? "" : "none";
        warn.innerHTML = cells ? "<b>Ez nem QAP:</b> a cellák függetlenségét feltételezi, ezért a nulleloszlás túl szűk, a p-érték túl kicsi. " +
          "A cellák egyenkénti keverése szétszedi a mátrix szerkezetét: eltűnik, hogy egy csúcs sorának cellái együtt mozognak (van, aki mindenkitől kér tanácsot). " +
          "Hasonlítsd össze a szórást a helyes QAP-éval – a Krackhardt tanácskérés–barátság páron ≈ 0,049 a ≈ 0,072 helyett." : "";
        drawHist();
        root.dataset.qap = JSON.stringify({ key, weighted, cells, twoSided, r: +cur.r.toFixed(4), naive: +cur.naive.toFixed(5), runs: s.m, ge: s.ge, p: +(+s.p).toFixed(5), mean: +(+s.mean).toFixed(4), sd: +(+s.sd).toFixed(4), exact });
      }
      function drawMats(anim = false) {
        if (!cur) return;
        const o = mc, ctx = o.ctx, n = cur.n, big_ = n > 8;
        ctx.clearRect(0, 0, o.w, o.h);
        const card = rgbOf("--card"), cA = rgbOf("--setA"), cB = rgbOf("--setB"), text = GK.css("--text"), muted = GK.css("--muted"), border = GK.css("--border"), acc = GK.css("--accent");
        const gap = 12, lab = big_ ? 15 : 22, top = 18 + lab;
        const S = Math.max(40, Math.min((o.w - gap - 2 * lab) / 2, o.h - top - 4)), cs = S / n;
        const fs = big_ ? Math.max(7, Math.min(9, cs * 0.9)) : 12;
        const ident = i => i, showB = cells && cur.Bdisp ? cur.Bdisp : cur.B;
        const rowPos = cells ? ident : (u => pos.cur[u]), colPos = cells ? ident : (v => pos.cur[v]);
        const permuted = cells ? !!cur.Bdisp : pos.cur.some((p, i) => Math.abs(p - i) > 1e-9);
        [[cur.A, cur.nA, cA, ident, ident, cur.maxA], [showB, cur.nB + (permuted ? (cells ? " (cellák keverve)" : " (permutálva)") : ""), cB, rowPos, colPos, cur.maxB]].forEach(([M, nm, col, rp, cp, mx], k) => {
          const x0 = lab + k * (S + gap + lab);
          ctx.fillStyle = text; ctx.font = "600 12px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "top";
          ctx.fillText(nm, x0 + S / 2, 0, S + lab);
          ctx.font = `${fs}px system-ui, sans-serif`; ctx.fillStyle = muted;
          for (let u = 0; u < n; u++) {                     // címkék
            ctx.textAlign = "right"; ctx.textBaseline = "middle"; ctx.fillText(cur.labels[u], x0 - 3, top + (rp(u) + 0.5) * cs);
            if (cs >= 12 || (k === 0 && (u === 0 || (u + 1) % 5 === 0))) { ctx.textAlign = "center"; ctx.textBaseline = "bottom"; ctx.fillText(cur.labels[u], x0 + (cp(u) + 0.5) * cs, top - 2); }
          }
          for (let u = 0; u < n; u++) for (let v = 0; v < n; v++) {
            const val = M[u][v], x = x0 + cp(v) * cs, y = top + rp(u) * cs;
            ctx.fillStyle = u === v ? border : val > 0 ? lerpC(card, col, 0.35 + 0.65 * val / mx) : lerpC(card, col, 0.04);
            ctx.fillRect(x, y, cs + 0.5, cs + 0.5);
            if (!big_) {
              ctx.strokeStyle = border; ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, y + 0.5, cs - 1, cs - 1);
              if (u !== v) { ctx.fillStyle = val > 0 ? text : muted; ctx.font = `${val > 0 ? "600 " : ""}${Math.min(14, cs * 0.45)}px system-ui, sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(String(val), x + cs / 2, y + cs / 2 + 0.5); }
            }
          }
          ctx.strokeStyle = border; ctx.lineWidth = 1; ctx.strokeRect(x0 + 0.5, top + 0.5, S - 1, S - 1);
          if (k === 1 && !anim) {                           // egyezések kerete
            ctx.strokeStyle = acc; ctx.lineWidth = big_ ? 1.2 : 2.5;
            for (let u = 0; u < n; u++) for (let v = 0; v < n; v++) {
              if (u === v || !(M[u][v] > 0)) continue;
              const i = Math.round(rp(u)), j = Math.round(cp(v));
              if (i !== j && cur.A[i][j] > 0) ctx.strokeRect(x0 + j * cs + 1.5, top + i * cs + 1.5, cs - 3, cs - 3);
            }
          }
        });
      }
      function drawHist() {
        const o = hc, r = cur.r, eps = 1e-9, ext = x => (twoSided ? Math.abs(x) >= Math.abs(r) - eps : x >= r - eps);
        const muted = GK.css("--muted"), hot = GK.css("--setB"), acc = GK.css("--accent");
        if (!rs.length) {
          const F = frame(o, { x0: -1, x1: 1, y0: 0, y1: 1, xt: [-1, -0.5, 0, 0.5, 1], xl: "permutált korreláció r*", pad: { l: 14 } });
          vline(F, r, 1); return;
        }
        const cnt = new Map(); rs.forEach(x => { const k = Math.round(x * 1e6) / 1e6; cnt.set(k, (cnt.get(k) || 0) + 1); });
        const discrete = cnt.size <= 15;
        let lo = Math.min(r, ...rs), hi = Math.max(r, ...rs);
        if (discrete) { lo = Math.min(lo, -0.2); hi = Math.max(hi, 0.2); }
        const pad = 0.08 * (hi - lo || 1); lo -= pad; hi += pad;
        if (discrete) {
          const ym = Math.max(...cnt.values()) * 1.18;
          const F = frame(o, { x0: lo, x1: hi, y0: 0, y1: ym, xt: ticks(lo, hi, 5), yt: ticks(0, ym, 4).filter(v => Number.isInteger(v)), fy: v => big(v), xl: "permutált korreláció r*", yl: "darab", pad: { l: 46, t: 14 } });
          const ctx = o.ctx;
          [...cnt.entries()].forEach(([v, c]) => {
            ctx.strokeStyle = ext(v) ? hot : muted; ctx.lineWidth = 7; ctx.lineCap = "butt";
            ctx.beginPath(); ctx.moveTo(F.X(v), F.Y(0)); ctx.lineTo(F.X(v), F.Y(c)); ctx.stroke();
            ctx.fillStyle = GK.css("--text"); ctx.font = "600 11px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "bottom";
            ctx.fillText(big(c), F.X(v), F.Y(c) - 3);
          });
          vline(F, r, ym);
        } else {
          const NB = 32, bw = (hi - lo) / NB, hcnt = new Array(NB).fill(0), hhot = new Array(NB).fill(0);
          rs.forEach(x => { const b = Math.min(NB - 1, Math.max(0, Math.floor((x - lo) / bw))); hcnt[b]++; if (ext(x)) hhot[b]++; });
          const ym = Math.max(...hcnt) * 1.12;
          const F = frame(o, { x0: lo, x1: hi, y0: 0, y1: ym, xt: ticks(lo, hi, 5), yt: ticks(0, ym, 4).filter(v => Number.isInteger(v)), fy: v => big(v), xl: "permutált korreláció r*", yl: "darab", pad: { l: 46, t: 14 } });
          const ctx = o.ctx;
          hcnt.forEach((c, b) => {
            if (!c) return;
            const x = F.X(lo + b * bw) + 0.5, w = Math.max(1, F.X(lo + (b + 1) * bw) - F.X(lo + b * bw) - 1);
            ctx.fillStyle = muted; ctx.globalAlpha = 0.7; ctx.fillRect(x, F.Y(c - hhot[b]), w, F.Y(0) - F.Y(c - hhot[b]));
            ctx.globalAlpha = 1; ctx.fillStyle = hot; ctx.fillRect(x, F.Y(c), w, F.Y(c - hhot[b]) - F.Y(c));
          });
          vline(F, r, ym);
        }
      }
      function vline(F, r, ym) {
        const ctx = hc.ctx, acc = GK.css("--accent");
        const lines = twoSided && Math.abs(r) > 1e-9 ? [r, -r] : [r];
        lines.forEach((v, i) => {
          ctx.strokeStyle = acc; ctx.lineWidth = 2; ctx.setLineDash(i ? [5, 4] : []);
          ctx.beginPath(); ctx.moveTo(F.X(v), F.Y(0)); ctx.lineTo(F.X(v), F.Y(ym)); ctx.stroke(); ctx.setLineDash([]);
        });
        ctx.fillStyle = acc; ctx.font = "600 11px system-ui, sans-serif"; ctx.textBaseline = "top";
        const xr = F.X(r), right = xr > hc.w * 0.7;
        ctx.textAlign = right ? "right" : "left"; ctx.fillText("r = " + fmt(r, 3), xr + (right ? -4 : 4), F.Y(ym) + 1);
      }
      mc.onResize = () => drawMats(); hc.onResize = () => cur && drawHist();
      reset(true);
    };

    /* ------------------------------------------------------------------
       10.4  mrqap-lab – többszörös regresszió hálózatokon, permutációs p-értékkel
       ------------------------------------------------------------------ */
    W["mrqap-lab"] = root => {
      header(root, "MRQAP: kitől kérnek tanácsot a menedzserek?",
        "Krackhardt 21 menedzsere. Függő változó: $Y_{ij} = 1$, ha $i$ tanácsot kér $j$-től (420 rendezett pár). " +
        "Pipáld be a magyarázó hálózatokat, és nézd meg, mi történik a barátság együtthatójával és p-értékével! " +
        "A naiv OLS úgy tesz, mintha a 420 cella független volna; a <b>Y-permutáció</b> a függő mátrix csúcsait keveri, a <b>DSP</b> (kettős szemi-parciális) " +
        "az adott magyarázót a többiekre regresszálja, és a maradék mátrixot permutálja.");
      math(root.querySelector(".w-sub"));
      const K = krackData(), n = K.n;
      const TEN = zeros(n); for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (i !== j) TEN[i][j] = K.att.tenure[j];
      const VARS = [["fr", "barátság", K.friendship], ["rep", "kinek jelent", K.reports], ["same", "azonos részleg", K.sameDept],
        ["ten", "a megkérdezett ideje a cégnél (év)", TEN]];
      const y = offdiag(K.advice, true), xv = {}; VARS.forEach(([k, , M]) => (xv[k] = offdiag(M, true)));
      const on = { fr: true, rep: false, same: false, ten: false };
      let method = "dsp", runs = 500, seed = 1, stop = null, res = null;

      const c1 = h("div", { class: "controls" }), c2 = h("div", { class: "controls" }), c3 = h("div", { class: "controls" });
      c1.append(h("span", { class: "muted", style: "font-size:.92rem" }, "magyarázók:"));
      VARS.forEach(([k, l]) => {
        const cb = h("input", { type: "checkbox", onchange: () => { on[k] = cb.checked; if (!VARS.some(v => on[v[0]])) { on[k] = true; cb.checked = true; } compute(); } });
        cb.checked = on[k]; c1.append(h("label", null, cb, l));
      });
      c2.append(h("span", { class: "muted", style: "font-size:.92rem" }, "p-érték:"));
      toggleGroup(c2, [["ols", "naiv OLS"], ["y", "Y-permutáció"], ["dsp", "DSP"]], method, v => { method = v; compute(); });
      c3.append(h("span", { class: "muted", style: "font-size:.92rem" }, "permutációk:"));
      toggleGroup(c3, [[500, "500"], [2000, "2000"]], runs, v => { runs = v; compute(); });
      const prog = h("span", { class: "muted", style: "font-size:.88rem" });
      c3.append(btn("Újra (más véletlen)", () => { seed++; compute(); }), prog);
      root.append(c1, c2, c3);

      const two = h("div", { class: "two-col", style: "align-items:start" }), left = h("div"), right = h("div");
      two.append(left, right); root.append(two);
      const tab = h("div", { class: "tw", style: "overflow-x:auto" }), ro = h("div", { class: "readout" });
      left.append(tab, ro);
      const capT = h("p", { class: "muted", style: "font-size:.84rem;margin:0 0 .2rem", html:
        `A permutált $t^*$ eloszlása változónként ${sq("--muted")}; ${dash("--accent")}megfigyelt $t$, ${dash("--accent", true)}$-t$ (a kétoldali p a két vonalon kívüli rész)` });
      right.append(capT); math(capT);
      const tc = canvasBox(right, 0.5, 520);
      root.append(h("p", { style: "margin:.5rem 0 0;font-weight:600" },
        "Egyenként a barátság is »szignifikáns«, de ha a főnöki viszonyt is beveszed, elveszíti a hatását: a tanácsot inkább a főnöködtől kéred, és a főnöködet gyakran barátnak is mondod."));

      function compute() {
        if (stop) { stop(); stop = null; }
        const keys = VARS.map(v => v[0]).filter(k => on[k]), xs = keys.map(k => xv[k]), Kn = xs.length;
        const fit = ols(y, xs), naiveP = fit.t.map(t => tTwoSided(t, fit.df));
        res = { keys, fit, naiveP, cnt: new Array(Kn).fill(0), tstar: keys.map(() => []), done: 0, total: method === "ols" ? 0 : runs, method };
        prog.textContent = "";
        if (method === "ols") { render(); return; }
        const R = rng(seed * 7919 + runs + (method === "y" ? 1 : 2)), eps = 1e-9;
        let E = null;
        if (method === "dsp") {
          E = xs.map((x, k) => {
            const others = xs.filter((_, j) => j !== k), f = ols(x, others);
            const e = x.map((v, i) => v - f.b[0] - others.reduce((s, o, j) => s + f.b[j + 1] * o[i], 0));
            const M = zeros(n); let idx = 0;
            for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (i !== j) M[i][j] = e[idx++];
            return { M, others };
          });
        }
        const r0 = res;
        render();
        stop = chunked(runs, method === "y" ? 60 : Math.max(10, Math.round(60 / Kn)), () => {
          const P = randPerm(n, R);
          if (method === "y") {
            const f = ols(offdiag(K.advice, true, P), xs);
            for (let k = 0; k < Kn; k++) { r0.tstar[k].push(f.t[k + 1]); if (Math.abs(f.t[k + 1]) >= Math.abs(fit.t[k + 1]) - eps) r0.cnt[k]++; }
          } else {
            for (let k = 0; k < Kn; k++) {
              const f = ols(y, [offdiag(E[k].M, true, P), ...E[k].others]);
              r0.tstar[k].push(f.t[1]); if (Math.abs(f.t[1]) >= Math.abs(fit.t[k + 1]) - eps) r0.cnt[k]++;
            }
          }
        }, k => {
          r0.done = k;
          prog.innerHTML = k < runs ? `<progress max="${runs}" value="${k}" style="vertical-align:middle;width:7rem"></progress> ${big(k)} / ${big(runs)}` : `kész: ${big(runs)} permutáció`;
          render();
        }, () => { stop = null; });
      }
      function render() {
        const r = res, f = r.fit, perm = r.method !== "ols", fin = !perm || r.done === r.total;
        const nameOf = k => VARS.find(v => v[0] === k)[1];
        const pP = k => (r.done ? r.cnt[k] / r.done : NaN);
        let t = `<table class="tbl" style="font-size:.86rem;white-space:nowrap"><thead><tr><th>változó</th><th>$b$</th><th>$t$</th><th>naiv p</th>${perm ? `<th>${r.method === "y" ? "Y-perm." : "DSP"} p</th>` : ""}</tr></thead><tbody>`;
        t += `<tr><td>tengelymetszet</td><td>${fmt(f.b[0], 3)}</td><td>${fmt(f.t[0], 2)}</td><td>${pTxt(r.naiveP[0])}</td>${perm ? "<td>–</td>" : ""}</tr>`;
        r.keys.forEach((k, i) => {
          const sig = perm ? pP(i) < 0.05 : r.naiveP[i + 1] < 0.05;
          t += `<tr${sig && fin ? ' style="font-weight:600"' : ""}><td>${nameOf(k)}</td><td>${fmt(f.b[i + 1], 3)}</td><td>${fmt(f.t[i + 1], 2)}</td><td>${pTxt(r.naiveP[i + 1])}</td>` +
            (perm ? `<td>${r.done ? pTxt(pP(i), r.done) : "…"}</td>` : "") + "</tr>";
        });
        tab.innerHTML = t + "</tbody></table>";
        ro.innerHTML = `$R^2 = ${fmM(f.r2, 3)}$ · $N = ${y.length}$ cella` + (perm ? ` · ${big(r.done)} / ${big(r.total)} permutáció` : "") +
          `<br><span style="font-family:inherit">félkövér: p &lt; 0,05${perm ? " (a permutációs p szerint)" : " (a naiv p szerint – óvatosan!)"}</span>`;
        math(tab); math(ro);
        drawT();
        root.dataset.mrqap = JSON.stringify({ keys: r.keys, method: r.method, b: f.b.map(v => +v.toFixed(4)), naiveP: r.naiveP.map(v => +v.toFixed(5)),
          permP: r.keys.map((_, i) => (r.done ? +(r.cnt[i] / r.done).toFixed(4) : null)), r2: +f.r2.toFixed(4), done: r.done, total: r.total });
      }
      function drawT() {
        const r = res, o = tc, Kn = r.keys.length, rowH = 62;
        const asp = Math.max(0.3, (Kn * rowH + 34) / Math.max(200, o.w));
        if (Math.abs(asp - o.aspect) > 1e-3) { o.aspect = asp; o.onResize = null; o.resize(); o.onResize = drawT; }
        const ctx = o.ctx, Wd = o.w; ctx.clearRect(0, 0, Wd, o.h);
        const muted = GK.css("--muted"), acc = GK.css("--accent"), text = GK.css("--text"), border = GK.css("--border");
        let M = 3; r.keys.forEach((_, i) => { M = Math.max(M, Math.abs(r.fit.t[i + 1]) * 1.1); r.tstar[i].forEach(v => { M = Math.max(M, Math.abs(v)); }); });
        M = Math.min(M, 20);
        const l = 10, rr = 10, X = v => l + (Math.max(-M, Math.min(M, v)) + M) / (2 * M) * (Wd - l - rr);
        r.keys.forEach((k, i) => {
          const y0 = i * rowH, base = y0 + rowH - 8;
          ctx.fillStyle = text; ctx.font = "600 12px system-ui, sans-serif"; ctx.textAlign = "left"; ctx.textBaseline = "top";
          ctx.fillText(VARS.find(v => v[0] === k)[1], l, y0 + 2, Wd - 20);
          ctx.strokeStyle = border; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(l, base + 0.5); ctx.lineTo(Wd - rr, base + 0.5); ctx.stroke();
          const ts = r.tstar[i];
          if (ts.length) {
            const NB = 40, cnt = new Array(NB).fill(0); ts.forEach(v => { cnt[Math.min(NB - 1, Math.max(0, Math.floor((v + M) / (2 * M) * NB)))]++; });
            const mx = Math.max(...cnt), bw = (Wd - l - rr) / NB, hgt = rowH - 26;
            ctx.fillStyle = muted; ctx.globalAlpha = 0.75;
            cnt.forEach((c, b) => { if (c) ctx.fillRect(l + b * bw + 0.5, base - c / mx * hgt, Math.max(1, bw - 1), c / mx * hgt); });
            ctx.globalAlpha = 1;
          }
          const tv = r.fit.t[i + 1];
          [tv, -tv].forEach((v, j) => {
            ctx.strokeStyle = acc; ctx.lineWidth = 2; ctx.setLineDash(j ? [4, 3] : []);
            ctx.beginPath(); ctx.moveTo(X(v), y0 + 18); ctx.lineTo(X(v), base); ctx.stroke(); ctx.setLineDash([]);
          });
          ctx.fillStyle = acc; ctx.font = "600 11px system-ui, sans-serif"; ctx.textBaseline = "top";
          const xr = X(tv), rt = xr > Wd * 0.75; ctx.textAlign = rt ? "right" : "left";
          ctx.fillText("t = " + fmt(tv, 2) + (Math.abs(tv) > M ? " →" : ""), xr + (rt ? -4 : 4), y0 + 18);
        });
        ctx.fillStyle = muted; ctx.font = "11px system-ui, sans-serif"; ctx.textBaseline = "top";
        ticks(-M, M, 6).forEach(v => { ctx.textAlign = "center"; ctx.fillText(fmt(v, 0), X(v), Kn * rowH + 2); });
        ctx.textAlign = "center"; ctx.fillText(r.method === "ols" ? "(naiv OLS: nincs permutáció)" : "t-érték", Wd / 2, Kn * rowH + 16);
      }
      tc.onResize = () => res && drawT();
      compute();
    };
  }

