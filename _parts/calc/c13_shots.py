import sys, subprocess, time, os
from playwright.sync_api import sync_playwright
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT = os.path.join(ROOT, "_parts", "ch13", "shots")
os.makedirs(OUT, exist_ok=True)
srv = subprocess.Popen([sys.executable, "-m", "http.server", "8791"], cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1.5)
ids = sys.argv[1:] or ["s131-a", "s135-c", "s139-c", "s1311-b"]
try:
    with sync_playwright() as p:
        b = p.chromium.launch()
        for w, theme in ((380, "dark"), (1280, "light")):
            pg = b.new_page(viewport={"width": w, "height": 1100})
            pg.goto("http://localhost:8791/mesterseges-intelligencia/13-graf-neuralis-halok/", wait_until="networkidle")
            pg.evaluate(f"document.documentElement.setAttribute('data-theme','{theme}')")
            pg.wait_for_timeout(1500)
            ov = pg.evaluate("document.documentElement.scrollWidth - window.innerWidth")
            print(w, "horizontal overflow px:", ov)
            for i in ids:
                el = pg.locator(f"[id='{i}']")
                box = el.evaluate("e => { const s = e.closest('section') ; const r = e.getBoundingClientRect(); return [r.top + window.scrollY, s.getBoundingClientRect().bottom + window.scrollY]; }")
                pg.screenshot(path=f"{OUT}/{i}-{w}.png", full_page=True, clip={"x": 0, "y": box[0], "width": w, "height": min(1600, box[1]-box[0])})
            pg.close()
        b.close()
finally:
    srv.terminate()
