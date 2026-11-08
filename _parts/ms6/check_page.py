import sys, subprocess, time, socket, os
from playwright.sync_api import sync_playwright
root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
s = socket.socket(); s.bind(("", 0)); port = s.getsockname()[1]; s.close()
srv = subprocess.Popen([sys.executable, "-m", "http.server", str(port)], cwd=root, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(0.8)
JS = r"""() => {
  const ids = new Set([...document.querySelectorAll('[id]')].map(e => e.id));
  const bad = [...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href').slice(1)).filter(h => h && !ids.has(h));
  const quizzes = [...document.querySelectorAll('.quiz')].map(q => ({id: q.dataset.quiz, det: q.querySelectorAll('details').length, nq: q.querySelectorAll('.q, .question, li').length}));
  const openDet = [...document.querySelectorAll('details[open]')].map(d => (d.querySelector('summary')||{}).textContent);
  const practice = document.querySelectorAll('details.box.practice').length;
  const kerr = [...document.querySelectorAll('.katex-error')].map(e => e.getAttribute('title') || e.textContent).slice(0, 20);
  const rawDollar = [...document.querySelectorAll('main p, main li, main td, main div.box')].filter(e => /\$[^$]+\$/.test([...e.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join(''))).length;
  const widgets = [...document.querySelectorAll('.widget[data-widget]')].map(w => [w.dataset.widget, w.children.length]);
  const logs = [...document.querySelectorAll('.lab-log')].map(l => l.querySelectorAll('textarea').length);
  return {bad, quizzes, openDet, practice, kerr, rawDollar, widgets, logs};
}"""
try:
    with sync_playwright() as p:
        b = p.chromium.launch()
        for theme, width in (("light", 1280), ("dark", 390)):
            ctx = b.new_context(viewport={"width": width, "height": 900})
            ctx.add_init_script(f"localStorage.setItem('synopsis:theme','{theme}')")
            pg = ctx.new_page(); errs = []
            pg.on("console", lambda m: errs.append(m.text) if m.type in ("error", "warning") else None)
            pg.on("pageerror", lambda e: errs.append(str(e)))
            pg.goto(f"http://localhost:{port}/matematikai-statisztika/06-becsles/"); pg.wait_for_timeout(3500)
            r = pg.evaluate(JS)
            print(theme, width, r)
            print(theme, "console:", errs[:15])
            sw = pg.evaluate("document.documentElement.scrollWidth"); print(theme, "scrollWidth", sw)
            ov = pg.evaluate("""() => [...document.querySelectorAll('main *')].filter(e => { const r = e.getBoundingClientRect(); return r.right > innerWidth + 1 && !e.closest('.tw') && !e.closest('.katex-display') && !e.closest('.katex-mathml') && !e.closest('svg') && getComputedStyle(e).position !== 'absolute'; }).slice(0, 40).map(e => e.tagName + '.' + e.className + ': ' + (e.textContent||'').slice(0, 60))""")
            print(theme, "overflow:", ov)
            pg.evaluate("document.querySelectorAll('details').forEach(d => d.open = true)"); pg.wait_for_timeout(500)
            ov2 = pg.evaluate("""() => [...document.querySelectorAll('main *')].filter(e => { const r = e.getBoundingClientRect(); return r.right > innerWidth + 1 && !e.closest('.tw') && !e.closest('.katex-display') && !e.closest('.katex-mathml') && !e.closest('svg') && getComputedStyle(e).position !== 'absolute'; }).filter(e => e.classList.contains('katex') || !e.closest('.katex')).slice(0, 40).map(e => e.tagName + '.' + e.className + ': ' + (e.textContent||'').slice(0, 70))""")
            print(theme, "overflow (nyitva):", ov2)
            for sel in sys.argv[1:]:
                pg.locator(sel).first.scroll_into_view_if_needed(); pg.wait_for_timeout(400)
                pg.locator(sel).first.screenshot(path=f"{root}/_parts/ms6/shots/page-{sel.strip('#.').replace(' ','_').replace('[','').replace(']','').replace('=','-').replace('\"','')}-{theme}.png")
            ctx.close()
        b.close()
finally:
    subprocess.run(["fuser", "-k", f"{port}/tcp"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
