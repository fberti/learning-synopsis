import sys, re
from playwright.sync_api import sync_playwright
port = sys.argv[1]
mode = sys.argv[2] if len(sys.argv) > 2 else "all"
url = f"http://localhost:{port}/_parts/gh7/wtest2.html"
S = "_parts/gh7/shots/"
def W(pg, name): return pg.locator(f".widget[data-widget={name}]")
def txt(l): return l.evaluate("e => { const c = e.cloneNode(true); c.querySelectorAll('.katex-mathml').forEach(x => x.remove()); return c.innerText; }").replace("\n", " | ")
def bt(w, name): w.get_by_role("button", name=name, exact=True).click()
def setR(pg, wname, v, idx=0):
    pg.evaluate("([w, v, i]) => { const s = document.querySelectorAll(`.widget[data-widget=${w}] input[type=range]`)[i]; s.value = v; s.dispatchEvent(new Event('input')); }", [wname, v, idx])
def tbl(w): return " / ".join(r.replace("\t", " ") for r in w.locator("table tr").all_inner_texts())
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": 1000, "height": 900})
    errs = []
    pg.on("console", lambda m: errs.append(m.type + ": " + m.text) if m.type in ("error", "warning") else None)
    pg.on("pageerror", lambda e: errs.append("PAGEERROR " + str(e)))
    pg.goto(url); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(800)
    if mode in ("all", "er"):
        e = W(pg, "er-giant"); ro = e.locator(".readout")
        for k in [0.5, 1, 1.5, 2, 3, 4]:
            setR(pg, "er-giant", k); print("er", k, ":", txt(ro))
        setR(pg, "er-giant", 0.5); pg.wait_for_timeout(1500); e.screenshot(path=S + "w2-er-05.png")
        setR(pg, "er-giant", 1); pg.wait_for_timeout(1500); e.screenshot(path=S + "w2-er-1.png")
        setR(pg, "er-giant", 2); pg.wait_for_timeout(2500); e.screenshot(path=S + "w2-er-2.png")
        # kattintás a görbére
        sv = e.locator("svg"); bb = sv.bounding_box(); pg.mouse.click(bb["x"] + bb["width"] * (40 + 3 / 5 * 546) / 600, bb["y"] + bb["height"] / 2)
        print("er click at k~3:", e.locator("label b").inner_text())
        if mode == "er":
            acc = {1: [], 1.5: [], 2: [], 3: []}
            for s in range(30):
                bt(e, "Új sorsolás")
                for k in acc:
                    setR(pg, "er-giant", k); m = re.search(r"legnagyobb komponens: (\d+)", txt(ro)); acc[k].append(int(m.group(1)) / 200)
            print("er avg 30 seeds n=200:", {k: round(sum(v) / len(v), 3) for k, v in acc.items()})
    if mode in ("all", "ws"):
        w = W(pg, "watts-strogatz"); w.scroll_into_view_if_needed()
        ri = w.locator(".readout")
        print("ws p=0:", txt(ri.first))
        pg.wait_for_function("document.querySelector('.widget[data-widget=watts-strogatz]').innerText.includes('sorsolás átlaga')", timeout=120000)
        w.locator("details summary").click()
        print("ws table:", tbl(w))
        for i in [11, 21, 26, 31, 41]:
            setR(pg, "watts-strogatz", i); print("ws", i, ":", txt(ri.first), "||", txt(ri.nth(1)))
            if i in (21, 31): w.screenshot(path=S + f"w2-ws-{i}.png")
        mono = []
        for i in range(42): setR(pg, "watts-strogatz", i); mono.append(int(re.search(r"átkötött élek: (\d+)", txt(ri.first)).group(1)))
        print("ws rewired by slider:", mono)
    if mode in ("all", "ba"):
        a = W(pg, "ba-growth"); a.scroll_into_view_if_needed(); ra = a.locator(".readout")
        print("ba start:", txt(ra)); a.screenshot(path=S + "w2-ba-0.png")
        bt(a, "Lépés"); print("ba step1:", txt(ra)); a.screenshot(path=S + "w2-ba-1.png")
        for _ in range(4): bt(a, "Lépés")
        print("ba step5:", txt(ra)); a.screenshot(path=S + "w2-ba-5.png")
        bt(a, "▶ Lejátszás"); pg.wait_for_timeout(1500); bt(a, "⏸ Szünet"); print("ba after play:", txt(ra).split(" | ")[0])
        bt(a, "Ugrás 200-ig"); pg.wait_for_timeout(1500); print("ba 200:", txt(ra)); a.screenshot(path=S + "w2-ba-200.png")
        bt(a, "m = 2"); bt(a, "1000 csúcsig"); print("ba m2 1000:", txt(ra)); a.screenshot(path=S + "w2-ba-1000.png")
        mx, mg = [], []
        for s in range(20):
            bt(a, "Újra"); bt(a, "1000 csúcsig"); t = txt(ra)
            mx.append(int(re.search(r"max k = (\d+)", t).group(1))); mg.append(int(re.search(r"G\(n,m\): max k = (\d+)", t.replace(" ", "")).group(1)) if False else int(re.findall(r"max k = (\d+)", t)[1]))
        print("ba max deg 20 runs: mean", sum(mx) / 20, "range", min(mx), max(mx), "| G(n,m) mean", sum(mg) / 20)
        bt(a, "egyenletes"); bt(a, "1000 csúcsig"); print("ba unif 1000:", txt(ra)); a.screenshot(path=S + "w2-ba-unif.png")
        bt(a, "m = 1"); bt(a, "preferenciális"); bt(a, "Lépés"); bt(a, "Lépés"); print("ba m1 2 steps:", txt(ra))
    if mode in ("all", "dt"):
        d = W(pg, "degree-tail"); d.scroll_into_view_if_needed(); rd = d.locator(".readout")
        for ds in ["politikai blogok", "karateklub", "Barabási–Albert", "Erdős–Rényi"]:
            bt(d, ds); print("dt", ds, ":", txt(rd), "||", tbl(d))
            for km in ({"politikai blogok": [1, 10, 20, 29, 50, 100], "karateklub": [3], "Barabási–Albert": [3, 10], "Erdős–Rényi": [20]}[ds]):
                i = pg.evaluate("k => { const s = document.querySelector('.widget[data-widget=degree-tail] input[type=range]'); for (let i = 0; i <= +s.max; i++) { s.value = i; s.dispatchEvent(new Event('input')); if (+document.querySelector('.widget[data-widget=degree-tail] label b').textContent >= k) return +document.querySelector('.widget[data-widget=degree-tail] label b').textContent; } return -1; }", km)
                print("   kmin", km, "->", i, ":", tbl(d).split(" / ")[-1], "| ccdf tail:", tbl(d).split(" / ")[-2])
            d.screenshot(path=S + f"w2-dt-{ds[:2]}.png")
        bt(d, "politikai blogok")
        for v in ["(a) nyers hisztogram", "(b) logaritmikus binek"]:
            bt(d, v); d.screenshot(path=S + f"w2-dt-pb-{v[1]}.png")
        bt(d, "(c) CCDF")
    if mode == "all":
        pg.screenshot(path=S + "w2-full-light.png", full_page=True)
        pg.evaluate("document.documentElement.setAttribute('data-theme','dark')"); pg.wait_for_timeout(300)
        for nm in ["er-giant", "watts-strogatz", "ba-growth", "degree-tail"]: W(pg, nm).screenshot(path=S + f"w2-{nm}-dark.png")
        pg.evaluate("document.documentElement.setAttribute('data-theme','light')")
        pg.set_viewport_size({"width": 390, "height": 850}); pg.reload(); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(800)
        setR(pg, "er-giant", 1.5); pg.wait_for_timeout(2000); W(pg, "er-giant").screenshot(path=S + "w2-er-mobile.png")
        W(pg, "watts-strogatz").scroll_into_view_if_needed(); setR(pg, "watts-strogatz", 21); pg.wait_for_timeout(4000); W(pg, "watts-strogatz").screenshot(path=S + "w2-ws-mobile.png")
        a = W(pg, "ba-growth"); a.scroll_into_view_if_needed(); bt(a, "Lépés"); bt(a, "Lépés"); a.screenshot(path=S + "w2-ba-mobile.png")
        bt(a, "Ugrás 200-ig"); pg.wait_for_timeout(1000); a.screenshot(path=S + "w2-ba-mobile-200.png")
        W(pg, "degree-tail").screenshot(path=S + "w2-dt-mobile.png")
        print("overflow:", pg.evaluate("document.documentElement.scrollWidth"))
    print("errors:", errs)
    b.close()
