import coreUtils from "@opentripplanner/core-utils";
import LocationIcon from "@opentripplanner/location-icon";
import PropTypes from "prop-types";
import React from "react";
import styled, { css } from "styled-components";
import { Circle } from "styled-icons/fa-solid";

const cssWalk = css`
  background: radial-gradient(ellipse at center, #87cefa 40%, transparent 10%);
  background-position: center -5px;
  background-repeat: repeat-y;
  background-size: 12px 12px;
  left: 6px;
  right: 6px;
`;

const cssBicycle = css`
  background: repeating-linear-gradient(
    0deg,
    red,
    red 8px,
    white 8px,
    white 12.5px
  );
  left: 7.5px;
  right: 7.5px;
`;

const cssCar = css`
  background: repeating-linear-gradient(
    0deg,
    grey,
    grey 8px,
    white 8px,
    white 12.5px
  );
  left: 7.5px;
  right: 7.5px;
`;

const cssMicromobility = css`
  background: repeating-linear-gradient(
    0deg,
    #f5a729,
    #f5a729 8px,
    white 8px,
    white 12.5px
  );
  left: 7.5px;
  right: 7.5px;
`;

const cssTransit = css`
  background-color: gray;
  left: 5px;
  right: 5px;
`;

function getLegCSS(mode) {
  switch (mode) {
    case "WALK":
      return cssWalk;
    case "BICYCLE":
    case "BICYCLE_RENT":
      return cssBicycle;
    case "CAR":
      return cssCar;
    case "MICROMOBILITY":
    case "MICROMOBILITY_RENT":
      return cssMicromobility;
    default:
      return cssTransit;
  }
}

const IconStacker = styled.span`
  position: absolute;
  width: 100%;
  top: 3px;
  z-index: 20;
`;

const LegLine = styled.div`
  ${props => getLegCSS(props.mode)}
  background-color: ${props =>
    coreUtils.itinerary.isTransit(props.mode)
      ? props.routeColor
        ? `#${props.routeColor}`
        : "#008"
      : undefined};
  bottom: -11px;
  position: absolute;
  top: 11px;
  z-index: 10;
`;

const StackedCircle = styled(Circle)`
  left: 0;
  line-height: inherit;
  position: absolute;
  text-align: center;
  width: 100%;
`;

const StackedCircleInner = styled(StackedCircle)`
  top: 3px;
`;

const StyledLocationIcon = styled(LocationIcon)`
  left: 0;
  position: absolute;
  text-align: center;
  width: 100%;
`;

export default function LineColumnContent({
  interline,
  lastLeg,
  leg,
  legIndex
}) {
  let legBadge;
  if (interline) {
    // Interlined. Do nothing as a stop marker should be inserted from the place
    // name
  } else if (legIndex === 0) {
    // Origin
    legBadge = (
      <>
        <StackedCircleInner size={14} color="white" />
        <StyledLocationIcon size={20} type="from" />
      </>
    );
  } else if (!leg) {
    // Desitination
    legBadge = (
      <>
        <StackedCircleInner size={14} color="white" />
        <StyledLocationIcon size={20} type="to" />
      </>
    );
  } else if (
    leg.from.bikeShareId ||
    (lastLeg.from.bikeShareId && leg.mode === "WALK")
  ) {
    // start or end of a bike rental leg (not including origin or
    // destination)
    legBadge = <StackedCircle size={17} color="red" />;
  } else if (
    leg.from.vertexType === "VEHICLERENTAL" ||
    (lastLeg.from.vertexType === "VEHICLERENTAL" && leg.mode === "WALK")
  ) {
    // start or end of a vehicle rental leg (not including origin or
    // destination)
    legBadge = <StackedCircle size={17} color="#f5a729" />;
  } else if (
    (leg.mode === "CAR" && lastLeg.mode === "WALK") ||
    (lastLeg.mode === "CAR" && leg.mode === "WALK")
  ) {
    // start or end of a car rental/TNC/P&R leg (not including origin or
    // destination)
    legBadge = <StackedCircle size={17} color="#888" />;
  } else {
    legBadge = (
      <>
        <StackedCircle size={20} color="black" />
        <StackedCircleInner size={14} color="white" />
      </>
    );
  }

  return (
    <>
      {leg && <LegLine mode={leg.mode} routeColor={leg.routeColor} />}
      <IconStacker>{legBadge}</IconStacker>
    </>
  );
}

LineColumnContent.propTypes = {
  /** whether this leg is an interlined-transit leg */
  interline: PropTypes.bool.isRequired,
  /** Contains details about leg object that is being displayed */
  lastLeg: coreUtils.types.legType,
  /** Contains details about leg object that is being displayed */
  leg: coreUtils.types.legType,
  /** the index of the leg in the itinerary leg list */
  legIndex: PropTypes.number
};

LineColumnContent.defaultProps = {
  // can be null if it's the first leg
  lastLeg: null,
  // can be null if this is the destination place
  leg: null,
  // can be null if this is the destination place
  legIndex: null
};
