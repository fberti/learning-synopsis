# Ch12 source digest — FLLM, HGA, MLSYS (embeddings, sequences, attention, Transformer)

Extracts are in `_parts/src/`. `L123` = line number in the named file.
- `FLLM12.txt` = Xiao & Zhu, *Foundations of Large Language Models* (2025), ch1 "Pre-training" (L1–1867) + ch2 "Generative Models" (L1868–5171). PDF pp. 8–102 = book pp. 1–95 (offset +7).
  - Map: 1.1 pre-training paradigms L46; 1.2 self-supervised tasks L336 (decoder-only L346, encoder-only/MLM L404–746, enc-dec L750–1046, comparison table L1048–1141); 1.3 BERT L1097–1565; 1.4 applying BERT L1570–1840;
    2.1 LLM intro L1937 (decoder-only Transformer L2008–2132, Table 2.2 model sizes L2158–2182, training L2135, fine-tuning L2206, alignment/prompting L2457–2958 – skimmed only), 2.2 training at scale L2960 (LayerNorm/RMSNorm L3045, FFN activations L3080, no-bias L3144, distributed L3170, scaling laws L3338), 2.3 long sequences L3494 (sequence parallelism L3543, sparse/linear attention L3638, KV-cache & memory L3767, MQA/GQA L4287, positional extrapolation/interpolation L4394, T5 bias L4496, ALiBi L4611, RoPE L4747, position interpolation L4939, remarks L5025).
- `HGA12.txt` = Roitman, *The Hitchhiker's Guide to Agentic AI* v1.3 (arXiv 2606.24937, 2026). PDF page = book page.
  - Map: pp. 39–62 = §1.1 pipeline L13, §1.2 tokenization L45–235, §1.3 Transformer L237–1124 (enc-dec L246–345, dec-only vs enc-dec L351, embeddings L367–472, self-attention + cost L474–566, MHA/GQA/MLA L568–595, positional encodings L597–785, FFN L786, LayerNorm/RMSNorm/pre-post L803–858, model-size table L860–878, attention pathologies L884–991, attention visualisation/SAE L993–1124), §1.4 prediction heads L1127–1324;
    pp. 73–76 = FlashAttention L1367–1550 (+ CLM objective L1557); pp. 85–87 = MoE L1574–1730; pp. 114–116 = roofline / attention memory-bound L1741–1912; pp. 119–120 = KV cache, PagedAttention, continuous batching L1914–2029.
- `MLSYS12_seq.txt` = Reddi et al., *Machine Learning Systems* ch4 "DNN Architectures". PDF = book + 60.
  - Map: PDF 271–293 (book 211–233): §4.4 RNN L22–378, §4.5 attention + Transformers L381–1027, §4.6 building blocks L1030–1269; PDF 294–300: §4.7 primitives L1270–1663; PDF 304–308: §4.8 selection, Tables 4.6/4.7 L1664–1925; PDF 310–313: §4.9 inductive biases, §4.10 fallacies, §4.11 summary L1926–2118.
- Checks: `calc/c12_digest_check.py` (run with `./run.sh`). Everything marked ✓ was recomputed there.

---

## 0. Quick answers to the brief

- **Attention formula** (all three agree): `Attention(Q,K,V) = softmax(QKᵀ/√d_k + M) V`.
  - HGA L480–486 is the cleanest: Q = XW_Q, K = XW_K, V = XW_V with W ∈ ℝ^{d×d_k}, X ∈ ℝ^{n×d}, causal M_ij = 0 if i ≥ j, else −∞.
  - FLLM Eq. 2.6 (L2046) divides by √d, not √d_head. Its mask text is transposed (see FLLM error 1).
  - MLSYS (L509, L768–770) has no mask at all. It gives the best "why √d_k" argument: the dot product of d_k-dim vectors has variance d_k (L795–801).
- **Shapes / notation to adopt.**
  - n (or m in FLLM) = sequence length; d (= d_model) = width; H (HGA) / τ (FLLM) / h (MLSYS) = heads; d_k = d/H.
  - Multi-head: `MultiHead = Concat(head_1..head_H) W_O`, W_O ∈ ℝ^{d×d} (HGA L576, FLLM Eq. 2.7–2.11 L2055–2072, MLSYS L786–792).
- **Pre-norm vs post-norm.** Post-LN = `LN(x + F(x))` (original Transformer, BERT). Pre-LN = `x + F(LN(x))` (GPT-2 onwards, Llama, Mistral).
  - **Both books contain a wrong formula, each a different one.** That makes a good warn box.
  - HGA's Pre-LN/Post-LN box writes Post-LN as `h + LayerNorm(Attn(h))` (L844). Its own figure caption (L327) has it right.
  - FLLM writes pre-norm as `LNorm(F(input)) + input` (L2037, L3056).
- **Positional encodings.**
  - Sinusoidal: HGA L620–632 gives the formula. The FLLM chapter only describes it verbally (L4446–4450).
  - Learned absolute: HGA L634–645; FLLM L4405–4416.
  - RoPE: FLLM gives the full derivation (L4747–4934). HGA gives the formula, properties and length extension (L647–707).
  - ALiBi: FLLM L4611–4743, HGA L708–725. T5 bias: FLLM L4496–4606.
  - Position interpolation / NTK: FLLM L4939–5022, HGA L690–764.
- **Encoder vs decoder vs encoder–decoder, BERT vs GPT.**
  - FLLM ch1 is the backbone: three architectures × pre-training objectives, Table 1.1 L1116–1141.
  - HGA L246–364 adds the enc-dec block structure (3 sub-layers in the decoder), cross-attention, and a short "why decoder-only won" box.
- **Why Transformers won.**
  - Parallelism: MLSYS L381–437, L924–930; HGA L291–296 (masking enables parallel training).
  - Self-supervised pre-training: FLLM 1.1.1 L79–138.
  - Scaling: FLLM 2.2.4 L3338–3491 (Kaplan, Chinchilla formulas); HGA §1.3.3 L361–364.
- **RNN/LSTM.**
  - Only MLSYS covers RNNs: h_t = f(W_hh h_{t−1} + W_xh x_t + b), a 100/128-dim worked example, sequential bottleneck, vanishing gradients.
  - LSTM/GRU appear **only in footnotes** (MLSYS L1135–1157). There are no gate equations anywhere in these three sources → Kiegészítés (or from DLV12).
- **Tokens / tokenization.** Only HGA (L45–235): BPE algorithm, the granularity trade-off table, vocab sizes, a Llama-3 tokenizer example, special tokens.
- **Compute / memory numbers.**
  - HGA attention-cost Table 1.4 (L504–511, one error), FlashAttention numbers (L1381–1398, L1461–1471).
  - HGA roofline example (L1790–1834). KV-cache formula with a Llama-3-70B example (L1924–1933, ✓ all).
  - MLSYS Tables 4.3/4.6/4.7 (L1469–1494, L1713–1736, L1874–1889; several errors).

---

## 1. FLLM — Foundations of LLMs (Xiao & Zhu)

### 1.1 How it builds things up
- Ch1 starts from a single abstraction `o = g(x0..xm; θ)` with x0 = ⟨s⟩ or [CLS] (L53–63). It then contrasts three pre-training paradigms (Fig. 1.1 L159–181):
  - unsupervised (layer-wise reconstruction, Bengio 2006, L88–95);
  - supervised (pre-train on sentiment, transfer to subjectivity, L96–116);
  - self-supervised (labels made from the text itself, L117–133).
