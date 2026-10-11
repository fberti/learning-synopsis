import sys, json
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": 1280, "height": 900})
    errs = []
    pg.on("console", lambda m: m.type == "error" and errs.append(m.text)); pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(f"http://localhost:{sys.argv[1]}/mesterseges-intelligencia/12-beagyazasok-figyelem/", wait_until="networkidle"); pg.wait_for_timeout(2500)
    r = pg.evaluate("""() => ({quizWraps: document.querySelectorAll('.quiz details').length, quizOpenAtLoad: document.querySelectorAll('.quiz details[open]').length,
      practiceOpen: document.querySelectorAll('details.box.practice[open]').length, katexErr: document.querySelectorAll('.katex-error').length})""")
    pg.evaluate("document.querySelectorAll('details').forEach(d => d.open = true)"); pg.wait_for_timeout(1500)
    r2 = pg.evaluate("""() => ({katexErrAfterOpen: [...document.querySelectorAll('.katex-error')].map(e => e.getAttribute('title')).slice(0,10),
      rawDollar: [...document.querySelectorAll('.quiz *')].filter(e => e.children.length === 0 && /\\$[^$]+\\$/.test(e.textContent)).map(e => e.textContent.slice(0,80)).slice(0,10)})""")
    print(json.dumps({**r, **r2, "errors": errs[:10]}, ensure_ascii=False, indent=1))
    q = pg.query_selector('.quiz[data-quiz="ai12-125"]'); q.scroll_into_view_if_needed(); q.screenshot(path="_parts/ch12/shots/quiz125.png")
    b.close()
