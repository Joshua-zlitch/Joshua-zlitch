# ATLAS // Asset Documentation

This directory contains static and generated visual assets supporting the **ATLAS** autonomous interface system for the GitHub Profile.

---

## Asset Index

| Asset | Type | Purpose | Dimensions | Dependencies |
| :--- | :--- | :--- | :--- | :--- |
| `atlas-header.svg` | Scalable Vector Graphic | System boot hero header, Monocraft title, animated telemetry cycling | 880 × 230 px | None (Self-contained CSS/SVG) |
| `system-divider.svg` | Scalable Vector Graphic | Architectural separator between console telemetry sections | 880 × 24 px | None (Self-contained) |
| `atlas-footer.svg` | Scalable Vector Graphic | Session termination console, node signature, persistence indicator | 880 × 140 px | None (Self-contained) |

---

## Palette Tokens

All assets strictly adhere to the ATLAS dark console color palette:

- **`BACKGROUND` (`#080B10`)**: Deep void base canvas.
- **`SURFACE` (`#0D1219`)**: Structural console frames and terminal plates.
- **`SURFACE_ALT` (`#111722`)**: Grid elements and secondary telemetry containers.
- **`PRIMARY` (`#8B9DFF`)**: ATLAS primary blue-violet luminescence.
- **`PRIMARY_DIM` (`#5967A5`)**: Structural corner brackets and secondary labels.
- **`TEXT` (`#D8DCE7`)**: High-contrast readout foreground.
- **`MUTED` (`#7A8294`)**: System coordinates, indices, and operational status copy.
- **`SUCCESS` (`#6EE7B7`)**: Active telemetry link and system online markers.
- **`WARNING` (`#F4C95D`)**: Diagnostic / caution markers (used sparingly).
- **`BORDER` (`#202938`)**: Precision 1px hairline structural dividers.

---

## Typography & GitHub CDN Compatibility

1. **GitHub Camo Proxy Compatibility**:
   GitHub's image sanitizer (`camo.githubusercontent.com`) removes external web font links (`@import` or `<link>`).
   Assets specify a resilient font stack starting with `'Monocraft'`, followed by standard programming monospace fallbacks:
   ```css
   font-family: 'Monocraft', 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace;
   ```
2. **Animation**:
   `atlas-header.svg` uses CSS keyframe animations for message cycling and terminal cursor blinking. These animations execute natively in browser SVG rendering and GitHub camo cached views without relying on JavaScript.

---

## Customization Guide

### Updating `YOUR_NAME` in `atlas-header.svg`
To personalize the hero header:
1. Open `assets/atlas-header.svg`.
2. Locate the main title element at line ~78:
   ```xml
   <text x="0" y="44" fill="#D8DCE7" font-size="28" font-weight="800" class="mono" letter-spacing="3">
     ATLAS <tspan fill="#8B9DFF">//</tspan> <tspan fill="#8B9DFF">YOUR_NAME</tspan>
   </text>
   ```
3. Replace `YOUR_NAME` with your actual name or callsign.
