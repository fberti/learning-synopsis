import sys
from playwright.sync_api import sync_playwright
url="http://localhost:8768/grafelmelet-halozattudomany/04-grafok-es-matrixok/"
theme=sys.argv[1] if len(sys.argv)>1 else "light"; width=int(sys.argv[2]) if len(sys.argv)>2 else 1280
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={"width":width,"height":900})
    errs=[]; pg.on("console", lambda m: errs.append(m.type+": "+m.text) if m.type in("error","warning") else None)
    pg.on("pageerror", lambda e: errs.append("PAGEERROR "+str(e)))
    pg.goto(url); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(1500)
    if theme=="dark": pg.evaluate("document.documentElement.setAttribute('data-theme','dark')"); pg.wait_for_timeout(400)
    print("errors:",errs)
    print("katex-error:",pg.locator(".katex-error").count())
    print("open details:",pg.evaluate("[...document.querySelectorAll('details[open]')].length"))
    print("practice:",pg.locator("details.box.practice").count(),"quiz wraps:",pg.locator(".quiz details").count(),"quiz divs",pg.locator(".quiz").count())
    print("gfig svgs:",pg.locator(".gfig svg").count(),"/",pg.locator(".gfig").count())
    for w in pg.locator(".widget").all():
        name=w.get_attribute("data-widget"); c=w.locator("canvas").count(); err=w.locator("p.muted").all_inner_texts()
        print("widget",name,"canvas",c,[e for e in err if "Hiba" in e])
    print("raw $ in text:", pg.evaluate("""(()=>{const w=document.createTreeWalker(document.querySelector('main'),NodeFilter.SHOW_TEXT);let n,c=[];while(n=w.nextNode()){if(/\\$/.test(n.textContent)&&!n.parentElement.closest('script,code,pre,.katex'))c.push(n.textContent.slice(0,60))}return c.slice(0,10)})()"""))
    print("bad anchors:", pg.evaluate("""[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href')).filter(h=>h.length>1&&!document.getElementById(h.slice(1)))"""))
    print("hscroll:", pg.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth"))
    for name in ["matvec","walk-distribution","power-iteration","random-surfer","laplacian-smooth","spectral-cut"]:
        el=pg.locator(f".widget[data-widget={name}]").first; el.scroll_into_view_if_needed(); pg.wait_for_timeout(300)
        el.screenshot(path=f"_parts/gh4/shots/{name}-{theme}-{width}.png")
    b.close()
