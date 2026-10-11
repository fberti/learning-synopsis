import sys
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": 380, "height": 800})
    pg.goto(f"http://localhost:{sys.argv[1]}/mesterseges-intelligencia/12-beagyazasok-figyelem/", wait_until="networkidle"); pg.wait_for_timeout(2000)
    print(pg.evaluate("""() => { const res = {}; const secs = [...document.querySelectorAll('main > section, main > div, main > p, main > ol, main > nav, header, nav.toc, footer')];
      res.base = document.documentElement.scrollWidth;
      secs.forEach((s, i) => { const d = s.style.display; s.style.display = 'none'; const w = document.documentElement.scrollWidth; s.style.display = d; if (w < res.base) res[(s.id || s.tagName + i)] = w; });
      const ws = [...document.querySelectorAll('.widget')]; ws.forEach(s => { const d = s.style.display; s.style.display = 'none'; const w = document.documentElement.scrollWidth; s.style.display = d; if (w < res.base) res['w:' + s.dataset.widget] = w; });
      return res; }"""))
    b.close()
