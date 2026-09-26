/* =========================================================
   1. fejezet – interaktív szemléltetések
   Minden widget egy  <div class="widget" data-widget="név">  elembe épül.
   ========================================================= */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     Segédfüggvények
     ------------------------------------------------------------------ */
  const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const fmt = (x, d = 4) => (isFinite(x) ? x.toFixed(d).replace(".", ",") : "–");
  const pct = (x, d = 1) => fmt(x * 100, d) + "%";
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const frac = (k, n) => { const g = gcd(k, n) || 1; return n / g === 1 ? String(k / g) : `${k / g}/${n / g}`; };
  const tex = (s, display) => (window.katex ? katex.renderToString(s, { throwOnError: false, displayMode: !!display }) : s);
  const rnd = n => Math.floor(Math.random() * n);
  const esc = s => String(s).replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

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

  /* Kocka SVG */
  const PIPS = {
    1: [[50, 50]], 2: [[28, 28], [72, 72]], 3: [[28, 28], [50, 50], [72, 72]],
    4: [[28, 28], [72, 28], [28, 72], [72, 72]], 5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]],
    6: [[28, 24], [72, 24], [28, 50], [72, 50], [28, 76], [72, 76]]
  };
  const dieSVG = n => `<svg viewBox="0 0 100 100">${PIPS[n].map(([x, y]) => `<circle class="pip" cx="${x}" cy="${y}" r="9"/>`).join("")}</svg>`;
  const die = (n, cls = "") => h("div", { class: "die " + cls, html: dieSVG(n), "data-n": n });

  /* Tengelyes diagram rajzolása */
  function axes(ctx, box, { xmin, xmax, ymin, ymax, xticks = [], yticks = [], xlabel = "", ylabel = "", xlog = false }) {
    const { x0, y0, x1, y1 } = box;
    const tx = xlog ? v => x0 + (Math.log10(v) - Math.log10(xmin)) / (Math.log10(xmax) - Math.log10(xmin)) * (x1 - x0)
                    : v => x0 + (v - xmin) / (xmax - xmin) * (x1 - x0);
    const ty = v => y1 - (v - ymin) / (ymax - ymin) * (y1 - y0);
    ctx.strokeStyle = css("--border"); ctx.fillStyle = css("--muted"); ctx.lineWidth = 1;
    ctx.font = "11px system-ui, sans-serif";
    ctx.textAlign = "right"; ctx.textBaseline = "middle";
    yticks.forEach(v => {
      ctx.beginPath(); ctx.moveTo(x0, ty(v)); ctx.lineTo(x1, ty(v)); ctx.stroke();
      ctx.fillText(String(v).replace(".", ","), x0 - 5, ty(v));
    });
    ctx.textAlign = "center"; ctx.textBaseline = "top";
    xticks.forEach(v => ctx.fillText(String(v), tx(v), y1 + 5));
    ctx.strokeStyle = css("--muted");
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.lineTo(x1, y1); ctx.stroke();
    if (xlabel) { ctx.textAlign = "right"; ctx.fillText(xlabel, x1, y1 + 20); }
    if (ylabel) { ctx.textAlign = "left"; ctx.textBaseline = "bottom"; ctx.fillText(ylabel, x0 + 4, y0 - 4); }
    return { tx, ty };
  }
  function dashed(ctx, x0, y0, x1, y1, color) {
    ctx.save(); ctx.setLineDash([6, 5]); ctx.strokeStyle = color; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.restore();
  }

  /* log-faktoriális és binomiális együttható (lebegőpontos) */
  const LF = [0];
  const lfact = n => { for (let i = LF.length; i <= n; i++) LF[i] = LF[i - 1] + Math.log(i); return LF[n]; };
  const lC = (n, k) => (k < 0 || k > n ? -Infinity : lfact(n) - lfact(k) - lfact(n - k));
  const C = (n, k) => Math.round(Math.exp(lC(n, k)));
  const bigC = (n, k) => { if (k < 0 || k > n) return 0n; let r = 1n; for (let i = 1n; i <= BigInt(k); i++) r = r * (BigInt(n) - BigInt(k) + i) / i; return r; };
  const bigFact = n => { let r = 1n; for (let i = 2n; i <= BigInt(n); i++) r *= i; return r; };
  const groupDigits = s => String(s).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  const W = {}; // widget-regiszter

  /* ------------------------------------------------------------------
     1.1  Kockadobó – relatív gyakoriságok
     ------------------------------------------------------------------ */
  W["dice-roller"] = root => {
    header(root, "Dobókocka-szimulátor", "Dobj egyet, tízet vagy tízezret – és figyeld, hogyan kerülnek az oszlopok egyre közelebb a $\\tfrac16$-os szaggatott vonalhoz.");
    const counts = [0, 0, 0, 0, 0, 0];
    let n = 0, last = 1;
    const face = die(1);
    face.style.width = face.style.height = "64px";
    const ctr = h("div", { class: "controls" }, face,
      ...[1, 10, 100, 1000, 10000].map(k => btn(k === 1 ? "🎲 Dobj!" : `+${k}`, () => roll(k), k === 1 ? "btn primary" : "btn")),
      btn("Nulláz", () => { counts.fill(0); n = 0; upd(); }));
    root.append(ctr);
    const cv = makeCanvas(root, 0.42);
    const out = h("div", { class: "readout" });
    root.append(out);
    function roll(k) {
      for (let i = 0; i < k; i++) { last = rnd(6) + 1; counts[last - 1]++; }
      n += k;
      face.innerHTML = dieSVG(last);
      face.classList.remove("rolling"); void face.offsetWidth; face.classList.add("rolling");
      upd();
    }
    cv.draw = () => {
      const { ctx, w, h: H } = cv;
      ctx.clearRect(0, 0, w, H);
      const box = { x0: 40, y0: 18, x1: w - 10, y1: H - 26 };
      const ymax = n ? Math.max(0.35, ...counts.map(c => c / n)) : 0.35;
      const { ty } = axes(ctx, box, { xmin: 0, xmax: 6, ymin: 0, ymax, yticks: [0, 0.1, 0.2, 0.3].filter(v => v <= ymax), ylabel: "relatív gyakoriság" });
      const bw = (box.x1 - box.x0) / 6;
      counts.forEach((c, i) => {
        const v = n ? c / n : 0;
        ctx.fillStyle = css("--accent");
        ctx.globalAlpha = 0.85;
        ctx.fillRect(box.x0 + i * bw + bw * 0.15, ty(v), bw * 0.7, box.y1 - ty(v));
        ctx.globalAlpha = 1;
        ctx.fillStyle = css("--text"); ctx.textAlign = "center"; ctx.textBaseline = "top";
        ctx.font = "bold 13px system-ui"; ctx.fillText(i + 1, box.x0 + i * bw + bw / 2, box.y1 + 5);
        if (n) { ctx.font = "11px system-ui"; ctx.textBaseline = "bottom"; ctx.fillStyle = css("--muted"); ctx.fillText(fmt(v, 3), box.x0 + i * bw + bw / 2, ty(v) - 2); }
      });
      dashed(ctx, box.x0, ty(1 / 6), box.x1, ty(1 / 6), css("--bad"));
    };
    function upd() {
      cv.draw();
      const dev = n ? Math.max(...counts.map(c => Math.abs(c / n - 1 / 6))) : 0;
      out.innerHTML = n
        ? `Dobások száma: <b>${n}</b> · gyakoriságok: ${counts.join(", ")} · legnagyobb eltérés $1/6$-tól: <b>${fmt(dev, 4)}</b>`
        : "Még nem dobtál. Kattints a gombokra!";
      window.Synopsis && Synopsis.renderMath(out);
    }
    upd();
  };

  /* ------------------------------------------------------------------
     1.2  Két kocka – 6×6-os eseménytér
     ------------------------------------------------------------------ */
  const TWO_EVENTS = [
    ["(nincs)", null],
    ...Array.from({ length: 11 }, (_, i) => [`összeg = ${i + 2}`, (a, b) => a + b === i + 2]),
    ["összeg ≥ 10", (a, b) => a + b >= 10],
    ["összeg páros", (a, b) => (a + b) % 2 === 0],
    ["dupla (a két szám egyenlő)", (a, b) => a === b],
    ["legalább egy 6-os", (a, b) => a === 6 || b === 6],
    ["legalább egy 2-es", (a, b) => a === 2 || b === 2],
    ["a piros nagyobb, mint a kék", (a, b) => a > b],
    ["a két szám különbsége ≤ 1", (a, b) => Math.abs(a - b) <= 1],
    ["szorzat páros", (a, b) => (a * b) % 2 === 0]
  ];
  W["two-dice"] = root => {
    header(root, "Két kocka eseménytere", "Sorok: a <b>piros</b> kocka, oszlopok: a <b>kék</b> kocka. Mind a 36 cella egyformán valószínű. Válassz egy <span class='chip a'>A</span> és (ha akarsz) egy <span class='chip b'>B</span> eseményt!");
    const mk = def => { const s = h("select"); TWO_EVENTS.forEach(([l], i) => s.append(h("option", { value: i }, l))); s.value = def; return s; };
    const sA = mk(6), sB = mk(0);
    root.append(h("div", { class: "controls" }, h("label", null, "A: ", sA), h("label", null, "B: ", sB)));
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
      const fA = TWO_EVENTS[sA.value][1], fB = TWO_EVENTS[sB.value][1];
      let nA = 0, nB = 0, nAB = 0, nU = 0;
      cells.forEach(([i, j, c]) => {
        const a = fA ? fA(i, j) : false, b = fB ? fB(i, j) : false;
        c.classList.toggle("hit", a); c.classList.toggle("hit2", b);
        nA += a; nB += b; nAB += a && b; nU += a || b;
      });
      let s = `$|A| = ${nA}$, &nbsp; $P(A) = ${frac(nA, 36).replace(/(\d+)\/(\d+)/, "\\tfrac{$1}{$2}")}$`;
      if (fB) s += ` · $P(B) = ${frac(nB, 36).replace(/(\d+)\/(\d+)/, "\\tfrac{$1}{$2}")}$ · $P(AB) = ${frac(nAB, 36).replace(/(\d+)\/(\d+)/, "\\tfrac{$1}{$2}")}$ · $P(A+B) = ${frac(nU, 36).replace(/(\d+)\/(\d+)/, "\\tfrac{$1}{$2}")}$`
        + (nAB === 0 && nA && nB ? " · <b>A és B kizárják egymást!</b>" : "");
      out.innerHTML = s;
      window.Synopsis && Synopsis.renderMath(out);
    }
    sA.onchange = sB.onchange = upd;
    upd();
  };

  /* ------------------------------------------------------------------
     1.2.1  Eseménylabor – műveletek kockadobással
     ------------------------------------------------------------------ */
  const DIE_EVENTS = [
    ["A", "páratlan", [1, 3, 5]],
    ["B", "páros", [2, 4, 6]],
    ["C", "prím", [2, 3, 5]],
    ["D", "3-nál nagyobb", [4, 5, 6]],
    ["E", "legfeljebb 2", [1, 2]],
    ["Ω", "biztos esemény", [1, 2, 3, 4, 5, 6]],
    ["∅", "lehetetlen esemény", []]
  ];
  W["event-lab"] = root => {
    header(root, "Eseménylabor", "Egy kockadobás eseményeivel számolunk. Válaszd ki a két eseményt, (ha kell) vedd az ellentettjüket, és válassz műveletet.");
    const selE = def => { const s = h("select"); DIE_EVENTS.forEach(([k, d], i) => s.append(h("option", { value: i }, `${k} – ${d}`))); s.value = def; return s; };
    const s1 = selE(0), s2 = selE(2);
    const n1 = h("input", { type: "checkbox" }), n2 = h("input", { type: "checkbox" });
    const op = h("select");
    [["∪", "összeg (∪, vagy)"], ["∩", "szorzat (∩, és)"], ["\\", "különbség (\\)"], ["-", "csak az első esemény"]].forEach(([v, l]) => op.append(h("option", { value: v }, l)));
    const negAll = h("input", { type: "checkbox" });
    root.append(
      h("div", { class: "controls" }, h("label", null, n1, "ellentett"), s1, op, h("label", null, n2, "ellentett"), s2),
      h("div", { class: "controls" }, h("label", null, negAll, "az egész kifejezés ellentettje"))
    );
    const row = h("div", { class: "dice-row" });
    const dice = [1, 2, 3, 4, 5, 6].map(n => { const d = die(n); row.append(d); return d; });
    root.append(row);
    const out = h("div", { class: "readout" });
    root.append(out);
    function upd() {
      const [k1, d1, set1] = DIE_EVENTS[s1.value], [k2, d2, set2] = DIE_EVENTS[s2.value];
      const X = new Set(n1.checked ? [1, 2, 3, 4, 5, 6].filter(x => !set1.includes(x)) : set1);
      const Y = new Set(n2.checked ? [1, 2, 3, 4, 5, 6].filter(x => !set2.includes(x)) : set2);
      const o = op.value;
      let R = [1, 2, 3, 4, 5, 6].filter(x => o === "∪" ? X.has(x) || Y.has(x) : o === "∩" ? X.has(x) && Y.has(x) : o === "\\" ? X.has(x) && !Y.has(x) : X.has(x));
      if (negAll.checked) R = [1, 2, 3, 4, 5, 6].filter(x => !R.includes(x));
      dice.forEach((d, i) => d.classList.toggle("hit", R.includes(i + 1)));
      const t1 = n1.checked ? `\\overline{${k1}}` : k1, t2 = n2.checked ? `\\overline{${k2}}` : k2;
      const opT = { "∪": "\\cup", "∩": "\\cap", "\\": "\\setminus" }[o];
      let expr = o === "-" ? t1 : `${t1} ${opT} ${t2}`;
      if (negAll.checked) expr = `\\overline{${expr}}`;
      const setT = R.length ? `\\{${R.join(", ")}\\}` : "\\emptyset";
      const w1 = (n1.checked ? "nem " : "") + d1, w2 = (n2.checked ? "nem " : "") + d2;
      const words = o === "-" ? w1 : o === "∪" ? `${w1} VAGY ${w2}` : o === "∩" ? `${w1} ÉS ${w2}` : `${w1}, DE NEM ${w2}`;
      out.innerHTML = `${tex(expr + " = " + setT)} &nbsp;·&nbsp; szavakkal: <b>${negAll.checked ? "nem igaz, hogy (" + words + ")" : words}</b> &nbsp;·&nbsp; valószínűség: ${tex(`\\tfrac{${R.length}}{6}`)}`;
    }
    [s1, s2, n1, n2, op, negAll].forEach(e => (e.onchange = upd));
    upd();
    root.append(h("p", { class: "muted", style: "font-size:.88rem;margin:.6rem 0 0", html: "🔍 Próbáld ki: $\\overline{A \\cup C}$ (egész kifejezés ellentettje) és $\\overline{A} \\cap \\overline{C}$ ugyanazt adja – ez a De Morgan-azonosság!" }));
  };

  /* ------------------------------------------------------------------
     1.2.1  Venn-játék – satírozd be az eseményt
     ------------------------------------------------------------------ */
  const VENN_TASKS = [
    { t: "A \\cup B", sets: 2, f: (a, b) => a || b },
    { t: "A \\cap B", sets: 2, f: (a, b) => a && b },
    { t: "A \\setminus B", sets: 2, f: (a, b) => a && !b },
    { t: "\\overline{B}", sets: 2, f: (a, b) => !b },
    { t: "\\overline{A \\cup B}", sets: 2, f: (a, b) => !(a || b) },
    { t: "\\overline{A} \\cup \\overline{B}", sets: 2, f: (a, b) => !a || !b },
    { t: "A\\overline{B} + \\overline{A}B \\;\\text{(pontosan az egyik)}", sets: 2, f: (a, b) => a !== b },
    { t: "(A \\cup B) \\cap C", sets: 3, f: (a, b, c) => (a || b) && c },
    { t: "A \\cap B \\cap \\overline{C}", sets: 3, f: (a, b, c) => a && b && !c },
    { t: "A \\cup (B \\cap C)", sets: 3, f: (a, b, c) => a || (b && c) },
    { t: "\\overline{A \\cup B \\cup C}", sets: 3, f: (a, b, c) => !(a || b || c) },
    { t: "\\text{legalább kettő következik be}", sets: 3, f: (a, b, c) => a + b + c >= 2 }
  ];
  W["venn-game"] = root => {
    header(root, "Venn-kihívás", "Kattints a tartományokra a be- és kisatírozáshoz, majd nyomd meg az Ellenőrzés gombot. A téglalap a teljes $\\Omega$ eseménytér.");
    let ti = 0, score = 0, tried = new Set();
    const task = h("div", { style: "font-size:1.1rem;margin:.3rem 0" });
    root.append(task);
    const cv = makeCanvas(root, 0.55, 560);
    cv.c.style.cursor = "pointer";
    const fb = h("div", { class: "readout" });
    const ctr = h("div", { class: "controls" },
      btn("← Előző", () => go(-1)), btn("Ellenőrzés", check, "btn primary"), btn("Megoldás mutatása", solve), btn("Törlés", () => { shaded.clear(); cv.draw(); }), btn("Következő →", () => go(1)));
    root.append(ctr, fb);
    let shaded = new Set();
    let geom = null, maskMap = null;

    function layout() {
      const { w, h: H } = cv, n = VENN_TASKS[ti].sets;
      const r = H * (n === 2 ? 0.33 : 0.27);
      const cx = w / 2, cy = H / 2;
      const circles = n === 2
        ? [[cx - r * 0.6, cy, r], [cx + r * 0.6, cy, r]]
        : [[cx - r * 0.55, cy - r * 0.35, r], [cx + r * 0.55, cy - r * 0.35, r], [cx, cy + r * 0.6, r]];
      geom = { circles, rect: [10, 10, w - 20, H - 20] };
      const dpr = cv.dpr, W_ = cv.c.width, H_ = cv.c.height;
      maskMap = new Uint8Array(W_ * H_);
      for (let y = 0; y < H_; y++) for (let x = 0; x < W_; x++) {
        let m = 0;
        circles.forEach(([ccx, ccy, rr], k) => { const dx = x / dpr - ccx, dy = y / dpr - ccy; if (dx * dx + dy * dy <= rr * rr) m |= 1 << k; });
        maskMap[y * W_ + x] = m;
      }
    }
    let lastKey = "";
    cv.draw = () => {
      const key = [cv.c.width, cv.c.height, VENN_TASKS[ti].sets].join(":");
      if (key !== lastKey) { layout(); lastKey = key; } // a tartomány-térkép csak méret-/feladatváltáskor készül újra
      const { ctx, h: H } = cv;
      const W_ = cv.c.width, H_ = cv.c.height;
      const img = ctx.createImageData(W_, H_);
      const hex = c => { const m = c.match(/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i); return m ? m.slice(1).map(x => parseInt(x, 16)) : [120, 120, 255]; };
      const acc = hex(css("--accent")), bg = hex(css("--card").length === 7 ? css("--card") : "#ffffff");
      const [rx, ry, rw, rh] = geom.rect.map(v => v * cv.dpr);
      for (let y = 0; y < H_; y++) for (let x = 0; x < W_; x++) {
        const i = (y * W_ + x) * 4;
        const inRect = x >= rx && x <= rx + rw && y >= ry && y <= ry + rh;
        const col = inRect && shaded.has(maskMap[y * W_ + x]) ? acc.map((v, k) => Math.round(v * 0.55 + bg[k] * 0.45)) : bg;
        img.data[i] = col[0]; img.data[i + 1] = col[1]; img.data[i + 2] = col[2]; img.data[i + 3] = inRect ? 255 : 0;
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, W_, H_);
      ctx.putImageData(img, 0, 0);
      ctx.setTransform(cv.dpr, 0, 0, cv.dpr, 0, 0);
      ctx.strokeStyle = css("--text"); ctx.lineWidth = 1.5;
      ctx.strokeRect(...geom.rect);
      const cols = [css("--setA"), css("--setB"), css("--setC")];
      const names = ["A", "B", "C"];
      geom.circles.forEach(([x, y, r], k) => {
        ctx.strokeStyle = cols[k]; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.stroke();
        ctx.fillStyle = cols[k]; ctx.font = "bold 18px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        const lx = k === 0 ? x - r * 0.95 : k === 1 ? x + r * 0.95 : x;
        const ly = k === 2 ? y + r + 2 : y - r * 0.9;
        ctx.fillText(names[k], lx, Math.min(Math.max(ly, 22), H - 18));
      });
      ctx.fillStyle = css("--muted"); ctx.font = "bold 16px system-ui"; ctx.textAlign = "left";
      ctx.fillText("Ω", 18, 26);
    };
    cv.c.addEventListener("click", e => {
      const r = cv.c.getBoundingClientRect();
      const x = Math.round((e.clientX - r.left) * cv.dpr), y = Math.round((e.clientY - r.top) * cv.dpr);
      const m = maskMap[y * cv.c.width + x];
      if (m === undefined) return;
      shaded.has(m) ? shaded.delete(m) : shaded.add(m);
      fb.innerHTML = "";
      cv.draw();
    });
    const target = () => {
      const T = VENN_TASKS[ti], s = new Set();
      for (let m = 0; m < 1 << T.sets; m++) if (T.f(!!(m & 1), !!(m & 2), !!(m & 4))) s.add(m);
      return s;
    };
    function check() {
      const t = target();
      const ok = t.size === shaded.size && [...t].every(m => shaded.has(m));
      if (ok && !tried.has(ti)) { score++; }
      tried.add(ti);
      fb.innerHTML = (ok ? "✔ <b>Helyes!</b> " : "✘ <b>Még nem jó.</b> Nézd meg újra, vagy kérd a megoldást. ") + `Pontszám: ${score}/${VENN_TASKS.length}`;
    }
    function solve() { shaded = target(); tried.add(ti); cv.draw(); fb.innerHTML = "Így néz ki a helyes satírozás."; }
    function go(d) { ti = (ti + d + VENN_TASKS.length) % VENN_TASKS.length; shaded = new Set(); fb.innerHTML = ""; show(); }
    function show() { task.innerHTML = `<b>${ti + 1}/${VENN_TASKS.length}.</b> Satírozd be: ${tex(VENN_TASKS[ti].t)}`; cv.draw(); }
    show();
  };

  /* ------------------------------------------------------------------
     1.3.1  Relatív gyakoriság stabilizálódása
     ------------------------------------------------------------------ */
  const EXPS = [
    ["Érmedobás: fej", 1 / 2, () => Math.random() < 0.5],
    ["Kockadobás: hatos", 1 / 6, () => rnd(6) === 5],
    ["Két kocka: az összeg 7", 1 / 6, () => rnd(6) + rnd(6) + 2 === 7],
    ["Két kocka: dupla hatos", 1 / 36, () => rnd(6) === 5 && rnd(6) === 5],
    ["Három érme: legalább egy fej", 7 / 8, () => Math.random() < 0.5 || Math.random() < 0.5 || Math.random() < 0.5]
  ];
  W["relfreq"] = root => {
    header(root, "A relatív gyakoriság stabilitása", "Három független kísérletsorozat fut egyszerre (három szín). A vízszintes tengely logaritmikus. A szaggatott vonal az elméleti valószínűség.");
    const sel = h("select");
    EXPS.forEach(([l], i) => sel.append(h("option", { value: i }, l)));
    const MAXN = 20000;
    let runs, timer = null;
    const playB = btn("▶ Lejátszás", () => toggle(), "btn primary");
    root.append(h("div", { class: "controls" }, h("label", null, "Kísérlet: ", sel)),
      h("div", { class: "controls" }, ...[1, 10, 100, 1000].map(k => btn(`+${k}`, () => step(k))), playB, btn("Nulláz", reset)));
    const cv = makeCanvas(root, 0.5);
    const out = h("div", { class: "stat-row" });
    root.append(out);
    function reset() { runs = [0, 1, 2].map(() => ({ k: 0, n: 0, hist: [] })); stop(); cv.draw(); stats(); }
    function step(k) {
      const f = EXPS[sel.value][2];
      runs.forEach(r => { for (let i = 0; i < k && r.n < MAXN; i++) { r.n++; r.k += f(); r.hist.push(r.k / r.n); } });
      cv.draw(); stats();
      if (runs[0].n >= MAXN) stop();
    }
    function toggle() { if (timer) stop(); else { timer = setInterval(() => step(Math.max(1, Math.floor(runs[0].n / 25))), 40); playB.textContent = "⏸ Szünet"; } }
    function stop() { clearInterval(timer); timer = null; playB.textContent = "▶ Lejátszás"; }
    sel.onchange = reset;
    cv.draw = () => {
      const { ctx, w, h: H } = cv;
      ctx.clearRect(0, 0, w, H);
      const p = EXPS[sel.value][1];
      const n = Math.max(10, runs[0].n);
      const xmax = Math.pow(10, Math.ceil(Math.log10(n)));
      const box = { x0: 40, y0: 18, x1: w - 12, y1: H - 32 };
      const xt = []; for (let v = 1; v <= xmax; v *= 10) xt.push(v);
      const { tx, ty } = axes(ctx, box, { xmin: 1, xmax, ymin: 0, ymax: 1, xlog: true, xticks: xt, yticks: [0, 0.25, 0.5, 0.75, 1], xlabel: "kísérletek száma (n)", ylabel: "k / n" });
      dashed(ctx, box.x0, ty(p), box.x1, ty(p), css("--bad"));
      [css("--setA"), css("--setB"), css("--setC")].forEach((col, j) => {
        const hist = runs[j].hist;
        if (!hist.length) return;
        ctx.strokeStyle = col; ctx.lineWidth = 1.6; ctx.beginPath();
        const stepN = Math.max(1, Math.floor(hist.length / 1500));
        for (let i = 0; i < hist.length; i += stepN) { const x = tx(i + 1), y = ty(hist[i]); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
        ctx.lineTo(tx(hist.length), ty(hist[hist.length - 1]));
        ctx.stroke();
      });
    };
    function stats() {
      const p = EXPS[sel.value][1];
      const r = runs[0];
      out.innerHTML = [
        ["n", r.n], ["k (1. sorozat)", r.k], ["k/n", r.n ? fmt(r.k / r.n, 4) : "–"], ["elméleti P", fmt(p, 4)],
        ["eltérés", r.n ? fmt(Math.abs(r.k / r.n - p), 4) : "–"]
      ].map(([l, v]) => `<div class="stat"><div class="v">${v}</div><div class="l">${l}</div></div>`).join("");
    }
    reset();
  };

  /* ------------------------------------------------------------------
     1.3.2  Összeadási tétel – szakaszos szemléltetés
     ------------------------------------------------------------------ */
  W["addition"] = root => {
    header(root, "Összeadási tétel", "A teljes szakasz az $\\Omega$ (hossza 1). Az $A$ és $B$ szakasz hossza a valószínűségük, az átfedés $P(AB)$.");
    const mk = (v) => h("input", { type: "range", min: 0, max: 1, step: 0.01, value: v });
    const ra = mk(0.5), rb = mk(0.4), rab = mk(0.15);
    const la = h("b"), lb = h("b"), lab = h("b");
    root.append(h("div", { class: "controls" },
      h("label", null, h("span", { class: "chip a" }, "P(A)"), ra, la),
      h("label", null, h("span", { class: "chip b" }, "P(B)"), rb, lb),
      h("label", null, "P(AB)", rab, lab)));
    const vis = h("div", { style: "position:relative;height:96px;margin:.8rem 0;border:2px solid var(--muted);border-radius:6px;background:var(--bg-soft)" });
    const barA = h("div", { style: "position:absolute;top:10px;height:30px;background:var(--setA);opacity:.8;border-radius:4px" });
    const barB = h("div", { style: "position:absolute;top:52px;height:30px;background:var(--setB);opacity:.8;border-radius:4px" });
    const ov = h("div", { style: "position:absolute;top:0;bottom:0;background:repeating-linear-gradient(45deg,rgba(0,0,0,.18) 0 6px,transparent 6px 12px);border-left:2px dashed var(--text);border-right:2px dashed var(--text)" });
    vis.append(barA, barB, ov);
    root.append(vis);
    const out = h("div", { class: "readout" });
    root.append(out);
    function upd(src) {
      let a = +ra.value, b = +rb.value, ab = +rab.value;
      const lo = Math.max(0, a + b - 1), hi = Math.min(a, b);
      if (ab < lo || ab > hi) { ab = Math.min(hi, Math.max(lo, ab)); rab.value = ab; }
      la.textContent = fmt(a, 2); lb.textContent = fmt(b, 2); lab.textContent = fmt(ab, 2);
      const bStart = a - ab;
      barA.style.left = "0%"; barA.style.width = a * 100 + "%";
      barB.style.left = bStart * 100 + "%"; barB.style.width = b * 100 + "%";
      ov.style.left = bStart * 100 + "%"; ov.style.width = ab * 100 + "%"; ov.style.display = ab > 0 ? "" : "none";
      const u = a + b - ab;
      out.innerHTML = tex(`P(A+B) = ${fmt(a, 2)} + ${fmt(b, 2)} - ${fmt(ab, 2)} = ${fmt(u, 2)}`.replace(/,/g, "{,}"))
        + (ab === 0 ? " &nbsp;— <b>kizáró események</b>: egyszerűen összeadódnak." : "")
        + (Math.abs(u - 1) < 1e-9 ? " &nbsp;— $A+B$ lefedi az egész $\\Omega$-t." : "")
        + `<br><small>A $P(AB)$ csúszka csak a lehetséges tartományban mozoghat: $\\max(0, P(A)+P(B)-1) \\le P(AB) \\le \\min(P(A), P(B))$.</small>`;
      window.Synopsis && Synopsis.renderMath(out);
    }
    [ra, rb, rab].forEach(r => (r.oninput = upd));
    upd();
  };

  /* ------------------------------------------------------------------
     1.4  Valószínűségi mező építő – cinkelt kocka
     ------------------------------------------------------------------ */
  W["field-builder"] = root => {
    header(root, "Valószínűségi mező építő", "Állítsd be a lapok súlyát! Kattints a kockákra, hogy összeállíts egy eseményt – a program kiszámolja a valószínűségét.");
    const wts = [1, 1, 1, 1, 1, 1];
    const presets = [["Szabályos", [1, 1, 1, 1, 1, 1]], ["Pontszámmal arányos", [1, 2, 3, 4, 5, 6]], ["A hatos duplán", [1, 1, 1, 1, 1, 2]], ["Véletlen", null]];
    root.append(h("div", { class: "controls" }, ...presets.map(([l, v]) => btn(l, () => { const vv = v || wts.map(() => 1 + rnd(9)); vv.forEach((x, i) => (wts[i] = x, sliders[i].value = x)); upd(); }))));
    const tbl = h("div", { style: "display:grid;grid-template-columns:repeat(6,1fr);gap:.5rem;text-align:center" });
    const dice = [], sliders = [], labels = [];
    const sel = new Set([2, 4, 6]);
    for (let i = 0; i < 6; i++) {
      const d = die(i + 1, "clickable"); d.style.margin = "0 auto";
      d.onclick = () => { sel.has(i + 1) ? sel.delete(i + 1) : sel.add(i + 1); upd(); };
      const s = h("input", { type: "range", min: 0, max: 10, step: 1, value: 1, style: "width:100%" });
      s.oninput = () => { wts[i] = +s.value; upd(); };
      const l = h("div", { style: "font-family:var(--mono);font-size:.85rem" });
      dice.push(d); sliders.push(s); labels.push(l);
      tbl.append(h("div", null, d, s, l));
    }
    root.append(tbl);
    root.append(h("div", { class: "controls" }, "Gyors események: ",
      ...[["páros", [2, 4, 6]], ["páratlan", [1, 3, 5]], ["prím", [2, 3, 5]], ["> 3", [4, 5, 6]], ["mind", [1, 2, 3, 4, 5, 6]], ["egyik sem", []]]
        .map(([l, s]) => btn(l, () => { sel.clear(); s.forEach(x => sel.add(x)); upd(); }))));
    const out = h("div", { class: "readout" });
    const simOut = h("div", { class: "muted", style: "font-size:.9rem;margin-top:.4rem" });
    root.append(out, h("div", { class: "controls" }, btn("🎲 Szimulálj 6000 dobást ezzel a kockával", sim)), simOut);
    function upd() {
      const S = wts.reduce((a, b) => a + b, 0);
      labels.forEach((l, i) => (l.innerHTML = S ? `w=${wts[i]}<br>p=${frac(wts[i], S)}<br>≈${fmt(wts[i] / S, 3)}` : "–"));
      dice.forEach((d, i) => d.classList.toggle("hit", sel.has(i + 1)));
      if (!S) { out.innerHTML = "⚠️ Minden súly 0 – így nem lesz valószínűségi mező (az összeg nem lehet 1)!"; return; }
      const ev = [...sel].sort();
      const ksum = ev.reduce((a, x) => a + wts[x - 1], 0);
      out.innerHTML = `Súlyok összege: ${S} → $p_i = w_i / ${S}$, &nbsp; $\\sum p_i = 1$ ✓<br>` +
        `Esemény: $\\{${ev.join(", ") || "\\,"}\\}$ &nbsp; → &nbsp; $P = ${ev.length ? ev.map(x => `p_${x}`).join(" + ") : "0"} = ${frac(ksum, S).replace(/(\d+)\/(\d+)/, "\\tfrac{$1}{$2}")} \\approx ${fmt(ksum / S, 4).replace(",", "{,}")}$`;
      window.Synopsis && Synopsis.renderMath(out);
      simOut.textContent = "";
    }
    function sim() {
      const S = wts.reduce((a, b) => a + b, 0); if (!S) return;
      let hit = 0;
      for (let t = 0; t < 6000; t++) { let r = Math.random() * S, f = 0; while (r >= wts[f]) { r -= wts[f]; f++; } if (sel.has(f + 1)) hit++; }
      simOut.textContent = `6000 dobásból az esemény ${hit}-szer következett be → relatív gyakoriság ${fmt(hit / 6000, 4)} (elméleti érték: ${fmt([...sel].reduce((a, x) => a + wts[x - 1], 0) / S, 4)})`;
    }
    upd();
  };

  /* ------------------------------------------------------------------
     1.4.2  Kombinatorika-varázsló
     ------------------------------------------------------------------ */
  W["comb-wizard"] = root => {
    header(root, "Kombinatorika-varázsló", "Válaszolj a két kérdésre, add meg $n$-et és $k$-t! Kis számoknál (az elemek A, B, C, … betűk) az összes lehetőséget is kilistázzuk.");
    const mode = h("select");
    mode.append(h("option", { value: "sel" }, "n elemből k-t választok / rakok sorba"), h("option", { value: "word" }, "egy szó betűit rendezem sorba (ismétléses permutáció)"));
    root.append(h("div", { class: "controls" }, h("label", null, "Feladattípus: ", mode)));
    const selBox = h("div"), wordBox = h("div");
    root.append(selBox, wordBox);
    const tog = (a, b) => { a.classList.add("on"); b.classList.remove("on"); };
    let order = true, rep = false;
    const oY = btn("igen", () => { order = true; tog(oY, oN); upd(); }), oN = btn("nem", () => { order = false; tog(oN, oY); upd(); });
    const rY = btn("igen", () => { rep = true; tog(rY, rN); upd(); }), rN = btn("nem", () => { rep = false; tog(rN, rY); upd(); });
    oY.classList.add("on"); rN.classList.add("on");
    const nI = h("input", { type: "number", min: 1, max: 100, value: 4 }), kI = h("input", { type: "number", min: 0, max: 100, value: 2 });
    selBox.append(
      h("div", { class: "wizard-q" }, h("span", null, "1. Számít a sorrend?"), oY, oN),
      h("div", { class: "wizard-q" }, h("span", null, "2. Választható egy elem többször is (ismétlés)?"), rY, rN),
      h("div", { class: "controls" }, h("label", null, "n =", nI), h("label", null, "k =", kI)));
    const wI = h("input", { type: "text", value: "MATEMATIKA", style: "width:14em" });
    wordBox.append(h("div", { class: "controls" }, h("label", null, "Szó: ", wI)));
    const res = h("div", { class: "formula-out" });
    const lst = h("div", { class: "enum-list" });
    const note = h("div", { class: "muted", style: "font-size:.88rem;margin-top:.4rem" });
    root.append(res, note, lst);

    function enumerate(n, k) {
      const L = "ABCDEFGHIJ".slice(0, n).split(""), out = [];
      const rec = (cur, start, used) => {
        if (out.length > 500) return;
        if (cur.length === k) { out.push(cur.join("")); return; }
        for (let i = order ? 0 : start; i < n; i++) {
          if (!rep && used[i]) continue;
          used[i] = true; cur.push(L[i]);
          rec(cur, rep ? i : i + 1, used);
          cur.pop(); used[i] = false;
        }
      };
      rec([], 0, []);
      return out;
    }
    function upd() {
      const isWord = mode.value === "word";
      selBox.style.display = isWord ? "none" : ""; wordBox.style.display = isWord ? "" : "none";
      lst.innerHTML = ""; note.textContent = "";
      if (isWord) {
        const w = wI.value.toUpperCase().replace(/\s/g, "");
        if (!w) { res.innerHTML = "Írj be egy szót!"; return; }
        const cnt = {}; [...w].forEach(c => (cnt[c] = (cnt[c] || 0) + 1));
        const reps = Object.entries(cnt).filter(([, v]) => v > 1);
        let r = bigFact(w.length); reps.forEach(([, v]) => (r /= bigFact(v)));
        const den = reps.length ? reps.map(([, v]) => `${v}!`).join("\\,") : "1";
        res.innerHTML = tex(`P_{${w.length}}^{(${Object.values(cnt).join(",")})} = \\frac{${w.length}!}{${den}} = ${groupDigits(r.toString()).replace(/ /g, "\\,")}`, true);
        note.textContent = "Ismétlődő betűk: " + (reps.map(([c, v]) => `${c}×${v}`).join(", ") || "nincs – ekkor egyszerűen n!");
        if (w.length <= 7) {
          const set = new Set(); const a = [...w];
          const perm = (cur, used) => { if (cur.length === a.length) { set.add(cur.join("")); return; } for (let i = 0; i < a.length; i++) if (!used[i]) { used[i] = true; cur.push(a[i]); perm(cur, used); cur.pop(); used[i] = false; } };
          perm([], []);
          if (set.size <= 500) [...set].forEach(s => lst.append(h("span", null, s)));
        }
        return;
      }
      const n = Math.max(1, Math.min(100, +nI.value || 1)), k = Math.max(0, Math.min(100, +kI.value || 0));
      let name, formula, val;
      if (order && !rep) {
        if (k > n) { res.innerHTML = "Ismétlés nélkül nem választhatunk több elemet, mint amennyi van ($k \\le n$ kell)!"; window.Synopsis && Synopsis.renderMath(res); return; }
        val = bigFact(n) / bigFact(n - k);
        if (k === n) { name = "ismétlés nélküli permutáció"; formula = `P_{${n}} = ${n}!`; }
        else { name = "ismétlés nélküli variáció"; formula = `V_{${n}}^{${k}} = \\frac{${n}!}{(${n}-${k})!}`; }
      } else if (order && rep) { name = "ismétléses variáció"; val = BigInt(n) ** BigInt(k); formula = `V_{${n}}^{${k},(i)} = ${n}^{${k}}`; }
      else if (!order && !rep) {
        if (k > n) { res.innerHTML = "Ismétlés nélkül $k \\le n$ kell!"; window.Synopsis && Synopsis.renderMath(res); return; }
        name = "ismétlés nélküli kombináció"; val = bigC(n, k); formula = `C_{${n}}^{${k}} = \\binom{${n}}{${k}}`;
      } else { name = "ismétléses kombináció"; val = bigC(n + k - 1, k); formula = `C_{${n}}^{${k},(i)} = \\binom{${n}+${k}-1}{${k}} = \\binom{${n + k - 1}}{${k}}`; }
      res.innerHTML = `<div style="font-size:.9rem;color:var(--muted)">${name}</div>` + tex(`${formula} = ${groupDigits(val.toString()).replace(/ /g, "\\,")}`, true);
      if (n <= 10 && val <= 500n) {
        const items = enumerate(n, k);
        note.textContent = `Az összes ${items.length} lehetőség (elemek: ${"ABCDEFGHIJ".slice(0, n).split("").join(", ")}):`;
        items.forEach(s => lst.append(h("span", null, s || "∅")));
      } else note.textContent = "(Túl sok lehetőség a listázáshoz – csökkentsd n-et vagy k-t, ha látni szeretnéd őket.)";
    }
    [nI, kI, wI].forEach(e => (e.oninput = upd));
    mode.onchange = upd;
    upd();
  };

  /* ------------------------------------------------------------------
     1.4.2  Mintavétel visszatevéssel / nélkül
     ------------------------------------------------------------------ */
  W["sampling"] = root => {
    header(root, "Visszatevéses vs. visszatevés nélküli mintavétel", "$N$ termék, köztük $K$ hibás; $n$ elemű mintát veszünk. Az oszlopok a „pontosan $h$ hibás” valószínűségét mutatják.");
    const mk = (min, max, v) => h("input", { type: "range", min, max, step: 1, value: v });
    const rN = mk(5, 500, 20), rK = mk(0, 20, 6), rn = mk(1, 20, 3);
    const lN = h("b"), lK = h("b"), ln = h("b");
    root.append(h("div", { class: "controls" }, h("label", null, "N", rN, lN), h("label", null, "K", rK, lK), h("label", null, "n", rn, ln)),
      h("div", { class: "controls" }, "Előbeállítás: ",
        btn("Csavarok (20, 6, 3)", () => set(20, 6, 3)), btn("Kék szemű lányok (11, 3, 6)", () => set(11, 3, 6)),
        btn("Nagy raktár (500, 100, 10)", () => set(500, 100, 10))));
    function set(N, K, n) { rN.value = N; upd(); rK.value = K; rn.value = n; upd(); }
    const cv = makeCanvas(root, 0.45);
    const out = h("div", { class: "readout" });
    root.append(out);
    let hyp = [], bin = [];
    function upd() {
      const N = +rN.value; rK.max = N; rn.max = Math.min(N, 20);
      const K = Math.min(+rK.value, N), n = Math.min(+rn.value, N);
      lN.textContent = N; lK.textContent = K; ln.textContent = n;
      const p = K / N;
      hyp = []; bin = [];
      for (let k = 0; k <= n; k++) {
        hyp.push(Math.exp(lC(K, k) + lC(N - K, n - k) - lC(N, n)) || 0);
        bin.push(Math.exp(lC(n, k)) * Math.pow(p, k) * Math.pow(1 - p, n - k));
      }
      cv.draw();
      const md = Math.max(...hyp.map((v, i) => Math.abs(v - bin[i])));
      out.innerHTML = `Selejtarány $p = K/N = ${fmt(p, 3).replace(",", "{,}")}$ · legnagyobb eltérés a két eloszlás között: <b>${fmt(md, 4)}</b>` +
        `<br>Pl. $P(h = 0)$: visszatevés nélkül ${fmt(hyp[0], 4)}, visszatevéssel ${fmt(bin[0], 4)}`;
      window.Synopsis && Synopsis.renderMath(out);
    }
    cv.draw = () => {
      const { ctx, w, h: H } = cv;
      ctx.clearRect(0, 0, w, H);
      const n = hyp.length - 1;
      const ymax = Math.max(0.1, ...hyp, ...bin) * 1.1;
      const box = { x0: 40, y0: 24, x1: w - 10, y1: H - 26 };
      const yt = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1].filter(v => v <= ymax);
      const { ty } = axes(ctx, box, { xmin: 0, xmax: n + 1, ymin: 0, ymax, yticks: yt.length > 6 ? yt.filter((_, i) => i % 2 === 0) : yt });
      const bw = (box.x1 - box.x0) / (n + 1);
      for (let k = 0; k <= n; k++) {
        const x = box.x0 + k * bw;
        ctx.fillStyle = css("--setA"); ctx.fillRect(x + bw * 0.1, ty(hyp[k]), bw * 0.38, box.y1 - ty(hyp[k]));
        ctx.fillStyle = css("--setB"); ctx.fillRect(x + bw * 0.52, ty(bin[k]), bw * 0.38, box.y1 - ty(bin[k]));
        ctx.fillStyle = css("--text"); ctx.font = "11px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "top";
        ctx.fillText(k, x + bw / 2, box.y1 + 5);
      }
      ctx.font = "12px system-ui"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.fillStyle = css("--setA"); ctx.fillRect(box.x1 - 250, 6, 12, 12); ctx.fillStyle = css("--text"); ctx.fillText("visszatevés nélkül", box.x1 - 234, 12);
      ctx.fillStyle = css("--setB"); ctx.fillRect(box.x1 - 110, 6, 12, 12); ctx.fillStyle = css("--text"); ctx.fillText("visszatevéssel", box.x1 - 94, 12);
    };
    [rN, rK, rn].forEach(r => (r.oninput = upd));
    upd();
  };

  /* ------------------------------------------------------------------
     1.4.3  De Méré problémája
     ------------------------------------------------------------------ */
  W["demere"] = root => {
    header(root, "De Méré két fogadása", "Kék: legalább egy hatos $s$ dobásból (egy kocka). Narancs: legalább egy dupla hatos $s$ dobásból (két kocka). Hol metszik a görbék az $\\tfrac12$-et?");
    const rs = h("input", { type: "range", min: 1, max: 40, value: 4 });
    const ls = h("b");
    root.append(h("div", { class: "controls" }, h("label", null, "dobások száma s =", rs, ls)));
    const cv = makeCanvas(root, 0.45);
    const out = h("div", { class: "readout" });
    const simOut = h("div", { class: "readout" });
    root.append(out, h("div", { class: "controls" }, btn("🎰 Játssz le 10 000 fogadást mindkét játékban (4, ill. 24 dobással)", sim, "btn primary")), simOut);
    const f1 = s => 1 - Math.pow(5 / 6, s), f2 = s => 1 - Math.pow(35 / 36, s);
    cv.draw = () => {
      const { ctx, w, h: H } = cv;
      ctx.clearRect(0, 0, w, H);
      const box = { x0: 40, y0: 14, x1: w - 10, y1: H - 30 };
      const { tx, ty } = axes(ctx, box, { xmin: 0, xmax: 40, ymin: 0, ymax: 1, xticks: [0, 4, 10, 20, 24, 30, 40], yticks: [0, 0.25, 0.5, 0.75, 1], xlabel: "s" });
      dashed(ctx, box.x0, ty(0.5), box.x1, ty(0.5), css("--bad"));
      [[f1, css("--setA")], [f2, css("--setB")]].forEach(([f, col]) => {
        ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath();
        for (let s = 0; s <= 40; s += 0.25) { s ? ctx.lineTo(tx(s), ty(f(s))) : ctx.moveTo(tx(s), ty(f(s))); }
        ctx.stroke();
        for (let s = 1; s <= 40; s++) { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(tx(s), ty(f(s)), 2.2, 0, 7); ctx.fill(); }
      });
      const s = +rs.value;
      ctx.strokeStyle = css("--text"); ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.moveTo(tx(s), box.y0); ctx.lineTo(tx(s), box.y1); ctx.stroke(); ctx.setLineDash([]);
    };
    function upd() {
      const s = +rs.value; ls.textContent = s;
      const a = f1(s), b = f2(s);
      out.innerHTML = `Egy kocka: $1-(5/6)^{${s}} = ${fmt(a, 4).replace(",", "{,}")}$ ${a > 0.5 ? "✅ előnyös" : "❌ hátrányos"} &nbsp;|&nbsp; ` +
        `Két kocka: $1-(35/36)^{${s}} = ${fmt(b, 4).replace(",", "{,}")}$ ${b > 0.5 ? "✅ előnyös" : "❌ hátrányos"}`;
      window.Synopsis && Synopsis.renderMath(out);
      cv.draw();
    }
    function sim() {
      let w1 = 0, w2 = 0; const T = 10000;
      for (let t = 0; t < T; t++) {
        let ok = false; for (let i = 0; i < 4 && !ok; i++) ok = rnd(6) === 5; w1 += ok;
        ok = false; for (let i = 0; i < 24 && !ok; i++) ok = rnd(6) === 5 && rnd(6) === 5; w2 += ok;
      }
      simOut.innerHTML = `Egy kocka, 4 dobás: <b>${w1}</b> nyert fogadás (${pct(w1 / T)}) · Két kocka, 24 dobás: <b>${w2}</b> nyert fogadás (${pct(w2 / T)}). ` +
        `A különbség kicsi (≈2,6 százalékpont), de de Méré sok-sok játék alatt megérezte!`;
    }
    rs.oninput = upd;
    upd();
  };

  /* ------------------------------------------------------------------
     1.4.3  Pascal–Fermat: az osztozkodás problémája
     ------------------------------------------------------------------ */
  W["points-split"] = root => {
    header(root, "Igazságos osztozkodás", "Állítsd be, hány győzelem kell a teljes meccshez, és hány hiányzik még az egyes játékosoknak.");
    const kI = h("input", { type: "number", min: 1, max: 30, value: 10 }), nI = h("input", { type: "number", min: 1, max: 30, value: 2 }), mI = h("input", { type: "number", min: 1, max: 30, value: 4 });
    root.append(h("div", { class: "controls" }, h("label", null, "győzelem a meccshez:", kI), h("label", null, "Péternek hiányzik:", nI), h("label", null, "Pálnak hiányzik:", mI)));
    const bar = h("div", { style: "display:flex;height:34px;border-radius:8px;overflow:hidden;margin:.6rem 0;font-size:.85rem;font-weight:700;color:#fff" });
    const bP = h("div", { style: "background:var(--setA);display:flex;align-items:center;justify-content:center;transition:.3s" }), bQ = h("div", { style: "background:var(--setB);display:flex;align-items:center;justify-content:center;transition:.3s" });
    bar.append(bP, bQ);
    root.append(h("div", { class: "muted", style: "font-size:.85rem" }, "Igazságos elosztás (Pascal–Fermat):"), bar);
    const bar2 = bar.cloneNode(true);
    root.append(h("div", { class: "muted", style: "font-size:.85rem" }, "Elosztás a megnyert játszmák arányában:"), bar2);
    const out = h("div", { class: "readout" });
    root.append(out);
    function upd() {
      const k = Math.max(1, +kI.value || 1);
      const n = Math.min(k, Math.max(1, +nI.value || 1)), m = Math.min(k, Math.max(1, +mI.value || 1));
      const N = n + m - 1;
      let num = 0n; for (let i = n; i <= N; i++) num += bigC(N, i);
      const den = 2n ** BigInt(N);
      const p = Number(num) / Number(den);
      const g = (a, b) => (b ? g(b, a % b) : a); const gg = g(num, den);
      bP.style.width = p * 100 + "%"; bP.textContent = `Péter ${pct(p)}`;
      bQ.style.width = (1 - p) * 100 + "%"; bQ.textContent = `Pál ${pct(1 - p)}`;
      const wP = k - n, wQ = k - m, tot = wP + wQ;
      const q = tot ? wP / tot : 0.5;
      bar2.children[0].style.width = q * 100 + "%"; bar2.children[0].textContent = `Péter ${pct(q)}`;
      bar2.children[1].style.width = (1 - q) * 100 + "%"; bar2.children[1].textContent = `Pál ${pct(1 - q)}`;
      out.innerHTML = `Legfeljebb még $n+m-1 = ${N}$ játszma dönt. ` +
        tex(`P(\\text{Péter}) = \\frac{1}{2^{${N}}}\\sum_{i=${n}}^{${N}}\\binom{${N}}{i} = \\frac{${num / gg}}{${den / gg}}`) +
        ` → igazságos arány: <b>${num / gg} : ${(den - num) / gg}</b>. A játszmák arányában: ${wP} : ${wQ}.`;
      window.Synopsis && Synopsis.renderMath(out);
    }
    [kI, nI, mI].forEach(e => (e.oninput = upd));
    upd();
  };

  /* ------------------------------------------------------------------
     1.4.3  Születésnap-paradoxon
     ------------------------------------------------------------------ */
  W["birthday"] = root => {
    header(root, "Születésnap-paradoxon", "Hány ember kell ahhoz, hogy valószínűleg legyen köztük két azonos születésnapú?");
    const rk = h("input", { type: "range", min: 2, max: 80, value: 23 });
    const lk = h("b");
    root.append(h("div", { class: "controls" }, h("label", null, "emberek száma k =", rk, lk)));
    const cv = makeCanvas(root, 0.42);
    const out = h("div", { class: "readout" });
    const simOut = h("div", { class: "muted", style: "font-size:.9rem;margin-top:.4rem" });
    root.append(out, h("div", { class: "controls" }, btn("👥 Generálj 2000 véletlen csoportot", sim)), simOut);
    const P = k => { let q = 1; for (let i = 0; i < k; i++) q *= (365 - i) / 365; return 1 - q; };
    cv.draw = () => {
      const { ctx, w, h: H } = cv;
      ctx.clearRect(0, 0, w, H);
      const box = { x0: 40, y0: 14, x1: w - 10, y1: H - 30 };
      const { tx, ty } = axes(ctx, box, { xmin: 0, xmax: 80, ymin: 0, ymax: 1, xticks: [0, 10, 23, 30, 40, 50, 57, 70, 80], yticks: [0, 0.25, 0.5, 0.75, 1], xlabel: "k" });
      dashed(ctx, box.x0, ty(0.5), box.x1, ty(0.5), css("--bad"));
      ctx.strokeStyle = css("--accent"); ctx.lineWidth = 2.2; ctx.beginPath();
      for (let k = 1; k <= 80; k++) k === 1 ? ctx.moveTo(tx(k), ty(P(k))) : ctx.lineTo(tx(k), ty(P(k)));
      ctx.stroke();
      const k = +rk.value;
      ctx.fillStyle = css("--bad"); ctx.beginPath(); ctx.arc(tx(k), ty(P(k)), 5, 0, 7); ctx.fill();
    };
    function upd() {
      const k = +rk.value; lk.textContent = k;
      out.innerHTML = `$k = ${k}$ ember esetén $P(\\text{van egyezés}) = ${fmt(P(k), 4).replace(",", "{,}")}$ &nbsp;(párok száma: $\\binom{${k}}{2} = ${k * (k - 1) / 2}$)`;
      window.Synopsis && Synopsis.renderMath(out);
      simOut.textContent = "";
      cv.draw();
    }
    function sim() {
      const k = +rk.value; let hit = 0;
      for (let t = 0; t < 2000; t++) { const seen = new Uint8Array(365); for (let i = 0; i < k; i++) { const d = rnd(365); if (seen[d]) { hit++; break; } seen[d] = 1; } }
      simOut.textContent = `2000 csoportból ${hit}-ben volt egyezés → relatív gyakoriság ${fmt(hit / 2000, 3)} (elmélet: ${fmt(P(k), 3)})`;
    }
    rk.oninput = upd;
    upd();
  };

  /* ------------------------------------------------------------------
     1.5  Monte-Carlo – geometriai valószínűség
     ------------------------------------------------------------------ */
  const MC = [
    {
      name: "Koncentrikus körök (r/2 sugarú kör az r sugarúban)", exact: 1 / 4, exactT: "1/4",
      dom: [-1.1, 1.1, -1.1, 1.1],
      sample() { let x, y; do { x = Math.random() * 2 - 1; y = Math.random() * 2 - 1; } while (x * x + y * y > 1); return [x, y]; },
      hit: (x, y) => x * x + y * y <= 0.25,
      region(ctx, X, Y, s) { ctx.beginPath(); ctx.arc(X(0), Y(0), s, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(X(0), Y(0), s / 2, 0, 7); ctx.fill(); ctx.stroke(); }
    },
    {
      name: "π becslése (negyedkör az egységnégyzetben)", exact: Math.PI / 4, exactT: "π/4", pi: true,
      dom: [0, 1, 0, 1],
      sample: () => [Math.random(), Math.random()],
      hit: (x, y) => x * x + y * y <= 1,
      region(ctx, X, Y, s) { ctx.beginPath(); ctx.moveTo(X(0), Y(0)); ctx.arc(X(0), Y(0), s, -Math.PI / 2, 0); ctx.closePath(); ctx.fill(); ctx.strokeRect(X(0), Y(1), s, s); }
    },
    {
      name: "Szakasz: a ∈ (−2, 0), b ∈ (0, 3), P(b − a > 3)", exact: 1 / 3, exactT: "1/3",
      dom: [-2, 0, 0, 3],
      sample: () => [-2 + 2 * Math.random(), 3 * Math.random()],
      hit: (a, b) => b - a > 3,
      region(ctx, X, Y) { ctx.beginPath(); ctx.moveTo(X(-2), Y(1)); ctx.lineTo(X(0), Y(3)); ctx.lineTo(X(-2), Y(3)); ctx.closePath(); ctx.fill(); ctx.strokeRect(X(-2), Y(3), X(0) - X(-2), Y(0) - Y(3)); },
      labels: ["a", "b"]
    },
    {
      name: "Randevú: 60 perc, 15 perc várakozás, P(|x − y| ≤ 15)", exact: 7 / 16, exactT: "7/16",
      dom: [0, 60, 0, 60],
      sample: () => [60 * Math.random(), 60 * Math.random()],
      hit: (x, y) => Math.abs(x - y) <= 15,
      region(ctx, X, Y) { ctx.beginPath(); ctx.moveTo(X(0), Y(0)); ctx.lineTo(X(15), Y(0)); ctx.lineTo(X(60), Y(45)); ctx.lineTo(X(60), Y(60)); ctx.lineTo(X(45), Y(60)); ctx.lineTo(X(0), Y(15)); ctx.closePath(); ctx.fill(); ctx.strokeRect(X(0), Y(60), X(60) - X(0), Y(0) - Y(60)); },
      labels: ["Anna (perc)", "Bence (perc)"]
    }
  ];
  W["monte-carlo"] = root => {
    header(root, "Monte-Carlo-céltábla", "Véletlen pontokat szórunk az $\\Omega$ tartományba. A <span style='color:var(--ok)'>zöld</span> pontok az $A$ eseménybe (a színezett tartományba) esnek.");
    const sel = h("select");
    MC.forEach((m, i) => sel.append(h("option", { value: i }, m.name)));
    let pts = [], hits = 0, timer = null;
    const playB = btn("▶ Folyamatos", () => (timer ? stop() : start()), "btn primary");
    root.append(h("div", { class: "controls" }, sel), h("div", { class: "controls" }, ...[1, 10, 100, 1000].map(k => btn(`+${k}`, () => add(k))), playB, btn("Nulláz", reset)));
    const cv = makeCanvas(root, 0.62, 520);
    const out = h("div", { class: "stat-row" });
    root.append(out);
    function start() { timer = setInterval(() => add(40), 40); playB.textContent = "⏸ Szünet"; }
    function stop() { clearInterval(timer); timer = null; playB.textContent = "▶ Folyamatos"; }
    function reset() { stop(); pts = []; hits = 0; cv.draw(); stats(); }
    function add(k) {
      const m = MC[sel.value];
      for (let i = 0; i < k; i++) { const [x, y] = m.sample(); const hh = m.hit(x, y); hits += hh; if (pts.length < 20000) pts.push([x, y, hh]); }
      pts.total = (pts.total || 0) + k;
      if (pts.total >= 50000) stop();
      cv.draw(); stats();
    }
    function geo() {
      const m = MC[sel.value], [x0, x1, y0, y1] = m.dom;
      const pad = 30, W_ = cv.w - 2 * pad, H_ = cv.h - 2 * pad;
      const s = Math.min(W_ / (x1 - x0), H_ / (y1 - y0));
      const ox = pad + (W_ - s * (x1 - x0)) / 2, oy = pad + (H_ - s * (y1 - y0)) / 2;
      return { X: x => ox + (x - x0) * s, Y: y => oy + (y1 - y) * s, s };
    }
    cv.draw = () => {
      const { ctx, w, h: H } = cv;
      ctx.clearRect(0, 0, w, H);
      const m = MC[sel.value], { X, Y, s } = geo();
      ctx.fillStyle = "rgba(16,185,129,.15)"; ctx.strokeStyle = css("--text"); ctx.lineWidth = 1.5;
      m.region(ctx, X, Y, m.pi ? s : s * 1);
      pts.forEach(([x, y, hh]) => { ctx.fillStyle = hh ? css("--ok") : css("--bad"); ctx.fillRect(X(x) - 1.2, Y(y) - 1.2, 2.4, 2.4); });
      ctx.fillStyle = css("--muted"); ctx.font = "11px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "top";
      const [x0, x1, y0, y1] = m.dom;
      if (m.labels) {
        ctx.fillText(`${x0}`, X(x0), Y(y0) + 4); ctx.fillText(`${x1}`, X(x1), Y(y0) + 4); ctx.fillText(m.labels[0], (X(x0) + X(x1)) / 2, Y(y0) + 4);
        ctx.textAlign = "right"; ctx.textBaseline = "middle"; ctx.fillText(`${y0}`, X(x0) - 4, Y(y0)); ctx.fillText(`${y1}`, X(x0) - 4, Y(y1));
        ctx.save(); ctx.translate(X(x0) - 16, (Y(y0) + Y(y1)) / 2); ctx.rotate(-Math.PI / 2); ctx.textAlign = "center"; ctx.fillText(m.labels[1], 0, 0); ctx.restore();
      }
    };
    function stats() {
      const m = MC[sel.value], n = pts.total || 0, est = n ? hits / n : NaN;
      const cells = [["pontok (n)", n], ["találat (k)", hits], ["k/n", fmt(est, 4)], ["pontos érték", `${m.exactT} ≈ ${fmt(m.exact, 4)}`]];
      if (m.pi) cells.push(["π ≈ 4·k/n", fmt(4 * est, 4)]);
      out.innerHTML = cells.map(([l, v]) => `<div class="stat"><div class="v">${v}</div><div class="l">${l}</div></div>`).join("");
    }
    sel.onchange = reset;
    reset();
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
