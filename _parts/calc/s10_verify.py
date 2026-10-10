# Ch10 source digest: verify every numeric claim of MDL ch7/8/10/11 and DLV ch9/14/15 (+extras)
# run: uv run -q --with numpy --with scipy python -I s10_verify.py
import math
import numpy as np
from scipy import stats

def h(t): print(f"\n=== {t} ===")
sig = lambda z: 1/(1+math.exp(-z))

h("MDL ch7 chain rule / gradient")
f = lambda x: (x*x+2*x+3)**2; fp = lambda x: 4*(x+1)*(x*x+2*x+3)
x = 0.7; print("(x^2+2x+3)^2 deriv ok:", abs((f(x+1e-6)-f(x-1e-6))/2e-6 - fp(x)) < 1e-5)
f = lambda x: 2*(4*x-5)**2+3; print("2(4x-5)^2+3 deriv=16(4x-5):", round((f(x+1e-6)-f(x-1e-6))/2e-6,4), 16*(4*x-5), " expanded 32x^2-80x+53:", 2*(4*x-5)**2+3 - (32*x*x-80*x+53))
f = lambda x: 1/(3*x*x); print("1/(3x^2) deriv=-2/(3x^3):", round((f(x+1e-6)-f(x-1e-6))/2e-6,4), round(-2/(3*x**3),4))
r, s = 0.3, -0.2; X = 3*r+2*s; Y = r*r-3*s
F = lambda r, s: (3*r+2*s)**3 + (r*r-3*s)**3
print("df/dr num vs 9x^2+6y^2 r:", round((F(r+1e-6,s)-F(r-1e-6,s))/2e-6,5), round(9*X*X+6*Y*Y*r,5))
print("df/ds num vs 6x^2-9y^2:", round((F(r,s+1e-6)-F(r,s-1e-6))/2e-6,5), round(6*X*X-9*Y*Y,5))
x, y = 0.5, -0.4
print("f(0.5,-0.4)=", x*x+x*y+y*y, " grad=", (2*x+y, x+2*y), " |grad|=", math.hypot(2*x+y, x+2*y))

h("MDL ch10 backprop by hand: formulas (finite differences) + own worked example")
def fwd(p, x0, x1):
    z0 = p['w0']*x0 + p['w2']*x1 + p['b0']; a0 = sig(z0)
    z1 = p['w1']*x0 + p['w3']*x1 + p['b1']; a1 = sig(z1)
    a2 = p['w4']*a0 + p['w5']*a1 + p['b2']
    return z0, a0, z1, a1, a2
def loss(p, x0, x1, y): return 0.5*(y - fwd(p, x0, x1)[4])**2
def grads(p, x0, x1, y):
    z0, a0, z1, a1, a2 = fwd(p, x0, x1); e = a2 - y
    d0 = e*p['w4']*a0*(1-a0); d1 = e*p['w5']*a1*(1-a1)
    return dict(b2=e, w4=e*a0, w5=e*a1, b1=d1, w1=d1*x0, w3=d1*x1, b0=d0, w0=d0*x0, w2=d0*x1)
p = dict(w0=0.2, w1=-0.3, w2=0.4, w3=0.1, w4=0.5, w5=-0.4, b0=0.0, b1=0.0, b2=0.0)
x0, x1, y = 1.0, 0.5, 1.0
g = grads(p, x0, x1, y); ok = True
for k in p:
    q = dict(p); q[k] += 1e-6; q2 = dict(p); q2[k] -= 1e-6
    ok &= abs((loss(q, x0, x1, y)-loss(q2, x0, x1, y))/2e-6 - g[k]) < 1e-8
