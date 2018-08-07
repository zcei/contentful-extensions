// eslint-disable-next-line no-unused-vars
import { h } from 'preact';

import CopyText from './CopyText';
import hexToRgb from '../lib/hex-to-rgb';
import getColorBrightness from '../lib/get-color-brightness';

export default ({ color, ...props }) => {
  const colorInRgb = hexToRgb(color);
  const colorBrightness = getColorBrightness(...colorInRgb);
  return (
    <div
      class="cf-color"
      style={{
        backgroundColor: color
      }}
    >
      <CopyText
        class="cf-copytext"
        style={{ color: colorBrightness > 128 ? 'black' : 'white' }}
        value={color}
        {...props}
      />
    </div>
  );
};
