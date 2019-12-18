import { ReactPropTypeLocationNames } from "react";
import { isValidLatLng } from "./map";

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

export const LatlngPropType = createChainableTypeChecker((props, propName) => {
  // Source: https://reactjs.org/docs/typechecking-with-proptypes.html#react.proptypes
  if (!isValidLatLng(props[propName])) {
    return new Error(`${propName} needs to be a [lat, lng] array`);
  }
  return null;
});
