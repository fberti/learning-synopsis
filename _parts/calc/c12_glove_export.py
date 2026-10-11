import sys, json, numpy as np
from gensim.models import KeyedVectors
kv = KeyedVectors.load(sys.argv[1])
W = """king:király queen:királynő man:férfi woman:nő prince:herceg princess:hercegnő boy:fiú girl:lány father:apa mother:anya
son:fia daughter:lánya husband:férj wife:feleség brother:fivér sister:nővér uncle:nagybácsi aunt:nagynéni
hungary:Magyarország budapest:Budapest france:Franciaország paris:Párizs italy:Olaszország rome:Róma germany:Németország berlin:Berlin
spain:Spanyolország madrid:Madrid austria:Ausztria vienna:Bécs poland:Lengyelország warsaw:Varsó japan:Japán tokyo:Tokió
china:Kína beijing:Peking russia:Oroszország moscow:Moszkva britain:Nagy-Britannia london:London greece:Görögország athens:Athén
sweden:Svédország stockholm:Stockholm egypt:Egyiptom cairo:Kairó
cat:macska dog:kutya horse:ló cow:tehén pig:disznó sheep:juh lion:oroszlán tiger:tigris wolf:farkas fox:róka rabbit:nyúl
mouse:egér bird:madár eagle:sas fish:hal shark:cápa snake:kígyó
apple:alma banana:banán orange:narancs grape:szőlő lemon:citrom bread:kenyér cheese:sajt milk:tej coffee:kávé tea:tea wine:bor beer:sör
microsoft:Microsoft google:Google iphone:iPhone computer:számítógép software:szoftver internet:internet
bank:bank money:pénz loan:hitel credit:hitel/jóváírás river:folyó shore:part water:víz lake:tó
walk:sétál walked:sétált swim:úszik swam:úszott run:fut ran:futott go:megy went:ment eat:eszik ate:evett see:lát saw:látott write:ír wrote:írt
big:nagy bigger:nagyobb biggest:legnagyobb small:kicsi smaller:kisebb smallest:legkisebb good:jó better:jobb best:legjobb
bad:rossz worse:rosszabb worst:legrosszabb fast:gyors faster:gyorsabb slow:lassú slower:lassabb long:hosszú longer:hosszabb
great:remek terrible:szörnyű excellent:kiváló awful:borzalmas boring:unalmas exciting:izgalmas beautiful:szép ugly:csúnya
happy:boldog sad:szomorú love:szeret hate:gyűlöl hot:forró cold:hideg
doctor:orvos nurse:ápoló teacher:tanár engineer:mérnök programmer:programozó scientist:tudós lawyer:ügyvéd homemaker:háztartásbeli
receptionist:recepciós carpenter:asztalos surgeon:sebész
one:egy two:kettő three:három four:négy five:öt ten:tíz hundred:száz
red:piros green:zöld blue:kék yellow:sárga black:fekete white:fehér
car:autó bus:busz train:vonat plane:repülő bicycle:kerékpár ship:hajó
guitar:gitár piano:zongora violin:hegedű trumpet:trombita trombone:harsona saxophone:szaxofon
leaf:levél(fa) tree:fa letter:levél(posta) mail:posta paper:papír flower:virág
film:film movie:mozifilm music:zene story:történet actor:színész""".split()
words = [w.split(":")[0] for w in W]; hu = {w.split(":")[0]: w.split(":")[1] for w in W}
missing = [w for w in words if w not in kv.key_to_index]; print("missing", missing)
X = np.array([kv[w] for w in words])
Xc = X - X.mean(0); U, S, Vt = np.linalg.svd(Xc, full_matrices=False); P = Xc @ Vt[:2].T
print("evr", (S[:2]**2 / (S**2).sum()).round(3), len(words))
def top(v, excl, n=5):
    sims = kv.cosine_similarities(v, kv.vectors); idx = np.argsort(-sims); out = []
    for i in idx:
        w = kv.index_to_key[i]
        if w in excl: continue
        out.append([w, round(float(sims[i]), 3)])
        if len(out) >= n: return out
presets = [("man", "king", "woman"), ("france", "paris", "hungary"), ("walk", "walked", "swim"), ("big", "bigger", "small"),
           ("man", "doctor", "woman"), ("man", "programmer", "woman"), ("yellow", "lemon", "green"), ("valves", "trumpet", "slide")]
G = {}
for a, b, c in presets:
    v = kv[b] - kv[a] + kv[c]
    G[f"{b}-{a}+{c}"] = {"excl": top(v, {a, b, c}), "incl": top(v, set())}
    print(b, "-", a, "+", c, G[f"{b}-{a}+{c}"])
nn = {w: top(kv[w], {w}, 6) for w in ["bank", "apple", "cat", "good", "king", "budapest", "letter", "leaf"]}
for w, v in nn.items(): print(w, v)
pairs = [("good", "bad"), ("hot", "cold"), ("love", "hate"), ("cat", "dog"), ("cat", "car"), ("bank", "river"), ("bank", "money"), ("king", "queen"), ("letter", "leaf"), ("apple", "banana"), ("apple", "microsoft")]
for p in pairs: print(p, round(float(kv.similarity(*p)), 3))
data = {"words": words, "hu": [hu[w] for w in words], "vec": [[round(float(x), 3) for x in v] for v in X], "xy": [[round(float(x), 3) for x in p] for p in P], "global": G, "nn": nn,
        "src": "GloVe 6B (Wikipedia 2014 + Gigaword 5), 50 dimenzió, 400 000 szó; Pennington, Socher, Manning 2014"}
open(sys.argv[2], "w").write("/* 12. fejezet – GloVe-részhalmaz (50 dimenzió), generálta: _parts/calc/c12_glove_export.py */\nwindow.GLOVE12 = " + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n")
