"""Böngészős ellenőrzés (11. fejezet, w1 widgetek).
Használat: uv run --with playwright python -I bc11w1.py <port> <kimeneti mappa>"""
import sys, json
from playwright.sync_api import sync_playwright
port, out = sys.argv[1], sys.argv[2]
MINE = ["shift-lab", "convolution-lab", "pooling-viz", "receptive-field"]
URL = f"http://localhost:{port}/_parts/ch11/wtest1.html"
fails = []


def W(pg, name):
    return pg.query_selector(f'.widget[data-widget="{name}"]')


def txt(pg, name, sel=".readout", i=0):
    return pg.eval_on_selector_all(f'.widget[data-widget="{name}"] {sel}', f"es => es[{i}].innerText")


def click(pg, name, text, exact=False):
    w = W(pg, name)
    sel = f'button.btn >> text="{text}"' if exact else f'button:has-text("{text}")'
    w.query_selector(sel).click()
    pg.wait_for_timeout(60)


def expect(cond, msg):
    print(("  ok   " if cond else "  FAIL ") + msg)
    if not cond: fails.append(msg)


def canvas_click(pg, name, idx, fx, fy, hover=False):
    """kattintás/egérmozgatás a widget idx. canvasán, a canvas méretének fx, fy hányadánál"""
    c = W(pg, name).query_selector_all("canvas")[idx]
    b = c.bounding_box()
    x, y = b["x"] + fx * b["width"], b["y"] + fy * b["height"]
    pg.mouse.move(x, y)
    if not hover: pg.mouse.down(); pg.mouse.up()
    pg.wait_for_timeout(60)


