/**
 * Calculate the perceived brightness of a color.
 * Based on https://www.w3.org/TR/AERT/#color-contrast
 */
export default (r, g, b) => (r * 299 + g * 587 + b * 114) / 1000;
