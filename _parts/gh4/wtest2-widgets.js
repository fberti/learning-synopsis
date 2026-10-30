/* =========================================================
   Gráfelmélet és hálózattudomány 4. fejezet – interaktív szemléltetések
   Minden widget egy  <div class="widget" data-widget="név">  elembe épül.
   Közös alap: assets/graph.js (GraphKit), adatok: ../arvizhet-data.js (ARVIZHET),
   a karateklub: ../../mesterseges-intelligencia/13-graf-neuralis-halok/graph-data.js (KARATE13)
   ========================================================= */
(function () {
  "use strict";
  const GK = window.GraphKit, D = window.ARVIZHET;
  const fmt = (x, d = 2) => (isFinite(x) ? (+x.toFixed(d)).toString().replace(".", ",") : "–");

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
  /* gombcsoport, amelyből egy aktív */
  function toggleGroup(parent, items, cur, onpick) {
    const bs = items.map(([v, l]) => btn(l, () => { onpick(v); paint(v); }));
    const paint = v => bs.forEach((b, i) => b.classList.toggle("on", items[i][0] === v));
    paint(cur);
    parent.append(...bs);
    return paint;
  }
  const math = el => window.Synopsis && Synopsis.renderMath && window.renderMathInElement && Synopsis.renderMath(el);

  /* az Árvízhét szereplőinek rögzített elrendezése (ugyanaz, mint a szöveg ábráin) */
  const ACTOR_POS = { Kl: [0.6, 0], Sz: [0, 0.5], Ko: [1.3, 0.5], Vi: [0.65, 1], Po: [1.6, 1.3], La: [2.4, 1], "Ön": [2.3, 1.9] };
  const actorName = id => D.actors.find(a => a.id === id).name;

  /* ---------- mintagráfok ----------
     preset(név, aspect) → { name, nodes: [{label,x,y,sub?,color?}], edges: [{a,b,w}], directed?, weighted?, club? }
     nevek: path4, barat, paw, star, twoTri, arviz (súlyozott: w = közös cikkek), papers (irányított, súlyozott), karate */
  const PRESETS = {
    path4: { name: "4 csúcsú út", labels: ["1", "2", "3", "4"], edges: "1-2,2-3,3-4", pos: [[0, 0], [1, 0], [2, 0], [3, 0]] },
    barat: { name: "barátsággráf", labels: ["A", "B", "C", "D"], edges: "A-B,A-C,B-C,C-D", pos: [[0, 0], [0, 1], [1, 0.5], [2.1, 0.5]] },
    paw: { name: "csillag + él", labels: ["A", "B", "C", "D"], edges: "A-B,A-C,A-D,B-C", pos: [[1, 0.9], [0.2, 0], [1.8, 0], [1, 1.8]] },
    star: { name: "csillag", labels: ["A", "B", "C", "D"], edges: "A-B,A-C,A-D", pos: [[1, 0.9], [0.2, 0], [1.8, 0], [1, 1.8]] },
    twoTri: { name: "két háromszög + híd", labels: ["1", "2", "3", "4", "5", "6"], edges: "1-2,1-3,2-3,3-4,4-5,4-6,5-6",
      pos: [[0, 0], [0, 1.2], [1, 0.6], [2.2, 0.6], [3.2, 0], [3.2, 1.2]] }
  };
  function preset(key, aspect = 0.5) {
    if (key === "arviz") {
      const ids = D.actors.map(a => a.id), P = GK.normalize(ids.map(i => ACTOR_POS[i]), aspect), w = {};
      D.articles.forEach(a => {
        const m = a.mentions;
        for (let i = 0; i < m.length; i++) for (let j = i + 1; j < m.length; j++) {
          const x = ids.indexOf(m[i]), y = ids.indexOf(m[j]), k = Math.min(x, y) + "-" + Math.max(x, y);
          w[k] = (w[k] || 0) + 1;
        }
      });
      return { name: "Árvízhét", nodes: ids.map((id, k) => ({ label: id, x: P[k][0], y: P[k][1], sub: actorName(id) })),
        edges: Object.entries(w).map(([k, v]) => { const [a, b] = k.split("-").map(Number); return { a, b, w: v }; }), weighted: true };
    }
    if (key === "papers") {
      const ids = D.papers.map(p => p.id), art = id => D.articles.find(a => a.id === id).paper, w = {};
      D.citations.forEach(([x, y]) => { const a = art(x), b = art(y); if (a !== b) { const k = a + ">" + b; w[k] = (w[k] || 0) + 1; } });
      const P = GK.normalize([[0, 0], [1.4, 0], [1.4, 1.1], [0, 1.1]], aspect);
      return { name: "lapok hivatkozásai", directed: true, weighted: true,
        nodes: D.papers.map((p, i) => ({ label: p.id, x: P[i][0], y: P[i][1], color: p.color, sub: p.name })),
        edges: Object.entries(w).map(([k, v]) => { const [a, b] = k.split(">"); return { a: ids.indexOf(a), b: ids.indexOf(b), w: v }; }) };
    }
    if (key === "karate") {
      const K = window.KARATE13, P = GK.normalize(K.xy, aspect);
      return { name: "karateklub", club: K.club.slice(),
        nodes: P.map((p, i) => ({ label: String(i + 1), x: p[0], y: p[1] })), edges: K.edges.map(([a, b]) => ({ a, b, w: 1 })) };
    }
    const S = PRESETS[key], P = GK.normalize(S.pos, aspect);
    return { name: S.name, nodes: S.labels.map((l, i) => ({ label: l, x: P[i][0], y: P[i][1] })),
      edges: S.edges.split(",").map(t => { const [a, b] = t.split("-"); return { a: S.labels.indexOf(a), b: S.labels.indexOf(b), w: 1 }; }) };
  }

  /* ---------- lineáris algebra kis gráfokra ---------- */
  /* szomszédsági mátrix (súlyozva, ha weighted; irányítva, ha directed) */
  function adjM(n, edges, { weighted = false, directed = false } = {}) {
    const A = Array.from({ length: n }, () => new Array(n).fill(0));
    edges.forEach(e => { const w = weighted ? e.w : 1; A[e.a][e.b] += w; if (!directed && e.a !== e.b) A[e.b][e.a] += w; });
    return A;
  }
  const rowSums = A => A.map(r => r.reduce((s, x) => s + x, 0));
  const matVec = (A, x) => A.map(r => r.reduce((s, a, j) => s + a * x[j], 0));
  const vecMat = (x, A) => A[0].map((_, j) => x.reduce((s, xi, i) => s + xi * A[i][j], 0));   // sorvektor · mátrix
  function lapM(A) { const d = rowSums(A); return A.map((r, i) => r.map((a, j) => (i === j ? d[i] : 0) - a)); }
  function transM(A) { const d = rowSums(A); return A.map((r, i) => r.map(a => (d[i] ? a / d[i] : 0))); }
  /* szimmetrikus mátrix sajátfelbontása (Jacobi-forgatások); növekvő sajátértékek, vecs[k] a k-adik sajátvektor */
  function eigSym(M) {
    const n = M.length, A = M.map(r => r.slice()), V = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => +(i === j)));
    for (let sweep = 0; sweep < 100; sweep++) {
      let off = 0;
      for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) off += A[p][q] * A[p][q];
      if (off < 1e-20) break;
      for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) {
        if (Math.abs(A[p][q]) < 1e-15) continue;
        const th = (A[q][q] - A[p][p]) / (2 * A[p][q]);
        const t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1)), c = 1 / Math.sqrt(t * t + 1), s = t * c;
        for (let k = 0; k < n; k++) { const akp = A[k][p], akq = A[k][q]; A[k][p] = c * akp - s * akq; A[k][q] = s * akp + c * akq; }
        for (let k = 0; k < n; k++) { const apk = A[p][k], aqk = A[q][k]; A[p][k] = c * apk - s * aqk; A[q][k] = s * apk + c * aqk; }
        for (let k = 0; k < n; k++) { const vkp = V[k][p], vkq = V[k][q]; V[k][p] = c * vkp - s * vkq; V[k][q] = s * vkp + c * vkq; }
      }
    }
    const idx = [...Array(n).keys()].sort((i, j) => A[i][i] - A[j][j]);
    return { vals: idx.map(i => A[i][i]), vecs: idx.map(i => V.map(r => r[i])) };
  }
  /* Fiedler-vektor (a Laplace-mátrix második legkisebb sajátértékéhez); az előjelet úgy rögzítjük, hogy az első nem nulla elem pozitív legyen */
  function fiedler(n, edges, weighted = false) {
    const E = eigSym(lapM(adjM(n, edges, { weighted })));
    const v = E.vecs[1] || new Array(n).fill(0), f = v.find(x => Math.abs(x) > 1e-9) || 1;
    return { lambda2: E.vals[1], vec: v.map(x => x * Math.sign(f)), vals: E.vals };
  }
  /* értékből szín: kék (negatív) – szürke (0) – narancs (pozitív), |x| ≤ max */
  const _cx = document.createElement("canvas").getContext("2d");
  function rgbOf(c) {                                  // bármilyen CSS-szín (vagy --változó) → [r, g, b]
    _cx.fillStyle = "#000"; _cx.fillStyle = c.startsWith("--") ? GK.css(c) : c;
    const s = _cx.fillStyle;
    if (s[0] === "#") return [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16));
    return s.match(/[\d.]+/g).slice(0, 3).map(Number);
  }
  function mixColor(c1, c2, t) {                       // t = 0 → c1, t = 1 → c2
    const a = rgbOf(c1), b = rgbOf(c2);
    return `rgb(${a.map((x, i) => Math.round(x + (b[i] - x) * t)).join(",")})`;
  }
  function divColor(x, max) {
    const t = Math.max(-1, Math.min(1, max ? x / max : 0));
    return mixColor("--card", t >= 0 ? "--setB" : "--setA", 0.15 + 0.75 * Math.abs(t));
  }

  const W = {};
  /* ==================================================================
     w2: 4.2/4.6, 4.4, 4.5 widgetjei (random-surfer, laplacian-smooth, spectral-cut)
     A saját segédfüggvények blokkban, hogy ne ütközzenek a w1 neveivel.
     ================================================================== */
  {
    const MINUS = "−";
    const fmtS = (x, d = 2) => { const s = fmt(Math.abs(x) < 0.5 * Math.pow(10, -d) ? 0 : x, d); return s.replace("-", MINUS); };
    const pct = (x, d = 1) => fmt(100 * x, d) + "%";
    /* a csúcsok alatti név (sub) ne lógjon le a vászonról */
    const liftY = y => 0.07 + (y - 0.08) * 0.9;
    /* címkeszín a háttér világossága szerint */
    function inkOf(c) {
      const m = String(c).match(/[\d.]+/g);
      if (!m) return null;
      const [r, g, b] = m.slice(0, 3).map(Number), L = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return L > 0.6 ? "#1b1f27" : "#ffffff";
    }
    /* témaváltáskor újrarajzolás (a divColor / mixColor színek újraszámolása) */
    const onTheme = fn => new MutationObserver(fn).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const checkbox = (label, onchange) => {
      const inp = h("input", { type: "checkbox" });
      inp.addEventListener("change", () => onchange(inp.checked));
      const lab = h("label", null, inp, label);
      return { lab, inp };
    };
    /* saját gráfkészlet: a 3 csúcsú út, és az utak vízszintesen középre */
    function graphOf(key, aspect, unweighted = false) {
      let G;
      if (key === "path3" || key === "path4") {
        const k = key === "path3" ? 3 : 4;
        G = { name: k + " csúcsú út", nodes: Array.from({ length: k }, (_, i) => ({ label: String(i + 1), x: 0.14 + i * 0.72 / (k - 1), y: 0.5 })),
          edges: Array.from({ length: k - 1 }, (_, i) => ({ a: i, b: i + 1, w: 1 })) };
      } else if (key === "empty") G = { name: "üres", nodes: [], edges: [] };
      else G = preset(key, aspect);
      if (unweighted) { G.edges = G.edges.map(e => ({ a: e.a, b: e.b, w: 1 })); G.weighted = false; }
      G.nodes.forEach(nd => { if (nd.sub) nd.y = liftY(nd.y); });
      return G;
    }

    /* ------------------------------------------------------------------
       4.2 / 4.6  random-surfer – a véletlen séta látogatási gyakorisága
       ------------------------------------------------------------------ */
    W["random-surfer"] = root => {
      header(root, "Véletlen séta: hol tölti az idejét az olvasó?",
        "Az olvasó (<b style=\"color:var(--bad)\">piros pötty</b>) minden lépésben egy véletlen szomszédra lép. Minél erősebb egy csúcs színe, annál többször járt ott. " +
        "Az oszlopok a látogatási gyakoriságot mutatják, a halvány sáv és a függőleges vonal az elméleti arányt: $\\pi_i = d_i/2m$.");
      math(root.querySelector(".w-sub"));
      const ctr = h("div", { class: "controls" }), ctr2 = h("div", { class: "controls" });
      root.append(ctr, ctr2);
      const narrow = root.clientWidth < 560, aspect = narrow ? 0.8 : 0.5;
      let key = "arviz", weighted = false, G, n = 0, out = [], pi = null, cnt = [], steps = 0, cur = 0, prev = 0, stuck = false, timer = null, anim = null;
      const box = h("div");
      root.append(box);                                        // a vászon mérete a szülő szélességéből jön
      const view = new GK.View(box, { aspect, radius: narrow ? 15 : 17, draggable: false, nodes: [], edges: [],
        onDraw: (ctx, v) => {                                   // az olvasó pöttye (lépéskor a két csúcs között csúszik)
          if (!n) return;
          const r = v.o.radius, off = [-r * 0.8, -r * 0.8];          // bal felül (jobb felül a % áll)
          const P = i => [v.nodes[i].x * v.w + off[0], v.nodes[i].y * v.h + off[1]];
          let [x, y] = P(cur);
          if (anim) { const [x0, y0] = P(prev), t = anim.t; x = x0 + (x - x0) * t; y = y0 + (y - y0) * t; }
          ctx.beginPath(); ctx.arc(x, y, 6.5, 0, 2 * Math.PI);
          ctx.fillStyle = GK.css("--bad"); ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = GK.css("--card"); ctx.stroke();
        } });
      toggleGroup(ctr, [["arviz", "Árvízhét"], ["barat", "barátsággráf"], ["star", "csillag"], ["papers", "lapok hivatkozásai"]], key, v => { key = v; load(); });
      const wt = checkbox("súlyozott séta", v => { weighted = v; load(); });
      ctr.append(wt.lab);
      const stepB = btn("Lépés", () => { stop(); doStep(true); paint(); });
      const playB = btn("▶ Indít", () => (timer ? stop() : start()), "btn primary");
      const sp = h("input", { type: "range", min: 1, max: 5, step: 1, value: 3, "aria-label": "sebesség", oninput: () => { if (timer) { stop(); start(); } } });
      ctr2.append(stepB, playB, h("label", null, "sebesség", sp),
        btn("+1000 lépés", () => { stop(); for (let k = 0; k < 1000 && doStep(false); k++); anim = null; paint(); }),
        btn("Nullázás", () => { stop(); reset(); paint(); }));
      const bars = h("div", { style: "margin-top:.7rem" });
      const info = h("div", { class: "readout" });
      root.append(bars, info);

      const DELAY = [0, 700, 350, 150, 50, 16];
      function start() {
        if (stuck) reset();
        const s = +sp.value, d = DELAY[s], per = s === 5 ? 4 : 1;
        timer = setInterval(() => { for (let k = 0; k < per; k++) if (!doStep(d >= 150)) break; paint(); if (stuck) stop(); }, d);
        playB.textContent = "⏸ Megállít";
      }
      function stop() { if (timer) clearInterval(timer); timer = null; playB.textContent = "▶ Indít"; }
      /* ha a widget kikerül a képből vagy a lap rejtett, megáll */
      if ("IntersectionObserver" in window) new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) stop(); })).observe(root);
      document.addEventListener("visibilitychange", () => { if (document.hidden) stop(); });

      function load() {
        stop();
        G = graphOf(key, aspect);
        n = G.nodes.length;
        const useW = weighted && key === "arviz";
        wt.lab.style.display = key === "arviz" ? "" : "none";
        out = Array.from({ length: n }, () => []);
        G.edges.forEach(e => { const w = useW ? e.w : 1; out[e.a].push({ to: e.b, w }); if (!G.directed) out[e.b].push({ to: e.a, w }); });
        if (G.directed) pi = null;
        else { const s = out.map(l => l.reduce((t, o) => t + o.w, 0)), S = s.reduce((t, x) => t + x, 0); pi = s.map(x => x / S); }
        reset();                                                 // előbb az állapot, hogy a rajzolás már az új gráfot lássa
        view.o.directed = !!G.directed;
        view.o.showWeights = useW;
        view.setGraph(G.nodes.map(nd => ({ ...nd, x: narrow ? 0.03 + nd.x * 0.88 : nd.x, color: null, sub: G.directed ? null : nd.sub })), G.edges);   // keskenyen: hely a % jelnek   // irányítottnál a név eltakarná a nyílhegyet
        bars.innerHTML = "";
        rows = G.nodes.map(nd => {
          const band = h("div", { style: "position:absolute;left:0;top:0;bottom:0;background:var(--setB);opacity:.22;border-radius:4px" });
          const line = h("div", { style: "position:absolute;top:-3px;bottom:-3px;width:2px;background:var(--setB)" });
          const fill = h("div", { style: "position:absolute;left:0;top:3px;bottom:3px;background:var(--accent);border-radius:3px;transition:width .12s" });
          const val = h("div", { style: "font-family:var(--mono);font-size:.82rem;white-space:nowrap;text-align:right" });
          const row = h("div", { style: "display:grid;grid-template-columns:2.2em 1fr 8.6em;gap:.5rem;align-items:center;margin:.22rem 0" },
            h("div", { style: "font-weight:600" }, nd.label), h("div", { style: "position:relative;height:18px;background:var(--bg-soft);border-radius:4px" }, band, fill, line), val);
          bars.append(row);
          return { band, line, fill, val };
        });
        bars.append(h("div", { class: "muted", style: "font-size:.8rem;margin-top:.2rem" },
          pi ? (useW ? "teli sáv: gyakoriság · narancs: elmélet, sᵢ / Σs (súlyozott fokszám)" : "teli sáv: gyakoriság · narancs: elmélet, dᵢ / 2m") : "teli sáv: gyakoriság · irányított gráfnál itt nincs ilyen egyszerű képlet"));
        paint();
      }
      let rows = [];
      function reset() {
        cnt = new Array(n).fill(0); steps = 0; anim = null;
        const ok = [...Array(n).keys()].filter(i => out[i].length);        // olyan kezdőcsúcs, ahonnan lehet lépni
        cur = prev = ok.length ? ok[Math.floor(Math.random() * ok.length)] : 0;
        stuck = n > 0 && out[cur].length === 0;
      }
      /* egy lépés; false, ha nem tudott lépni */
      function doStep(animate) {
        if (stuck || !n) return false;
        const o = out[cur];
        if (!o.length) { stuck = true; return false; }
        let r = Math.random() * o.reduce((t, x) => t + x.w, 0), nx = o[o.length - 1].to;
        for (const x of o) { r -= x.w; if (r < 0) { nx = x.to; break; } }
        prev = cur; cur = nx; cnt[cur]++; steps++;
        if (!out[cur].length) stuck = true;
        if (animate) {
          const dur = Math.min(260, 0.7 * DELAY[+sp.value] || 260), t0 = performance.now();
          anim = { t: 0 };
          const tick = now => {
            if (!anim) return;
            anim.t = Math.min(1, (now - t0) / dur);
            view.draw();
            if (anim.t < 1) requestAnimationFrame(tick); else anim = null;
          };
          requestAnimationFrame(tick);
        } else anim = null;
        return true;
      }
      function paint() {
        const f = cnt.map(c => (steps ? c / steps : 0)), fmax = Math.max(...f, 1e-9);
        view.nodes.forEach((nd, i) => {
          if (steps) { nd.color = mixColor("--card", "--accent", 0.08 + 0.8 * f[i] / fmax); nd.ink = inkOf(nd.color); nd.badge = pct(f[i], 0); }
          else { nd.color = null; nd.ink = null; nd.badge = null; }
        });
        view.hl = new Set([cur]);
        view.draw();
        const scale = Math.max(...f, ...(pi || [0]), 0.05) * 1.12;
        rows.forEach((r, i) => {
          r.fill.style.width = (100 * f[i] / scale) + "%";
          if (pi) { r.band.style.width = (100 * pi[i] / scale) + "%"; r.line.style.left = `calc(${100 * pi[i] / scale}% - 1px)`; }
          r.band.style.display = r.line.style.display = pi ? "" : "none";
          r.val.textContent = pct(f[i]) + (pi ? " · π " + pct(pi[i]) : "");
        });
        const L = G.nodes, top = steps ? f.indexOf(fmax) : -1;
        const name = i => L[i].label + (L[i].sub ? " (" + L[i].sub + ")" : "");
        let s = `Lépés: <b>${steps}</b> · most: ${name(cur)}`;
        if (top >= 0) s += ` · legtöbbet: ${name(top)}, ${pct(fmax)}`;
        if (pi && steps) s += `<br>Eltérés az elmélettől: ½·Σ|fᵢ − πᵢ| = <b>${fmt(0.5 * f.reduce((t, x, i) => t + Math.abs(x - pi[i]), 0), 3)}</b>`;
        if (stuck) s += `<br><span style="color:var(--bad)"><b style="color:var(--bad)">Beragadt:</b> az ${L[cur].label}-ból nem vezet ki él. A PageRank ezt teleportálással oldja meg – 5. fejezet.</span> (Indítás / Nullázás: új, véletlen kezdőcsúcs.)`;
        else if (G.directed) s += "<br>Irányított gráf: az olvasó csak a nyíl irányában léphet.";
        if (key === "star") s += "<br>Csillagon a séta felváltva van a középen és egy levélen, ezért lépésenként az eloszlás nem áll be – a gyakoriság mégis dᵢ/2m-hez tart (középen 50%).";
        if (key === "arviz" && weighted) s += "<br>Súlyozott séta: a szomszédot a közös cikkek számával arányosan választja; ekkor πᵢ = sᵢ / Σs.";
        info.innerHTML = s;
      }
      onTheme(paint);
      load();
    };

    /* ------------------------------------------------------------------
       4.4  laplacian-smooth – a Laplace-kvadratikus alak és a spektrum
       ------------------------------------------------------------------ */
    W["laplacian-smooth"] = root => {
      header(root, "Mennyire „sima” egy csúcsérték-vektor?",
        "Húzd a csúszkákat: minden csúcs kap egy $x_i$ számot (szín: <b style=\"color:var(--setA)\">kék</b> negatív, <b style=\"color:var(--setB)\">narancs</b> pozitív). " +
        "Minden él büntetése $(x_i - x_j)^2$ – minél vastagabb és pirosabb az él, annál nagyobb. Az összeg $\\mathbf x^\\top L\\mathbf x$. Kattints egy élre a tagjáért.");
      math(root.querySelector(".w-sub"));
      const ctr = h("div", { class: "controls" }), ctr2 = h("div", { class: "controls" });
      root.append(ctr);
      const narrow = root.clientWidth < 560;
      let key = "path3", G, n = 0, edges = [], x = [], selE = -1, edit = false;
      const box = h("div");
      root.append(box);                                        // a vászon mérete a szülő szélességéből jön
      const view = new GK.View(box, { aspect: narrow ? 0.7 : 0.42, radius: narrow ? 15 : 17, draggable: false, showWeights: true, nodes: [], edges: [],
        onEdgeClick: i => { selE = i; paint(); },
        onNodeClick: i => {
          if (!edit) return;
          if (view.sel < 0) view.sel = i;
          else if (view.sel === i) view.sel = -1;
          else {
            const k = GK.edgeKey(view.sel, i), j = edges.findIndex(e => GK.edgeKey(e.a, e.b) === k);
            if (j >= 0) edges.splice(j, 1); else edges.push({ a: view.sel, b: i, w: 1 });
            view.sel = -1; selE = -1;
          }
          paint();
        } });
      toggleGroup(ctr, [["path3", "3 csúcsú út"], ["path4", "4 csúcsú út"], ["twoTri", "két háromszög + híd"], ["arviz", "Árvízhét"]], key, v => { key = v; load(); });
      const sl = h("div", { style: "display:grid;grid-template-columns:repeat(auto-fill,minmax(155px,1fr));gap:.25rem .9rem;margin:.5rem 0" });
      ctr2.append(
        btn("konstans", () => setX(x.map(() => 1))),
        btn("ugráló", () => setX(x.map((_, i) => (i % 2 ? -1 : 1)))),
        btn("véletlen", () => setX(x.map(() => Math.round((Math.random() * 6 - 3) * 10) / 10))),
        btn("Fiedler-vektor = legsimább nem konstans", () => {
          const F = fiedler(n, edges);
          setX(F.vec.map(v => v * Math.sqrt(n)));
        }));
      const bridge = checkbox("híd (3–4) törlése", v => {
        const k = GK.edgeKey(2, 3), j = edges.findIndex(e => GK.edgeKey(e.a, e.b) === k);
        if (v && j >= 0) edges.splice(j, 1);
        if (!v && j < 0) edges.push({ a: 2, b: 3, w: 1 });
        selE = -1; paint();
      });
      const ed = checkbox("szerkesztés (két csúcsra kattintva él be/ki)", v => { edit = v; view.sel = -1; paint(); });
      const ctr3 = h("div", { class: "controls" }, bridge.lab, ed.lab);
      const info = h("div", { class: "readout" });
      const specT = h("p", { style: "margin:.9rem 0 .2rem;font-weight:600" }, "Spektrum: az L sajátértékei (μ₁ = 0 ≤ μ₂ ≤ …)");
      const spec = h("div");
      const specInfo = h("div", { class: "readout" });
      root.append(sl, ctr2, ctr3, info, specT, spec, specInfo);

      function setX(v) { x = v.slice(); sliders.forEach((s, i) => { s.inp.value = Math.round(x[i] * 10) / 10; }); selE = -1; paint(); }
      let sliders = [];
      function load() {
        G = graphOf(key, narrow ? 0.7 : 0.42, true);
        n = G.nodes.length; edges = G.edges.map(e => ({ ...e }));
        x = key === "path3" ? [1, 2, 3] : G.nodes.map((_, i) => (i < n / 2 ? 1 : -1));
        selE = -1; view.sel = -1;
        const asp = key.startsWith("path") ? (narrow ? 0.34 : 0.2) : (narrow ? 0.7 : 0.42);       // az út alacsonyabb vásznat kap
        if (view.o.aspect !== asp) { view.o.aspect = asp; view.resize(); }
        view.setGraph(G.nodes, []);
        bridge.inp.checked = false;
        bridge.lab.style.display = key === "twoTri" ? "" : "none";
        sl.innerHTML = "";
        sliders = G.nodes.map((nd, i) => {
          const val = h("span", { style: "font-family:var(--mono);min-width:3.2em;text-align:right" });
          const inp = h("input", { type: "range", min: -3, max: 3, step: 0.1, value: x[i], style: "flex:1;min-width:0", "aria-label": "x" + nd.label,
            oninput: () => { x[i] = +inp.value; paint(); } });
          sl.append(h("label", { style: "display:flex;align-items:center;gap:.4rem;font-size:.92rem" }, h("b", { style: "min-width:1.6em" }, nd.label), inp, val));
          return { inp, val };
        });
        paint();
      }
      function paint() {
        sliders.forEach((s, i) => (s.val.textContent = fmtS(x[i], 2)));
        const terms = edges.map(e => { const d = x[e.a] - x[e.b]; return d * d; });
        view.edges = edges.map((e, i) => {
          const d = Math.abs(x[e.a] - x[e.b]);
          return { a: e.a, b: e.b, w: 1, width: 1.5 + 1.1 * d + (i === selE ? 1.5 : 0), color: mixColor("--muted", "--bad", Math.min(1, d / 2)), label: fmt(terms[i], 2) };
        });
        view.hlE = new Set(selE >= 0 ? [GK.edgeKey(edges[selE].a, edges[selE].b)] : []);
        view.nodes.forEach((nd, i) => { nd.color = divColor(x[i], 3); nd.ink = inkOf(nd.color); nd.badge = fmtS(x[i], 1); });
        view.draw();
        const L = i => G.nodes[i].label, xv = i => (x[i] < -0.005 ? "(" + fmtS(x[i], 2) + ")" : fmtS(x[i], 2)), xs = i => `x<sub>${L(i)}</sub>`;
        const Q = terms.reduce((t, v) => t + v, 0), xx = x.reduce((t, v) => t + v * v, 0);
        let s = "";
        if (selE >= 0) {
          const e = edges[selE];
          s += `<b>${L(e.a)}–${L(e.b)} él:</b> (${xs(e.a)} − ${xs(e.b)})² = (${fmtS(x[e.a], 2)} − ${xv(e.b)})² = <b>${fmt(terms[selE], 3)}</b><br>`;
        }
        if (edges.length && edges.length <= 10) s += `xᵀLx = ${edges.map(e => `(${fmtS(x[e.a], 2)} − ${xv(e.b)})²`).join(" + ")}<br>&nbsp;&nbsp;&nbsp;= ${terms.map(t => fmt(t, 2)).join(" + ")} = <b>${fmt(Q, 3)}</b>`;
        else s += `xᵀLx = Σ(xᵢ − xⱼ)² = <b>${fmt(Q, 3)}</b> (${edges.length} él)`;
        s += `<br>xᵀx = ${fmt(xx, 3)} → Rayleigh-hányados xᵀLx / xᵀx = <b>${xx > 1e-12 ? fmt(Q / xx, 3) : "–"}</b>`;
        info.innerHTML = s;
        spectrum();
      }
      function spectrum() {
        const vals = n ? eigSym(lapM(adjM(n, edges))).vals.map(v => (Math.abs(v) < 1e-9 ? 0 : v)) : [];
        const groups = [];
        vals.forEach(v => { const g = groups.find(g => Math.abs(g.v - v) < 1e-6); if (g) g.k++; else groups.push({ v, k: 1 }); });
        const max = Math.max(1, Math.ceil(Math.max(...vals, 0) + 0.3)), Wd = narrow ? 300 : 400, x0 = 20, x1 = Wd - 20, base = 62;
        const X = v => x0 + (x1 - x0) * v / max;
        let svg = `<line x1="${x0}" y1="${base}" x2="${x1}" y2="${base}" stroke="var(--muted)" stroke-width="1.2"/>`;
        for (let t = 0; t <= max; t++) svg += `<line x1="${X(t)}" y1="${base - 3}" x2="${X(t)}" y2="${base + 3}" stroke="var(--muted)"/><text x="${X(t)}" y="${base + 14}" font-size="10" text-anchor="middle" fill="var(--muted)">${t}</text>`;
        groups.forEach((g, gi) => {
          const zero = g.v === 0;
          for (let k = 0; k < g.k; k++) svg += `<circle cx="${X(g.v)}" cy="${base - 8 - 11 * k}" r="${zero ? 5.5 : 4.5}" fill="${zero ? "var(--bad)" : "var(--accent)"}" stroke="var(--card)" stroke-width="1"/>`;
          const lab = fmt(g.v, 3) + (g.k > 1 ? " ×" + g.k : "");
          svg += `<text x="${X(g.v)}" y="${base + 26 + (gi % 2) * 11}" font-size="10" text-anchor="middle" fill="${zero ? "var(--bad)" : "var(--text)"}" font-weight="${zero ? 700 : 400}">${lab}</text>`;
        });
        const y0 = base - 16 - 11 * (Math.max(1, ...groups.map(g => g.k)) - 1), H = base + 42 - y0;
        spec.innerHTML = `<svg viewBox="0 ${y0} ${Wd} ${H}" style="width:100%;max-width:640px;display:block" role="img" aria-label="a Laplace-mátrix sajátértékei">${svg}</svg>`;
        const z = vals.filter(v => v === 0).length;
        specInfo.innerHTML = `μ = ${vals.map(v => fmt(v, 3)).join("; ")}<br><span style="color:var(--bad)">0 sajátérték: <b style="color:var(--bad)">${z} db</b></span> = ${z} komponens` +
          (z > 1 ? " – a gráf szétesett." : " – a gráf összefüggő.") + (vals.length > 1 ? ` μ₂ = ${fmt(vals[1], 3)}: a legkisebb Rayleigh-hányados a konstansra merőleges vektorok közt.` : "");
      }
      onTheme(paint);
      load();
    };

    /* ------------------------------------------------------------------
       4.5  spectral-cut – kettévágás a Fiedler-vektorral
       ------------------------------------------------------------------ */
    W["spectral-cut"] = root => {
      header(root, "Spektrális kettévágás: a Fiedler-vektor előjele",
        "Minden változáskor kiszámolom a Fiedler-vektort (a Laplace-mátrix $\\mu_2$ sajátértékéhez tartozó sajátvektort), és a csúcsokat az előjele szerint színezem. A <b style=\"color:var(--bad)\">piros szaggatott</b> élek a vágott élek. " +
        "Szerkeszd a gráfot: üres helyre kattintva új csúcs, két csúcsra kattintva él be/ki, élre kattintva törlés, húzással mozgatás.");
      math(root.querySelector(".w-sub"));
      const ctr = h("div", { class: "controls" }), ctr2 = h("div", { class: "controls" });
      root.append(ctr, ctr2);
      const narrow = root.clientWidth < 560, aspect = narrow ? 0.85 : 0.55;
      let key = "twoTri", mode = "sign", flip = 1, flipMsg = false, club = null, showClub = false, F = null, side = [];
      const box = h("div");
      root.append(box);                                        // a vászon mérete a szülő szélességéből jön
      const view = new GK.View(box, { aspect, editable: true, maxNodes: 40, radius: narrow ? 15 : 17, nodes: [], edges: [],
        onChange: () => { flipMsg = false; paint(); }, onMove: () => {},
        onDraw: (ctx, v) => {
          if (v.sel >= 0 && !v.nodes[v.sel].sub && F && F.vec.length === v.nodes.length) {   // sok csúcsnál: a kijelölt csúcs értéke
            const [px, py] = v.px(v.nodes[v.sel]), t = fmtS(F.vec[v.sel] * flip, 2);
            ctx.font = "600 12px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.lineWidth = 3; ctx.strokeStyle = GK.css("--card"); ctx.strokeText(t, px, py + v.o.radius + 11);
            ctx.fillStyle = GK.css("--text"); ctx.fillText(t, px, py + v.o.radius + 11);
          }
          if (!showClub || !club || club.length !== v.nodes.length) return;      // valódi szakadás: keret a klub szerint
          const r = v.o.radius;
          v.nodes.forEach((nd, i) => {
            const [px, py] = v.px(nd), c = clubSide(i);
            ctx.beginPath(); ctx.arc(px, py, r + 3.5, 0, 2 * Math.PI);
            ctx.lineWidth = 3; ctx.strokeStyle = GK.css(c ? "--setB" : "--setA"); ctx.stroke();
            if (c !== side[i]) { ctx.beginPath(); ctx.arc(px, py, r + 7.5, 0, 2 * Math.PI); ctx.lineWidth = 2.5; ctx.setLineDash([4, 3]); ctx.strokeStyle = GK.css("--bad"); ctx.stroke(); ctx.setLineDash([]); }
          });
        } });
      /* a klubot arra az oldalra képezzük, ahol a tagjai többsége van */
      let clubMap = 0;
      const clubSide = i => (club[i] === clubMap);
      toggleGroup(ctr, [["twoTri", "két háromszög + híd"], ["arviz", "Árvízhét"], ["karate", "karateklub"], ["empty", "üres"]], key, v => { key = v; load(); });
      toggleGroup(ctr2, [["sign", "vágás az előjelnél"], ["median", "vágás a mediánnál"]], mode, v => { mode = v; flipMsg = false; paint(); });
      ctr2.append(btn("Előjelcsere", () => { flip = -flip; flipMsg = true; paint(); }));
      const cl = checkbox("valódi szakadás", v => { showClub = v; paint(); });
      ctr2.append(cl.lab);
      const info = h("div", { class: "readout" });
      root.append(info);

      function load() {
        const G = graphOf(key, aspect, true);
        club = G.club || null; showClub = false; cl.inp.checked = false;
        cl.lab.style.display = club ? "" : "none";
        view.o.radius = key === "karate" ? (narrow ? 9 : 11) : (narrow ? 15 : 17);
        view.setGraph(G.nodes.map(nd => ({ label: nd.label, x: nd.x, y: nd.y })), G.edges);
        flip = 1; flipMsg = false;
        paint();
      }
      function paint() {
        const n = view.nodes.length, E = view.edges;
        if (club && club.length !== n) club = null, cl.lab.style.display = "none", showClub = false;
        E.forEach(e => { delete e.color; delete e.dash; delete e.width; });
        if (n < 2) {
          view.nodes.forEach(nd => { nd.color = nd.ink = nd.sub = null; });
          view.draw();
          info.innerHTML = "Kattints a vászon üres részére: új csúcsot teszel le. Két csúcsra egymás után kattintva élt húzol köztük.";
          return;
        }
        F = fiedler(n, E.map(e => ({ a: e.a, b: e.b, w: 1 })));
        const v = F.vec.map(t => t * flip);
        let thr = 0;
        if (mode === "median") {
          const o = [...v.keys()].sort((i, j) => v[i] - v[j] || i - j), k = Math.floor(n / 2);
          side = new Array(n).fill(true); o.slice(0, k).forEach(i => (side[i] = false));
          thr = (v[o[k - 1]] + v[o[k]]) / 2;
        } else side = v.map(t => t > 0);
        const dv = v.map(t => t - thr), mx = Math.max(...dv.map(Math.abs), 1e-9);
        const big = n > 14;
        if (club) {
          const agree0 = club.filter((c, i) => (c === 0) === side[i]).length;
          clubMap = agree0 >= n - agree0 ? 0 : 1;
        }
        view.nodes.forEach((nd, i) => {
          nd.color = divColor(dv[i], mx); nd.ink = inkOf(nd.color);
          const odd = showClub && club && clubSide(i) !== side[i];
          nd.sub = !big || odd ? fmtS(v[i], 2) : null;
        });
        const cut = [];
        E.forEach((e, i) => { if (side[e.a] !== side[e.b]) { e.color = "--bad"; e.dash = [6, 4]; e.width = 2.6; cut.push(i); } });
        view.draw();
        const lab = i => view.nodes[i].label;
        const A = [...side.keys()].filter(i => side[i]), B = [...side.keys()].filter(i => !side[i]);
        const set = L => "{" + L.map(lab).join(", ") + "}";
        let s = `μ₂ = <b>${fmt(F.lambda2, 3)}</b>`;
        const disc = F.lambda2 < 1e-9;
        s += ` · oldalak: <b>${A.length}</b> + <b>${B.length}</b> csúcs · vágott él: <b>${cut.length}</b>`;
        if (!big) s += `<br><span style="color:var(--setB)">■</span> ${set(A)} &nbsp; <span style="color:var(--setA)">■</span> ${set(B)}`;
        if (cut.length && cut.length <= 8) s += `<br>vágott élek: ${cut.map(i => lab(E[i].a) + "–" + lab(E[i].b)).join(", ")}`;
        if (mode === "median") s += "<br>Mediánvágás: a Fiedler-értékek szerinti sorrend alsó fele az egyik, felső fele a másik oldal (kiegyensúlyozott méret).";
        if (disc) s += `<br><span style="color:var(--bad)">A gráf nem összefüggő – a Fiedler-vektor a komponenseket választja szét (μ₂ = 0).</span>`;
        if (flipMsg) s += "<br>Előjelcsere: −v is Fiedler-vektor – <b>ugyanaz a vágás</b>, csak a színek cserélődtek.";
        if (club) {
          const ok = club.filter((_, i) => clubSide(i) === side[i]).length, bad = [...club.keys()].filter(i => clubSide(i) !== side[i]);
          if (showClub) s += `<br>Valódi szakadás (keret: a klub, ahová a tag ténylegesen került): <b>${n}-ból ${ok}</b> tag van a valódi oldalán.` +
            (bad.length ? ` Kivétel: ${bad.map(i => `${lab(i)}. tag (Fiedler-érték ${fmtS(v[i], 2)})`).join(", ")} – piros szaggatott gyűrűvel jelölve.` : "");
          else s += "<br>Kapcsold be a „valódi szakadás”-t: összevetjük a vágást a klub tényleges kettéválásával.";
          if (big) s += "<br><span class=\"muted\">Sok csúcsnál az értéket csak a kijelölt csúcs alatt írom ki (kattints egy csúcsra).</span>";
        }
        info.innerHTML = s;
      }
      onTheme(paint);
      load();
    };
  }
  /* ------------------------------------------------------------------
     Indítás
     ------------------------------------------------------------------ */
  document.querySelectorAll(".widget[data-widget]").forEach(root => {
    const f = W[root.dataset.widget];
    if (!f) return;
    try { f(root); }
    catch (e) { root.append(h("p", { class: "muted" }, "Hiba a szemléltetés betöltésekor: " + e.message)); console.error(e); }
  });
})();
