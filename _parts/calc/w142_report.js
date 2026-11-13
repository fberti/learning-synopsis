const A=require("./w142_harness.js");
const zr=rng(999), Z=Float64Array.from({length:2000},()=>A.w2Gauss(zr));
const rr=rng(777); const RX=A.w2Real(process.argv[2],rr,4000);
const [data,loss,dS,seed,far,steps,every]=[process.argv[2],process.argv[3],+process.argv[4],+process.argv[5],process.argv[6]==="far",+process.argv[7],+process.argv[8]];
const S=A.w2GanNew({data,loss,lr:0.003,dSteps:dS,act:"leaky",seed,batch:64,far});
const C=A.W2_DATA[data].comp;
const sg=v=>1/(1+Math.exp(-v));
const st=()=>{const x=A.w2Fwd(S.G,Z).out;const n=x.length;const m=x.reduce((a,b)=>a+b,0)/n,sd=Math.sqrt(x.reduce((a,b)=>a+(b-m)**2,0)/n);
 const fr=C.length>1?"["+C.map(c=>(100*x.filter(v=>Math.abs(v-c[1])<1).length/n).toFixed(0)).join("/")+"]":"";
 const dg=A.w2Fwd(S.D,x).out.reduce((a,v)=>a+sg(v),0)/n;const g=S.hist.length?S.hist.slice(-50).reduce((a,h)=>a+h[2],0)/Math.min(50,S.hist.length):0;
 return `${m.toFixed(2)}/${sd.toFixed(2)}${fr} Dg${dg.toFixed(3)} g${g.toExponential(1)}`;};
let s=`0:${st()}\n`;
for(let t=1;t<=steps;t++){A.w2GanStep(S);if(t%every===0)s+=`${t}:${st()}\n`;}
console.log(`== ${data} ${loss} dS${dS} seed${seed} ${far?"far":""}\n`+s);
