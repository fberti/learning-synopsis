import asyncio, sys
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); errs=[]
        pg = await b.new_page(viewport={"width": 1280, "height": 900})
        pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.goto("http://127.0.0.1:8765/halozatelemzes/00-munkakornyezet/", wait_until="networkidle")
        print(await pg.evaluate("""() => { const r=document.querySelector('[data-widget=matrix-check]').__mc;
          [...document.querySelectorAll('[data-widget=matrix-check] .controls .btn')].find(b=>b.textContent.startsWith('Hiány')).click(); const a=r.out();
          r.missIn.value='9'; r.run(); return a + '\\n---\\n' + r.out(); }"""))
        # open first quiz and first practice, screenshot
        await pg.evaluate("document.querySelector('#s04-d').scrollIntoView()")
        await pg.screenshot(path="table.png")
        for u in ["http://127.0.0.1:8765/halozatelemzes/", "http://127.0.0.1:8765/"]:
            q = await b.new_page(viewport={"width": 1280, "height": 900}); q.on("pageerror", lambda e: errs.append(str(e)))
            await q.goto(u, wait_until="networkidle"); await q.screenshot(path=("topic" if "halo" in u else "home")+".png", full_page=False)
        print("errors:", errs); await b.close()
asyncio.run(main())
