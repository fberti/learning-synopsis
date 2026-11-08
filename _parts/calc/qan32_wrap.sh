#!/bin/sh
# node --check a q2.js töredékre burokkal (kimenet a calc mappába)
f=$(dirname "$0")/qan32_wrapped.js
{ echo '(function(){const R=String.raw; const Q={'; cat "$1"; echo '}; })();'; } > "$f"
node --check "$f" && echo "szintaxis OK"
