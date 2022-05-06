import { Styled as BaseMapStyled } from "@opentripplanner/base-map";
import FromToLocationPicker from "@opentripplanner/from-to-location-picker";
import PropTypes from "prop-types";
import React from "react";
import {
  FeatureGroup,
  MapLayer,
  Marker,
  Popup,
  withLeaflet
} from "react-leaflet";
import parkAndRideMarker from "./park-and-ride-marker";

class ParkAndRideOverlay extends MapLayer {
  componentDidMount() {}

  componentWillUnmount() {}

  createLeafletElement() {}

  updateLeafletElement() {}

  render() {
    const { keyboard, parkAndRideLocations, setLocation } = this.props;
    if (!parkAndRideLocations || parkAndRideLocations.length === 0)
      return <FeatureGroup />;

    return (
      <FeatureGroup>
        {parkAndRideLocations.map((location, k) => {
          // TODO: extract park-and-ride names from international "Park-And-Ride" string constructs.
          const name = location.name.startsWith("P+R ")
            ? location.name.substring(4)
            : location.name;
          return (
            <Marker
              icon={parkAndRideMarker}
              key={k}
              keyboard={keyboard}
              position={[location.y, location.x]}
            >
              <Popup>
                <BaseMapStyled.MapOverlayPopup>
                  <BaseMapStyled.PopupTitle>{name}</BaseMapStyled.PopupTitle>
                  <BaseMapStyled.PopupRow>
                    <FromToLocationPicker
                      label
                      location={{
                        lat: location.y,
                        lon: location.x,
                        name
                      }}
                      setLocation={setLocation}
                    />
                  </BaseMapStyled.PopupRow>
                </BaseMapStyled.MapOverlayPopup>
              </Popup>
            </Marker>
          );
        })}
      </FeatureGroup>
    );
  }
}

ParkAndRideOverlay.propTypes = {
  keyboard: PropTypes.bool,
  parkAndRideLocations: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    }).isRequired
  ),
  setLocation: PropTypes.func.isRequired
};

ParkAndRideOverlay.defaultProps = {
  keyboard: false
};

export default withLeaflet(ParkAndRideOverlay);
