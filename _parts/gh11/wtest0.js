// node wtest0.js – a w0 11. fejezeti segédfüggvényeinek ellenőrzése (Python: calc1–6.py)
global.document={createElement:()=>({getContext:()=>({})}),documentElement:{}};
global.window={GraphKit:{edgeKey:(a,b)=>a<b?a+"-"+b:b+"-"+a,normalize:p=>p,css:()=>"#000"}};
const fs=require("fs");
eval(fs.readFileSync(__dirname+"/../../grafelmelet-halozattudomany/arvizhet-data.js","utf8").replace(/window\./g,"global.window."));
eval(fs.readFileSync(__dirname+"/../../mesterseges-intelligencia/13-graf-neuralis-halok/graph-data.js","utf8").replace(/window\./g,"global.window."));
let src=fs.readFileSync(__dirname+"/w0.js","utf8");
src=src.replace("const W = {};","const W = {}; global.T={arvizGraph,ARV_FIRST,ARV_SECOND,karateGraph,nonEdges,linkScorer,aucPairs,rocPoints,precisionAtK,holdoutSplit,laplacianEmbed,randomWalks,n2vStep,skipPairs,walkCooc,ppmi,ppmiEmbed,sgnsEmbed,edgeSet,pairKey,rng,dist,dot,cosine};");
eval(src+"})();");
const t=global.T, f=x=>(+x).toFixed(4);
const G1=t.arvizGraph(t.ARV_FIRST), G2=t.arvizGraph(t.ARV_SECOND), GF=t.arvizGraph();
const S2=t.edgeSet(G2.edges), cand=t.nonEdges(7,G1.edges), y=cand.map(([a,b])=>S2.has(a+"-"+b));
console.log("cand",cand.length,"pos",y.filter(Boolean).length);
for (const [leak,G] of [["clean",G1],["leaky",GF]]) {
  const sc=t.linkScorer(7,G.edges);
  console.log(leak, ["CN","J","AA","RA","PA"].map(m=>{const s=cand.map(([a,b])=>sc(a,b)[m]); return m+" "+f(t.aucPairs(s.filter((_,i)=>y[i]),s.filter((_,i)=>!y[i])));}).join(" | "));
}
const scJ=t.linkScorer(7,G1.edges), sJ=cand.map(([a,b],i)=>({s:scJ(a,b).J,y:y[i]}));
console.log("J p@1",JSON.stringify(t.precisionAtK(sJ,1)),"p@4",JSON.stringify(t.precisionAtK(sJ,4)), "p@3", JSON.stringify(t.precisionAtK(sJ,3)));
console.log("roc J",JSON.stringify(t.rocPoints(sJ).map(p=>[f(p.fpr),f(p.tpr)])));
const hand=[{s:.9,y:1},{s:.6,y:1},{s:.3,y:1},{s:.7,y:0},{s:.3,y:0},{s:.1,y:0}];
console.log("hand auc",f(t.aucPairs([.9,.6,.3],[.7,.3,.1])));
const P4=t.laplacianEmbed(4,[{a:0,b:1},{a:1,b:2},{a:2,b:3}],2); console.log("P4",JSON.stringify(P4.Z.map(z=>z.map(f))),P4.vals.map(f));
const full=t.laplacianEmbed(7,GF.edges,2); console.log("arviz spec",JSON.stringify(full.Z.map(z=>z.map(f))));
// five friends A B C D E: A-B,A-C,B-C,B-D,D-E
const FE=[[0,1],[0,2],[1,2],[1,3],[3,4]].map(([a,b])=>({a,b}));
console.log("n2v A->B p4 q.5",JSON.stringify(t.n2vStep(5,FE,0,1,4,0.5).map(o=>[o.x,f(o.p)])));
let R=t.rng(5), W=t.randomWalks(5,FE,{num:2000,length:3,p:4,q:0.5,R}); let c={},tot=0; W.forEach(w=>{if(w[0]===0&&w[1]===1){tot++;c[w[2]]=(c[w[2]]||0)+1;}}); console.log("empirical",tot,JSON.stringify(Object.fromEntries(Object.entries(c).map(([k,v])=>[k,f(v/tot)]))));
console.log("pairs w1",t.skipPairs([0,1,3,4,3,1,2],1).length,"w2",t.skipPairs([0,1,3,4,3,1,2],2).length);
const C=t.walkCooc(5,[[0,1,3,4,3,1,2]],1), PM=t.ppmi(C); console.log("ppmi B-D",f(PM[1][3]),"A-B",f(PM[0][1]),"D-E",f(PM[3][4]));
// karate: holdout + sgns auc quick
const K=t.karateGraph(); R=t.rng(11); let acc={CN:[],RA:[],PA:[],n2v:[],ppmi:[],spec:[]};
const t0=Date.now();
for(let r=0;r<+(process.argv[2]||10);r++){ const {train,test}=t.holdoutSplit(34,K.edges,0.1,R); const non=t.nonEdges(34,K.edges);
  const sc=t.linkScorer(34,train);
  for(const m of ["CN","RA","PA"]) acc[m].push(t.aucPairs(test.map(e=>sc(e.a,e.b)[m]),non.map(([a,b])=>sc(a,b)[m])));
  const ws=t.randomWalks(34,train,{num:10,length:20,R}); const Z=t.sgnsEmbed(34,ws,{dim:16,window:5,R});
  acc.n2v.push(t.aucPairs(test.map(e=>t.cosine(Z[e.a],Z[e.b])),non.map(([a,b])=>t.cosine(Z[a],Z[b]))));
  const Zp=t.ppmiEmbed(t.walkCooc(34,ws,5),8); acc.ppmi.push(t.aucPairs(test.map(e=>t.dot(Zp[e.a],Zp[e.b])),non.map(([a,b])=>t.dot(Zp[a],Zp[b]))));
  const Zs=t.laplacianEmbed(34,train,2).Z; acc.spec.push(t.aucPairs(test.map(e=>-t.dist(Zs[e.a],Zs[e.b])),non.map(([a,b])=>-t.dist(Zs[a],Zs[b]))));
}
console.log("karate 10 splits",Object.entries(acc).map(([k,v])=>k+" "+f(v.reduce((a,b)=>a+b,0)/v.length)).join(" | "),"ms",Date.now()-t0);