print("book eqs 10.4-10.8 match finite differences:", ok)
z0, a0, z1, a1, a2 = fwd(p, x0, x1)
print(f"own example x=({x0},{x1}) y={y}: z0={z0:.4f} a0={a0:.4f} z1={z1:.4f} a1={a1:.4f} a2={a2:.4f} L={loss(p,x0,x1,y):.4f}")
print("  sigma'(z0)=a0(1-a0)=%.4f  sigma'(z1)=%.4f" % (a0*(1-a0), a1*(1-a1)))
print("  grads:", {k: round(v, 5) for k, v in g.items()})
eta = 0.1; p2 = {k: p[k]-eta*g[k] for k in p}
print("  after one step eta=0.1:", {k: round(v, 5) for k, v in p2.items()}, " new L=%.4f" % loss(p2, x0, x1, y))
print("init range 0.0001*(U-0.5):", 0.0001*-0.5, 0.0001*0.5)
print("iris acc before/after/iris.py:", 15/30, round(28/30, 4), round(29/30, 4))

h("MDL ch10 MNIST NN.py")
cm = np.array([[965,0,1,1,1,5,2,3,2,0],[0,1121,3,2,0,1,3,0,5,0],[6,0,1005,4,2,0,3,7,5,0],[0,1,6,981,0,4,0,9,4,5],
 [2,0,3,0,953,0,5,3,1,15],[4,0,0,10,0,864,5,1,4,4],[8,2,1,1,3,4,936,0,3,0],[2,7,19,2,1,0,0,989,1,7],
 [5,0,4,5,3,5,7,3,939,3],[5,5,2,10,8,2,1,3,6,967]])
true_counts = [980,1135,1032,1010,982,892,958,1028,974,1009]
print("acc", cm.trace()/cm.sum(), "total", cm.sum(), "row sums", cm.sum(1).tolist(), "== MNIST test counts:", cm.sum(1).tolist() == true_counts)
off = cm.copy(); np.fill_diagonal(off, 0); i, j = np.unravel_index(off.argmax(), off.shape); print("largest off-diag", (i, j), off[i, j])
print("params 196-100-50-10:", 196*100+100 + 100*50+50 + 50*10+10, " samples seen 40000*64 =", 40000*64, "=", round(40000*64/60000, 2), "epochs")

def mcc(C):  # Gorodkin multiclass MCC
    C = np.asarray(C, float); t = C.sum(1); pr = C.sum(0); c = C.trace(); s = C.sum()
    return (c*s - t@pr)/math.sqrt((s*s - pr@pr)*(s*s - t@t))
h("MDL ch11 FMNIST")
A = [[866,1,14,28,8,1,68,0,14,0],[5,958,2,25,5,0,3,0,2,0],[20,1,790,14,126,0,44,1,3,1],[29,21,15,863,46,1,20,0,5,0],
 [0,0,91,22,849,1,32,0,5,0],[0,0,0,1,0,960,0,22,2,15],[161,2,111,38,115,0,556,0,17,0],[0,0,0,0,0,29,0,942,0,29],
 [1,0,7,5,6,2,2,4,973,0],[0,0,0,0,0,6,0,29,1,964]]
B = [[766,5,14,61,2,1,143,0,8,0],[1,958,2,30,3,0,6,0,0,0],[12,0,794,16,98,0,80,0,0,0],[8,11,13,917,21,0,27,0,3,0],
 [0,0,84,44,798,0,71,0,3,0],[0,0,0,1,0,938,0,31,1,29],[76,2,87,56,60,0,714,0,5,0],[0,0,0,0,0,11,0,963,0,26],
 [1,1,6,8,5,1,10,4,964,0],[0,0,0,0,0,6,0,33,0,961]]
for n, C in (("no momentum", A), ("momentum", B)):
    C = np.array(C); print(n, "rows", C.sum(1).tolist(), "acc", C.trace()/C.sum(), "MCC %.7f" % mcc(C))
m1, se1, m0, se0, n = 0.86413, 0.00075, 0.85778, 0.00056, 22
t = (m1-m0)/math.hypot(se1, se0); print("Welch-ish t from means/SEM: %.3f (book 6.774)" % t)
for dd in (0, 1):
    sd1, sd0 = se1*math.sqrt(n-dd), se0*math.sqrt(n-dd); d = (m1-m0)/math.sqrt((sd1**2+sd0**2)/2)
    print(f"Cohen d (SEM=sd/sqrt(n-{dd})): {d:.3f} (book 2.042)")
