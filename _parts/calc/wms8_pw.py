# Matstat 8. fejezet, w2-widgetek böngészős tesztje: python wms8_pw.py PORT OUTDIR
import sys, json, time
from playwright.sync_api import sync_playwright
PORT = sys.argv[1]; OUT = sys.argv[2]
URL = f"http://localhost:{PORT}/_parts/ms8/wtest2.html"
res = {}
TXT = "e => { const c = e.cloneNode(true); c.querySelectorAll('.katex-mathml').forEach(x => x.remove()); return c.textContent.replace(/\\s+/g,' ').trim(); }"
STATS = "els => els.map(e => { const c = e.cloneNode(true); c.querySelectorAll('.katex-mathml').forEach(x => x.remove()); return c.querySelector('.l').textContent.replace(/\\s+/g,' ') + ' = ' + c.querySelector('.v').textContent.replace(/\\s+/g,' '); })"
def stats(loc): return loc.locator(".stat").evaluate_all(STATS)
def txt(loc): return loc.evaluate(TXT)
def setr(loc, v): loc.evaluate(f"e => {{ e.value = {v}; e.dispatchEvent(new Event('input')) }}")
WIDS = ("w-ws", "w-ft", "w-ab", "w-pp")
def btn(loc, name): return loc.get_by_role("button", name=name, exact=True)
def idle(pg, wid): pg.wait_for_function(f"!document.querySelector('#{wid}').dataset.busy && !document.querySelector('#{wid}').dataset.anim", timeout=120000)
with sync_playwright() as p:
    b = p.chromium.launch()
    for theme in ("light", "dark"):
        for W in (1280, 380):
            pg = b.new_page(viewport={"width": W, "height": 900}, has_touch=(W == 380))
            errs = []
            pg.on("console", lambda m: m.type in ("error", "warning") and errs.append(m.text))
            pg.on("pageerror", lambda e: errs.append("PAGEERROR " + str(e)))
            pg.add_init_script(f"localStorage.setItem('synopsis:theme', '{theme}')")
            pg.goto(URL); pg.wait_for_load_state("networkidle")
            for wid in WIDS: idle(pg, wid)
            pg.wait_for_timeout(500)
            key = f"{theme}-{W}"
            res[key + "-overflow"] = pg.evaluate("document.documentElement.scrollWidth - innerWidth")
            res[key + "-wide"] = pg.evaluate("""() => [...document.querySelectorAll('.widget *')].filter(e => {
                const w = e.closest('.widget').getBoundingClientRect(), r = e.getBoundingClientRect();
                return r.width > 0 && r.right > w.right + 1 && !e.closest('.katex') && !e.closest('.readout');
              }).map(e => e.tagName + '.' + e.className).slice(0, 10)""")
            for wid in WIDS:
                pg.locator("#" + wid).screenshot(path=f"{OUT}/{key}-{wid}.png")
            if theme == "light" and W == 1280:
                c = pg.locator("#w-ws")
                res["ws-init"] = stats(c) + [txt(c.locator(".readout"))]
                for k in ("eq", "sd", "small", "big"):
                    c.locator(f'button[data-v="{k}"]').click()
                    t0 = time.time()
                    for _ in range(4): btn(c, "+10 000").click()
                    idle(pg, "w-ws")
                    res["ws-" + k] = [stats(c), round(time.time() - t0, 2)]
                    c.screenshot(path=f"{OUT}/int-ws-{k}.png")
                btn(c, "1 kísérlet").click(); res["ws-big-one"] = txt(c.locator(".readout"))
                setr(c.locator("input[type=range]").nth(0), 3); res["ws-slider"] = [stats(c), c.locator("button.on").count()]
                f = pg.locator("#w-ft")
                res["ft-init"] = stats(f)
                for d in ("norm", "t5", "exp", "unif"):
                    f.locator(f'button[data-v="{d}"]').click()
                    for nn in ("10", "25", "100"):
                        f.locator(f'button[data-v="{nn}"]').click()
                        t0 = time.time()
                        for _ in range(4): btn(f, "+10 000").click()
                        idle(pg, "w-ft")
                        res[f"ft-{d}-{nn}"] = [stats(f)[1:], round(time.time() - t0, 2)]
                        if nn != "25": f.screenshot(path=f"{OUT}/int-ft-{d}-{nn}.png")
                a = pg.locator("#w-ab")
                res["ab-init"] = stats(a)[:3]
                for _ in range(5): btn(a, "+100 látogató változatonként").click()
                res["ab-500"] = stats(a)[:7] + [txt(a.locator(".readout"))]
                btn(a, "Futtasd 2000-ig").click(); idle(pg, "w-ab")
                res["ab-2000"] = stats(a)[:7] + [txt(a.locator(".readout"))]
                a.screenshot(path=f"{OUT}/int-ab-2000.png")
                # mag-keresés: olyan futás, amelyben útközben 0,05 alá megy
                for i in range(12):
                    if "leállva" in txt(a.locator(".readout")): break
                    btn(a, "Újra").click(); btn(a, "Futtasd 2000-ig").click(); idle(pg, "w-ab")
                res["ab-peek-run"] = [i, txt(a.locator(".readout"))]
                a.screenshot(path=f"{OUT}/int-ab-peek.png")
                t0 = time.time()
                for _ in range(20): btn(a, "Szimuláld 1000-szer").click()
                idle(pg, "w-ab")
                res["ab-sim-20k"] = [stats(a)[7:], round(time.time() - t0, 2)]
                a.screenshot(path=f"{OUT}/int-ab-sim.png")
                a.locator('button[data-v="1"]').click()
                btn(a, "Futtasd 2000-ig").click(); idle(pg, "w-ab")
                res["ab-B15-2000"] = stats(a)[:7]
                for _ in range(5): btn(a, "Szimuláld 1000-szer").click()
                idle(pg, "w-ab"); res["ab-B15-sim5k"] = stats(a)[7:]
                a.screenshot(path=f"{OUT}/int-ab-B15.png")
                q = pg.locator("#w-pp")
                def pp(): return stats(q) + [txt(q.locator(".readout"))]
                res["pp-init"] = pp()
                rng = q.locator("input[type=range]")
                setr(rng.nth(0), 0.5); setr(rng.nth(1), 1); res["pp-d05-80"] = pp()
                q.locator('button[data-v="0.9"]').click(); res["pp-d05-90"] = pp()
                q.locator('button[data-v="0.8"]').click(); setr(rng.nth(0), 3); setr(rng.nth(1), 12)
                q.locator('button[data-v="prop"]').click(); res["pp-prop"] = pp()
                q.screenshot(path=f"{OUT}/int-pp-prop.png")
                bb = q.locator("canvas").bounding_box()
                pg.mouse.move(bb["x"] + bb["width"] * 0.8, bb["y"] + bb["height"] / 2); pg.mouse.down()
                pg.mouse.move(bb["x"] + bb["width"] * 0.5, bb["y"] + bb["height"] / 2, steps=5); pg.mouse.up()
                res["pp-prop-drag"] = stats(q)
                setr(rng.nth(3), 10); res["pp-prop-eq"] = pp()
                q.screenshot(path=f"{OUT}/int-pp-eq.png")
                pg.evaluate("document.documentElement.setAttribute('data-theme','dark')"); pg.wait_for_timeout(300)
                q.screenshot(path=f"{OUT}/int-pp-runtime-dark.png")
            if theme == "light" and W == 380:
                q = pg.locator("#w-pp"); bb = q.locator("canvas").bounding_box()
                q.locator("canvas").tap(position={"x": bb["width"] * 0.3, "y": bb["height"] / 2})
                res["pp-380-tap"] = stats(q)[3]
                q.screenshot(path=f"{OUT}/int-pp-380-tap.png")
                a = pg.locator("#w-ab"); btn(a, "Futtasd 2000-ig").tap(); idle(pg, "w-ab")
                a.screenshot(path=f"{OUT}/int-ab-380.png")
            res[key + "-errors"] = errs
            pg.close()
    b.close()
print(json.dumps(res, ensure_ascii=False, indent=1))
