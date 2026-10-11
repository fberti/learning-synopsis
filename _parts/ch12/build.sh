#!/bin/sh
# 12. fejezet összeállítása a részekből
set -e
cd "$(dirname "$0")"
D=../../mesterseges-intelligencia/12-beagyazasok-figyelem
cat 00-head.html 01-s121.html 02-s122.html 03-s123.html 04-s124.html 05-s125.html 06-s126.html 07-s127.html 08-s128.html 10-end.html > $D/index.html
cat w0.js w1.js w2.js w3.js w9.js > $D/widgets.js
if [ -f q1.js ] && [ -f q2.js ]; then
  { printf '/* =========================================================\n   Mesterséges intelligencia 12. fejezet – kvízek\n   (a kérdéstípusok leírását lásd: assets/quiz.js)\n   ========================================================= */\n(function () {\n  const R = String.raw;\n\n  const QUIZZES = {\n'
    cat q1.js; printf '\n'; cat q2.js
    printf '\n  };\n\n  window.Quiz && window.Quiz.mountAll(QUIZZES);\n})();\n'; } > $D/quizzes.js
fi
node --check $D/widgets.js
[ -f $D/quizzes.js ] && node --check $D/quizzes.js
echo built
