import {
  Styled as BaseMapStyled,
  MarkerWithPopup
} from "@opentripplanner/base-map";
import FromToLocationPicker, {
  FromToLocation
} from "@opentripplanner/from-to-location-picker";
import React from "react";
import ParkAndRideMarker from "./park-and-ride-marker";

type Props = {
  id?: string;
  keyboard?: boolean;
  parkAndRideLocations: { name: string; x: number; y: number }[];
  setLocation?: (location?: FromToLocation) => void;
};

const ParkAndRideOverlay = (props: Props): JSX.Element | null => {
  const { parkAndRideLocations, setLocation } = props;
  if (!parkAndRideLocations || parkAndRideLocations.length === 0) return null;

  const setLocationOverride = setLocation
    ? (l: FromToLocation) => {
        setLocation(undefined);
        setLocation(l);
      }
    : undefined;

  return (
    <>
      {parkAndRideLocations.map((location, k) => {
        // TODO: extract park-and-ride names from international "Park-And-Ride" string constructs.
        // The code below gets rid of "P+R " prefixes returned by some OTP instances.
        const name = location.name.startsWith("P+R ")
          ? location.name.substring(4)
          : location.name;

        return (
          <MarkerWithPopup
            popupProps={{ offset: 10 }}
            popupContents={
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
                    setLocation={setLocationOverride}
                  />
                </BaseMapStyled.PopupRow>
              </BaseMapStyled.MapOverlayPopup>
            }
            key={k}
            position={[location.y, location.x]}
          >
            <ParkAndRideMarker />
          </MarkerWithPopup>
        );
      })}
    </>
  );
};

export default ParkAndRideOverlay;
