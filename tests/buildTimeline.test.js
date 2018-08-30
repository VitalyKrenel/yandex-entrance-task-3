const { assert } = require('chai');
const { buildTimeline } = require('../src/buildTimeline.js');

describe('buildTimeline()', function () {
  describe('when 1 rated interval passed as arg', function () {
    const rates = [{
      from: 7,
      to: 14,
      value: 3.25,
      // Rate obj from input won't have a duration property,
      // it has to be calculated with .from and .to properties
      duration: 7,
    }];

    it(`should build a timeline with the length equals ${rates[0].duration}`,
      function () {
        const timeline = buildTimeline(rates);
        assert.equal(timeline.length, rates[0].duration);
      });

    it(`should have all items with value property equals ${rates[0].value}`,
      function () {
        const timeline = buildTimeline(rates);

        timeline.forEach((hourlyRate) => {
          assert.equal(hourlyRate.value, rates[0].value);
        });
      });
  });

  describe('when 2 rated interval passed as arg', function () {
    const rates = [
      {
        from: 23,
        to: 2,
        value: 5,
        duration: 3,
      },
      {
        from: 2,
        to: 7,
        value: 2.5,
        duration: 5,
      },
    ];

    const timeline = buildTimeline(rates);
    const hours = [23, 0, 1, 2, 3, 4, 5, 6];

    timeline.forEach((entry, i) => {
      it(`should have timeline[${i}] with hour property equals ${hours[i]}`,
        function () {
          assert.equal(entry.hour, hours[i]);
        });
    });
  });
});
