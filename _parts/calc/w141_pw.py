import sys, asyncio
from playwright.async_api import async_playwright
OUT = "/forlinux/MEGA/MEGABase/obsidian/Vault/Learning/synopsis/_parts/ch14/shots1/"
URL = "http://localhost:8811/_parts/ch14/wtest1.html"
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for width in (1280, 380):
            for theme in ("light", "dark"):
                pg = await b.new_page(viewport={"width": width, "height": 900})
                errs = []
                pg.on("console", lambda m: m.type in ("error", "warning") and errs.append(m.text))
                pg.on("pageerror", lambda e: errs.append(str(e)))
                await pg.goto(URL); await pg.wait_for_timeout(1500)
                if theme == "dark":
                    await pg.evaluate("document.documentElement.setAttribute('data-theme','dark')"); await pg.wait_for_timeout(300)
                # sample-machine: 1 minta, then 100 on markov
                sm = pg.locator("#w-sm")
                await sm.get_by_role("button", name="1 minta").click()
                await sm.screenshot(path=f"{OUT}sm_table1_{width}_{theme}.png")
                await sm.get_by_role("button", name="Markov").click()
                await sm.get_by_role("button", name="1 minta").click()
                await sm.get_by_role("button", name="1000 minta").click()
                await sm.screenshot(path=f"{OUT}sm_markov_{width}_{theme}.png")
                await sm.get_by_role("button", name="Laplace-simított").click()
                await sm.get_by_role("button", name="100 minta").click()
                await sm.screenshot(path=f"{OUT}sm_laplace_{width}_{theme}.png")
                # pixel-ar
                ar = pg.locator("#w-ar")
                await ar.scroll_into_view_if_needed()
                await ar.get_by_role("button", name="▶ Rajzolj!").click()
                await pg.wait_for_timeout(1700)
                await ar.screenshot(path=f"{OUT}ar_draw_{width}_{theme}.png")
                await ar.get_by_role("button", name="Kész").click()
                await ar.screenshot(path=f"{OUT}ar_done_{width}_{theme}.png")
                await ar.get_by_role("button", name="Kiegészítés").click()
                await pg.wait_for_timeout(200)
                cv = ar.locator("canvas").nth(1)
                bb = await ar.locator("canvas").nth(0).bounding_box()
                await pg.mouse.click(bb["x"] + bb["width"]*0.12, bb["y"] + 15)
                await ar.screenshot(path=f"{OUT}ar_comp_{width}_{theme}.png")
                # ae
                ae = pg.locator("#w-ae"); await ae.scroll_into_view_if_needed()
                pc = ae.locator("canvas").nth(0); bb = await pc.bounding_box()
                await pg.mouse.click(bb["x"] + bb["width"]*0.85, bb["y"] + 10)
                await ae.screenshot(path=f"{OUT}ae_{width}_{theme}.png")
                # kl
                kl = pg.locator("#w-kl"); await kl.scroll_into_view_if_needed()
                await kl.get_by_role("button", name="(2; 0,5)").click()
                await kl.screenshot(path=f"{OUT}kl_{width}_{theme}.png")
                sw = await pg.evaluate("document.documentElement.scrollWidth")
                txt = await kl.locator(".readout").inner_text()
                st = await kl.locator(".stat-row").inner_text()
                sms = await sm.locator(".stat-row").inner_text()
                ars = await ar.locator(".stat-row").inner_text()
                print(width, theme, "scrollW", sw, "errs", errs)
                if theme == "light":
                    print(" KL:", txt.replace("\n"," "), "|", st.replace("\n"," "))
                    print(" SM:", sms.replace("\n"," "))
                    print(" AR:", ars.replace("\n"," "))
                await pg.close()
        await b.close()
asyncio.run(main())
