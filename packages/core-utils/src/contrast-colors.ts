import chroma from "chroma-js";
import { contrastRatio } from "wcag-contrast-utils";

const WCAG_AA_NON_TEXT_CONTRAST = 3.5; // 1.4.11 Non-text Contrast: https://www.w3.org/TR/WCAG21/#non-text-contrast
const LIGHTNESS_STEP_PERCENT = 1; // 1% lightness adjustment per iteration
const MAX_ITERATIONS = 100;

export const LIGHT_BACKGROUND = "#dbd9d8";
export const DARK_BACKGROUND = "#1a364e";

/**
 * Calculates WCAG 2.1 contrast ratio between two hex colors.
 * Defensive try/catch: return 0 if library throws.
 */
const getContrast = (foreground: string, background: string): number => {
  try {
    return contrastRatio(foreground, background);
  } catch (error) {
    return 0;
  }
};

/**
 * Adjusts a color's lightness to meet WCAG AA contrast (>= 3:1 for graphics/large text).
 * Returns:
 * - null if the color already meets contrast against the given background
 * - adjusted hex if modification was needed
 * - fallback color if lightness limits or max iterations are reached
 *
 * Strategy:
 * - Decide direction (darken vs lighten) based on background brightness
 * - Recursively step lightness until contrast passes or limits are reached
 */
const adjustColorForContrast = (
  hexColor: string,
  backgroundColor: string,
  iterationsLeft = MAX_ITERATIONS
): string | null => {
  if (!chroma.valid(hexColor) || !chroma.valid(backgroundColor)) return null;

  const colorHex = chroma(hexColor)
    .hex()
    .toLowerCase();
  const bgHex = chroma(backgroundColor)
    .hex()
    .toLowerCase();

  if (getContrast(colorHex, bgHex) >= WCAG_AA_NON_TEXT_CONTRAST) {
    return null;
  }

  if (iterationsLeft === 0) {
    const isLight = chroma(bgHex).get("hsl.l") > 0.5;
    return isLight ? DARK_BACKGROUND : LIGHT_BACKGROUND;
  }

  const isLightBackground = chroma(bgHex).get("hsl.l") > 0.5;
  const current = chroma(colorHex).get("hsl.l");
  const nextL = isLightBackground
    ? Math.max(0, current - LIGHTNESS_STEP_PERCENT / 100)
    : Math.min(1, current + LIGHTNESS_STEP_PERCENT / 100);
  const next = chroma(colorHex).set("hsl.l", nextL);
  const adjustedHex = next.hex().toLowerCase();

  const lightness = next.get("hsl.l");
  if (
    (isLightBackground && lightness <= 0) ||
    (!isLightBackground && lightness >= 1)
  ) {
    return isLightBackground ? DARK_BACKGROUND : LIGHT_BACKGROUND;
  }

  return (
    adjustColorForContrast(adjustedHex, backgroundColor, iterationsLeft - 1) ??
    adjustedHex
  );
};

export default adjustColorForContrast;
