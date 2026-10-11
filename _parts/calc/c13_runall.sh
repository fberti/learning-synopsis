#!/bin/sh
cd "$(dirname "$0")"
./t13.sh c13_exp.py cora > ../ch13/exp_cora.out 2>&1
./t13.sh c13_exp.py labels > ../ch13/exp_labels.out 2>&1
./t13.sh c13_exp.py depth > ../ch13/exp_depth.out 2>&1
