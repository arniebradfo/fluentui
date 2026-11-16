'use strict';

const { PNG } = require('pngjs');

function compareExactPixels(reference, candidate) {
  const expected = PNG.sync.read(reference);
  const actual = PNG.sync.read(candidate);
  const width = Math.max(expected.width, actual.width);
  const height = Math.max(expected.height, actual.height);
  const diff = new PNG({ width, height });
  diff.data.fill(255);
  let differentPixels = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const inExpected = x < expected.width && y < expected.height;
      const inActual = x < actual.width && y < actual.height;
      const expectedOffset = (y * expected.width + x) * 4;
      const actualOffset = (y * actual.width + x) * 4;
      const different =
        inExpected !== inActual ||
        (inExpected &&
          inActual &&
          (expected.data[expectedOffset] !== actual.data[actualOffset] ||
            expected.data[expectedOffset + 1] !== actual.data[actualOffset + 1] ||
            expected.data[expectedOffset + 2] !== actual.data[actualOffset + 2] ||
            expected.data[expectedOffset + 3] !== actual.data[actualOffset + 3]));
      if (different) {
        differentPixels++;
        const offset = (y * width + x) * 4;
        diff.data[offset + 1] = 0;
        diff.data[offset + 2] = 0;
      }
    }
  }

  return {
    differentPixels,
    expectedSize: { width: expected.width, height: expected.height },
    actualSize: { width: actual.width, height: actual.height },
    diff: differentPixels > 0 ? PNG.sync.write(diff) : undefined,
  };
}

module.exports = { compareExactPixels };
