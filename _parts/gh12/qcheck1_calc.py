# q1 kvíz (gh12-121 … gh12-124) számainak ellenőrzése: ./run.sh qcheck1_calc.py
from common import *
import cmath, math
r3 = lambda v: np.round(np.array(v, float), 3)

print("=== 12.1 öt barát ===")
N = ["A", "B", "C", "D", "E"]; E = [("A","B"),("A","C"),("B","C"),("B","D"),("D","E")]
G = nx.Graph(E); A = nx.to_numpy_array(G, nodelist=N); I = np.eye(5)
x = np.array([1, 0, 0, 0, 5.]); deg = A.sum(1); dh = deg + 1
print("deg", deg, "dhat", dh)
P = np.diag(dh**-.5) @ (A + I) @ np.diag(dh**-.5)
print("Px", r3(P @ x), "P_DE", round(P[3,4], 3))
Pn = np.diag(deg**-.5) @ A @ np.diag(deg**-.5)          # önhurok nélkül
print("önhurok nélkül D:", round((Pn @ x)[3], 3), " P_DE", round(Pn[3,4], 3))
print("sornormálás (A+I)/dhat D:", round(((A+I) @ x / dh)[3], 3), " 1/dhat_D", round(1/3, 3), " 1/(3*2)", round(1/6, 3))
m = A @ x / deg
print("m", r3(m), "h'=0.5x+m", r3(.5*x + m), "0.5x+Ax", r3(.5*x + A @ x))
h = x.copy()                                            # sorban frissítés A..E
for i in range(5):
    nb = A[i] > 0; h[i] = .5*h[i] + h[nb].mean()
print("sorban", r3(h))
xd = np.array([0, 0, 0, 1, 0.])
print("x=e_D átlag B,E", r3((xd + A @ xd / deg)[[1,4]]), " összeg", r3((xd + A @ xd)[[1,4]]),
      " önhurok az átlagban", r3(((A+I) @ xd / dh)[[1,4]]), " GCN", r3((P @ xd)[[1,4]]))
print("dist A-E", nx.shortest_path_length(G, "A", "E"), " 16*8", 16*8)

print("=== 12.2 R-GCN ===")
names = ["Ko","Vi","Po","Sz"]; pos = [("Ko","Vi"),("Sz","Vi"),("Po","Ko"),("Vi","Po")]; neg = [("Sz","Ko")]
def nbrs(Es):
    D = {n: [] for n in names}
    for a, b in Es: D[a].append(b); D[b].append(a)
    return D
Np, Nn, Na = nbrs(pos), nbrs(neg), nbrs(pos + neg)
def step(xv, wp=1, wn=-1, w0=1, agg="mean", fullnorm=False):
    mean = lambda L: (sum(xv[u] for u in L)/len(L) if L else 0) if agg == "mean" else sum(xv[u] for u in L)
    out = {}
    for n in names:
        if fullnorm:
            k = len(Na[n]); out[n] = w0*xv[n] + (wp*sum(xv[u] for u in Np[n]) + wn*sum(xv[u] for u in Nn[n]))/k
        else:
            out[n] = w0*xv[n] + wp*mean(Np[n]) + wn*mean(Nn[n])
    return {k: round(v, 3) for k, v in out.items()}
hom = lambda xv: {n: round(xv[n] + sum(xv[u] for u in Na[n])/len(Na[n]), 3) for n in names}
e = lambda s: {n: float(n == s) for n in names}
print("x_Sz=1: hom", hom(e("Sz")), "rel", step(e("Sz")), "fullnorm", step(e("Sz"), fullnorm=True), "wn=+1", step(e("Sz"), wn=1))
print("x_Vi=1: hom", hom(e("Vi")), "rel", step(e("Vi")), "W0=0", step(e("Vi"), w0=0), "sum", step(e("Vi"), agg="sum"))
print("x_Ko=1, w+=w-=1: hom", hom(e("Ko")), "rel", step(e("Ko"), wn=1))
# inverz: Sz a bírál^-1 élen hall Ko-tól
for winv in (0, -0.5):
    xv = e("Ko"); val = xv["Sz"] + 1*np.mean([xv[u] for u in Np["Sz"]]) + winv*xv["Ko"]
    print("inverz w=", winv, "Sz =", val, "; irányítatlan:", step(e("Ko"))["Sz"], "; mindkettő:", -1 + winv)
