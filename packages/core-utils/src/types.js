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
