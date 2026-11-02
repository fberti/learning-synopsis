import sys, asyncio
from playwright.sync_api import sync_playwright
port=sys.argv[1]
url=f"http://localhost:{port}/_parts/ms4/wtest1.html"
with sync_playwright() as p:
    b=p.chromium.launch()
    for theme in ["light","dark"]:
        for wdt in [1280,380]:
            pg=b.new_page(viewport={"width":wdt,"height":900})
            errs=[]; pg.on("console", lambda m: errs.append(m.text) if m.type=="error" else None); pg.on("pageerror", lambda e: errs.append(str(e)))
            pg.goto(url); pg.wait_for_timeout(1500)
            if theme=="dark": pg.evaluate("document.documentElement.setAttribute('data-theme','dark')"); pg.wait_for_timeout(400)
            for i,w in enumerate(pg.query_selector_all(".widget")):
                w.screenshot(path=f"shots1/{theme}-{wdt}-{i}.png")
            ov=pg.evaluate("[...document.querySelectorAll('.widget')].map(w=>w.scrollWidth-w.clientWidth)")
            print(theme,wdt,"errors:",errs,"overflow:",ov)
            if theme=="light" and wdt==1280:
                for w in pg.query_selector_all(".widget .readout"): print("READOUT:",w.inner_text()[:600])
                print("CHAIN TABLE:",pg.query_selector_all(".widget table")[0].inner_text().replace("\n"," | ")[:400])
                # preset NGA basket
                pg.click("text=NGA 8.2 (A–D cikk)"); pg.wait_for_timeout(200)
                print("NGA:",pg.query_selector_all(".widget .readout")[1].inner_text()[:400])
                pg.click("text=Három üzem (NGA 9.1)"); pg.wait_for_timeout(200)
                print("NGA9:",pg.query_selector_all(".widget .readout")[2].inner_text()[:300])
                pg.click("text=Házasságkötések (NGA)"); pg.wait_for_timeout(200)
                pg.query_selector_all(".widget")[0].query_selector_all("button")[5].click(); pg.wait_for_timeout(200)
                print("HZ:",pg.query_selector_all(".widget table")[0].inner_text().replace("\n"," | ")[:500])
            pg.close()
    b.close()
