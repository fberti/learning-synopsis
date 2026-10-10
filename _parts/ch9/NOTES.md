# 9. fejezet – munkajegyzet
Mappa: mesterseges-intelligencia/09-neuralis-halozatok/ (index.html, widgets.js, quizzes.js, digit-net.js) + új közös assets/ml.js
Kvízek: ai9-91 … ai9-96, ai9-final. Számolások: _parts/calc/c9*.py (./run.sh). HTML-részek: _parts/ch9/*.html → összefűzés.
Források: src-A.md, src-B.md (forráshibák!), szövegek: _parts/src/*.txt

## Fejezet kérdése: hogyan ismer fel egy „összead és tüzel” egységekből álló háló egy kézzel írt számjegyet? (8×8 digits, 64–16–10)
## Szakaszok
9.1 a) súlyozott összeg + torzítás (3 pixeles csík-detektor w=(−1,2,−1)) b) lépcső → logikai kapuk (ÉS/VAGY/NEM/NAND, McCulloch–Pitts) c) geometria: egyenes, normálvektor, sablon; biológia határai. widget neuron-lab
9.2 a) perceptron szabály, ÉS kézzel b) konvergencia (Novikoff 1962 – Kiegészítés), sorrendfüggés c) XOR ciklus, Minsky–Papert, első tél (forráshibák). widget perceptron-train
9.3 a) XOR 2 rejtett neuronnal (VAGY, ÉS), rejtett tér b) mátrixos alak h=φ(Wx+b), köteg H=φ(XWᵀ+b) c) aktiváció nélkül összeomlik (DLV 60A+80B hiba). widget hidden-space
9.4 a) lépcső → szigmoid, tanh (derivált) b) ReLU, eltűnő gradiens, halott ReLU, GELU c) kimeneti réteg (identitás/szigmoid/softmax). widget activation-gallery
9.5 a) ReLU-darabok összege (x² közelítése) b) a tétel (Cybenko 1989, Hornik 1991, Leshno 1993) c) mélység vs szélesség (sátortérkép, 2^L darab). widget relu-sum
9.6 a) forward pass lépésről lépésre b) paraméterszám, memória, MAC. widget param-counter
9.7 a) játszótér (nn-playground) b) a számjegyfelismerő (digit-mlp)

## Állapot (frissítsd!)
- KÉSZ: assets/ml.js; widgets w0–w4.js → ../../mesterseges-intelligencia/09-neuralis-halozatok/widgets.js (cat w0..w4); digit-net.js; 00-head.html
- Widget-javítások (relu-sum render, playground cv.draw, hidden-space tempó) a w*.js-ben megvannak, de a widgets.js-t újra össze kell fűzni!
- KÉSZ minden (html, quizzes, index-oldalak, README, TERV, 8. pager, böngészős ellenőrzés). Commit a felhasználó jóváhagyására vár; _parts/src (könyvszövegek) NE kerüljön commitba., 08-end.html, quizzes.js, index-oldalak, README, TERV, előző pager, böngészős ellenőrzés (calc/bc9.py)
- Konvenciók: lépcső(z)=1 ha z>0; perceptron w0=0,b0=0, η=1, sorrend (0,0),(0,1),(1,0),(1,1); VAGY: 4 epoch/4 frissítés → w=(1,1), b=0; ÉS: 6 epoch/10 frissítés → (2,1),−2; fordítva (1,2),−2; XOR: 2. epochtól ciklus w=(−1,0), b=1
- Osztályszínek: 1 = narancs (--setB), 0 = kék (--setA)
