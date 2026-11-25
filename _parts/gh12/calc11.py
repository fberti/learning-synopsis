import numpy as np,math
print(3*1024+6*2*3+1024, 13*1024)
print(math.sqrt(5), 1+1-math.sqrt(5))
print(1*2+0+2*1, (1+.25)/2, .7+.15, .35)
s=2; s=s*.8; s2=s*.8+1; print(s,s2)
e=np.exp([0,math.log(4)]); print(e/e.sum())
A=np.array([[1,1,0],[0,1,1],[0,0,1]]); print(A@A.T)
