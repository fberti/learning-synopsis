import sys, json, glob
from playwright.sync_api import sync_playwright
port = sys.argv[1]; mode = sys.argv[2] if len(sys.argv) > 2 else "all"
url = f"http://localhost:{port}/_parts/gh11/wtest2.html"
S = "_parts/gh11/shots/"
def W(pg, name): return pg.locator(f".widget[data-widget={name}]")
def txt(l): return l.evaluate("e => { const c = e.cloneNode(true); c.querySelectorAll('.katex-mathml').forEach(x => x.remove()); return c.innerText; }").replace("\n", " | ")
def bt(w, name, i=0): w.get_by_role("button", name=name, exact=True).nth(i).click()
def res(w, attr="result"): return json.loads(w.get_attribute("data-" + attr))
def setR(pg, wname, v, idx=0):
    pg.evaluate("([w, v, i]) => { const s = document.querySelectorAll(`.widget[data-widget=${w}] input[type=range]`)[i]; s.value = v; s.dispatchEvent(new Event('input')); }", [wname, v, idx])
def waitRes(pg, wname, t=180000):
    pg.wait_for_function(f"document.querySelector('.widget[data-widget={wname}]').dataset.result", timeout=t)
def clr(pg, wname): pg.evaluate(f"delete document.querySelector('.widget[data-widget={wname}]').dataset.result")
def clickNode(pg, w, P, i):
    bb = w.locator("canvas").bounding_box(); pg.mouse.click(bb["x"] + P[i][0] * bb["width"], bb["y"] + P[i][1] * bb["height"])
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=sorted(glob.glob("/home/febert/.cache/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell"))[-1])
    pg = b.new_page(viewport={"width": 1000, "height": 900})
    errs = []
    pg.on("console", lambda m: errs.append(m.type + ": " + m.text) if m.type in ("error", "warning") else None)
    pg.on("pageerror", lambda e: errs.append("PAGEERROR " + str(e)))
    pg.goto(url); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(800)
    if mode in ("all", "se"):
        w = W(pg, "spectral-embed")
        r = res(w); print("SE path4", r["vals"], r["Z"], r["near"])
        w.screenshot(path=S + "wB-se-path4.png")
        bt(w, "öt barát (A–E)"); r = res(w); print("SE five", r["vals"], r["same"], r["near"], r["mult"]); print("  ", txt(w.locator(".readout").nth(0)))
        # edit: click B then E -> add edge B-E
        P = pg.evaluate("GraphKit.normalize([[0,0],[1,0.6],[0,1.2],[2.1,0.6],[3.2,0.6]],0.45)")
        clickNode(pg, w, P, 1); clickNode(pg, w, P, 4); r = res(w); print("SE five +B-E m", r["m"], r["near"], r["same"])
        w.screenshot(path=S + "wB-se-five-edit.png")
        clickNode(pg, w, P, 1); clickNode(pg, w, P, 4); clickNode(pg, w, P, 1); clickNode(pg, w, P, 3); r = res(w); print("SE five -B-D m", r["m"], "disc", r["disc"], txt(w.locator(".readout").nth(0))[:200])
        bt(w, "eredeti élek"); print("SE reset m", res(w)["m"])
        bt(w, "Árvízhét (egész hét)"); r = res(w); print("SE arviz", r["vals"], r["same"], r["near"], r["far"]); print("  ", txt(w.locator(".readout").nth(1)))
        w.screenshot(path=S + "wB-se-arviz.png")
        bt(w, "4. sajátvektor"); r = res(w); print("SE arviz y4", r["near"][:2], r["same"])
        bt(w, "karateklub"); r = res(w); print("SE karate y4", r["vals"], r["near"]); bt(w, "3. sajátvektor"); print("SE karate y3", res(w)["near"])
        w.locator("svg [data-i='33']").click(); print("SE focus 34:", txt(w.locator(".readout").nth(0))[-120:])
        w.screenshot(path=S + "wB-se-karate.png")
    if mode in ("all", "rw"):
        w = W(pg, "random-walk-corpus"); w.scroll_into_view_if_needed()
        print("RW step default", res(w, "step")); print("RW win", res(w, "win"), "corpus", res(w, "corpus"))
        setR(pg, "random-walk-corpus", 2, 0); setR(pg, "random-walk-corpus", -1, 1); print("RW step p4 q.5", res(w, "step"))
        print("RW step text:", txt(w.locator(".readout").nth(0)))
        setR(pg, "random-walk-corpus", 1, 4); print("RW win w1", res(w, "win"))
        setR(pg, "random-walk-corpus", 2, 4)
        print("RW pairs", res(w, "pairs")); bt(w, "PPMI"); print("RW pairs ppmi", res(w, "pairs"))
        w.screenshot(path=S + "wB-rw-five.png")
        # click on edge D-E in canvas
        P = pg.evaluate("GraphKit.normalize([[0,0],[1,0.6],[0,1.2],[2.1,0.6],[3.2,0.6]],0.42)")
        bb = w.locator("canvas").bounding_box(); pg.mouse.click(bb["x"] + (P[3][0]+P[4][0])/2*bb["width"], bb["y"] + (P[3][1]+P[4][1])/2*bb["height"]); print("RW click D-E", res(w, "step"))
        pg.mouse.click(bb["x"] + (P[3][0]+P[4][0])/2*bb["width"], bb["y"] + (P[3][1]+P[4][1])/2*bb["height"]); print("RW click again", res(w, "step"))
        bt(w, "karateklub"); print("RW karate knn", w.get_attribute("data-knn"), res(w, "corpus"))
        w.screenshot(path=S + "wB-rw-karate.png")
        setR(pg, "random-walk-corpus", 0, 0); setR(pg, "random-walk-corpus", 2, 1); print("RW karate q=4 knn", w.get_attribute("data-knn"))
        setR(pg, "random-walk-corpus", -2, 1); print("RW karate q=.25 knn", w.get_attribute("data-knn"))
        bt(w, "Árvízhét (egész hét)"); print("RW arviz pairs", res(w, "pairs")[:4]); w.screenshot(path=S + "wB-rw-arviz.png")
    if mode in ("all", "lp", "lp30"):
        w = W(pg, "link-pred-lab"); w.scroll_into_view_if_needed()
        waitRes(pg, "link-pred-lab"); print("LP default", res(w))
        w.screenshot(path=S + "wB-lp-karate10.png")
        def runcfg(label, *acts):
            clr(pg, "link-pred-lab")
            for a in acts: a()
            pg.wait_for_timeout(400); waitRes(pg, "link-pred-lab"); r = res(w); print("LP", label, r["k"], r["nNeg"], [(x[0], x[1], x[2]) for x in r["res"]], "p@k", [x[3] for x in r["res"]])
        runcfg("30 splits", lambda: bt(w, "30"))
        w.screenshot(path=S + "wB-lp-karate30.png")
        runcfg("30 leak", lambda: w.get_by_label("szivárgás (a pontozó gráf a teljes gráf)").check())
        w.screenshot(path=S + "wB-lp-leak.png")
        runcfg("30 hard", lambda: w.get_by_label("szivárgás (a pontozó gráf a teljes gráf)").uncheck(), lambda: bt(w, "nehéz: 2 távolságú párok"))
        runcfg("30 rand", lambda: bt(w, "véletlen, ugyanannyi"))
        if mode != "lp30":
            runcfg("lesmis 10 all", lambda: bt(w, "minden nem él"), lambda: bt(w, "10"), lambda: bt(w, "Les Misérables"))
            w.screenshot(path=S + "wB-lp-lesmis.png")
            runcfg("karate 1", lambda: bt(w, "karateklub"), lambda: bt(w, "1"))
    if mode == "all":
        pg.screenshot(path=S + "wB-full-light.png", full_page=True)
        pg.evaluate("document.documentElement.setAttribute('data-theme','dark')"); pg.wait_for_timeout(400)
        for nm in ["spectral-embed", "random-walk-corpus", "link-pred-lab"]: W(pg, nm).screenshot(path=S + f"wB-{nm}-dark.png")
        pg.evaluate("document.documentElement.setAttribute('data-theme','light')")
        pg.set_viewport_size({"width": 390, "height": 850}); pg.reload(); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(1000)
        for nm in ["spectral-embed", "random-walk-corpus", "link-pred-lab"]:
            w = W(pg, nm); w.scroll_into_view_if_needed(); pg.wait_for_timeout(300)
            if nm == "spectral-embed": bt(w, "Árvízhét (egész hét)")
            if nm == "link-pred-lab": waitRes(pg, nm)
            w.screenshot(path=S + f"wB-{nm}-mobile.png")
        print("overflow:", pg.evaluate("document.documentElement.scrollWidth"), [pg.evaluate(f"document.querySelector('.widget[data-widget={n}]').scrollWidth") for n in ["spectral-embed", "random-walk-corpus", "link-pred-lab"]])
    print("errors:", errs)
    b.close()
