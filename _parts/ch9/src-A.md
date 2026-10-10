# Ch9 source digest A — DLV, HAW, MLAB, MLD

Extracts are in `_parts/src/`. `L123` = line number in the named file.
- `DLV.txt` = Glassner ch13
- `HAW.txt` = Kneusel ch4; `HAW_ch2.txt` = Kneusel ch2 (history)
- `MLAB.txt` = Theobald ch13
- `MLD.txt` = Mueller–Massaron ch14; `MLD_ch10.txt` = their perceptron section
- Figure renders used to check numbers: `src/img/` (dlv-360/361, dlvsm-377, haw-107, mld-287/295)

**Not covered by any of the four sources** (mark as "Kiegészítés" in the chapter): universal approximation (Cybenko 1989 / Hornik 1991; only MLD has one vague sentence); depth vs width; a worked XOR network with weights; a numerically correct perceptron learning-rule example; the matrix form h = σ(Wx+b) (only MLD has z = Wa + b).

---
## 1. DLV (Glassner, Deep Learning: A Visual Approach, ch13)

**Order of topics:** real neuron (L20) → artificial neuron as a "stick figure vs human body"; people also say "unit" (L86–97) → perceptron and its history (L101–204) → modern neuron = bias + activation (L206–262) → drawing conventions: weights on edges, bias trick, "the weights are always there even if not drawn" (L268–367) → weight naming AD (L407–433) → feed-forward layers, office-tower analogy (L444–449) → DAG (L479–560); initialization LeCun/Glorot/He (L580–602) → depth, hidden layer; the input layer is not counted (L605–689) → fully connected layer and MLP (L692–722); tensors (L729–779) → **network collapse without activation** (L782–860) → activation gallery: identity, step/unit/Heaviside/sign, ReLU family, maxout, softplus, ELU, swish, sigmoid, tanh, sine (L861–1199) → rules of thumb (L1202–1239); softmax (L1242–1367)

**Reusable points:**
- Depth = number of layers that contain neurons. Fig 13-10 is "a deep network of three layers" (2 hidden + 1 output) (L657–663).
- A 3-neuron dense layer after 4 neurons has 3×4 = 12 connections (L694–698). Biases are not mentioned, so it makes a good exercise: 15 parameters.
- MLP = a network built only from dense layers, "a throwback to earlier terminology" (L720–722).
- Rules of thumb (L1230–1239): ReLU/leaky ReLU on hidden layers; regression output = identity; 2 classes = 1 sigmoid output; >2 classes = softmax.
- Softmax is "not quite an activation function" because it acts on all outputs together (L1243–1257).
- A parametric ReLU with slope 1 becomes a straight line and the network collapses again (L1053–1056).

**Numeric examples:**
- **Collapse** (L790–841, Fig 13-14/15, checked on the render):
  - C = 2A+4B, D = 3A+B, E = 3C+D, F = 4C+2D, G = 2E+3F
  - the book claims G = 78A+86B; this is wrong (see errors below)
- **Softmax panels** (Fig 13-37, values read from the figure):
  - A..F = 0.3, 0.1, 0.8, 0.4, 0.2, 0.6
  - A..E = 5, 2, 1, 8, 4
  - A..H = 0.5, 2, 0.9, 3, 0.1, 0.7, 0.5, 1
- Step-function variants (unit step, Heaviside, sign with ±1 or 0 at x = 0) (L970–996).

**History, as stated:** McCulloch–Pitts 1943 (L102–108); perceptron "1957" (cites Rosenblatt 1962) (L115); Mark I "built at Cornell University in 1958": 20×20 grid of 400 photocells, potentiometer weights turned by motors (L161–175); Minsky–Papert 1969 (L179–183); "AI winter roughly between the 1970s and 1990s" (L187–188); Rumelhart–Hinton–Williams 1986 (L196)

**Errors:**
1. **L823 / Fig 13-16: "G is 78A + 86B".** With the figure's own labels, E = 9A+13B, F = 14A+18B, so **G = 60A+80B** (checked in Python).
2. **L791–792: "five neurons (E through G)".** It should be C through G.
3. **L1334–1337: softmax "C ≈ 0.25, B ≈ 0.15 … a little more than 1.5 times".** The ratio is e^(0.8−0.1) = **2.01**. Full softmax of the panel gives B = 0.120, C = 0.241 (Python); the figure itself also shows about 0.12.
4. **L1340–1363: the softmax output "depends on whether the inputs are all less than 1 / greater than 1".** Misleading. Softmax is shift-invariant (verified), so only the differences between scores matter.
5. **L1295–1296: if A's softmax output is twice B's, "A is twice as probable".** Softmax outputs are not calibrated probabilities.
6. **L844–845 and L1386–1388: "addition and multiplication … are linear"; nonlinear = "cannot be described by addition and multiplication".** x·x is nonlinear. What is linear is multiplying by constants and adding.
7. **L1100–1102: "no derivative at the kink … therefore the function is not linear".** Garbled logic.
8. **L1150–1151: tanh's name comes "from trigonometry".** Hyperbolic functions are defined via exponentials. Also, sigmoid's range is the open interval (0,1), not [0,1] (L1155).
9. **L1040–1042: leaky ReLU = "scaled down by a factor of 10".** That is only one choice; PyTorch's default is 0.01.
10. **History:**
    - The Mark I hardware came from the Cornell Aeronautical Laboratory and was demonstrated in 1960; 1958 was the IBM 704 simulation (L161–162).
    - There were two AI winters (~1974–80 and ~1987–93), not one spanning the 1970s–1990s (L187).
    - "any idea expressed in logic" overstates McCulloch–Pitts (L106–108).
