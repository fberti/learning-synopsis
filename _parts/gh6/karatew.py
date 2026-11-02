import networkx as nx, json
s=open("../../mesterseges-intelligencia/13-graf-neuralis-halok/graph-data.js",encoding="utf-8").read()
s=s[s.index("window.KARATE13 = ")+18:]; s=s[:s.index("};")+1]; K=json.loads(s)
G=nx.karate_club_graph()
w=[G[a][b]["weight"] for a,b in K["edges"]]
assert len(w)==78 and all(G.has_edge(a,b) for a,b in K["edges"])
club=[0 if G.nodes[i]["club"]=="Mr. Hi" else 1 for i in G]
print("club match", club==K["club"])
out=f"""/* Zachary karateklubjának élsúlyai (1977): hány különböző helyzetben (a klubban és azon kívül) érintkezett a két tag.
   A sorrend a KARATE13.edges sorrendje (../../mesterseges-intelligencia/13-graf-neuralis-halok/graph-data.js).
   Forrás: networkx karate_club_graph (Zachary 1977, C mátrix); ellenőrzés: _parts/gh6/karatew.py */
window.KARATE_W = {json.dumps(w,separators=(',',':'))};
"""
open("../../grafelmelet-halozattudomany/06-helyi-szerkezet/karate-weights.js","w",encoding="utf-8").write(out)
print(w)
