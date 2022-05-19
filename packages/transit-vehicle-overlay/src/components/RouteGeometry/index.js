import React from "react";
import PropTypes from "prop-types";
import { FeatureGroup } from "react-leaflet";

import * as utils from "../../utils";

/**
 * vehicle geometry presentational component that creates a map overlay for the line
 * geometry showing the travel pattern of a vehicle
 */
export default function RouteGeometry(props) {
  const { pattern, zoom, selectedVehicle } = props;
  const { highlightColor, lowlightColor } = props;
  let { highlight, lowlight } = props;

  utils.linterIgnoreTheseProps(zoom);

  if (highlightColor) highlight = utils.setColor(highlightColor, highlight);
  if (lowlightColor) lowlight = utils.setColor(lowlightColor, lowlight);

  const splitCoord =
    selectedVehicle && utils.getVehicleCoordinates(selectedVehicle);
  const pt = utils.findPointOnLine(splitCoord, pattern.data);
  const geom = utils.splitLineGeometry(pattern.data, pt, pattern.id);
  const segments = utils.makeSplitLine(geom, highlight, lowlight);

  let retVal = <FeatureGroup />;
  if (segments && segments.length === 2) {
    retVal = <FeatureGroup>{segments}</FeatureGroup>;
  }
  return retVal;
}

RouteGeometry.propTypes = {
  /** map zoom: is part of the props due to redrawing this layer on map zoom */
  zoom: PropTypes.number,

  /** optional vehicle record for the (tracked) vehicle */
  // selectedVehicle: transitVehicleType,

  /** line geometry, ala { id: <tripId>, data: [[lat, lon], [45.50,-122.41], etc..] } */
  pattern: PropTypes.shape({
    id: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired
  }),

  /** color of the *to be travelled* portion of tracked route geom */
  highlightColor: PropTypes.string,

  /** color of the *already travelled* tracked vehicle route (see highlightColor) */
  lowlightColor: PropTypes.string

  /** line styling options for the to be traveled part of the line geom */
  // highlight: leafletPathType,

  /** line styling options for the already traveled portion of the line geom */
  // lowlight: leafletPathType
};

RouteGeometry.defaultProps = {
  zoom: 13,
  pattern: null,
  selectedVehicle: null,
  highlightColor: null,
  lowlightColor: null,
  highlight: {
    color: "#00bfff",
    weight: 5.0,
    opacity: 0.85
  },
  lowlight: {
    color: "#777",
    weight: 5.0,
    opacity: 0.7,
    dashArray: "1, 10, 1, 10"
  }
};
