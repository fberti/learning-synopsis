# Ch10 source digest A — MDL (Kneusel, Math for Deep Learning) + DLV (Glassner, Deep Learning: A Visual Approach)

Extracts are in `_parts/src/`. `L123` = line number in the named file (original `pdftotext -layout` numbering).
- `MDL10_ch7_8.txt` = MDL ch7 (differential calculus) + ch8 (matrix calculus); `MDL10_ch10.txt` = ch10 backprop; `MDL10_ch11.txt` = ch11 gradient descent
- `DLV10_ch9.txt` = overfitting/underfitting; `DLV10_ch14.txt` = backprop; `DLV10_ch15.txt` = optimizers + dropout + batchnorm
- `DLV10_extra.txt` = DLV p355 (init, ch13), p504–506 (ch17 MNIST convnet with dropout), p582–584 (ch19 vanishing/exploding), p285 (ch10 data augmentation)
- MDL equations are images (absent from the txt). Renders used to check them: `src/img/mdl7-*.png`, `mdl10-*.png`, `mdl11-*.png`
- Checks: `_parts/calc/s10_verify.py` (`uv run -q --with numpy --with scipy python -I`)

**Not covered by these sources** (mark as "Kiegészítés"):
- softmax + cross-entropy gradient (p − y). DLV only says "we almost always use cross entropy" (ch14 L476); both books do the math with MSE.
- Xavier/He formulas (Var = 2/(n_in+n_out), 2/n_in). DLV only lists the names (extra L82–90).
- Vanishing gradients in deep sigmoid MLPs (σ′ ≤ 0.25). MDL hints at it (ch11 L264–268); DLV covers it only for RNNs.
- Gradient clipping.
- Formulas for L2 / weight decay. DLV9 has only the idea plus λ; neither book mentions AdamW.
- Inverted-dropout scaling (÷(1−p)).
- The batchnorm formula, running statistics at inference, layer norm (DLV9 L340 just names it).
- LR warmup, cosine and step-decay formulas (DLV shows only the curve shapes).
- Early-stopping "patience" (DLV9 L274–277 only hints) and restoring the best weights.
- Batch size ↔ LR scaling.
- Forward vs reverse mode autodiff.
- Gradient checking. Implicitly, MDL's by-hand eqs, which I checked by finite differences.
- **A numeric backprop trace.** MDL's "Backpropagation by Hand" is symbolic only; no weights are given. Use the example built and verified below.

---
## 1. MDL (Kneusel, Math for Deep Learning, ch7–8, 10, 11)

**Order of topics:**
- **ch7:**
  - derivative as the limit of the secant slope (L80–167)
  - rules; **chain rule** with 3 worked examples (L229–288)
  - partial derivatives (L546–613)
  - **multivariable chain rule** (L615–646)
  - gradient, directional derivative, "the gradient = direction of maximal change" (L649–750)
- **ch8:**
  - numerator vs denominator layout (L902–910)
  - scalar-by-vector chain rule example g = x0 + x1x2, f = g² (L1094–1116)
  - Jacobian = stack of gradients (L1239–1262)
  - Hessian/Newton, and why DL uses first-order methods (L1597–1763)
  - Jacobian of element-wise ops = I / diag (L1768–1792)
  - ReLU-neuron derivative ∂y/∂w = xᵀ or 0 (L1793–1846)
- **ch10:**
  - backprop ≠ gradient descent (L49–56)
  - **2-2-1 network by hand** (L71–193)
  - nn_by_hand.py on iris (L195–425)
  - matrix backprop: Eq 10.9–10.14 (L428–613)
  - Keras-style NN.py classes (L620–815)
  - MNIST (L817–929)
  - computational graphs (L931–1031)
- **ch11:**
  - 1D GD (L36–132); 2D GD and the "canyon" (L134–268)
  - two-well function (L270–337)
  - SGD/minibatch rationale (L340–439)
  - momentum (L442–665)
  - FMNIST momentum experiment with statistics (L666–834)
  - Nesterov (L838–903)
  - RMSprop / Adagrad / Adadelta / Adam (L906–1014)
  - optimizer experiment (L1016–1038)

**Reusable points:**
- Terminology box (ch10 L49–56): backprop computes ∂L/∂w; gradient descent uses it. People say "backprop" for the whole training process.
- σ′ = σ(1−σ), derived by the "add and subtract 1" trick (render mdl10-306). It is reused from the forward pass, so nothing is recomputed (L136–143).
- Two layer types (ch10 L463–479, L519–579), which make a clean two-rule summary:
  - activation layer: ∂E/∂x = ∂E/∂y ⊙ σ′(x)
  - FC layer: ∂E/∂x = Wᵀ ∂E/∂y, ∂E/∂W = ∂E/∂y · xᵀ (outer product), ∂E/∂b = ∂E/∂y
  - Shape check: W is n×m, so Wᵀ is m×n and ∂E/∂W is n×m (L540–551, L574–579).
