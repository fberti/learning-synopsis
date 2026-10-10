# Checks of PDL (Kneusel, Practical Deep Learning) ch9/ch10 numbers
import math
import numpy as np
d = [130,141,99,106,135,119,98,147,152,163,118,149,122,133,115,128,176,132,173,145,152,79,124,133,158,111,
139,140,126,117,175,123,154,115,130,108,139,129,113,129,123,135,112,146,125,134,141,136,155,152,101,149,
137,119,143,136,118,161,138,112,124,86,135,161,112,117,145,140,123,110,163,122,105,135,132,145,121,92,
118,125,154,148,92,142,118,128,128,129,125,121,139,152,122,128,126,126,157,124,120,152]
print("n =", len(d), "mean =", sum(d)/len(d))
print("CE -ln 0.87 =", -math.log(0.87), " log10:", -math.log10(0.87), " log2:", -math.log2(0.87))
def params(layers, nin=784, nout=10):
    s = [nin] + list(layers) + [nout]
    return sum(s[i]*s[i+1] + s[i+1] for i in range(len(s)-1))
tab = {(1000,):795010,(2000,):1590010,(4000,):3180010,(8000,):6360010,(700,350):798360,(1150,575):1570335,
       (1850,925):3173685,(2850,1425):6314185,(660,330,165):792505,(1080,540,270):1580320,(1714,857,429):3187627,
       (2620,1310,655):6355475,(3000,1500):6871510}
for k,v in tab.items():
    p = params(k); print(k, v, p, "OK" if p==v else "MISMATCH")
# batch table 16384/m
print([ (m, 16384//m) for m in [2**k for k in range(1,15)]])
# LR*epochs
lr=[0.2,0.1,0.05,0.01,0.005,0.001,0.0005,0.0001]; ep=[8,15,30,150,300,1500,3000,15000]
print([round(a*b,3) for a,b in zip(lr,ep)])
# sklearn alpha -> effective lambda per batch
for a in [0.1,0.2,0.4,0.0001]: print("alpha",a,"-> lambda_eff (batch 64) =", a/64)
# momentum: effective step multiplier 1/(1-mu) and steps/epoch
for mu in [0.3,0.5,0.7,0.9,0.99]: print("mu",mu,"1/(1-mu)=",round(1/(1-mu),1))
print("steps/epoch 3000/64 =", 3000/64, " 6000/64 =", 6000/64)
# curve-fitting data Fig 9-5
x = np.array([0.00,0.61,1.22,1.83,2.44,3.06,3.67,4.28,4.89,5.51,6.12,6.73,7.34,7.95,8.57,9.18,9.79])
y = np.array([50.0,-17.8,74.1,29.9,114.8,55.3,66.0,89.1,128.3,180.8,229.7,229.3,227.7,354.9,477.1,435.4,470.1])
for deg in [2,15]:
    c = np.polynomial.polynomial.Polynomial.fit(x,y,deg)
    r = y - c(x); print("deg",deg,"train RMSE", round(float(np.sqrt((r**2).mean())),2), "pred at 10.4:", round(float(c(10.4)),1))
# Glorot bounds for a 784->100 layer
fi,fo=784,100
print("glorot A=6 bound", math.sqrt(6/(fi+fo)), "std", math.sqrt(6/(fi+fo))/math.sqrt(3), "var 2/(fi+fo) std", math.sqrt(2/(fi+fo)))
print("A=2 bound", math.sqrt(2/(fi+fo)), "; 4x-sigmoid rule bound", 4*math.sqrt(6/(fi+fo)))
print("He std", math.sqrt(2/fi), " Xavier-alt std", math.sqrt(1/fi), " classic gauss std 0.005; classic uniform std", 0.01/math.sqrt(12))
