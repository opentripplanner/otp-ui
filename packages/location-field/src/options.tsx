import { humanizeDistanceStringImperial } from "@opentripplanner/humanize-distance";
import { Stop, UserLocation } from "@opentripplanner/types";
import React from "react";
import { IntlShape } from "react-intl";
import { Bus } from "@styled-icons/fa-solid/Bus";
import { Briefcase } from "@styled-icons/fa-solid/Briefcase";
import { Home } from "@styled-icons/fa-solid/Home";
import { MapMarker } from "@styled-icons/fa-solid/MapMarker";
import { MapPin } from "@styled-icons/fa-solid/MapPin";

import * as S from "./styled";
import {
  UserLocationIconType,
  UserLocationSelectedHandler,
  UserLocationRenderData,
  UserLocationIconProps
} from "./types";
import { addInParentheses } from "./utils";

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
    /* A known issue prevents combobox results to be read out on Voiceover. This is a hack to ensure 
    AT hear all options - see https://react-spectrum.adobe.com/blog/building-a-combobox.html#voiceover */
    aria-live={active ? "assertive" : "off"}
    active={active}
    id={id}
    onClick={disabled ? null : onClick}
    role="option"
    aria-selected={active}
    tabIndex={-1}
  >
    {children}
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
  secondaryLabels = [],
  showSecondaryLabels = true,
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
  secondaryLabels?: string[];
  showSecondaryLabels?: boolean;
  subTitle?: React.ReactNode;
  title?: React.ReactNode;
}): React.ReactElement {
  return (
    <MenuItem active={isActive} disabled={disabled} id={id} onClick={onClick}>
      <S.OptionContainer className={classes}>
        <S.OptionIconContainer style={{ color }}>{icon}</S.OptionIconContainer>
        <S.OptionContent>
          {title}
          {subTitle && (
            <S.OptionSubTitle>
              <S.HiddenContent>, </S.HiddenContent>
              {subTitle}
            </S.OptionSubTitle>
          )}
          {/* Only show top 5 results to avoid chaos */}
          {showSecondaryLabels &&
            secondaryLabels?.slice(0, 5).map((label, idx) => (
              <S.OptionAltLabel key={idx}>
                <S.HiddenContent>, </S.HiddenContent>
                {label}
              </S.OptionAltLabel>
            ))}
        </S.OptionContent>
      </S.OptionContainer>
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
}: UserLocationIconProps): React.ReactElement {
  if (userLocation.icon === "work") return <Briefcase size={ICON_SIZE} />;
  if (userLocation.icon === "home") return <Home size={ICON_SIZE} />;
  return <MapMarker size={ICON_SIZE} />;
}

function getLocationName(location: UserLocation, intl: IntlShape): string {
  switch (location.type) {
    case "home":
      return intl.formatMessage({
        defaultMessage: "Home",
        description: "The home location",
        id: "otpUi.LocationField.homeLocation"
      });
    case "work":
      return intl.formatMessage({
        defaultMessage: "Work",
        description: "The work location",
        id: "otpUi.LocationField.workLocation"
      });
    default:
      return location.name;
  }
}

export function getStoredPlaceName(
  location: UserLocation,
  intl: IntlShape,
  withDetails = true
): string {
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

  return addInParentheses(intl, getLocationName(location, intl), detailText);
}

/**
 * Helper to populate the display name for a user-saved location.
 */
export function getRenderData(
  location: UserLocation,
  setLocation: UserLocationSelectedHandler,
  Icon: UserLocationIconType,
  intl: IntlShape
): UserLocationRenderData {
  return {
    displayName: getStoredPlaceName(location, intl),
    icon: <Icon userLocation={location} />,
    // Create the event handler for when the location is selected
    locationSelected: () => setLocation(location, "SAVED")
  };
}
