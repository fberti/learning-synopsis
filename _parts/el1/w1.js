
  /* ==================================================================
     1.1 atom-charge – atommodell: elektronok elvétele / hozzáadása
     ================================================================== */
  W["atom-charge"] = root => {
    header(root, "Atom és ion", "Válassz elemet, aztán vegyél el vagy adj hozzá elektronokat. A mag nem változik – csak az elektronok mozdulnak.");
    const ELEM = [
      ["H", "hidrogén", 1, 0], ["He", "hélium", 2, 2], ["Li", "lítium", 3, 4], ["C", "szén", 6, 6],
      ["O", "oxigén", 8, 8], ["Na", "nátrium", 11, 12], ["Cl", "klór", 17, 18], ["Cu", "réz", 29, 35]
    ];
    let el = 2, ne = ELEM[el][2];
    const ctl = h("div", { class: "controls" });
    toggleGroup(ctl, ELEM.map((x, i) => [i, x[0]]), el, v => { el = v; ne = ELEM[v][2]; draw(); });
    const ctl2 = h("div", { class: "controls" },
      btn("− elektron (elvesz)", () => { if (ne > 0) ne--; draw(); }),
      btn("+ elektron (hozzáad)", () => { if (ne < ELEM[el][2] + 3) ne++; draw(); }),
      btn("Semleges atom", () => { ne = ELEM[el][2]; draw(); }));
    root.append(ctl, ctl2);
    const cv = makeCanvas(root, 280, 520);
    const stats = h("div", { class: "stat-row" });
    const read = h("div", { class: "readout", style: "margin-top:.5rem" });
    root.append(stats, read);
    const SHELL = [2, 8, 18, 32];

    function draw() {
      const C = colors(), ctx = cv.ctx, Wd = cv.W, Hd = cv.H, cx = Wd / 2, cy = Hd / 2;
      const [sym, name, Z, N] = ELEM[el];
      ctx.clearRect(0, 0, Wd, Hd);
      /* héjak */
      let left = ne, shells = [];
      for (const cap of SHELL) { if (left <= 0) break; shells.push(Math.min(cap, left)); left -= cap; }
      const nShell = Math.max(shells.length, 1), rMax = Math.min(Hd / 2 - 14, Wd / 2 - 14), r0 = 34;
      for (let s = 0; s < Math.max(nShell, 1); s++) {
        const r = r0 + (rMax - r0) * (nShell === 1 ? 0.55 : s / (nShell - 1));
        ctx.strokeStyle = C.border; ctx.lineWidth = 1; ctx.setLineDash([3, 4]);
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, 2 * Math.PI); ctx.stroke(); ctx.setLineDash([]);
        const k = shells[s] || 0;
        for (let i = 0; i < k; i++) {
          const a = -Math.PI / 2 + 2 * Math.PI * i / k + s * 0.3;
          chargeDot(ctx, cx + r * Math.cos(a), cy + r * Math.sin(a), 6, -1, C, "");
        }
      }
      /* mag: protonok és neutronok kis halomban */
      const tot = Z + N, rn = Math.min(26, 6 + 3.2 * Math.sqrt(tot));
      for (let i = 0; i < tot; i++) {
        const t = i / Math.max(tot - 1, 1), rr = rn * Math.sqrt(t) * 0.85, a = i * 2.39996;
        ctx.fillStyle = C.muted;
        ctx.beginPath(); ctx.arc(cx + rr * Math.cos(a), cy + rr * Math.sin(a), 4.2, 0, 2 * Math.PI); ctx.fill();
      }
      /* a protonokat külön, egyenletesen szórva festjük pirosra */
      for (let i = 0; i < Z; i++) {
        const j = Math.round(i * tot / Z), t = j / Math.max(tot - 1, 1), rr = rn * Math.sqrt(t) * 0.85, a = j * 2.39996;
        ctx.fillStyle = C.pos; ctx.beginPath(); ctx.arc(cx + rr * Math.cos(a), cy + rr * Math.sin(a), 4.2, 0, 2 * Math.PI); ctx.fill();
      }
      ctx.font = "12px system-ui"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
      [["proton", C.pos], ["neutron", C.muted], ["elektron", C.neg]].forEach(([t, col], i) => {
        ctx.fillStyle = col; ctx.beginPath(); ctx.arc(13, 14 + 16 * i, 4, 0, 2 * Math.PI); ctx.fill();
        ctx.fillStyle = C.muted; ctx.fillText(t, 22, 14 + 16 * i);
      });

      const q = Z - ne;
      const supq = q === 0 ? "" : (Math.abs(q) > 1 ? String(Math.abs(q)).split("").map(c => SUP[c]).join("") : "") + (q > 0 ? "⁺" : "⁻");
      stats.innerHTML = "";
      [["proton", Z], ["neutron", N], ["elektron", ne], ["nettó töltés", (q > 0 ? "+" : q < 0 ? "−" : "") + (q ? Math.abs(q) + " e" : "0")],
       ["coulombban", q ? sci(q * E_CH, 3) + " C" : "0 C"]]
        .forEach(([l, v]) => stats.append(h("div", { class: "stat" }, h("div", { class: "v" }, String(v)), h("div", { class: "l" }, l))));
      read.innerHTML = q === 0
        ? `A ${name}atomban ${Z} proton és ${Z} elektron van: kifelé <b>semleges</b>.`
        : q > 0
          ? `<b>${sym}${supq}</b> – pozitív ion: ${q} elektron <b>hiányzik</b>. A protonok száma nem változott, csak elektron távozott.`
          : `<b>${sym}${supq}</b> – negatív ion: ${-q} elektron van <b>többletben</b>.`;
    }
    draw();
    window.addEventListener("resize", () => { cv.refit(); draw(); });
    new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  };

  /* ==================================================================
     1.3 coulomb-lab – két töltés, erőnyilak, F(r) grafikon
     ================================================================== */
  W["coulomb-lab"] = root => {
    header(root, "Coulomb-labor", "Állítsd be a két töltést és a távolságot. Figyeld a nyilakat (mindkét töltésre ugyanakkora erő hat!) és lent az $F(r)$ görbét.");
    let q1 = 1, q2 = 1, r = 10, prevF = null, note = "";
    const ctl = h("div", { class: "controls" });
    const s1 = slider(ctl, "$Q_1$", -5, 5, q1, 0.5, v => fmt(v, 1) + " µC", v => { q1 = v; upd(); });
    const s2 = slider(ctl, "$Q_2$", -5, 5, q2, 0.5, v => fmt(v, 1) + " µC", v => { q2 = v; upd(); });
    const sr = slider(ctl, "$r$", 5, 50, r, 1, v => v + " cm", v => { r = v; upd(); });
    const ctl2 = h("div", { class: "controls" },
      btn("$r$ duplázása", () => { if (r * 2 <= 50) { mark("r ×2"); sr.set(r * 2); } else note = "50 cm-nél tovább nem lehet duplázni."; upd(); }),
      btn("$r$ felezése", () => { if (r / 2 >= 5) { mark("r ÷2"); sr.set(r / 2); } upd(); }),
      btn("$Q_1$ duplázása", () => { if (Math.abs(q1 * 2) <= 5) { mark("Q₁ ×2"); s1.set(q1 * 2); } upd(); }),
      btn("Alaphelyzet", () => { prevF = null; note = ""; s1.set(1); s2.set(1); sr.set(10); }));
    root.append(ctl, ctl2);
    const cv = makeCanvas(root, 150, 720);
    const cv2 = makeCanvas(root, 190, 720);
    const read = h("div", { class: "readout", style: "margin-top:.5rem" });
    root.append(read);
    let lastMark = "";
    function mark(m) { prevF = force(); lastMark = m; }
    const force = () => K * Math.abs(q1 * q2) * 1e-12 / Math.pow(r / 100, 2);

    function upd() {
      const C = colors(), F = force();
      /* jelenet */
      let ctx = cv.ctx, Wd = cv.W, Hd = cv.H;
      ctx.clearRect(0, 0, Wd, Hd);
      const m0 = 78, x1 = m0, x2 = m0 + (Wd - 2 * m0) * r / 50, y = Hd / 2 + 10;
      ctx.strokeStyle = C.border; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(x1, y + 26); ctx.lineTo(x2, y + 26); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = C.muted; ctx.font = "12px system-ui"; ctx.textAlign = "center"; ctx.fillText(`r = ${r} cm`, (x1 + x2) / 2, y + 40);
      const rad = q => 10 + 3 * Math.sqrt(Math.abs(q));
      chargeDot(ctx, x1, y, rad(q1), q1, C); chargeDot(ctx, x2, y, rad(q2), q2, C);
      if (F > 0) {
        const rep = q1 * q2 > 0, room = rep ? Math.min(x1 - rad(q1), Wd - x2 - rad(q2)) - 10 : (x2 - x1) / 2 - Math.max(rad(q1), rad(q2)) - 6;
        const L = Math.max(6, Math.min(110, room, 22 * Math.log10(F / 1e-4 + 1) + 6));
        arrow(ctx, x1 + (rep ? -rad(q1) - 3 : rad(q1) + 3), y, x1 + (rep ? -rad(q1) - 3 - L : rad(q1) + 3 + L), y, C.accent, 3, 9);
        arrow(ctx, x2 + (rep ? rad(q2) + 3 : -rad(q2) - 3), y, x2 + (rep ? rad(q2) + 3 + L : -rad(q2) - 3 - L), y, C.accent, 3, 9);
        ctx.fillStyle = C.text; ctx.font = "600 13px system-ui";
        ctx.fillText(rep ? "taszítás" : "vonzás", (x1 + x2) / 2, 18);
      } else {
        ctx.fillStyle = C.muted; ctx.font = "13px system-ui"; ctx.fillText("Az egyik töltés nulla: nincs erő.", (x1 + x2) / 2, 18);
      }
      /* F(r) grafikon */
      ctx = cv2.ctx; Wd = cv2.W; Hd = cv2.H;
      ctx.clearRect(0, 0, Wd, Hd);
      const L0 = 52, R0 = Wd - 12, T0 = 14, B0 = Hd - 30;
      const Fmax = K * Math.max(Math.abs(q1 * q2), 0.25) * 1e-12 / 0.0025 * 1.05;
      const X = rr => L0 + (R0 - L0) * (rr - 5) / 45, Y = f => B0 - (B0 - T0) * Math.min(f / Fmax, 1.02);
      ctx.strokeStyle = C.border; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(L0, T0); ctx.lineTo(L0, B0); ctx.lineTo(R0, B0); ctx.stroke();
      ctx.fillStyle = C.muted; ctx.font = "11px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "top";
      for (let t = 5; t <= 50; t += 5) ctx.fillText(t, X(t), B0 + 4);
      ctx.fillText("r (cm)", (L0 + R0) / 2, B0 + 16);
      ctx.save(); ctx.translate(12, (T0 + B0) / 2); ctx.rotate(-Math.PI / 2); ctx.fillText("F (N)", 0, 0); ctx.restore();
      ctx.textAlign = "right"; ctx.textBaseline = "middle"; ctx.fillText(si(Fmax / 1.05, "N", 2).replace(" ", " "), L0 - 4, Y(Fmax / 1.05));
      ctx.fillText("0", L0 - 4, B0);
      const QQ = Math.abs(q1 * q2);
      if (QQ > 0) {
        /* összehasonlításként: 1/r-es görbe, ugyanabból a pontból */
        ctx.strokeStyle = C.muted; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.2; ctx.beginPath();
        for (let t = 5; t <= 50; t += 0.5) { const f = F * r / t; t === 5 ? ctx.moveTo(X(t), Y(f)) : ctx.lineTo(X(t), Y(f)); }
        ctx.stroke(); ctx.setLineDash([]);
        ctx.strokeStyle = C.accent; ctx.lineWidth = 2.2; ctx.beginPath();
        for (let t = 5; t <= 50; t += 0.25) { const f = K * QQ * 1e-12 / Math.pow(t / 100, 2); t === 5 ? ctx.moveTo(X(t), Y(f)) : ctx.lineTo(X(t), Y(f)); }
        ctx.stroke();
        ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(X(r), Y(F), 5, 0, 2 * Math.PI); ctx.fill();
        ctx.textAlign = "right"; ctx.textBaseline = "top"; ctx.font = "12px system-ui";
        ctx.fillStyle = C.accent; ctx.fillText("F ∼ 1/r² (Coulomb)", R0, T0);
        ctx.fillStyle = C.muted; ctx.fillText("szaggatott: ha 1/r lenne (nem az!)", R0, T0 + 16);
      }
      /* kiírás */
      let ratio = "";
      if (prevF != null && prevF > 0 && F > 0) {
        const k = F / prevF;
        ratio = `<br>Az utolsó lépés (${lastMark}) után az erő az előző <b>${fmt(k, 3)}</b>-szerese.`;
      }
      read.innerHTML = `$F = 9 \\cdot 10^9 \\cdot \\dfrac{|${fmt(q1, 1)} \\cdot 10^{-6} \\cdot ${fmt(q2, 1)} \\cdot 10^{-6}|}{(${fmt(r / 100, 2)})^2} \\approx$ <b>${si(F, "N")}</b>` +
        (F > 0 ? ` – ${q1 * q2 > 0 ? "taszítás" : "vonzás"}, mindkét töltésre ugyanakkora.` : "") + ratio + (note ? "<br>" + note : "");
      note = "";
      math(read); math(ctl); math(ctl2);
    }
    upd();
    window.addEventListener("resize", () => { cv.refit(); cv2.refit(); upd(); });
    new MutationObserver(upd).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  };

  /* ==================================================================
     1.4 field-lines – erővonalak, próbatöltés, térerősség-mérő
     ================================================================== */
  {
    /* töltések: {x, y, q} logikai pixelben; q nC-ban. A vászon szélessége = 20 cm. */
    const fieldAt = (Q, x, y) => {
      let ex = 0, ey = 0;
      for (const c of Q) {
        const dx = x - c.x, dy = y - c.y, r2 = dx * dx + dy * dy, r = Math.sqrt(r2);
        if (r < 1e-6) continue;
        ex += c.q * dx / (r2 * r); ey += c.q * dy / (r2 * r);
      }
      return [ex, ey];
    };
    /* egy erővonal követése; dir = +1 (a mező irányában) vagy −1 */
    function trace(Q, x, y, dir, Wd, Hd, rStop) {
      const pts = [[x, y]], ds = 2.5;
      for (let s = 0; s < 1600; s++) {
        let [ex, ey] = fieldAt(Q, x, y), m = Math.hypot(ex, ey);
        if (m < 1e-12) return { pts, end: "null" };
        const mx = x + dir * ex / m * ds / 2, my = y + dir * ey / m * ds / 2;
        [ex, ey] = fieldAt(Q, mx, my); m = Math.hypot(ex, ey);
        if (m < 1e-12) return { pts, end: "null" };
        x += dir * ex / m * ds; y += dir * ey / m * ds;
        pts.push([x, y]);
        for (const c of Q) if (Math.hypot(x - c.x, y - c.y) < rStop) return { pts, end: c.q > 0 ? "pos" : "neg" };
        if (x < -80 || x > Wd + 80 || y < -80 || y > Hd + 80) return { pts, end: "out" };
      }
      return { pts, end: "max" };
    }
    function drawLines(ctx, Q, Wd, Hd, C, perUnit, rStart) {
      const lines = [];
      for (const c of Q) {
        if (!c.q) continue;
        const n = Math.max(2, Math.round(perUnit * Math.abs(c.q)));
        for (let i = 0; i < n; i++) {
          const a = 2 * Math.PI * (i + 0.5) / n;
          const t = trace(Q, c.x + rStart * Math.cos(a), c.y + rStart * Math.sin(a), c.q > 0 ? 1 : -1, Wd, Hd, rStart - 1);
          if (c.q < 0 && t.end === "pos") continue;          /* ezt a pozitív oldalról már megrajzoltuk */
          lines.push({ pts: t.pts, rev: c.q < 0 });
        }
      }
      ctx.strokeStyle = C.muted; ctx.lineWidth = 1.2;
      for (const L of lines) {
        ctx.beginPath(); L.pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
        /* nyílhegy a vonal közepe táján, a mező irányában */
        const k = Math.floor(L.pts.length * 0.45);
        if (L.pts.length > 12) {
          let [xa, ya] = L.pts[k], [xb, yb] = L.pts[k + 3];
          if (L.rev) [xa, ya, xb, yb] = [xb, yb, xa, ya];
          const ang = Math.atan2(yb - ya, xb - xa);
          ctx.fillStyle = C.muted; ctx.beginPath(); ctx.moveTo(xb, yb);
          ctx.lineTo(xb - 7 * Math.cos(ang - 0.45), yb - 7 * Math.sin(ang - 0.45));
          ctx.lineTo(xb - 7 * Math.cos(ang + 0.45), yb - 7 * Math.sin(ang + 0.45)); ctx.closePath(); ctx.fill();
        }
      }
    }
    function presetCharges(name, Wd, Hd) {
      const cx = Wd / 2, cy = Hd / 2, d = Math.min(Wd, Hd) * 0.22;
      if (name === "single+") return [{ x: cx, y: cy, q: 1 }];
      if (name === "single-") return [{ x: cx, y: cy, q: -1 }];
      if (name === "dipole") return [{ x: cx - d, y: cy, q: 1 }, { x: cx + d, y: cy, q: -1 }];
      if (name === "like") return [{ x: cx - d, y: cy, q: 1 }, { x: cx + d, y: cy, q: 1 }];
      if (name === "unequal") return [{ x: cx - d, y: cy, q: 2 }, { x: cx + d, y: cy, q: -1 }];
      if (name === "plates") {
        const Q = [], n = 11, gap = Hd * 0.2, x0 = Wd * 0.18, x1 = Wd * 0.82;
        for (let i = 0; i < n; i++) {
          const x = x0 + (x1 - x0) * i / (n - 1);
          Q.push({ x, y: cy - gap, q: 0.5 }, { x, y: cy + gap, q: -0.5 });
        }
        return Q;
      }
      return [];
    }
    /* statikus kis ábrák a szövegben */
    W.__fieldpic = el => {
      const name = el.dataset.fieldpic;
      const cv = h("canvas"); el.append(cv);
      const Wd = el.clientWidth || 160, Hd = el.clientHeight || 160, dpr = window.devicePixelRatio || 1;
      cv.style.width = Wd + "px"; cv.style.height = Hd + "px"; cv.style.borderRadius = "10px"; cv.style.background = "var(--bg-soft)";
      cv.width = Wd * dpr; cv.height = Hd * dpr;
      const ctx = cv.getContext("2d");
      const paint = () => {
        const C = colors();
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, Wd, Hd);
        const Q = presetCharges(name === "single+" ? "single+" : name, Wd, Hd);
        if (name === "plates") {
          ctx.fillStyle = C.posSoft; ctx.fillRect(Wd * 0.14, Hd / 2 - Hd * 0.2 - 4, Wd * 0.72, 8);
          ctx.fillStyle = C.negSoft; ctx.fillRect(Wd * 0.14, Hd / 2 + Hd * 0.2 - 4, Wd * 0.72, 8);
        }
        drawLines(ctx, Q, Wd, Hd, C, name === "plates" ? 2 : 10, name === "plates" ? 4 : 9);
        Q.forEach(c => chargeDot(ctx, c.x, c.y, name === "plates" ? 4 : 8, c.q, C, name === "plates" ? "" : undefined));
      };
      paint();
      new MutationObserver(paint).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    };

    W["field-lines"] = root => {
      header(root, "Erővonalak", "Kattints üres helyre új töltésért, húzd a töltéseket, dupla kattintás (vagy hosszú érintés) töröl. A mutató helyén a térerősség nagyságát és irányát is látod (a vászon szélessége 20 cm, a töltések nC-ban).");
      let Q = [], newQ = 1, preset = "dipole", grid = false, probe = null, particle = null, drag = -1, moved = false, raf = 0, pressT = 0;
      const ctl = h("div", { class: "controls" });
      ctl.append(h("span", { class: "muted" }, "Minta:"));
      const paintPreset = toggleGroup(ctl, [["single+", "egy +"], ["dipole", "dipólus"], ["like", "két +"], ["unequal", "+2 és −1"], ["plates", "két lemez"], ["empty", "üres"]], preset,
        v => { preset = v; Q = presetCharges(v, cv.W, cv.H); particle = null; draw(); });
      const ctl2 = h("div", { class: "controls" });
      ctl2.append(h("span", { class: "muted" }, "Új töltés:"));
      toggleGroup(ctl2, [[1, "+1 nC"], [-1, "−1 nC"], [2, "+2 nC"], [-2, "−2 nC"]], newQ, v => { newQ = v; });
      const gbtn = btn("Térerősség-nyilak", () => { grid = !grid; gbtn.classList.toggle("on", grid); draw(); });
      const pbtn = btn("Próbatöltés elengedése", () => {
        const p = probe || [cv.W * 0.5, cv.H * 0.25];
        particle = { x: p[0], y: p[1], vx: 0, vy: 0, path: [[p[0], p[1]]] };
        if (!raf) raf = requestAnimationFrame(step);
      });
      ctl2.append(gbtn, pbtn);
      root.append(ctl, ctl2);
      const cv = makeCanvas(root, 380, 760);
      const read = h("div", { class: "readout", style: "margin-top:.5rem" });
      root.append(read);
      Q = presetCharges(preset, cv.W, cv.H);
      const pxToM = () => 0.2 / cv.W;
      const Emag = (x, y) => { const [ex, ey] = fieldAt(Q, x, y), s = pxToM(); return K * 1e-9 * Math.hypot(ex, ey) / (s * s); };

      function draw() {
        const C = colors(), ctx = cv.ctx, Wd = cv.W, Hd = cv.H;
        ctx.clearRect(0, 0, Wd, Hd);
        if (preset === "plates" && Q.length === 22) {
          ctx.fillStyle = C.posSoft; ctx.fillRect(Wd * 0.15, Hd / 2 - Hd * 0.2 - 5, Wd * 0.7, 10);
          ctx.fillStyle = C.negSoft; ctx.fillRect(Wd * 0.15, Hd / 2 + Hd * 0.2 - 5, Wd * 0.7, 10);
        }
        if (grid && Q.length) {
          const st = 34;
          for (let y = st / 2; y < Hd; y += st) for (let x = st / 2; x < Wd; x += st) {
            const [ex, ey] = fieldAt(Q, x, y), m = Math.hypot(ex, ey);
            if (m < 1e-12 || Q.some(c => Math.hypot(x - c.x, y - c.y) < 14)) continue;
            const e = K * 1e-9 * m / Math.pow(pxToM(), 2), a = Math.max(0.15, Math.min(1, (Math.log10(e) - 1) / 4));
            ctx.globalAlpha = a; arrow(ctx, x - 9 * ex / m, y - 9 * ey / m, x + 9 * ex / m, y + 9 * ey / m, C.accent, 1.5, 5);
          }
          ctx.globalAlpha = 1;
        }
        drawLines(ctx, Q, Wd, Hd, C, preset === "plates" ? 2 : 10, preset === "plates" ? 5 : 11);
        Q.forEach(c => chargeDot(ctx, c.x, c.y, preset === "plates" && Math.abs(c.q) === 0.5 ? 5 : 9 + 2 * Math.abs(c.q), c.q, C,
          preset === "plates" && Math.abs(c.q) === 0.5 ? "" : undefined));
        if (particle) {
          ctx.strokeStyle = C.ok; ctx.lineWidth = 2; ctx.beginPath();
          particle.path.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
          ctx.fillStyle = C.ok; ctx.beginPath(); ctx.arc(particle.x, particle.y, 5, 0, 2 * Math.PI); ctx.fill();
        }
        if (probe && Q.length) {
          const [x, y] = probe, [ex, ey] = fieldAt(Q, x, y), m = Math.hypot(ex, ey);
          ctx.strokeStyle = C.text; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y, 4, 0, 2 * Math.PI); ctx.stroke();
          if (m > 1e-12) { const L = Math.max(12, Math.min(60, 12 * Math.log10(Emag(x, y)))); arrow(ctx, x, y, x + L * ex / m, y + L * ey / m, C.text, 2, 8); }
        }
        let s = Q.length ? "" : "Üres a vászon: kattints, és tegyél le egy töltést.";
        if (probe && Q.length) {
          const e = Emag(...probe);
          s = `A mutató helyén: <b>E ≈ ${si(e, "N/C")}</b> (a nyíl a pozitív próbatöltésre ható erő iránya).`;
          if (e < 5 && Q.length > 1) s += " Itt a mezők majdnem kioltják egymást.";
        }
        if (particle) s += (s ? "<br>" : "") + "<span style='color:var(--ok)'>Zöld:</span> az elengedett pozitív próbatöltés pályája. Ahol a vonalak görbülnek, a pálya <b>nem</b> követi őket – a töltés „kisodródik”, mert van sebessége.";
        read.innerHTML = s;
      }
      function step() {
        raf = 0;
        if (!particle) return;
        for (let i = 0; i < 4; i++) {
          let [ex, ey] = fieldAt(Q, particle.x, particle.y);
          const m = Math.hypot(ex, ey), lim = 0.004;
          if (m > lim) { ex *= lim / m; ey *= lim / m; }
          particle.vx += 160 * ex; particle.vy += 160 * ey;
          particle.x += particle.vx; particle.y += particle.vy;
          particle.path.push([particle.x, particle.y]);
        }
        const hit = Q.some(c => c.q < 0 && Math.hypot(particle.x - c.x, particle.y - c.y) < 10);
        const out = particle.x < -30 || particle.x > cv.W + 30 || particle.y < -30 || particle.y > cv.H + 30;
        draw();
        if (!hit && !out && particle.path.length < 4000) raf = requestAnimationFrame(step);
      }
      const hitCharge = (x, y) => Q.findIndex(c => Math.hypot(x - c.x, y - c.y) < 14);
      cv.addEventListener("pointerdown", ev => {
        const [x, y] = pointer(cv, ev); drag = hitCharge(x, y); moved = false; cv.setPointerCapture(ev.pointerId);
        if (drag >= 0) { clearTimeout(pressT); pressT = setTimeout(() => { if (!moved && drag >= 0) { Q.splice(drag, 1); drag = -1; markCustom(); draw(); } }, 650); }
      });
      cv.addEventListener("pointermove", ev => {
        const [x, y] = pointer(cv, ev); probe = [x, y];
        if (drag >= 0) { moved = true; clearTimeout(pressT); Q[drag].x = Math.max(8, Math.min(cv.W - 8, x)); Q[drag].y = Math.max(8, Math.min(cv.H - 8, y)); markCustom(); }
        draw();
      });
      cv.addEventListener("pointerup", ev => {
        clearTimeout(pressT);
        const [x, y] = pointer(cv, ev);
        if (drag < 0 && hitCharge(x, y) < 0 && Q.length < 30) { Q.push({ x, y, q: newQ }); markCustom(); }
        drag = -1; probe = [x, y]; draw();
      });
      cv.addEventListener("dblclick", ev => { const [x, y] = pointer(cv, ev), i = hitCharge(x, y); if (i >= 0) { Q.splice(i, 1); markCustom(); draw(); } });
      cv.addEventListener("pointerleave", () => { if (drag < 0) { probe = null; draw(); } });
      function markCustom() { if (preset !== "custom") { preset = "custom"; paintPreset("custom"); } particle = null; }
      draw();
      window.addEventListener("resize", () => { const ow = cv.W; cv.refit(); const f = cv.W / ow; Q.forEach(c => { c.x *= f; }); draw(); });
      new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    };
  }

  /* ==================================================================
     1.2 conductor-insulator – megosztás (vezető) és polarizáció (szigetelő)
     ================================================================== */
  W["conductor-insulator"] = root => {
    header(root, "Megosztás és polarizáció", "Közelíts egy töltött rudat egy semleges testhez. Vezetőben a szabad elektronok átvándorolnak, szigetelőben a molekulák csak polarizálódnak.");
    let kind = "cond", rodQ = -1, dist = 0.7, bodyQ = 0, t0 = performance.now(), raf = 0;
    const ctl = h("div", { class: "controls" });
    toggleGroup(ctl, [["cond", "vezető (fémgolyó)"], ["ins", "szigetelő (papír)"]], kind, v => { kind = v; bodyQ = 0; draw(); });
    toggleGroup(ctl, [[-1, "negatív rúd"], [1, "pozitív rúd"]], rodQ, v => { rodQ = v; bodyQ = 0; draw(); });
    const ctl2 = h("div", { class: "controls" });
    slider(ctl2, "a rúd távolsága", 0.15, 1, dist, 0.01, v => (v >= 0.98 ? "messze" : Math.round(v * 30) + " cm"), v => { dist = v; draw(); });
    const touch = btn("Érintsd hozzá!", () => { if (kind === "cond") { bodyQ = rodQ; } draw(); });
    ctl2.append(touch, btn("Visszaállít", () => { bodyQ = 0; draw(); }));
    root.append(ctl, ctl2);
    const cv = makeCanvas(root, 240, 720);
    const read = h("div", { class: "readout", style: "margin-top:.5rem" });
    root.append(read);

    /* rögzített, álvéletlen elrendezés a testen belül */
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const ions = [], els = [];
    for (let i = 0; i < 40; i++) {
      let x, y; do { x = rnd() * 2 - 1; y = rnd() * 2 - 1; } while (x * x + y * y > 0.8);
      ions.push([x, y]);
      let u, v; do { u = rnd() * 2 - 1; v = rnd() * 2 - 1; } while (u * u + v * v > 0.8);
      els.push([u, v, rnd() * 6.28]);
    }
    const mols = [];
    for (let gy = -3; gy <= 3; gy++) for (let gx = -3; gx <= 3; gx++) {
      const x = gx * 0.26, y = gy * 0.26; if (x * x + y * y < 0.75) mols.push([x, y, rnd() * 6.28]);
    }

    function draw() {
      cancelAnimationFrame(raf);
      const C = colors(), ctx = cv.ctx, Wd = cv.W, Hd = cv.H, now = performance.now() - t0;
      ctx.clearRect(0, 0, Wd, Hd);
      const R = Math.min(Hd * 0.38, Wd * 0.2), bx = Wd * 0.68, by = Hd / 2;
      const near = dist < 0.98, s = near ? Math.min(1, 0.06 / (dist * dist)) : 0;   /* a hatás erőssége 0…1 */
      const rodX = (bx - R - 14) - (bx - R - 14 - 40) * (dist - 0.15) / 0.85;   /* a rúd jobb széle */
      /* rúd */
      ctx.fillStyle = rodQ > 0 ? C.posSoft : C.negSoft; ctx.strokeStyle = rodQ > 0 ? C.pos : C.neg; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(rodX - 26, by - 70, 26, 140, 8) : ctx.rect(rodX - 26, by - 70, 26, 140); ctx.fill(); ctx.stroke();
      ctx.fillStyle = rodQ > 0 ? C.pos : C.neg; ctx.font = "700 15px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      for (let i = 0; i < 6; i++) ctx.fillText(rodQ > 0 ? "+" : "−", rodX - 13, by - 55 + i * 22);
      /* test */
      ctx.fillStyle = kind === "cond" ? C.soft : C.card; ctx.strokeStyle = C.border; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(bx, by, R, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
      ctx.fillStyle = C.muted; ctx.font = "12px system-ui";
      ctx.fillText(kind === "cond" ? "fémgolyó" : "papírgalacsin", bx, by + R + 14);
      const push = -rodQ;                       /* elektronok iránya: negatív rúd taszít (+x felé, el a rúdtól) */
      if (kind === "cond") {
        ions.forEach(([x, y]) => { ctx.fillStyle = C.pos; ctx.font = "700 11px system-ui"; ctx.fillText("+", bx + x * R, by + y * R); });
        const extra = bodyQ !== 0 ? 8 : 0;      /* érintés után: többlet- vagy hiányelektronok */
        const list = bodyQ < 0 ? els.concat(els.slice(0, extra).map(([u, v, p]) => [-v * 0.9, u * 0.9, p])) : bodyQ > 0 ? els.slice(extra) : els;
        list.forEach(([u, v, ph], i) => {
          const jig = 0.05 * Math.sin(now / 300 + ph);
          /* a megosztott elektronok a felület felé tolódnak */
          const share = s * (i % 3 === 0 || i % 3 === 1 ? 1 : 0.5);
          const tx = u + push * share * (0.95 - push * u) * 0.9;
          let x = tx + jig, y = v + 0.04 * Math.cos(now / 340 + ph);
          const rr = Math.hypot(x, y); if (rr > 0.92) { x *= 0.92 / rr; y *= 0.92 / rr; }
          chargeDot(ctx, bx + x * R, by + y * R, 4.2, -1, C, "");
        });
      } else {
        mols.forEach(([x, y, ph]) => {
          const ang = (1 - s) * (ph + now / 4000) + s * (push > 0 ? 0 : Math.PI);
          const ext = 6 + 7 * s, cx = bx + x * R, cy = by + y * R;
          const ox = Math.cos(ang) * ext / 2, oy = Math.sin(ang) * ext / 2;
          ctx.strokeStyle = C.border; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(cx, cy, ext / 2 + 4, 5, ang, 0, 2 * Math.PI); ctx.stroke();
          ctx.fillStyle = C.neg; ctx.beginPath(); ctx.arc(cx + ox, cy + oy, 2.6, 0, 2 * Math.PI); ctx.fill();
          ctx.fillStyle = C.pos; ctx.beginPath(); ctx.arc(cx - ox, cy - oy, 2.6, 0, 2 * Math.PI); ctx.fill();
        });
      }
      /* felületi töltések jelzése és eredő erő */
      let msg;
      if (bodyQ !== 0) {
        msg = `Érintéskor a rúd töltésének egy része átkerült a golyóra: most a golyó is <b>${bodyQ > 0 ? "pozitív" : "negatív"}</b>, ezért a rúd <b>taszítja</b>.`;
        arrow(ctx, bx + R + 6, by, bx + R + 6 + 40 * Math.max(0.3, s), by, C.accent, 3, 9);
      } else if (s > 0.02) {
        const nearSign = rodQ > 0 ? "−" : "+", farSign = rodQ > 0 ? "+" : "−";
        ctx.font = "700 16px system-ui"; ctx.globalAlpha = Math.min(1, 0.3 + s);
        ctx.fillStyle = nearSign === "+" ? C.pos : C.neg; ctx.fillText(nearSign + nearSign, bx - R - 14, by - 24);
        ctx.fillStyle = farSign === "+" ? C.pos : C.neg; ctx.fillText(farSign + farSign, bx + R + 14, by - 24);
        ctx.globalAlpha = 1;
        arrow(ctx, bx - R - 6, by + 14, bx - R - 6 - 50 * s - 6, by + 14, C.accent, 3, 9);
        msg = kind === "cond"
          ? `<b>Megosztás:</b> a ${rodQ < 0 ? "negatív rúd eltaszítja" : "pozitív rúd magához vonzza"} a szabad elektronokat, ezért a golyó rúd felőli oldala <b>${rodQ < 0 ? "pozitív" : "negatív"}</b>, a túlsó <b>${rodQ < 0 ? "negatív" : "pozitív"}</b> lesz. Az összes töltés továbbra is 0, mégis <b>vonzás</b> lép fel, mert a közeli oldal közelebb van.`
          : `<b>Polarizáció:</b> a papírban nincsenek szabad elektronok; a molekulák csak eltolódnak és befordulnak, a rúd felé a ${rodQ < 0 ? "pozitív" : "negatív"} végükkel. A felület két oldalán ugyanúgy megjelenik az ellentétes töltésréteg: <b>vonzás</b>.`;
      } else {
        msg = kind === "cond" ? "A rúd messze van: a szabad elektronok egyenletesen, rendezetlenül mozognak a fémben." : "A rúd messze van: a molekulák rendezetlenül állnak.";
      }
      if (kind === "ins" && bodyQ !== 0) msg = "Szigetelőnél az érintés alig visz át töltést – próbáld a fémgolyóval!";
      read.innerHTML = msg + (s > 0.02 && bodyQ === 0 ? `<br><span class="muted">A nyíl az eredő erő a testre (vonzás). Közelebb tolva a rudat erősebb lesz.</span>` : "");
      touch.disabled = kind !== "cond";
      if (visible) raf = requestAnimationFrame(draw);
    }
    let visible = true;
    if ("IntersectionObserver" in window) new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible) draw(); }).observe(root);
    draw();
    window.addEventListener("resize", () => { cv.refit(); draw(); });
  };
