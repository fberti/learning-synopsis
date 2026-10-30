import sys
from playwright.sync_api import sync_playwright
url=sys.argv[1]
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={"width":390,"height":900})
    pg.goto(url); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(1500)
    print(pg.evaluate("""(()=>{const W=document.documentElement.clientWidth;const out=[];document.querySelectorAll('main *').forEach(e=>{const r=e.getBoundingClientRect();if(r.right>W+1&&!e.closest('.tw,pre,.katex-display,.katex-mathml'))out.push(e.tagName+'.'+e.className+' '+Math.round(r.right)+' '+(e.textContent||'').slice(0,40))});return out.slice(0,12)})()"""))
    b.close()
