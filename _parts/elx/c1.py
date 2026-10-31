# 1. fejezet – számellenőrzés
e=1.602176634e-19; k=8.9875517923e9; k9=9e9; G=6.674e-11; me=9.1093837e-31; mp=1.67262192e-27
p=lambda *a: print(*a)
p("1C elektron:", 1/e)
p("+1 nC hiány:", 1e-9/e)
p("1e12 többlet töltés:", 1e12*e)
p("-3,2 pC -> elektron:", 3.2e-12/e)
p("1 µC -> e:", 1e-6/e, "  50 nC:", 50e-9/e)
# érintkező gömbök
p("(+6-2)/2 =", (6-2)/2, "  (+5 -1 + 2)/3=", (5-1+2)/3)
# Coulomb
F=lambda q1,q2,r,kk=k9: kk*abs(q1*q2)/r**2
p("1µC,1µC,10cm:", F(1e-6,1e-6,0.1), " 20cm:", F(1e-6,1e-6,0.2), " exact k:", F(1e-6,1e-6,0.1,k))
p("1C 1C 1m:", F(1,1,1), "N  tömeg t:", F(1,1,1)/9.81/1000)
p("2nC,3nC,3cm:", F(2e-9,3e-9,0.03))
p("H atom r=5.29e-11: Fe", F(e,e,5.29e-11,k), " Fg", G*me*mp/5.29e-11**2, " arány", k*e*e/(G*me*mp))
p("két elektron arány:", k*e*e/(G*me*me))
p("4 µC és -2 µC 30 cm:", F(4e-6,2e-6,0.3))
p("5nC 5nC 1cm:", F(5e-9,5e-9,0.01))
p("mekkora r-nél 0,9 N ->1µC*1µC:", (k9*1e-12/0.9)**.5)
# mező
E=lambda Q,r,kk=k9: kk*abs(Q)/r**2
p("1 nC, 10 cm:", E(1e-9,0.1), " 20cm:", E(1e-9,0.2), " 3cm:", E(1e-9,0.03))
p("elektron 1000 N/C erő:", e*1000, " gyorsulás:", e*1000/me)
p("+1nC -1nC 20cm közép:", 2*E(1e-9,0.1))
p("letörés 3e6 N/C: pont töltés 1 cm-re:", 3e6*0.01**2/k9)
p("2 µC, 3 m:", E(2e-6,3))
p("q=2nC, F=6e-5 -> E:", 6e-5/2e-9)
p("E=5000, q=-3nC -> F:", 5000*3e-9)
# réz
n_cu=8.5e28
p("1 cm3 réz szabad e:", n_cu*1e-6, " töltés:", n_cu*1e-6*e)
p("Si ni 1e16/m3 arány:", n_cu/1e16)
# ESD
C=100e-12
for U in (2e3,3e3,5e3,10e3,15e3):
    Q=C*U; p("U",U,"Q µC",Q*1e6," N",Q/e," W mJ",0.5*C*U*U*1e3," szikra mm",U/3e6*1e3)
p("test elektronjai ~ 70 kg víz-szerű:", 70e3/18*10*6.022e23)
p("0,5µC többlet aránya:", (0.5e-6/e)/(70e3/18*10*6.022e23))
