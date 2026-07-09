import chroma from "chroma-js";

export const LIGHT_BACKGROUND = "#dbd9d8";
export const DARK_BACKGROUND = "#1a364e";

const CONTRAST_TARGET = 3.5;

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
 * - Light bg: L_color = (L_bg + 0.05) / CONTRAST_TARGET - 0.05
 * - Dark  bg: L_color = CONTRAST_TARGET * (L_bg + 0.05) - 0.05
 */
const adjustColorForContrast = (
  hexColor: string,
  isDark = false
): string | null => {
  const backgroundColor = isDark ? DARK_BACKGROUND : LIGHT_BACKGROUND;
  if (!chroma.valid(hexColor) || !chroma.valid(backgroundColor)) return null;

  const colorHex = chroma(hexColor).hex().toLowerCase();
  const bgHex = chroma(backgroundColor).hex().toLowerCase();

  try {
    if (chroma.contrast(colorHex, bgHex) >= CONTRAST_TARGET) return null;
  } catch {
    // If the contrast check throws, continue adjusting
  }

  const bgLuminance = chroma(bgHex).luminance();
  const isLightBackground = bgLuminance > 0.5;

  const targetLuminance = isLightBackground
    ? (bgLuminance + 0.05) / CONTRAST_TARGET - 0.05 // darken the color
    : CONTRAST_TARGET * (bgLuminance + 0.05) - 0.05; // lighten the color

  if (targetLuminance < 0 || targetLuminance > 1) {
    return isLightBackground ? DARK_BACKGROUND : LIGHT_BACKGROUND;
  }

  return chroma(colorHex).luminance(targetLuminance).hex().toLowerCase();
};

export { adjustColorForContrast };
export default adjustColorForContrast;
