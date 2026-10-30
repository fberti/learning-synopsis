import sys
from playwright.sync_api import sync_playwright
port = sys.argv[1]
url = f"http://localhost:{port}/_parts/gh3/wtest2.html"
S = "_parts/gh3/shots/"
def W(pg, name): return pg.locator(f".widget[data-widget={name}]")
# a k-adik View i-edik élének felezőpontja / csúcsa képernyő-koordinátában
EM = """([v, i]) => { const V = window.__views[v]; V.c.scrollIntoView({block: "center", behavior: "instant"}); const G = V.edgeGeom(i), r = V.c.getBoundingClientRect(); return [r.left + G.mx, r.top + G.my]; }"""
NM = """([v, i]) => { const V = window.__views[v]; V.c.scrollIntoView({block: "center", behavior: "instant"}); const n = V.nodes[i], r = V.c.getBoundingClientRect(); return [r.left + n.x * V.w, r.top + n.y * V.h]; }"""
def ce(pg, v, i): x, y = pg.evaluate(EM, [v, i]); pg.mouse.click(x, y)
def cn(pg, v, i): x, y = pg.evaluate(NM, [v, i]); pg.mouse.click(x, y)
def txt(l): return l.inner_text().replace("\n", " | ")
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": 1000, "height": 900})
    errs = []
    pg.on("console", lambda m: errs.append(m.type + ": " + m.text) if m.type in ("error", "warning") else None)
    pg.on("pageerror", lambda e: errs.append("PAGEERROR " + str(e)))
    pg.goto(url); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(600)
    print("views:", pg.evaluate("window.__views.length"))
    # --- signed
    s = W(pg, "signed-view")
    print("tri buttons:", s.locator(".controls").nth(1).locator("button").all_inner_texts())
    print("stats:", txt(s.locator(".stat-row")))
    print("table:", txt(s.locator("table")))
    # Sz–Ko él (index 4)
    ce(pg, 0, 4); print("edge info:", txt(s.locator(".readout").first))
    s.locator(".controls").nth(1).locator("button").nth(1).click()
    print("tri msg:", txt(s.locator(".readout").nth(1)))
    s.screenshot(path=S + "w2-signed.png")
    s.locator("button", has_text="Mi lenne").click()
    ce(pg, 0, 4)   # Sz–Ko -> +
    print("after flip tri:", s.locator(".controls").nth(1).locator("button").all_inner_texts(), txt(s.locator(".stat-row")))
    ce(pg, 0, 0)   # Ko–Vi -> −
    print("after flip2 tri:", s.locator(".controls").nth(1).locator("button").all_inner_texts(), "|", txt(s.locator(".readout").first))
    s.screenshot(path=S + "w2-signed-flip.png")
    s.locator("button", has_text="Visszaállítás").click()
    print("reset:", s.locator(".controls").nth(1).locator("button").all_inner_texts())
    # --- multilayer (views 1..4)
    m = W(pg, "multilayer-view")
    print("ml stats:", txt(m.locator(".stat-row")))
    for v in (1, 2, 3):
        print("layer", v, pg.evaluate("v => window.__views[v].edges.map(e => window.__views[v].nodes[e.a].label + (window.__views[v].o.directed ? '>' : '-') + window.__views[v].nodes[e.b].label + ':' + e.w).join(' ')", v))
    ce(pg, 1, 1)   # NY>EK
    print("ml info:", txt(m.locator(".readout")), "||", txt(m.locator("table")))
    m.screenshot(path=S + "w2-multilayer.png")
    ce(pg, 4, 0)
    print("ml agg click:", txt(m.locator(".readout")))
    m.locator("input[type=checkbox]").nth(0).uncheck()
    print("ml without L1:", txt(m.locator(".stat-row")), "|", m.locator(".muted").last.inner_text())
    m.screenshot(path=S + "w2-multilayer-l23.png")
    m.locator("input[type=checkbox]").nth(0).check()
    # --- kg (view 5)
    k = W(pg, "kg-explorer")
    print("kg info:", txt(k.locator(".readout")))
    k.locator("table tr").nth(3).click()
    print("kg row:", txt(k.locator(".readout")))
    po = pg.evaluate("window.__views[5].nodes.findIndex(n => n.sub === 'Polgármester')")
    cn(pg, 5, po); print("kg node Po:", txt(k.locator(".readout")))
    ko = pg.evaluate("window.__views[5].nodes.findIndex(n => n.sub === 'Kormány')")
    cn(pg, 5, ko); print("kg node Ko:", txt(k.locator(".readout")))
    gat = pg.evaluate("window.__views[5].nodes.findIndex(n => n.sub === 'Gát')")
    cn(pg, 5, gat); print("kg node Gát:", txt(k.locator(".readout")))
    ce(pg, 5, 6); print("kg edge 7:", txt(k.locator(".readout")))
    k.screenshot(path=S + "w2-kg-edge.png")
    sels = k.locator("select")
    sels.nth(0).select_option("Szakértő"); print("q Sz:", txt(k.locator(".readout")))
    sels.nth(0).select_option("Kormány"); sels.nth(1).select_option("bírálja"); print("q Ko bírálja:", txt(k.locator(".readout")))
    k.screenshot(path=S + "w2-kg-query.png")
    sels.nth(0).select_option(""); print("q * bírálja:", txt(k.locator(".readout")))
    # --- chooser
    c = W(pg, "graph-type-chooser")
    wrong_first = True
    for qi in range(8):
        bs = c.locator(".box .controls").first.locator("button")
        names = bs.all_inner_texts()
        if qi == 1:  # egy rossz válasz
            target = [n for n in names if n != "páros gráf"][0]
        else:
            correct = ["súlyozott vetület", "páros gráf", "irányított", "előjeles", "időbeli", "többrétegű", "tudásgráf", "hipergráf"][qi]
            target = correct
        bs.filter(has_text=target).first.click()
        if qi == 1:
            print("wrong msg:", txt(c.locator(".readout"))); c.screenshot(path=S + "w2-chooser-wrong.png")
        c.locator("button", has_text="→" if qi < 7 else "Eredmény").click()
    print("chooser end:", txt(c))
    c.locator("button", has_text="Újra").click(); print("after restart:", txt(c.locator(".stat-row")))
    pg.screenshot(path=S + "w2-full-light.png", full_page=True)
    # sötét téma
    pg.evaluate("document.documentElement.setAttribute('data-theme','dark')"); pg.wait_for_timeout(200)
    ce(pg, 0, 4); s.locator(".controls").nth(1).locator("button").nth(1).click()
    s.screenshot(path=S + "w2-signed-dark.png"); m.screenshot(path=S + "w2-multilayer-dark.png"); k.screenshot(path=S + "w2-kg-dark.png")
    # mobil
    pg.evaluate("document.documentElement.setAttribute('data-theme','light')")
    pg.set_viewport_size({"width": 390, "height": 850}); pg.wait_for_timeout(500)
    s.screenshot(path=S + "w2-signed-mobile.png"); m.screenshot(path=S + "w2-multilayer-mobile.png"); k.screenshot(path=S + "w2-kg-mobile.png"); c.screenshot(path=S + "w2-chooser-mobile.png")
    pg.reload(); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(600)
    W(pg, "kg-explorer").screenshot(path=S + "w2-kg-mobile-load.png"); W(pg, "signed-view").screenshot(path=S + "w2-signed-mobile-load.png")
    print("overflow:", pg.evaluate("document.documentElement.scrollWidth"))
    print("errors:", errs)
    b.close()
