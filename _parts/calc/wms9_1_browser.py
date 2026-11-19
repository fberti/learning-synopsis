# 9. fejezet w1 widgetek: böngészős számellenőrzés + képernyőképek (_parts/ms9/wtest1.html)
import sys, subprocess, time, socket, os
from playwright.sync_api import sync_playwright
root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
shots = f"{root}/_parts/ms9/shots1"
s = socket.socket(); s.bind(("", 0)); port = s.getsockname()[1]; s.close()
srv = subprocess.Popen([sys.executable, "-m", "http.server", str(port)], cwd=root, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
print("server pid", srv.pid); time.sleep(0.8)
URL = f"http://localhost:{port}/_parts/ms9/wtest1.html"
def stats(pg, wid):
    return pg.eval_on_selector(f"#{wid}", "r => [...r.querySelectorAll('.stat')].map(s => s.querySelector('.l').innerText.replace(/\\n/g,' ') + ': ' + s.querySelector('.v').innerText)")
def txt(pg, sel): return pg.eval_on_selector(sel, "e => e.innerText")
def click(pg, wid, label, idx=0):
    pg.locator(f"#{wid} button", has_text=label).nth(idx).click()
def idle(pg, wid):
    pg.wait_for_function(f"!document.querySelector('#{wid}').dataset.busy", timeout=60000)
try:
    with sync_playwright() as p:
        import glob
        try: b = p.chromium.launch()
        except Exception:  # a telepített Playwright-böngésző verziója eltérhet: a legújabb meglévő headless shell
            b = p.chromium.launch(executable_path=sorted(glob.glob(os.path.expanduser("~/.cache/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell")))[-1])
        mode = sys.argv[1] if len(sys.argv) > 1 else "all"
        if mode in ("all", "nums"):
            ctx = b.new_context(viewport={"width": 1280, "height": 900}); pg = ctx.new_page(); errs = []
            pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None); pg.on("pageerror", lambda e: errs.append(str(e)))
            pg.goto(URL); pg.wait_for_timeout(1500)
            print("== dice start", stats(pg, "w-cd"))
            for q, ns in (("szabályos", (60, 120)), ("cinkelt: 0,25", (60, 120, 300, 600))):
                click(pg, "w-cd", q)
                for n in ns:
                    pg.locator("#w-cd").get_by_role("button", name=str(n), exact=True).click()
                    click(pg, "w-cd", "Szimuláld 2000-szer"); idle(pg, "w-cd")
                    st = stats(pg, "w-cd"); print(f"== dice sim q={q} n={n}", st[-3:])
            # q = 0,30: csúszka idx 27
            pg.eval_on_selector("#w-cd input[type=range]", "e => { e.value = 27; e.dispatchEvent(new Event('input')); }")
            click(pg, "w-cd", "Mind a 4 n-re"); idle(pg, "w-cd")
            for n in (60, 120, 300, 600):
                pg.locator("#w-cd").get_by_role("button", name=str(n), exact=True).click(); print(f"== dice q=0,30 n={n}", stats(pg, "w-cd")[-2])
            pg.locator("#w-cd").get_by_role("button", name="300", exact=True).click()
            pg.locator("#w-cd").screenshot(path=f"{shots}/int-cd-q30.png")
            click(pg, "w-cd", "Újra"); click(pg, "w-cd", "+10")
            print("== dice n=10", stats(pg, "w-cd")[:6], txt(pg, "#w-cd p[style*='bad-soft']"))
            pg.locator("#w-cd").screenshot(path=f"{shots}/int-cd-n10.png")
            for k in ("dohányzás × nem", "ugyanez kétszer", "lakóhely × párt", "50 cég", "kis klinikai minta"):
                click(pg, "w-it", k); pg.wait_for_timeout(100)
                cells = pg.eval_on_selector("#w-it table", "t => [...t.querySelectorAll('td')].filter(td => td.querySelector('input')).map(td => td.innerText.replace(/\\n/g,' '))")
                print("== indep", k, stats(pg, "w-it")); print("   cells", cells)
                print("   warn:", pg.eval_on_selector("#w-it p[style*='bad-soft']", "e => e.style.display === 'none' ? '-' : e.innerText"))
            click(pg, "w-it", "χ²-hozzájárulás"); click(pg, "w-it", "lakóhely × párt")
            print("   contrib", pg.eval_on_selector("#w-it table", "t => [...t.querySelectorAll('td')].filter(td => td.querySelector('input')).map(td => td.lastChild.innerText)"))
            print("   readout", txt(pg, "#w-it .readout"))
            pg.locator("#w-it").screenshot(path=f"{shots}/int-it-contrib.png")
            # szerkesztés: üres oszlop
            inp = pg.locator("#w-it table input")
            click(pg, "w-it", "kis klinikai minta"); inp.nth(0).fill("0"); inp.nth(2).fill("0")
            print("== indep empty col", stats(pg, "w-it"), txt(pg, "#w-it p[style*='bad-soft']"))
            click(pg, "w-it", "3×3"); print("== indep 3x3 resize", stats(pg, "w-it")[:3])
            for k in ("teás hölgy (8 csésze)", "6 csésze", "kis klinikai minta"):
                click(pg, "w-fe", k); pg.wait_for_timeout(100)
                print("== fisher", k, stats(pg, "w-fe")); print("  ", txt(pg, "#w-fe .readout:last-of-type").replace("\n", "\n   "))
            fi = pg.locator("#w-fe table input"); fi.nth(0).fill("12"); fi.nth(3).fill("9"); fi.nth(1).fill("3"); fi.nth(2).fill("5")
            print("== fisher [[12,3],[5,9]]", stats(pg, "w-fe"))
            fi.nth(0).fill("30"); fi.nth(1).fill("30"); fi.nth(2).fill("30"); fi.nth(3).fill("30")
            print("== fisher [[30,30],[30,30]]", stats(pg, "w-fe"))
            pg.locator("#w-fe").screenshot(path=f"{shots}/int-fe-big.png")
            fi.nth(0).fill("0"); fi.nth(1).fill("0"); fi.nth(2).fill("3"); fi.nth(3).fill("2")
            print("== fisher degenerate", stats(pg, "w-fe"))
            click(pg, "w-fe", "kis klinikai minta")
            bb = pg.locator("#w-fe canvas").bounding_box(); pg.mouse.click(bb["x"] + 60, bb["y"] + bb["height"] - 60)
            print("== fisher tap", txt(pg, "#w-fe .readout"))
            print("errors:", errs); ctx.close()
        if mode in ("all", "shots"):
            for theme in ("light", "dark"):
                for width in (1280, 380):
                    ctx = b.new_context(viewport={"width": width, "height": 900}, has_touch=width < 500)
                    ctx.add_init_script(f"localStorage.setItem('synopsis:theme','{theme}')")
                    pg = ctx.new_page(); errs = []
                    pg.on("pageerror", lambda e: errs.append(str(e)))
                    pg.goto(URL); pg.wait_for_timeout(1800)
                    if width < 500: pg.locator("#w-cd button", has_text="Szimuláld 2000-szer").click(); idle(pg, "w-cd")
                    sw = pg.evaluate("document.documentElement.scrollWidth")
                    for wid in ("w-cd", "w-it", "w-fe"):
                        pg.locator(f"#{wid}").screenshot(path=f"{shots}/{theme}-{width}-{wid}.png")
                    click(pg, "w-it", "lakóhely × párt"); pg.locator("#w-it").screenshot(path=f"{shots}/{theme}-{width}-w-it-3x3.png")
                    sw = max(sw, pg.evaluate("document.documentElement.scrollWidth"))
                    print(theme, width, "scrollWidth", sw, "errors", errs); ctx.close()
        b.close()
finally:
    srv.kill(); srv.wait()
