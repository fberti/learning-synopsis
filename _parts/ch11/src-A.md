# Ch11 source digest A — DLV (Glassner, Deep Learning: A Visual Approach) + HAW (Kneusel, How AI Works) + MV (Rettberg, Machine Vision)

Extracts are in `_parts/src/`. `L123` = line number in the named file (original `pdftotext -layout` numbering).
- `DLV11_ch16.txt` = DLV ch16, "Convolutional Neural Networks" (book p429–472 = pdf 459–502)
- `DLV11_ch17.txt` = DLV ch17, "Convnets in Practice" (p473–494 = pdf 503–524): MNIST net, VGG16, filter visualization, adversaries
- `DLV11_ch23style.txt` = DLV ch23, deep dreaming tail + neural style transfer (pdf 708–720)
- `DLV11_extra.txt` = DLV p542 (transfer learning vs fine-tuning, inside the RNN chapter) + p582–583 (skip connections, inside the transformer chapter)
- `HAW11_ch5.txt` = HAW ch5, "Convolutional Neural Networks: AI Learns to See" (pdf 130–152). CNN history is in the existing `HAW_ch2.txt`.
- HAW figures are images. Renders: `src/img/haw11-136-136.png` (Fig 5-3 numbers), `haw11-139-139.png` (Fig 5-5 pooling + LeNet layer list), `haw11-140-140.png`
- `MV11_ch1_5.txt` = MV Introduction + ch1–5 + Conclusion (book p1–161 = pdf 11–171); `MV11_notes_refs.txt` = endnotes + references
- Checks: `_parts/calc/s11a_verify.py` (`uv run -q --with numpy python -I`)

**Convolution vs cross-correlation, and the output-size formula — summary:**
- **DLV:** calls it convolution (ch16 L171–176, citing Oppenheim & Nawab). It computes **cross-correlation**: the filter is "centered over the pixel" and each value is multiplied by "its corresponding weight" (L216–219, L251–254). The kernel is never flipped, and there is no mention of flipping or of cross-correlation.
- **HAW:** same (ch5 L175–184). It says convolution "has a formal definition involving integral calculus", then describes plain sliding multiply-and-sum. Fig 5-3 is a cross-correlation: the Sobel kernel unflipped gives 48. With a true (flipped) convolution it would be −48 (verified).
- **No output-size formula in either source.** DLV only gives worked cases:
  - 7×7 with 3×3 → 5×5 (L284–293)
  - 10×10 with 5×5 → 6×6 (L495–497)
  - padding "just enough so the filter can be centered on every element" (L519–525)
  - stride 2 halves the size (L1014–1019)
  - 9×6 block, 3×3 filter, stride 3 → 3×2 (L1059–1063)
  - MNIST net 28 → 26 → 24 → 12 (ch17 L70–89)

  HAW gives only 8×8 → 4×4 pooling (L272–274). The chapter must supply ⌊(n + 2p − k)/s⌋ + 1 (Kiegészítés).

**Not covered by these sources** (mark as "Kiegészítés"):
- The **output-size formula** ⌊(n+2p−k)/s⌋+1, and "same" padding p = (k−1)/2.
- **Kernel flip**: the convolution vs cross-correlation distinction (a `box tip`: "the DL libraries actually compute cross-correlation").
- **Bias in a conv filter**, and the **parameter count of a conv layer**, (k·k·C_in + 1)·C_out. Neither source counts conv parameters. HAW counts *kernels* (2,022) and gives two total counts with no breakdown. Use the DLV MNIST net / VGG16 counts computed below.
- **Why an MLP fails on images, with numbers.** E.g. 224×224×3 = 150,528 inputs × 1,000 neurons ≈ 150 M weights in the first layer. HAW's scrambled-MNIST experiment is the qualitative version.
- **Translation equivariance vs invariance.** Both sources say "shift invariant"; the precise statement is: conv = equivariant, pooling/global pooling ⇒ (approximate) invariance.
- **Receptive-field formula**, r_out = r_in + (k−1)·j, and the "two 3×3 = one 5×5, fewer parameters" argument of VGG.
- **AlexNet details:**
  - 8 weight layers, ~60 M params
  - ReLU, dropout, GPUs, data augmentation
  - 15.3 % vs 26.2 % top-5 error
- **ResNet:** 152 layers, 3.57 % top-5 in 2015, ILSVRC winner. Skip connections appear only in the DLV transformer chapter, as a generic idea.
- GoogLeNet/Inception, which is the 2014 classification winner (VGG was runner-up).
- **Global average pooling**, **batchnorm in CNNs**.
- Transfer learning **in a CNN context**: freeze the backbone, new head, fine-tune with a small LR. DLV gives only one paragraph, in the RNN chapter.
- **Task types in detail:** classification vs localization vs detection (bounding box + class, IoU, NMS) vs semantic/instance segmentation. HAW L553–566 only names U-Net, YOLO and Faster R-CNN.
- **Data augmentation for images**: flip, crop, color jitter. It is in DLV ch10 (see ch10 digest, `DLV10_extra.txt`), but not in the CNN chapters.
- **Vision Transformer**: patches (16×16), patch embedding, [CLS], position embeddings, needs large data. Absent from all three sources.
- Top-1 vs top-5 error (HAW mixes them up; see Errors).
- Modern context, 2020+: ConvNeXt, CLIP, self-supervised pretraining, foundation models (SAM). MV touches on CLIP/DALL-E only socially, if at all; see the MV section.

---
## 1. DLV (Glassner) ch16 — Convolutional Neural Networks

