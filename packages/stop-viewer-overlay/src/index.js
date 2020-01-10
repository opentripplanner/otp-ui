import PropTypes from "prop-types";
import React from "react";
import {
  FeatureGroup,
  MapLayer,
  Popup,
  CircleMarker,
  withLeaflet
} from "react-leaflet";

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
    const { stopData } = this.props;

    if (!stopData) return <FeatureGroup />;

    return (
      <FeatureGroup>
        <CircleMarker
          key={stopData.id}
          center={[stopData.lat, stopData.lon]}
          radius={9}
          fillOpacity={1}
          fillColor="cyan"
          color="#000"
          weight={3}
        >
          <Popup>
            <div>{stopData.name}</div>
          </Popup>
        </CircleMarker>
      </FeatureGroup>
    );
  }
}

StopViewerOverlay.props = {
  /**
   * An object representing a transit stop
   */
  stopData: PropTypes.shape({
    id: PropTypes.string.isRequired,
    lat: PropTypes.number.isRequired,
    lon: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  })
};

export default withLeaflet(StopViewerOverlay);
