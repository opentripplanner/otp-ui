import {
  Config,
  Itinerary,
  LegIconComponent,
  LegHeadingConfig
} from "@opentripplanner/types";
import React, { ReactElement } from "react";
import { FormattedMessage } from "react-intl";

import { AccessibilityRating } from "@opentripplanner/itinerary-body";
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
  /** Itinerary that the user has selected to view, contains multiple legs. */
  itinerary: Itinerary;
  /** A component class that is used to render icons for legs of an itinerary. */
  LegIcon: LegIconComponent;
  /** Controls semantic heading levels for each leg section */
  legHeadings?: LegHeadingConfig;
}

function PrintableItinerary({
  className,
  config,
  itinerary,
  LegIcon,
  legHeadings = {
    titleHeading: "h2",
    transitLeg: "h3",
    tncLeg: "h3",
    accessLeg: "h3"
  }
}: Props): ReactElement {
  const gradationMap = config.accessibilityScore?.gradationMap;
  return (
    <S.PrintableItinerary className={className}>
      {itinerary.accessibilityScore && (
        <S.TripAccessibilityScoreWrapper>
          <AccessibilityRating
            isLeg={false}
            gradationMap={gradationMap}
            grayscale
            score={itinerary.accessibilityScore}
          />
        </S.TripAccessibilityScoreWrapper>
      )}

      {itinerary.legs.length > 0 && (
        <S.CollapsedTop>
          <S.LegBody>
            <S.LegHeader as={legHeadings.titleHeading || "div"}>
              <FormattedMessage
                defaultMessage={
                  defaultMessages["otpUi.PrintableItinerary.depart"]
                }
                description="Indicates where to depart from"
                id="otpUi.PrintableItinerary.depart"
                values={{
                  place: itinerary.legs[0].from.name,
                  strong: strongText
                }}
              />
            </S.LegHeader>
          </S.LegBody>
        </S.CollapsedTop>
      )}
      {itinerary.legs.map((leg, k) =>
        leg.transitLeg ? (
          <TransitLeg
            accessibilityScoreGradationMap={gradationMap}
            interlineFollows={
              k < itinerary.legs.length - 1 &&
              itinerary.legs[k + 1].interlineWithPreviousLeg
            }
            key={k}
            leg={leg}
            LegIcon={LegIcon}
            headingAs={legHeadings.transitLeg || "div"}
          />
        ) : leg.rideHailingEstimate ? (
          <TNCLeg
            accessibilityScoreGradationMap={gradationMap}
            key={k}
            leg={leg}
            LegIcon={LegIcon}
            headingAs={legHeadings.tncLeg || "div"}
          />
        ) : (
          <AccessLeg
            accessibilityScoreGradationMap={gradationMap}
            config={config}
            key={k}
            leg={leg}
            LegIcon={LegIcon}
            headingAs={legHeadings.accessLeg || "span"}
          />
        )
      )}
    </S.PrintableItinerary>
  );
}

export default PrintableItinerary;

// Rename styled components for export.
export { S as Styled };
