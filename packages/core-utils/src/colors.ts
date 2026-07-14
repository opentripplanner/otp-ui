import chroma from "chroma-js";

export const LIGHT_BACKGROUND = "#dbd9d8";
export const DARK_BACKGROUND = "#1a364e";

/**
 * Adjusts a color's luminance to meet WCAG AA contrast (>= 3.5:1) against
 * a given background by solving for the required luminance directly.
 *
 * Returns:
 * - null if the color already meets contrast against the given background
 * - adjusted hex if modification was needed
 * - fallback color if the required luminance is out of the achievable range
 * - throws if hexColor is not a valid color
 *
 * WCAG contrast formula: contrast = (L_lighter + 0.05) / (L_darker + 0.05)
 * Solving for the color's required luminance:
 * - Light bg: L_color = (L_bg + 0.05) / contrastTarget - 0.05
 * - Dark  bg: L_color = contrastTarget * (L_bg + 0.05) - 0.05
 *
 * We use chroma's luminance(value) setter — not brighten()/darken() — because
 * the contrast formula is defined in terms of relative luminance, so we can
 * solve for the exact target algebraically in one step. brighten/darken adjust
 * Lab L* by a fixed arbitrary step and would require iteration to hit a ratio.
 */
const adjustColorForContrast = (
  hexColor: string,
  isDark = false
): string | null => {
  const contrastTarget = 3.5;
  const bgColor = isDark ? DARK_BACKGROUND : LIGHT_BACKGROUND;

  if (!chroma.valid(hexColor)) throw new Error(`Invalid color: "${hexColor}"`);
  // Color already meets contrast; no adjustment needed
  if (chroma.contrast(hexColor, bgColor) >= contrastTarget) return null;

  const bgLuminance = chroma(bgColor).luminance();
  const factor = bgLuminance > 0.5 ? 1 / contrastTarget : contrastTarget;
  const targetLuminance = (bgLuminance + 0.05) * factor - 0.05;

  if (targetLuminance < 0 || targetLuminance > 1) {
    return isDark ? LIGHT_BACKGROUND : DARK_BACKGROUND;
  }

  return chroma(hexColor)
    .luminance(targetLuminance)
    .hex()
    .toLowerCase();
};

export { adjustColorForContrast };
