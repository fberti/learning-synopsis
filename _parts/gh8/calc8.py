import itertools, math
E={(1,2),(1,3),(2,3),(3,4),(4,5),(4,6),(5,6)}
V=range(1,7)
def ll(blocks):
    g={v:i for i,b in enumerate(blocks) for v in b}
    e={};N={}
    for i,j in itertools.combinations(V,2):
        key=tuple(sorted((g[i],g[j]))); N[key]=N.get(key,0)+1; e[key]=e.get(key,0)+((i,j) in E)
    L=0; ps={}
    for k in N:
        p=e[k]/N[k]; ps[k]=(e[k],N[k])
        if 0<p<1: L+=e[k]*math.log(p)+(N[k]-e[k])*math.log(1-p)
    return round(L,3),ps
for b in [[{1,2,3},{4,5,6}],[{1,2},{3,4,5,6}],[{1,2,3,4,5,6}],[{i} for i in V],[{1,2},{3,4},{5,6}],[{3,4},{1,2,5,6}]]:
    print(b,ll(b))
# star core-periphery
S={(0,i) for i in range(1,5)}
print("2x10 expected",0.5*45,0.05*100, "avg k", 0.5*9+0.05*10)
print("3 blocks 8 each p .6 .1:", 0.6*28, 0.1*64)
