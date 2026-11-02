import json, random, networkx as nx, numpy as np
from scipy.stats import spearmanr, pearsonr
def load(path,var):
    s=open(path,encoding="utf-8").read(); s=s[s.index(var+" = ")+len(var)+3:]; s=s[:s.rindex("}")+1]; return json.loads(s)
K=load("../../mesterseges-intelligencia/13-graf-neuralis-halok/graph-data.js","window.KARATE13")
s=open("../../grafelmelet-halozattudomany/06-helyi-szerkezet/karate-weights.js",encoding="utf-8").read()
W=json.loads(s[s.index("["):s.rindex("]")+1])
E=[tuple(e) for e in K["edges"]]; G=nx.Graph(); G.add_nodes_from(range(34)); G.add_edges_from(E)
def ov(u,v):
    Nu=set(G[u])-{v}; Nv=set(G[v])-{u}; un=Nu|Nv; return len(Nu&Nv)/len(un) if un else 0
O=[ov(u,v) for u,v in E]
print("spearman",round(spearmanr(W,O)[0],3),"pearson",round(pearsonr(W,O)[0],3),"bridges",sum(o==0 for o in O))
cl=K["club"]; cr=[i for i,(u,v) in enumerate(E) if cl[u]!=cl[v]]; inn=[i for i in range(78) if i not in cr]
print("cross",len(cr),round(np.mean([W[i] for i in cr]),3),round(np.mean([W[i] for i in inn]),3),round(np.mean([O[i] for i in cr]),4),round(np.mean([O[i] for i in inn]),4))
def curve(key,R):
    tie=[R.random() for _ in E]; order=sorted(range(78),key=lambda i:(key(i),tie[i]))
    out=[]
    for t in range(79):
        H=nx.Graph(); H.add_nodes_from(range(34)); H.add_edges_from(E[i] for i in order[t:]); out.append(max(len(c) for c in nx.connected_components(H)))
    return out
R=random.Random(5)
for name,key in [("weak",lambda i:W[i]),("strong",lambda i:-W[i]),("overlap",lambda i:O[i])]:
    acc=np.mean([curve(key,R) for _ in range(200)],axis=0); print(name,[round(acc[t],1) for t in range(0,73,8)])
# polblogs
P=load("../../grafelmelet-halozattudomany/05-centralitas/polblogs-data.js","window.POLBLOGS")
U=nx.Graph(); e=P["edges"]; U.add_edges_from((e[i],e[i+1]) for i in range(0,len(e),2) if e[i]!=e[i+1])
print("polblogs m",U.number_of_edges(),"r",round(nx.degree_assortativity_coefficient(U),3))
