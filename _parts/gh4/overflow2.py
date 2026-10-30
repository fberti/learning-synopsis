import sys
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={"width":390,"height":900})
    for u in sys.argv[1:]:
        pg.goto(u); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(1500)
        print(u.split("/")[-2], pg.evaluate("[document.documentElement.scrollWidth, document.documentElement.clientWidth]"),
          pg.evaluate("""(()=>{const W=document.documentElement.clientWidth;let best=null;document.querySelectorAll('body *').forEach(e=>{if(e.closest('svg'))return;const r=e.getBoundingClientRect();if(r.right>W+1&&!e.closest('.tw,pre,.katex-mathml')){const anc=[...document.querySelectorAll('body *')].includes(e);if(!best||r.right>best.r)best={r:Math.round(r.right),t:e.tagName+'.'+e.className,x:(e.textContent||'').slice(0,50)}}});return best})()"""))
    b.close()
