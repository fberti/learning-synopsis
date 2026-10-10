import sys, re
# usage: s10b_find.py file regex  -> prints page number (1-based) and line
txt = open(sys.argv[1], encoding='utf-8', errors='replace').read()
pages = txt.split('\f')
rx = re.compile(sys.argv[2])
for i, p in enumerate(pages, 1):
    for line in p.splitlines():
        if rx.search(line):
            print(i, line.strip()[:110])
