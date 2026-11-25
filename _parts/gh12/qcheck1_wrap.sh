#!/bin/sh
# Szintaxis-ellenőrzés a q1.js töredékre: sh qcheck1_wrap.sh
cd "$(dirname "$0")"
OUT=qcheck1_wrapped.js
{ echo '(function(){const R=String.raw; const Q={'; cat q1.js; echo '}; })();'; } > $OUT
node --check $OUT && echo "szintaxis OK"
