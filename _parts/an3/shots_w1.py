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
            pg.goto(f"http://localhost:{port}/analizis/03-hatarertek-es-folytonossag/"); pg.wait_for_timeout(3000)
            print(theme, "errors:", errs[:10])
            for name in ["limit-zoom", "epsilon-delta", "sinx-over-x"]:
                el = pg.locator(f'.widget[data-widget="{name}"]')
                el.scroll_into_view_if_needed(); pg.wait_for_timeout(300)
                el.screenshot(path=f"shots/{name}-{theme}.png")
            if theme == "light":
                ed = pg.locator('.widget[data-widget="epsilon-delta"]')
                for idx in (0, 1):
                    ed.locator(".controls button").nth(idx).click(); pg.wait_for_timeout(200)
                    ed.get_by_role("button", name="Legnagyobb jó δ").click(); pg.wait_for_timeout(300)
                    print("ed", idx, ed.locator(".stat-row").inner_text().replace("\n", " | "), ed.locator("p.w-sub").last.inner_text())
                ed.locator(".controls button").nth(4).click(); pg.wait_for_timeout(300)
                print("sgn:", ed.locator("p.w-sub").last.inner_text())
                ed.screenshot(path="shots/epsilon-delta-sgn.png")
                lz = pg.locator('.widget[data-widget="limit-zoom"]')
                for idx in (1, 4, 6):
                    lz.locator(".controls button").nth(idx).click(); pg.wait_for_timeout(300)
                    print("lz", idx, lz.locator("p.w-sub").first.inner_text()[:160])
                lz.screenshot(path="shots/limit-zoom-g.png")
            ctx.close()
        b.close()
finally:
    srv.kill()
