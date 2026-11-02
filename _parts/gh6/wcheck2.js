const fs=require("fs");
global.window={}; global.document={createElement:()=>({getContext:()=>({})}),querySelectorAll:()=>[]};
eval(fs.readFileSync("grafelmelet-halozattudomany/arvizhet-data.js","utf8"));
eval(fs.readFileSync("mesterseges-intelligencia/13-graf-neuralis-halok/graph-data.js","utf8"));
eval(fs.readFileSync("grafelmelet-halozattudomany/06-helyi-szerkezet/karate-weights.js","utf8"));
window.GraphKit={edgeKey:(a,b)=>a<b?a+"-"+b:b+"-"+a, normalize:(P)=>P, css:x=>x};
let src=fs.readFileSync("_parts/gh6/w0.js","utf8")+`
for (const [k,obs] of [["arviz",4],["karate",45]]) { const G=preset(k), n=G.nodes.length, m=G.edges.length, R=rng(11);
 for (const nm of ["gnm","rew"]) { const xs=[]; for(let t=0;t<4000;t++) xs.push(triangles(n, nm==="gnm"?gnm(n,m,R):rewire(n,G.edges,10*m,R)).list.length);
  const mu=xs.reduce((a,b)=>a+b,0)/xs.length, sd=Math.sqrt(xs.reduce((a,b)=>a+(b-mu)**2,0)/xs.length);
  console.log(k,nm,mu.toFixed(2),sd.toFixed(2),((obs-mu)/sd).toFixed(2),(xs.filter(x=>x>=obs).length/xs.length).toFixed(3)); } }
`;
src=src.replace("(function () {","");
eval(src);
