# Ch14 – Generatív modellek: forrás-digest

Kinyert szövegek: `_parts/ch14/src/` (`DLV_ch18/22/23.txt`, `HAW_ch6.txt`, `HAW_ch8.txt`,
`MLQ_ch9/10/19.txt`, `EDL_ch8-9.txt`, `FLLM_ch2_start.txt`; `*_full.txt` = teljes pdftotext).
Mindegyik PDF szövege olvasható volt (nincs eltolt font).

Oldalszám-konvenció: **DLV, EDL, FLLM = nyomtatott könyvoldal**; **HAW, MLQ = PDF-oldal** (ezekben
az e-könyvekben nincs megbízható nyomtatott oldalszám a szövegben). EDL: könyvoldal ≈ PDF − 24.

Kiadási évek: DLV 2021 (Glassner) · HAW 2024, írva 2023 tavaszán (Kneusel) · MLQ 2024 (Raschka) ·
EDL 2023 (Lanham) · FLLM arXiv 2501.09223 v2, 2025. jún.

---

## 0. Gyors áttekintés – ki mit ad?

| Téma | DLV | HAW | MLQ | EDL | FLLM |
|---|---|---|---|---|---|
| generatív vs. diszkriminatív | – | 1 mondat | **igen**, p(x), p(x,y) vs p(y\|x), naiv Bayes vs. log. regr. | – | – |
| autoenkóder | **nagyon részletes** (18. fej.) | – | 1 bek. | kód + evolúció | – |
| VAE | részletes, de hibás KL-magyarázat | **kihagyja** | tömör, helyes (rekonstrukció + KL) | rövid, hibás ábra | – |
| GAN | **részletes**, pénzhamisító-hasonlat | MNIST-GAN, cGAN, „controllable GAN” | tömör + hátrányok | instabilitás, Wasserstein | – |
| diffúzió | **nincs** (2021) | **jó, szemléletes**, DDPM-algoritmus szóban, SD-kísérletek | tömör, + konzisztencia-modellek | – | – |
| autoregresszív | csak RNN/GPT-2 szöveg (23. fej.) | (7. fej. LLM) | PixelCNN + láncszabály | – | **láncszabály, greedy** |
| flow, EBM/DBM | – | – | **igen** | – | – |
| értékelés | – | – | FID/IS (homályos, 9-1 megoldás), perplexity/BLEU/ROUGE/BERTScore (19. fej.) | – | – |
| véletlen / mintavétel | – | seed rögzítése (DreamStudio) | **top-k, top-p, temperature**, seed | – | argmax |
| kreatív alk., stílusátvitel | **deep dream, Gatys-féle style transfer** | img2img, „képjavítás” | – | – | – |
| deepfake, társ. kérdések | 1 bek. a zárszóban + szintetikus adat veszélye | 8. fej.: LLM-központú, képi generatív témáról semmi | – | – | – |
| szerzői jog, memorizálás | csak az „AE memorizálta a tigrist” | **semmi** | – | – | – |

**Következmény:** a szerzői jog / memorizálás / deepfake / modern értékelés részt szinte teljesen
külső forrásból kell megírni (lásd 9. szakasz, „Kiegészítés”-ként jelölendő).

---

## 1. Generatív vs. diszkriminatív

**MLQ 9. fej. (PDF 89–90)**
- Generatív: p(x) vagy p(x, y); diszkriminatív: p(y|x).
- Klasszikus pár: **naiv Bayes (generatív) ↔ logisztikus regresszió (diszkriminatív)** – mindkettő p(y|x)-et ad, de a naiv Bayes a p(x, y)-on keresztül, ezért elvben mintát is tud húzni.
- Második pár: **DBM ↔ MLP**.
- „Deep generative” a gyakorlatban lazább: bármi, ami realisztikus adatot állít elő.
- Ábra-ötlet: ugyanaz a 2D adat két osztállyal, bal oldalt döntési határ (p(y|x)), jobb oldalt osztályonkénti sűrűség-szintvonalak (p(x|y)), amiből pontot is lehet „húzni”.

**HAW 6. fej. (PDF 153):** „a generatív modell nem címkét ad, hanem szöveget, képet, videót” –
hétköznapi definíció, jó motivációhoz.

Kiegészítendő (egyik forrásban sincs): a generatív modell az **eloszlást** tanulja meg, nem egyetlen
választ; „mintavétel” = sorsolás a megtanult eloszlásból. Magyar kis példa: kockadobás-összeg
eloszlása (HAW is ezt használja: 7 vs. 2, PDF 156) → „a mintavétel a valószínű értékeket gyakrabban
adja”.

---

## 2. Autoenkóder (DLV 18. fej., pp. 495–538 – fő forrás)

**Sorrend a könyvben:** tömörítés (veszteséges/veszteségmentes) → keverés (tartalmi vs.
paraméteres) → legegyszerűbb AE (1 rejtett réteg) → „tigris-memorizálás” → mélyebb AE MNIST-en →
latens tér 2D-ben → latens interpoláció → új (idegen) bemenet → konvolúciós AE → zajszűrő AE →
VAE → dekóder mint generátor.

