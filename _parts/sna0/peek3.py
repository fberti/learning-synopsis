import sys, rdata, numpy as np
d=sys.argv[1]
for n in ["Knecht_Class12b","Padgett_FlorentineFamilies","Zachary_KarateClub","Krackhardt_HighTech","Davis_SouthernWomen","Mainas_Terro","Rehnquist_SupremeCourt"]:
    o=rdata.read_rda(f"{d}/{n}.rda")[n]
    pi=o["ProjectInfo"]
    print("=====",n)
    for k,v in pi.items(): print("  ",k,":",str(v)[:600])
    if o.get("Attributes") is not None: print(o["Attributes"].head(4) if hasattr(o["Attributes"],"head") else o["Attributes"])
