import random, networkx as nx
def sir(G, seed, beta, gamma, rng=random.Random(1)):
    state = {v: "S" for v in G}; state[seed] = "I"; total = 1
    while any(s == "I" for s in state.values()):
        inf = [v for v in G if state[v] == "I"]
        new = {u for v in inf for u in G[v] if state[u] == "S" and rng.random() < beta}
        for v in inf:
            if rng.random() < gamma: state[v] = "R"
        for u in new: state[u] = "I"
        total += len(new)
    return total                      # ennyien fertőződtek meg összesen
G = nx.watts_strogatz_graph(1000, 4, 0.1, seed=1)
print(sum(sir(G, 0, 0.5, 1.0) for _ in range(100)) / 100)
