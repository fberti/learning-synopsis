from common import *
X=[1,0,0,0]; names=["Ko","Vi","Po","Sz"]
pos=[("Ko","Vi"),("Sz","Vi"),("Po","Ko"),("Vi","Po")]; neg=[("Sz","Ko")]
i={n:k for k,n in enumerate(names)}
def nb(E):
    N={n:[] for n in names}
    for a,b in E: N[a].append(b); N[b].append(a)
    return N
Np,Nn,Na=nb(pos),nb(neg),nb(pos+neg)
x={n:X[k] for k,n in enumerate(names)}
mean=lambda L:sum(x[u] for u in L)/len(L) if L else 0
for n in names: print(n,"hom",round(x[n]+mean(Na[n]),3),"rgcn",round(x[n]+mean(Np[n])-mean(Nn[n]),3))
# hetero graph
PAP=["RH","EK","NY","VN"]; FR={1:"v",2:"v",3:"v",4:"h",5:"h",6:"h",7:"l",8:"l",9:"l",10:"v",11:"l",12:"l"}
EV={"E1":[1,4],"E2":[7,10],"E3":[2,11],"E4":[8],"E5":[5,6],"E6":[3,9,12]}
ACL=np.zeros((4,12)); ACS=np.zeros((12,7)); ACE=np.zeros((12,6)); ACF=np.zeros((12,3))
for a in ART:
    c=a[0]-1; ACL[PAP.index(a[1]),c]=1
    for s in a[3]: ACS[c,ACT.index(s)]=1
    ACF[c,"vhl".index(FR[a[0]])]=1
for k,(e,arts) in enumerate(EV.items()):
    for c in arts: ACE[c-1,k]=1
print("edges: LC",ACL.sum()," CS",ACS.sum()," CE",ACE.sum()," CF",ACF.sum())
print("LCSCL\n",ACL@ACS@ACS.T@ACL.T)
print("LCECL\n",ACL@ACE@ACE.T@ACL.T)
print("SCS\n",ACS.T@ACS)
CSC=ACS@ACS.T; print("CSC offdiag nonzero pairs",int((np.triu(CSC,1)>0).sum()))
print("LCFCL\n",ACL@ACF@ACF.T@ACL.T)
# homophily on CSC projection wrt frames
pairs=[(a,b) for a in range(12) for b in range(a+1,12) if CSC[a,b]>0]
same=sum(FR[a+1]==FR[b+1] for a,b in pairs); print("CSC edges",len(pairs),"same frame",same, same/len(pairs))
# CLC (same paper)
CLC=ACL.T@ACL; pairs2=[(a,b) for a in range(12) for b in range(a+1,12) if CLC[a,b]>0]
print("CLC edges",len(pairs2),"same",sum(FR[a+1]==FR[b+1] for a,b in pairs2))
pairs3=[(a,b) for a in range(12) for b in range(a+1,12) if (ACE@ACE.T)[a,b]>0]
print("CEC edges",len(pairs3),"same",sum(FR[a+1]==FR[b+1] for a,b in pairs3), pairs3)
# HAN semantic softmax
s=np.array([1.0,0.0]); print("beta",np.exp(s)/np.exp(s).sum())
np.save("mats.npy",{"ACL":ACL,"ACS":ACS,"ACE":ACE,"ACF":ACF},allow_pickle=True)
