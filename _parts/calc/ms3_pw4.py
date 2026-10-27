from playwright.sync_api import sync_playwright
URL="http://localhost:8813/matematikai-statisztika/03-ket-valtozo-kapcsolata/"
with sync_playwright() as p:
    b=p.chromium.launch()
    for w,theme in [(1280,"light"),(380,"dark")]:
        ctx=b.new_context(viewport={"width":w,"height":900}); pg=ctx.new_page(); errs=[]
        pg.on("console", lambda m: m.type=="error" and errs.append(m.text)); pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(URL); pg.wait_for_timeout(2500)
        if theme=="dark": pg.evaluate("document.documentElement.setAttribute('data-theme','dark')")
        info=pg.evaluate("""()=>({katexErr:document.querySelectorAll('.katex-error').length,
          openDetails:[...document.querySelectorAll('details')].filter(d=>d.open).length,
          quizDetails:[...document.querySelectorAll('.quiz')].map(q=>{const d=q.querySelector('details');return d?(d.open?'OPEN':'closed'):'nodetails'}),
          quizQ:[...document.querySelectorAll('.quiz')].map(q=>q.querySelectorAll('.q, .quiz-q, li, .question').length),
          overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth})""")
        print(w,theme,info,"errors:",errs)
        # open the final quiz and screenshot
        q=pg.locator('.quiz[data-quiz="ms3-35"]'); q.scroll_into_view_if_needed()
        q.locator('summary').first.click(); pg.wait_for_timeout(800)
        k=pg.evaluate("document.querySelectorAll('.katex-error').length"); print("katex err after open",k)
        q.screenshot(path=f"_parts/ms3/shots/quiz35-{w}-{theme}.png")
        ctx.close()
    b.close()
