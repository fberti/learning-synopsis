import sys, subprocess, time, socket, os
from playwright.sync_api import sync_playwright
root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
s = socket.socket(); s.bind(("", 0)); port = s.getsockname()[1]; s.close()
srv = subprocess.Popen([sys.executable, "-m", "http.server", str(port)], cwd=root, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(0.8)
try:
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(viewport={"width": 390, "height": 900})
        pg.goto(f"http://localhost:{port}/grafelmelet-halozattudomany/05-centralitas/"); pg.wait_for_timeout(3000)
        print(pg.evaluate("""() => [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > 391 && !e.closest('.tw') && !e.closest('pre') && !e.closest('.katex-display') && !e.closest('.katex')).slice(0,15).map(e => e.tagName+'.'+e.className+' '+Math.round(e.getBoundingClientRect().right)+' '+(e.textContent||'').slice(0,60))"""))
        print(pg.evaluate("() => { const e=[...document.querySelectorAll('body span')].find(x => x.textContent==='+++++++++' && x.getBoundingClientRect().right>391); if(!e) return null; let a=e, out=[]; for(let i=0;i<6&&a;i++){out.push(a.tagName+'.'+a.className+' w='+Math.round(a.getBoundingClientRect().width)+' r='+Math.round(a.getBoundingClientRect().right)); a=a.parentElement;} return out; }"))
        print(pg.evaluate("document.documentElement.scrollWidth"), pg.evaluate("() => [...document.querySelectorAll('.katex')].filter(e => e.getBoundingClientRect().right > 391).map(e => e.parentElement.outerHTML.slice(0,300))"))
        print(pg.evaluate("() => [...document.querySelectorAll('.katex')].filter(e => e.getBoundingClientRect().right > 391 && !e.closest('.tw')).map(e => Math.round(e.getBoundingClientRect().right)+' '+(e.closest('details,div.box,p,li')||{}).className+' '+e.textContent.slice(0,40))"))
        b.close()
finally:
    subprocess.run(["fuser", "-k", f"{port}/tcp"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
