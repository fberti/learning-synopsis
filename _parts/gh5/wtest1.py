import sys
from playwright.sync_api import sync_playwright
url="http://localhost:8771/grafelmelet-halozattudomany/05-centralitas/"
with sync_playwright() as p:
    b=p.chromium.launch()
    for width,theme in [(1280,"light"),(390,"dark")]:
        pg=b.new_page(viewport={"width":width,"height":900})
        errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(url); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(1200)
        if theme=="dark": pg.evaluate("document.documentElement.setAttribute('data-theme','dark')"); pg.wait_for_timeout(300)
        w=pg.locator(".widget[data-widget=betweenness-paths]"); w.scroll_into_view_if_needed()
        cv=w.locator("canvas"); bb=cv.bounding_box()
        # node positions from View: Ko index 0
        pos=pg.evaluate("""(()=>{const c=document.querySelector('.widget[data-widget=betweenness-paths] canvas');return null})()""")
        # click Ko approx using preset coords: compute via GraphKit normalize
        pts=pg.evaluate("""(()=>{const ids=ARVIZHET.actors.map(a=>a.id);const P={Kl:[.6,0],Sz:[0,.5],Ko:[1.3,.5],Vi:[.65,1],Po:[1.6,1.3],La:[2.4,1],'Ön':[2.3,1.9]};const N=GraphKit.normalize(ids.map(i=>P[i]),0.5);return N.map(p=>[p[0],0.05+p[1]*0.86])})()""")
        def click(i):
            bb=cv.bounding_box(); pg.mouse.click(bb["x"]+pts[i][0]*bb["width"], bb["y"]+pts[i][1]*bb["height"]); pg.wait_for_timeout(200)
        click(0); print(width,"node Ko:", w.locator(".readout").inner_text()[:160])
        w.locator("tr[data-k]").nth(3).click(); pg.wait_for_timeout(200)
        w.screenshot(path=f"_parts/gh5/shots/w1-btw-node-{theme}-{width}.png")
        w.get_by_role("button",name="pár mód").click(); click(5); click(3); print(width,"pair Sz-La:", w.locator(".readout").inner_text()[:200])
        w.screenshot(path=f"_parts/gh5/shots/w1-btw-pair-{theme}-{width}.png")
        a=pg.locator(".widget[data-widget=arvizhet-centrality]")
        for m in ["fokszám","erősség","közelségi","sajátvektor","PageRank"]:
            a.get_by_role("button",name=m,exact=True).click(); pg.wait_for_timeout(100); print(width,m,"|",a.locator(".readout").inner_text()[:170].replace("\n"," "))
        a.screenshot(path=f"_parts/gh5/shots/w1-arviz-{theme}-{width}.png")
        pb=pg.locator(".widget[data-widget=polblogs-hits]"); pb.scroll_into_view_if_needed()
        for m in ["befok","HITS-tekintély","HITS-hub","kifok"]:
            pb.get_by_role("button",name=m,exact=True).click(); pg.wait_for_timeout(150); print(width,m,"|",pb.locator(".readout").inner_text()[:90])
        pb.get_by_role("button",name="csak a táborok között").click(); pb.locator("tr[data-i]").first.click(); pg.wait_for_timeout(200)
        print(width,"sel |",pb.locator(".readout").inner_text()[-260:].replace("\n"," "))
        pb.screenshot(path=f"_parts/gh5/shots/w1-pb-{theme}-{width}.png")
        print("hscroll",pg.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth"),"errs",errs)
        pg.close()
    b.close()