- The 3-step algorithm (L508–514): forward pass storing each layer's input; dE/dh at the output; walk the layers in reverse.
- Accumulate ΔW over the minibatch, then W ← W − η·ΔW/m (L584–613).
- Computational graph of y = mx+b (Fig 10-3) and of y = σ(Wx+b) forward/backward (Fig 10-4, from the TensorFlow whitepaper, L984–1025). Notes:
  - b has no arrow into the backward matmul node, because ∂y/∂b does not depend on b
  - "each op knows its own local derivative + chain rule = autodiff" (L972–983)
  - worth recreating as a widget
- 1D GD demo f(x) = 6x²−12x+3 (L37–132): good widget material.
  - η = 0.03 from x = −0.9 converges smoothly
  - η = 0.15 from 0.75 oscillates
  - Rule: step ∝ derivative, so steps shrink near the minimum (L100–107).
- "Canyon" f = 6x²+40y²−12x−30y+3 (L234–268): zig-zag across the canyon, crawl along it. Leads straight into momentum / adaptive methods.
- Two-well function f = −2e^{−½((x+1)²+(y−1)²)} − e^{−½((x−1)²+(y+1)²)} (L273–337): the outcome depends on the starting point (initialization).
- Why minibatches (L420–436):
  - full batch costs too much
  - the minibatch gradient is a noisy but unbiased estimate
  - the noise may escape bad minima
  - it simply works
- Rules of thumb:
  - batch 16–128, powers of 2 (ch10 L790–793)
  - larger batch means fewer steps per epoch, so more epochs are needed (ch11 L415–419)
- Momentum: v ← μv − η∇f, x ← x + v (render mdl11-349). μ = 0.9 typical; μ = 0 gives vanilla GD (L484–492).
- Nesterov: the gradient is taken at x + μv (render mdl11-361). Goodfellow's caveat: with minibatch noise it is rarely better (L860–867).
- The book's update rules (renders mdl11-365/366/367); pitfalls are in Errors:
  - RMSprop: m ← γm + (1−γ)g², x ← x − η/√m · g, γ = 0.9 (Hinton)
  - Adagrad: per component, divide by √(Σ_τ g²)
  - Adam: m, v, bias correction m̂ = m/(1−β1ᵗ), v̂ = v/(1−β2ᵗ), x ← x − η m̂/(√v̂ + ε)
  - defaults β1 = 0.9, β2 = 0.999, ε = 1e−8; Keras η = 0.001 (L1006–1010)
- Why not Newton (ch8 L1729–1753): the Hessian is k×k with k in the millions; inverting it is O(k³). Doubling k costs 8×.
- Statistics lesson (ch11 L734–796): training is stochastic, so compare optimizers over many runs. The book uses a t-test, Mann–Whitney U and Cohen's d. This links to the statistics chapters.

**Numeric examples (all checked in Python):**
- **ch7 chain rule** (renders mdl7-216/217/233/234), all correct:
  - d/dx (x²+2x+3)² = 4(x+1)(x²+2x+3)
  - d/dx [2(4x−5)²+3] = 16(4x−5); cross-checked by expanding to 32x²−80x+53 → 64x−80
  - d/dx 1/(3x²) = −2/(3x³)
  - f = x³+y³ with x = 3r+2s, y = r²−3s: ∂f/∂r = 9x²+6y²r, ∂f/∂s = 6x²−9y²
- **Gradient example** (L739–749): f = x²+xy+y² at (0.5, −0.4) gives f = 0.21, ∇f = (0.6, −0.3), |∇f| = √0.45 = 0.6708. Correct.
- **Backprop by hand: the book's setup** (Fig 10-1, Eq 10.1–10.8, renders mdl10-304…308):
  - network: inputs x0, x1; sigmoid hidden units a0, a1; linear output a2 = w4a0 + w5a1 + b2
  - wiring: z0 = w0x0 + w2x1 + b0, z1 = w1x0 + w3x1 + b1
  - loss: L = ½(y−a2)²
  - gradients:
    - ∂L/∂a2 = a2−y
    - ∂L/∂w5 = (a2−y)a1, ∂L/∂w4 = (a2−y)a0, ∂L/∂b2 = a2−y
    - ∂L/∂b1 = (a2−y)w5a1(1−a1), and ×x0 for w1, ×x1 for w3
    - ∂L/∂b0 = (a2−y)w4a0(1−a0), and ×x0 for w0, ×x1 for w2
  - **All 9 match finite differences.**
  - The book gives **no numeric weights**. Its only numbers:
    - η = 0.1, 1000 epochs, full-batch average
    - biases 0; weights 0.0001·(U−0.5), i.e. in [−5e−5, 5e−5]
    - iris classes 0/1, first 2 features; 70 train / 30 test
    - test confusion before training TN 15, FP 0, FN 15, TP 0 (50%); after TN 14, FP 1, FN 1, TP 14 = 28/30 = 93.3% (L389–418)
    - NN.py version: 29/30 = 96.7% (L923–924)
