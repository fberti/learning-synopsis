import sys, subprocess, time, socket, os
from playwright.sync_api import sync_playwright
root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
s = socket.socket(); s.bind(("", 0)); port = s.getsockname()[1]; s.close()
srv = subprocess.Popen([sys.executable, "-m", "http.server", str(port)], cwd=root, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(0.8)
JS = """() => { const res=[]; for (const e of document.querySelectorAll('body *')) { const r=e.getBoundingClientRect(); if (r.right<=391 || r.width===0) continue;
  let a=e.parentElement, clipped=false; while(a && a!==document.body){ const st=getComputedStyle(a); if(st.overflowX!=='visible' || st.position==='fixed'){clipped=true;break;} a=a.parentElement; }
  if(getComputedStyle(e).position==='fixed') clipped=true;
  if(!clipped) res.push(e.tagName+'.'+e.className+' r='+Math.round(r.right)+' '+(e.textContent||'').slice(0,60)); } return res.slice(0,15); }"""
try:
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(viewport={"width": 390, "height": 900})
        pg.goto(f"http://localhost:{port}/grafelmelet-halozattudomany/{sys.argv[1]}/"); pg.wait_for_timeout(3500)
        print(pg.evaluate("document.documentElement.scrollWidth"))
        print(pg.evaluate("""() => { const out=[]; const secs=[...document.querySelectorAll('#s62 > *, #s62 .widget > *')]; for(const s of secs){ const d=s.style.display; s.style.display='none'; out.push((s.id||s.className||s.tagName)+':'+document.documentElement.scrollWidth); s.style.display=d; } return out; }"""))
        b.close()
finally:
    subprocess.run(["fuser", "-k", f"{port}/tcp"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
