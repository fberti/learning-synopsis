# 14. fejezet – Generatív modellek: tényellenőrzés a „📅 Állapot: 2026” dobozokhoz

Készült: 2026-11-09. Elsődleges forrás (arXiv, hivatalos blog/model card, Hivatalos Lap) ahol lehetett.
Jelölések: ✅ elsődleges forrásból igazolva · 🔹 csak másodlagos forrás (sajtó, ügyvédi iroda) · ❓ nem igazolt · ⚠️ ellentmondó források.

---

## 1. Tréningadat-memorizálás diffúziós modellekben

**Carlini et al. 2023** ✅ (a cikk PDF-jéből idézve)
N. Carlini, J. Hayes, M. Nasr, M. Jagielski, V. Sehwag, F. Tramèr, B. Balle, D. Ippolito, E. Wallace:
*Extracting Training Data from Diffusion Models*. USENIX Security 2023. arXiv:2301.13188 (2023-01-30). https://arxiv.org/abs/2301.13188

- **Stable Diffusion:** a tanítóhalmaz **350 000 leggyakrabban duplikált** példájának feliratát használták promptként,
  promptonként **500** képet generáltak → összesen **175 millió** kép.
- **94** kép felelt meg a formális „(ℓ₂, 0,15)-kinyert” definíciónak; a top-1000 kép kézi átnézése további **13**-at talált
  → összesen **109** közel-másolat. 50 memorizált képet **0 téves pozitívval** azonosítottak.
- A kinyert képek 58%-a felismerhető személyt ábrázoló fotó, 17% termékfotó, 14% logó/plakát.
- **Imagen:** a **top-1000** legduplikáltabb promptra, promptonként 500 kép → **23** memorizált a 1000-ből (sokkal több,
  mint SD-nél). A 500 leginkább „kilógó” (nem duplikált) képből **3**-at is visszaadott; SD-nél 10 000 próbálkozásból 0.
- **Duplikáció szerepe:** a kinyert SD-képek jellemzően **≥ 100-szor** duplikáltak a tanítóadatban („duplication is a major
  factor”). CIFAR-10 deduplikáció (5 275 kép eltávolítva az 50 000-ből) után 1 280 helyett 986 regenerált példa – mérséklődik,
  de nem szűnik meg.
- Bevezetőjük összegzése: a diffúziós modellek több mint kétszer annyi tanítóadatot szivárogtatnak ki, mint a GAN-ok (CIFAR-10-en).
- ⚠️ apró megfogalmazási különbség: az absztrakt „over a thousand training examples”-t említ (CIFAR-10-zel együtt),
  a bevezető SD+Imagen-re „over a hundred” közel-azonos replikát. A tananyagban a konkrét számokat (109 / 23) érdemes idézni.

**Somepalli et al. 2023** ✅
G. Somepalli, V. Singla, M. Goldblum, J. Geiping, T. Goldstein: *Diffusion Art or Digital Forgery? Investigating Data
Replication in Diffusion Models*. CVPR 2023. arXiv:2212.03860. https://arxiv.org/abs/2212.03860
- 9 000 LAION-Aesthetics-feliratból generáltak SD-képet, és csak a **12 milliós LAION Aesthetics v2 6+** részhalmazban kerestek.
- SSCD-hasonlóság ≥ 0,5 a véletlen generálások **kb. 1,88%**-ánál („≈ 170 kép”), ami felett „jelentős másolás” látszik
  (gyakran részleges: háttér, objektum). Mivel csak a 12M-es részhalmazt nézték, ez alsó becslés.

**Somepalli et al. 2023b** ✅ *Understanding and Mitigating Copying in Diffusion Models*, NeurIPS 2023, arXiv:2305.20086.
Fő állítás: a **felirat (caption) kondicionálás / duplikált kép–felirat párok** legalább olyan fontosak, mint a képduplikáció;
mitigáció: feliratok randomizálása/augmentálása.

