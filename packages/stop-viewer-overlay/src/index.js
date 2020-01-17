import { leafletPathType } from "@opentripplanner/core-utils/lib/types";
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
    const { leafletPath, radius, stopData } = this.props;

    if (!stopData) return <FeatureGroup />;

    return (
      <FeatureGroup>
        <CircleMarker
          /* eslint-disable-next-line react/jsx-props-no-spreading */
          {...leafletPath}
          center={[stopData.lat, stopData.lon]}
          key={stopData.id}
          radius={radius}
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
   * Leaflet path properties to use to style the marker that represents the
   * stop.
   *
   * See https://leafletjs.com/reference-1.6.0.html#path
   */
  leafletPath: leafletPathType,
  /**
   * The radius in pixels for the stop marker
   */
  radius: PropTypes.number,
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

StopViewerOverlay.defaultProps = {
  leafletPath: {
    color: "#000",
    fillColor: "cyan",
    fillOpacity: 1,
    weight: 3
  },
  radius: 9
};

export default withLeaflet(StopViewerOverlay);
