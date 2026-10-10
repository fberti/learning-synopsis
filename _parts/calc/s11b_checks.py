# Ch11 source-digest B checks (PDL, MLQ, MLSYS, AAMLP). Run: uv run -q --with numpy python -I s11b_checks.py
import numpy as np

def corr2d(x, k):  # "valid" cross-correlation (what DL libraries call convolution)
    H, W = x.shape; kh, kw = k.shape
    return np.array([[np.sum(x[i:i+kh, j:j+kw]*k) for j in range(W-kw+1)] for i in range(H-kh+1)])

def conv2d_true(x, k):  # mathematical convolution = correlation with 180-degree flipped kernel
    return corr2d(x, k[::-1, ::-1])

print("== PDL Fig 12-1 (8x8 crop of an MNIST 8, kernel [[0,-1,0],[-1,3,-1],[0,-1,0]])")
img = np.array([[60,248,67,0,0,93,121,0],[145,253,54,0,6,105,26,0],[145,253,54,33,170,102,0,0],
                [145,254,150,195,130,0,0,0],[61,253,253,149,0,0,0,0],[68,253,237,11,0,0,0,0],
                [185,253,249,57,0,0,0,0],[253,175,201,136,0,0,0,0]])
k = np.array([[0,-1,0],[-1,3,-1],[0,-1,0]])
out = corr2d(img, k)
print(out)
book = np.array([[59,-212,-93,-257,88,-148],[53,-328,-320,239,31,-128],[-39,-306,123,25,-232,0],
                 [-62,-30,-12,-279,0,0],[-52,-55,-410,-11,0,0],[-103,-1,-225,-57,0,0]])
print("matches book figure:", np.array_equal(out, book), " diff positions:", np.argwhere(out != book).tolist())
pad = np.pad(img, 1); print("zero-padded top-left:", corr2d(pad[:3, :3], k)[0, 0], "(book -213)")
print("kernel symmetric under flip:", np.array_equal(k, k[::-1, ::-1]))

print("\n== PDL multichannel example (5x5x2 -> 3x3x3)")
x0 = np.array([[-1,2,2,-2,-2],[-1,0,2,0,2],[1,2,2,1,-2],[-1,2,2,2,2],[1,-1,1,0,-1]])
x1 = np.array([[2,-2,-1,-2,-2],[1,1,2,1,-2],[2,2,-1,-1,0],[-1,-1,2,-2,2],[-1,-2,0,-2,0]])
K = [([[1,-1,1],[1,-1,0],[-1,-1,1]], [[-1,0,0],[1,1,-1],[0,0,1]]),
     ([[0,-1,0],[-1,1,-1],[-1,1,0]], [[0,1,0],[0,1,1],[0,0,0]]),
     ([[1,0,0],[-1,0,0],[0,-1,0]], [[-1,1,1],[1,0,1],[-1,0,0]])]
b = [1, 0, 2]
for f, (ka, kb) in enumerate(K):
    ka, kb = np.array(ka), np.array(kb)
    print(f"k{f} correlation:\n", corr2d(x0, ka)+corr2d(x1, kb)+b[f])
    print(f"k{f} true convolution (flipped):\n", conv2d_true(x0, ka)+conv2d_true(x1, kb)+b[f])
print("FC equivalent weights 50*27 =", 50*27, "; conv weights 3*3*2*3 =", 3*3*2*3)

print("\n== PDL Fig 12-7 2x2 max pooling")
P = np.array([[4,2,8,3,0,9,5,2],[1,6,8,0,4,2,7,7],[3,4,1,9,5,6,3,0],[1,7,3,7,4,9,3,2],
              [4,2,1,6,4,8,7,0],[0,9,3,6,8,2,1,7],[8,2,3,6,0,9,9,1],[2,5,7,3,9,1,6,2]])
mp = P.reshape(4,2,4,2).max(axis=(1,3)); print(mp)
print("book:", [[6,8,9,7],[7,9,9,3],[9,6,8,7],[8,7,9,9]], "match:", mp.tolist()==[[6,8,9,7],[7,9,9,3],[9,6,8,7],[8,7,9,9]])

def osz(n, k, s=1, p=0, d=1):
    return (n + 2*p - d*(k-1) - 1)//s + 1

def conv(cin, cout, k): return cout*(cin*k*k + 1)
def dense(nin, nout): return nout*(nin+1)

