import sys, subprocess, time, socket, os
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),"..",".."))
s=socket.socket(); s.bind(("",0)); port=s.getsockname()[1]; s.close()
subprocess.Popen([sys.executable,"-m","http.server",str(port)],cwd=root,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(.8)
try:
  with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={"width":390,"height":900})
    pg.goto(f"http://localhost:{port}/{sys.argv[1]}"); pg.wait_for_timeout(3000)
    print('scrollWidth', pg.evaluate('document.documentElement.scrollWidth'))
    print(pg.evaluate("""() => { const clip = e => { for (let a = e.parentElement; a; a = a.parentElement) { const o = getComputedStyle(a); if (/(auto|hidden|scroll|clip)/.test(o.overflowX)) return true; } return false; };
      return [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > 392 && !clip(e)).map(e => e.tagName + '.' + e.className + ' #' + (e.closest('section')||{}).id + ' w=' + Math.round(e.getBoundingClientRect().right) + ' ' + (e.textContent||'').slice(0,40)).slice(0,10) }"""))
    print(pg.evaluate("""() => [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > 392 && !e.closest('.tw') && getComputedStyle(e).position!=='fixed')
      .map(e => e.tagName + '.' + e.className + ' #' + (e.closest('section')||{}).id + ' w=' + Math.round(e.getBoundingClientRect().right)).slice(0,15)"""))
    b.close()
finally: subprocess.run(["fuser","-k",f"{port}/tcp"],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
