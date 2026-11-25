  /* ==================================================================
     w1: 12.2, 12.3, 12.7 widgetjei (relation-message, hetero-graph-explorer, metapath-vote)
     A saját segédfüggvények blokkban, hogy ne ütközzenek a w2 neveivel.
     ================================================================== */
  {
    const sv = c => (String(c).startsWith("--") ? `var(${c})` : c);
    const lineSw = (c, kind = "solid", wd = 3) => `<span style="display:inline-block;width:1.7em;height:0;border-top:${wd}px ${kind} ${sv(c)};vertical-align:.25em;margin-right:.25em"></span>`;
    const sq = c => `<span style="display:inline-block;width:.85em;height:.85em;border-radius:2px;background:${sv(c)};vertical-align:-.08em;margin-right:.25em"></span>`;
    const fmM = (x, d = 3) => fmt(x, d).replace(",", "{,}");                    // KaTeX-be
    const fmP = (x, d = 3) => (x < 0 ? `(${fmM(x, d)})` : fmM(x, d));          // negatív szorzó zárójelben
    const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
    const IDS = D.actors.map(a => a.id);
    const muted = (t, st = "") => h("p", { class: "muted", style: "font-size:.88rem;margin:.5rem 0 0;" + st, html: t });
    /* csúszka felirattal és értékkel; tex: a felirat (KaTeX), aria: sima szöveg */
    function slider(parent, tex, aria, min, max, step, val, on, d = 2) {
      const out = h("b", { style: "font-family:var(--mono);min-width:2.8em;display:inline-block;text-align:right" }, fmt(val, d));
      const inp = h("input", { type: "range", min, max, step, value: val, "aria-label": aria, style: "width:7rem;max-width:30vw" });
      inp.addEventListener("input", () => { out.textContent = fmt(+inp.value, d); on(+inp.value); });
      const lab = h("label", null, h("span", { html: tex }), inp, out);
      parent.append(lab); math(lab);
      return { lab, inp, set(v) { inp.value = v; out.textContent = fmt(v, d); } };
    }
    const onTheme = f => new MutationObserver(f).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const tblH = (head, rows, st = "") => `<table style="width:auto;margin:.3rem 0;font-size:.86rem;white-space:nowrap;${st}"><thead><tr>${head.map(x => `<th style="padding:.2em .45em">${x}</th>`).join("")}</tr></thead><tbody>${rows.join("")}</tbody></table>`;
    const td = (x, st = "") => `<td style="padding:.2em .45em;text-align:center;${st}">${x}</td>`;

    /* ---------- az Árvízhét heterogén gráfja ---------- */
    const FR_IDS = ["vedekezes", "hiany", "veszteseg"];
    const FR_SHORT = { vedekezes: "véd.", hiany: "hiány", veszteseg: "veszt." };
    const FR_COL = { vedekezes: "--setA", hiany: "--setB", veszteseg: "--setC" };
    const PAP = D.papers.map(p => p.id), EVS = D.events.map(e => e.id);
    const ART = D.articles;                                                      // 1 … 12 (index = id − 1)
    const evOf = a => D.events.findIndex(e => e.articles.includes(a.id));
    /* típusok: L lap, C cikk, S szereplő, K keret, E esemény */
    const HT = {
      L: { name: "lap", plural: "lapok", n: 4, lab: i => PAP[i], tex: "L" },
      C: { name: "cikk", plural: "cikkek", n: 12, lab: i => "C" + (i + 1), tex: "C" },
      S: { name: "szereplő", plural: "szereplők", n: 7, lab: i => IDS[i], tex: "Sz" },
      K: { name: "keret", plural: "keretek", n: 3, lab: i => FR_SHORT[FR_IDS[i]], tex: "K" },
      E: { name: "esemény", plural: "események", n: 6, lab: i => EVS[i], tex: "E" }
    };
    const TSHORT = { L: "L", C: "C", S: "Sz", K: "K", E: "E" };
    /* cikk × másik típus incidencia (12 × n) */
    const INC = {
      L: ART.map(a => PAP.map(p => (a.paper === p ? 1 : 0))),
      S: ART.map(a => IDS.map(s => (a.mentions.includes(s) ? 1 : 0))),
      K: ART.map(a => FR_IDS.map(f => (a.frame === f ? 1 : 0))),
      E: ART.map(a => EVS.map((_, k) => (evOf(a) === k ? 1 : 0)))
    };
    const ETYPE = { L: "közli", S: "említi", K: "keretezi", E: "része" };      // a C–X él neve
    const T = M => M[0].map((_, j) => M.map(r => r[j]));
    const mul = (A, B) => A.map(r => B[0].map((_, j) => r.reduce((s, x, k) => s + x * B[k][j], 0)));
    /* két típus közti szomszédsági mátrix (az egyik mindig C) */
    const adjT = (X, Y) => (X === "C" ? INC[Y] : T(INC[X]));
    const mpMatrix = seq => { let M = adjT(seq[0], seq[1]); for (let i = 1; i < seq.length - 1; i++) M = mul(M, adjT(seq[i], seq[i + 1])); return M; };
    /* az összes út a metaútvonal mentén a → b (csúcsindexek típusonként) */
    function mpPaths(seq, a, b) {
      const out = [];
      const go = (k, path) => {
        if (k === seq.length - 1) { if (path[k] === b) out.push(path.slice()); return; }
        const A = adjT(seq[k], seq[k + 1]);
        A[path[k]].forEach((v, j) => { if (v) { path.push(j); go(k + 1, path); path.pop(); } });
      };
      go(0, [a]);
      return out;
    }
    const MATNAME = { LC: "A_{LC}", CL: "A_{CL}", CS: "A_{CS}", SC: "A_{CS}^{\\top}", CK: "A_{CK}", KC: "A_{CK}^{\\top}", CE: "A_{CE}", EC: "A_{CE}^{\\top}" };
    const mpTex = seq => seq.slice(0, -1).map((x, i) => MATNAME[x + seq[i + 1]]).join("");
    const mpName = seq => seq.map(x => TSHORT[x]).join("–");

    /* ------------------------------------------------------------------
       12.2  relation-message – R-GCN: éltípusonként külön súly
       ------------------------------------------------------------------ */
    W["relation-message"] = root => {
      header(root, "Relációs üzenetküldés: számít, milyen az él",
        "Szereplők az Árvízhétből, két éltípussal: <b>+ támogat</b> és <b>− bírál</b>. Minden csúcsnak egyetlen jellemzője van, $x_v$ – alapból csak a kormányé 1 („a kormány oldala”). " +
        "Egy réteg: $h_v' = w_0 x_v + \\sum_r w_r \\cdot \\text{átlag}_{u \\in N_r(v)}\\, x_u$. <b>Kattints egy csúcsra</b>: látod a beérkező üzeneteit. Az $x$ értékét a táblázat gombjával váltod.");
      math(root.querySelector(".w-sub"));
      const narrow = root.clientWidth < 560;
      let all7 = false, mode = "rgcn", relu = false, sel = "Sz";
      const x = Object.fromEntries(IDS.map(id => [id, id === "Ko" ? 1 : 0]));
      const w = { w0: 1, wp: 1, wm: -1, wi: 0 };

      const c1 = h("div", { class: "controls" });
      const paintM = toggleGroup(c1, [["hom", "homogén (egy súly: $w_+$ minden élre)"], ["rgcn", "R-GCN (típusonként)"], ["dir", "R-GCN, irányított"]], mode, v => { mode = v; update(); });
      math(c1);
      const c2 = h("div", { class: "controls" });
      const S0 = slider(c2, "$w_0$", "w0 (saját)", -2, 2, 0.5, w.w0, v => { w.w0 = v; update(); }, 1);
      const Sp = slider(c2, "$w_+$", "w+ (támogat)", -2, 2, 0.5, w.wp, v => { w.wp = v; update(); }, 1);
      const Sm = slider(c2, "$w_-$", "w− (bírál)", -2, 2, 0.5, w.wm, v => { w.wm = v; update(); }, 1);
      const Si = slider(c2, "$w_{-^{-1}}$", "w− inverz (bírálták)", -2, 2, 0.5, w.wi, v => { w.wi = v; update(); }, 1);
      const c3 = h("div", { class: "controls" });
      const cbR = h("input", { type: "checkbox", onchange: () => { relu = cbR.checked; update(); } });
      c3.append(h("label", null, cbR, "ReLU a végén"));
      const b7 = btn("mind a 7 szereplő", () => { all7 = !all7; b7.textContent = all7 ? "csak 4 szereplő" : "mind a 7 szereplő"; update(); });
      c3.append(b7, btn("alapállapot", () => {
        Object.assign(w, { w0: 1, wp: 1, wm: -1, wi: 0 }); [S0, Sp, Sm, Si].forEach((s, i) => s.set([1, 1, -1, 0][i]));
        IDS.forEach(id => { x[id] = id === "Ko" ? 1 : 0; }); relu = false; cbR.checked = false; sel = "Sz"; all7 = false; b7.textContent = "mind a 7 szereplő"; mode = "rgcn"; paintM(mode); update();
      }));
      root.append(c1, c2, c3);

      const two = h("div", { class: "two-col", style: "align-items:start" }), left = h("div"), right = h("div");
      two.append(left, right); root.append(two);
      const asp = narrow ? 0.62 : 0.6;
      const view = new GK.View(left, { aspect: asp, radius: narrow ? 15 : 17, draggable: false, maxW: 460, showWeights: true,
        onNodeClick: i => { sel = cur[i]; update(); } });
      const legend = h("p", { class: "muted", style: "font-size:.84rem;margin:.3rem 0 0" });
      left.append(legend);
      const ro = h("div", { class: "readout", style: "margin-top:0" });
      right.append(ro);
      const tw = h("div", { class: "tw", style: "overflow-x:auto" });
      const par = h("div", { class: "readout" });
      root.append(tw, par);
      root.append(muted("<b>Tanulság:</b> Homogén üzenetküldéssel a bíráló szakértő ugyanúgy »a kormány oldalán« áll, mint a támogató polgármester – az éltípus nélkül a modell nem tudja, mit jelent a kapcsolat."));

      let cur = [];
      /* N_r(v) típusonként, a módtól függően; eredmény: { v: [{ r, w, N }] } */
      function nbhd(ids, md) {
        const rel = D.relations.filter(r => ids.includes(r.a) && ids.includes(r.b));
        const out = Object.fromEntries(ids.map(v => [v, []]));
        const types = md === "hom" ? [["all", w.wp]] : md === "rgcn" ? [["+", w.wp], ["-", w.wm]] : [["+", w.wp], ["-", w.wm], ["-inv", w.wi]];
        ids.forEach(v => types.forEach(([r, wr]) => {
          let N;
          if (r === "all") N = rel.filter(e => e.a === v || e.b === v).map(e => (e.a === v ? e.b : e.a));
          else if (r === "+" || (r === "-" && md === "rgcn")) { const sg = r === "+" ? 1 : -1; N = rel.filter(e => e.sign === sg && (e.a === v || e.b === v)).map(e => (e.a === v ? e.b : e.a)); }
          else if (r === "-") N = rel.filter(e => e.sign < 0 && e.b === v).map(e => e.a);          // aki őt bírálja (Sz → Ko: Ko kapja)
          else N = rel.filter(e => e.sign < 0 && e.a === v).map(e => e.b);                         // akit ő bírál (inverz: Sz kapja)
          out[v].push({ r, w: wr, N });
        }));
        return out;
      }
      const avg = N => (N.length ? N.reduce((s, u) => s + x[u], 0) / N.length : 0);
      function layer(ids, md) {
        const NB = nbhd(ids, md), H = {};
        ids.forEach(v => { const z = w.w0 * x[v] + NB[v].reduce((s, p) => s + p.w * avg(p.N), 0); H[v] = relu ? Math.max(0, z) : z; });
        return { H, NB };
      }
      const RT = { all: "", "+": "+", "-": "-", "-inv": "-^{-1}" };
      const RNAME = { all: "minden szomszéd", "+": "támogat", "-": "bírál – a bírált kapja", "-inv": "bírálták – a bíráló kapja" };
      const setT = N => (N.length ? `\\{${N.map(texLab).join(", ")}\\}` : "\\emptyset");
      const wT = r => (r === "all" ? "w_+" : `w_{${RT[r]}}`);

      function update() {
        const ids = all7 ? IDS.slice() : ["Ko", "Vi", "Po", "Sz"];
        if (!ids.includes(sel)) sel = "Sz";
        cur = ids;
        Si.lab.style.opacity = mode === "dir" ? 1 : 0.45; Si.inp.disabled = mode !== "dir";
        Sm.lab.style.opacity = mode === "hom" ? 0.45 : 1; Sm.inp.disabled = mode === "hom";
        const L = { hom: layer(ids, "hom"), rgcn: layer(ids, "rgcn"), dir: layer(ids, "dir") }, Hc = L[mode].H;
        // gráf
        const P = GK.normalize(ids.map(i => ACTOR_POS[i]), asp);
        const mx = Math.max(1, ...ids.map(v => Math.abs(Hc[v])));
        const nodes = ids.map((id, k) => ({ label: id, x: P[k][0], y: P[k][1], color: divColor(Hc[id], mx), ink: "--text",
          sub: narrow ? `h′=${fmt(Hc[id], 2)}` : `x=${x[id]} → h′=${fmt(Hc[id], 2)}` }));
        const rel = D.relations.filter(r => ids.includes(r.a) && ids.includes(r.b));
        const edges = rel.map(r => (mode === "hom"
          ? { a: ids.indexOf(r.a), b: ids.indexOf(r.b), w: 1, color: "--muted", width: 2.5, label: "" }
          : { a: ids.indexOf(r.a), b: ids.indexOf(r.b), w: 1, color: r.sign > 0 ? "--setC" : "#ef4444", width: 2.5, dash: r.sign < 0 ? [7, 5] : null,
              label: r.sign > 0 ? "+" : "−", dir: mode === "dir" && r.sign < 0 }));
        view.setGraph(nodes, edges);
        view.hl = new Set([ids.indexOf(sel)]);
        view.hlE = new Set(rel.filter(r => r.a === sel || r.b === sel).map(r => GK.edgeKey(ids.indexOf(r.a), ids.indexOf(r.b))));
        view.dim = false; view.draw();
        legend.innerHTML = (mode === "hom"
          ? `${lineSw("--muted")}él (a homogén modell nem látja a típusát)`
          : `${lineSw("--setC")}+ támogat · ${lineSw("#ef4444", "dashed")}− bírál${mode === "dir" ? " (nyíl: ki kit bírál)" : ""}`) +
          ` · a csúcs színe: $h'$ előjele és nagysága (${sq(divColor(-mx, mx))}negatív, ${sq(divColor(mx, mx))}pozitív)`;
        math(legend);
        // kiírás a kijelölt csúcsra
        const NB = L[mode].NB[sel], tv = texLab(sel);
        let s = `<b>${actorName(sel)}</b> (${sel}) beérkező üzenetei – ${mode === "hom" ? "homogén" : mode === "rgcn" ? "R-GCN" : "R-GCN, irányított"}<br>`;
        NB.forEach(p => { s += `$N_{${RT[p.r] || "\\,"}}(${tv}) = ${setT(p.N)}$ <span class="muted">(${RNAME[p.r]})</span><br>`; });
        const sym = `w_0 x_{${tv}}` + NB.map(p => ` + ${wT(p.r)} \\cdot \\text{átlag}_{N_{${RT[p.r] || "\\,"}}}`).join("");
        const num = `${fmP(w.w0, 1)} \\cdot ${x[sel]}` + NB.map(p => ` + ${fmP(p.w, 1)} \\cdot \\text{átlag}(${p.N.length ? p.N.map(u => x[u]).join(", ") : "\\emptyset"})`).join("");
        const z = w.w0 * x[sel] + NB.reduce((t, p) => t + p.w * avg(p.N), 0);
        const eq = Math.abs(z - +z.toFixed(3)) < 1e-12 ? "=" : "\\approx";
        s += `$h'_{${tv}} = ${relu ? "\\mathrm{ReLU}\\big(" : ""}${sym}${relu ? "\\big)" : ""}$<br>`;
        s += `$\\phantom{h'_{${tv}}} = ${relu ? "\\mathrm{ReLU}\\big(" : ""}${num}${relu ? "\\big)" : ""} ${relu ? "= \\mathrm{ReLU}(" + fmM(z) + ")" : ""} ${eq} ${fmM(relu ? Math.max(0, z) : z)}$`;
        if (NB.some(p => !p.N.length)) s += `<br><span class="muted">Üres szomszédság: az átlag 0.</span>`;
        ro.innerHTML = s;
        math(ro);
        // táblázat
        const colSt = m => (m === mode ? "font-weight:700;color:var(--accent)" : "color:var(--muted)");
        const head = ["csúcs", "$x$", `<span style="${colSt("hom")}">$h'$ homogén</span>`, `<span style="${colSt("rgcn")}">$h'$ R-GCN</span>`, `<span style="${colSt("dir")}">$h'$ irányított</span>`];
        const rows = ids.map(v => `<tr data-v="${v}" style="cursor:pointer;${v === sel ? "background:var(--accent-soft)" : ""}">` +
          td(`<b>${v}</b> <span class="muted">${actorName(v)}</span>`, "text-align:left") +
          td(`<button class="btn" type="button" data-x="${v}" style="padding:.1em .6em;min-width:2.4em" aria-label="${v}: x váltása">${x[v]}</button>`) +
          ["hom", "rgcn", "dir"].map(m => td(fmt(L[m].H[v], 3), colSt(m))).join("") + "</tr>");
        tw.innerHTML = tblH(head, rows);
        math(tw);
        const R = mode === "hom" ? 1 : mode === "rgcn" ? 2 : 3;
        const ws = mode === "hom" ? "w_0, w_+" : mode === "rgcn" ? "w_0, w_+, w_-" : "w_0, w_+, w_-, w_{-^{-1}}";
        par.innerHTML = `ennek a rétegnek $R + 1 = ${R + 1}$ súlya van ($${ws}$)` +
          (mode === "hom" ? " – egyetlen éltípus ($R = 1$)" : mode === "rgcn" ? " – két éltípus ($R = 2$)" : " – a bírál irányított: a fordítottja külön típus ($R = 3$)") +
          `<br><span class="muted">Valódi R-GCN-ben minden $w$ egy $d \\times d$ mátrix ($W_0, W_r$) – a paraméterszám $(R + 1)\\,d^2$.</span>`;
        math(par);
        const pick = m => Object.fromEntries(ids.map(v => [v, +L[m].H[v].toFixed(4)]));
        root.dataset.rm = JSON.stringify({ mode, ids, sel, relu, w, x: Object.fromEntries(ids.map(v => [v, x[v]])), hom: pick("hom"), rgcn: pick("rgcn"), dir: pick("dir"), params: R + 1 });
      }
      tw.addEventListener("click", ev => {
        const b = ev.target.closest("button[data-x]");
        if (b) { const v = b.dataset.x; x[v] = 1 - x[v]; sel = v; update(); return; }
        const tr = ev.target.closest("tr[data-v]"); if (tr) { sel = tr.dataset.v; update(); }
      });
      onTheme(() => update());
      update();
    };

    /* ------------------------------------------------------------------
       12.3  hetero-graph-explorer – heterogén gráf, séma, metaútvonalak
       ------------------------------------------------------------------ */
    const HSTYLE = {
      L: { shape: "pill", fill: "--setA" }, C: { shape: "circle", fill: "--card" }, S: { shape: "circle", fill: "--setB" },
      K: { shape: "diamond", fill: "--setC" }, E: { shape: "hex", fill: "#a855f7" }
    };
    /* SVG-alakzat egy csúcshoz (x, y középpont, r méret) */
    function shapeSVG(shape, x, y, r, st) {
      if (shape === "circle") return `<circle cx="${x}" cy="${y}" r="${r}" style="${st}"/>`;
      if (shape === "pill") return `<rect x="${x - r * 1.45}" y="${y - r * 0.85}" width="${r * 2.9}" height="${r * 1.7}" rx="${r * 0.5}" style="${st}"/>`;
      if (shape === "diamond") return `<polygon points="${x},${y - r * 1.15} ${x + r * 1.15},${y} ${x},${y + r * 1.15} ${x - r * 1.15},${y}" style="${st}"/>`;
      const p = [...Array(6).keys()].map(k => { const t = Math.PI / 6 + k * Math.PI / 3; return `${(x + r * 1.08 * Math.cos(t)).toFixed(1)},${(y + r * 1.08 * Math.sin(t)).toFixed(1)}`; });
      return `<polygon points="${p.join(" ")}" style="${st}"/>`;
    }
    const inkOf = t => (t === "C" ? "var(--text)" : "#fff");
    const legendShape = t => `<svg width="22" height="16" viewBox="0 0 22 16" style="vertical-align:-.25em;margin-right:.2em">${shapeSVG(HSTYLE[t].shape, 11, 8, t === "L" ? 5.2 : 6.2, `fill:${sv(HSTYLE[t].fill)};stroke:var(--text);stroke-width:1`)}</svg>`;

    W["hetero-graph-explorer"] = root => {
      header(root, "Az Árvízhét heterogén gráfja és a metaútvonalak",
        "Öt csúcstípus (lap, cikk, szereplő, keret, esemény) és négy éltípus. Egy <b>metaútvonal</b> típusok sorozata – pl. lap–cikk–szereplő–cikk–lap –, " +
        "és belőle <b>homogén gráf</b> lesz: két lap szomszédos, ha van köztük ilyen út; az élsúly az utak száma. Válassz metaútvonalat, és kattints a mátrix egy cellájára vagy a homogén gráf egy élére: kiemelődnek az utak.");
      const narrow = root.clientWidth < 560;
      const vis = { L: true, C: true, S: true, K: true, E: true };
      const MPS = [
        { k: "LSL", seq: ["L", "C", "S", "C", "L"], txt: "lapok közös szereplőn át", def: [0, 3], ex: [0, 1, 2, 10, 3] },
        { k: "LEL", seq: ["L", "C", "E", "C", "L"], txt: "lapok közös eseményen át", def: [0, 3], ex: [0, 1, 2, 10, 3] },
        { k: "LKL", seq: ["L", "C", "K", "C", "L"], txt: "lapok közös kereten át", def: [0, 3], ex: [0, 0, 0, 9, 3] },
        { k: "SCS", seq: ["S", "C", "S"], txt: "szereplők együttemlítése – az 1. fejezet szereplőgráfja", def: [0, 5], ex: [0, 4, 5] },
        { k: "CSC", seq: ["C", "S", "C"], txt: "cikkek közös szereplőn át", def: [1, 10], ex: [1, 2, 10] },
        { k: "CLC", seq: ["C", "L", "C"], txt: "ugyanaz a lap", def: [0, 1], ex: [0, 0, 1] },
        { k: "CEC", seq: ["C", "E", "C"], txt: "ugyanaz az esemény", def: [1, 10], ex: [1, 2, 10] }
      ];
      let mp = MPS[0], pair = mp.def.slice(), exIdx = 0;

      const c1 = h("div", { class: "controls" });
      c1.append(h("span", { class: "muted", style: "font-size:.92rem" }, "típusok:"));
      Object.keys(HT).forEach(t => {
        const cb = h("input", { type: "checkbox", "data-t": t, onchange: () => { vis[t] = cb.checked; draw(); } });
        cb.checked = true;
        c1.append(h("label", null, cb, h("span", { html: legendShape(t) }), HT[t].name));
      });
      const c2 = h("div", { class: "controls" });
      c2.append(h("span", { class: "muted", style: "font-size:.92rem" }, "metaútvonal:"));
      toggleGroup(c2, MPS.map(m => [m.k, mpName(m.seq)]), mp.k, v => { mp = MPS.find(m => m.k === v); pair = mp.def.slice(); exIdx = -1; draw(); });
      root.append(c1, c2);

      const hetBox = h("div", { style: "margin:.3rem 0" });
      const cnt = h("div", { class: "readout" });
      root.append(hetBox, cnt);
      const two = h("div", { class: "two-col", style: "align-items:start;margin-top:.6rem" }), left = h("div"), right = h("div");
      two.append(left, right); root.append(two);
      const schemaBox = h("div"), homBox = h("div"), homLeg = h("p", { class: "muted", style: "font-size:.84rem;margin:.2rem 0 0" });
      left.append(schemaBox, homBox, homLeg);
      const ro = h("div", { class: "readout", style: "margin-top:0" }), tw = h("div", { class: "tw", style: "overflow-x:auto;margin-top:.5rem" });
      right.append(ro, tw);
      root.append(muted("<b>Egy metaútvonal = egy jelentés.</b> Ugyanaz a heterogén gráf hétféle homogén gráfot ad – a modellnek (vagy neked) kell eldöntenie, melyik számít."));

      /* elrendezés: oszlopok – lapok | cikkek | szereplők | keretek + események */
      const Wd = narrow ? 360 : 760, Ht = narrow ? 470 : 410, top = narrow ? 22 : 22, bot = Ht - 22;
      const colX = narrow ? { L: 28, C: 118, S: 218, KE: 300 } : { L: 70, C: 270, S: 480, KE: 670 };
      const R0 = narrow ? 10.5 : 12;
      const yAt = (k, n) => top + (n === 1 ? 0.5 : k / (n - 1)) * (bot - top);
      const SORD = ["Ko", "Vi", "Sz", "Kl", "Po", "La", "Ön"];
      const POS = {
        C: ART.map((_, i) => [colX.C, yAt(i, 12)]),
        L: PAP.map((_, i) => [colX.L, yAt(3 * i + 1, 12)]),
        S: IDS.map(id => [colX.S, top + (SORD.indexOf(id) + 0.5) / 7 * (bot - top)]),
        K: FR_IDS.map((_, i) => [colX.KE, top + (i + 0.5) / 9.6 * (bot - top)]),
        E: EVS.map((_, i) => [colX.KE, top + (i + 3.6 + 0.5) / 9.6 * (bot - top)])
      };
      const ALLE = [];                                       // { t: "L"|"S"|"K"|"E", c: cikk, j: másik index }
      ["L", "S", "K", "E"].forEach(t => INC[t].forEach((row, c) => row.forEach((v, j) => { if (v) ALLE.push({ t, c, j }); })));

      const pathNodes = (seq, path) => path.map((v, k) => seq[k] + v);
      function hetSVG(paths, ex) {
        const hlN = new Set(), hlE = new Set(), exN = new Set(), exE = new Set();
        const eKey = (t, c, j) => t + ":" + c + ":" + j;
        const addP = (p, NS, ES) => {
          pathNodes(mp.seq, p).forEach(x => NS.add(x));
          for (let k = 0; k < mp.seq.length - 1; k++) {
            const [X, Y] = [mp.seq[k], mp.seq[k + 1]];
            ES.add(X === "C" ? eKey(Y, p[k], p[k + 1]) : eKey(X, p[k + 1], p[k]));
          }
        };
        paths.forEach(p => addP(p, hlN, hlE));
        if (ex) addP(ex, exN, exE);
        const any = hlN.size > 0;
        let s = "";
        ALLE.forEach(e => {
          if (!vis.C || !vis[e.t]) return;
          const [x1, y1] = POS.C[e.c], [x2, y2] = POS[e.t][e.j], k = eKey(e.t, e.c, e.j);
          const st = exE.has(k) ? "stroke:var(--accent);stroke-width:3.6" : hlE.has(k) ? "stroke:var(--accent);stroke-width:1.8;stroke-opacity:.75"
            : `stroke:var(--muted);stroke-width:1;stroke-opacity:${any ? 0.18 : 0.45}`;
          s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="${st}"/>`;
        });
        Object.keys(HT).forEach(t => {
          if (!vis[t]) return;
          POS[t].forEach(([x, y], i) => {
            const id = t + i, on = hlN.has(id), exOn = exN.has(id);
            const st = `fill:${sv(HSTYLE[t].fill)};stroke:${exOn || on ? "var(--accent)" : "var(--text)"};stroke-width:${exOn ? 3.2 : on ? 2.4 : 1.2};opacity:${any && !on ? 0.6 : 1}`;
            s += `<g data-n="${id}">` + shapeSVG(HSTYLE[t].shape, x, y, t === "L" ? R0 * 0.95 : R0, st);
            const lab = HT[t].lab(i);
            if (t === "K") s += `<text x="${x + R0 * 1.4}" y="${y + 0.5}" style="fill:var(--text);font-size:${narrow ? 10 : 11}px;font-weight:600;dominant-baseline:middle;opacity:${any && !on ? 0.5 : 1}">${esc(lab)}</text>`;
            else s += `<text x="${x}" y="${y + 0.5}" text-anchor="middle" style="fill:${inkOf(t)};font-size:${lab.length > 2 ? (narrow ? 8.5 : 9.5) : narrow ? 10 : 11}px;font-weight:600;dominant-baseline:middle;opacity:${any && !on ? 0.6 : 1}">${esc(lab)}</text>`;
            s += "</g>";
          });
        });
        // oszlopfejlécek
        const heads = [["L", colX.L], ["C", colX.C], ["S", colX.S]];
        let hd = heads.map(([t, x]) => `<text x="${x}" y="10" text-anchor="middle" style="fill:var(--muted);font-size:10px">${HT[t].plural}</text>`).join("");
        hd += `<text x="${colX.KE}" y="10" text-anchor="middle" style="fill:var(--muted);font-size:10px">${narrow ? "K + E" : "keretek, események"}</text>`;
        return `<svg viewBox="0 0 ${Wd} ${Ht}" style="width:100%;max-width:${Wd}px;display:block;margin:auto" role="img" aria-label="az Árvízhét heterogén gráfja">${hd}${s}</svg>`;
      }
      function schemaSVG() {
        const P = { L: [40, 78], C: [140, 78], S: [250, 26], K: [262, 78], E: [250, 130] };
        const onE = new Set(); for (let k = 0; k < mp.seq.length - 1; k++) onE.add([mp.seq[k], mp.seq[k + 1]].sort().join(""));
        let s = "";
        ["L", "S", "K", "E"].forEach(t => {
          const on = onE.has(["C", t].sort().join("")), [x1, y1] = P.C, [x2, y2] = P[t];
          s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:${on ? "var(--accent)" : "var(--muted)"};stroke-width:${on ? 3.5 : 1.5};${vis[t] && vis.C ? "" : "stroke-dasharray:3 4;"}"/>`;
          const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 + (t === "L" ? -7 : t === "S" ? -6 : t === "E" ? 12 : -6);
          s += `<text x="${mx + (t === "L" ? 0 : t === "K" ? 0 : -4)}" y="${my}" text-anchor="middle" style="fill:${on ? "var(--accent)" : "var(--muted)"};font-size:10.5px;${on ? "font-weight:700" : ""}">${ETYPE[t]}</text>`;
        });
        const inMp = new Set(mp.seq);
        Object.keys(P).forEach(t => {
          const [x, y] = P[t], on = inMp.has(t);
          s += shapeSVG(HSTYLE[t].shape, x, y, t === "L" ? 12 : 14, `fill:${sv(HSTYLE[t].fill)};stroke:${on ? "var(--accent)" : "var(--text)"};stroke-width:${on ? 3 : 1.2};opacity:${vis[t] ? 1 : 0.4}`);
          s += `<text x="${x}" y="${y + 0.5}" text-anchor="middle" style="fill:${inkOf(t)};font-size:11px;font-weight:700;dominant-baseline:middle">${TSHORT[t]}</text>`;
        });
        return `<div class="muted" style="font-size:.84rem">hálózati séma (típusok és éltípusok) – kiemelve a metaútvonal:</div>` +
          `<svg viewBox="0 0 300 150" style="width:100%;max-width:300px;display:block;margin:.1rem auto .4rem" role="img" aria-label="hálózati séma">${s}</svg>`;
      }
      /* a kapott homogén gráf: a kezdőtípus csúcsai, élsúly = utak száma */
      function homSVG(M, t) {
        const n = HT[t].n, Wd2 = 320, Ht2 = t === "C" ? 300 : t === "L" ? 220 : 230;
        let P;
        if (t === "S") P = GK.normalize(IDS.map(i => ACTOR_POS[i]), Ht2 / Wd2).map(p => [p[0] * Wd2, p[1] * Ht2]);
        else if (t === "L") P = [[70, 55], [250, 55], [70, 165], [250, 165]];
        else P = GK.circleLayout(12).map(p => [Wd2 / 2 + (p[0] - 0.5) * Wd2 * 0.95, Ht2 / 2 + (p[1] - 0.5) * Ht2 * 0.95]);
        const mx = Math.max(1, ...M.flatMap((r, i) => r.filter((_, j) => j !== i)));
        let s = "", lb = "";
        for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
          if (!M[i][j]) continue;
          const on = (pair[0] === i && pair[1] === j) || (pair[0] === j && pair[1] === i);
          const [x1, y1] = P[i], [x2, y2] = P[j];
          s += `<line data-i="${i}" data-j="${j}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="cursor:pointer;stroke:${on ? "var(--accent)" : "var(--muted)"};stroke-width:${(on ? 1.5 : 0) + 1.2 + 3 * M[i][j] / mx};stroke-opacity:${on ? 1 : 0.6}"/>`;
          s += `<line data-i="${i}" data-j="${j}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="cursor:pointer;stroke:transparent;stroke-width:14"/>`;
          if (t !== "C" || M[i][j] > 1 || on) {
            const f = t === "C" ? 0.5 : 0.5, mxx = x1 + (x2 - x1) * f, myy = y1 + (y2 - y1) * f;
            lb += `<g data-i="${i}" data-j="${j}" style="cursor:pointer"><circle cx="${mxx}" cy="${myy}" r="8.5" style="fill:var(--card);stroke:${on ? "var(--accent)" : "var(--border)"}"/>` +
              `<text x="${mxx}" y="${myy + 0.5}" text-anchor="middle" style="fill:var(--text);font-size:10.5px;font-weight:600;dominant-baseline:middle">${M[i][j]}</text></g>`;
          }
        }
        let nd = "";
        for (let i = 0; i < n; i++) {
          const [x, y] = P[i], on = pair.includes(i);
          nd += shapeSVG(HSTYLE[t].shape, x, y, t === "L" ? 12 : 13, `fill:${sv(HSTYLE[t].fill)};stroke:${on ? "var(--accent)" : "var(--text)"};stroke-width:${on ? 3 : 1.2}`);
          const lab = HT[t].lab(i);
          nd += `<text x="${x}" y="${y + 0.5}" text-anchor="middle" style="fill:${inkOf(t)};font-size:${lab.length > 2 ? 9.5 : 11}px;font-weight:600;dominant-baseline:middle">${esc(lab)}</text>`;
        }
        return `<div class="muted" style="font-size:.84rem;margin-top:.3rem">a kapott homogén gráf (${HT[t].plural}; az élen: az utak száma):</div>` +
          `<svg class="hom" viewBox="0 0 ${Wd2} ${Ht2}" style="width:100%;max-width:${Wd2}px;display:block;margin:auto;touch-action:manipulation" role="img" aria-label="homogén gráf">${s}${lb}${nd}</svg>`;
      }
      function counts() {
        const nT = Object.fromEntries(Object.keys(HT).map(t => [t, vis[t] ? HT[t].n : 0]));
        const eT = Object.fromEntries(["L", "S", "K", "E"].map(t => [t, vis.C && vis[t] ? ALLE.filter(e => e.t === t).length : 0]));
        return { nT, eT, n: Object.values(nT).reduce((a, b) => a + b, 0), m: Object.values(eT).reduce((a, b) => a + b, 0) };
      }
      function draw() {
        const t0 = mp.seq[0], M = mpMatrix(mp.seq), n = M.length;
        const paths = mpPaths(mp.seq, pair[0], pair[1]);
        if (exIdx < 0) {                                       // alapértelmezett példa-út
          const e = mp.ex; exIdx = Math.max(0, paths.findIndex(p => p.every((v, k) => v === e[k])));
        }
        if (exIdx >= paths.length) exIdx = 0;
        hetBox.innerHTML = hetSVG(paths, paths[exIdx]);
        const C = counts();
        cnt.innerHTML = `csúcsok: ${Object.keys(HT).map(t => `${TSHORT[t]} ${C.nT[t]}`).join(" · ")} = <b>${C.n}</b><br>` +
          `élek: ${["L", "S", "K", "E"].map(t => `C–${TSHORT[t]} <span class="muted">(${ETYPE[t]})</span> ${C.eT[t]}`).join(" · ")} = <b>${C.m}</b>` +
          (mp.seq.some(t => !vis[t]) ? `<br><span class="muted">A metaútvonal egyes típusai most rejtve vannak – a mátrix és a homogén gráf a teljes gráfból számol.</span>` : "");
        schemaBox.innerHTML = schemaSVG();
        homBox.innerHTML = homSVG(M, t0);
        homLeg.innerHTML = `Kattints egy élre (vagy a mátrix egy cellájára): az adott pár útjai kiemelődnek fent.`;
        // mátrix
        const lab = i => HT[t0].lab(i);
        const rows = M.map((r, i) => `<tr><th style="padding:.2em .45em">${esc(lab(i))}</th>` + r.map((v, j) => {
          const on = pair[0] === i && pair[1] === j, dg = i === j;
          return `<td data-i="${i}" data-j="${j}" style="padding:.2em .45em;text-align:center;cursor:pointer;${dg ? "color:var(--muted);opacity:.6;font-style:italic;" : ""}${on ? "background:var(--accent-soft);outline:2px solid var(--accent);font-weight:700;" : ""}${!v && !dg ? "color:var(--muted);" : ""}">${v}</td>`;
        }).join("") + "</tr>");
        tw.innerHTML = `<div style="font-size:.86rem">$${mpTex(mp.seq)}$ <span class="muted">(sorrend: ${[...Array(n).keys()].map(lab).join(", ")})</span></div>` +
          tblH(["", ...[...Array(n).keys()].map(lab)], rows) +
          `<div class="muted" style="font-size:.82rem">A főátló (dőlt, halvány): oda-vissza utak, nem szomszédság.</div>`;
        // kiírás
        let pairs = 0, tot = 0;
        for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (M[i][j]) { pairs++; tot += M[i][j]; }
        const [a, b] = pair, la = lab(a), lb_ = lab(b);
        let s = `<b>${mpName(mp.seq)}</b>: ${mp.txt}<br>` +
          `homogén gráf: ${n} csúcs, <b>${pairs}</b> szomszédos pár (főátlón kívül), összesen ${tot} út<br>`;
        s += `${la} – ${lb_}: <b>${M[a][b]}</b> út${a === b ? " (főátló: oda-vissza)" : ""}`;
        if (paths.length) {
          const show = paths.slice(0, 12).map((p, k) => {
            const txt = p.map((v, q) => HT[mp.seq[q]].lab(v)).join(" – ");
            return `<button type="button" class="btn${k === exIdx ? " on" : ""}" data-p="${k}" style="padding:.05em .45em;margin:.1em .15em;font-size:.82rem">${esc(txt)}</button>`;
          }).join("");
          s += `<br><span class="muted" style="font-size:.85rem">az utak (kattints egyre – ez lesz vastagon kiemelve):</span><br>${show}${paths.length > 12 ? ` <span class="muted">… és még ${paths.length - 12}</span>` : ""}`;
        }
        ro.innerHTML = s;
        math(tw);
        root.dataset.hg = JSON.stringify({ mp: mpName(mp.seq), vis, nodes: C.n, edges: C.m, nT: C.nT, eT: C.eT, M, pairs, tot,
          pair: [la, lb_], nPaths: paths.length, ex: paths[exIdx] ? paths[exIdx].map((v, q) => HT[mp.seq[q]].lab(v)).join("–") : null });
      }
      const pickPair = (i, j) => { pair = [i, j]; exIdx = -1; draw(); };
      tw.addEventListener("click", ev => { const c = ev.target.closest("td[data-i]"); if (c) pickPair(+c.dataset.i, +c.dataset.j); });
      homBox.addEventListener("click", ev => { const c = ev.target.closest("[data-i]"); if (c) pickPair(+c.dataset.i, +c.dataset.j); });
      ro.addEventListener("click", ev => { const b = ev.target.closest("button[data-p]"); if (b) { exIdx = +b.dataset.p; draw(); } });
      exIdx = -1;
      draw();
    };

    /* ------------------------------------------------------------------
       12.7  metapath-vote – keretjóslás metaútvonal-szavazással
       ------------------------------------------------------------------ */
    W["metapath-vote"] = root => {
      header(root, "Keretjóslás metaútvonal-szavazással",
        "Melyik keretben ír egy cikk? Minden cikk a <b>szomszédai</b> kereteire szavaz – háromféle metaútvonal szerint, mindegyik a saját $\\beta$ súlyával: " +
        "$\\text{pont}(c, f) = \\sum_\\Phi \\beta_\\Phi \\sum_{d \\ne c} M^\\Phi_{cd}\\,[y_d = f]$. A cikk <b>önmagára nem szavaz</b> (kihagyásos ellenőrzés). Kattints egy cikkre: látod a szavazatait.");
      math(root.querySelector(".w-sub"));
      const narrow = root.clientWidth < 560;
      const KEYS = ["L", "S", "E"];
      const MPN = { L: "C–L–C", S: "C–Sz–C", E: "C–E–C" }, MPT = { L: "ugyanaz a lap", S: "közös szereplők száma", E: "ugyanaz az esemény" };
      const DASH = { L: null, S: [7, 5], E: [2, 4] }, KIND = { L: "solid", S: "dashed", E: "dotted" };
      const y = ART.map(a => a.frame);
      const Mf = { L: (c, d) => (ART[c].paper === ART[d].paper ? 1 : 0), S: (c, d) => ART[c].mentions.filter(s => ART[d].mentions.includes(s)).length, E: (c, d) => (evOf(ART[c]) === evOf(ART[d]) ? 1 : 0) };
      let beta = { L: 1, S: 1, E: 0 }, mode = "loo", sel = 9;
      const nw = { S: new Set(["Ko", "Kl"]), paper: "" };

      const c0 = h("div", { class: "controls" });
      toggleGroup(c0, [["loo", "a 12 cikk (mindegyik a többiek alapján)"], ["new", "új cikk"]], mode, v => { mode = v; update(); });
      const c1 = h("div", { class: "controls" });
      const SL = {};
      KEYS.forEach(k => { SL[k] = slider(c1, `$\\beta_{\\text{${MPN[k]}}}$`, "béta " + MPN[k], 0, 2, 0.25, beta[k], v => { beta[k] = v; update(); }, 2); });
      const c2 = h("div", { class: "controls" });
      c2.append(h("span", { class: "muted", style: "font-size:.92rem" }, "előbeállítás:"));
      [["csak lap", [1, 0, 0]], ["csak szereplő", [0, 1, 0]], ["csak esemény", [0, 0, 1]], ["lap + szereplő", [1, 1, 0]], ["mind egyformán", [1, 1, 1]]].forEach(([l, v]) =>
        c2.append(btn(l, () => { KEYS.forEach((k, i) => { beta[k] = v[i]; SL[k].set(v[i]); }); update(); })));
      const cN = h("div", { class: "controls" });
      cN.append(h("span", { class: "muted", style: "font-size:.92rem" }, "az új cikk említi:"));
      IDS.forEach(id => {
        const cb = h("input", { type: "checkbox", "data-a": id, onchange: () => { if (cb.checked) nw.S.add(id); else nw.S.delete(id); update(); } });
        cb.checked = nw.S.has(id);
        cN.append(h("label", { title: actorName(id) }, cb, id));
      });
      const selP = h("select", { "aria-label": "melyik lap közli", onchange: () => { nw.paper = selP.value; update(); } });
      selP.append(h("option", { value: "" }, "ismeretlen lap"), ...D.papers.map(p => h("option", { value: p.id }, p.id + " – " + p.name)));
      cN.append(h("label", null, "lap:", selP));
      root.append(c0, c1, c2, cN);

      const two = h("div", { class: "two-col", style: "align-items:start" }), left = h("div"), right = h("div");
      two.append(left, right); root.append(two);
      const asp = narrow ? 0.9 : 0.86;
      const base = GK.normalize(GK.circleLayout(12, -Math.PI / 2 + Math.PI / 12), asp);
      const view = new GK.View(left, { aspect: asp, radius: narrow ? 13 : 14, draggable: false, maxW: 420, showWeights: true,
        onNodeClick: i => { if (i < 12) { sel = sel === i ? -1 : i; update(); } } });
      const legend = h("p", { class: "muted", style: "font-size:.84rem;margin:.3rem 0 0" });
      left.append(legend);
      const ro = h("div", { class: "readout", style: "margin-top:0" });
      right.append(ro);
      const sum = h("div", { class: "readout" }), tw = h("div", { class: "tw", style: "overflow-x:auto" });
      root.append(sum, tw);
      root.append(muted("<b>Tanulság:</b> Az esemény-metaútvonal heterofil: egy eseményről több keretben írnak. Egyforma súllyal rontja a jóslatot – a HAN ezért tanul metaútvonal-súlyt."));

      const near = (a, b) => Math.abs(a - b) < 1e-9;
      /* szavazás: nb[k] = [{ d, m }] (a szomszédok és súlyuk metaútvonalanként) → pontszámok, jóslat */
      function vote(nb, truth) {
        const sc = Object.fromEntries(FR_IDS.map(f => [f, 0]));
        KEYS.forEach(k => nb[k].forEach(({ d, m }) => { sc[y[d]] += beta[k] * m; }));
        const best = Math.max(...FR_IDS.map(f => sc[f]));
        if (best <= 1e-12) return { sc, win: [], pt: 0 };
        const win = FR_IDS.filter(f => near(sc[f], best));
        return { sc, win, pt: truth && win.includes(truth) ? 1 / win.length : 0 };
      }
      const nbOf = c => Object.fromEntries(KEYS.map(k => [k, ART.map((_, d) => ({ d, m: d === c ? 0 : Mf[k](c, d) })).filter(o => o.m > 0)]));
      const nbNew = () => ({
        L: nw.paper ? ART.map((a, d) => ({ d, m: a.paper === nw.paper ? 1 : 0 })).filter(o => o.m) : [],
        S: ART.map((a, d) => ({ d, m: a.mentions.filter(s => nw.S.has(s)).length })).filter(o => o.m),
        E: []
      });
      const predTxt = r => (!r.win.length ? "nincs szomszéd" : r.win.length === 1 ? FR_SHORT[r.win[0]] : `döntetlen (${r.win.map(f => FR_SHORT[f]).join("/")})`);
      const mark = r => (r.pt === 1 ? '<b style="color:var(--ok)">✓</b>' : r.pt > 0 ? `<b style="color:var(--setB)">${r.pt === 0.5 ? "½" : fmt(r.pt, 2)}</b>` : '<b style="color:var(--bad)">✗</b>');
      const markTxt = r => (r.pt === 1 ? "✓" : r.pt > 0 ? (r.pt === 0.5 ? "½" : fmt(r.pt, 2)) : "✗");
      function homophily(k) {
        let p = 0, s = 0;
        for (let c = 0; c < 12; c++) for (let d = c + 1; d < 12; d++) if (Mf[k](c, d)) { p++; if (y[c] === y[d]) s++; }
        return { p, s };
      }
      const HOMO = Object.fromEntries(KEYS.map(k => [k, homophily(k)]));
      function breakdown(nb, r, title) {
        let s = `<b>${title}</b><br>`;
        KEYS.forEach(k => {
          const by = FR_IDS.map(f => nb[k].filter(o => y[o.d] === f));
          const parts = FR_IDS.map((f, i) => `${FR_SHORT[f]} ${by[i].reduce((t, o) => t + o.m, 0)}`).join(" · ");
          const who = nb[k].length ? nb[k].map(o => `C${o.d + 1}${o.m > 1 ? "×" + o.m : ""}`).join(", ") : "–";
          s += `<span style="opacity:${beta[k] ? 1 : 0.5}">${lineSw("--muted", KIND[k], 2)}${MPN[k]} ($\\beta = ${fmM(beta[k], 2)}$): ${parts} <span class="muted">[${who}]</span></span><br>`;
        });
        s += "pontszám: " + FR_IDS.map(f => `${FR_SHORT[f]} <b>${fmt(r.sc[f], 2)}</b>`).join(" · ") + `<br>jóslat: <b>${predTxt(r)}</b>`;
        return s;
      }
      function update() {
        const isNew = mode === "new";
        cN.style.display = isNew ? "" : "none";
        tw.style.display = isNew ? "none" : "";
        const res = ART.map((_, c) => vote(nbOf(c), y[c]));
        const exp = res.reduce((t, r) => t + r.pt, 0);
        const NB = isNew ? nbNew() : null, rN = isNew ? vote(NB, null) : null;
        // gráf
        const nodes = ART.map((a, i) => ({ label: String(a.id), x: base[i][0], y: base[i][1], color: FR_COL[a.frame], sub: a.paper, badge: isNew ? null : markTxt(res[i]) }));
        const E = [];
        const focus = isNew ? 12 : sel;
        KEYS.forEach(k => {
          if (!beta[k]) return;
          for (let c = 0; c < 12; c++) for (let d = c + 1; d < 12; d++) {
            const m = Mf[k](c, d); if (!m) continue;
            const on = focus === c || focus === d;
            E.push({ a: c, b: d, w: m, dash: DASH[k], color: on ? "--accent" : "--muted", width: on ? 2.4 : 1.4, alpha: focus >= 0 && !on ? 0.22 : 0.85, label: on && k === "S" && m > 1 ? String(m) : "" });
          }
        });
        if (isNew) {
          nodes.push({ label: "új", x: 0.5, y: 0.5, color: "--accent", sub: nw.paper || "?" });
          KEYS.forEach(k => { if (beta[k]) NB[k].forEach(({ d, m }) => E.push({ a: 12, b: d, w: m, dash: DASH[k], color: "--accent", width: 2.2, alpha: 0.9, label: k === "S" && m > 1 ? String(m) : "" })); });
        }
        view.setGraph(nodes, E);
        view.hl = new Set(focus >= 0 && focus < 12 ? [focus] : []); view.dim = false; view.draw();
        legend.innerHTML = FR_IDS.map(f => `${sq(FR_COL[f])}${D.frames[f]}`).join(" · ") + "<br>" +
          KEYS.map(k => `${lineSw("--muted", KIND[k], 2)}${MPN[k]}`).join(" · ") + (isNew ? "" : " · a csúcs mellett: ✓ / ½ / ✗") +
          `<br><span class="muted">csak a $\\beta > 0$ metaútvonalak élei látszanak; a csúcs alatt a lap</span>`;
        math(legend);
        // kiírás
        if (isNew) {
          ro.innerHTML = breakdown(NB, rN, `új cikk: ${nw.S.size ? [...nw.S].join(", ") : "nem említ senkit"} · ${nw.paper || "ismeretlen lap"}`) +
            `<br><span class="muted">Most mind a 12 cikk szavaz. Az új cikknek még nincs eseménye, a C–E–C itt nem ad szavazatot.</span>`;
        } else if (sel >= 0) {
          ro.innerHTML = breakdown(nbOf(sel), res[sel], `C${sel + 1} (${ART[sel].paper}) – valódi keret: ${D.frames[y[sel]]}`) + ` ${mark(res[sel])}`;
        } else ro.innerHTML = "Kattints egy cikkre a gráfon vagy a táblázatban!";
        math(ro);
        const maj = Math.max(...FR_IDS.map(f => y.filter(v => v === f).length));
        sum.innerHTML = (isNew ? "" : `várható találat: <b>${fmt(exp, 2)} / 12</b> · összevetésként a többségi alapvonal: ${maj} / 12 (mindenre „lakossági veszteség”)<br>`) +
          "élhomofília (a szomszédos cikkpárok közül azonos keretű): " +
          KEYS.map(k => `${MPN[k]} ${HOMO[k].s}/${HOMO[k].p} = <b>${fmt(100 * HOMO[k].s / HOMO[k].p, 0)}%</b>`).join(" · ");
        if (!isNew) {
          const head = ["cikk", "lap", "valódi keret", ...FR_IDS.map(f => FR_SHORT[f]), "jóslat", ""];
          const rows = res.map((r, c) => {
            const best = Math.max(...FR_IDS.map(f => r.sc[f]));
            return `<tr data-c="${c}" style="cursor:pointer;${c === sel ? "background:var(--accent-soft)" : ""}">` + td(`C${c + 1}`) + td(ART[c].paper) +
              td(`${sq(FR_COL[y[c]])}${FR_SHORT[y[c]]}`, "text-align:left") +
              FR_IDS.map(f => td(fmt(r.sc[f], 2), best > 0 && near(r.sc[f], best) ? "font-weight:700" : "color:var(--muted)")).join("") +
              td(predTxt(r)) + td(mark(r)) + "</tr>";
          });
          tw.innerHTML = tblH(head, rows);
        }
        root.dataset.mv = JSON.stringify({ mode, beta, exp: +exp.toFixed(4), wrong: res.map((r, c) => (r.pt < 1 ? `C${c + 1}:${predTxt(r)}:${fmt(r.pt, 2)}` : null)).filter(Boolean),
          homo: Object.fromEntries(KEYS.map(k => [MPN[k], [HOMO[k].s, HOMO[k].p]])), sel: sel >= 0 ? sel + 1 : null,
          nw: isNew ? { S: [...nw.S], paper: nw.paper, sc: Object.fromEntries(FR_IDS.map(f => [f, +rN.sc[f].toFixed(4)])), pred: predTxt(rN) } : null });
      }
      tw.addEventListener("click", ev => { const tr = ev.target.closest("tr[data-c]"); if (tr) { sel = +tr.dataset.c; update(); } });
      update();
    };
  }
