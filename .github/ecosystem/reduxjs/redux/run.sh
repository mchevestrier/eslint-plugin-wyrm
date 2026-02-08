#!/bin/bash

set -euo pipefail

export TIMING=1

CURRENT_REPO="reduxjs/redux"

cd "${CURRENT_REPO_PATH:?}" || exit 1

npx -y "eslint@${ESLINT_VERSION:?}" \
  --no-config-lookup --no-inline-config \
  --config "${WYRM_REPO_PATH:?}/.github/ecosystem/$CURRENT_REPO/eslint.ecosystem.mjs" \
  --suppress-all --suppressions-location "${WYRM_REPO_PATH:?}/.github/ecosystem/$CURRENT_REPO/eslint-suppressions.new.json"
 src test examples
