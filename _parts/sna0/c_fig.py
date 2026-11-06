import sys, tarfile, rdata, numpy as np
print(rdata.__version__ if hasattr(rdata,'__version__') else '')
print([n for n in dir(rdata) if not n.startswith('_')])
with tarfile.open(sys.argv[1]) as tf:
    for m in tf.getmembers():
        if m.name.endswith('.rda') and ('ASNR_' in m.name or 'MAT_' in m.name or 'Greenacre' in m.name):
            raw = tf.extractfile(m).read()
            parsed = rdata.parser.parse_data(raw)
            conv = rdata.conversion.convert(parsed)
            for k,v in conv.items():
                print(m.name, k, type(v).__name__, list(v.keys()) if isinstance(v,dict) else getattr(v,'shape',None))
