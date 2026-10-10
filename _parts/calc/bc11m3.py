import sys
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 400, "height": 800})
    pg.goto(f"http://localhost:{sys.argv[1]}/{sys.argv[2]}", wait_until="networkidle"); pg.wait_for_timeout(1500)
    pg.evaluate("document.querySelectorAll('details').forEach(d => d.open = true)"); pg.wait_for_timeout(500)
    for r in pg.evaluate("""() => { const W = document.documentElement.clientWidth; const out = [];
       document.querySelectorAll('.katex-display, table, .katex').forEach(e => { const r = e.getBoundingClientRect();
         if (r.right > W + 1 && !e.closest('.katex-display') ^ e.classList.contains('katex-display') || (e.tagName==='TABLE' && r.right > W+1)) { let a = e; while (a && !a.id) a = a.parentElement;
           out.push(e.tagName + '.' + e.className + ' right=' + Math.round(r.right) + ' #' + (a ? a.id : '') + ' :: ' + e.innerText.replace(/\\s+/g,' ').slice(0, 70)); } });
       return out; }"""): print(r)
    b.close()
