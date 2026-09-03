import coreUtils from "@opentripplanner/core-utils";
import { Itinerary } from "@opentripplanner/types";
import { IntlShape } from "react-intl";
import { humanizeDistanceStringImperial } from "@opentripplanner/humanize-distance";
import { getSummaryMode } from "../defaults/access-leg-description";

const { isTransitLeg, getLegRouteName } = coreUtils.itinerary;
const { toHoursMinutesSeconds } = coreUtils.time;

const convertLegToTextString = (
  leg: any,
  intl: IntlShape,
  isFirstLeg: boolean,
  isLastLeg: boolean
): any => {
  const transitLeg = isTransitLeg(leg);
  const textStrings: any = [];

  if (isFirstLeg && !transitLeg) {
    textStrings.push(
      intl.formatMessage(
        { id: "otpUi.TextOnlyItinerary.departFrom" },
        { timeMillis: leg.startTime, place: leg.from.name }
      )
    );
  }

  if (transitLeg) {
    const routeName =
      getLegRouteName(leg) ||
      // Idk why I'm having to do this, when it should be handled by the coreutils func >:(
      leg.routeLongName ||
      leg.routeShortName ||
      leg.route;

    textStrings.push(
      // TODO: The stopCode needs to be conditional look at approxPrefix
      intl.formatMessage(
        { id: "otpUi.TextOnlyItinerary.transitDepartFrom" },
        {
          place: leg.from.name,
          stopId: leg.from.stop.code,
          timeMillis: leg.startTime,
          routeName,
          headsign: leg.headsign
        }
      )
    );
    textStrings.push(
      intl.formatMessage(
        { id: "otpUi.TransitLegBody.rideDurationAndStops" },
        {
          duration: intl.formatMessage(
            { id: "otpUi.ItineraryBody.common.durationShort" },
            {
              ...toHoursMinutesSeconds(leg.duration),
              approximatePrefix: undefined
            }
          ),
          numStops: (leg.intermediateStops?.length || 0) + 1
        }
      )
    );
    // TODO: The stopCode needs to be conditional look at approxPrefix
    textStrings.push(
      intl.formatMessage(
        { id: "otpUi.TextOnlyItinerary.transitArriveAt" },
        {
          timeMillis: leg.startTime,
          place: leg.to.name,
          stopId: leg.to.stop.code
        }
      )
    );
  }
  if (!transitLeg) {
    textStrings.push(
      intl.formatMessage(
        { id: "otpUi.AccessLegBody.summaryAndDistance" },
        {
          distance: humanizeDistanceStringImperial(leg.distance, false, intl),
          mode: getSummaryMode(leg, intl),
          place: leg.to.name
        }
      )
    );
  }
  if (isLastLeg) {
    textStrings.push(
      intl.formatMessage(
        { id: "otpUi.TextOnlyItinerary.arriveAt" },
        { timeMillis: leg.startTime, place: leg.to.name }
      )
    );
  }

  return textStrings;
};

function textOnlyItineraryString(intl: IntlShape, itinerary: Itinerary): any {
  const { legs } = itinerary;

  return legs.map((leg, i, array) => {
    const lastLeg = i === array.length - 1;
    const firstLeg = i === 0;
    return convertLegToTextString(leg, intl, firstLeg, lastLeg).map(
      (string: string) => `
            ${string}
        `
    );
  });
}

export default textOnlyItineraryString;