**Order of topics:**
- intro, applications (L21–33)
- image = 3D tensor H×W×C; pixel vs "element" (L36–61)
- CNN / convnet naming joke, "CNN network" (L67–70)
- **yellow detector** = 1×1 neuron sweeping the image (L72–176)
- weight sharing (L178–204)
- **3×3 filters: blur, horizontal edge, vertical edge** (L206–233)
- local receptive field / footprint, anchor (L255–283)
- 7×7 → 5×5 without padding (L284–302)
- Filters and features:
  - biology: toad cells; Jennifer Aniston neuron (L305–330)
  - feature detector / feature map (L331–344)
  - **binary stripe-matching example** (L345–410)
  - patterns of patterns; learned instead of hand-engineered (L411–452)
- padding / zero-padding (L454–525)
- multichannel filters: 3×3×3 = 27 values (L528–575)
- multiple filters → output channels (L578–625)
- conv layer, init: He, Glorot (L628–656)
- 1D convolution (L658–691)
- 1×1 convolution, 300 → 175 channels (L693–771)
- **pooling**: motivation via a misprinted T and a "blurry filter" (L783–862); **numeric 4×4 avg/max pool** (L863–925)
- multichannel pooling, 6×6×1 → 6×6×3 → 3×3×3 (L926–970)
- **striding** (L972–1080)
- upsampling / transposed convolution (L1084–1199)
- **hierarchy: face-mask all-convolutional network**, 12×12 input (L1205–1670)
- summary (L1676–1708)

**Reusable points:**
- **Tensor vocabulary** (L37–54):
  - images are H×W×C
  - "channels" rather than "depth", because depth also means the number of layers
  - with 14 or 512 channels it is no longer an "image", so say "element", not pixel
  - Good `box tip` for 11.1.
- **Yellow detector = the simplest filter** (L72–176). Weights (+1, +1, −1) on (R, G, B), applied to every pixel → one-channel map. Smooth bridge from "neuron" (ch9) to "filter".
  - Terms introduced: filter, kernel, convolution filter, "sweeping/scanning", "convolve the image with the filter".
  - The numbers do not work as stated; see Errors.
- **Weight sharing** (L178–204): one weight set in shared memory, applied everywhere. Saves memory, easy to change.
  - Good hook for the "MLP vs CNN parameter count" argument, which the chapter must supply.
- **Classic 3×3 kernels** (Fig 16-7, L224–226):
  - blur = all 1s (unnormalized)
  - horizontal edge = [1 1 1; 0 0 0; −1 −1 −1]
  - vertical edge = [−1 0 1; −1 0 1; −1 0 1]

  These are Prewitt-style; recreate as a widget (choose kernel → see output on a small image).
- **Footprint / local receptive field / anchor** (L255–270). Odd sizes 1–9 so the anchor sits in the center (L278–283).
- **Pattern matching by hand** (Fig 16-12, L355–397). Ideal for a by-hand exercise:
  - vertical-stripe filter, rows [−1 1 −1] ×3, on binary patches
  - patch [[1,1,0],[0,0,0],[1,0,1]] → −3+1 = −2; patch with a white center column → 3 = perfect match
  - range over binary inputs is −6…+3 (verified)
  - Rule: "the output is large where the image looks like the filter".
- **Feature map** = "pixel by pixel, how well the image around that pixel matched what the filter was looking for" (L341–344).
- **"CNN = expert system without hand-made features"** (L428–452): training finds the kernels. Good link back to feature engineering.
- **Padding** (L461–525):
  - 5×5 filter on 10×10 without padding → 6×6 (verified)
  - "lousy solution, we lose a ring every layer" (L490–492)
  - zero-padding; libraries compute the "same" padding automatically (L523–525)
- **Channel rules**, worth highlighting as rules of thumb (L572–575, L622–625):
  1. every filter has as many channels as its input
  2. the output has as many channels as there are filters

  Example: input with 7 channels, 4 filters of 3×3×7 → 4 output channels (L609–617).
- **1×1 convolution** (L693–771):
  - compresses channels: 175 filters of 1×1×300 turn 300 channels into 175
  - "12 kinds of eye → 1 eye channel" intuition
  - Lin et al. 2014 (Network in Network)
  - warning: 1×1 conv ≠ 1D conv (L768–771)
- **Pooling, numeric example** (Fig 16-27, L869–907), verified:

  ```
  [[3, 2,-3, 2],
   [1, 6,20, 5],
   [4,-13,2, 6],
   [-2,3, 9, 3]]
  ```

  - 2×2 average pooling → [[3, 6], [−2, 5]]; max pooling → [[6, 20], [4, 9]]
  - Nice follow-up (L908–925): a layer-2 filter wants "a strong value above about half of it". Nothing in the raw map fits (20 sits over 2), but after max pooling 20 sits over 9 → match. "Pooling tolerates small shifts."
- **Misprinted T** (Fig 16-24 … 16-26): "blurry filter" vs "blurry input" motivates pooling. Intuitive, but max pooling is not blurring; see Errors.
- **Multichannel pooling** (L929–935): pooling acts per channel and keeps C. 6×6×1 (padded) → conv with 3 filters → 6×6×3 → max pool → 3×3×3.
- **Stride** (L989–1080):
  - stride 2 ≈ conv + 2×2 pool in output size
  - stride 3 with 3×3 → no overlap; 9×6 → 3×2 with 6 evaluations (verified)
  - strided conv is faster
  - the learned filters differ, so the two cannot be swapped without retraining (L1071–1076)
  - Fig 16-29 shows different horizontal (3) and vertical (2) strides
