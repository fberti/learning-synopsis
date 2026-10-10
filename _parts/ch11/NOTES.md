# 11. fejezet – munkajegyzet (nem kerül commitba)
Mappa: mesterseges-intelligencia/11-konvolucios-halok/ (index.html, widgets.js, quizzes.js, cnn-nets.js)
Kvízek: ai11-111 … ai11-118, ai11-final. Számolások: _parts/calc/c11_*.py (torch: uv run -q --index https://download.pytorch.org/whl/cpu --with torch --with scikit-learn python -I), t11_fwd.js (node)
HTML-részek: _parts/ch11/*.html → összefűzés. Widgetek: w0.js (közös fej + CNN-segédek) + w1.js (ügynök: shift-lab, convolution-lab, pooling-viz, receptive-field)
 + w2.js (ügynök: cnn-shapes, iou-viz, vit-patches, digit-cnn) + w9.js (init) → widgets.js
Források: src-A.md (DLV, HAW, MV), src-B.md (PDL, MLQ, MLSYS, AAMLP)

## Futó példa: 8×8 számjegy egy 16×16-os lapon (eltolás 4 + dx, 4 + dy), csak középre téve tanítva (seed 0, nets_s0.json)
- MLP 256–16–10 (4282 p): 436/450 = 96,9%; (1,0) 201 = 44,7%; (2,0) 53 = 11,8%; (1,1) 41 = 9,1%
- CNN-A conv3×3(8)–conv3×3(32)–globális max–FC (2746 p): 445 = 98,9% minden eltolásnál (dx −4…4, dy −3…3); dy=−4: 93,1–93,3%, dy=+4: 97,8%
- CNN-B + 2×2 max-pool az 1. konv után: 443 = 98,4%; (1,0) 359 = 79,8%; (1,1) 271 = 60,2%; (2,0) 443 = 98,4%
- CNN-B + eltolásos bővítés (±2): 443 = 98,4%; (1,0) 442 = 98,2%; (1,1) 439 = 97,6%
- 5 mag átlaga (c11_shift3/c11_size): MLP 97,2 / 44,6 / 13,7; CNN-B(8,32) 98,1 / 87,4 / 58,1; pool nélkül 98,7
- pixelkeverés (c11_perm2, 5 mag): MLP 97,2% → 97,2%; CNN-B 98,1% → 93,7%
- saját transzfer-kísérlet (0–4 → 5–9) NEM működött (fagyasztott 16 jellemző gyengébb a nulláról tanításnál) – nem használjuk; PDL/AAMLP számai

## Állapot (frissítsd!)
- KÉSZ: index.html (00–10 részekből), widgets.js (w0+w1+w2+w9), quizzes.js (61 kérdés), cnn-nets.js; index-oldalak, README, TERV, 10. pager; böngészős ellenőrzés OK. Commit jóváhagyásra vár. Biztonsági másolatok: _parts/ch11/bak/.
