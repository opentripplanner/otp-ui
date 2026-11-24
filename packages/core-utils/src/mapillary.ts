export type MapillaryProvider = "GOOGLE" | "MAPILLARY";

/**
 * Helper method to generate bounding box from a location. Adding the WINDOW to the coordinate
 * creates a bounding box of approximately 2 meters around the coordinate, which is likely to
 * encompass any imagery available.
 * @param coord     The coordinate to convert to a bounding box
 * @returns         A bounding box 2 meters around the passed coordinate
 */
const generateBoundingBoxFromCoordinate = ({
  lat,
  lon
}: {
  lat: number;
  lon: number;
}) => {
  const WINDOW = 0.00011;
  const south = lat - WINDOW;
  const north = lat + WINDOW;
  const west = lon - WINDOW;
  const east = lon + WINDOW;
  return [west, south, east, north];
};

/**
 * Makes an api call (or generates) an id to be used to launch a popup for street imagery
 *
 * Although these methods are very similar, structuring it as an object allows us to
 * be more flexible in the future
 */
export const getImageIdForProvider = {
  GOOGLE: (coords: { lat: number; lon: number }): string => {
    return `${coords.lat},${coords.lon}`;
  },
  MAPILLARY: async (
    coords: {
      lat: number;
      lon: number;
    },
    mapillaryKey: string
  ): Promise<string | undefined> => {
    const bounds = generateBoundingBoxFromCoordinate(coords).join(",");
    const raw = await fetch(
      `https://graph.mapillary.com/images?fields=id&limit=1&access_token=${mapillaryKey}&bbox=${bounds}`
    );
    const json = await raw.json();
    if (json?.data?.length > 0) {
      return json.data[0].id;
    }
    return "";
  }
};

/**
 * Generates a URL which will display street imagery
 */
export const generateUrlForProvider = {
  GOOGLE: (id: string): string =>
    `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${id}`,
  MAPILLARY: (id: string): string =>
    `https://www.mapillary.com/embed?image_key=${id}&style=photo`
};
