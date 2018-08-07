import { clamp } from 'lodash';

/**
 * Calculate the perceived brightness of a color.
 * Based on https://www.w3.org/TR/AERT/#color-contrast
 */
const calculatePixelBrightness = (r, g, b) =>
  (r * 299 + g * 587 + b * 114) / 1000;

/**
 * Get the average brightness of (a section of) an image.
 * Adapted from https://stackoverflow.com/a/13766539/4620154
 */
export default (imageData, customThreshold = 128) => {
  const threshold = clamp(customThreshold, 0, 255);

  let lightPixels = 0;
  let darkPixels = 0;

  for (let x = 0, len = imageData.length; x < len; x += 4) {
    const pixelBrightness = calculatePixelBrightness(
      imageData[x],
      imageData[x + 1],
      imageData[x + 2]
    );
    if (pixelBrightness > threshold) {
      lightPixels += 1;
    } else {
      darkPixels += 1;
    }
  }

  const averageBrightness =
    (lightPixels - darkPixels) / (lightPixels + darkPixels);
  return Math.round(averageBrightness * 1000) / 1000;
};