**Hasonlatok, kis példák (számokkal):**
- MP3 / JPG mint enkóder–dekóder; JPG akár **20-szoros** tömörítés (p. 496).
- **Morze = veszteségmentes**, **magánhangzók elhagyása = veszteséges**: „HAPPY BIRTHDAY SARA BEST WISHES FROM DIANA” 42 karakter → „HPP BRTHD SR BST WSHS FRM DN” 28 betű (~⅔ idő). Kétértelműség: Sara és Suri is szülinapos → „SR” nem dönthető el (pp. 497–498). Teszt: **invertálható-e?**
- **Tartalmi keverés** (tehén + zebra 50–50% pixelátlag → szuperpozíció, nem hibrid állat) vs. **paraméteres keverés** (két kör középpontja, sugara, színe átlagolva → köztes kör) (pp. 498–499). Kiváló szembeállító pár a `two-col`-hoz.
- **„cherry” + „orange” betűnkénti ábécé-közép → „IMCPMO”**: a tömörített (írott) alakban keverni értelmetlen; az AE latens tere viszont (bizonyos mértékig) keverhető (pp. 499–500). Számok: 0,5 s „cherry” MP3 128 kbps-on ~8000 bájt vs. UTF-32-ben 24 bájt.
- **Szűk keresztmetszet (bottleneck)**: 100×100 = 10 000 pixel → 20 szám → 10 000 (p. 500–501).
- **Tigris-memorizálás** (pp. 502–504): 1 kép tanítása → tökéletesnek tűnő visszaállítás (max. hiba ~1/100), de 20×10 000 + 20×10 000 = **400 000 súly** tárol 10 000 számot; lépcső képre vagy **csupa fekete** bemenetre is tigrist ad (a bias-ok tárolják). → Remek „buktató” doboz: *a kis hiba nem jelent tömörítést; nézd meg idegen bemenettel is*. 104 képpel (26 kép × 4 forgatás) már nem tud csalni.
- MNIST, 784 → 20 → 784, 50 epoch: elmosódott, de felismerhető; **10 latenssel** a 2-ből „harapott 3”, a 4-ből 9 lesz (p. 506). Mély AE 784-512-256-20-256-512-784 sokkal élesebb (p. 507).
- Latens változók értelmezhetetlenek („privát kód”, p. 508).
- **2 latens változó → szórásdiagram 10 000 MNIST-képről**, színezve címke szerint: klaszterek (1-esek, 0-k, 3-asok külön), bal alsó sarokban keveredés (pp. 509–510). Rács dekódolása (23×23, 0–55 tartomány) → „latens térkép” (pp. 511–512). **Ábra/widget-ötlet**: kattints a 2D latens síkra → dekódolt számjegy.
- Interpoláció 20 latenssel: a 2 és 4 keveréke „félig 8-as” (p. 514); de a köztes képek gyakran nem számjegyek — „mit is jelentene félig 0, félig 1?” (p. 515). Üres latens régiók → a dekóder „találgat”.
- **Tigris az MNIST-AE-ben** → számjegy-paca: „gitár ceruzahegyezőből” hasonlat — az AE csak azt tudja kódolni, amin tanult (p. 516).
- Konv. AE: 28×28×1 → 7×7×3 = **147 latens** (p. 516). Véletlen zaj a dekóderbe → paca (p. 517).
- **Zajszűrő (denoising) AE** (pp. 519–521): Gauss-zaj, [0,1]-re vágva; bemenet = zajos, cél = tiszta; 60 000 kép, 100 epoch; „bottleneck” itt 7×7×32 = **1568 = a bemenet kétszerese** — a cél nem tömörítés. Stride/ismétlés explicit pool/upsample helyett: ~300 s → ~200 s/epoch (2014-es iMac, GPU nélkül). Alkalmazás: renderelt képek „hó”-zajának eltávolítása.
- Összegzés (p. 538): AE fő használat: zajszűrés, dimenziócsökkentés; dekóder = generátor.

**⚠️ Hibák / pontatlanságok (DLV 18):**
- ⚠️ p. 501: „az autoenkóder **semi-supervised** learning” – a mai szóhasználat **self-supervised** (vagy unsupervised). A semi-supervised mást jelent (kevés címkézett + sok címkézetlen adat).
- ⚠️ p. 516: „a bottleneck a **768** bemenetet 147 latenssel ábrázolja” – elírás, **784**.
- ⚠️ p. 520: „a dekódolási lépés végén lévő tenzor (a harmadik konvolúció után)” – a kódoló végéről van szó.
- ⚠️ A „Block 6” a VGG16-ábrán (23. fej.) – a VGG16-nak 5 konvolúciós blokkja van (apróság).

**Más források az AE-ről:** MLQ (PDF 90–91): AE = „unsupervised”, rekonstrukciós hiba. EDL 8. fej.
(pp. 183–212): Keras konv. AE **Fashion-MNIST**-en, MSE-veszteség, latens tér t-SNE-vel; fő
újdonsága az architektúra **genetikus algoritmussal való evolúciója** (gén-szekvencia, keresztezés,
mutáció, fitnesz = val_loss) – a tananyaghoz legfeljebb egy „érdekesség” mondat.
⚠️ EDL p. 185: „Representation learning, or … generative deep learning” – a kettő nem ugyanaz.

---

## 3. VAE

**DLV 18. fej. (pp. 521–538)**
- Három kívánalom a latens térre (p. 523): (1) egy helyen legyen (tudjuk, honnan sorsoljunk), (2) hasonló bemenetek közel, (3) minél kevesebb üres folt.
- Eszköz: minden latens változó eloszlása közelítsen **standard normálist** (μ = 0, σ = 1; ~68% a [−1, 1]-ben). „Pitypang-pihe” hasonlat a 3D Gauss-ra (p. 524).
- Csere-kompromisszum: Gauss-szerűség ↔ rekonstrukció pontossága (p. 525).
- Szemléletes: 2-esek hurokkal / hurok nélkül külön klaszterben, köztük „félig hurkos” 2-esek (Fig. 18-44, p. 526). Több latens → több tulajdonság-kombináció fér el.
- Zaj a latensbe → hasonló kép (Fig. 18-45: pl. 1,2 + (−0,1) = 1,1) (p. 527).
- Enkóder → minden latensre **középpont (μ) és szórás (σ)** → mintavétel → dekóder (pp. 528–529).
- Kísérletek: ugyanaz a bemenet 8-szor → 8 kissé eltérő kimenet (nemdeterminisztikus, p. 531); 10% ill. 30% latens zaj → még mindig számjegyek, a 7-esből „hajlított 7” (p. 532); interpoláció jobb, mint sima AE-nél.
- **2 latensű VAE**: a pontok a σ-körön belül, jól klaszterezve; rács −3…3 → szinte csupa számjegy (pp. 534–535). 80 véletlen pont r = 3 körből → többnyire olvasható számjegyek. Mélyebb VAE (1000-500-250-**50** latens, 25 epoch, a Caffe MLP-AE alapján) → élesebb (p. 537).

