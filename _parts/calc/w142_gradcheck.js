const A=require("./w142_harness.js");
for (const act of ["leaky","tanh"]){
const rnd=(()=>{let s=1;return()=>((s=s*16807%2147483647)/2147483647)})();
const net=A.w2Net([1,16,16,1],act,rnd); const x=Float64Array.from([0.3,-1.2,2.1]);
const loss=()=>{const o=A.w2Fwd(net,x).out;return o.reduce((s,v,i)=>s+Math.sin(v)*(i+1),0)};
A.w2Zero(net);const c=A.w2Fwd(net,x);const g=Float64Array.from(c.out.map((v,i)=>Math.cos(v)*(i+1)));
const dx=A.w2Bwd(net,c,g,true);
let maxe=0;
for(const [li,k] of [[0,3],[1,40],[2,5]]){const L=net.L[li];const o=L.W[k];L.W[k]=o+1e-6;const a=loss();L.W[k]=o-1e-6;const b=loss();L.W[k]=o;maxe=Math.max(maxe,Math.abs((a-b)/2e-6-L.gW[k]));}
for(let s=0;s<3;s++){const o=x[s];x[s]=o+1e-6;const a=loss();x[s]=o-1e-6;const b=loss();x[s]=o;maxe=Math.max(maxe,Math.abs((a-b)/2e-6-dx[s]));}
console.log(act,"max grad err",maxe);}