for Rdir, d in [(2,16),(3,32),(20,16),(20,64)]:
    R = 2*Rdir; print(f"{Rdir} irányított d={d}: (R+1)dd={(R+1)*d*d}, W0 nélkül {R*d*d}, inverz nélkül {(Rdir+1)*d*d}, egyik sem {Rdir*d*d}")
basis = lambda R, B, d: B*d*d + R*B + d*d
print("bázis R=40 B=8 d=64", basis(40,8,64), " együttható nélkül", 8*4096 + 4096, " W0 nélkül", 8*4096 + 320, " bázis nélkül", 41*4096)
print("R=2 B=2 d=16", basis(2,2,16), "vs", 3*256)

print("=== 12.3 heterogén ===")
M = np.load("mats.npy", allow_pickle=True).item(); ACL, ACS, ACE, ACF = M["ACL"], M["ACS"], M["ACE"], M["ACF"]
print("élek", ACL.sum()+ACS.sum()+ACE.sum()+ACF.sum(), " esemény nélkül", ACL.sum()+ACS.sum()+ACF.sum(), " csúcs esemény nélkül", 4+12+7+3)
LSL = ACL @ ACS @ ACS.T @ ACL.T; LKL = ACL @ ACF @ ACF.T @ ACL.T
print("LCSzCL\n", LSL); print("LCKCL\n", LKL)
PAP = ["RH","EK","NY","VN"]; ny, vn = 2, 3
nyart = [c for c in range(12) if ACL[ny,c]]; vnart = [c for c in range(12) if ACL[vn,c]]
pairs = [(a+1,b+1) for a in nyart for b in vnart if (ACS[a] @ ACS[b]) > 0]
common = [ACT[s] for s in range(7) if (ACL[ny] @ ACS)[s] > 0 and (ACL[vn] @ ACS)[s] > 0]
print("NY–VN közös szereplők", common, " cikkpárok", len(pairs), pairs)
rh = [c+1 for c in range(12) if ACL[0,c]]; print("RH cikkek", rh, " RH említések", (ACL[0] @ ACS), " négyzetösszeg", ((ACL[0] @ ACS)**2).sum())
print("NY keretek (v,h,l)", ACL[ny] @ ACF, " VN", ACL[vn] @ ACF)
sm = lambda w: np.exp(w)/np.exp(w).sum()
print("beta (1,1,-1)", r3(sm(np.array([1,1,-1.]))), " sigmoid", r3(1/(1+np.exp(-np.array([1,1,-1.])))))
print("beta (1,0)", r3(sm(np.array([1,0.]))))
zL = np.array([0,0,1.]); zS = np.array([4,1,3.])/8
c10 = 9; CSC = ACS @ ACS.T; nb = [(c+1, int(CSC[c10,c])) for c in range(12) if c != c10 and CSC[c10,c] > 0]
FR = {1:"v",2:"v",3:"v",4:"h",5:"h",6:"h",7:"l",8:"l",9:"l",10:"v",11:"l",12:"l"}
zw = np.zeros(3); zu = np.zeros(3)
for c, w in nb: zw["vhl".index(FR[c])] += w; zu["vhl".index(FR[c])] += 1
print("C10 CSzC szomszédok (cikk, súly)", nb, " súlyozott", r3(zw/zw.sum()), " súlyozatlan", r3(zu/zu.sum()))
b = sm(np.array([1,0.])); print("keverés", r3(b[0]*zL + b[1]*zS))
from fractions import Fraction as F
# fordulópont: 0.5 b = (1-b) + 0.375 b ; hibás: 0.5 b = 1-b
print("fordulópont", F(1)/F(9,8), float(F(8,9)), " veszteség-tag nélkül", F(2,3))
zu_ = zu/zu.sum(); print("súlyozatlan nézet: védekezés", round(zu_[0],3), " veszteség", round(zu_[2],3), "→ b-vel: v=", "0.429b", "l = (1-b)+0.429b → sosem")
hgt = lambda T, Rr, d: T*3*d*d + Rr*2*d*d
print("HGT 3 típus 4 rel d=8", hgt(3,4,8), " egy éltípus-mátrix", 3*3*64 + 4*64, " egy vetítés/típus", 3*64 + 4*2*64, " 8 relációval", hgt(3,8,8), " 5/8/16", hgt(5,8,16))

