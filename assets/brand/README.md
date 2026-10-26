# Brand source files

Put the official logo files here, then run `npm run brand` to rebuild the
favicon and app icons in `public/`.

| File | What it is | Used for |
|---|---|---|
| `logo.svg` (or `logo.png`) | Full logo for light backgrounds | Website header, footer source |
| `logo-light.svg` (or `logo-light.png`) | Full logo in white or ivory for dark backgrounds | Footer and dark sections |
| `icon.svg` (or `icon.png`) | Square symbol or monogram only, no small text | Favicon, Apple touch icon, app icons |

SVG is preferred. A PNG should have a transparent background and be at least
1024 px on its longest side. Any file you leave out falls back to the current
LH monogram.

These files are source material and are not published directly.