**⚠️ Hibák (DLV, fontos!):**
- ⚠️ **KL-divergencia szerepe hibásan** (p. 530): a könyv szerint a KL-tag „az enkóder és a dekóder rétegei közötti hasonlóságot méri”, hogy a dekóder „tükrözze” az enkódert. **Ez téves.** A VAE-veszteségben a KL-tag az enkóder által adott q(z|x) = N(μ, σ²) és a **prior N(0, I)** közti eltérést bünteti – ez pont a könyv előző oldalain leírt „legyen standard normális” kívánalom. Helyes: `veszteség = rekonstrukciós hiba + KL(N(μ,σ²) ‖ N(0,1))`; 1D-ben KL = ½(μ² + σ² − ln σ² − 1).
- ⚠️ **Reparaméterezési trükk fordítva** (pp. 527–528): a könyv szerint „ahelyett, hogy véletlen számot adnánk hozzá, mintát húzunk egy eloszlásból”. Valójában fordítva: a közvetlen mintavétel N(μ, σ²)-ből nem deriválható; a trükk az, hogy **z = μ + σ·ε, ε ~ N(0, 1)** – vagyis *kívülről jövő* zajt skálázunk és tolunk el, így μ-n és σ-n át folyhat a gradiens.
- ⚠️ Az ábrán (Fig. 18-46/48) az enkóder „kiszámolt latens értékéből” lesz μ és σ – a szokásos felépítésben az utolsó rejtett rétegből két fej adja közvetlenül μ-t és (log-)varianciát.

**MLQ (PDF 91–92):** helyes, tömör: variációs következtetés + AE; enkóder → Gauss paraméterei,
dekóder mintából rekonstruál; veszteség = **rekonstrukció + KL-regularizáció** a priorhoz;
generálás: priorból sorsolás → dekóder. Hátrány: kéttagú veszteség, gyakran **elmosódott** képek.
→ A VAE-t a DLV szemléletével, de az MLQ (és fenti javítás) képleteivel érdemes tanítani.

**EDL (pp. 203–211):** μ és σ → mintavételező réteg → Z.
⚠️ Fig. 8.13 felirata szerint a 2D-s „manifold” rács tengelyei „Mean” és „Variance” – valójában a
két **latens koordináta** (z₁, z₂) bejárása. ⚠️ Az összegzés szerint a mintavevő réteg
„leválasztja az enkódert a dekóderről, ami jobb teljesítményt ad” – értelmetlen/félrevezető.

**HAW:** VAE-t egyáltalán nem tárgyal (és azt sem, hogy a Stable Diffusion egy VAE latens terében
dolgozik).

---

## 4. GAN

**DLV 22. fej. (pp. 649–673) – fő forrás**
- Terminológia (p. 649): a „GAN” valójában **tanítási módszer**; a betanult generátort is „GAN”-nak hívják.
- **Pénzhamisító-hasonlat**: Glenn (Generator) és Dawn (Discriminator), 10 000 „Solar”-os bankjegy; egyik sem tudja kezdetben, hogy néz ki az igazi; Glenn csak üres papírt kap (pp. 650–651). Kopott, egyedi bankjegyek → a generátornak **változatos** mintákat kell adnia.
- 2×2-es tábla (TP/FN/FP/TN) és ki tanul belőle (p. 652): TP – senki; FN, FP – a diszkriminátor; TN – a generátor. Egy tanulási kör 4 lépés (a)–(d), a generátor kétszer tanul (p. 655).
- „Miért adversarial?” – detektív vs. magányos hamisító; játékelmélet, **Nash-egyensúly** (p. 657).
- Diszkriminátor kimenete 0…1 (1 = biztosan valódi, 0,5 = nem tudja) (p. 658).
- **Befagyasztás (freeze)**: a generátor tanításakor a gradiens átfolyik a D-n, de csak G súlyai változnak (pp. 659–660). Ugyanaz a G és D objektum, csak összekapcsolva (p. 664).
- **2D-s játékpélda** (pp. 660–666): valódi adat = 2D Gauss (5, 5) középpont, σ = 1; G: 4 egyenletes [0,1] zaj → 16 (leaky ReLU 0,1) → 2; D: 2 → 16 → 16 → 1 (szigmoid); 10 000 pont, batch 32; epoch 0-nál a generált pontok (1, 1) körül „ferde csík”, ~4. epochnál túllő és elliptikus, a 13. epochra jó egyezés. **Kiváló widget-ötlet** (2D-s „tanuló felhő”).
- Mini-batch: egyetlen pontról nem dönthető el, honnan jött; sok pontból igen (p. 662).
- DCGAN MNIST-en (pp. 666–669): 100-as zaj, D 7×7×128 = **6272** ↔ G második dense rétege 6272; BCE, Nesterov SGD lr 0,0005, momentum 0,9; 1 epoch → paca, 100 epoch → számjegyek. „A generátor sosem látta az adatot!” – erős motivációs pont. Radford et al. 2016 hüvelykujjszabályai.
- Kihívások (pp. 669–673): hiperparaméter-érzékenység, nincs konvergencia-bizonyíték (vs. perceptron); nagy képek → **ProGAN** (4×4-től 1024×1024-ig fokozatosan, Karras et al. 2018); **mode collapse** (teljes / részleges; macskás példa; Fig. 22-24: 3 epoch után sok 1-es); **szintetikus adaton tanítás veszélye** („bias in, bias out”, p. 673).

