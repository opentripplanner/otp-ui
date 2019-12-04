import React, { useState } from "react";
import PropTypes from "prop-types";
import * as Styled from "./styled";
import { formatDuration } from "../../utils/time";
import * as Accessibility from "~/packages/trip-planner/src/common/components/Accessibility";
import {
  getLegModeLabel,
  getPlaceName,
  getStepDirection,
  getStepStreetName
} from "../../utils/itinerary";
import { distanceString } from "../../utils/distance";

/*
 TODO: Since we're still working on this component, 
 let's retain the original set of props to match OTP-RR
*/
const AccessLegBody = ({
  config,
  // eslint-disable-next-line no-unused-vars
  customIcons,
  // eslint-disable-next-line no-unused-vars
  followsTransit,
  leg,
  // eslint-disable-next-line no-unused-vars
  timeOptions,
  // eslint-disable-next-line no-unused-vars
  legIndex,
  // eslint-disable-next-line no-unused-vars
  routingType,
  // eslint-disable-next-line no-unused-vars
  setActiveLeg
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Styled.LegBody>
      {leg.mode === "CAR" && leg.hailedCar && (
        <div>TODO: TNC Leg goes here</div>
      )
      // TODO: TNC leg, what is this. Need to be incorporated
      // <TNCLeg
      //   config={config}
      //   leg={leg}
      //   onSummaryClick={this._onSummaryClick}
      //   timeOptions={timeOptions}
      //   followsTransit={followsTransit}
      //   customIcons={customIcons} />
      }

      <Styled.AccessLegSummary
        onClick={() => setExpanded(!expanded)}
        expanded={expanded}
      >
        {/* Leg description, e.g. "Walk 0.5 mi to..." */}
        {getLegModeLabel(leg)}{" "}
        {leg.distance > 0 && <> {distanceString(leg.distance)}</>}
        {` to ${getPlaceName(leg.to, config.companies)}`}
      </Styled.AccessLegSummary>

      <Styled.StepsHeader
        onClick={() => setExpanded(!expanded)}
        expanded={expanded.toString()}
      >
        <Accessibility.SROnly>
          Click to expand steps for this leg.
        </Accessibility.SROnly>
        {/* TODO: Duration should say 'minute' */}
        {formatDuration(leg.duration)}
        {leg.mode === "WALK" ? " walk" : " ride"}

        {leg.steps && (
          <Styled.ExpandIcon expanded={expanded.toString()} mode={leg.mode} />
        )}
      </Styled.StepsHeader>

      {/* TODO: Leg Diagram preview component -- shows elevation */}
      {/* {routingType === 'ITINERARY' && (
        <LegDiagramPreview leg={leg} />
      )} */}

      <Styled.AccessStepsListWrapper expanded={expanded.toString()}>
        {expanded && (
          <Styled.AccessStepsList>
            {leg.steps.map((step, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <Styled.AccessStepRow key={i}>
                <Styled.StepDirectionIconColumn>
                  <Accessibility.SRHidden>
                    <Styled.StepDirectionIcon
                      direction={step.relativeDirection}
                    />
                  </Accessibility.SRHidden>
                </Styled.StepDirectionIconColumn>
                <Styled.StepDirectionDetailsColumn>
                  {getStepDirection(step)}
                  {step.relativeDirection === "ELEVATOR" ? " to " : " on "}
                  <Styled.StepStreetName>
                    {getStepStreetName(step)}
                  </Styled.StepStreetName>
                </Styled.StepDirectionDetailsColumn>
              </Styled.AccessStepRow>
            ))}
          </Styled.AccessStepsList>
        )}
      </Styled.AccessStepsListWrapper>
    </Styled.LegBody>
  );
};

AccessLegBody.propTypes = {
  /** TODO: Routing Type is usually 'ITINERARY' but we should get more details on what this does */
  routingType: PropTypes.string.isRequired,
  /** Contains details about leg object that is being displayed */
  leg: PropTypes.shape({
    mode: PropTypes.string.isRequired,
    hailedCar: PropTypes.bool.isRequired,
    distance: PropTypes.number.isRequired,
    to: PropTypes.shape({}).isRequired,
    duration: PropTypes.number.isRequired,
    steps: PropTypes.arrayOf(PropTypes.shape({}).isRequired).isRequired
  }).isRequired,
  /** OTP configuration object */
  config: PropTypes.shape({
    companies: PropTypes.arrayOf(PropTypes.shape({})).isRequired
  }).isRequired,
  /** Custom icons that may be used to override icons included in this library */
  customIcons: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  /** The index value of this specific leg within the itinerary */
  legIndex: PropTypes.number.isRequired,
  /** Contains the preferred format string for time display -- may be able to get this from config */
  timeOptions: PropTypes.shape({}).isRequired,
  /** Indicates whether this leg directly follows a transit leg */
  followsTransit: PropTypes.bool.isRequired,
  /** Sets the active leg */
  setActiveLeg: PropTypes.func.isRequired
};

export default AccessLegBody;
