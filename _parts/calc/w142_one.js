const A=require("./w142_harness.js");
const zr=rng(999), Z=Float64Array.from({length:2000},()=>A.w2Gauss(zr));
const [lr,dS,steps,loss]=[+process.argv[2],+process.argv[3],+process.argv[4],process.argv[5]];
const seeds=(process.argv[6]||"1,2,3,4,5,6,7,8,9,10,11,12").split(",").map(Number);
const cps=(process.env.CP||"500,1000,2000,3000,4000").split(",").map(Number);let res=[],good=0;
for(const seed of seeds){const S=A.w2GanNew({data:"one",loss,lr,dSteps:dS,act:"leaky",seed,batch:64});let s=`${seed}:`,m,sd;
 for(let t=1;t<=steps;t++){A.w2GanStep(S);if(cps.includes(t)){const x=A.w2Fwd(S.G,Z).out;m=x.reduce((a,b)=>a+b,0)/x.length;sd=Math.sqrt(x.reduce((a,b)=>a+(b-m)**2,0)/x.length);s+=`${m.toFixed(2)}/${sd.toFixed(2)} `;}}
 const ok=Math.abs(m-2)<0.25&&sd>0.3&&sd<0.75;good+=ok;res.push(s+(ok?"ok":"X"));}
console.log(`one lr=${lr} dS=${dS} ${loss}: ok ${good}/${seeds.length}\n   `+res.join("\n   "));