**Újabb eredmények (2024–2026)** – Consensus-találatok alapján ✅ (absztrakt szintjén):
- Wen, Liu, Chen, Lyu: *Detecting, Explaining, and Mitigating Memorization in Diffusion Models* (ICLR 2024; arXiv:2407.21720) –
  a szövegfeltételes predikció nagyságából már az első lépésben felismerhető a memorizált prompt.
- Chen, Liu, Xu: *Towards Memorization-Free Diffusion Models* (CVPR 2024) – Anti-Memorization Guidance; okok: kép- és
  feliratduplikáció, túl specifikus prompt.
- Kowalczuk et al.: *Finding Dori* (arXiv:2507.16880, 2025) – a súlymetszéses (pruning) védekezés törékeny; a memorizáció
  **nem lokális**, kis embedding-perturbációval újra előhívható.
- Shah et al.: *Does Generation Require Memorization?* (arXiv:2502.21278, 2025) – elméleti érv: memorizáció csak kis zajszinten
  „kell”; zajos adatos tanítással csökkenthető minőségromlás nélkül.
- Kapcsolódó jogi tény (szöveg, nem kép) 🔹: a Müncheni Tartományi Bíróság 2025-11-11-én a **GEMA v. OpenAI** ügyben dalszöveg-
  memorizálás miatt nagyrészt a GEMA-nak adott igazat (CMS AI-case tracker). https://cms.law/en/ken/publication/artificial-intelligence-and-copyright-case-tracker/united-kingdom-getty-images-us-inc-ors-v-stability-ai-ltd2

---

## 2. Diffúzió és flow matching – alapcikkek és mai állás

| Mű | Hivatkozás | Ellenőrzött tény |
|---|---|---|
| **DDPM** ✅ | J. Ho, A. Jain, P. Abbeel, NeurIPS 2020, arXiv:2006.11239 | CIFAR-10 FID **3,17**, IS 9,46 |
| **DDIM** ✅ | J. Song, C. Meng, S. Ermon, ICLR 2021, arXiv:2010.02502 | **10–50×** gyorsabb mintavétel (falióra-idő) DDPM-hez képest |
| **Latent diffusion** ✅ | R. Rombach, A. Blattmann, D. Lorenz, P. Esser, B. Ommer, CVPR 2022, arXiv:2112.10752 | autoenkóder perceptuális (LPIPS) + **patch-alapú adverzariális** veszteséggel; KL- vagy VQ-regularizáció; f ∈ {1,…,32} közül **f = 4 és 8** a legjobb |
| **Classifier-free guidance** ✅ | J. Ho, T. Salimans, NeurIPS 2021 workshop; arXiv:2207.12598 | egy modell feltételes+feltétel nélküli; a két becslés kombinálása |
| **DiT** ✅ | W. Peebles, S. Xie, ICCV 2023, arXiv:2212.09748 | U-Net helyett transzformer látens patch-eken; DiT-XL/2 FID **2,27** (ImageNet 256) |
| **Flow matching** ✅ | Y. Lipman, R. T. Q. Chen, H. Ben-Hamu, M. Nickel, M. Le, ICLR 2023, arXiv:2210.02747 | szimulációmentes CNF-tanítás; OT-útvonal |
| **Rectified flow** ✅ | X. Liu, C. Gong, Q. Liu, ICLR 2023, arXiv:2209.03003 | egyenes útvonalak; ismételt „rectification” → akár **1 Euler-lépés** |
| **SD3** ✅ | P. Esser et al. (17 szerző), ICML 2024, arXiv:2403.03206 | rectified flow + MM-DiT (külön súlyok szövegre/képre), legnagyobb **8B** |

(A konferencia-helyszíneket a flow matching / rectified flow / DiT esetén az arXiv-oldal nem jelzi; ezek közismertek, de a lapon nem szerepelnek.)

