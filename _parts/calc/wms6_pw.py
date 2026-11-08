# Matstat 6. fejezet, w2-widgetek böngészős tesztje: python wms6_pw.py PORT OUTDIR
import sys, json
from playwright.sync_api import sync_playwright
PORT = sys.argv[1]; OUT = sys.argv[2]
URL = f"http://localhost:{PORT}/_parts/ms6/wtest2.html"
res = {}
TXT = "e => { const c = e.cloneNode(true); c.querySelectorAll('.katex-mathml').forEach(x => x.remove()); return c.textContent.replace(/\\s+/g,' ').trim(); }"
STATS = "els => els.map(e => { const c = e.cloneNode(true); c.querySelectorAll('.katex-mathml').forEach(x => x.remove()); return c.querySelector('.l').textContent.replace(/\\s+/g,' ') + ' = ' + c.querySelector('.v').textContent.replace(/\\s+/g,' '); })"
def stats(loc): return loc.locator(".stat").evaluate_all(STATS)
def txt(loc): return loc.evaluate(TXT)
def setr(loc, v): loc.evaluate(f"e => {{ e.value = {v}; e.dispatchEvent(new Event('input')) }}")
WIDS = ("w-cw", "w-pc", "w-sc", "w-np", "w-bc")
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
                c = pg.locator("#w-cw")
                def cw(): return [txt(c.locator(".formula-out"))] + stats(c)
                res["cw-init"] = cw() + [txt(c.locator(".readout"))]
                for L in ("0.9", "0.99", "0.8", "0.999", "0.95"):
                    c.locator(f'button[data-v="{L}"]').click(); res["cw-" + L] = cw()[1]
                c.locator('button[data-v="t"]').click(); res["cw-t-95"] = cw() + [txt(c.locator(".readout"))]
                c.screenshot(path=f"{OUT}/int-cw-t.png")
                c.locator('button[data-v="z"]').click()
                setr(c.locator("input[type=range]").nth(1), 642); res["cw-n60"] = cw()
                c.get_by_role("button", name="+", exact=True).click(); res["cw-n61"] = cw()[0]
                setr(c.locator("input[type=range]").nth(0), 40); setr(c.locator("input[type=range]").nth(1), 0)
                c.locator('button[data-v="t"]').click(); c.locator('button[data-v="0.999"]').click()
                res["cw-extreme"] = cw()
                c.screenshot(path=f"{OUT}/int-cw-extreme.png")
                q = pg.locator("#w-pc")
                for lab in ("0 / 20", "7 / 10", "176 / 800", "310 / 1000"):
                    q.get_by_role("button", name=lab).click(); pg.wait_for_timeout(30)
                    res["pc-" + lab] = stats(q)[:3] + [txt(q.locator(".readout"))]
                    if lab == "0 / 20": q.screenshot(path=f"{OUT}/int-pc-0-20.png")
                q.locator("input[type=number]").nth(0).fill("1"); q.locator("input[type=number]").nth(1).fill("30"); pg.wait_for_timeout(30)
                res["pc-1/30"] = stats(q)[:3] + [txt(q.locator(".readout"))]
                q.screenshot(path=f"{OUT}/int-pc-1-30.png")
                q.locator("input[type=number]").nth(0).fill("40"); pg.wait_for_timeout(30)
                res["pc-40/30"] = txt(q.locator(".readout"))
                for pv in (0.1, 0.3, 0.5):
                    setr(q.locator("input[type=range]"), pv); res[f"pc-cov-20-{pv}"] = stats(q)[3:]
                q.locator('button[data-v="100"]').click(); setr(q.locator("input[type=range]"), 0.05); res["pc-cov-100-0.05"] = stats(q)[3:]
                q.locator('button[data-v="1000"]').click(); pg.wait_for_timeout(50); res["pc-cov-1000-0.05"] = stats(q)[3:]
                q.locator('button[data-v="20"]').click()
                cvb = q.locator("canvas").nth(1); cvb.scroll_into_view_if_needed(); bb = cvb.bounding_box()
                pg.mouse.move(bb["x"] + 42 + (bb["width"] - 52) * 0.3, bb["y"] + bb["height"] / 2); pg.wait_for_timeout(30)
                res["pc-hover-0.3"] = stats(q)[3:]
                q.screenshot(path=f"{OUT}/int-pc-hover.png")
                q.locator('button[data-v="10"]').click(); pg.wait_for_timeout(30)
                q.screenshot(path=f"{OUT}/int-pc-n10.png")
                s = pg.locator("#w-sc")
                res["sc-init"] = [txt(s.locator(".formula-out"))] + stats(s)
                s.locator('button[data-v="0.99"]').first.click(); res["sc-99"] = stats(s)[:4]
                s.locator('button[data-v="0.9"]').first.click(); res["sc-90"] = stats(s)[:4]
                s.screenshot(path=f"{OUT}/int-sc-90.png")
                s.locator('button[data-v="0.95"]').first.click()
                for popv in ("norm", "exp", "unif"):
                    s.locator(f'button[data-v="{popv}"]').click()
                    for _ in range(10): s.get_by_role("button", name="+1 000 minta").click()
                    pg.wait_for_timeout(30); res["sc-sim-" + popv] = stats(s)[4:]
                    if popv == "exp": s.screenshot(path=f"{OUT}/int-sc-exp.png")
                s.locator('button[data-v="100"]').last.click(); s.locator('button[data-v="exp"]').click()
                for _ in range(10): s.get_by_role("button", name="+1 000 minta").click()
                res["sc-sim-exp-100"] = stats(s)[4:]
                s.get_by_role("button", name="Újra").click(); res["sc-ujra"] = stats(s)[4:]
                n = pg.locator("#w-np")
                def np_(): return [txt(n.locator(".formula-out")), n.locator("div[style*='2.1rem']").inner_text()]
                res["np-init"] = np_()
                n.locator("input[type=number]").nth(4).fill("500"); pg.wait_for_timeout(30); res["np-N500"] = np_()
                n.screenshot(path=f"{OUT}/int-np-N500.png")
                n.locator("input[type=number]").nth(4).fill(""); pg.wait_for_timeout(30)
                n.locator('button[data-v="prop"]').click()
                for d in ("3", "2", "1"):
                    n.locator("input[type=number]").nth(3).fill(d); pg.wait_for_timeout(30); res["np-p05-" + d] = np_()
                n.locator("input[type=number]").nth(3).fill("3"); n.locator("input[type=number]").nth(2).fill("0.31"); pg.wait_for_timeout(30)
                res["np-p031-3"] = np_()
                n.screenshot(path=f"{OUT}/int-np-prop.png")
                n.get_by_role("button", name="nem tudom → 0,5").click(); res["np-reset05"] = np_()[1]
                n.locator("input[type=number]").nth(2).fill("0"); pg.wait_for_timeout(30); res["np-p0"] = np_()
                bc = pg.locator("#w-bc")
                res["bc-init"] = stats(bc)
                bc.locator('button[data-v="10000"]').click(); pg.wait_for_timeout(50)
                res["bc-konz-mean"] = stats(bc)
                bc.screenshot(path=f"{OUT}/int-bc-konz-mean.png")
                bc.locator('button[data-v="median"]').click(); res["bc-konz-median"] = stats(bc)
                bc.screenshot(path=f"{OUT}/int-bc-konz-median.png")
                bc.locator('button[data-v="sd"]').click(); res["bc-konz-sd"] = stats(bc) + [txt(bc.locator("p.muted"))]
                bc.screenshot(path=f"{OUT}/int-bc-konz-sd.png")
                bc.locator('button[data-v="ing"]').click(); bc.locator('button[data-v="mean"]').click(); pg.wait_for_timeout(50)
                res["bc-ing-mean"] = stats(bc) + [txt(bc.locator("p.muted"))]
                bc.screenshot(path=f"{OUT}/int-bc-ing-mean.png")
                bc.locator('button[data-v="median"]').click(); res["bc-ing-median"] = stats(bc)
                bc.screenshot(path=f"{OUT}/int-bc-ing-median.png")
                import time; t0 = time.time()
                bc.get_by_role("button", name="+1 000").click(); bc.get_by_role("button", name="Újra").click(); pg.wait_for_timeout(30)
                res["bc-ujra"] = [stats(bc)[1:4], round(time.time() - t0, 2)]
                pg.evaluate("document.documentElement.setAttribute('data-theme','dark')"); pg.wait_for_timeout(250)
                bc.screenshot(path=f"{OUT}/int-bc-runtime-dark.png")
            if W == 380 and theme == "light":
                q = pg.locator("#w-pc"); cvb = q.locator("canvas").nth(1); bb = cvb.bounding_box()
                cvb.tap(position={"x": 42 + (bb["width"] - 52) * 0.8, "y": bb["height"] / 2}); pg.wait_for_timeout(30)
                res["pc-tap-0.8"] = stats(q)[3:]
                q.screenshot(path=f"{OUT}/int-pc-tap-380.png")
                pg.locator("#w-np").locator("input[type=number]").nth(4).fill("500"); pg.wait_for_timeout(30)
                pg.locator("#w-np").screenshot(path=f"{OUT}/int-np-N500-380.png")
            res[key + "-errors"] = errs
            pg.close()
    b.close()
print(json.dumps(res, ensure_ascii=False, indent=1))
