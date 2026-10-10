# PDL ch12 multichannel example: search which variant reproduces the book's k2 output
import numpy as np, itertools
def corr(x,k): return np.array([[np.sum(x[i:i+3,j:j+3]*k) for j in range(3)] for i in range(3)])
x0=np.array([[-1,2,2,-2,-2],[-1,0,2,0,2],[1,2,2,1,-2],[-1,2,2,2,2],[1,-1,1,0,-1]])
x1=np.array([[2,-2,-1,-2,-2],[1,1,2,1,-2],[2,2,-1,-1,0],[-1,-1,2,-2,2],[-1,-2,0,-2,0]])
a=np.array([[1,0,0],[-1,0,0],[0,-1,0]]); b=np.array([[-1,1,1],[1,0,1],[-1,0,0]])
book=np.array([[-5,0,-3],[0,0,-5],[7,-3,4]])
tr={'id':lambda k:k,'flip':lambda k:k[::-1,::-1],'T':lambda k:k.T,'fliplr':lambda k:k[:,::-1],'flipud':lambda k:k[::-1]}
for (na,fa),(nb,fb) in itertools.product(tr.items(),repeat=2):
    for sw in [False,True]:
        X0,X1=(x1,x0) if sw else (x0,x1)
        r=corr(X0,fa(a))+corr(X1,fb(b))
        for bias in range(-3,4):
            if np.array_equal(r+bias,book): print("match",na,nb,"swap",sw,"bias",bias)
print("ch0 part", corr(x0,a)); print("ch1 part", corr(x1,b)); print("needed total-2:", book-2)