**Látens méret 512×512×3 → 64×64×4?** ✅ Igen. Az SD v1.4 model card: „maps images of shape H × W × 3 to latents of shape
H/f × W/f × 4”, f = 8; tanítás 512×512-n → 64×64×4 (48-szoros elemszám-csökkenés: 786 432 → 16 384).
https://huggingface.co/CompVis/stable-diffusion-v1-4
Az SD v1 UNet **860M**, a CLIP ViT-L/14 szövegkódoló **123M** paraméteres (diffusers dokumentáció).

**Guidance scale 7,5** ✅: a diffusers `StableDiffusionPipeline` alapértéke `guidance_scale = 7.5`, `num_inference_steps = 50`.
https://huggingface.co/docs/diffusers/api/pipelines/stable_diffusion/text2img
(Az LDM-cikk mintaábráin s = 10, a kvantitatív táblában s = 1,5 – vagyis a 7,5 a gyakorlati alapérték, nem a cikk száma.)

**Kevés lépéses mintavétel** ✅
- Progressive distillation – T. Salimans, J. Ho, ICLR 2022, arXiv:2202.00512: 8 192 lépésből **4 lépés**, CIFAR-10 FID 3,0.
- Consistency models – Y. Song, P. Dhariwal, M. Chen, I. Sutskever, ICML 2023, arXiv:2303.01469: **1 lépés**, FID 3,55 (CIFAR-10), 6,20 (ImageNet 64).
- ADD – A. Sauer, D. Lorenz, A. Blattmann, R. Rombach, arXiv:2311.17042 (2023-11-28): **1–4 lépés**; 4 lépésben eléri az SDXL-t.
  Ez az SDXL Turbo módszere (a Stability bejelentés címe: „Introducing SDXL Turbo…”; a cikk absztraktja maga nem nevezi meg).
- FLUX.1 [dev]: **guidance distillation** (a CFG kétszeri kiértékelését desztillálják ki).

**2025–2026-os jellemző architektúra: látens tér + transzformer (DiT/MMDiT) + flow matching / rectified flow** ✅
- FLUX.1 [dev] (Black Forest Labs): „12 billion parameter **rectified flow transformer**”. https://huggingface.co/black-forest-labs/FLUX.1-dev
- **FLUX.2** (2025-11-25): „latent flow matching architecture”; **Mistral-3 24B** VLM + rectified flow transformer; új VAE
  (Apache 2.0); [dev] = **32B** nyílt súlyú. https://bfl.ai/blog/flux-2
- Qwen-Image (arXiv:2508.02324, 2025-08): Qwen2.5-VL + **MMDiT, 20B**, flow matching célfüggvény (a PDF törzséből).
- Wan (videó, arXiv:2503.20314, 2025-03): 1,3B és 14B; „DiT combined with Flow Matching” + saját (3D) VAE.
- **Veo 3** (Google DeepMind model card, 2026. januári változat): „Veo 3 utilizes **latent diffusion**… applied to the temporal
  audio latents, and the spatio-temporal video latents” – vagyis közös hang+videó látens diffúzió; SynthID-vízjel.
  https://storage.googleapis.com/deepmind-media/Model-Cards/Veo-3-Model-Card.pdf
- **Sora (2024)** rendszerkártya 🔹: diffúziós modell transzformerrel, „visual patches” (keresőkivonat; az oldal 403-at adott).
  **Sora 2** (2025-09-30) architektúrája: ❓ nem igazolt – a rendszerkártya nem részletezi.
- ⚠️ Fontos 2026-os fejlemény 🔹: az OpenAI 2026-03-24-én bejelentette a **Sora app leállítását**: web/app 2026-04-26-án,
  API 2026-09-24-én szűnt meg (The Decoder, Engadget, AP). https://the-decoder.com/openai-sets-two-stage-sora-shutdown-with-app-closing-april-2026-and-api-following-in-september/
  Hogy a Sora 2 ChatGPT-ben elérhető maradt-e: ❓ ellentmondó/nem igazolt.

---

## 3. Autoregresszív képgenerálás visszatérése; diffúziós nyelvi modellek

