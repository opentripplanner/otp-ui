import ZoomBasedMarkers from "@opentripplanner/zoom-based-markers";
import PropTypes from "prop-types";
import React from "react";
import { FeatureGroup, GeoJSON, MapLayer, withLeaflet } from "react-leaflet";

import DefaultStopMarker from "./default-stop-marker";
import * as Styled from "./styled";

/**
 * An overlay to view a collection of stops.
 */
class StopsOverlay extends MapLayer {
  componentDidMount() {
    // set up pan/zoom listener
    this.props.leaflet.map.on("moveend", this.refreshStops);
  }

  // TODO: determine why the default MapLayer componentWillUnmount() method throws an error
  componentWillUnmount() {
    // Remove the pan/zoom listener set up above.
    this.props.leaflet.map.off("moveend", this.refreshStops);
  }

  /**
   * this method is used for backporting to React 15
   * v16:  return this.props.leaflet;
   * v15:  return this.context;
   */
  getLeafletContext() {
    return this.props.leaflet;
  }

  refreshStops = () => {
    const { leaflet, refreshStops, symbols } = this.props;

    // Force the map to render no symbols if the map zoom level
    // is less than the farthest zoom level at which symbols are defined.
    const minZoomForUpdate = symbols
      ? symbols.reduce(
          (lowestZoom, level) => Math.min(level.minZoom, lowestZoom),
          Number.MAX_VALUE
        )
      : Number.MAX_VALUE;

    if (leaflet.map.getZoom() < minZoomForUpdate) {
      this.forceUpdate();
      return;
    }

    const bounds = leaflet.map.getBounds();
    if (!bounds.equals(this.lastBounds)) {
      setTimeout(() => {
        refreshStops({
          minLat: bounds.getSouth(),
          maxLat: bounds.getNorth(),
          minLon: bounds.getWest(),
          maxLon: bounds.getEast()
        });
        this.lastBounds = bounds;
      }, 300);
    }
  };

  createLeafletElement() {}

  updateLeafletElement() {}

  render() {
    const { leaflet, stops, symbols } = this.props;

    // Don't render if no map or no stops are defined.
    // (ZoomBasedMarkers will also not render below the minimum zoom threshold defined in the symbols prop.)
    if (!leaflet || !leaflet.map || !stops || stops.length === 0) {
      return <FeatureGroup />;
    }
    const zoom = leaflet.map.getZoom();

    const flexGeometries = stops
      .filter(stop => stop?.geometries?.geoJson?.type === "Polygon")
      .map(stop => {
        // Add first route color to GeoJSON
        const { color, id } = stop;
        stop.geometries.geoJson.properties = { color, id };
        return stop.geometries.geoJson;
      });

    return (
      <FeatureGroup>
        <ZoomBasedMarkers entities={stops} symbols={symbols} zoom={zoom} />
        {/* Updating the react key is the only way to force the GeoJSON layer to update */}
        {flexGeometries.length > 0 && (
          <GeoJSON
            data={flexGeometries}
            key={flexGeometries[0].properties.id}
            style={feature => {
              const { color } = feature?.geometry?.properties;
              return { color };
            }}
          />
        )}
      </FeatureGroup>
    );
  }
}

StopsOverlay.propTypes = {
  /** the leaflet reference as obtained from the withLeaflet wrapper */
  /* eslint-disable-next-line react/forbid-prop-types */
  leaflet: PropTypes.object.isRequired,
  /**
   * A callback for refreshing the stops in the event of a map bounds or zoom
   * change event.
   */
  refreshStops: PropTypes.func.isRequired,
  /**
   * The list of stops to create stop markers for.
   * Typescript TODO: restore correct type
   */
  stops: PropTypes.arrayOf(PropTypes.object).isRequired,
  /**
   * A list of symbol definitions for the stops to be rendered at specific zoom levels.
   * Typescript TODO: restore correct type
   */
  symbols: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default withLeaflet(StopsOverlay);

export { DefaultStopMarker, Styled };
