import sys, subprocess, time, socket, os, glob
from playwright.sync_api import sync_playwright
root = os.path.abspath("../..")
s = socket.socket(); s.bind(("", 0)); port = s.getsockname()[1]; s.close()
srv = subprocess.Popen([sys.executable, "-m", "http.server", str(port)], cwd=root, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(0.8)
try:
  with sync_playwright() as p:
    b = p.chromium.launch(executable_path=sorted(glob.glob("/home/febert/.cache/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell"))[-1]); pg = b.new_page(viewport={"width": 1100, "height": 900})
    pg.goto(f"http://localhost:{port}/grafelmelet-halozattudomany/09-terjedes/"); pg.wait_for_timeout(3000)
    for i,sel in enumerate(sys.argv[1:]):
        pg.locator(sel).first.screenshot(path=f"shots/fig-{i}.png")
    b.close()
finally:
  subprocess.run(["fuser", "-k", f"{port}/tcp"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
