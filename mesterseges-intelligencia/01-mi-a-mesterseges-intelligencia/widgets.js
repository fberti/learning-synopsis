/* =========================================================
   Mesterséges intelligencia 1. fejezet – interaktív szemléltetések
   Minden widget egy  <div class="widget" data-widget="név">  elembe épül.
   ========================================================= */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     Segédfüggvények (a többi fejezet widgets.js-ének mintájára)
     ------------------------------------------------------------------ */
  const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const fmt = (x, d = 1) => (isFinite(x) ? (Math.abs(x) < 1e-12 ? 0 : x).toFixed(d).replace(".", ",").replace(/^-(0,0*)$/, "$1") : "–");
  const groupDigits = s => String(s).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

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
      obj.w = w; obj.h = hh;
    };
    obj.resize();
    redrawers.push(() => { obj.resize(); obj.draw && obj.draw(); });
    return obj;
  }
  let rT;
  addEventListener("resize", () => { clearTimeout(rT); rT = setTimeout(() => redrawers.forEach(f => f()), 150); });
  new MutationObserver(() => redrawers.forEach(f => f())).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  function axes(ctx, box, { xmin, xmax, ymin, ymax, xticks = [], yticks = [], xlabel = "", ylabel = "", xfmt = String, yfmt = v => String(v).replace(".", ",") }) {
    const { x0, y0, x1, y1 } = box;
    const tx = v => x0 + (v - xmin) / (xmax - xmin) * (x1 - x0);
    const ty = v => y1 - (v - ymin) / (ymax - ymin) * (y1 - y0);
    ctx.strokeStyle = css("--border"); ctx.fillStyle = css("--muted"); ctx.lineWidth = 1;
    ctx.font = "11px system-ui, sans-serif";
    ctx.textAlign = "right"; ctx.textBaseline = "middle";
    yticks.forEach(v => { ctx.beginPath(); ctx.moveTo(x0, ty(v)); ctx.lineTo(x1, ty(v)); ctx.stroke(); ctx.fillText(yfmt(v), x0 - 5, ty(v)); });
    ctx.textAlign = "center"; ctx.textBaseline = "top";
    xticks.forEach(v => ctx.fillText(xfmt(v), tx(v), y1 + 5));
    ctx.strokeStyle = css("--muted");
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.lineTo(x1, y1); ctx.stroke();
    if (xlabel) { ctx.textAlign = "right"; ctx.fillText(xlabel, x1, y1 + 20); }
    if (ylabel) { ctx.textAlign = "left"; ctx.textBaseline = "bottom"; ctx.fillText(ylabel, x0 + 4, y0 - 2); }
    return { tx, ty };
  }

  const W = {};

  /* ------------------------------------------------------------------
     1.1  ai-venn – az egymásba ágyazott fogalmak
     ------------------------------------------------------------------ */
  W["ai-venn"] = root => {
    header(root, "Az MI fogalmainak térképe",
      "Kattints egy rétegre, hogy lásd, mit jelent – vagy egy példára, hogy lásd, melyik a legszűkebb réteg, ahová tartozik.");
    const L = [
      { name: "Mesterséges intelligencia", short: "MI",
        desc: "Minden gépi rendszer, amely olyan feladatot old meg, amelyhez embernél intelligencia kellene – kézzel írt szabályokkal, kereséssel, logikával vagy tanulással.",
        ex: "útvonaltervező, sakkprogram (Deep Blue), szakértői rendszer, ELIZA", ch: "1. és 14. (megerősítéses tanulás), 18–19. fejezet (ágensek)" },
      { name: "Gépi tanulás", short: "GT",
        desc: "Az MI azon része, ahol a rendszer viselkedését nem a programozó írja meg, hanem adatokból tanulja: adat + válasz → szabály.",
        ex: "Bayes-spamszűrő, döntési fa, lineáris regresszió, k-közép klaszterezés", ch: "3–8. fejezet" },
      { name: "Mélytanulás", short: "MT",
        desc: "Gépi tanulás sokrétegű neurális hálókkal. A rétegek maguk tanulják meg a hasznos jellemzőket (élek → formák → tárgyak).",
        ex: "arcfelismerés, beszédfelismerés, AlexNet, AlphaZero", ch: "9–12. fejezet" },
      { name: "Generatív MI", short: "GenAI",
        desc: "Modellek, amelyek új tartalmat hoznak létre: szöveget, képet, hangot, videót, kódot.",
        ex: "képgeneráló (diffúziós modell), hangklónozás, GAN", ch: "13. fejezet" },
      { name: "Nagy nyelvi modell (LLM)", short: "LLM",
        desc: "Óriási szövegmennyiségen, önfelügyelt módon előtanított generatív modell, amely a szöveg folytatását jósolja; finomhangolva asszisztens, eszközökkel ágens.",
        ex: "ChatGPT, Claude, Gemini, Llama", ch: "15–17. fejezet" }
    ];
    const EX = [
      { name: "útvonaltervező", lvl: 0, why: "Keresőalgoritmus a térképen; nem tanul semmit." },
      { name: "Deep Blue (1997)", lvl: 0, why: "Keresés + kézzel hangolt értékelés: MI, de nem gépi tanulás." },
      { name: "Bayes-spamszűrő", lvl: 1, why: "Szógyakoriságokat tanul címkézett levelekből, de nincs benne neuronháló." },
      { name: "hitelbírálati döntési fa", lvl: 1, why: "Korábbi ügyfelekből épített fa: tanult, de nem mélytanulás." },
      { name: "arcfelismerő", lvl: 2, why: "Mély konvolúciós háló, amely felismer, de nem hoz létre új képet." },
      { name: "AlphaZero", lvl: 2, why: "Mély neuronháló + megerősítéses tanulás; lépést választ, nem tartalmat generál." },
      { name: "képgeneráló", lvl: 3, why: "Új képet hoz létre szöveges leírásból: generatív, de nem nyelvi modell." },
      { name: "ChatGPT", lvl: 4, why: "Szöveget generáló, óriási szövegkorpuszon tanított nagy nyelvi modell." }
    ];
    const wrap = h("div", { class: "venn" });
    const layers = [];
    let parent = wrap;
    L.forEach((l, i) => {
      const d = h("div", { class: "venn-layer v" + i }, h("span", { class: "venn-label" }, l.name));
      d.addEventListener("click", e => { e.stopPropagation(); select(i); });
      parent.append(d); parent = d; layers.push(d);
    });
    const chips = h("div", { class: "controls" }, h("span", { class: "muted", style: "font-size:.9rem" }, "Példák:"));
    const exBtns = EX.map((x, k) => {
      const b = btn(x.name, () => select(x.lvl, k));
      chips.append(b);
      return b;
    });
    const info = h("div", { class: "readout", style: "font-family:var(--font)" });
    root.append(wrap, chips, info);
    function select(i, exK) {
      layers.forEach((d, k) => { d.classList.toggle("on", k === i); d.classList.toggle("dim", k > i); });
      exBtns.forEach((b, k) => b.classList.toggle("on", k === exK));
      const l = L[i];
      let s = "";
      if (exK != null) s += `<b>${EX[exK].name}</b> → legszűkebb réteg: <b>${l.name}</b>. ${EX[exK].why}<br>`;
      s += `<b>${l.name}</b>: ${l.desc}<br><span class="muted">Példák: ${l.ex}. · Itt tanulod: ${l.ch}.</span>`;
      if (i > 0) s += `<br><span class="muted">Minden ${l.short} egyben ${L.slice(0, i).map(x => x.short).reverse().join(", ")} is.</span>`;
      info.innerHTML = s;
    }
    select(0);
  };

  /* ------------------------------------------------------------------
     1.2  cf-learn – egyenes „tanulása” öt mérésből
     ------------------------------------------------------------------ */
  W["cf-learn"] = root => {
    header(root, "Nézd, ahogy tanul: Celsiusból Fahrenheit",
      "Állítsd a csúszkákkal az egyenes meredekségét ($m$) és tengelymetszetét ($b$), és figyeld a hibát! " +
      "Aztán nyomd meg a <b>Tanulj!</b> gombot: a gép lépésenként maga keresi meg a legjobb egyenest.");
    const C = [0, 10, 20, 30, 40], F = [33, 49, 69, 85, 105];
    let m = 2.5, b = 20, timer = null, steps = 0;
    const sm = slider(1, 3, 0.01, m), sb = slider(10, 50, 0.1, b);
    const lm = h("b"), lb = h("b");
    const bTrain = btn("▶ Tanulj!", () => train(), "btn primary");
    const bRand = btn("🎲 Véletlen kezdés", () => { stop(); m = 1 + Math.random() * 2; b = 10 + Math.random() * 40; steps = 0; sync(); });
    const bTrue = btn("Valódi képlet (1,8; 32)", () => { stop(); m = 1.8; b = 32; sync(); });
    root.append(h("div", { class: "controls" },
      h("label", null, "m =", sm, lm), h("label", null, "b =", sb, lb)),
      h("div", { class: "controls" }, bTrain, bRand, bTrue));
    const cv = makeCanvas(root, 0.55);
    const out = h("div", { class: "readout" });
    root.append(out);
    const errs = () => C.map((c, i) => m * c + b - F[i]);
    function draw() {
      const { ctx, w, h: H } = cv;
      ctx.clearRect(0, 0, w, H);
      const box = { x0: 46, y0: 14, x1: w - 12, y1: H - 34 };
      const { tx, ty } = axes(ctx, box, { xmin: -5, xmax: 45, ymin: 20, ymax: 120,
        xticks: [0, 10, 20, 30, 40], yticks: [20, 40, 60, 80, 100, 120], xlabel: "C (°C)", ylabel: "F (°F)" });
      ctx.save(); ctx.beginPath(); ctx.rect(box.x0, box.y0, box.x1 - box.x0, box.y1 - box.y0); ctx.clip();
      ctx.strokeStyle = css("--bad"); ctx.setLineDash([4, 4]); ctx.lineWidth = 1.5;
      C.forEach((c, i) => { ctx.beginPath(); ctx.moveTo(tx(c), ty(F[i])); ctx.lineTo(tx(c), ty(m * c + b)); ctx.stroke(); });
      ctx.setLineDash([]); ctx.strokeStyle = css("--accent"); ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(tx(-5), ty(m * -5 + b)); ctx.lineTo(tx(45), ty(m * 45 + b)); ctx.stroke();
      ctx.restore();
      ctx.fillStyle = css("--setB");
      C.forEach((c, i) => { ctx.beginPath(); ctx.arc(tx(c), ty(F[i]), 5, 0, 2 * Math.PI); ctx.fill(); });
    }
    cv.draw = draw;
    function sync() {
      sm.value = m; sb.value = b;
      lm.textContent = fmt(m, 2); lb.textContent = fmt(b, 1);
      const e = errs();
      const mae = e.reduce((s, x) => s + Math.abs(x), 0) / e.length;
      const mse = e.reduce((s, x) => s + x * x, 0) / e.length;
      out.innerHTML = `Modell: <b>F = ${fmt(m, 2)}·C + ${fmt(b, 1)}</b>${steps ? ` · tanulási lépés: ${steps}` : ""}<br>` +
        `átlagos eltérés: <b>${fmt(mae, 2)} °F</b> · átlagos négyzetes eltérés: <b>${fmt(mse, 2)}</b> ` +
        `<span class="muted">(a tanulás ezt csökkenti – 3. fejezet)</span><br>` +
        `jóslat 100 °C-ra: <b>${fmt(m * 100 + b, 1)} °F</b> <span class="muted">(valódi: 212 °F)</span>`;
      draw();
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; bTrain.textContent = "▶ Tanulj!"; } }
    /* gradiens módszer a középre tolt u = (C − 20)/20 változóban: F = a·u + c,  a = 20m,  c = 20m + b */
    function train() {
      if (timer) return stop();
      bTrain.textContent = "⏸ Állj!";
      const U = C.map(c => (c - 20) / 20), lr = 0.25;
      timer = setInterval(() => {
        let a = 20 * m, c = 20 * m + b;
        const e = U.map((u, i) => a * u + c - F[i]);
        const ga = 2 * e.reduce((s, x, i) => s + x * U[i], 0) / e.length;
        const gc = 2 * e.reduce((s, x) => s + x, 0) / e.length;
        a -= lr * ga; c -= lr * gc;
        m = a / 20; b = c - a; steps++;
        sync();
        if ((Math.abs(ga) < 1e-3 && Math.abs(gc) < 1e-3) || steps >= 400) stop();
      }, 60);
    }
    sm.addEventListener("input", () => { stop(); m = +sm.value; steps = 0; sync(); });
    sb.addEventListener("input", () => { stop(); b = +sb.value; steps = 0; sync(); });
    sync();
  };

  /* ------------------------------------------------------------------
     1.2  rules-vs-learning – kézi szabály vs. tanult spamszűrő
     ------------------------------------------------------------------ */
  W["rules-vs-learning"] = root => {
    header(root, "Szabály vagy tanulás? Spamszűrő két módon",
      "Bal oldalt te írod a szabályt (spam, ha a tárgy tartalmazza valamelyik bejelölt szórészletet). Jobb oldalt egy modell a 30 régi, " +
      "címkézett levélből maga tanulja meg, melyik szó mennyire „spames”. Nézd meg, mi történik az új levelekkel!");
    const TRAIN = [
      ["INGYEN iPhone 16 – csak ma!", 1], ["Ön nyert! Vegye át a nyereményét", 1], ["Kattints ide és nyerj autót", 1],
      ["Olcsó gyógyszer recept nélkül", 1], ["Sürgős: erősítse meg bankkártyája adatait", 1], ["Fogyjon le 10 kilót egy hét alatt", 1],
      ["Ingyen kupon – csak most, kattints", 1], ["Gratulálunk, Ön a szerencsés nyertes", 1], ["Gyors kölcsön hitelbírálat nélkül", 1],
      ["Exkluzív ajánlat csak Önnek: -90%", 1], ["Ingyen pörgetések a kaszinóban", 1], ["Csomagja nem kézbesíthető, kattints ide", 1],
      ["Keress napi 100 ezret otthonról", 1], ["Utolsó esély: nyeremény vár rád", 1], ["Sürgős: fiókja zárolásra kerül", 1],
      ["Holnapi megbeszélés 10-kor", 0], ["Ingyen parkolás a konferencián", 0], ["Számla – 2026. szeptember", 0],
      ["Anya születésnapja vasárnap", 0], ["Jegyzőkönyv a tegnapi értekezletről", 0], ["Fotók a nyaralásról", 0],
      ["Csomagod megérkezett az automatába", 0], ["Ebéd pénteken?", 0], ["Projekt határidő módosítás", 0],
      ["Az edzés ma elmarad", 0], ["Könyvtári kölcsönzés: holnap lejár", 0], ["Recept: anya húslevese", 0],
      ["Sürgős: a szerver leállt", 0], ["Szülői értekezlet csütörtökön", 0], ["Szállásfoglalás visszaigazolása", 0]
    ];
    const WEEK1 = [
      ["1NGYEN iPhone, csak ma!!!", 1], ["Nyer3mény vár rád", 1], ["Kriptobefektetés: dupla hozam garantáltan", 1],
      ["Fiókja zárolva – kattints a feloldáshoz", 1], ["Ingyenes belépő a múzeumba vasárnap", 0],
      ["Sürgős: a holnapi megbeszélés elmarad", 0], ["Vacsora szombaton?", 0], ["Számla – 2026. október", 0]
    ];
    const WEEK2 = [
      ["Garantált hozam kriptóval, kockázat nélkül", 1], ["Befektetés: havi dupla hozam", 1], ["Utolsó esély: kriptó bónusz", 1],
      ["Csomagja vámkezelésre vár, fizessen most", 1], ["Fotók a születésnapról", 0], ["Kriptó előadás: a holnapi óra anyaga", 0],
      ["Csomag megérkezett, köszönöm!", 0], ["Pénteki ebéd elmarad", 0]
    ];
    const tok = s => [...new Set(s.toLowerCase().match(/[0-9a-záéíóöőúüű]+/g) || [])];
    function trainModel(data) {
      const S = {}, Hm = {};
      data.forEach(([t, y]) => tok(t).forEach(w => { const o = y ? S : Hm; o[w] = (o[w] || 0) + 1; }));
      const Wt = {};
      new Set([...Object.keys(S), ...Object.keys(Hm)]).forEach(w => (Wt[w] = Math.log(((S[w] || 0) + 1) / ((Hm[w] || 0) + 1))));
      return Wt;
    }
    const score = (Wt, t) => tok(t).reduce((s, w) => s + (Wt[w] || 0), 0);
    const M0 = trainModel(TRAIN), M1 = trainModel(TRAIN.concat(WEEK1));

    const kws = [["ingyen", true], ["nyer", true], ["kattints", false], ["sürgős", false], ["olcsó", false], ["kölcsön", false], ["csak", false]];
    const kwBox = h("div", { class: "controls" });
    function renderKw() {
      kwBox.innerHTML = "";
      kws.forEach((k, i) => {
        const cb = h("input", { type: "checkbox" });
        cb.checked = k[1];
        cb.addEventListener("change", () => { k[1] = cb.checked; upd(); });
        kwBox.append(h("label", null, cb, k[0]));
      });
    }
    const inp = h("input", { type: "text", placeholder: "saját szórészlet", style: "width:10em" });
    const add = () => {
      const v = inp.value.trim().toLowerCase();
      if (v && !kws.some(k => k[0] === v)) { kws.push([v, true]); renderKw(); upd(); }
      inp.value = "";
    };
    inp.addEventListener("keydown", e => { if (e.key === "Enter") add(); });
    const retrain = h("input", { type: "checkbox" });
    retrain.addEventListener("change", () => upd());

    const SETS = [["Régi levelek (30)", TRAIN], ["Új levelek – 1. hét (8)", WEEK1], ["Új levelek – 2. hét (8)", WEEK2]];
    let cur = 0;
    const tabs = h("div", { class: "controls" });
    const tabBtns = SETS.map(([name], i) => { const b = btn(name, () => { cur = i; upd(); }); tabs.append(b); return b; });

    const left = h("div", { class: "box", style: "margin:0" }, h("b", null, "✍️ A te szabályod"), kwBox,
      h("div", { class: "controls" }, inp, btn("Hozzáad", add)));
    const modelInfo = h("div", { class: "muted", style: "font-size:.88rem" });
    const right = h("div", { class: "box", style: "margin:0" }, h("b", null, "🤖 Tanult modell"), modelInfo,
      h("div", { class: "controls" }, h("label", null, retrain, "a 2. hét előtt tanítsd újra az 1. hét leveleivel is")));
    const stats = h("div", { class: "stat-row" });
    const table = h("div", { style: "overflow-x:auto" });
    root.append(h("div", { class: "two-col" }, left, right), tabs, stats, table);
    renderKw();

    function upd() {
      tabBtns.forEach((b, i) => b.classList.toggle("on", i === cur));
      const data = SETS[cur][1];
      const Wt = cur === 2 && retrain.checked ? M1 : M0;
      const active = kws.filter(k => k[1]).map(k => k[0]);
      const rule = t => active.some(k => t.toLowerCase().includes(k)) ? 1 : 0;
      const top = Object.entries(Wt).sort((a, b) => b[1] - a[1]);
      modelInfo.innerHTML = `Tanítva: ${Wt === M1 ? "30 régi + 8 levél az 1. hétről" : "a 30 régi levélen"}.<br>` +
        `Legspamesebb szavak: <b>${top.slice(0, 5).map(x => x[0]).join(", ")}</b><br>` +
        `Legártatlanabb szavak: <b>${top.slice(-5).reverse().map(x => x[0]).join(", ")}</b>`;
      let okR = 0, okM = 0;
      const rows = data.map(([t, y]) => {
        const r = rule(t), sc = score(Wt, t), p = sc > 0 ? 1 : 0;
        okR += r === y; okM += p === y;
        const cell = (v, ok) => h("td", { style: `background:var(${ok ? "--ok-soft" : "--bad-soft"})` }, (v ? "spam" : "rendes") + (ok ? " ✓" : " ✗"));
        return h("tr", null, h("td", null, t), h("td", null, y ? "spam" : "rendes"), cell(r, r === y),
          cell(p, p === y), h("td", { class: "muted", style: "font-family:var(--mono);font-size:.82rem" }, fmt(sc, 2)));
      });
      table.innerHTML = "";
      table.append(h("table", { style: "font-size:.9rem" },
        h("tr", null, h("th", null, "tárgy"), h("th", null, "valójában"), h("th", null, "szabály"), h("th", null, "modell"), h("th", null, "pontszám")),
        rows));
      const pct = (k, n) => Math.round(100 * k / n) + "%";
      stats.innerHTML = "";
      stats.append(
        h("div", { class: "stat" }, h("div", { class: "v" }, `${okR}/${data.length}`), h("div", { class: "l" }, `szabály – ${pct(okR, data.length)} helyes`)),
        h("div", { class: "stat" }, h("div", { class: "v" }, `${okM}/${data.length}`), h("div", { class: "l" }, `modell – ${pct(okM, data.length)} helyes`)));
      const note = cur === 0 ? "A modell a régi leveleken tanult, ezért itt könnyű dolga van – az igazi próba az új levelek."
        : cur === 1 ? "Új trükkök („1NGYEN”, „Nyer3mény”) és új téma (kripto). Melyik bírja jobban? Próbáld a szabályodat javítani!"
        : retrain.checked ? "Az újratanított modell már látott kriptós spamet. A szabályodat neked kell átírnod."
        : "A kriptós spamek terjednek. Kapcsold be az újratanítást a jobb oldalon, és figyeld a modell eredményét!";
      stats.append(h("div", { class: "muted", style: "font-size:.88rem;flex:1 1 220px;align-self:center" }, note));
    }
    upd();
  };

  /* ------------------------------------------------------------------
     1.3  learning-type-sorter – melyik tanulási fajta?
     ------------------------------------------------------------------ */
  W["learning-type-sorter"] = root => {
    header(root, "Válogató: melyik tanulási fajta?",
      "Minden példánál válaszd ki a tanulás fajtáját! Azonnal megkapod a magyarázatot.");
    const T = ["regresszió", "osztályozás", "felügyelet nélküli", "megerősítéses", "önfelügyelt"];
    const ITEMS = [
      ["Holnapi középhőmérséklet előrejelzése a korábbi mérésekből", 0, "Felügyelt: a múltbeli napokra ismert a valódi hőmérséklet; a kimenet szám → regresszió."],
      ["Kézzel írt számjegyek (0–9) felismerése címkézett képekből", 1, "Felügyelt, a kimenet 10 kategória egyike → osztályozás."],
      ["Vásárlók csoportokba rendezése, előre megadott csoportok nélkül", 2, "Nincs címke, szerkezetet (csoportokat) keresünk → klaszterezés."],
      ["Egy robotkar próbálkozással tanulja meg megfogni a tárgyakat", 3, "Cselekszik, és a sikerért jutalmat kap → megerősítéses."],
      ["Nyelvi modell előtanítása: a következő szó megjóslása nyers szövegből", 4, "A címke (a következő szó) magából az adatból jön → önfelügyelt."],
      ["Használt autó árának becslése a kor és a futásteljesítmény alapján", 0, "Ismert eladási árakból tanul; a kimenet összeg → regresszió."],
      ["Visszafizeti-e az ügyfél a hitelt? (korábbi ügyfelek alapján)", 1, "Felügyelt, a kimenet igen/nem → osztályozás."],
      ["Szokatlan bankkártyás tranzakciók kiszűrése, megjelölt csalások nélkül", 2, "Nincs címke; a „nem illik a többi közé” mintákat keressük → anomáliadetektálás."],
      ["Egy program videojátékot tanul a pontszám alapján", 3, "A pontszám a jutalom, a lépések a cselekvések → megerősítéses."],
      ["Kitakart képrészletek kitalálása (előtanítás képeken)", 4, "A címke az eredeti kép kitakart része → önfelügyelt."]
    ];
    const order = ITEMS.map((_, i) => i).sort(() => Math.random() - 0.5);
    const score = h("div", { class: "readout" });
    const list = h("div");
    let done = 0, good = 0;
    function build() {
      list.innerHTML = ""; done = 0; good = 0;
      order.forEach(i => {
        const [txt, ans, why] = ITEMS[i];
        const fb = h("div", { class: "muted", style: "font-size:.88rem;margin-top:.2rem" });
        const btns = T.map((t, k) => btn(t, () => {
          btns.forEach(b => (b.disabled = true));
          btns[ans].style.cssText = "border-color:var(--ok);background:var(--ok-soft)";
          if (k !== ans) btns[k].style.cssText = "border-color:var(--bad);background:var(--bad-soft)";
          done++; if (k === ans) good++;
          fb.textContent = (k === ans ? "✔ " : "✘ Helyes: " + T[ans] + ". ") + why;
          upd();
        }));
        list.append(h("div", { class: "sorter-row" }, h("div", { class: "sorter-q" }, txt), h("div", { class: "controls", style: "margin:.3rem 0 0" }, btns), fb));
      });
      upd();
    }
    function upd() {
      score.innerHTML = `Megválaszolva: <b>${done}/${ITEMS.length}</b> · helyes: <b>${good}</b>` +
        (done === ITEMS.length ? (good === ITEMS.length ? " – hibátlan! 🏆" : " – nézd át a pirosakat!") : "");
    }
    root.append(list, score, h("div", { class: "controls" }, btn("↻ Újrakezdem", build)));
    build();
  };

  /* ------------------------------------------------------------------
     1.4  ai-timeline – interaktív idővonal
     ------------------------------------------------------------------ */
  W["ai-timeline"] = root => {
    header(root, "Az MI idővonala",
      "Kattints egy pontra (vagy lépkedj a nyilakkal)! A kék sávok az MI-telek. Az irányzatokat a gombokkal ki- és bekapcsolhatod.");
    const LANES = [
      { name: "Szimbolikus MI", col: "--setA" },
      { name: "Neuronhálók", col: "--accent" },
      { name: "Statisztikai GT, adat", col: "--setC" },
      { name: "Játékok, mérföldkövek", col: "--setB" },
      { name: "Nyelvi modellek, ágensek", col: "--bad" }
    ];
    const EV = [
      [1943, 1, "McCulloch–Pitts-neuron", "Az első matematikai neuronmodell: súlyozott bemenetek és küszöb."],
      [1950, 3, "Turing: imitációs játék", "„Tudnak-e a gépek gondolkodni?” helyett egy viselkedési teszt: a Turing-teszt."],
      [1956, 0, "Dartmouth", "Nyári kutatótábor; McCarthy 1955-ös pályázatából ered a „mesterséges intelligencia” név."],
      [1956, 0, "Logic Theorist", "Newell és Simon programja matematikai tételeket bizonyít."],
      [1958, 1, "Perceptron", "Rosenblatt tanulni képes neuronhálós gépe (Mark I, 1957–58). Nagy sajtóvisszhang, túlzó ígéretek."],
      [1966, 0, "ELIZA", "Weizenbaum „pszichoterapeuta” programja egyszerű szövegmintákkal. Az ELIZA-hatás névadója."],
      [1969, 1, "Perceptrons (könyv)", "Minsky és Papert kimutatja az egyrétegű perceptron korlátait; a neuronhálós kutatás szinte leáll."],
      [1973, 0, "Lighthill-jelentés", "A brit kormány jelentése szerint az MI nem váltotta be ígéreteit → első MI-tél."],
      [1980, 0, "Szakértői rendszerek", "Üzleti siker (pl. XCON a DEC-nél): tudásbázis + következtetőgép, Lisp-gépeken."],
      [1982, 1, "Hopfield-háló", "Asszociatív memória neuronhálóval; a konnekcionizmus visszatérése."],
      [1986, 1, "Visszaterjesztés", "Rumelhart, Hinton, Williams: többrétegű hálók hatékony tanítása."],
      [1987, 0, "A Lisp-gépek piacának összeomlása", "A szakértői rendszerek drágák és törékenyek → második MI-tél (kb. 1987–1993)."],
      [1992, 3, "TD-Gammon", "Tesauro programja megerősítéses tanulással a legjobbak szintjén játszik ostáblát."],
      [1995, 2, "Szupport vektor gépek", "Cortes és Vapnik: a klasszikus gépi tanulás egyik csúcsa (7. fejezet)."],
      [1997, 3, "Deep Blue – Kaszparov", "Az IBM gépe legyőzi a sakkvilágbajnokot – kereséssel, nem tanulással."],
      [1998, 1, "LeNet-5", "LeCun konvolúciós hálója kézírásos számjegyeket olvas (csekkfeldolgozás)."],
      [2002, 2, "Bayes-spamszűrők", "P. Graham: A Plan for Spam – a gépi tanulás belép a mindennapokba."],
      [2009, 2, "ImageNet", "Fei-Fei Li csapata: több mint 14 millió címkézett kép – a mélytanulás üzemanyaga."],
      [2011, 3, "Watson – Jeopardy!", "Az IBM Watson megnyeri a tévévetélkedőt."],
      [2012, 1, "AlexNet", "GPU-n tanított konvolúciós háló; top-5 hiba 15,3% (a második 26,2%). A mélytanulás „nagy bummja”."],
      [2014, 1, "GAN", "Goodfellow generatív ellenséges hálói: valószerű képek generálása."],
      [2016, 3, "AlphaGo – Li Sze-dol", "4:1 go-ban – évtizedekkel a várakozások előtt."],
      [2017, 4, "Transformer", "„Attention Is All You Need” – minden mai nagy nyelvi modell alapja."],
      [2017, 3, "AlphaZero", "Csak a szabályokból, önmaga ellen játszva 24 órán belül emberfeletti sakkban, sógiban, go-ban."],
      [2018, 4, "BERT és GPT", "Előtanított nyelvi modellek: egyszer tanítjuk, sok feladatra használjuk."],
      [2020, 4, "GPT-3", "175 milliárd paraméter; néhány példából is megtanul új feladatot (few-shot)."],
      [2020, 1, "AlphaFold 2", "A fehérjék térszerkezetének jóslása – 2024-ben kémiai Nobel-díj."],
      [2022, 4, "ChatGPT", "2022. november 30.: az MI a köznyelv része lesz."],
      [2023, 4, "GPT-4, nyílt modellek", "Multimodális modellek; nyílt súlyú modellek (Llama) – bárki futtathatja."],
      [2024, 4, "Érvelő modellek, MCP", "OpenAI o1 (szept.): gondolkodás válasz előtt. Model Context Protocol (nov.): eszközök csatlakoztatása."],
      [2024, 3, "Nobel-díjak", "Fizika: Hopfield és Hinton (neuronhálók); kémia (részben): Hassabis és Jumper (AlphaFold)."],
      [2025, 4, "Nyílt érvelő modellek, ágensek", "DeepSeek-R1 (jan.); kódoló és többlépéses ágensek elterjedése. 📅"]
    ].map(([y, l, t, d], i) => ({ y, l, t, d, i }));
    /* azonos sávban közeli évek: kis függőleges eltolás */
    EV.forEach((e, k) => { e.dy = EV.slice(0, k).filter(f => f.l === e.l && Math.abs(f.y - e.y) < 2.5 && !f.dy).length ? 1 : 0; });
    const on = LANES.map(() => true);
    const ctrl = h("div", { class: "controls" });
    const laneBtns = LANES.map((L, i) => {
      const b = btn(L.name, () => { on[i] = !on[i]; b.classList.toggle("on", on[i]); if (!on[EV[sel].l]) step(1); draw(); });
      b.classList.add("on");
      b.style.borderLeft = `5px solid var(${L.col})`;
      ctrl.append(b);
      return b;
    });
    const nav = h("div", { class: "controls" }, btn("◀ előző", () => step(-1)), btn("következő ▶", () => step(1)));
    root.append(ctrl);
    const cv = makeCanvas(root, 0.42);
    const info = h("div", { class: "readout", style: "font-family:var(--font)" });
    root.append(nav, info);
    let sel = 2, pts = [];
    const visible = () => EV.filter(e => on[e.l]);
    function step(d) {
      const v = visible();
      if (!v.length) return;
      let k = v.findIndex(e => e.i === sel);
      k = k < 0 ? 0 : (k + d + v.length) % v.length;
      sel = v[k].i; draw();
    }
    function draw() {
      const { ctx, w, h: H } = cv;
      ctx.clearRect(0, 0, w, H);
      const x0 = 12, x1 = w - 12, y0 = 10, y1 = H - 26;
      const tx = y => x0 + (y - 1940) / (2027 - 1940) * (x1 - x0);
      const laneY = l => y0 + 12 + l * (y1 - y0 - 12) / LANES.length;
      ctx.save(); ctx.globalAlpha = 0.16; ctx.fillStyle = css("--setA");
      [[1974, 1980], [1987, 1993]].forEach(([a, b]) => ctx.fillRect(tx(a), y0, tx(b) - tx(a), y1 - y0));
      ctx.restore();
      ctx.font = "11px system-ui, sans-serif"; ctx.fillStyle = css("--muted"); ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.fillText("tél", tx(1977), y1 - 14); ctx.fillText("tél", tx(1990), y1 - 14);
      ctx.strokeStyle = css("--muted"); ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x1, y1); ctx.stroke();
      for (let y = 1940; y <= 2020; y += 10) { ctx.fillText(String(y), tx(y), y1 + 6); ctx.beginPath(); ctx.moveTo(tx(y), y1); ctx.lineTo(tx(y), y1 + 4); ctx.stroke(); }
      ctx.textAlign = "left"; ctx.textBaseline = "bottom";
      LANES.forEach((L, l) => {
        if (!on[l]) return;
        ctx.strokeStyle = css("--border"); ctx.beginPath(); ctx.moveTo(x0, laneY(l)); ctx.lineTo(x1, laneY(l)); ctx.stroke();
        ctx.fillStyle = css("--muted"); ctx.fillText(L.name, x0 + 2, laneY(l) - 7);
      });
      pts = [];
      visible().forEach(e => {
        const x = tx(e.y), y = laneY(e.l) + (e.dy ? 9 : 0);
        pts.push({ e, x, y });
        ctx.fillStyle = css(LANES[e.l].col);
        ctx.beginPath(); ctx.arc(x, y, e.i === sel ? 8 : 5.5, 0, 2 * Math.PI); ctx.fill();
        if (e.i === sel) { ctx.strokeStyle = css("--text"); ctx.lineWidth = 2; ctx.stroke(); ctx.lineWidth = 1; }
      });
      const e = EV[sel];
      info.innerHTML = `<b>${e.y}</b> · <span class="muted">${LANES[e.l].name}</span><br><b>${e.t}</b> – ${e.d}`;
    }
    cv.draw = draw;
    cv.c.style.cursor = "pointer";
    cv.c.addEventListener("click", ev => {
      const r = cv.c.getBoundingClientRect(), x = ev.clientX - r.left, y = ev.clientY - r.top;
      let best = null, bd = 16;
      pts.forEach(p => { const d = Math.hypot(p.x - x, p.y - y); if (d < bd) { bd = d; best = p; } });
      if (best) { sel = best.e.i; draw(); }
    });
    draw();
  };

  /* ------------------------------------------------------------------
     1.5  compute-growth – exponenciális növekedés
     ------------------------------------------------------------------ */
  W["compute-growth"] = root => {
    header(root, "Évi szorzó, duplázási idő",
      "Állítsd be, hányszorosára nő valami évente, és hány évig! A grafikon függőleges tengelye <b>logaritmikus</b>: minden rácsvonal tízszeres.");
    let k = 4, T = 10;
    const sk = slider(1.05, 6, 0.05, k), st = slider(1, 20, 1, T);
    const lk = h("b"), lt = h("b");
    const presets = [["Moore-törvény (≈1,41×/év)", 1.41], ["Frontier tanítási számítás (≈4×/év) 📅", 4], ["Bankbetét, 5%/év", 1.05], ["Évi duplázás", 2]];
    root.append(h("div", { class: "controls" }, h("label", null, "évi szorzó k =", sk, lk), h("label", null, "évek t =", st, lt)),
      h("div", { class: "controls" }, presets.map(([n, v]) => btn(n, () => { k = v; sync(); }))));
    const cv = makeCanvas(root, 0.45);
    const out = h("div", { class: "readout" });
    root.append(out);
    const big = v => v < 1e6 ? groupDigits(Math.abs(v - Math.round(v)) < 1e-9 || v >= 100 ? Math.round(v) : fmt(v, v < 10 ? 2 : 1)) :
      v < 1e9 ? fmt(v / 1e6, 1) + " millió" : v < 1e12 ? fmt(v / 1e9, 1) + " milliárd" : fmt(v / 1e12, 1) + " billió";
    function draw() {
      const { ctx, w, h: H } = cv;
      ctx.clearRect(0, 0, w, H);
      const maxL = Math.max(1, Math.ceil(T * Math.log10(Math.max(k, 1.41))));
      const box = { x0: 52, y0: 12, x1: w - 14, y1: H - 32 };
      const { tx, ty } = axes(ctx, box, { xmin: 0, xmax: T, ymin: 0, ymax: maxL,
        xticks: [...Array(T + 1).keys()].filter(t => T <= 10 || t % 2 === 0), yticks: [...Array(maxL + 1).keys()].filter(l => maxL <= 10 || l % 2 === 0),
        xlabel: "év", ylabel: "növekedés (×)", yfmt: l => l <= 5 ? groupDigits(10 ** l) : "10^" + l });
      const curve = (kk, col, dash) => {
        ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2.5; if (dash) ctx.setLineDash([6, 5]);
        ctx.beginPath(); for (let i = 0; i <= 100; i++) { const t = T * i / 100; const y = Math.min(maxL, t * Math.log10(kk)); i ? ctx.lineTo(tx(t), ty(y)) : ctx.moveTo(tx(t), ty(y)); }
        ctx.stroke(); ctx.restore();
      };
      curve(1.41, css("--muted"), true);
      curve(k, css("--accent"), false);
      ctx.fillStyle = css("--muted"); ctx.font = "11px system-ui, sans-serif"; ctx.textAlign = "right"; ctx.textBaseline = "bottom";
      ctx.fillText("szaggatott: Moore-törvény", box.x1, box.y1 - 4);
    }
    cv.draw = draw;
    function sync() {
      sk.value = k; st.value = T; lk.textContent = fmt(k, 2); lt.textContent = T;
      const tot = Math.pow(k, T), dbl = Math.log(2) / Math.log(k);
      out.innerHTML = `${T} év alatt: <b>${fmt(k, 2)}<sup>${T}</sup> ≈ ${big(tot)}-szoros</b> növekedés<br>` +
        `duplázási idő: <b>${dbl < 2 ? fmt(dbl * 12, 1) + " hónap" : fmt(dbl, 1) + " év"}</b> ` +
        `<span class="muted">(ln 2 / ln ${fmt(k, 2)})</span> · összevetésül a Moore-törvény ${T} év alatt: ${big(Math.pow(Math.SQRT2, T))}-szoros`;
      draw();
    }
    sk.addEventListener("input", () => { k = +sk.value; sync(); });
    st.addEventListener("input", () => { T = +st.value; sync(); });
    sync();
  };

  /* ------------------------------------------------------------------
     1.6  ml-checklist – kell-e gépi tanulás?
     ------------------------------------------------------------------ */
  W["ml-checklist"] = root => {
    header(root, "Ellenőrző lista: kell-e ide gépi tanulás?",
      "Válassz egy esetet, vagy válaszolj a kérdésekre a saját ötleted alapján! (Huyen ellenőrző listája alapján.)");
    const Q = [
      "1. Van tanulható mintázat (nem tiszta véletlen)?",
      "2. A mintázat összetett (nem írható le egy egyszerű szabállyal / táblázattal)?",
      "3. Van adat, vagy gyűjthető?",
      "4. Előrejelzés / becslés / besorolás a feladat?",
      "5. Az új adatok hasonlítanak majd a tanító adatokra?",
      "6. Ismétlődő, nagy léptékű (sok jóslás kell)?",
      "7. Egy-egy rossz jóslás ára elviselhető?",
      "8. Etikailag rendben van, hogy gép döntsön / javasoljon?"
    ];
    const CASES = [
      ["spamszűrő", [1, 1, 1, 1, 1, 1, 1, 1], "A tankönyvi jelölt: minden feltétel teljesül. A spamek változnak, ezért rendszeres újratanítás kell."],
      ["személyi jövedelemadó kiszámítása", [1, 0, 1, 0, 1, 1, 0, 1], "A szabályt a törvény pontosan előírja: hagyományos program hibátlanul számol."],
      ["a következő kockadobás megjóslása", [0, 1, 1, 1, 1, 1, 1, 1], "A dobások függetlenek: nincs mit tanulni, bármennyi adat sem segít."],
      ["lakások bérleti díjának becslése", [1, 1, 1, 1, 1, 1, 1, 1], "Összetett mintázat, sok adat, ismétlődő: jó feladat. A piac változik, figyelni kell az eltolódásra."],
      ["vészfékezés egy önvezető autóban", [1, 1, 1, 1, 1, 1, 0, 1], "Gépi tanulás nélkül aligha megoldható, de a hiba ára életveszély: szigorú tesztelés, tartalék rendszerek, biztonsági szabályok kellenek."],
      ["új, egyedi termék első havi eladásai", [1, 1, 0, 1, 0, 0, 1, 1], "Nincs (hasonló) adat: szakértői becslés vagy próbaértékesítés kell, a modell később jöhet."],
      ["önéletrajzok szűrése a korábbi felvételi döntések alapján", [1, 1, 1, 1, 1, 1, 0, 0], "A korábbi döntések torzításait tanulná meg és ismételné: csak nagyon óvatosan, átvilágítással és emberi döntéssel (24. fejezet)."]
    ];
    const ans = Q.map(() => null);
    const sel = h("select", null, h("option", { value: "" }, "— válassz egy esetet —"), CASES.map((c, i) => h("option", { value: i }, c[0])));
    const note = h("p", { class: "muted", style: "font-size:.9rem;margin:.3rem 0" });
    root.append(h("div", { class: "controls" }, sel), note);
    const rows = Q.map((q, i) => {
      const y = btn("igen", () => set(i, 1)), n = btn("nem", () => set(i, 0));
      root.append(h("div", { class: "wizard-q" }, h("span", null, q), y, n));
      return [y, n];
    });
    const out = h("div", { class: "formula-out", style: "font-size:1rem;text-align:left" });
    root.append(out);
    function set(i, v) { ans[i] = v; sel.value = ""; note.textContent = ""; upd(); }
    sel.addEventListener("change", () => {
      if (sel.value === "") return;
      const c = CASES[+sel.value];
      c[1].forEach((v, i) => (ans[i] = v));
      note.textContent = c[2];
      upd();
    });
    function upd() {
      rows.forEach(([y, n], i) => { y.classList.toggle("on", ans[i] === 1); n.classList.toggle("on", ans[i] === 0); });
      if (ans.some(a => a === null)) { out.innerHTML = "Válaszolj mind a nyolc kérdésre (vagy válassz egy esetet)!"; return; }
      const [pat, cx, data, pred, sim, rep, cheap, eth] = ans;
      let v;
      if (!eth) v = "⛔ <b>Ne így.</b> Etikai kockázat: csak alapos átvilágítással, átláthatóan és emberi döntéssel (24. fejezet).";
      else if (!pat) v = "🎲 <b>Nincs mit tanulni.</b> Véletlen jelenséget semmilyen modell nem jósol meg.";
      else if (!cx) v = "📏 <b>Elég egy szabály vagy táblázat.</b> Ha a mintázat egyszerű és ismert, a hagyományos program pontosabb és olcsóbb.";
      else if (!pred) v = "❓ <b>Nem előrejelzési feladat</b> – a gépi tanulás nem erre való. Lehet, hogy egy része az (bontsd fel!).";
      else if (!data) v = "📥 <b>Előbb adat kell.</b> Indulj szabállyal vagy emberi döntésekkel, és közben gyűjtsd az adatot.";
      else {
        v = "✅ <b>A gépi tanulás jó választás lehet.</b> Kezdd egy egyszerű alapvonallal, és azt verd meg!";
        if (!sim) v += "<br>🔄 Vigyázz: ha az új adatok eltérnek, a modell romlik – monitorozás és újratanítás kell (21. fejezet).";
        if (!rep) v += "<br>💸 Kevés jóslásnál a modell építése és karbantartása drágább lehet, mint amennyit hoz.";
        if (!cheap) v += "<br>🧑‍⚖️ A hiba drága: bontsd részekre, tartsd az embert a hurokban, és alaposan értékeld (6., 20. fejezet).";
      }
      out.innerHTML = v;
    }
    upd();
  };

  /* ------------------------------------------------------------------
     Indítás
     ------------------------------------------------------------------ */
  document.querySelectorAll(".widget[data-widget]").forEach(root => {
    const f = W[root.dataset.widget];
    if (!f) return;
    try { f(root); math(root); }
    catch (e) { root.append(h("p", { class: "muted" }, "Hiba a szemléltetés betöltésekor: " + e.message)); console.error(e); }
  });
})();