print("p two-sided for t=6.77398 df=42: %.2e (book 3e-8)" % (2*stats.t.sf(6.77398299, 42)))
U = 41; mu = n*n/2; sdU = math.sqrt(n*n*(2*n+1)/12); zU = (U-mu)/sdU
print("MWU U=41: z=%.3f, one-sided p=%.2e, two-sided p=%.2e (book 1.26e-6); U1 for momentum=%d" % (zU, stats.norm.cdf(zU), 2*stats.norm.cdf(zU), n*n-U))
print("momentum steady-state step: eta/(1-mu) =", 0.2/(1-0.9), "vs no-momentum eta 1.0")

h("MDL ch11 1D GD on f=6x^2-12x+3")
x = -0.9; xs = [x]
for k in range(15): x = x - 0.03*(12*x-12); xs.append(x)
print("eta=0.03 from -0.9: x after 14 steps %.6f, 15 steps %.6f (book: 'after 14 steps x=0.997648')" % (xs[14], xs[15]))
print("contraction factor 1-12*eta: 0.03->", 1-12*0.03, " 0.15->", 1-12*0.15, " diverge if eta>1/6=", 1/6)
x = 0.75
for k in range(5): x = x - 0.15*(12*x-12); print("  eta=0.15 step", k+1, round(x, 5))
x = 0.75
for k in range(4): x = x - 0.2*(12*x-12)
print("eta=0.2 (factor -1.4) after 4 steps from 0.75: %.3f (diverges)" % x)
x, v = 0.75, 0.0; traj = []
for k in range(50): v = 0.8*v - 0.09*(12*x-12); x += v; traj.append(x)
print("momentum eta=0.09 mu=0.8: first 10:", [round(t, 3) for t in traj[:10]], " after 50: %.6f" % traj[-1])

h("MDL ch11 2D")
print("min of 6x^2+9y^2-12x-14y+3:", (1, 14/18), " min of 6x^2+40y^2-12x-30y+3:", (1, 30/80))
print("factors eta=0.02 (y):", 1-0.02*18, "| canyon eta=0.02 y:", 1-0.02*80, " x:", 1-0.02*12, " eta=0.01 y:", 1-0.01*80, " x:", 1-0.01*12)
E1 = lambda x, y: np.exp(-0.5*((x+1)**2+(y-1)**2)); E2 = lambda x, y: np.exp(-0.5*((x-1)**2+(y+1)**2))
f2 = lambda x, y: -2*E1(x, y) - E2(x, y)
dx = lambda x, y: 2*(x+1)*E1(x, y) + (x-1)*E2(x, y); dy = lambda x, y: (y+1)*E2(x, y) + 2*(y-1)*E1(x, y)
from scipy.optimize import minimize
for st in ((-1, 1), (1, -1)):
    r = minimize(lambda z: f2(*z), st, tol=1e-12); print("true local min near", st, "->", np.round(r.x, 4), "f=%.4f" % r.fun, " f at nominal:", round(float(f2(*st)), 4))
def gd(x, y, eta, n):
    for _ in range(n): x, y = x-eta*dx(x, y), y-eta*dy(x, y)
    return x, y
for st, n in (((-1.5, 1.2), 9), ((1.5, -1.8), 9), ((0, 0), 20), ((0.7, -0.2), 20), ((1.5, 1.5), 30)):
    print("vanilla eta=0.4", st, n, "steps ->", np.round(gd(*st, 0.4, n), 4))
def mom(x, y, eta, mu, n, nest=None):
    vx = vy = 0.0
    for _ in range(n):
        if nest is None: gx, gy = dx(x, y), dy(x, y)
        elif nest == "book": gx, gy = dx(x+mu*vx, y), dy(x, y+mu*vy)
        else: gx, gy = dx(x+mu*vx, y+mu*vy), dy(x+mu*vx, y+mu*vy)
        vx = mu*vx - eta*gx; vy = mu*vy - eta*gy; x += vx; y += vy
    return x, y
