// gyors node-szimuláció: naiv vs QAP hamis riasztás a w1 modelljével (zaj var 0,5)
global.document={createElement:()=>({getContext:()=>({})}),documentElement:{}};
global.window={GraphKit:{edgeKey:(a,b)=>a<b?a+"-"+b:b+"-"+a,normalize:p=>p,css:()=>"#000"}};
const fs=require("fs");
eval(fs.readFileSync(__dirname+"/../../grafelmelet-halozattudomany/arvizhet-data.js","utf8").replace(/window\./g,"global.window."));
let src=fs.readFileSync(__dirname+"/w0.js","utf8").replace("const W = {};","const W = {}; global.T={offdiag,pearson,naiveCorrP,randPerm,rng,zeros};"); eval(src+"})();");
const t=global.T, normal=R=>Math.sqrt(-2*Math.log(1-R()))*Math.cos(2*Math.PI*R());
for (const rho of [0,0.5,1,2]) { const R=t.rng(5+rho*10); let nv=0,nq=0; const n=20, reps=300;
  for(let e=0;e<reps;e++){ const u=[...Array(n)].map(()=>normal(R)), v=[...Array(n)].map(()=>normal(R)), X=t.zeros(n), Y=t.zeros(n);
    for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){X[i][j]=X[j][i]=rho*(u[i]+u[j])+Math.SQRT1_2*normal(R);Y[i][j]=Y[j][i]=rho*(v[i]+v[j])+Math.SQRT1_2*normal(R);}
    const a=t.offdiag(X), r=t.pearson(a,t.offdiag(Y)); if(t.naiveCorrP(r,a.length)<.05)nv++;
    let c=0; for(let k=0;k<199;k++) if(Math.abs(t.pearson(a,t.offdiag(Y,false,t.randPerm(n,R))))>=Math.abs(r)-1e-12)c++; if((c+1)/200<.05)nq++; }
  console.log("rho",rho,"naive",(nv/reps).toFixed(3),"qap",(nq/reps).toFixed(3)); }
