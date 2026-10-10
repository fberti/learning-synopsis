import numpy as np, json, warnings
warnings.filterwarnings("ignore")
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPClassifier
from sklearn.linear_model import LogisticRegression
d = load_digits(); X = d.data/16.0; y = d.target
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)
m = MLPClassifier(hidden_layer_sizes=(16,), activation="relu", solver="adam", alpha=1e-3, max_iter=3000, random_state=1).fit(Xtr, ytr)
W1=m.coefs_[0].T.round(3); b1=m.intercepts_[0].round(3); W2=m.coefs_[1].T.round(3); b2=m.intercepts_[1].round(3)
def fwd(x):
    h=np.maximum(0,W1@x+b1); z=W2@h+b2; p=np.exp(z-z.max()); return h,z,p/p.sum()
pred=np.array([fwd(x)[2].argmax() for x in Xte]); acc=(pred==yte).mean()
print("sk acc",m.score(Xte,yte),"rounded acc",acc,"train",m.score(Xtr,ytr))
print("params", W1.size+b1.size+W2.size+b2.size)
lr = LogisticRegression(max_iter=5000).fit(Xtr, ytr); print("LR",lr.score(Xte,yte))
from sklearn.metrics import confusion_matrix
cm=confusion_matrix(yte,pred); print(cm)
wrong=np.where(pred!=yte)[0]; print("wrong idx",wrong, "true",yte[wrong],"pred",pred[wrong])
# sample digits: 4 per class from test (incl. some wrong)
rng=np.random.default_rng(3); idx=[]
for k in range(10): idx+=list(rng.choice(np.where(yte==k)[0],4,replace=False))
idx+= [i for i in wrong[:6] if i not in idx]
Xi=(Xte[idx]*16).round().astype(int)
# worked example: first sample of class 3
i0=idx[12]; h,z,p=fwd(Xte[i0]); print("example true",yte[i0],"img\n",(Xte[i0]*16).astype(int).reshape(8,8))
print("h",h.round(2),"active",int((h>0).sum())); print("z",z.round(2)); print("p",p.round(3))
top=np.argsort(-p)[:3]; print("top",top,p[top].round(4))
json.dump({"W1":W1.tolist(),"b1":b1.tolist(),"W2":W2.tolist(),"b2":b2.tolist(),"acc":float(acc),"accLR":float(lr.score(Xte,yte)),
  "test":{"X":Xi.tolist(),"y":yte[idx].tolist()},"ex":int(len(idx) and 12)}, open("ch9/digit-net.json","w"), separators=(",",":"))
# mean image per class
print("ntest",len(yte))
