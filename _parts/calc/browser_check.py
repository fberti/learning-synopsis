"""Böngészős ellenőrzés a 8. fejezethez: konzolhibák, KaTeX-hibák, lenyílók, widgetek, képernyőképek.
Használat: uv run --with playwright python -I browser_check.py <port> <kimeneti mappa>"""
import sys, json
from playwright.sync_api import sync_playwright

port, out = sys.argv[1], sys.argv[2]
url = f"http://localhost:{port}/mesterseges-intelligencia/08-felugyelet-nelkuli-tanulas/"
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1280, "height": 900})
    errs = []
    pg.on("console", lambda m: m.type in ("error", "warning") and errs.append(f"{m.type}: {m.text}"))
    pg.on("pageerror", lambda e: errs.append(f"pageerror: {e}"))
    pg.goto(url, wait_until="networkidle")
    pg.wait_for_timeout(2500)
    info = pg.evaluate("""() => {
      const r = {};
      r.katexErrors = [...document.querySelectorAll('.katex-error')].map(e => e.getAttribute('title') || e.textContent).slice(0, 20);
      r.rawDollar = [...document.querySelectorAll('main p, main li, main td, main div.box')].filter(e => /\\$[^$]+\\$/.test(e.innerText)).map(e => e.innerText.slice(0, 120)).slice(0, 10);
      r.practiceOpen = document.querySelectorAll('details.box.practice[open]').length;
      r.practiceTotal = document.querySelectorAll('details.box.practice').length;
      r.quizWraps = document.querySelectorAll('.quiz details.quiz-wrap').length;
      r.quizOpen = document.querySelectorAll('.quiz details.quiz-wrap[open]').length;
      r.quizDivs = document.querySelectorAll('.quiz').length;
      r.widgets = [...document.querySelectorAll('.widget[data-widget]')].map(w => ({
        name: w.dataset.widget, canvases: w.querySelectorAll('canvas').length, tables: w.querySelectorAll('table').length,
        err: /Hiba/.test(w.innerText) ? w.innerText.slice(0, 200) : '' }));
      return r;
    }""")
    print(json.dumps(info, ensure_ascii=False, indent=1))
    print("console:", *errs[:30], sep="\n  ")
    for theme in ("light", "dark"):
        pg.evaluate(f"document.documentElement.setAttribute('data-theme','{theme}')")
        pg.wait_for_timeout(400)
        for w in pg.query_selector_all(".widget[data-widget]"):
            name = w.get_attribute("data-widget")
            w.scroll_into_view_if_needed(); pg.wait_for_timeout(150)
            w.screenshot(path=f"{out}/w-{name}-{theme}.png")
    b.close()
