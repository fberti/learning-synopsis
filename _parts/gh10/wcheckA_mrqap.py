import sys; sys.argv=[sys.argv[0]]
exec(open("calc3.py").read().split("np.set_printoptions")[0])
np.set_printoptions(precision=4,suppress=True)
ten=att["TENURE"].values.astype(float); TR=np.tile(ten,(21,1)); np.fill_diagonal(TR,0)
for name,Xs in {"fr":[fr],"fr+rep":[fr,rep],"fr+rep+same":[fr,rep,same],"fr+rep+ten":[fr,rep,TR],"all4":[fr,rep,same,TR]}.items():
    o=mrqap(adv,Xs,runs=2000); print(name,{k:np.round(v,4) for k,v in o.items()})
