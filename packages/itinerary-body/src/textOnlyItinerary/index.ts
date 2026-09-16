import coreUtils from "@opentripplanner/core-utils";
import { Itinerary, Leg } from "@opentripplanner/types";
import { useIntl } from "react-intl";
import { humanizeDistanceString } from "@opentripplanner/humanize-distance";
import { getSummaryMode } from "../defaults/access-leg-description";
import { vehicleType } from "../AccessLegBody/rented-vehicle-subheader";
import { getPlaceName } from "../util";
import { getFlexMessageValues } from "../TransitLegBody";

const {
  isTransitLeg,
  getLegRouteName,
  isFlex,
  isReservationRequired
} = coreUtils.itinerary;
const { toHoursMinutesSeconds, ensureAtLeastOneMinute } = coreUtils.time;

const convertLegToTextString = (
  leg: Leg,
  index: number,
  allLegs: Leg[],
  config: any
): string => {
  const intl = useIntl();
  const transitLeg = isTransitLeg(leg);
  const textStrings: any = [];

  const isLastLeg = index === allLegs.length - 1;
  const isFirstLeg = index === 0;

  const { units } = config;

  const { from, mode, rentedBike, to, duration } = leg;
  const { name: fromName, networks, vertexType } = from;
  const modeType = mode === "SCOOTER" ? "VEHICLERENTAL" : vertexType;

  const durationSeconds = ensureAtLeastOneMinute(duration);

  const isRental = leg.rentedVehicle || leg.rentedBike || leg.rentedCar;
  const company =
    isRental &&
    coreUtils.itinerary.getCompaniesLabelFromNetworks(
      networks || [],
      config?.companies
    );
  const vehicleName = isRental && leg.rentedCar && fromName ? fromName : "";

  const interline = !isLastLeg && allLegs[index + 1].interlineWithPreviousLeg;

  // Flex header
  if (isFlex(leg) && isReservationRequired(leg) && leg.pickupBookingInfo) {
    textStrings.push(
      intl.formatMessage(
        { id: "otpUi.ItineraryBody.flexPickupMessage" },
        { ...getFlexMessageValues(leg.pickupBookingInfo, intl) }
      )
    );
  }

  // Rental Micromobility Header
  if (isRental) {
    if (networks || rentedBike) {
      // Add company and vehicle labels.
      // Only show vehicle name for car rentals. For bikes and E-scooters, these
      // IDs/names tend to be less relevant (or entirely useless) in this context.
      textStrings.push(
        intl.formatMessage(
          { id: "otpUi.AccessLegBody.RentedVehicleSubheader.pickupRental" },
          {
            company,
            vehicleName,
            vehicleType: vehicleType(modeType, intl)
          }
        )
      );
    }
  }

  // TNC Header
  if (leg.rideHailingEstimate) {
    // TODO: Currently we don't have any APIs from Uber, so when we get access to that this will have to be rewritten
    textStrings.push("TNC leg");
  }

  // Access leg description
  if (isFirstLeg && !transitLeg) {
    textStrings.push(
      intl.formatMessage(
        { id: "otpUi.TextOnlyItinerary.departFrom" },
        { timeMillis: leg.startTime, place: leg.from.name }
      )
    );
  }

  // Transit leg description
  if (transitLeg) {
    const routeName =
      getLegRouteName(leg) ||
      // Idk why I'm having to do this, when it should be handled by the coreutils func >:(
      leg.routeLongName ||
      leg.routeShortName ||
      leg.route;

    textStrings.push(
      intl.formatMessage(
        { id: "otpUi.TextOnlyItinerary.transitDepartFrom" },
        {
          place: fromName,
          stopId: from.stopCode,
          hasStopId: !!from.stopCode,
          timeMillis: leg.startTime,
          routeName,
          hasHeadsign: !!leg.headsign,
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

    // Stay on board instruction
    if (interline) {
      textStrings.push(
        intl.formatMessage(
          { id: "otpUi.ItineraryBody.stayOnBoard" },
          {
            place: leg.to.name
          }
        )
      );
    }
    if (!interline && !isLastLeg) {
      textStrings.push(
        intl.formatMessage(
          { id: "otpUi.TextOnlyItinerary.transitArriveAt" },
          {
            timeMillis: leg.endTime,
            place: leg.to.name,
            hasStopId: !!leg.to.stopCode,
            stopId: leg.to.stopCode
          }
        )
      );
    }
  }
  if (!transitLeg) {
    // If the stops you're walking between are the same, it's a transfer
    if (to.stopId && from.stopId && to.stopId === from.stopId) {
      textStrings.push(
        intl.formatMessage(
          { id: "otpUi.AccessLegBody.transfer" },
          {
            duration: intl.formatMessage(
              {
                id: "otpUi.ItineraryBody.common.durationShort"
              },
              {
                approximatePrefix: false,
                ...toHoursMinutesSeconds(durationSeconds)
              }
            )
          }
        )
      );
    } else {
      textStrings.push(
        intl.formatMessage(
          { id: "otpUi.AccessLegBody.summaryAndDistance" },
          {
            distance: humanizeDistanceString(
              leg.distance,
              units === "metric",
              intl
            ),
            mode: getSummaryMode(leg, intl),
            place: getPlaceName(leg.to, [], intl)
          }
        )
      );
    }
  }
  // End micromobility rental
  if (isRental && !isLastLeg) {
    textStrings.push(
      intl.formatMessage(
        { id: "otpUi.AccessLegBody.RentedVehicleSubheader.dropoffRental" },
        {
          company,
          vehicleName,
          vehicleType: vehicleType(modeType, intl),
          dropoffLocation: leg.to.name
        }
      )
    );
  }
  // Arrive at destination
  if (isLastLeg) {
    textStrings.push(
      intl.formatMessage(
        { id: "otpUi.TextOnlyItinerary.arriveAt" },
        { timeMillis: leg.endTime, place: leg.to.name }
      )
    );
  }

  return textStrings.join("\n");
};

function textOnlyItineraryString(itinerary: Itinerary, config: any): string {
  const { legs } = itinerary;
  return (
    legs
      .map((l, i, a) => convertLegToTextString(l, i, a, config))
      // Create a linebreak between legs
      .join("\n\n")
  );
}

export default textOnlyItineraryString;
