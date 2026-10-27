from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch()
    for w in (1280,380):
        pg=b.new_page(viewport={"width":w,"height":900}); pg.goto("http://localhost:8813/matematikai-statisztika/03-ket-valtozo-kapcsolata/"); pg.wait_for_timeout(2000)
        r=pg.evaluate("""()=>{const W=document.documentElement.clientWidth;const out=[];
          const bad=e=>{if(e.closest('.katex-mathml'))return false;const r=e.getBoundingClientRect();if(r.right<=W+1||r.width==0)return false;
            let p=e.parentElement;while(p){const o=getComputedStyle(p).overflowX;if(o==='auto'||o==='scroll'||o==='hidden')return false;p=p.parentElement}return true};
          document.querySelectorAll('main *').forEach(e=>{if(bad(e)&&!(e.parentElement&&bad(e.parentElement))){
            out.push(e.tagName+' in #'+(e.closest('[id]')||{}).id+' w='+Math.round(e.getBoundingClientRect().width)+' :'+e.textContent.slice(0,50).replace(/\\s+/g,' '))}});
          return out}""")
        print(w); [print("  ",x) for x in r]; pg.close()
    b.close()
