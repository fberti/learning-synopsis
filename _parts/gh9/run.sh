#!/bin/sh
cd "$(dirname "$0")"; exec uv run -q --with networkx --with numpy --with scipy python "$@"
