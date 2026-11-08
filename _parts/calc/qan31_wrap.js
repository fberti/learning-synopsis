// node --check burok: node qan31_wrap.js <q1.js> <kimenet.js>
const fs = require('fs');
fs.writeFileSync(process.argv[3], '(function(){const R=String.raw; const Q={\n' + fs.readFileSync(process.argv[2], 'utf8') + '\n}; })();\n');
