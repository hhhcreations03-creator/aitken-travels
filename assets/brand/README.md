# Brand source files

The official logo lives here. After replacing a file, run `npm run brand` to
rebuild every logo asset the website uses, then commit the results.

| File | What it is |
|---|---|
| `logo.png` | Full logo, brown on its beige background, high resolution. This is the master. |
| `logo-light.png` | Same artwork on a transparent background. Used only if `logo.png` is missing. |

The script separates the artwork from the background and writes, under `public/`:

- `brand/logo.png`, `brand/logo-light.png`: full stacked logo in brown and in cream (footer)
- `brand/symbol*.png`, `brand/wordmark*.png`: palms and name, used side by side in the header
- `favicon.ico`, `apple-touch-icon.png`, `brand/icon-*.png`: browser, Google and phone icons
- `og.jpg`: the link preview for WhatsApp, Facebook and X

These source files are not published directly.
