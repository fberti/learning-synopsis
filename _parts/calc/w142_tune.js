const A=require("./w142_harness.js");
const zr=rng(999), Z=Float64Array.from({length:2000},()=>A.w2Gauss(zr));
function evalG(S){const x=A.w2Fwd(S.G,Z).out;const n=x.length;const m=x.reduce((a,b)=>a+b,0)/n;const sd=Math.sqrt(x.reduce((a,b)=>a+(b-m)**2,0)/n);
 const C=A.W2_DATA[S.data].comp.map(c=>c[1]);const fr=C.map(c=>x.filter(v=>Math.abs(v-c)<1).length/n);return {m,sd,fr};}
const [data,lr,dS,act,steps,loss]=[process.argv[2],+process.argv[3],+process.argv[4],process.argv[5],+process.argv[6],process.argv[7]||"ns"];
const seeds=(process.argv[8]||"1,2,3,4,5,6,7,8,9,10").split(",").map(Number);
const cps=(process.env.CP||"500,1000,2000,3000").split(",").map(Number);
for(const seed of seeds){const S=A.w2GanNew({data,loss,lr,dSteps:dS,act,seed,batch:64});let line=`seed ${seed}:`;
 for(let t=1;t<=steps;t++){A.w2GanStep(S);if(cps.includes(t)){const e=evalG(S);line+=` | ${t}: m=${e.m.toFixed(2)} sd=${e.sd.toFixed(2)} [${e.fr.map(f=>(100*f).toFixed(0)).join("/")}] D=${S.hist[t-1][0].toFixed(2)}`;}}
 console.log(line);}
