from math import sqrt
S=lambda p,q: sum(a*b for a,b in zip(p,q))
p0=[100,200];q0=[10,5];p1=[110,250];q1=[12,3]
V0,V1,A,B=S(p0,q0),S(p1,q1),S(p1,q0),S(p0,q1)
print("két termék",V0,V1,A,B,"Iv",V1/V0,"L",A/V0,"P",V1/B,"Iq0",B/V0,"Iq1",V1/A,"F",sqrt(A/V0*V1/B),"Fq",sqrt(B/V0*V1/A))
print("K",V1-V0,"Kp0",A-V0,"Kp1",V1-B,"Kq0",B-V0,"Kq1",V1-A, "rossz L*Iq0",A/V0*B/V0)
print("egy termék",1.2*1.1, 120*55/(100*50), 1.05*0.9)
print("defl",1.12/1.05, 0.97*1.04, 1.12/1.08)
print("KSH 3 csop",0.3*1.1+0.5*1.04+0.2*1.02)
# Panni hibás súly
ip=[1,1,1.3,1.2]; v1=[6000,9200,2600,7200]; v0=[6000,6000,4000,4000]
print("v1 számtani",sum(a*b for a,b in zip(v1,ip))/25000, " v0 harmonikus", 20000/sum(a/b for a,b in zip(v0,ip)))
print("Panni rossz: L*Iq0",1.1*1.16, " P*Iq1",(25000/23200)*(25000/22000))
print("Panni ME", (22000+25000)/(20000+23200))
print("Panni shares v0",[x/20000 for x in v0])
# két termék harmonikus P
print("2t P harm", V1/(1320/1.1+750/1.25))
