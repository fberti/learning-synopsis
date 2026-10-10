# Ch9 forráskivonat B – PDL, MDL, ESL, MLSYS, MLQ

Szövegfájlok: `_parts/src/{PDL,MDL,ESL,MLSYS,MLQ}.txt` (pdftotext -layout). Az `Lnnn` a .txt fájl sorszáma.
PDL = PDF 201–282. o. (8–10. fejezet) · MDL = 276–301. o. (9. fejezet) · ESL = 146–154. o. (4.5) + 407–435. o. (11. fejezet) + 155. o. (Ex. 4.6, a végére fűzve, L2080) ·
MLSYS = 163–252. o. (DL Primer) + 253–265. o. (DNN Arch., MLP rész) · MLQ = 113–124. o. (11–12. fejezet).
Minden paraméterszámot és számpéldát `python3 -I`-vel ellenőriztem (a ✓ jelentése: egyezik).

## 1. Jelölés-összevetés (fontos: a források keverik)
| Forrás | Vektor | W alakja | Képlet |
|---|---|---|---|
| PDL ch8 L595–602 | oszlop (matematikában) | 3×2 = (kimenet × bemenet) | a = h(Wx + b); a kód viszont (bemenet × kimenet) alakot használ (sklearn `coefs_`), L797–806 |
| MDL L177–189 | oszlop, m×1 | n×m (kimenet × bemenet) | a_i = σ(W_i a_{i−1} + b_i) – **a legtisztább, ezt érdemes átvenni** |
| ESL (11.5) L597–600 | oszlop | α_m sorvektorok | Z_m = σ(α_0m + α_mᵀX), T_k = β_0k + β_kᵀZ, f_k = g_k(T) |
| MLSYS 3.4.2 L1581–1593 | sor (xᵀ) | n×m (bemenet × kimenet) | z = xᵀW + b |
| MLSYS 3.5.2 L2148, L2197–2200 | vegyes | n1×784, de kimenet n_{L−1}×10 | Z = WA + b, miközben X: B×784 → **ellentmondás** (lásd 4. rész) |
| MLSYS 4.2.2 L4879, L4914–4916 | „sorvektor” | d_out×d_in | h = f(Wh + b) → **ellentmondás** |
| MLQ L166–168 | – | w_{kimenet,bemenet} | Node1 = w11x1+…+w14x4+b1 |
- ESL a paramétereket „weights”-nek hívja, a torzításokat (bias) is beleértve (11.8, L717–719): M(p+1) + K(M+1).
- PDL: a csomópont a = h(w0x0 + w1x1 + … + b) (L141); a „neuron/node” elnevezésről L74–105; MLP = ANN = NN (L148–152).

