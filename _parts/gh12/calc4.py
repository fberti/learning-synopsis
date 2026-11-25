from common import *
E={"Budapest":(1,1),"Bécs":(1,3),"Prága":(1,5),"Magyarország":(4,2),"Ausztria":(4,4),"Csehország":(4,6)}
r=np.array([3,1.])
for h in ["Budapest","Bécs","Prága"]:
    q=np.array(E[h])+r
    print(h, {t:round(float(np.linalg.norm(q-np.array(v))),3) for t,v in E.items()})
# margin loss example: r0=(2,1)? positive Budapest->Mo, negative Budapest->Ausztria
for r0 in [(3,1),(2,1),(3,2)]:
    r0=np.array(r0,float); q=np.array(E["Budapest"])+r0
    dp=np.linalg.norm(q-np.array(E["Magyarország"])); dn=np.linalg.norm(q-np.array(E["Ausztria"]))
    print("r",r0,"dpos",round(dp,3),"dneg",round(dn,3),"loss g=1",round(max(0,1+dp-dn),3))
# DistMult
Sz=np.array([1,2.]);Ko=np.array([2,1.]);rb=np.array([1,1.])
print("DM",(Sz*rb*Ko).sum(),(Ko*rb*Sz).sum())
# RotatE
import cmath
ang=lambda d:cmath.exp(1j*np.deg2rad(d))
sz,ko,rr=ang(0),ang(90),ang(90)
print("RotatE d(Sz r,Ko)",abs(sz*rr-ko),"d(Ko r,Sz)",abs(ko*rr-sz))
# MRR
ranks=[1,3,2,10]; print("MRR",np.mean([1/x for x in ranks]),"H1",np.mean([x<=1 for x in ranks]),"H3",np.mean([x<=3 for x in ranks]))
# practice: TransE score with r=(3,1) of Bécs->Magyarország
print("Bécs->Mo",np.linalg.norm(np.array(E["Bécs"])+r-np.array(E["Magyarország"])))
# params: entities 10000, relations 200, d=100
print("KGE params TransE",10000*100+200*100,"RotatE complex d=100 (2 reals)",10000*200+200*100)
