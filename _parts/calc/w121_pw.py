import sys, os
from playwright.sync_api import sync_playwright
URL = "http://localhost:8731/_parts/ch12/wtest1.html"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "ch12", "shots1")
errs = []
def txt(page, sel): return page.locator(sel).inner_text()
with sync_playwright() as p:
    b = p.chromium.launch()
    for width in (1280, 380):
        for theme in ("light", "dark"):
            pg = b.new_page(viewport={"width": width, "height": 900})
            pg.on("console", lambda m: m.type in ("error", "warning") and errs.append(f"{width}/{theme}: {m.text}"))
            pg.on("pageerror", lambda e: errs.append(f"{width}/{theme} PAGEERROR: {e}"))
            pg.goto(URL); pg.wait_for_timeout(1500)
            if theme == "dark":
                pg.evaluate("document.documentElement.setAttribute('data-theme','dark')"); pg.wait_for_timeout(400)
            for wid in ("w-tfidf", "w-emb", "w-rnn", "w-soft"):
                pg.locator("#" + wid).screenshot(path=f"{OUT}/{wid}-{width}-{theme}.png")
            if width == 1280 and theme == "light":
                # ---- tfidf
                t = txt(pg, "#w-tfidf")
                print("TFIDF count:", "0,894" in t, "0,500" in t)
                pg.locator("#w-tfidf button:has-text('TF-IDF')").click()
                t = txt(pg, "#w-tfidf")
                print("TFIDF tfidf:", all(s in t for s in ["0,288", "0,693", "1,386", "0,502"]), "idf=0 msg:", "ln(4/4)" in t)
                pg.locator("#w-tfidf label:has-text('scikit') input").check()
                t = txt(pg, "#w-tfidf")
                print("TFIDF sk:", all(s in t for s in ["1,223", "1,511", "1,916"]))
                pg.locator("#w-tfidf label:has-text('scikit') input").uncheck()
                pg.locator("#w-tfidf button:has-text('szózsák')").click()
                pg.locator("#w-tfidf button:has-text('ugyanazok')").click()
                t = txt(pg, "#w-tfidf"); print("same no-bi cos=1 msg:", "mégis cos = 1" in t)
                pg.locator("#w-tfidf label:has-text('szópárok') input").check()
                t = txt(pg, "#w-tfidf"); print("same bi:", "0,913" in t, "film·jó" in t or "jó·volt" in t)
                pg.locator("#w-tfidf").screenshot(path=f"{OUT}/w-tfidf-same-bi.png")
                pg.locator("#w-tfidf button:has-text('TF-IDF')").click()
                pg.locator("#w-tfidf").screenshot(path=f"{OUT}/w-tfidf-same-bi-tfidf.png")
                # ---- embedding
                t = txt(pg, "#w-emb")
                print("EMB default:", "queen" in t, "0,922" in t)
                for pair, v in [("cat–car", "0,364"), ("good–bad", "0,796"), ("bank–river", "0,414"), ("bank–money", "0,636"), ("cat–dog", "0,922")]:
                    pg.locator(f"#w-emb button:has-text('{pair}')").click()
                    print("  sim", pair, v in txt(pg, "#w-emb"))
                pg.locator("#w-emb button:has-text('doctor − man + woman')").click()
                t = txt(pg, "#w-emb"); print("doctor bias:", "nem igazság" in t, "nurse" in t)
                pg.locator("#w-emb").screenshot(path=f"{OUT}/w-emb-doctor.png")
                pg.locator("#w-emb button:has-text('king − man + woman')").click()
                pg.locator("#w-emb label:has-text('bemeneti') input").check()
                t = txt(pg, "#w-emb"); print("king incl 0,886:", "0,886" in t)
                print(pg.evaluate("""() => { const t=[...document.querySelectorAll('#w-emb table')].map(x=>x.innerText.split('\\n').slice(0,8).join(' | ')); return t.join('\\n'); }"""))
                pg.locator("#w-emb label:has-text('bemeneti') input").uncheck()
                for pre in ["paris − france + hungary", "walked − walk + swim", "bigger − big + small", "programmer − man + woman", "lemon − yellow + green"]:
                    pg.locator(f"#w-emb button:has-text('{pre}')").click()
                    tb = pg.evaluate("() => [...document.querySelectorAll('#w-emb table')].slice(1,3).map(x=>x.innerText.replace(/\\s+/g,' ').slice(0,120))")
                    print("  ", pre, "->", tb)
                # click on map
                cvs = pg.locator("#w-emb canvas"); bb = cvs.bounding_box()
                pg.mouse.move(bb["x"] + bb["width"]*0.5, bb["y"] + bb["height"]*0.5)
                pg.mouse.click(bb["x"] + bb["width"]*0.3, bb["y"] + bb["height"]*0.4)
                pg.wait_for_timeout(200)
                print("map click sel:", pg.locator("#w-emb select").first.input_value())
                pg.locator("#w-emb button:has-text('állatok')").click()
                pg.locator("#w-emb").screenshot(path=f"{OUT}/w-emb-click.png")
                # ---- rnn
                t = txt(pg, "#w-rnn"); print("RNN jdu:", all(s in t for s in ["0,7616", "0,3634", "−0,6741"]))
                pg.locator("#w-rnn button:has-text('unalmas , de jó')").click()
                t = txt(pg, "#w-rnn"); print("RNN udj:", all(s in t for s in ["−0,7616", "−0,3634", "0,6741"]))
                pg.locator("#w-rnn button:has-text('aztán csend')").click()
                t = txt(pg, "#w-rnn"); print("RNN csend k=2:", "0,1797" in t)
                pg.locator("#w-rnn input[type=range]").first.evaluate("(e)=>{e.value=10;e.dispatchEvent(new Event('input'))}")
                t = txt(pg, "#w-rnn"); print("RNN csend k=10:", [l for l in t.split("\n") if "10 lépéssel" in l or "első szó" in l])
                pg.locator("#w-rnn").screenshot(path=f"{OUT}/w-rnn-k10.png")
                pg.locator("#w-rnn button:has-text('törlés')").last.click()
                for wd in ["a", "film", "nem", "volt", "rossz"]:
                    pg.locator(f"#w-rnn button.chip:text-is('{wd}')").click()
                t = txt(pg, "#w-rnn"); print("RNN built:", [l for l in t.split("\n") if l.startswith("Végállapot")])
                # ---- soft
                t = txt(pg, "#w-soft"); print("SOFT q10:", all(s in t for s in ["0,665", "0,090", "0,245", "15,79"]), "kemény 10:", "10" in t)
                pg.locator("#w-soft button:has-text('q = (3; 0)')").click()
                t = txt(pg, "#w-soft"); print("SOFT q30:", all(s in t for s in ["0,950", "0,002", "0,047", "10,97"]))
                pg.locator("#w-soft button:has-text('β = 3')").click()
                t = txt(pg, "#w-soft"); print("SOFT b3:", all(s in t for s in ["0,950", "10,97"]))
                pg.locator("#w-soft button:has-text('q = (0; 0)')").click()
                t = txt(pg, "#w-soft"); print("SOFT q00:", all(s in t for s in ["0,333", "20,00"]))
                cvs = pg.locator("#w-soft canvas"); bb = cvs.bounding_box()
                pg.mouse.move(bb["x"] + bb["width"]*0.3, bb["y"] + bb["height"]*0.6); pg.mouse.down()
                pg.mouse.move(bb["x"] + bb["width"]*0.75, bb["y"] + bb["height"]*0.3, steps=5); pg.mouse.up()
                print("SOFT drag:", [l for l in txt(pg, "#w-soft").split("\n") if "Puha:" in l][:1])
                pg.locator("#w-soft").screenshot(path=f"{OUT}/w-soft-drag.png")
            if width == 380:
                over = pg.evaluate("() => [...document.querySelectorAll('.widget')].map(w => [w.id, w.scrollWidth, w.clientWidth])")
                print("380 overflow:", over, "doc", pg.evaluate("document.documentElement.scrollWidth"))
            pg.close()
    b.close()
print("ERRORS:", errs or "none")
