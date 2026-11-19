import sys, json, re
from playwright.sync_api import sync_playwright
port = sys.argv[1]; mode = sys.argv[2] if len(sys.argv) > 2 else "all"
url = f"http://localhost:{port}/_parts/gh8/wtest2.html"
S = "_parts/gh8/shots/"
def W(pg, name): return pg.locator(f".widget[data-widget={name}]")
def txt(l): return l.evaluate("e => { const c = e.cloneNode(true); c.querySelectorAll('.katex-mathml').forEach(x => x.remove()); return c.innerText; }").replace("\n", " | ")
def bt(w, name, i=0): w.get_by_role("button", name=name, exact=True).nth(i).click()
def setR(pg, wname, v, idx=0):
    pg.evaluate("([w, v, i]) => { const s = document.querySelectorAll(`.widget[data-widget=${w}] input[type=range]`)[i]; s.value = v; s.dispatchEvent(new Event('input')); }", [wname, v, idx])
with sync_playwright() as p:
    import glob; b = p.chromium.launch(executable_path=sorted(glob.glob("/home/febert/.cache/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell"))[-1]); pg = b.new_page(viewport={"width": 1000, "height": 900})
    errs = []
    pg.on("console", lambda m: errs.append(m.type + ": " + m.text) if m.type in ("error", "warning") else None)
    pg.on("pageerror", lambda e: errs.append("PAGEERROR " + str(e)))
    pg.goto(url); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(800)
    if mode in ("all", "lv"):
        w = W(pg, "louvain-steps"); ro = w.locator(".readout")
        ds = {"twoTri": "két háromszög + híd", "three": "három klikk", "arviz": "Árvízhét", "karate": "karateklub"}
        for k, lab in ds.items():
            bt(w, lab); 
            # reset seed to 1 by reloading dataset: seed persists, so record
            out = {}
            for s in range(30 if k == "arviz" else 10):
                bt(w, "Végig"); r = json.loads(w.get_attribute("data-result")); out[s] = (r["Q"], r["k"], w.get_attribute("data-check"), "".join(map(str, r["lab"])))
                bt(w, "Új sorrend")
            print("LV", k, out)
        # gamma on karate
        for g in [0.5, 2]:
            setR(pg, "louvain-steps", g); bt(w, "Végig"); r = json.loads(w.get_attribute("data-result")); print("LV karate gamma", g, r["k"], r["Qg"], w.get_attribute("data-check"))
        setR(pg, "louvain-steps", 1)
        # step-through screenshots on two triangles (seed continues)
        bt(w, "két háromszög + híd"); 
        bt(w, "Következő lépés"); print("LV step1:", txt(ro)); print("  table:", txt(w.locator(".tw")))
        w.screenshot(path=S + "w2-lv-step1.png")
        bt(w, "Fázis végéig"); print("LV phase:", txt(ro)); w.screenshot(path=S + "w2-lv-phase.png")
        bt(w, "Összevonás (2. fázis)"); pg.wait_for_timeout(900); print("LV merged:", txt(ro)); w.screenshot(path=S + "w2-lv-merged.png")
        bt(w, "Következő lépés"); print("LV lvl2 step:", txt(ro)); print("  table:", txt(w.locator(".tw")))
        bt(w, "Végig"); print("LV done:", txt(ro))
        w.locator("label", has_text="Szétszakadt").locator("input").check(); print("LV disc:", txt(ro))
        bt(w, "karateklub"); bt(w, "Fázis végéig"); w.screenshot(path=S + "w2-lv-karate-phase.png")
        bt(w, "Összevonás (2. fázis)"); pg.wait_for_timeout(900); bt(w, "Következő lépés"); w.screenshot(path=S + "w2-lv-karate-super.png"); print("LV karate super:", txt(ro))
        bt(w, "Végig"); w.screenshot(path=S + "w2-lv-karate-done.png"); print("LV karate done:", txt(ro))
    if mode in ("all", "st"):
        w = W(pg, "stability-check"); w.scroll_into_view_if_needed(); ro = w.locator(".readout")
        def wait(): pg.wait_for_timeout(50); pg.wait_for_function("document.querySelector('.widget[data-widget=stability-check]').dataset.summary", timeout=60000)
        wait(); print("ST karate L20:", txt(ro)); print("   ", txt(w.locator("p", has_text="legkevésbé")))
        w.screenshot(path=S + "w2-st-karate.png")
        bt(w, "50"); wait(); print("ST karate L50:", txt(ro))
        bt(w, "címketerjesztés"); wait(); print("ST karate LPA50:", txt(ro)); w.screenshot(path=S + "w2-st-karate-lpa.png")
        bt(w, "Louvain"); bt(w, "Les Misérables"); wait(); print("ST lesmis L50:", txt(ro)); print("   ", txt(w.locator("p", has_text="legkevésbé"))); w.screenshot(path=S + "w2-st-lesmis.png")
        bt(w, "véletlen G(34, 78)"); wait(); print("ST random L50:", txt(ro)); w.screenshot(path=S + "w2-st-random.png")
        bt(w, "Új véletlen gráf"); wait(); print("ST random2:", txt(ro))
        bt(w, "karateklub"); bt(w, "20"); wait()
    if mode in ("all", "sbm"):
        w = W(pg, "sbm-generator"); w.scroll_into_view_if_needed(); ro = w.locator(".readout")
        def res(): return json.loads(w.get_attribute("data-result"))
        print("SBM default:", txt(ro), "|", txt(w.locator(".tw").nth(1)))
        setR(pg, "sbm-generator", 10, 0); setR(pg, "sbm-generator", 10, 1); r = res(); print("SBM 2x10 exp", r["exp"], "act", r["act"])
        w.screenshot(path=S + "w2-sbm-comm.png")
        for pre in ["mag–periféria", "kétrészes", "nincs szerkezet", "közösségek"]:
            bt(w, pre); r = res(); print("SBM", pre, "k", r["k"], "Q", round(r["Q"], 3), "nmi", round(r["nmi"], 3), "n", r["n"], "m", r["m"])
            nm = []
            for s in range(30 if k == "arviz" else 10): bt(w, "Új minta"); nm.append(round(res()["nmi"], 2))
            print("    nmi over 10 samples", nm)
            w.screenshot(path=S + f"w2-sbm-{pre[:4]}.png")
        bt(w, "3 blokk"); print("SBM 3 blocks:", txt(ro)); w.screenshot(path=S + "w2-sbm-3.png")
        bt(w, "véletlen sorrend"); w.screenshot(path=S + "w2-sbm-3-shuf.png"); bt(w, "blokkok szerint")
        bt(w, "Görbe számolása (21 × 5 minta)")
        pg.wait_for_function("document.querySelector('.widget[data-widget=sbm-generator]').dataset.det", timeout=120000)
        print("SBM det:", w.get_attribute("data-det"))
        w.screenshot(path=S + "w2-sbm-det.png")
    if mode == "all":
        pg.screenshot(path=S + "w2-full-light.png", full_page=True)
        pg.evaluate("document.documentElement.setAttribute('data-theme','dark')"); pg.wait_for_timeout(400)
        for nm in ["louvain-steps", "stability-check", "sbm-generator"]: W(pg, nm).screenshot(path=S + f"w2-{nm}-dark.png")
        pg.evaluate("document.documentElement.setAttribute('data-theme','light')")
        pg.set_viewport_size({"width": 390, "height": 850}); pg.reload(); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(1500)
        w = W(pg, "louvain-steps"); bt(w, "Árvízhét"); bt(w, "Következő lépés"); bt(w, "Következő lépés"); w.screenshot(path=S + "w2-lv-mobile.png")
        bt(w, "Fázis végéig"); bt(w, "Összevonás (2. fázis)"); pg.wait_for_timeout(900); w.screenshot(path=S + "w2-lv-mobile-super.png")
        w = W(pg, "stability-check"); w.scroll_into_view_if_needed(); pg.wait_for_timeout(1500); w.screenshot(path=S + "w2-st-mobile.png")
        w = W(pg, "sbm-generator"); w.scroll_into_view_if_needed(); bt(w, "3 blokk"); w.screenshot(path=S + "w2-sbm-mobile.png")
        print("overflow:", pg.evaluate("document.documentElement.scrollWidth"), [pg.evaluate(f"document.querySelector('.widget[data-widget={n}]').scrollWidth") for n in ["louvain-steps","stability-check","sbm-generator"]])
    print("errors:", errs)
    b.close()
