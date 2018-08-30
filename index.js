const fs = require('fs');
const { buildTimeline } = require('./src/buildTimeline.js');
const { getWorkIntervals, getOneWorkInterval } = require('./src/getWorkIntervals.js');

function optimizeEnergyConsumption(data) {
  const timeline = buildTimeline(data.rates).sort(
    (interval, nextInterval) => (interval.hour > nextInterval.hour ? 1 : -1),
  );

  /**
   * @namespace
   * @property {number} total - total amount to pay pay for electricity
   * @property {Object.<string, number>} byDevice - device list with amount to pay for each device
   */
  const bill = {
    total: 0,
    byDevice: {},
  };

  const schedule = Object.create(null);

  data.devices.forEach((device) => {
    let cheapestInterval;

    if (device.duration === 24) {
      // devices that have to work 24 hours will take whole day anyway, so we
      // don't need to calculate the least expensive interval,
      // any interval would be enough
      cheapestInterval = getOneWorkInterval(timeline, device, data.maxPower);
    } else {
      const deviceWorkIntervals = getWorkIntervals(timeline, device, data.maxPower);
      const ascWorkIntervals = deviceWorkIntervals.sort(
        (interval, nextInterval) => (
          interval.average > nextInterval.average ? 1 : -1
        ),
      );

      [cheapestInterval] = ascWorkIntervals;
    }

    const consumedPower = device.power * device.duration;

    // Energy price is calculated from kilowatt per hour, but consumed energy
    // stored in watt so it has to be converted to kW before
    const consumedInKiloWatt = consumedPower / 1000;

    const electricityPrice = Number((consumedInKiloWatt * cheapestInterval.average).toFixed(4));

    bill.byDevice[device.name] = electricityPrice;
    bill.total += electricityPrice;

    cheapestInterval.forEach((hourInterval) => {
      timeline[hourInterval.hour].load += device.power;

      const deviceList = schedule[hourInterval.hour] || [];
      deviceList.push(device.id);
      schedule[hourInterval.hour] = deviceList;
    });
  });

  bill.total = Number(bill.total.toFixed(4));

  return JSON.stringify({
    schedule,
    consumedEnergy: {
      value: bill.total,
      devices: bill.byDevice,
    },
  }, null, 2);
}

const data = JSON.parse(fs.readFileSync('data/input.json', 'utf8'));
console.log(optimizeEnergyConsumption(data));
