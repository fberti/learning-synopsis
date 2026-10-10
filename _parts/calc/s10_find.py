import sys,re
txt=open(sys.argv[1]).read().split('\f')
pat=re.compile(sys.argv[2])
for i,p in enumerate(txt):
    head='\n'.join(p.strip().split('\n')[:4])
    if pat.search(head): print(i+1, repr(head[:150]))
