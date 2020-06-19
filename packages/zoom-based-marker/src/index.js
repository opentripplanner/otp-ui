import PropTypes from "prop-types";
import React, { Component } from "react";

import { zoomBasedMarkerType } from "@opentripplanner/core-utils/lib/types";

/**
 * A component that renders different components based on zoom level.
 */
class ZoomBasedMarker extends Component {
  render() {
    const { markers, zoom, ...otherProps } = this.props;

    // Find the deepest marker for the current zoom level (minZoom <= zoom).
    const markerEntry = markers.reduce((bestMarker, marker) => {
      if (zoom >= marker.minZoom) {
        if (!bestMarker || marker.minZoom > bestMarker.minZoom) {
          return marker;
        }
      }
      return bestMarker;
    }, null);

    // And render that, if found.
    if (markerEntry) {
      const Marker = markerEntry.marker;
      // eslint-disable-next-line react/jsx-props-no-spreading
      return <Marker {...otherProps} />;
    }
    return null;
  }
}

ZoomBasedMarker.propTypes = {
  /**
   * A list of markers and the associated zoom level (not necessarily sorted).
   */
  markers: PropTypes.arrayOf(zoomBasedMarkerType.isRequired).isRequired,
  /**
   * The current zoom level for rendering.
   */
  zoom: PropTypes.number.isRequired
};

export default ZoomBasedMarker;
