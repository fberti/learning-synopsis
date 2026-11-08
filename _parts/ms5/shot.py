import sys, subprocess, time, socket, os
from playwright.sync_api import sync_playwright
root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
s = socket.socket(); s.bind(("", 0)); port = s.getsockname()[1]; s.close()
srv = subprocess.Popen([sys.executable, "-m", "http.server", str(port)], cwd=root, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(0.8)
try:
    with sync_playwright() as p:
        b = p.chromium.launch()
        for theme, width in (("light", 1100), ("dark", 390)):
            ctx = b.new_context(viewport={"width": width, "height": 900})
            ctx.add_init_script(f"localStorage.setItem('synopsis:theme','{theme}')")
            pg = ctx.new_page(); errs=[]
            pg.on("console", lambda m: errs.append(m.text) if m.type in ("error",) else None)
            pg.on("pageerror", lambda e: errs.append(str(e)))
            pg.goto(f"http://localhost:{port}/matematikai-statisztika/05-mintaveteli-eloszlasok/"); pg.wait_for_timeout(2500)
            for w in sys.argv[1:]:
                loc = pg.locator(f'.widget[data-widget="{w}"]').first
                loc.scroll_into_view_if_needed(); pg.wait_for_timeout(300)
                loc.screenshot(path=f"{root}/_parts/ms5/shots/{w}-{theme}.png")
            print(theme, errs[:5])
            ctx.close()
        b.close()
finally:
    srv.kill()
