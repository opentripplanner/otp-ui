import React from "react";
import PropTypes, { arrayOf } from "prop-types";
import { FeatureGroup } from "react-leaflet";

import { leafletPathType } from "@opentripplanner/core-utils/src/types";
import * as utils from "../../utils";

/**
 * vehicle geometry presentational component that creates a map overlay for the line
 * geometry showing the travel pattern of a vehicle
 */
export default function RouteGeometry(props) {
  const { pattern, splitCoord, zoom } = props;
  const { highlightColor, lowlightColor } = props;
  let { highlight, lowlight } = props;

  utils.linterIgnoreTheseProps(zoom);

  if (highlightColor) highlight = utils.setColor(highlightColor, highlight);
  if (lowlightColor) lowlight = utils.setColor(lowlightColor, lowlight);

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
  zoom: PropTypes.number,
  pattern: PropTypes.shape({
    id: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired
  }).isRequired,
  splitCoord: arrayOf(PropTypes.number),
  highlightColor: PropTypes.string,
  lowlightColor: PropTypes.string,
  highlight: leafletPathType,
  lowlight: leafletPathType
};

RouteGeometry.defaultProps = {
  zoom: 13,
  splitCoord: null,
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
