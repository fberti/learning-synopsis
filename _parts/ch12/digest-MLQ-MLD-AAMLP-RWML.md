# Ch12 source digest — MLQ (Raschka) + MLD (Mueller–Massaron) + AAMLP (Thakur) + RWML (Brink et al.)

Topic: "12. Beágyazások, szekvenciák és a figyelemmechanizmus".
Extracts live in `_parts/src/`. `L123` means line 123 in the named extract. Every page is prefixed with `=== [PDF p.N] ===`.

**Extract files**
- `MLQ12.txt` — *Machine Learning and AI Beyond the Basics* (Raschka, 2024), PDF pages:
  - ch1 (pp. 31–36)
  - ch8 (pp. 82–88)
  - ch14–19 (pp. 137–205)
- `MLD12_text.txt` — *Machine Learning for Dummies*, 2nd ed., 2021: ch18 "Scoring Opinions and Sentiments" (PDF 375–396 = book pp. 361–381).
- `AAMLP12_text.txt` — *Approaching (Almost) Any ML Problem*: "Approaching text classification/regression" (PDF 226–272 = book pp. 225–271).
- `RWML12_ch8.txt` — *Real-World Machine Learning* (2016):
  - L1–329: ch7.1 "Advanced text features" (PDF 216–226), which holds the tf-idf/LSA theory
  - L330–: ch8 "Advanced NLP example: movie review sentiment" (PDF 251–282)

**Figures and checks**
- Many RWML listings, RWML formulas and MLQ figures are images, so they are missing from the txt.
- Renders are in `_parts/src/img/rwml12-*.png` and `mlq12-*.png`. They include the tf-idf formula (p221), listings 8.1/8.6–8.9, perplexity (p194), BERTScore (p201), Fig 16-3 (p155), Fig 8-2 (p86), Fig 17-1 (p159) and Fig 17-3 (p164).
- **The ROC figures in RWML (Figs 8.4–8.9) are blank in this PDF.** Only the numbers quoted in the text are available.
- All numbers marked ✔ were reproduced in `_parts/calc/ch12_src_check.py` (`cd _parts/calc && ./run.sh ch12_src_check.py`).

---
## 0. Quick map — which source helps which step of the chapter

| Chapter-12 topic | MLQ | MLD | AAMLP | RWML |
|---|---|---|---|---|
| Tokens, tokenization | – (only "word tokens", ch17) | L150–172, L261–280 | L122–159 (split vs `word_tokenize`) ★ | L43–54 |
| Bag of words (BoW) / one-hot | ch1 one-hot L27–38 | L164–234 ★ toy corpus | L161–255 ★ toy corpus | L36–130, Fig 7.2 counts |
| TF-IDF | – | L282–346 (wrong text, right code) | L482–664 ★ formula + output | L132–176 + p221 image |
| n-grams | – | L346–380 | L666–747 | L46–63 |
| Stemming / lemmas / stop words | – | L387–495 | L749–810, L990–1000 ★ | L65–78, L97–114 |
| Topic models (SVD/LSA/NMF/LDA) | – | L718–845 (NMF Shakespeare) | L812–990 (SVD on IMDB) | L177–255 (LSA, LDA) |
| Embeddings, latent space | ch1 ★ definitions | L121–125 (one sentence) | L1002–1121 ★ word2vec/fastText/GloVe | L1056–1118 (word2vec) |
| Distributional hypothesis | ch14 ★ | – | – | – |
| RNN/LSTM | ch16 (Bahdanau context) | L110–119 (one paragraph) | L1267–1894 ★ BiLSTM code + numbers | – |
| Attention, Bahdanau | ch16 ★ | – | – | – |
| Self-attention (Q/K/V) | ch8 + ch16 (no formula!) | – | – | – |
| Multi-head, positional encoding | ch17 L797–815 (named only) | – | – | – |
| Transformer encoder/decoder | ch17 ★ | – | L1896–2425 (BERT code) | – |
| BERT vs GPT | ch14 + ch17 ★ | L127–134 (inaccurate) | L1911–2425 ★ IMDB 93 % | – |
| Why transformers won | ch8 ★ | – | L1896–1917 | – |
| Using pretrained models (feature/FT/ICL/LoRA) | ch18 ★ | – | – | – |
| Text augmentation | ch15 ★ | – | – | – |
| LLM metrics (perplexity, BERTScore) | ch19 | – | – | – |
| IMDB sentiment benchmark numbers | – | L849–990 (≈0.90) | ★ full ladder | ★ 88 %, AUC 0.974 |

**Not in any source** (supplement as "Kiegészítés"):
- the formula softmax(QKᵀ/√d_k)·V
- the √d_k scaling and the softmax normalization of the scores
- W_Q/W_K/W_V as learned projections
- multi-head split/concat (W_O)
- the sinusoidal positional-encoding formula
- the causal mask as −∞ above the diagonal
- RNN recurrence equations, vanishing gradient, LSTM gates
- subword tokenization (BPE/WordPiece)
- word2vec negative sampling
- cosine similarity as the standard embedding similarity
- the O(n²) cost formula. MLQ only poses it as exercise 16-1.

See §6 for standard values.

---
## 1. MLQ — Raschka, *Machine Learning Q and AI* ("Beyond the Basics")

**Style:** short Q&A chapters, one figure each, 2 exercises per chapter, no derivations and **no formulas for attention at all**. It is excellent for intuition and the "why". Everything numeric/algebraic must come from elsewhere.

### 1.1 Ch1 "Embeddings, latent space, and representations" (L1–132)

**Three-way distinction (L15–18)** — very reusable as a `box def`:
- **Embedding vectors:** representations where *similar items are close*.
- **Latent vectors:** *intermediate* representations.
- **Representations:** *any encoded version* of the input. One-hot counts too (L102–104).

**Build-up:**
1. **One-hot → dense embedding (L27–38).** Example: Color = Red/Green/Blue → [1,0,0], [0,1,0], [0,0,1]. These are then "mapped into continuous embedding vectors by utilizing the learned weight matrix of an embedding layer". *Pedagogical seed:* one-hot × W = selecting a row of W (embedding = lookup). The book implies this but never states it.
2. **Embeddings can also come from dense data (L39–48).** The penultimate CNN layer gives an image embedding. Strictly, any intermediate layer is an embedding (L44–46).
3. **Dimensionality (L49–53).** An embedding can be *higher or lower* dimensional than the input. Example: 2-D for visualization/clustering (Fig 1-2: words and images in 2-D).
4. **Core property (L59–61).** Embeddings "encode distance or similarity". Formal version: "an injective and structure-preserving map" (L63–68).
5. **Latent space (L71–95).** Usually a synonym of embedding space, but "similar items close" is *not required* there. Autoencoder bottleneck example (Fig 1-3): reconstruction training *may* place similar inputs (cats) close.

**Exercises:**
- 1-1: AlexNet with 5 conv + 3 FC layers — which layers give useful embeddings?
- 1-2: name some representations that are not embeddings.

### 1.2 Ch8 "The success of transformers" (L133–296)

The four factors (L146–148) are a ready structure for the "miért nyertek a transzformerek" section:
1. **The attention mechanism.**
   - History (L157–161): attention in image recognition in 2010 (Larochelle & Hinton, "foveal glimpses"), then RNN translation (Bahdanau, 2014).
   - Self-attention "allows each token in a sequence to attend to all other tokens, thus providing context-aware representations" (L167–169).
   - ★ **Key contrast (L178–192, Fig 8-1).** FC/conv weights are *fixed after training*. Attention weights are *dynamic and input-dependent*, "even after a transformer is trained". Make this a `two-col` contrast pair.
