import sys, json, glob
from playwright.sync_api import sync_playwright
port = sys.argv[1]; mode = sys.argv[2] if len(sys.argv) > 2 else "all"
url = f"http://localhost:{port}/_parts/gh10/wtest2.html"
S = "_parts/gh10/shots/"
def W(pg, name): return pg.locator(f".widget[data-widget={name}]")
def txt(l): return l.evaluate("e => { const c = e.cloneNode(true); c.querySelectorAll('.katex-mathml').forEach(x => x.remove()); return c.innerText; }").replace("\n", " | ")
def bt(w, name, i=0): w.get_by_role("button", name=name, exact=True).nth(i).click()
def setR(pg, wname, v, idx=0):
    pg.evaluate("([w, v, i]) => { const s = document.querySelectorAll(`.widget[data-widget=${w}] input[type=range]`)[i]; s.value = v; s.dispatchEvent(new Event('input')); }", [wname, v, idx])
def res(w, attr="result"): return json.loads(w.get_attribute("data-" + attr))
def waitAttr(pg, wname, attr, t=120000):
    pg.wait_for_function(f"document.querySelector('.widget[data-widget={wname}]').dataset.{attr}", timeout=t)
def clearAttr(pg, wname, attr): pg.evaluate(f"delete document.querySelector('.widget[data-widget={wname}]').dataset.{attr}")
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=sorted(glob.glob("/home/febert/.cache/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell"))[-1])
    pg = b.new_page(viewport={"width": 1000, "height": 900})
    errs = []
    pg.on("console", lambda m: errs.append(m.type + ": " + m.text) if m.type in ("error", "warning") else None)
    pg.on("pageerror", lambda e: errs.append("PAGEERROR " + str(e)))
    pg.goto(url); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(800)
    if mode in ("all", "bb"):
        w = W(pg, "backbone-filter")
        r = res(w); print("BB lesmis disp a=.2:", r)
        for a in ["0,05", "0,1", "0,3"]:
            bt(w, a); print("BB a", a, res(w))
        bt(w, "0,2"); bt(w, "Összevetés: ugyanannyi él a másik módszerrel")
        for a in ["0,05", "0,1", "0,2", "0,3"]:
            bt(w, a); r = res(w); print("BB cmp a", a, "disp", r["m"], r["v"], r["comps"], "| top-m nodes", r["cmp"]["v"], r["cmp"]["comps"], "onlyDisp", len(r["cmp"]["onlyA"]), "onlyTop", len(r["cmp"]["onlyB"]), "maxDrop", r.get("maxDrop"))
        bt(w, "0,2"); w.screenshot(path=S + "wB-bb-lesmis-cmp.png"); print("BB cmp readout:", txt(w.locator(".readout").nth(1)))
        bt(w, "Összevetés: ugyanannyi él a másik módszerrel"); bt(w, "globális küszöb")
        for t in [2, 3, 5, 10]:
            setR(pg, "backbone-filter", t, 0); r = res(w); print("BB global t", t, r["m"], r["v"], r["comps"])
        w.screenshot(path=S + "wB-bb-lesmis-global.png")
        bt(w, "Árvízhét"); bt(w, "diszparitásszűrő"); print("BB arviz alphas", w.get_attribute("data-alphas"))
        bt(w, "0,05"); print("BB arviz a=.05:", res(w), txt(w.locator(".readout").nth(0)))
        bt(w, "0,3"); print("BB arviz a=.3:", res(w)); w.screenshot(path=S + "wB-bb-arviz.png")
        bt(w, "kis csillag"); print("BB star alphas", w.get_attribute("data-alphas"))
        c = w.locator("canvas"); bb = c.bounding_box()
        P = pg.evaluate("GraphKit.normalize([[1,1],[0,0],[2,0],[0,2],[2,2]],0.5)")
        mx = (P[0][0] + P[2][0]) / 2 * bb["width"]; my = (P[0][1] + P[2][1]) / 2 * bb["height"]
        pg.mouse.click(bb["x"] + mx, bb["y"] + my); print("BB star clicked:", txt(w.locator(".controls").nth(3)))
        bt(w, "súly +1"); bt(w, "súly +1"); print("BB star after +2 on K-2 alphas", w.get_attribute("data-alphas"))
        w.screenshot(path=S + "wB-bb-star.png")
    if mode in ("all", "md"):
        w = W(pg, "missing-data"); w.scroll_into_view_if_needed()
        print("MD karate sample:", res(w, "sample"), txt(w.locator(".readout").nth(0)))
        bt(w, "100 minta"); waitAttr(pg, "missing-data", "many"); print("MD karate 100 f=.2:", res(w, "many"))
        bt(w, "Görbe: 6 arány × 100 minta"); waitAttr(pg, "missing-data", "curve"); print("MD karate edges curve [f, deg, btw, eig, same...]:", res(w, "curve"))
        w.screenshot(path=S + "wB-md-karate-curve.png")
        clearAttr(pg, "missing-data", "curve"); bt(w, "csúcsok hiányoznak"); bt(w, "Görbe: 6 arány × 100 minta"); waitAttr(pg, "missing-data", "curve"); print("MD karate nodes curve:", res(w, "curve"))
        w.screenshot(path=S + "wB-md-karate-nodes.png")
        bt(w, "élek hiányoznak"); bt(w, "Árvízhét"); print("MD arviz base:", res(w, "base"))
        for a, bb_ in [("Ko", "Po"), ("Vi", "Po"), ("Vi", "Sz"), ("La", "Ön")]:
            pg.evaluate("([a,b]) => document.querySelector('.widget[data-widget=missing-data]')._delEdge(a,b)", [a, bb_])
            print("MD del", a, bb_, res(w, "del")["btw"], "|", txt(w.locator(".readout").nth(2)) if w.locator(".readout").count() > 2 else "")
        # real canvas click on Ko-Po
        c = w.locator("canvas"); bx = c.bounding_box()
        P = pg.evaluate("(() => { const ids=['Ko','Vi','Po','La','Ön','Sz','Kl'], pos={Kl:[0.6,0],Sz:[0,0.5],Ko:[1.3,0.5],Vi:[0.65,1],Po:[1.6,1.3],La:[2.4,1],'Ön':[2.3,1.9]}; return GraphKit.normalize(ids.map(i=>pos[i]),0.5); })()")
        pg.mouse.click(bx["x"] + (P[0][0] + P[2][0]) / 2 * bx["width"], bx["y"] + (P[0][1] + P[2][1]) / 2 * bx["height"])
        print("MD click Ko-Po:", res(w, "del"))
        w.screenshot(path=S + "wB-md-arviz-del.png")
        bt(w, "Krackhardt: barátság"); bt(w, "100 minta"); clearAttr(pg, "missing-data", "many"); bt(w, "100 minta"); waitAttr(pg, "missing-data", "many"); print("MD krack 100:", res(w, "many"))
        w.screenshot(path=S + "wB-md-krack.png")
    if mode in ("all", "sg"):
        w = W(pg, "sensitivity-grid"); w.scroll_into_view_if_needed()
        waitAttr(pg, "sensitivity-grid", "result"); r = res(w)
        for i, t in enumerate([1, 2, 3, 5]): print("SG t", t, r[i])
        w.locator("td[data-c='2,3']").click(); print("SG cell t3 g2:", txt(w.locator(".readout")))
        w.screenshot(path=S + "wB-sg.png")
        for k in range(3):
            clearAttr(pg, "sensitivity-grid", "result"); bt(w, "Újraszámolás más véletlen magokkal"); waitAttr(pg, "sensitivity-grid", "result"); r = res(w)
            print("SG reseed", k, [[c[1] for c in row] for row in r], [[c[0] for c in row] for row in r])
    if mode in ("all", "er"):
        w = W(pg, "ergm-toy"); w.scroll_into_view_if_needed()
        print("ER default:", res(w))
        bt(w, "(0; 0)"); print("ER 4 (0,0):", res(w))
        bt(w, "(−1; 2)"); print("ER 4 (-1,2):", res(w), res(w, "top"))
        bt(w, "(−1; 0)"); print("ER 4 (-1,0) top:", res(w, "top"))
        w.screenshot(path=S + "wB-er-4.png")
        bt(w, "6 csúcs")
        for nm in ["(−1; 0)", "(−1; 0,5)", "(−1; 1)", "(−1,5; 1,2)"]:
            bt(w, nm); r = res(w); print("ER 6", nm, "Ee", r["Ee"], "pFull", r["pFull"], "bimodal", r["bimodal"])
        pg.wait_for_function("document.querySelector('.widget[data-widget=ergm-toy]').dataset.top && JSON.parse(document.querySelector('.widget[data-widget=ergm-toy]').dataset.result).n===6 && document.querySelector('.widget[data-widget=ergm-toy]').innerText.includes('156 osztály')", timeout=60000)
        print("ER 6 top:", res(w, "top"), "| info:", txt(w.locator(".readout").nth(0)))
        w.screenshot(path=S + "wB-er-6-bimodal.png")
        bt(w, "5 csúcs"); pg.wait_for_timeout(300); print("ER 5 classes:", "34 osztály" in w.inner_text())
        print("ER fit paw:", res(w, "fit"))
        for nm in ["háromszög + magányos csúcs", "3 élű út", "csillag"]:
            bt(w, nm); print("ER fit", nm, res(w, "fit"), "|", txt(w.locator(".readout").nth(1))[:200])
        bt(w, "háromszög + függő él"); bt(w, "csak élparaméter"); print("ER fit paw edge-only:", res(w, "fit"))
        bt(w, "él + háromszög")
        # click pair 1-3 (0-2) in the observed svg: toggles a diagonal off -> 
        w.locator("line[data-p='0-2']").click(); print("ER fit after toggling 1-3:", res(w, "fit"))
        bt(w, "háromszög + függő él"); bt(w, "Beállítás a csúszkákra (4 csúcs)"); print("ER applied:", res(w))
        w.screenshot(path=S + "wB-er-fit.png")
    if mode == "all":
        pg.screenshot(path=S + "wB-full-light.png", full_page=True)
        pg.evaluate("document.documentElement.setAttribute('data-theme','dark')"); pg.wait_for_timeout(400)
        for nm in ["backbone-filter", "missing-data", "sensitivity-grid", "ergm-toy"]: W(pg, nm).screenshot(path=S + f"wB-{nm}-dark.png")
        pg.evaluate("document.documentElement.setAttribute('data-theme','light')")
        pg.set_viewport_size({"width": 390, "height": 850}); pg.reload(); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(1500)
        waitAttr(pg, "sensitivity-grid", "result")
        for nm in ["backbone-filter", "missing-data", "sensitivity-grid", "ergm-toy"]:
            w = W(pg, nm); w.scroll_into_view_if_needed(); pg.wait_for_timeout(300)
            if nm == "backbone-filter": bt(w, "Összevetés: ugyanannyi él a másik módszerrel")
            if nm == "missing-data": bt(w, "Görbe: 6 arány × 100 minta"); waitAttr(pg, "missing-data", "curve")
            if nm == "ergm-toy": bt(w, "6 csúcs"); pg.wait_for_timeout(2500)
            w.screenshot(path=S + f"wB-{nm}-mobile.png")
        print("overflow:", pg.evaluate("document.documentElement.scrollWidth"), [pg.evaluate(f"document.querySelector('.widget[data-widget={n}]').scrollWidth") for n in ["backbone-filter", "missing-data", "sensitivity-grid", "ergm-toy"]])
    print("errors:", errs)
    b.close()
