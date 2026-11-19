#!/bin/sh
# Gráfelmélet és hálózattudomány 8. fejezet összeállítása a részekből
set -e
cd "$(dirname "$0")"
D=../../grafelmelet-halozattudomany/08-kozossegek
mkdir -p $D
python3 -I - <<'PY'
import re, json
parts=["00-head.html","01-s81.html","02-s82.html","03-s83.html","04-s84.html","05-s85.html","06-s86.html","07-s87.html","08-s88.html","10-end.html"]
s="".join(open(p,encoding="utf-8").read() for p in parts)
K=json.load(open("karate_attrs.json",encoding="utf-8"))
s=s.replace("{{KARATE_EP}}",f'data-edges="{K["KARATE_E"]}" data-pos="{K["KARATE_P"]}"')
for k in ["KARATE_CLUB","KARATE_GN2","KARATE_LOUV"]: s=s.replace("{{"+k+"}}",K[k])
assert "{{" not in s, s[s.index("{{")-50:s.index("{{")+50]
TW='<div class="tw" style="overflow-x:auto">'
def wrap(m):
    pre=s[:m.start()].rstrip()
    return m.group(0) if pre.endswith(TW) or 'class="adj"' in m.group(0)[:40] else TW+m.group(0)+"</div>"
s=re.sub(r"<table[\s\S]*?</table>", wrap, s)
open("../../grafelmelet-halozattudomany/08-kozossegek/index.html","w",encoding="utf-8").write(s)
PY
cat w0.js w1.js $( [ -f w2.js ] && echo w2.js ) w9.js > $D/widgets.js
if [ -f q1.js ] && [ -f q2.js ]; then
  { printf '/* =========================================================\n   Gráfelmélet és hálózattudomány 8. fejezet – kvízek\n   (a kérdéstípusok leírását lásd: assets/quiz.js)\n   Minden számot Pythonnal ellenőriztünk.\n   ========================================================= */\n(function () {\n  const R = String.raw;\n\n  const QUIZZES = {\n'
    cat q1.js; printf '\n'; cat q2.js
    printf '\n  };\n\n  window.Quiz && window.Quiz.mountAll(QUIZZES);\n})();\n'; } > $D/quizzes.js
fi
node --check $D/widgets.js
[ -f $D/quizzes.js ] && node --check $D/quizzes.js
echo built
