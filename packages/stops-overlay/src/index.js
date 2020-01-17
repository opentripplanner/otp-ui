import {
  languageConfigType,
  leafletPathType
} from "@opentripplanner/core-utils/lib/types";
import PropTypes from "prop-types";
import React from "react";
import { FeatureGroup, MapLayer, withLeaflet } from "react-leaflet";

import StopMarker, { stopLayerStopType } from "./stop-marker";

class StopsOverlay extends MapLayer {
  componentDidMount() {
    // set up pan/zoom listener
    this.props.leaflet.map.on("moveend", () => {
      this.refreshStops();
    });
  }

  // TODO: determine why the default MapLayer componentWillUnmount() method throws an error
  componentWillUnmount() {}

  /**
   * this method is used for backporting to React 15
   * v16:  return this.props.leaflet;
   * v15:  return this.context;
   */
  getLeafletContext() {
    return this.props.leaflet;
  }

  refreshStops() {
    const { leaflet, minZoom, refreshStops } = this.props;
    if (leaflet.map.getZoom() < minZoom) {
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
  }

  createLeafletElement() {}

  updateLeafletElement() {}

  render() {
    const {
      languageConfig,
      leaflet,
      minZoom,
      setLocation,
      setMainPanelContent,
      setViewedStop,
      stopMarkerPath,
      stopMarkerRadius,
      stops
    } = this.props;

    // Don't render if below zoom threshold or no stops visible
    if (
      !leaflet ||
      !leaflet.map ||
      leaflet.map.getZoom() < minZoom ||
      !stops ||
      stops.length === 0
    ) {
      return <FeatureGroup />;
    }

    // Helper to create StopMarker from stop
    const createStopMarker = stop => (
      <StopMarker
        key={stop.id}
        languageConfig={languageConfig}
        path={stopMarkerPath}
        radius={stopMarkerRadius}
        setLocation={setLocation}
        setMainPanelContent={setMainPanelContent}
        setViewedStop={setViewedStop}
        stop={stop}
      />
    );

    // Singleton case; return FeatureGroup with single StopMarker
    if (stops.length === 1) {
      return <FeatureGroup>{createStopMarker(stops[0])}</FeatureGroup>;
    }

    // Otherwise, return FeatureGroup with mapped array of StopMarkers
    return (
      <FeatureGroup>{stops.map(stop => createStopMarker(stop))}</FeatureGroup>
    );
  }
}

StopsOverlay.propTypes = {
  languageConfig: languageConfigType.isRequired,
  /** the leaflet reference as obtained from the withLeaflet wrapper */
  /* eslint-disable-next-line react/forbid-prop-types */
  leaflet: PropTypes.object.isRequired,
  /**
   * The zoom number at which this overlay will begin to show stop markers.
   */
  minZoom: PropTypes.number,
  /**
   * A callback for refreshing the stops in the event of a map bounds or zoom
   * change event.
   */
  refreshStops: PropTypes.func.isRequired,
  /**
   * A callback for when a user clicks on setting this stop as either the from
   * or to location of a new search.
   *
   * This will be dispatched with the following argument:
   *
   * ```js
   *  {
   *    location: {
   *      lat: number,
   *      lon: number,
   *      name: string
   *    },
   *    locationType: "from" or "to"
   *  }
   * ```
   */
  setLocation: PropTypes.func.isRequired,
  /**
   * A callback for when a user wants to open the stop viewer for this stop.
   *
   * This will be dispatched with the following argument:
   *
   * ```js
   * { stopId: string }
   * ```
   */
  setViewedStop: PropTypes.func.isRequired,
  /**
   * Leaflet path properties to use to style each stop marker that represents a
   * stop. Only a few of the path items are actually used.
   *
   * See https://leafletjs.com/reference-1.6.0.html#path
   */
  stopMarkerPath: leafletPathType,
  /**
   * The radius in pixels to draw each stop marker.
   */
  stopMarkerRadius: PropTypes.number,
  /**
   * The list of stops to create stop markers for.
   */
  stops: PropTypes.arrayOf(stopLayerStopType).isRequired
};

StopsOverlay.defaultProps = {
  minZoom: 15,
  stopMarkerPath: undefined,
  stopMarkerRadius: undefined
};

export default withLeaflet(StopsOverlay);
