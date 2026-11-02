# pct-lab
A,B=125,100
print("A/B",A/B,"A% of B",100*A/B,"more",100*(A/B-1),"B less",100*(1-B/A),"diff",A-B)
x=.2; print(100,100*(1+x),100*(1+x)*(1-x),100*(1-x*x))
for a,b in [(52.6,78.9),(2,3),(4,5),(0.4,0.3)]:
    print(a,b,"pp",round(b-a,4),"rel",100*(b/a-1))
# weighted
def V(B,v): return sum(b*x for b,x in zip(B,v))/sum(B)
print("V",V([4,6],[2.5,1.5]),"simple",2.0,"sumA",4*2.5+6*1.5)
print("prev",V([2,8],[2.4,1.4]))
# real wage
cpi={2020:1.033,2021:1.051,2022:1.145,2023:1.176,2024:1.037}
yrs=list(range(2019,2025)); lvl={2019:1.0}
for y in yrs[1:]: lvl[y]=lvl[y-1]*cpi[y]
wage={2019:270,2020:285,2021:300,2022:330,2023:370,2024:400}
b=2021
for y in yrs:
    P=lvl[y]/lvl[b]; N=wage[y]/wage[b]
    chain = (wage[y]/wage[y-1])/cpi[y]*100 if y>2019 else None
    print(y,"P",round(100*P,1),"N",round(100*N,1),"R",round(100*N/P,1),"real",round(wage[y]/P,1),"chain",chain and round(chain,1),"need",round(wage[b]*P,1))
print("2019 base 2024 level",100*lvl[2024])
# age std
o=[.3,.3,.4]; ro=[1,8,50]; i=[.6,.3,.1]; ri=[2,10,60]
d=lambda s,r: sum(a*b for a,b in zip(s,r))
print("raw",d(o,ro),d(i,ri))
for name,s in [("O",o),("I",i),("eq",[1/3]*3),("avg",[(a+b)/2 for a,b in zip(o,i)])]:
    print(name,s,d(s,ro),d(s,ri))
VS=d(i,ro); print("VS",VS,"KT",d(i,ri)-d(o,ro),"KR",d(i,ri)-VS,"KO",VS-d(o,ro))
