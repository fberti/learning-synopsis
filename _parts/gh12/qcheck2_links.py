# q2.js xref-horgonyainak ellenőrzése: python3 -I qcheck2_links.py
import re, os
here=os.path.dirname(os.path.abspath(__file__)); base=os.path.join(here,"../../grafelmelet-halozattudomany/12-gnn-heterogen-idobeli/")
parts=["00-head.html","01-s121.html","02-s122.html","03-s123.html","04-s124.html","05-s125.html","06-s126.html","07-s127.html","10-end.html"]
page="".join(open(os.path.join(here,p),encoding="utf-8").read() for p in parts)
ids=lambda s:set(re.findall(r'id="([^"]+)"',s))
own=ids(page); q=open(os.path.join(here,"q2.js"),encoding="utf-8").read(); bad=0; n=0
for href in re.findall(r'href="([^"]+)"',q):
    n+=1; path,_,frag=href.partition("#")
    tgt=own if not path else ids(open(os.path.normpath(os.path.join(base,path,"index.html")),encoding="utf-8").read())
    if frag not in tgt: bad+=1; print("HIBA",href)
for m in re.finditer(r'(options|items|pairs): \[[\s\S]*?\]\s*,\n\s*(answer|hint)',q):
    if "<a " in m.group(0): bad+=1; print("link opcióban")
print(n,"link,",bad,"hiba")
# link nélküli szakaszhivatkozás gyanú
for m in re.finditer(r'(?<![">#\w])1[0-2]\.\d(?![\d<])',re.sub(r'<a [^>]*>.*?</a>','',q)): print("gyanús:",q[max(0,m.start()-40):m.end()+10].replace("\n"," "))
