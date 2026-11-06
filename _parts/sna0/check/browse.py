import asyncio, sys
from playwright.async_api import async_playwright
URL = "http://127.0.0.1:8765/halozatelemzes/00-munkakornyezet/"
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={"width": 1280, "height": 900})
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.on("console", lambda m: errs.append("console:" + m.text) if m.type == "error" else None)
        await pg.goto(URL, wait_until="networkidle")
        await pg.wait_for_timeout(1500)
        r = await pg.evaluate("""() => ({
          katexErr: [...document.querySelectorAll('.katex-error')].map(e => e.textContent.slice(0,80)),
          rawDollar: [...document.querySelectorAll('main p, main li, main td')].filter(e => /\\$[^$]+\\$/.test(e.textContent) && !e.closest('pre,code')).map(e=>e.textContent.slice(0,80)).slice(0,5),
          openDetails: [...document.querySelectorAll('details[open]')].length,
          quizzes: [...document.querySelectorAll('.quiz')].map(q => [q.dataset.quiz, q.querySelectorAll('.qq, .quiz-body > *').length, !!q.querySelector('details[open]')]),
          widgets: [...document.querySelectorAll('.widget')].map(w => [w.dataset.widget, w.children.length, w.innerText.slice(0,60)]),
          practice: document.querySelectorAll('details.box.practice').length,
          katexCount: document.querySelectorAll('.katex').length
        })""")
        print(r)
        # widget tests
        co = await pg.evaluate("""() => { const r=document.querySelector('[data-widget=cell-order]').__co;
            r.reset(); ['A','B','B','C'].forEach(c=>r.runJupyter(c)); const a=r.out();
            r.setMode('marimo'); const b=r.out(); return [a,b]; }""")
        print("cell-order:", co)
        mc = await pg.evaluate("""() => { const r=document.querySelector('[data-widget=matrix-check]').__mc; const res={};
            for (const b of document.querySelectorAll('[data-widget=matrix-check] .controls .btn')) { b.click(); res[b.textContent]=r.out(); }
            return res; }""")
        for k, v in mc.items(): print("==", k, "\n", v)
        await pg.screenshot(path=sys.argv[1] + "/top.png")
        el = await pg.query_selector('[data-widget=matrix-check]'); await el.scroll_into_view_if_needed(); await el.screenshot(path=sys.argv[1] + "/mc.png")
        el = await pg.query_selector('[data-widget=cell-order]'); await el.screenshot(path=sys.argv[1] + "/co.png")
        print("errors:", errs)
        await b.close()
asyncio.run(main())
