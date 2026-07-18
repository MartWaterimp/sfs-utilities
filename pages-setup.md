# GitHub Pages setup

The site files already live on `main`.

## Fastest option: deploy from branch

1. Open https://github.com/MartWaterimp/sfs-utilities/settings/pages
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**
3. Branch: `main`
4. Folder: `/ (root)`
5. Click **Save**
6. Wait 1-2 minutes, then open https://martwaterimp.github.io/sfs-utilities/

## Optional: GitHub Actions deploy

If you want Actions instead of branch deploy:

1. Settings → Pages → Source: **GitHub Actions**
2. Add `.github/workflows/deploy-pages.yml` from this repo's local copy or paste the workflow from the README
3. Run the workflow from the Actions tab

Note: creating workflow files needs a GitHub token with the `workflow` scope. The connected GitHub integration can edit normal files, but may not be able to write workflow files.
