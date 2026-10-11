import sys
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": 380, "height": 800})
    pg.goto(f"http://localhost:{sys.argv[1]}/mesterseges-intelligencia/12-beagyazasok-figyelem/", wait_until="networkidle"); pg.wait_for_timeout(2000)
    print(pg.evaluate("""() => { const W = document.documentElement.clientWidth; const bad = [];
      document.querySelectorAll('main *').forEach(e => { const r = e.getBoundingClientRect(); if (r.right > W + 2 && !e.closest('.tw') && !e.closest('.katex-mathml') && !e.closest('.katex-display') && !(e.parentElement && e.parentElement.getBoundingClientRect().right > W + 2) && !e.closest('[style*=overflow]') && getComputedStyle(e).position !== 'fixed') bad.push(e.tagName + '.' + e.className + ' ' + Math.round(r.right) + ' ' + (e.closest('.widget') ? e.closest('.widget').dataset.widget : '') + ' ' + (e.innerText||'').slice(0,60)); });
      return {W, scrollW: document.documentElement.scrollWidth, bad: bad.filter(x => !x.startsWith('path') && !x.startsWith('svg') && !x.startsWith('line')).slice(0, 30)}; }"""))
    b.close()
