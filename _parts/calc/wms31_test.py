import sys, json
from playwright.sync_api import sync_playwright
PORT = sys.argv[1]
URL = f"http://127.0.0.1:{PORT}/_parts/ms3/wtest1.html"
OUT = "_parts/ms3/shots1/"
errs = []
def stats(page, wid):
    return page.eval_on_selector_all(f"#{wid} .stat", "els => els.map(e => e.querySelector('.l').innerText.replace(/\\s+/g,' ') + ' = ' + e.querySelector('.v').innerText)")
def ro(page, wid):
    return page.eval_on_selector_all(f"#{wid} .readout", "els => els.map(e => e.innerText)")
with sync_playwright() as p:
    b = p.chromium.launch()
    for theme in ["light", "dark"]:
        for W in [1280, 380]:
            ctx = b.new_context(viewport={"width": W, "height": 900}, device_scale_factor=1)
            pg = ctx.new_page()
            pg.on("console", lambda m: m.type in ("error", "warning") and errs.append(f"{theme}{W} console {m.type}: {m.text}"))
            pg.on("pageerror", lambda e: errs.append(f"{theme}{W} pageerror: {e}"))
            pg.add_init_script(f"localStorage.setItem('synopsis-theme','{theme}');")
            pg.goto(URL); pg.wait_for_timeout(1200)
            if theme == "dark": pg.evaluate("document.documentElement.setAttribute('data-theme','dark')"); pg.wait_for_timeout(300)
            tag = f"{theme}-{W}"
            for wid in ["w-sd", "w-gr", "w-an", "w-rp"]:
                pg.locator(f"#{wid}").screenshot(path=f"{OUT}{tag}-{wid}.png")
            # overflow check
            ov = pg.evaluate("[document.documentElement.scrollWidth, innerWidth]")
            print(tag, "scrollWidth/innerWidth", ov)
            if theme == "light" and W == 1280:
                print("SD init", stats(pg, "w-sd")); print(ro(pg, "w-sd"))
                pg.click("#w-sd button:has-text('perc')"); print("SD perc", stats(pg, "w-sd"))
                pg.click("#w-sd button:has-text('óra')")
                pg.click("#w-sd button:has-text('kiugró')"); print("SD outlier", stats(pg, "w-sd"))
                pg.locator("#w-sd").screenshot(path=f"{OUT}{tag}-w-sd-outlier.png")
                pg.click("#w-sd button:has-text('alaphelyzet')")
                # drag point 1 (1;52) to elsewhere: compute pixel via canvas
                cv = pg.locator("#w-sd canvas"); bb = cv.bounding_box()
                w = bb["width"]; H = bb["height"]
                X = lambda x: bb["x"] + 46 + x / 10 * (w - 14 - 46)
                Y = lambda y: bb["y"] + 18 + (100 - y) / 70 * (H - 38 - 18)
                pg.mouse.move(X(1), Y(52)); pg.mouse.down(); pg.mouse.move(X(2), Y(80), steps=5); pg.mouse.up()
                print("SD after drag", stats(pg, "w-sd"))
                pg.mouse.click(X(8), Y(40)); print("SD after add", stats(pg, "w-sd"))
                pg.locator("#w-sd").screenshot(path=f"{OUT}{tag}-w-sd-drag.png")
                pg.click("#w-sd button:has-text('utolsó')"); print("SD after pop", stats(pg, "w-sd")[0])
                # guess-r: play 5 rounds
                for i in range(5):
                    pg.locator("#w-gr input[type=range]").fill(str([0.5, -0.3, 0, 0.9, -0.85][i]))
                    pg.click("#w-gr button:has-text('Tippelek')")
                    if i == 0: pg.locator("#w-gr").screenshot(path=f"{OUT}{tag}-w-gr-reveal.png")
                    if i < 4: pg.click("#w-gr button:has-text('Új kör')")
                print("GR", ro(pg, "w-gr")); print("GR hist", stats(pg, "w-gr"))
                pg.locator("#w-gr").screenshot(path=f"{OUT}{tag}-w-gr-end.png")
                print("GR newkör disabled:", pg.locator("#w-gr button:has-text('Új kör')").is_disabled())
                pg.click("#w-gr button:has-text('Új sorozat')"); print("GR new", ro(pg, "w-gr"))
                # anscombe table
                print("AN table", pg.eval_on_selector("#w-an table", "t => t.innerText"))
                for k in ["I.", "II.", "III.", "IV."]:
                    pg.click(f"#w-an button:text-is('{k}')"); print("AN", k, ro(pg, "w-an")[0][:90])
                pg.locator("#w-an").screenshot(path=f"{OUT}{tag}-w-an-IV.png")
                pg.click("#w-an button:has-text('mind a négy')")
                # rank-vs-pearson
                for f in ["lin", "cub", "exp", "sqrt", "par", "step"]:
                    pg.select_option("#w-rp select", f); print("RP", f, stats(pg, "w-rp"))
                pg.select_option("#w-rp select", "exp"); pg.check("#w-rp input[type=checkbox]"); print("RP exp outlier", stats(pg, "w-rp"))
                pg.locator("#w-rp input[type=range]").fill("15"); print("RP exp outlier noise15", stats(pg, "w-rp"))
                pg.click("#w-rp button:has-text('új zaj')"); print("RP new noise", stats(pg, "w-rp"))
                pg.locator("#w-rp").screenshot(path=f"{OUT}{tag}-w-rp-outlier.png")
            if theme == "dark" and W == 380:
                pg.click("#w-an button:text-is('III.')"); pg.locator("#w-an").screenshot(path=f"{OUT}{tag}-w-an-III.png")
                # touch-ish drag via pointer on mobile
                pg.click("#w-sd button:has-text('perc')"); pg.locator("#w-sd").screenshot(path=f"{OUT}{tag}-w-sd-perc.png")
            ctx.close()
    b.close()
print("ERRORS:", errs)
