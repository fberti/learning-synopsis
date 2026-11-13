const A=require("./w142_harness.js");
const zr=rng(999), Z=Float64Array.from({length:500},()=>A.w2Gauss(zr));
const [loss,off,dS,lr]=[process.argv[2],+process.argv[3],+process.argv[4],+(process.argv[5]||0.003)];
let r=[];
for(let seed=1;seed<=8;seed++){const S=A.w2GanNew({data:"one",loss,lr,dSteps:dS,act:"leaky",seed,batch:64});S.G.L[S.G.L.length-1].b[0]+=off;
 let hit=-1;for(let t=1;t<=3000;t++){A.w2GanStep(S);if(t%10===0){const x=A.w2Fwd(S.G,Z).out;const m=x.reduce((a,b)=>a+b,0)/x.length;if(m>1.5){hit=t;break;}}}
 r.push(hit);}
console.log(`${loss} off${off} dS${dS} lr${lr}: steps to mean>1.5: ${r.join(" ")}`);
