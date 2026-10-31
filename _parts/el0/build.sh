#!/bin/sh
# Elektronika 0. fejezet összeállítása a részekből
set -e
cd "$(dirname "$0")"
D=../../elektronika/00-laborkalauz
mkdir -p $D ../../elektronika/sketches/00_hello
python3 -I - <<'PY'
import re
parts=["00-head.html","01-s01.html","02-s02.html","03-s03.html","04-s04.html","05-s05.html","06-s06.html","07-s07.html","08-s08.html","10-end.html"]
s="".join(open(p,encoding="utf-8").read() for p in parts)
TW='<div class="tw" style="overflow-x:auto">'
def wrap(m):
    pre=s[:m.start()].rstrip()
    return m.group(0) if pre.endswith(TW) else TW+m.group(0)+"</div>"
s=re.sub(r"<table[\s\S]*?</table>", wrap, s)
open("../../elektronika/00-laborkalauz/index.html","w",encoding="utf-8").write(s)
PY
cat w0.js w1.js w2.js w9.js > $D/widgets.js
if [ -f q1.js ]; then
  { printf '/* =========================================================\n   Elektromosságtan és digitális elektronika 0. fejezet – kvízek\n   (a kérdéstípusok leírását lásd: assets/quiz.js)\n   Minden számot Pythonnal ellenőriztünk.\n   ========================================================= */\n(function () {\n  const R = String.raw;\n\n  const QUIZZES = {\n'
    cat q1.js; if [ -f q2.js ]; then printf '\n'; cat q2.js; fi
    printf '\n  };\n\n  window.Quiz && window.Quiz.mountAll(QUIZZES);\n})();\n'; } > $D/quizzes.js
fi
cp sketch_00_hello.ino ../../elektronika/sketches/00_hello/00_hello.ino
node --check $D/widgets.js
[ -f $D/quizzes.js ] && node --check $D/quizzes.js
echo built
