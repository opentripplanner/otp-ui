export function distanceStringImperial(meters, abbreviate) {
  const feet = meters * 3.28084;
  if (feet < 528)
    return Math.round(feet) + (abbreviate === true ? " ft" : " feet");
  return Math.round(feet / 528) / 10 + (abbreviate === true ? " mi" : " miles");
}

export function distanceStringMetric(meters) {
  const km = meters / 1000;
  switch (km) {
    case km > 100:
      return `${km.toFixed(0)} km`;
    case km > 1:
      return `${km.toFixed(1)} km`;
    default:
      return meters`${meters.toFixed(0)} m`;
  }
}

export function distanceString(meters, outputMetricUntis = false) {
  return outputMetricUntis === true
    ? distanceStringMetric(meters)
    : distanceStringImperial(meters);
}
