import sys, subprocess, time, socket, os
from playwright.sync_api import sync_playwright
root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
s = socket.socket(); s.bind(("", 0)); port = s.getsockname()[1]; s.close()
srv = subprocess.Popen([sys.executable, "-m", "http.server", str(port)], cwd=root, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(0.8)
try:
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(viewport={"width": 390, "height": 900})
        pg.goto(f"http://localhost:{port}/analizis/03-hatarertek-es-folytonossag/"); pg.wait_for_timeout(3000)
        pg.evaluate("document.querySelectorAll('details').forEach(d => d.open = true)"); pg.wait_for_timeout(500)
        print(pg.evaluate("""() => [...document.querySelectorAll('main .katex')].filter(e => e.getBoundingClientRect().right > innerWidth + 1 && !e.closest('.tw') && !e.closest('.katex-display')).map(e => { const p = e.closest('p,li,td,div'); const sec = e.closest('section'); return (sec&&sec.id) + ' | ' + Math.round(e.getBoundingClientRect().right - innerWidth) + 'px | ' + p.tagName + '.' + p.className + ' | ' + (p.textContent||'').slice(0,90); })"""))
        b.close()
finally:
    srv.kill()
