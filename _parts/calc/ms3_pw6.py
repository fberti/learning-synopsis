from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={"width":380,"height":900})
    pg.goto("http://localhost:8813/matematikai-statisztika/"+__import__("sys").argv[1]); pg.wait_for_timeout(2500)
    print(pg.evaluate("""()=>{const res=[];const sw=()=>document.documentElement.scrollWidth;res.push(['all',sw()]);
      for(const s of document.querySelectorAll('header, nav.toc, main > *, footer')){const d=s.style.display;s.style.display='none';res.push([s.tagName+'#'+s.id+'.'+s.className,sw()]);s.style.display=d;}
      return res.filter(r=>r[1]<res[0][1]||r[0]=='all')}"""))
    b.close()