def keras_seq(H, C, convs_blocks, dense_layers, ncls):
    """convs_blocks: list of blocks; block = list of (cout,k) then a 2x2 pool (if 'pool' flag)."""
    tot = 0; c = C; h = H
    for blk, pool in convs_blocks:
        for cout, kk in blk:
            tot += conv(c, cout, kk); c = cout; h = osz(h, kk)
        if pool: h //= 2
    n = h*h*c; flat = n
    for u in dense_layers:
        tot += dense(n, u); n = u
    tot += dense(n, ncls)
    return tot, flat

print("\n== PDL ch12/13 parameter counts (MNIST 28x28x1)")
base = keras_seq(28, 1, [([(32,3),(64,3)], True)], [128], 10); print("baseline", base, "(book 1,199,882; flatten 9216)")
print("FC share:", dense(9216,128)/base[0])
tab = {
 "1 add conv3 64 before pool": keras_seq(28,1,[([(32,3),(64,3),(64,3)],True)],[128],10),
 "1b same but 128 filters":   keras_seq(28,1,[([(32,3),(64,3),(128,3)],True)],[128],10),
 "2 duplicate conv2+pool":     keras_seq(28,1,[([(32,3),(64,3)],True),([(64,3)],True)],[128],10),
 "3 conv1 5x5":                keras_seq(28,1,[([(32,5),(64,3)],True)],[128],10),
 "4 dense 1024":               keras_seq(28,1,[([(32,3),(64,3)],True)],[1024],10),
 "5 halve filters":            keras_seq(28,1,[([(16,3),(32,3)],True)],[128],10),
 "6 second dense 128":         keras_seq(28,1,[([(32,3),(64,3)],True)],[128,128],10),
 "7 dense 32":                 keras_seq(28,1,[([(32,3),(64,3)],True)],[32],10),
 "8 no pool":                  keras_seq(28,1,[([(32,3),(64,3)],False)],[128],10),
 "10 remove conv2":            keras_seq(28,1,[([(32,3)],True)],[128],10),
 "2+3 (exp2 with 5x5)":        keras_seq(28,1,[([(32,5),(64,3)],True),([(64,3)],True)],[128],10),
 "10+5x5":                     keras_seq(28,1,[([(32,5)],True)],[128],10),
}
bookv = {"1 add conv3 64 before pool":2076554,"1b same but 128 filters":2076554,"2 duplicate conv2+pool":261962,"3 conv1 5x5":1011978,
         "4 dense 1024":9467274,"5 halve filters":596042,"6 second dense 128":1216394,"7 dense 32":314090,
         "8 no pool":4738826,"10 remove conv2":693962,"2+3 (exp2 with 5x5)":188746,"10+5x5":592074}
