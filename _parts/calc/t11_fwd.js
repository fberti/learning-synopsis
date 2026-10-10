// node: a w0.js CNN-segédfüggvényei a cnn-nets.js hálóival → pontosság eltolásonként (összevetés a Python-gridekkel)
const fs = require("fs"), vm = require("vm");
const ctx = { window: {}, document: { readyState: "complete", querySelectorAll: () => [], documentElement: {} }, getComputedStyle: () => ({ getPropertyValue: () => "" }), console };
ctx.window = ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync("mesterseges-intelligencia/11-konvolucios-halok/cnn-nets.js", "utf8"), ctx);
const src = fs.readFileSync("_parts/ch11/w0.js", "utf8") + "\n})();";
vm.runInContext(src, ctx);
const H = ctx.__W11, T = H.testSet();
for (const [k, net] of Object.entries(ctx.CNN11.nets)) {
  const res = [];
  for (const [dx, dy] of [[0, 0], [1, 0], [1, 1], [2, 0], [0, -4]]) {
    let ok = 0; T.X.forEach((v, i) => { if (H.argmax(H.forwardNet(net, H.place(v, dx, dy)).p) === T.y[i]) ok++; });
    res.push(`(${dx},${dy}) ${ok} vs ${net.grid[dy + 4][dx + 4]}`);
  }
  console.log(k, res.join(" | "));
}
