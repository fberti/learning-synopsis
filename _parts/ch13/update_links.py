import re
Q = "ai13-131,ai13-132,ai13-133,ai13-134,ai13-135,ai13-136,ai13-137,ai13-138,ai13-139,ai13-1310,ai13-1311,ai13-final"
p = 'mesterseges-intelligencia/index.html'; s = open(p).read()
old = s[s.index('      <li class="disabled"><span class="num">13</span>'):s.index('      <li class="disabled"><span class="num">14</span>')]
new = '''      <li><span class="num">13</span><div>
        <h3><a href="13-graf-neuralis-halok/">Gráf neurális hálók</a> <span class="badge ready">elkészült</span></h3>
        <p>Gráfok mint adat, szomszédsági mátrix, séták · csúcs-, él-, gráfszintű feladatok · átszámozás, invariancia és ekvivariancia · kézi jellemzők, DeepWalk, címketerjesztés · üzenetküldés kézzel, recepciós mező · GCN, a karateklub két címkéből · GraphSAGE, GAT, GIN · kiolvasás, kapcsolat-előrejelzés, szivárgás · Weisfeiler–Leman-teszt, túlsimítás, túlnyomás, heterofília · gráf-Transformerek · ekvivariáns GNN-ek · alkalmazások és gráfok + LLM-ek (📅 2026) · Cora és MUTAG valódi adatokon.</p>
        <div class="mini-progress" data-progress="%s"><span></span></div>
        <small data-progress-label></small>
      </div></li>
''' % Q
s = s.replace(old, new)
s = s.replace('<a href="12-beagyazasok-figyelem/">12. fejezet</a> már olvasható', '<a href="13-graf-neuralis-halok/">13. fejezet</a> már olvasható')
open(p, 'w').write(s)
p = 'index.html'; s = open(p).read()
s = s.replace('12 fejezet elkészült', '13 fejezet elkészült')
s = s.replace('ai12-127,ai12-final"', 'ai12-127,ai12-final,' + Q + '"')
open(p, 'w').write(s)
p = 'mesterseges-intelligencia/12-beagyazasok-figyelem/index.html'; s = open(p).read()
s = s.replace('<span class="next muted">13. Gráf neurális hálók (hamarosan) →</span>', '<a class="next" href="../13-graf-neuralis-halok/">13. Gráf neurális hálók →</a>')
open(p, 'w').write(s)
p = '_parts/ch12/10-end.html'; s = open(p).read()
s = s.replace('<span class="next muted">13. Gráf neurális hálók (hamarosan) →</span>', '<a class="next" href="../13-graf-neuralis-halok/">13. Gráf neurális hálók →</a>')
open(p, 'w').write(s)
p = 'README.md'; s = open(p).read()
s = s.replace("    └── 12-beagyazasok-figyelem/    ← index.html, widgets.js (calc.js), quizzes.js, glove-data.js (GloVe-részhalmaz), real-attention.js (huBERT, opus-mt), review-models.js (hat kritikamodell)",
 "    ├── 12-beagyazasok-figyelem/    ← index.html, widgets.js (calc.js), quizzes.js, glove-data.js (GloVe-részhalmaz), real-attention.js (huBERT, opus-mt), review-models.js (hat kritikamodell)\n    └── 13-graf-neuralis-halok/     ← index.html, widgets.js (calc.js), quizzes.js, graph-data.js (karateklub), cora-data.js (Cora: t-SNE-térképek, jóslatok), mutag-data.js (188 molekula, keresztvalidált jóslatok, élő GIN súlyai)")
open(p, 'w').write(s)
