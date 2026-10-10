# Ch11 source digest B — PDL, MLQ, MLSYS, AAMLP

Extracts are in `_parts/src/`. `L123` = line number in the named file.
- `PDL11_ch12.txt` = Kneusel, *Practical Deep Learning* ch12 "Introduction to CNNs" (PDF pp. 315–340, book pp. 283–308; offset 32)
- `PDL11_ch13_14.txt` = ch13 "Experiments with Keras and MNIST" (L1–1425) + ch14 "Experiments with CIFAR-10" (L1426–)
- `MLQ11.txt` = Raschka, *ML and AI Beyond the Basics*: ch2 self-supervised (L1–180), ch5 overfitting/data (L181–318), ch11 counting parameters (L319–460), ch12 FC vs conv (L461–568), ch13 ViTs need large data (L569–810)
- `MLSYS11_cnn.txt` = Reddi et al., *ML Systems*: §3.7 USPS case study (L1–262), ch4 "DNN Architectures": §4.2 MLP (L508–897), §4.3 CNN (L901–1347), §4.6 evolution (L1396–1598), §4.7 primitives/im2col (L1626–2110), §4.8 selection, Tables 4.6/4.7 (L2121–2520), §4.9 inductive biases (L2522–2590), fallacies (L2593–2676). Benchmark-chapter ImageNet facts are cited by PDF page (pp. 1066–1067).
- `AAMLP11_image.txt` = Thakur, *Approaching (Almost) Any ML Problem*, "Approaching image classification & segmentation" (book pp. 185–224)
- Checks: `calc/s11b_checks.py` (numpy; all numbers below marked ✓ were recomputed there), `calc/s11b_k2.py`. Figures read from renders in `src/img/pdl11_*.png`, `src/img/mlq11_*.png`.

**Quick answers to the brief:**
- **Convolution vs cross-correlation.**
  - All four sources *compute* cross-correlation (no kernel flip).
  - Only AAMLP says so explicitly ("summation of elementwise multiplication (cross-correlation)", L283–284).
  - PDL calls it "convolution" and even "the full convolution operation" (L518), which is a double misnomer: "full" is also the name of the padding mode that gives a *larger* output.
  - MLSYS's formula H_{i,j,k} = f(ΣΣΣ W_{di,dj,c,k} H_{i+di,j+dj,c} + b_k) (L1018) and Listing 4.4 (`in_y = y + ky`) are correlation.
  - MLQ ch12 says "the convolutional operator * is equal to an element-wise multiplication" (L516–517).
  - Teaching tip: PDL's single-channel kernel [[0,−1,0],[−1,3,−1],[0,−1,0]] is flip-symmetric, so it does not matter there. The multichannel example does differ: flipped kernels give completely different outputs (✓).
- **Output-size formula.**
  - Only AAMLP gives one: "[(8−3)/2] + 1 = 3.5, take the floor" (L299–300). That means ⌊(n−k)/s⌋+1 with no padding term.
  - PDL gives only the special cases "valid loses k−1" and "same keeps n" (L155–191). Its FCN formula h = (H−28)/2+1 (L1108–1110) has no floor.
  - MLQ and MLSYS give none. The general ⌊(n+2p−k)/s⌋+1 (with dilation: k → d(k−1)+1) is a "Kiegészítés".
- **Parameter counts.**
  - Correct: PDL's Keras models (1,199,882; CIFAR 1,626,442 / 1,139,338), 9 of 10 rows of Table 13-1, MLQ's 26,926, MLSYS 89,610 / VGG-16 138M / ResNet-50 25.6M / MobileNetV2 3.4M.
  - Wrong or misleading: PDL Table 13-1 row 1; MLSYS's "64 filters of 3×3 = 576 weights" for an RGB image; the MLSYS big-O tables (see the error lists below).

**Not covered by these sources** (mark as "Kiegészítés"):
- General output-size formula with padding and stride; "same" padding p = (k−1)/2.
- Receptive-field growth formula with stride/pooling. MLSYS only gives "layer 3 sees 7×7" (L1038–1040); PDL uses a non-standard RF definition, see PDL error 6.
- 1×1 convolution as channel mixing / bottleneck. MLQ ch12 hints at it (L528–547); PDL uses it as the "softmax conv" (L873–880).
- Global average pooling.
- VGG design rationale: two 3×3 = one 5×5 RF with 18C² vs 25C² params; three 3×3 vs one 7×7: 27C² vs 49C² (✓). MLSYS gives only "VGG-16 (2014) 138 million" (PDF p. 728; ✓ 138,357,544).
- ResNet block math. Only AAMLP (L1016–1043) and MLSYS (L1464–1473) describe it qualitatively.
- GoogLeNet/Inception: names only (AAMLP L1050, MLSYS p. 1067).
- Per-year ILSVRC numbers. Kiegészítés from Russakovsky et al. 2015 / He et al. 2015, to be checked:
  - 2010: 28.2%; 2011: 25.8%
  - 2012 AlexNet: 15.3% (16.4% without the extra ImageNet-2011 data)
  - 2013 ZFNet/Clarifai: ≈11.7%
  - 2014: GoogLeNet 6.7%, VGG 7.3%
  - 2015 ResNet ensemble: 3.57%
  - Human (Karpathy): ≈5.1%
- Object detection: bounding boxes, IoU, NMS, two-stage vs YOLO. PDL only names YOLO (L1355–1361).
- **Dice / IoU metrics.** AAMLP mentions only "dice loss" as a loss option (L1742–1744). It gives no Dice/IoU formula, although its pneumothorax task is a segmentation competition.
- Instance vs semantic segmentation.
- Transposed-convolution arithmetic. AAMLP only says "creates a larger image" (L1100–1105).
- Augmentation rules: label-preserving vs label-breaking (only MLQ exercise 5-2 hints at 6↔9 flips, L295–300); test-time augmentation; Mixup/CutMix details (named only, MLQ L278).
- BatchNorm in CNNs: PDL defers it to ch15 (L953–954); MLQ exercise 11-2 counts params only.
- ViT internals: patch embedding, CLS token, position embeddings. MLQ ch13 is conceptual; MLSYS gives only "16×16 patches → 196 tokens" (L1543–1555).
- Saliency/Grad-CAM, adversarial examples, robustness to shift (aliasing).
- The whole social side (11.8): facial recognition bias, surveillance, deepfakes, privacy. Nothing here apart from MLSYS's unsourced "validated across demographic groups" (L105–107) and MLQ's ImageNet Wikipedia link. Use another source (e.g. MV11).

---
## 1. PDL (Kneusel, Practical Deep Learning, ch12–14)