## 2. Átvehető magyarázatok (röviden)
- **Lineáris aktivációval a háló összeomlik:** PDL L186–219: h(x)=5x−3, két csomópont, levezetés: a1 = (25w1w0)x + (25w1b0 − 15w1 + 5b1 − 3) = Wx + B. Szép, kézzel ellenőrizhető. ESL L673–676: ha σ = identitás, a modell lineáris. ESL L861–865: közel nulla súlyoknál a szigmoid a lineáris tartományában dolgozik, így a háló „majdnem lineáris”.
- **Teljesen összekötött + előrecsatolt (fully connected, feedforward)** definíciója: PDL L59–70.
- **Kimeneti réteg:** regresszióhoz identitás, bináris esetben szigmoid + 0,5-ös küszöb, több osztálynál softmax (PDL L443–460). Két osztálynál a softmax = szigmoid (PDL L539–542; pontosabban σ(a1−a0)).
- **Numerikusan stabil softmax:** a legnagyobb logitot vonjuk ki (PDL L543–565).
- **A neurális háló mint PPR / bázisfüggvény-kifejtés:** ESL L644–652 (a rejtett egységek tanult bázisfüggvények), L681–695 (g_m(ω_mᵀX) = β_m σ(α_0m + ‖α_m‖ ω_mᵀX)). A PPR univerzális approximátor (L476–478). Az X1·X2 szorzat felírható így: [(X1+X2)² − (X1−X2)²]/4 (L473–475) → szemléletes „miért kell nemlinearitás”.
- **Lépcsőfüggvény → szigmoid:** a korai neuronok küszöbre „tüzeltek”; a lépcső nem elég sima az optimalizáláshoz (ESL L696–707). σ(sv): nagy s esetén kemény küszöb (ESL 11.3. ábra, L667–671; az „s = 21” a pdftotext hibája, helyesen s = 1/2).
- **Perceptron tanulási szabály (ESL 4.5.1, L167–219):** D(β,β0) = −Σ_{i∈M} y_i(x_iᵀβ+β0); SGD-lépés: β ← β + ρ y_i x_i, β0 ← β0 + ρ y_i. A ρ = 1 választás „az általánosság megszorítása nélkül” (L203–204). Elválasztható adatnál véges sok lépésben konvergál. Hátrányai (Ripley alapján): sok megoldás van, és az eredmény a kezdőponttól függ; a lépésszám nagy lehet, ha kicsi a rés; nem elválasztható adatnál ciklizál.
- **Konvergenciabizonyítás vázlata (ESL Ex. 4.6, L2080–2092):** z_i = x*_i/‖x*_i‖, ahol y_i β_sepᵀ z_i ≥ 1; ‖β_new−β_sep‖² ≤ ‖β_old−β_sep‖² − 1, ezért legfeljebb ‖β_start−β_sep‖² lépés kell. Ez Novikoff-típusú korlát, de a forrás nem nevezi meg Novikoffot.
- **Hipersík geometriája:** ESL L145–164: β* = β/‖β‖ a normálvektor, az előjeles távolság (βᵀx+β0)/‖β‖.
- **Aktivációk (MLSYS L1358–1456):** szigmoid: (0,1), telítődik, nem nulla középpontú; tanh: (−1,1), nulla középpontú; ReLU: gradiense 1 pozitív bemenetre, „haldokló ReLU” (L1429–1434); softmax: vektorfüggvény (L1435–1445). ReLU deriváltja 0-ban: balról 0, jobbról 1, a TensorFlow 0-t ad vissza, ha x ≤ 0 (PDL L1845–1852).
- **Rejtett egységek száma:** ESL L1207–1222: inkább túl sok legyen + regularizáció, jellemzően 5–100 egység; a több réteg hierarchikus jellemzőket ad. PDL L415–432 hüvelykujjszabályai (legfeljebb 3 rejtett réteg, az első rejtett réteg ≥ bemenetek száma) – vitathatók, legfeljebb „egy szerző heurisztikájaként” idézd.
- **UAT helyes megfogalmazása:** MLSYS L4797–4799: „sufficiently large MLP … can approximate any continuous function on a compact domain”, továbbá L1507–1514: nem mondja meg, hány neuron kell, sem azt, hogyan találjuk meg a súlyokat.

## 3. Konkrét számpéldák (ellenőrizve)
- **Softmax, PDL L506–537:** a = (0,2; 1,3; 0,8; 2,1) → p = (0,080; 0,240; 0,146; 0,534) ✓ (pontosan 0,0799; 0,2401; 0,1456; 0,5344). Stabil változat: a′ = (−1,9; −0,8; −1,3; 0) (L552–561).
- **PDL 8-1. ábra, a 2–3–2–1-es szigmoid háló (L617–622):** a W-k alakja 3×2, 2×3, 1×2; a b-k hossza 3, 2, 1 → **20 paraméter** ✓ (a forrás nem összegzi). Írisz (2 osztály, 2 jellemző), 23 tesztminta, pontosság 1,0 (L779, L900–926).
- **MDL előreterjesztés (2–5–1, ReLU + szigmoid; a számok képen vannak, PDF 284. o., a .txt-ben üres L284–305):**
  x = [0,252; 1,092]; W0 = [[0,111; 1,018], [0,419; −0,547], [0,137; 0,615], [−0,427; −0,225], [−0,786; −0,472]];
  b0 = [−0,055; 0,238; −0,280; −0,313; 0,901] → W0x+b0 = [1,084; −0,254; 0,427; −0,667; 0,187] → ReLU → [1,084; 0; 0,427; 0; 0,187];
  W1 = [−0,383; 1,227; −0,938; 0,329; −0,638], b1 = 0,340 → a1 = −0,59575099 → sigmoid = 0,3553164 (35,5%, tehát 0. osztály, L305–308).
  A 3 jegyre kerekített adatokból számolva: [1,085; −0,254; 0,426; −0,666; 0,188], a1 ≈ −0,5947, σ ≈ 0,3556 – a kis eltérés a kerekítésből jön. A 0,3553164 = σ(−0,59575099) ✓. Paraméterek: 2·5+5 + 5+1 = **21**. Tesztpontosság: 92% (L268). Az sklearn `coefs_` (bemenet×kimenet) alakú, ezért transzponálják (L253–256, L274–276).
