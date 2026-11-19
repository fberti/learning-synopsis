from common import *
G=arv()
print("deg",dict(G.degree()))
print("ecc",nx.eccentricity(G))
for s in G: print(s, dict(nx.single_source_shortest_path_length(G,s)))
# SI beta=1 counts per step from Kl
for s in ["Kl","Po","La"]:
    d=nx.single_source_shortest_path_length(G,s); c=[sum(1 for v in d.values() if v<=t) for t in range(4)]; print("SI",s,c)
# IC exact p=0.5 single seeds
for p in [0.3,0.5]:
    print("p",p,{s:round(ic_exact(G,[s],p),4) for s in G})