**Order of topics (ch12):**
- why CNNs: fewer params, "spatial invariance"; history note Fukushima 1980 vs LeCun 1998 (L35–68)
- convolution by hand on an MNIST "8" crop, Fig 12-1 (L70–159)
- valid vs zero-padding (L165–191)
- convolution as classic image processing, 5×5 kernels for edge/diagonal/blur on a moon image, Fig 12-2 (L194–227)
- anatomy of the Keras MNIST CNN, Fig 12-3 (L230–276)
- layer types and the 4D tensor (batch, H, W, C) (L279–370)
- shapes through the net (L372–419)
- kernel vs filter terminology, worked 5×5×2 → 3×3×3 example (L422–557)
- learned first-layer kernels and their responses, Figs 12-4/12-5, V1 analogy (L560–645)
- receptive field (L651–705)
- init: Glorot default (L708–718)
- pooling, Fig 12-7; Hinton's "pooling is a big mistake" quote (L723–810)
- FC layers hold 98.3% of the params (L813–857)
- fully convolutional nets, FC → 12×12 conv; FCN 2014, U-Net 2015 (L860–950)
- step-by-step activations, Figs 12-8/12-9; t-SNE of the dense layer, Fig 12-10 (L960–1106)

**Order of topics (ch13):**
- Keras code: data, model, `fit`, summary (L26–303)
- error curves with/without dropout, Figs 13-1/13-2 (L357–401)
- architecture experiments, Table 13-1 (L414–624)
- batch size vs fixed steps/epochs, Figs 13-3/13-4 (L627–737)
- optimizers, Fig 13-5 (L740–781)
- FCN conversion and digit heatmaps on big images, Figs 13-6–13-8 (L793–1365)
- scrambled pixels, Fig 13-9 (L1368–1399)

**Order of topics (ch14):**
- CIFAR-10 refresher (L1447–1476)
- shallow vs deep × Adadelta/SGD, Table 14-1 (L1478–1760)
- animal vs vehicle binary model with full metrics (L1764–1982)
- one-vs-rest vs multiclass (L1988–2199)
- transfer learning as CIFAR-embedding → classical models on MNIST (L2202–2468)
- fine-tuning: vehicles → cats/dogs with layer freezing, Table 14-2 (L2471–2853)

**Reusable points (ch12):**
- **Hand convolution** (L106–153, Fig 12-1).
  - Kernel [[0,−1,0],[−1,3,−1],[0,−1,0]] (a sharpening/Laplacian-type kernel).
  - First window [[60,248,67],[145,253,54],[145,253,54]] → **59**; the next window → **−212**.
  - The zero-padded corner gives **−213** (L181–188).
  - The whole 6×6 output in the figure was recomputed and matches exactly (✓; input pixel (7,0) is 185).
  - Valid convolution: 28×28 with 3×3 → 26×26 (border of 1); with 5×5 the border is 2 (L155–159, L178–180).
- Convolution predates ML: image scientists used it for decades. The same operation does blur, edges or diagonals depending only on the kernel (L198–216). The second benefit (besides fewer params) is that the model "gains insight" and is position-independent (L217–227).
- **4D tensor**: (minibatch, H, W, channels), channels-last in Keras/TF (L322–339). PyTorch is channels-first (AAMLP L354–355). Alpha channel is usually dropped (L337–339).
- **Kernel vs filter** (L435–463): kernel = one 2D matrix; filter = a stack of M kernels (one per input channel). N output maps need N filters of K×K×M, plus one bias per filter (L497–504).
- **Worked multichannel example** (L447–557): input 5×5×2, three 3×3×2 filters, bias b = {1, 0, 2}.
  - k0 and k1 outputs are correct cross-correlations (✓); the k2 output is wrong (error 2).
  - Per-channel partial results for k0: [[−3,−7,−1],[1,−4,3],[−1,1,−3]] + [[−3,3,6],[6,−1,−2],[−6,−1,−1]] + 1 → [[−5,−3,6],[8,−4,2],[−6,1,−3]] ✓.
  - Parameter contrast: an FC layer would need 50 × 27 = **1,350** weights vs **54** conv weights (L552–557) ✓.
- First-layer kernels learn orientations, textures and (for RGB) colours, "very similar to V1" (L633–641). Conv+pool layers learn a *new representation*; the FC layers are "the model" (L642–645, L820–829). End-to-end training (L1075–1079).
- Two conv layers without a ReLU collapse to one conv layer (L976–980): a good warn-box. Two stacked 3×3 kernels equal one 5×5.
- **Pooling** (L728–807).
  - 2×2 max with stride 2. Fig 12-7: an 8×8 input gives [[6,8,9,7],[7,9,9,3],[9,6,8,7],[8,7,9,9]] ✓, a ready practice item.
  - Pooling keeps depth and has 0 params.
  - 24×24×64 = 36,864 values → 12×12×64 = 9,216 (−75%), while conv2 has 3·3·32·64 = 18,432 weights (L776–782).
  - Hinton's Reddit quote ("big mistake … disaster", L798–802) is a good discussion box; it links to capsule networks.
- **FC dominates the params**: 9,216 × 128 + 128 = 1,179,776 of 1,199,882 total = **98.3%** (L830–837) ✓.
- **FC fixes the input size; FCN removes the limit** (L860–942).
  - Conv/pool layers are size-agnostic: 64×64 → 62×62×32.
  - A 32×32 input would need a 12,544×128 matrix (✓).
  - Replace Dense(128) by Conv 12×12×128 (same 1,179,648 weights ✓) and Dense(10) by Conv 1×1×10.
- t-SNE of the 128-d dense activations for 1,000 test digits shows 10 clean blobs (L1080–1106).
- A short-stemmed "4" is still classified with 0.999936 (L1063).

**Reusable points (ch13):**
- Keras baseline (Listing 13-2, L129–143): Conv(32,3×3) → Conv(64,3×3) → MaxPool 2×2 → Dropout .25 → Flatten → Dense 128 → Dropout .5 → Dense 10 softmax, with Adadelta. This is the classic Keras `mnist_cnn.py`.
  - Summary (L272–285): 320 / 18,496 / 0 / 0 / 0 / 1,179,776 / 0 / 1,290 ✓.
  - 12 epochs, batch 128 (469 steps/epoch, L88–93): **99.16%** test after 12 epochs; 97.94% val after epoch 1 (L287–301).
- **Dropout curves** (Figs 13-1/13-2, read from renders):
  - With dropout, training error starts at ≈8.5%, *above* the validation error of ≈2.1%; both are ≈0.85% by epoch 11.
  - Explanation (L373–401): dropout is active only in training, and Keras reports the training metric as an epoch average while validation is measured at the epoch end. Good warn-box material. Without dropout the curves differ (see error 7).
