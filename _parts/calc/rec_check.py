from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={"width":1280,"height":900})
    pg.goto("http://localhost:8731/mesterseges-intelligencia/08-felugyelet-nelkuli-tanulas/",wait_until="networkidle"); pg.wait_for_timeout(1500)
    w=pg.query_selector('.widget[data-widget="recommender-toy"]')
    w.query_selector('button:has-text("Pearson")').click(); pg.wait_for_timeout(300)
    print(w.query_selector('.readout').inner_text())
    print([c.inner_text() for c in w.query_selector_all('tr')[1].query_selector_all('td')])
    w.scroll_into_view_if_needed(); w.screenshot(path="../shots8/rec-pearson.png")
    b.close()
