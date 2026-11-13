#!/bin/sh
# 14. fejezet összeállítása a részekből
set -e
cd "$(dirname "$0")"
D=../../mesterseges-intelligencia/14-generativ-modellek
cat 00-head.html 01-s141.html 02-s142.html 03-s143.html 04-s144.html 05-s145.html 06-s146.html 07-s147.html 08-s148.html 09-s149.html 10-end.html > $D/index.html
W=""; for f in w0.js w1.js w2.js w3.js w9.js; do [ -f $f ] && W="$W $f"; done
cat $W > $D/widgets.js
Q=""; for f in q1.js q2.js; do [ -f $f ] && Q="$Q $f"; done
if [ -n "$Q" ]; then
  { printf '/* =========================================================\n   Mesterséges intelligencia 14. fejezet – kvízek\n   (a kérdéstípusok leírását lásd: assets/quiz.js)\n   ========================================================= */\n(function () {\n  const R = String.raw;\n\n  const QUIZZES = {\n'
    for f in $Q; do cat $f; printf '\n'; done
    printf '  };\n\n  window.Quiz && window.Quiz.mountAll(QUIZZES);\n})();\n'; } > $D/quizzes.js
fi
node --check $D/widgets.js
[ -f $D/quizzes.js ] && node --check $D/quizzes.js
grep -n "{{" $D/index.html | head || true
echo built
