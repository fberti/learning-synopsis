/* =========================================================
   Hálózatelemzés 0. fejezet – interaktív szemléltetések
   Minden widget egy  <div class="widget" data-widget="név">  elembe épül.
   ========================================================= */
(function () {
  "use strict";
  const W = {};

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
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const num = x => (Number.isInteger(x) ? String(x) : String(+x.toFixed(4))).replace(".", ",").replace("-", "−");

  /* ==================================================================
     0.2 cell-order – Jupyter-kernel vs. marimo: számít-e a futtatás sorrendje?
     ================================================================== */
  W["cell-order"] = root => {
    header(root, "Cellák és kernel: Jupyter vagy marimo?",
      "Jupyter-módban te döntöd el, melyik cella fut és hányszor; a kernel mindent megjegyez. " +
      "Marimo-módban a B cella új nevet kap (<code>m</code>), és az A módosítása után a függő cellák maguktól újrafutnak.");

    const st = { mode: "jupyter", n0: 16, counter: 0, vars: {}, last: { A: null, B: null, C: null }, out: [], log: [] };
    const modeBar = h("div", { class: "controls" });
    const cellsBox = h("div");
    const stateBox = h("div", { class: "readout" });
    const outBox = h("div", { class: "readout" });
    const ctl = h("div", { class: "controls" });
    root.append(modeBar, cellsBox, ctl, stateBox, outBox);

    const modeBtns = [["jupyter", "Jupyter-mód"], ["marimo", "marimo-mód"]].map(([m, l]) =>
      btn(l, () => { st.mode = m; reset(); paintMode(); }));
    const paintMode = () => modeBtns.forEach((b, i) => b.classList.toggle("on", ["jupyter", "marimo"][i] === st.mode));
    modeBar.append(...modeBtns);

    const nSel = h("select", null, ...[14, 15, 16, 17, 18].map(v => h("option", { value: v }, String(v))));
    nSel.value = "16";
    nSel.addEventListener("change", () => {
      st.n0 = +nSel.value;
      if (st.mode === "marimo") runMarimo("A");
      paintCells();
    });

    function code(cell) {
      if (cell === "A") return null;  // külön kezeljük (legördülő)
      if (st.mode === "jupyter") return cell === "B" ? "n = n - 1" : "print(n)";
      return cell === "B" ? "m = n - 1" : "print(m)";
    }

    function runJupyter(cell) {
      st.counter += 1;
      st.last[cell] = st.counter;
      try {
        if (cell === "A") st.vars.n = st.n0;
        else if (cell === "B") {
          if (!("n" in st.vars)) throw new Error("NameError: name 'n' is not defined");
          st.vars.n = st.vars.n - 1;
        } else {
          if (!("n" in st.vars)) throw new Error("NameError: name 'n' is not defined");
          st.out.push(`[${st.counter}] C → ${st.vars.n}`);
        }
        st.log.push(cell);
      } catch (e) {
        st.out.push(`[${st.counter}] ${cell} → ${e.message}`);
        st.log.push(cell + "✘");
      }
      paint();
    }

    function runMarimo(start) {
      // a függőségi sorrend: A → B → C; a kiinduló cellától lefelé minden újrafut
      const order = ["A", "B", "C"];
      const from = order.indexOf(start);
      for (const cell of order.slice(from)) {
        st.counter += 1;
        st.last[cell] = st.counter;
        if (cell === "A") st.vars = { n: st.n0 };
        else if (cell === "B") st.vars.m = st.vars.n - 1;
        else st.out.push(`[${st.counter}] C → ${st.vars.m}`);
        st.log.push(cell);
      }
      paint();
    }

    function cellRow(cell, label) {
      const row = h("div", { style: "display:flex;align-items:center;gap:.6rem;margin:.35rem 0;flex-wrap:wrap" });
      const cnt = h("code", { style: "min-width:3.2em;text-align:right;color:var(--muted)" }, st.last[cell] ? `[${st.last[cell]}]` : "[ ]");
      const body = cell === "A"
        ? h("span", { style: "font-family:var(--mono)" }, "n = ", nSel)
        : h("code", null, code(cell));
      const run = btn("▶ " + label, () => (st.mode === "jupyter" ? runJupyter(cell) : runMarimo(cell)));
      row.append(cnt, h("b", { style: "min-width:1.2em" }, cell), body, run);
      return row;
    }

    function paintCells() {
      cellsBox.innerHTML = "";
      cellsBox.append(cellRow("A", "A futtatása"), cellRow("B", "B futtatása"), cellRow("C", "C futtatása"));
    }

    function paint() {
      paintCells();
      const vars = Object.entries(st.vars).map(([k, v]) => `${k} = <b>${num(v)}</b>`).join(", ") || "<i>üres</i>";
      stateBox.innerHTML = `A kernel állapota: ${vars}<br>Futtatások sorrendje: ${st.log.length ? st.log.join(" → ") : "–"}`;
      const expected = st.mode === "jupyter" ? st.n0 - 1 : st.n0 - 1;
      const lastOut = st.out.length ? st.out[st.out.length - 1] : null;
      let verdict = "";
      if (lastOut) {
        const m = lastOut.match(/→ (-?\d+)$/);
        if (m) verdict = (+m[1] === expected)
          ? ` <span style="color:var(--ok)">✔ egyezik azzal, amit a cellák szövege sugall (${expected})</span>`
          : ` <span style="color:var(--bad)">✘ a cellák szövege alapján ${expected} lenne – rejtett állapot!</span>`;
      }
      outBox.innerHTML = "Kimenet:<br>" + (st.out.length ? st.out.slice(-6).map(esc).join("<br>") + verdict : "<i>még semmi</i>");
    }

    function reset() {
      st.counter = 0; st.vars = {}; st.last = { A: null, B: null, C: null }; st.out = []; st.log = [];
      if (st.mode === "marimo") runMarimo("A"); else paint();
    }

    ctl.append(btn("↺ Kernel újraindítása", reset),
      btn("⏭ Restart & Run All", () => { reset(); if (st.mode === "jupyter") ["A", "B", "C"].forEach(runJupyter); }, "btn primary"));
    paintMode();
    reset();
    root.__co = { st, runJupyter, runMarimo, reset, setMode: m => { st.mode = m; paintMode(); reset(); }, out: () => outBox.innerText };
  };

  /* ==================================================================
     0.3 matrix-check – CSV-mátrix ellenőrzése (a check_matrix böngészős párja)
     ================================================================== */
  const PRESETS = [
    ["egyutt", "Együttműködés (irányítatlan)", ",Anna,Bence,Csaba,Dóra\nAnna,0,1,1,0\nBence,1,0,1,0\nCsaba,1,1,0,0\nDóra,0,0,0,0"],
    ["tanacs", "Tanácskérés (irányított)", ",Anna,Bence,Csaba,Dóra\nAnna,0,1,0,0\nBence,1,0,0,0\nCsaba,1,0,0,0\nDóra,1,0,0,0"],
    ["projekt", "Közös projektek (súlyozott)", ",Anna,Bence,Csaba,Dóra\nAnna,0,3,1,0\nBence,3,0,2,0\nCsaba,1,2,0,0\nDóra,0,0,0,0"],
    ["sorrend", "Felcserélt oszlopok", ",Anna,Csaba,Bence,Dóra\nAnna,0,1,1,0\nBence,1,1,0,0\nCsaba,1,0,1,0\nDóra,0,0,0,0"],
    ["kod", "Hiánykóddal (9)", ",Anna,Bence,Csaba,Dóra\nAnna,0,1,9,0\nBence,1,0,1,0\nCsaba,9,1,0,0\nDóra,0,0,0,9"],
    ["excel", "Magyar Excel-mentés (;)", ";Anna;Bence;Csaba;Dóra\nAnna;0;1,5;1;0\nBence;1,5;0;1;0\nCsaba;1;1;0;0\nDóra;0;0;0;0"]
  ];

  function parseCSV(text, sep, dec) {
    const lines = text.replace(/\r/g, "").split("\n").filter(l => l.trim() !== "");
    const rows = lines.map(l => l.split(sep));
    return rows;
  }

  W["matrix-check"] = root => {
    header(root, "Mátrix-ellenőrző",
      "Írd vagy illeszd be egy szomszédsági mátrix CSV-jét (első sor és első oszlop: címkék). Az ellenőrző ugyanazt nézi, mint a 0.6 <code>check_matrix</code> függvénye, " +
      "és megszámolja az éleket is. Próbáld ki a mintákat, aztán rontsd el szándékosan!");
    const pre = h("div", { class: "controls" });
    const ta = h("textarea", { rows: 7, spellcheck: "false", style: "width:100%;font-family:var(--mono);font-size:.9rem;padding:.5rem;border-radius:8px;border:1px solid var(--border);background:var(--bg-soft);color:var(--text)" });
    const opts = h("div", { class: "controls" });
    const sepSel = h("select", null, h("option", { value: "," }, "vessző ,"), h("option", { value: ";" }, "pontosvessző ;"));
    const decSel = h("select", null, h("option", { value: "." }, "pont ."), h("option", { value: "," }, "vessző ,"));
    const dirSel = h("select", null, h("option", { value: "auto" }, "az adatból"), h("option", { value: "und" }, "irányítatlan"), h("option", { value: "dir" }, "irányított"));
    const missIn = h("input", { type: "text", value: "", placeholder: "pl. 9", size: 6 });
    opts.append(h("label", null, "elválasztó ", sepSel), h("label", null, "tizedesjel ", decSel),
      h("label", null, "irány ", dirSel), h("label", null, "hiánykód ", missIn));
    const out = h("div", { class: "readout" });
    root.append(pre, ta, opts, out);

    let cur = null;
    const pbtns = PRESETS.map(([k, l, csv]) => btn(l, () => {
      ta.value = csv; cur = k;
      sepSel.value = k === "excel" ? ";" : ",";
      decSel.value = ".";
      missIn.value = "";
      pbtns.forEach((b, i) => b.classList.toggle("on", PRESETS[i][0] === k));
      run();
    }));
    pre.append(...pbtns);

    function run() {
      const sep = sepSel.value, dec = decSel.value;
      const rows = parseCSV(ta.value, sep, dec);
      const lines = [];
      const warn = s => lines.push(`<span style="color:var(--bad)">⚠ ${s}</span>`);
      const ok = s => lines.push(`<span style="color:var(--ok)">✔</span> ${s}`);
      if (rows.length < 2) { out.innerHTML = "Legalább egy fejléc és egy adatsor kell."; return; }
      const width = rows[0].length;
      if (width === 1) {
        warn(`A fejléc egyetlen oszlop: <code>${esc(rows[0][0].slice(0, 40))}</code>… Lehet, hogy rossz az elválasztó (magyar Excel: pontosvessző)?`);
        out.innerHTML = lines.join("<br>"); return;
      }
      const colLab = rows[0].slice(1).map(s => s.trim());
      const rowLab = rows.slice(1).map(r => (r[0] || "").trim());
      const missing = missIn.value.trim() === "" ? null : parseFloat(missIn.value.replace(",", "."));
      const M = [];
      let bad = 0, nan = 0;
      rows.slice(1).forEach(r => {
        const vals = r.slice(1).map(s => {
          let t = s.trim();
          if (dec === ",") t = t.replace(",", ".");
          if (t === "" || /^na$/i.test(t)) { nan++; return NaN; }
          const v = Number(t);
          if (!isFinite(v)) { bad++; return NaN; }
          if (missing !== null && v === missing) { nan++; return NaN; }
          return v;
        });
        M.push(vals);
      });
      const n = rowLab.length, m = colLab.length;
      const ragged = M.some(r => r.length !== m);
      lines.push(`méret: <b>${n} × ${m}</b>${n === m ? "" : " (nem négyzetes: kétmódú adat?)"}`);
      if (ragged) warn("Nem minden sorban ugyanannyi érték van, mint ahány oszlopcímke.");
      if (bad) warn(`${bad} cella nem szám. Rossz tizedesjel vagy elválasztó?`);
      const values = [...new Set(M.flat().filter(v => !isNaN(v)))].sort((a, b) => a - b);
      lines.push(`értékek: <b>${values.slice(0, 10).map(num).join("; ")}${values.length > 10 ? " …" : ""}</b>`);
      const SUSPECT = [9, 99, 999, -9, -99, -999];
      const sus = values.filter(v => SUSPECT.includes(v));
      if (sus.length && missing === null)
        warn(`Gyanús érték: <b>${sus.map(num).join("; ")}</b>. Ez gyakori hiánykód. Nézd meg a leírást, és ha az, írd be a „hiánykód” mezőbe!`);
      if (nan) warn(`hiányzó érték: <b>${nan}</b> cella. Gráfépítés előtt dönteni kell róla (a <code>to_networkx</code> itt hibát dob).`);
      else lines.push("hiányzó érték: 0");
      if (n === m && !ragged) {
        const same = rowLab.every((l, i) => l === colLab[i]);
        same ? ok("a sor- és oszlopcímkék azonos sorrendben vannak")
             : warn(`a sor- és oszlopcímkék sorrendje eltér (sorok: ${esc(rowLab.join(", "))} · oszlopok: ${esc(colLab.join(", "))}): a cellák nem azt jelentik, amit hiszel!`);
        let sym = true, diag = 0;
        for (let i = 0; i < n; i++) {
          if (!isNaN(M[i][i])) diag += M[i][i];
          for (let j = 0; j < n; j++) {
            const a = M[i][j], b = M[j][i];
            if (!(a === b || (isNaN(a) && isNaN(b)))) sym = false;
          }
        }
        lines.push(`szimmetrikus: <b>${sym ? "igen" : "nem"}</b> · átló összege: <b>${num(diag)}</b>`);
        if (diag !== 0) warn("Az átló nem üres: önhurok, kódolási hiba vagy hiánykód?");
        const directed = dirSel.value === "auto" ? !sym : dirSel.value === "dir";
        if (dirSel.value === "und" && !sym) warn("Irányítatlannak kéred, de a mátrix nem szimmetrikus: páronként a nagyobb értéket veszem (mint a to_networkx).");
        if (!nan && !bad) {
          let edges = 0, wsum = 0;
          const deg = new Array(n).fill(0);
          for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
            let v = M[i][j];
            if (!directed) { if (j <= i && i !== j) continue; v = Math.max(M[i][j], M[j][i]); }
            if (v !== 0) { edges++; wsum += v; deg[i]++; if (j !== i) deg[j]++; }
          }
          const valued = values.some(v => v !== 0 && v !== 1);
          lines.push(`gráf: <b>${directed ? "irányított" : "irányítatlan"}</b>, <b>${edges}</b> ${directed ? "nyíl" : "él"}` +
            (valued ? `, súlyösszeg <b>${num(wsum)}</b> (a nem nulla cellák számából, nem az összegből!)` : ""));
          const iso = rowLab.filter((_, i) => deg[i] === 0);
          lines.push(`izolált csúcs: <b>${iso.length ? esc(iso.join(", ")) : "nincs"}</b>` + (iso.length ? " – élistából építve elveszne!" : ""));
        }
      }
      out.innerHTML = lines.join("<br>");
    }
    [ta, sepSel, decSel, dirSel, missIn].forEach(e => e.addEventListener("input", run));
    [sepSel, decSel, dirSel].forEach(e => e.addEventListener("change", run));
    pbtns[0].click();
    root.__mc = { run, set: (csv, sep = ",") => { ta.value = csv; sepSel.value = sep; run(); }, out: () => out.innerText, ta, sepSel, decSel, dirSel, missIn };
  };

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
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
