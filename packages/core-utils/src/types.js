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

export const modeOptionType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  selected: PropTypes.bool,
  showTitle: PropTypes.bool,
  text: PropTypes.node.isRequired,
  title: PropTypes.string
});

export const modeSelectorOptionsType = PropTypes.shape({
  primary: modeOptionType,
  secondary: PropTypes.arrayOf(modeOptionType),
  tertiary: PropTypes.arrayOf(modeOptionType)
});

export const queryType = PropTypes.shape({
  from: PropTypes.string,
  to: PropTypes.string,
  date: PropTypes.string,
  time: PropTypes.string,
  departArrive: PropTypes.string,
  startTime: PropTypes.string,
  endTime: PropTypes.string,
  mode: PropTypes.string,
  showIntermediateStops: PropTypes.bool,
  maxWalkDistance: PropTypes.number,
  maxBikeDistance: PropTypes.number,
  optimize: PropTypes.string,
  optimizeBike: PropTypes.string,
  maxWalkTime: PropTypes.number,
  walkSpeed: PropTypes.number,
  maxBikeTime: PropTypes.number,
  bikeSpeed: PropTypes.number,
  maxEScooterDistance: PropTypes.number,
  watts: PropTypes.number,
  ignoreRealtimeUpdates: PropTypes.bool,
  companies: PropTypes.string,
  wheelchair: PropTypes.bool
});

export const configuredModeType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.shape({
    mode: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    company: PropTypes.string
  })
]);

export const configuredModesType = PropTypes.shape({
  transitModes: PropTypes.arrayOf(configuredModeType),
  accessModes: PropTypes.arrayOf(configuredModeType),
  exclusiveModes: PropTypes.arrayOf(configuredModeType),
  bicycleModes: PropTypes.arrayOf(configuredModeType),
  micromobilityModes: PropTypes.arrayOf(configuredModeType)
});

export const configuredCompanyType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  modes: PropTypes.string.isRequired
});
