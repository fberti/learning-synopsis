import json, re, itertools, networkx as nx, numpy as np
BASE="/forlinux/MEGA/MEGABase/obsidian/Vault/Learning/synopsis/"
ACT=["Ko","Vi","Po","La","Ön","Sz","Kl"]
ART=[(1,"RH","H",["Ko","Vi"]),(2,"RH","Sze",["Ko","Vi","Po"]),(3,"RH","P",["Ko","Po"]),(4,"EK","H",["Vi","Sz"]),(5,"EK","Cs",["Sz","Kl","Ko"]),(6,"EK","Szo",["Sz","Kl"]),
(7,"NY","K",["La","Ön"]),(8,"NY","Cs",["La","Po","Ön"]),(9,"NY","V",["La","Ön"]),(10,"VN","K",["Po","Vi"]),(11,"VN","Sze",["Po","La"]),(12,"VN","Szo",["Ön","Po"])]
DAYS=["H","K","Sze","Cs","P","Szo","V"]
def comat(arts, nodes=ACT):
    idx={a:i for i,a in enumerate(nodes)}; M=np.zeros((len(nodes),)*2)
    for a in arts:
        ms=[x for x in a[3] if x in idx]
        for x,y in itertools.combinations(ms,2): M[idx[x],idx[y]]+=1; M[idx[y],idx[x]]+=1
    return M
def paper(p): return [a for a in ART if a[1]==p]
FIRST=[a for a in ART if DAYS.index(a[2])<=2]; SECOND=[a for a in ART if DAYS.index(a[2])>=3]
def offdiag(M, directed=False):
    n=len(M)
    if directed: return np.array([M[i,j] for i in range(n) for j in range(n) if i!=j])
    return np.array([M[i,j] for i in range(n) for j in range(i+1,n)])
def corr(A,B,directed=False):
    a,b=offdiag(A,directed),offdiag(B,directed); return np.corrcoef(a,b)[0,1]
def qap_exact(A,B,directed=False):
    n=len(A); r0=corr(A,B,directed); rs=[]
    for p in itertools.permutations(range(n)):
        P=list(p); rs.append(corr(A,B[np.ix_(P,P)],directed))
    rs=np.array(rs); return r0, rs
def loadjs(path,var):
    s=open(BASE+path,encoding="utf-8").read()
    m=re.search(r"window\."+var+r"\s*=\s*(\{.*?\});",s,re.S); return json.loads(m.group(1))
def krack():
    import rdata
    d=rdata.read_rda(BASE+"_parts/gh10/dl/NetData/data/kracknets.rda")
    f=d["krack_full_data_frame"]; n=21
    A={k:np.zeros((n,n)) for k in ["advice","friendship","reports"]}
    for _,r in f.iterrows():
        i,j=int(r.ego)-1,int(r.alter)-1
        A["advice"][i,j]=r.advice_tie; A["friendship"][i,j]=r.friendship_tie; A["reports"][i,j]=r.reports_to_tie
    att=d["attributes"]; return A, att
