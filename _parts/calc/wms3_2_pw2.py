import sys
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": 380, "height": 900}); errs=[]
    pg.on("pageerror", lambda e: errs.append(str(e))); pg.on("console", lambda m: m.type=="error" and errs.append(m.text))
    pg.add_init_script("localStorage.setItem('synopsis:theme','dark')")
    pg.goto("http://localhost:8792/_parts/ms3/wtest2.html"); pg.wait_for_load_state("networkidle")
    ca = pg.locator("#w-ca"); ca.locator("select").select_option("2")
    inp = ca.locator("input[type=number]").nth(8)
    inp.click(); pg.keyboard.press("Control+A"); pg.keyboard.type("120")
    print("focused:", pg.evaluate("document.activeElement.value"), "N:", ca.locator("[data-n]").inner_text())
    ca.screenshot(path=sys.argv[1] + "/int-ca-3x3-380-dark.png")
    print(errs)
    b.close()
