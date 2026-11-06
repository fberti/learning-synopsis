import sys, rdata, numpy as np
for p in sys.argv[1:]:
    conv = rdata.read_rda(p)
    for name, obj in conv.items():
        print("=====", name, type(obj).__name__)
        if isinstance(obj, dict):
            for k, v in obj.items():
                if isinstance(v, dict):
                    print(" ", k, "dict:", {kk: (type(vv).__name__, getattr(vv,'shape',None)) for kk, vv in v.items()})
                else:
                    print(" ", k, type(v).__name__, getattr(v, 'shape', None), (str(v)[:300] if not hasattr(v,'shape') or k in ('ProjectInfo','NetworkInfo') else ''))