**⚠️ Hibák / pontatlanságok (DLV 22):**
- ⚠️ A TP/FN/FP/TN-alapú „csak hiba esetén tanul” leírás **didaktikai egyszerűsítés**: a valóságban a D minden batchen BCE-veszteséggel tanul (helyes válasznál is van kis gradiens), a G pedig minden generált mintán (nem-telítődő veszteség: max log D(G(z))). A „generátor megtartja legjobb munkáját” (p. 653) sem szó szerint igaz.
- ⚠️ p. 663: a G-nek „18 neuronja és **54 súlya**” van – valójában 4·16 + 16·2 = **96 súly** (+18 bias). (Pythonnal ellenőrizve.)
- ⚠️ Fig. 22-20: „a veszteségek az ideális 0,5 körül” – a **D kimenete** ideálisan 0,5; a BCE *veszteség* ekkor ln 2 ≈ 0,693 (mintánként). Kimenet és veszteség összemosva.
- ⚠️ „**Modal collapse**” – a szakirodalomban **mode collapse** (magyarul: módusz-összeomlás).
- ⚠️ p. 671: a mini-batch-diverzitás javaslatot Arjovsky, Chintala, Bottou 2017-hez köti – az a **Wasserstein-GAN** cikk; a minibatch discrimination Salimans et al. 2016. Az összegzés „mini- batch használata elkerüli a mode collapse-t” túlzás.
- ⚠️ p. 667: a batchnorm „segít megelőzni a túltanulást” – GAN-ban főleg a tanítást stabilizálja.
- ⚠️ Elavult: „általában érdemes ellenállni a szintetikus adaton tanítás kísértésének” – ma a szintetikus adat (desztilláció, LLM-ek által generált tanítóadat) bevett gyakorlat, *de* a figyelmeztetést alátámasztja a **model collapse** irodalom (Shumailov et al., Nature 2024: generációról generációra saját kimeneten tanított modellek elvesztik az eloszlás „farkait”).
- ⚠️ Kihagyja: feltételes GAN, StyleGAN, WGAN részletei, és **teljesen hiányzik a diffúzió**.

**HAW 6. fej. (PDF 153–167)**
- Tanítás 9 lépésben (PDF 154–155): G-vel fake batch, valódi batch, D felold, címkék fake = 0 / real = 1, D lépés, D fagyaszt, G inputok, kombinált modell **„valódinak” címkézve** a fake-eket (ez a nem-telítődő trükk, magyarázat nélkül). Ez a reálisabb leírás → érdemes ezt használni a DLV 4-lépéses meséje mellett.
- G = „adatgeneráló folyamat helyettesítője”; zajvektor: N(0,1), többnyire −3…3 (PDF 156–157); testmagasság-hisztogram (25 000 fő, 30 bin, csúcs ~68 hüvelyk, >10%) a normális eloszlásra.
- GAN-hoz **nem kell címke** (PDF 158).
- MNIST-GAN (PDF 159–160): 10-es zaj; G 256-512-1024-784 (leaky ReLU, kimenet tanh), D 1024-512-256-1 (szigmoid); **200 epoch × 468 batch = 93 600 lépés** (ellenőrizve). Epoch 1: sok 1-es.
- **Táblázat 6-1 (PDF 161–162)**: 1000 generált számjegy CNN-nel (>99%) osztályozva: 0: 10,3%, 1: **21,4%**, 2: 4,4%, 3: 7,6%, 4: 9,5%, 5: 6,0%, 6: 9,1%, 7: 14,4%, 8: 4,4%, 9: 12,9% (összeg 100,0 – ellenőrizve). → **remek kvíz/példa** a részleges mode collapse-ra (várható 10%).
- **Feltételes GAN** (PDF 162–164): zaj + one-hot címke a G-be; a D-be a címke **extra csatornákként** (minden csatorna 0, a címkéé 1). Hasonlat: „osztályonként külön GAN-ok csomagja”. Címkézett adat kell.
- **„Controllable GAN”** (PDF 164–167): irányok a zajtérben (szemüveg, szakáll, haj szín, kor, póz; Shen et al. 2019 InterFaceGAN); **entangled** (összefonódott) dimenziók; 10 dimenzióban egyetlen koordinátát változtatva 3 → 9 → 4 (Fig. 6-6). 2D-s ábra (2,5) → (6,1) nyíllal. ⚠️ „Controllable GAN” nem bevett kategórianév; a jelenség: **latens tér szemantikus irányai / latent space editing**.

**MLQ (PDF 93–94):** G ≈ VAE-dekóder szerepű; hátrányok: instabil tanítás, oszcilláció, mode
collapse, nem-konvergencia, kis diverzitás.

**EDL 9. fej. (pp. 213–238) – röviden hasznos:**
- Hibatípusok listája (p. 221): **vanishing gradient** (túl erős D → G nem kap jelet), **mode collapse**, **failure to converge**. Kísérletileg előidézve (optimizer-cserével).
- Gyógymódok: unrolled GAN (említés), **zajos címkék** (fake 0–0,2, real 0,8–1,0 – lényegében *label smoothing*, p. 225), **Wasserstein-veszteség / kritikus** (Arjovsky et al. 2017, pp. 228–229), végül GA-val hangolt hiperparaméterek.
- ⚠️ p. 229: „a KL és a Jensen–Shannon a vízszintes, az earth-mover a függőleges eltérést is méri” – **téves magyarázat**. A valódi ok: ha a két eloszlás tartója nem fed át, a JS-divergencia állandó (ln 2) → nincs gradiens; a Wasserstein-távolság ilyenkor is a „tolási távolsággal” nő → értelmes gradiens. (Földkupac-áthordás hasonlat jó!)
- ⚠️ p. 220: a betanult D-vel „bármely képről eldönthető, arc-e” – túlzás; a D csak valódi vs. *ennek a G-nek a hamisítványa* között tanult különbséget tenni.
- ⚠️ „Mode collapse or overfitting” – nem azonos fogalmak.

