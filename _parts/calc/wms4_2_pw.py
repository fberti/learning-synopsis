import sys, json
from playwright.sync_api import sync_playwright
PORT = sys.argv[1]; OUT = sys.argv[2]
URL = f"http://localhost:{PORT}/_parts/ms4/wtest2.html"
res = {}
STATS = "els => els.map(e => e.querySelector('.l').innerText.replace(/\\s+/g,' ') + ' = ' + e.querySelector('.v').innerText)"
def stats(loc): return loc.locator(".stat:visible").evaluate_all(STATS)
def setr(loc, v): loc.evaluate(f"e => {{ e.value = {v}; e.dispatchEvent(new Event('input')) }}")
with sync_playwright() as p:
    b = p.chromium.launch()
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
            # elements wider than their widget
            res[key + "-wide"] = pg.evaluate("""() => [...document.querySelectorAll('.widget *')].filter(e => {
                const w = e.closest('.widget').getBoundingClientRect(), r = e.getBoundingClientRect();
                return r.width > 0 && r.right > w.right + 1 && !e.closest('.tw') && !e.closest('.katex');
              }).map(e => e.tagName + '.' + e.className).slice(0, 10)""")
            for wid in ("w-pl", "w-wr", "w-rw", "w-as"):
                pg.locator("#" + wid).screenshot(path=f"{OUT}/{key}-{wid}.png")
            if theme == "light" and W == 1280:
                pl = pg.locator("#w-pl")
                res["pl-init"] = stats(pl); res["pl-msg"] = pl.locator(".readout").first.inner_text()
                pl.get_by_role("button", name="+x%, majd −x%").click(); pg.wait_for_timeout(100)
                res["pl-demo"] = pl.locator(".readout").nth(1).inner_text()
                res["pl-demo-stats"] = stats(pl)[5:]
                pl.screenshot(path=f"{OUT}/int-pl-demo.png")
                setr(pl.locator("input[type=range]").nth(0), 80); pg.wait_for_timeout(50)
                res["pl-A80"] = stats(pl)[:5]; res["pl-A80-msg"] = pl.locator(".readout").first.inner_text()
                pl.screenshot(path=f"{OUT}/int-pl-A80.png")
                pl.get_by_role("button", name="Két arány").click(); pg.wait_for_timeout(100)
                res["pl2-init"] = stats(pl)
                for nm in ["Fagylaltgép 52,6% → 78,9%", "Kamat 2% → 3%", "Munkanélküliség 4% → 5%", "Kockázat 0,4% → 0,3%"]:
                    pl.get_by_role("button", name=nm).click(); pg.wait_for_timeout(50)
                    res["pl2-" + nm] = [stats(pl)[1:3], pl.locator(".readout").nth(2).inner_text()]
                pl.screenshot(path=f"{OUT}/int-pl-ratio.png")
                wr = pg.locator("#w-wr")
                res["wr-init"] = stats(wr); res["wr-msg"] = wr.locator(".readout").inner_text()
                wr.get_by_role("button", name="Előző év (2 + 8 fő; 2,4 és 1,4)").click(); pg.wait_for_timeout(50)
                res["wr-prev"] = stats(wr)
                wr.get_by_role("button", name="+ bolt").click(); pg.wait_for_timeout(50)
                res["wr-C"] = stats(wr); res["wr-C-msg"] = wr.locator(".readout").inner_text()
                wr.screenshot(path=f"{OUT}/int-wr-C.png")
                rw = pg.locator("#w-rw")
                tab = lambda: rw.locator("tr").evaluate_all("els => els.map(r => [...r.children].filter(c => c.style.display !== 'none').map(c => c.querySelector('input') ? c.querySelector('input').value : c.innerText.replace(/\\s+/g,' ')).join(' | '))")
                res["rw-2021"] = tab(); res["rw-msg"] = rw.locator(".readout").inner_text()
                rw.get_by_role("button", name="Mennyi bér kellett volna?").click(); pg.wait_for_timeout(50)
                res["rw-need"] = tab(); res["rw-need-msg"] = rw.locator(".readout").inner_text()
                rw.screenshot(path=f"{OUT}/int-rw-need.png")
                rw.get_by_role("button", name="2019", exact=True).click(); pg.wait_for_timeout(50)
                res["rw-2019"] = tab()
                rw.locator("input[type=number]").nth(5).fill("450"); pg.wait_for_timeout(50)
                res["rw-2019-450"] = tab()[-1]
                rw.screenshot(path=f"{OUT}/int-rw-2019.png")
                ag = pg.locator("#w-as")
                for nm in ["Öregfalu szerkezete", "Ifjúváros szerkezete", "egyenlő (⅓–⅓–⅓)", "a kettő átlaga"]:
                    ag.get_by_role("button", name=nm).click(); pg.wait_for_timeout(50)
                    res["as-" + nm] = [stats(ag)[:5], ag.locator(".readout").inner_text()]
                res["as-nga"] = stats(ag)[5:]
                ag.screenshot(path=f"{OUT}/int-as-avg.png")
                # clamp test: Öregfalu 0-39 to 90 -> clamped to 70
                setr(ag.locator("input[type=range]").nth(0), 90); pg.wait_for_timeout(50)
                res["as-clamp"] = ag.locator("input[type=range]").nth(0).evaluate("e => e.value")
                res["as-clamp-stats"] = stats(ag)[:5]
                pg.evaluate("document.documentElement.setAttribute('data-theme','dark')"); pg.wait_for_timeout(200)
                ag.screenshot(path=f"{OUT}/int-as-runtime-dark.png")
            if W == 380 and theme == "light":
                pl = pg.locator("#w-pl")
                pl.get_by_role("button", name="Két arány").tap(); pg.wait_for_timeout(100)
                pl.get_by_role("button", name="Kockázat 0,4% → 0,3%").tap(); pg.wait_for_timeout(100)
                pl.screenshot(path=f"{OUT}/int-pl-ratio-380.png")
                res["pl2-380-canvas"] = pl.locator("canvas").nth(1).evaluate("c => c.style.width")
                rw = pg.locator("#w-rw")
                rw.get_by_role("button", name="Mennyi bér kellett volna?").tap(); pg.wait_for_timeout(100)
                rw.screenshot(path=f"{OUT}/int-rw-need-380.png")
            res[key + "-errors"] = errs
            pg.close()
    b.close()
print(json.dumps(res, ensure_ascii=False, indent=1))
