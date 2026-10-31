
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
    document.querySelectorAll(".widget-static[data-fieldpic]").forEach(el => {
      try { W.__fieldpic && W.__fieldpic(el); } catch (e) { console.error(e); }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
