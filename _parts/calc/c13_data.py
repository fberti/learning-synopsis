# 13. fejezet – adatbetöltők (karateklub, Cora, MUTAG)
import json, os, pickle, sys
import numpy as np

D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "ch13", "data")


def karate():
    import networkx as nx
    G = nx.karate_club_graph()
    edges = sorted((min(u, v), max(u, v)) for u, v in G.edges())
    club = np.array([0 if G.nodes[i]["club"] == "Mr. Hi" else 1 for i in range(34)])
    return 34, edges, club


def cora():
    import scipy.sparse as sp
    objs = []
    for n in ["x", "y", "tx", "ty", "allx", "ally", "graph"]:
        with open(os.path.join(D, "ind.cora." + n), "rb") as f:
            objs.append(pickle.load(f, encoding="latin1"))
    x, y, tx, ty, allx, ally, graph = objs
    test_idx = [int(l) for l in open(os.path.join(D, "ind.cora.test.index"))]
    test_sorted = np.sort(test_idx)
    feats = sp.vstack((allx, tx)).tolil()
    feats[test_idx, :] = feats[test_sorted, :]
    labels = np.vstack((ally, ty))
    labels[test_idx, :] = labels[test_sorted, :]
    n = feats.shape[0]
    edges = set()
    for u, nb in graph.items():
        for v in nb:
            if u != v:
                edges.add((min(u, v), max(u, v)))
    X = np.asarray(feats.todense(), dtype=np.float32)
    Y = labels.argmax(1)
    idx_train = np.arange(140)
    idx_val = np.arange(140, 640)
    idx_test = test_sorted[:1000]
    return X, Y, sorted(edges), idx_train, idx_val, idx_test


def mutag():
    L = [json.loads(l) for l in open(os.path.join(D, "mutag.jsonl"))]
    out = []
    for g in L:
        n = g["num_nodes"]
        ei = g["edge_index"]
        E = sorted({(min(a, b), max(a, b)) for a, b in zip(ei[0], ei[1]) if a != b})
        # kötéstípus (élenként) – az edge_attr a irányított élekhez tartozik
        bond = {}
        for a, b, at in zip(ei[0], ei[1], g["edge_attr"]):
            bond[(min(a, b), max(a, b))] = int(np.argmax(at))
        atoms = [int(np.argmax(f)) for f in g["node_feat"]]
        out.append(dict(n=n, edges=E, atoms=atoms, bonds=[bond[e] for e in E], y=g["y"][0]))
    return out


ATOMS = ["C", "N", "O", "F", "I", "Cl", "Br"]

if __name__ == "__main__":
    n, e, c = karate(); print("karate", n, len(e), c.sum())
    X, Y, E, a, b, t = cora(); print("cora", X.shape, len(E), np.bincount(Y), len(t))
    M = mutag(); print("mutag", len(M), sum(m["y"] for m in M))
