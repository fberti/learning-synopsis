from common import *
T=lambda b,g:b/(b+g-b*g); print("T(.2,.5)",T(.2,.5))
S=nx.star_graph(5); print("star5 p.4 center",ic_exact(S,[0],.4),"leaf",ic_exact(S,[1],.4))
def gran(th):
    a=0
    while True:
        n=sum(1 for t in th if t<=a)
        if n==a: return a
        a=n
print("gran",gran([0,1,2,2,5]))
Tr=nx.Graph([(0,1),(0,2),(0,3),(3,4)]); n=5; print("tree sv",nx.wiener_index(Tr)/10)
print("degroot star3", 4/10*6)
x=np.array([0,.1,.5,.6,1.]); 
for _ in range(5): x=np.array([x[np.abs(x-xi)<=.2+1e-12].mean() for xi in x])
print("hk",x)
print("branch R .6 mean",1/(1-.6),"P1",.8**3)
print("kappa 15/3-1",15/3-1, "R0",.3*4)