11. **L610–615: "that's all deep learning means: layers we draw vertically".** A joke etymology.

**Exercise / quiz ideas:** Find the error in the collapse example.; Count parameters of a 4→3 dense layer (12 + 3).; Depth of Fig 13-10.; Show the softmax ratio is e^(difference), independent of the other scores.; Pick the output activation per task.; Which parametric-ReLU slope kills the nonlinearity?

---
## 2. HAW (Kneusel, How AI Works, ch4 + ch2)

**Order of topics:** biological vs artificial neuron: **light switch vs dimmer switch** analogy (L26–38) → a single neuron in 3 steps: multiply, sum + bias, activation (L50–81); ReLU (L91–96) → one neuron on iris: 28/30 = 93% (L97–111) → one hidden layer of 2/3/8 nodes, ReLU hidden + sigmoid output (L115–147) → **parameter counting** (L148–161) → **wine forward pass** (L162–272); threshold choice (L257–285) → random initialization makes accuracy vary between runs (L303–352) → six-step training loop (L389–403); loss and overfitting (L425–485) → gradient descent as a **"lost in the hills, village in the valley"** analogy (L514–550); backprop as "speed" (L700–723); SGD (L750–806) → dinosaur MLP vs classical models (L808–934)

**Numeric examples:**
- **Parameter counting** for a 3-input network with one output (L148–154), all correct (Python):
  - 2 hidden nodes: 8 weights + 3 biases
  - 3 hidden nodes: 12 + 4
  - 8 hidden nodes: 32 + 9 = a "41-dimensional space" (L713–716)
- **Wine net, Fig 4-3** (weights from the render):
  - hidden 1: w = (0.4716, 0.0399, −0.3902), b = 0.0532
  - hidden 2: w = (1.5013, −0.0690, 0.2728), b = 1.3808
  - output: w = (0.3031, −1.6134), b = 2.2277, sigmoid
- **Sample 1** = (−0.7359, 0.9795, −0.1333) (L201, L223–242):
  - z₁ = −0.2028 → ReLU 0; z₂ = 0.1720
  - output pre-activation 1.9502 → σ = **0.8755**
  - all verified in Python
  - raw alcohol 12.29% standardizes to −0.7359 (L217): a useful aside on input scaling
- **Sample 2** = (0.0967, −1.2138, −1.0500) (L203): see error 1.
- Wine averages over 240 runs: 81.5 / 83.6 / 86.2% (L292–296). Ten reruns of the same net: 89, 85, 73, 81, 81, 81, 81, 85, 85, 85 (L340).
- **Table 4-1** (L844–862), 1600 inputs and 1 output. Parameter counts all verified in Python:

  | hidden layers | parameters | accuracy |
  |---|---|---|
  | 10 | 16,021 | 59.4% |
  | 400 | 640,801 | 77.0% |
  | 800 | 1,281,601 | 76.7% |
  | 2400 | 3,844,801 | 81.2% |
  | (100, 50) | 165,201 | 75.8% |
  | (800, 100) | 1,361,001 | 81.2% |
  | (2400, 800) | 5,764,001 | 77.9% |

  The final MLP scores 77.4% vs a 300-tree random forest at 83.3% (L899–916).
- Error example: output 0.44 → error 0.56; output 0.97 → error 0.03 (L432–438).

**History** (HAW_ch2.txt): McCulloch–Pitts 1943 (L186); Dartmouth 1956 (L209); "In 1957, Rosenblatt of Cornell University created the Mark I Perceptron" (L221); 1958 Navy event and NYT quote "walk, talk, see, write, reproduce itself…" (L238–247); Minsky–Papert 1969 (L276–280); Lighthill 1973 (L281–285); "many people missed that such limitations were not applicable to more complex perceptron models" (L286–291); Neocognitron 1979/80 (L292); Hopfield 1982 (L352); Rumelhart–Hinton–Williams 1986, with an explicit note that backprop's inventor is disputed (L360–381); SVM 1995 (L387); ReLU replaced sigmoid/tanh, no date given (L830–842); dropout 2012 (L845)

