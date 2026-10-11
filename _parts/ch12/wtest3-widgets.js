/* =========================================================
   Mesterséges intelligencia 12. fejezet – interaktív szemléltetések
   (szövegből számok, beágyazások, rekurrens hálók, figyelem, önfigyelem,
   pozíciókódolás, Transformer-blokk, filmkritika-kísérlet)
   Minden widget egy  <div class="widget" data-widget="név">  elembe épül.
   Rajzolás: assets/calc.js (Calc.canvas, Calc.plot); adatok: glove-data.js (GLOVE12), real-attention.js (REAL12), review-models.js (REVIEW12).
   ========================================================= */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     Segédfüggvények (a 8. fejezet widgets.js-ének mintájára)
     ------------------------------------------------------------------ */
  const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const fmt = (x, d = 2) => (window.Calc ? Calc.fmt(x, d) : String(x));
  const pct = (a, d = 1) => fmt(100 * a, d) + "%";

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
  const slider = (min, max, step, value) => h("input", { type: "range", min, max, step, value });
  const checkbox = (checked, onchange) => { const c = h("input", { type: "checkbox", onchange }); c.checked = checked; return c; };
  const math = el => window.Synopsis && Synopsis.renderMath(el);
  const small = t => h("span", { class: "muted", style: "font-size:.92rem" }, t);
  const setDis = (b, v) => { b.disabled = v; b.style.opacity = v ? 0.45 : ""; b.style.cursor = v ? "default" : ""; };

  function header(root, title, sub) {
    root.append(h("div", { class: "w-title" }, title));
    if (sub) root.append(h("p", { class: "w-sub", html: sub }));
  }
  function twoCanvas(root, aspect, aspectR = aspect) {
    const wrap = h("div", { class: "two-canvas" }), L = h("div", { style: "min-width:0" }), R = h("div", { style: "min-width:0" });
    wrap.append(L, R); root.append(wrap);
    return [Calc.canvas(L, aspect, 380), Calc.canvas(R, aspectR, 380), L, R, wrap];
  }
  const evXY = (cv, e) => { const r = cv.c.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  function polyline(ctx, T, pts, color, width = 2, dash = []) {
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.setLineDash(dash);
    ctx.beginPath();
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(T.tx(x), T.ty(y)) : ctx.moveTo(T.tx(x), T.ty(y))));
    ctx.stroke(); ctx.restore();
  }
  function dot(ctx, x, y, r, color, open = false, lw = 2) {
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI);
    if (open) { ctx.fillStyle = css("--card"); ctx.fill(); ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.stroke(); }
    else { ctx.fillStyle = color; ctx.fill(); }
    ctx.restore();
  }
  function ring(ctx, x, y, r, color, lw = 2, dash = []) {
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.setLineDash(dash); ctx.stroke(); ctx.restore();
  }
  function label(ctx, txt, x, y, color, align = "left", font = "600 12px system-ui, sans-serif", base = "bottom") {
    ctx.save(); ctx.fillStyle = color; ctx.font = font; ctx.textAlign = align; ctx.textBaseline = base;
    ctx.fillText(txt, x, y); ctx.restore();
  }
  function arrow(ctx, x0, y0, x1, y1, color, lw = 2) {
    const a = Math.atan2(y1 - y0, x1 - x0), L = Math.hypot(x1 - x0, y1 - y0);
    if (L < 2) return;
    ctx.save(); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = lw;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1 - 7 * Math.cos(a), y1 - 7 * Math.sin(a)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 - 10 * Math.cos(a - 0.4), y1 - 10 * Math.sin(a - 0.4)); ctx.lineTo(x1 - 10 * Math.cos(a + 0.4), y1 - 10 * Math.sin(a + 0.4)); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  function toggleGroup(items, get, set) {
    const bs = items.map(([key, txt]) => { const b = btn(txt, () => set(key)); b.dataset.key = key; return b; });
    const paint = () => bs.forEach(b => b.classList.toggle("on", b.dataset.key === String(get())));
    return { bs, paint };
  }
  function rgba(col, a) {
    const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(col.trim());
    if (!m) return col;
    return `rgba(${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)},${a})`;
  }
  const hexRGB = c => { const m = /^#?([0-9a-f]{6})$/i.exec(String(c).trim()); if (!m) return [128, 128, 128]; const v = parseInt(m[1], 16); return [v >> 16, (v >> 8) & 255, v & 255]; };
  const flatAspect = (root, a, aNarrow) => ((root.clientWidth || 760) < 520 ? aNarrow : a);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const par = (x, d = 2) => (x < 0 ? `(${fmt(x, d)})` : fmt(x, d));
  /* egyenlő tengelyléptékű nézet */
  function eqView(cv, cx, cy, hx, hy, extra = {}) {
    const Wd = cv.w - 8, Hd = cv.h - 8, s = Math.min(Wd / (2 * hx), Hd / (2 * hy));
    const ax = Wd / (2 * s), ay = Hd / (2 * s);
    return Object.assign({ xmin: cx - ax, xmax: cx + ax, ymin: cy - ay, ymax: cy + ay }, extra);
  }
  /* az osztályok színei (az 5. fejezet konvenciója): 1 = narancs (--setB), 0 = kék (--setA) */
  const C1 = () => css("--setB"), C0 = () => css("--setA");
  /* döntési térkép: p(x, y) ∈ [0, 1] → kék … narancs, a bizonyosság szerinti erősséggel */
  function decisionMap(cv, T, view, p, cell = 6, alpha = 0.34) {
    const { ctx, w, h: hh } = cv, c1 = C1(), c0 = C0();
    for (let px = 0; px < w; px += cell) for (let py = 0; py < hh; py += cell) {
      const x = T.ix(px + cell / 2), y = T.iy(py + cell / 2);
      if (x < view.xmin || x > view.xmax || y < view.ymin || y > view.ymax) continue;
      const v = p(x, y);
      if (!Number.isFinite(v)) continue;
      const a = 0.05 + alpha * Math.min(1, Math.abs(v - 0.5) * 2);
      ctx.fillStyle = rgba(v >= 0.5 ? c1 : c0, a);
      ctx.fillRect(px, py, cell, cell);
    }
  }
  /* egyenes a w1·x + w2·y + b = 0 alakból, a nézetre vágva */
  function lineFrom(w1, w2, b, V) {
    if (Math.abs(w2) > 1e-9 && Math.abs(w2) >= Math.abs(w1) * 0.02) {
      const y = x => -(w1 * x + b) / w2;
      return [[V.xmin, y(V.xmin)], [V.xmax, y(V.xmax)]];
    }
    if (Math.abs(w1) > 1e-9) { const x = -b / w1; return [[x, V.ymin], [x, V.ymax]]; }
    return null;
  }
  const A = () => window.ML.act;

  const softmax = z => { const m = Math.max(...z), e = z.map(v => Math.exp(v - m)), s = e.reduce((a, b) => a + b, 0); return e.map(v => v / s); };
  const argmax = a => a.reduce((bi, v, i, arr) => (v > arr[bi] ? i : bi), 0);
  const dotp = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);
  const norm = a => Math.sqrt(dotp(a, a));
  const cosine = (a, b) => dotp(a, b) / (norm(a) * norm(b) || 1);
  /* cella kitöltése: háttér (--card) → szín, t ∈ [0, 1] erősséggel */
  function mix(colVar, t) {
    const bg = hexRGB(css("--card")), c = hexRGB(css(colVar));
    t = clamp(t, 0, 1);
    return `rgb(${bg.map((b, i) => Math.round(b + (c[i] - b) * t)).join(",")})`;
  }
  /* olvasható szövegszín egy kitöltött cellán */
  const ink = t => (t > 0.55 ? css("--card") : css("--text"));

  const W = {};

  /* ==================================================================
     12.6-a  transformer-block – a Transformer felépítése, paraméterszám
     ================================================================== */
  const w3Int = n => fmt(n, 0).replace(/ /g, " ");                 // ezres tagolás keskeny szóközzel
  const w3Big = n => (n >= 1e9 ? fmt(n / 1e9, n < 1e10 ? 2 : 1) + " milliárd" : n >= 1e6 ? fmt(n / 1e6, 1) + " millió" : w3Int(n));
  const w3Short = n => (n >= 1e9 ? fmt(n / 1e9, 2) + " Mrd" : n >= 1e6 ? fmt(n / 1e6, 2) + " M" : w3Int(n));
  const w3NS = "http://www.w3.org/2000/svg";
  function w3S(tag, attrs, ...kids) {
    const e = document.createElementNS(w3NS, tag);
    if (attrs) for (const [k, v] of Object.entries(attrs)) {
      if (k.startsWith("on")) e.addEventListener(k.slice(2), v); else e.setAttribute(k, v);
    }
    kids.flat().forEach(c => c != null && e.append(c.nodeType ? c : document.createTextNode(c)));
    return e;
  }

  const W3_PRESETS = {
    exp: { name: "a kísérletünk Transformere", arch: "enc", norm: "post", d: 16, h: 2, N: 1, V: 28, nmax: 15, ff: 32, pos: "learned", seg: false, embLN: false, finalLN: false, head: "mean1",
      note: "A 12.8 kísérlete: 1 blokk, d = 16, 2 fej, 28 szavas szótár, legfeljebb 15 token, d_ff = 32; a kimenet a tokenvektorok átlaga → 1 neuron. Nincs LN a beágyazás után és a végén." },
    bert: { name: "BERT-base", arch: "enc", norm: "post", d: 768, h: 12, N: 12, V: 30522, nmax: 512, ff: 3072, pos: "learned", seg: true, embLN: true, finalLN: false, head: "pooler",
      note: "Devlin és mtsai (2018) „110 millió” paramétert közöltek. Benne van a 2 × d-s szegmenstábla, a beágyazás utáni LN és a [CLS]-pooler; a finomhangolt osztályozó nincs." },
    gpt2s: { name: "GPT-2 small", arch: "dec", norm: "pre", d: 768, h: 12, N: 12, V: 50257, nmax: 1024, ff: 3072, pos: "learned", seg: false, embLN: false, finalLN: true, head: "tied",
      note: "A kimeneti réteg a tokenbeágyazás mátrixát használja újra (súlymegosztás), ezért nincs külön V × d mátrix. A cikkben még 117 millió szerepelt, a kiadott modell 124 milliós." },
    gpt2xl: { name: "GPT-2 XL", arch: "dec", norm: "pre", d: 1600, h: 25, N: 48, V: 50257, nmax: 1024, ff: 6400, pos: "learned", seg: false, embLN: false, finalLN: true, head: "tied",
      note: "A legnagyobb GPT-2 (közölt szám: 1,5 milliárd). 48 blokk, 25 fej, d_k = 64." },
    gpt3: { name: "GPT-3", arch: "dec", norm: "pre", d: 12288, h: 96, N: 96, V: 50257, nmax: 2048, ff: 49152, pos: "learned", seg: false, embLN: false, finalLN: true, head: "tied",
      note: "Brown és mtsai (2020) kerekítve 175 milliárd paramétert közöltek; a képletünk 174,6 milliárdot ad. A paraméterek 99,6%-a a blokkokban van." }
  };

  function w3Params(s) {
    const { d, N, V, nmax, ff } = s;
    const att = 4 * d * d + 4 * d, ffn = 2 * d * ff + ff + d, ln = 4 * d, block = att + ffn + ln;
    const tokE = V * d, posE = s.pos === "learned" ? nmax * d : 0, segE = s.seg ? 2 * d : 0, embLN = s.embLN ? 2 * d : 0;
    const finalLN = s.finalLN ? 2 * d : 0;
    const headP = s.arch === "enc" ? (s.head === "pooler" ? d * d + d : d + 1) : (s.head === "untied" ? V * d : 0);
    const emb = tokE + posE + segE + embLN;
    return { att, ffn, ln, block, tokE, posE, segE, embLN, finalLN, headP, emb, blocks: N * block, total: emb + N * block + finalLN + headP };
  }

  /* a komponensek magyarázata (a kattintható panelhez) */
  function w3Info(id, s, P) {
    const { d, h: H, N, V, nmax, ff } = s, dk = d / H, dec = s.arch === "dec";
    const dkTxt = Number.isInteger(dk) ? w3Int(dk) : fmt(dk, 2) + " (⚠ nem egész: d legyen h többszöröse)";
    const ffF = ff === 4 * d ? "2·d·d_ff + d_ff + d = 8d² + 5d" : "2·d·d_ff + d_ff + d";
    const I = {
      tok: { t: "Tokenek", x: "A bemenet n darab token azonosítója: egész szám 0 és V − 1 között. A tokenizáló bontja a szöveget szavakra vagy szódarabokra; a szótár mérete itt V = " + w3Int(V) + ". A kontextus legfeljebb n_max = " + w3Int(nmax) + " token hosszú.",
        sh: "n egész szám (n ≤ " + w3Int(nmax) + ")", f: "0 (ez még csak bemenet)", v: 0, L: [["#s121-a", "12.1-a tokenek"]] },
      emb: { t: "Tokenbeágyazás", x: "Egy V × d táblázat: minden tokenhez egy tanult, d dimenziós sor tartozik. A számolás csak sorkiválasztás (a one-hot vektor szorzása a mátrixszal)." +
        (s.seg ? " BERT-nél egy 2 × d-s szegmenstáblát is hozzáadunk: melyik mondatból jön a token." : "") + (dec && s.head === "tied" ? " A GPT-2 ugyanezt a mátrixot használja a kimeneti rétegben is." : ""),
        sh: "n × d = n × " + w3Int(d), f: "V·d" + (s.seg ? " + 2·d (szegmens)" : "") + " = " + w3Int(V) + "·" + w3Int(d) + (s.seg ? " + 2·" + w3Int(d) : ""), v: P.tokE + P.segE, L: [["#s122-a", "12.2-a one-hot"], ["#s122-b", "12.2-b sűrű vektorok"]] },
      pos: { t: "Pozíciókódolás (+ összeadás)", x: "Az önfigyelem a sorrendre vak: ha összekevered a tokeneket, ugyanazokat a vektorokat kapod, csak más sorrendben. Ezért minden pozícióhoz hozzáadunk egy vektort. " +
        (s.pos === "learned" ? "Itt ez egy tanult n_max × d táblázat (BERT, GPT-2, a kísérletünk). Az eredeti 2017-es modell rögzített szinuszos kódot használt (0 paraméter), a mai LLM-ek többnyire forgatásosat (RoPE)." : "Itt rögzített szinuszos kód: nincs mit tanulni, 0 paraméter."),
        sh: "n × d (a tokenbeágyazással azonos alakú, összeadjuk)", f: s.pos === "learned" ? "n_max·d = " + w3Int(nmax) + "·" + w3Int(d) : "0 (szinuszos)", v: P.posE, L: [["#s125-c", "12.5-c pozíciókódolás"]] },
      embln: { t: "Rétegnormalizálás a beágyazás után", x: "BERT a beágyazások összege után még egyszer normalizál: tokenenként 0 átlagra és 1 szórásra hozza a d számot, majd tanult γ-val skáláz és β-val tol.",
        sh: "n × d", f: "2·d (γ és β)", v: P.embLN, L: [["#s126-a", "12.6-a rétegnormalizálás"]] },
      attn: { t: dec ? "Maszkolt többfejű önfigyelem" : "Többfejű önfigyelem", x: "Minden token a többiből gyűjt információt: Q = XW_Q, K = XW_K, V = XW_V, majd softmax(QKᵀ/√d_k)·V. " +
        `h = ${H} fej dolgozik párhuzamosan, mindegyik d_k = d/h = ${dkTxt} dimenzióban; a fejek kimenetét összefűzzük, és W_O visszavetíti d-re. A paraméterszám nem függ h-tól: h fej · 3·d·d_k = 3d².` +
        (dec ? " A maszk miatt a t-edik token csak az 1…t pozíciókra figyelhet, a jövőre nem: így tanítható a következő token jóslására." : " Enkóderben nincs maszk: minden token az egész mondatot látja, előre és hátra is."),
        sh: `be/ki: n × ${w3Int(d)}; fejenként Q, K, V: n × ${dkTxt}; súlyok: ${H} × n × n`, f: "4·(d·d + d) = 4d² + 4d  (W_Q, W_K, W_V, W_O + eltolások)", v: P.att,
        L: dec ? [["#s125-a", "12.5-a Q, K, V"], ["#s125-c", "12.5-c több fej"], ["#s126-b", "12.6-b maszkolt figyelem"]] : [["#s125-a", "12.5-a Q, K, V"], ["#s125-b", "12.5-b mátrixalak, √d"], ["#s125-c", "12.5-c több fej"]] },
      addnorm: { t: "Összeadás + rétegnormalizálás", x: "Maradék (reziduális) kapcsolat: a részréteg bemenetét hozzáadjuk a kimenetéhez (x + F(x)), így a gradiens a kerülőúton akadály nélkül jut vissza a mély hálóban. " +
        "Utána rétegnormalizálás: tokenenként 0 átlag, 1 szórás, majd tanult γ, β. Utó-normalizálás: x ← LN(x + F(x)).",
        sh: "n × d", f: "2·d (γ és β; az összeadás ingyen van)", v: 2 * d, L: [["#s126-a", "12.6-a maradék és LN"]] },
      ln: { t: "Rétegnormalizálás (elő-normalizálás)", x: "Elő-normalizálásnál a részréteg a normalizált x-et kapja, a maradékút viszont a normalizálatlan x-et viszi tovább: x ← x + F(LN(x)). " +
        "A „főút” így tiszta összeadások sora, ezért mély hálóban stabilabb a tanítás (GPT-2-től ez a szokásos).",
        sh: "n × d", f: "2·d (γ és β)", v: 2 * d, L: [["#s126-a", "12.6-a maradék és LN"]] },
      add: { t: "Összeadás (maradék kapcsolat)", x: "Itt találkozik a kerülőút (a részréteg bemenete) és a részréteg kimenete: x + F(…). Ha F semmit sem tanult, a jel akkor is változatlanul átjut – " +
        "ezért lehet sok blokkot egymásra tenni. A gradiens is ezen az úton jut vissza.",
        sh: "n × d", f: "0", v: 0, L: [["#s126-a", "12.6-a maradék kapcsolat"]] },
      ffn: { t: "Előrecsatolt háló (FFN)", x: `Tokenenként, egymástól függetlenül ugyanaz a kétrétegű háló: d → d_ff → d (itt ${w3Int(d)} → ${w3Int(ff)} → ${w3Int(d)}), közte ReLU (GPT-ben GELU). ` +
        "A figyelem a tokenek között keveri az információt, az FFN a tokenen belül dolgozza fel. Ha d_ff = 4d, egy blokk paramétereinek kétharmada itt van.",
        sh: `n × ${w3Int(d)} → n × ${w3Int(ff)} → n × ${w3Int(d)}`, f: ffF, v: P.ffn, L: [["#s126-a", "12.6-a a blokk"]] },
      finalln: { t: "Záró rétegnormalizálás", x: "Elő-normalizálásnál az utolsó blokk kimenete normalizálatlan (a főúton csak összeadás van), ezért a kimeneti réteg előtt még egy LN jön (GPT-2).",
        sh: "n × d", f: "2·d", v: P.finalLN, L: [["#s126-a", "12.6-a rétegnormalizálás"]] },
      vecs: { t: "Kimenet: vektor tokenenként", x: "Az enkóder minden tokenhez egy d dimenziós, a környezetet is figyelembe vevő vektort ad: a „bank” vektora más a „folyóparti bank” és a „bank számla” mondatban. " +
        "Osztályozáshoz ebből egyetlen vektort csinálunk: a [CLS] token vektorát vesszük, vagy átlagolunk.",
        sh: "n × d", f: "0", v: 0, L: [["#s126-c", "12.6-c BERT és GPT"]] },
      out: { t: "Következő token", x: "A dekóder az utolsó pozíció eloszlásából választ (mintavételezéssel vagy a legvalószínűbbet), hozzáfűzi a szöveghez, és az egészet újra átküldi a hálón: így generál tokenről tokenre (autoregresszív).",
        sh: "1 token", f: "0", v: 0, L: [["#s126-c", "12.6-c BERT és GPT"]] }
    };
    if (id === "head") {
      if (!dec && s.head === "mean1") return { t: "Átlagolás → 1 kimeneti neuron", x: "A kísérletünkben a tokenek kimeneti vektorait átlagoljuk (n × d → d), majd egyetlen neuron ad logitot; szigmoid után ez a p(pozitív).",
        sh: "n × d → d → 1", f: "d + 1 (súlyok + eltolás)", v: P.headP, L: [["#s128-a", "12.8-a kísérlet"]] };
      if (!dec) return { t: "[CLS] → pooler → osztályozó", x: "BERT a mondat elejére egy [CLS] tokent tesz; ennek kimeneti vektora megy át a pooler rétegen (d × d mátrix, tanh). Erre jön a feladatfüggő osztályozó, amit csak a finomhangoláskor tanítunk – ezt az összeg nem tartalmazza.",
        sh: "d → d → (osztályok)", f: "d·d + d (pooler)", v: P.headP, L: [["#s126-c", "12.6-c BERT és GPT"]] };
      return { t: "Lineáris réteg + softmax a szótár fölött", x: "Minden pozíció vektorát (d) a szótár minden tokenjének vektorával pontszorozzuk: V darab logit, softmax → a következő token eloszlása. " +
        (s.head === "tied" ? "GPT-2-ben ez a mátrix ugyanaz, mint a tokenbeágyazás (súlymegosztás), ezért 0 új paraméter." : "Itt külön kimeneti mátrixot tanítunk (nincs súlymegosztás)."),
        sh: `n × ${w3Int(d)} → n × ${w3Int(V)}`, f: s.head === "tied" ? "0 (súlymegosztás a tokenbeágyazással)" : "V·d", v: P.headP, L: [["#s126-c", "12.6-c BERT és GPT"], ["#s126-b", "12.6-b maszkolás"]] };
    }
    return I[id];
  }

  W["transformer-block"] = root => {
    header(root, "A Transformer felépítése – kattints a dobozokra",
      "Alulról felfelé halad a jel. Válts enkóder (BERT-szerű) és dekóder (GPT-szerű) között, illetve utó- és elő-normalizálás között. " +
      "Kattints bármelyik dobozra (vagy a zöld kerülőútra): jobbra / lent látod, mit csinál, milyen alakú a tenzor, és hány paramétere van. " +
      "Válassz kész modellt, vagy írd át a méreteket – a csík megmutatja, hol van a paraméterek zöme.");
    const uid = "w3m" + Math.random().toString(36).slice(2, 8);
    let s = Object.assign({}, W3_PRESETS.exp), preset = "exp", sel = "attn";
    let headMem = { enc: s.head, dec: "tied" };
    const pg = toggleGroup(Object.entries(W3_PRESETS).map(([k, p]) => [k, p.name]), () => preset, k => { preset = k; s = Object.assign({}, W3_PRESETS[k]); headMem[s.arch] = s.head; syncInputs(); draw(); });
    const ag = toggleGroup([["enc", "enkóder (BERT-szerű)"], ["dec", "dekóder (GPT-szerű)"]], () => s.arch, k => {
      if (k === s.arch) return; headMem[s.arch] = s.head; s.arch = k; s.head = headMem[k] || (k === "dec" ? "tied" : "mean1");
      if (k === "dec") s.seg = false;
      if (sel === "vecs" || sel === "out") sel = "head";
      preset = null; syncInputs(); draw();
    });
    const ng = toggleGroup([["post", "utó-normalizálás (2017, BERT)"], ["pre", "elő-normalizálás (GPT-2-től, mai LLM-ek)"]], () => s.norm, k => {
      if (k === s.norm) return; s.norm = k; s.finalLN = k === "pre"; if (k === "pre") s.embLN = false;
      if (["addnorm", "ln", "add"].includes(sel)) sel = k === "pre" ? "ln" : "addnorm";
      if (sel === "finalln" && k === "post") sel = "head";
      preset = null; syncInputs(); draw();
    });
    const normEq = h("span", { class: "muted", style: "font-family:var(--mono);font-size:.88rem" });
    root.append(h("div", { class: "controls" }, small("kész modell:"), pg.bs),
      h("div", { class: "controls" }, ag.bs), h("div", { class: "controls" }, ng.bs, normEq));

    /* méretek */
    const fields = [["d", "d (modelldimenzió)", 1, 65536], ["h", "h (fejek)", 1, 512], ["N", "N (blokkok)", 1, 500], ["V", "V (szótár)", 1, 1e6], ["nmax", "n_max (kontextus)", 1, 1e6], ["ff", "d_ff (FFN)", 1, 1e6]];
    const inp = {};
    const sizeRow = h("div", { class: "controls" });
    fields.forEach(([k, lab, mn, mx]) => {
      const e = h("input", { type: "number", min: mn, max: mx, step: 1 });
      e.style.width = k === "V" || k === "nmax" || k === "ff" ? "6.4em" : "5.2em";
      e.addEventListener("input", () => {
        const v = Math.round(+e.value);
        if (!Number.isFinite(v) || v < mn || v > mx) return;
        if (k === "d" && s.ff === 4 * s.d) s.ff = 4 * v;          // ha eddig d_ff = 4d volt, maradjon az
        s[k] = v; preset = null; syncInputs(e); draw();
      });
      inp[k] = e;
      sizeRow.append(h("label", null, lab, e));
    });
    const b4d = btn("d_ff = 4d", () => { s.ff = 4 * s.d; preset = null; syncInputs(); draw(); });
    sizeRow.append(b4d);
    root.append(sizeRow);

    /* további szerkezeti beállítások */
    const cPos = checkbox(true, () => { s.pos = cPos.checked ? "learned" : "sin"; preset = null; draw(); });
    const cSeg = checkbox(false, () => { s.seg = cSeg.checked; preset = null; draw(); });
    const cEmbLN = checkbox(false, () => { s.embLN = cEmbLN.checked; preset = null; draw(); });
    const cFinal = checkbox(false, () => { s.finalLN = cFinal.checked; preset = null; draw(); });
    const sHead = h("select");
    sHead.addEventListener("change", () => { s.head = sHead.value; headMem[s.arch] = s.head; preset = null; draw(); });
    const more = h("details", { style: "margin:.2rem 0 .6rem;font-size:.92rem" }, h("summary", { style: "cursor:pointer;color:var(--muted)" }, "további beállítások (pozíció, szegmens, LN, kimeneti fej)"),
      h("div", { class: "controls" }, h("label", null, cPos, "tanult pozícióbeágyazás"), h("label", null, cSeg, "szegmensbeágyazás (BERT)"),
        h("label", null, cEmbLN, "LN a beágyazás után"), h("label", null, cFinal, "záró LN"), h("label", null, "kimeneti fej:", sHead)));
    root.append(more);

    const wrap = h("div", { class: "two-canvas", style: "align-items:start" });
    const svgBox = h("div", { style: "min-width:0;max-width:380px;width:100%;justify-self:center" }), panel = h("div", { style: "min-width:0" });
    wrap.append(svgBox, panel); root.append(wrap);
    const tot = h("div", { class: "readout" }), bar = h("div", { style: "margin-top:.6rem" });
    root.append(tot, bar);

    function syncInputs(except) {
      fields.forEach(([k]) => { if (inp[k] !== except) inp[k].value = s[k]; });
      cPos.checked = s.pos === "learned"; cSeg.checked = s.seg; cEmbLN.checked = s.embLN; cFinal.checked = s.finalLN;
      cSeg.disabled = s.arch === "dec";
      const opts = s.arch === "enc" ? [["mean1", "átlag → 1 neuron (a kísérletünk)"], ["pooler", "[CLS] + pooler (BERT)"]]
        : [["tied", "kötött: = tokenbeágyazás (GPT-2)"], ["untied", "külön V × d mátrix"]];
      sHead.replaceChildren(...opts.map(([v, t]) => h("option", { value: v }, t)));
      sHead.value = s.head;
    }

    /* ---------- az ábra ---------- */
    const X0 = 70, X1 = 282, CX = 176, LANE = 312, BH = 38, GAP = 22, CR = 10, VW = 340;
    const colOf = { tok: "--muted", emb: "--setA", pos: "--setA", embln: "--setC", attn: "--accent", addnorm: "--setC", ln: "--setC", ffn: "--setB", finalln: "--setC", head: "--muted", vecs: "--muted", out: "--muted", add: "--setC" };
    function draw() {
      pg.paint(); ag.paint(); ng.paint();
      normEq.textContent = s.norm === "post" ? "x ← LN(x + F(x))" : "x ← x + F(LN(x))";
      const P = w3Params(s), dec = s.arch === "dec";
      const sub = {
        tok: `n ≤ ${w3Int(s.nmax)} azonosító`, emb: (s.seg ? "V·d + 2d = " : "V·d = ") + w3Short(P.tokE + P.segE), pos: s.pos === "learned" ? "n_max·d = " + w3Short(P.posE) : "szinuszos: 0",
        embln: "2d = " + w3Short(2 * s.d), attn: "4d² + 4d = " + w3Short(P.att), addnorm: "2d = " + w3Short(2 * s.d), ln: "2d = " + w3Short(2 * s.d),
        ffn: (s.ff === 4 * s.d ? "8d² + 5d = " : "2d·d_ff + d_ff + d = ") + w3Short(P.ffn), finalln: "2d = " + w3Short(2 * s.d),
        head: dec ? (s.head === "tied" ? "kötött: 0 új paraméter" : "V·d = " + w3Short(P.headP)) : (s.head === "pooler" ? "d² + d = " + w3Short(P.headP) : "d + 1 = " + w3Short(P.headP)),
        vecs: "n × d", out: "mintavétel, hozzáfűzés"
      };
      const name = {
        tok: "tokenek", emb: "tokenbeágyazás", pos: "pozíciókódolás", embln: "rétegnormalizálás", attn: dec ? "maszkolt többfejű önfigyelem" : "többfejű önfigyelem",
        addnorm: "összeadás + rétegnormalizálás", ln: "rétegnormalizálás", ffn: "előrecsatolt háló (FFN)", finalln: "záró rétegnormalizálás",
        head: dec ? "lineáris + softmax (V)" : (s.head === "pooler" ? "[CLS] → pooler → osztályozó" : "átlag → 1 neuron → szigmoid"),
        vecs: "kontextuális vektor tokenenként", out: "következő token"
      };
      /* elemek alulról felfelé; y = távolság az aljától */
      const els = [], res = [];
      let y = 12;
      const box = (id, x0 = X0, x1 = X1) => { const e = { k: "box", id, x0, x1, yb: y, yt: y + BH }; els.push(e); y += BH + GAP; return e; };
      const add = id => { const e = { k: "add", id, yb: y, yt: y + 2 * CR }; els.push(e); y += 2 * CR + GAP; return e; };
      box("tok");
      const half = (X1 - X0 - 10) / 2;
      const eE = { k: "box", id: "emb", x0: X0, x1: X0 + half, yb: y, yt: y + BH }, eP = { k: "box", id: "pos", x0: X1 - half, x1: X1, yb: y, yt: y + BH };
      els.push(eE, eP); y += BH + GAP;
      const posAdd = add("pos");
      if (s.embLN) box("embln");
      const blockStart = y;
      if (s.norm === "post") {
        res.push({ from: y - GAP / 2 }); box("attn"); const a1 = box("addnorm"); res[0].to = a1;
        res.push({ from: y - GAP / 2 }); box("ffn"); const a2 = box("addnorm"); res[1].to = a2;
      } else {
        res.push({ from: y - GAP / 2 }); box("ln"); box("attn"); const a1 = add("add"); res[0].to = a1;
        res.push({ from: y - GAP / 2 }); box("ln"); box("ffn"); const a2 = add("add"); res[1].to = a2;
      }
      const blockEnd = y - GAP;
      if (s.finalLN) box("finalln");
      if (dec) { box("head"); box("out"); } else { box("vecs"); box("head"); }
      const HH = y - GAP + 12, Y = v => HH - v;
      const svg = w3S("svg", { viewBox: `0 0 ${VW} ${HH}`, width: "100%", role: "img", "aria-label": "A Transformer blokkdiagramja", style: "display:block;font-family:var(--font);user-select:none" });
      svg.append(w3S("defs", null,
        w3S("marker", { id: uid + "a", viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: "auto-start-reverse" }, w3S("path", { d: "M0,0 L10,5 L0,10 z", style: "fill:var(--muted)" })),
        w3S("marker", { id: uid + "r", viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: "auto-start-reverse" }, w3S("path", { d: "M0,0 L10,5 L0,10 z", style: "fill:var(--setC)" }))));
      /* blokk-keret */
      const fy0 = Y(blockEnd + 9), fy1 = Y(blockStart - 17);
      svg.append(w3S("rect", { x: X0 - 26, y: fy0, width: LANE + 16 - (X0 - 26), height: fy1 - fy0, rx: 10, style: "fill:color-mix(in srgb, var(--bg-soft) 70%, transparent);stroke:var(--border);stroke-width:1.5;stroke-dasharray:5 4" }));
      const midY = (fy0 + fy1) / 2;
      svg.append(w3S("text", { x: X0 - 12, y: midY, transform: `rotate(-90 ${X0 - 12} ${midY})`, "text-anchor": "middle", style: "font-size:12px;font-weight:700;fill:var(--muted)" }, `blokk × ${s.N}`));
      /* főút nyilai */
      const line = (x0, y0, x1, y1, col = "var(--muted)", mk = "a") => svg.append(w3S("line", { x1: x0, y1: y0, x2: x1, y2: y1, "marker-end": `url(#${uid}${mk})`, style: `stroke:${col};stroke-width:1.6` }));
      const main = els.filter(e => e !== eE && e !== eP);
      for (let i = 0; i + 1 < main.length; i++) {
        const a = main[i], b = main[i + 1];
        if (a.id === "tok") { line(CX - 30, Y(a.yt), (eE.x0 + eE.x1) / 2, Y(eE.yb)); line(CX + 30, Y(a.yt), (eP.x0 + eP.x1) / 2, Y(eP.yb)); continue; }
        line(CX, Y(a.yt), CX, Y(b.yb) + 1);
      }
      line((eE.x0 + eE.x1) / 2, Y(eE.yt), CX - CR, Y(posAdd.yb + CR));
      line((eP.x0 + eP.x1) / 2, Y(eP.yt), CX + CR, Y(posAdd.yb + CR));
      /* maradék kapcsolatok */
      res.forEach(r => {
        const yb = Y(r.from), yt = Y((r.to.yb + r.to.yt) / 2), xe = r.to.k === "add" ? CX + CR : X1;
        const d = `M${CX},${yb} H${LANE} V${yt} H${xe + 1}`;
        const g = w3S("g", { style: "cursor:pointer", onclick: () => { sel = "res"; draw(); } });
        g.append(w3S("path", { d, style: `fill:none;stroke:var(--setC);stroke-width:${sel === "res" ? 3.2 : 2}`, "marker-end": `url(#${uid}r)` }),
          w3S("path", { d, style: "fill:none;stroke:transparent;stroke-width:14" }),
          w3S("circle", { cx: CX, cy: yb, r: 3.2, style: "fill:var(--setC)" }));
        svg.append(g);
        const my = (yb + yt) / 2;
        svg.append(w3S("text", { x: LANE + 11, y: my, transform: `rotate(90 ${LANE + 11} ${my})`, "text-anchor": "middle", style: "font-size:10.5px;fill:var(--setC);font-weight:600;pointer-events:none" }, "maradék"));
      });
      /* dobozok és összeadó csomópontok */
      els.forEach(e => {
        const isSel = sel === e.id || (sel === "res" && e.k === "add");
        const g = w3S("g", { style: "cursor:pointer", tabindex: 0, role: "button", onclick: () => { sel = e.id; draw(); },
          onkeydown: ev => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); sel = e.id; draw(); } } });
        if (e.k === "add") {
          const cy = Y(e.yb + CR);
          g.append(w3S("circle", { cx: CX, cy, r: CR, style: `fill:var(--card);stroke:var(${e.id === "pos" ? "--setA" : "--setC"});stroke-width:${isSel ? 3 : 1.8}` }),
            w3S("path", { d: `M${CX - 5.5},${cy} H${CX + 5.5} M${CX},${cy - 5.5} V${cy + 5.5}`, style: "stroke:var(--text);stroke-width:1.8" }));
        } else {
          const c = colOf[e.id], narrow = e.x1 - e.x0 < 150, tx = (e.x0 + e.x1) / 2;
          g.append(w3S("rect", { x: e.x0, y: Y(e.yt), width: e.x1 - e.x0, height: BH, rx: 8,
            style: `fill:color-mix(in srgb, var(${c}) ${isSel ? 30 : 13}%, var(--card));stroke:${isSel ? "var(--text)" : `var(${c})`};stroke-width:${isSel ? 2.4 : 1.4}` }),
            w3S("text", { x: tx, y: Y(e.yt) + 16, "text-anchor": "middle", style: `font-size:${narrow ? 11 : 12}px;font-weight:600;fill:var(--text)` }, name[e.id]),
            w3S("text", { x: tx, y: Y(e.yt) + 30, "text-anchor": "middle", style: `font-size:${narrow ? 9.5 : 10}px;fill:var(--muted)` }, sub[e.id]));
        }
        svg.append(g);
      });
      svgBox.replaceChildren(svg);
      showPanel(P);
      showTotals(P);
    }

    function showPanel(P) {
      let I;
      if (sel === "res") I = { t: "Maradék (reziduális) kapcsolat", x: "A zöld kerülőút a részréteg (figyelem vagy FFN) bemenetét változtatás nélkül viszi át, és hozzáadja a kimenethez: x + F(x). " +
        "Így a blokk csak a „javítást” tanulja meg, és a gradiens akadály nélkül jut vissza a legalsó rétegekig. " +
        (s.norm === "post" ? "Utó-normalizálásnál az összeg után jön az LN: x ← LN(x + F(x))." : "Elő-normalizálásnál a kerülőúton nincs LN, csak a részréteg előtt: x ← x + F(LN(x))."),
        sh: "n × d (az összeadáshoz a két ágnak azonos alakúnak kell lennie)", f: "0", v: 0, L: [["#s126-a", "12.6-a maradék kapcsolat"]] };
      else I = w3Info(sel, s, P);
      const inBlock = ["attn", "addnorm", "ln", "add", "ffn"].includes(sel) || sel === "res";
      panel.replaceChildren(
        h("div", { style: "font-weight:700;margin-bottom:.25rem" }, I.t),
        h("p", { style: "margin:.2rem 0 .5rem;font-size:.95rem" }, I.x),
        h("div", { class: "readout", style: "margin-top:0" },
          h("div", null, h("span", { class: "muted" }, "alak: "), I.sh),
          h("div", null, h("span", { class: "muted" }, "paraméter: "), I.f),
          h("div", null, h("span", { class: "muted" }, "most: "), h("b", null, w3Int(I.v)), inBlock && I.v ? h("span", { class: "muted" }, ` (blokkonként; × ${s.N} blokk = ${w3Int(I.v * s.N)})`) : null)),
        h("div", { style: "margin-top:.45rem;font-size:.9rem" }, "Bővebben: ", ...I.L.flatMap(([href, t], i) => [i ? " · " : "", h("a", { href }, t)])));
    }

    function showTotals(P) {
      const p = preset ? W3_PRESETS[preset] : null, dk = s.d / s.h;
      const blockF = s.ff === 4 * s.d ? `12d² + 13d = ${w3Int(P.block)}` : `4d² + 4d + 2d·d_ff + d_ff + d + 4d = ${w3Int(P.block)}`;
      tot.innerHTML = `összesen: <b>${w3Int(P.total)}</b> paraméter` + (P.total >= 1e6 ? ` (≈ ${w3Big(P.total)})` : "") + "<br>" +
        `egy blokk: ${blockF} &nbsp;(figyelem 4d² + 4d = ${w3Int(P.att)}, FFN ${w3Int(P.ffn)}, 2 LN 4d = ${w3Int(P.ln)})<br>` +
        `fejenként d_k = d/h = ${Number.isInteger(dk) ? w3Int(dk) : `<span style="color:var(--bad)">${fmt(dk, 2)} ⚠ d legyen h többszöröse</span>`}` +
        (p ? `<br><span class="muted">${p.note}</span>` : `<br><span class="muted">egyedi beállítás</span>`);
      const parts = [["beágyazások", P.emb, "--setA"], ["figyelem (blokkok)", s.N * P.att, "--accent"], ["FFN (blokkok)", s.N * P.ffn, "--setB"],
        ["LN (blokkok)", s.N * P.ln, "--setC"], ["fej" + (P.finalLN ? " + záró LN" : ""), P.headP + P.finalLN, "--muted"]];
      const T = P.total || 1;
      bar.replaceChildren(
        h("div", { style: "display:flex;height:18px;border-radius:6px;overflow:hidden;border:1px solid var(--border)" },
          parts.filter(q => q[1] > 0).map(([n, v, c]) => h("div", { title: `${n}: ${w3Int(v)}`, style: `width:${(100 * v / T).toFixed(3)}%;min-width:2px;background:var(${c})` }))),
        h("div", { style: "display:flex;flex-wrap:wrap;gap:.2rem 1rem;margin-top:.35rem;font-size:.85rem" },
          parts.map(([n, v, c]) => h("span", { style: "display:inline-flex;align-items:center;gap:.3rem;white-space:nowrap" },
            h("span", { style: `width:.75rem;height:.75rem;border-radius:3px;background:var(${c});display:inline-block` }), n + ": ",
            h("b", { style: "font-family:var(--mono)" }, w3Short(v)), h("span", { class: "muted" }, ` (${v / T < 0.0005 && v > 0 ? "<0,1" : fmt(100 * v / T, 1)}%)`)))));
    }
    syncInputs(); draw();
  };

  /* ==================================================================
     12.8-a  review-lab – hat modell a mesterséges filmkritikákon
     ================================================================== */
  const W3_SUBJ = ["film", "zene", "történet", "vége", "látvány", "rendezés"];
  const W3_POS = ["jó", "izgalmas", "szép", "eredeti", "remek"], W3_NEG = ["rossz", "unalmas", "gyenge", "zavaros", "fárasztó"];
  const W3_INTP = ["nagyon", "elég", "igazán"], W3_INTN = ["túl", "igazán", "eléggé"];
  const W3_NAMES = { bow1: "szózsák", bow2: "szózsák + szópárok", avg: "átlagolt beágyazás", rnn: "RNN", tf_nopos: "Transformer pozíció nélkül", tf: "Transformer" };
  const W3_ACC = { bow1: [51.2, 54.9, 51.1, 51.3], bow2: [93.5, 100, 100, 86.7], avg: [63.5, 100, 74.7, 51.2], rnn: [100, 100, 100, 100], tf_nopos: [62.5, 98.0, 74.6, 49.5], tf: [99.9, 100, 99.9, 100] };
  const W3_KEYS = ["bow1", "bow2", "avg", "rnn", "tf_nopos", "tf"];
  const w3Clause = c => (c.neg ? ["a", c.s, "nem", "volt", ...(c.i ? [c.i] : []), c.adj] : ["a", c.s, ...(c.i ? [c.i] : []), c.adj, "volt"]);
  const w3Pol = c => (W3_POS.includes(c.adj) ? 1 : -1) * (c.neg ? -1 : 1);
  const w3Tokens = st => (st.conn ? w3Clause(st.c1).concat([",", st.conn], w3Clause(st.c2)) : w3Clause(st.c1));
  const w3Pick = a => a[Math.floor(Math.random() * a.length)];
  function w3RandClause(pol, avoid) {
    for (;;) {
      const s = w3Pick(W3_SUBJ.filter(x => x !== avoid)), neg = Math.random() < 0.5, adjPos = Math.random() < 0.5;
      const adj = w3Pick(adjPos ? W3_POS : W3_NEG), c = { s, neg, adj, i: "" };
      if (pol != null && w3Pol(c) !== pol) continue;
      if (Math.random() < 0.5) c.i = w3Pick(neg ? W3_INTN : W3_INTP);
      return c;
    }
  }
  function w3RandReview() {
    const r = Math.random(), k = r < 0.4 ? "" : r < 0.7 ? "de" : "és", c1 = w3RandClause();
    return { c1, conn: k, c2: k ? w3RandClause(k === "de" ? -w3Pol(c1) : w3Pol(c1), c1.s) : w3RandClause(-w3Pol(c1), c1.s) };
  }
  /* a szabály szerinti címke: +1 / −1 / null (ha „és” ellentétes tagmondatokat köt) */
  function w3Rule(st) {
    const p1 = w3Pol(st.c1);
    if (!st.conn) return p1;
    const p2 = w3Pol(st.c2);
    return st.conn === "de" ? p2 : (p1 === p2 ? p1 : null);
  }

  /* --- a hat modell előreterjesztése (a PyTorch / scikit-learn modellek pontos másolata) --- */
  const w3Lin = (Wm, b, x) => Wm.map((row, i) => row.reduce((acc, w, j) => acc + w * x[j], b ? b[i] : 0));
  function w3LN(x, g, b) {
    const n = x.length, m = x.reduce((a, v) => a + v, 0) / n, v = x.reduce((a, u) => a + (u - m) * (u - m), 0) / n, sd = Math.sqrt(v + 1e-5);
    return x.map((u, i) => ((u - m) / sd) * g[i] + b[i]);
  }
  const w3Sig = z => 1 / (1 + Math.exp(-z));
  const w3Pct = p => (p < 0.0005 ? "< 0,1%" : p > 0.9995 ? "> 99,9%" : (100 * p).toFixed(1).replace(".", ",") + "%");
  function w3Models(R) {
    const ix = Object.fromEntries(R.vocab.map((w, i) => [w, i]));
    const wmap = {};
    ["bow1", "bow2"].forEach(k => { wmap[k] = new Map(R[k].feats.map((f, i) => [f, R[k].w[i]])); });
    function bow(k, toks) {
      const cnt = new Map(), add = f => cnt.set(f, (cnt.get(f) || 0) + 1);
      toks.forEach(add);
      if (k === "bow2") for (let i = 0; i + 1 < toks.length; i++) add(toks[i] + " " + toks[i + 1]);
      const contrib = [];
      let z = R[k].b;
      cnt.forEach((c, f) => { const w = wmap[k].get(f); if (w === undefined) return; z += c * w; contrib.push([f, c, w, c * w]); });
      return { logit: z, contrib };
    }
    function avg(toks) {
      const M = R.avg, E = M["E.weight"], d = E[0].length, e = new Array(d).fill(0);
      toks.forEach(t => E[ix[t]].forEach((v, j) => { e[j] += v / toks.length; }));
      const hh = w3Lin(M["f.0.weight"], M["f.0.bias"], e).map(v => Math.max(0, v));
      return { logit: w3Lin(M["f.2.weight"], M["f.2.bias"], hh)[0] };
    }
    function rnn(toks) {
      const M = R.rnn, E = M["E.weight"];
      let hh = new Array(M["W.weight"].length).fill(0);
      toks.forEach(t => {
        const u = w3Lin(M["U.weight"], M["U.bias"], E[ix[t]]), w = w3Lin(M["W.weight"], null, hh);
        hh = u.map((v, i) => Math.tanh(v + w[i]));
      });
      return { logit: w3Lin(M["o.weight"], M["o.bias"], hh)[0] };
    }
    function tf(k, toks) {
      const M = R[k], E = M["E.weight"], Pm = M["P.weight"], n = toks.length, d = E[0].length, H = 2, dh = d / H;
      let x = toks.map((t, p) => E[ix[t]].map((v, j) => v + (Pm ? Pm[p][j] : 0)));
      const Q = x.map(r => w3Lin(M["q.weight"], M["q.bias"], r)), K = x.map(r => w3Lin(M["k.weight"], M["k.bias"], r)), V = x.map(r => w3Lin(M["v.weight"], M["v.bias"], r));
      const att = [], cat = x.map(() => new Array(d).fill(0));
      for (let hd = 0; hd < H; hd++) {
        const o = hd * dh, A = [];
        for (let i = 0; i < n; i++) {
          const sc = [];
          for (let j = 0; j < n; j++) { let z = 0; for (let c = 0; c < dh; c++) z += Q[i][o + c] * K[j][o + c]; sc.push(z / Math.sqrt(dh)); }
          const a = softmax(sc); A.push(a);
          for (let j = 0; j < n; j++) for (let c = 0; c < dh; c++) cat[i][o + c] += a[j] * V[j][o + c];
        }
        att.push(A);
      }
      x = x.map((r, i) => { const oa = w3Lin(M["oa.weight"], M["oa.bias"], cat[i]); return w3LN(r.map((v, j) => v + oa[j]), M["ln1.weight"], M["ln1.bias"]); });
      x = x.map(r => {
        const hh = w3Lin(M["ff.0.weight"], M["ff.0.bias"], r).map(v => Math.max(0, v)), f = w3Lin(M["ff.2.weight"], M["ff.2.bias"], hh);
        return w3LN(r.map((v, j) => v + f[j]), M["ln2.weight"], M["ln2.bias"]);
      });
      const pooled = new Array(d).fill(0);
      x.forEach(r => r.forEach((v, j) => { pooled[j] += v / n; }));
      return { logit: w3Lin(M["o.weight"], M["o.bias"], pooled)[0], att };
    }
    const run = (k, toks) => (k === "bow1" || k === "bow2" ? bow(k, toks) : k === "avg" ? avg(toks) : k === "rnn" ? rnn(toks) : tf(k, toks));
    return { run, all: toks => Object.fromEntries(W3_KEYS.map(k => { const r = run(k, toks); r.p = w3Sig(r.logit); return [k, r]; })) };
  }

  W["review-lab"] = root => {
    header(root, "Hat modell, egy filmkritika",
      "Rakj össze egy kritikát a legördülőkből (vagy kérj véletlent), és nézd meg, mit mond rá a hat modell. A szabály: a tagmondat pozitív, ha a melléknév pozitív, " +
      "de a „nem” megfordítja; „de” után a második tagmondat dönt, „és” esetén a kettő egyezik. Próbáld ki a <b>tagmondatok cseréjét</b>: melyik modell veszi észre?");
    const R = window.REVIEW12;
    if (!R) { root.append(small("Hiányzik a review-models.js adatfájl.")); return; }
    const MD = w3Models(R);
    let st = { c1: { s: "film", neg: false, i: "", adj: "jó" }, conn: "de", c2: { s: "vége", neg: false, i: "", adj: "unalmas" } };
    let prev = null, panelKey = "att", attModel = "tf", head = 0, cell = null;

    /* --- a mondatszerkesztő --- */
    const opt = (v, t, sel) => { const o = h("option", { value: v }, t); if (sel) o.selected = true; return o; };
    function clauseRow(which) {
      const c = st[which], row = h("div", { class: "controls", style: "margin:.3rem 0" });
      const sS = h("select", { "aria-label": "alany" }, W3_SUBJ.map(x => opt(x, x, x === c.s)));
      const sF = h("select", { "aria-label": "alak" }, opt("p", "állító", !c.neg), opt("n", "tagadó (nem)", c.neg));
      const sI = h("select", { "aria-label": "fokozó" }, opt("", "–", !c.i), (c.neg ? W3_INTN : W3_INTP).map(x => opt(x, x, x === c.i)));
      const sA = h("select", { "aria-label": "melléknév" }, h("optgroup", { label: "pozitív" }, W3_POS.map(x => opt(x, x, x === c.adj))),
        h("optgroup", { label: "negatív" }, W3_NEG.map(x => opt(x, x, x === c.adj))));
      sS.addEventListener("change", () => { c.s = sS.value; changed(); });
      sF.addEventListener("change", () => { c.neg = sF.value === "n"; if (c.i && !(c.neg ? W3_INTN : W3_INTP).includes(c.i)) c.i = ""; changed(true); });
      sI.addEventListener("change", () => { c.i = sI.value; changed(); });
      sA.addEventListener("change", () => { c.adj = sA.value; changed(); });
      row.append(h("span", { style: "font-weight:600;font-size:.92rem;min-width:6.6rem" }, which === "c1" ? "1. tagmondat:" : "2. tagmondat:"), h("span", { class: "muted" }, "a"), sS, sF, sI, sA);
      return row;
    }
    const ed = h("div"), sConn = h("select", { "aria-label": "kötőszó" }, opt("", "nincs (egy tagmondat)"), opt("de", "„, de”"), opt("és", "„, és”"));
    sConn.addEventListener("change", () => {
      const k = sConn.value;
      if (k && k !== st.conn) st.c2 = w3RandClause(k === "de" ? -w3Pol(st.c1) : w3Pol(st.c1), st.c1.s);
      st.conn = k; changed(true);
    });
    const bRand = btn("🎲 véletlen kritika", () => { st = w3RandReview(); changed(true); }, "btn primary");
    const bSwap = btn("⇄ a két tagmondat cseréje", () => {
      if (!st.conn) return;
      const before = res;
      [st.c1, st.c2] = [st.c2, st.c1]; changed(true);
      prev = before;
      paint();
    });
    const edConn = h("div", { class: "controls", style: "margin:.3rem 0" }, h("span", { style: "font-weight:600;font-size:.92rem;min-width:6.6rem" }, "kötőszó:"), sConn);
    root.append(ed, h("div", { class: "controls" }, bRand, bSwap));
    const chips = h("div", { style: "display:flex;flex-wrap:wrap;gap:.3rem;margin:.5rem 0 .3rem" });
    const ruleOut = h("div", { style: "font-size:.95rem" }), oodOut = h("div", { style: "font-size:.88rem;color:var(--bad);margin-top:.2rem" });
    const tblBox = h("div", { class: "tw", style: "overflow-x:auto;margin-top:.5rem" }), swapNote = h("div", { style: "font-size:.9rem;margin-top:.3rem" });
    root.append(chips, ruleOut, oodOut, tblBox, swapNote);

    /* --- a panel: figyelem / szózsák-súlyok --- */
    const pg = toggleGroup([["att", "Transformer figyelme"], ["bow1", "szózsák súlyai"], ["bow2", "szópárok súlyai"]], () => panelKey, k => { panelKey = k; cell = null; paintPanel(); });
    const mg = toggleGroup([["tf", "Transformer"], ["tf_nopos", "pozíció nélkül"]], () => attModel, k => { attModel = k; paintPanel(); });
    const hg = toggleGroup([["0", "1. fej"], ["1", "2. fej"]], () => head, k => { head = +k; paintPanel(); });
    const subCtl = h("div", { class: "controls" }, mg.bs, h("span", { style: "width:.4rem" }), hg.bs);
    const pBody = h("div"), pInfo = h("div", { class: "readout" });
    root.append(h("div", { style: "margin-top:1rem;padding-top:.6rem;border-top:1px solid var(--border)" }, h("div", { class: "controls" }, small("belenézés:"), pg.bs), subCtl, pBody, pInfo));

    /* --- pontossági táblázat --- */
    const accF = v => (v === 100 ? "100" : v.toFixed(1).replace(".", ","));
    const TH = "padding:.25rem .45rem;font-size:.8rem;white-space:nowrap", TD = "padding:.25rem .45rem;font-family:var(--mono);text-align:right;white-space:nowrap";
    root.append(h("div", { style: "font-weight:600;margin-top:1rem" }, "Pontosság a tesztmondatokon (%, 5 véletlen kezdés átlaga)"),
      h("div", { class: "tw", style: "overflow-x:auto" }, h("table", { style: "margin:.3rem 0;font-size:.86rem;width:100%" },
        h("thead", null, h("tr", null, h("th", { style: TH }, "modell"), h("th", { style: TH }, "paraméter"), h("th", { style: TH }, "összes"), h("th", { style: TH }, "egy tagmondat"),
          h("th", { style: TH }, "„és”"), h("th", { style: TH }, "„de”"))),
        h("tbody", null, W3_KEYS.map(k => h("tr", null, h("td", { style: "padding:.25rem .45rem" }, W3_NAMES[k]), h("td", { style: TD }, w3Int(R[k].nparams)),
          W3_ACC[k].map((v, j) => h("td", { style: TD + (v >= 99 ? ";color:var(--ok);font-weight:700" : v < 60 ? ";color:var(--bad)" : "") + (j === 0 ? ";font-weight:700" : "") }, accF(v)))))))),
      h("p", { class: "muted", style: "font-size:.85rem;margin:.3rem 0 0" },
        "Mesterséges nyelv, 3000 tanítómondat; a modelleket Pythonban (PyTorch, scikit-learn) tanítottuk, itt csak futnak. A fenti valószínűségeket az első (0. seedű) futás modelljei adják, " +
        "a táblázat 5 futás átlaga. Forrás: _parts/calc/c12_models.py, c12_export_models.py."));

    let res = null;
    function changed(rebuild) {
      prev = null; cell = null;
      if (rebuild !== false) buildEditor();
      res = MD.all(w3Tokens(st));
      paint();
    }
    function buildEditor() {
      sConn.value = st.conn;
      ed.replaceChildren(clauseRow("c1"), edConn, ...(st.conn ? [clauseRow("c2")] : []));
      setDis(bSwap, !st.conn);
    }
    const lab = p => (p > 0 ? "pozitív" : "negatív");
    const polCol = p => (p > 0 ? "var(--setB)" : "var(--setA)");
    function clauseExpl(c) {
      const a = W3_POS.includes(c.adj) ? 1 : -1;
      return `»${c.adj}« ${lab(a)}` + (c.neg ? ", de »nem« megfordítja" : "") + ` → <b style="color:${polCol(w3Pol(c))}">${lab(w3Pol(c))}</b>`;
    }
    function paint() {
      const toks = w3Tokens(st), n1 = w3Clause(st.c1).length, rule = w3Rule(st);
      chips.replaceChildren(...toks.map((t, i) => h("span", { class: "chip" + (i < n1 ? " a" : i >= n1 + 2 ? " b" : ""), style: "font-weight:500" }, t)));
      let ex = (st.conn ? "1. tagmondat: " : "") + clauseExpl(st.c1);
      if (st.conn) ex += "; 2. tagmondat: " + clauseExpl(st.c2) + (st.conn === "de" ? "; „de” után a második dönt" : rule == null ? "; „és”, de a két tagmondat ellentétes" : "; „és”: a kettő egyezik");
      ruleOut.innerHTML = `A szabály szerint: ${rule == null ? "<b>nincs egyértelmű címke</b>" : `<b style="color:${polCol(rule)}">${lab(rule)}</b>`} <span class="muted">(${ex})</span>`;
      const ood = [];
      if (st.conn === "de" && w3Pol(st.c1) === w3Pol(st.c2)) ood.push("a tanítóadatban a „de” mindig ellentétes tagmondatokat köt össze");
      if (st.conn === "és" && w3Pol(st.c1) !== w3Pol(st.c2)) ood.push("a tanítóadatban az „és” mindig azonos hangulatú tagmondatokat köt össze");
      if (st.conn && st.c1.s === st.c2.s) ood.push("a generátor a két tagmondatban mindig különböző alanyt használ");
      oodOut.textContent = ood.length ? "⚠ Ilyen mondat nem fordul elő a tanításban: " + ood.join("; ") + "." : "";
      /* modellsorok */
      const rows = W3_KEYS.map(k => {
        const p = res[k].p, ok = rule == null ? null : (p > 0.5) === (rule > 0);
        const pv = prev ? prev[k].p : null, same = prev && Math.abs(pv - p) < 1e-9;
        const track = h("div", { style: "position:relative;height:14px;background:var(--bg-soft);border-radius:4px;min-width:50px" },
          h("div", { style: `position:absolute;left:0;top:0;bottom:0;width:${(100 * p).toFixed(2)}%;background:${p >= 0.5 ? "var(--setB)" : "var(--setA)"};border-radius:4px` }),
          h("div", { style: "position:absolute;left:50%;top:-2px;bottom:-2px;border-left:1px dashed var(--muted)" }),
          prev ? h("div", { title: "a csere előtt", style: `position:absolute;left:calc(${(100 * pv).toFixed(2)}% - 1.5px);top:-3px;bottom:-3px;width:3px;background:var(--text);border-radius:2px` }) : null);
        return h("tr", null,
          h("td", { style: "padding:.3rem .45rem" }, W3_NAMES[k]),
          h("td", { style: "padding:.3rem .45rem;width:40%;vertical-align:middle" }, track),
          h("td", { style: "padding:.3rem .45rem;font-family:var(--mono);text-align:right;white-space:nowrap" }, w3Pct(p)),
          h("td", { style: `padding:.3rem .45rem;text-align:center;font-weight:700;color:${ok == null ? "var(--muted)" : ok ? "var(--ok)" : "var(--bad)"}` }, ok == null ? "–" : ok ? "✓" : "✗"),
          prev ? h("td", { style: "padding:.3rem .45rem;font-size:.82rem;white-space:nowrap" + (same ? ";color:var(--setC);font-weight:700" : "") }, same ? "pontosan ugyanaz" : `előtte ${w3Pct(pv)}`) : null);
      });
      const th = t => h("th", { style: "padding:.25rem .45rem;font-size:.8rem;white-space:nowrap" }, t);
      tblBox.replaceChildren(h("table", { style: "margin:0;font-size:.9rem;width:100%" },
        h("thead", null, h("tr", null, th("modell"), h("th", { colspan: 2, style: "padding:.25rem .45rem;font-size:.8rem" }, "p(pozitív)"), th("jó?"), prev ? th("a csere előtt") : null)), h("tbody", null, rows)));
      swapNote.innerHTML = prev
        ? "<b>A csere után</b> a szózsák, az átlagolt beágyazás és a pozíció nélküli Transformer <b>pontosan ugyanazt</b> mondja: ugyanazok a tokenek, csak más sorrendben – a sorrendet ezek a modellek nem látják. " +
          "Az RNN és a pozíciókódolásos Transformer viszont követi a cserét. A szópárok modell csak a tagmondatok határán keletkező szópárokon keresztül érzékelheti a cserét " +
          (Math.abs(prev.bow2.p - res.bow2.p) < 1e-9 ? "(most ugyanazok: »volt ,« mindkét változatban, ezért ő sem változott)." : "(most más szópár került a vessző elé, ezért kicsit változott).")
        : "";
      paintPanel();
    }
    function paintPanel() {
      pg.paint(); mg.paint(); hg.paint();
      const toks = w3Tokens(st);
      subCtl.style.display = panelKey === "att" ? "" : "none";
      if (panelKey === "att") {
        const A = res[attModel].att[head], n = toks.length, mx = Math.max(...A.flat());
        const cs = "padding:0;border:1px solid var(--card);width:1.55rem;min-width:1.55rem;height:1.55rem;cursor:pointer";
        const tb = h("tbody", null, A.map((row, i) => h("tr", null,
          h("th", { style: "padding:0 .4rem 0 0;border:none;background:none;text-align:right;font-weight:500;font-size:.8rem;white-space:nowrap" }, toks[i], h("sub", { class: "muted" }, String(i + 1))),
          row.map((a, j) => {
            const t = Math.sqrt(a / mx), on = cell && cell[0] === i && cell[1] === j;
            return h("td", { title: `${toks[i]} → ${toks[j]}: ${fmt(a, 3)}`, style: cs + `;background:color-mix(in srgb, var(--accent) ${(100 * t).toFixed(1)}%, var(--card))` + (on ? ";outline:2px solid var(--setB);outline-offset:-2px" : ""),
              onclick: () => { cell = [i, j]; paintPanel(); }, onmouseenter: () => { cell = [i, j]; showCell(); } });
          }))));
        const hd = h("tr", null, h("th", { style: "border:none;background:none" }), toks.map((t, j) => h("th", {
          style: "padding:.15rem 0;border:none;background:none;font-weight:500;font-size:.8rem;writing-mode:vertical-rl;transform:rotate(180deg);text-align:left;white-space:nowrap;vertical-align:bottom" },
          t, h("sub", { class: "muted" }, String(j + 1)))));
        pBody.replaceChildren(
          h("div", { style: "font-size:.88rem;margin:.2rem 0 .3rem", class: "muted" }, `Sorok: ki figyel (lekérdezés, Q); oszlopok: kire (kulcs, K). Minden sor összege 1; sötétebb = nagyobb súly. ` +
            (attModel === "tf_nopos" ? "Pozíció nélkül a két »a« és a két »volt« sora teljesen egyforma – a modell nem tudja megkülönböztetni őket." : "")),
          h("div", { class: "tw", style: "overflow-x:auto" }, h("table", { style: "width:auto;margin:0;border-collapse:collapse" }, h("thead", null, hd), tb)));
        showCell();
      } else {
        const r = res[panelKey], list = r.contrib.slice().sort((a, b) => Math.abs(b[3]) - Math.abs(a[3])), top = list.slice(0, 12);
        const mxc = Math.max(1e-9, ...top.map(q => Math.abs(q[3])));
        const half = (v, neg) => h("div", { style: `flex:1;display:flex;justify-content:${neg ? "flex-end" : "flex-start"}` },
          (neg ? v < 0 : v > 0) ? h("div", { style: `height:10px;width:${(100 * Math.abs(v) / mxc).toFixed(1)}%;background:${v > 0 ? "var(--setB)" : "var(--setA)"};border-radius:3px` }) : null);
        pBody.replaceChildren(
          h("div", { style: "font-size:.88rem;margin:.2rem 0 .3rem", class: "muted" },
            `A mondatban lévő ${panelKey === "bow1" ? "szavak" : "szavak és szópárok"} súlya (a logisztikus regresszióból), darabszámmal szorozva; narancs: pozitív felé húz, kék: negatív felé. ` +
            (panelKey === "bow1" ? "A sorrend sehol sem szerepel – ezért nem érti a „de”-t." : "A szópárok („nem volt”, „volt jó”, „de a”) már hordoznak egy kis sorrendet.")),
          h("div", { class: "tw", style: "overflow-x:auto" }, h("table", { style: "margin:0;font-size:.85rem;width:100%" }, h("tbody", null, top.map(([f, c, w, v]) => h("tr", null,
            h("td", { style: "padding:.15rem .4rem;font-family:var(--mono);white-space:nowrap" }, f),
            h("td", { style: "padding:.15rem .4rem;font-family:var(--mono);text-align:right;white-space:nowrap" }, (c > 1 ? c + " × " : "") + fmt(w, 2)),
            h("td", { style: "padding:.15rem .4rem;width:45%;vertical-align:middle" }, h("div", { style: "display:flex;align-items:center;min-width:90px" }, half(v, true),
              h("div", { style: "width:1px;height:14px;background:var(--muted)" }), half(v, false))),
            h("td", { style: "padding:.15rem .4rem;font-family:var(--mono);text-align:right;white-space:nowrap" }, fmt(v, 2))))))));
        pInfo.innerHTML = (list.length > top.length ? `… és még ${list.length - top.length} kisebb tag. ` : "") +
          `összeg + b (${fmt(R[panelKey].b, 2)}) = logit <b>${fmt(r.logit, 2)}</b> → p(pozitív) = <b>${w3Pct(r.p)}</b>`;
      }
    }
    function showCell() {
      if (panelKey !== "att") return;
      const toks = w3Tokens(st), A = res[attModel].att[head];
      if (!cell || cell[0] >= toks.length) { pInfo.innerHTML = "Vidd az egeret egy cellára (vagy koppints rá): megmutatja a súlyt."; return; }
      const [i, j] = cell, row = A[i], best = argmax(row);
      pInfo.innerHTML = `»${toks[i]}«<sub>${i + 1}</sub> → »${toks[j]}«<sub>${j + 1}</sub>: <b>${fmt(row[j], 3)}</b> · ez a sor leginkább ide figyel: »${toks[best]}«<sub>${best + 1}</sub> (${fmt(row[best], 2)})`;
    }
    changed(true);
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
