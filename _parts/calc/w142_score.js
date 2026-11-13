const A=require("./w142_harness.js");
const zr=rng(999), Z=Float64Array.from({length:1000},()=>A.w2Gauss(zr));
const [data,lr,dS,act,steps,loss]=[process.argv[2],+process.argv[3],+process.argv[4],process.argv[5],+process.argv[6],process.argv[7]||"ns"];
const seeds=(process.argv[8]||"1,2,3,4,5,6,7,8").split(",").map(Number);
const C=A.W2_DATA[data].comp;
let tot=0,cnt=0;const per=[];
for(const seed of seeds){const S=A.w2GanNew({data,loss,lr,dSteps:dS,act,seed,batch:+(process.env.B||64),dMul:+(process.env.DM||1)});let good=0,n=0,first=-1;
 for(let t=1;t<=steps;t++){A.w2GanStep(S);if(t%250===0){const x=A.w2Fwd(S.G,Z).out;
   let ok;
   if(data==="one"){const m=x.reduce((a,b)=>a+b,0)/x.length,sd=Math.sqrt(x.reduce((a,b)=>a+(b-m)**2,0)/x.length);ok=Math.abs(m-2)<0.2&&Math.abs(sd-0.5)<0.15;}
   else{const fr=C.map(c=>x.filter(v=>Math.abs(v-c[1])<1).length/x.length);ok=fr.every(f=>Math.abs(f-c0(C))<0.12);}
   if(ok&&first<0)first=t; if(t>=steps/3){n++;good+=ok;}}}
 per.push(`${seed}:${(good/n*100).toFixed(0)}%@${first}`);tot+=good/n;cnt++;}
function c0(C){return C[0][0];}
console.log(`${data} lr=${lr} dS=${dS} ${act} ${loss}: mean good ${(100*tot/cnt).toFixed(0)}%  `+per.join(" "));
