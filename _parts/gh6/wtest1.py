import sys, subprocess, time, socket, os
from playwright.sync_api import sync_playwright
root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
s = socket.socket(); s.bind(("", 0)); port = s.getsockname()[1]; s.close()
srv = subprocess.Popen([sys.executable, "-m", "http.server", str(port)], cwd=root, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(0.8)
def clicknode(pg, w, label):
    xy = pg.evaluate("""([w, l]) => { const r=document.querySelector(`[data-widget=${w}]`), v=r._view, i=v.nodes.findIndex(n=>String(n.label)===l); const b=v.c.getBoundingClientRect(); return [b.left+v.nodes[i].x*v.w, b.top+v.nodes[i].y*v.h]; }""", [w, label])
    pg.mouse.click(*xy); pg.wait_for_timeout(250)
def clickedge(pg, w, a, b):
    xy = pg.evaluate("""([w, a, b]) => { const r=document.querySelector(`[data-widget=${w}]`), v=r._view, i=v.nodes.findIndex(n=>String(n.label)===a), j=v.nodes.findIndex(n=>String(n.label)===b); const bb=v.c.getBoundingClientRect(); return [bb.left+(v.nodes[i].x*.6+v.nodes[j].x*.4)*v.w, bb.top+(v.nodes[i].y*.6+v.nodes[j].y*.4)*v.h]; }""", [w, a, b])
    pg.mouse.click(*xy); pg.wait_for_timeout(250)
def ro(pg, w, k=0):
    return pg.evaluate("([w,k]) => [...document.querySelector(`[data-widget=${w}]`).querySelectorAll('.readout')].map(r=>r.innerText.replace(/\\s+/g,' '))", [w, k])
def btnc(pg, w, text):
    loc = pg.locator(f"[data-widget={w}]").get_by_role("button", name=text, exact=True)
    (loc if loc.count() else pg.locator(f"[data-widget={w}] button", has_text=text)).first.click(); pg.wait_for_timeout(250)
try:
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(viewport={"width": 1280, "height": 900}); errs=[]
        pg.on("pageerror", lambda e: errs.append(str(e))); pg.on("console", lambda m: errs.append(m.text) if m.type=="error" else None)
        pg.goto(f"http://localhost:{port}/grafelmelet-halozattudomany/06-helyi-szerkezet/"); pg.wait_for_timeout(3000)
        W="triangle-counter"; pg.locator(f"[data-widget={W}]").scroll_into_view_if_needed()
        print("TC0", ro(pg,W)); clicknode(pg,W,"Ko"); print("TC Ko", ro(pg,W)); clicknode(pg,W,"Po"); print("TC Po", ro(pg,W))
        pg.locator(f"[data-widget={W}]").screenshot(path=f"{root}/_parts/gh6/shots/w1-tc-ko.png")
        for k in ["csokornyakkendő","karateklub","két háromszög + híd"]:
            btnc(pg,W,k); print("TC",k, ro(pg,W)[1])
        btnc(pg,W,"szerkesztés"); clicknode(pg,W,"1"); clicknode(pg,W,"5"); print("TC edit +1-5", ro(pg,W)[1])
        W="homophily-slider"; pg.locator(f"[data-widget={W}]").scroll_into_view_if_needed()
        print("HS rand", ro(pg,W)); btnc(pg,W,"semleges"); print("HS neutral", ro(pg,W)); btnc(pg,W,"nagy + kicsi"); print("HS big-small", ro(pg,W))
        btnc(pg,W,"kis gráfok"); print("HS ladder", ro(pg,W))
        for l in ["2","4"]: clicknode(pg,W,l)
        print("HS ladder {1,3,4}?", ro(pg,W))
        pg.locator(f"[data-widget={W}]").screenshot(path=f"{root}/_parts/gh6/shots/w1-hs-ladder.png")
        btnc(pg,W,"Árvízhét"); print("HS arviz", ro(pg,W)); btnc(pg,W,"karateklub"); print("HS karate", ro(pg,W)); btnc(pg,W,"két háromszög"); print("HS twoTri", ro(pg,W))
        W="balance-game"; pg.locator(f"[data-widget={W}]").scroll_into_view_if_needed()
        print("BG0", ro(pg,W)); clicknode(pg,W,"Sz"); print("BG Sz->1", ro(pg,W))
        pg.locator(f"[data-widget={W}]").screenshot(path=f"{root}/_parts/gh6/shots/w1-bg-sz.png")
        btnc(pg,W,"előjelváltás"); clickedge(pg,W,"Sz","Ko"); print("BG flip SzKo", ro(pg,W))
        for k in ["K₄: két tábor","K₄: egy feszült él","öt szereplő","kör egy mínusszal"]:
            btnc(pg,W,k); btnc(pg,W,"👥 tábor"); btnc(pg,W,"legjobb beosztás"); print("BG",k, ro(pg,W))
        btnc(pg,W,"öt szereplő"); btnc(pg,W,"👥 tábor")
        for l in ["C","D"]: clicknode(pg,W,l)
        print("BG s5 manual", ro(pg,W)[1])
        print("errors", errs)
        b.close()
finally:
    subprocess.run(["fuser", "-k", f"{port}/tcp"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
