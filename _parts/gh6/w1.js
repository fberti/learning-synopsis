  /* ==================================================================
     w1.js – triangle-counter (6.1), homophily-slider (6.2), balance-game (6.4)
     ================================================================== */
  {
    const frac = (p, q) => (q ? `\\tfrac{${p}}{${q}}` : "\\text{--}");

    /* ---------------------------------------------------------- 6.1 */
    W["triangle-counter"] = root => {
      header(root, "Háromszögszámláló: ismerik-e egymást a szomszédaid?",
        "Kattints egy csúcsra: kiemelődnek a szomszédai és a köztük futó élek (zöld), és kiszámoljuk a $C_i$-t. Szerkesztés módban rajzolhatsz is: üres helyre kattintva új csúcs, két csúcsra kattintva él, élre kattintva törlés.");
      const narrow = root.clientWidth < 560, aspect = narrow ? 0.8 : 0.5;
      const ctr = h("div", { class: "controls" }), ctr2 = h("div", { class: "controls" });
      root.append(ctr, ctr2);
      const box = h("div"), out = h("div", { class: "readout" }), sum = h("div", { class: "readout" });
      root.append(box, out, sum);
      let key = "arviz", mode = "look", sel = -1, badges = true;
      const view = new GK.View(box, { aspect, radius: narrow ? 14 : 16, maxNodes: 14, nodes: [], edges: [],
        onChange: () => { sel = -1; paint(); } });
      root._view = view;
      const look = i => { sel = sel === i ? -1 : i; paint(); };
      function load(k) {
        key = k; sel = -1;
        const G = preset(k, aspect);
        view.setGraph(G.nodes.map(n => ({ label: n.label, x: n.x, y: n.y })), G.edges.map(e => ({ a: e.a, b: e.b, w: 1 })));
        if (k === "karate" && mode === "edit") setMode("look");
        paint();
      }
      function setMode(m) {
        mode = m; paintMode && paintMode(m);
        view.o.editable = m === "edit" && key !== "karate";
        view.o.onNodeClick = m === "look" ? look : null;
        view.sel = -1; sel = -1; paint();
      }
      toggleGroup(ctr, [["arviz", "Árvízhét"], ["barat", "barátsággráf"], ["bowtie", "csokornyakkendő"], ["twoTri", "két háromszög + híd"], ["star", "csillag"], ["kite", "sárkány"], ["karate", "karateklub"]], key, load);
      const paintMode = toggleGroup(ctr2, [["look", "🔍 csúcs vizsgálata"], ["edit", "✏️ szerkesztés"]], mode, setMode);
      const cb = h("input", { type: "checkbox", checked: "", onchange: () => { badges = cb.checked; paint(); } });
      ctr2.append(h("label", null, cb, " $C_i$ a csúcsok mellett"), btn("Üres lap", () => { key = "empty"; view.setGraph([], []); setMode("edit"); }));

      function paint() {
        const n = view.nodes.length, E = view.edges, S = nbrSets(n, E), C = clusteringC(n, E), T = triangles(n, E).per;
        const lab = i => texLab(String(view.nodes[i].label));
        view.nodes.forEach((v, i) => {
          v.color = mixColor("--card", "--setB", 0.12 + 0.7 * C[i]);
          v.ink = C[i] > 0.6 ? "#fff" : null;
          v.badge = badges && n <= 20 ? fmt(C[i], 2) : null;
        });
        view.hl = new Set(); view.hlE = new Set(); view.dim = false;
        E.forEach(e => { delete e.color; delete e.width; delete e.alpha; });
        if (sel >= 0 && sel < n) {
          const Nb = [...S[sel]].sort((x, y) => x - y);
          view.hl = new Set([sel, ...Nb]); view.dim = true;
          E.forEach(e => {
            if (e.a === sel || e.b === sel) { e.color = "--accent"; e.width = 3; }
            else if (S[sel].has(e.a) && S[sel].has(e.b)) { e.color = "--ok"; e.width = 4.5; }
            else e.alpha = 0.18;
          });
          const pairs = [], closed = [];
          for (let x = 0; x < Nb.length; x++) for (let y = x + 1; y < Nb.length; y++) {
            const p = `${lab(Nb[x])}\\text{--}${lab(Nb[y])}`;
            pairs.push(p); if (S[Nb[x]].has(Nb[y])) closed.push(p);
          }
          const k = Nb.length, P = k * (k - 1) / 2;
          out.innerHTML = `<b>${view.nodes[sel].label}</b> szomszédai: ${Nb.length ? "$" + Nb.map(lab).join(",\\ ") + "$" : "nincs"} ($k = ${k}$). ` +
            (k < 2 ? `Kevesebb mint 2 szomszéd: nincs pár, a szokás szerint $C = 0$.`
              : `Szomszédpárok: $\\binom{${k}}{2} = ${P}$. Összekötve: ${closed.length ? "$" + closed.join(",\\ ") + "$" : "egyik sem"} ($T = ${T[sel]}$).<br>` +
                `$C_{${lab(sel)}} = ${frac(T[sel], P)} = ${fmt(C[sel], 3)}$` + (P - closed.length ? ` · nyitott párok: ${P - closed.length}` : ""));
        } else out.innerHTML = mode === "look" ? "Kattints egy csúcsra!" : "Szerkesztés: rajzolj, aztán válts vissza vizsgálatra.";
        const st = clusteringStats(n, E);
        const sumC = C.reduce((a, b) => a + b, 0);
        sum.innerHTML = `Háromszögek: <b>${st.tri}</b> · összefüggő hármasok: <b>${st.triples}</b> (ebből nyitott ${st.wedges}) · ` +
          `$\\bar C = ${n ? fmt(sumC, 3) + "/" + n + " = " + fmt(st.avg, 3) : "\\text{--}"}$ · ` +
          `$C_\\Delta = 3 \\cdot ${st.tri}/${st.triples || 0} = ${st.triples ? fmt(st.trans, 3) : "\\text{--}"}$` +
          (n && st.triples ? (Math.abs(st.avg - st.trans) < 0.005 ? " – a kettő itt egyenlő." : st.avg > st.trans ? " – az átlag a nagyobb: a kis fokú, zárt környezetű csúcsok húzzák fel." : " – a globális a nagyobb: a nagy fokú csúcsok környéke sűrűbb.") : "");
        view.draw(); math(out); math(sum);
      }
      setMode("look"); load("arviz"); math(ctr2); math(root.querySelector(".w-sub"));
    };

    /* ---------------------------------------------------------- 6.2 */
    W["homophily-slider"] = root => {
      header(root, "Homofília-labor: hány él fut a csoportokon belül – és mennyi futna véletlenül?",
        "Két csoport (kék és narancs). <b>Véletlen gráf</b> módban a csúszkák adják meg, mekkora eséllyel köt össze él két azonos, illetve két különböző csoportú csúcsot. " +
        "<b>Kis gráfok</b> módban egy csúcsra kattintva átteheted a másik csoportba. Az $r$ élőben frissül.");
      const narrow = root.clientWidth < 560, aspect = narrow ? 0.85 : 0.5;
      const ctr = h("div", { class: "controls" }), ctrA = h("div", { class: "controls" }), ctrB = h("div", { class: "controls" });
      root.append(ctr, ctrA, ctrB);
      const box = h("div"), out = h("div", { class: "readout" }), bars = h("div");
      root.append(box, bars, out);
      let mode = "rand", seed = 7, n1 = 12, n2 = 12, pin = 0.35, pout = 0.08, grp = [], smallKey = "ladder";
      const view = new GK.View(box, { aspect, radius: narrow ? 9 : 11, nodes: [], edges: [], draggable: true,
        onNodeClick: i => { if (mode !== "small") return; grp[i] = 1 - grp[i]; paint(); } });
      root._view = view;
      function slider(label, min, max, step, val, on, f = v => v) {
        const s = h("input", { type: "range", min, max, step, value: val, style: "width:7.5rem" }), v = h("b", { style: "font-family:var(--mono);min-width:3em" }, f(val));
        s.oninput = () => { v.textContent = f(+s.value); on(+s.value); };
        return { lab: h("label", null, label, " ", s, v), s, v };
      }
      const pct = v => fmt(v, 2);
      const sIn = slider("p(belül)", 0, 1, 0.01, pin, v => { pin = v; build(); }, pct);
      const sOut = slider("p(között)", 0, 1, 0.01, pout, v => { pout = v; build(); }, pct);
      const sN1 = slider("kék", 2, 20, 1, n1, v => { n1 = v; build(); }, String);
      const sN2 = slider("narancs", 2, 20, 1, n2, v => { n2 = v; build(); }, String);
      const setS = (o, v) => { o.s.value = v; o.v.textContent = o.s.step === "1" ? String(v) : pct(v); };
      ctrA.append(sN1.lab, sN2.lab, sIn.lab, sOut.lab, btn("🎲 új sorsolás", () => { seed++; build(); }));
      const presets = h("div", { class: "controls" });
      ctrA.after(presets);
      [["semleges: p(belül) = p(között)", [12, 12, 0.2, 0.2]], ["erős homofília", [12, 12, 0.4, 0.03]], ["heterofília", [12, 12, 0.03, 0.35]], ["nagy + kicsi csoport, semleges", [20, 4, 0.2, 0.2]]]
        .forEach(([l, [a, b, c, d]]) => presets.append(btn(l, () => { n1 = a; n2 = b; pin = c; pout = d; setS(sN1, a); setS(sN2, b); setS(sIn, c); setS(sOut, d); build(); })));
      const smallItems = [["ladder", "létra (6.2 példája)"], ["twoTri", "két háromszög + híd"], ["arviz", "Árvízhét"], ["karate", "karateklub"]];
      toggleGroup(ctrB, smallItems, smallKey, k => { smallKey = k; build(); });
      ctrB.append(btn("eredeti beosztás", () => build()));
      toggleGroup(ctr, [["rand", "🎲 véletlen gráf"], ["small", "👆 kis gráfok"]], mode, m => { mode = m; build(); });

      function build() {
        ctrA.style.display = presets.style.display = mode === "rand" ? "" : "none";
        ctrB.style.display = mode === "small" ? "" : "none";
        if (mode === "rand") {
          const R = rng(seed * 7919 + 1), n = n1 + n2, nodes = [], edges = [];
          grp = [];
          const ring = (cnt, cx, g) => { for (let i = 0; i < cnt; i++) { const t = 2 * Math.PI * i / cnt, rr = 0.17 + 0.05 * R(); nodes.push({ label: "", x: cx + rr * Math.cos(t) * (narrow ? 0.9 : 0.55), y: 0.5 + rr * Math.sin(t) * 1.25 }); grp.push(g); } };
          ring(n1, narrow ? 0.27 : 0.3, 0); ring(n2, narrow ? 0.73 : 0.7, 1);
          for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (R() < (grp[i] === grp[j] ? pin : pout)) edges.push({ a: i, b: j, w: 1 });
          view.o.radius = narrow ? 8 : 10;
          view.setGraph(nodes, edges);
        } else {
          const G = preset(smallKey, aspect);
          const init = { ladder: [0, 0, 0, 1, 1, 1], twoTri: [0, 0, 0, 1, 1, 1] };
          grp = smallKey === "karate" ? G.club.slice() : smallKey === "arviz" ? G.nodes.map(v => (v.label === "La" || v.label === "Ön" ? 1 : 0)) : init[smallKey].slice();
          view.o.radius = smallKey === "karate" ? (narrow ? 9 : 11) : (narrow ? 14 : 16);
          view.setGraph(G.nodes.map(v => ({ label: v.label, x: v.x, y: v.y })), G.edges.map(e => ({ a: e.a, b: e.b, w: 1 })));
        }
        paint();
      }
      function paint() {
        const n = view.nodes.length, E = view.edges;
        view.nodes.forEach((v, i) => { v.color = grp[i] ? "--setB" : "--setA"; v.ink = "#fff"; });
        E.forEach(e => { e.color = grp[e.a] === grp[e.b] ? null : "--muted"; e.dash = grp[e.a] === grp[e.b] ? null : [4, 4]; e.alpha = grp[e.a] === grp[e.b] ? 0.85 : 0.6; });
        view.draw();
        const A = attrAssort(n, E, grp.map(g => (g ? "narancs" : "kék")));
        const m = E.length, inside = E.filter(e => grp[e.a] === grp[e.b]).length;
        const ap = A.a["kék"] || 0, ak = A.a["narancs"] || 0;
        const word = !m ? "" : !isFinite(A.r) ? "Az $r$ itt nem értelmezhető (minden élvég egy csoportban van)." :
          A.r > 0.3 ? "Erős homofília: jóval több a belső él, mint véletlenül." : A.r > 0.05 ? "Enyhe homofília." :
          A.r > -0.05 ? "Semleges: annyi belső él, amennyi véletlenül is lenne." : "Heterofília: a különbözők kapcsolódnak inkább.";
        out.innerHTML = m ? `Élek: <b>${m}</b>, ebből csoporton belül <b>${inside}</b> → belső arány $\\sum e_{gg} = ${fmt(A.within, 3)}$.<br>` +
          `Élvégek: kék $a = ${fmt(ap, 3)}$, narancs $a = ${fmt(ak, 3)}$ → véletlen szint $\\sum a_g^2 = ${fmt(ap, 3)}^2 + ${fmt(ak, 3)}^2 = ${fmt(A.sumA2, 3)}$.<br>` +
          `$r = \\dfrac{${fmt(A.within, 3)} - ${fmt(A.sumA2, 3)}}{1 - ${fmt(A.sumA2, 3)}}$ = <b>${isFinite(A.r) ? fmt(A.r, 3) : "–"}</b>. ${word}` : "Nincs él.";
        /* két sáv: megfigyelt belső arány és véletlen szint */
        const bar = (label, v, col) => h("div", { style: "display:flex;align-items:center;gap:.5rem;margin:.15rem 0;font-size:.85rem" },
          h("span", { style: "min-width:8.5em" }, label),
          h("div", { style: "flex:1;max-width:320px;height:12px;border:1px solid var(--border);border-radius:6px;overflow:hidden;background:var(--card)" },
            h("div", { style: `width:${(100 * v).toFixed(1)}%;height:100%;background:var(${col})` })),
          h("b", { style: "font-family:var(--mono);min-width:3.5em" }, fmt(v, 2)));
        bars.replaceChildren(bar("belső arány", m ? A.within : 0, "--accent"), bar("véletlen szint", m ? A.sumA2 : 0, "--muted"));
        math(out);
      }
      build(); math(root.querySelector(".w-sub"));
    };

    /* ---------------------------------------------------------- 6.4 */
    W["balance-game"] = root => {
      header(root, "Egyensúlyjáték: feszült háromszögek és két tábor",
        "Zöld él: támogat ($+$), piros szaggatott: bírál ($-$). A <b>kiegyensúlyozatlan</b> háromszögek pirosan, a kiegyensúlyozottak halványzölden árnyalva. " +
        "<b>Előjelváltás</b> módban egy élre kattintva megfordítod az előjelét; <b>tábor</b> módban egy csúcsra kattintva átteszed a másik táborba – próbáld meg úgy beosztani a szereplőket, hogy minden $+$ él táboron belül, minden $-$ él táborok között fusson!");
      const narrow = root.clientWidth < 560, aspect = narrow ? 0.8 : 0.48;
      const ctr = h("div", { class: "controls" }), ctr2 = h("div", { class: "controls" });
      root.append(ctr, ctr2);
      const box = h("div"), out = h("div", { class: "readout" }), task = h("div", { class: "readout" });
      root.append(box, out, task);
      let key = "arvizS", mode = "camp", camp = [];
      const view = new GK.View(box, { aspect, radius: narrow ? 15 : 17, maxNodes: 10, nodes: [], edges: [],
        onChange: v => { v.edges.forEach(e => { if (e.s == null) e.s = 1; }); camp = v.nodes.map((_, i) => camp[i] || 0); paint(); },
        onDraw: (ctx, v) => {
          const n = v.nodes.length;
          ctx.save(); ctx.globalCompositeOperation = "destination-over";
          signedTriangles(n, v.edges).forEach(T => {
            ctx.beginPath();
            T.t.forEach((i, q) => { const [x, y] = v.px(v.nodes[i]); q ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
            ctx.closePath();
            ctx.fillStyle = mixColor("--card", T.prod > 0 ? "--ok" : "--bad", T.prod > 0 ? 0.18 : 0.38);
            ctx.fill();
          });
          ctx.restore();
        } });
      root._view = view;
      function load(k) {
        key = k;
        if (k === "empty") view.setGraph([], []);
        else { const G = preset(k, aspect); view.setGraph(G.nodes.map(v => ({ label: v.label, x: v.x, y: v.y })), G.edges.map(e => ({ a: e.a, b: e.b, w: 1, s: e.s }))); }
        camp = view.nodes.map(() => 0);
        if (k === "empty") setMode("edit"); else paint();
      }
      function setMode(m) {
        mode = m; paintMode(m);
        view.o.editable = m === "edit";
        view.o.onEdgeClick = m === "sign" ? i => { view.edges[i].s = -view.edges[i].s; paint(); } : null;
        view.o.onNodeClick = m === "camp" ? i => { camp[i] = 1 - camp[i]; paint(); } : null;
        view.sel = -1; paint();
      }
      toggleGroup(ctr, [["arvizS", "Árvízhét"], ["sK4bal", "K₄: két tábor"], ["sK4unb", "K₄: egy feszült él"], ["s5", "öt szereplő"], ["s5unb", "kör egy mínusszal"], ["empty", "üres lap"]], key, load);
      const paintMode = toggleGroup(ctr2, [["camp", "👥 tábor"], ["sign", "± előjelváltás"], ["edit", "✏️ élek szerkesztése"]], mode, setMode);
      ctr2.append(btn("💡 egy legjobb beosztás", () => { const F = frustration(view.nodes.length, view.edges); if (F.camp) camp = F.camp.slice(); paint(); }),
        btn("táborok nullázása", () => { camp = view.nodes.map(() => 0); paint(); }));

      function paint() {
        const n = view.nodes.length, E = view.edges;
        E.forEach(e => { if (e.s == null) e.s = 1; });
        const bad = new Set();
        E.forEach((e, i) => { if ((camp[e.a] === camp[e.b]) !== (e.s > 0)) bad.add(i); });
        E.forEach((e, i) => { e.color = e.s > 0 ? "--ok" : "--bad"; e.dash = e.s > 0 ? null : [7, 5]; e.width = bad.has(i) && mode === "camp" ? 5 : 3; e.label = bad.has(i) && mode === "camp" ? "✘" : ""; });
        view.o.showWeights = mode === "camp";
        view.nodes.forEach((v, i) => { v.color = camp[i] ? "--setB" : "--setA"; v.ink = "#fff"; });
        view.draw();
        const tri = signedTriangles(n, E), cnt = { "+++": 0, "+--": 0, "++-": 0, "---": 0 };
        tri.forEach(t => cnt[t.type]++);
        const balT = cnt["+++"] + cnt["+--"], B = balanceCheck(n, E), F = n <= 14 ? frustration(n, E) : null;
        /* gyenge egyensúly: a + élek komponensein belül nincs − él */
        const P = components(n, E.filter(e => e.s > 0)), weak = E.every(e => e.s > 0 || P.comp[e.a] !== P.comp[e.b]);
        const deg = new Array(n).fill(0); E.forEach(e => { deg[e.a]++; deg[e.b]++; });
        const ncamp = new Set(P.comp.filter((_, i) => deg[i] > 0)).size;   // az él nélküli csúcs (pl. Kl) nem számít külön tábornak
        out.innerHTML = `Háromszögek: +++ ${cnt["+++"]} · +−− ${cnt["+--"]} · ++− <b>${cnt["++-"]}</b> · −−− <b>${cnt["---"]}</b>` +
          (tri.length ? ` → kiegyensúlyozott: ${balT}/${tri.length}` : " (nincs háromszög)") + "<br>" +
          (B.balanced ? "✔ A gráf <b>kiegyensúlyozott</b>: minden kör előjelszorzata $+$, két táborra bontható."
            : `✘ A gráf <b>nem kiegyensúlyozott</b>${tri.some(t => t.prod < 0) ? "" : " – pedig egyetlen feszült háromszöge sincs: egy hosszabb körben van páratlan számú mínusz"}. ` +
              (F ? `Frusztrációs index: <b>${F.k}</b> (ennyi előjelet kell legalább megfordítani).` : "")) +
          `<br>Gyenge egyensúly (Davis): ${weak ? `✔ igen – ${ncamp} tábor (a $+$ élek komponensei)` : "✘ nem – van olyan kör, amelyben pontosan egy mínusz van"}.`;
        const nb = bad.size;
        task.innerHTML = mode !== "camp" ? "Válts <b>tábor</b> módba, és oszd két táborra a szereplőket!" :
          !E.length ? "Nincs él." :
          nb === 0 ? "🎉 Tökéletes beosztás: minden $+$ él táboron belül, minden $-$ él a táborok között fut." :
          `A beosztásod ${nb} élt „sért” (✘: $+$ él a táborok között vagy $-$ él táboron belül).` + (F && nb === F.k ? " Ennél jobb nem lehet: ez a frusztrációs index." : F ? ` A legjobb lehetséges: ${F.k}.` : "");
        math(out); math(task);
      }
      setMode("camp"); load("arvizS"); math(root.querySelector(".w-sub"));
    };
  }
