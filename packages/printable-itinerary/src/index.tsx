import { Config, Itinerary, LegIconComponent } from "@opentripplanner/types";
import React, { ReactElement } from "react";
import { FormattedMessage } from "react-intl";

import AccessLeg from "./access-leg";
import * as S from "./styled";
import TNCLeg from "./tnc-leg";
import TransitLeg from "./transit-leg";
import { defaultMessages, strongText } from "./util";

interface Props {
  /** Used for additional styling with styled components for example. */
  className?: string;
  /** Contains OTP configuration details. */
  config: Config;
  /** Itinerary that the user has selected to view, contains multiple legs */
  itinerary: Itinerary;
  /** A component class that is used to render icons for legs of an itinerary */
  LegIcon: LegIconComponent;
}

function PrintableItinerary({
  className,
  config,
  itinerary,
  LegIcon
}: Props): ReactElement {
  return (
    <S.PrintableItinerary className={className}>
      {itinerary.legs.length > 0 && (
        <S.CollapsedTop>
          <S.LegBody>
            <S.LegHeader>
              <FormattedMessage
                defaultMessage={defaultMessages["otpUi.printable.depart"]}
                description="Indicates where to depart from"
                id="otpUi.printable.depart"
                values={{
                  place: itinerary.legs[0].from.name,
                  strongText
                }}
              />
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
          />
        ) : leg.hailedCar ? (
          <TNCLeg leg={leg} LegIcon={LegIcon} key={k} />
        ) : (
          <AccessLeg config={config} key={k} leg={leg} LegIcon={LegIcon} />
        )
      )}
    </S.PrintableItinerary>
  );
}

export default PrintableItinerary;

// Rename styled components for export
export { S as Styled };
