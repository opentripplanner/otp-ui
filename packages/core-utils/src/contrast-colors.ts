import chroma from "chroma-js";
import { contrastRatio } from "wcag-contrast-utils";

const WCAG_AA_NON_TEXT_CONTRAST = 3.5; // 1.4.11 Non-text Contrast: https://www.w3.org/TR/WCAG21/#non-text-contrast
const LIGHTNESS_STEP_PERCENT = 1; // 1% lightness adjustment per iteration
const MAX_ITERATIONS = 100;

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
 * - null if original color already meets contrast
 * - adjusted hex if modification needed
 * - fallback black/white if conversion fails
 *
 * Strategy:
 * - Decide direction (darken vs lighten) based on background brightness
 * - Step lightness using tinycolor lighten/darken until contrast passes or limit reached
 */
const adjustColorForContrast = (
  hexColor: string
): { light: string | null; dark: string | null } => {
  const LIGHT_BACKGROUND = "#dbd9d8";
  const DARK_BACKGROUND = "#1a364e";
  const adjustForBackground = (backgroundColor: string): string | null => {
    if (!chroma.valid(hexColor) || !chroma.valid(backgroundColor)) return null;
    const fullHex = chroma(hexColor)
      .hex()
      .toLowerCase();
    const bgHex = chroma(backgroundColor)
      .hex()
      .toLowerCase();

    if (getContrast(fullHex, bgHex) >= WCAG_AA_NON_TEXT_CONTRAST) {
      return null;
    }

    const isLightBackground = chroma(bgHex).get("hsl.l") > 0.5;

    const adjust = (working: chroma.Color, iterationsLeft: number): string => {
      if (iterationsLeft === 0) {
        return isLightBackground ? DARK_BACKGROUND : LIGHT_BACKGROUND;
      }
      const current = working.get("hsl.l");
      const nextL = isLightBackground
        ? Math.max(0, current - LIGHTNESS_STEP_PERCENT / 100)
        : Math.min(1, current + LIGHTNESS_STEP_PERCENT / 100);
      const next = working.set("hsl.l", nextL);
      const adjustedHex = next.hex().toLowerCase();
      if (getContrast(adjustedHex, bgHex) >= WCAG_AA_NON_TEXT_CONTRAST) {
        return adjustedHex;
      }
      // Stop if we've hit lightness extremes
      const lightness = next.get("hsl.l");
      if (
        (isLightBackground && lightness <= 0) ||
        (!isLightBackground && lightness >= 1)
      ) {
        return isLightBackground ? DARK_BACKGROUND : LIGHT_BACKGROUND;
      }
      return adjust(next, iterationsLeft - 1);
    };

    return adjust(chroma(fullHex), MAX_ITERATIONS);
  };

  return {
    light: adjustForBackground(LIGHT_BACKGROUND),
    dark: adjustForBackground(DARK_BACKGROUND)
  };
};

export default adjustColorForContrast;
