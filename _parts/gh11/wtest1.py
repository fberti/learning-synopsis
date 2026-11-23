import sys, json, glob
from playwright.sync_api import sync_playwright
port = sys.argv[1]
url = f"http://localhost:{port}/_parts/gh11/wtest1.html"
S = "_parts/gh11/shots/"
def W(pg, name): return pg.locator(f".widget[data-widget={name}]")
def txt(l): return l.evaluate("e => { const c = e.cloneNode(true); c.querySelectorAll('.katex-mathml').forEach(x => x.remove()); return c.innerText; }").replace("\n", " | ")
def bt(w, name, i=0): w.get_by_role("button", name=name, exact=True).nth(i).click()
def attr(w, a): v = w.get_attribute("data-" + a); return json.loads(v) if v else v
IDS = ["Ko","Vi","Po","La","Ön","Sz","Kl"]
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=sorted(glob.glob("/home/febert/.cache/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell"))[-1])
    pg = b.new_page(viewport={"width": 1000, "height": 900})
    errs = []
    pg.on("console", lambda m: errs.append(m.type + ": " + m.text) if m.type in ("error", "warning") else None)
    pg.on("pageerror", lambda e: errs.append("PAGEERROR " + str(e)))
    pg.goto(url); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(800)
    w = W(pg, "link-heuristics")
    print("LH default", attr(w, "lh")); w.screenshot(path=S + "wA-lh-default.png")
    print("LH ro:", txt(w.locator(".readout").first))
    def pick(a, b_):
        w.locator(f"tr[data-a='{min(IDS.index(a),IDS.index(b_))}'][data-b='{max(IDS.index(a),IDS.index(b_))}']").click()
        return attr(w, "lh")
    def tap(lbl):
        xy = pg.evaluate("""(l) => { const ids = ["Ko","Vi","Po","La","Ön","Sz","Kl"], AP = { Kl: [0.6, 0], Sz: [0, 0.5], Ko: [1.3, 0.5], Vi: [0.65, 1], Po: [1.6, 1.3], La: [2.4, 1], "Ön": [2.3, 1.9] };
          const c = document.querySelector('.widget[data-widget=link-heuristics] canvas'), r = c.getBoundingClientRect(), asp = r.height / r.width;
          const P = GraphKit.normalize(ids.map(i => AP[i]), asp)[ids.indexOf(l)]; return [r.left + P[0] * r.width, r.top + P[1] * r.height]; }""", lbl)
        pg.mouse.click(xy[0], xy[1]); return attr(w, "lh")["sel"]
    w.scroll_into_view_if_needed()
    print("TAP", tap("Ko"), tap("Sz"), tap("Vi"), tap("Vi"), tap("La"), tap("Ön"))
    print("LH Ko-Sz", pick("Ko", "Sz"))
    for m in ["CN","J","AA","RA","PA"]:
        bt(w, m); print("LH top", m, attr(w, "lh")["top"], attr(w, "lh")["topS"])
    print("LH Ko-Kl", pick("Ko", "Kl"), "Sz-Kl", pick("Sz","Kl")["sc"])
    bt(w, "AA"); w.locator("label", has_text="hét végén").locator("input").check()
    for m in ["CN","J","AA","RA","PA"]:
        bt(w, m); print("LH p5", m, attr(w, "lh")["p5"])
    bt(w, "AA"); w.screenshot(path=S + "wA-lh-newedges.png")
    print("LH sum:", txt(w.locator(".readout").nth(1)))
    # canvas click on node: click Vi then Kl via node coordinates
    bt(w, "az egész hét")
    print("LH all Vi-Kl", pick("Vi", "Kl")["sc"], "Po-Sz", pick("Po","Sz")["sc"])
    print("LH ro:", txt(w.locator(".readout").first))
    w.screenshot(path=S + "wA-lh-all.png")
    # node click via canvas
    box = w.locator("canvas").first.bounding_box()
    pos = pg.evaluate("""() => { const c = document.querySelector('.widget[data-widget=link-heuristics] canvas'); return null; }""")
    # auc
    w = W(pg, "auc-builder"); w.scroll_into_view_if_needed()
    print("AUC 0", attr(w, "auc"))
    bt(w, "következő küszöb ▶"); bt(w, "következő küszöb ▶"); print("AUC 2", attr(w, "auc")); print("AUC ro:", txt(w.locator(".readout")))
    w.screenshot(path=S + "wA-auc-step2.png")
    bt(w, "következő küszöb ▶"); bt(w, "következő küszöb ▶"); print("AUC 4 (tie)", txt(w.locator(".readout")))
    bt(w, "mind"); print("AUC hand", attr(w, "auc")); print("AUC ro:", txt(w.locator(".readout")))
    w.screenshot(path=S + "wA-auc-hand-done.png")
    bt(w, "Árvízhét H–Sze → Cs–V")
    for m in ["CN","J","AA","RA","PA"]:
        bt(w, m); bt(w, "mind"); a = attr(w, "auc"); print("AUC arviz", m, a["wins"], a["ties"], a["PN"], a["auc"])
    bt(w, "J"); bt(w, "következő küszöb ▶"); bt(w, "következő küszöb ▶"); w.screenshot(path=S + "wA-auc-arviz-J-step.png")
    bt(w, "mind"); w.screenshot(path=S + "wA-auc-arviz-J-done.png")
    # leakage
    w = W(pg, "leakage-demo"); w.scroll_into_view_if_needed()
    print("LK arviz", attr(w, "leak")); w.screenshot(path=S + "wA-leak-arviz.png")
    bt(w, "igen (szivárgás)"); w.screenshot(path=S + "wA-leak-arviz-leak.png")
    bt(w, "karateklub, 10% tesztél"); print("LK karate 1", attr(w, "leak"))
    bt(w, "új felosztás"); print("LK karate 2", attr(w, "leak"))
    bt(w, "20 felosztás átlaga")
    pg.wait_for_function("(() => JSON.parse(document.querySelector('.widget[data-widget=leakage-demo]').dataset.leak).avg === 20)()", timeout=120000)
    print("LK karate avg", attr(w, "leak")); w.screenshot(path=S + "wA-leak-karate-avg.png")
    bt(w, "nem (helyes)"); w.screenshot(path=S + "wA-leak-karate-clean.png")
    pg.screenshot(path=S + "wA-full-light.png", full_page=True)
    pg.evaluate("document.documentElement.setAttribute('data-theme','dark')"); pg.wait_for_timeout(400)
    for nm in ["link-heuristics", "auc-builder", "leakage-demo"]: W(pg, nm).screenshot(path=S + f"wA-{nm}-dark.png")
    pg.evaluate("document.documentElement.setAttribute('data-theme','light')")
    pg.set_viewport_size({"width": 390, "height": 850}); pg.reload(); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(1500)
    w = W(pg, "link-heuristics"); w.locator("label", has_text="hét végén").locator("input").check()
    w = W(pg, "auc-builder"); bt(w, "mind")
    w = W(pg, "leakage-demo"); bt(w, "karateklub, 10% tesztél")
    for nm in ["link-heuristics", "auc-builder", "leakage-demo"]:
        w = W(pg, nm); w.scroll_into_view_if_needed(); w.screenshot(path=S + f"wA-{nm}-mobile.png")
    print("overflow:", pg.evaluate("document.documentElement.scrollWidth"), [pg.evaluate(f"document.querySelector('.widget[data-widget={n}]').scrollWidth") for n in ["link-heuristics", "auc-builder", "leakage-demo"]])
    # node click test on mobile: tap Ko then Sz
    w = W(pg, "link-heuristics")
    xy = pg.evaluate("""() => { const c = document.querySelector('.widget[data-widget=link-heuristics] canvas'); const r = c.getBoundingClientRect(); return [r.left, r.top, r.width, r.height]; }""")
    print("canvas", xy)
    print("errors:", errs)
    b.close()
