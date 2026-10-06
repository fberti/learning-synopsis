/* =========================================================
   2. fejezet – interaktív szemléltetések
   Minden widget egy  <div class="widget" data-widget="név">  elembe épül.
   ========================================================= */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     Segédfüggvények (az 1. fejezet mintájára)
     ------------------------------------------------------------------ */
  const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const fmt = (x, d = 4) => (isFinite(x) ? x.toFixed(d).replace(".", ",") : "–");
  const pct = (x, d = 1) => fmt(x * 100, d) + "%";
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const frac = (k, n) => { const g = gcd(k, n) || 1; return n / g === 1 ? String(k / g) : `${k / g}/${n / g}`; };
  const fracT = (k, n) => (n === 0 ? "\\text{–}" : frac(k, n).replace(/^(\d+)\/(\d+)$/, "\\tfrac{$1}{$2}"));
  const num = (x, d = 4) => fmt(x, d).replace(",", "{,}"); // tizedesvessző KaTeX-ben
  const tex = (s, display) => (window.katex ? katex.renderToString(s, { throwOnError: false, displayMode: !!display }) : s);
  const rnd = n => Math.floor(Math.random() * n);
  const render = el => window.Synopsis && Synopsis.renderMath(el);

  /* BigInt-tört egyszerűsítése */
  const bgcd = (a, b) => { a = a < 0n ? -a : a; while (b) [a, b] = [b, a % b]; return a; };
  const bfracT = (p, q) => { const g = bgcd(p, q) || 1n; p /= g; q /= g; return q === 1n ? String(p) : `\\tfrac{${p}}{${q}}`; };

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

  /* Canvas HiDPI-kezeléssel; a rajzoló függvényt téma- és méretváltáskor újrahívjuk */
  const redrawers = [];
  function makeCanvas(parent, aspect, maxW = 760) {
    const c = h("canvas");
    parent.append(c);
    const obj = { c, ctx: c.getContext("2d"), w: 0, h: 0, draw: null };
    obj.resize = () => {
      const w = Math.min(maxW, parent.clientWidth || maxW);
      const hh = Math.round(w * aspect);
      const dpr = window.devicePixelRatio || 1;
      c.width = Math.round(w * dpr); c.height = Math.round(hh * dpr);
      c.style.width = w + "px"; c.style.height = hh + "px";
      obj.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      obj.w = w; obj.h = hh; obj.dpr = dpr;
    };
    obj.resize();
    redrawers.push(() => { obj.resize(); obj.draw && obj.draw(); });
    return obj;
  }
  let rT;
  addEventListener("resize", () => { clearTimeout(rT); rT = setTimeout(() => redrawers.forEach(f => f()), 150); });
  new MutationObserver(() => redrawers.forEach(f => f())).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  /* Tengelyes diagram rajzolása */
  function axes(ctx, box, { xmin, xmax, ymin, ymax, xticks = [], yticks = [], xlabel = "", ylabel = "" }) {
    const { x0, y0, x1, y1 } = box;
    const tx = v => x0 + (v - xmin) / (xmax - xmin) * (x1 - x0);
    const ty = v => y1 - (v - ymin) / (ymax - ymin) * (y1 - y0);
    ctx.strokeStyle = css("--border"); ctx.fillStyle = css("--muted"); ctx.lineWidth = 1;
    ctx.font = "11px system-ui, sans-serif";
    ctx.textAlign = "right"; ctx.textBaseline = "middle";
    yticks.forEach(v => {
      ctx.beginPath(); ctx.moveTo(x0, ty(v)); ctx.lineTo(x1, ty(v)); ctx.stroke();
      ctx.fillText(String(v).replace(".", ","), x0 - 5, ty(v));
    });
    ctx.textAlign = "center"; ctx.textBaseline = "top";
    xticks.forEach(v => ctx.fillText(String(v).replace(".", ","), tx(v), y1 + 5));
    ctx.strokeStyle = css("--muted");
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.lineTo(x1, y1); ctx.stroke();
    if (xlabel) { ctx.textAlign = "right"; ctx.fillText(xlabel, x1, y1 + 20); }
    if (ylabel) { ctx.textAlign = "left"; ctx.textBaseline = "bottom"; ctx.fillText(ylabel, x0 + 4, y0 - 4); }
    return { tx, ty };
  }

  const W = {}; // widget-regiszter

  /* ------------------------------------------------------------------
     2.1  Feltételes valószínűség két kockával – szűkített eseménytér
     ------------------------------------------------------------------ */
  const DICE_EV = [
    ["összeg = 6", (a, b) => a + b === 6],
    ["összeg = 7", (a, b) => a + b === 7],
    ["összeg = 8", (a, b) => a + b === 8],
    ["összeg ≥ 10", (a, b) => a + b >= 10],
    ["összeg páros", (a, b) => (a + b) % 2 === 0],
    ["legalább egy 2-es", (a, b) => a === 2 || b === 2],
    ["legalább egy 5-ös", (a, b) => a === 5 || b === 5],
    ["legalább egy 6-os", (a, b) => a === 6 || b === 6],
    ["a piros kocka 5-ös", a => a === 5],
    ["a piros kocka 6-os", a => a === 6],
    ["a piros kocka páros", a => a % 2 === 0],
    ["a kék kocka páros", (a, b) => b % 2 === 0],
    ["dupla (a két szám egyenlő)", (a, b) => a === b],
    ["a piros nagyobb, mint a kék", (a, b) => a > b],
    ["szorzat páros", (a, b) => (a * b) % 2 === 0]
  ];
  const evIdx = name => DICE_EV.findIndex(e => e[0] === name);
  W["cond-dice"] = root => {
    header(root, "Feltételes valószínűség két kockával",
      "Sorok: a <b>piros</b>, oszlopok: a <b>kék</b> kocka. Válaszd ki az <span class='chip a'>A</span> eseményt és a <span class='chip b'>B</span> feltételt! Ha a feltétel be van kapcsolva, a $B$-n kívüli cellák elhalványulnak – ezek már nem jöhetnek szóba.");
    const mk = def => { const s = h("select"); DICE_EV.forEach(([l], i) => s.append(h("option", { value: i }, l))); s.value = def; return s; };
    const sA = mk(evIdx("legalább egy 2-es")), sB = mk(evIdx("összeg = 6"));
    const cond = h("input", { type: "checkbox", checked: "" });
    root.append(h("div", { class: "controls" }, h("label", null, "A: ", sA), h("label", null, "B (feltétel): ", sB), h("label", null, cond, "tudjuk, hogy B bekövetkezett")));
    const presets = [
      ["Obádovics 1. példa", "legalább egy 2-es", "összeg = 6"],
      ["V.2.1 a)", "összeg ≥ 10", "a piros kocka 5-ös"],
      ["V.2.1 b)", "összeg ≥ 10", "legalább egy 5-ös"],
      ["Meglepő függetlenség", "összeg = 7", "a piros kocka 6-os"],
      ["Kizáró ≠ független", "összeg = 7", "dupla (a két szám egyenlő)"]
    ];
    root.append(h("div", { class: "controls" }, "Példák: ", ...presets.map(([l, a, b]) => btn(l, () => { sA.value = evIdx(a); sB.value = evIdx(b); cond.checked = true; upd(); }))));
    const grid = h("div", { class: "grid36" });
    grid.append(h("div", { class: "hd" }, ""));
    for (let j = 1; j <= 6; j++) grid.append(h("div", { class: "hd", style: "color:var(--setA)" }, j));
    const cells = [];
    for (let i = 1; i <= 6; i++) {
      grid.append(h("div", { class: "hd", style: "color:var(--bad)" }, i));
      for (let j = 1; j <= 6; j++) { const c = h("div", { class: "cell" }, i + j); cells.push([i, j, c]); grid.append(c); }
    }
    root.append(grid);
    const out = h("div", { class: "readout" });
    root.append(out);
    function upd() {
      const fA = DICE_EV[sA.value][1], fB = DICE_EV[sB.value][1];
      let nA = 0, nB = 0, nAB = 0;
      cells.forEach(([i, j, c]) => {
        const a = fA(i, j), b = fB(i, j);
        c.classList.toggle("hit", a && (!cond.checked || b));
        c.classList.toggle("hit2", b && !cond.checked);
        c.classList.toggle("dim", cond.checked && !b);
        c.classList.toggle("ring", cond.checked && b);
        nA += a; nB += b; nAB += a && b;
      });
      let s = `$P(A) = ${fracT(nA, 36)}$ · $P(B) = ${fracT(nB, 36)}$ · $P(AB) = ${fracT(nAB, 36)}$`;
      if (cond.checked) {
        s += `<br>Új eseménytér: a $B$ ${nB} cellája. &nbsp; $P(A \\mid B) = \\dfrac{|AB|}{|B|} = \\dfrac{${nAB}}{${nB}}${gcd(nAB, nB) > 1 ? ` = ${fracT(nAB, nB)}` : ""}$`;
        s += ` &nbsp;=&nbsp; $\\dfrac{P(AB)}{P(B)} = \\dfrac{${fracT(nAB, 36)}}{${fracT(nB, 36)}}$`;
        const pA = nA / 36, pAB = nAB / nB;
        const verdict = Math.abs(pAB - pA) < 1e-12
          ? "<b>P(A|B) = P(A)</b> – a feltétel nem változtat A esélyén: <b>A és B függetlenek!</b>"
          : pAB > pA ? `A feltétel <b>növeli</b> A esélyét (${fmt(pA, 3)} → ${fmt(pAB, 3)}).`
          : `A feltétel <b>csökkenti</b> A esélyét (${fmt(pA, 3)} → ${fmt(pAB, 3)}).`;
        s += `<br>${verdict}`;
      } else s += "<br><small>Kapcsold be a feltételt, hogy lásd, hogyan szűkül az eseménytér!</small>";
      out.innerHTML = s;
      render(out);
    }
    sA.onchange = sB.onchange = cond.onchange = upd;
    upd();
  };

  /* ------------------------------------------------------------------
     2.1  Kontingencia-tábla: P(A|B) ≠ P(B|A)
     ------------------------------------------------------------------ */
  const CT_PRESETS = [
    { name: "Iskola (Obádovics)", rows: ["fiú", "lány"], cols: ["beteg volt", "nem volt beteg"], data: [[50, 60], [40, 80]] },
    { name: "Gépek és selejt", rows: ["A gép", "B gép"], cols: ["selejt", "jó"], data: [[20, 480], [30, 620]] },
    { name: "Szemorvos (V.2.11)", rows: ["fiú", "lány"], cols: ["rövidlátó", "nem rövidlátó"], data: [[60, 1440], [50, 450]] },
    { name: "Orvosi teszt (1000 fő)", rows: ["beteg", "egészséges"], cols: ["pozitív teszt", "negatív teszt"], data: [[10, 0], [10, 980]] }
  ];
  W["contingency"] = root => {
    header(root, "Kontingencia-tábla", "Kattints egy cellára! A sor az <span class='chip a'>A</span>, az oszlop a <span class='chip b'>B</span> esemény. A számok átírhatók.");
    let P = CT_PRESETS[0], data = P.data.map(r => r.slice()), sel = [0, 0];
    root.append(h("div", { class: "controls" }, "Adatok: ", ...CT_PRESETS.map(p => btn(p.name, () => { P = p; data = p.data.map(r => r.slice()); sel = [0, 0]; build(); }))));
    const tbl = h("table", { class: "ctable" });
    const out = h("div", { class: "readout" });
    root.append(tbl, out);
    function build() {
      tbl.innerHTML = "";
      const head = h("tr", null, h("th", null, ""), ...P.cols.map(c => h("th", null, c)), h("th", null, "összesen"));
      tbl.append(head);
      P.rows.forEach((r, i) => {
        const tr = h("tr", null, h("th", null, r));
        P.cols.forEach((_, j) => {
          const inp = h("input", { type: "number", min: 0, value: data[i][j] });
          inp.oninput = () => { data[i][j] = Math.max(0, +inp.value || 0); upd(); };
          const td = h("td", { "data-i": i, "data-j": j }, inp);
          td.onclick = () => { sel = [i, j]; upd(); };
          tr.append(td);
        });
        tr.append(h("td", { class: "tot", "data-row": i }));
        tbl.append(tr);
      });
      const ft = h("tr", null, h("th", null, "összesen"), ...P.cols.map((_, j) => h("td", { class: "tot", "data-col": j })), h("td", { class: "tot", "data-all": 1 }));
      tbl.append(ft);
      upd();
    }
    function upd() {
      const [si, sj] = sel;
      const rowT = data.map(r => r[0] + r[1]), colT = [0, 1].map(j => data[0][j] + data[1][j]), N = rowT[0] + rowT[1];
      tbl.querySelectorAll("td[data-row]").forEach(td => (td.textContent = rowT[+td.dataset.row]));
      tbl.querySelectorAll("td[data-col]").forEach(td => (td.textContent = colT[+td.dataset.col]));
      tbl.querySelector("td[data-all]").textContent = N;
      tbl.querySelectorAll("td[data-i]").forEach(td => {
        const i = +td.dataset.i, j = +td.dataset.j;
        td.classList.toggle("selc", i === si && j === sj);
        td.classList.toggle("inrow", i === si && j !== sj);
        td.classList.toggle("incol", j === sj && i !== si);
      });
      const n = data[si][sj], A = P.rows[si], B = P.cols[sj];
      out.innerHTML =
        `A = „${A}”, B = „${B}”<br>` +
        `$P(AB) = ${fracT(n, N)} \\approx ${num(n / N || 0, 3)}$ &nbsp;(az egész táblához viszonyítva)<br>` +
        `<span style="color:var(--setA)">■</span> $P(B \\mid A) = \\tfrac{${n}}{${rowT[si]}} \\approx ${num(n / rowT[si] || 0, 3)}$ &nbsp;– a <b>sorösszeg</b> az új „összes eset”<br>` +
        `<span style="color:var(--setB)">■</span> $P(A \\mid B) = \\tfrac{${n}}{${colT[sj]}} \\approx ${num(n / colT[sj] || 0, 3)}$ &nbsp;– az <b>oszlopösszeg</b> az új „összes eset”`;
      render(out);
    }
    build();
  };

  /* ------------------------------------------------------------------
     2.1.1  Egymás utáni húzás visszatevés nélkül – szorzási tétel
     ------------------------------------------------------------------ */
  W["seq-draw"] = root => {
    header(root, "Húzás a dobozból – általános szorzási szabály", "Te döntöd el, mit húzunk ki egymás után. Minden lépésnél a doboz <em>aktuális</em> tartalma adja a feltételes valószínűséget.");
    const nI = h("input", { type: "number", min: 2, max: 60, value: 16 }), kI = h("input", { type: "number", min: 0, max: 60, value: 4 });
    const repl = h("input", { type: "checkbox" });
    root.append(h("div", { class: "controls" }, h("label", null, "összesen N =", nI), h("label", null, "ebből hibás K =", kI), h("label", null, repl, "visszatevéssel")),
      h("div", { class: "controls" }, "Előbeállítás: ", btn("Tranzisztorok (16, 4)", () => set(16, 4)), btn("V.2.4 (10, 3)", () => set(10, 3))));
    const box = h("div", { class: "ballbox" });
    const ctr = h("div", { class: "controls" },
      btn("Húzok: hibátlan ✓", () => draw(0), "btn primary"), btn("Húzok: hibás ✗", () => draw(1), "btn primary"),
      btn("↶ Vissza", () => { seq.pop(); upd(); }), btn("Újrakezdem", () => { seq = []; upd(); }));
    const out = h("div", { class: "readout" });
    root.append(box, ctr, out);
    let seq = [];
    function set(N, K) { nI.value = N; kI.value = K; seq = []; upd(); }
    const params = () => { const N = Math.max(2, Math.min(60, +nI.value || 2)); return [N, Math.max(0, Math.min(N, +kI.value || 0))]; };
    function state() {
      const [N, K] = params();
      let good = N - K, bad = K;
      const steps = [];
      for (const s of seq) {
        const tot = good + bad, fav = s ? bad : good;
        steps.push([fav, tot, s]);
        if (!repl.checked) s ? bad-- : good--;
      }
      return { N, K, good, bad, steps };
    }
    function draw(s) {
      const st = state();
      if (seq.length >= 8) return;
      if ((s ? st.bad : st.good) <= 0) { out.innerHTML = `Nincs több ${s ? "hibás" : "hibátlan"} darab a dobozban – ennek az útnak a valószínűsége 0.`; return; }
      seq.push(s); upd();
    }
    function upd() {
      const st = state();
      box.innerHTML = "";
      const takenG = repl.checked ? 0 : seq.filter(s => !s).length, takenB = repl.checked ? 0 : seq.filter(s => s).length;
      for (let i = 0; i < st.N - st.K; i++) box.append(h("span", { class: "ball g" + (i < takenG ? " out" : "") }));
      for (let i = 0; i < st.K; i++) box.append(h("span", { class: "ball b" + (i < takenB ? " out" : "") }));
      if (!seq.length) { out.innerHTML = "Kattints a „Húzok” gombokra! (legfeljebb 8 húzás)"; return; }
      let p = 1n, q = 1n;
      st.steps.forEach(([f, t]) => { p *= BigInt(f); q *= BigInt(t); });
      const ev = seq.map((s, i) => (s ? `H_{${i + 1}}` : `J_{${i + 1}}`));
      const factors = st.steps.map(([f, t], i) => (i ? `P(${ev[i]} \\mid ${ev.slice(0, i).join("")})` : `P(${ev[0]})`));
      out.innerHTML = `Sorrend: <b>${seq.map(s => (s ? "hibás" : "hibátlan")).join(" → ")}</b><br>` +
        tex(`P(${ev.join("")}) = ${factors.join("\\cdot ")}`) + "<br>" +
        tex(`= ${st.steps.map(([f, t]) => `\\tfrac{${f}}{${t}}`).join("\\cdot ")} = ${bfracT(p, q)} \\approx ${num(Number(p) / Number(q), 4)}`) +
        `<br><small>J = hibátlan, H = hibás. ${repl.checked ? "Visszatevéssel a doboz nem változik, ezért a tényezők nem függnek az előzményektől (függetlenség)." : "Visszatevés nélkül minden húzás után változik a doboz – ezért feltételes valószínűségek szorzódnak."}</small>`;
    }
    [nI, kI].forEach(e => (e.oninput = () => { seq = []; upd(); }));
    repl.onchange = upd;
    upd();
  };

  /* ------------------------------------------------------------------
     2.1.1 / 2.2  Fadiagram: urnák és golyók
     ------------------------------------------------------------------ */
  const URN_PRESETS = [
    { name: "Három urna (Obádovics)", colors: ["fehér", "piros"], urns: [["A", 1, 6, 4], ["B", 1, 5, 1], ["C", 1, 5, 3]] },
    { name: "Két doboz, pénzfeldobás", colors: ["kék", "piros"], urns: [["1. doboz", 1, 1, 2], ["2. doboz", 1, 3, 1]] },
    { name: "Két urna, nem egyforma eséllyel", colors: ["fehér", "piros"], urns: [["I.", 2, 3, 2], ["II.", 1, 4, 1]] }
  ];
  W["urn-tree"] = root => {
    header(root, "Fadiagram – urnák és golyók", "Először véletlenszerűen urnát választunk (az urnák <em>súlya</em> szerint), majd abból egy golyót húzunk. A <b>piros</b> golyóhoz vezető utak kiemelve.");
    let P = URN_PRESETS[0], urns = P.urns.map(u => u.slice());
    root.append(h("div", { class: "controls" }, "Feladat: ", ...URN_PRESETS.map(p => btn(p.name, () => { P = p; urns = p.urns.map(u => u.slice()); build(); }))));
    const cfg = h("div", { class: "urn-cfg" });
    root.append(cfg);
    const cv = makeCanvas(root, 0.5);
    const out = h("div", { class: "readout" });
    const simOut = h("div", { class: "muted", style: "font-size:.9rem;margin-top:.4rem" });
    root.append(out, h("div", { class: "controls" }, btn("🎲 Szimulálj 3000 húzást", sim)), simOut);
    function build() {
      cfg.innerHTML = "";
      urns.forEach((u, i) => {
        const mk = (k, min) => { const e = h("input", { type: "number", min, max: 50, value: u[k] }); e.oninput = () => { u[k] = Math.max(min, Math.min(50, +e.value || 0)); upd(); }; return e; };
        cfg.append(h("div", { class: "controls" }, h("b", { style: "min-width:5.5em" }, `${u[0]} urna:`),
          h("label", null, "súly", mk(1, 1)), h("label", null, P.colors[0], mk(2, 0)), h("label", null, P.colors[1], mk(3, 0))));
      });
      upd();
    }
    const calc = () => {
      const S = urns.reduce((a, u) => a + u[1], 0);
      return urns.map(u => {
        const tot = u[2] + u[3];
        return { name: u[0], pw: u[1], S, red: u[3], tot, prior: u[1] / S, like: tot ? u[3] / tot : 0 };
      });
    };
    cv.draw = () => {
      const { ctx, w, h: H } = cv;
      ctx.clearRect(0, 0, w, H);
      const U = calc(), n = U.length;
      const top = 14, bot = 14, leaves = 2 * n;
      const ly = i => top + (i + 0.5) * (H - top - bot) / leaves;
      const xr = 26, xu = w * 0.33, xl = w * 0.62;
      const txt = (s, x, y, col, align = "center", bold = false) => { ctx.fillStyle = col; ctx.font = `${bold ? "bold " : ""}12px system-ui`; ctx.textAlign = align; ctx.textBaseline = "middle"; ctx.fillText(s, x, y); };
      const yr = H / 2;
      U.forEach((u, i) => {
        const yu = (ly(2 * i) + ly(2 * i + 1)) / 2;
        ctx.strokeStyle = css("--accent"); ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(xr, yr); ctx.lineTo(xu, yu); ctx.stroke();
        txt(frac(u.pw, u.S), (xr + xu) / 2, (yr + yu) / 2 - 9, css("--text"), "center", true);
        [0, 1].forEach(c => {
          const y = ly(2 * i + c), isRed = c === 1;
          ctx.strokeStyle = isRed ? css("--accent") : css("--border"); ctx.lineWidth = isRed ? 2.5 : 1.5;
          ctx.beginPath(); ctx.moveTo(xu, yu); ctx.lineTo(xl, y); ctx.stroke();
          const k = isRed ? u.red : u.tot - u.red;
          txt(u.tot ? frac(k, u.tot) : "–", (xu + xl) / 2, (yu + y) / 2 - 8, css("--text"));
          ctx.fillStyle = isRed ? css("--bad") : (P.colors[0] === "kék" ? css("--setA") : css("--card"));
          ctx.strokeStyle = css("--text"); ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(xl + 8, y, 7, 0, 7); ctx.fill(); ctx.stroke();
          txt(P.colors[c], xl + 20, y, css("--muted"), "left");
          if (isRed) txt(`${frac(u.pw, u.S)} · ${u.tot ? frac(k, u.tot) : 0} = ${u.tot ? frac(u.pw * k, u.S * u.tot) : 0}`, xl + 70, y, css("--accent"), "left", true);
        });
        ctx.fillStyle = css("--accent-soft"); ctx.strokeStyle = css("--accent"); ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(xu, yu, 15, 0, 7); ctx.fill(); ctx.stroke();
        txt(u.name.length > 3 ? u.name.replace(/\D/g, "") + "." : u.name, xu, yu, css("--text"), "center", true);
      });
      ctx.fillStyle = css("--text"); ctx.beginPath(); ctx.arc(xr, yr, 5, 0, 7); ctx.fill();
    };
    function upd() {
      const U = calc();
      cv.draw();
      const pB = U.reduce((a, u) => a + u.prior * u.like, 0);
      // pontos tört: közös nevező
      let p = 0n, q = 1n;
      U.forEach(u => { if (!u.tot) return; const a = BigInt(u.pw * u.red), b = BigInt(u.S * u.tot); p = p * b + a * q; q *= b; });
      const terms = U.map(u => `${fracT(u.pw, u.S)}\\cdot${u.tot ? fracT(u.red, u.tot) : 0}`).join(" + ");
      let s = `<b>Teljes valószínűség:</b> ` + tex(`P(\\text{${P.colors[1]}}) = ${terms} = ${bfracT(p, q)} \\approx ${num(pB, 4)}`);
      s += `<br><b>Bayes (visszafelé):</b> ha ${P.colors[1]} golyót húztunk, honnan jött? ` +
        U.map(u => tex(`P(\\text{${u.name}} \\mid \\text{${P.colors[1]}}) \\approx ${num(pB ? u.prior * u.like / pB : 0, 3)}`)).join(" · ");
      out.innerHTML = s;
      simOut.textContent = "";
    }
    function sim() {
      const U = calc(), T = 3000, from = U.map(() => 0);
      let red = 0;
      for (let t = 0; t < T; t++) {
        let r = Math.random(), i = 0;
        while (i < U.length - 1 && r >= U[i].prior) { r -= U[i].prior; i++; }
        if (Math.random() < U[i].like) { red++; from[i]++; }
      }
      simOut.textContent = `${T} húzásból ${red} volt ${P.colors[1]} → relatív gyakoriság ${fmt(red / T, 3)}. ` +
        `A ${P.colors[1]} golyók eredete: ` + U.map((u, i) => `${u.name}: ${red ? fmt(from[i] / red, 3) : "–"}`).join(", ");
    }
    build();
  };

  /* ------------------------------------------------------------------
     2.2 / 2.2.1  Teljes valószínűség és Bayes – terület-modell
     ------------------------------------------------------------------ */
  const BS_PRESETS = [
    { name: "Három gép (G₁, G₂, G₃)", B: "selejt", parts: [["G₁", 50, 0.03], ["G₂", 30, 0.04], ["G₃", 20, 0.05]] },
    { name: "Vizsga", B: "sikeres vizsga", parts: [["matematikus", 82, 0.9], ["fizikus", 18, 0.7]] },
    { name: "Kórház", B: "szívbeteg", parts: [["nő", 50, 0.0045], ["férfi", 10, 0.08]] },
    { name: "Félénk Tom", B: "félénk", parts: [["matematikus", 10, 0.75], ["közgazdász", 90, 0.15]] }
  ];
  W["bayes-square"] = root => {
    header(root, "A teljes valószínűség és a Bayes-tétel – területekkel",
      "Az egységnégyzetet függőleges sávokra vágjuk: a sáv <b>szélessége</b> $P(A_i)$, a satírozott rész <b>magassága</b> $P(B \\mid A_i)$. A satírozott terület összesen $P(B)$; a jobb oldali oszlop azt mutatja, a $B$-terület hányad része esik az egyes sávokba – ez a Bayes-tétel.");
    let P = BS_PRESETS[0], parts = P.parts.map(p => p.slice());
    root.append(h("div", { class: "controls" }, "Feladat: ", ...BS_PRESETS.map(p => btn(p.name, () => { P = p; parts = p.parts.map(x => x.slice()); build(); }))));
    const zoom = h("input", { type: "checkbox", checked: "" });
    const cfg = h("div");
    root.append(cfg, h("div", { class: "controls" }, h("label", null, zoom, "függőleges nagyítás kis valószínűségeknél (az arányok nem változnak)")));
    const cv = makeCanvas(root, 0.5);
    const out = h("div", { class: "readout" });
    root.append(out);
    const COLS = ["--setA", "--setB", "--setC"];
    function build() {
      cfg.innerHTML = "";
      parts.forEach((p, i) => {
        const w = h("input", { type: "range", min: 1, max: 100, step: 1, value: p[1] });
        const l = h("input", { type: "range", min: 0, max: 1, step: 0.0005, value: p[2] });
        const lw = h("b"), ll = h("b");
        w.oninput = () => { p[1] = +w.value; upd(); };
        l.oninput = () => { p[2] = +l.value; upd(); };
        p.lab = [lw, ll];
        cfg.append(h("div", { class: "controls" }, h("span", { class: "chip", style: `border-color:var(${COLS[i]})` }, p[0]),
          h("label", null, "súly", w, lw), h("label", null, `P(${P.B} | ${p[0]})`, l, ll)));
      });
      upd();
    }
    const calc = () => {
      const S = parts.reduce((a, p) => a + p[1], 0);
      const pr = parts.map(p => p[1] / S), lk = parts.map(p => p[2]);
      const joint = pr.map((x, i) => x * lk[i]), pB = joint.reduce((a, b) => a + b, 0);
      return { pr, lk, joint, pB };
    };
    cv.draw = () => {
      const { ctx, w, h: H } = cv;
      ctx.clearRect(0, 0, w, H);
      const { pr, lk, joint, pB } = calc();
      const side = Math.min(H - 40, w * 0.62), x0 = 20, y0 = 10;
      const ymax = zoom.checked ? Math.max(0.05, ...lk) : 1;
      const sc = v => side * Math.min(1, v / ymax);
      let x = x0;
      pr.forEach((p, i) => {
        const ww = side * p, col = css(COLS[i]);
        ctx.fillStyle = col; ctx.globalAlpha = 0.12; ctx.fillRect(x, y0, ww, side); ctx.globalAlpha = 1;
        ctx.fillStyle = col; ctx.globalAlpha = 0.8; ctx.fillRect(x, y0 + side - sc(lk[i]), ww, sc(lk[i])); ctx.globalAlpha = 1;
        ctx.strokeStyle = css("--text"); ctx.lineWidth = 1; ctx.strokeRect(x, y0, ww, side);
        ctx.fillStyle = css("--text"); ctx.font = "12px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "top";
        if (ww > 28) ctx.fillText(parts[i][0], x + ww / 2, y0 + side + 4);
        if (ww > 40) {
          const ly = y0 + side - sc(lk[i]), inside = ly < y0 + 16; // a sáv tetején a címkét a sávon belülre tesszük
          ctx.textBaseline = inside ? "top" : "bottom";
          ctx.fillText(fmt(lk[i], lk[i] < 0.01 ? 4 : 3), x + ww / 2, inside ? ly + 3 : ly - 2);
        }
        x += ww;
      });
      if (zoom.checked && ymax < 1) { ctx.fillStyle = css("--muted"); ctx.font = "11px system-ui"; ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText(`függőleges tengely: 0 – ${fmt(ymax, 3)}`, x0 + 4, y0 + 4); }
      // Bayes-oszlop
      const bx = x0 + side + 50, bw = Math.min(70, w - bx - 120);
      if (bw < 20) return;
      let y = y0;
      ctx.font = "12px system-ui"; ctx.textBaseline = "middle"; ctx.textAlign = "left";
      joint.forEach((j, i) => {
        const hh = pB ? side * j / pB : 0;
        ctx.fillStyle = css(COLS[i]); ctx.globalAlpha = 0.8; ctx.fillRect(bx, y, bw, hh); ctx.globalAlpha = 1;
        ctx.strokeStyle = css("--text"); ctx.strokeRect(bx, y, bw, hh);
        ctx.fillStyle = css("--text");
        if (hh > 14) ctx.fillText(`${parts[i][0]}: ${pct(pB ? j / pB : 0)}`, bx + bw + 6, y + hh / 2);
        y += hh;
      });
      ctx.fillStyle = css("--muted"); ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.fillText(`ha ${P.B}:`, bx + bw / 2, y0 + side + 4);
    };
    function upd() {
      const { pr, lk, joint, pB } = calc();
      parts.forEach((p, i) => { p.lab[0].textContent = pct(pr[i]); p.lab[1].textContent = fmt(lk[i], lk[i] < 0.01 ? 4 : 3); });
      cv.draw();
      const nm = i => `\\text{${parts[i][0].replace(/[₁₂₃]/g, m => `}_{${"₁₂₃".indexOf(m) + 1}}\\text{`)}}`;
      out.innerHTML = tex(`P(\\text{${P.B}}) = ` + pr.map((p, i) => `${num(p, 3)}\\cdot ${num(lk[i], lk[i] < 0.01 ? 4 : 3)}`).join(" + ") + ` = ${num(pB, 4)}`) + "<br>" +
        pr.map((p, i) => tex(`P(${nm(i)} \\mid \\text{${P.B}}) = \\frac{${num(joint[i], 4)}}{${num(pB, 4)}} \\approx ${num(pB ? joint[i] / pB : 0, 3)}`)).join(" &nbsp;·&nbsp; ") +
        "<br><small>Figyeld meg: az a priori " + pr.map((p, i) => `${parts[i][0]} ${pct(p)}`).join(", ") + " → a posteriori " + joint.map((j, i) => `${parts[i][0]} ${pct(pB ? j / pB : 0)}`).join(", ") + ".</small>";
    }
    zoom.onchange = () => cv.draw();
    build();
  };

  /* ------------------------------------------------------------------
     2.2.1  Orvosi teszt – 1000 ember, természetes gyakoriságok
     ------------------------------------------------------------------ */
  W["medical-test"] = root => {
    header(root, "Orvosi teszt – 1000 ember",
      "Minden pötty egy ember. Állítsd be, milyen gyakori a betegség, és mennyire jó a teszt! Kérdés: ha valakinek <b>pozitív</b> a tesztje, mekkora eséllyel beteg?");
    const mk = (min, max, step, v) => h("input", { type: "range", min, max, step, value: v });
    const rP = mk(0.001, 0.99, 0.001, 0.01), rSe = mk(0.5, 1, 0.005, 0.99), rSp = mk(0.5, 1, 0.005, 0.99);
    const lP = h("b"), lSe = h("b"), lSp = h("b");
    root.append(h("div", { class: "controls" },
      h("label", null, "gyakoriság (prevalencia)", rP, lP),
      h("label", null, "szenzitivitás P(+|beteg)", rSe, lSe),
      h("label", null, "specificitás P(−|egészséges)", rSp, lSp)));
    const cv = makeCanvas(root, 0.5, 640);
    const legend = h("div", { class: "controls", style: "font-size:.85rem" });
    const out = h("div", { class: "readout" });
    const hist = h("div", { class: "muted", style: "font-size:.9rem;margin-top:.4rem" });
    root.append(legend, out,
      h("div", { class: "controls" }, btn("🔁 Újabb, független pozitív teszt (frissítés)", again, "btn primary"), btn("Alaphelyzet", () => { rP.value = 0.01; rSe.value = 0.99; rSp.value = 0.99; chain = []; upd(); })),
      hist);
    let chain = [];
    const C = () => ({ TP: css("--bad"), FN: "#f59e0b", FP: "#8b5cf6", TN: css("--border") });
    const counts = () => {
      const p = +rP.value, se = +rSe.value, sp = +rSp.value;
      const sick = Math.round(1000 * p), TP = Math.round(sick * se), healthy = 1000 - sick, FP = Math.round(healthy * (1 - sp));
      return { p, se, sp, TP, FN: sick - TP, FP, TN: healthy - FP };
    };
    cv.draw = () => {
      const { ctx, w, h: H } = cv;
      ctx.clearRect(0, 0, w, H);
      const c = counts(), col = C();
      const cols = 40, rows = 25, cs = Math.min(w / cols, H / rows), r = cs * 0.36;
      const ox = (w - cs * cols) / 2;
      const seq = [].concat(Array(c.TP).fill("TP"), Array(c.FN).fill("FN"), Array(c.FP).fill("FP"), Array(c.TN).fill("TN"));
      seq.forEach((t, i) => {
        const x = ox + (i % cols + 0.5) * cs, y = (Math.floor(i / cols) + 0.5) * cs;
        ctx.fillStyle = col[t]; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
        if (t === "TP" || t === "FP") { ctx.strokeStyle = css("--text"); ctx.lineWidth = 1.2; ctx.stroke(); }
      });
    };
    function upd() {
      const c = counts(), col = C();
      lP.textContent = pct(c.p, 1); lSe.textContent = pct(c.se, 1); lSp.textContent = pct(c.sp, 1);
      legend.innerHTML = [["TP", "beteg, pozitív teszt"], ["FN", "beteg, negatív teszt (álnegatív)"], ["FP", "egészséges, pozitív teszt (álpozitív)"], ["TN", "egészséges, negatív teszt"]]
        .map(([k, l]) => `<span><span style="display:inline-block;width:.8em;height:.8em;border-radius:50%;background:${col[k]};vertical-align:middle${k === "TP" || k === "FP" ? ";outline:1.5px solid var(--text)" : ""}"></span> ${l}: <b>${c[k]}</b></span>`).join(" ");
      const post = c.p * c.se / (c.p * c.se + (1 - c.p) * (1 - c.sp));
      out.innerHTML = `Pozitív teszt (körvonalas pöttyök): ${c.TP + c.FP} fő, ebből valóban beteg ${c.TP} → kb. <b>${c.TP + c.FP ? pct(c.TP / (c.TP + c.FP)) : "–"}</b><br>` +
        tex(`P(\\text{beteg} \\mid +) = \\frac{${num(c.p, 3)}\\cdot ${num(c.se, 3)}}{${num(c.p, 3)}\\cdot ${num(c.se, 3)} + ${num(1 - c.p, 3)}\\cdot ${num(1 - c.sp, 3)}} = ${num(post, 4)}`);
      hist.innerHTML = chain.length ? "Frissítések láncolata (a priori → a posteriori): " + chain.map(x => pct(x, 2)).concat(`<b>${pct(c.p, 2)}</b>`).join(" → ") : "";
      cv.draw();
    }
    function again() {
      const c = counts();
      const post = c.p * c.se / (c.p * c.se + (1 - c.p) * (1 - c.sp));
      chain.push(c.p);
      rP.value = Math.min(0.99, Math.max(0.001, post));
      upd();
      hist.innerHTML += `<br>Az előző a posteriori valószínűség (${pct(post, 2)}) lett az új a priori${post > 0.99 ? " (a csúszka 99%-nál megáll)" : ""}.`;
    }
    [rP, rSe, rSp].forEach(r => (r.oninput = () => { chain = []; upd(); }));
    upd();
  };

  /* ------------------------------------------------------------------
     2.2.2  Monty Hall-probléma
     ------------------------------------------------------------------ */
  W["monty-hall"] = root => {
    header(root, "Monty Hall – játssz!", "Az egyik ajtó mögött autó, a másik kettő mögött kecske van. Válassz egy ajtót! A műsorvezető – aki tudja, hol az autó – kinyit egy kecskés ajtót a másik kettő közül. Maradsz vagy váltasz?");
    const doors = [0, 1, 2].map(i => btn(`🚪 ${i + 1}.`, () => pick(i), "btn door"));
    const msg = h("div", { style: "margin:.5rem 0;font-weight:600" });
    const stayB = btn("Maradok", () => finish(false), "btn primary"), swB = btn("Váltok", () => finish(true), "btn primary");
    const dec = h("div", { class: "controls" }, stayB, swB);
    const stats = h("div", { class: "stat-row" });
    const simOut = h("div", { class: "readout" });
    root.append(h("div", { class: "controls doors" }, ...doors), msg, dec,
      h("div", { class: "controls" }, btn("Új játék", reset), btn("🎰 Szimulálj 1000 játékot mindkét stratégiával", sim)), stats, simOut);
    let car, chosen, opened, phase, tally = { stay: [0, 0], sw: [0, 0] };
    function reset() {
      car = rnd(3); chosen = opened = null; phase = 0;
      doors.forEach((d, i) => { d.disabled = false; d.textContent = `🚪 ${i + 1}.`; d.classList.remove("on"); });
      msg.textContent = "Válassz egy ajtót!"; dec.style.display = "none";
    }
    function pick(i) {
      if (phase !== 0) return;
      chosen = i; phase = 1;
      const goats = [0, 1, 2].filter(k => k !== i && k !== car);
      opened = goats[rnd(goats.length)];
      doors[i].classList.add("on");
      doors[opened].textContent = "🐐"; doors[opened].disabled = true;
      const other = 3 - i - opened;
      msg.textContent = `Az ${i + 1}. ajtót választottad. A műsorvezető kinyitotta a(z) ${opened + 1}. ajtót: kecske! Maradsz az ${i + 1}.-nél, vagy váltasz a(z) ${other + 1}.-re?`;
      dec.style.display = "";
    }
    function finish(sw) {
      if (phase !== 1) return;
      phase = 2;
      if (sw) { doors[chosen].classList.remove("on"); chosen = 3 - chosen - opened; doors[chosen].classList.add("on"); }
      doors.forEach((d, k) => { d.textContent = k === car ? "🚗" : "🐐"; d.disabled = true; });
      const win = chosen === car, t = sw ? tally.sw : tally.stay;
      t[0] += win; t[1]++;
      msg.textContent = win ? "🎉 Nyertél egy autót!" : "🐐 Kecske… legközelebb több szerencsét!";
      dec.style.display = "none";
      showStats();
    }
    function showStats() {
      const cell = (l, [w, n]) => `<div class="stat"><div class="v">${n ? pct(w / n, 0) : "–"}</div><div class="l">${l}: ${w}/${n} nyerés</div></div>`;
      stats.innerHTML = cell("saját játékok – maradtam", tally.stay) + cell("saját játékok – váltottam", tally.sw);
    }
    function sim() {
      let s = 0, v = 0; const T = 1000;
      for (let t = 0; t < T; t++) {
        const c = rnd(3), p = rnd(3);
        s += p === c; v += p !== c; // váltással pontosan akkor nyerünk, ha elsőre rosszat választottunk
      }
      simOut.innerHTML = `${T} játék · maradás: <b>${s}</b> nyerés (${pct(s / T)}) · váltás: <b>${v}</b> nyerés (${pct(v / T)})`;
    }
    reset(); showStats();
  };

  /* ------------------------------------------------------------------
     2.3  „Szerencsejátékos tévedése” – sorozatok után
     ------------------------------------------------------------------ */
  W["streak"] = root => {
    header(root, "Jár-e már az írás?", "Egy szabályos érmét sokszor feldobunk, és megnézzük: ha az előző $L$ dobás mind fej volt, hányadrészben lesz a <em>következő</em> is fej?");
    const rL = h("input", { type: "range", min: 1, max: 10, value: 5 }), lL = h("b");
    root.append(h("div", { class: "controls" }, h("label", null, "sorozat hossza L =", rL, lL), btn("🪙 Dobj 200 000-szer", run, "btn primary")));
    const out = h("div", { class: "stat-row" });
    const note = h("div", { class: "muted", style: "font-size:.9rem;margin-top:.4rem" });
    root.append(out, note);
    function run() {
      const L = +rL.value, N = 200000;
      let run_ = 0, cases = 0, heads = 0;
      for (let i = 0; i < N; i++) {
        const f = Math.random() < 0.5;
        if (run_ >= L) { cases++; heads += f; }
        run_ = f ? run_ + 1 : 0;
      }
      out.innerHTML = [["dobások", N.toLocaleString("hu-HU")], [`${L} fej után következő dobás`, cases], ["ebből fej", heads], ["relatív gyakoriság", cases ? fmt(heads / cases, 3) : "–"]]
        .map(([l, v]) => `<div class="stat"><div class="v">${v}</div><div class="l">${l}</div></div>`).join("");
      note.textContent = `Elméletileg ${L} egymás utáni fej esélye 1/${2 ** L}, mégis: utána a következő dobás ugyanúgy 1/2 eséllyel fej. Az érmének nincs memóriája – az egymás utáni dobások függetlenek.`;
    }
    rL.oninput = () => (lL.textContent = rL.value);
    lL.textContent = rL.value;
    run();
  };

  /* ------------------------------------------------------------------
     2.3.2  Megbízhatóság – soros és párhuzamos rendszerek
     ------------------------------------------------------------------ */
  const SYS = [
    { name: "soros kapcsolás", f: (p, n) => Math.pow(p, n), t: n => `R = p^{${n}}`, usesN: true },
    { name: "párhuzamos kapcsolás", f: (p, n) => 1 - Math.pow(1 - p, n), t: n => `R = 1 - (1-p)^{${n}}`, usesN: true },
    { name: "két párhuzamos ág, ágankként 2 soros elem", f: p => 1 - Math.pow(1 - p * p, 2), t: () => "R = 1 - (1-p^2)^2" },
    { name: "két soros blokk, blokkonként 2 párhuzamos elem", f: p => Math.pow(1 - Math.pow(1 - p, 2), 2), t: () => "R = \\left(1 - (1-p)^2\\right)^2" }
  ];
  function sysSVG(k, n) {
    const bw = 46, bh = 26, gap = 22;
    const boxAt = (x, y, i) => `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="5" class="cmp"/><text x="${x + bw / 2}" y="${y + bh / 2 + 4}" text-anchor="middle">${i}</text>`;
    const line = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
    let s = "", W_ = 0, H_ = 0;
    if (k === 0) {
      H_ = bh + 20; const y = 10; let x = 20; s += line(0, y + bh / 2, 20, y + bh / 2);
      for (let i = 0; i < n; i++) { s += boxAt(x, y, i + 1); s += line(x + bw, y + bh / 2, x + bw + gap, y + bh / 2); x += bw + gap; }
      W_ = x;
    } else if (k === 1) {
      H_ = n * (bh + 10) + 10; const xl = 20, xb = 50, xr = xb + bw + 30;
      s += line(0, H_ / 2, xl, H_ / 2) + line(xl, 10 + bh / 2, xl, 10 + (n - 1) * (bh + 10) + bh / 2) + line(xr, 10 + bh / 2, xr, 10 + (n - 1) * (bh + 10) + bh / 2) + line(xr, H_ / 2, xr + 20, H_ / 2);
      for (let i = 0; i < n; i++) { const y = 10 + i * (bh + 10); s += line(xl, y + bh / 2, xb, y + bh / 2) + boxAt(xb, y, i + 1) + line(xb + bw, y + bh / 2, xr, y + bh / 2); }
      W_ = xr + 20;
    } else if (k === 2) {
      H_ = 2 * (bh + 10) + 10; const xl = 20, xr = 20 + 30 + 2 * bw + gap + 30;
      s += line(0, H_ / 2, xl, H_ / 2) + line(xl, 10 + bh / 2, xl, 20 + bh + bh / 2) + line(xr, 10 + bh / 2, xr, 20 + bh + bh / 2) + line(xr, H_ / 2, xr + 20, H_ / 2);
      [0, 1].forEach(r => { const y = 10 + r * (bh + 10), x = xl + 30; s += line(xl, y + bh / 2, x, y + bh / 2) + boxAt(x, y, 2 * r + 1) + line(x + bw, y + bh / 2, x + bw + gap, y + bh / 2) + boxAt(x + bw + gap, y, 2 * r + 2) + line(x + 2 * bw + gap, y + bh / 2, xr, y + bh / 2); });
      W_ = xr + 20;
    } else {
      H_ = 2 * (bh + 10) + 10; let x0 = 0;
      s += line(0, H_ / 2, 20, H_ / 2);
      [0, 1].forEach(b => {
        const xl = x0 + 20, xb = xl + 20, xr = xb + bw + 20;
        s += line(xl, 10 + bh / 2, xl, 20 + bh + bh / 2) + line(xr, 10 + bh / 2, xr, 20 + bh + bh / 2);
        [0, 1].forEach(r => { const y = 10 + r * (bh + 10); s += line(xl, y + bh / 2, xb, y + bh / 2) + boxAt(xb, y, 2 * b + r + 1) + line(xb + bw, y + bh / 2, xr, y + bh / 2); });
        s += line(xr, H_ / 2, xr + 20, H_ / 2);
        x0 = xr;
      });
      W_ = x0 + 20;
    }
    return `<svg class="sys" viewBox="-2 0 ${W_ + 4} ${H_}" style="max-width:${W_ + 4}px">${s}</svg>`;
  }
  W["reliability"] = root => {
    header(root, "Megbízhatóság", "Minden elem egymástól <b>függetlenül</b>, $p$ valószínűséggel működik. Mekkora a rendszer működésének valószínűsége ($R$)?");
    const sel = h("select"); SYS.forEach((s, i) => sel.append(h("option", { value: i }, s.name)));
    const rp = h("input", { type: "range", min: 0, max: 1, step: 0.01, value: 0.9 }), lp = h("b");
    const rn = h("input", { type: "range", min: 1, max: 8, step: 1, value: 3 }), ln = h("b");
    const nLab = h("label", null, "elemek száma n =", rn, ln);
    root.append(h("div", { class: "controls" }, h("label", null, "Rendszer: ", sel)), h("div", { class: "controls" }, h("label", null, "p =", rp, lp), nLab));
    const pic = h("div", { class: "sys-wrap" });
    const out = h("div", { class: "readout" });
    root.append(pic, out);
    const cv = makeCanvas(root, 0.42);
    const simOut = h("div", { class: "muted", style: "font-size:.9rem;margin-top:.4rem" });
    root.append(h("div", { class: "controls" }, btn("🔧 Szimulálj 10 000 napot", sim)), simOut);
    cv.draw = () => {
      const { ctx, w, h: H } = cv;
      ctx.clearRect(0, 0, w, H);
      const box = { x0: 40, y0: 14, x1: w - 150, y1: H - 30 };
      const { tx, ty } = axes(ctx, box, { xmin: 0, xmax: 1, ymin: 0, ymax: 1, xticks: [0, 0.25, 0.5, 0.75, 1], yticks: [0, 0.25, 0.5, 0.75, 1], xlabel: "p", ylabel: "R" });
      const n = +rn.value, cols = ["--setA", "--setB", "--setC", "--accent"];
      SYS.forEach((s, k) => {
        ctx.strokeStyle = css(cols[k]); ctx.lineWidth = k === +sel.value ? 3 : 1.3; ctx.beginPath();
        for (let i = 0; i <= 100; i++) { const p = i / 100; i ? ctx.lineTo(tx(p), ty(s.f(p, n))) : ctx.moveTo(tx(p), ty(s.f(p, n))); }
        ctx.stroke();
        ctx.fillStyle = css(cols[k]); ctx.font = "11px system-ui"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
        ctx.fillText(["soros", "párhuzamos", "2×2 soros ágak", "2×2 párh. blokkok"][k], box.x1 + 8, box.y0 + 10 + k * 16);
      });
      const p = +rp.value, s = SYS[+sel.value];
      ctx.fillStyle = css("--bad"); ctx.beginPath(); ctx.arc(tx(p), ty(s.f(p, n)), 5, 0, 7); ctx.fill();
    };
    function upd() {
      const s = SYS[+sel.value], p = +rp.value, n = +rn.value;
      lp.textContent = fmt(p, 2); ln.textContent = n;
      nLab.style.display = s.usesN ? "" : "none";
      pic.innerHTML = sysSVG(+sel.value, s.usesN ? n : 4);
      out.innerHTML = tex(`${s.t(n)} = ${num(s.f(p, n), 4)}`) + (+sel.value === 0 ? " &nbsp;– minden elemnek működnie kell (szorzat)" : +sel.value === 1 ? " &nbsp;– elég egy működő elem (ellentett esemény!)" : "");
      simOut.textContent = "";
      cv.draw();
    }
    function sim() {
      const k = +sel.value, p = +rp.value, n = +rn.value, T = 10000;
      let ok = 0;
      for (let t = 0; t < T; t++) {
        const e = Array.from({ length: k < 2 ? n : 4 }, () => Math.random() < p);
        ok += k === 0 ? e.every(Boolean) : k === 1 ? e.some(Boolean) : k === 2 ? (e[0] && e[1]) || (e[2] && e[3]) : (e[0] || e[1]) && (e[2] || e[3]);
      }
      simOut.textContent = `${T} napból ${ok} napon működött a rendszer → relatív gyakoriság ${fmt(ok / T, 4)} (elmélet: ${fmt(SYS[k].f(p, n), 4)})`;
    }
    sel.onchange = rp.oninput = rn.oninput = upd;
    upd();
  };

  /* ------------------------------------------------------------------
     Indítás
     ------------------------------------------------------------------ */
  document.querySelectorAll(".widget[data-widget]").forEach(root => {
    const f = W[root.dataset.widget];
    if (!f) return;
    try { f(root); window.Synopsis && Synopsis.renderMath(root); }
    catch (e) { root.append(h("p", { class: "muted" }, "Hiba a szemléltetés betöltésekor: " + e.message)); console.error(e); }
  });
})();
