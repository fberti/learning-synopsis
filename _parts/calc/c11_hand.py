import numpy as np, math
from math import floor
def xcorr(x, k, p=0, s=1):
    x = np.pad(np.asarray(x, float), p); k = np.asarray(k, float); K = k.shape[0]
    Ho = (x.shape[0] - K)//s + 1; Wo = (x.shape[1] - K)//s + 1
    return np.array([[ (x[r*s:r*s+K, c*s:c*s+K]*k).sum() for c in range(Wo)] for r in range(Ho)])
osz = lambda n, k, p=0, s=1: (n + 2*p - k)/s + 1
print("== 11.1")
print("224x224x3", 224*224*3, "FullHD", 1920*1080*3, "12MP", 4000*3000*3, "digits", 64, "board", 256)
print("MLP first layer 224x224x3 x 1000:", 224*224*3*1000, "+bias", 224*224*3*1000+1000)
print("MNIST 784x100", 784*100, "12MP x 1000", 4000*3000*3*1000)
print("MLP 256-16-10", 256*16+16+16*10+10, "MLP 64-16-10", 64*16+16+170)
print("batch 32 x 3x224x224", 32*3*224*224, "bytes float32", 32*3*224*224*4/2**20, "MiB")
print("CIFAR 32x32x3", 32*32*3, "x 512 hidden", 32*32*3*512+512)
print("== 11.2 1D")
x = np.array([0,0,2,2,2,0,0]); print("diff", [x[i+1]-x[i] for i in range(6)])
x2 = np.array([3,0,3,6,3]); print("blur", [x2[i:i+3].mean() for i in range(3)])
T = [[1,1,1,1,1],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]]
V = [[-1,0,1]]*3; Hk = [[1,1,1],[0,0,0],[-1,-1,-1]]; B = np.ones((3,3))/9
print("T vert\n", xcorr(T, V)); print("T horiz\n", xcorr(T, Hk)); print("T blur\n", xcorr(T, B).round(3))
print("T vert flipped (true conv)\n", xcorr(T, np.flip(V)))
print("T vert p1\n", xcorr(T, V, p=1)); print("T vert p1 s2\n", xcorr(T, V, p=1, s=2))
# DLV stripe
F = [[-1,1,-1]]*3
print("stripe patch", (np.array([[1,1,0],[0,0,0],[1,0,1]])*np.array(F)).sum(), "perfect", (np.array([[0,1,0]]*3)*np.array(F)).sum(), "all1", np.array(F).sum(), "worst", -6)
# HAW sobel
W = np.array([[60,60,68],[44,60,60],[68,76,76]]); S = np.array([[-1,-2,-1],[0,0,0],[1,2,1]])
print("HAW sobel", (W*S).sum())
print("== out sizes")
for args in [(5,3,0,1),(5,3,1,1),(5,3,1,2),(8,3,0,2),(224,7,3,2),(227,11,0,4),(224,11,0,4),(28,5,0,1),(32,5,0,1),(28,3,1,1),(16,3,1,1),(7,3,0,1),(10,5,0,1),(9,3,0,3),(224,3,1,1),(112,2,0,2),(55,3,0,2),(27,3,0,2),(13,3,0,2),(64,5,2,2), (100,4,0,3), (6,3,1,1), (8,2,0,2), (15,2,0,2)]:
    v = osz(*args); print(args, v, floor(v))
