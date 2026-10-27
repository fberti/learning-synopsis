import sys, json
from playwright.sync_api import sync_playwright
URL = "http://localhost:8792/_parts/ms3/wtest2.html"
OUT = sys.argv[1]
res = {}
with sync_playwright() as p:
    b = p.chromium.launch()
    for theme in ("light", "dark"):
        for W in (1280, 380):
            pg = b.new_page(viewport={"width": W, "height": 900})
            errs = []
            pg.on("console", lambda m: m.type in ("error", "warning") and errs.append(m.text))
            pg.on("pageerror", lambda e: errs.append("PAGEERROR " + str(e)))
            pg.add_init_script(f"localStorage.setItem('synopsis:theme', '{theme}')")
            pg.goto(URL); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(500)
            key = f"{theme}-{W}"
            # horizontal overflow check
            res[key + "-overflow"] = pg.evaluate("document.documentElement.scrollWidth - innerWidth")
            for wid in ("w-ca", "w-ss", "w-sp", "w-cf"):
                pg.locator("#" + wid).screenshot(path=f"{OUT}/{key}-{wid}.png")
            if theme == "light" and W == 1280:
                ca = pg.locator("#w-ca")
                stats = lambda loc: loc.locator(".stat").evaluate_all("els => els.map(e => e.querySelector('.l').innerText.replace(/\\s+/g,' ') + ' = ' + e.querySelector('.v').innerText)")
                for i in range(4):
                    ca.locator("select").select_option(str(i)); pg.wait_for_timeout(100)
                    exp = ca.locator("table").nth(1).locator("td").evaluate_all("els => els.map(e => e.innerText)")
                    res[f"ca-preset{i}"] = stats(ca); res[f"ca-preset{i}-exp"] = exp
                ca.locator("select").select_option("0")
                ca.get_by_role("button", name="minden cella × 2").click(); pg.wait_for_timeout(100)
                res["ca-x2"] = stats(ca); res["ca-x2-msg"] = ca.locator(".readout").inner_text()
                # type into a cell: zero row
                ca.locator("select").select_option("0")
                inp = ca.locator("input[type=number]")
                inp.nth(0).fill("0"); inp.nth(1).fill("0"); pg.wait_for_timeout(100)
                res["ca-zero-row"] = stats(ca); res["ca-zero-msg"] = ca.locator(".readout").inner_text()
                ca.get_by_role("button", name="3×3").click(); pg.wait_for_timeout(100)
                res["ca-3x3"] = stats(ca)
                ca.locator("#w-ca select, select").first.select_option("1"); pg.wait_for_timeout(100)
                ca.screenshot(path=f"{OUT}/int-ca-preset2.png")
                # simpson
                ss = pg.locator("#w-ss")
                res["ss-base"] = stats(ss); res["ss-msg"] = ss.locator(".readout").first.inner_text()
                sl = ss.locator("input[type=range]")
                sl.nth(0).evaluate("e => { e.value = 20; e.dispatchEvent(new Event('input')) }")
                res["ss-20-20"] = stats(ss); res["ss-msg2"] = ss.locator(".readout").first.inner_text()
                sl.nth(0).evaluate("e => { e.value = 100; e.dispatchEvent(new Event('input')) }")
                sl.nth(1).evaluate("e => { e.value = 0; e.dispatchEvent(new Event('input')) }")
                res["ss-100-0"] = stats(ss); ss.screenshot(path=f"{OUT}/int-ss-extreme.png")
                ss.get_by_role("button", name="Berkeley, 1973 (valódi adatok)").click(); pg.wait_for_timeout(150)
                res["ss-berk"] = stats(ss)
                ss.screenshot(path=f"{OUT}/int-ss-berk.png")
                # spurious
                sp = pg.locator("#w-sp")
                res["sp-r0"] = stats(sp)
                sp.get_by_role("button", name="1000 pár szimulálása").click(); pg.wait_for_timeout(300)
                res["sp-sim50"] = stats(sp)
                sp.locator("input[type=range]").evaluate("e => { e.value = 200; e.dispatchEvent(new Event('input')) }"); pg.wait_for_timeout(300)
                res["sp-sim200"] = stats(sp)
                sp.locator("input[type=range]").evaluate("e => { e.value = 20; e.dispatchEvent(new Event('input')) }"); pg.wait_for_timeout(300)
                res["sp-sim20"] = stats(sp)
                sp.locator("input[type=range]").evaluate("e => { e.value = 50; e.dispatchEvent(new Event('input')) }"); pg.wait_for_timeout(300)
                res["sp-sim50b"] = stats(sp)
                sp.get_by_role("button", name="független zaj").click(); pg.wait_for_timeout(100)
                for k in range(3):
                    sp.get_by_role("button", name="Új pár").click()
                res["sp-noise"] = stats(sp)
                sp.screenshot(path=f"{OUT}/int-sp-sim.png")
                # confounder
                cf = pg.locator("#w-cf")
                bands = {}
                sl = cf.locator("input[type=range]")
                for c in (4, 8, 12, 14, 16, 18, 20, 22, 24, 26):
                    sl.nth(0).evaluate(f"e => {{ e.value = {c}; e.dispatchEvent(new Event('input')) }}")
                    bands[c] = stats(cf)[3:]
                res["cf-base"] = stats(cf)[:3]; res["cf-bands"] = bands
                sl.nth(0).evaluate("e => { e.value = 18; e.dispatchEvent(new Event('input')) }")
                cf.locator("input[type=checkbox]").check(); pg.wait_for_timeout(100)
                cf.screenshot(path=f"{OUT}/int-cf-only.png")
                # theme toggle at runtime
                pg.evaluate("document.documentElement.setAttribute('data-theme','dark')"); pg.wait_for_timeout(200)
                cf.screenshot(path=f"{OUT}/int-cf-only-dark.png")
            if W == 380 and theme == "light":
                # touch-ish drag not needed; check that tab switch draws canvas at proper width
                ss = pg.locator("#w-ss")
                ss.get_by_role("button", name="Berkeley, 1973 (valódi adatok)").click(); pg.wait_for_timeout(150)
                ss.screenshot(path=f"{OUT}/int-ss-berk-380.png")
                res["ss-berk-380-canvas"] = ss.locator("canvas").nth(1).evaluate("c => c.style.width")
            res[key + "-errors"] = errs
            pg.close()
    b.close()
print(json.dumps(res, ensure_ascii=False, indent=1))
