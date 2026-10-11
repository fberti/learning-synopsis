import sys, os, math, json
from playwright.sync_api import sync_playwright
URL = "http://localhost:8763/_parts/ch12/wtest3.html"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "ch12", "shots3")
os.makedirs(OUT, exist_ok=True)
errs = []
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1280, "height": 900})
    pg.on("console", lambda m: m.type in ("error", "warning") and errs.append(m.text))
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(URL); pg.wait_for_timeout(1200)
    tb = pg.locator('[data-widget="transformer-block"]')
    want = {"a kísérletünk Transformere": "2 929", "BERT-base": "109 482 240", "GPT-2 small": "124 439 808", "GPT-2 XL": "1 557 611 200", "GPT-3": "174 604 259 328"}
    for name, w in want.items():
        tb.get_by_role("button", name=name, exact=True).click()
        t = tb.locator(".readout").last.inner_text()
        print(name, "OK" if w in t else "FAIL", t.split("\n")[0])
    # komponensek kattintása (dekóder, elő-normalizálás)
    for txt in ["maszkolt többfejű önfigyelem", "előrecsatolt háló (FFN)", "záró rétegnormalizálás", "lineáris + softmax (V)", "pozíciókódolás"]:
        tb.locator("svg text", has_text=txt).first.click()
        print("panel:", tb.locator(".two-canvas > div").nth(1).inner_text().split("\n")[0])
    tb.locator("svg path[stroke-width], svg g path").nth(0)
    tb.get_by_role("button", name="enkóder (BERT-szerű)").click()
    tb.get_by_role("button", name="utó-normalizálás (2017, BERT)").click()
    tb.locator("svg text", has_text="összeadás + rétegnormalizálás").first.click()
    print("panel:", tb.locator(".two-canvas > div").nth(1).inner_text().split("\n")[0])
    # d módosítása
    tb.get_by_role("button", name="BERT-base", exact=True).click()
    tb.locator('input[type=number]').nth(1).fill("10")
    print("d/h warn:", "nem egész" in tb.locator(".readout").last.inner_text() or "többszöröse" in tb.locator(".readout").last.inner_text())
    tb.get_by_role("button", name="a kísérletünk Transformere", exact=True).click()
    tb.locator("svg text", has_text="többfejű önfigyelem").first.click()
    # review-lab
    rl = pg.locator('[data-widget="review-lab"]')
    ref = pg.evaluate("window.REVIEW12.ref")
    rows = rl.locator(".tw").first.locator("tbody tr")
    sig = lambda z: 1 / (1 + math.exp(-z))
    keys = ["bow1", "bow2", "avg", "rnn", "tf_nopos", "tf"]
    print("sentence:", " ".join(rl.locator(".chip").all_inner_texts()))
    for i, k in enumerate(keys):
        cells = rows.nth(i).locator("td").all_inner_texts()
        exp = f"{100*sig(ref[k][0]):.1f}".replace(".", ",") + "%"
        print("  ", k, cells[2], "expected", exp, "OK" if cells[2] == exp else "FAIL", cells[3])
    rl.get_by_role("button", name="⇄ a két tagmondat cseréje").click()
    print("after swap:", " ".join(rl.locator(".chip").all_inner_texts()))
    for i, k in enumerate(keys):
        cells = rows.nth(i).locator("td").all_inner_texts()
        print("  ", k, cells[2], cells[3], cells[4])
    rl.locator("table td[title]").nth(15).hover()
    print("cell:", rl.locator(".readout").last.inner_text())
    rl.get_by_role("button", name="2. fej").click()
    rl.get_by_role("button", name="pozíció nélkül").click()
    pg.screenshot(path=f"{OUT}/review-nopos.png", full_page=False, clip=rl.bounding_box())
    rl.get_by_role("button", name="szópárok súlyai").click()
    print("bow2 panel:", rl.locator(".readout").last.inner_text())
    for _ in range(5):
        rl.get_by_role("button", name="🎲 véletlen kritika").click()
    print("random:", " ".join(rl.locator(".chip").all_inner_texts()))
    # kézi beállítás: tagadó, „és” ellentétes
    sel = rl.locator("select")
    sel.nth(1).select_option("n"); sel = rl.locator("select")
    rl.locator("select[aria-label=kötőszó]").select_option("és")
    print("rule:", rl.locator("div").filter(has_text="A szabály szerint").last.inner_text()[:200])
    rl.locator("select[aria-label=kötőszó]").select_option("de")
    rl.get_by_role("button", name="Transformer figyelme").click()
    # képernyőképek
    for theme in ["light", "dark"]:
        for w in [1280, 380]:
            pg.set_viewport_size({"width": w, "height": 900})
            pg.evaluate(f"document.documentElement.setAttribute('data-theme','{theme}')")
            pg.wait_for_timeout(300)
            pg.screenshot(path=f"{OUT}/tb-{theme}-{w}.png", clip=dict(tb.bounding_box(), x=0, width=w) if False else None, full_page=False) if False else None
            tb.screenshot(path=f"{OUT}/tb-{theme}-{w}.png")
            rl.screenshot(path=f"{OUT}/rl-{theme}-{w}.png")
            sw = pg.evaluate("document.documentElement.scrollWidth")
            print(theme, w, "scrollWidth", sw)
    b.close()
print("ERRORS:", errs)
