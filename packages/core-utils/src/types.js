import PropTypes from "prop-types";
import { ReactPropTypeLocationNames } from "react";
import { isValidLatLng } from "./map";

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

/**
 * Utility function to help create chained validators
 * per https://www.ian-thomas.net/custom-proptype-validation-with-react/
 * @param {*} validator The validator to use.
 */
export function createChainableTypeChecker(validator) {
  function checkType(isRequired, props, propName, componentName, location) {
    componentName = componentName || "ANONYMOUS";
    if (props[propName] == null) {
      if (isRequired) {
        const locationName = ReactPropTypeLocationNames[location];
        return new Error(
          `Required '${locationName}/${propName}' was not specified in '${componentName}'.`
        );
      }
      return null;
    }
    return validator(props, propName, componentName, location);
  }

  const chainedCheckType = checkType.bind(null, false);
  chainedCheckType.isRequired = checkType.bind(null, true);

  return chainedCheckType;
}

export const latlngType = createChainableTypeChecker((props, propName) => {
  // Source: https://reactjs.org/docs/typechecking-with-proptypes.html#react.proptypes
  if (!isValidLatLng(props[propName])) {
    return new Error(`${propName} needs to be a [lat, lng] array`);
  }
  return null;
});
