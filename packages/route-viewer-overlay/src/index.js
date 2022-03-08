import coreUtils from "@opentripplanner/core-utils";
import PropTypes from "prop-types";
import React from "react";
import { FeatureGroup, MapLayer, Polyline, withLeaflet } from "react-leaflet";

import polyline from "@mapbox/polyline";
import pointInPolygon from "point-in-polygon";

// helper fn to check if geometry has been populated for all patterns in route
const isGeomComplete = routeData => {
  return (
    routeData &&
    routeData.patterns &&
    Object.values(routeData.patterns).every(
      ptn => typeof ptn?.geometry !== "undefined"
    )
  );
};

/**
 * helper function that removes all points from array of points that are
 * within flex zones defined in an array of stops
 * @param {*} stops   OTP stops response
 * @param {*} points  Array of coordinates to clip
 * @returns           The array of coordinates without coordinates within the stops
 */
const removePointsInFlexZone = (stops, points) => {
  // First, go through all stops to find flex zones
  const bboxes =
    stops
      ?.map(stop => {
        if (stop.geometries?.geoJson?.type !== "Polygon") {
          return null;
        }
        return stop.geometries.geoJson.coordinates?.[0] || null;
      })
      // Remove the null entries
      .filter(bbox => !!bbox) || [];

  // Points we keep can't be in any of the flex zones
  return points.filter(point => {
    const [y, x] = point;
    return bboxes.every(bbox => !pointInPolygon([x, y], bbox));
  });
};

/**
 * An overlay that will display all polylines of the patterns of a route.
 */
class RouteViewerOverlay extends MapLayer {
  componentDidMount() {}

  // TODO: determine why the default MapLayer componentWillUnmount() method throws an error
  componentWillUnmount() {}

  componentDidUpdate() {
    // if pattern geometry updated, update the map points
    if (this.props.allowMapCentering && isGeomComplete(this.props.routeData)) {
      const allPoints = Object.values(this.props.routeData.patterns).reduce(
        (acc, ptn) => {
          return acc.concat(polyline.decode(ptn.geometry.points));
        },
        []
      );
      if (allPoints.length > 0 && this.props.leaflet.map)
        this.props.leaflet.map.fitBounds(allPoints);
    }
  }

  createLeafletElement() {}

  updateLeafletElement() {}

  render() {
    const { clipToPatternStops, path, routeData } = this.props;

    if (!routeData || !routeData.patterns) return <FeatureGroup />;

    const routeColor = routeData.color ? `#${routeData.color}` : path.color;
    const segments = [];
    Object.values(routeData.patterns).forEach(pattern => {
      if (!pattern?.geometry) return;
      const pts = polyline.decode(pattern.geometry.points);
      const clippedPts = clipToPatternStops
        ? removePointsInFlexZone(pattern?.stops, pts)
        : pts;

      segments.push(
        <Polyline
          /* eslint-disable-next-line react/jsx-props-no-spreading */
          {...path}
          color={routeColor}
          key={pattern.id}
          positions={clippedPts}
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
  /**
   * This boolean value allows disabling of map centering and panning.
   */
  allowMapCentering: PropTypes.boolean,
  /**
   * If pattern stops contain polygons, we can request that the routes are not drawn
   * inside of these polygons by setting this prop to true. If true, the layer will
   * check every zone of every stop in a pattern before drawing the route for that pattern
   * and only draw the route outside of the polygon.
   */
  clipToPatternStops: PropTypes.bool,
  /**
   * Leaflet path properties to use to style each polyline that represents a
   * pattern of the route. Only a few of the items are actually used.
   *
   * See https://leafletjs.com/reference-1.6.0.html#path
   */
  path: coreUtils.types.leafletPathType,
  /**
   * This represents data about a route as obtained from a transit index.
   * Typically a route has more data than these items, so this is only a list of
   * the properties that this component actually uses.
   */
  routeData: PropTypes.shape({
    color: PropTypes.string,
    patterns: PropTypes.objectOf(
      PropTypes.shape({
        geometry: coreUtils.types.encodedPolylineType,
        id: PropTypes.string.isRequired,
        stops: PropTypes.arrayOf(
          PropTypes.shape({
            geometries: PropTypes.objectOf({
              geoJson: PropTypes.objectOf({
                coordinates: PropTypes.arrayOf(PropTypes.number),
                type: PropTypes.string
              })
            })
          })
        )
      }).isRequired
    )
  })
};

RouteViewerOverlay.defaultProps = {
  allowMapCentering: true,
  path: {
    color: "#00bfff",
    opacity: 1,
    weight: 4
  }
};

export default withLeaflet(RouteViewerOverlay);
