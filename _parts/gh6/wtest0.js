const fs=require("fs");
global.window={}; global.document={createElement:()=>({getContext:()=>({})}),querySelectorAll:()=>[]};
eval(fs.readFileSync("grafelmelet-halozattudomany/arvizhet-data.js","utf8"));
eval(fs.readFileSync("mesterseges-intelligencia/13-graf-neuralis-halok/graph-data.js","utf8"));
eval(fs.readFileSync("grafelmelet-halozattudomany/06-helyi-szerkezet/karate-weights.js","utf8"));
window.GraphKit={edgeKey:(a,b)=>a<b?a+"-"+b:b+"-"+a, normalize:(P)=>P, css:x=>x};
let src=fs.readFileSync("_parts/gh6/w0.js","utf8")+`
const show=(k)=>{const G=preset(k);const n=G.nodes.length;const L=G.nodes.map(x=>x.label);
 const C=clusteringC(n,G.edges), st=clusteringStats(n,G.edges);
 console.log(k, L.map((l,i)=>l+":"+C[i].toFixed(3)).join(" "), "avg",st.avg.toFixed(3),"trans",st.trans.toFixed(3),"tri",st.tri,"wedges",st.wedges,"degr",degAssort(n,G.edges).r.toFixed(3));
 if(G.signed){console.log("  bal",JSON.stringify(balanceCheck(n,G.edges)),"frus",JSON.stringify(frustration(n,G.edges)), signedTriangles(n,G.edges).map(t=>t.t.map(i=>L[i]).join("")+t.type).join(" "));}
 return G;};
["barat","star","k4","bowtie","twoTri","ladder","kite","arviz","karate","arvizS","sK4bal","sK4unb","s5","s5unb"].forEach(show);
const A=preset("arviz"); console.log("overlap", overlapE(7,A.edges).map((o,i)=>A.nodes[A.edges[i].a].label+"-"+A.nodes[A.edges[i].b].label+":"+o.toFixed(2)).join(" "));
console.log("civil r", JSON.stringify(attrAssort(7,A.edges,A.nodes.map(x=>["La","Ön"].includes(x.label)?"C":"N"))));
const Ld=preset("ladder"); console.log("ladder r tri", attrAssort(6,Ld.edges,["P","P","P","K","K","K"]).r, "mixed", attrAssort(6,Ld.edges,["P","K","P","P","K","K"]).r);
const K=preset("karate"); console.log("karate club r",attrAssort(34,K.edges,K.club).r.toFixed(3));
const R=rng(3); let s=0; for(let t=0;t<500;t++){s+=triangles(34,rewire(34,K.edges,780,R)).list.length;} console.log("karate rewired tri mean",s/500);
s=0; for(let t=0;t<2000;t++){s+=triangles(34,gnm(34,78,R)).list.length;} console.log("gnm mean",s/2000);
console.log(components(34,K.edges).sizes);
`;
src=src.replace("(function () {","");
eval(src);
