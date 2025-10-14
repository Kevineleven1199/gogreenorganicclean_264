# GoGreenOrganicClean Site

This repository contains a snapshot of the website codebase (WordPress/PHP and assets).

## What's included
- `public/` WordPress core, themes, and plugins
- `mysqleditor/` database admin tooling
- `ssl_certificates/` and `private/` directories (if present)

## Git hygiene
- Secrets and environment-specific files are ignored via `.gitignore` (e.g., `public/wp-config.php`, `.env`, caches, and uploads).
- Binary assets are handled via `.gitattributes`.

## Initializing and pushing to GitHub
Use PowerShell from the repo root:

```powershell
# From the repository root
Set-Location "C:\Users\xbone\gogreenorganicclean_264"

# Initialize repo, add, and commit
git init -b main
git add .
git commit -m "Initialize repository with baseline .gitignore, .gitattributes, README"

# Add your GitHub remote (replace with your repo URL)
# Example (HTTPS):
# git remote add origin https://github.com/<your-username>/<your-repo>.git
# Example (SSH):
# git remote add origin git@github.com:<your-username>/<your-repo>.git

# Push initial commit
# git push -u origin main
```

If you prefer GitHub CLI and are already authenticated:

```powershell
# Replace the name/visibility as desired
# gh repo create <your-repo> --source . --public --push --disable-wiki --homepage "https://gogreenorganicclean.com"
```

## Notes
- Avoid committing credentials; keep `.env`, `wp-config.php`, and similar files out of version control.
- Large media in `public/wp-content/uploads/` is ignored by default.
