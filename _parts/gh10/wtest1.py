import sys, json, glob
from playwright.sync_api import sync_playwright
port = sys.argv[1]
url = f"http://localhost:{port}/_parts/gh10/wtest1.html"
S = "_parts/gh10/shots/"
def W(pg, name): return pg.locator(f".widget[data-widget={name}]")
def txt(l): return l.evaluate("e => { const c = e.cloneNode(true); c.querySelectorAll('.katex-mathml').forEach(x => x.remove()); return c.innerText; }").replace("\n", " | ")
def bt(w, name, i=0): w.get_by_role("button", name=name, exact=True).nth(i).click()
def attr(w, a): v = w.get_attribute("data-" + a); return json.loads(v) if v else v
def sel(w, i, v): w.locator("select").nth(i).select_option(v)
def setR(pg, sel_, v): pg.evaluate("([s, v]) => { const e = document.querySelector(s); e.value = v; e.dispatchEvent(new Event('input')); e.dispatchEvent(new Event('change')); }", [sel_, v])
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=sorted(glob.glob("/home/febert/.cache/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell"))[-1])
    pg = b.new_page(viewport={"width": 1000, "height": 900})
    errs = []
    pg.on("console", lambda m: errs.append(m.type + ": " + m.text) if m.type in ("error", "warning") else None)
    pg.on("pageerror", lambda e: errs.append("PAGEERROR " + str(e)))
    pg.goto(url); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(800)
    # overlap
    w = W(pg, "overlap-compare")
    print("OV default", attr(w, "ov")); w.screenshot(path=S + "wA-overlap-vn-ny.png")
    for L, R in [("RH", "VN"), ("RH", "EK"), ("EK", "NY"), ("first", "second"), ("all", "VN")]:
        sel(w, 0, L); sel(w, 1, R); print("OV", L, R, attr(w, "ov"))
    w.screenshot(path=S + "wA-overlap-halves.png")
    print("OV jtab:", txt(w.locator(".tw").nth(1)))
    w.locator("td[data-p=RH][data-q=VN]").click(); print("OV click RH-VN", attr(w, "ov"))
    # naive
    w = W(pg, "naive-vs-qap"); w.scroll_into_view_if_needed()
    print("NV one", attr(w, "one")); w.screenshot(path=S + "wA-naive-one.png")
    for rho in [0, 1, 2]:
        setR(pg, ".widget[data-widget=naive-vs-qap] input[aria-label='ρ']", rho)
        bt(w, "200 kísérlet")
        pg.wait_for_function(f"(() => {{ const d = document.querySelector('.widget[data-widget=naive-vs-qap]').dataset.sim; return d && JSON.parse(d).rho === {rho}; }})()", timeout=120000)
        print("NV sim", attr(w, "sim"))
    w.screenshot(path=S + "wA-naive-sim.png")
    # qap
    w = W(pg, "qap-lab"); w.scroll_into_view_if_needed()
    bt(w, "Permutálj"); pg.wait_for_timeout(300); w.screenshot(path=S + "wA-qap-anim.png"); pg.wait_for_timeout(600)
    for k in "abcde":
        sel(w, 0, k)
        if k in "abc": w.get_by_role("button", name="Mind a", exact=False).click()
        else:
            for i in range(5): bt(w, "×1000")
        print("QAP", k, attr(w, "qap"))
        if k == "c":
            w.locator("label", has_text="súlyozott").locator("input").check(); w.get_by_role("button", name="Mind a", exact=False).click(); print("QAP c w", attr(w, "qap"))
            w.screenshot(path=S + "wA-qap-c-w.png")
            w.locator("label", has_text="súlyozott").locator("input").uncheck(); w.get_by_role("button", name="Mind a", exact=False).click()
            w.locator("label", has_text="kétoldali").locator("input").check(); print("QAP c bin 2s", attr(w, "qap")); w.locator("label", has_text="kétoldali").locator("input").uncheck()
        w.screenshot(path=S + f"wA-qap-{k}.png")
    sel(w, 0, "d"); w.locator("label", has_text="kétoldali").locator("input").check()
    for i in range(5): bt(w, "×1000")
    print("QAP d 2s", attr(w, "qap")); w.locator("label", has_text="kétoldali").locator("input").uncheck()
    w.locator("label", has_text="cellákat").locator("input").check()
    for i in range(5): bt(w, "×1000")
    print("QAP d cells", attr(w, "qap")); w.screenshot(path=S + "wA-qap-d-cells.png")
    sel(w, 0, "b"); bt(w, "×1000"); print("QAP b cells", attr(w, "qap")); w.screenshot(path=S + "wA-qap-b-cells.png")
    w.locator("label", has_text="cellákat").locator("input").uncheck()
    print("QAP readout:", txt(w.locator(".readout").first))
    # mrqap
    w = W(pg, "mrqap-lab"); w.scroll_into_view_if_needed()
    def wait_done():
        pg.wait_for_function("(() => { const d = JSON.parse(document.querySelector('.widget[data-widget=mrqap-lab]').dataset.mrqap); return d.done === d.total; })()", timeout=120000)
        return attr(w, "mrqap")
    bt(w, "2000")
    print("MR fr dsp", wait_done())
    bt(w, "Y-permutáció"); print("MR fr y", wait_done())
    cb = lambda l: w.locator("label", has_text=l).locator("input")
    cb("kinek jelent").check(); print("MR fr+rep y", wait_done())
    bt(w, "DSP"); print("MR fr+rep dsp", wait_done()); w.screenshot(path=S + "wA-mrqap-fr-rep.png")
    cb("azonos részleg").check(); print("MR +same dsp", wait_done())
    cb("azonos részleg").uncheck(); cb("ideje").check(); print("MR +ten dsp", wait_done())
    cb("azonos részleg").check(); print("MR all4 dsp", wait_done()); w.screenshot(path=S + "wA-mrqap-all.png")
    bt(w, "naiv OLS"); print("MR ols", attr(w, "mrqap")); print("MR table:", txt(w.locator(".tw").first))
    pg.screenshot(path=S + "wA-full-light.png", full_page=True)
    pg.evaluate("document.documentElement.setAttribute('data-theme','dark')"); pg.wait_for_timeout(400)
    for nm in ["overlap-compare", "naive-vs-qap", "qap-lab", "mrqap-lab"]: W(pg, nm).screenshot(path=S + f"wA-{nm}-dark.png")
    pg.evaluate("document.documentElement.setAttribute('data-theme','light')")
    pg.set_viewport_size({"width": 390, "height": 850}); pg.reload(); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(1500)
    for nm in ["overlap-compare", "naive-vs-qap", "qap-lab", "mrqap-lab"]:
        w = W(pg, nm); w.scroll_into_view_if_needed()
        if nm == "qap-lab": sel(w, 0, "d"); bt(w, "×1000")
        if nm == "mrqap-lab": w.locator("label", has_text="kinek jelent").locator("input").check(); pg.wait_for_timeout(2500)
        w.screenshot(path=S + f"wA-{nm}-mobile.png")
    print("overflow:", pg.evaluate("document.documentElement.scrollWidth"), [pg.evaluate(f"document.querySelector('.widget[data-widget={n}]').scrollWidth") for n in ["overlap-compare", "naive-vs-qap", "qap-lab", "mrqap-lab"]])
    print("errors:", errs)
    b.close()
