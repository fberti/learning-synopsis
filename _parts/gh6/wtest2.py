import sys
from playwright.sync_api import sync_playwright
port = sys.argv[1]
url = f"http://localhost:{port}/_parts/gh6/wtest2.html"
S = "_parts/gh6/shots/"
def W(pg, name): return pg.locator(f".widget[data-widget={name}]")
NM = """([v, i]) => { const V = window.__views[v]; V.c.scrollIntoView({block: "center", behavior: "instant"}); const n = V.nodes[i], r = V.c.getBoundingClientRect(); return [r.left + n.x * V.w, r.top + n.y * V.h]; }"""
EM = """([v, i]) => { const V = window.__views[v]; V.c.scrollIntoView({block: "center", behavior: "instant"}); const G = V.edgeGeom(i), r = V.c.getBoundingClientRect(); return [r.left + G.mx, r.top + G.my]; }"""
def cn(pg, v, i): x, y = pg.evaluate(NM, [v, i]); pg.mouse.click(x, y)
def ce(pg, v, i): x, y = pg.evaluate(EM, [v, i]); pg.mouse.click(x, y)
def txt(l): return l.inner_text().replace("\n", " | ")
def tbl(w): return " / ".join(r.replace("\t", " ") for r in w.locator("table tr").all_inner_texts())
def bt(w, name): w.get_by_role("button", name=name, exact=True).click()
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": 1000, "height": 900})
    errs = []
    pg.on("console", lambda m: errs.append(m.type + ": " + m.text) if m.type in ("error", "warning") else None)
    pg.on("pageerror", lambda e: errs.append("PAGEERROR " + str(e)))
    pg.goto(url); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(800)
    print("views:", pg.evaluate("window.__views.length"))
    # ---------- degree-assort (view 0)
    d = W(pg, "degree-assort"); ro = d.locator(".readout")
    for name in ["csillag", "4 csúcsú út", "sárkány", "K₄", "kör", "Árvízhét", "karateklub", "politikai blogok"]:
        bt(d, name); pg.wait_for_timeout(100); print("da", name, ":", txt(ro))
        if name in ("sárkány", "karateklub", "politikai blogok"): d.screenshot(path=S + f"w2-da-{['sárkány','karateklub','politikai blogok'].index(name)}.png")
    bt(d, "sárkány")
    d.locator("[data-pt]").first.click(); pg.wait_for_timeout(100)
    print("da kite click pt:", d.locator("[data-pt]").first.get_attribute("data-pt"), txt(ro), "| hlE", pg.evaluate("[...window.__views[0].hlE].join(' ')"))
    d.screenshot(path=S + "w2-da-click.png")
    bt(d, "csillag"); ce(pg, 0, 0)  # él törlése
    print("da star minus edge:", txt(ro))
    # ---------- weak-ties (view 1)
    w = W(pg, "weak-ties"); w.scroll_into_view_if_needed()
    print("wt stats:", txt(w.locator(".readout").first))
    print("wt info2:", txt(w.locator(".readout").nth(1)))
    curv = lambda n: pg.evaluate(f"document.querySelector('.widget[data-widget=weak-ties] polyline[data-curve={n}]').dataset.v").split()
    for n in ["weak", "strong"]: print("wt curve50", n, [curv(n)[t] for t in range(0, 73, 8)])
    bt(w, "átfedés szerint"); w.screenshot(path=S + "w2-wt-overlap.png")
    def setK(v): pg.evaluate("v => { const s = document.querySelector('.widget[data-widget=weak-ties] input[type=range]'); s.value = v; s.dispatchEvent(new Event('input')); }", v)
    setK(30); print("wt weak k=30:", txt(w.locator(".readout").nth(1)))
    w.screenshot(path=S + "w2-wt-weak30.png")
    bt(w, "az erőseket előbb"); print("wt strong k=30:", txt(w.locator(".readout").nth(1)))
    bt(w, "a kis átfedésűeket előbb"); print("wt overlap k=30:", txt(w.locator(".readout").nth(1)))
    bt(w, "véletlen sorrend"); bt(w, "Új sorsolás"); print("wt random k=30:", txt(w.locator(".readout").nth(1)))
    setK(0); bt(w, "a gyengéket előbb")
    ce(pg, 1, 0); print("wt edge click:", txt(w.locator(".readout").first).split(" | ")[-1])
    w.screenshot(path=S + "w2-wt-karate.png")
    bt(w, "Árvízhét"); print("wt arviz:", txt(w.locator(".readout").first))
    print("  arviz overlaps:", pg.evaluate("window.__views[1].edges.map(e => window.__views[1].nodes[e.a].label + '–' + window.__views[1].nodes[e.b].label + ':' + e.label).join(' ')"))
    w.screenshot(path=S + "w2-wt-arviz.png")
    # ---------- motif-census (views 2, 3)
    m = W(pg, "motif-census"); m.scroll_into_view_if_needed()
    ra = m.locator(".readout")
    def run():
        bt(m, "500 véletlen gráf")
        pg.wait_for_function("document.querySelector('.widget[data-widget=motif-census]').innerText.includes('kész: 500')", timeout=60000)
    for g in ["Árvízhét", "karateklub"]:
        bt(m, g); print("mc", g, ":", txt(ra.first))
        for nm in ["véletlen gráf G(n, m)", "fokszámtartó átkötés"]:
            bt(m, nm); run(); print("   ", nm, ":", txt(ra.nth(1)))
        m.screenshot(path=S + f"w2-mc-{'arviz' if g == 'Árvízhét' else 'karate'}.png")
    print("lesson visible:", m.locator("p", has_text="valamihez képest").is_visible())
    # progress mid-run
    bt(m, "véletlen gráf G(n, m)"); bt(m, "500 véletlen gráf"); pg.wait_for_timeout(30); print("progress:", m.locator("span", has_text="/ 500").first.inner_text())
    bt(m, "csokornyakkendő"); print("mc bowtie:", txt(ra.first))
    bt(m, "sárkány"); print("mc kite:", txt(ra.first))
    bt(m, "(b) Irányított: előrecsatolt hurok")
    rb = m.locator(".readout").nth(2)
    for g in ["lapok átvételei", "+ NY→RH", "kör"]:
        bt(m, g); print("mc dir", g, ":", txt(rb))
    bt(m, "+ NY→RH"); m.locator(".readout").nth(2).locator("button").nth(1).click(); print("mc dir FFL click:", txt(rb))
    print("  red edges:", pg.evaluate("window.__views[3].edges.filter(e => e.color).map(e => window.__views[3].nodes[e.a].label + '>' + window.__views[3].nodes[e.b].label).join(' ')"))
    m.screenshot(path=S + "w2-mc-ffl.png")
    bt(m, "lapok átvételei"); cn(pg, 3, 2); cn(pg, 3, 0)   # NY -> RH kézzel
    print("mc dir edit +NY>RH:", txt(rb).split(" | ")[0])
    cn(pg, 3, 0); cn(pg, 3, 2)   # RH -> NY
    print("mc dir edit +RH>NY:", txt(rb))
    # ---------- arvizhet-week (view 4)
    a = W(pg, "arvizhet-week"); a.scroll_into_view_if_needed()
    def setD(v): pg.evaluate("v => { const s = document.querySelector('.widget[data-widget=arvizhet-week] input[type=range]'); s.value = v; s.dispatchEvent(new Event('input')); }", v)
    for t in range(7):
        setD(t); print("aw", t, ":", txt(a.locator(".readout")), "| hl", pg.evaluate("[...window.__views[4].hl].map(i => window.__views[4].nodes[i].label).join(',')"))
        if t in (2, 3, 6): a.screenshot(path=S + f"w2-aw-{t}.png")
    print("aw table:", tbl(a))
    bt(a, "▶ Lejátszás"); pg.wait_for_timeout(1500); print("playing day:", a.locator("label b").inner_text())
    pg.evaluate("window.scrollTo(0, 0)"); pg.wait_for_timeout(600); print("stopped after scroll:", a.get_by_role("button", name="▶ Lejátszás").count())
    pg.screenshot(path=S + "w2-full-light.png", full_page=True)
    # sötét
    pg.evaluate("document.documentElement.setAttribute('data-theme','dark')"); pg.wait_for_timeout(300)
    bt(d, "karateklub"); d.screenshot(path=S + "w2-da-dark.png")
    w.screenshot(path=S + "w2-wt-dark.png"); m.screenshot(path=S + "w2-mc-dark.png"); a.screenshot(path=S + "w2-aw-dark.png")
    bt(d, "politikai blogok"); d.screenshot(path=S + "w2-da-pb-dark.png")
    pg.evaluate("document.documentElement.setAttribute('data-theme','light')")
    # mobil
    pg.set_viewport_size({"width": 390, "height": 850}); pg.reload(); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(800)
    d = W(pg, "degree-assort"); w = W(pg, "weak-ties"); m = W(pg, "motif-census"); a = W(pg, "arvizhet-week")
    bt(d, "sárkány"); d.screenshot(path=S + "w2-da-mobile.png")
    bt(d, "politikai blogok"); d.screenshot(path=S + "w2-da-mobile-pb.png")
    w.screenshot(path=S + "w2-wt-mobile.png")
    bt(m, "véletlen gráf G(n, m)"); bt(m, "500 véletlen gráf"); pg.wait_for_function("document.querySelector('.widget[data-widget=motif-census]').innerText.includes('kész: 500')", timeout=60000)
    m.screenshot(path=S + "w2-mc-mobile.png")
    bt(m, "(b) Irányított: előrecsatolt hurok"); bt(m, "+ NY→RH"); m.screenshot(path=S + "w2-mc-mobile-b.png")
    setD(3); a.screenshot(path=S + "w2-aw-mobile.png")
    print("overflow:", pg.evaluate("document.documentElement.scrollWidth"))
    print("errors:", errs)
    b.close()
