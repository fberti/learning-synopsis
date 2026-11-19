// node wtest0.js – a w0 terjedési segédfüggvényeinek ellenőrzése
global.document={createElement:()=>({getContext:()=>({})}),documentElement:{}};
global.window={GraphKit:{edgeKey:(a,b)=>a<b?a+"-"+b:b+"-"+a,normalize:p=>p,css:()=>"#000"}};
const fs=require("fs");
eval(fs.readFileSync(__dirname+"/../../grafelmelet-halozattudomany/arvizhet-data.js","utf8").replace(/window\./g,"global.window."));
let src=fs.readFileSync(__dirname+"/w0.js","utf8");
src=src.replace("const W = {};","const W = {}; global.T={degStats,transmissibility,simulateSIR,meanField,icCascade,icExact,icMC,greedySeeds,thresholdCascade,granovetter,treeMetrics,borel,degroot,hkStep,deffuantStep,opinionClusters,rng,ringLattice,wattsStrogatz,nbrs};");
eval(src+"})();");
const t=global.T, E=(s,lab)=>s.split(",").map(x=>{const [a,b]=x.split("-");return {a:lab.indexOf(a),b:lab.indexOf(b),w:1}});
const AL=["Ko","Vi","Po","La","Ön","Sz","Kl"], AE=E("Ko-Vi,Ko-Po,Vi-Po,Vi-Sz,Sz-Kl,Ko-Sz,Ko-Kl,La-Ön,Po-La,Po-Ön",AL);
console.log("degStats arv",t.degStats(7,AE).kappa.toFixed(3),t.degStats(7,AE).Tc.toFixed(4));
console.log("T(.5,.5)",t.transmissibility(.5,.5));
console.log("icExact Ko p.5",t.icExact(7,AE,[0],.5).toFixed(4),"Ko+La p.3",t.icExact(7,AE,[0,3],.3).toFixed(4));
console.log("icMC Ko p.5",t.icMC(7,AE,[0],.5,20000,t.rng(1)).toFixed(3));
const g=t.greedySeeds(7,2,S=>t.icExact(7,AE,S,.3)); console.log("greedy",g.map(x=>AL[x.node]+" "+x.total.toFixed(3)));
console.log("thresh ring8",t.thresholdCascade(8,t.ringLattice(8,4),[0,1],2).history, "gran",t.granovetter([...Array(100).keys()]).length-1, t.granovetter([0,2,...[...Array(98).keys()].map(x=>x+2)]));
console.log("tree star5",JSON.stringify(t.treeMetrics([0,1,2,3,4],[-1,0,0,0,0])),"path5",t.treeMetrics([0,1,2,3,4],[-1,0,1,2,3]).sv);
console.log("borel R.5 s1",t.borel(.5,1).toFixed(4),"s2",t.borel(.5,2).toFixed(4));
const P3=E("A-B,B-C",["A","B","C"]); console.log("degroot",t.degroot(3,P3,[7,0,0],3).map(r=>r.map(v=>v.toFixed(4)).join(" ")));
let x=[0,.2,.4,.8,1]; for(let i=0;i<5;i++) x=t.hkStep(x,.25); console.log("hk .25",x.map(v=>v.toFixed(3)).join(" "));
x=[0,.2,.4,.8,1]; for(let i=0;i<30;i++) x=t.hkStep(x,.45); console.log("hk .45",x.map(v=>v.toFixed(4)).join(" "));
// SI beta=1 from Kl
const r=t.simulateSIR(7,AE,{model:"SI",beta:1,seeds:[6]}); console.log("SI Kl",r.counts.map(c=>c.I).join(","));
// SIR path A-B-C beta .5 gamma .5 P(C ever)
let c=0,N=100000,R=t.rng(3); for(let i=0;i<N;i++){const s=t.simulateSIR(3,P3,{beta:.5,gamma:.5,seeds:[0],R}); if(s.tInf[2]>=0)c++;} console.log("P(C) ~4/9",(c/N).toFixed(3));
console.log("meanField R0=2 final", (()=>{const o=t.meanField(10000,4,{beta:.5,gamma:1,i0:10,maxT:500});return (o[o.length-1].R/10000).toFixed(3)})());
