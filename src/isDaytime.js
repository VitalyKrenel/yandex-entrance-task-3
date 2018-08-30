const daytime = { from: 7, to: 21 };

function isDaytime(hour) {
  return hour >= daytime.from && hour < daytime.to;
}

exports.isDaytime = isDaytime;
exports.daytime = daytime;
