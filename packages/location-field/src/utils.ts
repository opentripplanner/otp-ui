// Prettier doesn't understand type imports
// eslint-disable-next-line prettier/prettier
import type { Properties, Label } from "./types";


// A mapping of Pelias layers to display modes. The label generator will run the generator
// based on the layer of the feature. Adding a new method to this mapping will support
// more layer types with custom rendering.
const layerDisplayMap = {
  address: (properties: Properties): Label => {
    const {
      housenumber,
      locality,
      name,
      neighbourhood,
      region_a: state,
      region,
      street,
    } = properties;
    return {
      // if the housenumber is available, combining that with the street can
      // avoid duplicates which might be present in the name
      main: housenumber ? `${housenumber} ${street}` : name,
      secondary: [locality, neighbourhood, state || region].filter(item => !!item).join(", ")
    };
  },
  venue: (properties: Properties): Label => {
    const { region_a: state, neighbourhood, locality, name, street } = properties;
    return {
      main: name,
      secondary: [street, neighbourhood, locality, state]
        .filter(item => !!item)
        .join(", ")
    };
  },
  neighbourhood: (properties: Properties): Label => {
    const { name, county, locality, region_a: state } = properties;
    return {
      main: name,
      secondary: [county, locality, state].filter(item => !!item).join(", ")
    };
  }
};

/**
 * Given a GeoJSON property with a layer, this method will use the layerDisplayMap
 * to generate an appropriate title subtitle pair, or return the label if the layer is
 * unknown.
 */
export const generateLabel = (properties: Properties): Label => {
  const labelGenerator = layerDisplayMap[properties.layer];
  if (!labelGenerator) return { main: properties.label };

  return labelGenerator(properties);
};

/**
 * Generates a combined label from main and secondary for display in the main input field
 */
export const getCombinedLabel = (properties: Properties): string => {
  const { main, secondary } = generateLabel(properties);
  if (main && secondary) {
    return `${main}, ${secondary}`;
  }
  return properties?.label || "";
};
