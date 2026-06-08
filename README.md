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
