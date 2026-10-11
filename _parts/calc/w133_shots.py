import os
from playwright.sync_api import sync_playwright
URL = "http://localhost:8731/_parts/ch13/wtest3.html"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "ch13", "shots3")
errs = []
with sync_playwright() as p:
    b = p.chromium.launch()
    for W in (1280, 380):
        for theme in ("light", "dark"):
            pg = b.new_page(viewport={"width": W, "height": 900}, device_scale_factor=1)
            pg.on("console", lambda m: m.type in ("error", "warning") and errs.append(m.text))
            pg.on("pageerror", lambda e: errs.append(str(e)))
            pg.goto(URL); pg.wait_for_timeout(1500)
            if theme == "dark": pg.evaluate("document.documentElement.setAttribute('data-theme','dark')"); pg.wait_for_timeout(300)
            mol = pg.locator('[data-widget="molecule-readout"]')
            if theme == "dark":
                mol.locator("select").nth(0).select_option("benzol"); mol.locator("select").nth(1).select_option("ket")
                mol.get_by_role("button", name="k = 2", exact=True).click()
            mol.screenshot(path=f"{OUT}/mol-{W}-{theme}.png")
            wl = pg.locator('[data-widget="wl-test"]')
            if theme == "dark": wl.get_by_role("button", name="dekalin vs. biciklopentil", exact=True).click()
            wl.get_by_role("button", name="Egy lépés").click(); wl.get_by_role("button", name="Egy lépés").click()
            wl.screenshot(path=f"{OUT}/wl-{W}-{theme}.png")
            os_ = pg.locator('[data-widget="oversmoothing"]')
            os_.locator("input[type=range]").nth(0).fill("3")
            if theme == "dark": os_.locator("input[type=checkbox]").check()
            os_.screenshot(path=f"{OUT}/os-{W}-{theme}.png")
            pg.close()
    print("ERRS", errs)
    b.close()
