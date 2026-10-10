# 10. fejezet – munkajegyzet (nem kerül commitba)
Mappa: mesterseges-intelligencia/10-halo-tanitasa/ (index.html, widgets.js, quizzes.js, digits-data.js)
Kvízek: ai10-101 … ai10-108, ai10-final. Számolások: _parts/calc/c10*.py (run.sh), t109.js (node, ml.js-sel: opt|batch|init|seeds|over|es)
HTML-részek: _parts/ch10/*.html → összefűzés. Widgetek: w0.js (közös fej) + w1.js (ügynök: loss-compare, batch-size-noise, backprop-stepper, compute-graph)
 + w2.js (ügynök: optimizer-race, deep-signal, train-monitor, digit-trainer) + w9.js (init) → widgets.js
Források: src-A.md (MDL, DLV – ügynök), src-B.md (PDL, MLQ, MLSYS, ESL – ügynök). ml.js bővítve (dropout, momentum, rmsprop, init); eredeti: bak/ml.js.orig

## Fejezet kérdése: a 9.7 számjegyhálójának 1210 súlyát ki állította be? (melyiket merre, egyszerre mindet)
## Szakaszok (lépések)
10.1 veszteség: a) −ln p (p(3)=0,74 → 0,301; 0,4 → 0,916; 0,05 → 2,996) b) miért log: szigmoid+MSE vs CE, z=−4: grad −0,0173 vs −0,982 (56,6×) c) párosítás → δ = ŷ − y; softmax z=(2,1,0): p=(0,665;0,245;0,090)
10.2 SGD: a) ciklus (előre, veszteség, vissza, frissítés), 1047/32 → 33 lépés b) kötegzaj: g=(−6,−2,2,10) átlag 1; B=2 párok átlagai −4…6; σ/√B c) η és B együtt, digits: B=1047 20 epoch 25,3%
10.3 backprop: a) 1 neuron x=2,w=0,5,b=−1,y=1 → p=0,5, L=0,693, ∂w=−1, ∂b=−0,5; η=0,5 → L=0,252
   b) 2–2–1: x=(1,2), W1=[[0,5;0,25];[−1;1]], b1=(0;0,5), W2=(1;−1), b2=0,5 → h=(1;1,5), ŷ=0,5; δ1=(−0,5;0,5); η=0,1 → L 0,3696 (sorozat 0,6931 0,3696 0,2416 0,1764 0,1374)
   c) költség: numerikus deriválás 1210+1 előremenet vs 1 előre + 1 vissza; gradiensellenőrzés ε=0,01 → −0,5000
10.4 gráf: (x+y)·z, 1,2,−3 → −9; x·y+x (3,2) → 3,3; kapuszabályok; előre/visszafelé mód
10.5 optimalizálók: a) momentum β=0,5 a 2.8 tálján (x²+3y², (2,1), η=0,1): 3 lépés után L 1,061 (GD) vs 0,684; állandó g: v=1;1,9;2,71 → 10 b) RMSProp/Adam első lépés = η (korrekció nélkül 3,16η) c) koszinusz 0,1→0,0854/0,05/0,0146
10.6 init: a) szimmetria (minden 0,5: azonos gradiensek), nulla init digits: 2,303, 10% b) Var(z)=n·Var(w)·Var(x); 0,5^20≈9,5e−7; He √(2/n) c) batch norm (1,3,5,7) → ±1,342, ±0,447; vágás (3,4)→(0,6;0,8)
10.7 reg: a) korai leállítás (n=100, 64 rejtett: legjobb 19. epoch 0,462 → 150.: 0,611; türelem 3 → 16-nál áll, 13. epoch) b) L2: (1−ηλ)w, 2·0,999^1000=0,735 c) dropout (2,4,6,8), p=0,25 → (2,667;0;8;10,667) d) adatbővítés
10.8 gyakorlat: kezdő veszteség ln10=2,303 (He: 2,398); 10 mag: 95,8–98,0%, átlag 96,9%; 7 mrd param × 16 B = 112 GB; lottószelvény
10.9 alkalmazás: digit-trainer; Adam 0,01: 1. epoch val 75,0%, teszt 98,0%; SGD 0,1 teszt 97,1%; RMSProp 98,2%; momentum 97,6%

## Állapot (frissítsd!)
- KÉSZ minden: index.html (00–10 részekből), widgets.js (w0+w1+w2+w9), quizzes.js (50 kérdés), digits-data.js; index-oldalak, README, TERV, 9. pager; böngészős ellenőrzés (calc/bc10.py: 0 KaTeX-hiba, 0 nyitott lenyíló, minden link él).
- Commit a felhasználó jóváhagyására vár. _parts/src új kivonatai (MDL10_*, DLV10_*, PDL10_*, MLQ10_*, MLSYS10_*, ESL10_*) könyvszövegek.
- Biztonsági másolatok: _parts/ch10/bak/ (ml.js.orig, ch9-index.html, ai-index.html, main-index.html, README.md, TERV.md)
