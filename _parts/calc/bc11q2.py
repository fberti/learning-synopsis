import sys
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": 900, "height": 900})
    pg.goto(f"http://localhost:{sys.argv[1]}/mesterseges-intelligencia/11-konvolucios-halok/", wait_until="networkidle"); pg.wait_for_timeout(1500)
    q = pg.query_selector('.quiz[data-quiz="ai11-113"]'); q.scroll_into_view_if_needed()
    q.query_selector('summary').click(); pg.wait_for_timeout(600)
    q.screenshot(path="_parts/ch11/shots11/quiz113.png"); b.close()
