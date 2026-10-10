import sys
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": 1280, "height": 900}); errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(f"http://localhost:{sys.argv[1]}/mesterseges-intelligencia/11-konvolucios-halok/", wait_until="networkidle"); pg.wait_for_timeout(1500)
    for _ in range(3):
        pg.evaluate("document.querySelectorAll('details').forEach(d => { if (!d.open) { d.open = true; d.dispatchEvent(new Event('toggle')); } })"); pg.wait_for_timeout(700)
    print(pg.evaluate("""() => ({ katex: [...document.querySelectorAll('.katex-error')].map(e => e.title).slice(0,10),
      raw: [...document.querySelectorAll('.quiz *')].filter(e => e.children.length === 0 && /\\$[^$\\s][^$]*\\$/.test(e.textContent) && e.tagName !== 'OPTION').map(e => e.textContent.slice(0,80)).slice(0,10),
      selects: [...document.querySelectorAll('.quiz option')].filter(o => /\\$/.test(o.textContent)).map(o => o.textContent).slice(0,5),
      qcount: document.querySelectorAll('.quiz .q, .quiz .question, .quiz li.q').length })"""))
    print("errors", errs); b.close()
