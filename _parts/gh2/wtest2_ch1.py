import sys
from playwright.sync_api import sync_playwright
url=f"http://localhost:{sys.argv[1]}/grafelmelet-halozattudomany/01-mi-a-halozat/"
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={"width":1280,"height":900})
    errs=[]; pg.on("console", lambda m: errs.append(m.text) if m.type=="error" else None); pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(url); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(1000)
    for w in pg.locator(".widget").all():
        print(w.get_attribute("data-widget"), w.locator("canvas").count(), [t for t in w.locator("p.muted").all_inner_texts() if "Hiba" in t])
    g=pg.locator(".widget[data-widget=graph-draw]")
    if g.count():
        c=g.locator("canvas")
        c.click(position={"x":40,"y":40}); c.click(position={"x":200,"y":60}); c.click(position={"x":40,"y":40}); c.click(position={"x":200,"y":60})
        g.screenshot(path="_parts/gh2/shots/w2-ch1-regression.png")
    pg.locator(".widget").last.screenshot(path="_parts/gh2/shots/w2-ch1-weights.png")
    print("errors:",errs); b.close()