- **MDL konvolúció vs. sűrű réteg (L588–595):** (5,5,2) → (3,3,3): sűrű rétegben 50·27 = 1350 súly + 27 torzítás = 1377; konvolúcióval 3·(3·3·2)+3 = **57** ✓.
- **MDL MNIST CNN, alakok (L659–676):** (28,28,1) → (26,26,32) → (24,24,64) → (12,12,64) → 9216 → 128 → 10. A forrás hangsúlyozza, hogy ez nem a paraméterszám (L677–680). Saját számolás: 320 + 18 496 + 1 179 776 + 1 290 = **1 199 882** ✓. Jó feladat: a paraméterek 98%-a a Flatten→Dense(128) rétegben van.
- **MLQ FC-szabály (L98–104):** 5 bemenet, 3 kimenet: 15 súly + 3 torzítás = **18** ✓. Konvolúció: 5×5, 1→1 csatorna: 26; 3→1: 76; 3→5: 380 ✓; 5→12, 3×3: 552 ✓; konvolúciós rész 932 ✓; FC: 192·128+128 = 24 704 ✓, 128·10+10 = 1 290 ✓; FC összesen 25 994; mindösszesen **26 926** ✓ (de lásd 4. rész, E-MLQ1).
- **PDL 10-3. táblázat (MNIST: 784 bemenet, 10 kimenet; L2873–2885) – mind ✓:** 1000: 795 010 · 2000: 1 590 010 · 4000: 3 180 010 · 8000: 6 360 010 ·
  700;350: 798 360 · 1150;575: 1 570 335 · 1850;925: 3 173 685 · 2850;1425: 6 314 185 · 660;330;165: 792 505 · 1080;540;270: 1 580 320 ·
  1714;857;429: 3 187 627 · 2620;1310;655: 6 355 475. Továbbá (3000,1500): 6 871 510 ✓ (L2789). **Mély vagy széles, azonos paraméterszám mellett** → kész kísérlet (Figure 10-1).
- **PDL 10-2. táblázat (L2803–2813), MNIST, 1000 tanító minta, pontosság:** 1 rejtett egység: kb. 0,21; 500: 0,8616 (ReLU), 0,8576 (tanh), 0,6645 (logisztikus); 2000;1000;500: 0,8850 / 0,8771 / **0,1220** – a szigmoidos mély háló nem tanul (L2822–2842).
- **MLSYS paraméterszámok – mind ✓:** 784→128→64→10 = 109 386 („~100K”, L1187); 784→100→10 = 79 510 (önteszt, L1719–1722; a megoldást a forrás nem adja meg); 784→100→100→10 = 89 610 (L1965–1969: 78 400+100, 10 000+100, 1 000+10) ✓, kb. 350 KB fp32-ben ✓; 784→1000→1000→10 = 1 796 010 („~1,8M”, „~7MB”, „20×”) ✓ (L1771–1778); 784·783/2 = 306 936 pixelpár ✓ (L1874); az első rétegben 784·128 = 100 352 szorzás-összeadás (MAC) („nearly 100,000”, L2134); aktivációk B=32 esetén: 100 352 B, 65 536 B, 32 768 B, 1 280 B ✓ (L2612–2617); 1M paraméter ≈ 4 MB ✓ (L1911); 224²/9 = 5 575× ✓ (L5287–5291).
- **ESL ZIP-kód, 11.1. táblázat (L1582–1587) – kapcsolatok és súlyok, mind ✓:** Net-1 (256→10): 2570/2570, 80,0% · Net-2 (256→12→10): 3214/3214, 87,0% · Net-3 (lokálisan összekötött; 8×8 rács, 3×3-as folt; 4×4 rács, 5×5-ös folt): 1226/1226, 88,5% · Net-4 (2 db 8×8-as térkép közös 9 súllyal, egységenként saját torzítással): 2266 kapcsolat / 1132 súly, 94,0% · Net-5: 5194/1060, 98,4%. 320 tanító és 160 tesztminta (L1508). Mindegyik háló tanítóhibája 0% (L1558). → **„kapcsolat ≠ paraméter” a súlymegosztás miatt**, remek kvízanyag.
- **MLSYS XOR (L1749–1761):** 2→2→1, ReLU + szigmoid, súlyok nélkül. Kiegészítés (ellenőrizve): h1 = ReLU(x1+x2), h2 = ReLU(x1+x2−1), y = h1 − 2h2 → 0,1,1,0 ✓; paraméterek: 2·2+2 + 2+1 = 9.

