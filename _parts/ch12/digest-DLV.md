# Digest – Glassner: *Deep Learning: A Visual Approach* (2021), ch. 19 RNN + ch. 20 Attention & Transformers

Sources (raw `pdftotext -layout`):
- `_parts/src/DLV12_ch19.txt` – ch. 19 "Recurrent Neural Networks", book p. 539–564 (PDF p. 569–594), 1190 lines
- `_parts/src/DLV12_ch20.txt` – ch. 20 "Attention and Transformers", book p. 565–599 (PDF p. 595–629), 1585 lines

Line numbers below (`L123`) refer to these txt files. `19:L…` = ch19 file, `20:L…` = ch20 file.
Embeddings / word2vec / GloVe / fastText / ELMo / ULMFiT / BERT / DistilBERT / GPT-2 / GPT-3 are all in **ch. 20**
(ch. 19 has no embeddings at all – words are single integers there). No math formulas anywhere in either chapter:
no `softmax(QKᵀ/√d)V`, no LSTM gate equations, no sinusoid formula. The Hungarian chapter must supply them ("Kiegészítés").

Numbers marked ✔ were checked with Python (pure-stdlib run, see bottom of file).

---------------------------------------------------------------------------------------------------

## PART A – Chapter 19: Recurrent Neural Networks

### A0. Chapter intro (19:L1–31)
- Motivation: so far samples are independent (cat photo vs. next photo irrelevant); a movie frame benefits from neighbours
  (track temporarily occluded objects). Order matters → **sequence**.
- Generative bonus: sequence models can *generate* – list of cited toys: stories, TV scripts, Irish jigs, polyphonic
  melodies, lyrics (pop, folk, rap, country), speech-to-text, image/video captions.
- **Token** = one element of the input sequence (word, word fragment, measurement…). In ch19 token ≡ word.

### A1. Working with Language (19:L34–94)
- NLU vs NLP (L35–40): book says NLU is "the general field", NLP = statistical techniques without understanding.
- Strong "no understanding" stance (L41–51): like CNNs process pixel statistics, NLP systems assign numbers to words and
  find statistical relationships; "without even a glimmer of comprehension".
- **Tasks list** (L54–67): sentiment analysis, translation, question answering, summarize/paraphrase, generate new text,
  logical flow (premise → conclusion entailment). Book focuses on translation + generation.
- **Text generation = autoregression** (L79–88): seed/prompt → predict next word → append → repeat. "Autoregressor".
  NLG = natural language generation.
- **Language model** (L89–94): "any computation that takes a sequence of words and tells us how likely it is that the
  sequence is a well-formed sentence" – not whether it is well written, meaningful or true.

### A2. Transforming Text into Numbers (19:L96–130)
- Two options: **character-based** vs **word-based**.
  - Unicode 13.0.0: "154 written human languages", **143,859** distinct characters; number them 0…~144,000.
  - Book's char examples use **89 characters** most common in English text.
  - Word-based: modern English dictionaries ≈ **300,000** entries; number them from 0 → vocabulary.
