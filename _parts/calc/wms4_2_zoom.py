import sys
from playwright.sync_api import sync_playwright
PORT, OUT, W, sel, idx = sys.argv[1], sys.argv[2], int(sys.argv[3]), sys.argv[4], int(sys.argv[5])
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": W, "height": 900}, device_scale_factor=2)
    pg.goto(f"http://localhost:{PORT}/_parts/ms4/wtest2.html"); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(500)
    pg.locator(sel).locator("canvas").nth(idx).screenshot(path=OUT); b.close()