- **Ready-made numeric trace for the chapter** (my own; verified, including one update step):
  - inputs and weights:
    - x = (1, 0.5), y = 1
    - w0 = 0.2, w1 = −0.3, w2 = 0.4, w3 = 0.1, w4 = 0.5, w5 = −0.4, b = 0
  - forward pass:
    - z0 = 0.4 → a0 = 0.5987; z1 = −0.25 → a1 = 0.4378
    - a2 = 0.1242, L = 0.3835
    - σ′: 0.2403, 0.2461
  - gradients:
    - b2: −0.87579; w4: −0.52432; w5: −0.38344
    - b1 = w1: 0.08622; w3: 0.04311
    - b0 = w0: −0.10521; w2: −0.05260
  - after one step with η = 0.1: w4 = 0.55243, w5 = −0.36166, b2 = 0.08758; L drops to **0.2702**
- **MNIST with NN.py** (L839–913):
  - 14×14 = 196 inputs → 100 → 50 → 10, sigmoid everywhere, MSE loss
  - **25,260 parameters** (my count; the book gives none)
  - init U[−0.5, 0.5]; minibatch 64, 40,000 minibatches (= 2.56 M samples ≈ 42.7 epochs); η = 1.0; ~17 min on an i5
  - accuracy **0.972**: the matrix diagonal = 9720/10000
  - row sums equal the true MNIST test class counts (980, 1135, …)
  - largest confusions: 7→2 (19) and 4→9 (15). All correct.
- **1D GD** (L62–112):
  - η = 0.03 from −0.9: the contraction factor 1−12η = 0.64
  - η = 0.15 from 0.75: factor −0.8 → 1.2, 0.84, 1.128, 0.898, …
  - divergence threshold η > 1/6 (my addition); e.g. η = 0.2 has factor −1.4
- **Momentum 1D** (L514–530): x = 0.75, η = 0.09, μ = 0.8 → 1.02, 1.214, 1.138, 0.928, 0.838, …, and 1.0002 after 50 steps (damped oscillation, as described).
- **2D GD:**
  - bowl minimum (1, 7/9 = 0.7778) (L179), start (−0.5, 2.9), η = 0.02, 12 steps (L207–218); other starts (1.5, −0.8), (2.7, 2.3)
  - canyon minimum (1, 0.375), starts (−0.5, 2.3) with η = 0.02 and (2.3, 2.3) with η = 0.01 (L240–242)
  - factors: y −0.6 (zig-zag), x 0.76; at η = 0.01, y 0.2 and x 0.88 (slow crawl)
- **Two wells** (Table 11-1, η = 0.4): reproduced.
  - (−1.5, 1.2)/9 steps, (0, 0)/20 and (1.5, 1.5)/30 reach the deep well
  - (1.5, −1.8)/9 and (0.7, −0.2)/20 reach the shallow well
  - **Momentum runs** (Listing 11-3): (0.7, −0.2) with η = 0.1, μ = 0.9, 25 steps; (1.5, 1.5) with η = 0.02, μ = 0.9, 90 steps.
- **Table 11-2** reproduced exactly with the book's code:
  - standard (−0.9496, 0.9809) / (0.8807, −0.9063)
  - Nesterov (−0.9718, 0.9813) / (0.9128, −0.9181)
  - Errors 4–5 below explain why its conclusion is shaky.
- **FMNIST** (L693–732), same 196-100-50-10 net:
  - no momentum (η = 1.0): acc **0.8721**, MCC **0.8584048**
  - momentum 0.9 with η = 0.2: acc **0.8773**, MCC **0.8638721**
  - both recomputed exactly from the printed matrices (Gorodkin multiclass MCC); every row sums to 1000
- **22 runs each** (L762–767):
  - MCC 0.85778 ± 0.00056 vs 0.86413 ± 0.00075 (mean ± SEM)
  - t = 6.774: recomputed 6.78 from the rounded means; p = 3.06e−8 (df = 42) ✓
  - Cohen's d = 2.042: recomputed 2.05 ✓
  - Mann–Whitney U = 41, p = 1.26e−6: this is the **one-sided** p with continuity correction (old SciPy default); two-sided is 2.5e−6
  - 100 runs at 10,000 minibatches: peak near MCC 0.83, second bump near 0.75, long left tail (L799–821)
