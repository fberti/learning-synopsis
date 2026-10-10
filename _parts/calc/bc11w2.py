"""Böngészős ellenőrzés a 11. fejezet 5–8. widgetjéhez (w2.js: cnn-shapes, iou-viz, vit-patches, digit-cnn).
Használat: uv run --with playwright python -I bc11w2.py <port> <kimeneti mappa>"""
import sys, json
from playwright.sync_api import sync_playwright
port, out = sys.argv[1], sys.argv[2]
NAMES = ["cnn-shapes", "iou-viz", "vit-patches", "digit-cnn"]
fails = []
def check(cond, msg):
    print(("OK  " if cond else "FAIL") + " " + msg)
    if not cond: fails.append(msg)

with sync_playwright() as p:
    b = p.chromium.launch()
    for width in (1280, 400):
        pg = b.new_page(viewport={"width": width, "height": 900})
        errs = []
        pg.on("console", lambda m: m.type in ("error", "warning") and errs.append(f"{m.type}: {m.text}"))
        pg.on("pageerror", lambda e: errs.append(f"pageerror: {e}"))
        pg.goto(f"http://localhost:{port}/_parts/ch11/wtest2.html", wait_until="networkidle")
        pg.wait_for_timeout(1200)
        W = lambda n: pg.query_selector(f'.widget[data-widget="{n}"]')
        ro = lambda n: W(n).query_selector(".readout").inner_text().replace(" ", " ")
        def click(n, text, wait=80):
            w = W(n); w.scroll_into_view_if_needed()
            w.query_selector(f'button:has-text("{text}")').click(); pg.wait_for_timeout(wait)
        info = pg.evaluate("""(names) => names.map(n => { const w = document.querySelector(`.widget[data-widget="${n}"]`);
          return { n, canvases: w.querySelectorAll('canvas').length, err: /Hiba/.test(w.innerText), sw: w.scrollWidth, cw: w.clientWidth,
                   katexErr: w.querySelectorAll('.katex-error').length, raw: /\\$[^$]+\\$/.test(w.querySelector('.w-sub').innerText) }; })""", NAMES)
        print(f"===== width {width}:", json.dumps(info, ensure_ascii=False))
        for i in info:
            check(not i["err"] and i["sw"] <= i["cw"] and not i["katexErr"] and not i["raw"], f"{width} {i['n']} load/overflow/katex")
        dw = pg.evaluate("() => [document.documentElement.scrollWidth, innerWidth]")
        check(dw[0] <= dw[1], f"{width} page no horizontal overflow {dw}")
        for theme in ("light", "dark"):
            pg.evaluate(f"document.documentElement.dataset.theme = '{theme}'"); pg.wait_for_timeout(300)
            for n in NAMES:
                W(n).scroll_into_view_if_needed(); pg.wait_for_timeout(100)
                W(n).screenshot(path=f"{out}/w2-{n}-{theme}-{width}.png")
        pg.evaluate("document.documentElement.dataset.theme = 'light'"); pg.wait_for_timeout(200)
        if width == 1280:
            # ---- cnn-shapes
            t = ro("cnn-shapes"); print("cnn-shapes default |", t.replace("\n", " | "))
            check("2 746" in t and "4 282" in t, "ours 2 746 / MLP 4 282")
            check("⌊(16 + 2 − 3)/1⌋ + 1 = 16" in t and "8·(3·3·1 + 1) = 80" in t, "ours row 1 calc")
            for nm, tot in (("LeNet-5", "61 706"), ("AlexNet", "62 378 344"), ("VGG-16", "138 357 544")):
                click("cnn-shapes", nm); t = ro("cnn-shapes"); print(nm, "|", t.replace("\n", " | "))
                check(tot in t, f"{nm} total {tot}")
            click("cnn-shapes", "AlexNet"); t = ro("cnn-shapes")
            check("⌊(227 + 0 − 11)/4⌋ + 1 = 55" in t and "(94%)" in t, "AlexNet 227 → 55, FC 94%")
            tbl = W("cnn-shapes").query_selector("table").inner_text().replace(" ", " ")
            for s in ("34 944", "614 656", "885 120", "1 327 488", "884 992", "37 752 832", "16 781 312", "4 097 000", "13×13×256", "6×6×256"):
                check(s in tbl, f"AlexNet table has {s}")
            click("cnn-shapes", "224"); t = ro("cnn-shapes"); print("Alex 224 |", t.replace("\n", " | "))
            check("54,25" in t and "⌊53,25⌋ + 1 = 54" in t, "AlexNet 224 → 54,25 warning")
            W("cnn-shapes").screenshot(path=f"{out}/w2-cnn-shapes-alex224-{width}.png")
            # hover the FC row
            click("cnn-shapes", "227"); rows = W("cnn-shapes").query_selector_all("tbody tr"); rows[9].hover(); pg.wait_for_timeout(100)
            check("37 752 832" in ro("cnn-shapes").split("\n")[0], "hover FC row calc")
            t = ro("cnn-shapes"); print("hover FC |", t.replace("\n", " | ").split(" | ")[0])
            click("cnn-shapes", "VGG-16"); t = ro("cnn-shapes")
            check("89,4%" in t, "VGG FC share 89,4%")
            tbl = W("cnn-shapes").query_selector("table").inner_text().replace(" ", " ")
            check("102 764 544" in tbl and "7×7×512" in tbl, "VGG table FC1 102 764 544, 7×7×512")
            # ---- iou-viz
            t = ro("iou-viz"); print("iou default |", t.replace("\n", " | "))
            check("metszet: 3 × 4 = 12 · unió: 16 + 16 − 12 = 20 · IoU = 12/20 = 0,6 · Dice = 2·12/(16 + 16) = 0,75 · küszöb 0,5 → ✅ találat" in t, "iou default verbatim")
            click("iou-viz", "1. példa"); t = ro("iou-viz"); print("iou ex1 |", t.replace("\n", " | "))
            check("metszet: 2 × 2 = 4" in t and "unió: 16 + 16 − 4 = 28" in t and "0,143" in t and "❌" in t, "iou ex1")
            click("iou-viz", "Pontos találat"); t = ro("iou-viz"); check("IoU = 16/16 = 1 " in t, "iou exact")
            click("iou-viz", "Nincs átfedés"); t = ro("iou-viz"); check("IoU = 0/" in t and "❌" in t, "iou none")
            click("iou-viz", "2. példa"); click("iou-viz", "0,75"); t = ro("iou-viz"); check("küszöb 0,75 → ❌" in t, "iou thr 0,75")
            click("iou-viz", "0,5")
            # drag B body by 1 cell to the right (→ (3;1)–(7;5), metszet 2×4 = 8, IoU 8/24)
            cv = W("iou-viz").query_selector("canvas"); bb = cv.bounding_box()
            s = (min(bb["width"] - 36, bb["height"] - 34)) / 10
            def g2p(gx, gy): return bb["x"] + 26 + gx * s, bb["y"] + 24 + gy * s
            x0, y0 = g2p(5.5, 3.5); x1, y1 = g2p(6.5, 3.5)
            pg.mouse.move(x0, y0); pg.mouse.down(); pg.mouse.move((x0 + x1) / 2, y1, steps=3); pg.mouse.move(x1, y1, steps=3); pg.mouse.up(); pg.wait_for_timeout(100)
            t = ro("iou-viz"); print("iou drag |", t.replace("\n", " | "))
            check("(3; 1)–(7; 5)" in t and "IoU = 8/24" in t, "iou body drag")
            # resize A's bottom-right corner (5;5) → (7;7)
            x0, y0 = g2p(5, 5); x1, y1 = g2p(7, 7)
            pg.mouse.move(x0, y0); pg.mouse.down(); pg.mouse.move(x1, y1, steps=5); pg.mouse.up(); pg.wait_for_timeout(100)
            t = ro("iou-viz"); print("iou corner |", t.replace("\n", " | "))
            check("valódi A: (1; 1)–(7; 7)" in t, "iou corner resize A")
            W("iou-viz").screenshot(path=f"{out}/w2-iou-viz-dragged-{width}.png")
            # touch drag via pointer events (dispatch)
            click("iou-viz", "2. példa")
            # ---- vit-patches
            t = ro("vit-patches"); print("vit default |", t.replace("\n", " | "))
            check("foltméret P = 4 → 16/4 = 4 → 4 × 4 = 16 folt · foltonként 4 · 4 · 1 = 16 szám · tokenek a [CLS]-sel: 17 · figyelmi párok: 17² = 289" in t, "vit board P=4 verbatim")
            check("196 folt" in t and "768 szám" in t and "197" in t and "38 809" in t and "590 592" in t, "vit real P=16")
            for P, exp in (("2", ["64 folt", "65² = 4 225"]), ("8", ["4 folt", "5² = 25"])):
                click("vit-patches", f"P = {P}"); t = ro("vit-patches"); check(all(e in t for e in exp), f"vit P={P} {exp}")
                W("vit-patches").screenshot(path=f"{out}/w2-vit-P{P}-{width}.png")
            click("vit-patches", "P = 4")
            for P, exp in (("8", ["784 folt", "785", "616 225"]), ("32", ["49 folt"]), ("14", ["256 folt"])):
                btns = [x for x in W("vit-patches").query_selector_all(".controls")[1].query_selector_all("button") if x.inner_text() == f"P = {P}"]
                btns[0].click(); pg.wait_for_timeout(80); t = ro("vit-patches"); print(f"ViT P={P} |", t.split("\n")[1])
                check(all(e in t for e in exp), f"vit real P={P} {exp}")
            click("vit-patches", "Másik kép")
            # ---- digit-cnn
            t = ro("digit-cnn"); print("digit default |", t.replace("\n", " | "))
            check("háló: CNN-A · eltolás (0; 0)" in t and "445 (98,9%)" in t and "2 746" in t, "digit default")
            exp = {"MLP (256–16–10)": [436, 201, 41, 53], "CNN-A (pooling nélkül)": [445, 445, 445, 445], "CNN-B (2×2 pooling)": [443, 359, 271, 443], "CNN-B + eltolásos bővítés": [443, 442, 439, 443]}
            for nm, vals in exp.items():
                click("digit-cnn", nm, 150); got = []
                for s_ in ([], ["→"], ["→", "↓"], ["→", "→"]):
                    click("digit-cnn", "Középre")
                    for a in s_: click("digit-cnn", a)
                    t = ro("digit-cnn"); got.append(int(t.split("(450 tesztkép): ")[1].split(" ")[0]))
                print(nm, got, "|", t.replace("\n", " | "))
                check(got == vals, f"digit grid {nm} {got} == {vals}")
                if nm.startswith("MLP"): check("4 282" in t, "MLP params 4 282")
            click("digit-cnn", "CNN-B (2×2 pooling)"); click("digit-cnn", "Középre"); click("digit-cnn", "→", 150)
            t = ro("digit-cnn"); print("CNN-B (1;0) default img |", t)
            W("digit-cnn").screenshot(path=f"{out}/w2-digit-cnn-B-shift-{width}.png")
            click("digit-cnn", "Egy tévesztés"); pg.wait_for_timeout(100); pg.wait_for_function("() => !/keresés/.test(document.querySelector('.widget[data-widget=\"digit-cnn\"]').innerText)", timeout=30000)
            t = ro("digit-cnn"); print("tévesztés |", t.replace("\n", " | "))
            line = t.split("\n")[0]; pred = line.split("jóslat: ")[1].split(" ")[0]; true_ = line.split("valódi: ")[1].split(" ")[0]
            check(pred != true_, f"tévesztés found pred {pred} != true {true_}")
            click("digit-cnn", "Egy tévesztés", 200); t2 = ro("digit-cnn"); print("tévesztés 2 |", t2.split("\n")[0])
            click("digit-cnn", "MLP (256–16–10)", 150); W("digit-cnn").screenshot(path=f"{out}/w2-digit-cnn-mlp-{width}.png")
            # heatmap click: top-left cell → (−4; −4)
            cvs = W("digit-cnn").query_selector_all("canvas"); hg = cvs[-1]; bb = hg.bounding_box()
            s = min(bb["width"] - 28, bb["height"] - 54) / 9
            hg.click(position={"x": 24 + 8.5 * s, "y": 50 + 4.5 * s}); pg.wait_for_timeout(100)
            t = ro("digit-cnn"); check("eltolás (4; 0)" in t, "heatmap click → (4; 0)")
            # drawing
            click("digit-cnn", "CNN-A (pooling nélkül)"); click("digit-cnn", "Középre"); click("digit-cnn", "Törlés")
            pad = cvs[0]; bb = pad.bounding_box(); cx, cy, r = bb["x"] + bb["width"] / 2, bb["y"] + bb["height"] / 2, bb["width"] * 0.3
            pg.mouse.move(cx - r * 0.1, cy - r); pg.mouse.down()
            pg.mouse.move(cx - r * 0.1, cy + r, steps=12); pg.mouse.up(); pg.wait_for_timeout(200)
            t = ro("digit-cnn"); print("drawn '1' |", t.replace("\n", " | "))
            check("saját rajz" in t, "drawing mode readout")
            for a in ("←", "←", "←"): click("digit-cnn", a)
            t = ro("digit-cnn"); print("drawn '1' shifted (−3;0) |", t.split("\n")[0])
            W("digit-cnn").screenshot(path=f"{out}/w2-digit-cnn-drawn-{width}.png")
            click("digit-cnn", "CNN-B (2×2 pooling)", 150); W("digit-cnn").screenshot(path=f"{out}/w2-digit-cnn-drawn-B-{width}.png")
            pg.evaluate("document.documentElement.dataset.theme = 'dark'"); pg.wait_for_timeout(300)
            W("digit-cnn").screenshot(path=f"{out}/w2-digit-cnn-drawn-B-dark-{width}.png")
            pg.evaluate("document.documentElement.dataset.theme = 'light'")
        else:
            click("digit-cnn", "CNN-B (2×2 pooling)", 150)
            W("digit-cnn").screenshot(path=f"{out}/w2-digit-cnn-B-{width}.png")
            click("cnn-shapes", "VGG-16"); W("cnn-shapes").screenshot(path=f"{out}/w2-cnn-shapes-vgg-{width}.png")
            click("vit-patches", "P = 2"); W("vit-patches").screenshot(path=f"{out}/w2-vit-P2-{width}.png")
            info = pg.evaluate("""(names) => names.map(n => { const w = document.querySelector(`.widget[data-widget="${n}"]`); return [n, w.scrollWidth, w.clientWidth]; })""", NAMES)
            print("after interactions:", info)
            for n, sw, cw in info: check(sw <= cw, f"400 {n} no overflow after interactions")
        check(not errs, f"{width} console clean")
        print("console:", *errs[:30], sep="\n  ")
        pg.close()
    b.close()
print("FAILS:", len(fails), *fails, sep="\n  ")
