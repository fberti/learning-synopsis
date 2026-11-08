require("vm").runInThisContext(require("fs").readFileSync("assets/stat.js","utf8").replace("window.Stat","globalThis.Stat"));
const S=Stat, x=[12,15,17,18,20,22,23,25,28,34,45,61];
const out=[]; for (const seed of [777,1,2,3,4,5,6,7,8,9]) { const r=S.mulberry32(seed), m=[];
 for (let k=0;k<10000;k++){let s=0; for(let i=0;i<12;i++) s+=x[Math.floor(r()*12)]; m.push(s/12);} out.push(seed+":"+S.sd(m).toFixed(3)); }
console.log(out.join(" "));