print("=== 12.4 tudásgráf ===")
Ent = {"Budapest":(1,1),"Bécs":(1,3),"Prága":(1,5),"Magyarország":(4,2),"Ausztria":(4,4),"Csehország":(4,6)}
v = {k: np.array(p, float) for k, p in Ent.items()}; r = np.array([3, 1.])
dist = lambda h, rr, t: float(np.linalg.norm(v[h] + rr - v[t]))
print("(Budapest, fővárosa, Ausztria)", -dist("Budapest", r, "Ausztria"), " négyzet", dist("Budapest", r, "Ausztria")**2, " r nélkül", round(-np.linalg.norm(v["Budapest"]-v["Ausztria"]),3))
print("Prága lekérdezés", sorted(((round(dist("Prága", r, t),3), t) for t in v)))
print("Prága r nélkül", sorted(((round(float(np.linalg.norm(v["Prága"]-v[t])),3), t) for t in v)))
r21 = np.array([2, 1.]); dp, dn = dist("Budapest", r21, "Magyarország"), dist("Budapest", r21, "Ausztria")
for g in (1, 2):
    print(f"gamma={g}: L={round(max(0,g+dp-dn),3)} max nélkül={round(g+dp-dn,3)} fordított={round(g+dn-dp,3)} négyzetes={max(0,g+dp**2-dn**2)}")
d31p, d31n = dist("Budapest", r, "Magyarország"), dist("Budapest", r, "Ausztria"); print("r=(3,1) d+", d31p, "d-", d31n, " négyzetes d-", d31n**2)
ang = lambda deg: cmath.exp(1j*math.radians(deg))
print("RotatE 60°", round(abs(ang(60)-ang(90)),3), " 2sin30", round(2*math.sin(math.radians(30)),3), " ív", round(math.pi/6,3), " 2sin60", round(2*math.sin(math.radians(60)),3))
# TransE kifejezőerő: szimmetrikus → r=0 ; inverz -r ; összetett r1+r2 ; 1–N: legjobb r Magyarország(1,3)→Budapest(4,4),Debrecen(4,2)
mo, bp, db = np.array([1,3.]), np.array([4,4.]), np.array([4,2.]); rb = ((bp-mo)+(db-mo))/2
print("1–N legjobb r", rb, "távolságok", np.linalg.norm(mo+rb-bp), np.linalg.norm(mo+rb-db))
ranks = [1, 2, 4, 5]
print("MRR", np.mean([1/k for k in ranks]), " Hits@3", np.mean([k <= 3 for k in ranks]), " 1/átlagrang", 1/np.mean(ranks), " összeg", sum(1/k for k in ranks))
# szűrt rang: nyers 6, előtte az 1. és 4. hely igaz, 2., 3., 5. nem
raw = 6; true_before = [1, 4]; false_before = [2, 3, 5]
print("szűrt", raw - len(true_before), " hamisakat szűrve", raw - len(false_before), " egyet szűrve", raw - 1)
