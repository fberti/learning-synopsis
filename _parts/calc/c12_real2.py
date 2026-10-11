import json, sys, torch, numpy as np
from transformers import AutoTokenizer, AutoModel, MarianMTModel, MarianTokenizer
torch.manual_seed(0)
out = {}
tok = AutoTokenizer.from_pretrained("SZTAKI-HLT/hubert-base-cc"); m = AutoModel.from_pretrained("SZTAKI-HLT/hubert-base-cc", output_attentions=True, output_hidden_states=True, attn_implementation="eager").eval()
S = ["Lehullott a levél a fáról.", "Ősszel a levél lehullik.", "A levél zöld volt a fán.",
     "Megjött a levél a postán.", "A levél a postaládában volt.", "A levél bélyeg nélkül érkezett."]
H = []
for s in S:
    enc = tok(s, return_tensors="pt"); toks = tok.convert_ids_to_tokens(enc.input_ids[0])
    with torch.no_grad(): o = m(**enc)
    i = toks.index("levél"); H.append([o.hidden_states[l][0, i].numpy() for l in range(13)])
cosl = []
for l in range(13):
    V = [h[l] for h in H]
    C = np.array([[float(a @ b / np.linalg.norm(a) / np.linalg.norm(b)) for b in V] for a in V]); cosl.append(np.round(C, 3).tolist())
    same = np.mean([C[i, j] for i in range(6) for j in range(6) if i < j and (i < 3) == (j < 3)]); diff = np.mean([C[i, j] for i in range(3) for j in range(3, 6)])
    print(l, round(same, 3), round(diff, 3))
out["levelSent"] = S; out["levelCos"] = cosl
ATT = {}
for s in ["Lehullott a levél a fáról.", "Megjött a levél a postán.", "A film jó volt, de a vége unalmas."]:
    enc = tok(s, return_tensors="pt")
    with torch.no_grad(): o = m(**enc)
    ATT[s] = {"tokens": tok.convert_ids_to_tokens(enc.input_ids[0]), "att": [[np.round(a[0, hh].numpy(), 2).tolist() for hh in range(12)] for a in o.attentions]}
out["hubert"] = ATT
mt = MarianMTModel.from_pretrained("Helsinki-NLP/opus-mt-hu-en", attn_implementation="eager").eval(); mtok = MarianTokenizer.from_pretrained("Helsinki-NLP/opus-mt-hu-en")
X = {}
for s in ["Holnap moziba megyek a barátaimmal.", "A fekete macska az asztalon alszik.", "Megjött a levél a postán.", "Lehullott a levél a fáról.", "Lehullott egy sárga levél a fáról.", "A fáról lehullott levelek sárgák."]:
    enc = mtok([s], return_tensors="pt")
    with torch.no_grad():
        g = mt.generate(**enc, num_beams=1, max_new_tokens=40)
        o = mt(**enc, decoder_input_ids=g[:, :-1], output_attentions=True)
    tr = mtok.decode(g[0], skip_special_tokens=True)
    src = mtok.convert_ids_to_tokens(enc.input_ids[0]); tgt = mtok.convert_ids_to_tokens(g[0, 1:])
    print(s, "->", tr, src, tgt)
    for l, a in enumerate(o.cross_attentions):
        av = a[0].mean(0).numpy()
        print("  L", l, [src[j] for j in av.argmax(1)])
    X[s] = {"src": src, "tgt": tgt, "translation": tr, "cross": [[np.round(a[0, hh].numpy(), 2).tolist() for hh in range(a.shape[1])] for a in o.cross_attentions]}
out["mt"] = X
json.dump(out, open(sys.argv[1], "w"))
