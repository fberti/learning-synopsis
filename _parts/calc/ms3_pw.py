import sys, asyncio
from playwright.sync_api import sync_playwright
URL="http://localhost:8813/matematikai-statisztika/03-ket-valtozo-kapcsolata/"
with sync_playwright() as p:
    b=p.chromium.launch()
    for w,theme in [(1280,"light"),(380,"dark")]:
        pg=b.new_page(viewport={"width":w,"height":900})
        errs=[]
        pg.on("console", lambda m: m.type=="error" and errs.append(m.text))
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(URL); pg.wait_for_timeout(2500)
        if theme=="dark": pg.evaluate("document.documentElement.setAttribute('data-theme','dark')"); pg.wait_for_timeout(500)
        info=pg.evaluate("""()=>({katexErr:document.querySelectorAll('.katex-error').length,
          katex:document.querySelectorAll('.katex').length,
          rawDollar:[...document.querySelectorAll('main p, main li, main td, main div.box')].filter(e=>/\\$[^$]+\\$/.test(e.textContent)&&!e.querySelector('.widget')).length,
          openDetails:[...document.querySelectorAll('details')].filter(d=>d.open).length,
          widgets:[...document.querySelectorAll('.widget')].map(w=>w.dataset.widget+':'+w.querySelectorAll('canvas,svg,table').length),
          overflow:document.documentElement.scrollWidth-window.innerWidth,
          quizzes:document.querySelectorAll('.quiz').length})""")
        print(w,theme,info,"errors:",errs[:5])
        for sel in ["#s34-a","#s37-a","#s32-d"]:
            el=pg.locator(sel); el.scroll_into_view_if_needed(); pg.wait_for_timeout(300)
            pg.screenshot(path=f"_parts/ms3/shots/{sel[1:]}-{w}-{theme}.png")
        pg.close()
    b.close()
