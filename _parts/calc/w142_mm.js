const A=require("./w142_harness.js");
const zr=rng(999), Z=Float64Array.from({length:2000},()=>A.w2Gauss(zr));
const [loss,preD,off,seed,dS]=[process.argv[2],+process.argv[3],+process.argv[4],+process.argv[5],+(process.argv[6]||1)];
const S=A.w2GanNew({data:"one",loss,lr:0.003,dSteps:dS,act:"leaky",seed,batch:64});
S.G.L[S.G.L.length-1].b[0]+=off;S.step=0;
// pretrain D: G update skipped
const lr=S.lr; 
for(let k=0;k<preD;k++){const save=S.dSteps;S.dSteps=1;const sv=S.G.L.map(L=>[L.W.slice(),L.b.slice()]);const t=S.G.t;const mv=S.G.L.map(L=>[L.mW.slice(),L.vW.slice(),L.mb.slice(),L.vb.slice()]);A.w2GanStep(S);S.G.L.forEach((L,i)=>{L.W.set(sv[i][0]);L.b.set(sv[i][1]);L.mW.set(mv[i][0]);L.vW.set(mv[i][1]);L.mb.set(mv[i][2]);L.vb.set(mv[i][3]);});S.G.t=t;S.dSteps=save;}
S.step=0;S.hist=[];
let s="";const stat=()=>{const x=A.w2Fwd(S.G,Z).out;const m=x.reduce((a,b)=>a+b,0)/x.length;const dg=A.w2Fwd(S.D,x).out.reduce((a,v)=>a+1/(1+Math.exp(-v)),0)/x.length;return `m${m.toFixed(2)} D${dg.toFixed(3)}`};
s+="0:"+stat()+" ";
for(let t=1;t<=1500;t++){A.w2GanStep(S);if([25,50,100,200,400,800,1500].includes(t)){const g=S.hist.slice(-25).reduce((a,h)=>a+h[2],0)/25;s+=`${t}:${stat()} g${g.toExponential(1)} | `;}}
console.log(`${loss} preD${preD} off${off} seed${seed} dS${dS}: ${s}`);
