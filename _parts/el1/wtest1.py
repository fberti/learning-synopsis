import sys, subprocess, time, socket, os
from playwright.sync_api import sync_playwright
root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
s = socket.socket(); s.bind(("", 0)); port = s.getsockname()[1]; s.close()
srv = subprocess.Popen([sys.executable, "-m", "http.server", str(port)], cwd=root, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(0.8)
page_path = sys.argv[1] if len(sys.argv) > 1 else "_parts/el1/wtest1.html"
try:
    with sync_playwright() as p:
        b = p.chromium.launch()
        for theme, width in (("light", 900), ("dark", 390)):
            ctx = b.new_context(viewport={"width": width, "height": 900}, device_scale_factor=1)
            ctx.add_init_script(f"localStorage.setItem('synopsis:theme','{theme}')")
            pg = ctx.new_page(); errs = []
            pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
            pg.on("pageerror", lambda e: errs.append(str(e)))
            pg.goto(f"http://localhost:{port}/{page_path}"); pg.wait_for_timeout(2500)
            if page_path.endswith("wtest1.html"):
                # interakciók
                pg.click("#w-atom button:has-text('Cu')"); pg.click("#w-atom button:has-text('− elektron')"); pg.click("#w-atom button:has-text('− elektron')")
                print(theme, "atom:", pg.inner_text("#w-atom .readout"))
                pg.click("#w-coul button:has-text('duplázása') >> nth=0"); pg.wait_for_timeout(200)
                print(theme, "coulomb:", pg.inner_text("#w-coul .readout").replace("\n"," ")[:300])
                cvs = pg.query_selector("#w-field canvas"); bb = cvs.bounding_box()
                pg.mouse.move(bb["x"] + bb["width"]/2, bb["y"] + bb["height"]/2); pg.wait_for_timeout(200)
                print(theme, "field mid:", pg.inner_text("#w-field .readout"))
                pg.click("#w-field button:has-text('Próbatöltés')"); pg.wait_for_timeout(1500)
                pg.fill("#w-log textarea >> nth=0", "100"); pg.fill("#w-log textarea >> nth=1", "93")
                print(theme, "log:", pg.inner_text("#w-log table").replace("\n"," | "))
                for sel in ("#w-atom", "#w-coul", "#w-pics", "#w-field", "#w-ci"):
                    pg.locator(sel).screenshot(path=f"{root}/_parts/el1/shots/w1-{sel[3:]}-{theme}.png")
                pg.click("#w-ci button:has-text('szigetelő')"); pg.wait_for_timeout(300)
                pg.locator("#w-ci").screenshot(path=f"{root}/_parts/el1/shots/w1-ci-ins-{theme}.png")
            else:
                pg.screenshot(path=f"{root}/_parts/el1/shots/page-{theme}.png", full_page=False)
            print(theme, "errors:", errs)
            ctx.close()
        b.close()
finally:
    subprocess.run(["fuser", "-k", f"{port}/tcp"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
