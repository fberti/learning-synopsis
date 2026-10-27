import numpy as np
def cov(x,y): return ((x-x.mean())*(y-y.mean())).mean()
def r(x,y): return cov(x,y)/x.std()/y.std()
def svg(x,y,title,W=170,H=130,xr=None,yr=None,extra=""):
    x=np.array(x,float);y=np.array(y,float)
    x0,x1=xr or (x.min()-(np.ptp(x))*0.08, x.max()+np.ptp(x)*0.08); y0,y1=yr or (y.min()-np.ptp(y)*0.08,y.max()+np.ptp(y)*0.08)
    L,R,T,B=12,W-6,8,H-22
    X=lambda v:L+(v-x0)/(x1-x0)*(R-L); Y=lambda v:B-(v-y0)/(y1-y0)*(B-T)
    s=[f'<svg viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-label="{title}" style="max-width:100%">',
       f'<path d="M{L} {T} V{B} H{R}" fill="none" style="stroke:var(--muted)"/>']
    s.append(extra.format(X=X,Y=Y) if callable(extra) else extra)
    for a,b in zip(x,y): s.append(f'<circle cx="{X(a):.1f}" cy="{Y(b):.1f}" r="3" style="fill:var(--accent)"/>')
    s.append(f'<text x="{W/2}" y="{H-6}" text-anchor="middle" font-size="11" style="fill:var(--text)">{title}</text></svg>')
    return "".join(s)
rng=np.random.default_rng(7); n=30
x=rng.uniform(0,10,n)
out=[]
y=2+0.8*x+rng.normal(0,0.7,n); out.append(("pozitív, lineáris, szoros",x,y))
y=8-0.4*x+rng.normal(0,2.2,n); out.append(("negatív, lineáris, laza",x,y))
y=(x-5)**2/3+rng.normal(0,0.6,n); out.append(("görbe (nem lineáris)",x,y))
y=rng.normal(5,2,n); out.append(("nincs kapcsolat",x,y))
html=[]
for t,a,b in out:
    print(t, round(r(a,b),3)); html.append(svg(a,b,t))
open("../ms3/svg4.html","w").write('<div class="svgrow" style="display:flex;flex-wrap:wrap;gap:.6rem;justify-content:center">'+"".join(html)+"</div>\n")
# students with mean lines
x=np.array([1,2,3,4,5.]); y=np.array([52,56,62,62,68.])
W,H=300,200; L,R,T,B=40,W-10,10,H-30; x0,x1,y0,y1=0,6,45,75
X=lambda v:L+(v-x0)/(x1-x0)*(R-L); Y=lambda v:B-(v-y0)/(y1-y0)*(B-T)
s=[f'<svg viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-label="Tanulási idő és pontszám" style="max-width:100%">']
for v in range(1,6): s.append(f'<text x="{X(v):.1f}" y="{B+14}" text-anchor="middle" font-size="11" style="fill:var(--muted)">{v}</text>')
for v in (50,60,70): s.append(f'<text x="{L-6}" y="{Y(v)+4:.1f}" text-anchor="end" font-size="11" style="fill:var(--muted)">{v}</text>')
s.append(f'<text x="{R}" y="{H-4}" text-anchor="end" font-size="11" style="fill:var(--muted)">óra (x)</text><text x="{L+4}" y="{T+8}" font-size="11" style="fill:var(--muted)">pont (y)</text>')
s.append(f'<path d="M{L} {T} V{B} H{R}" fill="none" style="stroke:var(--muted)"/>')
s.append(f'<line x1="{X(3):.1f}" y1="{T}" x2="{X(3):.1f}" y2="{B}" stroke-dasharray="5 4" style="stroke:var(--setB)"/>')
s.append(f'<line x1="{L}" y1="{Y(60):.1f}" x2="{R}" y2="{Y(60):.1f}" stroke-dasharray="5 4" style="stroke:var(--setB)"/>')
s.append(f'<text x="{X(3)+4:.1f}" y="{T+10}" font-size="11" style="fill:var(--setB)">x̄ = 3</text><text x="{R-2}" y="{Y(60)-4:.1f}" text-anchor="end" font-size="11" style="fill:var(--setB)">ȳ = 60</text>')
for q,(qx,qy) in {"I. (+)":(4.9,73),"II. (−)":(2.0,73),"III. (+)":(1.1,47),"IV. (−)":(4.9,47)}.items():
    s.append(f'<text x="{X(qx):.1f}" y="{Y(qy):.1f}" text-anchor="middle" font-size="11" style="fill:var(--muted)">{q}</text>')
for a,b in zip(x,y): s.append(f'<circle cx="{X(a):.1f}" cy="{Y(b):.1f}" r="4.5" style="fill:var(--accent)"/>')
s.append('</svg>')
open("../ms3/svg-students.html","w").write("".join(s)+"\n")
