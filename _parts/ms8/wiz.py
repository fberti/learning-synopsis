import subprocess,sys,time,socket
from playwright.sync_api import sync_playwright
s=socket.socket();s.bind(("",0));port=s.getsockname()[1];s.close()
srv=subprocess.Popen([sys.executable,"-m","http.server",str(port)],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(.8)
try:
  with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page();pg.goto(f"http://localhost:{port}/matematikai-statisztika/08-parameteres-probak/");pg.wait_for_timeout(2500)
    w=pg.locator('.widget[data-widget="test-wizard"]')
    for t in ["mért érték","az átlagra","két mérés ugyanazon","nem"]:
      w.get_by_role("button",name=t).first.click();pg.wait_for_timeout(200)
    print(w.inner_text()[-300:])
    print("quiz questions:",pg.evaluate("Object.keys(window).length"))
    q=pg.locator('.quiz[data-quiz="ms8-final"] summary').first; q.click();pg.wait_for_timeout(300)
    print(pg.locator('.quiz[data-quiz="ms8-final"]').inner_text()[:300])
    b.close()
finally: srv.kill()
