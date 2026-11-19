#!/bin/sh
# Matematikai statisztika 9. fejezet összeállítása a részekből
set -e
cd "$(dirname "$0")"
D=../../matematikai-statisztika/09-khi-negyzet-es-nemparameteres-probak
mkdir -p $D
python3 -I - <<'PY'
import re
parts=["00-head.html","01-s91.html","02-s92.html","03-s93.html","04-s94.html","05-s95.html","06-s96.html","07-s97.html","08-s98.html","10-end.html"]
s="".join(open(p,encoding="utf-8").read() for p in parts)
TW='<div class="tw" style="overflow-x:auto">'
def wrap(m):
    pre=s2[:m.start()].rstrip()
    return m.group(0) if pre.endswith(TW) else TW+m.group(0)+"</div>"
s2=s
s=re.sub(r"<table[\s\S]*?</table>", wrap, s)
open("../../matematikai-statisztika/09-khi-negyzet-es-nemparameteres-probak/index.html","w",encoding="utf-8").write(s)
PY
cat w0.js w1.js $( [ -f w2.js ] && echo w2.js ) w9.js > $D/widgets.js
if [ -f q1.js ] && [ -f q2.js ]; then
  { printf '/* =========================================================\n   Matematikai statisztika 9. fejezet – kvízek\n   (a kérdéstípusok leírását lásd: assets/quiz.js)\n   Minden számot Pythonnal ellenőriztünk.\n   ========================================================= */\n(function () {\n  const R = String.raw;\n\n  const QUIZZES = {\n'
    cat q1.js; printf '\n'; cat q2.js
    printf '\n  };\n\n  window.Quiz && window.Quiz.mountAll(QUIZZES);\n})();\n'; } > $D/quizzes.js
fi
node --check $D/widgets.js
[ -f $D/quizzes.js ] && node --check $D/quizzes.js
echo built
