import sys, json, glob
from playwright.sync_api import sync_playwright
port = sys.argv[1]
url = f"http://localhost:{port}/_parts/gh12/wtest2.html"
S = "_parts/gh12/shots/"
def W(pg, name): return pg.locator(f".widget[data-widget={name}]")
def txt(l): return l.evaluate("e => { const c = e.cloneNode(true); c.querySelectorAll('.katex-mathml').forEach(x => x.remove()); return c.innerText; }").replace("\n", " | ")
def bt(w, name, i=0): w.get_by_role("button", name=name, exact=True).nth(i).click()
def attr(w, a): v = w.get_attribute("data-" + a); return json.loads(v) if v else v
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=sorted(glob.glob("/home/febert/.cache/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell"))[-1])
    pg = b.new_page(viewport={"width": 1000, "height": 900})
    errs = []
    pg.on("console", lambda m: errs.append(m.type + ": " + m.text) if m.type in ("error", "warning") else None)
    pg.on("pageerror", lambda e: errs.append("PAGEERROR " + str(e)))
    pg.goto(url); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(800)
    # ---- transe-2d
    w = W(pg, "transe-2d"); w.scroll_into_view_if_needed()
    a = attr(w, "te"); print("TE cap", a["scores"], a["q"], a["rank"], a["truthRank"])
    w.locator("select").first.select_option(label="Budapest")
    print("TE q Budapest", attr(w, "te")["rank"])
    w.screenshot(path=S + "wB-transe-cap.png")
    # drag Budapest point to (2,1)
    def drag(w, key, x, y):
        box = w.locator("svg").first.bounding_box(); sc = box["width"] / 380
        P = lambda vx, vy: (box["x"] + (24 + (vx + 1) * (332 / 8)) * sc, box["y"] + (380 - 24 - (vy + 1) * (332 / 8)) * sc)
        sx, sy = pg.evaluate(f"(() => {{ const c = document.querySelector('.widget[data-widget=transe-2d] svg [data-drag=\"{key}\"]'); const r = c.getBoundingClientRect(); return [r.x + r.width/2, r.y + r.height/2]; }})()")
        pg.mouse.move(sx, sy); pg.mouse.down(); tx, ty = P(x, y); pg.mouse.move(tx, ty, steps=5); pg.mouse.up()
    drag(w, "0", 2, 1); print("TE drag Bp->(2,1)", attr(w, "te")["E"][0], attr(w, "te")["scores"])
    drag(w, "r", 5, 3); print("TE drag r", attr(w, "te")["R"], attr(w, "te")["scores"])
    bt(w, "alaphelyzet"); bt(w, "1 lépés"); print("TE 1 step", attr(w, "te")["loss"], attr(w, "te")["negs"])
    for k, lab in [("one", "1–N: városai"), ("sym", "szimmetrikus: házastársa"), ("arv", "Árvízhét")]:
        bt(w, lab); a0 = attr(w, "te"); print("TE", k, "init", a0["E"], a0["R"], a0["scores"])
        bt(w, "▶ Tanítás")
        pg.wait_for_function("(() => { const w=document.querySelector('.widget[data-widget=transe-2d]'); return !w.querySelector('button').parentElement.parentElement.textContent.includes('⏸') })()", timeout=60000) if False else None
        pg.wait_for_function("(() => [...document.querySelectorAll('.widget[data-widget=transe-2d] button')].some(b => b.textContent === '▶ Tanítás'))()", timeout=90000)
        a1 = attr(w, "te"); print("TE", k, "trained", a1["steps"], a1["loss"], a1["E"], a1["R"], {x: a1.get(x) for x in ("bpdb", "ab", "r")}, a1["rank"])
        w.screenshot(path=S + f"wB-transe-{k}-trained.png")
    print("TE ro:", txt(w.locator(".readout").last))
    # ---- kg-patterns
    w = W(pg, "kg-patterns"); w.scroll_into_view_if_needed()
    for lab in ["szimmetrikus", "antiszimmetrikus", "inverz", "összetett", "1–N"]:
        bt(w, lab); print("KG", lab, attr(w, "kg"))
        w.screenshot(path=S + f"wB-kg-{lab.replace('–','')}.png")
    bt(w, "antiszimmetrikus")
    sl = w.locator("input[type=range]").last  # RotatE phi
    sl.fill("180"); print("KG anti phi180", attr(w, "kg")["Ro"])
    bt(w, "szimmetrikus"); w.locator("input[type=range]").last.fill("180"); print("KG sym phi180", attr(w, "kg")["Ro"])
    # DistMult slider change
    w.locator("input[type=range]").first.fill("-1.5"); print("KG sym Dm after slider", attr(w, "kg")["Dm"])
    # ---- temporal
    w = W(pg, "temporal-stream"); w.scroll_into_view_if_needed()
    ts = attr(w, "ts"); print("TS mem Po", ts["mem"]["Po"], "Kl", ts["mem"]["Kl"])
    print("TS auc", attr(w, "auc"))
    print("TS pred:", txt(w.locator(".readout").first)[-120:])
    for lab in ["könnyű: soha nem látott párok", "történeti: látott, de ma nem előforduló párok", "minden ma nem előforduló pár"]:
        bt(w, lab); print("TS AUC", lab, txt(w.locator(".readout").nth(1))[:160])
    w.screenshot(path=S + "wB-temporal-stream.png")
    bt(w, "pillanatfelvétel"); w.screenshot(path=S + "wB-temporal-snap.png"); print("TS snap edges", attr(w, "ts")["edges"])
    bt(w, "folyam")
    bt(w, "▶ lejátszás"); pg.wait_for_timeout(2500); print("TS playing day", attr(w, "ts")["day"]); bt(w, "⏸ megállítás")
    w.locator("svg [data-day='1']").click(); print("TS click day", attr(w, "ts")["day"], attr(w, "ts")["edges"])
    w.locator("select").select_option(label="Cs után"); print("TS cut Cs", attr(w, "auc"))
    w.locator("select").select_option(label="Sze után")
    pg.screenshot(path=S + "wB-full-light.png", full_page=True)
    pg.evaluate("document.documentElement.setAttribute('data-theme','dark')"); pg.wait_for_timeout(400)
    for nm in ["transe-2d", "kg-patterns", "temporal-stream"]: W(pg, nm).screenshot(path=S + f"wB-{nm}-dark.png")
    pg.evaluate("document.documentElement.setAttribute('data-theme','light')")
    pg.set_viewport_size({"width": 390, "height": 850}); pg.reload(); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(1500)
    for nm in ["transe-2d", "kg-patterns", "temporal-stream"]:
        w = W(pg, nm); w.scroll_into_view_if_needed(); w.screenshot(path=S + f"wB-{nm}-mobile.png")
    print("overflow:", pg.evaluate("document.documentElement.scrollWidth"), [pg.evaluate(f"document.querySelector('.widget[data-widget={n}]').scrollWidth") for n in ["transe-2d", "kg-patterns", "temporal-stream"]])
    print("errors:", errs)
    b.close()