with sync_playwright() as p:
    b = p.chromium.launch()
    for width in (1280, 400):
        pg = b.new_page(viewport={"width": width, "height": 900})
        errs = []
        pg.on("console", lambda m: m.type in ("error", "warning") and errs.append(f"{m.type}: {m.text}"))
        pg.on("pageerror", lambda e: errs.append(f"pageerror: {e}"))
        pg.goto(URL, wait_until="networkidle")
        pg.wait_for_timeout(1200)
        info = pg.evaluate("""(mine) => mine.map(n => { const w = document.querySelector(`.widget[data-widget="${n}"]`);
            return { n, canvases: w.querySelectorAll('canvas').length, cw: [...w.querySelectorAll('canvas')].map(c => c.clientWidth),
                     ww: w.clientWidth, sw: w.scrollWidth, err: /Hiba/.test(w.innerText) }; })""", MINE)
        print(f"=== width {width}")
        print(json.dumps(info, ensure_ascii=False))
        for i in info:
            expect(i["sw"] <= i["ww"] and not i["err"], f"{i['n']} no overflow / error at {width}")
        expect(pg.evaluate("document.documentElement.scrollWidth <= innerWidth"), f"page no horizontal overflow at {width}")
        # shift-lab
        n = "shift-lab"
        t = txt(pg, n); print("SL default:", t)
        expect("eltolás: (0; 0) · jóslat: 3 (100%)" in t or "jóslat: 3 (100" in t, "SL centered predicts 3")
        click(pg, n, "→", exact=True); t = txt(pg, n); print("SL dx=1:", t)
        expect("eltolás: (1; 0) · jóslat: 9 (99,4%) · valódi címke: 3" in t and "helyes: 201 (44,7%)" in t, "SL dx=1 numbers")
        click(pg, n, "↓", exact=True); t = txt(pg, n); print("SL (1;1):", t)
        click(pg, n, "Középre"); click(pg, n, "Következő"); print("SL next:", txt(pg, n))
        click(pg, n, "Másik kép"); print("SL random:", txt(pg, n))
        canvas_click(pg, n, 1, 0.5, 0.85); print("SL heat click:", txt(pg, n))
        for _ in range(4): click(pg, n, "←", exact=True)
        expect(W(pg, n).query_selector('button.btn >> text="←"').is_disabled(), "SL left disabled at -4")
        # convolution-lab
        n = "convolution-lab"
        t = txt(pg, n); print("CL default:", t)
        expect("y[0;0] = (−1)·1 + 0·1 + 1·1 + (−1)·0 + 0·0 + 1·1 + (−1)·0 + 0·0 + 1·1 = 2" in t, "CL y[0;0] sum")
        expect("⌊(5 + 0 − 3)/1⌋ + 1 = 3" in t, "CL size formula")
        outs = pg.evaluate("""() => { const H = window.__W11; const r = H.conv1(Float32Array.from([1,1,1,1,1,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0]),5,5,[-1,0,1,-1,0,1,-1,0,1],3,0,1); return Array.from(r.out); }""")
        expect(outs == [2, 0, -2, 3, 0, -3, 3, 0, -3], f"CL vertical {outs}")
        canvas_click(pg, n, 1, 0.5, 0.5, hover=True); print("CL hover centre:", txt(pg, n).split("\n")[0])
        click(pg, n, "vízszintes él"); t = txt(pg, n); print("CL horz:", t.split("\n")[0])
        click(pg, n, "Sobel"); click(pg, n, "elmosás"); print("CL blur:", txt(pg, n).split("\n")[0])
        click(pg, n, "p = 1"); print("CL p1:", txt(pg, n).split("\n")[1])
        click(pg, n, "s = 2"); print("CL p1 s2:", txt(pg, n).split("\n")[1])
        click(pg, n, "élesítés"); pg.query_selector('.widget[data-widget="convolution-lab"] input[type=checkbox]').click(); pg.wait_for_timeout(60)
        print("CL sharp relu:", txt(pg, n).split("\n")[0])
        click(pg, n, "számjegy"); print("CL digit:", txt(pg, n).split("\n")[0:2])
        W(pg, n).screenshot(path=f"{out}/w1-cl-digit-{width}.png")
        canvas_click(pg, n, 0, 0.5, 0.5); print("CL paint:", txt(pg, n).split("\n")[0])
        click(pg, n, "üres"); click(pg, n, "átló"); click(pg, n, "identitás")
        inp = W(pg, n).query_selector_all("input[type=text]")[4]
        inp.fill("abc"); pg.wait_for_timeout(60); print("CL bad:", txt(pg, n))
        inp.fill("2,5"); pg.wait_for_timeout(60); print("CL 2,5:", txt(pg, n).split("\n")[0])
        click(pg, n, "p = 0"); click(pg, n, "s = 1"); pg.query_selector('.widget[data-widget="convolution-lab"] input[type=checkbox]').click()
        click(pg, n, "T betű"); click(pg, n, "függőleges él")
        t = txt(pg, n); expect("= 2" in t.split("\n")[0], "CL reset default")
        click(pg, n, "vízszintes él")
        hz = pg.evaluate("""() => { const H = window.__W11; return Array.from(H.conv1(Float32Array.from([1,1,1,1,1,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0]),5,5,[1,1,1,0,0,0,-1,-1,-1],3,0,1).out); }""")
        expect(hz == [2, 2, 2, 0, 0, 0, 0, 0, 0], f"CL horizontal {hz}")
        W(pg, n).screenshot(path=f"{out}/w1-cl-horz-{width}.png")
        click(pg, n, "függőleges él")
        # pooling
        n = "pooling-viz"
        t = txt(pg, n); print("PV A:", t)
        expect("max(1; 3; 5; 0) = 5" in t and "max(4; 0; 0; 7) = 7" in t and "max(0; 2; 1; 1) = 2" in t, "PV max")
        click(pg, n, "átlag", exact=True); t = txt(pg, n); print("PV avg:", t)
        expect("(1 + 3 + 5 + 0)/4 = 2,25" in t and "(4 + 0 + 0 + 7)/4 = 2,75" in t and "= 1" in t, "PV avg")
        click(pg, n, "Véletlen"); print("PV rnd:", txt(pg, n).split("\n")[0])
        W(pg, n).query_selector_all("button.btn")[3].click()
        click(pg, n, "max", exact=True)
        t = txt(pg, n, i=1); print("PV B0:", t)
        bb = W(pg, n).query_selector_all('button.btn >> text="→"')[0]
        bb.click(); pg.wait_for_timeout(60); t = txt(pg, n, i=1); print("PV B right1:", t)
        expect("ugyanabban a 2×2-es ablakban maradt" in t and "mindig ugyanaz: 9" in t, "PV B same window")
        bb.click(); pg.wait_for_timeout(60); t = txt(pg, n, i=1); print("PV B right2:", t)
        expect("átlépett a szomszéd ablakba" in t, "PV B crossed")
        W(pg, n).query_selector('button.btn >> text="↓"').click(); pg.wait_for_timeout(60); print("PV B down:", txt(pg, n, i=1).split("\n")[1])
        # receptive field
        n = "receptive-field"
        print("RF default:", txt(pg, n), "\n", txt(pg, n, "table"))
        exp = {"egy 3×3": [3], "két 3×3": [3, 5], "három 3×3": [3, 5, 7], "a mi CNN": [3, 4, 8], "VGG eleje": [3, 5, 6, 10, 14, 16], "5×5": [5]}
        for k, v in exp.items():
            click(pg, n, k)
            tb = txt(pg, n, "table")
            rs = [int(line.split("\t")[4]) for line in tb.split("\n")[2:] if line.strip() and "\t" in line]
            expect(rs == v, f"RF {k}: {rs}")
            if k == "VGG eleje":
                print("RF VGG:", txt(pg, n)); W(pg, n).screenshot(path=f"{out}/w1-rf-vgg-{width}.png")
        click(pg, n, "két 3×3")
        hh = W(pg, n).query_selector("canvas").bounding_box()["height"]
        canvas_click(pg, n, 0, 0.03, 44 / hh); t = txt(pg, n); print("RF edge click:", t.split("\n")[0])
        expect("2. réteg, 1. cella" in t and "1–3. cellájától" in t, "RF edge click clipped")
        click(pg, n, "a mi CNN"); click(pg, n, "+ 3×3 konv, s = 2"); click(pg, n, "+ 2×2 pool"); click(pg, n, "+ 5×5"); click(pg, n, "+ 2×2 pool")
        print("RF built:", txt(pg, n, "table"))
        expect(W(pg, n).query_selector('button:has-text("+ 3×3 konv")').is_disabled(), "RF max 7 layers")
        click(pg, n, "− utolsó"); print("RF after pop:", txt(pg, n).split("\n")[1])
        click(pg, n, "két 3×3")
        print("console:", *errs[:30], sep="\n  ")
        expect(not errs, f"no console errors at {width}")
        # visszaállítás és képek
        pg.goto(URL, wait_until="networkidle"); pg.wait_for_timeout(900)
        click(pg, "shift-lab", "→", exact=True)
        click(pg, "receptive-field", "a mi CNN")
        for theme in ("light", "dark"):
            pg.evaluate(f"document.documentElement.setAttribute('data-theme','{theme}')")
            pg.wait_for_timeout(300)
            canvas_click(pg, "convolution-lab", 1, 0.62, 0.5, hover=True)
            for name in MINE:
                w = W(pg, name)
                w.scroll_into_view_if_needed(); pg.wait_for_timeout(100)
                if name == "convolution-lab":
                    canvas_click(pg, name, 1, 0.62, 0.5, hover=True)
                w.screenshot(path=f"{out}/w1-{name}-{theme}-{width}.png")
        pg.close()
    b.close()
print("FAILS:", fails)
