#!/bin/bash
set -euo pipefail

ROOT="/Users/ninja/Documents/law"
NODE_BIN="${NODE_BIN:-/Users/ninja/.nvm/versions/node/v22.21.1/bin/node}"
MAX_PER_RUN="${MAX_PER_RUN:-1}"

echo "Starting daily task at $(date)"
mkdir -p "$ROOT/logs"
cd "$ROOT"

if [ ! -x "$NODE_BIN" ]; then
  if command -v node >/dev/null 2>&1; then
    NODE_BIN="$(command -v node)"
  else
    echo "Node.js binary not found"
    exit 1
  fi
fi

"$NODE_BIN" scripts/keyword-queue.mjs --max-per-run "$MAX_PER_RUN"

echo "Finished daily task at $(date)"
