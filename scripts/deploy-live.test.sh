#!/usr/bin/env bash
set -euo pipefail

if [ "$(id -u)" -eq 0 ]; then
  echo "Run this regression test as an unprivileged user" >&2
  exit 1
fi

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
fixture="$(mktemp -d)"
trap 'rm -rf -- "$fixture"' EXIT
mkdir -p "$fixture/app/scripts" "$fixture/app/dist" "$fixture/webroot" "$fixture/bin"
cp "$script_dir/deploy-live.sh" "$fixture/app/scripts/"
printf 'new release\n' > "$fixture/app/dist/index.html"
printf 'obsolete\n' > "$fixture/webroot/obsolete.html"
# Keep the test independent of any contact service on the test host.
printf '#!/bin/sh\nexit 3\n' > "$fixture/bin/systemctl"
chmod +x "$fixture/bin/systemctl"
cd "$fixture/app"

PATH="$fixture/bin:$PATH" TARGET_DIR="$fixture/webroot" COMMIT_SHA=abcdef123456 \
  bash "$fixture/app/scripts/deploy-live.sh"

cmp "$fixture/app/dist/index.html" "$fixture/webroot/index.html"
test ! -e "$fixture/webroot/obsolete.html"
grep -qx 'commit: abcdef1' "$fixture/webroot/BUILD_INFO.txt"
test "$(stat -c %u "$fixture/webroot/index.html")" = "$(id -u)"
test "$(stat -c %a "$fixture/webroot/index.html")" = 644
echo "Unprivileged deployment regression passed"
