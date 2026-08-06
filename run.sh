#!/usr/bin/env bash
# Copyright 2026 Google Inc. All rights reserved.
#
# Startup script for Immediate UI Mode Showcase Server.
# Automatically detects and includes NVM / Node.js in PATH.

export PATH="$HOME/.nvm/versions/node/$(ls "$HOME/.nvm/versions/node" 2>/dev/null | tail -n 1)/bin:$PATH"

if ! command -v node &>/dev/null; then
  echo "Error: Could not find node binary in PATH or ~/.nvm/versions/node/." >&2
  exit 1
fi

exec node server.js "$@"
