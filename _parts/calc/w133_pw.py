import os, sys
from playwright.sync_api import sync_playwright
URL = "http://localhost:8731/_parts/ch13/wtest3.html"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "ch13", "shots3")
errs = []
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": 1280, "height": 900})
    pg.on("console", lambda m: m.type in ("error", "warning") and errs.append(m.text))
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(URL); pg.wait_for_timeout(1500)
    mol = pg.locator('[data-widget="molecule-readout"]')
    sels = mol.locator("select")
    def st(L, R, k, ro):
        sels.nth(0).select_option(L); sels.nth(1).select_option(R)
        mol.get_by_role("button", name=f"k = {k}", exact=True).click()
        mol.get_by_role("button", name=ro, exact=True).click()
        rs = mol.locator(".readout").all_inner_texts()
        return [r.split("\n")[-1] for r in rs[:2]], rs[2], mol.locator("div.muted").first.inner_text()[:60]
    for c in [("metanol","glioxal",0,"átlag"),("metanol","glioxal",0,"összeg"),("metanol","glioxal",0,"maximum"),("metanol","glioxal",1,"maximum"),
              ("etanol","dme",0,"összeg"),("etanol","dme",1,"összeg"),("benzol","ket",2,"összeg"),("benzol","ket",1,"átlag"),("propan","ciklo",0,"összeg")]:
        print(c, st(*c))
    wl = pg.locator('[data-widget="wl-test"]')
    for name in ["hatszög vs. két háromszög","út vs. csillag","a futó példa vs. átszámozva","dekalin vs. biciklopentil","a futó példa vs. út"]:
        wl.get_by_role("button", name=name, exact=True).click()
        log = []
        for i in range(8):
            v = wl.locator(".readout").inner_text()
            log.append(f"{i}:{'DIFF' if 'eltérnek' in v else ('SAME-STABLE' if 'nem tudja' in v else 'eq')}")
            if wl.get_by_role("button", name="Egy lépés").is_disabled(): break
            wl.get_by_role("button", name="Egy lépés").click()
        print(name, log, wl.locator(".controls span").last.inner_text())
    # running example colours per step
    wl.get_by_role("button", name="a futó példa vs. út", exact=True).click()
    for i in range(3):
        print("step", i, pg.evaluate("""() => { return null }"""))
        wl.get_by_role("button", name="Egy lépés").click()
    os_ = pg.locator('[data-widget="oversmoothing"]')
    rng = os_.locator("input[type=range]")
    for k in [0,1,5,10,20,30]:
        rng.nth(0).fill(str(k)); print(k, os_.locator(".readout").first.inner_text().replace("\n"," | ")[:400])
    os_.locator("input[type=checkbox]").check()
    for k in [1,30]:
        rng.nth(0).fill(str(k)); print("alpha", k, os_.locator(".readout").first.inner_text().replace("\n"," | ")[:400])
    for k in [0,2,5,30]:
        rng.nth(0).fill(str(k)); print("karate", k, os_.locator(".readout").nth(1).inner_text().split("\n")[0])
    os_.locator("input[type=checkbox]").uncheck()
    for k in [0,2,5,30]:
        rng.nth(0).fill(str(k)); print("karate plain", k, os_.locator(".readout").nth(1).inner_text().split("\n")[0])
    print("ERRS", errs)
    b.close()
