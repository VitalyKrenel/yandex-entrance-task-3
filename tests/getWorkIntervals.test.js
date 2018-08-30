const { assert } = require('chai');
const { getWorkIntervals } = require('../src/getWorkIntervals.js');

const generateTimeline = ({
  length = 24,
  from = 0,
  valueList = [],
  loadList = [],
}) => {
  const timeline = new Array(length).fill({}).map((item, i) => ({
    hour: (i + from) % 24,
    value: valueList[i] || 1,
    load: loadList[i] || 0,
  }));

  return timeline;
};

describe('getWorkIntervals()', function () {
  describe('when timeline = 5 hour', function () {
    const device = {
      duration: 2,
      power: 1000,
    };

    const timeline = [
      { hour: 0, value: 1 },
      { hour: 1, value: 2.5 },
      { hour: 2, value: 3 },
      { hour: 3, value: 2.3 },
      { hour: 4, value: 2 },
    ];
    const workIntervalList = getWorkIntervals(timeline, device);

    it(`should return array with length property equals ${timeline.length}`,
      function () {
        assert.equal(workIntervalList.length, timeline.length);
      });
  });

  describe('when device\'s duration = 2 check each entry {length} property',
    function () {
      const device = {
        duration: 2,
        power: 1000,
      };

      const timeline = [
        { hour: 0, value: 1 },
        { hour: 1, value: 2.5 },
        { hour: 2, value: 3 },
        { hour: 3, value: 2.3 },
        { hour: 4, value: 2 },
      ];

      const workIntervalList = getWorkIntervals(timeline, device);

      workIntervalList.forEach((interval, i) => {
        it(`expect array[${i}]'s length to be equal to ${device.duration}`,
          function () {
            assert.equal(interval.length, device.duration);
          });
      });
    });

  describe('when device\'s duration = 2 check each entry {average} property',
    function () {
      const device = {
        duration: 2,
        power: 1000,
      };

      const timeline = [
        { hour: 0, value: 1 },
        { hour: 1, value: 2.5 },
        { hour: 2, value: 3 },
        { hour: 3, value: 2.3 },
        { hour: 4, value: 2 },
      ];

      const averages = [
        1.75,
        2.75,
        2.65,
        2.15,
        1.5,
      ];

      const workIntervalList = getWorkIntervals(timeline, device);

      workIntervalList.forEach((interval, i) => {
        it(`expect array[${i}]'s average property to be equal to ${averages[i]}`,
          function () {
            assert.equal(interval.average, averages[i]);
          });
      });
    });

  describe('when max load equals 0', function () {
    const device = {
      duration: 2,
      power: 1000,
    };

    const timeline = generateTimeline({ length: 5 });

    const maxLoad = 0;
    const workIntervalList = getWorkIntervals(timeline, device, maxLoad);

    console.log(timeline);

    it('should return array with length equals 0', function () {
      assert.equal(workIntervalList.length, 0);
    });
  });

  describe('when only the 1st hour is not overloaded', function () {
    const device = {
      duration: 2,
      power: 1000,
    };

    const timeline = generateTimeline({
      length: 5,
      loadList: [0, 1000, 1000, 1000, 1000],
    });

    const maxLoad = 1000;
    const workIntervalList = getWorkIntervals(timeline, device, maxLoad);

    it('should return array with length equals 0', function () {
      assert.equal(workIntervalList.length, 0);
    });
  });

  describe('when only the 2nd hour is not overloaded', function () {
    const device = {
      duration: 2,
      power: 1000,
    };

    const timeline = generateTimeline({
      length: 5,
      loadList: [1000, 0, 1000, 1000, 1000],
    });

    const maxLoad = 1000;
    const workIntervalList = getWorkIntervals(timeline, device, maxLoad);

    it('should return array with length equals 0', function () {
      assert.equal(workIntervalList.length, 0);
    });
  });

  describe('when only one hour is overloaded', function () {
    const device = {
      duration: 2,
      power: 1000,
    };

    const timeline = generateTimeline({
      length: 5,
      loadList: [0, 0, 0, 1000, 0],
    });

    const maxLoad = 1000;
    const workIntervalList = getWorkIntervals(timeline, device, maxLoad);

    it('should return array with length equals 3', function () {
      assert.equal(workIntervalList.length, 3);
    });
  });

  describe('when device has {mode} property', function () {
    const timeline = generateTimeline(24);

    describe('when mode equals "day" and duration = 4', function () {
      const device = {
        duration: 4,
        power: 1000,
        mode: 'day',
      };

      const workIntervals = getWorkIntervals(timeline, device);

      it('should have length equals 11', function () {
        assert.equal(workIntervals.length, 11);
      });
    });

    describe('when device\'s mode = "night" and duration = 4', function () {
      const device = {
        duration: 4,
        power: 1000,
        mode: 'night',
      };

      const workIntervals = getWorkIntervals(timeline, device);

      it('should have length equals 7', function () {
        assert.equal(workIntervals.length, 7);
      });
    });
  });
});
