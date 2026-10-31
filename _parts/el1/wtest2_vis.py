import sys
from playwright.sync_api import sync_playwright
port = sys.argv[1]
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": 1000, "height": 500})
    pg.goto(f"http://localhost:{port}/_parts/el1/wtest2.html"); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(500)
    E = "document.querySelector('.widget[data-widget=esd-spark]')"
    pg.evaluate("window.scrollTo(0, document.body.scrollHeight)"); pg.wait_for_timeout(500)
    print("esd rect bottom", pg.evaluate(f"{E}.getBoundingClientRect().bottom"), "raf", pg.evaluate(f"{E}.__esd.get().raf"))
    pg.evaluate(f"{E}.scrollIntoView()"); pg.wait_for_timeout(500)
    print("esd visible raf", pg.evaluate(f"{E}.__esd.get().raf"))
    b.close()
