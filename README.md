# Blur whole page

A minimal Chrome extension that lets you blur any web page with a slider. Useful for obstructing the content of a page to visualize the shape and where visitor's eyes focus first.

## Features

- **Blur slider** — click the extension icon to open a small popup with a 0–10 px blur slider (0.5 px steps).
- **Persistent per tab** — blur stays active as you navigate and refresh within the same tab. It clears automatically when the browser is closed or the tab is closed.
- **Reset button** — the ✕ button in the popup removes the blur instantly.
- **Settings page** — right-click the extension icon → *Options* to open the About / attribution page.

## Development

### Prerequisites

- Node.js 18+

### Setup

```bash
npm install
```

### Running tests

```bash
npm test
```

Tests are written with [Vitest](https://vitest.dev/) + jsdom and cover all three JS modules (`content.js`, `background.js`, `popup.js`).

```bash
npm run test:watch   # re-runs on file changes
```

### Regenerating icons

The PNG icons in `icons/` are generated from `noun-blur-on-4180752.svg` using [sharp](https://sharp.pixelplumbing.com/). If you replace the SVG, regenerate them with:

```bash
npm run generate-icons
```

## Building extension

### Update the CHANGELOG.md

Make sure git-cliff is installed
`brew install git-cliff`

On release branch, with the version bump:
`{$version}` = version number about to be released

```bash
git add .
git commit -m "fix: Title of fix"
git cliff --unreleased --tag {$version} --prepend CHANGELOG.md
git add .
git commit --amend
```

### Firefox package

```bash
$ zip -r -FS ../blur-whole-page.zip * --exclude .git node_modules tests
```

### Chrome package

```bash
$ zip -r ../blur-whole-page.zip * --exclude .git node_modules tests
```

### Project structure

```
page-blur/
├── manifest.json          # Chrome extension manifest (MV3)
├── background.js          # Service worker — tracks per-tab blur state
├── content.js             # Injected into every page — applies CSS blur
├── popup.js               # Popup UI logic (exported init() for testing)
├── popup-entry.js         # Thin entry point loaded by popup.html
├── popup.html / .css      # Popup markup and styles
├── settings.html / .css   # About / attribution page
├── generate-icons.js      # One-time script to build PNG icons from SVG
├── icons/                 # Generated PNG icons (16, 48, 128 px)
├── tests/                 # Unit tests
│   ├── setup.js           # Chrome API mock and shared helpers
│   ├── content.test.js
│   ├── background.test.js
│   └── popup.test.js
└── vitest.config.js
```

## Contributing

1. Fork the repo and create a feature branch from `main`.
2. Follow the existing code style — small, readable functions; no unnecessary abstraction.
3. **Add or update tests** for any changed behaviour. All tests must pass (`npm test`) before opening a pull request.
4. Keep commits focused. A good commit message says *why*, not just *what*.
5. Open a pull request against `main` with a clear description of the change.

Bug reports and suggestions are welcome as GitHub Issues.

## Acknowledgements

Icon: "blur on" by Justin Blake from [Noun Project](https://thenounproject.com/browse/icons/term/blur-on/ "blur on Icons") (CC BY 3.0).

## Licence

MIT