- **Optimizer experiment** (Fig 11-11, read from render mdl11-369): small CNN, MNIST 16,384 training samples, batch 128, 12 epochs, 5 runs, CPU.

  | optimizer | accuracy | time |
  |---|---|---|
  | SGD | ≈98.01% | ≈279.8 s |
  | RMSprop | ≈98.02% (wide error bar) | ≈286.3 s |
  | AdaGrad | ≈98.52% | ≈286.1 s |
  | Adam | ≈98.56% | ≈291.1 s |

  Matches the text: "SGD and RMSprop about 0.5 percent less accurate". It is 0.5 percentage points.

**History, as stated:**
- Newton/Leibniz (ch7 L7–8); notation from Lagrange, Leibniz and Newton (L113–124)
- backprop: "Rumelhart, Hinton, and Williams introduced backpropagation … 1986" (ch10 L57–58)
- RMSprop: Hinton, 2012 Coursera lecture (L915–916)
- Adagrad: Duchi et al., JMLR 2011 (L953–955); Adadelta: Zeiler 2012 (L975–976)
- Adam: Kingma & Ba 2015, "cited over 66,000 times" (L987–988)
- TensorFlow whitepaper "2015" (L985–987); Fashion-MNIST: Xiao et al. 2017 (L670–672)

**Errors:**
1. **ch10 L57–58: backprop "introduced" by Rumelhart–Hinton–Williams 1986.** They popularized it for neural nets. Reverse-mode differentiation dates to Linnainmaa (1970), and Werbos applied it to neural nets (1974/1982).
2. **ch11 L1000–1002 + Eq 11.10 (render mdl11-367):**
   - "t, an integer starting at zero" is wrong: with t = 0, 1−βᵗ = 0, so m̂ and v̂ divide by zero. t starts at 1.
   - Same equation has a typo: **v̂ ← b/(1−β2ᵗ)** should be v/(1−β2ᵗ).
   - Without bias correction, the first Adam step is ≈3.16·η instead of η (checked).
3. **Eq 11.7–11.9 (renders mdl11-365/366): RMSprop and Adagrad are written without ε**, giving 0/0 when the gradient history is 0. In practice it is √(m)+ε (or √(m+ε)), and every library has an ε. Adam is written correctly with ε outside the root.
4. **ch11 L882–883: Nesterov code uses `dx(x + mu*vx, y)` and `dy(x, y + mu*vy)`.**
   - The look-ahead must shift both coordinates: ∇f(x + μv).
   - Table 11-2's Nesterov numbers come from this buggy code (I reproduced them exactly).
   - Correct Nesterov gives (−0.9717, 0.9804) and (0.8990, −0.8983).
5. **Table 11-2 L896–903: the "known minima" (−1, 1) and (1, −1) are wrong**, because the wells overlap.
   - The true minima are (−0.9804, 0.9804), f = −2.0190, and (0.894, −0.894), f = −1.0442. L278 also says "minimum value of −2 / −1".
   - Measured against the true minimum at start (0.7, −0.2): standard momentum is *closer* (0.018) than the book's Nesterov (0.031).
   - So "Nesterov results are closer" holds only for the (1.5, 1.5) start, or for correct Nesterov.
6. **ch11 L455–464: the momentum physics analogy is garbled** ("position is the function value, time is the argument; velocity = ∂f/∂x"). In the heavy-ball picture:
   - position = parameters x
   - velocity = v (the update)
   - force = −∇f
   - μ = friction/damping (not "mass")
7. **ch11 L713–717: "add momentum and reduce η to 0.2 so we aren't taking large steps".**
   - The steady-state step with μ = 0.9 is η/(1−μ) = **2.0**, twice the no-momentum η = 1.0.
   - So the FMNIST comparison changes the effective step size too; it is not a controlled test.
   - Useful rule for the chapter: momentum multiplies the effective step by 1/(1−μ) = 10.
8. **ch11 L229–233: "If the function has a single minimum, gradient descent will eventually find it … if the step is too large it may oscillate."**
   - It can **diverge**: for 6x²−12x+3, any η > 1/6 diverges.
   - Convergence also assumes a smooth, convex function.