**GPT-4o natív képgenerálás** ✅ – *Addendum to GPT-4o System Card: Native image generation*, OpenAI, **2025-03-25**.
Szó szerint: „Unlike DALL·E, which operates as a diffusion model, 4o image generation is an **autoregressive** model natively
embedded within ChatGPT.” Eredetigazolás: „C2PA metadata on all assets”.
https://cdn.openai.com/11998be9-5319-4302-bfbf-1167e093f1fb/Native_Image_Generation_System_Card.pdf
(Pontos dekóder-részletek – pl. van-e diffúziós dekóder a tokenek után – ❓ nem nyilvánosak.)

**VAR** ✅ – K. Tian, Y. Jiang, Z. Yuan, B. Peng, L. Wang: *Visual Autoregressive Modeling: Scalable Image Generation via
Next-Scale Prediction*, arXiv:2404.02905 (2024-04-03). **NeurIPS 2024 Best Paper** (fő track; NeurIPS blog/díjoldal).
„Következő skála” predikció raszter-sorrend helyett; ImageNet 256: FID **18,65 → 1,73**, IS 80,4 → 350,2, **~20×** gyorsabb
az AR alapmodellnél; állításuk szerint felülmúlja a DiT-et. https://arxiv.org/abs/2404.02905

**Diffúziós nyelvi modellek**
- **LLaDA** ✅ – S. Nie, F. Zhu, Z. You, X. Zhang, J. Ou, J. Hu, J. Zhou, Y. Lin, J.-R. Wen, C. Li: *Large Language Diffusion
  Models*, arXiv:2502.09992 (2025-02-14). 8B, maszkolásos diffúzió, „competitive with LLaMA3 8B” in-context tanulásban;
  a „reversal curse”-ön jobb a GPT-4o-nál egy vers-megfordítási feladaton.
- **Mercury (Inception Labs)** ✅ – arXiv:2506.17298 (2025-06-17): Mercury Coder Mini **1 109 token/s**, Small **737 token/s**
  H100-on (Artificial Analysis mérése), „akár 10×” gyorsabb a sebességre optimalizált modelleknél.
- **Mercury 2** – Inception blog ✅: **1 009 token/s** NVIDIA Blackwellen, 128K kontextus, érvelő (reasoning) dLLM.
  ⚠️ dátum: a sajtó (The Decoder, NYU RITS) **2026-02-24**-et ír, a blogoldal fejléce „Oct 29, 2026”-ot mutat (valószínűleg frissítés).
  https://www.inceptionlabs.ai/blog/introducing-mercury-2
- **Gemini Diffusion** ✅ – Google DeepMind (I/O 2025): **1 479 token/s** (overhead nélkül, +0,84 s overhead), **kísérleti demó**;
  kódolásban ≈ Gemini 2.0 Flash-Lite (HumanEval 89,6% vs 90,2%), de GPQA Diamond 40,4% vs 56,5%.
  https://deepmind.google/models/gemini-diffusion/
- **DiffusionGemma** ✅ – Google blog, **2026-06-10**: nyílt súlyú (Apache 2.0) 26B MoE (~3,8B aktív), 256 tokenes blokkokat
  generál párhuzamosan; >1 000 token/s H100-on; **minősége elmarad a standard Gemma 4-től**.
  https://blog.google/innovation-and-ai/technology/developers-tools/diffusion-gemma-faster-text-generation/
- **Elterjedtség 2026-ra (értékelés):** a dLLM-ek a **sebesség-niche**-ben (kód, ágensciklusok, alacsony késleltetés) élnek;
  a csúcsmodellek továbbra is autoregresszívak. Piaci részesedési számot nem találtam: ❓.

---

## 4. GAN

- **StyleGAN** ✅ – T. Karras, S. Laine, T. Aila: *A Style-Based Generator Architecture for Generative Adversarial Networks*,
  CVPR 2019, arXiv:1812.04948 (2018-12-12). Stílustranszfer ihlette generátor (AdaIN), magas szintű attribútumok és sztochasztikus
  részletek szétválasztása; új arc-adathalmaz (FFHQ).
