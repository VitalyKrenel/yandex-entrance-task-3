const { assert } = require('chai');

const { isDaytime } = require('../src/isDaytime.js');

describe('isDaytime()', function () {
  describe('when passed arg is day hour', function () {
    const day = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

    day.forEach((hour) => {
      it(`should return true for ${hour}`, function () {
        assert.equal(isDaytime(hour), true);
      });
    });
  });

  describe('when passed arg is night hour', function () {
    const night = [0, 1, 2, 3, 4, 5, 6, 21, 22, 23];

    night.forEach((hour) => {
      it(`should return false for ${hour}`, function () {
        assert.equal(isDaytime(hour), false);
      });
    });
  });
});
