/**
 * Helper function to return either zip code or neighborhood, depending on
 * what is present.
 */
const zipOrNeighborhood = ({ neighbourhood, postalcode }) =>
  neighbourhood || postalcode || "";

// A mapping of Pelias layers to display modes. The label generator will run the generator
// based on the layer of the feature. Adding a new method to this mapping will support
// more layer types.
const layerDisplayMap = {
  address: properties => {
    const { locality, name, postalcode } = properties;
    return {
      main: name,
      secondary: [locality, postalcode].filter(item => !!item).join(", ")
    };
  },
  venue: properties => {
    const { name, street } = properties;
    return {
      main: name,
      secondary: [street, zipOrNeighborhood(properties)]
        .filter(item => !!item)
        .join(", ")
    };
  }
};

/**
 * Given a GeoJSON property with a layer, this method will use the layerDisplayMap
 * to generate an appropriate title subtitle pair, or return the label if the layer is
 * unknown.
 */
// TODO: Remove this exception once more utils are added
// eslint-disable-next-line import/prefer-default-export
export const generateLabel = properties => {
  const labelGenerator = layerDisplayMap[properties.layer];
  if (!labelGenerator) return { main: properties.label };

  return labelGenerator(properties);
};
