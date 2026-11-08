#!/bin/sh
# Analízis 4. fejezet összeállítása a részekből
set -e
cd "$(dirname "$0")"
D=../../analizis/04-derivalt
mkdir -p $D
python3 -I - <<'PY'
import re
parts=["00-head.html","01-s41.html","02-s42.html","03-s43.html","04-s44.html","05-s45.html","06-s46.html","07-s47.html","08-s48.html","10-end.html"]
s="".join(open(p,encoding="utf-8").read() for p in parts)
TW='<div class="tw" style="overflow-x:auto">'
out=[];pos=0
for m in re.finditer(r"<table[\s\S]*?</table>", s):
    pre=s[:m.start()].rstrip()
    out.append(s[pos:m.start()])
    out.append(m.group(0) if pre.endswith(TW) else TW+m.group(0)+"</div>")
    pos=m.end()
out.append(s[pos:])
open("../../analizis/04-derivalt/index.html","w",encoding="utf-8").write("".join(out))
PY
cat w0.js w1.js $( [ -f w2.js ] && echo w2.js ) w9.js > $D/widgets.js
if [ -f q1.js ] && [ -f q2.js ]; then
  { printf '/* =========================================================\n   Analízis 4. fejezet – kvízek\n   (a kérdéstípusok leírását lásd: assets/quiz.js)\n   Minden számot Pythonnal ellenőriztünk.\n   ========================================================= */\n(function () {\n  const R = String.raw;\n\n  const QUIZZES = {\n'
    cat q1.js; printf '\n'; cat q2.js
    printf '\n  };\n\n  window.Quiz && window.Quiz.mountAll(QUIZZES);\n})();\n'; } > $D/quizzes.js
fi
node --check $D/widgets.js
[ -f $D/quizzes.js ] && node --check $D/quizzes.js
echo built
