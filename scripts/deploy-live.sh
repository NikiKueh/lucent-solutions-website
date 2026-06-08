#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET_DIR="${TARGET_DIR:-/var/www/lucent}"
BUILD_INFO_FILE="$TARGET_DIR/BUILD_INFO.txt"

if ! command -v rsync >/dev/null 2>&1; then
  echo "rsync is required" >&2
  exit 1
fi

mkdir -p "$TARGET_DIR"

rsync -av --delete \
  --exclude='.git/' \
  --exclude='.github/' \
  --exclude='scripts/' \
  --exclude='README.md' \
  --exclude='.gitignore' \
  --exclude='designsystem.md' \
  "$ROOT_DIR/" "$TARGET_DIR/"

commit_sha="$(git -C "$ROOT_DIR" rev-parse --short HEAD 2>/dev/null || echo unknown)"
deployed_at="$(date -u +'%Y-%m-%dT%H:%M:%SZ')"

cat > "$BUILD_INFO_FILE" <<EOF
commit: $commit_sha
deployed_at_utc: $deployed_at
source_repo: NikiKueh/lucent-solutions-website
source_dir: $ROOT_DIR
target_dir: $TARGET_DIR
EOF

chown -R www-data:www-data "$TARGET_DIR"
find "$TARGET_DIR" -type d -exec chmod 755 {} \;
find "$TARGET_DIR" -type f -exec chmod 644 {} \;

echo "Deployed $commit_sha to $TARGET_DIR at $deployed_at"
