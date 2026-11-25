import sys, json, glob
from playwright.sync_api import sync_playwright
port = sys.argv[1]
url = f"http://localhost:{port}/_parts/gh12/wtest1.html"
S = "_parts/gh12/shots/"
def W(pg, name): return pg.locator(f".widget[data-widget={name}]")
def txt(l): return l.evaluate("e => { const c = e.cloneNode(true); c.querySelectorAll('.katex-mathml').forEach(x => x.remove()); return c.innerText; }").replace("\n", " | ")
def bt(w, name, i=0): w.get_by_role("button", name=name, exact=True).nth(i).click()
def attr(w, a): v = w.get_attribute("data-" + a); return json.loads(v) if v else v
def setr(w, aria, v):
    w.locator(f"input[aria-label='{aria}']").evaluate(f"(e) => {{ e.value = {v}; e.dispatchEvent(new Event('input')); }}")
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=sorted(glob.glob("/home/febert/.cache/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell"))[-1])
    pg = b.new_page(viewport={"width": 1000, "height": 900})
    errs = []
    pg.on("console", lambda m: errs.append(m.type + ": " + m.text) if m.type in ("error", "warning") else None)
    pg.on("pageerror", lambda e: errs.append("PAGEERROR " + str(e)))
    pg.goto(url); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(800)
    # ---- relation-message
    w = W(pg, "relation-message"); a = attr(w, "rm")
    print("RM hom", a["hom"], "\nRM rgcn", a["rgcn"], "\nRM dir", a["dir"], "params", a["params"])
    print("RM ro:", txt(w.locator(".readout").first))
    w.screenshot(path=S + "wA-rm-default.png")
    bt(w, "R-GCN, irányított"); a = attr(w, "rm"); print("RM dir mode params", a["params"], a["dir"])
    setr(w, "w− inverz (bírálták)", 1); print("RM dir winv=1", attr(w, "rm")["dir"]); print("RM ro:", txt(w.locator(".readout").first))
    w.screenshot(path=S + "wA-rm-dir.png")
    bt(w, "homogén (egy súly: w+ minden élre)") if w.get_by_role("button", name="homogén (egy súly: w+ minden élre)").count() else w.locator(".controls .btn").first.click()
    print("RM hom mode", attr(w, "rm")["mode"], attr(w, "rm")["params"])
    # node click on canvas: Po
    box = w.locator("canvas").bounding_box()
    xy = pg.evaluate("""() => { const ids=["Ko","Vi","Po","Sz"], AP={Sz:[0,.5],Ko:[1.3,.5],Vi:[.65,1],Po:[1.6,1.3]}; const c=document.querySelector('.widget[data-widget=relation-message] canvas'), r=c.getBoundingClientRect();
      const P=GraphKit.normalize(ids.map(i=>AP[i]), r.height/r.width)[2]; return [r.left+P[0]*r.width, r.top+P[1]*r.height]; }""")
    pg.mouse.click(*xy); print("RM sel after canvas click", attr(w, "rm")["sel"])
    w.locator("button[data-x='Sz']").click(); print("RM x Sz=1", attr(w, "rm")["x"], attr(w, "rm")["rgcn"])
    w.locator("label", has_text="ReLU").locator("input").check(); print("RM relu", attr(w, "rm")["hom"])
    bt(w, "mind a 7 szereplő"); a = attr(w, "rm"); print("RM 7", a["ids"], a["rgcn"])
    w.screenshot(path=S + "wA-rm-7.png")
    bt(w, "alapállapot"); print("RM reset", attr(w, "rm")["rgcn"])
    # ---- hetero
    w = W(pg, "hetero-graph-explorer"); w.scroll_into_view_if_needed(); a = attr(w, "hg")
    print("HG", a["nodes"], a["edges"], a["nT"], a["eT"], "M", a["M"], "pair", a["pair"], a["nPaths"], a["ex"])
    w.screenshot(path=S + "wA-hg-LSL.png")
    for nm in ["L–C–E–C–L", "L–C–K–C–L", "Sz–C–Sz", "C–Sz–C", "C–L–C", "C–E–C"]:
        bt(w, nm); a = attr(w, "hg")
        print("HG", nm, "pairs", a["pairs"], "tot", a["tot"], "pair", a["pair"], a["nPaths"], "ex", a["ex"])
        if nm.startswith("L") or nm.startswith("Sz"): print("   M", a["M"])
        if nm == "C–E–C":
            M = a["M"]; print("   CEC pairs", [f"C{i+1}-C{j+1}" for i in range(12) for j in range(i+1,12) if M[i][j]])
        w.screenshot(path=S + f"wA-hg-{nm}.png")
    bt(w, "Sz–C–Sz")
    w.locator("td[data-i='3'][data-j='4']").click(); a = attr(w, "hg"); print("HG La-Ön", a["pair"], a["nPaths"], a["ex"])
    w.locator("button[data-p='1']").click(); print("HG ex2", attr(w, "hg")["ex"])
    w.locator("input[data-t='K']").uncheck(); w.locator("input[data-t='E']").uncheck(); a = attr(w, "hg"); print("HG filter", a["nodes"], a["edges"], a["eT"])
    w.screenshot(path=S + "wA-hg-filter.png")
    w.locator("input[data-t='K']").check(); w.locator("input[data-t='E']").check()
    bt(w, "L–C–Sz–C–L")
    # click hom edge
    w.locator("svg.hom g[data-i='1'][data-j='3']").first.click() if w.locator("svg.hom g[data-i='1'][data-j='3']").count() else None
    print("HG hom edge", attr(w, "hg")["pair"], attr(w, "hg")["nPaths"])
    # ---- vote
    w = W(pg, "metapath-vote"); w.scroll_into_view_if_needed(); a = attr(w, "mv")
    print("MV default", a["exp"], a["wrong"], a["homo"])
    print("MV sum:", txt(w.locator(".readout").nth(1)))
    print("MV ro:", txt(w.locator(".readout").first))
    w.screenshot(path=S + "wA-mv-default.png")
    for nm in ["csak lap", "csak szereplő", "csak esemény", "lap + szereplő", "mind egyformán"]:
        bt(w, nm); a = attr(w, "mv"); print("MV", nm, a["beta"], a["exp"], a["wrong"])
    bt(w, "lap + szereplő"); setr(w, "béta C–E–C", 0.5); print("MV (1,1,.5)", attr(w, "mv")["exp"])
    bt(w, "mind egyformán"); w.locator("tr[data-c='2']").click(); w.screenshot(path=S + "wA-mv-all.png")
    bt(w, "lap + szereplő")
    bt(w, "új cikk")
    def nw(acts, paper):
        for id in ["Ko","Vi","Po","La","Ön","Sz","Kl"]:
            cb = w.locator(f"input[data-a='{id}']")
            if (id in acts) != cb.is_checked(): cb.click()
        w.locator("select").select_option(paper)
        return attr(w, "mv")["nw"]
    print("NEW KoKl ?", nw(["Ko","Kl"], ""))
    print("NEW KoKl EK", nw(["Ko","Kl"], "EK"))
    w.screenshot(path=S + "wA-mv-new.png")
    print("NEW PoÖn ?", nw(["Po","Ön"], ""))
    print("NEW SzKl ?", nw(["Sz","Kl"], ""))
    print("MV new ro:", txt(w.locator(".readout").first))
    pg.screenshot(path=S + "wA-full-light.png", full_page=True)
    pg.evaluate("document.documentElement.setAttribute('data-theme','dark')"); pg.wait_for_timeout(400)
    for nm in ["relation-message", "hetero-graph-explorer", "metapath-vote"]: W(pg, nm).screenshot(path=S + f"wA-{nm}-dark.png")
    pg.evaluate("document.documentElement.setAttribute('data-theme','light')")
    pg.set_viewport_size({"width": 390, "height": 850}); pg.reload(); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(1500)
    for nm in ["relation-message", "hetero-graph-explorer", "metapath-vote"]:
        w = W(pg, nm); w.scroll_into_view_if_needed(); w.screenshot(path=S + f"wA-{nm}-mobile.png")
    print("overflow:", pg.evaluate("document.documentElement.scrollWidth"), [pg.evaluate(f"document.querySelector('.widget[data-widget={n}]').scrollWidth") for n in ["relation-message", "hetero-graph-explorer", "metapath-vote"]])
    print("errors:", errs)
    b.close()
