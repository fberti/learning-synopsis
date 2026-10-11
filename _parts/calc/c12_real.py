# valódi modellek: huBERT (kontextuális "levél"), opus-mt-hu-en (keresztfigyelem)
import json, sys, torch, numpy as np
from transformers import AutoTokenizer, AutoModel, MarianMTModel, MarianTokenizer
out = {}
tok = AutoTokenizer.from_pretrained("SZTAKI-HLT/hubert-base-cc"); m = AutoModel.from_pretrained("SZTAKI-HLT/hubert-base-cc", output_attentions=True, output_hidden_states=True).eval()
S = ["Lehullott a levél a fáról.", "A fa minden levele sárga lett.", "Ősszel a levél lehullik.",
     "Megjött a levél a postán.", "A postás hozott egy levelet.", "Levelet írtam a nagymamámnak."]
print([tok.tokenize(s) for s in S])
def vec(s, target_prefix, layer):
    enc = tok(s, return_tensors="pt"); ids = enc.input_ids[0].tolist(); toks = tok.convert_ids_to_tokens(ids)
    with torch.no_grad(): o = m(**enc)
    i = [k for k, t in enumerate(toks) if t.lower().startswith(target_prefix)][0]
    return o.hidden_states[layer][0, i].numpy(), toks, o
for layer in [0, 4, 8, 12]:
    V = [vec(s, "lev", layer)[0] for s in S]
    C = np.array([[float(a @ b / np.linalg.norm(a) / np.linalg.norm(b)) for b in V] for a in V])
    print(layer); print(np.round(C, 2))
    out[f"cos_l{layer}"] = np.round(C, 3).tolist()
# figyelmi térképek néhány mondatra, minden réteg/fej
A = {}
for s in ["Lehullott a levél a fáról.", "Megjött a levél a postán.", "A film jó volt, de a vége unalmas."]:
    enc = tok(s, return_tensors="pt")
    with torch.no_grad(): o = m(**enc)
    A[s] = {"tokens": tok.convert_ids_to_tokens(enc.input_ids[0]), "att": [np.round(a[0].numpy(), 3).tolist() for a in o.attentions]}
out["hubert_att"] = A
mt = MarianMTModel.from_pretrained("Helsinki-NLP/opus-mt-hu-en", attn_implementation="eager").eval(); mtok = MarianTokenizer.from_pretrained("Helsinki-NLP/opus-mt-hu-en")
X = {}
for s in ["Holnap moziba megyek a barátaimmal.", "A fekete macska az asztalon alszik.", "Megjött a levél a postán.", "Lehullott a levél a fáról."]:
    enc = mtok([s], return_tensors="pt")
    with torch.no_grad():
        g = mt.generate(**enc, num_beams=1, max_new_tokens=40)
        o = mt(**enc, decoder_input_ids=g[:, :-1], output_attentions=True)
    tr = mtok.decode(g[0], skip_special_tokens=True); print(s, "->", tr)
    X[s] = {"src": mtok.convert_ids_to_tokens(enc.input_ids[0]), "tgt": mtok.convert_ids_to_tokens(g[0, 1:]), "translation": tr,
            "cross": [np.round(a[0].numpy(), 3).tolist() for a in o.cross_attentions]}
out["mt"] = X
json.dump(out, open(sys.argv[1], "w"))
