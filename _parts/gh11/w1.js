  /* ==================================================================
     w1: 11.2–11.3 widgetjei (link-heuristics, auc-builder, leakage-demo)
     A saját segédfüggvények blokkban, hogy ne ütközzenek a w2 neveivel.
     ================================================================== */
  {
    const fmM = (x, d = 3) => fmt(x, d).replace(",", "{,}");                 // KaTeX-be
    const sv = c => (String(c).startsWith("--") ? `var(${c})` : c);
    const dash = (c, kind) => `<span style="display:inline-block;width:1.7em;height:0;border-top:3px ${kind || "solid"} ${sv(c)};vertical-align:.25em;margin-right:.25em"></span>`;
    const sq = (c, op = 1) => `<span style="display:inline-block;width:.85em;height:.85em;border-radius:2px;background:${sv(c)};opacity:${op};vertical-align:-.08em;margin-right:.25em"></span>`;
    const IDS = D.actors.map(a => a.id);
    const f3 = x => (isFinite(x) ? x.toFixed(3).replace(".", ",") : "–");                // AUC-k: mindig 3 tizedes
    const eqA = x => (Math.abs(x - +x.toFixed(3)) < 1e-12 ? "=" : "\\approx");
    const SNS = "http://www.w3.org/2000/svg";
    function S(tag, attrs, parent) {
      const e = document.createElementNS(SNS, tag);
      if (attrs) for (const [k, v] of Object.entries(attrs)) { if (k === "text") e.textContent = v; else e.setAttribute(k, v); }
      if (parent) parent.append(e);
      return e;
    }
    /* holtversenyes helyezések egy csökkenően rendezett értéksorra: ["1.", "2–5.", …] */
    function rankStr(vals) {
      const out = [];
      for (let i = 0; i < vals.length;) {
        let j = i; while (j < vals.length && Math.abs(vals[j] - vals[i]) < 1e-9) j++;
        for (let k = i; k < j; k++) out[k] = j - i > 1 ? `${i + 1}–${j}.` : `${i + 1}.`;
        i = j;
      }
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
    /* az Árvízhét időbeli felosztása: tanítógráf (H–Sze), jelöltek, pozitívak (Cs–V új élei) */
    function arvizSplit() {
      const G1 = arvizGraph(ARV_FIRST), GF = arvizGraph(), S2 = edgeSet(arvizGraph(ARV_SECOND).edges);
      const cand = nonEdges(7, G1.edges), y = cand.map(([a, b]) => S2.has(pairKey(a, b)));
      return { G1, GF, cand, y, test: cand.filter((_, i) => y[i]).map(([a, b]) => ({ a, b, w: 1 })) };
    }
    const pn = (a, b, lab = IDS) => lab[a] + "–" + lab[b];
    const tbl = (head, rows) => `<table style="width:auto;margin:.3rem 0;font-size:.86rem;white-space:nowrap"><thead><tr>${head.map(x => `<th style="padding:.2em .5em">${x}</th>`).join("")}</tr></thead><tbody>${rows.join("")}</tbody></table>`;

    /* ------------------------------------------------------------------
       11.2  link-heuristics – szomszédsági pontszámok az Árvízhéten
       ------------------------------------------------------------------ */
    W["link-heuristics"] = root => {
      header(root, "Szomszédsági pontszámok: ki jelenik meg legközelebb együtt?",
        "Az Árvízhét szereplőgráfja (két szereplő között él van, ha egy cikkben együtt szerepelnek). <b>Kattints két szereplőre</b> egymás után: " +
        "kiemelődnek a közös szomszédaik, és látod mind az öt pontszámot behelyettesítve. Alatta az összes <b>jelölt pár</b> (még nem él) rangsora.");
      const n = 7, narrow = root.clientWidth < 560, asp = narrow ? 0.72 : 0.62;
      const G = { first: arvizGraph(ARV_FIRST), all: arvizGraph() };
      const AS = arvizSplit(), NEWK = new Set(AS.test.map(e => pairKey(e.a, e.b)));
      let mode = "first", meth = "AA", sel = [2, 4], showNew = false;

      const c1 = h("div", { class: "controls" });
      c1.append(h("span", { class: "muted", style: "font-size:.92rem" }, "gráf:"));
      toggleGroup(c1, [["first", "hét eleje (H–Sze)"], ["all", "az egész hét"]], mode, v => { mode = v; update(); });
      root.append(c1);
      const two = h("div", { class: "two-col", style: "align-items:start" }), left = h("div"), right = h("div");
      two.append(left, right); root.append(two);
      const nodes0 = preset("arviz", asp).nodes.map(nd => ({ label: nd.label, x: nd.x, y: nd.y }));     // a teljes nevek a kiírásban
      const view = new GK.View(left, { aspect: asp, radius: narrow ? 13 : 15, draggable: false, maxW: 440,
        onNodeClick: i => { if (sel.length >= 2) sel = [i]; else if (sel[0] === i) sel = []; else sel.push(i); update(); } });
      const legend = h("p", { class: "muted", style: "font-size:.84rem;margin:.3rem 0 0" });
      left.append(legend);
      const ro = h("div", { class: "readout", style: "margin-top:0" });
      right.append(ro);

      const c2 = h("div", { class: "controls" });
      c2.append(h("span", { class: "muted", style: "font-size:.92rem" }, "rangsor:"));
      toggleGroup(c2, LINK_METHODS.map(([k]) => [k, k]), meth, v => { meth = v; update(); });
      const mName = h("span", { class: "muted", style: "font-size:.88rem" });
      c2.append(mName);
      const cb = h("input", { type: "checkbox", onchange: () => { showNew = cb.checked; update(); } });
      const cbL = h("label", null, cb, "mutasd, mi történt a hét végén");
      const c3 = h("div", { class: "controls" }); c3.append(cbL);
      root.append(c2, c3);
      const sum = h("div", { class: "readout", style: "display:none" });
      const tw = h("div", { class: "tw", style: "overflow-x:auto" });
      root.append(sum, tw);
      root.append(h("p", { class: "muted", style: "margin:.5rem 0 0;font-size:.88rem" },
        "Tipp: a táblázat egy sorára kattintva a pár kijelölődik a gráfon. A Kl a hét elején egyetlen cikkben sem szerepel másokkal – minden párjának minden pontszáma 0."));

      const FORM = { CN: "|N(u) \\cap N(v)|", J: "\\dfrac{|N(u) \\cap N(v)|}{|N(u) \\cup N(v)|}", AA: "\\sum_{w} \\dfrac{1}{\\ln k_w}", RA: "\\sum_{w} \\dfrac{1}{k_w}", PA: "k_u \\cdot k_v" };
      const setT = L => (L.length ? `\\{${L.map(i => texLab(IDS[i])).join(", ")}\\}` : "\\emptyset");

      function readout(g, sc, Nb) {
        if (!sel.length) return "Kattints két szereplőre (vagy a táblázat egy sorára)!";
        const [u, v] = sel;
        if (sel.length === 1) return `$N(${texLab(IDS[u])}) = ${setT(Nb[u])}$, $k = ${Nb[u].length}$<br>Most kattints a pár másik tagjára!`;
        const isE = Nb[u].includes(v), r = sc(u, v), C = r.common, U = new Set([...Nb[u], ...Nb[v]]);
        const tu = texLab(IDS[u]), tv = texLab(IDS[v]);
        let s = `<b>${actorName(IDS[u])} – ${actorName(IDS[v])}</b>` + (isE ? ` · <b>ez már él – nem jelölt</b>` : "") + "<br>";
        s += `$N(${tu}) = ${setT(Nb[u])}$, $N(${tv}) = ${setT(Nb[v])}$<br>`;
        s += "közös szomszédok: " + (C.length ? C.map(w => `${IDS[w]} ($k = ${Nb[w].length}$)`).join(", ") : "nincs") + "<br>";
        const aa = C.length ? C.map(w => `\\tfrac{1}{\\ln ${Nb[w].length}}`).join(" + ") : "0", ra = C.length ? C.map(w => `\\tfrac{1}{${Nb[w].length}}`).join(" + ") : "0";
        s += `$\\mathrm{CN} = ${FORM.CN} = ${r.CN}$<br>`;
        s += `$\\mathrm{J} = \\tfrac{${r.CN}}{${U.size}} ${U.size ? eqA(r.J) + " " + fmM(r.J) : "\\to 0"}$<br>`;
        s += `$\\mathrm{AA} = ${aa}${C.length ? " " + eqA(r.AA) + " " + fmM(r.AA) : ""}$<br>`;
        s += `$\\mathrm{RA} = ${ra}${C.length ? " " + eqA(r.RA) + " " + fmM(r.RA) : ""}$<br>`;
        s += `$\\mathrm{PA} = ${Nb[u].length} \\cdot ${Nb[v].length} = ${r.PA}$`;
        if (!C.length && !isE) s += `<br><span class="muted">Nincs közös szomszéd: CN, J, AA, RA mind 0.</span>`;
        return s;
      }
      function update() {
        if (mode === "all") { showNew = false; cb.checked = false; }
        cb.disabled = mode === "all"; cbL.style.opacity = mode === "all" ? 0.5 : 1;
        const g = G[mode], sc = linkScorer(n, g.edges), Nb = nbrs(n, g.edges);
        const cands = nonEdges(n, g.edges).map(([a, b]) => ({ a, b, ...sc(a, b), y: mode === "first" && NEWK.has(pairKey(a, b)) }));
        const srt = cands.slice().sort((x, z) => z[meth] - x[meth]), rk = rankStr(srt.map(c => c[meth]));
        const nm = LINK_METHODS.find(m => m[0] === meth)[1]; mName.innerHTML = `${nm}: $${FORM[meth]}$`;
        // gráf
        const E = g.edges.map(e => ({ a: e.a, b: e.b, w: 1 }));
        const extra = showNew ? AS.test.map(e => ({ a: e.a, b: e.b, w: 1, color: "--setC", dash: [7, 5], width: 2.5 })) : [];
        if (sel.length === 2 && !Nb[sel[0]].includes(sel[1])) {
          const k = pairKey(sel[0], sel[1]), x = extra.find(e => pairKey(e.a, e.b) === k);
          if (x) { x.color = "--accent"; x.width = 3.5; } else extra.push({ a: sel[0], b: sel[1], w: 1, color: "--accent", dash: [2, 5], width: 2.5 });
        }
        view.setGraph(nodes0.map((nd, i) => ({ ...nd, badge: Nb[i].length })), E.concat(extra));
        view.hl = new Set(sel); view.hlE = new Set();
        if (sel.length === 2) sc(sel[0], sel[1]).common.forEach(w => { view.hl.add(w); view.hlE.add(GK.edgeKey(sel[0], w)); view.hlE.add(GK.edgeKey(sel[1], w)); });
        view.dim = sel.length === 2; view.draw();
        legend.innerHTML = `a csúcs melletti szám: fokszám · ${dash("--accent", "dotted")}a kijelölt pár` +
          (sel.length === 2 ? " · kiemelve a közös szomszédok és az oda vezető élek" : "") + (showNew ? ` · ${dash("--setC", "dashed")}a hét végén megjelent új él` : "");
        ro.innerHTML = readout(g, sc, Nb);
        // táblázat
        const selK = sel.length === 2 ? pairKey(sel[0], sel[1]) : "";
        const head = ["hely", "pár", ...LINK_METHODS.map(([k]) => (k === meth ? `<span style="color:var(--accent)">${k} ▼</span>` : k))].concat(showNew ? ["hét vége"] : []);
        const rows = srt.map((c, i) => {
          const on = pairKey(c.a, c.b) === selK;
          return `<tr data-a="${c.a}" data-b="${c.b}" style="cursor:pointer;${on ? "background:var(--accent-soft);font-weight:700" : ""}"><td>${rk[i]}</td><td>${pn(c.a, c.b)}</td>` +
            LINK_METHODS.map(([k]) => `<td style="text-align:right;${k === meth ? "font-weight:700" : "color:var(--muted)"}">${k === "CN" || k === "PA" ? c[k] : fmt(c[k], 3)}</td>`).join("") +
            (showNew ? `<td style="text-align:center">${c.y ? '<b style="color:var(--setC)">✓ új él</b>' : '<span class="muted">–</span>'}</td>` : "") + "</tr>";
        });
        tw.innerHTML = tbl(head, rows) + `<div class="muted" style="font-size:.82rem">${cands.length} jelölt pár (${n} csúcs, ${g.edges.length} él: ${n * (n - 1) / 2} − ${g.edges.length} = ${cands.length})</div>`;
        // a hét vége
        let p5 = null;
        if (showNew) {
          p5 = precisionAtK(cands.map(c => ({ s: c[meth], y: c.y })), 5);
          const tie = srt.length > 5 && Math.abs(srt[4][meth] - srt[5][meth]) < 1e-9;
          const grp = tie ? srt.filter(c => Math.abs(c[meth] - srt[4][meth]) < 1e-9).length : 0;
          sum.style.display = "";
          sum.innerHTML = `a hét végén ${AS.test.length} új él jelent meg: ${AS.test.map(e => pn(e.a, e.b)).join(", ")} · ` +
            `${meth === "AA" || meth === "RA" ? "az" : "a"} ${meth}-rangsor top 5-jében <b>${fmt(p5.hits, 2)}</b> találat${tie ? " (várható érték)" : ""}<br>` +
            `precision@5 = ${fmt(p5.hits, 2)}/5 = <b>${fmt(p5.prec, 3)}</b> · recall@5 = ${fmt(p5.hits, 2)}/${AS.test.length} = <b>${fmt(p5.rec, 3)}</b>` +
            (tie ? `<br><span class="muted">Holtverseny az 5. helyen: ${grp} pár ugyanannyi pontot kapott, ezekből véletlenszerűen kerül be a top 5-be – a találatszám ezért várható érték.</span>` :
              `<br><span class="muted">Véletlen sorrendnél a várható precision ${AS.test.length}/${cands.length} ≈ ${fmt(AS.test.length / cands.length, 3)} lenne.</span>`);
        } else sum.style.display = "none";
        const sp = sel.length === 2 ? sc(sel[0], sel[1]) : null;
        root.dataset.lh = JSON.stringify({ mode, meth, sel: sel.map(i => IDS[i]), sc: sp && { CN: sp.CN, J: +sp.J.toFixed(4), AA: +sp.AA.toFixed(4), RA: +sp.RA.toFixed(4), PA: sp.PA },
          top: pn(srt[0].a, srt[0].b), topS: +srt[0][meth].toFixed(4), p5: p5 && { hits: +p5.hits.toFixed(4), prec: +p5.prec.toFixed(4), rec: +p5.rec.toFixed(4) } });
        math(ro); math(mName);
      }
      tw.addEventListener("click", ev => {
        const tr = ev.target.closest("tr[data-a]"); if (!tr) return;
        sel = [+tr.dataset.a, +tr.dataset.b]; update();
      });
      update();
    };

    /* ------------------------------------------------------------------
       11.3  auc-builder – ROC-görbe küszöbről küszöbre, AUC párösszehasonlítással
       ------------------------------------------------------------------ */
    W["auc-builder"] = root => {
      header(root, "ROC-görbe és AUC lépésről lépésre",
        "A küszöböt a legnagyobb pontszámtól lefelé léptetjük: ami a küszöbön van vagy fölötte, azt <b>élnek jósoljuk</b>. " +
        "Minden küszöb egy pont a ROC-görbén: $(\\text{FPR}, \\text{TPR})$. A végén az AUC – és hogy miért ugyanaz, mint a nyert pár-összehasonlítások aránya.");
      math(root.querySelector(".w-sub"));
      const AS = arvizSplit();
      let src = "hand", meth = "CN", k = 0, items = [], thr = [], pts = [];
      const c1 = h("div", { class: "controls" }), c2 = h("div", { class: "controls" });
      c1.append(h("span", { class: "muted", style: "font-size:.92rem" }, "adat:"));
      toggleGroup(c1, [["hand", "kézi példa (3 + 3 pár)"], ["arviz", "Árvízhét H–Sze → Cs–V"]], src, v => { src = v; k = 0; build(); });
      const mBox = h("span", { style: "display:inline-flex;flex-wrap:wrap;gap:.4rem;align-items:center" });
      mBox.append(h("span", { class: "muted", style: "font-size:.92rem" }, "pontszám:"));
      toggleGroup(mBox, LINK_METHODS.map(([m]) => [m, m]), meth, v => { meth = v; k = 0; build(); });
      c1.append(mBox);
      c2.append(btn("◀ vissza", () => { if (k > 0) { k--; draw(); } }), btn("következő küszöb ▶", () => { if (k < thr.length) { k++; draw(); } }, "btn primary"),
        btn("mind", () => { k = thr.length; draw(); }), btn("elölről", () => { k = 0; draw(); }));
      root.append(c1, c2);
      const two = h("div", { class: "two-col", style: "align-items:start" }), left = h("div"), right = h("div");
      two.append(left, right); root.append(two);
      const list = h("div", { class: "tw", style: "overflow-x:auto" });
      left.append(list);
      const svg = S("svg", { viewBox: "0 0 320 300", style: "width:100%;max-width:380px;display:block;margin:auto", role: "img", "aria-label": "ROC-görbe" });
      right.append(svg);
      right.append(h("p", { class: "muted", style: "font-size:.84rem;margin:.2rem 0 0", html: `${dash("--accent")}ROC-görbe · ${dash("--muted", "dashed")}véletlen találgatás (AUC = 0,5)` }));
      const ro = h("div", { class: "readout" }), grid = h("div", { class: "tw", style: "overflow-x:auto;margin-top:.5rem" });
      root.append(ro, grid);

      function build() {
        mBox.style.display = src === "arviz" ? "inline-flex" : "none";
        if (src === "hand") items = [["P1", 0.9, true], ["P2", 0.6, true], ["P3", 0.3, true], ["N1", 0.7, false], ["N2", 0.3, false], ["N3", 0.1, false]].map(([name, s, y]) => ({ name, s, y }));
        else { const sc = linkScorer(7, AS.G1.edges); items = AS.cand.map(([a, b], i) => ({ name: pn(a, b), s: sc(a, b)[meth], y: AS.y[i] })); }
        items.sort((x, z) => z.s - x.s || (z.y - x.y));
        thr = [...new Set(items.map(x => x.s))].sort((x, z) => z - x);
        pts = rocPoints(items.map(x => ({ s: x.s, y: x.y })));
        draw();
      }
      const fs = x => (src === "hand" ? fmt(x, 1) : fmt(x, 3));
      function draw() {
        const P = items.filter(x => x.y).length, N = items.length - P, t = k ? thr[k - 1] : Infinity, done = k === thr.length;
        const pred = items.filter(x => x.s >= t), TP = pred.filter(x => x.y).length, FP = pred.length - TP;
        // rangsor
        const rows = items.map(x => {
          const on = x.s >= t, cur = k && Math.abs(x.s - t) < 1e-12;
          return `<tr style="${on ? "background:var(--accent-soft);" : ""}${cur ? "font-weight:700;" : ""}"><td>${x.name}</td><td style="text-align:right">${fs(x.s)}</td>` +
            `<td>${x.y ? '<span style="color:var(--setC)">✓ pozitív</span>' : '<span style="color:var(--setB)">✗ negatív</span>'}</td>` +
            `<td>${on ? "<b>él</b>" : '<span class="muted">–</span>'}</td></tr>`;
        });
        list.innerHTML = tbl(["pár", "pont", "valóság", "jóslat"], rows) +
          `<div class="muted" style="font-size:.82rem">${P} pozitív, ${N} negatív pár · a kiemelt sorok a küszöbön vagy fölötte vannak, a félkövérek most léptek át</div>`;
        // ROC
        svg.innerHTML = "";
        const L = 40, T = 12, Wd = 268, Ht = 248, X = v => L + v * Wd, Y = v => T + (1 - v) * Ht;
        [0, 0.25, 0.5, 0.75, 1].forEach(v => {
          S("line", { x1: X(v), y1: T, x2: X(v), y2: T + Ht, style: "stroke:var(--border);stroke-width:1" }, svg);
          S("line", { x1: L, y1: Y(v), x2: L + Wd, y2: Y(v), style: "stroke:var(--border);stroke-width:1" }, svg);
          S("text", { x: X(v), y: T + Ht + 14, "text-anchor": "middle", style: "fill:var(--muted);font-size:11px", text: fmt(v, 2) }, svg);
          S("text", { x: L - 5, y: Y(v) + 4, "text-anchor": "end", style: "fill:var(--muted);font-size:11px", text: fmt(v, 2) }, svg);
        });
        S("text", { x: L + Wd / 2, y: T + Ht + 30, "text-anchor": "middle", style: "fill:var(--text);font-size:12px", text: "FPR (téves riasztás aránya)" }, svg);
        S("text", { x: 12, y: T + Ht / 2, "text-anchor": "middle", transform: `rotate(-90 12 ${T + Ht / 2})`, style: "fill:var(--text);font-size:12px", text: "TPR (találati arány)" }, svg);
        S("line", { x1: X(0), y1: Y(0), x2: X(1), y2: Y(1), style: "stroke:var(--muted);stroke-width:1.5;stroke-dasharray:5 4" }, svg);
        const shown = pts.slice(0, k + 1);
        if (done) S("polygon", { points: shown.map(p => `${X(p.fpr)},${Y(p.tpr)}`).join(" ") + ` ${X(1)},${Y(0)} ${X(0)},${Y(0)}`, style: "fill:var(--accent);opacity:.13" }, svg);
        S("polyline", { points: shown.map(p => `${X(p.fpr)},${Y(p.tpr)}`).join(" "), style: "fill:none;stroke:var(--accent);stroke-width:2.5;stroke-linejoin:round" }, svg);
        shown.forEach((p, i) => S("circle", { cx: X(p.fpr), cy: Y(p.tpr), r: i === k ? 6 : 3.5, style: `fill:${i === k ? "var(--accent)" : "var(--card)"};stroke:var(--accent);stroke-width:2` }, svg));
        const cp = pts[k];
        S("text", { x: Math.min(X(cp.fpr) + 9, L + Wd - 70), y: Math.max(Y(cp.tpr) - 9, T + 12), style: "fill:var(--text);font-size:11px;font-weight:600", text: `(${fmt(cp.fpr, 2)}; ${fmt(cp.tpr, 2)})` }, svg);
        // kiírás
        let s = k === 0 ? `küszöb a legnagyobb pontszám fölött: semmit sem jósolunk élnek (${k}/${thr.length}. küszöb)` :
          `küszöb: pont ≥ <b>${fs(t)}</b> (${k}/${thr.length}.) → ${pred.length} párt jósolunk élnek`;
        s += `<br>TP = ${TP}, FP = ${FP} · TPR = ${TP}/${P} = <b>${fmt(TP / P, 3)}</b> · FPR = ${FP}/${N} = <b>${fmt(FP / N, 3)}</b> · precision = ${pred.length ? `${TP}/${pred.length} = <b>${fmt(TP / pred.length, 3)}</b>` : "– (nincs jóslat)"}`;
        if (k > 0 && pts[k].fpr > pts[k - 1].fpr && pts[k].tpr > pts[k - 1].tpr) s += `<br><span class="muted">Holtverseny: ezen a küszöbön pozitív és negatív pár is átlépett – a görbe ferdén megy.</span>`;
        const Pp = items.filter(x => x.y), Nn = items.filter(x => !x.y);
        let wins = 0, ties = 0; Pp.forEach(p => Nn.forEach(q => { if (p.s > q.s + 1e-12) wins++; else if (Math.abs(p.s - q.s) < 1e-12) ties++; }));
        const auc = (wins + ties / 2) / (P * N);
        if (done) {
          s += `<br>AUC = (nyert + ½ · döntetlen) / (P · N) = (${wins} + ½ · ${ties}) / ${P * N} = <b>${fmt(wins + ties / 2, 1)}/${P * N} = ${f3(auc)}</b>` +
            `<br><span class="muted">A satírozott terület a görbe alatt pontosan ennyi: a ROC-görbe minden vízszintes lépése egy negatív, minden függőleges egy pozitív pár.</span>`;
          grid.innerHTML = `<p class="muted" style="font-size:.86rem;margin:.2rem 0">Minden (pozitív, negatív) pár: ✓ a pozitív kapott több pontot, ½ döntetlen, ✗ a negatív kapott többet.</p>` +
            tbl(["pozitív \\ negatív", ...Nn.map(q => `${q.name}<br><span class="muted" style="font-weight:400">${fs(q.s)}</span>`)],
              Pp.map(p => `<tr><th style="text-align:left;padding:.2em .5em">${p.name} <span class="muted" style="font-weight:400">${fs(p.s)}</span></th>` + Nn.map(q => {
                const r = p.s > q.s + 1e-12 ? ["✓", "--setC"] : Math.abs(p.s - q.s) < 1e-12 ? ["½", "--muted"] : ["✗", "--setB"];
                return `<td style="text-align:center;font-weight:700;color:var(${r[1]});background:color-mix(in srgb, var(${r[1]}) 12%, var(--card))">${r[0]}</td>`;
              }).join("") + "</tr>"));
        } else { s += `<br><span class="muted">Lépj végig a küszöbökön (vagy „mind”) – a végén jön az AUC.</span>`; grid.innerHTML = ""; }
        ro.innerHTML = s;
        root.dataset.auc = JSON.stringify({ src, meth, k, K: thr.length, TP, FP, wins, ties, PN: P * N, auc: +auc.toFixed(4), done });
      }
      build();
    };

    /* ------------------------------------------------------------------
       11.3  leakage-demo – mi történik, ha a tesztélek a pontozó gráfban maradnak?
       ------------------------------------------------------------------ */
    W["leakage-demo"] = root => {
      header(root, "Szivárgás: a tesztélek a pontozó gráfban",
        "A tesztéleket (a jósolandó párokat) a pontozás előtt <b>ki kell venni</b> a gráfból. Ha bent maradnak, a módszer „belelát” a válaszba, és az AUC hamisan nagy lesz. " +
        "Kapcsold be a szivárgást, és nézd, melyik módszer mennyit „nyer” vele!");
      const narrow = root.clientWidth < 560, AS = arvizSplit(), K = karateGraph(), KN = nonEdges(34, K.edges);
      let data = "arviz", leak = false, seed = 1, avg = null, stop = null, cur = null;
      const c1 = h("div", { class: "controls" }), c2 = h("div", { class: "controls" });
      c1.append(h("span", { class: "muted", style: "font-size:.92rem" }, "a tesztélek a pontozó gráfban:"));
      toggleGroup(c1, [[false, "nem (helyes)"], [true, "igen (szivárgás)"]], leak, v => { leak = v; render(); });
      c2.append(h("span", { class: "muted", style: "font-size:.92rem" }, "adat:"));
      toggleGroup(c2, [["arviz", "Árvízhét H–Sze → Cs–V"], ["karate", "karateklub, 10% tesztél"]], data, v => { data = v; cancel(); avg = null; compute(); });
      const kBox = h("span", { style: "display:inline-flex;flex-wrap:wrap;gap:.4rem;align-items:center" });
      const prog = h("span", { class: "muted", style: "font-size:.88rem" });
      kBox.append(btn("új felosztás", () => { cancel(); seed++; avg = null; compute(); }), btn("20 felosztás átlaga", () => runAvg()), prog);
      c2.append(kBox);
      root.append(c1, c2);
      const two = h("div", { class: "two-col", style: "align-items:start" }), left = h("div"), right = h("div");
      two.append(left, right); root.append(two);
      const gbox = h("div"); left.append(gbox);
      const legend = h("p", { class: "muted", style: "font-size:.84rem;margin:.3rem 0 0" }); left.append(legend);
      const svg = S("svg", { viewBox: "0 0 400 260", style: "width:100%;max-width:440px;display:block;margin:auto", role: "img", "aria-label": "AUC módszerenként" });
      right.append(svg);
      right.append(h("p", { class: "muted", style: "font-size:.84rem;margin:.2rem 0 0", html: `${sq("--setA")}helyes (felső sáv) · ${sq("--setB")}szivárgó (alsó sáv) · a kiválasztott állapot élénk, a másik halvány` }));
      const ro = h("div", { class: "readout" }), tw = h("div", { class: "tw", style: "overflow-x:auto" });
      root.append(ro, tw);
      root.append(h("div", { style: "margin-top:.6rem;font-size:.9rem", html:
        "<b>Miért nő?</b> <b>PA:</b> a tesztél mindkét végpontja fokát eggyel növeli – a pozitív párok pontja így <i>mindig</i> nő, a negatívaké csak ritkán. " +
        "<b>CN:</b> egy él nem közös szomszéd – a tesztél $(u, v)$ maga nem változtat $u$ és $v$ közös szomszédain; a pozitív pár CN-je csak akkor nő, ha <i>más</i> tesztélek zárnak vele háromszöget " +
        "(az Árvízhéten a Ko–Sz, Ko–Kl, Sz–Kl épp ilyen). Közben néhány negatív pár is kap egy új közös szomszédot ($v$ új közös szomszédja $u$-nak és $v$ régi szomszédainak), ezért a CN AUC-ja a karateklubon átlagban alig mozdul. " +
        "<b>AA, RA:</b> ugyanígy a közös szomszédokon múlik. " +
        "<b>Jaccard:</b> a tesztél a nevezőt (az uniót) is növeli, ezért akár csökkenhet is. <b>Spektrális:</b> a tesztél a beágyazásban egymás felé húzza a két végpontját." }));
      math(root.lastChild);

      const asp = narrow ? 0.85 : 0.72;
      const view = new GK.View(gbox, { aspect: asp, radius: 13, draggable: false, maxW: 440 });
      const arvNodes = preset("arviz", asp).nodes.map(nd => ({ label: nd.label, x: nd.x, y: nd.y }));
      const karNodes = () => preset("karate", asp).nodes;

      /* egy felosztás kiértékelése: { m: [helyes, szivárgó] } */
      function evalSplit(n, train, full, pos, neg, spec) {
        const out = {}, s0 = linkScorer(n, train), s1 = linkScorer(n, full);
        LINK_METHODS.forEach(([m]) => {
          out[m] = [s0, s1].map(sc => aucPairs(pos.map(([a, b]) => sc(a, b)[m]), neg.map(([a, b]) => sc(a, b)[m])));
        });
        if (spec) out.SP = [train, full].map(E => { const Z = laplacianEmbed(n, E, 2).Z; return aucPairs(pos.map(([a, b]) => -dist(Z[a], Z[b])), neg.map(([a, b]) => -dist(Z[a], Z[b]))); });
        return out;
      }
      function karSplit(sd) {
        const { train, test } = holdoutSplit(34, K.edges, 0.1, rng(sd * 7919 + 3));
        return { train, test, res: evalSplit(34, train, K.edges, test.map(e => [e.a, e.b]), KN, true) };
      }
      function compute() {
        kBox.style.display = data === "karate" ? "inline-flex" : "none";
        if (data === "arviz") {
          const pos = AS.cand.filter((_, i) => AS.y[i]), neg = AS.cand.filter((_, i) => !AS.y[i]);
          cur = { n: 7, train: AS.G1.edges, test: AS.test, res: evalSplit(7, AS.G1.edges, AS.GF.edges, pos, neg, false), npos: pos.length, nneg: neg.length };
        } else { const r = karSplit(seed); cur = { n: 34, ...r, npos: r.test.length, nneg: KN.length }; }
        prog.textContent = "";
        render();
      }
      function cancel() { if (stop) { stop(); stop = null; } }
      function runAvg() {
        cancel(); const acc = {}, R = 20;
        stop = chunked(R, 1, i => {
          const r = karSplit(1000 + i).res;
          Object.entries(r).forEach(([m, v]) => { (acc[m] = acc[m] || [[], []]); acc[m][0].push(v[0]); acc[m][1].push(v[1]); });
        }, d => { prog.textContent = `számolás: ${d}/${R} felosztás`; }, () => {
          stop = null; avg = { R, ms: acc }; prog.textContent = `kész: ${R} felosztás átlaga`; render();
        });
      }
      const MN = { CN: "CN", J: "Jaccard", AA: "AA", RA: "RA", PA: "PA", SP: "spektrális (2D)" };
      function render() {
        // gráf
        const trainE = cur.train.map(e => ({ a: e.a, b: e.b, w: 1, color: "--muted", width: data === "karate" ? 1.3 : 2 }));
        const testE = cur.test.map(e => ({ a: e.a, b: e.b, w: 1, color: "--setB", width: 3, dash: leak ? null : [6, 4], alpha: leak ? 0.55 : 1 }));
        view.o.radius = data === "karate" ? (narrow ? 8 : 10) : (narrow ? 13 : 15);
        view.setGraph(data === "arviz" ? arvNodes : karNodes(), trainE.concat(testE));
        legend.innerHTML = `${dash("--muted")}pontozó (tanító) él · ` + (leak ? `${dash("--setB")}<span style="opacity:.7">tesztél – <b>benne van</b> a pontozó gráfban</span>` : `${dash("--setB", "dashed")}tesztél – kivéve, ezt kell megjósolni`) +
          ` · ${cur.test.length} tesztél, ${cur.nneg} negatív pár`;
        // értékek
        const ms = Object.keys(cur.res), val = {};
        ms.forEach(m => { val[m] = avg ? [0, 1].map(j => meanSd(avg.ms[m][j])) : [0, 1].map(j => ({ mean: cur.res[m][j], sd: 0 })); });
        // oszlopdiagram
        svg.innerHTML = "";
        const L = narrow ? 92 : 100, Rr = 40, top = 20, rowH = 36, VW = narrow ? 330 : 400, Wd = VW - L - Rr, Ht = ms.length * rowH;
        svg.setAttribute("viewBox", `0 0 ${VW} ${top + Ht + 34}`);
        const X = v => L + v * Wd;
        [0, 0.25, 0.5, 0.75, 1].forEach(v => {
          S("line", { x1: X(v), y1: top, x2: X(v), y2: top + Ht, style: "stroke:var(--border);stroke-width:1" }, svg);
          S("text", { x: X(v), y: top + Ht + 14, "text-anchor": "middle", style: "fill:var(--muted);font-size:11px", text: fmt(v, 2) }, svg);
        });
        S("text", { x: X(0.5), y: top + Ht + 28, "text-anchor": "middle", style: "fill:var(--text);font-size:12px", text: "AUC" }, svg);
        ms.forEach((m, i) => {
          const y0 = top + i * rowH + 5;
          S("text", { x: L - 6, y: y0 + 15, "text-anchor": "end", style: "fill:var(--text);font-size:12px;font-weight:600", text: MN[m] }, svg);
          [0, 1].forEach(j => {
            const on = (j === 1) === leak, v = val[m][j].mean, y = y0 + j * 13;
            S("rect", { x: X(0), y, width: Math.max(0, X(v) - X(0)), height: 11, rx: 2, style: `fill:var(${j ? "--setB" : "--setA"});opacity:${on ? 1 : 0.3}` }, svg);
            if (on) S("rect", { x: X(0), y: y - 1, width: Math.max(0, X(v) - X(0)), height: 13, rx: 2, style: "fill:none;stroke:var(--text);stroke-width:1" }, svg);
            S("text", { x: X(v) + 4, y: y + 10, style: `fill:var(--text);font-size:10.5px;opacity:${on ? 1 : 0.6};${on ? "font-weight:700" : ""}`, text: f3(v) }, svg);
          });
        });
        S("line", { x1: X(0.5), y1: top - 4, x2: X(0.5), y2: top + Ht, style: "stroke:var(--text);stroke-width:1.5;stroke-dasharray:4 3" }, svg);
        S("text", { x: X(0.5), y: top - 8, "text-anchor": "middle", style: "fill:var(--muted);font-size:10px", text: "véletlen" }, svg);
        // táblázat + kiírás
        const f = o => f3(o.mean) + (avg ? ` ± ${f3(o.sd)}` : "");
        tw.innerHTML = tbl(["módszer", leak ? "helyes" : "<b>helyes</b>", leak ? "<b>szivárgó</b>" : "szivárgó", "különbség"],
          ms.map(m => `<tr><td>${MN[m]}</td><td style="text-align:right;${leak ? "color:var(--muted)" : "font-weight:700"}">${f(val[m][0])}</td>` +
            `<td style="text-align:right;${leak ? "font-weight:700" : "color:var(--muted)"}">${f(val[m][1])}</td>` +
            `<td style="text-align:right">${val[m][1].mean - val[m][0].mean >= 0 ? "+" : "−"}${f3(Math.abs(val[m][1].mean - val[m][0].mean))}</td></tr>`));
        ro.innerHTML = (data === "arviz" ? `Árvízhét: pontozó gráf = ${leak ? "<b>az egész hét</b> (benne a 4 tesztél)" : "a hét eleje (H–Sze)"}; ${cur.npos} pozitív, ${cur.nneg} negatív jelölt pár.` :
          `Karateklub: ${cur.test.length} tesztél (10%), negatívak: mind a ${KN.length} eredeti nem él; pontozó gráf: ${leak ? "<b>a teljes gráf</b>" : "a tanítógráf (a tesztélek nélkül)"}. ` +
          (avg ? `<b>${avg.R} felosztás átlaga ± szórás</b> (a gráfon az utolsó egyedi felosztás).` : `${seed}. felosztás – a „20 felosztás átlaga” megmutatja, mi nem a véletlen műve.`));
        const out = {}; ms.forEach(m => { out[m] = [+val[m][0].mean.toFixed(4), +val[m][1].mean.toFixed(4)]; });
        root.dataset.leak = JSON.stringify({ data, leak, avg: avg ? avg.R : 0, ntest: cur.test.length, auc: out });
      }
      compute();
    };
  }
