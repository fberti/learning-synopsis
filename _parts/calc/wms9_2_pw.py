# Matstat 9. fejezet, w2-widgetek böngészős tesztje: python wms9_2_pw.py PORT OUTDIR
import sys, json, os, glob
from playwright.sync_api import sync_playwright
PORT = sys.argv[1]; OUT = sys.argv[2]
URL = f"http://localhost:{PORT}/_parts/ms9/wtest2.html"
res = {}
CLEAN = "const c = e.cloneNode(true); c.querySelectorAll('.katex-mathml').forEach(x => x.remove());"
TXT = "e => { " + CLEAN + " return c.textContent.replace(/\\s+/g,' ').trim(); }"
STATS = "els => els.map(e => { " + CLEAN + " return c.querySelector('.l').textContent.replace(/\\s+/g,' ') + ' = ' + c.querySelector('.v').textContent.replace(/\\s+/g,' '); })"
def stats(loc): return loc.locator(".stat").evaluate_all(STATS)
def txt(loc): return loc.evaluate(TXT)
def ps(loc): return loc.locator("p").evaluate_all("els => els.map(e => e.textContent.replace(/\\s+/g,' ').trim())")
def setr(loc, v): loc.evaluate(f"e => {{ e.value = {v}; e.dispatchEvent(new Event('input')) }}")
WIDS = ("w-rt", "w-ks", "w-bf")
def btn(loc, name): return loc.get_by_role("button", name=name, exact=True)
with sync_playwright() as p:
    try: b = p.chromium.launch()
    except Exception:  # a telepített Playwright-verzióhoz nincs böngésző: a gyorsítótár legújabb headless shellje
        exe = sorted(glob.glob(os.path.expanduser("~/.cache/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell")))[-1]
        b = p.chromium.launch(executable_path=exe)
    for theme in ("light", "dark"):
        for W in (1280, 380):
            pg = b.new_page(viewport={"width": W, "height": 900}, has_touch=(W == 380))
            errs = []
            pg.on("console", lambda m: m.type in ("error", "warning") and errs.append(m.text))
            pg.on("pageerror", lambda e: errs.append("PAGEERROR " + str(e)))
            pg.add_init_script(f"localStorage.setItem('synopsis:theme', '{theme}')")
            pg.goto(URL); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(600)
            key = f"{theme}-{W}"
            res[key + "-overflow"] = pg.evaluate("document.documentElement.scrollWidth - innerWidth")
            res[key + "-wide"] = pg.evaluate("""() => [...document.querySelectorAll('.widget *')].filter(e => {
                const w = e.closest('.widget').getBoundingClientRect(), r = e.getBoundingClientRect();
                return r.width > 0 && r.right > w.right + 1 && !e.closest('.katex') && !e.closest('.readout');
              }).map(e => e.tagName + '.' + e.className).slice(0, 10)""")
            for wid in WIDS:
                pg.locator("#" + wid).screenshot(path=f"{OUT}/{key}-{wid}.png")
            if W == 1280 and theme == "light":
                r = pg.locator("#w-rt")
                res["rt-init"] = [stats(r), ps(r)[1:4]]
                for v in (150, 200, 100):
                    setr(r.locator("input[type=range]"), v); res[f"rt-{v}"] = [stats(r), ps(r)[1:3]]
                r.screenshot(path=f"{OUT}/int-rt-100.png")
                btn(r, "kiugró: 150").click(); r.screenshot(path=f"{OUT}/int-rt-150.png")
                btn(r, "eredeti adatok").click()
                # húzás: az A-beli 72-t (első pont) 73-ra → nincs kötés
                box = r.locator("canvas").first.bounding_box()
                X = pg.evaluate("""() => { const w = document.querySelector('#w-rt canvas').clientWidth, x0 = 24, x1 = w - 12, xb = x0 + 0.8 * (x1 - x0);
                    return [72, 73.2].map(v => x0 + (v - 55) / (101 - 55) * (xb - x0)); }""")
                pg.mouse.move(box["x"] + X[0], box["y"] + 60); pg.mouse.down(); pg.mouse.move(box["x"] + X[1], box["y"] + 60, steps=4); pg.mouse.up()
                res["rt-drag73"] = [stats(r), ps(r)[1:4], txt(r.locator(".readout"))]
                r.screenshot(path=f"{OUT}/int-rt-drag.png")
                k = pg.locator("#w-ks")
                res["ks-init"] = [stats(k), txt(k.locator(".readout"))]
                k.locator('button[data-v="two"]').click(); res["ks-two"] = [stats(k), txt(k.locator(".readout")), ps(k)[-1]]
                k.screenshot(path=f"{OUT}/int-ks-two.png")
                k.locator('button[data-v="one"]').click(); k.locator('button[data-v="rand"]').click()
                for d in ("norm", "exp", "unif"):
                    k.locator(f'button[data-v="{d}"]').click()
                    for nn in ("10", "25", "100"):
                        k.locator(f'button[data-v="{nn}"]').click(); res[f"ks-{d}-{nn}"] = stats(k)
                    k.screenshot(path=f"{OUT}/int-ks-{d}-100.png")
                k.locator("input[type=number]").first.fill("505"); res["ks-unif-100-mu505"] = stats(k)
                f = pg.locator("#w-bf")
                res["bf-init"] = [stats(f), txt(f.locator(".readout"))]
                for s in ("pow2", "fib", "bills", "unif", "own"):
                    f.locator(f'button[data-v="{s}"]').click(); res["bf-" + s] = [stats(f), txt(f.locator(".readout"))]
                    f.screenshot(path=f"{OUT}/int-bf-{s}.png")
                f.locator("textarea").fill("0 abc 0,0089 12 3,5 1e5 -42 0,30"); res["bf-own2"] = [stats(f), txt(f.locator(".readout")), ps(f)[1]]
            res[key + "-errs"] = errs
            pg.close()
    b.close()
print(json.dumps(res, ensure_ascii=False, indent=1))
