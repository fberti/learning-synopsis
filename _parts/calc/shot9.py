import sys
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": 1280, "height": 900})
    pg.goto("http://localhost:8765/mesterseges-intelligencia/09-neuralis-halozatok/", wait_until="networkidle"); pg.wait_for_timeout(2000)
    for sel in sys.argv[1:]:
        e = pg.query_selector(sel); e.scroll_into_view_if_needed(); e.screenshot(path=f"../shots/s-{sel.strip('#').replace(' ','_')}.png")
    pg.set_viewport_size({"width": 390, "height": 800}); pg.wait_for_timeout(500)
    e = pg.query_selector('.widget[data-widget="nn-playground"]'); e.scroll_into_view_if_needed(); pg.wait_for_timeout(300); e.screenshot(path="../shots/m-playground.png")
    b.close()
