# 13.11 widgetek (w4.js) – headless teszt + képernyőképek. Szerver: python3 -m http.server 8741 a synopsis gyökerében
import json, os
from playwright.sync_api import sync_playwright
URL = "http://localhost:8741/_parts/ch13/wtest4.html"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "ch13", "shots4")
errs = []
def txt(loc): return loc.inner_text().replace("\n", " | ")
with sync_playwright() as p:
    b = p.chromium.launch()
    for W in (1280, 380):
        for theme in ("light", "dark"):
            pg = b.new_page(viewport={"width": W, "height": 900}, device_scale_factor=1, has_touch=(W == 380))
            pg.on("console", lambda m: m.type in ("error", "warning") and errs.append(m.text))
            pg.on("pageerror", lambda e: errs.append(str(e)))
            pg.goto(URL); pg.add_style_tag(content="html{scroll-behavior:auto!important}"); pg.wait_for_timeout(1500)
            if theme == "dark":
                pg.evaluate("document.documentElement.setAttribute('data-theme','dark')"); pg.wait_for_timeout(300)
            r = {}
            cora = pg.locator('[data-widget="cora-explorer"]'); mut = pg.locator('[data-widget="mutag-lab"]')
            r["overflow"] = pg.evaluate("document.documentElement.scrollWidth > window.innerWidth")
            if W == 1280 and theme == "light":
                r["cora_stats"] = txt(cora.locator(".stat-row"))
                r["cora_js"] = pg.evaluate("(()=>{const w=document.querySelector('#w-cora').w4;return {acc:w.acc,deg:w.degGroups};})()")
            cora.screenshot(path=f"{OUT}/cora-raw-{W}-{theme}.png")
            # kiválasztás: MLP téved, GCN jó, fokszám >= 3, tesztcsúcs
            node = pg.evaluate("""(()=>{const C=CORA13,d=new Array(C.n).fill(0);C.edges.forEach(([u,v])=>{d[u]++;d[v]++});
                 return C.test.find(i=>C.predMLP[i]!==C.y[i]&&C.predGCN[i]===C.y[i]&&d[i]>=4&&d[i]<=6);})()""")
            cora.get_by_role("button", name="GCN rejtett rétege").click(); pg.wait_for_timeout(900)
            xy = pg.evaluate(f"document.querySelector('#w-cora').w4.pos({node})")
            bb = cora.locator("canvas").first.bounding_box()
            if W == 380: pg.touchscreen.tap(bb["x"] + xy[0], bb["y"] + xy[1])
            else: pg.mouse.click(bb["x"] + xy[0], bb["y"] + xy[1])
            pg.wait_for_timeout(150)
            r["cora_panel"] = txt(cora.locator(".two-canvas .readout"))
            cora.screenshot(path=f"{OUT}/cora-gcn-sel-{W}-{theme}.png")
            cora.get_by_role("button", name="GCN hibái").click()
            cora.locator("input[type=checkbox]").check()
            if W == 380: pg.touchscreen.tap(bb["x"] + 3, bb["y"] + 3)   # üres helyre: kijelölés törlése
            else: pg.mouse.click(bb["x"] + 3, bb["y"] + 3)
            pg.wait_for_timeout(100)
            r["cora_ro_gcn"] = cora.locator(".readout").last.inner_text()
            cora.screenshot(path=f"{OUT}/cora-gcn-err-{W}-{theme}.png")
            cora.get_by_role("button", name="Szózsák (MLP bemenete)").click(); cora.get_by_role("button", name="MLP hibái").click(); pg.wait_for_timeout(900)
            r["cora_ro_mlp"] = cora.locator(".readout").last.inner_text()
            cora.screenshot(path=f"{OUT}/cora-raw-err-{W}-{theme}.png")
            # MUTAG
            mut.scroll_into_view_if_needed()
            r["mut0"] = txt(mut.locator(".two-canvas"))
            if W == 1280 and theme == "light": r["mut_stats"] = txt(mut.locator(".stat-row"))
            mut.screenshot(path=f"{OUT}/mutag-{W}-{theme}.png")
            mut.get_by_role("button", name="🔀 Átszámozás").click(); pg.wait_for_timeout(100)
            r["mut_perm1"] = txt(mut.locator(".two-canvas")) + " || " + mut.locator(".readout").inner_text()
            r["mut_perm1_expect"] = pg.evaluate("[MUTAG13.mols[0].mlp, MUTAG13.mols[0].mlpPerm[0], MUTAG13.mols[0].gin]")
            mut.screenshot(path=f"{OUT}/mutag-perm-{W}-{theme}.png")
            for _ in range(5): mut.get_by_role("button", name="🔀 Átszámozás").click()
            r["mut_perm_back"] = mut.locator(".controls").nth(2).inner_text()
            # szűrő + léptetés
            mut.locator("select").select_option("perm"); pg.wait_for_timeout(50)
            mut.get_by_role("button", name="▶").click(); pg.wait_for_timeout(50)
            r["mut_filter"] = mut.locator(".controls").first.inner_text() + " | " + mut.locator("input[type=number]").input_value()
            mut.get_by_role("button", name="🔀 Átszámozás").click()
            mut.screenshot(path=f"{OUT}/mutag-filter-perm-{W}-{theme}.png")
            # szám beírása (nem a szűrőben) → szűrő „mind”
            mut.locator("input[type=number]").fill("2"); mut.locator("input[type=number]").dispatch_event("change"); mut.locator("input[type=number]").blur(); pg.wait_for_timeout(50)
            r["mut_num"] = mut.locator("select").input_value() + " | " + mut.locator("b").first.inner_text()
            # atom szerkesztése: 2. molekula 1. atomja, kétszer
            live0 = pg.evaluate("document.querySelector('#w-mutag').w4.live()")
            cvm = mut.locator("canvas"); bbm = cvm.bounding_box()
            for k in range(2):
                ax = pg.evaluate("document.querySelector('#w-mutag').w4.atomPos(0)")
                if W == 380: pg.touchscreen.tap(bbm["x"] + ax[0], bbm["y"] + ax[1])
                else: pg.mouse.click(bbm["x"] + ax[0], bbm["y"] + ax[1])
                pg.wait_for_timeout(80)
            live1 = pg.evaluate("document.querySelector('#w-mutag').w4.live()")
            r["mut_edit"] = [live0, live1, txt(mut.locator(".two-canvas")), mut.locator(".readout").inner_text()]
            mut.screenshot(path=f"{OUT}/mutag-edit-{W}-{theme}.png")
            mut.get_by_role("button", name="↺ Visszaállítás").click(); pg.wait_for_timeout(150); r["reset_btn_disabled_after"] = mut.get_by_role("button", name="↺ Visszaállítás").is_disabled()
            r["mut_reset"] = pg.evaluate("document.querySelector('#w-mutag').w4.live()")
            r["overflow2"] = pg.evaluate("document.documentElement.scrollWidth > window.innerWidth")
            print(W, theme, json.dumps(r, ensure_ascii=False, indent=1))
            pg.close()
    b.close()
print("ERRORS:", errs)
