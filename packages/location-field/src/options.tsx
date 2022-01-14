import coreUtils from "@opentripplanner/core-utils";
import { humanizeDistanceStringImperial } from "@opentripplanner/humanize-distance";
import React from "react";
import { Bus } from "@styled-icons/fa-solid/Bus";
import { Briefcase } from "@styled-icons/fa-solid/Briefcase";
import { Home } from "@styled-icons/fa-solid/Home";
import { MapMarker } from "@styled-icons/fa-solid/MapMarker";
import { MapPin } from "@styled-icons/fa-solid/MapPin";

import * as S from "./styled";
// eslint-disable-next-line prettier/prettier
import type { TransitIndexStopWithRoutes, UserLocation } from "./types";

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
      return <Bus size={13} />;
    }
  }
  return <MapPin size={13} />;
}

export function Option({
  color = null,
  disabled = false,
  icon = null,
  isActive = false,
  onClick,
  title = null,
  subTitle = null,
  classes = ""
}: {
  classes?: string;
  color?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
}): React.ReactElement {
  return (
    <S.MenuItem onClick={onClick} active={isActive} disabled={disabled}>
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
            <S.OptionSubTitle>{subTitle}</S.OptionSubTitle>
          </S.OptionContent>
        </S.OptionContainer>
      )}
    </S.MenuItem>
  );
}

export function TransitStopOption({
  isActive = false,
  onClick,
  stop,
  stopOptionIcon
}: {
  isActive?: boolean;
  onClick: () => void;
  stop: TransitIndexStopWithRoutes;
  stopOptionIcon: React.ReactNode;
}): React.ReactElement {
  return (
    <S.MenuItem onClick={onClick} active={isActive}>
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
    </S.MenuItem>
  );
}

export function UserLocationIcon({ userLocation }: { userLocation: UserLocation }): React.ReactElement {
  if (userLocation.icon === "work") return <Briefcase size={13} />;
  if (userLocation.icon === "home") return <Home size={13} />;
  return <MapMarker size={13} />;
}
