# Ch10 source digest B — PDL, MLQ, MLSYS, ESL

Extracts are in `_parts/src/`. `L123` = line number in the named file.
- `PDL10_ch9.txt` = Kneusel, *Practical Deep Learning* ch9 (training a NN); `PDL10_ch10.txt` = ch10 (MNIST experiments with sklearn `MLPClassifier`)
- `MLQ10_ch4_7.txt` = Raschka, *ML and AI Beyond the Basics* ch4 (lottery ticket), ch5 (overfitting: data), ch6 (overfitting: model), ch7 (multi-GPU)
- `MLQ10_ch10_27.txt` = Raschka ch10 (sources of randomness); ch27 (proper metrics: MSE/CE as distances) starts at L239
- `MLSYS10_frameworks.txt` = Reddi et al., *ML Systems*, ch7 "AI Frameworks"; `MLSYS10_training.txt` = ch8 "AI Training"
- `ESL10_11_4_5.txt` = Hastie–Tibshirani–Friedman, *ESL* §11.4–11.5 (+ start of 11.6)
- Checks: `calc/s10b_pdl.py` (needs numpy), `calc/s10b_checks.py`; sklearn 1.9.1 source inspected for `MLPClassifier`. PDL figures read from renders (PDF pages 262–280).

**Not covered by these sources** (mark as "Kiegészítés"): RMSProp/Adam equations are absent from PDL/MLQ/ESL; MLSYS training has them, but Adam is printed without bias correction (§4). AdamW / decoupled weight decay (MLQ L325–329 only hints "subtle differences"); vanishing/exploding gradients as a derivation (PDL shows only the symptom: deep sigmoid nets fail, L314–334); batch/layer norm (one sentence, MLQ L478–481); LR warm-up and cosine schedules (PDL has only sklearn's `invscaling`/`adaptive`, L470–489); gradient clipping; a numeric backprop example on a real 2-layer net with nonlinearity (PDL's is linear, MLSYS's has 1 ReLU); the Xavier variance derivation; inverted dropout (none of the four books mentions it); linear LR–batch-size scaling rule.

---
## 1. PDL (Kneusel, Practical Deep Learning, ch9 + ch10)

**Order of topics (ch9):** overview: init → GD → backprop → loss → regularization (L22–60) → gradient as slope, Δy/Δx, tangent lines Fig 9-1 (L63–140) → finding minima, local vs global, start points A/B/D (L143–192) → update rule w ← w − η∆w, Listing 9-1 "GD in five steps" (L206–256) → SGD: batch vs minibatch, epoch, the "estimate the mean from 10 of 100 bytes" demo (L259–346) → convex vs nonconvex, saddle points (L349–412) → ending training with a validation set (L415–452) → LR schedules in sklearn (L455–489) → momentum (L492–511) → backprop take 1: chain rule on a 1-1-1-1 linear chain (L517–764) → take 2: δ-notation, matrix form (L767–956) → losses: L1, MSE, CE (L959–1088) → weight init: symmetry breaking, Glorot/Xavier/He (L1091–1172) → overfitting via polynomial fit (L1181–1319) → regularization: more data, augmentation, L2, dropout (L1322–1507) → 7-step summary (L1510–1535).

**Order of topics (ch10):** MNIST as 784-vectors, /256 scaling (L24–35, L189–235) → `MLPClassifier` defaults and Table 10-1 (L37–85) → architecture × activation, Table 10-2 (L90–352) → equal-parameter depth comparison, Table 10-3 / Fig 10-1 (L353–451) → batch size, Table 10-4 / Fig 10-3 (L454–665) → base LR, Fig 10-4, football-field analogy (L668–810) → training-set size, Fig 10-5 (L813–874) → L2, Fig 10-6, `warm_start` trick (L877–991) → momentum, Fig 10-7 (L997–1062) → initialization, Tables 10-5/10-6, Fig 10-8 (L1065–1292) → scrambled pixels, Fig 10-9 (L1295–1385).

**Reusable points:**
- Listing 9-2, SGD with backprop in 5 steps (L536–541): forward pass = step 2, backward pass = step 3 (L545–548).
- "Estimate the mean from a sample" analogy for a minibatch gradient (L295–327): 100 values with mean 130.9; samples of 10 give 138.9, 135.7, 131.7, 134.2, 128.1.
- Epoch/minibatch relation: 1 epoch = n/m minibatches (L333–337). In practice you shuffle once, then take blocks in order (L339–346). Fig 10-2 shows an epoch built from minibatches with a smaller last block (L501–519).
- Saddle-point "marble on a horse saddle" (L401–408).
- Validation set used for stopping, so do not report its accuracy (L443–452).
- Backprop take 1 (L605–757) on h1 = w1x, h2 = w2h1, y = w3h2, L = ½(y−ŷ)². Gradients: ∂L/∂w3 = (y−ŷ)w2w1x, ∂L/∂w2 = (y−ŷ)w3w1x, ∂L/∂w1 = (y−ŷ)w3w2x. These are correct and make a ready practice item with numbers.
- Backprop take 2 (L852–946):
  - δ^(L) = ∂L/∂a^(L) ⊙ h′(z^(L)); δ^(l) = (W^(l+1))ᵀδ^(l+1) ⊙ h′(z^(l)); ∂L/∂b = δ; ∂L/∂w_kj = a_k^(l−1) δ_j.
  - The transpose maps a 2-vector back to 3 nodes (L924–929).
  - Note on ReLU′(0): TensorFlow returns 0 (L892–899).
- MSE is more outlier-sensitive than L1 (L1014–1018). CE example y = (0.03, 0.87, 0.10), ŷ = (0,1,0) gives L = 0.139262 (L1054–1069).
- Init: equal weights mean equal gradients, so symmetry must be broken (L1105–1109). Biases: the "fickle wisdom" says 0, but sklearn initializes them like the weights (L1168–1172; confirmed in sklearn 1.9.1 `_init_coef`).
- Regularization ranking: more data > augmentation > L2, dropout (L1323–1347). Dropout on the input layer acts like augmentation (L1490–1494). An ensemble of 20 nets means 20× inference cost (L1434–1439).
- Polynomial-fit overfitting demo (L1204–1305): 17 points; quadratic vs 15th degree. Recomputed in Python:
  - training RMSE 37.2 (quadratic) vs 1.6 (degree 15)
  - extrapolation to x = 10.4: 570 vs −105,744
- ch10 rules of thumb:
  - ReLU ≳ tanh ≫ sigmoid in hidden layers.
  - At equal parameter count, deeper beats wider (Fig 10-1).
  - Fix the number of SGD *steps* when comparing batch sizes.
  - Match the number of epochs to the LR.
  - More data gives diminishing returns.
  - Small-weight "classic" init is clearly worse than Glorot/He.
  - Test error rising late = overfitting: stop at the minimum (≈1,200 epochs, L1283).
- Football-field analogy for LR and number of steps; it also motivates LR decay (L751–810).
- Scrambling pixels (with a fixed permutation) does not hurt an MLP. The scrambled and normal curves in Fig 10-9 are not statistically different (L1368–1385). This sets up CNNs.

**Numeric examples (all experiments use sklearn `MLPClassifier(solver="sgd")`, MNIST pixels /256):**
- **Table 10-2** (L292–305): 1,000 train / 1,000 test, LR 0.001, μ = 0.9, 200 epochs, 10 runs, mean ± SE.

  | arch | ReLU | tanh | sigmoid |
  |---|---|---|---|
  | 1 | .2066 | .2192 | .1718 |
  | 500 | .8616 | .8576 | .6645 |
  | 800 | .8669 | .8612 | .6841 |
  | 1000 | .8670 | .8592 | .6874 |
  | 2000 | .8682 | .8630 | .7092 |
  | 3000 | .8691 | .8652 | .7088 |
  | 1000-500 | .8779 | .8720 | **.1184** |
  | 3000-1500 | .8822 | .8758 | **.1221** |
  | 1000-500-250 | .8829 | .8746 | **.1220** |
  | 2000-1000-500 | .8850 | .8771 | **.1220** |

  The sigmoid nets with ≥2 hidden layers fail (chance level); the loss does not go down (L314–320). The 3000-1500 ReLU net has 6,871,510 params and trains in 253 s; loss 0.2107 (L280–288).
- **Table 10-3** parameter counts (L362–377): all 12 verified in Python, e.g. 1000 → 795,010; 700-350 → 798,360; 660-330-165 → 792,505; 8000 → 6,360,010.
- **Fig 10-1** (25 runs, read from the render):
  - 1 layer: 0.8655 → 0.8683 → 0.8716 → 0.8698
  - 2 layers: 0.8748 → 0.8781 → 0.8808 → 0.8798
  - 3 layers: 0.8778 → 0.8822 → 0.8848 → 0.8864
  - x-axis = 0.8, 1.6, 3.2, 6.4 M params
- **Batch size** (Table 10-4, L551–568): n = 16,384, 784-1000-500-10, 5 runs. Steps per epoch = 16384/m, from 8,192 (m = 2) down to 1 (m = 16,384).
  - Fig 10-3, read from the render; fixed 100 epochs (circles): small m ≈ 0.97; m = 512 → 0.933; 1,024 → 0.918; 2,048 → 0.900; 4,096 → 0.873; 8,192 → 0.829; 16,384 → 0.761.
  - Fixed M = 8,192 steps (squares, epochs = Mm/n): flat ≈ 0.950, with a slight dip (≈0.937–0.945) for the smallest batches.
- **Base LR** (L681–767, Fig 10-4): 20,000 samples, batch 64, 1000-500.
  - LRs [0.2, 0.1, 0.05, 0.01, 0.005, 0.001, 0.0005, 0.0001]; epochs for constant LR×epochs: [8, 15, 30, 150, 300, 1500, 3000, 15000]. Products: 1.6 for 0.2, otherwise 1.5 (Python).
  - Fixed 50 epochs (render): 1e-4 → 0.919; 5e-4 → 0.951; 1e-3 → 0.960; 5e-3 → 0.971; 0.01 → 0.9725; 0.05 → 0.9755; **0.1 → 0.976**; 0.2 → 0.948.
  - Fixed LR×epochs: ≈0.970–0.976 everywhere except 0.2 → 0.955.
- **Training-set size** (Fig 10-5, ≈1,000 steps, batch 100): ~100 → 0.75; 500 → 0.87; 1,000 → 0.90; 2,000 → 0.925; 5,000 → 0.950; 10,000 → 0.965; 20–30k → 0.969–0.970.
- **L2** (Fig 10-6): 3,000 samples, 100-50, batch 64, μ = 0, α ∈ {0, 0.1, 0.2, 0.3, 0.4}, 10,000 epochs. Without L2 the test error stays ≈0.080; with α = 0.1–0.4 it is ≈0.066–0.068, and larger α gets there sooner but is noisier.
- **Momentum** (Fig 10-7): same setup, α = 0.0001, μ ∈ {0, .3, .5, .7, .9, .99}. Final test error:
  - μ = 0.3: 0.084; μ = 0.5: 0.083; μ = 0: 0.082
  - μ = 0.7: 0.079; μ = 0.9: 0.076
  - **μ = 0.99: 0.060**
  - With 30,000 samples, μ = 0.9 is best instead (L1057–1062).
  - The effective step multiplier 1/(1−μ) is 1.4, 2, 3.3, 10, 100 (Python): a useful explanation the book omits.
- **Init** (Table 10-5, Fig 10-8): 6,000 samples, 100-50, LR 0.01, μ = 0.9, α = 0.2, batch 64, 4,000 epochs, 10 runs.
  - Schemes: Glorot U(±√(6/(fin+fout))); He N·√(2/fin); "Xavier" N·√(1/fin); Uniform 0.01(U−0.5); Gaussian 0.005N.
  - Gaussian/Uniform level off at ≈0.0466. Glorot ≈ He reach a minimum ≈0.0443 at ~1,200 epochs, then drift up to ≈0.045. Xavier is slightly worse early, then catches up.
  - Per-layer scale for 784→100: Glorot std 0.048, He 0.051, Xavier 0.036, Gaussian 0.005, Uniform 0.0029 (Python).
- Scrambled vs unscrambled (Fig 10-9): both ≈0.0445 minimum, ≈0.045 at 4,000 epochs.

**History, as stated:**
- Backprop: Rumelhart, Hinton and Williams 1986 (L525–527).
- Glorot & Bengio (footnote L1175); He et al. "Delving Deep into Rectifiers" (L1163). "Xavier and Glorot are the same person" (L1130).
- Dropout "appeared in 2012", attributed to Krizhevsky et al.'s ImageNet paper, ">70,000 citations as of Fall 2020" (L1420–1423).
- L2 "now standard" (L1344–1347).

**Errors:**
1. **L505, momentum `w_{i+1} ← w_i − η∆w_i + µ∆w_{i−1}`, with ∆w defined as the gradient (L499).**
   - Read literally, the momentum term pushes *uphill*. On f = w²/2 with η = 0.1, μ = 0.9 it diverges to 4.6·10⁸ after 50 steps, while heavy-ball converges (`s10b_checks.py`).
   - It also keeps only one previous term instead of an exponential average.
   - Correct: v ← μv − η∇L, w ← w + v, i.e. μ times the previous *update*, not the previous gradient.
   - L998–1000 repeats "fraction of the gradient value used … previous minibatch".
2. **L1047, binary CE `−ŷ log(y) + (1−ŷ) log(1−y)`: brackets are missing.** Correct: −[ŷ log y + (1−ŷ) log(1−y)]. L1043 also sums over index i instead of j. L990 says ŷ is "always an integer label", but L1065 uses it as a one-hot vector.
3. **L1420–1423: dropout is attributed to Krizhevsky et al. 2012 (AlexNet).**
   - Dropout comes from Hinton et al. 2012 (arXiv "Improving neural networks by preventing co-adaptation…") and Srivastava et al. 2014 (JMLR). AlexNet used it.
   - MLQ L219–222 cites it correctly.
4. **L1482–1505, dropout scaling and conventions.**
   - p here is the *drop* probability. Keras and PyTorch agree, but the original paper uses p = *retain* probability: a source of confusion worth a `box tip`.
   - The "multiply all weights by 1−p at test time" rule applies only to the outgoing weights of dropped units. Modern frameworks instead use **inverted dropout**: divide by (1−p) during training and do nothing at test time.
   - The geometric-mean equivalence is exact only for a single softmax layer; for deep nets it is an approximation.
5. **L777–791, base-LR experiment explanation is backwards.**
   - The book says the circles (50 epochs) trained *more* epochs than the squares "for the corresponding base learning rates" at the first three (smallest-LR) points.
   - In fact the squares used 15,000 / 3,000 / 1,500 epochs there (L706), far more than 50. The circles are low because they were *under*-trained (too few small steps), as the book itself correctly says at L760–762.
6. **L639 "m is the number of minibatches".** m is the minibatch *size* (as in L503–504).
7. **L662–665: the fixed-epoch degradation is "because of the design of sklearn".** It is not sklearn-specific: fewer steps at a fixed LR. The book never mentions scaling the LR with batch size (linear scaling rule), which is what makes large batches competitive in practice.
8. **L1378 / Table 10-1 L74 "alpha = λ".**
   - sklearn divides the penalty by the batch size: `loss += 0.5·alpha·‖W‖²/n_batch` (checked in the 1.9.1 source). So α = 0.1–0.4 with batch 64 means λ ≈ 0.0016–0.0063.
   - That is why such "large" α values (L917) are harmless.
9. **L1389, L880–882: "L2 regularization is also known as weight decay … functionally equivalent".**
   - True for plain SGD (and SGD + momentum). It is false for adaptive optimizers.
   - With Adam the L2 gradient is rescaled by 1/√v̂. In a toy run (w₀ = 1, zero data gradient, 100 steps, lr 0.01), Adam+L2 gives w = 0.224 for both λ = 0.001 and λ = 0.1, while AdamW (λ = 0.1) gives 0.905 (`s10b_checks.py`).
   - Correct statement: use AdamW (Loshchilov & Hutter 2017/2019) for weight decay with Adam.
   - Note that sklearn's *default* solver is Adam, with the L2 added to the gradient.
10. **L1143–1145: "according to the literature, sigmoid → A = 2".**
    - This is sklearn's choice (`factor = 2` for logistic). The Glorot paper derives √(6/(fin+fout)) (A = 6) for tanh.
    - The usual sigmoid recommendation is *4×* that bound. A = 2 gives a 1.7× *smaller* bound, which makes the deep-sigmoid failure in Table 10-2 more likely.
    - Also, Caffe's "xavier" filler is uniform with variance 1/fin, not N(0,1)·√(1/fin) (L1146–1152). The variance is the same; the distribution is not.
11. **L321–327: deep sigmoid nets fail because init is "tailored for ReLU and tanh".** The main cause is vanishing gradients through saturating sigmoids (σ′ ≤ 0.25 per layer), with LR 0.001 and 200 epochs. The text also cross-references "Chapter 8" for init schemes, which are in Chapter 9 (L325).
12. **L397–400: "many local minima … all basically the same … pretty much proven now".** This is an empirical observation with partial theory (Choromanska et al. 2015; Dauphin et al. 2014), not a proof. L374–377: a convex function's chord must lie *on or above* the graph, not merely "not cross" it.
13. **Warm-start caveat for Figs 10-6 to 10-9 (not an error in the text).** Each `fit()` call with `max_iter=1` recreates sklearn's `SGDOptimizer`, so the momentum buffer resets every epoch (checked in the sklearn 1.9.1 source).
    - Epochs are only 47 steps (3,000/64) or 94 steps (6,000/64) long. μ = 0.99 (time constant ≈100 steps) therefore never reaches steady state.
    - The momentum "experiment" is not measuring plain momentum.
14. Typos: the x-axis tick "100" should be 1000 in Figs 10-8 and 10-9. L1422: AlexNet's citation count has no bearing on dropout.

---
## 2. MLQ (Raschka, Machine Learning and AI Beyond the Basics)

**Order of topics:**
- ch4, lottery ticket: definition (L9–14) → 4-step procedure, Fig 4-1: train, prune, **reset to the original init**, retrain, repeat (L21–58) → limitations (L61–79) → refs (L97–115).
- ch5, overfitting via data:
  - more data + learning curves, Fig 5-1 (L144–163)
  - augmentation, Fig 5-2: brightness, flip, crop (L165–184)
  - pretraining / transfer / few-shot (L186–201)
  - other methods: feature normalization, adversarial examples, label/feature noise, label smoothing, **smaller batch sizes**, Mixup/Cutout/CutMix (L204–213)
- ch6, overfitting via the model:
  - L2 vs weight decay (L309–329)
  - dropout (L333–338)
  - early stopping, Fig 6-1 (L339–351)
  - smaller models: pruning, knowledge distillation (L353–390)
  - caveats: double descent, grokking (L392–419)
  - ensembles: majority vote, stacking, k-fold ensembles (L421–470)
  - other: skip connections, lookahead, SWA, BatchNorm/LayerNorm as side-effect regularizers (L471–486)
  - "combine several, tune like hyperparameters" (L489–499)
- ch7, multi-GPU: model (inter-op) parallelism (L589–609) → data parallelism (L611–622) → tensor (intra-op) parallelism, Figs 7-1/7-2 (L624–650) → pipeline (L652–673) → sequence (L675–706) → recommendations (L709–721); exercise 7-1: "Adam OOMs where SGD fits" (L725–730).
- ch10, randomness (MLQ10_ch10_27):
  - weight init + seeding (L20–44)
  - dataset splits / shuffling (L47–58)
  - dropout (L61–86)
  - runtime algorithms: direct/FFT/Winograd convolution in cuDNN, `torch.use_deterministic_algorithms(True)` (L89–123)
  - hardware/drivers, the NVIDIA "no bit-wise reproducibility across architectures" quote (L126–142)
  - generative sampling: top-k, nucleus (top-p), temperature (L145–204)
- ch27, proper metrics: the 3 axioms (L261–285) → SE is not a metric, RMSE/|·| is (L288–339) → CE is not a metric (L342–383).

**Reusable points:**
- Lottery ticket in one sentence (L9–14): a random-init network contains a subnetwork that, trained in isolation from *the same initial weights*, matches the full net within the same number of steps.
  - Shrinks to ~10% of the size without loss of accuracy (L53–58).
  - Practical catch: finding the ticket requires training the big net first (L67–71).
  - For larger nets you must "rewind" to early-training weights instead of the init (L72–75; Frankle et al. 2019).
- Unstructured vs structured pruning (L38–41). Iterative magnitude pruning (L42–45).
- Learning curve: the train–validation gap = overfitting; a still-rising validation curve = more data would help (L158–163).
- Committee-of-experts analogy for ensembles (L425–432).
- Exercise ideas: 6-1 (checkpoint best model vs tune the number of epochs, L503–510); 5-2 (augmentation made MNIST worse, e.g. flips/rotations turn 6↔9, L230–235); 7-1 (Adam needs 2 extra states per parameter, L725–730).
- Multi-GPU decision rule (L709–721):
  - model fits on one GPU → data parallelism
  - doesn't fit → tensor (or model/pipeline) parallelism
  - in practice, combine data + tensor parallelism
- Randomness checklist (ch10): init, split, shuffle order, dropout masks, nondeterministic kernels, hardware, sampling at inference. Seed everything and turn on deterministic algorithms; keep dropout off at inference (L80–86, L115–119).
- Metric axioms (ch27, L271–275) and the counterexamples are a nice side-box on "why a loss need not be a distance".

**Numeric examples:**
- Dropout "typical p in 0.2–0.8" (ch10 L69–70); seed example 123 (L41).
- ch27, all recomputed with natural log:
  - SE triangle violation 0, 2, 1: 4 > 1+1 ✓ (L320–326)
  - H(0.9, 0.9) = 0.095 ✓; H(1, 0.5) = 0.693 ✓; H(0.5, 1) = 0 ✓
  - H(0.9, 0.5) = 0.624, H(0.9, 0.4) = 0.825, H(0.4, 0.5) = 0.277 ✓, but see error 1
- The lottery ticket "10 percent" (L54–55) is consistent with Frankle & Carbin (10–20% retained on MNIST/CIFAR-10).

**History, as stated:** lottery ticket: Frankle & Carbin 2018 (L13–14, arXiv 1803.03635); structured filter pruning: Li et al. 2016; Linear Mode Connectivity 2019; Ramanujan et al. 2020 (L102–115); distillation: Hinton, Vinyals & Dean 2015 (L524–526); grokking: Power et al. 2022; Kadra et al. 2021 "regularization cocktails" (L538–555); dropout: Srivastava et al. 2014 (ch10 L219–222); Adam: Kingma & Ba 2014; GPipe 2018; sequence parallelism: Li et al. 2022 (ch7 L736–749).

**Errors:**
1. **ch27 L373–380, CE triangle inequality.**
   - The book writes the inequality *backwards* ("H(r,p) ≥ H(r,q) + H(q,p)"). Its example actually **satisfies** the real triangle inequality: 0.624 ≤ 0.825 + 0.277 = 1.102.
   - A genuine counterexample: r = 1, q = 0.9, p = 0.1 gives H(r,p) = 2.303 > H(r,q) + H(q,p) = 0.105 + 2.072 = 2.178 (`s10b_checks.py`).
   - Also L310 "confirms the second criterion" with (y−ŷ)² = (ŷ−y)², which is symmetry; the book's numbering of the criteria is muddled.
2. **ch6 L348–351, early stopping "where training and validation accuracy are closest".** You stop at the best *validation* score (minimum validation loss). The smallest train–validation gap is often at the very start (underfitting).
3. **ch6 L531–535: "the lottery ticket hypothesis applies knowledge distillation".** It uses iterative magnitude pruning plus resetting to the initial weights (as ch4 itself says).
4. **ch4 L48–50: "not reinitialize … (as is typical for iterative magnitude pruning)".** Standard IMP (Han et al. 2015) *fine-tunes the trained surviving weights*. It does not re-randomize. What is new in the lottery ticket is rewinding to θ₀.
5. **ch6 L325–329: weight decay "has the same effect as L2 … subtle differences".** The difference is not subtle with Adam (see PDL error 9; AdamW). Equivalence holds for SGD with λ_wd = η·λ_L2.
6. **ch5 L160–163: "the slope … suggests the model is underfitting … more data can decrease both underfitting and overfitting".** More data reduces variance (overfitting). It does not fix high bias (underfitting): that needs a bigger or better model.
7. **ch7 L638–642: tensor parallelism "requires frequent synchronization of the model parameters".** What is exchanged are *activations* and partial results (all-reduce/all-gather inside each layer). Parameters are sharded, not synchronized.
8. **ch7 L653–656: pipeline "twist is that the gradients of the input tensor are passed backward".** Gradients flow backward in plain model parallelism too. The actual twist is splitting the minibatch into **micro-batches** so that stages overlap (GPipe). There is still an idle "bubble" of roughly (stages−1)/(micro-batches+stages−1).
9. **ch7 L761–764: "DeepSpeed stages 2 and 3 … combine data parallelism and tensor parallelism".** ZeRO stages 1/2/3 shard optimizer states, gradients and parameters *across data-parallel ranks* (sharded data parallelism, like FSDP). That is not tensor parallelism.
10. **ch7 L671–673: "more common to blend data + tensor parallelism instead of pipeline".** Large LLM training (Megatron-LM, GPT-3/LLaMA-scale) routinely uses 3D parallelism (DP + TP + PP); "instead of" overstates it.
11. **ch10 L121: FFT/Winograd convolutions called "approximations".**
    - They are mathematically exact; differences come only from floating-point rounding and non-associative summation order.
    - Missing sources of randomness: atomic-add GPU kernels (e.g. `index_add`/`scatter_add`, backward of some ops), data-loader worker order, augmentation RNG, and the need for `CUBLAS_WORKSPACE_CONFIG` alongside `use_deterministic_algorithms`.
12. **ch5 L212: "smaller batch sizes" listed as a data-side remedy without caveat.** The cited paper (He, Liu & Tao 2019) is about the *batch-size/LR ratio*, not the batch size alone.

---
## 3. MLSYS — AI Frameworks chapter (Reddi et al.)

**Order of topics:**
- history timeline, Fig 7.1 (L195–577)
- computational graph basics: z = x×y, Fig 7.3 (L694–848)
- static "define-then-run" (L852–900) vs dynamic "define-by-run" (L905–952); trade-offs, Table 7.1 (L954–1044)
- graph → reverse-mode autodiff (L1048–1074)
- autodiff of f(x) = x²·sin x (L1077–1123); forward mode / dual numbers (L1127–1313); reverse mode (L1315–1454)
- memory: stored activations (L1456–1515); checkpointing and fusion (L1517–1579)
- training loop zero_grad → forward → loss → backward → step (L1598–1618)
- memory "wave" during backward (L1694–1750)
- PyTorch tape (L1822–1840), TF1 `tf.gradients` (L1842–1947), JAX `grad`/`jacfwd`/`jacrev`/`vmap`/`jit` (L1949–2016)
- tensors and strides, Fig 7.9 (L2178–2372)
- execution models eager / graph / JIT, Table 7.2 (L2502–2855)
- data vs model parallelism, Figs 7.11–7.13 (L2857–3097)
- framework comparison, Table 7.3 (L3896–3927)

**Reusable points:**
- Main worked example: f(x) = x²·sin x at x = 2, with a = x², b = sin x, c = a·b.
  - Forward-mode pairs: x = (2, 1), a = (4, 4), b = (0.909, −0.416) (L1183–1216).
  - Reverse mode: dc/da = b, dc/db = a; dc/dx sums the two paths 2x·dc/da + cos x·dc/db (L1349–1373).
- Tiny net (L1410–1448): x = 1, w1 = 2, w2 = 3 → hidden 2 → ReLU 2 → output 6. Gradients: d_w2 = 2, d_w1 = 3, d_x = 6 (verified).
- PyTorch tape (L1858–1873): z = x·y, w = z+x, loss = w² at x = 2, y = 3. True values (not printed in the book): loss = 64, ∂L/∂x = 64, ∂L/∂y = 32. A good exercise.
- Rules of thumb:
  - Forward mode = one pass per *input*; reverse mode = one pass per *output*. For one scalar loss and millions of parameters, use reverse mode (L1231–1254, L1317–1321).
  - Autodiff cost is linear in the number of operations (L1066–1068).
  - Activations must be stored until backward, so memory grows linearly with depth. Peak memory comes at the start of backward ("wave", L1481–1485, L1736–1740). ReLU must remember its mask (L1718).
  - Gradient checkpointing keeps every k-th activation and recomputes the rest (L1546–1559).
- Figures worth recreating: Fig 7.5/7.6 (define-then-run vs define-by-run loop); Fig 7.9 (row- vs column-major strides of [[1,2,3],[4,5,6]]); Fig 7.11/7.12 (data vs model parallelism); Fig 7.13 (tensor vs pipeline split of Linear 4×4 → 4×2).
- "Autodiff was an engineering breakthrough, not a mathematical one" (L1659–1687).

**Numeric examples (book claims, mostly unsourced):**
- Hardware: A100 312 TFLOPS FP16, 1.6 TB/s vs CPU 1–2 TFLOPS (L469–472); TPU v4 275 TFLOPS BF16 (L503–516).
- Gradient accumulation: BERT-Large batch 256 = 8 steps, 99.5% of full-batch performance, 8× less memory (L1390–1401).
- Checkpointing: 50–80% less memory for 20–30% more compute (L1533).
- Interconnects: PCIe4 32 GB/s, NVLink 600 GB/s (L2360). Ring all-reduce at 85–95% efficiency (L3597–3599).
- A 7B model on 8 GPUs means 28 GB of FP32 gradients per step (L2431–2433).
- Static graphs 2–3× faster, XLA 3–10×, fusion 2–3× (L877, L1573, L1905).

**History, as stated:**
- Libraries: BLAS 1979, LAPACK 1992, NumPy 2006 (L261–293).
- Frameworks:
  - Theano 2007 (MILA), Torch "NYU 2002" (L321–346)
  - Caffe 2013, TensorFlow 2015 (from DistBelief; released 9 Nov 2015), Keras 2015 (L368–431, L3755)
  - PyTorch 2016 "introduced dynamic graphs", JAX 2018 (L404–440)
- Hardware: CUDA 2007, TPU 2016 (L458, L491).
- Autodiff: "Wengert 1964" (L1101).

**Errors:**
1. **L1196, L1216, L1370–1373: f′(2) = 2.805.**
   - Correct: 2·2·sin 2 + 4·cos 2 = 3.637 − 1.665 = **1.973** (Python).
   - The book's own intermediate expression "3.636 + (−0.416·4.0)" also gives 1.972. f(2) = 3.637 is correct.
2. **L1377–1380: "forward mode must track each new path, reverse handles all paths in one pass".**
   - Both modes handle all paths in one sweep. The difference is one forward sweep per input vs one reverse sweep per output.
   - Reverse mode costs a small constant (≈2–4×) times the forward pass, independent of the number of parameters (the "cheap gradient principle"; Baur–Strassen, Griewank).
3. **L1389–1401: gradient accumulation.**
   - The book mixes "accumulating contributions in backward" with micro-batch accumulation.
   - The compute overhead is ≈0, not 10–15%. Only *activation* memory shrinks 8×; weights and optimizer states do not.
4. **L1872–1873:** "dx/dloss" should be dloss/dx.
5. **L2433: "28 GB at 25 Gbps takes over 9 s".** It takes 8.96 s. A ring all-reduce actually moves 2(N−1)/N·28 ≈ 49 GB per GPU, which is ≈15.7 s.
6. **L2311: "100–500 GB/s on modern GPUs"** contradicts L471 (A100 is 1.6–2 TB/s).
7. **L3096:** the figure caption says tensor parallelism "replicates" layer parameters. Tensor parallelism *shards* them.
8. **L2324: "training typically requires float32".** Outdated: mixed precision with FP16/BF16 compute and FP32 master weights is standard.
9. **History.**
   - PyTorch was released publicly in Jan 2017, and dynamic graphs predate it (Chainer 2015, DyNet).
   - Torch (2002) came from IDIAP (Collobert et al.), not NYU.
   - Theano's first release was ~2008 (LISA lab).
   - Wengert 1964 is *forward* mode. Reverse mode traces to Linnainmaa 1970, and backprop for NNs to Rumelhart–Hinton–Williams 1986 (Werbos 1974).

---
## 4. MLSYS — AI Training chapter

This is a systems-level chapter. It has no material on loss functions (only `nn.CrossEntropyLoss()` at L1442), init, regularization or normalization. AdamW is named once (L72) and never explained. "Epoch" is never defined.

**Order of topics:**
- GPT-2 "lighthouse" box (L122–177) → computing eras, Table 8.1 (L272–439)
- layer equation A^(l) = f(W A^(l−1) + b) (L662); matrix ops (L685); attention FLOPs box (L709); activations from a systems view, Table 8.2 (L791–1020)
- **optimizers:** GD (L1069), SGD (L1112), mini-batch (L1141), momentum (L1197), RMSprop (L1211), Adam (L1226); memory trade-offs, Table 8.3 (L1250–1362); PyTorch loop (L1419); Adam step code (L1475); cosine schedule (L1526)
- backprop equations + activation memory (L1585–1717) → pipeline data → train → eval (L1804–2143) → batch size (L2561)
- prefetching (L2734); **mixed precision** + loss scaling (L3021–3185); **gradient accumulation and activation checkpointing** (L3333–3516); comparison Table 8.6 (L3698)
- when to go multi-node (L3758); data parallelism with proof (L4010–4069); model, pipeline and "operator-level" (= tensor) parallelism (L4391–4590); hybrid (L4681); decision flowchart Fig 8.17 (L4897); PyTorch DP/DDP (L4958)
- linear LR scaling and warm-up (L5259–5280); GPU generations (L5402); fallacies (L5696)

**Reusable points:**
- 4-step loop: `zero_grad` → forward + loss → `backward` → `step` (L1445–1462). `zero_grad` exists because `backward()` *accumulates* (L1464). The same fact explains gradient accumulation (loop with `loss/4`, L3539–3546).
- Update rules as printed:
  - momentum v ← βv + ∇L, θ ← θ − αv with β = 0.9–0.99 (L1202, PyTorch form)
  - RMSprop s ← γs + (1−γ)g², θ ← θ − αg/√(s+ε) (L1216)
  - Adam (L1229–1233; bias correction appears only in the code, L1501–1518, betas (0.9, 0.999), ε = 1e-8)
  - cosine schedule (L1571)
- Data-parallel equivalence: the average of per-GPU gradients equals the big-batch gradient (L4036–4069). It is the cleanest argument for "data parallelism = bigger batch".
- Figures worth recreating:
  - mixed-precision 7-step loop: FP32 master → FP16 copy → forward → loss scaling → backward → unscale/clip → update (Fig 8.9, L3058)
  - micro-batch gradient sum (Fig 8.10)
  - checkpoint/recompute graph (Fig 8.11)
  - GPipe forward/backward grid, 4 devices × 4 micro-batches (Fig 8.16)
  - parallelism decision flowchart (Fig 8.17)
  - overlapped load/compute timeline (Fig 8.7/8.8)
- Rules of thumb:
  - the slowest pipeline stage sets the throughput (L2067, L2140)
  - GPU utilization = R_pipeline/R_GPU, e.g. 200/1000 = 20% (L2157–2162)
  - optimize a single GPU before going distributed (L3864, L3906)
  - linear LR scaling: batch 512 → LR 0.1, 4096 → 0.8 (L5280) ✓

**Numeric examples (✓ = recomputed):**
- Adam on 100M FP32 params: +800 MB of state ✓ (L1239).
- FP16 range 6.10e-5…65,504, subnormal down to 6e-8 ✓ (L3104); loss scale 2^8–2^15 (L3124, L3214, L3296).
- 10⁹ params: 4 GB → 2 GB in FP16 ✓ (L3035).
- GPT-2 activations: 335 MB per layer ×48 = 32.6 GB ✓; checkpointing saves 75% at +33% compute (L1686–1704).
- Checkpointing saves 50–90% of memory for 15–30% extra compute (L3477).
- Data-parallel scaling: 7× on 8 GPUs; 45–50× on 64 GPUs (L4340). Efficiency 85–95% at 2–32 GPUs, 60–80% at 64–256, 40–60% beyond 512 (L3990).
- GPT-3: 175B params = 350 GB FP16 / 700 GB FP32 ✓; 6ND ≈ 3.15e23 FLOPs ✓; 355 V100-years ✓; 1,287 MWh (L493, L3775, L5320).
- Batch size by GPU (L5410–5419): V100/A100/H100 give 90/180/320 samples/s in FP32 and 220/450/820 in FP16 (useful for a "faster GPU, lower precision" table; the costs there are off, see below).
- Accumulating 4 steps cuts communication by 75%; perplexity 18.3 vs 18.2 (L3566–3573).

**History, as stated:**
- ENIAC 1945 (1946 in a footnote); AlexNet 2012 trained on two GTX 580s.
- Robbins–Monro 1951; backprop 1986.
- Mixed precision "NVIDIA 2018" (L1338); cosine annealing 2016; warm-up "from BERT 2018" (L5275).

**Errors (sub-agent read the whole chapter; key items re-checked in `s10b_checks.py`):**
1. **L1229–1233: Adam without bias correction.** The code applies it. The correct update is θ ← θ − α·m̂/(√v̂ + ε), with m̂ = m/(1−β₁ᵗ), v̂ = v/(1−β₂ᵗ). The RMSprop formula puts ε inside the root; PyTorch and Adam put it outside (minor).
2. **L1254–1256 / Table 8.3: memory "SGD 1×, momentum 2×, Adam 3×".** This omits the gradients. Counting params + grads + states gives **2× / 3× / 4×**. L1279 calls 24 GB "optimizer state", but m + v is 12 GB.
3. **L1284 / L3190–3205: mixed precision "cuts this to ~15 GB" / "2× memory savings".**
   - Standard mixed-precision Adam needs **16 B/param**: 2 (FP16 weights) + 2 (FP16 grads) + 4 (FP32 master) + 4 + 4 (m, v). For 1.5B params that is 24 GB, the same as pure FP32 model states (ZeRO paper).
   - The savings come from activations.
4. **L1542: `optim.Adam(weight_decay=1e-4)` presented without comment.** That is coupled L2, not decoupled weight decay; use AdamW.
5. **L1164, L1171, L2336: "Memory = B × (activations + gradients + parameters)", "doubling the batch doubles gradients".** Only activation memory scales with B.
6. **L3393, L3664–3668: with gradient accumulation, "scale the LR up 4×".** If the loss is averaged (`loss/4`, as their L3542 does), accumulation equals the big batch and the LR is unchanged.
7. **L129/L162: the GPT-2 1.5B shape "48 layers × 1280 hidden × 20 heads".** That gives ≈1.01B params. The real XL model is 48 × 1600 × 25 heads ≈ 1.56B ✓. The training times in the GPT-2 boxes (2 weeks on 32 V100 / 25 h on 1 GPU / 14 days on 8 V100) contradict each other.
8. **L731–734: the attention box says 9.8 TFLOP at 125 TFLOPS takes "79 s".** It takes **0.078 s**.
9. **L3771: "10–20B params fit on one GPU".** With Adam at 16 B/param, 80 GB holds ≤5B params before any activations.
10. **L4258–4313, the "121% superlinear" scaling claim from 1 → 8 GPUs.** The per-GPU batch is unchanged, so the claim is unfounded; the same box later says 97%.
11. **L485, L3967: "all-reduce cost scales O(n)".** Ring all-reduce traffic per GPU is 2N(D−1)/D, ≈ constant in D; only latency grows. L4181: a ring needs 2(n−1) = 14 steps on 8 GPUs, not 7.
12. **L4669: pipeline bubble.** It is ≈(m−1)/(b+m−1) of the time (m stages, b micro-batches), a fraction covering fill + drain.
13. **L2566, L3150, L3478: "larger batches → faster convergence".**
    - True per *step*, not per *sample*: returns diminish beyond the critical batch size.
    - Very large batches need LR scaling + warm-up, and can generalize worse. The book concedes this only at L5268.
14. **L3043: "bf16 has 3–4 decimal digits".** bf16 has an 8-bit significand, about 2.4 digits. L1340: FP32 is kept for the master weights, not "for loss scaling" (Micikevicius et al. 2017). L5275: warm-up predates BERT (Goyal et al. 2017; Transformer 2017).
15. **L5417–5419:** all three GPU cost figures are 1.25× too high (V100: 14 d × 8 × $3.06 = $8,225, not $10,252).

---
## 5. ESL (Hastie–Tibshirani–Friedman, §11.4–11.5)

**Order of topics:**
- parameter set θ: α (M(p+1) weights), β (K(M+1)) (L12–19)
- losses: SSE (11.9), cross-entropy/deviance (11.10); softmax + CE = logistic regression in the hidden units (L21–41)
- "we don't want the global minimizer": penalty or early stopping (L42–45)
- backprop for squared error, eqs 11.11–11.15 (L53–118)
- delta rule, locality, batch vs online, epoch (L121–136)
- LR and Robbins–Monro conditions (L137–143)
- backprop "slow", so conjugate gradient / variable metric preferred (L144–149)
- §11.5.1 starting values (L160–171)
- §11.5.2 early stopping + weight decay (11.16), weight elimination (11.17), Fig 11.4/11.5 (L174–212, L412–497)
- §11.5.3 standardize inputs; uniform [−0.7, 0.7] start (L215–216, L500–504)
- §11.5.4 hidden units 5–100, "better too many + regularize" (L507–522)
- §11.5.5 multiple minima: several starts, average *predictions*, not weights; bagging (L525–537)
- §11.6 simulated data (L540–572)

**Reusable points:**
- Backprop "errors" (L94–118):
  - δ_ki = −2(y_ik − f_k)g′_k(β_kᵀz_i) at the output
  - s_mi = σ′(α_mᵀx_i) Σ_k β_km δ_ki at the hidden layer (11.15)
  - gradients δ_ki·z_mi and s_mi·x_iℓ (11.14)
  - The cleanest compact statement for the chapter: forward pass, then backward pass, using only local quantities (L125–128).
- Init near zero puts the sigmoid in its linear regime, so the net starts ≈ linear and becomes nonlinear as weights grow (L161–168). Exact zeros mean perfect symmetry and "the algorithm never moves"; large weights give poor solutions (L168–171).
- Early stopping acts as shrinkage toward the linear model (L178–181). Weight decay is analogous to ridge (L183–185).
- Standardize inputs so that the penalty treats all inputs equally (L500–503).
- Average predictions of nets from several random starts (Ripley 1996), not their weights, because of nonlinearity (L530–535). This links to ensembles and the permutation symmetry of hidden units.
- Online learning: γ_r → 0, Σγ_r = ∞, Σγ_r² < ∞ (e.g. γ_r = 1/r), the Robbins–Monro 1951 justification for LR decay (L139–143).

**Numeric examples:**
- Fig 11.4 (mixture data, 10 hidden units, softmax + CE; L303–310, L399–407):

  | | training error | test error |
  |---|---|---|
  | no weight decay | 0.100 | 0.259 |
  | weight decay 0.02 | 0.160 | 0.223 |

  Bayes error 0.210. A clean "train error up, test error down" pair for the regularization step.
- §11.6 (L541–572): sum of sigmoids with a1 = (3,3), a2 = (3,−3), SNR = 4, n_train = 100, n_test = 10,000, 10 random starts. The 2-unit net is best, but 2 of the 10 starts were no better than linear regression.
- Start weights U[−0.7, 0.7] (L504); hidden units "5 to 100" (L512–513).

**History, as stated:** Widrow & Hoff 1960 "delta rule" (L122); Robbins & Monro 1951 (L141); Ripley 1996 (L533).

**Errors:**
1. **L193: "add terms 2β_km and 2α_mℓ to the gradient".** The penalty is λJ(θ), so the terms are **2λβ_km and 2λα_mℓ**: λ is missing.
2. **L144–149: "back-propagation can be very slow … not the method of choice; conjugate gradients / variable metric are better".**
   - This conflates backprop (gradient computation) with gradient descent (the optimizer); L46–47 also calls GD itself "back-propagation".
   - Every method listed still uses backprop for the gradients.
   - The advice is dated (2009): for deep nets, minibatch SGD/Adam is the method of choice and quasi-Newton is rarely used.
3. **L121–122: backprop "has also been called the delta rule (Widrow and Hoff, 1960)".** Widrow–Hoff's delta (LMS) rule is the single-layer case. Backprop is the *generalized* delta rule (Rumelhart et al. 1986).
4. **(11.12), L66–73:** g′_k(β_kᵀz_i) treats each output as depending only on its own T_k (and omits β_0k). With the softmax output (which ESL itself recommends for classification), g_k depends on all T, so a Jacobian sum is needed. For softmax + CE the combination simplifies to δ = f − y, which is worth stating.
5. Dated rules of thumb: U[−0.7, 0.7] init and 5–100 hidden units are fine for 1-hidden-layer sigmoid nets but not for deep ReLU nets (use He/Glorot scaling by fan-in).
