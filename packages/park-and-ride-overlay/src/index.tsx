import {
  Styled as BaseMapStyled,
  MarkerWithPopup
} from "@opentripplanner/base-map";
import FromToLocationPicker from "@opentripplanner/from-to-location-picker";
import { Location } from "@opentripplanner/types";
import React from "react";
import ParkAndRideMarker from "./park-and-ride-marker";

type Props = {
  id?: string;
  keyboard?: boolean;
  parkAndRideLocations: { name: string; x: number; y: number }[];
  setLocation: ({
    location,
    locationType,
    reverseGeocode
  }: {
    location: Location;
    locationType: string;
    reverseGeocode: boolean;
  }) => void;
};

const ParkAndRideOverlay = (props: Props): JSX.Element => {
  const { parkAndRideLocations, setLocation } = props;
  if (!parkAndRideLocations || parkAndRideLocations.length === 0) return null;

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
            // TODO: find a better way to handle popupProps
            // @ts-expect-error lat and lng aren't optional, but are being set by the child
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
                    setLocation={
                      setLocation
                        ? l => {
                            setLocation(null);
                            setLocation(l);
                          }
                        : null
                    }
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