2. **Pretraining via self-supervised learning (L200–211).** Predict missing words or the next sentence. This gives general representations that are later fine-tuned. Labeled data is scarce, so unlabeled pretraining is vital (L229–230).
3. **Large numbers of parameters (L214–237).**
   - GPT-3 (2020) has **175 billion** parameters ✔. Switch transformers have "trillions" (sparse mixture-of-experts).
   - Scaling-law claim: see Errors (L221–224).
   - Chinchilla: double the training tokens for every doubling of model size (L226–228). This is correct (Hoffmann 2022).
4. **Easy parallelization (L240–259, Fig 8-2).**
   - Fig 8-2 shows 3-D token embeddings [A,B,C], [D,E,F], [G,H,I]. The dot product with token 2 is D·G + E·H + F·I, and "the dot products can be computed in parallel".
   - The weight matrices can also be distributed across machines.

**Exercises (L263–268):**
- 8-1: self-attention parallelizes easily, yet it is expensive. Why? (→ O(n²) pairs.)
- 8-2: is self-attention feature selection? Both are good quiz seeds.

### 1.3 Ch14 "The distributional hypothesis" (L297–428)

- **Definition (L306–310), after Harris (1954):** "words occurring in the same contexts tend to have similar meanings". Equivalently: "the more similar the meanings… the more often they appear in similar contexts".
- ★ **Substitution test (L311–318, Fig 14-1)**, ideal for an interactive "fill the slot" widget:
  - cats → dogs: fine
  - → hamsters: plausible (both mammals and pets)
  - → sandwiches: semantically wrong
  - → driving: grammatically wrong
- ★ **Counterexample: polysemy (L321–329).** *bank* = financial institution / river bank / steep hill incline / cushioning rim / "to bank on". The meanings have different distributions. This motivates *contextual* embeddings.
- **Word2vec (L338–358).**
  - "simple, two-layer neural network"
  - **CBOW** = predict the current word from its context
  - **skip-gram** = predict the context words from the word
  - "skip-gram is more effective for infrequent words, CBOW is usually faster to train" (L345–347)
  - After training, words with common contexts end up close (Fig 14-2, 2-D).
- **BERT (L359–366):** masked language modeling, predicting the hidden words (Fig 14-3). It is self-supervised.
- **GPT (L369–382):** decoder, predicts the next word from the preceding ones (Fig 14-4).
  - "Where BERT is a bidirectional language model that considers the whole input sequence, GPT only strictly parses previous sequence elements." Hence BERT suits classification and GPT suits generation (L377–380).
  - Both produce *contextualized* embeddings.
- **Verdict (L386–394):** "for large datasets… more or less holds true".
- **Exercises:**
  - 14-1: homophones (there/their)
  - 14-2: other modalities (→ images: neighboring patches)

### 1.4 Ch15 "Data augmentation for text" (L429–631)

The running sentence is "The cat quickly jumped over the lazy dog". It is good for a small table of techniques:

| Technique | Example from the book | Caveat |
|---|---|---|
| Synonym replacement (L450–465) | quickly→rapidly, lazy→idle | not all synonyms fit every context; WordNet |
| Word deletion (L468–491) | delete *quickly* | not *cat*; typical rate **10–20 %** |
| Word position swapping (L494–508) | "Quickly the cat jumped the over lazy dog." | order can matter |
| Sentence shuffling (L511–536) | pizza story reordered | breaks narrative/temporal logic |
| Noise injection (L539–554) | qzuickly / quickl / qickuly | char-level robustness |
| Back translation (L556–577) | → "Die Katze sprang schnell über den faulen Hund." → "The cat jumped quickly over the lazy dog." | needs a good MT model |
| LLM rewrite (L580–602) | Fig 15-1 | LLMs are nondeterministic, so repeated prompts give variety |

- **Recommendation (L605–618):** augmentation matters for small labeled sets and in fine-tuning. It matters less for LLM pretraining.
- *Link to ch12:* word swapping "works" only for **order-blind** models (BoW). This is a nice bridge to "why do we need positions?".

### 1.5 Ch16 "Self-attention" (L632–765) ★ main narrative for the attention section

Story arc. Reuse it as the "eddig X, de mi van, ha…" chain:
1. **Word-by-word seq2seq RNN (Fig 16-2a).** It cannot translate: German→English word order differs, so the output is grammatically wrong (L688–698). Design (a) suits time series, e.g. a daily stock price (L699–701).
2. **Encoder–decoder RNN (Fig 16-2b).** It reads the whole sentence, then generates. **Bottleneck:** "the RNN has to memorize the whole input sentence via a single hidden state, which does not work well for longer sequences" (L702–707). Before attention, "the whole input… was squashed into a single chunk of information" (L659–662).
3. **Bahdanau attention (2014; L655–716, Fig 16-1).**
   - At each decoder step there is a context vector = **weighted sum of all encoder states**, with attention weights α.
   - "the attention weights (and context) may differ and change dynamically at each step" (L682–687).
   - Example: when generating *help*, the German *helfen* gets a large weight (L713–716).
   - Attention here runs **between two sequences** (encoder ↔ decoder).
4. **Self-attention (L719–737, Fig 16-3).**
   - About 3 years later the question was: is the RNN needed at all? → Transformer.
   - Attention now runs **within one sequence**. Hence the name *self*-attention (L644–648).
   - Fig 16-3 (rendered p155): input token i → dot products with tokens 1…T → α_{i,1…T} → context vector i = Σ_j α_{i,j}·token_j.
   - It says the real thing "typically involves multiple weight matrices" (L735–737), but **gives no formula**.

**Exercises:**
- 16-1: time and memory complexity of self-attention
- 16-2: use in vision

*Pedagogical value:* the build-up is "attention without weights first" (raw dot products), then add weights. Follow exactly that order. The book omits the softmax: Fig 16-3 just labels α. Add explicitly that α_i = softmax(scores), so that the weights sum to 1.

### 1.6 Ch17 "Encoder- and decoder-style transformers" (L766–1017) ★

**Original transformer (L788–819, Fig 17-1 rendered p159):**
- Built for EN→FR and EN→DE translation.
- Pipeline: tokenize → embedding layer → **+ positional encoding vector** → multi-head self-attention → Add (residual) & LayerNorm → FC network ("two fully connected layers with a nonlinear activation function in between") → Add & Norm.
- Both encoder and decoder stacks are **6×** (figure).
- The decoder has the same structure; the inputs and outputs differ.

**Encoders/BERT (L821–873):**
- BERT = "bidirectional encoder representations from transformers". Pretraining is MLM + next-sentence prediction.
- **Masks 15 % of the input tokens** (Fig 17-2 caption, L839).
- [SEP] separates sentences; [CLS] is the placeholder for the classification output.
- Example pair (L856–859): "[CLS] Toast is a simple yet delicious food. [SEP] It's often served with butter, jam, or honey." versus the swapped version.
- RoBERTa: same architecture; bigger batches, more data, **no NSP**, and better results (L867–873).

