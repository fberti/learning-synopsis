#!/bin/sh
# Gráfelmélet és hálózattudomány 9. fejezet összeállítása a részekből
set -e
cd "$(dirname "$0")"
D=../../grafelmelet-halozattudomany/09-terjedes
mkdir -p $D
python3 -I - <<'PY'
import re, json
parts=["00-head.html","01-s91.html","02-s92.html","03-s93.html","04-s94.html","05-s95.html","06-s96.html","07-s97.html","10-end.html"]
s="".join(open(p,encoding="utf-8").read() for p in parts)
assert "{{" not in s, s[s.index("{{")-50:s.index("{{")+50]
TW='<div class="tw" style="overflow-x:auto">'
def wrap(m):
    pre=s[:m.start()].rstrip()
    return m.group(0) if pre.endswith(TW) or 'class="adj"' in m.group(0)[:40] else TW+m.group(0)+"</div>"
s=re.sub(r"<table[\s\S]*?</table>", wrap, s)
open("../../grafelmelet-halozattudomany/09-terjedes/index.html","w",encoding="utf-8").write(s)
PY
cat w0.js w1.js $( [ -f w2.js ] && echo w2.js ) w9.js > $D/widgets.js
if [ -f q1.js ] && [ -f q2.js ]; then
  { printf '/* =========================================================\n   Gráfelmélet és hálózattudomány 9. fejezet – kvízek\n   (a kérdéstípusok leírását lásd: assets/quiz.js)\n   Minden számot Pythonnal ellenőriztünk.\n   ========================================================= */\n(function () {\n  const R = String.raw;\n\n  const QUIZZES = {\n'
    cat q1.js; printf '\n'; cat q2.js
    printf '\n  };\n\n  window.Quiz && window.Quiz.mountAll(QUIZZES);\n})();\n'; } > $D/quizzes.js
fi
node --check $D/widgets.js
[ -f $D/quizzes.js ] && node --check $D/quizzes.js
echo built
