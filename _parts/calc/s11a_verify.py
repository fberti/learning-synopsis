"""Ch11 source digest A: numeric checks for DLV ch16-17 and HAW ch5.
Run: uv run -q --with numpy python -I _parts/calc/s11a_verify.py
"""
import numpy as np


def xcorr2d(x, k, stride=1):
    """Deep-learning 'convolution' = cross-correlation, no padding."""
    H, W = x.shape
    kh, kw = k.shape
    oh, ow = (H - kh) // stride + 1, (W - kw) // stride + 1
    out = np.zeros((oh, ow), dtype=float)
    for i in range(oh):
        for j in range(ow):
            out[i, j] = (x[i*stride:i*stride+kh, j*stride:j*stride+kw] * k).sum()
    return out


def conv2d_true(x, k):
    return xcorr2d(x, k[::-1, ::-1])


def out_size(n, k, p=0, s=1):
    return (n + 2*p - k) // s + 1


def pool(x, b=2, f=np.max, ceil=False):
    H, W = x.shape
    oh = -(-H // b) if ceil else H // b
    ow = -(-W // b) if ceil else W // b
    return np.array([[f(x[i*b:(i+1)*b, j*b:(j+1)*b]) for j in range(ow)] for i in range(oh)])


print("== HAW Fig 5-3: 8x8 image patch * Sobel kernel")
img = np.array([
    [60, 58, 60, 60, 60, 60, 60, 52],
    [68, 60, 60, 68, 68, 52, 76, 76],
    [76, 44, 60, 60, 68, 52, 60, 52],
    [68, 68, 76, 76, 68, 52, 60, 44],
    [92, 84, 84, 84, 76, 44, 60, 44],
    [76, 68, 84, 76, 76, 52, 60, 52],
    [68, 60, 60, 76, 84, 52, 84, 60],
    [60, 60, 68, 68, 68, 52, 76, 68]])
sob = np.array([[-1, -2, -1], [0, 0, 0], [1, 2, 1]])
patch = img[1:4, 1:4]
print("patch", patch.tolist(), "products", (patch*sob).tolist(), "sum", (patch*sob).sum())
print("true convolution (flipped kernel) at same spot:", (patch*sob[::-1, ::-1]).sum())
print("full 6x6 cross-correlation map:\n", xcorr2d(img, sob).astype(int))

print("== HAW Fig 5-5: 2x2 max pool of the 8x8 grid")
print(pool(img).astype(int))

print("== HAW LeNet kernel count (6,16,120 filters; 1 input channel)")
print("kernels:", 6*1 + 16*6 + 120*16, "| original LeNet-5 C3 connection table (60 kernels):", 6 + 60 + 1920)
# LeNet-5 classic param count (LeCun 1998 used 32x32 input, C1 5x5)
c1 = 6*(25+1); c3_full = 16*(6*25+1); c5 = 120*(16*25+1); f6 = 84*(120+1); out = 10*(84+1)
print("LeNet-5-style params with full C3, 5x5 kernels:", c1+c3_full+c5+f6+out,
      "(c1,c3,c5,f6,out)=", (c1, c3_full, c5, f6, out))
print("LeNet-5 shapes 32->", out_size(32, 5), "->pool", out_size(32, 5)//2, "->", out_size(14, 5),
      "->pool", out_size(14, 5)//2, "->", out_size(5, 5))
print("same with 28x28 MNIST input, no padding:", out_size(28, 5), out_size(28, 5)//2,
      out_size(12, 5), out_size(12, 5)//2, "-> 4x4 cannot take a 5x5 C5 without padding")

print("== HAW CIFAR-10 MLP params (1024-512-100-10)")
print(1024*512+512 + 512*100+100 + 100*10+10, "| steps/epoch", 50000//200, "| total", 100*50000//200)

print("== HAW ImageNet: random-guess error")
print("top-1:", 1-1/1000, " top-5:", 1-5/1000)

print("== HAW receptive field (two 3x3, stride 1): ", 3 + (3-1))

print("== DLV yellow detector R+G-B")
for name, rgb in {"yellow": (1, 1, 0), "white": (1, 1, 1), "red": (1, 0, 0), "black": (0, 0, 0),
                  "blue": (0, 0, 1), "orange": (1, .5, 0)}.items():
    r, g, b = rgb
    print(f"  {name:6s} {r+g-b:+.2f}")

print("== DLV Fig 16-12: vertical-stripe filter")
f = np.array([[-1, 1, -1]]*3)
a = np.array([[1, 1, 0], [0, 0, 0], [1, 0, 1]])
b = np.array([[0, 1, 0]]*3)
print("patch1", (f*a).sum(), "patch2", (f*b).sum(), "range over binary inputs:", -6, "..", 3,
      "(min:", (f*(f < 0)).sum(), "max:", (f*(f > 0)).sum(), ")")

print("== DLV Fig 16-27 pooling 4x4")
t = np.array([[3, 2, -3, 2], [1, 6, 20, 5], [4, -13, 2, 6], [-2, 3, 9, 3]])
print("avg", pool(t, f=np.mean).tolist(), "max", pool(t).tolist())

print("== DLV sizes")
print("7x7 * 3x3 valid ->", out_size(7, 3))
print("10x10 * 5x5 valid ->", out_size(10, 5), "| 'same' padding needed p=", (5-1)//2)
print("transposed: 3x3 + 2 rings ->", 3+4, "-> 3x3 conv ->", out_size(7, 3))
print("  1 zero between + 2 rings ->", 3+2+4, "->", out_size(9, 3))
print("  2 zeros between + 2 rings ->", 3+4+4, "->", out_size(11, 3))
print("Fig 16-32 9x6 block, 3x3 filter stride 3 ->", out_size(9, 3, s=3), "x", out_size(6, 3, s=3))
print("mask net 12 ->conv2x2", out_size(12, 2), "->pool(ceil)", -(-11//2), "->conv2x2", out_size(6, 2),
      "->pool(ceil)", -(-5//2), "->conv3x3", out_size(3, 3))
print("receptive field of mask net output on input:")
# rf recursion: r_out = r_in + (k-1)*jump ; jump *= s
r, j = 1, 1
for k, s in [(2, 1), (2, 2), (2, 1), (2, 2), (3, 1)]:
    r += (k-1)*j; j *= s
print("  RF =", r, "(of the 12x12 input)")

print("== DLV ch17 MNIST Keras net")
p1 = 32*(3*3*1+1); p2 = 64*(3*3*32+1); flat = 12*12*64; p3 = flat*128+128; p4 = 128*10+10
print("shapes 28->", out_size(28, 3), "->", out_size(26, 3), "->pool", out_size(26, 3)//2, "flat", flat)
print("params", p1, p2, p3, p4, "total", p1+p2+p3+p4, f"dense share {p3/(p1+p2+p3+p4):.1%}")
print("same flatten input as MLP on raw pixels: 784*128+128 =", 784*128+128)

print("== VGG16")
cfg = [(2, 64), (2, 128), (3, 256), (3, 512), (3, 512)]
H, C, tot, convp = 224, 3, 0, 0
for g, (n, f) in enumerate(cfg, 1):
    for _ in range(n):
        p = f*(3*3*C+1); convp += p; C = f
    H //= 2
    print(f"  group {g}: after pool {H}x{H}x{C}")
fc = [(7*7*512, 4096), (4096, 4096), (4096, 1000)]
fcp = sum(i*o+o for i, o in fc)
print("  conv params", convp, "fc params", fcp, "total", convp+fcp, f"fc share {fcp/(convp+fcp):.1%}")
print("  first FC alone", 7*7*512*4096+4096)
print("  weight layers:", sum(n for n, _ in cfg) + 3)
r, j = 1, 1
for n, _ in cfg:
    for _ in range(n):
        r += 2*j
    r += 1*j; j *= 2
print("  RF of last conv/pool unit:", r)
print("  two 3x3 vs one 5x5 (C->C, C=64, no bias):", 2*9*64*64, "vs", 25*64*64,
      "| three 3x3 vs 7x7:", 3*9, "C^2 vs", 49, "C^2")

print("== AlexNet (single-tower view, 227 input)")
print("conv1 out", out_size(227, 11, s=4), "| with 224 input:", (224-11)/4+1, "(not an integer -> paper's 224 is a known inconsistency)")
alex = [(11, 3, 96), (5, 96, 256), (3, 256, 384), (3, 384, 384), (3, 384, 256)]
cp = sum(o*(k*k*i+1) for k, i, o in alex)
fp = (6*6*256)*4096+4096 + 4096*4096+4096 + 4096*1000+1000
print("  params (no grouping)", cp+fp, " conv", cp, " fc", fp)

print("== Adversarial: perturbation +-2 on 0..255 scale =", f"{2/255:.2%}")
print("== Output size formula sanity: n=32,k=5,p=0,s=1 ->", out_size(32, 5), "; n=224,k=7,p=3,s=2 ->",
      out_size(224, 7, 3, 2), "; n=5,k=3,p=1,s=2 ->", out_size(5, 3, 1, 2))
print("== Small hand example for the chapter: 5x5 vertical edge * Sobel-x / Prewitt")
e = np.array([[0, 0, 9, 9, 9]]*5)
kx = np.array([[-1, 0, 1]]*3)
print(xcorr2d(e, kx).astype(int))
print("  true convolution (flipped) gives:\n", conv2d_true(e, kx).astype(int))