**Decoders/GPT (L875–912):**
- The decoder self-attention "is masked to prevent the model from attending to future positions, ensuring that the predictions for position i can depend only on the known outputs at positions less than i" (L877–880).
- Autoregressive generation, one token at a time (L886–891).
- Fig 17-3 (p164) is a great **4-frame decoding storyboard**:
  - input "Translate word by word"
  - decoder input [START] [MASK] [MASK] [MASK]
  - → "Uebersetze"
  - → [START] Uebersetze [MASK] [MASK] → "Wort" …
  - final output "Uebersetze Wort fuer Wort"
- GPT = generative pretrained transformer. "Emergent properties": summarization, translation, QA and classification, although trained only on next-word prediction (L905–912). In-context learning requires no parameter updates.

**Hybrids (L915–931):** BART, T5. Encoder-decoder models suit tasks where "the output heavily relies on the input": translation, summarization (L954–958).

**Terminology (L934–949):**
- "Encoder-only" is a slight misnomer: BERT also decodes into tokens during pretraining.
- The real difference is that encoder-only models do **not decode autoregressively**.

**Summary sentence (L954–958), usable for the decision table:**
- encoder-only → embeddings for classification
- encoder-decoder → generation strongly tied to the input (translation, summarization)
- decoder-only → other generation, including Q&A
- Encoder-only models are "less popular" now but "still very useful for training predictive models based on text embeddings" (L966–971).

**Exercises:**
- 17-1: how to use BERT for sentiment classification
- 17-2: fine-tune GPT for classification?

### 1.7 Ch18 "Using and fine-tuning pretrained transformers" (L1018–1450) — relevant for "how is BERT/GPT used"

Three classic ways (L1026–1106, Fig 18-2), plus prompting:

| Method | What is trained | Cost | Book remark |
|---|---|---|---|
| Feature-based (L1050–1068) | nothing in the LLM; a downstream model (LogReg/SVM) on frozen embeddings | cheapest; embeddings can be precomputed | linear classifiers "typically perform best" (L1055–1064) |
| Fine-tuning I (L1076–1083) | only the new output layer(s) | cheap, no full backprop | |
| Fine-tuning II (L1084–1092) | all layers | most expensive | best accuracy, especially for domain-specific data |
| In-context learning (L1109–1154) | nothing; examples go in the prompt | no training | worse than FT for specific tasks; good when no labels/no model access |

- The few-shot DE→EN prompt example is at L1133–1143.
- Other topics:
  - hard prompt tuning (L1155–1178)
  - indexing/RAG: chunk → embed → vector DB → similarity → top-k (L1180–1198)
  - soft prompt, prefix tuning, adapters (L1199–1302)
- **LoRA numeric example (L1303–1340).** ΔW of 25×50 = 1,250 parameters versus W_A (25×5 = 125) + W_B (5×50 = 250) = **375** ✔. It is a nice hand-computable example of "low-rank = fewer parameters".
- RLHF: reward model + PPO; InstructGPT/ChatGPT (L1344–1378).

### 1.8 Ch19 "Evaluating generative LLMs" (L1451–1754) — optional, but two hand-computable toys

- **Perplexity (L1509–1546, image p194):** PPL(s) = 2^(−(1/n)·Σ log₂ p(w_i)).
  - probabilities [0.99, 0.85, 0.89, 0.99×5] → **1.043** ✔
  - "The fast black cat…" with [0.99, 0.65, 0.13, 0.05, 0.21, 0.99, 0.99, 0.99] → **2.419** ✔
  - Ties perplexity to cross-entropy (the next-token loss).
- **BLEU** = precision-like n-gram overlap; **ROUGE** = recall-like / F1 (L1547–1640).
- **BERTScore (L1641–1682, Fig 19-3 p201):**
  - reference "The cat jumped", candidate "A cat leaped high"
  - cosine matrix → row maxima 0.63, 0.72, 0.70, 0.70 → mean **0.6875** ✔
  - It is a good embedding + cosine similarity toy. See Errors: it is only the precision half.
  - Exercise 19-1: why is cos(cat, cat) ≠ 1? → contextual embeddings differ by context. This is a ★ quiz seed for "static vs contextual".

### 1.9 MLQ — errors / oversimplifications

| Line | Claim | Correction |
|---|---|---|
| L221–224 | "linear scaling laws… a doubling of the model size can halve the training loss" | Kaplan et al. found a **power law** L ∝ N^(−0.076). Doubling N gives ≈ 5 % lower loss (2^−0.076 = 0.949 ✔), not half. |
| L244–247 | Transformers are easy to parallelize "since they take a fixed-length sequence" | The real reason is **no recurrence**: all positions are computed at once in training (with the causal mask). RNNs must step t = 1…T sequentially. Generation (inference) is still token-by-token. |
| L157–161 | Attention "first developed… in image recognition back in 2010" | Debatable lineage. The soft-alignment attention used today descends from Bahdanau 2014 (NMT). Say "earlier ideas existed". |
| L338 | word2vec = "simple, two-layer neural network" | One linear projection (embedding) layer + softmax output, with **no hidden nonlinearity**. "Shallow" is the safer word. |
| L801–809 | The "+" step "performs a layer normalization and adds the original embeddings" | "+" is the **residual addition**. LayerNorm is a separate step after it (post-LN in the 2017 paper; most modern models use pre-LN). |
| L813–815 | Encoder output is "passed to a multi-head self-attention layer of the decoder" | It goes into the decoder's **cross-attention** (encoder–decoder attention): Q from the decoder, K and V from the encoder. |
| L844–854 | NSP = predict whether "the original document's sentence order of two randomly shuffled sentences is correct" | BERT's NSP: is sentence B the **actual next sentence (50 %) or a random sentence from the corpus (50 %)**? Order-swap prediction is ALBERT's SOP. |
| L885 | Fig 17-3 caption: "The next-sentence prediction task used in the original transformer" | The figure shows **next-word (autoregressive) generation**, not NSP. |
| L935–937 | Encoder-only, decoder-only and encoder-decoder are "all… seq2seq" | Nonstandard. "Seq2seq" normally means encoder-decoder (input sequence → different output sequence). |
| L1312 | "singular vector decomposition" | singular **value** decomposition |
| L1316 | "W_A ∈ ℝ^{A×h} and W_A ∈ ℝ^{h×B}" | the second one is **W_B** |
| L1338–1340 | LoRA "often performs even better than" full fine-tuning | It matches or slightly beats full FT on some benchmarks in the paper. Not a general rule. |
| L1655–1664 | BERTScore = mean of candidate-token maxima | That is BERTScore **precision**. The paper reports P, R and **F1** (F1 is the usual headline). Recall from the same matrix = 0.6833 and F1 = 0.6854 ✔. Optional idf weighting. |
| L1484 | BLEU "ranging from 0… to 1" | fine, but often reported as 0–100 |
| ch16 / Fig 16-3 | α shown as raw dot products | The weights are **softmax-normalized** (and in transformers scaled by 1/√d_k). Missing entirely. |

### 1.10 MLQ — pedagogical ideas worth reusing

