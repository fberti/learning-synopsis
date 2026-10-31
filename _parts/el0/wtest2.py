import sys
from playwright.sync_api import sync_playwright
port = sys.argv[1]
url = f"http://localhost:{port}/_parts/el0/wtest2.html"
S = "_parts/el0/shots/"
def txt(l): return l.inner_text().replace("\n", " | ")
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": 1000, "height": 900})
    errs = []
    pg.on("console", lambda m: errs.append(m.type + ": " + m.text) if m.type in ("error", "warning") else None)
    pg.on("pageerror", lambda e: errs.append("PAGEERROR " + str(e)))
    pg.goto(url); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(600)
    m = pg.locator(".widget[data-widget=multimeter-sim]")
    MM = "document.querySelector('.widget[data-widget=multimeter-sim]').__mm"
    def mm(**o):
        import json
        pg.evaluate(f"{MM}.set({json.dumps(o)})")
        ro = txt(m.locator(".readout").nth(0)); w = m.locator(".readout").nth(1)
        ww = txt(w) if w.is_visible() else ""
        d = pg.evaluate(f"(() => {{ const S = {MM}.situation(); return S.disp ? (S.disp.sign ? '-' : '') + S.disp.text + ' ' + S.disp.unit : 'null'; }})()")
        return d, ro, ww
    for j in ["V", "A"]:
        for i in range(12):
            d, ro, ww = mm(tg=i, jack=j, sel=0, ncv=False, hold=False, on=True)
            print(f"[{j}] {i:2d} DISP={d!r:16} | {ro}" + (f"  || WARN: {ww}" if ww else ""))
    print("--- NCV")
    for i in [0, 11]:
        d, ro, ww = mm(tg=i, jack="V", ncv=True); print("NCV", i, d, "|", ro, "||", ww)
    print("--- SEL")
    for s in [1, 2, 3]:
        for i in [4, 6, 0]:
            d, ro, ww = mm(tg=i, jack="V", ncv=False, sel=s); print("SEL", s, i, d, "|", ro[:90])
    print("--- power off + short")
    d, ro, ww = mm(tg=0, jack="A", sel=0, on=False); print("OFF", d, "|", ro, "||", ww)
    # real button flow: HOLD
    mm(tg=0, jack="V", sel=0, on=True)
    m.get_by_role("button", name="HOLD").click()
    pg.evaluate(f"{MM}.set({{tg: 4}})")
    print("HOLD after switching to 220:", pg.evaluate(f"{MM}.st.frozen.text"), "|", txt(m.locator(".readout").nth(0)))
    m.screenshot(path=S + "w2-mm-hold.png")
    m.get_by_role("button", name="HOLD").click()
    # canvas clicks: jacks and buttons via geometry
    cv = m.locator("canvas"); bb = cv.bounding_box()
    G = pg.evaluate("(() => { const c = document.querySelector('.widget[data-widget=multimeter-sim] canvas'); const W = c.W, s = Math.max(0.6, Math.min(0.93, W*0.5/220)); return {s, W}; })()")
    s = G["s"]
    def at(x, y): pg.mouse.click(bb["x"] + 4 + x * s, bb["y"] + 4 + y * s)
    at(50, 266); print("canvas click 10A -> jack:", pg.evaluate(f"{MM}.st.jack"))
    at(170, 266); print("canvas click V/Ω -> jack:", pg.evaluate(f"{MM}.st.jack"))
    at(170, 157); print("canvas SEL -> sel:", pg.evaluate(f"{MM}.st.sel"))
    for k in range(3): at(170, 157)
    print("after 4x SEL:", pg.evaluate(f"{MM}.st.sel"))
    # long press HOLD/NCV
    pg.mouse.move(bb["x"] + 4 + 110 * s, bb["y"] + 4 + 157 * s); pg.mouse.down(); pg.wait_for_timeout(900); pg.mouse.up()
    print("long press -> ncv:", pg.evaluate(f"{MM}.st.ncv"), "hold:", pg.evaluate(f"{MM}.st.hold"))
    at(110, 157); print("short press -> hold:", pg.evaluate(f"{MM}.st.hold"))
    at(110, 157)
    pg.evaluate(f"{MM}.set({{ncv:false, tg:0, jack:'V'}})")
    at(36, 157); print("canvas power -> on:", pg.evaluate(f"{MM}.st.on")); at(36, 157)
    # screenshots
    for tg, jack, name in [(0, "V", "bat"), (0, "A", "short"), (9, "A", "led"), (9, "V", "ledV"), (6, "V", "strip"), (10, "V", "live"), (8, "V", "air")]:
        pg.evaluate(f"{MM}.set({{tg:{tg}, jack:'{jack}', ncv:false, sel:0, on:true}})"); pg.wait_for_timeout(100)
        m.screenshot(path=S + f"w2-mm-{name}.png")
    pg.evaluate(f"{MM}.set({{tg:11, jack:'V', ncv:true}})"); pg.wait_for_timeout(100); m.screenshot(path=S + "w2-mm-ncv.png")
    pg.evaluate(f"{MM}.set({{ncv:false, tg:0}})")

    # ---------------- color-code
    c = pg.locator(".widget[data-widget=color-code]")
    CC = "document.querySelector('.widget[data-widget=color-code]').__cc"
    def cc(names, flip=False):
        import json
        pg.evaluate(f"{CC}.set({json.dumps(names)})")
        if flip: pg.evaluate(f"{CC}.flip()")
        return pg.evaluate(f"{CC}.text()").replace("\n", " | ")
    for names in [["piros","piros","barna","arany"], ["piros","piros","fekete","fekete","barna"], ["barna","fekete","fekete","piros","barna"],
                  ["sárga","lila","piros","arany"], ["barna","zöld","arany","arany"], ["zöld","kék","fekete","barna","barna"],
                  ["barna","szürke","sárga","ezüst"], ["lila","zöld","piros","arany"], ["barna","fekete","barna","piros","arany"], ["piros","piros","ezüst","arany"]]:
        print("CC", "-".join(names), "=>", cc(names))
    print("CC flip 10k =>", cc(["barna","fekete","fekete","piros","barna"], flip=True))
    print("CC flip 220/4 =>", cc(["piros","piros","barna","arany"], flip=True))
    print("CC flip gold5 =>", cc(["arany","piros","barna","fekete","barna"]))
    # 4/5 switch via buttons
    cc(["piros","piros","barna","arany"])
    c.get_by_role("button", name="5 sáv").click(); print("switch to 5:", pg.evaluate(f"{CC}.text()").replace("\n"," | "))
    c.get_by_role("button", name="4 sáv").click(); print("switch to 4:", pg.evaluate(f"{CC}.text()").replace("\n"," | "))
    # palette click
    c.get_by_role("button", name="1. számjegy: sárga").click(); print("palette 1st=sárga:", pg.evaluate(f"{CC}.text()").replace("\n"," | "))
    c.get_by_role("button", name="Fordítsd meg").click(); print("flip btn:", pg.evaluate(f"{CC}.text()").replace("\n"," | "))
    c.get_by_role("button", name="Fordítsd meg").click()
    # encoder
    inp = c.locator("input[type=text]")
    for v in ["220", "4k7", "4,7k", "10k", "1M", "2R2", "1,5", "0,22", "120", "4,75k", "abc", "180 kΩ"]:
        inp.fill(v); print("ENC", v, "=>", txt(c.locator(".readout").nth(1)))
    inp.fill("10k")
    c.get_by_role("button", name="mutasd a rajzon").nth(1).click(); print("show 5-band 10k:", pg.evaluate(f"{CC}.text()").replace("\n"," | "))
    # practice: fixed tasks
    for names in [["piros","piros","barna","arany"], ["barna","fekete","fekete","piros","barna"], ["barna","zöld","arany","arany"], ["sárga","lila","piros","ezüst"]]:
        js = "(names) => { const cc = %s; const IX = n => ['fekete','barna','piros','narancs','sárga','zöld','kék','lila','szürke','fehér','arany','ezüst'].indexOf(n); cc.newTask(names.map(IX)); return cc.P.task.all.map(o => cc.ohm(o.v) + (o.ok ? '*' : '') + (o.why ? ' [' + o.why.slice(0, 50) + ']' : '')); }" % CC
        idx = pg.evaluate(js, names)
        print("TASK", "-".join(names), "=>", idx)
    # random tasks: always 4 distinct options, one correct
    bad = 0
    for k in range(300):
        r = pg.evaluate(f"(() => {{ const cc = {CC}; cc.newTask(); const a = cc.P.task.all; return [a.length, new Set(a.map(o => o.v)).size, a.filter(o => o.ok).length, cc.P.task.seq.length]; }})()")
        if r[0] != 4 or r[1] != 4 or r[2] != 1: bad += 1; print("BAD", r)
    print("random tasks bad:", bad)
    # answer via UI
    c.get_by_role("button", name="Új feladat").click()
    opts = c.locator(".controls").last.locator("button")
    opts.nth(0).click(); print("answered:", txt(c.locator(".readout").last), "| score", c.locator(".controls b").last.inner_text())
    c.screenshot(path=S + "w2-cc-light.png")
    # dark theme
    pg.evaluate("document.documentElement.setAttribute('data-theme','dark')"); pg.wait_for_timeout(200)
    c.screenshot(path=S + "w2-cc-dark.png")
    pg.evaluate(f"{MM}.set({{tg:9, jack:'A'}})"); pg.wait_for_timeout(100)
    m.screenshot(path=S + "w2-mm-dark.png")
    pg.evaluate("document.documentElement.setAttribute('data-theme','light')")
    # mobile
    pg.set_viewport_size({"width": 390, "height": 860}); pg.wait_for_timeout(500)
    sw = pg.evaluate("[document.documentElement.scrollWidth, document.documentElement.clientWidth]")
    print("390px scrollWidth/clientWidth:", sw)
    wide = pg.evaluate("[...document.querySelectorAll('.widget *')].filter(e => e.getBoundingClientRect().right > document.documentElement.clientWidth + 0.5).map(e => e.tagName + '.' + e.className).slice(0, 10)")
    print("overflowing elements:", wide)
    pg.evaluate(f"{MM}.set({{tg:0, jack:'A'}})"); pg.wait_for_timeout(100)
    m.screenshot(path=S + "w2-mm-390.png")
    pg.evaluate(f"{CC}.set(['zöld','kék','fekete','barna','barna'])")
    c.screenshot(path=S + "w2-cc-390.png")
    print("ERRORS:", errs)
    b.close()
