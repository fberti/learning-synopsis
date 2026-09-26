/* =========================================================
   Synopsis – közös segédfüggvények
   (téma, KaTeX-renderelés, tartalomjegyzék-követés, haladás)
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Téma (világos / sötét) ---------- */
  const THEME_KEY = "synopsis:theme";
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    document.querySelectorAll("[data-theme-toggle]").forEach(b => (b.textContent = t === "dark" ? "☀️" : "🌙"));
  }
  const saved = localStorage.getItem(THEME_KEY);
  applyTheme(saved || (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));

  /* ---------- KaTeX ---------- */
  function renderMath(el) {
    if (!window.renderMathInElement) return;
    window.renderMathInElement(el || document.body, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "\\[", right: "\\]", display: true },
        { left: "$", right: "$", display: false },
        { left: "\\(", right: "\\)", display: false }
      ],
      throwOnError: false
    });
  }

  /* ---------- Haladás (localStorage) ---------- */
  const Progress = {
    key: id => "synopsis:quiz:" + id,
    save(id, score, total) {
      const prev = Progress.get(id);
      if (!prev || score >= prev.best) {
        localStorage.setItem(Progress.key(id), JSON.stringify({ best: score, total, at: Date.now() }));
      }
    },
    get(id) {
      try { return JSON.parse(localStorage.getItem(Progress.key(id))); } catch (e) { return null; }
    },
    /* összesített arány egy kvízlistára (0..1) */
    ratio(ids) {
      let got = 0, tot = 0;
      ids.forEach(id => {
        const p = Progress.get(id);
        if (p) { got += p.best; tot += p.total; }
      });
      return { done: ids.filter(id => Progress.get(id)).length, all: ids.length, score: tot ? got / tot : 0 };
    }
  };

  function paintProgress() {
    document.querySelectorAll("[data-progress]").forEach(el => {
      const ids = el.getAttribute("data-progress").split(/\s*,\s*/).filter(Boolean);
      const r = Progress.ratio(ids);
      const bar = el.querySelector("span");
      if (bar) bar.style.width = Math.round((r.done / Math.max(1, r.all)) * 100) + "%";
      const lbl = el.parentElement.querySelector("[data-progress-label]");
      if (lbl) lbl.textContent = r.done
        ? `Kitöltött kvízek: ${r.done}/${r.all} · átlagos eredmény: ${Math.round(r.score * 100)}%`
        : `Még egy kvízt sem töltöttél ki (${r.all} db).`;
    });
  }

  /* ---------- Tartalomjegyzék: aktív szakasz kiemelése ---------- */
  function scrollSpy() {
    const links = [...document.querySelectorAll(".toc a[href^='#']")];
    if (!links.length) return;
    const targets = links.map(a => document.getElementById(a.getAttribute("href").slice(1))).filter(Boolean);
    const bar = document.querySelector(".progressbar");
    function onScroll() {
      const y = window.scrollY + 90;
      let cur = targets[0];
      for (const t of targets) if (t.offsetTop <= y) cur = t;
      links.forEach(a => a.classList.toggle("active", cur && a.getAttribute("href") === "#" + cur.id));
      if (bar) {
        const h = document.documentElement.scrollHeight - innerHeight;
        bar.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + "%";
      }
    }
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Villámkártyák ---------- */
  function flashcards() {
    document.querySelectorAll(".flash").forEach(f => f.addEventListener("click", () => f.classList.toggle("flipped")));
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-theme-toggle]").forEach(b => {
      b.addEventListener("click", () => {
        const t = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        localStorage.setItem(THEME_KEY, t);
        applyTheme(t);
      });
    });
    applyTheme(document.documentElement.getAttribute("data-theme"));
    paintProgress();
    scrollSpy();
    flashcards();
  });

  /* KaTeX betöltése után renderelünk (defer-rel töltött szkriptek) */
  window.addEventListener("load", () => renderMath(document.body));

  window.Synopsis = { renderMath, Progress, paintProgress };
})();
