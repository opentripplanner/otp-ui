import { contrastRatio } from "wcag-contrast-utils";
import { TinyColor } from "@ctrl/tinycolor";

const LIGHT_BACKGROUND = "#dbd9d8";
const DARK_BACKGROUND = "#1a364e";
const WCAG_AA_NON_TEXT_CONTRAST = 3.5; // 1.4.11 Non-text Contrast: https://www.w3.org/TR/WCAG21/#non-text-contrast
const LIGHTNESS_STEP_PERCENT = 1; // 1% lightness adjustment per iteration
const MAX_ITERATIONS = 100;

/**
 * Normalize a hex color:
 * - Remove leading '#'
 * - Expand 3-digit forms
 * - Validate allowed chars
 * Returns normalized '#rrggbb' or null if invalid.
 */
const normalizeHex = (input: string | null | undefined): string | null => {
    if (!input) return null;
    const color = new TinyColor(input);
    return color.isValid ? color.toHexString().toLowerCase() : null;
};

/**
 * Calculates WCAG 2.1 contrast ratio between two hex colors.
 * Defensive try/catch: return 0 if library throws.
 */
const getContrast = (foreground: string, background: string): number => {
    try {
        return contrastRatio(foreground, background);
    } catch {
        return 0;
    }
};

/**
 * Adjusts a color's lightness to meet WCAG AA contrast (>= 3:1 for graphics/large text).
 * Returns:
 * - null if original color already meets contrast
 * - adjusted hex if modification needed
 * - fallback black/white if conversion fails
 *
 * Strategy:
 * - Decide direction (darken vs lighten) based on background brightness
 * - Step lightness using tinycolor lighten/darken until contrast passes or limit reached
 */
const adjustColorForContrast = (
    hexColor: string,
    backgroundColor: string,
    threshold: number = WCAG_AA_NON_TEXT_CONTRAST
): string | null => {
    const fullHex = normalizeHex(hexColor);
    const bgHex = normalizeHex(backgroundColor);
    if (!fullHex || !bgHex) return null;

    const initialContrast = getContrast(fullHex, bgHex);
    if (initialContrast >= threshold) {
        return null;
    }

    const fg = new TinyColor(fullHex);
    const bg = new TinyColor(bgHex);

    const isLightBackground = bg.isLight();
    let working = fg.clone();

    let iterations = 0;
    while (iterations < MAX_ITERATIONS) {
        iterations += 1;
        working = isLightBackground
            ? working.darken(LIGHTNESS_STEP_PERCENT)
            : working.lighten(LIGHTNESS_STEP_PERCENT);

        const adjustedHex = working.toHexString().toLowerCase();
        const ratio = getContrast(adjustedHex, bgHex);
        if (ratio >= threshold) {
            return adjustedHex;
        }

        // Stop if we've hit lightness extremes
        const lightness = working.toHsl().l;
        if (
            (isLightBackground && lightness <= 0) ||
            (!isLightBackground && lightness >= 1)
        ) {
            break;
        }
    }
    // Fallback: return extreme color for best contrast
    return isLightBackground ? DARK_BACKGROUND : LIGHT_BACKGROUND;
};

/**
 * Calculates contrast-adjusted colors for both light and dark themes.
 * Each entry:
 * - null if original color already passes for that background
 * - hex string of adjusted color if modification was required
 */
export const calculateContrastColors = (
    hexColor: string
): {
    light: string | null;
    dark: string | null;
} => {
    return {
        light: adjustColorForContrast(hexColor, LIGHT_BACKGROUND),
        dark: adjustColorForContrast(hexColor, DARK_BACKGROUND)
    };
};
