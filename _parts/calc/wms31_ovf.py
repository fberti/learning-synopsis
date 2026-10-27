import sys
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": 380, "height": 900})
    pg.goto(f"http://127.0.0.1:{sys.argv[1]}/_parts/ms3/wtest1.html"); pg.wait_for_timeout(1200)
    print(pg.evaluate("""[...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().right>380.5 && !e.closest('.tw')).slice(0,15).map(e=>e.tagName+'.'+e.className+' '+Math.round(e.getBoundingClientRect().right)+' '+(e.closest('.widget')||{}).id)"""))
    b.close()
