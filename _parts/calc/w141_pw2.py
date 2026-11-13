import asyncio
from playwright.async_api import async_playwright
URL = "http://localhost:8811/_parts/ch14/wtest1.html"
OUT = "/forlinux/MEGA/MEGABase/obsidian/Vault/Learning/synopsis/_parts/ch14/shots1/"
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={"width": 1280, "height": 900})
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e))); pg.on("console", lambda m: m.type == "error" and errs.append(m.text))
        await pg.goto(URL); await pg.wait_for_timeout(1500)
        sm = pg.locator("#w-sm")
        for m in ["táblázat", "független pixelek", "Markov", "Laplace-simított"]:
            await sm.get_by_role("button", name=m, exact=True).click()
            s0 = (await sm.locator(".stat-row").inner_text()).replace("\n", " ")
            await sm.get_by_role("button", name="1000 minta").click()
            s1 = (await sm.locator(".stat-row").inner_text()).replace("\n", " ")
            print(m, "|", s0, "|", s1)
        await sm.get_by_role("button", name="táblázat", exact=True).click()
        await sm.get_by_role("button", name="1000 minta").click()
        await sm.screenshot(path=OUT + "sm_table1000.png")
        # determinism: Törlés then 1000 again same
        a = await sm.locator(".stat-row").inner_text()
        await sm.get_by_role("button", name="Törlés").click(); await sm.get_by_role("button", name="1000 minta").click()
        print("determ table:", a == await sm.locator(".stat-row").inner_text())
        ar = pg.locator("#w-ar"); await ar.scroll_into_view_if_needed()
        await ar.get_by_role("button", name="Kész").click()
        print("AR seed1 img1:", (await ar.locator(".stat-row").inner_text()).replace("\n", " "))
        await ar.get_by_role("button", name="▶ Rajzolj!").click(); await pg.wait_for_timeout(600)
        await ar.get_by_role("button", name="⏸ Szünet").click()
        i1 = await ar.locator(".readout").inner_text(); await pg.wait_for_timeout(600)
        print("paused stable:", i1 == await ar.locator(".readout").inner_text(), i1[:60])
        await ar.get_by_role("button", name="1 pixel").click()
        print("after step:", (await ar.locator(".readout").inner_text())[:60])
        # temperature
        await ar.locator("input[type=range]").first.fill("0.25")
        await ar.get_by_role("button", name="Kész").click()
        print("T=0.25 img2 rest:", (await ar.locator(".stat-row").inner_text()).replace("\n", " "))
        # scroll away -> animation should stop drawing
        await ar.locator("input[type=range]").first.fill("1")
        await ar.get_by_role("button", name="▶ Rajzolj!").click(); await pg.wait_for_timeout(300)
        await pg.locator("#w-kl").scroll_into_view_if_needed(); await pg.wait_for_timeout(1500)
        i2 = await ar.locator(".readout").inner_text(); await pg.wait_for_timeout(800)
        print("offscreen stopped:", i2 == await ar.locator(".readout").inner_text())
        await ar.scroll_into_view_if_needed(); await pg.wait_for_timeout(800)
        print("resumed:", i2 != await ar.locator(".readout").inner_text())
        await ar.get_by_role("button", name="Kiegészítés").click()
        print("AR comp default:", (await ar.locator(".stat-row").inner_text()).replace("\n", " "))
        for k in ["0", "8", "6"]:
            await ar.locator("input[type=range]").nth(2).fill(k)
            print(" keep", k, (await ar.locator(".stat-row").inner_text()).replace("\n", " "))
        ae = pg.locator("#w-ae"); await ae.scroll_into_view_if_needed()
        print("AE default:", await pg.evaluate("(() => { const D=GEN14.ae, o=D.orig[3]; const m=(a,b)=>a.reduce((s,v,i)=>s+((v-b[i])/16)**2,0)/64; return D.ks.map(k=>[k, m(o,D.ae[k][3]).toFixed(4), m(o,D.pca[k][3]).toFixed(4)]); })()"))
        cvg = ae.locator("canvas").nth(1); bb = await cvg.bounding_box()
        await pg.mouse.click(bb["x"] + bb["width"] * 0.93, bb["y"] + 80)
        print("AE col click ->", await ae.locator("label b").inner_text())
        kl = pg.locator("#w-kl")
        print("KL default:", (await kl.locator(".readout").inner_text()), "|", (await kl.locator(".stat-row").inner_text()).replace("\n", " "))
        for nm in ["(0; 1)", "(1; 0,5)", "(2; 0,5)", "(0; 0,1)", "(0; 2)"]:
            await kl.get_by_role("button", name=nm).click()
            print(" ", nm, (await kl.locator(".stat-row").inner_text()).replace("\n", " "))
        await kl.get_by_role("button", name="(0; 0,1)").click()
        await kl.screenshot(path=OUT + "kl_narrow_sigma.png")
        await kl.locator("input[type=range]").nth(1).fill("1")
        print(" sigma=1:", (await kl.locator(".stat-row").inner_text()).replace("\n", " "))
        await kl.screenshot(path=OUT + "kl_sigma1.png")
        print("errs", errs)
        await b.close()
asyncio.run(main())
