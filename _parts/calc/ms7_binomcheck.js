global.window={}; require('../../assets/stat.js'); const S=window.Stat;
console.log(S.binom.cdf(39,100,.5), S.binom.sf(60,100,.5), S.binom.cdf(429,1000,.4), S.binom.sf(1990,2000,.5), S.binom.cdf(3,1000,.001));
