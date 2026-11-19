from common import *
from scipy import stats
import sys
sys.argv=["x"]
exec(open("calc3.py").read().split("np.set_printoptions")[0])
R=np.random.default_rng(2024)
o=mrqap(adv,[fr,rep],runs=10000); print({k:np.round(v,4) for k,v in o.items()})
o=mrqap(adv,[fr],runs=10000); print({k:np.round(v,4) for k,v in o.items()})
