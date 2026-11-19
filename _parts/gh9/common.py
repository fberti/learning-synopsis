import json, re, itertools, networkx as nx, numpy as np
BASE="/forlinux/MEGA/MEGABase/obsidian/Vault/Learning/synopsis/"
ARV_E=[("Ko","Vi",2),("Ko","Po",2),("Vi","Po",2),("Vi","Sz",1),("Sz","Kl",2),("Ko","Sz",1),("Ko","Kl",1),("La","Ön",3),("Po","La",2),("Po","Ön",2)]
def arv():
    G=nx.Graph(); G.add_nodes_from(["Ko","Vi","Po","La","Ön","Sz","Kl"]); G.add_weighted_edges_from(ARV_E); return G
def loadjs(path,var):
    s=open(BASE+path,encoding="utf-8").read()
    m=re.search(r"window\."+var+r"\s*=\s*(\{.*?\});",s,re.S); return json.loads(m.group(1))
def karate():
    d=loadjs("mesterseges-intelligencia/13-graf-neuralis-halok/graph-data.js","KARATE13")
    G=nx.Graph(); G.add_nodes_from(range(d["n"])); G.add_edges_from(map(tuple,d["edges"])); return G
def polblogs():
    d=loadjs("grafelmelet-halozattudomany/05-centralitas/polblogs-data.js","POLBLOGS")
    G=nx.Graph(); G.add_nodes_from(range(d["n"])); e=d["edges"]; G.add_edges_from((e[i],e[i+1]) for i in range(0,len(e),2)); G.remove_edges_from(nx.selfloop_edges(G)); return G,d
def ic_exact(G,seeds,p):
    """expected spread under IC = expected size of union of components containing seeds in bond-percolated graph"""
    E=list(G.edges()); m=len(E); tot=0.0
    if isinstance(p,(int,float)): p={e:p for e in E}
    for mask in range(1<<m):
        pr=1.0; H=nx.Graph(); H.add_nodes_from(G)
        for i,e in enumerate(E):
            if mask>>i&1: pr*=p[e]; H.add_edge(*e)
            else: pr*=1-p[e]
        S=set()
        for s in seeds: S|=nx.node_connected_component(H,s)
        tot+=pr*len(S)
    return tot
