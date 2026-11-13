const fs=require("fs");
function rng(seed){let a=seed>>>0;return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const sigm=z=>1/(1+Math.exp(-z));
const src=fs.readFileSync(process.env.CORE||__dirname+"/../ch14/w2.js","utf8");
const core=src.slice(src.indexOf("/*GANCORE-BEGIN*/"),src.indexOf("/*GANCORE-END*/"));
eval(core+";global.API={w2Net,w2Fwd,w2Bwd,w2Zero,w2Adam,w2GanNew,w2GanStep,w2Real,w2Gauss,W2_DATA,w2Sp};");
global.rng=rng;global.sigm=sigm;
module.exports=API;
