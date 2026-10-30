import sys
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={"width":390,"height":900})
    pg.goto(sys.argv[1]); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(1500)
    print(pg.evaluate("""(()=>{const W=document.documentElement.clientWidth;const res=[];
      const clipped=e=>{for(let a=e.parentElement;a;a=a.parentElement){const o=getComputedStyle(a).overflowX;if(o==='auto'||o==='hidden'||o==='scroll')return true}return false};
      document.querySelectorAll('main *').forEach(e=>{if(e.closest('svg,.katex-mathml'))return;const r=e.getBoundingClientRect();if(r.right>W+1&&!clipped(e)){const blk=e.closest('p,li,div,td,h3');res.push(Math.round(r.right)+' '+(blk?blk.textContent.slice(0,70):''))}});
      return [...new Set(res)].slice(0,15)})()"""))
    b.close()
