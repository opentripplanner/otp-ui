import React from "react";
import PropTypes from "prop-types";
import { FeatureGroup } from "react-leaflet";
import { vehicleType } from "../types";
import * as utils from "./utils";

/**
 * vehicle geometry component that creates a map overlay for the line geometry showing
 * the travel pattern of a vehicle
 *
 * @param props
 * @returns {*}
 * @constructor
 */
function VehicleGeometry(props) {
  const { trackedVehicle } = props;
  const { pattern } = props;
  const { highlight, lowlight, opacity, weight } = props;

  let retVal = <FeatureGroup />;
  if (trackedVehicle && pattern && pattern.data) {
    const pt = utils.findPointOnLine(trackedVehicle, pattern.data);
    const geom = utils.splitGeometry(pattern.data, pt, pattern.id);
    const segments = utils.makeSplitLine(
      geom,
      highlight,
      lowlight,
      weight,
      opacity
    );
    if (segments && segments.length === 2)
      retVal = (
        <FeatureGroup>
          <div>{segments}</div>
        </FeatureGroup>
      );
  }
  return retVal;
}

VehicleGeometry.defaultProps = {
  trackedVehicle: null,
  pattern: null,
  highlight: "#00bfff",
  lowlight: "#555555",
  weight: 4.0,
  opacity: 0.85
};

VehicleGeometry.propTypes = {
  trackedVehicle: vehicleType,
  pattern: PropTypes.shape({}),
  highlight: PropTypes.string,
  lowlight: PropTypes.string,
  weight: PropTypes.number,
  opacity: PropTypes.number
};

export default VehicleGeometry;
