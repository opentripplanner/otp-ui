import PropTypes from "prop-types";

export const configType = PropTypes.shape({});
export const customIconsType = PropTypes.shape({});
export const stepsType = PropTypes.arrayOf(PropTypes.shape({}));
export const legType = PropTypes.shape({
  duration: PropTypes.number.isRequired,
  hailedCar: PropTypes.string,
  mode: PropTypes.string.isRequired,
  steps: stepsType.isRequired
});
export const itineraryType = PropTypes.shape({
  legs: PropTypes.arrayOf(legType).isRequired
});
export const timeOptionsType = PropTypes.shape({});
export const transitIndexStopWithRoutes = PropTypes.shape({
  /**
   * The stop code if the stop has one
   */
  code: PropTypes.string,
  /**
   * The distance from the user to the stop in meters
   */
  dist: PropTypes.number,
  lat: PropTypes.number,
  lon: PropTypes.number,
  name: PropTypes.string,
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      longName: PropTypes.string,
      shortName: PropTypes.string
    })
  )
});
