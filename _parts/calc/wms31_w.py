import sys
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch()
    for mob in [False, True]:
        ctx = b.new_context(viewport={"width": 380, "height": 800}, has_touch=mob, is_mobile=mob)
        pg = ctx.new_page()
        pg.add_init_script("window._log=[]; document.addEventListener('DOMContentLoaded', () => _log.push(['dcl', innerWidth, document.documentElement.clientWidth])); addEventListener('resize', () => _log.push(['resize', innerWidth]));")
        pg.goto(f"http://127.0.0.1:{sys.argv[1]}/_parts/ms3/wtest1.html"); pg.wait_for_timeout(1500)
        print(mob, pg.evaluate("_log"), pg.evaluate("[...document.querySelectorAll('canvas')].map(c => c.style.width + '/' + Math.round(c.getBoundingClientRect().width))"))
    b.close()
