/* =========================================================
   Synopsis – kereszthivatkozások oldalsávban
   ---------------------------------------------------------
   Használat: a tartalmi hivatkozás kapja meg az `xref` osztályt:
     <a class="xref" href="../01-mi-a-halozat/#s17-a">1.7</a>
     <a class="xref" href="#s23-b">2.3</a>          (ugyanazon az oldalon)
   Kattintásra a hivatkozott oldal (teljes egészében) a jobb oldali
   sávban nyílik meg, a hivatkozott részhez görgetve, kiemelve.
   Navigációs linkekre (útiterv, tartalomjegyzék, lapozó, főoldal)
   és külső forrásokra NEM kell `xref`.
   Ctrl/⌘/Shift/középső kattintás: a böngésző szokásos viselkedése.
   A fejléc jobb felső 📑 gombja üresen nyitja a sávot: ott a Synopsis
   bármely témakörének bármely fejezete (és szakasza) kiválasztható.
   A listát futás közben olvassa ki a főoldalból és a témakörök
   index.html-jéből (`a.card` → `h3 > a`), külön karbantartás nem kell.
   Betöltés: a common.js tölti be automatikusan (külön <script> nem kell).
   ========================================================= */
(function () {
  "use strict";

  const EMBEDDED = window.self !== window.top;
  // Az oldal gyökere (assets/..): innen olvassuk a témakörök listáját.
  const BASE = new URL("../", (document.currentScript && document.currentScript.src) || location.href).href;
  const WIDTH_KEY = "synopsis:xref-width";
  const root = document.documentElement;

  const ready = fn => (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", fn) : fn());
  const loaded = fn => (document.readyState === "complete" ? fn() : window.addEventListener("load", fn));

  function safeGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function safeSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* nem baj */ } }

  /* ============ 1. Beágyazott nézet (az oldalsávban futó oldal) ============ */
  if (EMBEDDED) {
    root.classList.add("xref-embedded");

    const post = () => {
      try {
        window.parent.postMessage({ type: "xref-loc", href: location.href, title: document.title }, "*");
      } catch (e) { /* nem baj */ }
    };

    function highlight() {
      const id = decodeURIComponent(location.hash.slice(1));
      if (!id) return;
      let el = document.getElementById(id);
      if (!el) return;
      // A szakaszt (section) a címével jelöljük ki, ne az egész szakaszt.
      if (el.tagName === "SECTION") el = el.querySelector("h2, h3") || el;
      // Csukott lenyílóban lévő célt nyissuk ki.
      for (let p = el.parentElement; p; p = p.parentElement) if (p.tagName === "DETAILS") p.open = true;
      // scrollIntoView a gazdaoldalt is görgetné – csak a saját ablakunkat mozgatjuk.
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 12, behavior: "instant" });
      el.classList.remove("xref-target");
      void el.offsetWidth; // animáció újraindítása
      el.classList.add("xref-target");
    }

    ready(() => { post(); highlight(); });
    // A KaTeX és az ábrák betöltés után még tolják az elrendezést: újra odagörgetünk.
    loaded(() => setTimeout(highlight, 80));
    window.addEventListener("hashchange", () => { post(); highlight(); });

    window.addEventListener("message", ev => {
      const d = ev.data || {};
      if (d.type === "xref-theme" && d.theme) {
        root.setAttribute("data-theme", d.theme);
        document.querySelectorAll("[data-theme-toggle]").forEach(b => (b.textContent = d.theme === "dark" ? "☀️" : "🌙"));
      }
    });

    // Az oldalsávban az xref linkek ugyanabban a sávban nyílnak (sima navigáció).
    // Esc: az oldalsáv bezárása.
    document.addEventListener("keydown", ev => {
      if (ev.key === "Escape") window.parent.postMessage({ type: "xref-close" }, "*");
    });
    return;
  }

  /* ============ 2. Gazdaoldal: az oldalsáv ============ */
  let panel, frame, titleEl, openLink, backBtn, browse, history = [];

  function build() {
    panel = document.createElement("aside");
    panel.className = "xref-panel";
    panel.setAttribute("aria-label", "Hivatkozott rész");
    panel.hidden = true;
    panel.innerHTML =
      '<div class="xref-resize" title="Húzd a sáv szélességének állításához"></div>' +
      '<div class="xref-head">' +
      '  <button type="button" class="xref-btn" data-xref-back title="Vissza" disabled>←</button>' +
      '  <button type="button" class="xref-btn" data-xref-home title="Tartalom – válassz anyagot">📚</button>' +
      '  <span class="xref-title">Hivatkozás</span>' +
      '  <a class="xref-btn" data-xref-open target="_blank" rel="noopener" title="Megnyitás új lapon">↗</a>' +
      '  <button type="button" class="xref-btn" data-xref-close title="Bezárás (Esc)">✕</button>' +
      '</div>' +
      '<div class="xref-browse" hidden>' +
      '  <input type="search" class="xref-search" placeholder="Keresés a fejezetek között…" aria-label="Keresés a fejezetek között">' +
      '  <div class="xref-cat"><p class="muted">Betöltés…</p></div>' +
      '</div>' +
      '<iframe class="xref-frame" title="Hivatkozott rész"></iframe>';
    document.body.appendChild(panel);
    frame = panel.querySelector("iframe");
    titleEl = panel.querySelector(".xref-title");
    openLink = panel.querySelector("[data-xref-open]");
    backBtn = panel.querySelector("[data-xref-back]");
    browse = panel.querySelector(".xref-browse");
    panel.querySelector("[data-xref-home]").addEventListener("click", showBrowser);
    browse.querySelector(".xref-search").addEventListener("input", ev => filterCatalog(ev.target.value));
    browse.addEventListener("click", onBrowseClick);

    panel.querySelector("[data-xref-close]").addEventListener("click", close);
    backBtn.addEventListener("click", () => {
      if (!browse.hidden && history.length) return load(history[history.length - 1], false); // vissza a lapra
      if (history.length < 2) return;
      history.pop();
      load(history[history.length - 1], false);
    });
    frame.addEventListener("load", sendTheme);

    const w = parseInt(safeGet(WIDTH_KEY), 10);
    if (w) root.style.setProperty("--xref-w", w + "px");
    resizer(panel.querySelector(".xref-resize"));
  }

  function resizer(handle) {
    handle.addEventListener("pointerdown", ev => {
      ev.preventDefault();
      handle.setPointerCapture(ev.pointerId);
      root.classList.add("xref-resizing");
      const move = e => {
        const w = Math.min(Math.max(window.innerWidth - e.clientX, 320), window.innerWidth - 360);
        root.style.setProperty("--xref-w", w + "px");
      };
      const up = () => {
        handle.removeEventListener("pointermove", move);
        handle.removeEventListener("pointerup", up);
        root.classList.remove("xref-resizing");
        safeSet(WIDTH_KEY, parseInt(getComputedStyle(panel).width, 10));
      };
      handle.addEventListener("pointermove", move);
      handle.addEventListener("pointerup", up);
    });
  }

  function sendTheme() {
    try {
      frame.contentWindow.postMessage({ type: "xref-theme", theme: root.getAttribute("data-theme") }, "*");
    } catch (e) { /* nem baj */ }
  }

  function load(href, push) {
    if (push !== false) history.push(href);
    backBtn.disabled = history.length < 2;
    browse.hidden = true;
    frame.hidden = false;
    openLink.hidden = false;
    openLink.href = href;
    // Csak a horgony változik: a böngésző nem tölti újra a lapot (hashchange).
    frame.src = href;
  }

  /* A sáv nyitása/zárása átrendezi a fő szöveget (keskenyebb lesz):
     a kiválasztott elem maradjon ugyanott a képernyőn. */
  function keepInView(anchor, change) {
    const el = anchor && anchor.isConnected ? anchor : null;
    const before = el ? el.getBoundingClientRect().top : 0;
    // A böngésző saját görgetés-horgonyzása ne javítson rá még egyszer.
    root.style.overflowAnchor = document.body.style.overflowAnchor = "none";
    root.style.scrollBehavior = "auto";
    change();
    if (el) window.scrollBy(0, el.getBoundingClientRect().top - before);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      root.style.scrollBehavior = root.style.overflowAnchor = document.body.style.overflowAnchor = "";
    }));
  }

  // A zárásnál ehhez igazítunk: az utolsó kattintott link, vagy a képernyő tetején lévő elem.
  let lastAnchor = null;
  function topElement() {
    const main = document.querySelector("main") || document.body;
    const x = main.getBoundingClientRect().left + 40;
    return document.elementFromPoint(x, 120);
  }

  function open(href, label, anchor) {
    if (!panel) build();
    titleEl.textContent = label || "Hivatkozás";
    lastAnchor = anchor || null;
    // Szűk képernyőn a tartalomjegyzéket ideiglenesen becsukjuk (a ☰ gombbal visszahozható).
    showPanel(anchor);
    load(href);
  }

  function showPanel(anchor) {
    if (!panel.hidden) return;
    keepInView(anchor, () => {
      panel.hidden = false;
      root.classList.add("xref-open");
      const S = window.Synopsis;
      if (S && S.setTocCollapsed && !S.isTocCollapsed() && window.innerWidth <= 1500) S.setTocCollapsed(true, true);
    });
  }

  /* ---------- Tartalom: témakörök és fejezetek böngészése ---------- */
  function showBrowser() {
    if (!panel) build();
    if (panel.hidden) { lastAnchor = null; showPanel(topElement()); }
    browse.hidden = false;
    frame.hidden = true;
    openLink.hidden = true;
    titleEl.textContent = "Tartalom";
    backBtn.disabled = history.length === 0;
    loadCatalog();
    const inp = browse.querySelector(".xref-search");
    if (window.innerWidth > 900) setTimeout(() => inp.focus(), 0);
  }

  function toggleBrowser() {
    if (panel && !panel.hidden && !browse.hidden) close();
    else showBrowser();
  }

  const CAT_KEY = "synopsis:xref-catalog";
  let catalog = null, catalogLoading = null;

  async function fetchDoc(url) {
    const r = await fetch(url, { cache: "no-cache" });
    if (!r.ok) throw new Error(r.status + " " + url);
    return new DOMParser().parseFromString(await r.text(), "text/html");
  }
  const isLocalRel = h => h && !/^([a-z]+:|\/\/|#|\.\.\/)/i.test(h);
  const clean = t => (t || "").replace(/\s+/g, " ").trim();

  async function buildCatalog() {
    const home = await fetchDoc(BASE);
    const topics = [...home.querySelectorAll("a.card[href]")]
      .filter(a => isLocalRel(a.getAttribute("href")))
      .map(a => ({ title: clean((a.querySelector("h3") || a).textContent), url: new URL(a.getAttribute("href"), BASE).href }));
    await Promise.all(topics.map(async t => {
      try {
        const doc = await fetchDoc(t.url);
        t.chapters = [...doc.querySelectorAll("main h3 > a[href], .container h3 > a[href]")]
          .filter(a => isLocalRel(a.getAttribute("href")) && !a.closest("header, footer, .topbar"))
          .map(a => {
            const li = a.closest("li");
            const num = li && li.querySelector(".num");
            return { num: num ? clean(num.textContent) : "", title: clean(a.textContent), url: new URL(a.getAttribute("href"), t.url).href };
          })
          .filter((c, i, arr) => arr.findIndex(x => x.url === c.url) === i);
      } catch (e) { t.chapters = []; t.error = true; }
    }));
    return topics;
  }

  function loadCatalog() {
    if (catalog) return renderCatalog();
    if (catalogLoading) return;
    try {
      const c = JSON.parse(sessionStorage.getItem(CAT_KEY) || "null");
      if (c && Date.now() - c.at < 10 * 60 * 1000) { catalog = c.topics; return renderCatalog(); }
    } catch (e) { /* nem baj */ }
    catalogLoading = buildCatalog().then(topics => {
      catalog = topics;
      try { sessionStorage.setItem(CAT_KEY, JSON.stringify({ at: Date.now(), topics })); } catch (e) { /* nem baj */ }
      renderCatalog();
    }).catch(() => {
      browse.querySelector(".xref-cat").innerHTML =
        '<p class="muted">A tartalom nem tölthető be. (Helyi fájlként megnyitva a böngésző tiltja; ' +
        'használd a GitHub Pages-oldalt vagy a <code>python3 -m http.server</code> parancsot.)</p>';
    }).finally(() => { catalogLoading = null; });
  }

  const esc = t => String(t).replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
  const here = () => location.href.split("#")[0];

  function renderCatalog() {
    const cur = here();
    const html = catalog.map(t => {
      const mine = cur.startsWith(t.url);
      const items = (t.chapters || []).map(c =>
        '<li data-q="' + esc(norm(c.num + " " + c.title + " " + t.title)) + '"' + (cur === c.url ? ' class="current"' : "") + ">" +
        '<button type="button" class="xref-sec-btn" data-sec="' + esc(c.url) + '" title="Szakaszok" aria-expanded="false">▸</button>' +
        '<a href="' + esc(c.url) + '" data-pick>' + (c.num ? '<span class="xref-num">' + esc(c.num) + ".</span> " : "") + esc(c.title) + "</a>" +
        '<ol class="xref-secs" hidden></ol></li>').join("");
      return '<details class="xref-topic"' + (mine ? " open" : "") + ' data-q="' + esc(norm(t.title)) + '">' +
        "<summary>" + esc(t.title) + ' <span class="muted">(' + (t.chapters || []).length + ")</span></summary>" +
        '<p class="xref-overview"><a href="' + esc(t.url) + '" data-pick>Áttekintés, fejezetlista</a></p>' +
        (items ? "<ol>" + items + "</ol>" : '<p class="muted">Még nincs kész fejezet.</p>') + "</details>";
    }).join("");
    browse.querySelector(".xref-cat").innerHTML = html;
    const q = browse.querySelector(".xref-search").value;
    if (q) filterCatalog(q);
  }

  const norm = t => String(t).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  function filterCatalog(q) {
    const n = norm(q.trim());
    browse.querySelectorAll(".xref-topic").forEach(d => {
      let any = false;
      const topicHit = n && d.dataset.q.includes(n);
      d.querySelectorAll(":scope > ol > li").forEach(li => {
        const secHit = n && [...li.querySelectorAll(".xref-secs a")].some(a => norm(a.textContent).includes(n));
        const hit = !n || topicHit || li.dataset.q.includes(n) || secHit;
        li.hidden = !hit;
        if (hit) any = true;
      });
      d.hidden = !!n && !any && !topicHit;
      if (n) d.open = any || topicHit;
      else d.open = here().startsWith(d.querySelector(".xref-overview a").href);
    });
  }

  async function toggleSections(btn) {
    const li = btn.closest("li"), ol = li.querySelector(".xref-secs");
    const opening = ol.hidden;
    ol.hidden = !opening;
    btn.setAttribute("aria-expanded", String(opening));
    btn.textContent = opening ? "▾" : "▸";
    if (!opening || ol.dataset.loaded) return;
    ol.innerHTML = '<li class="muted">Betöltés…</li>';
    try {
      const url = btn.dataset.sec;
      const doc = await fetchDoc(url);
      const links = [...doc.querySelectorAll("nav.toc a[href^='#']")];
      ol.innerHTML = links.map(a => '<li><a href="' + esc(url + a.getAttribute("href")) + '" data-pick>' + esc(clean(a.textContent)) + "</a></li>").join("") ||
        '<li class="muted">Nincs szakaszlista.</li>';
      ol.dataset.loaded = "1";
    } catch (e) { ol.innerHTML = '<li class="muted">Nem sikerült betölteni.</li>'; }
  }

  function onBrowseClick(ev) {
    const btn = ev.target.closest(".xref-sec-btn");
    if (btn) { ev.preventDefault(); toggleSections(btn); return; }
    const a = ev.target.closest("a[data-pick]");
    if (!a || ev.button !== 0 || ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.altKey) return;
    ev.preventDefault();
    titleEl.textContent = clean(a.textContent);
    load(a.href);
  }

  function topbarButton() {
    const bar = document.querySelector(".topbar");
    if (!bar || bar.querySelector("[data-xref-browse]")) return;
    const b = document.createElement("button");
    b.type = "button";
    b.className = "icon-btn";
    b.setAttribute("data-xref-browse", "");
    b.title = "Anyag megnyitása az oldalsávban (párhuzamos olvasás)";
    b.textContent = "📑";
    b.addEventListener("click", toggleBrowser);
    const theme = bar.querySelector("[data-theme-toggle]");
    bar.insertBefore(b, theme || null);
  }
  ready(topbarButton);

  function close() {
    if (!panel || panel.hidden) return;
    const a = lastAnchor && lastAnchor.getBoundingClientRect().top > 0 &&
              lastAnchor.getBoundingClientRect().top < innerHeight ? lastAnchor : topElement();
    keepInView(a, () => {
      panel.hidden = true;
      root.classList.remove("xref-open");
      const S = window.Synopsis;
      if (S && S.isTocAuto && S.isTocAuto()) S.setTocCollapsed(false, true);
    });
  }

  document.addEventListener("click", ev => {
    const a = ev.target.closest && ev.target.closest("a.xref");
    if (!a || ev.defaultPrevented) return;
    if (ev.button !== 0 || ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.altKey) return;
    ev.preventDefault();
    open(a.href, a.textContent.trim(), a);
  });

  document.addEventListener("keydown", ev => {
    if (ev.key === "Escape" && panel && !panel.hidden) close();
  });

  window.addEventListener("message", ev => {
    if (!frame || ev.source !== frame.contentWindow) return;
    const d = ev.data || {};
    if (d.type === "xref-close") close();
    if (d.type === "xref-loc") {
      titleEl.textContent = (d.title || "").split(" – ")[0] || titleEl.textContent;
      openLink.href = d.href;
      // Az oldalsávon belüli kattintás új bejegyzés a „vissza” listában.
      if (history[history.length - 1] !== d.href) { history.push(d.href); backBtn.disabled = history.length < 2; }
    }
  });

  // Téma váltásakor az oldalsáv is kövesse.
  new MutationObserver(() => { if (frame) sendTheme(); })
    .observe(root, { attributes: true, attributeFilter: ["data-theme"] });

  window.SynopsisXref = { open, close, showBrowser };
})();
