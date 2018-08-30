const { isDaytime } = require('./isDaytime.js');

const day = 'day';
const night = 'night';

/**
 * Function returns an array consisting of all possible work.
 * intervals for device. Returned intervals have correct mode
 * and acceptable hour load.
 *
 * @param {import('./buildTimeline').HourInterval} timeline
 * @param {Object} device - device for which work intervals should be determined
 * @param {number} device.id
 * @param {number} device.name
 * @param {number} device.power - amount of power in watts
 * @param {number} device.duration - work interval length
 * @param {number} [device.mode] - part of the day when device should be started
 * @param {number} [maxLoad] - max electricity load that can be hold each hour
 * @returns {import('./buildTimeline').HourInterval[]} workIntervalList
 */

function getWorkIntervals(timeline, device, maxLoad = null) {
  const workIntervalList = [];

  timeline.forEach((hourInterval) => {
    // Require maxLoad param to be passed or ignore condition
    if (maxLoad !== null && hourInterval.load + device.power > maxLoad) {
      // Continue to next hour if electricity grid is overloaded
      return;
    }

    let workInterval;
    const startHour = hourInterval.hour;

    if (startHour + device.duration > timeline.length) {
      const yesterdayHours = timeline.slice(startHour, timeline.length);
      const todayHours = timeline.slice(0, device.duration - yesterdayHours.length);
      workInterval = yesterdayHours.concat(todayHours);
    } else {
      workInterval = timeline.slice(startHour, startHour + device.duration);
    }

    // startHout + device.duration give an endHour - an interval
    // excluded right endpoint so to get the actual last hour of the interval
    // we need to subtract 1
    const endHour = (startHour + device.duration - 1) % timeline[timeline.length - 1].hour;

    if (device.mode !== undefined) {
      if (device.mode === day && (!isDaytime(startHour) || !isDaytime(endHour))) {
        return;
      }

      if (device.mode === night && (isDaytime(startHour) || isDaytime(endHour))) {
        return;
      }
    }

    // Require maxLoad param to be passed or ignore condition
    if (maxLoad !== null) {
      const overloaded = workInterval.some(hour => (hour.load + device.power > maxLoad));

      // Workinterval have at least one overloaded hour
      if (overloaded) {
        // Continue to next hour
        return;
      }
    }

    const total = workInterval.reduce((acc, interval) => acc + interval.value, 0);
    workInterval.average = Number((total / workInterval.length).toFixed(4));
    // workInterval.total = Number(total.toFixed(4));

    workIntervalList.push(workInterval);
  });

  return workIntervalList;
}

exports.getWorkIntervals = getWorkIntervals;