- **Upsampling / transposed conv** (L1089–1199), ★★★ or skip:
  - 3×3 + 2 zero rings → 7×7 → 3×3 filter → 5×5
  - zeros inserted between elements: 9×9 → 7×7; two zeros between: 11×11 → 9×9 (all verified)
  - checkerboard artifacts (Odena et al. 2018)
  - Useful only as a pointer for segmentation (U-Net) in 11.6.
- **Hierarchy demo: face-mask network** (L1205–1670). Best "feature hierarchy" figure to recreate (simplified):
  - Layer 1: 2×2 filters T, Q, L, R (pixel patterns) → Layer 2: 2×2×4 filters E, N, M (eye, nose, mouth) → Layer 3: 3×3×3 filters F, P (frontal face, profile)
  - shapes 12 → 11 (2×2 conv) → 6 (2×2 max pool, partial blocks kept) → 5 → 3 → 1×1×2 (verified; Fig 16-50)
  - the pooling makes it accept a candidate whose left eye moved down by 1 pixel (L1278–1291, L1567–1572)
  - Receptive-field sentence (L1658–1663): "the eye filter E is only 2×2 but processes a 4×4 region". Final-layer RF = 15 ≥ 12, i.e. the whole image (computed).
  - "Hierarchy of scales" (L1664–1670).
- Biology analogies (L305–330, L1206–1218): toad prey-detector cells (Ewert 1985); the "Jennifer Aniston neuron" (Quiroga 2005: 87 images; the neuron fired only for Aniston alone). The book itself flags these as inspiration, not neuroscience (L327–330).

## 2. DLV ch17 — Convnets in Practice

**Order of topics:**
- **MNIST convnet** (Keras example) (L17–164)
- **VGG16** architecture (L170–336)
- **Visualizing filters 1**: gradient ascent on the input (L339–486)
- **Visualizing filters 2**: feature maps of a drake photo (L490–591)
- **Adversaries** (L594–666)
- summary (L669–683)

**Reusable points:**
- **MNIST net** (Fig 17-1, L56–164). A perfect worked "shape and parameter walk-through".
  - Architecture: 28×28×1 → Conv 32×(3×3) ReLU → 26×26×32 → Conv 64×(3×3×32) ReLU → 24×24×64 → MaxPool 2×2 → 12×12×64 → Dropout 0.25 → Flatten 9,216 → Dense 128 ReLU → Dropout 0.25 → Dense 10 softmax.
  - 12 epochs, ~99 % train and validation accuracy (L137–150).
  - **My parameter count (verified):**

    | Layer | Parameters |
    |---|---|
    | conv1 | 320 |
    | conv2 | 18,496 |
    | dense 128 | 1,179,776 |
    | dense 10 | 1,290 |
    | **total** | **1,199,882** |

    98.3 % of the parameters sit in the first dense layer. Good "where do the parameters live?" exercise.
  - MNIST facts (L19–23): 28×28 grayscale, census takers + students; the digit sits in a ~4-px border (L66–69).
- **Flatten** explained (L106–118, Fig 17-2): "none of the values are lost".
- **VGG16** (L170–336). Facts:
  - ILSVRC 2014; 1.2 M images, 1,000 labels; ImageNet (Russakovsky 2015)
  - VGG = Visual Geometry Group (Oxford); "16" = 16 weight layers (L186–189)
  - 224×224 input, per-channel mean subtraction (L203–209)
  - only 3×3 convs with "same" padding, ReLU, 2×2 max pool; filters double 64 → 128 → 256 → 512 → 512
  - conv-layer pattern 2-2-3-3-3; FC 4096-4096-1000, dropout 0.5
  - weights released, every library offers it (L190–198)
- **VGG16 numbers (verified):**
  - pooled outputs: 112×112×64 → 56×56×128 → 28×28×256 → 14×14×512 → **7×7×512**
  - params: **138,357,544** total; conv 14.7 M; FC 123.6 M (89 %); the first FC alone is 102.8 M (7·7·512·4096 + 4096)
  - receptive field of the last pool unit = 212 px
  - VGG's own argument (not in DLV, Kiegészítés): two 3×3 (RF 5) use 18C² weights vs 25C² for one 5×5; three 3×3 use 27C² vs 49C² for one 7×7
- **Seattle photos** (Fig 17-11, L323–334): VGG labels unseen phone photos well. Good intro image for 11.5 (pretrained models).
- **Visualization 1** (L351–486). Freeze the weights, start from noise, use gradient *ascent* on the pixels to maximize the sum of one filter's feature map. Results:
  - block1_conv2 → oriented edges (L425–426)
  - block3_conv1 → textures (L438–439)
  - block4_conv1 → "flowing, interlocking textures" (L451–459)

  The figures are the canonical "feature hierarchy" picture (edges → textures → object parts).
- **Visualization 2** (L490–591): feature maps for a drake photo.
  - block1_conv1 filter 0 = an edge detector, light-above-dark (L521–525)
  - some filters respond to orange feet and blue waves
  - block3 still finds edges (L570–573); block5 maps are tiny, "duck hardly visible" (L584–589)
  - Spatial sizes shrink 4× after two pools (L557–559).
- **Adversarial examples** (L594–666):
  - tiger: VGG16 says tiger at ~80 % (L615–618); the perturbation lies in [−2, 2] on a 0–255 scale (≤ 0.78 % per pixel, computed)
  - after the attack the top-5 contains no animal except a low-probability "brain coral" (L629–639)
  - universal perturbations (Moosavi-Dezfooli 2016); targeted vs untargeted attacks (L649–652)
  - "convnets may be inherently vulnerable" (Gilmer 2018)
  - Good for 11.8 (robustness/safety) or a ★ box.
