import subprocess, sys, time, socket, os, re
from playwright.sync_api import sync_playwright
ROOT = "/forlinux/MEGA/MEGABase/obsidian/Vault/Learning/synopsis"
SHOTS = ROOT + "/_parts/an2/shots2"
s = socket.socket(); s.bind(("127.0.0.1", 0)); port = s.getsockname()[1]; s.close()
srv = subprocess.Popen([sys.executable, "-m", "http.server", str(port), "--bind", "127.0.0.1"], cwd=ROOT,
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
URL = f"http://127.0.0.1:{port}/_parts/an2/wtest2.html"
fails = []
def check(cond, msg):
    print(("OK  " if cond else "FAIL") + " " + msg)
    if not cond: fails.append(msg)
def norm(t): return re.sub(r"\s+", " ", t.replace(" ", " ").replace(" ", " "))
try:
    time.sleep(0.8)
    with sync_playwright() as p:
        b = p.chromium.launch()
        for theme in ["light", "dark"]:
            for width in [1280, 380]:
                ctx = b.new_context(viewport={"width": width, "height": 900}, device_scale_factor=1.5 if width == 380 else 1)
                ctx.add_init_script(f"localStorage.setItem('synopsis:theme','{theme}')")
                pg = ctx.new_page()
                errs = []
                pg.on("console", lambda m: m.type == "error" and errs.append(m.text))
                pg.on("pageerror", lambda e: errs.append(str(e)))
                pg.goto(URL); pg.wait_for_load_state("networkidle"); time.sleep(0.5)
                tag = f"{theme}-{width}"
                ow = pg.evaluate("document.documentElement.scrollWidth")
                check(ow <= width + 1, f"{tag}: no horizontal overflow (scrollWidth {ow})")
                for wid in ["w-gr", "w-ss", "w-an"]:
                    pg.locator("#" + wid).screenshot(path=f"{SHOTS}/{wid}-{tag}.png")
                txt = lambda sel: norm(pg.locator(sel).inner_text())
                setr = lambda sel, i, v: pg.evaluate("([s,i,v])=>{const r=document.querySelectorAll(s+' input[type=range]')[i];r.value=v;r.dispatchEvent(new Event('input'))}", [sel, i, v])
                if theme == "light" and width == 1280:
                    # growth-race
                    t = txt("#w-gr .readout"); print("  GR:", t[:300])
                    check("686" in t and "685" in t, "growth n10 vs 1.1^n overtake 686 / last 685")
                    check("1,52" in t and "12" in t, "growth ratio at N=20 ~1,52e12")
                    sel = lambda a, bb: pg.evaluate("([a,b])=>{const s=document.querySelectorAll('#w-gr select');s[0].value=a;s[0].dispatchEvent(new Event('change'));s[1].value=b;s[1].dispatchEvent(new Event('change'))}", [a, bb])
                    for a, bb, exp in [("n2", "e2", "n≥5esetén"), ("e2", "fact", "n≥4esetén"), ("fact", "nn", "n≥2esetén"), ("n", "n2", "n≥2esetén")]:
                        sel(a, bb); t = txt("#w-gr .readout"); print("  GR:", t[:120]); check(exp in t.replace(" ",""), f"growth {a} vs {bb}: {exp}")
                    sel("ln", "sqrt"); t = txt("#w-gr .readout"); check("nincs is előzés" in t, "growth ln vs sqrt: no overtake")
                    pg.locator("#w-gr button", has_text="Hosszú táv").click(); time.sleep(0.2)
                    t = txt("#w-gr .readout"); print("  GR long:", t[:260]); check("686" in t, "long-range readout")
                    mx = pg.evaluate("document.querySelector('#w-gr input[type=range]').max"); check(mx == "1000", "slider max 1000")
                    pg.locator("#w-gr").screenshot(path=f"{SHOTS}/w-gr-long.png")
                    pg.locator("#w-gr button", has_text="lineáris skála").click(); time.sleep(0.2)
                    pg.locator("#w-gr").screenshot(path=f"{SHOTS}/w-gr-long-lin.png")
                    pg.locator("#w-gr button", has_text="Alaphelyzet").click()
                    pg.locator("#w-gr button", has_text="lineáris skála").click(); time.sleep(0.2)
                    pg.locator("#w-gr").screenshot(path=f"{SHOTS}/w-gr-lin.png")
                    # series-sum
                    st = txt("#w-ss .stat-row"); print("  SS geo:", st)
                    check("0,999023" in st and "1" in st, "geo S10 = 0,999023")
                    pg.locator("#w-ss button", has_text="0,999").first.click(); st = txt("#w-ss .stat-row"); print("  SS 0.999:", st)
                    check("1,000000" in st or "0,999999" in st or " 1 " in st, "0.999 preset")
                    setr("#w-ss", 1, 1.2); setr("#w-ss", 2, 200); time.sleep(0.2)
                    print("  SS q=1.2:", txt("#w-ss .readout")); check("divergens" in txt("#w-ss .readout"), "q=1.2 divergent msg")
                    pg.locator("#w-ss").screenshot(path=f"{SHOTS}/w-ss-q12.png")
                    setr("#w-ss", 1, -1); setr("#w-ss", 2, 12); check("a,0,a,0" in txt("#w-ss .readout").replace(" ",""), "q=-1 message")
                    pg.locator("#w-ss").screenshot(path=f"{SHOTS}/w-ss-qm1.png")
                    setr("#w-ss", 1, 0.5); setr("#w-ss", 2, 10)
                    pg.locator("#w-ss button", has_text="harmonikus").first.click(); st = txt("#w-ss .stat-row"); print("  SS harm10:", st)
                    check("2,928968" in st, "harm S10")
                    setr("#w-ss", 2, 100); st = txt("#w-ss .stat-row"); print("  SS harm100:", st)
                    check("5,187378" in st and "5,182386" in st, "harm S100, ln100+gamma")
                    check("12" in txt("#w-ss .readout") and "367" in txt("#w-ss .readout"), "12 367 sentence")
                    pg.locator("#w-ss").screenshot(path=f"{SHOTS}/w-ss-harm100.png")
                    setr("#w-ss", 2, 10)
                    btns = pg.locator("#w-ss .controls").first.locator("button")
                    btns.nth(2).click(); st = txt("#w-ss .stat-row"); print("  SS inv2:", st); check("1,549768" in st and "1,644934" in st, "1/n^2 S10")
                    btns.nth(3).click(); st = txt("#w-ss .stat-row"); print("  SS alt:", st); check("0,645635" in st and "0,693147" in st, "alt S10")
                    pg.locator("#w-ss").screenshot(path=f"{SHOTS}/w-ss-alt.png")
                    btns.nth(4).click(); st = txt("#w-ss .stat-row"); print("  SS fact:", st); check("1,718282" in st, "1/n! S10")
                    setr("#w-ss", 2, 200); st = txt("#w-ss .stat-row"); print("  SS fact200:", st)
                    # annuity
                    st = txt("#w-an .stat-row"); print("  AN:", st)
                    check("402 115" in st and "206 344" in st and "1 206 344" in st, "annuity 1M 10% 3y")
                    tb = txt("#w-an table"); print("  AN table:", tb)
                    for x in ["100 000", "302 115", "697 885", "69 789", "332 326", "365 559", "36 556"]: check(x in tb, "table " + x)
                    check("402 114,8" in txt("#w-an .readout"), "formula 402 114,80")
                    pg.locator("#w-an button", has_text="Lakáshitel").click(); time.sleep(0.2)
                    st = txt("#w-an .stat-row"); print("  AN havi:", st)
                    check("143 286" in st and "34 388 691" in st, "mortgage monthly")
                    pg.locator("#w-an").screenshot(path=f"{SHOTS}/w-an-havi.png")
                    pg.locator("#w-an button", has_text="évi részlet").click(); st = txt("#w-an .stat-row"); print("  AN evi:", st)
                    check("1 743 691" in st, "mortgage yearly")
                    pg.locator("#w-an").screenshot(path=f"{SHOTS}/w-an-20y.png")
                if width == 380 and theme == "dark":
                    pg.locator("#w-gr button", has_text="Hosszú táv").click(); time.sleep(0.2)
                    pg.locator("#w-gr").screenshot(path=f"{SHOTS}/w-gr-long-{tag}.png")
                    pg.locator("#w-an button", has_text="Lakáshitel").click(); time.sleep(0.2)
                    pg.locator("#w-an").screenshot(path=f"{SHOTS}/w-an-havi-{tag}.png")
                    pg.locator("#w-ss button", has_text="harmonikus").first.click(); setr("#w-ss", 2, 200); time.sleep(0.2)
                    pg.locator("#w-ss").screenshot(path=f"{SHOTS}/w-ss-harm-{tag}.png")
                    ow = pg.evaluate("document.documentElement.scrollWidth"); check(ow <= width + 1, f"{tag}: no overflow after interactions ({ow})")
                check(not errs, f"{tag}: no console errors {errs}")
                ctx.close()
        b.close()
finally:
    srv.terminate(); srv.wait()
print("FAILS:", fails)