9. **ch11 L936: "RMSprop is a robust classifier".** It is an optimizer.
10. **ch11 L100–102: "After 14 steps … x = 0.997648".** That value is after 15 updates; after 14 it is 0.996325 (off by one).
11. **ch8 L1742: "The Hessian is a k×k symmetric and positive definite matrix".** It is symmetric but not generally PD; the book itself says so 10 lines earlier (L1729–1733) near saddle points.
12. **Layout switch:**
    - ch8 declares numerator layout (L907–909), but ch10 Eq 10.11 uses denominator layout (render mdl10-318: "∂(Wx+b)/∂x = Wᵀ (denominator layout)").
    - Eq 10.10's middle line has a typo: [∂y0/∂x0 σ′(x0) …] should be [∂E/∂y0 σ′(x0) …].
    - Element-wise product is ⊗ in ch8 (L1790) but ⊙ in ch10.
13. **ch10 L966–970 / L925–927: outdated or overstated toolkit claims.**
    - "TensorFlow uses … a static graph": TF 2 (2019) runs eagerly by default.
    - "Modern toolkits don't use these approaches": the per-layer forward/backward with stored inputs *is* reverse-mode autodiff, just at a coarser granularity.
14. **Minor:**
    - ch11 L321–326: "most minima are about equally good" is stated as fact; it is a conjecture. Saddle points are the bigger issue, as DLV notes.
    - ch8 L1813–1818: ReLU′(0) := 0 is a convention (a subgradient), not a derivative.
    - ch11 L987: Adam is arXiv 2014 / ICLR 2015.

**Exercise / quiz ideas:**
- Fill in the 9 partials of the 2-2-1 net, using the trace above.
- Shape check: W is 100×196, so what shape are ∂E/∂W and Wᵀδ?
- 1D GD: for which η does 6x²−12x+3 oscillate or diverge (1/12 < η < 1/6 oscillates, η > 1/6 diverges)?
- Effective step with momentum: η/(1−μ).
- Adam with t = 0: what breaks?
- Count the parameters of 196-100-50-10 (25,260).

---
## 2. DLV (Glassner, Deep Learning: A Visual Approach, ch9, 14, 15 + extras)

**Order of topics:**
- **ch14:**
  - error/loss as a penalty; "carve the elephant by chipping away" (L34–110)
  - a "slow way": random single-weight perturbation (L123–169)
  - gradient tells the direction, so do all weights at once (L173–236)
  - backprop vs the update step (L239–248)
  - activations ignored (L249–254)
  - a **delta = sensitivity of the error to a neuron's output** (L255–311)
  - tiny 2-2-2 net, neurons A, B, C, D (L363–449)
  - output deltas from the error curve (L450–705)
  - weight update AC ← AC − Ao·Cδ (L707–790)
  - hidden deltas Aδ = AC·Cδ + AD·Dδ (L795–1025)
  - larger net 2-2-4-3-2 (L1035–1215)
  - learning rate (L1218–1282)
  - moons experiment (L1286–1517)
- **ch15:**
  - error curve (L23–76); LR range and the metal-detector analogy (L79–136)
  - constant η bouncing (L137–291)
  - exponential decay (L293–353); schedules incl. bold driver (L354–479)
  - batch / SGD / mini-batch on moons (L482–737)
  - momentum (L778–970); Nesterov (L972–1087)
  - Adagrad (L1089–1143); Adadelta/RMSprop (L1146–1213); Adam (L1215–1251)
  - choosing an optimizer, No Free Lunch (L1254–1309)
  - regularization (L1312–1321); dropout (L1323–1390); batchnorm (L1392–1437)
- **ch9:**
  - overfitting via a wedding-names metaphor (L31–94); underfitting (L96–106)
  - validation curves (L109–133); tempo curve: over / under / just right (L134–213)
  - outlier boundary (L214–236); early stopping (L240–277)
  - regularization: the turkey-in-foil analogy, λ (L279–343)
  - bias–variance via 50 subsamples (L346–580); Bayesian line fit (L586–810)

**Reusable points (analogies, figures):**
- **Delta as an "amplifier"** (Fig 14-7/14-10): change in error = change in output × δ. Great for the "what is a partial derivative" intuition, before any formulas.
- **Two-way arrows** (Fig 14-20/14-21): the same weight multiplies the output going right and the delta going left. Forward = weighted sum of inputs; backward = weighted sum of following deltas. This symmetry is why backward costs about as much as forward (L1012–1016). Strong figure to recreate.
- Hidden delta = sum over all paths (Fig 14-18/14-19): Aδ = AC·Cδ + AD·Dδ. This is the multivariable chain rule in pictures, and pairs with MDL ch7 L615–646.
- "If it ain't broke don't fix it" random perturbation (L123–161): the baseline that motivates gradients ("half our guesses go the wrong way").
- "Backprop propagates the gradient, not the error" (L1533–1538).
- **Metal detector on a beach** = big steps first, then small (ch15 L89–98).
- **Ball rolling** for momentum (L793–831): crosses plateaus; too much momentum flies out of the bowl (L906–911).
- **Nesterov = "gradient from the future"** (L973–996).
- Decay schedule panels (Fig 15-17), worth recreating as a widget:
  - (a) exponential per epoch
  - (b) delayed exponential
  - (c) interval/step every 4 epochs
  - (d) error-based (= ReduceLROnPlateau)