for st, eta, n in (((1.5, 1.5), 0.02, 90), ((0.7, -0.2), 0.1, 25)):
    print("Table 11-2", st, "std:", np.round(mom(*st, eta, 0.9, n), 4), " nesterov(book code):", np.round(mom(*st, eta, 0.9, n, "book"), 4), " nesterov(correct):", np.round(mom(*st, eta, 0.9, n, "ok"), 4))

h("Adam / RMSprop details")
b1, b2, eps, lr = 0.9, 0.999, 1e-8, 0.001
for g0 in (5.0, 0.001):
    m = (1-b1)*g0; v = (1-b2)*g0*g0
    print(f"g={g0}: uncorrected step {lr*m/(math.sqrt(v)+eps):.6f}  corrected step {lr*(m/(1-b1))/(math.sqrt(v/(1-b2))+eps):.6f}  (t=0 would give 1-b^0=0 -> divide by zero)")
print("RMSprop with m=0 start, g=0 for a weight -> 0/0 without eps")

h("DLV ch14")
E = lambda P: (P-1)**2
print("E(-1)=", E(-1), " slope at -1:", 2*(-1-1), " E(0)=", E(0), " E(-0.5) linear pred:", E(-1)-4*0.5, " true:", E(-0.5))
print("Fig14-10: 4 + (-4)(1/4) =", 4-4*0.25, " Fig14-11: -1.5/0.5 =", -1.5/0.5, " (-1.25)/(-0.5) =", -1.25/-0.5, " book wrote 1.25/-0.5 =", 1.25/-0.5)
for Co in (1, 2, 5): print(f"  label 1, Co={Co}: book delta L-Co={1-Co}, true dE/dCo for E=1/2(L-C)^2: {Co-1}")
print("moons net 2-4-4-1 weights", 2*4+4*4+4, "+ biases", 4+4+1, "=", 2*4+4*4+4+9)

h("DLV ch15")
print("0.1*0.99=", 0.1*0.99, " *0.99=", round(0.1*0.99*0.99, 6))
print("decay 0.8 from 1/8 after 14 steps:", 0.125*0.8**14, " from 0.25:", 0.25*0.8**14)
print("SGD updates 300*400=", 300*400, " ratio to 20000:", 300*400/20000, " minibatches/epoch ceil(300/32)=", math.ceil(300/32), " *5000=", math.ceil(300/32)*5000)
print("net 2-12-13-13-2 params:", (2*12+12)+(12*13+13)+(13*13+13)+(13*2+2))

h("DLV extras")
print("0.4^8 =", 0.4**8, " 1.6^8 =", 1.6**8)
c1 = 3*3*1*32+32; c2 = 3*3*32*64+64; d1 = 12*12*64*128+128; d2 = 128*10+10
print("MNIST convnet: 26x26x32 -> 24x24x64 -> 12x12x64 flatten", 12*12*64, " params", c1, c2, d1, d2, "total", c1+c2+d1+d2)
rng = np.random.default_rng(0); a = np.ones(100000); pdrop = 0.5
mask = rng.random(a.size) > pdrop
print("dropout p=0.5: E[train out] no rescale %.3f, inverted (÷(1-p)) %.3f, test out 1.0" % ((a*mask).mean(), (a*mask/(1-pdrop)).mean()))

h("Table 11-2 distances to true minima + MWU continuity")
tm = {(1.5, 1.5): (-0.98040, 0.98040), (0.7, -0.2): (0.89400, -0.89400)}
for st, eta, n in (((1.5, 1.5), 0.02, 90), ((0.7, -0.2), 0.1, 25)):
    r = minimize(lambda z: f2(*z), tm[st], tol=1e-14).x
    for lab, nest in (("std", None), ("nest-book", "book"), ("nest-correct", "ok")):
        q = mom(*st, eta, 0.9, n, nest); print(st, lab, "dist to true min %.4f" % math.dist(q, r), " dist to book's 'minimum'", "%.4f" % math.dist(q, (-1, 1) if st == (1.5, 1.5) else (1, -1)))
zc = (41+0.5-242)/sdU; print("MWU with continuity: one-sided p=%.3e two-sided=%.3e" % (stats.norm.cdf(zc), 2*stats.norm.cdf(zc)))
