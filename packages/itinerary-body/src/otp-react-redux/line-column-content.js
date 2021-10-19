import coreUtils from "@opentripplanner/core-utils";
import LocationIcon from "@opentripplanner/location-icon";
import PropTypes from "prop-types";
import React from "react";
import styled, { css } from "styled-components";
import { Circle } from "@styled-icons/fa-solid/Circle";

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

const legLineBackgroundColor = ({ leg, routeColor }) => {
  const { mode } = leg;
  return coreUtils.itinerary.isTransit(mode)
    ? routeColor
      ? `#${routeColor}`
      : "#008"
    : undefined;
};

const LegLine = styled.div`
  ${props => getLegCSS(props.leg.mode)}

  /* Disabling CSS order rules is the only way to ensure styles override each other properly */
  /* stylelint-disable declaration-block-no-shorthand-property-overrides */ 
  background-color: ${props => legLineBackgroundColor(props)};
  background: ${props =>
    coreUtils.itinerary.isFlex(props.leg)
      ? `repeating-linear-gradient( 
        -45deg, 
        transparent, 
        transparent 5px, 
        ${legLineBackgroundColor(props)} 5px, 
        ${legLineBackgroundColor(props)} 10px
        );`
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
  isDestination,
  lastLeg,
  leg,
  legIndex
}) {
  let legBadge;
  if (interline) {
    // Interlined. Don't create a leg badge as a stop marker should be inserted
    // from the place name
  } else if (isDestination) {
    // Destination
    legBadge = (
      <>
        <StackedCircleInner size={14} color="white" />
        <StyledLocationIcon size={20} type="to" />
      </>
    );
  } else if (legIndex === 0) {
    // Origin
    legBadge = (
      <>
        <StackedCircleInner size={14} color="white" />
        <StyledLocationIcon size={20} type="from" />
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
      {!isDestination && <LegLine leg={leg} routeColor={leg.routeColor} />}
      <IconStacker>{legBadge}</IconStacker>
    </>
  );
}

LineColumnContent.propTypes = {
  /** whether this leg is an interlined-transit leg */
  interline: PropTypes.bool.isRequired,
  /** whether this place row represents the destination */
  isDestination: PropTypes.bool.isRequired,
  /** Contains details about leg object that is being displayed */
  lastLeg: coreUtils.types.legType,
  /** Contains details about leg object that is being displayed */
  leg: coreUtils.types.legType.isRequired,
  /** the index of the leg in the itinerary leg list */
  legIndex: PropTypes.number.isRequired
};

LineColumnContent.defaultProps = {
  /** can be null if it's the first leg */
  lastLeg: null
};
