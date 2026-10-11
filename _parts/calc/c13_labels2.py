import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from c13_exp import run_labels
run_labels(ks=(10, 20))