- **Style transfer** (ch23, `DLV11_ch23style.txt`). Optional ★★★ / fun box:
  - Gatys, Ecker & Bethge 2015 (L99)
  - style = Gram matrices of the filter maps in each layer (L97–122)
  - content loss = difference of feature maps from the base image (L212–219)
  - start from noise, optimize the pixels with frozen VGG16 weights (L220–235, L284ff)
  - 9 style references: Starry Night, The Scream, Kandinsky …
  - Deep dream = "inceptionism" (Mordvintsev, Olah & Tyka 2015, L43). Images ~1,000 px vs training at 224 px (L30–36).
- **Transfer learning** (`DLV11_extra.txt` L14–37):
  - Example: "general-purpose classifier → leaf shapes / tree species" (L15–18).
  - Mechanics: freeze the existing network, add a few new layers at the end, train only those.
  - DLV's terminology: fine-tuning = modify all weights. It presents this as distinct from transfer learning; see Errors.
  - Downstream network = a frozen model feeding a new model.
- **Skip connections** (`DLV11_extra.txt` L109–161): He et al. 2015. **Painting analogy**: repaint only the ring, not the whole portrait (L113–122). Good intuition for ResNet in 11.4: "the layer learns only the change". Improves gradient flow; trains "dozens or even hundreds of layers" (L130–133).

## 3. HAW (Kneusel) ch5 + CNN history from ch2

**Order of topics (HAW11_ch5.txt):**
- CNN = end-to-end representation learning (L8–22)
- 1D/2D/3D CNNs (L23–31)
- **scrambled-MNIST experiment** (L32–95)
- van Gogh's bedroom; human visual system: V1 = edges, orientation, color; V1→V5 hierarchy (L97–173)
- **convolution with numbers** (Fig 5-3) (L175–207)
- blur / horizontal / vertical edge filters on "Gold Hill" (Fig 5-4) (L208–238)
- dense vs conv vs pooling layers (L245–280)
- **LeNet** layer list and kernel count (L281–315)
- LeNet on MNIST: feature maps and the 84-dim "barcode" embedding (Fig 5-6, 5-7) (L321–375)
- **receptive field** (Fig 5-8) (L376–403)
- **CIFAR-10 experiment**: RF vs MLP vs CNN (L405–532)
- author's 2015 airplanes-in-satellite-images anecdote (L533–544)
- architecture zoo: ResNet, DenseNet, Inception, MobileNet, U-Net; segmentation, bounding boxes, YOLO, Faster R-CNN (L546–566)
- audio → spectrogram → 2D CNN (L567–590)
- AutoML (L592–626)
- toolkits + autodiff, dual numbers (Clifford 1873) (L628–673)
- summary + key terms (L675–712)

**Reusable points:**
- **Scrambled-MNIST experiment** (L55–90): the best "why not an MLP?" hook for 11.1.
  - A fixed pixel permutation makes the digits unreadable to humans; the MLP learns *equally well*; the CNN gets much worse.
  - Lesson: an MLP ignores spatial structure; a CNN exploits locality.
  - Widget idea: show a digit and its scrambled version.
- **By-hand convolution, real numbers** (Fig 5-3, render haw11-136). Directly reusable, verified:
  - 8×8 grayscale patch of the "Gold Hill" image; Sobel kernel [[−1,−2,−1],[0,0,0],[1,2,1]]
  - window [[60,60,68],[44,60,60],[68,76,76]] → products [[−60,−120,−68],[0,0,0],[68,152,76]] → sum **48**; "the center pixel 60 → 48"
  - full 6×6 map computed in `s11a_verify.py`
  - The text says rotating the kernel 90° gives vertical edges and all-1s gives blur; the edge images are shown inverted (L219–225).
- **Pooling with numbers** (Fig 5-5, render haw11-139). The same 8×8 grid with 2×2 max pooling → 4×4. Verified (row-wise): [[68,68,68,76],[76,76,68,60],[92,84,76,60],[68,76,84,84]]. Note: the figure draws the blocks column by column.
- **"Filter = stack of kernels, one per input channel"** (L296–308, render haw11-140). A good terminology box (DLV uses filter = whole 3D weight block; same idea):
  - kernel counts: 6 + 16·6 + 120·16 = **2,022 kernels** (verified)
- **LeNet as given** (render haw11-139): Input → Conv(6) ReLU → Pool → Conv(16) ReLU → Pool → Conv(120) ReLU → Dense(84) ReLU → Output. This is a *modernized* LeNet-5; see Errors.
- **The 84-dim "barcode"** (Fig 5-6/5-7, L333–375): 784 pixels → 84 numbers that look similar within a digit class. A nice "embedding / representation learning" visual. "The true classifier is the dense layer at the top" (L370–375).
- **Receptive field** (Fig 5-8, L386–403): two 3×3 layers → a 5×5 input region. Recreate as a figure; generalize with the RF formula (Kiegészítés).
- **CIFAR-10 head-to-head** (L411–527). An excellent table for 11.1 or 11.3:
  - data: grayscale, 32×32 → 1,024-dim vectors for RF/MLP; 50,000 train (5,000/class), 10,000 test (1,000/class)
  - models: RF with 300 trees; MLP 1024-512-100-10; CNN with 4 conv, 2 pool, dense 472
  - **same number of parameters**: CNN **577,014** vs MLP **577,110** (MLP verified)
  - training: 100 epochs, minibatch 200 → 250 steps/epoch → 25,000 updates (verified); each model trained 10× and averaged
  - **test error: RF 58 %, MLP min ≈ 56 % at ~40 epochs (then overfits), CNN ≈ 23 %** (train ≈ 11 %); chance = 90 %
  - Message: "same parameter budget, structure wins".