---

## 5. Diffúziós modellek

**HAW 6. fej. (PDF 167–179) – a legjobb szemléletes forrás**
- „Versengés nélküli” alternatíva a GAN-hoz (PDF 168).
- Tanítás: **a hálónak a képhez adott zajt kell megjósolnia**; generálás: fordítva, zajból kép.
- Képzaj: pl. 127-es pixelérték → 124 vagy 129; „hó” a képen (PDF 168).
- Architektúra: kép be, ugyanakkora kép ki → **U-Net** (PDF 168).
- **Zajütemezés (schedule)**: lineáris vs. **koszinusz** (lassabban rombol, jobban tanul); ábra 9 lépésről a szerző dédapjáról (1895 körül) (PDF 169–170). Ábra-ötlet: ugyanaz a kép két soron.
- Algoritmusok szóban (PDF 170–171): tanítás – x₀ véletlen kép, t ∈ {1..T}, ε ~ N(0, I), xₜ x₀-ból, t-ből és ε-ból (zárt alak!), modell becsli ε-t, MSE → backprop. Mintavétel – x_T tiszta zaj, T lépésben: kivonjuk a becsült zajt, hozzáadunk kis friss z-t (kivéve az utolsó lépést).
- Feltételezés (PDF 172–173): **szöveg-beágyazás** (embedding) a tanításkor → prompt a generáláskor; img2img: meglévő kép + részleges zaj mint kiindulás.
- Stable Diffusion / DreamStudio kísérletek (PDF 173–179): Mona Lisa 33%-os „image strength”-tel, 5 stílus; hibák: **ötlábú border collie, többszájú T. rex, eltorzult kezek**; **seed rögzítése**, „ornate, green, vase” szósorrend-permutációk (az egyetlen nyelvtanilag szokásos sorrend adta a kilógó vázát); színcsere; „képjavítás”: 195×256 → 586×768 (3×), 25% zaj, prompt „detailed, original”; madár (western meadowlark, ~100 m, füstös levegő), ~12% zaj → jobb, de **nem hű az eredetihez** („újraképzelés”, nem rekonstrukció).

**⚠️ HAW diffúzió – pontatlan / elavult:**
- ⚠️ Terminológia: a könyv a tanítást „forward algorithm”-nek, a mintavételt „reverse algorithm”-nek hívja. A szakirodalomban a **forward process = zajosítás**, **reverse process = zajtalanítás/mintavétel**; a tanítás nem „forward algoritmus”. Jelölni kell egy `box tip`-ben.
- ⚠️ A visszalépés „a modell kimenetét kivonjuk xₜ-ből és hozzáadjuk z-t” – hiányoznak a skálatényezők. DDPM: x_{t−1} = (1/√α_t)·(x_t − (β_t/√(1−ᾱ_t))·ε_θ(x_t, t)) + σ_t·z. Tananyagban maradhat szóban, de jelöld, hogy egyszerűsítés.
- ⚠️ „T tipikusan néhány száz lépés” – a DDPM tanításnál T = 1000; **mintavételnél ma 20–50 lépés** (DDIM, DPM-Solver), desztillált/konzisztencia-modelleknél **1–4 lépés**.
- ⚠️ „A diffúziós modellek nehezen rajzolnak kezet” – a 2022–23-as modellekre igaz volt; a 2024–2026-os modellek (SDXL utódai, SD3, Flux, Imagen 3, Midjourney v6+, GPT-4o képgenerálás) nagyrészt megoldották. Történeti példaként használható.
- ⚠️ Kihagyja: a Stable Diffusion **latens diffúzió** (VAE-enkóder latens terében zajosít; Rombach et al. 2021/22), **classifier-free guidance** (a „guidance scale” csúszka), a cross-attention mint feltételezési mechanizmus, CLIP szövegenkóder.
- ⚠️ „Prompt engineer” mint új szakma – azóta erősen visszaszorult kifejezés.
- ⚠️ DALL-E 2 (2022) említése: azóta DALL-E 3 (2023), majd a GPT-4o natív képgenerálása (2025) – utóbbi nem tisztán diffúziós.

**MLQ 9. fej. (PDF 98–100)**
- Diffúzió: adat → zaj sztochasztikus folyamattal (SDE-szemlélet), majd visszafelé; 2022-től szinte teljesen átvette a képgenerálást (PDF 101); könnyebb tanítani, mint a GAN-t; lassú mintavétel.
- **Konzisztencia-modellek** (Song et al. 2023): egy lépésben zajból kép; a „probability flow ODE” pályájának bármely pontját a kezdőpontra képezik. ⚠️ **Téves**: „zajos–tiszta képpárokból álló adatbázison tanítják, ezért drága a tanításuk”. Valójában a zajos változatot menet közben állítják elő (nem kell páros adat); tanítás: *consistency distillation* (előtanított diffúzióból) vagy *consistency training*.
- ⚠️ Kihagyja (2024 óta meghatározó): **flow matching / rectified flow** (SD3, Flux), **Diffusion Transformer (DiT)**, videódiffúzió (Sora 2024, Veo).

**DLV:** diffúzió **nincs** (2021-es könyv).

---

## 6. Autoregresszív modellek, flow, EBM

