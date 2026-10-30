/* =========================================================
   Synopsis – közös gráfmodul (Gráfelmélet és hálózattudomány)
   - gráf segédfüggvények (fokszám, szomszédsági lista és mátrix)
   - magolt véletlen, erőirányított és kör-elrendezés
   - statikus SVG-ábra:   <div class="gfig" data-edges="A-B,B-C" …>
   - interaktív, szerkeszthető canvas-nézet:  new GraphKit.View(…)
   Külső könyvtár nélkül; a színek a style.css változóit követik.
   ========================================================= */
(function () {
  "use strict";

  const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const color = c => (c && c.startsWith("--") ? css(c) : c);

  /* ---------- magolt véletlen (mulberry32) ---------- */
  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ---------- gráf-segédfüggvények ----------
     A gráf: n csúcs (0..n-1), élek: [[i, j], …]; hurok: i === j, többszörös él: ismétlődő pár. */
  function parseEdges(str) {
    const labels = [], idx = {};
    const id = s => (s in idx ? idx[s] : (idx[s] = labels.push(s) - 1));
    const edges = [];
    String(str || "").split(/[,;]\s*/).map(s => s.trim()).filter(Boolean).forEach(tok => {
      const p = tok.split(/\s*[-–]\s*/);
      if (p.length === 1) id(p[0]);
      else edges.push([id(p[0]), id(p[1])]);
    });
    return { labels, edges };
  }
  function degrees(n, edges) {
    const d = new Array(n).fill(0);
    edges.forEach(([a, b]) => { d[a]++; d[b]++; });          // a hurok kétszer számít
    return d;
  }
  function adjMatrix(n, edges) {
    const M = Array.from({ length: n }, () => new Array(n).fill(0));
    edges.forEach(([a, b]) => { if (a === b) M[a][a] += 2; else { M[a][b]++; M[b][a]++; } });
    return M;
  }
  function adjList(n, edges) {
    const L = Array.from({ length: n }, () => []);
    edges.forEach(([a, b]) => { L[a].push(b); if (a !== b) L[b].push(a); });
    L.forEach(l => l.sort((x, y) => x - y));
    return L;
  }
  const edgeKey = (a, b) => (a < b ? a + "-" + b : b + "-" + a);

  /* ---------- elrendezések (koordináták a [0;1] négyzetben) ---------- */
  function circleLayout(n, start = -Math.PI / 2) {
    if (n === 1) return [[0.5, 0.5]];
    return Array.from({ length: n }, (_, i) => {
      const t = start + 2 * Math.PI * i / n;
      return [0.5 + 0.42 * Math.cos(t), 0.5 + 0.42 * Math.sin(t)];
    });
  }
  /* Fruchterman–Reingold, magolt kezdőállapottal → mindig ugyanaz a kép */
  function forceLayout(n, edges, { seed = 7, iters = 400, aspect = 1, init = null } = {}) {
    if (n === 0) return [];
    if (n === 1) return [[0.5, 0.5]];
    const R = rng(seed), W = 1, H = aspect;
    const P = init ? init.map(p => [p[0], p[1] * H]) : Array.from({ length: n }, () => [R() * W, R() * H]);
    const k = Math.sqrt(W * H / n) * 0.75;
    const simple = edges.filter(([a, b]) => a !== b);
    let temp = 0.1;
    for (let it = 0; it < iters; it++) {
      const D = P.map(() => [0, 0]);
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
        let dx = P[i][0] - P[j][0], dy = P[i][1] - P[j][1];
        let d = Math.hypot(dx, dy);
        if (d < 1e-6) { dx = R() - 0.5; dy = R() - 0.5; d = Math.hypot(dx, dy); }
        const f = k * k / d;
        D[i][0] += dx / d * f; D[i][1] += dy / d * f; D[j][0] -= dx / d * f; D[j][1] -= dy / d * f;
      }
      simple.forEach(([a, b]) => {
        const dx = P[a][0] - P[b][0], dy = P[a][1] - P[b][1], d = Math.hypot(dx, dy) || 1e-6;
        const f = d * d / k;
        D[a][0] -= dx / d * f; D[a][1] -= dy / d * f; D[b][0] += dx / d * f; D[b][1] += dy / d * f;
      });
      for (let i = 0; i < n; i++) {                              // gyenge húzás a középpont felé
        D[i][0] += (W / 2 - P[i][0]) * k * 0.6; D[i][1] += (H / 2 - P[i][1]) * k * 0.6;
        const d = Math.hypot(D[i][0], D[i][1]) || 1e-9, s = Math.min(d, temp);
        P[i][0] += D[i][0] / d * s; P[i][1] += D[i][1] / d * s;
      }
      temp = Math.max(0.002, temp * 0.985);
    }
    return normalize(P, aspect);
  }
  /* a pontfelhőt a [0,08; 0,92] tartományba skálázza (a magasság az aspect arányában) */
  function normalize(P, aspect = 1) {
    const xs = P.map(p => p[0]), ys = P.map(p => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const sx = (x1 - x0) || 1, sy = (y1 - y0) || 1;
    const s = Math.min(0.84 / sx, 0.84 * aspect / sy);
    const ox = (1 - sx * s) / 2, oy = (aspect - sy * s) / 2;
    return P.map(p => [ox + (p[0] - x0) * s, (oy + (p[1] - y0) * s) / aspect]);
  }

  /* ---------- statikus SVG-ábra ----------
     <div class="gfig" data-edges="A-B,B-C,C-C" data-pos="A:0,0 B:1,0 C:.5,1"
          data-layout="circle|force" data-w="260" data-h="180" data-color="A:--setA B:--setB"
          data-weights="2,1,…" data-caption="…"></div>                                        */
  function svgFigure(root) {
    const g = parseEdges(root.dataset.edges);
    if (root.dataset.nodes) root.dataset.nodes.split(/[,\s]+/).filter(Boolean).forEach(l => { if (!g.labels.includes(l)) g.labels.push(l); });
    const n = g.labels.length;
    const W = +root.dataset.w || 240, H = +root.dataset.h || 170, pad = +root.dataset.pad || 22;
    let P;
    if (root.dataset.pos) {
      const raw = {};
      root.dataset.pos.trim().split(/\s+/).forEach(t => { const [l, xy] = t.split(":"); raw[l] = xy.split(",").map(Number); });
      const pts = g.labels.map(l => raw[l] || [0.5, 0.5]);
      const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
      const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
      const sx = x1 - x0 || 1, sy = y1 - y0 || 1, s = Math.min((W - 2 * pad) / sx, (H - 2 * pad) / sy);
      const ox = (W - sx * s) / 2, oy = (H - sy * s) / 2;
      P = pts.map(p => [ox + (p[0] - x0) * s, oy + (p[1] - y0) * s]);
    } else {
      const L = root.dataset.layout === "force" ? forceLayout(n, g.edges, { seed: +root.dataset.seed || 7, aspect: H / W }) : circleLayout(n);
      P = L.map(p => [pad + p[0] * (W - 2 * pad), pad + p[1] * (H - 2 * pad)]);
    }
    const col = {};
    (root.dataset.color || "").trim().split(/\s+/).filter(Boolean).forEach(t => { const [l, c] = t.split(":"); col[l] = c; });
    const wts = (root.dataset.weights || "").split(",").filter(Boolean).map(Number);
    const signs = (root.dataset.signs || "").split(",").map(t => t.trim());   // „+”, „-” élenként (előjeles gráf)
    const directed = root.dataset.directed != null;                        // irányított: az él a→b, nyíl b-nél
    const r = +root.dataset.r || 13;
    const NS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.setAttribute("class", "gfig-svg");
    svg.style.maxWidth = W + "px";
    const el = (tag, attrs, txt) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (txt != null) e.textContent = txt; svg.append(e); return e; };
    const seen = {};
    g.edges.forEach(([a, b], ei) => {
      const w = wts[ei];
      const sw = w ? 1.2 + 1.3 * w : 2;
      if (a === b) {                                           // hurok
        const [x, y] = P[a];
        el("circle", { cx: x, cy: y - r - 7, r: 9, fill: "none", class: "ge", "stroke-width": sw });
        return;
      }
      const key = edgeKey(a, b), cnt = g.edges.filter(([u, v]) => edgeKey(u, v) === key).length;
      const k = (seen[key] = (seen[key] || 0) + 1) - 1;
      const [x1, y1] = P[a], [x2, y2] = P[b];
      const off = (k - (cnt - 1) / 2) * 16;                    // többszörös él: ívek
      const sg = signs[ei], cls = "ge" + (sg === "+" ? " pos" : sg === "-" ? " neg" : "");
      let tx = x2 - x1, ty = y2 - y1;                           // a végpontbeli érintő (a nyílhoz)
      if (off === 0) el("line", { x1, y1, x2, y2, class: cls, "stroke-width": sw });
      else {
        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy) || 1;
        const sgn = a < b ? 1 : -1;
        const cx = mx - dy / d * off * 2 * sgn, cy = my + dx / d * off * 2 * sgn;
        el("path", { d: `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`, fill: "none", class: cls, "stroke-width": sw });
        tx = x2 - cx; ty = y2 - cy;
      }
      if (directed) {
        const L = Math.hypot(tx, ty) || 1, ux = tx / L, uy = ty / L, rr = g.labels[b].length > 3 ? Math.min(2 * r, 24) / 2 + 2 : r + 1;
        const px = x2 - ux * rr, py = y2 - uy * rr, hs = 8;
        el("polygon", { points: `${px},${py} ${px - ux * hs - uy * hs * 0.5},${py - uy * hs + ux * hs * 0.5} ${px - ux * hs + uy * hs * 0.5},${py - uy * hs - ux * hs * 0.5}`, class: "ga" + (sg === "+" ? " pos" : sg === "-" ? " neg" : "") });
      }
      if (w && root.dataset.showWeights != null) {
        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
        el("circle", { cx: mx, cy: my, r: 7.5, class: "gw-bg" });
        el("text", { x: mx, y: my + 0.5, class: "gw" }, w);
      }
    });
    g.labels.forEach((l, i) => {
      const [x, y] = P[i];
      const c = col[l];
      const long = l.length > 3;                               // hosszú címke: „tabletta” alak
      const pw = 6.6 * l.length + 12, ph = Math.min(2 * r, 24);
      const circ = long ? el("rect", { x: x - pw / 2, y: y - ph / 2, width: pw, height: ph, rx: ph / 2, class: "gn" })
                        : el("circle", { cx: x, cy: y, r, class: "gn" });
      if (c) { const v = c.startsWith("--") ? `var(${c})` : c; circ.style.fill = v; circ.style.stroke = v; }
      const t = el("text", { x, y: y + 0.5, class: "gl" + (c ? " on" : "") }, l);
      if (long) t.setAttribute("font-size", 11);
      else if (l.length > 2) t.setAttribute("font-size", Math.max(8, 12 - (l.length - 2) * 1.6));
    });
    root.innerHTML = "";
    root.append(svg);
    if (root.dataset.caption) {
      const cap = document.createElement("div");
      cap.className = "gfig-cap";
      cap.innerHTML = root.dataset.caption;
      root.append(cap);
    }
  }

  /* ---------- interaktív canvas-nézet ----------
     opts: { aspect, maxW, editable, nodes: [{label, x, y, color}], edges: [{a, b, w}],
             onChange(view), radius, showWeights, weightWidth, directed (nyílhegy a b végen; élenként: dir), multiGap (párhuzamos élek távolsága, 18) }
     Szerkesztés (editable): üres helyre kattintás → új csúcs; csúcs, majd egy másik csúcs → él be/ki;
     élre kattintás → él törlése; húzás → mozgatás.                                            */
  const views = [];
  let rT;
  addEventListener("resize", () => { clearTimeout(rT); rT = setTimeout(() => views.forEach(v => v.resize()), 150); });
  new MutationObserver(() => views.forEach(v => v.draw())).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  class View {
    constructor(parent, opts = {}) {
      this.o = Object.assign({ aspect: 0.55, maxW: 760, editable: false, radius: 15, showWeights: false }, opts);
      this.parent = parent;
      this.c = document.createElement("canvas");
      this.c.style.touchAction = "none";
      this.c.style.display = "block";
      parent.append(this.c);
      this.ctx = this.c.getContext("2d");
      this.nodes = (opts.nodes || []).map(n => Object.assign({}, n));
      this.edges = (opts.edges || []).map(e => Object.assign({ w: 1 }, e));
      this.sel = -1;            // kijelölt csúcs (élrajzoláshoz)
      this.hl = new Set();      // kiemelt csúcsok
      this.hlE = new Set();     // kiemelt élek (kulcs: "a-b")
      this.dim = false;         // ha van kiemelés, a többi halványabb
      this.resize();
      this._bind();
      views.push(this);
    }
    resize() {
      const st = getComputedStyle(this.parent);
      const inner = this.parent.clientWidth - (parseFloat(st.paddingLeft) || 0) - (parseFloat(st.paddingRight) || 0);
      const w = Math.min(this.o.maxW, inner > 0 ? inner : this.o.maxW), h = Math.round(w * this.o.aspect);
      const dpr = window.devicePixelRatio || 1;
      this.c.width = Math.round(w * dpr); this.c.height = Math.round(h * dpr);
      this.c.style.width = w + "px"; this.c.style.height = h + "px";
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.w = w; this.h = h;
      this.draw();
    }
    /* koordináták: a csúcsok x, y értéke a [0;1] tartományban, a canvas méretéhez képest */
    px(n) { return [n.x * this.w, n.y * this.h]; }
    setGraph(nodes, edges) {
      this.nodes = nodes.map(n => Object.assign({}, n));
      this.edges = edges.map(e => Object.assign({ w: 1 }, e));
      this.sel = -1;
      this.draw();
    }
    layout(seed = 7) {
      const P = forceLayout(this.nodes.length, this.edges.map(e => [e.a, e.b]), { seed, aspect: this.o.aspect });
      P.forEach((p, i) => { this.nodes[i].x = p[0]; this.nodes[i].y = p[1]; });
      this.draw();
    }
    animateTo(targets, ms = 700) {
      const from = this.nodes.map(n => [n.x, n.y]), t0 = performance.now();
      const step = t => {
        const u = Math.min(1, (t - t0) / ms), e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
        this.nodes.forEach((n, i) => { n.x = from[i][0] + (targets[i][0] - from[i][0]) * e; n.y = from[i][1] + (targets[i][1] - from[i][1]) * e; });
        this.draw();
        if (u < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
    edgeList() { return this.edges.map(e => [e.a, e.b]); }
    hasEdge(a, b) { return this.edges.some(e => edgeKey(e.a, e.b) === edgeKey(a, b)); }
    toggleEdge(a, b) {
      const k = edgeKey(a, b), i = this.edges.findIndex(e => edgeKey(e.a, e.b) === k);
      if (i >= 0) this.edges.splice(i, 1); else this.edges.push({ a, b, w: 1 });
    }
    removeNode(i) {
      this.nodes.splice(i, 1);
      this.edges = this.edges.filter(e => e.a !== i && e.b !== i).map(e => ({ ...e, a: e.a > i ? e.a - 1 : e.a, b: e.b > i ? e.b - 1 : e.b }));
      this.sel = -1;
    }
    nextLabel() {
      const used = new Set(this.nodes.map(n => n.label));
      for (let i = 0; i < 26; i++) { const l = String.fromCharCode(65 + i); if (!used.has(l)) return l; }
      let k = 1; while (used.has("v" + k)) k++; return "v" + k;
    }
    _hitNode(x, y) {
      const r = this.o.radius + 4;
      for (let i = this.nodes.length - 1; i >= 0; i--) { const [nx, ny] = this.px(this.nodes[i]); if (Math.hypot(nx - x, ny - y) <= r) return i; }
      return -1;
    }
    /* az i-edik él geometriája: végpontok, ív esetén a kontrollpont (cx, cy), és a felezőpont (mx, my) a görbén */
    edgeGeom(i) {
      const e = this.edges[i], k = edgeKey(e.a, e.b);
      const [x1, y1] = this.px(this.nodes[e.a]), [x2, y2] = this.px(this.nodes[e.b]);
      const g = this.edges.reduce((acc, f, j) => (edgeKey(f.a, f.b) === k ? acc.concat(j) : acc), []);
      const off = (g.indexOf(i) - (g.length - 1) / 2) * (this.o.multiGap || 18);     // multiGap: a párhuzamos ívek távolsága
      if (e.a === e.b || off === 0) return { x1, y1, x2, y2, cx: null, cy: null, mx: (x1 + x2) / 2, my: (y1 + y2) / 2 };
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy) || 1, s = e.a < e.b ? 1 : -1;
      const cx = mx - dy / d * off * 2 * s, cy = my + dx / d * off * 2 * s;
      return { x1, y1, x2, y2, cx, cy, mx: 0.25 * x1 + 0.5 * cx + 0.25 * x2, my: 0.25 * y1 + 0.5 * cy + 0.25 * y2 };
    }
    _hitEdge(x, y) {
      let best = -1, bd = this.o.edgeHitTol || 7;
      const seg = (x1, y1, x2, y2) => {
        const dx = x2 - x1, dy = y2 - y1, L2 = dx * dx + dy * dy || 1;
        const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / L2));
        return Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy));
      };
      this.edges.forEach((e, i) => {
        if (e.a === e.b) return;
        const G = this.edgeGeom(i);
        let d;
        if (G.cx === null) d = seg(G.x1, G.y1, G.x2, G.y2);
        else {                                                   // ív: 16 szakasszal közelítve
          d = Infinity;
          const q = t => [(1 - t) * (1 - t) * G.x1 + 2 * (1 - t) * t * G.cx + t * t * G.x2, (1 - t) * (1 - t) * G.y1 + 2 * (1 - t) * t * G.cy + t * t * G.y2];
          for (let s = 0; s < 16; s++) { const [ax, ay] = q(s / 16), [bx, by] = q((s + 1) / 16); d = Math.min(d, seg(ax, ay, bx, by)); }
        }
        if (d < bd) { bd = d; best = i; }
      });
      return best;
    }
    _bind() {
      let drag = -1, moved = false, sx = 0, sy = 0;
      const pos = ev => { const r = this.c.getBoundingClientRect(); return [ev.clientX - r.left, ev.clientY - r.top]; };
      this.c.addEventListener("pointerdown", ev => {
        const [x, y] = pos(ev);
        drag = this._hitNode(x, y); moved = false; sx = x; sy = y;
        if (drag >= 0) this.c.setPointerCapture(ev.pointerId);
      });
      this.c.addEventListener("pointermove", ev => {
        const [x, y] = pos(ev);
        if (drag >= 0 && (moved || Math.hypot(x - sx, y - sy) > 4) && this.o.draggable !== false) {
          moved = true;
          const r = this.o.radius;
          this.nodes[drag].x = Math.max(r, Math.min(this.w - r, x)) / this.w;
          this.nodes[drag].y = Math.max(r, Math.min(this.h - r, y)) / this.h;
          this.draw();
        } else this.c.style.cursor = this._hitNode(x, y) >= 0 || (this.o.onEdgeClick && this._hitEdge(x, y) >= 0) ? "pointer" : (this.o.editable && this._hitEdge(x, y) >= 0 ? "not-allowed" : (this.o.editable ? "crosshair" : "default"));
      });
      this.c.addEventListener("pointerup", ev => {
        const [x, y] = pos(ev);
        const d = drag; drag = -1;
        if (moved) { this.o.onMove && this.o.onMove(this); return; }
        if (this.o.onNodeClick && d >= 0) { this.o.onNodeClick(d, this); return; }
        if (this.o.onEdgeClick && d < 0) { const ei = this._hitEdge(x, y); if (ei >= 0) { this.o.onEdgeClick(ei, this); return; } }
        if (!this.o.editable) return;
        if (d >= 0) {
          if (this.sel < 0) this.sel = d;
          else if (this.sel === d) this.sel = -1;
          else { this.toggleEdge(this.sel, d); this.sel = -1; this._changed(); return; }
          this.draw(); return;
        }
        const ei = this._hitEdge(x, y);
        if (ei >= 0) { this.edges.splice(ei, 1); this.sel = -1; this._changed(); return; }
        if (this.sel >= 0) { this.sel = -1; this.draw(); return; }
        if (this.nodes.length >= (this.o.maxNodes || 12)) return;
        this.nodes.push({ label: this.nextLabel(), x: x / this.w, y: y / this.h });
        this._changed();
      });
    }
    _changed() { this.draw(); this.o.onChange && this.o.onChange(this); }
    draw() {
      const ctx = this.ctx, W = this.w, H = this.h, r = this.o.radius;
      if (!W) return;
      ctx.clearRect(0, 0, W, H);
      const accent = css("--accent"), text = css("--text"), muted = css("--muted"), card = css("--card"), border = css("--border");
      const anyHL = this.dim && (this.hl.size || this.hlE.size);
      const maxW = Math.max(1, ...this.edges.map(e => e.w || 1));
      // élek (a többszöröseket ívben)
      const groups = {};
      this.edges.forEach((e, i) => { const k = edgeKey(e.a, e.b); (groups[k] = groups[k] || []).push(i); });
      /* élenkénti, opcionális mezők: color (szín vagy CSS-változó), width (vonalvastagság), dash (pl. [6, 4]),
         label (a súly helyett kiírt szöveg, showWeights mellett), alpha (átlátszóság 0–1, a kiemelés szerinti halványítás helyett), dir (nyílhegy) */
      this.edges.forEach((e, i) => {
        const k = edgeKey(e.a, e.b), on = this.hlE.has(k), ec = e.color ? color(e.color) : null;
        const [x1, y1] = this.px(this.nodes[e.a]), [x2, y2] = this.px(this.nodes[e.b]);
        ctx.strokeStyle = ec || (on ? accent : (anyHL ? border : muted));
        ctx.globalAlpha = e.alpha != null ? e.alpha : (anyHL && !on && !ec ? 0.7 : 1);
        ctx.lineWidth = e.width != null ? e.width : (this.o.showWeights || this.o.weightWidth ? 1.3 + 2.4 * (e.w || 1) / maxW * (maxW > 1 ? 1.4 : 1) : 2) + (on ? 1 : 0);
        if (e.dash) ctx.setLineDash(e.dash);
        ctx.beginPath();
        if (e.a === e.b) { ctx.arc(x1, y1 - r - 8, 10, 0, 2 * Math.PI); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1; return; }
        const G = groups[k].length > 1 ? this.edgeGeom(i) : { cx: null, mx: (x1 + x2) / 2, my: (y1 + y2) / 2 };
        ctx.moveTo(x1, y1);
        if (G.cx === null) ctx.lineTo(x2, y2);
        else ctx.quadraticCurveTo(G.cx, G.cy, x2, y2);
        ctx.stroke();
        ctx.setLineDash([]);
        if (this.o.directed || e.dir) {                          // nyílhegy a b végponton
          let tx = G.cx === null ? x2 - x1 : x2 - G.cx, ty = G.cx === null ? y2 - y1 : y2 - G.cy;
          const L = Math.hypot(tx, ty) || 1; tx /= L; ty /= L;
          const px = x2 - tx * (r + 1), py = y2 - ty * (r + 1), hs = 9;
          ctx.fillStyle = ctx.strokeStyle;
          ctx.beginPath(); ctx.moveTo(px, py);
          ctx.lineTo(px - tx * hs - ty * hs * 0.5, py - ty * hs + tx * hs * 0.5);
          ctx.lineTo(px - tx * hs + ty * hs * 0.5, py - ty * hs - tx * hs * 0.5);
          ctx.closePath(); ctx.fill();
        }
        ctx.globalAlpha = 1;
        if (this.o.showWeights && (e.label != null ? e.label !== "" : (e.w || 1) > 0)) {
          const mx = G.mx, my = G.my, lab = e.label != null ? String(e.label) : String(e.w);
          if (e.alpha != null) ctx.globalAlpha = e.alpha;
          const rw = lab.length <= 2 ? 9 : 3.4 * lab.length + 4.5;
          ctx.fillStyle = card; ctx.strokeStyle = ec || border; ctx.lineWidth = 1;
          ctx.beginPath();
          if (rw <= 9) ctx.arc(mx, my, 9, 0, 2 * Math.PI);
          else { ctx.moveTo(mx - rw + 9, my - 9); ctx.lineTo(mx + rw - 9, my - 9); ctx.arc(mx + rw - 9, my, 9, -Math.PI / 2, Math.PI / 2); ctx.lineTo(mx - rw + 9, my + 9); ctx.arc(mx - rw + 9, my, 9, Math.PI / 2, 3 * Math.PI / 2); }
          ctx.fill(); ctx.stroke();
          ctx.fillStyle = text; ctx.font = "600 11px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText(lab, mx, my + 0.5);
          ctx.globalAlpha = 1;
        }
      });
      // csúcsok
      this.nodes.forEach((n, i) => {
        const [x, y] = this.px(n);
        const on = this.hl.has(i) || this.sel === i;
        const c = n.color ? color(n.color) : null;
        ctx.globalAlpha = anyHL && !on ? 0.45 : 1;
        ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fillStyle = c || card; ctx.fill();
        ctx.lineWidth = on ? 3.5 : 2; ctx.strokeStyle = on ? accent : (c || text); ctx.stroke();
        if (this.sel === i) { ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.arc(x, y, r + 5, 0, 2 * Math.PI); ctx.stroke(); ctx.setLineDash([]); }
        const lab = String(n.label);
        ctx.fillStyle = c ? "#fff" : text;
        ctx.font = `600 ${lab.length > 2 ? Math.max(9, 13 - (lab.length - 2) * 1.5) : 13}px system-ui, sans-serif`;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(lab, x, y + 0.5);
        if (n.badge != null) {                                   // pl. fokszám a csúcs mellett
          ctx.font = "600 11px system-ui, sans-serif"; ctx.fillStyle = accent;
          ctx.lineWidth = 3; ctx.strokeStyle = card; ctx.strokeText(String(n.badge), x + r + 7, y - r + 2);   // háttér-körvonal: élen is olvasható
          ctx.fillText(String(n.badge), x + r + 7, y - r + 2);
        }
        if (n.sub) { ctx.font = "11px system-ui, sans-serif"; ctx.lineWidth = 3; ctx.strokeStyle = card; ctx.strokeText(n.sub, x, y + r + 10); ctx.fillStyle = muted; ctx.fillText(n.sub, x, y + r + 10); }
        ctx.globalAlpha = 1;
      });
      this.o.onDraw && this.o.onDraw(ctx, this);
    }
  }

  /* ---------- automatikus indítás: statikus ábrák ---------- */
  function mountFigures(scope = document) { scope.querySelectorAll(".gfig[data-edges]").forEach(svgFigure); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => mountFigures());
  else mountFigures();

  window.GraphKit = { css, color, rng, parseEdges, degrees, adjMatrix, adjList, edgeKey, circleLayout, forceLayout, normalize, svgFigure, mountFigures, View };
})();
