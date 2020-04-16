import { zoomState, trackedVehicleState, getVehicleList } from "./state";
import { convertAltData, getVehicleId, findVehicleById } from "./data";
import { setColor, renderAsImage } from "./graphics";
import {
  findPointOnLine,
  splitLineGeometry,
  reverseGeojsonPoints,
  makeSplitLine,
  makePattern
} from "./geom";
import {
  checkRefreshInteval,
  fetchVehicles,
  fetchRouteGeometry,
  handleGlobalError,
  handleHttpResponse
} from "./fetch";

import { getVehicleCoordinates, compareCoords } from "./coordinates";
import { recenterFlyTo, recenterPanTo, recenterPanToOffset } from "./recenter";

/** this function is used to have props that are not used w/out lint errors */
function linterIgnoreTheseProps() {}

export {
  zoomState,
  trackedVehicleState,
  getVehicleList,
  renderAsImage,
  setColor,
  convertAltData,
  getVehicleId,
  findVehicleById,
  getVehicleCoordinates,
  compareCoords,
  findPointOnLine,
  splitLineGeometry,
  makeSplitLine,
  makePattern,
  reverseGeojsonPoints,
  fetchVehicles,
  fetchRouteGeometry,
  handleHttpResponse,
  handleGlobalError,
  checkRefreshInteval,
  recenterFlyTo,
  recenterPanTo,
  recenterPanToOffset,
  linterIgnoreTheseProps
};