- Bold driver (L449–456): if the loss falls, raise η by 1–5%; if it rises, halve η.
- Online vs offline (L579–582, L651–654): SGD is online, batch GD is offline.
- Rules of thumb:
  - η often 0.01–0.0001 (ch15 L82); start around 0.001 (ch14 L1273–1278)
  - momentum γ ≈ 0.9 (L928–930); Adadelta/RMSprop γ ≈ 0.9 (L1197, L1212–1213)
  - Adam β1 = 0.9, β2 = 0.999 (L1249–1251); "start with Adam defaults" (L1308)
  - mini-batch a power of 2 in 32–256 (L676)
- No Free Lunch: no optimizer is best everywhere (L1287–1298).
- Dropout is an "accessory layer": it is not counted as a layer and is active only in training (L1324–1336). Rationale: stops a single neuron over-specializing ("cat-eye detector", L1374–1390).
- Batchnorm (L1393–1434):
  - per mini-batch, shifts/scales a layer's outputs toward 0
  - learned scale/shift; placed before the activation (Fig 15-42)
- ch9 metaphors: wedding names (Walter = walrus mustache) for overfitting; turkey in foil = regularization delays the onset of overfitting.
- Early stopping at the validation-error minimum (Fig 9-1, ~epoch 28, L262–270). Noisy curves need smoothing / patience (L271–277).
- **Bias–variance experiment** (L428–509): 50 subsamples of 30 points, simple vs wiggly fits, overlaid. Good widget idea, but fix the definition (see Errors).
- Data augmentation (extra L398–409): from 6 husky photos, random shift ≤10%, rotation ≤5°, optional horizontal flip → 4,000 training images.

**Numeric examples (checked in Python):**
- **Fig 14-1:** softmax outputs 0.35, 0.2, 0.15, 0.1, 0.2 (sum 1); predicted class 1, label 3.
- **Error-curve deltas** (L505–593):
  - P1 = −1, error 4, slope −4 → Cδ = −4
  - +0.5 → predicted −2; +0.01 → −0.04; −0.1 → +0.4
  - Fig 14-10: Cm = 1/4 → Em = −1, new error 4 + (−1) = 3
  - The curve is exactly E = (P1−1)²: E(−1) = 4, E′(−1) = −4, E(0) = 1 ("really about 1") ✓. Linear prediction at −0.5 is 2.0 vs a true 2.25, which illustrates "small steps only".
  - Fig 14-11: Cδ ≈ −1.5/0.5 = −3, Dδ ≈ (−1.25)/(−0.5) = 2.5.
- **Moons classifier** (L1286–1447):
  - ~1,500 points; network 2-4-4-1, ReLU hidden, sigmoid output
  - weights 2·4 + 4·4 + 4 = 28, plus 9 biases = **37** ✓
  - η = 0.5: everything in one class, accuracy ≈ 0.5, one output weight oscillating
  - η = 0.05: 100% train and test after ~16 epochs (really ~10); under 10 s on a 2014 iMac
  - η = 0.01: ~90% plateau, then 100% around epoch 170 (saddle/plateau; Dauphin 2014)
- **ch15 decay:** 0.1 → 0.099 → 0.09801 ✓. Text says start at 1/8 with decay 0.8; Fig 15-15 title says "η starts at 0.25".
- Constant-η panels: 0.025, 0.05, 0.1 (Fig 15-11), 0.5, 0.75, 1.0 (Fig 15-12), main η = 1/8.
- **Moons-300 optimizer study** (L486–1251):
  - 300 points (150 + 150); net 2 → 12 → 13 → 13 → 2, ReLU + softmax (415 parameters, my count); constant η = 0.01
  - epochs to ~0 error and updates (300×400 = 120,000 ✓ = 6×; ceil(300/32) = 10 batches/epoch ✓):

    | method | epochs to ~0 error | updates |
    |---|---|---|
    | batch GD | ~20,000 | 20,000 |
    | SGD (batch 1) | ~400 (spike to ~1 at epoch ~225) | 120,000 |
    | mini-batch 32 | ~5,000 | 50,000 |
    | + momentum | ~600 | |
    | + Nesterov | ~425 (caption says ~600) | |
    | Adagrad | ~8,000 | |
    | Adadelta | ~2,500 | |
    | Adam | ~900 | |

  - Winner here: SGD + Nesterov, then Adam (L1275–1277).
  - Momentum figures use γ = 0.7 (L930).
