import { encodedPolylineType } from "@opentripplanner/core-utils/lib/types";
import PropTypes from "prop-types";
import React from "react";
import { FeatureGroup, MapLayer, Polyline, withLeaflet } from "react-leaflet";

import polyline from "@mapbox/polyline";

// helper fn to check if geometry has been populated for all patterns in route
const isGeomComplete = routeData => {
  return (
    routeData &&
    routeData.patterns &&
    Object.values(routeData.patterns).every(
      ptn => typeof ptn.geometry !== "undefined"
    )
  );
};

class RouteViewerOverlay extends MapLayer {
  componentDidMount() {}

  // TODO: determine why the default MapLayer componentWillUnmount() method throws an error
  componentWillUnmount() {}

  componentDidUpdate(prevProps) {
    // if pattern geometry just finished populating, update the map points
    if (
      !isGeomComplete(prevProps.routeData) &&
      isGeomComplete(this.props.routeData)
    ) {
      const allPoints = Object.values(this.props.routeData.patterns).reduce(
        (acc, ptn) => {
          return acc.concat(polyline.decode(ptn.geometry.points));
        },
        []
      );
      this.props.leaflet.map.fitBounds(allPoints);
    }
  }

  createLeafletElement() {}

  updateLeafletElement() {}

  render() {
    const { routeData } = this.props;

    if (!routeData || !routeData.patterns) return <FeatureGroup />;

    const routeColor = routeData.color ? `#${routeData.color}` : "#00bfff";
    const segments = [];
    Object.values(routeData.patterns).forEach(pattern => {
      if (!pattern.geometry) return;
      const pts = polyline.decode(pattern.geometry.points);
      segments.push(
        <Polyline
          positions={pts}
          weight={4}
          color={routeColor}
          opacity={1}
          key={pattern.id}
        />
      );
    });

    return segments.length > 0 ? (
      <FeatureGroup>
        <div>{segments}</div>
      </FeatureGroup>
    ) : (
      <FeatureGroup />
    );
  }
}

RouteViewerOverlay.propTypes = {
  routeData: PropTypes.shape({
    agency: PropTypes.shape({
      fareUrl: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      lang: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
      timezone: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    }).isRequired,
    bikesAllowed: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    longName: PropTypes.string.isRequired,
    patterns: PropTypes.objectOf(
      PropTypes.shape({
        desc: PropTypes.string.isRequired,
        geometry: encodedPolylineType.isRequired,
        id: PropTypes.string.isRequired
      }).isRequired
    ).isRequired,
    routeBikesAllowed: PropTypes.number.isRequired,
    sortOrder: PropTypes.number.isRequired,
    sortOrderSet: PropTypes.bool.isRequired,
    textColor: PropTypes.string.isRequired,
    type: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired
  })
};

export default withLeaflet(RouteViewerOverlay);
