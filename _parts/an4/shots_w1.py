import sys, subprocess, time, socket, os
from playwright.sync_api import sync_playwright
root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
s = socket.socket(); s.bind(("", 0)); port = s.getsockname()[1]; s.close()
srv = subprocess.Popen([sys.executable, "-m", "http.server", str(port)], cwd=root, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(0.8)
try:
    with sync_playwright() as p:
        b = p.chromium.launch()
        for theme, width in (("light", 1280), ("dark", 390)):
            ctx = b.new_context(viewport={"width": width, "height": 900})
            ctx.add_init_script(f"localStorage.setItem('synopsis:theme','{theme}')")
            pg = ctx.new_page(); errs = []
            pg.on("console", lambda m: errs.append(m.text) if m.type in ("error", "warning") else None)
            pg.on("pageerror", lambda e: errs.append(str(e)))
            pg.goto(f"http://localhost:{port}/_parts/an4/wtest1.html"); pg.wait_for_timeout(2500)
            print(theme, "errors:", errs)
            print("st stats:", pg.locator("#w-st .stat-row").inner_text().replace("\n"," | "))
            # k slider to 3
            pg.evaluate("""() => { const r = document.querySelector('#w-st input[type=range]'); r.value = 3; r.dispatchEvent(new Event('input')); }""")
            print("st k=3:", pg.locator("#w-st .stat-row").inner_text().replace("\n"," | "))
            pg.locator("#w-dn button", has_text="nem deriválható").first.click()
            print("dn:", pg.locator("#w-dn .readout").inner_text()[:120])
            print("la:", pg.locator("#w-la .stat-row").inner_text().replace("\n"," | "))
            print("mc:", pg.locator("#w-mc .stat-row").inner_text().replace("\n"," | "))
            sw = pg.evaluate("document.documentElement.scrollWidth"); print("scrollWidth", sw)
            for wid in ["w-st","w-dn","w-la","w-mc"]:
                pg.locator("#"+wid).screenshot(path=f"shots/{wid}-{theme}.png")
            # |x| preset
            pg.locator("#w-st button", has_text="|x|").click(); pg.wait_for_timeout(200)
            print("st |x| note:", pg.locator("#w-st p.w-sub").last.inner_text()[:150])
            ctx.close()
        b.close()
finally:
    srv.terminate()
