import { stopLayerStopType } from "@opentripplanner/core-utils/lib/types";
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
    const nextStop = this.props.stopData;
    const oldStopId = prevProps.stopData && prevProps.stopData.id;
    const hasNewStopId = nextStop && nextStop.id !== oldStopId;
    if (hasNewStopId)
      this.props.leaflet.map.setView([nextStop.lat, nextStop.lon]);
  }

  createLeafletElement() {}

  updateLeafletElement() {}

  render() {
    const { stopData, StopMarker } = this.props;

    if (!stopData) return <FeatureGroup />;

    return (
      <FeatureGroup>
        <StopMarker stopData={stopData} />
      </FeatureGroup>
    );
  }
}

StopViewerOverlay.props = {
  /**
   * An object representing a transit stop
   */
  stopData: stopLayerStopType,
  StopMarker: PropTypes.elementType.isRequired
};

StopViewerOverlay.defaultProps = {
  stopData: null
};

export default withLeaflet(StopViewerOverlay);
