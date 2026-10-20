#!/usr/bin/env bash
set -euo pipefail

# Publishes the Vite build (dist/) into the live webroot.
# On the VPS without CI:  npm ci && npm run build && ./scripts/deploy-live.sh

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE_DIR="${SOURCE_DIR:-$ROOT_DIR/dist}"
TARGET_DIR="${TARGET_DIR:-/var/www/lucent}"
BUILD_INFO_FILE="$TARGET_DIR/BUILD_INFO.txt"

if ! command -v rsync >/dev/null 2>&1; then
  echo "rsync is required" >&2
  exit 1
fi

if [ ! -f "$SOURCE_DIR/index.html" ]; then
  echo "No build found in $SOURCE_DIR - run 'npm ci && npm run build' first" >&2
  exit 1
fi

mkdir -p "$TARGET_DIR"

rsync -av --delete "$SOURCE_DIR/" "$TARGET_DIR/"

commit_sha="${COMMIT_SHA:-$(git -C "$ROOT_DIR" rev-parse HEAD 2>/dev/null || echo unknown)}"
commit_sha="${commit_sha:0:7}"
deployed_at="$(date -u +'%Y-%m-%dT%H:%M:%SZ')"

cat > "$BUILD_INFO_FILE" <<EOF
commit: $commit_sha
deployed_at_utc: $deployed_at
source_repo: NikiKueh/lucent-solutions-website
source_dir: $SOURCE_DIR
target_dir: $TARGET_DIR
EOF

# A dedicated deploy user owns its webroot; only root may change ownership.
if [ "$(id -u)" -eq 0 ]; then
  chown -R www-data:www-data "$TARGET_DIR"
fi
find "$TARGET_DIR" -type d -exec chmod 755 {} \;
find "$TARGET_DIR" -type f -exec chmod 644 {} \;

# The optional mail API is configured once on the VPS; static-only deploys still work.
if command -v systemctl >/dev/null 2>&1 && systemctl is-active --quiet lucent-contact.service; then
  (cd "$ROOT_DIR" && npm ci --omit=dev --ignore-scripts)
  if [ "$(id -u)" -eq 0 ]; then
    systemctl restart lucent-contact.service
  else
    sudo -n systemctl restart lucent-contact.service
  fi
fi

echo "Deployed $commit_sha to $TARGET_DIR at $deployed_at"
