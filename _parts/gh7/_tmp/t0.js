global.window={GraphKit:{edgeKey:(a,b)=>a<b?a+"-"+b:b+"-"+a,normalize:p=>p},ARVIZHET:require("vm").runInNewContext(require("fs").readFileSync("../../grafelmelet-halozattudomany/arvizhet-data.js","utf8")+";window.ARVIZHET",{window:{}})};
global.document={createElement:()=>({getContext:()=>({})}),querySelectorAll:()=>[]};
let src=require("fs").readFileSync("w0.js","utf8")+`
const R=rng(5);let s=0;for(let t=0;t<200;t++)s+=gnp(1000,0.004,R).length;console.log("gnp mean m",s/200,"exp",0.004*499500);
const ws=wattsStrogatz(1000,10,0.01,R);console.log("ws",avgPath(1000,ws.edges,100,R).L, clusteringStats(1000,ws.edges).avg);
const ba=barabasiAlbert(1000,2,R);const d=degreeC(1000,ba);console.log("ba m",ba.length,"max",Math.max(...d));
let tr=[];for(let t=0;t<3000;t++){const rows=curveball(ARTICLE_ROWS,60,R);tr.push(project(rows,7).W[3][4]);}
console.log("LaOn null",meanSd(tr), tr.filter(x=>x>=3).length/tr.length);
console.log("hyper",[0,1,2,3,4].map(j=>hyperPmf(12,4,4,j)));
const sm=stubMatch([2,1,1],R);console.log(sm.edges,sm.loops);
})();`;
eval(src);
