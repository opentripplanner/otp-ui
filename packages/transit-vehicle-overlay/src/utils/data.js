/** simple (python-esque) converstion of an int to a string */
function str(val) {
  let retVal = "";
  try {
    retVal = `${val}`;
  } catch (e) {
    console.error(e);
  }
  return retVal;
}

/** find a vehicle by block or trip id from a list of vehicles */
export function findVehicleById(vehicleList, queryId, defVal = null) {
  let retVal = defVal;
  try {
    if (vehicleList && queryId) {
      vehicleList.some(v => {
        if (queryId === v.blockId || queryId === v.tripId) {
          retVal = v;
          return true;
        }
        return false;
      });
    }
  } catch (e) {
    console.error(e);
  }
  return retVal;
}

/**
 * make a short name (good for tooltips)
 * this routine used for converting a developer.trimet.org response (see below)
 */
export function triMetRouteToShortName(route) {
  let retVal = "";
  switch (route) {
    case 90:
      retVal = "MAX Red";
      break;
    case 100:
      retVal = "MAX Blue";
      break;
    case 190:
      retVal = "MAX Yellow";
      break;
    case 200:
      retVal = "MAX Green";
      break;
    case 290:
      retVal = "MAX Orange";
      break;
    case 203:
      retVal = "WES";
      break;
    case 193:
      retVal = "PSC NS Line";
      break;
    case 194:
      retVal = "PSC A-Loop";
      break;
    case 195:
      retVal = "PSC B-Loop";
      break;
    default:
      retVal = str(route);
      break;
  }
  return retVal;
}

/**
 * convert a developer.trimet.org vehicle object to the
 * @opentripplanner/core-utils/lib/types/transitVehicleType object format
 */
export function convertTriMetRecord(rec, qt) {
  const secs = Math.round((qt - rec.time) / 1000);
  const date = new Date(rec.time).toLocaleString();

  const retVal = {
    agencyId: "TRIMET",
    id: `${rec.vehicleID}+${rec.blockID}`,
    vehicleId: str(rec.vehicleID),
    routeId: str(rec.routeNumber),
    blockId: str(rec.blockID),
    shapeId: str(rec.tripID),
    tripId: str(rec.tripID),
    directionId: str(rec.direction),
    stopId: str(rec.nextLocID),
    stopSequence: rec.nextStopSeq,
    lat: rec.latitude,
    lon: rec.longitude,
    heading: rec.bearing,
    routeType: rec.type === "rail" ? "TRAM" : "BUS",
    routeShortName: triMetRouteToShortName(rec.routeNumber),
    routeLongName: rec.signMessage,
    reportDate: date,
    seconds: secs,
    status: "IN_TRANSIT_TO"
  };
  return retVal;
}

/** convert list of developer.trimet.org vehicle objects to format used in this component */
export function convertAltData(feed) {
  let retVal = [];
  if (feed && feed.resultSet && feed.resultSet.vehicle) {
    // debugger;
    const qt = feed.resultSet.queryTime;
    retVal = feed.resultSet.vehicle.map(rec => convertTriMetRecord(rec, qt));
  }
  return retVal;
}
