import json
from playwright.sync_api import sync_playwright
URL = "http://localhost:8721/_parts/ch13/wtest2.html"
OUT = "/forlinux/MEGA/MEGABase/obsidian/Vault/Learning/synopsis/_parts/ch13/shots2/"
errs = []
def shots(page, tag):
    for i, el in enumerate(page.query_selector_all(".widget")):
        el.screenshot(path=f"{OUT}{tag}-w{i+1}.png")
with sync_playwright() as p:
    b = p.chromium.launch()
    for W in (1280, 380):
        for theme in ("light", "dark"):
            pg = b.new_page(viewport={"width": W, "height": 900}, device_scale_factor=1)
            pg.on("console", lambda m: m.type in ("error", "warning") and errs.append(m.text))
            pg.on("pageerror", lambda e: errs.append(str(e)))
            pg.goto(URL); pg.wait_for_timeout(1500)
            if theme == "dark":
                pg.evaluate("document.documentElement.setAttribute('data-theme','dark')"); pg.wait_for_timeout(300)
            w = pg.query_selector_all(".widget")
            r = {}
            r["gcn0"] = w[0].query_selector(".stat-row").inner_text().replace("\n", " ")
            w[0].query_selector("button.primary").click(); pg.wait_for_timeout(4500)
            r["gcn_trained"] = w[0].query_selector(".stat-row").inner_text().replace("\n", " ")
            r["gcn_ro"] = w[0].query_selector(".readout").inner_text()
            shots(pg, f"{W}-{theme}")
            r["overflow"] = pg.evaluate("document.documentElement.scrollWidth > window.innerWidth")
            if W == 1280 and theme == "light":
                r["gat_table"] = w[1].query_selector("table").inner_text()
                r["gat_stats"] = w[1].query_selector(".stat-row").inner_text().replace("\n", " ")
                r["link_table"] = w[2].query_selector("table").inner_text()
                r["link_loss3"] = w[2].query_selector(".stat-row").inner_text().replace("\n", " ")
                w[2].query_selector("input[type=checkbox]").click(); pg.wait_for_timeout(100)
                r["link_loss6"] = w[2].query_selector(".stat-row").inner_text().replace("\n", " ")
                # drag T1 (1;-0,5) to (1;-1,5)
                cv = w[2].query_selector("canvas"); cv.scroll_into_view_if_needed()
                pos = pg.evaluate("""() => { const w=document.querySelectorAll('.widget')[2]; return null; }""")
                bb = cv.bounding_box()
                # locate via the eqView: compute from canvas size (cx=0.25,hx=1.75)
                cw, chh = bb["width"], bb["height"]
                Wd, Hd = cw - 8, chh - 8; s = min(Wd / 3.9, Hd / 3.9); ax, ay = Wd / (2 * s), Hd / (2 * s)
                tx = lambda x: bb["x"] + 4 + (x - (0.25 - ax)) / (2 * ax) * (cw - 8)
                ty = lambda y: bb["y"] + chh - 4 - (y - (0.25 - ay)) / (2 * ay) * (chh - 8)
                pg.mouse.move(tx(1), ty(-0.5)); pg.mouse.down(); pg.mouse.move(tx(1), ty(-1.0), steps=5); pg.mouse.move(tx(1), ty(-1.5), steps=5); pg.mouse.up()
                pg.wait_for_timeout(100)
                r["link_after_drag"] = w[2].query_selector(".stat-row").inner_text().replace("\n", " ")
                r["link_table2"] = w[2].query_selector("table").inner_text()
                w[2].screenshot(path=OUT + "1280-light-link-dragged.png")
                # GAT: manual scores
                w[1].query_selector("input[type=checkbox]").click(); pg.wait_for_timeout(100)
                sl = w[1].query_selector_all("input[type=range]")
                sl[2].evaluate("(e)=>{e.value=-3;e.dispatchEvent(new Event('input'))}")
                sl[3].evaluate("(e)=>{e.value=2.5;e.dispatchEvent(new Event('input'))}")
                r["gat_manual"] = w[1].query_selector("table").inner_text()
                w[1].screenshot(path=OUT + "1280-light-gat-manual.png")
                w[1].query_selector("input[type=checkbox]").click(); pg.wait_for_timeout(100)
                # change h_D to 4, a2 = -1
                nums = w[1].query_selector_all("input[type=number]")
                nums[3].fill("4"); pg.wait_for_timeout(50)
                sl[1].evaluate("(e)=>{e.value=-1;e.dispatchEvent(new Event('input'))}")
                r["gat_neg"] = w[1].query_selector(".readout").inner_text() + " | " + w[1].query_selector(".stat-row").inner_text().replace("\n", " ")
                w[1].screenshot(path=OUT + "1280-light-gat-neg.png")
                # GCN: MLP mode, train
                [x for x in w[0].query_selector_all("button") if x.inner_text().startswith("MLP")][0].click()
                w[0].query_selector("button.primary").click(); pg.wait_for_timeout(4500)
                r["mlp"] = w[0].query_selector(".stat-row").inner_text().replace("\n", " ") + " | " + w[0].query_selector(".readout").inner_text()
                w[0].screenshot(path=OUT + "1280-light-mlp.png")
                # back to GCN, click node 9 to label it, step
                [x for x in w[0].query_selector_all("button") if x.inner_text() == "GCN"][0].click()
                cvg = w[0].query_selector("canvas"); bb = cvg.bounding_box()
                xy = pg.evaluate("window.KARATE13.xy[8]")
                rr = max(7.5, min(11, bb["width"] * 0.028)); pad = rr + 9
                pg.mouse.click(bb["x"] + pad + xy[0] * (bb["width"] - 2 * pad), bb["y"] + pad + xy[1] * (bb["height"] - 2 * pad))
                pg.wait_for_timeout(100)
                w[0].query_selector("button.primary").click(); pg.wait_for_timeout(4500)
                r["gcn_lab9"] = w[0].query_selector(".stat-row").inner_text().replace("\n", " ") + " | " + w[0].query_selector(".readout").inner_text()
                # reset (seed 2) and step
                [x for x in w[0].query_selector_all("button") if "Újrakezdés" in x.inner_text()][0].click()
                [x for x in w[0].query_selector_all("button") if x.inner_text() == "Egy lépés"][0].click()
                r["gcn_reset_step"] = w[0].query_selector(".stat-row").inner_text().replace("\n", " ") + " | " + w[0].query_selector(".controls").inner_text()
            print(W, theme, json.dumps(r, ensure_ascii=False, indent=1))
            pg.close()
    b.close()
print("ERRORS:", errs)
