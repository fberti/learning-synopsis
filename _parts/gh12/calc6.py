from common import *
M=np.load("mats.npy",allow_pickle=True).item(); ACL,ACS,ACE=M["ACL"],M["ACS"],M["ACE"]
FR={1:"v",2:"v",3:"v",4:"h",5:"h",6:"h",7:"l",8:"l",9:"l",10:"v",11:"l",12:"l"}
y=[FR[i+1] for i in range(12)]
def newvote(ments,paper=None):
    sc={f:0 for f in "vhl"}
    for c in range(12):
        w=sum(ACS[c,ACT.index(s)] for s in ments)
        if paper: w+= ACL[["RH","EK","NY","VN"].index(paper),c]
        sc[y[c]]+=w
    return sc
for m,p in [(["Ko","Kl"],None),(["Sz","Kl"],None),(["Vi","Sz"],None),(["Po","Ön"],None),(["Ko","Kl"],"EK"),(["Po","Vi"],None),(["Po","Vi"],"NY"),(["La"],None)]:
    print(m,p,newvote(m,p))
MP={"CLC":ACL.T@ACL,"CSC":ACS@ACS.T,"CEC":ACE@ACE.T}
for k in MP: np.fill_diagonal(MP[k],0)
def acc(W):
    e=0
    for c in range(12):
        sc={f:0. for f in "vhl"}
        for d in range(12):
            if W[c,d]>0: sc[y[d]]+=W[c,d]
        b=max(sc.values()); win=[f for f in sc if sc[f]==b]
        if b>0 and y[c] in win: e+=1/len(win)
    return e
for b in [(1,1,0),(1,1,1),(1,1,.5),(1,1,.25),(1,0,0),(0,1,0),(0,0,1),(2,1,0),(1,2,0),(1,.5,0)]:
    W=b[0]*MP["CLC"]+b[1]*MP["CSC"]+b[2]*MP["CEC"]; print(b,acc(W))
# softmax of HAN semantic scores e.g. (2,1,-1)
s=np.array([1.,1.,-1.]); print(np.exp(s)/np.exp(s).sum())
