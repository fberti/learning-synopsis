"""Böngészős ellenőrzés (10. fejezet, w1 widgetek).
Használat: uv run --with playwright python -I bc10w1.py <port> <kimeneti mappa>"""
import sys, json
from playwright.sync_api import sync_playwright
port, out = sys.argv[1], sys.argv[2]
MINE = ["loss-compare", "batch-size-noise", "backprop-stepper", "compute-graph"]
URL = f"http://localhost:{port}/_parts/ch10/wtest.html"


def txt(pg, name, sel=".readout"):
    return pg.eval_on_selector(f'.widget[data-widget="{name}"] {sel}', "e => e.innerText")


def click(pg, name, text):
    w = pg.query_selector(f'.widget[data-widget="{name}"]')
    w.query_selector(f'button:has-text("{text}")').click()
    pg.wait_for_timeout(60)


with sync_playwright() as p:
    b = p.chromium.launch()
    for width in (1280, 400):
        pg = b.new_page(viewport={"width": width, "height": 900})
        errs = []
        pg.on("console", lambda m: m.type in ("error", "warning") and errs.append(f"{m.type}: {m.text}"))
        pg.on("pageerror", lambda e: errs.append(f"pageerror: {e}"))
        pg.goto(URL, wait_until="networkidle")
        pg.wait_for_timeout(1500)
        info = pg.evaluate("""(mine) => mine.map(n => { const w = document.querySelector(`.widget[data-widget="${n}"]`);
            return { n, canvases: w.querySelectorAll('canvas').length, cw: [...w.querySelectorAll('canvas')].map(c => c.clientWidth),
                     ww: w.clientWidth, sw: w.scrollWidth, err: /Hiba/.test(w.innerText) }; })""", MINE)
        print(f"=== width {width}")
        print(json.dumps(info, ensure_ascii=False))
        if width == 1280:
            # loss-compare
            print("LC z=-4:", txt(pg, "loss-compare"))
            click(pg, "loss-compare", "bizonytalan"); print("LC z=0:", txt(pg, "loss-compare"))
            click(pg, "loss-compare", "jól dönt"); print("LC z=2:", txt(pg, "loss-compare"))
            click(pg, "loss-compare", "magabiztosan");
            # batch
            print("BS:", txt(pg, "batch-size-noise"))
            for B in ("200 (teljes)", "1"):
                pg.query_selector('.widget[data-widget="batch-size-noise"]').query_selector(f'button.btn >> text="{B}"').click()
                click(pg, "batch-size-noise", "Tanítás")
            pg.query_selector('.widget[data-widget="batch-size-noise"]').query_selector('button.btn >> text="16"').click()
            click(pg, "batch-size-noise", "Tanítás")
            print("BS runs:", txt(pg, "batch-size-noise").split("\n")[-1])
            # backprop
            n = "backprop-stepper"
            click(pg, n, "1. Előre"); print("BP fwd:", txt(pg, n))
            for k in range(3):
                click(pg, n, "2. Vissza"); print(f"BP back {k+1}:", txt(pg, n))
            click(pg, n, "3. Frissítés"); print("BP upd:", txt(pg, n)); print(txt(pg, n, "table"))
            pg.query_selector(f'.widget[data-widget="{n}"]').screenshot(path=f"{out}/w1-bp-upd.png")
            click(pg, n, "1. Előre"); print("BP fwd2:", txt(pg, n))
            for _ in range(3): click(pg, n, "Teljes lépés")
            print("BP hist:", txt(pg, n).split("\n")[-1])
            click(pg, n, "Újrakezdés"); click(pg, n, "η = 0,5"); click(pg, n, "Teljes lépés"); click(pg, n, "Teljes lépés")
            print("BP eta .5:", txt(pg, n))
            click(pg, n, "2. Vissza"); click(pg, n, "2. Vissza"); print("BP eta .5 back2:", txt(pg, n))
            pg.query_selector(f'.widget[data-widget="{n}"]').screenshot(path=f"{out}/w1-bp-eta05.png")
            click(pg, n, "Újrakezdés"); click(pg, n, "η = 0,1"); click(pg, n, "1. Előre"); click(pg, n, "2. Vissza"); click(pg, n, "2. Vissza")
            # compute graph
            n = "compute-graph"
            for key in ("(a)", "(b)", "(c)", "(d)"):
                click(pg, n, key)
                click(pg, n, "Előre lépés"); f1 = txt(pg, n)
                click(pg, n, "Mind"); print(f"CG {key}: first fwd: {f1}\n   all: {txt(pg, n)}")
                pg.query_selector(f'.widget[data-widget="{n}"]').screenshot(path=f"{out}/w1-cg-{key[1]}.png")
            click(pg, n, "(b)")
            for k in range(2): click(pg, n, "Előre lépés")
            for k in range(3):
                click(pg, n, "Vissza lépés"); print(f"CG b back {k+1}:", txt(pg, n))
            click(pg, n, "(a)"); click(pg, n, "Előre lépés"); click(pg, n, "Előre lépés"); click(pg, n, "Vissza lépés"); click(pg, n, "Vissza lépés")
        print("console:", *errs[:30], sep="\n  ")
        for theme in ("light", "dark"):
            pg.evaluate(f"document.documentElement.setAttribute('data-theme','{theme}')")
            pg.wait_for_timeout(300)
            for name in MINE:
                w = pg.query_selector(f'.widget[data-widget="{name}"]')
                w.scroll_into_view_if_needed(); pg.wait_for_timeout(100)
                w.screenshot(path=f"{out}/w1-{name}-{theme}-{width}.png")
        pg.close()
    b.close()
