/* eslint-disable no-bitwise */
export default hex => {
  const hexWithoutHash = hex.replace('#', '');
  const rgb = parseInt(hexWithoutHash, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;

  return [r, g, b];
};
