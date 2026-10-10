
  /* ------------------------------------------------------------------
     9.7  digit-mlp – kézzel írt számjegy felismerése egy 64–16–10-es hálóval
     (a súlyok a digit-net.js-ben; tanítás: scikit-learn MLPClassifier, 8×8-as digits)
     ------------------------------------------------------------------ */
  W["digit-mlp"] = root => {
    const N = window.DIGIT_NET;
    header(root, "Számjegyfelismerő: 64 bemenet, 16 rejtett neuron, 10 kimenet",
      "Rajzolj egy számjegyet a bal oldali mezőbe (egérrel vagy ujjal), vagy tölts be egy mintát a teszt adatból. A rajzot a program középre igazítja és 8 × 8-as képpé kicsinyíti (minden mező 0–16) – " +
      "ezt kapja a háló (jobb felső sarok). <b>Középen</b> a 16 rejtett neuron: a kis kép a neuron 64 súlya (narancs = pozitív, kék = negatív), alatta a kimenete (ReLU). " +
      "<b>Lent</b> a softmax-kimenet: a tíz számjegy valószínűsége.");
    if (!N) { root.append(h("p", { class: "muted" }, "A háló súlyai nem töltődtek be (digit-net.js).")); return; }
    const fwd = v => {
      const x = v.map(t => t / 16), hh = N.W1.map((row, j) => Math.max(0, row.reduce((s, w, i) => s + w * x[i], N.b1[j])));
      const z = N.W2.map((row, k) => row.reduce((s, w, j) => s + w * hh[j], N.b2[k]));
      return { h: hh, z, p: ML.softmax(z) };
    };
    const S = N.test.X.map((v, i) => ({ v, y: N.test.y[i], pred: (() => { const p = fwd(v).p; return p.indexOf(Math.max(...p)); })() }));
    const wrong = S.map((s, i) => (s.pred !== s.y ? i : -1)).filter(i => i >= 0);
    let B = new Uint8Array(32 * 32), V = S[N.ex].v.slice(), mode = "sample", cur = N.ex, wi = -1, last = null, drawing = false;
    const info = h("span", { class: "muted", style: "font-size:.9rem" });
    root.append(h("div", { class: "controls" },
      btn("🧽 Törlés", () => { B.fill(0); V = new Array(64).fill(0); mode = "draw"; info.textContent = ""; sync(); }),
      btn("Következő minta", () => { cur = (cur + 1) % S.length; load(cur); }),
      btn("🎲 Véletlen minta", () => { cur = Math.floor(Math.random() * S.length); load(cur); }),
      btn("🔍 Egy tévesztés", () => { if (!wrong.length) return; wi = (wi + 1) % wrong.length; cur = wrong[wi]; load(cur); }), info));
    const [cvD, cvH] = twoCanvas(root, 1, 1);
    const cvO = Calc.canvas(root, flatAspect(root, 0.24, 0.42));
    cvO.c.style.marginTop = ".5rem";
    const out = h("div", { class: "readout" });
    root.append(out);
    function load(i) { V = S[i].v.slice(); mode = "sample"; B.fill(0); info.textContent = `teszt minta · valódi címke: ${S[i].y}`; sync(); }
    /* a rajz befoglaló téglalapját a 32 × 32-es mezőbe nagyítjuk (magasság ≈ 30), középre tesszük, majd 4 × 4-es blokkonként összeszámoljuk */
    function downsample() {
      let x0 = 32, x1 = -1, y0 = 32, y1 = -1;
      for (let r = 0; r < 32; r++) for (let c = 0; c < 32; c++) if (B[r * 32 + c]) { x0 = Math.min(x0, c); x1 = Math.max(x1, c); y0 = Math.min(y0, r); y1 = Math.max(y1, r); }
      const out = new Array(64).fill(0);
      if (x1 < 0) return out;
      const bw = x1 - x0 + 1, bh = y1 - y0 + 1, s = Math.min(30 / bh, 26 / bw, 4);
      const cx = (x0 + x1 + 1) / 2, cy = (y0 + y1 + 1) / 2;
      for (let r = 0; r < 32; r++) for (let c = 0; c < 32; c++) {
        const sx = Math.floor(cx + (c + 0.5 - 16) / s), sy = Math.floor(cy + (r + 0.5 - 16) / s);
        if (sx >= 0 && sx < 32 && sy >= 0 && sy < 32 && B[sy * 32 + sx]) out[(r >> 2) * 8 + (c >> 2)]++;
      }
      return out;
    }
    const cellD = () => cvD.w / 32;
    function paint(px, py) {
      const cx = px / cellD(), cy = py / cellD(), R = 1.55;
      for (let r = Math.floor(cy - R); r <= Math.ceil(cy + R); r++) for (let c = Math.floor(cx - R); c <= Math.ceil(cx + R); c++)
        if (r >= 0 && r < 32 && c >= 0 && c < 32 && Math.hypot(c + 0.5 - cx, r + 0.5 - cy) <= R) B[r * 32 + c] = 1;
    }
    cvD.c.addEventListener("pointerdown", e => {
      if (mode === "sample") { B.fill(0); mode = "draw"; info.textContent = ""; }
      drawing = true; cvD.c.setPointerCapture(e.pointerId); last = evXY(cvD, e); paint(...last); V = downsample(); sync();
    });
    cvD.c.addEventListener("pointermove", e => {
      if (!drawing) return;
      const p = evXY(cvD, e), d = Math.hypot(p[0] - last[0], p[1] - last[1]), k = Math.max(1, Math.ceil(d / (cellD() * 0.5)));
      for (let i = 1; i <= k; i++) paint(last[0] + (p[0] - last[0]) * i / k, last[1] + (p[1] - last[1]) * i / k);
      last = p; V = downsample(); sync();
    });
    const end = () => { drawing = false; };
    cvD.c.addEventListener("pointerup", end); cvD.c.addEventListener("pointercancel", end);
    const ink = () => hexRGB(css("--text")), bgc = () => hexRGB(css("--card"));
    const shade = t => { const a = ink(), b = bgc(); return `rgb(${b.map((v, i) => Math.round(v + (a[i] - v) * t)).join(",")})`; };
    function grid8(ctx, x0, y0, size, vals) {
      const c = size / 8;
      for (let k = 0; k < 64; k++) { ctx.fillStyle = shade(vals[k] / 16); ctx.fillRect(x0 + (k % 8) * c, y0 + Math.floor(k / 8) * c, c + 0.5, c + 0.5); }
      ctx.save(); ctx.strokeStyle = css("--border"); ctx.strokeRect(x0, y0, size, size); ctx.restore();
    }
    cvD.draw = () => {
      const { ctx, w } = cvD;
      ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, w);
      if (mode === "sample") grid8(ctx, 0, 0, w, V);
      else {
        const c = w / 32; ctx.fillStyle = shade(1);
        for (let k = 0; k < 1024; k++) if (B[k]) ctx.fillRect((k % 32) * c, Math.floor(k / 32) * c, c + 0.5, c + 0.5);
        ctx.save(); ctx.strokeStyle = rgba(css("--muted"), 0.25);
        for (let i = 1; i < 8; i++) { ctx.beginPath(); ctx.moveTo(i * w / 8, 0); ctx.lineTo(i * w / 8, w); ctx.moveTo(0, i * w / 8); ctx.lineTo(w, i * w / 8); ctx.stroke(); }
        ctx.restore();
        const s = Math.round(w * 0.27);
        ctx.fillStyle = css("--card"); ctx.fillRect(w - s - 10, 4, s + 6, s + 20);
        grid8(ctx, w - s - 7, 20, s, V);
        label(ctx, "a háló ezt látja", w - s / 2 - 7, 17, css("--muted"), "center", "600 10px system-ui, sans-serif");
        if (!B.some(Boolean)) label(ctx, "Rajzolj ide egy számjegyet!", w / 2, w / 2, css("--muted"), "center", "600 14px system-ui, sans-serif", "middle");
      }
      ctx.save(); ctx.strokeStyle = css("--border"); ctx.strokeRect(0.5, 0.5, w - 1, w - 1); ctx.restore();
    };
    let F = fwd(V);
    cvH.draw = () => {
      const { ctx, w } = cvH;
      ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, w);
      const gap = 8, cell = (w - 5 * gap) / 4, ts = cell - 14, c1 = hexRGB(C1()), c0 = hexRGB(C0()), bg = bgc();
      const mxh = Math.max(1e-9, ...F.h);
      N.W1.forEach((row, j) => {
        const gx = gap + (j % 4) * (cell + gap), gy = gap + Math.floor(j / 4) * (cell + gap), mx = Math.max(...row.map(Math.abs)), px = ts / 8;
        row.forEach((wv, k) => { const t = clamp(wv / mx, -1, 1), cc = t >= 0 ? c1 : c0, a = Math.abs(t); ctx.fillStyle = `rgb(${bg.map((v, i) => Math.round(v + (cc[i] - v) * a)).join(",")})`; ctx.fillRect(gx + (k % 8) * px, gy + Math.floor(k / 8) * px, px + 0.5, px + 0.5); });
        const act = F.h[j] / mxh;
        ctx.save(); ctx.lineWidth = 1 + 3 * act; ctx.strokeStyle = act > 0 ? rgba(css("--accent"), 0.25 + 0.75 * act) : css("--border"); ctx.strokeRect(gx - 1, gy - 1, ts + 2, ts + 2); ctx.restore();
        ctx.fillStyle = css("--bg-soft"); ctx.fillRect(gx, gy + ts + 4, ts, 7);
        ctx.fillStyle = css("--accent"); ctx.fillRect(gx, gy + ts + 4, ts * act, 7);
      });
    };
    cvO.draw = () => {
      const { ctx, w, h: hh } = cvO, bw = (w - 20) / 10, k0 = F.p.indexOf(Math.max(...F.p));
      ctx.fillStyle = css("--card"); ctx.fillRect(0, 0, w, hh);
      F.p.forEach((p, k) => {
        const x = 10 + k * bw, H = (hh - 36) * p;
        ctx.fillStyle = k === k0 ? css("--setB") : rgba(css("--accent"), 0.55); ctx.fillRect(x + 4, hh - 20 - H, bw - 8, H);
        label(ctx, String(k), x + bw / 2, hh - 4, css("--text"), "center", "700 13px system-ui, sans-serif");
        if (p >= 0.01) label(ctx, pct(p, 0), x + bw / 2, hh - 23 - H, css("--muted"), "center", "600 11px system-ui, sans-serif");
      });
    };
    function sync() {
      F = fwd(V);
      cvD.draw(); cvH.draw(); cvO.draw();
      const empty = V.every(v => v === 0), k0 = F.p.indexOf(Math.max(...F.p)), act = F.h.filter(v => v > 0).length;
      const top = F.p.map((p, k) => [p, k]).sort((a, b) => b[0] - a[0]).slice(0, 3);
      out.innerHTML = (empty ? `<span class="muted">Üres kép: a háló ilyenkor is mond valamit – a torzítások döntenek.</span><br>` : "") +
        `jóslat: <b>${k0}</b> (${pct(F.p[k0], 1)}) · a három legvalószínűbb: ${top.map(([p, k]) => `${k}: ${pct(p, 1)}`).join(" · ")} · aktív rejtett neuron: <b>${act}</b> / 16` +
        `<br>paraméterek: 64·16 + 16 + 16·10 + 10 = <b>1210</b> · pontosság a 450 teszt képen: <b>${pct(N.acc, 1)}</b> (rejtett réteg nélkül, softmax-regresszióval: ${pct(N.accLR, 1)})`;
    }
    sync();
  };

  /* ------------------------------------------------------------------
     Indítás (a calc.js-t és az ml.js-t is defer-rel töltjük, ezért DOMContentLoaded után)
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
