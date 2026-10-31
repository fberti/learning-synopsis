import sys
from playwright.sync_api import sync_playwright
port = sys.argv[1]
url = f"http://localhost:{port}/_parts/el1/wtest2.html"
S = "_parts/el1/shots/"
def W(pg, name): return pg.locator(f".widget[data-widget={name}]")
def txt(l): return l.inner_text().replace("\n", " | ")
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": 1000, "height": 900})
    errs = []
    pg.on("console", lambda m: errs.append(m.type + ": " + m.text) if m.type in ("error", "warning") else None)
    pg.on("pageerror", lambda e: errs.append("PAGEERROR " + str(e)))
    pg.goto(url); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(800)
    # ---------- rub-series
    r = W(pg, "rub-series"); r.scroll_into_view_if_needed()
    print("rub init:", txt(r.locator(".readout").first))
    r.get_by_role("button", name="Dörzsöld össze!").click(); pg.wait_for_timeout(1300)
    r.screenshot(path=S + "w2-rub-anim.png")
    pg.wait_for_timeout(1600)
    print("rub haj/lufi:", txt(r.locator(".readout").first))
    r.screenshot(path=S + "w2-rub-light.png")
    sels = r.locator("select")
    for a, bb in [("0", "11"), ("10", "3"), ("4", "4"), ("4", "7"), ("2", "4")]:
        sels.nth(0).select_option(a); sels.nth(1).select_option(bb)
        r.get_by_role("button", name="Dörzsöld össze!").click(); pg.wait_for_timeout(2800)
        print(f"rub {a}/{bb}:", txt(r.locator(".readout").first))
    r.screenshot(path=S + "w2-rub-pvc.png")
    for pr in ["lufi ↔ lufi", "lufi ↔ haj", "üveg ↔ üveg", "üveg ↔ lufi"]:
        r.get_by_role("button", name=pr).click()
        print("near", pr, ":", txt(r.locator(".readout").nth(1)))
    pg.evaluate("() => { const s = document.querySelector('.widget[data-widget=rub-series] input[type=range]'); s.value = 5; s.dispatchEvent(new Event('input')); }")
    print("near 5cm:", txt(r.locator(".readout").nth(1)))
    r.screenshot(path=S + "w2-rub-near.png")
    # ---------- esd-spark
    e = W(pg, "esd-spark"); e.scroll_into_view_if_needed(); pg.wait_for_timeout(300)
    def stats(): return " / ".join(e.locator(".stat .v").all_inner_texts())
    for Q in [0.02, 0.2, 0.3, 1, 1.5]:
        pg.evaluate(f"document.querySelector('.widget[data-widget=esd-spark]').__esd.setQ({Q})")
        print(f"esd Q={Q}:", stats())
    pg.evaluate("document.querySelector('.widget[data-widget=esd-spark]').__esd.setQ(0)")
    e.get_by_role("button", name="Lépj egyet").click(); print("esd 1 step:", stats())
    e.get_by_role("button", name="10 lépés").click(); pg.wait_for_timeout(1800)
    e.screenshot(path=S + "w2-esd-walk.png")
    pg.wait_for_timeout(2000)
    print("esd 11 steps:", stats(), "|", txt(e.locator(".readout")))
    for k in range(6):
        e.get_by_role("button", name="10 lépés").click(); pg.wait_for_timeout(3100)
    print("esd 71 steps:", stats(), "|", txt(e.locator(".readout")))
    for k in range(4):
        e.get_by_role("button", name="10 lépés").click(); pg.wait_for_timeout(3100)
    print("esd 111 steps:", stats(), "|", txt(e.locator(".readout")))
    e.get_by_role("button", name="⚡ Kisülés").click(); pg.wait_for_timeout(750)
    e.screenshot(path=S + "w2-esd-spark.png")
    pg.wait_for_timeout(900)
    print("esd after spark:", stats(), "|", txt(e.locator(".readout")))
    e.screenshot(path=S + "w2-esd-after.png")
    for Q, tag in [(0.15, "1.5kV"), (0.2, "2kV"), (0.3, "3kV"), (1.0, "10kV")]:
        pg.evaluate(f"document.querySelector('.widget[data-widget=esd-spark]').__esd.setQ({Q})")
        e.get_by_role("button", name="⚡ Kisülés").click(); pg.wait_for_timeout(1500)
        print(f"esd discharge {tag}:", txt(e.locator(".readout")))
    # páratartalom 80%, mezítláb
    pg.evaluate("() => { const s = document.querySelector('.widget[data-widget=esd-spark] input[type=range]'); s.value = 80; s.dispatchEvent(new Event('input')); }")
    print("esd 80%:", txt(e.locator(".readout")))
    e.get_by_role("button", name="mezítláb").click(); print("esd mezitlab 80%:", txt(e.locator(".readout")))
    pg.evaluate("() => { const s = document.querySelector('.widget[data-widget=esd-spark] input[type=range]'); s.value = 20; s.dispatchEvent(new Event('input')); }")
    for sh in ["mezítláb", "bőrtalp"]:
        e.get_by_role("button", name=sh).click()
        for fl in ["fa", "csempe", "műszálas szőnyeg"]:
            e.get_by_role("button", name=fl).click(); print(f"esd {sh}/{fl}:", txt(e.locator(".readout")).split(".")[1])
    e.get_by_role("button", name="gumitalp").click()
    pg.evaluate("document.querySelector('.widget[data-widget=esd-spark]').__esd.setQ(1.2)"); pg.wait_for_timeout(300)
    e.screenshot(path=S + "w2-esd-light.png")
    # ---------- floating-input
    f = W(pg, "floating-input"); f.scroll_into_view_if_needed(); pg.wait_for_timeout(1500)
    FI = "document.querySelector('.widget[data-widget=floating-input]').__fi"
    def st(): return pg.evaluate(f"{FI}.state()")
    s0 = st(); print("fi idle:", s0["running"], s0["raf"], "avg", s0["avg"][-5:], "raw", s0["raw"][-8:], "|", txt(f.locator(".readout")))
    print("  esd raf stopped when offscreen?", pg.evaluate("document.querySelector('.widget[data-widget=esd-spark]').getBoundingClientRect().bottom < 0"))
    # húzás: fésű 30 → 4 cm
    cvs = f.locator("canvas").first; box = cvs.bounding_box()
    geo = pg.evaluate(f"(() => {{ const c = document.querySelectorAll('.widget[data-widget=floating-input] canvas')[0]; const W = c.getBoundingClientRect().width; const ax = Math.min(96, W*0.28); return [ax, W]; }})()")
    ax, Wc = geo; x3 = ax + 26; x40 = Wc - 84
    xr = lambda rr: box["x"] + x3 + (x40 - x3) * (rr - 3) / 37 + 31
    y = box["y"] + 44 - 6
    pg.mouse.move(xr(30), y); pg.mouse.down()
    for k in range(30):
        pg.mouse.move(xr(30 - k * 26 / 29), y); pg.wait_for_timeout(50)
    print("fi approaching:", txt(f.locator(".readout")))
    pg.mouse.up(); pg.wait_for_timeout(300)
    s1 = st(); print("fi near r=", s1["r"], "avg", s1["avg"][-5:], "eff", round(s1["eff"]), "|", txt(f.locator(".readout")))
    f.screenshot(path=S + "w2-fi-near.png")
    pg.wait_for_timeout(4000)
    s2 = st(); print("fi hold 4s: avg", s2["avg"][-3:], "eff", round(s2["eff"]), "|", txt(f.locator(".readout")))
    pg.evaluate(f"{FI}.setR(40)"); pg.wait_for_timeout(250)
    s3 = st(); print("fi removed: avg", s3["avg"][-3:], "eff", round(s3["eff"]), "|", txt(f.locator(".readout")))
    pg.wait_for_timeout(1500)
    print("fi after removal:", txt(f.locator(".readout")))
    f.screenshot(path=S + "w2-fi-overshoot.png")
    f.locator("label", has_text="kéz").locator("input").check(); pg.wait_for_timeout(1500)
    s = st(); print("fi hand: raw range", min(s["raw"]), max(s["raw"]), "avg range", min(s["avg"]), max(s["avg"]), "|", txt(f.locator(".readout")))
    f.locator("label", has_text="lámpavezeték").locator("input").check(); pg.wait_for_timeout(1500)
    s = st(); print("fi hand+lamp: raw range", min(s["raw"]), max(s["raw"]), "avg range", min(s["avg"]), max(s["avg"]), "|", txt(f.locator(".readout")))
    f.screenshot(path=S + "w2-fi-lamp.png")
    f.locator("label", has_text="kéz").locator("input").uncheck(); pg.wait_for_timeout(1500)
    s = st(); print("fi lamp: raw range", min(s["raw"]), max(s["raw"]), "avg range", min(s["avg"]), max(s["avg"]))
    f.locator("label", has_text="lámpavezeték").locator("input").uncheck()
    f.locator("label", has_text="lehúzó").locator("input").check(); pg.wait_for_timeout(1500)
    s = st(); print("fi pulldown: raw", min(s["raw"]), max(s["raw"]), "avg", min(s["avg"]), max(s["avg"]), "|", txt(f.locator(".readout")))
    f.screenshot(path=S + "w2-fi-pull.png")
    f.locator("label", has_text="lehúzó").locator("input").uncheck()
    f.get_by_role("button", name="+ pozitív").click(); pg.evaluate(f"{FI}.setR(5)"); pg.wait_for_timeout(400)
    s = st(); print("fi +comb 5cm: eff", round(s["eff"]), "avg", s["avg"][-3:])
    f.get_by_role("button", name="semleges").click(); pg.wait_for_timeout(300)
    f.get_by_role("button", name="− negatív").click()
    f.get_by_role("button", name="⏸ Megállít").click(); pg.wait_for_timeout(300)
    a1 = st()["avg"]; pg.wait_for_timeout(600); a2 = st()["avg"]
    print("fi paused:", a1 == a2, st()["raf"])
    f.get_by_role("button", name="▶ Indít").click(); pg.wait_for_timeout(400); print("fi resumed:", st()["raf"])
    # láthatóság
    W(pg, "rub-series").scroll_into_view_if_needed(); pg.wait_for_timeout(500)
    print("fi offscreen raf:", st()["raf"])
    f.scroll_into_view_if_needed(); pg.wait_for_timeout(500); print("esd raf while fi visible:", pg.evaluate("document.querySelector('.widget[data-widget=esd-spark]').__esd.get().raf"))
    f.scroll_into_view_if_needed(); pg.wait_for_timeout(500); print("fi back raf:", st()["raf"])
    pg.screenshot(path=S + "w2-full-light.png", full_page=True)
    # sötét
    pg.evaluate("document.documentElement.setAttribute('data-theme','dark')"); pg.wait_for_timeout(400)
    r.screenshot(path=S + "w2-rub-dark.png"); e.screenshot(path=S + "w2-esd-dark.png")
    f.scroll_into_view_if_needed(); pg.evaluate(f"{FI}.setR(6)"); pg.wait_for_timeout(1200); f.screenshot(path=S + "w2-fi-dark.png")
    pg.evaluate("document.documentElement.setAttribute('data-theme','light')")
    # mobil
    pg.set_viewport_size({"width": 390, "height": 850}); pg.reload(); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(800)
    r = W(pg, "rub-series"); e = W(pg, "esd-spark"); f = W(pg, "floating-input")
    r.get_by_role("button", name="Dörzsöld össze!").click(); pg.wait_for_timeout(2900); r.screenshot(path=S + "w2-rub-mobile.png")
    e.scroll_into_view_if_needed(); pg.evaluate("document.querySelector('.widget[data-widget=esd-spark]').__esd.setQ(0.8)"); e.screenshot(path=S + "w2-esd-mobile.png")
    f.scroll_into_view_if_needed(); pg.evaluate(f"{FI}.setR(5)"); pg.wait_for_timeout(1500); f.screenshot(path=S + "w2-fi-mobile.png")
    print("overflow:", pg.evaluate("document.documentElement.scrollWidth"), [pg.evaluate(f"document.querySelector('.widget[data-widget={n}]').scrollWidth") for n in ["rub-series", "esd-spark", "floating-input"]])
    print("errors:", errs)
    b.close()
