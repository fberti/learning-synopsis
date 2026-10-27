from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={"width":380,"height":900})
    pg.goto("http://localhost:8813/matematikai-statisztika/03-ket-valtozo-kapcsolata/"); pg.wait_for_timeout(2500)
    print(pg.evaluate("""()=>{const W=document.documentElement.clientWidth;const out=[];
      document.querySelectorAll('body *').forEach(e=>{const r=e.getBoundingClientRect(); if(r.right>W+1 && !(e.parentElement && e.parentElement.getBoundingClientRect().right>W+1)) out.push(e.tagName+'.'+e.className+' in #'+((e.closest('[id]')||{}).id)+' right='+Math.round(r.right)+' '+e.textContent.slice(0,40))});
      return [document.documentElement.scrollWidth,W,out.slice(0,15)]}"""))
    b.close()
