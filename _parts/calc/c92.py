import itertools
def run(data, eta=1.0, w=(0,0), b=0, rule="gt", maxep=20, verbose=False):
    w=list(w); seen={}
    upd=0; hist=[]
    for ep in range(1,maxep+1):
        errs=0
        for x,y in data:
            z=w[0]*x[0]+w[1]*x[1]+b
            yh = (1 if z>0 else 0) if rule=="gt" else (1 if z>=0 else 0)
            d=y-yh
            if verbose: print(f" ep{ep} x={x} y={y} z={z:g} yh={yh}", end="")
            if d:
                errs+=1; upd+=1
                w[0]+=eta*d*x[0]; w[1]+=eta*d*x[1]; b+=eta*d
                if verbose: print(f" -> w={w} b={b}")
            elif verbose: print()
        st=(tuple(w),b); hist.append((ep,errs,tuple(w),b))
        if errs==0: return ep, upd, w, b, hist
        if st in seen and verbose: print("CYCLE: state at end of ep",ep,"== end of ep",seen[st])
        seen.setdefault(st,ep)
    return None, upd, w, b, hist
X=[(0,0),(0,1),(1,0),(1,1)]
AND=list(zip(X,[0,0,0,1])); OR=list(zip(X,[0,1,1,1])); XOR=list(zip(X,[0,1,1,0]))
for rule in ("gt","ge"):
  for eta in (1,0.5):
    for nm,d in (("AND",AND),("OR",OR)):
        r=run(d,eta=eta,rule=rule); print(rule,eta,nm,"epochs",r[0],"updates",r[1],"w",r[2],"b",r[3])
print("--- AND trace gt eta1"); run(AND,verbose=True)
print("--- OR trace gt eta1"); run(OR,verbose=True)
print("--- XOR trace"); r=run(XOR,verbose=True,maxep=6)
# order dependence
print("--- AND reversed order"); r=run(AND[::-1],verbose=False); print(r[:4])