- **thispersondoesnotexist.com** 🔹 – Phillip Wang (volt Uber-mérnök), **2019 februárja** (2019-02-11 körül tette közzé egy
  Facebook-csoportban), NVIDIA StyleGAN alapon; minden frissítésnél új arc egy 512 dimenziós vektorból. ⚠️ Később a sajtó
  StyleGAN2-t/StyleGAN3-at említ – a modell lecserélődhetett. (PetaPixel 2019-02-19; Inverse.)
  https://petapixel.com/2019/02/19/this-website-generates-ai-portraits-of-people-who-dont-exist
- **Módusösszeomlás klasszikus hivatkozása** ✅: már az eredeti GAN-cikk leírja – I. Goodfellow et al.: *Generative Adversarial
  Nets*, NeurIPS 2014, arXiv:1406.2661, 6. fejezet: „the **Helvetica scenario** in which G collapses too many values of z to the
  same value of x”. A „mode collapse” kifejezés tankönyvi forrása: Goodfellow, *NIPS 2016 Tutorial: GANs*, arXiv:1701.00160 (❓ ezt
  külön nem nyitottam meg). Kynkäänniemi et al. 2019 is a „mode collapse”-t nevezi meg a recall-csökkenés okaként.
- **GAN-ok mai szerepe** ✅:
  - adverzariális veszteség **desztillációban**: ADD/SDXL Turbo (fent, 1–4 lépés);
  - **a látens diffúzió VAE-jének tanításában** patch-diszkriminátor (Rombach et al. 2022);
  - „GAN-reneszánsz”: Y. Huang, A. Gokaslan, V. Kuleshov, J. Tompkin: *The GAN is dead; long live the GAN! A Modern GAN
    Baseline* (R3GAN), NeurIPS 2024, arXiv:2501.05441 – regularizált relativisztikus veszteség, felülmúlja a StyleGAN2-t.

---

## 5. VAE

- **VAE** – D. P. Kingma, M. Welling: *Auto-Encoding Variational Bayes*, arXiv:1312.6114 (2013-12), ICLR 2014. (Párhuzamosan:
  Rezende, Mohamed, Wierstra 2014.) (Közismert; az arXiv-oldalt külön nem nyitottam meg.)
- **VAE mint a látens diffúzió kódolója** ✅: SD v1 – KL-regularizált autoenkóder, f = 8, 4 csatorna; FLUX.2 – új VAE (Apache 2.0);
  Wan – saját 3D-s videó-VAE. A diffusers is `AutoencoderKL`-nek hívja („Variational Auto-Encoder… to encode and decode images
  to and from latent representations”). Megjegyzés: az LDM-autoenkóder KL-tagja „slight” (nagyon kis súlyú), tehát inkább
  regularizált autoenkóder, mint klasszikus VAE.
- **VQ-VAE** ✅ – A. van den Oord, O. Vinyals, K. Kavukcuoglu: *Neural Discrete Representation Learning*, NeurIPS 2017,
  arXiv:1711.00937. Diszkrét kódok, tanult (autoregresszív) prior; elkerüli a „posterior collapse”-t.

---

## 6. Értékelés: FID és kritikái

- **FID** ✅ – M. Heusel, H. Ramsauer, T. Unterthiner, B. Nessler, S. Hochreiter: *GANs Trained by a Two Time-Scale Update
  Rule Converge to a Local Nash Equilibrium*, NeurIPS 2017, arXiv:1706.08500.
  Definíció a cikkből: Inception-v3 „**last pooling layer** as coding layer”; mindkét halmazra átlag (m) és kovariancia (C),
  Gauss-közelítés, a két Gauss **Fréchet- (= Wasserstein-2) távolsága**:
  FID = ‖m − m_w‖² + Tr(C + C_w − 2 (C·C_w)^{1/2}). A modellből **50 000** képet generáltak.
  A **2048 dimenzió** a pool3 réteg mérete – ezt a referencia-implementáció adja meg („2048: final average pooling features
  (this is the default)”), nem a cikk szövege. https://github.com/mseitzer/pytorch-fid
