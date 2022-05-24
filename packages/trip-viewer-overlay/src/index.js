import React from "react";
import { FeatureGroup, MapLayer, Polyline, withLeaflet } from "react-leaflet";

import polyline from "@mapbox/polyline";

/**
 * An overlay that will display the geometry of a trip.
 */
class TripViewerOverlay extends MapLayer {
  componentDidMount() {}

  // TODO: determine why the default MapLayer componentWillUnmount() method throws an error
  componentWillUnmount() {}

  componentDidUpdate(prevProps) {
    const oldGeometry = prevProps.tripData && prevProps.tripData.geometry;
    const newGeometry = this.props.tripData && this.props.tripData.geometry;
    if (oldGeometry === newGeometry || !newGeometry) return;
    const pts = polyline.decode(newGeometry.points);
    this.props.leaflet.map.fitBounds(pts);
  }

  createLeafletElement() {}

  updateLeafletElement() {}

  render() {
    const { leafletPath, tripData } = this.props;

    if (!tripData || !tripData.geometry) return <FeatureGroup />;

    const pts = polyline.decode(tripData.geometry.points);
    return (
      <FeatureGroup>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Polyline {...leafletPath} positions={pts} />
      </FeatureGroup>
    );
  }
}

TripViewerOverlay.propTypes = {
  /**
   * Leaflet path properties to use to style the polyline that represents the
   * trip.
   *
   * See https://leafletjs.com/reference-1.6.0.html#path
   */
  // leafletPath: coreUtils.types.leafletPathType,
  /**
   * This represents data about a trip as obtained from a transit index.
   * Typically a trip has more data than these items, so this is only a list of
   * the properties that this component actually uses.
   */
  // tripData: PropTypes.shape({
  // geometry: coreUtils.types.encodedPolylineType
  // })
};

TripViewerOverlay.defaultProps = {
  leafletPath: {
    color: "#00bfff",
    opacity: 0.6,
    weight: 8
  }
};

export default withLeaflet(TripViewerOverlay);
