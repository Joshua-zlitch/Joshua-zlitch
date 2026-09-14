# SYSTEM // Asset Documentation

This directory contains static and generated visual assets supporting the autonomous interface console for the GitHub Profile of **Benitto Joshua (`Joshua-zlitch`)**.

---

## Asset Index

| Asset | Type | Purpose | Dimensions | Generation / Data Source |
| :--- | :--- | :--- | :--- | :--- |
| `system-header.svg` | Scalable Vector Graphic | System boot hero header, Monocraft title, animated telemetry stream | 880 × 230 px | Static SVG with CSS keyframe animation |
| `system-divider.svg` | Scalable Vector Graphic | Architectural separator between console telemetry sections | 880 × 24 px | Static vector with precision hairline styling |
| `system-footer.svg` | Scalable Vector Graphic | Session termination console, node signature, persistence indicator | 880 × 140 px | Static vector with node hash & telemetry markers |
| `github-telemetry.svg` | Scalable Vector Graphic | Real verified repository statistics (repos, stars, followers) | 430 × 195 px | Generated via `scripts/sync-profile.js` |
| `top-languages.svg` | Scalable Vector Graphic | Byte-weighted language distribution across all public repositories | 430 × 195 px | Generated via `scripts/sync-profile.js` |

---

## Palette Tokens

All assets strictly adhere to the dark console color palette:

- **`BACKGROUND` (`#080B10`)**: Deep void base canvas.
- **`SURFACE` (`#0D1219`)**: Structural console frames and terminal plates.
- **`SURFACE_ALT` (`#111722`)**: Grid elements and secondary telemetry containers.
- **`PRIMARY` (`#8B9DFF`)**: Primary blue-violet luminescence.
- **`PRIMARY_DIM` (`#5967A5`)**: Structural corner brackets and secondary labels.
- **`TEXT` (`#D8DCE7`)**: High-contrast readout foreground.
- **`MUTED` (`#7A8294`)**: System coordinates, indices, and operational status copy.
- **`SUCCESS` (`#6EE7B7`)**: Active telemetry link and system online markers.
- **`WARNING` (`#F4C95D`)**: Diagnostic / caution markers (used sparingly).
- **`BORDER` (`#202938`)**: Precision 1px hairline structural dividers.

---

## Automated Profile & Telemetry Sync

To manually synchronize commit rankings and regenerate `github-telemetry.svg` and `top-languages.svg`:

```bash
node scripts/sync-profile.js
```

This workflow is also executed automatically on schedule and on push via [`.github/workflows/profile-stats.yml`](../.github/workflows/profile-stats.yml).