**Errors:**
1. **HAW.txt L264–272: sample 2 output "0.4883 → class 0, network wrong".** Recomputing with the book's own Fig 4-3 weights:
   - hidden z = (0.4601, 1.3233)
   - output pre-activation 0.2322 → σ = **0.5578** → class 1, which is **correct**
   - no feature-order permutation gives 0.4883
   - sample 1 reproduces exactly, so the weights were read correctly
   - the book leaves this "as an exercise", and its answer is wrong
2. **ch2 L221: Mark I in "1957".** 1957 was the report, 1958 the IBM 704 simulation, 1960 the Mark I demonstration.
3. **ch2 L278–280: Minsky–Papert showed "single- and two-layer" networks fail.** They analysed single-layer perceptrons (one trainable layer), e.g. on parity and connectedness.
4. **ch2 L349 / L405: second AI winter in the mid-1980s, "ended in 1997 with Deep Blue".** Usually dated ~1987–93.
5. **ch2 L832–833: sigmoid/tanh "in most cases inappropriate".** Overstated; still used for outputs and gates.
6. **ch2 L487–498: compares AlexNet's top-5 error (15%) with a random top-1 error (99.9%).** Different metrics.
7. **HAW.txt L835–837: hidden layer up to "nearly twice" the 1,600 inputs, but the maximum is 2,400 = 1.5×.** Also L739–742: "local minima are all pretty much the same" is stated as fact.

**Exercise / quiz ideas:** Full wine forward pass, with the corrected sample 2 answer (0.5578).; 3-h-1 parameter counts.; Why average over 240 runs?; Threshold 0.4 vs 0.5.; Dimmer vs on/off switch: which activations behave like a dimmer?

---
## 3. MLAB (Theobald, ML for Absolute Beginners, ch13)

**Order of topics:** brain analogy (L10–25) → "threshold = activation function" (L26–43); cost and "backprop" (L44–53) → black box (L55–81); layers (L83–101) → perceptron, Rosenblatt 1950s (L102–126) → **numeric perceptron example** (L127–173); a threshold variant with x > 3 (L174–183) → sigmoid neuron, then tanh (L185–198) → MLP: political-preference net with 4 inputs → 5 hidden → 2 outputs (L210–242) → deep learning (L244–288); penguins quiz (L289–314)

**Numeric example** (L130–173):
- x = (24, 16), w = (0.5, −1), step activation with output 1 if sum ≥ 0
- sum = 12 − 16 = −4 → output 0
- "updated" w₂ = −0.5 → 12 − 8 = 4 → output 1

**Errors:**
1. **L169: "12 + -16 = 4".** Typo; it should be 12 + (−8).
2. **L166–168: the weight update is arbitrary.** Only w₂ moves, with no target and no learning rate, so it is not the rule w ← w + η(t−y)x. The real rule moves both weights (Python):
   - η = 0.01 → w = (0.74, −0.84), sum 4.32
   - η = 1/32 → w = (1.25, −0.5), sum 22
3. **L113–117: "1 triggers the activation function, 0 does not; 0 is not passed to the next layer".** Wrong. The activation is always applied, and 0 is passed on.
4. **L38–41:** threshold conflated with the activation function, described as "all or nothing". **L49–50:** "backpropagation" conflated with gradient descent.
5. **L191–192: sigmoid "accepts any value between 0 and 1".** Reversed: the input is any real number, the output is in (0,1).
6. **L227–228: "weights/hyperparameters".** Weights are parameters. **L214:** cites Fig 48 where Fig 53 is meant.
7. **L265–266: "deep" = "at least 5–10 layers".** No such definition. **L281–284:** "MLP superseded by DBN/RNTN" is outdated.
8. **L309: quiz answer "2 output nodes" for binary sex.** One sigmoid node is enough (MLD L258 says so).
9. **L293: "244 rows".** Palmer Penguins has 344 rows (it does have the 7 variables the quiz mentions), so this is likely a typo.

**Exercise / quiz ideas:** Correct the perceptron update.; Rerun the example with the x > 3 threshold.; Step vs sigmoid sensitivity to small weight changes (L185–195).; Parameters of the 4-5-2 MLP: 25 + 12 = 37.

---
## 4. MLD (Mueller–Massaron, ML for Dummies, ch10 + ch14)

**Order of topics, ch10:** Rosenblatt history (L15–40) → prediction = sign(w·x + b) (L48–55) → perceptron cost −Σ_{i∈M} y_i(x_iᵀw + b), summed over misclassified points (L66–108) → update w ← w + η·x_t·y_t (L127–140); line geometry (L142–152) → non-separable data: never converges (L168–171); new feature spaces (L179–188); online learning (L190–194)

