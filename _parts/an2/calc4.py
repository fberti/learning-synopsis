from math import *
n=10**7
f=lambda e: print(round(e(n),5))
for e in [lambda n:(3+1/n)*(2-1/n**2), lambda n:(5-2/n)/(1+3/n), lambda n:(4-1/n)*(1+2/n), lambda n:(1/n-3)/(2+1/n**2),
 lambda n:(3*n**2+3*n-5)/(5*n**2-2*n+2), lambda n:(5*n-2)/(7*n+3), lambda n:(2*n-1)*(n+3)/(n**2+5), lambda n:n*(n+1)/2/n**2,
 lambda n:sqrt(n*n+5)/(2*n+1), lambda n:sqrt(n+1)-sqrt(n), lambda n:sqrt(n*n+2*n)-n, lambda n:sqrt(4*n*n+1)/(n+1),
 lambda n:sqrt(n*n+6*n)-n, lambda n:sqrt(n*n+n)-sqrt(n*n-n), lambda n:(3*n+cos(n))/(n+1)]: f(e)
n=1000; print(sum(1/(n*n+k) for k in range(1,n+1)))
a=0
for i in range(6): print(round(a,4),end=' '); a=sqrt(2+a)
print()
for g,a0 in [(lambda a:a/2+1,1),(lambda a:(a+3)/2,0),(lambda a:sqrt(6+a),2),(lambda a:a/3+2,1),(lambda a:sqrt(2+a),5),(lambda a:1/(1+a),1)]:
    a=a0; s=[]
    for i in range(60): s.append(a); a=g(a)
    print([round(x,4) for x in s[:5]], round(s[-1],6))
print((sqrt(5)-1)/2)
