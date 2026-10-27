from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch()
    for url in ["matematikai-statisztika/03-ket-valtozo-kapcsolata/","matematikai-statisztika/02-egy-valtozo-leirasa/"]:
      for w in (1280,380):
        pg=b.new_page(viewport={"width":w,"height":900}); pg.goto("http://localhost:8813/"+url); pg.wait_for_timeout(2000)
        r=pg.evaluate("""()=>{const W=window.innerWidth;const out=[];
          document.querySelectorAll('main *').forEach(e=>{const r=e.getBoundingClientRect(); if(r.right>W+1){
            let p=e.parentElement, inScroll=false; while(p){const o=getComputedStyle(p).overflowX; if(o==='auto'||o==='scroll'){inScroll=true;break;} p=p.parentElement}
            if(!inScroll) out.push(e.tagName+'.'+e.className+' #'+(e.closest('[id]')||{}).id+' r='+Math.round(r.right))}});
          return {sw:document.documentElement.scrollWidth, W, n:out.length, first:out.slice(0,12)}}""")
        print(url[-25:],w,r); pg.close()
    b.close()
