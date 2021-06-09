import coreUtils from "@opentripplanner/core-utils";
import PropTypes from "prop-types";
import React from "react";
import { FeatureGroup, MapLayer, withLeaflet } from "react-leaflet";

/**
 * This overlay is intended to highlight a specific stop on a map typically in
 * conjunction with some kind of stop viewer.
 */
class StopViewerOverlay extends MapLayer {
  componentDidMount() {}

  // TODO: determine why the default MapLayer componentWillUnmount() method throws an error
  componentWillUnmount() {}

  /**
   * Only reset map view if a new stop is selected. This prevents resetting the
   * bounds if, for example, the arrival times have changed for the same stop
   * in the viewer.
   */
  componentDidUpdate(prevProps) {
    const nextStop = this.props.stop;
    const oldStopId = prevProps.stop && prevProps.stop.id;
    const hasNewStopId = nextStop && nextStop.id !== oldStopId;
    if (hasNewStopId)
      this.props.leaflet.map.setView([nextStop.lat, nextStop.lon]);
  }

  createLeafletElement() {}

  updateLeafletElement() {}

  render() {
    const { stop, StopMarker } = this.props;

    if (!stop) return <FeatureGroup />;

    return (
      <FeatureGroup>
        <StopMarker stop={stop} />
      </FeatureGroup>
    );
  }
}

StopViewerOverlay.props = {
  /**
   * An object representing a transit stop
   */
  stop: coreUtils.types.stopLayerStopType,
  StopMarker: PropTypes.elementType.isRequired
};

StopViewerOverlay.defaultProps = {
  stop: null
};

export default withLeaflet(StopViewerOverlay);
