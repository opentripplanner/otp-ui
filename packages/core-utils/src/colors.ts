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
  const backgroundColor = isDark ? DARK_BACKGROUND : LIGHT_BACKGROUND;
  const fallbackColor = isDark ? LIGHT_BACKGROUND : DARK_BACKGROUND;
  if (!chroma.valid(hexColor) || !chroma.valid(backgroundColor)) return null;

  const colorHex = chroma(hexColor)
    .hex()
    .toLowerCase();
  const bgHex = chroma(backgroundColor)
    .hex()
    .toLowerCase();

  try {
    if (chroma.contrast(colorHex, bgHex) >= contrastTarget) return null;
  } catch {
    // If the contrast check throws, continue adjusting
  }

  const bgLuminance = chroma(bgHex).luminance();
  const isLightBackground = bgLuminance > 0.5;

  const factor = isLightBackground ? 1 / contrastTarget : contrastTarget;
  const targetLuminance = (bgLuminance + 0.05) * factor - 0.05;

  if (targetLuminance < 0 || targetLuminance > 1) {
    return fallbackColor;
  }

  return chroma(colorHex)
    .luminance(targetLuminance)
    .hex()
    .toLowerCase();
};

export { adjustColorForContrast };
