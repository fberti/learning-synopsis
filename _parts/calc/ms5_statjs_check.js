global.window={}; require('../../assets/stat.js'); const S=window.Stat;
const out={
 ncdf:[S.normal.cdf(1.96),S.normal.cdf(-2.5),S.normal.inv(0.975),S.normal.inv(0.001)],
 t:[S.t.inv(0.975,4),S.t.inv(0.975,9),S.t.inv(0.975,1),S.t.cdf(2,4),S.t.cdf(-1.3,2.5)],
 c:[S.chi2.cdf(13.5,9),S.chi2.inv(0.95,9),S.chi2.inv(0.025,9),S.chi2.cdf(1,1),S.chi2.inv(0.5,1)],
 f:[S.f.inv(0.95,5,10),S.f.cdf(2,3,7),S.f.inv(0.05,5,10)],
 b:[S.binom.cdf(429,1000,0.4),S.binom.pmf(1,3,0.4)],
 pdf:[S.t.pdf(0.5,3),S.chi2.pdf(3,4),S.f.pdf(1.2,4,9)]};
console.log(JSON.stringify(out));
