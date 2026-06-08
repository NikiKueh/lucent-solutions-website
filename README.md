# lucent-solutions-website

Recovered codebase for the live website at `https://lucent-solutions.tech`.

## Source of truth for this initial import
This repository was bootstrapped from the VPS document root that serves the live site:

- `/var/www/lucent`

Only files from the `lucent-solutions.tech` website were included.
`lucent-studio` files were intentionally excluded.

## Current stack
This site is currently a static/standalone frontend that loads React and Babel from CDNs and executes the `.jsx` files directly in the browser.

Key entry files:

- `index.html`
- `styles-v2.css`
- `lucent-data.jsx`
- `lucent-chrome.jsx`
- `lucent-mockups.jsx`
- `page-*.jsx`

## Notes
There is currently no build tool or package manager config in the recovered codebase.

## Deploy
### Local deploy on the VPS
This repo includes `scripts/deploy-live.sh`.

It syncs the static site into the live webroot, writes `BUILD_INFO.txt`, and fixes ownership/permissions:

```bash
chmod +x scripts/deploy-live.sh
./scripts/deploy-live.sh
```

Optional override:

```bash
TARGET_DIR=/var/www/lucent ./scripts/deploy-live.sh
```

### GitHub Actions live deploy
A starter workflow exists at `.github/workflows/deploy.yml`.

Expected repository secrets:
- `VPS_HOST`
- `VPS_USER`
- `VPS_SSH_KEY`
- `VPS_APP_DIR` — checkout path on the VPS, e.g. `/root/workspaces/lucent-solutions-website`
- `VPS_DEPLOY_DIR` — live webroot, e.g. `/var/www/lucent`

The workflow rsyncs the repo to the VPS and then runs `scripts/deploy-live.sh` there.