- **Kritikák** ✅ – S. Jayasumana, S. Ramalingam, A. Veit, D. Glasner, A. Chakrabarti, S. Kumar: *Rethinking FID: Towards a
  Better Evaluation Metric for Image Generation*, CVPR 2024, arXiv:2401.09603: az Inception-jellemzők rosszul írják le a modern
  T2I tartalmat; **hibás normalitás-feltevés**; rossz mintakomplexitás; ellentmond emberi értékelőknek. Javaslat: **CMMD** = CLIP-
  beágyazások + **MMD Gauss-RBF kernellel**, torzítatlan, eloszlásfeltevés nélküli.
  (A CVPR-helyszínt az arXiv-oldal nem jelzi; közismert.)
  Továbbá: Kynkäänniemi et al., *The Role of ImageNet Classes in Fréchet Inception Distance*, ICLR 2023 (❓ nem nyitottam meg).
- **Precision/recall** ✅ – T. Kynkäänniemi, T. Karras, S. Laine, J. Lehtinen, T. Aila: *Improved Precision and Recall Metric
  for Assessing Generative Models*, NeurIPS 2019, arXiv:1904.06991. Minőség (precision) és lefedettség (recall) külön;
  **k-NN hipergömbök** a VGG-16 (2. teljesen összekötött réteg) jellemzőterében, tipikusan **k = 3**.

---

## 7. Deepfake és eredetigazolás

- **C2PA / Content Credentials** ✅🔹 – a C2PA a Joint Development Foundation projektje, nyílt szabvány tartalom-eredetre;
  a Content Authenticity Initiative (Adobe, 2019) és a Project Origin (Microsoft+BBC, 2020) egyesítéséből (c2pa.org/about).
  Alapítás 2021 (🔹 2021-02-22: Adobe, Arm, BBC, Intel, Microsoft, Truepic – wiki-forrás). Specifikáció **2.2: 2025-05-01** ✅
  (spec címlap); 2.3/2.4 dátuma ⚠️ ellentmondó. https://c2pa.org/specifications/specifications/2.2/specs/C2PA_Specification.html
  Az OpenAI a GPT-4o képeire C2PA-metaadatot tesz ✅ (system card).
- **SynthID** (Google DeepMind):
  - 2023: kép (Imagen), később hang, szöveg, videó ✅ – „embeds digital watermarks directly into AI-generated images, audio,
    text or video”. https://deepmind.google/models/synthid/
  - **SynthID Text** nyílt forrás **2024 októberében** (Hugging Face Transformers 4.46-tól) 🔹; Nature-cikk: S. Dathathri et al.,
    *Scalable watermarking for identifying large language model outputs*, Nature 634 (2024), megjelent 2024-10-23 🔹;
    ~**20 millió** Gemini-válaszon élő kísérlet 🔹. https://www.nature.com/articles/s41586-024-08025-4
  - I/O 2025: **> 10 milliárd** vízjelezett tartalom; **SynthID Detector** portál 🔹 (TechCrunch).
  - 2026 ✅: a Google oldala szerint a Detector már „Google or our partners, including **OpenAI, NVIDIA, Kakao, and soon,
    Apple**” tartalmát is felismeri. Dátumok 🔹: partnerségek bejelentése I/O 2026 (május), Detector-bővítés 2026-10-07.
  - Korlát: a szöveges vízjel alapos átírással gyengül; a vízjel csak SynthID-t használó eszközökre működik.