- **Fixed vs dynamic weights** (Fig 8-1): a `two-col` pair, "FC layer: same W for every sentence" vs "attention: α recomputed for every sentence".
- **Attention without parameters first** (Figs 8-2, 16-3). Use 3-D toy token vectors, compute every dot product by hand, then softmax, then the weighted sum. Only after that add W_Q, W_K, W_V. This matches "előbb a konkrét eset".
- **Bottleneck narrative** (16-2a → 16-2b → Bahdanau → self-attention): each step fixes the previous one's limitation, which fits the CLAUDE.md "eddig X, de mi van, ha…" requirement.
- **Substitution test** (cats/dogs/hamsters/sandwiches/driving) for the distributional hypothesis. Then the **bank** counterexample → contextual embeddings → BERTScore's cos(cat, cat) ≠ 1.
- **Decoding storyboard** (Fig 17-3): reproduce it as a step-through widget, with masked future positions greyed out.
- **3 ways to use a pretrained model** (feature / FT-I / FT-II / ICL) as a decision table.
- **LoRA 1,250 → 375** as an optional "parameter counting" example. The perplexity toy is 1.043 vs 2.419.
- Quiz seeds from the exercises: 8-1 (parallel yet expensive), 8-2 (is attention feature selection?), 14-1 (homophones), 16-1 (complexity), 17-1/17-2 (BERT or GPT for classification), 19-1 (cos(cat, cat) ≠ 1).

---
## 2. MLD — Mueller & Massaron, *ML for Dummies* 2e, ch18 "Scoring Opinions and Sentiments"

**Order:**
1. NLP motivation: ambiguity
2. "state of the art" paragraph
3. BoW
4. counts
5. TF-IDF
6. n-grams
7. stemming / stop words
8. web scraping (irrelevant)
9. encodings
10. NMF topic modeling (Shakespeare)
11. sentiment lexicons
12. IMDB Keras model

The code is good and the prose explanations are often sloppy.

### 2.1 Motivation examples (L48–88)

- **Coreference ambiguity:** "John told Luca he shouldn't do that again." Who is "he"? (L72–74)
- **Word-sense ambiguity:** *mouse* = animal or device (L74–76). "The difficulty… arises because of the context" (L77). This is a good opener for "why contextual embeddings".
- **Sentiment trap (L901–904):** "Waste your money on this game." contains *waste*, yet the imperative reads as sarcastic/positive to the authors. Also "Wasted two hours" and "It was so cool."

### 2.2 BoW toy (L176–234) ✔ fully reproduced

- **Corpus:**
  - text_1 = "The quick brown fox jumps over the lazy dog."
  - text_2 = "My dog is quick and can jump over fences."
  - text_3 = "Your dog is so lazy that it sleeps all the day."
- **Binary CountVectorizer** → 3 × **21** matrix (L207–209, ✔ identical).
- **Vocabulary indices** (alphabetical, L224–228): all 0, and 1, brown 2, can 3, day 4, **dog 5**, …, the 19, your 20.
- **dog** is the only word in all 3 documents ✔.
- **Sparse matrices** are introduced because a real vocabulary has ">1 million terms" (L239–246).
- **BoW limit:** word order is lost. In "My dog is quick…", *quick* refers to *dog* (L251–257).
- **Counts (L261–280):**
  - add text_4 = "A black dog just passed by but my dog is brown."
  - vocab → **26** ✔, dog → index **8** ✔
  - row = [0 0 1 1 1 1 0 0 **2** 0 0 1 0 0 0 1 0 1 0 1 0 0 0 0 0 0] ✔
  - "a" disappears: the default token pattern needs ≥ 2 characters. Worth a `warn` box.

### 2.3 TF-IDF (L282–346) — code right, prose wrong

Code: `TfidfTransformer(norm='l1')` on the 4-doc counts. Output for text_4 ✔ (sum = 1.0):

| word | value |
|---|---|
| brown | 0.095 |
| dog | 0.126 |
| my | 0.095 |
| is | 0.077 |
| black | 0.121 |
| just | 0.121 |
| passed | 0.121 |
| by | 0.121 |
| but | 0.121 |

- **sklearn smooth idf with n = 4:** dog (df = 4) → **1.000**, is (df = 3) → 1.2231, my (df = 2) → 1.5108, black (df = 1) → 1.9163 ✔.
- ★ **Teaching trap here:** dog is in *every* document, so idf is minimal, yet it gets the **largest** weight (0.126) because tf = 2. Also, with the *textbook* idf = ln(4/4) = 0, dog would get **0**. sklearn's "+1" never zeros a word. Use this as a `warn` box: "which TF-IDF variant?".
- **Bigrams** of the 4-doc corpus: **32** bigrams ✔ (L361–373).
- **n-gram guidance:** `ngram_range=(1,3)` gives uni+bi+trigrams. "You usually never need more than trigrams" (L375–380).

### 2.4 Stemming, stop words (L387–495)

- Porter stemmer + NLTK stop words.
- Fit on "Sam loves swimming so he swims all the time" → features ['love', 'sam', 'swim', 'time'].
- "George loves swimming too!" → [[1 0 1 0]] (L460–495).

### 2.5 NMF topics on Shakespeare (L736–845)

- 217 rows (acts).
- TfidfVectorizer(min_df=3, stop_words='english'), NMF 10 topics.
- Top words, e.g. Topic 8: cassio iago desdemona othello moor. The best match for topic 8 = "Othello act:5".
- Point (L740–746): SVD/PCA components mix + and − loadings, which makes them hard to interpret. NMF is non-negative.

### 2.6 Lexicons and IMDB Keras model (L849–990)

**Lexicons:**
- AFINN-111 has **2,477** words/phrases (L860).
- Hu & Liu opinion lexicon. Lexicon scoring = look up and sum (L854–857). It is "not decisive because word context matters".

**IMDB data (L880–888):**
- Maas et al. 2011, 50,000 reviews, balanced. The canonical split is 25k/25k.
- The code instead samples train 30,000 / valid 10,000 / test the rest (L910–915). But see the bug below.

**Pipeline:**
- Keras Tokenizer → `texts_to_sequences` → `pad_sequences(maxlen=256)` (L937–948). Padding/truncation default = 'pre'.

**Model (L956–968):**
- Embedding(voc, **8**, input_length=256) → Flatten (256·8 = 2,048) → Dropout(0.2) → Dense(1, sigmoid)
- adam, binary cross-entropy, **2 epochs, batch 16**
- **≈ 0.90** accuracy on validation and "test" (L971, L989)

**Parameter count:**
- Dense = 2,048 + 1 = **2,049** ✔. Embedding = voc × 8 (e.g. 100k words → 800k).
- So it is essentially a **position-specific linear model on learned 8-D embeddings**. A nice "tiny embedding model" example.

### 2.7 MLD — errors

| Line | Claim | Correction |
|---|---|---|
| L167–169 | 9 binary features for "The quick brown fox jumps over the lazy dog"; "'The' is considered distinct from 'the'" | CountVectorizer lowercases by default (`lowercase=True`). There are **8** distinct tokens ✔, and the printed vocabulary itself has only 'the'. |
| L231–233 | dog "is the fifth element" (index 5) | Index 5 is the **sixth** position (0-based). Same off-by-one style at L278–280, where "ninth position" = index 8 is consistent. |
| L269 | `vectorized.fit(corpus)` | typo, should be `vectorizer.fit` |
| L291–293 | TF-IDF "divides the value by the number of documents in which the token appears" | It **multiplies** tf by idf = log(N/df). sklearn uses ln((1+N)/(1+df)) + 1. |
| L300–310 | Normalization "divides the count of each token by the total number of tokens" | `norm='l1'` divides the **tf-idf weights** by their sum. The sklearn default is **L2** (unit-length vectors). Neither is "count / length" before idf. |
| L113–115 | RNNs rendered BoW "obsolete" | BoW/TF-IDF + linear model remains a strong baseline: AAMLP gets 89–90 % on IMDB, ≈ the BiLSTM. Transformers have since superseded RNNs. |
| L127–130 | BERT and GPT-3 "involving billions of parameters" | BERT-base 110 M, BERT-large 340 M; GPT-3 175 B. (The GPT-3 GitHub link is not the model.) |
| L391–394 | cats, catty, catlike all stem to *cat*; "same stem should have the same meaning" | The Porter stemmer is heuristic suffix stripping (catty → "catti"). The same stem ≠ the same meaning (university/universe → "univers"). |
| L790 | `reconstruction_err_` "method" | It is an attribute. |
| L914 | `sampled_idx.append(valid.index)` | `Index.append` returns a **new** object, so `sampled_idx` is unchanged. The "test" set = all 20,000 non-train rows, **including the 10,000 validation rows**. Test ≈ valid is then no confirmation (L989–990). |
| L883–887 | "Half the reviews are for training and the other half for testing" | true for the official split, but the book's code ignores it (30k/10k/10k) |

