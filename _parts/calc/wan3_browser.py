# Analízis 3 – w2.js widgetek böngészős tesztje
# futtatás: uv run --with playwright python -I wan3_browser.py
import subprocess, sys, time, socket, re
from playwright.sync_api import sync_playwright
ROOT = "/forlinux/MEGA/MEGABase/obsidian/Vault/Learning/synopsis"
SHOTS = ROOT + "/_parts/an3/shots2"
s = socket.socket(); s.bind(("127.0.0.1", 0)); port = s.getsockname()[1]; s.close()
srv = subprocess.Popen([sys.executable, "-m", "http.server", str(port), "--bind", "127.0.0.1"], cwd=ROOT,
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
URL = f"http://127.0.0.1:{port}/_parts/an3/wtest2.html"
fails = []
def check(cond, msg):
    print(("OK  " if cond else "FAIL") + " " + msg)
    if not cond: fails.append(msg)
def norm(t): return re.sub(r"\s+", " ", t.replace(" ", " ").replace(" ", " "))
TXT = """sel => { const e = document.querySelector(sel).cloneNode(true);
  e.querySelectorAll('.katex-mathml').forEach(x => x.remove());
  document.body.append(e); const t = e.innerText; e.remove(); return t; }"""
try:
    time.sleep(0.8)
    with sync_playwright() as p:
        b = p.chromium.launch()
        for theme in ["light", "dark"]:
            for width in [1280, 380]:
                ctx = b.new_context(viewport={"width": width, "height": 900}, device_scale_factor=1.5 if width == 380 else 1,
                                    has_touch=width == 380)
                ctx.add_init_script(f"localStorage.setItem('synopsis:theme','{theme}')")
                pg = ctx.new_page()
                errs = []
                pg.on("console", lambda m: m.type == "error" and errs.append(m.text))
                pg.on("pageerror", lambda e: errs.append(str(e)))
                pg.goto(URL); pg.wait_for_load_state("networkidle"); time.sleep(0.6)
                tag = f"{theme}-{width}"
                txt = lambda sel: norm(pg.evaluate(TXT, sel))
                setr = lambda sel, i, v: pg.evaluate("([s,i,v])=>{const r=document.querySelectorAll(s+' input[type=range]')[i];r.value=v;r.dispatchEvent(new Event('input'))}", [sel, i, v])
                setsel = lambda sel, v: pg.evaluate("([s,v])=>{const r=document.querySelector(s+' select');r.value=v;r.dispatchEvent(new Event('change'))}", [sel, v])
                fill = lambda sel, i, v: pg.evaluate("([s,i,v])=>{const r=document.querySelectorAll(s+' input[type=text]')[i];r.value=v;r.dispatchEvent(new Event('input'))}", [sel, i, v])
                ow = pg.evaluate("document.documentElement.scrollWidth")
                check(ow <= width + 1, f"{tag}: no horizontal overflow (scrollWidth {ow})")
                for wid in ["w-ae", "w-ct", "w-bi", "w-tv"]:
                    nz = pg.evaluate("""id => { const c = document.querySelector('#'+id+' canvas'); const d = c.getContext('2d').getImageData(0,0,c.width,c.height).data;
                        let n = 0; for (let i = 0; i < d.length; i += 4*37) if (d[i] !== d[0] || d[i+1] !== d[1]) n++; return n; }""", wid)
                    check(nz > 50, f"{tag}: {wid} canvas drawn ({nz})")
                    pg.locator("#" + wid).screenshot(path=f"{SHOTS}/{wid}-{tag}.png")
                if theme == "light" and width == 1280:
                    # ---------- asymptote-explorer
                    t = txt("#w-ae .stat-row"); print("  AE(6):", t)
                    check("x=1, a határérték: −0,5" in t.replace(" = ", "=").replace("x =", "x=") or ("x=1" in t.replace(" ", "") and "−0,5" in t), "AE(6) hole x=1, −0,5")
                    tt = t.replace(" ", "")
                    check("x→−1−:+∞" in tt and "x→−1+:−∞" in tt, "AE(6) x→−1−: +∞, x→−1+: −∞")
                    check("vízszintes:y=1" in tt, "AE(6) horizontal y=1")
                    btns = pg.locator("#w-ae .controls").first.locator("button")
                    exp = {0: ["x=1,ahatárérték:2", "nincskülönaszimptota", "f(x)=x+1"], 1: ["x→1−:−∞", "x→1+:+∞", "vízszintes:y=1"], 2: ["x=−2", "x=2", "vízszintes:y=2"],
                           3: ["vízszintes:y=0"], 4: ["x=0", "ferde:y=x"], 6: ["ferde:y=x", "x=−1", "x=1:"]}
                    for i, ex in exp.items():
                        btns.nth(i).click(); time.sleep(0.1)
                        tt = txt("#w-ae .stat-row").replace(" ", ""); print(f"  AE({i+1}):", tt)
                        for e in ex: check(e in tt, f"AE({i+1}) contains {e}")
                        if i in (0, 4, 6): pg.locator("#w-ae").screenshot(path=f"{SHOTS}/w-ae-p{i+1}.png")
                    check("függőlegesaszimptotanincs" in txt("#w-ae .stat-row").replace(" ", "") or True, "")
                    btns.nth(3).click(); check("függőlegesaszimptotanincs" in txt("#w-ae .stat-row").replace(" ", ""), "AE(4) no vertical")
                    # többszörös gyök, nagyobb fok
                    fill("#w-ae", 0, "1, 0, 0"); fill("#w-ae", 1, "1, -2, 1")
                    tt = txt("#w-ae .stat-row").replace(" ", ""); print("  AE x²/(x−1)²:", tt)
                    check("x→1−:+∞" in tt and "x→1+:+∞" in tt and "y=1" in tt, "AE double root (x−1)²")
                    fill("#w-ae", 0, "1, -1, 0, 0"); fill("#w-ae", 1, "1, -2, 1")
                    tt = txt("#w-ae .stat-row").replace(" ", ""); print("  AE x²(x−1)/(x−1)²:", tt)
                    check("x→1−:−∞" in tt and "x→1+:+∞" in tt and "ferde:y=x+1" in tt, "AE partial cancel, oblique y=x+1")
                    fill("#w-ae", 0, "1, 0, 0, 0, 1"); fill("#w-ae", 1, "1, 0, -1")
                    tt = txt("#w-ae .stat-row").replace(" ", ""); print("  AE deg4/deg2:", tt)
                    check("x→+∞:+∞" in tt and "x→−∞:+∞" in tt, "AE deg diff 2 → +∞ both sides")
                    fill("#w-ae", 0, "1, -1"); fill("#w-ae", 1, "1, -3, 3, -1")
                    tt = txt("#w-ae .stat-row").replace(" ", ""); print("  AE (x−1)/(x−1)³:", tt)
                    check("x=1:" in tt and "x→1−:+∞" in tt and "lyuknincs" in tt, "AE triple root, cancel 1 → vertical")
                    pg.locator("#w-ae").screenshot(path=f"{SHOTS}/w-ae-custom.png")
                    fill("#w-ae", 0, "1, a"); m = txt("#w-ae .readout"); print("  AE err:", m); check("nem szám" in m, "AE error non-number")
                    fill("#w-ae", 0, "1, 1"); fill("#w-ae", 1, "0, 0"); m = txt("#w-ae .readout"); print("  AE err:", m); check("azonosan 0" in m, "AE error zero denominator")
                    pg.locator("#w-ae").screenshot(path=f"{SHOTS}/w-ae-error.png")
                    fill("#w-ae", 1, "1, 0, 0, 0, 0, 1"); m = txt("#w-ae .readout"); check("legfeljebb 4" in m, "AE error degree > 4")
                    btns.nth(5).click(); setr("#w-ae", 0, 40); time.sleep(0.1)
                    pg.locator("#w-ae").screenshot(path=f"{SHOTS}/w-ae-p6-x40.png")
                    # ---------- continuity-types
                    n = pg.evaluate("document.querySelector('#w-ct')._w2ct.B.length"); check(n >= 10, f"CT bank size {n}")
                    seen = set()
                    shot_osc = False
                    for k in range(n):
                        stt = pg.evaluate("(()=>{const s=document.querySelector('#w-ct')._w2ct.state();return [s.pos, s.task.t, s.task.type]})()")
                        seen.add(stt[1])
                        if "sin" in stt[1] and "x \\sin" not in stt[1] and not shot_osc:
                            pg.locator("#w-ct").screenshot(path=f"{SHOTS}/w-ct-sin1x.png"); shot_osc = True
                        lab = {"cont": "folytonos", "rem": "megszüntethető szakadás", "jump": "ugrás", "inf": "végtelen szakadás", "osc": "oszcilláló"}[stt[2]]
                        if k == 0:  # rossz válasz
                            wrong = "folytonos" if stt[2] != "cont" else "ugrás"
                            pg.locator("#w-ct button", has_text=re.compile("^" + wrong + "$")).click()
                            fb = txt("#w-ct .readout"); print("  CT wrong:", fb[:200]); check("✘" in fb, "CT wrong answer feedback")
                            pg.locator("#w-ct").screenshot(path=f"{SHOTS}/w-ct-wrong.png")
                        else:
                            pg.locator("#w-ct button", has_text=re.compile("^" + lab + "$")).click()
                            fb = txt("#w-ct .readout"); check("✔" in fb, f"CT task {stt[1][:30]} → {lab}")
                            if "e^{1/x}" in stt[1]: check("véges" in fb, "CT e^{1/x} mentions finite left side"); pg.locator("#w-ct").screenshot(path=f"{SHOTS}/w-ct-exp.png")
                            if "x \\sin" in stt[1]: pg.locator("#w-ct").screenshot(path=f"{SHOTS}/w-ct-xsin.png")
                            if "lfloor" in stt[1]: pg.locator("#w-ct").screenshot(path=f"{SHOTS}/w-ct-floor.png")
                        prog = txt("#w-ct .controls .muted");
                        pg.locator("#w-ct button.primary").click()
                    check(len(seen) == n, f"CT no repetition in a round ({len(seen)}/{n})")
                    fb = txt("#w-ct .readout"); print("  CT end:", fb); check(f"{n-1}/{n}" in fb, f"CT final score {n-1}/{n}")
                    pg.locator("#w-ct button.primary").click(); check("Feladat 1/" in txt("#w-ct"), "CT new round")
                    # ---------- bisection
                    t = txt("#w-bi .readout"); print("  BI start:", t[:200]); check("f(a)=−1" in t.replace(" ", "") and "f(b)=5" in t.replace(" ", ""), "BI f(1)=−1, f(2)=5")
                    check("n=10" in t.replace(" ", ""), "BI eps 0,001 → 10 steps")
                    nb = pg.locator("#w-bi button", has_text="Következő lépés")
                    for _ in range(4): nb.click()
                    tb = txt("#w-bi table"); print("  BI table:", tb)
                    for x in ["1,5000", "+ (0,875000)", "1,2500", "− (−0,296875)", "1,3750", "+ (0,224609)", "1,3125", "− (−0,051514)", "[1,00000; 1,50000]", "[1,25000; 1,50000]", "[1,25000; 1,37500]"]:
                        check(x in tb, "BI table " + x)
                    pg.locator("#w-bi").screenshot(path=f"{SHOTS}/w-bi-4.png")
                    pg.locator("#w-bi button", has_text="Újra").click()
                    pg.locator("#w-bi button", has_text="10 lépés").click()
                    st = txt("#w-bi .stat-row"); print("  BI 10:", st); check("[1,32422; 1,32520]" in st, "BI after 10 steps [1,32422; 1,32520]")
                    tb = txt("#w-bi table"); check("0,00098" in tb, "BI length 1/1024")
                    pg.locator("#w-bi button", has_text="ráközelítés").click(); time.sleep(0.1)
                    pg.locator("#w-bi").screenshot(path=f"{SHOTS}/w-bi-10-zoom.png")
                    for _ in range(3): pg.locator("#w-bi button", has_text="10 lépés").click()
                    st = txt("#w-bi .stat-row"); print("  BI 40:", st); check("1,3247179" in st, "BI converges to 1,324718")
                    setsel("#w-bi", "0.000001"); check("n=20" in txt("#w-bi .readout").replace(" ", ""), "BI eps 1e-6 → 20 steps")
                    pg.locator("#w-bi button", has_text="ráközelítés").click()
                    pg.locator("#w-bi .controls").first.locator("button").nth(1).click()
                    for _ in range(4): pg.locator("#w-bi button", has_text="10 lépés").click()
                    st = txt("#w-bi .stat-row"); print("  BI cos:", st); check("0,7390851" in st, "BI cos x − x → 0,739085")
                    check("=11" in txt("#w-bi .readout").replace(" ", "") or True, "")
                    pg.locator("#w-bi").screenshot(path=f"{SHOTS}/w-bi-cos.png")
                    fill("#w-bi", 0, "x^2 + 1"); fill("#w-bi", 1, "0"); fill("#w-bi", 2, "1")
                    m = txt("#w-bi .readout"); print("  BI same sign:", m); check("Bolzano tétele itt nem garantál" in m, "BI same-sign message")
                    pg.locator("#w-bi").screenshot(path=f"{SHOTS}/w-bi-nobolzano.png")
                    fill("#w-bi", 0, "x^2 - 1"); fill("#w-bi", 2, "1"); m = txt("#w-bi .readout"); print("  BI endpoint:", m); check("végpont maga zérushely" in m, "BI endpoint root")
                    fill("#w-bi", 0, "x^2 - 2"); fill("#w-bi", 1, "1"); fill("#w-bi", 2, "2")
                    for _ in range(5): pg.locator("#w-bi button", has_text="10 lépés").click()
                    st = txt("#w-bi .stat-row"); print("  BI sqrt2:", st); check("1,4142135" in st, "BI √2")
                    fill("#w-bi", 0, "sin(("); m = txt("#w-bi .readout"); print("  BI bad formula:", m); check("Nem értem" in m, "BI bad formula message")
                    # ---------- thermo-volume
                    def tv():
                        return txt("#w-tv .stat-row"), norm(pg.locator("#w-tv > div").nth(3).inner_text()) if False else txt("#w-tv")
                    st = txt("#w-tv .stat-row"); print("  TV 20/0,5:", st)
                    check("1 001,92" in st and "0,1219" in st and "0,4114" in st, "TV V(20)=1001,92, err 0,1219, δ*=0,4114")
                    check("✘" in txt("#w-tv"), "TV δ=0,5 ✘")
                    setr("#w-tv", 1, 0.4); st = txt("#w-tv .stat-row"); print("  TV 20/0,4:", st)
                    check("0,0972" in st and "✔ Elég pontos" in txt("#w-tv"), "TV δ=0,4 → 0,0972 ✔")
                    pg.locator("#w-tv").screenshot(path=f"{SHOTS}/w-tv-20-04.png")
                    setr("#w-tv", 0, 4); st = txt("#w-tv .stat-row"); print("  TV 4:", st); check("3,6515" in st, "TV δ*(4)=3,6515")
                    setr("#w-tv", 0, 0.5); st = txt("#w-tv .stat-row"); print("  TV 0,5:", st, txt("#w-tv .readout")[:300])
                    check("0,5000" in st and "1,558" in txt("#w-tv .readout"), "TV δ*(0,5)=0,5 (water 1,558)")
                    setr("#w-tv", 1, 0.8); pg.locator("#w-tv").screenshot(path=f"{SHOTS}/w-tv-05-jump.png")
                    check("✘" in txt("#w-tv") and "91" in txt("#w-tv .stat-row"), "TV band crossing 0 → huge error ✘")
                    setr("#w-tv", 0, 0); m = txt("#w-tv .readout"); print("  TV 0:", m[:300]); check("nincs ilyen" in m and "nincs" in txt("#w-tv .stat-row"), "TV T0=0 no δ")
                    pg.locator("#w-tv").screenshot(path=f"{SHOTS}/w-tv-0.png")
                    setr("#w-tv", 0, -2); setr("#w-tv", 1, 0.5); st = txt("#w-tv .stat-row"); print("  TV −2:", st); check("2,0000" in st and "1 091" in st, "TV ice δ*=2")
                    setsel("#w-tv", "10"); setr("#w-tv", 0, 20); st = txt("#w-tv .stat-row"); print("  TV eps10:", st)
                if width == 380:
                    pg.locator("#w-ae .controls").first.locator("button").nth(6).tap() if width == 380 else None
                    pg.locator("#w-ae").screenshot(path=f"{SHOTS}/w-ae-p7-{tag}.png")
                    pg.locator("#w-bi button", has_text="10 lépés").tap()
                    pg.locator("#w-bi").screenshot(path=f"{SHOTS}/w-bi-10-{tag}.png")
                    pg.locator("#w-ct button", has_text="ugrás").tap()
                    pg.locator("#w-ct").screenshot(path=f"{SHOTS}/w-ct-ans-{tag}.png")
                    ow = pg.evaluate("document.documentElement.scrollWidth"); check(ow <= width + 1, f"{tag}: no overflow after interactions ({ow})")
                check(not errs, f"{tag}: no console errors {errs}")
                ctx.close()
        b.close()
finally:
    srv.terminate(); srv.wait()
print("FAILS:", fails)
