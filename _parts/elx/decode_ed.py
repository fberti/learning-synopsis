import sys
def dec(s):
    out=[]
    for ch in s:
        if ch in ' \n\t\r\f': out.append(ch); continue
        try: b=ch.encode('cp1252')[0]
        except Exception: out.append(ch); continue
        if b>=0x80: v=288-b
        elif b>=0x21: v=160-b
        else: v=b
        out.append(chr(v) if 0x20<=v<0x7f else ch)
    return ''.join(out)
src,dst=sys.argv[1],sys.argv[2]
s=open(src,encoding='utf-8',errors='replace').read()
open(dst,'w',encoding='utf-8').write(dec(s))
