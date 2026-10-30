import sys
from playwright.sync_api import sync_playwright
url="http://localhost:8767/grafelmelet-halozattudomany/03-graftipusok/"
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={"width":1280,"height":900})
    errs=[]; pg.on("console", lambda m: errs.append(m.type+": "+m.text) if m.type in("error","warning") else None)
    pg.on("pageerror", lambda e: errs.append("PAGEERROR "+str(e)))
    pg.goto(url); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(1500)
    print("errors:",errs)
    print("katex-error:",pg.locator(".katex-error").count())
    print("open details:",pg.evaluate("[...document.querySelectorAll('details[open]')].length"))
    print("practice:",pg.locator("details.box.practice").count(),"quiz wraps:",pg.locator(".quiz details.quiz-wrap").count(),"quiz divs",pg.locator(".quiz").count())
    print("gfig svgs:",pg.locator(".gfig svg").count(),"/",pg.locator(".gfig").count())
    for w in pg.locator(".widget").all():
        name=w.get_attribute("data-widget"); c=w.locator("canvas").count(); err=w.locator("p.muted").all_inner_texts()
        print("widget",name,"canvas",c,[e for e in err if "Hiba" in e])
    # raw $ left outside katex
    print("raw $ in text:", pg.evaluate("""(()=>{const w=document.createTreeWalker(document.querySelector('main'),NodeFilter.SHOW_TEXT);let n,c=[];while(n=w.nextNode()){if(/\\$/.test(n.textContent)&&!n.parentElement.closest('script,code,.katex'))c.push(n.textContent.slice(0,60))}return c.slice(0,10)})()"""))
    for i,sel in enumerate([".widget[data-widget=multilayer-view]",".widget[data-widget=kg-explorer]",".widget[data-widget=signed-view]"]):
        el=pg.locator(sel).first; el.scroll_into_view_if_needed(); pg.wait_for_timeout(300)
        el.screenshot(path=f"_parts/gh3/shots/ag{i}.png") if el.bounding_box() and el.bounding_box()["height"]<2500 else pg.screenshot(path=f"_parts/gh3/shots/ag{i}.png")
    b.close()
