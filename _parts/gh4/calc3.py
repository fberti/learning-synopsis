import numpy as np, networkx as nx
K=nx.karate_club_graph(); A=nx.to_numpy_array(K,nodelist=range(34),weight=None)
print("edges",A.sum()/2)
L=np.diag(A.sum(1))-A; w,V=np.linalg.eigh(L); f=V[:,1]; f=f*np.sign(f[0])
real=np.array([K.nodes[i]["club"]=="Mr. Hi" for i in range(34)])
side=f>0
print("mu2",w[1],"sizes",side.sum(),"agree",(side==real).sum(),"wrong",[i+1 for i in range(34) if side[i]!=real[i]],f[[2,8]].round(3))
print("cut",sum(1 for u,v in K.edges if side[u]!=side[v]),"real cut",sum(1 for u,v in K.edges if real[u]!=real[v]),"real size",real.sum())
print("bound 17-17:",34*w[1]/4)
med=np.median(f); sm=f>med; print("median agree",(sm==real).sum(),"cut",sum(1 for u,v in K.edges if sm[u]!=sm[v]))
