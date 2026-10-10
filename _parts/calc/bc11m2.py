import sys
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 400, "height": 800})
    pg.goto(f"http://localhost:{sys.argv[1]}/mesterseges-intelligencia/11-konvolucios-halok/", wait_until="networkidle"); pg.wait_for_timeout(1500)
    print(pg.evaluate("""() => [...document.querySelectorAll('body *')].filter(e => !e.closest('.katex-mathml') && e.getBoundingClientRect().right > 401 && e.getBoundingClientRect().width > 0)
       .filter(e => ![...e.children].some(c => c.getBoundingClientRect().right > 401 && !c.closest('.katex-mathml')))
       .slice(0,12).map(e => { const r = e.getBoundingClientRect(); let a = e; while (a && !a.id) a = a.parentElement; return e.tagName + '.' + (e.className.baseVal ?? e.className) + ' right=' + Math.round(r.right) + ' in #' + (a ? a.id : '') + ' :: ' + (e.innerText || '').slice(0, 60); })"""))
    b.close()
