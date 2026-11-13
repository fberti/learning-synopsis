import sys, subprocess, time, socket, os
from playwright.sync_api import sync_playwright
root = os.path.abspath("../..")
s = socket.socket(); s.bind(("", 0)); port = s.getsockname()[1]; s.close()
srv = subprocess.Popen([sys.executable, "-m", "http.server", str(port)], cwd=root, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(0.8)

try:
  with sync_playwright() as p:
    b = p.chromium.launch()
    for theme, width in (("light", 1100), ("dark", 390)):
      ctx = b.new_context(viewport={"width": width, "height": 900}); ctx.add_init_script(f"localStorage.setItem('synopsis:theme','{theme}')")
      pg = ctx.new_page(); errs=[]
      pg.on("pageerror", lambda e: errs.append(str(e))); pg.on("console", lambda m: errs.append(m.text) if m.type=="error" and "404" not in m.text else None)
      pg.goto(f"http://localhost:{port}/grafelmelet-halozattudomany/07-halozatmodellek/"); pg.wait_for_timeout(3000)
      W = pg.locator('.widget[data-widget="stub-matching"]'); W.scroll_into_view_if_needed()
      W.get_by_role("button", name="Árvízhét", exact=True).first.click(); W.get_by_role("button", name="Párosítás", exact=True).click(); pg.wait_for_timeout(200)
      print(W.locator(".readout").nth(0).evaluate("e=>{const c=e.cloneNode(true);c.querySelectorAll('.katex-mathml').forEach(x=>x.remove());return c.textContent}"))
      W.screenshot(path=f"shots/w1-stub-a-{theme}.png")
      W.get_by_role("button", name="2000 párosítás", exact=True).click(); pg.wait_for_timeout(2500)
      print(W.locator(".readout").nth(1).evaluate("e=>{const c=e.cloneNode(true);c.querySelectorAll('.katex-mathml').forEach(x=>x.remove());return c.textContent}"))
      W.get_by_role("button", name="(2, 2)", exact=True).click(); W.get_by_role("button", name="2000 párosítás", exact=True).click(); pg.wait_for_timeout(1500); print(W.locator(".readout").nth(1).evaluate("e=>{const c=e.cloneNode(true);c.querySelectorAll('.katex-mathml').forEach(x=>x.remove());return c.textContent}"))
      W.get_by_role("button", name="(b) Élcsere", exact=True).click(); W.get_by_role("button", name="Egy csere", exact=True).click(); pg.wait_for_timeout(200)
      for t in range(4):
        W.get_by_role("button", name="Egy csere", exact=True).click(); pg.wait_for_timeout(100)
      print(W.locator(".readout").nth(2).evaluate("e=>{const c=e.cloneNode(true);c.querySelectorAll('.katex-mathml').forEach(x=>x.remove());return c.textContent}")); W.screenshot(path=f"shots/w1-stub-b-{theme}.png")
      N = pg.locator('.widget[data-widget="null-model-lab"]'); N.scroll_into_view_if_needed()
      def run(statname=None, nullname=None, wait=6000):
        if statname: N.get_by_role("button", name=statname, exact=True).click()
        if nullname: N.get_by_role("button", name=nullname, exact=True).click()
        N.get_by_role("button", name="1000 véletlen változat", exact=True).click(); pg.wait_for_timeout(wait)
        print("--", statname, nullname, "\n", N.locator(".readout").evaluate("e=>{const c=e.cloneNode(true);c.querySelectorAll('.katex-mathml').forEach(x=>x.remove());return c.textContent}"), "|", N.locator("p").last.evaluate("e=>{const c=e.cloneNode(true);c.querySelectorAll('.katex-mathml').forEach(x=>x.remove());return c.textContent}"))
      run()
      run(None, "hipergeometrikus (csak a két szereplő gyakorisága)", 300)
      run("háromszögek száma", "páros: cikk–szereplő csere")
      N.screenshot(path=f"shots/w1-null-{theme}.png")
      run(None, "fokszámtartó élcsere"); run(None, "G(n, m)")
      run("különböző párok (élek) száma", "páros: cikk–szereplő csere")
      print("errors", errs)
      ctx.close()
    b.close()
finally:
  subprocess.run(["fuser", "-k", f"{port}/tcp"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
