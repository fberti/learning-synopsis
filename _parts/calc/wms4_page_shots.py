import sys, subprocess, time, socket, os
from playwright.sync_api import sync_playwright
root=os.getcwd(); s=socket.socket(); s.bind(("",0)); port=s.getsockname()[1]; s.close()
srv=subprocess.Popen([sys.executable,"-m","http.server",str(port)],cwd=root,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(.8)
try:
  with sync_playwright() as p:
    b=p.chromium.launch()
    for theme,wd in (("light",1100),("dark",390)):
      c=b.new_context(viewport={"width":wd,"height":900}); c.add_init_script(f"localStorage.setItem('synopsis:theme','{theme}')")
      pg=c.new_page(); pg.goto(f"http://localhost:{port}/matematikai-statisztika/04-viszonyszamok-indexek/"); pg.wait_for_timeout(3000)
      for n in ["pct-lab","weighted-ratio","real-wage","age-std"]:
        el=pg.locator(f'[data-widget="{n}"]'); el.scroll_into_view_if_needed(); pg.wait_for_timeout(300); el.screenshot(path=f"_parts/ms4/shots/pg-{n}-{theme}.png")
      q=pg.locator('[data-quiz="ms4-44"]'); q.scroll_into_view_if_needed(); q.locator("summary").first.click(); pg.wait_for_timeout(500)
      q.screenshot(path=f"_parts/ms4/shots/pg-quiz44-{theme}.png")
      c.close()
    b.close()
finally: srv.terminate()