**MLQ (PDF 95–98)**
- **Autoregresszív**: következő érték az eddigiekből; LLM-ek; **PixelCNN** pixelenként, raszter- sorrendben. Láncszabály: P(i₁,…,i_N) = P(i₁)·P(i₂|i₁)·P(i₃|i₁,i₂)·… (Fig. 9-5: i₁…i₅₃ kontextus, i₅₄ a következő pixel). Előny: egyszerű, **egzakt likelihood**, nincs mode collapse; hátrány: lassú (lépésenként), hosszú távú függőségek. ⚠️ „Képminőségben általában rosszabb a GAN-nál” – **elavult**: Parti (2022), VAR (2024) és a GPT-4o-féle natív képgenerálás (2025) autoregresszív és élvonalbeli. ⚠️ A „hosszú távú függőség, mert csak a korábbiakra feltételes” indoklás zavaros.
- **Flow (normalizing flow)**: egyszerű eloszlás → bonyolult invertálható lépésekkel; NICE (Dinh et al. 2014); egzakt likelihood (anomália-detektálás, sűrűségbecslés); képminőség gyengébb, memóriaigényes. ⚠️ „egyszerűbb **decoupling** rétegek, pl. lineáris transzformációk” – a helyes név **coupling layer**, és belül tetszőleges neurális háló van.
- **EBM / DBM**: energiafüggvény (kisebb energia = valószínűbb); DBM Gibbs-mintavétellel, bináris neuronok, „contrastive divergence”; történeti jelentőség. (⚠️ a CD inkább RBM-re jellemző.)
- Ajánlás (PDF 101): likelihood kell → flow/AR; képminőség → diffúzió.

**FLLM 2. fej. eleje (pp. 36–41)**
- Történet: Shannon 1951 (következő betű jóslása) → n-gram (2010 előtt domináns) → Bengio et al. 2003 neurális LM (szóbeágyazás mint melléktermék) → Word2Vec 2013 → LSTM → Transformer.
- **Láncszabály**: Pr(x₀,…,x_m) = Π Pr(x_i | x₀,…,x_{i−1}); log-alakban összeg (2.1–2.2); x₀ = ⟨s⟩, Pr(x₀) = 1 konvenció.
- **Greedy dekódolás**: x̂_i = argmax Pr(x_i | előzmények) (2.3); Table 2.1: ⟨s⟩ a → b → c → d, minden lépés után a szorzat egy taggal nő. Kis kézzel számolható példához ideális.
- Tanítás: max. log-likelihood (2.13–2.14). Decoder-only Transformer, maszkolt self-attention.
- Table 2.2: GPT-1 0,117B … GPT-3 175B (96 réteg, d = 12 288), LLaMA3 405B, DeepSeek-V3 671B. ⚠️ Gemma2 sor: „37B” – valójában **27B** (a 46 réteg / 4608 szélesség a 27B konfiguráció).
- Mintavételről (temperature stb.) itt nem szól → MLQ 10.

**DLV 23. (pp. 688–689):** saját könyvszövegén tanított 2 rétegű LSTM (128 cella; ~427 000 szó,
~10 300 szavas szókincs) „autoregresszíven”; mobil-szójavaslat hasonlat; vicces kimenetek
(„+ the information”); majd GPT-2 medium finomhangolva. Jó motivációs színes példa.

---

## 7. Véletlen és mintavétel (MLQ 10. fej., PDF 103–111)

- Véletlenforrások: súlyinicializálás (seed, pl. 123), adatkeverés, dropout, nemdeterminisztikus algoritmusok (cuDNN), hardver/driver (NVIDIA: architektúrák között nincs bitre azonos eredmény).
- **„Randomness by design”** (PDF 108–109): képmodellek – minden visszalépésben új zaj, a zajütemezés adja a varianciát; LLM-ek – „Regenerate response” gomb.
- **Top-k**: k legvalószínűbb token, újranormálás, sorsolás. **Top-p (nucleus)**: a legvalószínűbbek a kumulált p küszöbig, a jelöltkészlet mérete lépésenként változik. Temperature csak említve.
- 9-1/10-1 megoldás: k = 1 → determinisztikus (greedy).
- ⚠️ A 10-1. feladat „top-k-val **tanított** háló” – a top-k/top-p *következtetési* (inference) beállítás, nem tanítási.
- Kiegészítendő: temperature képlete softmax(z/T); T → 0 greedy, T > 1 laposabb eloszlás; diffúziónál DDIM-mel determinisztikus mintavétel is lehetséges; a „seed + prompt” rögzítése (HAW vázás kísérlete) ugyanennek a képi oldala.
- Kis számpélda-ötlet: logitok [2, 1, 0] → T = 1: ≈ [0,665; 0,245; 0,090]; T = 0,5: ≈ [0,867; 0,117; 0,016] (Pythonnal ellenőrizve).

---

## 8. Értékelés

**MLQ 19. fej. (PDF 192–204) – szöveg**
- Intrinzik (perplexity) vs. extrinzik (BLEU, ROUGE, BERTScore) metrikák; hasonlat: keresztentrópia (amit optimalizálunk) vs. pontosság (amit valójában akarunk).
- **Perplexity** = p(s)^(−1/n): [0,99; 0,85; 0,89; 0,99; 0,99; 0,99; 0,99; 0,99] → **≈ 1,043**; „The fast black cat …” [0,99; 0,65; 0,13; 0,05; 0,21; 0,99; 0,99; 0,99] → **≈ 2,419** (mindkettő Pythonnal ellenőrizve). Kiváló kézi példa. ⚠️ A képlet „2^{H(p,q)/n}” jelölése zavaros (ha H már tokenenkénti átlag, nincs /n); és ellentmondás: egyszer „közvetlenül a tanítási veszteséghez kötött”, máskor „nem optimalizálási cél” – valójában log(PPL) = átlagos keresztentrópia, tehát a PPL minimalizálása = a tanítási veszteség minimalizálása.
- BLEU (precision-szerű, n-gram, brevity penalty; 0–1), ROUGE (recall-szerű, ma F1), BERTScore (BERT-beágyazások koszinusz-hasonlósága); emberi értékelés az arany standard; InstructGPT-idézet: a nyilvános adathalmazok nem tükrözik a valós használatot. Adat: 2021-ben minden összefoglaló-cikk használt ROUGE-t, 69%-uk csak azt.
- ⚠️ Kihagyja: LLM-as-a-judge, páros összehasonlítás / Elo (Chatbot Arena), benchmarkok (MMLU stb.), benchmark-szennyeződés.

