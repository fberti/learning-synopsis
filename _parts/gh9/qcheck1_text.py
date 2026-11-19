from common import *
import random, math
def kap(G):
    k=np.array([d for _,d in G.degree()],float); return k.mean(), (k**2).mean(), (k**2).mean()/k.mean(), (k**2).mean()/k.mean()-1
Gp,_=polblogs(); print("polblogs",kap(Gp)); print("lesmis",kap(nx.les_miserables_graph())); print("karate",kap(karate()))
print("2223/27.4",2223/27.4, "79.5/6.6",79.5/6.6)
def sir(G, seed, beta, gamma, rng=random.Random(1)):
    state = {v: "S" for v in G}; state[seed] = "I"; total = 1
    while any(s == "I" for s in state.values()):
        inf = [v for v in G if state[v] == "I"]
        new = {u for v in inf for u in G[v] if state[u] == "S" and rng.random() < beta}
        for v in inf:
            if rng.random() < gamma: state[v] = "R"
        for u in new: state[u] = "I"
        total += len(new)
    return total
G = nx.watts_strogatz_graph(1000, 4, 0.1, seed=1)
print("snippet",sum(sir(G, 0, 0.5, 1.0) for _ in range(100)) / 100)
print("0.9^6",.9**6,.9**7)
# hub add
print("hub", 30000/4200-1)
# ABC SI beta .5 C by step 3
T=nx.star_graph(999); prev=1
for i in range(10): T.add_edge(prev,1000+i); prev=1000+i
n=T.number_of_nodes(); print("broadcast+chain n",n,"depth",max(nx.single_source_shortest_path_length(T,0).values()),"nu",nx.wiener_index(T)/math.comb(n,2))