### 2.8 MLD — pedagogical ideas

- Ambiguity openers (John/Luca, mouse, "Waste your money").
- The 3-sentence corpus + 4th sentence with "dog" twice. It gives a complete, hand-checkable BoW → counts → TF-IDF chain with known numbers.
- "dog in every document but highest weight" trap.
- The tiny Keras model (8-D embedding, 2 epochs → 0.90) shows that *learned* embeddings are just a trainable lookup table.

---
## 3. AAMLP — Thakur, "Approaching text classification/regression" ★ best numeric ladder

**Running task:** IMDB sentiment, **25,000 positive + 25,000 negative** (L30–31), Maas et al. 2011. Balanced, so accuracy is the metric (L296–298). Throughout: **StratifiedKFold(5)**, and the vectorizer is fit on the training folds only.

### 3.1 Build-up

1. **Lexicon baseline (L64–120).** Hand-made positive/negative word sets. Counting the intersection gives positive/negative/neutral. No model.
2. **Tokenization (L122–159).**
   - `"hi, how are you?".split()` → ['hi,', 'how', 'are', 'you?'] (punctuation glued)
   - `word_tokenize` → ['hi', ',', 'how', 'are', 'you', '?']
   - A clean contrast pair.
3. **BoW with CountVectorizer (L161–255).** Toy corpus:
   - "hello, how are you?"
   - "im getting bored at home. And you? What do you think?"
   - "did you know about counts"
   - "let's see if this works!"
   - "YES!!!!"

   Results:
   - default vocabulary = **23** tokens ✔
   - sparse output (row, col) count; "you" = column 22 has count **2** in sentence 2
   - with `tokenizer=word_tokenize` the vocabulary grows to **28** ✔. Now it includes ',', '?', '.', '!', "'s".
4. **BoW + LogisticRegression on IMDB**, 5 folds:
   - 0.8903 / 0.897 / 0.891 / 0.8914 / 0.8931 → **mean 0.8926** ✔ (L397–419)
   - "89% accuracy… all we did was use bag of words with logistic regression" (L421–422)
5. **MultinomialNB (L423–480):**
   - 0.8444 / 0.8499 / 0.8422 / 0.8443 / 0.8455 → **mean 0.8453** ✔
   - "superfast" but lower
6. **TF-IDF (L482–664).** Formula as printed (L487–499):
   - TF(t) = (times t appears in the document) / (total terms in the document)
   - IDF(t) = LOG(total documents / documents containing t)
   - TF-IDF = TF·IDF

   **But the printed toy output (L538–576) is sklearn's default, not this formula** ✔ reproduced exactly:
   - row 0 = hello/,/how/are 0.4428, ? 0.3573, you 0.2966
   - row 4 = '!' 0.9552, yes 0.2960
   - The textbook formula would give e.g. *you* in row 0 = (1/6)·ln(5/3) = **0.0851** (log10: 0.0370), not 0.2966.

   IMDB TF-IDF + LR: 0.8976 / 0.8998 / 0.8948 / 0.8912 / 0.8995 → **mean 0.8966** ✔. This is "the new benchmark".
7. **n-grams (L666–747).**
   - `ngrams(word_tokenize("hi, how are you?"), 3)` → ('hi', ',', 'how'), (',', 'how', 'are'), ('how', 'are', 'you'), ('are', 'you', '?')
   - TF-IDF with `ngram_range=(1,3)`: 0.8931 / 0.8941 / 0.897 / 0.8922 / 0.8847 → **mean 0.8922** ✔ — **no improvement**. A good "more features ≠ better" point.
8. **Stemming vs lemmatization (L749–810).** Snowball stemmer vs WordNet lemmatizer:

   | word | stem | lemma |
   |---|---|---|
   | fishing | fish | fishing |
   | fishes | fish | fish |
   | fished | fish | fished |

   (The lemmatizer defaults to noun POS.)
9. **Topic extraction with TruncatedSVD(10)** on 10k reviews (L812–990):
   - Top words are garbage first: ['the', ',', '.', 'a', 'and'], ['br', '<', '>', '/', '-'] (HTML!).
   - After punctuation cleaning: ['the', 'a', 'and', 'of', 'to'], ['i', 'movie', 'it', 'was', 'this'], …
   - Lesson: preprocessing/stop words matter.
   - **Stop-word caveat (L994–1000):** "I need a new dog" → "need new dog", so we no longer know *who* needs it.
10. **Word embeddings (L1002–1025).**
    - Tokens are integers 0…N−1; now each one is represented by a vector.
    - word2vec (Google): **CBoW** = predict the missing word from its surroundings; **skip-gram** = predict the context from a word.
    - fastText (Facebook): character n-grams. GloVe (Stanford): co-occurrence matrix.
    - All end up as a dictionary word → vector "of size N (usually 300)".
11. **Analogy (L1039–1045, Fig 1).** Berlin − Germany + France ≈ Paris. "This is not always true, but examples like these are useful."
12. **"hi , how are you ?" → six 300-D vectors (L1046–1053).**
13. **Sentence vector (L1066–1121).** Lowercase → tokenize → drop stop words and non-alpha → **sum the word vectors → L2-normalize**. Zeros if no known word.
    - fastText `crawl-300d-2M.vec` + LR, 5 folds: 0.8619 / 0.8661 / 0.8544 / 0.8624 / 0.8595 → **mean 0.8609** ✔
    - The author says "excellent", but it is ~3 pp *below* BoW + LR (see Errors).
14. **Text as a time series (L1267–1287, Fig 2).** A sequence of embedding vectors → LSTM/GRU/1D-CNN.
15. **BiLSTM (L1376–1460).**
    - frozen fastText embedding matrix (N+1 × 300; OOV rows are zeros)
    - `nn.LSTM(300, 128, bidirectional=True)`
    - mean-pool + max-pool over time, each 256 → concat **512** → Linear(512, 1)
    - BCEWithLogits, Adam 1e-3, MAX_LEN 128, batch 16, ≤ 10 epochs with simple early stopping
    - trainable parameters: **440,320** (LSTM, 220,160 per direction = 4·(128·300 + 128·128 + 2·128)) + **513** = **440,833** ✔ (computed; not stated in the book)
    - Results: best epoch per fold 0.9015 / 0.9007 / 0.8924 / 0.9 / 0.878 → mean **0.8945** ✔ (L1809–1813)
