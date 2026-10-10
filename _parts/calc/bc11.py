"""Böngészős ellenőrzés (11. fejezet). Használat: uv run --with playwright python -I bc9.py <port> <útvonal> <kimeneti mappa> [interact]"""
import sys, json
from playwright.sync_api import sync_playwright
port, path, out = sys.argv[1], sys.argv[2], sys.argv[3]
interact = len(sys.argv) > 4
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1280, "height": 900})
    errs = []
    pg.on("console", lambda m: m.type in ("error", "warning") and errs.append(f"{m.type}: {m.text}"))
    pg.on("pageerror", lambda e: errs.append(f"pageerror: {e}"))
    pg.goto(f"http://localhost:{port}/{path}", wait_until="networkidle")
    pg.wait_for_timeout(2500)
    info = pg.evaluate("""() => {
      const r = {};
      r.katexErrors = [...document.querySelectorAll('.katex-error')].map(e => e.getAttribute('title') || e.textContent).slice(0, 20);
      r.rawDollar = [...document.querySelectorAll('main p, main li, main td, main div.box, .readout, .w-sub')].filter(e => /\\$[^$]+\\$/.test(e.innerText)).map(e => e.innerText.slice(0, 120)).slice(0, 10);
      r.practiceOpen = document.querySelectorAll('details.box.practice[open]').length;
      r.practiceTotal = document.querySelectorAll('details.box.practice').length;
      r.quizWraps = document.querySelectorAll('.quiz details').length;
      r.quizOpen = document.querySelectorAll('.quiz > details[open]').length;
      r.quizDivs = document.querySelectorAll('.quiz').length;
      r.badAnchors = [...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href').slice(1)).filter(id => id && !document.getElementById(id));
      r.widgets = [...document.querySelectorAll('.widget[data-widget]')].map(w => ({
        name: w.dataset.widget, canvases: w.querySelectorAll('canvas').length,
        err: /Hiba/.test(w.innerText) ? w.innerText.slice(0, 200) : '' }));
      r.extLinks = [...document.querySelectorAll('a[href^="../"]')].map(a => a.getAttribute('href'));
      return r;
    }""")
    print(json.dumps(info, ensure_ascii=False, indent=1))
    if True:
        print(pg.evaluate("""() => [...document.querySelectorAll('.widget .readout')].map(r => r.closest('.widget').dataset.widget + ': ' + r.innerText.replace(/\\s+/g,' ').slice(0,260))"""))
    print("console:", *errs[:30], sep="\n  ")
    themes = ("light", "dark") if not interact else ("light",)
    for theme in themes:
        pg.evaluate(f"document.documentElement.setAttribute('data-theme','{theme}')")
        pg.wait_for_timeout(400)
        for w in pg.query_selector_all(".widget[data-widget]"):
            name = w.get_attribute("data-widget")
            w.scroll_into_view_if_needed(); pg.wait_for_timeout(150)
            w.screenshot(path=f"{out}/w-{name}-{theme}.png")
    b.close()