**MLQ 9-1. megoldás (PDF 299) – képek**
- Arany standard: emberi értékelés. Diverzitás: feltételes vs. marginális osztályeloszlás KL-je (= **Inception Score**, név nélkül); minőség: valódi és generált képek statisztikái egy előtanított CNN jellemzőterében → **FID**.
- ⚠️ Zavaros: az IS-t „KL-regularizációs tagnak, amit a VAE is használ” nevezi, és csak a diverzitáshoz köti. Helyesen: IS = exp(E_x KL(p(y|x) ‖ p(y))) – magas, ha az egyes képek **egyértelműek** (éles p(y|x)) **és** összességükben **változatosak** (lapos p(y)); nagyobb = jobb. FID = ‖μ_r − μ_g‖² + Tr(Σ_r + Σ_g − 2(Σ_r Σ_g)^{1/2}) Inception-v3 jellemzőkön; **kisebb = jobb**; mintaszám-függő, ImageNet-torzítású.
- Kiegészítendő: precision/recall generatív modellekre (minőség vs. lefedettség – mode collapse → jó precision, rossz recall), CLIP-score (szöveg–kép egyezés), emberi preferencia-arénák. Kvíz-ötlet: „FID csökken – jobb vagy rosszabb?”; „mode collapse-os GAN: melyik romlik?”.

**HAW:** a diszkriminátor ~0,5 kimenete mint a jó generátor jele (PDF 160) – csak intuíció, nem
metrika.

---

## 9. Kreatív alkalmazások, stílusátvitel, deepfake, szerzői jog, memorizálás

**DLV 23. fej. (pp. 675–692)**
- **Deep dream** (pp. 675–680): VGG16, kiválasztott szűrők aktivációinak súlyozott összege = „multifilter loss”; a hálót befagyasztjuk, a gradienst a **pixelekig** visszük és **növeljük** a veszteséget (gradiens-emelkedés). Béka → sok szem; 1000 px-es kutyakép finomabb textúra (a háló 224×224-en tanult). Eredeti név: inceptionism (Mordvintsev, Olah, Tyka 2015).
- **Neurális stílusátvitel** (Gatys, Ecker, Bethge 2015; pp. 680–688): alapkép (base), stílusreferencia, generált kép. Stílus = rétegenkénti **Gram-mátrix** (szűrőpárok aktivációinak hasonlósága); tartalom = szűrőválaszok eltérése az alapképtől. Teljes veszteség = α·tartalom + β·stílus; **pixeleket** optimalizálunk, háló fagyasztva, **minimalizálunk** (szemben a deep dreammel). Picasso 1907-es önarcképének Gram-mátrixai zajból már Block 3-ra „Picasso-absztraktot” adnak; 9 stílus (Csillagos éj, Sikoly, Nighthawks, Kandinszkij VII…); súlyok: tartalom **0,025**, stílus **1** (stílus 40× erősebb). „Miért működik? Senki sem tudja igazán” (Li et al. 2017). **Szembeállító pár**: deep dream (max., szűrők) ↔ style transfer (min., Gram + tartalom).
- ⚠️ p. 680–681: „rétegpárok, amelyek hasonlóan aktiválódnak” és „a cella a rétegpár pontszáma” – helyesen **szűrőpárok egy rétegen belül** (C×C-s Gram-mátrix, G = F·Fᵀ).
- ⚠️ „Képről indulva elvész a tartalom, ezért zajból indulunk” – a gyakorlatban a tartalomképből indítás is bevett és jól működik (tartalomveszteséggel együtt).
- ⚠️ „Simonyan and Zisserman 2020” – a VGG-cikk 2014-es.
- Kihagyja: gyors (feed-forward) stílusátvitel (Johnson et al. 2016), AdaIN, CycleGAN, és természetesen a diffúziós stílusutánzás („in the style of …” prompt).
- **Deepfake** (pp. 691–692, zárszó): bárki megjelenése/hangja/videója hamisítható; „a megbízható kép- és hangfelvételek korának vége nagyon közel” → visszatérés a hallomás és a véleménye korába; bíróságok, választások. Hangos, retorikus bekezdés, technikai részlet nélkül.
- Zárszó egyéb: torzítás a tanítóadatban, adatgyűjtés, hatalomkoncentráció (O’Neil 2016).
- 22. fej. p. 673: **szintetikus adaton tanítás** → rejtett torzítások öröklődnek („bias in, bias out”) – kapcsolható a model collapse-hoz.

**HAW:** img2img variációk (Mona Lisa), „képjavítás” = újraképzelés, nem hű rekonstrukció
(PDF 177–179) – jó buktató: *a diffúziós „javítás” hallucinál részleteket, ezért bizonyítéknak nem
jó*. 8. fejezet (PDF 211–229, 2023 tavasz): kizárólag LLM-ek (hallucináció, szoftverfejlesztés,
oktatás, orvoslás, tudat) – **képi generatív MI, deepfake, szerzői jog nincs benne.**
⚠️ Elavult állítások a 8. fejezetből (csak ha idézed): „a hallucináció nem leküzdhetetlen, a jövő
rendszereiben megbízhatunk a kimenetben” – optimista jóslat; GPT-4 mint csúcsmodell.

**Memorizálás** – a forrásokban csak az AE-tigris (DLV pp. 502–504) és EDL általános „network
memorization” említése (EDL p. 9). → Didaktikai híd: a tigris-AE *ugyanaz a jelenség kicsiben*,
mint amikor egy nagy generatív modell tanítóképet ad vissza.

