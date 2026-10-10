#!/bin/sh
exec uv run -q --with pandas --with numpy --with scikit-learn --with scipy --with umap-learn python -I "$@"
