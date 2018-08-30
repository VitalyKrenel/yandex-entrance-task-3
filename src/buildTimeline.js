/**
 * @typedef {Object} HourInterval
 * @property {number} hour - currect hour value
 * @property {number} value - rate value applyed at the currect hour
 * @property {number} load - electricity load at the currect hour
 */

/**
 * Function builds an array consisting of items, each represents an hour
 * with rate's value applyed at that moment and energy load information
 * @param {Object[]} rates - electricity rates
 * @param {number} rates[].from - time from which rate starts to apply
 * @param {number} rates[].to - time untill rate is still applying
 * @param {number} rates[].value - electricity rates
 * @returns {Array<HourInterval>} timeline - array of hour intervals
 */

function buildTimeline(rates) {
  const dayInterval = [];

  rates.forEach((rate) => {
    let duration = 0;

    if (rate.to > rate.from) {
      // Inside of one day range (e.g. from 19.00 to 21.00)
      duration = rate.to - rate.from;
    } else {
      // Previous day left time + new day time (e.g. from 22.00 to 5.00)
      duration = (24 - rate.from) + rate.to;
    }
    // Array.length equals rate's duration
    // Each item represents hour and contains rate's electricity value
    const interval = Array(duration).fill({ value: rate.value, from: rate.from });

    dayInterval.push(interval);
  });

  // Timeline represents an array with 24 items (for 24 hours a day)
  // Each item represents an object, with hour, load, and value properties
  const timeline = dayInterval.reduce((acc, interval) => {
    const hourInterval = interval.map((hourIntervalData, i) => {
      acc.average += hourIntervalData.value;
      return {
        hour: (i + Number(hourIntervalData.from)) % 24,
        load: 0,
        value: hourIntervalData.value,
      };
    });

    return acc.concat(hourInterval);
  }, []);

  timeline.average = Number((timeline.average / timeline.length).toFixed(4));
  return timeline;
}
exports.buildTimeline = buildTimeline;