- **Task types** (L553–566): classification vs semantic segmentation (U-Net, every pixel labeled) vs bounding boxes (YOLO, Faster R-CNN). Good seed for the 11.6 decision table.
- **Spectrogram** (L567–590): "any data with 2D structure is an image". A crying-baby spectrogram. Good "beyond photos" box.
- **Brain analogy** (L132–154): V1 detects edges, orientation and color; the hierarchy builds larger groupings → CNN layers. HAW: "CNNs mimic this process".
- **History** (`HAW_ch2.txt`):
  - Mark I Perceptron: 20×20 image input, designed for image recognition (L222–235)
  - Uhr & Vossler 1963: a 20×20 binary-image program that generated its own features, "similar to CNNs" (L256–262)
  - Fukushima's **Neocognitron**: 1979, English 1980, "unaffected by shift in position" (L292–301)
  - **LeCun, Bottou, Bengio, Haffner 1998**, "Gradient-Based Learning Applied to Document Recognition": CNNs + MNIST (L427–438)
  - **AlexNet 2012** won ImageNet with "just over 15 percent" error, "far lower than any competitor"; 1,000 classes incl. ~120 dog breeds (L484–495)
  - **by 2017 ~3 %**, below the ~5 % human error (L498–502)
  - GPUs, A100 = 312 TFLOPS (L740–772); ReLU, dropout 2012 (L840–850)

---
## 4. MV (Rettberg, Machine Vision, 2023) — Intro, ch1–5, Conclusion

Usability: **[U]** usable directly in a short intro-level section · **[C]** needs a caveat or context. **The book never mentions convolution or CNNs**. Its technical passages are minimal and partly wrong (see Errors). Use it for the social framing, the concepts and the cases.

**Order of topics:**
- **Intro:**
  - Argus myth; "seeing more / differently / everything" and the blind spots (L8–39)
  - definition (L83–98)
  - AI history: perceptron, ImageNet/WordNet, ImageNet Roulette (L142–182); foundation models, CLIP (L190–259)
  - Haraway's "god trick" (L282–320); assemblage (L350–390)
  - representational vs operational images (Farocki, Paglen) (L537–628)
- **Ch1 "Seeing More":**
  - obsidian mirror (L856–866), lenses, camera obscura, linear perspective as an algorithm (L1175–1482)
  - photography, Bertillon, physiognomy, DNA phenotyping (L1485–1773)
  - Muybridge (L1776–1864); infrared, FaceID dots (L1867–2016)
- **Ch2 "Seeing Differently":**
  - robot vacuum "tunnel vision" (L2109–2207); kino-eye (L2256–2496)
  - "machines don't need images" (L2612–2624)
  - **training data, COVID distribution shift, Buolamwini audit** (L2806–2857)
- **Ch3 "Seeing Everything":**
  - Oak Park + Flock Safety ALPR (L2931–3605); Ring/Neighbors (L3608–3771); Aurora misidentification (L3774–3866)
  - **does surveillance reduce crime? CCTV meta-review, ShotSpotter** (L3913–4021)
- **Ch4 "Being Seen: The Algorithmic Gaze":**
  - male gaze → algorithmic gaze (L4137–4211)
  - **normalising faces / bias amplification / CelebA** (L4214–4416); **emotion recognition** (L4419–4536)
  - unstaffed stores, attendance, school lunch queues (L4561–4867)
- **Ch5 "Seeing Less":**
  - folk theories (L5196–5238); **adversarial examples** (L5239–5299); anti-face-recognition tactics (L5382–5438)
  - **bias: Kinect/Buolamwini, Gender Shades, false arrests, the "99 %" problem** (L5441–5524)
  - 1:1 vs 1:N (L5527–5608)
- **Conclusion:** agency, trust, bias; hope (L5609–5779)

**Reusable points:**
- **Concepts:**
  - [U] Definition: machine vision = "the registration, analysis and representation of visual information by machines and algorithms" (L83–85). Prefers "machine vision" over "computer vision" to include the history of seeing with technology (L89–92).
  - [U] Every new way of seeing "carries with it its own blind spots" (L29–31).
  - [U] **Representational vs operational images** (L563–581):
    - a snapshot *shows*; a self-driving car's camera image *does* something
    - Farocki's "operative image" (2001; defined 2004: images "that do not represent an object, but rather are part of an operation")
    - Paglen 2014: "the machines were starting to see for themselves"
    - A passport photo is both (L584–595).
  - [U] "The machine needs no image": a self-driving car processes zeros and ones (L550–562, L2621–2624). A classifier "calculates statistical probabilities… It doesn't produce explanations why" (L663–667). Links to softmax output.
  - [C] Haraway's "god trick of seeing everything from nowhere" (L291–320). "Machine vision doesn't 'see' alone" (L356–359): the same tech has different effects in different contexts; Flock is illegal in Bergen (L3007–3013).
  - [C] **Algorithmic gaze** (L4152–4219). "Machine learning has a normalising effect… It produces stereotypes, not defamiliarizations." All ML systems are "normalising machines", which leads to bias amplification (L4355–4359).
