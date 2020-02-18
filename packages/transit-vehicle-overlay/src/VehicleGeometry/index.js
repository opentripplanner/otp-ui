import React from "react";
import PropTypes from "prop-types";
import { FeatureGroup } from "react-leaflet";
import {
  leafletPathType,
  transitVehicleType
} from "@opentripplanner/core-utils/src/types";

import * as utils from "./utils";
import { setColor } from "../utils";

/**
 * vehicle geometry presentational component that creates a map overlay for the line
 * geometry showing the travel pattern of a vehicle
 */
function VehicleGeometry(props) {
  const { trackedVehicle, pattern, highlightColor, lowlightColor } = props;
  let { highlight, lowlight } = props;

  let retVal = <FeatureGroup />;
  if (trackedVehicle && pattern && pattern.data) {
    if (highlightColor) highlight = setColor(highlightColor, highlight);
    if (lowlightColor) lowlight = setColor(lowlightColor, lowlight);

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

  highlightColor: null,
  lowlightColor: null,
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
  trackedVehicle: transitVehicleType,
  pattern: PropTypes.shape({
    id: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired
  }),
  highlightColor: PropTypes.string,
  lowlightColor: PropTypes.string,
  highlight: leafletPathType,
  lowlight: leafletPathType
};

export default VehicleGeometry;
