import networkx as nx, json
G=nx.les_miserables_graph()
names=sorted(G.nodes(), key=lambda x: list(G.nodes()).index(x))
idx={v:i for i,v in enumerate(names)}
pos=nx.spring_layout(G,seed=3,iterations=300,weight=None)
xs=[pos[v][0] for v in names]; ys=[pos[v][1] for v in names]
x0,x1,y0,y1=min(xs),max(xs),min(ys),max(ys)
xy=[[round((pos[v][0]-x0)/(x1-x0),3),round((pos[v][1]-y0)/(y1-y0),3)] for v in names]
edges=[[idx[a],idx[b],int(w)] for a,b,w in G.edges(data="weight")]
d={"n":len(names),"names":names,"edges":edges,"xy":xy}
s="""/* =========================================================
   Les Misérables – Victor Hugo regényének szereplői (D. E. Knuth: The Stanford GraphBase, 1993)
   77 szereplő, 254 él; az él súlya: hány fejezetben szerepelnek együtt (összesen 820).
   Forrás: networkx.les_miserables_graph(); elrendezés: spring_layout(seed=3), [0;1]-re skálázva.
   (Generálta: _parts/gh8/lesmis.py)
   ========================================================= */
window.LESMIS = """+json.dumps(d,ensure_ascii=False,separators=(",",":"))+";\n"
open("grafelmelet-halozattudomany/08-kozossegek/lesmis-data.js","w").write(s)
print(len(s), len(edges), sum(e[2] for e in edges))
