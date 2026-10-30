import sys
from playwright.sync_api import sync_playwright
port = sys.argv[1]
url = f"http://localhost:{port}/_parts/gh2/wtest2.html"
S = "_parts/gh2/shots/"
def W(pg, name): return pg.locator(f".widget[data-widget={name}]")
def clickbtn(w, text): w.locator("button", has_text=text).first.click()
CLICK_JS = """([name, kind, idx]) => {
  // canvas-pozíció: csúcs (node) vagy él-felezőpont (edge), a View belső állapota nélkül, a canvas méretéből
  const w = document.querySelector(`.widget[data-widget=${name}]`), c = w.querySelector('canvas'), r = c.getBoundingClientRect();
  return [r.left, r.top, r.width, r.height];
}"""
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": 1100, "height": 900})
    errs = []
    pg.on("console", lambda m: errs.append(m.type + ": " + m.text) if m.type in ("error", "warning") else None)
    pg.on("pageerror", lambda e: errs.append("PAGEERROR " + str(e)))
    pg.goto(url); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(800)
    # --- Dijkstra
    d = W(pg, "dijkstra-step")
    clickbtn(d, "Lépés"); clickbtn(d, "Lépés")
    print("dijk 2 lépés:", d.locator(".readout").nth(0).inner_text())
    clickbtn(d, "Végig")
    print("dijk path:", d.locator(".readout").nth(1).inner_text())
    print("dijk table:", d.locator("table").inner_text().replace("\n", " | ").replace("\t", " "))
    d.screenshot(path=S + "w2-dijkstra-town.png")
    clickbtn(d, "Árvízhét"); clickbtn(d, "hossz = 1/súly"); clickbtn(d, "Végig")
    print("dijk arviz inv:", d.locator(".readout").nth(1).inner_text())
    d.screenshot(path=S + "w2-dijkstra-arviz.png")
    clickbtn(d, "hossz = súly"); clickbtn(d, "Végig")
    print("dijk arviz w:", d.locator(".readout").nth(1).inner_text())
    # --- Kruskal
    k = W(pg, "spanning-tree")
    for _ in range(4): clickbtn(k, "Lépés")
    print("kruskal 4 lépés:", k.locator(".readout").inner_text())
    k.screenshot(path=S + "w2-kruskal-cycle.png")
    clickbtn(k, "Végig")
    print("kruskal town:", k.locator(".stat-row").inner_text().replace("\n", " "), "|", k.locator(".readout").inner_text())
    clickbtn(k, "Árvízhét"); clickbtn(k, "Végig")
    print("kruskal arviz:", k.locator(".stat-row").inner_text().replace("\n", " "))
    for _ in range(5):
        clickbtn(k, "másik sorrend"); clickbtn(k, "Végig")
    print("kruskal arviz after shuffles:", k.locator(".readout").inner_text())
    k.screenshot(path=S + "w2-kruskal-arviz.png")
    # --- Euler
    e = W(pg, "euler-trail")
    clickbtn(e, "Mutass egy megoldást"); pg.wait_for_timeout(300)
    print("euler kon:", e.locator(".readout").nth(1).inner_text())
    e.locator("input[type=checkbox]").check(); clickbtn(e, "Mutass egy megoldást"); pg.wait_for_timeout(6 * 420 + 600)
    print("euler kon-1:", e.locator(".stat-row").inner_text().replace("\n", " "), "|", e.locator(".readout").nth(1).inner_text())
    e.screenshot(path=S + "w2-euler-kon.png")
    clickbtn(e, "Árvízhét"); clickbtn(e, "Mutass egy megoldást"); pg.wait_for_timeout(10 * 420 + 600)
    print("euler arviz:", e.locator(".stat-row").inner_text().replace("\n", " "), "|", e.locator(".readout").nth(1).inner_text())
    e.screenshot(path=S + "w2-euler-arviz.png")
    clickbtn(e, "Ház"); clickbtn(e, "Mutass egy megoldást"); pg.wait_for_timeout(8 * 420 + 600)
    print("euler house:", e.locator(".stat-row").inner_text().replace("\n", " "), "|", e.locator(".readout").nth(1).inner_text())
    # kézi rajzolás a házon: A (0,2) B (1,2) C (1,1) D (0,1) E (.5,0)
    clickbtn(e, "Újra")
    L, T, Wd, Ht = pg.evaluate(CLICK_JS, ["euler-trail", "", 0])
    P = pg.evaluate("asp => GraphKit.normalize([[0,2],[1,2],[1,1],[0,1],[.5,0]], asp).map(p => [p[0], 0.07 + (p[1] - 0.08) * 0.93])", 0.6)
    xy = lambda i: (L + P[i][0] * Wd, T + P[i][1] * Ht)
    mid = lambda i, j: ((xy(i)[0] + xy(j)[0]) / 2, (xy(i)[1] + xy(j)[1]) / 2)
    pg.mouse.click(*xy(0))                        # start A
    pg.mouse.click(*mid(0, 1))                    # él A–B
    print("manual 1:", e.locator(".readout").nth(1).inner_text())
    pg.mouse.click(*mid(3, 4))                    # D–E: nem B-ből indul -> tiltott
    print("manual tiltott:", e.locator(".readout").nth(1).inner_text())
    pg.mouse.click(*xy(2))                        # csúcs C (B–C él)
    pg.mouse.click(*xy(4))                        # E
    print("manual 3:", e.locator(".stat-row").inner_text().replace("\n", " "), "|", e.locator(".readout").nth(1).inner_text())
    clickbtn(e, "Visszavonás")
    print("undo:", e.locator(".stat-row").inner_text().replace("\n", " "))
    e.screenshot(path=S + "w2-euler-house.png")
    # Königsberg: ívelt híd kattintása (a két É–Sz híd)
    clickbtn(e, "Königsberg"); e.locator("input[type=checkbox]").uncheck()
    L, T, Wd, Ht = pg.evaluate(CLICK_JS, ["euler-trail", "", 0])
    K = pg.evaluate("asp => GraphKit.normalize([[0,0],[0,1],[0,2],[2,1]], asp).map(p => [p[0], 0.07 + (p[1] - 0.08) * 0.93])", 0.6)
    kxy = lambda i: (L + K[i][0] * Wd, T + K[i][1] * Ht)
    pg.mouse.click(*kxy(0))                       # É
    mx, my = (kxy(0)[0] + kxy(1)[0]) / 2, (kxy(0)[1] + kxy(1)[1]) / 2
    pg.mouse.click(mx - 9, my)                    # az egyik ív felezőpontja
    pg.mouse.click(*kxy(0)); 
    print("kon kézi:", e.locator(".stat-row").inner_text().replace("\n", " "), "|", e.locator(".readout").nth(1).inner_text())
    pg.mouse.click(mx + 9, my)                    # a másik ív
    print("kon kézi 2:", e.locator(".stat-row").inner_text().replace("\n", " "), "|", e.locator(".readout").nth(1).inner_text())
    e.screenshot(path=S + "w2-euler-kon-manual.png")
    # --- walk counter
    wc = W(pg, "walk-counter")
    wc.locator("input[type=range]").fill("3")
    wc.locator("td[data-i='0'][data-j='2']").click()
    print("A3_AC cell:", wc.locator("td[data-i='0'][data-j='2']").inner_text(), "walks:", wc.locator("[data-w]").all_inner_texts())
    print("A3 diag note:", wc.locator(".readout").nth(1).inner_text())
    wc.locator("[data-w]").first.click()
    wc.screenshot(path=S + "w2-walk-friend.png")
    wc.locator("input[type=range]").fill("2"); wc.locator("td[data-i='0'][data-j='3']").click()
    print("A2_AD:", wc.locator(".readout").nth(0).inner_text())
    clickbtn(wc, "Árvízhét"); wc.locator("input[type=range]").fill("3")
    print("arviz tr note:", wc.locator(".readout").nth(1).inner_text())
    wc.locator("input[type=range]").fill("4")
    wc.screenshot(path=S + "w2-walk-arviz.png")
    # sötét téma + mobil
    pg.evaluate("document.documentElement.setAttribute('data-theme','dark')"); pg.wait_for_timeout(200)
    d.screenshot(path=S + "w2-dijkstra-dark.png")
    pg.set_viewport_size({"width": 390, "height": 850}); pg.wait_for_timeout(500)
    k.screenshot(path=S + "w2-kruskal-mobile.png")
    print("errors:", errs)
    b.close()