- Two ways of adapting (L142–332):
  - fine-tuning an encoder plus a classifier: `Pr(·|x) = Classify_ω(Encode_θ̂(x))`, Eq. 1.3 L218. The encoder can stay frozen (train ω only) or be fully fine-tuned.
  - prompting a generator: zero-shot "I'm ___" completion L281–289; instruction prompt L296–299; few-shot demonstrations L316–324.
- §1.2 organises pre-training **by architecture**: decoder-only → encoder-only → encoder–decoder. §1.2.4 then re-groups the same material **by objective** (LM, MLM, permuted LM, discriminative, denoising; L1050–1076). Good pedagogical move: architecture and objective are orthogonal.
- Ch2 restates LM as the chain rule (Eq. 2.1–2.2 L1948–1960). Greedy generation is shown step by step in Table 2.1 (L1976–1985), then the decoder-only Transformer is built (L2008–2132).

### 1.2 Exact formulas worth quoting
- **LM loss** (Eq. 1.5–1.7, L366–397): Loss = Σ_{i=0}^{m−1} CE(p_{i+1}^θ, onehot(x_{i+1})), which is equivalent to MLE.
- **MLM objective** (Eq. 1.10–1.12, L512–542). Only masked positions A(x) count: max Σ_{i∈A(x)} log Pr(x_i | x̄).
- **BERT loss** = Loss_MLM + Loss_NSP (Eq. 1.17 L1109). NSP: −log Pr(c_gold | h_cls) (Eq. 1.19 L1270).
- **BERT input embedding** e = x + e_pos + e_seg (Eq. 1.20 L1283). Segment table L1289–1292 ([CLS] It is raining . [SEP] → e_A; I need an umbrella . [SEP] → e_B).
- **Post-norm** `output = LNorm(F(input) + input)` (Eq. 2.4 L2025; BERT L1296–1298). **Pre-norm** as printed: `LNorm(F(input)) + input` (Eq. 2.5 L2037) ✗, see error 2.
- **QKV attention** `Att_qkv(Q,K,V) = Softmax(QKᵀ/√d + Mask)V`, Q,K,V ∈ ℝ^{m×d} (Eq. 2.6 L2046–2052).
- **Multi-head** (Eq. 2.7–2.11 L2055–2072): F(H) = Merge(head_1..head_τ)·W_head with W_head ∈ ℝ^{d×d}; head_j = Att(HW_j^q, HW_j^k, HW_j^v) with W_j ∈ ℝ^{d×d/τ}.
- **Output layer** Softmax(H^L W_o), W_o ∈ ℝ^{d×|V|} (Eq. 2.12 L2073–2086).
- **SFT loss** only on the response: L = −log Pr(y|x) (Eq. 2.18 L2427). Example "⟨s⟩ Square this number . 2 . | The result is 4 ." (L2436–2441).
- **LayerNorm** LNorm(h) = α·(h−μ)/(σ+ε) + β (Eq. 2.23 L3060). **RMSNorm** α·h/(σ_rms+ε) + β (Eq. 2.24 L3071) "used in the LLaMA series".
- **FFN** σ(hW_h + b_h)W_f + b_f with W_h ∈ ℝ^{d×d_h} (Eq. 2.25 L3087). Typical d_ffn = 4d (L1320–1322).
  - GeLU = hΦ(h) (Eq. 2.27 L3109; used by BERT, GPT-3, BLOOM L3113–3114).
  - GLU / GeGLU (Gemma) / SwiGLU (PaLM, LLaMA) (Eq. 2.28–2.30 L3115–3132).
  - Bias removal for stability (PaLM; LLaMA, Gemma) L3144–3153.
