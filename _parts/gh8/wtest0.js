// node-teszt a közös segédfüggvényekre (DOM nélkül)
global.document={createElement:()=>({getContext:()=>({})}),documentElement:{}};
global.window={GraphKit:{edgeKey:(a,b)=>a<b?a+"-"+b:b+"-"+a,normalize:p=>p,css:()=>"#000"}};
const fs=require("fs");
eval(fs.readFileSync("../../grafelmelet-halozattudomany/arvizhet-data.js","utf8").replace(/window\./g,"global.window."));
eval(fs.readFileSync("../../mesterseges-intelligencia/13-graf-neuralis-halok/graph-data.js","utf8"));
eval(fs.readFileSync("../../grafelmelet-halozattudomany/08-kozossegek/lesmis-data.js","utf8"));
let src=fs.readFileSync("w0.js","utf8");
src=src.replace('const W = {};','const W = {}; global.T={preset,modularity,girvanNewman,louvain,labelProp,nmi,ari,pairAgreement,sbmExpected,spectralSplit,ringOfCliques,edgeBetweenness,disconnectedComms,rng,lesmisGraph,gnm};');
src=src.replace(/\}\)\(\);\s*$/,"");
eval(src+"})();");
const {preset,modularity,girvanNewman,louvain,labelProp,nmi,ari,pairAgreement,spectralSplit,ringOfCliques,edgeBetweenness,rng,lesmisGraph}=T;
const A=preset("arviz"); console.log(A.nodes.map(x=>x.label).join(","), A.edges.map(e=>A.nodes[e.a].label+"-"+A.nodes[e.b].label+":"+e.w).join(" "));
const ids=A.nodes.map(x=>x.label), L=g=>ids.map(id=>g.findIndex(s=>s.includes(id)));
const two=L([["Ko","Vi","Sz","Kl"],["Po","La","Ön"]]), fr=L([["Ko","Vi"],["Po","La","Ön"],["Sz","Kl"]]);
console.log("Q two",modularity(7,A.edges,two).Q, "w",modularity(7,A.edges,two,{weighted:true}).Q, "frames",modularity(7,A.edges,fr).Q, modularity(7,A.edges,fr,{weighted:true}).Q);
console.log("EB", edgeBetweenness(7,A.edges).map((x,i)=>ids[A.edges[i].a]+"-"+ids[A.edges[i].b]+":"+x).join(" "));
girvanNewman(7,A.edges).forEach(s=>console.log("GN",s.removed==null?"-":ids[A.edges[s.removed].a]+"-"+ids[A.edges[s.removed].b],s.k,s.Q.toFixed(4)));
const K=preset("karate"); const club=K.club;
let qs=[];for(let s=1;s<=50;s++){const r=louvain(34,K.edges,{R:rng(s)});qs.push([r.Q.toFixed(4),new Set(r.lab).size].join("/"));}
const cnt={};qs.forEach(q=>cnt[q]=(cnt[q]||0)+1);console.log("karate louvain",cnt);
[0.5,2].forEach(g=>{const r=louvain(34,K.edges,{R:rng(1),gamma:g});console.log("gamma",g,new Set(r.lab).size)});
const gn=girvanNewman(34,K.edges);const b=gn.reduce((x,y)=>y.Q>x.Q?y:x);console.log("karate GN best",b.Q.toFixed(4),b.k, "GN2 nmi",nmi(club,gn.find(s=>s.k===2).lab).toFixed(3),ari(club,gn.find(s=>s.k===2).lab).toFixed(3));
console.log("real Q",modularity(34,K.edges,club).Q.toFixed(4));
console.log("nmi one slip",nmi([0,0,0,1,1,1],[0,0,1,1,1,1]).toFixed(4),ari([0,0,0,1,1,1],[0,0,1,1,1,1]).toFixed(4),pairAgreement([0,0,0,1,1,1],[0,0,1,1,1,1]));
console.log("singletons",nmi([0,0,0,1,1,1],[0,1,2,3,4,5]).toFixed(4),ari([0,0,0,1,1,1],[0,1,2,3,4,5]).toFixed(4));
const f=spectralSplit(34,K.edges,"fiedler"), mm=spectralSplit(34,K.edges,"modmat");
const agree=l=>Math.max(l.filter((x,i)=>x===club[i]).length,l.filter((x,i)=>x!==club[i]).length);
console.log("fiedler agree",agree(f.lab),"modmat agree",agree(mm.lab), modularity(34,K.edges,mm.lab).Q.toFixed(4));
const ring=ringOfCliques(10);console.log("ring",ring.length,modularity(30,ring,[...Array(30).keys()].map(i=>Math.floor(i/3))).Q, modularity(30,ring,[...Array(30).keys()].map(i=>Math.floor(i/6))).Q);
const lc={};for(let s=1;s<=100;s++){const r=labelProp(34,K.edges,{R:rng(s)});const k=new Set(r.lab).size;lc[k]=(lc[k]||0)+1;}console.log("LPA karate k",lc);
const LM=lesmisGraph();const lr={};for(let s=1;s<=30;s++){const r=louvain(77,LM.edges,{R:rng(s),weighted:true});const k=r.Q.toFixed(3)+"/"+new Set(r.lab).size;lr[k]=(lr[k]||0)+1;}console.log("lesmis",lr);
// --- 8.4 számok
{
const K=preset("karate");
for (const s of [1,2,3]) { const r=louvain(34,K.edges,{R:rng(s)}); console.log("seed",s,r.levels.map(l=>l.k+"/"+l.Q.toFixed(3)+"/moves"+l.moves.length).join(" | ")); }
const ring=ringOfCliques(10); [1,1.2,1.3,1.5].forEach(g=>{const r=louvain(30,ring,{R:rng(1),gamma:g}); console.log("ring gamma",g,new Set(r.lab).size)});
const K5=[]; 
}
{ const ring=ringOfCliques(10); for (const s of [1,2,3]) { const r=louvain(30,ring,{R:rng(s)}); console.log("ring levels",r.levels.map(l=>l.k).join(",")); } }
