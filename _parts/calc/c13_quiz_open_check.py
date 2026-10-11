import sys, re, subprocess, time, os
from playwright.sync_api import sync_playwright
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
srv = subprocess.Popen([sys.executable, "-m", "http.server", "8793"], cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1.5)
try:
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": 1280, "height": 900})
        errs = []
        pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto("http://localhost:8793/mesterseges-intelligencia/13-graf-neuralis-halok/", wait_until="networkidle")
        pg.wait_for_timeout(2500); pg.evaluate("""() => { document.querySelectorAll(".quiz details, .quiz summary").forEach(e => { if (e.tagName==="DETAILS") e.open = true; }); window.Synopsis && Synopsis.renderMath && Synopsis.renderMath(document.body); }"""); pg.wait_for_timeout(1500)
        r = pg.evaluate("""() => {
          const ids = new Set([...document.querySelectorAll('[id]')].map(e => e.id));
          const bad = [...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href').slice(1)).filter(h => h && !ids.has(h));
          const katexErr = [...document.querySelectorAll('.katex-error')].map(e => e.textContent.slice(0, 80));
          const openDetails = [...document.querySelectorAll('details[open]')].map(d => (d.querySelector('summary')||{}).textContent);
          const widgets = [...document.querySelectorAll('.widget[data-widget]')].map(w => [w.dataset.widget, w.children.length, (w.textContent.match(/Hiba a szemléltetés/)||[]).length]);
          const quizzes = [...document.querySelectorAll('.quiz[data-quiz]')].map(q => [q.dataset.quiz, q.children.length]);
          const rawDollar = [...document.querySelectorAll('main p, main li, main td')].filter(e => /\\$[^$]+\\$/.test(e.textContent) && !e.closest('.widget')).length;
          return {bad, katexErr, openDetails, widgets, quizzes, rawDollar};
        }""")
        for k, v in r.items(): print(k, v)
        print("console errors:", errs[:10])
        b.close()
finally:
    srv.terminate()
