/**
 * colorScale.ts — pure server-safe color utility
 *
 * Given a base hex color (the admin's chosen brand color, treated as the
 * "500" shade anchor), generates a full 11-shade color scale (50–950).
 * The admin-selected color is used as-is in BOTH light and dark mode — no
 * automatic dark-mode inversion.  If the admin also configures a separate
 * dark-mode color, a `.dark { }` override is generated for that scale too.
 *
 * Output is a CSS string injected via <style> in layout.tsx.
 * No browser APIs, no external dependencies.
 */

/* ── Internal helpers ──────────────────────────────────────────── */

function hexToRgb(hex: string): [number, number, number] {
    const clean = hex.replace(/^#/, "");
    return [
        parseInt(clean.slice(0, 2), 16),
        parseInt(clean.slice(2, 4), 16),
        parseInt(clean.slice(4, 6), 16),
    ];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    if (max === min) return [0, 0, l];
    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    let h = 0;
    switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
    }
    return [h * 360, s, l];
}

function _hue2rgb(p: number, q: number, t: number): number {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
}

function hslToHex(h: number, s: number, l: number): string {
    h /= 360;
    let r: number, g: number, b: number;
    if (s === 0) {
        r = g = b = l;
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = _hue2rgb(p, q, h + 1 / 3);
        g = _hue2rgb(p, q, h);
        b = _hue2rgb(p, q, h - 1 / 3);
    }
    const toHex = (x: number) =>
        Math.round(Math.min(255, Math.max(0, x * 255)))
            .toString(16)
            .padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/* ── Scale generation ──────────────────────────────────────────── */

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
type Shade = (typeof SHADES)[number];

/**
 * Generate an 11-shade color scale from a base hex color.
 *
 * The base hex defines the hue and saturation of the scale.
 * Its actual lightness is used as the anchor for the 500 shade —
 * lighter shades interpolate up toward L=0.96, darker ones down toward L=0.06.
 *
 * Returns a Map<shade, hex> for all 11 shades.
 */
export function generateColorScale(baseHex: string): Map<Shade, string> {
    const [r, g, b] = hexToRgb(baseHex);
    const [h, s, baseL] = rgbToHsl(r, g, b);

    const scale = new Map<Shade, string>();

    for (const shade of SHADES) {
        let l: number;
        if (shade === 500) {
            l = baseL;
        } else if (shade < 500) {
            // Lighter shades: interpolate from baseL up toward 0.96
            // t goes from 0.20 (400) to 0.90 (50)
            const t = (500 - shade) / 500;
            l = baseL + t * (0.96 - baseL);
        } else {
            // Darker shades: interpolate from baseL down toward 0.06
            // t goes from 0.20 (600) to 0.90 (950)
            const t = (shade - 500) / 500;
            l = baseL - t * (baseL - 0.06);
        }
        scale.set(shade, hslToHex(h, s, l));
    }

    return scale;
}

/**
 * Dark-mode source map: for each shade in dark mode, use the value of
 * the corresponding light-mode shade. This creates a reversed scale where
 * 50 (usually the lightest) becomes very dark, matching the dark-theme
 * convention already established in globals.css.
 *
 * Special case: dark 500 maps to light 400 (one step lighter) so that
/* ── Scale generation ──────────────────────────────────────────── */

/**
 * Build a CSS string that overrides custom color properties for a single
 * color family.
 *
 * @param varPrefix - e.g. `"color-primary"` or `"color-blood-bank"`
 * @param lightHex  - validated 6-digit hex used for `:root` (both modes by default)
 * @param darkHex   - optional validated 6-digit hex used for `.dark` override.
 *                    If omitted, no `.dark` block is emitted → the color stays
 *                    the same in dark mode (light-mode value is reused).
 */
function buildScaleCss(
    varPrefix: string,
    lightHex: string,
    darkHex?: string,
): string {
    const lightScale = generateColorScale(lightHex);
    const getLight = (shade: Shade) => lightScale.get(shade) ?? lightHex;

    const lightLines = SHADES
        .map((s) => `  --${varPrefix}-${s}: ${getLight(s)};`)
        .join("\n");

    let css = `:root {\n${lightLines}\n}`;

    if (darkHex) {
        const darkScale = generateColorScale(darkHex);
        const getDark = (shade: Shade) => darkScale.get(shade) ?? darkHex;
        const darkLines = SHADES
            .map((s) => `  --${varPrefix}-${s}: ${getDark(s)};`)
            .join("\n");
        css += `\n.dark {\n${darkLines}\n}`;
    }

    return css;
}

/**
 * Build the combined CSS string that overrides the primary brand color
 * and/or the blood-bank color from the admin's selections.
 *
 * - If only `primaryColor` is set → same color in light AND dark mode.
 * - If `primaryColorDark` is also set → `.dark` block uses that separate scale.
 * - Same logic for blood-bank colors.
 *
 * Returns an empty string if all inputs are falsy or invalid.
 */
export function buildDynamicColorCss(
    primaryColor?: string | null,
    bloodBankColor?: string | null,
    primaryColorDark?: string | null,
    bloodBankColorDark?: string | null,
): string {
    const HEX_RE = /^#[0-9A-Fa-f]{6}$/;
    const valid = (v?: string | null) => v && HEX_RE.test(v) ? v : undefined;
    const parts: string[] = [];

    const primary = valid(primaryColor);
    const primaryDark = valid(primaryColorDark);
    if (primary) {
        parts.push(buildScaleCss("color-primary", primary, primaryDark));
    }

    const blood = valid(bloodBankColor);
    const bloodDark = valid(bloodBankColorDark);
    if (blood) {
        parts.push(buildScaleCss("color-blood-bank", blood, bloodDark));
    }

    return parts.join("\n\n");
}

/** @deprecated Use `buildDynamicColorCss` instead */
export function buildPrimaryColorCss(baseHex: string | null | undefined): string {
    return buildDynamicColorCss(baseHex);
}
