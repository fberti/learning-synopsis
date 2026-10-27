import math
def assoc(t):
    b=len(t); c=len(t[0]); N=sum(map(sum,t))
    R=[sum(r) for r in t]; C=[sum(t[i][j] for i in range(b)) for j in range(c)]
    E=[[R[i]*C[j]/N for j in range(c)] for i in range(b)]
    chi=sum((t[i][j]-E[i][j])**2/E[i][j] for i in range(b) for j in range(c))
    V=math.sqrt(chi/(N*min(b-1,c-1)))
    Q=None
    if b==2 and c==2:
        a,bb=t[0];cc,d=t[1]; Q=(a*d-bb*cc)/(a*d+bb*cc)
    return N,round(chi,2),round(V,3),Q and round(Q,3),[[round(e,1) for e in r] for r in E]
for t in ([[30,70],[20,80]],[[18,2],[5,25]],[[40,45,15],[30,50,20],[10,40,50]],[[20,30],[40,60]],[[60,140],[40,160]]):
    print(assoc(t))
m={'A':(512,825),'B':(353,560),'C':(120,325),'D':(138,417),'E':(53,191),'F':(22,373)}
f={'A':(89,108),'B':(17,25),'C':(202,593),'D':(131,375),'E':(94,393),'F':(24,341)}
for g in (m,f):
    a=sum(v[0] for v in g.values()); n=sum(v[1] for v in g.values()); print(a,n,round(100*a/n,1))
for k in m: print(k, round(100*m[k][0]/m[k][1],1), round(100*f[k][0]/f[k][1],1), 'women share of applicants', round(100*f[k][1]/(f[k][1]+m[k][1]),1), 'women app dist', round(100*f[k][1]/1835,1), 'men app dist', round(100*m[k][1]/2691,1))
