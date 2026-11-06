import sys, subprocess, time, socket, os
from playwright.sync_api import sync_playwright
root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
s = socket.socket(); s.bind(("", 0)); port = s.getsockname()[1]; s.close()
srv = subprocess.Popen([sys.executable, "-m", "http.server", str(port)], cwd=root, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(0.8)
try:
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(viewport={"width": 1100, "height": 900}); errs=[]
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(f"http://localhost:{port}/analizis/02-szamsorozatok-es-sorok/"); pg.wait_for_timeout(3000)
        w = pg.locator('[data-widget="epsilon-band"]')
        w.get_by_text("nagyítás").click(); pg.wait_for_timeout(300); w.screenshot(path="shots/eps-zoom.png")
        w.get_by_text("(−1)ⁿ, jelölt: 1").click(); pg.wait_for_timeout(300); print(w.locator(".w-sub").last.inner_text())
        w.get_by_text("1/√n → 0").click(); w.get_by_text("ε = 0,001").click(); pg.wait_for_timeout(500); print(w.locator(".stat-row").inner_text().replace("\n"," | "))
        e = pg.locator('[data-widget="e-limit"]'); print(e.locator(".stat-row").inner_text().replace("\n"," | ")); e.screenshot(path="shots/elimit.png")
        c = pg.locator('[data-widget="cobweb"]'); c.get_by_text("3,9·x(1−x) – káosz").click(); pg.wait_for_timeout(300); print(c.locator(".stat-row").inner_text().replace("\n"," | "))
        c.get_by_text("1/(1+x)").click(); pg.wait_for_timeout(300); print(c.locator(".stat-row").inner_text().replace("\n"," | ")); c.screenshot(path="shots/cobweb-fib.png")
        q = pg.locator('[data-widget="sequence-plot"]'); q.get_by_text("√(2+a), a₁=0").click(); pg.wait_for_timeout(300); print(q.locator(".stat-row").inner_text().replace("\n"," | ")); q.screenshot(path="shots/seq-rec.png")
        print("errors", errs); b.close()
finally:
    srv.terminate()
