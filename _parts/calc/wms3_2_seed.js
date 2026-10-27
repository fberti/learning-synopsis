function mulberry32(a){return function(){a|=0;a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296;};}
const normal=r=>{let u=0;while(!u)u=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*r());};
const mean=a=>a.reduce((s,x)=>s+x,0)/a.length;
const pear=(x,y)=>{const mx=mean(x),my=mean(y);let c=0,a=0,b=0;x.forEach((v,i)=>{c+=(v-mx)*(y[i]-my);a+=(v-mx)**2;b+=(y[i]-my)**2});return c/Math.sqrt(a*b)};
const ser=(n,r)=>{let s=0;return Array.from({length:n},()=>{s+=normal(r);return s;})};
for(let seed=1;seed<60;seed++){const r=mulberry32(seed);const x=ser(50,r),y=ser(50,r);const rr=pear(x,y);if(Math.abs(rr)>0.7)console.log(seed,rr.toFixed(3));}
