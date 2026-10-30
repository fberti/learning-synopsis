from playwright.sync_api import sync_playwright
url="http://localhost:8765/grafelmelet-halozattudomany/01-mi-a-halozat/"
with sync_playwright() as p:
    b=p.chromium.launch()
    for theme in ["light","dark"]:
        pg=b.new_page(viewport={"width":1200,"height":900})
        pg.goto(url); pg.wait_for_load_state("networkidle")
        if theme=="dark": pg.evaluate("document.documentElement.setAttribute('data-theme','dark')")
        pg.wait_for_timeout(1200)
        sels=["#s11-a + .box","#s12-a + .box","#s15-a + .box","#s15-b + p + .box","#s16-a + .box","#s16-c + .box","#s17-b + .box",".widget[data-widget=named-graphs]"] if theme=="light" else ["#s12-a + .box","#s17-a + .box",".widget[data-widget=cooccurrence-builder]"]
        for i,sel in enumerate(sels):
            el=pg.locator(sel).first; el.scroll_into_view_if_needed(); pg.wait_for_timeout(200)
            el.screenshot(path=f"_parts/gh1/shots/{theme}{i}.png")
        pg.close()
    b.close()
