from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={"width":380,"height":900})
    pg.goto("http://localhost:8813/matematikai-statisztika/03-ket-valtozo-kapcsolata/"); pg.wait_for_timeout(2500)
    print(pg.evaluate("""()=>{const sw=()=>document.documentElement.scrollWidth;const r=[];const base=sw();
      document.querySelectorAll('.tw').forEach((s,i)=>{s.style.display='none';const v=sw();if(v<base)r.push([i,v,(s.closest('[id]')||{}).id,s.parentElement.className,s.textContent.slice(0,40)]);s.style.display='';});
      return r}"""))
    b.close()