## 4. Történeti tények (ahogy a forrás állítja)
- Rosenblatt-perceptron: „late 1950s (Rosenblatt, 1958)” – ESL L142; MLSYS L996 (1958), margójegyzet L986–988: „Invented … in 1957 at Cornell” + a New York Times-idézet (L990–995). Mindkét év védhető (1957-es jelentés a Cornell Aeronautical Laboratorynél, 1958-as Psych. Review-cikk), de **a könyv önmagával is ellentmond**.
- Minsky–Papert 1969: az egyrétegű perceptron nem tanulhatja meg az XOR-t, „AI winter of the 1970s” (MLSYS L1727–1745).
- Visszaterjesztés (backprop): Rumelhart–Hinton–Williams 1986 (PDL L1478–1480; MLSYS L1000–1002); Werbos 1974 (MLSYS L1011–1013; ESL L1989–1990, továbbá Parker 1985).
- ESL irodalmi jegyzetek (L1982–1998): McCulloch–Pitts 1943, Hebb 1949, Widrow–Hoff 1960, Rosenblatt 1962; projection pursuit: Friedman–Tukey 1974, PPR: Friedman–Stuetzle 1981 (L569).
- UAT: „Cybenko (1989) and Kurt Hornik (1991)” (MLSYS L1499–1506), de „Cybenko (1989) and Hornik (1989)” és „Hornik, Stinchcombe, and White 1989” (L4789–4795).
- ReLU: „Introduced by Nair and Hinton in 2010” (MLSYS L1400–1406). Glorot 2011 (rektifikált mély hálók) **egyik forrásban sincs benne**; PDL csak Glorot–Bengio inicializálását idézi, évszám nélkül (L2128). He-inicializálás: PDL L2108–2117.
- Neuronháló-telek: PDL L224 (az első az 1970-es években), L403 (a második az 1980-as években), a fordulat „early 2000s” (L409).
- LeCun 1989: ZIP-kód; LeNet-5 0,8%, boostolt LeNet-4 0,7% (ESL L1626–1640). MNIST: LeCun, Cortes, Burges 1998 (MLSYS L1785–1789).
- ImageNet: 2010-ben kb. 28%, AlexNet 2012-ben 15,3%, ResNet 2015-ben 3,6%, az ember becsült hibája 5,1% (MLSYS L412–422; az AlexNet-hivatkozás itt „2017a”).
- Novikoff 1962, Leshno 1993 egyik forrásban sincs → ha szerepelnek, „Kiegészítés”-ként jelöld.

