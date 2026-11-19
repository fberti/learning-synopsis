import sys, json, glob
from playwright.sync_api import sync_playwright
port = sys.argv[1]; mode = sys.argv[2] if len(sys.argv) > 2 else "all"
url = f"http://localhost:{port}/_parts/gh9/wtest2.html"
S = "_parts/gh9/shots/"
def W(pg, name): return pg.locator(f".widget[data-widget={name}]")
def txt(l): return l.evaluate("e => { const c = e.cloneNode(true); c.querySelectorAll('.katex-mathml').forEach(x => x.remove()); return c.innerText; }").replace("\n", " | ")
def bt(w, name, i=0): w.get_by_role("button", name=name, exact=True).nth(i).click()
def setR(pg, wname, v, idx=0):
    pg.evaluate("([w, v, i]) => { const s = document.querySelectorAll(`.widget[data-widget=${w}] input[type=range]`)[i]; s.value = v; s.dispatchEvent(new Event('input')); }", [wname, v, idx])
def res(w, attr="result"): return json.loads(w.get_attribute("data-" + attr))
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=sorted(glob.glob("/home/febert/.cache/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell"))[-1])
    pg = b.new_page(viewport={"width": 1000, "height": 900})
    errs = []
    pg.on("console", lambda m: errs.append(m.type + ": " + m.text) if m.type in ("error", "warning") else None)
    pg.on("pageerror", lambda e: errs.append("PAGEERROR " + str(e)))
    pg.goto(url); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(800)
    if mode in ("all", "tc"):
        w = W(pg, "threshold-crowd")
        r = res(w); print("TC seq final", r["final"], "steps", r["steps"])
        bt(w, "az 1-es helyett 2-es"); r = res(w); print("TC swap final", r["final"], "steps", r["steps"])
        bt(w, "normális eloszlás")
        out = []
        for sd in range(0, 31): setR(pg, "threshold-crowd", sd, 1); r = res(w); out.append((sd, r["final"], r["steps"]))
        print("TC normal mean25:", out)
        setR(pg, "threshold-crowd", 12, 1); w.screenshot(path=S + "wB-tc-normal12.png")
        setR(pg, "threshold-crowd", 13, 1); w.screenshot(path=S + "wB-tc-normal13.png")
        print("TC readout:", txt(w.locator(".readout")))
        bt(w, "0, 1, 2, …, 99"); bt(w, "Elejére"); bt(w, "Lépés"); bt(w, "Lépés"); bt(w, "Lépés"); w.screenshot(path=S + "wB-tc-seq-step3.png"); print("TC step3:", txt(w.locator(".readout")))
        # click a person (index 1) and +1 -> becomes 'saját' with threshold 2 -> final 1
        w.locator("svg g[data-i='1']").click(); bt(w, "+1"); r = res(w); print("TC after +1 on person1:", r["final"], r["steps"], "mode on:", txt(w.locator(".controls .btn.on")))
        # drag on histogram: move person with threshold 2 back to 1
        hs = w.locator("svg[data-hist]"); bb = hs.bounding_box()
        vb = 680; L = 30; bw = (680 - 30 - 16) / 100
        def xpos(v): return bb["x"] + (L + (v + 0.5) * bw) / vb * bb["width"]
        y = bb["y"] + bb["height"] * 0.7
        pg.mouse.move(xpos(2), y); pg.mouse.down(); pg.mouse.move(xpos(1.5), y, steps=3); pg.mouse.move(xpos(1), y, steps=3); pg.mouse.up()
        r = res(w); print("TC after drag 2->1:", r["final"], r["steps"])
        bt(w, "▶ Lejátszás"); pg.wait_for_timeout(1500); print("TC playing:", txt(w.locator(".readout")).split(" | ")[0]); bt(w, "⏸ Szünet")
        w.screenshot(path=S + "wB-tc-custom.png")
    if mode in ("all", "svc"):
        w = W(pg, "simple-vs-complex"); w.scroll_into_view_if_needed()
        r = res(w); print("SVC q=.05 seed1 simple", r["simple"][-1], len(r["simple"]) - 1, "complex", r["complex"][-1], "rewired", r["rewired"])
        setR(pg, "simple-vs-complex", 0); r = res(w); print("SVC q=0 simple rounds", len(r["simple"]) - 1, "complex", r["complex"][:6], r["complex"][-1])
        bt(w, "Kör"); bt(w, "Kör"); bt(w, "Kör"); w.screenshot(path=S + "wB-svc-q0-r3.png"); print("SVC q0 r3:", txt(w.locator(".readout").nth(0)), "||", txt(w.locator(".readout").nth(1)))
        setR(pg, "simple-vs-complex", 0.1); bt(w, "▶ Lejátszás"); pg.wait_for_timeout(5000); w.screenshot(path=S + "wB-svc-q01.png"); print("SVC q.1 end:", txt(w.locator(".readout").nth(0)), "||", txt(w.locator(".readout").nth(1)))
        # click node 30 as start
        bt(w, "Görbe: 8 q-érték × 100 minta (n = 100)")
        pg.wait_for_function("document.querySelector('.widget[data-widget=simple-vs-complex]').dataset.curve", timeout=120000)
        print("SVC curve:", w.get_attribute("data-curve"))
        w.screenshot(path=S + "wB-svc-curve.png")
    if mode in ("all", "ct"):
        w = W(pg, "cascade-tree"); w.scroll_into_view_if_needed()
        print("CT mixed:", res(w, "tree"))
        bt(w, "műsorszórás (csillag)"); print("CT star10:", res(w, "tree"))
        bt(w, "lánc"); print("CT path10:", res(w, "tree"))
        # build star5, path5, mixed small by clicking
        def nodes(): return w.locator("svg g[data-v]")
        bt(w, "Csak gyökér")
        for i in range(4): w.locator("svg g[data-v='0']").click()
        print("CT star5:", res(w, "tree"))
        bt(w, "Csak gyökér")
        for i in range(4): w.locator(f"svg g[data-v='{i}']").click()
        print("CT path5:", res(w, "tree"))
        bt(w, "Csak gyökér")
        w.locator("svg g[data-v='0']").click(); w.locator("svg g[data-v='0']").click(); w.locator("svg g[data-v='1']").click(); w.locator("svg g[data-v='1']").click()
        print("CT root-{1,2},1-{3,4}:", res(w, "tree")); w.screenshot(path=S + "wB-ct-custom.png")
        bt(w, "generált (független kaszkád)")
        for i in range(8):
            t = res(w, "tree")
            if t["size"] >= 15: break
            bt(w, "Új kaszkád")
        print("CT generated:", res(w, "tree"), txt(w.locator(".readout").nth(0)))
        w.screenshot(path=S + "wB-ct-gen.png")
        for R in [0.5, 0.9, 1]:
            setR(pg, "cascade-tree", R, 1); print("CT borel", res(w, "borel"))
        setR(pg, "cascade-tree", 0.9, 1)
        bt(w, "1000 kaszkád"); pg.wait_for_function("document.querySelector('.widget[data-widget=cascade-tree]').dataset.dist", timeout=120000)
        print("CT dist BA p.1:", w.get_attribute("data-dist"), "|", txt(w.locator(".readout").nth(1)))
        w.screenshot(path=S + "wB-ct-dist-ba.png")
        bt(w, "ER, n = 300, ⟨k⟩ = 4"); setR(pg, "cascade-tree", 0.2, 0)
        pg.evaluate("delete document.querySelector('.widget[data-widget=cascade-tree]').dataset.dist")
        bt(w, "1000 kaszkád"); pg.wait_for_function("document.querySelector('.widget[data-widget=cascade-tree]').dataset.dist", timeout=120000)
        print("CT dist ER p.2:", w.get_attribute("data-dist"), "|", txt(w.locator(".readout").nth(1)))
        w.screenshot(path=S + "wB-ct-dist-er.png")
    if mode in ("all", "sp"):
        w = W(pg, "seed-picker"); w.scroll_into_view_if_needed()
        def node_click(i):
            pg.evaluate("i => { const w = document.querySelector('.widget[data-widget=seed-picker]'); w._click(i); }", i)
        print("SP default:", res(w))
        # hubs p=.2 / .5: A, AB, AC
        for pv in [0.2, 0.5]:
            setR(pg, "seed-picker", pv); pg.wait_for_timeout(300)
            bt(w, "1"); c = w.locator("canvas"); bb = c.bounding_box()
            def clickLab(lab):
                xy = pg.evaluate("lab => { const w = document.querySelector('.widget[data-widget=seed-picker]'); return w._pos(lab); }", lab)
                pg.mouse.click(bb["x"] + xy[0], bb["y"] + xy[1])
            clickLab("A"); rA = res(w)["user"]
            bt(w, "2"); clickLab("B"); rAB = res(w)["user"]
            bt(w, "Kijelölés törlése"); clickLab("A"); clickLab("C"); rAC = res(w)["user"]
            bt(w, "Mohó"); bt(w, "Optimum"); pg.wait_for_timeout(1500); r = res(w)
            print(f"SP hubs p={pv}: A {rA} AB {rAB} AC {rAC} greedy {r['greedy']} opt {r['opt']}")
        w.screenshot(path=S + "wB-sp-hubs.png")
        bt(w, "Árvízhét"); pg.wait_for_timeout(200); c = w.locator("canvas"); bb = c.bounding_box()
        def clickLab(lab):
            xy = pg.evaluate("lab => { const w = document.querySelector('.widget[data-widget=seed-picker]'); return w._pos(lab); }", lab)
            pg.mouse.click(bb["x"] + xy[0], bb["y"] + xy[1])
        for pv in [0.3, 0.5]:
            setR(pg, "seed-picker", pv); pg.wait_for_timeout(300)
            bt(w, "1"); single = {}
            for lab in ["Ko", "Vi", "Po", "La", "Ön", "Sz", "Kl"]:
                bt(w, "Kijelölés törlése"); clickLab(lab); single[lab] = res(w)["user"]
            bt(w, "2"); bt(w, "Mohó"); bt(w, "Legnagyobb fokszámúak"); bt(w, "Optimum"); pg.wait_for_timeout(800); r = res(w)
            print(f"SP arviz p={pv}: single {single} greedy {r['greedy']} degree {r['degree']} opt {r['opt']}")
        w.screenshot(path=S + "wB-sp-arviz.png")
        bt(w, "karateklub"); setR(pg, "seed-picker", 0.1); pg.wait_for_timeout(400); bt(w, "Mohó"); bt(w, "Legnagyobb fokszámúak"); bt(w, "Optimum")
        pg.wait_for_timeout(200); t0 = pg.evaluate("performance.now()")
        pg.wait_for_function("JSON.parse(document.querySelector('.widget[data-widget=seed-picker]').dataset.result).opt", timeout=120000)
        print("SP karate p.1 k2:", res(w), "opt ms", pg.evaluate("performance.now()") - t0)
        w.screenshot(path=S + "wB-sp-karate.png")
        bt(w, "BA, n = 100"); pg.wait_for_timeout(400); bt(w, "3"); bt(w, "Mohó"); bt(w, "Legnagyobb fokszámúak"); bt(w, "Optimum"); pg.wait_for_timeout(500)
        print("SP BA k3:", res(w), "|", txt(w.locator(".tw").nth(0)))
        w.screenshot(path=S + "wB-sp-ba.png")
    if mode == "all":
        pg.screenshot(path=S + "wB-full-light.png", full_page=True)
        pg.evaluate("document.documentElement.setAttribute('data-theme','dark')"); pg.wait_for_timeout(400)
        for nm in ["threshold-crowd", "simple-vs-complex", "cascade-tree", "seed-picker"]: W(pg, nm).screenshot(path=S + f"wB-{nm}-dark.png")
        pg.evaluate("document.documentElement.setAttribute('data-theme','light')")
        pg.set_viewport_size({"width": 390, "height": 850}); pg.reload(); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(1500)
        for nm in ["threshold-crowd", "simple-vs-complex", "cascade-tree", "seed-picker"]:
            w = W(pg, nm); w.scroll_into_view_if_needed(); pg.wait_for_timeout(300)
            if nm == "seed-picker": bt(w, "Mohó")
            if nm == "simple-vs-complex": bt(w, "Kör"); bt(w, "Kör")
            if nm == "cascade-tree": bt(w, "1000 kaszkád"); pg.wait_for_timeout(2500)
            w.screenshot(path=S + f"wB-{nm}-mobile.png")
        print("overflow:", pg.evaluate("document.documentElement.scrollWidth"), [pg.evaluate(f"document.querySelector('.widget[data-widget={n}]').scrollWidth") for n in ["threshold-crowd", "simple-vs-complex", "cascade-tree", "seed-picker"]])
    print("errors:", errs)
    b.close()
