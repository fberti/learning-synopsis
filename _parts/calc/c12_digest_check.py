# Ellenőrző számítások a ch12 forrás-digesthez (FLLM/HGA/MLSYS számok)
import math
def bert(V,P,S,d,L,ff):
    emb=V*d+P*d+S*d+2*d
    layer=4*(d*d+d)+2*d + (d*ff+ff)+(ff*d+d)+2*d
    pool=d*d+d
    return emb+L*layer+pool
print("BERT-base", bert(30522,512,2,768,12,3072)/1e6)
print("BERT-large", bert(30522,512,2,1024,24,4096)/1e6)
def gpt(V,P,d,L): # GPT-2 style, tied, ff=4d
    return V*d+P*d+L*(12*d*d+13*d)+2*d
print("GPT-2 XL", gpt(50257,1024,1600,48)/1e9)
print("GPT-2 small", gpt(50257,1024,768,12)/1e6)
print("GPT-3 approx 12Ld^2", 12*96*12288**2/1e9)
# HGA attention table (entries, FP32 bytes)
for n in [2048,8192,32768,131072,2**20]:
    print(n, n*n/1e6,"M entries", n*n*4/2**20,"MiB", n*n*4/1e9,"GB")
print("128K=128000:",128000**2/1e9,"G entries", 128000**2*4/1e9,"GB")
print("n=8192 bf16 per head MB", 8192**2*2/1e6, "x32 GB", 8192**2*2*32/1e9)
print("n=32768 bf16 GB", 32768**2*2/1e9)
n,d=4096,128
fl=4*n*n*d; print("attn GFLOP",fl/1e9)
mem=2*n*d*2 + n*n*2*3 + n*n*2 + n*d*2 + n*d*2
print("naive MB approx", (2*n*d*2 + n*n*2 + n*n*2 + n*n*2 + n*n*2+n*d*2 + n*d*2)/1e6)
print("I naive", fl/138e6, "ridge", 312e12/2e12, "flash I", fl/(4*n*d*2))
print("KV/token llama3-70B", 2*80*8*128*2, "x4096 GB", 2*80*8*128*2*4096/1e9)
print("KV llama3-8B per token", 2*32*8*128*2, "MHA would be", 2*32*32*128*2)
print("prefix 128 users GB", 128*1000*327680/1e9)
print("Llama3 emb", 128256*4096/1e6, "share of 8.03B", 128256*4096/8.03e9)
print("ALiBi slopes H=8", [2**(-8*h/8) for h in range(1,9)])
# sinusoidal PE toy d=4
def pe(pos,d=4):
    out=[]
    for i in range(d//2):
        w=pos/10000**(2*i/d); out+= [math.sin(w), math.cos(w)]
    return out
for p in range(4): print("PE",p,[round(x,4) for x in pe(p)])
# RoPE theta_k d=8 and NTK lambda
d=8; print("theta", [10000**(-2*k/d) for k in range(d//2)])
print("NTK lambda s=4 d=128", 4**(128/126))
print("periods d=128 first/last", 2*math.pi, 2*math.pi*10000**(126/128))
# RNN example
print("RNN weights", 100*128, 128*128, 100*128+128*128)
# Chinchilla loss at 70B, 1.4T
N,D=70e9,1.4e12; print("Chinchilla L", 406.4/N**0.34+410.7/D**0.28+1.69)
print("Kaplan L(N=1.5e9)", (1.5e9/8.8e13)**-0.076)
print("AlexNet->GPT3", 175e9/62e6)
print("TPU 128x128", 128*128, "256x256", 256*256)
print("GPT-3 params bytes fp16 GB", 175e9*2/1e9, "fp32", 175e9*4/1e9)
print("softmax sqrt(dk) demo: var of q.k dk=64 ->", 64, "std", 8)
