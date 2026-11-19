import sys, subprocess, time, socket, os, glob
from playwright.sync_api import sync_playwright
root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
s = socket.socket(); s.bind(("", 0)); port = s.getsockname()[1]; s.close()
srv = subprocess.Popen([sys.executable, "-m", "http.server", str(port)], cwd=root, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(0.8)
try:
  with sync_playwright() as p:
    b = p.chromium.launch(executable_path=sorted(glob.glob("/home/febert/.cache/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell"))[-1])
    pg = b.new_page(viewport={"width": 1400, "height": 900})
    pg.goto(f"http://localhost:{port}/grafelmelet-halozattudomany/10-halozatok-osszehasonlitasa/"); pg.wait_for_timeout(2500)
    a = pg.locator('#s105 .box.example a.xref[href*="07-halozatmodellek/#s76-a"]').first
    a.scroll_into_view_if_needed(); a.click(); pg.wait_for_timeout(2500)
    print("url after click:", pg.url)
    fr = [f for f in pg.frames if "07-halozatmodellek" in f.url]
    print("frames:", [f.url for f in fr])
    if fr:
      f = fr[0]; print("target top:", f.evaluate("(()=>{const e=document.getElementById('s76-a'); return e? Math.round(e.getBoundingClientRect().top):null})()"))
    pg.screenshot(path=f"{root}/_parts/gh10/shots/xref.png")
    b.close()
finally:
  subprocess.run(["fuser", "-k", f"{port}/tcp"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
