# 8. fejezet – munkajegyzet (nem kerül commitba; a végén törölni)

Mappa: mesterseges-intelligencia/08-felugyelet-nelkuli-tanulas/  (index.html, widgets.js, quizzes.js, digits-data.js)
Kvízek: ai8-81 … ai8-86, ai8-final. Számolások: _parts/calc/*.py (./run.sh file.py)
HTML-részek: _parts/ch8/*.html → összefűzve.

## Futó példa
Webes könyvesbolt („Lapozó”) vásárlói: (vásárlás/hó, átlagos kosár ezer Ft); az 1. fejezet A–H vásárlóinak bővítése.
A(2,25) B(3,30) C(2,28) D(12,5) E(15,4) F(11,6) G(3,27) H(14,5) I(7,14) J(8,16) K(6,15) L(14,28)
- 11 vásárló (L nélkül), standardizálva: k=3 sziluett 0,75 (legjobb); középpontok nyers: (2,5;27,5) (13;5) (7;15)
- 12 vásárló std: k=4 legjobb (0,689) mert L egyedül → anomália. L jellemzőnként IQR-en belül.
- kNN-távolság (std, k=2): L 2,04, a következő 0,64. Középponttól (nyers) L 11,51.
Ajánló: Anna, Bence, Csilla, Dávid × K1 K2 (krimi) S1 S2 (sci-fi); Anna S2 hiányzik.

## Szakaszok
8.1 k-közép: a) SSE, felosztások (A2 B3 F11 E15: 7 felosztás, min 8,5) b) Lloyd 6 ponton (ABDEFG, kezdés A,B: 1557→666,4→306,96→24)
   c) lokális optimum 0,2,10,12,20,22 k=3 kezdés 0,2,16 → SSE 104 vs 6; k-means++ 78%; újraindítás 1−0,7^10=97,2%
   d) könyök 8 vásárló: 1259, 26, 16, 7, 3, 2; sziluett k=2 0,89 e) korlátok: skála, alak, kiugró
8.2 a) dendrogram b) kapcsolás c) DBSCAN (+GMM tip)
8.3 a) vetítés: (−2,−2),(−1,1),(1,−1),(2,2): C=[[2,5;1,5],[1,5;2,5]], λ=4,1; Var(θ)=2,5+1,5 sin2θ  b) magyarázott variancia, rekonstrukció
   c) skálázás (wine: nyers PC1 ~99,8%) d) gyakorlat, korlát
8.4 t-SNE, UMAP (digits 800 pont: PCA 5-NN 63,8%, t-SNE ~95%, UMAP 96,4%, 64D 94,9%; PCA EVR 15,1% + 13,4%)
8.5 a) együtt furcsa (L) b) izolációs erdő c) rekonstrukciós hiba, értékelés
8.6 a) tartalomalapú b) kollaboratív c) mátrixfaktorizáció
8.7 alkalmazás: 12 vásárló; nagyban: wine (178×13)

## Forráshibák, amiket jelezni érdemes (sor: _parts/src)
- MLAB 1869: „scree plot” a k-közép SSE-görbéjére, „több törés” – a könyök egy törés; a scree a PCA-é.
- MLAB 1850: a k-közép „nem mindig talál végső felosztást” – mindig konvergál, csak lokális optimumba.
- MLAB 1667 / MLDI 665: kNN mint „klaszterezés” – felügyelt osztályozó.
- DLV 7625: „geometric means, or averages” – számtani közép.
- MLD 10455: PCA után az euklideszi távolság „jól működik” – a teljes PCA forgatás, a távolság nem változik.
- MLD 10366: mini-batch k-közép „lassabb” – gyorsabb.
- MLD 10659–10685: Calinski–Harabasz rossz értelmezése (nagyobb a jobb).
- ESL 14.33: Lloyd a súlyozatlan SSE-t csökkenti (N_k-súlyos alak a páronkénti változaté) – ★★★ megjegyzés.
- DLV 10571, MLSYS 103257: PCA mint „legfontosabb jellemzők kiválasztása” – kivonás, nem kiválasztás; nem a címkéhez optimalizál.
- DLV 10644: „largest range” – variancia, nem terjedelem.
- PDL 15393: t-SNE távolságai a valódi szétválást tükrözik – csak lokális.
- MLD 17785: koszinusz „százalék”, távolságfüggő – szögfüggő, [−1,1].
- MLD 18225: hiányzó = 0 az SVD előtt; MLD 18201: SVD új termékre is ajánl – hidegindítás.
- MLDI 2645–2661: hibás szorzatmátrix a mátrixfaktorizáció-példában.
- MDL 3423: Matplotlib „fliers” = bajusz – a fliers a kiugró pontok.
