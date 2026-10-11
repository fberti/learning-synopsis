
  /* ==================================================================
     w1 – 13.1-b gráfépítő (mátrix, lista, fokszám) · 13.3 üzenetküldés
     ================================================================== */
  const w1Font = (px, wt = 600) => `${wt} ${px}px system-ui, sans-serif`;
  const w1OnTheme = fn => new MutationObserver(fn).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  /* canvas, amelynek magassága a szélességtől (és a tartalomtól) függ; HiDPI, téma- és méretváltáskor újrarajzol */
  function w1Canvas(parent, heightOf, maxW = 760) {
    const c = h("canvas", { style: "display:block;touch-action:none;max-width:100%" });
    parent.append(c);
    const o = { c, ctx: c.getContext("2d"), w: 0, h: 0, draw: null };
    o.resize = () => {
      const w = Math.min(maxW, parent.clientWidth || maxW), hh = Math.max(60, Math.round(heightOf(w)));
      const dpr = window.devicePixelRatio || 1;
      if (o.w !== w || o.h !== hh || c.width !== Math.round(w * dpr)) {
        c.width = Math.round(w * dpr); c.height = Math.round(hh * dpr);
        c.style.width = w + "px"; c.style.height = hh + "px";
      }
      o.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      o.w = w; o.h = hh;
    };
    o.resize();
    let t;
    addEventListener("resize", () => { clearTimeout(t); t = setTimeout(() => o.draw && o.draw(), 160); });
    w1OnTheme(() => o.draw && o.draw());
    return o;
  }
  /* magolt véletlen (mulberry32) */
  function w1Rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  /* névelő a csúcs neve elé: az A, a B, az 1, a 2, az 5 … */
  const w1Art = s => {
    s = String(s);
    if (/^\d+$/.test(s)) return s === "1" || s[0] === "5" ? "az" : "a";
    return /^[AEFILMNORSX]/.test(s) ? "az" : "a";
  };
  const w1ArtC = s => (w1Art(s) === "az" ? "Az" : "A");
  /* rögzített 3 tizedes (a szórásnál: 0,910 és nem 0,91) */
  const w1Fix = (x, d = 3) => (Math.abs(x) < 0.5 * Math.pow(10, -d) ? 0 : x).toFixed(d).replace("-", "−").replace(".", ",");
  const w1Key = (a, b) => (a < b ? a + "|" + b : b + "|" + a);
  const w1Std = v => { const m = v.reduce((s, x) => s + x, 0) / v.length; return Math.sqrt(v.reduce((s, x) => s + (x - m) ** 2, 0) / v.length); };
  /* a futó példa: A bal fent, C bal lent, B középen, D és E jobbra */
  const W1EX = {
    names: ["A", "B", "C", "D", "E"],
    xy: [[0.04, 0.06], [0.4, 0.5], [0.04, 0.94], [0.7, 0.5], [0.97, 0.5]],
    edges: [[0, 1], [0, 2], [1, 2], [1, 3], [3, 4]],
    x: [1, 0, 0, 0, 5]
  };
  const w1Cell = "padding:.18em .42em;text-align:center;font-family:var(--mono);font-size:.84rem;border:1px solid var(--border);";
  const w1Th = w1Cell + "background:var(--bg-soft);font-weight:600;white-space:nowrap;";
  const w1Tint = (v, t) => `background:color-mix(in srgb, var(${v}) ${Math.round(100 * clamp(t, 0, 1))}%, var(--card));`;

  /* ------------------------------------------------------------------
     1. Gráfépítő – szomszédsági mátrix, lista, fokszám, A² (13.1-b)
     ------------------------------------------------------------------ */
  W["graph-builder"] = root => {
    header(root, "Gráfépítő – mátrix, lista, fokszám",
      "Kattints <b>üres helyre</b>: új csúcs. Kattints egy csúcsra, majd egy <b>másikra</b>: él be/ki. Ugyanarra a csúcsra még egyszer: " +
      "kijelölés vége. A csúcsokat húzhatod is. A narancs szám a csúcs <b>sorszáma</b> – ez adja a mátrix sorrendjét.");
    const LET = "ABCDEFGH";
    let nodes, edges, order, sel = null, showA2 = false, renum = 0, renumbered = false, msg = "";
    const reset = ex => {
      nodes = ex ? W1EX.names.map((n, i) => ({ name: n, x: W1EX.xy[i][0], y: W1EX.xy[i][1] })) : [];
      edges = new Set(ex ? W1EX.edges.map(([a, b]) => w1Key(W1EX.names[a], W1EX.names[b])) : []);
      order = nodes.map(n => n.name); sel = null; renumbered = false;
      msg = ex ? "" : "Üres gráf: kattints a vászonra, és rakd össze a sajátodat!";
    };
    reset(true);

    function renumber() {
      if (order.length < 2) { msg = "Átszámozáshoz legalább 2 csúcs kell."; upd(); return; }
      const rng = w1Rng(1307 + 7919 * (++renum));
      let o;
      do {
        o = order.slice();
        for (let i = o.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [o[i], o[j]] = [o[j], o[i]]; }
      } while (o.join() === order.join());
      order = o; renumbered = true; msg = ""; upd();
    }
    function delSel() {
      if (!sel) return;
      const s = sel;
      nodes = nodes.filter(n => n.name !== s);
      order = order.filter(n => n !== s);
      [...edges].forEach(k => { if (k.split("|").includes(s)) edges.delete(k); });
      sel = null; msg = `${w1ArtC(s)} ${s} csúcsot és az éleit töröltem.`; upd();
    }
    const bDel = btn("Csúcs törlése", delSel);
    const cbA2 = checkbox(false, () => { showA2 = cbA2.checked; upd(); });
    root.append(h("div", { class: "controls" },
      btn("Mintagráf", () => { reset(true); upd(); }), btn("Üres", () => { reset(false); upd(); }),
      btn("Átszámozás", renumber), bDel, h("label", null, cbA2, "teljes A² mutatása")));

    const grid = h("div", { style: "display:flex;flex-wrap:wrap;gap:.8rem;align-items:flex-start" });
    const L = h("div", { style: "flex:1 1 320px;min-width:0" }), R = h("div", { style: "flex:1 1 250px;min-width:0" });
    grid.append(L, R); root.append(grid);
    const cv = w1Canvas(L, w => clamp(w * 0.74, 230, 380), 520);
    const note = h("div", { class: "muted", style: "font-size:.85rem;min-height:1.3em;margin-top:.2rem" });
    L.append(note);
    const mBox = h("div"); R.append(mBox);
    const out = h("div", { class: "readout", style: "font-family:var(--font);line-height:1.6" });
    root.append(out);

    /* geometria */
    const rad = () => (cv.w < 360 ? 15 : 17);
    const pads = () => { const r = rad(); return { l: r + 12, r: r + 12, t: r + 14, b: r + 24 }; };
    const P = n => { const p = pads(); return [p.l + n.x * (cv.w - p.l - p.r), p.t + n.y * (cv.h - p.t - p.b)]; };
    const inv = (px, py) => { const p = pads(); return [clamp((px - p.l) / (cv.w - p.l - p.r), 0, 1), clamp((py - p.t) / (cv.h - p.t - p.b), 0, 1)]; };
    const nodeAt = (px, py) => {
      let best = null, bd = 1e9;
      nodes.forEach(n => { const [x, y] = P(n), d = Math.hypot(x - px, y - py); if (d < rad() + 7 && d < bd) { bd = d; best = n.name; } });
      return best;
    };
    /* mátrixok a sorszám szerinti sorrendben */
    const mat = () => order.map(a => order.map(b => (a !== b && edges.has(w1Key(a, b)) ? 1 : 0)));
    const sq = A => A.map(r => A.map((_, j) => r.reduce((s, v, q) => s + v * A[q][j], 0)));
    const num = nm => order.indexOf(nm) + 1;
    const deg = nm => order.reduce((s, b) => s + (b !== nm && edges.has(w1Key(nm, b)) ? 1 : 0), 0);

    cv.draw = () => {
      cv.resize();
      const { ctx, w, h: hh } = cv;
      ctx.clearRect(0, 0, w, hh); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
      const r = rad(), acc = css("--accent"), tx = css("--text"), mu = css("--muted"), cB = css("--setB"), cC = css("--setC"), card = css("--card");
      const pos = Object.fromEntries(nodes.map(n => [n.name, P(n)]));
      edges.forEach(k => {
        const [a, b] = k.split("|"), on = sel && (a === sel || b === sel);
        ctx.save(); ctx.strokeStyle = on ? acc : mu; ctx.lineWidth = on ? 3 : 2;
        ctx.beginPath(); ctx.moveTo(...pos[a]); ctx.lineTo(...pos[b]); ctx.stroke(); ctx.restore();
      });
      let a2 = null;
      if (sel) a2 = sq(mat())[order.indexOf(sel)];
      nodes.forEach(n => {
        const [x, y] = pos[n.name], s = n.name === sel;
        if (s) ring(ctx, x, y, r + 5, acc, 2, [4, 3]);
        dot(ctx, x, y, r, s ? acc : card);
        ring(ctx, x, y, r, acc, 2);
        label(ctx, n.name, x, y + 1, s ? card : tx, "center", w1Font(15, 700), "middle");
        const bx = x + r * 0.78, by = y - r * 0.78;
        dot(ctx, bx, by, 8.5, cB);
        label(ctx, String(num(n.name)), bx, by + 0.5, card, "center", w1Font(10.5, 700), "middle");
        if (a2) { const v = a2[order.indexOf(n.name)]; if (v > 0) label(ctx, `${v} séta`, x, y + r + 19, cC, "center", w1Font(11.5, 700)); }
      });
      if (!nodes.length) label(ctx, "Üres gráf – kattints ide új csúcsért!", w / 2, hh / 2, mu, "center", w1Font(13, 500), "middle");
    };

    /* egér / érintés: kattintás, húzás */
    let drag = null;
    cv.c.addEventListener("pointerdown", e => {
      const [x, y] = evXY(cv, e), hit = nodeAt(x, y);
      drag = { name: hit, x0: x, y0: y, moved: false };
      try { cv.c.setPointerCapture(e.pointerId); } catch (_) { /* nincs */ }
      e.preventDefault();
    });
    cv.c.addEventListener("pointermove", e => {
      const [x, y] = evXY(cv, e);
      if (!drag) { cv.c.style.cursor = nodeAt(x, y) ? "pointer" : "crosshair"; return; }
      if (!drag.name) return;
      if (!drag.moved && Math.hypot(x - drag.x0, y - drag.y0) > 5) drag.moved = true;
      if (drag.moved) {
        const n = nodes.find(q => q.name === drag.name), [u, v] = inv(x, y);
        n.x = u; n.y = v; cv.draw();
      }
    });
    const end = e => {
      if (!drag) return;
      const d = drag; drag = null;
      if (d.moved) return;
      if (d.name) clickNode(d.name);
      else clickEmpty(d.x0, d.y0);
    };
    cv.c.addEventListener("pointerup", end);
    cv.c.addEventListener("pointercancel", () => { drag = null; });
    function clickNode(nm) {
      if (!sel) { sel = nm; msg = `Kijelölve: ${nm}. Kattints egy másik csúcsra az él be/kikapcsolásához, vagy ugyanerre a kijelölés megszüntetéséhez.`; }
      else if (sel === nm) { sel = null; msg = ""; }
      else {
        const k = w1Key(sel, nm), had = edges.has(k);
        if (had) edges.delete(k); else edges.add(k);
        msg = `${had ? "Töröltem" : "Behúztam"} ${w1Art(sel)} ${sel}–${nm} élt.`; sel = null;
      }
      upd();
    }
    function clickEmpty(px, py) {
      if (sel) { sel = null; msg = ""; upd(); return; }
      if (nodes.length >= 8) { msg = "Legfeljebb 8 csúcs lehet (a mátrix így is 64 számot tárol)."; upd(); return; }
      const nm = [...LET].find(c => !nodes.some(n => n.name === c));
      const [u, v] = inv(px, py);
      nodes.push({ name: nm, x: u, y: v }); order.push(nm);
      msg = `Új csúcs: ${nm} (sorszáma ${order.length}).`; upd();
    }

    function matHTML(M, isA2, selI) {
      const n = order.length, mx = Math.max(1, ...M.flat());
      let s = `<table style="width:auto;margin:.2rem 0;border-collapse:collapse"><tr><th style="${w1Th}">${isA2 ? "A²" : "A"}</th>`;
      order.forEach(nm => { s += `<th style="${w1Th}"><span style="color:var(--setB)">${num(nm)}</span>&thinsp;${nm}</th>`; });
      s += "</tr>";
      M.forEach((row, i) => {
        const on = i === selI;
        s += `<tr><th style="${w1Th}${on ? "background:var(--accent-soft);color:var(--accent);" : ""}"><span style="color:var(--setB)">${num(order[i])}</span>&thinsp;${order[i]}</th>`;
        row.forEach((v, j) => {
          let st = w1Cell;
          if (isA2) st += v > 0 ? w1Tint("--setC", 0.15 + 0.45 * v / mx) + "font-weight:700;" : "color:var(--muted);";
          else st += v ? w1Tint("--accent", 0.3) + "font-weight:700;color:var(--text);" : "color:var(--muted);";
          if (on) st += "outline:2px solid var(--accent);outline-offset:-2px;";
          if (i === j && isA2) st += "text-decoration:underline;";
          s += `<td style="${st}">${v}</td>`;
        });
        s += "</tr>";
      });
      if (!isA2 && selI >= 0) {
        const r2 = sq(M)[selI];
        s += `<tr><th style="${w1Th}color:var(--setC)" title="a kijelölt csúcs sora A²-ben">A²: ${order[selI]}</th>`;
        r2.forEach(v => { s += `<td style="${w1Cell}${v > 0 ? w1Tint("--setC", 0.35) + "font-weight:700;" : "color:var(--muted);"}">${v}</td>`; });
        s += "</tr>";
      }
      return s + "</table>";
    }

    function upd() {
      setDis(bDel, !sel);
      note.textContent = msg;
      cv.draw();
      const n = order.length, A = mat(), selI = sel ? order.indexOf(sel) : -1;
      if (!n) {
        mBox.innerHTML = `<p class="muted" style="font-size:.9rem;margin:.3rem 0">Nincs csúcs, nincs mátrix.</p>`;
        out.innerHTML = "Üres gráf: n = 0, |E| = 0.";
        return;
      }
      let mh = `<div class="muted" style="font-size:.85rem">Szomszédsági mátrix (sorrend = sorszám):</div><div class="tw" style="overflow-x:auto">${matHTML(A, false, selI)}</div>`;
      if (showA2) mh += `<div class="muted" style="font-size:.85rem;margin-top:.4rem">A² = A · A – kétlépéses séták száma (átló = fokszám):</div><div class="tw" style="overflow-x:auto">${matHTML(sq(A), true, selI)}</div>`;
      mBox.innerHTML = mh;

      const E = edges.size, degs = order.map(deg), sum = degs.reduce((s, v) => s + v, 0);
      const nbs = nm => order.filter(b => b !== nm && edges.has(w1Key(nm, b)));
      const L = [];
      L.push("<b>Szomszédsági lista:</b> " + order.map(nm => `<span style="white-space:nowrap">${nm}: ${nbs(nm).join(", ") || "–"}</span>`).join(" · "));
      L.push("<b>Fokszámok:</b> " + order.map((nm, i) => `${nm} ${degs[i]}`).join(", ") + ` · élek száma |E| = ${E}`);
      L.push(`<b>Ellenőrzés:</b> fokszámok összege = ${degs.join(" + ")} = ${sum} = 2 · ${E} = 2 · élek száma ${sum === 2 * E ? "✓" : "✗"} ` +
        `<span class="muted">(minden él két csúcs fokszámába számít bele)</span>`);
      L.push(`<b>Tárolás:</b> a mátrix n² = ${n}² = ${n * n} számot tárol, a lista 2|E| = 2 · ${E} = ${2 * E} bejegyzést.`);
      const sorted = degs.slice().sort((a, b) => b - a).join(", ");
      L.push(renumbered
        ? `<b>A számozás más, a gráf ugyanaz:</b> fokszámok rendezve: ${sorted}. <span class="muted">(Számozás: ${order.map(nm => `${nm} = ${num(nm)}`).sort().join(", ")}.)</span>`
        : `Fokszámok rendezve: ${sorted} – ez nem függ a számozástól. <span class="muted">Próbáld ki az Átszámozást: a mátrix megváltozik, a gráf nem.</span>`);
      if (sel) {
        const r2 = sq(A)[selI];
        const walks = order.map((t, j) => {
          const via = order.filter((m, q) => A[selI][q] && A[q][j]);
          return via.length ? `${t}: ${via.map(m => `${sel}→${m}→${t}`).join(", ")}` : null;
        }).filter(Boolean);
        L.push(`<b>Kétlépéses séták (${w1Art(sel)} ${sel} sora A²-ben):</b> (${r2.join("; ")}) – ${walks.join(" · ") || "nincs ilyen séta"}. ` +
          `<span class="muted">Az átlóelem (${r2[selI]}) a fokszám: oda-vissza séták.</span>`);
      }
      out.innerHTML = L.join("<br>");
    }
    upd();
  };

  /* ------------------------------------------------------------------
     2. Üzenetküldés lépésről lépésre (13.3)
     ------------------------------------------------------------------ */
  W["message-passing"] = root => {
    header(root, "Üzenetküldés lépésről lépésre",
      "Egy lépésben (rétegben) minden csúcs összegyűjti a szomszédai értékét: $m_v$ = összeg / átlag / maximum $N(v)$ fölött, " +
      "majd ebből számolja az új értékét. Kattints egy csúcsra: látod, honnan kap üzenetet, és mit lát $k$ réteg után.");
    const PRE = {
      ex: () => ({ names: W1EX.names.slice(), xy: W1EX.xy, edges: W1EX.edges, x: W1EX.x.slice() }),
      chain: () => ({ names: [1, 2, 3, 4, 5, 6, 7, 8].map(String), xy: [0, 1, 2, 3, 4, 5, 6, 7].map(i => [i / 7, 0.5]),
        edges: [0, 1, 2, 3, 4, 5, 6].map(i => [i, i + 1]), x: [1, 0, 0, 0, 0, 0, 0, 0] }),
      karate: () => { const K = window.KARATE13; return { names: K.xy.map((_, i) => String(i + 1)), xy: K.xy, edges: K.edges, x: K.xy.map((_, i) => (i ? 0 : 1)) }; }
    };
    const KMAX = 30;
    let pre = "ex", G, k = 0, H = [], agg = "sum", self = false, mode = "agg", wS = 0.5, wM = 1, bb = 0, sel = null;

    const AGG = vals => {
      if (!vals.length) return 0;
      if (agg === "max") return Math.max(...vals);
      const s = vals.reduce((a, b) => a + b, 0);
      return agg === "mean" ? s / vals.length : s;
    };
    const inSet = v => (self ? [...G.nb[v], v].sort((a, b) => a - b) : G.nb[v]);
    const stepOnce = hv => hv.map((hvv, v) => {
      const m = AGG(inSet(v).map(u => hv[u]));
      return mode === "agg" ? m : Math.max(0, wS * hvv + wM * m + bb);
    });
    const recompute = () => { H = [G.x.slice()]; for (let i = 0; i < k; i++) H.push(stepOnce(H[i])); };
    const load = key => {
      pre = key;
      const p = PRE[key](), n = p.names.length, nb = p.names.map(() => []);
      p.edges.forEach(([a, b]) => { nb[a].push(b); nb[b].push(a); });
      nb.forEach(l => l.sort((a, b) => a - b));
      G = Object.assign(p, { n, nb });
      k = 0; sel = null; recompute();
    };
    const bfs = s => {
      const d = new Array(G.n).fill(-1), q = [s]; d[s] = 0;
      while (q.length) { const v = q.shift(); G.nb[v].forEach(u => { if (d[u] < 0) { d[u] = d[v] + 1; q.push(u); } }); }
      return d;
    };

    /* vezérlők */
    const presets = [["ex", "Futó példa (A–E)"], ["chain", "Lánc (8 csúcs)"]];
    if (window.KARATE13) presets.push(["karate", "Karateklub (34)"]);
    const gP = toggleGroup(presets, () => pre, key => { load(key); upd(); });
    const gA = toggleGroup([["sum", "összeg"], ["mean", "átlag"], ["max", "maximum"]], () => agg, key => { agg = key; recompute(); upd(); });
    const cbSelf = checkbox(false, () => { self = cbSelf.checked; recompute(); upd(); });
    const gM = toggleGroup([["agg", "csak aggregálás: h′ = m"], ["upd", "frissítés: h′ = ReLU(w₁·h + w₂·m + b)"]], () => mode, key => { mode = key; recompute(); upd(); });
    const sS = slider(-2, 2, 0.05, wS), sM = slider(-2, 2, 0.05, wM), sB = slider(-2, 2, 0.05, bb);
    const vS = h("b", { style: "font-family:var(--mono);min-width:2.6em;display:inline-block" }), vM = vS.cloneNode(), vB = vS.cloneNode();
    sS.addEventListener("input", () => { wS = +sS.value; recompute(); upd(); });
    sM.addEventListener("input", () => { wM = +sM.value; recompute(); upd(); });
    sB.addEventListener("input", () => { bb = +sB.value; recompute(); upd(); });
    const bDef = btn("alap (0,5; 1; 0)", () => { wS = 0.5; wM = 1; bb = 0; sS.value = wS; sM.value = wM; sB.value = bb; recompute(); upd(); });
    const bStep = btn("Egy lépés ▶", () => { if (k < KMAX) { k++; H.push(stepOnce(H[k - 1])); upd(); } }, "btn primary");
    const bBack = btn("◀ Vissza", () => { if (k > 0) { k--; H.pop(); upd(); } });
    const bReset = btn("Alaphelyzet", () => { k = 0; recompute(); upd(); });
    const kV = h("b", { style: "font-family:var(--mono);font-size:1.05rem" });
    root.append(h("div", { class: "controls" }, small("minta:"), gP.bs));
    root.append(h("div", { class: "controls" }, small("aggregálás N(v) fölött:"), gA.bs,
      h("label", null, cbSelf, "önhurok (a csúcs saját értéke is benne van)")));
    root.append(h("div", { class: "controls" }, small("új érték:"), gM.bs));
    const slRow = h("div", { class: "controls" }, h("label", null, "w₁:", sS, vS), h("label", null, "w₂:", sM, vM), h("label", null, "b:", sB, vB), bDef);
    root.append(slRow);
    root.append(h("div", { class: "controls" }, bStep, bBack, bReset, h("span", null, small("rétegek száma "), kV)));

    const cvWrap = h("div", { style: "margin-top:.3rem" });
    root.append(cvWrap);
    const cv = w1Canvas(cvWrap, w => (pre === "chain" ? Math.max(118, w * 0.2) : pre === "karate" ? Math.min(560, w * (w < 520 ? 0.95 : 0.72)) : (w < 520 ? w * 0.72 : w * 0.44)));
    const legend = h("div", { class: "muted", style: "font-size:.84rem;margin-top:.25rem;line-height:1.6" });
    root.append(legend);
    const stats = h("div", { class: "stat-row" });
    root.append(stats);
    const out = h("div", { class: "readout", style: "font-family:var(--font);line-height:1.6" });
    root.append(out);
    const tbl = h("div", { class: "tw", style: "overflow-x:auto;margin-top:.5rem" });
    root.append(tbl);

    /* geometria */
    const small10 = () => G.n > 10;
    const rad = () => {
      if (pre === "karate") return cv.w < 520 ? 8 : 10;
      if (pre === "chain") return Math.min(17, (cv.w - 40) / 7 * 0.34);
      return cv.w < 520 ? 16 : 19;
    };
    const pads = () => { const r = rad(); return small10() ? { l: r + 6, r: r + 6, t: r + 6, b: r + 6 } : { l: r + 12, r: r + 12, t: r + 14, b: r + 33 }; };
    const P = v => { const p = pads(), [x, y] = G.xy[v]; return [p.l + x * (cv.w - p.l - p.r), p.t + y * (cv.h - p.t - p.b)]; };
    const range = () => {
      const all = H.flat();
      return { lo: Math.min(0, ...all), hi: Math.max(...all) };
    };
    const RING = [["--text", 3, []], ["--setB", 2.6, []], ["--setC", 2.6, [5, 3]], ["--muted", 2, [2, 3]]];

    cv.draw = () => {
      cv.resize();
      const { ctx, w, h: hh } = cv;
      ctx.clearRect(0, 0, w, hh); ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
      const r = rad(), tx = css("--text"), mu = css("--muted"), cB = css("--setB"), acc = css("--accent");
      const cur = H[k], { lo, hi } = range(), tOf = v => (hi > lo ? (v - lo) / (hi - lo) : 0);
      const pos = G.xy.map((_, v) => P(v)), dist = sel != null ? bfs(sel) : null;
      const inF = v => !dist || (dist[v] >= 0 && dist[v] <= k);
      /* élek */
      G.edges.forEach(([a, b]) => {
        ctx.save(); ctx.strokeStyle = mu; ctx.globalAlpha = dist && !(inF(a) && inF(b)) ? 0.22 : 0.75;
        ctx.lineWidth = small10() ? 1.2 : 2;
        ctx.beginPath(); ctx.moveTo(...pos[a]); ctx.lineTo(...pos[b]); ctx.stroke(); ctx.restore();
      });
      /* önhurok */
      if (self && !small10()) G.xy.forEach((_, v) => { const [x, y] = pos[v]; ctx.save(); ctx.globalAlpha = inF(v) ? 0.8 : 0.25; ring(ctx, x - r * 0.75, y - r * 0.75, r * 0.5, mu, 1.6); ctx.restore(); });
      /* a kijelölt csúcs bejövő üzenetei */
      if (sel != null) {
        const [x1, y1] = pos[sel];
        G.nb[sel].forEach(u => {
          const [x0, y0] = pos[u], L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L, g = r + 7;
          if (L > 2 * g + 4) arrow(ctx, x0 + ux * g, y0 + uy * g, x1 - ux * g, y1 - uy * g, cB, small10() ? 1.6 : 2.4);
        });
      }
      /* csúcsok */
      for (let v = 0; v < G.n; v++) {
        const [x, y] = pos[v], t = tOf(cur[v]);
        ctx.save(); ctx.globalAlpha = inF(v) ? 1 : 0.32;
        dot(ctx, x, y, r, mix("--accent", t));
        ring(ctx, x, y, r, acc, small10() ? 1 : 1.6);
        label(ctx, G.names[v], x, y + 1, ink(t), "center", w1Font(small10() ? (r < 9 ? 8.5 : 10) : 15, 700), "middle");
        if (!small10()) label(ctx, fmt(cur[v], 3), x, y + r + 25, tx, "center", "600 12.5px " + (css("--mono") || "monospace"));
        ctx.restore();
      }
      /* látómező: gyűrűk ugrástávolság szerint */
      if (dist) for (let v = 0; v < G.n; v++) {
        const d = dist[v];
        if (d < 0 || d > k) continue;
        const [c, lw, dash] = RING[Math.min(3, d)], [x, y] = pos[v];
        ring(ctx, x, y, r + (small10() ? 3.5 : 5), css(c), small10() ? lw * 0.8 : lw, dash);
      }
    };
    cv.c.addEventListener("pointerdown", e => {
      const [px, py] = evXY(cv, e), r = rad();
      let best = null, bd = 1e9;
      for (let v = 0; v < G.n; v++) { const [x, y] = P(v), d = Math.hypot(x - px, y - py); if (d < r + 7 && d < bd) { bd = d; best = v; } }
      sel = best === sel ? null : best;
      upd();
    });
    cv.c.addEventListener("pointermove", e => {
      const [px, py] = evXY(cv, e), r = rad();
      let hit = false;
      for (let v = 0; v < G.n && !hit; v++) { const [x, y] = P(v); hit = Math.hypot(x - px, y - py) < r + 7; }
      cv.c.style.cursor = hit ? "pointer" : "default";
    });

    const hS = (nm, sup) => `h<sub>${nm}</sub>${sup || ""}`;
    const AGN = { sum: "összeg", mean: "átlag", max: "max" };
    function upd() {
      gP.paint(); gA.paint(); gM.paint();
      vS.textContent = fmt(wS, 2); vM.textContent = fmt(wM, 2); vB.textContent = fmt(bb, 2);
      [sS, sM, sB, bDef].forEach(e => setDis(e, mode !== "upd"));
      slRow.style.opacity = mode === "upd" ? "" : "0.75";
      setDis(bStep, k >= KMAX); setDis(bBack, k <= 0);
      kV.textContent = `k = ${k}`;
      cv.draw();
      const cur = H[k], { lo, hi } = range();
      const ringSw = (c, dash, txt) => `<span style="white-space:nowrap"><span style="display:inline-block;width:12px;height:12px;border-radius:50%;border:2.5px ${dash ? "dashed" : "solid"} var(${c});vertical-align:-2px"></span> ${txt}</span>`;
      legend.innerHTML = `szín = érték: <span style="white-space:nowrap">${fmt(lo, 3)} <span style="display:inline-block;width:90px;height:11px;border:1px solid var(--border);border-radius:3px;vertical-align:-1px;background:linear-gradient(to right,var(--card),var(--accent))"></span> ${fmt(hi, 3)}</span>` +
        ` <span>(a skála az eddigi összes réteg értékeire illeszkedik)</span>` +
        (sel != null ? ` · látómező: ${ringSw("--text", false, "kijelölt")} ${ringSw("--setB", false, "1 ugrás")} ${ringSw("--setC", true, "2 ugrás")} ${ringSw("--muted", true, "3+ ugrás")} · <span style="color:var(--setB)">→</span> bejövő üzenetek` : "");
      const nz = cur.filter(v => Math.abs(v) > 1e-12).length;
      const stat = (v, l) => h("div", { class: "stat" }, h("div", { class: "v" }, v), h("div", { class: "l" }, l));
      stats.replaceChildren(
        stat(String(k), "réteg (lépés) k"),
        stat(w1Fix(w1Std(cur)), k ? `szórás (előtte ${w1Fix(w1Std(H[k - 1]))})` : "szórás (populációs)"),
        stat(`${nz} / ${G.n}`, "nem nulla értékű csúcs"),
        stat(fmt(Math.max(...cur), 3), "legnagyobb érték"));

      /* kijelölt csúcs: látómező és a következő lépés számolása */
      const L = [];
      if (sel == null) {
        L.push(`Kattints egy csúcsra: megmutatom, kiktől kap üzenetet, mit lát $k$ réteg után, és hogyan számolódik az új értéke.`);
        L.push(`Most (k = ${k}): h = (${cur.map(v => fmt(v, 3)).join("; ")}).`);
      } else {
        const nm = G.names[sel], d = bfs(sel), seen = [];
        for (let q = 0; q <= k; q++) { const at = G.names.filter((_, v) => d[v] === q); if (at.length) seen.push([q, at]); }
        const all = G.names.filter((_, v) => d[v] >= 0 && d[v] <= k);
        L.push(`<b>${w1ArtC(nm)} ${nm} csúcs k = ${k} réteg után ezeket látja:</b> ${all.join(", ")} (${all.length} csúcs${k === 0 ? " – csak önmagát" : ""}). ` +
          `<span class="muted">${seen.map(([q, at]) => `${q} ugrás: ${at.join(", ")}`).join(" · ")}</span>`);
        const S = inSet(sel), vals = S.map(u => cur[u]), m = AGG(vals);
        const mTxt = S.length
          ? `m<sub>${nm}</sub> = ${AGN[agg]}(${S.map(u => hS(G.names[u])).join(", ")}) = ${AGN[agg]}(${vals.map(v => fmt(v, 3)).join("; ")}) = <b>${fmt(m, 3)}</b>`
          : `m<sub>${nm}</sub> = 0 (nincs szomszéd)`;
        let line = `<b>Következő lépés (k = ${k} → ${k + 1}):</b> ${mTxt}`;
        if (mode === "upd") {
          const z = wS * cur[sel] + wM * m + bb;
          line += `<br>h′<sub>${nm}</sub> = ReLU(${par(wS, 2)} · ${hS(nm)} + ${par(wM, 2)} · m<sub>${nm}</sub> + ${par(bb, 2)}) = ReLU(${par(wS, 2)} · ${par(cur[sel], 3)} + ${par(wM, 2)} · ${par(m, 3)} + ${par(bb, 2)}) = ReLU(${fmt(z, 3)}) = <b>${fmt(Math.max(0, z), 3)}</b>`;
        } else line += ` → h′<sub>${nm}</sub> = m<sub>${nm}</sub>`;
        if (self) line += ` <span class="muted">(önhurok: ${hS(nm)} is a halmazban van)</span>`;
        L.push(line);
      }
      out.innerHTML = L.join("<br>");
      math(out);

      /* értéktáblázat: előző és mostani réteg */
      const row = (lab, vals, hiRow) => `<tr><th style="${w1Th}">${lab}</th>` + vals.map((v, i) => {
        const t = hi > lo ? (v - lo) / (hi - lo) : 0;
        return `<td style="${w1Cell}${w1Tint("--accent", t)}color:${t > 0.55 ? "var(--card)" : "var(--text)"};${hiRow ? "font-weight:700;" : ""}${i === sel ? "outline:2px solid var(--setB);outline-offset:-2px;" : ""}">${fmt(v, 3)}</td>`;
      }).join("") + "</tr>";
      let s = `<table style="width:auto;margin:0;border-collapse:collapse"><tr><th style="${w1Th}">csúcs</th>${G.names.map((nm, i) => `<th style="${w1Th}${i === sel ? "color:var(--setB);" : ""}">${nm}</th>`).join("")}</tr>`;
      if (k > 0) s += row(`h<sup>(${k - 1})</sup>`, H[k - 1], false);
      s += row(`h<sup>(${k})</sup>`, cur, true) + "</table>";
      tbl.innerHTML = s;
    }
    load("ex");
    upd();
  };
