from common import *
M=np.load("mats.npy",allow_pickle=True).item(); ACL,ACS,ACE,ACF=M["ACL"],M["ACS"],M["ACE"],M["ACF"]
sm=lambda s:np.exp(s)/np.exp(s).sum()
print(sm(np.array([1.,0])),sm(np.array([2.,0])),sm(np.array([0.,0,0])),sm(np.array([1.,1,-1])), sm(np.array([np.log(3),0])))
CSC=ACS@ACS.T; np.fill_diagonal(CSC,0); c=9
fr=ACF
print("C10 CSC nbrs weights",{i+1:CSC[c,i] for i in range(12) if CSC[c,i]>0})
v=CSC[c]@fr; print("CSC frame sums v,h,l",v, v/v.sum())
CLC=ACL.T@ACL; np.fill_diagonal(CLC,0); w=CLC[c]@fr; print("CLC",w,w/w.sum())
for b in [0.5,0.731,0.889,0.9]:
    z=(1-b)*w/w.sum()+b*v/v.sum(); print(b,z.round(3))
# HGT params
T,Eт,d=5,8,16; print("HGT", T*3*d*d + Eт*2*d*d)
print("RGCN 2layer 8rel d16", 2*9*256)
# hetero counts
print("nodes",4+12+7+3+6)
