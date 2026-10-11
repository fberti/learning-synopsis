from playwright.sync_api import sync_playwright
import os
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "ch12", "shots3")
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": 1280, "height": 900})
    errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto("http://localhost:8763/_parts/ch12/wtest3.html"); pg.wait_for_timeout(1000)
    tb = pg.locator('[data-widget="transformer-block"]')
    tb.get_by_role("button", name="GPT-2 small", exact=True).click()
    tb.locator("svg g path[style*='transparent']").first.dispatch_event("click")
    tb.screenshot(path=f"{OUT}/tb-gpt2-1280.png")
    pg.set_viewport_size({"width": 380, "height": 900}); pg.evaluate("document.documentElement.setAttribute('data-theme','dark')"); pg.wait_for_timeout(300)
    tb.locator("svg").screenshot(path=f"{OUT}/tb-gpt2-dark-380-svg.png")
    print("panel:", tb.locator(".two-canvas > div").nth(1).inner_text()[:80], errs)
    b.close()
