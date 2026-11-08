#!/bin/sh
# helyi szerver indítása, Playwright-teszt, szerver leállítása PID-del
cd "$(dirname "$0")/../.." || exit 1
cat _parts/ms7/w0.js _parts/ms7/w2.js _parts/ms7/w9.js > _parts/ms7/wtest2-widgets.js
node --check _parts/ms7/wtest2-widgets.js || exit 1
PORT=8767
python3 -m http.server $PORT >/dev/null 2>&1 &
SP=$!
sleep 1
uv run -q --with playwright python -I _parts/calc/wms7_pw.py $PORT _parts/ms7/shots2 > _parts/calc/wms7_pw_out.json
RC=$?
kill $SP
exit $RC