- **Table 13-1** (L459–472): 1,000 train samples, 9,000 test, single runs. Test accuracy / parameters:

  | exp | change | acc | params |
  |---|---|---|---|
  | 0 | baseline | 92.70% | 1,199,882 ✓ |
  | 1 | add Conv3 before pool | 94.30% | 2,076,554 (error 1) |
  | 2 | duplicate Conv2 + pool | 94.11% | 261,962 ✓ |
  | 3 | Conv1 5×5 | 93.56% | 1,011,978 ✓ |
  | 4 | Dense 1,024 | 92.76% | 9,467,274 ✓ |
  | 5 | halve filters 16/32 | 92.38% | 596,042 ✓ |
  | 6 | second Dense 128 | 91.90% | 1,216,394 ✓ |
  | 7 | Dense 32 | 91.43% | 314,090 ✓ |
  | 8 | **no pooling** | 90.68% | **4,738,826** ✓ (flatten 36,864) |
  | 9 | no ReLU after convs | 90.48% | 1,199,882 ✓ |
  | 10 | remove Conv2 | 89.39% | 693,962 ✓ |

  - Extras: Exp 2 + 5×5 first kernel → **94.23% with 188,746 params** ✓ (L515–520). Exp 10 + 5×5 → 92.39%, 592,074 ✓ (L580–588).
  - Exp 3 deltas: 832 vs 320 conv params, flatten 7,744 vs 9,216, dense 991,360, −187,904 total ✓ (L490–497).
  - Lessons:
    - Depth plus pooling is best.
    - Bigger dense layers don't help.
    - The first-layer kernel size matters; use 3×3 higher up (L509–514).
    - Pooling cuts params ~4× (L557–564).
  - The final model (Listing 13-5) on all 60k samples gives **99.51%** test (0.49% error), vs SOTA 0.21% per benchmarks.ai (L618–624).
- **Batch size** (Figs 13-3/13-4; 1,024 training samples, 5 runs).
  - Fixed 1,024 steps (epochs = batch size): 88.4% at bs = 1, 91.3% at 2, 93.7% at 4, then flat ≈94.5–95.0% from 8 to 1,024.
  - Fixed 12 epochs: ≈94.8–95.1% for bs ≤ 8; 93.9% at 64, 92.1% at 128, 90.3% at 256, 81.9% at 512, **72.2% at 1,024** (only 12 steps).
  - Training time at fixed steps grows ∝ batch size: "a few seconds vs ≈30 minutes" for bs 16 vs 1,024 (L707–737). The book recommends bs 16–128.
- **Optimizers** (Fig 13-5; 16,384 samples, 5 runs): Adadelta 98.57%, Adam 98.57%, Adagrad 98.52%, RMSprop 98.02%, SGD (lr .01, μ .9) 98.01%. Times ≈280 s (SGD) to 296 s (Adadelta).
- **FCN on big images** (L803–1354).
  - Train the base net 24 epochs, copy the weights with reshape to (12,12,64,128) and (1,1,128,10) (Listing 13-6). The FCN gives 99.25% on single digits (L1065).
  - Output size h = (H−28)/2 + 1: a 308×336 image → 141×155×10 heatmaps ✓ (L1161–1163).
  - Heatmaps are thresholded at 0.98. With centred-digit training they are noisy: many false 2s and 5s, because partial digits were never seen (L1251–1276).
  - Fix: **shift augmentation** (±¼ of the image, 4 shifted copies → 5× data, L1277–1312) makes the heatmaps clean (Fig 13-8). This is a perfect "augmentation = cover the deployment distribution" example (L1350–1354). The book says FCN heatmaps were superseded by YOLO boxes and U-Net (L1355–1365).
- **Scrambled pixels** (Fig 13-9, 6 runs): the CNN reaches ≈0.87% error on normal digits vs ≈2.05% on scrambled ones (epoch 12). The CNN does lose its spatial advantage, unlike the MLP in ch10. The CNN on scrambled digits still beats the MLP's 4.4% (L1387–1399, but see error 8).

**Reusable points (ch14):**
- CIFAR-10: 32×32 RGB, 10 classes (6 animals, 4 vehicles), 50,000 train (5,000/class) / 10,000 test (L1449–1476). The best unaugmented result is ≈1% error with a 557M-param model (L1459–1461).
- **"Deeper but fewer params"** (L1494–1509):
  - shallow 1,626,442 vs deep (5 convs, 2 dense) 1,139,338 ✓
  - because valid convs shrink the map: flatten 12,544 vs 7,744
- Table 14-1 (60 epochs, bs 64, 9,000 test): shallow 71.9% / deep 74.8% (Adadelta); 70.0% / 72.8% (SGD) (L1668–1674).
- **Animal vs vehicle** (12 epochs, shallow, L1807–1875): 93.6%. TP 5,841, FP 480, TN 3,520, FN 159.
  - Metrics: TPR .9735, TNR .8800, PPV .9241, NPV .9568, F1 .9481, MCC .8671, κ .8651, informedness .8535, markedness .8808 (all ✓).
  - Errors by fine class: airplanes 189 called animals, birds 64 called vehicles (L1970–1981). "Airplane ↔ bird" is a nice intuitive example.
- **One-vs-rest vs multiclass**: per-class 10×10 confusion matrices (L2126–2154); diagonal means 72.3% vs 71.5% ✓.
  - Deer: multiclass +10 points. Trucks: one-vs-rest +11 points; the multiclass model confuses trucks with cars (6.1%) and ships.
  - "Hard negatives" argument (L2181–2199).