**Kiegészítés (külső források, a tananyagban „Kiegészítés”-ként jelölni; írás előtt ellenőrizni!):**
- Memorizálás/kinyerés: Carlini et al. 2023 („Extracting Training Data from Diffusion Models”) – Stable Diffusionből és Imagenből tanítóképek közel pontos másolatait nyerték ki, főleg a sokszor duplikált képekből; LLM-eknél Carlini et al. 2021 (GPT-2-ből szó szerinti szövegek). Fő tanulság: a duplikáció növeli a memorizálást → deduplikálás.
- Szerzői jogi perek (állapot ellenőrizendő): Getty Images v. Stability AI (UK, 2025 végi ítélet, nagyrészt Stability javára), Andersen v. Stability AI (USA, művészek), NYT v. OpenAI/Microsoft (2023–), Bartz v. Anthropic (2025-ös egyezség, könyvkalózkodás miatt). Kérdések: tanítás = fair use / TDM-kivétel (EU DSM-irányelv 4. cikk, opt-out)? kimenet másolat-e? stílus nem védett.
- Deepfake-szabályozás / jelölés: EU AI Act 50. cikk (átláthatósági kötelezettség, mesterségesen generált tartalom jelölése; alkalmazás 2026. aug.-tól), C2PA „content credentials”, láthatatlan vízjel (pl. Google SynthID). Detektorok megbízhatatlansága.
- Model collapse: Shumailov et al., Nature 2024.

---

## 10. Terminológia (angol → magyar javaslat; figyelendő)

| angol | magyar / megjegyzés |
|---|---|
| generative vs. discriminative model | generatív vs. diszkriminatív modell |
| autoencoder, encoder, decoder | autoenkóder, kódoló (enkóder), dekódoló (dekóder) |
| bottleneck, latent variables / code, latent space | szűk keresztmetszet, látens változók / kód, látens tér |
| reconstruction loss | rekonstrukciós hiba |
| denoising autoencoder | zajszűrő autoenkóder |
| VAE, reparameterization trick, prior, ELBO | variációs AE, reparaméterezési trükk, prior (előzetes eloszlás), ELBO (egyik forrás sem nevezi meg!) |
| content vs. parametric (representation) blending | tartalmi vs. paraméteres keverés (DLV saját terminusa) |
| interpolation in latent space | látens interpoláció |
| GAN, generator, discriminator, critic (WGAN) | generatív versengő (adverzariális) háló, generátor, diszkriminátor, kritikus |
| freeze | befagyasztás |
| mode collapse (DLV: „modal collapse” ⚠️) | módusz-összeomlás |
| vanishing gradient, failure to converge | eltűnő gradiens, konvergencia hiánya |
| conditional GAN, one-hot | feltételes GAN, one-hot kódolás |
| entangled / disentangled | összefonódott / szétválasztott (látens irányok) |
| Nash equilibrium | Nash-egyensúly |
| diffusion model, forward/reverse process | diffúziós modell, előre (zajosító) / visszafelé (zajtalanító) folyamat – HAW szóhasználata ⚠️ eltér |
| noise schedule (linear, cosine), timestep | zajütemezés (lineáris, koszinusz), időlépés |
| U-Net, latent diffusion, classifier-free guidance | U-Net, látens diffúzió, osztályozó nélküli irányítás (guidance) |
| img2img, image strength / denoising strength | kép-a-képből, „képerősség” (DreamStudio-csúszka fordított logikájú, HAW is panaszolja) |
| consistency model, flow matching | konzisztencia-modell, flow matching |
| normalizing flow, coupling layer | normalizáló folyam, csatoló réteg |
| autoregressive, chain rule | autoregresszív, (valószínűségi) láncszabály |
| greedy, top-k, top-p / nucleus, temperature, seed | mohó dekódolás, top-k, top-p (nucleus), hőmérséklet, mag (seed) |
| perplexity | perplexitás („zavarodottság”) |
| FID, Inception Score | Fréchet Inception-távolság, Inception-pontszám |
| deep dream / inceptionism, neural style transfer, Gram matrix | deep dream, neurális stílusátvitel, Gram-mátrix |
| deepfake, synthetic data, model collapse, memorization | deepfake (mélyhamisítvány), szintetikus adat, modellösszeomlás, memorizálás |

---

## 11. Ábra- és widget-ötletek (forrásonként)

1. **Tartalmi vs. paraméteres keverés** két körrel (DLV Fig. 18-1…18-3) – egyszerű SVG + csúszka.
2. **„Mennyi fér a szűk keresztmetszetbe?”** – 784 → k → 784 rekonstrukció k = 2, 10, 20 (DLV
   18-15/16) – előre generált képsor.
3. **2D látens térkép** (AE vs. VAE egymás mellett, DLV Fig. 18-20/23 vs. 18-56/57) – rácsra kattintva
   dekódolt kép; az AE üres foltjai vs. a VAE kör alakú, kitöltött tere.
4. **Reparaméterezés-ábra**: μ, σ, ε → z = μ + σε (a DLV ábrájának javított változata).
5. **2D GAN „tanuló felhő”** (DLV pp. 660–666): kék Gauss (5,5), narancs generált felhő epochonként.
6. **Mode collapse hisztogram** a HAW Table 6-1 számaival (10%-os várható vonallal).
7. **Diffúziós lánc**: 9 lépéses zajosítás lineáris vs. koszinusz ütemezéssel (HAW Fig. 6-8), csúszkával t.
8. **Láncszabály-fa / greedy dekódolás** (FLLM Table 2.1) kis szókinccsel, szorzat lépésenként.
9. **Top-k / top-p / temperature** csúszkás oszlopdiagram (MLQ Fig. 10-3/10-4).
10. **Deep dream ↔ style transfer** szembeállító folyamatábra (mit fagyasztunk, mit optimalizálunk,
    max. vagy min.).
