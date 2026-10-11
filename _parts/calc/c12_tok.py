from transformers import AutoTokenizer
t = AutoTokenizer.from_pretrained("SZTAKI-HLT/hubert-base-cc")
print(len(t.vocab))
for w in ["ház", "házak", "házban", "házaimban", "házunkból", "levél", "levelet", "leveleinket", "film", "filmjeinkben", "megszentségteleníthetetlenségeskedéseitekért", "A film nem volt jó, de a vége remek volt!", "szeretlek", "ChatGPT"]:
    print(w, t.tokenize(w))
from transformers import MarianTokenizer
m = MarianTokenizer.from_pretrained("Helsinki-NLP/opus-mt-hu-en")
for w in ["házaimban", "leveleinket", "A film nem volt jó, de a vége remek volt!"]: print(w, m.tokenize(w))
