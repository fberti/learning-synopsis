#!/bin/sh
exec uv run -q --index https://download.pytorch.org/whl/cpu --with torch --with numpy --with scipy --with networkx --with scikit-learn python -I "$@"
