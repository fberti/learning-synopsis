#!/bin/sh
# helyi szerver indítása, Playwright-teszt, szerver leállítása PID-del
cd "$(dirname "$0")/../.." || exit 1
cat _parts/ms6/w0.js _parts/ms6/w2.js _parts/ms6/w9.js > _parts/ms6/wtest2-widgets.js
PORT=8766
python3 -m http.server $PORT >/dev/null 2>&1 &
SP=$!
sleep 1
uv run -q --with playwright python -I _parts/calc/wms6_pw.py $PORT _parts/ms6/shots2 > _parts/calc/wms6_pw_out.json
RC=$?
kill $SP
exit $RC
