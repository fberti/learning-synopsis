// readout
const M = {
  metanol: [["C","O"],[[0,1]]], etanol: [["C","C","O"],[[0,1],[1,2]]], dme: [["C","O","C"],[[0,1],[1,2]]],
  propan: [["C","C","C"],[[0,1],[1,2]]], ciklo: [["C","C","C"],[[0,1],[1,2],[2,0]]],
  glioxal: [["O","C","C","O"],[[0,1],[1,2],[2,3]]], benzol: [Array(6).fill("C"),[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]]],
  ket: [Array(6).fill("C"),[[0,1],[1,2],[2,0],[3,4],[4,5],[5,3]]] };
function layers(m,k){const [at,E]=m;let H=at.map(a=>a==="C"?[1,0]:[0,1]);const n=at.length;
 for(let t=0;t<k;t++){const N=H.map(v=>v.slice());E.forEach(([u,v])=>{for(let i=0;i<2;i++){N[u][i]+=H[v][i];N[v][i]+=H[u][i];}});H=N;}return H;}
const ro={sum:H=>[0,1].map(i=>H.reduce((s,v)=>s+v[i],0)),mean:H=>[0,1].map(i=>H.reduce((s,v)=>s+v[i],0)/H.length),max:H=>[0,1].map(i=>Math.max(...H.map(v=>v[i])))};
for(const [a,b] of [["metanol","glioxal"],["etanol","dme"],["benzol","ket"],["propan","ciklo"]]) for(let k=0;k<3;k++){
  const Ha=layers(M[a],k),Hb=layers(M[b],k);
  console.log(a,b,k,JSON.stringify(Ha),JSON.stringify(Hb),Object.keys(ro).map(r=>r+":"+JSON.stringify(ro[r](Ha))+"|"+JSON.stringify(ro[r](Hb))).join(" "));}
// oversmoothing
const E=[[0,1],[0,2],[1,2],[1,3],[3,4]];const n=5;
const Adj=Array.from({length:n},(_,i)=>{const r=Array(n).fill(0);r[i]=1;return r});E.forEach(([u,v])=>{Adj[u][v]=1;Adj[v][u]=1});
const Mm=Adj.map(r=>{const s=r.reduce((a,b)=>a+b);return r.map(v=>v/s)});
const x=[1,0,0,0,5];const std=h=>{const m=h.reduce((a,b)=>a+b)/h.length;return Math.sqrt(h.reduce((s,v)=>s+(v-m)**2,0)/h.length)};
const step=(h,al)=>Mm.map((r,i)=>(1-al)*r.reduce((s,v,j)=>s+v*h[j],0)+al*x[i]);
for(const al of [0,0.1]){let h=x.slice();const out=[];for(let k=0;k<=200;k++){if([0,1,5,10,20,30,200].includes(k))out.push(k+":"+std(h).toFixed(4)+(k<=1||k==200?" "+h.map(v=>v.toFixed(3)).join(","):""));h=step(h,al);}console.log("alpha",al,out.join(" | "));}
