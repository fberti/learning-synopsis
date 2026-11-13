import sys, subprocess, time, socket, os
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),"..",".."))
s=socket.socket(); s.bind(("",0)); port=s.getsockname()[1]; s.close()
srv=subprocess.Popen([sys.executable,"-m","http.server",str(port)],cwd=root,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(.8)
try:
  with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={"width":390,"height":900}); errs=[]
    pg.on("console",lambda m: errs.append(m.text) if m.type in("error","warning") else None)
    pg.goto(f"http://localhost:{port}/mesterseges-intelligencia/14-generativ-modellek/"); pg.wait_for_timeout(3000)
    pg.evaluate("document.querySelectorAll('details').forEach(d=>d.open=true)"); pg.wait_for_timeout(2500)
    print("katex errors", pg.evaluate("[...document.querySelectorAll('.katex-error')].map(e=>e.title).slice(0,10)"))
    print("scrollWidth", pg.evaluate("document.documentElement.scrollWidth"))
    print("questions", pg.evaluate("document.querySelectorAll('.quiz .q-card, .quiz .question, .quiz [data-q]').length"))
    print("console", errs[:10]); b.close()
finally: srv.terminate()
