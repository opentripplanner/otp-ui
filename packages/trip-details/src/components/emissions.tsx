import React, { ReactElement, ReactNode } from "react";
import { FormattedMessage, FormattedNumber } from "react-intl";
import { Itinerary } from "@opentripplanner/types";
import { Leaf } from "@styled-icons/fa-solid/Leaf";
import coreUtils from "@opentripplanner/core-utils";
import { boldText } from "../utils";
import TripDetail from "../trip-detail";
import { defaultMessages } from "../i18n/en-US.yml";
import { CO2ConfigType } from "../types";
import * as S from "../styled";

function CO2DescriptionLink(contents: ReactNode): ReactElement {
  return (
    <a
      href="https://www.itf-oecd.org/sites/default/files/life-cycle-assessment-calculations-2020.xlsx"
      rel="noopener noreferrer"
      target="_blank"
    >
      {contents}
    </a>
  );
}

export default function Emissions({
  itinerary,
  co2Config
}: {
  itinerary: Itinerary;
  co2Config: CO2ConfigType;
}): JSX.Element | null {
  // Calculate CO₂ if it's not provided by the itinerary
  const co2 =
    itinerary.co2 ||
    (co2Config?.enabled &&
      coreUtils.itinerary.calculateEmissions(
        itinerary,
        co2Config?.carbonIntensity,
        co2Config?.units
      ));

  if (co2 < 0 && !co2Config?.enabled) {
    return null;
  }

  const totalDistance = itinerary.legs.reduce(
    (total, leg) => total + leg.distance,
    0
  );

  return (
    <TripDetail
      icon={<Leaf size={17} />}
      summary={
        <S.CO2Summary>
          <FormattedMessage
            defaultMessage={defaultMessages["otpUi.TripDetails.co2"]}
            description="Text showing the quantity of CO₂ emitted by this trip."
            id="otpUi.TripDetails.co2"
            values={{
              co2: (
                <FormattedNumber
                  value={Math.round(co2)}
                  // eslint-disable-next-line react/style-prop-object
                  style="unit"
                  unit={co2Config?.units || "gram"}
                  unitDisplay="narrow"
                />
              ),
              strong: boldText
            }}
          />
        </S.CO2Summary>
      }
      description={
        <FormattedMessage
          defaultMessage={defaultMessages["otpUi.TripDetails.co2description"]}
          description="Text explaining how the CO₂ emissions are calculated."
          id="otpUi.TripDetails.co2description"
          values={{
            link: CO2DescriptionLink,
            totalDistance
          }}
        />
      }
    />
  );
}
