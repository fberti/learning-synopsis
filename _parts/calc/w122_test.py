import sys, json
from playwright.sync_api import sync_playwright
URL = "http://localhost:8762/_parts/ch12/wtest2.html"
OUT = "/forlinux/MEGA/MEGABase/obsidian/Vault/Learning/synopsis/_parts/ch12/shots2/"
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
                pg.evaluate("document.documentElement.setAttribute('data-theme','dark')"); pg.wait_for_timeout(400)
            shots(pg, f"{W}-{theme}")
            if W == 1280 and theme == "light":
                r = {}
                w = pg.query_selector_all(".widget")
                # qkv readout default (levél row)
                r["qkv_default"] = w[1].query_selector(".readout").inner_text()
                r["qkv_stats"] = w[1].query_selector(".stat-row").inner_text()
                cbs = w[1].query_selector_all("input[type=checkbox]")
                cbs[0].click(); pg.wait_for_timeout(100)
                r["qkv_unscaled"] = w[1].query_selector(".readout").inner_text()
                cbs[0].click(); cbs[1].click(); pg.wait_for_timeout(100)
                # click fa row of first step table
                w[1].query_selector_all("table")[4].query_selector_all("tr")[1].click()
                r["qkv_causal_fa"] = w[1].query_selector(".readout").inner_text()
                w[1].screenshot(path=OUT + "1280-light-qkv-causal.png")
                cbs = w[1].query_selector_all("input[type=checkbox]"); cbs[1].click()
                w[1].query_selector_all("button")[1].click(); pg.wait_for_timeout(100)
                r["qkv_B"] = w[1].query_selector(".readout").inner_text()
                w[1].query_selector_all("button")[3].click(); pg.wait_for_timeout(100)
                r["qkv_otherW"] = w[1].query_selector(".stat-row").inner_text()
                w[1].screenshot(path=OUT + "1280-light-qkv-B-otherW.png")
                # translation: hover a cell, switch sentence, eos, layer 1 (heads disabled)
                cv = w[0].query_selector("canvas"); cv.scroll_into_view_if_needed(); bb = cv.bounding_box()
                pg.mouse.move(bb["x"] + bb["width"] * 0.5, bb["y"] + bb["height"] * 0.6); pg.wait_for_timeout(100)
                r["mt_hover"] = w[0].query_selectorAll if False else w[0].query_selector_all(".readout")[1].inner_text()
                w[0].query_selector("select").select_option("Lehullott a levél a fáról."); pg.wait_for_timeout(100)
                w[0].query_selector("input[type=checkbox]").click(); pg.wait_for_timeout(100)
                pg.mouse.move(0, 0)
                r["mt_eos"] = w[0].query_selector_all(".readout")[1].inner_text()
                btns = w[0].query_selector_all("button")
                [x for x in btns if x.inner_text() == "3. fej"][0].click(); pg.wait_for_timeout(100)
                w[0].screenshot(path=OUT + "1280-light-mt-eos-head3.png")
                [x for x in btns if x.inner_text() == "1"][0].click(); pg.wait_for_timeout(100)
                r["mt_l1_disabled"] = pg.evaluate("[...document.querySelectorAll('.widget')[0].querySelectorAll('button')].filter(b=>b.textContent==='3. fej')[0].disabled")
                # PE
                r["pe_table"] = w[2].query_selector(".tw table").inner_text()
                cv = w[2].query_selector("canvas"); cv.scroll_into_view_if_needed(); bb = cv.bounding_box()
                pg.mouse.click(bb["x"] + bb["width"] * 0.3, bb["y"] + bb["height"] * 0.5); pg.wait_for_timeout(100)
                r["pe_hover"] = w[2].query_selector_all(".readout")[0].inner_text()
                r["pe_cos"] = w[2].query_selector_all(".readout")[1].inner_text()
                # hubert layers
                sl = w[3].query_selector("input[type=range]")
                for L in (0, 4, 8, 12):
                    sl.evaluate(f"(e)=>{{e.value={L};e.dispatchEvent(new Event('input'))}}")
                    r[f"hub_L{L}"] = w[3].query_selector(".stat-row").inner_text().replace("\n", " ")
                sels = w[3].query_selector_all("select")
                sels[0].select_option(index=1); sels[1].select_option("5"); sels[2].select_option("3"); pg.wait_for_timeout(100)
                cv = w[3].query_selector_all("canvas")[2]; cv.scroll_into_view_if_needed(); bb = cv.bounding_box()
                pg.mouse.move(bb["x"] + bb["width"] * 0.6, bb["y"] + bb["height"] * 0.7); pg.wait_for_timeout(100)
                r["hub_att"] = w[3].query_selector_all(".readout")[1].inner_text()
                w[3].screenshot(path=OUT + "1280-light-hubert-b.png")
                print(json.dumps(r, ensure_ascii=False, indent=1))
            pg.close()
    b.close()
print("ERRORS:", errs)
