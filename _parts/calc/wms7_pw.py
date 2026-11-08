# Matstat 7. fejezet, w2-widgetek böngészős tesztje: python wms7_pw.py PORT OUTDIR
import sys, json, time
from playwright.sync_api import sync_playwright
PORT = sys.argv[1]; OUT = sys.argv[2]
URL = f"http://localhost:{PORT}/_parts/ms7/wtest2.html"
res = {}
TXT = "e => { const c = e.cloneNode(true); c.querySelectorAll('.katex-mathml').forEach(x => x.remove()); return c.textContent.replace(/\\s+/g,' ').trim(); }"
STATS = "els => els.map(e => { const c = e.cloneNode(true); c.querySelectorAll('.katex-mathml').forEach(x => x.remove()); return c.querySelector('.l').textContent.replace(/\\s+/g,' ') + ' = ' + c.querySelector('.v').textContent.replace(/\\s+/g,' '); })"
def stats(loc): return loc.locator(".stat").evaluate_all(STATS)
def txt(loc): return loc.evaluate(TXT)
def setr(loc, v): loc.evaluate(f"e => {{ e.value = {v}; e.dispatchEvent(new Event('input')) }}")
WIDS = ("w-bt", "w-pd", "w-pt", "w-ph")
def btn(loc, name): return loc.get_by_role("button", name=name, exact=True)
with sync_playwright() as p:
    b = p.chromium.launch()
    for theme in ("light", "dark"):
        for W in (1280, 380):
            pg = b.new_page(viewport={"width": W, "height": 900}, has_touch=(W == 380))
            errs = []
            pg.on("console", lambda m: m.type in ("error", "warning") and errs.append(m.text))
            pg.on("pageerror", lambda e: errs.append("PAGEERROR " + str(e)))
            pg.add_init_script(f"localStorage.setItem('synopsis:theme', '{theme}')")
            pg.goto(URL); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(700)
            key = f"{theme}-{W}"
            res[key + "-overflow"] = pg.evaluate("document.documentElement.scrollWidth - innerWidth")
            res[key + "-wide"] = pg.evaluate("""() => [...document.querySelectorAll('.widget *')].filter(e => {
                const w = e.closest('.widget').getBoundingClientRect(), r = e.getBoundingClientRect();
                return r.width > 0 && r.right > w.right + 1 && !e.closest('.katex') && !e.closest('.formula-out');
              }).map(e => e.tagName + '.' + e.className).slice(0, 10)""")
            for wid in WIDS:
                pg.locator("#" + wid).screenshot(path=f"{OUT}/{key}-{wid}.png")
            if theme == "light" and W == 1280:
                c = pg.locator("#w-bt")
                def bt(): return stats(c) + [txt(c.locator(".readout"))]
                res["bt-init-two"] = bt()
                c.locator('button[data-v="right"]').click(); res["bt-right-60"] = bt()
                c.screenshot(path=f"{OUT}/int-bt-right.png")
                c.locator('button[data-v="left"]').click(); res["bt-left-60"] = bt()
                c.locator('button[data-v="two"]').click()
                setr(c.locator("input[type=range]"), 61); res["bt-two-61"] = bt()
                setr(c.locator("input[type=range]"), 40); res["bt-two-40"] = bt()
                for a in ("0.1", "0.01"):
                    c.locator(f'button[data-v="{a}"]').click(); res["bt-two-" + a] = stats(c)[:2]
                c.locator('button[data-v="0.05"]').click()
                for nn in ("10", "20", "50"):
                    c.locator(f'button[data-v="{nn}"]').first.click(); res["bt-n" + nn] = bt()
                    if nn == "10": c.screenshot(path=f"{OUT}/int-bt-n10.png")
                c.locator('button[data-v="100"]').first.click()
                btn(c, "Dobj 100-at egy szabályos érmével").click(); res["bt-throw"] = bt()
                for _ in range(10): btn(c, "+1 000 sorozat").click()
                res["bt-1000x10"] = txt(c.locator("p.muted"))
                setr(c.locator("input[type=range]"), 85); res["bt-k85"] = bt()
                c.screenshot(path=f"{OUT}/int-bt-k85.png")
                d = pg.locator("#w-pd")
                res["pd-init"] = stats(d)
                for _ in range(20): btn(d, "+1 000").click()
                res["pd-n32-d05-20k"] = stats(d)
                d.screenshot(path=f"{OUT}/int-pd-20k.png")
                d.locator('button[data-v="0"]').click()
                for _ in range(20): btn(d, "+1 000").click()
                res["pd-d0-20k"] = stats(d)
                d.locator('button[data-v="0.8"]').click(); d.locator('button[data-v="128"]').click()
                t0 = time.time()
                for _ in range(5): btn(d, "+1 000").click()
                res["pd-d08-n128"] = [stats(d), round(time.time() - t0, 2)]
                d.screenshot(path=f"{OUT}/int-pd-d08-n128.png")
                btn(d, "Ürít").click(); res["pd-empty"] = stats(d)
                d.screenshot(path=f"{OUT}/int-pd-empty.png")
                btn(d, "1 ismétlés").click(); res["pd-one"] = stats(d)
                t = pg.locator("#w-pt")
                def pt(): return stats(t) + [txt(t.locator(".readout"))]
                res["pt-init"] = pt() + [txt(t.locator("p.muted").last)]
                btn(t, "1 keverés").click(); res["pt-1"] = pt()
                t.screenshot(path=f"{OUT}/int-pt-1.png")
                btn(t, "Mind a 20 felsorolása").click(); res["pt-small-exact"] = pt()
                t.screenshot(path=f"{OUT}/int-pt-small-exact.png")
                for _ in range(10): btn(t, "+1 000 keverés").click()
                res["pt-small-10k"] = pt()
                t.locator('button[data-v="big"]').click(); res["pt-big-init"] = pt() + [txt(t.locator("p.muted").last)]
                t0 = time.time(); btn(t, "Pontos (12 870 felosztás)").click()
                res["pt-big-exact"] = [pt(), round(time.time() - t0, 2)]
                t.screenshot(path=f"{OUT}/int-pt-big-exact.png")
                for _ in range(20): btn(t, "+1 000 keverés").click()
                res["pt-big-20k"] = pt()
                t.screenshot(path=f"{OUT}/int-pt-big-20k.png")
                btn(t, "1 keverés").click(); t.screenshot(path=f"{OUT}/int-pt-big-1.png")
                hk = pg.locator("#w-ph")
                def ph(): return stats(hk) + [txt(hk.locator(".readout"))]
                res["ph-init"] = ph()
                for _ in range(50): btn(hk, "+100 kutatás").click()
                res["ph-5001"] = ph()
                hk.locator('button[data-v="1"]').click(); res["ph-5001-bonf"] = ph()
                hk.screenshot(path=f"{OUT}/int-ph-bonf.png")
                hk.locator('button[data-v="0"]').click()
                btn(hk, "Újra").click(); res["ph-ujra"] = ph()
                pg.evaluate("document.documentElement.setAttribute('data-theme','dark')"); pg.wait_for_timeout(250)
                hk.screenshot(path=f"{OUT}/int-ph-runtime-dark.png")
            if W == 380 and theme == "light":
                t = pg.locator("#w-pt"); t.locator('button[data-v="big"]').tap(); btn(t, "1 keverés").tap(); pg.wait_for_timeout(450)
                t.screenshot(path=f"{OUT}/int-pt-big-380.png")
                c = pg.locator("#w-bt"); c.locator('button[data-v="right"]').tap()
                c.screenshot(path=f"{OUT}/int-bt-right-380.png")
            res[key + "-errors"] = errs
            pg.close()
    b.close()
print(json.dumps(res, ensure_ascii=False, indent=1))
