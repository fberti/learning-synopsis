import sys
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": 380, "height": 800})
    pg.goto(f"http://localhost:{sys.argv[1]}/mesterseges-intelligencia/12-beagyazasok-figyelem/", wait_until="networkidle"); pg.wait_for_timeout(2000)
    print(pg.evaluate("""() => { const W = document.documentElement.clientWidth; const out = [];
      document.querySelectorAll('body *').forEach(e => { if (e.closest('.katex-mathml')) return; const r = e.getBoundingClientRect(); if (r.width === 0) return;
        if (r.right > W + 2) { const pr = e.parentElement.getBoundingClientRect(); if (pr.right <= W + 2) out.push(e.tagName + '.' + (e.className.baseVal ?? e.className) + ' R=' + Math.round(r.right) + ' parent=' + e.parentElement.tagName + '.' + e.parentElement.className + ' | ' + (e.closest('.widget') ? e.closest('.widget').dataset.widget : (e.closest('section')||{}).id) + ' | ' + (e.innerText||'').slice(0,50).replace(/\\n/g,' ')); } });
      return out.slice(0, 25); }"""))
    b.close()
