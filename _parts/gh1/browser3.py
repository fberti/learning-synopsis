from playwright.sync_api import sync_playwright
url="http://localhost:8765/grafelmelet-halozattudomany/01-mi-a-halozat/"
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={"width":1200,"height":900}); errs=[]
    pg.on("pageerror", lambda e: errs.append(str(e))); pg.on("console", lambda m: errs.append(m.text) if m.type=="error" else None)
    pg.goto(url); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(800)
    w=pg.locator(".widget[data-widget=isomorphism-game]")
    for i in range(6):
        w.locator("select").select_option(str(i)); w.get_by_role("button",name="Izomorf",exact=True).click(); pg.wait_for_timeout(100)
        sb=w.get_by_role("button",name="Mutasd a megfeleltetést")
        if sb.is_visible(): sb.click(); pg.wait_for_timeout(1000)
        print(i, w.locator(".readout").inner_text()[:60].replace("\n"," "))
    w.scroll_into_view_if_needed(); w.screenshot(path="_parts/gh1/shots/iso.png")
    g=pg.locator(".widget[data-widget=graph-draw]"); c=g.locator("canvas"); c.scroll_into_view_if_needed(); bb=c.bounding_box()
    c.click(position={"x":40,"y":40}); c.click(position={"x":bb["width"]-40,"y":40})
    print("draw stats:", g.locator(".stat-row").inner_text().replace("\n"," "))
    g.get_by_role("button",name="Átszámozás").click(); g.get_by_role("button",name="Éllista").click(); print(g.locator(".tw").inner_text()[:80])
    hs=pg.locator(".widget[data-widget=handshake]")
    for name in ["(3, 3, 1, 1)","(5, 3, 3, 3, 2)","Árvízhét (4, 4, 3, 3, 2, 2, 2)"]:
        hs.get_by_role("button",name=name).click(); print(name, hs.locator(".readout").inner_text().replace("\n"," | ")[:200])
    t=pg.locator(".widget[data-widget=three-graphs]")
    for name in ["Cikkgráf","Lapgráf","Cikk–szereplő"]:
        t.get_by_role("button",name=name).click(); print(name, t.locator(".stat-row").inner_text().replace("\n"," "))
    t.get_by_role("button",name="a teljes hét (12 cikk)").click(); t.get_by_role("button",name="Lapgráf").click(); print("lap all", t.locator(".stat-row").inner_text().replace("\n"," "))
    cb=pg.locator(".widget[data-widget=cooccurrence-builder]"); cb.get_by_role("button",name="Esti Krónika").click(); print("EK", cb.locator(".stat-row").inner_text().replace("\n"," "))
    # quiz open
    q=pg.locator(".quiz summary").first; q.click(); pg.wait_for_timeout(300); print("quiz qs:", pg.locator(".quiz").first.locator(".qq").count())
    print("errors", errs); b.close()
