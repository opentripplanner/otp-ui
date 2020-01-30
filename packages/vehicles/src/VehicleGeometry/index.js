import React from "react";
import PropTypes from "prop-types";
import { FeatureGroup } from "react-leaflet";
import { leafletPathType } from "@opentripplanner/core-utils/lib/types";
import { vehicleType } from "../types";
import * as utils from "./utils";
import { setColor } from "../utils";

/**
 * vehicle geometry presentational component that creates a map overlay for the line
 * geometry showing the travel pattern of a vehicle
 */
function VehicleGeometry(props) {
  const { trackedVehicle } = props;
  const { pattern } = props;
  const { lowlight, color } = props;
  let { highlight } = props;
  if (color) {
    highlight = setColor(color, highlight);
  }

  let retVal = <FeatureGroup />;
  if (trackedVehicle && pattern && pattern.data) {
    const pt = utils.findPointOnLine(trackedVehicle, pattern.data);
    const geom = utils.splitGeometry(pattern.data, pt, pattern.id);
    const segments = utils.makeSplitLine(geom, highlight, lowlight);
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
  highlight: {
    color: "#00bfff",
    weight: 5.0,
    opacity: 0.85
  },
  lowlight: {
    color: "#999",
    weight: 5.0,
    opacity: 0.7,
    dashArray: "1, 10, 1, 10"
  }
};

VehicleGeometry.propTypes = {
  trackedVehicle: vehicleType,
  pattern: PropTypes.shape({}),
  highlight: leafletPathType,
  lowlight: leafletPathType
};

export default VehicleGeometry;