- **Bias cases:**
  - [U] **Buolamwini/Gebru (Gender Shades)**: systems "markedly worse at identifying black women than white men" (L5507–5510); "far less likely to correctly identify black faces and women's faces" (L2848–2851); the re-audit improved, but newly audited vendors showed similar bias (L2853–2857; Raji & Buolamwini).
    - **The book gives no numbers.** From the original paper (Buolamwini & Gebru 2018), gender classification by Microsoft, IBM and Face++: error up to **34.7 % for darker-skinned women vs 0.8 % for lighter-skinned men**.
  - [U] **White-mask story** (L5489–5506): the device ignores her face and responds when she puts on a white mask. The book places this on the Xbox Kinect; see Errors.
  - [U] **False arrests** of innocent Black men after face-recognition matches (L5510–5513). Names only in ch5 endnote 16: Robert Williams, Michael Oliver, Nijeer Parks.
  - [U] **Base-rate argument** (L5514–5521): boarding systems are "more than 99 per cent accurate", but with thousands of passengers 1 % failure means many people misrecognised. Good link to the confusion-matrix / base-rate chapters: 1 % of 10,000 = 100.
  - [U] **1:1 vs 1:N** (L5529–5538): verifying a face against your passport is easy; searching millions of faces "is far more difficult".
  - [U] **Distribution shift** (L2813–2844): COVID panic buying broke Amazon's stocking algorithms and recommenders.
  - [U] **Camera "normalisation"** (L4222–4228): the orange wildfire sky in California auto-"corrected" to grey; a blink-detection camera trained on Caucasian faces flagged Asian faces.
  - [U] **CelebA** (L4382–4405): "over 200,000" celebrity photos, 40 binary attributes incl. `Attractive` and `Male`; female = Male FALSE.
  - [U] DALL-E-style bias: "nurses are women, doctors are men and terrorists look Arabic" (L57–62; DALL-E model card).
  - [U] ImageNet: scraped from the web and organised by WordNet, including unpicturable or offensive categories. Crawford & Paglen's *ImageNet Roulette* (L171–182). Links to ImageNet in 11.4.
  - [C] Hypothetical (not data): 80 % white faces in the training set → a generator may output 95 % (L4289–4293). Illustrates bias amplification.
  - [U] **Emotion recognition** (L4419–4536):
    - "no direct correspondence between facial expressions and emotion" (Barrett et al. 2019)
    - Affectiva AffdexMe: neutral face → 28 % sad, smile → 100 % joy
    - Chinese school reports ("inattentive 7 % vs class average 3 %")
    - hiring
  - [C] Daniels 1952: of 4,063 pilots none was average on all 10 measurements. "We are all outliers" (L4329–4354). A nice statistics link.
- **Surveillance** (US-centric; mostly [C]):
  - Flock Safety ALPR (L2949–3403):
    - ~$2,500/camera; founded 2017
    - >1,500 US cities and "a billion cars a year" by early 2022
    - marketing claim "reduce crime by up to 70 %"
  - Oak Park (L3296–3473, L3577): police wanted 20 cameras, the board split 3–3 and 8 were bought; police stop Black people 6× as often.
  - Aurora, Colorado (L3791–3802): a Flock misread led to four children held at gunpoint.
  - [U] **CCTV meta-review** (Piza et al., L3923–3944):
    - 76 studies over 40 years
    - vehicle/property crime ≈ −14 %, drug crime −26 %
    - no effect on violent crime; no effect in US studies
    - none of the studies evaluated *automated* systems
  - ShotSpotter (L3967–3990): 86 % of deployments find no crime; a 1999–2016 national study found "no significant impact".
  - UK school lunch-queue face recognition, "five seconds per pupil", dropped after the regulator objected (L4823–4849).
- **Adversarial / resistance:**
  - [U] Szegedy et al. 2013, "Intriguing properties": imperceptible changes flip classifications; "not random but a built-in feature" (L5239–5268). Pairs with DLV's tiger example.
  - [U] "The easiest attack on stop-sign detection is to remove the sign" (L5280–5283).
  - [C] CV Dazzle (2010), face shields at BLM protests (2020), Hong Kong 2019 (L5406–5438).
  - [C] Peng! Mask.ID (2018): a morphed passport photo was accepted (L5578–5590).
- **History / facts for a timeline** ([U]):
  - obsidian mirror, 8,000 years ago (L862–864)
  - camera obscura: Mozi, 4th c. BCE (L1281–1283)
  - linear perspective: Brunelleschi 1425, Alberti 1435, "basically an algorithm" (L1360–1386)
  - Galileo 1609 (L1437–1465); Niépce 1816 (L1524)
  - Muybridge 1873–78 (L1786–1801)
  - infrared discovered 1800 (L1916–1920)
  - FaceID projects 30,000 IR dots (L1884–1891)
  - perceptron 1957 (L142–144)
  - adversarial examples 2013 (L5245–5247)
  - "foundation model" coined 2021 (L190–193)
- **Quotes** ([U]):
  - "Machine vision doesn't 'see' alone." (L356)
  - "It produces stereotypes, not defamiliarizations." (L4218–4219)
  - "None of us is truly average. We are all outliers." (L4353–4354)
- **Not in MV:**
  - Google Photos "gorillas" (2015)
  - Clearview AI
  - Shirley cards
  - Amazon Rekognition by name
  - Xinjiang surveillance
  - ImageNet sizes and error rates
  - the EU AI Act (2024)

  If the chapter uses these, cite other sources (Kiegészítés).

---
## Errors / dubious claims in the sources

**Convolution naming:** both DLV and HAW call the operation convolution but compute cross-correlation (no flip). Neither mentions it. Standard DL practice, but tell the reader (`box tip`). HAW Fig 5-3 would give −48 instead of 48 with a true convolution (verified).

