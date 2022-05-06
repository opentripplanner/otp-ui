import {
  ClearLocationArg,
  Location,
  MapLocationActionArg,
  UserLocationAndType
} from "@opentripplanner/types";
import React, { ComponentType, ReactElement } from "react";

import Endpoint from "./endpoint";
import * as S from "./styled";

interface Props {
  /**
   * Dispatched when a user clicks on the clear location button in the user
   * settings. Not needed unless user settings is activated. Dispatched with an
   * argument in the form of:
   *
   * { type: "from/to" }
   */
  clearLocation?: (arg: ClearLocationArg) => void;
  /**
   * Dispatched when a user clicks on the forget location button in the user
   * settings. Not needed unless user settings is activated. Dispatched with a
   * string argument representing the type of saved location.
   */
  forgetPlace?: (type: string) => void;
  /**
   * The from location.
   */
  fromLocation?: Location;
  /**
   * Intermediate places along a journey.
   */
  intermediatePlaces?: Location[];
  /**
   * An array of location that the user has saved. Not needed unless user
   * settings is activated.
   */
  locations?: Location[];
  /**
   * An optional custom component that can be used to create custom html that
   * is used in a leaflet divIcon to render the map marker icon for each
   * endpoint.
   *
   * See https://leafletjs.com/reference-1.6.0.html#divicon
   *
   * This component is passed 2 props:
   * - location: either the from or to location depending on the endpoint
   * - type: either "from" or "to"
   */
  MapMarkerIcon?: ComponentType<UserLocationAndType>;
  /**
   * Dispatched when a user clicks on the remember place button in the user
   * settings. Not needed unless user settings is activated. Dispatched with an
   * argument in the form of:
   *
   * { location: {...location}, type: "home/work" }
   */
  rememberPlace?: (arg: UserLocationAndType) => void;
  /**
   * Dispatched when a location is dragged somewhere else on the map. Dispatched
   * with an argument in the form of:
   *
   * { location: {...location}, reverseGeocode: true, type: "from/to" }
   */
  setLocation: (arg: MapLocationActionArg) => void;
  /**
   * Whether or not to show the user settings popup when an endpoint is clicked.
   */
  showUserSettings?: boolean;
  /**
   * To to location
   */
  toLocation?: Location;
}

const noop = () => {};

function DefaultMapMarkerIcon({
  location,
  type
}: UserLocationAndType): ReactElement {
  let inner;
  switch (type) {
    case "to":
      inner = (
        <>
          <S.StackedToIcon size={24} type={type} />
          <S.ToIcon size={20} type={type} />
        </>
      );
      break;
    default:
      // Default to the location icon on top of a white background.
      inner = (
        <>
          <S.StackedCircle size={24} />
          <S.StackedLocationIcon size={24} type={type} />
        </>
      );
      break;
  }
  return (
    <S.StackedIconContainer title={location.name}>
      {inner}
    </S.StackedIconContainer>
  );
}

const EndpointsOverlay = ({
  clearLocation = noop,
  forgetPlace = noop,
  fromLocation,
  intermediatePlaces = [],
  locations = [],
  MapMarkerIcon = DefaultMapMarkerIcon,
  rememberPlace = noop,
  setLocation,
  showUserSettings,
  toLocation
}: Props): ReactElement => (
  <div>
    <Endpoint
      clearLocation={clearLocation}
      forgetPlace={forgetPlace}
      location={fromLocation}
      locations={locations}
      MapMarkerIcon={MapMarkerIcon}
      rememberPlace={rememberPlace}
      setLocation={setLocation}
      showUserSettings={showUserSettings}
      type="from"
    />
    {intermediatePlaces.map((place, index) => {
      return (
        <Endpoint
          key={index}
          clearLocation={clearLocation}
          forgetPlace={forgetPlace}
          location={place}
          locations={locations}
          MapMarkerIcon={MapMarkerIcon}
          rememberPlace={rememberPlace}
          setLocation={setLocation}
          showUserSettings={showUserSettings}
          type={place.type}
        />
      );
    })}
    <Endpoint
      clearLocation={clearLocation}
      forgetPlace={forgetPlace}
      location={toLocation}
      locations={locations}
      MapMarkerIcon={MapMarkerIcon}
      rememberPlace={rememberPlace}
      setLocation={setLocation}
      showUserSettings={showUserSettings}
      type="to"
    />
  </div>
);

export default EndpointsOverlay;

// Rename styled components for export
export { S as Styled };
