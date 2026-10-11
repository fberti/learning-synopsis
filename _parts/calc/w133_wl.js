const fs=require("fs");const src=fs.readFileSync(__dirname+"/../ch13/w3.js","utf8");
const a=src.indexOf("  const W3_RUN ="), b=src.indexOf("  W[\"wl-test\"]");
const hexRGB=()=>[0,0,0],mix=()=>"",css=()=>"";
const w3Poly = (n, cx, cy, R, a0) => Array.from({ length: n }, (_, i) => [cx + R * Math.cos(a0 + 2 * Math.PI * i / n), cy + R * Math.sin(a0 + 2 * Math.PI * i / n)]);
const w3Cycle = (n, off = 0) => Array.from({ length: n }, (_, i) => [off + i, off + (i + 1) % n]);
eval(src.slice(a,b)+";globalThis.P=W3_WLP;globalThis.S=w3WLStep;");
for(const [k,p] of Object.entries(P)){let cols=p.G.map(G=>G.xy.map(()=>0)),id=1;console.log("==",k, p.G.map(G=>G.edges.length+" él, fok "+G.xy.map((_,i)=>G.edges.filter(e=>e.includes(i)).length).join("")).join(" | "));
 for(let s=1;s<6;s++){const r=S(p.G,cols,id);cols=r.cols;id=r.nextId;
  const cls=p.G.map((G,g)=>{const m={};cols[g].forEach((c,i)=>{(m[c]=m[c]||[]).push(G.names?G.names[i]:i)});return JSON.stringify(m)});
  console.log(s,r.split?"split":"STABLE",cls.join("  ||  "));if(!r.split)break;}}
