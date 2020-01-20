import currencyFormatter from "currency-formatter";
import {
  getLegModeLabel,
  getPlaceName,
  getStepDirection,
  getStepStreetName
} from "@opentripplanner/core-utils/lib/itinerary";
import {
  formatDuration,
  formatTime
} from "@opentripplanner/core-utils/lib/time";
import {
  configType,
  legType,
  stepsType,
  timeOptionsType
} from "@opentripplanner/core-utils/lib/types";
import { isMobile } from "@opentripplanner/core-utils/lib/ui";
import { humanizeDistanceString } from "@opentripplanner/humanize-distance";
import { DirectionIcon } from "@opentripplanner/icons/lib/directions";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { VelocityTransitionGroup } from "velocity-react";

import LegDiagramPreview from "./leg-diagram-preview";
import * as Styled from "../styled";

/**
 * Component for access (e.g. walk/bike/etc.) leg in narrative itinerary. This
 * particular component is used in the line-itin (i.e., trimet-mod-otp) version
 * of the narrative itinerary.
 */
export default class AccessLegBody extends Component {
  constructor(props) {
    super(props);
    this.state = { expanded: false };
  }

  onStepsHeaderClick = () => {
    const { expanded } = this.state;
    this.setState({ expanded: !expanded });
  };

  onSummaryClick = () => {
    const { leg, legIndex, setActiveLeg } = this.props;
    setActiveLeg(legIndex, leg);
  };

  render() {
    const {
      config,
      diagramVisible,
      followsTransit,
      leg,
      LegIcon,
      routingType,
      setLegDiagram,
      showElevationProfile,
      timeOptions
    } = this.props;
    const { expanded } = this.state;

    if (leg.mode === "CAR" && leg.hailedCar) {
      return (
        <TNCLeg
          config={config}
          leg={leg}
          LegIcon={LegIcon}
          onSummaryClick={this.onSummaryClick}
          timeOptions={timeOptions}
          followsTransit={followsTransit}
        />
      );
    }

    return (
      <Styled.LegBody>
        <AccessLegSummary
          config={config}
          leg={leg}
          LegIcon={LegIcon}
          onSummaryClick={this.onSummaryClick}
        />
        <Styled.StepsHeader onClick={this.onStepsHeaderClick}>
          {formatDuration(leg.duration)}
          {leg.steps && (
            <span>
              {" "}
              <Styled.CaretToggle expanded />
            </span>
          )}
        </Styled.StepsHeader>

        {routingType === "ITINERARY" && (
          <LegDiagramPreview
            diagramVisible={diagramVisible}
            leg={leg}
            setLegDiagram={setLegDiagram}
            showElevationProfile={showElevationProfile}
          />
        )}
        <VelocityTransitionGroup
          enter={{ animation: "slideDown" }}
          leave={{ animation: "slideUp" }}
        >
          {expanded && <AccessLegSteps steps={leg.steps} />}
        </VelocityTransitionGroup>
      </Styled.LegBody>
    );
  }
}

AccessLegBody.propTypes = {
  config: configType.isRequired,
  /**
   * Should be either null or a legType. Indicates that a particular leg diagram
   * has been selected and is active.
   */
  diagramVisible: legType,
  followsTransit: PropTypes.bool,
  leg: legType.isRequired,
  LegIcon: PropTypes.elementType.isRequired,
  legIndex: PropTypes.number.isRequired,
  routingType: PropTypes.string.isRequired,
  setActiveLeg: PropTypes.func.isRequired,
  setLegDiagram: PropTypes.func.isRequired,
  showElevationProfile: PropTypes.bool,
  timeOptions: timeOptionsType
};

AccessLegBody.defaultProps = {
  diagramVisible: null,
  followsTransit: false,
  showElevationProfile: false,
  timeOptions: null
};