for kk,v in tab.items(): print(f"{kk:28s} {v[0]:>10,} flat={v[1]:>6}  book={bookv[kk]:>10,}  ok={v[0]==bookv[kk]}")
print("exp1-base", tab["1 add conv3 64 before pool"][0]-base[0], "(book +876,672); base-exp2", base[0]-tab["2 duplicate conv2+pool"][0], "(book 937,920)")
print("base-exp3", base[0]-tab["3 conv1 5x5"][0], "(book 187,904); base-exp5", base[0]-tab["5 halve filters"][0], "(book 603,840)")
print("188746/2076554 =", 188746/2076554, "; 188746/693962 =", 188746/693962)
print("32x32 input flatten:", (osz(osz(32,3),3)//2)**2*64, "(book 12,544)")

print("\n== PDL FCN output size, stride 2 (from the single 2x2 pool)")
H, W = 308, 336; print("h,w =", (H-28)//2+1, (W-28)//2+1, "(book 141 x 155)")
print("FCN 12x12 conv weights", 12*12*64*128, "= dense", 9216*128)

print("\n== PDL ch14 CIFAR-10 params")
print("shallow", keras_seq(32,3,[([(32,3),(64,3)],True)],[128],10), "(book 1,626,442; flat 12,544)")
print("deep   ", keras_seq(32,3,[([(32,3),(64,3),(64,3),(64,3),(64,3)],True)],[128,128],10), "(book 1,139,338; flat 7,744)")
print("steps 60 epochs x 50000/64:", 60*50000/64, "exact batches incl. partial:", 60*int(np.ceil(50000/64)))
print("vehicle deep model on 28x28:", keras_seq(28,3,[([(32,3),(64,3),(64,3),(64,3),(64,3)],True)],[128,128],4))

print("\n== PDL animal vs vehicle metrics (TP 5841, FP 480, TN 3520, FN 159)")
TP, FP, TN, FN = 5841, 480, 3520, 159
n = TP+FP+TN+FN; tpr = TP/(TP+FN); tnr = TN/(TN+FP); ppv = TP/(TP+FP); npv = TN/(TN+FN)
acc = (TP+TN)/n; f1 = 2*ppv*tpr/(ppv+tpr)
mcc = (TP*TN-FP*FN)/np.sqrt((TP+FP)*(TP+FN)*(TN+FP)*(TN+FN))
pe = ((TP+FP)*(TP+FN)+(TN+FN)*(TN+FP))/n**2; kappa = (acc-pe)/(1-pe)
print(dict(n=n, tpr=round(tpr,4), tnr=round(tnr,4), ppv=round(ppv,4), npv=round(npv,4), acc=round(acc,4),
           f1=round(f1,4), mcc=round(mcc,4), kappa=round(kappa,4), inf=round(tpr+tnr-1,4), mark=round(ppv+npv-1,4)))
print("AUC from hard labels = balanced accuracy =", (tpr+tnr)/2, "(book 'AUC' 0.9267)")
print("FP by class sum", 189+69+105+117, " FN by class sum", 64+34+23+11+12+15)

print("\n== PDL one-vs-rest vs multiclass diag means")
ovr = [75.0,84.0,54.0,52.1,67.6,61.8,86.4,71.5,79.1,91.2]; mc = [70.2,79.4,56.2,57.7,77.4,56.8,82.4,71.7,82.6,80.3]
print(np.mean(ovr), np.mean(mc), "(book 72.3 / 71.5)")
print("fine-tune: new head params", 128*2+2)

print("\n== MLQ ch11 example (3@32x32)")
h = osz(32,5); h = osz(h,5,2); h2 = osz(h,3); h2 = osz(h2,3,2); print("map sizes", osz(32,5), h, osz(h,3), h2, "flatten", 12*h2*h2)
h = osz(32,5); hA = osz(h,3,2); hA2 = osz(osz(hA,3),5,2); print("text pooling order (k3 then k5):", hA, osz(hA,3), hA2, "flatten", 12*hA2*hA2)
print("total", conv(3,5,5)+conv(5,12,3)+dense(192,128)+dense(128,10), "(book 26,926)")
print("BatchNorm extra trainable (gamma,beta) after conv1, conv2, fc1:", 2*(5+12+128))
print("Fig 13-2 equivariance (2x2 ones filter):")
a = np.array([[1,0,0],[1,0,0],[0,0,0]]); bimg = np.array([[0,0,1],[0,0,1],[0,0,0]]); f = np.ones((2,2))
print(corr2d(a,f)); print(corr2d(bimg,f))

print("\n== MLSYS MLP worked example")
Wm = np.array([[0.5,-0.3,0.2,0.7],[0.1,0.8,-0.4,0.3],[-0.2,0.4,0.6,-0.1]]); h0 = np.array([0.8,0.2,0.9,0.1])
print("W h =", Wm@h0, "(book 0.65, -0.17, 0.47)")
print("USPS-style MLP 784-100-100-10 params:", dense(784,100)+dense(100,100)+dense(100,10))
print("50176/9 =", 50176/9, "; 224*224*64 =", 224*224*64, "; first conv RGB 3x3x3x64 weights =", 3*3*3*64)
print("TPU 128x128 =", 128*128, " 256x256 =", 256*256)
print("GPT-3 175e9 params bytes fp16/fp32:", 175e9*2/1e12, 175e9*4/1e12, "TB ; AlexNet->GPT-3 ratio", 175e9/62e6, 175e9/60e6)
print("TPUv4 275/200 =", 275/200, " MobileNetV2 ratio 25.6/3.4 =", 25.6/3.4, " V100 125/15.7 =", 125/15.7)

print("\n== MLSYS im2col Fig 4.10 (2-channel 3x3 input, 2x2x2 filter)")
X = np.arange(1,19).reshape(2,3,3); Kf = np.arange(1,9).reshape(2,2,2)
rows = [np.concatenate([X[c,i:i+2,j:j+2].ravel() for c in range(2)]) for i in range(2) for j in range(2)]
M = np.array(rows); print(M); print("GEMM result", M@Kf.reshape(-1), " direct:", sum(corr2d(X[c],Kf[c]) for c in range(2)).ravel())

print("\n== AlexNet / LeNet / VGG / ViT counts")
s = 227; s1 = osz(s,11,4); p1 = osz(s1,3,2); s2 = osz(p1,5,1,2); p2 = osz(s2,3,2); p3 = osz(p2,3,2)
print("AlexNet sizes", s1, p1, s2, p2, p3, "; 224 with k11 s4:", (224-11)/4+1)
alex = conv(3,96,11)+conv(96,256,5)+conv(256,384,3)+conv(384,384,3)+conv(384,256,3)+dense(9216,4096)+dense(4096,4096)+dense(4096,1000)
alex_grouped = (96*(3*121)+96) + (256*(48*25)+256) + (384*(256*9)+384) + (384*(192*9)+384) + (256*(192*9)+256) + dense(9216,4096)+dense(4096,4096)+dense(4096,1000)
aamlp = conv(3,96,11)+conv(96,256,5)+conv(256,384,3)+conv(384,256,3)+dense(9216,4096)+dense(4096,4096)+dense(4096,1000)
print(f"AlexNet ungrouped {alex:,}; with 2-GPU groups (orig paper) {alex_grouped:,}; AAMLP 4-conv version {aamlp:,}")
print("AlexNet FC share", (dense(9216,4096)+dense(4096,4096)+dense(4096,1000))/alex)
lenet = 6*26 + 6*2 + 1516 + 16*2 + 120*(16*25+1) + 84*(120+1)
print("LeNet-5 (1998, C3 partial connectivity, trainable):", lenet)
vgg16_convs = [(3,64),(64,64),(64,128),(128,128),(128,256),(256,256),(256,256),(256,512),(512,512),(512,512),(512,512),(512,512),(512,512)]
vgg = sum(conv(a,b2,3) for a,b2 in vgg16_convs) + dense(7*7*512,4096)+dense(4096,4096)+dense(4096,1000)
print(f"VGG-16 {vgg:,}; FC share {(dense(25088,4096)+dense(4096,4096)+dense(4096,1000))/vgg:.3f}")
print("two 3x3 vs one 5x5 (C->C): 18C^2 vs 25C^2; three 3x3 vs 7x7: 27 vs 49 ->", 18/25, 27/49)
def resnet(blocks, bottleneck):
    tot = 3*64*49 + 2*64  # conv1 7x7 (no bias) + BN
    cin = 64
    widths = [64,128,256,512]
    for st, (nb, w) in enumerate(zip(blocks, widths)):
        for i in range(nb):
            if bottleneck:
                cout = 4*w
                tot += cin*w + 2*w + w*w*9 + 2*w + w*cout + 2*cout
                if i == 0: tot += cin*cout + 2*cout
                cin = cout
            else:
                cout = w
                tot += cin*w*9 + 2*w + w*w*9 + 2*w
                if i == 0 and cin != cout: tot += cin*cout + 2*cout
                cin = cout
    return tot + dense(cin, 1000)
print(f"ResNet-18 {resnet([2,2,2,2],False):,}  ResNet-34 {resnet([3,4,6,3],False):,}  ResNet-50 {resnet([3,4,6,3],True):,}  ResNet-152 {resnet([3,8,36,3],True):,}")
d, L, mlp = 768, 12, 3072
vit = (16*16*3*d + d) + d + 197*d + L*(4*d*d + 4*d + 2*d*mlp + mlp + d + 4*d) + 2*d + dense(d,1000)
print(f"ViT-B/16 tokens {(224//16)**2} (+1 cls); params {vit:,}")
print("receptive field of n stacked 3x3 stride-1 convs: ", [1+2*n for n in range(1,6)])

print("\n== U-Net (AAMLP code = original paper) 572 -> ?")
h = 572; skips = []
for i in range(4):
    h = h-4; skips.append(h); h //= 2
h -= 4
for i in range(4):
    h = h*2; h -= 4
print("output", h, "skips", skips)
print("AAMLP stride formula 8x8 k3 s2:", osz(8,3,2))