- **EU AI Act 50. cikk** ✅ (Hivatalos Lap):
  - Eredetileg: a 50. cikk az általános alkalmazási napon, **2026. augusztus 2-án** lép életbe (AI Act 113. cikk).
  - **Digital Omnibus on AI = (EU) 2026/1744 rendelet**, kelt 2026-07-08, kihirdetve **2026-07-24**, hatályba lépés a kihirdetést
    követő 3. napon (**2026-07-27**). Szövege: a **2026-08-02 előtt piacra hozott** szintetikus audio/kép/videó/szöveg-generáló
    rendszerek szolgáltatóinak a **50. cikk (2) bekezdésének (gépi olvasható jelölés) 2026. december 2-ig** kell megfelelniük
    („transitional period of four months”). A többi 50. cikkbeli kötelezettség (pl. deepfake-címkézés, chatbot-tájékoztatás)
    2026-08-02-től alkalmazandó 🔹 (Gibson Dunn).
  - Új tilalom (5. cikk (1) ba/bb): hozzájárulás nélküli intim képek („nudifier”) és CSAM generálása – alkalmazandó **2026-12-02**-től ✅.
  - Magas kockázatú (III. melléklet) rendszerek: **2027-12-02**, I. melléklet szerinti termékek: **2028-08-02** ✅.
  - Politikai megállapodás: 2026-05-06 🔹. Forrás: https://eur-lex.europa.eu/eli/reg/2026/1744/oj (a szöveget egy OJ-PDF-másolatból
    olvastam: https://www.ibf-solutions.com/fileadmin/dateidownloads/regulation-2026-1744.pdf)
  - **Gyakorlati kódex a jelölésről/címkézésről**: a Bizottság végleges változata **2026-06-10** 🔹 (önkéntes; Bizottsági sajtóközlemény
    IP/26/1328). https://digital-strategy.ec.europa.eu/en/news/commission-publishes-code-practice-marking-and-labelling-ai-generated-content
- **Arup-eset** 🔹 – 2024 januárja: az Arup hongkongi irodájának pénzügyi munkatársa videóhívásban deepfake „pénzügyi igazgatónak”
  és kollégáknak **15 tranzakcióban HK$ 200 milliót (~US$ 25,6 millió)** utalt; a rendőrség 2024 februárjában nevesítés nélkül
  közölte, az Arup **2024 májusában** megerősítette (CNN, SCMP). ⚠️ egyes brit lapok „£20m”-t írnak (átváltási kerekítés).
  https://www.scmp.com/news/hong-kong/law-and-crime/article/3263151/uk-multinational-arup-confirmed-victim-hk200-million-deepfake-scam-used-digital-version-cfo-dupe

---

## 8. Szerzői jog (lényeg, dátummal) – többnyire 🔹 ügyvédi irodák / szaksajtó

- **Getty Images v. Stability AI (UK High Court)** – [2025] EWHC 2863 (Ch), **2025-11-04**, Joanna Smith J.
  A tanításra és a kimenetekre vonatkozó elsődleges jogsértési igényeket Getty **még a tárgyalás során ejtette** (a tanítás
  nem az Egyesült Királyságban történt). **Másodlagos jogsértés: elutasítva** – egy MI-modell elvben lehet „article”, de a Stable
  Diffusion **nem tartalmaz (nem „embody”) jogsértő másolatot**. Védjegy: **szűk részsiker** – egyes régi modellverziók
  kimenetein megjelenő iStock/Getty Images vízjelek miatt (s.10(1) és s.10(2)); a hírnévre alapozott s.10(3) elutasítva,
  passing off-ról nem döntött. **2025 decembere**: Getty engedélyt kapott fellebbezni a másodlagos jogsértés kérdésében
  ([2025] EWHC 3343 (Ch)); Stability védjegy-fellebbezési kérelmét a bíró elutasította. Fellebbviteli tárgyalás dátuma: ❓.
  (AIPPI; IPKat; HSF Kramer.) https://www.aippi.org/news/getty-images-v-stability-ai-uk-high-court-finds-no-secondary-copyright-infringement-in-landmark-genai-ruling/
