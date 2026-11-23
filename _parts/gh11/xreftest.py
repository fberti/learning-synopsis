import sys, subprocess, time, socket, os, glob
from playwright.sync_api import sync_playwright
root=os.path.abspath(".")
s=socket.socket(); s.bind(("",0)); port=s.getsockname()[1]; s.close()
srv=subprocess.Popen([sys.executable,"-m","http.server",str(port)],cwd=root,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(0.8)
try:
  with sync_playwright() as p:
    b=p.chromium.launch(executable_path=sorted(glob.glob("/home/febert/.cache/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell"))[-1])
    pg=b.new_page(viewport={"width":1280,"height":900}); pg.goto(f"http://localhost:{port}/grafelmelet-halozattudomany/11-csucsbeagyazasok/"); pg.wait_for_timeout(2500)
    a=pg.locator('#s112 a.xref[href*="s27-a"]').first; a.scroll_into_view_if_needed(); a.click(); pg.wait_for_timeout(2000)
    print(pg.evaluate("()=>{const f=document.querySelector('iframe'); return f? f.src : 'no iframe'}"))
    q=pg.locator('[data-quiz="gh11-113"] summary').first; q.scroll_into_view_if_needed(); q.click(); pg.wait_for_timeout(600)
    pg.locator('[data-quiz="gh11-113"]').screenshot(path="_parts/gh11/shots/quiz113.png")
    b.close()
finally: subprocess.run(["fuser","-k",f"{port}/tcp"],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
