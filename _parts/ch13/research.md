# 13. fejezet – Gráf neurális hálók: irodalomkutatás (2026-10-11)

Research digest for chapter 13 (see `mesterseges-intelligencia/TERV.md`, "## 13. fejezet"). Not chapter text.

**Verification legend**

- **[P]** verified from a primary source in this session (paper full text / arXiv abstract page / official proceedings, journal or organisation page).
- **[A]** verified from the paper's own abstract as returned by the Consensus search tool (abstract = author text, but numbers not cross-checked in the body).
- **[S]** secondary source or search snippet only (press, wiki, explainer, search-engine summary).
- **[M]** background knowledge, *not* re-verified in this session – check before using in the chapter.
- 🆕 = new or changed in 2025–2026. ⚖️ = the literature disagrees.

Tools: Consensus search (19 queries; monthly quota then exhausted), WebFetch/WebSearch for primary sources, `pdftotext` on
arXiv PDFs (GCN, GAT, PinSage), Europe PMC full text (AlphaFold 2). Consensus links are given as returned by the tool.

---

## 1. Graph foundation models (GFMs)

- **Position paper – Mao et al., "Position: Graph Foundation Models Are Already Here", ICML 2024** (PMLR 235:34670–34692;
  arXiv 2402.02216, v1 3 Feb 2024). Argues that the core obstacle is *positive transfer* across graphs with very different
  structure; proposes a **"graph vocabulary"** (transferable units encoding graph invariances) grounded in network analysis,
  expressiveness and stability. It is a *perspective*, not a demonstration of one general model; an earlier arXiv version
  even states "a versatile GFM has not yet been achieved". [P]
  https://proceedings.mlr.press/v235/mao24a.html · https://arxiv.org/abs/2402.02216
