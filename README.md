# Placidity's SFS Utilities

A small multi-page utility site for [Spaceflight Simulator](https://www.spaceflightsimulator.app/) by Stef Morojna.

## Live site

After GitHub Pages is enabled, the site is at:

**https://martwaterimp.github.io/sfs-utilities/**

## Pages

- `index.html` - Home
- `fuel-calculator.html` - Propellant mass and blueprint helper
- `about.html` - Project notes

## Modules

Shared chrome lives in `modules/` and is loaded by `assets/js/site.js`:

- `modules/navbar.html`
- `modules/footer.html`

Because those files are loaded with `fetch`, serve the folder over HTTP (local server or GitHub Pages). Opening the HTML files directly from disk will not load the modules.

## Features

- Material Design 3 styling
- Shared navbar and footer modules
- Customizable fuel ratios, densities, M constants, and dry mass fractions
- Add, edit, remove, and reset fuels
- Dry mass listed for every fuel type
- Custom fuels saved with browser cookies

## GitHub Pages setup

1. Open the repo on GitHub: https://github.com/MartWaterimp/sfs-utilities
2. Go to **Settings → Pages**
3. Source: **Deploy from a branch**
4. Branch: `main` / folder: `/ (root)`
5. Save
6. Open https://martwaterimp.github.io/sfs-utilities/

## Local use

Serve the folder with any static file server:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## License

Apache License 2.0
