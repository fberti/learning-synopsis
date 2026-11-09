#!/bin/sh
# Matematikai statisztika 8. fejezet összeállítása a részekből
set -e
cd "$(dirname "$0")"
D=../../matematikai-statisztika/08-parameteres-probak
mkdir -p $D
python3 -I - <<'PY'
import re
parts=["00-head.html","01-s81.html","02-s82.html","03-s83.html","04-s84.html","05-s85.html","06-s86.html","07-s87.html","08-s88.html","09-s89.html","10-end.html"]
s="".join(open(p,encoding="utf-8").read() for p in parts)
TW='<div class="tw" style="overflow-x:auto">'
def wrap(m):
    pre=s2[:m.start()].rstrip()
    return m.group(0) if pre.endswith(TW) else TW+m.group(0)+"</div>"
s2=s
s=re.sub(r"<table[\s\S]*?</table>", wrap, s)
open("../../matematikai-statisztika/08-parameteres-probak/index.html","w",encoding="utf-8").write(s)
PY
cat w0.js w1.js $( [ -f w2.js ] && echo w2.js ) w9.js > $D/widgets.js
if [ -f q1.js ] && [ -f q2.js ]; then
  { printf '/* =========================================================\n   Matematikai statisztika 8. fejezet – kvízek\n   (a kérdéstípusok leírását lásd: assets/quiz.js)\n   Minden számot Pythonnal ellenőriztünk.\n   ========================================================= */\n(function () {\n  const R = String.raw;\n\n  const QUIZZES = {\n'
    cat q1.js; printf '\n'; cat q2.js
    printf '\n  };\n\n  window.Quiz && window.Quiz.mountAll(QUIZZES);\n})();\n'; } > $D/quizzes.js
fi
node --check $D/widgets.js
[ -f $D/quizzes.js ] && node --check $D/quizzes.js
echo built
