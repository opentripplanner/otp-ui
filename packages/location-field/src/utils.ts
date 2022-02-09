// Prettier doesn't understand type imports
// eslint-disable-next-line prettier/prettier
import type { Properties, Label } from "./types";
/**
 * Helper function to return either zip code or neighborhood, depending on
 * what is present.
 *
 * Neighborhood is spelled British and zip code is spelled postal code as
 * Pelias seems to adopt British address standards.
 */
const zipOrNeighborhood = ({
  neighbourhood,
  postalcode
}: {
  neighbourhood: string;
  postalcode: string;
}) => neighbourhood || postalcode || "";

// A mapping of Pelias layers to display modes. The label generator will run the generator
// based on the layer of the feature. Adding a new method to this mapping will support
// more layer types with custom rendering.
const layerDisplayMap = {
  address: (properties: Properties): Label => {
    const { locality, name, postalcode, region_a: state } = properties;
    return {
      main: name,
      secondary: [locality, postalcode, state].filter(item => !!item).join(", ")
    };
  },
  venue: (properties: Properties): Label => {
    const { name, street, locality, region_a: state } = properties;
    return {
      main: name,
      secondary: [street, zipOrNeighborhood(properties), locality, state]
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