**DLV ch16**
1. **Yellow detector numbers don't work** (L78–84, L105–107). The weights (+1, +1, −1) are meant to give "a single number from 0 to 1". Computed:
   - pure yellow (1,1,0) → **2**; white (1,1,1) → 1; red (1,0,0) → 1; blue → −1
   - So white and red score as high as "half-yellow"; an activation or normalization is needed.
   - Fine as an intuition; don't copy the numbers.
2. **"Transposed convolution, fractional striding, dilated convolution, or atrous convolution" are listed as synonyms** (L1103–1105, L1154–1155). **Wrong.** Dilated/atrous convolution inserts holes into the *kernel* to enlarge the receptive field *without* upsampling (DeepLab, WaveNet). Transposed convolution inserts zeros between *input* elements to upsample. Only "transposed conv" ≈ "fractionally strided conv" is correct.
3. **Pooling presented as blurring** (L841–899). The "blurry input" motivation fits average pooling (a box filter), but max pooling is not a blur. The text then claims max pooling is generally preferred because it "learns more quickly" (L905–907), an empirical folk claim without a source.
4. **"Pooling allows our convolutions to be translationally invariant / shift invariant"** (L962–967, summary L1704–1706). Oversimplified:
   - convolution is shift-*equivariant*
   - pooling gives only local, partial invariance
   - the cited Zhang 2019 ("Making Convolutional Networks Shift-Invariant Again") actually shows that strided/pooled CNNs are *not* shift-invariant (aliasing)
5. **1×1 convolution text** (L712–713): "we make sure that we have at least 11 fewer filters than there are input channels". Garbled: to merge 12 eye channels into 1 you need 1 filter, i.e. 11 fewer *for those channels*. Rephrase as "C_out < C_in reduces channels".
6. **No bias in the conv neuron.** Biases are never mentioned (sum → activation, L251–254). Real conv layers have one bias per filter. Matters for parameter counts.
7. **Strided conv ≈ conv + pool** (L973–979, L1014–1019) is true for output *size* only. The book says this itself later (L1071–1076); fine.
8. **Biology analogies:** the "Jennifer Aniston neuron" is from Quiroga et al. 2005 (Nature), not "Quiroga 2005" alone. DLV says "fired only when Aniston was alone"; that matches the paper. The book flags this as inspiration (L327–330), so it's OK as a curiosity, not as an explanation.
9. Minor: the 2×2 pooling of an 11×11 map keeps partial blocks (L1507–1509) → 6×6. Most libraries default to floor → 5×5 (ceil_mode=False). The book is internally consistent (verified shapes).

**DLV ch17**
10. **VGG16 tensor sizes wrong** (L273–275): "the tensor coming out of Group 4 has size 28 by 28 by 512, and the tensor after the max pooling layer in Group 5 has dimensions 14 by 14 by 512".
    - Correct: Group 4 → **14×14×512**; Group 5 → **7×7×512**. 224 / 2⁵ = 7; the first FC has 7·7·512 = 25,088 inputs.
    - The book skipped one halving (28×28×512 is only the conv output inside group 4, before its pool).
11. **"The winner of one of the classification tasks was VGG16"** (L185–186). Inaccurate:
    - In ILSVRC 2014, VGG won **localization** and was **2nd in classification**; GoogLeNet won classification (6.7 % vs 7.3 % top-5).
    - "VGG16 broke records … still does very well … even compared to newer systems" (L190–193) is outdated. VGG16 is ~71.5 % top-1 vs ~76 % for ResNet-50 (2015) and 85–90 % for modern models. Still popular as a teaching/feature-extractor backbone and for style transfer.
12. **MNIST has 70,000 images** (60,000 train + 10,000 test). L20 says "contains 60,000".
13. **Dropout description** (L90–105, L129–131):
    - Dropout is said to be "applied to the nearest preceding layer that contains neurons", so it could go before or after pooling with "nothing changed". In Keras, Dropout acts on the *output tensor of the previous layer* (here the pooled map). Before vs after max pool is not equivalent.
    - "Before each epoch" (L98) contradicts "at the start of each batch" (L130). Dropout masks are resampled every forward pass/sample.