- **Vanishing/exploding** (extra L289–305): shrinking 60% per step → 0.4⁸ = 0.00066 (< 1/1000 ✓); growing 60% → 1.6⁸ = 42.9 ("almost 43" ✓).
- **ch17 MNIST convnet** (extra L97–215):
  - 28×28×1 → conv 32@3×3 → 26×26×32 → conv 64@3×3 → 24×24×64 → maxpool 2×2 → 12×12×64 → dropout 0.25 → flatten 9,216 → dense 128 → dropout 0.25 → dense 10 + softmax
  - 12 epochs, ~99% train and validation
  - Parameters (my count): 320 + 18,496 + 1,179,776 + 1,290 = **1,199,882**
- **ch9:** early stop ~epoch 28 (Fig 9-7); 50 subsets × 30 points without replacement (L428–429).
- **Dropout figure:** 50% of 4 neurons (Fig 15-41).

**History, as stated:**
- ch15:
  - momentum "(Qian 1999)" (L826); Nesterov 1983 (L1046)
  - Adagrad: Duchi, Hazan & Singer 2011 (L1098); Adadelta: Zeiler 2012 (L1163)
  - RMSprop "(Hinton, Srivastava, and Swersky 2015)" (L1204–1205); Adam: Kingma & Ba 2015 (L1230)
  - dropout: Srivastava et al. 2014 (L1325); batchnorm: Ioffe & Szegedy 2015 (L1394)
  - NFL: Wolpert 1996, Wolpert & Macready 1997 (L1293); decay schedules: Bengio 2012 (L360); bold driver: Orr 1999 (L450)
- Other chapters:
  - saddles: Dauphin et al. 2014 (ch14 L1486)
  - init: LeCun 1998, Glorot & Bengio 2010, He 2015 (extra L82–88)
  - vanishing gradients: Hochreiter et al. 2001 and Pascanu et al. 2013 (extra L300–301)

**Errors:**
1. **ch14 L651–692 and L1081–1083 (Fig 14-12): output delta for the quadratic cost given as "label − output" (L1 − Co).** The sign is wrong.
   - For E = ½(L−C)², ∂E/∂C = **C − L**.
   - The book's own example says it: with label 1 and Co = 5, increasing Co *increases* the error, yet the book says "amplified by a factor of −4" (true value +4).
   - Combined with the update AC ← AC − Ao·Cδ (L746–752), this rule would do gradient *ascent*.
   - It also contradicts the book's own curve, where δ = slope = −4 at P1 = −1 < 1.
   - Teach δ_out = output − label (or say explicitly that "error signal = target − output" goes with a plus-sign update).
2. **ch14 L1026–1029 / Fig 14-21: hidden-delta rule given without activations.**
   - With activations, Hδ = f′(z_H)·Σ w·δ_next.
   - The book says it "fits without changing the basic approach" but never shows it. This is a key formula the chapter must supply (MDL Eq 10.10 has it).
3. **ch14 L617: "Dδ is about 1.25 / −0.5 = 2.5".** 1.25/−0.5 = −2.5; it should be (−1.25)/(−0.5).
   - L780–781: "go down by −2" (double negative).
   - Fig 14-37 caption: "accuracy and learning rate" should be "accuracy and loss".
4. **ch14 L1234–1245, ch15 L166: "the learning rate is a number between 0 and 1".** Not required; MDL trains MNIST with η = 1.0.
5. **ch15:**
   - L1068–1069 (text) vs L1078–1079 (caption): Nesterov reaches 0 at "about epoch 425" in the text but "around epoch 600" in the Fig 15-36 caption.
   - L325 vs L330: start η 1/8 in the text, 0.25 in the figure title.
6. **ch15 L1040–1042: "point C … is closer to the bottom … than point P, where we'd have ended up with normal momentum".**
   - Plain momentum would land at B + γm + ηg(B), not at P = B + γm.
   - "We don't have to pick any new parameters" (L1048) is fine.
7. **ch15 L1103–1109: Adagrad "divide each change by that growing sum".** It divides by the **square root** of the sum (+ε).
   - L1150–1159: Adadelta described as a finite list with oldest values dropped. It is an exponential moving average.
   - Original Adadelta has **no learning rate** (it uses RMS of past updates); "start the learning rate at 0.01" (L1174) applies only to library variants.
   - MDL ch11 L979–981 states the Adadelta point correctly.
