import sys
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": 380, "height": 800})
    pg.goto(f"http://localhost:{sys.argv[1]}/mesterseges-intelligencia/12-beagyazasok-figyelem/", wait_until="networkidle"); pg.wait_for_timeout(2000)
    print(pg.evaluate("""() => { const W = document.documentElement.clientWidth; const out = [];
      const clipped = e => { for (let a = e.parentElement; a && a !== document.body; a = a.parentElement) { const o = getComputedStyle(a).overflowX; if (o !== 'visible') return true; } return false; };
      document.querySelectorAll('body *').forEach(e => { const r = e.getBoundingClientRect(); if (r.right < 412 || r.right > 422) return;
        out.push(e.tagName + '.' + (e.className.baseVal ?? e.className) + ' R=' + Math.round(r.right) + ' | ' + (e.closest('.widget') ? e.closest('.widget').dataset.widget : (e.closest('section')||{}).id) + ' | ' + (e.innerText||'').slice(0,60).replace(/\\n/g,' ')); });
      return out.slice(0, 20); }"""))
    b.close()