- **Sequence-parallel softmax** (Eq. 2.40–2.44 L3562–3631): the softmax denominator is split across nodes, then all-reduce.
- **Sparse attention** restricted to an index set G, renormalised (Eq. 2.48 L3709). **Linear attention** as a recurrence μ_i = μ_{i−1} + k'_iᵀv_i, ν_i = ν_{i−1} + k'_iᵀ (Eq. 2.49–2.51 L3734–3745): "constant cost per step", a bridge to RNNs (L3747–3762).
- **KV cache size** O(L·τ·d_h·m). Sliding window: O(L·τ·d_h·m_w). MQA: O(L·d_h·m). GQA: O(L·n_g·d_h·m) (L4295–4337).
- **Relative bias** α(i,j) = Softmax((q_i k_jᵀ + PE(i,j))/√d + Mask) (Eq. 2.76 L4510).
  - T5 buckets: Eq. 2.78–2.79 L4536–4564; Fig. 2.10 with n_b = 32, dist_max = 1024 (L4578–4590).
  - ALiBi: PE(i,j) = −β(i−j) with β_k = 2^{−8k/n_head} (Eq. 2.82–2.84 L4622–4734; the exponent's "/n_head" is lost in extraction at L4734). Table 2.4 also lists Kerple, Sandwich and FIRE (L4715–4728).
- **RoPE.**
  - 2D rotation Ro(x,θ) = xR_θ with R_θ = [[cos, sin],[−sin, cos]] (Eq. 2.86 L4814–4826). Repeated t times: Ro(x,tθ) (Eq. 2.87).
  - Complex form x'e^{itθ} (Eq. 2.88). Key identity (Eq. 2.90 L4866–4868): Ro(x,tθ)·Ro(y,sθ)ᵀ = x R_{(t−s)θ} yᵀ, so the score depends only on t−s.
  - d-dim block-diagonal form (Eq. 2.92) with θ_k = 10000^{−2(k−1)/d} (L4909). Element-wise implementation (Eq. 2.93 L4913–4928).
- **Position interpolation** Ro(x_i, (m_l/m)·iθ) (Eq. 2.100 L4980). **Base scaling (NTK)** b → λb with λ = (m/m_l)^{d/(d−2)} (Eq. 2.101–2.104 L4983–5018; ✓ λ ≈ 4.09 for s = 4, d = 128). Period of dimension k: T_k = 2π·b^{2(k−1)/d} (Eq. 2.98).
- **Scaling laws** (L3394–3472). Power law L(x) = ax^b (+ε_∞).
  - Kaplan: L(N) = (N/8.8·10¹³)^−0.076, L(D) = (D/5.4·10¹³)^−0.095 (L3405–3408).
  - Chinchilla: L(N,D) = 406.4/N^0.34 + 410.7/D^0.28 + 1.69 (Eq. 2.39 L3465–3471). ✓ 70B params / 1.4T tokens → 1.94.

### 1.3 Concrete numbers / examples
- **BERT sizes** (L1372–1374):
  - BERT_base: d = 768, L = 12, n_head = 12, 110M.
  - BERT_large: d = 1024, L = 24, n_head = 16, 340M.
  - ✓ Recomputed with V = 30,522, 512 positions, 2 segments, d_ff = 4d: 109.5M / 335.1M.
  - The digest's V/positions are a Kiegészítés; FLLM does not give vocab or max length.
- **BERT masking**: 15% selected; of these 80% → [MASK], 10% random token, 10% unchanged (L1165–1192). Running example Fig. 1.5 (L1216–1260): "[CLS] It is raining . [SEP] I need an umbrella . [SEP]" → "It is [MASK] … I need [MASK] hat".
- BERT's practice of training on short sequences first, then full length (L1383–1385; Kiegészítés: 90% of steps at 128, rest at 512).
- **BERT follow-ups.**
  - RoBERTa: more data and compute, NSP removed with no loss (L1392–1397).
  - 1.5B DeBERTa-like and 3.9B Megatron-BERT (L1398–1406).
  - Distillation, pruning, head pruning (Michel 2019), quantization, early exit, cross-layer sharing/ALBERT (L1409–1452).
  - mBERT: 104 languages (L1462). XLM translation LM: "鲸鱼 是 哺乳 动物 。↔ Whales are mammals ." (L1490–1511).
- **BERT application heads** (L1604–1820):
  - single-text classification on h_cls;
  - text-pair classification, len = n+m+2 (L1661);
  - regression with a sigmoid;
  - NER with BIO tags, Eq. 1.23;
  - span prediction with p_beg / p_end, Eq. 1.24–1.25;
  - BERT as the encoder for NMT, with an adapter.
- **Table 2.2** (L2158–2182) — LLM sizes (params / L / d / heads Q/KV):
  - GPT-1: 0.117B, 12, 768, 12/12.
  - GPT-2: 1.5B, 48, 1600, 25/25 (✓ 1.56B recomputed).
  - GPT-3: 175B, 96, 12,288, 96/96 (✓ 12·L·d² ≈ 174B).
  - LLaMA2: 7B (32, 4096, 32/32), 13B (40, 5120, 40/40), 70B (80, 8192, "64/64" ✗).
  - LLaMA3/3.1: 8B (32, 4096, 32/8), 70B (80, 8192, 64/8), 405B (126, 16,384, 128/8).
  - Gemma2: 2B (26, 2304, 8/4), 9B (42, 3584, 16/8), "37B" ✗ (46, 4608, 32/16).
  - Qwen2.5: 0.5B (24, 896, 14/2), 7B (28, 3584, 28/4), 72B (80, 8192, 64/8).
  - DeepSeek-V3: 671B (61, 7168, 128/128).
  - Falcon: 7B (32, 4544, 71/71 ✗), 40B (60, 8192, 128/128 ✗), 180B (80, 14,848, 232/232 ✗).
  - Mistral: 7B (32, 4096, 32/32 ✗).
  - The ✗ entries are listed under errors.
- **Table 2.3** training tokens (L2941–2951): GPT3-175B 0.5T ✗, Falcon-180B 3.5T, "LLaMA2-65B" 1.0–1.4T ✗, "PaLM-450B" 0.78T ✗, Gemma-7B 6T.
- Data cleaning: Penedo et al. remove 90% of web-scraped data (L2987–2991). Code data helps reasoning (L2998–3001).
- Distributed training (L3187–3298): data / model / tensor / pipeline parallelism, with ASCII timelines (L3228–3290).
- Long-context taxonomy (L3505–3512): long input / long output / both. C++-file example (L3516–3518).
- T5 bucket example: n_b = 32, dist_max = 1024. Offsets 0–15 get one bucket each; then 16–20, 21–26, 27–33 … 802–∞ (Fig. 2.10 L4580–4587).
- Interpolation analogy: model trained on [1,10], use on [1,20] by dividing by 2 (L4438–4443). Extrapolation analogy: "15 follows 10" (L4429–4436).

### 1.4 Claims that look wrong, outdated or oversimplified
1. **L2050–2052** — causal mask "entry (i,k) is 0 if i ≤ k, −inf otherwise". With rows = queries this lets token i see the *future*. → It should be 0 if k ≤ i (HGA L273–275 has it right).
2. **L2035–2037 and L3056** — "pre-norm: output = LNorm(F(input)) + input". → Pre-norm is `input + F(LNorm(input))`: LN goes *inside* the residual branch, before F (Wang et al. 2019; GPT-2; Llama).
3. **L2046** (Eq. 2.6) — scales by √d, but in multi-head each head works in d/τ dims (L2072). → The scale should be √(d/τ) = √d_k.
4. **L2165** — LLaMA2-70B "64/64". → Llama-2-70B uses GQA with 8 KV heads (64/8). The 7B/13B models are MHA.
5. **L2171** — "Gemma2 37B". → The model is Gemma 2 **27B** (46 layers, d = 4608, 32/16 heads; those are correct).
6. **L2176–2178** — Falcon heads "71/71, 128/128, 232/232". → Falcon-7B uses multi-query (71/1). Falcon-40B/180B use 8 KV groups (128/8, 232/8).
7. **L2179** — Mistral-7B "32/32". → 32 query / 8 KV heads (GQA) plus a 4096-token sliding window.
8. **L2942** — GPT-3 trained on 0.5T tokens. → The GPT-3 paper trains on **300B** tokens; ~500B is the size of the weighted dataset.
9. **L2945** — "LLaMA2-65B 1.0T∼1.4T". → That row is LLaMA-1 (65B on 1.4T). Llama 2 (7–70B) used 2T tokens.
10. **L2947** — "PaLM-450B". → PaLM is **540B** (780B tokens is correct).
11. **L3118** (Eq. 2.28) — GLU "σ(hW1+b1) ⊙ (W2+b2)". The second factor is missing h. → σ(hW1+b1) ⊙ (hW2+b2); same typo in Eq. 2.29–2.30.
12. **L4339–4340** — "when n_g = 1, it becomes the GQA model". → With n_g = 1 it is **MQA**.
13. **L4447** — "sinusoidal encoding, the most common positional embedding method". → Outdated: since ~2022 RoPE dominates (Llama, Qwen, Mistral, DeepSeek); see HGA Table 1.6.
14. **L4757 / L4934** — RoPE presented as an input embedding `e_i = x_i R(i)` replacing x + PE. → In practice RoPE rotates **q and k inside every attention layer**; it is never added or applied to the token embedding or to V.
15. **L2423** — `sample = [y_sample, x_sample]`. Order reversed. → The sequence is [x; y] (prompt then response).
16. **L3549** — "8-bit or 16-bit fixed-point data types". → FP16/BF16 are floating point; only INT8/INT4 are integer/fixed-point.
17. **L3071** — RMSNorm written with +β. → Zhang & Sennrich's RMSNorm and LLaMA have no shift term (HGA L840 is correct).
18. **L1291** — BERT positions labelled PE(0)…PE(11). This can suggest sinusoidal encodings. → BERT uses *learned* absolute position embeddings (512 positions).
19. **L310** — "in-context learning (ICT)". → The usual abbreviation is ICL.
20. **L3326** — calls "gradient accumulation" the key operation of mixed-precision training. → The key ingredients are an FP32 master copy plus loss scaling (Micikevicius 2018). Gradient all-reduce is a separate concern.

### 1.5 Pedagogical ideas worth reusing
- **Fig. 1.3 (L652–688)**: three 5×5 attention-mask grids side by side. (a) causal LM, x0 → x1 → … → x4; (b) MLM, x1 and x3 masked; (c) permuted order x0 → x4 → x2 → x1 → x3, each row annotated with its conditional probability. Ideal for a "which cells are allowed?" widget or quiz.
- **Table 2.1 (L1976–1985)**: greedy generation "⟨s⟩ a → b → c → d" with the decision rule and the running sequence probability. Good first example for the autoregressive loop.
- **Table 1.1 (L1116–1141)**: one sentence ("The kitten is chasing the ball .") under 13 objectives (causal, prefix, MLM, MASS, BERT-style, permuted, NSP, …, document rotation). A contrast pair for "same data, different objective".
- MLM toy "The early bird catches the worm" → "The [MASK] bird catches the [MASK]" with the explicit log-prob sum (Eq. 1.12, L537–542).
- ELECTRA replaced-token illustration: "The boy spent hours working on toys" → "decades" (L716–734).
- BART corruptions on one sentence: masking / deletion / span masking / sentence reorder / rotation (L980–1039).
- T5 sentinel example "[CLS] The puppies are [X] outside [Y] . → [X] frolicking [Y] the house [Z]" (L895–896).
- **RoPE intuition Fig. 2.12 (L4771–4809)**: "cat" and "sleeping" are 2 apart in one sentence (positions 2→4) and in another (9→11). After rotating each by its position, the **angle between them is the same 7θ**: rotation keeps relative position. Great for a 2D rotation widget.
- **T5 bias vs ALiBi matrices Fig. 2.11 (L4635–4691)**: lower-triangular bias tables (u0, u1, u2, u2, u3… vs 0, −β, −2β, …). Easy to recompute by hand.
- **Fixed-size KV cache gallery Fig. 2.6 (L4010–4066)**: window / moving average / recurrent / compressed + local. The point: "memory = what you keep from the past".
- **Fig. 2.5 (L3779–3831)**: standard attention vs sparse vs linear vs recurrent, showing what has to be cached for position i. Directly answers "RNN vs Transformer: what do we store?"

---

## 2. HGA — Hitchhiker's Guide to Agentic AI (Roitman, 2026)

### 2.1 How it builds things up
- §1.1 pipeline (L15–42): text → tokens → IDs → embeddings → L Transformer layers → vocabulary logits → decode, plus the autoregressive loop. Four stages: tokenization, embedding, contextual processing, prediction.
- §1.2 tokenization *before* any network:
  - Why subwords (L54–58); granularity table (L61–66).
  - BPE algorithm (L72–79); method table (L94–105).
  - Best practices (L108–126); HuggingFace demo (L131–165); special tokens (L170–234).
- §1.3 Transformer:
  - Original enc-dec first (L246–345), then decoder-only vs encoder-decoder vs encoder-only (L351–364).
  - Then the components: embeddings (L367), self-attention + cost (L474), MHA/GQA/MLA (L568), positional encodings (L597), FFN (L786), LayerNorm (L803).
  - Then a size table (L860), pathologies (L884) and interpretability (L993).
- §1.4 prediction heads: the same backbone with an LM head / SFT head / value head / reward head (L1127–1324).
- Systems chapters cover FlashAttention (L1367–1550), roofline (L1779–1849), KV cache / PagedAttention (L1914–2029) and MoE (L1574–1730).

### 2.2 Exact formulas worth quoting
- Embedding lookup: embed(x_t) = E[x_t], E ∈ ℝ^{|V|×d}. Sequence: H₀ ∈ ℝ^{n×d} (L385–391).
- Whitening h̃ = D^{−1/2}Uᵀ(h−μ) for anisotropic embeddings (L438–443). Advanced; optional.
- Masked attention (Eq. 1.1, L267–275): softmax(QKᵀ/√d_k + M)V with M_ij = 0 if i ≥ j, −∞ if i < j. ✓ correct orientation.
- Cross-attention (Eq. 1.2, L302–312): Q from the decoder, K and V from the encoder output H_enc, no mask.
- Self-attention (L478–486) with W_Q, W_K, W_V ∈ ℝ^{d×d_k}.
- Multi-head with d_k = d/H, Concat·W_O (L573–576).
- GQA: Llama-3 has 8 KV heads for 32 Q heads → KV cache 4× smaller (L580–581; ✓ for 8B: 128 KiB vs 512 KiB per token).
- MLA: c_t = W_DKV h_t, K_t = W_UK c_t, V_t = W_UV c_t (L588).
- **Sinusoidal PE**: PE(pos,2i) = sin(pos/10000^{2i/d}), PE(pos,2i+1) = cos(pos/10000^{2i/d}) (L622–625). PE(pos+k) is a linear function of PE(pos) (L627–628).
- **Learned absolute**: h₀ = TokenEmbed(x_pos) + E_pos[pos], E_pos ∈ ℝ^{L_max×d} (L634–637).
- **RoPE**: element-wise cos/sin form, θ_i = 10000^{−2i/d}, ⟨RoPE(q_m,m), RoPE(k_n,n)⟩ = f(q_m, k_n, m−n) (L647–680).
- **ALiBi**: softmax(QKᵀ/√d_k − m·|i−j|)V, slopes m_h = 2^{−8h/H} (L708–716; ✓ H = 8 gives 1/2 … 1/256).
- **NTK base scaling** 10000 → 10000·s^{d/(d−2)} (L702, L753). YaRN temperature t = 0.1 ln s + 1 (L705).
- **FFN** W2·σ(W1x+b1)+b2 with a 4d hidden layer. SwiGLU: W2(Swish(W1x) ⊙ W3x), 3 matrices (L789–796).
- **LayerNorm** γ ⊙ (x−μ)/√(σ²+ε) + β, ε ≈ 10⁻⁵, statistics over the d features of *one token* (L807–830). **RMSNorm** γ ⊙ x/RMS(x), no β, no mean (L832–842).
- LM head: P(x_{t+1}|x_≤t) = softmax(W_head h_t + b), often W_head = Eᵀ (L1143–1144). CLM loss −(1/T)Σ log P(x_t|x_<t) (L1148, L1559–1562). SFT loss only on the response (L1161–1168).
- **Attention sink**: α_sink = exp(qᵀk₀/√d)/Σ exp(qᵀk_j/√d) ≫ 1/n (L901–905).
- Attention rollout: R^(l) = A^(l)R^(l−1), A = 0.5·A_raw + 0.5·I (L1010–1014).
- **Online softmax** update (m, ℓ, O) (L1416–1428). FlashAttention complexity table: HBM memory O(n²) → O(n), traffic O(n²d) → O(n²d/M), FLOPs unchanged (L1461–1471).
- **Roofline**: I = FLOPs / bytes. A100 BF16 ridge = 312 T / 2 TB/s = 156 FLOP/B (L1780–1788 ✓).
- **KV cache** = 2 × L × H_kv × d_head × n × bytes (L1924–1931).
- **MoE**: MoE(x) = Σ g_i(x)E_i(x), g = TopK(softmax(W_r x)). Load-balance loss α·N·Σ f_i p_i (L1583–1617).

### 2.3 Concrete numbers / examples
- Typical d = 4096 (L34). Subword vocabulary 32K–128K (L58, L66); character ~256; word ~500K+ (L64–65).
- "unhappiness" → [un, happiness] or [unhapp, iness] (L31). "cryptocurrency" → [crypt, ocur, rency] (L57).
- **Llama-3 tokenizer** (128K vocab, byte-level BPE): "Reinforcement learning optimizes long-term rewards." → IDs [128000, 29934, 262, 11008, 4815, 6900, 1317, 9860, 21845, 13], tokens [<|begin_of_text|>, Re, inforce, ment, ␣learning, ␣optimizes, ␣long, -term, ␣rewards, .] (L136–147). Nice: 1 BOS + 9 tokens for 6 words; "Reinforcement" = 3 pieces.
- Special tokens table: BOS, EOS, PAD, UNK, SEP, CLS, MASK, role markers (L173–184).
- **Embedding table** Llama-3: 128,256 × 4,096 = 525M params = 6.5% of 8B (L394; ✓ 525.3M, 6.54%). One-hot of size 128,000 vs dense d = 4096 (L372–373). king − man + woman ≈ queen (L379–382).
- **Attention cost** (L493–511): time O(n²d), memory O(n²). 128K context: "16.4 billion entries, 64 GB FP32" (✓ only if 128K = 128,000, and per head per layer).
  - Table 1.4 entries: 2K → 4M / 16 MB; 8K → 64M / 256 MB; 32K → 1B / 4 GB; 128K → 16B / 64 GB; 1M → 1T / 4 TB (✓ with FP32, 2-power K; the "Ops" column is matrix entries, not FLOPs).
- Taming the cost (L514–546):
  - FlashAttention (exact, IO-aware);
  - sliding window w = 4096 (Mistral, Longformer), O(n·w);
  - sparse + global tokens (BigBird, LongT5);
  - linear attention / SSM (Mamba, RWKV), O(n·d²);
  - KV-cache compression (H2O, StreamingLLM, quantised KV).
- **PE comparison Table 1.6** (L726–735): extra params (none / L_max·d / none / none); absolute vs relative; extrapolation (poor / none / good with scaling / excellent); dominant era (2017–19 / 2018–20 / 2022– / 2022–23). PE methods table with models (L601–613). ALiBi: "trained at 1k, works at 8k+" (L720).
- Long context: Claude 200K–1M, Gemini 1.5 1M+, GPT-4 128K (L739; time-sensitive). Llama-3.1 progressive 8K → 64K → 128K, 1–5B tokens of long-data continued pre-training (L766–769). "Lost in the middle" U-shape (L780–784, L937–940).
- **Model size Table 1.7** (L863–878; ✓ all rows match public configs) — params / layers / d / heads / KV heads / context:
  - Llama-3.1 8B: 32, 4096, 32, 8, 128K.
  - Llama-3.1 405B: 126, 16,384, 128, 8, 128K.
  - Llama-4 Maverick 400B (17B active): 48, 5120, 40, 8, 1M.
  - Mistral Large 2 123B: 88, 12,288, 96, 8, 128K.
  - Qwen-2.5 72B: 80, 8192, 64, 8, 128K.
  - DeepSeek-V3 671B (37B active): 61, 7168, 128, MLA, 128K.
- Attention sink takes 20–50% of the attention mass (L893). Induction heads [A][B]…[A] → [B] (L982–984).
- **FlashAttention numbers.**
  - n = 8192, d = 128, BF16: 134 MB per head, 4.3 GB for 32 heads (L1387–1388 ✓). n = 32K: ≈ 2 GB per head (L1398 ✓). 2–4× wall-clock (L1372).
  - FA2: causal ~2× via skipping masked blocks (L1486–1488). FA3: 75% of H100 peak vs ~35% for FA2 (L1504–1505). FA4 on B200: 1613 TFLOP/s = 71% (L1540–1543).
- **Roofline worked example** (L1790–1834; all ✓): one head, n = 4096, d = 128.
  - FLOPs ≈ 4n²d = 8.6 GFLOP.
  - Naive HBM traffic ≈ 138 MB → I ≈ 62 FLOP/B, i.e. 40% of the ridge, memory-bound.
  - Flash: traffic 4·n·d·2 ≈ 4 MB → I = n/2 = 2048 FLOP/B, compute-bound.
  - "Attention is memory-bound, FFN is compute-bound" (L1837–1850).
- **KV cache example** (L1924–1933 ✓): Llama-3-70B, L = 80, H_kv = 8, d = 128, BF16 → 327,680 B/token. 4096 tokens → 1.34 GB per sequence.
  - Prefix sharing: 128 users × a 1000-token system prompt = 42 GB vs 0.33 GB (L1993–1995 ✓).
  - Naive allocation uses only 20–40% of memory (L1942).
- **MoE table** (L1714–1729; total / active params, experts):
  - Switch 1.6T / "100B", 128 experts, top-1 ✗.
  - Mixtral 8x7B: 47B / 13B, 8 experts, top-2.
  - DeepSeek-V2: 236B / 21B, 160 experts, top-6.
  - Qwen-MoE: 14.3B / 2.7B, 60 experts, top-4.
  - DBRX: 132B / 36B, 16 experts, top-4.

### 2.4 Claims that look wrong, outdated or oversimplified
1. **L844** — Post-LN written as `h + LayerNorm(Attn(h))`. → Post-LN is `LayerNorm(h + Attn(h))`. HGA's own caption L327 says LN(x + SubLayer(x)).
2. **L286–287** — Pre-Norm "stabilizes training without warmup". → Pre-LN *can* train without warmup (Xiong et al. 2020), but practically every LLM recipe still uses warmup, including HGA's own §1.5.7.
3. **L507** — 2K context: 16 MB attention matrix "Fast; fits in SRAM". → On-chip SRAM is ~192 KB per SM (~20 MB in total on an A100). A 16 MB matrix lives in HBM/L2; only tiles fit in SRAM (HGA L1754–1758).
4. **L501–502, Table 1.4** — sizes given without saying "per head, per layer, FP32"; the "Attention Ops" column is n² entries, not FLOPs. → The real cost is ×(heads × layers), and FLOPs ≈ 4n²d.
5. **L530–533** — BigBird / LongT5 "O(n√n)". → BigBird (window + global + random) is **O(n)**. O(n√n) is the Sparse Transformer of Child et al. 2019.
6. **L743–748** — θ'_i = θ_i·(L_target/L_train)^{2i/d}. Wrong direction: this *raises* frequencies. → NTK base scaling gives θ'_i = θ_i·s^{−2i/(d−2)} (lower frequencies). Use FLLM Eq. 2.101–2.104.
7. **L755–757** — "YaRN … used by Llama-3 to extend 8K → 128K". → Llama 3.1 used its own piecewise "llama3" RoPE frequency scaling (base 500,000) plus staged continued pre-training. It is not YaRN (YaRN is used e.g. by Qwen2.5 and DeepSeek).
8. **L768–769** — "progressive schedule 8K → 64K → 128K". → The Llama 3 paper reports six stages from 8K up to 128K (≈800B tokens). Treat the 3-step schedule as a simplification.
9. **L791** — W1 ∈ ℝ^{d×4d} used in W2·σ(W1x). Inconsistent shapes for column vectors. → W1 ∈ ℝ^{4d×d}, W2 ∈ ℝ^{d×4d} (or use the row-vector convention throughout).
10. **L796** — SwiGLU hidden "typically 8/3 × d". → 8/3·d keeps the parameter count equal to a 4d FFN, but real models deviate: Llama-3-8B uses 14,336 = 3.5·d.
11. **L842, L850** — "All modern LLMs use RMSNorm." → Most do (Llama, Mistral, Qwen, DeepSeek), but not all; e.g. some use LayerNorm (Falcon, GPT-NeoX family). Say "most".
12. **L854–856** — "a 128-layer transformer without LayerNorm would see magnitudes vary by 10³⁰×". → Unsourced, illustrative number; do not quote.
13. **L398–399, L1317–1323** — "Most modern LLMs tie the LM head with the embedding… returns True for most models". → Tying is common in small models (GPT-2, Gemma, Llama-3.2 1B/3B, small Qwen), but Llama-2/3 7B–70B, Mistral 7B and Qwen-7B+ do **not** tie.
14. **L379–382** — king − man + woman ≈ queen presented as a property of the LLM embedding table. → It was shown for static word2vec/GloVe vectors. In LLM input tables it holds only roughly, if at all.
15. **L486–488** — "Each token attends to all *previous* tokens" as *the* intuition of self-attention. → True only for causal (decoder) attention; encoders attend in both directions (HGA L252–260).
16. **L924–925** — "Some models (e.g., Mistral) prepend dedicated sink tokens". → No such Mistral documentation. The learnable sink token comes from the StreamingLLM paper; per-head learned sinks appear e.g. in gpt-oss. Treat as unverified.
17. **L951–953** — RoPE distance decay explains low attention to the *middle*. → From the last query the *beginning* is farthest, so distance decay alone predicts a monotone, not U-shaped, curve. The U-shape needs other explanations (sink, training data).
18. **L1434** — FlashAttention block sizes Br = ⌈M/4d⌉, Bc = min(⌈M/4d⌉, d). → In Dao et al. 2022 it is Bc = ⌈M/4d⌉, Br = min(⌈M/4d⌉, d) (swapped).
19. **L1546** — "A80". → A100 (typo).
20. **L1685–1686** — Mixtral and DeepSeek-V2 "use Noisy Top-K with Gaussian noise". → Both use plain softmax top-k routing without noise; noisy gating is Shazeer 2017.
21. **L1715** — Switch Transformer "1.6T total, 100B active, 128 experts". → Switch-C has ≈1.57T params with **2048** experts, top-1. "100B active" is not in the paper; per-token compute is about that of a dense model of a few billion params.
22. **L1846–1850** — "FFN is compute-bound". → Only with large batches / prefill. At decode with batch ≈ 1 the FFN is memory-bound too, as HGA admits in the "Tensor Core trap" box (L1880–1884).
23. **L1860** — "each Tensor Core performs a 4×4×4 matmul per cycle". → That is Volta. A100 tensor cores do 256 FP16 FMA per cycle (8×4×8). Irrelevant for ch12; avoid.
24. **L739** — context lengths of Claude / Gemini / GPT-4. → Time-sensitive marketing figures. If used, phrase as "2024–25: 128K–1M+".

### 2.5 Pedagogical ideas worth reusing
- The **4-stage pipeline** (L29–42) works as the chapter's opening map: token → embedding → context → prediction.
- **Granularity table** (L61–66): character / word / subword vs vocabulary size, sequence length and problems. A good contrast pair: "betű vs szó vs szódarab".
- **BPE as 4 steps** (L72–79). Kiegészítés: hand-run 3 merges on a toy corpus (e.g. "alma, alma, almás, málna") and verify in Python.
- **Real tokenizer output** (L136–147): count tokens vs words (10 IDs including BOS, 6 words), check "Re|inforce|ment".
- **"mat the on sat cat the"** (L599): without positions the sentence is a bag; motivates PE.
- **"Why masking matters" box** (L291–296): teacher forcing processes the whole target in parallel; the mask keeps causality. This is exactly the "why Transformers train fast" argument.
- **Cross-attention example** "cat → gato" (L314–315).
- **Why decoder-only won** box (L361–364): one model, one loss, pre-training = fine-tuning objective.
- **PE comparison table** (L726–735) works as a ready-made decision table ("melyik pozíciókódolás mikor?").
- **Attention-sink formula** (L901–905): softmax must sum to 1 → a "dump" token. A nice consequence of the softmax constraint for a warn box.
- "Attention is not explanation" (L1025–1029): a good warn box for attention heatmaps.
- **Prediction heads table** (L1213–1225): the same backbone, different head (LM / SFT / value / reward).
- **Roofline example** (L1790–1834): a full calculation with small, round numbers. Too systems-heavy for the main text; maybe an "Alkalmazás" side box on why long context is expensive.
- **KV-cache formula + 70B example** (L1924–1933) and the 128-user prefix-sharing example (L1993–1995): concrete, verifiable, motivates GQA.

---

## 3. MLSYS — Machine Learning Systems, ch4 (RNN / attention / Transformer parts)

### 3.1 How it builds things up
- Narrative of decreasing structural constraints: MLP (everything to everything) → CNN (local) → RNN (sequential) → Transformer (dynamic, content-based) (L738–744).
  - Each section follows "pattern-processing needs → algorithmic structure → computational mapping (naive nested loops) → system implications (memory, compute, data movement)".
- RNN motivation: CNNs capture "what" but not "when" (L23–38). The RNN's inductive bias is "order matters, the past influences the present" (L39–49).
- Attention motivation:
  - RNNs assume temporal proximity = importance (L382–389).
  - Long-range example: "The cat, which was sitting by the window overlooking the garden, was sleeping." (L390–396).
  - Bahdanau 2014 attention inside RNNs (L397–403, L1168–1172), then "attention alone" (Vaswani 2017, L420–437, L712–744).
- Transformers: self-attention (Q, K, V all from X) vs earlier encoder–decoder attention (L749–764), then multi-head (L776–792), why √d_k (L795–801), the hash-table / database-lookup analogy (L803–814), full architecture Fig. 4.8 (L871–913), system implications (L923–1001).
- §4.6 places the Transformer as a *synthesis* of building blocks: MLP FFN, ResNet skip connections, normalization, attention from seq2seq (L1174–1225).
- §4.8–4.9: selection tables and the inductive-bias hierarchy (CNN strongest → RNN → MLP → Transformer "adaptive") (L1952–1970).

### 3.2 Formulas
- RNN: h_t = f(W_hh h_{t−1} + W_xh x_t + b_h) (L120), tanh in L206. Recursive-function analogy h_t = f(h_{t−1}, x_t) ↔ f(n) = g(f(n−1), input(n)) (L137–145).
- Attention: softmax(QKᵀ/√d_k)V (L509). Self-attention: softmax(XW_Q (XW_K)ᵀ/√d_k)·XW_V (L768–770). MultiHead = Concat(head_1..head_h)W^O, head_i = Attention(QW_i^Q, KW_i^K, VW_i^V) (L786–792).
- √d_k: "for queries and keys of dimension d_k their dot product has variance d_k" (assumes unit-variance, independent components); dividing restores variance 1 and avoids softmax saturation (L795–810). ✓ d_k = 64 → std 8.
- Softmax footnote softmax(x_i) = e^{x_i}/Σe^{x_j} (L506–518).
- Cost: QKᵀ needs N×N×d MACs, plus the same again for applying the weights to V (L688–694). Memory: an N×N weight matrix per sequence per head, d×d projections, N×d feature maps (L630–638).
- Table 4.6 (L1713–1736): RNN params O(h² + hd), forward O(T·h²), memory O(h) hidden state, parallelism "poor"; Transformer forward O(n²d + nd²) per layer, memory O(n²) attention + O(nd).
  - "n²d dominates for long, nd² for short sequences" (L1850–1852). This is the key crossover statement: attention vs FFN/projections cost crosses at n ≈ d (Kiegészítés).

### 3.3 Concrete numbers / examples
- **RNN worked example** (L126–127, L271–308, L333–336): input 100-dim, hidden 128-dim. W_xh = 100×128 = 12,800 weights, W_hh = 128×128 = 16,384, total 29,184 (✓). Per time step: 12,800 + 16,384 MACs; load 128-value state, store 128 values.
- Naive loop listings: `rnn_layer_step` / `rnn_layer_compute` (L215–257); `attention_layer_compute` with 4 nested loops (L647–684); `self_attention_layer` + `multi_head_attention` (L940–966). Readable pseudo-code for a "mi történik valójában" box.
- **GPT-2-small QKV figure** (Transformer Explainer, L585–611): 6 tokens "Data visualization em powers users to" → embedding matrix(6,768) × W_QKV (768, 2304) + bias (2304) = (6, 2304), i.e. Q, K, V of 768 each. Nice concrete shape check; also shows "empowers" split into "em|powers".
- Ambiguity examples: "the bank by the river" vs "the bank approved the loan" (L442–444). "The animal didn't cross the street because it was too wide" → "it" = street (L758–764). Attention heatmap "The student didn't finish the homework because they were tired" (layer 4, head 2; Fig. 4.5 L466–486).
- Sequence of 512 tokens: 512 × 512 attention patterns computed at runtime (L1395–1410). Batch 32, n = 512, d_head = 64: broadcast 512×64 queries, gather 512×512×64 K/V, reduce 512×512 scores per sequence (L1594–1601).
- Era table 4.1 (L1072–1078): MLP/CPU → CNN/GPU → RNN/memory hierarchies → Transformer/HBM + flexible accelerators.
- GRU: 2 gates vs 3 in LSTM, ~25% fewer parameters (L1147–1157; ✓ 3 vs 4 weight blocks). LSTM 1997 (L1135–1144). ResNet 2015, 1000+ layers (L1124–1133).
- ViT: 224×224 image, 16×16 patches = 196 tokens (L1203–1215; ✓ 14² = 196).
- AlexNet 62M (2012) → GPT-3 175B (2020) "3,000×" (L1607–1611; ✓ ≈ 2,823×).
- Hardware efficiency claims: MLP 80–90% of peak, CNN 60–75%, RNN 30–50%, Transformer 70–85% at large batch (L1773–1782). Unsourced, but the ordering (RNN worst) supports "why Transformers won".

### 3.4 Claims that look wrong, outdated or oversimplified
1. **L151–153** — "Transformers require O(n²) memory … RNNs maintain fixed memory". → At *inference* an RNN keeps O(h) state, but *training* (BPTT) stores O(T·h) activations. FlashAttention-style Transformers need O(n) activation memory (plus an O(n) KV cache at inference).
2. **L123–126** (footnote) — gradients vanish "after 5–10 steps" when "weights have magnitude < 1". → Depends on the spectral radius of W_hh and the tanh derivatives. It can also explode (> 1). "5–10 steps" is a rule of thumb, not a law.
3. **L157–161** — "structured pruning … 10× speedup … 70–80% of connections contribute minimally". → Unsourced; do not quote.
4. **L815–825, L846–852** — softmax "implements a maximum-entropy principle" and attention is "the optimal trade-off" between minimising and maximising entropy. → Softmax is the max-entropy distribution for given expected scores, but the "optimal aggregation" claims are rhetoric, not a result.
5. **L828–830, L838** — head pruning "50–80%"; "post-training INT8 typically 2–3% accuracy loss". → Unsourced. Well-calibrated INT8 PTQ of Transformers is usually < 1% loss.
6. **L911–913** — Fig. 4.8 is captioned "Attention Head". → It is the full encoder–decoder Transformer from Vaswani et al.
7. **L1182** — position embeddings "inspired by CNN intuitions". → Positional encodings are motivated by the permutation-invariance of attention, not by CNNs.
8. **L1183–1185** — "layer normalization, evolved from CNN batch normalization". → LayerNorm (Ba et al. 2016) was proposed to make normalisation work for RNNs and independent of the batch. "Inspired by BN" is fine; "from CNNs" is loose.
9. **L1369–1371** — A100 "312 TFLOPS for mixed-precision (TF32) … 156 TFLOPS for FP32". → A100: 312 TFLOPS FP16/BF16 tensor, 156 TF32 tensor (312 with sparsity), 19.5 FP32 non-tensor.
10. **L1438–1440** — DRAM bursts "up to 400 GB/s in modern GPUs". → Outdated: A100 HBM2e ≈ 2 TB/s, H100 HBM3 ≈ 3.35 TB/s (HGA L1764–1766).
11. **L1469–1481, Table 4.3** — Transformer parameter storage O(N × d) (N = sequence length). → Parameters are O(L·d²) and independent of N (MLSYS's own L1849–1850 says so). Activations are O(B·(N·d + H·N²)) without FlashAttention.
12. **L1734–1736, Table 4.6** — multi-head params "O(d²×h)". → Heads split d (d_k = d/h), so MHA has 4d² parameters regardless of h.
13. **L1882–1886, Table 4.7** — Transformer FLOPs/sample "O(N²×d)" only. → It should be O(L·(N²d + Nd²)). For N < d the FFN/projection term dominates (MLSYS itself, L1850–1852).
14. **L1626–1631** (footnote 30) — TPU "15–30× better performance per watt … 128×128 systolic array performs 65,536 MACs per cycle". → 128×128 = 16,384 MACs. 65,536 is TPU v1's 256×256. The TPU-v1 paper reports 15–30× *speed* and 30–80× *perf/W*.
15. **L1645–1649** (footnote 31) — "GPT-3 training requires moving 1.75 TB of parameters through memory during each forward pass". → 175B params = 350 GB in FP16 or 700 GB in FP32. 1.75 TB does not follow.
16. **L1611–1612** — "GPT-4 may exceed 1 trillion parameters". → Undisclosed; speculation.
17. **L1812–1813** — MQA "reduces memory bandwidth by 30–50%". → MQA shrinks the KV cache by the factor H (e.g. 32×). The end-to-end gain varies; the number is unsourced.
18. **L1915–1917** — decision framework "sequential data with RNNs". → Outdated as a default: for text and most sequences Transformers (or SSM hybrids) are the default now. RNNs remain only for tiny streaming / edge settings.
19. **L1861–1863** — "Transformers excel … where their computational cost justifies their computational cost". → Editing slip ("… justifies itself through superior performance").

### 3.5 Pedagogical ideas worth reusing
- **"What vs when"** (L23–30): CNN = what is present; RNN = when / in what order. A clean bridge from ch11 to ch12.
- **RNN = recursive function** (L137–145). Students know recursion; reuse it.
- **Shared-weights-over-time vs shared-weights-over-space** (L288–290, L329–332): the RNN is "a CNN along time".
- **Small, hand-checkable RNN numbers** (100 → 128): parameter count 29,184 and per-step MACs. Shrink further for practice, e.g. input 3, hidden 2: 6 + 4 + 2 = 12 params.
- **Long-range example** "The cat, which was sitting by the window overlooking the garden, was sleeping." (L390–396): count the steps between "cat" and "sleeping" for an RNN (10 steps) vs attention (1 hop). Hungarian version for the chapter: "A macska, amely az ablakban ült…, aludt."
- **Ambiguity pairs** "bank by the river" / "bank approved the loan" (L442–444) and "it was too wide/tired" (L758–764). Perfect szembeállító pár for the contextual-embedding step.
- **Attention = soft dictionary lookup** (L803–814): a hash table returns *one* exact match; attention returns a weighted mix of *all* values. A rule-of-thumb box: "a query kérdez, a key címke, a value tartalom".
- **Nested-loop listing** (L658–684): makes the n×n×d cost visible; count the loop iterations for n = 4, d = 2.
- **GPT-2 shape example** (6×768 · 768×2304): a shape quiz ("mekkora a QKV-mátrix?").
- **Era table 4.1** and "decreasing constraints" (L738–744) for the summary / decision table.
- **Fallacy box** "more complex architectures always perform better" (L2030–2039): a warn box for the "why transformers won" section (they won *at scale with data*, not everywhere).

---

## 4. Cross-source synthesis for the chapter

### 4.1 Notation proposal (consistent with the sources)
- n = sequence length, d = d_model, H = heads, d_k = d/H, X ∈ ℝ^{n×d} (rows = tokens, as in HGA and FLLM).
- W_Q, W_K, W_V ∈ ℝ^{d×d_k} per head, W_O ∈ ℝ^{d×d}. Q, K, V ∈ ℝ^{n×d_k}. Scores S = QKᵀ/√d_k ∈ ℝ^{n×n}.
- Mask: M_ij = 0 if j ≤ i, −∞ if j > i (row i = query). Avoid FLLM's transposed wording.
- Block, pre-norm (modern): x ← x + MHA(LN(x)); x ← x + FFN(LN(x)). Post-norm (2017, BERT): x ← LN(x + MHA(x)); x ← LN(x + FFN(x)).
- FFN(x) = W2·σ(W1x + b1) + b2 with hidden size 4d. Parameter count per block ≈ 4d² (attention) + 8d² (FFN) = 12d² (✓ GPT-3: 12·96·12288² ≈ 174B).

### 4.2 Recomputed numbers ready for examples (✓ in `calc/c12_digest_check.py`)
- Sinusoidal PE with d = 4:
  - PE(0) = (0, 1, 0, 1)
  - PE(1) = (0.8415, 0.5403, 0.0100, 1.0000)
  - PE(2) = (0.9093, −0.4161, 0.0200, 0.9998)
  - PE(3) = (0.1411, −0.9900, 0.0300, 0.9996)
  - The first pair rotates fast, the second slowly. Good for the "binary-counter / clock-hands" analogy (HGA L626).
- RoPE θ_k for d = 8: 1, 0.1, 0.01, 0.001. Periods for d = 128: 2π … ≈ 54,410 positions.
- ALiBi slopes with H = 8: 1/2, 1/4, …, 1/256.
- KV cache per token (BF16):
  - Llama-3-8B with GQA: 2·32·8·128·2 = 131,072 B = 128 KiB. With full MHA it would be 512 KiB (4×).
  - Llama-3-70B: 320 KiB.
- BERT-base ≈ 109.5M, BERT-large ≈ 335M. GPT-2 small ≈ 124M, GPT-2 XL ≈ 1.56B (with V = 50,257, 1024 positions, tied).
- Attention matrix n² entries: 2,048 → 4.2M; 8,192 → 67M; 32,768 → 1.07G; 131,072 → 17.2G (FP32 = 64 GiB per head per layer).

### 4.3 Not covered (or only in passing) by these three sources → "Kiegészítés" or other sources (e.g. DLV12)
- **LSTM / GRU equations** (gates, cell state, why the additive cell path fights vanishing gradients). MLSYS has footnotes only (L1135–1157).
- **Seq2seq encoder–decoder RNN bottleneck** and **Bahdanau additive attention** formula. MLSYS cites only (L397–403, L1168–1172).
- **Word2vec / static embeddings** (skip-gram, CBOW, cosine similarity). FLLM has history only (L1894–1912); HGA has king/queen (L379–382). Cosine similarity worked example → Kiegészítés.
- **BPE toy run with actual merges**: HGA's Fig. 1.2 is an image only. Write our own and verify in Python.
- **Original Transformer hyper-parameters** (Kiegészítés, to verify): base d_model = 512, 6+6 layers, 8 heads, d_k = 64, d_ff = 2048; big 1024 / 16 / 4096; WMT14 EN-DE BLEU 27.3 (base) / 28.4 (big).
- **BERT / GPT data facts** (Kiegészítés, to verify):
  - BERT: WordPiece 30,522 tokens, 512 max positions, BooksCorpus + Wikipedia.
  - GPT-1: 512 context; GPT-2: 1024 context, 50,257 BPE; GPT-3: 2048 context.
- **Softmax temperature / sampling** (HGA §1.12 not extracted) and **perplexity** — neither is defined in these extracts.
- **Teacher forcing / shifted-right targets** in detail. Only mentioned (HGA L292, L1150; MLSYS Fig. 4.8 "Outputs (shifted right)").
- **NoPE / causal masks leak position** — none of the sources mentions it. Optional.

---

## 5. The 10 most useful items for ch12 (ranked)
1. **Worked attention formula with shapes and causal mask**: HGA L478–486 + L267–275, plus MLSYS's √d_k variance argument (L795–801). Fix FLLM's transposed mask (L2052) in a warn box.
2. **Pre-norm vs post-norm, with the two book errors as a warn box**: HGA L844 (Post-LN wrong) and FLLM L2037 / L3056 (Pre-LN wrong). Correct: post `LN(x+F(x))`, pre `x+F(LN(x))`.
3. **FLLM Fig. 1.3 mask grids** (causal / MLM / permuted, L652–688) → the encoder vs decoder vs BERT-vs-GPT step (and a quiz).
4. **BERT recipe**: 15% → 80/10/10 with the "It is raining / umbrella" running example; e = tok + pos + seg; BERT-base / large numbers (FLLM L1165–1292, L1372–1374, ✓ 109.5M / 335M).
5. **RoPE geometry**: 2D rotation, x R_{(t−s)θ} yᵀ, and the "cat / sleeping same angle 7θ" picture (FLLM L4747–4934). Remember the correction: RoPE acts on q and k inside attention (FLLM error 14).
6. **Sinusoidal formula + PE comparison table** (HGA L620–632, L726–735) + interpolation-vs-extrapolation analogy (FLLM L4429–4443). Decision table for positional encodings.
7. **RNN vs attention cost contrast**: MLSYS 100/128 RNN example (29,184 weights, sequential steps), "cat … sleeping" long-range sentence, Table 4.6 O(T·h²) sequential vs O(n²d + nd²) parallel (correct Tables 4.3/4.7 errors).
8. **KV cache + GQA numbers**: formula 2·L·H_kv·d_head·n·bytes; Llama-3-70B 327,680 B/token, 1.34 GB at 4096 tokens (HGA L1924–1933). The FLLM MHA → MQA → GQA progression (L4287–4340, fix "n_g = 1 → MQA").
9. **Why Transformers won**: parallel training via masking (HGA L291–296), self-supervised pre-training (FLLM L117–138), scaling laws with Kaplan/Chinchilla numbers (FLLM L3405–3471), decoder-only box (HGA L361–364), and MLSYS's fallacy box (L2030–2039) for nuance.
10. **Tokenization step**: granularity table (HGA L61–66), BPE steps (L72–79), the real Llama-3 split "Re|inforce|ment" (L136–147), and the embedding table as lookup E[x_t] with 128,256×4,096 = 525M (L385–394, ✓).
