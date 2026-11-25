from common import *
M=np.load("mats.npy",allow_pickle=True).item(); ACL,ACS,ACE=M["ACL"],M["ACS"],M["ACE"]
FR={1:"v",2:"v",3:"v",4:"h",5:"h",6:"h",7:"l",8:"l",9:"l",10:"v",11:"l",12:"l"}
y=[FR[i+1] for i in range(12)]
MP={"CLC":ACL.T@ACL,"CSC":ACS@ACS.T,"CEC":ACE@ACE.T}
for k in MP: np.fill_diagonal(MP[k],0)
def vote(W,c,weighted):
    sc={f:0. for f in "vhl"}
    for d in range(12):
        if W[c,d]>0: sc[y[d]]+= W[c,d] if weighted else 1
    best=max(sc.values())
    if best==0: return None,sc
    win=[f for f in "vhl" if sc[f]==best]
    return (win[0] if len(win)==1 else "tie:"+"".join(win)),sc
for wtd in (False,True):
  for name,W in list(MP.items())+[("CLC+CSC",MP["CLC"]+MP["CSC"]),("all",MP["CLC"]+MP["CSC"]+MP["CEC"]),("2CLC+CSC",2*(MP["CLC"]>0)+(MP["CSC"]>0))]:
    res=[vote(W,c,wtd) for c in range(12)]
    corr=sum(r[0]==y[c] for c,r in enumerate(res)); ties=sum(1 for r in res if r[0] and r[0].startswith("tie")); none=sum(r[0] is None for r in res)
    # ties count as 1/len expected
    exp=sum((1/len(r[0][4:]) if (r[0] and r[0].startswith("tie") and y[c] in r[0][4:]) else (1 if r[0]==y[c] else 0)) for c,r in enumerate(res))
    print("weighted" if wtd else "binary",name,"correct",corr,"ties",ties,"none",none,"expected",round(exp,3))
    if name in("CLC","CSC","CLC+CSC") : print("   ",[ (c+1,y[c],r[0]) for c,r in enumerate(res) if r[0]!=y[c]])
print("majority", max(y.count(f) for f in "vhl"))
