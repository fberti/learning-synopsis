import sys, subprocess, time, socket, os
from playwright.sync_api import sync_playwright
root = os.path.abspath("../..")
s = socket.socket(); s.bind(("", 0)); port = s.getsockname()[1]; s.close()
srv = subprocess.Popen([sys.executable, "-m", "http.server", str(port)], cwd=root, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(0.8)
try:
  with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": 390, "height": 900})
    pg.goto(f"http://localhost:{port}/grafelmelet-halozattudomany/07-halozatmodellek/"); pg.wait_for_timeout(4000)
    if len(sys.argv) > 1: pg.evaluate("document.querySelectorAll('details').forEach(d=>d.open=true)"); pg.wait_for_timeout(1500)
    print(pg.evaluate("document.documentElement.scrollWidth"))
    print(pg.evaluate("""() => { const out=[]; document.querySelectorAll('main *').forEach(e=>{const r=e.getBoundingClientRect(); if(r.right>392 && r.width>0){ let p=e.parentElement, ok=false; while(p){ const cs=getComputedStyle(p); if(cs.overflowX==='auto'||cs.overflowX==='scroll'||cs.overflowX==='hidden'){ok=true;break;} p=p.parentElement;} if(!ok) out.push(e.tagName+'.'+e.className+' '+Math.round(r.right)+' '+(e.textContent||'').slice(0,60)); }}); return out.slice(0,25); }"""))
    b.close()
finally:
  subprocess.run(["fuser", "-k", f"{port}/tcp"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