print("== 11.2 practice")
print("1D (1,3,2,5) k(1,-1):", [1-3, 3-2, 2-5], "k(.5,.5):", [(1+3)/2,(3+2)/2,(2+5)/2])
P = [[1,2,0],[0,1,3],[2,0,1]]; print("2x2 ones\n", xcorr(P, np.ones((2,2))))
SobV = [[-1,0,1],[-2,0,2],[-1,0,1]]; print("T sobelV\n", xcorr(T, SobV))
print("T sobelH (HAW)\n", xcorr(T, [[-1,-2,-1],[0,0,0],[1,2,1]]))
L = [[0,1,0],[1,-4,1],[0,1,0]]; print("laplace best", 4, "worst", -4)
print("sobel H on step", (np.array([[10,10,10],[10,10,10],[50,50,50]])*np.array([[-1,-2,-1],[0,0,0],[1,2,1]])).sum())
sh = [[0,-1,0],[-1,5,-1],[0,-1,0]]; print("sharpen T\n", xcorr(T, sh)); print("sharpen T p1\n", xcorr(T, sh, p=1))
print("stripe on T windows\n", xcorr(T, F))
x = [0,0,2,2,2,0,0]; xs = [0,0,0,2,2,2,0]; print("equiv", [x[i+1]-x[i] for i in range(6)], [xs[i+1]-xs[i] for i in range(6)])
print("== 11.3")
Vr = [[1,0,-1]]*3
print("T relu vert", np.maximum(xcorr(T,V),0).tolist(), "relu reversed", np.maximum(xcorr(T,Vr),0).tolist())
cp = lambda cout, k, cin: cout*(k*k*cin+1)
print("conv1", cp(8,3,1), "conv2", cp(32,3,8), "fc", 32*10+10, "total", cp(8,3,1)+cp(32,3,8)+330)
print("VGG first", cp(64,3,3), "VGG 2nd", cp(64,3,64), "PDL", 3*3*3*2, "+3", "FC 50x27", 50*27)
print("RGB 64 3x3", cp(64,3,3), "3x3x3 weights", 27, "5x5 rgb 16", cp(16,5,3), "1x1 300->175", cp(175,1,300))
print("fc 256 inputs -> 32 map conv equiv?")
M = np.array([[1,3,0,2],[5,0,1,1],[0,2,4,0],[1,1,0,7]])
mx = M.reshape(2,2,2,2).max(axis=(1,3)); av = M.reshape(2,2,2,2).mean(axis=(1,3)); print("pool max", mx.tolist(), "avg", av.tolist())
print("macs conv2 16x16", 16*16*32*72, "8x8", 8*8*32*72, "conv1", 16*16*8*9)
print("activations conv1 16x16x8", 16*16*8, "pooled", 8*8*8)
def rf(layers):
    r, j, out = 1, 1, []
    for k, s in layers: r = r + (k-1)*j; j = j*s; out.append((r, j))
    return out
print("two3", rf([(3,1),(3,1)]), "three3", rf([(3,1)]*3), "cnnB", rf([(3,1),(2,2),(3,1)]), "vgg early", rf([(3,1),(3,1),(2,2),(3,1),(3,1),(2,2)]))
vgg = [(3,1),(3,1),(2,2)]*2 + [(3,1),(3,1),(3,1),(2,2)]*3
print("vgg16 last pool", rf(vgg)[-1])
print("lenet", rf([(5,1),(2,2),(5,1),(2,2),(5,1)]))
print("alexnet", rf([(11,4),(3,2),(5,1),(3,2),(3,1),(3,1),(3,1),(3,2)]))
# pooling practice
P8 = np.array([[2,0,1,4],[3,1,0,2],[0,0,5,1],[6,2,3,3]]); print("P8 max", P8.reshape(2,2,2,2).max(axis=(1,3)).tolist(), "avg", P8.reshape(2,2,2,2).mean(axis=(1,3)).tolist())
print("keras mnist dense share", 1179776/1199882, "PDL no pool", 4738826)
print("gap resnet", 2048*1000+1000, "vgg fc1", 7*7*512*4096+4096)
print("== 11.4")
C = lambda C2, k: k*k*C2*C2  # weights per C_in=C_out=C
for c in [64, 256, 512]: print("C", c, "two 3x3", 2*9*c*c, "one 5x5", 25*c*c, "three3", 27*c*c, "7x7", 49*c*c, "ratio", 49/27)
print("lenet modern", 156 + 16*(6*25+1) + 120*(16*25+1) + 84*121 + 850)
print("lenet orig", 156+12+1516+32+48120+10164+840)
alex = [96*(11*11*3+1), 256*(5*5*96+1), 384*(3*3*256+1), 384*(3*3*384+1), 256*(3*3*384+1), 9216*4096+4096, 4096*4096+4096, 4096*1000+1000]
print("alexnet", sum(alex), "fc share", sum(alex[5:])/sum(alex), "conv", sum(alex[:5]))
vggc = [(3,64),(64,64),(64,128),(128,128),(128,256),(256,256),(256,256),(256,512),(512,512),(512,512),(512,512),(512,512),(512,512)]
vconv = sum(co*(9*ci+1) for ci,co in vggc); vfc = 25088*4096+4096 + 4096*4096+4096 + 4097000
print("vgg16", vconv+vfc, "conv", vconv, "fc share", vfc/(vconv+vfc))
print("top5 chance", 1-5/1000, "top1 chance", 1-1/1000)
print("resnet50 gap head", 2048*1000+1000)
# residual
x=2.0; print("res: F=0.3 ->", x+0.3)
print("degradation example: plain 20 vs 56 (He 2015 fig1 approx train err ~?)")
print("basic block params 64:", 2*(64*9*64), "+bn", 2*2*64)
print("ilsvrc ratio 26.2/15.3", 26.2/15.3, "error drop 2010->2015", 28.2/3.57)
print("1.2M images 1000 classes per class", 1.2e6/1000)
print("== 11.5")
print("resnet18 head 5", 512*5+5, "share", (512*5+5)/11.7e6, "resnet50 head 3", 2048*3+3, "vgg16 new last 2", 4096*2+2, "PDL head", 128*2+2)
cos = lambda a,b: np.dot(a,b)/np.linalg.norm(a)/np.linalg.norm(b)
a=np.array([0.9,0.1]); b=np.array([0.8,0.3]); e=np.array([-0.2,0.9])
print("cos aa'", cos(a,b), "cos a e", cos(a,e), "cos b e", cos(b,e))
print("frozen resnet50 features 2048 x 10 classes logreg", 2048*10+10)
print("finetune lr", 0.01*0.1)
print("== 11.6")
def iou(a, b):
    ix = max(0, min(a[2], b[2]) - max(a[0], b[0])); iy = max(0, min(a[3], b[3]) - max(a[1], b[1])); I = ix*iy
    A = (a[2]-a[0])*(a[3]-a[1]); B = (b[2]-b[0])*(b[3]-b[1]); return I, A+B-I, I/(A+B-I), 2*I/(A+B)
