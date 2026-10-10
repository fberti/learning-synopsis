import sys
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(); errs = []
    for url in ["mesterseges-intelligencia/11-konvolucios-halok/", "mesterseges-intelligencia/", "", "mesterseges-intelligencia/10-halo-tanitasa/"]:
        pg = b.new_page(viewport={"width": 400, "height": 800})
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(f"http://localhost:{sys.argv[1]}/{url}", wait_until="networkidle"); pg.wait_for_timeout(1500)
        print(url or "/", pg.evaluate("""() => ({sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth,
          wide: [...document.querySelectorAll('main *')].filter(e => e.getBoundingClientRect().right > document.documentElement.clientWidth + 2 && !e.closest('table, .katex-display, pre, .toc')).slice(0,5).map(e => e.tagName + '.' + e.className + ' ' + Math.round(e.getBoundingClientRect().right)),
          prog: [...document.querySelectorAll('[data-progress]')].filter(e => e.dataset.progress.includes('ai11')).length})"""))
    print("errors", errs); b.close()
