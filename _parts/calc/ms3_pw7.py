from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={"width":380,"height":900})
    pg.goto("http://localhost:8813/matematikai-statisztika/03-ket-valtozo-kapcsolata/"); pg.wait_for_timeout(2500)
    print(pg.evaluate("""()=>{const sw=()=>document.documentElement.scrollWidth;const r=[sw()];
      document.querySelectorAll('main > *').forEach(s=>s.style.display='none'); r.push(sw());
      document.querySelectorAll('main > *').forEach(s=>s.style.display='');
      document.querySelectorAll('.katex-display').forEach(s=>s.style.display='none'); r.push(sw());
      document.querySelectorAll('.katex-display').forEach(s=>s.style.display='');
      document.querySelectorAll('.tw').forEach(s=>s.style.display='none'); r.push(sw());
      document.querySelectorAll('.tw').forEach(s=>s.style.display='');
      document.querySelectorAll('.widget').forEach(s=>s.style.display='none'); r.push(sw());
      document.querySelectorAll('.widget').forEach(s=>s.style.display='');
      document.querySelectorAll('.katex').forEach(s=>s.style.display='none'); r.push(sw());
      return r}"""))
    b.close()
