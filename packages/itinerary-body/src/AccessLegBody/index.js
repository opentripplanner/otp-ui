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
import { humainzeDistanceString } from "@opentripplanner/humanize-distance";
import { DirectionIcon } from "@opentripplanner/icons/lib/directions";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { CaretDown, CaretUp } from "styled-icons/fa-solid";
import { VelocityTransitionGroup } from "velocity-react";

import LegDiagramPreview from "./leg-diagram-preview";
import * as Styled from "./styled";

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
      followsTransit,
      leg,
      LegIcon,
      routingType,
      timeOptions
    } = this.props;
    const { expanded } = this.state;

    if (leg.mode === "CAR" && leg.hailedCar) {
      return (
        <TNCLeg
          config={config}
          leg={leg}
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
              {expanded ? <CaretUp size={15} /> : <CaretDown size={15} />}
            </span>
          )}
        </Styled.StepsHeader>

        {routingType === "ITINERARY" && <LegDiagramPreview leg={leg} />}
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
  followsTransit: PropTypes.bool,
  leg: legType.isRequired,
  LegIcon: PropTypes.elementType.isRequired,
  legIndex: PropTypes.number.isRequired,
  routingType: PropTypes.string.isRequired,
  setActiveLeg: PropTypes.func.isRequired,
  timeOptions: timeOptionsType.isRequired
};

AccessLegBody.defaultProps = {
  followsTransit: false
};

function TNCLeg({
  config,
  LYFT_CLIENT_ID,
  UBER_CLIENT_ID,
  followsTransit,
  leg,
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
      <div className="place-subheader">
        Wait{" "}
        {!followsTransit && (
          <span>{Math.round(tncData.estimatedArrival / 60)} minutes </span>
        )}
        for {tncData.displayName} pickup
      </div>

      <div className="leg-body">
        {/* The icon/summary row */}
        <AccessLegSummary
          config={config}
          leg={leg}
          onSummaryClick={onSummaryClick}
        />

        {/* The "Book Ride" button */}
        <div
          style={{
            marginTop: 10,
            marginBottom: 10,
            height: 32,
            position: "relative"
          }}
        >
          <a
            className="btn btn-default"
            href={universalLinks[tncData.company]}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: 32,
              paddingTop: 4,
              width: 90,
              textAlign: "center"
            }}
            target={isMobile() ? "_self" : "_blank"}
          >
            Book Ride
          </a>
          {followsTransit && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 94,
                width: 0,
                height: 0,
                borderTop: "16px solid transparent",
                borderBottom: "16px solid transparent",
                borderRight: "16px solid #fcf9d3"
              }}
            />
          )}
          {followsTransit && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 110,
                right: 0,
                bottom: 0
              }}
            >
              <div
                style={{
                  display: "table",
                  backgroundColor: "#fcf9d3",
                  width: "100%",
                  height: "100%"
                }}
              >
                <div
                  style={{
                    padding: "0px 2px",
                    display: "table-cell",
                    verticalAlign: "middle",
                    color: "#444",
                    fontStyle: "italic",
                    lineHeight: 0.95
                  }}
                >
                  Wait until{" "}
                  {formatTime(
                    leg.startTime - tncData.estimatedArrival * 1000,
                    timeOptions
                  )}{" "}
                  to book
                </div>
              </div>
            </div>
          )}
        </div>

        {/* The estimated travel time */}
        <div className="steps-header">
          Estimated travel time: {formatDuration(leg.duration)} (does not
          account for traffic)
        </div>

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
      </div>
    </div>
  );
}

TNCLeg.propTypes = {
  config: configType.isRequired,
  LYFT_CLIENT_ID: PropTypes.string,
  UBER_CLIENT_ID: PropTypes.string,
  followsTransit: PropTypes.bool.isRequired,
  leg: legType.isRequired,
  onSummaryClick: PropTypes.func.isRequired,
  timeOptions: timeOptionsType.isRequired
};

TNCLeg.defaultProps = {
  LYFT_CLIENT_ID: "",
  UBER_CLIENT_ID: ""
};

function AccessLegSummary({ config, leg, /* LegIcon, */ onSummaryClick }) {
  return (
    <Styled.AccessLegClickable onClick={onSummaryClick}>
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
          <span> {humainzeDistanceString(leg.distance)}</span>
        )}
        {` to ${getPlaceName(leg.to, config.companies)}`}
      </div>
    </Styled.AccessLegClickable>
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
