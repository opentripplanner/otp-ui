import coreUtils from "@opentripplanner/core-utils";
import PropTypes from "prop-types";

/**
 * This is the default component for displaying the time with the specified format
 * of the given leg in the time column of the ItineraryBody -> PlaceRow component.
 */
export default function TimeColumnContent({ isDestination, leg, timeOptions }) {
  const time = isDestination ? leg.endTime : leg.startTime;
  return time && coreUtils.time.formatTime(time, timeOptions);
}

TimeColumnContent.propTypes = {
  /** Whether this place row represents the destination */
  isDestination: PropTypes.bool.isRequired,
  /** Contains details about leg object that is being displayed */
  leg: coreUtils.types.legType.isRequired,
  /** Contains the preferred format string for time display and a timezone offset */
  timeOptions: coreUtils.types.timeOptionsType
};

TimeColumnContent.defaultProps = {
  timeOptions: null
};
