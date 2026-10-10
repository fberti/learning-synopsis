"""Böngészős ellenőrzés a 10. fejezet 5–8. widgetjéhez (w2.js).
Használat: uv run --with playwright python -I bc10w2.py <port> <kimeneti mappa> [szélesség]"""
import sys, json
from playwright.sync_api import sync_playwright
port, out = sys.argv[1], sys.argv[2]
width = int(sys.argv[3]) if len(sys.argv) > 3 else 1100
NAMES = ["optimizer-race", "deep-signal", "train-monitor", "digit-trainer"]
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": width, "height": 900})
    errs = []
    pg.on("console", lambda m: m.type in ("error", "warning") and errs.append(f"{m.type}: {m.text}"))
    pg.on("pageerror", lambda e: errs.append(f"pageerror: {e}"))
    pg.goto(f"http://localhost:{port}/_parts/ch10/wtest.html", wait_until="networkidle")
    pg.wait_for_timeout(1500)
    W = lambda n: pg.query_selector(f'.widget[data-widget="{n}"]')
    ro = lambda n: W(n).query_selector(".readout").inner_text()
    def click(n, text, wait=0):
        w = W(n); w.scroll_into_view_if_needed()
        w.query_selector(f'button:has-text("{text}")').click(); pg.wait_for_timeout(wait)
    def wait_done(n, cond, timeout=120000):
        pg.wait_for_function(f"() => {{ const t = document.querySelector('.widget[data-widget=\"{n}\"] .readout').innerText; return {cond}; }}", timeout=timeout)
    info = pg.evaluate("""(names) => names.map(n => { const w = document.querySelector(`.widget[data-widget="${n}"]`);
      return { n, canvases: w.querySelectorAll('canvas').length, err: /Hiba/.test(w.innerText), sw: w.scrollWidth, cw: w.clientWidth,
               katexErr: w.querySelectorAll('.katex-error').length, raw: /\\$[^$]+\\$/.test(w.querySelector('.w-sub').innerText) }; })""", NAMES)
    print(json.dumps(info, ensure_ascii=False))
    mode = sys.argv[4] if len(sys.argv) > 4 else "all"
    if mode in ("all", "shots"):
        for theme in ("light", "dark"):
            pg.evaluate(f"document.documentElement.setAttribute('data-theme','{theme}')"); pg.wait_for_timeout(300)
            for n in NAMES:
                W(n).scroll_into_view_if_needed(); pg.wait_for_timeout(150)
                W(n).screenshot(path=f"{out}/w-{n}-{theme}-{width}.png")
    if mode == "all":
        print("== deep-signal")
        for act in ("ReLU", "tanh"):
            for init in ("túl kicsi", "Xavier", "He", "túl nagy"):
                click("deep-signal", act); click("deep-signal", init, 300)
                print(act, init, "|", ro("deep-signal").replace("\n", " | "))
        click("deep-signal", "ReLU"); click("deep-signal", "Xavier")
        W("deep-signal").query_selector('input[type=checkbox]').click(); pg.wait_for_timeout(300)
        print("ReLU Xavier LN |", ro("deep-signal").replace("\n", " | "))
        click("deep-signal", "tanh"); click("deep-signal", "túl nagy", 300)
        print("tanh nagy LN |", ro("deep-signal").replace("\n", " | "))
        W("deep-signal").query_selector('input[type=checkbox]').click(); click("deep-signal", "ReLU"); click("deep-signal", "He", 300)
        print("== optimizer-race")
        click("optimizer-race", "A szöveg példája", 200); print(ro("optimizer-race"))
        W("optimizer-race").screenshot(path=f"{out}/w-optimizer-race-preset-{width}.png")
        for s in ("hosszúkás tál", "keskeny völgy", "Rosenbrock"):
            click("optimizer-race", s)
            for cb in W("optimizer-race").query_selector_all("input[type=checkbox]"):
                if not cb.is_checked(): cb.click()
            click("optimizer-race", "Indítás"); wait_done("optimizer-race", "/lépés: 500/.test(t)", 60000)
            print(s, "|", ro("optimizer-race").replace("\n", " | "))
            W("optimizer-race").screenshot(path=f"{out}/w-optimizer-race-{s.split()[0]}-{width}.png")
        print("== train-monitor")
        def tm(desc, l2="0", do="0", early=False):
            w = W("train-monitor")
            btns = w.query_selector_all(".controls")[0].query_selector_all("button")
            [x for x in btns if x.inner_text() == l2][0].click()
            btns = w.query_selector_all(".controls")[1].query_selector_all("button")
            [x for x in btns if x.inner_text() == do][0].click()
            cb = w.query_selector("input[type=checkbox]")
            if cb.is_checked() != early: cb.click()
            click("train-monitor", "Tanítás")
            wait_done("train-monitor", "/Korai leállítás|Elértük/.test(t)", 120000)
            print(desc, "|", ro("train-monitor").replace("\n", " | "))
            w.screenshot(path=f"{out}/w-train-monitor-{desc}-{width}.png")
        tm("noreg"); tm("l2-0.001", l2="0,001"); tm("l2-0.01", l2="0,01"); tm("l2-0.03", l2="0,03"); tm("do-0.2", do="0,2"); tm("do-0.5", do="0,5"); tm("early", early=True)
        print("== digit-trainer")
        print("epoch0 |", ro("digit-trainer").replace("\n", " | "))
        w = W("digit-trainer")
        def dt(desc, opt=None, init=None, batch=None, epochs=None, preset=None):
            click("digit-trainer", "Alapbeállítás")
            if preset: click("digit-trainer", preset)
            if opt: click("digit-trainer", opt)
            if init: click("digit-trainer", init)
            if batch:
                bb = [x for x in w.query_selector_all(".controls")[1].query_selector_all("button") if x.inner_text() == batch][0]; bb.click()
            if epochs:
                w.query_selector("input[type=range]").evaluate(f"(e) => {{ e.value = {epochs}; e.dispatchEvent(new Event('input')); }}")
            if init: print(desc, "epoch0 |", ro("digit-trainer").replace("\n", " | "))
            import time; t0 = time.time()
            click("digit-trainer", "Tanítás")
            wait_done("digit-trainer", "/teszt pontosság/.test(t)", 300000)
            print(desc, f"({time.time()-t0:.1f}s) |", ro("digit-trainer").replace("\n", " | "))
            return w
        dt("adam")
        w.screenshot(path=f"{out}/w-digit-trainer-adam-{width}.png")
        # epoch 1 és 10 értékek a hist-ből nem olvashatók – külön: 1 epoch
        dt("adam-1ep", epochs=10)
        dt("sgd", opt="SGD"); dt("momentum", opt="momentum"); dt("rmsprop", opt="RMSProp")
        dt("zero-sgd", opt="SGD", init="nulla")
        dt("full-batch-sgd", opt="SGD", batch="teljes", epochs=20)
        dt("over", preset="Túltanulás")
        w.screenshot(path=f"{out}/w-digit-trainer-over-{width}.png")
    if mode == "narrow":
        click("optimizer-race", "A szöveg példája", 200)
        W("deep-signal").query_selector('input[type=checkbox]').click(); pg.wait_for_timeout(300)
        click("train-monitor", "Tanítás"); wait_done("train-monitor", "/Elértük/.test(t)", 120000)
        click("digit-trainer", "Tanítás"); wait_done("digit-trainer", "/teszt pontosság/.test(t)", 120000)
        for theme in ("light", "dark"):
            pg.evaluate(f"document.documentElement.setAttribute('data-theme','{theme}')"); pg.wait_for_timeout(300)
            for n in NAMES:
                W(n).scroll_into_view_if_needed(); pg.wait_for_timeout(150)
                W(n).screenshot(path=f"{out}/w-{n}-{theme}-{width}-run.png")
        print(pg.evaluate("() => [document.documentElement.scrollWidth, innerWidth]"))
    if mode == "epochs":
        # minden képkockában pontosan egy epoch (performance.now gyorsítva), a kiírások naplózva
        pg.evaluate("""() => { let t = 0; performance.now = () => (t += 30);
          const el = document.querySelector('.widget[data-widget="digit-trainer"] .readout'); window.__log = [];
          new MutationObserver(() => window.__log.push(el.innerText)).observe(el, { childList: true, subtree: true, characterData: true }); }""")
        for opt in ("Adam", "SGD"):
            click("digit-trainer", "Alapbeállítás"); click("digit-trainer", opt); pg.evaluate("window.__log = []")
            click("digit-trainer", "Tanítás"); wait_done("digit-trainer", "/teszt pontosság/.test(t)", 120000)
            log = pg.evaluate("window.__log")
            for e in (1, 10, 30):
                hit = [t for t in log if t.startswith(f"epoch: {e} /")]
                print(opt, e, "|", hit[-1].replace("\n", " | ") if hit else "-")
    print("console:", *errs[:30], sep="\n  ")
    b.close()
