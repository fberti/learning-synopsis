# Playwright-teszt az an4 w2.js widgetjeihez: uv run --with playwright python -I wan4_w2_test.py
import sys, subprocess, time, socket, os, json
from playwright.sync_api import sync_playwright
root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
shots = os.path.join(root, "_parts", "an4", "shots2")
s = socket.socket(); s.bind(("", 0)); port = s.getsockname()[1]; s.close()
srv = subprocess.Popen([sys.executable, "-m", "http.server", str(port)], cwd=root, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(0.8)
URL = f"http://localhost:{port}/_parts/an4/wtest2.html"
def J(pg, js): return pg.evaluate(js)
try:
    with sync_playwright() as p:
        b = p.chromium.launch()
        for theme in ("light", "dark"):
            for width in (1280, 380):
                ctx = b.new_context(viewport={"width": width, "height": 900}, has_touch=(width == 380))
                ctx.add_init_script(f"localStorage.setItem('synopsis:theme','{theme}')")
                pg = ctx.new_page(); errs = []
                pg.on("console", lambda m: errs.append(m.text) if m.type in ("error", "warning") else None)
                pg.on("pageerror", lambda e: errs.append(str(e)))
                pg.goto(URL); pg.wait_for_timeout(2500)
                print(theme, width, "errors:", errs[:10])
                # minden widgetben van canvas / tartalom
                print(" canvases:", J(pg, "[...document.querySelectorAll('.widget')].map(w=>w.id+':'+w.querySelectorAll('canvas').length)"))
                print(" hscroll:", J(pg, "document.documentElement.scrollWidth > document.documentElement.clientWidth"))
                if theme == "light" and width == 1280:
                    # ---- derivative-sketcher
                    print(" ds hover:", [J(pg, f"document.getElementById('w-ds')._w2ds.hoverAt({x})") for x in (0, 1, -1, 2)] if J(pg, "document.getElementById('w-ds')._w2ds.toggleHelp(), 1") else "")
                    J(pg, "document.getElementById('w-ds')._w2ds.toggleHelp()")
                    for preset in (1, 0, 2, 3, 4, 5):
                        J(pg, f"document.getElementById('w-ds')._w2ds.setPre({preset})")
                        P = J(pg, f"(()=>{{const d=document.getElementById('w-ds')._w2ds; const P=d.PRE[{preset}]; const pts=[]; for(let k=0;k<=600;k++){{const x=P.a+(P.b-P.a)*k/600; const y=P.d(x); pts.push(d.toPx(x, Number.isFinite(y)?y:P.d(x+1e-6)));}} return pts;}})()")
                        pg.mouse.move(*P[0]); pg.mouse.down()
                        for q in P[1:]: pg.mouse.move(*q)
                        pg.mouse.up()
                        J(pg, "document.getElementById('w-ds')._w2ds.check()")
                        print(" ds perfect", preset, J(pg, "(({score,cover})=>({score,cover}))(document.getElementById('w-ds')._w2ds.last)"))
                        if preset == 4:
                            pg.locator("#w-ds").screenshot(path=f"{shots}/ds-abs-checked.png")
                    # konstans 0 rajz x^3-3x-re
                    J(pg, "document.getElementById('w-ds')._w2ds.setPre(1)")
                    P = J(pg, "(()=>{const d=document.getElementById('w-ds')._w2ds; const P=d.PRE[1]; const pts=[]; for(let k=0;k<=300;k++){const x=P.a+(P.b-P.a)*k/300; pts.push(d.toPx(x,0));} return pts;})()")
                    pg.mouse.move(*P[0]); pg.mouse.down()
                    for q in P[1:]: pg.mouse.move(*q)
                    pg.mouse.up(); J(pg, "document.getElementById('w-ds')._w2ds.check()")
                    print(" ds zero:", J(pg, "document.getElementById('w-ds')._w2ds.last"))
                    pg.locator("#w-ds").screenshot(path=f"{shots}/ds-zero-checked.png")
                    # kevés rajz
                    J(pg, "document.getElementById('w-ds')._w2ds.clear()")
                    P = J(pg, "(()=>{const d=document.getElementById('w-ds')._w2ds; const pts=[]; for(let k=0;k<=50;k++){const x=-2.5+1.5*k/50; pts.push(d.toPx(x,3*x*x-3));} return pts;})()")
                    pg.mouse.move(*P[0]); pg.mouse.down()
                    for q in P[1:]: pg.mouse.move(*q)
                    pg.mouse.up(); J(pg, "document.getElementById('w-ds')._w2ds.check()")
                    print(" ds partial:", J(pg, "document.getElementById('w-ds')._w2ds.last.text"))
                    # help screenshot
                    J(pg, "document.getElementById('w-ds')._w2ds.toggleHelp()"); J(pg, "document.getElementById('w-ds')._w2ds.hoverAt(1.6)")
                    pg.locator("#w-ds").screenshot(path=f"{shots}/ds-help.png")
                    # ---- chain-rule-gears
                    for pre, x in ((1, 1), (2, 0), (3, 4), (0, -2.37), (0, 2)):
                        J(pg, f"document.getElementById('w-cg')._w2cg.setPre({pre})")
                        print(" cg", pre, x, J(pg, f"document.getElementById('w-cg')._w2cg.setX({x})"))
                        print("   stats:", pg.locator("#w-cg .stat-row").inner_text().replace("\n", " | "))
                    J(pg, "document.getElementById('w-cg')._w2cg.setPre(1)"); J(pg, "document.getElementById('w-cg')._w2cg.setX(-1.2)")
                    pg.locator("#w-cg").screenshot(path=f"{shots}/cg-neg.png")
                    J(pg, "document.getElementById('w-cg')._w2cg.setX(1)")
                    pg.locator("#w-cg").get_by_role("button", name="▶ Lejátszás").click(); pg.wait_for_timeout(1500)
                    print(" cg play x:", J(pg, "document.getElementById('w-cg')._w2cg.vals.x"))
                    pg.locator("#w-cg").get_by_role("button", name="⏸ Szünet").click()
                    J(pg, "document.getElementById('w-cg')._w2cg.setPre(4)")
                    pg.locator("#w-cg input[aria-label='f(u)']").fill("ln(u)"); pg.locator("#w-cg input[aria-label='g(x)']").fill("x^2+1")
                    print(" cg custom:", J(pg, "document.getElementById('w-cg')._w2cg.setX(2)"))
                    pg.locator("#w-cg input[aria-label='f(u)']").fill("ln(u")
                    print(" cg err:", pg.locator("#w-cg .readout").inner_text())
                    pg.locator("#w-cg").screenshot(path=f"{shots}/cg-custom-err.png")
                    # ---- derivative-machine
                    for src in J(pg, "document.getElementById('w-dm')._w2dm.PRE") + ["x^2 sin(x)", "2^x", "1/x", "x^(1/3)", "sin^2(x)", "ctg(x)", "lg(x)", "log2(x^2+1)", "-x^2", "3(x+1)^2", "0,5x^2", "e^(2x)", "x*x*x", "pi*x", "sqrt(x)/x", "cos(sin(tan(exp(ln(sqrt(x^2+1))))))", "(x+1)/(x-1)", "x^sin(x)", "7", "ln(-x^2-1)"]:
                        r = J(pg, f"(()=>{{const r=document.getElementById('w-dm')._w2dm.run({json.dumps(src)}); return {{rt:r.rt, ok:r.allOk, n:(r.steps||[]).length, rows:r.rows&&r.rows.map(q=>[q.x,q.s,q.n]), err:r.err, v2: r.df? [r.df(2), r.df(4)]:null}};}})()")
                        print(" dm", src, "=>", r)
                    for bad in ["sin(x", "x+", "2**x", "abs(x)", "y^2", ")x("]:
                        J(pg, f"document.getElementById('w-dm')._w2dm.run({json.dumps(bad)})")
                        print(" dm bad", bad, "=>", pg.locator("#w-dm .readout").first.inner_text())
                    J(pg, "document.getElementById('w-dm')._w2dm.run('e^(x*sin(x))')")
                    pg.locator("#w-dm details summary").click()
                    pg.locator("#w-dm").screenshot(path=f"{shots}/dm-steps.png")
                    pg.locator("#w-dm input").fill("ln(3x^2 + 2x - 6)"); pg.locator("#w-dm input").press("Enter")
                    print(" dm enter:", J(pg, "document.getElementById('w-dm')._w2dm.last.rt"))
                    J(pg, "document.getElementById('w-dm')._w2dm.run('cos(sin(tan(exp(ln(sqrt(x^2+1)))))) * x^x / (x+1)')")
                    print(" dm long steps:", len(pg.locator("#w-dm ol li").all()))
                    pg.locator("#w-dm").screenshot(path=f"{shots}/dm-long.png")
                    # ---- motion-graphs
                    for pre, t in ((0, 1), (0, 2), (1, 2), (1, 5), (2, 1.5), (2, 4.5), (3, 2), (3, 1), (3, 3), (3, 0.5), (3, 1.5)):
                        J(pg, f"document.getElementById('w-mg')._w2mg.setPre({pre})")
                        v = J(pg, f"document.getElementById('w-mg')._w2mg.setT({t})")
                        print(" mg", pre, t, {k: (round(x, 6) if isinstance(x, float) else x) for k, x in v.items()})
                        print("   stats:", pg.locator("#w-mg .stat-row").inner_text().replace("\n", " | "))
                    J(pg, "document.getElementById('w-mg')._w2mg.setPre(1)"); J(pg, "document.getElementById('w-mg')._w2mg.setT(0)")
                    pg.locator("#w-mg").get_by_role("button", name="▶ Lejátszás").click(); pg.wait_for_timeout(1200)
                    print(" mg play t:", J(pg, "document.getElementById('w-mg')._w2mg.vals.t"))
                    pg.locator("#w-mg").get_by_role("button", name="⏸ Szünet").click()
                    # kattintás a v-panelre
                    c = pg.locator("#w-mg canvas").nth(2); c.scroll_into_view_if_needed(); pg.wait_for_timeout(100); bb = c.bounding_box()
                    pg.mouse.click(bb["x"] + bb["width"] * 0.5, bb["y"] + bb["height"] * 0.5)
                    print(" mg click t:", J(pg, "document.getElementById('w-mg')._w2mg.vals.t"))
                    J(pg, "document.getElementById('w-mg')._w2mg.setPre(2)"); J(pg, "document.getElementById('w-mg')._w2mg.setT(4.2)")
                    pg.locator("#w-mg").screenshot(path=f"{shots}/mg-osc.png")
                    J(pg, "document.getElementById('w-mg')._w2mg.setPre(4)")
                    pg.locator("#w-mg input[aria-label='s(t)']").fill("sqrt(t)"); pg.locator("#w-mg input[aria-label='t max']").fill("4")
                    print(" mg custom:", J(pg, "document.getElementById('w-mg')._w2mg.setT(1)"))
                    pg.locator("#w-mg input[aria-label='t max']").fill("-1")
                    print(" mg custom err:", pg.locator("#w-mg .readout").inner_text())
                    J(pg, "document.getElementById('w-mg')._w2mg.setPre(3)"); J(pg, "document.getElementById('w-mg')._w2mg.setT(1)")
                if width == 380:
                    # érintéses rajz a sketcherben
                    J(pg, "document.getElementById('w-ds')._w2ds.setPre(0)")
                    J(pg, "document.getElementById('w-ds')._w2ds.toggleHelp()"); J(pg, "document.getElementById('w-ds')._w2ds.hoverAt(-1)")
                    J(pg, "document.getElementById('w-mg')._w2mg.setPre(3)"); J(pg, "document.getElementById('w-mg')._w2mg.setT(1)")
                    J(pg, "document.getElementById('w-dm')._w2dm.run('x/(x^2 + 1)')")
                    pg.locator("#w-dm details summary").click()
                    J(pg, "document.getElementById('w-cg')._w2cg.setPre(3)"); J(pg, "document.getElementById('w-cg')._w2cg.setX(4)")
                for wid in ("ds", "cg", "dm", "mg"):
                    el = pg.locator(f"#w-{wid}"); el.scroll_into_view_if_needed(); pg.wait_for_timeout(150)
                    el.screenshot(path=f"{shots}/w-{wid}-{theme}-{width}.png")
                print(" final errors:", errs[:10])
                ctx.close()
        b.close()
finally:
    srv.kill()