- **Transfer learning (book's narrow sense = frozen feature extractor + classical model)**, L2202–2468.
  - MNIST is padded 28 → 32 and copied into 3 channels, then embedded by the CIFAR model's 128-d dense layer.
  - Results (embedding vs raw pixels from the book's Table 7-10): nearest centroid .6799 vs .8203; 3-NN .9010 vs .9705; RF(50) .8837 vs .9661; linear SVM .8983 vs .9181.
  - It failed because the domains differ (natural images vs digits). The t-SNE overlaps 3/5/8. A good honest "when transfer doesn't help" example.
- **Fine-tuning** (L2471–2853).
  - Pretrain the deep model on CIFAR vehicles: augmented, 200,000 images, 28×28 crops, 12 epochs, 88.2% test.
  - Then train on a **small cat/dog set** (1,000 train images, ≈50/50; 900 test; 36 epochs, Adadelta) with the softmax head replaced (128·2+2 = 258 new params ✓).
  - Untrained head: 50–51%.
  - Table 14-2 (6 runs, mean ± SE):

    | model | accuracy |
    |---|---|
    | shallow from scratch | 64.4 ± 0.4 |
    | deep from scratch | 61.1 ± 0.5 |
    | fine-tune, nothing frozen | 62.7 ± 3.7 |
    | freeze conv0 | 69.1 ± 0.9 |
    | freeze conv1 | 68.8 ± 0.7 |
    | **freeze conv0+conv1** | **70.1 ± 0.3** |
    | freeze all 5 convs | 57.0 ± 0.5 |

  - Lesson: freeze the low-level edge/texture layers and let the higher layers adapt (larger RF = larger, class-specific structures, L2822–2843).
  - Rules: lower the SGD learning rate ~10× when fine-tuning (L2648–2651). Transfer works best when the domains are similar (L2218–2225). Caveat: Raghu et al. "Transfusion" (medical images, small models from scratch are often as good, L2846–2853).
- Possible quiz contrast pair: "same network, pretrained on vehicles, which layers to freeze?" (Table 14-2 has a clear answer).

**History, as stated:**
- Neocognitron (Fukushima 1980) vs LeCun et al. 1998 "Gradient-Based Learning Applied to Document Recognition" (>21,000 citations) (L61–68).
- FCN: Long, Shelhamer & Darrell 2014 (L943–946); U-Net: Ronneberger et al. 2015, "go-to" for segmentation, especially medical (L947–950).
- YOLO named (L1359).

**Errors / dubious claims (PDL):**
1. **Table 13-1 row 1 (L463, L478–481): "Add Conv3, 3×3×64 before Pooling … 2,076,554 parameters (+876,672)".**
   - With 64 filters the model has **1,048,394** params (flatten 11·11·64 = 7,744), i.e. *fewer* than the baseline.
   - 2,076,554 is exactly what a **128-filter** Conv3 gives: flatten 15,488 → dense 1,982,592 (✓ `s11b_checks.py`).
   - So the label or the run is inconsistent, and the "depth costs parameters" lesson (L480–482) is an artefact. Adding a valid conv before pooling *reduces* params if the filter count is unchanged, just like Exp 3.
   - Related, L519: "achieved the performance of Experiment 10 using only 9 percent of the parameters" should say **Experiment 1**. 188,746/2,076,554 = 9.1% ✓; Exp 10 is the worst model, and the ratio there is 27%.
2. **k2 output of the multichannel example (L544, book p. 294) is wrong.**
   - Correct value: [[−4,1,−1],[2,2,−6],[6,−4,6]]. The book prints [[−5,0,−3],[0,0,−5],[7,−3,4]].
   - No flip, transpose, channel swap or bias variant reproduces it (`s11b_k2.py`). k0 and k1 are right.
   - Also L518: "∗ … the full convolution operation" is really *valid cross-correlation*.
3. **L42–50, "spatial invariance": CNNs "can detect cats anywhere".**
   - Convolution is translation *equivariant*. Invariance comes only partially, from pooling and the dense head, and the book's own FC head is position-specific.
   - Its later FCN experiment shows the trained CNN failing on shifted or partial digits until shift augmentation (L1270–1276), which contradicts the opening claim.
4. **L1115–1119: the FCN stride is 2 "because … 28×28 is mapped to 12×12 and ⌊28/12⌋ = 2".**
   - The effective stride is the product of layer strides: conv 1 · conv 1 · pool 2 = 2.
   - The 28 → 12 shrink also contains the −4 border loss. With a 32×32 base input (→ 14×14) the floor rule would give 2 by luck. For a net with two pools it would give the wrong answer (the stride is 4).
5. **Fig 13-3 caption vs text**: the text calls the fixed-steps markers "triangles"; the plot uses crosses. Minor.
6. **L683–685: receptive field defined as "the outputs from the layer immediately before"**, and "effective receptive field" defined as the region in the input.
   - Non-standard. The receptive field normally *is* the input region (5×5 for two 3×3 layers). "Effective receptive field" (Luo et al. 2016) means the smaller, Gaussian-shaped region that actually has influence.
   - Use the standard terms in the chapter.
7. **L388–392: "without dropout, final validation error ≈10% vs 1%".**
   - Fig 13-2 starts at 61% train / 48% validation error after epoch 0. Fig 13-1 (same model with dropout, full 60k) shows ≈2% validation after epoch 0.
   - That is not plausible for the same data. Fig 13-2 looks like a small-subset run (~1k samples, cf. the 92.7% baseline of Table 13-1).
   - The 10× dropout effect is a confounded comparison. Removing dropout from this Keras model on full MNIST typically costs only a few tenths of a percent.
8. **L1397–1398: "about 2 percent error versus 4.4 percent" for CNN vs MLP on scrambled digits.** Unequal setups: the ch10 MLP used 6,000 training samples, while the CNN used all 60,000. Not a like-for-like comparison.
9. **L1903 (with code L1892–1897): "The AUC is 0.9267".**
   - `roc_auc_score` is fed hard 0/1 predictions `p`, so the number is the balanced accuracy (TPR+TNR)/2 = 0.92675 ✓, not the ROC AUC.
   - The plotted ROC curve itself uses probabilities (`pp[:,1]`), so its area should be higher.
   - Also, the "test" metrics use all 10,000 test images (TP+FP+TN+FN = 10,000), including the 1,000 used for validation (L1805 vs L1854–1875). Typo L1858 "4,80" = 480.
10. **Listing 14-10 (L2282, L2288, L2302): `K.function([model.input, K.learning_phase()]) … func([t, 1.])`.**
    - learning_phase = 1 is *training mode*, so Dropout(0.25) before the dense layer is active while the embeddings are extracted.
    - The embeddings are therefore randomly corrupted. This may partly explain the poor transfer result; the correct call passes 0.
    - The `_ = model.predict(t)` call is also wasted work.
11. **L2203–2217 vs L2472–2478, terminology.**
    - "Transfer learning" is used only for frozen feature extraction + a classical model, with fine-tuning as "one step beyond".
    - Standard usage (also MLQ L18–28): transfer learning is the umbrella term; *feature extraction* (frozen) and *fine-tuning* are its two modes. The book says itself that transfer = fine-tuning with all weights frozen (L2646–2647).
12. **L681–683 / L731–733: "the general rule for CNNs is to use smaller batch sizes … literature uses 16–128 almost exclusively".** Dated (2020). Large-batch training with LR scaling and warm-up (Goyal et al. 2017: batch 8,192 on ImageNet) is standard. The fixed-epoch collapse in Fig 13-3 comes from too few steps, not from big batches as such.
13. **L1707–1710: Adadelta's slowly rising training loss is "likely an artifact of the adaptation algorithm".** Speculative. The validation curves are also chaotic (L1732–1739). Choosing Adadelta over SGD from single runs (Table 14-1) is thin evidence.
14. **L61–68, history.** LeCun's CNN with backprop dates from **1989** ("Backpropagation applied to handwritten zip code recognition"); LeNet-5 is from 1998. The 1980 vs 1998 framing skips the decisive 1989 work, which MLSYS cites (L1005).
15. **L784–785: "pooling … acts as a regularizer".** Loosely true (fewer downstream params), but it is not a regularizer in the L2/dropout sense.
16. Typos: L564 "Chapter Summary" (should be Chapter 13); L2561 "28 × 8" (28×28); L1462–1466 call MNIST "very clean" (fine).

---
## 2. MLQ (Raschka, ML and AI Beyond the Basics)

**Order of topics:**
- ch2:
  - transfer learning vs self-supervised learning; only the label source differs (L17–64)
  - pretext tasks: masked word, image inpainting (L53–64)
  - when SSL helps: large nets, few labels; not for small MLPs or trees (L67–85)
  - self-prediction: denoising / masked autoencoder (L86–108)
  - contrastive learning: cat / perturbed cat / elephant, siamese setup; sample- vs dimension-contrastive (L109–153)
- ch5: more data + learning curves (L209–228) → augmentation: brightness, flip, crop, Fig 5-2 (L230–249) → pretraining / transfer / few-shot (L251–266) → other methods: Mixup, Cutout, CutMix (L269–279) → exercise 5-2: augmentation hurt MNIST (L295–300).
- ch11: worked parameter count for a small CNN, Fig 11-1 (L333–432) → why it matters: data needs, GPU memory (L436–447) → exercises: SGD vs Adam state; BatchNorm params (L450–460).
- ch12: FC ≡ conv in exactly two cases (L467–490) → kernel = input size (L493–526) → 1×1 kernel with features as channels (L528–547) → recommendations: edge accelerators (L550–561).
- ch13, inductive biases:
  - CNN biases: local connectivity, weight sharing, hierarchy, "spatial invariance" (L575–626)
  - invariance vs equivariance, Figs 13-1/13-2 (L627–668)
  - MLP has location-specific weights, Fig 13-3 (L669–679)
  - ViT lacks these biases; relative position embeddings (L680–695)
  - ViTs beat CNNs only with ≥100M pretraining images (L698–721)
  - ViT biases: patchify; global, low-pass vs CNN high-pass (L724–755)
  - recommendations: EfficientNetV2; hybrid ConViT/CvT (L758–774)
  - exercises on patch size (L776–783)

**Reusable points:**
- **Parameter-count worked example** (ch11; Fig 11-1 render; all ✓):
  - Architecture: 3@32×32 → conv 5×5, 5 maps → 5@28×28 → max-pool k5 s2 → 5@12×12 → conv 3×3, 12 maps → 12@10×10 → avg-pool k3 s2 → 12@4×4 → flatten 192 → FC 128 → FC 10.
  - Step-by-step build-up (L360–395): 1 input channel, 5×5 kernel → 25+1 = 26 params; 3 input channels → 3·25+1 = 76; 5 output channels → 5·76 = 380.
  - Conv2: 12·(3·3·5)+12 = 552. FC: 192·128+128 = 24,704 and 128·10+10 = 1,290. **Total 26,926.**
  - Pooled sizes need the floor: (28−5)/2+1 = 12.5 → 12; (10−3)/2+1 = 4.5 → 4. This is the best ready-made practice item for the output-size formula with stride.
  - Rule of thumb: conv params = C_out·(k·k·C_in + 1), independent of image size; FC params = n_in·n_out + n_out (L357–359, L416–422).
- Exercise 11-1: SGD stores params (+ momentum), Adam 3× (params + 2 moments). Exercise 11-2: BatchNorm after conv1, conv2 and fc1 adds 2·(5+12+128) = **290** trainable params (plus 290 running statistics) ✓.
- **FC ≡ conv** (ch12): with kernel = input size there is no sliding and the conv is a dot product (L502–522). With 1×1 kernels on a 1×1 "image" with n channels it is also an FC layer. This is the same idea as PDL's FCN, from the other side.
- **Equivariance picture** (Fig 13-2, L661–668; ✓):
  - 3×3 input with a vertical pair of 1s at the left; 2×2 all-ones filter → [[2,0],[1,0]].
  - Move the pair to the right column → [[0,2],[0,1]].
  - Short and clear; reuse it with the definitions "invariance: output unchanged; equivariance: output shifts along" (L635–639).
- CNN inductive-bias list (L600–622) and "everything that must be learned needs more examples" (L587–592) motivate 11.7.
- ViT facts:
  - Dosovitskiy et al. 2020, "An Image Is Worth 16x16 Words".
  - ViT beats ResNet only after ≥100M pretraining images (L714–721).
  - Patchify (Fig 13-4).
  - ViTs: more uniform representations across layers, early global aggregation (Raghu et al. 2021, L737–742).
  - Attention ≈ low-pass (shape); conv ≈ high-pass (texture) (L743–755).
  - CNNs are not obsolete: EfficientNetV2; hybrids (ConViT, CvT) (L759–767).
- Contrastive learning intuition (ch2 L115–144): augmentations of the same image should get close embeddings, different images far ones. Augmentation is the core of SimCLR (Chen et al. 2020, L163–165). A good bridge between 11.5 and 11.6.

**History, as stated:** ViT 2020 (arXiv 2010.11929); relative positions: Shaw et al. 2018; Raghu et al. 2021 "Do ViTs See Like CNNs?"; EfficientNetV2 (Tan & Le 2021); ConViT, CvT 2021; SimCLR 2020; VICRegL 2022 (L786–810, L160–180).

**Errors / dubious claims (MLQ):**
1. **ch11 L340–342: "two fully connected hidden layers with 192 and 128 hidden units".**
   - Fig 11-1 and the count itself treat 192 as the *flattened input* (12·4·4), not a hidden layer. There is one hidden FC layer (128) plus the output layer.
   - L339–340 also lists the pools in the opposite order to the figure (k3 then k5 vs the figure's max k5 then avg k3). Both orders happen to give 4×4×12 = 192 (✓).
2. **ch12 L477–479: "a fully connected layer with two input and four output units".** The caption (L479) and the equations (L484–486) show **four inputs, two outputs**.
3. **ch12 L473–476: "exactly two scenarios … when the size of the convolutional filter is equal to the size of the receptive field".**
   - It should say "equal to the *input* size".
   - The 1×1 case is really the same case (the input is 1×1). More generally, a 1×1 conv on an H×W map equals the *same* FC layer applied at every pixel, which is the useful insight. "Exactly two" is overstated.
   - Caption L536–537 repeats the first case's text for the 1×1 figure.
4. **ch13 L617–622: "CNNs exhibit the mathematical property of spatial invariance, meaning the output remains consistent if the input is shifted".**
   - The book corrects this to equivariance at L632–639. But L645–648 then describes the commuting diagram ("same output regardless of order") as *translation invariance*: that is the definition of **equivariance**.
   - Also, in Fig 13-2 a 2-pixel input shift yields a 1-pixel output shift (valid conv on 3×3), so the picture shows detection, not exact equivariance.
   - Real CNNs are only approximately equivariant: stride and pooling break it (Azulay & Weiss 2019; Zhang 2019, "Making CNNs shift-invariant again").
5. **ch13 L689–695: "a common workaround for adding positional information in ViTs is relative positional embeddings".** The original ViT uses *learned absolute* 1D position embeddings. Relative/2D variants came later (Swin etc.). Oversimplified.
6. **ch13 L731–736: "patchify allows ViTs to scale to larger image sizes without increasing the number of parameters".** True for the weights, but the position embeddings must be interpolated, and attention cost grows quadratically with the patch count. A 2× resolution means 4× tokens and 16× attention FLOPs.
7. **Inconsistency, ch2 L74–76 vs ch13 L708–713.** ch2: transformers incl. ViTs "are known to require self-supervised learning for pretraining". ch13: ViTs "are often pretrained using large, labeled datasets … regular supervised learning". Original ViT: supervised on ImageNet-21k / JFT-300M. Also, ImageNet-1k (1.28M images) is *not* enough for plain ViT, and ch13 says "ImageNet … millions" without separating 1k from 21k.
8. **ch2 L80–85: "tree-based methods … not capable of transfer learning".** Contradicted by exercise 5-1 (L286–294; the XGBoost answer is to continue boosting on the new data). Minor here.
9. **ch5 L225–228: "the slope … suggests underfitting … more data can decrease both underfitting and overfitting".** Same issue as noted in ch10: more data reduces variance, not bias.

---
## 3. MLSYS (Reddi et al., Machine Learning Systems)

**Order of topics:**
- §3.7 USPS case study: challenge (L42–76) → design decisions: data, architecture, confidence thresholds (L78–114) → production pipeline: camera → thresholding / connected components / 28×28 normalization → network → per-digit confidence, "one uncertain digit sends the piece to a human" (L116–157) → outcomes, 10× human speed, human-in-the-loop (L160–198) → 1990s vs 2025 edge AI (L202–235).
- §4.2 MLP: UAT, "no prior structure" (L508–551) → 4-pixel worked example (L650–676) → MNIST 784×100 (L678–683) → loops, MAC (L711–787) → memory/compute/data movement (L788–857).
- §4.3 CNN:
  - definition: locality + "translation invariance" (L901–931)
  - cat ears anywhere; ImageNet footnote (L939–970)
  - Fig 4.2 pipeline (L974–1001); LeNet footnote (L990–1006)
  - layer equation (L1012–1033); parameter sharing / receptive field footnotes (L1008–1044)
  - MNIST 28×28×32 with padding (L1043–1053)
  - group theory, equivariance f(T_v x) = T_v f(x); inductive bias / hypothesis space; hierarchy (L1062–1110)
  - depthwise separable 8–9×, channel pruning (L1120–1128)
  - 7-loop Listing 4.4 (L1153–1262)
  - memory, compute, reuse for 224×224 (L1214–1317)
- §4.6 evolution: parameter sharing, ResNet skips, BatchNorm (L1454–1482) → Transformers as synthesis; ViT footnote (L1514–1598).
- §4.7 primitives: im2col, Fig 4.10 (L1640–1713) → sliding window, TPU systolic array (L1714–1725) → memory access (sequential/strided/random), Table 4.3 (L1763–1866) → AlexNet → GPT-3 footnote (L1947) → energy: 4.6 pJ/MAC vs 640 pJ DRAM; im2col vs direct (L2039–2071).
- §4.8 complexity Tables 4.6/4.7 (L2204–2381) → §4.9 inductive bias hierarchy CNN > RNN > MLP; Transformers "adaptive" (L2522–2585) → fallacies (L2593–2676).

**Reusable points:**
- **Why an MLP is not enough (11.1):**
  - 784×100 = 78,400 weights and 78,400 MACs per image for one MNIST hidden layer (L808–810, L828–831).
  - For 224×224: a 3×3 filter has 9 params per channel, while an MLP neuron needs 50,176 weights. That is a ≈5,575× reduction per neuron (footnote 9, L1012–1019) ✓.
  - "A cat is still a cat whether top-left or bottom-right" (L956–964).
- Receptive field footnote: "a neuron in layer 3 sees 7×7 with 3×3 filters" (L1035–1042) ✓ (1+2·3). Hierarchy: edges → shapes → objects → scenes (L943–945).
- Feature maps vs activations at 224×224 with 64 channels: 3,211,264 activation values (L1270–1272) ✓. Each weight is reused 50,176 times (L1313–1315) and each pixel participates in 9 windows (L1849–1850). This contrast "few weights, many activations, lots of compute" is CNN-specific and worth a box.
- **im2col** (Fig 4.10, L1669–1713): 2-channel 3×3 input (1–9, 10–18) and a 2×2×2 filter (1–8). Patches become rows [1 2 4 5 10 11 13 14], …; the GEMM gives [356, 392, 464, 500] = direct cross-correlation ✓. It trades memory (≈9× duplication for 3×3, stride 1) for BLAS speed. This could be a ★★★ box "convolution is a matrix multiplication".
- Equivariance formula f(T_v x) = T_v f(x) (L1078–1079). Group-equivariant CNNs for rotations (Cohen & Welling 2016, L1107–1110).
- Inductive bias as a reduced hypothesis space → better generalization from less data (L1085–1093, footnotes 13/14). Hierarchy of biases: CNN strongest, then RNN, MLP minimal, Transformer "adaptive" (L2527–2541). Links to MLQ ch13.
- Depthwise separable convs ≈8–9× fewer FLOPs (MobileNet). MobileNetV2 has 3.4M params at ≈72% top-1 vs ResNet-50's 25.6M at 76% (PDF p. 1088; ratio 7.5 ✓).
- **History / facts:**
  - LeCun 1989 LeNet, inspired by Hubel & Wiesel 1962 (L990–998); LeNet-5 read checks for banks (L1002–1006).
  - AlexNet 2012: 15.3% vs 25.8% top-5 (L952–956), 60M params, two GTX 580 GPUs (p. 1067).
  - ImageNet: Fei-Fei Li, 2007 onward; 14M images, ~20k categories, 1.2M for ILSVRC (p. 1066).
  - ResNet 2015: ILSVRC winner 3.57%, degradation problem, 152 layers (L1464–1473; p. 1067).
  - VGG-16 (2014): 138M params (p. 728) ✓.
  - ViT (2020/21): 224/16 → 196 tokens (L1543–1555) ✓.
  - ImageNet label errors (p. 405; but see error 9).
  - USPS: ~100K-param nets, 10 pieces/s, 50–100 W, vs 2025 mobile 1–10M params at 30 fps under 2 W (L220–224).
- Human-in-the-loop with confidence thresholds (L108–114, L145–150): a nice element for 11.8 (the social side / automation). Reject option: a single uncertain digit sends the piece to manual sorting.

**Errors / dubious claims (MLSYS):**
1. **L650–676, 4-pixel MLP example: the arithmetic is wrong.**
   - W h = (0.59, −0.09, 0.45), not (0.65, −0.17, 0.47); after ReLU (0.59, 0, 0.45) (✓ `s11b_checks.py`).
   - Notation error: "z = h⁽⁰⁾ᵀ W⁽¹⁾" with a 3×4 W is dimensionally impossible; it should be W h.
2. **§3.7 USPS case study is historically garbled** (L96–97, L133, L139–143, L89–93).
   - It describes a 784-100-100-10 MLP (89,610 params ✓ arithmetic) on 28×28 images. The real 1989–90 Bell Labs ZIP-code recognizer (LeCun et al. 1989) was a **CNN** on **16×16** normalized digits (~9,760 free params with weight sharing).
   - "This data collection effort later contributed to MNIST" is wrong: MNIST was built from NIST SD-3/SD-1 (Census Bureau employees and high-school students). The USPS set is a separate 16×16 dataset.
   - "Validated across demographic groups" (L105–107) and "by 2000, several facilities" are unsourced. The well-documented deployment is LeNet-5 check reading (NCR, late 1990s).
   - Treat the numbers as illustrative, not historical.
3. **L999–1006, LeNet-5 footnote: "achieved 99.2% accuracy on MNIST in 1998 (though this was the error rate on a subset, not full MNIST)".** Garbled. LeNet-5's reported test error was 0.95% (0.8% with distortions) on the full 10,000-image MNIST test set. MNIST itself dates from ~1994; footnote L554–556 says "created in 1998".
4. **"Translation invariance" as the CNN inductive bias** (L908–910, L924–926, footnote 10 L1021–1032, L1131–1132). Conv layers are translation *equivariant*; the book's own info box says so (L1064–1079). Exact only for stride 1, ignoring borders; strides and pooling break it.
5. **L1266–1269 and L1290–1292: "a conv layer with 64 filters of size 3×3 requires storing only 576 weight parameters (3×3×64)" for 224×224 ImageNet images.** That holds only for 1 input channel. For RGB it is 3·3·3·64 = 1,728 weights (+64 biases), and 1,728 MACs per output position across the 64 channels. In deeper layers (64 → 64) it is 36,864.
6. **Big-O tables are inconsistent.**
   - Table 4.3 (L1818): CNN parameters O(K×C); should be O(K²·C_in·C_out).
   - Table 4.7 (L2376): CNN FLOPs O(K²×H×W×C) drops one channel factor, contradicting Table 4.6 (L2216): O(H·W·k²·c_in·c_out).
   - Table 4.7: Transformer parameters O(N×d²), with N = sequence length; parameters do not depend on N.
7. **Hardware numbers.**
   - Footnote 4 (L783–784): "A100 achieves 312 trillion MACs/second". It is 312 TFLOPS dense FP16/BF16, i.e. 156 T MAC/s.
   - L1709–1710: "312 TFLOPS for mixed-precision (TF32), or 156 TFLOPS for FP32". Actually FP16/BF16 312, TF32 156, plain FP32 19.5 TFLOPS.
   - Footnote 30 (L1958–1972): "the TPU's 128 × 128 systolic array performs 65,536 MACs per cycle". 128² = 16,384; 65,536 = 256², which is TPU v1's array (✓ arithmetic). The text itself says 128×128 at L1721.
   - Footnote 31 (L1980–1990): "GPT-3 moves 1.75 TB of parameters per forward pass". 175B params is 0.35 TB (fp16) or 0.7 TB (fp32) ✓.
8. **im2col claims.**
   - "developed by Intel in the 1990s" (L1697) is unsupported. It is usually credited to Chellapilla, Puri & Simard 2006 and popularized by Caffe (2014).
   - L1700–1702: "each window becomes a column, kernels arranged as rows" vs Fig 4.10, where the windows are rows. Either layout works, but the text contradicts the figure.
   - L2058–2060: im2col "often doubling memory" vs footnote 27 (L1658–1661): "increasing memory usage 9×". Inconsistent.
9. **ImageNet facts (PDF pp. 405, 1066–1067).**
   - Fig 12.1 caption: "25.8% in 2010". 25.8% is the 2011 winner; the 2010 winner had ≈28.2%.
   - AlexNet is given as 15.3% (p. 1066) and 16.4% (p. 1067) in adjacent pages. 16.4% = 5-CNN ensemble without extra data; 15.3% = the winning 7-CNN entry with ImageNet-2011 pretraining.
   - "ResNet-152 achieved superhuman performance with 3.57%". 3.57% was an *ensemble*; single ResNet-152 ≈4.5% top-5 (val). "Superhuman" compares to one annotator's ≈5.1%; the claim is contested. Footnote 7 L961–964 attributes "superhuman" to the AlexNet-era "big data + compute" story.
   - ResNet "solved the vanishing gradient problem" (p. 1067) vs "degradation problem" (L1464–1473). The paper is about degradation; vanishing gradients were mostly handled by normalized init and BatchNorm.
   - p. 405: "ImageNet … label errors on 3.4% of the validation set". Northcutt et al. 2021 report ≈6% for the ImageNet validation set; ≈3.3% is the average over 10 datasets.
   - AlexNet's parameter count is stated as 60M, 62M and 62.3M in different places. Both are defensible: ungrouped 62.38M vs the original 2-GPU grouped 60.97M (✓).
10. **L1465–1473, footnote 23: ResNet "enabling training of 1000+ layer networks".** The 1,202-layer CIFAR net trained but was *worse* than the 110-layer one (overfitting). Fine as "trainable", misleading as "better".
11. **L1521–1522: Transformer "position embeddings inspired by CNN intuitions".** Dubious; sinusoidal position encodings have no CNN origin.
12. **Listing 4.4 (L1229–1246)** loops y over the full `height` with `in_y = y + ky` and no padding, so it indexes out of range unless the input is pre-padded. The text says "traverses all 28 × 28 positions" (L1190–1191) but elsewhere uses 26×26 windows for MNIST (L1715–1716).
13. **§4.9 L2538–2541: Transformers "dynamically adjust their inductive bias".** A loose metaphor. Attention weights are input-dependent, but the architectural bias is weak and fixed; see MLQ ch13 for the data-hunger consequence.

---
## 4. AAMLP (Thakur, Approaching (Almost) Any ML Problem, image chapter)

**Order of topics:**
- image = matrix 0–255; RGB = 3 matrices (L18–28) → flatten 256×256 → 65,536 features (L43–67)
- SIIM pneumothorax X-rays: 10,675 images, 2,379 positive → skewed → AUC + stratified 5-fold (L69–101)
- random forest on flattened 256×256 pixels → **AUC ≈ 0.72** (L103–234)
- AlexNet figure (227 not 224, L244–257)
- terms: filter, He/Kaiming init, convolution "= cross-correlation", stride, output-size formula, Fig 4 8×8/3×3/s2 (L264–301)
- padding, Fig 5 6×6 → 6×6 (L306–318); dilation (L319–331); max/avg pooling (L333–338)
- AlexNet in PyTorch, (BS, C, H, W) shapes (L351–456); 3D filters 11×11×3; torchvision's AlexNet variant is "one weird trick" 2014 (L459–469)
- pipeline: Dataset class, grayscale → RGB, resize, albumentations, CHW (L478–577) → engine.py train/eval (L579–677) → model.py with `pretrainedmodels`, new head (L679–722) → train.py, ImageNet mean/std normalization, batch 16 (L778–913)
- results (L913–1005): AlexNet from scratch AUC ≈0.66 → AlexNet pretrained ≈0.69 → **ResNet-18 pretrained, 512×512, step LR → ≈0.80**
- tuning tips (L1007–1014)
- ResNet: skips, vanishing gradient, variants 18–152, "start with resnet-18" (L1016–1068)
- segmentation = pixel-wise classification; U-Net encoder/decoder, transposed conv vs upsampling, skip/crop (L1072–1266)
- U-Net notes: original = unpadded, 572 → 388 (L1268–1278)
- pretrained ResNet encoder via segmentation_models.pytorch (L1279–1287)
- RLE masks; segmentation Dataset with joint image+mask augmentation: ShiftScaleRotate p = 0.8, then RandomGamma or brightness/contrast p = 0.5 (L1288–1452)
- training with Adam, ReduceLROnPlateau, apex mixed precision (L1460–1740)
- losses: pixel-wise BCE, focal, dice (L1742–1748)
- plant-pathology multi-class example with the author's wrapper (L1756–1955)

**Reusable points:**
- **Baseline ladder** for a realistic medical task (pneumothorax, AUC):
  - flattened pixels + RF ≈ 0.72
  - AlexNet from scratch ≈ 0.66
  - AlexNet ImageNet-pretrained ≈ 0.69
  - ResNet-18 pretrained (512 px) ≈ 0.80
  - A good "transfer learning actually helps on X-rays" counterpoint to PDL's failed MNIST transfer (but see error 6).
- Practical recipe:
  - use ImageNet mean/std (0.485, 0.456, 0.406) / (0.229, 0.224, 0.225) when using ImageNet weights, your own stats otherwise (L840–857)
  - replace `last_linear` with a new head (L704–721)
  - start small (resnet-18 before resnet-50) (L1045–1049)
  - Adam, low LR, reduce on plateau, augment, crop, change batch size (L1009–1014)
- Output-size example: 8×8, k3, s2 → ⌊(8−3)/2⌋+1 = 3 ✓ (L297–300). Padding 1 with k3, s1 keeps 6×6 (L314–318).
- AlexNet shape trace: 227 → 55 → 27 → 27 → 13 → 13 → 13 → 6; flatten 256·6·6 = 9,216 → 4096 → 4096 → 1000 (L425–443) ✓.
  - With 224, (224−11)/4+1 = 54.25 is not an integer, which explains the "227 not 224" note (✓).
  - Original AlexNet: 60.97M params (2-GPU grouping), 62.38M ungrouped; the FC layers hold ≈94% (✓). Pair with PDL's 98.3%.
- A conv filter is really k×k×C_in (11×11×3 on RGB) (L459–464).
- Segmentation as "a class for every pixel" (L1092–1094). U-Net = encoder (any convnet, can be pretrained ResNet) + decoder with learned up-convolutions + skip connections (L1099–1106, L1279–1285). The original U-Net is unpadded, so 572×572 in → 388×388 out ✓; skip maps 568/280/136/64 are center-cropped (L1140–1160).
- Augmentation must be applied to image and mask *jointly* (L1366–1373).

**History, as stated:** AlexNet (Krizhevsky, Sutskever & Hinton, NIPS 2012); ResNet (He, Zhang, Ren, Sun 2015); U-Net (Ronneberger, Fischer, Brox); torchvision's AlexNet follows Krizhevsky 2014 "One weird trick" (L468–469).

**Errors / dubious claims (AAMLP):**
1. **AlexNet code (L364–456) has only 4 conv layers** (conv1–conv4, with conv4 384 → 256), although the text says "five convolution layers" (L256–257). The original has conv3 256 → 384, conv4 384 → 384, conv5 384 → 256. The shown model has 61.05M params vs the original's 60.97M (grouped) / 62.38M (✓).
2. **L443: `x = F.relu(self.fc3(x))` before softmax.** A ReLU on the logits is a bug: negative class scores are clipped to 0 and their probabilities tie. Also, `torch.softmax` inside `forward` is wrong for `CrossEntropyLoss` training. The comment "0.3 dropout …" (L439–440) does not match `Dropout(0.5)`.
3. **L337–338: "Max pooling detects edges and average pooling smoothens the image".** Max pooling does not detect edges (the conv filters do); it keeps the strongest response in each window. Average pooling is a box-filter downsampler: smoothing is correct.
4. **L283–286: "Convolution is nothing but … (cross-correlation) … read more about convolution in any high school mathematics textbook".** The parenthetical is the honest part. Mathematical convolution flips the kernel, and it is not high-school material. Use this as the hook for the "convolution vs cross-correlation" `box tip`.
5. **L326–328, dilation: "we expand the filter by N−1".** Vague. The effective size is k + (k−1)(d−1); e.g. 3×3 with d = 2 covers 5×5. "Particularly effective in segmentation" is fine (DeepLab).
6. **L952: "The AUC is much better now" (pretrained AlexNet).**
   - The final epoch reads 0.686 vs 0.664, while the per-epoch AUCs swing between 0.47 and 0.68 in both runs (L918–948). That is within noise, and still below the RF's 0.72.
   - The ResNet-18 run changes three things at once (model, 256 → 512 px, step LR, L990–992), so the gain cannot be attributed to the architecture alone.
   - These are single train/validation splits, despite the stated 5-fold scheme.
7. **L1022–1031: skip connections "help with the vanishing gradient issue".** Partly. He et al. motivate ResNets by the *degradation* problem: deeper plain nets have higher *training* error even with BatchNorm. L1024–1031 describes this ("training loss increases"), so name it.
8. **L1268–1272: "the original implementation of the U-Net paper … bilinear upsampling is not the real implementation".** Fine. But the dataset's two-channel output (L1219) vs `classes=1` in the later segmentation_models code (L1627) is not explained. The chapter also never defines Dice/IoU, although Kaggle SIIM scored with Dice.
9. **L97–101, metric choice: 2,379/10,675 = 22% positives is called "classic skewed binary classification".** That is a modest imbalance. AUC is a reasonable choice, but "skewed" is overstated.

---
## 5. Cross-source suggestions for the chapter

- **11.1:**
  - MLSYS 784 × 100 = 78,400 weights.
  - The PDL / MLSYS "cat anywhere" argument.
  - PDL ch10 + ch13: scrambled pixels do not hurt an MLP but do hurt a CNN (0.87% vs 2.05%). This proves that the CNN uses neighbourhoods.
  - AAMLP: a 256×256 image flattened = 65,536 features.
- **11.2:**
  - PDL Fig 12-1 numbers (59, −212, −213 padded) for hand computation; the small multichannel example (k0/k1 only, or with corrected k2).
  - AAMLP stride/padding examples (8×8 k3 s2 → 3; 6×6 p1 → 6).
  - Add the general formula (Kiegészítés) and the convolution vs cross-correlation tip.
- **11.3:**
  - MLQ 26,926 worked count (with pooling floors).
  - PDL 98.3%-in-FC and the "remove pooling → 4.7M params" pair (good `two-col` contrast).
  - Receptive field 3 → 5 → 7.
  - PDL Fig 12-7 max-pool practice.
  - The ReLU-between-convs warn-box.
- **11.4:**
  - LeNet-5 = 60,000 trainable params (✓, with C3 partial connectivity).
  - AlexNet ≈61M (94% FC); VGG-16 138.4M (89% FC) ✓.
  - ResNet-18/34/50/152 = 11.7 / 21.8 / 25.6 / 60.2M ✓.
  - ILSVRC error ladder (Kiegészítés).
- **11.5:**
  - PDL Table 14-2 freezing experiment, plus the failed MNIST-on-CIFAR transfer (domain mismatch; note error 10).
  - AAMLP pneumothorax ladder.
  - MLQ "transfer vs self-supervised: only the label source differs".
  - Lower LR ×0.1 when fine-tuning.
- **11.6:**
  - PDL FCN heatmaps → YOLO / U-Net.
  - PDL shift augmentation fixing the heatmaps.
  - AAMLP U-Net 572 → 388 and joint image/mask augmentation.
  - MLQ ch5 flip/crop/brightness and the 6↔9 caveat (exercise 5-2).
  - Dice/IoU must come from elsewhere.
- **11.7:**
  - MLQ ch13 (biases, equivariance figure, ≥100M images).
  - MLSYS ViT 196 tokens; ViT-B/16 ≈86.6M params (✓ computed: d = 768, 12 layers).
  - Patch-size exercise (smaller patches → more tokens → quadratic cost).
- **11.8:** none of these sources helps beyond MLSYS's human-in-the-loop thresholds; use the Machine Vision book.
