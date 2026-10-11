import sys, subprocess, time, os
from playwright.sync_api import sync_playwright
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
srv = subprocess.Popen([sys.executable, "-m", "http.server", "8792"], cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1.5)
try:
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(viewport={"width": 380, "height": 900})
        pg.goto("http://localhost:8792/mesterseges-intelligencia/13-graf-neuralis-halok/", wait_until="networkidle"); pg.wait_for_timeout(1500)
        r = pg.evaluate("""() => { const W = window.innerWidth; const out=[];
          document.querySelectorAll('main *').forEach(e => { const r = e.getBoundingClientRect();
            if (r.right > W + 1 && !e.closest('.tw') && !e.closest('pre') && !e.closest('.katex-display') && !e.closest('.katex-mathml')) {
              const par = e.parentElement; if (par && par.getBoundingClientRect().right > W + 1 && !['MAIN'].includes(par.tagName)) return;
              out.push([e.tagName, e.className, Math.round(r.right - W), (e.closest('section')||{}).id, e.textContent.slice(0,60)]); } });
          return out.slice(0, 20); }""")
        for x in r: print(x)
        b.close()
finally:
    srv.terminate()
