/* =========================================================
   Synopsis – általános kvízmotor
   ---------------------------------------------------------
   Használat:
     <div class="quiz" data-quiz="azonosito"></div>
     Quiz.mountAll({ azonosito: { title: "...", questions: [...] } })

   Minden kvíz lenyíló (<details>) mögött jelenik meg, és minden kérdés
   feleletválasztós (kattintással válaszolható).

   Kérdéstípusok:
     single   – egy helyes válasz          { options:[...], answer: 2 }
                shuffle: true → a válaszok sorrendje véletlen
     multi    – több helyes válasz         { options:[...], answer: [0,3] }
     match    – párosítás legördülővel     { pairs: [[bal, jobb], ...] }
     set      – elemek kijelölése          { items:[...], answer:[...] }  → multi-ként jelenik meg
     numeric  – (elavult) számválasz       { answer: 0.1389, tol: 0.002, unit: "" }
                → automatikusan egyválaszos lesz; a rossz válaszok jöhetnek a
                  distractors:[...] mezőből, különben a motor generálja őket.
                  Új kérdésnél inkább single + kézzel írt rossz válaszok!
   Minden kérdéshez adható: explain (magyarázat, HTML + KaTeX) és
   hint (lenyitható „💡 Tipp”: ötlet a megoldáshoz, a választ nem árulja el).
   Új kvízeknél a hint kötelező – lásd README.md / CLAUDE.md.
   ========================================================= */
