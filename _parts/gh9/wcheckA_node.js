// node wcheckA_node.js – a w1 számolásainak ellenőrzése (w0 + w1, böngésző nélkül)
global.document={createElement:()=>({getContext:()=>({})}),documentElement:{},querySelectorAll:()=>[],addEventListener:()=>{}};
global.window={GraphKit:{edgeKey:(a,b)=>a<b?a+"-"+b:b+"-"+a,normalize:p=>p,css:()=>"#000"}};
const fs=require("fs");
eval(fs.readFileSync(__dirname+"/../../grafelmelet-halozattudomany/arvizhet-data.js","utf8").replace(/window\./g,"global.window."));
let src=fs.readFileSync(__dirname+"/w0.js","utf8")+fs.readFileSync(__dirname+"/w1.js","utf8");
src=src.replace("void _A;","global.A=_A; global.T={degStats,barabasiAlbert,rng,meanField,hkStep,deffuantStep,opinionClusters,simulateSIR,nbrs};");
eval(src+"})();");
const t=global.T,A=global.A;
for (const seed of [1,2,3]) {
  const R=t.rng(seed), n=10000, E=t.barabasiAlbert(n,2,R), s=t.degStats(n,E);
  const out=[`BA n=1e4 seed ${seed}: kappa ${s.kappa.toFixed(2)} Tc ${s.Tc.toFixed(3)}`];
  for (const k of ["rand","hub","acq"]) { const rem=A.immunize(n,E,0.1,k,R), st=A.remStats(n,E,rem); out.push(`${k}: immK ${st.immK.toFixed(1)} Tc ${st.Tc.toFixed(3)}`); }
  console.log(out.join(" | "));
}
for (const n of [300,1000,3000,10000,100000]) { const R=t.rng(4242); console.log("n",n,"ER Tc",t.degStats(n,A.sparseGnm(n,2*n,R)).Tc.toFixed(3),"BA Tc",t.degStats(n,t.barabasiAlbert(n,2,R)).Tc.toFixed(3)); }
const mf=t.meanField(200,4,{model:"SIR",beta:.5,gamma:1,i0:1,maxT:400}); console.log("MF n200 i0=1 final R",(mf[mf.length-1].R/200).toFixed(3));
const mf2=t.meanField(1e6,4,{model:"SIR",beta:.5,gamma:1,i0:1,maxT:400}); console.log("MF n1e6 final R",(mf2[mf2.length-1].R/1e6).toFixed(3));
// korlátos bizalom (a widget compute()-ja szerint)
function bc(model,N,eps,seed){const R=t.rng(seed*7+1);let x=Array.from({length:N},()=>R());
 if(model==="hk"){for(let s=0;s<100;s++){const nx=t.hkStep(x,eps),ch=Math.max(...nx.map((v,i)=>Math.abs(v-x[i])));x=nx;if(ch<1e-9)break;}}
 else{const Rd=t.rng(seed*31+5);for(let s=0;s<200;s++)for(let k=0;k<N;k++)t.deffuantStep(x,eps,.5,Rd);}
 const cl=t.opinionClusters(x,.02);return cl.length+"/"+cl.filter(c=>c.size>=.05*N).length;}
for(const m of ["hk","df"]) for(const e of [.05,.1,.15,.2,.25,.3]) console.log(m,"eps",e,"clusters(all/big) seeds1-6:",[1,2,3,4,5,6].map(s=>bc(m,100,e,s)).join(" "));
// Deffuant ε = 0,3: hosszabb futás
for (const seed of [4,5,6]) { const R=t.rng(seed*7+1); let x=Array.from({length:100},()=>R()); const Rd=t.rng(seed*31+5);
  for(let s=0;s<1000;s++){for(let k=0;k<100;k++)t.deffuantStep(x,.3,.5,Rd); if(s===199||s===999) console.log("df .3 seed",seed,"sweep",s+1,t.opinionClusters(x,.02).map(c=>c.center.toFixed(3)+"("+c.size+")").join(" "));}}