16. **Transformers / BERT (L1896–2425).**
    - Motivation (L1898–1909): long-range dependencies. An LSTM sees the next word only after the previous one, while a transformer "can look at all the words… simultaneously", so it parallelizes and uses GPUs better.
    - Setup:
      - `bert_base_uncased`, MAX_LEN **512**, batch 8 / 4, ≤ 10 epochs
      - `encode_plus` → input_ids, **attention_mask** (1 = token, 0 = padding), token_type_ids (0/1 for sentence A/B) (L2016–2026)
      - pooler output (768; 1024 for large) → Dropout(0.3) → Linear(**768**, 1)
      - AdamW lr **3e-5**, weight decay 0.001 (none on bias/LayerNorm), linear schedule, 0 warmup
      - single stratified 90/10 split
    - **Result: 93 %** (L2415).
17. **Cost–benefit verdict (L2418–2425):** LSTM ≈ 90 %, maybe +1 % with tuning, so BERT gives "~2 % benefit". BERT is slower to train and to run inference. "Don't choose BERT only because it's 'cool'." ★

### 3.2 IMDB accuracy ladder (AAMLP) — ready-made for an "Alkalmazás" table ✔

| Model | Features | Mean acc (5-fold) |
|---|---|---|
| MultinomialNB | BoW counts | 0.8453 |
| LogReg | fastText avg (300-D, normalized sum) | 0.8609 |
| LogReg | TF-IDF (1–3)-grams | 0.8922 |
| LogReg | BoW counts | 0.8926 |
| BiLSTM (frozen fastText, MAX_LEN 128) | sequence | 0.8945 (best epoch per fold, optimistic) |
| LogReg | TF-IDF unigrams | **0.8966** |
| BERT-base fine-tuned (MAX_LEN 512) | sequence | 0.93 (single 90/10 split) |

**Message:** order-blind TF-IDF + linear ≈ BiLSTM. Only the pretrained transformer clearly wins, at a high cost. Averaging word vectors loses information (below BoW).

### 3.3 AAMLP — errors / caveats

| Line | Claim | Correction |
|---|---|---|
| L258 | "word_tokenize from scikit-learn" | word_tokenize is from **NLTK** |
| L487–499 vs L538–576 | the printed TF-IDF formula (tf = count/len, idf = log(N/df)) | The shown output is sklearn's: tf = raw count, idf = ln((1+N)/(1+df)) + 1, then **L2 row normalization** ✔. State which variant you use. |
| L753–754 | "lemmatization is more aggressive than stemming" | Reversed: **stemming is more aggressive** (crude suffix chopping, may produce non-words). The book's own table shows the lemmatizer leaving *fishing/fished* unchanged. |
| L813–815 | LSA "also popularly known as singular value decomposition" | LSA *uses* (truncated) SVD on the term-document matrix. SVD is the general matrix factorization, not a synonym. |
| L1020–1022 | fastText "learns embeddings for character n-grams instead" | It learns word **and** char-n-gram vectors. A word vector = sum of its n-gram vectors (+ the word itself), so it handles OOV/morphology. |
| L1263 | fastText average "excellent results" | Mean 0.861 is **lower** than BoW + LR (0.893) and TF-IDF + LR (0.897) ✔. Averaging discards order and weighting. |
| L1650 | `tokenizer.fit_on_texts(df.review…)` on **all** folds | Vocabulary leakage from the validation fold (minor, label-free). Fit on train_df. |
| L1743–1754 | LSTM outputs are logits (no sigmoid), thresholded at **0.5** | The threshold should be **0** for logits (or apply sigmoid). The reported accuracies are slightly biased. The comment admits it. |
| L1809–1817 | "This is by far the best score" (best epoch per fold) | Mean of the best epochs is 0.8945 < TF-IDF + LR 0.8966 ✔. Picking the best epoch on the validation fold is optimistic. |
| L2415 | BERT 93 % "much better than any other model" | Plausible, but the protocol differs: one 90/10 split vs 5-fold, MAX_LEN 512 vs 128. Not a like-for-like comparison. |
| L1007–1008 | Word2Vec "one of the oldest approaches" | Older: LSA (1990) and the neural LM of Bengio et al. (2003). word2vec (2013) popularized it. |

### 3.4 AAMLP — pedagogical ideas

- `split()` vs `word_tokenize` contrast pair (tokenization as a separate preliminary step).
- The 5-sentence toy corpus with a known vocab of 23 vs 28 tokens. "you" counted twice in sentence 2.
- The **accuracy ladder** (§3.2) as the chapter's application / "melyik módszer mikor?" evidence. Simple baselines first.
- Stem vs lemma table (fishing/fishes/fished). The "I need a new dog" stop-word trap.
- SVD topics full of "the , . br < >" show that preprocessing matters.
- Berlin − Germany + France ≈ Paris, with the explicit caveat "not always true".
- Text = time series of vectors (Fig 2) as the bridge from embeddings to RNN.
- The BiLSTM shapes (300 → 2×128 → mean ‖ max = 512 → 1) as a shape-tracking exercise. The parameter count is 440,833.
- attention_mask = 1 for tokens, 0 for padding: connects to masking in attention.
- "Don't choose BERT only because it's cool" (rule of thumb box).

---
## 4. RWML — Brink, Richards, Fetherolf, *Real-World Machine Learning* (2016)

### 4.1 Ch7.1 Advanced text features (L1–329)

**Bag of words (L36–130).**
- Tokenization: split on words (or characters for character-based languages). n-grams: bigrams "the lazy", "brown fox"; trigrams "brown fox jumps", "jumps over the" (L46–54).
- n-grams inflate the feature count, so start with unigrams and use sparse-friendly algorithms (L57–63).
- Transformations: lowercase (fox/Fox), unless case is meaningful (proper names, ALL CAPS) (L65–71). Stemming: jump/jumping/jumps/jumped → "jump" (L72–76).
- Dictionary = top-N most frequent words (L80–84).
- **Fig 7.2 count table (image p260/p219)** over the vocabulary the, quick, brown, fox, jumps, over, lazy, dog:

  | text | the | quick | brown | fox | jumps | over | lazy | dog |
  |---|---|---|---|---|---|---|---|---|
  | Text 1 | 2 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
  | Text 2 | 2 | 0 | 1 | 1 | 1 | 1 | 1 | 1 |
  | Wikipedia page on the pangram | 65 | 8 | 8 | 10 | 4 | 6 | 6 | 6 |

  It shows long documents dominating raw counts and "the" dominating everything.
- **Stop words (L97–114):** remove the most frequent words. A standard threshold is words in **> 90 % of documents**, or use the NLTK lists.
- **Sparsity (L116–130):** "1,000 features with only a small percent nonzero" is common. Use sparse-native algorithms (naïve Bayes) or ones tolerant of many weak features (random forest).

**TF-IDF (L138–176 + formula image p221).**
- Motivation: "data" in a corpus of ML papers is common, hence uninformative. Prefer words rare in the corpus but frequent in this document (L138–148).
- tf variants: raw count, **binary**, **logarithmic 1 + log(tf)** (L157–160).
- idf = "logarithm of the total number of documents, divided by the number of documents that contain the term" (L162–164).
- **But the printed formula (image) has no log:** tf-idf(term, doc, docs) = count(term in doc) · count(docs) / count(docs with term). See Errors.
- Use in search: distances between tf-idf vectors rank documents for a query (L167–176).

**LSA (L177–235).**
- Term-document matrix (rows = terms, columns = documents), normalized like tf-idf.
- "Concepts" = groups of co-occurring terms: dog ← barking, leash, kennel (L188–196).
- SVD A = T·S·D; take the top-N singular values to get N features. New-document fold-in: D = AᵀTS⁻¹ (L223).
- Footnote: "LSA as 'PCA for bag of words'" (L214–216). ★ A nice link to ch8 (PCA).