function TNCLeg({
  config,
  LYFT_CLIENT_ID,
  UBER_CLIENT_ID,
  followsTransit,
  leg,
  LegIcon,
  onSummaryClick,
  timeOptions
}) {
  const universalLinks = {
    UBER: `https://m.uber.com/${
      isMobile() ? "ul/" : ""
    }?client_id=${UBER_CLIENT_ID}&action=setPickup&pickup[latitude]=${
      leg.from.lat
    }&pickup[longitude]=${leg.from.lon}&pickup[formatted_address]=${encodeURI(
      leg.from.name
    )}&dropoff[latitude]=${leg.to.lat}&dropoff[longitude]=${
      leg.to.lon
    }&dropoff[formatted_address]=${encodeURI(leg.to.name)}`,
    LYFT: `https://lyft.com/ride?id=lyft&partner=${LYFT_CLIENT_ID}&pickup[latitude]=${leg.from.lat}&pickup[longitude]=${leg.from.lon}&destination[latitude]=${leg.to.lat}&destination[longitude]=${leg.to.lon}`
  };
  const { tncData } = leg;

  if (!tncData || !tncData.estimatedArrival) return null;
  return (
    <div>
      <Styled.PlaceSubheader>
        Wait{" "}
        {!followsTransit && (
          <span>{Math.round(tncData.estimatedArrival / 60)} minutes </span>
        )}
        for {tncData.displayName} pickup
      </Styled.PlaceSubheader>

      <Styled.LegBody>
        {/* The icon/summary row */}
        <AccessLegSummary
          config={config}
          leg={leg}
          LegIcon={LegIcon}
          onSummaryClick={onSummaryClick}
        />

        {/* The "Book Ride" button */}
        <Styled.BookTNCRideButtonContainer>
          <Styled.BookTNCRideButton
            href={universalLinks[tncData.company]}
            target={isMobile() ? "_self" : "_blank"}
          >
            Book Ride
          </Styled.BookTNCRideButton>
          {followsTransit && <Styled.BookLaterPointer />}
          {followsTransit && (
            <Styled.BookLaterContainer>
              <Styled.BookLaterInnerContainer>
                <Styled.BookLaterText>
                  Wait until{" "}
                  {formatTime(
                    leg.startTime - tncData.estimatedArrival * 1000,
                    timeOptions
                  )}{" "}
                  to book
                </Styled.BookLaterText>
              </Styled.BookLaterInnerContainer>
            </Styled.BookLaterContainer>
          )}
        </Styled.BookTNCRideButtonContainer>

        {/* The estimated travel time */}
        <Styled.StepsHeader>
          Estimated travel time: {formatDuration(leg.duration)} (does not
          account for traffic)
        </Styled.StepsHeader>

        {/* The estimated travel cost */}
        {tncData.minCost && (
          <p>
            Estimated cost:{" "}
            {`${currencyFormatter.format(tncData.minCost, {
              code: tncData.currency
            })} - ${currencyFormatter.format(tncData.maxCost, {
              code: tncData.currency
            })}`}
          </p>
        )}
      </Styled.LegBody>
    </div>
  );
}

TNCLeg.propTypes = {
  config: configType.isRequired,
  LYFT_CLIENT_ID: PropTypes.string,
  UBER_CLIENT_ID: PropTypes.string,
  followsTransit: PropTypes.bool.isRequired,
  leg: legType.isRequired,
  LegIcon: PropTypes.elementType.isRequired,
  onSummaryClick: PropTypes.func.isRequired,
  timeOptions: timeOptionsType
};

TNCLeg.defaultProps = {
  LYFT_CLIENT_ID: "",
  UBER_CLIENT_ID: "",
  timeOptions: null
};

function AccessLegSummary({ config, leg, /* LegIcon, */ onSummaryClick }) {
  return (
    <Styled.LegClickable onClick={onSummaryClick}>
      {/* Mode-specific icon
      <div>
        <Styled.LegIconContainer>
          <LegIcon leg={leg} />
        </Styled.LegIconContainer>
      </div> */}

      {/* Leg description, e.g. "Walk 0.5 mi to..." */}
      <div>
        {getLegModeLabel(leg)}{" "}
        {leg.distance > 0 && (
          <span> {humanizeDistanceString(leg.distance)}</span>
        )}
        {` to ${getPlaceName(leg.to, config.companies)}`}
      </div>
    </Styled.LegClickable>
  );
}

AccessLegSummary.propTypes = {
  config: configType.isRequired,
  leg: legType.isRequired,
  // LegIcon: PropTypes.elementType.isRequired,
  onSummaryClick: PropTypes.func.isRequired
};

function AccessLegSteps({ steps }) {
  return (
    <Styled.Steps>
      {steps.map((step, k) => {
        return (
          <Styled.StepRow key={k}>
            <Styled.StepIconContainer>
              <DirectionIcon relativeDirection={step.relativeDirection} />
            </Styled.StepIconContainer>

            <Styled.StepDescriptionContainer>
              {getStepDirection(step)}
              <span>
                {step.relativeDirection === "ELEVATOR" ? " to " : " on "}
              </span>
              <Styled.StepStreetName>
                {getStepStreetName(step)}
              </Styled.StepStreetName>
            </Styled.StepDescriptionContainer>
          </Styled.StepRow>
        );
      })}
    </Styled.Steps>
  );
}

AccessLegSteps.propTypes = {
  steps: stepsType.isRequired
};
