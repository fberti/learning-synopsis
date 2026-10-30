const fs=require("fs");
global.window=global; global.getComputedStyle=()=>({getPropertyValue:()=>"#000"});
global.document={documentElement:{},createElement:()=>({getContext:()=>({})}),querySelectorAll:()=>[],readyState:"complete",addEventListener(){}};
global.addEventListener=()=>{}; global.MutationObserver=class{observe(){}};
eval(fs.readFileSync("../../assets/graph.js","utf8"));
eval(fs.readFileSync("../../grafelmelet-halozattudomany/arvizhet-data.js","utf8"));
let s=(fs.readFileSync("w0.js","utf8")+fs.readFileSync("w9.js","utf8")).replace("const W = {};","const W = {}; window.__T={preset,degreeC,closenessC,harmonicC,betweennessC,eigenC,pagerankC,hitsC,shortestPaths,ranks,farness};");
eval(s);
const T=window.__T, r=a=>a.map(x=>+x.toFixed(3));
for (const k of ["arviz","kite","bowtie","c4","path5","twoTri"]) {
  const G=T.preset(k), n=G.nodes.length, E=G.edges;
  console.log(k, G.nodes.map(x=>x.label).join(" "));
  console.log(" deg",T.degreeC(n,E)," str",G.weighted?T.degreeC(n,E,{weighted:true}):"");
  console.log(" far",T.farness(n,E)," clo",r(T.closenessC(n,E)));
  console.log(" btw",r(T.betweennessC(n,E))," eig",r(T.eigenC(n,E).vec)," pr",r(T.pagerankC(n,E)));
}
for (const k of ["pr4","hits5","papersU"]) {
  const G=T.preset(k), n=G.nodes.length, E=G.edges;
  console.log(k,G.nodes.map(x=>x.label).join(" "),"in",T.degreeC(n,E,{directed:true}),"pr",r(T.pagerankC(n,E,{directed:true})), "pr a1 steps", T.pagerankC(n,E,{directed:true,alpha:0.85,steps:2}).hist.map(r));
  const H=T.hitsC(n,E); console.log(" hits a",r(H.a),"h",r(H.h), "step1", T.hitsC(n,E,{steps:1}).hist[1]);
}
const G=T.preset("arviz"); console.log(T.shortestPaths(7,G.edges,6,3).map(p=>p.map(i=>G.nodes[i].label).join("-")), T.shortestPaths(7,G.edges,5,3).map(p=>p.map(i=>G.nodes[i].label).join("-")));
console.log(T.ranks([4,3,4,2,2,3,2]));
