# Placidity's SFS Utilities

A small multi-page utility site for [Spaceflight Simulator](https://www.spaceflightsimulator.app/) by Stef Morojna.

## Live site

After GitHub Pages is enabled, the site is at:

**https://martwaterimp.github.io/sfs-utilities/**

## Pages

- `index.html` - Home
- `fuel-calculator.html` - Propellant mass and blueprint helper
- `about.html` - Project notes

## Features

- Material Design 3 styling
- Customizable fuel ratios, densities, M constants, and dry mass fractions
- Add, edit, remove, and reset fuels
- Dry mass listed for every fuel type
- Custom fuels saved with browser cookies

## GitHub Pages setup

This repo includes a GitHub Actions workflow (`.github/workflows/deploy-pages.yml`) that publishes the site from `main`.

1. Open the repo on GitHub: https://github.com/MartWaterimp/sfs-utilities
2. Go to **Settings → Pages**
3. Under **Build and deployment**, set **Source** to **GitHub Actions**
4. Open the **Actions** tab and run **Deploy GitHub Pages** (or push any commit to `main`)
5. Wait for the workflow to finish, then open https://martwaterimp.github.io/sfs-utilities/

If you prefer the older branch method instead of Actions:

1. Settings → Pages
2. Source: **Deploy from a branch**
3. Branch: `main` / folder: `/ (root)`
4. Save

## Local use

Open `index.html` in a browser, or serve the folder with any static file server.

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## License

Apache License 2.0
