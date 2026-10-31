import sys, subprocess, time, socket, os
from playwright.sync_api import sync_playwright
root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
s = socket.socket(); s.bind(("", 0)); port = s.getsockname()[1]; s.close()
subprocess.Popen([sys.executable, "-m", "http.server", str(port)], cwd=root, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(.8)
try:
    with sync_playwright() as p:
        b = p.chromium.launch()
        for theme, width in (("light", 900), ("dark", 390)):
            ctx = b.new_context(viewport={"width": width, "height": 900}); ctx.add_init_script(f"localStorage.setItem('synopsis:theme','{theme}')")
            pg = ctx.new_page(); errs = []
            pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None); pg.on("pageerror", lambda e: errs.append(str(e)))
            pg.goto(f"http://localhost:{port}/_parts/el0/wtest1.html"); pg.wait_for_timeout(2000)
            print(theme, "bb:", pg.inner_text("#w-bb .readout"))
            pg.click("#w-bb button:has-text('Két pont')")
            rects = pg.query_selector_all("#w-bb svg rect[style*=pointer]")
            # c12 és f12 indexei: a lyukak sorrendje: 4 sín × 25, majd sorok a..j × 30
            idx = lambda row, c: 100 + "abcdefghij".index(row) * 30 + (c - 1)
            rects[idx("e", 12)].click(); pg.query_selector_all("#w-bb svg rect[style*=pointer]")[idx("f", 12)].click()
            print(theme, "pair e12-f12:", pg.inner_text("#w-bb .readout"))
            pg.query_selector_all("#w-bb svg rect[style*=pointer]")[idx("a", 7)].click(); pg.query_selector_all("#w-bb svg rect[style*=pointer]")[idx("d", 7)].click()
            print(theme, "pair a7-d7:", pg.inner_text("#w-bb .readout"))
            for v, n, t in (("5,012", "", ""), ("987", "1000", "1"), ("226", "220", "5")):
                if v == "987": pg.click("#w-acc button:has-text('ellenállás')")
                pg.fill("#w-acc input >> nth=0", v); pg.fill("#w-acc input >> nth=1", n); pg.fill("#w-acc input >> nth=2", t); pg.wait_for_timeout(100)
                print(theme, "acc", v, ":", pg.inner_text("#w-acc .stat-row").replace("\n", " "), "|", pg.inner_text("#w-acc .readout").replace("\n", " "))
            for sel in ("#w-bb", "#w-acc"): pg.locator(sel).screenshot(path=f"{root}/_parts/el0/shots/w1-{sel[3:]}-{theme}.png")
            print(theme, "scrollWidth", pg.evaluate("document.documentElement.scrollWidth"), "errors:", errs)
            ctx.close()
        b.close()
finally:
    subprocess.run(["fuser", "-k", f"{port}/tcp"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