**Order of topics, ch14:** XOR needs more than one perceptron (Fig 14-1, L69–88) → activations: step / sigmoid / tanh / ReLU (L102–145) → DAG and a water-filter analogy (L149–205) → output-layer design incl. multilabel and softmax (L207–263) → connections = units(l)·units(l+1) (L276–279) → **matrix forward pass** z(l+1) = W(l)a(l) + bias, a = g(z), 7 steps for 4 layers (L307–398) → initialization (L413–443); backprop and cross-entropy (L447–565); online/batch/minibatch (L570–597) → overfitting, L1/L2, early stopping (L602–673) → Keras moons example (L900–1142) → deep learning and vanishing gradient (L1147–1232)

**Numeric example:** the Keras moons model (L941–982):
- 500 points, 30% test split
- Input(2) → Dense(8, relu) → Dense(8, relu) → Dropout(0.2) → Dense(1, sigmoid)
- 24 + 72 + 0 + 9 = **105 parameters** (verified); a great parameter-counting exercise
- trained 1000 epochs with batch size 64; test accuracy reported as 1.0 (L1074–1082)
- rule of thumb: at least 10 examples per parameter (L1058–1063)

**History:** Rosenblatt at the Cornell Aeronautical Laboratory, 1957, Naval Research sponsor, a psychologist (ch10 L15–17); the "embryo … walk, talk…" quote attributed to Rosenblatt himself (L31–33); the disappointment "ignited the first AI winter" (L37–40); backprop "early appearance in the 1970s" (ch14 L462); Google "cat neuron" (L1188–1191); Hinton credited with ReLU, dropout and pretraining (L1218–1231)

**Errors:**
1. **L115–117: "The linear function (labeled Binary step) doesn't apply any transformation … reduces a NN to a regression with polynomial transformations".** Two errors:
   - a step is not the identity
   - a linear-activation network collapses to plain linear regression, with no polynomial terms
2. **L501: Cost = y·log(h) + (1−y)·log(1−h)** (confirmed on the render). The minus sign is missing.
3. **L515–516: δ(n) = W(n)ᵀδ(n+1).** It is missing ⊙ g′(z(n)). The L527 update mixes δ(l) with a(l); it should be ΔW(l) ∝ δ(l+1)a(l)ᵀ.
4. **L1181–1183: a few layers make a "perfect universal approximator … any possible mathematical function".** The universal approximation theorem only guarantees approximating *continuous* functions on compact sets, with enough units, as an existence result. It says nothing about learnability. Same problem at L452–454.
5. **L1207–1209: vanishing gradient from "below-zero multiplication".** It should be factors with |·| < 1 (σ′ ≤ 0.25), and it is a problem of the backward gradient.
6. **L1229–1231: Hinton's "pretraining" described as reusing weights from a similar problem.** That is transfer learning. Hinton's 2006 pretraining was greedy layer-wise unsupervised (RBM/DBN). ReLU was popularized by Nair–Hinton 2010 and Glorot et al. 2011.
7. **L83–88: "two perceptrons" solve XOR.** A layered net needs 2 hidden + 1 output; two units work only with a skip connection.
8. **L438–439: standard-normal (std 1) initialization offered as a "simple solution".** Too large; it contradicts the warning at L421–428.
9. **L328–330, L400–402: the activation "discards values below a threshold".** True only for step/ReLU.
10. **Smaller errors:**
    - L632–637: list descriptions are scrambled (e.g. activation functions described as epochs).
    - L1024–1026: dropout drops units, not connections.
    - L1017: ReLU's speed is explained by sparsity; it actually comes from the cheap max.
    - L47: Rick Rashid was not CEO.
    - L1190: it was 16,000 cores, not 16,000 computers.
    - L230: "Adele" should be "Adélie".
11. **ch10:**
    - L96: a dot product "doesn't differ from a weighted average". It is a weighted sum.
    - L151–152: the perceptron does not end "at the exact border"; it stops at any separating line.
    - L133–140: with w₀ = 0, the perceptron's predictions do not depend on η at all.
12. **Layer-counting convention:** MLD counts the input layer (L290–293); DLV does not (DLV L657–663). Flag the difference in the chapter.

**Exercise / quiz ideas:** Which of OR/AND/XOR is linearly separable?; Derive the 105 parameters.; Connections + biases between two layers.; Output-layer design: regression = 1 linear unit; binary = 1 sigmoid; K exclusive classes = K units + softmax; multilabel = K sigmoids, whose sum can exceed 1.; All-zero initialization → symmetry (L432–435).; A perceptron update with y = ±1.; 2-3-1 forward pass in matrix form.
