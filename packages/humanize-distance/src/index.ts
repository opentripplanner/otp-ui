export function humanizeDistanceStringImperial(
  meters: number,
  abbreviate?: boolean
): string {
  const feet = meters * 3.28084;
  if (feet < 528)
    return Math.round(feet) + (abbreviate === true ? " ft" : " feet");
  return Math.round(feet / 528) / 10 + (abbreviate === true ? " mi" : " miles");
}

export function humanizeDistanceStringMetric(meters: number): string {
  const km = meters / 1000;
  if (km > 100) {
    // 100 km => 999999999 km
    return `${km.toFixed(0)} km`;
  }
  if (km > 1) {
    // 1.1 km => 99.9 km
    return `${km.toFixed(1)} km`;
  }
  // 1m => 999m
  return `${meters.toFixed(0)} m`;
}

export function humanizeDistanceString(
  meters: number,
  outputMetricUnits = false
): string {
  return outputMetricUnits
    ? humanizeDistanceStringMetric(meters)
    : humanizeDistanceStringImperial(meters);
}