8. **ch15 L1208–1209: RMSprop's "prop" = the adjustment "propagated" to the gradients.** The name comes from Rprop (resilient backpropagation).
   - L1204: RMSprop dated "2015". It is from Hinton's 2012 Coursera lecture 6e (MDL gives 2012).
9. **ch15 L1223–1230: Adam's motivation garbled** ("squaring loses the sign, so keep a second list … use both lists to derive our scaling factor").
   - m (EMA of g) gives the *direction/numerator*; √v scales it.
   - Bias correction and ε are not mentioned. L1247: "Adam has two parameters", but η and ε exist too.
10. **ch15 L1334–1346 (and ch17 extra L171–172, L202–204): dropout.**
    - It never mentions rescaling. Without it, test-time activations are 1/(1−p) times larger than in training (simulated: train mean 0.50 vs test 1.0 at p = 0.5).
    - Standard practice is **inverted dropout** (÷(1−p) during training, nothing at test). Srivastava et al. scaled weights by (1−p) at test.
    - "chooses that percentage of neurons at the start of each batch" — in fact masks are independent Bernoulli(p) **per example**, not an exact fraction per batch.
    - ch17 contradicts itself: "before each epoch" (L171) vs "start of each batch" (L203).
    - ch17 L174–176 says dropout before or after max-pool is equivalent. It is not, because dropping pre-pool activations changes which value wins the max.
11. **ch15 L1393–1437: batchnorm.**
    - Presented as a regularizer, with the mechanism "no neuron produces a huge output that swamps others". BN's main effect is faster, more stable optimization; its regularizing effect is a side effect of mini-batch noise.
    - Missing: normalization by the batch mean/variance; running averages used at inference.
    - "Before the activation" is the original paper's choice, but practice varies.
    - "No parameters for us to specify" (L1397) ignores momentum/ε (minor).
12. **ch15 L754–756: mini-batch size "rarely an issue", just match the GPU.** Misleading: batch size interacts with η (linear scaling rule) and generalization; MDL ch11 L391–419 is better here.
    - Also L1313–1319 and ch9 L290–291: regularization = "techniques that delay the onset of overfitting". Too narrow: L2 changes the optimum itself, not just its timing.
13. **ch15 L826: momentum credited to Qian 1999.** It is Polyak's heavy-ball method (1964), used for neural nets by Rumelhart–Hinton–Williams (1986). Qian analyzed it.
14. **ch9 L103–106: "We can often cure underfitting just by using more training data."** Wrong. More data mainly fights overfitting (variance). Underfitting (bias) needs more capacity, better features, longer training or less regularization. Also "underfitting is usually much less of a problem" is overstated.
15. **ch9 L454–458, L471–472, L507: "these curves are very similar to one another, so they show high bias"; "don't all follow the same shape, so low bias".** This conflates bias with variance.
    - Similarity across fits = **low variance**.
    - Bias = systematic gap between the *average* fit and the true curve.
    - The book's L456–458 gloss ("predetermined preference for a simple shape") is closer.
16. **ch9 L621–622 vs Fig 9-17 caption (L647–648): text says clockwise rotation increases the slope; caption says counterclockwise.** The caption is right. L800 cites "Figure 9-21" but means Fig 9-23.
17. **extra L346–348 (ch19): "The LSTM doesn't require repeated copies of itself … so it avoids vanishing and exploding gradients."**
    - The LSTM is unrolled in BPTT like any RNN.
    - Its additive cell state *mitigates* vanishing gradients; exploding gradients still need clipping.
18. **Minor:**
    - ch14 L73–74: "loss" = information "lost" (folk etymology).
    - ch14 L105–110 and L1440–1441: "weights should stay in [−1, 1]" presented as a rule.
    - ch14 L1333–1334: "if the error is 0 we don't change anything" — with sigmoid + CE the error is never exactly 0.
    - ch15 L586–590: "stochastic because samples come in random order". The deeper reason is that each step uses a random-sample estimate of the gradient.

**Exercise / quiz ideas:**
- From the error curve E = (P−1)²: δ at P = −1, 0, 3; predicted vs actual change for ΔP = 0.5.
- Fix the sign of the book's δ rule.
- Compute Aδ = AC·Cδ + AD·Dδ with numbers, then add f′(z).
- Count updates per epoch for batch / SGD / mini-batch 32 on 300 samples.
- Exponential decay: η after k steps = η0·dᵏ.
- Bold driver trace.
- Which schedule is in panel (a)–(d)?
- Dropout p = 0.5: what must be rescaled, and when?
- Bias vs variance: classify fits as "similar to each other" vs "far from the truth on average".
- 0.4⁸ vs 1.6⁸ (vanishing/exploding).
- Parameter count of the ch17 convnet (1,199,882).
