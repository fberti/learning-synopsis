const A=require("./w142_harness.js");
const zr=rng(999), Z=Float64Array.from({length:2000},()=>A.w2Gauss(zr));
const [data,lr,dS,act,steps,loss]=[process.argv[2],+process.argv[3],+process.argv[4],process.argv[5],+process.argv[6],process.argv[7]];
const seeds=(process.argv[8]||"1,2,3,4,5,6,7,8,9,10,11,12").split(",").map(Number);
const C=A.W2_DATA[data].comp;const cps=(process.env.CP||"1000,2000,3000,4000,5000").split(",").map(Number);
let out=[];let nCol=0,nOk=0;
for(const seed of seeds){const S=A.w2GanNew({data,loss,lr,dSteps:dS,act,seed,batch:64,dMul:+(process.env.DM||1)});let s=`${seed}:`;let fr;
 for(let t=1;t<=steps;t++){A.w2GanStep(S);if(cps.includes(t)){const x=A.w2Fwd(S.G,Z).out;fr=C.map(c=>x.filter(v=>Math.abs(v-c[1])<1).length/x.length);s+=fr.map(f=>(100*f).toFixed(0)).join("/")+" ";}}
 const col=fr.some(f=>f<0.03), ok=fr.every(f=>f>0.25);nCol+=col;nOk+=ok;out.push(s+(col?"COLLAPSE":ok?"ok":"?"));}
console.log(`${data} lr=${lr} dS=${dS} ${act} ${loss} DM=${process.env.DM||1}: collapse ${nCol}/${seeds.length}, ok ${nOk}/${seeds.length}\n   `+out.join("\n   "));
