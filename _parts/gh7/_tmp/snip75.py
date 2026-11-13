import random, itertools
from collections import Counter
cikkek = [{"Ko","Vi"}, {"Ko","Vi","Po"}, {"Ko","Po"}, {"Vi","Sz"}, {"Sz","Kl","Ko"}, {"Sz","Kl"},
          {"La","Ön"}, {"La","Po","Ön"}, {"La","Ön"}, {"Po","Vi"}, {"Po","La"}, {"Ön","Po"}]
def curveball(sorok, lepes=200):
    S = [set(s) for s in sorok]
    for _ in range(lepes):
        a, b = random.sample(range(len(S)), 2)
        ab, ba = list(S[a] - S[b]), list(S[b] - S[a])
        pool = ab + ba; random.shuffle(pool)
        kozos = S[a] & S[b]
        S[a], S[b] = kozos | set(pool[:len(ab)]), kozos | set(pool[len(ab):])
    return S
null = [sum({"La","Ön"} <= c for c in curveball(cikkek)) for _ in range(20000)]
print(sum(x >= 3 for x in null) / len(null))      # ≈ 0.018