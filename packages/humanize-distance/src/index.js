export function humanizeDistanceStringImperial(meters, abbreviate) {
  const feet = meters * 3.28084;
  if (feet < 528)
    return Math.round(feet) + (abbreviate === true ? " ft" : " feet");
  return Math.round(feet / 528) / 10 + (abbreviate === true ? " mi" : " miles");
}

export function humanizeDistanceStringMetric(meters) {
  let km = meters / 1000;
  if (km > 100) {
    // 100 km => 999999999 km
    km = km.toFixed(0);
    return `${km} km`;
  }
  if (km > 1) {
    // 1.1 km => 99.9 km
    km = km.toFixed(1);
    return `${km} km`;
  }
  // 1m => 999m
  return `${meters.toFixed(0)} m`;
}

export function humanizeDistanceString(meters, outputMetricUntis = false) {
  return outputMetricUntis === true
    ? humanizeDistanceStringMetric(meters)
    : humanizeDistanceStringImperial(meters);
}
