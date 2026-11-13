import os, json, sys
from playwright.sync_api import sync_playwright
URL = "http://localhost:8831/_parts/ch14/wtest3.html"
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "ch14", "shots3")
errs = []
res = {}
with sync_playwright() as p:
    b = p.chromium.launch()
    for W in (1280, 380):
        for theme in ("light", "dark"):
            pg = b.new_page(viewport={"width": W, "height": 900}, device_scale_factor=1)
            pg.on("console", lambda m: m.type in ("error", "warning") and errs.append(m.text))
            pg.on("pageerror", lambda e: errs.append(str(e)))
            pg.goto(URL); pg.wait_for_timeout(1500)
            if theme == "dark": pg.evaluate("document.documentElement.setAttribute('data-theme','dark')"); pg.wait_for_timeout(300)
            sw = pg.evaluate("document.documentElement.scrollWidth")
            if sw > W: errs.append(f"hscroll {W} {theme}: {sw}")
            d2 = pg.locator('[data-widget="diffusion-2d"]')
            if theme == "dark": d2.get_by_role("button", name="mosoly").click()
            d2.screenshot(path=f"{OUT}/d2fwd-{W}-{theme}.png")
            d2.get_by_role("button", name="Visszafelé: mintavétel").click()
            pg.wait_for_timeout(1200)
            d2.screenshot(path=f"{OUT}/d2mid-{W}-{theme}.png")
            pg.wait_for_timeout(3500)
            if theme == "dark": d2.locator("input[type=checkbox]").check()
            d2.screenshot(path=f"{OUT}/d2end-{W}-{theme}.png")
            if W == 1280 and theme == "light":
                # számok h és mód szerint (50 lépés, alap mag)
                for shape in ("spirál", "két félhold", "mosoly"):
                    d2.get_by_role("button", name=shape, exact=True).click()
                    for mode in ("DDIM (determinisztikus)", "DDPM (sztochasztikus)"):
                        d2.get_by_role("button", name=mode).click()
                        for hv in ("0", "0.02", "0.05", "0.1", "0.2"):
                            d2.locator("input[type=range]").nth(1).fill(hv)
                            r = pg.evaluate("(() => { const o = document.querySelector('[data-widget=\"diffusion-2d\"]').__w3; return [o.stats.copy, o.stats.med, o.h, o.nSteps, o.eta]; })()")
                            res[f"{shape}|{mode[:4]}|h={hv}"] = r
                    d2.get_by_role("button", name="DDIM (determinisztikus)").click()
                # dump for python check: spiral, DDIM, h=0.05
                d2.get_by_role("button", name="spirál", exact=True).click()
                for hv in ("0", "0.05"):
                    d2.locator("input[type=range]").nth(1).fill(hv)
                    o = pg.evaluate("(() => { const o = document.querySelector('[data-widget=\"diffusion-2d\"]').__w3; return {data:o.data, start:o.start, final:o.final, ts:o.ts, stats:o.stats}; })()")
                    json.dump(o, open(os.path.join(HERE, f"w143_dump_h{hv}.json"), "w"))
                d2.get_by_role("button", name="1000", exact=True).click()
                for hv in ("0", "0.02", "0.05", "0.1"):
                    d2.locator("input[type=range]").nth(1).fill(hv); d2.locator("input[type=range]").nth(1).dispatch_event("change")
                    r = pg.evaluate("(() => { const o = document.querySelector('[data-widget=\"diffusion-2d\"]').__w3; return [o.stats.copy, o.stats.med, o.h, o.nSteps]; })()")
                    res[f"spirál|DDIM|h={hv}|n=1000"] = r
                    if hv == "0":
                        o = pg.evaluate("(() => { const o = document.querySelector('[data-widget=\"diffusion-2d\"]').__w3; return {data:o.data, start:o.start, final:o.final, ts:o.ts, stats:o.stats}; })()")
                        json.dump(o, open(os.path.join(HERE, "w143_dump_h0_n1000.json"), "w"))
                d2.locator("input[type=range]").nth(1).fill("0.05"); d2.locator("input[type=range]").nth(1).dispatch_event("change")
                for n in ("5", "10", "25"):
                    d2.get_by_role("button", name=n, exact=True).click()
                    r = pg.evaluate("(() => { const o = document.querySelector('[data-widget=\"diffusion-2d\"]').__w3; return [o.stats.copy, o.stats.med, o.h, o.nSteps]; })()")
                    res[f"spirál|DDIM|h=0.05|n={n}"] = r
                d2.get_by_role("button", name="50", exact=True).click()
            dd = pg.locator('[data-widget="diffusion-digits"]')
            if theme == "dark":
                dd.get_by_role("button", name="x̂₀ (a háló tippje a tiszta képre)").click()
                dd.locator("input[type=range]").fill("700")
            dd.screenshot(path=f"{OUT}/dd-{W}-{theme}.png")
            cf = pg.locator('[data-widget="cfg-2d"]')
            if W == 1280 and theme == "light":
                for cl in ("A osztály", "B osztály"):
                    cf.get_by_role("button", name=cl).click()
                    for sv in ("s = 0", "s = 1", "s = 3", "s = 7,5"):
                        cf.get_by_role("button", name=sv, exact=True).click()
                        r = pg.evaluate("(() => { const o = document.querySelector('[data-widget=\"cfg-2d\"]').__w3; return [o.R.sure, o.R.mid, o.R.spread, o.R.out, o.R.mean]; })()")
                        res[f"cfg|{cl}|{sv}"] = r
                    if cl == "A osztály":
                        o = pg.evaluate("(() => { const o = document.querySelector('[data-widget=\"cfg-2d\"]').__w3; return {start:o.start}; })()")
                        json.dump(o, open(os.path.join(HERE, "w143_dump_cfg.json"), "w"))
                cf.get_by_role("button", name="A osztály").click()
                cf.get_by_role("button", name="s = 3", exact=True).click()
            if theme == "dark":
                cf.get_by_role("button", name="s = 7,5", exact=True).click()
            cf.screenshot(path=f"{OUT}/cfg-{W}-{theme}.png")
            pg.close()
    b.close()
print("ERRS", errs)
for k, v in res.items(): print(k, v)
json.dump(res, open(os.path.join(HERE, "w143_widget_numbers.json"), "w"), indent=1)
