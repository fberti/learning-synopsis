from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={"width":380,"height":900})
    pg.goto("http://localhost:8813/matematikai-statisztika/03-ket-valtozo-kapcsolata/"); pg.wait_for_timeout(2500)
    print(pg.evaluate("""()=>{let e=document.querySelectorAll('.tw')[3];const out=[];
      while(e&&e!==document.body){const r=e.getBoundingClientRect();const cs=getComputedStyle(e);out.push([e.tagName,e.className,Math.round(r.left),Math.round(r.width),e.scrollWidth,cs.overflowX,cs.display,cs.minWidth]);e=e.parentElement}
      return out}"""))
    b.close()
