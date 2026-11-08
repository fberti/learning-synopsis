// a binom-test widget „+1 000 sorozat” gombjának ellenőrzése: mulberry32-es érme, n = 100, kétoldali 5%
global.window = {}; require("../../assets/stat.js"); const S = window.Stat;
for (const seed of [72, 73, 74]) {
  const r = S.mulberry32(seed); let rej = 0, N = 200000;
  for (let j = 0; j < N; j++) { let s = 0; for (let i = 0; i < 100; i++) if (r() < 0.5) s++; if (s <= 39 || s >= 61) rej++; }
  console.log(seed, (rej / N * 100).toFixed(2) + "%");
}
