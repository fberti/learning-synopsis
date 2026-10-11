# Ch12 source-digest checks (MLD, AAMLP, MLQ, RWML numbers)
import math
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer, TfidfTransformer

print("== MLD 18: BoW toy corpus ==")
corpus = ['The quick brown fox jumps over the lazy dog.',
          'My dog is quick and can jump over fences.',
          'Your dog is so lazy that it sleeps all the day.']
v = CountVectorizer(binary=True).fit(corpus)
print("vocab size", len(v.vocabulary_), "dog idx", v.vocabulary_['dog'])
print(v.transform(corpus).toarray())
print("words in all 3 docs:", [w for w, i in v.vocabulary_.items() if v.transform(corpus).toarray()[:, i].all()])
print("distinct lowercased tokens in text_1:", len(set(CountVectorizer().build_analyzer()(corpus[0]))))
corpus4 = corpus + ['A black dog just passed by but my dog is brown.']
v4 = CountVectorizer().fit(corpus4)
X4 = v4.transform(corpus4)
print("vocab", len(v4.vocabulary_), "dog idx", v4.vocabulary_['dog'], "row4", X4.toarray()[-1])
T = TfidfTransformer(norm='l1').fit_transform(X4).toarray()[3]
for w, i in sorted(v4.vocabulary_.items(), key=lambda t: t[1]):
    if T[i]:
        print(f"  {w:8s} {T[i]:.3f}")
print("  sum", T.sum())
# manual: smooth idf = ln((1+n)/(1+df)) + 1
n = 4
for w, df in [('dog', 4), ('my', 2), ('is', 3), ('black', 1)]:
    print("  idf", w, round(math.log((1 + n) / (1 + df)) + 1, 4))
bi = CountVectorizer(ngram_range=(2, 2)).fit(corpus4)
print("bigram vocab size", len(bi.vocabulary_))

print("== AAMLP: TF-IDF toy (pre-tokenized as nltk word_tokenize would) ==")
toks = ["hello , how are you ?",
        "im getting bored at home . and you ? what do you think ?",
        "did you know about counts",
        "let 's see if this works !",
        "yes ! ! ! !"]
tfv = TfidfVectorizer(tokenizer=str.split, token_pattern=None, lowercase=False).fit(toks)
X = tfv.transform(toks).toarray()
print("vocab size", len(tfv.vocabulary_))
for r in range(5):
    print(r, {k: round(X[r, i], 4) for k, i in tfv.vocabulary_.items() if X[r, i]})
cv = CountVectorizer().fit(["hello, how are you?", "im getting bored at home. And you? What do you think?",
                            "did you know about counts", "let's see if this works!", "YES!!!!"])
print("CountVectorizer default vocab size", len(cv.vocabulary_))
# textbook TF-IDF (AAMLP formula) for row 0 'you' : tf=1/6, idf=log(5/3)
print("textbook tf*idf 'you' row0 (ln):", (1/6)*math.log(5/3), " (log10):", (1/6)*math.log10(5/3))

print("== AAMLP fold means ==")
res = {
 "BoW+LR": [0.8903, 0.897, 0.891, 0.8914, 0.8931],
 "BoW+MNB": [0.8444, 0.8499, 0.8422, 0.8443, 0.8455],
 "TFIDF+LR": [0.8976, 0.8998, 0.8948, 0.8912, 0.8995],
 "TFIDF(1-3)+LR": [0.8931, 0.8941, 0.897, 0.8922, 0.8847],
 "fastText avg+LR": [0.8619, 0.8661, 0.8544, 0.8624, 0.8595],
 "BiLSTM fastText": [0.9015, 0.9007, 0.8924, 0.9, 0.878],
}
for k, a in res.items():
    print(f"  {k:16s} mean {np.mean(a):.4f}  min {min(a)} max {max(a)}")

print("== AAMLP BiLSTM params ==")
E, H = 300, 128
per_dir = 4 * (H * E + H * H + 2 * H)   # PyTorch: W_ih, W_hh, b_ih, b_hh
print("  LSTM per direction", per_dir, "bi", 2 * per_dir, "linear", 512 + 1, "trainable total", 2 * per_dir + 513)
print("  BERT head 768->1:", 768 + 1)

print("== MLD Keras model ==")
for voc in (50000, 100000):
    print("  voc", voc, "Embedding", voc * 8, "Dense", 256 * 8 + 1, "total", voc * 8 + 256 * 8 + 1)

print("== MLQ: LoRA, perplexity, BERTScore ==")
A, B, h = 25, 50, 5
print("  dW", A * B, "WA", A * h, "WB", h * B, "sum", A * h + h * B)
for ps in ([0.99, 0.85, 0.89, 0.99, 0.99, 0.99, 0.99, 0.99], [0.99, 0.65, 0.13, 0.05, 0.21, 0.99, 0.99, 0.99]):
    print("  ppl", round(2 ** (-sum(math.log2(p) for p in ps) / len(ps)), 4))
print("  BERTScore (P)", (0.63 + 0.72 + 0.70 + 0.70) / 4)
# recall direction from same matrix (rows A,cat,leaped,high ; cols The,cat,jumped)
M = np.array([[0.63, 0.53, 0.52], [0.59, 0.72, 0.69], [0.55, 0.69, 0.70], [0.55, 0.69, 0.70]])
P = M.max(1).mean(); Rr = M.max(0).mean()
print("  P", P, "R", round(Rr, 4), "F1", round(2 * P * Rr / (P + Rr), 4))

print("== Kaplan scaling: doubling N, alpha_N=0.076 ==")
print("  loss ratio", round(2 ** -0.076, 4))

print("== RWML ==")
print("  0.7*25000 =", 0.7 * 25000, " grid combos", 4 * 3 * 3)
print("  sparsity 0.2% of 17500x65005 nonzeros ~", round(0.002 * 17500 * 65005))