**Probabilistic topic models (L238–267):** pLSA, LDA (Gensim). The number of topics must be tuned.

**Content expansion (L269–329):**
- follow links in tweets
- knowledge-base expansion (Wikipedia; disambiguate "Tesla" the car company vs Nikola Tesla via "car"/"model" vs "Edison")
- meta-features (hashtags, counts, language)

### 4.2 Ch8 Movie review sentiment (L330–1249)

**Data (L365–439).**
- Kaggle "Bag of Words Meets Bags of Popcorn" (IMDb). At most **30 reviews per movie**.
- Label 1 if rating > 6 (i.e. ≥ 7), 0 if < 5. Ratings 5–6 are excluded (L401–405).
- Kaggle test set (25,000) is unlabeled, so the book uses its own **70/30** split.
- ★ **Leakage warning (L423–433):** the same movie in train and test lets the model learn titles. Use **temporal cutoffs** for the holdout. Footnote: they assume the file is date-sorted and split by position.

**Data inspection (L441–478).**
- The 10 shortest reviews (Fig 8.1). id 10962_3 says "movie is terrible" but "good effects", so it is negative despite *good*.
- "never get tired", "no wasted moments" are positive although their words are negative. So "you must combine information across multiple (neighboring) words" (L466–472). ★ A great motivation for n-grams → sequence models.

**Use-case analysis (L480–617).**
- 3 candidates:
  1. rank movies (no movie ID → infeasible)
  2. predict 1–10 rating (only binary labels → infeasible)
  3. **binary pos/neg** (feasible)
- Metric choice: TPR at a low FPR (1 %) for "top-10 reviews for the front page" vs AUC/accuracy for full tagging.

**BoW + NB (L619–849).**
- Listing 8.1 (image p260): `d[:int(0.7*len(d))]` → train **17,500**, test 7,500. CountVectorizer fit on **train only**: "you can't contaminate the bag-of-words dictionary with words from the test set" (L647–653) ★.
- Feature matrix **17,500 × 65,005**. Only **0.2 %** of cells are nonzero (L661–666, L685).
- **NB sidebar (L689–749, image p263):**
  - p(C_k|x) ∝ p(C_k)·Π_i p(x_i|C_k)
  - multinomial: p(x|C_k) ∝ Π_i p_{k,i}^{x_i}
  - log form: log p(C_k|x) ∝ log p(C_k) + Σ_i x_i·log p_{k,i} = b + w_k·x
  - So **NB is a linear classifier in log space** ★ (connects to logistic regression).
- MultinomialNB on counts → **accuracy 88 %** (L794, L800). The AUC figure is blank in the PDF.
- ★ **"Trick the model" sequence (L804–849):**
  - "I love this movie" → 1
  - "This movie is bad" → 0
  - "I was going to say something awesome, but I simply can't because the movie is so bad." → 0
  - the same with "awesome or great or good" → 0
  - "It might have bad actors, but everything else is good." → **0 (wrong)**
  - It shows the BoW model's dependence on single strong words.

**TF-IDF + NB (L851–881).** Listing 8.4: `TfidfVectorizer()` defaults. "Improved the model accuracy slightly", especially at low FPR (exact values only in the missing Fig 8.5).

**Grid search (L892–1022, listing 8.6 image p270).**
- max_features ∈ {10,000, 30,000, 50,000, None}, min_df ∈ {1, 2, 3}, nb_alpha ∈ {0.01, 0.1, 1.0} → **36** combinations ✔, < 10 min.
- Best is iteration 27: max_features = None, min_df = 1, **alpha = 0.01** (the main gain) → **AUC 0.974** (L970–987).
- Monotone trends: more features, lower min_df and lower alpha are all better.

**word2vec + random forest (L1032–1148).**
- Tokenizer (listing 8.7, image p276): lowercase, split on " ", strip non-word characters, remove an English stop-word list. **That list contains "not", "no", "nor", "against", "don't"…** See Errors.
- Gensim `Word2Vec(sentences, size=300, window=10, min_count=1, sample=1e-3, workers=2)`. Example: `model['movie']` → [0.0079, 0.0128, −0.0474, −0.0222, …] (listing 8.8, image p277).
- Document vector = **mean** of its word vectors (listing 8.9). It divides by len(s) including OOV words.
- ~65,000 sparse features become a few hundred dense ones. MultinomialNB is incompatible with dense real-valued features, so they use **RandomForest(100 trees)**.
- "Improves… across all points on the ROC curve" (L1142–1148). The numbers are in the missing Fig 8.9. The summary says "almost 90 % accuracy" (L1224–1225).

**Next-step list (L1157–1190):**
- use the **unlabeled** Kaggle reviews to train word2vec (unsupervised pretraining → supervised use; a nice precursor of the BERT idea)
- tune the parameters
- phrase detection ("New York City")
- multiple languages (Chinese: no whitespace)

**Deployment (L1192–1208):** NB supports online/partial training; RF scales poorly.

### 4.3 RWML — errors

