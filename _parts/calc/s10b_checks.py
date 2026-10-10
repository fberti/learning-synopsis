# Checks for MLQ ch27 (proper metrics), weight decay vs L2 under Adam, dropout scaling, momentum form
import math, random
H = lambda y, p: -y*math.log(p)          # MLQ's one-term cross-entropy
print("H(0.9,0.9)=%.4f  H(1,0.5)=%.4f  H(0.5,1)=%.4f" % (H(.9,.9), H(1,.5), H(.5,1)))
a, b, c = H(.9,.5), H(.9,.4), H(.4,.5)
print("book triangle example: H(r,p)=%.3f  H(r,q)=%.3f  H(q,p)=%.3f  sum=%.3f  -> d(r,p) <= sum holds: %s" % (a,b,c,b+c, a <= b+c))
# genuine counterexample
a, b, c = H(1,.1), H(1,.9), H(.9,.1)
print("r=1,q=0.9,p=0.1: H(r,p)=%.3f  H(r,q)+H(q,p)=%.3f  violated: %s" % (a, b+c, a > b+c))
# squared error triangle
print("SE: (0-2)^2=4 vs 1+1=2 violated:", 4 > 2)
# ---- L2 vs decoupled weight decay with Adam (one parameter, zero data gradient) ----
def adam(steps, lam, decoupled, lr=0.01, g_data=0.0, w=1.0, b1=.9, b2=.999, eps=1e-8):
    m = v = 0.0
    for t in range(1, steps+1):
        g = g_data + (0 if decoupled else lam*w)
        m = b1*m + (1-b1)*g; v = b2*v + (1-b2)*g*g
        mh, vh = m/(1-b1**t), v/(1-b2**t)
        w -= lr*mh/(math.sqrt(vh)+eps)
        if decoupled: w -= lr*lam*w
    return w
print("Adam+L2 (lam=0.1), 100 steps, w0=1:", round(adam(100, .1, False), 4), "  AdamW (lam=0.1):", round(adam(100, .1, True), 4))
print("Adam+L2 lam=0.001 vs 0.1 after 100 steps:", round(adam(100,.001,False),4), round(adam(100,.1,False),4), " (L2 strength nearly irrelevant: Adam normalises the gradient)")
# SGD: L2 == weight decay exactly
w1 = w2 = 1.0; lr, lam = .1, .01
for _ in range(10):
    w1 -= lr*(0.5 + lam*w1)          # L2 in loss (grad of lam/2 w^2)
    w2 = w2*(1-lr*lam) - lr*0.5      # decoupled decay
print("SGD: L2 vs decay identical:", abs(w1-w2) < 1e-12)
# ---- dropout scaling: standard (scale at test by 1-p) vs inverted (scale at train by 1/(1-p)) ----
random.seed(1); p = 0.5; x = [1.0]*10000
train_inv = sum(xi*(random.random() > p)/(1-p) for xi in x)/len(x)
print("inverted dropout train-time mean %.3f ~ test-time mean 1.0 (no rescale needed)" % train_inv)
# ---- momentum: book form w_{i+1} = w_i - eta*g_i + mu*dw_{i-1} ----
# if dw = gradient, + mu*g_{i-1} pushes UPHILL. Minimise f = w^2/2 (g = w)
def run(form, steps=50, eta=.1, mu=.9):
    w, gprev, v = 1.0, 0.0, 0.0
    for _ in range(steps):
        g = w
        if form == "book_grad": w = w - eta*g + mu*gprev; gprev = g
        else: v = mu*v - eta*g; w = w + v
    return w
print("f=w^2/2, 50 steps: book form (dw=grad) w=%.3g ; standard heavy-ball w=%.3g" % (run("book_grad"), run("std")))
# ---- MLSYS training: optimizer memory ----
P = 100e6
print("Adam extra state 100M params FP32: %.0f MB" % (2*P*4/1e6))
for name, states in [("SGD", 0), ("momentum", 1), ("Adam", 2)]:
    print(name, "params+grads+states multiplier:", 2+states)
N = 1.5e9
print("mixed-precision Adam 16 B/param, 1.5B: %.0f GB ; without master copy 12 B: %.0f GB" % (16*N/1e9, 12*N/1e9))
print("GPT-2 shape 48x1280: ~%.2fB params ; 48x1600: ~%.2fB" % ((12*48*1280**2 + 50257*1280 + 1024*1280)/1e9, (12*48*1600**2 + 50257*1600 + 1024*1600)/1e9))
print("80 GB / 16 B per param = %.1fB params max (no activations)" % (80e9/16/1e9))
print("attention box: 9.8e12 / 125e12 = %.3f s" % (9.8e12/125e12))
print("f'(2) for x^2 sin x =", 2*2*math.sin(2) + 4*math.cos(2))