## 5. HIBÁK / pontatlanságok (az oldalon jelölendők)
- **E-MLSYS1 (számolási hiba), L4926–4948:** h = [0,8; 0,2; 0,9; 0,1], W (3×4) = [[0,5; −0,3; 0,2; 0,7], [0,1; 0,8; −0,4; 0,3], [−0,2; 0,4; 0,6; −0,1]]. A könyv eredménye: z = [0,65; −0,17; 0,47], ReLU után [0,65; 0; 0,47]. **Helyesen [0,59; −0,09; 0,45]**, ReLU után [0,59; 0; 0,45] (python). Ráadásul „z = h⁽⁰⁾ᵀW⁽¹⁾” egy 3×4-es W mellett alakilag sem működik: Wh kellene.
- **E-MLSYS2 (alak-ellentmondás), L2148 és L2197–2200:** Z = W⁽¹⁾X, ahol W⁽¹⁾: n1×784, X: B×784 → nem szorozhatók össze (Xᵀ kellene). A kimeneti W⁽ᴸ⁾ „n_{L−1}×10” az előző sor n_l×n_{l−1} konvenciója szerint 10×n_{L−1} lenne. Két sorral lejjebb (L2216) már „W⁽¹⁾ is 784×128, XW⁽¹⁾” → harmadik konvenció. L4914: „row vector”, mégis h = f(Wh+b).
- **E-MLSYS3 (saját számaival ütközik), L1681 margó:** „Biases typically require 1–5% of total parameters”. A saját példáiban 784→128→64→10: 202/109 386 = **0,18%**; 784→100→100→10: 0,23%; 784→1000→1000→10: 0,11%.
- **E-MLSYS4 (számolási hiba), L696–702 margó:** agy: 10¹⁵/20 W = 5·10¹³ op/W ✓; H100: 1,98·10¹⁵/700 W = 2,8·10¹² op/W ✓; **az arány ≈ 18×, nem „~360x”**.
- **E-MLSYS5 (UAT túlzás), L1499–1500:** „neural networks with activation functions can approximate arbitrary functions”. L4791–4792: „could theoretically **learn any function**”; L4810: „allowing MLPs to learn arbitrary functions”; L4817: „some MLP can approximate any function”. Helyesen: kompakt halmazon folytonos függvényt, nem polinomiális aktivációval (Cybenko: szigmoid; Hornik 1991: korlátos, nem konstans); ez létezési tétel, nem tanulhatósági. (Ugyanez a könyv máshol helyesen írja: L4797–4799, L1507–1514.)
- **E-MLSYS6, L1400–1406, L1417–1419:** „ReLU solved/prevents the vanishing gradient problem” – csak enyhíti (mély hálóknál inicializálás, normalizálás és reziduális kapcsolatok is kellenek; haldokló ReLU). „Introduced by Nair and Hinton 2010” – népszerűsítették; a rektifikálás korábbi (Fukushima, Hahnloser 2000, Jarrett et al. 2009). L1421–1423: „~50% zero … makes the network more interpretable” – alátámasztás nélkül.
- **E-MLSYS7, L1874–1877:** „100 neurons learns 78,400 weights, effectively examining every possible pixel relationship” – a súlyok pixel→neuron kapcsolatok, nem pixelpárok; a 306 936 pár ide nem tartozik.
- **E-MLSYS8, L1916–1917:** „As models grow deeper and wider, … grow quadratically” – a mélységgel lineárisan, a szélességgel négyzetesen nő.
- **E-MLSYS9, L1677–1679:** „Without bias terms, a neuron with all-zero inputs would always produce zero output” – f(0)-t ad (szigmoid: 0,5).
- **E-MLSYS10 (következetlenség):** a futó példa 784→128→64→10, de L2612–2621 már 512/256-os rejtett rétegekről és „~500 000 paraméterről” beszél (784→512→256→10 = 535 818); L2640 „previous example … 128, 256, and 128” – ilyen korábbi példa nincs. L1733: „AI winter of the 1970s” vs. L4795: „AI Winter of the 1980s” (valójában két tél volt). L1776–1777: 784→1000→1000→10-es MLP-nél „99.5%” augmentáció nélkül irreális (sima MLP-vel kb. 98,5–99%). L1206: „artificial neuron or perceptron” – a perceptron szigorúan küszöbegység.
- **E-PDL1, L222–226:** az első „tél” oka „precisely this limitation of linear activation functions”. Tévedés: Rosenblatt perceptronja nemlineáris lépcsőfüggvényt használt; Minsky–Papert kritikája az **egyrétegű** (rejtett réteg nélküli) hálókra vonatkozott, és a többrétegű hálókhoz akkor még nem volt tanítóeljárás.
- **E-PDL2, L163–174:** a lineáris függvény definíciója „g(x) ∝ x”, mégis „g(x)=3x+2 is linear”, és „a konstans g(x)=1 is linear”. Ez affin, nem arányos – a definíció önmagának mond ellent. A tananyagban: „lineáris (affin)”.
- **E-PDL3, L803–806:** a transzponálás indoka: „Because scalar multiplication is commutative, ab = ba”. Rossz: a mátrixszorzás nem kommutatív, az ok (Wx)ᵀ = xᵀWᵀ.
- **E-PDL4, L47–48 és L393–394:** „universal function approximators”; „It has been proven that a single hidden layer with enough nodes can learn any function mapping” → *approximálni tud kompakt halmazon folytonos függvényt*, nem *megtanul bármit*. L401–402: a paraméterszám növekedése és az adatigény „curse of dimensionality again” – fogalomcsúsztatás.
- **E-PDL5, L575–599:** a w_ij-ben i a bemenet, j a csomópont, a mátrixban mégis a (j,i) pozíción áll w_ij → zavaró indexelés; a jegyzetben w_{cél,forrás} (MDL/MLQ-stílus) legyen.
- **E-PDL6, L2096–2098:** „According to the literature, if … sigmoid, A = 2” (U[±√(A/(fin+fout))]). Ez az sklearn saját választása; Glorot–Bengio / Bengio (2012) szigmoidhoz **4-szer nagyobb** tartományt ajánl (√(96/(fin+fout))). L2832–2833: „schemes we discussed in Chapter 8” → valójában a 9. fejezetben vannak. A szigmoidos kudarc oka (L2829–2835) csak feltételezés.
- **E-ESL1 (terminológia), L580–581:** az egy rejtett rétegű hálót „single layer perceptron”-nak is nevezi, a 11.1. táblázat (L1583–1584) viszont a rejtett réteg nélkülit hívja „single layer”-nek, az egy rejtett rétegűt „two layer network”-nek. A tananyagban rögzítsd: perceptron = rejtett réteg nélkül.
- **E-ESL2 (enyhe), L1558–1559:** „training error … 0%, since … more parameters than training observations” – ez heurisztika, nem következmény.
- **E-MLQ1, L22–24 vs. L106–110:** a szöveg szerint „two fully connected hidden layers with 192 and 128 hidden units”, a számolásban viszont csak 192→128 és 128→10 szerepel. A 192 valójában a kilapított konvolúciós kimenet (12 csatorna·4·4, 32×32-es bemenetnél – ellenőrizve: 32→28→13→11→4). Így tehát egy rejtett FC-réteg van (128 egységgel), és a 26 926 ehhez az értelmezéshez helyes.
- **E-MLQ2, L159–161:** „fully connected layer with two input and four output units” – az ábrafelirat és az egyenletek (L166–168) szerint **4 bemenet, 2 kimenet** (8 súly + 2 torzítás).
- **E-MDL (apróság):** a 284. oldali képen „ReLU(W0x + b)”, de b0-nak kellene lennie; L278: „b1 is a scalar” – az sklearn (1,) alakú tömböt ad.

