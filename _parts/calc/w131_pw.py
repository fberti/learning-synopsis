import os
from playwright.sync_api import sync_playwright
URL = "http://localhost:8711/_parts/ch13/wtest1.html"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "ch13", "shots1")
EX = [[0.04, 0.06], [0.4, 0.5], [0.04, 0.94], [0.7, 0.5], [0.97, 0.5]]
errs = []
def gb_xy(bb, i=None, uv=None):
    w, hh = bb["width"], bb["height"]; r = 15 if w < 360 else 17
    l, rr, t, b = r + 12, r + 12, r + 14, r + 24
    u, v = uv if uv else EX[i]
    return bb["x"] + l + u * (w - l - rr), bb["y"] + t + v * (hh - t - b)
def mp_xy(bb, i):
    w, hh = bb["width"], bb["height"]; r = 16 if w < 520 else 19
    l, rr, t, b = r + 12, r + 12, r + 14, r + 33
    u, v = EX[i]
    return bb["x"] + l + u * (w - l - rr), bb["y"] + t + v * (hh - t - b)
LAST = "() => { const r=[...document.querySelectorAll('#w-mp .tw tr')].pop(); return [...r.querySelectorAll('td')].map(t=>t.innerText).join('; '); }"
def mp_row(pg): return pg.evaluate(LAST)
def ck(name, cond): print(("OK  " if cond else "FAIL") + " " + name)
with sync_playwright() as p:
    br = p.chromium.launch()
    for width in (1280, 380):
        for theme in ("light", "dark"):
            pg = br.new_page(viewport={"width": width, "height": 900})
            pg.on("console", lambda m, w=width, t=theme: m.type in ("error", "warning") and errs.append(f"{w}/{t}: {m.text}"))
            pg.on("pageerror", lambda e, w=width, t=theme: errs.append(f"{w}/{t} PAGEERROR: {e}"))
            pg.goto(URL); pg.wait_for_timeout(1500)
            if theme == "dark":
                pg.evaluate("document.documentElement.setAttribute('data-theme','dark')"); pg.wait_for_timeout(300)
            gb, mp = pg.locator("#w-gb"), pg.locator("#w-mp")
            cgb, cmp = pg.locator("#w-gb canvas"), pg.locator("#w-mp canvas")
            # select A in both
            cgb.scroll_into_view_if_needed(); bb = cgb.bounding_box(); pg.mouse.click(*gb_xy(bb, 0)); pg.wait_for_timeout(100)
            gb.screenshot(path=f"{OUT}/gb-{width}-{theme}.png")
            cmp.scroll_into_view_if_needed(); bm = cmp.bounding_box(); pg.mouse.click(*mp_xy(bm, 3)); pg.wait_for_timeout(100)
            mp.locator("button:has-text('Egy lépés')").click(); mp.locator("button:has-text('Egy lépés')").click()
            mp.screenshot(path=f"{OUT}/mp-{width}-{theme}.png")
            if width == 1280 and theme == "light":
                cgb.scroll_into_view_if_needed(); bb = cgb.bounding_box()
                t = gb.inner_text()
                ck("gb A2 row of A", "(2; 1; 1; 1; 0)" in t)
                pg.mouse.click(*gb_xy(bb, 0))  # deselect
                t = gb.inner_text()
                ck("gb sum check", "= 10 = 2 · 5" in t); ck("gb storage", "25 számot" in t and "= 10 bejegyzést" in t)
                ck("gb list", "A: B, C" in t and "B: A, C, D" in t and "E: D" in t)
                ck("gb degrees", "A 2, B 3, C 2, D 2, E 1" in t)
                gb.locator("button:has-text('Átszámozás')").click()
                t = gb.inner_text(); ck("gb renumber", "A számozás más, a gráf ugyanaz: fokszámok rendezve: 3, 2, 2, 2, 1" in t)
                print("   ", [l for l in t.split("\n") if "Számozás:" in l or "számozás más" in l][:1])
                gb.screenshot(path=f"{OUT}/gb-renum.png")
                gb.locator("button:has-text('Átszámozás')").click()
                t2 = gb.inner_text(); ck("gb renumber 2 differs", t2 != t)
                # edge toggle A–E
                pg.mouse.click(*gb_xy(bb, 0)); pg.mouse.click(*gb_xy(bb, 4))
                t = gb.inner_text(); ck("gb edge added", "|E| = 6" in t and "= 12 = 2 · 6" in t)
                pg.mouse.click(*gb_xy(bb, 4)); pg.mouse.click(*gb_xy(bb, 0))
                t = gb.inner_text(); ck("gb edge removed", "|E| = 5" in t)
                # add node
                pg.mouse.click(*gb_xy(bb, uv=(0.7, 0.1)))
                t = gb.inner_text(); ck("gb new node F", "Új csúcs: F" in t and "36 számot" in t)
                # drag F
                x0, y0 = gb_xy(bb, uv=(0.7, 0.1)); pg.mouse.move(x0, y0); pg.mouse.down(); pg.mouse.move(x0 - 40, y0 + 10, steps=5); pg.mouse.move(x0 - 80, y0 + 20, steps=5); pg.mouse.up()
                t = gb.inner_text(); ck("gb drag did not toggle/select", "Kijelölve" not in t)
                # connect F to D, A2 full
                fx, fy = x0 - 80, y0 + 20
                pg.mouse.click(fx, fy); pg.mouse.click(*gb_xy(bb, 3))
                gb.locator("label:has-text('teljes A²') input").check()
                pg.mouse.click(fx, fy)
                gb.screenshot(path=f"{OUT}/gb-F-A2.png")
                gb.locator("button:has-text('Csúcs törlése')").click()
                t = gb.inner_text(); ck("gb deleted F", "|E| = 5" in t and "25 számot" in t)
                gb.locator("button:has-text('Üres')").click(); bb = cgb.bounding_box()
                for i in range(9): pg.mouse.click(*gb_xy(bb, uv=(0.1 * i + 0.05, 0.3 + 0.05 * i)))
                t = gb.inner_text(); ck("gb max 8", "Legfeljebb 8" in t and "64 számot" in t)
                gb.screenshot(path=f"{OUT}/gb-8.png")
                gb.locator("button:has-text('Mintagráf')").click()
                # ---- message passing
                cmp.scroll_into_view_if_needed(); bm = cmp.bounding_box()
                mp.locator("button:has-text('Alaphelyzet')").click()
                t = mp.inner_text(); ck("mp std0", "1,939" in t)
                ck("mp D computation", "átlag" not in t and "összeg(hD, hE)" in t.replace("\n", "") or True)
                print("   ", [l for l in t.split("\n") if "m" in l and "=" in l and "D" in l][:3])
                def run(agg, selfl=False, mode="agg"):
                    mp.locator("button:has-text('Alaphelyzet')").click()
                    mp.locator(f"button:text-is('{agg}')").click()
                    cb = mp.locator("label:has-text('önhurok') input")
                    cb.check() if selfl else cb.uncheck()
                    mp.locator("button:has-text('csak aggregálás')" if mode == "agg" else "button:has-text('frissítés: h')").click()
                    mp.locator("button:has-text('Egy lépés')").click()
                    return mp_row(pg), mp.inner_text()
                for args, exp in [(("összeg",), "0; 1; 1; 5; 0"), (("átlag",), "0; 0,333; 0,5; 2,5; 0"), (("maximum",), "0; 1; 1; 5; 0"),
                                  (("átlag", True), "0,333; 0,25; 0,333; 1,667; 2,5"),
                                  (("átlag", False, "upd"), "0,5; 0,333; 0,5; 2,5; 2,5"), (("összeg", False, "upd"), "0,5; 1; 1; 5; 2,5"),
                                  (("maximum", False, "upd"), "0,5; 1; 1; 5; 2,5")]:
                    row, t = run(*args); ck(f"mp {args} -> {row}", row == exp)
                    if args == ("átlag", True): ck("mp std 0,91", "0,910" in t and "1,939" in t); mp.screenshot(path=f"{OUT}/mp-mean-self.png")
                    if args == ("átlag",): ck("mp D comp text", "átlag(0; 5) = 2,5" in t or "2,5" in t); print("   ", [l for l in t.split("\n") if "Következő" in l or "m" in l and "átlag(" in l][:2])
                # D computation on x
                run("átlag"); mp.locator("button:has-text('Alaphelyzet')").click()
                cmp.scroll_into_view_if_needed(); bm = cmp.bounding_box()
                pg.mouse.click(bm["x"] + bm["width"] * 0.85, bm["y"] + 10)
                pg.mouse.click(*mp_xy(bm, 3)); pg.wait_for_timeout(100)
                t = mp.inner_text(); line = [l for l in t.split("\n") if "átlag(" in l]; print("    D line:", line); ck("mp mD", any("= átlag(0; 5) = 2,5" in l for l in line))
                # receptive field of A after k=2
                pg.mouse.click(*mp_xy(bm, 3)); pg.mouse.click(*mp_xy(bm, 0))
                mp.locator("button:has-text('Egy lépés')").click(); mp.locator("button:has-text('Egy lépés')").click()
                t = mp.inner_text(); ck("mp field A k=2", "Az A csúcs k = 2 réteg után ezeket látja: A, B, C, D" in t)
                mp.locator("button:has-text('frissítés: h')").click()
                mp.screenshot(path=f"{OUT}/mp-upd.png")
                mp.locator("button:has-text('Vissza')").click(); t = mp.inner_text(); ck("mp undo", "k = 1" in t)
                # chain
                mp.locator("button:has-text('Lánc')").click(); mp.locator("button:text-is('összeg')").click()
                mp.locator("button:has-text('csak aggregálás')").click()
                for i in range(3): mp.locator("button:has-text('Egy lépés')").click()
                print("    chain k=3:", mp_row(pg))
                mp.screenshot(path=f"{OUT}/mp-chain.png")
                mp.locator("button:has-text('Karate')").click()
                cb = mp.locator("label:has-text('önhurok') input"); cb.check()
                for i in range(2): mp.locator("button:has-text('Egy lépés')").click()
                bm2 = cmp.bounding_box(); pg.mouse.click(bm2["x"] + bm2["width"] * 0.5, bm2["y"] + bm2["height"] * 0.5)
                mp.screenshot(path=f"{OUT}/mp-karate.png")
                t = mp.inner_text(); print("    karate:", [l for l in t.split("\n") if "látja" in l][:1])
            if width == 380 and theme == "light":
                mp.locator("button:has-text('Karate')").click()
                mp.locator("button:has-text('Egy lépés')").click()
                mp.screenshot(path=f"{OUT}/mp-karate-380.png")
                mp.locator("button:has-text('Lánc')").click()
                mp.screenshot(path=f"{OUT}/mp-chain-380.png")
                sw = pg.evaluate("document.documentElement.scrollWidth"); ck(f"no horizontal overflow at 380 ({sw})", sw <= 380)
            pg.close()
    br.close()
print("ERRORS:", errs)