14. Flatten order: L113–116 describes channels-last (each element's 64 values in a row), but the Fig 17-2 caption says "turning each channel into a list" (channels-first). Inconsistent; irrelevant for learning.
15. Fig 17-10 labels the input "3 x 224 x 224" while the text uses 224×224×3 (cosmetic). L632 refers to "Figure 17-23" where 17-24 is meant (typo).
16. **Filter visualization attribution:** activation maximization by gradient ascent is due to Erhan et al. 2009 / Simonyan et al. 2013. Zeiler & Fergus 2013 used deconvnets. Minor.
17. Style transfer (ch23 L97, L117): "pairs of **layers** that activate in roughly the same way" / "score for that pair of layers". Should be pairs of **filters (channels) within a layer**; the Gram matrix is C×C per layer. L219-ish: "if all the filters respond … the same way, then the input is the starting image". Not generally true; deep features are many-to-one.
18. **Transfer learning vs fine-tuning** (`DLV11_extra.txt` L18–27). DLV makes "fine-tuning (all weights change)" distinct from "transfer learning (freeze + new head)". Standard usage: fine-tuning is *one form* of transfer learning (feature extraction vs fine-tuning).
19. **Skip connections** "let us make layers that are smaller and faster" (extra L130–133, L153–158). Dubious. The main benefit is optimization (an identity path for gradients and an easy identity mapping), not smaller/faster layers.

**HAW ch5 / ch2**
20. **"Traditional NN … assumes the features are independent and unrelated"** (ch5 L32–41). Wrong as stated: an MLP makes no independence assumption. It is merely *permutation-agnostic*: a fixed input permutation yields an equivalent model, and it has no built-in locality. Likewise "strong correlation between adjacent pixels is something traditional ML models do not want" is an overstatement.
21. **"LeNet"** (render haw11-139, ch5 L284–308) = Conv(6) ReLU, Pool, Conv(16) ReLU, Pool, Conv(120) ReLU, Dense(84). The original LeNet-5 (1998):
    - used scaled tanh/sigmoid, not ReLU
    - used trainable average "subsampling", not max pooling
    - took 32×32 input with 5×5 kernels
    - C3 used a sparse connection table (60 kernels, not 96): 6 + 60 + 1,920 = 1,986 kernels vs the book's 2,022 (computed)
    - With 28×28 MNIST and no padding, the third 5×5 conv would not reach 1×1 (28→24→12→8→4; computed). The book doesn't give kernel sizes.

    Present it as a "LeNet-style" network.
22. **"Pooling layers are a concession to reduce the number of parameters"** (L274–275). Imprecise: pooling has no parameters and shrinks the *activations*. It reduces parameters only of later dense layers, and adds local shift tolerance (not mentioned by HAW).
23. **"Effective receptive field"** (L400–403) is used for the theoretical receptive field. In the literature (Luo et al. 2016), "effective RF" means the smaller, Gaussian-like region that actually influences the output. Use "receptive field" (receptív mező).
24. **V1→V2→V3→V4→V5 chain** (L142–147): oversimplified. Object recognition runs along the ventral stream (V1→V2→V4→IT); V5/MT is the motion (dorsal) area. "Most of V1 is occupied by the central 2 percent of our visual field" (L138–140) is a strong paraphrase of cortical magnification; avoid the number.
25. **ImageNet error numbers mix top-1 and top-5** (HAW_ch2 L484–502):
    - "error of just over 15 percent" is AlexNet's **top-5** error (15.3 %; runner-up 26.2 %, top-5)
    - but "random guessing … error rate of 99.9 percent" is the top-1 chance level; top-5 chance is 99.5 % (computed)
    - "by 2017 ~3 %" and "~5 % human" (Karpathy's ~5.1 %) are also top-5. Say "top-5" explicitly.
26. **"The advent of CNNs in 1998"** (HAW_ch2 L435; ch5 L18–20): oversimplified.
    - LeCun et al. 1989 already trained CNNs with backprop on zip-code digits (DLV ch17 L19 even cites LeCun 1989)
    - the 1998 paper introduced LeNet-5 + MNIST
    - The Neocognitron (1980) had the conv/pool structure but no backprop.
27. Forward-mode autodiff "unsuited to neural networks" (L664–666): oversimplified. It is inefficient for many-inputs→one-output (cost ∝ number of parameters), not unusable. Out of scope.
28. HAW's CIFAR CNN: only "4 conv, 2 pool, dense 472, 577,014 params". No kernel sizes or filter counts, so the 577,014 can't be verified. Quote the figure as "the book reports".

**MV (Rettberg)**
29. **The Kinect attribution of the white-mask story is likely wrong** (L5484–5506). In her TED talk (2016, cited in note 14), Buolamwini tells it about face-detection software: a social robot, and her MIT "Aspire Mirror" project. Verify before reusing; safest phrasing: "arcfelismerő szoftver".
30. **Gender Shades is described as "identifying/recognising" faces** (L2849, L5509). The study audited **gender classification** APIs, not identity recognition. "Trained on a dataset of mostly white men" (L2851–2852) is an inference: the paper showed skewed *benchmarks* (IJB-A, Adience); the vendors' training data was unknown.
31. **Perceptron training is described as random trial and error** (L148–162). Wrong: weight updates are error-driven (the perceptron rule).
32. **Timeline** (L163–173):
    - "deep learning was proposed in the 1970s": multilayer nets come from the 1960s, and backprop was popularized in 1986
    - "a major shift occurred in 2010": the usual landmark is AlexNet/ImageNet, 2012
    - LeCun's CNNs (1989/98) are skipped
33. **Parameters vs dimensions confused** (L211–229): "each parameter is an axis… a billion more dimensions". Embeddings have 10²–10³ dimensions; parameters are weights.
34. **Adversarial passage** (L5249–5268):
    - activations are "between 0 and 1" (ReLU is unbounded)
    - "changing a single pixel" (Szegedy used many tiny changes; the one-pixel attack is Su et al. 2017)
    - "first, or deepest, layer" (the first layer is the shallowest)
35. **Overfitting** "gives a high error rate" (L4280–4285): it gives low training error and high test error. Bias amplification is attributed to "avoiding overfitting", which is loose.
36. Minor slips:
    - IR/UV "a little below and above" visible light (L1874–1875): reversed by wavelength
    - "Paul Rodin" (L1852) should be Auguste Rodin
    - Mulvey "1972" (L4155) should be 1975
    - Oak Park shooting dated both 7 and 9 Nov 2021 (L3265 vs L3874)
37. **Amazon "Just Walk Out" uses facial recognition** (L4589–4591): Amazon says it does not. The author herself entered with a QR code (L4606–4610).
38. **Dated by 2026:**
    - Just Walk Out was largely removed from Amazon Fresh in 2024
    - Chicago ended ShotSpotter in 2024
    - Flock's "1,500 cities" is a 2022 figure
    - "only big tech can train foundation models" (L200–201)
    - EU context is missing: the AI Act (2024) bans emotion recognition at work and in schools and restricts real-time remote biometric ID. Good Hungarian/EU anchor for 11.8 (Kiegészítés).
39. The Piza CCTV percentages (−14 % / −26 %, L3933–3934) were not checked against the original meta-analysis. Verify before quoting numbers.