## 6. Feladat- és kvízötletek
- Paraméterszámlálás szembeállító párokban: 784→100→10 (79 510) vs. 784→100→100→10 (89 610); 2→3→2→1 (20) vs. 2→5→1 (21). Rossz válaszok: torzítás nélkül (79 400), csak súlyok egy rétegre (78 400), „784·100·10” szorzat, kimeneti torzítás kihagyva.
- „Mély vagy széles?” – PDL 10-3: 1000 (795 010) vs. 700;350 (798 360) vs. 660;330;165 (792 505); kvíz: melyiknek van a legtöbb paramétere?
- Hibakereső feladat: számold újra az MLSYS 4-pixeles példáját (helyesen [0,59; −0,09; 0,45]) → „a forrás hibás” doboz.
- Alakellenőrzés: X: 32×784, W⁽¹⁾: 784×128 → XW: 32×128; melyik írásmód hibás: WX, XW, XᵀW? (MLSYS-ellentmondás.)
- Kapcsolat vs. paraméter: a ZIP Net-4-nek 2266 kapcsolata és 1132 súlya van – miért? Melyik konvolúciós réteg (MDL 57 vs. 1377)?
- Kézi perceptronlépés: kiinduló β = 0, egy rosszul osztályozott (x, y) → β ← β + yx; hány frissítés kell az AND/OR-hoz; miért ciklizál az XOR-nál (ESL L217–219).
- XOR kézzel: h1 = ReLU(x1+x2), h2 = ReLU(x1+x2−1), y = h1 − 2h2 (igazságtábla kitöltése).
- Lineáris összeomlás: h(x) = 5x−3 kétszer → W = 25w1w0, B = 25w1b0 − 15w1 + 5b1 − 3 (PDL); kvíz: „két lineáris réteg = ?”.
- Softmax: (0,2; 1,3; 0,8; 2,1) → p3 = 0,534; rossz válaszok: 2,1/4,4 = 0,477 (arányos normálás), 0,25 (egyenletes), σ(2,1) = 0,891.
- Igaz/hamis UAT-kvíz: „egy rejtett réteg bármit megtanul” (H), „kompakt halmazon folytonos függvény tetszőleges pontossággal” (I), „megmondja, hány neuron kell” (H), „lineáris aktivációval is igaz” (H).
- MNIST CNN: hol van a paraméterek zöme? (Flatten→Dense: 1 179 776 / 1 199 882 ≈ 98%.)
