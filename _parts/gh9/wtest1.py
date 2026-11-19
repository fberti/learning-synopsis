import sys, json, glob
from playwright.sync_api import sync_playwright
port = sys.argv[1]; mode = sys.argv[2] if len(sys.argv) > 2 else "all"
url = f"http://localhost:{port}/_parts/gh9/wtest1.html"
S = "_parts/gh9/shots/"
def W(pg, name): return pg.locator(f".widget[data-widget={name}]")
def txt(l): return l.evaluate("e => { const c = e.cloneNode(true); c.querySelectorAll('.katex-mathml').forEach(x => x.remove()); return c.innerText; }").replace("\n", " | ")
def bt(w, name, i=0): w.get_by_role("button", name=name, exact=True).nth(i).click()
def setR(pg, sel, v):
    pg.evaluate("([s, v]) => { const e = document.querySelector(s); e.value = v; e.dispatchEvent(new Event('input')); e.dispatchEvent(new Event('change')); }", [sel, v])
def attr(w, a): v = w.get_attribute("data-" + a); return json.loads(v) if v and v[0] in "[{" else v
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=sorted(glob.glob("/home/febert/.cache/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell"))[-1])
    pg = b.new_page(viewport={"width": 1000, "height": 900})
    errs = []
    pg.on("console", lambda m: errs.append(m.type + ": " + m.text) if m.type in ("error", "warning") else None)
    pg.on("pageerror", lambda e: errs.append("PAGEERROR " + str(e)))
    pg.goto(url); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(800)
    SN = ".widget[data-widget=sir-network] "
    if mode in ("all", "sir"):
        w = W(pg, "sir-network"); ro = w.locator(".readout")
        print("SIR default:", txt(ro.nth(0)), "||", txt(ro.nth(1)))
        w.screenshot(path=S + "wA-sir-er-t0.png")
        for i in range(25): bt(w, "Lépés")
        print("SIR ER after 25:", txt(ro.nth(0))); w.screenshot(path=S + "wA-sir-er-t25.png")
        # Árvízhét SI beta 1 from Kl
        bt(w, "Árvízhét"); bt(w, "SI"); setR(pg, SN + "input[aria-label='β']", 1)
        for i in range(5): bt(w, "Lépés")
        print("SI Árvízhét Kl β=1 I per step:", w.get_attribute("data-counts")); w.screenshot(path=S + "wA-sir-arviz-si.png")
        # mean field check
        bt(w, "véletlen (ER)"); bt(w, "SIR"); setR(pg, SN + "input[aria-label='β']", 0.5); setR(pg, SN + "input[aria-label='γ']", 1)
        print("MF final (β .5 γ 1, ⟨k⟩ of ER):", w.get_attribute("data-mf"), w.get_attribute("data-stat"))
        # histogram on several nets
        setR(pg, SN + "input[aria-label='β']", 0.15); setR(pg, SN + "input[aria-label='γ']", 0.2)
        for net in ["véletlen (ER)", "rács", "kisvilág", "skálafüggetlen (BA)", "karateklub"]:
            bt(w, net); bt(w, "100 futás átlaga")
            pg.wait_for_function("(() => { const d = document.querySelector('.widget[data-widget=sir-network]').dataset.hist; return d && JSON.parse(d).runs === 100; })()", timeout=60000)
            print("HIST", net, w.get_attribute("data-hist"), "| stat", w.get_attribute("data-stat"))
            if net in ("véletlen (ER)", "rács"): w.screenshot(path=S + f"wA-sir-hist-{net[:4]}.png")
        # play a bit
        bt(w, "skálafüggetlen (BA)"); bt(w, "▶ Lejátszás"); pg.wait_for_timeout(3000); w.screenshot(path=S + "wA-sir-ba-play.png"); print("BA play:", txt(ro.nth(0)))
        bt(w, "❚❚ Szünet")
        bt(w, "SIS"); bt(w, "5 véletlen fertőzött"); 
        for i in range(40): bt(w, "Lépés")
        w.screenshot(path=S + "wA-sir-sis.png"); print("SIS:", txt(ro.nth(0)))
        # click a node
        box = w.locator("canvas").first.bounding_box(); pg.mouse.click(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2); print("after click:", txt(ro.nth(0)))
    if mode in ("all", "thr"):
        w = W(pg, "epidemic-threshold"); w.scroll_into_view_if_needed()
        pg.wait_for_function("document.querySelector('.widget[data-widget=epidemic-threshold]').dataset.curves && document.querySelector('.widget[data-widget=epidemic-threshold]').dataset.sizes", timeout=120000)
        pg.wait_for_timeout(1500)
        print("THR stats n=1000:", w.get_attribute("data-stats")); print("THR sizes:", w.get_attribute("data-sizes")); print("THR imm n=1000:", w.get_attribute("data-imm"))
        print("THR curves:", w.get_attribute("data-curves"))
        print("THR table:", txt(w.locator(".tw").nth(0)))
        w.screenshot(path=S + "wA-thr-1000.png")
        w.locator("label", has_text="rács is").locator("input").check(); pg.wait_for_timeout(2500); w.screenshot(path=S + "wA-thr-ring.png")
        bt(w, "3000"); pg.wait_for_timeout(5000); print("THR n=3000 stats:", w.get_attribute("data-stats"), "imm:", w.get_attribute("data-imm"))
        bt(w, "óriáskomponens"); pg.wait_for_timeout(500); w.screenshot(path=S + "wA-thr-3000-giant.png")
        setR(pg, ".widget[data-widget=epidemic-threshold] input[aria-label='beoltottak aránya']", 0.2); pg.wait_for_timeout(4000)
        print("THR f=.2:", w.get_attribute("data-imm"))
    if mode in ("all", "op"):
        w = W(pg, "opinion-dynamics"); w.scroll_into_view_if_needed(); ro = w.locator(".readout")
        def clickNode(i):
            xy = pg.evaluate("i => { const box = [...document.querySelectorAll('.widget[data-widget=opinion-dynamics] > div')].find(d => d._view); const v = box._view, r = v.c.getBoundingClientRect(); const [x, y] = v.px(v.nodes[i]); return [r.left + x, r.top + y]; }", i)
            pg.mouse.click(xy[0], xy[1])
        print("DG star default:", attr(w, "dg")["pred"])
        for i in range(30): bt(w, "Lépés")
        print("DG star t=30:", attr(w, "dg")); w.screenshot(path=S + "wA-op-dg-star.png")
        clickNode(0); clickNode(1); clickNode(1); print("DG star leaf 10 (x0 after clicks):", attr(w, "dg"))
        bt(w, "út (3 csúcs)"); 
        for i in range(40): bt(w, "Lépés")
        print("DG path:", attr(w, "dg"))
        bt(w, "karateklub"); bt(w, "▶ Lejátszás"); pg.wait_for_timeout(2500); bt(w, "❚❚ Szünet"); w.screenshot(path=S + "wA-op-dg-karate.png"); print("DG karate:", txt(ro.nth(0)))
        bt(w, "Árvízhét"); w.screenshot(path=S + "wA-op-dg-arviz.png")
        bt(w, "Korlátos bizalom"); pg.wait_for_timeout(300)
        OS = ".widget[data-widget=opinion-dynamics] "
        for m in ["HK", "Deffuant"]:
            bt(w, m)
            for e in [0.05, 0.1, 0.15, 0.2, 0.25, 0.3]:
                setR(pg, OS + "input[aria-label='ε']", e); pg.wait_for_timeout(150); print("BC", m, e, attr(w, "bc"))
            setR(pg, OS + "input[aria-label='ε']", 0.15); pg.wait_for_timeout(200); w.screenshot(path=S + f"wA-op-bc-{m}.png")
        bt(w, "Kis példa: 5 ágens (HK)")
        for e in [0.15, 0.25, 0.45]:
            setR(pg, OS + "input[aria-label='ε']", e); pg.wait_for_timeout(150); print("BC small", e, attr(w, "bc"), "|", txt(ro.nth(1)))
        w.screenshot(path=S + "wA-op-bc-small.png")
        bt(w, "Visszhangkamra"); pg.wait_for_timeout(300)
        for q in [0, 0.5, 1]:
            setR(pg, OS + "input[aria-label='q']", q); bt(w, "Újra")
            for k in range(3): bt(w, "+100 lépés")
            pg.wait_for_timeout(800)
            print("EC q", q, attr(w, "ec")); w.screenshot(path=S + f"wA-op-ec-q{q}.png")
        bt(w, "▶ Lejátszás"); pg.wait_for_timeout(2000); bt(w, "❚❚ Szünet"); print("EC play:", attr(w, "ec"))
    if mode == "all":
        pg.screenshot(path=S + "wA-full-light.png", full_page=True)
        pg.evaluate("document.documentElement.setAttribute('data-theme','dark')"); pg.wait_for_timeout(400)
        for nm in ["sir-network", "epidemic-threshold", "opinion-dynamics"]: W(pg, nm).screenshot(path=S + f"wA-{nm}-dark.png")
        pg.evaluate("document.documentElement.setAttribute('data-theme','light')")
        pg.set_viewport_size({"width": 390, "height": 850}); pg.reload(); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(1500)
        w = W(pg, "sir-network"); 
        for i in range(15): bt(w, "Lépés")
        w.screenshot(path=S + "wA-sir-mobile.png")
        w = W(pg, "epidemic-threshold"); w.scroll_into_view_if_needed(); pg.wait_for_timeout(6000); w.screenshot(path=S + "wA-thr-mobile.png")
        w = W(pg, "opinion-dynamics"); w.scroll_into_view_if_needed(); w.screenshot(path=S + "wA-op-dg-mobile.png")
        bt(w, "Korlátos bizalom"); pg.wait_for_timeout(300); w.screenshot(path=S + "wA-op-bc-mobile.png")
        bt(w, "Visszhangkamra"); pg.wait_for_timeout(300); bt(w, "+100 lépés"); pg.wait_for_timeout(800); w.screenshot(path=S + "wA-op-ec-mobile.png")
        print("overflow:", pg.evaluate("document.documentElement.scrollWidth"), [pg.evaluate(f"document.querySelector('.widget[data-widget={n}]').scrollWidth") for n in ["sir-network", "epidemic-threshold", "opinion-dynamics"]])
    print("errors:", errs)
    b.close()
