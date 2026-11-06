import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={"width": 1280, "height": 900})
        await pg.goto("http://127.0.0.1:8765/halozatelemzes/00-munkakornyezet/", wait_until="networkidle")
        t = await pg.query_selector("#s04-d + p + .tw table")
        await t.screenshot(path="table.png")
        e = await pg.query_selector("#s07 .box.example:nth-of-type(3)")
        s = await pg.query_selector("text=3. lépés: honnan jön a 0,56")
        box = await s.evaluate_handle("e => e.closest('.box')"); await box.as_element().screenshot(path="medici.png")
        await b.close()
asyncio.run(main())
