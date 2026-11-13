const A=require("./w142_harness.js");
const zr=rng(999), Z=Float64Array.from({length:1000},()=>A.w2Gauss(zr));
const [data,lr,dS,act,steps,loss,seed,every]=[process.argv[2],+process.argv[3],+process.argv[4],process.argv[5],+process.argv[6],process.argv[7],+process.argv[8],+(process.argv[9]||250)];
const S=A.w2GanNew({data,loss,lr,dSteps:dS,act,seed,batch:+(process.env.B||64),dMul:+(process.env.DM||1)});
const C=A.W2_DATA[data].comp;let s="";
for(let t=1;t<=steps;t++){A.w2GanStep(S);if(t%every===0){const x=A.w2Fwd(S.G,Z).out;const m=x.reduce((a,b)=>a+b,0)/x.length,sd=Math.sqrt(x.reduce((a,b)=>a+(b-m)**2,0)/x.length);
 const fr=C.map(c=>x.filter(v=>Math.abs(v-c[1])<1).length/x.length);const g=S.hist.slice(-every).reduce((a,h)=>a+h[2],0)/every;
 s+=`${t}:${m.toFixed(2)}/${sd.toFixed(2)}[${fr.map(f=>(100*f).toFixed(0)).join("/")}]g${g.toFixed(3)} `;}}
console.log(`${data} lr${lr} dS${dS} ${loss} seed${seed}: `+s);
