/* =========================================================
   Synopsis – mérési napló (laborgyakorlatokhoz)
   ---------------------------------------------------------
   Használat:
     <div class="lab-log" data-lab="el1-L11"
          data-cols="Jóslat|Mért|Megjegyzés"
          data-rows="1. mérés|2. mérés"
          data-compare="0,1"></div>

   - data-lab:     egyedi azonosító; a beírt értékeket a böngésző elmenti
                   (localStorage, "synopsis:lab:<azonosító>").
   - data-cols:    oszlopfejlécek „|”-lel elválasztva (az első, sorcímke-oszlop nélkül).
   - data-rows:    sorcímkék „|”-lel elválasztva.
   - data-compare: (nem kötelező) két oszlop indexe: „jóslat,mért”. Ha mindkét
                   cellában szám áll (tizedesvessző is jó), a napló kiírja az
                   eltérést %-ban: (mért − jóslat) / jóslat.
   ========================================================= */
(function () {
  "use strict";
  const KEY = id => "synopsis:lab:" + id;
  const num = s => {
    const t = String(s || "").trim().replace(/\s+/g, "").replace(",", ".");
    return /^[-+]?\d*\.?\d+(e[-+]?\d+)?$/i.test(t) ? parseFloat(t) : NaN;
  };
  const fmt = x => (+x.toFixed(1)).toString().replace(".", ",");

  function mount(root) {
    const id = root.dataset.lab;
    const cols = (root.dataset.cols || "Jóslat|Mért").split("|");
    const rows = (root.dataset.rows || "").split("|").filter(Boolean);
    const cmp = root.dataset.compare ? root.dataset.compare.split(",").map(Number) : null;
    let data = {};
    try { data = JSON.parse(localStorage.getItem(KEY(id)) || "{}"); } catch (e) { data = {}; }

    const table = document.createElement("table");
    const head = document.createElement("tr");
    ["", ...cols, ...(cmp ? ["Eltérés"] : [])].forEach(c => {
      const th = document.createElement("th"); th.textContent = c; head.append(th);
    });
    table.append(head);
    const devCells = [];
    rows.forEach((r, i) => {
      const tr = document.createElement("tr");
      const th = document.createElement("th"); th.textContent = r; th.style.fontWeight = "500"; tr.append(th);
      cols.forEach((c, j) => {
        const td = document.createElement("td");
        const ta = document.createElement("textarea");
        ta.rows = 1; ta.value = data[i + ":" + j] || ""; ta.setAttribute("aria-label", r + " – " + c);
        ta.addEventListener("input", () => { data[i + ":" + j] = ta.value; save(); dev(i); });
        td.append(ta); tr.append(td);
      });
      if (cmp) { const td = document.createElement("td"); devCells[i] = td; tr.append(td); }
      table.append(tr);
    });
    const wrap = document.createElement("div");
    wrap.className = "tw"; wrap.style.overflowX = "auto";
    wrap.append(table);

    const status = document.createElement("span");
    const clear = document.createElement("button");
    clear.className = "btn"; clear.type = "button"; clear.textContent = "Napló törlése";
    clear.addEventListener("click", () => {
      if (!confirm("Biztosan törlöd a napló összes bejegyzését?")) return;
      data = {}; localStorage.removeItem(KEY(id));
      table.querySelectorAll("textarea").forEach(t => (t.value = ""));
      rows.forEach((_, i) => dev(i));
      status.textContent = "Törölve.";
    });
    const copy = document.createElement("button");
    copy.className = "btn"; copy.type = "button"; copy.textContent = "Másolás táblázatként";
    copy.addEventListener("click", () => {
      const lines = [["", ...cols].join("\t")].concat(rows.map((r, i) => [r, ...cols.map((_, j) => (data[i + ":" + j] || "").replace(/\s+/g, " "))].join("\t")));
      const txt = lines.join("\n");
      (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(
        () => (status.textContent = "A vágólapra másolva (táblázatkezelőbe beilleszthető)."),
        () => (status.textContent = "A másolás itt nem sikerült."));
    });
    const actions = document.createElement("div");
    actions.className = "lab-actions";
    actions.append(clear, copy, status);
    root.append(wrap, actions);

    function save() {
      try { localStorage.setItem(KEY(id), JSON.stringify(data)); status.textContent = "Mentve ebben a böngészőben."; }
      catch (e) { status.textContent = "A mentés nem sikerült."; }
    }
    function dev(i) {
      if (!cmp) return;
      const p = num(data[i + ":" + cmp[0]]), m = num(data[i + ":" + cmp[1]]), td = devCells[i];
      if (isFinite(p) && isFinite(m) && p !== 0) {
        const d = (m - p) / Math.abs(p) * 100;
        td.textContent = (d > 0 ? "+" : "") + fmt(d) + " %";
        td.className = Math.abs(d) <= 10 ? "dev-ok" : "dev-bad";
      } else { td.textContent = ""; td.className = ""; }
    }
    rows.forEach((_, i) => dev(i));
  }

  function boot() { document.querySelectorAll(".lab-log[data-lab]").forEach(mount); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
  window.LabLog = { mount };
})();
