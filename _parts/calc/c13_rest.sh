#!/bin/sh
cd "$(dirname "$0")"
./t13.sh c13_labels2.py > ../ch13/exp_labels2.out 2>&1 &
./t13.sh c13_exp.py depth > ../ch13/exp_depth.out 2>&1
wait