- **Surveys:** Liu et al., "Graph Foundation Models: Concepts, Opportunities and Challenges", IEEE TPAMI (arXiv 2310.11829, 2023)
  – taxonomy: GNN-based / LLM-based / hybrid GFMs [A]
  ([Consensus](https://consensus.app/papers/details/1cc920037d1c59d1ad55f80e2e9ec514/?utm_source=claude_desktop));
  Wang et al., "Graph Foundation Models: A Comprehensive Survey", arXiv 2025 – universal vs. task-specific vs. domain-specific
  GFMs; open problems: structural alignment, heterogeneity, scalability, evaluation [A]
  ([Consensus](https://consensus.app/papers/details/44d803707a0f5581b62fb6da93a49e65/?utm_source=claude_desktop)).
- **Where GFMs actually work best – knowledge graphs:** Galkin et al., **ULTRA** ("Towards Foundation Models for Knowledge
  Graph Reasoning", arXiv 2023, ICLR 2024 [M for venue]): one pre-trained model does zero-shot link prediction on **57
  different KGs**, "often on par or better than strong baselines trained on specific graphs"; fine-tuning helps further. The
  trick: relation representations conditioned on how relations interact, so no fixed entity/relation vocabulary. [A]
  ([Consensus](https://consensus.app/papers/details/9994ba10681b5b2980b73b0fe0f34b00/?utm_source=claude_desktop))
  Follow-ups: UltraQuery (NeurIPS 2024, zero-shot logical queries on 23 datasets, SOTA on 15) [A]; SEMMA (2025, adds LLM-derived
  relation semantics, beats ULTRA on 54 KGs) [A]; KGPFN (2026 preprint, in-context learning on 57 KGs) [A] 🆕.
- ⚖️ 🆕 **Counterpoint (2026 preprint):** Pradel, "Reification as a Transferable Vocabulary: Zero-Shot Link Prediction with
  Vanilla GNNs" – an off-the-shelf **GAT** trained 30 min on one 4,245-triple KG "matches ULTRA … across ULTRA's own evaluation
  suite" (40 benchmarks) once the graph is reified. Single-author preprint, unreviewed – but it illustrates that the "foundation"
  part may be in the representation, not the architecture. [A]
  ([Consensus](https://consensus.app/papers/details/e908f4bc67835343a1e4e1988ea60e64/?utm_source=claude_desktop))
- **Text-attributed graphs:** One-for-All (**OFA**, Liu et al., ICLR 2024) describes all nodes/edges/classes in natural
  language, embeds them with an LM, and trains one model for node-, link- and graph-classification across domains. [S/M]
  ZeroG (KDD 2024): LM-encoded node attributes and class names for cross-dataset zero-shot node classification. [A]
- 🆕 **Relational databases as graphs:** KumoRFM (2025) – "relational foundation model": a database becomes a temporal
  heterogeneous graph (rows = nodes, foreign keys = edges) processed by a *relational graph transformer* with in-context
  learning; vendor reports +2–8% over feature engineering/supervised DL on 30 RelBench tasks; KumoRFM-2 (arXiv 2604.12596,
  2026). **All numbers are vendor-reported, no independent replication found.** [S]
- **How general are they?** Assessment for the chapter: as of 2026 there is **no single "GPT for graphs"**. Successful GFMs are
  *domain-bounded*: knowledge graphs (ULTRA family), text-attributed graphs (LLM-encoded features), relational DBs (KumoRFM),
  and – by far the most mature – **atomistic "foundation potentials"** in chemistry/materials (MACE-MP-0 etc., §6). Bechler-Speicher
  et al. (ICML 2025, §10) explicitly blame poor benchmarks for "prevent[ing] the development of truly useful graph foundation
  models". ⚖️ (Mao et al.: "already here" vs. Bechler-Speicher et al.: not yet, benchmarks are the bottleneck.)

## 2. GNN + LLM

### 2a. Graph as text in the prompt
- **Fatemi, Halcrow, Perozzi, "Talk like a Graph: Encoding Graphs for Large Language Models", ICLR 2024** (arXiv 2310.04560,
  Oct 2023; Google Research blog 12 Mar 2024). First systematic study of graph-to-text encodings (benchmark: **GraphQA**).
  LLM accuracy depends on (1) the encoding method, (2) the task, (3) the *structure* of the graph; the right encoder improves
  results by **4.8% to 61.8%** depending on the task. [P]
- **Wang et al., "Can Language Models Solve Graph Problems in Natural Language?" (NLGraph, NeurIPS 2023 [M venue])**: 29,370
  problems, 8 tasks (connectivity, shortest path … max-flow, simulating a GNN). LLMs (GPT-3/4) show "preliminary" graph
  reasoning; advanced prompting helps less as problems get harder; LLMs are "brittle in the face of spurious correlations";
  their Build-a-Graph/Algorithmic prompting adds only 3.07–16.85%. [A]
  ([Consensus](https://consensus.app/papers/details/b04d911a231e5f3a818369910880085d/?utm_source=claude_desktop))
- GraphLLM (Chai et al.) names graph-to-text conversion itself "a fundamental bottleneck" and instead feeds a graph encoder's
  output to the LLM (graph tokens). [A] Survey: Yu et al., "Graph2text or Graph2token", ACM TOIS 2025. [A]
- Gap: I found **no rigorous 2025–2026 study** showing how frontier *reasoning* models change this picture; the textbook
  statement "LLMs reason poorly over textual graph descriptions, and results depend heavily on the encoding" is well supported
  for GPT-3.5/4-era models, but should be dated ("2023–2024-es mérések szerint").

### 2b. GraphRAG and knowledge graphs for retrieval
- **Edge et al. (Microsoft), "From Local to Global: A Graph RAG Approach to Query-Focused Summarization"**, arXiv 2404.16130
  (v1 24 Apr 2024, v2 19 Feb 2025). Pipeline: an LLM extracts an **entity knowledge graph** from the documents → community
  detection (Leiden) → pre-generated **community summaries** → map-reduce answering. Target: *global* questions ("What are the
  main themes?") where vector RAG fails. Datasets ≈1M tokens (podcast transcripts, 1,669 chunks) and ≈1.7M tokens (news, 3,197
  chunks). LLM-judged win rates over vector RAG: **comprehensiveness 72–83%** (podcasts) / **72–80%** (news); **diversity 75–82%** /
  **62–71%**. Root-level summaries need **9–43× fewer tokens** per query than summarizing the source text. GPT-4-family models. [P]
  Note: GraphRAG is *not* a GNN – the graph is an index built and read by an LLM; no message passing is learned. [P/inference]
- ⚖️ 🆕 **Re-evaluations 2025:** Han et al., "RAG vs. GraphRAG: A Systematic Evaluation and Key Insights" (KDD 2026 per Consensus
  metadata; arXiv 2025) – distinct strengths per task, combining both is best [A]
  ([Consensus](https://consensus.app/papers/details/79a87d60d85a5596b0c6f1077a0b4725/?utm_source=claude_desktop));
  Xiang et al., "When to use Graphs in RAG" (2025): "recent studies report that GraphRAG frequently **underperforms vanilla RAG**
  on many real-world tasks"; benefits concentrate on hierarchical/multi-hop and summarization questions [A]
  ([Consensus](https://consensus.app/papers/details/74cd1621d46754a3bdaf574d65b29abe/?utm_source=claude_desktop));
  Zhou et al. 2025 (unified framework comparison) [A]; KG-RAG is sensitive to KG incompleteness (Zhou et al. 2025) [A].
  Survey: Peng et al., "Graph Retrieval-Augmented Generation: A Survey", ACM TOIS (2024) [A].

### 2c. LLM as node-feature encoder / enhancer
- **TAPE – He et al., "Harnessing Explanations: LLM-to-LM Interpreter for Enhanced Text-Attributed Graph Representation
  Learning", ICLR 2024** (arXiv 2305.19523; authors incl. X. Bresson, Y. LeCun, B. Hooi). The LLM does zero-shot classification
  and writes an explanation; a small LM turns explanations into node features for a GNN. SOTA on Cora, PubMed, ogbn-arxiv and
  new tape-arxiv23; **2.88×** faster training than the closest baseline on ogbn-arxiv. [A + S for venue]
- **Chen et al., "Exploring the Potential of LLMs in Learning on Graphs"**, SIGKDD Explorations 2023/24: two pipelines –
  *LLMs-as-Enhancers* (better node text/features → GNN) and *LLMs-as-Predictors* (LLM answers directly). [A]
- Survey taxonomy (Jin et al., IEEE TKDE): LLM as **Predictor / Encoder / Aligner**. [A]
  ([Consensus](https://consensus.app/papers/details/b7240423603a570f9d5bf76a11dbeec8/?utm_source=claude_desktop))
- Teaching takeaway: on text-attributed graphs the cheapest strong recipe is "LLM/LM embeddings as node features + a classic GNN"
  (e.g. STAGE 2024 [A]); the graph structure still adds value on top of the text.

## 3. Graph Transformers vs. message-passing GNNs ⚖️

- **GPS – Rampášek et al., "Recipe for a General, Powerful, Scalable Graph Transformer", NeurIPS 2022** [M]: each layer =
  local MPNN + global attention in parallel, plus positional/structural encodings (Laplacian eigenvectors, random-walk
  encodings). Linear-attention variants for scale.
- **LRGB – Dwivedi et al., "Long Range Graph Benchmark", NeurIPS 2022 Datasets & Benchmarks** [M venue]: 5 datasets
  (PascalVOC-SP, COCO-SP, PCQM-Contact, Peptides-func, Peptides-struct); originally reported a clear GT advantage. [A]
- **Tönshoff, Ritzert, Rosenbluth, Grohe, "Where Did the Gap Go? Reassessing the Long-Range Graph Benchmark"**, arXiv
  2309.00367 (Sep 2023), **TMLR 2024**. The GT–MPNN gap on LRGB "completely vanishes after basic hyperparameter optimization"
  on multiple datasets; also found missing feature normalisation on the vision datasets and a faulty link-prediction metric. [P]
- **Luo, Shi, Wu, "Classic GNNs are Strong Baselines: Reassessing GNNs for Node Classification", NeurIPS 2024** (arXiv
  2406.08993). GCN, GAT, GraphSAGE with "slight hyperparameter tuning" (normalisation, dropout, residuals, depth) **match or beat
  recent GTs on 17 of 18 datasets**. [P]
- 🆕 **Luo, Shi, Wu, "Can Classic GNNs Be Strong Baselines for Graph-level Tasks? Simple Architectures Meet Excellence",
  ICML 2025** (arXiv 2502.09263). "GNN+" = GCN/GIN/GatedGCN + six standard tricks (edge features, normalisation, dropout,
  residuals, FFN, positional encoding); on **14 graph-level datasets** top-3 everywhere, **1st on 8**, and several times faster
  than GTs. [P]
- 🆕 Zhang et al. (NeurIPS 2025, per Consensus metadata): deconstructing GTs for node classification, "the global attention module
  does not provide significant performance gains and may even exacerbate test error oscillations". [A]
- **Theory link:** Cai, Hy, Yu, Wang, "On the Connection Between MPNN and Graph Transformer", ICML 2023 (PMLR 202:3408–3430):
  an **MPNN + virtual node** can arbitrarily approximate a GT self-attention layer (constant depth/width suffices for
  Performer/linear attention). [P]
- **Where GTs (or global attention) still win / the divided part:**
  - Mishayev et al., "Short-Range Oversquashing" (2025 preprint): a bottleneck effect even in short-range tasks that virtual nodes
    do *not* fix but transformers do – "positioning them as the more compelling solution". [A]
  - Chowdhury et al., J. Cheminformatics (2025/26), atomistic graphs: encoder-augmented MPNNs are a robust baseline; fused
    local+global models give "the clearest benefits for properties governed by long-range interaction effects". [A]
  - Large-scale *pretraining* and some industrial systems use transformer-style processors (GenCast/FGN graph transformer on a
    mesh, AIFS transformer processor, KumoRFM relational GT, AlphaFold's attention trunk) – i.e. at scale the field is moving to
    attention-based processors *on* a graph, while on small academic benchmarks tuned MPNNs remain as good. [P for weather; synthesis]
- **Bottom line for the chapter (literature split):** one camp – the reported GT superiority on standard benchmarks was largely a
  tuning artefact (Tönshoff 2023/24, Luo 2024, Luo 2025); other camp – global interactions are real for long-range physics and
  specific tasks, and attention scales better with data. Consensus position: *always tune a classic GNN baseline first; GT pays
  off for genuinely long-range tasks or very large pretraining, at O(n²) cost unless linearised.*

## 4. Oversmoothing and oversquashing

- **Oversquashing – Alon & Yahav, "On the Bottleneck of Graph Neural Networks and its Practical Implications", ICLR 2021**
  (arXiv 2006.05205). Exponentially growing receptive field squashed into fixed-size vectors; GCN and GIN (equal edge weights)
  suffer more than GAT/GGNN; removing the bottleneck improved prior SOTA "without further tuning or added weights". [P]
  (Their concrete fix – making the *last layer fully adjacent* – is from memory [M].)
- **Topping, Di Giovanni, Chamberlain, Dong, Bronstein, "Understanding over-squashing and bottlenecks on graphs via
  curvature", ICLR 2022 (oral)** (arXiv 2111.14522). New edge-based Ricci curvature; **negatively curved edges cause
  oversquashing**; curvature-based rewiring (SDRF). [P for venue/oral, A for content]
- Di Giovanni et al., ICML 2023 [M venue]: width helps but makes the network more sensitive overall; **depth does not help** (it
  ends in vanishing gradients); **topology matters most** – oversquashing occurs between nodes with high commute time. [A]
  Black et al. 2023: total **effective resistance** bounds oversquashing; rewiring to reduce it. [A]
  Giraldo et al., CIKM 2023: oversmoothing and oversquashing are both tied to the Laplacian spectral gap → an **inevitable
  trade-off**; adding edges fights one and worsens the other. [A]
- ⚖️ **Tori et al., "The Effectiveness of Curvature-Based Rewiring and the Role of Hyperparameters in GNNs Revisited" (2024)**:
  on real-world datasets the rewired edges do not match theoretical bottleneck criteria, and reported SOTA gains "are outliers
  originating from sweeps of hyperparameters". [A]
  ([Consensus](https://consensus.app/papers/details/753a14e0ebed5166b78d6ce84f6acc0d/?utm_source=claude_desktop))
- **Oversmoothing survey – Rusch, Bronstein, Mishra, "A Survey on Oversmoothing in Graph Neural Networks" (arXiv
  2303.10993, 2023).** Axiomatic definition: *exponential convergence* of node-similarity measures with depth; key conclusion:
  **mitigating oversmoothing is necessary but not sufficient** for deep, expressive GNNs. [P]
- Wu et al., "Demystifying Oversmoothing in Attention-Based GNNs" (NeurIPS 2023 [M venue]): **graph attention cannot prevent
  oversmoothing**; loses expressive power exponentially; result covers GATs and (graph) transformers. [A]
  Wu et al. 2022 (non-asymptotic, CSBM): early layers *denoise* (good), later layers *mix* classes (bad); transition after
  O(log N / log log N) layers. [A]
- ⚖️ **Is oversmoothing the real reason deep GNNs fail?**
  - Zhang et al., "Model Degradation Hinders Deep Graph Neural Networks", KDD 2022: separating propagation depth (D_p) and
    transformation depth (D_t), the main cause is **model degradation from large D_t, not oversmoothing from large D_p**. [A]
  - Peng et al., "Beyond Over-smoothing: Uncovering the Trainability Challenges in Deep GNNs", CIKM 2024: the real problem is the
    **trainability of the deep MLP parts**; many "anti-oversmoothing" methods work because they improve trainability. [A]
  - Liu et al., DAGNN, KDD 2020: entanglement of transformation and propagation is the key factor. [A]
  - Kelesis et al., Machine Learning 2025: residual connections make a deep GNN behave like a *sum of shallow GCNs* – helps
    benchmarks, may hurt when long-range info is genuinely needed. [A]
  - Summary: oversmoothing is mathematically real (provable for GCN, GAT, transformers) but **in practice 2–4 layers are usual and
    performance loss with depth is at least as much an optimisation/trainability problem**. Good nuance for the chapter's
    "több réteg ≠ jobb" trap.
- **Virtual nodes:** Southern, Di Giovanni, Bronstein, Lutzeyer, "Understanding Virtual Nodes: Oversquashing and Node
  Heterogeneity", **ICLR 2025** (arXiv 2405.13526). VN benefit depends on topology; classical VNs give uniform importance to all
  nodes (unlike GTs); a heterogeneity-aware VN variant at the same cost is "an extremely effective and computationally efficient
  baseline for graph-level tasks". [P] Plus Cai et al. ICML 2023 above (MPNN+VN ≈ GT). VNs are standard in OGB molecular
  baselines [M].

## 5. Expressive power beyond 1-WL

- **Weisfeiler & Leman 1968** – "The reduction of a graph to canonical form and the algebra which appears therein" (Russian,
  NTI Series 2, 1968). Cited in ML papers mostly as "Weisfeiler & Lehman/Lehmann" – the second author is **A. A. Leman**. [P that
  GCN paper cites "Weisfeiler & Lehmann, 1968"; M for spelling]
- **Xu, Hu, Leskovec, Jegelka, "How Powerful are Graph Neural Networks?" (GIN), ICLR 2019** (arXiv 1810.00826) [P arXiv,
  M venue]: message-passing GNNs are **at most as powerful as 1-WL**; GIN (sum aggregation + MLP, injective) reaches that bound;
  mean/max aggregators (GCN, GraphSAGE variants) are strictly weaker on some multisets. [A]
- **Morris et al., "Weisfeiler and Leman Go Neural: Higher-order Graph Neural Networks", AAAI 2019** [M venue]: GNNs = 1-WL in
  distinguishing power; proposes k-GNNs. [A]
- Beyond 1-WL: substructure counting – Chen et al. 2020 (MPNNs cannot induced-subgraph-count patterns with ≥3 nodes, but can count
  star-shaped ones) [A]; GSN (Bouritsas et al., TPAMI) adds subgraph-isomorphism counts as features [A]; biconnectivity metrics &
  GD-WL (Zhang et al. ICLR 2023) [A]; subgraph GNNs (ESAN etc.) [M]; positional encodings (Laplacian eigenvectors, random walk)
  as in GPS [M].
- **Homomorphism expressivity – Zhang, Gai, Du, Ye, He, Wang, "Beyond Weisfeiler-Lehman: A Quantitative Framework for GNN
  Expressiveness", ICLR 2024 (Outstanding Paper Honorable Mention)** – measures expressivity by *which graphs a model can count
  homomorphisms of*; complete and practical, unifies subareas; practical performance tracks the metric. [P via ICLR page/snippet]
  Follow-ups 2024–2025: homomorphism basis counts (Jin et al. 2024), spectral-invariant GNNs count "parallel trees" (Gai et al. 2025). [A]
- 🆕 **Shift of focus:** Morris et al., "Position: Future Directions in the Theory of Graph Machine Learning", ICML 2024 – the
  field over-focused on coarse combinatorial expressivity; needs a balanced theory of **expressivity + generalisation +
  optimisation**. [A] Maskey et al. 2025: more expressive GNNs may generalise *worse* unless data grows. [A]
  Vasileiou et al. 2025: survey on MPNN generalisation theory. [A]
- Classic counter-example used in the plan (C6 vs. two triangles, all degrees 2): standard textbook example, consistent with 1-WL
  theory [M – trivially checkable by hand].

## 6. Equivariant / geometric GNNs, materials, proteins

- **EGNN – Satorras, Hoogeboom, Welling, "E(n) Equivariant Graph Neural Networks", ICML 2021** [M venue]: equivariant to
  rotations, translations, reflections and permutations *without* higher-order (spherical-harmonic) features; works in any
  dimension n. [A]
- **NequIP – Batzner et al., "E(3)-equivariant graph neural networks for data-efficient and accurate interatomic potentials",
  Nature Communications 2022** (arXiv 2021): E(3)-equivariant convolutions on geometric tensors; matches/exceeds prior models with
  **up to three orders of magnitude fewer training data**. [A]
- **MACE** – Batatia et al., NeurIPS 2022 [M]; design space paper (Nature Machine Intelligence 2025 per Consensus) unifies ACE and
  NequIP [A]. User benchmark (Leimeroth et al. 2025): nonlinear ACE, NequIP, MACE form the accuracy–cost Pareto front. [A]
- **Universal / foundation potentials:** M3GNet (Chen & Ong, Nature Computational Science 2022): GNN with 3-body interactions
  trained on Materials Project; screened 31M hypothetical crystals, ~1.8M potentially stable; 1,578 of top 2,000 confirmed by DFT. [A]
  **MACE-MP-0** – Batatia et al., "A foundation model for atomistic materials chemistry", arXiv 2401.00096 (Dec 2023) →
  **J. Chem. Phys. 163, 184110 (2025)**, doi 10.1063/5.0297006: trained on a public dataset of moderate size (MPtrj), stable MD
  across solids, liquids, gases, reactions, interfaces, even a small protein; fine-tune with a handful of points. [A + S for issue]
  Others: CHGNet, SevenNet-0, GRACE, MatterSim, ORB, fairchem/OMat (2024–2025). [A]
- ⚖️ **Limits of foundation potentials:** systematic **PES softening** (energy/force underprediction, too-soft curvature) in
  M3GNet, CHGNet, MACE-MP-0 – Deng et al., npj Comput. Mater. 2025 – fixable by fine-tuning with very little data [A]; poor
  out-of-the-box surface energies (Focassio et al., ACS AMI 2024) [A]; 2026 study: 10 AIMD configurations not enough for
  fine-tuning, ~2,000 a robust default, training from scratch often as good (Hänseroth et al. 2026 preprint) [A].
- **GNoME – Merchant et al., "Scaling deep learning for materials discovery", Nature 624, 80–85 (2023)**,
  doi 10.1038/s41586-023-06735-9 [M for volume/pages]. Graph networks trained at scale ("an order of magnitude" efficiency
  gain): **2.2 million** structures below the previous convex hull, building on 48,000 previously known stable crystals; ≈**380,000**
  "most stable" (on the final hull; paper: ~381,000 [M]); **736** independently realised experimentally. DeepMind blog 29 Nov
  2023 explicitly calls GNoME a "graph neural network". [A + P blog]
  ⚖️ **Cheetham & Seshadri, Chemistry of Materials 2024**: examined the claims and found "scant evidence for compounds that fulfill
  the trifecta of novelty, credibility, and utility"; calls for domain expertise in synthesis and crystallography. [A]
  ([Consensus](https://consensus.app/papers/details/1296ef66b2365c7baeba4c56603803b9/?utm_source=claude_desktop))
  Matbench Discovery (Riebesell et al., Nature Machine Intelligence 2025): universal interatomic potentials are the best
  pre-filters for stable crystals; warns that accurate regressors can still have high false-positive rates near the hull. [A]
- **AlphaFold 2 – is it a GNN? (be precise).** Jumper et al., Nature 596, 583–589 (2021). The paper itself says the key
  principle of the Evoformer is "to view the prediction of protein structures as a **graph inference problem in 3D space in
  which the edges of the graph are defined by residues in proximity**"; Fig. 3b: "The pair representation interpreted as
  **directed edges in a graph**"; triangle multiplicative update and triangle self-attention update edge ij using edges ik, jk.
  The structure module uses **Invariant Point Attention** and "a novel **equivariant transformer**". [P – Europe PMC full text]
  → Accurate phrasing: AF2 is an attention-based network whose *pair representation is a dense (complete) graph's edge
  features*, updated by triangle operations – GNN-like/graph-inspired, **not** a classic sparse message-passing GNN.
- **AlphaFold 3** – Abramson et al., Nature 2024 (doi 10.1038/s41586-024-07487-w): Evoformer replaced by the simpler
  **Pairformer** (keeps pair + single representations, triangle updates; MSA processing reduced), and the structure module
  replaced by a **diffusion module** that predicts raw atom coordinates; handles proteins, nucleic acids, ligands, ions. [S + P DOI]

## 7. Weather forecasting

- **GraphCast – Lam et al., "Learning skillful medium-range global weather forecasting", Science 382, 1416–1421 (2023)**
  [M pages] (arXiv 2212.12794). Facts from the paper text [P]:
  - 10-day global forecast at **0.25°** resolution, 6-hour steps, **in under one minute on a single Cloud TPU v4**.
  - 5 surface + 6 atmospheric variables × 37 pressure levels = **227 variables** per grid point.
  - **Encoder–processor–decoder GNN**; processor = **16 unshared GNN layers** on a **multi-mesh** from a regular icosahedron
    refined 6 times (**40,962 nodes**, finest level 245,760 edges); **36.7 M parameters**.
  - Trained on 39 years of ERA5 (1979–2017); evaluated on 2018+.
  - Beats ECMWF **HRES on 90.3% of 1,380 targets** (significantly on 89.9%); excluding the 50 hPa level: 96.9% of 1,280;
    excluding 50 and 100 hPa: **99.7% of 1,180**. HRES's wins concentrate in the stratosphere.
  - **GNN-based: yes** (the canonical example).
- **GenCast – Price et al., "Probabilistic weather forecasting with machine learning", Nature 2024** (arXiv 2312.15796). Diffusion
  ensemble model; 15-day forecasts, 12-h steps, 0.25°, 80+ variables; one forecast ≈**8 min on a Cloud TPU v5**; better than ECMWF
  **ENS on 97.2% of 1,320 targets**. Architecture: encoder → **graph-transformer processor on a 6-times-refined icosahedral mesh**
  ("each node attends to its k-hop neighbourhood on the mesh") → decoder. **Graph-based: yes (graph transformer, not plain
  MPNN).** [A + P]
- 🆕 **ECMWF AIFS – operational 25 Feb 2025** (AIFS Single v1.0, deterministic), running alongside IFS. Architecture: **GNN
  encoder and decoder + sliding-window transformer processor** (Lang et al., arXiv 2406.01465; ECMWF Newsletter 183). ECMWF claims
  gains "up to 20%" on many measures incl. tropical cyclone tracks and ~**1,000× less energy** per forecast. Trained on ERA5
  1979–2022, fine-tuned on IFS analyses 2016–2022. [P – ECMWF news + S for newsletter details]
  🆕 **AIFS ENS operational 1 July 2025** (51 members, 31 km vs. 9 km for physics ENS; still uses physics-based data
  assimilation for initial conditions); upgraded to **AIFS ENS v2 on 12 May 2026**. [S – ECMWF pages via search summary]
- 🆕 **WeatherNext 2 (Google DeepMind/Google Research, announced 17 Nov 2025)** built on **FGN** – Alet, Price et al.,
  "Skillful joint probabilistic weather forecasting from marginals", arXiv 2506.10772 (12 Jun 2025). FGN uses "a very similar
  architecture to that of the denoiser in GenCast": 6-times-refined icosahedral mesh + **graph-transformer processor**, ~180M
  params per seed, 24 processor layers, 6-h steps; stochasticity via a 32-dim noise vector in conditional layer norm (learned
  model perturbations), trained only on per-location CRPS ("marginals") yet produces realistic joint structure. Better CRPS than
  GenCast on **99.9%** of targets (avg 6.5%, up to 18%); 15-day forecast **8× faster** than GenCast. [P – arXiv HTML]
  Press/docs: 64-member ensemble, "better on 99.9% of variables and lead times" vs. previous WeatherNext. [S]
- Note: Pangu-Weather (Huawei, Nature 2023) is a 3D Swin-transformer, FuXi/FengWu are transformer-based – **not** GNNs [M].
  GraphCast operational-style evaluations (2026, Brazil) show regime-dependent skill and smoothing of small-scale features [A].

## 8. Drug discovery

- **Halicin – Stokes et al., "A Deep Learning Approach to Antibiotic Discovery", Cell 180(4), 688–702 (Feb 2020)** [M for
  pages]. From the full text [P – PMC8349178]:
  - Model: **Chemprop directed message-passing neural network (D-MPNN)**, features augmented with RDKit descriptors.
  - Trained on **2,335 unique molecules** (from a 2,560-molecule screen for *E. coli* growth inhibition).
  - Scored the **Drug Repurposing Hub (6,111 molecules)**; tested top 99 + bottom 63 predictions; halicin (formerly SU3327, a
    c-Jun N-terminal kinase inhibitor [S]) emerged; broad-spectrum incl. *M. tuberculosis*, carbapenem-resistant
    Enterobacteriaceae; worked in mouse models (*C. difficile*, pan-resistant *A. baumannii*).
  - Then **107,349,233 ZINC15 molecules** (a subset of ~1.5 billion); **23** tested, **8** active.
- **Abaucin – Liu, Catacutan, …, Stokes, "Deep learning-guided discovery of an antibiotic targeting *Acinetobacter
  baumannii*", Nature Chemical Biology (May 2023)**, doi 10.1038/s41589-023-01349-8: screened **~7,500 molecules**, trained a
  neural network, predicted on new molecules; abaucin = **narrow-spectrum**, acts via lipoprotein trafficking (**LolE**), worked in a
  mouse wound model. [P – Broad page] (Secondary: 6,680 compounds scored, 240 tested, 9 active [S]; model is a Chemprop-type
  MPNN [M].)
- **Wong et al., "Discovery of a structural class of antibiotics with explainable deep learning", Nature 626, 177–185
  (online 20 Dec 2023, issue Feb 2024)**, doi 10.1038/s41586-023-06887-8. Measured activity + human-cell cytotoxicity for
  **39,312 compounds**; **ensembles of GNNs** scored **12,076,365 compounds**; explainable graph algorithms (substructure
  "rationales"); **283** tested; one structural class selective against **MRSA and VRE**, evades resistance, works in mouse MRSA
  models. [A + S] (Chemprop-based [M].)
- 🆕 Krishnan et al., "A generative deep learning approach to de novo antibiotic design", Cell 2025: fragment-based (>10⁷
  fragments) + de novo generation (genetic algorithms, VAEs) for *N. gonorrhoeae* and *S. aureus*; 24 synthesised, 7 selectively
  active, 2 leads effective in mice. GNN predictors used for scoring [M]. Wan et al., Nat. Biomed. Eng. 2024 (peptide "de-extinction")
  is sequence-based, not GNN. [A]
- Caveat for the chapter: none of these molecules is an approved drug as of the sources found; they are preclinical leads [M].

## 9. Industry

- **PinSage – Ying, He, Chen, Eksombatchai, Hamilton, Leskovec, "Graph Convolutional Neural Networks for Web-Scale Recommender
  Systems", KDD 2018** (arXiv 1806.01973). From the paper text [P]: graph with **~3 billion nodes** (pins + boards) and **18
  billion edges**, **7.5 billion training examples**; neighbourhoods chosen by **short random walks** (importance pooling, "46%
  performance gain"); curriculum training "+12%"; **MapReduce** inference for billions of embeddings. Results: beats best baseline
  by **>40%** (offline), preferred **~60%** of the time in head-to-head human evaluation, **A/B tests 30%–100% engagement
  improvements**.
- **Google Maps ETA – Derrow-Pinion et al. (DeepMind + Google Maps; last author P. Veličković), "ETA Prediction with Graph Neural
  Networks in Google Maps", CIKM 2021 (Applied Research Track)** (arXiv 2108.11482). Reduced negative ETA outcomes vs. the previous
  production system "by **40+% in cities like Sydney**". [P] (Earlier DeepMind blog, Sep 2020: up to 50% in some cities [M].)
- **Fraud / AML:** Weber et al. (IBM/MIT/Elliptic), "Anti-Money Laundering in Bitcoin: Experimenting with Graph Convolutional
  Networks for Financial Forensics", KDD 2019 workshop (arXiv 1908.02591): Elliptic dataset, >200K transactions, 234K payment
  flows; **"The results show the superiority of Random Forest"** over LR, MLP **and GCN**. [P] Good counter-example to "GNN always
  wins". 2024 systematic review of 97 AML network-analytics papers found GNNs best on Elliptic in a uniform comparison (arXiv
  2405.19383) [S]; Elliptic2 (2024): 122K labelled subgraphs [S]. ⚖️ (2019 RF > GCN vs. 2024 GNN best → depends on setup.)
- **Chip placement ⚖️ – Mirhoseini et al., "A graph placement methodology for fast chip design", Nature 594 (2021)** [M volume]:
  RL agent with an **edge-based graph convolutional network** encoding the netlist; claimed human-comparable or better
  floorplans (power, performance, area) "in under six hours". [S – Stanford page] Google DeepMind (Sep 2024) published a Nature
  **addendum**, released the pre-trained checkpoint as **"AlphaChip"**, and states it has been used for TPU layouts. [S – DeepMind
  blog via search] Critics: Cheng, Kahng et al. ("An Updated Assessment of RL for Macro Placement", arXiv 2302.11014, ISPD 2023 [M]
  + updates): simulated annealing and human baselines remain superior, and "no successful reproduction by others … as of
  November 2025"; Markov, "Reevaluating Google's Reinforcement Learning for IC Macro Placement", **Communications of the ACM 2024**:
  poorly documented claims, withheld inputs. [S] Treat as **contested**; the chapter should mention it only with that flag.

## 10. Scaling and benchmark reliability

- **GraphSAGE – Hamilton, Ying, Leskovec, "Inductive Representation Learning on Large Graphs", NIPS 2017** (arXiv 1706.02216):
  learns an *aggregator function* over **sampled** neighbourhoods instead of per-node embeddings → **inductive** (unseen nodes,
  even unseen graphs: PPI); tested on citation, Reddit, PPI. [P]
- **Cluster-GCN – Chiang et al., KDD 2019** (arXiv 1905.07953): mini-batches = clusters from graph partitioning; Amazon2M
  (~2M nodes, 61M edges); 3-layer GCN: 2.2 GB vs. 11.2 GB memory (VR-GCN); 4-layer trains in ~36 min where others go OOM; 5-layer
  PPI F1 99.36. [P]
- **Hardware irregularity:** GNN mini-batching requires neighbour traversal and **gathering scattered feature rows** – irregular
  memory access, poor locality; data loading/sampling often dominates training time (PyTorch-Direct 2021; FreshGNN VLDB 2023 –
  3.4–20.5× speedups on ogbn-papers100M/MAG240M by caching embeddings; GIDS 2023; FastGL ASPLOS 2024). Two families:
  full-graph vs. sample-based training (Serafini et al. 2021). [A] → matches MLSYS framing (sparse, irregular, memory-bound).
- **Benchmark reliability:**
  - **Shchur et al., "Pitfalls of Graph Neural Network Evaluation"** (arXiv 1811.05868, NeurIPS 2018 R2L workshop [M venue]):
    same fixed splits → **different splits give "dramatically different rankings"**; fairly tuned simpler GNNs beat sophisticated
    ones. [A]
  - **Platonov et al., "A critical look at the evaluation of GNNs under heterophily", ICLR 2023 [M venue]**: Squirrel and
    Chameleon contain many **duplicate nodes → train–test leakage**; on new heterophilous datasets standard GNNs almost always beat
    heterophily-specific models. [A]
  - **Link prediction:** Li et al. 2023 (NeurIPS D&B [M]) – underreported baselines, inconsistent splits, **easy negatives**; HeaRT
    hard-negative protocol [A]. Zhu et al., WSDM 2024 "SpotTarget": including the target edges in the message-passing graph causes
    overfitting, distribution shift and **implicit test leakage**, worst for low-degree nodes; fix → up to 15× more accurate on
    sparse graphs. [A]
  - 🆕 **Bechler-Speicher et al. (12 authors incl. Bronstein, Perozzi, Galkin, Morris), "Position: Graph Learning Will Lose
    Relevance Due To Poor Benchmarks", ICML 2025** (PMLR 267:81067–81089; arXiv 2502.14546): benchmarks over-focus on 2D molecular
    graphs instead of combinatorial optimisation, relational DBs, chip design; datasets poorly represent the underlying data;
    fragmented evaluation + accuracy obsession incentivise overfitting. [P]
  - 🆕 Kurashkin et al., MAKE 2026 systematic review (150 studies): only **2 of 25** central backbone studies used a formal
    between-method significance test; gains "repeatedly shrink or disappear" after fair tuning, fixing leaked splits, or testing on
    unseen data. [A]
  - General: Kapoor & Narayanan, Patterns 2023 – leakage found in 17 fields / 294 papers. [A]

## 11. Small classic facts

| Fact | Status | Notes |
|---|---|---|
| Zachary karate club: 34 nodes, 1977, *J. Anthropol. Res.* 33(4):452–473 | [S] | Observed 1970–72. |
| Karate club edges: **78** (NetworkX, most sources) – but a **77-edge** version also exists | [S] ⚖️ | Kipf & Welling's appendix says "34 nodes, connected by **154** (undirected and unweighted) edges" (= 77 × 2 directed) [P]. Use 78 and footnote the variant. |
| Cora: 2,708 nodes, **5,429 edges** (as listed), 1,433 features, 7 classes, label rate 0.052 (140 labels, 20/class) | [P] | GCN Table 1 and GAT dataset table. |
| Cora in PyG: `edge_index` has **10,556** entries (directed) | [S] | = 2 × 5,278 unique undirected edges (5,429 includes duplicates) [M for 5,278]. |
| GCN (Kipf & Welling, ICLR 2017; arXiv 1609.02907): Cora **81.5%**, Citeseer 70.3%, Pubmed 79.0%, NELL 66.0%; random splits Cora 80.1 ± 0.5 | [P] | Baselines in the same table: Planetoid 75.7, ICA 75.1, LP 68.0, DeepWalk 67.2, ManiReg 59.5, SemiEmb 59.0. **No MLP row in the GCN paper.** Hyperparams: dropout 0.5, L2 5·10⁻⁴, 16 hidden units. |
| MLP on Cora **55.1%** | [P] | From the **GAT** paper's table (Citeseer 46.5, Pubmed 71.4), not from GCN. |
| GAT (Veličković et al., ICLR 2018; arXiv 1710.10903): Cora **83.0 ± 0.7%**, Citeseer 72.5 ± 0.7, Pubmed 79.0 ± 0.3; PPI micro-F1 0.973 | [P] | |
| MUTAG: **188** nitroaromatic compounds, mutagenic on *Salmonella typhimurium*, 2 classes (125 / 63) | [S] | Debnath et al., J. Med. Chem. 1991; 188 = "regression-friendly" subset of 230. |
| Weisfeiler–Leman 1968 | [P cite / M details] | See §5 (spelling "Leman"). |
| Gilmer et al., "Neural Message Passing for Quantum Chemistry", **ICML 2017** (PMLR 70:1263–1272) | [P] | QM9: **130,462 molecules**, **13** targets; best MPNN reaches **chemical accuracy on 11 of 13**. |
| GIN ICLR 2019; Morris AAAI 2019; GraphSAGE NIPS 2017; GPS NeurIPS 2022; EGNN ICML 2021 | P/M | See sections above for which venues were checked. |

**Plan worked examples re-checked (pure Python, this session):** 5-node graph (edges 1–2, 1–3, 2–3, 2–4, 4–5): degrees
(2, 3, 2, 2, 1) ✓; first row of A² = (2, 1, 1, 1, 0) ✓. Self-loop mean aggregation from (1, 0, 0, 0, 5): population std 1.939 →
0.910 (1 step) → 0.347 (5) → 0.109 (10) → 0.001 (30) ✓; limit ≈ 0.867 = 13/15 (degree-weighted mean with self-loops,
weights 3,4,3,3,2) ✓. GCN normalisation on path 1–2–3: 1/2, 1/√6 ≈ 0.408, 1/3 ✓.

---

## Suggested 📅 boxes for the chapter

1. **📅 2023 (Science):** A GraphCast GNN 10 napos globális előrejelzést készít 0,25°-os felbontással, egyetlen TPU-n
   egy percen belül, és az ECMWF HRES-nél jobb az 1380 vizsgált célváltozó 90%-án (Lam et al., Science 2023).
2. **📅 2025. február 25.:** Az ECMWF élesítette az AIFS-t – GNN-kódoló/-dekódoló + Transformer-processzor –, a fizikai IFS
   mellett; 2025. július 1-jétől az 51 tagú AIFS ENS is operatív (ECMWF).
3. **📅 2025 (WeatherNext 2 / FGN):** A GenCast-utód FGN ugyanazon az ikozaéderes rácson futó gráf-Transformer; a GenCastnál
   a célok 99,9%-án jobb CRPS-t ér el, és 8× gyorsabb (Alet et al., arXiv 2506.10772; bejelentés: 2025. nov. 17.).
4. **📅 2020 (Cell):** A halicint egy Chemprop üzenetküldő háló találta meg: 2335 molekulán tanult, a 6111 molekulás Drug
   Repurposing Hubot pontozta, majd 107 millió ZINC15-molekulát (Stokes et al., Cell 2020).
5. **📅 2023 (Nature):** GNoME – gráfhálók 2,2 millió új, a korábbi konvex burok alatti kristályszerkezetet jósoltak, ebből 736-ot
   független laborok már előállítottak; ⚖️ a kémikusok vitatják, mennyi valóban új és hasznos (Merchant et al. 2023;
   Cheetham & Seshadri, Chem. Mater. 2024).
6. **📅 2024 (NeurIPS) – 2025 (ICML):** Kis hangolással a klasszikus GCN/GAT/GraphSAGE 18-ból 17 csúcsosztályozási adathalmazon
   hozza vagy veri a gráf-Transformereket; gráfszintű feladatokon 14-ből 8-ban elsők (Luo et al. 2024, 2025). A korábbi előny
   nagyrészt hangolási műtermék volt (Tönshoff et al., TMLR 2024).
7. **📅 2025 (ICML, álláspontcikk):** 12 vezető kutató szerint a gráftanulás a rossz benchmarkok miatt veszíthet jelentőségéből:
   túl sok a 2D-s molekulagráf, túl kevés a valós feladat, és a pontosság hajszolása túlillesztésre ösztönöz
   (Bechler-Speicher et al., ICML 2025).
8. **📅 2024 (GraphRAG):** A Microsoft GraphRAG egy LLM-mel tudásgráfot épít a dokumentumokból, és közösség-összefoglalókból
   válaszol; az átfogó kérdéseken a vektoros RAG ellen 72–83%-ban nyert (LLM-bíró) – 2025-ös újraértékelések szerint viszont
   sok konkrét kérdésen a sima RAG a jobb (Edge et al. 2024; Han et al. 2025; Xiang et al. 2025).
9. **📅 2024 (ICLR):** „Talk like a Graph": ugyanaz a gráf másképp szövegesítve 4,8–61,8%-kal jobb vagy rosszabb LLM-eredményt
   ad – az LLM gráfértése erősen függ a kódolástól (Fatemi et al., ICLR 2024).
10. **📅 2018 (KDD) / 2021 (CIKM):** PinSage 3 milliárd csúcsú, 18 milliárd élű gráfon fut a Pinteresten (A/B-teszt: 30–100%
    több interakció); a Google Maps GNN-alapú érkezésiidő-becslése Sydneyben 40% fölött csökkentette a rossz becslések arányát
    (Ying et al. 2018; Derrow-Pinion et al. 2021).

## Common misconceptions / errors seen in sources

- **"GCN reaches 81.5% on Cora vs. MLP ~55%" attributed to the GCN paper** – the GCN paper has *no* MLP baseline; 55.1% is from
  the GAT paper's table. Cite both.
- **Karate club edge count:** 78 is standard, but a 77-edge version exists, and Kipf & Welling report "154 edges" (both directions).
  Don't present 78 as the only correct number without a note.
- **Cora edges 5,429 vs. 10,556:** the first is the dataset listing (with duplicates), the second is PyG's directed `edge_index`
  count. Neither is "the number of undirected edges" (~5,278).
- **"Weisfeiler–Lehman"**: the second author is A. A. **Leman**; "Lehman" is a widespread misspelling (now entrenched in ML).
- **"AlphaFold is a GNN"**: imprecise. AF2's own paper frames the Evoformer as *graph inference* with the pair representation as
  directed edges, and the structure module as an equivariant transformer – graph-inspired attention on a dense graph, not a
  sparse message-passing GNN. AF3 replaces both pieces (Pairformer + diffusion).
- **"GraphRAG is a graph neural network"**: no – it is an LLM-built knowledge-graph index with community summaries; nothing is
  learned by message passing. Also, GraphRAG is not uniformly better than vector RAG (2025 evaluations).
- **"All ML weather models are GNNs"**: GraphCast is an MPNN; GenCast/FGN (WeatherNext 2) use a *graph transformer* on a mesh;
  AIFS = GNN encoder/decoder + transformer processor; Pangu-Weather, FuXi, FengWu are transformer-based without a GNN core.
- **"AIFS is a GNN model" / "AIFS ENS operational in Feb 2025"**: AIFS Single → 25 Feb 2025; AIFS ENS → 1 Jul 2025 (v2 from
  12 May 2026). The processor is a transformer.
- **GraphCast "beats HRES on 99.7% of targets"**: that is only after excluding 50 and 100 hPa levels (1,180 targets); the headline
  is 90% of 1,380.
- **GNoME "discovered 2.2 million new materials"**: they are *predicted* stable structures (DFT-verified below the hull), ~380k on
  the final hull, 736 matched to prior/independent experiments; novelty and usefulness are disputed (Cheetham & Seshadri 2024).
- **Halicin numbers**: the model was trained on 2,335 molecules (not "millions"); the >100M screen was ZINC15 (107,349,233), the
  6,111-molecule Drug Repurposing Hub is where halicin itself came from.
- **AlphaChip / chip placement as a settled GNN success**: the Nature 2021 claims are publicly contested (CACM 2024; Cheng & Kahng
  et al., no independent reproduction as of Nov 2025). Present as a controversy, if at all.
- **"Graph Transformers are strictly better than MPNNs"**: not supported on standard benchmarks once baselines are tuned (2023–2025
  re-evaluations); expressivity ≠ accuracy.
- **"Oversmoothing is why deep GNNs fail"**: oversmoothing is provable but several studies (KDD 2022, CIKM 2024) show trainability /
  model degradation of the transformation layers is at least as important; attention (GAT/transformers) does *not* prevent it.
- **"Rewiring fixes oversquashing on real data"**: gains on real datasets are fragile and hyperparameter-sensitive (Tori et al. 2024).
- **"GNNs always beat tabular models on transaction graphs"**: the Elliptic paper (2019) found Random Forest best; later studies vary.
- **"Attention weights explain the prediction"** (GAT): consistent with plan's trap list; not re-researched here, but nothing found
  contradicting it.
- **Heterophily benchmarks (Squirrel, Chameleon)** contain duplicate nodes → leakage; results on them before 2023 are unreliable.

## Gaps / not verified in this session
- Consensus monthly quota ran out (resets 1 Nov 2026), so questions 9–11 were covered with web/primary sources instead.
- No rigorous 2025–2026 source on how *reasoning* LLMs perform on textual graph tasks.
- Venues marked [M] (GIN, Morris, EGNN, MACE, GPS, LRGB, NLGraph, Wu et al. 2023, Di Giovanni 2023, Platonov 2023) are standard
  but were not re-opened.
- Chemprop use in Wong et al. 2023/24 and in abaucin – likely but not confirmed from full text.
