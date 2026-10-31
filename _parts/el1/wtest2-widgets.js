/* =========================================================
   Elektromosságtan és digitális elektronika 1. fejezet – interaktív szemléltetések
   Minden widget egy  <div class="widget" data-widget="név">  elembe épül.
   A statikus erővonalas ábrák: <div class="widget-static" data-fieldpic="…">.
   ========================================================= */
(function () {
  "use strict";
  const W = {};
  const E_CH = 1.602176634e-19, K = 8.9875517923e9;

  /* számformázás magyarul: tizedesvessző */
  const fmt = (x, d = 2) => (isFinite(x) ? (+x.toFixed(d)).toString().replace(".", ",").replace("-", "−") : "–");
  /* normálalak HTML-ben: 1,6·10⁻¹⁹ */
  const SUP = { "-": "⁻", "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" };
  function sci(x, d = 2) {
    if (!isFinite(x)) return "–";
    if (x === 0) return "0";
    const s = x < 0 ? "−" : "", a = Math.abs(x);
    let k = Math.floor(Math.log10(a)), m = a / Math.pow(10, k);
    if (+m.toFixed(d) >= 10) { m /= 10; k += 1; }
    if (k >= -2 && k <= 3) return s + fmt(a, Math.max(0, d - k));
    return s + fmt(m, d) + "·10" + String(k).split("").map(c => SUP[c]).join("");
  }
  /* érték prefixummal: si(2.3e-7, "C") → "230 nC" */
  function si(x, unit, d = 3) {
    if (!isFinite(x)) return "–";
    if (x === 0) return "0 " + unit;
    const P = [[1e9, "G"], [1e6, "M"], [1e3, "k"], [1, ""], [1e-3, "m"], [1e-6, "µ"], [1e-9, "n"], [1e-12, "p"]];
    const a = Math.abs(x);
    for (const [f, p] of P) if (a >= f * 0.9995) return (x < 0 ? "−" : "") + fmt(+(a / f).toPrecision(d), 3) + " " + p + unit;
    return sci(x) + " " + unit;
  }

  function h(tag, attrs, ...kids) {
    const e = document.createElement(tag);
    if (attrs) for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") e.className = v;
      else if (k === "html") e.innerHTML = v;
      else if (k === "style") e.style.cssText = v;
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
  /* csúszka címkével és élő értékkiírással: slider(parent, "r", 1, 50, 10, 1, v => v + " cm", onchange) → {input, get, set} */
  function slider(parent, label, min, max, val, step, show, onchange) {
    const out = h("b", { style: "font-family:var(--mono);min-width:5.5em;display:inline-block" });
    const inp = h("input", { type: "range", min, max, step, value: val });
    const upd = () => { out.innerHTML = show(+inp.value); onchange && onchange(+inp.value); };
    inp.addEventListener("input", upd);
    parent.append(h("label", null, label + " ", inp, out));
    out.innerHTML = show(+inp.value);
    return { input: inp, get: () => +inp.value, set: v => { inp.value = v; upd(); } };
  }
  const math = el => window.Synopsis && Synopsis.renderMath && window.renderMathInElement && Synopsis.renderMath(el);

  /* a téma színei (világos/sötét) – minden rajzoláskor újraolvassuk */
  function colors() {
    const cs = getComputedStyle(document.documentElement), v = n => cs.getPropertyValue(n).trim();
    return { text: v("--text"), muted: v("--muted"), border: v("--border"), card: v("--card"), soft: v("--bg-soft"),
      accent: v("--accent"), ok: v("--ok"), bad: v("--bad"),
      pos: "#dc2626", neg: "#2563eb", posSoft: "rgba(220,38,38,.18)", negSoft: "rgba(37,99,235,.18)" };
  }
  /* éles (HiDPI) vászon a szülő szélességéhez igazítva; cv.ctx, cv.W, cv.H logikai pixelben */
  function makeCanvas(parent, height, maxW = 720) {
    const cv = h("canvas", { style: "width:100%;touch-action:none;border-radius:10px;background:var(--bg-soft)" });
    parent.append(cv);
    function fit() {
      const cs = getComputedStyle(parent), pad = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
      const w = Math.min(maxW, Math.max(260, parent.clientWidth - pad)), dpr = window.devicePixelRatio || 1;
      cv.style.width = w + "px"; cv.style.height = height + "px";
      cv.width = Math.round(w * dpr); cv.height = Math.round(height * dpr);
      cv.W = w; cv.H = height;
      cv.ctx = cv.getContext("2d"); cv.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    fit();
    cv.refit = fit;
    return cv;
  }
  /* egérkoordináta a vászon logikai pixeleiben */
  function pointer(cv, ev) {
    const r = cv.getBoundingClientRect(), p = ev.touches ? ev.touches[0] : ev;
    return [(p.clientX - r.left) * cv.W / r.width, (p.clientY - r.top) * cv.H / r.height];
  }
  function arrow(ctx, x1, y1, x2, y2, color, width = 2, head = 8) {
    const a = Math.atan2(y2 - y1, x2 - x1);
    ctx.strokeStyle = ctx.fillStyle = color; ctx.lineWidth = width;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - head * Math.cos(a - 0.4), y2 - head * Math.sin(a - 0.4));
    ctx.lineTo(x2 - head * Math.cos(a + 0.4), y2 - head * Math.sin(a + 0.4));
    ctx.closePath(); ctx.fill();
  }
  /* töltött golyó előjellel */
  function chargeDot(ctx, x, y, r, q, C, label) {
    ctx.fillStyle = q > 0 ? C.pos : q < 0 ? C.neg : C.muted;
    ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.font = `700 ${Math.round(r * 1.2)}px system-ui`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(label != null ? label : q > 0 ? "+" : q < 0 ? "−" : "0", x, y + 1);
  }
  /* ==================================================================
     w2: 1.2, 1.6, 1.7 widgetjei (rub-series, esd-spark, floating-input)
     A saját segédfüggvények blokkban, hogy ne ütközzenek a w1 neveivel.
     ================================================================== */
  {
    /* témaváltáskor és átméretezéskor újrarajzolás */
    const onTheme = fn => new MutationObserver(fn).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    function onResize(fn) {
      let t = null;
      addEventListener("resize", () => { clearTimeout(t); t = setTimeout(fn, 150); });
    }
    const checkbox = (label, onchange, checked = false) => {
      const inp = h("input", { type: "checkbox" });
      inp.checked = checked;
      inp.addEventListener("change", () => onchange(inp.checked));
      return { lab: h("label", null, inp, label), inp };
    };
    /* ha a widget kikerül a képből, vagy a lap rejtett: vis(false) */
    function watchVisible(root, vis) {
      if ("IntersectionObserver" in window) new IntersectionObserver(es => es.forEach(e => vis(e.isIntersecting))).observe(root);
      document.addEventListener("visibilitychange", () => vis(!document.hidden && isOnScreen(root)));
    }
    function isOnScreen(el) {
      const r = el.getBoundingClientRect();
      return r.bottom > 0 && r.top < innerHeight;
    }
    function roundRect(ctx, x, y, w, hh, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + hh - r); ctx.quadraticCurveTo(x + w, y + hh, x + w - r, y + hh);
      ctx.lineTo(x + r, y + hh); ctx.quadraticCurveTo(x, y + hh, x, y + hh - r);
      ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
    }
    /* előjeljelek (+/−) egy téglalapon belül: n helyből az első `shown` darab */
    function signs(ctx, x, y, w, hh, n, sgn, C, size = 13, shown = n) {
      if (!n) return;
      const cols = Math.min(n, Math.max(2, Math.round(Math.sqrt(n * w / hh)))), rows = Math.ceil(n / cols);
      ctx.fillStyle = sgn > 0 ? C.pos : C.neg; ctx.font = `700 ${size}px system-ui`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      for (let k = 0; k < shown; k++) {
        const i = k % cols, j = Math.floor(k / cols);
        ctx.fillText(sgn > 0 ? "+" : "−", x + (i + 0.5) * w / cols, y + (j + 0.5) * hh / rows);
      }
    }
    const ease = t => (t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t));
    const gauss = () => { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
    const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

    /* ------------------------------------------------------------------
       1.2 a  rub-series – triboelektromos sor: ki ad elektront kinek?
       ------------------------------------------------------------------ */
    W["rub-series"] = root => {
      header(root, "Dörzsöld össze! – a triboelektromos sor",
        "Válassz két anyagot, és dörzsöld össze őket. A sorban <b>feljebb álló</b> (a skálán balra eső) anyag ad elektront az alatta állónak: " +
        "az elektront kapó negatív, az elektront adó pozitív lesz. Lent két megdörzsölt testet közelíthetsz egymáshoz.");
      /* [név a listában, rövid név, névelő, -nak/-nek rag] */
      const M = [
        ["üveg", "üveg", "az", "nek"], ["emberi haj", "haj", "a", "nak"], ["nejlon", "nejlon", "a", "nak"], ["gyapjú", "gyapjú", "a", "nak"],
        ["selyem", "selyem", "a", "nek"], ["papír", "papír", "a", "nak"], ["pamut", "pamut", "a", "nak"], ["borostyán", "borostyán", "a", "nak"],
        ["gumi (lufi)", "lufi", "a", "nak"], ["poliészter", "poliészter", "a", "nek"], ["PVC", "PVC", "a", "-nek"], ["teflon", "teflon", "a", "nak"]
      ];
      const nom = i => M[i][2] + " " + M[i][1], dat = i => M[i][2] + " " + M[i][1] + M[i][3];
      let A = 1, B = 8, done = null, anim = null;    // done: {A, B, n, giver} az utolsó dörzsölés eredménye

      const ctr = h("div", { class: "controls" });
      const mkSel = (lab, v, set) => {
        const s = h("select", null, M.map((m, i) => h("option", { value: i }, m[0])));
        s.value = v;
        s.addEventListener("change", () => { set(+s.value); done = null; drawAll(); say(); });
        ctr.append(h("label", null, lab, s));
        return s;
      };
      const sA = mkSel("A anyag:", A, v => (A = v)), sB = mkSel("B anyag:", B, v => (B = v));
      const go = btn("Dörzsöld össze!", () => rub(), "btn primary");
      ctr.append(go);
      root.append(ctr);
      const stage = h("div");
      root.append(stage);
      const cv = makeCanvas(stage, 190);
      const out = h("div", { class: "readout" });
      root.append(out);
      const scWrap = h("div", { style: "margin-top:.7rem" });
      root.append(scWrap);
      const sc = makeCanvas(scWrap, 132);

      /* --- második rész: közelítés --- */
      root.append(h("div", { class: "w-title", style: "margin-top:1.1rem;font-size:.98rem" }, "Közelítsd őket!"));
      root.append(h("p", { class: "w-sub", style: "margin-bottom:.3rem" }, "A lufit a hajadhoz, az üveget selyemhez dörzsöltük (a fenti táblázat négy kísérlete)."));
      const PAIRS = [["ll", "lufi ↔ lufi"], ["lh", "lufi ↔ haj"], ["gg", "üveg ↔ üveg"], ["gl", "üveg ↔ lufi"]];
      /* test: [felirat, töltés előjele, alak] */
      const BODY = { l: ["lufi", -1, "balloon"], h: ["haj", +1, "hair"], g: ["üveg", +1, "rod"] };
      const NOTE = { l: "hajjal dörzsölve", h: "a lufi dörzsölte", g: "selyemmel dörzsölve" };
      let pair = "ll";
      const ctr2 = h("div", { class: "controls" });
      root.append(ctr2);
      toggleGroup(ctr2, PAIRS, pair, v => { pair = v; drawNear(); sayNear(); });
      const ctr3 = h("div", { class: "controls" });
      root.append(ctr3);
      const dist = slider(ctr3, "távolság:", 3, 30, 15, 1, v => v + " cm", () => { drawNear(); sayNear(); });
      const nearWrap = h("div");
      root.append(nearWrap);
      const nv = makeCanvas(nearWrap, 170);
      const out2 = h("div", { class: "readout" });
      root.append(out2);
      root.append(h("p", { class: "muted", style: "font-size:.85rem;margin:.5rem 0 0" },
        "A sor tájékoztató jellegű: páratartalom, tisztaság, dörzsölés módja is számít."));

      /* hány elektront rajzolunk: 5–12, a sorbeli távolsággal arányosan */
      const nOf = (a, b) => (a === b ? 0 : 5 + Math.round(7 * (Math.abs(a - b) - 1) / 10));

      function bodyBoxes(t) {
        // t: 0 = alaphelyzet (széthúzva), 1 = összeérnek
        const W0 = cv.W, H0 = cv.H, bw = Math.min(130, W0 * 0.32), bh = 74, cy = H0 / 2 - 6;
        const gap0 = Math.min(W0 * 0.22, 150), gap = gap0 * (1 - t);
        return { bw, bh, cy, xa: W0 / 2 - gap / 2 - bw, xb: W0 / 2 + gap / 2 };
      }
      function drawStage(st) {
        // st: {t, wob, moved, flying:[{x,y}]}
        const C = colors(), ctx = cv.ctx;
        ctx.clearRect(0, 0, cv.W, cv.H);
        const { bw, bh, cy, xa, xb } = bodyBoxes(st.t);
        const ya = cy - bh / 2 - st.wob, yb = cy - bh / 2 + st.wob;
        const res = done && done.A === A && done.B === B ? done : null;
        [[xa, ya, A, "A"], [xb, yb, B, "B"]].forEach(([x, y, i, tag]) => {
          let fill = C.card, stroke = C.border;
          if (res && res.n) {
            const isG = (tag === "A") === (res.giver === A);
            fill = isG ? C.posSoft : C.negSoft; stroke = isG ? C.pos : C.neg;
          }
          roundRect(ctx, x, y, bw, bh, 12); ctx.fillStyle = fill; ctx.fill();
          ctx.lineWidth = 2; ctx.strokeStyle = stroke; ctx.stroke();
          ctx.fillStyle = C.text; ctx.font = "600 13px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
          ctx.fillText(M[i][0], x + bw / 2, y + bh + 18);
          ctx.fillStyle = C.muted; ctx.font = "11px system-ui";
          ctx.fillText(tag, x + bw / 2, y - 6);
        });
        /* a vándorló vagy már átért elektronok */
        const k = st.moved || 0;
        if (res && res.n && st.final) {
          const gA = res.giver === A;
          signs(ctx, (gA ? xa : xb) + 6, (gA ? ya : yb) + 6, bw - 12, bh - 12, res.n, +1, C, 15);
          signs(ctx, (gA ? xb : xa) + 6, (gA ? yb : ya) + 6, bw - 12, bh - 12, res.n, -1, C, 15);
        } else if (k) {
          // eddig átért elektronok: a fogadón −, az adón + (elektronhiány)
          const rl = st.recvLeft, nT = st.nTot;
          signs(ctx, (rl ? xb : xa) + 6, (rl ? yb : ya) + 6, bw - 12, bh - 12, nT, +1, C, 15, k);
          signs(ctx, (rl ? xa : xb) + 6, (rl ? ya : yb) + 6, bw - 12, bh - 12, nT, -1, C, 15, k);
        }
        (st.flying || []).forEach(p => { ctx.fillStyle = C.neg; ctx.beginPath(); ctx.arc(p.x, p.y, 4.5, 0, 7); ctx.fill(); });
        if (st.label) {
          ctx.fillStyle = C.muted; ctx.font = "12px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
          ctx.fillText(st.label, cv.W / 2, 16);
        }
      }
      function drawScale() {
        const C = colors(), ctx = sc.ctx, Wd = sc.W;
        ctx.clearRect(0, 0, Wd, sc.H);
        const pad = 24, padR = 42, x = i => pad + i * (Wd - pad - padR) / 11, y0 = 46;
        ctx.font = "700 13px system-ui"; ctx.textBaseline = "middle";
        ctx.fillStyle = C.pos; ctx.textAlign = "left"; ctx.fillText("(+)", 0, y0 - 22);
        ctx.fillStyle = C.neg; ctx.textAlign = "right"; ctx.fillText("(−)", Wd, y0 - 22);
        const gr = ctx.createLinearGradient(pad, 0, x(11), 0);
        gr.addColorStop(0, C.pos); gr.addColorStop(1, C.neg);
        ctx.strokeStyle = gr; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(pad, y0); ctx.lineTo(x(11), y0); ctx.stroke();
        const narrow = Wd < 520;
        for (let i = 0; i < 12; i++) {
          const sel = i === A || i === B;
          ctx.fillStyle = sel ? C.accent : C.muted;
          ctx.beginPath(); ctx.arc(x(i), y0, sel ? 7 : 3.5, 0, 7); ctx.fill();
          if (sel) {
            ctx.fillStyle = "#fff"; ctx.font = "700 9px system-ui"; ctx.textAlign = "center";
            ctx.fillText(i === A && i === B ? "AB" : i === A ? "A" : "B", x(i), y0 + 0.5);
          }
          ctx.save(); ctx.translate(x(i) + 3, y0 + 13); ctx.rotate(narrow ? Math.PI / 3.2 : Math.PI / 5);
          ctx.fillStyle = sel ? C.text : C.muted; ctx.font = (sel ? "700 " : "") + (narrow ? "11px" : "12px") + " system-ui";
          ctx.textAlign = "left"; ctx.textBaseline = "middle";
          ctx.fillText(M[i][0], 0, 0);
          ctx.restore();
        }
        if (A !== B) {
          const g = Math.min(A, B), r = Math.max(A, B), x1 = x(g), x2 = x(r), top = 12;
          ctx.strokeStyle = C.neg; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(x1, y0 - 10); ctx.quadraticCurveTo((x1 + x2) / 2, top - 6, x2 - 2, y0 - 11); ctx.stroke();
          arrow(ctx, x2 - 6, y0 - 17, x2 - 1, y0 - 10, C.neg, 2, 8);
          ctx.fillStyle = C.neg; ctx.font = "700 12px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
          ctx.fillText("e⁻", (x1 + x2) / 2, top + 6);
        }
      }
      function drawAll() { drawStage({ t: 0, wob: 0, final: true }); drawScale(); }

      function say() {
        if (done && done.A === A && done.B === B) {
          if (!done.n) out.innerHTML = "Azonos anyagok között alig történik töltésátvitel.";
          else {
            const g = done.giver, r = g === A ? B : A;
            out.innerHTML = `${cap(nom(g))} elektronokat adott át ${dat(r)}: <b style="color:${colors().neg}">${nom(r)} negatív</b>, ` +
              `<b style="color:${colors().pos}">${nom(g)} pozitív</b>.`;
          }
        } else if (A === B) out.textContent = "Két egyforma anyag – mit vársz? Dörzsöld össze!";
        else out.textContent = `Melyik ad elektront: ${nom(A)} vagy ${nom(B)}? Jósolj a sor alapján, aztán dörzsöld össze!`;
      }

      function rub() {
        if (anim) cancelAnimationFrame(anim);
        const n = nOf(A, B), giver = Math.min(A, B), recvLeft = A !== B && B === giver; // fogadó a bal oldali (A)?
        done = null; say();
        const T = 2600, t0 = performance.now();
        go.disabled = true;
        const step = now => {
          const t = now - t0;
          const close = t < 500 ? ease(t / 500) : t < 2100 ? 1 : 1 - ease((t - 2100) / 500);
          const wob = t > 500 && t < 2100 ? 9 * Math.sin((t - 500) / 1600 * 2 * Math.PI * 4) : 0;
          const st = { t: close, wob, recvLeft, nTot: n, moved: 0, flying: [], label: t > 450 && t < 2150 ? "dörzsölés…" : "" };
          if (n) {
            const { bw, bh, cy, xa, xb } = bodyBoxes(close);
            for (let j = 0; j < n; j++) {
              const ts = 600 + j * 1300 / n, te = ts + 420;   // j-edik elektron indulása, érkezése
              if (t >= te) st.moved++;
              else if (t >= ts) {
                const u = ease((t - ts) / 420);
                const fromX = recvLeft ? xb + bw * 0.55 : xa + bw * 0.45, toX = recvLeft ? xa + bw * 0.45 : xb + bw * 0.55;
                const yy = cy + ((j * 23) % (bh - 28)) - bh / 2 + 14 + (recvLeft ? -wob : wob) * 0.5;
                st.flying.push({ x: fromX + (toX - fromX) * u, y: yy - 18 * Math.sin(Math.PI * u) });
              }
            }
          }
          if (t >= T) {
            anim = null; go.disabled = false;
            done = { A, B, n, giver };
            drawStage({ t: 0, wob: 0, final: true }); say(); return;
          }
          drawStage(st);
          anim = requestAnimationFrame(step);
        };
        anim = requestAnimationFrame(step);
      }

      /* --- közelítés --- */
      function drawBody(ctx, kind, x, cy, C, q) {
        const col = q > 0 ? C.pos : C.neg, soft = q > 0 ? C.posSoft : C.negSoft;
        ctx.lineWidth = 2; ctx.strokeStyle = col; ctx.fillStyle = soft;
        if (kind === "balloon") {
          ctx.beginPath(); ctx.ellipse(x, cy - 6, 26, 32, 0, 0, 7); ctx.fill(); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(x - 4, cy + 30); ctx.lineTo(x + 4, cy + 30); ctx.lineTo(x, cy + 25); ctx.closePath(); ctx.fillStyle = col; ctx.fill();
          ctx.strokeStyle = C.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, cy + 30); ctx.quadraticCurveTo(x + 6, cy + 42, x, cy + 52); ctx.stroke();
        } else if (kind === "rod") {
          roundRect(ctx, x - 9, cy - 46, 18, 92, 8); ctx.fill(); ctx.stroke();
        } else {
          ctx.beginPath(); ctx.arc(x, cy + 14, 24, Math.PI, 0); ctx.fill(); ctx.stroke();
          ctx.strokeStyle = col; ctx.lineWidth = 1.5;
          for (let k = -4; k <= 4; k++) {           // szétálló hajszálak
            const a = -Math.PI / 2 + k * 0.32;
            ctx.beginPath(); ctx.moveTo(x + 22 * Math.cos(a), cy + 14 + 22 * Math.sin(a));
            ctx.lineTo(x + 42 * Math.cos(a), cy + 14 + 42 * Math.sin(a)); ctx.stroke();
          }
        }
        ctx.fillStyle = col; ctx.font = "700 15px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        const sg = q > 0 ? "+" : "−";
        if (kind === "rod") [-28, -10, 8, 26].forEach(d => ctx.fillText(sg, x, cy + d));
        else if (kind === "balloon") [[-9, -14], [9, -14], [-9, 4], [9, 4]].forEach(([dx, dy]) => ctx.fillText(sg, x + dx, cy + dy));
        else [[-10, 6], [10, 6], [0, -4]].forEach(([dx, dy]) => ctx.fillText(sg, x + dx, cy + dy + 8));
      }
      function drawNear() {
        const C = colors(), ctx = nv.ctx, Wd = nv.W, Hh = nv.H;
        ctx.clearRect(0, 0, Wd, Hh);
        const [b1, b2] = [BODY[pair[0]], BODY[pair[1]]], r = dist.get();
        const span = Wd - 2 * 70, cx = Wd / 2, d = 60 + (span - 60) * (r - 3) / 27, cy = Hh / 2 - 6;
        const x1 = cx - d / 2, x2 = cx + d / 2;
        drawBody(ctx, b1[2], x1, cy, C, b1[1]);
        drawBody(ctx, b2[2], x2, cy, C, b2[1]);
        ctx.fillStyle = C.text; ctx.font = "600 12px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
        ctx.fillText(b1[0], x1, Hh - 8); ctx.fillText(b2[0], x2, Hh - 8);
        const rep = b1[1] * b2[1] > 0, F = Math.min(1, (6 / r) ** 2), L = 8 + 52 * F, col = C.accent;
        const ay = 18;
        if (rep) { arrow(ctx, x1 - 20, ay, x1 - 20 - L, ay, col, 3, 9); arrow(ctx, x2 + 20, ay, x2 + 20 + L, ay, col, 3, 9); }
        else { arrow(ctx, x1 + 4, ay, x1 + 4 + Math.min(L, d / 2 - 10), ay, col, 3, 9); arrow(ctx, x2 - 4, ay, x2 - 4 - Math.min(L, d / 2 - 10), ay, col, 3, 9); }
      }
      function sayNear() {
        const [b1, b2] = [BODY[pair[0]], BODY[pair[1]]], r = dist.get(), C = colors();
        const sg = q => (q > 0 ? `<b style="color:${C.pos}">pozitív</b>` : `<b style="color:${C.neg}">negatív</b>`);
        const rep = b1[1] * b2[1] > 0;
        const rel = (10 / r) ** 2;
        out2.innerHTML = `${cap(b1[0])} (${NOTE[pair[0]]}): ${sg(b1[1])} · ${b2[0]} (${NOTE[pair[1]]}): ${sg(b2[1])}<br>` +
          (rep ? "Azonos előjel → <b>taszítják</b> egymást." : "Ellentétes előjel → <b>vonzzák</b> egymást.") +
          ` Az erő a 10 cm-es távolsághoz képest: ×${fmt(rel, rel < 1 ? 2 : 1)} (kétszer közelebb → négyszer erősebb, 1.3).`;
      }

      drawAll(); say(); drawNear(); sayNear();
      onTheme(() => { drawAll(); say(); drawNear(); sayNear(); });
      onResize(() => { cv.refit(); sc.refit(); nv.refit(); drawAll(); drawNear(); });
    };

    /* ------------------------------------------------------------------
       1.6 a  esd-spark – sétálj a szőnyegen, aztán fogd meg a kilincset
       ------------------------------------------------------------------ */
    W["esd-spark"] = root => {
      header(root, "Sétálj a szőnyegen!",
        "Lépkedj, és figyeld, hogyan gyűlik a töltés a testeden – aztán nyúlj a kilincshez. " +
        "<i>Egyszerűsített modell:</i> lépésenként töltés jön a talpra, közben a töltés egy része folyamatosan elszivárog " +
        "(párás levegőben és vezetőbb talpon gyorsabban). A „testfeszültség” $U = Q/C$, $C = 100\\,\\text{pF}$ – a feszültséget a 2. fejezetben definiáljuk.");
      const SHOE = { gumi: ["gumitalp", 1, 1], bor: ["bőrtalp", 0.6, 0.15], mez: ["mezítláb", 0.4, 0.003] };   // [név, töltődés, szivárgás-szorzó]
      const FLOOR = { szo: ["műszálas szőnyeg", 1, 1], fa: ["fa", 0.4, 0.6], cse: ["csempe", 0.25, 0.4] };
      const G0 = 0.08, QS0 = 1.5484, T20 = 300, KH = 60 / Math.log(300), STEP_T = 0.5, CAP = 100e-12;
      let shoe = "gumi", floor = "szo", H = 20, Q = 0, steps = 0, walking = 0, walkT = 0, spark = null, last = null;
      const tau = () => T20 * Math.exp(-(H - 20) / KH) * SHOE[shoe][2] * FLOOR[floor][2];      // s
      const gain = () => G0 * SHOE[shoe][1] * FLOOR[floor][1];                                  // µC / lépés
      const qsat = () => QS0 * SHOE[shoe][1] * FLOOR[floor][1];
      const qStar = () => { const g = gain(), r = Math.exp(-STEP_T / tau()); return g * r / (1 - r * (1 - g / qsat())); };

      const c1 = h("div", { class: "controls" }), c2 = h("div", { class: "controls" }), c3 = h("div", { class: "controls" });
      root.append(c1, c2, c3);
      const busy = () => spark && !spark.done;
      c1.append(btn("Lépj egyet", () => { if (busy()) return; stopSpark(); step(); paint(); }), btn("10 lépés", () => { if (busy()) return; stopSpark(); walking += 10; }),
        btn("⚡ Kisülés", () => discharge(), "btn primary"));
      c2.append(h("span", { class: "muted", style: "font-size:.92rem" }, "cipő:"));
      toggleGroup(c2, Object.entries(SHOE).map(([k, v]) => [k, v[0]]), shoe, v => { shoe = v; stopSpark(); paint(); });
      c3.append(h("span", { class: "muted", style: "font-size:.92rem" }, "padló:"));
      toggleGroup(c3, Object.entries(FLOOR).map(([k, v]) => [k, v[0]]), floor, v => { floor = v; stopSpark(); paint(); });
      const c4 = h("div", { class: "controls" });
      root.append(c4);
      slider(c4, "páratartalom:", 20, 80, H, 5, v => v + "%", v => { H = v; stopSpark(); paint(); });
      const sceneWrap = h("div");
      root.append(sceneWrap);
      const cv = makeCanvas(sceneWrap, 170);
      const barWrap = h("div", { style: "margin-top:.5rem" });
      root.append(barWrap);
      const bar = makeCanvas(barWrap, 74);
      const stats = h("div", { class: "stat-row" });
      root.append(stats);
      const mk = l => { const v = h("div", { class: "v" }), s = h("div", { class: "stat" }, v, h("div", { class: "l", html: l })); stats.append(s); return v; };
      const vQ = mk("töltés $Q$"), vN = mk("többletelektron $N = Q/e$"), vU = mk("„testfeszültség” $U = Q/C$"),
        vS = mk("szikrahossz $U / (3\\,\\text{kV/mm})$"), vE = mk("energia $\\tfrac12 QU$");
      const out = h("div", { class: "readout" });
      root.append(out);
      math(root);

      function step() {
        Q = (Q + gain() * (1 - Q / qsat())) * Math.exp(-STEP_T / tau());
        steps++; walkT += 1;
      }
      const U = () => Q * 1e-6 / CAP;
      function verdict(u) {
        const felt = u >= 3000 ? "<b>Igen</b>" : "<b>Nem</b>";
        const ic = u < 1500 ? "<b>Biztosan</b>" : u <= 3000 ? "<b>határeset</b>" : "<b>valószínűleg nem</b>";
        return `Érezted? ${felt} · Egy 74HC595 túlélte volna? ${ic}`;
      }
      function paintStats() {
        const q = Q * 1e-6, u = U();
        vQ.textContent = fmt(Q, Q < 0.1 ? 3 : 2) + " µC";
        vN.textContent = q > 0 ? sci(q / E_CH, 1) : "0";
        vU.textContent = u >= 1 ? si(u, "V", 3) : "0 V";
        vS.textContent = u >= 1 ? fmt(+(u / 3000).toPrecision(2), 3) + " mm" : "0 mm";
        vE.textContent = fmt(0.5 * q * u * 1e3, u < 1000 ? 3 : 2) + " mJ";
      }
      function paint() {
        paintStats(); drawScene(); drawBar();
        if (spark && spark.done) { out.innerHTML = spark.text; return; }
        const qs = qStar(), cond = `${SHOE[shoe][0]}, ${FLOOR[floor][0]}, ${H}% pára`;
        let msg = `${steps} lépés · ${cond}. ` + (qs < 0.001 ? "Ezzel a beállítással gyakorlatilag nem gyűlik töltés: azonnal elfolyik." :
          `Ezzel a beállítással legfeljebb kb. ${fmt(qs, qs < 0.1 ? 3 : 2)} µC (${si(qs * 1e4, "V", 2)}) gyűlhet össze.`);
        if (Q > 0.005 && Q >= 0.97 * qs) msg += " <b>Telítés:</b> most már lépésenként annyi szivárog el, amennyi jön.";
        out.innerHTML = msg;
      }
      function drawScene() {
        const C = colors(), ctx = cv.ctx, Wd = cv.W, Hh = cv.H;
        ctx.clearRect(0, 0, Wd, Hh);
        const fy = Hh - 24;
        /* padló */
        ctx.fillStyle = floor === "szo" ? "rgba(168,85,247,.25)" : floor === "fa" ? "rgba(180,120,60,.35)" : "rgba(148,163,184,.35)";
        ctx.fillRect(0, fy, Wd, 24);
        if (floor === "cse") { ctx.strokeStyle = C.border; ctx.lineWidth = 1; for (let x = 0; x < Wd; x += 28) { ctx.beginPath(); ctx.moveTo(x, fy); ctx.lineTo(x, Hh); ctx.stroke(); } }
        if (floor === "fa") { ctx.strokeStyle = "rgba(120,72,30,.35)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, fy + 12); ctx.lineTo(Wd, fy + 12); ctx.stroke(); }
        /* ajtó és kilincs */
        const dx = Wd - 70, kx = dx + 8, ky = fy - 78;
        ctx.fillStyle = C.soft; ctx.strokeStyle = C.border; ctx.lineWidth = 2;
        ctx.fillRect(dx, 12, 60, fy - 12); ctx.strokeRect(dx, 12, 60, fy - 12);
        ctx.fillStyle = "#9ca3af"; roundRect(ctx, kx - 4, ky - 4, 30, 8, 4); ctx.fill();
        ctx.beginPath(); ctx.arc(kx + 22, ky, 6, 0, 7); ctx.fill();
        /* az ember: pálcikaember, a lépések szerint halad */
        const reach = spark ? ease(Math.min(1, spark.t / 0.5)) : 0;
        const walkX = 40 + ((walkT * 22) % Math.max(60, dx - 150));
        const px = spark ? spark.x0 + (dx - 105 - spark.x0) * reach : walkX;
        const ph = walking > 0 ? Math.sin(performance.now() / 90) : 0.6;
        const col = Q > 0.005 ? C.neg : C.text;
        ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.lineCap = "round";
        const hip = fy - 46, sh = fy - 92;
        ctx.beginPath(); ctx.arc(px, sh - 14, 11, 0, 7); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(px, sh - 3); ctx.lineTo(px, hip); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(px, hip); ctx.lineTo(px - 18 * ph, fy - 2); ctx.moveTo(px, hip); ctx.lineTo(px + 18 * ph, fy - 2); ctx.stroke();
        /* kar: séta közben lóg, kisüléskor a kilincs felé nyúl */
        const gap = spark ? Math.max(3, Math.min(30, spark.u / 3000 * 5)) : 0;      // a szikra hossza (rajzon kb. 5 px/mm)
        const hx = px + 22 + (kx - 6 - gap - px - 22) * reach, hy = sh + 30 + (ky - sh - 30) * reach;
        ctx.beginPath(); ctx.moveTo(px, sh + 8); ctx.lineTo(px - 14, sh + 34); ctx.moveTo(px, sh + 8); ctx.lineTo(hx, hy); ctx.stroke();
        ctx.lineCap = "butt";
        /* cipő */
        ctx.fillStyle = shoe === "gumi" ? "#374151" : shoe === "bor" ? "#92400e" : "rgba(0,0,0,0)";
        if (shoe !== "mez") { ctx.fillRect(px - 18 * ph - 8, fy - 5, 16, 5); ctx.fillRect(px + 18 * ph - 8, fy - 5, 16, 5); }
        /* többlettöltés a testen */
        const n = Math.min(14, Math.round(Q * 9));
        ctx.fillStyle = C.neg; ctx.font = "700 12px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        for (let k = 0; k < n; k++) ctx.fillText("−", px + (k % 2 ? 9 : -9), sh + 4 + (k >> 1) * 6.5);
        /* szikra */
        if (spark && spark.t > 0.5 && spark.t < 1.1) {
          const u = U0(), len = (kx - 4) - hx;
          if (u >= 1000) {
            ctx.strokeStyle = u > 3000 ? "#facc15" : "#a5b4fc"; ctx.lineWidth = u > 10000 ? 3 : 2;
            ctx.beginPath(); ctx.moveTo(hx, hy);
            const segs = 5;
            for (let k = 1; k <= segs; k++) ctx.lineTo(hx + len * k / segs + (k < segs ? 0 : 0), hy + (k < segs ? (Math.random() - 0.5) * 10 : 0));
            ctx.stroke();
            if (u > 10000) { ctx.fillStyle = "rgba(250,204,21,.18)"; ctx.fillRect(0, 0, Wd, Hh); }
          }
        }
        ctx.fillStyle = C.muted; ctx.font = "12px system-ui"; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
        ctx.fillText("kilincs →", dx - 58, ky - 14);
      }
      const U0 = () => (spark ? spark.u : U());
      function drawBar() {
        const C = colors(), ctx = bar.ctx, Wd = bar.W, pad = 14, y = 30, hh = 14;
        ctx.clearRect(0, 0, Wd, bar.H);
        const lo = Math.log10(100), hi = Math.log10(20000), X = u => pad + (Wd - 2 * pad) * (Math.log10(Math.max(100, Math.min(20000, u))) - lo) / (hi - lo);
        roundRect(ctx, pad, y, Wd - 2 * pad, hh, 7); ctx.fillStyle = C.soft; ctx.fill(); ctx.strokeStyle = C.border; ctx.lineWidth = 1; ctx.stroke();
        const u = spark && !spark.done ? spark.u : U();
        if (u >= 100) {
          const gr = ctx.createLinearGradient(pad, 0, Wd - pad, 0);
          gr.addColorStop(0, "#93c5fd"); gr.addColorStop(0.55, "#2563eb"); gr.addColorStop(1, "#7c3aed");
          roundRect(ctx, pad, y, Math.max(8, X(u) - pad), hh, 7); ctx.fillStyle = gr; ctx.fill();
        }
        const TH = [[200, "200 V", "érzékeny alkatrész"], [2000, "2 kV", "74HC595"], [3000, "3 kV", "épp érzed"], [10000, "10 kV", "látható szikra"]];
        const narrow = Wd < 520;
        TH.forEach(([v, a, b], i) => {
          const x = X(v);
          ctx.strokeStyle = C.text; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, y - 4); ctx.lineTo(x, y + hh + 4); ctx.stroke();
          ctx.fillStyle = C.text; ctx.font = "700 11px system-ui"; ctx.textBaseline = "alphabetic";
          ctx.textAlign = i === 1 ? "right" : i === 2 ? "left" : "center";
          const dx = i === 1 ? -3 : i === 2 ? 3 : 0;
          ctx.fillText(a, x + dx, y - 7);
          ctx.fillStyle = C.muted; ctx.font = (narrow ? "10px" : "11px") + " system-ui"; ctx.textBaseline = "top";
          ctx.fillText(b, x + dx, y + hh + (narrow && i === 3 ? 18 : 5));
        });
        ctx.fillStyle = C.muted; ctx.font = "10px system-ui"; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
        ctx.fillText("„testfeszültség” – log. skála", pad, 10);
      }

      function stopSpark() { if (spark && spark.done) spark = null; }
      function discharge() {
        if (spark && !spark.done) return;
        walking = 0;
        const u = Math.round(U());                       // 0,3 µC → 2999,99… V kerekítése
        const res = u < 1 ? "Nem volt rajtad töltés – nincs mit kisütni." :
          `Kisülés ${si(u, "V", 2)}-ról${u < 3000 ? " (a szikra túl kicsi ahhoz, hogy lásd)" : u < 10000 ? " (apró szikra)" : " (látható, hallható szikra)"}. ` + verdict(u) + ". A töltésed most 0.";
        spark = { t: 0, u, x0: 40 + ((walkT * 22) % Math.max(60, cv.W - 70 - 150)), text: res, done: false };
        if (u < 1) { spark.done = true; paint(); }
      }
      root.__esd = { setQ: v => { Q = v; spark = null; paint(); }, get: () => ({ Q, steps, raf: !!raf }) };   // tesztkampó

      /* időzítő: séta-animáció, szivárgás állás közben, szikra */
      let raf = null, visible = true, carry = 0;
      function frame(now) {
        const dt = last == null ? 0 : Math.min(0.1, (now - last) / 1000);
        last = now;
        if (spark && !spark.done) {
          spark.t += dt;
          if (spark.t > 1.2) { Q = 0; spark.done = true; walkT = 0; }
        } else if (walking > 0) {
          carry += dt;
          if (carry >= 0.28) { carry = 0; step(); walking--; }
        } else if (Q > 0) {
          Q *= Math.exp(-dt / tau());
          if (Q < 1e-5) Q = 0;
        }
        paint();
        raf = visible ? requestAnimationFrame(frame) : null;
      }
      function vis(v) {
        visible = v;
        if (v && !raf) { last = null; raf = requestAnimationFrame(frame); }
      }
      watchVisible(root, vis);
      paint();
      raf = requestAnimationFrame(frame);
      onResize(() => { cv.refit(); bar.refit(); paint(); });
      onTheme(paint);
    };

    /* ------------------------------------------------------------------
       1.7 a  floating-input – szimulált soros plotter a lebegő A0-ról
       ------------------------------------------------------------------ */
    W["floating-input"] = root => {
      header(root, "A lebegő bemenet – szimulált soros plotter",
        "Húzd a fésűt az antennához (vagy használd a csúszkát), kapcsold be a kezet vagy a lámpavezetéket, és figyeld a két görbét: " +
        "<b>nyers</b> = egyetlen mérés, <b>átlag</b> = 20 ms-os átlag – mint a 01_elektroszkop sketch a Soros plotterben.");
      let q = -1, r = 30, hand = false, lamp = false, pull = false, running = true, visible = true;
      const c1 = h("div", { class: "controls" }), c2 = h("div", { class: "controls" });
      root.append(c1, c2);
      c1.append(h("span", { class: "muted", style: "font-size:.92rem" }, "fésű töltése:"));
      toggleGroup(c1, [[-1, "− negatív"], [0, "semleges"], [1, "+ pozitív"]], q, v => { q = v; if (!running) drawAll(); });
      const sl = slider(c1, "távolság:", 3, 40, r, 1, v => v + " cm", v => { r = v; if (!running) drawAll(); });
      c2.append(checkbox("kéz közelít", v => { hand = v; }).lab, checkbox("lámpavezeték az antenna mellett", v => { lamp = v; }).lab,
        checkbox("lehúzó ellenállás (10 kΩ a GND-re)", v => { pull = v; }).lab);
      const pb = btn("⏸ Megállít", () => { running = !running; pb.textContent = running ? "⏸ Megállít" : "▶ Indít"; kick(); });
      c2.append(pb);
      const grid = h("div", { style: "display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:.7rem;align-items:start" });
      const g1 = h("div"), g2 = h("div");
      grid.append(g1, g2);
      root.append(grid);
      const sc = makeCanvas(g1, 230, 420), pl = makeCanvas(g2, 230, 520);
      const out = h("div", { class: "readout" });
      root.append(out);
      root.append(h("p", { class: "muted", style: "font-size:.82rem;margin:.45rem 0 0" },
        "Egyszerűsített modell: lassan vándorló alapszint + 50 Hz-es „zümmögés” + kis zaj; a fésű eltolja a jelet, a hatás kb. 7 s alatt elszivárog; 0 és 1023 között vágva. " +
        "A valódi Arduino értékei mások lesznek – a viselkedés hasonló."));

      /* --- modell --- */
      const TAU = 7000, CK = 12000, R0 = 4, TS = 0.112;       // ms; fésű-erősség; cm; egy analogRead ideje (ms)
      let base = 470 + Math.random() * 70, Lk = 0, simT = 0, phi = Math.random() * 6.28;
      const PTS = 250, raw = [], avg = [];                     // 5 s · 50 pont/s
      const rHist = [];                                       // [idő, r] a mozgásérzékeléshez
      const Dof = () => CK * q / (r * r + R0 * R0);
      let eff = 0, humA = 50, clipped = 0;
      function vAt(t) {
        if (pull) return Math.max(0, Math.round(1 + 0.004 * (eff + humA * Math.sin(2 * Math.PI * 0.05 * t + phi)) + Math.random() * 2.2 - 0.6));
        const v = base + eff + humA * Math.sin(2 * Math.PI * 0.05 * t + phi) + gauss() * 3;   // 50 Hz = 0,05 / ms
        if (v < 0 || v > 1023) clipped++;
        return Math.max(0, Math.min(1023, Math.round(v)));
      }
      function loop() {                                       // a sketch egy loop()-ja
        const D = Dof();
        Lk += (D - Lk) * (1 - Math.exp(-20.5 / TAU));
        eff = D - Lk;
        humA = Math.min(600, 50 * (hand ? 4 : 1) * (lamp ? 5 : 1));
        phi += gauss() * 1.2;                                  // a mintavétel fázisa a hálózathoz képest „véletlen” (több forrás, időzítés)
        base += gauss() * 0.9 + (500 - base) * 0.0015;
        base = Math.max(400, Math.min(600, base));
        const t0 = simT, n0 = vAt(t0);
        const win = 20 - Math.random();                        // millis() felbontása: 19–20 ms
        let s = 0, db = 0;
        for (let t = t0 + TS; t - t0 < win; t += TS) { s += vAt(t); db++; }
        raw.push(n0); avg.push(Math.floor(s / db));
        if (raw.length > PTS) { raw.shift(); avg.shift(); }
        simT += win + TS + 0.4 + Math.random() * 0.8;         // + soros kiírás, időzítési bizonytalanság
      }

      /* --- jelenet --- */
      const geo = () => { const ax = Math.min(96, sc.W * 0.28), top = 44, bot = sc.H - 66; const x3 = ax + 26, x40 = sc.W - 84; return { ax, top, bot, x3, x40 }; };
      const xOfR = rr => { const G = geo(); return G.x3 + (G.x40 - G.x3) * (rr - 3) / 37; };
      function drawScene() {
        const C = colors(), ctx = sc.ctx, Wd = sc.W, Hh = sc.H, G = geo();
        ctx.clearRect(0, 0, Wd, Hh);
        /* lámpavezeték */
        if (lamp) {
          ctx.strokeStyle = "#a16207"; ctx.lineWidth = 3;
          [G.ax - 22, G.ax - 16].forEach(x => { ctx.beginPath(); ctx.moveTo(x, 8); ctx.lineTo(x, Hh - 70); ctx.stroke(); });
          ctx.fillStyle = "#a16207"; ctx.font = "700 11px system-ui"; ctx.textAlign = "right"; ctx.textBaseline = "middle";
          ctx.fillText("230 V ~", G.ax - 28, 24);
        }
        /* panel */
        const bx = 8, by = Hh - 58, bw = Math.min(150, Wd * 0.46), bh = 44;
        roundRect(ctx, bx, by, bw, bh, 6); ctx.fillStyle = "#0e7490"; ctx.fill();
        ctx.fillStyle = "#e0f2fe"; ctx.font = "700 11px system-ui"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
        ctx.fillText("Arduino MEGA", bx + 8, by + bh - 13);
        ctx.fillStyle = "#111827"; ctx.fillRect(G.ax - 5, by - 2, 10, 8);
        ctx.fillStyle = "#e0f2fe"; ctx.font = "700 10px system-ui"; ctx.textAlign = "center"; ctx.fillText("A0", G.ax, by + 14);
        /* antenna */
        ctx.strokeStyle = "#16a34a"; ctx.lineWidth = 4; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(G.ax, by); ctx.bezierCurveTo(G.ax - 6, by - 50, G.ax + 6, G.top + 40, G.ax, G.top); ctx.stroke();
        ctx.lineCap = "butt";
        ctx.fillStyle = C.muted; ctx.font = "11px system-ui"; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
        ctx.fillText("antenna", G.ax + 8, G.top + 96);
        /* lehúzó ellenállás */
        if (pull) {
          const gx = Math.min(bx + bw - 14, G.ax + 44), y1 = by - 18;
          ctx.strokeStyle = C.text; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(G.ax, y1); ctx.lineTo(G.ax + 8, y1);
          const zw = gx - G.ax - 18;
          for (let k = 0; k <= 6; k++) ctx.lineTo(G.ax + 8 + zw * k / 6, y1 + (k % 2 ? -5 : 5) * (k > 0 && k < 6 ? 1 : 0));
          ctx.lineTo(gx, y1); ctx.lineTo(gx, by - 2); ctx.stroke();
          ctx.fillStyle = "#111827"; ctx.fillRect(gx - 5, by - 2, 10, 8);
          ctx.fillStyle = C.text; ctx.font = "700 10px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
          ctx.fillText("10 kΩ", (G.ax + gx) / 2 + 4, y1 - 8);
          ctx.fillStyle = "#e0f2fe"; ctx.textBaseline = "middle"; ctx.fillText("GND", gx, by + 14);
        }
        /* indukált töltések az antennán (az aktuális eltolás szerint) */
        const n = pull ? 0 : Math.min(4, Math.round(Math.abs(eff) / 70));
        if (n) {
          const tipS = eff < 0 ? +1 : -1;                     // eff < 0: az elektronok lefelé tolódtak
          ctx.font = "700 13px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
          for (let k = 0; k < n; k++) {
            ctx.fillStyle = tipS > 0 ? C.pos : C.neg; ctx.fillText(tipS > 0 ? "+" : "−", G.ax - 10, G.top + 6 + k * 11);
            ctx.fillStyle = tipS > 0 ? C.neg : C.pos; ctx.fillText(tipS > 0 ? "−" : "+", G.ax - 10, by - 12 - k * 11);
          }
        }
        /* kéz */
        if (hand) {
          const hx = G.ax - 52, hy = G.top + 34;
          ctx.fillStyle = "#e0ac69"; ctx.strokeStyle = "#a16207"; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.ellipse(hx, hy, 15, 12, 0, 0, 7); ctx.fill(); ctx.stroke();
          [-8, -3, 2, 7].forEach((d, i) => { roundRect(ctx, hx + 8, hy + d - 2.5, 20 - Math.abs(i - 1.5) * 3, 5, 2.5); ctx.fill(); ctx.stroke(); });
          ctx.fillRect(hx - 34, hy - 6, 22, 12);
          ctx.fillStyle = C.muted; ctx.font = "11px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
          ctx.fillText("kéz", hx - 6, hy - 18);
        }
        /* fésű */
        const cx = xOfR(r), cy = G.top - 6, cw = 62;
        ctx.strokeStyle = C.border; ctx.setLineDash([3, 3]); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(G.ax + 5, cy + 30); ctx.lineTo(cx, cy + 30); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = C.muted; ctx.font = "11px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "top";
        ctx.fillText(r + " cm", (G.ax + cx) / 2 + 2, cy + 33);
        roundRect(ctx, cx, cy - 8, cw, 12, 3); ctx.fillStyle = "#64748b"; ctx.fill();
        ctx.strokeStyle = "#64748b"; ctx.lineWidth = 2;
        for (let k = 0; k < 11; k++) { const x = cx + 4 + k * (cw - 8) / 10; ctx.beginPath(); ctx.moveTo(x, cy + 4); ctx.lineTo(x, cy + 18); ctx.stroke(); }
        if (q) {
          ctx.fillStyle = q > 0 ? C.pos : C.neg; ctx.font = "700 13px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
          ctx.fillText(q > 0 ? "+ + + + +" : "− − − − −", cx + cw / 2, cy - 12);
        }
        ctx.fillStyle = C.muted; ctx.font = "11px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
        ctx.fillText("fésű (húzd!)", Math.min(Wd - 34, cx + cw / 2), cy + 62);
      }
      /* --- plotter --- */
      function drawPlot() {
        const C = colors(), ctx = pl.ctx, Wd = pl.W, Hh = pl.H, L = 38, Rp = 8, T = 26, B = 20;
        ctx.clearRect(0, 0, Wd, Hh);
        const Y = v => T + (Hh - T - B) * (1 - v / 1023), X = i => L + (Wd - L - Rp) * i / (PTS - 1);
        ctx.font = "10px system-ui"; ctx.textAlign = "right"; ctx.textBaseline = "middle";
        [0, 256, 512, 768, 1023].forEach(v => {
          ctx.strokeStyle = C.border; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(L, Y(v)); ctx.lineTo(Wd - Rp, Y(v)); ctx.stroke();
          ctx.fillStyle = C.muted; ctx.fillText(v, L - 4, Y(v));
        });
        ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
        [0, 1, 2, 3, 4, 5].forEach(s => { const x = L + (Wd - L - Rp) * (5 - s) / 5; ctx.textAlign = s ? "center" : "right"; ctx.fillText(s ? "−" + s + " s" : "most", s ? x : Wd - 2, Hh - 5); });
        const off = PTS - raw.length;
        const line = (arr, col, w, a) => {
          if (arr.length < 2) return;
          ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineJoin = "round";
          ctx.beginPath(); arr.forEach((v, i) => (i ? ctx.lineTo(X(off + i), Y(v)) : ctx.moveTo(X(off + i), Y(v)))); ctx.stroke();
          ctx.globalAlpha = 1;
        };
        const RAWC = "#f59e0b";
        line(raw, RAWC, 1.2, 0.7);
        line(avg, C.accent, 2.6, 1);
        /* jelmagyarázat */
        ctx.font = "600 11px system-ui"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
        ctx.globalAlpha = 0.8; ctx.fillStyle = RAWC; ctx.fillRect(L + 4, 9, 16, 3); ctx.globalAlpha = 1;
        ctx.fillStyle = C.text; ctx.fillText("nyers", L + 24, 11);
        ctx.fillStyle = C.accent; ctx.fillRect(L + 72, 8.5, 16, 4);
        ctx.fillStyle = C.text; ctx.fillText("átlag", L + 92, 11);
        if (!running) { ctx.fillStyle = C.muted; ctx.textAlign = "right"; ctx.fillText("megállítva", Wd - Rp, 11); }
      }
      function drawAll() { drawScene(); drawPlot(); }

      /* --- helyzethez illő mondat --- */
      function status() {
        const now = simT, past = rHist.find(p => p[0] >= now - 450) || [now, r];
        const dr = r - past[1];
        const s = [];
        if (pull) s.push("Lehúzó ellenállás: a bemenet már nem lebeg – a jel 0 körül áll, alig zajos.");
        else {
          if (Math.abs(dr) >= 1) {
            if (!q) s.push("A semleges fésűnek nincs hatása – előbb dörzsöld meg!");
            else if (dr < 0) s.push("A fésű közeledik: megosztás – az átlag elmozdul.");
            else s.push("A fésű távolodik: a megosztás megszűnik – az átlag visszafelé mozdul, és túl is lőhet.");
          } else if (q && Math.abs(Dof()) > 25 && Math.abs(Lk) > 15) s.push("A fésű áll: a hatás lassan elszivárog.");
          else if (Math.abs(eff) > 25) s.push("Túllövés: a bemenet „hozzászokott” a fésűhöz – most lassan visszakúszik.");
          if (hand && lamp) s.push("Kéz és lámpavezeték: nagyon erős 50 Hz-es zümmögés – az átlag ezt is kiszűri.");
          else if (hand) s.push("Kéz közelít: erősebb 50 Hz-es zümmögés.");
          else if (lamp) s.push("Lámpavezeték: a hálózat 50 Hz-es mezője erős zümmögést kelt – az átlag kiszűri.");
          if (clipped) s.push("Ütközés: a jel 0-nál vagy 1023-nál vágódik.");
          if (!s.length) s.push("Nyugalom: a nyers görbe a hálózat 50 Hz-es mezőjétől ingadozik, az átlag lassan vándorol.");
        }
        return s.join(" ");
      }
      let txtT = 0;
      function readout(force) {
        if (!force && simT - txtT < 150) return;
        txtT = simT;
        const n = raw.length ? raw[raw.length - 1] : 0, a = avg.length ? avg[avg.length - 1] : 0;
        out.innerHTML = `nyers: <b>${n}</b> · átlag: <b>${a}</b><br><span style="font-family:var(--font)">${status()}</span>`;
      }

      /* --- húzás --- */
      let drag = false;
      const setR = x => {
        const G = geo(), rr = Math.round(3 + 37 * (x - 31 - G.x3) / (G.x40 - G.x3));
        const v = Math.max(3, Math.min(40, rr));
        if (v !== r) sl.set(v);
      };
      sc.addEventListener("pointerdown", ev => {
        const [x, y] = pointer(sc, ev), G = geo();
        if (x > G.ax + 12 && y < G.top + 70) { drag = true; sc.setPointerCapture(ev.pointerId); setR(x); if (!running) drawAll(); }
      });
      sc.addEventListener("pointermove", ev => { if (drag) { setR(pointer(sc, ev)[0]); if (!running) drawAll(); } });
      const end = () => (drag = false);
      sc.addEventListener("pointerup", end); sc.addEventListener("pointercancel", end);
      sc.style.cursor = "grab";

      /* --- futtatás --- */
      let raf = null, last = null;
      function frame(now) {
        const dt = last == null ? 16 : Math.min(100, now - last);
        last = now;
        const tEnd = simT + dt;
        clipped = 0;
        while (simT < tEnd) { rHist.push([simT, r]); loop(); }
        while (rHist.length && rHist[0][0] < simT - 1000) rHist.shift();
        drawAll(); readout();
        raf = running && visible ? requestAnimationFrame(frame) : null;
      }
      function kick() {
        if (running && visible && !raf) { last = null; raf = requestAnimationFrame(frame); }
        if (!running) { drawAll(); readout(true); }
      }
      watchVisible(root, v => { visible = v; kick(); });
      for (let k = 0; k < 120; k++) { rHist.push([simT, r]); loop(); }      // induláskor már legyen görbe
      drawAll(); readout(true); kick();
      root.__fi = { state: () => ({ q, r, hand, lamp, pull, running, raf: !!raf, base, Lk, eff, raw: raw.slice(-50), avg: avg.slice(-50) }), setR: v => sl.set(v) };   // tesztkampó
      onTheme(() => drawAll());
      onResize(() => { sc.refit(); pl.refit(); drawAll(); });
    };
  }

  /* ------------------------------------------------------------------
     Indítás
     ------------------------------------------------------------------ */
  function boot() {
    document.querySelectorAll(".widget[data-widget]").forEach(root => {
      const f = W[root.dataset.widget];
      if (!f) return;
      try { f(root); }
      catch (e) { root.append(h("p", { class: "muted" }, "Hiba a szemléltetés betöltésekor: " + e.message)); console.error(e); }
    });
    document.querySelectorAll(".widget-static[data-fieldpic]").forEach(el => {
      try { W.__fieldpic && W.__fieldpic(el); } catch (e) { console.error(e); }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
