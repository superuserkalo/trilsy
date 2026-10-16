#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
command -v xcodegen >/dev/null || { echo 'Install XcodeGen: brew install xcodegen'; exit 1; }
xcodegen generate
# Xcode 26 asks to trust package plugins and macros (mlx-swift ships a build plugin); a headless build cannot answer, so skip the prompt.
xcodebuild -project Trilsy.xcodeproj -scheme Trilsy -configuration Debug -destination 'platform=macOS,arch=arm64' -derivedDataPath build \
  -skipPackagePluginValidation -skipMacroValidation CODE_SIGN_IDENTITY=- test