for a, b in [((0,0,4,4),(2,2,6,6)), ((1,1,5,5),(2,1,6,5)), ((0,0,4,4),(1,0,5,4)), ((0,0,4,4),(6,6,9,9)), ((0,0,10,10),(0,0,5,10)), ((2,2,6,6),(3,3,5,5)), ((0,0,4,2),(2,0,6,2)), ((0,0,6,4),(3,0,9,4)), ((0,0,4,4),(0,0,4,6))]:
    print(a, b, iou(a, b))
print("yolo v1", 7*7*(2*5+20), "semantic 224", 224*224, "dice from iou 0.6", 2*0.6/1.6, "iou from dice 0.8", 0.8/(2-0.8))
print("unet", 572, 388)
print("flip box W=10 x 2..5 ->", 10-5, 10-2)
print("== 11.8")
for N, fmr in [(1_000_000, 1e-5), (1_000_000, 1e-3), (1_000_000, 1e-6), (10_000_000, 1e-5)]: print("1:N", N, fmr, "false hits", N*fmr, "P(no false)", (1-fmr)**N)
crowd, wanted, rec, fpr = 50_000, 10, 0.9, 0.001
tp = wanted*rec; fp = (crowd-wanted)*fpr; print("stadium tp", tp, "fp", fp, "precision", tp/(tp+fp))
print("airport", 10_000*0.01)
fp2 = (crowd-wanted)*0.0001; print("stadium fpr 1e-4", fp2, tp/(tp+fp2))
# group thresholds
print("group A fmr 1e-4, group B 10x -> per 1e6 searches", 1e6*1e-4, 1e6*1e-3)
print("gender shades ratio", 34.7/0.8)
print("panda eps 0.007*255", 0.007*255, "tiger 2/255", 2/255)
print("== vegyes")
# 1: shape walk 64x64x3: conv3x3 16 p1 -> pool -> conv3x3 32 p1 -> pool -> GAP -> FC 5
print("v1 params", 16*(27+1), 32*(9*16+1), 32*5+5, "total", 16*28+32*145+165, "shapes 64->64->32->32->16")
print("v1 flatten alt", 16*16*32, "fc", 16*16*32*5+5)
# 2 conv by hand: image 4x4, kernel 2x2 [[1,-1],[1,-1]] stride 2
I4 = [[3,1,0,2],[3,1,0,2],[5,5,1,1],[5,5,1,1]]; print("v2", xcorr(I4, [[1,-1],[1,-1]], s=2))
print("v2 s1", xcorr(I4, [[1,-1],[1,-1]]))
print("v3 rf conv5 s2 -> conv3 -> conv3", rf([(5,2),(3,1),(3,1)]))
print("v4 iou", iou((0,0,6,6),(2,0,8,6)))
print("v5 vit 256/16", (256//16)**2, "+1", (256//16)**2+1)