- **NYT v. OpenAI & Microsoft** (SDNY, 1:23-cv-11195, Stein bíró; benyújtva 2023-12-27): 2025 áprilisában a lényegi igények
  túlélték az elutasítási indítványt; 2025 novemberében 20 millió anonimizált ChatGPT-napló kiadását rendelték el (2026-01-05
  megerősítve); 2026 márciusában (Cox v. Sony után) a Times ejtette a közvetett (contributory) jogsértési igényt; 2026 nyarán
  **summary judgment indítványok függőben**; tárgyalási dátum ❓. (Bloomberg Law, IPWatchdog.)
- **Andersen v. Stability AI** (N.D. Cal., 3:23-cv-00201-WHO, Orrick bíró): 2024-08-12-én a szerzői jogi és indukált jogsértési
  igények továbbmehettek; alperesek: Stability, Midjourney, DeviantArt, Runway. 2026 februárjában a menetrendet halasztották:
  summary judgment meghallgatás **2027-02-17** (✅ chatgptiseatingtheworld.com); tárgyalás 2027 tavasz ❓ (ellentmondó dátumok).
- **Thomson Reuters v. Ross Intelligence**: 2025-02-11, Bibas bíró (D. Del.): a Westlaw-fejjegyzetekkel való tanítás **nem
  fair use** (nem generatív MI). **2026-09-29**: a **Harmadik Kerületi Fellebbviteli Bíróság megerősítette** (No. 25-2153) – az
  első szövetségi fellebbviteli döntés MI-tanítás és fair use kérdésében; hangsúlyozottan szűk, a generatív MI-t nyitva hagyja.
  (IPWatchdog 2026-09-30; Ballard Spahr; Haynes Boone.)
- **Bartz v. Anthropic**: 2025-06-23 Alsup bíró: a megvásárolt könyvekkel tanítás fair use, a kalózkönyvtárak (LibGen, PiLiMi)
  letöltése/megtartása nem. Egyezség: **1,5 milliárd USD**, kb. **3 000 USD/mű** (≈ 480–500 ezer mű 🔹); **végleges jóváhagyás
  2026-07-20** (Araceli Martínez-Olguín bíró), csak a **2025-08-25-ig** tartó múltbeli másolásra; a kimenetekkel kapcsolatos
  igényekre nem vonatkozik. „A legnagyobb szerzői jogi csoportos egyezség az USA-ban.” (Authors Guild)
  https://authorsguild.org/news/court-grants-final-approval-anthropic-copyright-settlement/

---

## 9. Stílusátvitel

- ✅ L. A. Gatys, A. S. Ecker, M. Bethge: *A Neural Algorithm of Artistic Style*, arXiv:1508.06576 (**2015-08-26**) – a tartalom
  és a stílus neurális reprezentációjának szétválasztása és újrakombinálása tetszőleges képekre.
- Konferenciaváltozat: *Image Style Transfer Using Convolutional Neural Networks*, CVPR 2016 (közismert; nem nyitottam meg).
  Módszer: VGG-jellemzők; stílus = rétegenkénti **Gram-mátrixok**, tartalom = mélyebb réteg aktivációi; a kép pixeleit
  optimalizálják gradiensereszkedéssel (lassú → Johnson et al. 2016 előrecsatolt hálója; Huang & Belongie 2017 AdaIN, amelyre a
  StyleGAN épít – ❓ ezeket külön nem ellenőriztem).

---

## Ellentmondások / nyitott pontok összesítve
- Sora 2 architektúrája ❓; a Sora app 2026-ban leállt (2026-04-26).
- Mercury 2 megjelenési dátuma ⚠️ (2026-02-24 vs. blogfejléc 2026-10-29).
- Getty-fellebbezés tárgyalási dátuma ❓; Andersen tárgyalási dátuma ❓.
- thispersondoesnotexist.com StyleGAN-verziója ⚠️ (2019: StyleGAN; később StyleGAN2/3).
- C2PA 2.3/2.4 dátumai ⚠️.