- Book promises "a much richer way to represent words" later (= embeddings, ch20).
- Missing: subword tokenization (BPE/WordPiece) – only a passing remark in ch20 (20:L1124–1125, "some input words were
  broken up into multiple tokens by a preprocessor"). Kiegészítés needed.

### A3. Fine-Tuning and Downstream Networks (19:L132–155)
- Transfer learning (book's usage): freeze existing net, add a few new layers at the end, train those (leaf-shape example).
- **Pretrained** on general data → **fine-tune** on law/poetry/engineering text; "unlike transfer learning, we typically
  modify all the weights".
- **Downstream network / downstream task**: language model frozen, its output fed to a second model. Some LMs are designed
  to produce "rich, dense summaries" of text to drive many downstream tasks. In practice both are blended.

### A4. Fully Connected Prediction – the failing baseline (19:L158–370) ★ good motivational sequence
Build-up: numbers first, then words – shows *why* we need something new.
1. **Tiny net** (Fig 19-1): FC layer of **5 neurons, leaky ReLU slope 0.1** → FC **1 neuron, no activation**.
   Params = 5·5+5 + 5+1 = **36** ✔ (not stated in book).
2. **Synthetic data**: sum of sine waves; first **500** samples. Sliding window of 5 → predict 6th; windows 1–5→6,
   2–6→7 … → **495** training samples ✔ (500−5). **50 epochs**. Train fit good; test on **250** later points "pretty great".
   Fig 19-3 describes the sliding window (inputs blue, target red).
3. **Sunspots**: monthly average sunspot numbers **1749–2018** (Kaggle); ~**11-year** solar cycle; tiny net follows ups and
   downs but misses extremes.
4. **Words**: first **six chapters of *A Tale of Two Cities*** (Dickens 1859), punctuation stripped, lowercased.
   Vocabulary built by order of first appearance: word 0 = first word of book; **17,267 words total, 3,458 unique**
   (values 0…3,457). Training part sees only ≈ **3,000** unique words → test sequences containing larger IDs removed.
   Training ≈ first **12,000** words, test ≈ **2,000** words. Asked for 50 epochs, **early stopping after 8**.
   Output, turned back into words: *"pricked hollows mud crosses argument ripples loud want joints upon harness followed
   side three intensely atop fired wrote pretence"*.
5. **Why it failed** (L295–370), three reasons:
   a. Too little capacity; and no notion of structure/semantics. *"Just yesterday, I saw a ___"* → any of tens of
      thousands of nouns; longer window *"I've been spending my time watching tigers very closely. Just yesterday, I saw
      a ___"* rules most out → bigger window.
   b. Bigger window (20 inputs, 20 neurons, predict 21st; FC 20-20-1 = 441 params ✔) → training OK, test much worse;
      bigger window ⇒ bigger net ⇒ more data, memory, compute, electricity, time.
   c. ★ **Integer IDs are brittle**: IDs **1,003 = keep**, **1,004 = flint** (consecutive only because they first appear
      together: *"keep the flint and steel sparks well off the straw"*). Prediction **1,003.49 → keep**, **1,003.51 →
      flint**: a 0.02 error swaps to an unrelated word. Numeric closeness ≠ meaning closeness.
   d. Word order / reference: *"Bob told John that he was hungry"* (he = Bob) vs *"John told Bob that he was hungry"*
      (he = John). Claim: deeper FC layers lose the ordering.
   e. CNNs for sequences mentioned (Chen & Wu 2017; van den Oord 2016 = WaveNet) "still developing".

### A5. Recurrent Neural Networks: state (19:L373–459) ★ best analogy in the chapter
- **State** = description of a system at a given time. Oven: off / preheating / at temperature; state can carry extra info
  (status, current temp, target temp).
- ★ **Ice-cream sundae analogy** (Fig 19-9): you = the system, the recipe in your head = state.
  - initial state "An empty cup" → *Put in vanilla* → "cup with **3 scoops** of vanilla" → *Remove 1 scoop* → "cup with
    **2 scoops**" → *Add syrup* → "…covered in chocolate syrup" → you recognise it and **compress** the whole state to
    "**Marty's favorite**" → *Add cherry* → "Marty's favorite with a cherry on top".
  - Lessons: (1) state ≠ list of received inputs; it's a **compressed/modified summary** (remember "2 scoops", not "3 then
    −1"); (2) each step: new input + old state → output + new state; outside observers can't see it → **hidden state**;
    (3) **order matters** (chocolate first = different dessert, no "Marty").
- **Time step** = each element of a sequence, even when there's no real time (river depth along its length; printed text).

### A6. Rolled vs unrolled diagram, recurrent cell (19:L461–561)
- Fig 19-10 rolled-up: inputs "Put-in-vanilla / Remove-1-scoop / Add-sauce / Add-cherry" (hyphenated = one chunk) enter a
  box; a loop with a black square = **delay** (one-step memory) feeds the state back.
- **Unrolled** (Fig 19-9) vs **rolled-up/rolled** (Fig 19-10).
- **Recurrent cell** (Fig 19-11): "neural networks" inside + state; recurrent ≠ recursive. Hidden state may be exported
  (dashed line). **Recurrent layer**; network dominated by them = **RNN** (term also used for layers/cells).
- State stored as a tensor, usually 1-D → **width/size** of the cell = number of memory elements.
- Use as LM: feed 5 words one by one, ignore first 4 outputs, 5th output = prediction of the 6th; backprop if wrong.

### A7. Recurrent cells in action (19:L564–601) – worked toy
- Fig 19-13 unrolled: inputs **it · was · the · best · of**, outputs **swam · night · best · party · times**.
  Hidden state starts as zeros. After "it" predicts *swam* ("it swam", ignored); after "it was" → *night*; … near start of
  training might give "it was the best of **jellyfish**"; after training → **times** (Dickens' opening line).

### A8. Training an RNN: BPTT, vanishing/exploding gradients (19:L603–648)
- Gradients flow right→left through the unrolled copies; but all boxes are **the same cell** → bookkeeping problem →
  **backpropagation through time (BPTT)**.
- ★ Numeric illustration: gradient **60 % smaller** each step → after **8** cells < 1/1000 of original
  (0.4⁸ = 0.00066 ✔; 8 is exactly the first step below 10⁻³ ✔). Gradient **60 % larger** each step → after 8 steps
  "almost **43×**" (1.6⁸ = 42.95 ✔). Names: **vanishing gradient** (Hochreiter et al. 2001; Pascanu, Mikolov, Bengio 2013),
  **exploding gradient**.
- Consequence: learning slows/stops for the recurrent cell and for all layers before it.

### A9. LSTM and GRU (19:L650–698)
- Name explained: state changes often (short-term memory) but some info can be kept long → "selectively persistent
  short-term memory".
- Fig 19-14 block diagram: **three internal networks**: *forget* network (move numbers toward 0), *remember* network
  (add new numbers into the state), *select* network (present a version of the state as output).
- Claims LSTM avoids both vanishing and exploding gradients because "it doesn't require repeated copies of itself" (wrong –
  see errata).
- "When people speak of an RNN they often mean an LSTM." **GRU** = popular variation; try both.

### A10. Using RNNs (19:L701–835)
- **Sunspots with a tiny LSTM**: single LSTM with **3** hidden-state values (Fig 19-15), window 5 but fed **one value per
  step** (FC got all 5 at once). Results ≈ FC net; loss also roughly the same. "Apples and oranges" caveat.
  Params (LSTM in=1, h=3, + Dense 3→1) = **64** ✔ (GRU variant would be 49 ✔) – not in book.
- **Character-level text generation** (Sherlock Holmes short stories, Doyle 1892):
  - Alphabet **89** symbols (keyboard). Window **40** chars. Net (Fig 19-17): LSTM **128** → LSTM **128** → Dense **89** +
    softmax → 89 probabilities; **greedy** (always most probable char).
  - Params with one-hot input: 111,616 + 131,584 + 11,481 = **254,681** ✔ (not in book; assumes one-hot 89-dim input).
  - Training set: ≈ **half a million** overlapping 40-char strings, **starting every 3rd character** (⇒ corpus ≈ 1.5 M chars ✔).
  - Autoregression with a sliding window: Fig 19-18 shows window of 4: "prac" → t → "ract" → i → "acti" → c …
  - After **1 epoch**: *"er price." "If he waits a little longer wew fet ius ofuthe henss lollinod fo snof thasle, anwt
    wh alm mo gparg lests…"* – English-sized, pronounceable non-words.
  - After **50 epochs**: *"nt blood to the face, and no man could hardly question off his pockets of trainer, … "I conturred
    these cause they not you means to know hurried at your little platter.' … "Excellent!" Holmes to be so lad, reached."*
    Mostly real words, good punctuation; *conturred*, *shoubing* plausible. The system knows nothing about words – only
    letter-after-letters probabilities. Bigger model → better (Karpathy 2015).

### A11. Different architectures (19:L836–1019)
- **CNN-LSTM**: conv layers find objects per video frame, LSTMs track them across frames.
- **Deep RNN** (Fig 19-19): stack 3 recurrent layers, outputs of one = inputs of next; each layer own weights + hidden
  state + own initial state. Book's (dubious) example: layer 1 translates to an abstract language, layer 2 changes mood,
  layer 3 translates to target; "training each LSTM individually".
- **Ambiguity examples** (nice for motivation):
  - *"I saw the hot dog train."* – at least **6** readings (exercise routine of a warm dog / attractive dog / frankfurter;
    locomotive pulling a chain of each of those).
  - *"I saw the man on the hill in Texas with the telescope at noon on Monday"* – **132** interpretations (Mooney 2019).
  - *"I didn't say he stole the money"* – stressing each word gives **7** meanings.
  - Groucho Marx, *Animal Crackers* (1930): "One morning I shot an elephant in my pajamas. How he got into my pajamas,
    I'll never know."
- ★ **Polysemy "cast"** (contrast triple): *I cast my fate to the wind* → **lancei**; *The cast on my arm is heavy* →
  **gesso**; *The cast of the play is all here* → **elenco** (Portuguese, Google 2020). Choosing requires the words
  **after** "cast" → need right context.
- Feeding reversed (*wind the to fate my cast I*) helps only for right context.
- **Bidirectional RNN** (Schuster & Paliwal 1997, Fig 19-20): two independent RNNs, forward and backward; step k: input k to
  forward cell and input n−1−k to backward cell; at the end **concatenate** the two outputs per word.
  **Deep bi-RNN** (Fig 19-21): 3 bi-RNN layers, each with two independent cells.

### A12. Seq2Seq (19:L1022–1162) ★
- Word-order motivation: *I love my big friendly dog* → *J'adore mon gros chien amical* (adjectives **surround** the noun).
- Length motivation: *My dog is eating dinner* (**5** words) → Portuguese *Meu cachorro está jantando* (**4**) → Scottish
  Gaelic *Tha mo chù ag ithe dinnear* (**6**).
- **seq2seq** (Sutskever, Vinyals, Le 2014): encoder RNN + decoder RNN. Encoder outputs ignored; its **final hidden state =
  context vector** initialises the decoder's hidden state; decoder gets a special **[START]** token, then autoregresses until
  it emits **[END]**. Fig 19-22: *The moon is full* → *La lune est pleine [END]*.
  Link to ch18 autoencoders: latent vector ↔ context vector.
- **Experiment EN→Dutch** (Hughes 2020 code; data Kelly 2020 = manythings.org): both RNNs **1,024** state elements;
  ≈ **50,000** sentence pairs, ≈ **40,000** for training, rest test; **10 epochs**.
  - *do you know what time it is* → *weet u hoe laat het is* → (Google back-translation) *Do you know what time it is* ✓
  - *i like playing the piano* → *ik speel graag piano* → *i like to play the piano* ✓
  - *John told Sam that his bosses said that if he worked late, they would give him a bonus* → *hij nodig had hij een
    nieuw hij te helpen* → *he needed a new he help* ✗ (degrades on complex input).
- ★ **Fixed-size bottleneck**: *"The table has four sturdy ___"* (→ legs) vs the long version *"The table, despite all the
  long-distance moves, the books dropped onto it, the kids running full-speed into it, serving variously as a fort, a
  stepladder, and a doorstop, still had four sturdy ___"*. "No matter how big our hidden state is, a bigger sentence can
  always come along" – book calls this the **long-term dependency problem**. seq2seq throws away all intermediate encoder
  states (Fig 19-23 long input).
- Two drawbacks (L1158, L1177–1180): single context vector + "trained one word at a time" (sequential).

### A13. Summary (19:L1168–1185) – recap only.

---------------------------------------------------------------------------------------------------

## PART B – Chapter 20: Attention and Transformers

### B0. Intro (20:L7–27)
RNN problems restated: everything squeezed into one state; can always overflow; one word at a time → slow.
Attention network: no state memory, parallel. Plan: embeddings → attention → transformers → BERT/GPT.

### B1. Embedding – the animal-wrangler story (20:L30–199) ★★ best pedagogical idea of ch20
- Movie with a tempestuous director; office sends a 2-D chart of animals: x = average top speed, y = average adult weight
  (data Reisner 2020) – but **axis labels missing** (printer error). Animals on the chart (Fig 20-1): bush elephant,
  polar bear, grizzly bear, sleeping bear, brown bear, horse, giraffe, giant sloth, pig, deer, African wild dog,
  roadrunner, gray fox, housecat, squirrel, black mamba, snail.
- Director: "Horses!" → too twitchy, "like foxes" → "Give me horses that are less fox-like."
- **Arrow arithmetic** (Fig 20-2): A+B = tail of B on head of A; A−B = A + (−B), −B = B rotated 180°.
- Arrows from bottom-left (origin) to horse and fox; **horse − fox = giant sloth** (Fig 20-3).
  Intuition: horse and fox have similar speed → difference ≈ 0 speed; horse much heavier → big, slow animal.
- "Make them fast… sloths like roadrunners": **horse − fox + roadrunner = brown bear** (Fig 20-4). ("A sleuth of bears.")
- Two take-aways (L191–199): (1) the layout is useful even if we don't know what the axes mean; (2) we navigate by
  adding/subtracting arrows to items themselves, attributes come along implicitly ("didn't try to find a slower horse").

### B2. Embedding words (20:L206–303)
- Replace animals by words, 2 axes by **hundreds** of dimensions; the **embedder** decides what axes mean and places words
  so similar words are near. → word embedding / token embedding; embedding space.
- Distributional intuition (not named): after *"I just drank some ___"* → the noun is placed near drinks; *"I just ate a
  red ___"* → near red things and near edible things → a word belongs to many clusters at once.
- ★ **Word arithmetic experiments** (spaCy vectors: **684,754 words, 300 dimensions**):
  - **king − man + woman → queen** (El Boukkouri 2018).
  - **lemon − yellow + green → ginger** (#1); expected *lime* only **5th**.
  - **trumpet − valves + slide → saxophone** (#1); expected *trombone* **2nd** ("first runner-up").
- Once embedded: words become 1-D tensors instead of 0-D numbers.
- ★ Fixes the keep/flint problem: *"The dragon approached and let out a mighty ___"* → predicted vector near **roar** might
  return **bellow** or **blast**, but not **daffodil**.
- Fig 20-5: similarity heat-map of **6 groups × 4 related words** (coffee drinks, flavours, colours, …); symmetric;
  blocks on diagonal. Curiosities: *fish* ~ *chocolate*, *coffee*; *blue* ~ *caramel* – "artifacts of training data";
  coffee drinks ~ flavours (syrups).
- Pretrained embedders: GloVe, word2vec (citations swapped – see errata), **fastText** – **157 languages**.
- **Sentence embeddings** (Cer et al. 2018 = Universal Sentence Encoder): Fig 20-6 compares **a dozen** sentences.

### B3. ELMo (20:L306–404)
- Problem: **nuance / polysemy**. *cupcake* one meaning → one embedding; **train** noun (*I rode on a train*) vs verb
  (*I like to train dogs*) → book frames as "give every meaning its own embedding" + "select the correct one".
- **ELMo** = Embedding from Language Models (Peters et al. 2018), Sesame Street Muppet; "first algorithm to do this in a
  big way"; **contextualized word embeddings**.
- Architecture (Fig 20-7): two forward RNN layers F1, F2 and two backward B1, B2, grouped **by direction** (each a 2-layer
  deep RNN); per word a forward tensor (left context) and a backward tensor (right context) → **concatenate** → E(it),
  E(was), … E(times). Red colour scheme because Elmo is red.
- ★ **Experiment** (Fig 20-8): 4 sentences with *train* as verb + 4 as noun; ELMo trained on **1 billion words**,
  **1,024-dim** embeddings (TF Hub); pairwise similarity of the *train* vectors → two clean blocks (verb vs noun).
- Embedding layer icon (Fig 20-9); usually the first layer.
- **ULMFiT** (Howard & Ruder 2018) mentioned alongside; pretrained on general text, then fine-tuned on medical/legal jargon.

### B4. Attention (20:L407–429)
- Example: *I saw a big dog eat his dinner* – translating *dog*: *saw* irrelevant; translating *his* needs *big dog*.
- Promise: focus on relevant words → save memory/compute; if not serial → parallel.
- Citations: "attention, or self-attention (Bahdanau, Cho, Bengio 2016; Sutskever, Vinyals, Le 2014; Cho et al. 2014)".
- QKV from databases; book first uses its own words: request / description / content.

### B5. Paint-store analogy (20:L430–487) ★★
- Need "**light yellow with a bit of dark orange**"; clerk new, doesn't know colours; compare your description with each
  can's **name**; pour in more of cans whose name matches better (funnel into empty can).
- Fig 20-10 numbers (6 cans): **Sunny Yellow 45 %, Purple Lollipop 0 %, Green Monster 0 %, Orange Crush 45 %, Lunch with
  Teal 10 %, Mellow Blue 0 %** (sum = 100 % ✔). *Lunch with Teal* sneaks in because of the word "with" (spurious match –
  nice illustration that weights are about the *key*, not the *value*).
- Mapping: request ↔ **query**, description on the can ↔ **key**, paint inside ↔ **value**. "Given a request, compare it to
  the description of each possible item and include some of the content of each item based on how well its description
  matches the request." (Good one-sentence definition to reuse.)

### B6. Self-attention (20:L489–638)
- Fig 20-11: sentence **The dog ate his dinner**; query of *dog* (red net) vs key/value of *dinner* (blue/green nets);
  "often each just a single fully connected layer". Scoring function **S**: "usually designed to produce a number between
  0 and 1" (inaccurate). Score scales the value.
- Fig 20-12: all 5 words at once for query *dog*; only **three** networks shared by all words (input→Q, input→K,
  input→V), applied once per word. Dashed line = "a **softmax** step applied to the scores, **followed by a division**"
  (wrong order – see errata); softmax "exaggerates the influence of close matches". Sum of scaled values = new tensor for
  *dog*, including *dog*'s own value; "each word often scores most highly with itself" (not guaranteed).
  When other words matter more: word-order changes, no direct translation, pronoun resolution.
- Fig 20-13: same for every word as query.
- ★ "Four steps regardless of sentence length": (1) inputs → Q,K,V; (2) score all Q vs all K; (3) scale values;
  (4) sum. Claims long sentences take the same time as short ones "as long as we have the memory and computing power".
- Name: **self**-attention because Q, K, V all come from the same inputs. Attention layer: in = list of vectors,
  out = same shape.
- Why embeddings are necessary (L612–638): back to keep/flint (1,003/1,004): raw IDs would score them as similar; we want
  *keep* ~ *retain, hold, reserve*, not ~ *flint, preposterous, dinosaur*. Q/K nets fine-tune the comparison in context;
  V net makes values mixable ("mixing two embedded words gives a word somewhere between them").

### B7. Q/KV attention (20:L640–669)
- Queries from one source, keys+values from another; closer to the paint story (customer brings query, store has K,V).
- Book: "used when we add attention to seq2seq, where the **queries come from the encoder, and the keys and values from the
  decoder**" – **reversed** (see errata). Also called **encoder-decoder attention** (today: *cross-attention*). Fig 20-14.

### B8. Multi-head attention (20:L672–720)
- Words alike by many metrics: nouns, colours, up/down, yesterday/tomorrow. ★ Song-lyrics example: similar meaning, same
  last-syllable sound (rhyme), same number of syllables, same stress pattern. Sports: same team / same role.
- Run several independent attention networks = **heads**, initialised independently, hope they learn different criteria.
- Fig 20-15: concat heads' outputs → one FC layer → output same shape as input → stackable.
- Attention also in CNNs (scale filter outputs by relevant locations; Liu 2018, H. Zhang 2019 = SAGAN).
- Fig 20-16 icons: (a) self-attn, (b) multi-head self-attn, (c) Q/KV, (d) multi-head Q/KV.

### B9. Transformers – prerequisites (20:L741–950)
- "Attention Is All You Need" (Vaswani et al. 2017); "unfortunately ambiguous name"; parallel training; outperforms RNNs.
- **Skip/residual connection** (He et al. 2015). ★ Portrait analogy: client wants a different ring → don't repaint the whole
  portrait, paint the new ring over the old one; layer computes only the *change* and adds it to the input. Claims: smaller,
  faster layers; better gradient flow → dozens/hundreds of layers. Skip around several layers (Fig 20-17 right).
  Transformer-specific claim: skips "keep track of the location of each element" (positional info).
- **Norm-add** (Fig 20-18): layer norm described as a *regularization* technique like dropout/batchnorm that "learns to
  adjust values so they approximate a Gaussian bump with mean 0, std 1". Book's variant: LN on the sublayer output, then add
  (x + LN(F(x))). Says Vaswani put LN "before the layer", TF tutorial "after the addition", "all comparable" (errata).
- **Positional encoding** (L851–937):
  - Problem: RNN gets order for free; attention mixes words, loses position.
  - Naive: append a few bits with the index (Fig 20-19 left: *Nara ate an apple* → 1,2,3,4). Problems: may run out of
    bits; too many = waste; needs special handling.
  - Better: function F(index) → a **128-element** vector (if embeddings are 128 long), **added** element-wise (Fig 20-19
    middle) = **positional embedding**; icon with a little sine wave (sinusoids, Vaswani 2017). No formula given.
  - Worries: adding alters the word vector; position may get lost. Answers: (i) the function "usually affects only a few
    bits at one end of the word's vector" (misleading), (ii) transformers learn to separate the two, (iii) skip connections
    "add the embedding back in after every stage" (Fig 20-20, *plum* + position embedding).

### B10. Assembling a Transformer (20:L951–1105)
- Fig 20-21: encoder stack of **E** blocks, decoder stack of **D** blocks; reminiscent of unrolled seq2seq but no recurrence.
  Both start with word embedding + positional embedding; decoder ends with FC + softmax; decoder is autoregressive
  (outputs appended to its own input list).
- **Encoder block** (Fig 20-22): multi-head self-attention with **8 heads** + norm-add; then "pointwise feed-forward" =
  two **1×1 convolutions**: **2048** (ReLU) → **512** (no activation) + norm-add. Book's role for FFN: "remove redundancy and
  focus on the most valuable information" (speculative).
- **Decoder block** (Fig 20-23): **masked** multi-head self-attention (8 heads; triangle icon) on outputs so far (initially
  only **[START]**) + norm-add → multi-head **Q/KV** attention (8 heads), Q from previous layer, K,V "from the concatenated
  outputs of all the encoder blocks" (inaccurate) + norm-add → 2048/512 1×1 convs + norm-add.
- Full model Fig 20-24.
- ★ **Masking example**: *My dog loves taking long walks*. Training in parallel: from *My dog loves taking long* predict
  each word; predicting *long* while seeing *long* is "too easy" (copying ≠ learning). So: predicting word 1 sees nothing,
  word 2 sees *My*, word 3 sees *My dog*, …, word 6 (*walks*) sees *My dog loves taking long*. Five parallel computations,
  each only sees preceding words → **masked (multi-head self-)attention**. Book says masking is added "during training".

### B11. Transformers in action (20:L1107–1144)
- Portuguese→English, TensorFlow tutorial (2019b), **50,000** training examples, trainable on a home computer.
- Input *você se sente da mesma maneira que eu?* (Google: *do you feel the same that way I do?*) → model: *do you see , do
  you get the same way i do ?* – imperfect but captures the spirit.
- Fig 20-25: attention heat-maps for each of the **8 heads** of the final Q/KV layer (output words × input tokens);
  some words split into several tokens.
- Advantages: as good/better than RNNs, parallel training, no finite state, no state-control networks.
- Downside: attention memory "grows dramatically" with input size (Tay et al. 2020 survey of efficient transformers).

### B12. BERT (20:L1147–1294)
- Encoder blocks are general-purpose sequence processors. **BERT** = Bidirectional Encoder Representations from
  Transformers (Devlin et al. 2019); Muppet joke; yellow colour scheme. Word embedder + position embedder + many encoder
  blocks (Fig 20-26). Dropout etc. omitted.
- **BERT-large: 340 million** parameters (✔ ≈ 334 M by my formula, matches); trained on **Wikipedia + over 10,000 books**
  (Zhu et al. 2015 = BooksCorpus); **24** trained versions available (Devlin et al. 2020).
- Pretraining tasks: **NSP** (two sentences with a separator token; does the 2nd follow the 1st?) and the **cloze** task
  (fill in removed words; Taylor 1953) → analogy to visual **closure** (Fig 20-27, incomplete shapes filled in by the eye).
- "Shallowly bidirectional" ELMo explained as "only two layers in each direction" (wrong – errata); BERT "deeply
  bidirectional", book prefers "**deeply dense**": every word vs every word, many times; "direction doesn't apply".
- ★ **Experiment 1 – grammaticality (CoLA)**: pretrained **12-encoder-block** BERT (McCormick & Ryan 2020) + downstream
  classifier = **single FC layer** (Fig 20-28: "10 additional identical blocks not drawn"); **4 epochs**. All 6 shown
  test sentences correct:
  grammatical: *Chris walks, Pat eats broccoli, and Sandy plays squash.* / *There was some particular dog who saved every
  family.* / *Susan frightens her.* — ungrammatical: *The person confessed responsible.* / *The cat slept soundly and
  furry.* / *The soundly and furry cat slept.*
  Test set ≈ **1,000** sentences, ≈ **82 %** correct; variants > **88 %** (Wang et al. 2019/2020 = GLUE).
- ★ **Experiment 2 – sentiment (SST2)**: "almost **7,000** movie reviews" labelled pos/neg (Socher 2013); pretrained
  **"DistillBERT"** (sic; Sanh et al.; Alammar 2019 notebook); same classifier. Positive: *a beautiful , entertaining two
  hours* / *this is a shrewd and effective film from a director who understands how to create and sustain a mood* / *a
  thoroughly engaging , surprisingly touching british comedy*. Negative: *the movie slides downhill as soon as macho
  action conventions assert themselves* / *a zombie movie in every sense of the word mindless , lifeless , meandering ,
  loud , painful , obnoxious* / *it is that rare combination of bad writing , bad direction and bad acting the trifecta of
  badness*. Test set **1,730** reviews, ≈ **82 %** correct. (1,730 = 25 % of 6,920 ✔ – i.e. sklearn's default split in
  Alammar's notebook.)
- BERT can be made to generate but it's awkward → use decoder blocks.

### B13. GPT-2 (20:L1296–1438)
- Decoder blocks without the Q/KV layer = masked self-attention + two 1×1 convs (Fig 20-29). "First system to do this in a
  big way" = **GPT-2** (Radford 2019), "Generative Pre-Training model 2" (both wrong – errata).
- Largest GPT-2: "**512 tokens** at a time, **48** decoder blocks, **12 heads** each, **1,542 million** parameters"
  (context and heads wrong – errata; 48 blocks and 1.5 B correct ✔). **WebText ≈ 8 million documents, ≈ 40 GB**.
- Fine-tune by continuing training on extra data, adjusting all weights.
- ★ **Zero-/one-/few-shot** (outfit example): instruction *Describe today's outfit* + prompt *Today I should wear:* →
  might say suit of armor / spacesuit / bear skin (zero-shot); add one example *Yesterday I wore a blue shirt and black
  pants* (one-shot) → bear skin less likely; 2–3 examples = few-shot (no sharp cutoffs).
- ★ **Medium GPT-2, zero-shot, no fine-tuning**: prompt *I woke up this morning to the roar of a hippopotamus.* →
  *"…I was in the middle of a long walk, and I saw a huge hippopotamus. I was so excited. I was so excited. I was so
  excited. I was so excited."* – endless loop. "Not the generator's fault, it's ours" – grammatical but boring.
- Fixes: **n-gram penalty** with n = 2 (penalise repeated word pairs); **beam search** (described idiosyncratically);
  "pick among several most probable words according to their probabilities" = book calls this **increasing the
  temperature** (temperature 0 = always most probable). Result: emotional monologue *"Oh, my God," I said. "I'm so sorry.
  I didn't mean to hurt you…"*.
- Small GPT-2 fine-tuned on Sherlock Holmes (Woolf 2019 = gpt-2-simple), prompt *I asked Holmes to explain.*,
  "slightly warm temperature" → several paragraphs of grammatical, self-referential pastiche (*"It is very simple really,"
  he replied … Mr. Latimer … long revolver*). Compare with the char-RNN output of ch19 (great before/after pair).
- GPT-2 also: cloze, predicting the next word when essential info is ≥ **50 tokens** back (= LAMBADA), QA, summarisation,
  translation.

### B14. Generators discussion – GPT-3, scaling, limits (20:L1439–1506)
- **GPT-3**: same block diagram, "more of everything": **2,048** tokens, **96** decoder layers, **96** heads, **175 billion**
  parameters (Brown 2020) ✔ (≈ 174.6 B by formula). Training ≈ **355 GPU-years**, ≈ **US$4.6 million** (cited as Alammar
  2018 – actually Lambda Labs 2020 estimate).
- Data: Common Crawl, "about a trillion words … after cleaning ≈ **420 billion** words (Raffel et al. 2020)" (conflated).
- Beta test → commercial product; uses: web layout code, programs, mock interviews, legal plain-language, fiction, poetry.
- Fine-tuning huge models is hard (need data not already in training set).
- "Researchers behind GPT-3 estimate 1 trillion parameters on 1 trillion tokens could extract everything" (Kaplan 2020) –
  misread (errata). "We'll probably know the answer soon… a game only the big and rich can play."
- AI Dungeon-like game (Walton 2020).
- **MMLU** (Hendrycks 2020): **57 tasks** (humanities, social sciences, STEM); "most output never came near human
  performance", especially poor on morality and law (outdated).
- Strong stance: "no idea what they're talking about", no common sense, reproduce biases; no notion of accuracy, fairness,
  kindness, honesty.

### B15. Data poisoning (20:L1508–1562)
- Manipulate training data so the model errs consistently or on a trigger. Example: insert sentences implying
  **strawberries are made of cement** → supermarket / building-contractor inventories mysteriously wrong.
- **Concealed data poisoning** (Wallace et al. 2020): poison texts never mention the target words.
- Headline rewording attack (Xu, Ramirez, Veeramachaneni 2020): *Turkey is put on track for EU membership* → "World";
  *EU puts Turkey on track for full membership* → misclassified "Business".
- Why nasty: anyone can publish on the web; can be planted long before a model exists (sleeper agents, *The Manchurian
  Candidate*); compromise is inside the model. "No methods for robust detection or certification currently exist."

### B16. Summary (20:L1565–1580) – recap only.

---------------------------------------------------------------------------------------------------

## PART C – Errata: inaccurate, outdated or oversimplified claims

Format: `file:Lnnn` – claim → correction.

### C1. Chapter 19
1. `19:L35–40` NLU called "the general field that studies natural language", NLP the statistical techniques → NLP is the
   umbrella field; NLU (understanding) and NLG (generation) are its sub-areas.
2. `19:L89–94` LM "tells how likely the sequence is a well-formed sentence" → an LM assigns a probability
   P(w₁…wₙ) = Π P(wₜ | w<ₜ), i.e. a next-token distribution; "well-formedness" is only an intuition.
3. `19:L102–104` Unicode 13.0.0 covers "154 written human languages" → **154 scripts** (writing systems), not languages;
   143,859 chars is correct for 13.0 (2020). Newer: Unicode 16.0 (2024) ≈ 155 k chars / 168 scripts; 17.0 (2025) ≈ 160 k.
4. `19:L108–116` Only char- vs word-level tokenization → all modern LMs use **subword** tokens (BPE: GPT-2 vocab 50,257;
   WordPiece: BERT ≈ 30,000). Kiegészítés.
5. `19:L136–145` "Unlike transfer learning, we modify all weights when we fine-tune" → fine-tuning is usually considered a
   *form* of transfer learning; freezing vs. not freezing is a choice within it (feature extraction vs full fine-tuning).
6. `19:L354–361` "Bob told John that he was hungry … the answer is Bob" → genuinely **ambiguous** (he may be Bob or John;
   subject preference only); a Winograd-schema pair (e.g. *The trophy didn't fit in the suitcase because it was too
   big/small*) would illustrate the point cleanly.
7. `19:L358–361` FC layers "lose the implicit ordering of the words" → an FC layer *does* keep position (each input slot
   has its own weights); the real problems are fixed window length, no weight sharing across positions (must relearn each
   pattern at every slot) and parameter growth with window size.
8. `19:L364–369` CNNs for sequences "still developing" → by 2017 ConvS2S (Gehring et al.), ByteNet, WaveNet were
   competitive; since 2023 also state-space models (S4, Mamba) and linear-RNN revivals (RWKV) – outdated.
9. `19:L616–623` BPTT as "a special variant of backpropagation" → it is ordinary backprop on the unrolled graph; because
   the weights are shared, the per-step gradients are **summed**. Often **truncated** BPTT in practice.
10. `19:L627–635` "it inevitably gets smaller by the same percentage on every step" → the factor is the product of
    per-step Jacobians (≈ W_hh·diag(σ′)); it varies step to step; vanishing occurs when the largest singular value is
    < 1 on average, exploding when > 1. The constant-60 % story is a fine toy, but should be labelled as such.
11. `19:L642–643, L693, L1138` citations "Hochreiter et al. 2001" for vanishing gradients and for LSTM → vanishing
    gradients: Hochreiter 1991 (diploma thesis), Bengio, Simard & Frasconi 1994; **LSTM: Hochreiter & Schmidhuber 1997**;
    forget gate: Gers, Schmidhuber & Cummins 2000. (2001 is a book chapter re-summarising.)
12. `19:L651–652` "We can avoid both vanishing and exploding gradients with LSTM" → LSTM *mitigates* vanishing gradients
    (additive cell-state path, "constant error carousel", forget gate ≈ 1); exploding gradients are handled with
    **gradient clipping** (Pascanu et al. 2013).
13. `19:L688–691` ★ "The LSTM doesn't require repeated copies of itself … so it avoids the problems … train using normal
    backprop" → **wrong**. An LSTM is unrolled and trained with BPTT exactly like a plain RNN. The difference is the
    **additive** update cₜ = fₜ⊙cₜ₋₁ + iₜ⊙c̃ₜ, so ∂cₜ/∂cₜ₋₁ = fₜ (no repeated squashing / weight-matrix multiplication).
14. `19:L681–687` "three internal neural networks" and a single state → standard LSTM has **four** learned transforms
    (forget, input, output gates + candidate c̃) and **two** states (cell state c, hidden state h); gates use sigmoid
    (0…1 multiplicative), candidate uses tanh.
15. `19:L696–698` GRU only named → GRU (Cho et al. 2014): 2 gates (update, reset), no separate cell state, ¾ of LSTM's
    parameters (3 vs 4 weight blocks).
16. `19:L883–891, L1017–1019` deep (bi-)RNN layers "specialised" (abstract language → mood → target language) and "training
    each LSTM individually", "swap in" layers → stacked RNNs are trained **end-to-end jointly**; layer roles emerge, are
    not assigned; swapping layers is not standard practice.
17. `19:L1036–1091` seq2seq training not described → decoder is trained with **teacher forcing** (gets the *true*
    previous word, not its own prediction); at inference greedy or beam search. Sutskever et al. also **reversed the
    source sentence** – a neat link to the book's own "feed backward" idea (19:L928–929).
18. `19:L1136–1138` "long-term dependency problem" = fixed-size context vector → in the literature "long-term dependency"
    means the difficulty of *learning* dependencies across long gaps (vanishing gradients; Bengio 1994). The fixed-size
    context vector is the **bottleneck** problem that motivated **Bahdanau attention** (2014/15) – which the book never
    shows as an RNN add-on (the most natural bridge from ch19 to ch20).
19. `19:L1158–1159, L1179–1180` "network needs to be trained one word at a time" → the true issue: computation is
    **sequential along time** (hₜ needs hₜ₋₁), so positions can't be parallelised; with teacher forcing all time steps
    contribute to one loss per sequence.

### C2. Chapter 20
20. `20:L210–213, L233–234` "the algorithm works out what each axis should mean"; "nobility on one axis and gender on
    another" → individual axes are generally not interpretable; relations are **directions** (e.g. woman−man) not aligned
    with coordinate axes; only distances/angles (cosine similarity) are meaningful.
21. `20:L231–233` king − man + woman = queen → works only because the input words are **excluded** from the candidate list;
    without exclusion the nearest vector is often *king* itself (Nissim, van Noord & van der Goot 2020). Analogy accuracy
    is far from perfect – the book's own lemon/trumpet failures show it.
22. `20:L290–292` ★ citations swapped and misspelled: "GLoVe (Mikolov 2013) and word2vec (Pennington, Socher, Manning
    2014)" → **word2vec = Mikolov et al. 2013**, **GloVe = Pennington, Socher & Manning 2014**. fastText = Bojanowski et al.
    2017 (subword n-grams), 157-language vectors Grave et al. 2018. The book never explains *how* word2vec is trained
    (CBOW / skip-gram, predict context words) – Kiegészítés; the "distributional hypothesis" (Harris 1954, Firth 1957
    "You shall know a word by the company it keeps") is implicit in L217–223 but not named.
23. `20:L312–322` "give every meaning its own embedding … select the correct embedding" → ELMo does **not** build a discrete
    sense inventory; it computes a **different vector for every occurrence** as a function of the whole sentence.
24. `20:L323–325` ELMo "first algorithm to do this in a big way" → earlier: context2vec (2016), **CoVe** (McCann et al.
    2017); ELMo was the breakthrough (NAACL 2018 best paper).
25. `20:L328–365` ELMo = concatenation of forward/backward top states → ELMo uses a char-CNN token layer + **2-layer biLSTM**
    (forward and backward LMs trained jointly but independently-directional); the final embedding is a **task-specific
    learned weighted sum** of all 3 layers ("scalar mix"), each layer = concat(fwd, bwd) → 1,024 = 2 × 512 dims.
26. `20:L420–422` "attention, or self-attention (Bahdanau…; Sutskever…; Cho…)" → Bahdanau attention (arXiv 2014, ICLR 2015)
    is **cross**-attention between decoder and encoder states; **self**-attention came later (Cheng et al. 2016; Lin et al.
    2017; Vaswani 2017). Sutskever 2014 and Cho 2014 are seq2seq/encoder-decoder papers *without* attention.
27. `20:L475–486` "The authors of the first paper on attention compared this process to a database query" → Bahdanau
    used "alignment model / annotations / energies"; the **query–key–value** vocabulary is from Vaswani et al. 2017 (with
    roots in key-value memory networks, Miller et al. 2016).
28. `20:L517–523, L615–617` scoring function "usually produces a number between 0 and 1" → in Transformers the score is
    the **dot product q·k / √d_k**, any real number; only **after softmax** are the weights in (0,1) and **sum to 1** (the
    paint percentages 45/0/0/45/10/0 are exactly such softmax weights).
29. `20:L552–556` ★ "a softmax step applied to the scores, **followed by a division**" → order is reversed: first divide
    by **√d_k**, *then* softmax. Reason: for random q,k with unit-variance components var(q·k) = d_k (Python: d=64 → 64,
    d=512 → ≈512; after /√d → ≈1 ✔), large scores saturate softmax (e.g. softmax[1,2,3] = [0,09; 0,24; 0,67] but
    ×8 → [0,00; 0,0003; 0,9997] ✔) → near-one-hot weights, tiny gradients.
30. `20:L557–559` "each word scores most highly with itself" → not guaranteed: W_Q ≠ W_K, so qᵢ·kᵢ needn't be maximal; many
    heads specialise on *other* tokens (previous token, syntactic head, etc.). Toy check: Q=K=[[1,0],[0,1],[1,1]] → token 1
    gives equal score to itself and to token 3 (0,707 each) ✔.
31. `20:L592–601, L1073–1075` "four steps regardless of the length… long sentences in the same time as short", "five words or
    five hundred, it runs in the same amount of time" → only the **sequential depth** is constant; work and memory grow as
    **O(n²·d)** / **O(n²)** (5 tokens → 25 scores, 500 → 250,000, 2,048 → 4,194,304 ✔). The book itself concedes this at
    L1141–1144.
32. `20:L607–608` "input is a list of words … output is the same" → same *shape*; outputs are new contextualised vectors.
33. `20:L646–650` ★ Q/KV in seq2seq: "queries come from the **encoder**, keys and values from the **decoder**" →
    **reversed**: queries from the **decoder**, keys/values from the **encoder** (book's own L987–991 and Fig 20-23 say it
    correctly). Modern name: **cross-attention**.
34. `20:L686–695` multi-head: no mention of dimensions → each head works in d_model/h dims (Transformer-base: 512/8 = **64**
    ✔), so h heads cost about the same as one full-width head; outputs concatenated then W_O. L689 "other layers" → "other
    heads".
35. `20:L780–783, L803–808` residuals make layers "smaller and faster" / "layer learns it doesn't need to process parts that
    don't change" → residuals don't shrink layers; the benefit is that identity is the default (F(x)=0 easy) and gradients
    flow through the identity path (∂/∂x of x+F(x) = I + ∂F/∂x). Precursor: Highway networks (Srivastava 2015).
36. `20:L815–823` layer norm as "regularization … like dropout … control overfitting" that "learns to … approximate a
    Gaussian with mean 0, std 1" → LayerNorm is a **normalization** for training stability, not mainly a regularizer; it
    **computes** mean/variance over the features of each token (not over the batch – contrast with BatchNorm), normalises
    to mean 0, var 1, then applies **learned** gain γ and bias β; it does not make the distribution Gaussian.
37. `20:L832–849` ★ LN placement: book says Vaswani 2017 put LN "before the layer" and "all choices comparable" → original
    Transformer is **Post-LN**: LN(x + Sublayer(x)) (after the addition). **Pre-LN** x + Sublayer(LN(x)) came later
    (GPT-2 2019; Xiong et al. 2020) and trains deep stacks more stably (no warm-up needed) – choices are **not** equivalent;
    modern LLMs use Pre-LN, often RMSNorm. The book's own variant x + LN(F(x)) is unusual.
38. `20:L896–915` sinusoidal PE without formula; "popular choice is sine waves" → formula:
    PE(pos, 2i) = sin(pos / 10000^(2i/d)), PE(pos, 2i+1) = cos(pos / 10000^(2i/d)). BERT and GPT-2/3 actually use
    **learned** absolute position embeddings (max 512 / 1,024 / 2,048 positions); current LLMs use **RoPE** (Su et al.
    2021) or ALiBi (2022). Vaswani used d_model = **512**, not 128.
39. `20:L920–922` "the function usually affects only a few bits at one end of the word's vector" → not bits but real
    components, and it affects **all** dimensions; low-index dims oscillate fast with position, high-index dims change very
    slowly (for small pos ≈ sin 0 = 0 / cos 0 = 1). Python, d = 8: pos 1 → [0,841; 0,540; 0,100; 0,995; 0,010; 1,000;
    0,001; 1,000] ✔ – the "end" dims barely move for short sequences, which is probably what Kazemnejad meant.
40. `20:L930–937` "embedding information never gets lost because it gets added back in after every stage" → the residual
    stream carries the *running* sum forward (x + F₁ + F₂ …); PE is not re-added at each layer. Intuition OK, mechanism
    over-stated.
41. `20:L986–991, L1056–1057` decoder K,V "from the concatenated outputs of all the encoder blocks" → in the original
    Transformer every decoder layer attends to the output of the **final (top) encoder layer** only.
42. `20:L1012–1018` FFN "removes redundancy and focuses on the most valuable information" → speculation; FFN is a per-token
    2-layer MLP (512 → 2048 → 512, ≈ 2,1 M params per layer ✔), holds ≈ ⅔ of non-embedding params; often interpreted as
    key-value memory (Geva et al. 2021).
43. `20:L1051–1052` masking "during training" → the causal mask is part of the decoder's definition, applied in training
    and inference (at inference it is implicit because future tokens don't exist yet). Implementation: set masked scores to
    **−∞ before softmax** → weight 0 (book gives no mechanism). Decoder input is the target **shifted right** with [START],
    so "predicting the first word sees no input words" (L1100–1101) really means "sees only [START]".
44. `20:L1126–1128` transformers "as good or better than RNNs" → understated: Vaswani 2017 set SOTA BLEU (EN-DE 28,4,
    EN-FR 41,8) at a fraction of training cost; base model: N = 6 enc + 6 dec layers, d_model 512, 8 heads, d_ff 2048,
    ≈ 65 M params (my rough count ≈ 63 M ✔).
45. `20:L1162–1196` BERT details missing / imprecise: special tokens **[CLS]**, **[SEP]**, segment embeddings; classification
    uses the [CLS] output; MLM masks **15 %** of tokens (80 % [MASK], 10 % random, 10 % unchanged). BERT-base: 12 layers,
    768 dims, 12 heads, ≈ 110 M; BERT-large: 24 layers, 1,024 dims, 16 heads, 340 M ✔. BooksCorpus ≈ 11,038 books / 800 M
    words + English Wikipedia ≈ 2,500 M words. RoBERTa (2019) showed **NSP is unnecessary**.
46. `20:L1185–1188` "24 trained versions of the original BERT" → these are the 24 *smaller* BERTs (Turc et al. 2019, released
    2020), not 24 versions of the original.
47. `20:L1207–1214` ★ ELMo "shallowly bidirectional … shallow refers to the use of only two layers in each direction" → in
    Devlin et al. "shallow" means ELMo merely **concatenates two independent unidirectional LMs**; left and right context
    never interact inside the network. BERT is "deeply bidirectional" because every layer attends jointly to both sides
    (made possible by the MLM objective).
48. `20:L1214–1219` "the notion of direction really doesn't apply when using attention" → it applies whenever a **causal
    mask** is used (GPT); bidirectional vs unidirectional is precisely encoder vs decoder.
49. `20:L1249–1252` CoLA "82 percent … more than 88 percent right" → CoLA's official metric is **Matthews correlation**
    (BERT-base ≈ 0,52, BERT-large ≈ 0,60); accuracy numbers are not comparable with GLUE leaderboard figures.
50. `20:L1255–1256` SST2 "almost 7,000 movie reviews" → GLUE SST-2 has ≈ 67,000 training *sentences* (phrases from ≈ 11,855
    sentences); the 6,920-sentence file is the subset used in Alammar's tutorial.
51. `20:L1263–1266` ★ "DistillBERT"; distilling = "carefully trim a trained network" → **DistilBERT** (Sanh et al. 2019);
    **knowledge distillation** (Hinton et al. 2015) trains a smaller *student* to mimic the *teacher*'s output distribution
    – not trimming (that is *pruning*). DistilBERT: 6 layers, ≈ 66 M params (40 % smaller), 60 % faster, ≈ 97 % of BERT's
    GLUE score.
52. `20:L1302–1304` ★ "The first system to do this [decoder-only] in a big way was … GPT-2" → **GPT (GPT-1, Radford et al.
    2018)** was already a 12-layer decoder-only Transformer (117 M params, 512-token context) – *before* BERT. Also Liu et al.
    2018 (Generating Wikipedia). "Generative Pre-Training model 2" → **Generative Pre-trained Transformer 2**.
53. `20:L1321–1323, L1440–1441` ★ GPT-2 XL "512 tokens … 12 heads in each" → GPT-2 (all sizes) has a **1,024-token**
    context; XL has **48 layers, d_model 1,600, 25 heads** (1600/25 = 64 ✔), 1,542 M ✔. 12 heads / 12 layers / 768 dims is
    GPT-2 *small* (≈ 124 M ✔). 512 tokens was GPT-1. BPE vocabulary 50,257; learned position embeddings; Pre-LN.
54. `20:L1330–1349` zero/one/few-shot attached to GPT-2 → the "shots" terminology and **in-context learning** were
    popularised by the GPT-3 paper (Brown et al. 2020, "Language Models are Few-Shot Learners"); GPT-2's paper emphasised
    zero-shot. Shots go in the prompt, **no weight update** – worth stressing vs. fine-tuning.
55. `20:L1379–1392` ★ beam search & temperature muddled → **beam search** keeps the k best *partial sequences* by cumulative
    log-probability at every step (deterministic) – not "take the first word of the best branch and throw the rest away"
    (that's closer to look-ahead/MCTS). Picking "among several of the most probable words according to their probabilities"
    is **(top-k) sampling**, not temperature. **Temperature T**: softmax(logits / T); T → 0 = greedy, T = 1 unchanged,
    T > 1 flatter. Beam search tends to *increase* blandness/repetition in open-ended generation; standard today: top-k /
    **nucleus (top-p) sampling** (Holtzman et al. 2019/2020) + repetition penalty.
56. `20:L1450–1451` GPT-3 cost "355 GPU years, $4.6 million (Alammar 2018)" → figure is a **Lambda Labs (2020)** estimate for
    V100s; Alammar 2018 predates GPT-3. Order of magnitude ≈ 3,14 × 10²³ FLOP.
57. `20:L1454–1457` GPT-3 data "about a trillion words … ≈ 420 billion words (Raffel et al. 2020)" → GPT-3 used filtered
    Common Crawl ≈ **410 B BPE tokens** (570 GB, from 45 TB) mixed with WebText2, Books1/2, Wikipedia; trained on **300 B**
    tokens total. Raffel et al. 2020 is **T5/C4**, a different dataset.
58. `20:L1468–1472` ★ "1 trillion parameters trained on 1 trillion tokens could extract everything we need" (Kaplan 2020) →
    Kaplan et al. noted their power-law trends **must break down** around ~10¹² params / tokens (a contradiction point), not
    that this suffices. **Chinchilla** (Hoffmann et al. 2022) revised compute-optimal scaling to ≈ **20 tokens per
    parameter** (GPT-3 was under-trained: 300 B tokens for 175 B params ≈ 1,7 tokens/param).
59. `20:L1476–1479, L1486–1492` "we'll probably know the answer soon"; MMLU "never came near human performance" → outdated:
    GPT-3 few-shot MMLU ≈ 43,9 %; GPT-4 (2023) ≈ 86 %; 2024–25 frontier models ≈ 88–92 % (MMLU now considered saturated;
    harder successors: MMLU-Pro, GPQA, HLE). Major post-book developments: InstructGPT/**RLHF** (2022), ChatGPT (Nov 2022),
    open models (LLaMA 2023+), mixture-of-experts, long contexts (≥ 128 k tokens), FlashAttention, RoPE, KV-cache.
60. `20:L1493–1506` "no idea what they're talking about … no common sense" → a philosophical position, presented as fact;
    behaviourally, modern LLMs pass many common-sense benchmarks; hallucination and bias remain real – keep as "tétel"
    only with nuance.
61. `20:L1560–1562` "no methods for robust detection … currently exist" → still largely true for certification, but there
    is now an active literature (data filtering, backdoor detection, provenance); outdated wording.
62. Global omissions (ch20): no formula for attention; no tokenization; no explanation of how word2vec/GloVe are trained;
    no Bahdanau RNN+attention bridge; no KV-cache; no mention of encoder-decoder T5 / BART; no instruction tuning / RLHF;
    no ViT (transformers outside text, 2020).

---------------------------------------------------------------------------------------------------

## PART D – Pedagogical ideas worth reusing (ranked)

1. **Keep/flint (1,003 vs 1,004) + 1,003.49 vs 1,003.51** (19:L331–347; reused at 20:L619–628): the cleanest possible
   motivation for embeddings *and* for why similarity scores need embeddings. Hungarian version: build a vocabulary by
   first appearance from a short Hungarian text and show two neighbouring IDs that are unrelated words.
2. **Animal chart with missing axis labels + arrow arithmetic** (20:L39–199): horse − fox = giant sloth;
   + roadrunner = brown bear. Easy to turn into a 2-D interactive widget (drag arrows, nearest-neighbour lookup). Then
   jump to king − man + woman = queen and the *failures* (lemon − yellow + green → ginger; trumpet − valves + slide →
   saxophone) for an honest "buktató".
3. **Paint-store analogy with explicit weights 45/0/0/45/10/0** (20:L430–487): query = request, key = label, value = paint.
   The "Lunch with Teal" 10 % (match on the word *with*) is a great buktató: weights depend on keys, mixture uses values.
   Combine with a small numeric toy: 3 tokens, 2-D vectors, scores → /√d → softmax → weighted sum (Python-verified toy:
   Q=K=[[1,0],[0,1],[1,1]], V=[[1,0],[0,1],[0,5;0,5]] → weights for q₁ = [0,401; 0,198; 0,401], output [0,602; 0,398]).
4. **Ice-cream sundae state** (19:L392–459): compression of history ("2 scoops", "Marty's favorite"), hidden state, order
   matters. Perfect for the RNN "state" step.
5. **Vanishing/exploding toy numbers**: 0,4⁸ ≈ 0,00066 (< 1/1000) vs 1,6⁸ ≈ 42,9. Good "kis, kézzel számolható eset";
   gyakorló variants: 0,9²⁰ ≈ 0,12; 1,1²⁰ ≈ 6,7 ✔.
6. **Failing FC baseline progression** (19:L158–370): sine waves (works) → sunspots (works OK) → words (fails) – shows the
   problem is the *representation*, not just capacity.
7. **"it was the best of → times"** unrolled RNN with junk early predictions (swam, night, jellyfish) (19:L564–601).
8. **Polysemy contrast triple "cast"** (lancei / gesso / elenco) and ELMo's "train" verb vs noun similarity matrix
   (19:L912–922; 20:L370–383) → szembeállító pár for static vs contextual embeddings. Hungarian candidates: *vár*
   (castle / to wait), *ég* (sky / burns), *nyúl* (rabbit / reaches), *fej* (head / milks).
9. **Variable sentence lengths** 5/4/6 words (EN/PT/Gaelic) + French adjective order (19:L1024–1034) → why seq2seq.
10. **"Table … four sturdy ___ legs"** short vs long sentence (19:L1125–1135) → fixed context-vector bottleneck.
11. **Masking with "My dog loves taking long walks"** (20:L1079–1105): turn into a 6×6 lower-triangular mask table.
12. **Portrait-ring analogy for residual connections** (20:L763–779).
13. **Song-lyrics multi-criteria similarity** (meaning / rhyme / syllable count / stress) for multi-head attention
    (20:L678–684).
14. **Before/after generation pairs**: char-RNN Holmes text (19:L810–823) vs fine-tuned GPT-2 Holmes text (20:L1416–1430);
    GPT-2 "I was so excited." loop vs decoding fixes (20:L1360–1401) → great for a decoding (greedy / temperature / top-k)
    step with a small widget.
15. **Zero/one/few-shot outfit example** (20:L1335–1349) – simple, memorable.
16. **Ambiguity collection** for motivation: hot dog train (6), telescope sentence (132), "I didn't say he stole the money"
    (7), Groucho Marx elephant.
17. **Data poisoning: strawberries made of cement**; Turkey/EU headline re-wording (20:L1508–1562) – ethics box.
18. **BERT CoLA sentences** and **SST-2 reviews** (verbatim lists) – nice for a "which model / which head?" quiz.

---------------------------------------------------------------------------------------------------

## PART E – Key numbers at a glance (for quiz distractors)

| Item | Value in book | Note |
|---|---|---|
| Unicode 13.0 | 143,859 chars, "154 languages" | 154 *scripts* |
| English dictionary | ≈ 300,000 entries | |
| Char alphabet | 89 symbols | |
| Sine data | 500 samples → 495 windows (w=5), 50 epochs, 250 test | ✔ |
| Sunspots | monthly 1749–2018, ~11-yr cycle | |
| Tale of Two Cities | 17,267 words, 3,458 unique, ~3,000 in train, ES at 8 epochs | |
| keep / flint | 1,003 / 1,004 | |
| Big window | 20 inputs, 20 neurons | |
| Vanishing / exploding | −60 %/step → <1/1000 after 8; +60 % → ≈43× | ✔ |
| Tiny LSTM | 3 hidden values | 64 params ✔ (mine) |
| Char-RNN | window 40, LSTM 128 + LSTM 128 + Dense 89, ~500 k strings every 3rd char | ≈ 254,681 params ✔ (mine) |
| Ambiguity | hot dog train 6; telescope 132; stole money 7 | |
| seq2seq EN→NL | 1,024 state, ~50 k pairs, ~40 k train, 10 epochs | |
| spaCy vectors | 684,754 words × 300 dims | |
| fastText | 157 languages | |
| ELMo | 1 B-word training, 1,024 dims | 2 × 512 |
| Paint weights | 45/0/0/45/10/0 % | sum 100 ✔ |
| PE example | 128-dim embedding | original 512 |
| Transformer block | 8 heads, FFN 2048 → 512 | d_k = 64 ✔ |
| PT→EN transformer | 50,000 examples, 8 heads in final Q/KV layer | |
| BERT-large | 340 M params, Wikipedia + >10,000 books | ✔ |
| BERT CoLA | 12 blocks, 4 epochs, ~1,000 test, 82 % (variants >88 %) | metric: MCC |
| DistilBERT SST2 | ~7,000 reviews, 1,730 test, ~82 % | 1,730 = 25 % of 6,920 ✔ |
| GPT-2 XL | "512 tokens, 48 blocks, 12 heads", 1,542 M; WebText 8 M docs, 40 GB | ctx 1,024, 25 heads |
| GPT-3 | 2,048 tokens, 96 layers, 96 heads, 175 B; 355 GPU-yr, $4.6 M; "420 B words" | 410 B CC tokens, 300 B trained |
| Kaplan "everything" | 1 T params on 1 T tokens | misread; Chinchilla ≈ 20 tok/param |
| MMLU | 57 tasks | GPT-3 ≈ 44 % → today ≈ 90 % |

## PART F – Hungarian terminology hints (for `box tip`)
token → token (tokenegység); vocabulary → szótár/szókészlet; embedding → beágyazás; contextualized embedding →
kontextusfüggő beágyazás; hidden state → rejtett állapot; recurrent cell/layer → rekurrens cella/réteg; unrolled → kiterített
(időben kibontott); BPTT → időben visszaterjesztés; vanishing/exploding gradient → eltűnő/robbanó gradiens; gate → kapu;
encoder/decoder → kódoló/dekódoló; context vector → kontextusvektor; attention → figyelem(mechanizmus); query/key/value →
lekérdezés/kulcs/érték; self-/cross-attention → ön-/keresztfigyelem; multi-head → többfejű; residual/skip connection →
maradék-/átugró kapcsolat; layer norm → rétegnormalizálás; positional encoding → pozíciókódolás; masking → maszkolás
(kauzális maszk); fine-tuning → finomhangolás; downstream task → célfeladat (downstream); few-shot → néhány példás
(few-shot); temperature → hőmérséklet; beam search → nyalábkeresés; data poisoning → adatmérgezés.

## Python verification log (stdlib, `python3 -I`)
0,4⁸ = 0,00065536; 1,6⁸ = 42,95; first k with 0,4ᵏ < 10⁻³: k = 8 · FC 5-5-1 = 36 params; FC 20-20-1 = 441 ·
LSTM(1→3)+Dense = 64; GRU variant 49 · char-RNN 111,616 + 131,584 + 11,481 = 254,681 · 500−5 = 495; 500 k × 3 = 1,5 M ·
Transformer-base FFN/layer 2,099,712; whole ≈ 63 M (37 k shared vocab) · head dims BERT-L 64, GPT-2 XL 64, GPT-3 128 ·
GPT-2 XL ≈ 1,558 M, small ≈ 124 M; GPT-3 ≈ 174,6 B; BERT-base ≈ 109 M, BERT-large ≈ 334 M · paint sum 100 ·
6,920 × 0,25 = 1,730 · var(q·k) for d = 4/64/512 ≈ 4,1/64,1/534 → after /√d ≈ 1,0 · softmax[1,2,3] = [0,090; 0,245;
0,665], ×8 → [0,000; 0,0003; 0,9997] · toy attention (above) · sinusoidal PE d = 8, pos 0–3 (above) · n² = 25 / 250,000 /
4,194,304.
