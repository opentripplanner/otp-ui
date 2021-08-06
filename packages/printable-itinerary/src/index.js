import coreUtils from "@opentripplanner/core-utils";
import PropTypes from "prop-types";
import React from "react";

import AccessLeg from "./access-leg";
import * as S from "./styled";
import TNCLeg from "./tnc-leg";
import TransitLeg from "./transit-leg";

function PrintableItinerary({
  className,
  config,
  itinerary,
  LegIcon,
  timeOptions
}) {
  return (
    <S.PrintableItinerary className={className}>
      {itinerary.legs.length > 0 && (
        <S.CollapsedTop>
          <S.LegBody>
            <S.LegHeader>
              <b>Depart</b> from <b>{itinerary.legs[0].from.name}</b>
            </S.LegHeader>
          </S.LegBody>
        </S.CollapsedTop>
      )}
      {itinerary.legs.map((leg, k) =>
        leg.transitLeg ? (
          <TransitLeg
            interlineFollows={
              k < itinerary.legs.length - 1 &&
              itinerary.legs[k + 1].interlineWithPreviousLeg
            }
            key={k}
            leg={leg}
            LegIcon={LegIcon}
            timeOptions={timeOptions}
          />
        ) : leg.hailedCar ? (
          <TNCLeg
            leg={leg}
            LegIcon={LegIcon}
            key={k}
            timeOptions={timeOptions}
          />
        ) : (
          <AccessLeg
            config={config}
            key={k}
            leg={leg}
            LegIcon={LegIcon}
            timeOptions={timeOptions}
          />
        )
      )}
    </S.PrintableItinerary>
  );
}

PrintableItinerary.propTypes = {
  /** Used for additional styling with styled components for example. */
  className: PropTypes.string,
  /** Contains OTP configuration details. */
  config: coreUtils.types.configType.isRequired,
  /** Itinerary that the user has selected to view, contains multiple legs */
  itinerary: coreUtils.types.itineraryType.isRequired,
  /** A component class that is used to render icons for legs of an itinerary */
  LegIcon: PropTypes.elementType.isRequired,
  /** Contains the preferred format string for time display and a timezone offset */
  timeOptions: coreUtils.types.timeOptionsType
};

PrintableItinerary.defaultProps = {
  className: null,
  timeOptions: null
};

export default PrintableItinerary;

// Rename styled components for export
const Styled = S;
export { Styled };
