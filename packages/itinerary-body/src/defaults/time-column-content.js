import { formatTime } from "@opentripplanner/core-utils/lib/time";
import {
  legType,
  timeOptionsType
} from "@opentripplanner/core-utils/lib/types";
import PropTypes from "prop-types";

/**
 * This is the default component for displaying the time with the specified format
 * of the given leg in the time column of the ItineraryBody -> PlaceRow component.
 */
export default function TimeColumnContent({ isDestination, leg, timeOptions }) {
  const time = isDestination ? leg.endTime : leg.startTime;
  return time && formatTime(time, timeOptions);
}

TimeColumnContent.propTypes = {
  /** Whether this place row represents the destination */
  isDestination: PropTypes.bool.isRequired,
  /** Contains details about leg object that is being displayed */
  leg: legType.isRequired,
  /** Contains the preferred format string for time display and a timezone offset */
  timeOptions: timeOptionsType
};

TimeColumnContent.defaultProps = {
  timeOptions: null
};
