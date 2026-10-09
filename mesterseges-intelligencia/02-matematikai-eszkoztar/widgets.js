/* =========================================================
   Mesterséges intelligencia 2. fejezet – interaktív szemléltetések
   Minden widget egy  <div class="widget" data-widget="név">  elembe épül.
   A rajzoláshoz az assets/calc.js közös modulját (Calc.canvas, Calc.plot) használjuk.
   ========================================================= */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     Segédfüggvények (az 1. fejezet widgets.js-ének mintájára)
     ------------------------------------------------------------------ */
  const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const fmt = (x, d = 2) => (window.Calc ? Calc.fmt(x, d) : String(x));

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
  const slider = (min, max, step, value) => h("input", { type: "range", min, max, step, value });
  const math = el => window.Synopsis && Synopsis.renderMath(el);

  function header(root, title, sub) {
    root.append(h("div", { class: "w-title" }, title));
    if (sub) root.append(h("p", { class: "w-sub", html: sub }));
  }

  /* nyíl a vásznon (képpont-koordinátákban) */
  function arrow(ctx, x0, y0, x1, y1, color, width = 2.6) {
    const a = Math.atan2(y1 - y0, x1 - x0), L = Math.hypot(x1 - x0, y1 - y0), hd = Math.min(11, L * 0.4);
    ctx.save();
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = width; ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1 - hd * 0.8 * Math.cos(a), y1 - hd * 0.8 * Math.sin(a)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - hd * Math.cos(a - 0.4), y1 - hd * Math.sin(a - 0.4));
    ctx.lineTo(x1 - hd * Math.cos(a + 0.4), y1 - hd * Math.sin(a + 0.4));
    ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  function label(ctx, text, x, y, color, align = "left") {
    ctx.save();
    ctx.font = "600 13px system-ui, sans-serif"; ctx.fillStyle = color;
    ctx.textAlign = align; ctx.textBaseline = "bottom";
    ctx.fillText(text, x, y);
    ctx.restore();
  }
  /* vászon-koordináta egy egéreseményből */
  const evXY = (cv, e) => { const r = cv.c.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };

  const W = {};

  /* ------------------------------------------------------------------
     2.1  pixel-matrix – a kép mint mátrix és mint vektor
     ------------------------------------------------------------------ */
  W["pixel-matrix"] = root => {
    header(root, "Rajzolj képet – és nézd, milyen számokká válik!",
      "Kattints a képpontokra: fehér (0) → szürke (0,5) → fekete (1). Alatta a kép <b>mátrixa</b>, és ugyanez sorról sorra " +
      "<b>vektorrá kiterítve</b> – egy egyszerű modell ezt kapja bemenetként.");
    const N = 5;
    let px = Array(N * N).fill(0);
    const PRESETS = {
      "➕ plusz": [0,0,1,0,0, 0,0,1,0,0, 1,1,1,1,1, 0,0,1,0,0, 0,0,1,0,0],
      "✖ X":     [1,0,0,0,1, 0,1,0,1,0, 0,0,1,0,0, 0,1,0,1,0, 1,0,0,0,1],
      "L betű":  [1,0,0,0,0, 1,0,0,0,0, 1,0,0,0,0, 1,0,0,0,0, 1,1,1,1,0],
      "átmenet": [0,0.5,1,0.5,0, 0,0.5,1,0.5,0, 0,0.5,1,0.5,0, 0,0.5,1,0.5,0, 0,0.5,1,0.5,0]
    };
    const ctr = h("div", { class: "controls" });
    Object.entries(PRESETS).forEach(([k, v]) => ctr.append(btn(k, () => { px = v.slice(); sync(); })));
    ctr.append(btn("🧹 Törlés", () => { px.fill(0); sync(); }));
    const grid = h("div", { class: "pix-grid" });
    const cells = px.map((_, i) => {
      const c = h("button", { class: "pix", type: "button", title: `sor ${Math.floor(i / N) + 1}, oszlop ${i % N + 1}`,
        onclick: () => { px[i] = px[i] === 0 ? 0.5 : px[i] === 0.5 ? 1 : 0; sync(); } });
      grid.append(c); return c;
    });
    const mat = h("div", { class: "pix-mat" });
    const wrap = h("div", { class: "pix-wrap" }, grid, mat);
    const out = h("div", { class: "readout" });
    root.append(ctr, wrap, out);
    const num = v => (v === 0.5 ? "0,5" : String(v));
    function sync() {
      cells.forEach((c, i) => {
        const g = Math.round(255 * (1 - px[i]));
        c.style.background = `rgb(${g},${g},${g})`;
      });
      let t = "<table class='pix-table'>";
      for (let r = 0; r < N; r++) {
        t += "<tr>" + px.slice(r * N, r * N + N).map(v => `<td class="${v ? "on" : ""}">${num(v)}</td>`).join("") + "</tr>";
      }
      mat.innerHTML = t + "</table>";
      const dark = px.filter(v => v > 0).length;
      out.innerHTML = `alak: <b>${N}×${N}</b> mátrix → kiterítve <b>${N * N}</b> elemű vektor<br>` +
        `x = (${px.map(num).join("; ")})<br>` +
        `nem fehér képpontok: <b>${dark}</b> · a képpontok összege (a skaláris szorzat az (1, …, 1) vektorral): <b>${fmt(px.reduce((s, v) => s + v, 0), 1)}</b><br>` +
        `<span class="muted">Színes képnél minden képponthoz 3 szám tartozna (R, G, B): ${N}×${N}×3 = ${N * N * 3} szám.</span>`;
    }
    px = PRESETS["➕ plusz"].slice();
    sync();
  };

  /* ------------------------------------------------------------------
     2.2  matvec – mátrix–vektor szorzat soronként
     ------------------------------------------------------------------ */
  W["matvec"] = root => {
    header(root, "Mátrix–vektor szorzat lépésről lépésre",
      "Írd át a számokat, aztán a <b>Következő sor</b> gombbal nézd végig: az eredmény minden eleme a mátrix egy <b>sorának</b> és a vektornak " +
      "a skaláris szorzata. Két előre beállított példa: a két bolt árai és egy kétneuronos réteg.");
    const PRE = {
      "🛒 két bolt": { A: [[500, 400, 300], [450, 420, 280]], x: [2, 3, 1], rows: ["1. bolt", "2. bolt"] },
      "🧠 neuronréteg": { A: [[0.2, -0.5, 1], [1, 0, -1]], x: [1, 2, 0.5], rows: ["1. neuron", "2. neuron"] }
    };
    let cur = "🛒 két bolt", step = 0;
    const ctr = h("div", { class: "controls" });
    Object.keys(PRE).forEach(k => ctr.append(btn(k, () => { cur = k; build(); })));
    const bNext = btn("▶ Következő sor", () => { step = Math.min(step + 1, 2); show(); }, "btn primary");
    const bReset = btn("↺ Újra", () => { step = 0; show(); });
    ctr.append(bNext, bReset);
    const board = h("div", { class: "mv-board" });
    const out = h("div", { class: "readout" });
    root.append(ctr, board, out);
    let inA = [], inX = [], cellsZ = [];
    const parse = el => { const v = parseFloat(String(el.value).replace(",", ".")); return Number.isFinite(v) ? v : 0; };
    function build() {
      const P = PRE[cur];
      step = 0;
      board.innerHTML = "";
      const tA = h("table", { class: "mv" }), tX = h("table", { class: "mv" }), tZ = h("table", { class: "mv" });
      inA = P.A.map(row => {
        const tr = h("tr");
        const ins = row.map(v => { const i = h("input", { type: "text", value: String(v).replace(".", ","), inputmode: "decimal" }); i.oninput = () => show(); tr.append(h("td", null, i)); return i; });
        tA.append(tr); return ins;
      });
      inX = P.x.map(v => { const i = h("input", { type: "text", value: String(v).replace(".", ","), inputmode: "decimal" }); i.oninput = () => show(); tX.append(h("tr", null, h("td", null, i))); return i; });
      cellsZ = P.A.map(() => { const td = h("td", { class: "z" }, "?"); tZ.append(h("tr", null, td)); return td; });
      board.append(h("div", { class: "mv-col" }, h("small", null, "mátrix (2×3)"), tA), h("span", { class: "mv-op" }, "·"),
        h("div", { class: "mv-col" }, h("small", null, "vektor (3)"), tX), h("span", { class: "mv-op" }, "="),
        h("div", { class: "mv-col" }, h("small", null, "eredmény (2)"), tZ));
      show();
    }
    function show() {
      const P = PRE[cur];
      const A = inA.map(r => r.map(parse)), x = inX.map(parse);
      inA.forEach((r, i) => r.forEach(el => el.parentElement.classList.toggle("hl", i === step - 1)));
      inX.forEach(el => el.parentElement.classList.toggle("hl", step > 0 && step <= 2));
      const lines = [];
      cellsZ.forEach((td, i) => {
        const z = A[i].reduce((s, a, j) => s + a * x[j], 0);
        td.textContent = i < step ? fmt(z, 3) : "?";
        td.classList.toggle("hl", i === step - 1);
        if (i < step) lines.push(`${P.rows[i]}: ${A[i].map((a, j) => `${fmt(a, 3)}·${fmt(x[j], 3)}`).join(" + ")} = <b>${fmt(z, 3)}</b>`);
      });
      out.innerHTML = (lines.length ? lines.join("<br>") : "Nyomd meg a <b>Következő sor</b> gombot!") +
        (step >= 2 ? `<br><span class="muted">Alak: (2×3)·(3) → (2). Két skaláris szorzat egyetlen művelettel.</span>` : "");
    }
    build();
  };

  /* ------------------------------------------------------------------
     2.3  vector-playground – skaláris szorzat, szög, távolság
     ------------------------------------------------------------------ */
  W["vector-playground"] = root => {
    header(root, "Vektorjátszótér: hossz, szög, távolság",
      "Húzd a két vektor végpontját! Figyeld, hogyan változik a <b>skaláris szorzat</b>, a <b>koszinusz-hasonlóság</b> és a <b>távolság</b>. " +
      "Próbáld ki: mikor 0 a skaláris szorzat? Mikor 1 a koszinusz, miközben a távolság nagy?");
    let A = [3, 1], B = [1, 2], snap = true, drag = null;
    const cb = h("input", { type: "checkbox", checked: "" });
    cb.onchange = () => { snap = cb.checked; };
    const ctr = h("div", { class: "controls" },
      h("label", null, cb, "rácsra illesztés (0,5)"),
      btn("egy irányba", () => { A = [2, 1]; B = [4, 2]; draw(); }),
      btn("merőleges", () => { A = [2, 1]; B = [-1, 2]; draw(); }),
      btn("ellentétes", () => { A = [2, 1]; B = [-2, -1]; draw(); }),
      btn("kNN-példa (2.3)", () => { A = [3, 0]; B = [2, 2]; draw(); }));
    root.append(ctr);
    const cv = Calc.canvas(root, 0.62);
    const out = h("div", { class: "readout" });
    root.append(out);
    let T = null;
    const view = () => { const yr = 4.2, xr = yr * cv.w / cv.h; return { xmin: -xr, xmax: xr, ymin: -yr, ymax: yr, xstep: 1, ystep: 1 }; };
    function draw() {
      T = Calc.plot(cv, view(), []);
      const { ctx } = cv, { tx, ty } = T;
      const cA = css("--accent"), cB = css("--setB"), cD = css("--bad");
      // különbségvektor (B → A), szaggatottal
      ctx.save(); ctx.strokeStyle = cD; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(tx(B[0]), ty(B[1])); ctx.lineTo(tx(A[0]), ty(A[1])); ctx.stroke(); ctx.restore();
      // szögív
      const a1 = Math.atan2(A[1], A[0]), a2 = Math.atan2(B[1], B[0]);
      if (Math.hypot(...A) > 0 && Math.hypot(...B) > 0) {
        let d = a2 - a1; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
        ctx.save(); ctx.strokeStyle = css("--muted"); ctx.lineWidth = 1.4; ctx.beginPath();
        ctx.arc(tx(0), ty(0), 26, -a1, -a1 - d, d > 0); ctx.stroke(); ctx.restore();
      }
      arrow(ctx, tx(0), ty(0), tx(A[0]), ty(A[1]), cA);
      arrow(ctx, tx(0), ty(0), tx(B[0]), ty(B[1]), cB);
      [[A, cA, "a"], [B, cB, "b"]].forEach(([P, c, n]) => {
        ctx.beginPath(); ctx.fillStyle = c; ctx.arc(tx(P[0]), ty(P[1]), 7, 0, 2 * Math.PI); ctx.fill();
        label(ctx, n, tx(P[0]) + 9, ty(P[1]) - 6, c);
      });
      const nA = Math.hypot(...A), nB = Math.hypot(...B), dot = A[0] * B[0] + A[1] * B[1];
      const cos = nA && nB ? dot / (nA * nB) : NaN;
      const ang = Number.isFinite(cos) ? Math.acos(Math.max(-1, Math.min(1, cos))) * 180 / Math.PI : NaN;
      const d2 = Math.hypot(A[0] - B[0], A[1] - B[1]), d1 = Math.abs(A[0] - B[0]) + Math.abs(A[1] - B[1]);
      const verdict = !Number.isFinite(cos) ? "nullvektornak nincs iránya" : cos > 0.999 ? "azonos irány" : cos < -0.999 ? "ellentétes irány"
        : Math.abs(cos) < 0.001 ? "merőlegesek" : cos > 0 ? "nagyjából egy irányba mutatnak" : "inkább ellentétes irányba mutatnak";
      out.innerHTML =
        `<span style="color:${cA}">a = (${fmt(A[0], 1)}; ${fmt(A[1], 1)})</span> · <span style="color:${cB}">b = (${fmt(B[0], 1)}; ${fmt(B[1], 1)})</span><br>` +
        `‖a‖₂ = <b>${fmt(nA, 3)}</b> (‖a‖₁ = ${fmt(Math.abs(A[0]) + Math.abs(A[1]), 2)}) · ‖b‖₂ = <b>${fmt(nB, 3)}</b> (‖b‖₁ = ${fmt(Math.abs(B[0]) + Math.abs(B[1]), 2)}) · a·b = <b>${fmt(dot, 2)}</b><br>` +
        `koszinusz-hasonlóság = <b>${Number.isFinite(cos) ? fmt(cos, 3) : "nincs értelmezve"}</b>` +
        (Number.isFinite(ang) ? ` · szög ≈ <b>${fmt(ang, 1)}°</b>` : "") + ` <span class="muted">(${verdict})</span><br>` +
        `<span style="color:${cD}">távolság</span>: euklideszi <b>${fmt(d2, 3)}</b> · Manhattan <b>${fmt(d1, 2)}</b>`;
    }
    cv.draw = draw;
    const c = cv.c;
    c.addEventListener("pointerdown", e => {
      if (!T) return;
      const [px, py] = evXY(cv, e);
      const dA = Math.hypot(px - T.tx(A[0]), py - T.ty(A[1])), dB = Math.hypot(px - T.tx(B[0]), py - T.ty(B[1]));
      drag = dA < 22 && dA <= dB ? A : dB < 22 ? B : null;
      if (drag) { c.setPointerCapture(e.pointerId); e.preventDefault(); }
    });
    c.addEventListener("pointermove", e => {
      if (!drag) { if (T) { const [px, py] = evXY(cv, e); c.style.cursor = Math.min(Math.hypot(px - T.tx(A[0]), py - T.ty(A[1])), Math.hypot(px - T.tx(B[0]), py - T.ty(B[1]))) < 22 ? "grab" : "default"; } return; }
      const [px, py] = evXY(cv, e), v = view();
      let x = T.ix(px), y = T.iy(py);
      if (snap) { x = Math.round(x * 2) / 2; y = Math.round(y * 2) / 2; }
      drag[0] = Math.max(v.xmin + 0.2, Math.min(v.xmax - 0.2, x));
      drag[1] = Math.max(v.ymin + 0.2, Math.min(v.ymax - 0.2, y));
      draw();
    });
    const end = () => { drag = null; };
    c.addEventListener("pointerup", end); c.addEventListener("pointercancel", end);
    draw();
  };

  /* ------------------------------------------------------------------
     2.4  matrix-transform – a 2×2-es mátrix hatása a síkra
     ------------------------------------------------------------------ */
  W["matrix-transform"] = root => {
    header(root, "Mit csinál egy 2×2-es mátrix a síkkal?",
      "Állítsd a mátrix elemeit! A szürke rács az eredeti, a színes a transzformált, a zöld görbe az egységkör képe. A két nyíl az $(1, 0)$ és a $(0, 1)$ képe – " +
      "vagyis a mátrix két oszlopa. Ha van valós <b>sajátirány</b>, szaggatott vonal jelzi: az ezen fekvő vektorok nem fordulnak el, csak nyúlnak.");
    let M = [2, 1, 1, 2];   // a, b, c, d  →  [[a, b], [c, d]]
    const names = ["a", "b", "c", "d"];
    const sl = names.map((n, i) => slider(-3, 3, 0.1, M[i]));
    const lb = names.map(() => h("b"));
    sl.forEach((s, i) => s.addEventListener("input", () => { M[i] = +s.value; sync(); }));
    const PRE = {
      "egység": [1, 0, 0, 1], "nyújtás": [2, 0, 0, 1], "forgatás 90°": [0, -1, 1, 0], "nyírás": [1, 1, 0, 1],
      "szimmetrikus": [2, 1, 1, 2], "tükrözés": [-1, 0, 0, 1], "összenyomás": [1, 2, 2, 4]
    };
    const ctrP = h("div", { class: "controls" });
    Object.entries(PRE).forEach(([k, v]) => ctrP.append(btn(k, () => { M = v.slice(); sync(); })));
    root.append(h("div", { class: "controls" },
      h("label", null, "a =", sl[0], lb[0]), h("label", null, "b =", sl[1], lb[1])),
      h("div", { class: "controls" },
      h("label", null, "c =", sl[2], lb[2]), h("label", null, "d =", sl[3], lb[3])), ctrP);
    const cv = Calc.canvas(root, 0.62);
    const out = h("div", { class: "readout" });
    root.append(out);
    const Ap = ([x, y]) => [M[0] * x + M[1] * y, M[2] * x + M[3] * y];
    function eig() {
      const [a, b, c, d] = M, tr = a + d, det = a * d - b * c, disc = tr * tr / 4 - det;
      if (disc < -1e-9) return { det, list: [] };
      const s = Math.sqrt(Math.max(0, disc)), ls = s < 1e-9 ? [tr / 2] : [tr / 2 + s, tr / 2 - s];
      if (Math.abs(b) < 1e-9 && Math.abs(c) < 1e-9 && Math.abs(a - d) < 1e-9) return { det, all: a, list: [] };
      const list = ls.map(l => {
        let v = Math.abs(b) > 1e-9 ? [b, l - a] : Math.abs(c) > 1e-9 ? [l - d, c] : (Math.abs(l - a) < 1e-9 ? [1, 0] : [0, 1]);
        const n = Math.hypot(...v); return { l, v: [v[0] / n, v[1] / n] };
      });
      return { det, list };
    }
    function draw() {
      const yr = 4.5, xr = yr * cv.w / cv.h;
      const T = Calc.plot(cv, { xmin: -xr, xmax: xr, ymin: -yr, ymax: yr, xstep: 1, ystep: 1 }, []);
      const { ctx } = cv, { tx, ty } = T;
      const acc = css("--accent");
      // transzformált rács
      ctx.save(); ctx.strokeStyle = acc; ctx.globalAlpha = 0.28; ctx.lineWidth = 1;
      for (let i = -8; i <= 8; i++) {
        [[[i, -8], [i, 8]], [[-8, i], [8, i]]].forEach(([p, q]) => {
          const P = Ap(p), Q = Ap(q);
          ctx.beginPath(); ctx.moveTo(tx(P[0]), ty(P[1])); ctx.lineTo(tx(Q[0]), ty(Q[1])); ctx.stroke();
        });
      }
      ctx.restore();
      // az egységnégyzet képe
      const sq = [[0, 0], [1, 0], [1, 1], [0, 1]].map(Ap);
      ctx.save(); ctx.fillStyle = acc; ctx.globalAlpha = 0.18; ctx.beginPath();
      sq.forEach(([x, y], i) => (i ? ctx.lineTo(tx(x), ty(y)) : ctx.moveTo(tx(x), ty(y))));
      ctx.closePath(); ctx.fill(); ctx.restore();
      // az egységkör képe
      ctx.save(); ctx.strokeStyle = css("--setC"); ctx.lineWidth = 1.8; ctx.beginPath();
      for (let k = 0; k <= 100; k++) { const t = 2 * Math.PI * k / 100, [x, y] = Ap([Math.cos(t), Math.sin(t)]); k ? ctx.lineTo(tx(x), ty(y)) : ctx.moveTo(tx(x), ty(y)); }
      ctx.stroke(); ctx.restore();
      // sajátirányok
      const E = eig();
      E.list.forEach(({ l, v }) => {
        ctx.save(); ctx.strokeStyle = css("--bad"); ctx.setLineDash([6, 5]); ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(tx(-10 * v[0]), ty(-10 * v[1])); ctx.lineTo(tx(10 * v[0]), ty(10 * v[1])); ctx.stroke(); ctx.restore();
        const k = Math.min(3.6, Math.max(1.2, Math.abs(l) + 0.4));
        label(ctx, "λ = " + fmt(l, 2), tx(k * v[0]) + 6, ty(k * v[1]) - 4, css("--bad"));
      });
      const e1 = Ap([1, 0]), e2 = Ap([0, 1]);
      arrow(ctx, tx(0), ty(0), tx(e1[0]), ty(e1[1]), css("--accent"));
      arrow(ctx, tx(0), ty(0), tx(e2[0]), ty(e2[1]), css("--setB"));
      label(ctx, "A·(1, 0)", tx(e1[0]) + 6, ty(e1[1]) - 4, css("--accent"));
      label(ctx, "A·(0, 1)", tx(e2[0]) + 6, ty(e2[1]) - 4, css("--setB"));
      return E;
    }
    cv.draw = draw;
    function sync() {
      sl.forEach((s, i) => { s.value = M[i]; lb[i].textContent = fmt(M[i], 1); });
      const E = draw();
      const ev = E.all != null ? `minden irány sajátirány (λ = ${fmt(E.all, 2)}): a mátrix egyformán nagyít mindenfelé`
        : E.list.length ? E.list.map(({ l, v }) => `λ = <b>${fmt(l, 2)}</b>, irány ≈ (${fmt(v[0], 2)}; ${fmt(v[1], 2)})`).join(" · ")
        : "nincs valós sajátirány – a mátrix minden vektort elforgat";
      out.innerHTML = `A = [[${fmt(M[0], 1)}; ${fmt(M[1], 1)}], [${fmt(M[2], 1)}; ${fmt(M[3], 1)}]] · ` +
        `A·(1, 0) = (${fmt(M[0], 1)}; ${fmt(M[2], 1)}) · A·(0, 1) = (${fmt(M[1], 1)}; ${fmt(M[3], 1)})<br>` +
        `sajátértékek: ${ev}<br>` +
        `<span class="muted">területszorzó (determináns): ${fmt(E.det, 2)}${Math.abs(E.det) < 1e-9 ? " – a sík egy egyenesre lapul" : E.det < 0 ? " – negatív: a transzformáció tükröz is" : ""}</span>`;
    }
    sync();
  };

  /* ------------------------------------------------------------------
     2.5  softmax-bars – pontszámokból valószínűség, hőmérséklettel
     ------------------------------------------------------------------ */
  W["softmax-bars"] = root => {
    header(root, "Softmax: pontszámokból valószínűség",
      "Állítsd a három osztály pontszámát (logitját) és a <b>hőmérsékletet</b>! Figyeld meg: ha minden pontszámhoz ugyanannyit adsz, " +
      "a valószínűségek nem változnak; alacsony hőmérsékleten a legnagyobb „mindent visz”, magason az eloszlás kiegyenlítődik.");
    const names = ["macska", "kutya", "ház"];
    let z = [2, 1, 0], T = 1;
    const sz = z.map(v => slider(-4, 4, 0.1, v)), lz = z.map(() => h("b"));
    const sT = slider(0.1, 5, 0.1, T), lT = h("b");
    sz.forEach((s, i) => s.addEventListener("input", () => { z[i] = +s.value; sync(); }));
    sT.addEventListener("input", () => { T = +sT.value; sync(); });
    root.append(h("div", { class: "controls" }, ...names.map((n, i) => h("label", null, `z(${n}) =`, sz[i], lz[i]))),
      h("div", { class: "controls" }, h("label", null, "hőmérséklet T =", sT, lT),
        btn("minden pontszámhoz +1", () => { z = z.map(v => Math.min(4, v + 1)); sync(); }),
        btn("T = 1", () => { T = 1; sync(); }),
        btn("alap: (2; 1; 0)", () => { z = [2, 1, 0]; T = 1; sync(); })));
    const bars = h("div", { class: "bars" });
    const rows = names.map(n => {
      const bar = h("div", { class: "bar" }), val = h("span", { class: "bar-val" });
      bars.append(h("div", { class: "bar-row" }, h("span", { class: "bar-lab" }, n), h("div", { class: "bar-track" }, bar), val));
      return { bar, val };
    });
    const out = h("div", { class: "readout" });
    root.append(bars, out);
    function sync() {
      sz.forEach((s, i) => { s.value = z[i]; lz[i].textContent = fmt(z[i], 1); });
      sT.value = T; lT.textContent = fmt(T, 1);
      const m = Math.max(...z), e = z.map(v => Math.exp((v - m) / T)), S = e.reduce((a, b) => a + b, 0), p = e.map(v => v / S);
      rows.forEach(({ bar, val }, i) => { bar.style.width = (100 * p[i]).toFixed(1) + "%"; val.textContent = fmt(p[i], 3); });
      const raw = z.map(v => Math.exp(v / T)), rawS = raw.reduce((a, b) => a + b, 0);
      const H = -p.reduce((s, q) => s + (q > 0 ? q * Math.log2(q) : 0), 0);
      out.innerHTML = `z/T = (${z.map(v => fmt(v / T, 2)).join("; ")})<br>` +
        `e^(z/T) = (${raw.map(v => fmt(v, 3)).join("; ")}), összegük ${fmt(rawS, 3)}<br>` +
        `p = (${p.map(v => fmt(v, 3)).join("; ")}) · összeg: 1 · entrópia: ${fmt(H, 3)} bit <span class="muted">(max. ${fmt(Math.log2(3), 3)})</span>`;
    }
    sync();
  };

  /* ------------------------------------------------------------------
     2.6  entropy-bars – entrópia, keresztentrópia, KL-divergencia
     ------------------------------------------------------------------ */
  W["entropy-bars"] = root => {
    header(root, "Entrópia, keresztentrópia, KL-divergencia",
      "Bal oldalt a <b>valódi</b> eloszlás ($p$), jobb oldalt a <b>modell</b> becslése ($q$), négy kimenetre. A csúszkák súlyokat állítanak, " +
      "ezeket a szemléltetés 1-re normálja. Figyeld meg: $H(p, q) \\ge H(p)$, és a különbség, a KL-divergencia, csak akkor 0, ha $q = p$.");
    const K = 4, lab = ["A", "B", "C", "D"];
    let wp = [9, 1, 0, 0], wq = [5, 5, 0, 0], unit = "bit";
    const mk = arr => arr.map(v => slider(0, 10, 0.5, v));
    const sp = mk(wp), sq = mk(wq);
    sp.forEach((s, i) => s.addEventListener("input", () => { wp[i] = +s.value; sync(); }));
    sq.forEach((s, i) => s.addEventListener("input", () => { wq[i] = +s.value; sync(); }));
    const P = {
      "egyenletes": [1, 1, 1, 1], "egy biztos": [1, 0, 0, 0], "ferde": [4, 2, 1, 1], "cinkelt érme": [9, 1, 0, 0], "szabályos érme": [1, 1, 0, 0]
    };
    const presets = (set) => Object.entries(P).map(([k, v]) => btn(k, () => { set(v.slice()); sync(); }));
    const uBtn = btn("egység: bit", () => { unit = unit === "bit" ? "nat" : "bit"; uBtn.textContent = "egység: " + unit; sync(); });
    const colP = h("div", { class: "ent-col" }, h("div", { class: "w-sub" }, h("b", null, "valódi eloszlás p")),
      ...sp.map((s, i) => h("label", { class: "ent-lab" }, lab[i], s)), h("div", { class: "controls" }, ...presets(v => { wp = v; })));
    const colQ = h("div", { class: "ent-col" }, h("div", { class: "w-sub" }, h("b", null, "modell becslése q")),
      ...sq.map((s, i) => h("label", { class: "ent-lab" }, lab[i], s)), h("div", { class: "controls" }, ...presets(v => { wq = v; }),
        btn("q = p", () => { wq = wp.slice(); sync(); })));
    root.append(h("div", { class: "two-col" }, colP, colQ), h("div", { class: "controls" }, uBtn));
    const bars = h("div", { class: "bars" });
    const rows = lab.map(n => {
      const bp = h("div", { class: "bar" }), bq = h("div", { class: "bar q" }), val = h("span", { class: "bar-val" });
      bars.append(h("div", { class: "bar-row" }, h("span", { class: "bar-lab" }, n),
        h("div", { class: "bar-track double" }, bp, bq), val));
      return { bp, bq, val };
    });
    const out = h("div", { class: "readout" });
    root.append(bars, out);
    const norm = w => { const s = w.reduce((a, b) => a + b, 0); return s > 0 ? w.map(v => v / s) : w.map(() => 1 / K); };
    function sync() {
      sp.forEach((s, i) => (s.value = wp[i])); sq.forEach((s, i) => (s.value = wq[i]));
      const p = norm(wp), q = norm(wq), lg = unit === "bit" ? Math.log2 : Math.log;
      rows.forEach(({ bp, bq, val }, i) => {
        bp.style.width = (100 * p[i]).toFixed(1) + "%"; bq.style.width = (100 * q[i]).toFixed(1) + "%";
        val.textContent = `${fmt(p[i], 2)} | ${fmt(q[i], 2)}`;
      });
      const Hp = -p.reduce((s, x) => s + (x > 0 ? x * lg(x) : 0), 0);
      const Hq = -q.reduce((s, x) => s + (x > 0 ? x * lg(x) : 0), 0);
      let CE = 0, inf = false;
      p.forEach((x, i) => { if (x > 0) { if (q[i] <= 0) inf = true; else CE -= x * lg(q[i]); } });
      let KLqp = 0, infR = false;
      q.forEach((x, i) => { if (x > 0) { if (p[i] <= 0) infR = true; else KLqp += x * lg(x / p[i]); } });
      const f = v => fmt(v, 3);
      out.innerHTML = `<span style="color:${css("--accent")}">■ p</span> = (${p.map(v => fmt(v, 3)).join("; ")}) · ` +
        `<span style="color:${css("--setB")}">■ q</span> = (${q.map(v => fmt(v, 3)).join("; ")})<br>` +
        `H(p) = <b>${f(Hp)}</b> ${unit} · H(q) = ${f(Hq)} ${unit} <span class="muted">(max. ${f(lg(K))})</span><br>` +
        `keresztentrópia H(p, q) = <b>${inf ? "∞" : f(CE)}</b> ${unit} · KL(p‖q) = <b>${inf ? "∞" : f(CE - Hp)}</b> ${unit} · KL(q‖p) = ${infR ? "∞" : f(KLqp)} ${unit}` +
        (inf ? `<br><span class="muted">∞: a modell 0 valószínűséget ad egy olyan kimenetre, amely a valóságban előfordul – végtelen büntetés.</span>` : "") +
        `<br><span class="muted">perplexitás (2^H(p, q), illetve e^H(p, q)): ${inf ? "∞" : f(unit === "bit" ? 2 ** CE : Math.exp(CE))}</span>`;
    }
    sync();
  };

  /* ------------------------------------------------------------------
     2.7  tangent-slope – szelőből érintő
     ------------------------------------------------------------------ */
  W["tangent-slope"] = root => {
    header(root, "Szelőből érintő: a derivált mint meredekség",
      "Válassz függvényt, állítsd a pontot ($w$) és a lépést ($h$)! A szaggatott <b>szelő</b> meredeksége $\\frac{f(w + h) - f(w)}{h}$; " +
      "ahogy $h$ csökken, a szelő rásimul a folytonos <b>érintőre</b>, amelynek meredeksége $f'(w)$.");
    const F = {
      "w²": { f: w => w * w, d: w => 2 * w, v: [-1.5, 5, -2, 20], w0: 3 },
      "(w − 3)²": { f: w => (w - 3) ** 2, d: w => 2 * (w - 3), v: [-1, 7, -2, 14], w0: 1 },
      "eʷ": { f: Math.exp, d: Math.exp, v: [-3, 3, -1, 12], w0: 0 },
      "w³ − 3w": { f: w => w ** 3 - 3 * w, d: w => 3 * w * w - 3, v: [-2.6, 2.6, -5, 5], w0: 0.5 }
    };
    const HS = [2, 1, 0.5, 0.2, 0.1, 0.05, 0.01];
    let key = "w²", w0 = 3, hi = 1;
    const sel = h("select");
    Object.keys(F).forEach(k => sel.append(h("option", { value: k }, k)));
    sel.onchange = () => { key = sel.value; w0 = F[key].w0; sync(); };
    const sw = slider(-3, 6, 0.05, w0), lw = h("b"), sh = slider(0, HS.length - 1, 1, hi), lh = h("b");
    sw.addEventListener("input", () => { w0 = +sw.value; sync(); });
    sh.addEventListener("input", () => { hi = +sh.value; sync(); });
    root.append(h("div", { class: "controls" }, h("label", null, "f(w) =", sel), h("label", null, "w =", sw, lw), h("label", null, "h =", sh, lh)));
    const cv = Calc.canvas(root, 0.55);
    const out = h("div", { class: "readout" });
    root.append(out);
    function draw() {
      const G = F[key], [a, b, c, d] = G.v, hh = HS[hi];
      const y0 = G.f(w0), m = G.d(w0), ms = (G.f(w0 + hh) - y0) / hh;
      Calc.plot(cv, { xmin: a, xmax: b, ymin: c, ymax: d, xname: "w", yname: "f(w)" }, [
        { f: G.f, color: "--accent" },
        { f: x => y0 + ms * (x - w0), color: "--bad", dash: [6, 5], width: 1.8 },
        { f: x => y0 + m * (x - w0), color: "--setB", width: 2 },
        { points: [[w0, y0]], color: "--setB" },
        { points: [[w0 + hh, G.f(w0 + hh)]], color: "--bad", open: true }
      ]);
      return { m, ms, hh };
    }
    cv.draw = draw;
    function sync() {
      const G = F[key];
      sw.min = G.v[0] + 0.1; sw.max = G.v[1] - 0.1; sw.value = w0; sel.value = key;
      lw.textContent = fmt(w0, 2); lh.textContent = fmt(HS[hi], 2);
      const { m, ms, hh } = draw();
      out.innerHTML = `szelő meredeksége (h = ${fmt(hh, 2)}): <b>${fmt(ms, 4)}</b><br>` +
        `érintő meredeksége f′(${fmt(w0, 2)}) = <b>${fmt(m, 4)}</b> · eltérés: ${fmt(ms - m, 4)}<br>` +
        `<span class="muted">${Math.abs(m) < 0.02 ? "A derivált ≈ 0: vízszintes érintő – itt lehet minimum vagy maximum." : m > 0 ? "f′ > 0: a függvény itt nő – a minimum felé balra kell lépni." : "f′ < 0: a függvény itt csökken – a minimum felé jobbra kell lépni."}</span>`;
    }
    sync();
  };

  /* ------------------------------------------------------------------
     2.8  gradient-1d – gradiens módszer egy paraméterrel
     ------------------------------------------------------------------ */
  W["gradient-1d"] = root => {
    header(root, "Gradiens módszer: gurulj le a lejtőn!",
      "Állítsd a tanulási rátát ($\\eta$) és a kezdőpontot, aztán lépj! Minden lépés: $w \\leftarrow w - \\eta\\, L'(w)$. " +
      "Próbáld ki az $\\eta = 0{,}1$, $0{,}5$, $1$ és $1{,}1$ értéket a parabolán – és a „két völgy” függvényt különböző kezdőpontokból.");
    const F = {
      "parabola: (w − 3)²": { f: w => (w - 3) ** 2, d: w => 2 * (w - 3), v: [-5, 11, -4, 66], w0: 0, eta: 0.1, rng: [-4, 10] },
      "két völgy: 0,25w⁴ − w² + 0,4w": { f: w => 0.25 * w ** 4 - w * w + 0.4 * w, d: w => w ** 3 - 2 * w + 0.4, v: [-2.6, 2.6, -2.2, 3], w0: 2.2, eta: 0.05, rng: [-2.4, 2.4] }
    };
    let key = Object.keys(F)[0], eta = 0.1, w0 = 0, path = [], timer = null;
    const sel = h("select");
    Object.keys(F).forEach(k => sel.append(h("option", { value: k }, k)));
    sel.onchange = () => { stop(); key = sel.value; eta = F[key].eta; w0 = F[key].w0; reset(); };
    const se = slider(0.01, 1.2, 0.01, eta), le = h("b"), sw = slider(-4, 10, 0.1, w0), lw = h("b");
    se.addEventListener("input", () => { eta = +se.value; reset(); });
    sw.addEventListener("input", () => { w0 = +sw.value; reset(); });
    const bStep = btn("➜ Egy lépés", () => { stop(); step(); }, "btn primary");
    const bRun = btn("▶ Futtatás", () => run());
    root.append(h("div", { class: "controls" }, h("label", null, "L(w) =", sel)),
      h("div", { class: "controls" }, h("label", null, "η =", se, le), h("label", null, "kezdőpont w₀ =", sw, lw)),
      h("div", { class: "controls" }, bStep, bRun, btn("↺ Újra", () => { stop(); reset(); })));
    const cv = Calc.canvas(root, 0.55);
    const out = h("div", { class: "readout" });
    root.append(out);
    function draw() {
      const G = F[key], [a, b, c, d] = G.v;
      const T = Calc.plot(cv, { xmin: a, xmax: b, ymin: c, ymax: d, xname: "w", yname: "L(w)" }, [{ f: G.f, color: "--accent" }]);
      const { ctx } = cv, { tx, ty } = T;
      const vis = path.filter(w => Math.abs(w) < 1e3);
      ctx.save(); ctx.strokeStyle = css("--bad"); ctx.lineWidth = 1.5;
      for (let i = 1; i < vis.length; i++) {
        const [p, q] = [vis[i - 1], vis[i]];
        ctx.beginPath(); ctx.moveTo(tx(p), ty(Math.min(d * 1.5, G.f(p)))); ctx.lineTo(tx(q), ty(Math.min(d * 1.5, G.f(q)))); ctx.stroke();
      }
      vis.forEach((w, i) => {
        ctx.beginPath(); ctx.fillStyle = i === vis.length - 1 ? css("--setB") : css("--bad");
        ctx.arc(tx(w), ty(Math.min(d * 1.5, G.f(w))), i === vis.length - 1 ? 6 : 3.5, 0, 2 * Math.PI); ctx.fill();
      });
      ctx.restore();
    }
    cv.draw = draw;
    function info() {
      const G = F[key], w = path[path.length - 1], k = path.length - 1;
      se.value = eta; le.textContent = fmt(eta, 2);
      sw.min = G.rng[0]; sw.max = G.rng[1]; sw.value = w0; lw.textContent = fmt(w0, 1); sel.value = key;
      const div = !Number.isFinite(w) || Math.abs(w) > 1e3;
      const last = path.slice(-6).map(x => fmt(x, 3)).join(" → ");
      let note = "";
      if (div) note = "💥 Szétszállt! A tanulási ráta túl nagy.";
      else if (k > 0 && Math.abs(G.d(w)) < 1e-3) note = "✅ Megállt: a derivált ≈ 0.";
      else if (key.startsWith("parabola")) {
        const r = 1 - 2 * eta;
        note = `Ennél a függvénynél a távolság a 3-tól lépésenként ${fmt(r, 2)}-szorosára változik: ` +
          (Math.abs(r) < 1e-9 ? "egy lépésben célba ér." : Math.abs(r) < 1 ? (r > 0 ? "egyenletesen közelít." : "oszcillálva közelít.") : Math.abs(r - (-1)) < 1e-9 ? "örökké pattog." : "egyre távolodik.");
      }
      out.innerHTML = `lépés: <b>${k}</b> · w = <b>${div ? "∞" : fmt(w, 4)}</b> · L′(w) = ${div ? "–" : fmt(G.d(w), 4)} · L(w) = <b>${div ? "∞" : fmt(G.f(w), 4)}</b><br>` +
        `pálya: ${path.length > 6 ? "… → " : ""}${last}<br><span class="muted">${note}</span>`;
      return div;
    }
    function reset() { path = [w0]; draw(); info(); }
    function step() {
      const G = F[key], w = path[path.length - 1];
      if (!Number.isFinite(w) || Math.abs(w) > 1e3) return true;
      path.push(w - eta * G.d(w));
      draw();
      const div = info();
      return div || Math.abs(G.d(path[path.length - 1])) < 1e-3;
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; bRun.textContent = "▶ Futtatás"; } }
    function run() {
      if (timer) return stop();
      bRun.textContent = "⏸ Állj!";
      let n = 0;
      timer = setInterval(() => { if (step() || ++n >= 60) stop(); }, 220);
    }
    eta = F[key].eta; w0 = F[key].w0;
    reset();
  };

  /* ------------------------------------------------------------------
     2.8  gradient-2d – gradiens módszer két paraméterrel
     ------------------------------------------------------------------ */
  W["gradient-2d"] = root => {
    header(root, "Gradiens módszer két paraméterrel: a hosszúkás tál",
      "A veszteség $L(x, y) = x^2 + k\\,y^2$; az ellipszisek a szintvonalak. <b>Kattints</b> a síkra a kezdőpont kijelöléséhez, aztán lépj! " +
      "Növeld $k$-t (hosszúkásabb tál) vagy $\\eta$-t, és figyeld a zegzugot – a meredek $y$ irány szabja meg, mekkora lehet a lépés.");
    let k = 3, eta = 0.1, start = [2, 1], path = [], timer = null;
    const sk = slider(1, 10, 0.5, k), lk = h("b"), se = slider(0.01, 0.6, 0.01, eta), le = h("b");
    sk.addEventListener("input", () => { k = +sk.value; reset(); });
    se.addEventListener("input", () => { eta = +se.value; reset(); });
    const bRun = btn("▶ Futtatás", () => run());
    root.append(h("div", { class: "controls" }, h("label", null, "k =", sk, lk), h("label", null, "η =", se, le)),
      h("div", { class: "controls" }, btn("➜ Egy lépés", () => { stop(); step(); }, "btn primary"), bRun,
        btn("↺ Újra", () => { stop(); reset(); }), btn("a szöveg példája", () => { stop(); k = 3; eta = 0.1; start = [2, 1]; reset(); })));
    const cv = Calc.canvas(root, 0.62);
    const out = h("div", { class: "readout" });
    root.append(out);
    const L = ([x, y]) => x * x + k * y * y, G = ([x, y]) => [2 * x, 2 * k * y];
    let T = null;
    const view = () => { const yr = 2.4, xr = yr * cv.w / cv.h; return { xmin: -xr, xmax: xr, ymin: -yr, ymax: yr, xstep: 1, ystep: 1 }; };
    function draw() {
      T = Calc.plot(cv, view(), []);
      const { ctx } = cv, { tx, ty } = T;
      ctx.save(); ctx.strokeStyle = css("--accent"); ctx.lineWidth = 1.2;
      [0.25, 1, 2.25, 4, 6.25, 9, 12.25, 16].forEach((c, i) => {
        ctx.globalAlpha = 0.85 - i * 0.08;
        ctx.beginPath();
        for (let j = 0; j <= 120; j++) {
          const t = 2 * Math.PI * j / 120, x = Math.sqrt(c) * Math.cos(t), y = Math.sqrt(c / k) * Math.sin(t);
          j ? ctx.lineTo(tx(x), ty(y)) : ctx.moveTo(tx(x), ty(y));
        }
        ctx.stroke();
      });
      ctx.restore();
      const vis = path.filter(p => Math.abs(p[0]) < 50 && Math.abs(p[1]) < 50);
      ctx.save(); ctx.strokeStyle = css("--bad"); ctx.lineWidth = 1.6; ctx.beginPath();
      vis.forEach(([x, y], i) => (i ? ctx.lineTo(tx(x), ty(y)) : ctx.moveTo(tx(x), ty(y))));
      ctx.stroke();
      vis.forEach(([x, y], i) => {
        ctx.beginPath(); ctx.fillStyle = i === vis.length - 1 ? css("--setB") : css("--bad");
        ctx.arc(tx(x), ty(y), i === vis.length - 1 ? 6 : 3.2, 0, 2 * Math.PI); ctx.fill();
      });
      ctx.restore();
      const cur = path[path.length - 1];
      if (cur && Math.abs(cur[0]) < 50 && Math.abs(cur[1]) < 50) {
        const g = G(cur), n = Math.hypot(...g);
        if (n > 1e-6) {
          const s = Math.min(0.9, 0.25 * n) / n;
          arrow(ctx, tx(cur[0]), ty(cur[1]), tx(cur[0] - s * g[0]), ty(cur[1] - s * g[1]), css("--setB"), 2);
        }
      }
    }
    cv.draw = draw;
    function info() {
      sk.value = k; lk.textContent = fmt(k, 1); se.value = eta; le.textContent = fmt(eta, 2);
      const p = path[path.length - 1], g = G(p), n = path.length - 1;
      const fx = 1 - 2 * eta, fy = 1 - 2 * k * eta;
      const desc = f => (Math.abs(f) < 1 ? (f >= 0 ? "közelít" : "cikcakkban közelít") : Math.abs(f + 1) < 1e-9 ? "pattog" : "szétszáll");
      const big = Math.abs(p[0]) > 1e3 || Math.abs(p[1]) > 1e3;
      out.innerHTML = `lépés: <b>${n}</b> · pont: (${big ? "∞" : fmt(p[0], 3) + "; " + fmt(p[1], 3)}) · ∇L = (${big ? "–" : fmt(g[0], 3) + "; " + fmt(g[1], 3)}) · L = <b>${big ? "∞" : fmt(L(p), 4)}</b><br>` +
        `szorzó lépésenként: x irányban ${fmt(fx, 2)} (${desc(fx)}), y irányban ${fmt(fy, 2)} (${desc(fy)})<br>` +
        `<span class="muted">Stabil, ha η &lt; 1/k = ${fmt(1 / k, 3)} (a meredek y irány miatt); az x irány η &lt; 1-et engedne.</span>`;
      return big;
    }
    function reset() { path = [start.slice()]; draw(); info(); }
    function step() {
      const p = path[path.length - 1], g = G(p);
      if (Math.abs(p[0]) > 1e3 || Math.abs(p[1]) > 1e3) return true;
      path.push([p[0] - eta * g[0], p[1] - eta * g[1]]);
      draw();
      const big = info(), q = path[path.length - 1];
      return big || Math.hypot(...G(q)) < 1e-3;
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; bRun.textContent = "▶ Futtatás"; } }
    function run() {
      if (timer) return stop();
      bRun.textContent = "⏸ Állj!";
      let n = 0;
      timer = setInterval(() => { if (step() || ++n >= 60) stop(); }, 200);
    }
    cv.c.addEventListener("pointerdown", e => {
      if (!T) return;
      const [px, py] = evXY(cv, e);
      stop();
      start = [Math.round(T.ix(px) * 10) / 10, Math.round(T.iy(py) * 10) / 10];
      reset();
    });
    reset();
  };

  /* ------------------------------------------------------------------
     Indítás (a calc.js-t is defer-rel töltjük, ezért DOMContentLoaded után)
     ------------------------------------------------------------------ */
  function init() {
    document.querySelectorAll(".widget[data-widget]").forEach(root => {
      const f = W[root.dataset.widget];
      if (!f) return;
      try { f(root); math(root); }
      catch (e) { root.append(h("p", { class: "muted" }, "Hiba a szemléltetés betöltésekor: " + e.message)); console.error(e); }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
