
  /* ==================================================================
     w2: pct-lab (4.1-c), weighted-ratio (4.2-c), real-wage (4.5-c), age-std (4.6-d)
     ================================================================== */

  /* --- w2 saját segédei --- */
  const w2Ctl = (...kids) => h("div", { class: "controls" }, ...kids);
  const w2Seg = (labels, onPick) => { // gombcsoport egy kiválasztottal (.btn.on)
    const bs = labels.map((l, i) => btn(l, () => pick(i)));
    function pick(i, silent) { bs.forEach((b, j) => b.classList.toggle("on", i === j)); if (!silent) onPick(i); }
    return { bs, pick };
  };
  const w2Minus = s => s.replace(/^-/, "−");
  const w2F = (x, d = 1) => w2Minus(fmt(x, d));
  /* legfeljebb maxd tizedes, a záró nullák nélkül: 120 → "120", 97,75 → "97,75" */
  const w2Num = (x, maxd = 2) => {
    if (!isFinite(x)) return "–";
    let s = fmt(x, maxd);
    if (s.includes(",")) s = s.replace(/0+$/, "").replace(/,$/, "");
    return w2Minus(s);
  };
  /* 1 tizedes, kivéve ha az érték pontosan 2 tizedesre kerek (15,35) */
  const w2Fx = x => {
    const r1 = Math.round(x * 10) / 10, r2 = Math.round(x * 100) / 100;
    return Math.abs(x - r1) < 1e-9 ? w2F(x, 1) : Math.abs(x - r2) < 1e-9 ? w2F(x, 2) : w2F(x, 1);
  };
  /* előjeles alak: +2,2 / −14,7 / 0,0 */
  const w2Sgn = (x, f = v => w2F(v, 1)) => {
    const s = f(Math.abs(x));
    return /^[0,]+$/.test(s) ? s : (x > 0 ? "+" : "−") + s;
  };
  const w2Ctx = document.createElement("canvas").getContext("2d");
  function w2Rgb(col) {
    w2Ctx.fillStyle = "#000"; w2Ctx.fillStyle = col;
    const s = w2Ctx.fillStyle;
    if (s[0] === "#") return [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16));
    const m = s.match(/[\d.]+/g);
    return m ? m.slice(0, 3).map(Number) : [128, 128, 128];
  }
  /* a szín és a kártya háttérszínének keveréke (t = 1: tiszta szín) */
  const w2Tint = (v, t) => { const A = w2Rgb(css("--card")), B = w2Rgb(css(v)); return `rgb(${A.map((a, i) => Math.round(a + (B[i] - a) * t)).join(",")})`; };
  /* a háttérhez jobban illő szövegszín: --text vagy --card */
  const w2Lum = c => { const [r, g, b] = w2Rgb(c).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const w2Ink = bg => { const L = w2Lum(bg), t = css("--text"), k = css("--card"), cr = c => { const l = w2Lum(c); return (Math.max(l, L) + 0.05) / (Math.min(l, L) + 0.05); }; return cr(t) >= cr(k) ? t : k; };
  /* vászon, amelynek magassága a szélesség függvénye: hFn(w) */
  function w2Canvas(parent, hFn, maxW = 760) {
    const cv = makeCanvas(parent, 0.4, maxW);
    cv.resize = () => {
      const w = Math.min(maxW, parent.clientWidth || maxW), hh = Math.round(hFn(w)), dpr = window.devicePixelRatio || 1;
      cv.c.width = Math.round(w * dpr); cv.c.height = Math.round(hh * dpr);
      cv.c.style.width = w + "px"; cv.c.style.height = hh + "px";
      cv.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cv.w = w; cv.h = hh;
    };
    cv.resize();
    return cv;
  }
  /* vízszintes nyíl (x0 → x1) */
  function w2Arrow(ctx, x0, x1, y, col) {
    const d = Math.sign(x1 - x0) || 1, hl = Math.min(8, Math.abs(x1 - x0));
    ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1 - d * hl * 0.6, y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x1 - d * hl, y - 5); ctx.lineTo(x1 - d * hl, y + 5); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  /* szöveg x köré középre, de a [lo, hi] sávon belül tartva */
  function w2TextIn(ctx, s, x, y, lo, hi) {
    const tw = ctx.measureText(s).width;
    ctx.textAlign = "left";
    ctx.fillText(s, Math.max(lo, Math.min(hi - tw, x - tw / 2)), y);
  }
  /* HTML jelmagyarázat: items = [[szöveg, színváltozó, vonal?]] */
  const w2Key = items => h("div", { style: "display:flex;flex-wrap:wrap;gap:.3rem 1rem;font-size:.85rem;margin:.3rem 0" },
    ...items.map(([t, c, line]) => h("span", { style: "display:inline-flex;align-items:center;gap:.35rem" },
      h("span", { style: `display:inline-block;width:${line ? 18 : 11}px;height:${line ? 3 : 11}px;background:var(${c});border-radius:2px` }), t)));
  const w2Note = txt => h("p", { class: "muted", style: "font-size:.8rem;margin:.45rem 0 0" }, txt);
  const w2Prose = "font-family:var(--font)";

  /* ------------------------------------------------------------------
     4.1-c  Százalék-labor: hányados, százalék, százalékpont
     ------------------------------------------------------------------ */
  W["pct-lab"] = root => {
    header(root, "Százalék-labor: hányados, százalék, százalékpont",
      "Két <b>mennyiség</b> viszonya hányados (százalékban mondva). Ha viszont két <b>arányt</b> hasonlítasz össze, a különbségük " +
      "százalék<b>pont</b>. Válts a két mód között, és húzd a csúszkákat.");
    const mode = w2Seg(["Két mennyiség", "Két arány"], i => setMode(i));
    root.append(w2Ctl(...mode.bs));
    const p1 = h("div"), p2 = h("div");
    root.append(p1, p2);

    /* --- 1. mód: két mennyiség --- */
    const sA = slider(1, 200, 1, 125), sB = slider(1, 200, 1, 100), oA = h("b"), oB = h("b");
    p1.append(w2Ctl(labelWrap("$A$ =", sA, oA), labelWrap("$B$ =", sB, oB)));
    const cv1 = w2Canvas(p1, () => 128);
    const st1 = h("div", { class: "stat-row" }), msg1 = h("div", { class: "readout", style: w2Prose });
    p1.append(st1, msg1);
    const demoBtn = btn("+x%, majd −x%", () => { demo.style.display = demo.style.display === "none" ? "" : "none"; demoBtn.classList.toggle("on"); updDemo(); });
    p1.append(w2Ctl(demoBtn, h("span", { class: "muted", style: "font-size:.88rem" }, "mini-demó: visszaér-e a kiindulóra?")));
    const sx = slider(0, 90, 1, 20), ox = h("b");
    const demo = h("div", { style: "display:none;border-top:1px dashed var(--border);margin-top:.3rem;padding-top:.2rem" });
    const stD = h("div", { class: "stat-row" }), msgD = h("div", { class: "readout", style: w2Prose });
    demo.append(w2Ctl(labelWrap("$x$ =", sx, ox)), stD, msgD);
    p1.append(demo);

    cv1.draw = () => {
      const { ctx, w, h: H } = cv1; ctx.clearRect(0, 0, w, H);
      const A = +sA.value, B = +sB.value, x0 = 58, x1 = w - 10, tx = v => x0 + v / 200 * (x1 - x0);
      ctx.font = "12px system-ui, sans-serif"; ctx.textBaseline = "middle";
      [[A, "A", "--setA", 14], [B, "B", "--setB", 40]].forEach(([v, n, c, y]) => {
        ctx.fillStyle = css(c); ctx.fillRect(x0, y - 9, tx(v) - x0, 18);
        ctx.fillStyle = css("--text"); ctx.textAlign = "left"; ctx.fillText(`${n} = ${v}`, 4, y);
      });
      ctx.strokeStyle = css("--muted"); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x0, 2); ctx.lineTo(x0, H - 4); ctx.stroke();
      ctx.save(); ctx.setLineDash([3, 4]);
      [A, B].forEach(v => { ctx.beginPath(); ctx.moveTo(tx(v), 50); ctx.lineTo(tx(v), H - 6); ctx.stroke(); });
      ctx.restore();
      ctx.font = "11px system-ui, sans-serif"; ctx.textBaseline = "middle";
      if (A === B) { ctx.fillStyle = css("--muted"); w2TextIn(ctx, "egyenlők: mindkét irányban 0%", tx(A), 80, 4, w); return; }
      const up = A / B - 1, dn = B / A - 1;
      ctx.fillStyle = css("--text");
      const lo = Math.min(tx(A), tx(B)), hi = Math.max(tx(A), tx(B));
      /* felirat a nyíl mellé (jobbra vagy balra), ha nincs hely, fölé */
      const side = (s, y) => {
        const tw = ctx.measureText(s).width;
        ctx.textAlign = "left";
        if (hi + 8 + tw <= w - 2) ctx.fillText(s, hi + 8, y);
        else if (lo - 8 - tw >= x0 + 4) ctx.fillText(s, lo - 8 - tw, y);
        else { ctx.fillStyle = css("--card"); ctx.fillRect(Math.max(4, Math.min(w - 2 - tw, (lo + hi - tw) / 2)) - 2, y - 21, tw + 4, 14);
          ctx.fillStyle = css("--text"); w2TextIn(ctx, s, (lo + hi) / 2, y - 14, 4, w - 2); }
      };
      w2Arrow(ctx, tx(B), tx(A), 80, css("--setA"));
      side(`B → A: ${w2Sgn(100 * up)}% (B-hez mérve)`, 80);
      w2Arrow(ctx, tx(A), tx(B), 112, css("--setB"));
      side(`A → B: ${w2Sgn(100 * dn)}% (A-hoz mérve)`, 112);
    };
    const moreLess = r => r > 1 ? `${w2F(100 * (r - 1))}%-kal több` : r < 1 ? `${w2F(100 * (1 - r))}%-kal kevesebb` : "ugyanannyi";
    function upd1() {
      const A = +sA.value, B = +sB.value, r = A / B;
      oA.textContent = A; oB.textContent = B;
      cv1.draw();
      statRow(st1, [["$A/B$", w2F(r, 3)], ["$A$ a $B$-nek", pct(r) + "-a"], ["$A$ a $B$-nél", moreLess(r)],
        ["$B$ az $A$-nál", moreLess(1 / r)], ["különbség $A - B$", w2F(A - B, 0)]]);
      msg1.innerHTML = A === B ? "A két mennyiség egyenlő: a hányados 1, a különbség 0."
        : `A ${moreLess(r)} B-nél, de B ${moreLess(1 / r)} A-nál. A különbség mindkét irányban ugyanaz (${Math.abs(A - B)}), ` +
          `csak más <b>alaphoz</b> (nevezőhöz) mérve.`;
    }
    function updDemo() {
      const x = +sx.value / 100, v1 = 100 * (1 + x), v2 = v1 * (1 - x);
      ox.textContent = sx.value + "%";
      statRow(stD, [["kezdet", "100"], [`+${sx.value}% után`, w2Num(v1)], [`majd −${sx.value}% után`, w2Num(v2)]]);
      msgD.innerHTML = x === 0 ? "x = 0-nál nincs változás." :
        `100 → ${w2Num(v1)} → ${w2Num(v2)}: a vége 100·(1 + x)(1 − x) = 100·(1 − x²) = <b>${w2Num(v2)}</b> &lt; 100. ` +
        `A csökkenés alapja már a megnövelt ${w2Num(v1)}, ezért többet von le, mint amennyit az emelés hozzáadott.`;
    }
    sA.addEventListener("input", upd1); sB.addEventListener("input", upd1); sx.addEventListener("input", updDemo);

    /* --- 2. mód: két arány --- */
    const sa = slider(0.1, 99, 0.1, 52.6), sb = slider(0.1, 99, 0.1, 78.9), oa = h("b"), ob = h("b");
    const PRE = [["Fagylaltgép 52,6% → 78,9%", 52.6, 78.9], ["Kamat 2% → 3%", 2, 3], ["Munkanélküliség 4% → 5%", 4, 5], ["Kockázat 0,4% → 0,3%", 0.4, 0.3]];
    const pre = w2Seg(PRE.map(p => p[0]), i => { sa.value = PRE[i][1]; sb.value = PRE[i][2]; upd2(true); });
    p2.append(w2Ctl(labelWrap("régi arány $a$ =", sa, oa), labelWrap("új arány $b$ =", sb, ob)), w2Ctl(...pre.bs));
    const cv2 = w2Canvas(p2, () => 150);
    const st2 = h("div", { class: "stat-row" }), msg2 = h("div", { class: "readout", style: w2Prose });
    p2.append(st2, msg2);
    cv2.draw = () => {
      const { ctx, w, h: H } = cv2; ctx.clearRect(0, 0, w, H);
      const a = +sa.value, b = +sb.value, x0 = 34, x1 = w - 14, tx = v => x0 + v / 100 * (x1 - x0);
      ctx.font = "11px system-ui, sans-serif"; ctx.textBaseline = "middle"; ctx.fillStyle = css("--muted"); ctx.textAlign = "left";
      ctx.fillText("0–100%-os skála: a különbség százalékpont", 4, 9);
      /* skála */
      ctx.strokeStyle = css("--muted"); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x0, 50); ctx.lineTo(x1, 50); ctx.stroke();
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      [0, 25, 50, 75, 100].forEach(v => { ctx.beginPath(); ctx.moveTo(tx(v), 46); ctx.lineTo(tx(v), 54); ctx.stroke(); ctx.fillText(v + "%", tx(v), 57); });
      /* különbség-zárójel */
      ctx.strokeStyle = css("--accent"); ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(tx(a), 40); ctx.lineTo(tx(a), 34); ctx.lineTo(tx(b), 34); ctx.lineTo(tx(b), 40); ctx.stroke();
      ctx.fillStyle = css("--accent"); ctx.font = "600 11px system-ui, sans-serif"; ctx.textBaseline = "middle";
      w2TextIn(ctx, `${w2Sgn(b - a)} százalékpont`, (tx(a) + tx(b)) / 2, 24, 4, w - 2);
      [[a, "--setA"], [b, "--setB"]].forEach(([v, c]) => { ctx.fillStyle = css(c); ctx.beginPath(); ctx.arc(tx(v), 50, 6, 0, 2 * Math.PI); ctx.fill(); });
      /* nagyított sávok: hányados */
      ctx.font = "11px system-ui, sans-serif"; ctx.fillStyle = css("--muted"); ctx.textAlign = "left";
      ctx.fillText("egymáshoz mérve (nagyítva): a hányados a relatív változás", 4, 86);
      const m = Math.max(a, b), sc = v => x0 + v / m * (x1 - x0) * 0.72;
      [[a, "régi", "--setA", 104, `${w2F(a)}%`], [b, "új", "--setB", 128, `${w2F(b)}% = ${w2F(b / a, 3)} × régi`]].forEach(([v, n, c, y, lab]) => {
        ctx.fillStyle = css(c); ctx.fillRect(x0, y - 8, sc(v) - x0, 16);
        ctx.fillStyle = css("--text"); ctx.textAlign = "left"; ctx.fillText(n, 4, y);
        ctx.fillText(lab, sc(v) + 5, y);
      });
      ctx.save(); ctx.setLineDash([3, 4]); ctx.strokeStyle = css("--muted");
      ctx.beginPath(); ctx.moveTo(sc(a), 94); ctx.lineTo(sc(a), 138); ctx.stroke(); ctx.restore();
    };
    function upd2(fromPreset) {
      const a = +sa.value, b = +sb.value, d = b - a, r = b / a;
      oa.textContent = w2F(a) + "%"; ob.textContent = w2F(b) + "%";
      if (fromPreset !== true) pre.bs.forEach(x => x.classList.remove("on"));
      cv2.draw();
      statRow(st2, [["régi → új", `${w2F(a)}% → ${w2F(b)}%`], ["változás", `${w2Sgn(d)} százalékpont`],
        ["relatív változás $b/a - 1$", `${w2Sgn(100 * (r - 1))}%`], ["hányados $b/a$", w2F(r, 3)]]);
      const ds = w2F(Math.abs(d)), rs = w2F(Math.abs(100 * (r - 1)));
      if (ds === "0,0") { msg2.innerHTML = "Az arány (egy tizedesre kerekítve) nem változott."; return; }
      const verb = d > 0 ? "nőtt" : "csökkent", wrong = a * (1 + d / 100), dd = a < 1 ? 4 : a < 10 ? 3 : 2;
      msg2.innerHTML = `Helyesen: »<b>${ds} százalékponttal ${verb}</b>«, relatíve »<b>${rs}%-kal</b>«. ` +
        `Hibás: »${ds}%-kal ${verb}« – ez ${w2Num(a, 1)}% helyett ${w2Num(wrong, dd)}%-ot jelentene.`;
    }
    sa.addEventListener("input", upd2); sb.addEventListener("input", upd2);

    function setMode(i) {
      p1.style.display = i ? "none" : ""; p2.style.display = i ? "" : "none";
      const c = i ? cv2 : cv1; c.resize(); c.draw();
    }
    mode.pick(0, true); pre.pick(0, true); setMode(0); upd1(); upd2(true); updDemo();
  };

  /* ------------------------------------------------------------------
     4.2-c  Összetett viszonyszám: a részek súlyozott átlaga
     ------------------------------------------------------------------ */
  W["weighted-ratio"] = root => {
    header(root, "Összetett viszonyszám: a részek súlyozott átlaga",
      "Boltonként a dolgozók számát ($B_i$) és az egy főre jutó forgalmat ($v_i$, millió Ft/fő) állítod. Az ábrán a kör <b>területe</b> " +
      "arányos a dolgozók számával; a folytonos függőleges vonal a cég összetett viszonyszáma ($V$), a szaggatott az egyszerű átlag.");
    const COL = ["--setA", "--setB", "--setC"], NAME = ["A", "B", "C"];
    const shops = [{ B: 4, v: 2.5 }, { B: 6, v: 1.5 }, { B: 5, v: 3.0 }];
    let nShop = 2;
    const rows = shops.map((s, i) => {
      const sB = slider(1, 20, 1, s.B), sv = slider(0.5, 5, 0.1, s.v), oB = h("b"), ov = h("b"), oA = h("span", { class: "muted", style: "font-size:.88rem" });
      const chip = h("span", { style: `display:inline-block;min-width:4.2rem;font-weight:700;color:var(${COL[i]})` }, `${NAME[i]} bolt`);
      const row = w2Ctl(chip, labelWrap("$B_i$:", sB, oB), labelWrap("$v_i$:", sv, ov), oA);
      row.style.margin = ".3rem 0";
      sB.addEventListener("input", () => { s.B = +sB.value; noPreset(); upd(); });
      sv.addEventListener("input", () => { s.v = +sv.value; noPreset(); upd(); });
      return { row, sB, sv, oB, ov, oA };
    });
    rows.forEach(r => root.append(r.row));
    const PRE = [["Idei év (4 + 6 fő; 2,5 és 1,5)", [[4, 2.5], [6, 1.5]]], ["Előző év (2 + 8 fő; 2,4 és 1,4)", [[2, 2.4], [8, 1.4]]]];
    const pre = w2Seg(PRE.map(p => p[0]), i => {
      PRE[i][1].forEach(([B, v], k) => { shops[k].B = B; shops[k].v = v; rows[k].sB.value = B; rows[k].sv.value = v; });
      setN(2);
    });
    const addBtn = btn("+ bolt", () => { noPreset(); setN(nShop === 2 ? 3 : 2); });
    root.append(w2Ctl(...pre.bs, addBtn),
      h("p", { class: "muted", style: "font-size:.88rem;margin:.1rem 0 .4rem" },
        "Mindkét bolt +0,1-et javult, a cég +0,3-at – a különbség az összetételből jön (lásd 4.6)."));
    const cv = w2Canvas(root, w => 2 * Math.min(38, (w - 32) / 12) + 128);
    const st = h("div", { class: "stat-row" }), msg = h("div", { class: "readout", style: w2Prose });
    root.append(st, msg);

    const noPreset = () => pre.bs.forEach(b => b.classList.remove("on"));
    function setN(n) {
      nShop = n; rows[2].row.style.display = n === 3 ? "" : "none";
      addBtn.textContent = n === 3 ? "− C bolt" : "+ bolt";
      upd();
    }
    const act = () => shops.slice(0, nShop);
    function calc() {
      const S = act(), A = S.map(s => s.B * s.v), Bs = S.map(s => s.B), v = S.map(s => s.v);
      const sA = sum(A), sB = sum(Bs);
      return { S, A, sA, sB, V: sA / sB, ar: sumProd(Bs, v) / sB, hr: sA / sum(A.map((a, i) => a / v[i])), mean: mean(v), min: Math.min(...v), max: Math.max(...v) };
    }
    cv.draw = () => {
      const { ctx, w, h: H } = cv; ctx.clearRect(0, 0, w, H);
      const c = calc(), x0 = 16, x1 = w - 16, tx = v => x0 + v / 5 * (x1 - x0);
      const rMax = Math.min(38, (x1 - x0) / 12), yc = 52 + rMax, yAx = yc + rMax + 30;
      /* tengely */
      ctx.strokeStyle = css("--muted"); ctx.lineWidth = 1; ctx.fillStyle = css("--muted");
      ctx.beginPath(); ctx.moveTo(x0, yAx); ctx.lineTo(x1, yAx); ctx.stroke();
      ctx.font = "11px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "top";
      for (let k = 0; k <= 10; k++) {
        const v = k / 2, big = k % 2 === 0;
        ctx.beginPath(); ctx.moveTo(tx(v), yAx - (big ? 5 : 3)); ctx.lineTo(tx(v), yAx + (big ? 5 : 3)); ctx.stroke();
        if (big) ctx.fillText(String(v), tx(v), yAx + 7);
      }
      /* egyszerű átlag és V */
      vline(ctx, tx(c.mean), 22, yAx + 26, css("--muted"), true);
      vline(ctx, tx(c.V), 16, yAx, css("--accent"), false);
      /* körök */
      const labs = [];
      c.S.forEach((s, i) => {
        const r = rMax * Math.sqrt(s.B / 20), x = tx(s.v);
        ctx.save(); ctx.globalAlpha = 0.3; ctx.fillStyle = css(COL[i]); ctx.beginPath(); ctx.arc(x, yc, r, 0, 2 * Math.PI); ctx.fill(); ctx.restore();
        ctx.strokeStyle = css(COL[i]); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, yc, r, 0, 2 * Math.PI); ctx.stroke();
        ctx.fillStyle = css(COL[i]); ctx.beginPath(); ctx.arc(x, yc, 2.5, 0, 2 * Math.PI); ctx.fill();
        labs.push([`${NAME[i]}: ${s.B} fő, ${w2F(s.v)}`, x, i === 1 ? yc + rMax + 12 : i === 0 ? yc - rMax - 6 : yc - rMax - 22, COL[i]]);
      });
      /* feliratok hátteres dobozban, hogy a vonalak ne takarják */
      const tag = (txt, x, y, col, font) => {
        ctx.font = font; ctx.textBaseline = "middle";
        const tw = ctx.measureText(txt).width, lx = Math.max(2, Math.min(w - 2 - tw, x - tw / 2));
        ctx.fillStyle = css("--card"); ctx.fillRect(lx - 3, y - 8, tw + 6, 16);
        ctx.fillStyle = css(col); ctx.textAlign = "left"; ctx.fillText(txt, lx, y);
      };
      labs.forEach(([t, x, y, col]) => tag(t, x, y, col, "600 11px system-ui, sans-serif"));
      tag(`V = ${w2F(c.V, 2)}`, tx(c.V), 8, "--accent", "700 12px system-ui, sans-serif");
      tag(`egyszerű átlag = ${w2F(c.mean, 2)}`, tx(c.mean), H - 9, "--muted", "11px system-ui, sans-serif");
    };
    function upd() {
      rows.forEach((r, i) => {
        const s = shops[i]; r.oB.textContent = s.B + " fő"; r.ov.textContent = w2F(s.v);
        r.oA.textContent = `→ $A_i$ = ${w2Num(s.B * s.v)} millió Ft`;
        window.Synopsis && Synopsis.renderMath(r.oA);
      });
      const c = calc(), same = Math.abs(c.ar - c.V) < 1e-9 && Math.abs(c.hr - c.V) < 1e-9, ok = same ? " ✔" : "";
      cv.draw();
      statRow(st, [["$V = \\sum A_i / \\sum B_i$ (millió Ft/fő)", w2F(c.V, 2)],
        ["számtani: $\\sum B_i v_i / \\sum B_i$", w2F(c.ar, 2) + ok], ["harmonikus: $\\sum A_i / \\sum (A_i / v_i)$", w2F(c.hr, 2) + ok],
        ["egyszerű átlag", w2F(c.mean, 2)], ["$\\sum A$ (millió Ft)", w2Num(c.sA)], ["$\\sum B$ (fő)", String(c.sB)],
        ["$\\min v_i \\le V \\le \\max v_i$", `${w2F(c.min)} ≤ ${w2F(c.V, 2)} ≤ ${w2F(c.max)}`]]);
      const Bs = c.S.map(s => s.B), bMax = Math.max(...Bs), heavy = Bs.filter(b => b === bMax).length === 1 ? Bs.indexOf(bMax) : -1;
      let t = same ? "<b>✔ ugyanaz</b> – mindhárom képlet ugyanazt a hányadost adja. " : "";
      const diff = c.V - c.mean;
      if (Math.abs(diff) < 0.005) t += "Most $V$ (kerekítve) egybeesik az egyszerű átlaggal – például mert a súlyok egyformák.";
      else if (heavy >= 0) t += `$V$ a legnagyobb súlyú (${bMax} fős) <b>${NAME[heavy]} bolt</b> felé húz: ${w2F(c.V, 2)} ${diff < 0 ? "&lt;" : "&gt;"} ${w2F(c.mean, 2)} (egyszerű átlag).`;
      else t += `$V$ a nagyobb súlyú boltok felé húz: ${w2F(c.V, 2)} ${diff < 0 ? "&lt;" : "&gt;"} ${w2F(c.mean, 2)} (egyszerű átlag).`;
      msg.innerHTML = t;
      window.Synopsis && Synopsis.renderMath(msg);
    }
    pre.pick(0, true); setN(2);
  };

  /* ------------------------------------------------------------------
     4.5-c  Nominális és reálbér
     ------------------------------------------------------------------ */
  W["real-wage"] = root => {
    header(root, "Nominális és reálbér",
      "Panni (kitalált) nettó bére és a valódi infláció. Válassz bázisévet, írd át a béreket, és nézd meg, mennyit ér a bér " +
      "a bázisév árain. Reálbérindex = nominális bérindex / árszínvonal.");
    const YRS = [2019, 2020, 2021, 2022, 2023, 2024];
    const CPI = [null, 103.3, 105.1, 114.5, 117.6, 103.7];          // előző év = 100
    const wage = [270, 285, 300, 330, 370, 400];
    const LVL = CPI.reduce((a, c, i) => (a.push(i ? a[i - 1] * c / 100 : 1), a), []); // 2019 = 1
    let base = 2;
    const seg = w2Seg(YRS.map(String), i => { base = i; upd(); });
    let need = false;
    const needBtn = btn("Mennyi bér kellett volna?", () => { need = !need; needBtn.classList.toggle("on", need); upd(); });
    root.append(w2Ctl(h("span", { class: "muted", style: "font-size:.92rem" }, "bázisév:"), ...seg.bs));
    const cv = w2Canvas(root, w => Math.max(220, Math.min(300, w * 0.42)));
    root.append(w2Key([["nominális bérindex", "--setA", 1], ["árszínvonal", "--setB", 1], ["reálbérindex", "--setC", 1]]));
    root.append(w2Ctl(needBtn));

    /* táblázat: soronként egy év */
    const TH = "padding:.3em .45em;font-size:.8rem;line-height:1.25";
    const TD = "padding:.25em .45em;font-family:var(--mono);font-size:.85rem;white-space:nowrap;text-align:right";
    const heads = ["év", "KSH árindex (előző év = 100)", "nettó bér (ezer Ft)", "nominális index", "árszínvonal", "reálbérindex",
      "reálbér a bázisév árain (ezer Ft)", "reálbér láncindexe (előző év = 100)", "ennyi kellett volna (ezer Ft)"];
    const tbl = h("table", { style: "width:auto;margin:.5rem 0" });
    const hr = h("tr", null, ...heads.map(t => h("th", { style: TH }, t)));
    tbl.append(hr);
    const cells = YRS.map((y, i) => {
      const inp = numBox(wage[i], { min: 100, max: 800, step: 1, width: "4.6rem" }, v => { wage[i] = v; upd(); });
      inp.setAttribute("aria-label", `${y}. évi bér`);
      const tds = heads.map((_, k) => h("td", { style: TD }));
      tds[0].textContent = y; tds[0].style.fontWeight = "700";
      tds[1].textContent = CPI[i] == null ? "–" : w2F(CPI[i]);
      tds[2].append(inp);
      const tr = h("tr", null, ...tds);
      tbl.append(tr);
      return { tr, tds };
    });
    root.append(h("div", { class: "tw", style: "overflow-x:auto" }, tbl));
    const msg = h("div", { class: "readout", style: w2Prose });
    root.append(msg, w2Note("Forrás: KSH, éves átlagos fogyasztóiár-index (előző év = 100%), 2020–2024. Panni bére kitalált adat."));

    const series = () => {
      const P = LVL.map(l => 100 * l / LVL[base]), N = wage.map(x => 100 * x / wage[base]);
      return { P, N, R: N.map((n, i) => 100 * n / P[i]) };
    };
    cv.draw = () => {
      const { ctx, w, h: H } = cv; ctx.clearRect(0, 0, w, H);
      const { P, N, R } = series(), all = [...P, ...N, ...R, 100];
      const lo = Math.floor((Math.min(...all) - 4) / 10) * 10, hi = Math.ceil((Math.max(...all) + 4) / 10) * 10;
      const bx = { x0: 38, y0: 14, x1: w - 12, y1: H - 26 };
      const { tx, ty } = axes(ctx, bx, { xmin: 2018.6, xmax: 2024.4, ymin: lo, ymax: hi, xticks: YRS, yticks: rangeTicks(lo, hi, 6) });
      ctx.save(); ctx.setLineDash([5, 4]); ctx.strokeStyle = css("--muted"); ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(bx.x0, ty(100)); ctx.lineTo(bx.x1, ty(100)); ctx.stroke(); ctx.restore();
      /* bázisév kiemelése */
      ctx.save(); ctx.globalAlpha = 0.5; ctx.fillStyle = css("--accent-soft");
      ctx.fillRect(tx(YRS[base]) - 14, bx.y0, 28, bx.y1 - bx.y0); ctx.restore();
      ctx.fillStyle = css("--accent"); ctx.font = "600 10px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.fillText("bázis", tx(YRS[base]), bx.y0 + 1);
      [[P, "--setB", 2], [N, "--setA", 2], [R, "--setC", 3.5]].forEach(([s, c, lw]) => {
        ctx.strokeStyle = css(c); ctx.lineWidth = lw; ctx.lineJoin = "round";
        ctx.beginPath(); s.forEach((v, i) => (i ? ctx.lineTo : ctx.moveTo).call(ctx, tx(YRS[i]), ty(v))); ctx.stroke();
        ctx.fillStyle = css(c); s.forEach((v, i) => { ctx.beginPath(); ctx.arc(tx(YRS[i]), ty(v), lw + 1, 0, 2 * Math.PI); ctx.fill(); });
      });
      /* a reálbérindex értékei a pontok alatt */
      ctx.font = "600 10px system-ui, sans-serif"; ctx.fillStyle = css("--text"); ctx.textBaseline = "top";
      R.forEach((v, i) => { if (i !== base) ctx.fillText(w2F(v), tx(YRS[i]), Math.min(ty(v) + 6, bx.y1 - 12)); });
    };
    function upd() {
      const { P, N, R } = series();
      cells.forEach(({ tr, tds }, i) => {
        tr.style.background = i === base ? "var(--accent-soft)" : "";
        tds[3].textContent = w2F(N[i]); tds[4].textContent = w2F(P[i]); tds[5].textContent = w2F(R[i]);
        tds[5].style.color = R[i] < 100 - 1e-9 ? "var(--bad)" : R[i] > 100 + 1e-9 ? "var(--ok)" : "";
        tds[6].textContent = w2F(wage[i] / (P[i] / 100));
        tds[7].textContent = i ? w2F(100 * (wage[i] / wage[i - 1]) / (CPI[i] / 100)) : "–";
        tds[8].textContent = w2F(wage[base] * P[i] / 100);
        tds[8].style.display = need ? "" : "none";
      });
      hr.lastChild.style.display = need ? "" : "none";
      cv.draw();
      const i0 = base < 5 ? base : 0, i1 = 5;
      const gN = wage[i1] / wage[i0], gP = LVL[i1] / LVL[i0], gR = gN / gP;
      const ch = (g, noun, pl) => `${noun} ${w2F(100 * Math.abs(g - 1))}%-kal ${g >= 1 ? "nőtt" : "csökkent"}${pl ? "ek" : ""}`;
      let t = `${YRS[i0]} → ${YRS[i1]}: ${ch(gN, "a bér")}, ${ch(gP, "az árak", 1)}, így ${ch(gR, "a reálbér")} ` +
        `(${w2F(gN, 3)} / ${w2F(gP, 3)} ≈ ${w2F(gR, 3)}).`;
      if (need) {
        const nd = wage[base] * P[5] / 100, gap = wage[5] - nd;
        t += `<br>A ${YRS[base]}-${[2020, 2023].includes(YRS[base]) ? "as" : "es"} reálbér megtartásához ${YRS[5]}-ben <b>${w2F(nd)} ezer Ft</b> kellett volna ` +
          `(bázisbér × árszínvonal); Panni ${w2Num(wage[5])} ezret kapott: ${gap >= 0 ? "+" : "−"}${w2F(Math.abs(gap))} ezer Ft.`;
      }
      msg.innerHTML = t;
    }
    seg.pick(base, true); upd();
  };

  /* ------------------------------------------------------------------
     4.6-d  Korstandardizálás: Öregfalu és Ifjúváros
     ------------------------------------------------------------------ */
  W["age-std"] = root => {
    header(root, "Korstandardizálás: Öregfalu és Ifjúváros",
      "Állítsd a két település korszerkezetét (a 65+ korcsoport a maradék) és a korcsoportonkénti halálozást (‰). " +
      "A standardizált arányszám mindkét település halálozási arányszámait <b>ugyanazzal</b> a standard korszerkezettel súlyozza.");
    const AGE = ["0–39", "40–64", "65+"], COL = ["--setA", "--setB"];
    const T = [{ name: "Öregfalu", s: [30, 30, 40], r: [1, 8, 50] }, { name: "Ifjúváros", s: [60, 30, 10], r: [2, 10, 60] }];
    const grid = h("div", { style: "display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:.2rem 1.2rem" });
    root.append(grid);
    const ui = T.map((t, ti) => {
      const box = h("div", { style: `border-left:4px solid var(${COL[ti]});padding-left:.6rem` });
      box.append(h("div", { style: `font-weight:700;color:var(${COL[ti]});margin:.2rem 0` }, t.name));
      const sS = [0, 1].map(k => slider(0, 100, 1, t.s[k])), oS = [0, 1, 2].map(() => h("b"));
      const sR = [0, 1, 2].map(k => slider(0, 100, 0.5, t.r[k])), oR = [0, 1, 2].map(() => h("b"));
      const cl = (...k) => { const c = w2Ctl(...k); c.style.margin = ".15rem 0"; return c; };
      const lw = (txt, el, out) => h("label", null, h("span", { style: "display:inline-block;min-width:3.1rem" }, txt), el, out);
      box.append(h("div", { class: "muted", style: "font-size:.82rem" }, "korszerkezet (a lakosság %-a)"),
        cl(lw(AGE[0] + ":", sS[0], oS[0])), cl(lw(AGE[1] + ":", sS[1], oS[1])),
        cl(h("label", null, AGE[2] + " (maradék):", oS[2])),
        h("div", { class: "muted", style: "font-size:.82rem;margin-top:.3rem" }, "halálozás (‰)"),
        ...[0, 1, 2].map(k => cl(lw(AGE[k] + ":", sR[k], oR[k]))));
      sS.forEach((sl, k) => sl.addEventListener("input", () => {
        const other = +sS[1 - k].value;
        if (+sl.value + other > 100) sl.value = 100 - other;
        t.s[k] = +sl.value; t.s[2] = 100 - t.s[0] - t.s[1]; upd();
      }));
      sR.forEach((sl, k) => sl.addEventListener("input", () => { t.r[k] = +sl.value; upd(); }));
      grid.append(box);
      return { oS, oR };
    });
    const STD = ["Öregfalu szerkezete", "Ifjúváros szerkezete", "egyenlő (⅓–⅓–⅓)", "a kettő átlaga"];
    let std = 0;
    const seg = w2Seg(STD, i => { std = i; upd(); });
    root.append(h("div", { class: "muted", style: "font-size:.88rem;margin-top:.6rem" }, "standard korszerkezet:"), w2Ctl(...seg.bs));
    const cv = w2Canvas(root, w => (w < 500 ? 330 : 320));
    root.append(w2Key([["Öregfalu", "--setA"], ["Ifjúváros", "--setB"], ["standard korszerkezet", "--accent"]]));
    const st = h("div", { class: "stat-row" }), msg = h("div", { class: "readout", style: w2Prose });
    root.append(st, msg);
    const ngaT = h("div", { style: "font-weight:600;margin-top:.9rem;font-size:.95rem" }, "NGA-felbontás (0 = Öregfalu, 1 = Ifjúváros)");
    const ngaS = h("p", { class: "muted", style: "font-size:.85rem;margin:.2rem 0" },
      "$V_S = \\sum B_1 v_0$: Ifjúváros korszerkezete Öregfalu arányszámaival. Ez nem függ a fenti standardválasztótól; $K_T = K_R + K_{\\text{Ö}}$.");
    const stN = h("div", { class: "stat-row" });
    root.append(ngaT, ngaS, stN, w2Note("Kitalált adatok (a tananyag példája)."));

    const stdShares = () => std === 0 ? T[0].s.map(x => x / 100) : std === 1 ? T[1].s.map(x => x / 100)
      : std === 2 ? [1 / 3, 1 / 3, 1 / 3] : T[0].s.map((x, k) => (x + T[1].s[k]) / 200);
    const crude = t => sumProd(t.s, t.r) / 100;
    cv.draw = () => {
      const { ctx, w, h: H } = cv; ctx.clearRect(0, 0, w, H);
      const mx = Math.max(10, ...T[0].r, ...T[1].r), ymax = Math.ceil(mx * 1.12 / 10) * 10;
      const bx = { x0: 34, y0: 18, x1: w - 8, y1: 168 };
      const { ty } = axes(ctx, bx, { xmin: 0, xmax: 1, ymin: 0, ymax, yticks: rangeTicks(0, ymax, 5), ylabel: "halálozás (‰) korcsoportonként" });
      const gw = (bx.x1 - bx.x0) / 3, gap = 4;
      AGE.forEach((a, g) => {
        const bw = Math.min(54, (gw * 0.8 - gap) / 2), cx = bx.x0 + gw * (g + 0.5), left = cx - bw - gap / 2;
        T.forEach((t, j) => {
          const x = left + j * (bw + gap), v = t.r[g];
          ctx.fillStyle = css(COL[j]); ctx.fillRect(x, ty(v), bw, ty(0) - ty(v));
          ctx.fillStyle = css("--text"); ctx.font = "11px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "bottom";
          ctx.fillText(w2Num(v, 1), x + bw / 2, ty(v) - 2);
        });
        ctx.font = "600 11px system-ui, sans-serif"; ctx.fillStyle = css("--text"); ctx.textBaseline = "top";
        ctx.fillText(a + " év", cx, bx.y1 + 5);
      });
      /* halmozott sávok: korszerkezet */
      const sx0 = 70, sx1 = w - 8, rowsS = [[T[0].s.map(x => x / 100), "Öregfalu", "--setA"], [T[1].s.map(x => x / 100), "Ifjúváros", "--setB"], [stdShares(), "standard", "--accent"]];
      ctx.font = "11px system-ui, sans-serif"; ctx.fillStyle = css("--muted"); ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.fillText("korszerkezet (balról jobbra: 0–39, 40–64, 65+ év)", 4, 206);
      rowsS.forEach(([sh, name, c], k) => {
        const y = 220 + k * 30;
        ctx.fillStyle = css("--text"); ctx.textAlign = "left"; ctx.font = (k === 2 ? "600 " : "") + "11px system-ui, sans-serif";
        ctx.fillText(name, 4, y + 11);
        let x = sx0;
        sh.forEach((p, g) => {
          const ww = p * (sx1 - sx0);
          const tint = w2Tint(c, [0.25, 0.5, 0.8][g]);
          ctx.fillStyle = tint; ctx.fillRect(x, y, ww, 22);
          ctx.strokeStyle = css("--card"); ctx.lineWidth = 1; ctx.strokeRect(x, y, ww, 22);
          const lab = w2Num(100 * p, 1) + "%";
          ctx.font = "11px system-ui, sans-serif"; ctx.textAlign = "center";
          if (ctx.measureText(lab).width + 4 < ww) { ctx.fillStyle = w2Ink(tint); ctx.fillText(lab, x + ww / 2, y + 11); }
          x += ww;
        });
      });
    };
    function upd() {
      T.forEach((t, ti) => {
        ui[ti].oS.forEach((o, k) => (o.textContent = t.s[k] + "%"));
        ui[ti].oR.forEach((o, k) => (o.textContent = w2Num(t.r[k], 1) + "‰"));
      });
      cv.draw();
      const sh = stdShares(), c0 = crude(T[0]), c1 = crude(T[1]), s0 = sumProd(sh, T[0].r), s1 = sumProd(sh, T[1].r);
      const pm = x => w2Fx(x) + "‰";
      statRow(st, [["nyers – Öregfalu", pm(c0)], ["nyers – Ifjúváros", pm(c1)], ["standardizált – Öregfalu", pm(s0)],
        ["standardizált – Ifjúváros", pm(s1)], ["standard korszerkezet", sh.map(p => w2Num(100 * p, 1)).join(" / ") + "%"]]);
      const worse = (a, b) => (Math.abs(a - b) < 1e-9 ? null : a > b ? "Öregfalu" : "Ifjúváros");
      const wc = worse(c0, c1), ws = worse(s0, s1);
      const txtC = wc ? `Nyersen <b>${wc}</b> a rosszabb (${pm(Math.max(c0, c1))} &gt; ${pm(Math.min(c0, c1))})` : `Nyersen egyformák (${pm(c0)})`;
      const txtS = ws ? `standardizálva <b>${ws}</b> (${pm(Math.max(s0, s1))} &gt; ${pm(Math.min(s0, s1))})` : `standardizálva egyformák (${pm(s0)})`;
      if (wc && ws && wc !== ws) {
        msg.style.cssText = w2Prose + ";background:var(--accent-soft);border-left:4px solid var(--accent)";
        msg.innerHTML = `${txtC}, ${txtS} – <b style="color:var(--accent)">megfordult a sorrend!</b> A nyers különbséget a korszerkezet okozza.`;
      } else {
        msg.style.cssText = w2Prose;
        msg.innerHTML = `${txtC}, ${txtS}${wc && wc === ws ? " is" : ""}.`;
      }
      const V0 = c0, V1 = c1, VS = sumProd(T[1].s, T[0].r) / 100;
      statRow(stN, [["$V_0$ (Öregfalu, nyers)", pm(V0)], ["$V_1$ (Ifjúváros, nyers)", pm(V1)], ["$V_S = \\sum B_1 v_0$", pm(VS)],
        ["$K_T = V_1 - V_0$", w2Sgn(V1 - V0, w2Fx) + "‰"], ["$K_R = V_1 - V_S$", w2Sgn(V1 - VS, w2Fx) + "‰"],
        ["$K_{\\text{Ö}} = V_S - V_0$", w2Sgn(VS - V0, w2Fx) + "‰"]]);
    }
    seg.pick(0, true); upd();
  };
