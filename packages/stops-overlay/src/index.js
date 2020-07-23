import utils from "@opentripplanner/core-utils";
// TODO: Fix this import.
import { zoomBasedSymbolType } from "@opentripplanner/core-utils/lib/types";
import ZoomBasedMarkers from "@opentripplanner/zoom-based-markers";
import PropTypes from "prop-types";
import React from "react";
import { FeatureGroup, MapLayer, withLeaflet } from "react-leaflet";

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

    const minZoomForUpdate = symbols
      ? symbols.reduce((lowestZoom, level) => {
          if (level.minZoom < lowestZoom) {
            return level;
          }
          return lowestZoom;
        }, Number.MAX_VALUE)
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

    // Don't render if no stops visible.
    // (ZoomBasedMarkers will also not render below the minimum zoom threshold defined in the symbols prop.)
    if (!leaflet || !leaflet.map || !stops || stops.length === 0) {
      return <FeatureGroup />;
    }
    const zoom = leaflet.map.getZoom();

    return (
      <FeatureGroup>
        {symbols && (
          <ZoomBasedMarkers entities={stops} symbols={symbols} zoom={zoom} />
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
   */
  stops: PropTypes.arrayOf(utils.types.stopLayerStopType).isRequired,
  /**
   * A list of symbol definitions for the stops to be rendered at which zoom.
   */
  symbols: PropTypes.arrayOf(zoomBasedSymbolType)
};

StopsOverlay.defaultProps = {
  symbols: null
};

export default withLeaflet(StopsOverlay);
