/** return true of coordinates arrays look like coords and are equal */
export function compareCoords(coordA, coordB) {
  let retVal = false;
  if (coordA && coordB && coordA.length === 2 && coordB.length === 2)
    if (coordA[0] === coordB[0] && coordA[1] === coordB[1]) retVal = true;
  return retVal;
}

/** creates a coordinate [lat, lon] from a vehicle */
export function getVehicleCoordinates(v) {
  let retVal = null;
  try {
    if (v) {
      retVal = [v.lat, v.lon];
    }
  } catch (e) {
    console.warn(e);
  }
  return retVal;
}