| Line | Claim | Correction |
|---|---|---|
| L398–400 | "The training data consists of 50,000 reviews" | Kaggle's **labeled** training set is **25,000** (plus 50,000 *unlabeled*). The book's own split gives 17,500 = 0.7 × 25,000 ✔. |
| p221 formula (after L165) | tf-idf = count · (N_docs / N_docs_with_term) | **The log is missing.** The text (L162–164) correctly says idf = log(N/df). |
| L143–144 | scale counts by "the inverse of the total count of that word in the corpus" | idf uses the **document frequency** (number of documents containing the word), not the total occurrences, and it uses the log |
| L205–206 | Singular values "denote the relative importance that a term has to a document" | They give the **strength (importance) of each latent concept/dimension**. Term–concept and document–concept relations are in T and D. |
| L249, L255 | "latent Dirichlet analysis" | latent Dirichlet **allocation** |
| L1059–1063 | word2vec "built using deep neural networks" | It is a **shallow** network (one linear projection layer). |
| L1067–1068, L1116–1118 | LDA is "another topic model similar to word2vec"; word2vec "has learned higher-level topics" | word2vec is not a topic model. It learns word vectors from local context windows. The averaged vector is not a "combination of topics". |
| listing 8.7 (p276) | the stop-word list includes not/no/nor/against | For **sentiment**, removing negations destroys "not good" / "no wasted moments" (the book's own L467 example). Keep negations. |
| listing 8.9 (p277) | divides by len(s), including OOV words | Average only over the found words, or the vectors shrink for OOV-heavy reviews (minor). |

### 4.4 RWML — pedagogical ideas

- Fig 7.2 counts table (Text 1 / Text 2 / Wikipedia 65× "the"). It motivates both stop words and tf-idf on one slide.
- "Fit the vocabulary on train only" + "same movie in train and test" = two leakage warnings for a `warn` box.
- Negation examples ("never get tired", "no wasted moments", "movie is terrible / good effects") → BoW's order blindness → n-grams → sequence models.
- The trick-the-model sequence. Use it as a widget or quiz: "which review fools the BoW model?".
- NB as b + w·x (linear in log space).
- LSA = "PCA for bag of words". It links ch8 (PCA/SVD) to latent space and embeddings: an early, count-based "embedding".
- Unlabeled data for word2vec → pretraining idea, historically before BERT.

---
## 5. Cross-source comparisons

### 5.1 TF-IDF variants actually used

| Source | tf | idf | normalization | note |
|---|---|---|---|---|
| AAMLP formula (L487–499) | count / doc length | LOG(N/df), base unspecified | none | textbook. Printed output contradicts it. |
| RWML text (L157–164) | count, binary, or 1 + log tf | log(N/df) | – | formula image drops the log |
| MLD prose (L291–310) | "percentage of tokens" | "divide by #docs" (wrong) | – | code uses sklearn with norm='l1' |
| **sklearn default** (AAMLP output, MLD code, RWML listing 8.4) | raw count | **ln((1+N)/(1+df)) + 1** (smooth_idf=True) | **L2** per document | a word in all documents still gets idf = 1, never 0 |

Recommendation for the chapter: teach the textbook idf = log(N/df) first. Hand-compute with N = 4 so that ln(4/4) = 0 and the zero shows. Then a `box tip`: "a scikit-learn más képletet használ (+1 simítás, L2-normálás)". Use the MLD corpus numbers above (idf 1, 1.2231, 1.5108, 1.9163) as verification.

### 5.2 IMDB numbers across the books

| Source | Split | Model | Result |
|---|---|---|---|
| MLD | 30k / 10k / 10k (buggy: test 20k ⊃ valid) | Embedding(voc, 8) + Flatten + Dense | ≈ 0.90 acc |
| AAMLP | 5-fold stratified on 50k | ladder §3.2 | 0.845 – 0.897; BERT 0.93 (90/10) |
| RWML | 70/30 of 25k labeled (17,500 train) | MNB counts / tuned TF-IDF MNB / w2v + RF | 88 % acc / AUC 0.974 / "almost 90 %" |

All three converge on **≈ 88–90 % for count-based or simple models** and ~93 % for fine-tuned BERT. That is a nice consistent fact for a quiz. (Note that accuracy and AUC are different metrics. RWML's 0.974 is an AUC.)

### 5.3 Embedding facts across the books

- **Dimension:** 300 (AAMLP fastText/GloVe L1025; RWML word2vec size = 300); 8 (MLD Keras toy); 768/1024 (BERT base/large hidden, AAMLP L2082–2084).
- **word2vec training modes:** CBOW vs skip-gram (MLQ L341–347, AAMLP L1012–1018). Skip-gram is better for rare words and CBOW is faster (MLQ).
- **Sentence vector:** AAMLP = L2-normalized sum; RWML = mean. Both are order-blind. Contrast them with contextual (BERT) embeddings.
- **Analogy:** Berlin − Germany + France ≈ Paris (AAMLP).
- **Static vs contextual:** MLQ (bank; BERTScore cos(cat, cat) ≠ 1).

---
## 6. Gaps to fill as "Kiegészítés" (standard facts; verify numerically when used)

- **Scaled dot-product attention** (Vaswani 2017): Attention(Q, K, V) = softmax(QKᵀ/√d_k)·V, with Q = XW_Q, K = XW_K, V = XW_V.
  - The √d_k scaling keeps the variance of the dot products ≈ 1, so the softmax does not saturate.
  - Each row of the softmax sums to 1.
  - Toy plan: 3 tokens with 2-D vectors and W = I first (MLQ's "no weights" version), then learned W.
- **Causal mask:** add −∞ above the diagonal before the softmax, so position i sees only positions ≤ i (MLQ L877–880 in words only).
- **Padding mask:** AAMLP's attention_mask (1 = token, 0 = pad) is the same mechanism.
- **Multi-head:** h heads, each with d_k = d_model/h. Concat → W_O. Original: d_model = 512, h = 8, d_k = 64, FFN inner size 2048, N = 6 encoder + 6 decoder layers. (MLQ Fig 17-1 shows 6× but none of the other numbers.)
- **Positional encoding:**
  - why: self-attention is permutation-invariant (link it to MLQ ch15 word swapping and to BoW order blindness)
  - sinusoidal: PE(pos, 2i) = sin(pos/10000^{2i/d}), PE(pos, 2i+1) = cos(…)
  - learned position embeddings in BERT/GPT
- **RNN:** h_t = tanh(W_h·h_{t−1} + W_x·x_t + b). Sequential, so not parallel over t. Vanishing/exploding gradients. LSTM gates (forget/input/output, cell state), GRU. (MLD L116–119 and AAMLP only name them.)
- **Self-attention cost:** O(n²·d) time and O(n²) memory for the attention matrix (MLQ exercise 16-1) vs O(n·d²) per RNN layer, but with n sequential steps.
- **Subword tokenization:** BPE (GPT-2 vocabulary 50,257) and WordPiece (BERT vocabulary 30,522). It explains BERTScore's "subwords" (MLQ step 2) and why OOV is no longer an issue. Contrast with AAMLP's OOV-zero rows.
- **Model sizes:**
  - BERT-base: 12 layers, 768 hidden, 12 heads, 110 M parameters
  - BERT-large: 24 layers, 1024 hidden, 16 heads, 340 M
  - GPT-2: 1.5 B; GPT-3: 175 B (96 layers, d = 12,288)
- **Cosine similarity** cos = u·v/(‖u‖‖v‖). It is used implicitly by BERTScore (MLQ) and the L2-normalized sentence vectors (AAMLP).
- **Embedding layer = one-hot × matrix = row lookup.** Parameter count V × d (MLD: voc × 8).

---
## 7. Ten most useful items for writing chapter 12

1. **MLQ ch16 bottleneck story** (word-by-word RNN → encoder-decoder bottleneck → Bahdanau → self-attention). It is the spine of the attention section.
2. **MLQ Fig 8-1 fixed vs input-dependent weights**, plus Figs 8-2/16-3 "attention without weights". Build attention by hand before introducing Q/K/V.
3. **AAMLP IMDB accuracy ladder** (§3.2, all ✔): NB 0.845 → fastText-avg 0.861 → BoW + LR 0.893 → TF-IDF + LR 0.897 ≈ BiLSTM 0.895 → BERT 0.93, plus "don't choose BERT because it's cool".
4. **MLD 3+1 sentence corpus** with verified BoW (21 → 26 vocabulary, dog index 5 → 8), TF-IDF values and the "dog in every document but largest weight" trap.
5. **The TF-IDF variant table** (§5.1). Textbook log(N/df) vs sklearn ln((1+N)/(1+df)) + 1 with L2 normalization. AAMLP's toy output reproduces sklearn exactly.
6. **MLQ ch14 substitution test + "bank" polysemy** → distributional hypothesis → static (word2vec) vs contextual (BERT) embeddings. BERTScore exercise: cos(cat, cat) ≠ 1.
7. **MLQ ch17 encoder vs decoder:** MLM 15 %, [CLS]/[SEP], causal mask in words, the Fig 17-3 decoding storyboard, and the encoder-only / decoder-only / encoder-decoder use-case summary (L954–971).
8. **RWML negation and trick sentences** ("no wasted moments", "bad actors, but everything else is good" → misclassified), plus the stop-word list that deletes "not". Together they motivate n-grams and sequence models.
9. **MLQ ch8 four reasons transformers won** (attention, self-supervised pretraining, scale, parallelism), with the scaling-law correction (doubling N gives ≈ 5 % lower loss, not half).
10. **Leakage lessons** for a `warn` box:
    - fit the vocabulary on train only (RWML L647–653)
    - same movie in train and test (RWML L423–433)
    - MLD's test set silently contains the validation set (L914)
    - best-epoch cherry-picking (AAMLP L1816)
