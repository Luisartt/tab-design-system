# TAB Logo Kit

Vector reproduction of the TAB (The Alternative Board) logo, traced from the
only source file provided — `assets/logo/tab-logo-color.png` (2338×971) — and
normalized to the brand's exact hex values. See `uploads/TAB - Design System.md.txt`
§1 "Logotipo" for the full identity guide.

**Colors used:** Azul TAB `#0F75BC` · Marino Logo `#181C4D`.

## Files

### SVG (primary — use these whenever possible)
| File | Contents | Use on |
|---|---|---|
| `tab-logo-color.svg` | Icon + "TAB" + ® + tagline, 2 colors | White or Perla `#EFEEF3` backgrounds (default) |
| `tab-logo-white.svg` | Full lockup, knockout white | Marino, Azul TAB, Azul Acción, or a photo veil |
| `tab-logo-navy.svg` | Full lockup, single Marino `#181C4D` | 1-color / low-cost print |
| `tab-wordmark-color.svg` | Icon + "TAB" + ®, **no tagline**, 2 colors | Widths under 90 px where the tagline loses legibility |
| `tab-wordmark-white.svg` | Same, knockout white | Same, on dark/colored backgrounds |
| `tab-icon-color.svg` | Icon only (no letters, no ®), 2 colors | Avatars, app icons, seals — never next to the full logo |
| `tab-icon-white.svg` | Icon only, knockout white | Dark/colored backgrounds |
| `tab-icon-navy.svg` | Icon only, single Marino | 1-color print/stamp |
| `favicon.svg` | Icon color, transparent | Browser tab / site favicon source |

All SVGs have a tight `viewBox`, `fill-rule="evenodd"` (no strokes, no raster
data), and a `<title>`. The S-curve stroke through the icon, the counters of
the letters, and the ® ring are genuine holes in the path data — they stay
transparent (the background shows through) in every color, including the
white and navy single-color versions.

### PNG exports (transparent background, from the SVGs above)
Lockups at 1200 px and 600 px wide: `tab-logo-color-1200.png`,
`tab-logo-color-600.png`, and the same pattern for `tab-logo-white`,
`tab-logo-navy`, `tab-wordmark-color`, `tab-wordmark-white`.
Icons at 512 px and 128 px wide: `tab-icon-color-512.png` /`-128.png`, and
the same for `tab-icon-white` and `tab-icon-navy`.

### App / social icons
| File | Spec | Background |
|---|---|---|
| `favicon-32.png`, `favicon-16.png` | Icon color, square | Transparent |
| `apple-touch-icon.png` | 180×180, icon color, ~16% padding | White |
| `avatar-400.png` | 400×400, icon **white**, ~22% padding | Azul TAB `#0F75BC` — icon sits inside the circle-safe zone for platforms that crop avatars to a circle |
| `avatar-400-light.png` | 400×400, icon color, ~22% padding | White |

### QA
`logo-sheet.png` (1600×1000) is a contact sheet of every variant on its
correct background, for visual review — it is not itself a brand asset.

## Clear space & minimum size (per the identity guide)
- **Clear space:** keep an empty margin on every side ≥ half the cap-height
  of the "TAB" letters (measure from the letterforms in `tab-logo-color.svg`
  / `tab-wordmark-color.svg`).
- **Minimum size:** 140 px / 30 mm wide with the tagline (`tab-logo-*`);
  90 px / 20 mm wide without it (`tab-wordmark-*`). Below that, use the icon
  alone.

## Don'ts (from the identity guide)
- Don't recolor outside the palette above (`#0F75BC` / `#181C4D`, or white).
- Don't use the 2-color version on Marino or any colored background — use
  `tab-logo-white.svg` instead.
- Don't stretch, skew or otherwise distort the mark.
- Don't apply the old sepia/script treatment, drop shadows, outlines or
  gradients to the logo.
- Don't place the icon-only mark next to the full lockup in the same piece.

## Provenance & a note on fidelity
No white, navy, icon or wordmark files were included in the source material —
only `tab-logo-color.png`. These SVGs were produced by separating that PNG
into its two color layers (by nearest brand color, using the alpha channel
as edge coverage) and auto-tracing each layer with potrace, then normalizing
the fills to the exact brand hexes and lightly optimizing the path data
(rounded coordinates, redundant nodes merged) with SVGO. Rendered back out at
the source resolution, each lockup differs from the original PNG by well
under 1% of its pixels, concentrated entirely in 1-pixel anti-aliasing at the
edges — not in the shapes themselves.

**If TAB HQ can provide the agency's master vector files (AI/EPS/PDF), they
should replace these traced SVGs**, which are a faithful reconstruction, not
the original artwork.