(function () {
  "use strict";
  const el = (tag, cls, html) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  };
  const shuffle = a => {
    const b = a.slice();
    for (let i = b.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [b[i], b[j]] = [b[j], b[i]];
    }
    return b;
  };
  const render = node => window.Synopsis && window.Synopsis.renderMath(node);

  /* "5/36", "0,139", "13:3" (arány → hányados), "1 - 1/8" nem támogatott */
  function parseNum(s) {
    if (s == null) return NaN;
    s = String(s).trim().replace(/\s+/g, "").replace(",", ".");
    if (!s) return NaN;
    let m = s.match(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/);
    if (m) return parseFloat(m[1]) / parseFloat(m[2]);
    m = s.match(/^(-?\d+(?:\.\d+)?)%$/);
    if (m) return parseFloat(m[1]) / 100;
    return /^-?\d+(\.\d+)?(e-?\d+)?$/i.test(s) ? parseFloat(s) : NaN;
  }

  /* Szám magyar formátumban (tizedesvessző), a tűréshez illő pontossággal */
  function fmtNum(v, tol) {
    if (Number.isInteger(v))
      return v.toLocaleString("hu-HU").replace(/\u00a0/g, " ");
    let d = 4;
    if (tol != null && tol > 0) d = Math.max(0, Math.min(6, Math.ceil(-Math.log10(tol))));
    const r = +v.toFixed(d);
    return String(r).replace(".", ",");
  }

  /* numeric → single: helyes válasz + 3 rossz (megadott vagy generált) */
  function numericToSingle(q) {
    const a = q.answer;
    const tol = q.tol != null ? q.tol : Math.max(1e-3, Math.abs(a) * 0.005);
    const far = x => Math.abs(x - a) > Math.max(tol * 3, Math.abs(a) * 0.04, 1e-9);
    let wrong = (q.distractors || []).slice();
    if (wrong.length < 3) {
      const isInt = Number.isInteger(a);
      const cand = isInt
        ? [a + 1, a - 1, 2 * a, Math.round(a / 2), a + 2, a * 3, a + 10]
        : a > 0 && a < 1
          ? [1 - a, a / 2, 2 * a, a * a, Math.sqrt(a), a + 0.1, a - 0.1, a + 0.05]
          : [a * 2, a / 2, -a, a + 1, a - 1, a * 1.5, a * 0.75];
      const seen = wrong.filter(x => typeof x === "number");
      for (const c of shuffle(cand)) {
        if (wrong.length >= 3) break;
        if (!isFinite(c) || !far(c)) continue;
        if (a >= 0 && c < 0) continue;
        if (a > 0 && a <= 1 && (c <= 0 || c > 1)) continue;
        if (isInt && !Number.isInteger(c)) continue;
        if (seen.some(x => Math.abs(x - c) < 1e-9)) continue;
        seen.push(c); wrong.push(c);
      }
    }
    const show = x => (typeof x === "number" ? fmtNum(x, tol) : x) + (q.unit && typeof x === "number" ? " " + q.unit : "");
    q.options = [show(a), ...wrong.slice(0, 3).map(show)];
    q.answer = 0;
    q.shuffle = true;
    q.type = "single";
  }

  function mount(root, orig) {
    const spec = JSON.parse(JSON.stringify(orig)); // munkapéldány – az eredeti érintetlen marad
    const id = root.getAttribute("data-quiz");
    const wasOpen = !!root.querySelector(":scope > details[open]");
    root.innerHTML = "";
    const det = el("details", "quiz-wrap");
    if (wasOpen) det.open = true;
    const head = el("summary", "quiz-head");
    head.appendChild(el("span", "qt", spec.title || "Kvíz"));
    const qs = el("span", "qs", "");
    head.appendChild(qs);
    const body = el("div", "quiz-body");
    const foot = el("div", "quiz-foot");
    det.append(head, body, foot);
    root.appendChild(det);

    const state = { answered: 0, correct: 0, total: spec.questions.length };
    const upd = () => (qs.textContent = `${state.answered}/${state.total} kérdés · ${state.correct} helyes`);
    upd();

    if (spec.intro) body.appendChild(el("p", "muted", spec.intro));

    spec.questions.forEach((q, i) => {
      const box = el("div", "qq");
      const txt = el("div", "qtext");
      txt.innerHTML = `<span class="qn">${i + 1}.</span>${q.q}`;
      box.appendChild(txt);
      if (q.hint) {
        const hd = el("details", "qhint-box");
        hd.innerHTML = `<summary>💡 Tipp</summary><div>${q.hint}</div>`;
        box.appendChild(hd);
      }
      const fb = el("div", "qfeedback");

      const finish = ok => {
        state.answered++;
        if (ok) state.correct++;
        fb.className = "qfeedback show " + (ok ? "ok" : "no");
        fb.innerHTML = `<span class="verdict">${ok ? "✔ Helyes!" : "✘ Nem egészen."}</span>${q.explain || ""}`;
        render(fb);
        upd();
        if (state.answered === state.total) done();
      };

      let type = q.type || (Array.isArray(q.answer) ? "multi" : q.options ? "single" : "numeric");
      if (type === "numeric") { numericToSingle(q); type = "single"; }
      if (type === "set") {
        const its = q.items.map(String), ans = new Set(q.answer.map(String));
        q.options = its;
        q.answer = its.map((x, k) => (ans.has(x) ? k : -1)).filter(k => k >= 0);
        q.setLayout = true;
        type = "multi";
      }
      if (q.shuffle && (type === "single" || type === "multi")) {
        const order = shuffle(q.options.map((_, k) => k));
        q.options = order.map(k => q.options[k]);
        q.answer = Array.isArray(q.answer) ? q.answer.map(a => order.indexOf(a)) : order.indexOf(q.answer);
      }

      if (type === "single" || type === "multi") {
        const wrap = el("div", "qopts" + (q.setLayout ? " row" : ""));
        const btns = q.options.map((o, k) => {
          const b = el("button", "qopt" + (type === "multi" ? " sq" : ""));
          b.type = "button";
          b.innerHTML = `<span class="mark"></span><span>${o}</span>`;
          b.dataset.k = k;
          wrap.appendChild(b);
          return b;
        });
        box.appendChild(wrap);
        if (type === "single") {
          btns.forEach(b => b.addEventListener("click", () => {
            const k = +b.dataset.k;
            btns.forEach(x => (x.disabled = true));
            btns[q.answer].classList.add("correct");
            btns[q.answer].querySelector(".mark").textContent = "✓";
            if (k !== q.answer) { b.classList.add("wrong"); b.querySelector(".mark").textContent = "✗"; }
            finish(k === q.answer);
          }));
        } else {
          btns.forEach(b => b.addEventListener("click", () => b.classList.toggle("sel")));
          if (!q.setLayout) txt.insertAdjacentHTML("beforeend", ` <span class="muted qhint">(több helyes válasz is lehet)</span>`);
          const ok = el("button", "btn primary", "Ellenőrzés");
          ok.type = "button";
          ok.style.marginTop = ".5rem";
          ok.addEventListener("click", () => {
            const sel = btns.filter(b => b.classList.contains("sel")).map(b => +b.dataset.k);
            const ans = new Set(q.answer);
            btns.forEach((b, k) => {
              b.disabled = true;
              b.classList.remove("sel");
              if (ans.has(k)) { b.classList.add("correct"); b.querySelector(".mark").textContent = "✓"; }
              else if (sel.includes(k)) { b.classList.add("wrong"); b.querySelector(".mark").textContent = "✗"; }
            });
            ok.remove();
            finish(sel.length === ans.size && sel.every(k => ans.has(k)));
          });
          box.appendChild(ok);
        }
      } else if (type === "numeric") {
        const line = el("div", "qinline");
        const inp = el("input", "qinput");
        inp.type = "text";
        inp.placeholder = q.placeholder || "pl. 0,25 vagy 1/4";
        const ok = el("button", "btn primary", "Ellenőrzés");
        ok.type = "button";
        line.append(inp);
        if (q.unit) line.append(el("span", "muted", q.unit));
        line.append(ok);
        box.appendChild(line);
        const go = () => {
          const v = parseNum(inp.value);
          if (isNaN(v)) { inp.classList.add("wrong"); inp.focus(); return; }
          const tol = q.tol != null ? q.tol : Math.max(1e-3, Math.abs(q.answer) * 0.005);
          const good = Math.abs(v - q.answer) <= tol;
          inp.classList.remove("wrong");
          inp.classList.add(good ? "correct" : "wrong");
          inp.disabled = true;
          ok.remove();
          finish(good);
        };
        ok.addEventListener("click", go);
        inp.addEventListener("keydown", e => { if (e.key === "Enter") go(); });
      } else if (type === "match") {
        const grid = el("div", "qmatch");
        const rights = q.choices || [...new Set(q.pairs.map(p => p[1]))];
        const opts = q.shuffle === false ? rights : shuffle(rights);
        const sels = q.pairs.map(([l]) => {
          grid.appendChild(el("div", "l", l));
          const s = document.createElement("select");
          s.innerHTML = `<option value="">— válassz —</option>` + opts.map(r => `<option>${r}</option>`).join("");
          grid.appendChild(s);
          const r = el("span", "res", "");
          grid.appendChild(r);
          return { s, r };
        });
        box.appendChild(grid);
        const ok = el("button", "btn primary", "Ellenőrzés");
        ok.type = "button";
        ok.style.marginTop = ".6rem";
        ok.addEventListener("click", () => {
          let all = true;
          sels.forEach(({ s, r }, k) => {
            const good = s.value === q.pairs[k][1];
            all = all && good;
            r.textContent = good ? "✓" : "✗";
            r.style.color = good ? "var(--ok)" : "var(--bad)";
            if (!good) s.title = "Helyes: " + q.pairs[k][1];
            s.disabled = true;
          });
          ok.remove();
          if (!all) {
            const sol = q.pairs.map(p => `<li>${p[0]} → <b>${p[1]}</b></li>`).join("");
            q.explain = `<ul style="margin:.3rem 0">${sol}</ul>` + (q.explain || "");
          }
          finish(all);
        });
        box.appendChild(ok);
      } else if (type === "set") {
        const wrap = el("div", "qset");
        const chips = q.items.map(it => {
          const b = el("button", "btn setitem", String(it));
          b.type = "button";
          b.addEventListener("click", () => b.classList.toggle("on"));
          wrap.appendChild(b);
          return b;
        });
        box.appendChild(wrap);
        const ok = el("button", "btn primary", "Ellenőrzés");
        ok.type = "button";
        ok.style.marginTop = ".6rem";
        ok.addEventListener("click", () => {
          const ans = new Set(q.answer.map(String));
          let good = true;
          chips.forEach(c => {
            const on = c.classList.contains("on"), should = ans.has(c.textContent);
            if (on !== should) good = false;
            c.disabled = true;
            c.style.borderColor = should ? "var(--ok)" : on ? "var(--bad)" : "";
            c.style.background = should ? "var(--ok-soft)" : on ? "var(--bad-soft)" : "";
          });
          ok.remove();
          finish(good);
        });
        box.appendChild(ok);
      }
      box.appendChild(fb);
      body.appendChild(box);
    });

    function done() {
      const pct = Math.round((state.correct / state.total) * 100);
      const msg = pct === 100 ? "Tökéletes! 🏆" : pct >= 70 ? "Szép munka! 👏" : pct >= 40 ? "Jó úton jársz – nézd át a magyarázatokat! 🙂" : "Érdemes még egyszer átolvasni a részt. 📖";
      foot.innerHTML = `<span class="score">Eredmény: ${state.correct}/${state.total} (${pct}%) – ${msg}</span>`;
      const again = el("button", "btn", "↻ Újrakezdem");
      again.type = "button";
      again.addEventListener("click", () => mount(root, orig));
      foot.appendChild(again);
      foot.classList.add("show");
      if (id && window.Synopsis) window.Synopsis.Progress.save(id, state.correct, state.total);
    }
    render(root);
  }

  function mountAll(specs) {
    document.querySelectorAll(".quiz[data-quiz]").forEach(root => {
      const spec = specs[root.getAttribute("data-quiz")];
      if (spec) mount(root, spec);
    });
  }

  window.Quiz = { mountAll, parseNum };
})();
