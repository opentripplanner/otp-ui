import coreUtils from "@opentripplanner/core-utils";
import { humanizeDistanceStringImperial } from "@opentripplanner/humanize-distance";
import React, { ReactElement } from "react";
import { FormattedMessage } from "react-intl";
import { Bus } from "@styled-icons/fa-solid/Bus";
import { Briefcase } from "@styled-icons/fa-solid/Briefcase";
import { Home } from "@styled-icons/fa-solid/Home";
import { MapMarker } from "@styled-icons/fa-solid/MapMarker";
import { MapPin } from "@styled-icons/fa-solid/MapPin";

import { Stop, UserLocation } from "@opentripplanner/types";
import * as S from "./styled";

export const ICON_SIZE = 13;

export function GeocodedOptionIcon({
  feature = {}
}: {
  feature: {
    properties?: { source: string };
  };
}): React.ReactElement {
  const { properties } = feature;
  if (feature && properties) {
    const { source } = properties;
    if (source === "transit") {
      return <Bus size={ICON_SIZE} />;
    }
  }
  return <MapPin size={ICON_SIZE} />;
}

export const MenuItem = ({
  active = false,
  children,
  disabled = false,
  id,
  onClick = null
}: {
  active?: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  id?: string;
  onClick?: () => void;
}): React.ReactElement => (
  <S.MenuItemLi
    // Hide disabled choices from screen readers (a relevant status is already provided).
    aria-hidden={disabled || undefined}
    disabled={disabled}
    role={disabled ? undefined : "none"}
  >
    <S.MenuItemA
      active={active}
      id={id}
      onClick={disabled ? null : onClick}
      role="option"
      tabIndex={-1}
    >
      {children}
    </S.MenuItemA>
  </S.MenuItemLi>
);

export function Option({
  classes = "",
  color = null,
  disabled = false,
  icon = null,
  id,
  isActive = false,
  onClick,
  subTitle = null,
  title = null
}: {
  classes?: string;
  color?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  id?: string;
  isActive?: boolean;
  onClick?: () => void;
  subTitle?: React.ReactNode;
  title?: React.ReactNode;
}): React.ReactElement {
  return (
    <MenuItem active={isActive} disabled={disabled} id={id} onClick={onClick}>
      {coreUtils.ui.isIE() ? (
        // In internet explorer 11, some really weird stuff is happening where it
        // is not possible to click the text of the title, but if you click just
        // above it, then it works. So, if using IE 11, just return the title text
        // and avoid all the extra fancy stuff.
        // See https://github.com/ibi-group/trimet-mod-otp/issues/237
        title
      ) : (
        <S.OptionContainer className={classes}>
          <S.OptionIconContainer style={{ color }}>
            {icon}
          </S.OptionIconContainer>
          <S.OptionContent>
            {title}
            {subTitle && (
              <S.OptionSubTitle>
                <S.HiddenContent>, </S.HiddenContent>
                {subTitle}
              </S.OptionSubTitle>
            )}
          </S.OptionContent>
        </S.OptionContainer>
      )}
    </MenuItem>
  );
}

export function TransitStopOption({
  id,
  isActive = false,
  onClick,
  stop,
  stopOptionIcon
}: {
  id?: string;
  isActive?: boolean;
  onClick: () => void;
  stop: Stop;
  stopOptionIcon: React.ReactNode;
}): React.ReactElement {
  return (
    <MenuItem active={isActive} id={id} onClick={onClick}>
      <S.StopIconAndDistanceContainer>
        {stopOptionIcon}
        <S.StopDistance>
          {humanizeDistanceStringImperial(stop.dist, true)}
        </S.StopDistance>
      </S.StopIconAndDistanceContainer>
      <S.StopContentContainer>
        <S.StopName>
          {stop.name} ({stop.code})
        </S.StopName>
        <S.StopRoutes>
          {(stop.routes || []).map(route => {
            const name = route.shortName || route.longName;
            return <S.RouteName key={`route-${name}`}>{name}</S.RouteName>;
          })}
        </S.StopRoutes>
      </S.StopContentContainer>
      <S.ClearBoth />
    </MenuItem>
  );
}

export function UserLocationIcon({
  userLocation
}: {
  userLocation: UserLocation;
}): React.ReactElement {
  if (userLocation.icon === "work") return <Briefcase size={ICON_SIZE} />;
  if (userLocation.icon === "home") return <Home size={ICON_SIZE} />;
  return <MapMarker size={ICON_SIZE} />;
}

function LocationName({ location }: { location: UserLocation }): ReactElement {
  switch (location.type) {
    case "home":
      return (
        <FormattedMessage
          defaultMessage="Home"
          description="The home location"
          id="otpUi.LocationField.homeLocation"
        />
      );
    case "work":
      return (
        <FormattedMessage
          defaultMessage="Work"
          description="The work location"
          id="otpUi.LocationField.workLocation"
        />
      );
    default:
      return <>{location.name}</>;
  }
}

export function StoredPlaceName({
  location,
  withDetails = true
}: {
  location: UserLocation;
  withDetails?: boolean;
}): React.ReactElement {
  let detailText;
  if (withDetails) {
    if (location.type === "home" || location.type === "work") {
      detailText = location.name;
    } else if (location.type === "stop") {
      detailText = location.id;
    }
    // The case below for recent searches is not currently being used.
    // } else if (location.type === "recent" && location.timestamp) {
    //   detailText = moment(location.timestamp).fromNow();
  }

  return detailText && detailText !== "" ? (
    <FormattedMessage
      defaultMessage="{placeName} ({details})"
      description="Renders a place and some brief detail text."
      id="otpUi.LocationField.placeNameWithDetails"
      values={{
        details: detailText,
        placeName: <LocationName location={location} />
      }}
    />
  ) : (
    <LocationName location={location} />
  );
}
