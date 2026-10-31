  /* ==================================================================
     w2: 0.3 és 0.4 widgetjei (multimeter-sim, color-code)
     A saját segédfüggvények blokkban, hogy ne ütközzenek a w1 neveivel.
     ================================================================== */
  {
    /* témaváltáskor és átméretezéskor újrarajzolás */
    const onTheme = fn => new MutationObserver(fn).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    function onResize(fn) {
      let t = null;
      addEventListener("resize", () => { clearTimeout(t); t = setTimeout(fn, 150); });
    }
    /* rögzített tizedesjegyű szám tizedesvesszővel (a fmt levágja a záró nullákat, ez nem) */
    const fx = (x, d) => (Math.abs(x) < 0.5 * Math.pow(10, -d) ? 0 : x).toFixed(d).replace(".", ",").replace("-", "−");
    /* egész szám ezres tagolással (5 jegytől, keskeny szóközzel) */
    function grp(s) {
      const neg = s.startsWith("−"), [i, d] = (neg ? s.slice(1) : s).split(",");
      return (neg ? "−" : "") + (i.length >= 5 ? i.replace(/\B(?=(\d{3})+$)/g, "\u202f") : i) + (d != null ? "," + d : "");
    }
    function rr(ctx, x, y, w, hh, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + hh - r); ctx.quadraticCurveTo(x + w, y + hh, x + w - r, y + hh);
      ctx.lineTo(x + r, y + hh); ctx.quadraticCurveTo(x, y + hh, x, y + hh - r);
      ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
    }
    const checkbox = (label, onchange, checked = false) => {
      const inp = h("input", { type: "checkbox" });
      inp.checked = checked;
      inp.addEventListener("change", () => onchange(inp.checked));
      return { lab: h("label", null, inp, label), inp };
    };
    /* rövid sípolás (csak ha a felhasználó bekapcsolta a hangot) */
    let actx = null;
    function beepSound(times = 1) {
      try {
        actx = actx || new (window.AudioContext || window.webkitAudioContext)();
        if (actx.state === "suspended") actx.resume();
        for (let i = 0; i < times; i++) {
          const o = actx.createOscillator(), g = actx.createGain(), t0 = actx.currentTime + 0.02 + i * 0.2;
          o.type = "square"; o.frequency.value = 2600;
          g.gain.setValueAtTime(0.0001, t0);
          g.gain.exponentialRampToValueAtTime(0.06, t0 + 0.01);
          g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.13);
          o.connect(g); g.connect(actx.destination); o.start(t0); o.stop(t0 + 0.14);
        }
      } catch (e) { /* nincs hang – nem baj */ }
    }

    /* ------------------------------------------------------------------
       0.3 a  multimeter-sim – virtuális okos multiméter
       ------------------------------------------------------------------ */
    /* 7 szegmenses kijelző */
    const SEG = { "0": "abcdef", "1": "bc", "2": "abged", "3": "abgcd", "4": "fgbc", "5": "afgcd", "6": "afgedc", "7": "abc", "8": "abcdefg",
      "9": "abcdfg", "-": "g", "O": "abcdef", "L": "fed", "E": "afged", "F": "afge", " ": "" };
    function digit7(ctx, x, y, w, hh, ch, on, ghost, dp) {
      const t = w * 0.17, hm = hh / 2;
      const S = {
        a: [x + t * 0.7, y, w - 1.4 * t, t], g: [x + t * 0.7, y + hm - t / 2, w - 1.4 * t, t], d: [x + t * 0.7, y + hh - t, w - 1.4 * t, t],
        f: [x, y + t * 0.7, t, hm - 1.0 * t], b: [x + w - t, y + t * 0.7, t, hm - 1.0 * t],
        e: [x, y + hm + 0.35 * t, t, hm - 1.05 * t], c: [x + w - t, y + hm + 0.35 * t, t, hm - 1.05 * t]
      };
      const lit = SEG[ch] || "";
      for (const k of "abcdefg") {
        ctx.fillStyle = lit.includes(k) ? on : ghost;
        const r = S[k]; ctx.fillRect(r[0], r[1], r[2], r[3]);
      }
      ctx.fillStyle = dp ? on : ghost;
      ctx.fillRect(x + w + t * 0.35, y + hh - t, t, t);
    }
    /* "9.43" → 4 cella, jobbra igazítva; a pont az előtte álló jegyhez tartozik */
    function cells(text) {
      const out = [];
      for (const c of text) {
        if (c === "." && out.length) out[out.length - 1].dp = true;
        else out.push({ ch: c, dp: false });
      }
      while (out.length < 4) out.unshift({ ch: " ", dp: false });
      return out.slice(-4);
    }
    /* méréshatárok: [tizedesjegy, mértékegység, szorzó]; 6000 digit: a kijelzett szám < 6000 */
    const RANGES = {
      V: [[3, "V", 1], [2, "V", 1], [1, "V", 1]],
      R: [[1, "Ω", 1], [3, "kΩ", 1e-3], [2, "kΩ", 1e-3], [1, "kΩ", 1e-3], [3, "MΩ", 1e-6], [2, "MΩ", 1e-6]],
      A: [[1, "mA", 1e3], [3, "A", 1], [2, "A", 1]]
    };
    function pickRange(kind, x) {
      if (!isFinite(x)) return null;
      for (const [dec, unit, f] of RANGES[kind]) {
        const v = Math.abs(x) * f;
        if (Math.round(v * Math.pow(10, dec)) < 6000) return { dec, unit, f, v, s: v.toFixed(dec), res: Math.pow(10, -dec) };
      }
      return null;   // OL
    }
    const ACC = { V: 0.8, R: 1.0, A: 2.0 };
    const ACCs = { V: "0,8", R: "1,0", A: "2,0" };
    /* ±(a% + 5 digit) – a Δ-t kb. 2–3 értékes jegyre kerekítjük (20 digit alatt tized digitre) */
    function unc(kind, x) {
      const r = pickRange(kind, x), rd = (x < 0 ? -1 : 1) * r.v, d = ACC[kind] / 100 * r.v + 5 * r.res;
      const q = d / r.res, fine = q < 20, dq = fine ? Math.round(q * 10) / 10 : Math.round(q);
      /* ellenállás és áram nem lehet negatív: az alsó határ legalább 0 */
      const lo = kind !== "V" && rd >= 0 ? Math.max(0, rd - d) : rd - d;
      return { r, rd, d, ds: fx(dq * r.res, r.dec + (fine ? 1 : 0)), lo: fx(lo, r.dec), hi: fx(rd + d, r.dec), read: fx(rd, r.dec), resS: fmt(r.res, 3) };
    }
    const uncLine = (title, kind, x) => {
      const u = unc(kind, x), U = u.r.unit;
      return `${title}: <b>${u.read} ${U}</b>, bizonytalanság <b>±${u.ds} ${U}</b> ⇒ a valódi érték ${u.lo} … ${u.hi} ${U} között van. ` +
        `<span style="color:var(--muted)"><span style="white-space:nowrap">(±(${ACCs[kind]}% + 5 digit),</span> felbontás ${u.resS} ${U})</span>`;
    };

    /* a mérendő tárgyak */
    const TG = [
      { id: "bat", lab: "9 V-os elem", V: 9.43, shortI: 4.87, who: "Az elem" },
      { id: "batR", lab: "ugyanez fordított zsinórokkal", V: -9.43, shortI: -4.87, who: "Az elem" },
      { id: "p5", lab: "Arduino 5V láb (és GND)", V: 4.962, shortI: 0.93, who: "Az USB-port (és az Arduino)" },
      { id: "p33", lab: "Arduino 3.3V láb (és GND)", V: 3.301, shortI: 0.35, who: "Az Arduino 3,3 V-os tápja (és az USB-port)" },
      { id: "r220", lab: "220 Ω-os ellenállás", R: 218.7 },
      { id: "r10k", lab: "10 kΩ-os ellenállás", R: 9870 },
      { id: "strip", lab: "breadboard: egy csík két lyuka", R: 0.3 },
      { id: "trench", lab: "breadboard: az árok két oldala", R: Infinity },
      { id: "air", lab: "semmi (a levegőben)", R: Infinity },
      { id: "led", lab: "LED + 220 Ω kör, megbontva (sorosan)", Vgap: 3.38, I: 0.0136 },
      { id: "live", lab: "bekapcsolt áramkörben lévő ellenállás", Vr: 0.451, I: 0.004962 },
      { id: "mains", lab: "hálózati konnektor közelében (érintés nélkül)", R: Infinity, mains: true }
    ];
    const SELN = ["automatikus", "dióda", "kapacitás", "hőmérséklet"];

    W["multimeter-sim"] = root => {
      header(root, "Virtuális okos multiméter",
        "Válaszd ki, mit mérsz, és hová dugod a <b>piros</b> zsinórt (a fekete mindig a COM-ban van). A műszer gombjaira és aljzataira is kattinthatsz; " +
        "a HOLD/NCV gombot <b>nyomva tartva</b> NCV módba vált. Próbáld ki a hibás beállításokat is – itt nem ég ki semmi.");
      const st = { tg: 0, jack: "V", on: true, hold: false, frozen: null, ncv: false, sel: 0, sound: false, blink: true, jit: 1234 };

      const ctr = h("div", { class: "controls" });
      const sel = h("select", { "aria-label": "Mit mérsz?", style: "max-width:100%;min-width:0" }, TG.map((t, i) => h("option", { value: i }, t.lab)));
      sel.addEventListener("change", () => { st.tg = +sel.value; update(true); });
      ctr.append(h("label", { style: "flex-wrap:wrap;max-width:100%" }, "Mit mérsz?", sel));
      root.append(ctr);
      const ctr2 = h("div", { class: "controls" });
      ctr2.append(h("label", null, "Piros zsinór:"));
      const paintJack = toggleGroup(ctr2, [["V", "V/Ω"], ["A", "10A"]], st.jack, v => { st.jack = v; update(true); });
      const bPow = btn("⏻ Be/Ki", () => press("pow")), bHold = btn("HOLD", () => press("hold")),
        bSel = btn("SEL", () => press("sel")), bNcv = btn("NCV", () => press("ncv"));
      const snd = checkbox("🔊 hang", v => { st.sound = v; if (v) beepSound(1); });
      ctr2.append(bPow, bHold, bSel, bNcv, snd.lab);
      root.append(ctr2);
      const stage = h("div");
      root.append(stage);
      const cv = makeCanvas(stage, 312);
      cv.style.touchAction = "manipulation";
      cv.setAttribute("role", "img");
      cv.setAttribute("aria-label", "A multiméter rajza: kijelző, gombok, aljzatok, mérőzsinórok");
      const out = h("div", { class: "readout", style: "font-family:inherit" });
      root.append(out);
      const warn = h("div", { class: "readout", style: "display:none;font-family:inherit;color:var(--bad);background:var(--bad-soft);border-left:4px solid var(--bad)" });
      root.append(warn);

      function press(what) {
        if (what === "pow") {
          st.on = !st.on;
          if (!st.on) { st.hold = false; st.frozen = null; st.ncv = false; st.sel = 0; }
        } else if (!st.on) {
          /* kikapcsolt műszeren a gombok nem csinálnak semmit */
        } else if (what === "hold") {
          st.hold = !st.hold;
          st.frozen = st.hold ? situation().disp : null;
        } else if (what === "ncv") {
          st.ncv = !st.ncv; st.hold = false; st.frozen = null;
        } else if (what === "sel") {
          st.sel = (st.sel + 1) % 4; st.hold = false; st.frozen = null;
        }
        update(true);
      }

      /* ---- a helyzet kiértékelése: mit mutat a kijelző, mit írunk ki ---- */
      function situation() {
        const t = TG[st.tg], inA = st.jack === "A";
        const S = { disp: null, lines: [], err: [], beep: 0, glow: false, waves: false, jitter: false };
        const D = (text, unit, ann = {}, sign = false) => ({ text, unit, sign, ann });
        const short = inA && t.V != null;
        /* fizikai következmények – a műszer állapotától függetlenül */
        if (short) S.err.push(`<b>RÖVIDZÁR a műszeren át!</b> ${t.who} túlterhelődik, a biztosíték kiolvadhat. ` +
          "Árammérő módban a műszer szinte egy darab vezeték. Vedd el a mérőhegyeket, és dugd a piros zsinórt a V/Ω aljzatba!");
        if (inA && t.id === "led") S.glow = true;
        if (!inA && t.id === "led" && !st.ncv) S.err.push("<b>Áramot csak a 10A aljzattal, sorosan mérj!</b> A V/Ω aljzaton át (feszültségmérő, nagy ellenállás) " +
          "szinte nem folyik áram: a kör szakadt marad, a LED nem világít.");
        if (t.id === "live" && !st.ncv) S.err.push("<b>Ellenállást csak áramtalanított körben mérj!</b> A műszer saját kis áramát a körben folyó áram meghamisítja – " +
          "az eredmény értelmetlen, és a műszer is károsodhat.");
        if (!st.on) {
          S.lines.push("A műszer ki van kapcsolva – kapcsold be (⏻).");
          if (short) S.lines.push("A rövidzár kikapcsolt műszeren át is létrejön: a 10A és a COM aljzat között csak egy biztosíték és egy nagyon kis ellenállás van.");
          if (S.glow) S.lines.push("A LED világít: az áram a 10A aljzaton át kikapcsolt műszer mellett is folyik (csak a kijelzés hiányzik).");
          return S;
        }
        if (st.ncv) {
          if (t.mains) {
            S.disp = D("----", "", { NCV: true, AC: true }); S.beep = 3; S.waves = true;
            S.lines.push("NCV: a műszer teteje érintés nélkül érzékeli a konnektor váltakozó elektromos terét (1.6) – sípol, és a vonalak a tér erősségét jelzik. " +
              "Ez csak jelzés, nem mérés: számot nem mutat. Mérni a hálózatot a kitben <b>nem</b> fogod.");
          } else {
            S.disp = D("EF", "", { NCV: true });
            S.lines.push("NCV mód: a közelben nincs váltakozó tér (EF). Az NCV a hálózat 50 Hz-es terét érzékeli; egy elem vagy az Arduino egyenfeszültségét nem. " +
              "Mérni NCV módban nem lehet – kapcsold ki az NCV-t.");
          }
          if (inA) S.lines.push("Figyelem: a piros zsinór a 10A aljzatban van.");
          return S;
        }
        if (inA) {
          /* árammérés: a piros zsinór a 10A aljzatban */
          let I = 0;
          if (short) I = t.shortI; else if (t.I != null) I = t.I;
          const r = pickRange("A", I);
          S.disp = D(r.s, r.unit, { AUTO: true, DC: true }, I < 0);
          if (short) S.lines.push(`A kijelzett ${fx(Math.abs(I), 2)} A nem mérési eredmény, hanem a rövidzár árama.`);
          else if (t.id === "led") {
            S.lines.push(uncLine("Árammérés sorosan (DC)", "A", I));
            S.lines.push("A műszer most a kör része: az áram rajta át folyik, és a LED világít. Mérés után dugd vissza a piros zsinórt a V/Ω aljzatba!");
          } else if (t.id === "live") {
            S.lines.push(`A műszer (árammérőként szinte egy vezeték) rövidre zárja a 100 Ω-ot: a kör áramát mutatja (${fx(I * 1e3, 1)} mA), nem az ellenállás értékét.`);
          } else {
            S.lines.push("Nem folyik áram a műszeren át: 0,0 mA. A piros zsinór a 10A-ben van – így csak áramot mérhetsz, sorosan bekötve. " +
              "Feszültséghez és ellenálláshoz dugd vissza a V/Ω aljzatba!");
          }
          if (st.sel) S.lines.push("(A SEL-választás árammérésnél nem számít.)");
          return S;
        }
        /* V/Ω aljzat */
        const V = t.V != null ? t.V : t.Vgap != null ? t.Vgap : 0;
        if (st.sel === 0) {
          if (Math.abs(V) > 0.8) {
            const r = pickRange("V", V);
            S.disp = D(r.s, r.unit, { AUTO: true, DC: true }, V < 0);
            if (t.id === "led") S.lines.push(`A kijelzett ${fx(V, 2)} V nem az áram: ez a szakadás két vége közti feszültség (kb. 5 V mínusz a LED feszültsége). Áram nem folyik.`);
            else {
              S.lines.push(uncLine("Feszültségmérés párhuzamosan (DC)", "V", V));
              if (V < 0) S.lines.push("A mínuszjel csak azt jelzi, hogy a piros zsinór a negatívabb ponton van – a zsinórok fordítva vannak.");
            }
          } else if (t.id === "live") {
            S.jitter = true;
            const r = pickRange("R", st.jit);
            S.disp = r ? D(r.s, r.unit, { AUTO: true }) : D("OL", "MΩ", { AUTO: true });
            S.lines.push("Az okos mód nem talált 0,8 V fölötti feszültséget (a 100 Ω-on most csak kb. 0,45 V esik), ezért ellenállást mér – de a körben folyó áram miatt a kijelzés ugrál, értelmetlen.");
          } else {
            const R = t.R, r = pickRange("R", R);
            if (!r) {
              S.disp = D("OL", "MΩ", { AUTO: true });
              S.lines.push(t.id === "trench" ? "OL – túlcsordulás: az árok két oldala <b>nincs</b> összekötve (0.2), szakadás. Nem csipog."
                : t.mains ? "A mérőhegyek nem érnek semmihez: OL. Érintés nélkül csak az <b>NCV</b> mód jelez – kapcsold be (NCV gomb, vagy tartsd nyomva a műszer HOLD/NCV gombját)."
                : "OL – túlcsordulás: a mért ellenállás nagyobb, mint amit a műszer mérni tud (60 MΩ), vagyis <b>szakadás</b>. Az OL nem nulla!");
            } else {
              S.disp = D(r.s, r.unit, { AUTO: true, BEEP: R < 1 });
              S.lines.push(uncLine("Ellenállásmérés", "R", R));
              if (R < 1) { S.beep = 1; S.lines.push("🔊 <b>csip!</b> 1 Ω alatt a műszer csipog (szakadásvizsgálat): a két lyuk össze van kötve."); }
            }
          }
          return S;
        }
        /* SEL-módok: ezeket a műszer nem ismeri fel magától */
        const live = t.V != null || t.id === "led" || t.id === "live";
        if (st.sel === 1) {
          const R = t.R;
          if (live || !(R * 1e-3 < 3)) S.disp = D("OL", "V", { DIODE: true });
          else {
            const vd = R * 1e-3;
            S.disp = D(vd.toFixed(3), "V", { DIODE: true, BEEP: vd < 0.05 });
            if (vd < 0.05) S.beep = 1;
          }
          S.lines.push("<b>Dióda mód</b> (SEL): a műszer kis áramot hajt át az alkatrészen, és a rajta eső feszültséget mutatja – diódákhoz, LED-ekhez való (12. fejezet). " +
            (live ? "Feszültség alatt álló pontokon értelmetlen. " : "") + "Nyomd a SEL-t, amíg vissza nem érsz az automatikus (AUTO) módhoz.");
        } else if (st.sel === 2) {
          S.disp = D(t.R === Infinity ? "0.000" : "OL", "nF", {});
          S.lines.push("<b>Kapacitás mód</b> (SEL): kondenzátorokhoz való – itt nincs mit mérnie. Nyomd a SEL-t, amíg vissza nem érsz az automatikus (AUTO) módhoz.");
        } else {
          S.disp = D("OL", "°C", {});
          S.lines.push("<b>Hőmérséklet mód</b> (SEL): hőelemes (K típusú) szondával mér, a sima mérőzsinórral nem. Nyomd a SEL-t, amíg vissza nem érsz az automatikus (AUTO) módhoz.");
        }
        return S;
      }

      /* ---- rajz ---- */
      const JACK = { A: [50, 266], COM: [110, 266], V: [170, 266] };
      const BTN = { pow: [22, 142, 56, 30], hold: [82, 142, 56, 30], sel: [142, 142, 56, 30] };
      function geom() {
        const Wc = cv.W, s = Math.max(0.6, Math.min(0.93, Wc * 0.5 / 220));
        const mx = 4, my = 4, ow = Wc - 220 * s - 18;
        const os = Math.max(0.55, Math.min(ow / 190, (cv.H - 20) / 230, 1.3));
        return { s, mx, my, os, ox: 220 * s + 14 + Math.max(0, (ow - 190 * os) / 2), oy: Math.max(4, (cv.H - 230 * os) / 2 - 8) };
      }
      function drawMeter(ctx, S, disp, G) {
        const C = colors();
        ctx.save(); ctx.translate(G.mx, G.my); ctx.scale(G.s, G.s);
        rr(ctx, 0, 0, 220, 320, 24); ctx.fillStyle = "#f59e0b"; ctx.fill();
        ctx.lineWidth = 2; ctx.strokeStyle = "#b45309"; ctx.stroke();
        rr(ctx, 10, 10, 200, 300, 16); ctx.fillStyle = "#2b3038"; ctx.fill();
        /* NCV-érzékelő LED a tetején */
        const ledOn = S.waves && st.blink;
        ctx.fillStyle = ledOn ? "#ef4444" : "#5b2525";
        ctx.beginPath(); ctx.arc(110, 19, 4, 0, 7); ctx.fill();
        if (ledOn) { ctx.fillStyle = "rgba(239,68,68,.35)"; ctx.beginPath(); ctx.arc(110, 19, 8, 0, 7); ctx.fill(); }
        /* LCD */
        rr(ctx, 22, 30, 176, 100, 6);
        ctx.fillStyle = st.on ? "#c5d4b0" : "#9aa58c"; ctx.fill();
        if (S.err.length && st.blink) { ctx.lineWidth = 5; ctx.strokeStyle = "#ef4444"; ctx.stroke(); }
        else { ctx.lineWidth = 1.5; ctx.strokeStyle = "#6b7a5a"; ctx.stroke(); }
        const on = "#1a1f15", ghost = st.on ? "rgba(26,31,21,.07)" : "rgba(26,31,21,.04)";
        const a = (disp && disp.ann) || {};
        const ann = (txt, x, y, lit) => { ctx.fillStyle = lit ? on : ghost; ctx.fillText(txt, x, y); };
        ctx.font = "700 9px system-ui"; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
        ann("AUTO", 30, 44, a.AUTO); ann("DC", 62, 44, a.DC); ann("AC", 80, 44, a.AC);
        ann("HOLD", 100, 44, st.on && st.hold); ann("NCV", 132, 44, a.NCV);
        ann("▶|", 30, 123, a.DIODE); ann("◀)))", 48, 123, a.BEEP && (!S.beep || st.blink || st.hold));
        /* előjel és 4 számjegy */
        ctx.fillStyle = disp && disp.sign ? on : ghost; ctx.fillRect(28, 75, 11, 4);
        const cs = cells(disp ? disp.text : "    ");
        cs.forEach((c, i) => digit7(ctx, 46 + i * 30, 54, 22, 46, disp ? c.ch : " ", on, ghost, disp && c.dp));
        if (disp && disp.unit) { ctx.fillStyle = on; ctx.font = "700 15px system-ui"; ctx.textAlign = "right"; ctx.fillText(disp.unit, 192, 100); }
        if (st.on && st.sel) { ctx.fillStyle = on; ctx.font = "700 9px system-ui"; ctx.textAlign = "right"; ctx.fillText(SELN[st.sel].toUpperCase(), 192, 123); }
        /* gombok */
        const lab = { pow: ["⏻"], hold: ["HOLD", "NCV"], sel: ["SEL"] };
        for (const k in BTN) {
          const [x, y, w, hh] = BTN[k];
          rr(ctx, x, y, w, hh, 8);
          const act = (k === "hold" && st.hold) || (k === "pow" && st.on);
          ctx.fillStyle = act ? "#5d6675" : "#454b56"; ctx.fill();
          ctx.lineWidth = 1.5; ctx.strokeStyle = k === "pow" ? (st.on ? "#22c55e" : "#888") : "#20242a"; ctx.stroke();
          ctx.fillStyle = "#f3f4f6"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
          const L = lab[k];
          if (L.length === 1) { ctx.font = (k === "pow" ? "700 15px" : "700 11px") + " system-ui"; ctx.fillText(L[0], x + w / 2, y + hh / 2 + 1); }
          else { ctx.font = "700 9px system-ui"; ctx.fillText(L[0], x + w / 2, y + 10); ctx.fillText(L[1], x + w / 2, y + 21); }
        }
        ctx.fillStyle = "#9ca3af"; ctx.font = "600 9px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
        ctx.fillText("SMART MULTIMETER · 6000 COUNTS", 110, 198);
        /* aljzatok */
        const jl = { A: ["10A", "FUSED"], COM: ["COM", ""], V: ["V/Ω", "600V MAX"] };
        for (const k in JACK) {
          const [x, y] = JACK[k];
          ctx.fillStyle = k === "COM" ? "#e5e7eb" : "#f87171"; ctx.font = "700 11px system-ui"; ctx.textAlign = "center";
          ctx.fillText(jl[k][0], x, y - 26);
          if (jl[k][1]) { ctx.font = "600 7px system-ui"; ctx.fillStyle = "#9ca3af"; ctx.fillText(jl[k][1], x, y + 30); }
          ctx.beginPath(); ctx.arc(x, y, 15, 0, 7); ctx.fillStyle = k === "COM" ? "#111" : "#b91c1c"; ctx.fill();
          ctx.beginPath(); ctx.arc(x, y, 7, 0, 7); ctx.fillStyle = "#050505"; ctx.fill();
        }
        if (S.err.length && st.blink && st.jack === "A" && TG[st.tg].V != null) {
          ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(JACK.A[0], JACK.A[1], 20, 0, 7); ctx.stroke();
        }
        ctx.restore();
        void C;
      }
      /* a mérendő tárgy rajza a saját (190×230-as) koordinátáiban; a két mérőhegy helyét adja vissza */
      function drawTarget(ctx, t, S, C) {
        const tipR = [], tipB = [];
        const txt = (s, x, y, size = 11, col = C.text, al = "center", w = 600) => {
          ctx.fillStyle = col; ctx.font = `${w} ${size}px system-ui`; ctx.textAlign = al; ctx.textBaseline = "middle"; ctx.fillText(s, x, y);
        };
        const wire = pts => { ctx.strokeStyle = C.muted; ctx.lineWidth = 2.2; ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); };
        const resBox = (x, y, w, lab, hi) => {
          ctx.fillStyle = hi ? "rgba(245,158,11,.25)" : C.card; ctx.strokeStyle = hi ? "#f59e0b" : C.text; ctx.lineWidth = 2;
          ctx.fillRect(x, y - 8, w, 16); ctx.strokeRect(x, y - 8, w, 16);
          txt(lab, x + w / 2, y - 17, 10, C.muted);
        };
        const id = t.id;
        if (id === "bat" || id === "batR") {
          rr(ctx, 46, 82, 130, 66, 6); ctx.fillStyle = "#1f2937"; ctx.fill();
          ctx.fillStyle = "#f59e0b"; ctx.fillRect(120, 82, 56, 66);
          txt("9V", 92, 115, 22, "#f9fafb", "center", 800);
          ctx.fillStyle = "#cbd5e1"; ctx.strokeStyle = "#64748b"; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(38, 100, 7, 0, 7); ctx.fill(); ctx.stroke();          // + (kerek)
          ctx.fillRect(31, 123, 14, 14); ctx.strokeRect(31, 123, 14, 14);                // − (hatszög helyett négyzet)
          txt("+", 22, 98, 14, C.pos, "center", 800); txt("−", 22, 130, 15, C.neg, "center", 800);
          const P = [38, 98], N = [38, 130];
          if (id === "bat") { tipR.push(...P); tipB.push(...N); } else { tipR.push(...N); tipB.push(...P); }
        } else if (id === "p5" || id === "p33") {
          rr(ctx, 8, 58, 178, 104, 6); ctx.fillStyle = "#0f766e"; ctx.fill();
          ctx.fillStyle = "#111"; ctx.fillRect(16, 78, 162, 22);
          const pins = ["RES", "3V3", "5V", "GND", "GND", "VIN"];
          pins.forEach((p, i) => {
            const x = 30 + i * 27;
            ctx.fillStyle = "#d1d5db"; ctx.fillRect(x - 3, 86, 6, 6);
            txt(p, x, 112, 9, "#ecfeff", "center", 700);
          });
          txt("POWER", 97, 68, 9, "#99f6e4", "center", 700);
          tipR.push(id === "p5" ? 84 : 57, 89); tipB.push(111, 89);
        } else if (id === "r220" || id === "r10k" || id === "live") {
          if (id === "live") {
            txt("⚡ bekapcsolva", 95, 30, 11, "#d97706", "center", 700);
            txt("5 V", 14, 66, 11, C.pos, "left", 700);
            wire([[14, 80], [40, 80]]); resBox(40, 80, 34, "1 kΩ", false);
            wire([[74, 80], [104, 80]]); resBox(104, 80, 40, "100 Ω", true);
            wire([[144, 80], [172, 80], [172, 150]]);
            ctx.strokeStyle = C.text; ctx.lineWidth = 2;
            [[160, 184], [164, 178], [168, 172]].forEach(([x1], i) => { ctx.beginPath(); ctx.moveTo(x1, 150 + i * 5); ctx.lineTo(344 - x1, 150 + i * 5); ctx.stroke(); });
            txt("GND", 172, 176, 10, C.muted);
            tipR.push(104, 86); tipB.push(144, 86);
          } else {
            wire([[16, 110], [176, 110]]);
            rr(ctx, 56, 94, 80, 32, 12); ctx.fillStyle = "#7fb2e5"; ctx.fill(); ctx.strokeStyle = "#3b6ea5"; ctx.lineWidth = 1.5; ctx.stroke();
            const bands = id === "r220" ? ["#d32222", "#d32222", "#141414", "#141414", "#7a4419"] : ["#7a4419", "#141414", "#141414", "#d32222", "#7a4419"];
            [68, 80, 92, 104, 122].forEach((x, i) => { ctx.fillStyle = bands[i]; ctx.fillRect(x - 3, 94, 6, 32); });
            txt(id === "r220" ? "220 Ω" : "10 kΩ", 96, 80, 11, C.muted);
            tipR.push(20, 110); tipB.push(172, 110);
          }
        } else if (id === "strip" || id === "trench") {
          rr(ctx, 14, 26, 166, 194, 6); ctx.fillStyle = "#f3f1ea"; ctx.fill(); ctx.strokeStyle = "#cfcabb"; ctx.lineWidth = 1; ctx.stroke();
          ctx.fillStyle = "#dedad0"; ctx.fillRect(14, 114, 166, 14);
          const col = i => 50 + i * 24, rowY = j => (j < 5 ? 42 + j * 16 : 140 + (j - 5) * 16);
          const hl = (i, top, c) => { ctx.fillStyle = c; rr(ctx, col(i) - 8, top ? 34 : 132, 16, 80, 5); ctx.fill(); };
          if (id === "strip") hl(1, true, "rgba(34,197,94,.35)");
          else { hl(2, true, "rgba(59,130,246,.3)"); hl(2, false, "rgba(234,88,12,.3)"); }
          ctx.fillStyle = "#57534e";
          for (let i = 0; i < 6; i++) for (let j = 0; j < 10; j++) ctx.fillRect(col(i) - 3.5, rowY(j) - 3.5, 7, 7);
          "abcdefghij".split("").forEach((l, j) => txt(l, 26, rowY(j), 9, "#78716c", "center", 600));
          if (id === "strip") { tipR.push(col(1), rowY(0)); tipB.push(col(1), rowY(3)); }
          else { tipR.push(col(2), rowY(4)); tipB.push(col(2), rowY(5)); }
        } else if (id === "led") {
          txt("5 V", 12, 36, 11, C.pos, "left", 700);
          wire([[12, 50], [62, 50]]);
          wire([[96, 50], [104, 50]]); resBox(104, 50, 40, "220 Ω", false);
          wire([[144, 50], [170, 50], [170, 104]]);
          /* LED (lefelé mutató dióda) */
          ctx.fillStyle = S.glow ? "#ef4444" : C.card; ctx.strokeStyle = C.text; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(158, 104); ctx.lineTo(182, 104); ctx.lineTo(170, 124); ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(158, 124); ctx.lineTo(182, 124); ctx.stroke();
          if (S.glow) {
            const g = ctx.createRadialGradient(170, 114, 2, 170, 114, 34);
            g.addColorStop(0, "rgba(239,68,68,.55)"); g.addColorStop(1, "rgba(239,68,68,0)");
            ctx.fillStyle = g; ctx.beginPath(); ctx.arc(170, 114, 34, 0, 7); ctx.fill();
          }
          txt("LED", 150, 114, 10, C.muted, "right");
          wire([[170, 124], [170, 190], [12, 190]]);
          txt("GND", 12, 204, 11, C.muted, "left", 700);
          ctx.fillStyle = C.text; [[62, 50], [96, 50]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 3, 0, 7); ctx.fill(); });
          txt("megbontva", 79, 36, 9, C.muted);
          tipR.push(62, 50); tipB.push(96, 50);
        } else if (id === "mains") {
          rr(ctx, 70, 30, 110, 110, 16); ctx.fillStyle = "#f8fafc"; ctx.fill(); ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 2; ctx.stroke();
          ctx.beginPath(); ctx.arc(125, 85, 40, 0, 7); ctx.fillStyle = "#e2e8f0"; ctx.fill(); ctx.stroke();
          ctx.fillStyle = "#334155"; [[109, 85], [141, 85]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 5, 0, 7); ctx.fill(); });
          ctx.fillStyle = "#94a3b8"; ctx.fillRect(120, 46, 10, 6); ctx.fillRect(120, 118, 10, 6);
          txt("230 V ~", 125, 154, 11, C.bad, "center", 700);
          if (S.waves) {
            ctx.strokeStyle = st.blink ? "#ef4444" : "rgba(239,68,68,.45)"; ctx.lineWidth = 2.5;
            [18, 30, 42].forEach(r => { ctx.beginPath(); ctx.arc(72, 85, r, Math.PI * 0.72, Math.PI * 1.28); ctx.stroke(); });
          }
          tipR.push(26, 196); tipB.push(58, 210);
        } else {
          ctx.setLineDash([4, 4]); ctx.strokeStyle = C.border; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(95, 115, 70, 0, 7); ctx.stroke(); ctx.setLineDash([]);
          txt("levegő", 95, 70, 12, C.muted, "center", 600);
          tipR.push(70, 120); tipB.push(118, 136);
        }
        return { R: tipR, B: tipB };
      }
      function drawProbe(ctx, tip, jack, col, G, C) {
        const k = Math.max(0.75, G.os), dx = -0.5, dy = 0.866;
        const m = [tip[0] + dx * 12 * k, tip[1] + dy * 12 * k], e = [tip[0] + dx * 44 * k, tip[1] + dy * 44 * k];
        /* zsinór: aljzattól a markolatig */
        ctx.lineCap = "round";
        const path = () => {
          ctx.beginPath(); ctx.moveTo(jack[0], jack[1]);
          ctx.bezierCurveTo(jack[0], cv.H + 30, e[0] + dx * 90, Math.min(cv.H + 10, e[1] + dy * 90), e[0], e[1]);
        };
        const halo = col === "#dc2626" ? C.card : C.muted;
        path(); ctx.strokeStyle = halo; ctx.lineWidth = 6.5; ctx.stroke();
        path(); ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.stroke();
        /* markolat és fémhegy */
        ctx.strokeStyle = halo; ctx.lineWidth = 8 * k + 2; ctx.beginPath(); ctx.moveTo(m[0], m[1]); ctx.lineTo(e[0], e[1]); ctx.stroke();
        ctx.strokeStyle = col; ctx.lineWidth = 8 * k; ctx.beginPath(); ctx.moveTo(m[0], m[1]); ctx.lineTo(e[0], e[1]); ctx.stroke();
        ctx.strokeStyle = "#cbd5e1"; ctx.lineWidth = 2.6 * k; ctx.beginPath(); ctx.moveTo(tip[0], tip[1]); ctx.lineTo(m[0], m[1]); ctx.stroke();
        ctx.lineCap = "butt";
        /* dugó az aljzatban */
        ctx.beginPath(); ctx.arc(jack[0], jack[1], 11 * G.s, 0, 7); ctx.fillStyle = col; ctx.fill();
        ctx.lineWidth = 1.5; ctx.strokeStyle = "rgba(255,255,255,.5)"; ctx.stroke();
      }
      function draw(S) {
        const C = colors(), ctx = cv.ctx, G = geom();
        ctx.clearRect(0, 0, cv.W, cv.H);
        const disp = !st.on ? null : st.hold ? st.frozen : S.disp;
        drawMeter(ctx, S, disp, G);
        const t = TG[st.tg];
        ctx.save(); ctx.translate(G.ox, G.oy); ctx.scale(G.os, G.os);
        const tips = drawTarget(ctx, t, S, C);
        ctx.restore();
        const toC = p => [G.ox + p[0] * G.os, G.oy + p[1] * G.os];
        const jc = k => [G.mx + JACK[k][0] * G.s, G.my + JACK[k][1] * G.s];
        drawProbe(ctx, toC(tips.B), jc("COM"), "#1f2937", G, C);
        drawProbe(ctx, toC(tips.R), jc(st.jack === "A" ? "A" : "V"), "#dc2626", G, C);
        /* csipogás jelzése */
        if (st.on && !st.hold && S.beep && (S.beep === 1 || st.blink)) {
          ctx.fillStyle = C.accent; ctx.font = "700 13px system-ui"; ctx.textAlign = "left"; ctx.textBaseline = "top";
          ctx.fillText(S.beep === 3 ? "🔊 csip-csip-csip!" : "🔊 csip!", G.mx + 220 * G.s + 10, 6);
        }
      }

      let timer = null, lastBeepKey = "";
      function update(user) {
        const S = situation();
        draw(S);
        if (!user) return;
        const lines = [];
        if (st.on && st.hold) lines.push(`<b>HOLD</b>: a kijelző be van fagyasztva – az utolsó érték marad rajta, bármit mérsz. ` +
          "Nyomd meg újra a HOLD-ot, hogy élőben mérjen." + (S.disp ? " A mérőhegyek alatt most:" : ""));
        lines.push(...S.lines);
        out.innerHTML = lines.map(l => `<div style="margin:.15rem 0">${l}</div>`).join("");
        warn.style.display = S.err.length ? "" : "none";
        warn.innerHTML = S.err.map(l => `<div style="margin:.15rem 0">⚠️ ${l.replace(/<b>/g, '<b style="color:var(--bad)">')}</div>`).join("");
        paintJack(st.jack);
        bPow.classList.toggle("on", st.on); bHold.classList.toggle("on", st.on && st.hold);
        bNcv.classList.toggle("on", st.on && st.ncv); bSel.textContent = "SEL: " + SELN[st.sel];
        const key = st.tg + st.jack + st.ncv + st.sel + st.on;
        if (st.sound && st.on && !st.hold && S.beep && key !== lastBeepKey) beepSound(S.beep);
        lastBeepKey = S.beep ? key : "";
        const need = S.err.length || S.jitter || S.waves || S.beep;
        if (need && !timer) {
          let n = 0;
          timer = setInterval(() => {
            st.blink = !st.blink; n++;
            if (n % 2 === 0) st.jit = Math.pow(10, 1.2 + 2.8 * Math.random()) * (Math.random() < 0.15 ? 1e5 : 1);
            update(false);
          }, 320);
        } else if (!need && timer) { clearInterval(timer); timer = null; st.blink = true; }
      }

      /* kattintás a műszer rajzán: gombok, aljzatok; a HOLD/NCV nyomva tartva NCV */
      let downAt = null, longT = null, longDone = false;
      const hit = ev => {
        const G = geom(), [px, py] = pointer(cv, ev), x = (px - G.mx) / G.s, y = (py - G.my) / G.s;
        for (const k in BTN) { const [bx, by, w, hh] = BTN[k]; if (x >= bx && x <= bx + w && y >= by && y <= by + hh) return k; }
        for (const k in JACK) if (Math.hypot(x - JACK[k][0], y - JACK[k][1]) < 21) return "jack" + k;
        return null;
      };
      cv.addEventListener("pointerdown", ev => {
        downAt = hit(ev); longDone = false;
        if (downAt === "hold") longT = setTimeout(() => { longDone = true; press("ncv"); }, 700);
      });
      cv.addEventListener("pointerup", ev => {
        clearTimeout(longT);
        const k = hit(ev);
        if (k && k === downAt && !longDone) {
          if (k === "pow" || k === "hold" || k === "sel") press(k);
          else if (k === "jackA" || k === "jackV") { st.jack = k.slice(4); update(true); }
          else if (k === "jackCOM") {
            out.insertAdjacentHTML("afterbegin", '<div style="margin:.15rem 0"><b>A fekete zsinór mindig a COM-ban marad.</b></div>');
          }
        }
        downAt = null;
      });
      cv.addEventListener("pointerleave", () => clearTimeout(longT));
      cv.addEventListener("pointermove", ev => { cv.style.cursor = hit(ev) ? "pointer" : "default"; });

      onTheme(() => update(false));
      onResize(() => { cv.refit(); update(false); });
      update(true);
      root.__mm = { st, TG, situation, press, set: o => { Object.assign(st, o); sel.value = st.tg; update(true); }, unc };
    };

    /* ------------------------------------------------------------------
       0.4 a  color-code – színkód-dekóder, -kódoló és gyakorlás
       ------------------------------------------------------------------ */
    /* [név, rajzszín, számjegy, szorzó kitevője, tűrés %] */
    const CC = [
      ["fekete", "#151515", 0, 0, null], ["barna", "#7b4a1e", 1, 1, 1], ["piros", "#d42a2a", 2, 2, 2], ["narancs", "#f27c13", 3, 3, null],
      ["sárga", "#f5d10f", 4, 4, null], ["zöld", "#22a046", 5, 5, 0.5], ["kék", "#1e56d6", 6, 6, 0.25], ["lila", "#8c3fd0", 7, 7, 0.1],
      ["szürke", "#8d8d8d", 8, null, null], ["fehér", "#f7f7f5", 9, null, null], ["arany", "#c9a227", null, -1, 5], ["ezüst", "#b9bdc3", null, -2, 10]
    ];
    const IX = Object.fromEntries(CC.map((c, i) => [c[0], i]));
    const E12 = [10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82];
    const E24x = [11, 13, 16, 20, 24, 30, 36, 43, 51, 62, 75, 91];
    const VALID = {
      digit: CC.map((c, i) => i).filter(i => CC[i][2] != null),
      mult: CC.map((c, i) => i).filter(i => CC[i][3] != null),
      tol: CC.map((c, i) => i).filter(i => CC[i][4] != null)
    };
    const roleOf = (n, k) => (k < n - 2 ? "digit" : k === n - 2 ? "mult" : "tol");
    const ROLE_N = { digit: "számjegy", mult: "szorzó", tol: "tűrés" };
    const pct = t => fmt(t, 2) + "%";
    /* érték: D · 10^m pontosan (karakterlánc-kitevővel, lebegőpontos zaj nélkül) */
    const val = (D, m) => Number(D + "e" + m);
    /* ellenállás kiírása prefixummal, legfeljebb 4 értékes jeggyel */
    function ohm(x) {
      if (!isFinite(x)) return "–";
      if (x < 1) return fmt(+x.toPrecision(4), 4) + " Ω";
      const P = [[1e9, "G"], [1e6, "M"], [1e3, "k"], [1, ""]];
      for (const [f, p] of P) if (x >= f) return fmt(+(x / f).toPrecision(4), 3) + " " + p + "Ω";
      return fmt(x, 3) + " Ω";
    }
    /* egyszerű Ω-kiírás tagolással (tűrési sávhoz 10 kΩ alatt) */
    const ohmPlain = x => grp(fmt(+x.toPrecision(6), 3)) + " Ω";
    const multS = m => (m >= 0 ? grp(String(Math.pow(10, m))) : fmt(Math.pow(10, m), -m));
    /* dekódolás bal→jobb olvasási sorrendben */
    function decode(seq) {
      const n = seq.length, nd = n - 2, errs = [];
      for (let k = 0; k < n; k++) {
        const r = roleOf(n, k), c = CC[seq[k]];
        if (!VALID[r].includes(seq[k])) {
          if (k === 0 && (c[0] === "arany" || c[0] === "ezüst"))
            errs.push(`Az ${c[0]} nem állhat az első helyen – valószínűleg <b>fordítva</b> olvasod. Nyomd meg a „Fordítsd meg” gombot!`);
          else errs.push(`A(z) ${k + 1}. sáv (${ROLE_N[r]}) nem lehet ${c[0]}.`);
        }
      }
      if (errs.length) return { ok: false, errs };
      const ds = seq.slice(0, nd).map(i => CC[i][2]), D = +ds.join(""), m = CC[seq[nd]][3], t = CC[seq[n - 1]][4];
      return { ok: true, ds, D, m, t, R: val(D, m), first0: ds[0] === 0 };
    }
    /* E-sor: a két értékes jegyű mantissza */
    function eSeries(D) {
      if (!D) return null;
      let d = D;
      while (d >= 100 && d % 10 === 0) d /= 10;
      while (d < 10) d *= 10;
      if (d >= 100) return { e12: false, e24: false, mant: null };
      return { e12: E12.includes(d), e24: E12.includes(d) || E24x.includes(d), mant: fx(d / 10, 1) };
    }
    /* kódolás: érték → sávok (n = 4 vagy 5), tűrés színe */
    function encode(R, n, tolIx) {
      const nd = n - 2, lo = Math.pow(10, nd - 1), hi = Math.pow(10, nd);
      for (let m = -2; m <= 7; m++) {
        const D = R / Math.pow(10, m), Dr = Math.round(D);
        if (Math.abs(D - Dr) < 1e-6 * Math.max(1, D) && Dr >= lo && Dr < hi) {
          const ds = String(Dr).split("").map(Number);
          return [...ds, m >= 0 ? m : m === -1 ? IX["arany"] : IX["ezüst"], tolIx];
        }
      }
      /* első jegy 0 is megengedett (pl. 0,5 Ω), ha máshogy nem megy */
      for (let m = -2; m <= 7; m++) {
        const D = R / Math.pow(10, m), Dr = Math.round(D);
        if (Math.abs(D - Dr) < 1e-6 * Math.max(1, D) && Dr >= 1 && Dr < lo) {
          const ds = String(Dr).padStart(nd, "0").split("").map(Number);
          return [...ds, m >= 0 ? m : m === -1 ? IX["arany"] : IX["ezüst"], tolIx];
        }
      }
      return null;
    }
    /* "4k7", "4,7k", "220", "1M", "2R2", "10 kΩ" → Ω */
    function parseR(str) {
      let s = String(str).trim().replace(/\s+/g, "").replace(/(Ω|ohm|ohms)$/i, "").replace(",", ".");
      if (!s) return null;
      const mm = s.match(/^(\d*)(?:\.(\d*))?([rRkKmMgG]?)(\d*)$/);
      if (!mm) return null;
      const [, a, b, L, c] = mm;
      if (b != null && c) return null;          // "4.7k7" értelmetlen
      if (!a && !b && !c) return null;
      const f = { "": 1, r: 1, k: 1e3, m: 1e6, g: 1e9 }[L.toLowerCase()];
      const num = parseFloat((a || "0") + "." + (b != null ? b : c || "0"));
      if (!L && c) return null;
      return isFinite(num) && num > 0 ? +(num * f).toPrecision(10) : null;
    }
    const swatch = i => h("span", { style: `display:inline-block;width:.95em;height:.95em;border-radius:3px;vertical-align:-.12em;margin-right:.2em;` +
      `border:1px solid var(--border);background:${CC[i][1]}` });
    const az = w => (/^[aáeéiíoóöőuúüű]/i.test(w) ? "az " : "a ") + w;
    const seqText = seq => seq.map(i => CC[i][0]).join(" – ");

    /* ellenállás rajza; seq bal→jobb, gapLeft: a tűréssáv (és a nagyobb köz) bal oldalt van */
    function drawResistor(cv, seq, gapLeft) {
      const C = colors(), ctx = cv.ctx, n = seq.length, Wc = cv.W, Hc = cv.H, cy = Hc / 2;
      ctx.clearRect(0, 0, Wc, Hc);
      const bw = Math.min(Wc - 70, 320), bx = (Wc - bw) / 2, bh = 44;
      ctx.strokeStyle = "#9ca3af"; ctx.lineWidth = 4; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(10, cy); ctx.lineTo(Wc - 10, cy); ctx.stroke(); ctx.lineCap = "butt";
      const body = n === 4 ? ["#e7cf9f", "#b8955c"] : ["#86b6e6", "#3f73ab"];
      /* „kutyacsont” test: két kiszélesedő vég + középrész */
      ctx.fillStyle = body[0]; ctx.strokeStyle = body[1]; ctx.lineWidth = 1.5;
      const path = () => {
        const e = bw * 0.16;
        ctx.beginPath();
        ctx.moveTo(bx + e, cy - bh / 2 + 4);
        ctx.lineTo(bx + bw - e, cy - bh / 2 + 4);
        ctx.bezierCurveTo(bx + bw - e * 0.6, cy - bh / 2 - 3, bx + bw, cy - bh / 2 - 3, bx + bw, cy);
        ctx.bezierCurveTo(bx + bw, cy + bh / 2 + 3, bx + bw - e * 0.6, cy + bh / 2 + 3, bx + bw - e, cy + bh / 2 - 4);
        ctx.lineTo(bx + e, cy + bh / 2 - 4);
        ctx.bezierCurveTo(bx + e * 0.6, cy + bh / 2 + 3, bx, cy + bh / 2 + 3, bx, cy);
        ctx.bezierCurveTo(bx, cy - bh / 2 - 3, bx + e * 0.6, cy - bh / 2 - 3, bx + e, cy - bh / 2 + 4);
        ctx.closePath();
      };
      path(); ctx.fill(); ctx.stroke();
      /* sávok helye: a számjegyek és a szorzó egyenletesen, a tűrés külön */
      const P = n === 4 ? [0.22, 0.35, 0.48, 0.80] : [0.2, 0.31, 0.42, 0.53, 0.82];
      const pos = k => (gapLeft ? 1 - P[n - 1 - k] : P[k]);
      const w = Math.max(9, bw * 0.052);
      ctx.save(); path(); ctx.clip();
      seq.forEach((ci, k) => {
        const x = bx + bw * pos(k) - w / 2, c = CC[ci];
        if (c[0] === "arany" || c[0] === "ezüst") {
          const g = ctx.createLinearGradient(x, 0, x + w, 0);
          const [l, d] = c[0] === "arany" ? ["#f3dc7a", "#9c7a12"] : ["#eef0f3", "#7d828a"];
          g.addColorStop(0, d); g.addColorStop(0.45, l); g.addColorStop(1, d); ctx.fillStyle = g;
        } else ctx.fillStyle = c[1];
        ctx.fillRect(x, cy - bh, w, 2 * bh);
        ctx.strokeStyle = "rgba(0,0,0,.25)"; ctx.lineWidth = 1; ctx.strokeRect(x, cy - bh, w, 2 * bh);
      });
      ctx.restore();
      /* fény a testen */
      const g = ctx.createLinearGradient(0, cy - bh / 2, 0, cy + bh / 2);
      g.addColorStop(0, "rgba(255,255,255,.28)"); g.addColorStop(0.5, "rgba(255,255,255,0)"); g.addColorStop(1, "rgba(0,0,0,.12)");
      ctx.fillStyle = g; path(); ctx.fill();
      /* színnevek: felváltva fölötte és alatta */
      ctx.font = "600 11px system-ui"; ctx.textAlign = "center";
      seq.forEach((ci, k) => {
        const x = bx + bw * pos(k), up = k % 2 === 0, y0 = up ? cy - bh / 2 - 4 : cy + bh / 2 + 4, y1 = up ? cy - bh / 2 - 14 : cy + bh / 2 + 14;
        ctx.strokeStyle = C.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke();
        ctx.fillStyle = C.text; ctx.textBaseline = up ? "bottom" : "top";
        ctx.fillText(CC[ci][0], x, up ? y1 - 2 : y1 + 2);
      });
    }

    W["color-code"] = root => {
      header(root, "Színkód-dekóder és -kódoló",
        "Kattints a színekre: minden sávhoz csak az ott érvényes színek jönnek fel. Lent egy értéket be is írhatsz (pl. <b>4k7</b>), " +
        "a legalján pedig gyakorolhatsz.");
      const st = { n: 4, seq: [IX["piros"], IX["piros"], IX["barna"], IX["arany"]], gapLeft: false };

      const ctr = h("div", { class: "controls" });
      ctr.append(h("label", null, "Sávok száma:"));
      const paintN = toggleGroup(ctr, [[4, "4 sáv"], [5, "5 sáv"]], st.n, v => setN(v));
      ctr.append(btn("↔ Fordítsd meg", () => { st.seq.reverse(); st.gapLeft = !st.gapLeft; refresh(); }));
      root.append(ctr);
      const stage = h("div");
      root.append(stage);
      const cv = makeCanvas(stage, 150, 560);
      cv.style.touchAction = "manipulation";
      cv.style.margin = "0 auto";
      cv.setAttribute("role", "img");
      const pick = h("div", { style: "display:grid;gap:.35rem;margin:.6rem 0" });
      root.append(pick);
      const out = h("div", { class: "readout", style: "font-family:inherit" });
      root.append(out);

      function setN(v) {
        if (v === st.n) return;
        const d = decode(st.seq), tolIx = IX[v === 4 ? "arany" : "barna"];
        let s2 = d.ok ? encode(d.R, v, tolIx) : null;
        if (!s2) {
          /* nem írható le pontosan: az első két / három jegyből építünk */
          const base = d.ok ? d.ds : [1, 0, 0];
          s2 = v === 4 ? [base[0], base[1], 2, tolIx] : [base[0], base[1], 0, 1, tolIx];
          if (!VALID.digit.includes(s2[0])) s2[0] = 1;
        }
        st.n = v; st.seq = s2; st.gapLeft = false; paintN(v); refresh();
      }
      function buildPick() {
        pick.innerHTML = "";
        st.seq.forEach((cur, k) => {
          const r = roleOf(st.n, k);
          const lab = r === "digit" ? `${k + 1}. számjegy` : ROLE_N[r];
          const sw = h("div", { style: "display:flex;flex-wrap:wrap;gap:.2rem" });
          const row = h("div", { style: "display:flex;flex-wrap:wrap;align-items:center;gap:.15rem .3rem" },
            h("span", { style: "min-width:6.3em;font-size:.88rem;color:var(--muted)" }, lab + ":"), sw);
          VALID[r].forEach(ci => {
            const c = CC[ci], on = ci === cur;
            const b = h("button", { type: "button", title: c[0], "aria-label": `${lab}: ${c[0]}`, "aria-pressed": on ? "true" : "false",
              style: `width:1.6rem;height:1.6rem;border-radius:6px;cursor:pointer;padding:0;background:${c[1]};` +
                (c[0] === "arany" ? "background:linear-gradient(90deg,#9c7a12,#f3dc7a,#9c7a12);" : c[0] === "ezüst" ? "background:linear-gradient(90deg,#7d828a,#eef0f3,#7d828a);" : "") +
                (on ? "border:2px solid var(--text);outline:2px solid var(--accent);outline-offset:1px;" : "border:1px solid var(--border);") });
            b.addEventListener("click", () => { st.seq[k] = ci; refresh(); });
            sw.append(b);
          });
          if (!VALID[r].includes(cur)) row.append(h("span", { style: "font-size:.85rem;color:var(--bad)" }, `(most: ${CC[cur][0]} – itt érvénytelen)`));
          pick.append(row);
        });
      }
      function decodeHTML(seq) {
        const d = decode(seq), n = seq.length;
        if (!d.ok) return `<div style="color:var(--bad)">⚠️ ${d.errs.join("<br>⚠️ ")}</div>`;
        const parts = seq.map((ci, k) => {
          const r = roleOf(n, k), c = CC[ci];
          return `${c[0]} (${r === "digit" ? c[2] : r === "mult" ? "×" + multS(c[3]) : "±" + pct(c[4])})`;
        }).join(" · ");
        const lines = [`<div><b style="font-size:1.12rem">${ohm(d.R)} ±${pct(d.t)}</b> &nbsp; <span style="color:var(--muted)">${parts}</span></div>`];
        lines.push(`<div>${d.ds.join("")} · ${multS(d.m)} = ${ohmPlain(d.R)}</div>`);
        const lo = d.R * (1 - d.t / 100), hi = d.R * (1 + d.t / 100), F = x => (d.R < 1e4 ? ohmPlain(x) : ohm(x));
        lines.push(`<div>Tűrési sáv: <b>${F(lo)} – ${F(hi)}</b></div>`);
        const e = eSeries(d.D);
        let es;
        if (!e || e.mant == null || !e.e24) es = `<span style="color:var(--bad)">nem szabványos érték (se E12, se E24)</span> – gyanús: rossz irányból olvasod, vagy elnézted egy sáv színét? Mérd meg!`;
        else if (e.e12) es = `<span style="color:var(--ok)">E12-érték ✔</span> (a sor tagja: ${e.mant})`;
        else es = `<span style="color:var(--ok)">nem E12, de E24-érték</span> (${e.mant})` + (d.t <= 5 ? " – ±5%-os vagy pontosabb ellenállásnál ez is szabványos." : " – ±10%-hoz az E12 sor a szokásos, gyanús.");
        lines.push(`<div>${es}</div>`);
        if (d.first0) lines.push(`<div style="color:var(--muted)">Az első sáv fekete (0) – ez szokatlan; ellenőrizd az irányt.</div>`);
        return lines.join("");
      }
      function refresh() {
        drawResistor(cv, st.seq, st.gapLeft);
        cv.setAttribute("aria-label", "Ellenállás sávjai balról jobbra: " + seqText(st.seq));
        buildPick();
        out.innerHTML = (st.gapLeft ? `<div style="color:var(--muted)">Megfordítva: most a nagyobb köz (a tűréssáv) a <b>bal</b> oldalon van – balról olvasva ezt kapod:</div>` : "") +
          decodeHTML(st.seq);
      }

      /* ---- kódoló ---- */
      root.append(h("div", { class: "w-title", style: "margin-top:1.1rem;font-size:.98rem" }, "Kódoló: értékből színek"));
      const ctrE = h("div", { class: "controls" });
      const inp = h("input", { type: "text", value: "4k7", placeholder: "pl. 4k7", "aria-label": "Ellenállás értéke", style: "width:7.5em" });
      ctrE.append(h("label", null, "Érték:", inp), btn("Kódold", () => enc(), "btn primary"));
      root.append(ctrE);
      const outE = h("div", { class: "readout", style: "font-family:inherit" });
      root.append(outE);
      inp.addEventListener("keydown", ev => { if (ev.key === "Enter") enc(); });
      inp.addEventListener("input", () => enc());
      function enc() {
        const R = parseR(inp.value);
        outE.innerHTML = "";
        if (R == null) { outE.append(h("div", null, "Nem értem. Írj ilyet: 220, 4k7, 4,7k, 10k, 1M, 2R2.")); return; }
        outE.append(h("div", null, "Érték: ", h("b", null, ohm(R))));
        for (const [n, tolName] of [[4, "arany"], [5, "barna"]]) {
          const s = encode(R, n, IX[tolName]);
          const row = h("div", { style: "margin-top:.3rem" }, h("b", null, `${n} sáv (±${pct(CC[IX[tolName]][4])}): `));
          if (!s) row.append(n === 4 ? "két számjeggyel nem írható le pontosan (3 értékes jegy kell) – 5 sávval igen." : "nem írható le ezzel a kóddal.");
          else {
            s.forEach((ci, k) => row.append(swatch(ci), CC[ci][0], k < s.length - 1 ? " – " : " "));
            row.append(btn("mutasd a rajzon", () => { st.n = n; paintN(n); st.seq = s.slice(); st.gapLeft = false; refresh(); cv.scrollIntoView({ block: "nearest", behavior: "smooth" }); }));
          }
          outE.append(row);
        }
        const e = eSeries(+String(Math.round(R * 1e6)).replace(/0+$/, "") || 0);
        if (e && e.mant != null) outE.append(h("div", { style: "margin-top:.3rem;color:var(--muted)" }, e.e12 ? "E12-érték." : e.e24 ? "Nem E12, de E24-érték." : "Nem E12/E24-érték."));
        else outE.append(h("div", { style: "margin-top:.3rem;color:var(--muted)" }, "Nem E12/E24-érték."));
      }

      /* ---- gyakorlás ---- */
      root.append(h("div", { class: "w-title", style: "margin-top:1.1rem;font-size:.98rem" }, "Gyakorlás: mennyi az ellenállás?"));
      const ctrP = h("div", { class: "controls" });
      const score = h("b", { style: "font-family:var(--mono)" }, "0 / 0");
      ctrP.append(btn("Új feladat", () => newTask(), "btn primary"), h("label", null, "Pontszám:", score));
      root.append(ctrP);
      const stageP = h("div");
      root.append(stageP);
      const cvP = makeCanvas(stageP, 150, 560);
      cvP.style.touchAction = "manipulation";
      cvP.style.margin = "0 auto";
      cvP.setAttribute("role", "img");
      const opts = h("div", { class: "controls" });
      root.append(opts);
      const fb = h("div", { class: "readout", style: "font-family:inherit" });
      root.append(fb);
      const P = { task: null, good: 0, all: 0 };

      function distractors(seq, R) {
        const n = seq.length, nd = n - 2, d = decode(seq), C = [], F = [];
        const add = (v, why) => { if (v > 0 && isFinite(v)) C.push({ v: +v.toPrecision(9), why }); };
        if (d.m >= 0) add(+(d.ds.join("") + d.m), `a szorzó sávot (${CC[seq[nd]][0]}) harmadik számjegynek olvastad – pedig csak a nullák számát adja meg: ${d.ds.join("")} · ${multS(d.m)}.`);
        const sh = Math.random() < 0.5 ? 1 : -1;
        add(val(d.D, d.m + sh), `eggyel elcsúszott a szorzó: ${az(CC[seq[nd]][0])} ×${multS(d.m)}, nem ×${multS(d.m + sh)}.`);
        const rv = decode(seq.slice().reverse());
        if (rv.ok) add(rv.R, "fordított irányból olvastad: a tűréssáv (a nagyobb köz után) van jobb oldalt.");
        if (n === 5) {
          const d4 = decode([seq[0], seq[1], seq[2], seq[4]]);
          if (d4.ok) add(d4.R, "az 5 sávos kódot 4 sávosként olvastad: itt három számjegy van, a szorzó a 4. sáv.");
        } else add(val(+(d.ds.join("") + "0"), d.m), "a szorzóhoz még egy nullát tettél: a szorzó színe pontosan a nullák számát adja.");
        /* tartalék, ha a tipikus hibák egybeesnek */
        const addF = (v, why) => { if (v > 0 && isFinite(v)) F.push({ v: +v.toPrecision(9), why }); };
        addF(val(d.D, d.m - sh), `eggyel elcsúszott a szorzó: ${az(CC[seq[nd]][0])} ×${multS(d.m)}, nem ×${multS(d.m - sh)}.`);
        addF(val(d.D, d.m + 2 * sh), "két nagyságrenddel elcsúszott a szorzó.");
        addF(val(d.D, d.m - 2 * sh), "két nagyságrenddel elcsúszott a szorzó.");
        const seen = new Set([+R.toPrecision(9)]), uniq = [];
        for (const c of C) if (!seen.has(c.v)) { seen.add(c.v); uniq.push(c); }
        for (let i = uniq.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [uniq[i], uniq[j]] = [uniq[j], uniq[i]]; }
        const res = uniq.slice(0, 3);
        for (const c of F) if (res.length < 3 && !seen.has(c.v)) { seen.add(c.v); res.push(c); }
        return res;
      }
      function newTask(fixed) {
        let seq;
        if (fixed) seq = fixed.slice();
        else {
          const n = Math.random() < 0.5 ? 4 : 5;
          const pool = Math.random() < 0.7 ? E12 : E24x;
          const M = pool[Math.floor(Math.random() * pool.length)];
          const k = Math.random() < 0.08 ? -1 : Math.floor(Math.random() * 5);   // 1 Ω … 820 kΩ
          const tol = n === 4 ? (Math.random() < 0.8 ? "arany" : "ezüst") : (Math.random() < 0.8 ? "barna" : "piros");
          seq = encode(val(M, k), n, IX[tol]);
        }
        const d = decode(seq);
        const ds = distractors(seq, d.R);
        const all = [{ v: d.R, ok: true }, ...ds];
        for (let i = all.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [all[i], all[j]] = [all[j], all[i]]; }
        P.task = { seq, d, all, done: false };
        drawResistor(cvP, seq, false);
        cvP.setAttribute("aria-label", "Feladat – sávok balról jobbra: " + seqText(seq));
        opts.innerHTML = "";
        all.forEach((o, i) => opts.append(btn(ohm(o.v), () => answer(i))));
        fb.innerHTML = `${seq.length} sávos ellenállás (${seq.length === 4 ? "bézs" : "kék"} test), balról jobbra olvasd. Melyik az értéke?`;
      }
      function answer(i) {
        const T = P.task;
        if (!T || T.done) return;
        T.done = true; P.all++;
        const o = T.all[i], d = T.d, n = T.seq.length;
        if (o.ok) P.good++;
        score.textContent = `${P.good} / ${P.all}`;
        [...opts.children].forEach((b, j) => {
          b.disabled = true;
          if (T.all[j].ok) { b.style.borderColor = "var(--ok)"; b.style.background = "var(--ok-soft)"; }
          else if (j === i) { b.style.borderColor = "var(--bad)"; b.style.background = "var(--bad-soft)"; }
        });
        const how = T.seq.map((ci, k) => {
          const r = roleOf(n, k), c = CC[ci];
          return `${c[0]} (${r === "digit" ? c[2] : r === "mult" ? "×" + multS(c[3]) : "±" + pct(c[4])})`;
        }).join(" – ");
        const sol = `${how} ⇒ ${d.ds.join("")} · ${multS(d.m)} = <b>${ohm(d.R)}</b>, ±${pct(d.t)}.`;
        fb.innerHTML = o.ok ? `<span style="color:var(--ok)">✔ Helyes!</span> ${sol}`
          : `<span style="color:var(--bad)">✘ Nem ${ohm(o.v)}:</span> ${o.why}<br>Helyesen: ${sol}`;
      }

      onTheme(() => { refresh(); if (P.task) drawResistor(cvP, P.task.seq, false); });
      onResize(() => { cv.refit(); cvP.refit(); refresh(); if (P.task) drawResistor(cvP, P.task.seq, false); });
      refresh(); enc(); newTask();
      root.__cc = { st, decode, encode, parseR, eSeries, distractors, newTask, answer, P, ohm,
        set: (names, gapLeft = false) => { st.n = names.length; paintN(st.n); st.seq = names.map(x => IX[x]); st.gapLeft = gapLeft; refresh(); },
        flip: () => { st.seq.reverse(); st.gapLeft = !st.gapLeft; refresh(); }, text: () => out.innerText };
    };
  }
